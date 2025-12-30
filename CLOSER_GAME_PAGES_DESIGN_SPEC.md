# CLOSER — Game Pages Detailed Design Specification
## World-Class Design Reference for Gemini

---

# Design Foundation Reference

All game pages inherit from the existing `closer_world_class_premium_dashboard_refined_2026_clean.html` design system:

```css
/* Core Colors */
--base: #050505;           /* Deep black background */
--clay: #e09f7d;           /* Warm terracotta accent */
--mist: #c4b5fd;           /* Cool lavender accent */
--sand: #f5e6d3;           /* Primary text */
--stone: #9ca3af;          /* Secondary text */

/* Typography */
--font-serif: "Fraunces"   /* Display headings, emotional text */
--font-sans: "Manrope"     /* Body text, UI elements */

/* Motion */
--easing: cubic-bezier(0.16, 1, 0.3, 1);  /* Spring-like feel */
--dur-1: 140ms;
--dur-2: 220ms;
--dur-3: 520ms;

/* Surfaces */
- Gradient borders: linear-gradient(135deg, rgba(224,159,125,0.2), rgba(196,181,253,0.15))
- Glass effect: backdrop-filter: blur(22px)
- Subtle grain texture overlay
```

---

# Global Game Page Patterns

## Header Pattern (All Game Pages)
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back                        [Activity Name]        ⋮     │
│                                                             │
│                    [Partner Presence]                       │
│                 "[Name] is here" or offline                 │
└─────────────────────────────────────────────────────────────┘
```

**Design Details:**
- Back button: Ghost style, Lucide `arrow-left` icon
- Activity name: Fraunces, 20px, centered
- Overflow menu (⋮): Settings, history, help
- Partner presence: Small avatar (32px) + status text
- When partner online: Green dot, "[Name] is here"
- When partner offline: Gray dot, "[Name] is offline"

## Sync Mode Selector (When Partner Online)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│         ┌─────────────┐      ┌─────────────┐               │
│         │   Together  │      │  I'll start │               │
│         │             │      │             │               │
│         │  (primary)  │      │   (ghost)   │               │
│         └─────────────┘      └─────────────┘               │
│                                                             │
│         "Play together      "They'll see your             │
│          in real-time"       answer when ready"            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Button Specifications:**
- Together button: Primary style (clay background, 44px height, 160px min-width)
- I'll start button: Ghost style (transparent, border only)
- Gap between buttons: 16px
- Helper text: 12px, --stone color, centered below each button

## Waiting State Pattern
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                      ◌ ◌ ◌                                 │
│                   (pulsing dots)                           │
│                                                             │
│               Waiting for [Partner Name]...                │
│                                                             │
│                 "They're thinking..."                       │
│                                                             │
│              ┌──────────────────────┐                      │
│              │   Send a nudge 💭    │                      │
│              └──────────────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Animation Details:**
- Three dots pulse sequentially (opacity 0.3 → 1 → 0.3)
- Pulse duration: 1.2s
- Partner avatar shows above dots with subtle float animation
- Nudge button appears after 30 seconds of waiting

---

# 1. INTIMACY DECK — Complete Page Specifications

## 1.1 Deck Home (`/connect/intimacy-deck`)

### Desktop Layout (1280px+)
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│     ┌─────────────────────────────────┐  ┌───────────────────────┐     │
│     │                                 │  │    Category Stats     │     │
│     │         CARD STACK              │  │  ───────────────────  │     │
│     │        (3D perspective)         │  │  ● Deep Questions  42 │     │
│     │                                 │  │  ○ Playful        18  │     │
│     │     ╭─────────────────────╮     │  │  ○ Intimate       12  │     │
│     │    ╭┤                     ├╮    │  │  ○ Future          8  │     │
│     │   ╭┤│                     │├╮   │  │                       │     │
│     │  ╭┤│├─────────────────────┤│├╮  │  │  Total: 127 answered │     │
│     │  │││╲                     ╱│││  │  │                       │     │
│     │  │││ ╲   Tap to draw     ╱ │││  │  │  🔥 14-day streak    │     │
│     │  ││├──────────────────────┤││   │  │                       │     │
│     │   └┤                      ├┘    │  ├───────────────────────┤     │
│     │    └──────────────────────┘     │  │  [Browse Categories]  │     │
│     │                                 │  │  [View History]       │     │
│     │     ┌──────────┐ ┌──────────┐   │  │  [Create Custom] 👑   │     │
│     │     │ Together │ │I'll start│   │  └───────────────────────┘     │
│     │     └──────────┘ └──────────┘   │                                │
│     │                                 │                                │
│     └─────────────────────────────────┘                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Card Stack Visual Specifications

**3D Card Stack Effect:**
```css
.deck-card {
  width: 300px;
  height: 420px;
  border-radius: 24px;
  background: linear-gradient(135deg,
    rgba(255,255,255,0.04) 0%,
    rgba(255,255,255,0.01) 100%);
  border: 1px solid var(--border-subtle);
  box-shadow:
    0 4px 20px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.05);
  transform-style: preserve-3d;
  perspective: 1000px;
}

