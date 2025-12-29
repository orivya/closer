# MixExperts — Gemini 3 Full-Platform Design Brief (Premium + Timeless + “Wow”)

**Goal:** Produce a cohesive, world-class visual system and UX patterns for the entire MixExperts platform, expanding from the current `mixexperts-5/` profile-page aesthetic.

**Primary design anchor (must match):**
- `mixexperts-5/index.html` (tokens + premium dark base + subtle noise + glass nav)
- `mixexperts-5/components/*` (hero typography, glow treatment, motion style, section rhythm)

**Secondary requirements:** the `.md` specs in repo root define the page layouts, components, and copy.

---

## 1) What “premium, world-class, timeless” means for MixExperts (2026-ready)

### 1.1 Brand mood
- **Premium / cinematic / confident**
- **Modern, not trendy** (timeless foundations; trend accents only where they age well)
- **Audio-native** (the UI “feels” like sound: rhythm, dynamics, space, contrast)

### 1.2 Design principles (non-negotiables)
- **Clarity beats decoration**: every flourish must earn its keep (conversion, comprehension, delight).
- **Hierarchy through contrast**: typography scale, spacing, and elevation do the heavy lifting.
- **Motion with meaning**: micro-interactions guide attention; never distract.
- **Consistency = trust**: reusable patterns across marketing + profile + dashboard.
- **Accessible by default**: WCAG AA contrast and keyboard flows.

---

## 2) Visual system requirements (tokens + themes)

### 2.1 Base aesthetic (from `mixexperts-5/`)
Keep and expand:
- Deep black base + elevated dark surfaces
- Glass overlays for navigation and select panels
- Subtle grain/noise overlay (low opacity)
- Accent “glow” used sparingly for key actions and highlights
- Bold headline typography + tight tracking

### 2.2 Token categories (Gemini must output)
Gemini should deliver tokens as:
- **CSS variables** (for runtime theming)
- **A JSON token file** (for documentation + future tooling)

Token groups:
- **Colors**: bg layers, borders, text hierarchy, semantic colors (success/warn/error/info)
- **Accent themes (6)**: amber/teal/sage/slate/rose/violet including `accent`, `accentLight`, `accentSubtle`, `accentGlow`
- **Typography**: scale, weights, line heights, letter spacing rules
- **Spacing**: 4px base scale
- **Radii**: sm/md/lg/xl/full
- **Shadows**: subtle, medium, modal, glow
- **Motion**: durations (fast/smooth/slow), easing curves, spring configs

### 2.3 Typography direction
- Primary: **Plus Jakarta Sans** (matches current)
- Use **fluid type** (clamp) for hero + section headers.
- Establish 3 layers of emphasis:
  - Display (hero)
  - Section (h1/h2)
  - UI (h3/h4/body/caption)

---

## 3) Component design requirements (system-wide)

Gemini should produce a component spec library with:
- **Variants** (primary/secondary/ghost, etc.)
- **States** (default/hover/active/focus/disabled/loading/error)
- **Sizing** (sm/md/lg)
- **Content rules** (icon+label spacing, truncation, multiline)

### 3.1 Core primitives
- Buttons, links
- Inputs (text, password with reveal, textarea, select)
- Checkbox, radio group, switch
- Badges/chips (genres, tags)
- Cards (default/elevated/glass)
- Modals/drawers
- Tabs + segmented controls
- Toasts/alerts
- Skeleton loaders + empty states
- Tables + filters + search

### 3.2 “Signature” MixExperts components (wow-worthy but tasteful)
- **Before/After Audio Player**
  - Instant A/B with crossfade
  - Waveform visualization
  - Accent-driven highlights
  - Mobile-first controls
- **Profile completeness meter**
  - Elegant progress treatment; feels “premium dashboard”
- **AI assistant surfaces**
  - Quick actions grid + chat panel with clear insert/copy/regenerate controls

---

## 4) Layout templates (page families)

Gemini should design reusable templates for:
- **Marketing pages**: hero + proof + bento feature grid + interactive demos + CTA
- **Public profile**: hero (identity) + sections with strong rhythm + audio demos
- **Auth pages**: centered card, multi-step signup with stepper
- **Dashboard**:
  - Desktop: sidebar + header + content
  - Mobile: header + bottom nav
  - Data tables and split panes (Inbox)

---

