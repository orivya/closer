# CLOSER — Refinements & Gaps Analysis
## Expanding from Existing HTML Prototype Design

---

# Existing Design Foundation

The current `closer_world_class_premium_dashboard_refined_2026_clean.html` establishes an excellent premium aesthetic with:
- 5 core views (Home, Moments, Messages, Connect, Us)
- Design tokens (colors, typography, spacing, radii, shadows, motion)
- Desktop sidebar + mobile bottom navigation
- Surface card patterns with gradient borders
- Ambient background with clay/mist blobs
- Grain overlay texture
- Whisper message reveal interaction
- 3D card stack animation
- Timezone display, countdown, daily question card

**This foundation should be preserved and expanded upon.**

---

# Gap Analysis & Required Refinements

## 1. Language Updates Needed in Existing Files

### Connect View — "Sync Active" → Partner-aware
**Current (HTML prototype):**
```html
<span class="sync-text">Sync Active</span>
```

**Refined:**
```html
<span class="sync-text">[Partner Name] is here</span>
<!-- OR when offline: -->
<span class="sync-text">[Partner Name] is offline</span>
```

### Connect View — "Play Together" Section Header
**Current (line 1841):**
```html
<div class="section-head">Play Together</div>
```

**Refined:**
```html
<div class="section-head">Activities</div>
<!-- More neutral, less gamey -->
```

### Intimacy Deck Button — Add sync options
**Current (line 1773-1776):**
```html
<button class="btn btn-primary" type="button">
  <i data-lucide="sparkles" style="width: 16px"></i>
  Draw Card
</button>
```

**Refined — Add two buttons when partner online:**
```html
<div class="sync-buttons">
  <button class="btn btn-primary">Together</button>
  <button class="btn btn-ghost">I'll start</button>
</div>
```

---

## 2. Missing Pages to Design

### Authentication Pages (Not in the HTML prototype)
- [ ] `/login` — Login form
- [ ] `/signup` — Registration form
- [ ] `/forgot-password` — Password reset request
- [ ] `/reset-password` — New password form
- [ ] `/verify-email` — Email verification

**Design Notes:**
- Centered card layout, max-width 480px
- Same surface treatment as daily-card
- Social login buttons (Google, Apple)
- Ambient background should extend to these pages

### Onboarding Pages (Not in the HTML prototype)
- [ ] `/onboarding/profile` — Avatar + name
- [ ] `/onboarding/partner` — Invite code exchange
- [ ] `/onboarding/setup` — Timezone + anniversary

**Design Notes:**
- Step indicator at top (dots or progress bar)
- Same aesthetic as main app
- Large input fields following .input class pattern
- Celebration animation at completion

### Game Sub-pages (Referenced but not designed)

**Intimacy Deck Sub-pages:**
- [ ] `/connect/intimacy-deck` — Main deck view (expand from featured-hero)
- [ ] `/connect/intimacy-deck/draw` — Active card session
- [ ] `/connect/intimacy-deck/categories` — Category selection grid
- [ ] `/connect/intimacy-deck/history` — Past questions answered
- [ ] `/connect/intimacy-deck/custom` — Custom deck builder (premium)

**Hot Takes Sub-pages:**
- [ ] `/connect/hot-takes` — Topic preview
- [ ] `/connect/hot-takes/play` — Active debate view
- [ ] `/connect/hot-takes/results` — Vote comparison

**Would You Rather Sub-pages:**
- [ ] `/connect/would-you-rather` — Options preview
- [ ] `/connect/would-you-rather/play` — Choice selection
- [ ] `/connect/would-you-rather/results` — Comparison view

**Time Capsule Sub-pages:**
- [ ] `/connect/time-capsule` — Capsule list (active + opened)
- [ ] `/connect/time-capsule/create/date` — Create flow (Step 1)
- [ ] `/connect/time-capsule/create/message` — Create flow (Step 2)
- [ ] `/connect/time-capsule/create/media` — Create flow (Step 3)
- [ ] `/connect/time-capsule/create/preview` — Create flow (Step 4)
- [ ] `/connect/time-capsule/sealed` — Sealed confirmation
- [ ] `/connect/time-capsule/[id]` — View capsule detail (locked)
- [ ] `/connect/time-capsule/[id]/opened` — Opened capsule reveal

