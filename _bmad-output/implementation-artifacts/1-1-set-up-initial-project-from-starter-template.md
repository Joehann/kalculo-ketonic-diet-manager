# Story 1.1: Initialiser le frontend avec simulation in-memory

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a product team member,
I want to initialize `kalculo-web` (Vite React TypeScript) with a fake-data strategy (stubs/in-memory),
so that frontend business stories can progress immediately without waiting for the backend while staying architecture-compliant.

## Acceptance Criteria

1. **Given** an empty implementation repository, **when** official frontend initialization commands are executed, **then** `kalculo-web` is created with base scripts/build working.
2. **Given** frontend initialization is complete, **when** architecture boundaries are reviewed, **then** fake-data access is implemented behind ports/adapters with no direct UI-to-data coupling.
3. **Given** dependencies are installed, **when** local startup is attempted, **then** the frontend runs locally with a default in-memory dataset.
4. **Given** architecture guardrails are mandatory from day one, **when** project skeleton is committed, **then** baseline conventions are documented: DDD/Clean layering intent, CQS separation policy, boundary-validation policy, SOLID constraints, and TDD expectation.

## Tasks / Subtasks

- [x] Initialize frontend application (AC: 1, 3)
  - [x] Run `npm create vite@latest kalculo-web -- --template react-ts`.
  - [x] Install dependencies and verify scripts (`npm install`, `npm run dev`, `npm run build`) execute.
  - [x] Keep starter output clean; do not add business logic in this story.
- [x] Add fake-data boundary with in-memory stubs (AC: 2, 3, 4)
  - [x] Create a minimal port interface in the application layer for one representative read use case.
  - [x] Implement one in-memory adapter providing deterministic fake data.
  - [x] Wire UI through the application/use-case layer, not directly to raw data objects.
- [x] Enforce initial repository structure and naming (AC: 2, 4)
  - [x] Validate root contains `kalculo-web` as the active implementation app for this phase.
  - [x] Add lightweight README notes (or architecture note) describing intended bounded-context/layer direction for future stories.
  - [x] Confirm naming avoids generic anti-pattern placeholders like `GenericService`.
- [x] Add baseline quality/tooling checks (AC: 3, 4)
  - [x] Frontend: verify TypeScript compile/build passes on clean scaffold.
  - [x] Add a small test around the in-memory adapter/use-case seam.
  - [x] Capture minimum run commands for local development in project docs (frontend + fake data mode).
- [x] Add architecture and testing guardrail stubs (AC: 4)
  - [x] Define initial place for architecture decisions/constraints reference in repo docs.
  - [x] Note CQS rule: no use case calling another use case directly.
  - [x] Note boundary validation rule to be enforced at all ingress points before domain behavior.
  - [x] Note TDD + acceptance-oriented tests from Gherkin as mandatory for implementation stories.

## Dev Notes

- Story scope is frontend infrastructure bootstrap only; no product features are implemented here.
- This is explicitly the first implementation priority from architecture handoff.
- Preserve clean separation and future-proof structure for bounded contexts.
- Fake-data strategy is intentional in this phase: stubs/in-memory first, real API integration later via adapters.

### Technical Requirements

- Use starter commands mandated by planning artifacts:
  - Frontend: `npm create vite@latest kalculo-web -- --template react-ts`
- Keep architecture baseline visible from day one:
  - DDD + Clean/Hexagonal boundaries
  - strict CQS separation
  - dependency direction: `presentation/infrastructure -> application -> domain`
  - boundary validation on all untrusted inputs before domain behavior
- Keep fake-data implementation behind interfaces so backend integration does not require UI/use-case rewrites.
- Security and privacy posture begins at bootstrap:
  - secure defaults for environment handling
  - no hardcoded secrets
  - no role logic shortcuts in starter scaffolding

### Architecture Compliance

- This story intentionally focuses on `kalculo-web` only (front-first execution).
- Avoid introducing direct coupling from UI to data source details.
- Keep startup code minimal and replaceable; adapters/frameworks are details, domain stays future-center.
- Do not create generic catch-all services or utility sinks during scaffold.