/* Stack effect - each card offset */
.deck-card:nth-child(1) { transform: translateZ(0) translateY(0); }
.deck-card:nth-child(2) { transform: translateZ(-10px) translateY(4px) scale(0.98); opacity: 0.7; }
.deck-card:nth-child(3) { transform: translateZ(-20px) translateY(8px) scale(0.96); opacity: 0.4; }
```

**Card Face Design:**
- Closer logo watermark (10% opacity, centered)
- Decorative border pattern (subtle geometric lines at 3% opacity)
- "Intimacy Deck" text at bottom (Fraunces, 14px, --stone)
- Category indicator dot in top-right (clay/mist/gold based on category)

**Hover State:**
- Card lifts slightly: `transform: translateY(-8px) rotateX(2deg);`
- Glow appears: `box-shadow: 0 20px 60px rgba(224,159,125,0.15);`
- Cursor changes to pointer

**Tap/Click Animation:**
- Card flips 180° on Y-axis (0.6s, spring easing)
- Back reveals question with fade-in
- Other stack cards shift up to fill gap

---

## 1.2 Category Selection (`/connect/intimacy-deck/categories`)

### Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back                   Categories                                    │
│                                                                         │
│  "Choose a category to explore together"                               │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│  │     ♥️           │  │     ✨           │  │     🌙           │        │
│  │                 │  │                 │  │                 │        │
│  │    Deep         │  │    Playful      │  │   Intimate      │        │
│  │   Questions     │  │    & Fun        │  │   (Premium)     │        │
│  │                 │  │                 │  │      👑         │        │
│  │   48 cards      │  │   36 cards      │  │   24 cards      │        │
│  │   ████████░░    │  │   ██████░░░░    │  │   🔒 Unlock     │        │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘        │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│  │     🌅           │  │     💭           │  │     🔮           │        │
│  │                 │  │                 │  │                 │        │
│  │    Dreams &     │  │   Memories      │  │    Future       │        │
│  │    Goals        │  │                 │  │   Together      │        │
│  │                 │  │                 │  │                 │        │
│  │   20 cards      │  │   32 cards      │  │   28 cards      │        │
│  │   ██░░░░░░░░    │  │   ██████████    │  │   ████░░░░░░    │        │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Category Card Specifications

**Size:** 200px × 240px (desktop), full-width stacked (mobile)

**Visual Structure:**
```
┌─────────────────────────┐
│    Emoji (48px)         │  ← Category icon
│                         │
│    Category Name        │  ← Fraunces, 18px, --sand
│    (Subhead)           │  ← Manrope, 13px, --stone
│                         │
│    X cards             │  ← Manrope, 12px, --stone
│    ████████░░░░        │  ← Progress bar (% completed)
└─────────────────────────┘
```

**Category Colors:**
| Category | Icon | Accent Color |
|----------|------|--------------|
| Deep Questions | ♥️ | --clay |
| Playful & Fun | ✨ | Gold (#d4af37) |
| Intimate | 🌙 | --mist |
| Dreams & Goals | 🌅 | Coral (#ff7f7f) |
| Memories | 💭 | Teal (#5eead4) |
| Future Together | 🔮 | --mist |

**Progress Bar:**
- Height: 4px
- Background: rgba(255,255,255,0.1)
- Fill: Category accent color
- Border-radius: 2px

**Locked State (Premium):**
- Overlay: rgba(5,5,5,0.7)
- Lock icon centered
- "Unlock with Closer+" badge
- On hover: slight shake animation

---

## 1.3 Answer Input (`/connect/intimacy-deck/answer`)

### Split Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ┌────────────────────────────────┐  ┌────────────────────────────────┐│
│  │         THE QUESTION           │  │         YOUR ANSWER            ││
│  │                                │  │                                ││
│  │  ┌──────────────────────────┐  │  │  ┌──────────────────────────┐  ││
│  │  │                          │  │  │  │                          │  ││
│  │  │   "What's a dream you've │  │  │  │  [Large textarea]        │  ││
│  │  │    never told anyone     │  │  │  │                          │  ││
│  │  │    about?"               │  │  │  │  Placeholder:            │  ││
│  │  │                          │  │  │  │  "Take your time..."     │  ││
│  │  │                          │  │  │  │                          │  ││
│  │  │                          │  │  │  │                          │  ││
│  │  │                          │  │  │  │                          │  ││
│  │  └──────────────────────────┘  │  │  └──────────────────────────┘  ││
│  │                                │  │                                ││
│  │  Category: Deep Questions      │  │     Characters: 0/500          ││
│  │  Card 24 of 48                 │  │                                ││
│  │                                │  │     ┌─────────────────────┐    ││
│  │  ┌────────┐                    │  │     │   Submit Answer     │    ││
│  │  │ Skip   │                    │  │     └─────────────────────┘    ││
│  │  └────────┘                    │  │                                ││
│  └────────────────────────────────┘  └────────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Question Card Design

**Visual Treatment:**
- Large centered text: Fraunces, 28px, --sand
- Quotation marks as decorative element (120px, 5% opacity)
- Subtle gradient background: rgba(clay, 0.03) to transparent
- Border: 1px solid var(--border-subtle)
- Card padding: 48px

**Typography for Questions:**
```css
.question-text {
  font-family: var(--font-serif);
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 400;
  font-style: italic;
  line-height: 1.5;
  text-align: center;
  color: var(--sand);
  text-wrap: balance;
}
```

### Answer Textarea Design

**Specifications:**
- Min-height: 200px
- Auto-grows to max 400px
- Background: rgba(255,255,255,0.02)
- Border: 1px solid var(--border-subtle)
- Border on focus: var(--border-highlight) + mist glow
- Placeholder: "Take your time... there's no rush" (--stone, italic)
- Character counter: Bottom right, turns --clay at 450+

---

## 1.4 Answer Reveal (`/connect/intimacy-deck/reveal`)

### The Magic Moment

**Reveal Animation Sequence:**
1. **Build-up** (0-600ms): Screen dims slightly, anticipation text appears
2. **Slide-in** (600-1200ms): Both answer cards slide in from opposite sides
3. **Settle** (1200-1400ms): Cards settle into final position with spring bounce
4. **Celebration** (if matching): Subtle particle effect between cards

### Desktop Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                           THE QUESTION                                  │
│              "What's a dream you've never told anyone?"                │
│                                                                         │
│  ┌────────────────────────────┐    ┌────────────────────────────┐      │
│  │                            │    │                            │      │
│  │     [Your Avatar]          │    │     [Partner Avatar]       │      │
│  │         You                │    │       [Name]               │      │
│  │                            │    │                            │      │
│  │  ──────────────────────    │    │  ──────────────────────    │      │
│  │                            │    │                            │      │
│  │  "I've always wanted to    │    │  "To open a small cafe    │      │
│  │   write a novel. Not for   │    │   by the ocean where we   │      │
│  │   anyone else to read,     │    │   could spend mornings    │      │
│  │   just for me to know I    │    │   together before the     │      │
│  │   could do it."            │    │   world wakes up."        │      │
│  │                            │    │                            │      │
│  │                            │    │                            │      │
│  └────────────────────────────┘    └────────────────────────────┘      │
│                                                                         │
│         [React ❤️]                           [React 💭]                │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│  │  Save to Moments │  │    Discuss     │  │   Next Card    │        │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Answer Card Specifications

**Dimensions:** 340px × auto (min 300px)

**Visual Treatment:**
```css
.answer-card {
  background: linear-gradient(135deg,
    rgba(255,255,255,0.03) 0%,
    rgba(255,255,255,0.01) 100%);
  border: 1px solid var(--border-subtle);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.answer-card.yours {
  border-left: 3px solid var(--clay);
}

.answer-card.theirs {
  border-left: 3px solid var(--mist);
}
```

**Answer Text:**
- Font: Manrope, 16px
- Line-height: 1.7
- Color: var(--sand)

**Reveal Animation (CSS):**
```css
@keyframes slide-in-left {
  0% {
    transform: translateX(-100%) rotateY(15deg);
    opacity: 0;
  }
  70% {
    transform: translateX(5%) rotateY(-2deg);
    opacity: 1;
  }
  100% {
    transform: translateX(0) rotateY(0);
    opacity: 1;
  }
}

@keyframes slide-in-right {
  0% {
    transform: translateX(100%) rotateY(-15deg);
    opacity: 0;
  }
  70% {
    transform: translateX(-5%) rotateY(2deg);
    opacity: 1;
  }
  100% {
    transform: translateX(0) rotateY(0);
    opacity: 1;
  }
}

.answer-card.yours {
  animation: slide-in-left 800ms var(--easing);
}

.answer-card.theirs {
  animation: slide-in-right 800ms var(--easing) 200ms backwards;
}
```

---

# 2. HOT TAKES — Complete Page Specifications

## 2.1 Hot Takes Home (`/connect/hot-takes`)

### Concept
Hot Takes presents provocative statements for couples to agree or disagree on, then reveals if they aligned.

### Desktop Layout
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back                     Hot Takes                    👥 Together   │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                                                                   │ │
│  │                      🔥                                           │ │
│  │                                                                   │ │
│  │                "Breakfast for dinner is                           │ │
│  │                 the superior meal."                               │ │
│  │                                                                   │ │
│  │                    Category: Food & Lifestyle                     │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│       ┌─────────────────────┐    ┌─────────────────────┐              │
│       │                     │    │                     │              │
│       │       AGREE         │    │      DISAGREE       │              │
│       │                     │    │                     │              │
│       │       👍            │    │         👎          │              │
│       │                     │    │                     │              │
│       └─────────────────────┘    └─────────────────────┘              │
│                                                                         │
│                          OR                                            │
│                                                                         │
│       ┌─────────────────────────────────────────────────┐              │
│       │            🎲  Random Topic                     │              │
│       └─────────────────────────────────────────────────┘              │
│                                                                         │
│  Categories: [Relationships] [Life] [Food] [Culture] [Hypotheticals]  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Topic Card Design

**Visual Treatment:**
- Full-width card, 280px height
- Background: Subtle radial gradient from center (warm glow)
- Fire emoji animated (subtle flicker)
- Statement text: Fraunces, 26px, centered
- Category badge below: Pill shape, 12px uppercase

### Vote Buttons

**Specifications:**
- Size: 180px × 120px
- Border-radius: 24px
- Gap between: 24px

**Agree Button:**
```css
.vote-agree {
  background: linear-gradient(135deg,
    rgba(224,159,125,0.15) 0%,
    rgba(224,159,125,0.05) 100%);
  border: 2px solid rgba(224,159,125,0.3);
  color: var(--clay);
}

.vote-agree:hover {
  background: linear-gradient(135deg,
    rgba(224,159,125,0.25) 0%,
    rgba(224,159,125,0.1) 100%);
  transform: scale(1.02);
  box-shadow: 0 0 30px rgba(224,159,125,0.2);
}
```

**Disagree Button:**
```css
.vote-disagree {
  background: linear-gradient(135deg,
    rgba(196,181,253,0.15) 0%,
    rgba(196,181,253,0.05) 100%);
  border: 2px solid rgba(196,181,253,0.3);
  color: var(--mist);
}
```

**Selection Animation:**
- Selected button scales to 1.05 and glows
- Unselected button fades to 40% opacity
- Lock animation plays (checkmark appears)

---

## 2.2 Hot Takes Results (`/connect/hot-takes/results`)

### Match vs Mismatch Display

**Match State:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                         ✨ You both agree! ✨                           │
│                                                                         │
│              "Breakfast for dinner is the superior meal."              │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │                                                                    ││
│  │     [Your Avatar] ─────────────────── [Partner Avatar]           ││
│  │           👍                                  👍                   ││
│  │                                                                    ││
│  │     ████████████████████████████████████████████████ 100%         ││
│  │                          AGREE                                     ││
│  │                                                                    ││
│  └────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│                     🔥 5 agreements in a row!                          │
│                                                                         │
│       ┌─────────────────┐    ┌─────────────────┐                      │
│       │    Discuss 💬   │    │   Next Topic    │                      │
│       └─────────────────┘    └─────────────────┘                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Mismatch State:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                      🤔 A hot debate!                                  │
│                                                                         │
│              "Breakfast for dinner is the superior meal."              │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │                                                                    ││
│  │     [Your Avatar]                         [Partner Avatar]         ││
│  │          👍                                     👎                  ││
│  │        AGREE                               DISAGREE                ││
│  │                                                                    ││
│  │     ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░             ││
│  │          42%                                   58%                 ││
│  │                                                                    ││
│  └────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│                   "Time to change their mind? 😏"                      │
│                                                                         │
│       ┌─────────────────┐    ┌─────────────────┐                      │
│       │  Make your case │    │   Next Topic    │                      │
│       └─────────────────┘    └─────────────────┘                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Comparison Bar Design

**Visual Specifications:**
- Height: 40px
- Border-radius: 20px
- Background: var(--surface-2)
- Divider: 2px white line at split point

**Agree Side (Left):**
- Color: linear-gradient(90deg, var(--clay-glow), var(--clay))
- Percentage text aligned left

**Disagree Side (Right):**
- Color: linear-gradient(90deg, var(--mist), var(--mist-glow))
- Percentage text aligned right

**Animation:**
- Bars grow from center to final width
- Duration: 800ms, spring easing
- Stagger: Agree bar starts 100ms before Disagree

---

# 3. WOULD YOU RATHER — Complete Page Specifications

## 3.1 Options Display (`/connect/would-you-rather/play`)

### The Choice Interface

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back                  Would You Rather                👥 Together   │
│                                                                         │
│                        "Would you rather..."                            │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐
│  │                                                                     │
│  │                                                                     │
│  │           Live in a treehouse in the forest                        │
│  │                                                                     │
│  │                      🌲                                             │
│  │                                                                     │
│  │                                                                     │
│  └─────────────────────────────────────────────────────────────────────┘
│                                                                         │
│                              — OR —                                     │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐
│  │                                                                     │
│  │                                                                     │
│  │           Live in a houseboat on the ocean                         │
│  │                                                                     │
│  │                      🌊                                             │
│  │                                                                     │
│  │                                                                     │
│  └─────────────────────────────────────────────────────────────────────┘
│                                                                         │
│                    Category: Dream Homes                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Option Card Design

**Dimensions:** Full width, 180px height

**Visual Treatment:**
```css
.option-card {
  background: linear-gradient(135deg,
    rgba(255,255,255,0.03) 0%,
    rgba(255,255,255,0.01) 100%);
  border: 2px solid var(--border-subtle);
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all var(--dur) var(--easing);
}

.option-card:hover {
  border-color: var(--border-highlight);
  transform: scale(1.01);
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.option-card.selected {
  border-color: var(--clay);
  background: linear-gradient(135deg,
    rgba(224,159,125,0.1) 0%,
    rgba(224,159,125,0.02) 100%);
  box-shadow: 0 0 40px rgba(224,159,125,0.15);
}
```

**Option Text:**
- Font: Fraunces, 22px
- Color: var(--sand)
- Line-height: 1.4

**Decorative Emoji:**
- Size: 48px
- Margin-top: 16px
- Subtle float animation

### "OR" Divider

```css
.or-divider {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 0;
}

.or-divider::before,
.or-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    var(--border-subtle),
    transparent);
}

