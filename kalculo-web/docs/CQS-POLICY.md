# CQS & Use Case Separation Policy

**Document Purpose**: Define strict Command-Query Segregation (CQS) enforcement rules for Kalculo frontend.  
**Applies to**: All Epic 1+ implementation stories  
**Enforcement**: Code review, architecture guardrails

---

## Overview

**Command-Query Segregation (CQS)** is a strict architectural rule requiring that operations be categorized as either **Commands** (mutations) or **Queries** (reads), never both.

This policy ensures:
- ✅ Clear intent (readers know if operation mutates state)
- ✅ Predictable side effects (no hidden mutations)
- ✅ Testability (deterministic queries, isolated commands)
- ✅ Composability (queries can be chained safely)

---

## Definitions

### Query

A **Query** is a read-only operation that returns data without modifying state.

**Characteristics:**
- No side effects (deterministic, idempotent)
- Always returns data (never void)
- Can be called multiple times with same result
- Safe to cache or parallelize
- Examples: `GetDailyNutritionSummaryQuery`, `GetMenuHistoryQuery`

**Implementation Pattern:**
```typescript
export type GetDailyNutritionSummaryQuery = 
  () => Promise<DailyNutritionSummary>

export const buildGetDailyNutritionSummaryQuery =
  (queryPort: DailyNutritionSummaryQueryPort): GetDailyNutritionSummaryQuery =>
  async () => {
    const summary = await queryPort.getCurrentDailySummary()
    assertValidSummary(summary)
    return summary
  }
```

### Command

A **Command** is a write operation that mutates state.

**Characteristics:**
- Has side effects (modifies state/storage)
- Returns minimal output (void or simple success indicator)
- May fail with domain exceptions
- Not idempotent (calling twice has different effect)
- Examples: `LockMenuCommand`, `CreateChildProfileCommand`

**Implementation Pattern:**
```typescript
export type LockMenuCommand = (menuId: string) => Promise<void>

export const buildLockMenuCommand =
  (lockingPort: MenuLockingCommandPort): LockMenuCommand =>
  async (menuId: string) => {
    const menu = await lockingPort.getMenu(menuId)
    if (!menu.isCompliant) {
      throw new NonCompliantMenuError('Cannot lock non-compliant menu')
    }
    await lockingPort.persistLockedMenu(menu)
  }
```

---

## CQS Rules

### Rule 1: Strict Separation

**A use case must be either a Query OR a Command, never both.**

| ❌ Violates CQS | ✅ Correct CQS |
|---|---|
| `async function updateMenuAndGetResult()` | `UpdateMenuCommand` (mutation only) + `GetMenuQuery` (read only) |
| `async function deleteUserAndReturnCount()` | `DeleteUserCommand` (void) for mutation + `GetUserCountQuery` for reading |

### Rule 2: Commands Return Minimal Output

**Commands must return `void` or a simple success indicator, never domain data.**

| ❌ Violates | ✅ Correct |
|---|---|
| `LockMenuCommand` returns updated `Menu` object | `LockMenuCommand` returns `void`; use `GetMenuQuery` to fetch |
| `CreateChildCommand` returns full `Child` entity | `CreateChildCommand` returns `{ id: string }`; use `GetChildQuery` to fetch details |

**Rationale**: Prevents hidden queries within commands, keeps intent clear.

### Rule 3: Queries Never Mutate

**Queries must have zero side effects; they are read-only.**

| ❌ Violates | ✅ Correct |
|---|---|
| `GetMenuQuery` increments view counter | Track views in separate `RecordMenuViewCommand` |
| `GetChildQuery` logs access and updates timestamp | Use separate `LogChildAccessCommand` for audit trail |

### Rule 4: No Use-Case-to-Use-Case Direct Calls

**Use cases must not call other use cases directly.**

| ❌ Violates | ✅ Correct |
|---|---|
| `LockMenuCommand` calls `ValidateMenuQuery` | Port validates in adapter; domain enforces via invariants |
| `CreateMenuCommand` calls `NotifyParentCommand` | Emit domain event; separate orchestration handles event → command |

**Exception**: Application-level orchestration may coordinate multiple use cases (see Orchestration Pattern below).

