# CLOSER — Moments & Messages Detailed Design Specification
## Complete Design Reference for Core Communication Features

---

# Table of Contents

1. [Moments System Overview](#moments-system-overview)
2. [Moments Page Design](#moments-page-design)
3. [Moment Types & Cards](#moment-types--cards)
4. [Create Moment Flows](#create-moment-flows)
5. [Moments Interactions](#moments-interactions)
6. [Messages System Overview](#messages-system-overview)
7. [Messages Page Design](#messages-page-design)
8. [Message Types & Bubbles](#message-types--bubbles)
9. [Message Input & Actions](#message-input--actions)
10. [Special Message Features](#special-message-features)
11. [Integration Points](#integration-points)
12. [Monetization Touchpoints](#monetization-touchpoints)

---

# 1. Moments System Overview

## Philosophy
Moments is the shared memory book for couples — a beautiful timeline that captures photos, songs, quotes, milestones, and memories from games and rituals. Unlike a photo dump, Moments is curated and meaningful.

## Key Principles
- **Curated, Not Cluttered**: Quality over quantity
- **Both Partners Contribute**: Shared ownership
- **Auto + Manual**: Some moments auto-save, others are intentional
- **Premium Feel**: Every moment feels special
- **Easy Recall**: Calendar navigation, search, filters

## Moment Sources
| Source | Auto/Manual | Example |
|--------|-------------|---------|
| Photos | Manual | "Sunset from my window" |
| Songs | Manual | "Our song right now" |
| Quotes | Manual | "What they said that made me smile" |
| Milestones | Auto + Manual | "100 days together" |
| Intimacy Deck | Manual (prompted) | "Our answers to that deep question" |
| Hot Takes | Manual (prompted) | "We disagreed about pineapple pizza" |
| Would You Rather | Manual (prompted) | "We both chose the beach house" |
| Time Capsules | Auto (on open) | "Message from 6 months ago" |
| Dreams | Auto (on complete) | "We bought our first home!" |
| Gratitude | Manual | "Today's gratitude exchange" |

---

# 2. Moments Page Design

## 2.1 Desktop Layout (`/moments`)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  SIDEBAR │                         MOMENTS                                          │
│          │                                                                          │
│          │  ┌─────────────────────────────────────────────────────────────────────┐ │
│          │  │  CALENDAR STRIP                                                     │ │
│          │  │                                                                     │ │
│          │  │  ◀  January 2025                                              ▶    │ │
│          │  │                                                                     │ │
│          │  │  S    M    T    W    T    F    S                                   │ │
│          │  │  26   27   28   29   30   31   1                                   │ │
│          │  │  ○    ●    ○    ●    ●    ○   [●]                                  │ │
│          │  │                               today                                 │ │
│          │  └─────────────────────────────────────────────────────────────────────┘ │
│          │                                                                          │
│          │  ┌────────────────────────────────────────────────────────────────────┐  │
│          │  │  VIEW:  [Timeline]  [Grid]  [Calendar]     🔍 Search    [+ Add]   │  │
│          │  └────────────────────────────────────────────────────────────────────┘  │
│          │                                                                          │
│          │  ┌─ TODAY ─────────────────────────────────────────────────────────────┐ │
│          │  │                                                                     │ │
│          │  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │ │
│          │  │  │                 │  │                 │  │                 │     │ │
│          │  │  │  [Photo]        │  │  ♫ Song         │  │  "Quote"        │     │ │
│          │  │  │                 │  │  Artist         │  │                 │     │ │
│          │  │  │  Caption...     │  │  Album art      │  │  — Source       │     │ │
│          │  │  │                 │  │                 │  │                 │     │ │
│          │  │  └─────────────────┘  └─────────────────┘  └─────────────────┘     │ │
│          │  │                                                                     │ │
│          │  └─────────────────────────────────────────────────────────────────────┘ │
│          │                                                                          │
│          │  ┌─ DECEMBER 28, 2024 ─────────────────────────────────────────────────┐ │
│          │  │                                                                     │ │
│          │  │  ┌───────────────────────────────────────────────────────────────┐ │ │
│          │  │  │  🎉 MILESTONE                                                 │ │ │
│          │  │  │                                                               │ │ │
│          │  │  │  "100 Days Together"                                          │ │ │
│          │  │  │                                                               │ │ │
│          │  │  │  You've been on this journey for 100 incredible days.         │ │ │
│          │  │  │                                                               │ │ │
│          │  │  └───────────────────────────────────────────────────────────────┘ │ │
│          │  │                                                                     │ │
│          │  │  ┌─────────────────┐  ┌─────────────────┐                          │ │
│          │  │  │ [Polaroid       │  │ 💬 Card Answer  │                          │ │
│          │  │  │  style photo]   │  │                 │                          │ │
│          │  │  │                 │  │ "What we said   │                          │ │
│          │  │  │  "Morning       │  │  about our      │                          │ │
│          │  │  │   coffee"       │  │  dreams..."     │                          │ │
│          │  │  └─────────────────┘  └─────────────────┘                          │ │
│          │  │                                                                     │ │
│          │  └─────────────────────────────────────────────────────────────────────┘ │
│          │                                                                          │
│          │  [Load More...]                                                          │
│          │                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 2.2 Calendar Strip Design

### Visual Specifications
```css
.calendar-strip {
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  margin-bottom: 24px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.calendar-month {
  font-family: var(--font-serif);
  font-size: 18px;
  color: var(--sand);
}

.calendar-nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--stone);
  cursor: pointer;
  transition: all var(--dur) var(--easing);
}

.calendar-nav-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border-highlight);
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  text-align: center;
}

.calendar-day-header {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--stone);
  padding-bottom: 8px;
}

.calendar-day {
  position: relative;
  padding: 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all var(--dur) var(--easing);
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.05);
}

.calendar-day.today {
  background: rgba(224, 159, 125, 0.15);
  border: 1px solid rgba(224, 159, 125, 0.3);
}

.calendar-day.selected {
  background: var(--clay);
  color: var(--base);
}

.calendar-day.has-moments::after {
  content: "";
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--mist);
}
```

### Day States
| State | Visual |
|-------|--------|
| Default | Transparent, --stone text |
| Has moments | Mist dot below date |
| Today | Clay tinted background |
| Selected | Solid clay background, dark text |
| Other month | 40% opacity |

## 2.3 View Modes

### Timeline View (Default)
- Chronological feed, newest first
- Grouped by date with date headers
- Infinite scroll with "Load More"
- Date headers sticky on scroll

### Grid View
- Masonry-style grid layout
- 3 columns on desktop, 2 on tablet, 1 on mobile
- No date grouping, pure visual grid
- Good for photo-heavy moments

### Calendar View
- Full month calendar display
- Click date to see that day's moments
- Visual heat map (more moments = darker dot)
- Quick overview of activity patterns

## 2.4 View Toggle Design

```css
.view-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 4px;
}

.view-toggle-btn {
  padding: 8px 16px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: var(--stone);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--dur) var(--easing);
}

.view-toggle-btn.active {
  background: rgba(255, 255, 255, 0.08);
  color: var(--sand);
}

.view-toggle-btn:hover:not(.active) {
  color: var(--sand);
}
```

---

# 3. Moment Types & Cards

## 3.1 Photo Moment

### Polaroid-Style Card
```
┌─────────────────────────────────────┐
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │                             │   │
│  │        [PHOTO]              │   │
│  │                             │   │
│  │                             │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  "Morning coffee with a view"       │
│                                     │
│  Jan 1, 2025 • by Maya              │
│                                     │
└─────────────────────────────────────┘
```

### CSS
```css
.moment-photo {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid var(--border-subtle);
  border-radius: 4px; /* Polaroid feel - slightly squared */
  padding: 12px 12px 20px;
  box-shadow: var(--shadow-1);
  transform: rotate(-1deg); /* Slight rotation for organic feel */
  transition: all var(--dur-2) var(--easing);
}

.moment-photo:nth-child(even) {
  transform: rotate(1deg);
}

.moment-photo:hover {
  transform: rotate(0deg) scale(1.02);
  box-shadow: var(--shadow-2);
}

.moment-photo-img {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 2px;
  margin-bottom: 12px;
}

.moment-photo-caption {
  font-family: var(--font-serif);
  font-size: 15px;
  font-style: italic;
  color: var(--sand);
  margin-bottom: 8px;
}

.moment-photo-meta {
  font-size: 11px;
  color: var(--stone);
}
```

### Interaction
- Click: Opens full-screen lightbox
- Long-press (mobile): Shows action menu
- Right-click (desktop): Shows context menu

---

## 3.2 Song Moment

### Card Design
```
┌─────────────────────────────────────┐
│                                     │
│  ┌──────────┐                       │
│  │          │  ♫ Thinking Out Loud  │
│  │ [Album   │  Ed Sheeran           │
│  │  Art]    │                       │
│  │          │  ▶ ═══════════ 3:42   │
│  └──────────┘                       │
│                                     │
│  "This one makes me think of you"   │
│                                     │
│  Jan 1, 2025 • by Jordan            │
│                                     │
└─────────────────────────────────────┘
```

### CSS
```css
.moment-song {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg,
    rgba(196, 181, 253, 0.08) 0%,
    rgba(196, 181, 253, 0.02) 100%);
  border: 1px solid rgba(196, 181, 253, 0.2);
  border-radius: 20px;
}

.moment-song-art {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.moment-song-info {
  flex: 1;
}

.moment-song-title {
  font-weight: 700;
  color: var(--sand);
  margin-bottom: 2px;
}

.moment-song-artist {
  font-size: 14px;
  color: var(--stone);
  margin-bottom: 12px;
}

.moment-song-player {
  display: flex;
  align-items: center;
  gap: 12px;
}

.moment-song-play {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--mist);
  border: none;
  color: var(--base);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.moment-song-progress {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.moment-song-progress-fill {
  height: 100%;
  width: 0%;
  background: var(--mist);
  border-radius: 2px;
  transition: width 0.1s linear;
}
```

### Playback Feature
- 30-second preview (if Spotify/Apple Music integrated)
- Or link to open in streaming app
- Animated equalizer bars when playing

### Equalizer Animation
```css
@keyframes equalizer {
  0%, 100% { height: 4px; }
  50% { height: 16px; }
}

.equalizer-bar {
  width: 3px;
  background: var(--mist);
  border-radius: 2px;
  animation: equalizer 0.8s ease infinite;
}

.equalizer-bar:nth-child(1) { animation-delay: 0s; }
.equalizer-bar:nth-child(2) { animation-delay: 0.2s; }
.equalizer-bar:nth-child(3) { animation-delay: 0.4s; }
.equalizer-bar:nth-child(4) { animation-delay: 0.1s; }
.equalizer-bar:nth-child(5) { animation-delay: 0.3s; }
```

---

## 3.3 Quote Moment

### Card Design
```
┌─────────────────────────────────────┐
│                                     │
│  "                                  │
│                                     │
│  The best thing to hold onto in     │
│  life is each other.                │
│                                     │
│                              "      │
│                                     │
│  — Audrey Hepburn                   │
│                                     │
│  Jan 1, 2025 • saved by Maya        │
│                                     │
└─────────────────────────────────────┘
```

### CSS
```css
.moment-quote {
  padding: 32px;
  background: linear-gradient(135deg,
    rgba(224, 159, 125, 0.06) 0%,
    rgba(224, 159, 125, 0.02) 100%);
  border: 1px solid rgba(224, 159, 125, 0.15);
  border-radius: 20px;
  position: relative;
}

.moment-quote::before {
  content: """;
  position: absolute;
  top: 16px;
  left: 24px;
  font-family: var(--font-serif);
  font-size: 64px;
  color: rgba(224, 159, 125, 0.2);
  line-height: 1;
}

.moment-quote-text {
  font-family: var(--font-serif);
  font-size: 20px;
  font-style: italic;
  line-height: 1.6;
  color: var(--sand);
  margin-bottom: 16px;
  padding-left: 24px;
}

.moment-quote-author {
  font-size: 14px;
  color: var(--clay);
  padding-left: 24px;
}

.moment-quote-author::before {
  content: "— ";
}
```

### Quote Sources
- Manual entry (user types quote)
- From messages (save a message as quote)
- From card answers (save partner's answer)

---

## 3.4 Milestone Moment

### Card Design
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│               🎉                                            │
│                                                             │
│         100 Days Together                                   │
│                                                             │
│    You've built something beautiful over these              │
│    100 days. Here's to the next 100 and beyond.            │
│                                                             │
│    ─────────────────────────────────────────                │
│                                                             │
│    Started: September 23, 2024                              │
│    Milestone: January 1, 2025                               │
│                                                             │
│    [View Journey]                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### CSS
```css
.moment-milestone {
  text-align: center;
  padding: 40px 32px;
  background: linear-gradient(135deg,
    rgba(224, 159, 125, 0.1) 0%,
    rgba(196, 181, 253, 0.1) 100%);
  border: 1px solid var(--border-highlight);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}

.moment-milestone::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%,
    rgba(224, 159, 125, 0.15) 0%,
    transparent 50%);
  pointer-events: none;
}

.moment-milestone-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.moment-milestone-title {
  font-family: var(--font-serif);
  font-size: 28px;
  color: var(--sand);
  margin-bottom: 12px;
}

.moment-milestone-description {
  font-size: 15px;
  color: var(--stone);
  max-width: 400px;
  margin: 0 auto 24px;
  line-height: 1.6;
}

.moment-milestone-dates {
  font-size: 13px;
  color: var(--stone);
}
```

### Auto-Generated Milestones
| Milestone | Trigger |
|-----------|---------|
| First Day | Account linked |
| 7 Days | 1 week together |
| 14 Days | 2 weeks together |
| 30 Days | 1 month together |
| 50 Days | 50 days together |
| 100 Days | 100 days together |
| 6 Months | 180 days together |
| 1 Year | 365 days together |
| Anniversary | Annual anniversary date |
| First Message Anniversary | 1 year since first message |

---

## 3.5 Card Answer Moment (Intimacy Deck)

### Card Design
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  💬 Intimacy Deck                           Deep Questions  │
│                                                             │
│  "What's something you've never told anyone?"              │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │                      │  │                      │        │
│  │ [Avatar]             │  │ [Avatar]             │        │
│  │ Maya                 │  │ Jordan               │        │
│  │                      │  │                      │        │
│  │ "I've always wanted  │  │ "Sometimes I worry   │        │
│  │  to write a novel.   │  │  that I'm not good   │        │
│  │  Just for me."       │  │  enough for you."    │        │
│  │                      │  │                      │        │
│  └──────────────────────┘  └──────────────────────┘        │
│                                                             │
│  January 1, 2025                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### CSS
```css
.moment-card-answer {
  padding: 24px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid var(--border-subtle);
  border-radius: 24px;
}

.moment-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.moment-card-type {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--stone);
}

.moment-card-category {
  padding: 4px 10px;
  background: rgba(224, 159, 125, 0.15);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--clay);
}

.moment-card-question {
  font-family: var(--font-serif);
  font-size: 18px;
  font-style: italic;
  color: var(--sand);
  text-align: center;
  margin-bottom: 24px;
  padding: 0 16px;
}

.moment-card-answers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.moment-card-answer-item {
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
}

.moment-card-answer-item.mine {
  border-left: 3px solid var(--clay);
}

.moment-card-answer-item.theirs {
  border-left: 3px solid var(--mist);
}

.moment-card-answer-author {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.moment-card-answer-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.moment-card-answer-name {
  font-weight: 700;
  font-size: 13px;
  color: var(--sand);
}

.moment-card-answer-text {
  font-size: 14px;
  color: var(--sand);
  line-height: 1.6;
}
```

---

## 3.6 Time Capsule Opened Moment

### Card Design
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  📬 Time Capsule Opened                                     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  [Decorative wax seal - broken]                       │ │
│  │                                                       │ │
│  │  Sealed: July 4, 2024                                │ │
│  │  Opened: January 1, 2025                             │ │
│  │                                                       │ │
│  │  ─────────────────────────────────────                │ │
│  │                                                       │ │
│  │  "Dear future us,                                    │ │
│  │                                                       │ │
│  │  If you're reading this, we made it to               │ │
│  │  six months! I hope we're still as happy             │ │
│  │  as we are right now..."                             │ │
│  │                                                       │ │
│  │  [Attached photo preview]                             │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  [Read Full Capsule]                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3.7 Dream Completed Moment

### Card Design
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🎯 Dream Completed!                                        │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  🏠 Our First Home Together                           │ │
│  │                                                       │ │
│  │  ████████████████████████████████ 100%                │ │
│  │                                                       │ │
│  │  Started: March 2024                                  │ │
│  │  Completed: January 2025                              │ │
│  │  Duration: 10 months                                  │ │
│  │                                                       │ │
│  │  Milestones completed: 5/5                            │ │
│  │  ✓ Save for down payment                              │ │
│  │  ✓ Research neighborhoods                             │ │
│  │  ✓ Get pre-approved                                   │ │
│  │  ✓ House hunting                                      │ │
│  │  ✓ Close on the house                                 │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  🎉 Congratulations! You did it together.                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 4. Create Moment Flows

## 4.1 Add Moment Button

### FAB (Floating Action Button) - Mobile
```css
.add-moment-fab {
  position: fixed;
  bottom: calc(80px + env(safe-area-inset-bottom) + 16px);
  right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--clay), var(--mist));
  border: none;
  color: var(--base);
  font-size: 24px;
  box-shadow: 0 8px 24px rgba(224, 159, 125, 0.3);
  cursor: pointer;
  z-index: 50;
  transition: all var(--dur) var(--easing);
}

.add-moment-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(224, 159, 125, 0.4);
}

.add-moment-fab:active {
  transform: scale(0.95);
}
```

### Desktop Button (in toolbar)
```css
.add-moment-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: linear-gradient(135deg, var(--clay), var(--mist));
  border: none;
  border-radius: 12px;
  color: var(--base);
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}
```

## 4.2 Moment Type Selector

### Bottom Sheet / Modal
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    Add a Moment                             │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │     📷      │  │     🎵      │  │     💬      │        │
│  │   Photo     │  │    Song     │  │   Quote     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  From Recent Activity:                              │   │
│  │                                                     │   │
│  │  💭 Save today's gratitude exchange                │   │
│  │  🃏 Save that card answer from yesterday            │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                    [Cancel]                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 4.3 Photo Moment Flow

### Step 1: Select Photo
```
┌─────────────────────────────────────────────────────────────┐
│  ✕                    Add Photo                             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │                                                       │ │
│  │                 📷                                    │ │
│  │                                                       │ │
│  │           Tap to choose a photo                       │ │
│  │                                                       │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  [Take Photo]              [Choose from Library]            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Step 2: Add Caption
```
┌─────────────────────────────────────────────────────────────┐
│  ✕                    Add Photo                      Save   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │                   [Selected Photo]                    │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Caption (optional)                                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Morning light through our window...                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Date                                                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  January 1, 2025                                 📅   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 4.4 Song Moment Flow

### Search or Paste Link
```
┌─────────────────────────────────────────────────────────────┐
│  ✕                    Add Song                              │
│                                                             │
│  Search for a song or paste a link                          │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  🔍  Search songs...                                  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ─ OR ─                                                     │
│                                                             │
│  Paste Spotify or Apple Music link                          │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  https://open.spotify.com/track/...                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Recent Songs                                               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  🎵 Thinking Out Loud - Ed Sheeran                    │ │
│  │  🎵 Perfect - Ed Sheeran                              │ │
│  │  🎵 All of Me - John Legend                           │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Confirm & Add Note
```
┌─────────────────────────────────────────────────────────────┐
│  ✕                    Add Song                       Save   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  ┌──────────┐                                        │ │
│  │  │  [Album  │  Thinking Out Loud                     │ │
│  │  │   Art]   │  Ed Sheeran                            │ │
│  │  │          │  × (2014)                              │ │
│  │  └──────────┘                                        │ │
│  │                                                       │ │
│  │  ▶ ════════════════════════════════ 4:41             │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Why this song? (optional)                                  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  This came on the radio during our first date...     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 4.5 Quote Moment Flow

```
┌─────────────────────────────────────────────────────────────┐
│  ✕                    Add Quote                      Save   │
│                                                             │
│  Quote                                                      │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  "The best thing to hold onto in life is             │ │
│  │   each other."                                        │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Author or Source (optional)                                │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Audrey Hepburn                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Why save this? (optional)                                  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  Saw this on Instagram and it reminded me of us...   │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 5. Moments Interactions

## 5.1 Moment Card Actions

### Context Menu (Right-click / Long-press)
```
┌─────────────────────────────┐
│  👁️  View Full              │
│  ✏️  Edit Caption           │
│  📅  Change Date            │
│  ───────────────────────── │
│  📤  Share                  │
│  💾  Download               │
│  ───────────────────────── │
│  🗑️  Delete                 │
└─────────────────────────────┘
```

## 5.2 Photo Lightbox

### Full-Screen View
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ✕                                                        📤  ⋮        │
│                                                                         │
│                                                                         │
│                                                                         │
│                         [FULL PHOTO]                                    │
│                                                                         │
│                                                                         │
│                                                                         │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  "Morning light through our window"                             │   │
│  │                                                                 │   │
│  │  January 1, 2025 • by Maya                                      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│       ◀                    1 / 24                           ▶          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Features
- Swipe left/right to navigate photos
- Pinch to zoom
- Double-tap to zoom
- Swipe down to close
- Photo counter at bottom
- Arrow keys for desktop navigation

## 5.3 Search & Filter

### Search Bar
```
┌───────────────────────────────────────────────────────────┐
│  🔍  Search moments...                                    │
└───────────────────────────────────────────────────────────┘

Results: "coffee"

┌─────────────────────────────────────────────────────────────┐
│  📷 "Morning coffee" - Jan 1, 2025                          │
│  📷 "Coffee date" - Dec 15, 2024                            │
│  💬 "Let's get coffee when you visit" - Dec 10, 2024        │
└─────────────────────────────────────────────────────────────┘
```

### Filter Pills
```
All    Photos    Songs    Quotes    Milestones    From Games

[ All ] [ 📷 ] [ 🎵 ] [ 💬 ] [ 🎉 ] [ 🃏 ]
```

---

# 6. Messages System Overview

## Philosophy
Messages in Closer isn't just chat — it's intimate communication designed for couples. Every message type serves connection, from quick texts to whispered secrets.

## Key Principles
- **Private & Secure**: Just the two of you
- **Rich Media**: Photos, voice, reactions
- **Whispers**: Intimate messages that reveal on hold
- **Connected to Everything**: Link to games, moments, gifts
- **Not a Chat App Replacement**: Enhances, doesn't replace iMessage/WhatsApp

## Message Types
| Type | Icon | Purpose |
|------|------|---------|
| Text | — | Regular messages |
| Whisper | 👁️ | Blurred until hold-to-reveal |
| Voice | 🎤 | Voice notes up to 5 min |
| Photo | 📷 | Image sharing |
| GIF | GIF | Fun reactions |
| Gift | 🎁 | Virtual gift delivery |
| System | ℹ️ | Auto notifications |

---

# 7. Messages Page Design

## 7.1 Desktop Layout (`/messages`)

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  SIDEBAR │                         MESSAGES                                         │
│          │                                                                          │
│          │  ┌─────────────────────────────────────────────────────────────────────┐ │
│          │  │                                                                     │ │
│          │  │  ┌──────────┐                                                       │ │
│          │  │  │ [Avatar] │  Jordan                                      ● Online │ │
│          │  │  └──────────┘  Last seen: just now                                  │ │
│          │  │                                                                     │ │
│          │  └─────────────────────────────────────────────────────────────────────┘ │
│          │                                                                          │
│          │  ┌─────────────────────────────────────────────────────────────────────┐ │
│          │  │                                                                     │ │
│          │  │                        ── January 1 ──                              │ │
│          │  │                                                                     │ │
│          │  │                                     ┌───────────────────────────┐   │ │
│          │  │                                     │ Good morning beautiful ☀️ │   │ │
│          │  │                                     │                    9:42 AM│   │ │
│          │  │                                     └───────────────────────────┘   │ │
│          │  │                                                              ✓✓     │ │
│          │  │                                                                     │ │
│          │  │   ┌─────────────────────────────────┐                               │ │
│          │  │   │ Morning! I made you coffee ☕   │                               │ │
│          │  │   │ [Photo of coffee]               │                               │ │
│          │  │   │                         9:45 AM │                               │ │
│          │  │   └─────────────────────────────────┘                               │ │
│          │  │                                           ❤️                        │ │
│          │  │                                                                     │ │
│          │  │                                     ┌───────────────────────────┐   │ │
│          │  │                                     │ 👁️ Whisper message        │   │ │
│          │  │                                     │ ░░░░░░░░░░░░░░░░░░░░░░░░░│   │ │
│          │  │                                     │ Hold to reveal   10:02 AM│   │ │
│          │  │                                     └───────────────────────────┘   │ │
│          │  │                                                                     │ │
│          │  │   ┌─────────────────────────────────┐                               │ │
│          │  │   │ 🎤 Voice note                   │                               │ │
│          │  │   │ ▶ ════════════════════ 0:42    │                               │ │
│          │  │   │                        10:15 AM │                               │ │
│          │  │   └─────────────────────────────────┘                               │ │
│          │  │                                                                     │ │
│          │  │                          Jordan is typing...                        │ │
│          │  │                                                                     │ │
│          │  └─────────────────────────────────────────────────────────────────────┘ │
│          │                                                                          │
│          │  ┌─────────────────────────────────────────────────────────────────────┐ │
│          │  │  [+]  Type a message...                            [👁️] [🎤] [📷]  │ │
│          │  └─────────────────────────────────────────────────────────────────────┘ │
│          │                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 7.2 Header Bar Design

```css
.messages-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid var(--border-subtle);
}

.messages-partner-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--border-subtle);
}

.messages-partner-info {
  flex: 1;
}

.messages-partner-name {
  font-weight: 700;
  font-size: 16px;
  color: var(--sand);
}

.messages-partner-status {
  font-size: 13px;
  color: var(--stone);
}

.messages-online-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.messages-online-indicator.offline {
  background: var(--stone);
  box-shadow: none;
}
```

## 7.3 Scroll Container

```css
.messages-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Scroll anchored to bottom */
.messages-scroll {
  overflow-anchor: none;
}

.messages-scroll > *:last-child {
  overflow-anchor: auto;
}
```

## 7.4 Date Divider

```css
.messages-date-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0;
}

.messages-date-divider::before,
.messages-date-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--border-subtle);
}

.messages-date-divider span {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--stone);
}
```

---

# 8. Message Types & Bubbles

## 8.1 Base Bubble Styles

```css
.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 20px;
  position: relative;
}

.message-bubble.sent {
  align-self: flex-end;
  background: linear-gradient(135deg,
    rgba(224, 159, 125, 0.2) 0%,
    rgba(224, 159, 125, 0.1) 100%);
  border: 1px solid rgba(224, 159, 125, 0.2);
  border-bottom-right-radius: 4px;
}

.message-bubble.received {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  border-bottom-left-radius: 4px;
}

.message-text {
  font-size: 15px;
  line-height: 1.5;
  color: var(--sand);
  word-wrap: break-word;
}

.message-time {
  font-size: 10px;
  color: var(--stone);
  margin-top: 4px;
  text-align: right;
}

.message-status {
  display: inline-flex;
  margin-left: 4px;
  color: var(--stone);
}

.message-status.read {
  color: var(--mist);
}
```

## 8.2 Whisper Message

### Visual Design
```
┌─────────────────────────────────────────┐
│  👁️ Whisper                             │
│                                         │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                         │
│  Hold to reveal                  2:45 PM│
└─────────────────────────────────────────┘
```

### CSS
```css
.message-whisper {
  position: relative;
}

.message-whisper-content {
  filter: blur(12px);
  user-select: none;
  transition: filter 0.3s ease;
}

.message-whisper.revealed .message-whisper-content {
  filter: blur(0);
}

.message-whisper-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: inherit;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.message-whisper.revealed .message-whisper-overlay {
  opacity: 0;
}

.message-whisper-icon {
  width: 24px;
  height: 24px;
  color: var(--sand);
}

.message-whisper-hint {
  font-size: 12px;
  color: var(--sand);
  font-weight: 600;
}
```

### Interaction
- **Mobile**: Hold for 500ms to reveal
- **Desktop**: Click and hold, or press Space while focused
- **Once revealed**: Stays visible (toggle in settings)

### Animation Sequence
1. User starts holding
2. Progress ring fills around eye icon (500ms)
3. Blur smoothly transitions to 0
4. Haptic feedback (mobile)
5. Overlay fades out

```css
@keyframes reveal-progress {
  from { stroke-dashoffset: 100; }
  to { stroke-dashoffset: 0; }
}

.reveal-progress-ring {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: reveal-progress 500ms linear forwards;
}
```

---

## 8.3 Photo Message

### Visual Design
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │         [PHOTO]                 │   │
│  │                                 │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Check out this sunset!          2:45 PM│
└─────────────────────────────────────────┘
```

### CSS
```css
.message-photo {
  max-width: 280px;
  padding: 4px;
}

.message-photo-img {
  width: 100%;
  border-radius: 16px;
  cursor: pointer;
  transition: transform var(--dur) var(--easing);
}

.message-photo-img:hover {
  transform: scale(1.02);
}

.message-photo-caption {
  padding: 8px 12px 4px;
  font-size: 14px;
  color: var(--sand);
}
```

### Features
- Click to open lightbox
- Download button in lightbox
- Save to Moments option

---

## 8.4 Voice Message

### Visual Design
```
┌─────────────────────────────────────────┐
│                                         │
│  ▶  ═══════════════════════════  0:42  │
│                                         │
│                                  2:45 PM│
└─────────────────────────────────────────┘
```

### CSS
```css
.message-voice {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.message-voice-play {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--clay);
  border: none;
  color: var(--base);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all var(--dur) var(--easing);
}

.message-voice-play:hover {
  transform: scale(1.1);
}

.message-voice-play.playing {
  background: var(--mist);
}

.message-voice-waveform {
  flex: 1;
  height: 32px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.message-voice-bar {
  width: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  transition: background 0.1s;
}

.message-voice-bar.played {
  background: var(--clay);
}

.message-voice-bar.current {
  background: var(--sand);
}

.message-voice-duration {
  font-size: 12px;
  color: var(--stone);
  font-feature-settings: "tnum" 1;
  min-width: 32px;
  text-align: right;
}
```

### Waveform Visualization
- Pre-generated waveform from audio file
- 20-40 bars representing amplitude
- Bars fill as audio plays
- Tap to seek position

### Playback Speed
```
┌─────────────────────────────────────────┐
│  Playback speed                         │
│                                         │
│  [1x]  [1.5x]  [2x]                     │
└─────────────────────────────────────────┘
```

---

## 8.5 Gift Message

### Visual Design
```
┌─────────────────────────────────────────┐
│                                         │
│          🎁 Jordan sent a gift!         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │     [Gift animation preview]    │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  "Happy anniversary, my love"           │
│                                         │
│  [Open Gift]                     2:45 PM│
└─────────────────────────────────────────┘
```

### CSS
```css
.message-gift {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg,
    rgba(224, 159, 125, 0.1) 0%,
    rgba(196, 181, 253, 0.1) 100%);
  border: 1px solid var(--border-highlight);
  border-radius: 24px;
}

.message-gift-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.message-gift-icon {
  font-size: 24px;
}

.message-gift-text {
  font-weight: 700;
  color: var(--sand);
}

.message-gift-preview {
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-gift-message {
  font-style: italic;
  color: var(--sand);
  margin-bottom: 16px;
}

.message-gift-open {
  padding: 10px 24px;
  background: linear-gradient(135deg, var(--clay), var(--mist));
  border: none;
  border-radius: 12px;
  color: var(--base);
  font-weight: 700;
  cursor: pointer;
}
```

### Gift Opening Flow
1. Tap "Open Gift"
2. Full-screen gift animation plays
3. Message reveals below
4. Option to react or send gift back

---

## 8.6 Message Reactions

### Quick React Bar (on hover/long-press)
```
          ╭─────────────────────────────────╮
          │  ❤️  😂  😮  😢  👍  ➕        │
          ╰─────────────────────────────────╯
                        ▼
┌─────────────────────────────────────────┐
│ Good morning beautiful ☀️               │
│                                  9:42 AM│
└─────────────────────────────────────────┘
```

### Reaction Display
```css
.message-reactions {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.message-reaction {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  font-size: 14px;
}

.message-reaction.mine {
  background: rgba(224, 159, 125, 0.15);
  border-color: rgba(224, 159, 125, 0.3);
}
```

---

# 9. Message Input & Actions

## 9.1 Input Bar Design

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  [+]  ┌────────────────────────────────────────────┐  [👁️] [🎤] [📷]    │
│       │ Type a message...                          │                    │
│       └────────────────────────────────────────────┘                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### CSS
```css
.message-input-bar {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(5, 5, 5, 0.9);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--border-subtle);
}

.message-input-actions {
  display: flex;
  align-items: center;
}

.message-input-action {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--stone);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--dur) var(--easing);
}

.message-input-action:hover {
  color: var(--sand);
  background: rgba(255, 255, 255, 0.05);
}

.message-input-action.active {
  color: var(--clay);
}

.message-input-field {
  flex: 1;
  min-height: 44px;
  max-height: 120px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  border-radius: 22px;
  color: var(--sand);
  font-size: 15px;
  resize: none;
  overflow-y: auto;
}

.message-input-field:focus {
  outline: none;
  border-color: var(--border-highlight);
}

.message-input-field::placeholder {
  color: var(--stone);
}

.message-send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--clay);
  border: none;
  color: var(--base);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--dur) var(--easing);
  opacity: 0;
  transform: scale(0.8);
}

.message-input-field:not(:placeholder-shown) ~ .message-send-btn {
  opacity: 1;
  transform: scale(1);
}

.message-send-btn:hover {
  transform: scale(1.1);
}
```

## 9.2 Attachment Menu (+)

### Expanded Menu
```
┌─────────────────────────────────────┐
│                                     │
│  📷 Photo or Video                  │
│  📄 Document                        │
│  🎵 Share a Song                    │
│  🎁 Send a Gift                     │
│  📍 Location                        │
│                                     │
└─────────────────────────────────────┘
      ▲
     [+]
```

### CSS
```css
.attachment-menu {
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 8px;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 8px;
  box-shadow: var(--shadow-2);
  min-width: 200px;
}

.attachment-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all var(--dur-2) var(--easing);
}

.attachment-menu-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.attachment-menu-item-icon {
  width: 20px;
  height: 20px;
}

.attachment-menu-item-label {
  font-size: 14px;
  color: var(--sand);
}
```

## 9.3 Voice Recording Interface

### Recording State
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│  🔴  Recording...  0:12            ┌──────────────────────┐    [✓] [✕]  │
│                                    │ ████████░░░░░░░░░░░░ │             │
│                                    └──────────────────────┘             │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### CSS
```css
.voice-recording-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: rgba(239, 68, 68, 0.1);
  border-top: 1px solid rgba(239, 68, 68, 0.3);
}

.voice-recording-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.voice-recording-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ef4444;
  animation: pulse-recording 1s infinite;
}

@keyframes pulse-recording {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.voice-recording-time {
  font-feature-settings: "tnum" 1;
  color: var(--sand);
}

.voice-recording-waveform {
  flex: 1;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voice-recording-actions {
  display: flex;
  gap: 8px;
}

.voice-recording-cancel,
.voice-recording-send {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voice-recording-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: var(--stone);
}

.voice-recording-send {
  background: var(--clay);
  color: var(--base);
}
```

### Recording Flow
1. Tap and hold microphone icon
2. Recording starts immediately
3. Slide left to cancel, release to preview
4. Or: Tap once to start, tap again to stop
5. Preview with playback option
6. Tap send or cancel

---

# 10. Special Message Features

## 10.1 Typing Indicator

```css
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: var(--stone);
  font-size: 13px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--stone);
  animation: typing-bounce 1.4s infinite;
}

.typing-dot:nth-child(1) { animation-delay: 0s; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}
```

## 10.2 Read Receipts

| Status | Icon | Meaning |
|--------|------|---------|
| Sending | ○ | Being sent |
| Sent | ✓ | Delivered to server |
| Delivered | ✓✓ | Delivered to device |
| Read | ✓✓ (blue) | Partner has seen it |

## 10.3 Message Search

### Search Mode
```
┌─────────────────────────────────────────────────────────────────────────┐
│  🔍  Search messages                                           ✕ Close │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  🔍  "coffee"                                                     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  3 results                                                              │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Jan 1, 2025                                                      │ │
│  │  "Morning! I made you **coffee** ☕"                               │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Dec 28, 2024                                                     │ │
│  │  "Want to grab **coffee** this weekend?"                          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Features
- Highlights matching text
- Click result to jump to message in context
- Search by date range
- Filter by message type

---

# 11. Integration Points

## 11.1 Messages → Moments

### Save Message as Quote
- Long-press message → "Save to Moments"
- Creates quote moment with message text
- Links back to original message

### Save Photo to Moments
- Long-press photo → "Save to Moments"
- Creates photo moment with caption
- Original photo preserved

## 11.2 Games → Messages

### Discussion Prompts
After completing a game:
```
┌─────────────────────────────────────────┐
│                                         │
│  Want to discuss your answers?          │
│                                         │
│  [Continue to Messages]                 │
│                                         │
└─────────────────────────────────────────┘
```

Opens Messages with context:
```
┌─────────────────────────────────────────┐
│ [System message]                        │
│                                         │
│ You just answered: "What's something    │
│ you've never told anyone?"              │
│                                         │
│ Continue the conversation...            │
│                                         │
└─────────────────────────────────────────┘
```

## 11.3 Gifts → Messages

- Gifts appear as special message type
- Inline in conversation flow
- Links to full gift experience
- Save gift to favorites

## 11.4 Moments → Messages

### Share a Moment
- From any moment → Share icon
- Opens composer with moment preview
- Partner receives rich preview in chat

---

# 12. Monetization Touchpoints

## 12.1 Moments Monetization

### 7-Day History Limit (Free)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │  [Blurred moment preview]                             │ │
│  │                                                       │ │
│  │  🔒 This moment is from 8 days ago                    │ │
│  │                                                       │ │
│  │  Upgrade to Closer+ for unlimited history             │ │
│  │                                                       │ │
│  │  [Upgrade Now]                                        │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Premium Features
- Unlimited history (Closer+)
- Export moments as PDF (Closer Pro)
- Custom moment themes (Closer Pro)

## 12.2 Messages Monetization

### Voice Note Duration
| Tier | Max Duration |
|------|--------------|
| Free | 1 minute |
| Closer+ | 5 minutes |
| Closer Pro | Unlimited |

### Prompt when limit reached:
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Voice note limit reached                                   │
│                                                             │
│  Free accounts can send voice notes up to 1 minute.         │
│  Upgrade to Closer+ for 5-minute voice notes.              │
│                                                             │
│  [Upgrade]    [Send anyway (cropped)]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Send Gift from Messages
- Quick access to gift shop from attachment menu
- Premium gifts highlighted
- Purchase flow inline

## 12.3 Cross-Feature Upsells

### After Saving Moment
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ✓ Saved to Moments!                                        │
│                                                             │
│  💡 With Closer+, you can:                                  │
│  • Keep unlimited moments forever                          │
│  • Export your memories as a photo book                    │
│                                                             │
│  [Learn More]                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# Summary

This document provides complete design specifications for:

## Moments
- 3 view modes (Timeline, Grid, Calendar)
- 7 moment types with full visual specs
- Create flows for each type
- Lightbox and interaction patterns
- Search and filter functionality
- Monetization touchpoints

## Messages
- Complete chat interface design
- 6 message types with CSS
- Whisper reveal interaction
- Voice recording interface
- Attachment menu
- Reactions and read receipts
- Search functionality
- Integration with games, gifts, moments

Both systems are designed to:
- Maintain premium aesthetic
- Feel intimate, not cluttered
- Work seamlessly together
- Encourage engagement
- Support monetization without feeling pushy

---

*This document completes the Moments and Messages specifications.*
*Use with CLOSER_MASTER_SPECIFICATION.md and CLOSER_GAME_PAGES_DESIGN_SPEC.md for full coverage.*