.or-divider span {
  font-family: var(--font-serif);
  font-size: 14px;
  font-style: italic;
  color: var(--stone);
  letter-spacing: 0.3em;
  text-transform: uppercase;
}
```

---

## 3.2 Results Comparison (`/connect/would-you-rather/results`)

### Reveal Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                        "Would you rather..."                            │
│                                                                         │
│  ┌────────────────────────────────┐  ┌────────────────────────────────┐│
│  │                                │  │                                ││
│  │    Live in a treehouse        │  │    Live on a houseboat         ││
│  │                                │  │                                ││
│  │           🌲                   │  │           🌊                   ││
│  │                                │  │                                ││
│  │    ┌─────────────────────┐    │  │                                ││
│  │    │   [Your Avatar]     │    │  │    ┌─────────────────────┐    ││
│  │    │      You chose      │    │  │    │  [Partner Avatar]   │    ││
│  │    │       this!         │    │  │    │    [Name] chose     │    ││
│  │    └─────────────────────┘    │  │    │      this!          │    ││
│  │                                │  │    └─────────────────────┘    ││
│  └────────────────────────────────┘  └────────────────────────────────┘│
│                                                                         │
│              "You're dreaming of different adventures! 🗺️"             │
│                                                                         │
│       ┌─────────────────────────────────────────────────┐              │
│       │      "Why did you choose the treehouse?" 💬     │              │
│       └─────────────────────────────────────────────────┘              │
│                                                                         │
│       ┌─────────────────┐    ┌─────────────────┐                      │
│       │   Share why 💭  │    │   Next Choice   │                      │
│       └─────────────────┘    └─────────────────┘                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Selection Indicator

**Avatar Badge Design:**
```css
.choice-indicator {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0,0,0,0.8);
  border: 1px solid var(--border-highlight);
  border-radius: 999px;
  backdrop-filter: blur(8px);
}

