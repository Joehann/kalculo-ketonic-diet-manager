# Module Scaffold Guide

**Purpose**: Template and checklist for creating new feature modules  
**When to use**: Before starting a new bounded context (e.g., Menu Planning, Sharing, Audit)  

---

## Module Structure

Every module follows this structure:

```
src/modules/<domain-name>/
├── domain/                    # Business logic & entities
│   ├── <Entity>.ts            # Domain entity/aggregate
│   ├── <Entity>.test.ts       # Domain tests
│   └── errors/
│       └── <Domain>Error.ts   # Domain-specific exceptions
├── application/               # Use cases & ports
│   ├── ports/
│   │   └── <Role>Port.ts      # Port interfaces
│   ├── queries/               # Read operations
│   │   ├── Get<Thing>Query.ts
│   │   └── Get<Thing>Query.test.ts
│   ├── commands/              # Write operations
│   │   ├── <Action><Thing>Command.ts
│   │   └── <Action><Thing>Command.test.ts
│   └── index.ts               # Export use cases factory
├── infrastructure/            # Adapters & implementations
│   ├── in-memory/
│   │   ├── InMemory<Thing><Role>Adapter.ts
│   │   └── InMemory<Thing><Role>Adapter.test.ts
│   ├── api/
│   │   ├── Api<Thing><Role>Adapter.ts
│   │   └── Api<Thing><Role>Adapter.test.ts
│   └── index.ts               # Export adapters
└── index.ts                   # Module public API
```

---

## Step-by-Step Module Creation

### Step 1: Define Domain (Business Logic)

Create domain entities and business rules independent of framework.

**File**: `src/modules/sharing/domain/MenuShare.ts`

```typescript
export interface MenuShare {
  id: string
  menuId: string
  parentId: string
  caregiverId: string
  expiresAt: Date
  revokedAt: Date | null
  isActive: boolean
}

export const createMenuShare = (
  menuId: string,
  parentId: string,
  caregiverId: string,
  durationDays: number,
): MenuShare => {
  if (durationDays < 1 || durationDays > 365) {
    throw new InvalidShareDurationError('Duration must be 1-365 days')
  }

  return {
    id: generateId(),
    menuId,
    parentId,
    caregiverId,
    expiresAt: addDays(new Date(), durationDays),
    revokedAt: null,
    isActive: true,
  }
}

export const assertShareActive = (share: MenuShare): void => {
  if (!share.isActive || share.expiresAt < new Date()) {
    throw new InactiveShareError('Share is no longer active')
  }
}
```

**File**: `src/modules/sharing/domain/errors/SharingError.ts`

```typescript
export class SharingError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SharingError'
  }
}

export class InvalidShareDurationError extends SharingError {}
export class InactiveShareError extends SharingError {}
```

### Step 2: Define Ports (Interfaces)

Create port interfaces for adapters to implement.

**File**: `src/modules/sharing/application/ports/MenuSharingQueryPort.ts`

```typescript
import type { MenuShare } from '../../domain/MenuShare'

export interface MenuSharingQueryPort {
  getShare(shareId: string): Promise<MenuShare>
  getSharesByCaregiver(caregiverId: string): Promise<MenuShare[]>
}
```

**File**: `src/modules/sharing/application/ports/MenuSharingCommandPort.ts`

```typescript
import type { MenuShare } from '../../domain/MenuShare'

export interface MenuSharingCommandPort {
  persistShare(share: MenuShare): Promise<void>
  updateShare(share: MenuShare): Promise<void>
}
```

### Step 3: Implement Use Cases

Create queries and commands using the domain and ports.

**File**: `src/modules/sharing/application/queries/getShareByIdQuery.ts`

```typescript
import type { MenuShare } from '../../domain/MenuShare'
import type { MenuSharingQueryPort } from '../ports/MenuSharingQueryPort'
import { assertShareActive } from '../../domain/MenuShare'

export type GetShareByIdQuery = (shareId: string) => Promise<MenuShare>

export const buildGetShareByIdQuery =
  (queryPort: MenuSharingQueryPort): GetShareByIdQuery =>
  async (shareId: string) => {
    const share = await queryPort.getShare(shareId)
    assertShareActive(share) // Domain validation
    return share
  }
```