**Dream Builder Sub-pages:**
- [ ] `/connect/dream-builder` — Dreams list with progress
- [ ] `/connect/dream-builder/create/category` — Create flow (Step 1)
- [ ] `/connect/dream-builder/create/define` — Create flow (Step 2)
- [ ] `/connect/dream-builder/create/timeline` — Create flow (Step 3)
- [ ] `/connect/dream-builder/create/milestones` — Create flow (Step 4)
- [ ] `/connect/dream-builder/create/confirm` — Create flow (Step 5)
- [ ] `/connect/dream-builder/[id]` — Dream detail with milestones
- [ ] `/connect/dream-builder/[id]/edit` — Edit dream
- [ ] `/connect/dream-builder/completed` — Completed dreams archive

**Daily Rituals Sub-pages:**
- [ ] `/connect/rituals/morning` — Morning Hello compose
- [ ] `/connect/rituals/gratitude` — Gratitude input + reveal
- [ ] `/connect/rituals/goodnight` — Goodnight compose
- [ ] `/connect/rituals/weekly` — Weekly check-in questions

### Settings Sub-pages (Only Settings button exists)

**Currently in Us View (line 2027):**
```html
<button class="game-tile" style="flex-direction: row...">Settings</button>
```

**Needs expansion to:**
- [ ] `/us/edit-profile` — Avatar, name, timezone
- [ ] `/us/partner` — Anniversary, next visit, unlink
- [ ] `/us/notifications` — Toggle settings
- [ ] `/us/privacy` — Data controls
- [ ] `/us/subscription` — Plan management
- [ ] `/us/theme` — Custom colors (premium)
- [ ] `/us/achievements` — Badge gallery
- [ ] `/us/streaks` — Streak history
- [ ] `/us/data` — Data export
- [ ] `/us/help` — FAQ / support
- [ ] `/us/about` — App info
- [ ] `/us/terms` — Terms of service
- [ ] `/us/delete` — Delete account flow

### Virtual Gifts Pages (Not in existing design)
- [ ] `/gifts` — Gift shop main view
- [ ] `/gifts/[id]` — Gift detail with animation preview
- [ ] `/gifts/send` — Send gift flow
- [ ] `/gifts/history` — Sent/received gallery

### Error Pages (Not in existing design)
- [ ] `/404` — Not found
- [ ] `/500` — Server error
- [ ] `/offline` — PWA offline page

---

## 3. Component Refinements Needed

### Us/Profile View — Incomplete Stats

**Current (lines 2016-2025):**
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
</div>
```

**Refined — Add 2 more stats:**
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

### Us/Profile View — Missing Settings List

**Add after profile-stats:**
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
  <!-- Continue for all settings items -->
</nav>
```

**CSS needed:**
```css
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 24px;
}

.settings-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  transition: all var(--dur) var(--easing);
}

.settings-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--border-highlight);
  transform: translateX(4px);
}

.settings-item span {
  flex: 1;
  font-weight: 700;
}

.settings-item i:last-child {
  opacity: 0.5;
}
```

### Home View — Missing "Thinking of You" Quick Action

**Add near countdown or daily card:**
```html
<button class="thinking-btn" aria-label="Send thinking of you">
  <i data-lucide="heart"></i>
</button>
```

**CSS:**
```css
.thinking-btn {
  position: fixed;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(224, 159, 125, 0.1);
  border: 1px solid rgba(224, 159, 125, 0.2);
  color: var(--clay);
  cursor: pointer;
  transition: all var(--dur) var(--easing);
  z-index: 50;
}

.thinking-btn:hover {
  background: rgba(224, 159, 125, 0.2);
  transform: scale(1.1);
}

.thinking-btn:active {
  transform: scale(0.95);
}
```

### Messages View — Missing Voice Note UI

**Add voice note bubble type:**
```html
<div class="chat-bubble me voice-note">
  <button class="play-btn">
    <i data-lucide="play"></i>
  </button>
  <div class="waveform">
    <!-- SVG or canvas waveform -->
  </div>
  <span class="duration">0:42</span>
</div>
```

**CSS:**
```css
.voice-note {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.play-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--clay);
  border: none;
  color: var(--base);
  cursor: pointer;
  flex-shrink: 0;
}

.waveform {
  flex: 1;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.duration {
  font-size: 12px;
  color: var(--stone);
  font-feature-settings: "tnum";
}
```

### Messages View — Missing Photo Bubble

**Add photo message type:**
```html
<div class="chat-bubble me photo-bubble">
  <img src="..." alt="Shared photo" class="chat-photo" />
  <span class="photo-time">9:45 PM</span>
</div>
```

