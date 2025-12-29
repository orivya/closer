# Meadow Design Refinement Master Blueprint

## Overview
The goal is to apply the visual styling from the **Gemini Reference Design** (`previous files for reference/meadow-dark green-gemini/`) to the **existing production website** (commit `a4fd449` - "Refine Quick Jots, Guided Reflections, and Editor UI") without removing any functionality.

**Key Principle**: Keep ALL existing features intact. Only update visual styling (colors, spacing, shadows, typography) to match the Gemini reference.

---

## PHASE 1: Foundation & Global Styles
**Goal**: Establish the core design tokens and global CSS that all pages will inherit.

### Stage 1.1: Tailwind Color Configuration (index.html)
**Current Issue**: Colors are defined but some aren't being applied correctly to components.

**Required Changes**:
- [ ] Verify `sage-400` is used for date text (currently showing black)
- [ ] Verify `sage-400` italic is used for user name (currently showing black)
- [ ] Ensure `cream` background (#faf9f7) is properly applied
- [ ] Add `bg-surface` class: `rgba(255, 255, 255, 0.85)` for glass cards

**Reference Values** (from Gemini):
```css
sage-50: '#F5F8F6'
sage-100: '#E8EFEC'
sage-200: '#CDDED6'
sage-300: '#B0CBBF'
sage-400: '#91B6A6'
sage-500: '#6B8F7A' (Primary)
sage-600: '#547261'
sage-700: '#3F5649'
sage-800: '#2C3C33'
sage-900: '#19221D'
```

### Stage 1.2: GlassCard Component Styling
**File**: `components/ui/GlassCard.tsx`

**Required Styling** (from Gemini reference):
```tsx
className={`
  bg-surface backdrop-blur-xl border border-white/60
  shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]
  rounded-[1.75rem] transition-all duration-300 ease-out
  hover:border-sage-300/50
  hover:shadow-[0_8px_30px_-4px_rgba(107,143,122,0.15)]
  hover:-translate-y-0.5 cursor-pointer
`}
```

### Stage 1.3: Button Component Styling
**File**: `components/ui/button.tsx`

**Primary Button** (Gemini reference - "Reflect on this" button):
```tsx
className="bg-sage-500 text-white shadow-[0_4px_14px_0_rgba(107,143,122,0.39)]
           hover:shadow-[0_6px_20px_rgba(107,143,122,0.23)]
           hover:-translate-y-0.5 hover:bg-sage-600
           px-6 py-3 text-sm border border-transparent rounded-full"
```

**Current Issue**: Button showing as `bg-sage-800` with white text - should be `bg-sage-500`

---

## PHASE 2: Sidebar & Navigation
**Goal**: Match the Gemini sidebar exactly (width, spacing, colors, active states).

### Stage 2.1: Sidebar Width & Structure
**File**: `components/Sidebar.tsx`

**Reference Design**:
- Width: `w-64` (256px)
- Background: `bg-white/40 backdrop-blur-xl`
- Border: `border-r border-black/5`

**Current Issues**:
- Verify width matches reference
- Check background color/opacity

### Stage 2.2: Sidebar Logo Section
**Reference Design**:
- Logo container: `w-8 h-8 bg-sage-500 rounded-lg` with Leaf icon
- Shadow: `shadow-md shadow-sage-500/20`
- Title: `font-serif text-lg font-medium tracking-tight text-sage-900`

### Stage 2.3: New Entry Button
**Reference Design**:
- Full width in sidebar: `w-full justify-center`
- Style: Primary button with `bg-sage-500`
- Icon: Plus icon with `<Plus size={18}/>`

### Stage 2.4: Navigation Items
**Reference Design** (SidebarItem):
```tsx
className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
  isActive
    ? 'bg-white shadow-sm text-sage-900'
    : 'text-sage-600 hover:bg-black/5 hover:text-sage-900'
}`}
```

**Icon Styling**:
- Active: `text-sage-500`
- Inactive: `text-sage-400`

### Stage 2.5: User Profile Footer
**Reference Design**:
- Avatar: `w-8 h-8 rounded-full bg-sage-100 border border-sage-200`
- Name: `text-xs font-medium text-sage-900`
- Plan label: `text-[10px] text-sage-500`
- Logout icon: `text-sage-400`

---

## PHASE 3: Home Page
**Goal**: Match Home page exactly to Gemini reference while keeping all existing functionality.

### Stage 3.1: Header Section
**Current Issues**:
- Date text is black (should be `text-sage-400`)
- User name is black (should be `text-sage-400 italic`)
- Missing inspirational quote on right side

**Required Changes**:
```tsx
// Date line
<p className="text-xs font-bold uppercase tracking-widest text-sage-400">
  {date}
