# CLOSER — Complete Pages Specification
## Detailed Page-by-Page Design & Interaction Guide

---

# Table of Contents

1. [Design DNA & System Overview](#design-dna--system-overview)
2. [Navigation Architecture](#navigation-architecture)
3. [Core Views](#core-views)
   - [Home View](#1-home-view)
   - [Connect View](#2-connect-view)
   - [Messages View](#3-messages-view)
   - [Moments View](#4-moments-view)
   - [Us View](#5-us-view)
4. [Game & Activity Pages](#game--activity-pages)
5. [Authentication Pages](#authentication-pages)
6. [Settings & Profile Pages](#settings--profile-pages)
7. [Modal & Overlay Specifications](#modal--overlay-specifications)
8. [Animation & Interaction Library](#animation--interaction-library)
9. [Component Specifications](#component-specifications)
10. [Responsive Breakpoints](#responsive-breakpoints)
11. [Next.js Implementation Guide](#nextjs-implementation-guide)

---

# Design DNA & System Overview

Source of truth (do not drift):
- `closer_world_class_premium_dashboard_refined_2026_clean.html` (golden UI reference)
- `CLOSER_DESIGN_DNA.md` (frozen tokens + rules for Next.js)

## Color Palette

### Base Colors
```css
--base: #050505;           /* Deepest background */
--surface-0: #080808;      /* App shell / deepest surface */
--surface-1: #0E0E0E;      /* Primary surface */
--surface-2: #141414;      /* Higher contrast surface */
--surface-glass: rgba(20, 20, 20, 0.6);
```

### Accent Colors
```css
--clay: #e09f7d;           /* Primary warm accent (user 1) */
--clay-dark: #8a5a42;      /* Clay shadow */
--clay-glow: rgba(224, 159, 125, 0.2);  /* Clay ambient */

--mist: #c4b5fd;           /* Secondary cool accent (user 2) */
--mist-dark: #7c6eb0;      /* Mist shadow */
--mist-glow: rgba(196, 181, 253, 0.2);  /* Mist ambient */
```

### Text Colors
```css
--sand: #f5e6d3;           /* Primary text */
--stone: #9ca3af;          /* Secondary text */
--muted: rgba(245, 230, 211, 0.65);    /* Tertiary/metadata text */
```

### Border Colors
```css
--border-subtle: rgba(245, 230, 211, 0.06);    /* Default borders */
--border-highlight: rgba(245, 230, 211, 0.12); /* Hover/active borders */
--border-strong: rgba(245, 230, 211, 0.18);    /* Strong separators */
```

## Typography

### Font Families
```css
--font-sans: "Manrope", system-ui, -apple-system, sans-serif;
--font-serif: "Fraunces", ui-serif, Georgia, serif;
```

### Type Scale
```
Hero:        96-120px / Fraunces 200 italic
Title:       38-44px  / Fraunces 300
Subtitle:    24-28px  / Fraunces 400 italic
Heading:     18-20px  / Manrope 800
Body:        15px     / Manrope 400
Caption:     12-13px  / Manrope 600
Label:       10-11px  / Manrope 800 uppercase tracking-wide
```

## Spacing Scale
```css
--s-1: 4px;    --s-6: 24px;
--s-2: 8px;    --s-7: 32px;
--s-3: 12px;   --s-8: 40px;
--s-4: 16px;   --s-9: 48px;
--s-5: 20px;   --s-10: 64px;
```

## Border Radius Scale
```css
--r-sm: 12px;   /* Pills, small cards */
--r-md: 16px;   /* Buttons, inputs */
--r-lg: 24px;   /* Cards */
--r-xl: 32px;   /* Large cards, modals */
--r-2xl: 40px;  /* Featured hero surfaces */
```

## Shadow Scale
```css
--shadow-1: 0 10px 30px rgba(0,0,0,0.35);
--shadow-2: 0 20px 50px rgba(0,0,0,0.55);
--shadow-3: 0 30px 80px rgba(0,0,0,0.70);
```

## Motion
```css
--easing: cubic-bezier(0.16, 1, 0.3, 1);  /* Spring-like */
--dur-1: 140ms;  /* Micro-interactions */
--dur-2: 220ms;  /* Standard transitions */
--dur-3: 520ms;  /* Premium/hero motion */

--ring: 0 0 0 4px rgba(224, 159, 125, 0.22); /* Focus ring (V1) */
```

---

# Navigation Architecture

## Desktop Navigation (Sidebar)

### Structure
```
nav.nav-sidebar (92px width)
├── div.nav-logo ("C.")
│   └── ::after (accent dot indicator)
├── div.nav-items
│   ├── button.nav-item[data-view="home"]
│   ├── button.nav-item[data-view="moments"]
│   ├── button.nav-item[data-view="messages"]
│   ├── button.nav-item[data-view="connect"]
│   └── button.nav-item[data-view="us"]
└── div.keyboard-hints (optional)
```

### Nav Item States
| State | Background | Border | Color | Transform |
|-------|------------|--------|-------|-----------|
| Default | transparent | transparent | --stone | none |
| Hover | rgba(255,255,255,0.03) | transparent | --accent | translateY(-1px) |
| Active | rgba(255,255,255,0.03) | --border-highlight | --sand | none |
| Focus | rgba(255,255,255,0.03) | --ring | --sand | none |

### Hover Tooltip Animation
```
Initial: opacity: 0; transform: translateY(-50%);
On Hover: opacity: 1; transform: translateY(-50%) translateX(4px);
Duration: var(--dur-2)
Easing: var(--easing)
```

## Mobile Navigation (Bottom Bar)

### Structure
```
nav.nav-mobile
└── div.nav-mobile-inner (pill container)
    ├── button.nav-mobile-item[data-view="home"]
    ├── button.nav-mobile-item[data-view="moments"]
    ├── button.nav-mobile-item[data-view="messages"]
    ├── button.nav-mobile-item[data-view="connect"]
    └── button.nav-mobile-item[data-view="us"]
```

### Mobile Nav Specifications
- **Container**: Floating pill, 18px from bottom + safe-area-inset
- **Background**: rgba(15, 15, 15, 0.86) with backdrop-filter: blur(20px)
- **Border**: 1px solid --border-highlight
- **Border radius**: 26px
- **Item Size**: 50px × 50px
- **Gap**: 6px between items
- **Shadow**: --shadow-2

### Mobile Nav Item States
| State | Background | Color |
|-------|------------|-------|
| Default | transparent | --stone |
| Active | rgba(255,255,255,0.05) | --sand |
| Pressed | scale(0.98) | --sand |

### FUTURE ENHANCEMENT: Center Action Button
For premium "Book/Schedule" action in future versions:
```
Center item could be larger (56px) with:
- Primary gradient background
- Plus or calendar icon
- Elevated with stronger shadow
- Triggers quick action modal
```

---

# Core Views

## 1. Home View

### Page URL
```
/ (root)
```

### Layout Structure
```
section#home-view.view
└── div.container
    ├── div.timezone-pill
    ├── div.connection-visual
    ├── div.countdown-hero
    └── div.daily-card
```

### Component: Timezone Pill

**Purpose**: Shows both partners' local times, creating ambient awareness

**Structure**:
```html
<div class="timezone-pill glass">
  <div class="timezone-item">
    <span class="tz-time" id="time-sf">6:42 PM</span>
    <span class="tz-city">San Francisco</span>
  </div>
  <div class="timezone-divider"></div>
  <div class="timezone-item">
    <span class="tz-time" id="time-ny" style="color: var(--mist)">9:42 PM</span>
    <span class="tz-city">New York</span>
  </div>
</div>
```

**Specifications**:
- Width: Auto (content-based)
- Padding: 10px 18px
- Border-radius: 999px (full pill)
- Background: `.glass` surface (rgba(255,255,255,0.02) + blur(18px))
- Time format: 12-hour with AM/PM
- Update frequency: Every 1 second
- User 1 time: --sand color
- User 2 time: --mist color

**Animation**:
- Time changes: Fade transition (opacity 0→1, 200ms)

### Component: Connection Visual

**Purpose**: Animated representation of the couple's connection

**Structure**:
```html
<div class="connection-visual">
  <div class="connection-track"></div>
  <div class="connection-spark"></div>
  <div class="avatar me">M</div>
  <div class="avatar them">E</div>
</div>
```

**Avatar Specifications**:
- Size: 74px × 74px
- Border-radius: 50%
- Background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))
- Border: 1px solid --border-highlight (with per-user tint)
- Font: Fraunces 300, 28px

**Avatar "Me" (User 1)**:
- Text color: --clay
- Border color: rgba(224, 159, 125, 0.28)
- Glow animation: pulse-glow with rgba(224, 159, 125, 0.22)

**Avatar "Them" (User 2)**:
- Text color: --mist
- Border color: rgba(196, 181, 253, 0.28)
- Glow animation: pulse-glow with rgba(196, 181, 253, 0.22) (reversed)

**Connection Track**:
- Width: 220px
- Height: 1px
- Background: linear-gradient(90deg, transparent, --border-strong, transparent)

**Connection Spark Animation**:
```css
@keyframes traverse {
  0% { transform: translateX(-90px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(90px); opacity: 0; }
}
/* Duration: 4.4s, infinite, ease-in-out */
```

**Pulse Glow Animation**:
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 18px var(--glow-color); opacity: 1; }
  50% { box-shadow: 0 0 40px var(--glow-color); opacity: 0.86; }
}
/* Duration: 5.2s, infinite */
```

### Component: Countdown Hero

**Purpose**: Displays days until next visit with emotional impact

**Structure**:
```html
<div class="countdown-hero">
  <div class="visit-label">Next Visit in</div>
  <div class="days-display">
    <span class="days-num">12</span>
    <span class="days-text">days</span>
  </div>
</div>
```

**Specifications**:
- Label: 11px uppercase, tracking 0.22em, --accent color
- Number: 86-120px (responsive), Fraunces 200
- Number gradient: linear-gradient(to bottom, --sand, rgba(245,230,211,0.55))
- "days" text: 24px Fraunces italic, --stone color
- Positioned offset to the right of number

**When countdown reaches 0**:
- Number changes to "TODAY!"
- Special celebration animation triggers
- Confetti effect optional

**When countdown is negative**:
- Shows "X days since last visit"
- Color shifts to slightly muted

### Component: Daily Card

**Purpose**: Interactive card showing today's conversation prompt

**Structure**:
```html
<div class="daily-card card focus-ring" role="button" tabindex="0" data-navigate="connect">
  <div class="card-label">
    <i data-lucide="sparkles"></i>
    Daily Question
  </div>
  <h3 class="card-question text-balance">
    "What's a small moment from this week that you want to remember?"
  </h3>
  <div class="card-footer">
    <span class="card-cta">Tap to answer</span>
    <div class="avatar-stack">
      <!-- Avatar indicators showing who has answered -->
    </div>
  </div>
</div>
```

**Surface Effect**:
```css
/* Base surface is `.card` (see `CLOSER_DESIGN_DNA.md`) */
.card {
  background: linear-gradient(155deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012));
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-1);
}
```

**Hover State**:
- Transform: translateY(-4px)
- Border-color: --border-highlight
- CTA text lightens

**Avatar Stack Indicators**:
- Shows who has answered (filled dot) vs. pending (question mark)
- Stack overlaps with -8px margin
- User 1 answered: --clay background
- User 2 answered: --mist background
- Neither: "?" in muted style

**Click Behavior**:
1. Click triggers navigation to Connect view
2. Opens Intimacy Deck with today's question pre-selected
3. View transition animation plays

---

## 2. Connect View

### Page URL
```
/connect
```

### Layout Structure
```
section#connect-view.view
└── div.container
    ├── div.connect-header
    │   ├── div (title + subtitle)
    │   └── div.sync-status
    ├── section.featured-hero
    │   ├── div.featured-content
    │   └── div.featured-visual
    ├── section.grid-section (Play Together)
    │   └── div.games-grid
    └── section.grid-section (Rituals)
        └── div.rituals-list
```

### Component: Sync Status

**Purpose**: Indicates real-time connection between partners

**Structure**:
```html
<div class="sync-status">
  <div class="sync-dot"></div>
  <span class="sync-text">Sync Active</span>
</div>
```

**States**:
| State | Dot Color | Animation | Text |
|-------|-----------|-----------|------|
| Both Online | #10b981 (green) | pulse-green | "Sync Active" |
| Partner Offline | #f59e0b (amber) | none | "Partner Offline" |
| Disconnected | #ef4444 (red) | none | "Reconnecting..." |
| Syncing | #3b82f6 (blue) | spin | "Syncing..." |

### Component: Featured Hero (Intimacy Deck)

**Purpose**: Hero showcase for the primary Connect activity

**Layout**:
- Desktop: Side-by-side (content | visual)
- Mobile: Stacked (content above visual)
- Breakpoint: 860px

**Featured Badge**:
```html
<div class="featured-badge">Featured Experience</div>
```
- 10px uppercase, tracking 0.16em
- Color: --clay
- Border: 1px solid rgba(224,159,125,0.35)
- Background: rgba(224,159,125,0.06)

**Title**: "The Intimacy Deck"
- Font: Fraunces 32-44px italic
- Color: --sand

**Description**:
- 15px Manrope
- Color: --stone
- Line-height: 1.75
- Max-width: 420px

**Visual Side: Card Stack**

**Structure**:
```html
<div class="card-stack">
  <div class="stacked-card bottom"></div>
  <div class="stacked-card middle"></div>
  <div class="stacked-card top">
    <div class="card-back-pattern"></div>
    <div style="display: flex; height: 100%">
      <div class="deck-spine">
        <span class="deck-label-vertical">INTIMACY</span>
      </div>
      <div class="deck-visual-area">
        <div class="card-hearts-visual"><!-- Hearts --></div>
      </div>
    </div>
  </div>
</div>
```

**Card Stack Animation**:
```
Default State:
- Bottom: translateZ(-20px) rotate(-6deg), opacity 0.92
- Middle: translateZ(-10px) rotate(3deg), opacity 0.96
- Top: translateZ(0) rotate(0), opacity 1

Hover State:
- Bottom: translateZ(-44px) translateX(-22px) rotate(-11deg)
- Middle: translateZ(-22px) translateX(12px) rotate(6deg)
- Top: translateZ(22px) translateY(-10px), enhanced shadow
```

**Rising Hearts Animation**:
```css
@keyframes heart-rise-fade {
  0% { transform: translateY(22px) scale(0.65); opacity: 0; }
  20% { opacity: 0.35; }
  70% { opacity: 0.18; }
  100% { transform: translateY(-180px) scale(1.1); opacity: 0; }
}
/* 5 hearts with staggered delays: 0s, 1.6s, 3.1s, 4.7s, 2.3s */
```

### Component: Games Grid

**Purpose**: Grid of interactive couple activities

**Grid Specifications**:
- Grid: auto-fit, minmax(220px, 1fr)
- Gap: 16px

**Game Tile Structure**:
```html
<button class="game-tile">
  <div class="game-icon icon-clay">
    <i data-lucide="flame"></i>
  </div>
  <div>
    <div class="tile-title">Hot Takes</div>
    <div class="tile-desc">Spicy debates</div>
  </div>
</button>
```

**Games List**:

| Game | Icon | Color Class | Description | Page Link |
|------|------|-------------|-------------|-----------|
| Hot Takes | flame | icon-clay | Spicy debates | /connect/hot-takes |
| Would You Rather | git-pull-request | icon-mist | Tough choices | /connect/would-you-rather |
| Time Capsule | hourglass | icon-gold | Lock a message | /connect/time-capsule |
| Dream Builder | hammer | icon-sage | Future plans | /connect/dream-builder |

**Post‑V1 (not in V1 route map):**
- Truth or Dare (planned as its own activity later)
- 36 Questions (either a dedicated activity post‑V1 or a curated Intimacy Deck sequence)

**Icon Color Classes**:
```css
.icon-clay { background: rgba(224,159,125,0.12); color: var(--clay); }
.icon-mist { background: rgba(196,181,253,0.12); color: var(--mist); }
.icon-gold { background: rgba(212,175,55,0.12); color: #d4af37; }
.icon-sage { background: rgba(138,166,134,0.12); color: #8aa686; }
```

### Component: Rituals List

**Purpose**: Horizontal scrolling list of daily rituals

**Structure**:
```html
<div class="rituals-list no-scrollbar">
  <button class="ritual-pill">
    <i data-lucide="sun" style="color: var(--clay)"></i>
    <span class="ritual-name">Morning Hello</span>
  </button>
  <!-- More pills -->
</div>
```

**Rituals List**:

| Ritual | Icon | Color | Time Suggestion | Action |
|--------|------|-------|-----------------|--------|
| Morning Hello | sun | --clay | 6-9am | Quick greeting message |
| Gratitude | smile | --mist | Anytime | Share what you're grateful for |
| Goodnight | moon | --mist | 9pm-12am | End of day message |
| Thinking of You | heart | --clay | Anytime | Quick "thinking of you" tap |
| Weekly Check-in | calendar | --sand | Sunday | Deeper conversation prompt |

**Ritual Click Flow**:
1. Click ritual pill
2. Opens ritual modal/page
3. Quick action interface appears
4. One-tap or brief input
5. Sent to partner
6. Confirmation animation

---

## 3. Messages View

### Page URL
```
/messages
```

### Layout Structure
```
section#messages-view.view
└── div.container.chat-container
    ├── div.chat-header-refined
    ├── div.chat-thread
    └── div.chat-input-refined
```

### Component: Chat Header

**Structure**:
```html
<div class="chat-header-refined">
  <div class="chat-info">
    <div class="chat-avatar-lg">E</div>
    <div>
      <h3>Emma</h3>
      <span class="chat-status-text">
        <span class="chat-status-dot"></span>
        Online now
      </span>
    </div>
  </div>
  <button class="icon-btn" aria-label="More options">
    <i data-lucide="more-horizontal"></i>
  </button>
</div>
```

**Status Options**:
| Status | Dot Color | Text | Animation |
|--------|-----------|------|-----------|
| Online | --clay | "Online now" | pulse glow |
| Away | --mist | "Away" | none |
| Typing | --clay | "Typing..." | bounce dots |
| Last seen | none | "Last seen 2h ago" | none |

### Component: Chat Thread

**Structure**:
```html
<div class="chat-thread no-scrollbar">
  <div class="chat-date">Yesterday</div>
  <div class="chat-bubble them">Message text...</div>
  <div class="chat-bubble me">
    Message text...
    <div class="read-receipt">Read 9:45 PM ✓✓</div>
  </div>
  <div class="chat-date">Today</div>
  <div class="whisper-container">...</div>
</div>
```

**Message Types**:

#### 1. Text Message (Partner)
```html
<div class="chat-bubble them">
  I was just looking at the moon and thinking of you.
</div>
```
- Background: rgba(255,255,255,0.04)
- Border: 1px solid --border-subtle
- Border-radius: 22px (bottom-left: 6px)
- Max-width: 78%
- Align: left

#### 2. Text Message (Me)
```html
<div class="chat-bubble me">
  I'm looking at it too. It's beautiful tonight.
  <div class="read-receipt">
    Read 9:45 PM
    <i data-lucide="check-check"></i>
  </div>
</div>
```
- Background: linear-gradient(135deg, rgba(224,159,125,0.18), rgba(224,159,125,0.06))
- Border: 1px solid rgba(224,159,125,0.14)
- Border-radius: 22px (bottom-right: 6px)
- Max-width: 78%
- Align: right (align-self: flex-end)

#### 3. Whisper Message
```html
<div class="whisper-container" role="button" tabindex="0">
  <div class="whisper-label">
    <i data-lucide="eye-off"></i>
    Hold to Reveal
  </div>
  <div class="whisper-content">
    I found that book you were looking for! Surprise!
  </div>
</div>
```

**Whisper Interaction**:
- Default: Content blurred (filter: blur(7px)), opacity 0.55
- Reveal triggers: hover (desktop), hold 500ms (mobile), Space/Enter (keyboard)
- On reveal: blur(0), opacity 1
- Label fades out on reveal
- Sound effect (optional): soft reveal chime

**Whisper Animation**:
```css
.whisper-content {
  filter: blur(7px);
  opacity: 0.55;
  transition: filter 800ms var(--easing), opacity 800ms var(--easing);
}

.whisper-container:hover .whisper-content,
.whisper-container.reveal .whisper-content {
  filter: blur(0);
  opacity: 1;
}
```

#### 4. Voice Note
```html
<div class="chat-bubble me voice-note">
  <button class="play-btn">
    <i data-lucide="play"></i>
  </button>
  <div class="waveform"><!-- Canvas or SVG --></div>
  <span class="duration">0:42</span>
</div>
```

#### 5. Photo Message
```html
<div class="chat-bubble me photo-bubble">
  <img src="..." alt="Shared photo" />
  <span class="photo-time">9:45 PM</span>
</div>
```

### Component: Chat Input

**Structure**:
```html
<div class="chat-input-refined">
  <button class="icon-btn" aria-label="Attach">
    <i data-lucide="plus"></i>
  </button>
  <input type="text" class="chat-input-field" placeholder="Message Emma…" />
  <button class="icon-btn" aria-label="Voice message">
    <i data-lucide="mic"></i>
  </button>
  <button class="icon-btn send-btn" aria-label="Send" disabled>
    <i data-lucide="send"></i>
  </button>
</div>
```

**Input States**:
| State | Border | Background | Action |
|-------|--------|------------|--------|
| Empty | --border-subtle | default | Send disabled |
| Typing | --border-highlight | default | Send enabled |
| Recording | --clay border | red pulse | Stop button shows |

**Attachment Menu (Plus Button)**:
```
Opens bottom sheet / popover with:
├── Photo/Video
├── Voice Note
├── Whisper Message
├── GIF
├── Moment (share from timeline)
└── Game Invite
```

**Voice Recording Flow**:
1. Press mic button
2. Recording starts, waveform shows
3. Button changes to stop icon
4. Release/tap stop to send
5. Cancel by swiping left

---

## 4. Moments View

### Page URL
```
/moments
```

### Layout Structure
```
section#moments-view.view
└── div.container
    ├── div.page-header
    ├── div.calendar-strip
    └── div.timeline-feed
        └── div.timeline-group (repeated)
```

### Component: Calendar Strip

**Structure**:
```html
<div class="calendar-strip no-scrollbar">
  <div class="cal-day" role="button" tabindex="0">
    <span class="cal-name">Mon</span>
    <div class="cal-num">9</div>
  </div>
  <div class="cal-day active">
    <span class="cal-name">Wed</span>
    <div class="cal-num">11</div>
  </div>
  <!-- More days -->
</div>
```

**Day States**:
| State | Opacity | Number Background |
|-------|---------|-------------------|
| Default | 0.55 | transparent |
| Hover | 0.9 | transparent |
| Active (selected) | 1 | --sand (inverted) |
| Has moments | 1 | dot indicator |

**Navigation**:
- Swipe horizontally to see more days
- Tap to jump to that day's moments
- Today is always visible and highlighted

### Component: Timeline Feed

**Structure**:
```html
<div class="timeline-feed">
  <div class="timeline-group">
    <div class="date-header">
      <span class="date-text">Today</span>
      <div class="date-line"></div>
    </div>
    <!-- Moments for this date -->
  </div>
</div>
```

### Moment Types

#### 1. Photo Moment (Polaroid Style)

**Structure**:
```html
<div class="photo-card">
  <img src="..." alt="Morning Coffee" class="photo-img" loading="lazy" />
  <div class="photo-caption">
    <span>Morning Coffee</span>
    <span style="font-size: 10px; color: #6b7280">9:42 AM</span>
  </div>
</div>
```

**Specifications**:
- Background: rgba(255,255,255,0.98) (white)
- Padding: 12px 12px 18px 12px
- Border-radius: 18px
- Transform: rotate(-0.8deg) for organic feel
- Hover: rotate(0deg) scale(1.02)
- Image aspect-ratio: 1:1
- Image border-radius: 10px
- Image filter: contrast(1.08) saturate(0.92) for film look

**Caption**:
- Font: ui-monospace, 13px
- Color: #1f2937 (dark gray on white)
- Padding: 0 6px

**Photo Modal** (on click):
- Full-screen view
- Swipe between photos
- Caption overlay
- Download option
- Delete option (creator only)

#### 2. Song Moment

**Structure**:
```html
<div class="song-card">
  <div class="song-art">
    <i data-lucide="music"></i>
  </div>
  <div class="song-details">
    <h4>Until I Found You</h4>
    <p>Stephen Sanchez</p>
  </div>
  <div class="equalizer">
    <div class="bar" style="animation-delay: 0s"></div>
    <div class="bar" style="animation-delay: 0.22s"></div>
    <div class="bar" style="animation-delay: 0.44s"></div>
  </div>
</div>
```

**Equalizer Animation**:
```css
@keyframes equalize {
  0%, 100% { height: 4px; opacity: 0.7; }
  50% { height: 16px; opacity: 1; }
}
/* Duration: 1.05s, infinite, ease-in-out */
/* Staggered delays for natural feel */
```

**Song Card Interaction**:
- Tap to expand with Spotify/Apple Music preview
- Share to Spotify option
- Save to shared playlist

#### 3. Quote/Answer Moment

**Structure**:
```html
<div class="daily-card surface" style="padding: 24px">
  <div class="card-label">Saved Answer</div>
  <p class="quote-text">
    "I love our shared sense of humor. Nobody makes me laugh like you do."
  </p>
</div>
```

**Source Badge Options**:
- "Saved Answer" - from daily questions
- "Hot Take" - from debate game
- "Intimacy Card" - from deck
- "Whisper" - saved whisper
- "Manual" - user-added quote

#### 4. Milestone Moment

**Structure**:
```html
<div class="milestone-card surface">
  <div class="milestone-icon">
    <i data-lucide="heart"></i>
  </div>
  <div class="milestone-content">
    <h4>100 Days Together</h4>
    <p>December 15, 2025</p>
  </div>
</div>
```

**Milestone Types**:
- Anniversary markers
- Streak achievements
- First message
- First photo
- Custom milestones

### Add Moment FAB

**Structure** (Mobile):
```html
<button class="fab-add-moment">
  <i data-lucide="plus"></i>
</button>
```

**Position**: Fixed, bottom-right (above mobile nav)
**Size**: 56px × 56px
**Background**: --sand
**Color**: --base
**Shadow**: 0 8px 24px rgba(0,0,0,0.4)

**Add Moment Menu**:
```
Opens radial/bottom sheet:
├── Photo
├── Song
├── Quote
└── Milestone
```

---

## 5. Us View

### Page URL
```
/us
/profile
```

### Layout Structure
```
section#us-view.view
└── div.container
    ├── div.page-header
    ├── div.profile-stats
    ├── div.achievements-preview (optional)
    └── div.settings-list
```

### Component: Profile Stats

**Structure**:
```html
<div class="profile-stats">
  <div class="stat-box">
    <span class="stat-num">14</span>
    <span class="stat-label">Day Streak</span>
  </div>
  <div class="stat-box">
    <span class="stat-num">452</span>
    <span class="stat-label">Answers</span>
  </div>
  <div class="stat-box">
    <span class="stat-num">89</span>
    <span class="stat-label">Days Together</span>
  </div>
  <div class="stat-box">
    <span class="stat-num">156</span>
    <span class="stat-label">Moments</span>
  </div>
</div>
```

**Grid**: 2 columns
**Stat Number**: Fraunces 36px, 300 weight
**Stat Label**: 11px uppercase, tracking 0.18em

### Component: Settings List

**Structure**:
```html
<nav class="settings-list">
  <a href="/us/edit-profile" class="settings-item">
    <i data-lucide="user"></i>
    <span>Edit Profile</span>
    <i data-lucide="chevron-right"></i>
  </a>
  <a href="/us/partner" class="settings-item">
    <i data-lucide="heart"></i>
    <span>Partner Settings</span>
    <i data-lucide="chevron-right"></i>
  </a>
  <!-- More items -->
</nav>
```

**Settings Menu Items**:

| Item | Icon | Link | Description |
|------|------|------|-------------|
| Edit Profile | user | /us/edit-profile | Avatar, name, timezone |
| Partner Settings | heart | /us/partner | Anniversary, next visit |
| Notifications | bell | /us/notifications | Push, email preferences |
| Privacy | lock | /us/privacy | Visibility, data |
| Subscription | credit-card | /us/subscription | Plan, billing |
| Theme | palette | /us/theme | Color customization |
| Help & Support | help-circle | /us/help | FAQ, contact |
| About | info | /us/about | Version, credits |
| Log Out | log-out | - | Confirmation modal |

---

# Game & Activity Pages

## The Intimacy Deck

### Page URL
```
/connect/intimacy-deck
```

### Sub-pages
```
/connect/intimacy-deck                 # Main deck view
/connect/intimacy-deck/draw            # Active card session
/connect/intimacy-deck/history         # Past questions
/connect/intimacy-deck/favorites       # Saved favorites
/connect/intimacy-deck/categories      # Category selection
/connect/intimacy-deck/custom          # Custom deck (premium)
```

### Main Deck Page

**Layout**:
```
├── Header (back button, title, menu)
├── Card Stack (interactive)
├── Category Filter Pills
├── Draw Button (primary CTA)
├── Stats Bar (cards drawn, answered)
└── Recent Activity Preview
```

### Draw Card Modal/Page

**Structure**:
```html
<div class="card-draw-container">
  <div class="card-question-display">
    <div class="category-badge">Deep Connection</div>
    <h2 class="question-text">
      "What's something you've never told anyone else?"
    </h2>
    <div class="card-number">#47 of 150</div>
  </div>

  <div class="answer-section">
    <textarea placeholder="Your answer..."></textarea>
    <button class="btn btn-primary">Submit Answer</button>
  </div>

  <div class="partner-status">
    <span>Emma is answering...</span>
    <!-- or -->
    <span>Waiting for Emma</span>
  </div>
</div>
```

**Card Draw Animation**:
1. Card flies from deck position
2. Flips 180° to reveal question
3. Lands in center of screen
4. Subtle glow pulse on arrival

**Answer Flow**:
1. User types answer
2. Submits answer
3. Waiting state shows while partner answers
4. Both answers revealed simultaneously
5. Option to save to Moments
6. Option to discuss further (opens chat)

**Reveal Animation**:
```
Both answers hidden initially (blurred)
↓
Countdown: 3... 2... 1...
↓
Answers slide in from opposite sides
↓
Celebration animation if both answered
```

### Category System

**Categories**:
| Category | Color | Icon | Card Count | Description |
|----------|-------|------|------------|-------------|
| Icebreakers | green | snowflake | 25 | Light, fun starters |
| Getting to Know | blue | search | 30 | Discovery questions |
| Memories | amber | clock | 25 | Past reflections |
| Dreams | purple | sparkles | 20 | Future aspirations |
| Deep Connection | red | heart | 25 | Vulnerability prompts |
| Spicy | pink | flame | 25 | Intimate topics |

**Category Lock (Free Tier)**:
- Icebreakers: Unlocked
- Getting to Know: Unlocked
- Others: 5 free draws, then locked
- Premium: All unlocked

---

## Hot Takes

### Page URL
```
/connect/hot-takes
```

### Gameplay

**Structure**:
```html
<div class="hot-takes-game">
  <div class="topic-card">
    <h2>"Pineapple belongs on pizza"</h2>
  </div>

  <div class="voting-buttons">
    <button class="vote-btn agree">
      <i data-lucide="thumbs-up"></i>
      Agree
    </button>
    <button class="vote-btn disagree">
      <i data-lucide="thumbs-down"></i>
      Disagree
    </button>
  </div>

  <div class="results-preview hidden">
    <!-- Shows after both vote -->
  </div>
</div>
```

**Vote Animation**:
1. Tap Agree/Disagree
2. Button scales up slightly
3. Selected option glows
4. Waiting for partner indicator
5. Results reveal with bar chart

**Results Display**:
```html
<div class="hot-takes-result">
  <div class="result-bar">
    <div class="agree-bar" style="width: 50%">You</div>
    <div class="disagree-bar" style="width: 50%">Emma</div>
  </div>
  <div class="match-indicator mismatch">
    Different opinions! Discuss?
  </div>
  <button class="btn">Start Discussion</button>
</div>
```

**Topic Categories**:
- Lifestyle
- Relationships
- Food
- Pop Culture
- Controversial (locked premium)

---

## Would You Rather

### Page URL
```
/connect/would-you-rather
```

### Gameplay

**Structure**:
```html
<div class="wyr-game">
  <h2 class="vs-text">Would you rather...</h2>

  <div class="wyr-options">
    <button class="wyr-option">
      <span class="option-text">Never eat your favorite food again</span>
    </button>

    <div class="vs-divider">OR</div>

    <button class="wyr-option">
      <span class="option-text">Only eat your favorite food forever</span>
    </button>
  </div>
</div>
```

**Selection Animation**:
1. Tap option
2. Option expands, other shrinks
3. Your choice locks in
4. Partner choice reveals
5. Match celebration or mismatch discussion

---

## Time Capsule

### Page URL
```
/connect/time-capsule
```

### Sub-pages
```
/connect/time-capsule                          # All capsules (tabs: active, opened)

# Create flow (step routes)
/connect/time-capsule/create/date              # Step 1: Choose open date
/connect/time-capsule/create/message           # Step 2: Write message
/connect/time-capsule/create/media             # Step 3: Add media
/connect/time-capsule/create/preview           # Step 4: Preview
/connect/time-capsule/sealed                   # Sealed confirmation

# Capsule detail
/connect/time-capsule/[id]                     # Locked capsule view
/connect/time-capsule/[id]/opened              # Opened capsule reveal

# Optional redirect
/connect/time-capsule/create                   -> /connect/time-capsule/create/date
```

### Create Capsule Flow

**Step 1: Choose Date**
```html
<div class="capsule-date-picker">
  <h2>When should this open?</h2>

  <div class="date-presets">
    <button>1 Week</button>
    <button>1 Month</button>
    <button>6 Months</button>
    <button>1 Year</button>
    <button>Custom</button>
  </div>

  <input type="date" class="custom-date" />
</div>
```

**Step 2: Compose Message**
```html
<div class="capsule-compose">
  <textarea placeholder="Dear future us..."></textarea>

  <div class="capsule-add-media">
    <button>Add Photo</button>
    <button>Add Voice Note</button>
  </div>
</div>
```

**Step 3: Seal Capsule**
```html
<div class="capsule-seal">
  <div class="capsule-preview">
    <div class="capsule-icon sealed">🔒</div>
    <p>Opens on: January 15, 2026</p>
    <p>In 30 days</p>
  </div>

  <button class="btn btn-primary">Seal Time Capsule</button>
</div>
```

**Seal Animation**:
1. Message card folds into envelope
2. Envelope seals with wax stamp effect
3. Lock icon appears
4. Capsule flies to storage
5. Confirmation with countdown

### Capsule Unlock

**Notification**: Push notification on unlock day

**Unlock Animation**:
1. Capsule appears with glow
2. Tap to unlock
3. Wax seal breaks
4. Message unfolds
5. Both partners read together (synced)

---

## Dream Builder

### Page URL
```
/connect/dream-builder
```

### Sub-pages
```
/connect/dream-builder                         # All dreams

# Create flow (step routes)
/connect/dream-builder/create/category          # Step 1: Choose category
/connect/dream-builder/create/define            # Step 2: Define the dream
/connect/dream-builder/create/timeline          # Step 3: Target date + timeline
/connect/dream-builder/create/milestones        # Step 4: Milestones builder
/connect/dream-builder/create/confirm           # Step 5: Preview + create

# Dream detail
/connect/dream-builder/[id]                     # Dream detail
/connect/dream-builder/[id]/edit                # Edit dream
/connect/dream-builder/completed                # Completed dreams archive

# Optional redirect
/connect/dream-builder/create                   -> /connect/dream-builder/create/category
```

### Dream Categories

| Category | Icon | Example Goals |
|----------|------|---------------|
| Travel | plane | "Visit Japan together" |
| Home | home | "Get our first apartment" |
| Career | briefcase | "Start a business" |
| Family | users | "Adopt a dog" |
| Adventure | compass | "Learn to scuba dive" |
| Financial | piggy-bank | "Save $10,000" |

### Create Dream Flow

**Step 1: Category** (`/connect/dream-builder/create/category`)
```html
<div class="dream-categories">
  <h2>What kind of dream?</h2>
  <div class="category-grid">
    <!-- Category buttons -->
  </div>
</div>
```

**Step 2: Define Dream** (`/connect/dream-builder/create/define`)
```html
<div class="dream-define">
  <textarea placeholder="We dream of..."></textarea>
</div>
```

**Step 3: Timeline** (`/connect/dream-builder/create/timeline`)

```html
<div class="dream-timeline">
  <h3>When do you want to complete this?</h3>
  <input type="date" placeholder="Target date (optional)" />
  <div class="helper">You can skip this — it’s okay to dream without deadlines.</div>
</div>
```

**Step 4: Set Milestones** (`/connect/dream-builder/create/milestones`)
```html
<div class="dream-milestones">
  <h3>Break it into steps</h3>
  <div class="milestone-list">
    <input placeholder="First step..." />
    <button class="add-milestone">+ Add Step</button>
  </div>
</div>
```

### Dream Progress Tracking

**Progress Card**:
```html
<div class="dream-card">
  <div class="dream-header">
    <i data-lucide="plane"></i>
    <h3>Visit Japan</h3>
  </div>

  <div class="progress-bar">
    <div class="progress-fill" style="width: 40%"></div>
  </div>
  <span class="progress-text">2 of 5 milestones</span>

  <div class="milestone-checklist">
    <label><input type="checkbox" checked /> Save $2000</label>
    <label><input type="checkbox" checked /> Get passports</label>
    <label><input type="checkbox" /> Book flights</label>
    <label><input type="checkbox" /> Plan itinerary</label>
    <label><input type="checkbox" /> Go!</label>
  </div>
</div>
```

---

# Authentication Pages

## Login Page

### Page URL
```
/login
```

### Structure
```html
<div class="auth-container">
  <div class="auth-header">
    <div class="logo">C.</div>
    <h1>Welcome back</h1>
    <p>Sign in to continue your journey</p>
  </div>

  <form class="auth-form">
    <div class="form-group">
      <label>Email</label>
      <input type="email" placeholder="your@email.com" />
    </div>

    <div class="form-group">
      <label>Password</label>
      <input type="password" placeholder="••••••••" />
    </div>

    <a href="/forgot-password" class="forgot-link">Forgot password?</a>

    <button class="btn btn-primary full-width">Sign In</button>
  </form>

  <div class="auth-divider">
    <span>or continue with</span>
  </div>

  <div class="social-auth">
    <button class="social-btn google">
      <img src="/icons/google.svg" alt="Google" />
      Google
    </button>
    <button class="social-btn apple">
      <img src="/icons/apple.svg" alt="Apple" />
      Apple
    </button>
  </div>

  <p class="auth-footer">
    Don't have an account? <a href="/signup">Sign up</a>
  </p>
</div>
```

## Signup Page

### Page URL
```
/signup
```

### Fields
- Email
- Password (with requirements)
- Confirm Password
- Name
- Checkbox: Terms acceptance

### After Signup Flow
1. Email verification sent
2. Redirect to /verify-email
3. Upon verification → /onboarding

## Onboarding Flow

### Page URLs
```
/onboarding/profile            # Step 1: Profile setup
/onboarding/partner            # Step 2: Partner invite
/onboarding/setup              # Step 3: Timezone + anniversary + complete

# Optional redirects/aliases (to keep older references valid)
/onboarding                    -> /onboarding/profile
/onboarding/timezone           -> /onboarding/setup   # (state: timezone)
/onboarding/anniversary        -> /onboarding/setup   # (state: anniversary)
/onboarding/complete           -> /onboarding/setup   # (state: complete)
```

### Step 1: Profile Setup
```html
<div class="onboard-step">
  <h2>Let's set up your profile</h2>

  <div class="avatar-upload">
    <div class="avatar-preview">
      <!-- Upload area -->
    </div>
    <button>Upload Photo</button>
  </div>

  <div class="form-group">
    <label>Your Name</label>
    <input type="text" placeholder="How your partner knows you" />
  </div>
</div>
```

### Step 2: Partner Invite
```html
<div class="onboard-step">
  <h2>Invite your partner</h2>

  <div class="invite-code">
    <p>Share this code:</p>
    <div class="code-display">LOVE-7X9K</div>
    <button class="copy-btn">Copy</button>
  </div>

  <div class="divider">or</div>

  <div class="have-code">
    <p>Have a code?</p>
    <input type="text" placeholder="Enter partner's code" />
    <button>Connect</button>
  </div>
</div>
```

### Step 3: Setup (`/onboarding/setup`)

#### 3A: Timezone
```html
<div class="onboard-step">
  <h2>Where are you?</h2>

  <select class="timezone-select">
    <option>America/Los_Angeles (PST)</option>
    <option>America/New_York (EST)</option>
    <!-- All timezones -->
  </select>

  <div class="partner-timezone">
    <p>Emma is in:</p>
    <select><!-- Partner timezone --></select>
  </div>
</div>
```

#### 3B: Anniversary
```html
<div class="onboard-step">
  <h2>When did your story begin?</h2>

  <input type="date" class="anniversary-picker" />

  <div class="optional-field">
    <label>Next visit date (optional)</label>
    <input type="date" />
  </div>
</div>
```

#### 3C: Complete
```html
<div class="onboard-complete">
  <div class="celebration-animation">
    <!-- Confetti, hearts -->
  </div>

  <h2>You're all set!</h2>
  <p>Welcome to Closer</p>

  <button class="btn btn-primary">Start Exploring</button>
</div>
```

---

# Settings & Profile Pages

## Edit Profile

### Page URL
```
/us/edit-profile
```

### Sections
- Avatar upload/change
- Display name
- Bio/About
- Timezone
- Email (read-only, link to change)
- Password change link

## Partner Settings

### Page URL
```
/us/partner
```

### Sections
- Partner display
- Anniversary date edit
- Next visit date
- Unlink partner (with confirmation)

## Notification Settings

### Page URL
```
/us/notifications
```

### Options
```
Push Notifications
├── New messages ────────── [ON]
├── Daily question ──────── [ON]
├── Partner online ──────── [OFF]
├── Streak reminders ────── [ON]
├── Game invites ────────── [ON]
└── Capsule unlocks ─────── [ON]

Email Notifications
├── Weekly recap ────────── [ON]
├── Milestone alerts ────── [ON]
└── Product updates ─────── [OFF]

Quiet Hours
├── Enable ──────────────── [ON]
├── Start time ──────────── 10:00 PM
└── End time ────────────── 7:00 AM
```

## Subscription Page

### Page URL
```
/us/subscription
```

### Sections

**Current Plan Display**:
```html
<div class="current-plan">
  <div class="plan-badge free">Free</div>
  <h3>Closer Free</h3>
  <p>5 card draws per day</p>
</div>
```

**Upgrade Options**:
```html
<div class="plan-options">
  <div class="plan-card recommended">
    <div class="plan-badge">Most Popular</div>
    <h3>Closer+</h3>
    <div class="plan-price">$9.99<span>/month</span></div>
    <ul class="plan-features">
      <li>Unlimited card draws</li>
      <li>All games</li>
      <li>Extended storage</li>
      <li>No ads</li>
    </ul>
    <button class="btn btn-primary">Upgrade</button>
  </div>

  <!-- More plans -->
</div>
```

## Privacy Settings

### Page URL
```
/us/privacy
```

### Sections
- Privacy & presence toggles
- Data controls (export, deletion)
- Legal links (privacy policy, cookies, accessibility)

**Privacy toggles (recommended V1):**
```
Presence
├── Show online status ─────── [ON]
├── Show typing indicator ──── [ON]
└── Show read receipts ─────── [ON]
```

**Row layout pattern:**
```html
<div class="settings-card">
  <div class="settings-row">
    <div>
      <div class="row-title">Show online status</div>
      <div class="row-subtitle">Let your partner see when you’re here.</div>
    </div>
    <button class="toggle" aria-pressed="true"></button>
  </div>
</div>
```

## Theme

### Page URL
```
/us/theme
```

### Sections
- Theme gallery (cards)
- Live preview panel (mini surfaces + buttons)
- Premium gating for custom themes (if applicable)

**Theme card pattern:**
```html
<button class="theme-card selected">
  <div class="theme-swatch-row">
    <div class="swatch" style="background: var(--base)"></div>
    <div class="swatch" style="background: var(--clay)"></div>
    <div class="swatch" style="background: var(--mist)"></div>
  </div>
  <div class="theme-meta">
    <div class="theme-name">Default</div>
    <div class="theme-desc">Warm, dark, premium</div>
  </div>
</button>
```

## Achievements

### Page URL
```
/us/achievements
```

### Layout Structure
- Header: title + progress (“24/60 unlocked”)
- Filter pills: Conversation, Games, Rituals, Moments, Streaks, Gifts, Special
- Badge grid (responsive)
- Badge detail modal/drawer on click

**Badge card states:**
- Unlocked: full color + subtle glow
- Locked: muted + progress meter (if tracked) or “Locked”

## Streaks

### Page URL
```
/us/streaks
```

### Layout Structure
- Current streak summary (current / best)
- Calendar heatmap (activity days)
- Streak freeze card (premium) + explanation
- Milestone timeline (7/14/30/60/100)

**Empty state (no streak yet):**
- “Start your first streak”
- CTA: “Try a ritual” → `/connect/rituals`

## Data Export

### Page URL
```
/us/data
```

### Sections
- Export request card (“Download your data”)
- Export status (“Preparing…”, “Ready to download”, “Email sent”)
- Links: Privacy settings, Delete account

**Primary CTA states:**
- Idle: “Request Export”
- Pending: disabled + spinner “Preparing export…”
- Ready: “Download Export”

## Help

### Page URL
```
/us/help
```

### Layout Structure
- Search input (“Search help…”)
- FAQ accordion grouped by category
- Contact support CTA (email form or mailto)
- Links to legal pages

## About

### Page URL
```
/us/about
```

### Sections
- App version + build
- Credits
- Links: Terms, Privacy Policy, Cookies, Accessibility

## Terms

### Page URL
```
/us/terms
```

### Layout Structure
- Back header
- “Last updated” line
- Table of contents (sticky on desktop)
- Scrollable legal content

> Full required content structure lives in `CLOSER_LEGAL_CONTENT_SPEC.md`.

## Delete Account

### Page URL
```
/us/delete
```

### Screen States
1. Warning + consequences (what gets deleted)
2. Confirmation step (type “DELETE” + optional password re-auth)
3. Deleting in progress (locked UI)
4. Deleted confirmation + redirect to logged-out landing

> Confirmation dialog copy + requirements live in `CLOSER_LEGAL_CONTENT_SPEC.md`.

---

# Modal & Overlay Specifications

## Confirmation Modal

**Use Cases**: Delete actions, unlink partner, log out

**Structure**:
```html
<div class="modal-overlay">
  <div class="modal-container confirmation">
    <h3>Are you sure?</h3>
    <p>This action cannot be undone.</p>
    <div class="modal-actions">
      <button class="btn btn-ghost">Cancel</button>
      <button class="btn btn-danger">Delete</button>
    </div>
  </div>
</div>
```

## Card Reveal Modal

**Use Cases**: Intimacy deck card draw

**Structure**:
```html
<div class="modal-overlay">
  <div class="modal-container card-reveal">
    <button class="modal-close">×</button>

    <div class="card-face">
      <div class="category-badge">Deep Connection</div>
      <p class="question-text">"Question text here"</p>
    </div>

    <div class="answer-input">
      <textarea placeholder="Your answer..."></textarea>
    </div>

    <div class="modal-actions">
      <button class="btn btn-ghost">Skip</button>
      <button class="btn btn-primary">Submit</button>
    </div>
  </div>
</div>
```

## Photo Viewer Modal

**Use Cases**: Full-screen photo from Moments

**Features**:
- Full-screen dark overlay
- Pinch to zoom
- Swipe to navigate
- Swipe down to close
- Caption overlay
- Action buttons (download, delete)

## Bottom Sheet

**Use Cases**: Mobile action menus, quick options

**Structure**:
```html
<div class="bottom-sheet">
  <div class="sheet-handle"></div>
  <div class="sheet-content">
    <!-- Options list -->
  </div>
</div>
```

**Animation**:
- Slides up from bottom
- Backdrop fades in
- Swipe down to dismiss
- Tap backdrop to dismiss

---

# Animation & Interaction Library

## View Transitions

### Page Enter
```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Duration: 700ms, easing: cubic-bezier(0.16, 1, 0.3, 1) */
```

### Page Exit
```css
@keyframes fade-out-down {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-8px); }
}
```

## Button Interactions

### Hover Lift
```css
.btn:hover {
  transform: translateY(-1px);
  box-shadow: enhanced;
}
```

### Press Down
```css
.btn:active {
  transform: translateY(1px);
}
```

## Card Interactions

### Card Hover
```css
.card:hover {
  transform: translateY(-4px);
  border-color: var(--border-highlight);
}
```

### Card Tilt (3D)
```javascript
// Mouse position relative to card center
const tiltX = (mouseY - centerY) / height * -10;
const tiltY = (mouseX - centerX) / width * 10;

card.style.transform = `
  perspective(1000px)
  rotateX(${tiltX}deg)
  rotateY(${tiltY}deg)
`;
```

## Loading States

### Skeleton Loading
```html
<div class="skeleton">
  <div class="skeleton-line"></div>
  <div class="skeleton-line short"></div>
</div>
```

### Spinner
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Pulse Loading
```css
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
```

## Celebration Animations

### Confetti
- Trigger on: Milestone completion, streak achievement
- Duration: 3 seconds
- Colors: --clay, --mist, --sand

### Heart Burst
- Trigger on: Match in games, daily question both answered
- Duration: 1.5 seconds
- Count: 5-8 hearts

### Glow Pulse
- Trigger on: Card draw, message sent
- Duration: 500ms
- Scale: 1.1x

---

# Component Specifications

## Button Variants

### Primary Button
```css
.btn-primary {
  background: linear-gradient(180deg, rgba(245,230,211,0.98), rgba(245,230,211,0.9));
  color: var(--base);
  font-weight: 700;
  box-shadow: 0 20px 40px -22px rgba(245,230,211,0.25),
              0 14px 30px rgba(0,0,0,0.5);
}
```

### Ghost Button
```css
.btn-ghost {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--sand);
}
```

### Icon Button
```css
.icon-btn {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  background: transparent;
  color: var(--stone);
}
```

### Danger Button
```css
.btn-danger {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}
```

## Input Fields

### Text Input
```css
.input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 14px 18px;
  color: var(--sand);
}

.input:focus {
  border-color: var(--border-highlight);
  outline: none;
  box-shadow: 0 0 0 4px var(--focus-ring);
}
```

### Textarea
```css
.textarea {
  min-height: 120px;
  resize: vertical;
}
```

## Pills & Badges

### Category Badge
```css
.category-badge {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
```

### Status Pill
```css
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
}
```

---

# Responsive Breakpoints

## Breakpoint Scale
```css
/* Mobile First */
--bp-sm: 480px;   /* Large phones */
--bp-md: 768px;   /* Tablets */
--bp-lg: 1024px;  /* Desktop */
--bp-xl: 1280px;  /* Large desktop */
```

## Layout Shifts

### Mobile (< 768px)
- Single column layout
- Bottom navigation visible
- Sidebar hidden
- Full-width cards
- Stacked game tiles
- Bottom sheets for actions

### Tablet (768px - 1024px)
- Sidebar visible (narrow)
- Two-column grids
- Modal dialogs
- Side-by-side in some views

### Desktop (> 1024px)
- Full sidebar with labels
- Three+ column grids
- Larger typography scale
- More whitespace
- Hover states active

## Component Responsive Behavior

### Featured Hero
```css
/* Desktop */
.featured-hero {
  flex-direction: row;
}

/* Mobile */
@media (max-width: 860px) {
  .featured-hero {
    flex-direction: column;
  }
}
```

### Games Grid
```css
.games-grid {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

@media (max-width: 520px) {
  .games-grid {
    grid-template-columns: 1fr;
  }
}
```

---

# Next.js Implementation Guide

## App Router Structure
```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   └── layout.tsx
├── (app)/
│   ├── page.tsx                    # Home
│   ├── connect/
│   │   ├── page.tsx
│   │   ├── intimacy-deck/
│   │   │   ├── page.tsx
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx
│   │   ├── hot-takes/
│   │   │   └── page.tsx
│   │   ├── would-you-rather/
│   │   │   └── page.tsx
│   │   ├── time-capsule/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── dream-builder/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   ├── messages/
│   │   └── page.tsx
│   ├── moments/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── us/
│   │   ├── page.tsx
│   │   ├── edit-profile/
│   │   │   └── page.tsx
│   │   ├── partner/
│   │   │   └── page.tsx
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   ├── subscription/
│   │   │   └── page.tsx
│   │   └── theme/
│   │       └── page.tsx
│   └── layout.tsx
├── onboarding/
│   ├── page.tsx
│   └── [step]/
│       └── page.tsx
└── layout.tsx
```

## Component Organization
```
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── BottomSheet.tsx
│   ├── Badge.tsx
│   └── Avatar.tsx
├── layout/
│   ├── Sidebar.tsx
│   ├── MobileNav.tsx
│   ├── Container.tsx
│   └── PageHeader.tsx
├── home/
│   ├── TimezonePill.tsx
│   ├── ConnectionVisual.tsx
│   ├── CountdownHero.tsx
│   └── DailyCard.tsx
├── connect/
│   ├── FeaturedHero.tsx
│   ├── CardStack.tsx
│   ├── GamesGrid.tsx
│   ├── GameTile.tsx
│   ├── RitualsList.tsx
│   └── SyncStatus.tsx
├── messages/
│   ├── ChatHeader.tsx
│   ├── ChatThread.tsx
│   ├── ChatBubble.tsx
│   ├── WhisperMessage.tsx
│   └── ChatInput.tsx
├── moments/
│   ├── CalendarStrip.tsx
│   ├── TimelineFeed.tsx
│   ├── PhotoCard.tsx
│   ├── SongCard.tsx
│   └── QuoteCard.tsx
└── games/
    ├── IntimacyDeck/
    │   ├── DeckView.tsx
    │   ├── DrawCard.tsx
    │   ├── AnswerInput.tsx
    │   └── RevealAnimation.tsx
    ├── HotTakes/
    │   ├── TopicCard.tsx
    │   └── VoteButtons.tsx
    └── WouldYouRather/
        ├── OptionsDisplay.tsx
        └── ResultsView.tsx
```

## Hooks Organization
```
hooks/
├── useAuth.ts
├── useCouple.ts
├── useRealtime.ts
├── useMessages.ts
├── useMoments.ts
├── useGames.ts
├── useStreak.ts
├── useTimezones.ts
└── useNotifications.ts
```

## Key Implementation Notes

### Real-time Sync
```typescript
// Using Supabase Realtime
const channel = supabase.channel('couple:123')
  .on('presence', { event: 'sync' }, () => {
    // Partner presence update
  })
  .on('broadcast', { event: 'game_action' }, (payload) => {
    // Game state update
  })
  .subscribe();
```

### Animation with Framer Motion
```typescript
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
};

<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    variants={pageVariants}
    initial="initial"
    animate="enter"
    exit="exit"
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### Theme System
```typescript
// Design tokens as CSS variables
const tokens = {
  colors: {
    base: '#050505',
    clay: '#e09f7d',
    mist: '#c4b5fd',
    sand: '#f5e6d3',
    stone: '#9ca3af',
  },
  spacing: {
    1: '4px',
    2: '8px',
    // ...
  },
  radii: {
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  }
};
```

---

# Appendix

## Icon Library
Using Lucide Icons throughout:
- home, aperture, message-circle, sparkles, user (navigation)
- sun, moon, heart, smile, calendar (rituals)
- flame, git-pull-request, hourglass, hammer, zap (games)
- plus, mic, send, check-check, eye-off (messaging)
- music, camera, quote (moments)
- settings, bell, lock, credit-card, help-circle (settings)

## Color Accessibility
All color combinations meet WCAG AA contrast requirements:
- --sand on --base: 15.8:1
- --stone on --base: 7.2:1
- --clay on --base: 6.8:1
- --mist on --base: 8.1:1

## Performance Targets
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Time to Interactive: < 3s
- Bundle size: < 200KB (initial)

---

*Document Version: 1.0*
*Last Updated: December 2025*
*For: Closer Development Team*
