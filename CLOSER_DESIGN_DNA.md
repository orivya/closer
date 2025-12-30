# CLOSER — Design DNA
## Token + component DNA extracted from the HTML prototype

---

# Canonical Visual Reference

**Golden reference (do not drift):**
- `closer_world_class_premium_dashboard_refined_2026_clean.html` (Home + Connect)

Home + Connect should remain visually identical to the golden reference; every other route inherits from this DNA.

---

# Brand Identity

## Brand Voice
- **Premium**: Every pixel feels intentional
- **Warm**: Cozy, intimate, not cold tech
- **Playful**: Fun without being childish
- **Trustworthy**: Secure, private, reliable
- **Effortless**: Connection shouldn't feel like work

## Logo
```
"C." — Fraunces, italic, 300 weight
Accent dot beneath in gradient (clay→mist)
```

---

# Color System

## Primary Palette
```css
/* Deep, warm dark theme */
--base: #050505;           /* Deepest background */
--surface-0: #080808;      /* App shell / deepest surface */
--surface-1: #0E0E0E;      /* Primary surface (matches clean prototype `--surface`) */
--surface-2: #141414;      /* Higher contrast surface */
--surface-glass: rgba(20, 20, 20, 0.6);

/* Accent: User 1 (warm) */
--clay: #e09f7d;           /* Primary warm accent */
--clay-dark: #8a5a42;
--clay-glow: rgba(224, 159, 125, 0.2);

/* Accent: User 2 (cool) */
--mist: #c4b5fd;           /* Secondary cool accent */
--mist-dark: #7c6eb0;
--mist-glow: rgba(196, 181, 253, 0.2);

/* Text */
--sand: #f5e6d3;           /* Primary text */
--stone: #9ca3af;          /* Secondary text */
--muted: rgba(245, 230, 211, 0.65); /* Tertiary/metadata text */
```

## Accent Model (per page)
```css
/* Default accent is warm clay; some views may swap to mist */
--accent: var(--clay);
--accent-glow: var(--clay-glow);
```

## Focus Ring (V1)
In the golden reference, the focus ring is intentionally “warm” (clay) even on mist-accented pages.
```css
--ring: 0 0 0 4px rgba(224, 159, 125, 0.22);
```

## Token Naming Policy (Next.js)
- Keep **canonical token names exactly as in** `closer_world_class_premium_dashboard_refined_2026_clean.html` to prevent drift.
- Add **alias tokens** only for backwards-compatibility with older specs and prototypes (see below).

## Legacy Alias Tokens (Backwards Compatibility)
Some spec docs still reference earlier token names. Keep these aliases in the Next.js global CSS layer so older references remain valid:
```css
--surface: var(--surface-1);

--sh-soft: var(--shadow-1);
--sh-lg: var(--shadow-2);
--sh-xl: var(--shadow-3);

--dur-fast: var(--dur-1);
--dur: var(--dur-2);
--dur-slow: var(--dur-3);
```

## Gradient Usage
```css
/* Premium surface gradient */
background: linear-gradient(160deg,
  rgba(255,255,255,0.045),
  rgba(255,255,255,0.015)
);

/* Text gradient (hero numbers) */
background: linear-gradient(to bottom,
  var(--sand),
  rgba(245,230,211,0.55)
);
-webkit-background-clip: text;
```

## Border Treatment
```css
--border-subtle: rgba(245, 230, 211, 0.06);
--border-highlight: rgba(245, 230, 211, 0.12);
--border-strong: rgba(245, 230, 211, 0.18);

/* Gradient border overlay (surface cards) */
background: linear-gradient(135deg,
  rgba(224,159,125,0.18),
  rgba(196,181,253,0.14),
  rgba(245,230,211,0.14)
);
```

---

# Typography

## Font Stack
```css
/* Primary sans-serif */
--font-sans: "Manrope", system-ui, sans-serif;

/* Display serif */
--font-serif: "Fraunces", ui-serif, Georgia, serif;
```

## Type Scale
| Element | Font | Size | Weight | Tracking |
|---------|------|------|--------|----------|
| Hero number | Fraunces | 86-120px | 200 | -0.05em |
| Page title | Fraunces | 38-44px | 300 | -0.02em |
| Card question | Fraunces | 24px | 400 | — |
| Heading | Manrope | 18-20px | 800 | — |
| Body | Manrope | 15px | 400 | — |
| Caption | Manrope | 12-13px | 600 | — |
| Label | Manrope | 10-11px | 800 | 0.16em (uppercase) |