**File**: `src/modules/sharing/application/commands/revokeShareCommand.ts`

```typescript
import type { MenuShare } from '../../domain/MenuShare'
import type { MenuSharingCommandPort } from '../ports/MenuSharingCommandPort'
import { SharingError } from '../../domain/errors/SharingError'

export type RevokeShareCommand = (shareId: string) => Promise<void>

export const buildRevokeShareCommand =
  (
    queryPort: MenuSharingQueryPort,
    commandPort: MenuSharingCommandPort,
  ): RevokeShareCommand =>
  async (shareId: string) => {
    const share = await queryPort.getShare(shareId)
    
    if (!share.isActive) {
      throw new SharingError('Share is already inactive')
    }
    
    share.isActive = false
    share.revokedAt = new Date()
    
    await commandPort.updateShare(share)
  }
```

### Step 4: Implement Adapters

Create in-memory stubs first, then API adapters.

**File**: `src/modules/sharing/infrastructure/in-memory/InMemoryMenuSharingQueryAdapter.ts`

```typescript
import type { MenuShare } from '../../domain/MenuShare'
import type { MenuSharingQueryPort } from '../../application/ports/MenuSharingQueryPort'

const shares: MenuShare[] = [
  {
    id: 'share-1',
    menuId: 'menu-1',
    parentId: 'parent-1',
    caregiverId: 'caregiver-1',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    revokedAt: null,
    isActive: true,
  },
]

export class InMemoryMenuSharingQueryAdapter implements MenuSharingQueryPort {
  async getShare(shareId: string): Promise<MenuShare> {
    const share = shares.find((s) => s.id === shareId)
    if (!share) throw new Error(`Share not found: ${shareId}`)
    return share
  }

  async getSharesByCaregiver(caregiverId: string): Promise<MenuShare[]> {
    return shares.filter((s) => s.caregiverId === caregiverId)
  }
}
```

### Step 5: Wire Use Cases

Create a factory function to build and wire use cases with adapters.

**File**: `src/modules/sharing/application/index.ts`

```typescript
import type { SharingDataSource } from '..'
import { buildGetShareByIdQuery } from './queries/getShareByIdQuery'
import { buildRevokeShareCommand } from './commands/revokeShareCommand'
import type { MenuSharingQueryPort } from './ports/MenuSharingQueryPort'
import type { MenuSharingCommandPort } from './ports/MenuSharingCommandPort'

export const buildSharingUseCases = (
  queryPort: MenuSharingQueryPort,
  commandPort: MenuSharingCommandPort,
) => ({
  getShareByIdQuery: buildGetShareByIdQuery(queryPort),
  revokeShareCommand: buildRevokeShareCommand(queryPort, commandPort),
})

export type SharingUseCases = ReturnType<typeof buildSharingUseCases>
```

### Step 6: Export Module API

Create a public `index.ts` for the module.

**File**: `src/modules/sharing/index.ts`

```typescript
export * from './domain/MenuShare'
export * from './domain/errors/SharingError'
export { type MenuSharingQueryPort } from './application/ports/MenuSharingQueryPort'
export { type MenuSharingCommandPort } from './application/ports/MenuSharingCommandPort'
export { buildSharingUseCases, type SharingUseCases } from './application'
export { InMemoryMenuSharingQueryAdapter } from './infrastructure/in-memory/InMemoryMenuSharingQueryAdapter'
export { InMemoryMenuSharingCommandAdapter } from './infrastructure/in-memory/InMemoryMenuSharingCommandAdapter'
export { ApiMenuSharingQueryAdapter } from './infrastructure/api/ApiMenuSharingQueryAdapter'
export { ApiMenuSharingCommandAdapter } from './infrastructure/api/ApiMenuSharingCommandAdapter'
```

### Step 7: Register in DI Container

Update the dependency injection container to include the new module.

**File**: `src/app/di/buildDiContainer.ts`

