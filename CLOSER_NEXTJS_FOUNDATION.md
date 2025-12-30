# CLOSER — Next.js Foundation (V1)
## Set up the app so Home/Connect stay identical to the prototype

Golden UI reference:
- `closer_world_class_premium_dashboard_refined_2026_clean.html`

Source of truth for routes/states:
- `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`

Design system:
- `CLOSER_DESIGN_DNA.md`
- `CLOSER_COMPONENT_LIBRARY_FROM_PROTOTYPE.md`

Current implementation status:
- Next.js app scaffold lives in `closer-web/`
- Pixel-parity CSS is copied from the golden prototype into `closer-web/src/app/globals.css`
- App shell + nav are implemented in `closer-web/src/app/layout.tsx`
- Implemented routes:
  - `/` (Home)
  - `/connect` (Connect)
  - `/dev/route-index` (dev-only route list)
  - `/*` catch-all placeholder in dev (so every planned route is navigable during build)

Run locally:
```bash
cd closer-web
npm install
npm run dev
```

---

# 1) Core Decisions (to prevent drift)

## 1.1 Use Next.js App Router
- Route groups mirror product areas:
  - `app/(public)` → marketing/legal/utility
  - `app/(auth)` → login/signup/onboarding/join
  - `app/(app)` → authenticated product (`/`, `/connect`, `/messages`, `/moments`, `/us`, etc.)

## 1.2 Styling strategy (best for “pixel parity”)
- Keep **CSS variable token names identical** to the prototype (`--base`, `--surface-0`, `--shadow-1`, `--dur-2`, etc.).
- Start with **global CSS** copied from the prototype (fastest path to exact parity).
- Only after parity is achieved, progressively componentize into CSS Modules (avoid “rewriting CSS while still tuning visuals”).

## 1.3 Icons
- Prefer `lucide-react` (no runtime DOM mutation).
- Keep stroke widths and sizing consistent with the prototype (1.65–1.6).

## 1.4 Accent per section
Prototype sets `--accent`/`--accent-glow` per tab.
In Next.js, set accent per route group or per page layout:
- Home/Messages/Connect: clay
- Moments/Us: mist

Implementation options:
- `data-accent="clay|mist"` on a root wrapper + CSS sets `--accent` variables, or
- set CSS variables inline in layout based on route segment.

---

# 2) Phase 0 Deliverables (before any new pages)

These are the “make everything feel premium” foundations you reuse everywhere.

## 2.1 App shell
- Desktop sidebar + mobile nav pill (same breakpoints as prototype)
- `Container` wrapper (980px max width)
- Background ambience: grain overlay + blobs + ambient gradients

## 2.2 Shared primitives
- `Card` / `Glass` / `Pill`
- `Button` / `ButtonPrimary` / `IconButton`
- `FocusRing` utility class (apply to all interactive elements)
- `Modal` pattern (focus trap + ESC close)
- `Toast` pattern
- Standard states: `Loading`, `Empty`, `Error`, `Locked`

## 2.3 Dev-only Route Index
- A single page that links to every canonical route for 1-click review.
- Keep it behind `NODE_ENV !== "production"` or a feature flag.

---

# 3) Suggested File Structure (minimal, scalable)

Example (recommended):
```
src/
  app/
    (public)/
    (auth)/
    (app)/
      layout.tsx            # AppShell + nav
      page.tsx              # Home (/)
      connect/page.tsx
      messages/page.tsx
      moments/page.tsx
      us/page.tsx
    dev/
      route-index/page.tsx
    globals.css             # tokens + base + components (copied from prototype initially)
  components/
    shell/
      SidebarNav.tsx
      MobileNav.tsx
      AppFrame.tsx
    ui/
      Button.tsx
      Card.tsx
      Modal.tsx
      Toast.tsx
      EmptyState.tsx
      LockedOverlay.tsx
```

---

# 4) “Do Not Break” Rules (so Home/Connect remain exact)

- Do not change spacing, radii, shadows, or motion timings on `/` or `/connect` until the rest of the app matches them.
- Any new component must be derived from the prototype primitives (card, glass, pill, button).
- If a spec doc conflicts with the canonical route map, `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md` wins.

---

# 5) What’s Next (first pages)

Use the product-first order:
- `CLOSER_V1_PAGE_ORDER_PRODUCT_FIRST.md`

Start building pages in this order:
1. `/connect` (anchor page; defines premium motion/delight)
2. `/` (logged-in Home)
3. `/messages`
4. `/moments`
5. `/us`
