# MEADOW REDESIGN IMPLEMENTATION PLAN
## Complete Integration of ORIVYA Design System + Meadow Features

**Version:** 1.0.0
**Created:** December 2024
**Status:** Ready for Implementation

---

## TABLE OF CONTENTS

1. [Pre-Implementation Setup](#1-pre-implementation-setup)
2. [Phase Overview](#2-phase-overview)
3. [Phase 1: Foundation - Theme System](#3-phase-1-foundation---theme-system)
4. [Phase 2: Typography System](#4-phase-2-typography-system)
5. [Phase 3: Core Components](#5-phase-3-core-components)
6. [Phase 4: Layout & Navigation](#6-phase-4-layout--navigation)
7. [Phase 5: Home Page Redesign](#7-phase-5-home-page-redesign)
8. [Phase 6: Journal & Note Cards](#8-phase-6-journal--note-cards)
9. [Phase 7: Editor Refinements](#9-phase-7-editor-refinements)
10. [Phase 8: Settings & Preferences](#10-phase-8-settings--preferences)
11. [Phase 9: Thread & Detail Views](#11-phase-9-thread--detail-views)
12. [Phase 10: Micro-interactions & Polish](#12-phase-10-micro-interactions--polish)
13. [Testing Checklist](#13-testing-checklist)
14. [Rollback Instructions](#14-rollback-instructions)

---

## 1. PRE-IMPLEMENTATION SETUP

### 1.1 Git Backup Instructions

**CRITICAL: Complete these steps BEFORE making any changes**

```bash
# Step 1: Ensure all current changes are committed
cd /Users/bchill/Documents/Claude\ Code\ Projects/meadow-official-2025
git status
git add .
git commit -m "Pre-redesign backup: Save current state before ORIVYA integration"

# Step 2: Create a backup branch
git checkout -b backup-pre-redesign-$(date +%Y%m%d)

# Step 3: Return to main branch for work
git checkout main

# Step 4: Create a feature branch for redesign
git checkout -b feature/orivya-redesign

# Step 5: Verify branches
git branch -a
```

**Expected output:**
```
* feature/orivya-redesign
  backup-pre-redesign-20241223
  main
```

### 1.2 Folder Backup (Optional - Belt and Suspenders)

```bash
# Create a complete folder backup
cp -r /Users/bchill/Documents/Claude\ Code\ Projects/meadow-official-2025 \
      /Users/bchill/Documents/Claude\ Code\ Projects/meadow-official-2025-backup-$(date +%Y%m%d)
```

### 1.3 Pre-Flight Checklist

- [ ] All current changes committed
- [ ] Backup branch created: `backup-pre-redesign-YYYYMMDD`
- [ ] Feature branch created: `feature/orivya-redesign`
- [ ] Development server runs successfully (`npm run dev`)
- [ ] All current tests pass (if applicable)
- [ ] Folder backup created (optional)

---

## 2. PHASE OVERVIEW

| Phase | Description | Files Modified | Est. Complexity |
|-------|-------------|----------------|-----------------|
| 1 | Theme System (Colors, CSS Variables) | 2 | Medium |
| 2 | Typography System | 2 | Low |
| 3 | Core Components (Cards, Buttons) | 5 | Medium |
| 4 | Layout & Navigation | 3 | High |
| 5 | Home Page Redesign | 1 | Medium |
| 6 | Journal & Note Cards | 1 | Medium |
| 7 | Editor Refinements | 1 | Medium |
| 8 | Settings & Preferences | 4 | Medium |
| 9 | Thread & Detail Views | 2 | Low |
| 10 | Micro-interactions & Polish | 3 | Medium |

**Total Files to Modify:** ~24 files
**Dependency Order:** Phases must be completed sequentially (1→10)

---

## 3. PHASE 1: FOUNDATION - THEME SYSTEM

### 3.1 Overview
Replace current light theme CSS variables with ORIVYA's dark theme system while preserving light mode as an option.

### 3.2 Files to Modify

#### File 1: `src/index.css`

**Current State:** Light theme with basic shadcn colors
**Target State:** ORIVYA dark theme as default with comprehensive design tokens

**Changes Required:**

```css
/* REPLACE ENTIRE :root block (lines 10-56) with: */

:root {
  /* ===========================================
     COLORS - Sage Palette (from ORIVYA)
     =========================================== */
  --sage-50: #f4f7f5;
  --sage-100: #e4ebe7;
  --sage-200: #c9d7cf;
  --sage-300: #a3bba9;
  --sage-400: #7d9b8a;
  --sage-500: #5f8170;
  --sage-600: #4a6858;
  --sage-700: #3d5448;
  --sage-800: #33453c;
  --sage-900: #2c3a33;

  /* Primary Sage */
  --sage: #7d9b8a;
  --sage-light: #9bb3a7;
  --sage-dark: #5f8170;
  --sage-subtle: rgba(125, 155, 138, 0.08);
  --sage-muted: rgba(125, 155, 138, 0.15);
  --sage-glow: rgba(125, 155, 138, 0.3);

  /* ===========================================
     BACKGROUNDS - Layered Depth System (DARK)
     =========================================== */
  --bg-base: #08080a;
  --bg-elevated: #0e0e11;
  --bg-surface: #141417;
  --bg-surface-2: #1a1a1e;
  --bg-hover: #1e1e23;
  --bg-active: #252529;

  /* ===========================================
     TEXT - Hierarchy System
     =========================================== */
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-tertiary: #71717a;
  --text-muted: #52525b;
  --text-disabled: #3f3f46;

  /* ===========================================
     BORDERS
     =========================================== */
  --border-subtle: rgba(255, 255, 255, 0.04);
  --border-default: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.12);
  --border-focus: var(--sage);

  /* ===========================================
     SEMANTIC COLORS
     =========================================== */
  --success: #81c995;
  --success-subtle: rgba(129, 201, 149, 0.15);
  --error: #f87171;
  --error-subtle: rgba(248, 113, 113, 0.15);
  --warning: #fbbf24;
  --warning-subtle: rgba(251, 191, 36, 0.15);
  --info: #60a5fa;
  --info-subtle: rgba(96, 165, 250, 0.15);

  /* ===========================================
     SHADOWS (Dark-optimized)
     =========================================== */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 20px var(--sage-glow);

  /* ===========================================
     TRANSITIONS
     =========================================== */
  --transition-fast: 150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow: 300ms ease-out;

  /* ===========================================
     TYPOGRAPHY
     =========================================== */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Type Scale */
  --text-xs: 0.75rem;
  --text-sm: 0.8125rem;
  --text-base: 0.875rem;
  --text-md: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-4xl: 2.5rem;

  /* ===========================================
     LAYOUT DIMENSIONS
     =========================================== */
  --sidebar-collapsed: 72px;
  --sidebar-expanded: 240px;
  --header-height: 56px;
  --tab-bar-height: 64px;
  --content-max-width: 720px;
  --editor-max-width: 680px;

  /* ===========================================
     BORDER RADIUS
     =========================================== */
  --radius: 0.5rem;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --radius-2xl: 28px;
  --radius-full: 9999px;

  /* ===========================================
     SHADCN COMPATIBILITY (mapped to new system)
     =========================================== */
  --background: 240 6% 4%;
  --foreground: 0 0% 98%;
  --card: 240 5% 6%;
  --card-foreground: 0 0% 98%;
  --popover: 240 5% 6%;
  --popover-foreground: 0 0% 98%;
  --primary: 145 14% 55%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4% 16%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 4% 16%;
  --muted-foreground: 240 5% 65%;
  --accent: 240 4% 16%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 63% 31%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 4% 16%;
  --input: 240 4% 16%;
  --ring: 145 14% 55%;

  --sidebar-background: 240 6% 6%;
  --sidebar-foreground: 0 0% 95%;
  --sidebar-primary: 145 14% 55%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 240 4% 12%;
  --sidebar-accent-foreground: 0 0% 95%;
  --sidebar-border: 240 4% 12%;
  --sidebar-ring: 145 14% 55%;

  color-scheme: dark;
}

/* ===========================================
   LIGHT MODE (Meadow Cream - Optional)
   =========================================== */
.light {
  --bg-base: #faf9f7;
  --bg-elevated: #ffffff;
  --bg-surface: #f5f4f2;
  --bg-surface-2: #eeedeb;
  --bg-hover: #e8e7e5;
  --bg-active: #e0dfdd;

  --text-primary: #1a1a1a;
  --text-secondary: #4a4a4a;
  --text-tertiary: #6b6b6b;
  --text-muted: #8b8b8b;
  --text-disabled: #ababab;

  --border-subtle: rgba(0, 0, 0, 0.04);
  --border-default: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.12);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

  --background: 40 20% 98%;
  --foreground: 0 0% 10%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 10%;

  color-scheme: light;
}
```

**ADD after the .light block:**

```css
/* ===========================================
   GLOBAL STYLES
   =========================================== */
@layer base {
  * {
    @apply border-border;
  }

  body {
    background-color: var(--bg-base);
    color: var(--text-primary);
    font-family: var(--font-body);
  }

  /* Selection styling */
  ::selection {
    background-color: var(--sage-muted);
    color: var(--text-primary);
  }
}
```

#### File 2: `tailwind.config.ts`

**Changes Required:**

```typescript
// ADD to theme.extend.colors (after line 59):

sage: {
  DEFAULT: 'var(--sage)',
  light: 'var(--sage-light)',
  dark: 'var(--sage-dark)',
  subtle: 'var(--sage-subtle)',
  muted: 'var(--sage-muted)',
  50: 'var(--sage-50)',
  100: 'var(--sage-100)',
  200: 'var(--sage-200)',
  300: 'var(--sage-300)',
  400: 'var(--sage-400)',
  500: 'var(--sage-500)',
  600: 'var(--sage-600)',
  700: 'var(--sage-700)',
  800: 'var(--sage-800)',
  900: 'var(--sage-900)',
},
surface: {
  base: 'var(--bg-base)',
  elevated: 'var(--bg-elevated)',
  DEFAULT: 'var(--bg-surface)',
  '2': 'var(--bg-surface-2)',
  hover: 'var(--bg-hover)',
  active: 'var(--bg-active)',
},

// ADD to theme.extend.fontFamily:
fontFamily: {
  display: 'var(--font-display)',
  body: 'var(--font-body)',
  serif: 'var(--font-display)',
  sans: 'var(--font-body)',
},

// ADD to theme.extend.boxShadow:
boxShadow: {
  'glow': 'var(--shadow-glow)',
  'glow-lg': '0 0 40px var(--sage-glow)',
},

// ADD to theme.extend.transitionDuration:
transitionDuration: {
  'fast': '150ms',
  'normal': '200ms',
  'slow': '300ms',
},
```

#### File 3: `index.html` (Add Google Fonts)

**ADD to `<head>` section:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### 3.3 Testing Checkpoint - Phase 1

After completing Phase 1, verify:

- [ ] `npm run dev` starts without errors
- [ ] Page loads with dark background (#08080a)
- [ ] Text is visible (light text on dark background)
- [ ] Sage green accent color appears correctly
- [ ] No console errors related to CSS variables
- [ ] Fonts load correctly (Fraunces for headings, Inter for body)

```bash
# Commit Phase 1 changes
git add .
git commit -m "Phase 1: Implement ORIVYA dark theme system"
```

---

## 4. PHASE 2: TYPOGRAPHY SYSTEM

### 4.1 Overview
Integrate ORIVYA's typography classes and update font usage across components.

### 4.2 Files to Modify

#### File 1: `src/index.css` (Add Typography Classes)

**ADD after the @layer base block:**

```css
/* ===========================================
   TYPOGRAPHY CLASSES
   =========================================== */
@layer components {
  /* Display Headings - Fraunces */
  .text-display-lg {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }

  .text-display {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }

  .text-display-sm {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    font-weight: 500;
    line-height: 1.375;
    color: var(--text-primary);
  }

  /* Headings - Inter */
  .text-heading-lg {
    font-family: var(--font-body);
    font-size: var(--text-xl);
    font-weight: 600;
    line-height: 1.375;
    color: var(--text-primary);
  }

  .text-heading {
    font-family: var(--font-body);
    font-size: var(--text-lg);
    font-weight: 600;
    line-height: 1.375;
    color: var(--text-primary);
  }

  /* Body Text */
  .text-body-lg {
    font-family: var(--font-body);
    font-size: var(--text-md);
    font-weight: 400;
    line-height: 1.625;
    color: var(--text-secondary);
  }

  .text-body {
    font-family: var(--font-body);
    font-size: var(--text-base);
    font-weight: 400;
    line-height: 1.5;
    color: var(--text-secondary);
  }

  .text-body-sm {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    font-weight: 400;
    line-height: 1.5;
    color: var(--text-secondary);
  }

  /* UI Text */
  .text-label {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    font-weight: 500;
    line-height: 1;
    color: var(--text-secondary);
  }

  .text-label-xs {
    font-family: var(--font-body);
    font-size: var(--text-xs);
    font-weight: 500;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }

  .text-caption {
    font-family: var(--font-body);
    font-size: var(--text-xs);
    font-weight: 400;
    line-height: 1.5;
    color: var(--text-tertiary);
  }

  /* Card Typography */
  .text-card-title {
    font-family: var(--font-body);
    font-size: var(--text-base);
    font-weight: 500;
    line-height: 1.375;
    color: var(--text-primary);
  }

  .text-card-desc {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    font-weight: 400;
    line-height: 1.5;
    color: var(--text-tertiary);
  }

  /* Greeting (Home Page) */
  .text-greeting {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: 500;
    line-height: 1.25;
    color: var(--text-primary);
  }

  @media (min-width: 768px) {
    .text-greeting {
      font-size: var(--text-4xl);
    }
  }
}
```

### 4.3 Testing Checkpoint - Phase 2

- [ ] Typography classes apply correctly
- [ ] Fraunces displays for display/greeting text
- [ ] Inter displays for body text
- [ ] Font weights render correctly (400, 500, 600)
- [ ] Line heights look appropriate

```bash
git add .
git commit -m "Phase 2: Add ORIVYA typography system"
```

---

## 5. PHASE 3: CORE COMPONENTS

### 5.1 Overview
Update Card, Button, and other UI components with dark theme styling.

### 5.2 Files to Modify

#### File 1: `components/ui/Card.tsx`

**REPLACE entire file with:**

```tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'surface';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const variantClasses = {
  default: 'bg-surface border border-border-default',
  elevated: 'bg-surface-elevated shadow-md border border-border-subtle',
  outlined: 'bg-transparent border border-border-strong',
  glass: 'bg-surface/60 backdrop-blur-md border border-border-subtle',
  surface: 'bg-surface-2 border border-border-subtle',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
}) => {
  const hoverClasses = hover
    ? 'cursor-pointer transition-all duration-200 hover:bg-surface-hover hover:border-sage/30 hover:shadow-glow active:scale-[0.99]'
    : '';

  return (
    <div
      className={`rounded-xl ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

// Card Header
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`mb-4 ${className}`}>{children}</div>;

// Card Title
export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <h3 className={`text-card-title ${className}`}>{children}</h3>
);

// Card Description
export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <p className={`text-card-desc mt-1 ${className}`}>{children}</p>;

// Card Content
export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={className}>{children}</div>;

// Card Footer
export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`mt-4 pt-4 border-t border-border-subtle ${className}`}>{children}</div>;

// Note Card (Premium Version)
interface NoteCardProps {
  title: string;
  preview: string;
  date: string;
  time?: string;
  mood?: string;
  type?: 'text' | 'voice' | 'image';
  onClick?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  title,
  preview,
  date,
  time,
  mood,
  type = 'text',
  onClick,
}) => {
  const getMoodIndicator = (mood: string) => {
    const colors: Record<string, string> = {
      radiant: 'bg-amber-400',
      content: 'bg-sage',
      steady: 'bg-blue-400',
      cloudy: 'bg-slate-400',
      low: 'bg-indigo-400',
    };
    return colors[mood?.toLowerCase()] || 'bg-slate-400';
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-surface p-5 rounded-xl border border-border-default hover:border-sage/40 hover:bg-surface-hover transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Left accent bar on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-sage opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start gap-4">
        {/* Mood indicator */}
        {mood && (
          <div className={`w-2 h-2 rounded-full mt-2 ${getMoodIndicator(mood)} shadow-sm`} />
        )}

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="text-card-title group-hover:text-sage-light transition-colors truncate">
            {title}
          </h4>

          {/* Preview with fade */}
          <p className="text-body-sm mt-1 line-clamp-2 relative">
            {preview}
            <span className="absolute right-0 bottom-0 w-16 h-full bg-gradient-to-l from-surface group-hover:from-surface-hover to-transparent" />
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-caption">{date}</span>
            {time && <span className="text-caption">{time}</span>}
            {type !== 'text' && (
              <span className="px-2 py-0.5 rounded-md bg-surface-2 text-label-xs">
                {type}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card
interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  changeType = 'neutral',
  icon,
}) => {
  const changeColors = {
    positive: 'text-success',
    negative: 'text-error',
    neutral: 'text-text-tertiary',
  };

  return (
    <Card variant="surface" padding="md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-label-xs mb-2">{label}</p>
          <p className="text-display-sm">{value}</p>
          {change && (
            <p className={`text-caption mt-1 ${changeColors[changeType]}`}>{change}</p>
          )}
        </div>
        {icon && <div className="text-sage/60">{icon}</div>}
      </div>
    </Card>
  );
};

export default Card;
```

#### File 2: `components/ui/button.tsx`

**UPDATE the buttonVariants cva (approximately lines 5-30):**

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-sage text-white hover:bg-sage-dark shadow-sm hover:shadow-glow",
        destructive: "bg-error text-white hover:bg-error/90",
        outline: "border border-border-default bg-transparent hover:bg-surface-hover hover:border-sage/30 text-text-primary",
        secondary: "bg-surface-2 text-text-secondary hover:bg-surface-hover hover:text-text-primary",
        ghost: "hover:bg-surface-hover text-text-secondary hover:text-text-primary",
        link: "text-sage underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### 5.3 Testing Checkpoint - Phase 3

- [ ] Cards display with dark background
- [ ] Card hover states work (border glow, background shift)
- [ ] NoteCard preview has fade gradient
- [ ] Buttons have sage accent color
- [ ] Button hover states show glow effect
- [ ] All button variants render correctly

```bash
git add .
git commit -m "Phase 3: Update Card and Button components for dark theme"
```

---

## 6. PHASE 4: LAYOUT & NAVIGATION

### 6.1 Overview
Update Layout.tsx with dark theme, implement collapsible sidebar pattern for desktop.

### 6.2 Files to Modify

#### File 1: `components/Layout.tsx`

**Key Changes:**
1. Replace all `bg-[#faf9f7]` with `bg-surface-base`
2. Update ambient gradients for dark theme
3. Update mobile nav bar styling
4. Update header glass effect

**REPLACE Line 43:**
```tsx
// OLD:
<div className="flex min-h-[100dvh] h-screen bg-[#faf9f7] overflow-hidden...

// NEW:
<div className="flex min-h-[100dvh] h-screen bg-surface-base overflow-hidden font-body text-text-primary selection:bg-sage-muted selection:text-text-primary w-full relative">
```

**REPLACE Lines 48-69 (Ambient Background System):**
```tsx
{!isEditor && (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    {/* 1. Subtle gradient orbs */}
    <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-sage/5 rounded-full blur-[150px] animate-pulse-slow" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-sage/3 rounded-full blur-[120px] animate-float" />

    {/* 2. Subtle noise texture overlay */}
    <div className="absolute inset-0 opacity-[0.015] bg-noise" />
  </div>
)}
```

**REPLACE Lines 88-121 (Header):**
```tsx
<header className="h-16 px-6 lg:px-10 sticky top-0 z-30 flex items-center justify-between shrink-0 transition-all duration-300">
  {/* Glass background */}
  <div className="absolute inset-0 bg-surface-base/80 backdrop-blur-xl border-b border-border-subtle z-[-1]" />

  <div className="flex items-center gap-4">
    {showBack ? (
      <button
        onClick={handleBack}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-hover border border-border-default text-text-secondary hover:bg-surface-active hover:text-text-primary transition-all"
      >
        <ChevronLeft size={20} strokeWidth={2} />
      </button>
    ) : (
      <div className="lg:hidden w-8 h-8 rounded-lg bg-sage flex items-center justify-center text-white shadow-glow">
        <span className="font-display font-medium text-xs">M</span>
      </div>
    )}

    <h1 className="font-display text-xl lg:text-2xl text-text-primary tracking-tight truncate">
      {title}
    </h1>
  </div>

  <div className="flex items-center gap-4">
    <div className="hidden md:flex relative group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-sage transition-colors" size={16} strokeWidth={1.5} />
      <input
        type="text"
        placeholder="Search..."
        className="pl-10 pr-4 py-2 w-64 bg-surface-2 border border-border-default hover:border-border-strong rounded-lg text-sm focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all placeholder:text-text-muted text-text-primary"
      />
    </div>
  </div>
</header>
```

**REPLACE Lines 131-150 (Mobile Bottom Nav):**
```tsx
{!isEditor && (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-base/90 backdrop-blur-xl border-t border-border-subtle z-50 px-6 pt-2" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
    <div className="flex items-center justify-between relative h-full">
      <MobileNavItem icon={Home} view={ViewState.HOME} label="Home" />
      <MobileNavItem icon={BookOpen} view={ViewState.JOURNAL} label="Journal" />

      <div className="relative -top-6">
        <button
          onClick={() => onChangeView(ViewState.EDITOR)}
          className="w-14 h-14 rounded-full bg-sage text-white shadow-glow flex items-center justify-center transform active:scale-95 transition-all border-4 border-surface-base"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>

      <MobileNavItem icon={LayoutGrid} view={ViewState.EXPLORE} label="Spaces" />
      <MobileNavItem icon={User} view={ViewState.SETTINGS} label="Profile" />
    </div>
  </div>
)}
```

**UPDATE MobileNavItem (around line 28):**
```tsx
const MobileNavItem = ({ icon: Icon, view, label, subViews }: any) => {
  const isActive = currentView === view || (subViews && subViews.includes(currentView)) || (view === ViewState.EXPLORE && currentView.toString().startsWith('space-'));

  return (
    <button
      onClick={() => onChangeView(view)}
      className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-sage' : 'text-text-muted hover:text-text-secondary'}`}
    >
      <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
      <span className="text-[10px] font-medium tracking-tight">{label}</span>
    </button>
  );
};
```

### 6.3 Testing Checkpoint - Phase 4

- [ ] Layout has dark background
- [ ] Header has glass blur effect
- [ ] Mobile nav bar is dark themed
- [ ] FAB button has sage glow
- [ ] Search input is styled correctly
- [ ] Back button works properly

```bash
git add .
git commit -m "Phase 4: Update Layout and Navigation for dark theme"
```

---

## 7. PHASE 5: HOME PAGE REDESIGN

### 7.1 Overview
Update Home.tsx with dark theme styling while preserving all functionality.

### 7.2 Files to Modify

#### File 1: `views/Home.tsx`

**Key color replacements throughout the file:**

| Find | Replace With |
|------|--------------|
| `bg-[#faf9f7]` | `bg-surface-base` |
| `bg-white` | `bg-surface` |
| `bg-white/60` | `bg-surface/60` |
| `bg-white/80` | `bg-surface/80` |
| `border-stone-100` | `border-border-default` |
| `border-stone-200` | `border-border-strong` |
| `border-stone-200/50` | `border-border-default` |
| `text-stone-` | `text-text-` (appropriate level) |
| `text-text-primary` | `text-text-primary` (keep) |
| `bg-stone-50` | `bg-surface-2` |
| `bg-stone-100` | `bg-surface-hover` |
| `hover:bg-stone-` | `hover:bg-surface-hover` |
| `shadow-text-primary/10` | `shadow-glow` |
| `hover:shadow-card-hover` | `hover:shadow-glow` |

**SPECIFIC UPDATES:**

**Line 254 (Container):**
```tsx
// OLD:
<div className="space-y-10 animate-fade-up pb-12 max-w-5xl mx-auto relative">

// Keep as-is, the parent Layout handles background
```

**Lines 388-426 (Daily Spark Card):**
```tsx
<div className="bg-surface rounded-[24px] p-8 border border-border-default shadow-md flex flex-col items-center text-center hover:border-sage/30 transition-all duration-500 group relative z-10">
  <div className="flex items-center gap-2 mb-4">
    <Sparkles size={14} className="text-sage" />
    <span className="text-label-xs text-sage">Daily Spark</span>
    {aiPrompt && (
      <span className="px-1.5 py-0.5 rounded-md bg-sage/15 text-[9px] font-bold text-sage uppercase tracking-wide border border-sage/20">
        AI
      </span>
    )}
  </div>

  {isLoadingPrompt ? (
    <div className="flex items-center justify-center py-4">
      <Loader2 className="w-6 h-6 text-sage animate-spin" />
    </div>
  ) : (
    <p className="font-display text-2xl md:text-3xl text-text-primary mb-8 leading-tight max-w-lg mx-auto">
      "{aiPrompt || getPrompt()}"
    </p>
  )}

  <div className="flex items-center gap-2">
    <button
      onClick={() => onChangeView(ViewState.EDITOR, { prompt: aiPrompt || getPrompt() })}
      className="px-6 py-2.5 rounded-full border border-border-default bg-surface-2 text-text-secondary hover:border-sage hover:text-sage hover:bg-sage/10 transition-all text-sm font-medium flex items-center gap-2"
    >
      <PenTool size={14} />
      Write this
    </button>
    <button
      onClick={fetchAIPrompt}
      disabled={isLoadingPrompt}
      className="p-2.5 text-text-muted hover:text-sage hover:bg-sage/10 rounded-full transition-colors disabled:opacity-50"
      title="Get AI prompt"
    >
      {isLoadingPrompt ? <Loader2 size={18} className="animate-spin" /> : <Shuffle size={18} strokeWidth={1.5} />}
    </button>
  </div>
</div>
```

**Lines 429-456 (Mood Check-in):**
```tsx
{!isMoodDismissed && (
  <div className="bg-surface/60 backdrop-blur-sm rounded-[24px] p-4 border border-border-default shadow-sm relative animate-fade-up">
    <div className="flex justify-between items-center mb-3 px-1">
      <h4 className="text-sm font-medium text-text-secondary">How are you today?</h4>
      <button onClick={() => setIsMoodDismissed(true)} className="text-text-muted hover:text-text-secondary transition-colors">
        <X size={16} />
      </button>
    </div>

    {moodLogged ? (
      <div className="w-full py-2 flex items-center justify-center gap-3 animate-fade-in">
        <div className="w-6 h-6 rounded-full bg-sage text-white flex items-center justify-center">
          <Check size={14} strokeWidth={3} />
        </div>
        <span className="text-base font-display text-text-primary">You're feeling <span className="italic">{moodLogged.toLowerCase()}</span> today.</span>
        <button onClick={handleMoodUndo} className="ml-2 text-xs text-text-muted underline hover:text-text-secondary">Undo</button>
      </div>
    ) : (
      <div className="w-full grid grid-cols-5 gap-2">
        <MoodButton icon={CloudRain} label="Low" onClick={() => handleMoodSelect('Low')} delay="0ms" />
        <MoodButton icon={Cloud} label="Cloudy" onClick={() => handleMoodSelect('Cloudy')} delay="50ms" />
        <MoodButton icon={Meh} label="Steady" onClick={() => handleMoodSelect('Steady')} delay="100ms" />
        <MoodButton icon={Smile} label="Content" onClick={() => handleMoodSelect('Content')} delay="150ms" />
        <MoodButton icon={Sun} label="Radiant" onClick={() => handleMoodSelect('Radiant')} delay="200ms" />
      </div>
    )}
  </div>
)}
```

**MoodButton Component (around line 592):**
```tsx
const MoodButton = ({ icon: Icon, label, onClick, delay }: any) => (
  <button
    onClick={onClick}
    style={{ animationDelay: delay }}
    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-surface-2 hover:bg-sage/10 hover:ring-2 ring-sage/20 transition-all text-text-secondary hover:text-sage active:scale-95 animate-fade-up"
  >
    <Icon size={20} strokeWidth={1.5} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);
```

### 7.3 Testing Checkpoint - Phase 5

- [ ] Home page displays with dark theme
- [ ] Greeting text is visible
- [ ] Daily Spark card styled correctly
- [ ] Mood buttons have proper hover states
- [ ] Thread cards display correctly
- [ ] Weekly Insight section styled
- [ ] Breath animation still works
- [ ] Quick action buttons work

```bash
git add .
git commit -m "Phase 5: Home page dark theme redesign"
```

---

## 8. PHASE 6: JOURNAL & NOTE CARDS

### 8.1 Overview
Update Journal.tsx with dark theme and premium note card styling.

### 8.2 Files to Modify

#### File 1: `views/Journal.tsx`

**Key replacements:**

| Find | Replace |
|------|---------|
| `bg-white` | `bg-surface` |
| `bg-[#faf9f7]` | `bg-surface-base` |
| `border-stone-100` | `border-border-default` |
| `border-stone-200` | `border-border-strong` |
| `text-stone-300` | `text-text-muted` |
| `text-stone-400` | `text-text-muted` |
| `shadow-card-hover` | `shadow-glow` |
| `bg-sage text-white` | `bg-sage text-white` (keep) |
| `hover:bg-stone-50` | `hover:bg-surface-hover` |

**SPECIFIC UPDATES:**

**View Mode Toggle (Lines 79-111):**
```tsx
<div className="flex items-center gap-1 bg-surface-2 border border-border-default p-1 rounded-full shadow-sm mx-auto md:mx-0">
  <button
    onClick={() => setViewMode('timeline')}
    className={`
      h-9 px-4 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300
      ${viewMode === 'timeline' ? 'bg-sage text-white shadow-glow' : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'}
    `}
  >
    <LayoutList size={14} strokeWidth={2.5} />
    <span className="hidden sm:inline">Stream</span>
  </button>
  {/* ... similar for other buttons */}
</div>
```

**ListView Note Card (Lines 206-238):**
```tsx
<div
  key={note.id}
  onClick={() => onChangeView(ViewState.EDITOR, { entryId: note.id })}
  className="group bg-surface p-5 rounded-xl border border-border-default shadow-sm hover:shadow-glow hover:border-sage/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-4 md:gap-6 relative overflow-hidden animate-fade-up text-left"
  style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
>
  <div className="absolute left-0 top-0 bottom-0 w-1 bg-sage opacity-0 group-hover:opacity-100 transition-opacity" />
  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors bg-sage/10 text-sage group-hover:bg-sage/20">
    <FileText size={18} />
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2 mb-1">
      <h4 className="font-display text-lg text-text-primary truncate">{note.title}</h4>
    </div>
    <p className="text-sm text-text-secondary truncate">{note.preview}</p>
  </div>
  <div className="flex items-center justify-between md:justify-end gap-4 min-w-[140px] border-t md:border-t-0 border-border-subtle pt-3 md:pt-0">
    <span className="px-2.5 py-1 rounded-lg bg-surface-2 text-label-xs">
      {note.category}
    </span>
    <span className="text-caption whitespace-nowrap">
      {note.date}
    </span>
  </div>
</div>
```

**StreamView Timeline (Lines 242-443):**
- Update vine color: `bg-[#dbe3df]` → `bg-sage/30`
- Update card backgrounds: `bg-white` → `bg-surface`
- Update borders: `border-stone-100` → `border-border-default`

**CalendarView (Lines 447-632):**
- Update background: `bg-white` → `bg-surface`
- Update empty days: `bg-transparent` → `bg-surface-base`
- Update mood gradients to work on dark background

### 8.3 Testing Checkpoint - Phase 6

- [ ] Journal page loads with dark theme
- [ ] View mode toggle styled correctly
- [ ] Timeline view shows cards properly
- [ ] Calendar view displays with dark cells
- [ ] List view cards have hover effects
- [ ] Thread cards display correctly
- [ ] Empty states show properly

```bash
git add .
git commit -m "Phase 6: Journal and Note Cards dark theme update"
```

---

## 9. PHASE 7: EDITOR REFINEMENTS

### 9.1 Overview
Update Editor.tsx with dark theme while preserving 5 editor modes.

### 9.2 Files to Modify

#### File 1: `views/Editor.tsx`

**Key updates (preserving all mode functionality):**

**Background and Container:**
```tsx
// Update main container background
className="fixed inset-0 bg-surface-base z-50 flex flex-col"
```

**Mode Selection Cards (Lines ~1687-1751):**
```tsx
// Update card styling
className="group bg-surface p-6 rounded-xl border border-border-default hover:border-sage/40 hover:bg-surface-hover transition-all cursor-pointer"
```

**Textarea Styling:**
```tsx
className="w-full flex-1 bg-transparent text-text-primary text-lg leading-relaxed resize-none focus:outline-none placeholder:text-text-muted"
```

**Header/Footer Glass Effects:**
```tsx
className="bg-surface-base/90 backdrop-blur-xl border-b border-border-subtle"
```

### 9.3 Testing Checkpoint - Phase 7

- [ ] Editor opens with dark theme
- [ ] All 5 modes still work (Free Flow, Quick Jot, Guided, Goals, Discovery)
- [ ] Text input is visible (light text on dark)
- [ ] Mode selection cards display correctly
- [ ] Focus mode fades header/footer
- [ ] AI reflection buttons appear after 50 chars
- [ ] Save functionality works

```bash
git add .
git commit -m "Phase 7: Editor dark theme refinements"
```

---

## 10. PHASE 8: SETTINGS & PREFERENCES

### 10.1 Overview
Update Settings pages with dark theme and ORIVYA-style organization.

### 10.2 Files to Modify

#### File 1: `views/Settings.tsx`

**Key updates:**

**Section Headers:**
```tsx
<h3 className="text-label-xs text-text-muted mb-4">ACCOUNT</h3>
```

**Setting Rows:**
```tsx
<div className="bg-surface p-4 rounded-xl border border-border-default hover:border-border-strong transition-colors">
```

**Toggle Switches:**
```tsx
// Update toggle background colors for dark theme
className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-sage' : 'bg-surface-hover'}`}
```

**Danger Zone:**
```tsx
<div className="bg-error-subtle border border-error/20 rounded-xl p-4">
  <h3 className="text-label-xs text-error mb-2">DANGER ZONE</h3>
  {/* ... */}
</div>
```

### 10.3 Testing Checkpoint - Phase 8

- [ ] Settings page displays with dark theme
- [ ] All setting sections visible
- [ ] Toggle switches work
- [ ] Theme picker displays options
- [ ] Danger zone styled with red accent
- [ ] Profile section displays correctly

```bash
git add .
git commit -m "Phase 8: Settings dark theme update"
```

---

## 11. PHASE 9: THREAD & DETAIL VIEWS

### 11.1 Overview
Update ThreadDetail.tsx and other detail views.

### 11.2 Files to Modify

#### File 1: `views/ThreadDetail.tsx`

**Key updates:**
- Update all backgrounds from white/cream to surface colors
- Update borders to border-default/border-subtle
- Update text colors to text hierarchy
- Add timeline visualization with sage accent

### 11.3 Testing Checkpoint - Phase 9

- [ ] Thread detail view loads
- [ ] Timeline visualization displays
- [ ] Entry cards styled correctly
- [ ] Navigation works properly

```bash
git add .
git commit -m "Phase 9: Thread and Detail views dark theme"
```

---

## 12. PHASE 10: MICRO-INTERACTIONS & POLISH

### 12.1 Overview
Add ORIVYA's animation system and micro-interactions.

### 12.2 Files to Modify

#### File 1: `src/index.css` (Add animations)

**ADD after typography classes:**

```css
/* ===========================================
   ANIMATIONS
   =========================================== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px var(--sage-glow); }
  50% { box-shadow: 0 0 20px var(--sage-glow); }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

/* Animation Classes */
.animate-fade-in {
  animation: fadeIn 200ms ease forwards;
}

.animate-fade-up {
  animation: fadeInUp 300ms ease forwards;
}

.animate-scale-in {
  animation: scaleIn 200ms ease forwards;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}

/* Transitions for interactive elements */
.interactive {
  transition:
    color 150ms ease,
    background-color 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease,
    transform 150ms ease;
}

/* Hover lift effect */
.hover-lift {
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 12.3 Testing Checkpoint - Phase 10

- [ ] Animations play smoothly
- [ ] Hover effects work
- [ ] Glow effects display
- [ ] Reduced motion preference respected
- [ ] Page transitions are smooth

```bash
git add .
git commit -m "Phase 10: Add micro-interactions and polish"
```

---

## 13. TESTING CHECKLIST

### 13.1 Comprehensive Testing

After completing all phases, test the following:

#### Functionality Tests
- [ ] User can sign in / sign out
- [ ] User can create new entries (all 5 modes)
- [ ] User can edit existing entries
- [ ] User can delete entries
- [ ] User can create and manage threads
- [ ] User can view journal (all 3 views)
- [ ] User can access settings
- [ ] User can update profile
- [ ] AI features work (prompts, summaries)
- [ ] Mood logging works
- [ ] Streak tracking displays

#### Visual Tests
- [ ] All pages have dark background
- [ ] Text is readable (proper contrast)
- [ ] Sage accent color consistent
- [ ] Cards have proper styling
- [ ] Buttons work and glow on hover
- [ ] Icons display correctly
- [ ] Fonts load (Fraunces + Inter)

#### Responsive Tests
- [ ] Mobile layout works (< 768px)
- [ ] Tablet layout works (768px - 1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] Mobile nav bar displays
- [ ] Desktop sidebar displays

#### Browser Tests
- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Mobile Safari (iOS)
- [ ] Chrome (Android)

### 13.2 Performance Tests

- [ ] Page load time acceptable
- [ ] No layout shift issues
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks

---

## 14. ROLLBACK INSTRUCTIONS

### 14.1 Full Rollback (Return to Pre-Redesign State)

If something goes wrong and you need to revert completely:

```bash
# Option 1: Switch to backup branch
git checkout backup-pre-redesign-YYYYMMDD

# Option 2: Hard reset main to before redesign
git checkout main
git log --oneline  # Find the commit hash before redesign started
git reset --hard <commit-hash-before-redesign>
```

### 14.2 Partial Rollback (Revert Specific Phase)

To revert a specific phase while keeping others:

```bash
# Find the commit hash for the phase you want to revert
git log --oneline

# Revert that specific commit
git revert <commit-hash>
```

### 14.3 File-Level Rollback

To restore a specific file to its previous state:

```bash
# Restore a single file from backup branch
git checkout backup-pre-redesign-YYYYMMDD -- path/to/file.tsx
```

### 14.4 Emergency Restore from Folder Backup

If git is corrupted or unavailable:

```bash
# Remove current folder (careful!)
rm -rf /Users/bchill/Documents/Claude\ Code\ Projects/meadow-official-2025

# Restore from backup
cp -r /Users/bchill/Documents/Claude\ Code\ Projects/meadow-official-2025-backup-YYYYMMDD \
      /Users/bchill/Documents/Claude\ Code\ Projects/meadow-official-2025
```

---

## PROGRESS TRACKING

Use this checklist to track implementation progress:

### Phase Completion

- [ ] **Phase 1:** Theme System _(Commit: ________)_
- [ ] **Phase 2:** Typography System _(Commit: ________)_
- [ ] **Phase 3:** Core Components _(Commit: ________)_
- [ ] **Phase 4:** Layout & Navigation _(Commit: ________)_
- [ ] **Phase 5:** Home Page Redesign _(Commit: ________)_
- [ ] **Phase 6:** Journal & Note Cards _(Commit: ________)_
- [ ] **Phase 7:** Editor Refinements _(Commit: ________)_
- [ ] **Phase 8:** Settings & Preferences _(Commit: ________)_
- [ ] **Phase 9:** Thread & Detail Views _(Commit: ________)_
- [ ] **Phase 10:** Micro-interactions & Polish _(Commit: ________)_

### Final Steps

- [ ] All testing checkpoints passed
- [ ] Feature branch merged to main
- [ ] Backup branch retained for reference
- [ ] Documentation updated if needed

---

## NOTES

- Each phase builds on the previous one - complete in order
- Test after each phase before moving on
- Commit after each successful phase
- If a phase breaks something, revert and investigate before continuing
- The backup branch is your safety net - don't delete it until you're 100% satisfied

---

**Document Version:** 1.0.0
**Last Updated:** December 2024
**Author:** Claude Code Assistant
