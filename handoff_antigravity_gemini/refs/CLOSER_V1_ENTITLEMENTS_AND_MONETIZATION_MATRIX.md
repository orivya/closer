# CLOSER — V1 Entitlements & Monetization Matrix
## Tier Rules, One‑Time Purchases, and Where Gates Live

This document makes monetization cohesive across:
- Pages/routes (`CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`)
- UI specs (pages + gifts)
- Backend schema/endpoints (`CLOSER_TECHNICAL_INFRASTRUCTURE.md`)

Goal: **no monetization surprises later** (missing gates, missing upgrade paths, unclear “who is unlocked”).

---

# 1) Core Concepts

## 1.1 Subscription Tiers (V1)

Tiers (canonical):
- `free`
- `closer_plus`
- `closer_pro`

## 1.2 Couple‑Shared Subscription Benefits

Product rule (V1): **If either partner subscribes, both receive subscription benefits.**

Define an **effective couple tier**:

- `effective_tier(couple)` = highest active tier among the two partners
  - ordering: `closer_pro` > `closer_plus` > `free`
  - qualifying statuses: `active` and `trialing` count as active
  - `past_due` behavior: treat as active for a short grace period (implementation detail), otherwise drop to `free`

All feature gates that affect the couple experience should use `effective_tier`, not “my tier”.

---

# 2) One‑Time Purchases (V1)

One‑time purchases do **not** require a new page; they appear inside existing routes.

## 2.1 Purchasable Gifts ($0.99–$4.99)

- Free/Plus: can purchase and send
- Pro: all gifts are free (no checkout)

**Recommended V1 interpretation (consistent with “no coins” + bundles):**
- Individual purchasable gifts are paid **per send** (a purchase is created during the send flow).

## 2.2 Gift Bundles

Bundles are discounted ways to pre‑purchase a set of gift sends.
- Free/Plus: can buy a bundle
- Pro: irrelevant (everything free)

Bundle behavior (V1):
- Buying a bundle grants **one send** of each listed gift (or a defined quantity per gift).
- When sending a gift, the system consumes an available bundle entitlement first; if none, requires checkout.

## 2.3 Theme Packs ($2.99 each / $14.99 bundle)

Theme packs are **non‑consumable** UI unlocks.
- Free/Plus: can purchase theme packs
- Plus: also includes “custom themes” capability (theme customization UI)
- Pro: same as Plus (unless later expanded)

---

# 3) Feature Gates (By Pillar)

The table below defines:
- **What is gated**
- **Where the gate is surfaced** (route + UI state)
- **Upgrade target** (Plus vs Pro)

## 3.1 Connect / Activities

| Feature | Free | Plus | Pro | Gate lives |
|---|---|---|---|---|
| Intimacy Deck draws/day | 3/day | unlimited | unlimited | `/connect/intimacy-deck` (limit reached state) |
| Intimacy Deck custom deck builder | locked | locked | unlocked | `/connect/intimacy-deck/custom` |
| Game question depth/content | limited | full | full | game play routes (need-more prompt) |
| Rituals: Morning + Goodnight | unlocked | unlocked | unlocked | `/connect/rituals/*` |
| Rituals: Gratitude/Thinking/Weekly | locked | unlocked | unlocked | each ritual route (locked state + upgrade CTA) |
| Time capsules active | 1 | 5 | unlimited | create flow routes + capsule list state |

## 3.2 Messages

| Feature | Free | Plus | Pro | Gate lives |
|---|---|---|---|---|
| Text messages | unlocked | unlocked | unlocked | `/messages` |
| Whisper messages | unlocked | unlocked | unlocked | `/messages` |
| Voice notes | locked | unlocked (≤ 60s) | unlocked (≤ 5 min) | `/messages` record UI (locked / duration limit state) |
| Gift messages | unlocked (via gifts) | unlocked | unlocked | `/messages` gift bubble + `/gifts/*` |

## 3.3 Moments

| Feature | Free | Plus | Pro | Gate lives |
|---|---|---|---|---|
| Moments history | 7 days | unlimited | unlimited | `/moments` (older items blurred + CTA) |
| PDF export “moment book” | locked (optional purchase) | locked (optional purchase) | unlocked (or purchasable add‑on) | `/us/data` export options |

## 3.4 Gifts

| Feature | Free | Plus | Pro | Gate lives |
|---|---|---|---|---|
| Free gifts | unlocked | unlocked | unlocked | `/gifts`, `/gifts/send` |
| Premium gifts (included) | locked | unlocked | unlocked | `/gifts/[id]` (included badge / locked state) |
| Purchasable gifts | purchasable | purchasable | free | `/gifts/[id]`, `/gifts/send` |
| Gift bundles | purchasable | purchasable | free | `/gifts/bundles` |

## 3.5 “Us” (Account, Progress, Insights)

| Feature | Free | Plus | Pro | Gate lives |
|---|---|---|---|---|
| Achievements + streaks | unlocked | unlocked | unlocked | `/us/achievements`, `/us/streaks` |
| Streak freeze | locked | unlocked | unlocked | `/us/streaks` (use freeze action) |
| Theme customization UI | locked (unless purchased pack) | unlocked | unlocked | `/us/theme` |
| Relationship insights / weekly summary | locked | locked | unlocked | `/us` (insights card) + `/us/streaks` (optional) |

---

# 4) Upgrade Paths (Where CTAs Should Go)

To keep UX consistent and avoid dead ends:
- All upgrade CTAs should route to `/us/subscription` (or open a subscription modal that ends there).
- “Premium gift locked” CTAs can optionally deep-link to `/us/subscription` with a “Gifts” anchor.
- Trial prompts (if used) must be consistent: “Start 7‑day trial” → checkout or internal trial start.

---

# 5) Required “Gate States” (Design Deliverables)

For each gated feature, design must include:
- `locked_preview`: what the user sees before upgrading (tasteful preview)
- `blocked_action`: what happens on CTA click (modal/toast + route)
- `post_upgrade_return`: where the user lands after success (return to attempted action)

Examples:
- Free user hits draw limit → shows “Out of draws” card with CTA → returns to `/connect/intimacy-deck/draw`.
- Plus user records > 60s voice note → shows “Upgrade to Pro for 5‑minute voice notes”.
- Free user scrolls Moments older than 7 days → blurred cards with “Keep them forever” CTA.

