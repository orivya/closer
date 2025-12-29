# MixExperts Design DNA (Source of Truth)

This document captures the rigorous "Visual DNA" established during the creation of the Premium Profile Page.
Use this artifact to initialize any new design session to ensure 100% visual consistency.

## 1. Core Aesthetics (The "Vibe")
*   **Theme**: "Analog Digital" (Dark mode meets high-fidelity audio equipment).
*   **Metaphor**: The interface should feel like expensive audio hardware (matte black, gold contacts, glowing LEDs).
*   **Key Texture**: A subtle SVG Noise overlay is mandatorily applied to the `body` to prevent the "flat digital" look.

### The "Noise" Implementation
To guarantee the texture works without external assets, use this exact CSS in `globals.css`:
```css
body::before {
  content: "";
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 50;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
}
```

## 2. Color Palette (Strict Hex Codes)
Do not approximate. Use these exact values.

| Variable | Hex Value | Usage |
| :--- | :--- | :--- |
| `bg-base` | `#050505` | Main Background (Deepest Black/Void) |
| `bg-elevated` | `#0F0F11` | Panels, Sidebars |
| `bg-card` | `#141416` | Cards, List Items |
| `bg-hover` | `#1F1F22` | Hover state for interactive items |
| `accent` | `#C9956C` | "**Amber**" - Primary Brand Action (Gold) |
| `accent-light`| `#D4A97E` | Lighter gold for hover/active states |
| `accent-glow` | `rgba(201, 149, 108, 0.4)` | For box-shadow and glows |
| `text-gray` | `#9ca3af` | Secondary Text |
| `border-dark` | `rgba(255, 255, 255, 0.08)` | Subtle Dividers |

## 3. Typography
*   **Font**: `Plus Jakarta Sans` (Google Fonts).
*   **Weights Used**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 800 (ExtraBold).
*   **Tracking**: `tracking-tight` on headings for a modern, compact feel.
*   **Text Balance**: Use `.text-balance` utility on Hero headlines for optical symmetry.

## 4. The "Glass" Recipe
Don't use default Tailwind backdrops. Use this specific recipe for Navigation and Overlays:

```css
.glass-nav {
  background: rgba(5, 5, 5, 0.8); /* Dark tint */
  backdrop-filter: blur(12px);     /* Heavy blur */
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
```

## 5. Animation Primitives (Hardcoded)
To avoid plugin version issues, we use these hardcoded keyframes for entrance animations.
Add these to `globals.css` if missing:

```css
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

@keyframes slide-in-from-bottom-4 {
  from { transform: translateY(1rem); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes zoom-in-95 {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Usage Class */
.animate-in {
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}
.fade-in { animation-name: fade-in; }
.slide-in-from-bottom-4 { animation-name: slide-in-from-bottom-4; }
.zoom-in-95 { animation-name: zoom-in-95; }
```

## 6. Layout & Spacing Standards
*   **Container Width**: `max-w-[1400px]` for standard sections, `max-w-[1200px]` for text-heavy blocks.
*   **Padding**: `px-6` is the standard horizontal padding for mobile compatibility.
*   **Section Spacing**: Generous vertical spacing (e.g., `py-24` or `mb-32`) to allow the design to breathe.

## 7. Component Styling Rules (Radius & Depth)
*   **Buttons**: Always `rounded-full`.
*   **Major Cards**: Use `rounded-3xl` for high-level containers (Services, Pricing Cards).
*   **Inner Elements**: Use `rounded-xl` for inner boxes, inputs, and list items.
*   **Borders**: `border-[var(--border-dark)]` (1px solid rgba(255,255,255,0.08)) is the default "hairline" divider.

## 8. Iconography
*   **Library**: `lucide-react`.
*   **Size**: Default to `w-5 h-5` or `w-6 h-6`.
*   **Style**: Standard stroke width (2px). Icons often appear in `text-gray` and hover to `white`.

## 9. Component Signatures
*   **Buttons**: Primary is White text on Black (or vice versa), often with a subtle hover scale (`hover:scale-105`).
*   **Inputs**: Matte dark backgrounds (`bg-white/5`), `rounded-xl`, borderless or subtle border (`border-white/10`).
*   **Focus States**: When focused, inputs should have a subtle ring matching the `accent` color (e.g. `ring-1 ring-[var(--accent)]`).
*   **Images**: Often desaturated or overlaid with a gradient unless it's the "Hero" shot.

## 10. Interactive Patterns ("The Premium Feel")
*   **Hover States**: 
    *   Text turns White (if gray) or Accent color.
    *   Cards lift slightly or glow.
    *   **NO jarring color shifts**; rely on opacity (60% -> 100%) and scale (1.0 -> 1.05).
*   **View Transitions**: When clicking a "Detail" view (like a specific service), prefer smooth state transitions or SPA-like view swapping over hard navigations.

## 8. Theme Engine
The site supports dynamic theming via `data-theme` attribute on `<html>`.
*   **Themes**: Amber (Default), Teal, Sage, Slate, Rose, Violet.
*   **Implementation**: All components MUST use CSS variables (`var(--accent)`) instead of hardcoded hex values to support this engine.

---
**Instruction for Agents:**
When asked to build a new page (e.g., Login, Dashboard), strict adherence to `bg-base` (#050505) and `Plus Jakarta Sans` is required. Always check `globals.css` for the latest token definitions.
