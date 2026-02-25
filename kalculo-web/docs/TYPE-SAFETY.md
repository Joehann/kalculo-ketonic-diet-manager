# Type Safety Policy: Strict `any` Prohibition

**Status**: Enforced at lint-time  
**Severity**: Error (build fails if violated)  
**No exceptions**: None - `any` is completely forbidden

---

## Overview

The Kalculo frontend project has **zero tolerance for the `any` type**. This is enforced by ESLint at every commit and build.

## Why?

1. **Type Safety**: `any` defeats TypeScript's entire purpose
2. **Maintainability**: Unclear types make refactoring dangerous
3. **Performance**: Typed code enables better optimizations
4. **Consistency**: A shared standard prevents "type escape hatches"
5. **Readability**: Explicit types document intent

## Rules Enforced

| Rule | Severity | Why |
|------|----------|-----|
| `@typescript-eslint/no-explicit-any` | ERROR | Forbids `any` type annotation |
| `@typescript-eslint/no-unsafe-assignment` | ERROR | Forbids assigning `any` values |
| `@typescript-eslint/no-unsafe-return` | ERROR | Forbids returning `any` values |
| `@typescript-eslint/no-unsafe-member-access` | ERROR | Forbids accessing properties on `any` |
| `@typescript-eslint/no-unsafe-call` | ERROR | Forbids calling `any` as function |
| `@typescript-eslint/no-unsafe-argument` | ERROR | Forbids passing `any` to functions |

## Common Patterns to Avoid

### ❌ DON'T: Use `any`

```typescript
// FORBIDDEN
const data: any = fetchData()
const result = (data as any).process()
function doSomething(value: any) { /* ... */ }
```

### ✅ DO: Use Proper Types

```typescript
// CORRECT - Type the data
type ApiResponse = {
  data: unknown
  status: string
}

const response: ApiResponse = await fetch(url).then(r => r.json())

// CORRECT - Use unknown and type-guard
function doSomething(value: unknown) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase())
  }
}

// CORRECT - Use generics
function process<T>(value: T): T {
  return value
}
```

## Scenarios & Solutions

### Scenario 1: External API Response

**Problem**: API returns untyped JSON

```typescript
// ❌ BAD
const data: any = await fetch('/api').then(r => r.json())

// ✅ GOOD
type User = { id: string; name: string }
const parseUserResponse = (data: unknown): User => {
  // Use Zod or similar for runtime validation
  return UserSchema.parse(data)
}
```

### Scenario 2: Unknown Third-Party Library

**Problem**: Library has incomplete types

```typescript
// ❌ BAD
const instance: any = new ThirdPartyLib()

// ✅ GOOD - Wrap with proper types
interface ThirdPartyInstance {
  configure(options: Record<string, unknown>): void
  execute(): string
}

const instance: ThirdPartyInstance = new ThirdPartyLib()
```

### Scenario 3: Generic Data Handler

**Problem**: Need flexible function

```typescript
// ❌ BAD
function handle(data: any) { /* ... */ }

// ✅ GOOD - Use generics or unions
function handle<T>(data: T): void { /* ... */ }

// OR
function handle(data: string | number | object): void { /* ... */ }
```

### Scenario 4: Environment Variables

**Problem**: `import.meta.env` is typed as `any`

```typescript
// ❌ BAD
const apiUrl = import.meta.env.VITE_API_URL

// ✅ GOOD - Type the environment
type Env = Record<string, string | undefined>
const env = import.meta.env as Env
const apiUrl = env.VITE_API_URL
```

## Tools & Patterns

### Zod for Runtime Validation

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
})

type User = z.infer<typeof UserSchema>

const user = UserSchema.parse(unknownData) // Throws if invalid
```

### Type Guards

```typescript
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  )
}

if (isUser(data)) {
  console.log(data.name) // Typed as User here
}
```

### Generics

```typescript
function getFirstOrNull<T>(items: T[]): T | null {
  return items[0] ?? null
}

const first = getFirstOrNull([1, 2, 3]) // Type: number | null
```

### Discriminated Unions

```typescript
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

function handleResult<T>(result: Result<T>): void {
  if (result.success) {
    console.log(result.data) // Typed as T
  } else {
    console.log(result.error) // Typed as string
  }
}
```

## Testing Linting Rule

```bash
# Linting will fail if any `any` is present
npm run lint

# Build will also fail on lint errors
npm run build

# Tests should pass with typed code
npm run test
```

## References

- [TypeScript Handbook: `any`](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)
- [ESLint TypeScript: no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/)
- [Zod Documentation](https://zod.dev/)
