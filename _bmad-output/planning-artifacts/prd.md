---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
date: 2026-02-21
inputDocuments:
  - /Users/johann/PersonalDev/kalculo/_bmad-output/planning-artifacts/product-brief-kalculo-2026-02-21.md
  - /Users/johann/PersonalDev/kalculo/_bmad-output/brainstorming/brainstorming-session-2026-02-21.md
workflowType: 'prd'
documentCounts:
  briefCount: 1
  researchCount: 0
  brainstormingCount: 1
  projectDocsCount: 0
classification:
  projectType: web_app
  domain: healthcare
  complexity: high
  projectContext: greenfield
---

# Product Requirements Document - kalculo

**Author:** Henry
**Date:** 2026-02-21

## Executive Summary

Kalculo is a mobile-first (phone + tablet) healthcare web application designed to reduce clinical risk and caregiver friction in strict therapeutic diet execution for children. It targets family environments where macro precision is safety-critical and meal handoffs to relatives are operationally fragile.

The product solves two coupled problems: (1) high parental cognitive load in daily compliant planning, and (2) unsafe delegation when caregivers lack controlled, reliable instructions. The MVP addresses this by combining macro reliability controls, explicit parent locking, and time-bounded caregiver read-only access in a kitchen-speed workflow.

### What Makes This Special

Kalculo's primary differentiator is **controlled caregiver sharing**: parents lock validated menus, then share execution access for a defined period with least-privilege constraints. This turns delegation from informal messaging into governed execution.

The core insight is that trust in this domain requires both:
- **calculation reliability** (backend macro invariants, compliance validation), and
- **responsibility boundaries** (role separation, read-only caregiver model, bounded access lifecycle).

The product is explicitly non-prescriptive medically: it supports protocol execution, not clinical decision-making.

## Project Classification

- **Project Type:** Web App (mobile-first responsive UX)
- **Domain:** Healthcare (medically sensitive family workflow)
- **Complexity:** High
- **Project Context:** Greenfield
- **Delivery Scope Constraint:** MVP supports mobile and tablet only; desktop is deferred post-MVP

## Success Criteria

### User Success

- Parents can configure a child profile and macro targets quickly, then produce locked compliant menus without critical friction.
- Caregivers can execute shared menus confidently in read-only mode during bounded access windows.
- Families report lower stress during delegation periods and continue using the app weekly.
- Mobile/tablet kitchen usage is efficient: key tasks are completed in short interaction loops with minimal navigation overhead.

### Business Success

- 3-month signal: validate adoption for a recurring high-need use case (strict family therapeutic diet execution).
- 6–12 month signal: demonstrate sustained retention and repeat caregiver-sharing usage.
- Early monetization signal: establish a modest recurring revenue baseline through lightweight paid/support offering once trust is validated.
- Conversion quality matters more than top-line vanity metrics: active families using core flows are the primary value indicator.

### Technical Success

- Zero known critical production incidents caused by macro calculation errors.
- Role boundaries are enforced (parent vs caregiver) with no unauthorized mutation paths in caregiver context.
- Time-bounded sharing lifecycle is reliable (activation, visibility, expiration) and auditable.
- Core mobile/tablet performance supports kitchen usage (responsive UI, fast critical-path actions).

### Measurable Outcomes

- >= 70% parent activation: child onboarding + macro setup completed within 48h.
- >= 60% of active parents create at least one locked menu per week.
- >= 40% of active families use caregiver sharing at least once per month.
- >= 80% of shared menus include at least one caregiver checklist confirmation.
- >= 35% M+1 retention among active parents during MVP phase.
- Median active-parent usage >= 2 sessions/week.

## Product Scope

### MVP - Minimum Viable Product

- Baseline auth + RBAC (parent/caregiver roles).
- Child onboarding and therapeutic diet macro target configuration.
- Macro reliability checks and menu compliance validation.
- Parent daily planning, menu locking, and bounded caregiver sharing.
- Caregiver read-only execution + checklist confirmation.
- Mobile-first responsive UX for smartphone and tablet only.

