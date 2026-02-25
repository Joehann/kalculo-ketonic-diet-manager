---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - /Users/johann/PersonalDev/kalculo/_bmad-output/planning-artifacts/product-brief-kalculo-2026-02-21.md
  - /Users/johann/PersonalDev/kalculo/_bmad-output/planning-artifacts/prd.md
  - /Users/johann/PersonalDev/kalculo/_bmad-output/planning-artifacts/prd-validation-report-2026-02-21.md
  - /Users/johann/PersonalDev/kalculo/_bmad-output/planning-artifacts/ux-design-specification.md
workflowType: 'architecture'
project_name: 'kalculo'
user_name: 'Johann'
date: '2026-02-22'
lastStep: 8
status: 'complete'
completedAt: '2026-02-22'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The product requires a safety-first full-stack architecture centered on five capability clusters: identity and role governance, child profile and macro configuration, macro reliability and compliance validation, lock-and-share caregiver delegation, and auditable execution tracking. Architecturally, this implies clear domain boundaries between planning, validation, sharing lifecycle, and audit events, with server-authoritative enforcement for all critical transitions.

**Non-Functional Requirements:**
NFRs strongly shape architecture: low-latency critical actions on mobile networks, strict server-side authorization, durable state transitions for lock/share lifecycle, reliable event logging, and WCAG 2.1 AA support in core flows. Security and reliability are first-order concerns, not secondary quality attributes.

**Scale & Complexity:**
The system is a high-complexity healthcare-adjacent product due to safety-critical calculations, delegated access control, and trust/audit requirements combined with mobile-first UX expectations.

- Primary domain: full-stack web application (mobile-first healthcare workflow)
- Complexity level: high
- Estimated architectural components: 8-12 core components/services (auth, profile/config, nutrition/macro validation, menu planning, lock/share lifecycle, caregiver execution, audit/eventing, API/UI orchestration)

### Technical Constraints & Dependencies

- Mandatory lock-before-share policy and prevention of sharing non-compliant menus
- Strict parent vs caregiver role boundaries with caregiver read-only behavior
- Time-bounded sharing lifecycle with deterministic activation/expiry/revocation
- Mobile/tablet-first interaction constraints and responsive parity goals
- Explicit non-prescriptive medical framing and responsibility boundaries
- Future integration readiness without introducing current MVP integration complexity

### Cross-Cutting Concerns Identified

- Authorization and least-privilege enforcement across all protected actions
- Data integrity and invariant enforcement for nutritional coherence and compliance
- State model consistency for draft/locked/shared/expired/revoked transitions
- Auditability and traceability of high-risk actions and actor identity
- Accessibility and usability in high-stress kitchen workflows
- Observability for critical path reliability (validation, locking, sharing, caregiver confirmation)

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application (mobile-first) with separated frontend and backend foundations based on project requirements and existing technical preferences.

### Starter Options Considered

- `Vite React TypeScript` official starter for frontend SPA (`npm create vite@latest ... -- --template react-ts`)
- `cargo-leptos` (including `start-axum`) as a Rust-first full-stack option
- `axum-template` with SQLx/PostgreSQL via `cargo-generate` for backend API foundation
- Axum official SQLx example as a reference baseline (good for patterns, less complete as full project scaffold)

### Selected Starter: Split Foundation (Vite + Axum Template)

**Rationale for Selection:**
This choice best matches current project constraints and prior artifacts: React/Vite frontend plus Rust backend. It keeps architectural boundaries explicit (UI/API/domain), supports a safety-first API design, and avoids forcing a fullstack Rust UI framework that conflicts with existing UX and frontend direction.

**Initialization Command:**

