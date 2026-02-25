# Kalculo Frontend - Architecture Guardrails

This document establishes the architectural baseline and enforcement rules for the Kalculo frontend. These constraints are binding for all implementation stories to prevent architectural drift and maintain long-term maintainability.

**Document Status**: Initial bootstrap baseline (Epic 1, Story 1.1)  
**Last Updated**: 2026-02-25  
**Owner**: Development Team

---

## Architectural Foundation

Kalculo frontend is built on **Domain-Driven Design (DDD) + Clean/Hexagonal Architecture** with strict adherence to SOLID principles and Command-Query Segregation (CQS).

### Design Methodology

- **Domain-Driven Design (DDD)**
  - Strategic DDD: Bounded contexts at module level (e.g., Nutrition, Sharing, Audit)
  - Tactical DDD: Entities, Value Objects, Aggregates for business logic
  - Anti-corruption layers at module boundaries

- **Clean/Hexagonal Architecture**
  - Clear dependency direction: UI → Application → Domain ← Adapters
  - No outbound dependencies from domain to framework or infrastructure
  - Ports define contracts; adapters implement them

- **SOLID Principles**
  - Single Responsibility: One reason to change per class/module
  - Open/Closed: Extend behavior through ports, not modification
  - Liskov Substitution: Adapters must fulfill port contracts transparently
  - Interface Segregation: Ports are focused and client-specific
  - Dependency Inversion: Depend on abstractions (ports), not concrete implementations

### Command-Query Segregation (CQS)

All use cases are strictly separated into **Commands** (write/mutation) and **Queries** (read-only):

| Command | Query |
|---------|-------|
| Mutates state | Returns data only |
| Enforces domain invariants | Never changes state |
| Returns minimal output (success/void) | Returns domain objects |
| Use case: `LockMenuCommand` | Use case: `GetDailyNutritionSummaryQuery` |

**Rule**: A use case must never call another use case directly. Cross-use-case coordination happens through application orchestration or domain events.

---

## Layering Rules

### Dependency Flow

```
Presentation (UI)
    ↓ imports
Application (Use Cases)
    ↓ imports
Domain (Entities, Business Logic)
    ↑ implements
Infrastructure (Adapters, Ports)
```

**Critical rule**: Domain never imports Application or Infrastructure; it only defines interfaces (ports) that adapters implement.

### Layer Responsibilities

#### 1. Domain (`src/modules/<domain>/domain/`)

**What belongs here:**
- Entities (e.g., `Menu`, `Macro`, `Child`)
- Value Objects (e.g., `MacroTotals`, `DateRange`)
- Aggregates (e.g., `MenuAggregate` containing child menus and macros)
- Business rules and invariants (e.g., "a menu cannot be locked if macros exceed limits")
- Domain exceptions (e.g., `NonCompliantMenuError`)

**What does NOT belong:**
- Database queries or framework-specific code
- HTTP clients or external API calls
- Framework decorators or annotations
- Use case orchestration or control flow

**Example**:
```typescript
// domain/Macro.ts
export interface Macro {
  caloriesKcal: number
  proteinGrams: number
  carbsGrams: number
  fatsGrams: number
}

export const assertValidMacro = (macro: Macro): void => {
  if (macro.caloriesKcal < 0 || macro.proteinGrams < 0) {
    throw new Error('Macro values must be non-negative')
  }
}
```

#### 2. Application (`src/modules/<domain>/application/`)

**What belongs here:**
- Use case implementations (Queries and Commands)
- Port definitions (interfaces) that adapters must implement
- Application-level orchestration if needed

**What does NOT belong:**
- Domain logic or business rules (belongs in Domain)
- Adapter implementations (belongs in Infrastructure)
- React components or UI logic (belongs in Presentation)

