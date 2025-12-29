# Meadow Design Refinement Master Blueprint

## Executive Summary

This blueprint details **styling-only refinements** to make the production Meadow website match the polished aesthetic of the **Meadow 23** reference design.

### Critical Principle: NO FUNCTIONALITY REMOVAL
- **All existing features remain intact**
- **Quick Jots, Guided Reflections, Goal Setting, Self-Discovery** - ALL preserved
- **All entries, threads, reflections** - ALL preserved
- **All journeys, prompts, tools** - ALL preserved
- **Only visual styling changes** - colors, spacing, shadows, typography, hover states

---

## Reference Comparison

| Aspect | Current Site | Meadow 23 Target |
|--------|-------------|------------------|
| Card borders | `border-dark-border` (black 8%) | `border-white/60` (semi-transparent white) |
| Card hover | `hover:border-sage-border` | `hover:border-sage-300/50` (sage tint) |
| Primary button | `bg-sage` | `bg-sage-500` with sage shadow |
| Icon containers | `bg-dark-surface border-dark-border` | `bg-sage-50` or `bg-sage-100` |
| Date text | Black or muted | `text-sage-400 uppercase tracking-widest` |
| Timeline | Dots only | Connected line with animated dots |
| Card shadows | Minimal | Premium sage-tinted glow on hover |

---

## PHASE 1: Foundation - Tailwind Color Scale
**Goal**: Add explicit sage color scale for precise control

### Stage 1.1: Update index.html Tailwind Config

Add the full sage scale (currently only has DEFAULT, light, dark, subtle, muted, glow):

```javascript
sage: {
  50: '#f4f7f5',   // Lightest - icon backgrounds
  100: '#e3ebe6',  // Light backgrounds
  200: '#c5d8cf',  // Borders, lines
  300: '#9ebcae',  // Muted text, inactive states
  400: '#7fa08d',  // Secondary text, dates
  500: '#6B8F7A',  // PRIMARY - buttons, active states
  600: '#5a7a68',  // Hover states
  700: '#4a6355',  // Dark accents
  800: '#3e5146',  // Very dark
  900: '#34433b',  // Darkest
  // Keep existing tokens for compatibility
  DEFAULT: '#6B8F7A',
  light: '#7FA08D',
  dark: '#5A7A68',
  subtle: 'rgba(107, 143, 122, 0.1)',
  muted: 'rgba(107, 143, 122, 0.15)',
  glow: 'rgba(107, 143, 122, 0.25)',
  'glow-strong': 'rgba(107, 143, 122, 0.4)',
  border: 'rgba(107, 143, 122, 0.25)',
}
```

### Stage 1.2: Add Surface Color Token

```javascript
surface: {
  DEFAULT: 'rgba(255, 255, 255, 0.75)',
  hover: 'rgba(255, 255, 255, 0.9)',
  active: '#ffffff',
}
```

### Stage 1.3: Update Glass Card CSS Classes

Current `.glass-card`:
```css
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
```

Target (Meadow 23 style):
```css
.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
  border-radius: 1.75rem;
  transition: all 0.3s ease-out;
}

.glass-card:hover {
  border-color: rgba(158, 188, 174, 0.5); /* sage-300/50 */
  box-shadow: 0 8px 30px -4px rgba(107, 143, 122, 0.15);
  transform: translateY(-2px);
}
```

---

## PHASE 2: Sidebar & Navigation Polish
**Goal**: Match Meadow 23 sidebar styling

### Stage 2.1: Sidebar.tsx - Container Styling

**Current**: Uses glass-sidebar class
**Target**:
- Width: `w-64` (256px)
- Background: `bg-white/40 backdrop-blur-xl`
- Border: `border-r border-black/5`

### Stage 2.2: Logo Section

**Target Styling**:
```tsx
<div className="w-8 h-8 bg-sage-500 rounded-lg flex items-center justify-center text-white shadow-md shadow-sage-500/20">
  <Leaf size={16} />
</div>
<span className="font-serif text-lg font-medium tracking-tight text-sage-900">Meadow</span>
```

### Stage 2.3: Navigation Items

**Target Active State**:
```tsx
isActive
  ? 'bg-white shadow-sm text-sage-900'
  : 'text-sage-600 hover:bg-black/5 hover:text-sage-900'
```

**Icon Colors**:
- Active: `text-sage-500`
- Inactive: `text-sage-400`

### Stage 2.4: "New Entry" Button