### Rule 5: Idempotency Handling

**Queries are always idempotent; Commands may or may not be. Document behavior.**

```typescript
// ✅ Query: Always idempotent
export const buildGetMenuQuery = (port): GetMenuQuery =>
  async (menuId) => {
    return port.getMenu(menuId)
    // Calling 100 times = same result
  }

// ✅ Command: Document behavior
export const buildLockMenuCommand = (port): LockMenuCommand =>
  async (menuId) => {
    const menu = await port.getMenu(menuId)
    if (menu.isLocked) {
      throw new MenuAlreadyLockedError() // Idempotent: caller prevents duplicates
    }
    await port.persistLockedMenu(menu)
  }

// OR: Idempotent by design
export const buildToggleLockCommand = (port): ToggleLockCommand =>
  async (menuId) => {
    const menu = await port.getMenu(menuId)
    menu.isLocked = !menu.isLocked
    await port.persistMenu(menu) // Safe to call multiple times
  }
```

---

## Implementation Examples

### Example 1: Nutrition Summary (Query)

```typescript
// domain/DailyNutritionSummary.ts
export interface DailyNutritionSummary {
  childFirstName: string
  protocol: string
  caloriesKcal: number
  proteinGrams: number
  carbsGrams: number
  fatsGrams: number
}

// application/ports/DailyNutritionSummaryQueryPort.ts
export interface DailyNutritionSummaryQueryPort {
  getCurrentDailySummary(): Promise<DailyNutritionSummary>
}

// application/queries/getDailyNutritionSummaryQuery.ts
export type GetDailyNutritionSummaryQuery = 
  () => Promise<DailyNutritionSummary>

export const buildGetDailyNutritionSummaryQuery =
  (queryPort: DailyNutritionSummaryQueryPort): GetDailyNutritionSummaryQuery =>
  async () => {
    const summary = await queryPort.getCurrentDailySummary()
    assertValidSummary(summary) // Domain-level validation
    return summary
  }

// infrastructure/in-memory/InMemoryDailyNutritionSummaryQueryAdapter.ts
export class InMemoryDailyNutritionSummaryQueryAdapter 
  implements DailyNutritionSummaryQueryPort {
  async getCurrentDailySummary(): Promise<DailyNutritionSummary> {
    return {
      childFirstName: 'Alex',
      protocol: 'Classique',
      caloriesKcal: 1650,
      proteinGrams: 78,
      carbsGrams: 180,
      fatsGrams: 62,
    }
  }
}

// Test
describe('GetDailyNutritionSummaryQuery', () => {
  it('returns deterministic summary', async () => {
    const query = buildGetDailyNutritionSummaryQuery(stubPort)
    const result = await query()
    expect(result).toEqual({ /* ... */ })
  })
})
```

### Example 2: Lock Menu (Command)

```typescript
// domain/Menu.ts
export interface Menu {
  id: string
  macros: Macro
  isLocked: boolean
}

export const assertMenuCompliant = (menu: Menu): void => {
  if (!isCompliant(menu.macros)) {
    throw new NonCompliantMenuError('Menu macros exceed limits')
  }
}

// application/ports/MenuLockingCommandPort.ts
export interface MenuLockingCommandPort {
  getMenu(menuId: string): Promise<Menu>
  persistLockedMenu(menu: Menu): Promise<void>
}

// application/commands/lockMenuCommand.ts
export type LockMenuCommand = (menuId: string) => Promise<void>

export const buildLockMenuCommand =
  (port: MenuLockingCommandPort): LockMenuCommand =>
  async (menuId: string) => {
    const menu = await port.getMenu(menuId)
    assertMenuCompliant(menu) // Domain invariant
    
    if (menu.isLocked) {
      throw new MenuAlreadyLockedError('Menu is already locked')
    }
    
    menu.isLocked = true
    await port.persistLockedMenu(menu)
    // ✅ Returns void; no data returned
  }

// infrastructure/api/ApiMenuLockingCommandAdapter.ts
export class ApiMenuLockingCommandAdapter implements MenuLockingCommandPort {
  async getMenu(menuId: string): Promise<Menu> {
    const response = await fetch(`/api/menus/${menuId}`)
    return parseMenu(await response.json())
  }
  
  async persistLockedMenu(menu: Menu): Promise<void> {
    await fetch(`/api/menus/${menu.id}`, {
      method: 'PUT',
      body: JSON.stringify({ isLocked: true }),
    })
  }
}

// Test
describe('LockMenuCommand', () => {
  it('locks a compliant menu', async () => {
    const port: MenuLockingCommandPort = {
      async getMenu() {
        return { id: '1', macros: validMacros, isLocked: false }
      },
      async persistLockedMenu(menu) {
        expect(menu.isLocked).toBe(true)
      },
    }
    
    const command = buildLockMenuCommand(port)
    await command('1')
  })

  it('throws error if menu is non-compliant', async () => {
    const command = buildLockMenuCommand(portWithNonCompliantMenu)
    await expect(command('1')).rejects.toThrow(NonCompliantMenuError)
  })
})
```