</p>

// User name
<span className="text-sage-400 italic">{userName}</span>

// Add quote (hidden md:block)
<p className="text-right text-sage-600 font-light text-sm max-w-[200px] leading-relaxed">
  "Clarity comes from doing, not thinking about doing."
</p>
```

### Stage 3.2: Daily Prompt Card
**Current Issues**:
- "Reflect on this" button is `bg-sage-800` (should be `bg-sage-500`)
- Remove quotes around the prompt text

**Required Styling**:
- Badge: `bg-white/50 rounded-full border border-white/60 text-[10px] font-bold uppercase tracking-widest text-sage-600`
- Button: `bg-sage-500 text-white` with sage shadow
- Shuffle button: `w-12 h-12 rounded-full border border-sage-200 text-sage-500`

### Stage 3.3: Mood Tracker (Check-in)
**Reference Styling**:
- Label: `text-sm font-bold uppercase tracking-widest text-sage-400`
- Close button: `text-sage-300 hover:text-sage-500`
- Mood icons: `text-sage-300` with hover colors per mood
- Labels: `text-[10px] font-bold uppercase tracking-wider text-sage-300`

### Stage 3.4: Consistency Card
**Required Styling**:
- Header label: `text-xs font-bold uppercase tracking-widest text-sage-400`
- Word count: `font-serif text-3xl text-sage-900` with `text-lg text-sage-400 italic` for "words"
- Calendar icon container: `p-2 bg-sage-50 rounded-lg text-sage-500`
- Chart colors: Active bar `#6B8F7A`, inactive bars `#E3EBE6`
- Footer text: `text-xs text-sage-400` with `text-sage-600 font-bold` for highlighted day

### Stage 3.5: Jump Back In Section
**Required Styling**:
- Header: `text-xs font-bold uppercase tracking-widest text-sage-400`
- "All" link: `text-xs font-bold text-sage-600 hover:text-sage-900`
- Thread cards: Glass card with icon in `bg-white border border-sage-100 rounded-2xl`
- Thread name: `font-serif text-lg text-sage-900`
- Meta text: `text-xs text-sage-400 font-medium`
- Arrow: `text-sage-300 group-hover:bg-sage-50 group-hover:text-sage-600`

---

## PHASE 4: Journal Page
**Goal**: Match the timeline/stream view with connected entries.

### Stage 4.1: Page Header
**Required Styling**:
- Title: `font-serif text-4xl text-sage-900`
- Subtitle: `text-sage-600 font-light`

### Stage 4.2: View Toggle (Stream/Calendar)
**Reference Styling**:
```tsx
<div className="flex items-center gap-1 bg-white p-1 rounded-full border border-sage-100 shadow-sm">
  <button className={`... ${isActive ? 'bg-sage-500 text-white shadow-md' : 'text-sage-400 hover:text-sage-600'}`}>
```

### Stage 4.3: Filter Tabs
**Reference Styling**:
- Active: `border-sage-500 text-sage-900`
- Inactive: `border-transparent text-sage-400 hover:text-sage-600`

### Stage 4.4: Timeline Entries (CRITICAL - Currently broken)
**Reference Design** (connected timeline):
```tsx
{/* Timeline Line - connects entries */}
<div className="absolute left-[3.5px] top-8 bottom-[-32px] w-px bg-sage-200 group-last:hidden"></div>

{/* Timeline Dot */}
<div className="absolute -left-[1px] top-8 w-2.5 h-2.5 rounded-full bg-sage-300 border-2 border-cream group-hover:bg-sage-600 group-hover:scale-125 transition-all duration-300 shadow-sm z-10"></div>

{/* Date Header */}
<span className="text-xs font-bold text-sage-400 uppercase tracking-widest">{entry.date}</span>

{/* Entry Card */}
<div className="bg-surface hover:bg-white backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-[2rem] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_8px_30px_-12px_rgba(107,143,122,0.15)] hover:-translate-y-1 group-hover:border-sage-200">
```

**Thread Badge**:
```tsx
<div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-50 rounded-full text-[10px] font-bold uppercase tracking-wider text-sage-600 border border-sage-100/50">
  <GitBranch size={10} /> {entry.thread}
</div>
```