Use primary button styling:
```tsx
className="w-full justify-center bg-sage-500 text-white shadow-[0_4px_14px_0_rgba(107,143,122,0.39)] hover:bg-sage-600"
```

### Stage 2.5: User Profile Footer

**Target**:
```tsx
<div className="w-8 h-8 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-sage-600">
  U
</div>
<div className="text-xs font-medium text-sage-900">User Name</div>
<div className="text-[10px] text-sage-500">Free Plan</div>
```

---

## PHASE 3: Home Page Refinements
**Goal**: Match Meadow 23 Home while keeping all features

### Stage 3.1: Header Section - Date & Name

**REMOVE**: "Guided Reflection" and "Intentions" quick action buttons

**Current Date**:
```tsx
<p className="text-[0.65rem] font-bold text-sage uppercase tracking-[0.15em] opacity-80">{formattedDate}</p>
```

**Target Date**:
```tsx
<p className="text-xs font-bold uppercase tracking-widest text-sage-400">{formattedDate}</p>
```

**Current Username**:
```tsx
<span className="text-sage-light">{userName}</span>
```

**Target Username**:
```tsx
<span className="text-sage-400 italic">{userName}</span>
```

### Stage 3.2: Add Inspirational Quote (Hidden on Mobile)

Add to header section:
```tsx
<div className="hidden md:block">
  <p className="text-right text-sage-600 font-light text-sm max-w-[200px] leading-relaxed">
    "Clarity comes from doing, not thinking about doing."
  </p>
</div>
```

### Stage 3.3: "Take a Breath" Button

**KEEP AS IS** - Already has leaves animation, just refine colors:
- Border: `border-sage-200` when idle
- Active state: `border-sage-500 text-sage-500`

### Stage 3.4: Daily Spark Card - Rename & Restyle

**RENAME**: "Daily Spark" → "Daily Prompt" (or keep as is, user preference)

**Target Prompt Card**:
```tsx
<GlassCard className="p-8 md:p-10 min-h-[300px] flex flex-col justify-between">
  {/* Badge */}
  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full border border-white/60 text-[10px] font-bold uppercase tracking-widest text-sage-600 mb-6">
    <Sparkles size={10} /> Daily Prompt
  </div>

  {/* Prompt text - REMOVE QUOTES */}
  <h3 className="font-serif text-3xl md:text-4xl text-sage-900 leading-tight max-w-lg">
    {prompt}  {/* No quotes around it */}
  </h3>

  {/* Buttons */}
  <div className="flex items-center gap-4 mt-8">
    <button className="inline-flex items-center gap-2 px-6 py-3 bg-sage-500 text-white rounded-full text-sm font-medium shadow-[0_4px_14px_0_rgba(107,143,122,0.39)] hover:bg-sage-600 hover:-translate-y-0.5 transition-all">
      <PenTool size={18} /> Reflect on this
    </button>
    <button className="w-12 h-12 flex items-center justify-center rounded-full border border-sage-200 text-sage-500 hover:bg-white hover:shadow-md transition-all">
      <Shuffle size={20} />
    </button>
  </div>
</GlassCard>
```

### Stage 3.5: Mood Check-in Styling

**Target (Meadow 23)**:
```tsx
{/* Header */}
<span className="text-sm font-bold uppercase tracking-widest text-sage-400">Check-in</span>

{/* Mood buttons */}
<button className="flex flex-col items-center gap-3 p-4 rounded-2xl transition-all hover:shadow-sm">
  <Icon className="text-sage-300 group-hover:scale-110" size={28} strokeWidth={1.5} />
  <span className="text-[10px] font-bold uppercase tracking-wider text-sage-300">{label}</span>
</button>

{/* Logged state */}
<div className="w-12 h-12 rounded-2xl bg-[#2C3C33] text-white flex items-center justify-center shadow-lg shadow-sage-900/10">
  <Check size={20} />
</div>
<p className="font-serif text-xl text-sage-900">
  Logged as <span className="italic text-sage-500">{mood}</span>
</p>
```

### Stage 3.6: Consistency Card (Keep Structure, Refine Style)

**Target Labels**:
```tsx
<div className="text-xs font-bold uppercase tracking-widest text-sage-400 mb-1">Consistency</div>
<div className="font-serif text-3xl text-sage-900">
  {wordCount} <span className="text-lg text-sage-400 italic">words</span>
</div>
```