### Growth Features (Post-MVP)

- Expanded observability and richer audit views.
- Enhanced family coordination tooling (light notifications, smarter follow-up).
- Optional backup/export improvements and operational analytics.
- Structured monetization rollout with validated pricing/packaging.

### Vision (Future)

- Dietitian-facing collaboration workflows.
- Expanded diet protocol support and advanced nutrition rule modeling.
- Full desktop experience optimized for longer planning sessions.
- Broader ecosystem integrations if and when justified by adoption.

## User Journeys

### Journey 1 - Primary User (Parent) Success Path: "Reliable daily planning and safe handoff"

**Opening scene:**  
Henry is preparing meals in the kitchen before a workday. He needs strict therapeutic compliance but has limited time and high cognitive load.

**Rising action:**  
He signs in on mobile, opens child profile targets, builds the day menu, sees compliance feedback, fixes a flagged item, then locks the menu. He creates a caregiver sharing window for Saturday morning to Sunday evening.

**Climax:**  
The app confirms: menu locked, macros compliant, caregiver access active only in the defined time window.

**Resolution:**  
Henry delegates with confidence, tracks caregiver checklist confirmations, and experiences reduced stress. The product becomes part of his weekly planning routine.

### Journey 2 - Primary User (Parent) Edge Case: "Recovering from invalid data or late change"

**Opening scene:**  
A planned meal appears compliant initially, but one ingredient has incomplete nutrition data discovered during final validation.

**Rising action:**  
The system blocks lock action, highlights inconsistency reason, and guides replacement/refinement options. Henry swaps the item and reruns validation.

**Climax:**  
Compliance is restored and lock succeeds without manual recalculation spreadsheets.

**Resolution:**  
Potential unsafe handoff is avoided. Parent trust increases because the system catches risk before sharing.

### Journey 3 - Secondary User (Caregiver) Execution Path: "Do the right thing without editing risk"

**Opening scene:**  
A grandparent receives temporary access before a weekend childcare period and needs clear instructions quickly.

**Rising action:**  
They open the shared view on tablet, read locked meals and notes, and execute meal-by-meal with checklist confirmation.

**Climax:**  
A meal is completed and marked immediately; parent visibility is updated.

**Resolution:**  
Caregiver feels confident, parent feels reassured, and no accidental plan edits occur due to read-only constraints.

### Journey 4 - Operations/Safety Oversight Path: "Audit and trust validation"

**Opening scene:**  
After delegation, the parent wants to verify who accessed the plan and when, especially during a sensitive care window.

**Rising action:**  
They open activity/audit history and review key events: share created, caregiver access, checklist updates, expiry.

**Climax:**  
All events align with expected window and actor permissions.

**Resolution:**  
Operational trust is reinforced; anomalies can be spotted early and discussed before the next handoff.

### Journey Requirements Summary

Journeys reveal required capability groups:

- **Identity & Access:** secure auth, strict RBAC, caregiver read-only enforcement.
- **Clinical-safety planning:** macro validation engine, compliance status before locking.
- **Handoff governance:** explicit lock state, bounded sharing windows, automatic expiry.
- **Execution tracking:** caregiver checklist with parent visibility.
- **Trust & auditability:** event logs for key access and sharing actions.
- **Mobile/tablet UX:** kitchen-speed interactions, short task loops, clear status feedback.

## Domain-Specific Requirements

### Compliance & Regulatory

- The product must be explicitly framed as a non-prescriptive execution tool, not a medical decision or treatment recommendation engine.
- Terms and consent flows must clearly define responsibility boundaries (parent, caregiver, product).
- Access to sensitive child health-related diet data must follow privacy-by-design principles and auditable access patterns.
- Clinical-safety posture must prioritize prevention of harmful macro-calculation outcomes.

### Technical Constraints

