# Meadow Design System Reference
**Version:** 1.0 | **Last Updated:** 2025-12-20

---

## Table of Contents
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing Scale](#spacing-scale)
4. [Border Radius](#border-radius)
5. [Shadows](#shadows)
6. [Component Patterns](#component-patterns)
7. [Animations](#animations)
8. [Layout System](#layout-system)
9. [Iconography](#iconography)
10. [Component Reference](#component-reference)

---

## 1. Color Palette

### Primary Brand Colors

#### Sage (Primary)
The core brand color - represents calm, growth, and nature.

| Token | Value | Usage |
|-------|-------|-------|
| `sage` | `#7d9b8a` | Primary buttons, active states, brand elements |
| `sage-light` | `#9bb3a7` | Light accents, hover states, secondary elements |
| `sage-dark` | `#5c7a6b` | Dark accents, gradients, emphasis |
| `sage-subtle` | `rgba(125, 155, 138, 0.08)` | Backgrounds, subtle highlights |
| `sage-glow` | `rgba(125, 155, 138, 0.5)` | Glow effects, shadows |
| `sage-muted` | `#94a39d` | Disabled states, muted text |

#### Clay (Secondary/Accent)
Warm accent for specific features like Time Vault.

| Token | Value | Usage |
|-------|-------|-------|
| `clay` | `#c47f6a` | Accent elements, Vault feature |
| `clay-light` | `#e8927c` | Lighter accents |
| `clay-subtle` | `rgba(196, 127, 106, 0.1)` | Subtle backgrounds |

### Neutral Colors (Stone)

| Token | Value | Usage |
|-------|-------|-------|
| `stone-50` | `#faf9f7` | Page background (primary) |
| `stone-100` | `#f5f3f0` | Card backgrounds, subtle fills |
| `stone-200` | `#e8e6e3` | Borders, dividers |
| `stone-300` | `#d6d3d0` | Disabled states, muted elements |
| `stone-800` | `#44403c` | Dark text (rare use) |
| `stone-900` | `#292524` | Darkest elements |

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `text-primary` | `#1c2421` | Headlines, body text, primary buttons |
| `text-secondary` | `#4a5753` | Descriptions, secondary text |
| `text-tertiary` | `#8b9b96` | Hints, placeholders |
| `text-muted` | `#94a39d` | Timestamps, metadata |

### CSS Variables Reference
```css
/* Primary Palette */
--sage: #7d9b8a;
--sage-light: #9bb3a7;
--sage-dark: #5c7a6b;
--clay: #c47f6a;

/* Background */
--bg-primary: #faf9f7;
--bg-white: #ffffff;

/* Text */
--text-primary: #1c2421;
--text-secondary: #4a5753;
--text-muted: #94a39d;
```

---

## 2. Typography

### Font Families

```css
font-sans: 'Inter', sans-serif;  /* Body text, UI elements */
font-serif: 'Fraunces', serif;   /* Headlines, display text, journal content */
```

### Font Loading
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### Type Scale

#### Headlines (Fraunces)
| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| H1 | `text-6xl` / `text-8xl` | 400 | 0.95-1.1 | Hero headlines |
| H2 | `text-4xl` / `text-5xl` | 400 | 1.1 | Section headers |
| H3 | `text-2xl` / `text-3xl` | 500 | 1.1 | Card titles |
| H4 | `text-lg` / `text-xl` | 500 | 1.2 | Subsection titles |

#### Body Text (Inter)
| Style | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| Body Large | `text-xl` | 300 (light) | 1.8 | Journal entries |
| Body | `text-base` | 400 | 1.5-1.6 | General content |
| Body Small | `text-sm` | 400 | 1.5 | Descriptions |
| Caption | `text-xs` | 500-700 | 1.4 | Labels, metadata |

#### Special Styles
| Style | Properties | Usage |
|-------|------------|-------|
| Label | `text-[10px] font-bold uppercase tracking-widest` | Section labels, badges |
| Italic Quote | `font-serif italic` | Insights, reflections |

---

## 3. Spacing Scale

Tailwind spacing scale in use:

| Token | Value | Usage |
|-------|-------|-------|
| `0.5` | 2px | Micro spacing |
| `1` | 4px | Inline spacing |
| `1.5` | 6px | Small gaps |
| `2` | 8px | Element padding |
| `3` | 12px | Card padding |
| `4` | 16px | Section spacing |
| `5` | 20px | Card padding |
| `6` | 24px | Container padding |
| `8` | 32px | Section margins |
| `10` | 40px | Large section gaps |
| `12` | 48px | Major sections |

### Common Padding Patterns
| Component | Padding |
|-----------|---------|
| Button (standard) | `px-6 py-2.5` to `px-8 py-3` |
| Card (small) | `p-4` to `p-5` |
| Card (medium) | `p-6` to `p-8` |
| Card (large) | `p-8` to `p-12` |
| Section | `py-24` to `py-32` |
| Page container | `px-6 md:px-12` |

---

## 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-full` | 9999px | Buttons, pills, avatars |
| `rounded-3xl` | 24px | Large cards |
| `rounded-[32px]` | 32px | Hero cards |
| `rounded-[40px]` | 40px | Feature cards |
| `rounded-[48px]` | 48px | Premium cards |
| `rounded-2xl` | 16px | Medium cards, inputs |
| `rounded-xl` | 12px | Small cards, icons |
| `rounded-lg` | 8px | Tags, badges |

---

## 5. Shadows

### Elevation System
```css
/* Subtle */
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)

/* Card (default) */
shadow-card:
  0 4px 6px -1px rgba(0, 0, 0, 0.02),
  0 10px 15px -3px rgba(0, 0, 0, 0.04),
  0 0 0 1px rgba(255, 255, 255, 0.8) inset

/* Card Hover */
shadow-card-hover:
  0 20px 25px -5px rgba(0, 0, 0, 0.05),
  0 8px 10px -6px rgba(0, 0, 0, 0.01),
  0 0 0 1px rgba(125, 155, 138, 0.2) inset

/* Extra Large */
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

/* Colored Shadows */
shadow-sage: shadow-lg shadow-sage/20
shadow-clay: shadow-lg shadow-clay/20
```

---

## 6. Component Patterns

### Buttons

#### Primary Button
```jsx
className="px-8 py-3 bg-text-primary text-white rounded-full font-medium shadow-lg hover:bg-black hover:-translate-y-0.5 transition-all"
```

#### Secondary Button
```jsx
className="px-6 py-2.5 rounded-full border border-stone-200 bg-white text-text-secondary hover:border-sage hover:text-sage hover:bg-sage/5 transition-all"
```

#### Icon Button
```jsx
className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-stone-200/50 flex items-center justify-center text-text-secondary hover:bg-white transition-all shadow-sm"
```

#### CTA Button (Gradient)
```jsx
className="bg-gradient-to-r from-sage to-sage-dark text-white rounded-xl shadow-lg shadow-sage/25 hover:-translate-y-0.5"
```

### Cards

#### Standard Card
```jsx
className="bg-white p-6 rounded-[24px] border border-stone-200/60 shadow-sm hover:shadow-card-hover transition-all"
```

#### Glass Card
```jsx
className="bg-white/60 backdrop-blur-sm rounded-[24px] border border-stone-200/50 shadow-sm"
// or
className="glass-card rounded-[40px] p-8"
```

#### Feature Card
```jsx
className="bg-[#faf9f7] p-10 rounded-[40px] premium-card-shadow premium-card-hover transition-all"
```

### Form Inputs

#### Text Input
```jsx
className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-sage/20 focus:border-sage outline-none"
```

#### Search Input
```jsx
className="pl-10 pr-4 py-2 w-64 bg-white/50 border border-stone-200/50 hover:bg-white/80 rounded-full text-sm focus:ring-2 focus:ring-sage/20"
```

### Pills/Tags

#### Active Pill
```jsx
className="h-10 px-4 rounded-full bg-sage text-white border-sage shadow-md shadow-sage/20 text-xs font-bold uppercase tracking-wide"
```

#### Inactive Pill
```jsx
className="h-10 px-4 rounded-full bg-white text-text-secondary border border-stone-200 hover:border-stone-300"
```

### Badges

#### Label Badge
```jsx
className="text-[10px] font-bold uppercase tracking-widest bg-sage/10 text-sage px-2 py-1 rounded-full"
```

---

## 7. Animations

### Keyframe Definitions

```css
/* Fade Up (Primary Entry) */
@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Fade In */
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* Scale In */
@keyframes scaleIn {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* Float (Ambient) */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Pulse Slow (Background) */
@keyframes pulseSlow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}
```

### Animation Classes

| Class | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `animate-fade-up` | 1s | cubic-bezier(0.16, 1, 0.3, 1) | Entry animations |
| `animate-fade-in` | 1.2s | ease-out | General fades |
| `animate-scale-in` | 0.8s | cubic-bezier(0.16, 1, 0.3, 1) | Modal/popup entry |
| `animate-float` | 10s | ease-in-out | Floating elements |
| `animate-pulse-slow` | 8s | ease-in-out | Background orbs |

### Stagger Pattern
```jsx
style={{ animationDelay: `${index * 100}ms` }}
```

### Transition Defaults
```css
transition-all duration-300    /* Standard */
transition-all duration-500    /* Smooth */
transition-all duration-700    /* Slow, premium feel */
```

---

## 8. Layout System

### Breakpoints
| Token | Width | Description |
|-------|-------|-------------|
| `sm` | 640px | Small devices |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |

### Container Patterns

#### Page Container
```jsx
className="max-w-5xl mx-auto"
```

#### Content Container
```jsx
className="max-w-2xl mx-auto"  // For focused content like editor
className="max-w-3xl mx-auto"  // For lists
className="max-w-4xl mx-auto"  // For grids
```

### Grid Patterns
```jsx
// 2-column responsive
className="grid grid-cols-1 md:grid-cols-2 gap-6"

// 3-column responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// 4-column responsive (prompts)
className="grid grid-cols-2 md:grid-cols-4 gap-4"
```

### Sidebar Layout
- Desktop: 280px fixed sidebar
- Mobile: Bottom navigation (88px height)

---

## 9. Iconography

### Icon Library
**Lucide React** - `lucide-react@^0.294.0`

### Icon Sizing
| Context | Size | Stroke Width |
|---------|------|--------------|
| Inline text | 14-16px | 1.5-2 |
| Button icon | 16-18px | 2 |
| Card icon | 20-24px | 1.5 |
| Feature icon | 28-32px | 1.5 |
| Hero icon | 40-48px | 1 |

### Common Icons Used
- `Leaf` - Brand logo
- `PenTool` / `Feather` - Writing/Editor
- `GitBranch` - Threads
- `Sparkles` - Insights/AI
- `Mic` - Voice
- `Image` - Images
- `Calendar` - Calendar view
- `Target` - Intentions
- `Archive` / `Lock` - Vault
- `Scale` - Decisions

---

## 10. Component Reference

### Full Component List

#### Layout Components
- `Layout.tsx` - Main app shell with sidebar and mobile nav
- `Sidebar.tsx` - Desktop navigation

#### View Components
- `LandingPage.tsx` - Marketing/landing page
- `Onboarding.tsx` - New user flow (4 steps)
- `Home.tsx` - Dashboard/home
- `Journal.tsx` - Journal with Stream/Calendar/List views
- `Editor.tsx` - Multi-mode entry editor
- `Explore.tsx` - Library + Toolbox tabs
- `Insights.tsx` - Analytics and patterns
- `Settings.tsx` - Profile and settings

#### Space Components
- `Mirror.tsx` - AI reflections
- `TimeVault.tsx` - Time capsule letters
- `Intentions.tsx` - Goal/intention tracking
- `DecisionLab.tsx` - Decision framework
- `VoiceMemos.tsx` - Voice recordings
- `LifeDashboard.tsx` - Life overview

#### Supporting Views
- `ThreadDetail.tsx` - Thread detail view
- `JourneyDetail.tsx` - Journey detail view
- `Session.tsx` - Journey session view
- `PromptList.tsx` - Prompt category list

### Component States
All interactive components should handle:
- Default state
- Hover state (`hover:`)
- Active/Pressed state (`active:`)
- Disabled state (`disabled:opacity-50`)
- Loading state (where applicable)
- Focus state (`focus:ring-2 focus:ring-sage/20`)

---

## Design Principles

### 1. Calm & Premium
- Muted, earthy color palette
- Generous whitespace
- Subtle animations
- Glass morphism effects

### 2. Organic & Natural
- Rounded corners (24-48px)
- Gradient backgrounds
- Flowing layouts
- Nature-inspired metaphors

### 3. Focused & Minimal
- Single task per screen
- Progressive disclosure
- Clear visual hierarchy
- Serif for content, sans for UI

### 4. Responsive & Adaptive
- Mobile-first approach
- Touch-friendly targets
- Adaptive navigation
- Fluid typography

---

## Usage Guidelines

### DO:
- Use the sage color palette for all interactive elements
- Maintain consistent border-radius within component types
- Apply hover animations for all clickable elements
- Use serif font for content/display, sans for UI
- Include subtle backdrop-blur for overlays

### DON'T:
- Introduce new colors outside the palette
- Use sharp corners (less than rounded-lg)
- Skip hover/focus states
- Mix font families inconsistently
- Use heavy/stark shadows