---

## PHASE 5: Explore Page
**Goal**: Match cards and icons with sage green styling.

### Stage 5.1: Page Header
**Reference Styling**:
- Title: `font-serif text-4xl text-sage-900`

### Stage 5.2: Tab Switcher
**Reference Design**:
```tsx
<div className="inline-flex bg-white p-1 rounded-full border border-sage-100 shadow-sm relative">
  {/* Animated background pill */}
  <div className="absolute top-1 bottom-1 w-[120px] bg-sage-500 rounded-full transition-all duration-300 shadow-sm"></div>

  {/* Tab buttons */}
  <button className={`relative z-10 w-[120px] py-2 text-xs font-bold uppercase tracking-widest ${isActive ? 'text-white' : 'text-sage-400 hover:text-sage-600'}`}>
```

### Stage 5.3: Featured Journey Card
**Reference Styling**:
- Badge: `px-2 py-1 bg-sage-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-md`
- Duration: `text-xs font-medium text-sage-400`
- Title: `font-serif text-3xl md:text-4xl text-sage-900`
- Description: `text-sage-600 font-light`
- Icon area: `bg-sage-100/50 group-hover:bg-sage-100/80`
- Icon: `text-sage-300`

### Stage 5.4: Journey Cards (Popular Series)
**Icon Container**:
```tsx
<div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${journey.color}`}>
  // journey.color = 'bg-sage-100 text-sage-600' for sage themed
  // or specific colors like 'bg-orange-50 text-orange-500'
```

**Card Footer**:
```tsx
<div className="flex items-center justify-between pt-4 border-t border-sage-100/50">
  <span className="text-[10px] font-bold uppercase tracking-widest text-sage-400">{journey.days} Days</span>
  <div className="w-8 h-8 rounded-full bg-white border border-sage-100 flex items-center justify-center text-sage-400">
    <Play size={12} fill="currentColor" />
  </div>
</div>
```

### Stage 5.5: Toolbox Cards
**Icon Container**:
```tsx
<div className="p-3 bg-sage-50 rounded-xl text-sage-500">
  <Icon size={24} />
</div>
```

**Lock Icon**: `text-sage-300`

---

## PHASE 6: Editor Page
**Goal**: Keep ALL existing functionality (Quick Jots, Guided Reflections, Goals, Self-Discovery) while applying visual updates.

### Stage 6.1: Mode Selection Screen
**DO NOT REMOVE**: The mode selection screen with Quick Jot, Guided Reflection, Goal Setting, Self-Discovery cards must remain.

**Apply Styling**:
- Cards should use glass card styling with sage hover effects
- Icons should have sage green backgrounds

### Stage 6.2: Editor Chrome (Header)
**Reference Design**:
```tsx
<header className="sticky top-6 z-20 px-6 mb-8">
  <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg shadow-sage-900/5 rounded-full px-4 py-3">
```

**Back Button**: `w-10 h-10 rounded-full hover:bg-sage-50 text-sage-500 hover:text-sage-800`
**Word Count**: `text-[10px] font-bold uppercase tracking-widest text-sage-300`
**Save Button**: Primary button style

### Stage 6.3: Editor Content Area
**Prompt Display** (if present):
```tsx
<div className="inline-flex items-center gap-2 text-sage-400 mb-3 px-3 py-1 bg-sage-50 rounded-full text-[10px] font-bold uppercase tracking-widest">
  <Sparkles size={12} /> Prompt