- Strict RBAC enforcement (parent vs caregiver read-only) with least-privilege defaults.
- Tamper-resistant locked menu state before caregiver execution.
- End-to-end transport security and secure at-rest storage for sensitive user and nutrition data.
- Macro validation invariants in backend (coherence checks, compliance gates) must block unsafe plans from being shared.
- Reliable audit logging for critical actions (lock, share, access, checklist updates, expiry).

### Integration Requirements

- MVP requires no mandatory external healthcare integrations (e.g., EMR/EHR), by design.
- Internal data model must still be structured to support future integration capabilities without schema rework.
- Future-ready API boundaries should separate nutrition engine logic, sharing lifecycle, and audit trail services.

### Risk Mitigations

- **Risk:** macro miscalculation leads to unsafe execution.  
  **Mitigation:** mandatory validation gates + lock-before-share policy + critical path test coverage.
- **Risk:** caregiver privilege escalation or accidental edits.  
  **Mitigation:** hard read-only enforcement + server-side authorization checks.
- **Risk:** ambiguous product responsibility in sensitive context.  
  **Mitigation:** explicit legal language and UX copy at onboarding and sharing points.
- **Risk:** kitchen-context usability failures increase error probability.  
  **Mitigation:** mobile/tablet-first UX with short flows, clear status states, and minimal interaction friction.

## Innovation & Novel Patterns

### Detected Innovation Areas

- Governed caregiver handoff model: locked therapeutic menus + time-bounded read-only caregiver access.
- Trust-by-design pairing: macro reliability invariants + responsibility boundaries as one product mechanism.
- Kitchen-speed mobile flow: interaction model optimized for short high-stakes actions on mobile/tablet.

### Market Context & Competitive Landscape

- Generic meal planners and diet apps usually optimize convenience, not medically sensitive delegation governance.
- Clinical tools often focus on professionals, while family tools often lack strict compliance controls.
- Kalculo differentiates through a family-first execution layer for sensitive diet protocols, not through medical recommendation logic.

### Validation Approach

- Validate caregiver-sharing differentiator with cohort usage:
  - frequency of bounded sharing windows,
  - completion of caregiver checklist events,
  - reduced parent stress signals.
- Validate safety posture with:
  - zero critical macro-calculation incidents,
  - zero caregiver unauthorized mutation paths.
- Validate kitchen usability on mobile/tablet with critical-path completion time and error rate.

### Risk Mitigation

- **Risk:** innovation perceived as too rigid for caregivers.  
  **Mitigation:** simplify read-only execution UX and provide clear contextual instructions.
- **Risk:** trust claims not supported in real usage.  
  **Mitigation:** audit visibility and explicit status signaling (locked/compliant/shared/expired).
- **Risk:** novelty not compelling enough for adoption.  
  **Mitigation:** prioritize measurable delegation outcomes over feature breadth in MVP.

## Web App Specific Requirements

### Project-Type Overview

Kalculo is implemented as a single-page web application (SPA) optimized for mobile-first usage (smartphone and tablet in kitchen contexts), with desktop explicitly deferred post-MVP.
The MVP prioritizes reliability, clarity, and controlled execution flows over advanced real-time behavior.

### Technical Architecture Considerations

- Frontend architecture uses SPA routing and state management suitable for authenticated, task-focused workflows.
- Browser compatibility targets main modern browsers (latest stable Chrome, Safari, Firefox, Edge), with strong emphasis on mobile Safari and Chrome on mobile devices.
- SEO is not a delivery objective for MVP because core value is in authenticated product flows.
- Data freshness strategy is refresh-based for MVP (no websocket or polling channels).

### Required Web App Sections

#### Browser Matrix

- Support modern evergreen browsers on mobile and tablet.
- Validate critical journeys on:
  - iOS Safari (latest stable),
  - Android Chrome (latest stable),
  - Desktop Chrome/Firefox/Edge/Safari (basic functional compatibility only, since desktop UX is post-MVP).

#### Responsive Design

- Mobile-first responsive breakpoints with tablet optimization.
- Kitchen-speed interaction constraints:
  - short flows,
  - large actionable controls,
  - clear status signaling (locked/compliant/shared/expired),
  - low cognitive overhead.

