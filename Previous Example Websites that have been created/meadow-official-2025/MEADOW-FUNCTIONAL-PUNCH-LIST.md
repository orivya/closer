# Meadow — Functional Punch List (Screen-by-Screen)

This is a practical audit of what’s currently **real vs placeholder**, and what we’ll change to make Meadow fully functional for **Vercel** while keeping the **Lovable-style** app (`/index.tsx` → `App.tsx` → `views/*`).

## Global / Architecture

- **Running app**: Root Lovable app is the one actually mounted by [`index.tsx`](./index.tsx) and powered by [`App.tsx`](./App.tsx) + [`views/*`](./views/).
- **Duplicate scaffold**: There is also a separate Vite+Router app under [`src/`](./src/) (e.g. `src/App.tsx`, `src/pages/Index.tsx`). It is currently **not** the running UI, but it can confuse deployment/config.
- **CSS wiring mismatch**: `index.html` references `/index.css`, but only `src/index.css` exists. This can create “looks wrong” regressions depending on build output.
- **Supabase client**: UI/services use [`src/integrations/supabase/client.ts`](./src/integrations/supabase/client.ts). Some legacy/mock Supabase code exists elsewhere; we’ll standardize to one client path.
- **Spend control**: Reduce any polling or frequent refresh calls (notably subscription refresh) to avoid 50–100 calls.

## Auth + Onboarding

### `views/Auth.tsx`
- **Status**: Mostly functional (uses Supabase auth).
- **Gaps**:
  - No explicit “check your email” verification UX after sign-up.
  - New-user detection via `created_at === updated_at` is brittle.

### `views/Onboarding.tsx`
- **Status**: Demo-only persistence.
- **Fix**:
  - Replace `localStorage` persistence with Supabase writes:
    - `profiles.display_name`
    - `user_settings` (reminders, theme, etc.)
    - (If needed) store onboarding “intent” in a real column (currently not in DB).

## Home / Journal / Editor

### `views/Home.tsx`
- **Real**: `ThreadService.getThreadsWithPreviews()`.
- **Placeholder**:
  - Hardcoded “12 Day Streak”.
  - Weekly Insight card is “Coming Soon”.
  - Mood check-in is not persisted (UI-only).
- **Fix**:
  - Compute streak + stats from `journal_entries` and/or `mood_logs`.
  - Replace Weekly Insight with on-demand AI artifact (cached).
  - Persist mood check-in to `mood_logs`.

### `views/Journal.tsx`
- **Real**: loads entries from `journal_entries` via `JournalService.getEntries()`.
- **Placeholder**:
  - Threads tab: “Threads Coming Soon”.
  - Reflections tab: “Guided Reflections Coming Soon”.
  - Some calendar/stream “mood” is synthetic (e.g., always “neutral”).
- **Fix**:
  - Threads tab should render real threads from `threads`.
  - Reflections tab should render AI artifacts / reflections (empty state if none).
  - Improve search/filter wiring (currently UI-only).

### `views/Editor.tsx`
- **Real-ish**:
  - Entry create/update uses `JournalService`.
  - Thread creation uses `ThreadService`.
  - Voice mode uses `useVoiceRecorder` + `AudioRecorder` (but see Voice issues below).
- **Regressions / Placeholder**:
  - Quick Jot + Guided Reflection flows exist in reference app but are missing here.
  - DEMO_IMAGES are used for image UI.
  - AI calls go through `ai-reflection` (Lovable/Gemini), not the new `ai-generate` architecture.
- **Fix**:
  - Port Quick Jot + Guided Reflection flows from:
    - `previous files for reference/views/Editor.tsx`
  - Remove/replace demo-only imagery flows (or make them real via storage if in scope).
  - Move AI calls to `ai-generate` (cached/gated/safe).

## Threads

### `views/ThreadDetail.tsx`
- **Status**: Fully hardcoded.
- **Fix**:
  - Load thread meta from `threads` and entries from `journal_entries`.
  - Proper empty/loading/error states.

## Journeys