**Calendar Icon Container**:
```tsx
<div className="p-2 bg-sage-50 rounded-lg text-sage-500">
  <Calendar size={20} />
</div>
```

**Chart Colors**:
- Active bar: `#6B8F7A` (sage-500)
- Inactive bars: `#E3EBE6` (sage-100)

### Stage 3.7: "Continue Your Thinking" / Jump Back In

**Header**:
```tsx
<h4 className="text-xs font-bold uppercase tracking-widest text-sage-400">Jump back in</h4>
<button className="text-xs font-bold text-sage-600 hover:text-sage-900">All</button>
```

**Thread Cards**:
```tsx
<GlassCard className="p-5 flex items-center gap-4 group">
  {/* Icon container */}
  <div className="w-12 h-12 rounded-2xl bg-white border border-sage-100 flex items-center justify-center text-sage-500 shadow-sm group-hover:scale-105 transition-transform">
    <GitBranch size={20} />
  </div>

  {/* Text */}
  <h5 className="font-serif text-lg text-sage-900">{thread.name}</h5>
  <p className="text-xs text-sage-400 font-medium">{count} Entries</p>

  {/* Arrow */}
  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sage-300 group-hover:bg-sage-50 group-hover:text-sage-600 transition-colors">
    <ArrowRight size={16} />
  </div>
</GlassCard>
```

---

## PHASE 4: Journal Page Refinements
**Goal**: Add connected timeline, refine cards

### Stage 4.1: Page Header

**Target**:
```tsx
<h2 className="font-serif text-4xl text-sage-900 mb-2">Journal</h2>
<p className="text-sage-600 font-light">Your growing timeline of thoughts.</p>
```

### Stage 4.2: View Toggle (Stream/Calendar/List)

**Target Styling**:
```tsx
<div className="flex items-center gap-1 bg-white p-1 rounded-full border border-sage-100 shadow-sm">
  <button className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
    isActive
      ? 'bg-sage-500 text-white shadow-md'
      : 'text-sage-400 hover:text-sage-600'
  }`}>
    <List size={14} /> Stream
  </button>
</div>
```

### Stage 4.3: Filter Tabs

**Target**:
```tsx
<button className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
  isActive
    ? 'border-sage-500 text-sage-900'
    : 'border-transparent text-sage-400 hover:text-sage-600'
}`}>
  {label}
</button>
```

### Stage 4.4: Timeline Entries - Connected Line (CRITICAL)

**Current**: Dot only, no connecting line between entries

**Target (Meadow 23)**:
```tsx
{/* Timeline container */}
<div className="relative pl-8 md:pl-12 group">

  {/* CONNECTING LINE - runs between entries */}
  <div className="absolute left-[3.5px] top-8 bottom-[-32px] w-px bg-sage-200 group-last:hidden" />

  {/* Timeline dot */}
  <div className="absolute -left-[1px] top-8 w-2.5 h-2.5 rounded-full bg-sage-300 border-2 border-cream group-hover:bg-sage-600 group-hover:scale-125 transition-all duration-300 shadow-sm z-10" />

  {/* Date header */}
  <span className="text-xs font-bold text-sage-400 uppercase tracking-widest">{entry.date}</span>

  {/* Entry card */}
  <div className="bg-surface hover:bg-white backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-[2rem] transition-all cursor-pointer shadow-sm hover:shadow-[0_8px_30px_-12px_rgba(107,143,122,0.15)] hover:-translate-y-1 group-hover:border-sage-200">
    ...
  </div>
</div>
```

### Stage 4.5: Thread Badges

**Target**:
```tsx
<div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-50 rounded-full text-[10px] font-bold uppercase tracking-wider text-sage-600 border border-sage-100/50">
  <GitBranch size={10} /> {thread}
</div>
```

### Stage 4.6: Entry Card Footer

**Target**:
```tsx
<div className="flex items-center gap-4 text-xs text-sage-400 font-medium">
  <span>{wordCount} words</span>
  {mood && (
    <>
      <span className="w-1 h-1 rounded-full bg-sage-300" />
      <span>{mood}</span>
    </>
  )}
</div>
```

---

## PHASE 5: Explore Page Refinements
**Goal**: Premium card styling, animated tab pill

### Stage 5.1: Tab Switcher - Animated Sliding Pill

**Current**: Background pill moves but may not be as smooth

