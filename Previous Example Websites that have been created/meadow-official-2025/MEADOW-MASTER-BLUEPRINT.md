# MEADOW MASTER BLUEPRINT
## The Complete Project Bible

**Version:** 1.0
**Created:** 2025-12-20
**Status:** Analysis Complete
**Estimated Build Time:** 12-14 weeks

---

# Executive Summary

## What is Meadow?
Meadow is a premium journaling application designed to help users "see themselves clearly" through reflective writing, AI-powered insights, and guided journeys. The app combines thoughtful UX with modern technology to create a calming, personal space for self-reflection.

## Current State
The prototype is a **well-designed frontend** with:
- Complete UI implementation in React + TypeScript + Tailwind
- Multiple views and features stubbed out
- Design system established (sage/clay color palette)
- Supabase client initialized but not connected

## Key Findings

### Strengths
- **Beautiful design** - Premium, calm aesthetic with sage/clay palette
- **Thoughtful UX** - Multiple entry modes, journeys, spaces
- **Solid foundation** - Clean React code, TypeScript, modern stack

### Critical Gaps
1. **No backend connection** - All data is mocked
2. **No authentication** - Email/password form exists but doesn't work
3. **No monetization** - No premium/payment system
4. **No AI integration** - Mirror, insights are static
5. **Missing core features** - Search, autosave, verification

### Recommended MVP Timeline
| Phase | Weeks | Focus |
|-------|-------|-------|
| Foundation | 1-2 | Auth, database |
| Core | 3-6 | Journaling, organization |
| Features | 7-8 | Journeys, basic spaces |
| Monetization | 9-10 | Payments |
| Polish | 11-12 | Testing, launch prep |

---

# Part 1: Design System

## Brand Identity

### Colors
```
Primary: Sage (#7d9b8a) - calm, growth, nature
Secondary: Clay (#c47f6a) - warmth, accent
Neutral: Stone palette - backgrounds, borders
Text: Dark stone (#1c2421) for readability
```

### Typography
- **Display/Headlines**: Fraunces (serif) - warm, literary
- **Body/UI**: Inter (sans-serif) - clean, readable

### Visual Language
- Organic rounded corners (24-48px radius)
- Glass morphism effects
- Subtle animations (fade-up, float, pulse)
- Generous whitespace
- Nature-inspired metaphors

## Key Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `sage` | #7d9b8a | Primary actions, active states |
| `sage-dark` | #5c7a6b | Dark accents, gradients |
| `clay` | #c47f6a | Secondary accent, Vault feature |
| `stone-50` | #faf9f7 | Page background |
| `text-primary` | #1c2421 | Headlines, body text |
| `rounded-[32px]` | 32px | Feature cards |
| `shadow-card` | Subtle elevation | Card shadows |

**Full Reference:** See `DESIGN-SYSTEM-REFERENCE.md`

---

# Part 2: User Experience Analysis

## User Journey Summary

### First-Time Users
**Current Flow:** Landing → Onboarding (4 steps) → Home
**Critical Gaps:**
- No email verification
- No social login
- No skip options
- No guided tour

### Returning Users
**Current Flow:** Login → Home
**Critical Gaps:**
- No push notifications
- No streak celebrations
- No "welcome back" personalization
- No weekly digest

### Power Users (30+ days)
**Current Flow:** Standard navigation
**Critical Gaps:**
- No search
- No advanced filters
- No bulk operations
- Limited insights

### Privacy-Concerned Users
**Critical Gaps:**
- No encryption indicators
- No data export
- No account deletion
- Missing privacy policy

**Full Reference:** See `USER-JOURNEY-GAPS.md`

---

# Part 3: Screen-by-Screen Summary

## Critical Screen Issues

| Screen | Critical Issues |
|--------|-----------------|
| Landing | Missing pricing, FAQ, trust badges |
| Onboarding | No verification, no skip, no social login |
| Home | No empty states, static data |
| Journal | No search, no filters |
| Editor | No autosave, voice/image stubbed |
| Explore | IA confusion, static content |
| Insights | All data hardcoded |
| Settings | No functional settings |

## MVP Screen Requirements

### Must Have
- Landing (simplified)
- Onboarding (with verification)
- Home (with empty states)
- Journal (stream + list + search)
- Editor (freewrite + prompted + autosave)
- Settings (change password, delete account)

### Should Have
- Calendar view
- Thread management
- Journey tracking
- Basic insights

### Cut for MVP
- Mirror (AI version)
- Decision Lab
- Voice Memos
- Advanced insights

**Full Reference:** See `SCREEN-BY-SCREEN-ANALYSIS.md`

---

# Part 4: Technical Architecture

