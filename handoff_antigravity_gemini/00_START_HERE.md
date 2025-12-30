# Closer — Antigravity + Gemini Design Handoff (V1)

This folder is a **self-contained handoff** for redesigning/expanding the **full Design DNA** and producing page designs for the entire Closer V1 website/app.

If you only read one file, read `01_GEMINI_ANTIGRAVITY_MASTER_PROMPT.md`.

---

## What’s In This Folder

**Golden reference (HTML)**
- `assets/GOLDEN_REFERENCE__closer_clean.html`

**Prompts + checklists**
- `01_GEMINI_ANTIGRAVITY_MASTER_PROMPT.md` (copy/paste master prompt)
- `02_V1_PAGE_INVENTORY.md` (every V1 route grouped + counted)
- `03_DELIVERABLES_AND_DEFINITION_OF_DONE.md` (what “finished” means)

**Reference specs (copy of project docs)**
- `refs/` contains the specs Gemini/Antigravity should cite/obey.
  - Canonical route+state source of truth: `refs/CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`
  - Business blueprint: `refs/CLOSER_BUSINESS_BLUEPRINT.md`
  - Monetization matrix: `refs/CLOSER_V1_ENTITLEMENTS_AND_MONETIZATION_MATRIX.md`
  - Page specs: `refs/CLOSER_PAGES_SPECIFICATION.md`, `refs/CLOSER_GAME_PAGES_DESIGN_SPEC.md`, `refs/CLOSER_MOMENTS_MESSAGES_SPEC.md`, `refs/CLOSER_VIRTUAL_GIFTS_PAGES_DESIGN_SPEC.md`
  - Legal copy guidance: `refs/CLOSER_LEGAL_CONTENT_SPEC.md`
  - Technical constraints overview: `refs/CLOSER_TECHNICAL_INFRASTRUCTURE.md`
  - Current CSS/tokens snapshot for implementers: `refs/closer-web__globals.css`

---

## How To Use This (Recommended Workflow)

1) **Open the golden reference HTML** (`assets/GOLDEN_REFERENCE__closer_clean.html`)
- This is the current preferred visual direction: “clean premium, not overly glassy”.
- Home + Connect are the DNA anchor: everything else must feel like it belongs.

2) **Read the canonical route/state map**
- `refs/CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`
- If any other doc conflicts, this doc wins.

3) **Use the master prompt**
- Copy/paste `01_GEMINI_ANTIGRAVITY_MASTER_PROMPT.md` into Gemini/Antigravity.

4) **Design in phases**
- Start by creating the Design DNA + reusable component system.
- Then design routes in the order described in `03_DELIVERABLES_AND_DEFINITION_OF_DONE.md`.

---

## “Do Not Drift” Rules

- Home + Connect should remain **pixel-parity** with the golden reference HTML.
- Don’t invent new routes. If a missing route is discovered, it must be added to `refs/CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md` first (then designed).
- Every route must include required **screen states** (loading, empty, error, locked, waiting, success) as specified in the canonical route/state map.