</div>
<p className="font-serif text-2xl md:text-3xl text-sage-800 leading-snug">{prompt}</p>
```

**Title Input**:
```tsx
className="w-full bg-transparent text-4xl md:text-5xl font-serif text-sage-900 placeholder:text-sage-200 outline-none"
```

**Content Textarea**:
```tsx
className="w-full bg-transparent text-lg md:text-xl leading-relaxed text-sage-800 placeholder:text-sage-200 outline-none resize-none min-h-[50vh] font-light selection:bg-sage-200"
```

### Stage 6.4: Quick Jots (PRESERVE ALL)
**Existing Components to Keep**:
- BrainDump
- ThreeGoodThings
- EnergyCheck
- MorningPages
- EveningReset
- OneWord
- BodyScan
- Wins
- WhatILearned
- Snapshot

**Apply**: Sage green color scheme to all components

### Stage 6.5: Guided Reflections (PRESERVE ALL)
**Existing Components to Keep**:
- DecisionClarity
- WeeklyReset
- GratitudeGrowth
- ValuesAlignment
- ConnectionAppreciation
- CreativeUnblock
- DailyClarity
- FearInventory
- FutureSelfLetter
- WhatsReallyGoingOn

### Stage 6.6: Goal Setting (PRESERVE ALL)
**Existing Components to Keep**:
- SMARTGoals
- OKRs
- NinetyDaySprint
- HabitStacking
- VisionBoardBuilder
- MilestoneMapper
- AccountabilityCheckins
- GoalAutopsy
- SuccessVisualization

### Stage 6.7: Self-Discovery (PRESERVE ALL)
**Existing Components to Keep**:
- ValuesDiscovery
- StrengthsFinder
- LifeWheelAssessment
- PersonalityExploration
- CoreBeliefsExamination
- LifeTimelineMapping
- FutureSelfVisualization
- LimitingBeliefsInventory
- PurposeExploration

---

## PHASE 7: Settings/Profile Page
**Goal**: Match styling while preserving functionality.

### Stage 7.1: Profile Section
- Avatar: Sage green accents
- Settings cards: Glass card styling

---

## Implementation Checklist

### Pre-Implementation
- [ ] Create a git branch for this work
- [ ] Take screenshots of current state for comparison
- [ ] Do NOT modify files in `previous files for reference/` folder

### Phase 1 Tasks
- [ ] Update index.html Tailwind config colors
- [ ] Update GlassCard.tsx styling
- [ ] Update button.tsx styling

### Phase 2 Tasks
- [ ] Update Sidebar.tsx width and background
- [ ] Update Sidebar logo styling
- [ ] Update New Entry button styling
- [ ] Update nav item active/hover states
- [ ] Update user profile footer

### Phase 3 Tasks
- [ ] Fix Home.tsx date color (sage-400)
- [ ] Fix Home.tsx user name color (sage-400 italic)
- [ ] Add inspirational quote
- [ ] Fix "Reflect on this" button (sage-500)
- [ ] Update mood tracker styling
- [ ] Update consistency card styling
- [ ] Update "Jump back in" section

### Phase 4 Tasks
- [ ] Update Journal.tsx header styling
- [ ] Update view toggle
- [ ] Update filter tabs
- [ ] Fix timeline connection (CRITICAL)
- [ ] Update entry card styling
- [ ] Update thread badges

### Phase 5 Tasks
- [ ] Update Explore.tsx tab switcher
- [ ] Update featured journey card
- [ ] Update journey cards icons (sage backgrounds)
- [ ] Update toolbox cards

### Phase 6 Tasks
- [ ] Verify ALL Quick Jots present
- [ ] Verify ALL Guided Reflections present
- [ ] Verify ALL Goal Setting options present
- [ ] Verify ALL Self-Discovery options present
- [ ] Update Editor chrome styling
- [ ] Update Editor content styling

### Phase 7 Tasks
- [ ] Update Settings page styling

### Post-Implementation
- [ ] Run build to verify no errors
- [ ] Test all navigation
- [ ] Test all Editor modes (Quick Jot, Guided, Goals, Discovery)
- [ ] Compare side-by-side with Gemini reference screenshots
- [ ] Commit and push

---

## Critical Reminders

1. **DO NOT DELETE ANY FUNCTIONALITY** - All Quick Jots, Guided Reflections, Goal Settings, and Self-Discovery experiences must remain
2. **Keep the reference folder intact** - `previous files for reference/meadow-dark green-gemini/` should not be modified
3. **The website should work exactly as before** - Only visual changes
4. **Test incrementally** - Build and test after each phase
5. **Commit frequently** - One commit per phase minimum

---

## Color Quick Reference

| Element | Class |
|---------|-------|
| Date text | `text-sage-400` |
| User name | `text-sage-400 italic` |
| Primary button | `bg-sage-500 text-white` |
| Section labels | `text-sage-400 uppercase tracking-widest` |
| Body text | `text-sage-600` or `text-sage-800` |
| Muted text | `text-sage-300` |
| Icon backgrounds | `bg-sage-50` or `bg-sage-100` |
| Icon color | `text-sage-500` or `text-sage-600` |
| Borders | `border-sage-100` or `border-sage-200` |
| Hover states | `hover:text-sage-600` or `hover:bg-sage-50` |
| Active states | `bg-sage-500 text-white` |
