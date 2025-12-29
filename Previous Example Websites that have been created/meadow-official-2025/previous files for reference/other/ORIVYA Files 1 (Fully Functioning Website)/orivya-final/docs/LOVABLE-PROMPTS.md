# ORIVYA — Lovable Prompts (Copy-Paste Ready)

These prompts are designed to be copied directly into Lovable. Use them in order.

---

## PROMPT 1: Design System Setup

```
Set up the design system with these exact specifications:

COLORS:
- --bg-base: #08080a
- --bg-elevated: #0e0e11  
- --bg-surface: #141417
- --bg-hover: #1e1e23
- --sage: #7d9b8a (primary accent)
- --sage-light: #9bb3a7
- --sage-dark: #5f8170
- --text-primary: #fafafa
- --text-secondary: #a1a1aa
- --text-muted: #71717a
- --border: rgba(255,255,255,0.08)
- --success: #4ade80
- --error: #f87171

FONTS:
- Display/headings: Fraunces from Google Fonts
- Body: Inter from Google Fonts

DEFAULTS:
- Border radius: 8px (cards: 14px, modals: 20px)
- Minimum touch target: 44px height
- Base spacing unit: 4px

Create these as CSS custom properties in the global styles.
```

---

## PROMPT 2: Database Tables

```
Create Supabase tables for a journaling app:

1. PROFILES table (extends auth.users):
- id (uuid, primary key, references auth.users)
- display_name (text)
- avatar_url (text)  
- plan (text: 'free' or 'pro', default 'free')
- current_streak (integer, default 0)
- created_at, updated_at (timestamps)

2. NOTES table:
- id (uuid, auto-generated)
- user_id (uuid, references auth.users)
- title (text, nullable)
- body (text, required)
- word_count (integer)
- category (text: 'personal', 'work', 'relationships', 'health', 'uncategorized')
- thread_id (uuid, nullable, references threads)
- status (text: 'active', 'archived', 'deleted')
- created_at, updated_at, archived_at (timestamps)

3. THREADS table:
- id (uuid)
- user_id (uuid)
- title (text)
- description (text)
- color (text: 'sage', 'blue', 'purple', 'amber', 'rose', 'gray')
- status (text: 'active', 'resolved', 'archived')
- created_at, updated_at, resolved_at (timestamps)

4. GOALS table:
- id (uuid)
- user_id (uuid)
- title (text)
- description (text)
- target_date (date)
- status (text: 'active', 'achieved', 'abandoned')
- created_at, updated_at, achieved_at (timestamps)

5. MILESTONES table:
- id (uuid)
- goal_id (uuid, references goals)
- title (text)
- is_completed (boolean)
- sort_order (integer)
- completed_at (timestamp)

Enable Row Level Security on all tables. Users should only access their own data.
```

---

## PROMPT 3: Authentication Flow

```
Create an authentication flow with these screens:

WELCOME SCREEN (/):
- Dark background (#08080a)
- Centered content
- App icon or logo placeholder (sage green circle with leaf icon)
- Title: "ORIVYA" in Fraunces font, 32px
- Subtitle: "Your private space for reflection" in Inter, text-secondary color
- Primary button: "Get Started" (sage green #7d9b8a background, white text, full width, 48px height, rounded-lg)
- Link below: "I already have an account" (sage color, underline on hover)

SIGN UP SCREEN (/signup):
- Back button (top left)
- Title: "Create your account"
- Form with:
  - Email input (dark surface background, rounded-md, 48px height)
  - Password input with show/hide toggle
  - Confirm password input
- "Create Account" primary button
- Divider: "or continue with"
- Google sign-in button (outline style)
- Apple sign-in button (outline style)
- Footer: "Already have an account? Sign in" link

SIGN IN SCREEN (/signin):
- Same layout as sign up
- Title: "Welcome back"
- Email and password inputs
- "Forgot password?" link (right-aligned)
- "Sign In" button
- Social auth buttons
- Footer: "Don't have an account? Sign up"

Use Supabase authentication. After successful auth, redirect to /dashboard.
Show loading states on buttons during auth.
Show error messages inline below inputs.
```

---

## PROMPT 4: Home Dashboard

