# CLOSER — V1 Build Sequence (Page-First)
## Cohesive Step-by-Step Implementation Order

This plan is designed to prevent late-stage surprises (missing pages, missing states, monetization bolt-ons).
It assumes the canonical route map is `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`.

This doc describes the **recommended Product‑First build track** (lock the Home/Connect aesthetic early).
Route checklist for this track:
- `CLOSER_V1_PAGE_ORDER_PRODUCT_FIRST.md`

If you prefer a Launch‑First track (public site + legal + auth before product pages), use:
- `CLOSER_V1_PAGE_ORDER.md` (strict route checklist, launch-first)

---

# Guiding Principles

1. **Page-first, state-complete**: each route ships with its core states (loading, empty, error, locked) before feature depth.
2. **Cohesion over completeness**: wire cross-feature navigation early (Messages ↔ Moments ↔ Connect ↔ Gifts).
3. **Entitlements from day 1**: every “premium” surface must already render correctly for Free/Plus/Pro (even if backend is stubbed).
4. **Couple-safe defaults**: any route that requires a partner must have a graceful “not linked yet” state with a clear CTA.

---

# Phase 0 — Foundations (No Business Logic Yet)

**Goal**: a real multi-route app shell that matches the design DNA.

- Global layout shell: sidebar + mobile nav + responsive container
- Shared UI primitives: buttons, inputs, cards, badges, tabs, modals, toasts, empty states
- Route scaffolding for every canonical route (can be placeholder content)
- Global states: loading skeleton patterns, error boundary pattern, offline banner pattern

**Exit criteria**
- You can navigate to every route without crashes.
- Every route displays a placeholder that matches the visual system.

---

# Phase 1 — Core Tabs (Lock the Look/Feel)

**Goal**: establish the “Closer” product language (shell + typography + surfaces) using real product pages.

**Pages**
- `/` (logged-in Home)
- `/connect` (hub shell + partner-aware language)
- `/messages` (baseline empty + one thread)
- `/moments` (baseline empty + timeline)
- `/us` (baseline stats + settings list)

**Must-have states**
- `not_coupled`: consistent empty state on Connect/Messages/Moments/Us with CTA to link partner
- `partner_offline`: Connect copy that explains async vs together

**Exit criteria**
- The app reads like a coherent product even with mock data.
- Navigation, cards, empty/loading/error states look identical across all 5 tabs.

---

# Phase 2 — Monetization Rails (Do Early)

**Goal**: every later “locked” page can route somewhere real, with consistent upgrade UX.

**Pages**
- `/us/subscription`
- `/subscription/success`
- `/subscription/failed`

**Exit criteria**
- Free/Plus/Pro UI states exist and are testable (even with stubbed billing).
- Every “upgrade” CTA in the app points to the same destination and copy pattern.

---

# Phase 3 — Messaging (Core Connection Loop)

**Pages**
- `/messages`

**Increment order**
1. Text messages + delivery states
2. Whisper messages
3. Reactions, read receipts, typing indicator
4. Photo message (upload + viewer)
5. Voice notes (record + playback + duration gates)
6. Gift message bubble integration (link to gift reveal)

**Exit criteria**
- The “Messages” loop stands alone as a complete product pillar.

---

# Phase 4 — Moments (Memory Loop + Cross-Feature Saving)

**Pages**
- `/moments`

**Increment order**
1. Timeline + calendar strip
2. Create moment flows (photo/song/quote)
3. Lightbox viewer + actions
4. Search/filter + view modes
5. Gating: 7‑day history blur + upgrade CTA (Free)

**Exit criteria**
- Any feature that says “Save to Moments” lands a coherent moment card here.

---

# Phase 5 — Virtual Gifts (Delight + Revenue)

**Pages**
- `/gifts`, `/gifts/[id]`, `/gifts/send`, `/gifts/received`, `/gifts/history`, `/gifts/bundles`, `/gifts/success`

**Increment order**
1. Gift shop + detail + preview
2. Send flow (free/included vs purchasable)
3. Receive/open reveal experience + reactions + “save to moments”
4. History + bundles
5. Tier logic: Plus includes premium gifts; Pro makes all gifts free

**Exit criteria**
- Gift flow is consistent end-to-end:
  - shop → detail → send → partner receives → open → reaction → saved

---

# Phase 6 — Connect Hub + Activities (Playful Intimacy Loop)

**Pages**
- `/connect` plus all `/connect/*` activities from the canonical route map

**Increment order**
1. **Sync model** (“Together” vs “I’ll start”) + waiting states (shared pattern across activities)
2. Intimacy Deck core loop (draw → answer → waiting → reveal → save)
3. Hot Takes core loop
4. Would You Rather core loop
5. Time Capsule create + sealed + open
6. Dream Builder create + milestones + completion
7. Rituals: morning + goodnight (Free), then gratitude/thinking/weekly (Plus)

**Exit criteria**
- Every Connect activity supports both async and together flows where specified.

---

# Phase 7 — Complete “Us” Pages (Settings Contract)

**Pages**
- `/us/edit-profile`, `/us/partner`, `/us/notifications`, `/us/privacy`
- `/us/theme`, `/us/achievements`, `/us/streaks`, `/us/data`, `/us/about`, `/us/delete`

**Exit criteria**
- Settings patterns are consistent (rows, toggles, back behavior, success toasts).
- Any locked option routes to `/us/subscription` with correct tier copy.

---

# Phase 8 — Auth + Recovery + Onboarding + Join

**Pages**
- `/login`, `/signup`, `/verify-email`, `/forgot-password`, `/reset-password`
- `/onboarding/profile`, `/onboarding/partner`, `/onboarding/setup`
- `/join/[code]`

**Exit criteria**
- All user entry paths are unblocked:
  - new user → signup → verify → onboarding → home
  - invited user → `/join/[code]` → signup/login → link → setup → home

---

# Phase 9 — Public Marketing + Legal + Utility (Finish the Perimeter)

**Pages**
- `/` (logged-out landing experience; logged-in redirect state)
- `/features`, `/pricing`, `/about`
- `/us/help` (public help/FAQ)
- `/us/terms`, `/us/privacy-policy`, `/us/cookies`, `/us/guidelines`, `/us/refunds`, `/us/accessibility`
- `/404`, `/500`, `/maintenance`, `/offline`

**Exit criteria**
- Footer/header link destinations are finalized (no placeholder “Blog/Contact” routes for V1).
- Legal pages are readable, navigable (TOC), and responsive.

---

# Final Pass — Polish, Performance, Accessibility, PWA

- A11y pass: focus management, keyboard nav, reduced motion
- Performance budgets (images, fonts, route splitting)
- Offline behavior + `/offline` experience + cached shell
- Monitoring hooks (Sentry), analytics events (PostHog)

---

# Final “Nothing Missing” Checklist (V1)

- Every canonical route exists and has: loading + error + empty + locked (if applicable)
- Every monetization rule has a UI surface (gate + prompt + upgrade path)
- Partner-required routes gracefully handle “not linked yet”
- No spec references routes that don’t exist in the canonical route map