**CSS:**
```css
.photo-bubble {
  padding: 4px;
  max-width: 280px;
}

.chat-photo {
  width: 100%;
  border-radius: 18px;
  display: block;
}

.photo-time {
  display: block;
  text-align: right;
  font-size: 10px;
  color: var(--stone);
  margin-top: 4px;
  padding: 0 8px;
}
```

### Moments View — Missing Milestone Card

**Add milestone moment type:**
```html
<div class="milestone-card surface">
  <div class="milestone-icon">
    <i data-lucide="trophy"></i>
  </div>
  <div class="milestone-content">
    <h4>100 Days Together</h4>
    <p>December 15, 2025</p>
  </div>
</div>
```

**CSS:**
```css
.milestone-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 24px;
}

.milestone-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--clay-glow), var(--mist-glow));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--sand);
}

.milestone-content h4 {
  font-family: var(--font-serif);
  font-size: 20px;
  color: var(--sand);
  margin-bottom: 4px;
}

.milestone-content p {
  font-size: 13px;
  color: var(--stone);
}
```

---

## 4. Missing Modals & Overlays

### Confirmation Modal
**Use cases:** Delete, unlink partner, log out

```html
<div class="modal-overlay">
  <div class="modal-container">
    <h3>Are you sure?</h3>
    <p>This action cannot be undone.</p>
    <div class="modal-actions">
      <button class="btn btn-ghost">Cancel</button>
      <button class="btn btn-danger">Delete</button>
    </div>
  </div>
</div>
```

### Card Reveal Modal
**Use case:** Intimacy Deck question reveal

```html
<div class="modal-overlay">
  <div class="card-reveal-modal">
    <div class="category-badge">Deep Connection</div>
    <h2 class="question-text">"What's something you've never told anyone?"</h2>
    <textarea placeholder="Your answer..."></textarea>
    <div class="modal-actions">
      <button class="btn btn-ghost">Skip</button>
      <button class="btn btn-primary">Submit</button>
    </div>
  </div>
</div>
```

### Photo Viewer Modal
**Use case:** Full-screen photo from Moments

```html
<div class="photo-viewer-overlay">
  <button class="close-viewer">×</button>
  <img src="..." alt="Full photo" class="viewer-image" />
  <div class="viewer-caption">Morning Coffee</div>
</div>
```

### Gift Received Animation Modal
**Use case:** Full-screen gift reveal

```html
<div class="gift-overlay">
  <div class="gift-animation-container">
    <!-- Lottie animation plays here -->
  </div>
  <div class="gift-message">
    <p>"Happy anniversary, my love"</p>
    <span>— From [Partner]</span>
  </div>
  <div class="gift-actions">
    <button class="btn btn-ghost">Send Gift Back</button>
    <button class="btn btn-primary">Reply</button>
  </div>
</div>
```

### Bottom Sheet (Mobile)
**Use case:** Action menus, quick options

```html
<div class="bottom-sheet">
  <div class="sheet-handle"></div>
  <div class="sheet-content">
    <button class="sheet-option">
      <i data-lucide="image"></i>
      Photo
    </button>
    <button class="sheet-option">
      <i data-lucide="mic"></i>
      Voice Note
    </button>
    <button class="sheet-option">
      <i data-lucide="gift"></i>
      Send Gift
    </button>
  </div>
</div>
```

---

## 5. Animation Enhancements

### Answer Reveal Animation
**When both partners submit answers:**

```css
@keyframes slide-in-left {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.answer-reveal {
  display: flex;
  gap: 24px;
}

.answer-card.mine {
  animation: slide-in-left 600ms var(--easing);
}

.answer-card.theirs {
  animation: slide-in-right 600ms var(--easing) 200ms backwards;
}
```

### Streak Fire Animation
**For streak milestones:**

```css
@keyframes flame-flicker {
  0%, 100% { transform: scaleY(1); }
  25% { transform: scaleY(1.1) scaleX(0.95); }
  50% { transform: scaleY(0.95) scaleX(1.05); }
  75% { transform: scaleY(1.05); }
}

.streak-fire {
  animation: flame-flicker 0.8s infinite ease-in-out;
  color: var(--clay);
}
```

### Heart Burst Animation
**For celebrations:**

```css
@keyframes heart-burst {
  0% { transform: scale(0); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(0.8); opacity: 0; }
}

.burst-heart {
  position: absolute;
  animation: heart-burst 1s ease-out forwards;
}
```

### Capsule Seal Animation
**When sealing a time capsule:**

