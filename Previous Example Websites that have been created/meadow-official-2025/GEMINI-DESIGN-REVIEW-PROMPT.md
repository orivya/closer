# Meadow Design Refinement - Gemini Prompt

## Your Role

You are refining **3 specific pages** that currently feel disconnected from the rest of the Meadow app. The Home page, Sidebar, Landing page, and Explore page already look polished and cohesive - **do not change those**. Your focus is bringing the Goals page, Journal view, and Essence chat interface up to the same quality level.

---

## Design Context

### Current App Aesthetic (DO NOT CHANGE)
The existing Meadow design is already established:
- **Background:** Warm cream `#FAF9F7`
- **Primary accent:** Sage green (used sparingly)
- **Typography:** Serif for headings, clean sans-serif for body
- **Cards:** White with subtle borders, rounded-2xl/3xl corners
- **Shadows:** Soft, warm-tinted
- **Spacing:** Generous, breathable layouts

### 2026 Design Trends to Incorporate (Subtly)
- **Soft minimalism:** Even more whitespace, fewer visual elements
- **Organic shapes:** Subtle rounded forms, natural asymmetry
- **Warm neutrals:** Stone, cream, sage - no harsh blacks or pure whites
- **Micro-interactions:** Gentle hover states, smooth transitions
- **Intentional typography:** Clear hierarchy, elegant restraint
- **Glass morphism (subtle):** Very light frosted effects where appropriate

---

## Pages to Refine

### 1. Goals Page (`views/Goals.tsx`, `components/goals/`)

**Current Problem:** Looks like a generic to-do app, not cohesive with Meadow's calm aesthetic.

**Reference the Home page styling** for consistency. The Goals page should feel like a natural extension of Home.

**Refinements Needed:**

**Header Section:**
- Match the Home page header style
- "Goals" title in the same serif font as Home greeting
- Subtitle in same muted stone color
- Target icon should be sage-500, same size as Home icons

**Stats Bar:**
- Currently has pill-shaped stat badges - these are fine but should use softer colors
- Match the styling of any stat elements on Home page
- Use `bg-white` with subtle border, not colored backgrounds

**Filter Panel:**
- Filter buttons should match the segmented control style from Explore page
- When active: `bg-sage-100 text-sage-700 border-sage-200`
- When inactive: `bg-stone-100 text-stone-600`
- Rounded-xl, consistent padding

**Goal Items (`GoalItem.tsx`):**
- Card style: `bg-white rounded-2xl border border-stone-100 p-5`
- Hover: `hover:border-sage-200 hover:shadow-sm transition-all duration-200`
- Checkbox: 24px round, `border-2 border-stone-300`, when checked `bg-sage-500 border-sage-500`
- Check animation: Smooth scale-in of checkmark
- Content text: `text-[15px] font-medium text-stone-700`
- Completed state: `opacity-60` with subtle line-through, not harsh strikethrough
- Meta badges (intention, due date): Small, muted, `text-[11px]` with appropriate category colors

**Quick Add (`QuickAddGoal.tsx`):**
- Collapsed: Dashed border `border-2 border-dashed border-stone-200 rounded-2xl`
- Hover: `hover:border-sage-300 hover:bg-sage-50/50`
- Expanded: Solid border `border-2 border-sage-200`, subtle shadow
- Send button: `bg-sage-500 text-white rounded-xl p-2`

**Empty State:**
- Centered, generous padding
- Sage-tinted icon background
- Warm, inviting message
- CTA button matching Home page button style

---

### 2. Journal View (`views/Journal.tsx`)

**Current Problem:** Filter tabs and entry cards don't match the refined aesthetic of Home/Explore.

**Refinements Needed:**

**Filter Tabs:**
- Currently has multiple tabs (All, Threads, Reflections, Insights, Decisions)
- Style as horizontal pill tabs matching Explore page segmented control
- Active: `bg-white shadow-sm text-stone-800`
- Inactive: `text-stone-500 hover:text-stone-700`
- Container: `bg-stone-100 rounded-2xl p-1`
- Smooth transition between states

**Entry Cards:**
- Match the card styling from Home page widgets
- `bg-white rounded-2xl border border-stone-100 p-5`
- Hover: `hover:shadow-md hover:border-sage-200 transition-all duration-200`
- Date/time: Serif italic, muted stone color, elegant
- Title: Medium weight, stone-800
- Preview: Regular weight, stone-600, proper line-height
- Mood indicator: Small colored dot (8px), not a badge

**Thread Entries:**
- Left border connector: `border-l-2 border-sage-200 ml-4 pl-4`
- Subtle indentation to show hierarchy

**Insights View (if keeping):**
- Cards should match main entry card styling
- Insight type icons: Small, in sage-tinted circles
- Star toggle: Subtle, sage color when starred

**Decisions View (if keeping):**
- Status badges: Soft, muted colors
- `decided`: Sage/green tint
- `exploring`: Amber tint
- `paused`: Stone/gray tint

**Empty States:**
- Consistent with Goals page empty state styling
- Warm, inviting messaging

---

### 3. Essence Chat Interface (`views/Essence.tsx`, `src/components/ChatInterface.tsx`)

**Current Problem:** Chat interface feels utilitarian and disconnected from Meadow's organic feel.

**Reference:** The previous Orivya design was clean and elegant. Bring that same refinement while matching Meadow's sage/cream palette.