### Library / Framework Requirements

- Frontend baseline: Vite React TypeScript starter (`react-ts` template).
- Current ecosystem guidance (to verify during implementation):
  - Vite command should remain `npm create vite@latest ... --template react-ts` (official docs).
  - No backend framework setup is required in this story.

### File Structure Requirements

- Expected root directories after completion:
  - `kalculo-web/` (frontend app scaffold)
- Within the frontend app, preserve starter layout initially; defer deeper refactor to dedicated architecture stories.
- Add minimal project-level documentation for:
  - local run/build commands
  - intended layering/DDD direction for future stories
  - where future bounded contexts will be introduced
  - fake-data boundary and replacement strategy for real API adapters

### Testing Requirements

- This story validates scaffold operability, not business behavior.
- Required checks:
  - Frontend: successful install, dev start, production build.
  - Frontend fake-data path: deterministic in-memory response is covered by at least one automated test.
- Future-story guardrail (must be documented now):
  - TDD mandatory
  - acceptance-oriented tests from story Gherkin
  - in-memory/stubs preferred over mocks except third-party boundaries

### Project Structure Notes

- This setup establishes the technical baseline for all Epic 1+ stories.
- Keep implementation intentionally thin to avoid accidental architecture drift before first vertical slice.
- No previous story intelligence applies (first story in Epic 1).
- Backend bootstrap and real API integration are explicitly deferred to dedicated follow-up stories.

### Latest Technical Information

- Web-check summary for implementation awareness:
  - Vite official setup flow remains aligned with the command in this story.
- Action for dev agent:
  - Record frontend scaffold versions in completion notes.
  - Do not implement backend work in this story.

### References

