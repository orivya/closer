# CLOSER — Master Design + Development Prompt (V1)
## Use this for every page to keep the Home/Connect aesthetic consistent

This file is a reusable “master prompt” you (or an assistant) follow **page-by-page** so the product stays cohesive.

Primary sources of truth:
- Route map + required screen states: `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`
- Build order (product-first): `CLOSER_V1_PAGE_ORDER_PRODUCT_FIRST.md` (recommended)
- Build order (launch-first alternative): `CLOSER_V1_PAGE_ORDER.md`
- Build sequence rationale: `CLOSER_V1_BUILD_SEQUENCE.md`
- Design system: `CLOSER_DESIGN_DNA.md`
- Component library (from the prototype): `CLOSER_COMPONENT_LIBRARY_FROM_PROTOTYPE.md`
- Next.js foundation (Phase 0): `CLOSER_NEXTJS_FOUNDATION.md`
- Page UI specs: `CLOSER_PAGES_SPECIFICATION.md`, `CLOSER_GAME_PAGES_DESIGN_SPEC.md`, `CLOSER_MOMENTS_MESSAGES_SPEC.md`
- Gifts UI specs: `CLOSER_VIRTUAL_GIFTS_PAGES_DESIGN_SPEC.md`
- Monetization/gating rules: `CLOSER_V1_ENTITLEMENTS_AND_MONETIZATION_MATRIX.md`
- Prototype visual anchor (golden reference for Home + Connect): `closer_world_class_premium_dashboard_refined_2026_clean.html`

---

# A) Recommended Workflow (Best Way To Build Without Losing Context)

## A.1 Work in phases, but implement one route at a time

Best practice is **phased batching**:
1. Build shared components/patterns once (auth card, settings rows, grid cards, modals, toasts).
2. Within that phase, implement routes one-by-one in the order in your chosen checklist (recommended: `CLOSER_V1_PAGE_ORDER_PRODUCT_FIRST.md`).

Why phases are better than fully “one page at a time”:
- You avoid re-designing the same patterns (forms, tabs, empty states) repeatedly.
- You keep typography, spacing, and motion consistent because they’re centralized early.
- Monetization gates get implemented as reusable states/components instead of ad-hoc per page.

## A.2 Definition of Done (for every route)

A route is not “done” until it has:
- Visual parity with the Home/Connect aesthetic (tokens, surfaces, typography, motion)
- Required screen states from `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md` (loading, empty, error, locked, success)
- Correct navigation (sidebar/mobile), back behavior, and cross-links
- Correct gating per `CLOSER_V1_ENTITLEMENTS_AND_MONETIZATION_MATRIX.md` (Free/Plus/Pro + couple-shared)
- Accessibility baseline (focus, labels, reduced motion, contrast)

---

# B) Non‑Negotiables (Cohesive “Closer” Aesthetic)

## B.1 Layout + Shell
- Use the same shell patterns as Home/Connect: desktop sidebar + mobile bottom nav.
- Keep content in the `.container` pattern (`CLOSER_DESIGN_DNA.md`).
- Use subtle surfaces and ultra-thin borders; reserve blur/glass for the few places the clean prototype uses it (timezone pill, chat header, mobile nav).

## B.2 Color + Type
- Do not introduce new base colors outside the design tokens in `CLOSER_DESIGN_DNA.md`.
- Titles/headlines: Fraunces (light weight).
- Body/UI: Manrope (confident weights for labels/buttons).

## B.3 Motion
- Use the same easing/durations (`CLOSER_DESIGN_DNA.md`).
- Prefer subtle, “expensive” motion: fade/slide, gentle glows, no bouncy gimmicks.
- Respect reduced motion (no auto-looping animations without a still fallback).

## B.4 Copy (Language Consistency)
- Use partner names (never “Player 1/2”).
- Use intimate language (“Together”, “I’ll start”, “Waiting for [Name]…”) per `CLOSER_MASTER_SPECIFICATION.md` language refinements.
- Avoid “gamey” labels (“score”, “coins”, “levels”) in V1.

---

# C) Page Build Protocol (Use This Every Time)

For each route in your chosen page order checklist, follow this protocol before writing UI:

1. **Confirm the route + required states**
   - Find the route in `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`.
   - List the required states for this route (loading, empty, error, locked, success, waiting).

2. **Identify gating + entitlement logic**
   - Check `CLOSER_V1_ENTITLEMENTS_AND_MONETIZATION_MATRIX.md` for:
     - tier restrictions (Free/Plus/Pro)
     - couple-shared subscription logic
     - one-time purchase behavior (gifts, theme packs)