**Example**:
```typescript
// application/queries/getDailyNutritionSummaryQuery.ts
export const buildGetDailyNutritionSummaryQuery =
  (queryPort: DailyNutritionSummaryQueryPort): GetDailyNutritionSummaryQuery =>
  async () => {
    const summary = await queryPort.getCurrentDailySummary()
    assertValidSummary(summary) // Domain validation
    return summary
  }
```

#### 3. Infrastructure (`src/modules/<domain>/infrastructure/`)

**What belongs here:**
- Adapter implementations (e.g., `InMemoryDailyNutritionSummaryQueryAdapter`)
- Framework-specific code (API clients, storage adapters)
- External integrations (third-party libraries, APIs)
- Concrete implementations of ports

**What does NOT belong:**
- Use case logic (belongs in Application)
- Domain business rules (belongs in Domain)
- UI components or React hooks (belongs in Presentation)

**Example**:
```typescript
// infrastructure/in-memory/InMemoryDailyNutritionSummaryQueryAdapter.ts
export class InMemoryDailyNutritionSummaryQueryAdapter
  implements DailyNutritionSummaryQueryPort {
  async getCurrentDailySummary(): Promise<DailyNutritionSummary> {
    return { childFirstName: 'Alex', /* ... */ }
  }
}
```

#### 4. Presentation (`src/` + React components)

**What belongs here:**
- React components and hooks
- UI state management (use context or state management)
- Event handling and user interactions
- Calls to use cases via dependency injection

**What does NOT belong:**
- Business logic (belongs in Domain)
- Infrastructure details (belongs in Infrastructure)
- Direct API calls (belongs in Infrastructure adapters)

**Example**:
```typescript
// React component using a Query use case
function NutritionSummary() {
  const useCases = useUseCases()
  const [summary, setSummary] = useState<DailyNutritionSummary | null>(null)

  useEffect(() => {
    useCases.nutrition.getDailyNutritionSummaryQuery()
      .then(setSummary)
  }, [useCases])

  return <div>{summary?.childFirstName}</div>
}
```

---

## Naming Conventions

### Module-Level Organization

```
src/modules/
├── nutrition/                   # Bounded context: Nutrition tracking
│   ├── domain/                  # Business logic
│   ├── application/             # Use cases and ports
│   └── infrastructure/          # Adapters
├── sharing/                     # Bounded context: Menu sharing
│   ├── domain/
│   ├── application/
│   └── infrastructure/
└── audit/                       # Bounded context: Event audit trail
    ├── domain/
    ├── application/
    └── infrastructure/
```

### Naming Rules

| Element | Pattern | Example |
|---------|---------|---------|
| Use case function | `build<Domain><Type>Query\|Command` | `buildGetDailyNutritionSummaryQuery` |
| Port interface | `<Domain><Role>Port` | `DailyNutritionSummaryQueryPort` |
| Adapter class | `<Source><Domain><Role>Adapter` | `InMemoryDailyNutritionSummaryQueryAdapter`, `ApiMenuLockingCommandAdapter` |
| Domain entity/VO | `<Noun>` (PascalCase) | `Menu`, `Macro`, `MacroTotals` |
| Domain error | `<Situation>Error` | `NonCompliantMenuError`, `InvalidMacroError` |
| Aggregate | `<Entity>Aggregate` | `MenuAggregate` |

**Anti-patterns to avoid:**
- ❌ `Service`, `Util`, `Helper`, `Manager` (too generic)
- ❌ `MenuHandler`, `DataProcessor` (unclear intent)
- ❌ `get_menu()` (Python-style naming; use camelCase)
- ❌ `Utils.ts`, `Common.ts` (generic catch-all files)

---

## Boundary Validation

### Rule: All External Data is Untrusted

Every boundary—API responses, user input, storage retrieval—must be validated before entering the domain:

```typescript
// ❌ Bad: Direct domain object from API
const menu = await apiPort.getMenu()
useCase.lockMenu(menu) // Domain trusts unknown data structure

// ✅ Good: Validate at boundary
const untypedResponse = await apiPort.getMenu()
const menu = parseAndValidateMenu(untypedResponse) // Parse unknown, validate, then type
useCase.lockMenu(menu) // Domain receives validated object
```

