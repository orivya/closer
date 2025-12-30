# CLOSER — Canonical Routes & Screen States (V1)

This document is the **single source of truth** for:
- Which URLs/routes exist for V1
- Which routes are public vs authenticated
- The primary **screen states** that must be designed for each route (success, empty, waiting, etc.)
- Redirects/aliases to resolve disagreements across specs

If another spec conflicts with this route map, **this doc wins**.

Companion docs:
- Page order (product-first): `CLOSER_V1_PAGE_ORDER_PRODUCT_FIRST.md`
- Page order (launch-first alternative): `CLOSER_V1_PAGE_ORDER.md`
- Build sequence rationale: `CLOSER_V1_BUILD_SEQUENCE.md`
- Monetization & gating: `CLOSER_V1_ENTITLEMENTS_AND_MONETIZATION_MATRIX.md`
- Page-by-page prompt: `CLOSER_MASTER_DESIGN_DEV_PROMPT.md`

---

## Conventions (Route vs Screen State)

- **Route**: A distinct URL path (ex: `/connect/time-capsule/create/date`).
- **Screen state**: A distinct UI state *within* a route (ex: “reset email sent” inside `/forgot-password`).
- **Modal/overlay**: Not a route unless explicitly implemented as one (ex: “upgrade prompt”).

For planning/design, **every screen state is treated as a design deliverable**, even if it doesn’t get its own route.

---

## Resolved Decisions (Spec Conflicts)

### 1) Onboarding routes (resolve `CLOSER_MASTER_SPECIFICATION.md:74` vs `CLOSER_PAGES_SPECIFICATION.md:1496`)

**Canonical routes (V1):**
- `/onboarding/profile` — Step 1
- `/onboarding/partner` — Step 2
- `/onboarding/setup` — Step 3 (timezone + anniversary + completion)

**Why**: V1 uses a 3-step onboarding for speed and reduced surface area; “timezone” and “anniversary” are separate **screen states** inside `/onboarding/setup`.

**Aliases/redirects allowed (to keep older references valid):**
- `/onboarding/timezone` → `/onboarding/setup` (state: `timezone`)
- `/onboarding/anniversary` → `/onboarding/setup` (state: `anniversary`)
- `/onboarding/complete` → `/onboarding/setup` (state: `complete`)
- `/onboarding` → `/onboarding/profile` (start)

### 2) Create-flow routes (resolve multi-step ambiguity)

**Time Capsule create flow is step-routed:**
- `/connect/time-capsule/create/date`
- `/connect/time-capsule/create/message`
- `/connect/time-capsule/create/media`
- `/connect/time-capsule/create/preview`

**Dream Builder create flow is step-routed:**
- `/connect/dream-builder/create/category`
- `/connect/dream-builder/create/define`
- `/connect/dream-builder/create/timeline`
- `/connect/dream-builder/create/milestones`
- `/connect/dream-builder/create/confirm`

**Redirect convenience routes (optional but recommended):**
- `/connect/time-capsule/create` → `/connect/time-capsule/create/date`
- `/connect/dream-builder/create` → `/connect/dream-builder/create/category`

### 3) Weekly Check-in waiting state (resolve missing-in-inventory reference)

**Canonical route:**
- `/connect/rituals/weekly`

**Required screen states inside the route:**
- `intro` → `questions` → `submitted` → `waiting_for_partner` → `reveal` → `saved_to_moments`

**Alias (optional):**
- `/connect/rituals/weekly/waiting` → `/connect/rituals/weekly` (state: `waiting_for_partner`)

### 4) Truth or Dare + 36 Questions (resolve “is this V1?”)

These are **explicitly Post‑V1**:
- `/connect/truth-or-dare`
- `/connect/36-questions`

**Why**: They are not included in the V1 page inventory (`CLOSER_MASTER_SPECIFICATION.md:74`) and are not represented in the V1 backend schema/endpoints (`CLOSER_TECHNICAL_INFRASTRUCTURE.md:229`).

---

## Canonical Route Map (V1)

Each route lists: **Auth** (Public / Auth), primary **screen states**, and the most relevant design spec source(s).

### A) Public marketing (Logged-out)