.choice-indicator img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.choice-indicator span {
  font-size: 12px;
  font-weight: 600;
  color: var(--sand);
}
```

---

# 4. TIME CAPSULE — Complete Page Specifications

## 4.1 Capsule List (`/connect/time-capsule`)

### Capsule States

**Active (Sealed) Capsule:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│    ┌───────────────────────────────────────────────────────────────┐   │
│    │                                                               │   │
│    │     🔒                              Opens in:                 │   │
│    │                                      47 days                  │   │
│    │     Sealed by you & [Partner]                                 │   │
│    │     on December 28, 2025                                      │   │
│    │                                                               │   │
│    │     ─────────────────────────────────────                     │   │
│    │                                                               │   │
│    │     "For our anniversary next year..."                        │   │
│    │                                                               │   │
│    │     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████  87% remaining          │   │
│    │                                                               │   │
│    └───────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Ready to Open:**
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│    ┌───────────────────────────────────────────────────────────────┐   │
│    │    ✨ PULSING GLOW BORDER ✨                                   │   │
│    │                                                               │   │
│    │     🎁                              Ready to open!            │   │
│    │                                                               │   │
│    │     Sealed by you & [Partner]                                 │   │
│    │     on December 28, 2024                                      │   │
│    │                                                               │   │
│    │                                                               │   │
│    │             ┌─────────────────────────┐                       │   │
│    │             │    Open Together 💝     │                       │   │
│    │             └─────────────────────────┘                       │   │
│    │                                                               │   │
│    └───────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Sealed Capsule Visual

**Wax Seal Effect:**
```css
.capsule-seal {
  width: 80px;
  height: 80px;
  background: radial-gradient(circle at 30% 30%,
    #c94545 0%,
    #8b2020 50%,
    #5a1010 100%);
  border-radius: 50%;
  box-shadow:
    inset -3px -3px 10px rgba(0,0,0,0.4),
    inset 3px 3px 10px rgba(255,255,255,0.1),
    0 5px 15px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.capsule-seal::after {
  content: "❤️";
  font-size: 32px;
}
```

**Countdown Animation:**
- Days remaining in large display (Fraunces, 48px)
- Progress bar showing time elapsed vs total
- Subtle pulse when under 7 days remaining

---

## 4.2 Create Flow (`/connect/time-capsule/create/*`)

### Step 1: Choose Open Date

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back               Create Time Capsule                  Step 1 of 4 │
│                                                                         │
│                  "When should this capsule open?"                       │
│                                                                         │
│    ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │
│    │    1 Week     │  │    1 Month    │  │    6 Months   │            │
│    │    Jan 4      │  │    Jan 28     │  │    Jun 28     │            │
│    └───────────────┘  └───────────────┘  └───────────────┘            │
│                                                                         │
│    ┌───────────────┐  ┌───────────────┐  ┌───────────────┐            │
│    │    1 Year     │  │  Anniversary  │  │   Custom 📅   │            │
│    │   Dec 28 2026 │  │   [Date]      │  │               │            │
│    └───────────────┘  └───────────────┘  └───────────────┘            │
│                                                                         │
│    ────────────────────────────────────────────────────────            │
│                                                                         │
│              [Calendar picker appears when Custom selected]             │
│                                                                         │
│                                                                         │
│                              ┌───────────────┐                          │
│                              │     Next →    │                          │
│                              └───────────────┘                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Step 2: Write Message

**Rich Text Area:**
- Placeholder: "Write a message to your future selves..."
- Min-height: 300px
- Formatting options: Bold, Italic, Emoji picker
- Optional: Add photos (up to 5)

### Step 3: Preview

**Full Capsule Preview:**
- Shows exactly how it will appear when opened
- Date display
- Message preview
- Attached photos
- "This is what you'll see on [Date]"

### Step 4: Seal

**Sealing Animation Sequence:**
1. Capsule appears with open lid
2. Content flows into capsule
3. Lid closes with satisfying sound
4. Wax seal stamps down with impact
5. Lock clicks (haptic feedback on mobile)
6. Countdown begins

```css
@keyframes seal-stamp {
  0% {
    transform: translateY(-100px) scale(2) rotate(-20deg);
    opacity: 0;
  }
  60% {
    transform: translateY(10px) scale(1.1) rotate(5deg);
    opacity: 1;
  }
  80% {
    transform: translateY(-5px) scale(0.95) rotate(-2deg);
  }
  100% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
  }
}
```

---

# 5. DREAM BUILDER — Complete Page Specifications

## 5.1 Dreams List (`/connect/dream-builder`)

### Dream Card Design

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│    ┌───────────────────────────────────────────────────────────────┐   │
│    │                                                               │   │
│    │  🏠  Our First Home Together                                  │   │
│    │      ──────────────────────────────────────                   │   │
│    │                                                               │   │
│    │      Target: June 2026                                        │   │
│    │                                                               │   │
│    │      ████████████████░░░░░░░░░░░░░░░░  62%                    │   │
│    │                                                               │   │
│    │      Milestones:                                              │   │
│    │      ✓ Save for down payment                                  │   │
│    │      ✓ Research neighborhoods                                 │   │
│    │      ○ Get pre-approved                                       │   │
│    │      ○ Start house hunting                                    │   │
│    │      ○ Make an offer                                          │   │
│    │                                                               │   │
│    │      Last updated by [Partner]: 2 days ago                    │   │
│    │                                                               │   │
│    └───────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Category Icons

| Category | Icon | Color Accent |
|----------|------|--------------|
| Home | 🏠 | --clay |
| Travel | ✈️ | --mist |
| Career | 💼 | Gold |
| Family | 👨‍👩‍👧 | Rose |
| Health | 🏃 | Teal |
| Finance | 💰 | Green |
| Adventure | 🏔️ | --mist |
| Creative | 🎨 | --clay |
| Education | 📚 | Blue |
| Relationship | 💕 | --clay |

### Progress Bar Design

**Visual Treatment:**
```css
.dream-progress {
  height: 8px;
  border-radius: 4px;
  background: rgba(255,255,255,0.1);
  overflow: hidden;
}

.dream-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--clay), var(--mist));
  border-radius: 4px;
  transition: width 600ms var(--easing);
}
```

---

## 5.2 Milestone Checklist

### Interactive Milestone Item

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│    ┌────────────────────────────────────────────────────────────────┐  │
│    │                                                                │  │
│    │  ○  Get pre-approved for mortgage                              │  │
│    │     ─────────────────────────────────                          │  │
│    │     Added by [Partner] • Due: March 2026                       │  │
│    │                                                                │  │
│    │     Notes: "We should do this before we start looking"         │  │
│    │                                                                │  │
│    │     [Mark Complete]  [Edit]  [Remove]                          │  │
│    │                                                                │  │
│    └────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Checkbox Animation:**
```css
.milestone-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-highlight);
  border-radius: 50%;
  transition: all var(--dur) var(--easing);
}

.milestone-checkbox.complete {
  background: var(--clay);
  border-color: var(--clay);
}

.milestone-checkbox.complete::after {
  content: "✓";
  color: var(--base);
  font-weight: 700;
}
```

**Completion Celebration:**
- Checkbox fills with spring animation
- Confetti particles burst from checkbox
- Line-through effect on text (800ms)
- Progress bar updates with smooth animation

---

# 6. DAILY RITUALS — Complete Page Specifications

## 6.1 Rituals Home (`/connect/rituals`)

### Ritual Cards

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back                    Daily Rituals                               │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │                                                                    ││
│  │  ☀️  Morning Hello                                                 ││
│  │      Start your partner's day with love                            ││
│  │                                                                    ││
│  │      ✓ Completed today at 7:42 AM                                  ││
│  │      🔥 12-day streak                                              ││
│  │                                                                    ││
│  └────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │                                                                    ││
│  │  💜  Gratitude                                                     ││
│  │      Share something you're grateful for about each other          ││
│  │                                                                    ││
│  │      ⏳ Waiting for [Partner] to complete                          ││
│  │      You completed at 8:15 AM                                      ││
│  │                                                                    ││
│  └────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │                                                                    ││
│  │  🌙  Goodnight                                                     ││
│  │      End the day together, even apart                              ││
│  │                                                                    ││
│  │      ○ Not yet completed                                           ││
│  │      Best time: 10:30 PM (partner's timezone)                      ││
│  │                                                                    ││
│  └────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐│
│  │                                                                    ││
│  │  💭  Thinking of You                                               ││
│  │      Send a quick "I'm thinking of you" anytime                    ││
│  │                                                                    ││
│  │      [Send Now 💝]                                                 ││
│  │                                                                    ││
│  └────────────────────────────────────────────────────────────────────┘│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Ritual Card States

**Available (Can Complete):**
- Border: Default subtle
- Icon: Normal color
- CTA button visible

**Completed:**
- Border: Subtle green tint
- Checkmark badge
- Completion time shown
- Streak counter if applicable

**Waiting for Partner:**
- Border: Subtle mist glow (pulsing)
- Hourglass or waiting indicator
- "You completed at [time]" shown

**Locked (Time-based):**
- Border: Default subtle
- "Best time: [time]" shown
- Grayed out slightly

---

## 6.2 Gratitude Reveal

### Side-by-Side Reveal
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                   Today's Gratitude 💜                                  │
│                                                                         │
│  ┌────────────────────────────┐    ┌────────────────────────────┐      │
│  │                            │    │                            │      │
│  │     [Your Avatar]          │    │     [Partner Avatar]       │      │
│  │                            │    │                            │      │
│  │  "I'm grateful for how     │    │  "I'm grateful that you    │      │
│  │   you always know when     │    │   made me coffee this      │      │
│  │   I need a hug, even       │    │   morning without me       │      │
│  │   from 3,000 miles away."  │    │   having to ask."          │      │
│  │                            │    │                            │      │
│  └────────────────────────────┘    └────────────────────────────┘      │
│                                                                         │
│                     ❤️ Both about small acts of love                   │
│                                                                         │
│       ┌─────────────────┐    ┌─────────────────┐                      │
│       │  Save to Moments │    │   Reply 💬      │                      │
│       └─────────────────┘    └─────────────────┘                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# Component Library Summary

## Buttons

| Type | Use Case | Style |
|------|----------|-------|
| Primary | Main actions (Submit, Send, Together) | Clay background, dark text |
| Secondary | Alternative actions (Skip, Cancel) | Ghost with clay border |
| Ghost | Tertiary actions (Back, Later) | Transparent, subtle border |
| Danger | Destructive (Delete, Remove) | Red tint background |
| Premium | Upgrade prompts | Gradient clay-to-mist |

## Cards

| Type | Use Case | Style |
|------|----------|-------|
| Surface | Default containers | Subtle gradient, subtle border |
| Interactive | Clickable items (game tiles) | Hover lift, glow on hover |
| Featured | Hero cards | Larger, prominent border glow |
| Compact | List items | Reduced padding |

## Form Elements

| Type | Style |
|------|-------|
| Text Input | Dark background, subtle border, mist focus glow |
| Textarea | Same as input, auto-grow |
| Select | Custom dropdown with surface background |
| Checkbox | Circular, clay fill on check |
| Toggle | Pill shape, clay/mist accent |

## Feedback States

| State | Visual Treatment |
|-------|------------------|
| Loading | Skeleton shimmer or spinner |
| Empty | Illustration + CTA |
| Error | Red border + inline message |
| Success | Green checkmark + toast |
| Waiting | Pulsing dots + partner name |

---

# Animation Reference

## Page Transitions
- Fade + slide (20px) from direction of navigation
- Duration: 300ms
- Easing: cubic-bezier(0.16, 1, 0.3, 1)

## Element Reveals
- Stagger children by 50ms
- Fade up (10px) and scale (0.98 → 1)
- Duration: 400ms

## Interactive Feedback
- Buttons: Scale 0.98 on press, 1.02 on hover
- Cards: TranslateY -4px on hover
- Checkboxes: Spring scale with confetti

## Celebrations
- Confetti: 20-30 particles, random trajectories
- Hearts: Float upward with wobble
- Sparkles: Radiate from center point

---

*This document provides complete design specifications for all game pages.*
*Use in conjunction with CLOSER_MASTER_SPECIFICATION.md for full context.*
*All designs should maintain the intimate, premium aesthetic established in `closer_world_class_premium_dashboard_refined_2026_clean.html`.*
