# Meadow — Audit Backlog (Source of Truth)

**Updated:** 2025-12-22  
**Goal:** Make Meadow cohesive + production-ready (boot stability, correct routing/deeplinks, completed core flows, honest UI, and strong empty/error states).

---

## P0 — Launch Blockers (must fix before shipping)

### P0-BOOT-01 — Favicon request is broken
- **Where**: `index.html` (also mirrored into `dist/index.html` at build time)
- **Problem**: `<link rel="icon" ... href="/vite.svg" />` but there’s no `public/vite.svg`.
- **Fix**: Point to `/favicon.ico` (exists in `public/`).
- **Acceptance**:
  - Visiting any page does not request `/vite.svg`.
  - Favicon renders in browser tab in dev + production build.

### P0-BOOT-02 — Importmap conflicts with bundled app dependencies
- **Where**: `index.html`
- **Problem**: `importmap` pins React 19 + other CDN deps while `package.json` uses React 18. Vite bundles deps; importmap is at best redundant and at worst confusing.
- **Fix**: Remove the importmap block entirely.
- **Acceptance**:
  - No importmap in `index.html`.
  - `npm run build` succeeds; app boot works in preview.

### P0-BOOT-03 — Client bundle injects a secret (`GEMINI_API_KEY`)
- **Where**: `vite.config.ts`
- **Problem**: `define: { 'process.env.GEMINI_API_KEY': ... }` exposes secrets to the browser bundle.
- **Fix**: Remove client injection. AI is served via Supabase Edge (`ai-generate`) and should not require client secrets.
- **Acceptance**:
  - No `process.env.GEMINI_API_KEY` or `process.env.API_KEY` injection in `vite.config.ts`.
  - No UI feature depends on that injected key.

### P0-PAY-01 — Pro yearly price ID placeholder
- **Where**: `views/Pricing.tsx`
- **Problem**: `yearlyPriceId: 'price_pro_yearly_placeholder'` can break checkout if selected.
- **Fix (chosen)**: Hide Pro yearly; keep yearly billing for Premium only.
- **Acceptance**:
  - UI never attempts checkout with `price_pro_yearly_placeholder`.
  - Pro plan only supports monthly billing; Premium supports monthly/yearly.

### P0-ROUTE-01 — Blog category deeplink parsing is missing
- **Where**: `App.tsx` (`getInitialView`)
- **Problem**: URLs like `/blog/category/:id` are generated but parsed as `/blog/:postId`.
- **Fix**: Parse `segments = ['blog','category',':id']` → `ViewState.BLOG_CATEGORY`.
- **Acceptance**:
  - Refreshing `/blog/category/journaling-tips` loads the category view.
  - Browser back/forward works between Blog → Category → Post.

### P0-ROUTE-02 — Journey session deeplink parsing is missing + session is not hydratable
- **Where**: `App.tsx` (`getInitialView`), `views/Session.tsx`
- **Problem**:
  - `/journey/:id/session` is generated but not parsed → refresh lands on JourneyDetail.
  - `Session` requires `step` prop; deep-link has no `step` payload.
- **Fix**:
  - Parse `/journey/:id/session` → `ViewState.JOURNEY_SESSION` with `{ journeyId }`.
  - Make `Session` able to fetch the “current step” using `JOURNEYS` + `JourneyProgressService`.
- **Acceptance**:
  - Refreshing `/journey/clarity/session` opens a session screen (not the detail page).
  - Session gracefully handles missing/invalid journey IDs.

### P0-UX-01 — Blog page “floating bar under header”
- **Where**: `App.tsx`, `views/BlogPost.tsx`, `views/BlogCategory.tsx`
- **Problem**: Blog views are wrapped in `components/Layout.tsx` (global header), but BlogPost/BlogCategory also render their own sticky header → visually “double header”.
- **Fix**: Treat `BLOG`, `BLOG_CATEGORY`, `BLOG_POST` as full-screen (no `Layout` wrapper).
- **Acceptance**:
  - BlogPost has a single header row (no extra global header above it).
  - Blog/Category/Post all feel clean on mobile + desktop.

---

## P1 — Core Completeness (users will feel gaps)

### P1-AI-01 — Calendar “Daily Summary” is not AI
- **Where**: `views/Journal.tsx` (`DayDetailOverlay`)
- **Problem**: Summary is a count string; not helpful/insightful.
- **Fix**: Add AI Daily Summary using `ai-generate` + `ai_cache`.
- **Acceptance**:
  - If entries exist: show AI summary with loading/error/retry + regenerate.
  - If no entries: show clear empty state + CTA to write.
  - Results cached per `(user_id, dateKey, entryIdsHash)` for 24h (or suitable TTL).

### P1-INT-01 — Intentions are not linked to entries (entryCount is always 0)
- **Where**: `services/intentions.ts`, `views/spaces/Intentions.tsx`, `services/journal.ts`, `views/Editor.tsx`
- **Problem**: “Reflect” opens editor with `intentionId`, but `journal_entries` has no `intention_id` column, and UI always shows 0 linked entries.
- **Fix**:
  - DB migration: add `journal_entries.intention_id` FK → `intentions.id`.
  - Persist `intentionId` on save.
  - Compute linked entry counts per intention.
- **Acceptance**:
  - Creating an intention and writing from “Reflect” increments that intention’s linked entry count.
  - Intentions hub shows linked entries and meaningful metrics.

### P1-EDIT-01 — “AI Guided Session” is scripted (not AI)
- **Where**: `views/Editor.tsx` (`InteractiveSession`)
- **Problem**: The UX implies AI but is hard-coded scripts.
- **Fix**: Relabel as non-AI “Guided Session” or wire to real AI.
- **Acceptance**:
  - UI language is accurate (no misleading “AI” claim unless it truly uses AI).

---

## P2 — Polish & Cohesion (quality + trust)

### P2-DATE-01 — Local date key consistency
- **Where**: `views/Home.tsx` vs `services/metrics.ts`
- **Problem**: Home uses UTC date keys (`toISOString().slice(0,10)`), analytics uses local date keys → dots can mismatch across timezones.
- **Fix**: Use a single local date key helper everywhere.
- **Acceptance**:
  - Week dots align with analytics for non-UTC users.

### P2-BLOG-01 — Blog color token robustness
- **Where**: `views/Blog.tsx`, `views/BlogCategory.tsx`
- **Problem**: Uses `text-*-dark` tokens that may not exist (e.g. `lavender.dark` not defined).
- **Fix**: Use existing tokens or extend Tailwind inline config to define missing `*.dark` where used.
- **Acceptance**:
  - Category icons render with correct colors for all categories.

### P2-SUB-01 — Subscription polling is too frequent
- **Where**: `contexts/AuthContext.tsx`
- **Problem**: Fetching subscription every 60s is noisy/expensive.
- **Fix**: Replace with event-based refresh (sign-in, stripe return, manual refresh) + optional focus refresh.
- **Acceptance**:
  - Subscription status remains correct without polling every minute.

### P2-ROUTE-03 — Optional Not Found state
- **Where**: `App.tsx`
- **Problem**: Unknown paths default to Home; confusing on bad URLs.
- **Fix**: Add a simple Not Found view (optional).
- **Acceptance**:
  - Unknown URL shows a friendly Not Found screen with navigation options.


