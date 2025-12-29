# MixExperts.com — Master Platform Blueprint

## Complete Business, Technology & AI Integration Specification

**Version 2.0 — Production Ready**
**December 2025**

---

# TABLE OF CONTENTS

1. [Executive Vision](#1-executive-vision)
2. [Platform Architecture Overview](#2-platform-architecture-overview)
3. [User Types & Journeys](#3-user-types--journeys)
4. [Business Model & Monetization](#4-business-model--monetization)
5. [AI Integration Strategy](#5-ai-integration-strategy)
6. [Core Feature Specifications](#6-core-feature-specifications)
7. [Technical Architecture](#7-technical-architecture)
8. [Database Schema](#8-database-schema)
9. [Security & Compliance](#9-security--compliance)
10. [Design System Foundation](#10-design-system-foundation)
11. [Implementation Phases](#11-implementation-phases)
12. [Success Metrics](#12-success-metrics)

---

# 1. EXECUTIVE VISION

## 1.1 Mission Statement

MixExperts transforms how audio professionals present themselves, connect with clients, and build sustainable careers. We provide the complete professional identity infrastructure that mixing and mastering engineers need to compete in the modern music industry.

## 1.2 The Problem

**For Audio Engineers:**
- No professional web presence (80% have no website)
- Client communication scattered across Instagram DMs, emails, texts
- No standardized way to demonstrate skill (before/after comparisons)
- Booking and payment processes are unprofessional and manual
- Struggle with copywriting, pricing strategy, and self-promotion
- Time spent on admin tasks instead of creative work

**For Clients/Artists:**
- Difficult to evaluate engineer quality before hiring
- No transparency in pricing or turnaround times
- Payment processes feel risky and unprofessional
- Hard to compare engineers objectively

## 1.3 The Solution

MixExperts provides a complete professional ecosystem:

| Component | Function |
|-----------|----------|
| **Professional Profile** | Premium portfolio website in minutes |
| **Before/After Player** | Demonstrate skill with audio comparisons |
| **Booking System** | Automated scheduling and calendar management |
| **Payment Processing** | Stripe-powered secure transactions |
| **Client Management** | Inquiry tracking and communication hub |
| **AI Assistant** | Copywriting, client responses, optimization |
| **Digital Storefront** | Sell presets, templates, sample packs |
| **Analytics Dashboard** | Business intelligence and insights |

## 1.4 Competitive Advantage

| Competitor | Their Focus | MixExperts Advantage |
|------------|-------------|---------------------|
| SoundBetter | Marketplace discovery | Personal brand ownership + full toolkit |
| EngineEars | Curated top-tier only | Accessible to all skill levels + AI tools |
| Linktree | Generic link aggregation | Audio-specific features + business tools |
| Carrd | Simple landing pages | Full business platform + payments |
| Squarespace | General websites | Audio-native features + industry focus |

**Our Moat:** Audio-specific features (before/after player, waveform visualization, Spotify embeds) combined with AI-powered business tools that no generic website builder offers.

---

# 2. PLATFORM ARCHITECTURE OVERVIEW

## 2.1 Three-Tier Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                     PUBLIC LAYER                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Marketing  │  │  Engineer   │  │  Digital Product        │  │
│  │  Website    │  │  Profiles   │  │  Marketplace            │  │
│  │  (SEO/CRO)  │  │  (Portfolio)│  │  (Storefront)           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ENGINEER LAYER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Dashboard  │  │  Profile    │  │  Business               │  │
│  │  (Home)     │  │  Editor     │  │  Management             │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Inbox &    │  │  AI         │  │  Settings &             │  │
│  │  Messages   │  │  Assistant  │  │  Billing                │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Platform   │  │  User       │  │  Revenue &              │  │
│  │  Analytics  │  │  Management │  │  Payouts                │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 2.2 Page Inventory

### Public Pages (No Auth Required)
- `/` — Marketing homepage
- `/pricing` — Pricing and plan comparison
- `/features` — Feature showcase
- `/examples` — Example engineer profiles
- `/blog` — Content marketing (future)
- `/[username]` — Public engineer profile
- `/[username]/products` — Engineer's digital products
- `/[username]/book` — Direct booking page

### Auth Pages
- `/login` — Sign in
- `/signup` — Create account
- `/forgot-password` — Password reset request
- `/reset-password` — Password reset form
- `/verify-email` — Email verification

### Dashboard Pages (Auth Required)
- `/dashboard` — Home overview
- `/dashboard/profile` — Profile editor
- `/dashboard/portfolio` — Portfolio manager
- `/dashboard/services` — Services manager
- `/dashboard/products` — Digital products manager
- `/dashboard/calendar` — Availability and bookings
- `/dashboard/inbox` — Inquiries and messages
- `/dashboard/analytics` — Performance metrics
- `/dashboard/ai` — AI Assistant interface
- `/dashboard/settings` — Account settings
- `/dashboard/billing` — Subscription and payments

---

# 3. USER TYPES & JOURNEYS

## 3.1 Primary User: Audio Engineer

### Segments

**Segment A: Emerging Engineers (40%)**
- 0-3 years experience
- Building first professional presence
- Price-sensitive, need free tier
- High potential for paid conversion as they grow

**Segment B: Established Freelancers (35%)**
- 3-10 years experience
- Existing client base, need efficiency
- Willing to pay for time-saving tools
- Primary Pro tier candidates

**Segment C: Studio Professionals (20%)**
- 10+ years or studio-employed
- Need booking calendar + team features
- Higher transaction volumes
- Enterprise tier candidates

**Segment D: Producer-Engineers (5%)**
- Produce and mix their own work
- Sell presets and templates actively
- Marketplace power users

### Engineer Journey

```
AWARENESS          ACTIVATION           ENGAGEMENT           REVENUE            REFERRAL
    │                  │                    │                   │                  │
    ▼                  ▼                    ▼                   ▼                  ▼
┌─────────┐      ┌───────────┐       ┌────────────┐      ┌──────────┐      ┌──────────┐
│ Discover│      │  Sign Up  │       │  Build     │      │ Receive  │      │  Share   │
│ via SEO │ ──▶  │  (Free)   │  ──▶  │  Profile   │ ──▶  │ Inquiry  │ ──▶  │  Profile │
│ or Word │      │           │       │            │      │          │      │          │
│ of Mouth│      └───────────┘       └────────────┘      └──────────┘      └──────────┘
└─────────┘            │                    │                   │                  │
                       ▼                    ▼                   ▼                  ▼
                 ┌───────────┐       ┌────────────┐      ┌──────────┐      ┌──────────┐
                 │  Complete │       │  Add       │      │  Convert │      │  Upgrade │
                 │  Onboard  │  ──▶  │  Portfolio │ ──▶  │  to Paid │ ──▶  │  to Pro  │
                 │  Wizard   │       │  Items     │      │  Project │      │          │
                 └───────────┘       └────────────┘      └──────────┘      └──────────┘
```

## 3.2 Secondary User: Client/Artist

### Client Journey

```
SEARCH              EVALUATE             CONTACT              BOOK               REVIEW
   │                   │                    │                   │                  │
   ▼                   ▼                    ▼                   ▼                  ▼
┌─────────┐      ┌───────────┐       ┌────────────┐      ┌──────────┐      ┌──────────┐
│ Find via│      │  Browse   │       │  Submit    │      │ Schedule │      │  Leave   │
│ Google  │ ──▶  │  Profile  │  ──▶  │  Inquiry   │ ──▶  │ Session  │ ──▶  │  Review  │
│ or Link │      │  Listen   │       │  Form      │      │ Pay      │      │          │
└─────────┘      └───────────┘       └────────────┘      └──────────┘      └──────────┘
                       │
                       ▼
                 ┌───────────┐
                 │  Before/  │
                 │  After    │
                 │  Compare  │
                 └───────────┘
```

---

# 4. BUSINESS MODEL & MONETIZATION

## 4.1 Revenue Streams

### Primary: Subscription Revenue (70%)

| Tier | Price | Target Segment | Features |
|------|-------|----------------|----------|
| **Free** | $0/mo | Emerging engineers | Basic profile, 3 portfolio items, 2 services, 20% transaction fee, MixExperts branding |
| **Pro** | $19/mo | Established freelancers | Unlimited everything, 0% fee, custom domain, booking calendar, testimonials, analytics |
| **AI Add-on** | $12/mo | Power users | AI copywriting, client response drafts, chatbot widget, optimization suggestions |
| **Enterprise** | $49/mo | Studios | Team accounts, white-label, API access, priority support |

### Secondary: Transaction Fees (20%)

| Source | Fee Structure |
|--------|---------------|
| Free tier transactions | 20% platform fee |
| Digital product sales | 15% marketplace commission |
| Booking deposits | 3% processing (passed to Stripe) |

### Tertiary: Future Revenue (10%)

- Featured profile placements
- Premium templates and themes
- API access for integrations
- White-label licensing

## 4.2 Unit Economics

### Customer Acquisition
- Target CAC: $15-25
- Primary channels: SEO, word-of-mouth, social
- Viral coefficient target: 1.2 (each user brings 1.2 new users)

### Lifetime Value
- Free user LTV: $50 (transaction fees over 18 months)
- Pro user LTV: $342 (18-month average tenure × $19)
- Pro + AI LTV: $558 (18-month × $31)
- Enterprise LTV: $882 (18-month × $49)

### Key Ratios
- Target LTV:CAC ratio: 4:1
- Monthly churn target: <5%
- Free-to-paid conversion: 8-12%

## 4.3 Pricing Psychology

**Free Tier Strategy:**
- Generous enough to be genuinely useful
- 20% transaction fee creates natural upgrade pressure
- MixExperts branding provides free marketing
- Profile limit (3 items) encourages upgrade as portfolio grows

**Pro Tier Value:**
- 0% transaction fee pays for itself at ~$95/month in bookings
- Custom domain is high-perceived-value feature
- Booking calendar saves 5+ hours/month

**AI Add-on Psychology:**
- Positioned as "assistant" not "replacement"
- Separate from Pro to allow à la carte purchase
- Clear time-saving value proposition

---

# 5. AI INTEGRATION STRATEGY

## 5.1 AI Philosophy

**Guiding Principles:**
1. **Augment, don't replace** — AI helps engineers be more professional, not robotic
2. **Personalized outputs** — All AI content matches engineer's voice and style
3. **Transparent value** — Clear before/after of AI improvements
4. **Privacy-first** — Engineer data used only for their benefit

## 5.2 AI Features Overview

### Tier 1: Profile AI (Included in AI Add-on)

| Feature | Function | User Value |
|---------|----------|------------|
| **Bio Generator** | Creates professional bios from bullet points | Saves 2+ hours, better conversion |
| **Service Descriptions** | Writes compelling service copy | Increases booking rate |
| **Tagline Generator** | Creates memorable one-liners | Stronger first impression |
| **SEO Optimizer** | Suggests keywords and meta content | Better Google ranking |
| **Tone Matching** | Learns engineer's communication style | Consistent brand voice |

### Tier 2: Communication AI (Included in AI Add-on)

| Feature | Function | User Value |
|---------|----------|------------|
| **Inquiry Response Drafter** | Drafts personalized replies to client inquiries | Faster response time |
| **Follow-up Generator** | Creates follow-up messages for cold leads | Recovers lost opportunities |
| **Quote Generator** | Produces professional project quotes | More professional appearance |
| **Scope Clarifier** | Asks smart questions about vague inquiries | Better project scoping |

### Tier 3: Client-Facing AI (Included in AI Add-on)

| Feature | Function | User Value |
|---------|----------|------------|
| **Profile Chatbot** | 24/7 AI assistant on public profile | Answers questions when engineer sleeps |
| **Lead Qualifier** | Asks intake questions before human contact | Filters serious inquiries |
| **Booking Assistant** | Helps clients find right service/time | Reduces booking friction |
| **FAQ Answerer** | Responds to common questions | Saves repetitive typing |

### Tier 4: Business Intelligence AI (Included in AI Add-on)

| Feature | Function | User Value |
|---------|----------|------------|
| **Profile Optimizer** | Analyzes profile and suggests improvements | Higher conversion rate |
| **Pricing Advisor** | Recommends optimal pricing based on market | Maximize revenue |
| **Trend Spotter** | Identifies patterns in inquiries/bookings | Strategic planning |
| **Conversion Analyzer** | Shows why inquiries don't convert | Actionable improvements |

## 5.3 AI Technical Implementation

### Context Injection System

Every AI interaction receives:
```
{
  "engineer_profile": {
    "name": "...",
    "bio": "...",
    "services": [...],
    "pricing": {...},
    "style_samples": [...],
    "tone_preference": "professional|friendly|casual"
  },
  "conversation_history": [...],
  "inquiry_context": {
    "client_name": "...",
    "project_type": "...",
    "budget_indicator": "...",
    "timeline": "..."
  }
}
```

### Prompt Templates

**Bio Generation:**
```
You are a professional copywriter specializing in music industry professionals.

Create a compelling bio for a mixing/mastering engineer with these details:
- Years of experience: {years}
- Genres: {genres}
- Notable credits: {credits}
- Unique approach: {approach}
- Target clients: {target}

Tone: {tone_preference}
Length: {word_count} words

The bio should:
1. Open with a hook that establishes credibility
2. Highlight unique value proposition
3. Include social proof naturally
4. End with a subtle call-to-action
5. Sound human, not robotic
```

**Inquiry Response:**
```
You are responding on behalf of {engineer_name}, a {title}.

Client inquiry:
"{inquiry_text}"

Engineer's typical response style: {style_samples}
Engineer's pricing: {pricing_info}
Current availability: {availability}

Draft a response that:
1. Thanks them for reaching out
2. Addresses their specific needs
3. Provides relevant pricing/timeline info
4. Asks 1-2 clarifying questions if needed
5. Includes a clear next step
6. Matches the engineer's voice

Keep it concise (under 150 words).
```

### AI Chatbot Training

Engineers can train their chatbot with:
1. **Automatic training** — Learns from existing profile content
2. **Q&A pairs** — Engineer adds specific questions and answers
3. **Response review** — Engineer approves/edits AI responses to improve
4. **Personality settings** — Formal, friendly, brief, detailed

### Usage Tracking & Limits

| Feature | Free | Pro | AI Add-on |
|---------|------|-----|-----------|
| Bio generations | 1 | 1 | Unlimited |
| Response drafts | 0 | 0 | 50/month |
| Chatbot messages | 0 | 0 | 500/month |
| Optimization scans | 0 | 1/month | Unlimited |

## 5.4 AI Safety & Quality

**Content Filtering:**
- No generation of false credentials
- No fabricated testimonials
- No misleading pricing claims
- No competitor disparagement

**Human Oversight:**
- All AI drafts require engineer approval before sending
- Chatbot can escalate to human for complex questions
- Engineers can review/edit all AI-generated content

**Quality Assurance:**
- A/B testing of AI outputs vs. human-written
- Conversion rate tracking for AI-assisted profiles
- User satisfaction surveys

---

# 6. CORE FEATURE SPECIFICATIONS

## 6.1 Public Engineer Profile

The profile is the centerpiece — a premium portfolio website engineers share with clients.

### Profile Sections

| Section | Required | Content |
|---------|----------|---------|
| **Hero** | Yes | Photo, name, tagline, location, social links, CTA buttons |
| **About** | Yes | Bio text, specialty badges, years of experience |
| **Portfolio** | Yes | Before/after audio, project images, Spotify embeds |
| **Services** | Yes | Service cards with pricing, features, booking CTA |
| **Credits** | No | Artist/label logos with links |
| **Testimonials** | No | Client reviews with star ratings |
| **Products** | No | Digital products for sale |
| **FAQ** | No | Common questions and answers |
| **Contact** | Yes | Inquiry form with service selection |

### Before/After Audio Player

**Core Functionality:**
- Upload "before" (raw/rough mix) and "after" (final mix)
- Single toggle switch for instant A/B comparison
- Seamless crossfade between versions
- Waveform visualization
- Progress scrubber with time display
- Volume control with mute
- Multiple tracks in playlist format

**Technical Requirements:**
- Supported formats: MP3, WAV, FLAC
- Max file size: 50MB per file
- Streaming playback (no full download required)
- Mobile-optimized touch controls

### Theme System

**6 Color Themes:**
| Theme | Primary | Use Case |
|-------|---------|----------|
| Amber | #C9956C | Warm, inviting (default) |
| Teal | #5BA4A4 | Cool, professional |
| Sage | #7D9B8A | Natural, organic |
| Slate | #6B8CAE | Corporate, trustworthy |
| Rose | #B88B8B | Creative, artistic |
| Violet | #9B8BB8 | Unique, memorable |

**Theme Application:**
- Engineer selects theme in dashboard
- Theme persists across all profile sections
- Accent color applies to: buttons, links, highlights, glows

## 6.2 Engineer Dashboard

### Navigation Structure (5 Tabs)

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐              │
│  │ HOME │  │PROFILE│  │ BIZ  │  │ INBOX│  │SETTINGS│            │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘              │
└─────────────────────────────────────────────────────────────────┘

HOME:      Overview, stats, quick actions, AI suggestions
PROFILE:   Edit bio, portfolio, credits, testimonials
BUSINESS:  Services, products, calendar, bookings
INBOX:     Inquiries, messages, notifications
SETTINGS:  Account, billing, integrations, AI preferences
```

### Dashboard Home

**Stats Overview:**
- Profile views (7-day trend)
- Inquiries received (with response rate)
- Revenue (weekly/monthly/yearly)
- Upcoming bookings count

**Quick Actions:**
- "View My Profile" — Opens public profile
- "Share Link" — Copy profile URL
- "Add Project" — Quick portfolio add
- "Check Inbox" — Unread count badge

**AI Suggestions Panel:**
- Profile improvement tips
- Response reminders for unanswered inquiries
- Optimization opportunities

**Profile Completeness:**
- Visual progress meter (0-100%)
- Checklist of missing sections
- Gamification badges

## 6.3 Booking & Calendar System

### Availability Settings

- Working days (Mon-Sun toggles)
- Working hours per day
- Timezone selection
- Blocked dates (vacations, holidays)
- Buffer time between bookings
- Advance booking window (e.g., book up to 30 days ahead)

### Service-Based Booking

Each service can have:
- Duration (1 hour, 1 day, 1 week, custom)
- Deposit requirement (% or fixed amount)
- Booking form fields (project details, reference links)
- Automatic confirmation email
- Calendar invite generation

### Calendar Integrations

- Google Calendar sync (two-way)
- Apple Calendar sync (two-way)
- Outlook Calendar sync (two-way)
- iCal feed export

## 6.4 Digital Products Marketplace

### Product Types

| Type | Example | Delivery |
|------|---------|----------|
| Vocal Presets | FabFilter Pro-Q settings | Instant download (ZIP) |
| Channel Strips | Full vocal chain | Instant download |
| Templates | Pro Tools session | Instant download |
| Sample Packs | Drum loops | Instant download |
| Video Tutorials | Mixing walkthrough | Streaming + download |
| Mix Stems | Practice files | Instant download |

### Product Features

- Preview audio (30-second sample)
- Multiple pricing tiers (personal, commercial)
- License management
- Bundle creation
- Discount codes
- Sales analytics

### Marketplace Mechanics

- Products appear on engineer's profile
- 15% platform commission on sales
- Instant payout to engineer's Stripe
- Download tracking and limits
- Refund handling

## 6.5 Inquiry & Client Management

### Inquiry Flow

```
CLIENT                          ENGINEER
   │                               │
   │  Submit inquiry form          │
   │  ─────────────────────────▶   │
   │                               │  Receives notification
   │                               │  (email + dashboard)
   │                               │
   │                               │  Views in inbox
   │                               │  AI drafts response
   │                               │
   │  Receives response            │
   │  ◀─────────────────────────   │
   │                               │
   │  Continues conversation       │
   │  ─────────────────────────▶   │
   │                               │
   │                               │  Converts to booking
   │  Receives booking link        │
   │  ◀─────────────────────────   │
   │                               │
   │  Books and pays deposit       │
   │  ─────────────────────────▶   │
   │                               │
```

### Inbox Features

- Unified inbox for all inquiries
- Read/unread status
- Star/favorite important threads
- Archive completed conversations
- Search across all messages
- Filter by status, date, service type
- Quick reply templates
- AI response suggestions

### Client Profiles

When inquiry converts to booking:
- Client record created automatically
- Project history tracked
- Notes and tags
- Revenue per client
- Communication log

---

# 7. TECHNICAL ARCHITECTURE

## 7.1 Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14+ | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations |
| Zustand | Client state management |
| React Query | Server state management |

### Backend
| Technology | Purpose |
|------------|---------|
| Supabase | PostgreSQL database |
| Supabase Auth | Authentication |
| Supabase Storage | File storage (images, audio) |
| Supabase Realtime | Live updates |
| Edge Functions | Serverless logic |

### Payments
| Technology | Purpose |
|------------|---------|
| Stripe Connect | Engineer payouts |
| Stripe Billing | Subscriptions |
| Stripe Checkout | One-time payments |

### AI
| Technology | Purpose |
|------------|---------|
| Anthropic Claude API | Primary AI provider |
| OpenAI GPT-4 | Fallback provider |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Vercel | Hosting and deployment |
| CloudFlare | CDN and DDoS protection |
| Resend | Transactional email |

## 7.2 File Storage Structure

```
/storage
  /avatars
    /{user_id}/avatar.jpg
  /banners
    /{user_id}/banner.jpg
  /portfolio
    /{user_id}/{project_id}/
      before.mp3
      after.mp3
      cover.jpg
  /products
    /{user_id}/{product_id}/
      preview.mp3
      file.zip
  /credits
    /{user_id}/{credit_id}/logo.png
```

## 7.3 API Structure

### Public API Routes
```
GET  /api/profiles/[username]     — Get public profile
GET  /api/profiles/[username]/portfolio
GET  /api/profiles/[username]/services
GET  /api/profiles/[username]/products
POST /api/inquiries               — Submit inquiry
POST /api/bookings                — Create booking
```

### Protected API Routes
```
GET/PUT  /api/me/profile          — Manage own profile
GET/POST /api/me/portfolio        — Manage portfolio
GET/POST /api/me/services         — Manage services
GET/POST /api/me/products         — Manage products
GET      /api/me/inquiries        — Get inquiries
POST     /api/me/inquiries/[id]/reply
GET      /api/me/analytics        — Get analytics
POST     /api/ai/generate         — AI content generation
POST     /api/ai/chat             — AI chatbot
```

### Webhook Endpoints
```
POST /api/webhooks/stripe         — Stripe events
POST /api/webhooks/calendar       — Calendar sync
```

---

# 8. DATABASE SCHEMA

## 8.1 Core Tables

### users
```sql
id              UUID PRIMARY KEY
email           TEXT UNIQUE NOT NULL
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

### profiles
```sql
id              UUID PRIMARY KEY REFERENCES users(id)
username        TEXT UNIQUE NOT NULL
display_name    TEXT NOT NULL
tagline         TEXT
bio             TEXT
avatar_url      TEXT
banner_url      TEXT
location        TEXT
timezone        TEXT
theme           TEXT DEFAULT 'amber'
is_published    BOOLEAN DEFAULT false
custom_domain   TEXT
social_links    JSONB
seo_meta        JSONB
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

### portfolio_items
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
title           TEXT NOT NULL
description     TEXT
before_url      TEXT
after_url       TEXT
cover_url       TEXT
spotify_url     TEXT
youtube_url     TEXT
artist_name     TEXT
release_date    DATE
genre           TEXT
is_featured     BOOLEAN DEFAULT false
display_order   INTEGER
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### services
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
name            TEXT NOT NULL
description     TEXT
price           DECIMAL(10,2)
price_type      TEXT -- 'fixed', 'starting_at', 'hourly', 'custom'
turnaround_days INTEGER
revisions       INTEGER
features        JSONB
is_active       BOOLEAN DEFAULT true
display_order   INTEGER
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### products
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
name            TEXT NOT NULL
description     TEXT
price           DECIMAL(10,2)
file_url        TEXT
preview_url     TEXT
cover_url       TEXT
category        TEXT
license_type    TEXT
download_count  INTEGER DEFAULT 0
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### credits
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
artist_name     TEXT NOT NULL
project_name    TEXT
logo_url        TEXT
link_url        TEXT
display_order   INTEGER
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### testimonials
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
client_name     TEXT NOT NULL
client_title    TEXT
content         TEXT NOT NULL
rating          INTEGER CHECK (rating >= 1 AND rating <= 5)
is_approved     BOOLEAN DEFAULT false
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### inquiries
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
client_name     TEXT NOT NULL
client_email    TEXT NOT NULL
service_id      UUID REFERENCES services(id)
message         TEXT NOT NULL
reference_links JSONB
status          TEXT DEFAULT 'new' -- 'new', 'read', 'replied', 'converted', 'archived'
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### inquiry_messages
```sql
id              UUID PRIMARY KEY
inquiry_id      UUID REFERENCES inquiries(id)
sender_type     TEXT -- 'client', 'engineer', 'ai'
content         TEXT NOT NULL
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### bookings
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
inquiry_id      UUID REFERENCES inquiries(id)
service_id      UUID REFERENCES services(id)
client_name     TEXT NOT NULL
client_email    TEXT NOT NULL
scheduled_date  DATE
scheduled_time  TIME
status          TEXT DEFAULT 'pending' -- 'pending', 'confirmed', 'completed', 'cancelled'
deposit_amount  DECIMAL(10,2)
deposit_paid    BOOLEAN DEFAULT false
notes           TEXT
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### subscriptions
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
stripe_customer_id      TEXT
stripe_subscription_id  TEXT
plan            TEXT -- 'free', 'pro', 'enterprise'
ai_addon        BOOLEAN DEFAULT false
status          TEXT -- 'active', 'cancelled', 'past_due'
current_period_end      TIMESTAMPTZ
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### ai_settings
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
tone            TEXT DEFAULT 'professional'
chatbot_enabled BOOLEAN DEFAULT false
chatbot_greeting TEXT
custom_qa_pairs JSONB
style_samples   JSONB
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### analytics_events
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
event_type      TEXT -- 'profile_view', 'portfolio_play', 'inquiry_submit', etc.
metadata        JSONB
created_at      TIMESTAMPTZ DEFAULT NOW()
```

---

# 9. SECURITY & COMPLIANCE

## 9.1 Authentication

- Email + password (Supabase Auth)
- Email verification required
- Password strength requirements
- Rate limiting on auth endpoints
- Session management with secure cookies

## 9.2 Authorization

- Row Level Security (RLS) on all tables
- Users can only access their own data
- Public profiles are read-only for visitors
- API routes verify session before access

## 9.3 Data Protection

- All data encrypted at rest (Supabase)
- TLS 1.3 for all connections
- PII handling compliant with GDPR/CCPA
- Data export capability for users
- Account deletion with data removal

## 9.4 Payment Security

- No card data stored (Stripe handles)
- Webhook signature verification
- Idempotency keys for transactions
- Fraud detection via Stripe Radar

---

# 10. DESIGN SYSTEM FOUNDATION

## 10.1 Color Tokens

### Dark Theme (Default)
```css
--bg-base: #0A0A0C
--bg-elevated: #131316
--bg-card: #1A1A1E
--bg-hover: #222226
--border-dark: rgba(255, 255, 255, 0.06)
--border-dark-strong: rgba(255, 255, 255, 0.1)
--text-white: #FAFAFA
--text-gray: #A3A3A3
--text-muted: #737373
```

### Accent Colors (Theme-dependent)
```css
--accent: [theme primary]
--accent-light: [theme light variant]
--accent-dark: [theme dark variant]
--accent-subtle: [theme 10% opacity]
--accent-glow: [theme 40% opacity]
```

## 10.2 Typography

**Font Family:** Plus Jakarta Sans

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 48-72px | 800 | 1.1 |
| H2 | 36-48px | 700 | 1.2 |
| H3 | 24-30px | 600 | 1.3 |
| Body | 16px | 400 | 1.6 |
| Small | 14px | 400 | 1.5 |
| Caption | 12px | 500 | 1.4 |

## 10.3 Spacing Scale

```css
--space-xs: 8px
--space-sm: 12px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px
--space-3xl: 64px
--space-4xl: 96px
```

## 10.4 Border Radius

```css
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px
--radius-full: 9999px
```

## 10.5 Shadows

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.15)
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.2)
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.25)
--shadow-glow: 0 0 40px var(--accent-glow)
```

## 10.6 Component Patterns

### Buttons
- **Primary:** Solid accent color, white text, glow shadow on hover
- **Secondary:** Transparent with border, accent text, fill on hover
- **Ghost:** No border, subtle hover background

### Cards
- **Default:** bg-card, border-dark, rounded-xl
- **Elevated:** bg-elevated, stronger shadow
- **Glass:** Semi-transparent with backdrop blur

### Inputs
- Dark background (bg-elevated)
- Subtle border (border-dark)
- Accent border on focus
- Placeholder in text-muted

---

# 11. IMPLEMENTATION PHASES

## Phase 1: Foundation (Weeks 1-3)
- Project setup (Next.js, Supabase, Tailwind)
- Authentication system
- Database schema and migrations
- File storage configuration
- Base UI component library

## Phase 2: Core Engineer Experience (Weeks 4-7)
- Dashboard layout and navigation
- Profile editor (all sections)
- Portfolio manager with audio upload
- Services manager
- Credits and testimonials

## Phase 3: Public Profile & Discovery (Weeks 8-10)
- Public profile rendering
- Before/after audio player
- Contact form and inquiry submission
- SEO optimization
- Marketing homepage

## Phase 4: Monetization & Booking (Weeks 11-14)
- Stripe integration (Connect + Billing)
- Subscription management
- Booking calendar system
- Digital products marketplace
- Inquiry management system

## Phase 5: AI & Polish (Weeks 15-18)
- AI assistant integration
- Client-facing chatbot
- Analytics dashboard
- Performance optimization
- Launch preparation

---

# 12. SUCCESS METRICS

## 12.1 North Star Metric

**Monthly Active Published Profiles**
- Profiles that are published AND received at least 1 view in the past 30 days

## 12.2 Growth Metrics

| Metric | Month 1 | Month 6 | Year 1 |
|--------|---------|---------|--------|
| Registered Users | 500 | 3,000 | 10,000 |
| Published Profiles | 200 | 2,000 | 6,000 |
| Pro Subscribers | 20 | 200 | 800 |
| AI Add-on Users | 10 | 100 | 400 |

## 12.3 Engagement Metrics

- Average profile completeness: >80%
- Inquiry response rate: <4 hours
- Profile-to-inquiry conversion: >5%
- Monthly active rate: >40%

## 12.4 Revenue Metrics

| Stream | Year 1 ARR |
|--------|------------|
| Pro Subscriptions | $182,400 |
| AI Add-on | $57,600 |
| Transaction Fees | $50,000 |
| **Total** | **$290,000** |

---

# APPENDIX A: GLOSSARY

| Term | Definition |
|------|------------|
| **Profile** | Public portfolio page for an engineer |
| **Portfolio Item** | Single before/after audio or project showcase |
| **Service** | Bookable offering (e.g., "Full Mix") |
| **Product** | Digital downloadable item for sale |
| **Inquiry** | Client message/request |
| **Booking** | Confirmed scheduled session |
| **Credit** | Artist/label logo for social proof |

---

# APPENDIX B: COMPETITOR ANALYSIS

## SoundBetter
- **Strength:** Large marketplace, discovery
- **Weakness:** No personal branding, high fees
- **Our Position:** Own your brand + lower fees

## EngineEars
- **Strength:** Curated quality, trust
- **Weakness:** Exclusive, hard to join
- **Our Position:** Accessible to all + AI tools

## Linktree
- **Strength:** Simple, widely known
- **Weakness:** Generic, no audio features
- **Our Position:** Audio-specific, full platform

---

**END OF MASTER PLATFORM BLUEPRINT**

---

*This document serves as the authoritative reference for MixExperts platform development. All implementation decisions should align with the specifications outlined herein.*
