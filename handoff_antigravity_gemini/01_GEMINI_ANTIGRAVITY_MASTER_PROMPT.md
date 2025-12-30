# MASTER PROMPT — Closer V1 (Gemini + Antigravity)

Use this prompt to redesign the **full Design DNA** and produce full-page designs for the entire Closer V1 app/website.

## Context
Closer is a **premium couples app** (“digital sanctuary”) with a dark, warm, intimate UI. It includes:
- Core tabs: Home, Moments, Messages, Connect, Us
- Connect experiences: Intimacy Deck, Hot Takes, Would You Rather, Time Capsule, Dream Builder, Rituals
- Virtual Gifts store + purchase + send/receive flows
- Subscription + monetization gates
- Public marketing + auth + onboarding + legal + error/utility pages

## Files To Read (in this handoff folder)

### Golden reference (pixel anchor)
- `assets/GOLDEN_REFERENCE__closer_clean.html`

### Canonical route + screen-state source of truth
- `refs/CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`

### Business + product intent
- `refs/CLOSER_BUSINESS_BLUEPRINT.md`

### Page design + interaction specs
- `refs/CLOSER_PAGES_SPECIFICATION.md`
- `refs/CLOSER_GAME_PAGES_DESIGN_SPEC.md`
- `refs/CLOSER_MOMENTS_MESSAGES_SPEC.md`
- `refs/CLOSER_VIRTUAL_GIFTS_PAGES_DESIGN_SPEC.md`

### Monetization + gating
- `refs/CLOSER_V1_ENTITLEMENTS_AND_MONETIZATION_MATRIX.md`

### Production/launch constraints + legal
- `refs/CLOSER_PRODUCTION_ESSENTIALS.md`
- `refs/CLOSER_LEGAL_CONTENT_SPEC.md`

### Technical constraints (what’s feasible / what needs states)
- `refs/CLOSER_TECHNICAL_INFRASTRUCTURE.md`

---

# Your Mission

## 1) Redesign / finalize the “Design DNA” for the full product
You are not designing one page — you are defining the **system** the whole product will use.

Hard constraints:
- **Home + Connect must remain pixel-parity** with `assets/GOLDEN_REFERENCE__closer_clean.html`.
- Everything else must feel like it belongs to the same product: same typography, spacing rhythm, shadows, borders, motion physics, and surface language.
- Avoid “over-glass”: blur only where the golden reference uses it.
- Mobile + tablet are first-class: spacing and alignment must be intentional at every breakpoint.

Output requirements for the Design DNA:
- Tokens (colors, typography, spacing, radii, borders, shadows, z-index layers, motion)
- Component primitives (button, icon button, input, pill, tiles, cards, modals/sheets, lists)
- Layout primitives (shell, container, grid rules, responsive breakpoints)
- State patterns (loading, empty, error, locked/premium gate, waiting for partner, success)
- Content/copy tone rules (intimate, partner-aware language; no “gamey” coin/score vibes)

## 2) Design every V1 page, including all screen states
Use the route/state map as the checklist:
- `refs/CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`

Create designs for:
- Desktop, tablet, mobile
- Each required screen state (loading/empty/error/locked/waiting/success/etc.)

---

# Required Deliverables (What You Must Produce)

## A) “Design DNA Pack” (system)
1. Token table (with names, values, usage rules)
2. Type scale + rules (Fraunces + Manrope usage)
3. Component inventory with variants + states
4. Motion library (durations, easing, when motion is allowed, reduced-motion rules)
5. Layout system (shell, grid, spacing rhythm, breakpoint behaviors)

## B) Page Library (all routes)
For every V1 route:
- Frame(s) for desktop/tablet/mobile
- Required screen states (from canonical map)
- Notes: entry points, primary CTA, secondary CTAs, back behavior, premium gates

## C) “Implementation Notes” (for later integration)
- Which components are reused where
- Which pages are templates (ex: `[id]` pages)
- Any ambiguous requirements or conflicts discovered (should be rare; canonical route map wins)

---

# “Do Not Drift” Visual Rules (from the golden reference)

## Core palette
- Deep base background (`--base`)
- Sand text (`--sand`) + stone secondary (`--stone`)
- Clay + Mist as accents (warm + dream)
- Borders are ultra-thin and subtle

## Surface language
- Default surfaces: subtle near-black or subtle white-on-black overlays
- Blur is used sparingly (timezone pill, chat header, mobile nav)
- Cards use thin borders, gentle shadows, and hover lift — not heavy glow

## Signature “premium delight” patterns to preserve
- Connect hero: rising hearts + 3D card stack hover expansion (don’t overuse elsewhere)
- Whisper message: blurred content with “hold to reveal”

---

# Product Logic Rules You Must Respect

## Couple-first mental model
- Always show partner-aware states (“waiting for Emma”, “sent to Maya”, etc.)
- “Together vs I’ll start” patterns must exist in Connect flows (especially Intimacy Deck + games + rituals)

## Monetization must be designed in (not bolted on)
- Every premium-gated feature must have:
  - a clear locked state
  - a clear upgrade CTA
  - a clear explanation of what unlocks
- Gifts require purchase flows + success states.

---

# Suggested Design Order (so everything stays cohesive)

1) DNA + tokens + base components (nav, cards, pills, buttons, inputs, modal/sheets)
2) Core tabs: `/` (auth home), `/connect`, `/moments`, `/messages`, `/us`
3) Monetization rails: `/us/subscription`, `/subscription/success`, `/subscription/failed`
4) Gifts: `/gifts` + detail + send + received + history + bundles + success
5) Connect game flows (each as a mini “product within the product”)
6) Settings subpages (`/us/*`)
7) Auth/onboarding/join
8) Marketing + legal + utility pages

---

# Quality Bar Checklist (World-Class)

For every page:
- Clear hierarchy, clean alignment, consistent spacing
- Accessible: contrast, keyboard focus, large tap targets
- Responsive: tablet layouts are deliberate (not “mobile stretched”)
- State completeness: loading/empty/error/locked/waiting/success are designed
- Cross-links make sense (no dead ends)

If you need to make assumptions, list them explicitly as “Assumptions” and keep them minimal.