```css
@keyframes seal-stamp {
  0% { transform: scale(2) rotate(-20deg); opacity: 0; }
  50% { transform: scale(1.1) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

.capsule-seal {
  animation: seal-stamp 800ms var(--easing);
}
```

---

## 6. Desktop-Specific Refinements

### Wider Content Area for Desktop
**Current container max-width is 980px — good for most views**

**For specific views, consider wider layouts:**

```css
/* Messages could use more width on large screens */
@media (min-width: 1280px) {
  .chat-container {
    max-width: 720px;
  }
}

/* Moments grid could expand */
@media (min-width: 1280px) {
  #moments-view .container {
    max-width: 1140px;
  }
}
```

### Hover States Enhancement
**Add more sophisticated hover feedback:**

```css
/* Game tile enhanced hover */
.game-tile:hover {
  background: rgba(255, 255, 255, 0.045);
  border-color: var(--border-highlight);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* Add subtle glow on hover */
.game-tile:hover .game-icon.icon-clay {
  box-shadow: 0 0 20px rgba(224, 159, 125, 0.3);
}

.game-tile:hover .game-icon.icon-mist {
  box-shadow: 0 0 20px rgba(196, 181, 253, 0.3);
}
```

### Keyboard Navigation Enhancement
**Already has skip-link, add keyboard shortcuts:**

```javascript
// Add to script section
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  const shortcuts = {
    '1': 'home',
    '2': 'moments',
    '3': 'messages',
    '4': 'connect',
    '5': 'us'
  };

  if (shortcuts[e.key]) {
    e.preventDefault();
    navigateTo(shortcuts[e.key]);
  }
});
```

---

## 7. Missing CSS Utilities

### Button Variants Not in Current CSS

```css
/* Danger button (for destructive actions) */
.btn-danger {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.25);
}

/* Ghost button */
.btn-ghost {
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--sand);
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border-highlight);
}

/* Small button variant */
.btn-sm {
  padding: 8px 14px;
  font-size: 13px;
  border-radius: 12px;
}

/* Full width button */
.btn-full {
  width: 100%;
}
```

### Input Field Styles Not in Current CSS

```css
.input {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-md);
  padding: 14px 18px;
  color: var(--sand);
  font-size: 15px;
  transition: all var(--dur) var(--easing);
}

.input:focus {
  outline: none;
  border-color: var(--border-highlight);
  box-shadow: 0 0 0 4px var(--focus-ring);
}

.input::placeholder {
  color: var(--stone);
}

.input-error {
  border-color: rgba(239, 68, 68, 0.5);
}

.input-label {
  display: block;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--stone);
  margin-bottom: 8px;
}

.textarea {
  min-height: 120px;
  resize: vertical;
}
```

### Badge/Pill Variants

```css
/* Achievement badge */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.badge-clay {
  background: rgba(224, 159, 125, 0.15);
  border: 1px solid rgba(224, 159, 125, 0.3);
  color: var(--clay);
}

.badge-mist {
  background: rgba(196, 181, 253, 0.15);
  border: 1px solid rgba(196, 181, 253, 0.3);
  color: var(--mist);
}

.badge-gold {
  background: rgba(212, 175, 55, 0.15);
  border: 1px solid rgba(212, 175, 55, 0.3);
  color: #d4af37;
}

/* Premium badge */
.badge-premium {
  background: linear-gradient(135deg, rgba(224, 159, 125, 0.2), rgba(196, 181, 253, 0.2));
  border: 1px solid rgba(245, 230, 211, 0.2);
  color: var(--sand);
}
```

---

## 8. Notification System (Not in current design)

### Toast Notifications

```html
<div class="toast toast-success">
  <i data-lucide="check-circle"></i>
  <span>Message sent</span>
</div>
```

```css
.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--surface-1);
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  box-shadow: var(--shadow-2);
  z-index: 1000;
  opacity: 0;
  transition: all 400ms var(--easing);
}

.toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.toast-success {
  border-color: rgba(16, 185, 129, 0.3);
}

.toast-success i {
  color: #10b981;
}

.toast-error {
  border-color: rgba(239, 68, 68, 0.3);
}

.toast-error i {
  color: #ef4444;
}
```

### In-App Notification Badge

```css
.nav-item .badge-count {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--clay);
  color: var(--base);
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 9. Loading States (Minimal in current design)

### Skeleton Screens

```css
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 25%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0.03) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
  border-radius: var(--r-md);
}

@keyframes skeleton-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-text {
  height: 16px;
  width: 80%;
  margin-bottom: 8px;
}