## Tech Stack

| Layer | Technology | Status |
|-------|------------|--------|
| Frontend | React 19 + TypeScript | Active |
| Styling | Tailwind CSS | Active |
| Backend | Supabase | Stubbed |
| Auth | Supabase Auth | Stubbed |
| Database | PostgreSQL | Stubbed |
| AI | OpenAI + Whisper | Planned |
| Payments | Stripe | Planned |
| Analytics | PostHog | Planned |
| Push | OneSignal | Planned |

## Database Schema (Core Tables)

```sql
-- Core tables needed
profiles       -- User profiles (extends auth.users)
entries        -- Journal entries
threads        -- Entry groupings
intentions     -- User goals/intentions
time_capsules  -- Vault letters
mood_logs      -- Mood tracking
journey_progress -- Journey tracking
```

## Critical Technical Gaps

| Gap | Priority | Effort |
|-----|----------|--------|
| Auth not connected | Critical | Medium |
| Database empty | Critical | Medium |
| No autosave | Critical | Low |
| No search | Critical | Medium |
| No payments | Critical | High |
| No AI integration | High | High |
| No push notifications | High | Medium |
| No data export | Critical (GDPR) | Medium |

**Full Reference:** See `TECHNICAL-REQUIREMENTS.md`

---

# Part 5: Implementation Roadmap

## MVP Scope (v1.0)

### In Scope
- Email/password auth with verification
- Full entry CRUD with autosave
- Search and basic filters
- Stream/List/Calendar views
- Thread management
- Journey browsing and tracking
- Basic insights (stats)
- Simplified Vault (3 capsules)
- Premium upgrade flow
- Data export and account deletion

### Out of Scope (v1.0)
- Voice transcription
- Image entries
- AI-powered Mirror
- Decision Lab
- Advanced insights
- Social login
- Two-factor auth

## Sprint Schedule

| Sprint | Weeks | Deliverables |
|--------|-------|--------------|
| 0 | 0.5 | Supabase setup, schema |
| 1-2 | 2 | Complete auth system |
| 3-4 | 2 | Entry CRUD, autosave, search |
| 5-6 | 2 | Views, threads, filters |
| 7-8 | 2 | Journeys, Vault, insights |
| 9-10 | 2 | Stripe, premium features |
| 11-12 | 2 | Polish, testing, launch |

## Launch Checklist

### Technical
- [ ] All MVP features functional
- [ ] Error handling complete
- [ ] Performance < 3s load
- [ ] Security audit passed

### Legal
- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] GDPR compliance (export, delete)
- [ ] Cookie consent

### Business
- [ ] Stripe production ready
- [ ] Support email configured
- [ ] Analytics installed
- [ ] Uptime monitoring

**Full Reference:** See `IMPLEMENTATION-BLUEPRINT.md`

---

# Part 6: Feature Priority Matrix

## MoSCoW Analysis

### Must Have (MVP Blockers)
| Feature | Effort |
|---------|--------|
| Email auth + verification | Medium |
| Entry CRUD + autosave | Low |
| Search | Medium |
| Data export | Medium |
| Account deletion | Medium |
| Stripe integration | High |
| Privacy/Terms pages | Low |

### Should Have (v1.0)
| Feature | Effort |
|---------|--------|
| Google OAuth | Medium |
| Calendar view | Medium |
| Thread management | Medium |
| Journey tracking | Medium |
| Basic insights | Medium |
| Daily reminders | Medium |
| Premium feature gating | Medium |

### Could Have (v1.1)
| Feature | Effort |
|---------|--------|
| AI insights | High |
| Voice memos | High |
| Image entries | Medium |
| Full Vault | Medium |
| Intentions | Medium |
| Weekly digest | Medium |

### Won't Have (v1.x)
| Feature | Reason |
|---------|--------|
| Decision Lab | Complex, low initial value |
| Markdown editor | Power user feature |
| Entry templates | Power user feature |
| API access | Enterprise feature |

---

# Part 7: Critical Path Items

## Blockers in Order

```
1. Supabase Setup → Blocks EVERYTHING
   └── Database schema
   └── RLS policies
   └── Storage buckets

2. Authentication → Blocks all user features
   └── Signup/Login
   └── Email verification
   └── Session management

3. Entry CRUD → Blocks insights, threads
   └── Create/Edit/Delete
   └── Autosave
   └── Search

4. Stripe Integration → Blocks launch
   └── Checkout flow
   └── Webhooks
   └── Subscription management

5. Legal Pages → Blocks launch
   └── Privacy Policy
   └── Terms of Service
   └── Cookie consent
```

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Supabase downtime | Local fallback mode |
| Stripe issues | Manual upgrade fallback |
| AI costs | Tiered limits, caching |
| Data loss | Autosave + local backup |
| Auth issues | Clear error messages |