```bash
# Frontend
npm create vite@latest kalculo-web -- --template react-ts

# Backend (requires cargo-generate)
cargo generate --git https://github.com/thesurlydev/axum-template.git --name kalculo-api
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- Frontend: TypeScript + React
- Backend: Rust + Axum
- Runtime split aligns with current planning artifacts and team skill assumptions

**Styling Solution:**
- Frontend starter is compatible with SCSS customization
- Bulma integration remains a project-level decision layered on top of the starter

**Build Tooling:**
- Frontend: Vite dev/build pipeline with modern bundling defaults
- Backend: Cargo-native build and dependency management

**Testing Framework:**
- Frontend: test stack to be finalized in core decisions step
- Backend: Rust test conventions available immediately; integration setup to be finalized in core decisions step

**Code Organization:**
- Clear repo/app split (`kalculo-web` and `kalculo-api`) to separate concerns
- API/domain design remains fully controllable for healthcare safety constraints

**Development Experience:**
- Fast frontend local loop via Vite
- Strong typed backend compile-time guarantees via Rust
- Maintains flexibility for strict validation, locking lifecycle, and audit boundaries

**Note:** Project initialization using these commands should be the first implementation story.

## Core Architectural Decisions

### Architectural Methodology Baseline

Kalculo architecture follows proven software architecture and design methodologies, with strong alignment to Martin Fowler's guidance on evolutionary architecture, domain modeling, and enterprise application patterns.

**Mandatory principles:**
- Domain-Driven Design (strategic + tactical)
- Clean/Hexagonal Architecture with dependency inversion toward domain
- Command-Query Segregation (strict)
- Tell, Don't Ask
- SOLID principles
- Screaming Architecture (domain-first naming and structure)

**Tactical DDD rules:**
- Use Entities, Value Objects, Aggregates, and explicit Bounded Contexts
- Domain invariants are enforced in domain objects (never delegated to UI or infra)
- No generic "service" abstractions; only intention-revealing use cases and domain behaviors
- Anti-corruption mapping at context and adapter boundaries

**CQS and use case interaction rules:**
- Command and Query use cases are strictly separated
- A use case must never call another use case directly
- Cross-use-case coordination is handled through application orchestration boundaries and/or domain events, not chained handlers

**Boundary validation policy (front + back):**
- All boundary inputs are untrusted by default
- Frontend repositories return unknown-like payloads and application use cases validate/parse before typing
- Backend persistence/external adapter outputs are validated and mapped before entering domain
- Domain model accepts only validated structures and enforces business invariants

**Testing and quality strategy:**
- TDD is mandatory
- Acceptance-oriented unit tests are derived from Gherkin scenarios in user stories
- Prefer in-memory/stubs; mocks only for third-party integrations
- Maintain reusable domain-oriented test data sets
- Avoid 1:1 implementation-coupled tests; prioritize behavior and business outcomes

### Bounded Contexts (Initial Draft)

- IdentityAndAccess
- ChildProfileAndDietTargets
- MenuPlanningAndLocking
- CaregiverSharing
- MealExecutionTracking
- AuditAndTraceability
- NutritionKnowledge

### Architecture Decision Records (Core)

#### ADR-001 - Domain-First Modular Structure (DDD + Clean/Hexagonal)
- Status: Accepted
- Context: Need long-term flexibility, clear business boundaries, and technology independence.
- Decision: Use bounded contexts, each split into modules with `application`, `domain`, `infrastructure`, `presentation`.
- Consequences:
  - Strong separation of concerns and explicit business ownership
  - Easier replacement of frameworks/adapters
  - Requires discipline in dependency direction and naming consistency

#### ADR-002 - Dependency Inversion at Hexagon Boundaries
- Status: Accepted
- Context: Database and external dependencies must not drive core design.
- Decision: Domain and application define ports; infra implements adapters.
- Consequences:
  - Database choice is deferrable
  - Better testability with stubs/in-memory adapters
  - Requires explicit mapping and validation boundaries

#### ADR-003 - Strict CQS and Use Case Isolation
- Status: Accepted
- Context: Preserve clarity of intent and avoid hidden orchestration coupling.
- Decision: Commands and queries are segregated; a use case must never call another use case.
- Consequences:
  - Predictable behavior and simpler reasoning
  - Requires orchestration via dedicated application coordinators and/or domain events

#### ADR-004 - Boundary Validation + Domain Validation
- Status: Accepted
- Context: Front must never trust API; backend must not trust persistence/external data.
- Decision: Validate at boundaries, then enforce invariants in domain.
  - Front: repository payloads treated as unknown, parsed/validated in application use cases (Zod)
  - Back: adapter outputs validated/mapped before entering domain; domain re-validates invariants
- Consequences:
  - Higher resilience to malformed or drifting data contracts
  - Slight extra mapping/validation effort per boundary

#### ADR-005 - TDD + Acceptance-Oriented Tests from Gherkin
- Status: Accepted
- Context: Need flexible architecture and behavior-focused safety net.
- Decision: TDD is mandatory; acceptance-oriented unit tests map to Gherkin scenarios in user stories.
- Consequences:
  - Tests document behavior and business language
  - Reduces implementation-coupled tests and brittle suites

#### ADR-006 - Test Double Policy
- Status: Accepted
- Context: Avoid fragile tests and over-mocking.
- Decision: Prefer in-memory/stubs; mocks reserved for third-party integrations.
- Consequences:
  - More stable tests under refactoring
  - Better confidence in business behavior

#### ADR-007 - Tell, Don't Ask + No Generic Services
- Status: Accepted
- Context: Avoid anemic domain model and accidental procedural orchestration.
- Decision: Domain objects own behavior; no generic service abstractions.
- Consequences:
  - Richer domain model and clearer intent
  - Requires careful aggregate design and command responsibility boundaries

#### ADR-008 - Screaming Architecture + SOLID
- Status: Accepted
- Context: Architecture must reveal business intent and remain maintainable.
- Decision: Domain-first naming and folder structure; enforce SOLID across modules.
- Consequences:
  - Faster onboarding and less ambiguity
  - Governance required in reviews to prevent drift

#### ADR-009 - Architecture Fitness Functions (Automated Guardrails)
- Status: Accepted
- Context: Principles degrade over time without executable checks.
- Decision: Add architecture fitness checks in CI for:
  - no use case -> use case calls
  - no cross-bounded-context direct imports
  - no generic service artifacts
  - dependency direction (presentation/infrastructure -> application -> domain)
- Consequences:
  - Continuous architecture conformance
  - Early drift detection

#### ADR-010 - Test Data Set Strategy
- Status: Accepted
- Context: Acceptance-oriented tests need stable, reusable, domain-meaningful fixtures.
- Decision:
  - Define canonical data sets per bounded context (happy path, edge, invalid, safety-critical)
  - Version datasets with explicit business intent labels
  - Reuse datasets across command/query acceptance tests
- Consequences:
  - Better readability and less duplication
  - Stronger regression safety for domain invariants

#### ADR-011 - Cross-Context Communication Contract
- Status: Accepted
- Context: Bounded contexts must evolve independently without hidden coupling.
- Decision:
  - no direct domain import across bounded contexts
  - communication only via explicit contracts (ACL/adapters/events/contracts)
  - contract versioning policy is mandatory for breaking changes
- Consequences:
  - Better autonomy and replaceability per context
  - Slight upfront design cost for contract governance

#### ADR-012 - Use Case Granularity and Naming
- Status: Accepted
- Context: CQS can degrade into pseudo-generic handlers.
- Decision:
  - each use case represents one business intention
  - naming must be intention-revealing (`LockMenuCommandHandler`, `GetDailyMacroStatusQueryHandler`)
  - multi-step orchestration belongs to dedicated application orchestrators (never chained use cases)
- Consequences:
  - Strong traceability from US/Gherkin to code
  - More files but better maintainability

#### ADR-013 - Frontend Composition Root + DI Context
- Status: Accepted
- Context: Frontend must switch between in-memory stubs and real API adapters without changing UI or use case contracts.
- Decision:
  - introduce a frontend composition root under `src/app/di`
  - map adapters by environment (`VITE_DATA_SOURCE`: `inmemory` default, `api` optional)
  - expose built use cases to presentation through React context provider/hook
- Consequences:
  - predictable adapter switching and cleaner seams for incremental delivery
  - requires strict rule: no adapter selection logic outside composition root

#### ADR-014 - Frontend Module-First Structure by Bounded Context
- Status: Accepted
- Context: Technical top-level folders can erode screaming architecture on frontend.
- Decision:
  - organize frontend by bounded context first (`src/modules/<context>`)
  - keep layered split inside each module (`domain`, `application`, `infrastructure`, `presentation`)
- Consequences:
  - stronger business discoverability and clearer ownership
  - requires discipline for shared code to stay contextualized

#### ADR-015 - CQS Port Naming Convention
- Status: Accepted
- Context: Names like `Reader`/`Service` can become ambiguous as use cases grow.
- Decision:
  - query ports use `*QueryPort`
  - command ports use `*CommandPort`
  - avoid generic names like `Reader`, `Gateway`, `Service` unless domain-specific and explicit
- Consequences:
  - clearer intent and easier CQS audits
  - light migration overhead on existing code and docs

### Failure Mode Analysis

1) Failure mode: CQS drift (use cases start calling each other)
- Signal: command handlers orchestrate other handlers directly
- Impact: hidden coupling, hard-to-test cascades
- Prevention: architecture rules and PR checklist item "no use case -> use case calls"

2) Failure mode: Anemic domain despite DDD labels
- Signal: domain objects become data bags, logic leaks to application layer
- Impact: business rules duplicated and inconsistent
- Prevention: Tell Don't Ask review gate and mandatory domain methods for key invariants

3) Failure mode: Boundary validation bypassed
- Signal: typed objects created from raw API/DB payload without parse/guard
- Impact: runtime corruption and invariant breaches
- Prevention: untrusted-by-default rule and centralized parsing entry points per adapter

4) Failure mode: Generic service reintroduction
- Signal: folders/files like GenericService/CommonService/catch-all helpers
- Impact: loss of screaming architecture and intent
- Prevention: naming conventions and architecture fitness checks in CI

5) Failure mode: Tests coupled 1:1 to implementation
- Signal: brittle tests breaking on harmless refactors
- Impact: low confidence and high maintenance cost
- Prevention: Gherkin-to-acceptance mapping, behavior-oriented assertions, reusable datasets

6) Failure mode: Overuse of mocks
- Signal: mock-heavy suites for internal collaborators
- Impact: false positives and low behavioral fidelity
- Prevention: in-memory/stub-first policy; mock only true third-party boundaries

7) Failure mode: Bounded context erosion
- Signal: cross-context direct imports and shared common domain
- Impact: tight coupling and model confusion
- Prevention: explicit context contracts and anti-corruption mappings

8) Failure mode: Validation split-brain (front and back diverge in rules)
- Signal: front accepts payloads rejected by backend/domain, or reverse
- Impact: user confusion, inconsistent behavior, incident risk
- Prevention:
  - shared validation contract registry (semantic, not code sharing)
  - contract tests per boundary
  - domain remains final authority

9) Failure mode: Screaming architecture erosion by technical folders
- Signal: growth of shared/utils/core without domain language
- Impact: domain intent hidden, coupling increases
- Prevention:
  - PR gate requiring domain-first naming
  - periodic module topology review
  - migration rule: technical utilities must be contextualized or removed

10) Failure mode: Tell Don't Ask violated by rich query plus external if chains
- Signal: application layer reading multiple entity states then deciding behavior externally
- Impact: anemic domain, duplicated business logic
- Prevention:
  - move decisions into aggregate/value objects
  - expose intent methods on domain objects
  - code review checklist item: behavior inside domain

11) Failure mode: Over-orchestration leak
- Signal: application orchestrators become large procedural scripts
- Impact: business logic escapes domain
- Prevention:
  - keep domain decisions inside aggregates/value objects
  - orchestrators only coordinate transaction/order/ports

12) Failure mode: Dataset drift from business language
- Signal: test fixtures use technical keys with unclear intent
- Impact: tests become opaque and fragile
- Prevention:
  - dataset naming in domain language
  - dataset review alongside US/Gherkin updates
  - explicit mapping dataset to scenario

13) Failure mode: Acceptance tests lose CQS boundaries
- Signal: tests validate internals across command and query layers together
- Impact: blurred architecture and false confidence
- Prevention:
  - acceptance tests target contract-level behavior
  - separate command-side assertions from query-side read models

### First Principles Alignment

Fundamental truth #1: Safety-critical nutrition decisions must be trustworthy.
- Architectural implication: domain invariants are the final authority.
- Rule: no data reaches domain behavior without boundary validation and domain validation.

Fundamental truth #2: Delegation must be safe and auditable.
- Architectural implication: explicit state machine and immutable audit trail for lock/share/execute lifecycle.
- Rule: every high-risk transition emits traceable business events.

Fundamental truth #3: Flexibility must survive technology churn.
- Architectural implication: dependencies point inward; adapters remain replaceable.
- Rule: database/framework/UI are details behind ports and contracts.

Fundamental truth #4: Clarity beats cleverness in long-term systems.
- Architectural implication: screaming architecture, intention-revealing use cases, no generic services.
- Rule: if a folder/file name is not domain language, it is suspect.

Fundamental truth #5: Tests are executable specifications, not implementation mirrors.
- Architectural implication: TDD plus acceptance-oriented unit tests from Gherkin plus domain datasets.
- Rule: prefer behavior verification and invariants over structural assertions.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

Critical conflict points identified: 5 major areas where AI agents could diverge: naming, structure, formats, communication, process.

### Naming Patterns

**Database Naming Conventions:**
- Keep database naming implementation-agnostic at architecture level.
- If relational adapters are used later:
  - tables in `snake_case` plural (`menus`, `caregiver_shares`)
  - columns in `snake_case` (`child_profile_id`, `created_at`)
  - foreign keys as `<referenced>_id`
  - indexes as `idx_<table>_<column(s)>`
- Domain model names remain ubiquitous-language oriented and decoupled from persistence naming.

**API Naming Conventions:**
- Resource paths use plural nouns (`/children`, `/menus`, `/caregiver-shares`)
- Path params use `/{resourceId}` style in docs, `:resourceId` in router implementations
- Query params use `camelCase` in HTTP boundary DTOs
- Headers follow standard conventions; custom headers only when necessary and documented

**Code Naming Conventions:**
- Domain types use `PascalCase` (`MenuLockPolicy`, `CaregiverShareWindow`)
- Use cases use intention-revealing CQS names:
  - Commands: `<Verb><BusinessIntent>CommandHandler`
  - Queries: `<Verb><BusinessIntent>QueryHandler`
- Files: `kebab-case` for TS modules, Rust module names in `snake_case`
- Never use generic names like `GenericService`, `CommonManager`, `UtilsService`

### Structure Patterns

**Project Organization:**
- Organize by bounded context first, then module, then layers:
  - `application`
  - `domain`
  - `infrastructure`
  - `presentation`
- Same layered pattern for frontend and backend
- React remains a presentation adapter detail (no React dependency in domain/application)
- Frontend adapter mapping by environment lives only in composition root (`src/app/di`)
- Frontend UI consumes use cases through context/hook abstractions, never infrastructure adapters directly

**File Structure Patterns:**
- Tests colocated with use case/domain behavior when practical, plus context-level acceptance test suites
- Shared utilities allowed only if explicitly contextualized (no global catch-all utils)
- Architecture decisions and rule updates tracked in ADR sections

### Format Patterns

**API Response Formats:**
- Commands return minimal result envelopes for action outcome and identifiers
- Queries return read models optimized for consumption
- Error shape remains stable: `code`, `message`, `details?`, `correlationId?`
- Date/time in API payloads use ISO-8601 UTC strings

**Data Exchange Formats:**
- Front boundaries: repository outputs treated as untrusted (`unknown`-like), validated in application use cases via schema parsing
- Back boundaries: adapter outputs validated and mapped before domain entry
- Domain accepts only validated structures and enforces invariants

### Communication Patterns

**Event System Patterns:**
- Event naming: `<boundedContext>.<aggregate>.<pastTenseAction>` (e.g. `menuPlanning.menu.locked`)
- Event payload includes: `eventId`, `occurredAt`, `version`, `actor`, `contextId`, `payload`
- Event versioning required when payload contracts evolve

**State Management Patterns:**
- Command and query paths are separated conceptually and structurally
- Command side owns business transitions; query side owns read composition
- No use case calls another use case directly

### Process Patterns

**Error Handling Patterns:**
- Distinguish domain errors, application errors, and infrastructure errors
- Domain errors expose business-safe messages and codes
- Infrastructure details must not leak to user-facing responses
- All critical failures logged with correlation context

**Loading State Patterns:**
- Frontend uses explicit loading states per use case intent (`isLockingMenu`, `isLoadingDailyStatus`)
- Prefer local loading scope to avoid global coupling
- Retry behavior is explicit and use-case specific (no blanket retry policy)

### Enforcement Guidelines

**All AI Agents MUST:**
- Respect dependency direction: `presentation/infrastructure -> application -> domain`
- Apply CQS strictly: no command/query chaining, no use case -> use case calls
- Enforce boundary validation plus domain invariant validation before behavior execution
- Use ubiquitous language in names (screaming architecture)
- Follow TDD with acceptance-oriented unit tests from Gherkin scenarios

**Pattern Enforcement:**
- Architecture fitness checks in CI (imports, layering, generic-service bans)
- PR checklist includes:
  - Tell Don't Ask verification
  - CQS boundary verification
  - naming and context-boundary verification
- Violations recorded as architecture debt items with remediation rules

### Pattern Examples

**Good Examples:**
- `LockMenuCommandHandler` validates command DTO, invokes domain aggregate behavior, and persists via port
- `GetDailyMacroStatusQueryHandler` builds read model without mutating domain state
- `CaregiverShareWindow` enforces invariants internally (`canBeExtendedBy`, `revoke`)

**Anti-Patterns:**
- `MenuService` handling create/update/read/share in one class
- Query handler invoking command handler for side effects
- Domain object exposing raw state for external if/else decision trees
- Tests asserting private implementation details instead of business outcomes

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All core decisions are compatible: DDD + Clean/Hexagonal + strict CQS + Tell Don't Ask + Screaming Architecture + SOLID form a coherent, non-contradictory system. The split frontend/backend foundation remains consistent with the architectural boundaries and contract-first communication model.

**Pattern Consistency:**
Implementation patterns reinforce architectural decisions: naming conventions, boundary validation, anti-generic-service rules, CQS constraints, and test strategy are aligned and mutually supportive.

**Structure Alignment:**
The project structure supports bounded-context modularization and layer boundaries on both frontend and backend. Integration boundaries and contract locations are explicitly identified.

### Requirements Coverage Validation ✅

**Feature Coverage:**
All major feature groups are mapped to bounded contexts:
- identity/auth
- child profile and diet targets
- nutrition knowledge and macro reliability
- menu planning and locking
- caregiver sharing
- meal execution tracking
- audit and traceability

**Functional Requirements Coverage:**
FR coverage is complete at architecture level: every functional cluster from the PRD has a corresponding architectural home and boundary.

**Non-Functional Requirements Coverage:**
NFR coverage is strong:
- security and RBAC: addressed through boundary and role rules
- reliability and correctness: domain invariants plus validation strategy
- maintainability and flexibility: ports/adapters plus contract boundaries
- consistency across implementation: fitness checks plus explicit patterns
- UX constraints and mobile-first behavior: reflected in frontend structure and process patterns

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical decisions are documented with ADRs (001-012), including rationale and consequences. Core enforcement principles are explicit.

**Structure Completeness:**
Directory structure and boundaries are defined for both `kalculo-web` and `kalculo-api`, with test/dataset and contract zones identified.

**Pattern Completeness:**
Conflict-prone areas are covered: naming, structure, data formats, communication, and process behavior. Anti-patterns are explicitly documented.

### Gap Analysis Results

**Critical Gaps:** None identified.

**Important Gaps (non-blocking):**
- Tool-level implementation details for architecture fitness checks (exact toolchain) are not yet fixed.
- Contract versioning operational procedure is defined conceptually but not yet detailed as a runbook.
- Cross-context event catalog can be expanded with a concrete initial event list per bounded context.

**Nice-to-Have Gaps:**
- Optional architecture lint templates for TypeScript and Rust repos.
- Optional example golden-path module showing end-to-end CQS plus validation plus tests.
- Optional onboarding snippets for new AI agents to project conventions.

### Validation Issues Addressed

Main risks (use-case chaining, anemic domain, generic services, over-mocking, boundary validation bypass, context erosion) are addressed through ADRs, consistency rules, and failure-mode prevention controls.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented
- [x] Stack direction established
- [x] Integration patterns defined
- [x] Compatibility validated

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete structure defined
- [x] Boundaries established
- [x] Integration points mapped
- [x] Requirements-to-structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Strong domain-centric architecture with explicit boundaries
- High consistency and anti-drift safeguards (ADRs plus fitness approach)
- Test strategy aligned with business behavior and long-term flexibility
- Clear implementation guidance for multiple AI agents

**Areas for Future Enhancement:**
- Operational runbook for contract and version governance
- Concrete CI fitness implementation templates
- Expanded initial event catalog per bounded context

### Implementation Handoff

**AI Agent Guidelines:**
- Follow ADRs and boundary rules exactly
- Apply CQS and validation strategy without exceptions
- Respect context boundaries and naming standards
- Use TDD with acceptance-oriented tests and canonical datasets

**First Implementation Priority:**
Initialize `kalculo-web` and `kalculo-api` foundations, then implement one vertical slice in `menu-planning-and-locking` with full CQS, boundary validation, and acceptance-oriented tests.

## Workflow Completion

Architecture workflow is complete. The document is now the single source of truth for implementation decisions and agent consistency rules.

### Recommended Next Workflows

1. **Create Epics and Stories (required next)**
   - Command: `/bmad-bmm-create-epics-and-stories`
   - Agent: 📋 Product Manager (John)
   - Purpose: Create the full epics/stories breakdown aligned with this architecture.

2. **Check Implementation Readiness**
   - Command: `/bmad-bmm-check-implementation-readiness`
   - Agent: 🏗️ Architect (Winston)
   - Purpose: Validate PRD + UX + Architecture + Epics/Stories coherence before development.

### Execution Guidance

- Run each workflow in a fresh context window.
- Use this architecture document as the canonical reference when answering technical choices.
- Prefer a second, high-quality model for independent validation workflows when available.
