# Kalculo Frontend (`kalculo-web`)

Modern healthcare nutrition management application - frontend repository (React + TypeScript + Vite).

## Local Development

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Setup & Run

```bash
# Install dependencies
npm install

# Start local development server with in-memory fake data
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Scaffold a new module (see Architecture section)
npm run scaffold:module
```

The dev server includes Hot Module Replacement (HMR) for fast iteration during development.

## Fake Data Strategy

This frontend currently uses **in-memory stubs** for data access. This decouples frontend development from backend readiness while maintaining architecture-compliant design patterns.

- **Current mode**: `VITE_DATA_SOURCE=inmemory` (default)
- **Environment variable**: Set `VITE_DATA_SOURCE=api` to switch to API mode (backend integration required)

The data source strategy is managed through dependency injection in `src/app/di/buildDiContainer.ts`.

## Architecture Baseline

Kalculo frontend follows **Domain-Driven Design + Clean/Hexagonal Architecture** from day one:

### Core Principles

1. **DDD + Bounded Contexts**: Each feature is isolated in a module with its own domain, application, and infrastructure layers
2. **Clean Architecture**: Dependency direction flows inward toward domain:
   - `presentation/UI` → `application/use cases` → `domain/business logic`
   - Infrastructure (API, storage) adapts domain ports; UI never directly imports infrastructure
3. **Command-Query Segregation (CQS)**: Read and write operations are strictly separated
4. **Boundary Validation**: All external inputs (API, user) are validated before entering the domain
5. **SOLID Principles**: Single responsibility, dependency injection, dependency inversion

### Repository Structure

```
src/
├── app/                           # Global application setup
│   ├── di/                        # Dependency injection container
│   ├── env/                       # Environment & configuration
│   └── providers/                 # React context for use cases
├── modules/                       # Feature-organized bounded contexts
│   └── nutrition/                 # Example: Nutrition & Macro tracking
│       ├── domain/                # Business logic & entities
│       ├── application/           # Use cases & ports (interfaces)
│       │   ├── queries/           # Read operations (CQS)
│       │   ├── commands/          # Write operations (CQS)
│       │   └── ports/             # Adapter interfaces
│       └── infrastructure/        # Implementations & adapters
│           ├── api/               # API adapters
│           └── in-memory/         # In-memory stubs
└── [shared utilities as needed]
```

### Naming & Organization

- **No generic services** (e.g., `Util`, `Helper`, `Service`)
- **Intention-revealing names**: `GetDailyNutritionSummaryQuery`, `LockMenuCommand`
- **Module-centric**: Features live in `src/modules/<domain-name>`, not organized by layer
- **Adapter naming**: `<Source><Domain><Role>Adapter` (e.g., `InMemoryDailyNutritionSummaryQueryAdapter`)

### Mandatory Rules

| Rule | Rationale |
|------|-----------|
| **Use Cases are pure functions or classes**: Exported from `application/` layer | Testability & reusability |
| **Domain never imports infrastructure**: Only interfaces (ports) | Isolation from framework/API details |
| **UI imports only application use cases**: Via DI container | Enforced architecture boundaries |
| **All external data is validated**: Before entering domain | Security & reliability |
| **CQS strict separation**: Queries never mutate, commands never return data | Clarity & predictability |
| **No use-case-to-use-case calls**: Coordination via application orchestration | Scalability & composability |

### Testing Requirements

- **TDD mandatory**: Write tests before implementation
- **Unit tests for domain logic**: Deterministic, fast, no side effects
- **Integration tests for ports**: Verify adapter contracts and use-case seams
- **E2E tests for critical flows**: When story requirements demand them
- **Prefer stubs/in-memory**: Over mocks except at third-party boundaries
- **Acceptance-oriented tests**: Derived from story Gherkin scenarios (not 1:1 implementation-coupled)

### Adding Features

When adding a new module (e.g., menu planning, caregiver sharing):

1. Create `src/modules/<domain-name>` directory structure
2. Define domain entities and business rules in `domain/`
3. Create port (interface) definitions in `application/ports/`
4. Implement use cases in `application/` (queries and commands)
5. Implement adapters in `infrastructure/` (start with in-memory)
6. Register in DI container (`buildDiContainer.ts`)
7. Export public API from module's `index.ts`
8. Add tests alongside each implementation

Use `npm run scaffold:module <module-name>` to generate boilerplate (when available).

### Environment Configuration

- **VITE_DATA_SOURCE**: `inmemory` (default) or `api`
  - Development: Use `inmemory` to avoid backend dependency
  - Production: Configure `api` for real API integration

## Quality Checks

- **Linting**: `npm run lint` (ESLint with TypeScript)
- **Type checking**: `npm run build` (includes TypeScript compile)
- **Tests**: `npm run test` (Vitest)
- **Build**: `npm run build` (Vite production bundle)

All checks are required before committing.

## References

- [Kalculo Architecture Decision Document](../../_bmad-output/planning-artifacts/architecture.md)
- [Epic 1 Stories](../../_bmad-output/planning-artifacts/epics.md)
- [Frontend UX Specification](../../_bmad-output/planning-artifacts/ux-design-specification.md)