---

# Part 8: Cost Estimates

## Development Costs

| Resource | Duration | Monthly Rate | Total |
|----------|----------|--------------|-------|
| Full-stack dev | 3 months | $10-15K | $30-45K |
| Designer | 1 month | $5-8K | $5-8K |
| QA | 2 weeks | $3-4K | $1.5-2K |
| **Total** | | | **$36-55K** |

## Infrastructure Costs (Monthly)

| Service | Beta | Launch | Scale |
|---------|------|--------|-------|
| Supabase | $0 | $25 | $599+ |
| OpenAI | $20 | $100 | $500+ |
| Stripe | 2.9%+30¢/tx | Same | Same |
| OneSignal | $0 | $0 | $9+ |
| PostHog | $0 | $0 | $0+ |
| Email (Resend) | $0 | $20 | $50+ |
| **Total** | **~$20** | **~$150** | **~$700+** |

## Revenue Projections (Premium at $7.99/mo)

| Users | Conversion | MRR |
|-------|------------|-----|
| 1,000 | 5% | $400 |
| 5,000 | 5% | $2,000 |
| 10,000 | 5% | $4,000 |
| 50,000 | 5% | $20,000 |

---

# Part 9: Success Metrics

## North Star Metric
**Weekly Active Journalers (WAJ)** - Users who write 3+ entries per week

## Key Metrics Dashboard

### Acquisition
- Landing page → Signup conversion
- Onboarding completion rate
- Time to first entry

### Activation
- Entries in first 7 days
- Journey started in first 7 days
- Return on Day 2

### Engagement
- WAJ (Weekly Active Journalers)
- Entries per user per week
- Average session length
- Feature adoption rates

### Retention
- D7, D30, D90 retention
- Streak statistics
- Churn rate

### Revenue
- Free → Premium conversion
- Monthly Recurring Revenue (MRR)
- Lifetime Value (LTV)
- Churn rate

---

# Part 10: Document Index

## Related Documents

| Document | Purpose |
|----------|---------|
| `MEADOW-PROGRESS-TRACKER.md` | Task completion tracking |
| `DESIGN-SYSTEM-REFERENCE.md` | Colors, typography, components |
| `USER-JOURNEY-GAPS.md` | User experience gaps |
| `SCREEN-BY-SCREEN-ANALYSIS.md` | Detailed screen analysis |
| `TECHNICAL-REQUIREMENTS.md` | Backend, API, infrastructure |
| `IMPLEMENTATION-BLUEPRINT.md` | Sprints, priorities, checklists |

## Next Steps

### Immediate (This Week)
1. Set up Supabase project
2. Create database schema
3. Connect auth to frontend
4. Start Sprint 1

### Short-Term (Next 2 Weeks)
1. Complete auth system
2. Connect entry CRUD
3. Add autosave
4. Implement search

### Medium-Term (Next Month)
1. Complete core journaling
2. Add thread management
3. Implement journey tracking
4. Set up Stripe

---

# Appendix A: Quick Start Guide

## For Developers

### 1. Environment Setup
```bash
# Clone and install
git clone [repo]
npm install

# Set up environment
cp .env.example .env.local
# Add Supabase keys

# Start development
npm run dev
```

### 2. Supabase Setup
1. Create Supabase project
2. Run migrations from `supabase/migrations/`
3. Configure auth providers
4. Set up storage buckets

### 3. Development Workflow
1. Check `MEADOW-PROGRESS-TRACKER.md` for current status
2. Pick task from current sprint
3. Reference `DESIGN-SYSTEM-REFERENCE.md` for UI
4. Update tracker when complete

---

# Appendix B: Glossary

| Term | Definition |
|------|------------|
| Entry | A single journal writing |
| Thread | A topical grouping of entries |
| Journey | A multi-day guided writing path |
| Space | A specialized tool (Mirror, Vault, etc.) |
| Intention | A life goal or focus area |
| Reflection | An AI-generated insight |
| Capsule | A time-locked vault letter |
| Streak | Consecutive days of writing |

---

# Appendix C: Contact & Support

## Project Resources
- **Repository:** [Git URL]
- **Design Files:** [Figma URL]
- **API Docs:** [Supabase URL]

## Team Contacts
- **Product Owner:** [Name]
- **Tech Lead:** [Name]
- **Designer:** [Name]

---

**End of Master Blueprint**

*This document should be treated as the source of truth for the Meadow project. All team members should reference this document and its supporting files when making product decisions.*