3. **Map data dependencies (even if mocked)**
   - What does the page need to render?
   - What is the “happy path” payload?
   - What’s the empty payload?
   - What failure modes exist (network, auth expired, partner not linked)?

4. **Reuse components first**
   - Prefer existing primitives and patterns.
   - If a new UI pattern appears on 2+ pages, promote it to the component library.

5. **Implement the page UI**
   - Match spacing, type scale, and surface treatments.
   - Implement all required states *in the same PR/iteration* (no “we’ll add empty states later”).

6. **Wire navigation + cross-links**
   - Ensure CTAs land on existing routes.
   - If a CTA would require a new route, stop and update `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md` first.

7. **Accessibility + quality pass**
   - Keyboard traversal works end-to-end.
   - Focus is managed for modals and route transitions.
   - Form errors are announced and visible.
   - Reduced motion path is valid.

---

# D) Master Prompt Template (Copy/Paste)

Use this exact prompt whenever you build a page. Replace the bracketed fields.

## D.1 SYSTEM / MASTER PROMPT

You are building **Closer (V1)**, a premium dark-mode web app for couples. The UI must match the aesthetic of Home/Connect in `closer_world_class_premium_dashboard_refined_2026_clean.html`, using tokens and patterns from `CLOSER_DESIGN_DNA.md`.

Hard constraints:
- No new routes outside `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`.
- Follow the build order in `CLOSER_V1_PAGE_ORDER_PRODUCT_FIRST.md` (or `CLOSER_V1_PAGE_ORDER.md` if using the launch-first track).
- Implement required screen states for the route (loading/empty/error/locked/success/waiting).
- Apply gating rules exactly as defined in `CLOSER_V1_ENTITLEMENTS_AND_MONETIZATION_MATRIX.md` (couple-shared subscription benefits).
- Keep typography/colors/motion consistent with `CLOSER_DESIGN_DNA.md`.
- Use intimate copy (partner-aware language) and avoid “gamey” terms.
- Maintain accessibility: labels, focus, keyboard, reduced motion.

Output expectations for this page:
- The route UI (and/or Figma-ready design spec) for: `[ROUTE]`
- A list of reusable components created/reused
- A checklist of implemented states and gates
- Any open questions or missing upstream decisions (should be rare; route map is canonical)

## D.2 PAGE BRIEF (fill this in per route)

Route: `[ROUTE]`

Purpose (1 sentence): `[WHY THIS PAGE EXISTS]`

Users:
- Auth state: `[Public/Auth/Coupled]`
- Typical entry points: `[FROM WHICH ROUTES]`

Required states (must implement):
- `[state_1]`
- `[state_2]`
- …

Gates (must implement):
- `[Free vs Plus vs Pro rules for this page]`
- `[one-time purchase rules if applicable]`

Key components to reuse:
- `[component_1]`
- `[component_2]`

Cross-links (must work):
- Primary CTA → `[route]`
- Secondary CTA → `[route]`
- Back behavior → `[route]`

Primary spec references (do not deviate):
- `[spec file(s) + section(s)]`

Acceptance checklist:
- Matches Home/Connect surfaces + typography + motion
- All states present (loading/empty/error/locked/success)
- All gates route to `/us/subscription` (or correct purchase flow for gifts/themes)
- Keyboard + reduced motion supported

---

# E) Page Group Prompts (When Working In Batches)

Use these when a phase includes many similar pages.

## E.1 “Auth Card” pages (login/signup/verify/reset)

Goal: identical background + centered card treatment; only the form content changes.
Shared components:
- `AuthShell` (ambient background + centered surface)
- `AuthCard` (title, subtitle, form area, footer links)
- `SocialAuthButtons` (Google/Apple)
- `FormErrorBanner`, `Input`, `PasswordInput`, `PrimaryButton`

## E.2 “Settings Row” pages (`/us/*`)

Goal: consistent list patterns across profile/settings/subscription/privacy/help.
Shared components:
- `SettingsPageShell` (header + back + container)
- `SettingsCard`, `SettingsRow`, `ToggleRow`, `LinkRow`
- `PlanCard`, `Badge`, `UpgradePrompt`

## E.3 “Activity Flow” pages (`/connect/*`)

Goal: one shared sync model everywhere (“Together / I’ll start”), shared waiting states, shared reveal pacing.
Shared components:
- `SyncModeSwitch` (together vs async)
- `WaitingForPartner` (presence + nudge)
- `RevealLayout` (side-by-side answers/votes)
- `SaveToMomentsPrompt` (consistent)

## E.4 “Catalog” pages (gifts, achievements)

Goal: premium grid cards with predictable hover/tap patterns.
Shared components:
- `FilterTabs`, `SearchInput`, `GridCard`, `EmptyState`, `DetailPanel`