**Refinements Needed:**

**Overall Layout:**
- Cream background `bg-[#FAF9F7]` for the chat area
- Messages should have generous spacing
- Input area should feel grounded at the bottom

**Essence Messages (AI):**
- Background: `bg-white` or very subtle `bg-sage-50/30`
- Border: Subtle left accent `border-l-2 border-sage-300`
- Rounded: `rounded-2xl rounded-tl-md` (flat top-left for visual interest)
- Padding: Generous `p-5`
- Typography:
  - Body text: `text-[15px] leading-relaxed text-stone-700`
  - Should feel warm and conversational
- Avatar: Essence avatar positioned elegantly, not crowding the message

**User Messages:**
- Background: `bg-white`
- Border: `border border-stone-200`
- Rounded: `rounded-2xl rounded-tr-md` (flat top-right)
- Aligned right with appropriate margin
- Same generous padding

**Depth Selector (`DepthSelector.tsx`):**
- Horizontal pill selector, not buttons
- Container: `bg-stone-100 rounded-2xl p-1.5 inline-flex`
- Each option: `px-4 py-2 rounded-xl text-sm font-medium transition-all`
- Active: `bg-white shadow-sm text-stone-800`
- Inactive: `text-stone-500 hover:text-stone-600`
- Depth levels should have subtle color hints:
  - Vent: Lightest (default)
  - Reflect: Slight warmth
  - Explore: Richer
  - Deep: Deepest sage tone

**Input Area:**
- Container: `bg-white border-t border-stone-100`
- Input field:
  - `bg-stone-50 rounded-2xl px-5 py-4`
  - Focus: `focus:bg-white focus:ring-2 focus:ring-sage-200 focus:border-sage-300`
  - Placeholder: `text-stone-400`
- Send button:
  - `bg-sage-500 text-white rounded-xl p-3`
  - Icon: Sparkles or Send icon
  - Hover: `hover:bg-sage-600`
  - Disabled: `opacity-50`

**Typing Indicator:**
- Three dots animation
- Sage-colored dots
- Smooth pulsing animation

**Session Header:**
- Clean, minimal
- Current depth level shown subtly
- Session controls (if any) should be icon-only, muted

**Intent Pills (`IntentPills.tsx`) - if used:**
- Small, horizontal scrollable
- Style: `bg-stone-100 text-stone-600 rounded-full px-3 py-1.5 text-sm`
- Active: `bg-sage-100 text-sage-700 border border-sage-200`

---

## Specific Component Updates Required

For each component, provide the **exact Tailwind classes** to use.

### Common Patterns to Apply

**Card Base:**
```
bg-white rounded-2xl border border-stone-100 p-5
hover:border-sage-200 hover:shadow-sm transition-all duration-200
```

**Active Tab/Button:**
```
bg-white shadow-sm text-stone-800 rounded-xl
```

**Inactive Tab/Button:**
```
bg-transparent text-stone-500 hover:text-stone-700 rounded-xl
```

**Primary Button:**
```
bg-sage-500 text-white rounded-xl px-5 py-2.5 font-medium
hover:bg-sage-600 transition-colors
```

**Input Field:**
```
bg-stone-50 rounded-xl px-4 py-3 border border-transparent
focus:bg-white focus:border-sage-300 focus:ring-2 focus:ring-sage-100
outline-none transition-all
```

**Checkbox (unchecked):**
```
w-6 h-6 rounded-full border-2 border-stone-300
hover:border-sage-400 transition-colors
```

**Checkbox (checked):**
```
w-6 h-6 rounded-full bg-sage-500 border-2 border-sage-500
flex items-center justify-center
```

---

## Animation Specifications

Keep animations subtle and organic:

- **Hover transitions:** `duration-200 ease-out`
- **State changes:** `duration-300 ease-in-out`
- **Checkbox check:** Scale from 0 to 1, `duration-150`
- **Card hover lift:** `translateY(-1px)` with shadow increase
- **Focus rings:** `ring-2 ring-sage-100 ring-offset-1`

---

## Files to Update

1. `views/Goals.tsx` - Page layout, header, stats bar
2. `components/goals/GoalItem.tsx` - Individual goal cards
3. `components/goals/GoalList.tsx` - List layout and grouping
4. `components/goals/QuickAddGoal.tsx` - Add input styling
5. `components/goals/GoalWidget.tsx` - Home widget (should already match)
6. `views/Journal.tsx` - Filter tabs, entry cards, views
7. `views/Essence.tsx` - Chat layout, header
8. `src/components/ChatInterface.tsx` - Messages, input area
9. `components/essence/DepthSelector.tsx` - Depth level selector
10. `components/essence/IntentPills.tsx` - Intent chips (if used)

---

## Do NOT Change

- `views/Home.tsx` - Already polished
- `components/Sidebar.tsx` - Already matches design
- `views/Explore.tsx` - Already cohesive
- `views/LandingPage.tsx` - Already complete
- `views/Settings.tsx` - Already styled
- Global color palette and fonts

---

## Success Criteria

After refinements:
1. Goals page feels like a natural extension of Home
2. Journal view matches the polish of Explore page
3. Essence chat feels warm and inviting, not clinical
4. All three pages use consistent card styling, spacing, and typography
5. Transitions and hover states feel unified across all pages
6. The overall app feels like one cohesive experience