| Route | Auth | Screen states to design | Spec references |
|---|---|---|---|
| `/` | Public | landing; logged-in redirect | `CLOSER_PRODUCTION_ESSENTIALS.md` |
| `/features` | Public | standard; mobile/desktop | `CLOSER_PRODUCTION_ESSENTIALS.md` |
| `/pricing` | Public | standard; FAQ expand/collapse | `CLOSER_PRODUCTION_ESSENTIALS.md` |
| `/about` | Public | standard | `CLOSER_PRODUCTION_ESSENTIALS.md` |

### B) Auth + account recovery

| Route | Auth | Screen states to design | Spec references |
|---|---|---|---|
| `/login` | Public | default; error; loading | `CLOSER_PAGES_SPECIFICATION.md` |
| `/signup` | Public | default; error; loading | `CLOSER_PAGES_SPECIFICATION.md` |
| `/verify-email` | Public | awaiting; resent; verified | `CLOSER_MASTER_SPECIFICATION.md`, `CLOSER_LEGAL_CONTENT_SPEC.md` |
| `/forgot-password` | Public | form; email_sent; resend | `CLOSER_PRODUCTION_ESSENTIALS.md` |
| `/reset-password` | Public | form; success; invalid_expired | `CLOSER_PRODUCTION_ESSENTIALS.md` |

### C) Onboarding + partner linking

| Route | Auth | Screen states to design | Spec references |
|---|---|---|---|
| `/onboarding/profile` | Auth | form; validation; loading | `CLOSER_PAGES_SPECIFICATION.md`, `CLOSER_LEGAL_CONTENT_SPEC.md` |
| `/onboarding/partner` | Auth | inviter_view; enter_code; success | `CLOSER_PRODUCTION_ESSENTIALS.md` |
| `/onboarding/setup` | Auth | timezone; anniversary; complete | `CLOSER_MASTER_SPECIFICATION.md` |
| `/join/[code]` | Public | invited; accept; invalid_expired; already_linked | `CLOSER_PRODUCTION_ESSENTIALS.md` |

### D) Core app (tab shell)

| Route | Auth | Screen states to design | Spec references |
|---|---|---|---|
| `/` | Auth | home_default; empty_partner; loading | `CLOSER_PAGES_SPECIFICATION.md` |
| `/connect` | Auth | default; partner_offline; first_time_coaching | `CLOSER_PAGES_SPECIFICATION.md` |
| `/messages` | Auth | empty; conversation; search_mode | `CLOSER_MOMENTS_MESSAGES_SPEC.md`, `CLOSER_PAGES_SPECIFICATION.md` |
| `/moments` | Auth | timeline; grid; calendar; empty; filter/search | `CLOSER_MOMENTS_MESSAGES_SPEC.md`, `CLOSER_PAGES_SPECIFICATION.md` |
| `/us` | Auth | stats; settings_list; empty_partner | `CLOSER_PAGES_SPECIFICATION.md` |

### E) Connect — Intimacy Deck (12)

Routes:
- `/connect/intimacy-deck`
- `/connect/intimacy-deck/categories`
- `/connect/intimacy-deck/draw`
- `/connect/intimacy-deck/answer`
- `/connect/intimacy-deck/waiting`
- `/connect/intimacy-deck/reveal`
- `/connect/intimacy-deck/save`
- `/connect/intimacy-deck/discuss`
- `/connect/intimacy-deck/history`
- `/connect/intimacy-deck/favorites`
- `/connect/intimacy-deck/custom` (premium)
- `/connect/intimacy-deck/stats`

Primary screen states to design (cross-cutting):
- together_vs_ill_start (partner online/offline)
- waiting_for_partner + nudge
- error + reconnect

Spec references: `CLOSER_MASTER_SPECIFICATION.md`, `CLOSER_GAME_PAGES_DESIGN_SPEC.md`

### F) Connect — Hot Takes (8)

Routes:
- `/connect/hot-takes`
- `/connect/hot-takes/categories`
- `/connect/hot-takes/play`
- `/connect/hot-takes/vote`
- `/connect/hot-takes/waiting`
- `/connect/hot-takes/results`
- `/connect/hot-takes/discuss`
- `/connect/hot-takes/history`