```
Create the home dashboard at /dashboard:

HEADER SECTION:
- Greeting based on time of day:
  - Before 12pm: "Good morning"
  - 12pm-5pm: "Good afternoon"  
  - 5pm-9pm: "Good evening"
  - After 9pm: "Good night"
- User's first name after greeting (from Supabase profile)
- Subtitle: "How are you feeling today?" (text-secondary)
- Settings icon button (top right corner, gear icon)
- All text left-aligned

DAILY PROMPT CARD:
- Full width card with subtle gradient border (sage-green tinted)
- Background: bg-surface (#141417)
- Left side: Sparkle/lightbulb icon (sage color)
- Prompt text: "What's one thing you're grateful for right now?"
- "Start Writing" button (secondary style, right side)
- Card should feel inviting and gentle

RECENT NOTES SECTION:
- Section header: "Recent" with "See all" link (right side)
- Show 3-5 most recent notes from Supabase where status='active', ordered by created_at desc
- Each note card:
  - Left colored bar (4px wide) based on category
  - Title or first line of body (truncate to 1 line)
  - Body preview (truncate to 2 lines, text-muted)
  - Bottom row: relative timestamp, word count, thread badge if linked
- Tap card to navigate to /notes/[id]

STATS ROW (optional):
- Small text showing streak: "🔥 5 day streak" or notes this week

FLOATING ACTION BUTTON:
- Fixed position, bottom-right (above tab bar)
- Sage green circle, 56px diameter
- Plus icon (white)
- Shadow for elevation
- Tap to go to /notes/new

BOTTOM TAB BAR:
- Fixed to bottom
- Safe area padding for mobile
- 5 tabs with icons and labels:
  1. Home (house icon) - /dashboard
  2. Notes (document icon) - /notes  
  3. Threads (git-branch icon) - /threads
  4. Goals (target icon) - /goals
  5. Insights (lightbulb icon) - /insights
- Active tab: sage color icon and text
- Inactive tabs: text-muted color
- Each tab 64px wide minimum

Add loading skeleton while fetching notes.
```

---

## PROMPT 5: Notes List

```
Create the notes list screen at /notes:

HEADER:
- Title "Notes" in Fraunces font, 28px
- Right side: Search icon button, Filter icon button
- Sticky header with blur backdrop on scroll

FILTER CHIPS:
- Horizontal scrollable row below header
- Chips: "All", "Personal", "Work", "Relationships", "Health"
- Each chip shows category dot color
- Selected chip has sage background, others have surface background
- Tap to filter notes by category

NOTES LIST:
- Fetch from Supabase: notes where user_id = current user and status = 'active'
- Group by date:
  - "Today" (if created today)
  - "Yesterday" (if created yesterday)
  - "This Week" (if within 7 days)
  - "Earlier" (everything else)
- Date headers in text-muted, uppercase, smaller font

EACH NOTE CARD:
- Category color bar on left (4px wide, full height)
  - Personal: sage green
  - Work: blue (#60a5fa)
  - Relationships: rose (#fb7185)
  - Health: amber (#fbbf24)
  - Uncategorized: gray
- Title (or first line if no title), font-medium, 1 line max
- Body preview, text-secondary, 2 lines max
- Metadata row: "2h ago · 156 words" and thread badge if linked
- Tap to navigate to /notes/[id]
- Card has subtle border, 14px border-radius, bg-surface

EMPTY STATE (when no notes):
- Centered content
- Illustration or document icon (large, muted)
- Title: "No notes yet"
- Subtitle: "Start capturing your thoughts"
- "Write your first note" button (sage, primary)

FAB:
- Same as dashboard, navigates to /notes/new

Include tab bar at bottom.
Loading skeleton while fetching.
```

---

## PROMPT 6: Note Editor

