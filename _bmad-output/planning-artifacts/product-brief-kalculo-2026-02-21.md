---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - /Users/johann/PersonalDev/kalculo/_bmad-output/brainstorming/brainstorming-session-2026-02-21.md
date: 2026-02-21
author: Johann
---

# Product Brief: kalculo

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

Kalculo aims to make strict therapeutic diet management safer and simpler for families while enabling trusted caregivers to take care of the child (day trips, weekends, short holidays) without compromising nutritional precision.
The product addresses both practical and emotional pain: reducing parental cognitive load, protecting child safety, and restoring family flexibility through controlled caregiver sharing.

For MVP product experience, Kalculo is explicitly mobile-first and optimized for smartphone and tablet usage in kitchen contexts where quick access matters most.

---

## Core Vision

### Problem Statement

Families managing a strict therapeutic diet must maintain high macro precision every day under time pressure and stress.
This becomes even more critical when care is delegated to relatives: instruction handoff is fragile, risk of mistakes increases, and parental anxiety limits safe delegation.

### Problem Impact

- High mental load and decision fatigue for parents.
- Reduced ability to delegate childcare safely.
- Increased preparation/consumption error risk during handoffs to caregivers.
- Lower family quality of life and reduced child autonomy outside the primary household.

### Why Existing Solutions Fall Short

General nutrition and meal-planning tools are not designed for medically sensitive family workflows:
- insufficient macro reliability controls,
- weak parent/caregiver governance (read-only mode, locking, bounded access windows),
- limited execution history and traceability for trust-critical usage.

### Proposed Solution

Kalculo delivers a fullstack web MVP (React/Vite frontend, Rust backend) focused on:
- creating ketogenic or modified Atkins menus with macro reliability guardrails,
- explicit parental menu locking before sharing,
- temporary, bounded caregiver sharing with read-only access,
- lightweight caregiver execution tracking (consumption checklist),
- baseline security controls (authentication, authorization, access logs).

The product is intentionally non-prescriptive medically: it supports protocol execution and does not replace clinical recommendations.

### Key Differentiators

- Caregiver sharing as the primary differentiator (temporary, bounded, read-only).
- Explicit priority on nutritional reliability (backend invariants and macro controls).
- Trust-first design for sensitive family workflows (locking, traceability, clear responsibilities).
- Product direction grounded in lived family experience.

## Target Users

### Primary Users

#### Segment 1 - Parent diet coordinator
- **Context:** Parent of a child with a condition requiring a strict therapeutic diet, responsible for daily meal compliance.
- **Motivations:** Keep the child safe, reduce operational stress, and delegate care without losing control.
- **Goals:** Define target macros, prepare day-to-day menus, lock plans before execution, and track consumption.
- **Current pains:** High mental load, transmission/calculation error risk, difficulty sharing reliable instructions.

#### Segment 2 - Family caregiver executor
- **Context:** Trusted relative (grandparents, aunts/uncles, etc.) caring for the child during bounded periods.
- **Motivations:** Help confidently without introducing nutritional risk.
- **Goals:** View clear locked menus, follow instructions, confirm executed meals.
- **Current pains:** Uncertainty about exact preparation, fear of mistakes, scattered information.

### Secondary Users

- **Dietitians (post-MVP):** important potential stakeholders for clinical framework review/validation, but excluded from MVP functional scope.
- **MVP boundary:** no dedicated healthcare professional workflow in release 1.

### User Journey

#### Parent Journey
1. **Sign up:** create a secure parent account.
2. **Child onboarding:** define child profile, select diet type (ketogenic or modified Atkins), configure macro targets.
3. **Daily planning:** build menus and validate macro compliance.
4. **Caregiver sharing:** create a bounded sharing window.
5. **Follow-up:** review caregiver checklist updates to reduce uncertainty.

#### Caregiver Journey
1. **Access link/code:** enter temporary shared access.
2. **Read-only consultation:** view locked menus and instructions.
3. **Execution:** prepare/administer meals as planned.
4. **Confirmation:** mark consumption checklist items.
5. **Window expiry:** access ends automatically.

## Success Metrics