Spec references: `CLOSER_MASTER_SPECIFICATION.md`, `CLOSER_GAME_PAGES_DESIGN_SPEC.md`, `CLOSER_REFINED_SPECIFICATION.md`

### G) Connect — Would You Rather (7)

Routes:
- `/connect/would-you-rather`
- `/connect/would-you-rather/categories`
- `/connect/would-you-rather/play`
- `/connect/would-you-rather/chosen`
- `/connect/would-you-rather/waiting`
- `/connect/would-you-rather/results`
- `/connect/would-you-rather/history`

Spec references: `CLOSER_MASTER_SPECIFICATION.md`, `CLOSER_GAME_PAGES_DESIGN_SPEC.md`, `CLOSER_REFINED_SPECIFICATION.md`

### H) Connect — Time Capsule (8)

Routes:
- `/connect/time-capsule`
- `/connect/time-capsule/create/date`
- `/connect/time-capsule/create/message`
- `/connect/time-capsule/create/media`
- `/connect/time-capsule/create/preview`
- `/connect/time-capsule/sealed`
- `/connect/time-capsule/[id]`
- `/connect/time-capsule/[id]/opened`

Spec references: `CLOSER_MASTER_SPECIFICATION.md`, `CLOSER_GAME_PAGES_DESIGN_SPEC.md`, `CLOSER_REFINED_SPECIFICATION.md`

### I) Connect — Dream Builder (9)

Routes:
- `/connect/dream-builder`
- `/connect/dream-builder/create/category`
- `/connect/dream-builder/create/define`
- `/connect/dream-builder/create/timeline`
- `/connect/dream-builder/create/milestones`
- `/connect/dream-builder/create/confirm`
- `/connect/dream-builder/[id]`
- `/connect/dream-builder/[id]/edit`
- `/connect/dream-builder/completed`

Spec references: `CLOSER_MASTER_SPECIFICATION.md`, `CLOSER_GAME_PAGES_DESIGN_SPEC.md`, `CLOSER_REFINED_SPECIFICATION.md`

### J) Connect — Daily Rituals (12)

Routes:
- `/connect/rituals`
- `/connect/rituals/morning`
- `/connect/rituals/morning/compose`
- `/connect/rituals/morning/sent`
- `/connect/rituals/gratitude`
- `/connect/rituals/gratitude/input`
- `/connect/rituals/gratitude/share`
- `/connect/rituals/goodnight`
- `/connect/rituals/goodnight/compose`
- `/connect/rituals/thinking`
- `/connect/rituals/weekly`
- `/connect/rituals/history`

Spec references: `CLOSER_MASTER_SPECIFICATION.md`, `CLOSER_REFINED_SPECIFICATION.md`

### K) Settings & profile (routes under `/us`)

| Route | Auth | Screen states to design | Spec references |
|---|---|---|---|
| `/us/edit-profile` | Auth | form; avatar_upload; success | `CLOSER_PAGES_SPECIFICATION.md`, `CLOSER_PRODUCTION_ESSENTIALS.md` |
| `/us/partner` | Auth | partner_card; unlink_confirm | `CLOSER_PAGES_SPECIFICATION.md` |
| `/us/notifications` | Auth | toggles; quiet_hours; permission_prompt | `CLOSER_PAGES_SPECIFICATION.md`, `CLOSER_LEGAL_CONTENT_SPEC.md` |
| `/us/privacy` | Auth | toggles; export_link; delete_link | `CLOSER_PRODUCTION_ESSENTIALS.md` |
| `/us/subscription` | Auth | current_plan; upgrade; manage_billing | `CLOSER_PAGES_SPECIFICATION.md`, `CLOSER_PRODUCTION_ESSENTIALS.md` |
| `/us/theme` | Auth | theme_gallery; premium_gate; apply | `CLOSER_REFINED_SPECIFICATION.md` |
| `/us/achievements` | Auth | categories; unlocked; detail | `CLOSER_LEGAL_CONTENT_SPEC.md` |
| `/us/streaks` | Auth | stats; calendar; freeze_gate | `CLOSER_REFINED_SPECIFICATION.md` |
| `/us/data` | Auth | export_request; exporting; download_ready | `CLOSER_PRODUCTION_ESSENTIALS.md` |
| `/us/help` | Public | FAQ; contact_support | `CLOSER_LEGAL_CONTENT_SPEC.md` |
| `/us/about` | Auth | version; credits; links | `CLOSER_PRODUCTION_ESSENTIALS.md` |
| `/us/terms` | Public | legal_content; toc | `CLOSER_LEGAL_CONTENT_SPEC.md` |
| `/us/delete` | Auth | warnings; confirm; success | `CLOSER_LEGAL_CONTENT_SPEC.md` |

