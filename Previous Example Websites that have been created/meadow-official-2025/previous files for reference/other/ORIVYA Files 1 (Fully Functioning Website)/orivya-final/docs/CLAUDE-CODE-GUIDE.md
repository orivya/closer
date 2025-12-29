# ORIVYA V1 — Claude Code Implementation Guide

This guide explains how to use the design files to build Orivya with Claude Code.

---

## 📁 FOLDER STRUCTURE

```
orivya-v1/
├── README.md                    # Project overview
├── design-system/               # Core design tokens and utilities
│   ├── design-tokens.css        # CSS custom properties
│   ├── typography.css           # Font styles
│   ├── animations.css           # All keyframe animations
│   └── utilities.css            # Utility classes
├── components/                  # Reusable UI components
│   ├── orivya-micro-interactions-v1.html  # Button/card interactions
│   ├── orivya-modals-v1.html              # Modal patterns
│   ├── orivya-empty-states-v1.html        # Empty state designs
│   ├── orivya-loading-error-states-v1.html # Loading/error UI
│   └── ...                      # Other component demos
├── screens/                     # Full page designs (HTML prototypes)
│   ├── orivya-note-editor-v5.html         # ⭐ Main editor (canonical)
│   ├── orivya-home-dashboard-v7.html      # ⭐ Home (canonical)
│   └── ...                      # Other screens
├── content/                     # JSON content files (import directly)
│   ├── copy-editor-microcopy.json         # Editor emotional content
│   ├── prompts-checkin.json               # Quick prompts
│   ├── prompts-deep.json                  # Deep reflection prompts
│   └── ...                      # Other copy
└── docs/                        # Implementation documentation
    ├── CANONICAL-VERSIONS.md    # Which version of each screen to use
    ├── TECHNICAL-SPEC.md        # Database schema, API structure
    ├── REACT-COMPONENTS.md      # Component breakdown
    └── tailwind.config.js       # Tailwind configuration
```

---

## 🚀 RECOMMENDED BUILD ORDER

### Phase 1: Foundation
1. Set up Next.js/Vite + Tailwind using `tailwind.config.js`
2. Import design tokens from `design-tokens.css`
3. Set up Supabase tables per `TECHNICAL-SPEC.md`

### Phase 2: Core Loop
4. **Note Editor** (`orivya-note-editor-v5.html`) — Start here, it's the heart of the app
5. **Note View** (`orivya-note-view-v6.html`)
6. **Notes List** (`orivya-notes-list-v1.html`)
7. **Home Dashboard** (`orivya-home-dashboard-v7.html`)

### Phase 3: Discovery
8. **Insights** (`orivya-insights-v4.html`)
9. **Insight Reveal** (`orivya-insight-reveal-v1.html`)
10. **Threads** (`orivya-thread-detail-v1.html`)

### Phase 4: Polish
11. **First Arrival** (`orivya-first-arrival-v1.html`) — First-time user flow
12. **Guided Flow** (`orivya-guided-flow-v1.html`)
13. Settings, Search, Goals, etc.

---

## 🎭 EDITOR MICROCOPY SYSTEM

The Note Editor has an emotional warmth system. Import from `content/copy-editor-microcopy.json`:

### Arrival Lines (25 total)
- **When:** First entry to new/blank note (once per session)
- **How:** Random selection from array
- **Hide:** When user starts typing

### Placeholders (10 total)
- **When:** Editor loads
- **How:** Random selection, set as textarea placeholder

### Pause Messages (35 total)
- **When:** User pauses typing for 8+ seconds AND has written 50+ characters
- **Frequency:** ONCE per session (never repeat)
- **Display:** Fade in below textarea, auto-fade after 4 seconds
- **Also:** Trigger subtle caret glow animation

### Return Messages (5 total)
- **When:** User returns to same unfinished note same day
- **How:** Show instead of arrival line

### Closure Messages (15 total)
- **When:** User presses "Done" button
- **Display:** Overlay with centered message, 2 second duration, then navigate

### Implementation Example (React):
```typescript
import microcopy from '@/content/copy-editor-microcopy.json';

const [arrivalLine] = useState(() => 
  microcopy.arrivalLines[Math.floor(Math.random() * microcopy.arrivalLines.length)]
);

const [placeholder] = useState(() =>
  microcopy.placeholders[Math.floor(Math.random() * microcopy.placeholders.length)]
);
```

---

## 🎨 ANIMATION SYSTEM

All animations are defined in `design-system/animations.css`. Key animations:

| Animation | Duration | Use For |
|-----------|----------|---------|
| `fadeIn` | 200ms | General fade in |
| `fadeInUp` | 400ms | Content appearing |
| `scaleIn` | 200ms | Modal/card appearing |
| `slideInUp` | 400ms | Bottom sheets |
| `insightReveal` | 400ms | Insight modal special entrance |
| `breathing` | 4s | Ambient pulsing (sparingly) |
| `sanctuaryEnter` | 400ms | Editor entrance |
| `pauseMessageFade` | 4s | Pause message auto-fade |
| `closureTextFade` | 2s | Closure moment |
| `caretGlow` | 1.5s | Single caret pulse |