#### Performance Targets

- Fast initial load and route transitions on average mobile networks.
- Critical paths (menu validation, lock, share, checklist update) must remain responsive under normal family usage load.
- No real-time sync guarantees in MVP; user-initiated refresh is the source of freshness.

#### Accessibility Level (proposed baseline)

- Proposed MVP baseline: WCAG 2.1 AA on core parent/caregiver flows.
- Prioritize readable contrast, touch target sizing, keyboard/focus support, and clear error messaging.

### Implementation Considerations

- Keep API contracts explicit and stable to support refresh-driven synchronization.
- Ensure UI communicates refresh expectations clearly where freshness matters.
- Avoid introducing real-time infrastructure in MVP to reduce complexity/risk; reassess after adoption signals.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:**  
Safety-first problem-solving MVP with strong caregiver-handoff validation. The goal is to prove that governed delegation and macro reliability create real recurring family value.

**Resource Requirements:**  
Lean team:
- 1 fullstack developer (React/Vite + Rust),
- 1 product/UX owner (part-time),
- optional QA support (part-time) focused on critical-path reliability.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Parent success path (plan, validate, lock, share).
- Parent edge case recovery (invalid data correction before lock).
- Caregiver read-only execution with checklist confirmation.

**Must-Have Capabilities:**
- Secure auth + RBAC (parent/caregiver, least privilege).
- Child profile + therapeutic macro target setup.
- Macro reliability checks and compliance gating before lock/share.
- Parent daily menu planning and explicit lock state.
- Time-bounded caregiver sharing with automatic expiry.
- Caregiver read-only interface + consumption checklist updates.
- Mobile-first responsive UX (phone + tablet only).
- Baseline audit trail for critical actions.

### Post-MVP Features

**Phase 2 (Post-MVP):**
- Stronger audit views and operational observability.
- Better caregiver coordination UX (light notification patterns).
- PDF/export and practical resilience features.
- Early packaging/pricing experiments for monetization.

**Phase 3 (Expansion):**
- Dietitian collaboration workflows.
- Expanded therapeutic diet protocols and advanced nutrition rules.
- Desktop-first planning experience for longer sessions.
- Potential ecosystem integrations if demand justifies complexity.

### Risk Mitigation Strategy

**Technical Risks:**
- Highest risk: macro engine correctness plus role boundary enforcement.
- Mitigation: strict invariants, critical-path test coverage, lock-before-share policy, secure defaults.

**Market Risks:**
- Risk: families do not adopt sharing model consistently.
- Mitigation: instrument caregiver-sharing usage and stress reduction signals early; iterate on handoff UX quickly.

**Resource Risks:**
- Risk: Rust learning curve slows delivery.
- Mitigation: keep architecture modular, avoid real-time complexity in MVP, prioritize must-have flows only.

## Functional Requirements

### Identity, Access, and Roles
- FR1: Parents can create and access a secure account.
- FR2: Caregivers can access shared content only through delegated access.
- FR3: The system can enforce role-based permissions between parent and caregiver roles.
- FR4: Parents can end caregiver access by ending or revoking an active sharing window.
- FR5: The system can automatically expire caregiver access when the sharing window ends.

### Child Profile and Diet Configuration
- FR6: Parents can create and manage a child profile.
- FR7: Parents can set a diet protocol type for a child (MVP: ketogenic, modified Atkins).
- FR8: Parents can define and update child-specific macro targets.
- FR9: The system can preserve a timestamped history of target-setting changes for each child, including actor identity and previous and new values.

### Food Data and Macro Reliability
- FR10: Parents can add/select food items for menu planning.
- FR11: The system can validate nutrition data coherence before allowing compliant planning.
- FR12: The system can reject invalid or incomplete nutrition data with actionable feedback.
- FR13: The system can calculate menu-level macro totals from selected meal items.
- FR14: The system can assess whether a menu is compliant with child targets.

