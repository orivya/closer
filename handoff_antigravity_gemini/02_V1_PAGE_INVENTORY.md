# Closer V1 — Complete Page Inventory (Routes)

Source of truth: `refs/CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`

This file is a quick “at a glance” checklist for Jim + you + designers so nothing gets missed.

## Summary
- **Total V1 routes (unique paths): 103**
- Post‑V1 excluded: `/connect/truth-or-dare`, `/connect/36-questions`
- Notes:
  - Some routes are **dynamic templates**: `/join/[code]`, `/gifts/[id]`, `/connect/time-capsule/[id]`, `/connect/dream-builder/[id]`, etc.
  - `/` exists as both **Public landing** and **Auth Home** (same path; different states).

---

# A) Public Marketing (Logged-out)

- `/` (Public landing; also Auth home state exists)
- `/features`
- `/pricing`
- `/about`

---

# B) Auth + Account Recovery

- `/login`
- `/signup`
- `/verify-email`
- `/forgot-password`
- `/reset-password`

---

# C) Onboarding + Partner Linking

- `/onboarding/profile`
- `/onboarding/partner`
- `/onboarding/setup`
- `/join/[code]`

---

# D) Core App Tabs (App Shell)

- `/` (Auth home state)
- `/connect`
- `/messages`
- `/moments`
- `/us`

---

# E) Connect — Intimacy Deck (12)

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

---

# F) Connect — Hot Takes (8)

- `/connect/hot-takes`
- `/connect/hot-takes/categories`
- `/connect/hot-takes/play`
- `/connect/hot-takes/vote`
- `/connect/hot-takes/waiting`
- `/connect/hot-takes/results`
- `/connect/hot-takes/discuss`
- `/connect/hot-takes/history`

---

# G) Connect — Would You Rather (7)

- `/connect/would-you-rather`
- `/connect/would-you-rather/categories`
- `/connect/would-you-rather/play`
- `/connect/would-you-rather/chosen`
- `/connect/would-you-rather/waiting`
- `/connect/would-you-rather/results`
- `/connect/would-you-rather/history`

---

# H) Connect — Time Capsule (8)

- `/connect/time-capsule`
- `/connect/time-capsule/create/date`
- `/connect/time-capsule/create/message`
- `/connect/time-capsule/create/media`
- `/connect/time-capsule/create/preview`
- `/connect/time-capsule/sealed`
- `/connect/time-capsule/[id]`
- `/connect/time-capsule/[id]/opened`

---

# I) Connect — Dream Builder (9)

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

# J) Connect — Daily Rituals (12)

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

---

# K) Settings & Profile (`/us/*`)

- `/us/edit-profile`
- `/us/partner`
- `/us/notifications`
- `/us/privacy`
- `/us/subscription`
- `/us/theme`
- `/us/achievements`
- `/us/streaks`
- `/us/data`
- `/us/help` (Public)
- `/us/about`
- `/us/terms` (Public)
- `/us/delete`

---

# L) Virtual Gifts

- `/gifts`
- `/gifts/[id]`
- `/gifts/send`
- `/gifts/received`
- `/gifts/history`
- `/gifts/bundles`
- `/gifts/success`

---

# M) Payment Result Pages

- `/subscription/success`
- `/subscription/failed`

---

# N) Legal (Public)

- `/us/privacy-policy`
- `/us/cookies`
- `/us/guidelines`
- `/us/refunds`
- `/us/accessibility`

---

# O) Error & Utility (Public)

- `/404`
- `/500`
- `/maintenance`
- `/offline`

