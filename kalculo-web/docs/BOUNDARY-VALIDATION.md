# Boundary Validation Policy

**Document Purpose**: Define strict input validation rules at system boundaries.  
**Applies to**: All API adapters, user input, and external data sources  
**Framework**: Zod for runtime validation  

---

## Core Principle

**All data crossing system boundaries is untrusted until validated.**

Boundaries include:
- API responses (external or internal)
- User input from forms
- Storage/cache retrieval
- Environment variables
- URL parameters

---

## Validation Flow

```
Untrusted Data (unknown)
    ↓ Parse (Zod schema)
    ↓ Validate (business rules)
    ↓ Transform (map to domain types)
    ↓
Trusted Data (typed, domain-validated)
    ↓ Domain logic processes with confidence
```

### Example

```typescript
// ❌ WRONG: No validation
const menu = await apiPort.getMenu() // unknown type
domain.lockMenu(menu) // Dangerous!

// ✅ CORRECT: Parse → Validate → Transform
const untypedResponse = await apiPort.getMenu()
const parsedMenu = MenuSchema.parse(untypedResponse) // Throws if invalid
const menu = assertMenuCompliance(parsedMenu)
domain.lockMenu(menu) // Safe!
```

---

## Zod Validation Patterns

### Pattern 1: Basic Schema

```typescript
import { z } from 'zod'

const MenuSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  createdAt: z.string().datetime(),
})

// Throws ZodError if invalid
const menu = MenuSchema.parse(unknownData)
```

### Pattern 2: With Custom Refinements

```typescript
const MenuSchema = z.object({
  id: z.string(),
  macros: z.object({
    caloriesKcal: z.number().min(0).max(10000),
    proteinGrams: z.number().min(0),
  }),
})
.refine(
  (menu) => {
    // Business rule: calories must be reasonable
    return menu.macros.caloriesKcal <= menu.macros.proteinGrams * 9
  },
  { message: 'Macros must be coherent' }
)
```

### Pattern 3: Safe Parsing with Error Handling

```typescript
const result = MenuSchema.safeParse(unknownData)

if (!result.success) {
  throw new ValidationError(`Invalid menu: ${result.error.message}`)
}

const menu = result.data // Typed and validated
```

### Pattern 4: Transforming During Parse

```typescript
const MenuSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime().transform((date) => new Date(date)),
})

const menu = MenuSchema.parse(unknownData)
// menu.createdAt is now a Date object
```

---

## Adapter Validation Examples

### Example 1: API Adapter with Zod

```typescript
// infrastructure/api/ApiDailyNutritionSummaryQueryAdapter.ts
import { z } from 'zod'
import type { DailyNutritionSummaryQueryPort } from '../../application/ports/DailyNutritionSummaryQueryPort'
import type { DailyNutritionSummary } from '../../domain/DailyNutritionSummary'

const ApiNutritionResponseSchema = z.object({
  childFirstName: z.string().min(1),
  protocol: z.string().min(1),
  caloriesKcal: z.number().min(0),
  proteinGrams: z.number().min(0),
  carbsGrams: z.number().min(0),
  fatsGrams: z.number().min(0),
})

export class ApiDailyNutritionSummaryQueryAdapter 
  implements DailyNutritionSummaryQueryPort {
  
  async getCurrentDailySummary(): Promise<DailyNutritionSummary> {
    const response = await fetch('/api/nutrition/summary')
    const unknownData = await response.json()
    
    // Parse and validate at boundary
    const parsed = ApiNutritionResponseSchema.parse(unknownData)
    
    // Now safe for domain
    return parsed
  }
}
```

### Example 2: Form Input Validation

```typescript
// presentation/components/CreateMenuForm.tsx
import { z } from 'zod'

const CreateMenuFormSchema = z.object({
  childId: z.string().uuid('Invalid child ID'),
  date: z.string().date('Invalid date format'),
  macros: z.object({
    caloriesKcal: z.number().min(500).max(3000),
    proteinGrams: z.number().min(10).max(200),
    carbsGrams: z.number().min(50).max(500),
    fatsGrams: z.number().min(20).max(150),
  }),
})

function CreateMenuForm() {
  const onSubmit = (untrustedFormData: unknown) => {
    try {
      const validated = CreateMenuFormSchema.parse(untrustedFormData)
      // Now safe: call use case with validated data
      useCases.createMenuCommand(validated)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormErrors(error.flatten()) // Display validation errors
      }
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {/* form fields */}
    </form>
  )
}
```

### Example 3: Environment Variable Validation

