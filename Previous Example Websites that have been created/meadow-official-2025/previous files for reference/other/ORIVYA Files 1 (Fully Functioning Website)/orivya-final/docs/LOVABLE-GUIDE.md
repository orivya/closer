# ORIVYA V1 — Lovable Implementation Guide

This guide is optimized for building ORIVYA on [Lovable](https://lovable.dev).

---

## Overview

Lovable is ideal for ORIVYA because:
- ✅ Built-in Supabase (database, auth, real-time)
- ✅ React + Tailwind (matches our design system)
- ✅ Visual reference support (use HTML screenshots)
- ✅ One-click deployment
- ✅ Iterative AI-powered development

---

## Setup Checklist

### 1. Project Initialization
- [ ] Create new Lovable project
- [ ] Name it "ORIVYA" or your preferred name
- [ ] Connect Supabase (Lovable does this automatically)

### 2. Design System Setup
First prompt to Lovable:

```
Set up a design system with these specifications:

COLORS (Dark Mode Primary):
- Background base: #08080a
- Background elevated: #0e0e11
- Background surface: #141417
- Primary accent (sage green): #7d9b8a
- Text primary: #fafafa
- Text secondary: #a1a1aa
- Text muted: #71717a
- Border subtle: rgba(255,255,255,0.08)
- Success: #4ade80
- Error: #f87171

TYPOGRAPHY:
- Display font: Fraunces (Google Fonts)
- Body font: Inter (Google Fonts)
- Base size: 14px

SPACING:
- Use 4px base unit (4, 8, 12, 16, 20, 24, 32, 48)
- Border radius: 8px default, 14px for cards, 20px for modals
- Touch targets: minimum 44px

Create global CSS variables for these tokens.
```

---

## Database Schema (Supabase)

### 3. Set Up Tables

Go to Supabase (via Lovable's integration) and create these tables:

#### Users Table (extends Supabase auth.users)
```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  timezone text default 'UTC',
  plan text default 'free' check (plan in ('free', 'pro')),
  current_streak integer default 0,
  longest_streak integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Users can only see/edit their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
```

#### Notes Table
```sql
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text,
  body text not null,
  body_plain text,
  word_count integer default 0,
  category text default 'uncategorized' 
    check (category in ('personal', 'work', 'relationships', 'health', 'uncategorized')),
  thread_id uuid references public.threads on delete set null,
  status text default 'active' check (status in ('active', 'archived', 'deleted')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  archived_at timestamp with time zone,
  deleted_at timestamp with time zone
);

-- Enable RLS
alter table public.notes enable row level security;

-- Users can only access their own notes
create policy "Users can CRUD own notes" on notes
  for all using (auth.uid() = user_id);

-- Indexes for performance
create index notes_user_id_idx on notes(user_id);
create index notes_thread_id_idx on notes(thread_id);
create index notes_status_idx on notes(status);
create index notes_created_at_idx on notes(created_at desc);
```

#### Threads Table
```sql
create table public.threads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  color text default 'sage' 
    check (color in ('sage', 'blue', 'purple', 'amber', 'rose', 'gray')),
  icon text default 'thread',
  status text default 'active' check (status in ('active', 'resolved', 'archived')),
  resolved_at timestamp with time zone,
  resolution_note text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.threads enable row level security;

create policy "Users can CRUD own threads" on threads
  for all using (auth.uid() = user_id);
```

#### Goals Table
```sql
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  target_date date,
  status text default 'active' check (status in ('active', 'achieved', 'abandoned')),
  achieved_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.goals enable row level security;

create policy "Users can CRUD own goals" on goals
  for all using (auth.uid() = user_id);
```

#### Goal-Note Links (many-to-many)
```sql
create table public.goal_notes (
  goal_id uuid references public.goals on delete cascade,
  note_id uuid references public.notes on delete cascade,
  primary key (goal_id, note_id)
);

alter table public.goal_notes enable row level security;

create policy "Users can manage own goal-note links" on goal_notes
  for all using (
    exists (select 1 from goals where id = goal_id and user_id = auth.uid())
  );
```

#### Milestones Table
```sql
create table public.milestones (
  id uuid default gen_random_uuid() primary key,
  goal_id uuid references public.goals on delete cascade not null,
  title text not null,
  is_completed boolean default false,
  completed_at timestamp with time zone,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.milestones enable row level security;

create policy "Users can manage own milestones" on milestones
  for all using (
    exists (select 1 from goals where id = goal_id and user_id = auth.uid())
  );
```

---

## Screen-by-Screen Prompts for Lovable

### Phase 1: Authentication

#### Prompt 1.1 — Onboarding
```
Create an onboarding flow with 4 screens:

Screen 1 - Welcome:
- Large sage green (#7d9b8a) icon or illustration
- Title: "Welcome to ORIVYA"
- Subtitle: "Your private space for reflection"
- "Get Started" button (sage green, full width)
- "I already have an account" link below

Screen 2 - Value Prop 1:
- Icon representing writing/journaling
- Title: "Capture your thoughts"
- Body: "Write freely without judgment. Your notes are private and secure."
- Progress dots showing 1 of 3
- "Continue" button

Screen 3 - Value Prop 2:
- Icon representing connections/threads
- Title: "See the patterns"
- Body: "Connect related thoughts into threads and watch your story unfold."
- Progress dots showing 2 of 3
- "Continue" button

Screen 4 - Sign Up Form:
- Email input
- Password input (with show/hide toggle)
- "Create Account" button (sage green)
- "Already have an account? Sign in" link
- Social auth buttons (Google, Apple) with divider "or continue with"

Use dark background (#08080a), white text, sage green accents.
All buttons should be 44px tall minimum.
```

#### Prompt 1.2 — Sign In
```
Create a sign in page:
- Back button in top left
- Title: "Welcome back"
- Email input field
- Password input field with show/hide toggle
- "Forgot password?" link (right-aligned, sage color)
- "Sign In" button (sage green, full width)
- Divider with "or continue with"
- Google and Apple sign in buttons
- "Don't have an account? Sign up" link at bottom

Connect to Supabase auth. After successful login, redirect to home dashboard.
```

---

### Phase 2: Core Screens

#### Prompt 2.1 — Home Dashboard
```
Create the home dashboard with this layout:

HEADER:
- Time-based greeting (Good morning/afternoon/evening) in Fraunces font
- User's first name
- Subline like "How are you feeling today?"
- Settings icon button (top right)

DAILY PROMPT CARD:
- Card with subtle sage gradient border
- Spark/lightbulb icon
- Prompt text like "What's one thing you're grateful for today?"
- "Start Writing" button

RECENT NOTES SECTION:
- Section title "Recent" with "See all" link
- List of 3-5 most recent notes showing:
  - Category color bar (left edge)
  - Title (truncated to 1 line)
  - Preview text (truncated to 2 lines)
  - Timestamp (relative, like "2 hours ago")
  - Thread badge if linked to thread

QUICK ACTIONS:
- Floating action button (bottom right, above tab bar)
- Sage green, plus icon
- 56px diameter

BOTTOM TAB BAR:
- 5 tabs: Home, Notes, Threads, Goals, Insights
- Icons with labels below
- Active tab highlighted in sage
- Fixed to bottom with safe area padding

Fetch notes from Supabase, ordered by created_at desc, limit 5.
```

#### Prompt 2.2 — Notes List
```
Create the notes list screen:

HEADER:
- Title "Notes" (large, Fraunces font)
- Search icon button (right)
- Filter icon button (right)

FILTER CHIPS (horizontal scroll):
- "All" (selected by default)
- "Personal" (with sage dot)
- "Work" (with blue dot)  
- "Relationships" (with rose dot)
- "Health" (with amber dot)

NOTES LIST:
- Grouped by date ("Today", "Yesterday", "This Week", "Earlier")
- Each note card shows:
  - Category indicator (colored bar on left, 3px wide)
  - Title or first line of body
  - Preview (2 lines max)
  - Metadata row: timestamp, word count, thread badge if applicable
- Cards have subtle border, rounded corners (14px)
- Tap to open note view

EMPTY STATE (if no notes):
- Illustration or icon
- "No notes yet"
- "Start capturing your thoughts"
- "Write your first note" button

FAB:
- Sage green, plus icon
- Tapping opens new note editor

Query Supabase for notes where status = 'active', order by created_at desc.
Support filtering by category.
```

#### Prompt 2.3 — Note Editor
```
Create the note editor screen:

HEADER:
- Back/close button (left)
- Autosave indicator (center): shows "Saving..." with spinner, then "Saved" with checkmark
- "Done" button (right, sage color)

MAIN EDITOR:
- Large text area, full width
- Placeholder: "What's on your mind?"
- Font size 18px, line height 1.6
- No visible border (clean writing experience)
- Auto-growing height

BOTTOM TOOLBAR (fixed):
- Category picker (current category shown as chip, tap to change)
- Thread selector (link icon, shows thread name if linked)
- Word count display
- Formatting options (optional: bold, italic, list)

AUTOSAVE BEHAVIOR:
- Save to Supabase 2 seconds after user stops typing
- Show "Saving..." during save
- Show "Saved ✓" for 2 seconds after successful save
- If offline, show "Saved locally" and sync when online

CATEGORY PICKER (bottom sheet when tapped):
- List of categories with colored dots
- Personal, Work, Relationships, Health, Uncategorized
- Checkmark on selected

When saving, upsert to Supabase notes table. Calculate word_count from body.
```

#### Prompt 2.4 — Note View
```
Create the note view/reading screen:

HEADER:
- Back button (left)
- Edit button (right, pencil icon)
- More menu (right, three dots): Archive, Delete, Share

CONTENT AREA:
- Title (if exists) in Fraunces font, 24px
- Body text in Inter font, 16px, comfortable line height
- Category badge below title
- Created date and word count metadata

THREAD CONTEXT (if note is in a thread):
- Card showing thread name and color
- "Part of [Thread Name]" with link to thread
- Show position: "Note 3 of 7 in this thread"
- Previous/Next navigation arrows

RELATED ACTIONS:
- "Add to Thread" button (if not in thread)
- "Link to Goal" button
- Tags section (if we add tags feature)

BOTTOM:
- Large "Edit" button or tap anywhere to edit
```

---

### Phase 3: Threads & Goals

#### Prompt 3.1 — Threads List
```
Create the threads list screen:

HEADER:
- Title "Threads" (Fraunces font)
- "New Thread" button (right, or FAB)

TABS or FILTER:
- "Active" / "Resolved" toggle

THREAD CARDS:
Each thread card shows:
- Thread icon (left)
- Thread color as accent (border or background tint)
- Title (bold)
- Description (1 line, truncated)
- Note count: "12 notes"
- Last activity: "Updated 2 days ago"
- Status badge if resolved

Empty state if no threads:
- "No threads yet"
- "Group related notes into threads to see patterns"
- "Create Thread" button

Tapping a thread opens Thread Detail view.
```

#### Prompt 3.2 — Thread Detail
```
Create the thread detail screen:

HEADER:
- Back button
- Thread title (centered)
- Edit button (pencil) and More menu (archive, delete)

THREAD INFO SECTION:
- Thread icon with color background (circular)
- Title (large, editable inline)
- Description (editable)
- Status: Active or Resolved
- Stats: X notes, created [date]

TIMELINE VIEW:
- Vertical timeline of notes in this thread
- Sorted by date (newest first or oldest first toggle)
- Each note shows:
  - Date marker on timeline
  - Note title/preview
  - Tap to view full note
- Connector lines between notes

THREAD SUMMARY (Pro feature placeholder):
- "AI Summary" section
- Show summary or "Generate Summary" button

ACTIONS:
- "Add Note" button (creates new note pre-linked to this thread)
- "Mark as Resolved" button (if active)
- "Reopen" button (if resolved)
```

#### Prompt 3.3 — Goals List
```
Create the goals list screen:

HEADER:
- Title "Goals" (Fraunces font)
- "New Goal" button

TABS:
- "Active" / "Achieved" / "All"

GOAL CARDS:
Each goal shows:
- Title
- Target date (if set): "Target: Jan 15, 2025"
- Milestone progress bar (e.g., 2 of 4 completed)
- Linked notes count: "5 related notes"
- Status badge

Progress bar should be sage green fill on gray background.

Empty state:
- "Set your intentions"
- "Track progress toward what matters to you"
- "Create Goal" button
```

#### Prompt 3.4 — Goal Detail
```
Create the goal detail screen:

HEADER:
- Back button
- Goal title
- Edit and More menu

GOAL INFO:
- Title (large)
- Description
- Target date with calendar icon
- Status badge (Active/Achieved)

MILESTONES SECTION:
- Title "Milestones"
- Checklist of milestones
- Each milestone has checkbox, title
- Checked items show strikethrough and checkmark
- "Add milestone" button at bottom
- Drag to reorder (optional)

LINKED NOTES SECTION:
- Title "Related Notes" with count
- List of linked note cards (compact view)
- "Link a note" button

PROGRESS:
- Visual progress indicator
- "2 of 4 milestones complete"

ACTIONS:
- "Mark as Achieved" button (shows celebration!)
- Or "Reopen" if achieved
```

---

### Phase 4: Supporting Screens

#### Prompt 4.1 — Search
```
Create a search screen:

SEARCH BAR:
- Auto-focused input
- Search icon inside input
- Clear button (X) when text entered
- "Cancel" button to close search

SEARCH BEHAVIOR:
- Search note titles and body content
- Debounce 300ms before searching
- Show loading state while searching

RESULTS:
- Group by type: Notes, Threads, Goals (or just notes for V1)
- Each result shows match context (highlighted search term)
- Tap to open item

RECENT SEARCHES (before typing):
- Show last 5 searches
- Tap to re-run search
- Clear all button

NO RESULTS STATE:
- "No results for '[query]'"
- Suggestions: "Try different keywords"

Use Supabase full-text search or ILIKE query on notes.body and notes.title.
```

#### Prompt 4.2 — Settings
```
Create the settings screen:

HEADER:
- Back button
- Title "Settings"

SECTIONS:

Account:
- Profile row (avatar, name, email) → taps to Account screen
- Subscription row showing current plan

Writing:
- Default category picker
- Show word count toggle
- Autosave toggle

Notifications:
- Daily reminder toggle + time picker
- Weekly digest toggle

AI Features (show if Pro):
- AI insights toggle
- Thread summaries toggle

Appearance:
- Theme picker (Dark/Light/System)
- Text size slider

Privacy:
- Passcode/Face ID toggle
- Analytics toggle

Data:
- Export all data
- Delete account (danger zone)

Support:
- Help Center link
- Send Feedback link
- Rate the app link
- Version number at bottom
```

---

## Implementation Order for Lovable

### Week 1: Foundation
1. Set up design system (colors, fonts, spacing)
2. Create Supabase tables (run SQL in Supabase dashboard)
3. Build auth flow (onboarding, sign up, sign in)
4. Build home dashboard (static first, then connected)

### Week 2: Core Notes
5. Build notes list with Supabase query
6. Build note editor with autosave
7. Build note view
8. Add category filtering
9. Add search

### Week 3: Organization
10. Build threads list and detail
11. Build goals list and detail
12. Connect notes to threads/goals
13. Add archive functionality

### Week 4: Polish
14. Build settings screen
15. Add empty states
16. Add loading states
17. Add toast notifications
18. Test all flows
19. Deploy!

---

## Tips for Working with Lovable

### Do:
- Work on one screen at a time
- Be specific about colors, spacing, and sizes
- Reference the HTML prototypes as screenshots
- Test each feature before moving on
- Use Lovable's built-in Supabase integration

### Don't:
- Try to build everything at once
- Use vague descriptions ("make it look nice")
- Skip the database setup
- Forget about empty states and loading states

### When Something Doesn't Work:
1. Be more specific in your prompt
2. Break it into smaller pieces
3. Reference the exact HTML file for visual guidance
4. Use "Edit" mode to fix specific issues

---

## Using HTML Files as Reference

For each screen, you can:

1. **Open the HTML file in a browser**
2. **Take a screenshot**
3. **Upload to Lovable as reference**
4. **Say: "Make this screen look like the attached image"**

This is especially useful for:
- Complex layouts
- Specific spacing/alignment
- Color accuracy
- Component styling

---

## Supabase Edge Functions (Optional)

For AI features, you'll need Edge Functions:

```typescript
// supabase/functions/analyze-note/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { noteBody } = await req.json()
  
  // Call OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Analyze this journal entry for themes and sentiment: ${noteBody}`
      }],
    }),
  })
  
  const data = await response.json()
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

---

## Questions?

If you get stuck, share:
1. Screenshot of current state
2. What you're trying to achieve
3. Any error messages

Good luck building ORIVYA! 🌿
