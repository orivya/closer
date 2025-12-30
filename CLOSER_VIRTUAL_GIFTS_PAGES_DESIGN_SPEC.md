# CLOSER — Virtual Gifts Pages Design Specification
## Page-by-Page UI + Interaction Guide (V1)

This document fills the V1 design-spec gap for the **Virtual Gifts** system pages:
- `/gifts`
- `/gifts/[id]`
- `/gifts/send`
- `/gifts/received`
- `/gifts/history`
- `/gifts/bundles`
- `/gifts/success`

For gift catalog + monetization rules, reference:
- `CLOSER_REFINED_SPECIFICATION.md` (gift catalog + tiers)
- `CLOSER_MASTER_SPECIFICATION.md` (gift refinement phases)
- `CLOSER_MOMENTS_MESSAGES_SPEC.md` (gift message bubble + reactions in chat)

---

# 0) Design Foundation (Shared)

- Use the same global shell, typography, tokens, surfaces, and motion rules as the core app (`CLOSER_DESIGN_DNA.md`).
- Gifts should feel **cinematic but restrained**: soft glow, subtle grain, premium pacing.
- Always respect `prefers-reduced-motion`: show a still poster frame + optional “Play animation” button.

---

# 1) Global Gifts UX Rules

## 1.1 Categories & Access Model

Display gifts as one of:
- **Free**: available to all users (price shows “Free”).
- **Included**: included with Closer+ / Pro (price shows “Included” + tier badge).
- **Purchasable**: one-time purchase ($0.99–$4.99).
- **Seasonal**: limited availability (also purchasable or included).
- **Bundles**: pack purchase.

## 1.2 Partner Requirement

If the user is not linked to a partner:
- Gifts pages show an empty state:
  - Title: “Connect to send gifts”
  - Copy: “Gifts are a little moment between you and your partner.”
  - CTA: “Connect Partner” → `/onboarding/partner` (or `/us/partner` if already onboarded)

## 1.3 “Send Gift” Should Be One Primary Action

Across the system, the primary CTA is always:
- **Send Gift** (or “Send free gift”)

Secondary actions:
- “Preview”
- “Save for later” (optional; can be “Favorite”)
- “View bundles” (upsell)

## 1.4 Purchase Behavior (Stripe)

Purchasable gifts should follow a consistent state model:
- `idle` → `creating_checkout_session` → `redirecting_to_stripe` → `return_success` (`/gifts/success`) / `return_cancel` (back to gift detail)

---

# 2) Gift Shop — `/gifts`