## 5) “Wow” moments (2026-ready, timeless)

Use these sparingly and consistently:
1. **Audio-reactive micro-glow**: subtle accent glow responds to play state (not full visualizer rave).
2. **Waveform “materialization”**: waveform draws in on first play; then stays static.
3. **Magnetic CTAs**: slight spring + hover glow for primary CTAs (desktop only).
4. **Cinematic section reveals**: staggered fade/slide with soft blur; low amplitude.
5. **Glass navigation polish**: scroll-based opacity shift + backdrop blur (already present; refine).
6. **Profile hero identity moment**: avatar glow + subtle depth + perfect type rhythm.
7. **Delightful empty states**: audio-native metaphors (“No tracks yet — add your first before/after”).
8. **Premium tables**: hover rows with subtle elevation + left accent indicator.

---

## 6) Accessibility + UX guardrails
- Keyboard navigation for all interactive components
- Visible focus ring (accent-subtle + border)
- Contrast: body text meets AA on bg-card/bg-elevated
- Motion preferences respected (`prefers-reduced-motion`)
- Mobile touch targets ≥ 44px

---

## 7) What Gemini should deliver (output requirements)
Gemini output should include:
1. **Design system doc**: tokens + usage rules
2. **Component library spec**: variants/states/sizing
3. **Page compositions** for:
   - Marketing `/`, `/pricing`, `/features`, `/examples`
   - Public profile `/:username`, `/:username/products`, `/:username/book`
   - Auth `/login`, `/signup` (3-step), `/forgot-password`
   - Dashboard: `/dashboard`, `/dashboard/profile/*`, `/dashboard/business/*`, `/dashboard/inbox`, `/dashboard/ai`, `/dashboard/settings/*`
4. **Motion spec**: durations/easing; where motion is used
5. **Hand-off tokens**: CSS variables + JSON

---

## 8) Gemini 3 prompt (copy/paste)

> Attach: `mixexperts-5/` (or screenshots), and the docs listed below.

```text
You are Gemini 3, acting as a world-class product designer and design-systems lead.

Design anchor (must match and expand): the existing `mixexperts-5/` profile-page aesthetic:
- premium dark base, subtle noise/grain overlay, glass navigation, soft accent glows, cinematic gradients
- bold headline typography (Plus Jakarta Sans), generous spacing, high contrast

Project: MixExperts — a platform for audio engineers (marketing site + public profiles + full dashboard).

Your task:
1) Create a complete design system (tokens) that preserves the existing vibe but scales to the entire product.
2) Design a component library (variants + states) and page templates for marketing, public profiles, auth, and dashboard.
3) Include tasteful “wow moments” that feel audio-native and timeless (not gimmicky): waveform reveal, micro-glows tied to playback, premium table interactions, cinematic section transitions.
4) Ensure accessibility (WCAG AA), mobile-first responsiveness, and consistency across all pages.

Deliverables (must output):
- A design-system markdown doc
- A CSS variables token file and a JSON token file
- A component spec library (with variants/states/sizes)
- Page composition specs for the full platform:
  - /, /pricing, /features, /examples
  - /[username], /[username]/products, /[username]/book
  - /login, /signup (3-step), /forgot-password
  - /dashboard, /dashboard/profile/*, /dashboard/business/*, /dashboard/inbox, /dashboard/ai, /dashboard/settings/*
- Motion/interaction guidelines (durations, easing, rules)

Constraints:
- Keep the premium dark aesthetic and themeable accent system (Amber default + 5 alternates).
- Avoid overly trendy visuals that will age quickly.
- Use motion with meaning; respect prefers-reduced-motion.

Reference docs to follow exactly:
- MIXEXPERTS_DETAILED_DESIGN_SPECIFICATION (1).md (page layouts and component requirements)
- MIXEXPERTS_CONTENT_COPY_BIBLE.md (copy tone/voice)
- MIXEXPERTS_MASTER_PLATFORM_BLUEPRINT (1).md (feature set + page inventory)

Output format:
Use clear headings and tables. For tokens, output both CSS variables and JSON.
```

---

## 9) Implementation handoff rules (so design stays consistent in code)
- No hard-coded colors in components: use tokens only.
- “Wow” effects must be token-driven and optional (can be reduced/disabled).
- Components are designed once; pages assemble components (avoid one-off page styling).