```typescript
import { getDataSourceFromEnv } from '../env/dataSource'
import { buildNutritionUseCases } from '../../modules/nutrition'
import {
  buildSharingUseCases,
  InMemoryMenuSharingQueryAdapter,
  InMemoryMenuSharingCommandAdapter,
} from '../../modules/sharing'

export const buildDiContainer = () => {
  const dataSource = getDataSourceFromEnv()

  // Nutrition adapters
  const nutritionQueryAdapter = /* ... */
  
  // Sharing adapters
  const sharingQueryAdapter = new InMemoryMenuSharingQueryAdapter()
  const sharingCommandAdapter = new InMemoryMenuSharingCommandAdapter()

  return {
    useCases: {
      nutrition: buildNutritionUseCases(nutritionQueryAdapter),
      sharing: buildSharingUseCases(sharingQueryAdapter, sharingCommandAdapter),
    },
  }
}
```

### Step 8: Write Tests

Test domain logic, use cases, and adapters.

**File**: `src/modules/sharing/application/queries/getShareByIdQuery.test.ts`

```typescript
import { describe, expect, it } from 'vitest'
import { buildGetShareByIdQuery } from './getShareByIdQuery'
import type { MenuSharingQueryPort } from '../ports/MenuSharingQueryPort'

describe('GetShareByIdQuery', () => {
  it('returns active share', async () => {
    const stubPort: MenuSharingQueryPort = {
      async getShare(shareId) {
        return {
          id: shareId,
          menuId: 'menu-1',
          parentId: 'parent-1',
          caregiverId: 'caregiver-1',
          expiresAt: new Date(Date.now() + 1000),
          revokedAt: null,
          isActive: true,
        }
      },
      async getSharesByCaregiver() { return [] },
    }

    const query = buildGetShareByIdQuery(stubPort)
    const share = await query('share-1')

    expect(share.isActive).toBe(true)
    expect(share.id).toBe('share-1')
  })

  it('throws error if share expired', async () => {
    const stubPort: MenuSharingQueryPort = {
      async getShare(shareId) {
        return {
          id: shareId,
          menuId: 'menu-1',
          parentId: 'parent-1',
          caregiverId: 'caregiver-1',
          expiresAt: new Date(Date.now() - 1000), // Expired
          revokedAt: null,
          isActive: true,
        }
      },
      async getSharesByCaregiver() { return [] },
    }

    const query = buildGetShareByIdQuery(stubPort)
    await expect(query('share-1')).rejects.toThrow()
  })
})
```

---

## Naming Checklist

When creating a new module, ensure:

- [ ] Module name reflects bounded context (e.g., `sharing`, `audit`, `nutrition`)
- [ ] Domain entities have clear names (`Menu`, `Macro`, not `Item`, `Data`)
- [ ] Ports follow pattern: `<Domain><Role>Port` (e.g., `MenuSharingQueryPort`)
- [ ] Adapters follow pattern: `<Source><Domain><Role>Adapter` (e.g., `ApiMenuSharingCommandAdapter`)
- [ ] Use cases follow pattern: `<Action><Thing>Query|Command` (e.g., `GetShareByIdQuery`, `RevokeShareCommand`)
- [ ] Errors are specific: `InvalidShareDurationError`, not `ValidationError`
- [ ] No generic names: `Service`, `Util`, `Handler`

---

## Testing Checklist

- [ ] Domain logic tested independently (no framework)
- [ ] Use cases tested with stub ports
- [ ] Adapters tested for port contract compliance
- [ ] Invalid inputs test (negative values, empty strings, null)
- [ ] Edge cases covered (boundaries, limits, state transitions)
- [ ] Tests are acceptance-oriented (behavior-driven, not implementation-coupled)

---

## Integration Checklist

- [ ] Module exported via `index.ts` with clear public API
- [ ] Use cases registered in DI container
- [ ] Environment variable handling if needed
- [ ] README or documentation for module added
- [ ] Architecture guardrails acknowledged in commit message

---

## References

- [Architecture Guardrails](./ARCHITECTURE.md)
- [CQS Policy](./CQS-POLICY.md)
- [Boundary Validation](./BOUNDARY-VALIDATION.md)
