# CLOSER — Component Library (Extracted From HTML Prototype)

Source of truth (golden reference):
- `closer_world_class_premium_dashboard_refined_2026_clean.html`

Goal: define reusable UI building blocks so every route can match the Home/Connect aesthetic without re-inventing layout, surfaces, and interactions.

Token source of truth:
- `CLOSER_DESIGN_DNA.md`

---

# 1) Layout & Shell

- `AppFrame`: fixed ambience (`.ambient-bg`, `.grain-overlay`) + content wrapper (`#app`)
- `ViewRouter` (prototype only): tabbed views (`.view`, `[data-view]`) with keyboard-focus routing
- `SidebarNav`: `.nav-sidebar`, `.nav-item` (hover/active states)
- `MobileNavPill`: `.nav-mobile`, `.nav-mobile-item` (safe-area padding)
- `Container`: `.container` (max-width + responsive padding)

Next.js translation:
- `AppFrame` → `app/(app)/layout.tsx` (shell + nav + background)
- Each `.view` → a real route (`app/(app)/connect/page.tsx`, etc.)

---

# 2) Surface Primitives

- `SurfaceCard`: `.card` (base card surface, used across Home/Connect/Messages/Moments)
- `GlassSurface`: `.glass` (modals, nav chrome; includes blur fallback)
- `ElevatedHero`: `.featured-hero` (Connect featured panel: split content + visual)
- `TileCard`: `.game-tile` (Connect activity tile; also reused as “Settings” row on Us)

Required states (apply consistently):
- `loading`: skeleton blocks on the same surfaces (never switch to a different “loading theme”)
- `empty`: centered card with title + one primary CTA
- `error`: same surface, with retry action + subtle error copy (no red-heavy UI)
- `locked`: “glass blur + upgrade” overlay that preserves the underlying layout

---

# 3) Buttons & Inputs

- `Button`: `.btn` (secondary)
- `DrawButton`: `.draw-btn` (primary sand CTA; used on Connect “Draw Card”)
- `ButtonPrimary`: `.btn-primary` (primary CTA for modals/flows where needed)
- `IconButton`: `.icon-btn` (Messages composer actions)
- `Pressable`: `.pressable` (applies premium press/active feel)
- `FocusRing`: `.focus-ring` (focus-visible ring baseline)
- `ChatComposer`: `.chat-input-refined` + `.chat-input-field` (Messages)

---

# 4) Connect “Premium Delight” Patterns (Must Stay Consistent)

These are the signature elements you called out (hover lift + hearts + premium motion).

## 4.1 Featured Hero (Intimacy Deck)
- Container: `.featured-hero`
- Content column: `.featured-content` (badge + title + desc + actions)
- Visual column: `.featured-visual` (ambient radial wash)

## 4.2 Rising Hearts (Ambient delight)
- Container: `.rising-hearts-container`
- Hearts: `.rising-heart` + `.rh-*` variants
- Animation: `@keyframes heart-rise-fade`

Guideline: only use this effect in **featured** contexts (hero panels, “success” moments), not on every tile.

## 4.3 3D Card Stack (Hover expansion)
- Wrapper: `.card-stack`
- Layers: `.stacked-card.bottom|.middle|.top`
- Hover behavior: `.featured-hero:hover ...` transforms

Guideline: preserve the same transforms/timing; don’t create per-page “new card stack variants”.

## 4.4 Featured Tilt (Optional, respects reduced motion)
- JS-driven tilt on `#featured-hero` (subtle parallax feel)

Guideline: keep tilt small and premium; disable when `prefers-reduced-motion: reduce`.

## 4.5 Accent Per View (Premium “alive” feel)
Prototype behavior: set `--accent` and `--accent-glow` per view.

Next.js translation:
- Set accent per route group using a `data-accent` attribute on the root container, or set CSS variables at the layout level.
- Keep the same mapping as the prototype unless you intentionally rebrand:
  - Home + Messages + Connect → clay
  - Moments + Us → mist

---

# 5) Typography Components

- `PageTitle`: `.page-title` (Fraunces)
- `PageSubtitle`: `.page-subtitle` (Manrope, muted)
- `SectionLabel`: `.section-head` (uppercase tracking label)
- `CardLabel`: `.card-label` (small label with icon)

---

# 6) Modal Pattern (Connect “Draw Card”)

- `ModalBackdrop`: `.modal`
- `ModalCard`: `.modal-card`
- `ModalHeader`: `.modal-top` + `.modal-close`
- `ModalBody`: `.modal-question` + `.modal-sub`

Must-have behaviors:
- focus trap
- ESC closes
- close button always visible
- reduced-motion friendly transitions

---

# 7) Interaction Patterns (Keep Premium)

- `Whisper` reveal: press-and-hold on touch (`pointerdown` → reveal, `pointerup/cancel/leave` → hide) + keyboard toggle
- `Shuffle` microinteraction: quick deck wobble animation (520ms, `--easing`)
- `Keyboard shortcuts` (optional but premium in desktop): Cmd/Ctrl + 1–5 switches primary tabs

---

# 8) “Do Not Drift” Rule

When building V1 routes:
- Home + Connect visual language must match the golden reference.
- New pages may add new components only when required, but they must be derived from these primitives and added back into this doc.