**Target (Meadow 23)**:
```tsx
<div className="inline-flex bg-white p-1 rounded-full border border-sage-100 shadow-sm relative">
  {/* Animated background pill */}
  <div
    className="absolute top-1 bottom-1 w-[120px] bg-sage-500 rounded-full transition-all duration-300 shadow-sm"
    style={{ left: activeTab === 'journeys' ? '4px' : 'calc(50%)' }}
  />

  {/* Tab buttons */}
  <button className={`relative z-10 w-[120px] py-2 text-xs font-bold uppercase tracking-widest ${
    isActive ? 'text-white' : 'text-sage-400 hover:text-sage-600'
  }`}>
    {label}
  </button>
</div>
```

### Stage 5.2: Featured Journey Card

**KEEP**: Play button on right side (already correct)

**Refine Card Border**:
```tsx
<div className="glass-card rounded-[28px] p-6 lg:p-8 overflow-hidden transition-all hover:border-sage-300/50 hover:shadow-[0_8px_30px_-12px_rgba(107,143,122,0.15)]">
```

**Icon Area (right side)**:
```tsx
<div className="w-full md:w-1/3 bg-sage-100/50 flex items-center justify-center p-12 group-hover:bg-sage-100/80 transition-colors">
  <Star size={80} className="text-sage-300" strokeWidth={1} />
</div>
```

### Stage 5.3: Journey Cards - Icon Containers

**Current**: `bg-dark-surface border border-dark-border`

**Target (Meadow 23)**:
```tsx
<div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-sage-100 text-sage-600">
  <journey.icon size={24} />
</div>
```

For variety, use specific colors per journey:
- Clarity: `bg-sage-100 text-sage-600`
- Gratitude: `bg-orange-50 text-orange-500`
- Letting Go: `bg-blue-50 text-blue-500`
- Purpose: `bg-purple-50 text-purple-500`

### Stage 5.4: Journey Card Footer

**Target**:
```tsx
<div className="flex items-center justify-between pt-4 border-t border-sage-100/50">
  <span className="text-[10px] font-bold uppercase tracking-widest text-sage-400">{days} Days</span>
  <div className="w-8 h-8 rounded-full bg-white border border-sage-100 flex items-center justify-center text-sage-400 group-hover:text-sage-600 transition-colors">
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

**Lock Icon** (for premium features):
```tsx
<Lock size={16} className="text-sage-300" />
```

---

## PHASE 6: Editor Page Refinements
**Goal**: Keep ALL functionality, only style updates

### CRITICAL: PRESERVE ALL FEATURES
- Mode selection screen with ALL cards
- Quick Jot: BrainDump, ThreeGoodThings, EnergyCheck, MorningPages, EveningReset, OneWord, BodyScan, Wins, WhatILearned, Snapshot
- Guided Reflection: DecisionClarity, WeeklyReset, GratitudeGrowth, ValuesAlignment, ConnectionAppreciation, CreativeUnblock, DailyClarity, FearInventory, FutureSelfLetter, WhatsReallyGoingOn
- Goal Setting: SMARTGoals, OKRs, NinetyDaySprint, HabitStacking, VisionBoardBuilder, MilestoneMapper, AccountabilityCheckins, GoalAutopsy, SuccessVisualization
- Self-Discovery: ValuesDiscovery, StrengthsFinder, LifeWheelAssessment, PersonalityExploration, CoreBeliefsExamination, LifeTimelineMapping, FutureSelfVisualization, LimitingBeliefsInventory, PurposeExploration

### Stage 6.1: Mode Selection Cards

Apply glass card styling with sage hover effects:
```tsx
<div className="glass-card p-6 rounded-[1.75rem] hover:border-sage-300/50 hover:shadow-[0_8px_30px_-12px_rgba(107,143,122,0.15)] transition-all cursor-pointer group">
  <div className="w-12 h-12 rounded-xl bg-sage-50 text-sage-500 flex items-center justify-center mb-4 group-hover:bg-sage-100 transition-colors">
    <Icon size={24} />
  </div>
  <h3 className="font-serif text-xl text-sage-900 mb-2">{title}</h3>
  <p className="text-sage-600 text-sm">{description}</p>
