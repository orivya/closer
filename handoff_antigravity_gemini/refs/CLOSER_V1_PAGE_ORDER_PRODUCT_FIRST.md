# CLOSER — V1 Page Order (Product‑First Track)
## Best order when you want the core app look/feel locked early

This track prioritizes the “product pillars” (Home/Connect/Messages/Moments/Gifts + Activities) before marketing/auth.
It’s ideal when the goal is to preserve a consistent aesthetic (matching `closer_world_class_premium_dashboard_refined_2026_clean.html`) while building many routes.

Source of truth for routes/states remains: `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`.

Notes:
- This track matches the intent of the Master Spec “refinement phases”:
  - Master Phase 5 (Virtual Gifts) ≈ Phase 5 here
  - Master Phase 6 (Profile & Settings) ≈ Phase 7 here
  - Master Phase 7 (Monetization) ≈ Phase 2 here
  - Master Phase 8 (Engagement Systems) ≈ Phase 6 here

---

# Phase 0 — Foundations (0 routes)
- Global tokens + primitives + component library (buttons/inputs/cards/tabs/modals/toasts/empty/loading/error/locked states)
- App shell (desktop sidebar + mobile nav) and route scaffolding
- Dev-only “Route Index” page (recommended) for one-click navigation during build

---

# Phase 1 — Core tabs (5 routes)
These lock the overall UI language and reusable patterns.
- `/` (logged-in Home)
- `/connect` (hub shell + partner-aware language)
- `/messages` (baseline empty + one conversation)
- `/moments` (baseline empty + timeline)
- `/us` (baseline stats + settings list)

---

# Phase 2 — Monetization rails (3 routes)
Do this early so every later gate has a consistent destination and UI.
- `/us/subscription`
- `/subscription/success`
- `/subscription/failed`

---

# Phase 3 — Messages pillar (1 route, built in passes)
- `/messages` (text + whisper → reactions/read receipts/typing/search → photo → voice (tier gates) → gift bubble integration)

---

# Phase 4 — Moments pillar (1 route, built in passes)
- `/moments` (timeline + create flows + view modes + search/filter + lightbox + Free 7‑day history gate)

---

# Phase 5 — Gifts pillar (7 routes)
Best after Messages/Moments so cross-links (“Reply”, “Save to Moments”) land on real experiences.
- `/gifts`
- `/gifts/[id]`
- `/gifts/send`
- `/gifts/received`
- `/gifts/history`
- `/gifts/bundles`
- `/gifts/success`

---

# Phase 6 — Connect activities (56 routes)
Build in this order to reuse shared “Together / I’ll start” + waiting/reveal patterns.

## 6.1 Intimacy Deck (12)
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
- `/connect/intimacy-deck/stats`
- `/connect/intimacy-deck/custom` (Pro gate)

## 6.2 Rituals (12)
- `/connect/rituals`
- `/connect/rituals/morning`
- `/connect/rituals/morning/compose`
- `/connect/rituals/morning/sent`
- `/connect/rituals/goodnight`
- `/connect/rituals/goodnight/compose`
- `/connect/rituals/gratitude`
- `/connect/rituals/gratitude/input`
- `/connect/rituals/gratitude/share`
- `/connect/rituals/thinking`
- `/connect/rituals/weekly` (waiting + reveal as in-route states)
- `/connect/rituals/history`

## 6.3 Hot Takes (8)
- `/connect/hot-takes`
- `/connect/hot-takes/categories`
- `/connect/hot-takes/play`
- `/connect/hot-takes/vote`
- `/connect/hot-takes/waiting`
- `/connect/hot-takes/results`
- `/connect/hot-takes/discuss`
- `/connect/hot-takes/history`

## 6.4 Would You Rather (7)
- `/connect/would-you-rather`
- `/connect/would-you-rather/categories`
- `/connect/would-you-rather/play`
- `/connect/would-you-rather/chosen`
- `/connect/would-you-rather/waiting`
- `/connect/would-you-rather/results`
- `/connect/would-you-rather/history`

## 6.5 Time Capsule (8)
- `/connect/time-capsule`
- `/connect/time-capsule/create/date`
- `/connect/time-capsule/create/message`
- `/connect/time-capsule/create/media`
- `/connect/time-capsule/create/preview`
- `/connect/time-capsule/sealed`
- `/connect/time-capsule/[id]`
- `/connect/time-capsule/[id]/opened`

## 6.6 Dream Builder (9)
- `/connect/dream-builder`
- `/connect/dream-builder/create/category`
- `/connect/dream-builder/create/define`
- `/connect/dream-builder/create/timeline`
- `/connect/dream-builder/create/milestones`
- `/connect/dream-builder/create/confirm`
- `/connect/dream-builder/[id]`
- `/connect/dream-builder/[id]/edit`
- `/connect/dream-builder/completed`

---

# Phase 7 — Complete “Us” pages (10 routes)
- `/us/edit-profile`
- `/us/partner`
- `/us/notifications`
- `/us/privacy`
- `/us/theme`
- `/us/achievements`
- `/us/streaks`
- `/us/data`
- `/us/about`
- `/us/delete`

---

# Phase 8 — Auth + onboarding + join (9 routes)
- `/login`
- `/signup`
- `/verify-email`
- `/forgot-password`
- `/reset-password`
- `/onboarding/profile`
- `/onboarding/partner`
- `/onboarding/setup`
- `/join/[code]`

---

# Phase 9 — Public marketing + legal + utility (15 routes)
Includes the logged-out state of `/` (same route, different experience).

**Marketing (public)**
- `/` (logged-out landing state)
- `/features`
- `/pricing`
- `/about`

**Help (public)**
- `/us/help`

**Utility (public)**
- `/404`
- `/500`
- `/maintenance`
- `/offline`

**Legal (public)**
- `/us/terms`
- `/us/privacy-policy`
- `/us/cookies`
- `/us/guidelines`
- `/us/refunds`
- `/us/accessibility`