### Reduced Motion
All animations respect `prefers-reduced-motion`. See bottom of `animations.css`.

---

## 🌙 TIME-OF-DAY SYSTEM

The **Home Dashboard** has ambient color based on time (the Editor does NOT — it maintains consistent sanctuary feel):

| Time | Tint Variable | Color |
|------|---------------|-------|
| Morning (5am-12pm) | `--time-morning-tint` | Warm gold (0.025 opacity) |
| Afternoon (12pm-5pm) | `--time-afternoon-tint` | Neutral (transparent) |
| Evening (5pm-9pm) | `--time-evening-tint` | Cool blue (0.02 opacity) |
| Night (9pm-5am) | `--time-night-tint` | Warm amber (0.03 opacity) |

### Implementation (Home Dashboard only):
```typescript
function getTimeOfDayTint(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'var(--time-morning-tint)';
  if (hour >= 12 && hour < 17) return 'var(--time-afternoon-tint)';
  if (hour >= 17 && hour < 21) return 'var(--time-evening-tint)';
  return 'var(--time-night-tint)';
}
```

---

## 🏔 MOOD LAYER SYSTEM

Different screens have different atmospheric depth:

| Layer | Screens | Has Vignette | CSS |
|-------|---------|--------------|-----|
| **Clarity** | Home, Notes List, Insights, Goals, Settings | ❌ | Normal background |
| **Focus** | Note View, Threads | ❌ | Normal background |
| **Sanctuary** | Note Editor, Guided Flow | ✅ | `.sanctuary` class with `::before` vignette |
| **Sacred** | Insight Reveal | ✅ | Special modal with cinematic treatment |

**Important:** Do NOT add vignettes to Clarity/Focus screens. The Editor should feel special.

---

## 📱 RESPONSIVE BREAKPOINTS

From `design-system/orivya-breakpoints-v1.html`:

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 768px | Single column, bottom nav, FAB |
| Tablet | 768px - 1024px | Two column where appropriate |
| Desktop | > 1024px | Sidebar nav, split views |

---

## 💾 DATABASE SCHEMA

From `docs/TECHNICAL-SPEC.md`:

### Core Tables:
- `users` — User accounts
- `notes` — Journal entries
- `threads` — Connected note groups
- `insights` — AI-generated observations
- `goals` — User questions/goals
- `prompts_shown` — Track which prompts shown to user

### Key Relationships:
- Notes belong to users
- Notes can belong to threads
- Notes can link to goals
- Insights reference notes they're derived from

---

## 🔑 KEY IMPLEMENTATION NOTES

### 1. Hidden Scrollbars in Editor
The editor uses invisible scrollbars:
```css
.editor-content::-webkit-scrollbar {
  width: 0;
  background: transparent;
}
.editor-content {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
```

### 2. No Colored Category Indicators
Categories use ONLY sage color — no blue/pink/yellow dots.

### 3. Warm Copy Throughout
Use the copy from JSON files. Key replacements:
- "Add to thread" → "Connect to a thread"
- "Goals" → "Questions You're Living With"
- "Mark as resolved" → "I've found my answer"

### 4. Prompt Rotation
Prompts should rotate and not repeat for 14 days. Track in `prompts_shown` table.

### 5. Insight Timing
Insights should appear rarely and meaningfully — not on every note save.

---

## ✅ IMPLEMENTATION CHECKLIST

```
[ ] Set up project with Tailwind
[ ] Import design tokens
[ ] Create Supabase tables
[ ] Build Note Editor with microcopy system
[ ] Build Note View
[ ] Build Notes List with split view
[ ] Build Home Dashboard with time-of-day greeting
[ ] Build Insights page
[ ] Build Insight Reveal modal
[ ] Build Thread Detail
[ ] Build First Arrival flow
[ ] Build Guided Flow
[ ] Build remaining screens
[ ] Test on mobile
[ ] Test reduced motion
[ ] Test offline behavior
```

---

## 🎯 SUCCESS CRITERIA

The app feels right when:
- Opening the Editor feels like entering a quiet room
- Pause messages feel like ambient acknowledgment, not coaching
- Closure moment creates a sense of completion
- Moving between screens feels smooth, not jarring
- The app is silent about its features — it just works

---

## 📚 REFERENCE FILES

| For This | Reference This |
|----------|----------------|
| Which version to use | `docs/CANONICAL-VERSIONS.md` |
| Database schema | `docs/TECHNICAL-SPEC.md` |
| Component structure | `docs/REACT-COMPONENTS.md` |
| Tailwind config | `docs/tailwind.config.js` |
| Animation specs | `design-system/animations.css` |
| Editor microcopy | `content/copy-editor-microcopy.json` |
| Prompts | `content/prompts-*.json` |
| UI copy | `content/copy-*.json` |