</div>
```

### Stage 6.2: Editor Header Bar

**Target**:
```tsx
<header className="sticky top-6 z-20 px-6 mb-8">
  <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg shadow-sage-900/5 rounded-full px-4 py-3 flex items-center justify-between">

    {/* Back button */}
    <button className="w-10 h-10 rounded-full hover:bg-sage-50 text-sage-500 hover:text-sage-800 flex items-center justify-center transition-all">
      <ChevronLeft size={20} />
    </button>

    {/* Word count */}
    <span className="text-[10px] font-bold uppercase tracking-widest text-sage-300">
      {wordCount} words
    </span>

    {/* Save button */}
    <button className="px-5 py-2 bg-sage-500 text-white rounded-full text-sm font-medium shadow-[0_4px_14px_0_rgba(107,143,122,0.39)]">
      Save
    </button>
  </div>
</header>
```

### Stage 6.3: Prompt Display (when writing from prompt)

**Target**:
```tsx
<div className="inline-flex items-center gap-2 text-sage-400 mb-3 px-3 py-1 bg-sage-50 rounded-full text-[10px] font-bold uppercase tracking-widest">
  <Sparkles size={12} /> Prompt
</div>
<p className="font-serif text-2xl md:text-3xl text-sage-800 leading-snug">{prompt}</p>
```

### Stage 6.4: Title & Content Inputs

**Title**:
```tsx
<input className="w-full bg-transparent text-4xl md:text-5xl font-serif text-sage-900 placeholder:text-sage-200 outline-none" />
```

**Content**:
```tsx
<textarea className="w-full bg-transparent text-lg md:text-xl leading-relaxed text-sage-800 placeholder:text-sage-200 outline-none resize-none min-h-[50vh] font-light selection:bg-sage-200" />
```

---

## PHASE 7: Settings/Profile Page
**Goal**: Apply sage accents consistently

### Stage 7.1: Section Cards

Use glass card styling with sage hover:
```tsx
<div className="glass-card p-6 rounded-[1.75rem] hover:border-sage-300/50 transition-all">
  <h3 className="font-serif text-lg text-sage-900 mb-2">{title}</h3>
  <p className="text-sage-600 text-sm">{description}</p>
</div>
```

### Stage 7.2: Profile Avatar

**Target**:
```tsx
<div className="w-20 h-20 rounded-full bg-sage-100 border-2 border-sage-200 flex items-center justify-center text-sage-600 font-serif text-2xl">
  {initials}
</div>
```

### Stage 7.3: Toggle/Switch Components

Use sage accent for active state:
```tsx
<div className={`w-12 h-6 rounded-full transition-colors ${isOn ? 'bg-sage-500' : 'bg-sage-200'}`}>
  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${isOn ? 'translate-x-6' : 'translate-x-0.5'}`} />
</div>
```

---

## PHASE 8: Mobile Navigation
**Goal**: Refine floating bottom nav

### Stage 8.1: Container

**Target**:
```tsx
<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-cream/90 backdrop-blur-xl border-t border-black/5 pb-safe z-20">
  <div className="flex items-center justify-between px-6 py-4">
```

### Stage 8.2: Nav Buttons

**Target**:
```tsx
<button className={`flex flex-col items-center gap-1 ${
  isActive ? 'text-sage-600' : 'text-sage-400'
}`}>
  <Icon size={20} />
  <span className="text-[10px] font-medium">{label}</span>
</button>
```

### Stage 8.3: Central "+" Button

**Target**:
```tsx
<div className="-mt-8">
  <button className="w-14 h-14 rounded-full bg-sage-500 text-white flex items-center justify-center shadow-lg shadow-sage-500/30 border-4 border-cream hover:bg-sage-600 transition-colors">
    <Plus size={24} />
  </button>
</div>
```

---

## PHASE 9: Global Hover & Interactive States
**Goal**: Consistent premium feel across all interactions

### Stage 9.1: All Clickable Cards

Apply to every glass-card that is interactive:
```css
.glass-card-interactive {
  transition: all 0.3s ease-out;
  cursor: pointer;
}

.glass-card-interactive:hover {
  border-color: rgba(158, 188, 174, 0.5); /* sage-300/50 */
  box-shadow: 0 8px 30px -4px rgba(107, 143, 122, 0.15);
  transform: translateY(-2px);
}
```

### Stage 9.2: Icon Container Hover

Standard icon container that changes on card hover:
```tsx
<div className="... bg-dark-surface border-dark-border text-text-muted group-hover:text-sage-500 group-hover:border-sage-300 group-hover:bg-sage-50 transition-all">
```

### Stage 9.3: Text Link Hover

```tsx
<a className="text-sage-600 hover:text-sage-800 transition-colors">
```

