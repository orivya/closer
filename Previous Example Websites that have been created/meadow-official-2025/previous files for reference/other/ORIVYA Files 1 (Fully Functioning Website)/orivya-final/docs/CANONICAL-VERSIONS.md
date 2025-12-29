# ORIVYA — Final Screens Reference

**Last Updated:** December 2024  
**Core Concept:** "The Quiet Space"

All screens are final versions with no version numbers. This document serves as a reference for what each screen contains.

---

## 📱 SCREENS

| Screen | File | Description |
|--------|------|-------------|
| **Home Dashboard** | `orivya-home-dashboard.html` | Clean header, insight preview, 5-tab nav, daily prompt |
| **Note Editor** | `orivya-note-editor.html` | Sanctuary vignette, arrival/pause/closure messages, silent autosave |
| **Note View** | `orivya-note-view.html` | Inline editing, split view support, sage goal icon |
| **Notes List** | `orivya-notes-list.html` | Word count on cards, simple layout |
| **Insights** | `orivya-insights.html` | Clean top layout + patterns over time section |
| **Insight Reveal** | `orivya-insight-reveal.html` | Sacred moment modal |
| **Guided Flow** | `orivya-guided-flow.html` | Sanctuary vignette, matches Editor feel |
| **First Arrival** | `orivya-first-arrival.html` | Ambient glow, name step early, account creation |
| **Onboarding** | `orivya-onboarding.html` | Animated lens, ambient glow, preferences step |
| **Thread Detail** | `orivya-thread-detail.html` | Warmer copy, emotional CTAs |
| **Goals List** | `orivya-goals-list.html` | "Questions You're Living With" |
| **Goal Detail** | `orivya-goal-detail.html` | Milestones integrated |
| **Prompt Library** | `orivya-prompt-library.html` | Full page with categories |
| **Search** | `orivya-search.html` | Full search functionality |
| **Settings** | `orivya-settings.html` | App preferences |
| **Account** | `orivya-account.html` | User account settings |
| **Archive** | `orivya-archive.html` | Archived notes |
| **Export** | `orivya-export.html` | Data export |
| **Feedback** | `orivya-feedback.html` | User feedback form |
| **Help** | `orivya-help.html` | Help & FAQ |
| **Notifications** | `orivya-notifications.html` | Notification settings |
| **Privacy Security** | `orivya-privacy-security.html` | Privacy settings |
| **Upgrade** | `orivya-upgrade.html` | Premium upgrade |

---

## 📝 CONTENT FILES

| File | Contents | Usage |
|------|----------|-------|
| `copy-editor-microcopy.json` | 25 arrival lines, 10 placeholders, 34 pause messages, 5 return messages, 15 closure messages | Editor emotional warmth system |
| `prompts-daily.json` | 25 daily prompts | Home dashboard "Today's Prompt" card |
| `prompts-checkin.json` | 26 quick check-in prompts | Home quick check-in, prompt sheets |
| `prompts-deep.json` | 78 deep reflection prompts | Guided flow, prompt library |
| `copy-greetings.json` | Time-of-day greetings | Home dashboard |
| `copy-confirmations.json` | Save/delete confirmations | Throughout app |
| `copy-empty-states.json` | Empty state messages | Notes, threads, insights |

---

## 🎨 MOOD LAYER SYSTEM

| Layer | Screens | Vignette | Purpose |
|-------|---------|----------|---------|
| **Clarity** | Home, Notes List, Settings, Insights, Goals | ❌ None | Open, airy, functional |
| **Focus** | Note View, Threads | ❌ None | Slightly contained |
| **Sanctuary** | Note Editor, Guided Flow | ✅ Yes | Intimate, introspective |
| **Sacred** | Insight Reveal | ✅ Yes | Stillness, meaning |

---

## Navigation Structure

### Desktop Sidebar
```
Home
Notes
Threads
Insights
───────
Archive
Settings
```

### Mobile Tab Bar (5 items)
```
Home | Notes | Threads | Insights | Settings
```

### Floating Action Button (FAB)
- Position: Bottom-right, above tab bar
- Visible: Mobile only
- Action: Opens Note Editor

---

## Key Design Decisions

### Silent Autosave
- Saves every 2 seconds in background
- No visual indicator — the app just works
- User never thinks about saving

### Arrival Line
- Shows above title on new/blank notes
- Disappears when user types in title OR textarea
- Random selection from 25 lines

### Pause Messages
- Shows once per session after 8+ seconds pause
- Only if 50+ characters written
- Observational, not directive

### No Question Mark Icon on Daily Prompt
- Cleaner without it
- Label "Today's prompt" is sufficient