.skeleton-text.short {
  width: 50%;
}

.skeleton-avatar {
  width: 74px;
  height: 74px;
  border-radius: 50%;
}

.skeleton-card {
  height: 200px;
}
```

### Loading Spinner

```css
.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-subtle);
  border-top-color: var(--clay);
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 10. Empty States (Not in current design)

### No Messages Yet

```html
<div class="empty-state">
  <div class="empty-illustration">
    <i data-lucide="message-circle" class="empty-icon"></i>
  </div>
  <h3>Start the conversation</h3>
  <p>Send your first message to [Partner]</p>
  <button class="btn btn-primary">Say Hello</button>
</div>
```

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 24px;
  min-height: 300px;
}

.empty-illustration {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.empty-icon {
  width: 32px;
  height: 32px;
  color: var(--stone);
}

.empty-state h3 {
  font-family: var(--font-serif);
  font-size: 24px;
  color: var(--sand);
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--stone);
  margin-bottom: 24px;
  max-width: 280px;
}
```

---

## 11. Form Validation (Not in current design)

```css
.form-group {
  margin-bottom: 20px;
}

.form-error {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #f87171;
  margin-top: 8px;
}

.form-hint {
  font-size: 12px;
  color: var(--stone);
  margin-top: 8px;
}

.input.invalid {
  border-color: rgba(239, 68, 68, 0.5);
}

.input.valid {
  border-color: rgba(16, 185, 129, 0.5);
}
```

---

## 12. Progressive Enhancement Opportunities

### Add View Transitions API (Already partially implemented)
The current code checks for `document.startViewTransition` — this is good.

### Add Page Transition Animations Between Routes
When navigating to sub-pages:

```css
@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes page-exit {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}
```

---

# Summary: What's Missing for V1

## Critical (Must have)
1. Authentication pages (login, signup, forgot password)
2. Onboarding flow (3 steps)
3. All game sub-pages (detailed views for each activity)
4. Settings sub-pages (profile, notifications, subscription)
5. Gift shop and gift receive experience
6. Modals (confirmation, card reveal, photo viewer)
7. Language updates ("Together" / "I'll start", partner names)

## Important (Should have)
1. Voice note and photo message types in Messages
2. Milestone card type in Moments
3. Empty states for all views
4. Loading/skeleton states
5. Toast notification system
6. Form validation styling
7. More button/input variants

## Nice to Have (Could have)
1. Advanced animations (heart burst, seal animation)
2. Keyboard shortcuts beyond nav
3. Progressive enhancement for view transitions
4. Haptic feedback integration (mobile)
5. Sound effects (optional, off by default)

---

# Recommended Implementation Order

## Phase 1: Core Experience Pages (Design First)
*These establish the interaction patterns and component library for all other pages*

1. **Game Pages** — Design these first to establish the core interaction aesthetic
   - Intimacy Deck (5 pages) — Featured activity, sets the tone
   - Hot Takes (3 pages) — Debate/voting patterns
   - Would You Rather (3 pages) — Choice selection patterns
   - Time Capsule (3 pages) — Creation flow patterns
   - Dream Builder (3 pages) — Progress/milestone patterns
   - Daily Rituals (4 pages) — Input/compose patterns

2. **Gift Shop & Virtual Gifts** (5 pages) — Monetization, high-impact visuals

## Phase 2: User Journey Pages
3. **Authentication Pages** (5 pages) — Login, signup, password flows
4. **Onboarding Flow** (3 pages) — Profile, partner invite, setup

## Phase 3: Supporting Pages
5. **Settings Sub-pages** (8 pages) — Complete the Us view
6. **Modals & Overlays** — Reusable confirmation, reveal, photo viewer
7. **Error Pages** (3 pages) — 404, 500, offline

## Phase 4: Polish & Refinement
8. **Language Updates** — Update existing HTML with "Together" / "I'll start"
9. **Component Additions** — Loading states, empty states, toast notifications
10. **Animation Enhancements** — Answer reveals, celebrations, transitions

---

**Rationale for Game-First Approach:**
- Games represent 28 of 94 pages (~30% of the app)
- They contain the most complex interactions (sync play, answer reveals, progress tracking)
- Components designed here (buttons, cards, progress bars, modals) will be reused everywhere
- Establishes the "intimate, not gamey" language throughout
- Ensures visual consistency before designing simpler pages

---

*This document identifies gaps between the existing HTML prototype design and the complete V1 specification.*
*All refinements should maintain the established design DNA and aesthetic.*