Kalculo success is primarily defined by concrete family outcomes: simpler strict diet management, lower parental stress, and safe caregiver delegation without macro reliability loss.

Expected user success (MVP):
- Parents complete and lock menus compliant with child macro targets.
- Caregivers execute shared menus in read-only mode within bounded periods.
- Families return weekly because the product solves a real recurring need.

### Business Objectives

3-6 month objectives (post-MVP):
- Validate product adoption on a critical recurring need.
- Reach retention that proves sustained utility.
- Establish realistic foundations for modest recurring revenue.

### Key Performance Indicators

Product KPIs (user value):
- **Parent activation:** >= 70% complete child onboarding + macros within 48h.
- **Core value creation:** >= 60% of active parents create at least one locked menu per week.
- **Caregiver-sharing usage (differentiator):** >= 40% of active families use caregiver sharing at least once per month.
- **Shared execution:** >= 80% of shared menus have at least one caregiver checklist confirmation.
- **Functional reliability:** 0 known critical production incidents caused by macro calculation errors.

Engagement/retention KPIs:
- **M+1 retention (active parents):** >= 35% during MVP phase.
- **Usage frequency:** median >= 2 sessions/week for active parents.

Business KPIs (realistic early targets):
- **Monetization validation:** first cohort of volunteer families on a lightweight paid offer (initial target: 10-20 families).
- **Early paid conversion:** >= 5% of active families to support/premium once trust is established.
- **Revenue signal:** achieve modest recurring revenue as desirability validation rather than near-term profitability.

## MVP Scope

### Core Features

1. **Baseline authentication and access security**
   - Secure parent account (session/token and route protection).
   - Strict role model (parent vs caregiver, least privilege).
   - Minimal access/sharing event logging.

2. **Child onboarding and diet configuration**
   - Child profile creation.
   - MVP-supported diet types: ketogenic and modified Atkins.
   - Macro target setup (carbs/day, calories/day, key constraints).

3. **Macro reliability engine (critical priority)**
   - Nutritional data consistency checks (protein/fat/carbs, energy coherence).
   - Rust backend invariants to protect calculations.
   - Menu compliance validation against child targets before locking.

4. **Parent menu creation and locking**
   - Day-by-day menu construction.
   - Explicit menu locking before caregiver sharing.
   - Historical menu preservation for traceability.

5. **Bounded caregiver sharing (primary differentiator)**
   - Sharing windows for day/weekend/short holidays.
   - Read-only caregiver access (no menu editing).
   - Automatic access expiration.

6. **Caregiver execution and consumption checklist**
   - Clear view of planned meals.
   - Simple checklist (done/not done) for parent follow-up.

7. **Legal framing and product responsibility**
   - Explicit non-prescriptive medical positioning.
   - Terms acceptance in parent journey.

8. **Mobile-first responsive product experience (MVP channel strategy)**
   - Responsive UI designed for smartphones first, then tablets.
   - MVP supports mobile and tablet usage only.
   - Desktop experience is intentionally deferred to post-MVP.
   - UX optimized for quick kitchen access and short interaction loops.

### Out of Scope for MVP

- Integrated parent-caregiver chat.
- Complex notifications and advanced automations.
- Caregiver recipe/menu editing.
- Dedicated dietitian workflows.
- Automated medical recommendations or therapy adjustments.
- Complex third-party integrations (EHR, e-prescription, wearables, etc.).
- Full desktop-optimized experience (deferred to post-MVP).

### MVP Success Criteria

- Parents can configure child + macros and create/lock compliant menus without critical blockers.
- Caregivers can execute shared menus in read-only mode during active windows.
- No known critical production incident caused by macro calculation errors.
- Caregiver sharing is used recurrently by a meaningful share of active families.
- Families report lower perceived stress during delegation periods.
- Core parent and caregiver journeys are completed on mobile/tablet with fast kitchen-friendly interactions.

### Future Vision

- Expanded supported diets and advanced nutritional rule sets.
- Optional professional space for dietitians (framework review/validation).
- Richer family coordination tools (smart notifications, calendar sync).
- Deeper reporting for longitudinal follow-up.
- Progressive monetization (premium/support offer) after usage and trust validation.
- Full desktop experience with workflows tailored for longer planning sessions.