## Font Features
```css
/* Enable OpenType features */
font-feature-settings: "ss01" 1, "ss02" 1;
font-optical-sizing: auto;

/* Tabular numbers for time display */
font-feature-settings: "tnum";
font-variant-numeric: tabular-nums;
```

---

# Spacing & Layout

## Spacing Scale
```css
--s-1: 4px;    --s-6: 24px;
--s-2: 8px;    --s-7: 32px;
--s-3: 12px;   --s-8: 40px;
--s-4: 16px;   --s-9: 48px;
--s-5: 20px;   --s-10: 64px;
```

## Border Radius
```css
--r-sm: 12px;   /* Pills, small elements */
--r-md: 16px;   /* Buttons, inputs */
--r-lg: 24px;   /* Cards */
--r-xl: 32px;   /* Large cards, modals */
--r-2xl: 40px;  /* Featured hero surfaces */
--r-full: 999px; /* Full pill */
```

## Container
```css
.container {
  max-width: 980px;
  margin: 0 auto;
  padding: clamp(28px, 4vw, 56px) clamp(18px, 3vw, 28px);
}
```

---

# Effects & Shadows

## Shadow Scale
```css
--shadow-1: 0 10px 30px rgba(0,0,0,0.35);
--shadow-2: 0 20px 50px rgba(0,0,0,0.55);
--shadow-3: 0 30px 80px rgba(0,0,0,0.70);
```

## Glass Morphism
```css
.glass {
  background: rgba(255,255,255,0.02);
  border: 1px solid var(--border-subtle);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

@supports not ((backdrop-filter: blur(18px)) or (-webkit-backdrop-filter: blur(18px))) {
  .glass { background: rgba(18,18,18,0.92); }
}
```

## Ambient Glow
```css
/* Background blobs */
.blob-clay {
  background: var(--clay-glow);
  filter: blur(140px);
}

.blob-mist {
  background: var(--mist-glow);
  filter: blur(140px);
}
```

## Grain Texture
```css
.grain-overlay {
  background-image: url("data:image/svg+xml,..."); /* Noise filter */
  opacity: 0.022;
  mix-blend-mode: overlay;
}
```

---

# Motion & Animation

## Easing
```css
--easing: cubic-bezier(0.16, 1, 0.3, 1); /* Spring-like */
```

## Duration Scale
```css
--dur-1: 140ms;  /* Micro-interactions */
--dur-2: 220ms;  /* Standard transitions */
--dur-3: 520ms;  /* Premium/hero motion */
```

## Common Animations

### Hover Lift
```css
.card:hover {
  transform: translateY(-4px);
  transition: transform var(--dur-2) var(--easing);
}
```

### Connect: Rising Hearts (Featured Hero)
Used on the Connect featured hero to add “delight” without becoming noisy.
```css
@keyframes heart-rise-fade {
  0% { transform: translateY(24px) scale(0.6); opacity: 0; }
  18% { opacity: 0.40; }
  100% { transform: translateY(-190px) scale(1.12); opacity: 0; }
}
```

### Connect: 3D Card Stack (Featured Hero)
Card stack expands on hover; keep this pattern consistent for other “featured” surfaces.
```css
.featured-hero:hover .stacked-card.bottom { transform: translateZ(-44px) translateX(-18px) rotate(-10deg); }
.featured-hero:hover .stacked-card.middle { transform: translateZ(-22px) translateX(10px) rotate(6deg); }
.featured-hero:hover .stacked-card.top { transform: translateZ(22px) translateY(-10px); }
```

