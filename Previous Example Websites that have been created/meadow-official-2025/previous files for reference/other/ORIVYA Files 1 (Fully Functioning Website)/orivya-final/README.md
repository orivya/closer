# ORIVYA — Final Design Package

**Version:** Final  
**Last Updated:** December 2024  
**Core Concept:** "The Quiet Space"

A journaling app designed as a sanctuary for self-reflection. Write freely, discover patterns, and understand yourself better.

---

## 📁 Package Contents

| Folder | Files | Description |
|--------|-------|-------------|
| `/screens` | 23 | All app screens (HTML templates) |
| `/components` | 19 | Reusable UI components |
| `/content` | 7 | JSON content files (prompts, microcopy) |
| `/design-system` | 6 | Design tokens, typography, animations |
| `/docs` | 8 | Implementation guides |

**Total Files:** 64

---

## 🎯 Key Screens

| Screen | File | Description |
|--------|------|-------------|
| Home Dashboard | `orivya-home-dashboard.html` | Main landing with daily prompt |
| Note Editor | `orivya-note-editor.html` | Sanctuary writing space |
| Note View | `orivya-note-view.html` | Read and reflect on notes |
| Notes List | `orivya-notes-list.html` | All notes with word counts |
| Insights | `orivya-insights.html` | AI-surfaced patterns |
| First Arrival | `orivya-first-arrival.html` | New user onboarding |
| Onboarding | `orivya-onboarding.html` | Feature introduction |

---

## ✨ Design Philosophy

### The Quiet Space
- No notifications competing for attention
- Gentle, ambient warmth
- Sanctuary screens for writing (vignette effect)
- Silent autosave — no visual feedback needed

### Emotional Warmth System
- **Arrival lines:** 25 gentle greetings when opening editor
- **Pause messages:** 34 observational messages (not directive)
- **Closure messages:** 15 brief moments when saving

### Daily Prompts
- 25 open-ended, universal prompts
- Inviting, not prescriptive
- Rotate daily on home screen

---

## 🚀 Implementation

See `/docs/CLAUDE-CODE-GUIDE.md` for step-by-step implementation instructions.

### Build Order
1. Home Dashboard
2. Note Editor
3. Note View
4. Notes List
5. Insights
6. First Arrival
7. Remaining screens

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| `CANONICAL-VERSIONS.md` | Screen reference and descriptions |
| `CLAUDE-CODE-GUIDE.md` | Step-by-step implementation guide |
| `TECHNICAL-SPEC.md` | Database schema, API structure |
| `tailwind.config.js` | Tailwind CSS configuration |

---

## 🎨 Design System

### Colors
- **Sage:** `#7d9b8a` (primary accent)
- **Background:** `#08080a` (base dark)
- **Text:** `#fafafa` (primary), `#a1a1aa` (secondary)

### Typography
- **Display:** Fraunces (serif)
- **Body:** Inter (sans-serif)

### Animations
- All animations defined in `design-system/animations.css`
- Subtle, purposeful motion
- 200-400ms durations

---

Built with care. Ready for implementation.
