# CLOSER — Production Essentials
## Final Missing Elements for a Fully Functional Application

---

# Table of Contents

1. [Landing Page / Marketing Site](#landing-page--marketing-site)
2. [Pricing Page](#pricing-page)
3. [Payment Success/Failure Pages](#payment-successfailure-pages)
4. [Account Recovery Flows](#account-recovery-flows)
5. [Partner Invitation Experience](#partner-invitation-experience)
6. [Settings Page Detailed Designs](#settings-page-detailed-designs)
7. [Image & Asset Requirements](#image--asset-requirements)
8. [Microinteractions Catalog](#microinteractions-catalog)
9. [Keyboard Shortcuts](#keyboard-shortcuts)
10. [Print Styles](#print-styles)
11. [Sharing & Social Features](#sharing--social-features)
12. [Data Export Format](#data-export-format)
13. [Browser & Device Support](#browser--device-support)
14. [Performance Budgets](#performance-budgets)
15. [Launch Checklist](#launch-checklist)
16. [Error & Utility Pages](#error--utility-pages)

---

# 1. Landing Page / Marketing Site

## 1.1 Landing Page (`/` for logged-out users)

### Page Structure
```
┌─────────────────────────────────────────────────────────────────────────┐
│  NAVIGATION BAR                                                         │
│  Logo          Features    Pricing    About    [Log In]  [Get Started] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                         HERO SECTION                                    │
│                                                                         │
│            "Stay Connected, Even Apart"                                │
│                                                                         │
│     A digital sanctuary for couples who want to                        │
│     maintain deep, meaningful connection — no matter the distance.     │
│                                                                         │
│                    [Get Started Free]                                  │
│                                                                         │
│                  [Hero illustration/animation]                          │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    SOCIAL PROOF STRIP                                   │
│                                                                         │
│     "50,000+ couples connected"  ★★★★★ 4.9 on App Store               │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                      FEATURES SECTION                                   │
│                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │
│  │              │  │              │  │              │                 │
│  │   Daily      │  │   Shared     │  │   Virtual    │                 │
│  │  Questions   │  │   Moments    │  │    Gifts     │                 │
│  │              │  │              │  │              │                 │
│  │  Discover    │  │  Capture     │  │  Show you    │                 │
│  │  something   │  │  your        │  │  care with   │                 │
│  │  new about   │  │  journey     │  │  beautiful   │                 │
│  │  each other  │  │  together    │  │  animations  │                 │
│  │              │  │              │  │              │                 │
│  └──────────────┘  └──────────────┘  └──────────────┘                 │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    HOW IT WORKS                                         │
│                                                                         │
│     1. Create your account                                              │
│     2. Invite your partner                                             │
│     3. Start connecting daily                                          │
│                                                                         │
│                    [See it in action →]                                │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    TESTIMONIALS                                         │
│                                                                         │
│    "Closer helped us stay connected during my deployment.              │
│     It's like we never missed a day."                                  │
│                   — Marcus & David, Military Couple                    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    PRICING PREVIEW                                      │
│                                                                         │
│         Free                Closer+              Closer Pro            │
│          $0              $9.99/month          $14.99/month             │
│                                                                         │
│                    [View all features →]                               │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    FINAL CTA                                           │
│                                                                         │
│              "Ready to grow closer?"                                   │
│                                                                         │
│                    [Get Started Free]                                  │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  FOOTER                                                                 │
│                                                                         │
│  Logo        Features    Pricing    About    Help                      │
│              Terms       Privacy    Cookies                            │
│                                                                         │
│  © 2025 Closer. Made with love for couples everywhere.                 │
│                                                                         │
│  [Twitter] [Instagram] [TikTok]                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**V1 scope note**
- “Help” links to `/us/help` (public).
- Blog/Contact can be external links in V1 (no new routes required).

### Hero Illustration Concept
- Two abstract figures (circles with subtle faces) connected by a glowing line
- Particles flowing between them
- Warm (clay) and cool (mist) color accents
- Subtle floating animation
- Could be Lottie or SVG animation

### Feature Cards Design
- Icon at top (Lucide icon in clay/mist circle)
- Headline: Fraunces, 24px
- Description: Manrope, 16px, --stone color
- Hover: Subtle lift and glow

---

## 1.2 Features Page (`/features`)

### Detailed Feature Sections

**Section 1: Intimacy Deck**
```
Left: Screenshot/mockup of card stack
Right:
  "Daily Questions That Matter"

  Discover something new about each other every day with
  our thoughtfully crafted question cards. From playful
  to profound, each card sparks meaningful conversation.

  ✓ 200+ questions across 6 categories
  ✓ Answer together in real-time
  ✓ Save favorite moments
  ✓ Create custom decks (Premium)
```

**Section 2: Shared Moments**
```
Right: Screenshot of moments timeline
Left:
  "Your Journey, Beautifully Captured"

  Every photo, every song, every milestone — saved in
  a shared timeline that tells your story.

  ✓ Photos with captions
  ✓ Songs you discover together
  ✓ Quotes that resonate
  ✓ Automatic milestone celebrations
```

**Section 3: Virtual Gifts**
```
Left: Animated gift preview
Right:
  "Show You Care, Anytime"

  Beautiful animated gifts that bring a smile —
  from a simple heart to a stunning aurora display.

  ✓ 34 unique animated gifts
  ✓ Add personal messages
  ✓ Free gifts included
  ✓ Premium & seasonal exclusives
```

**Section 4: Daily Rituals**
```
Right: Screenshot of rituals
Left:
  "Build Connection Into Every Day"

  Morning hellos, gratitude moments, and goodnight
  messages create touchpoints that keep you close.

  ✓ Morning & goodnight rituals
  ✓ Daily gratitude sharing
  ✓ Weekly check-ins
  ✓ Streak tracking
```

**Section 5: Time Capsules**
```
Left: Sealed capsule animation
Right:
  "Messages to Your Future Selves"

  Seal a message today, open it together in the future.
  Perfect for anniversaries, milestones, or just because.

  ✓ Set any future date
  ✓ Include photos & media
  ✓ Countdown together
  ✓ Beautiful reveal experience
```

**Section 6: Dream Builder**
```
Right: Dream progress screenshot
Left:
  "Build Your Future Together"

  Turn shared dreams into reality with collaborative
  goal-setting and milestone tracking.

  ✓ Visual progress tracking
  ✓ Milestone checklists
  ✓ Celebrate completions
  ✓ Archive your achievements
```

---

## 1.3 About Page (`/about`)

### Content Structure

**Our Story**
```
Closer was born from a simple observation: long-distance
couples don't need another video call app. They need ways
to feel connected in the moments between calls.

We built Closer as a digital sanctuary — a place where
distance disappears and connection deepens.
```

**Our Mission**
```
To help couples maintain deep, meaningful connection
regardless of physical distance.
```

**Our Values**
```
Privacy First — Your conversations are yours alone.
Intentional Design — Every feature serves connection.
Authentic Connection — Real intimacy, not metrics.
```

**Team Section** (if desired)
- Founder photos and brief bios
- Or keep anonymous with "Built by a remote team who understands distance"

---

# 2. Pricing Page

## 2.1 Pricing Page (`/pricing`)

### Desktop Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                   "Choose Your Connection"                              │
│                                                                         │
│         Monthly          Annual (Save 33%)                              │
│         ○─────────●                                                     │
│                                                                         │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐        │
│  │                  │ │   MOST POPULAR   │ │                  │        │
│  │      FREE        │ │    CLOSER+       │ │   CLOSER PRO     │        │
│  │                  │ │                  │ │                  │        │
│  │       $0         │ │  $9.99/month     │ │  $14.99/month    │        │
│  │                  │ │  $79.99/year     │ │  $119.99/year    │        │
│  │                  │ │                  │ │                  │        │
│  │  ● 3 cards/day   │ │  ● Unlimited     │ │  ● Everything    │        │
│  │  ● 7-day history │ │    cards         │ │    in Closer+    │        │
│  │  ● 6 free gifts  │ │  ● Full history  │ │  ● Custom decks  │        │
│  │  ● Basic games   │ │  ● 20 premium    │ │  ● Analytics     │        │
│  │  ● 1 capsule     │ │    gifts         │ │  ● All gifts     │        │
│  │                  │ │  ● Streak freeze │ │    free          │        │
│  │                  │ │  ● 5 capsules    │ │  ● Unlimited     │        │
│  │                  │ │  ● Custom themes │ │    capsules      │        │
│  │                  │ │                  │ │  ● Data export   │        │
│  │                  │ │                  │ │  ● Priority      │        │
│  │                  │ │                  │ │    support       │        │
│  │                  │ │                  │ │                  │        │
│  │  [Get Started]   │ │ [Start Free     │ │ [Start Free     │        │
│  │                  │ │  Trial]          │ │  Trial]          │        │
│  │                  │ │                  │ │                  │        │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘        │
│                                                                         │
│                                                                         │
│                    FEATURE COMPARISON TABLE                             │
│                                                                         │
│  Feature                    Free      Closer+     Closer Pro           │
│  ─────────────────────────────────────────────────────────────         │
│  Daily card draws           3         Unlimited   Unlimited            │
│  Moments history            7 days    Unlimited   Unlimited            │
│  Virtual gifts              6         26          34 (all)             │
│  Time capsules              1         5           Unlimited            │
│  Custom question decks      ✗         ✗           ✓                    │
│  Streak freeze              ✗         1/week      Unlimited            │
│  Custom themes              ✗         ✓           ✓                    │
│  Analytics dashboard        ✗         ✗           ✓                    │
│  Data export                ✗         ✗           ✓                    │
│  Priority support           ✗         ✗           ✓                    │
│                                                                         │
│                                                                         │
│                           FAQ                                          │
│                                                                         │
│  ▸ Can I switch plans anytime?                                         │
│  ▸ Is there a free trial?                                              │
│  ▸ Do both partners need to subscribe?                                 │
│  ▸ How do I cancel my subscription?                                    │
│  ▸ What payment methods do you accept?                                 │
│                                                                         │
│                                                                         │
│            "Ready to grow closer?"                                     │
│                  [Get Started Free]                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Pricing Card Design

**Free Tier:**
- Border: subtle (default)
- Background: transparent

**Closer+ (Most Popular):**
- Border: clay gradient glow
- Badge: "MOST POPULAR" at top
- Slight scale: 1.02

**Closer Pro:**
- Border: mist gradient glow
- Badge: "BEST VALUE" option

### FAQ Answers

**Can I switch plans anytime?**
Yes! Upgrade anytime and get prorated credit. Downgrade takes effect at the end of your billing period.

**Is there a free trial?**
Yes, all new users get 7 days of Closer+ free. No credit card required.

**Do both partners need to subscribe?**
No! When one partner subscribes, both unlock premium features.

**How do I cancel my subscription?**
Go to Us → Subscription → Cancel. Your benefits continue until the end of your billing period.

**What payment methods do you accept?**
We accept all major credit cards, Apple Pay, and Google Pay.

---

# 3. Payment Success/Failure Pages

## 3.1 Payment Success (`/subscription/success`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         ✨                                              │
│                    (confetti animation)                                 │
│                                                                         │
│              "Welcome to Closer+!"                                     │
│                                                                         │
│     You've unlocked a world of deeper connection.                      │
│                                                                         │
│     ┌───────────────────────────────────────┐                          │
│     │  Your new features:                   │                          │
│     │                                       │                          │
│     │  ✓ Unlimited card draws               │                          │
│     │  ✓ Full history access                │                          │
│     │  ✓ 20 premium gifts unlocked          │                          │
│     │  ✓ Streak freeze protection           │                          │
│     │  ✓ Custom themes                      │                          │
│     │                                       │                          │
│     └───────────────────────────────────────┘                          │
│                                                                         │
│              [Start Exploring]                                         │
│                                                                         │
│     Billing: $9.99/month • Next charge: Feb 28, 2025                   │
│     Receipt sent to your email                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Required behaviors**
- On load, verify subscription status (show “Confirming…” skeleton until confirmed).
- Primary CTA: `Start Exploring` → `/` (logged-in Home).
- Secondary link (optional): `Manage subscription` → `/us/subscription`.

**Edge states**
- `pending`: payment succeeded but tier not updated yet → auto-refresh + reassure copy.
- `already_active`: user revisits success page → show current plan + manage billing.

## 3.2 Payment Failure (`/subscription/failed`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         ⚠️                                             │
│                                                                         │
│              "Payment couldn't be processed"                           │
│                                                                         │
│     Don't worry — this happens sometimes.                              │
│     Here's what you can try:                                           │
│                                                                         │
│     • Check your card details                                          │
│     • Try a different payment method                                   │
│     • Contact your bank if the issue persists                          │
│                                                                         │
│              [Try Again]    [Use Different Card]                       │
│                                                                         │
│     Need help? [Contact Support]                                       │
│                                                                         │
│              [Return to Free Plan]                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Required behaviors**
- Show a short reason when available (ex: “card declined”, “authentication required”) without exposing raw processor codes.
- Primary CTA: `Try Again` → `/us/subscription` (preselect the intended plan).
- Support CTA: `Contact Support` → `/us/help` (or support email).

**Edge states**
- `canceled`: user backed out of checkout → softer copy (“No worries — you can upgrade anytime.”) + return CTA.
- `retry_limit`: repeated failures → recommend alternate method + support.

## 3.3 Gift Purchase Success (`/gifts/success`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                      [Gift animation preview]                          │
│                                                                         │
│              "Gift sent to [Partner Name]!"                            │
│                                                                         │
│     They'll receive a notification to open it.                         │
│                                                                         │
│              [Send Another Gift]    [Go to Messages]                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Required behaviors**
- Confirm gift delivery status (at minimum: “sent” vs “processing”).
- CTA destinations:
  - `Send Another Gift` → `/gifts`
  - `Go to Messages` → `/messages` (open partner thread)

---

# 4. Account Recovery Flows

## 4.1 Forgot Password Page (`/forgot-password`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                           Closer                                        │
│                                                                         │
│                    Reset your password                                 │
│                                                                         │
│     Enter your email and we'll send you a link to reset                │
│     your password.                                                     │
│                                                                         │
│     ┌─────────────────────────────────────────┐                        │
│     │  Email                                  │                        │
│     │  [                                    ] │                        │
│     └─────────────────────────────────────────┘                        │
│                                                                         │
│                    [Send Reset Link]                                   │
│                                                                         │
│                    [← Back to Login]                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4.2 Reset Password Sent

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                           ✉️                                           │
│                                                                         │
│                    Check your email                                    │
│                                                                         │
│     We sent a password reset link to:                                  │
│     your-email@example.com                                             │
│                                                                         │
│     The link expires in 1 hour.                                        │
│                                                                         │
│     Didn't receive it? [Resend Email]                                  │
│                                                                         │
│                    [← Back to Login]                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4.3 Reset Password Page (`/reset-password?token=...`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                           Closer                                        │
│                                                                         │
│                    Create new password                                 │
│                                                                         │
│     ┌─────────────────────────────────────────┐                        │
│     │  New Password                           │                        │
│     │  [                                  👁️] │                        │
│     │  At least 8 characters                  │                        │
│     └─────────────────────────────────────────┘                        │
│                                                                         │
│     ┌─────────────────────────────────────────┐                        │
│     │  Confirm Password                       │                        │
│     │  [                                  👁️] │                        │
│     └─────────────────────────────────────────┘                        │
│                                                                         │
│                    [Reset Password]                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4.4 Password Reset Success

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                           ✓                                            │
│                                                                         │
│                    Password updated!                                   │
│                                                                         │
│     You can now log in with your new password.                         │
│                                                                         │
│                    [Go to Login]                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 4.5 Invalid/Expired Token

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                           ⚠️                                           │
│                                                                         │
│                    Link expired                                        │
│                                                                         │
│     This password reset link has expired or is invalid.                │
│     Please request a new one.                                          │
│                                                                         │
│                    [Request New Link]                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 5. Partner Invitation Experience

## 5.1 Invite Code Display (`/onboarding/partner` for inviter)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    Invite Your Partner                                 │
│                                                                         │
│     Share this code with your partner to connect:                      │
│                                                                         │
│     ┌─────────────────────────────────────────┐                        │
│     │                                         │                        │
│     │           CLSR-A7K2-M9PL               │                        │
│     │                                         │                        │
│     │      [📋 Copy]        [📤 Share]        │                        │
│     │                                         │                        │
│     └─────────────────────────────────────────┘                        │
│                                                                         │
│     Or share this link:                                                │
│     closer.app/join/CLSR-A7K2-M9PL                                    │
│                                                                         │
│     Code expires in 7 days                                             │
│                                                                         │
│     ─────────────────────────────────────                              │
│                                                                         │
│     Already have a code from your partner?                             │
│     [Enter their code instead]                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 5.2 Join Via Link (`/join/[code]`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                           Closer                                        │
│                                                                         │
│                    You've Been Invited!                                │
│                                                                         │
│     [Partner Name] wants to connect with you on Closer.                │
│                                                                         │
│                    [Avatar of inviter]                                 │
│                                                                         │
│     Closer is a digital sanctuary for couples to stay                  │
│     connected through daily questions, shared moments,                 │
│     and virtual gifts.                                                 │
│                                                                         │
│                    [Accept & Create Account]                           │
│                                                                         │
│     Already have an account? [Log in to connect]                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Required behaviors**
- If logged out:
  - `Accept & Create Account` → `/signup` (carry invite code through)
  - `Log in to connect` → `/login` (carry invite code through)
- If logged in and not linked: `Accept` links couple → success state → `/onboarding/setup` (or `/` if onboarding already complete).

**Edge states**
- `invalid_or_expired`: “Invite link expired” + CTA to request a new invite + “Log in” link.
- `already_linked`: “You’re already connected” + CTA to go to Home.
- `self_invite`: “This link was created by your account” + CTA to share with partner.

## 5.3 Connection Success

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                      [Celebration animation]                           │
│                    Two hearts connecting                               │
│                                                                         │
│              "You're Connected!"                                       │
│                                                                         │
│     [Your Avatar] ❤️ [Partner Avatar]                                  │
│       You          [Partner Name]                                      │
│                                                                         │
│     Your journey together begins now.                                  │
│                                                                         │
│                    [Start Exploring]                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 6. Settings Page Detailed Designs

## 6.1 Edit Profile (`/us/edit-profile`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back                     Edit Profile                               │
│                                                                         │
│                    ┌───────────────────┐                               │
│                    │                   │                               │
│                    │    [Avatar]       │                               │
│                    │                   │                               │
│                    │   📷 Change       │                               │
│                    └───────────────────┘                               │
│                                                                         │
│     Display Name                                                       │
│     ┌─────────────────────────────────────────┐                        │
│     │  Maya                                   │                        │
│     └─────────────────────────────────────────┘                        │
│     This is how your partner sees you                                  │
│                                                                         │
│     Timezone                                                           │
│     ┌─────────────────────────────────────────┐                        │
│     │  America/Los_Angeles (PST)         ▼   │                        │
│     └─────────────────────────────────────────┘                        │
│     Used to show your partner what time it is for you                  │
│                                                                         │
│     Email                                                              │
│     ┌─────────────────────────────────────────┐                        │
│     │  maya@example.com                       │                        │
│     └─────────────────────────────────────────┘                        │
│     [Change Email →]                                                   │
│                                                                         │
│     Password                                                           │
│     [Change Password →]                                                │
│                                                                         │
│                                                                         │
│                    [Save Changes]                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Notifications Settings (`/us/notifications`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back                    Notifications                               │
│                                                                         │
│     Push Notifications                                                 │
│     ─────────────────────────────────────────                          │
│                                                                         │
│     Messages                                    [●─────]               │
│     Get notified when [Partner] messages you                           │
│                                                                         │
│     Game invites                                [●─────]               │
│     Know when [Partner] wants to play                                  │
│                                                                         │
│     Ritual reminders                            [●─────]               │
│     Morning, gratitude, and goodnight prompts                          │
│                                                                         │
│     Streak warnings                             [●─────]               │
│     Reminder when your streak is at risk                               │
│                                                                         │
│     Gifts                                       [●─────]               │
│     When you receive a virtual gift                                    │
│                                                                         │
│     Achievements                                [─────●]               │
│     When you unlock new achievements                                   │
│                                                                         │
│                                                                         │
│     Quiet Hours                                                        │
│     ─────────────────────────────────────────                          │
│                                                                         │
│     Pause notifications during:                                        │
│     [10:00 PM] to [7:00 AM]                                           │
│     (Your timezone: PST)                                               │
│                                                                         │
│                                                                         │
│     Email Notifications                                                │
│     ─────────────────────────────────────────                          │
│                                                                         │
│     Weekly summary                              [●─────]               │
│     Get a recap of your week together                                  │
│                                                                         │
│     Product updates                             [─────●]               │
│     New features and announcements                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 6.3 Privacy Settings (`/us/privacy`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back                       Privacy                                  │
│                                                                         │
│     Visibility                                                         │
│     ─────────────────────────────────────────                          │
│                                                                         │
│     Show online status                          [●─────]               │
│     [Partner] can see when you're active                               │
│                                                                         │
│     Show typing indicator                       [●─────]               │
│     [Partner] can see when you're typing                               │
│                                                                         │
│     Show read receipts                          [●─────]               │
│     [Partner] can see when you've read messages                        │
│                                                                         │
│                                                                         │
│     Your Data                                                          │
│     ─────────────────────────────────────────                          │
│                                                                         │
│     [Download your data]                                               │
│     Get a copy of everything we store about you                        │
│                                                                         │
│     [Request data deletion]                                            │
│     Permanently delete your account and all data                       │
│                                                                         │
│                                                                         │
│     Legal                                                              │
│     ─────────────────────────────────────────                          │
│                                                                         │
│     [Privacy Policy →]                                                 │
│     [Terms of Service →]                                               │
│     [Cookie Policy →]                                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 6.4 Subscription Management (`/us/subscription`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back                    Subscription                                │
│                                                                         │
│     Current Plan                                                       │
│     ┌─────────────────────────────────────────────────────────────┐   │
│     │                                                             │   │
│     │      ✨ Closer+                                             │   │
│     │                                                             │   │
│     │      $9.99/month                                            │   │
│     │      Next billing date: February 28, 2025                   │   │
│     │                                                             │   │
│     │      [Manage Payment Method]                                │   │
│     │      [View Billing History]                                 │   │
│     │                                                             │   │
│     └─────────────────────────────────────────────────────────────┘   │
│                                                                         │
│     Want more features?                                                │
│     ┌─────────────────────────────────────────────────────────────┐   │
│     │                                                             │   │
│     │      Upgrade to Closer Pro                                  │   │
│     │      $14.99/month                                           │   │
│     │                                                             │   │
│     │      ● Custom question decks                                │   │
│     │      ● Unlimited time capsules                              │   │
│     │      ● All gifts free                                       │   │
│     │      ● Analytics dashboard                                  │   │
│     │      ● Data export                                          │   │
│     │                                                             │   │
│     │      [Upgrade to Pro]                                       │   │
│     │                                                             │   │
│     └─────────────────────────────────────────────────────────────┘   │
│                                                                         │
│     [Cancel Subscription]                                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 7. Image & Asset Requirements

## 7.1 Required Images

| Asset | Dimensions | Format | Purpose |
|-------|------------|--------|---------|
| Logo (full) | 200x50 | SVG | Header, footer |
| Logo (icon) | 48x48 | SVG | Favicon, mobile |
| OG Image | 1200x630 | PNG | Social sharing |
| Twitter Image | 1200x600 | PNG | Twitter cards |
| App Icon | 1024x1024 | PNG | App stores |
| Splash Screen | 2732x2048 | PNG | PWA/mobile |
| Hero Illustration | 800x600 | SVG/Lottie | Landing page |
| Feature Icons | 64x64 | SVG | Feature cards |
| Empty State Illustrations | 300x200 | SVG | Empty views |
| Error Illustrations | 300x200 | SVG | 404, 500 pages |
| Onboarding Illustrations | 400x300 | SVG | Welcome screens |
| Avatar Placeholder | 200x200 | SVG | Default avatar |

## 7.2 Lottie Animations Required

| Animation | Duration | Purpose |
|-----------|----------|---------|
| Heart float | 2.5s loop | Free gift |
| Hug | 3s | Free gift |
| Kiss | 3s | Free gift |
| Star | 2s | Free gift |
| Sun rise | 3.5s | Free gift |
| Moon glow | 4s loop | Free gift |
| Heart burst | 4s | Premium gift |
| Flower bouquet | 5s | Premium gift |
| Love letter | 4.5s | Premium gift |
| Starry night | 6s loop | Premium gift |
| Warm drink | 4s loop | Premium gift |
| Sunset | 6s | Premium gift |
| Rainbow | 4s | Premium gift |
| Dancing couple | 5s loop | Premium gift |
| Fireflies | 6s loop | Premium gift |
| Northern lights | 8s loop | Premium gift |
| Rose garden | 5s | Purchasable |
| Candlelight | 6s loop | Purchasable |
| Fireworks | 5s | Purchasable |
| Love lock | 4s | Purchasable |
| Memory book | 5s | Purchasable |
| Hot air balloon | 6s | Purchasable |
| Galaxy | 7s loop | Purchasable |
| Cherry blossoms | 6s | Purchasable |
| Lantern festival | 8s | Purchasable |
| Aurora hearts | 8s loop | Purchasable |
| Confetti | 3s | Celebrations |
| Card flip | 0.6s | Card draw |
| Seal stamp | 0.8s | Time capsule |
| Loading spinner | 0.8s loop | Loading states |

## 7.3 Sound Effects (Optional)

| Sound | Duration | Purpose |
|-------|----------|---------|
| Message sent | 0.2s | Send confirmation |
| Message received | 0.3s | New message |
| Gift received | 1s | Gift notification |
| Card flip | 0.3s | Drawing card |
| Success chime | 0.5s | Achievements |
| Celebration | 1s | Milestones |

---

# 8. Microinteractions Catalog

## 8.1 Button Interactions

| Interaction | Animation |
|-------------|-----------|
| Hover | Scale 1.02, slight glow |
| Press | Scale 0.98 |
| Disabled | Opacity 0.5, no cursor |
| Loading | Replace text with spinner |

## 8.2 Input Interactions

| Interaction | Animation |
|-------------|-----------|
| Focus | Border highlight, subtle glow |
| Error | Red border, shake animation |
| Valid | Green checkmark appears |
| Clear button | Fade in on content |

## 8.3 Card Interactions

| Interaction | Animation |
|-------------|-----------|
| Hover | Lift 4px, shadow increase |
| Press | Scale 0.99 |
| Swipe (mobile) | Follow finger, spring back |
| Delete | Swipe out, collapse gap |

## 8.4 Toggle Interactions

| Interaction | Animation |
|-------------|-----------|
| On → Off | Slide left, color fade |
| Off → On | Slide right, color fill |
| Disabled | Grayed out, no cursor |

## 8.5 Navigation Interactions

| Interaction | Animation |
|-------------|-----------|
| Tab switch | Content crossfade 200ms |
| Page navigate | Slide in from right |
| Back navigate | Slide in from left |
| Modal open | Fade + scale from 0.95 |
| Modal close | Fade + scale to 0.95 |

---

# 9. Keyboard Shortcuts

## 9.1 Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `1` | Go to Home |
| `2` | Go to Moments |
| `3` | Go to Messages |
| `4` | Go to Connect |
| `5` | Go to Us |
| `Cmd/Ctrl + K` | Quick search |
| `Escape` | Close modal/overlay |
| `?` | Show shortcuts help |

## 9.2 Messages Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `Cmd/Ctrl + E` | Insert emoji |
| `Cmd/Ctrl + Shift + W` | Send as whisper |

## 9.3 Games Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Draw card / Submit |
| `Enter` | Confirm / Next |
| `Escape` | Skip / Cancel |

---

# 10. Print Styles

## 10.1 Printable Content

- Moments timeline (photo grid)
- Card session history
- Dream progress reports
- Weekly summaries

## 10.2 Print CSS

```css
@media print {
  /* Hide navigation */
  nav, .sidebar, .bottom-nav { display: none; }

  /* Remove backgrounds */
  body { background: white; color: black; }

  /* Show full content */
  .container { max-width: 100%; }

  /* Hide interactive elements */
  button, .btn, input { display: none; }

  /* Page breaks */
  .moment-card { break-inside: avoid; }

  /* Add URLs to links */
  a[href]::after { content: " (" attr(href) ")"; }
}
```

---

# 11. Sharing & Social Features

## 11.1 Shareable Content

| Content | Share Format |
|---------|--------------|
| App invite | Link + preview card |
| Achievement | Image + link |
| Milestone | Image + link |
| Gift (sender) | Animation preview |

## 11.2 Share Sheet Options

- Copy link
- Native share (Web Share API)
- Download image (for achievements/milestones)

## 11.3 Deep Links

| Link Pattern | Destination |
|--------------|-------------|
| `closer.app/join/[code]` | Partner invite |
| `closer.app/messages` | Open messages |
| `closer.app/connect` | Open connect |

---

# 12. Data Export Format

## 12.1 Export Contents

```
closer-export-2025-01-28/
├── profile.json
├── messages/
│   ├── messages.json
│   └── media/
│       ├── photo-001.jpg
│       ├── voice-001.webm
│       └── ...
├── moments/
│   ├── moments.json
│   └── photos/
│       └── ...
├── cards/
│   └── sessions.json
├── gifts/
│   └── history.json
├── capsules/
│   └── capsules.json
├── dreams/
│   └── dreams.json
└── README.txt
```

## 12.2 Export Format

```json
// profile.json
{
  "exported_at": "2025-01-28T12:00:00Z",
  "profile": {
    "display_name": "Maya",
    "email": "maya@example.com",
    "timezone": "America/Los_Angeles",
    "created_at": "2024-06-15T10:30:00Z"
  },
  "partner": {
    "display_name": "Jordan",
    "linked_at": "2024-06-15T14:00:00Z"
  },
  "stats": {
    "messages_sent": 2451,
    "moments_saved": 127,
    "cards_answered": 89,
    "days_together": 227,
    "longest_streak": 45
  }
}
```

---

# 13. Browser & Device Support

## 13.1 Browser Support

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Edge | 90+ | Full support |
| Samsung Internet | 14+ | Full support |
| Opera | 76+ | Full support |

## 13.2 Device Support

| Device | Screen Size | Notes |
|--------|-------------|-------|
| Desktop | 1024px+ | Primary experience |
| Tablet | 768-1023px | Adapted layouts |
| Mobile | 320-767px | Bottom nav, stacked layouts |

## 13.3 Feature Detection

```javascript
const FEATURES = {
  webShare: 'share' in navigator,
  serviceWorker: 'serviceWorker' in navigator,
  webPush: 'PushManager' in window,
  localStorage: 'localStorage' in window,
  indexedDB: 'indexedDB' in window,
  webSocket: 'WebSocket' in window,
};
```

---

# 14. Performance Budgets

## 14.1 Load Time Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| First Contentful Paint | <1.5s | 2.5s |
| Largest Contentful Paint | <2.5s | 4s |
| Time to Interactive | <3s | 5s |
| Cumulative Layout Shift | <0.1 | 0.25 |
| First Input Delay | <100ms | 300ms |

## 14.2 Bundle Size Budgets

| Bundle | Target | Maximum |
|--------|--------|---------|
| Initial JS | <150KB | 200KB |
| Initial CSS | <50KB | 75KB |
| Total initial | <300KB | 400KB |
| Lottie files (each) | <100KB | 150KB |
| Image (hero) | <200KB | 300KB |

## 14.3 API Response Times

| Endpoint | Target | Maximum |
|----------|--------|---------|
| Auth | <200ms | 500ms |
| Messages (paginated) | <300ms | 800ms |
| Real-time sync | <100ms | 300ms |
| File upload | <2s per MB | 5s per MB |

---

# 15. Launch Checklist

## 15.1 Pre-Launch

### Legal & Compliance
- [ ] Terms of Service reviewed by attorney
- [ ] Privacy Policy reviewed by attorney
- [ ] Cookie consent banner implemented
- [ ] GDPR compliance verified
- [ ] CCPA compliance verified
- [ ] Age verification (18+) implemented

### Technical
- [ ] All pages load correctly
- [ ] All forms validate and submit
- [ ] All payment flows tested
- [ ] Real-time features working
- [ ] Push notifications working
- [ ] Email delivery verified
- [ ] Error tracking configured
- [ ] Analytics tracking verified
- [ ] SSL certificate valid
- [ ] CDN configured
- [ ] Database backups scheduled
- [ ] Rate limiting enabled
- [ ] Security headers configured

### Content
- [ ] All placeholder text replaced
- [ ] All images have alt text
- [ ] All links work
- [ ] No lorem ipsum remaining
- [ ] Spelling/grammar checked
- [ ] Timezone handling tested

### Design
- [ ] Responsive at all breakpoints
- [ ] Dark mode only (no light mode bugs)
- [ ] Animations respect reduced motion
- [ ] Focus states visible
- [ ] Touch targets 44px+
- [ ] Empty states designed
- [ ] Loading states designed
- [ ] Error states designed

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Screen reader tested
- [ ] Keyboard navigation complete
- [ ] Color contrast verified
- [ ] Form labels present

### Performance
- [ ] Lighthouse score 90+
- [ ] Core Web Vitals passing
- [ ] Images optimized
- [ ] Fonts preloaded
- [ ] Code split appropriately

### External Services
- [ ] Supabase production project
- [ ] Stripe production keys
- [ ] OneSignal configured
- [ ] Sentry configured
- [ ] Domain configured
- [ ] DNS propagated

## 15.2 Launch Day

- [ ] Final backup created
- [ ] Monitoring dashboards ready
- [ ] Support team briefed
- [ ] Social media ready
- [ ] DNS cutover completed
- [ ] Smoke tests passed
- [ ] Status page created

## 15.3 Post-Launch

- [ ] Monitor error rates
- [ ] Monitor performance
- [ ] Review user feedback
- [ ] Fix critical issues
- [ ] Celebrate! 🎉

# 16. Error & Utility Pages

All system pages should use the same ambient background + centered glass surface treatment as the auth pages.
Keep copy calm, supportive, and partner-safe (no blame, no panic).

## 16.1 404 Not Found (`/404`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                           (subtle illustration)                         │
│                                                                         │
│                    “We couldn’t find that page.”                        │
│                                                                         │
│     It may have moved — or the link may be incomplete.                  │
│                                                                         │
│              [Go Home]      [Go to Connect]                             │
│                                                                         │
│                    [Visit Help Center]                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 16.2 500 Error (`/500`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                              ⚠️                                         │
│                                                                         │
│                    “Something went wrong.”                              │
│                                                                         │
│     Try again in a moment. If it keeps happening, contact support.      │
│                                                                         │
│              [Try Again]     [Contact Support]                           │
│                                                                         │
│     (optional) Error ID: ABC123                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 16.3 Maintenance (`/maintenance`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                     “We’ll be right back.”                              │
│                                                                         │
│     Closer is getting a small upgrade. Thanks for your patience.        │
│                                                                         │
│              [Retry]                                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## 16.4 Offline (`/offline`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         “You’re offline.”                               │
│                                                                         │
│     Some features may still be available if you’ve used them recently.  │
│                                                                         │
│              [Try Again]     [Go to Home]                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

*This document completes the production requirements for Closer.*
*All specifications are now comprehensive for full application development.*
