# CLOSER — Refined Complete Specification
## Version 1.0 - 100% Digital Experience

---

# Table of Contents

1. [Corrections from Previous Version](#corrections-from-previous-version)
2. [Complete Page Count (Revised)](#complete-page-count-revised)
3. [How Each Game/Activity Works (Detailed)](#how-each-gameactivity-works-detailed)
4. [Moments System Explained](#moments-system-explained)
5. [Virtual Gifts System (Complete List)](#virtual-gifts-system-complete-list)
6. [Monetization (Refined)](#monetization-refined)
7. [Missing Elements Now Added](#missing-elements-now-added)
8. [Additional Nuances & Improvements](#additional-nuances--improvements)

---

# Corrections from Previous Version

| Previous | Corrected |
|----------|-----------|
| "Booking/scheduling" mentioned | Removed - not relevant to Closer |
| "Physical gifts" as feature | Removed - 100% digital only |
| "Closer Coins" currency | Changed to premium unlocks or "Gifts" balance |
| Hot Takes: 2 screens | Expanded to 8 screens |
| Would You Rather: 2 screens | Expanded to 7 screens |
| Daily Rituals: 2 screens | Expanded to 12 screens |
| Vague gift system | Complete gift catalog created |

---

# Complete Page Count (Revised)

## Total: **87 Pages**

### Core App Views (5)
1. Home
2. Connect
3. Messages
4. Moments
5. Us/Profile

---

### The Intimacy Deck (12 pages)

| Page | URL | Description |
|------|-----|-------------|
| Deck Home | /connect/intimacy-deck | Card stack, categories, stats |
| Category Select | /connect/intimacy-deck/categories | Choose Light, Deep, Spicy, etc. |
| Draw Card | /connect/intimacy-deck/draw | Active card with question |
| Answer Input | /connect/intimacy-deck/answer | Write your answer |
| Waiting for Partner | /connect/intimacy-deck/waiting | Shows partner status |
| Reveal Together | /connect/intimacy-deck/reveal | Both answers shown |
| Save to Moments | /connect/intimacy-deck/save | Option to save answer |
| Discussion Prompt | /connect/intimacy-deck/discuss | Opens chat with context |
| History | /connect/intimacy-deck/history | All past questions answered |
| Favorites | /connect/intimacy-deck/favorites | Starred questions |
| Custom Deck | /connect/intimacy-deck/custom | Create own questions (premium) |
| Deck Stats | /connect/intimacy-deck/stats | Progress through categories |

---

### Hot Takes (8 pages)

| Page | URL | Description |
|------|-----|-------------|
| Hot Takes Home | /connect/hot-takes | Topic preview, play button |
| Category Select | /connect/hot-takes/categories | Lifestyle, Relationships, Controversial |
| Topic Display | /connect/hot-takes/play | Shows debate topic |
| Vote Screen | /connect/hot-takes/vote | Agree/Disagree buttons |
| Waiting | /connect/hot-takes/waiting | Partner voting |
| Results Reveal | /connect/hot-takes/results | Shows both votes with animation |
| Discussion | /connect/hot-takes/discuss | "You disagreed! Talk about it?" |
| History | /connect/hot-takes/history | Past debates and outcomes |

**How Hot Takes Works:**

```
Step 1: Category Selection
User selects category (Lifestyle, Relationships, Food, Pop Culture, Spicy)

Step 2: Topic Appears
"Pineapple belongs on pizza"
Large card with topic text

Step 3: Vote
Two large buttons: AGREE / DISAGREE
Tap to select, button glows
Cannot change after tapping

Step 4: Waiting
If partner hasn't voted yet:
- "Waiting for [Partner]..."
- Pulsing animation
- Option to send nudge notification

Step 5: Results Reveal
Animation: Both votes slide in from sides
- Match: Celebration animation, "You both agree!"
- Mismatch: "Different perspectives!" with discussion prompt

Step 6: Post-Vote Options
- "Discuss This" → Opens chat with topic as context
- "Save to Moments" → Saves as quote card
- "Next Topic" → Draw another
- "Exit" → Return to Connect

Step 7: Save to Moments (Optional)
If saved, creates a Moment card:
"Hot Take: Pineapple on pizza"
You: Agree | Partner: Disagree
Date stamp
```

---

### Would You Rather (7 pages)

| Page | URL | Description |
|------|-----|-------------|
| WYR Home | /connect/would-you-rather | Preview, play button |
| Category Select | /connect/would-you-rather/categories | Funny, Deep, Spicy, etc. |
| Options Display | /connect/would-you-rather/play | Two options shown |
| Choice Made | /connect/would-you-rather/chosen | Your selection locked |
| Waiting | /connect/would-you-rather/waiting | Partner choosing |
| Results | /connect/would-you-rather/results | Compare choices |
| History | /connect/would-you-rather/history | Past WYR and choices |

**How Would You Rather Works:**

```
Step 1: Category Selection
Categories: Funny, Thoughtful, Romantic, Spicy, Impossible

Step 2: Options Display
"Would you rather..."

┌─────────────────────────┐
│ Never eat your favorite │
│ food again              │
└─────────────────────────┘
         — OR —
┌─────────────────────────┐
│ Only eat your favorite  │
│ food forever            │
└─────────────────────────┘

Step 3: Make Choice
Tap one option
- Selected option expands
- Other option shrinks/fades
- Lock-in animation

Step 4: Waiting
"[Partner] is choosing..."
Cannot see their choice yet

Step 5: Reveal
Animation: Options split, choices appear
- Same choice: "Great minds!" + celebration
- Different: "Interesting..." + discussion prompt

Step 6: Post-Choice
- Explain your reasoning (text input)
- See partner's reasoning
- Save exchange to Moments
- Next question

Step 7: Saved to Moments Format
"Would You Rather"
Q: [Question]
You chose: [Option A]
Partner chose: [Option B]
```

---

### Time Capsule (8 pages)

| Page | URL | Description |
|------|-----|-------------|
| Capsule Home | /connect/time-capsule | Active capsules list |
| Create: Date | /connect/time-capsule/create/date | Choose unlock date |
| Create: Message | /connect/time-capsule/create/message | Write message |
| Create: Media | /connect/time-capsule/create/media | Add photo/voice (optional) |
| Create: Preview | /connect/time-capsule/create/preview | Review before sealing |
| Sealed Confirmation | /connect/time-capsule/sealed | Animation + countdown |
| View Capsule | /connect/time-capsule/[id] | Locked view with countdown |
| Opened Capsule | /connect/time-capsule/[id]/opened | Unlocked content view |

**How Time Capsule Works:**

```
Creating a Capsule:

Step 1: Choose Date
Presets: 1 Week, 1 Month, 3 Months, 6 Months, 1 Year, Custom
Calendar picker for custom date
Minimum: 24 hours from now

Step 2: Write Message
"Dear future us..."
Rich text area
Character limit: 2000

Step 3: Add Media (Optional)
- Add photo
- Add voice note (up to 60 seconds)
- Add song link

Step 4: Preview
See how it will look
Edit option
"Seal Capsule" button

Step 5: Seal Animation
- Message folds into envelope shape
- Wax seal stamps onto envelope
- Lock icon appears
- Sparkle effect
- Flies to "vault"

Step 6: Confirmation
"Capsule Sealed!"
"Opens on [Date]"
"In [X] days"
Share notification sent to partner

Waiting Period:
- Capsule shows in list with lock icon
- Countdown visible
- Cannot open early
- Cannot edit or delete

Opening a Capsule:

Step 1: Notification
Push: "Your time capsule is ready to open!"
Both partners notified

Step 2: Open Together (Optional)
Can wait for both to be present
Or open solo with notification to partner

Step 3: Unsealing Animation
- Lock breaks
- Seal cracks
- Envelope unfolds
- Content reveals

Step 4: Read Together
Both partners see content
Reactions can be added
Save to Moments option

Step 5: Archive
Opened capsules move to "Opened" section
Permanently saved
Can be revisited anytime
```

---

### Dream Builder (9 pages)

| Page | URL | Description |
|------|-----|-------------|
| Dreams Home | /connect/dream-builder | All dreams list |
| Create: Category | /connect/dream-builder/create/category | Choose dream type |
| Create: Define | /connect/dream-builder/create/define | Write the dream |
| Create: Timeline | /connect/dream-builder/create/timeline | Set target date |
| Create: Milestones | /connect/dream-builder/create/milestones | Break into steps |
| Create: Confirm | /connect/dream-builder/create/confirm | Review and save |
| Dream Detail | /connect/dream-builder/[id] | View single dream |
| Edit Dream | /connect/dream-builder/[id]/edit | Modify dream |
| Completed Dreams | /connect/dream-builder/completed | Archive of achieved |

**How Dream Builder Works:**

```
Creating a Dream:

Step 1: Category
Travel | Home | Career | Family | Adventure | Financial | Personal | Custom

Step 2: Define the Dream
"We dream of..."
Text input for dream description
Example: "Visiting Japan together"

Step 3: Timeline (Optional)
"When do you want to achieve this?"
Date picker or "No timeline"

Step 4: Break Into Milestones
"What steps will get you there?"
- Add milestone input
- Reorder milestones
- 3-10 milestones recommended

Example milestones:
1. Research destinations
2. Save $3,000
3. Get passports
4. Book flights
5. Plan itinerary
6. Pack and go!

Step 5: Partner Approval
Notification sent to partner
Partner can:
- Approve as-is
- Suggest edits
- Add milestones

Step 6: Dream Created
Appears in shared Dreams list
Both can track progress

Tracking Progress:

- Check off milestones as completed
- Progress bar updates
- Partner notified of updates
- Can add notes to milestones
- Photos can be attached to milestones

Completing a Dream:
- When all milestones done
- Celebration animation
- Dream moves to "Completed"
- Becomes a Moment automatically
- Creates memory card with journey
```

---

### Daily Rituals (12 pages)

| Page | URL | Description |
|------|-----|-------------|
| Rituals Home | /connect/rituals | All rituals list |
| Morning Hello | /connect/rituals/morning | Morning greeting |
| Morning: Compose | /connect/rituals/morning/compose | Add message |
| Morning: Sent | /connect/rituals/morning/sent | Confirmation |
| Gratitude | /connect/rituals/gratitude | Gratitude prompt |
| Gratitude: Input | /connect/rituals/gratitude/input | Write gratitude |
| Gratitude: Share | /connect/rituals/gratitude/share | Both shared view |
| Goodnight | /connect/rituals/goodnight | Evening ritual |
| Goodnight: Compose | /connect/rituals/goodnight/compose | Goodnight message |
| Thinking of You | /connect/rituals/thinking | Quick tap ritual |
| Weekly Check-in | /connect/rituals/weekly | Deeper conversation |
| Ritual History | /connect/rituals/history | Past rituals log |

**How Each Ritual Works:**

### Morning Hello

```
Trigger: User opens app between 5am-10am local time

Step 1: Prompt
"Good morning! Say hello to [Partner]"

Step 2: Options
- Quick tap: "☀️ Good morning!" (one tap sends)
- Add message: Opens compose
- Add photo: Morning selfie or view
- Skip: Not today

Step 3: Compose (if selected)
Text input with morning stickers
Voice note option
Photo option

Step 4: Send
Sends to partner
Partner receives notification
"[Your name] said good morning!"

Step 5: Partner Response
Partner can respond with same options
Creates back-and-forth morning exchange

Step 6: Save Option
"Save this morning to Moments?"
Creates Morning Moment card

Streak Tracking:
- Consecutive days of morning hellos tracked
- "Morning streak: 14 days"
- Streak shown on ritual card
```

### Gratitude Ritual

```
Available: Anytime (suggested: evening)

Step 1: Prompt
"What are you grateful for today?"
"Think of something about [Partner] or your relationship"

Step 2: Input
Text input
Voice note option
Character limit: 500

Step 3: Submit
"Share with [Partner]"

Step 4: Partner's Turn
Partner gets notification
"[Name] shared their gratitude. Share yours?"

Step 5: Reveal Together
When both submitted:
Side-by-side display
Your gratitude | Their gratitude
Animation reveals

Step 6: Reactions
Add heart reaction
Add comment
Save to Moments

Weekly Gratitude Summary:
- Compiles week's gratitudes
- Creates shareable card
- Sent as Moment automatically
```

### Goodnight Ritual

```
Trigger: User opens app after 8pm local time (or manual)

Step 1: Prompt
"Time to say goodnight to [Partner]"

Step 2: Options
- Quick: "🌙 Goodnight, sweet dreams"
- Custom message
- Voice note
- "Miss you" special message

Step 3: Special Options
- Schedule message for their morning
- Add tomorrow's countdown
- Include gratitude from today

Step 4: Send
Partner receives:
Push notification
In-app message with special styling
Moon/stars animation

Step 5: Response
Partner can respond
Creates goodnight exchange

Bedtime Streak:
- Tracked separately from morning
- "Goodnight streak: 23 days"
```

### Thinking of You (Quick Tap)

```
Available: Anytime, anywhere in app

Step 1: Access
Heart icon in header (always visible)
Or from Rituals page

Step 2: Tap
Single tap sends
No compose needed

Step 3: Partner Receives
Push: "[Name] is thinking of you 💭"
Subtle heart animation on their screen
Haptic feedback (if enabled)

Step 4: Response Option
Partner can tap back
Creates heart exchange
"You're both thinking of each other!"

No message required - just presence
Used for: busy moments, quick connection, random love
```

### Weekly Check-in

```
Trigger: Sunday (configurable day)

Step 1: Notification
"Time for your weekly check-in with [Partner]"

Step 2: Questions (5 rotating questions)
Example set:
1. "How are you feeling about us this week?"
2. "What was a highlight from this week?"
3. "Is there anything on your mind?"
4. "What are you looking forward to?"
5. "How can I support you better?"

Step 3: Answer Each
Text input for each
Voice note option

Step 4: Partner Does Same
Both complete independently

Step 5: Share Session
Schedule time to review together
Or reveal immediately

Step 6: Discussion
See each other's answers
Add comments/reactions
Discuss in chat with context

Step 7: Summary
Weekly check-in saved to Moments
Creates relationship health snapshot
```

---

### Authentication (8 pages)

| Page | URL | Description |
|------|-----|-------------|
| Login | /login | Email/password + social |
| Signup | /signup | Create account |
| Forgot Password | /forgot-password | Reset request |
| Reset Password | /reset-password | New password form |
| Verify Email | /verify-email | Confirmation |
| Onboarding 1 | /onboarding/profile | Avatar + name |
| Onboarding 2 | /onboarding/partner | Invite code |
| Onboarding 3 | /onboarding/setup | Timezone + anniversary |

---

### Settings & Profile (14 pages)

| Page | URL | Description |
|------|-----|-------------|
| Us Home | /us | Stats + settings list |
| Edit Profile | /us/edit-profile | Avatar, name, bio |
| Partner Settings | /us/partner | Anniversary, unlink |
| Notifications | /us/notifications | All notification toggles |
| Privacy | /us/privacy | Data, visibility |
| Subscription | /us/subscription | Plans, billing |
| Theme | /us/theme | Colors (premium) |
| Achievements | /us/achievements | Badge gallery |
| Streaks | /us/streaks | Streak history |
| Data Export | /us/data | Download your data |
| Help | /us/help | FAQ, contact |
| About | /us/about | Version, credits |
| Terms | /us/terms | Terms of service |
| Delete Account | /us/delete | Account deletion |

---

### Modals & Overlays (12)

1. Card Reveal Modal
2. Answer Comparison Modal
3. Photo Viewer
4. Confirmation Dialogs
5. Gift Send Modal
6. Gift Receive Animation
7. Streak Warning
8. Achievement Unlock
9. Capsule Seal Animation
10. Capsule Open Animation
11. Celebration (confetti/hearts)
12. Upgrade Prompt

---

# Moments System Explained

## What Gets Saved to Moments?

### Automatic Saves

| Source | What's Saved | Format |
|--------|--------------|--------|
| Intimacy Deck | Question + both answers | Quote card |
| Hot Takes | Topic + both votes | Debate card |
| Would You Rather | Question + both choices | Choice card |
| Time Capsule | Content when opened | Capsule card |
| Dream Builder | Dream when completed | Achievement card |
| Weekly Check-in | Summary of responses | Summary card |
| Milestones | Streak achievements, anniversaries | Milestone card |

### Manual Saves

| Action | What's Saved |
|--------|--------------|
| Take photo | Photo moment |
| Share song | Song moment |
| Write quote | Quote moment |
| Mark milestone | Custom milestone |
| Save message | Message highlight |

### How Saving Works

```
After any game/activity:

┌────────────────────────────────────────┐
│  Save this moment?                     │
│                                        │
│  [Preview of how it will look]         │
│                                        │
│  ┌──────────┐  ┌──────────┐           │
│  │  Skip    │  │  Save    │           │
│  └──────────┘  └──────────┘           │
└────────────────────────────────────────┘

If Save:
- Added to Moments timeline
- Appears on that day's date
- Both partners see it
- Can add caption/note

If Skip:
- Not saved to Moments
- Can still see in game history
- Can save later from history
```

### Moment Card Types

**1. Photo Card (Polaroid style)**
```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │        [PHOTO]          │ │
│ │                         │ │
│ └─────────────────────────┘ │
│ Caption here         9:42AM │
└─────────────────────────────┘
White background, slight rotation
```

**2. Song Card**
```
┌─────────────────────────────┐
│ 🎵  Until I Found You       │
│     Stephen Sanchez         │
│     ▮▮▮ ▮▮ ▮▮▮ (equalizer)  │
│                     2:34 PM │
└─────────────────────────────┘
Dark card with accent glow
```

**3. Quote/Answer Card**
```
┌─────────────────────────────┐
│ 💭 Intimacy Deck            │
│                             │
│ "I love how you always      │
│  know how to make me laugh" │
│                             │
│ — You                       │
│                     Dec 15  │
└─────────────────────────────┘
```

**4. Debate Card (Hot Takes)**
```
┌─────────────────────────────┐
│ 🔥 Hot Take                 │
│                             │
│ "Breakfast for dinner is    │
│  better than dinner"        │
│                             │
│ You: Agree  |  Them: Agree  │
│ ✓ You matched!              │
└─────────────────────────────┘
```

**5. Choice Card (WYR)**
```
┌─────────────────────────────┐
│ 🤔 Would You Rather         │
│                             │
│ Q: Travel back in time OR   │
│    See the future           │
│                             │
│ You: Back    |  Them: Future│
└─────────────────────────────┘
```

**6. Milestone Card**
```
┌─────────────────────────────┐
│ 🎉 MILESTONE                │
│                             │
│      100 Days Together      │
│                             │
│      December 15, 2025      │
│                             │
│ 🎊 Celebration confetti 🎊  │
└─────────────────────────────┘
```

**7. Capsule Card**
```
┌─────────────────────────────┐
│ ⏰ Time Capsule Opened      │
│                             │
│ Written: Oct 15, 2025       │
│ Opened: Dec 15, 2025        │
│                             │
│ "Dear future us, remember   │
│  when we first said..."     │
│                             │
│ [View Full Message →]       │
└─────────────────────────────┘
```

**8. Dream Card (Completed)**
```
┌─────────────────────────────┐
│ ✨ Dream Achieved!          │
│                             │
│ 🌏 Visit Japan Together     │
│                             │
│ Started: June 2025          │
│ Completed: December 2025    │
│                             │
│ 6 milestones completed      │
│ [View Journey →]            │
└─────────────────────────────┘
```

---

# Virtual Gifts System (Complete List)

## How Gifts Work

```
No virtual currency. Direct purchase or included with premium.

Step 1: Open Gift Menu
Accessed from: Messages or any screen

Step 2: Browse Categories
Animated preview of each gift

Step 3: Select Gift
See full animation
Add personal message (optional)

Step 4: Send
Gift flies to partner
Partner receives notification
Full-screen animation on their device

Step 5: Received
Partner sees animation
Gift saved to "Received" gallery
Can replay animation anytime
```

## Complete Gift Catalog

### Free Gifts (Available to all users)

| Gift | Animation | Occasions |
|------|-----------|-----------|
| Heart | Single floating heart | Anytime |
| Hug | Two figures embracing | Comfort |
| Kiss | Flying kiss with sparkle | Affection |
| Star | Shooting star | Encouragement |
| Sun | Sunrise animation | Good morning |
| Moon | Moonrise with stars | Goodnight |

### Premium Gifts (Included with Closer+)

| Gift | Animation | Occasions |
|------|-----------|-----------|
| Heart Burst | Explosion of hearts | Big love moment |
| Flower Bouquet | Growing flowers | Appreciation |
| Love Letter | Envelope opens, letter unfolds | Deep message |
| Starry Night | Night sky with shooting stars | Romantic |
| Warm Drink | Steaming cup with heart steam | Cozy vibes |
| Sunset | Beautiful sunset scene | End of day |
| Rainbow | Rainbow arcs across screen | After difficulties |
| Dancing Couple | Silhouettes dancing | Celebration |
| Fireflies | Glowing fireflies | Magical moment |
| Northern Lights | Aurora animation | Special |

### Purchasable Gifts ($0.99 - $4.99 each)

| Gift | Price | Animation | Occasions |
|------|-------|-----------|-----------|
| Rose Garden | $0.99 | Field of roses blooms | Romance |
| Candlelight | $0.99 | Candles flicker warmly | Date night |
| Fireworks | $1.99 | Full fireworks show | Celebration |
| Love Lock | $1.99 | Lock closes with initials | Commitment |
| Memory Book | $2.99 | Book opens with photos | Anniversary |
| Hot Air Balloon | $2.99 | Balloon floats with hearts | Adventure |
| Galaxy | $3.99 | Spiral galaxy forms | Infinite love |
| Cherry Blossoms | $3.99 | Petals falling beautifully | Spring/renewal |
| Lantern Festival | $4.99 | Floating lanterns rise | Special wish |
| Aurora Hearts | $4.99 | Northern lights + hearts | Ultimate romance |

### Special Occasion Gifts (Limited availability)

| Gift | Price | When Available |
|------|-------|----------------|
| Valentine's Rose | $2.99 | February |
| Anniversary Crown | $3.99 | Your anniversary month |
| New Year's Toast | $2.99 | December/January |
| Spring Renewal | $1.99 | March/April |
| Summer Love | $1.99 | June/July/August |
| Autumn Leaves | $1.99 | September/October |
| Winter Snowfall | $1.99 | November/December |
| First Meeting | $4.99 | Anniversary of first meeting |

### Gift Bundles

| Bundle | Contents | Price | Savings |
|--------|----------|-------|---------|
| Starter Pack | Rose Garden, Candlelight, Fireworks | $3.99 | 20% |
| Romance Pack | All romance-themed gifts | $9.99 | 30% |
| Celebration Pack | All celebration gifts | $9.99 | 30% |
| Complete Collection | All purchasable gifts | $29.99 | 40% |

## Gift Received Experience

```
When partner sends a gift:

Step 1: Notification
Push: "[Name] sent you a gift! 🎁"

Step 2: Open App
Full-screen takeover
Dark background
"[Name] sent you something special..."

Step 3: Unwrap Animation
Gift box/envelope appears
Tap to open
Anticipation builds

Step 4: Gift Reveals
Full animation plays (3-5 seconds)
Sound effects (optional)
Haptic feedback

Step 5: Message Revealed
If sender added message, it appears
Beautifully formatted
With sender's avatar

Step 6: Respond
- Send gift back
- Send message
- Add reaction
- Save to favorites

Step 7: Gallery
Gift saved to "Received Gifts"
Can replay animation
Sorted by date
```

---

# Monetization (Refined)

## No Virtual Currency

Instead of "coins," using direct purchases and premium unlocks.

## Subscription Tiers

### Free Tier
- 3 Intimacy Deck draws per day
- Basic games (limited questions)
- 7-day Moments history
- 6 free gifts
- Morning/Goodnight rituals
- Basic chat
- Single time capsule at a time

### Closer+ ($9.99/month or $79.99/year)
- **Unlimited** Intimacy Deck draws
- **All** game questions unlocked
- **Unlimited** Moments history
- **20 premium gifts** included
- All rituals
- Voice messages
- 5 time capsules active
- Custom themes
- Priority support
- No upgrade prompts

### Closer Pro ($14.99/month or $119.99/year)
Everything in Closer+ plus:
- **Create custom question decks**
- **Relationship insights dashboard**
- Analytics on your connection patterns
- Unlimited time capsules
- Extended voice notes (5 min vs 1 min)
- Export moments as PDF
- Custom anniversary reminders
- **All gifts free** (including purchasables)
- Early access to new features

## One-Time Purchases

### Gift Purchases
- Individual gifts: $0.99 - $4.99
- Gift bundles: $3.99 - $29.99

### Theme Packs
- Custom color themes: $2.99 each
- Theme bundle (all 10): $14.99

### Special Features
- Extra custom decks (beyond Pro limit): $4.99 each
- Moment book export (physical-quality PDF): $9.99

## Premium Conversion Points

| Trigger | Prompt |
|---------|--------|
| 3rd card draw of day | "Out of draws. Upgrade for unlimited!" |
| Day 7 of use | "You've built 7 days of memories. Keep them forever?" |
| Day 14 streak | "Amazing streak! Protect it with Closer+" |
| View old moment | "Upgrade to access full history" |
| Try to open 2nd capsule | "One capsule at a time. Upgrade for more!" |
| Send premium gift | "This gift is Closer+ only. Upgrade?" |

---

# Missing Elements Now Added

## 1. Notification System (Detailed)

### Push Notification Types

| Type | Example | Timing |
|------|---------|--------|
| Partner online | "[Name] is online" | When they open app |
| Message received | "New message from [Name]" | Immediate |
| Game invite | "[Name] wants to play Hot Takes!" | Immediate |
| Daily question | "Today's question is ready" | 8am local |
| Ritual reminder | "Say good morning to [Name]?" | 7am local |
| Streak warning | "Don't break your 14-day streak!" | 8pm if no activity |
| Gift received | "[Name] sent you a gift! 🎁" | Immediate |
| Capsule unlock | "Your time capsule is ready!" | Unlock date, 9am |
| Weekly check-in | "Time for your weekly check-in" | Sunday 10am |
| Milestone | "Tomorrow is your 100-day anniversary!" | Day before |

### In-App Notifications

| Location | Type |
|----------|------|
| Nav badge | Unread message count |
| Connect badge | Pending game invites |
| Moments badge | New shared moments |
| Us badge | New achievements |

## 2. Streak System (Detailed)

### What Counts as Activity

| Activity | Counts for Streak? |
|----------|-------------------|
| Send message | ✓ |
| Send ritual | ✓ |
| Answer daily question | ✓ |
| Play any game | ✓ |
| Save a moment | ✓ |
| Send gift | ✓ |
| Open app only | ✗ |

### Streak Tiers & Rewards

| Streak | Badge | Reward |
|--------|-------|--------|
| 7 days | Week Warrior | Unlock 1 premium gift |
| 14 days | Two Week Team | Unlock custom theme |
| 30 days | Monthly Magic | 1 week Closer+ free |
| 50 days | Fifty & Thriving | Premium gift bundle |
| 100 days | Century of Love | 1 month Closer+ free |
| 365 days | Year of Love | Lifetime badge + 3 months Pro |

### Streak Freeze (Premium)
- Included with Closer+
- 1 freeze per week
- Protects streak if missed day
- Shows "frozen" indicator

## 3. Achievement System (Complete)

### Conversation Achievements

| Achievement | Requirement | Badge |
|-------------|-------------|-------|
| First Words | Send first message | 💬 |
| Chatterbox | Send 100 messages | 💬💬 |
| Novel Writer | Send 1000 messages | 📚 |
| Voice of Love | Send 50 voice notes | 🎤 |
| Whisper Secret | Send first whisper | 🤫 |

### Game Achievements

| Achievement | Requirement | Badge |
|-------------|-------------|-------|
| Card Collector | Draw 50 cards | 🃏 |
| Deck Master | Complete all categories | 👑 |
| Hot Take Pro | Play 25 Hot Takes | 🔥 |
| Choice Maker | Play 25 WYR | 🤔 |
| Dream Team | Complete a dream | ✨ |
| Time Traveler | Open 5 time capsules | ⏰ |

### Ritual Achievements

| Achievement | Requirement | Badge |
|-------------|-------------|-------|
| Early Bird | 7 morning hellos | 🌅 |
| Night Owl | 7 goodnights | 🌙 |
| Grateful Heart | 30 gratitudes shared | 🙏 |
| Always Thinking | 50 thinking-of-you taps | 💭 |
| Weekly Regular | 10 weekly check-ins | 📆 |

### Moment Achievements

| Achievement | Requirement | Badge |
|-------------|-------------|-------|
| Memory Maker | Save 10 moments | 📸 |
| Archivist | Save 100 moments | 🏛️ |
| Music Lover | Share 20 songs | 🎵 |
| Quotable | Save 25 quotes | 💬 |

### Streak Achievements

| Achievement | Requirement | Badge |
|-------------|-------------|-------|
| Week Warrior | 7-day streak | ⚡ |
| Month Master | 30-day streak | 🔥 |
| Unstoppable | 100-day streak | 💎 |
| Legendary | 365-day streak | 👑 |

## 4. Onboarding Tutorial

### First-Time User Experience

```
After signup + partner link:

Step 1: Welcome
"Welcome to Closer, [Name] & [Partner]!"
Heart animation
"Let's show you around"

Step 2: Home Tour
Highlight: Timezone pill
"See each other's time at a glance"
Highlight: Connection visual
"This represents your connection"
Highlight: Countdown
"Count down to your next visit"
Highlight: Daily card
"Answer a new question every day"

Step 3: Connect Tour
"This is where you play together"
Show: Card stack
"Draw cards to spark conversations"
Show: Games grid
"Games to play anytime"
Show: Rituals
"Daily rituals keep you connected"

Step 4: Messages Tour
"Your private space to chat"
Show: Chat area
Show: Whisper feature
"Send secret messages"

Step 5: Moments Tour
"Your relationship timeline"
"Photos, songs, memories - all here"

Step 6: First Action Prompt
"Ready to start?"
[Draw Your First Card] button
or [Say Hello to Partner] button

Step 7: Tutorial Complete
"You're all set!"
"We'll send helpful tips as you explore"
```

## 5. Empty States

### No Messages Yet
```
"Your story starts here"
[illustration of two speech bubbles]
"Send your first message to [Partner]"
[Say Hello] button
```

### No Moments Yet
```
"Your memories are waiting"
[illustration of empty photo frames]
"Share your first photo or save a conversation"
[Add a Moment] button
```

### No Games Played
```
"Ready to play?"
[illustration of card deck]
"Draw your first card together"
[Draw Card] button
```

### Partner Not Linked
```
"Better together"
[illustration of two people]
"Invite your partner to join"
[Share Invite Code] button
or
[Enter Partner's Code] field
```

## 6. Error States

### Connection Lost
```
"Reconnecting..."
[spinning indicator]
"Check your internet connection"
[Retry] button
```

### Partner Offline for Game
```
"[Partner] needs to be online for this"
"We'll notify them to join"
[Send Invite] button
[Play Solo Practice] (for applicable games)
```

### Failed to Send Message
```
"Message didn't send"
[Retry] [Delete]
Red indicator on message
```

## 7. Settings Details

### Notification Settings

```
Messages
├── New messages ────────────────── ON/OFF
├── Whisper messages ────────────── ON/OFF
└── Message reactions ───────────── ON/OFF

Activities
├── Game invites ────────────────── ON/OFF
├── Partner's turn complete ─────── ON/OFF
├── New daily question ──────────── ON/OFF
└── Capsule unlocked ────────────── ON/OFF

Rituals
├── Morning reminder ────────────── ON/OFF (time picker)
├── Goodnight reminder ──────────── ON/OFF (time picker)
├── Weekly check-in ─────────────── ON/OFF (day picker)
└── Thinking of you received ────── ON/OFF

Streaks & Achievements
├── Streak warnings ─────────────── ON/OFF
├── Achievement unlocks ─────────── ON/OFF
└── Milestone reminders ─────────── ON/OFF

Quiet Hours
├── Enable ──────────────────────── ON/OFF
├── Start time ──────────────────── [time]
└── End time ────────────────────── [time]
```

### Privacy Settings

```
Profile Visibility
├── Show online status ──────────── ON/OFF
├── Show typing indicator ────────── ON/OFF
└── Show read receipts ──────────── ON/OFF

Data
├── Download my data ────────────── [Request]
├── Delete all messages ─────────── [Delete]
├── Clear game history ──────────── [Clear]
└── Delete account ──────────────── [Delete]

Security
├── Change password ─────────────── [Change]
├── Two-factor auth ─────────────── ON/OFF
└── Active sessions ─────────────── [View]
```

---

# Additional Nuances & Improvements

## 1. Timezone Intelligence

### Smart Notifications
- Morning ritual: Sent based on YOUR timezone
- Partner status: Shows THEIR local time
- Game invites: Warns if partner likely asleep
- "Good morning" won't send if it's their midnight

### Timezone Display
- Always shows both times on home
- Time difference shown: "(6 hours ahead)"
- Sunrise/sunset indicators
- "Good time to call?" indicator based on both times

## 2. Relationship Health Indicators

### Weekly Summary (Pro feature)
```
This Week in Your Relationship:

Messages: 127 (↑ from 98 last week)
Games Played: 8
Moments Saved: 5
Daily Questions: 7/7 ✓
Rituals Completed: 15
Gifts Exchanged: 2

Connection Score: 92/100 (Strong!)

"You're both putting in great effort this week"
```

### Engagement Balance
- Shows if one partner is more active
- Gentle nudges, not guilt trips
- "You've been busy! [Partner] would love to hear from you"

## 3. Customization Options

### Theme Options (Premium)

| Theme | Colors |
|-------|--------|
| Default (Closer Dark) | Clay + Mist on dark |
| Warm Sunset | Orange + Pink on warm dark |
| Ocean Deep | Teal + Blue on navy |
| Forest | Green + Gold on forest |
| Midnight | Purple + Silver on black |
| Rose | Pink + Rose on dark mauve |
| Custom | Pick your own colors |

### Display Name Options
- Your name (how partner sees you)
- Partner's pet name for you
- Nickname in app

## 4. Accessibility Features

### Visual
- High contrast mode
- Larger text option
- Reduce motion
- Reduce transparency

### Audio
- Screen reader support
- Voice control
- Notification sounds toggle
- Haptics toggle

### Interaction
- One-handed mode
- Switch control support
- Keyboard navigation
- Focus indicators

## 5. Offline Support

### What Works Offline
- Read cached messages
- View saved moments
- Draft messages (send when online)
- View game history
- Access settings

### What Requires Connection
- Send messages
- Play games (real-time)
- Upload photos
- Receive notifications
- Partner status

### Offline Indicator
- Subtle banner when offline
- Queue indicator for pending actions
- Auto-sync when reconnected

## 6. Data & Privacy

### What We Store
- Account info
- Messages (encrypted at rest)
- Moments (encrypted)
- Game history
- Usage analytics (anonymized)

### What We Don't Store
- Location data (beyond timezone)
- Contact lists
- Call logs
- Browsing history

### Data Export
- Full export available
- JSON or PDF format
- Messages, moments, game history
- Processing time: 24-48 hours

### Deletion
- Account deletion: Immediate
- Messages: Removed from both accounts
- Moments: User chooses to keep or delete
- 30-day grace period before permanent

---

# Final Checklist

## Is Everything Included for V1?

### Core Features ✓
- [x] 5 main views
- [x] Partner linking
- [x] Messaging with all types
- [x] All 5 games fully detailed
- [x] All 5 rituals fully detailed
- [x] Moments system complete
- [x] Profile and settings

### Monetization ✓
- [x] 3 subscription tiers
- [x] Gift purchase system
- [x] No virtual currency
- [x] Conversion triggers defined

### Engagement ✓
- [x] Streak system
- [x] Achievement system
- [x] Notification strategy
- [x] Retention hooks

### Polish ✓
- [x] Onboarding flow
- [x] Empty states
- [x] Error states
- [x] Accessibility
- [x] Offline support

### Technical ✓
- [x] All page routes defined
- [x] Component structure
- [x] Animation specifications
- [x] Data models implied

---

## What Could Be Added Post-V1

### Phase 2 Features
- Video/audio calls
- Watch together (sync streaming)
- Shared playlists (Spotify integration)
- Photo albums (organized moments)

### Phase 3 Features
- Couple challenges (30-day programs)
- AI relationship insights
- Date idea suggestions
- Love language quiz

### Phase 4 Features
- Widget for home screen
- Apple Watch companion
- Shared calendar integration
- Couple's bucket list

---

*This document supersedes previous specifications.*
*All features are 100% digital, no physical integrations.*
*No virtual currency - direct purchases only.*
*Ready for V1 implementation.*