### Stage 9.4: Arrow/Chevron Animations

```tsx
<ArrowRight className="text-sage-300 group-hover:text-sage-600 group-hover:translate-x-1 transition-all" />
```

---

## PHASE 10: Final Polish & Verification
**Goal**: Ensure consistency and catch edge cases

### Stage 10.1: Color Audit

Check every page for:
- [ ] Date text uses `text-sage-400`
- [ ] Labels use `text-sage-400 uppercase tracking-widest`
- [ ] Primary buttons use `bg-sage-500`
- [ ] Icon containers use `bg-sage-50` or `bg-sage-100`
- [ ] Borders use `border-sage-100` or `border-white/60`
- [ ] No black/dark borders on cards (use white/sage)

### Stage 10.2: Spacing Consistency

- Cards: `rounded-[1.75rem]` or `rounded-[2rem]`
- Icon containers: `rounded-xl` or `rounded-2xl`
- Buttons: `rounded-full`
- Small badges: `rounded-full` or `rounded-md`

### Stage 10.3: Typography Check

- Page titles: `font-serif text-4xl text-sage-900`
- Section headers: `font-serif text-xl text-sage-900`
- Labels: `text-xs font-bold uppercase tracking-widest text-sage-400`
- Body text: `text-sage-600 font-light`
- Muted: `text-sage-300` or `text-sage-400`

### Stage 10.4: Functionality Verification

Run through every feature to ensure nothing was removed:
- [ ] Quick Jots - all 10 types work
- [ ] Guided Reflections - all 10 types work
- [ ] Goal Setting - all 9 types work
- [ ] Self-Discovery - all 9 types work
- [ ] Journal views: Stream, Calendar, List
- [ ] Journal filters: All Entries, Threads, Reflections
- [ ] Explore: Library tab with all journeys
- [ ] Explore: Toolbox tab with all tools
- [ ] Thread creation and viewing
- [ ] Mood check-in logs correctly
- [ ] Settings pages all accessible

### Stage 10.5: Build & Deploy

```bash
npm run build
# Fix any TypeScript/linting errors
git add .
git commit -m "Apply Meadow 23 design refinements - Phase 1-10"
git push
```

---

## Implementation Order

1. **Phase 1** - Foundation (index.html, colors, glass-card CSS)
2. **Phase 3** - Home Page (most visible, sets the tone)
3. **Phase 4** - Journal Page (connected timeline is key)
4. **Phase 5** - Explore Page (premium cards)
5. **Phase 6** - Editor (preserve all functionality!)
6. **Phase 2** - Sidebar (polish)
7. **Phase 7** - Settings (polish)
8. **Phase 8** - Mobile Nav (polish)
9. **Phase 9** - Global states
10. **Phase 10** - Verification

---

## Files to Modify

| File | Phases |
|------|--------|
| `index.html` | 1 |
| `views/Home.tsx` | 3 |
| `views/Journal.tsx` | 4 |
| `views/Explore.tsx` | 5 |
| `views/Editor.tsx` | 6 |
| `components/Sidebar.tsx` | 2 |
| `views/Settings.tsx` | 7 |
| `components/Layout.tsx` | 8 |
| (Various) | 9, 10 |

---

## DO NOT MODIFY

- `previous files for reference/*` - Reference only
- Any service files (journal.ts, threads.ts, etc.)
- Any type definitions
- Database/Supabase logic
- Authentication logic

---

## Quick Reference: Meadow 23 Color Tokens

| Use Case | Class |
|----------|-------|
| Date text | `text-sage-400` |
| Username | `text-sage-400 italic` |
| Section labels | `text-sage-400 uppercase tracking-widest` |
| Primary button | `bg-sage-500 text-white` |
| Button shadow | `shadow-[0_4px_14px_0_rgba(107,143,122,0.39)]` |
| Icon background (light) | `bg-sage-50` |
| Icon background (medium) | `bg-sage-100` |
| Icon color | `text-sage-500` or `text-sage-600` |
| Card border | `border-white/60` |
| Card hover border | `border-sage-300/50` |
| Card hover shadow | `shadow-[0_8px_30px_-12px_rgba(107,143,122,0.15)]` |
| Timeline line | `bg-sage-200` |
| Timeline dot | `bg-sage-300 border-cream` |
| Inactive tab | `text-sage-400` |
| Active tab | `bg-sage-500 text-white` |

---

*Blueprint Version 1.0 - December 24, 2024*