```
Create the note editor at /notes/new and /notes/[id]/edit:

HEADER (sticky):
- Left: Back/close button (X icon)
- Center: Autosave indicator
  - Idle: "Draft" (muted)
  - Saving: Spinner + "Saving..." (sage)
  - Saved: Checkmark + "Saved" (sage, fades after 2s)
  - Error: "Couldn't save" (error red)
- Right: "Done" button (sage text, taps saves and navigates back)

EDITOR:
- Full screen text area
- No border, transparent background
- Placeholder: "What's on your mind?" (text-muted)
- Font: Inter, 18px, line-height 1.7
- Auto-growing height (min-height: 60vh)
- Padding: 20px horizontal, 16px top
- Focus state: no visible outline

AUTOSAVE LOGIC:
- Create note in Supabase immediately on first character (with status 'active')
- Debounce saves: wait 2 seconds after user stops typing
- Update existing note on subsequent saves
- Calculate word_count: split by whitespace, filter empty, count

BOTTOM TOOLBAR (fixed):
- Background: bg-surface with top border
- Left side: Category picker
  - Shows current category as pill/chip
  - Tap opens bottom sheet with category options
  - Each option has colored dot and label
  - Selecting closes sheet and updates note
- Center: Thread link button (chain icon)
  - Shows "Add to thread" or thread name if linked
- Right side: Word count (text-muted, small)
- Safe area padding at bottom

CATEGORY PICKER BOTTOM SHEET:
- Title: "Category"
- List items with radio selection:
  - Personal (sage dot)
  - Work (blue dot)
  - Relationships (rose dot)
  - Health (amber dot)
  - Uncategorized (gray dot)
- Checkmark on selected item
- Tap to select and close

For edit mode (/notes/[id]/edit):
- Fetch existing note from Supabase
- Pre-populate all fields
- Same autosave behavior
```

---

## PROMPT 7: Note View

```
Create the note view at /notes/[id]:

HEADER:
- Left: Back button
- Right: Edit button (pencil icon), More menu (three dots)

MORE MENU OPTIONS:
- Add to Thread (if not in thread)
- Link to Goal
- Archive
- Delete (danger/red)

CONTENT:
- Top padding: 24px
- If title exists: show in Fraunces font, 24px, font-semibold
- Category badge below title (pill with colored dot and text)
- Body text: Inter, 16px, line-height 1.8, text-primary
- Preserve line breaks from body
- Bottom metadata: "Created [date] · [word_count] words"

THREAD CONTEXT (if note.thread_id exists):
- Card below main content
- "Part of" label in text-muted
- Thread title with thread color accent
- Right arrow to navigate to thread
- Show position: "Note 3 of 12 in this thread"

RELATED NOTES (optional):
- If AI analysis suggests related notes, show them
- "Related" section with small note previews

ACTION BAR (bottom, fixed):
- "Edit" button (full width, secondary style)
- Or make the entire content area tappable to edit

Fetch note from Supabase by ID.
Handle 404 if note doesn't exist or doesn't belong to user.
```

---

## PROMPT 8: Threads List

```
Create the threads list at /threads:

HEADER:
- Title "Threads" in Fraunces font
- Right: "New" button (or use FAB)

SEGMENT CONTROL:
- Two options: "Active" | "Resolved"
- Active selected by default
- Underline style indicator

THREADS LIST:
- Fetch from Supabase: threads where user_id = current user
- Filter by status based on segment selection
- Order by updated_at desc

EACH THREAD CARD:
- Left: Thread icon (circle with thread color background)
- Thread title (font-medium)
- Description (1 line, text-secondary, truncate)
- Stats: "12 notes · Updated 2 days ago"
- If resolved: "Resolved" badge (muted)
- Card with bg-surface, 14px radius, subtle border
- Tap to navigate to /threads/[id]

EMPTY STATE:
- Icon (git-branch, large, muted)
- "No threads yet"
- "Group related notes to see patterns over time"
- "Create Thread" button

NEW THREAD MODAL (when tapping New):
- Title: "New Thread"
- Thread title input (required)
- Description textarea (optional)
- Color picker (6 color dots: sage, blue, purple, amber, rose, gray)
- "Create" button
- Creates thread in Supabase and navigates to it

Tab bar at bottom.
```

---

## PROMPT 9: Thread Detail

