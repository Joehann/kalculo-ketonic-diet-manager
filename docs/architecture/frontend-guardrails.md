# Frontend Architecture Guardrails

This document defines non-negotiable architecture rules for the frontend baseline.

## Layering Direction (DDD + Clean)

- `presentation` and `infrastructure` depend on `application`.
- `application` depends on `domain`.
- `domain` has no dependency on framework or infrastructure details.
- Dependency direction is one-way only: `presentation/infrastructure -> application -> domain`.
- Frontend code is organized by bounded context first, then by layer inside each module:
  - `src/modules/<bounded-context>/domain`
  - `src/modules/<bounded-context>/application`
  - `src/modules/<bounded-context>/infrastructure`
  - `src/modules/<bounded-context>/presentation`

## DI and Composition Root Policy

- Adapter selection (`inmemory` vs `api`) is allowed only in `src/app/di`.
- `VITE_DATA_SOURCE` drives adapter mapping; default is `inmemory`.
- UI consumes use cases through `UseCasesContext` and `useUseCases()`.
- UI must never import infrastructure adapters directly.
- Use cases must not import React or read environment variables directly.

## CQS Policy

- Use cases are separated by intent:
  - Queries return data and do not mutate state.
  - Commands mutate state and do not return read models beyond operation result metadata.
- One use case must not call another use case directly.
- Port naming must be explicit:
  - Query side: `*QueryPort`
  - Command side: `*CommandPort`

## Boundary Validation

- All untrusted input is validated at ingress boundaries before domain behavior:
  - UI form/input adapters.
  - HTTP/API adapters (when backend integration is introduced).
  - Persistence adapters.
- Domain entities and value objects should not receive unchecked external data.

## Fake Data Strategy (Current Phase)

- In-memory/stub adapters are allowed and preferred in this phase.
- UI never consumes fake data directly; it consumes application use cases only.
- API integration later must replace adapter implementations, not UI/use-case contracts.

## Testing Expectations

- TDD is mandatory on implementation stories.
- Acceptance-oriented tests from story Gherkin guide behavior.
- In-memory/stubs are preferred over mocks except for third-party boundaries.
