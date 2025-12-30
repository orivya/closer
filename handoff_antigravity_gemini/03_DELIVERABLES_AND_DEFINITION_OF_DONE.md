# Closer V1 — Deliverables + Definition of Done (Design)

This is the quality bar and checklist for Antigravity/Gemini outputs.

Source of truth for routes/states: `refs/CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`

---

# 1) Deliverable Set (What You Must Produce)

## 1.1 Design DNA (system)
Deliver a single “Design DNA” doc (or Figma page) containing:
- Tokens: color, typography, spacing, radii, borders, shadows, motion, z-index layers
- Rules: where blur is allowed, where gradients are allowed, how accent colors are applied
- Components: variants + states + interaction specs
- Responsive rules: how each component behaves across desktop/tablet/mobile

Non‑negotiable:
- Home + Connect must remain pixel-parity with `assets/GOLDEN_REFERENCE__closer_clean.html`.

## 1.2 Component Library (reusable)
Create reusable components that prevent redesigning the same UI 20+ times:
- App shell: sidebar + mobile nav pill + container
- Cards/tiles/pills + hover/press states
- Buttons (primary/secondary/quiet) + icon button
- Inputs + search field + validation states
- Modal + sheet + toast patterns
- Empty/error/loading/locked overlays
- “Waiting for partner” state pattern (Connect flows)

## 1.3 Page Designs (all routes + all states)
For every route in `02_V1_PAGE_INVENTORY.md`:
- Desktop / tablet / mobile frames
- Required screen states (from canonical route map)
- Navigation entry/exit (back behavior, where CTAs go)
- Monetization gates clearly designed (locked state → why locked → upgrade CTA)

---

# 2) Core Product Logic That Must Be Visible In Designs

## 2.1 Couple-first model
Designs must consistently express:
- Partner presence/absence (“online”, “offline”, “waiting for…”, “nudge”)
- Shared ownership (both can add to Moments, both can respond, etc.)
- Sync modes (“Together” vs “I’ll start”) where specified

## 2.2 Moments integration
Any Connect flow that generates something meaningful should have a consistent:
- “Save to Moments” opportunity
- “View in Moments” success/receipt state

## 2.3 Monetization rails are not optional
All premium gates must be designed:
- Plan comparison/benefit callouts
- Upgrade CTA destination: `/us/subscription`
- Purchase rails for Gifts (success states: `/gifts/success`)

---

# 3) Phased Order (Designing Without Losing Cohesion)

This is the recommended sequence to keep the design consistent as the surface area grows.

## Phase A — DNA lock (system first)
- Finalize tokens + typography + spacing + component primitives
- Ensure Home + Connect are identical to the golden HTML

## Phase B — Core tabs (5 routes)
- `/` (auth home state)
- `/connect` (hub)
- `/messages`
- `/moments`
- `/us`

## Phase C — Monetization rails + Gifts (critical to avoid later rework)
- `/us/subscription`, `/subscription/success`, `/subscription/failed`
- Gifts: `/gifts`, `/gifts/[id]`, `/gifts/send`, `/gifts/received`, `/gifts/history`, `/gifts/bundles`, `/gifts/success`

## Phase D — Connect activity flows
- Intimacy Deck, Hot Takes, Would You Rather, Time Capsule, Dream Builder, Rituals

## Phase E — Settings subpages + Auth/Onboarding
- `/us/*` subpages (edit profile, privacy, notifications, theme, etc.)
- Auth/onboarding/join

## Phase F — Marketing + Legal + Utility
- Marketing routes + legal routes + error/utility routes

---

# 4) Definition of Done (Per Page)

A page is “done” only when:
- It visually matches the system (tokens/components) and feels like Closer
- Desktop/tablet/mobile frames are all specified (tablet is not an afterthought)
- Required screen states are designed (loading/empty/error/locked/waiting/success)
- All CTAs lead to valid routes (no dead ends)
- Premium gates are clear and consistently styled
- Accessibility basics are respected (focus visibility, readable sizes, touch targets)