## 2.1 Page Structure (Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Gifts                                        [Search…] [Filters ⌄]   │
│ Tabs:  All | Free | Included | Purchasable | Seasonal | Bundles      │
├─────────────────────────────────────────────────────────────────────┤
│  Gift Grid (3–5 columns, responsive)                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │
│  │ [Preview]     │ │ [Preview]     │ │ [Preview]     │                │
│  │ Name          │ │ Name          │ │ Name          │                │
│  │ Badge + Price │ │ Badge + Price │ │ Badge + Price │                │
│  └──────────────┘ └──────────────┘ └──────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘
```

## 2.2 Gift Card (Grid Tile)

**Card requirements:**
- 1:1 preview area (poster frame or loop on hover)
- Name (Fraunces or strong Manrope, depending on system)
- Badge: `Free` / `Included` / `$X.XX` / `Seasonal`
- Premium lock indicator when not available (subtle lock glyph + muted CTA)

**Hover (desktop):**
- subtle lift + border highlight
- preview animates (if allowed)
- show quick actions row:
  - `Preview`
  - `Send`

**Tap (mobile):**
- opens gift detail

## 2.3 Search & Filters

Filters (modal/bottom sheet on mobile):
- Price: Free / Included / Purchasable
- Occasion: Anniversary, Valentine’s, etc (if seasonal)
- Intensity: Subtle / Big / Playful (optional)

## 2.4 Empty States

- No results: “No gifts match that filter.” + “Clear filters”
- Not linked: partner-required state (see 1.2)

---

# 3) Gift Detail — `/gifts/[id]`

## 3.1 Layout (Desktop)

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back                                                             │
│                                                                     │
│  ┌───────────────────────────┐  Gift Name                           │
│  │  Animation Preview         │  Badge: Included / $X.XX / Free      │
│  │  (loop / poster frame)     │  Short description                   │
│  └───────────────────────────┘                                      │
│                                                                     │
│  Occasion suggestions (chips)                                       │
│                                                                     │
│  [Send Gift]  [Preview]  (secondary: View bundles)                  │
│                                                                     │
│  Bundle upsell (if applicable)                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 3.2 Availability States

1) **Available free / included**
- Primary CTA: “Send Gift”

2) **Purchasable**
- Primary CTA: “Buy & Send — $X.XX”
- Secondary: “Preview”

3) **Locked (tier required)**
- Primary CTA: “Upgrade to send”
- Secondary: “Preview”
- Show what tier unlocks it (Closer+ vs Pro)

## 3.3 Preview Behavior

- Preview plays in-place (no navigation)
- If reduced motion: show still + “Play once” (no loop)

---

# 4) Send Gift — `/gifts/send`

## 4.1 Entry Points

- From `/gifts/[id]` with preselected gift
- From Messages (optional shortcut)

## 4.2 Page Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back                   Send a Gift                                 │
├─────────────────────────────────────────────────────────────────────┤
│ To:  [Partner Avatar + Name]  (locked to partner for V1)             │
│ Gift: [Mini preview + name]   [Change]                               │
│ Message (optional):                                                   │
│ [ textarea… ]                                                         │
│                                                                     │
│ Delivery:  Send now  (optional future: schedule)                     │
│                                                                     │
│ Primary:  [Send Gift] / [Buy & Send — $X.XX]                         │
└─────────────────────────────────────────────────────────────────────┘
```

## 4.3 Validation & States

- Empty message is allowed.
- If purchasable:
  - tap CTA → loading state “Preparing checkout…”
  - disable controls + show spinner
- If included/free:
  - tap CTA → `sending` state (optimistic) → success toast + navigate back

---

# 5) Gift Received — `/gifts/received`

## 5.1 Primary Experience

If there is an unopened gift:
- Auto-focus the newest gift card
- Primary CTA: “Open”
- Opening triggers a **full-screen** reveal moment (modal overlay or dedicated sub-state)

## 5.2 Reveal State (Full-screen)

```
┌─────────────────────────────────────────────────────────────────────┐
│ (dim background)                                                     │
│                                                                     │
│             [Wrapped gift]                                           │
│                 [Open]                                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

After open:

┌─────────────────────────────────────────────────────────────────────┐
│ (full-screen)                                                        │
│                                                                     │
│   [Gift animation plays once]                                        │
│                                                                     │
│   From: [Partner]                                                   │
│   “Message content…”                                                │
│                                                                     │
│   Actions: [❤️ React] [Reply in Messages] [Save to Moments]          │
│                                                                     │
│   [Done]                                                             │
└─────────────────────────────────────────────────────────────────────┘
```

## 5.3 Edge States

- No gifts received yet → empty state + CTA “Browse Gifts”
- Reduced motion → still poster frame + “Play”

---

# 6) Gift History — `/gifts/history`

## 6.1 Structure

- Tabs: **Received** | **Sent**
- Default to Received
- Grid of gift cards with:
  - gift poster frame
  - date
  - short message excerpt (optional)

## 6.2 Actions

- Tap card → opens detail overlay with:
  - poster/preview
  - “View in Messages” (if applicable)
  - “Save to Moments” (optional)

---

# 7) Gift Bundles — `/gifts/bundles`

## 7.1 Bundle Cards

Each bundle card includes:
- Bundle name
- Price
- “What’s inside” (3–6 gift thumbnails)
- CTA: “Buy bundle”

## 7.2 Bundle Detail (V1)

V1 can implement bundle detail as:
- an inline expand/collapse section inside the card, or
- a modal overlay (preferred for desktop)

---

# 8) Gift Purchase Success — `/gifts/success`

Required UI elements:
- Confirmation headline
- What happens next (“Your gift is ready to open”)
- CTA: “Back to Messages” + “Browse more gifts”
- Receipt note (email sent)

Also include a “Having trouble?” support link.