```
Create thread detail at /threads/[id]:

HEADER:
- Back button
- Thread title (can truncate)
- Edit button, More menu (Archive, Delete)

THREAD INFO SECTION:
- Large colored circle with thread icon (based on thread.color)
- Title (editable inline, Fraunces font, 24px)
- Description (editable, text-secondary)
- Stats row: "X notes · Created [date]"
- Status badge if resolved

TIMELINE VIEW:
- Vertical line (left side, 2px, thread color)
- Notes arranged chronologically
- Each note entry:
  - Date marker (circle on the timeline)
  - Note preview card (title, body preview, tap to view)
- Oldest at top or newest at top (add toggle)

NO NOTES YET:
- "No notes in this thread"
- "Add your first note" button

ACTIONS (bottom sticky):
- "Add Note" button (sage, primary)
  - Creates new note with thread_id pre-set
- If active: "Mark as Resolved" button (secondary)
- If resolved: "Reopen Thread" button

Fetch thread and its notes from Supabase.
Notes query: where thread_id = this thread, order by created_at.
```

---

## PROMPT 10: Goals List

```
Create goals list at /goals:

HEADER:
- Title "Goals" in Fraunces font
- "New" button (right)

SEGMENT CONTROL:
- "Active" | "Achieved" | "All"
- Active selected by default

GOALS LIST:
- Fetch from Supabase by status filter
- Order by target_date asc (soonest first), then created_at

EACH GOAL CARD:
- Title (font-medium)
- Target date if set: "Target: Jan 15, 2025" with calendar icon
- Milestone progress bar:
  - Sage green fill on gray background
  - "2 of 4 milestones" text
- Linked notes count: "5 notes" 
- Card styling same as threads

EMPTY STATE:
- Target icon (large, muted)
- "Set your intentions"
- "Track progress toward what matters"
- "Create Goal" button

NEW GOAL MODAL:
- "New Goal" title
- Title input (required)
- Description textarea
- Target date picker (optional)
- "Create" button

Tab bar at bottom.
```

---

## PROMPT 11: Goal Detail

```
Create goal detail at /goals/[id]:

HEADER:
- Back button  
- Goal title
- Edit button, More menu (Abandon, Delete)

GOAL INFO:
- Title (Fraunces, 24px)
- Description (text-secondary)
- Target date with calendar icon (or "No target date")
- Status badge

PROGRESS SECTION:
- Progress ring or bar showing milestone completion
- "2 of 4 milestones complete"

MILESTONES SECTION:
- Section title "Milestones"
- List of milestones as checkboxes:
  - Unchecked: circle outline, normal text
  - Checked: sage checkmark, strikethrough text, muted
- Tap checkbox to toggle completion (update Supabase)
- "Add milestone" row at bottom (plus icon, tap to add inline)

LINKED NOTES SECTION:
- Section title "Related Notes" with count
- Compact list of linked notes
- Tap to view note
- "Link a note" button (opens note picker)

MAIN ACTION (bottom):
- If active: "Mark as Achieved" button (sage, celebratory)
  - On tap: show confetti animation, update status
- If achieved: "Reopen Goal" button
- If abandoned: "Reactivate Goal" button

Fetch goal, milestones, and linked notes from Supabase.
```

---

## PROMPT 12: Settings Screen

```
Create settings at /settings:

HEADER:
- Back button
- Title "Settings"

SECTIONS with list items:

ACCOUNT SECTION:
- Profile row: Avatar circle, name, email, right arrow
  - Navigates to /settings/account
- Subscription row: "Free Plan" or "Pro Plan", right arrow
  - Navigates to /settings/subscription

WRITING SECTION:
- Default category: dropdown/picker showing current value
- Show word count: toggle switch
- Autosave: toggle switch (default on)

NOTIFICATIONS SECTION:
- Daily reminder: toggle with time picker (e.g., "9:00 AM")
- Evening reflection: toggle with time picker

AI FEATURES SECTION (show for Pro users):
- AI insights: toggle
- Thread summaries: toggle

APPEARANCE SECTION:
- Theme: selector with Dark / Light / System options
- Text size: slider from small to large

PRIVACY SECTION:
- Passcode lock: toggle
- Analytics: toggle

DATA SECTION:
- Export all data: button (triggers export)
- Delete account: danger red text, confirmation required

ABOUT SECTION:
- Help Center: link
- Send Feedback: link  
- Rate the App: link
- Version: "1.0.0" (muted text)

Each section has gray header text, items in cards.
Toggle switches should be sage green when on.
```