### Validation Approach

1. **Parse**: Convert unknown data to known structure (use `zod` or similar)
2. **Validate**: Check business invariants and constraints
3. **Transform**: Map to domain types if needed
4. **Pass to Domain**: Domain receives pre-validated object

**Example with Zod**:
```typescript
import { z } from 'zod'

const MenuSchema = z.object({
  id: z.string().min(1),
  macros: z.object({
    caloriesKcal: z.number().min(0),
    proteinGrams: z.number().min(0),
  }),
})

export const parseMenuFromApi = (data: unknown): Menu => {
  const parsed = MenuSchema.parse(data)
  return {
    id: parsed.id,
    macros: parsed.macros,
  }
}
```

---

## Adapters & Ports Strategy

### Port Definition

A **Port** is a TypeScript interface describing what behavior an adapter must provide:

```typescript
// application/ports/DailyNutritionSummaryQueryPort.ts
export interface DailyNutritionSummaryQueryPort {
  getCurrentDailySummary(): Promise<DailyNutritionSummary>
}
```

### Adapter Implementation

An **Adapter** is a concrete implementation fulfilling the port contract:

```typescript
// infrastructure/in-memory/InMemoryDailyNutritionSummaryQueryAdapter.ts
export class InMemoryDailyNutritionSummaryQueryAdapter 
  implements DailyNutritionSummaryQueryPort {
  async getCurrentDailySummary(): Promise<DailyNutritionSummary> {
    // Return in-memory data
  }
}

// infrastructure/api/ApiDailyNutritionSummaryQueryAdapter.ts
export class ApiDailyNutritionSummaryQueryAdapter 
  implements DailyNutritionSummaryQueryPort {
  async getCurrentDailySummary(): Promise<DailyNutritionSummary> {
    // Fetch from real API
  }
}
```

### Switching Adapters via DI

The **Dependency Injection Container** determines which adapter to use at runtime:

```typescript
// app/di/buildDiContainer.ts
export const buildDiContainer = () => {
  const dataSource = getDataSourceFromEnv() // 'inmemory' or 'api'
  
  const nutritionQueryPort = dataSource === 'inmemory'
    ? new InMemoryDailyNutritionSummaryQueryAdapter()
    : new ApiDailyNutritionSummaryQueryAdapter()

  const getDailyNutritionSummaryQuery = 
    buildGetDailyNutritionSummaryQuery(nutritionQueryPort)

  return {
    useCases: {
      nutrition: {
        getDailyNutritionSummaryQuery,
      },
    },
  }
}
```

**Benefit**: No changes to UI or domain logic; adapter swapping is transparent.

---

## Testing Strategy

### TDD Mandatory

**Red-Green-Refactor Cycle**:

1. **Red**: Write failing test for desired behavior
2. **Green**: Write minimal code to pass the test
3. **Refactor**: Improve code structure while keeping test green

### Test Organization

```
src/modules/nutrition/
├── domain/
│   └── Macro.test.ts              # Unit tests for domain logic
├── application/
│   └── queries/
│       └── getDailyNutritionSummaryQuery.test.ts  # Use case tests
└── infrastructure/
    └── in-memory/
        └── InMemoryAdapter.test.ts  # Adapter contract tests
```

### Test Types

| Type | Scope | Example |
|------|-------|---------|
| **Unit** | Single domain object or function | `assertValidMacro()` throws on negative values |
| **Use case** | Full use case with mock port | `getDailyNutritionSummaryQuery` validates result before returning |
| **Integration** | Adapter + port contract | `InMemoryAdapter` returns data matching port interface |
| **E2E** | Full flow through UI (rarely) | User loads page → Sees macro summary (integration test level) |

### Prefer Stubs Over Mocks

- **Stubs**: Fixed, deterministic responses (preferred for in-memory and test doubles)
- **Mocks**: Spy on call behavior and verify interactions (use sparingly, only for third-party boundaries)