### L) Virtual gifts

| Route | Auth | Screen states to design | Spec references |
|---|---|---|---|
| `/gifts` | Auth | categories; filter/search; empty | `CLOSER_VIRTUAL_GIFTS_PAGES_DESIGN_SPEC.md`, `CLOSER_REFINED_SPECIFICATION.md` |
| `/gifts/[id]` | Auth | preview; premium_gate; buy | `CLOSER_VIRTUAL_GIFTS_PAGES_DESIGN_SPEC.md` |
| `/gifts/send` | Auth | compose; checkout; sending; sent | `CLOSER_VIRTUAL_GIFTS_PAGES_DESIGN_SPEC.md`, `CLOSER_TECHNICAL_INFRASTRUCTURE.md` |
| `/gifts/received` | Auth | wrapped; opening; revealed; react | `CLOSER_VIRTUAL_GIFTS_PAGES_DESIGN_SPEC.md` |
| `/gifts/history` | Auth | sent_tab; received_tab; empty | `CLOSER_VIRTUAL_GIFTS_PAGES_DESIGN_SPEC.md` |
| `/gifts/bundles` | Auth | list; bundle_detail; buy | `CLOSER_VIRTUAL_GIFTS_PAGES_DESIGN_SPEC.md` |
| `/gifts/success` | Auth | receipt; share; return_cta | `CLOSER_VIRTUAL_GIFTS_PAGES_DESIGN_SPEC.md`, `CLOSER_PRODUCTION_ESSENTIALS.md` |

### M) Payment result pages

| Route | Auth | Screen states to design | Spec references |
|---|---|---|---|
| `/subscription/success` | Auth | success; feature_list; return_cta | `CLOSER_PRODUCTION_ESSENTIALS.md` |
| `/subscription/failed` | Auth | failure; retry; support | `CLOSER_PRODUCTION_ESSENTIALS.md` |

### N) Legal (public)

| Route | Auth | Screen states to design | Spec references |
|---|---|---|---|
| `/us/privacy-policy` | Public | legal_content; toc | `CLOSER_LEGAL_CONTENT_SPEC.md` |
| `/us/cookies` | Public | legal_content; toc | `CLOSER_LEGAL_CONTENT_SPEC.md` |
| `/us/guidelines` | Public | legal_content; toc | `CLOSER_LEGAL_CONTENT_SPEC.md` |
| `/us/refunds` | Public | legal_content; toc | `CLOSER_LEGAL_CONTENT_SPEC.md` |
| `/us/accessibility` | Public | legal_content; toc | `CLOSER_LEGAL_CONTENT_SPEC.md` |

### O) Error & utility

| Route | Auth | Screen states to design | Spec references |
|---|---|---|---|
| `/404` | Public | not_found; return_home | `CLOSER_MASTER_SPECIFICATION.md` |
| `/500` | Public | error; retry; status_link | `CLOSER_MASTER_SPECIFICATION.md` |
| `/maintenance` | Public | maintenance; retry_later | `CLOSER_MASTER_SPECIFICATION.md` |
| `/offline` | Public | offline; retry; cached_hint | `CLOSER_MASTER_SPECIFICATION.md` |

---

## Post‑V1 Routes (Do Not Design for V1)

- `/connect/truth-or-dare`
- `/connect/36-questions`

If added later, they require:
- Backend schema + endpoints (or explicit “client-only/local-only” decision)
- Question/content bank spec (like Intimacy Deck)
- New Connect tile + routing + Moments integration rules
