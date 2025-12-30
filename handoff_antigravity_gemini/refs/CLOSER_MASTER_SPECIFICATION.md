# CLOSER — Master Specification Document
## Complete V1 Implementation Guide — Desktop-First Design

---

# Table of Contents

1. [Document Overview](#document-overview)
2. [Key Updates from Previous Versions](#key-updates-from-previous-versions)
3. [Complete Page Inventory](#complete-page-inventory)
4. [Desktop-First Design Considerations](#desktop-first-design-considerations)
5. [Refinement Phases (5-10 Phases, 10-20 Stages Each)](#refinement-phases)
6. [Virtual Gift System — Detailed Design Specifications](#virtual-gift-system--detailed-design-specifications)
7. [Monetization Strategy — Expanded](#monetization-strategy--expanded)
8. [AI/API Integration Opportunities](#aiapi-integration-opportunities)
9. [50 Couple User Personas](#50-couple-user-personas)
10. [User Flow Analysis](#user-flow-analysis)
11. [Integration Checklist](#integration-checklist)
12. [Final Cohesion Review](#final-cohesion-review)

---

# Document Overview

This master specification supersedes all previous documents and consolidates:
- `CLOSER_BUSINESS_BLUEPRINT.md`
- `CLOSER_PAGES_SPECIFICATION.md`
- `CLOSER_REFINED_SPECIFICATION.md`
- `CLOSER_DESIGN_DNA.md`

**Key Principles:**
- Desktop website first, mobile apps (iOS/Android) later
- 100% digital experience — no physical products in V1
- No voice/video features in V1 — couples use their preferred calling apps alongside Closer
- Intimate, mature language — not gamey
- Premium aesthetic aligned with Design DNA
- Direct purchases — no virtual currency

---

# Key Updates from Previous Versions

## Language Refinements

| Previous (Gamey) | Updated (Intimate) |
|------------------|-------------------|
| "Play Together" | **Together** |
| "Play Solo" | **I'll start** |
| "Sync Active" | **[Partner Name] is here** |
| "Waiting for partner" | **Waiting for [Partner Name]...** |
| "Player 1 / Player 2" | Use actual partner names |
| "Score" | Removed — focus on shared experience |
| "Coins" | Removed — direct purchases |

## Removed Features (Not in V1)

- Voice chat during games
- Video calling
- Physical gift integrations
- Watch party features
- Virtual currency system
- Booking/scheduling features

## Added Features

- "Together" / "I'll start" sync system for all Connect activities
- Detailed virtual gift animations and design specs
- Enhanced notification timing based on partner timezone
- Comprehensive achievement system (50+ achievements)
- Streak freeze for premium users

---

# App Route Inventory (V1)

This inventory focuses on **authenticated app routes** and core app-adjacent flows (auth, onboarding, gifts, utility).
For the complete route map across marketing + legal + payment results (and the required screen states), see `CLOSER_CANONICAL_ROUTES_AND_SCREEN_STATES.md`.

## Total Authenticated App Routes: **92**

### Authentication & Onboarding (8 routes)
| Page | URL | Desktop Layout | Notes |
|---|---|---|---|
| Login | /login | Centered card, 480px max-width |  |
| Signup | /signup | Centered card, 480px max-width |  |
| Forgot Password | /forgot-password | Centered card | “Email sent” is a screen state |
| Reset Password | /reset-password | Centered card | “Success / invalid token” are screen states |
| Verify Email | /verify-email | Centered card |  |
| Onboarding Profile | /onboarding/profile | Stepped wizard, sidebar progress |  |
| Onboarding Partner | /onboarding/partner | Stepped wizard | Inviter vs joiner states |
| Onboarding Setup | /onboarding/setup | Stepped wizard | Includes timezone + anniversary + completion states |

### Core Views (5 routes)
| Page | URL | Desktop Layout |
|---|---|---|
| Home | / | Single column, max-width 980px |
| Connect | /connect | Grid layout, featured hero |
| Messages | /messages | Two-column: thread list + chat (future: single chat for V1) |
| Moments | /moments | Timeline with calendar, masonry grid |
| Us/Profile | /us | Stats grid + settings list |

### Intimacy Deck (12 routes)
| Page | URL | Desktop Layout |
|---|---|---|
| Deck Home | /connect/intimacy-deck | Card stack center, stats sidebar |
| Category Select | /connect/intimacy-deck/categories | Grid of category cards |
| Draw Card | /connect/intimacy-deck/draw | Full modal overlay |
| Answer Input | /connect/intimacy-deck/answer | Split view: question + input |
| Waiting for Partner | /connect/intimacy-deck/waiting | Animated waiting state |
| Reveal Together | /connect/intimacy-deck/reveal | Side-by-side answers |
| Save to Moments | /connect/intimacy-deck/save | Preview + save dialog |
| Discussion Prompt | /connect/intimacy-deck/discuss | Links to Messages |
| History | /connect/intimacy-deck/history | List view with filters |
| Favorites | /connect/intimacy-deck/favorites | Grid of saved questions |
| Custom Deck | /connect/intimacy-deck/custom | Deck builder (premium) |
| Deck Stats | /connect/intimacy-deck/stats | Dashboard with progress |

### Hot Takes (8 routes)
| Page | URL | Desktop Layout |
|---|---|---|
| Hot Takes Home | /connect/hot-takes | Category selection + preview |
| Category Select | /connect/hot-takes/categories | Grid of category pills |
| Topic Display | /connect/hot-takes/play | Large centered topic card |
| Vote Screen | /connect/hot-takes/vote | Two large buttons side-by-side |
| Waiting | /connect/hot-takes/waiting | Animated waiting state |
| Results Reveal | /connect/hot-takes/results | Animated bar comparison |
| Discussion | /connect/hot-takes/discuss | Topic + chat link |
| History | /connect/hot-takes/history | List of past debates |

### Would You Rather (7 routes)
| Page | URL | Desktop Layout |
|---|---|---|
| WYR Home | /connect/would-you-rather | Preview + categories |
| Category Select | /connect/would-you-rather/categories | Grid selection |
| Options Display | /connect/would-you-rather/play | Two large option cards |
| Choice Made | /connect/would-you-rather/chosen | Selected option highlighted |
| Waiting | /connect/would-you-rather/waiting | Animated waiting |
| Results | /connect/would-you-rather/results | Side-by-side choices |
| History | /connect/would-you-rather/history | Past choices list |

### Time Capsule (8 routes)
| Page | URL | Desktop Layout |
|---|---|---|
| Capsule Home | /connect/time-capsule | Active capsules grid |
| Create: Date | /connect/time-capsule/create/date | Calendar picker |
| Create: Message | /connect/time-capsule/create/message | Rich text editor |
| Create: Media | /connect/time-capsule/create/media | Media upload area |
| Create: Preview | /connect/time-capsule/create/preview | Full preview |
| Sealed Confirmation | /connect/time-capsule/sealed | Animation + countdown |
| View Capsule | /connect/time-capsule/[id] | Locked view |
| Opened Capsule | /connect/time-capsule/[id]/opened | Revealed content |

### Dream Builder (9 routes)
| Page | URL | Desktop Layout |
|---|---|---|
| Dreams Home | /connect/dream-builder | Dreams grid with progress |
| Create: Category | /connect/dream-builder/create/category | Category icon grid |
| Create: Define | /connect/dream-builder/create/define | Large text input |
| Create: Timeline | /connect/dream-builder/create/timeline | Date picker |
| Create: Milestones | /connect/dream-builder/create/milestones | Draggable list builder |
| Create: Confirm | /connect/dream-builder/create/confirm | Full preview |
| Dream Detail | /connect/dream-builder/[id] | Progress view with checklist |
| Edit Dream | /connect/dream-builder/[id]/edit | Edit form |
| Completed Dreams | /connect/dream-builder/completed | Archive grid |

### Daily Rituals (12 routes)
| Page | URL | Desktop Layout | Notes |
|---|---|---|---|
| Rituals Home | /connect/rituals | Ritual cards list |  |
| Morning Hello | /connect/rituals/morning | Quick action card |  |
| Morning: Compose | /connect/rituals/morning/compose | Message composer |  |
| Morning: Sent | /connect/rituals/morning/sent | Confirmation |  |
| Gratitude | /connect/rituals/gratitude | Prompt + input |  |
| Gratitude: Input | /connect/rituals/gratitude/input | Text area |  |
| Gratitude: Share | /connect/rituals/gratitude/share | Side-by-side reveal |  |
| Goodnight | /connect/rituals/goodnight | Quick action card |  |
| Goodnight: Compose | /connect/rituals/goodnight/compose | Message composer |  |
| Thinking of You | /connect/rituals/thinking | One-tap send |  |
| Weekly Check-in | /connect/rituals/weekly | Question flow | Waiting/reveal are screen states |
| Ritual History | /connect/rituals/history | Timeline of rituals |  |

### Settings & Profile (13 routes under `/us`)
| Page | URL | Desktop Layout |
|---|---|---|
| Edit Profile | /us/edit-profile | Form layout |
| Partner Settings | /us/partner | Relationship settings |
| Notifications | /us/notifications | Toggle lists |
| Privacy | /us/privacy | Toggle lists |
| Subscription | /us/subscription | Plan cards |
| Theme | /us/theme | Color pickers |
| Achievements | /us/achievements | Badge gallery grid |
| Streaks | /us/streaks | Streak calendar |
| Data Export | /us/data | Export options |
| Help | /us/help | FAQ accordion |
| About | /us/about | Credits list |
| Terms | /us/terms | Legal text |
| Delete Account | /us/delete | Confirmation flow |

### Virtual Gifts (6 routes)
| Page | URL | Desktop Layout |
|---|---|---|
| Gift Shop | /gifts | Category tabs + gift grid |
| Gift Detail | /gifts/[id] | Large preview + animation |
| Send Gift | /gifts/send | Recipient + message |
| Gift Received | /gifts/received | Animation + message |
| Gift History | /gifts/history | Sent/received tabs |
| Gift Bundles | /gifts/bundles | Bundle cards |

### Error & Utility (4 routes)
| Page | URL | Desktop Layout |
|---|---|---|
| 404 Not Found | /404 | Centered illustration |
| 500 Error | /500 | Centered illustration |
| Maintenance | /maintenance | Centered message |
| Offline | /offline | Service worker page |

> Loading / empty / success / error states are treated as **screen states** (not routes) and are specified throughout the refinement phases and the component library sections.

---

# Desktop-First Design Considerations

## Why Desktop First

1. **Development Flow**: Easier to simplify from desktop → mobile than expand mobile → desktop
2. **Feature Completeness**: All features available on desktop, progressively enhanced for mobile
3. **Link-in-Bio Use Case**: While mentioned as mobile-first use case, initial development is desktop
4. **PWA Foundation**: Desktop web app becomes PWA, then native apps

## Desktop Layout Patterns

### Main Shell
```
┌─────────────────────────────────────────────────────────────┐
│ ┌──────┐ ┌─────────────────────────────────────────────────┐│
│ │      │ │                                                 ││
│ │ SIDE │ │              MAIN CONTENT                       ││
│ │ BAR  │ │                                                 ││
│ │ 92px │ │              max-width: 980px                   ││
│ │      │ │              centered                            ││
│ │      │ │                                                 ││
│ └──────┘ └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Sidebar Navigation (Desktop)
- Fixed position left
- Width: 92px
- Height: 100vh
- Background: rgba(5, 5, 5, 0.86) + backdrop-filter: blur(22px)
- Contains: Logo, 5 nav items, keyboard hints (optional)

### Content Area
- Max-width: 980px
- Centered with auto margins
- Padding: clamp(28px, 4vw, 56px) horizontal
- Full height scrollable

### Modal/Overlay Behavior (Desktop)
- Centered in viewport
- Max-width: 640px for standard modals
- Max-width: 480px for confirmation dialogs
- Backdrop: rgba(0, 0, 0, 0.6) + backdrop-filter: blur(8px)

### Grid Systems

**Games Grid (Desktop)**:
```css
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}
```

**Moments Grid (Desktop)**:
```css
.moments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}
```

**Stats Grid (Desktop)**:
```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
```

## Responsive Breakpoints (Desktop First)

```css
/* Desktop (default) */
.container { max-width: 980px; }

/* Large Desktop */
@media (min-width: 1280px) {
  .container { max-width: 1140px; }
}

/* Tablet */
@media (max-width: 1024px) {
  .sidebar { width: 72px; }
  .games-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile */
@media (max-width: 768px) {
  .sidebar { display: none; }
  .mobile-nav { display: flex; }
  .games-grid { grid-template-columns: 1fr; }
}
```

---

# Refinement Phases

## Phase 1: Core Foundation Refinement (20 stages)

### Stage 1.1: Authentication Flow Audit
- [ ] Verify login/signup form validation
- [ ] Test social auth integration points
- [ ] Check password strength requirements
- [ ] Validate email verification flow
- [ ] Test forgot password complete journey

### Stage 1.2: Onboarding Experience
- [ ] Review step indicators and progress
- [ ] Validate partner invite code generation
- [ ] Test timezone auto-detection
- [ ] Check anniversary date picker UX
- [ ] Verify couple link confirmation flow

### Stage 1.3: Navigation System
- [ ] Desktop sidebar hover states
- [ ] Active state indicators
- [ ] Keyboard navigation (1-5 shortcuts)
- [ ] Mobile bottom nav safe areas
- [ ] View transition animations

### Stage 1.4: Home View Components
- [ ] Timezone pill accuracy and updates
- [ ] Connection visual animations
- [ ] Countdown component edge cases (0 days, negative)
- [ ] Daily card interaction states
- [ ] Partner avatar display logic

### Stage 1.5: Typography System
- [ ] Fraunces font loading strategy
- [ ] Manrope font loading strategy
- [ ] Type scale across all breakpoints
- [ ] Line heights and letter spacing
- [ ] Font feature settings (tabular nums)

### Stage 1.6: Color System
- [ ] CSS custom properties organization
- [ ] Gradient consistency across components
- [ ] Glow effect standardization
- [ ] Border color hierarchy
- [ ] Text color accessibility

### Stage 1.7: Spacing System
- [ ] Consistent spacing scale usage
- [ ] Component padding standards
- [ ] Grid gap consistency
- [ ] Section margin patterns
- [ ] Safe area handling

### Stage 1.8: Shadow System
- [ ] Shadow scale definition
- [ ] Card shadow consistency
- [ ] Button shadow states
- [ ] Modal shadow depth
- [ ] Glow vs shadow distinction

### Stage 1.9: Animation Standards
- [ ] Easing curve consistency
- [ ] Duration scale adherence
- [ ] Reduced motion support
- [ ] Animation performance audit
- [ ] Loading state animations

### Stage 1.10: Component Library Base
- [ ] Button variants complete
- [ ] Input field variants complete
- [ ] Card component patterns
- [ ] Badge/pill components
- [ ] Avatar component

### Stage 1.11: Icon System
- [ ] Lucide icon integration
- [ ] Icon sizing consistency
- [ ] Icon color patterns
- [ ] Custom icon requirements
- [ ] Icon accessibility (aria-labels)

### Stage 1.12: Form Patterns
- [ ] Label positioning
- [ ] Error state styling
- [ ] Help text styling
- [ ] Required field indicators
- [ ] Form validation UX

### Stage 1.13: Modal System
- [ ] Modal overlay consistency
- [ ] Close button positioning
- [ ] Escape key handling
- [ ] Focus trap implementation
- [ ] Modal animation patterns

### Stage 1.14: Loading States
- [ ] Skeleton screen patterns
- [ ] Spinner component
- [ ] Progress indicators
- [ ] Optimistic UI patterns
- [ ] Error recovery states

### Stage 1.15: Empty States
- [ ] Illustration style consistency
- [ ] Copy tone and voice
- [ ] Call-to-action buttons
- [ ] First-use experience
- [ ] No results states

### Stage 1.16: Error States
- [ ] Error message copy
- [ ] Inline error display
- [ ] Toast notification system
- [ ] Retry action patterns
- [ ] Graceful degradation

### Stage 1.17: Success States
- [ ] Confirmation messaging
- [ ] Success animations
- [ ] Celebration effects
- [ ] Next action prompts
- [ ] State persistence

### Stage 1.18: Accessibility Foundation
- [ ] Focus visible states
- [ ] Color contrast ratios
- [ ] Screen reader labels
- [ ] Keyboard navigation
- [ ] Touch target sizes

### Stage 1.19: Performance Baseline
- [ ] Initial load targets
- [ ] Image optimization
- [ ] Font loading strategy
- [ ] Bundle size analysis
- [ ] Caching strategy

### Stage 1.20: Desktop Layout Polish
- [ ] Maximum width constraints
- [ ] Centered content alignment
- [ ] Sidebar fixed positioning
- [ ] Scroll behavior
- [ ] Viewport handling

---

## Phase 2: Messaging System Refinement (15 stages)

### Stage 2.1: Chat Thread UX
- [ ] Message bubble styling
- [ ] Time stamp display logic
- [ ] Date separators
- [ ] Scroll behavior (stay at bottom)
- [ ] Unread indicator

### Stage 2.2: Message Types
- [ ] Text message styling
- [ ] Whisper message blur/reveal
- [ ] Voice note player
- [ ] Photo message display
- [ ] Emoji-only message styling

### Stage 2.3: Input Experience
- [ ] Text input auto-grow
- [ ] Emoji picker integration
- [ ] Attachment menu UX
- [ ] Send button states
- [ ] Character limits (if any)

### Stage 2.4: Whisper Messages
- [ ] Blur intensity calibration
- [ ] Hold-to-reveal timing (500ms)
- [ ] Desktop hover behavior
- [ ] Keyboard reveal (Space/Enter)
- [ ] Revealed state persistence

### Stage 2.5: Voice Notes
- [ ] Recording indicator
- [ ] Waveform visualization
- [ ] Playback controls
- [ ] Duration display
- [ ] Cancel recording gesture

### Stage 2.6: Photo Sharing
- [ ] Upload progress indicator
- [ ] Image compression
- [ ] Full-screen viewer
- [ ] Download option
- [ ] Multi-photo handling

### Stage 2.7: Reactions System
- [ ] Reaction picker UI
- [ ] Reaction display on messages
- [ ] Animation on add/remove
- [ ] Available reactions list
- [ ] Desktop quick-react

### Stage 2.8: Read Receipts
- [ ] Sent/Delivered/Read states
- [ ] Time stamp on read
- [ ] Icon indicators
- [ ] Privacy setting respect
- [ ] Batch read marking

### Stage 2.9: Typing Indicators
- [ ] Animation style
- [ ] Debounce logic
- [ ] Display duration
- [ ] Partner name display
- [ ] Multi-message typing

### Stage 2.10: Online Status
- [ ] Status indicator dot
- [ ] Last seen time
- [ ] Privacy setting respect
- [ ] Real-time updates
- [ ] Timezone-aware display

### Stage 2.11: Search Messages
- [ ] Search input UX
- [ ] Results highlighting
- [ ] Jump to message
- [ ] Filter by type
- [ ] Date range filter

### Stage 2.12: Message Actions
- [ ] Long-press menu (mobile)
- [ ] Right-click menu (desktop)
- [ ] Copy text action
- [ ] Delete message action
- [ ] Save to Moments action

### Stage 2.13: Notification Integration
- [ ] New message push
- [ ] Whisper received push
- [ ] In-app notification
- [ ] Sound effects (optional)
- [ ] Badge count sync

### Stage 2.14: Offline Handling
- [ ] Message queue
- [ ] Pending indicator
- [ ] Retry logic
- [ ] Sync on reconnect
- [ ] Offline indicator

### Stage 2.15: Desktop Chat Layout
- [ ] Header fixed positioning
- [ ] Thread scroll area
- [ ] Input fixed positioning
- [ ] Resize handling
- [ ] Focus management

---

## Phase 3: Connect Hub Refinement (18 stages)

### Stage 3.1: Connect Hub Layout
- [ ] Featured hero section
- [ ] Games grid layout
- [ ] Rituals horizontal scroll
- [ ] Section headers
- [ ] Quick action buttons

### Stage 3.2: Sync Status System
- [ ] Partner presence detection
- [ ] "Together" / "I'll start" UI
- [ ] Status indicator styling
- [ ] Real-time updates
- [ ] Offline partner handling

### Stage 3.3: Intimacy Deck — Core
- [ ] Card stack 3D effect
- [ ] Draw card animation
- [ ] Question display modal
- [ ] Category badge styling
- [ ] Card number indicator

### Stage 3.4: Intimacy Deck — Answer Flow
- [ ] Answer text input
- [ ] Submit button states
- [ ] Waiting for partner state
- [ ] Real-time answer sync
- [ ] Timeout handling

### Stage 3.5: Intimacy Deck — Reveal
- [ ] Both answers reveal animation
- [ ] Side-by-side display
- [ ] Celebrate match moment
- [ ] Save to Moments option
- [ ] Continue/Discuss options

### Stage 3.6: Intimacy Deck — Categories
- [ ] Category card design
- [ ] Lock icon for premium
- [ ] Progress per category
- [ ] Custom deck creation (premium)
- [ ] Category filtering

### Stage 3.7: Hot Takes — Core
- [ ] Topic card design
- [ ] Agree/Disagree buttons
- [ ] Vote lock animation
- [ ] Category selection
- [ ] Topic randomization

### Stage 3.8: Hot Takes — Results
- [ ] Bar chart comparison
- [ ] Match/mismatch messaging
- [ ] Discussion prompt
- [ ] Save to Moments
- [ ] Next topic action

### Stage 3.9: Would You Rather — Core
- [ ] Two option cards
- [ ] "OR" divider styling
- [ ] Option selection animation
- [ ] Lock-in confirmation
- [ ] Category selection

### Stage 3.10: Would You Rather — Results
- [ ] Choice comparison display
- [ ] Match celebration
- [ ] Mismatch discussion
- [ ] Reasoning input (optional)
- [ ] Save to Moments

### Stage 3.11: Time Capsule — Create
- [ ] Date picker presets
- [ ] Custom date validation
- [ ] Message composer
- [ ] Media attachments
- [ ] Preview before seal

### Stage 3.12: Time Capsule — Seal & Wait
- [ ] Seal animation
- [ ] Countdown display
- [ ] Locked capsule view
- [ ] Cannot edit state
- [ ] Notification scheduling

### Stage 3.13: Time Capsule — Unlock
- [ ] Unlock notification
- [ ] Open animation
- [ ] Content reveal
- [ ] Save to Moments
- [ ] Archive to opened list

### Stage 3.14: Dream Builder — Create
- [ ] Category icon selection
- [ ] Dream text input
- [ ] Timeline picker
- [ ] Milestone builder
- [ ] Partner approval flow

### Stage 3.15: Dream Builder — Progress
- [ ] Progress bar component
- [ ] Milestone checklist
- [ ] Partner updates sync
- [ ] Completion celebration
- [ ] Archive to completed

### Stage 3.16: Daily Rituals — Morning/Goodnight
- [ ] Quick send option
- [ ] Custom message option
- [ ] Photo attachment
- [ ] Streak tracking
- [ ] Time-based triggers

### Stage 3.17: Daily Rituals — Gratitude
- [ ] Prompt display
- [ ] Both partners input
- [ ] Reveal together
- [ ] Weekly summary
- [ ] Save option

### Stage 3.18: Daily Rituals — Thinking of You
- [ ] One-tap send
- [ ] Notification styling
- [ ] Heart animation
- [ ] Response option
- [ ] History tracking

---

## Phase 4: Moments System Refinement (12 stages)

### Stage 4.1: Timeline Layout
- [ ] Chronological feed
- [ ] Date grouping headers
- [ ] Infinite scroll
- [ ] Jump to date
- [ ] Empty state

### Stage 4.2: Calendar Strip
- [ ] Week view scroll
- [ ] Day selection state
- [ ] Has-moments indicator
- [ ] Today highlight
- [ ] Month navigation

### Stage 4.3: Photo Moments
- [ ] Polaroid card design
- [ ] Slight rotation effect
- [ ] Caption display
- [ ] Time stamp
- [ ] Hover/tap expand

### Stage 4.4: Song Moments
- [ ] Album art placeholder
- [ ] Equalizer animation
- [ ] Song title/artist
- [ ] Playback preview
- [ ] Streaming service link

### Stage 4.5: Quote Moments
- [ ] Quote card styling
- [ ] Attribution display
- [ ] Source badge
- [ ] Date stamp
- [ ] Share option

### Stage 4.6: Milestone Moments
- [ ] Celebration styling
- [ ] Icon selection
- [ ] Auto-generated vs custom
- [ ] Date display
- [ ] Badge connection

### Stage 4.7: Capsule Moments
- [ ] Opened capsule card
- [ ] Written date / opened date
- [ ] Message preview
- [ ] Full view link
- [ ] Special styling

### Stage 4.8: Dream Completed Moments
- [ ] Achievement card
- [ ] Journey summary
- [ ] Milestones completed
- [ ] Duration display
- [ ] Photo attachment option

### Stage 4.9: Add Moment Flow
- [ ] FAB button (mobile)
- [ ] Desktop add button
- [ ] Type selection
- [ ] Upload/input flow
- [ ] Confirmation

### Stage 4.10: Moment Actions
- [ ] View full/expand
- [ ] Edit caption
- [ ] Delete moment
- [ ] Share moment
- [ ] Move date (if applicable)

### Stage 4.11: Search & Filter
- [ ] Search by caption
- [ ] Filter by type
- [ ] Filter by date range
- [ ] Sort options
- [ ] Results display

### Stage 4.12: Desktop Moments Layout
- [ ] Grid vs timeline toggle
- [ ] Column count
- [ ] Card sizing
- [ ] Lightbox view
- [ ] Bulk actions

---

## Phase 5: Virtual Gifts Refinement (15 stages)

> Page-by-page gifts UI specs: `CLOSER_VIRTUAL_GIFTS_PAGES_DESIGN_SPEC.md`

### Stage 5.1: Gift Shop Layout
- [ ] Category tabs
- [ ] Gift grid display
- [ ] Price display
- [ ] Premium indicator
- [ ] Search/filter

### Stage 5.2: Gift Card Design
- [ ] Thumbnail preview
- [ ] Gift name
- [ ] Price or "Included" badge
- [ ] Hover animation preview
- [ ] Add to cart / Send action

### Stage 5.3: Gift Detail View
- [ ] Full animation preview (loop)
- [ ] Gift description
- [ ] Occasion suggestions
- [ ] Send button
- [ ] Bundle upsell

### Stage 5.4: Free Gifts (6)
- [ ] Heart animation
- [ ] Hug animation
- [ ] Kiss animation
- [ ] Star animation
- [ ] Sun animation
- [ ] Moon animation

### Stage 5.5: Premium Gifts (10)
- [ ] Heart Burst animation
- [ ] Flower Bouquet animation
- [ ] Love Letter animation
- [ ] Starry Night animation
- [ ] Warm Drink animation
- [ ] Sunset animation
- [ ] Rainbow animation
- [ ] Dancing Couple animation
- [ ] Fireflies animation
- [ ] Northern Lights animation

### Stage 5.6: Purchasable Gifts (10)
- [ ] Rose Garden ($0.99)
- [ ] Candlelight ($0.99)
- [ ] Fireworks ($1.99)
- [ ] Love Lock ($1.99)
- [ ] Memory Book ($2.99)
- [ ] Hot Air Balloon ($2.99)
- [ ] Galaxy ($3.99)
- [ ] Cherry Blossoms ($3.99)
- [ ] Lantern Festival ($4.99)
- [ ] Aurora Hearts ($4.99)

### Stage 5.7: Seasonal Gifts (8)
- [ ] Valentine's Rose
- [ ] Anniversary Crown
- [ ] New Year's Toast
- [ ] Spring Renewal
- [ ] Summer Love
- [ ] Autumn Leaves
- [ ] Winter Snowfall
- [ ] First Meeting

### Stage 5.8: Gift Bundles
- [ ] Starter Pack ($3.99)
- [ ] Romance Pack ($9.99)
- [ ] Celebration Pack ($9.99)
- [ ] Complete Collection ($29.99)
- [ ] Bundle savings display

### Stage 5.9: Send Gift Flow
- [ ] Select gift
- [ ] Add message (optional)
- [ ] Preview complete gift
- [ ] Payment (if applicable)
- [ ] Send confirmation

### Stage 5.10: Gift Received Experience
- [ ] Push notification
- [ ] App open experience
- [ ] Unwrap animation
- [ ] Gift reveal animation
- [ ] Message display

### Stage 5.11: Gift Response
- [ ] React to gift
- [ ] Send gift back
- [ ] Send message
- [ ] Save to favorites
- [ ] View in gallery

### Stage 5.12: Gift Gallery
- [ ] Received gifts tab
- [ ] Sent gifts tab
- [ ] Replay animation
- [ ] Date/sender info
- [ ] Favorites filter

### Stage 5.13: Gift Animation Specs
- [ ] Canvas vs Lottie decision
- [ ] Performance optimization
- [ ] Fallback for low-power
- [ ] Sound effects (optional)
- [ ] Haptics (optional)

### Stage 5.14: Gift Purchase Flow
- [ ] Stripe integration
- [ ] Apple Pay (future)
- [ ] Google Pay (future)
- [ ] Purchase confirmation
- [ ] Receipt handling

### Stage 5.15: Gift Availability
- [ ] Seasonal unlock logic
- [ ] Anniversary detection
- [ ] Limited time indicators
- [ ] Countdown for seasonal
- [ ] Notification for new gifts

---

## Phase 6: Profile & Settings Refinement (10 stages)

### Stage 6.1: Us Dashboard
- [ ] Stats display (4 metrics)
- [ ] Couple avatars
- [ ] Settings navigation
- [ ] Quick actions
- [ ] Achievement preview

### Stage 6.2: Edit Profile
- [ ] Avatar upload/crop
- [ ] Display name
- [ ] Timezone
- [ ] Bio (optional)
- [ ] Save confirmation

### Stage 6.3: Partner Settings
- [ ] Partner display
- [ ] Anniversary edit
- [ ] Next visit edit
- [ ] Unlink partner (with confirmation)
- [ ] Partner timezone

### Stage 6.4: Notification Settings
- [ ] Push notifications toggles
- [ ] Email notifications toggles
- [ ] Quiet hours
- [ ] Per-type controls
- [ ] Test notification

### Stage 6.5: Privacy Settings
- [ ] Online status toggle
- [ ] Typing indicator toggle
- [ ] Read receipts toggle
- [ ] Data download
- [ ] Clear data options

### Stage 6.6: Subscription Management
- [ ] Current plan display
- [ ] Plan comparison
- [ ] Upgrade flow
- [ ] Billing history
- [ ] Cancel subscription

### Stage 6.7: Theme Customization
- [ ] Color picker
- [ ] Preset themes
- [ ] Preview mode
- [ ] Save custom theme
- [ ] Premium lock

### Stage 6.8: Achievements Gallery
- [ ] Badge grid
- [ ] Locked vs unlocked
- [ ] Progress indicators
- [ ] Achievement detail
- [ ] Share achievement

### Stage 6.9: Streak Dashboard
- [ ] Current streak display
- [ ] Streak calendar
- [ ] Best streak history
- [ ] Streak freeze (premium)
- [ ] Streak milestones

### Stage 6.10: Help & Support
- [ ] FAQ sections
- [ ] Contact form
- [ ] Email support link
- [ ] Version info
- [ ] Terms/Privacy links

---

## Phase 7: Monetization Refinement (10 stages)

### Stage 7.1: Paywall UI
- [ ] Feature gates implementation
- [ ] Upgrade prompt styling
- [ ] Premium badge
- [ ] Plan comparison modal
- [ ] Trial CTA

### Stage 7.2: Subscription Tiers
- [ ] Free tier limits display
- [ ] Closer+ features display
- [ ] Closer Pro features display
- [ ] Annual vs monthly pricing
- [ ] Savings highlight

### Stage 7.3: Upgrade Triggers
- [ ] Day 3 card limit
- [ ] Day 7 memory access
- [ ] Day 14 streak protection
- [ ] Premium feature attempt
- [ ] Smart timing

### Stage 7.4: Stripe Integration
- [ ] Checkout flow
- [ ] Webhook handling
- [ ] Plan management
- [ ] Billing portal link
- [ ] Error handling

### Stage 7.5: Gift Purchases
- [ ] Individual gift purchase
- [ ] Bundle purchase
- [ ] One-click buy (saved card)
- [ ] Gift as gift (to partner)
- [ ] Receipt email

### Stage 7.6: Theme Purchases
- [ ] Theme pack pricing
- [ ] Theme preview
- [ ] Purchase confirmation
- [ ] Apply purchased theme
- [ ] Included with Pro

### Stage 7.7: Premium Feature Gating
- [ ] Custom decks gate
- [ ] Extended voice notes gate
- [ ] Unlimited capsules gate
- [ ] Analytics gate
- [ ] Export gate

### Stage 7.8: Trial Management
- [ ] Trial start trigger
- [ ] Trial period tracking
- [ ] Trial ending notification
- [ ] Conversion prompt
- [ ] Post-trial experience

### Stage 7.9: Billing UI
- [ ] Current plan
- [ ] Next billing date
- [ ] Payment method
- [ ] Update payment
- [ ] Billing history

### Stage 7.10: Cancellation Flow
- [ ] Cancel reason survey
- [ ] Retention offers
- [ ] Downgrade option
- [ ] Cancel confirmation
- [ ] Win-back email trigger

---

## Phase 8: Engagement Systems Refinement (12 stages)

### Stage 8.1: Streak System
- [ ] Streak calculation logic
- [ ] What counts as activity
- [ ] Streak display locations
- [ ] Streak warning timing
- [ ] Streak lost handling

### Stage 8.2: Streak Milestones
- [ ] 7-day reward
- [ ] 14-day reward
- [ ] 30-day reward
- [ ] 50-day reward
- [ ] 100-day reward
- [ ] 365-day reward

### Stage 8.3: Streak Freeze
- [ ] Premium feature gate
- [ ] 1 freeze per week
- [ ] Freeze indicator
- [ ] Freeze usage tracking
- [ ] Freeze restoration

### Stage 8.4: Achievements — Conversation
- [ ] First Words (first message)
- [ ] Chatterbox (100 messages)
- [ ] Novel Writer (1000 messages)
- [ ] Voice of Love (50 voice notes)
- [ ] Whisper Secret (first whisper)

### Stage 8.5: Achievements — Games
- [ ] Card Collector (50 cards)
- [ ] Deck Master (all categories)
- [ ] Hot Take Pro (25 debates)
- [ ] Choice Maker (25 WYR)
- [ ] Dream Team (complete dream)
- [ ] Time Traveler (5 capsules)

### Stage 8.6: Achievements — Rituals
- [ ] Early Bird (7 morning hellos)
- [ ] Night Owl (7 goodnights)
- [ ] Grateful Heart (30 gratitudes)
- [ ] Always Thinking (50 taps)
- [ ] Weekly Regular (10 check-ins)

### Stage 8.7: Achievements — Moments
- [ ] Memory Maker (10 moments)
- [ ] Archivist (100 moments)
- [ ] Music Lover (20 songs)
- [ ] Quotable (25 quotes)

### Stage 8.8: Achievement Unlock Experience
- [ ] Notification push
- [ ] In-app celebration
- [ ] Badge animation
- [ ] Share option
- [ ] Gallery update

### Stage 8.9: Notifications Strategy
- [ ] Push timing optimization
- [ ] Partner timezone respect
- [ ] Quiet hours respect
- [ ] Notification batching
- [ ] Smart frequency

### Stage 8.10: Re-engagement
- [ ] Streak warning push
- [ ] Partner activity nudge
- [ ] New feature announcement
- [ ] Special event reminders
- [ ] Win-back campaigns

### Stage 8.11: Weekly Summary
- [ ] Email generation
- [ ] Stats compilation
- [ ] Highlight moments
- [ ] Next week suggestions
- [ ] Unsubscribe option

### Stage 8.12: Milestone Celebrations
- [ ] Days together milestones
- [ ] Anniversary reminders
- [ ] First message anniversary
- [ ] Streak milestones
- [ ] Custom milestones

---

## Phase 9: Technical Polish (12 stages)

### Stage 9.1: Performance Optimization
- [ ] Image lazy loading
- [ ] Code splitting
- [ ] Bundle analysis
- [ ] Tree shaking
- [ ] CSS optimization

### Stage 9.2: Offline Support
- [ ] Service worker setup
- [ ] Offline page
- [ ] Cached message reading
- [ ] Offline indicator
- [ ] Sync on reconnect

### Stage 9.3: Real-time System
- [ ] Supabase Realtime channels
- [ ] Presence tracking
- [ ] Game state sync
- [ ] Message sync
- [ ] Reconnection handling

### Stage 9.4: Error Tracking
- [ ] Sentry integration
- [ ] Error boundaries
- [ ] User-friendly messages
- [ ] Debug logging
- [ ] Crash reporting

### Stage 9.5: Analytics
- [ ] Page view tracking
- [ ] Feature usage tracking
- [ ] Conversion tracking
- [ ] Funnel analysis
- [ ] Privacy compliance

### Stage 9.6: Testing — Unit
- [ ] Component tests
- [ ] Hook tests
- [ ] Utility tests
- [ ] Coverage targets
- [ ] CI integration

### Stage 9.7: Testing — Integration
- [ ] User flow tests
- [ ] API tests
- [ ] Real-time tests
- [ ] Payment tests
- [ ] Auth tests

### Stage 9.8: Testing — E2E
- [ ] Critical paths
- [ ] Cross-browser
- [ ] Mobile viewport
- [ ] Desktop viewport
- [ ] Accessibility

### Stage 9.9: Security
- [ ] Auth validation
- [ ] Input sanitization
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting

### Stage 9.10: SEO & Meta
- [ ] Page titles
- [ ] Meta descriptions
- [ ] Open Graph tags
- [ ] Twitter cards
- [ ] Favicon set

### Stage 9.11: PWA Setup
- [ ] Manifest.json
- [ ] App icons
- [ ] Splash screens
- [ ] Install prompt
- [ ] Offline fallback

### Stage 9.12: Production Readiness
- [ ] Environment variables
- [ ] Production database
- [ ] CDN configuration
- [ ] Domain setup
- [ ] SSL certificate

---

## Phase 10: Launch Preparation (10 stages)

### Stage 10.1: Content Audit
- [ ] All copy finalized
- [ ] Error messages reviewed
- [ ] Empty states reviewed
- [ ] Placeholder text removed
- [ ] Tone consistency check

### Stage 10.2: Legal Compliance
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookie Policy
- [ ] GDPR compliance
- [ ] Age verification

### Stage 10.3: Accessibility Audit
- [ ] Screen reader testing
- [ ] Keyboard navigation
- [ ] Color contrast check
- [ ] Focus management
- [ ] ARIA labels

### Stage 10.4: Cross-browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### Stage 10.5: Performance Audit
- [ ] Lighthouse score
- [ ] Core Web Vitals
- [ ] Load time benchmarks
- [ ] Animation performance
- [ ] Memory usage

### Stage 10.6: Security Audit
- [ ] Penetration testing
- [ ] Dependency audit
- [ ] API security
- [ ] Data encryption
- [ ] Auth vulnerabilities

### Stage 10.7: Monitoring Setup
- [ ] Uptime monitoring
- [ ] Error alerting
- [ ] Performance monitoring
- [ ] User analytics
- [ ] Cost monitoring

### Stage 10.8: Backup & Recovery
- [ ] Database backups
- [ ] Backup schedule
- [ ] Recovery testing
- [ ] Disaster plan
- [ ] Data retention

### Stage 10.9: Support Setup
- [ ] Help documentation
- [ ] FAQ content
- [ ] Contact methods
- [ ] Response SLAs
- [ ] Escalation paths

### Stage 10.10: Launch Checklist
- [ ] All features tested
- [ ] All pages accessible
- [ ] All payments working
- [ ] All notifications working
- [ ] Rollback plan ready

---

# Virtual Gift System — Detailed Design Specifications

## Animation Technical Approach

All gift animations should use **Lottie** files for:
- Smaller file sizes
- Smooth 60fps animations
- Easy color customization
- Cross-platform compatibility

## Gift Design Language

Every gift animation follows the Closer design DNA:
- **Color palette**: Clay (#e09f7d), Mist (#c4b5fd), Sand (#f5e6d3)
- **Glow effects**: Subtle radial gradients
- **Motion**: Organic, spring-like easing (cubic-bezier(0.16, 1, 0.3, 1))
- **Duration**: 3-5 seconds for full animation
- **Loop**: Most gifts loop seamlessly for preview, but play once on receive

## Complete Gift Specifications

### Free Gifts (6)

#### 1. Heart
- **Animation**: Single heart rises from bottom center, gently floats upward with subtle wobble, fades at top
- **Duration**: 2.5 seconds
- **Colors**: --clay gradient
- **Size**: 120px at peak
- **Occasions**: Anytime, quick "I love you"

#### 2. Hug
- **Animation**: Two figure silhouettes approach from sides, meet in center, arms wrap around, gentle pulse
- **Duration**: 3 seconds
- **Colors**: --sand silhouettes on --base
- **Size**: Full width, 200px height
- **Occasions**: Comfort, support, missing you

#### 3. Kiss
- **Animation**: Lips shape appears, blows kiss that transforms into heart, heart floats with sparkle trail
- **Duration**: 3 seconds
- **Colors**: --clay lips, --mist sparkles
- **Size**: Lips 80px, heart travels across screen
- **Occasions**: Affection, goodnight

#### 4. Star
- **Animation**: Shooting star arcs across screen, leaves sparkling trail that fades
- **Duration**: 2 seconds
- **Colors**: Gold (#d4af37) with --sand sparkles
- **Size**: Full width arc
- **Occasions**: Encouragement, congratulations

#### 5. Sun
- **Animation**: Sun rises from bottom, rays extend outward with subtle animation, warmth glow expands
- **Duration**: 3.5 seconds
- **Colors**: Gold gradient to --clay
- **Size**: Sun 100px, rays extend 200px
- **Occasions**: Good morning, positivity

#### 6. Moon
- **Animation**: Crescent moon fades in with stars twinkling around, gentle glow pulse
- **Duration**: 4 seconds
- **Colors**: --sand moon, --mist stars
- **Size**: Moon 90px, stars scattered
- **Occasions**: Goodnight, peaceful

### Premium Gifts (10) — Included with Closer+

#### 7. Heart Burst
- **Animation**: Center heart builds up, explodes into 15-20 smaller hearts that scatter outward, gentle fall
- **Duration**: 4 seconds
- **Colors**: --clay to --mist gradient hearts
- **Size**: Central heart 80px, explosion 300px radius
- **Occasions**: Big love moment, celebration

#### 8. Flower Bouquet
- **Animation**: Vase appears, flowers grow from stems one by one (5-7 flowers), petals unfurl, gentle sway
- **Duration**: 5 seconds
- **Colors**: --clay, --mist, rose (#e88c9f) flowers, green stems
- **Size**: 200px × 250px
- **Occasions**: Appreciation, apology, romance

#### 9. Love Letter
- **Animation**: Envelope floats down, opens, letter unfolds with cursive "I love you", hearts float out
- **Duration**: 4.5 seconds
- **Colors**: --sand envelope, --base letter, --clay script
- **Size**: Envelope 150px, expands to 200px
- **Occasions**: Deep message, meaningful

#### 10. Starry Night
- **Animation**: Night sky fills screen, stars appear one by one, shooting star crosses, aurora shimmer at horizon
- **Duration**: 6 seconds
- **Colors**: Deep purple sky, --sand stars, --mist aurora
- **Size**: Full screen
- **Occasions**: Romantic evening, special

#### 11. Warm Drink
- **Animation**: Mug appears with steam rising, steam forms heart shape, cozy glow around mug
- **Duration**: 4 seconds
- **Colors**: --clay mug, --sand steam
- **Size**: Mug 120px
- **Occasions**: Cozy vibes, thinking of you

#### 12. Sunset
- **Animation**: Gradient sky transitions from day to sunset, sun descends, silhouette of couple in foreground
- **Duration**: 6 seconds
- **Colors**: Orange to pink to purple gradient
- **Size**: Full screen
- **Occasions**: End of day, romantic

#### 13. Rainbow
- **Animation**: Clouds part, rainbow arcs across screen band by band, sparkles at ends
- **Duration**: 4 seconds
- **Colors**: Traditional rainbow spectrum
- **Size**: Full width arc
- **Occasions**: After difficulties, hope

#### 14. Dancing Couple
- **Animation**: Two silhouettes sway and spin together, musical notes float around
- **Duration**: 5 seconds (loops well)
- **Colors**: --sand silhouettes, --mist musical notes
- **Size**: 200px × 250px
- **Occasions**: Celebration, happiness

#### 15. Fireflies
- **Animation**: Dark scene, 10-15 fireflies fade in/out randomly, creating magical atmosphere
- **Duration**: 6 seconds (loops)
- **Colors**: Warm yellow glow, --base background
- **Size**: Full screen
- **Occasions**: Magical moment, evening

#### 16. Northern Lights
- **Animation**: Curtain of aurora waves across sky, colors shift and shimmer
- **Duration**: 8 seconds (loops)
- **Colors**: --mist, teal, green aurora
- **Size**: Full screen
- **Occasions**: Special, breathtaking

### Purchasable Gifts (10)

#### 17. Rose Garden ($0.99)
- **Animation**: Field of roses blooms progressively, petals occasionally float in breeze
- **Duration**: 5 seconds
- **Colors**: Deep red roses, green leaves
- **Size**: Full width, 200px height
- **Design Note**: Roses should have 3D depth, front roses larger

#### 18. Candlelight ($0.99)
- **Animation**: 3-5 candles flicker realistically, warm glow expands and contracts
- **Duration**: 6 seconds (loops)
- **Colors**: --clay flame, --sand glow
- **Size**: 200px × 180px
- **Design Note**: Flame animation should feel authentic

#### 19. Fireworks ($1.99)
- **Animation**: 3 fireworks launch sequentially, explode into colored sparks, fade with trails
- **Duration**: 5 seconds
- **Colors**: --clay, --mist, gold explosions
- **Size**: Full screen
- **Design Note**: Sound effect pairs perfectly

#### 20. Love Lock ($1.99)
- **Animation**: Heart-shaped padlock appears, couple's initials engrave, lock clicks shut, keyhole glows
- **Duration**: 4 seconds
- **Colors**: Gold lock, --clay engraving
- **Size**: 150px × 170px
- **Design Note**: Initials should be customizable with couple's actual initials

#### 21. Memory Book ($2.99)
- **Animation**: Book opens, pages flip showing "photos" (abstract squares), hearts float out
- **Duration**: 5 seconds
- **Colors**: --sand pages, --base cover, --clay hearts
- **Size**: 200px × 180px
- **Design Note**: Could eventually integrate actual photos

#### 22. Hot Air Balloon ($2.99)
- **Animation**: Balloon with heart pattern rises, clouds pass, heart streamers trail below
- **Duration**: 6 seconds
- **Colors**: --clay balloon with --mist hearts
- **Size**: Balloon 150px, full height travel
- **Design Note**: Gentle swaying motion

#### 23. Galaxy ($3.99)
- **Animation**: Spiral galaxy forms from center, stars appear, gentle rotation
- **Duration**: 7 seconds
- **Colors**: Deep purple, --mist stars, pink nebula
- **Size**: Full screen
- **Design Note**: Should feel infinite, profound

#### 24. Cherry Blossoms ($3.99)
- **Animation**: Branch extends across screen, blossoms appear, petals fall gracefully
- **Duration**: 6 seconds
- **Colors**: Pink blossoms, brown branch
- **Size**: Full width
- **Design Note**: Petal fall should be gentle, varied

#### 25. Lantern Festival ($4.99)
- **Animation**: Multiple paper lanterns rise from bottom, drift upward with warm glow, disappear at top
- **Duration**: 8 seconds
- **Colors**: --clay, gold, --sand lanterns
- **Size**: Full screen
- **Design Note**: 8-12 lanterns, staggered timing

#### 26. Aurora Hearts ($4.99)
- **Animation**: Northern lights wave with heart shapes appearing within the aurora
- **Duration**: 8 seconds (loops)
- **Colors**: --mist aurora, --clay hearts
- **Size**: Full screen
- **Design Note**: Premium combination animation

### Seasonal Gifts (8) — Available during specific times

#### 27. Valentine's Rose ($2.99) — February
- **Animation**: Long-stem rose with ribbon bow, sparkles
- **Colors**: Deep red, --sand ribbon

#### 28. Anniversary Crown ($3.99) — Anniversary month
- **Animation**: Two crowns (one clay, one mist) hover side by side, sparkle
- **Colors**: Gold crowns, --clay and --mist gems

#### 29. New Year's Toast ($2.99) — December/January
- **Animation**: Two champagne glasses clink, bubbles rise
- **Colors**: Gold champagne, crystal glasses

#### 30. Spring Renewal ($1.99) — March/April
- **Animation**: Flowers bloom from ground, butterflies appear
- **Colors**: Pastels, greens

#### 31. Summer Love ($1.99) — June/July/August
- **Animation**: Sun, waves, hearts in sand
- **Colors**: Bright blues, --sand, --clay

#### 32. Autumn Leaves ($1.99) — September/October
- **Animation**: Colorful leaves fall gently
- **Colors**: Orange, red, brown, gold

#### 33. Winter Snowfall ($1.99) — November/December
- **Animation**: Snowflakes fall, settle, couple's initials appear in snow
- **Colors**: White, pale blue, --sand

#### 34. First Meeting ($4.99) — Anniversary of first meeting date
- **Animation**: Two paths converge into one, heart at intersection
- **Colors**: --clay, --mist paths merge

---

# Monetization Strategy — Expanded

## Revenue Streams

### 1. Subscriptions (Primary — 75% of revenue)

| Tier | Monthly | Annual | Features |
|------|---------|--------|----------|
| Free | $0 | $0 | 3 card draws/day, 7-day moments, 6 free gifts, basic games |
| Closer+ | $9.99 | $79.99 (33% off) | Unlimited draws, full history, 20 premium gifts, voice messages, 5 capsules, themes |
| Closer Pro | $14.99 | $119.99 (33% off) | All Closer+ features + custom decks, analytics, unlimited capsules, all gifts free, export |

**Target Conversion:**
- Free → Closer+: 8%
- Free → Closer Pro: 3%
- Closer+ → Pro: 15%

### 2. One-Time Purchases (Secondary — 20% of revenue)

**Virtual Gifts:**
- Individual: $0.99 - $4.99
- Bundles: $3.99 - $29.99
- Seasonal: $1.99 - $4.99

**Theme Packs:**
- Individual themes: $2.99
- Theme bundle (10): $14.99

**Special Features:**
- Extra custom deck slots: $4.99 each
- High-quality PDF export: $9.99

### 3. Future Revenue (Tertiary — 5% of revenue)

- Partner integrations (affiliate)
- Premium content packs
- Enterprise/B2B (therapist version)

## Conversion Trigger Points

| Trigger | User State | Prompt |
|---------|------------|--------|
| Card limit hit | Day 1-3 | "Out of draws for today. Upgrade for unlimited!" |
| 7-day milestone | Day 7 | "7 days together! Keep your memories forever with Closer+" |
| Streak warning | Day 10+ | "Protect your X-day streak with streak freeze (Closer+ only)" |
| Old moment access | Day 8+ | "This memory is from day 3. Upgrade to access your full history" |
| Premium gift attempt | Any | "This gift is included with Closer+. Upgrade?" |
| Second capsule | Any | "Create up to 5 active time capsules with Closer+" |
| Custom deck attempt | Any | "Create your own questions with Closer Pro" |
| Voice note duration limit | Any | "Send longer voice notes (5 min) with Closer Pro" |
| Analytics view | Any | "See your relationship insights with Closer Pro" |

## Pricing Psychology

- **Annual prominently displayed** with savings percentage
- **"Most Popular" badge** on Closer+ annual
- **"Best Value" badge** on Closer Pro annual
- **Free trial**: 7 days of Closer+ for new users
- **Gift bundles**: Show per-gift price to highlight savings

---

# AI/API Integration Opportunities

## For Future Consideration (Not V1)

### 1. AI-Powered Question Generation
- **Integration**: OpenAI API / Claude API
- **Feature**: Generate personalized questions based on relationship stage, interests, past answers
- **Implementation**: Weekly "AI-curated" question pack
- **Monetization**: Closer Pro exclusive

### 2. Sentiment Analysis
- **Integration**: Natural language processing
- **Feature**: Analyze conversation patterns, suggest when to reach out
- **Implementation**: Weekly relationship health score
- **Monetization**: Closer Pro exclusive

### 3. Smart Notifications
- **Integration**: ML-based timing optimization
- **Feature**: Send notifications at optimal times for each user
- **Implementation**: Learn from engagement patterns
- **Monetization**: All tiers (improves engagement)

### 4. Music Integration
- **Integration**: Spotify API, Apple Music API
- **Feature**: Shared playlists, song moments with preview
- **Implementation**: OAuth connection, playlist sync
- **Monetization**: Free tier (increases value)

### 5. Calendar Integration
- **Integration**: Google Calendar, Apple Calendar
- **Feature**: Sync next visit dates, anniversary reminders
- **Implementation**: Optional OAuth connection
- **Monetization**: Closer+ exclusive

### 6. Weather-Based Suggestions
- **Integration**: Weather API
- **Feature**: Suggest activities based on both locations' weather
- **Implementation**: Location-aware prompts
- **Monetization**: Free tier (delight feature)

### 7. AI Conversation Starters
- **Integration**: OpenAI API
- **Feature**: When stuck, get AI-suggested conversation topics based on context
- **Implementation**: Optional prompt in Messages
- **Monetization**: Closer Pro exclusive

### 8. Photo Enhancement
- **Integration**: AI image processing
- **Feature**: Auto-enhance photos before saving to Moments
- **Implementation**: Optional filter on upload
- **Monetization**: Closer+ exclusive

### 9. Memory Compilation
- **Integration**: AI summarization
- **Feature**: Monthly/yearly relationship recap video/slideshow
- **Implementation**: Auto-generated from Moments
- **Monetization**: Closer Pro exclusive

### 10. Gift Recommendations
- **Integration**: ML recommendation engine
- **Feature**: Suggest gifts based on occasion, partner preferences
- **Implementation**: Smart gift suggestions
- **Monetization**: All tiers (increases gift purchases)

---

# 50 Couple User Personas

## How to Read Each Persona

Each persona includes:
- **Couple Profile**: Names, ages, locations, relationship status
- **Relationship Context**: How they met, relationship length, living situation
- **Key Pain Points**: Their specific challenges
- **Closer Features They'd Use Most**: Primary value drivers
- **User Flow Example**: A typical session
- **Monetization Potential**: Likely tier, purchase behavior

---

## Persona 1: Maya & Jordan
**The Coast-to-Coast Professionals**

- **Ages**: Maya (29), Jordan (31)
- **Locations**: San Francisco, CA ↔ New York, NY
- **Relationship**: Dating 2 years, 3-hour time difference
- **Careers**: Maya is a product designer at a tech startup; Jordan is an investment banker

**Pain Points**:
- Jordan's demanding schedule means unpredictable availability
- Maya feels like she's always waiting
- Their calls are often interrupted by work
- Hard to feel present in each other's lives

**Features They'd Use Most**:
1. Timezone display (always know what time it is for each other)
2. "Thinking of You" tap (quick connection during busy days)
3. Hot Takes (quick games when they have 5 minutes)
4. Goodnight ritual (consistent touchpoint despite schedules)

**User Flow Example**:
> Maya opens Closer at 8 AM PST. She sees Jordan is still asleep (11 AM but Saturday, he sleeps in). She sends a "Thinking of You" tap, then answers the daily question. At lunch, Jordan sees the tap notification, smiles, and answers the same question. That evening, they both have 10 minutes and play two rounds of Hot Takes together, laughing when they disagree about whether remote work is better. Before bed, Maya sends a whisper message about missing him.

**Monetization Potential**:
- **Tier**: Closer Pro ($14.99/month) — Both high earners, value premium features
- **Purchases**: Gift bundles, anniversary gifts

---

## Persona 2: Carlos & Emma
**The College Sweethearts**

- **Ages**: Carlos (21), Emma (20)
- **Locations**: UCLA (Los Angeles) ↔ UC Berkeley
- **Relationship**: Dating since high school, 4 years, 6-hour drive apart

**Pain Points**:
- Limited budget for travel
- Jealousy/trust concerns (college party culture)
- Fear of growing apart
- Counting down to summers and breaks

**Features They'd Use Most**:
1. Countdown (tracking days until next visit)
2. Intimacy Deck (staying emotionally close)
3. Streaks (gamification appeals to them)
4. Time Capsule (messages for graduation)

**User Flow Example**:
> Carlos checks the countdown first thing — "14 days until spring break!" He draws a card from the Intimacy Deck and answers a deep question about their future. Emma's notification buzzes during her study break, and she answers too. They reveal together over text while on a call, leading to a 2-hour conversation about their plans after college.

**Monetization Potential**:
- **Tier**: Closer+ ($9.99/month, but annual to save money) — Budget-conscious but see value
- **Purchases**: Occasional individual gifts ($0.99-$1.99)

---

## Persona 3: Priya & Amar
**The Arranged-to-Love Story**

- **Ages**: Priya (27), Amar (30)
- **Locations**: Mumbai, India ↔ Toronto, Canada
- **Relationship**: Engaged (arranged introduction), 8 months, planning wedding in 6 months

**Pain Points**:
- Still getting to know each other deeply
- 12.5-hour time difference
- Cultural expectations vs. personal connection
- Wedding planning stress from afar

**Features They'd Use Most**:
1. Intimacy Deck (learning about each other)
2. Dream Builder (wedding and future planning)
3. Morning/Goodnight rituals (bridging the time gap)
4. Weekly Check-in (structured relationship building)

**User Flow Example**:
> Priya wakes up at 7 AM in Mumbai (9:30 PM previous day in Toronto). She sends a morning ritual message as Amar's goodnight. They've been doing this for 6 months — it's their thing. During her lunch break (Amar's morning), they open a Deep round in the Intimacy Deck to learn each other's dreams. She saves a particularly meaningful answer to Moments.

**Monetization Potential**:
- **Tier**: Closer Pro — Wedding planning means they want all features
- **Purchases**: Romantic gift bundles, anniversary gifts, custom themes for engagement colors

---

## Persona 4: Sophie & Mia
**The Digital Nomads**

- **Ages**: Sophie (32), Mia (30)
- **Locations**: Currently Lisbon ↔ Bali (changes monthly)
- **Relationship**: Together 5 years, both are remote workers, occasionally in same city

**Pain Points**:
- Time zones constantly changing
- Lack of routine/consistency
- Missing shared physical space
- Coordinating travel to be together

**Features They'd Use Most**:
1. Dynamic timezone (updates with travel)
2. Dream Builder (planning where to meet next)
3. Photo Moments (documenting experiences to share)
4. Song Moments (sharing music discoveries)

**User Flow Example**:
> Sophie is working from a café in Lisbon at 3 PM, sees Mia is online (10 PM in Bali). They do a quick Would You Rather round while Mia winds down for bed. Sophie shares a photo of her pastel de nata with a caption. They've created a Dream Builder goal: "Meet in Morocco next month" with milestones for booking flights and accommodation.

**Monetization Potential**:
- **Tier**: Closer+ annual — Practical, value-focused
- **Purchases**: Seasonal gifts, experience-related gifts

---

## Persona 5: Marcus & David
**The Military Couple**

- **Ages**: Marcus (34), David (32)
- **Locations**: David is deployed overseas, Marcus is home in San Diego
- **Relationship**: Married 3 years, David deployed for 9 months

**Pain Points**:
- Extremely limited communication windows
- Emotional weight of deployment
- Time zone differences
- Fear and worry

**Features They'd Use Most**:
1. Time Capsules (messages for homecoming)
2. Whisper messages (intimate private messages)
3. Moments timeline (documenting their time apart)
4. Countdown (homecoming date)

**User Flow Example**:
> Marcus records a voice note during his morning walk, knowing David will hear it during his brief evening break. He's been creating a Time Capsule every month, set to open on David's homecoming date. David, when he can, plays the voice notes and responds with brief messages. Their Moments timeline is filling with "I miss you" quotes and photos from home.

**Monetization Potential**:
- **Tier**: Closer Pro — Willing to pay for any connection
- **Purchases**: Emotional gifts, anniversary gifts

---

## Persona 6: Olivia & Ethan
**The High School Sweethearts, Now 40**

- **Ages**: Both 42
- **Locations**: Same city (Chicago), different homes (recently separated)
- **Relationship**: Married 18 years, separated, trying to reconnect

**Pain Points**:
- Lost the spark, routines made them roommates
- Awkwardness in rebuilding connection
- Need structured ways to communicate
- Fear of divorce

**Features They'd Use Most**:
1. Weekly Check-in (structured conversations)
2. Intimacy Deck (Deep questions)
3. Gratitude ritual (rebuilding appreciation)
4. Dream Builder (shared future goals)

**User Flow Example**:
> Their therapist recommended trying Closer. Every Sunday, they complete the Weekly Check-in separately, then meet for coffee to discuss their answers. It's become a ritual. The Gratitude feature has helped Olivia remember what she loves about Ethan. They created a Dream that they're working toward together: "Renew our vows by our 20th anniversary."

**Monetization Potential**:
- **Tier**: Closer Pro — Investment in their marriage
- **Purchases**: Premium gifts for milestones

---

## Persona 7: Kenji & Lisa
**The Intercultural Couple**

- **Ages**: Kenji (28), Lisa (26)
- **Locations**: Tokyo, Japan ↔ Minneapolis, MN
- **Relationship**: Met while Lisa studied abroad, dating 1.5 years

**Pain Points**:
- 14-hour time difference
- Cultural communication differences
- Language nuances sometimes cause misunderstandings
- Uncertain future (visa challenges)

**Features They'd Use Most**:
1. Voice notes (tone conveys more than text)
2. Intimacy Deck (helps with deeper conversations)
3. Morning/Goodnight rituals (synced despite opposite schedules)
4. Dream Builder (planning her move to Japan)

**User Flow Example**:
> Kenji wakes up at 7 AM Tokyo time, Lisa is going to bed at 4 PM Minneapolis time. Their overlap is tiny — about 3 hours in the morning for Lisa, evening for Kenji. They rely heavily on voice notes and Thinking of You taps. The Intimacy Deck has helped them discuss values and future in ways that texting couldn't.

**Monetization Potential**:
- **Tier**: Closer+ — Practical value focus
- **Purchases**: Cross-cultural seasonal gifts

---

## Persona 8: Taylor & Alex
**The Non-Binary Long-Distance**

- **Ages**: Taylor (24), Alex (25)
- **Locations**: Portland, OR ↔ Austin, TX
- **Relationship**: Met on Hinge, dating 8 months

**Pain Points**:
- Still building trust and commitment
- Figuring out if this can work long-term
- Different social circles, hard to feel included
- Balancing independence with connection

**Features They'd Use Most**:
1. Hot Takes (light debates, learning each other's views)
2. Would You Rather (playful connection)
3. Photo Moments (sharing daily life)
4. Thinking of You (low-pressure connection)

**User Flow Example**:
> Taylor sends a morning photo of their coffee art (they're a barista). Alex sends back a photo of their new desk setup (they work in tech). Throughout the day, they play Hot Takes about topics like "Breakfast for dinner is acceptable" — Alex agrees, Taylor disagrees. The playfulness helps them stay connected without pressure.

**Monetization Potential**:
- **Tier**: Free initially, Closer+ after 6 months if it works out
- **Purchases**: Quirky individual gifts

---

## Persona 9: Robert & Maria
**The Empty Nesters**

- **Ages**: Robert (58), Maria (56)
- **Locations**: Maria travels for work (pharmaceutical sales), Robert is home in Denver
- **Relationship**: Married 30 years, kids just left for college

**Pain Points**:
- Rediscovering each other without kids
- Maria is away 3 weeks/month
- Technology isn't their strength
- Feel awkward using "young people" apps

**Features They'd Use Most**:
1. Simple messaging (easy interface)
2. Photo Moments (sharing where Maria is)
3. Goodnight ritual (their way of saying "I love you")
4. Milestone moments (tracking grandparent-ish goals)

**User Flow Example**:
> Maria is in Philadelphia for a conference. She takes a photo of the Liberty Bell, thinking of a trip they took 25 years ago. She adds it to Moments with the caption "Remember this?" Robert sees it and sends back a heart. That night, they complete the Goodnight ritual before Maria falls asleep in her hotel room.

**Monetization Potential**:
- **Tier**: Closer+ annual — Affordable for established couple
- **Purchases**: Anniversary gifts, romantic seasonal

---

## Persona 10: Zara & Marcus
**The Long-Distance Parents**

- **Ages**: Zara (35), Marcus (37)
- **Locations**: Zara in London, Marcus in Lagos, Nigeria (Marcus relocated for work)
- **Relationship**: Married 8 years, two kids (5 and 7) live with Zara

**Pain Points**:
- Kids make scheduling calls difficult
- Marcus misses family deeply
- Zara is overwhelmed being solo parent
- Need connection that doesn't require long calls

**Features They'd Use Most**:
1. Voice notes (can listen/record anytime)
2. Thinking of You (quick "I'm here" moments)
3. Photo Moments (kids' milestones)
4. Weekly Check-in (structured catch-ups)

**User Flow Example**:
> Marcus records a voice note at 6 AM Lagos time before work, telling Zara about his day yesterday and sending love to the kids. Zara plays it while making the kids' breakfast. During the kids' naptime, she records a response and shares photos of their art projects. They save milestones like "Aisha lost her first tooth" to Moments.

**Monetization Potential**:
- **Tier**: Closer+ — Practical value for busy parents
- **Purchases**: Occasional romantic gifts

---

## Personas 11-50: Comprehensive List

### Persona 11: The Graduate Students
**Chen & Harper**
- Ages: 26, 25
- Locations: Stanford, CA ↔ MIT, Boston
- Relationship: Met at conference, dating 2 years
- Pain Points: Academic pressure, limited travel funds, exhaustion
- Primary Features: Time Capsules (messages for thesis completion), Streaks (keeping them accountable to connect)
- Tier: Closer+ annual

### Persona 12: The Childhood Friends to Lovers
**James & Aaliyah**
- Ages: 28, 28
- Locations: Detroit, MI ↔ Chicago, IL (2-hour drive, but limited weekend availability)
- Relationship: Best friends since 8, dating 1 year
- Pain Points: Transitioning friendship to romance, family expectations, defining the relationship
- Primary Features: Intimacy Deck (exploring romantic depth), Dream Builder
- Tier: Closer+

### Persona 13: The Newlyweds Adjusting to Distance
**Michael & Jennifer**
- Ages: 31, 29
- Locations: Seattle ↔ Boston (she's in medical residency)
- Relationship: Married 6 months, apart for 2-year residency
- Pain Points: Newlywed excitement vs. distance reality, her exhausting schedule
- Primary Features: Countdown, Whisper messages, Gratitude ritual
- Tier: Closer Pro

### Persona 14: The Retired Couple
**George & Patricia**
- Ages: 67, 65
- Locations: Phoenix, AZ ↔ Grandkids in Portland (extended visits)
- Relationship: Married 45 years, Patricia visits grandkids for months at a time
- Pain Points: Not tech-savvy, miss the simple connection
- Primary Features: Simple messaging, Photo Moments, Morning/Goodnight rituals
- Tier: Free (may upgrade if kids help)

### Persona 15: The Bicoastal Musicians
**Diego & Naomi**
- Ages: 33, 30
- Locations: Nashville ↔ Los Angeles
- Relationship: Met at a music festival, dating 9 months
- Pain Points: Both touring, schedules erratic, creative conflicts
- Primary Features: Song Moments, Voice notes, Hot Takes
- Tier: Closer+

### Persona 16: The Travel Nurse & Teacher
**Amanda & Kevin**
- Ages: 29, 31
- Locations: Amanda rotates cities every 3 months, Kevin in Denver
- Relationship: Engaged, wedding planned for next year
- Pain Points: New city every quarter, Amanda's exhausting shifts
- Primary Features: Timezone flexibility, Photo Moments, Countdown to wedding
- Tier: Closer Pro

### Persona 17: The Grad School Widow
**Samantha & Tyler**
- Ages: 27, 29
- Locations: Same city (Nashville), but Tyler's PhD consumes him
- Relationship: Dating 4 years, living together, but emotionally distant
- Pain Points: Physical proximity but emotional distance
- Primary Features: Weekly Check-in, Gratitude, Intimacy Deck
- Tier: Closer+

### Persona 18: The Cross-Generational
**Victor (55) & Sarah (38)**
- Locations: Houston ↔ San Francisco
- Relationship: Met through mutual friends, dating 1 year
- Pain Points: Age gap concerns, different life stages, long-term questions
- Primary Features: Intimacy Deck, Dream Builder, Weekly Check-in
- Tier: Closer Pro

### Persona 19: The Athletes
**Jordan & Brianna**
- Ages: 24, 23
- Locations: He's in minor league baseball (travels), she's at college
- Relationship: High school sweethearts, dating 6 years
- Pain Points: His constant travel, her school demands
- Primary Features: Streaks (competitive), Hot Takes, Photo Moments
- Tier: Closer+

### Persona 20: The Polyamorous Triad (Primary Partnership Focus)
**Elena, Sam & Chris** (Elena & Sam using Closer)
- Ages: 32, 34, 30
- Locations: Elena in NYC, Sam in DC (Chris local to Sam)
- Relationship: Elena & Sam have 3-year partnership, use Closer for their dyad
- Pain Points: Navigating communication in complex relationship structure
- Primary Features: Messages (private space for them), Rituals, Time Capsule
- Tier: Closer Pro

### Persona 21: The Couple After Infidelity
**Maria & David**
- Ages: 40, 42
- Locations: Same house, rebuilding
- Relationship: Married 15 years, affair 6 months ago, in counseling
- Pain Points: Trust rebuilding, structured communication, proving commitment
- Primary Features: Weekly Check-in, Gratitude, Dream Builder (rebuild goals)
- Tier: Closer Pro (therapist recommended)

### Persona 22: The International Adoption Couple
**Christine & Paul**
- Ages: 38, 40
- Locations: DC ↔ Ukraine (Paul traveling for adoption process)
- Relationship: Married 10 years, adopting two children
- Pain Points: Uncertain timelines, stress, missing each other during process
- Primary Features: Time Capsule (for children), Photo Moments, Countdown
- Tier: Closer Pro

### Persona 23: The COVID Relationship
**Nina & Jake**
- Ages: 27, 28
- Locations: Met online during pandemic, NYC ↔ Chicago
- Relationship: Dating 2 years, only met in person 4 times
- Pain Points: Relationship built on digital, adjusting to IRL, defining future
- Primary Features: All Connect games, Photo Moments, Dream Builder
- Tier: Closer+

### Persona 24: The Retirees in Different Countries
**Hans (72) & Yuki (68)**
- Locations: Munich, Germany ↔ Kyoto, Japan
- Relationship: Met at art retreat, dating 18 months
- Pain Points: Massive time difference, occasional visits only, language nuances
- Primary Features: Voice notes (easier than typing), Photo Moments, Simple rituals
- Tier: Free (fixed income)

### Persona 25: The Seasonal Workers
**Luis & Carmen**
- Ages: 35, 32
- Locations: Luis does seasonal farm work across US, Carmen in Oaxaca, Mexico
- Relationship: Married 8 years, two kids stay with Carmen
- Pain Points: Limited phone access, long separations, financial stress
- Primary Features: Voice notes, Photo Moments, Thinking of You
- Tier: Free (budget constraints)

---

### Personas 26-50: Summary Table

| # | Couple | Ages | Locations | Relationship Type | Key Pain Point | Primary Feature | Likely Tier |
|---|--------|------|-----------|-------------------|----------------|-----------------|-------------|
| 26 | Daniel & Mei | 29, 27 | London ↔ Singapore | Dating 1 year | 8-hour time gap | Rituals | Closer+ |
| 27 | Jamal & Tyrone | 33, 31 | Atlanta ↔ Miami | Married 2 years | Travel for work | Messages, Moments | Closer+ |
| 28 | Sofia & Luca | 26, 28 | Madrid ↔ Rome | Engaged | Wedding planning remotely | Dream Builder | Pro |
| 29 | Ashley & Brittany | 24, 24 | Dallas ↔ Houston | College friends turned lovers | Coming out, family | Whisper messages | Closer+ |
| 30 | Ryan & Michelle | 45, 43 | Chicago ↔ LA | Divorced, remarried each other | Second chance | Weekly Check-in | Pro |
| 31 | Omar & Fatima | 28, 26 | Dubai ↔ Cairo | Arranged, engaged | Cultural expectations | Intimacy Deck (Deep) | Pro |
| 32 | Akiko & Thomas | 31, 34 | Tokyo ↔ London | Met on dating app | Never met IRL yet | All games | Closer+ |
| 33 | Bruno & Clara | 38, 35 | São Paulo ↔ Lisbon | Married with kids | Work relocation | Photo Moments | Closer+ |
| 34 | Ava & Noah | 22, 23 | UCLA ↔ Berklee | Both creatives | Long-term uncertainty | Time Capsule | Closer+ |
| 35 | Dmitri & Anna | 40, 38 | Moscow ↔ Tel Aviv | Married 10 years | Political tensions | Private Messages | Pro |
| 36 | Kelly & Shannon | 36, 34 | NYC ↔ Denver | Married, one traveling for custody | Co-parenting challenge | Rituals | Pro |
| 37 | Raj & Simran | 30, 28 | Bangalore ↔ Boston | Dating 3 years | Visa issues | Dream Builder | Pro |
| 38 | Felix & Ingrid | 55, 52 | Stockholm ↔ Copenhagen | Married 25 years | Empty nest, different cities | Photo Moments | Closer+ |
| 39 | Grace & William | 65, 68 | Florida ↔ Vermont | Dating after widowhood | Late-life love | Simple features | Free |
| 40 | Camila & André | 23, 25 | Rio ↔ NYC | Met through Instagram | Influencer schedules | Moments | Closer+ |
| 41 | Javier & Isabel | 32, 29 | Mexico City ↔ Barcelona | Engaged | Time difference, family | Countdown | Pro |
| 42 | Yuki & Sakura | 27, 26 | Osaka ↔ Seoul | Dating 1 year | Language barrier | Voice notes | Closer+ |
| 43 | Erik & Astrid | 41, 39 | Oslo ↔ NYC | Married, job assignment | Kids missing dad | Photo Moments | Pro |
| 44 | Tanya & Viktor | 28, 30 | Kyiv ↔ Warsaw | War separation | Safety concerns | Messages | Free |
| 45 | Michelle & Jason | 34, 36 | Sydney ↔ London | Married 3 years | Massive time difference | Rituals | Pro |
| 46 | Leila & Hassan | 25, 27 | Tehran ↔ Toronto | Engaged, visa delays | Frustration, uncertainty | Time Capsule | Pro |
| 47 | Beatrice & Claude | 62, 64 | Paris ↔ Geneva | Second marriage | Blended families | Weekly Check-in | Closer+ |
| 48 | Tomás & Lucia | 29, 27 | Buenos Aires ↔ Santiago | Dating 2 years | Financial for travel | Streaks, free gifts | Free |
| 49 | Nadia & Oleg | 31, 33 | Almaty ↔ Moscow | Married 4 years | Work separation | Voice notes | Closer+ |
| 50 | Harper & Sage | 21, 22 | Different colleges | Gender exploration | Finding themselves + relationship | Intimacy Deck | Closer+ |

---

# User Flow Analysis

## Flow Test 1: New User Onboarding (Persona 3: Priya & Amar)

**Scenario**: Priya downloads Closer after Amar sent her the link. Amar is already set up.

1. Priya opens Closer → **Login/Signup page**
2. Taps "Sign Up" → Email + password form
3. Enters details, submits → Email verification sent
4. Verifies email → Redirected to **/onboarding/profile**
5. Uploads photo, enters display name "Priya" → Next
6. **/onboarding/partner** — Enters Amar's invite code
7. System links them → Celebration animation
8. **/onboarding/setup** — Selects Mumbai timezone, enters engagement date as anniversary
9. **/onboarding/setup** (complete state) — "Welcome to Closer!" with confetti
10. Redirected to **Home** → Sees Amar online (9:30 PM Toronto), their countdown (wedding in 183 days), daily question card

**Issues Identified**: None — flow is clear

---

## Flow Test 2: First Intimacy Deck Experience (Persona 1: Maya & Jordan)

**Scenario**: Maya wants to try the Intimacy Deck for the first time.

1. Maya opens Closer → **Home**
2. Taps daily question card → Navigates to **/connect/intimacy-deck**
3. Sees card stack, "Together" button shows Jordan is online
4. Taps "Together" → Sync established
5. Taps card stack to draw → Card flip animation
6. Question revealed: "What's something you've never told anyone else?"
7. **/connect/intimacy-deck/answer** — Types her answer
8. Submits → **/connect/intimacy-deck/waiting** — "Waiting for Jordan..."
9. Jordan answers on his end
10. **/connect/intimacy-deck/reveal** — Both answers slide in simultaneously
11. Reads Jordan's answer, reacts with heart
12. **/connect/intimacy-deck/save** — "Save to Moments?" → Taps "Save"
13. Moment card created with both answers
14. "Continue" → Back to deck for another draw or exit

**Issues Identified**:
- Need clear "Together" vs "I'll start" distinction on Step 3
- Add subtle coaching tooltip for first-time users

---

## Flow Test 3: Sending a Virtual Gift (Persona 5: Marcus & David)

**Scenario**: Marcus wants to send David a special gift for their anniversary.

1. Marcus opens Closer → **Home**
2. Navigates to **/gifts** (from Connect or Messages)
3. Sees gift categories — taps "Seasonal" → Filters to Anniversary
4. Finds "Anniversary Crown" ($3.99) → Taps for detail
5. **/gifts/anniversary-crown** — Views animation preview
6. Taps "Send Gift" → **/gifts/send**
7. Pre-filled recipient (David), adds message: "3 years of loving you. Many more to come."
8. Taps "Send" → Payment flow (Stripe)
9. Confirms $3.99 purchase
10. Success screen with flying gift animation
11. David receives push notification: "Marcus sent you a gift! 🎁"
12. David opens Closer → **/gifts/received** auto-opens
13. Sees wrapped gift, taps to unwrap
14. Crown animation plays with message reveal
15. David reacts with heart, saves to favorites

**Issues Identified**: None — gift flow is complete

---

## Flow Test 4: Weekly Check-in (Persona 6: Olivia & Ethan)

**Scenario**: It's Sunday, their therapist-recommended check-in day.

1. Both receive push at 10 AM: "Time for your weekly check-in with [partner]"
2. Olivia opens first → **/connect/rituals/weekly**
3. Sees 5 questions, starts answering one by one
4. Completes all 5, submits
5. **/connect/rituals/weekly** (waiting state) — "Waiting for Ethan..."
6. Ethan opens, sees Olivia completed, feels pressure (good kind)
7. Completes his answers, submits
8. Both see reveal → Side-by-side answers
9. Answers saved to Moments as "Weekly Check-in — Dec 28"
10. Link to Messages with context: "Discuss your check-in?"
11. At coffee meetup, they open Moments and discuss

**Issues Identified**:
- Add reminder notification if one partner hasn't started by noon
- Add ability to schedule check-in for different day

---

## Flow Test 5: Time Capsule Journey (Persona 2: Carlos & Emma)

**Scenario**: Carlos creates a time capsule for graduation in 2 years.

1. Carlos → **/connect/time-capsule**
2. Taps "Create Capsule" → **/connect/time-capsule/create/date**
3. Selects "Custom" → Picks graduation date (May 15, 2027)
4. **/connect/time-capsule/create/message**
5. Writes: "Dear future us, you made it! Remember when we weren't sure if we could do long distance? Look at us now..."
6. Taps "Add Photo" → Uploads current photo together
7. **/connect/time-capsule/create/preview** — Reviews
8. Taps "Seal Capsule" → Dramatic seal animation
9. **/connect/time-capsule/sealed** — "Sealed! Opens May 15, 2027 (485 days)"
10. Emma gets notification: "Carlos sealed a time capsule. It opens in 485 days!"
11. Capsule visible in **/connect/time-capsule** with lock icon

**Fast forward 485 days...**

12. Both receive push: "Your time capsule is ready to open!"
13. Carlos opens first → **/connect/time-capsule/[id]**
14. "Open Together?" — Waits for Emma
15. Emma opens, both tap "Open" simultaneously
16. Wax seal cracks, letter unfolds
17. They read together, tearful
18. "Save to Moments" → Creates graduation milestone

**Issues Identified**:
- Add "video message" option for capsules
- Consider collaborative capsule (both contribute before sealing)

---

# Integration Checklist

## All Systems Must Connect

### 1. User Authentication → All Features
- [ ] Logged in state persists across sessions
- [ ] Partner linking verified on all pages
- [ ] Subscription tier gates correct features

### 2. Real-time Sync → Games + Messages + Presence
- [ ] Partner online status accurate everywhere
- [ ] Game state syncs without delay
- [ ] Messages appear instantly
- [ ] "Typing" indicator works

### 3. Moments → Multiple Sources
- [ ] Intimacy Deck answers can save to Moments
- [ ] Hot Takes results can save to Moments
- [ ] Would You Rather results can save to Moments
- [ ] Time Capsules create Moments when opened
- [ ] Completed Dreams create Moments
- [ ] Manual photo/song/quote creation works
- [ ] All Moment types display correctly in timeline

### 4. Notifications → All Features
- [ ] Message notifications work
- [ ] Game invite notifications work
- [ ] Ritual reminders work
- [ ] Streak warnings work
- [ ] Capsule unlock notifications work
- [ ] Achievement unlock notifications work

### 5. Streaks → All Activity Types
- [ ] Sending message counts
- [ ] Completing ritual counts
- [ ] Answering daily question counts
- [ ] Playing any game counts
- [ ] Saving moment counts
- [ ] Sending gift counts

### 6. Monetization → All Features
- [ ] Card draw limit enforced (free tier)
- [ ] Moments history limit enforced (free tier)
- [ ] Gift access correctly gated
- [ ] Custom deck creation correctly gated
- [ ] Upgrade prompts appear at right moments
- [ ] Subscription changes apply immediately

### 7. Design Consistency → All Pages
- [ ] Color palette consistent
- [ ] Typography consistent
- [ ] Spacing consistent
- [ ] Component patterns consistent
- [ ] Animation timing consistent
- [ ] Loading states consistent
- [ ] Error states consistent

---

# Final Cohesion Review

## Aesthetic Cohesion Checklist

- [ ] All pages use #050505 base background
- [ ] All cards use surface gradient pattern
- [ ] All buttons follow button variant specs
- [ ] All text uses correct Fraunces/Manrope fonts
- [ ] All spacing follows 4px scale
- [ ] All borders follow subtle/highlight pattern
- [ ] All shadows follow shadow scale
- [ ] All animations use spring easing
- [ ] All glows use clay/mist colors appropriately
- [ ] All touch targets meet 44px minimum

## Functional Cohesion Checklist

- [ ] User can navigate to any feature from any page
- [ ] Back navigation works predictably
- [ ] Data persists across navigation
- [ ] Real-time features work across all relevant screens
- [ ] Offline behavior is graceful
- [ ] Errors don't break the app
- [ ] Loading states never feel broken

## Emotional Cohesion Checklist

- [ ] Language feels intimate, not gamey
- [ ] Celebrations feel genuine, not excessive
- [ ] Privacy feels respected
- [ ] Connection feels enhanced, not replaced
- [ ] Premium features feel valuable, not exploitative
- [ ] Empty states feel inviting, not lonely
- [ ] Waiting states feel patient, not anxious

---

# Appendix: Document References

- **Design Tokens**: See `CLOSER_DESIGN_DNA.md`
- **Detailed Page Specs**: See `CLOSER_PAGES_SPECIFICATION.md`
- **Business Strategy**: See `CLOSER_BUSINESS_BLUEPRINT.md`
- **Previous Refinements**: See `CLOSER_REFINED_SPECIFICATION.md`

---

*Master Specification Version: 1.0*
*Last Updated: December 28, 2025*
*Desktop-First Design for V1 Launch*
*100% Digital — No Physical Products*
*No Voice/Video — Couples Use Their Preferred Calling Apps*
*Intimate Language — Not Gamey*