---

## Orchestration Pattern

When multiple use cases need coordination, use **Application Orchestration** at a higher level:

```typescript
// ❌ BAD: Use case calls use case directly
export const buildLockAndNotifyCommand = 
  (lockCmd, notifyCmd) => 
  async (menuId) => {
    await lockCmd(menuId)           // Command 1
    await notifyCmd(menuId)         // Command 2 - violates CQS
  }

// ✅ GOOD: Orchestration layer coordinates
export const orchestrateLockAndNotify = 
  (
    lockMenuCommand: LockMenuCommand,
    notifyParentCommand: NotifyParentCommand,
  ) => 
  async (menuId: string): Promise<void> => {
    // Orchestration layer coordinates without violating CQS
    await lockMenuCommand(menuId)
    await notifyParentCommand(menuId)
  }

// ✅ EVEN BETTER: Use domain events for loose coupling
export const buildLockMenuCommand =
  (port: MenuLockingCommandPort): LockMenuCommand =>
  async (menuId: string) => {
    const menu = await port.getMenu(menuId)
    menu.isLocked = true
    await port.persistLockedMenu(menu)
    
    // Emit event; orchestration or event handler processes it
    eventBus.emit('menuLocked', { menuId })
  }

// Somewhere else: event listener
eventBus.on('menuLocked', ({ menuId }) => {
  notifyParentCommand(menuId)
})
```

---

## Testing CQS Compliance

### Query Tests: Verify Idempotency

```typescript
it('query returns same result on repeated calls', async () => {
  const query = buildGetMenuQuery(port)
  
  const result1 = await query('menu-1')
  const result2 = await query('menu-1')
  
  expect(result1).toEqual(result2)
})
```

### Command Tests: Verify No Data Return

```typescript
it('command returns void', async () => {
  const command = buildLockMenuCommand(port)
  const result = await command('menu-1')
  
  expect(result).toBeUndefined() // ✅ Void return
})
```

### Orchestration Tests: Verify Coordination

```typescript
it('orchestration calls both commands in order', async () => {
  const lockCalls: string[] = []
  const notifyCalls: string[] = []
  
  const mockLock: LockMenuCommand = async (id) => lockCalls.push(id)
  const mockNotify: NotifyParentCommand = async (id) => notifyCalls.push(id)
  
  const orchestration = orchestrateLockAndNotify(mockLock, mockNotify)
  await orchestration('menu-1')
  
  expect(lockCalls).toEqual(['menu-1'])
  expect(notifyCalls).toEqual(['menu-1'])
})
```

---

## CQS Violations Checklist

Use this to catch violations during code review:

- [ ] Use case name clearly indicates Query or Command?
- [ ] Command returns `void` or minimal success indicator (not domain data)?
- [ ] Query never modifies state or has observable side effects?
- [ ] No direct use-case-to-use-case calls (orchestration only)?
- [ ] Tests verify queries are idempotent?
- [ ] Tests verify commands don't leak data?

---

## References

- [Greg Young: CQRS](https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf)
- [Martin Fowler: CQS](https://martinfowler.com/bliki/CommandQuerySeparation.html)
- [Kalculo Architecture Guardrails](./ARCHITECTURE.md)
