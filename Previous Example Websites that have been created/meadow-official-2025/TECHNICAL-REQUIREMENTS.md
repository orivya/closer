# Meadow Technical Requirements
**Version:** 1.0 | **Last Updated:** 2025-12-20

---

## Table of Contents
1. [Current Tech Stack Audit](#1-current-tech-stack-audit)
2. [Supabase Integration](#2-supabase-integration)
3. [Authentication System](#3-authentication-system)
4. [Data Models & Schema](#4-data-models--schema)
5. [AI Integration](#5-ai-integration)
6. [Payment Integration](#6-payment-integration)
7. [Analytics & Tracking](#7-analytics--tracking)
8. [Push Notifications](#8-push-notifications)
9. [Export & Data Portability](#9-export--data-portability)
10. [Infrastructure Requirements](#10-infrastructure-requirements)

---

## 1. Current Tech Stack Audit

### Frontend Stack
| Technology | Version | Status | Notes |
|------------|---------|--------|-------|
| React | ^19.2.3 | Current | Via ESM import |
| TypeScript | Implicit | In Use | .tsx files |
| Tailwind CSS | CDN | Active | Via tailwindcss CDN |
| Lucide React | ^0.562.0 | Current | Icon library |
| Recharts | ^3.6.0 | Current | Charts/graphs |
| Vite | Implied | Build tool | From index.html setup |

### Backend Stack
| Technology | Version | Status | Notes |
|------------|---------|--------|-------|
| Supabase | ^2.89.0 | Stubbed | Client created, no active connection |
| Edge Functions | N/A | Planned | Referenced in code |

### Current File Structure
```
Meadow_Website_Official/
├── index.html          # Entry point with Tailwind config
├── index.tsx           # React root
├── index.css           # Global styles
├── App.tsx             # Main app component
├── types.ts            # TypeScript definitions
├── components/
│   ├── Layout.tsx
│   └── Sidebar.tsx
├── views/
│   ├── LandingPage.tsx
│   ├── Onboarding.tsx
│   ├── Home.tsx
│   ├── Journal.tsx
│   ├── Editor.tsx
│   ├── Explore.tsx
│   ├── Insights.tsx
│   ├── Settings.tsx
│   └── spaces/
│       ├── Mirror.tsx
│       ├── TimeVault.tsx
│       ├── Intentions.tsx
│       └── [others stubbed]
├── services/
│   ├── journal.ts      # Entry CRUD (mock + Supabase)
│   └── ai.ts           # AI functions (stubbed)
├── lib/
│   └── supabase.ts     # Supabase client
└── data/
    └── content.ts      # Static content (journeys, prompts)
```

### What's Connected vs Stubbed

#### Connected (Partially)
- Supabase client initialization (with fallback)
- Basic entry CRUD with mock fallback
- Auth getUser stub

#### Stubbed / Not Implemented
- Actual Supabase database connection
- Email verification
- Real authentication flow
- AI analysis functions
- Voice transcription
- Storage for images/audio
- Edge functions
- Payment processing
- Push notifications
- Analytics

---

## 2. Supabase Integration

### Current State
- Client initialization in `lib/supabase.ts`
- Fallback mock client when env vars missing
- Basic entry service in `services/journal.ts`

### Required Supabase Setup

#### Project Configuration
```env
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
```

#### Required Extensions
```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable vector for AI embeddings (future)
CREATE EXTENSION IF NOT EXISTS "vector";
```

#### Storage Buckets Needed
| Bucket | Purpose | Access |
|--------|---------|--------|
| `avatars` | User profile photos | Authenticated read/write |
| `voice-memos` | Voice recordings | Authenticated only |
| `entry-images` | Journal images | Authenticated only |
| `exports` | Data exports | Authenticated only |

#### Edge Functions Needed
| Function | Purpose | Priority |
|----------|---------|----------|
| `transcribe` | Whisper API for voice-to-text | High |
| `analyze-entry` | OpenAI for insights/sentiment | High |
| `generate-reflection` | AI for Mirror feature | High |
| `send-notification` | Push notification dispatch | High |
| `export-data` | PDF/JSON export generation | Medium |
| `stripe-webhook` | Payment event handling | High |

---

## 3. Authentication System

### Current State
- Basic email/password form in Onboarding
- No actual auth integration
- Mock user in Supabase fallback

### Required Auth Features

#### Core Authentication
| Feature | Priority | Implementation |
|---------|----------|----------------|
| Email/Password signup | Critical | Supabase Auth |
| Email/Password login | Critical | Supabase Auth |
| Email verification | Critical | Supabase Auth + custom email |
| Password reset | Critical | Supabase Auth |
| Social login (Google) | High | Supabase OAuth |
| Social login (Apple) | High | Supabase OAuth |
| Session management | High | Supabase Auth |
| Logout | Critical | Supabase Auth |

#### Security Features
| Feature | Priority | Implementation |
|---------|----------|----------------|
| Two-factor auth | Medium | Supabase Auth + TOTP |
| App lock (PIN) | High | Local storage + bcrypt |
| Biometric unlock | Medium | WebAuthn API |
| Session timeout | Medium | Custom logic |
| Rate limiting | High | Supabase Edge |

### Auth Flow Implementation

#### Signup Flow
```
1. Email + Password input
2. Client-side validation
3. supabase.auth.signUp({ email, password })
4. Email verification sent
5. User clicks link
6. Redirect to app
7. Complete onboarding (name, intent)
8. Save profile to 'profiles' table
```

#### Login Flow
```
1. Email + Password input
2. supabase.auth.signInWithPassword({ email, password })
3. Check if email verified
4. If not verified, show resend option
5. On success, redirect to Home
6. Fetch user profile
```

#### Social Auth Flow
```
1. Click "Sign in with Google"
2. supabase.auth.signInWithOAuth({ provider: 'google' })
3. Redirect to Google
4. Return with tokens
5. Check if new user
6. If new, go to onboarding
7. If existing, go to Home
```

---

## 4. Data Models & Schema

### Database Schema

#### Users & Profiles
```sql
-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  intent TEXT, -- clarity, growth, memory, anxiety
  timezone TEXT DEFAULT 'UTC',
  notification_time TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free', -- free, premium
  subscription_expires_at TIMESTAMPTZ,
  streak_count INT DEFAULT 0,
  streak_last_date DATE,
  total_entries INT DEFAULT 0,
  total_words INT DEFAULT 0
);

-- RLS Policy
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

#### Entries
```sql
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text', -- text, voice, image
  mood TEXT, -- radiant, content, steady, cloudy, low
  mood_score INT, -- 1-5
  word_count INT,
  tags TEXT[],
  thread_id UUID REFERENCES threads(id) ON DELETE SET NULL,
  intention_id UUID REFERENCES intentions(id) ON DELETE SET NULL,
  journey_id UUID,
  session_number INT,
  prompt_id TEXT,
  sentiment_score FLOAT,
  ai_analysis JSONB,
  is_draft BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- For full-text search
  search_vector TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B')
  ) STORED
);

-- Indexes
CREATE INDEX entries_user_id_idx ON entries(user_id);
CREATE INDEX entries_created_at_idx ON entries(created_at DESC);
CREATE INDEX entries_thread_id_idx ON entries(thread_id);
CREATE INDEX entries_search_idx ON entries USING GIN(search_vector);

-- RLS
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own entries" ON entries
  FOR ALL USING (auth.uid() = user_id);
```

#### Threads
```sql
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  entry_count INT DEFAULT 0,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own threads" ON threads
  FOR ALL USING (auth.uid() = user_id);
```

#### Intentions
```sql
CREATE TABLE intentions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- finance, relationships, career, health, etc.
  color TEXT,
  is_primary BOOLEAN DEFAULT false,
  entry_count INT DEFAULT 0,
  progress_score INT DEFAULT 0, -- 0-100
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Time Capsules (Vault)
```sql
CREATE TABLE time_capsules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  unlock_date DATE NOT NULL,
  is_unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Moods
```sql
CREATE TABLE mood_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood TEXT NOT NULL,
  mood_score INT NOT NULL,
  note TEXT,
  entry_id UUID REFERENCES entries(id) ON DELETE SET NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Journey Progress
```sql
CREATE TABLE journey_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  journey_id TEXT NOT NULL, -- References static journey data
  current_day INT DEFAULT 1,
  is_completed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  entries UUID[] -- Array of entry IDs for each day
);
```

#### AI Reflections
```sql
CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- correlation, connection, pattern, insight
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  context TEXT,
  source_entries UUID[],
  is_saved BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Data Relationships
```
User (profiles)
├── Entries (many)
│   ├── Thread (optional, many-to-one)
│   ├── Intention (optional, many-to-one)
│   └── Mood Log (one-to-one)
├── Threads (many)
├── Intentions (many)
├── Time Capsules (many)
├── Journey Progress (many)
└── Reflections (many)
```

---

## 5. AI Integration

### Required AI Features

| Feature | AI Model | Priority | Use Case |
|---------|----------|----------|----------|
| Entry Analysis | GPT-4o-mini | High | Sentiment, tags, mood detection |
| Reflection Generation | GPT-4o | High | Mirror feature |
| Pattern Detection | GPT-4o | Medium | Insights correlations |
| Prompt Personalization | GPT-4o-mini | Medium | Intent-based prompts |
| Voice Transcription | Whisper | High | Voice memos |
| Thread Suggestions | GPT-4o-mini | Low | Auto-thread assignment |

### AI Service Architecture

#### Entry Analysis (Edge Function)
```typescript
// supabase/functions/analyze-entry/index.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') });

export async function analyzeEntry(content: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a journal analyst. Analyze the following journal entry and return JSON with:
        - sentiment: float from -1 (negative) to 1 (positive)
        - mood: one of [radiant, content, steady, cloudy, low]
        - tags: array of 2-5 relevant tags
        - themes: array of major themes discussed
        - insight: one brief observation about the entry`
      },
      { role: 'user', content }
    ],
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content);
}
```

#### Reflection Generation Prompt
```typescript
const MIRROR_PROMPT = `You are a thoughtful journal companion. Based on the user's recent entries:

1. Identify a meaningful pattern, correlation, or connection
2. Frame it as a gentle question or observation
3. Provide context for why this might matter
4. Suggest a journaling action

Be insightful but not prescriptive. Speak to the person's experience with empathy.

Recent entries:
{entries}

Return JSON with:
- type: correlation | connection | pattern | question
- title: short headline (5-8 words)
- text: main reflection (1-2 sentences)
- context: why this matters (1-2 sentences)
- action: suggested writing prompt`;
```

### AI Cost Estimates
| Feature | Model | Est. Tokens/Use | Cost/Use | Monthly (1000 users) |
|---------|-------|-----------------|----------|----------------------|
| Entry Analysis | GPT-4o-mini | 500 | $0.0003 | $9/mo (30 entries/user) |
| Reflection | GPT-4o | 2000 | $0.01 | $70/mo (weekly) |
| Transcription | Whisper | 1 min audio | $0.006 | $60/mo (10 voice/user) |

---

## 6. Payment Integration

### Stripe Integration Requirements

#### Products & Prices
```javascript
// Stripe Dashboard Setup
Products:
1. Meadow Free - $0/mo
2. Meadow Premium - $7.99/mo OR $59.99/year
3. Meadow Premium+ - $12.99/mo OR $99.99/year (future)

Price IDs (example):
price_premium_monthly: price_xxx
price_premium_yearly: price_yyy
```

#### Database Updates
```sql
-- Add to profiles table
ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN subscription_status TEXT; -- active, canceled, past_due

-- Subscription history
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT, -- created, updated, canceled, renewed
  stripe_event_id TEXT,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Edge Functions Needed
```typescript
// 1. create-checkout-session
// Creates Stripe Checkout session

// 2. create-portal-session
// Creates Customer Portal for subscription management

// 3. stripe-webhook
// Handles Stripe events (subscription created, updated, canceled)
```

#### Webhook Events to Handle
| Event | Action |
|-------|--------|
| `checkout.session.completed` | Upgrade user to premium |
| `customer.subscription.updated` | Sync subscription status |
| `customer.subscription.deleted` | Downgrade to free |
| `invoice.payment_failed` | Mark as past_due, send email |

---

## 7. Analytics & Tracking

### Key Metrics to Track

#### User Metrics
| Metric | Description | Implementation |
|--------|-------------|----------------|
| DAU/MAU | Daily/Monthly active users | Supabase + custom |
| Retention (D1, D7, D30) | User return rate | Custom calculation |
| Activation rate | Completed onboarding | Event tracking |
| Entry frequency | Entries per user per week | Database query |

#### Feature Metrics
| Metric | Description |
|--------|-------------|
| Feature adoption | % using each feature |
| Entry completion rate | Started vs saved entries |
| Journey completion rate | Started vs finished |
| Premium conversion rate | Free to paid |
| Churn rate | Premium cancellations |

### Analytics Implementation Options

#### Option A: Supabase + PostHog
- PostHog for product analytics
- Supabase for database metrics
- Free tier: 1M events/month

#### Option B: Supabase + Mixpanel
- Mixpanel for user analytics
- Supabase for database
- More expensive but powerful

#### Option C: Custom + Supabase
- Build custom analytics table
- Use Supabase queries
- Most control, more work

### Recommended: PostHog Implementation
```typescript
// lib/analytics.ts
import posthog from 'posthog-js';

export const analytics = {
  identify: (userId: string, traits: object) => {
    posthog.identify(userId, traits);
  },

  track: (event: string, properties?: object) => {
    posthog.capture(event, properties);
  },

  page: (name: string) => {
    posthog.capture('$pageview', { page: name });
  }
};

// Events to track
analytics.track('entry_created', { word_count, mood, has_thread });
analytics.track('journey_started', { journey_id });
analytics.track('premium_viewed');
analytics.track('premium_purchased', { plan, price });
```

---

## 8. Push Notifications

### Implementation Options

#### Option A: Supabase + OneSignal
- OneSignal for push delivery
- Supabase for scheduling/triggers
- Best free tier

#### Option B: Firebase Cloud Messaging
- Native web push
- More setup required
- Google ecosystem

#### Option C: Web Push API + Supabase
- Native browser push
- Full control
- Most complex

### Recommended: OneSignal + Supabase

#### Setup Requirements
1. OneSignal account
2. Web push configuration
3. Service worker registration
4. Supabase Edge Function for triggers

#### Notification Types
| Type | Trigger | Message |
|------|---------|---------|
| Daily Reminder | Scheduled (user's time) | "Time for your daily reflection" |
| Streak Warning | No entry today, streak > 3 | "Don't break your 7-day streak!" |
| Capsule Unlocked | unlock_date reached | "A message from your past awaits" |
| Weekly Digest | Sunday | "Your weekly reflection is ready" |
| New Insight | Reflection generated | "Meadow noticed something" |
| Re-engagement | 3+ days inactive | "Your journal misses you" |

#### Database Schema
```sql
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  daily_reminder_enabled BOOLEAN DEFAULT true,
  daily_reminder_time TIME DEFAULT '20:00',
  streak_warnings BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT true,
  insight_alerts BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  onesignal_player_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 9. Export & Data Portability

### Required Export Features (GDPR)

| Feature | Format | Priority |
|---------|--------|----------|
| Export all entries | JSON | Critical |
| Export all entries | Markdown | High |
| Export all entries | PDF | Medium |
| Download personal data | JSON | Critical |
| Delete all data | N/A | Critical |

### Export Implementation

#### JSON Export
```typescript
// Edge Function: export-data
export async function exportUserData(userId: string) {
  const data = {
    profile: await supabase.from('profiles').select('*').eq('id', userId).single(),
    entries: await supabase.from('entries').select('*').eq('user_id', userId),
    threads: await supabase.from('threads').select('*').eq('user_id', userId),
    intentions: await supabase.from('intentions').select('*').eq('user_id', userId),
    time_capsules: await supabase.from('time_capsules').select('*').eq('user_id', userId),
    mood_logs: await supabase.from('mood_logs').select('*').eq('user_id', userId),
    exported_at: new Date().toISOString()
  };

  return JSON.stringify(data, null, 2);
}
```

#### PDF Export
```typescript
// Use puppeteer or @react-pdf/renderer
// Generate PDF with styled entries
// Include: title, date, content, mood, tags
```

#### Account Deletion
```typescript
// Edge Function: delete-account
export async function deleteUserAccount(userId: string) {
  // 1. Delete from all tables (CASCADE handles most)
  await supabase.from('profiles').delete().eq('id', userId);

  // 2. Delete storage files
  await supabase.storage.from('avatars').remove([`${userId}/*`]);
  await supabase.storage.from('voice-memos').remove([`${userId}/*`]);

  // 3. Delete auth user
  await supabase.auth.admin.deleteUser(userId);

  // 4. Cancel Stripe subscription if exists
  // ...
}
```

---

## 10. Infrastructure Requirements

### Supabase Plan Recommendation

#### For MVP/Beta (Free Tier)
- 500MB database
- 1GB storage
- 2GB bandwidth
- 50,000 monthly active users
- **Cost: $0/month**

#### For Launch (Pro)
- 8GB database
- 100GB storage
- 250GB bandwidth
- Unlimited users
- Daily backups
- **Cost: $25/month**

#### For Scale
- Larger database
- More storage
- Custom domains
- SLA
- **Cost: $599+/month**

### Third-Party Services Budget

| Service | Purpose | Free Tier | Paid Tier |
|---------|---------|-----------|-----------|
| OpenAI | AI features | N/A | ~$50-200/mo |
| Stripe | Payments | Free | 2.9% + 30¢/tx |
| OneSignal | Push | 10K users | $9/mo+ |
| PostHog | Analytics | 1M events | $0+ |
| Sentry | Error tracking | 5K events | $26/mo |
| Resend/SendGrid | Email | 100/day | $15/mo |

### Estimated Monthly Costs

| Stage | Users | Est. Cost |
|-------|-------|-----------|
| Beta | 100 | $0-50 |
| Launch | 1,000 | $100-200 |
| Growth | 10,000 | $500-1,000 |
| Scale | 100,000 | $5,000+ |

### Performance Requirements

| Metric | Target |
|--------|--------|
| Page load | < 3s |
| API response | < 500ms |
| Entry save | < 1s |
| Search | < 2s |
| Uptime | 99.9% |

### Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| HTTPS | Enforced (Supabase default) |
| Data encryption at rest | Supabase default |
| Row-level security | Supabase RLS policies |
| API rate limiting | Supabase + Edge Functions |
| Input sanitization | Client + Server |
| CORS | Configured per environment |
| CSP headers | Content Security Policy |

---

## Implementation Priority

### Phase 1: Foundation (Weeks 1-2)
1. Supabase project setup
2. Database schema creation
3. Auth implementation
4. Basic CRUD for entries

### Phase 2: Core Features (Weeks 3-4)
1. Entry service completion
2. Thread/tag implementation
3. Basic insights queries
4. Search functionality

### Phase 3: AI Integration (Weeks 5-6)
1. OpenAI Edge Functions
2. Entry analysis
3. Reflection generation
4. Whisper transcription

### Phase 4: Monetization (Weeks 7-8)
1. Stripe integration
2. Premium feature gating
3. Subscription management
4. Webhook handling

### Phase 5: Polish (Weeks 9-10)
1. Push notifications
2. Email system
3. Export features
4. Analytics integration