```typescript
// ✅ Good: Stub port for deterministic testing
const stubPort: DailyNutritionSummaryQueryPort = {
  async getCurrentDailySummary() {
    return { childFirstName: 'Alex', /* ... */ }
  },
}

// ❌ Avoid unless absolutely necessary
const mockPort = vi.fn()
mockPort.getCurrentDailySummary = vi.fn().mockResolvedValue(/* ... */)
```

### Acceptance-Oriented Tests

Tests should be derived from Gherkin scenarios in story acceptance criteria, not 1:1 implementation coupled:

```gherkin
# Story AC: Nutrition summary shows current macros
Given a parent viewing the dashboard
When the nutrition summary loads
Then child name, protocol, and macro totals are displayed
```

```typescript
// ✅ Good: Test driven by AC, not implementation detail
it('returns deterministic in-memory summary through the application seam', async () => {
  const getDailyNutritionSummaryQuery = 
    buildGetDailyNutritionSummaryQuery(stubPort)
  
  const result = await getDailyNutritionSummaryQuery()
  
  expect(result).toEqual({
    childFirstName: 'Alex',
    protocol: 'Classique',
    caloriesKcal: 1650,
    proteinGrams: 78,
    carbsGrams: 180,
    fatsGrams: 62,
  })
})
```

---

## Anti-Patterns & Forbidden Practices

| ❌ Anti-Pattern | ✅ Correct Approach | Reason |
|-----------------|-------------------|--------|
| Domain imports Infrastructure | Domain only defines ports; Infrastructure implements | Keeps domain independent |
| Generic `Service` or `Util` classes | Use-case functions with clear names | Intention-revealing code |
| Direct API calls in components | Use cases injected via DI | Separates concerns; testable |
| Business logic in React components | Move to domain; use via use case | Reusable, testable logic |
| Mocking internal domains (except boundaries) | Use stubs or test data | Reduces test fragility |
| Use-case-to-use-case calls | Orchestrate at application layer or via events | Maintains composition |
| Skipping input validation at boundaries | Validate all external data | Prevents invalid state |
| Generic catch-all test files | Collocate tests with implementation | Discoverable, clear ownership |

---

## Evolutionary Architecture

### Future-Proofing

The Kalculo frontend is structured to evolve without rewriting core layers:

1. **Adapter Swapping**: Switch in-memory to API without changing domain or use cases
2. **Bounded Context Addition**: Add new modules (Sharing, Audit) without disturbing existing ones
3. **Migration Path**: Move logic from one layer to another without breaking contracts

### Example: Backend Integration

When real backend is ready:

1. Implement `ApiDailyNutritionSummaryQueryAdapter` (infrastructure)
2. Update DI container to prefer API adapter
3. No changes needed to domain, use cases, or UI logic
4. Gradually retire in-memory adapters as API coverage increases

---

## Enforcement & Review

### Checklist for New Stories

- [ ] All domain entities define clear invariants and validation
- [ ] All use cases are clearly named Commands or Queries
- [ ] All external data passes boundary validation (zod or similar)
- [ ] Tests are written first (TDD) and derived from acceptance criteria
- [ ] No domain imports from Infrastructure or Application
- [ ] No UI logic in domain or use case layers
- [ ] Adapters implement declared ports without leakage
- [ ] Module exports clear public API via `index.ts`

### Code Review Questions

1. **Domain logic in wrong place?** Move to domain entities
2. **Generic names?** Rename with intention-revealing names
3. **Untrusted data without validation?** Add boundary parsing
4. **Use-case-to-use-case calls?** Refactor via orchestration or events
5. **Missing tests?** Write tests first (TDD)
6. **UI and logic entangled?** Separate via use cases and DI

---

## References

- [Martin Fowler: Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture: Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Kalculo Architecture Decision Document](../../_bmad-output/planning-artifacts/architecture.md)
- [Kalculo Frontend README](../README.md)