### Menu Planning and Locking
- FR15: Parents can create daily menus composed of meal items.
- FR16: Parents can update draft menus before lock.
- FR17: Parents can lock a menu to freeze its executable content.
- FR18: The system can prevent modification of locked menus by non-parent actors.
- FR19: The system can preserve historical locked menus for later review.

### Caregiver Sharing and Execution
- FR20: Parents can create a bounded sharing window for one or more locked menus.
- FR21: Caregivers can view shared locked menus in read-only mode.
- FR22: Caregivers can confirm meal execution through checklist actions.
- FR23: Parents can view caregiver checklist updates linked to shared menus.
- FR24: The system can display sharing state status (active, pending, expired, revoked).

### Auditability and Trust
- FR25: The system can record access and sharing lifecycle events including share created, share activated, menu viewed, checklist updated, share revoked, and share expired.
- FR26: Parents can review an event history relevant to delegated care periods.
- FR27: The system can associate access and sharing lifecycle events with actor identity and timestamp.

### Product Responsibility and Safety Framing
- FR28: The product can present non-prescriptive medical positioning in onboarding, macro configuration, sharing setup, and caregiver shared-view flows.
- FR29: Parents can accept terms and responsibility boundaries before child onboarding, menu planning, and caregiver sharing actions.
- FR30: The system can prevent sharing of non-compliant menus.

### Mobile-First Interaction
- FR31: Parents can complete child onboarding, macro configuration, menu planning, menu lock, and sharing setup workflows on smartphone and tablet form factors.
- FR32: Caregivers can complete shared-menu viewing and meal checklist confirmation workflows on smartphone and tablet form factors.
- FR33: The product can provide responsive layouts for supported MVP device categories (mobile/tablet).
- FR34: The system can support user-initiated data updates for MVP workflows.

## Non-Functional Requirements

### Performance
- NFR1: 95% of core parent actions (open day plan, validate menu, lock menu, create share window) complete within 2 seconds on standard mobile networks.
- NFR2: 95% of caregiver core actions (open shared menu, mark checklist item) complete within 2 seconds.
- NFR3: Initial authenticated app load completes within 3 seconds for typical MVP payload size on modern mobile devices.
- NFR4: Server-side compliance validation responses complete within 1 second for typical daily menus.

### Security
- NFR5: All sensitive data is encrypted in transit using industry-standard secure protocols and encrypted at rest in persistent storage.
- NFR6: Role-based access control is enforced server-side for every protected action.
- NFR7: Caregiver role is strictly read-only for menu content; unauthorized mutation attempts are denied and logged.
- NFR8: Authentication state handling must enforce secure expiration and invalidation behavior.
- NFR9: Critical security events (auth failures, access denials, permission violations) are audit logged.

### Reliability
- NFR10: The system achieves 99.5% monthly availability for MVP production service windows.
- NFR11: Locked menu integrity is preserved across failures and retries (no partial lock states).
- NFR12: Sharing window state transitions (active/expired/revoked) are deterministic and recoverable after restart.
- NFR13: Data persistence for child targets, locked menus, and checklist events is durable and recoverable.

### Accessibility
- NFR14: Core parent/caregiver MVP flows meet WCAG 2.1 AA baseline.
- NFR15: Interactive controls in critical kitchen flows provide touch-target sizing appropriate for mobile use.
- NFR16: Error and validation states are communicated with accessible text, not color alone.
- NFR17: Keyboard/focus navigation is supported for core authenticated flows.

### Scalability
- NFR18: MVP architecture supports at least 10x growth from initial pilot user baseline without major redesign.
- NFR19: Performance degradation remains under 10% under projected MVP growth load profile.
- NFR20: Read-heavy caregiver access periods do not materially degrade parent planning operations.

### Integration
- NFR21: Internal service interface contracts remain stable and versionable to support future external integrations.
- NFR22: Data model and event semantics are structured to enable future healthcare/professional integrations without breaking MVP workflows.
- NFR23: Export and data interchange paths use documented formats to support future interoperability work.