```typescript
// app/env/validateEnv.ts
import { z } from 'zod'

const EnvSchema = z.object({
  VITE_API_URL: z.string().url().optional().default('http://localhost:3000'),
  VITE_DATA_SOURCE: z.enum(['inmemory', 'api']).optional().default('inmemory'),
})

export const validatedEnv = EnvSchema.parse(import.meta.env)
```

---

## Common Validation Patterns

| Scenario | Pattern |
|----------|---------|
| **API timestamp** | `z.string().datetime().transform(d => new Date(d))` |
| **Optional field** | `z.object({ foo: z.string().optional() })` |
| **Default value** | `z.object({ status: z.enum([...]).default('draft') })` |
| **Numeric range** | `z.number().min(0).max(100)` |
| **String constraints** | `z.string().min(1).max(255).email()` |
| **Enum validation** | `z.enum(['draft', 'locked', 'shared'])` |
| **Array validation** | `z.array(z.object({ ... }))` |
| **Nested objects** | `z.object({ child: z.object({ ... }) })` |
| **Conditional logic** | `.refine(obj => obj.x > obj.y, { message: 'X must be > Y' })` |
| **Safe parsing** | `schema.safeParse(data)` returns `{ success, data, error }` |

---

## Error Handling Strategy

### Strategy 1: Strict (Throw)

```typescript
// Use when validation error = feature cannot proceed
const parsed = MenuSchema.parse(unknownData) // Throws on invalid
```

### Strategy 2: Soft (Handle)

```typescript
// Use when invalid input is expected (e.g., form input)
const result = MenuSchema.safeParse(unknownData)
if (!result.success) {
  return { error: result.error.flatten() }
}
```

### Strategy 3: Coerce (Transform)

```typescript
// Use when partial recovery is possible
const result = MenuSchema.parse({
  ...unknownData,
  caloriesKcal: Math.max(0, Number(unknownData.caloriesKcal)),
})
```

---

## Testing Validation

### Test Valid Data

```typescript
it('accepts valid API response', () => {
  const validData = {
    childFirstName: 'Alex',
    protocol: 'Classique',
    caloriesKcal: 1650,
    proteinGrams: 78,
    carbsGrams: 180,
    fatsGrams: 62,
  }
  
  const result = ApiNutritionResponseSchema.safeParse(validData)
  expect(result.success).toBe(true)
})
```

### Test Invalid Data

```typescript
it('rejects negative macro values', () => {
  const invalidData = {
    childFirstName: 'Alex',
    caloriesKcal: -100, // ❌ Invalid
    proteinGrams: 78,
    carbsGrams: 180,
    fatsGrams: 62,
  }
  
  const result = ApiNutritionResponseSchema.safeParse(invalidData)
  expect(result.success).toBe(false)
  expect(result.error?.flatten().fieldErrors).toHaveProperty('caloriesKcal')
})
```

### Test Edge Cases

```typescript
it('handles missing required fields', () => {
  const missingField = { childFirstName: 'Alex' } // Missing others
  const result = ApiNutritionResponseSchema.safeParse(missingField)
  expect(result.success).toBe(false)
})

it('rejects empty string where min(1) required', () => {
  const emptyName = { childFirstName: '', /* ... */ }
  const result = ApiNutritionResponseSchema.safeParse(emptyName)
  expect(result.success).toBe(false)
})
```

---

## Validation Checklist

Use during code review:

- [ ] All API adapters parse responses with Zod schema?
- [ ] All form inputs validated before use case call?
- [ ] Environment variables validated at startup?
- [ ] Error handling appropriate for context (strict vs. soft)?
- [ ] Tests cover valid, invalid, and edge cases?
- [ ] Domain validation (business rules) separate from format validation?
- [ ] No raw `as` casts or `any` types to bypass validation?

---

## Anti-Patterns

| ❌ Anti-Pattern | ✅ Correct |
|---|---|
| `const menu = data as Menu` | `const menu = MenuSchema.parse(data)` |
| `const x: unknown = data; const menu = x as Menu` | Use Zod schema |
| No validation before domain call | Validate at adapter/entry boundary |
| Business logic in schema | Keep schema for format; domain for rules |
| Single `catch-all` schema | Create specific schemas per adapter |

---

## Integration with Architecture

Validation happens at:

1. **Infrastructure adapters**: Parse external API/storage responses
2. **Presentation layer**: Validate form/user input before calling use case
3. **Domain layer**: Enforce business invariants (separate from format validation)

```
External Data → Infrastructure Adapter (Zod parse) → Application → Domain (business rules)
```

---

## References

- [Zod Documentation](https://zod.dev)
- [Kalculo Architecture Guardrails](./ARCHITECTURE.md)
