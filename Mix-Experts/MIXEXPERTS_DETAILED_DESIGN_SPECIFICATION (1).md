# MixExperts.com — Detailed Design & Page Specification

## Complete Page-by-Page Design Reference

**Version 2.0 — Production Ready**
**December 2025**

---

# TABLE OF CONTENTS

1. [Design System Reference](#1-design-system-reference)
2. [Public Pages](#2-public-pages)
3. [Authentication Pages](#3-authentication-pages)
4. [Dashboard Pages](#4-dashboard-pages)
5. [Component Library](#5-component-library)
6. [Interaction Patterns](#6-interaction-patterns)
7. [Responsive Behavior](#7-responsive-behavior)
8. [Animation Guidelines](#8-animation-guidelines)
9. [Page Connections & Navigation](#9-page-connections--navigation)

---

# 1. DESIGN SYSTEM REFERENCE

## 1.1 Visual Identity

### Core Aesthetic
- **Style:** Premium dark interface with warm accents
- **Mood:** Professional, modern, trustworthy
- **Influences:** Spotify, Linear, Vercel
- **Typography:** Clean, readable, hierarchy-driven
- **Spacing:** Generous whitespace, breathing room

### Design Principles
1. **Clarity over decoration** — Every element serves a purpose
2. **Hierarchy through contrast** — Important elements pop, secondary recedes
3. **Consistency breeds trust** — Same patterns everywhere
4. **Motion with meaning** — Animations guide, not distract
5. **Accessibility first** — WCAG AA compliant minimum

## 1.2 Color System

### Background Layers (Dark Theme)
```
┌──────────────────────────────────────────────────┐
│  bg-base: #0A0A0C                                │
│  ┌────────────────────────────────────────────┐  │
│  │  bg-elevated: #131316                      │  │
│  │  ┌──────────────────────────────────────┐  │  │
│  │  │  bg-card: #1A1A1E                    │  │  │
│  │  │  ┌────────────────────────────────┐  │  │  │
│  │  │  │  bg-hover: #222226             │  │  │  │
│  │  │  └────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### Accent Colors (6 Themes)
| Theme | Primary | Light | Dark | Use Case |
|-------|---------|-------|------|----------|
| **Amber** | #C9956C | #D4A97E | #B8855C | Default, warm, inviting |
| **Teal** | #5BA4A4 | #6FB8B8 | #4A9090 | Cool, professional |
| **Sage** | #7D9B8A | #8FA897 | #6B8778 | Natural, organic |
| **Slate** | #6B8CAE | #7D9BBD | #5A7A9A | Corporate, trustworthy |
| **Rose** | #B88B8B | #C69D9D | #A67A7A | Creative, artistic |
| **Violet** | #9B8BB8 | #AB9CC6 | #8A7AA6 | Unique, memorable |

### Text Hierarchy
```
--text-white: #FAFAFA     → Primary headings, important labels
--text-gray: #A3A3A3      → Body text, descriptions
--text-muted: #737373     → Secondary info, captions
--text-faint: #525252     → Disabled, placeholder
```

### Border System
```
--border-dark: rgba(255, 255, 255, 0.06)         → Default borders
--border-dark-strong: rgba(255, 255, 255, 0.1)  → Emphasized borders
```

## 1.3 Typography Scale

### Font Family
**Primary:** Plus Jakarta Sans (400, 500, 600, 700, 800)

### Type Scale
| Name | Size | Weight | Usage |
|------|------|--------|-------|
| display | 72px | 800 | Hero headlines |
| h1 | 48px | 700 | Page titles |
| h2 | 36px | 700 | Section headers |
| h3 | 24px | 600 | Card titles |
| h4 | 20px | 600 | Subsection headers |
| body | 16px | 400 | Paragraphs |
| body-sm | 14px | 400 | Secondary text |
| caption | 12px | 500 | Labels, badges |
| tiny | 11px | 600 | Micro labels |

### Line Heights
- Headings: 1.1 - 1.2
- Body: 1.6
- Captions: 1.4

## 1.4 Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| space-xs | 8px | Tight internal spacing |
| space-sm | 12px | Between related items |
| space-md | 16px | Default component padding |
| space-lg | 24px | Section internal padding |
| space-xl | 32px | Between sections |
| space-2xl | 48px | Large section gaps |
| space-3xl | 64px | Page section separators |
| space-4xl | 96px | Major page sections |

### Layout Maximums
- **Max content width:** 1200px
- **Max text width:** 680px
- **Max card width:** 400px
- **Container padding:** 24px (mobile), 48px (desktop)

## 1.5 Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| radius-sm | 8px | Small buttons, badges |
| radius-md | 12px | Inputs, small cards |
| radius-lg | 16px | Cards, modals |
| radius-xl | 24px | Large cards, sections |
| radius-full | 9999px | Pills, avatars |

## 1.6 Shadow System

```css
/* Subtle elevation */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.15);

/* Standard cards */
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.2);

/* Elevated modals */
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.25);

/* Accent glow effect */
--shadow-glow: 0 0 40px var(--accent-glow);
```

## 1.7 Transition Tokens

```css
--transition-fast: 0.15s ease;           /* Hover states */
--transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);  /* UI changes */
--transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);    /* Page transitions */
```

---

# 2. PUBLIC PAGES

## 2.1 Marketing Homepage (`/`)

### Purpose
Convert visitors to signups. Showcase platform value proposition.

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│  NAVIGATION BAR (sticky)                                        │
│  ┌─────────┐                              ┌─────┐ ┌──────────┐  │
│  │  Logo   │    Features  Pricing  Examples│Login│ │ Sign Up  │  │
│  └─────────┘                              └─────┘ └──────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HERO SECTION                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │   "Your Sound. Your Brand."                             │   │
│  │   [display, 72px, text-white]                           │   │
│  │                                                         │   │
│  │   Professional portfolio websites for mixing            │   │
│  │   and mastering engineers. In minutes, not months.      │   │
│  │   [body, 18px, text-gray]                               │   │
│  │                                                         │   │
│  │   ┌────────────────┐  ┌────────────────┐               │   │
│  │   │ Start Free     │  │ View Examples  │               │   │
│  │   │ [PRIMARY BTN]  │  │ [SECONDARY]    │               │   │
│  │   └────────────────┘  └────────────────┘               │   │
│  │                                                         │   │
│  │   ┌─────────────────────────────────────────────────┐  │   │
│  │   │                                                 │  │   │
│  │   │  [HERO IMAGE: Dashboard mockup or profile       │  │   │
│  │   │   preview with subtle glow effect]              │  │   │
│  │   │                                                 │  │   │
│  │   └─────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SOCIAL PROOF BAR                                               │
│  "Trusted by 2,000+ engineers worldwide"                        │
│  [Logos: Grammy, Billboard, Spotify, etc. - grayscale]          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PROBLEM/SOLUTION SECTION                                       │
│  ┌─────────────────────────┐  ┌─────────────────────────┐      │
│  │  WITHOUT MIXEXPERTS     │  │  WITH MIXEXPERTS        │      │
│  │  ────────────────────   │  │  ────────────────────   │      │
│  │  ✗ Instagram DM chaos   │  │  ✓ Professional inbox   │      │
│  │  ✗ Google Drive links   │  │  ✓ Before/after player  │      │
│  │  ✗ Manual scheduling    │  │  ✓ Automated booking    │      │
│  │  ✗ PayPal invoices      │  │  ✓ Integrated payments  │      │
│  │  [red-tinted card]      │  │  [accent-tinted card]   │      │
│  └─────────────────────────┘  └─────────────────────────┘      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FEATURES GRID (3 columns)                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ [Icon]      │ │ [Icon]      │ │ [Icon]      │               │
│  │ Portfolio   │ │ Booking     │ │ Payments    │               │
│  │ ─────────── │ │ ─────────── │ │ ─────────── │               │
│  │ Showcase    │ │ Calendar    │ │ Stripe      │               │
│  │ before/     │ │ integrates  │ │ Connect     │               │
│  │ after audio │ │ with Google │ │ built-in    │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ [Icon]      │ │ [Icon]      │ │ [Icon]      │               │
│  │ AI Writing  │ │ Products    │ │ Analytics   │               │
│  │ ─────────── │ │ ─────────── │ │ ─────────── │               │
│  │ Bio and     │ │ Sell        │ │ Track views │               │
│  │ copy        │ │ presets     │ │ and         │               │
│  │ generation  │ │ templates   │ │ conversions │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  BEFORE/AFTER DEMO                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "Hear the difference"                                   │   │
│  │                                                         │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │  [Interactive before/after player demo]           │  │   │
│  │  │                                                   │  │   │
│  │  │  ▶ ━━━━━━━━━━━●━━━━━━━━━━  2:34 / 3:45          │  │   │
│  │  │                                                   │  │   │
│  │  │           ┌──────────────────┐                   │  │   │
│  │  │           │ BEFORE │ AFTER  │                   │  │   │
│  │  │           │   ○    │   ●    │                   │  │   │
│  │  │           └──────────────────┘                   │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  │                                                         │   │
│  │  "Every MixExperts profile includes this player"        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AI FEATURE SPOTLIGHT                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Split: Left text, Right mockup]                       │   │
│  │                                                         │   │
│  │  "AI that gets your voice"        [Chat interface       │   │
│  │                                    mockup showing        │   │
│  │  • Generate professional bios     AI drafting a          │   │
│  │  • Draft client responses         response]              │   │
│  │  • 24/7 chatbot on your profile                         │   │
│  │  • Profile optimization tips                            │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TESTIMONIALS CAROUSEL                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ← [Testimonial Card] [Testimonial Card] [Testimonial] → │   │
│  │                                                         │   │
│  │  "MixExperts transformed my freelance business..."      │   │
│  │  — James Wilson, Mixing Engineer                        │   │
│  │  ★★★★★                                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PRICING PREVIEW                                                │
│  [See full pricing section spec below]                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FINAL CTA                                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  "Ready to level up?"                                   │   │
│  │                                                         │   │
│  │  Create your free profile in under 10 minutes.         │   │
│  │                                                         │   │
│  │           ┌────────────────────────┐                   │   │
│  │           │    Get Started Free    │                   │   │
│  │           └────────────────────────┘                   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FOOTER                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Logo]           Product    Company    Legal           │   │
│  │  MixExperts       Features   About      Terms           │   │
│  │                   Pricing    Blog       Privacy         │   │
│  │  The platform     Examples   Contact    Cookies         │   │
│  │  for audio                                              │   │
│  │  professionals    [Social icons: Twitter, Instagram]    │   │
│  │                                                         │   │
│  │  © 2025 MixExperts Inc.                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Details

**Navigation Bar:**
- Height: 72px
- Background: transparent, becomes bg-base/90 + backdrop-blur on scroll
- Logo: Icon + "MixExperts" wordmark
- Nav links: text-gray, hover text-white
- Login: ghost button
- Sign Up: primary button

**Hero Section:**
- Full viewport height minus nav
- Subtle radial gradient from accent-subtle at top
- Headline: display size, text-white
- Subhead: body-lg, text-gray
- Buttons: primary + secondary, side by side
- Hero image: slight perspective tilt, accent glow shadow

**Features Grid:**
- 3 columns on desktop, 1 on mobile
- Each card: bg-card, border-dark, rounded-xl
- Icon: 48px, accent color
- Title: h4, text-white
- Description: body-sm, text-gray

### Interactions
- Scroll-triggered fade-in animations
- Navigation transparency transition on scroll
- Testimonial carousel auto-advances every 5 seconds
- Before/after player fully functional as demo


## 2.2 Pricing Page (`/pricing`)

### Purpose
Convert visitors to signups by clearly communicating value at each tier.

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│  [Navigation - same as homepage]                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HEADER                                                         │
│  "Simple, transparent pricing"                                  │
│  [h1, centered]                                                 │
│                                                                 │
│  "Start free, upgrade when you need more."                      │
│  [body, text-gray, centered]                                    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PRICING CARDS (3 columns)                                      │
│                                                                 │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐         │
│  │    FREE       │ │    PRO ★      │ │  ENTERPRISE   │         │
│  │               │ │  [highlighted]│ │               │         │
│  │    $0         │ │    $19        │ │    $49        │         │
│  │   /month      │ │   /month      │ │   /month      │         │
│  │               │ │               │ │               │         │
│  │ ───────────── │ │ ───────────── │ │ ───────────── │         │
│  │               │ │               │ │               │         │
│  │ ✓ Profile     │ │ ✓ Everything  │ │ ✓ Everything  │         │
│  │   page        │ │   in Free     │ │   in Pro      │         │
│  │ ✓ 3 portfolio │ │ ✓ Unlimited   │ │ ✓ Team        │         │
│  │   items       │ │   portfolio   │ │   accounts    │         │
│  │ ✓ 2 services  │ │ ✓ Unlimited   │ │ ✓ White-label │         │
│  │ ✓ Contact     │ │   services    │ │   options     │         │
│  │   form        │ │ ✓ 0% fees     │ │ ✓ API access  │         │
│  │               │ │ ✓ Custom      │ │ ✓ Priority    │         │
│  │ • 20% fee on  │ │   domain      │ │   support     │         │
│  │   transactions│ │ ✓ Booking     │ │ ✓ Dedicated   │         │
│  │ • MixExperts  │ │   calendar    │ │   account     │         │
│  │   branding    │ │ ✓ Testimonials│ │   manager     │         │
│  │               │ │ ✓ Analytics   │ │               │         │
│  │               │ │ ✓ Products    │ │               │         │
│  │               │ │   storefront  │ │               │         │
│  │               │ │               │ │               │         │
│  │ [Start Free]  │ │ [Upgrade Now] │ │ [Contact Us]  │         │
│  │ [secondary]   │ │ [primary]     │ │ [secondary]   │         │
│  └───────────────┘ └───────────────┘ └───────────────┘         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AI ADD-ON CARD (full width)                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ┌─────────┐                                            │   │
│  │  │ ✨ AI   │  AI ASSISTANT ADD-ON                       │   │
│  │  │ [icon]  │  +$12/month with any plan                  │   │
│  │  └─────────┘                                            │   │
│  │                                                         │   │
│  │  • AI-powered bio and copy generation                   │   │
│  │  • Client response drafting                             │   │
│  │  • 24/7 chatbot on your profile                         │   │
│  │  • Profile optimization suggestions                     │   │
│  │  • Business insights and forecasting                    │   │
│  │                                                         │   │
│  │                              [Add to Any Plan]          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  COMPARISON TABLE                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Feature              │ Free  │  Pro  │ Enterprise     │   │
│  │  ────────────────────────────────────────────────────   │   │
│  │  Portfolio items      │   3   │  ∞    │     ∞          │   │
│  │  Services             │   2   │  ∞    │     ∞          │   │
│  │  Transaction fee      │  20%  │  0%   │    0%          │   │
│  │  Custom domain        │   ✗   │  ✓    │     ✓          │   │
│  │  Booking calendar     │   ✗   │  ✓    │     ✓          │   │
│  │  Testimonials         │   ✗   │  ✓    │     ✓          │   │
│  │  Analytics            │ Basic │ Full  │   Full         │   │
│  │  Digital products     │   ✗   │  ✓    │     ✓          │   │
│  │  Team members         │   1   │   1   │    10          │   │
│  │  Support              │ Email │ Email │  Priority      │   │
│  │  API access           │   ✗   │   ✗   │     ✓          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FAQ SECTION                                                    │
│  [Accordion style, expandable]                                  │
│                                                                 │
│  ▸ Can I switch plans anytime?                                  │
│  ▸ What payment methods do you accept?                          │
│  ▸ Is there a contract or commitment?                           │
│  ▸ What happens to my profile if I downgrade?                   │
│  ▸ How does the transaction fee work?                           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  [Footer]                                                       │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Details

**Pricing Cards:**
- Pro card: slightly elevated, accent border, "Most Popular" badge
- Free and Enterprise: bg-card, border-dark
- Price: h1 size, text-white
- Period: text-muted
- Features: checkmarks in accent color, x marks in text-muted

**AI Add-on Card:**
- Full width
- Gradient border effect (accent to purple)
- Icon with sparkle animation


## 2.3 Public Engineer Profile (`/[username]`)

### Purpose
Showcase engineer's work, services, and enable client contact/booking.

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│  STICKY NAVIGATION                                              │
│  ┌─────────┐                                                    │
│  │ [Avatar]│  Engineer Name                                     │
│  │         │                                                    │
│  └─────────┘  Work  Services  Products  About  Contact          │
│                                              ┌─────────────┐    │
│                                              │ Get in Touch│    │
│                                              └─────────────┘    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HERO SECTION                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Background: Subtle gradient + optional banner image]   │   │
│  │                                                         │   │
│  │         ┌─────────┐                                     │   │
│  │         │         │                                     │   │
│  │         │ [Avatar]│  ← 120px, rounded-full, glow        │   │
│  │         │         │                                     │   │
│  │         └─────────┘                                     │   │
│  │                                                         │   │
│  │      "Engineer Display Name"                            │   │
│  │      [h1, 48px, text-white, centered]                   │   │
│  │                                                         │   │
│  │      "Tagline goes here — short and punchy"             │   │
│  │      [body, text-accent, centered]                      │   │
│  │                                                         │   │
│  │      📍 Los Angeles, CA                                  │   │
│  │      [caption, text-muted]                              │   │
│  │                                                         │   │
│  │      [IG] [YT] [Spotify] [Twitter]                      │   │
│  │      [Social icons, text-gray, hover:text-white]        │   │
│  │                                                         │   │
│  │      ┌────────────┐  ┌────────────┐                    │   │
│  │      │ View Work  │  │ Get Quote  │                    │   │
│  │      │ [secondary]│  │ [primary]  │                    │   │
│  │      └────────────┘  └────────────┘                    │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ABOUT SECTION                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "About"                                                │   │
│  │  [h2, section header]                                   │   │
│  │                                                         │   │
│  │  [Bio text - rich text with paragraphs]                 │   │
│  │  [body, text-gray, max-width: 680px]                    │   │
│  │                                                         │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │   │
│  │  │ Hip-Hop│ │  R&B   │ │  Pop   │ │  Soul  │           │   │
│  │  │ [badge]│ │ [badge]│ │ [badge]│ │ [badge]│           │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘           │   │
│  │  [Genre/specialty badges]                               │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CREDITS SECTION (if has credits)                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "Worked With"                                          │   │
│  │                                                         │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │   │
│  │  │[Logo]│ │[Logo]│ │[Logo]│ │[Logo]│ │[Logo]│         │   │
│  │  │      │ │      │ │      │ │      │ │      │         │   │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘         │   │
│  │  [Grayscale logos, hover:color, clickable]              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PORTFOLIO SECTION                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "Work"                                                 │   │
│  │                                                         │   │
│  │  [Filter: All | Mixing | Mastering | Genre tabs]        │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  FEATURED PROJECT                                │   │   │
│  │  │  ┌─────────────────┐                             │   │   │
│  │  │  │                 │  "Song Title"               │   │   │
│  │  │  │   [Cover Art]   │  Artist Name                │   │   │
│  │  │  │                 │  Hip-Hop • 2024             │   │   │
│  │  │  │                 │                             │   │   │
│  │  │  └─────────────────┘                             │   │   │
│  │  │                                                  │   │   │
│  │  │  ┌───────────────────────────────────────────┐  │   │   │
│  │  │  │  BEFORE/AFTER PLAYER                      │  │   │   │
│  │  │  │                                           │  │   │   │
│  │  │  │  ▶ ━━━━━━━━━━●━━━━━━━━━  1:24 / 3:45    │  │   │   │
│  │  │  │                                           │  │   │   │
│  │  │  │         ┌─────────────────┐              │  │   │   │
│  │  │  │         │ BEFORE │ AFTER │              │  │   │   │
│  │  │  │         └─────────────────┘              │  │   │   │
│  │  │  │                                           │  │   │   │
│  │  │  │  🔊 ━━━━━━●━━━                           │  │   │   │
│  │  │  └───────────────────────────────────────────┘  │   │   │
│  │  │                                                  │   │   │
│  │  │  [Spotify embed or link if available]            │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  PORTFOLIO GRID (other projects)                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                │   │
│  │  │ [Cover]  │ │ [Cover]  │ │ [Cover]  │                │   │
│  │  │ Title    │ │ Title    │ │ Title    │                │   │
│  │  │ Artist   │ │ Artist   │ │ Artist   │                │   │
│  │  │ ▶ Play   │ │ ▶ Play   │ │ ▶ Play   │                │   │
│  │  └──────────┘ └──────────┘ └──────────┘                │   │
│  │  [Clickable cards, expand to show player]               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SERVICES SECTION                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "Services"                                             │   │
│  │                                                         │   │
│  │  ┌───────────────────┐ ┌───────────────────┐           │   │
│  │  │                   │ │                   │           │   │
│  │  │  🎚️ FULL MIX      │ │  💿 MASTERING     │           │   │
│  │  │                   │ │                   │           │   │
│  │  │  Starting at      │ │  Starting at      │           │   │
│  │  │  $350             │ │  $75              │           │   │
│  │  │                   │ │                   │           │   │
│  │  │  ─────────────    │ │  ─────────────    │           │   │
│  │  │                   │ │                   │           │   │
│  │  │  ✓ Full stems     │ │  ✓ Stereo master  │           │   │
│  │  │  ✓ 3 revisions    │ │  ✓ 2 revisions    │           │   │
│  │  │  ✓ 7-day delivery │ │  ✓ 3-day delivery │           │   │
│  │  │  ✓ Stem export    │ │  ✓ All formats    │           │   │
│  │  │                   │ │                   │           │   │
│  │  │  [Book Now]       │ │  [Book Now]       │           │   │
│  │  │                   │ │                   │           │   │
│  │  └───────────────────┘ └───────────────────┘           │   │
│  │                                                         │   │
│  │  ┌───────────────────┐ ┌───────────────────┐           │   │
│  │  │  🎤 2-TRACK MIX   │ │  📞 CONSULTATION  │           │   │
│  │  │  $150             │ │  $50/hour         │           │   │
│  │  │  [...]            │ │  [...]            │           │   │
│  │  └───────────────────┘ └───────────────────┘           │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PRODUCTS SECTION (if has products)                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "Products"                                             │   │
│  │                                                         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                │   │
│  │  │ [Cover]  │ │ [Cover]  │ │ [Cover]  │                │   │
│  │  │          │ │          │ │          │                │   │
│  │  │ Vocal    │ │ Mix      │ │ Sample   │                │   │
│  │  │ Preset   │ │ Template │ │ Pack     │                │   │
│  │  │ Pack     │ │          │ │          │                │   │
│  │  │          │ │          │ │          │                │   │
│  │  │ $29      │ │ $49      │ │ $19      │                │   │
│  │  │          │ │          │ │          │                │   │
│  │  │ [▶ Demo] │ │ [▶ Demo] │ │ [▶ Demo] │                │   │
│  │  │ [Buy]    │ │ [Buy]    │ │ [Buy]    │                │   │
│  │  └──────────┘ └──────────┘ └──────────┘                │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TESTIMONIALS SECTION (if has testimonials)                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "What Clients Say"                                     │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  ★★★★★                                          │   │   │
│  │  │                                                 │   │   │
│  │  │  "Working with [Name] was incredible. The mix   │   │   │
│  │  │   came back exactly how I imagined it..."       │   │   │
│  │  │                                                 │   │   │
│  │  │  — Sarah Johnson                                │   │   │
│  │  │    Independent Artist                           │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  [< ] [●] [○] [○] [ >]  ← Carousel dots               │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FAQ SECTION (if has FAQs)                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  "Frequently Asked Questions"                           │   │
│  │                                                         │   │
│  │  ▸ What's your turnaround time?                         │   │
│  │  ▸ How many revisions are included?                     │   │
│  │  ▸ What file formats do you need?                       │   │
│  │  ▸ Do you offer sample mixes?                           │   │
│  │                                                         │   │
│  │  [Accordion - click to expand]                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CONTACT/CTA SECTION                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Background: Accent gradient, subtle]                  │   │
│  │                                                         │   │
│  │  "Ready to get started?"                                │   │
│  │                                                         │   │
│  │  Let's discuss your project and find the                │   │
│  │  perfect solution for your sound.                       │   │
│  │                                                         │   │
│  │           ┌─────────────────────────┐                  │   │
│  │           │     Get in Touch        │                  │   │
│  │           │     [PRIMARY BUTTON]    │                  │   │
│  │           └─────────────────────────┘                  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FOOTER                                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ┌────┐                                                 │   │
│  │  │[Av]│  Engineer Name                                  │   │
│  │  └────┘                                                 │   │
│  │                                                         │   │
│  │  Tagline text here...                                   │   │
│  │                                                         │   │
│  │  Products        Services       Support                 │   │
│  │  ─────────       ─────────      ─────────               │   │
│  │  Vocal Presets   Full Mix       Contact                 │   │
│  │  Templates       Mastering      FAQ                     │   │
│  │  All Products    2-Track Mix    Terms                   │   │
│  │                                                         │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │                                                         │   │
│  │  © 2025 Engineer Name.  Powered by MixExperts           │   │
│  │                                                         │   │
│  │  [Instagram] [YouTube] [Spotify]                        │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  AI CHATBOT WIDGET (if enabled)                                 │
│  [Fixed position, bottom-right corner]                          │
│                                                                 │
│                                    ┌────────────────────────┐  │
│                                    │ ┌──────────────────┐   │  │
│                                    │ │ Hi! I'm [Name]'s │   │  │
│                                    │ │ assistant. How   │   │  │
│                                    │ │ can I help?      │   │  │
│                                    │ └──────────────────┘   │  │
│                                    │                        │  │
│                                    │ ┌──────────────────┐   │  │
│                                    │ │ Type a message...│   │  │
│                                    │ └──────────────────┘   │  │
│                                    └────────────────────────┘  │
│                                                                 │
│                                    ┌────┐                      │
│                                    │ 💬 │  ← Collapsed state   │
│                                    └────┘                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Before/After Player Detailed Spec

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  BEFORE/AFTER AUDIO PLAYER                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  ┌─────┐                                               │   │
│  │  │     │  "Song Title"                                 │   │
│  │  │ ART │  Artist Name                                  │   │
│  │  │     │                                               │   │
│  │  └─────┘                                               │   │
│  │                                                         │   │
│  │  WAVEFORM VISUALIZATION                                │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ ▁▂▃▅▆▇█▇▆▅▃▂▁▂▃▅▆▇█▇▆▅▃▂▁▂▃▅▆▇█▇▆▅▃▂▁▂▃▅▆▇█▇▆ │   │   │
│  │  │ ▔▔▔▔▔▔▔▔▔▔▔▔●▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │   │   │
│  │  │           [played]  [remaining - dimmed]         │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  CONTROLS                                              │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │                                                 │   │   │
│  │  │   ┌───┐                              ┌───────┐  │   │   │
│  │  │   │ ▶ │    1:24 / 3:45              │ 🔊━━● │  │   │   │
│  │  │   │   │                              │       │  │   │   │
│  │  │   └───┘                              └───────┘  │   │   │
│  │  │   [play/pause]                       [volume]   │   │   │
│  │  │                                                 │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  A/B TOGGLE                                            │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │                                                 │   │   │
│  │  │           ┌─────────────────────────┐          │   │   │
│  │  │           │                         │          │   │   │
│  │  │           │   BEFORE   │   AFTER    │          │   │   │
│  │  │           │     ○      │     ●      │          │   │   │
│  │  │           │   [dim]    │ [accent]   │          │   │   │
│  │  │           │                         │          │   │   │
│  │  │           └─────────────────────────┘          │   │   │
│  │  │                                                 │   │   │
│  │  │  Toggle switches instantly with crossfade       │   │   │
│  │  │  Position syncs between both versions           │   │   │
│  │  │                                                 │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  STYLING DETAILS:                                               │
│  • Background: bg-card                                          │
│  • Border: border-dark, rounded-xl                              │
│  • Play button: accent color, circular, shadow-glow on hover    │
│  • Progress bar: accent color for played, bg-hover for remaining│
│  • Toggle: pill shape, accent background for active side        │
│  • Waveform: generated from audio, accent color                 │
│  • Transition: 100ms crossfade between before/after             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# 3. AUTHENTICATION PAGES

## 3.1 Login Page (`/login`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [Full height, centered content]                                │
│                                                                 │
│                    ┌─────────────────────────┐                  │
│                    │                         │                  │
│                    │    [MixExperts Logo]    │                  │
│                    │                         │                  │
│                    │    Welcome back         │                  │
│                    │    [h2, text-white]     │                  │
│                    │                         │                  │
│                    │    Sign in to your      │                  │
│                    │    account              │                  │
│                    │    [body, text-gray]    │                  │
│                    │                         │                  │
│                    │    ┌─────────────────┐  │                  │
│                    │    │ Email           │  │                  │
│                    │    │ [input]         │  │                  │
│                    │    └─────────────────┘  │                  │
│                    │                         │                  │
│                    │    ┌─────────────────┐  │                  │
│                    │    │ Password        │  │                  │
│                    │    │ [input]     👁   │  │                  │
│                    │    └─────────────────┘  │                  │
│                    │                         │                  │
│                    │    ┌─────────────────┐  │                  │
│                    │    │                 │  │                  │
│                    │    │   Sign In       │  │                  │
│                    │    │   [PRIMARY]     │  │                  │
│                    │    │                 │  │                  │
│                    │    └─────────────────┘  │                  │
│                    │                         │                  │
│                    │    Forgot password?     │                  │
│                    │    [link, text-accent]  │                  │
│                    │                         │                  │
│                    │    ─────────────────    │                  │
│                    │                         │                  │
│                    │    Don't have an        │                  │
│                    │    account? Sign up     │                  │
│                    │    [link]               │                  │
│                    │                         │                  │
│                    └─────────────────────────┘                  │
│                                                                 │
│  [Background: Subtle gradient + optional decorative elements]   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### States
- **Default:** Empty form
- **Loading:** Button shows spinner, inputs disabled
- **Error:** Red border on invalid field, error message below
- **Success:** Redirect to dashboard

## 3.2 Signup Page (`/signup`)

### Layout (Multi-step)
```
STEP 1: Account Creation
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ┌─────────────────────────┐                  │
│                    │                         │                  │
│                    │    [MixExperts Logo]    │                  │
│                    │                         │                  │
│                    │    Create your account  │                  │
│                    │                         │                  │
│                    │    Step 1 of 3          │                  │
│                    │    [●][○][○]            │                  │
│                    │                         │                  │
│                    │    ┌─────────────────┐  │                  │
│                    │    │ Email           │  │                  │
│                    │    └─────────────────┘  │                  │
│                    │                         │                  │
│                    │    ┌─────────────────┐  │                  │
│                    │    │ Password        │  │                  │
│                    │    └─────────────────┘  │                  │
│                    │                         │                  │
│                    │    ┌─────────────────┐  │                  │
│                    │    │ Confirm Password│  │                  │
│                    │    └─────────────────┘  │                  │
│                    │                         │                  │
│                    │    [Continue →]         │                  │
│                    │                         │                  │
│                    └─────────────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

STEP 2: Profile Basics
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ┌─────────────────────────┐                  │
│                    │                         │                  │
│                    │    Tell us about you    │                  │
│                    │                         │                  │
│                    │    Step 2 of 3          │                  │
│                    │    [●][●][○]            │                  │
│                    │                         │                  │
│                    │    ┌─────────────────┐  │                  │
│                    │    │ Display Name    │  │                  │
│                    │    │ "James Wilson"  │  │                  │
│                    │    └─────────────────┘  │                  │
│                    │                         │                  │
│                    │    ┌─────────────────┐  │                  │
│                    │    │ Username        │  │                  │
│                    │    │ mixexperts.com/ │  │                  │
│                    │    │ [    input    ] │  │                  │
│                    │    │ ✓ Available     │  │                  │
│                    │    └─────────────────┘  │                  │
│                    │                         │                  │
│                    │    ┌─────────────────┐  │                  │
│                    │    │ I primarily do: │  │                  │
│                    │    │ ○ Mixing        │  │                  │
│                    │    │ ○ Mastering     │  │                  │
│                    │    │ ○ Both          │  │                  │
│                    │    └─────────────────┘  │                  │
│                    │                         │                  │
│                    │    [← Back] [Continue →]│                  │
│                    │                         │                  │
│                    └─────────────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

STEP 3: Finish Setup
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ┌─────────────────────────┐                  │
│                    │                         │                  │
│                    │    Almost there!        │                  │
│                    │                         │                  │
│                    │    Step 3 of 3          │                  │
│                    │    [●][●][●]            │                  │
│                    │                         │                  │
│                    │    ┌─────────┐          │                  │
│                    │    │  [+]    │          │                  │
│                    │    │  Add    │          │                  │
│                    │    │  Photo  │          │                  │
│                    │    └─────────┘          │                  │
│                    │    [optional]           │                  │
│                    │                         │                  │
│                    │    ☐ I agree to the     │                  │
│                    │      Terms of Service   │                  │
│                    │      and Privacy Policy │                  │
│                    │                         │                  │
│                    │    [Create Account]     │                  │
│                    │                         │                  │
│                    └─────────────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 3.3 Forgot Password (`/forgot-password`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ┌─────────────────────────┐                  │
│                    │                         │                  │
│                    │    [MixExperts Logo]    │                  │
│                    │                         │                  │
│                    │    Reset your password  │                  │
│                    │                         │                  │
│                    │    Enter your email and │                  │
│                    │    we'll send you a     │                  │
│                    │    reset link.          │                  │
│                    │                         │                  │
│                    │    ┌─────────────────┐  │                  │
│                    │    │ Email           │  │                  │
│                    │    └─────────────────┘  │                  │
│                    │                         │                  │
│                    │    [Send Reset Link]    │                  │
│                    │                         │                  │
│                    │    ← Back to login      │                  │
│                    │                         │                  │
│                    └─────────────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Success State
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    ┌─────────────────────────┐                  │
│                    │                         │                  │
│                    │    ✓ Check your email   │                  │
│                    │    [success icon]       │                  │
│                    │                         │                  │
│                    │    We sent a reset link │                  │
│                    │    to your@email.com    │                  │
│                    │                         │                  │
│                    │    Didn't receive it?   │                  │
│                    │    [Resend]             │                  │
│                    │                         │                  │
│                    └─────────────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# 4. DASHBOARD PAGES

## 4.1 Dashboard Layout (Shared)

### Desktop Layout
```
┌─────────────────────────────────────────────────────────────────┐
│  SIDEBAR (240px fixed)              MAIN CONTENT AREA           │
│  ┌────────────────────┐  ┌──────────────────────────────────┐  │
│  │                    │  │                                  │  │
│  │  ┌──────────────┐  │  │  [Page Header]                   │  │
│  │  │  MixExperts  │  │  │                                  │  │
│  │  │  [Logo]      │  │  │  [Page Content]                  │  │
│  │  └──────────────┘  │  │                                  │  │
│  │                    │  │                                  │  │
│  │  ──────────────    │  │                                  │  │
│  │                    │  │                                  │  │
│  │  🏠 Home           │  │                                  │  │
│  │  👤 Profile        │  │                                  │  │
│  │  💼 Business       │  │                                  │  │
│  │  📥 Inbox (3)      │  │                                  │  │
│  │  ⚙️ Settings       │  │                                  │  │
│  │                    │  │                                  │  │
│  │  ──────────────    │  │                                  │  │
│  │                    │  │                                  │  │
│  │  🤖 AI Assistant   │  │                                  │  │
│  │  📊 Analytics      │  │                                  │  │
│  │                    │  │                                  │  │
│  │  ──────────────    │  │                                  │  │
│  │                    │  │                                  │  │
│  │  [View Profile →]  │  │                                  │  │
│  │                    │  │                                  │  │
│  │  ┌──────────────┐  │  │                                  │  │
│  │  │ [Avatar]     │  │  │                                  │  │
│  │  │ Engineer Name│  │  │                                  │  │
│  │  │ Pro Plan     │  │  │                                  │  │
│  │  └──────────────┘  │  │                                  │  │
│  │                    │  │                                  │  │
│  └────────────────────┘  └──────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Layout
```
┌─────────────────────────────┐
│  [Header - 56px]            │
│  ┌─────────────────────────┐│
│  │ ☰  MixExperts   [Avatar]││
│  └─────────────────────────┘│
├─────────────────────────────┤
│                             │
│  [Scrollable Content]       │
│                             │
│                             │
│                             │
│                             │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│  [Bottom Navigation - 72px] │
│  ┌─────────────────────────┐│
│  │ 🏠   👤   💼   📥   ⚙️  ││
│  │Home Prof Biz  Inbox Set ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

## 4.2 Dashboard Home (`/dashboard`)

### Purpose
Overview of key metrics, quick actions, and recent activity.

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│  [Sidebar]                  DASHBOARD HOME                      │
│             ┌───────────────────────────────────────────────┐   │
│             │                                               │   │
│             │  Good morning, James 👋                       │   │
│             │  [h1, text-white]                             │   │
│             │                                               │   │
│             │  Here's what's happening with your profile.   │   │
│             │  [body, text-gray]                            │   │
│             │                                               │   │
│             ├───────────────────────────────────────────────┤   │
│             │                                               │   │
│             │  QUICK ACTIONS                                │   │
│             │  ┌─────────┐ ┌─────────┐ ┌─────────┐         │   │
│             │  │ View    │ │ Share   │ │ Add     │         │   │
│             │  │ Profile │ │ Link    │ │ Project │         │   │
│             │  │ [→]     │ │ [📋]    │ │ [+]     │         │   │
│             │  └─────────┘ └─────────┘ └─────────┘         │   │
│             │                                               │   │
│             ├───────────────────────────────────────────────┤   │
│             │                                               │   │
│             │  STATS (This Week)                            │   │
│             │  ┌───────────┐ ┌───────────┐ ┌───────────┐   │   │
│             │  │  VIEWS    │ │ INQUIRIES │ │  REVENUE  │   │   │
│             │  │           │ │           │ │           │   │   │
│             │  │   247     │ │     5     │ │  $1,250   │   │   │
│             │  │  +12%     │ │   +2      │ │  +$450    │   │   │
│             │  │  ↑ [green]│ │   ↑       │ │  ↑        │   │   │
│             │  └───────────┘ └───────────┘ └───────────┘   │   │
│             │                                               │   │
│             ├───────────────────────────────────────────────┤   │
│             │                                               │   │
│             │  PROFILE COMPLETENESS                         │   │
│             │  ┌─────────────────────────────────────────┐ │   │
│             │  │                                         │ │   │
│             │  │  ████████████████░░░░░░░░  72%         │ │   │
│             │  │                                         │ │   │
│             │  │  To reach 100%:                         │ │   │
│             │  │  • Add 2 more portfolio items           │ │   │
│             │  │  • Add testimonials section             │ │   │
│             │  │  • Complete your FAQ                    │ │   │
│             │  │                                         │ │   │
│             │  └─────────────────────────────────────────┘ │   │
│             │                                               │   │
│             ├───────────────────────────────────────────────┤   │
│             │                                               │   │
│             │  RECENT INQUIRIES                             │   │
│             │  ┌─────────────────────────────────────────┐ │   │
│             │  │ [●] Sarah J. — "Looking for R&B mix..." │ │   │
│             │  │     2 hours ago • Full Mix             │ │   │
│             │  ├─────────────────────────────────────────┤ │   │
│             │  │ [○] Mike T. — "Need mastering for..."  │ │   │
│             │  │     Yesterday • Mastering              │ │   │
│             │  ├─────────────────────────────────────────┤ │   │
│             │  │ [○] Studio XYZ — "Bulk project..."     │ │   │
│             │  │     2 days ago • Custom                │ │   │
│             │  └─────────────────────────────────────────┘ │   │
│             │  [View All Inquiries →]                       │   │
│             │                                               │   │
│             ├───────────────────────────────────────────────┤   │
│             │                                               │   │
│             │  AI SUGGESTIONS                               │   │
│             │  ┌─────────────────────────────────────────┐ │   │
│             │  │ 💡 Your bio could be stronger.          │ │   │
│             │  │    [Generate with AI →]                 │ │   │
│             │  ├─────────────────────────────────────────┤ │   │
│             │  │ 💡 You have an unanswered inquiry.      │ │   │
│             │  │    [Draft response →]                   │ │   │
│             │  └─────────────────────────────────────────┘ │   │
│             │                                               │   │
│             └───────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 4.3 Profile Editor (`/dashboard/profile`)

### Sub-navigation
```
Profile → Basic Info | Portfolio | Credits | Testimonials | FAQ
```

### Basic Info Editor
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  BASIC INFO                                                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  PROFILE PHOTO                  BANNER IMAGE              │ │
│  │  ┌─────────┐                   ┌───────────────────────┐  │ │
│  │  │         │                   │                       │  │ │
│  │  │ [Photo] │                   │      [Banner]         │  │ │
│  │  │         │                   │                       │  │ │
│  │  └─────────┘                   └───────────────────────┘  │ │
│  │  [Change]                      [Change]                   │ │
│  │                                                           │ │
│  │  ─────────────────────────────────────────────────────── │ │
│  │                                                           │ │
│  │  Display Name                                             │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ James Wilson                                        │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Username                                                 │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ mixexperts.com/jameswilson                          │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Tagline                              [✨ Generate with AI]│ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ Grammy-nominated mixing engineer specializing in... │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Bio                                  [✨ Generate with AI]│ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │                                                     │ │ │
│  │  │ [Rich text editor with formatting options]          │ │ │
│  │  │                                                     │ │ │
│  │  │                                                     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Location                                                 │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ Los Angeles, CA                                     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Genres/Specialties                                       │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ [Hip-Hop ×] [R&B ×] [Pop ×] [+ Add]                 │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Social Links                                             │ │
│  │  Instagram  ┌─────────────────────────────────────────┐  │ │
│  │             │ @jameswilsonmixes                       │  │ │
│  │             └─────────────────────────────────────────┘  │ │
│  │  YouTube    ┌─────────────────────────────────────────┐  │ │
│  │             │ youtube.com/c/jameswilson               │  │ │
│  │             └─────────────────────────────────────────┘  │ │
│  │  [+ Add Social Link]                                      │ │
│  │                                                           │ │
│  │  Theme Color                                              │ │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐              │ │
│  │  │Ambr│ │Teal│ │Sage│ │Slat│ │Rose│ │Viol│              │ │
│  │  │ ●  │ │    │ │    │ │    │ │    │ │    │              │ │
│  │  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘              │ │
│  │                                                           │ │
│  │  ─────────────────────────────────────────────────────── │ │
│  │                                                           │ │
│  │                    [Save Changes]                         │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Portfolio Manager
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  PORTFOLIO                                      [+ Add Project] │
│                                                                 │
│  Drag to reorder • Click to edit                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⋮⋮  ┌──────┐  "Summer Vibes"                    [Edit]  │   │
│  │     │[Art] │  Artist: Jade Thompson              [···]  │   │
│  │     │      │  Hip-Hop • 2024                            │   │
│  │     └──────┘  ✓ Before/After uploaded   ★ Featured      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⋮⋮  ┌──────┐  "Midnight Dreams"                 [Edit]  │   │
│  │     │[Art] │  Artist: Marcus Cole                [···]  │   │
│  │     │      │  R&B • 2024                                │   │
│  │     └──────┘  ✓ Before/After uploaded                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⋮⋮  ┌──────┐  "Electric Soul"                   [Edit]  │   │
│  │     │[Art] │  Artist: The Waves                  [···]  │   │
│  │     │      │  Pop • 2023                                │   │
│  │     └──────┘  ⚠ Missing before audio                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

[+ Add Project] opens modal:

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ADD PORTFOLIO ITEM                                    [×]      │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Cover Image                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │              [Drag & drop or click to upload]           │   │
│  │              JPG, PNG • Max 5MB                         │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Song/Project Title                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Artist Name                                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Genre                          Release Year                    │
│  ┌──────────────────────┐      ┌──────────────────────┐        │
│  │ [Select genre ▼]     │      │ 2024                 │        │
│  └──────────────────────┘      └──────────────────────┘        │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  BEFORE/AFTER AUDIO                                             │
│                                                                 │
│  Before (Raw/Rough Mix)                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [📁 Upload Audio]    or drag file here                 │   │
│  │  MP3, WAV, FLAC • Max 50MB                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  After (Final Mix)                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [📁 Upload Audio]    or drag file here                 │   │
│  │  MP3, WAV, FLAC • Max 50MB                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Spotify Link (optional)                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ https://open.spotify.com/track/...                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Description (optional)                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ☐ Feature this project (shows larger on profile)               │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│                        [Cancel]    [Save Project]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 4.4 Business Management (`/dashboard/business`)

### Sub-navigation
```
Business → Services | Products | Calendar | Bookings
```

### Services Manager
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  SERVICES                                      [+ Add Service]  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  🎚️ FULL MIX                                    [Edit]  │   │
│  │                                                  [···]  │   │
│  │  Starting at $350                                       │   │
│  │  7-day turnaround • 3 revisions                         │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ ✓ Active  •  12 bookings this month              │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  💿 MASTERING                                   [Edit]  │   │
│  │                                                  [···]  │   │
│  │  Starting at $75                                        │   │
│  │  3-day turnaround • 2 revisions                         │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐  │   │
│  │  │ ✓ Active  •  8 bookings this month               │  │   │
│  │  └──────────────────────────────────────────────────┘  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Calendar/Availability
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  CALENDAR & AVAILABILITY                                        │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  WORKING HOURS                                            │ │
│  │                                                           │ │
│  │  Monday      ┌─ 9:00 AM ─┐  to  ┌─ 6:00 PM ─┐   [✓]      │ │
│  │  Tuesday     ┌─ 9:00 AM ─┐  to  ┌─ 6:00 PM ─┐   [✓]      │ │
│  │  Wednesday   ┌─ 9:00 AM ─┐  to  ┌─ 6:00 PM ─┐   [✓]      │ │
│  │  Thursday    ┌─ 9:00 AM ─┐  to  ┌─ 6:00 PM ─┐   [✓]      │ │
│  │  Friday      ┌─ 9:00 AM ─┐  to  ┌─ 6:00 PM ─┐   [✓]      │ │
│  │  Saturday    [Off]                                        │ │
│  │  Sunday      [Off]                                        │ │
│  │                                                           │ │
│  │  Timezone: ┌─ Pacific Time (PT) ───────────────────┐     │ │
│  │            └───────────────────────────────────────┘     │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  CALENDAR VIEW                          ◀ Dec 2025 ▶     │ │
│  │                                                           │ │
│  │  Sun   Mon   Tue   Wed   Thu   Fri   Sat                 │ │
│  │  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐             │ │
│  │  │     │  1  │  2  │  3  │  4  │  5  │  6  │             │ │
│  │  │     │     │     │ [●] │     │     │     │             │ │
│  │  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤             │ │
│  │  │  7  │  8  │  9  │ 10  │ 11  │ 12  │ 13  │             │ │
│  │  │     │     │ [●] │     │ [●] │     │     │             │ │
│  │  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤             │ │
│  │  │ ... │     │     │     │     │     │     │             │ │
│  │  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘             │ │
│  │                                                           │ │
│  │  [●] = Booked                                            │ │
│  │  [Block dates] [Sync with Google Calendar]               │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 4.5 Inbox (`/dashboard/inbox`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  INBOX                                    [Filter ▼] [Search 🔍]│
│                                                                 │
│  ┌──────────────────────┐ ┌─────────────────────────────────┐  │
│  │                      │ │                                 │  │
│  │  INQUIRY LIST        │ │  CONVERSATION VIEW              │  │
│  │                      │ │                                 │  │
│  │  ┌────────────────┐  │ │  Sarah Johnson                  │  │
│  │  │ [●] Sarah J.   │  │ │  sarah@email.com                │  │
│  │  │ Looking for... │  │ │  Full Mix • $350                │  │
│  │  │ 2 hours ago    │  │ │  ─────────────────────────────  │  │
│  │  └────────────────┘  │ │                                 │  │
│  │                      │ │  CLIENT MESSAGE                 │  │
│  │  ┌────────────────┐  │ │  ┌─────────────────────────┐   │  │
│  │  │ [○] Mike T.    │  │ │  │ Hi! I'm looking for     │   │  │
│  │  │ Need master... │  │ │  │ someone to mix my R&B   │   │  │
│  │  │ Yesterday      │  │ │  │ track. I have full      │   │  │
│  │  └────────────────┘  │ │  │ stems ready...          │   │  │
│  │                      │ │  └─────────────────────────┘   │  │
│  │  ┌────────────────┐  │ │  2 hours ago                    │  │
│  │  │ [○] Studio XYZ │  │ │                                 │  │
│  │  │ Bulk project...│  │ │  YOUR REPLY                     │  │
│  │  │ 2 days ago     │  │ │  ┌─────────────────────────┐   │  │
│  │  └────────────────┘  │ │  │ Thanks for reaching     │   │  │
│  │                      │ │  │ out! I'd love to help   │   │  │
│  │  [Archived (12)]     │ │  │ with your R&B track...  │   │  │
│  │                      │ │  └─────────────────────────┘   │  │
│  │                      │ │  1 hour ago                     │  │
│  │                      │ │                                 │  │
│  │                      │ │  ─────────────────────────────  │  │
│  │                      │ │                                 │  │
│  │                      │ │  REPLY                          │  │
│  │                      │ │  ┌─────────────────────────┐   │  │
│  │                      │ │  │ Type your reply...      │   │  │
│  │                      │ │  │                         │   │  │
│  │                      │ │  └─────────────────────────┘   │  │
│  │                      │ │  [✨ Draft with AI] [Send]      │  │
│  │                      │ │                                 │  │
│  │                      │ │  ─────────────────────────────  │  │
│  │                      │ │                                 │  │
│  │                      │ │  ACTIONS                        │  │
│  │                      │ │  [Convert to Booking]           │  │
│  │                      │ │  [Archive]                      │  │
│  │                      │ │                                 │  │
│  └──────────────────────┘ └─────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 4.6 AI Assistant (`/dashboard/ai`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  AI ASSISTANT                                                   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  QUICK ACTIONS                                            │ │
│  │                                                           │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │ │
│  │  │ ✨          │ │ 💬          │ │ 📝          │         │ │
│  │  │ Generate    │ │ Draft       │ │ Optimize    │         │ │
│  │  │ Bio         │ │ Response    │ │ Profile     │         │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘         │ │
│  │                                                           │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐         │ │
│  │  │ 📋          │ │ 🎯          │ │ ⚙️          │         │ │
│  │  │ Service     │ │ Tagline     │ │ Chatbot     │         │ │
│  │  │ Description │ │ Ideas       │ │ Settings    │         │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘         │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  AI CHAT                                                  │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │                                                     │ │ │
│  │  │  [AI] Hi James! I'm your AI assistant. I can       │ │ │
│  │  │  help you write copy, draft responses, and         │ │ │
│  │  │  optimize your profile. What would you like        │ │ │
│  │  │  help with today?                                  │ │ │
│  │  │                                                     │ │ │
│  │  │  ─────────────────────────────────────────────     │ │ │
│  │  │                                                     │ │ │
│  │  │  [You] Can you help me write a better bio?         │ │ │
│  │  │                                                     │ │ │
│  │  │  ─────────────────────────────────────────────     │ │ │
│  │  │                                                     │ │ │
│  │  │  [AI] Of course! Based on your profile, here's    │ │ │
│  │  │  a professional bio that highlights your           │ │ │
│  │  │  strengths:                                        │ │ │
│  │  │                                                     │ │ │
│  │  │  "James Wilson is a Grammy-nominated mixing        │ │ │
│  │  │  engineer with over 10 years of experience..."     │ │ │
│  │  │                                                     │ │ │
│  │  │  [Insert to Profile] [Copy] [Regenerate]           │ │ │
│  │  │                                                     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ Ask AI anything...                           [Send] │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 4.7 Settings (`/dashboard/settings`)

### Sub-navigation
```
Settings → Account | Billing | Integrations | AI Preferences | Domain
```

### Account Settings
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ACCOUNT SETTINGS                                               │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  EMAIL                                                    │ │
│  │  james@email.com                            [Change]      │ │
│  │                                                           │ │
│  │  PASSWORD                                                 │ │
│  │  ••••••••••                                 [Change]      │ │
│  │                                                           │ │
│  │  TWO-FACTOR AUTHENTICATION                                │ │
│  │  Not enabled                                [Enable]      │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  NOTIFICATIONS                                            │ │
│  │                                                           │ │
│  │  Email me when:                                           │ │
│  │  ☑ I receive a new inquiry                                │ │
│  │  ☑ Someone books a session                                │ │
│  │  ☑ Someone purchases a product                            │ │
│  │  ☐ Weekly performance summary                             │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  DANGER ZONE                                              │ │
│  │                                                           │ │
│  │  [Export My Data]                                         │ │
│  │  [Delete Account]                                         │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Billing Settings
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  BILLING & SUBSCRIPTION                                         │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  CURRENT PLAN                                             │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  PRO PLAN + AI ASSISTANT                            │ │ │
│  │  │  $31/month                                          │ │ │
│  │  │                                                     │ │ │
│  │  │  Next billing date: January 24, 2026                │ │ │
│  │  │                                                     │ │ │
│  │  │  [Change Plan] [Cancel Subscription]                │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  PAYMENT METHOD                                           │ │
│  │                                                           │ │
│  │  💳 Visa ending in 4242                     [Update]      │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  BILLING HISTORY                                          │ │
│  │                                                           │ │
│  │  Dec 24, 2025    Pro + AI Add-on    $31.00    [Invoice]  │ │
│  │  Nov 24, 2025    Pro + AI Add-on    $31.00    [Invoice]  │ │
│  │  Oct 24, 2025    Pro + AI Add-on    $31.00    [Invoice]  │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  STRIPE CONNECT (Payouts)                                 │ │
│  │                                                           │ │
│  │  ✓ Connected                                              │ │
│  │  Payouts go to: Bank account ending in 6789              │ │
│  │                                                           │ │
│  │  [Manage Stripe Account]                                  │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# 5. COMPONENT LIBRARY

## 5.1 Buttons

```
PRIMARY BUTTON
┌────────────────────────────────┐
│  Get Started                   │  bg-accent, text-white
│  [Full width or auto]          │  rounded-full, py-3, px-6
└────────────────────────────────┘  hover: brightness + lift
                                    shadow-glow on hover

SECONDARY BUTTON
┌────────────────────────────────┐
│  Learn More                    │  bg-transparent, border-dark
│  [border visible]              │  text-gray, hover:text-white
└────────────────────────────────┘  hover: border-accent

GHOST BUTTON
┌────────────────────────────────┐
│  Cancel                        │  bg-transparent, no border
│  [minimal]                     │  text-gray, hover:bg-hover
└────────────────────────────────┘

ICON BUTTON
┌──────┐
│  ⚙️  │  p-2, rounded-lg
│      │  hover:bg-hover
└──────┘

BUTTON SIZES
Small:  py-2, px-4, text-sm
Medium: py-3, px-6, text-base (default)
Large:  py-4, px-8, text-lg
```

## 5.2 Inputs

```
TEXT INPUT
┌─────────────────────────────────────────┐
│  Email address                          │  label: text-gray, text-sm
├─────────────────────────────────────────┤
│  placeholder@email.com                  │  bg-elevated, border-dark
│                                         │  rounded-md, py-3, px-4
└─────────────────────────────────────────┘  focus: border-accent

TEXT INPUT WITH ICON
┌─────────────────────────────────────────┐
│  🔍  Search inquiries...                │  icon left, text-muted
└─────────────────────────────────────────┘

PASSWORD INPUT
┌─────────────────────────────────────────┐
│  ••••••••••                          👁  │  toggle visibility
└─────────────────────────────────────────┘

TEXTAREA
┌─────────────────────────────────────────┐
│                                         │
│  Your message here...                   │  min-height: 120px
│                                         │  resize: vertical
└─────────────────────────────────────────┘

SELECT
┌─────────────────────────────────────────┐
│  Select a genre                      ▼  │  custom chevron
└─────────────────────────────────────────┘  dropdown: bg-card

INPUT STATES
- Default: border-dark
- Focus: border-accent, ring-1 ring-accent/20
- Error: border-red-500, ring-1 ring-red-500/20
- Disabled: opacity-50, cursor-not-allowed
```

## 5.3 Cards

```
DEFAULT CARD
┌─────────────────────────────────────────┐
│                                         │  bg-card
│  Card content here                      │  border-dark
│                                         │  rounded-xl
│                                         │  p-6
└─────────────────────────────────────────┘

ELEVATED CARD
┌─────────────────────────────────────────┐
│                                         │  bg-elevated
│  Elevated content                       │  shadow-md
│                                         │  rounded-xl
└─────────────────────────────────────────┘

INTERACTIVE CARD
┌─────────────────────────────────────────┐
│                                         │  hover: border-accent
│  Click me                          →    │  hover: shadow-glow
│                                         │  cursor-pointer
└─────────────────────────────────────────┘  transition-all

STAT CARD
┌─────────────────────────────────────────┐
│  VIEWS                                  │  label: caption, text-muted
│                                         │
│  247                                    │  value: h2, text-white
│  +12% from last week            ↑       │  change: text-sm, text-green
└─────────────────────────────────────────┘
```

## 5.4 Navigation

```
SIDEBAR NAV ITEM (Desktop)
┌─────────────────────────────────────────┐
│  🏠  Home                               │  Default: text-gray
└─────────────────────────────────────────┘  hover: bg-hover, text-white

┌─────────────────────────────────────────┐
│  🏠  Home                               │  Active: bg-accent/10
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  text-accent
└─────────────────────────────────────────┘  left border: accent

BOTTOM NAV ITEM (Mobile)
  ┌────┐
  │ 🏠 │    Default: text-muted
  │Home│    
  └────┘    

  ┌────┐
  │ 🏠 │    Active: text-accent
  │Home│    dot indicator below
  │ ●  │
  └────┘
```

## 5.5 Badges & Tags

```
DEFAULT BADGE
┌──────────┐
│ Hip-Hop  │  bg-accent/10, text-accent
└──────────┘  rounded-full, px-3, py-1, text-xs

STATUS BADGE
┌──────────┐
│ ● Active │  Green dot + text
└──────────┘

┌──────────┐
│ ○ Draft  │  Gray dot + text
└──────────┘

PLAN BADGE
┌──────────┐
│ PRO      │  bg-accent, text-white
└──────────┘  uppercase, tracking-wide
```

## 5.6 Modals

```
MODAL CONTAINER
┌─────────────────────────────────────────────────────────────────┐
│ [Backdrop: bg-black/60, backdrop-blur]                          │
│                                                                 │
│         ┌───────────────────────────────────────────┐          │
│         │                                           │          │
│         │  Modal Title                         [×]  │  Header  │
│         │                                           │          │
│         │  ─────────────────────────────────────── │          │
│         │                                           │          │
│         │  Modal content goes here.                 │  Body    │
│         │  Can be any height.                       │          │
│         │                                           │          │
│         │  ─────────────────────────────────────── │          │
│         │                                           │          │
│         │             [Cancel]    [Confirm]         │  Footer  │
│         │                                           │          │
│         └───────────────────────────────────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Modal: bg-card, rounded-xl, max-w-lg, mx-4
Animation: fade in + scale up
Close: click backdrop or × button
```

## 5.7 Toasts/Notifications

```
SUCCESS TOAST
┌─────────────────────────────────────────┐
│  ✓  Profile saved successfully          │  bg-green-900/50
│                                    [×]  │  border-green-500
└─────────────────────────────────────────┘  Position: top-right

ERROR TOAST
┌─────────────────────────────────────────┐
│  ✕  Failed to upload image              │  bg-red-900/50
│                                    [×]  │  border-red-500
└─────────────────────────────────────────┘

INFO TOAST
┌─────────────────────────────────────────┐
│  ℹ  You have a new inquiry              │  bg-accent/10
│                                    [×]  │  border-accent
└─────────────────────────────────────────┘

Auto-dismiss after 5 seconds
Stack vertically if multiple
```

---

# 6. INTERACTION PATTERNS

## 6.1 Loading States

```
BUTTON LOADING
┌────────────────────────────────┐
│  ◌ Saving...                   │  Spinner + text
│  [disabled]                    │  opacity-70, cursor-wait
└────────────────────────────────┘

SKELETON LOADING
┌─────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░                   │  Shimmer animation
│  ░░░░░░░░░░                             │  bg-hover
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░            │  rounded
└─────────────────────────────────────────┘

PAGE LOADING
         ┌────────┐
         │  ◌     │  Centered spinner
         │Loading │  text-accent
         └────────┘
```

## 6.2 Empty States

```
NO PORTFOLIO ITEMS
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        ┌───────────┐                            │
│                        │    🎵     │                            │
│                        └───────────┘                            │
│                                                                 │
│                   No portfolio items yet                        │
│                                                                 │
│           Add your first project to showcase your work.         │
│                                                                 │
│                    [+ Add Portfolio Item]                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

NO INQUIRIES
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        ┌───────────┐                            │
│                        │    📥     │                            │
│                        └───────────┘                            │
│                                                                 │
│                     No inquiries yet                            │
│                                                                 │
│          Share your profile to start receiving inquiries.       │
│                                                                 │
│                      [Copy Profile Link]                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 6.3 Error States

```
FORM ERROR
┌─────────────────────────────────────────┐
│  Email                                  │
├─────────────────────────────────────────┤
│  invalid-email                          │  border-red-500
│                                         │
├─────────────────────────────────────────┤
│  Please enter a valid email address     │  text-red-400, text-sm
└─────────────────────────────────────────┘

PAGE ERROR
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        ┌───────────┐                            │
│                        │    ⚠️     │                            │
│                        └───────────┘                            │
│                                                                 │
│                   Something went wrong                          │
│                                                                 │
│             We couldn't load this page. Please try again.       │
│                                                                 │
│                        [Try Again]                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 6.4 Confirmation Patterns

```
DESTRUCTIVE ACTION CONFIRMATION
┌───────────────────────────────────────────┐
│                                           │
│  Delete Portfolio Item?                   │
│                                           │
│  This action cannot be undone. The        │
│  project "Summer Vibes" will be           │
│  permanently deleted.                     │
│                                           │
│           [Cancel]    [Delete]            │
│                        ↑                  │
│                   bg-red-600              │
│                                           │
└───────────────────────────────────────────┘
```

---

# 7. RESPONSIVE BEHAVIOR

## 7.1 Breakpoints

```
sm:  640px   (Mobile landscape)
md:  768px   (Tablet)
lg:  1024px  (Desktop)
xl:  1280px  (Large desktop)
2xl: 1536px  (Extra large)
```

## 7.2 Layout Changes

### Navigation
- **Desktop (lg+):** Fixed sidebar, 240px width
- **Tablet (md-lg):** Collapsible sidebar, icon-only mode
- **Mobile (<md):** No sidebar, bottom tab navigation

### Content Grid
- **Desktop:** 2-3 columns
- **Tablet:** 2 columns
- **Mobile:** 1 column, stacked

### Typography
- **Display:** 72px → 48px (mobile)
- **H1:** 48px → 32px (mobile)
- **H2:** 36px → 24px (mobile)
- **Body:** 16px (unchanged)

### Spacing
- **Container padding:** 48px → 24px → 16px
- **Section gaps:** 96px → 64px → 48px

---

# 8. ANIMATION GUIDELINES

## 8.1 Timing Functions

```css
--ease-out: cubic-bezier(0.4, 0, 0.2, 1)     /* Standard */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)  /* Playful */
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1) /* Smooth deceleration */
```

## 8.2 Duration Standards

```
Micro-interactions:  100-150ms  (hover, focus)
UI feedback:         200-300ms  (buttons, toggles)
Page transitions:    300-500ms  (route changes)
Complex animations:  500-800ms  (modals, reveals)
```

## 8.3 Common Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Fade Up */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scale In */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Slide In Right */
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
```

## 8.4 Scroll Animations

- Elements fade in when entering viewport
- Stagger children with 50-100ms delays
- Use Intersection Observer
- Respect `prefers-reduced-motion`

---

# 9. PAGE CONNECTIONS & NAVIGATION

## 9.1 User Flow Diagrams

### Signup → First Profile
```
/signup
    │
    ▼
[Create Account]
    │
    ▼
/signup/step-2 (Profile Basics)
    │
    ▼
/signup/step-3 (Finish)
    │
    ▼
/dashboard (with onboarding modal)
    │
    ▼
[Complete Profile Wizard]
    │
    ├──▶ Add avatar
    ├──▶ Write bio (AI assist)
    ├──▶ Add first portfolio item
    └──▶ Create first service
    │
    ▼
[Profile Complete - Ready to Share!]
```

### Inquiry to Booking
```
/[username] (Public Profile)
    │
    ▼
[Client clicks "Get in Touch"]
    │
    ▼
[Contact Modal/Form]
    │
    ▼
[Submit Inquiry]
    │
    ▼
/dashboard/inbox (Engineer sees inquiry)
    │
    ▼
[Engineer replies / AI drafts]
    │
    ▼
[Convert to Booking]
    │
    ▼
/[username]/book?service=xxx (Client books)
    │
    ▼
[Payment via Stripe]
    │
    ▼
[Booking Confirmed]
```

### Dashboard Navigation Map
```
/dashboard
    │
    ├── /dashboard/profile
    │       ├── /dashboard/profile/basic
    │       ├── /dashboard/profile/portfolio
    │       ├── /dashboard/profile/credits
    │       ├── /dashboard/profile/testimonials
    │       └── /dashboard/profile/faq
    │
    ├── /dashboard/business
    │       ├── /dashboard/business/services
    │       ├── /dashboard/business/products
    │       ├── /dashboard/business/calendar
    │       └── /dashboard/business/bookings
    │
    ├── /dashboard/inbox
    │       └── /dashboard/inbox/[id]
    │
    ├── /dashboard/analytics
    │
    ├── /dashboard/ai
    │
    └── /dashboard/settings
            ├── /dashboard/settings/account
            ├── /dashboard/settings/billing
            ├── /dashboard/settings/integrations
            ├── /dashboard/settings/ai
            └── /dashboard/settings/domain
```

## 9.2 Link Behaviors

| Link Type | Behavior |
|-----------|----------|
| Internal navigation | Soft navigation (no page reload) |
| External links | New tab (`target="_blank"`) |
| Anchor links | Smooth scroll |
| Form submissions | Prevent default, async submit |
| Download links | Direct download |

## 9.3 Protected Routes

| Route Pattern | Auth Required | Plan Required |
|---------------|---------------|---------------|
| `/dashboard/*` | Yes | Any |
| `/dashboard/ai` | Yes | AI Add-on |
| `/dashboard/analytics` | Yes | Pro+ |
| `/dashboard/business/products` | Yes | Pro+ |
| `/dashboard/settings/domain` | Yes | Pro+ |

Unauthenticated users → Redirect to `/login`
Unauthorized plan → Show upgrade prompt modal

---

# APPENDIX A: FILE NAMING CONVENTIONS

```
Pages:          page.tsx
Layouts:        layout.tsx
Components:     PascalCase.tsx (e.g., BeforeAfterPlayer.tsx)
Utilities:      camelCase.ts (e.g., formatDate.ts)
Hooks:          use[Name].ts (e.g., useProfile.ts)
Types:          types.ts or [name].types.ts
Styles:         [component].module.css (if needed)
```

---

# APPENDIX B: Z-INDEX SCALE

```
z-0:    Background elements
z-10:   Default content
z-20:   Sticky elements (nav)
z-30:   Dropdowns, tooltips
z-40:   Modals, overlays
z-50:   Toasts, notifications
z-[100]: AI chatbot widget
```

---

# APPENDIX C: ACCESSIBILITY CHECKLIST

- [ ] All interactive elements are keyboard accessible
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Error messages are announced to screen readers
- [ ] Skip links for navigation
- [ ] Reduced motion respected
- [ ] Touch targets are 44×44px minimum

---

**END OF DETAILED DESIGN SPECIFICATION**

---

*This document provides the complete visual and functional specification for all MixExperts pages. Use in conjunction with the Master Platform Blueprint for implementation.*
