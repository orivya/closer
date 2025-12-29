# Meadow Screen-by-Screen Analysis
**Version:** 1.0 | **Last Updated:** 2025-12-20

---

## Table of Contents
1. [Landing Page](#1-landing-page)
2. [Onboarding Flow](#2-onboarding-flow)
3. [Home/Dashboard](#3-homedashboard)
4. [Journal View](#4-journal-view)
5. [Editor](#5-editor)
6. [Explore Section](#6-explore-section)
7. [Individual Spaces](#7-individual-spaces)
8. [Insights](#8-insights)
9. [Profile/Settings](#9-profilesettings)
10. [Navigation & IA](#10-navigation--ia)

---

## 1. Landing Page

### Current Implementation (`LandingPage.tsx`)

#### Sections Present
1. **Hero Section**
   - Headline: "See yourself clearly"
   - Subheadline about journaling + AI
   - CTA: "Start Journaling"
   - Demo mode option
   - Mood weather icon

2. **Features Section**
   - Thread patterns
   - Smart prompts
   - Daily check-ins
   - Visual feature cards

3. **Spaces Preview**
   - Vault, Mirror, Decision Lab cards
   - Visual previews

4. **Testimonials**
   - 4 user testimonials
   - Avatar + quote format

5. **Footer**
   - Brand logo
   - Navigation links
   - Social links (icons only)

### Gaps Analysis

#### Missing Elements
| Element | Priority | Impact |
|---------|----------|--------|
| Pricing section | Critical | No monetization visibility |
| FAQ section | High | Reduces support burden |
| Trust badges | High | Security/privacy signals |
| Comparison table | Medium | vs other journal apps |
| Video demo | Medium | Engagement boost |
| Blog/Resources link | Low | SEO, content marketing |
| App store badges | High | If native apps planned |
| Newsletter signup | Medium | Lead capture |

#### Content Issues
| Issue | Location | Fix |
|-------|----------|-----|
| Generic CTA text | Hero | A/B test "Start Free" vs "Try Meadow" |
| No urgency/scarcity | Throughout | Consider limited beta messaging |
| Testimonials feel fake | Testimonials | Use real photos or illustrations |
| No social proof numbers | Missing | "Join 10,000+ journalers" |

#### Technical Issues
| Issue | Description |
|-------|-------------|
| No meta tags | Missing OG tags for sharing |
| No structured data | Missing Schema.org |
| Heavy animations | Consider reduced motion |
| No lazy loading | Images load all at once |

### Recommended Improvements

#### High Priority
1. Add pricing/premium preview section
2. Add FAQ with 5-8 common questions
3. Add trust badges (encryption, privacy, no-ads)
4. Add real social proof numbers
5. Add meta tags for SEO/sharing

#### Medium Priority
1. Add video walkthrough
2. Add comparison with competitor apps
3. Add newsletter signup
4. Optimize images with lazy loading

### Empty States Needed
- N/A (marketing page)

### Loading States Needed
- Image placeholders during load
- Skeleton for testimonials if dynamic

---

## 2. Onboarding Flow

### Current Implementation (`Onboarding.tsx`)

#### Steps
1. **Step 0 - Intro**
   - Meadow logo animation
   - Welcome message
   - "Begin" button

2. **Step 1 - Name**
   - "What should we call you?"
   - Text input
   - Arrow button on input

3. **Step 2 - Intent**
   - 4 intent cards:
     - Mental Clarity
     - Personal Growth
     - Memory Keeping
     - Find Calm
   - Auto-advance on selection

4. **Step 3 - Account**
   - Email input
   - Password input
   - Terms mention (not linked)
   - "Enter Meadow" button

### Gaps Analysis

#### Critical Gaps
| Gap | Impact | Fix |
|-----|--------|-----|
| No email verification | Security | Add verification step |
| No password requirements shown | UX | Show requirements |
| No social login | Conversion | Add Google/Apple |
| Terms not linked | Legal | Link to actual policies |

#### UX Gaps
| Gap | Impact | Fix |
|-----|--------|-----|
| No skip option | Friction | Add "Skip for now" |
| No back button | Frustration | Add back navigation |
| No progress save | Data loss | Save partial progress |
| Intent not used | Wasted data | Personalize based on intent |
| No password show/hide | UX | Add visibility toggle |
| No confirm password | Security | Add confirmation field |

#### Visual Gaps
| Gap | Description |
|-----|-------------|
| Progress dots subtle | Could be more prominent |
| No animation between steps | Feels abrupt (already has fade) |
| Mobile keyboard handling | Content shifts on keyboard |

### Recommended Flow Improvements

```
Current:      Intro → Name → Intent → Account → Home
Recommended:  Intro → Account (or Social) → Verify Email → Name → Intent → Guided Tour → First Entry → Home
```

### Missing Variations
- [ ] Social login path
- [ ] Email verification screen
- [ ] "Verify later" option
- [ ] Welcome email confirmation
- [ ] Guided tour option

---

## 3. Home/Dashboard

### Current Implementation (`Home.tsx`)

#### Sections Present
1. **Greeting Banner**
   - Time-based greeting
   - User name
   - Subtitle prompt

2. **Quick Mood Check-in**
   - 5 mood options (icons)
   - Follow-up prompt after selection

3. **Active Threads**
   - Thread cards with progress
   - Entry count
   - "See All" link

4. **Recent Entries**
   - Entry preview cards
   - Date, mood, snippet

5. **Continue Journey**
   - Active journey card
   - Progress indicator
   - "Continue" button

6. **Daily Prompt**
   - Single prompt card
   - "Write About This" CTA

7. **Quick Insights**
   - Streak counter
   - Entries this week
   - "View All" link

### Gaps Analysis

#### Empty States Missing
| Section | Empty State Needed |
|---------|-------------------|
| Threads | "No threads yet" + how to create |
| Entries | "No entries yet" + first entry prompt |
| Journey | "No active journey" + browse journeys |
| Insights | "Keep writing to unlock insights" |

#### Dynamic Content Gaps
| Gap | Current | Needed |
|-----|---------|--------|
| Greeting | Time-based only | + streak, + last entry context |
| Mood | Static options | + recent mood pattern |
| Prompt | Static | Personalized to intent/history |
| Threads | Static data | Real threads from entries |

#### Feature Gaps
| Gap | Priority |
|-----|----------|
| No notification center | Medium |
| No "Today's focus" | Low |
| No weather/context integration | Low |
| No quick entry (floating button exists) | Already present |
| No "What happened since last time" | Medium |

#### Personalization Gaps
| Gap | Description |
|-----|-------------|
| Intent not reflected | User chose "Find Calm" but no calm-focused content |
| No time-of-day optimization | Same content morning vs night |
| No usage pattern adaptation | Frequent users see same as new users |

### Recommended Additions
1. "Getting Started" checklist for new users
2. Celebration for milestones (10 entries, etc.)
3. "Suggested action" card based on patterns
4. Weather/mood correlation widget
5. Notification bell with updates

---

## 4. Journal View

### Current Implementation (`Journal.tsx`)

#### View Modes
1. **Stream View** - Continuous timeline
2. **Calendar View** - Month calendar with dots
3. **List View** - Condensed list
4. **Threads View** - Entries grouped by thread
5. **Reflections View** - AI-generated insights

#### Components Per View
- View mode tabs (pill buttons)
- Time filter dropdown
- Entry cards (vary by view)
- Thread cards (threads view)

### Gaps Analysis

#### Missing Features
| Feature | Priority | Description |
|---------|----------|-------------|
| Search | Critical | Full-text search across entries |
| Filter by mood | High | Filter by mood state |
| Filter by tag | High | Filter by tags/threads |
| Sort options | Medium | By date, length, mood |
| Bulk actions | Low | Multi-select, bulk delete |
| Entry details modal | Medium | Quick preview without navigation |

#### Empty States Needed
| View | Empty State |
|------|-------------|
| Stream | "Your journal is empty. Start your first entry." |
| Calendar | "No entries this month. Tap a day to write." |
| List | "Nothing here yet. Your entries will appear here." |
| Threads | "No threads yet. Threads form as you write about topics repeatedly." |
| Reflections | "Keep writing to unlock AI reflections." |

#### Loading States Needed
| State | Implementation |
|-------|----------------|
| View switching | Skeleton cards |
| Initial load | Shimmer effect |
| Infinite scroll | Bottom loader |
| Search | Results skeleton |

#### UX Issues
| Issue | Description | Fix |
|-------|-------------|-----|
| No infinite scroll | Pagination unclear | Add infinite scroll |
| Calendar interaction | Clicking dates unclear | Better hover states |
| Thread creation | Not obvious how | Add "Create Thread" |
| View memory | Doesn't remember last view | Persist selection |

### Recommended Improvements
1. Add search bar (always visible)
2. Add filter chips below tabs
3. Add floating "New Entry" button
4. Add pull-to-refresh on mobile
5. Add skeleton loading states

---

## 5. Editor

### Current Implementation (`Editor.tsx`)

#### Entry Modes
1. **Freewrite** - Open text area
2. **Prompted** - Guided prompts
3. **Mood-Based** - Mood selection first
4. **Quick** - Rapid capture
5. **Voice** - Audio recording (stubbed)
6. **Image** - Photo journal (stubbed)

#### Components
- Mode selector tabs
- Entry area (mode-specific)
- Thread selector
- Tag input
- Mood indicator
- Save button
- Cancel button

### Gaps Analysis

#### Critical Issues
| Issue | Severity | Description |
|-------|----------|-------------|
| Voice mode stubbed | High | No actual recording |
| Image mode stubbed | High | No image upload |
| No autosave | Critical | Data loss risk |
| No draft system | High | Lost work on navigate |
| No undo/redo | Medium | No history |

#### Missing Features
| Feature | Priority | Description |
|---------|----------|-------------|
| Autosave indicator | Critical | Show save status |
| Word count | Medium | Show word count |
| Character limit | Low | If needed |
| Formatting toolbar | Medium | Bold, italic, lists |
| Markdown support | Medium | Power user feature |
| Image embedding | High | Inline images |
| Link embedding | Low | URL previews |
| Entry templates | Low | Pre-made structures |
| Time tracking | Low | Time spent writing |

#### UX Issues
| Issue | Description | Fix |
|-------|-------------|-----|
| Mode confusion | 6 modes overwhelming | Simplify to 3-4 |
| Hidden features | Thread/tag hard to find | Surface prominently |
| Exit flow | No save confirmation | Add unsaved warning |
| Keyboard handling | Mobile keyboard issues | Adjust viewport |
| Thread creation | Must go elsewhere | Add inline creation |

#### Empty/Loading States
| State | Needed |
|-------|--------|
| Initial load | No - instant |
| Saving | Spinner/check indicator |
| Voice recording | Waveform display |
| Image upload | Progress bar |
| Draft loaded | "Draft restored" toast |

### Mode-Specific Issues

#### Freewrite Mode
- Works well, needs autosave indicator

#### Prompted Mode
- Prompts are static, need personalization
- No "shuffle" for different prompt
- No way to see all available prompts

#### Mood-Based Mode
- Good concept
- Need more mood options
- Follow-up prompts could be smarter

#### Quick Mode
- Purpose unclear (how different from freewrite?)
- Could be renamed or merged

#### Voice Mode (Stubbed)
- No recording capability
- Needs Whisper or similar for transcription
- Should show waveform during recording

#### Image Mode (Stubbed)
- No upload capability
- Needs camera access on mobile
- Should allow multiple images

### Recommended Simplification
Reduce to 4 modes:
1. **Write** (freewrite + quick merged)
2. **Guided** (prompted + mood-based merged)
3. **Voice** (full implementation)
4. **Capture** (image + voice + quick combo)

---

## 6. Explore Section

### Current Implementation (`Explore.tsx`)

#### Tabs
1. **Library** - Journeys & Prompts
2. **Toolbox** - Spaces

#### Library Tab
- Featured journey card
- Journey grid
- Prompt categories

#### Toolbox Tab
- Intentions Hub (featured)
- Vault, Mirror, Decision Lab, Voice Memos

### Gaps Analysis

#### Navigation Confusion
| Issue | Description |
|-------|-------------|
| "Library" vs "Toolbox" | Unclear distinction |
| "Explore" vs "Spaces" | Terminology inconsistent |
| "Journeys" vs "Spaces" | Conceptual overlap |

#### Missing Elements
| Element | Priority |
|---------|----------|
| Search/filter for prompts | High |
| Journey progress overview | Medium |
| "Recommended for you" | Medium |
| Recently used | Low |
| Favorites | Medium |

#### Empty States Needed
| Section | Empty State |
|---------|-------------|
| Completed journeys | "You haven't completed any journeys yet" |
| Saved prompts | "No saved prompts" |
| Recently used | "Start exploring to see recent items" |

### Recommended IA Restructure
```
Current:                    Recommended:
Explore                     Discover
├── Library                 ├── Journeys (guided paths)
│   ├── Journeys           ├── Prompts (browse/search)
│   └── Prompts            └── For You (personalized)
└── Toolbox                Tools
    ├── Intentions         ├── Mirror (AI insights)
    ├── Vault              ├── Vault (time capsules)
    ├── Mirror             ├── Decisions (framework)
    ├── Decision Lab       └── Voice (recording)
    └── Voice Memos
```

---

## 7. Individual Spaces

### 7.1 Mirror (`Mirror.tsx`)

#### Current State
- Carousel of AI reflections
- 2 hardcoded reflections
- Navigation arrows
- "Write about this" CTA
- "Save for later" option

#### Gaps
| Gap | Priority |
|-----|----------|
| No AI integration | Critical |
| Static content | Critical |
| No reflection history | High |
| No "generate new" option | High |
| No explanation of how it works | Medium |

#### Needed Features
1. Real AI-generated reflections from entries
2. Reflection history/archive
3. "Generate new reflection" button
4. Explanation modal for first-time users
5. Feedback mechanism (helpful/not helpful)

### 7.2 Time Vault (`TimeVault.tsx`)

#### Current State
- Grid of time capsules
- Create new capsule flow
- Read unlocked capsules
- 3 hardcoded capsules

#### Gaps
| Gap | Priority |
|-----|----------|
| No actual data persistence | Critical |
| No notifications for unlock | High |
| No email on unlock | Medium |
| Limited to 3 demo capsules | High |
| No capsule editing | Medium |
| No capsule deletion | Medium |

#### Needed Features
1. Real data storage
2. Unlock notification system
3. Email reminder option
4. CRUD operations for capsules
5. Premium limit (3 free, unlimited paid)

### 7.3 Intentions (`Intentions.tsx`)

#### Current State
- Hero header with CTA
- Featured intention (highlighted)
- Active intentions grid
- Progress indicators

#### Gaps
| Gap | Priority |
|-----|----------|
| No actual data persistence | Critical |
| Can't create new intentions | High |
| No intention editing | High |
| No intention archiving | Medium |
| Static progress bars | High |
| No connection to entries | Critical |

#### Needed Features
1. Full CRUD for intentions
2. Link entries to intentions
3. Progress calculation from entries
4. Breakthrough detection
5. Intention reflection prompts

### 7.4 Decision Lab (Not in provided files)

#### Expected Features
- Decision framework wizard
- Pros/cons matrix
- Value weighting
- Final recommendation
- Decision history

#### Gaps
- Entire feature appears stubbed

### 7.5 Voice Memos (Not in provided files)

#### Expected Features
- Voice recording
- Transcription
- Tagging
- Playback

#### Gaps
- Entire feature appears stubbed

### MVP Recommendation
**Keep for MVP:**
- Basic Mirror (with real AI)
- Vault (simplified)
- Basic Intentions

**Cut for MVP:**
- Decision Lab (complex, low-value initially)
- Voice Memos (technically complex)

---

## 8. Insights

### Current Implementation (`Insights.tsx`)

#### Sections
1. **Header** with Weekly/Monthly toggle
2. **Discoveries** - Narrative insight cards
   - Correlation card (confidence vs length)
   - Connection card (career-sleep link)
3. **Mood Flow** - Bar chart
4. **Habits** - Stats (peak focus, best day, avg length)

### Gaps Analysis

#### Data Issues
| Issue | Description |
|-------|-------------|
| All data hardcoded | No real calculations |
| No time range filtering | Weekly/Monthly buttons non-functional |
| Static correlations | AI not generating insights |

#### Missing Insights
| Insight Type | Priority |
|--------------|----------|
| Topic analysis | High |
| Emotion trends | High |
| Writing consistency | Medium |
| Tag usage patterns | Medium |
| Prompt completion rate | Low |
| Journey progress | Medium |

#### Visualization Gaps
| Gap | Description |
|-----|-------------|
| No long-term trends | Only weekly view |
| No comparative periods | Can't compare weeks |
| No exportable reports | Can't share insights |
| No goal tracking | No targets to measure |

### Recommended Improvements
1. Real AI integration for insight generation
2. Functional time period toggle
3. Exportable PDF reports
4. Goal setting and tracking
5. Comparison with previous periods
6. More chart types (line, area for trends)

---

## 9. Profile/Settings

### Current Implementation (`Settings.tsx`)

#### Sections
1. **Profile Header**
   - Avatar
   - Name
   - Premium badge
   - Stats (Streak, Entries, Level)

2. **Tab Switcher**: Insights | Settings

3. **Insights Tab**
   - Pattern card (same as Insights page)
   - Weekly weather report
   - Habits grid

4. **Settings Tab**
   - Account section (Personal Info, Privacy, Data)
   - App Settings (Notifications, Appearance, Passcode)
   - Sign Out button
   - Version number

### Gaps Analysis

#### Missing Settings
| Setting | Priority | Category |
|---------|----------|----------|
| Change email | High | Account |
| Change password | Critical | Account |
| Delete account | Critical | Account |
| Export data | Critical | Data |
| Notification preferences | High | Notifications |
| Theme selection | Medium | Appearance |
| Font size | Medium | Appearance |
| Language | Low | App |
| Timezone | Low | App |

#### Missing Account Features
| Feature | Priority |
|---------|----------|
| Edit profile photo | Medium |
| Edit name | Medium |
| Two-factor auth | High |
| Connected accounts | Medium |
| Session management | Medium |

#### Settings Items Non-Functional
All settings items are placeholders - none navigate to actual settings pages.

### Recommended Settings Structure
```
Account
├── Personal Information (name, email, photo)
├── Password & Security (change password, 2FA)
├── Privacy Settings (who sees what)
├── Connected Accounts (social logins)
└── Sessions (active devices)

Data & Privacy
├── Export My Data
├── Download All Entries
├── Delete All Entries
└── Delete Account

Preferences
├── Notifications (daily reminder time, insights, etc.)
├── Appearance (theme, font size, reduce motion)
├── Writing (default mode, autosave interval)
└── Integrations (calendar, health apps)

Support
├── Help Center
├── Contact Us
├── Report a Bug
└── Feature Request

Legal
├── Terms of Service
├── Privacy Policy
└── Cookie Settings
```

---

## 10. Navigation & IA

### Current Navigation Structure

#### Desktop (Sidebar)
```
Logo: Meadow
[New Entry Button]
─────────────────
Home
Journal (badge: 24)
Explore
Profile
─────────────────
User Profile Footer
```

#### Mobile (Bottom Nav)
```
Home | Journal | [+] | Spaces | Profile
```

### IA Issues

#### Terminology Inconsistencies
| Desktop | Mobile | Issue |
|---------|--------|-------|
| Explore | Spaces | Different labels for same destination |
| Profile | Profile | Consistent |

#### Conceptual Confusion
| Term | Meaning | User Confusion |
|------|---------|----------------|
| Explore | Browse journeys/tools | Why not "Discover"? |
| Spaces | Toolbox items | Confused with "Explore" |
| Threads | Entry groupings | Unclear relationship to "Journeys" |
| Journeys | Guided multi-day paths | Similar to Threads? |

### Navigation Gaps
| Gap | Priority |
|-----|----------|
| No search in nav | High |
| No notification bell | Medium |
| No breadcrumbs in sub-pages | Medium |
| No quick actions menu | Low |
| No recently viewed | Low |

### Recommended IA Restructure

#### Primary Navigation (5 items)
1. **Home** - Dashboard, quick entry, today's focus
2. **Journal** - All entries, search, filter
3. **[+] New** - Quick entry modal
4. **Discover** - Journeys, prompts, recommendations
5. **You** - Profile, settings, insights, tools

#### Tool Access
Move tools (Mirror, Vault, etc.) into "You" section as personal tools, not discovery items.

### Mobile Navigation Improvements
1. Add haptic feedback on tap
2. Add notification dot capability
3. Ensure 44px touch targets
4. Add gesture navigation (swipe between tabs)
5. Consider floating entry button (already exists)

---

## Summary: Critical Fixes by Screen

### Immediate (Pre-Launch)
| Screen | Fix |
|--------|-----|
| Landing | Add pricing, FAQ, trust badges |
| Onboarding | Add email verification, back button |
| Editor | Add autosave, unsaved warning |
| Journal | Add search |
| Settings | Add change password, delete account |

### Short-Term (Launch)
| Screen | Fix |
|--------|-----|
| Home | Add empty states, personalization |
| Explore | Clarify IA, add recommendations |
| Insights | Connect to real data |
| All | Add loading states |

### Medium-Term (Post-Launch)
| Screen | Fix |
|--------|-----|
| Mirror | Real AI integration |
| Vault | Full implementation |
| Editor | Voice/image modes |
| All | Accessibility improvements |
