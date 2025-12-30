# CLOSER — V1 Page Order (Design + Development)
## Single ordered checklist to keep context throughout build

This is a strict, recommended build order by route (page-first), aligned to:
- `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`
- `CLOSER_V1_BUILD_SEQUENCE.md`
- `CLOSER_V1_ENTITLEMENTS_AND_MONETIZATION_MATRIX.md`

If you want to lock the **core app look/feel** first (Home/Connect/Messages/Moments/Us), use:
- `CLOSER_V1_PAGE_ORDER_PRODUCT_FIRST.md`

Notes:
- Some “pages” are **screen states** within a route (ex: reset email sent). Design them when building that route.
- Alias routes (redirects) do **not** need designs: `/onboarding`, `/onboarding/timezone`, `/onboarding/anniversary`, `/onboarding/complete`, `/connect/time-capsule/create`, `/connect/dream-builder/create`.

---

# 0) Foundations (do first)
- [ ] Global design system + component library (tokens, typography, buttons, inputs, cards, tabs, modals, toasts, empty/loading/error/locked states)
- [ ] App shell layouts (desktop sidebar + mobile nav) + routing scaffolding for all routes

---

# 1) Public marketing + system pages
- [ ] `/` (logged-out landing experience)
- [ ] `/features`
- [ ] `/pricing`
- [ ] `/about`
- [ ] `/us/help` (public help/FAQ)

**Utility (public)**
- [ ] `/404`
- [ ] `/500`
- [ ] `/maintenance`
- [ ] `/offline`

**Legal (public)**
- [ ] `/us/terms`
- [ ] `/us/privacy-policy`
- [ ] `/us/cookies`
- [ ] `/us/guidelines`
- [ ] `/us/refunds`
- [ ] `/us/accessibility`

---

# 2) Auth + recovery + onboarding + partner linking
**Auth**
- [ ] `/login`
- [ ] `/signup`
- [ ] `/verify-email`
- [ ] `/forgot-password` (includes “email sent” state)
- [ ] `/reset-password` (includes invalid/expired + success states)

**Onboarding**
- [ ] `/onboarding/profile`
- [ ] `/onboarding/partner` (inviter + enter-code states)
- [ ] `/onboarding/setup` (timezone + anniversary + complete states)

**Invite deep link**
- [ ] `/join/[code]` (invited, invalid/expired, already-linked, self-invite states)

---

# 3) Core app (baseline coherent product)
- [ ] `/` (logged-in Home dashboard state)
- [ ] `/connect` (baseline hub + “partner not linked” + partner-offline states)
- [ ] `/messages` (baseline empty + basic thread)
- [ ] `/moments` (baseline empty + timeline)
- [ ] `/us` (baseline stats + settings list)

---

# 4) Settings + monetization rails (before deep features)
**Profile & couple**
- [ ] `/us/edit-profile`
- [ ] `/us/partner`
- [ ] `/us/notifications`
- [ ] `/us/privacy`

**Subscription**
- [ ] `/us/subscription`
- [ ] `/subscription/success`
- [ ] `/subscription/failed`

**Progress & account**
- [ ] `/us/theme`
- [ ] `/us/achievements`
- [ ] `/us/streaks`
- [ ] `/us/data`
- [ ] `/us/about`
- [ ] `/us/delete`

---

# 5) Messages (complete communication pillar)
- [ ] `/messages` (text + whisper)
- [ ] `/messages` (reactions/read receipts/typing/search states)
- [ ] `/messages` (photo messages + viewer states)
- [ ] `/messages` (voice notes + tier gates)
- [ ] `/messages` (gift message bubble integration)

---

# 6) Moments (complete memory pillar)
- [ ] `/moments` (timeline + calendar strip)
- [ ] `/moments` (create flows: photo/song/quote)
- [ ] `/moments` (grid/calendar view modes + search/filter)
- [ ] `/moments` (lightbox + actions)
- [ ] `/moments` (7-day history gate for Free + upgrade CTA)

---

# 7) Connect hub + activities (complete intimacy pillar)
**Connect hub**
- [ ] `/connect` (final tiles, “Together / I’ll start” language, partner-aware presence)

## 7.1 Intimacy Deck (12)
- [ ] `/connect/intimacy-deck`
- [ ] `/connect/intimacy-deck/categories`
- [ ] `/connect/intimacy-deck/draw`
- [ ] `/connect/intimacy-deck/answer`
- [ ] `/connect/intimacy-deck/waiting`
- [ ] `/connect/intimacy-deck/reveal`
- [ ] `/connect/intimacy-deck/save`
- [ ] `/connect/intimacy-deck/discuss`
- [ ] `/connect/intimacy-deck/history`
- [ ] `/connect/intimacy-deck/favorites`
- [ ] `/connect/intimacy-deck/stats`
- [ ] `/connect/intimacy-deck/custom` (Pro gate)

## 7.2 Hot Takes (8)
- [ ] `/connect/hot-takes`
- [ ] `/connect/hot-takes/categories`
- [ ] `/connect/hot-takes/play`
- [ ] `/connect/hot-takes/vote`
- [ ] `/connect/hot-takes/waiting`
- [ ] `/connect/hot-takes/results`
- [ ] `/connect/hot-takes/discuss`
- [ ] `/connect/hot-takes/history`

## 7.3 Would You Rather (7)
- [ ] `/connect/would-you-rather`
- [ ] `/connect/would-you-rather/categories`
- [ ] `/connect/would-you-rather/play`
- [ ] `/connect/would-you-rather/chosen`
- [ ] `/connect/would-you-rather/waiting`
- [ ] `/connect/would-you-rather/results`
- [ ] `/connect/would-you-rather/history`

## 7.4 Time Capsule (8)
- [ ] `/connect/time-capsule`
- [ ] `/connect/time-capsule/create/date`
- [ ] `/connect/time-capsule/create/message`
- [ ] `/connect/time-capsule/create/media`
- [ ] `/connect/time-capsule/create/preview`
- [ ] `/connect/time-capsule/sealed`
- [ ] `/connect/time-capsule/[id]`
- [ ] `/connect/time-capsule/[id]/opened`

## 7.5 Dream Builder (9)
- [ ] `/connect/dream-builder`
- [ ] `/connect/dream-builder/create/category`
- [ ] `/connect/dream-builder/create/define`
- [ ] `/connect/dream-builder/create/timeline`
- [ ] `/connect/dream-builder/create/milestones`
- [ ] `/connect/dream-builder/create/confirm`
- [ ] `/connect/dream-builder/[id]`
- [ ] `/connect/dream-builder/[id]/edit`
- [ ] `/connect/dream-builder/completed`

## 7.6 Rituals (12)
- [ ] `/connect/rituals`
- [ ] `/connect/rituals/morning`
- [ ] `/connect/rituals/morning/compose`
- [ ] `/connect/rituals/morning/sent`
- [ ] `/connect/rituals/goodnight`
- [ ] `/connect/rituals/goodnight/compose`
- [ ] `/connect/rituals/gratitude`
- [ ] `/connect/rituals/gratitude/input`
- [ ] `/connect/rituals/gratitude/share`
- [ ] `/connect/rituals/thinking`
- [ ] `/connect/rituals/weekly` (includes waiting + reveal states inside route)
- [ ] `/connect/rituals/history`

---

# 8) Virtual Gifts (complete delight + revenue pillar)
- [ ] `/gifts`
- [ ] `/gifts/[id]`
- [ ] `/gifts/send`
- [ ] `/gifts/received`
- [ ] `/gifts/history`
- [ ] `/gifts/bundles`
- [ ] `/gifts/success`