---

## PROMPT 13: Empty States & Loading

```
Add these states throughout the app:

LOADING SKELETONS:
- For note cards: Rectangle placeholder with shimmer animation
- For text content: Multiple line placeholders at 100%, 80%, 60% width
- For avatars: Circle placeholder
- Use bg-surface-2 color, animate opacity

EMPTY STATES (add to each list screen if not already):

Notes empty:
- Document icon (48px, text-muted)
- "No notes yet"
- "Your thoughts are waiting to be captured"
- "Start writing" button

Threads empty:
- Git-branch icon
- "No threads yet"  
- "Connect related thoughts to discover patterns"
- "Create thread" button

Goals empty:
- Target icon
- "No goals yet"
- "Set intentions to track your progress"
- "Add a goal" button

Insights empty:
- Lightbulb icon
- "No insights yet"
- "Keep writing and patterns will emerge"
- (No button, just informational)

Search no results:
- Search icon
- "No results for '[query]'"
- "Try different keywords"

ERROR STATES:
- For failed data fetches: "Something went wrong" with "Try again" button
- For offline: "You're offline" with "Retry when connected"

Apply consistent styling: centered content, muted icon, clear title, helpful subtitle, optional action button.
```

---

## PROMPT 14: Toast Notifications

```
Add a toast notification system:

TOAST COMPONENT:
- Fixed position, bottom center (above tab bar on mobile)
- Max width 400px
- Background: bg-elevated
- Border: subtle border
- Border radius: 12px
- Shadow for elevation
- Padding: 12px 16px

TOAST CONTENT:
- Left: Icon based on type
  - Success: green checkmark circle
  - Error: red X circle
  - Info: blue info circle
  - Warning: amber warning triangle
- Middle: Message text
- Right (optional): Action button or dismiss X

TOAST TYPES:

Success toasts:
- "Note saved"
- "Thread created"
- "Goal achieved! 🎉"
- "Changes saved"

Error toasts:
- "Couldn't save. Tap to retry."
- "Something went wrong"
- "No internet connection"

Info toasts:
- "Note moved to archive"
- "Syncing..."

BEHAVIOR:
- Auto-dismiss after 4 seconds (except errors)
- Manual dismiss with X button
- Stack multiple toasts vertically
- Slide up animation on enter, fade out on exit

Create a global toast context/store to trigger toasts from anywhere.
```

---

## PROMPT 15: Final Polish

```
Add final polish to the app:

TRANSITIONS:
- Page transitions: subtle fade or slide
- Modal/sheet animations: slide up from bottom
- Button press: scale down slightly (0.98)
- Card hover (desktop): subtle lift shadow

MICRO-INTERACTIONS:
- Checkboxes: bounce animation when checked
- Toggle switches: smooth slide
- FAB: scale on tap
- Pull to refresh on lists

ACCESSIBILITY:
- All interactive elements have 44px minimum tap target
- Buttons have visible focus states (sage outline)
- Form inputs have proper labels
- Error messages associated with inputs
- Sufficient color contrast (check text-secondary on bg)

RESPONSIVE:
- Mobile first (375px minimum)
- Tablet: 2-column layout for notes list
- Desktop: sidebar navigation instead of bottom tabs

TYPOGRAPHY:
- Ensure Fraunces is loaded for headings
- Ensure Inter is loaded for body
- Fallback to system fonts

FINAL CHECKS:
- All Supabase queries have error handling
- Loading states on all async operations
- Empty states on all lists
- Proper authentication guards on protected routes
- Sign out functionality in settings

Test the complete flow:
1. Sign up → 2. See empty dashboard → 3. Write first note → 4. View notes list → 5. Create thread → 6. Add note to thread → 7. Set goal → 8. Complete milestone → 9. Settings → 10. Sign out
```

---

## Tips

1. **Go in order** — Each prompt builds on the previous
2. **Test after each prompt** — Make sure it works before moving on
3. **Use screenshots** — Open HTML files and screenshot for reference
4. **Be patient** — Let Lovable finish before adding more
5. **Iterate** — If something's wrong, describe the specific issue

Good luck! 🌿
