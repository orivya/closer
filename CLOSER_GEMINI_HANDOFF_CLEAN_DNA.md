# CLOSER — Gemini Handoff (Clean Design DNA)
## Use this to pick up design work with zero drift

### Golden References (Do Not Drift)
- Primary visual anchor (Home + Connect + base components): `closer_world_class_premium_dashboard_refined_2026_clean.html`
- Next.js implementation scaffold (current build target): `closer-web/`
  - Core routes already present: `/`, `/connect`, `/messages`, `/moments`, `/us`
  - Dev route list: `/dev/route-index`

### Non‑Negotiables
- **Home + Connect stay pixel‑parity** with `closer_world_class_premium_dashboard_refined_2026_clean.html`.
- **Overall DNA is “clean premium” (not heavy glass):**
  - Deep base, sand text, clay/mist accents.
  - Ultra‑thin borders (`--border-subtle`, `--border-highlight`).
  - Glass blur only where the clean prototype uses it (timezone pill, chat header, mobile nav), not everywhere.
  - Motion is subtle and “expensive” (no bouncy gimmicks): `--easing: cubic-bezier(0.16, 1, 0.3, 1)`.
- **Responsive is required**: desktop + tablet + mobile layouts must feel intentional (spacing, alignment, touch targets).

---

# 1) Token System (Keep Names From the Prototype)

Use these tokens exactly (same names) as the foundation:
```css
--base: #050505;
--surface: #0E0E0E;
--surface-glass: rgba(20, 20, 20, 0.6);

--clay: #E09F7D;
--clay-dark: #8a5a42;
--clay-glow: rgba(224, 159, 125, 0.2);

--mist: #C4B5FD;
--mist-dark: #7c6eb0;
--mist-glow: rgba(196, 181, 253, 0.2);

--sand: #F5E6D3;
--stone: #9CA3AF;

--border-subtle: rgba(245, 230, 211, 0.06);
--border-highlight: rgba(245, 230, 211, 0.12);

--font-sans: 'Manrope', sans-serif;
--font-serif: 'Fraunces', serif;

--easing: cubic-bezier(0.16, 1, 0.3, 1);
```

Implementation note: `closer-web/src/app/globals.css` already includes these and adds a spacing/radius/shadow scale; keep prototype token names as canonical and only add aliases/extended tokens when necessary.

---

# 2) Component Inventory (Design + Spec These Once)

These are the reusable building blocks the whole product should inherit from the clean prototype:

**Shell**
- Ambient background + grain overlay.
- Desktop sidebar nav (88px) + mobile nav pill (safe‑area).
- Container rhythm: `max-width: 900px; padding: 48px 24px`.

**Home**
- Timezone pill (subtle blur).
- Connection visual (track + traveling spark + dual avatars).
- Countdown hero (Fraunces number gradient).
- Daily question card (hover lift).

**Connect**
- Header + “Sync Active” pill.
- Featured hero (split layout):
  - Rising hearts ambient animation.
  - 3D card stack hover transforms.
  - Primary CTA: `Draw Card` button (sand fill).
- Games grid tiles.
- Ritual pills horizontal scroll.

**Messages**
- Refined chat header (subtle blur).
- Chat bubbles (me/them styles + read receipt).
- Whisper message (blurred text; **hold to reveal** on touch; hover reveal on desktop).
- Composer (minimal surface, icon actions).

**Moments**
- Calendar strip + date grouping.
- Timeline feed primitives:
  - Polaroid photo moment.
  - Song moment (album art + equalizer).
  - Saved answer card.
- Spec-heavy system to design cohesively (still in the same DNA):
  - Search + filters + view modes (timeline/grid/calendar).
  - Create flows (photo/song/quote/milestone).
  - Lightbox, share/download.
  - Monetization gates (history limits, locked overlays).

**Us**
- Couple summary card + subscription pill.
- Stats grid.
- Settings list rows (consistent with the tile language).

---

# 3) Page Map + Screen-State Map (Canonical)

Use these as the canonical product checklist (route list + all required states):
- `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`

Design spec sources (page-level behavior expectations):
- `CLOSER_PAGES_SPECIFICATION.md`
- `CLOSER_GAME_PAGES_DESIGN_SPEC.md`
- `CLOSER_MOMENTS_MESSAGES_SPEC.md`
- `CLOSER_VIRTUAL_GIFTS_PAGES_DESIGN_SPEC.md`

Monetization/gating rules:
- `CLOSER_V1_ENTITLEMENTS_AND_MONETIZATION_MATRIX.md`

Recommended build order:
- `CLOSER_V1_PAGE_ORDER_PRODUCT_FIRST.md` (recommended)
- `CLOSER_V1_PAGE_ORDER.md` (alternative)

---

# 4) Recommended Design Phases (So Context Doesn’t Break)

1. **Phase A — DNA Lock**
   - Tokens, typography, radii, spacing, motion rules.
   - Finalize core components from Home/Connect (nav, cards, pills, buttons).
2. **Phase B — Core Tabs**
   - Moments, Messages, Us designs (desktop/tablet/mobile + required states).
3. **Phase C — Subpages + Utilities**
   - `/us/*` settings pages, error/empty/locked states, modals/sheets.
4. **Phase D — Connect Game Flows**
   - `/connect/*` routes (Hot Takes, Would You Rather, Time Capsule, Dream Builder, Ritual flows).
5. **Phase E — Monetization + Gating Polish**
   - Paywalls, upgrade prompts, entitlement states, billing screens.

---

# 5) What Gemini Should Output (Deliverables)

- A single **Design DNA** section (tokens + rules) that references `closer_world_class_premium_dashboard_refined_2026_clean.html`.
- A **component spec** for each reusable block above (states + interactions + responsive behavior).
- Page designs for every route in `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`, including:
  - desktop/tablet/mobile frames
  - loading/empty/error/locked/success states
- A short “open questions” list only when a spec decision is genuinely missing (otherwise, follow the route/state map).