- Epic story definition and AC: [Source: _bmad-output/planning-artifacts/epics.md#Epic-1-Story-1.1]
- Starter commands and first-priority handoff: [Source: _bmad-output/planning-artifacts/architecture.md#Starter-Template-Evaluation]
- Architecture guardrails and ADR baseline: [Source: _bmad-output/planning-artifacts/architecture.md#Core-Architectural-Decisions]
- Functional/NFR context for mobile-first baseline: [Source: _bmad-output/planning-artifacts/prd.md#Functional-Requirements] [Source: _bmad-output/planning-artifacts/prd.md#Non-Functional-Requirements]
- UX constraints for mobile-first clarity and accessibility baseline: [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive-Design--Accessibility]

## Dev Agent Record

### Agent Model Used

claude-4.5-haiku

### Debug Log References

- All tests passing: `npm run test` → 1 test passed
- All linting passing: `npm run lint` → no errors
- Build successful: `npm run build` → ✓ built in 309ms

### Completion Notes List

1. **Frontend bootstrap complete**: Vite React TypeScript scaffold initialized with all core dependencies (React 19.2.0, TypeScript 5.9.3, Vite 7.3.1).

2. **Architecture guardrails established**:
   - Created `docs/ARCHITECTURE.md`: Comprehensive DDD + Clean Architecture baseline with layering rules, naming conventions, and enforcement guidelines.
   - Created `docs/CQS-POLICY.md`: Strict Command-Query Segregation policy with implementation patterns and testing guidance.
   - Created `docs/BOUNDARY-VALIDATION.md`: Input validation at system boundaries using Zod, with patterns for APIs, forms, and environment variables.
   - Created `docs/MODULE-SCAFFOLD.md`: Step-by-step guide for creating new feature modules following architectural patterns.

3. **Fake-data strategy implemented**:
   - Port interface: `DailyNutritionSummaryQueryPort` (application layer)
   - In-memory adapter: `InMemoryDailyNutritionSummaryQueryAdapter` with deterministic test data
   - API adapter stub: `ApiDailyNutritionSummaryQueryAdapter` (ready for backend integration)
   - DI container: `buildDiContainer.ts` selects adapter via `VITE_DATA_SOURCE` environment variable
   - Data source configuration: Environment-driven switching between `inmemory` (default) and `api`

4. **Quality checks validated**:
   - TypeScript: `npm run build` compiles successfully with no errors
   - Linting: `npm run lint` passes ESLint with TypeScript + React rules
   - Tests: `npm run test` passes all tests (1 test file covering the application seam)
   - No generic service anti-patterns used; intention-revealing naming throughout

5. **Documentation updated**:
   - README: Replaced generic Vite template with comprehensive Kalculo-specific guidance covering local development, architecture baseline, testing requirements, and module scaffold process.
   - Architecture notes: Foundation established for future bounded contexts (Sharing, Audit, Menu Planning, etc.)
   - Developer guidance: All mandatory principles documented (DDD, Clean Architecture, CQS, boundary validation, TDD)

6. **Project structure verified**:
   - Root: `/kalculo-web` contains all frontend code
   - Modules: `src/modules/nutrition` demonstrates pattern for future features
   - Adapters: In-memory and API strategy established; new modules can be added without refactoring
   - Tests: Collocated with implementation, ready for acceptance-oriented test coverage

7. **All acceptance criteria satisfied**:
   - AC1: Frontend initialization complete with working npm scripts ✅
   - AC2: Fake-data behind ports/adapters with no direct UI-to-data coupling ✅
   - AC3: Frontend runs locally with in-memory dataset; all scripts executable ✅
   - AC4: Architecture guardrails documented; DDD/Clean layering, CQS separation, boundary validation, SOLID constraints, TDD expectations all established ✅

### File List

- `kalculo-web/README.md` (updated with architecture baseline and local dev guidance)
- `kalculo-web/docs/ARCHITECTURE.md` (new: comprehensive architectural guardrails)
- `kalculo-web/docs/CQS-POLICY.md` (new: Command-Query Segregation enforcement)
- `kalculo-web/docs/BOUNDARY-VALIDATION.md` (new: Input validation at system boundaries)
- `kalculo-web/docs/MODULE-SCAFFOLD.md` (new: Module creation guide and checklist)
- `kalculo-web/package.json` (dependencies already in place; vitest configured for tests)
- `kalculo-web/src/app/di/buildDiContainer.ts` (DI wiring with adapter selection)
- `kalculo-web/src/app/env/dataSource.ts` (environment-driven data source configuration)
- `kalculo-web/src/modules/nutrition/application/ports/DailyNutritionSummaryQueryPort.ts` (port interface)
- `kalculo-web/src/modules/nutrition/application/queries/getDailyNutritionSummaryQuery.ts` (query use case)
- `kalculo-web/src/modules/nutrition/application/queries/getDailyNutritionSummaryQuery.test.ts` (test with application seam validation)
- `kalculo-web/src/modules/nutrition/infrastructure/in-memory/InMemoryDailyNutritionSummaryQueryAdapter.ts` (in-memory adapter)
- `kalculo-web/src/modules/nutrition/infrastructure/api/ApiDailyNutritionSummaryQueryAdapter.ts` (API adapter stub)
- `kalculo-web/src/modules/nutrition/domain/DailyNutritionSummary.ts` (domain entity)
- `kalculo-web/src/App.tsx` (UI consuming use case via DI, displaying nutrition summary)

## Change Log

- **2026-02-25**: Story 1.1 implementation completed
  - Frontend scaffold: Vite React TypeScript initialized with npm scripts working (`npm run dev`, `npm run build`, `npm run test`, `npm run lint`)
  - Architecture baseline: DDD + Clean Architecture established with documentation (ARCHITECTURE.md, CQS-POLICY.md, BOUNDARY-VALIDATION.md, MODULE-SCAFFOLD.md)
  - Fake-data strategy: Port interface and in-memory adapter implemented with deterministic test data; API adapter stub ready for backend integration
  - Quality checks: TypeScript compilation passing, ESLint clean, tests passing (1 test covering application seam)
  - All acceptance criteria satisfied; story ready for code review