### Pulse Glow
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px var(--glow-color); }
  50% { box-shadow: 0 0 44px var(--glow-color); }
}
/* Duration: 5.2s, infinite */
```

### View Transition
```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Duration: 700ms */
```

### View Switching (Prototype)
The golden reference animates view changes with a subtle “premium” entrance:
```css
@keyframes view-in {
  from { opacity: 0; transform: translateY(14px) scale(0.995); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

---

# Component Patterns

## Button (Secondary + Primary)
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 16px;
  padding: 12px 18px;
  border: 1px solid var(--border-subtle);
  background: rgba(255,255,255,0.02);
  color: var(--sand);
  cursor: pointer;
  transition: transform var(--dur-1) var(--easing), background var(--dur-2) var(--easing), border-color var(--dur-2) var(--easing);
}

.btn:hover { background: rgba(255,255,255,0.04); border-color: var(--border-highlight); transform: translateY(-1px); }
.btn:active { transform: translateY(0) scale(0.99); }

.btn-primary {
  background: linear-gradient(180deg, rgba(245,230,211,1), rgba(245,230,211,0.92));
  color: var(--base);
  border-color: rgba(245,230,211,0.18);
  box-shadow: 0 18px 40px rgba(0,0,0,0.45);
}

.btn-primary:hover { transform: translateY(-1px) scale(1.01); }
```

## Base Card Surface
```css
.card {
  background: linear-gradient(155deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012));
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-1);
}

.card:hover { border-color: var(--border-highlight); }
```

## Focus Ring Utility (apply to interactive elements)
```css
.focus-ring:focus-visible {
  outline: none;
  box-shadow: var(--ring);
  border-color: rgba(224, 159, 125, 0.22);
}
```

## Avatar
```css
.avatar {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid var(--border-highlight);
  display: grid;
  place-items: center;
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 300;
  transition: transform var(--dur-2) var(--easing), border-color var(--dur-2) var(--easing);
  box-shadow: var(--shadow-1);
}

/* User 1: clay accent */
/* User 2: mist accent */
```

---

# Navigation Patterns

## Desktop Sidebar
- Width: 92px
- Background: linear-gradient(180deg, rgba(255,255,255,0.01), transparent)
- Border-right: 1px solid border-subtle
- Nav items: 48×48px, radius 16px
- Active indicator: left dot in accent color

## Mobile Bottom Nav
- Position: Fixed, 18px from bottom + safe area
- Background: rgba(15,15,15,0.86) + blur(20px)
- Border: 1px solid border-highlight
- Border-radius: 26px (pill)
- Item size: 50×50px

---

# Mobile Considerations

## Breakpoints (from prototype)
- `max-width: 767px`: hide desktop sidebar, show mobile nav
- `min-width: 768px`: hide mobile nav, show desktop sidebar
- `max-width: 840px`: Connect featured hero becomes stacked (content over visual)
- `max-width: 520px`: Connect activity grid becomes 1 column

## Safe Areas
```css
padding-bottom: calc(120px + env(safe-area-inset-bottom));
```

## Touch Targets
- Minimum: 44×44px
- Recommended: 48-50px for primary actions

## Bottom Sheet Pattern
- Slides up from bottom
- Backdrop blur with fade
- Swipe down to dismiss
- Handle indicator at top

---

# Accessibility

## Focus States
```css
.focus-ring:focus-visible {
  outline: none;
  box-shadow: var(--ring);
  border-color: rgba(224, 159, 125, 0.22);
}
```

## Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

## Color Contrast
All text meets WCAG AA:
- Sand (#f5e6d3) on Base (#050505): 15.8:1
- Stone (#9ca3af) on Base: 7.2:1
- Clay (#e09f7d) on Base: 6.8:1
- Mist (#c4b5fd) on Base: 8.1:1

---

# Implementation Checklist (Design + Next.js)

When designing or implementing new pages, ensure:

- [ ] Uses base color (#050505) as background
- [ ] Cards use surface gradient with border-subtle
- [ ] Buttons follow btn-primary pattern
- [ ] Typography uses Fraunces for display, Manrope for body
- [ ] Spacing follows the scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)
- [ ] Border radius follows scale (12, 16, 24, 32)
- [ ] Shadows use `--shadow-1/2/3` (or legacy aliases)
- [ ] Animations use `--dur-1/2/3` + `--easing`
- [ ] Mobile nav accounts for safe-area-inset
- [ ] Touch targets are minimum 44×44px
- [ ] Focus states are visible
- [ ] Grain overlay and ambient blobs present
- [ ] Clay (#e09f7d) for User 1 / warm actions
- [ ] Mist (#c4b5fd) for User 2 / cool actions

---

*Quick reference for maintaining design consistency across all Closer pages and components.*