### `views/Explore.tsx`
- **Status**: Uses static journey definitions from `data/content.ts` (OK for now).
- **Fix**:
  - Wire “active journey/progress” to Supabase `journey_progress` (new table).

### `views/JourneyDetail.tsx` and `views/Session.tsx`
- **Status**: Uses `localStorage` to simulate progress.
- **Fix**:
  - Replace localStorage progress with Supabase `journey_progress`.
  - Session completion should update progress and create the session entry (already saves to `journal_entries`).

## Insights / Settings / Dashboards

### `views/Insights.tsx`
- **Status**: Hardcoded charts + narrative.
- **Fix**:
  - Replace with aggregates from Supabase + on-demand weekly insight AI artifact.
  - “Not enough data” empty states for new users.

### `views/Settings.tsx`
- **Status**: Heavy placeholders:
  - Hardcoded streak/entry count/level.
  - Hardcoded “weeklyWeather”.
  - Settings items mostly non-functional.
- **Fix**:
  - Stats from DB.
  - AI settings backed by `ai_settings` (exists).
  - App settings backed by `user_settings` (exists).
  - Subscription display/gating backed by Stripe + `user_subscriptions` (exists).

### `views/spaces/LifeDashboard.tsx`
- **Status**: Hardcoded metrics, random heatmap.
- **Fix**:
  - Replace with real computed analytics or show empty states.

### `views/spaces/YearInReview.tsx`
- **Status**: Hardcoded year narrative + stats.
- **Fix**:
  - On-demand AI generation (premium-gated) OR show “not enough data” state.

## Spaces (each must load + be real)

### `views/spaces/Mirror.tsx`
- **Status**: Hardcoded reflections.
- **Fix**:
  - Read existing reflections from `ai_artifacts` (or `reflections`) and generate new on user action via `ai-generate`.

### `views/spaces/TimeVault.tsx`
- **Status**: Hardcoded capsules; UI suggests DB but doesn’t persist.
- **DB exists**: `time_capsules`.
- **Fix**:
  - Full CRUD against `time_capsules`, locked/unlocked UI from `unlock_date`.

### `views/spaces/Intentions.tsx`
- **Status**: Hardcoded intentions.
- **DB exists**: `intentions`.
- **Fix**:
  - CRUD against `intentions`, compute progress from entries (optional) + empty states.

### `views/spaces/VoiceMemos.tsx`
- **Status**: Stubbed transcript (`setTimeout`) and no persistence.
- **DB exists**: `journal_entries.audio_url` + `voice-memos` bucket.
- **Fix**:
  - Treat voice memos as entries where `audio_url` is present; list + playback + transcribe.

### `views/spaces/DecisionLab.tsx`
- **Status**: Hardcoded decision + pros/cons.
- **Fix**:
  - Add tables (e.g., `decisions`, `decision_items`) and CRUD, or implement as “saved entries tagged decisionlab” (fallback MVP).

### `views/spaces/Connections.tsx`
- **Status**: Hardcoded visuals only.
- **Fix**:
  - Add tables for connections/relationships (or defer with clear empty state + planned gating).

## Payments / Stripe

### `views/Pricing.tsx` + edge functions
- **Status**: Pricing uses edge functions (`create-checkout`, `customer-portal`). Subscription checks exist.
- **Fix**:
  - Ensure subscription state isn’t polled excessively.
  - Implement webhook sync to `user_subscriptions` (recommended) OR update `check-subscription` to upsert.

## AI (new architecture)

- **Current**: UI calls `ai-reflection` (Lovable/Gemini).
- **DB**: AI schema exists (ai_features, ai_cache, ai_runs, ai_artifacts, ai_settings, entry_chunks, embedding_jobs, RPC `match_entry_chunks()`).
- **Fix**:
  - Implement `ai-generate` edge function with caching/gating/safety.
  - Implement `ai-mark-shown` to populate `ai_output_events` for anti-repetition.
  - Implement embeddings worker (`ai-embed-worker`) invoked lazily (no cron).

## Legal

- **Missing**: Privacy Policy + Terms pages (and links on footer are placeholders).
- **Fix**:
  - Add screens + wire navigation from `views/LandingPage.tsx`.


