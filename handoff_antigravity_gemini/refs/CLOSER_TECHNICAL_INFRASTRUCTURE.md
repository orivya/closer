# CLOSER — Technical Infrastructure Specification
## Database Schema, API Endpoints & Backend Requirements

---

# Table of Contents

1. [Technology Stack](#technology-stack)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Real-Time Features](#real-time-features)
5. [Authentication & Authorization](#authentication--authorization)
6. [File Storage](#file-storage)
7. [Payment Integration](#payment-integration)
8. [Notification System](#notification-system)
9. [Background Jobs](#background-jobs)
10. [Caching Strategy](#caching-strategy)
11. [Security Measures](#security-measures)
12. [Environment Configuration](#environment-configuration)
13. [Deployment Architecture](#deployment-architecture)
14. [Monitoring & Logging](#monitoring--logging)

---

# 1. Technology Stack

## Frontend
| Component | Technology |
|-----------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State | React Context + Zustand |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Date/Time | date-fns + date-fns-tz |

## Backend
| Component | Technology |
|-----------|------------|
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Real-time | Supabase Realtime |
| Edge Functions | Supabase Edge Functions (Deno) |
| Hosting | Vercel |

## External Services
| Service | Purpose |
|---------|---------|
| Stripe | Payments & subscriptions |
| Resend | Transactional email |
| OneSignal | Push notifications |
| Sentry | Error tracking |
| PostHog | Analytics |
| Lottie | Gift animations |

---

# 2. Database Schema

## 2.1 Users & Authentication

### `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ,
  is_online BOOLEAN DEFAULT FALSE,
  notification_settings JSONB DEFAULT '{
    "push_enabled": true,
    "email_enabled": true,
    "quiet_hours_start": null,
    "quiet_hours_end": null
  }',
  privacy_settings JSONB DEFAULT '{
    "show_online_status": true,
    "show_typing_indicator": true,
    "show_read_receipts": true
  }',
  theme_id TEXT DEFAULT 'default',
  theme_overrides JSONB DEFAULT '{}' -- for premium custom themes (optional)
);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_last_seen ON profiles(last_seen_at);
```

### `couples`
```sql
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  invite_code TEXT UNIQUE,
  invite_code_expires_at TIMESTAMPTZ,
  anniversary_date DATE,
  next_visit_date DATE,
  linked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'unlinked')),

  CONSTRAINT unique_couple UNIQUE (user1_id, user2_id)
);

-- Indexes
CREATE INDEX idx_couples_user1 ON couples(user1_id);
CREATE INDEX idx_couples_user2 ON couples(user2_id);
CREATE INDEX idx_couples_invite_code ON couples(invite_code);
CREATE INDEX idx_couples_status ON couples(status);
```

## 2.2 Subscriptions

### `subscriptions`
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'closer_plus', 'closer_pro')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

### Couple-Shared Entitlements (V1)

Subscription benefits are **shared across the couple**: if either partner is subscribed, both get premium features.

Define an effective tier for a couple:
- `effective_tier = max(user1_tier, user2_tier)` where `closer_pro > closer_plus > free`
- Treat `status IN ('active','trialing')` as eligible
- Optional: short grace period for `past_due`

Implementation options:
1. Compute at read time by joining `couples` → both users’ `subscriptions`
2. Cache on `couples` (ex: `effective_tier` + `effective_tier_updated_at`) updated via Stripe webhooks + couple link events

**Free trial (7 days of Closer+)**
- Can be implemented as `subscriptions.status='trialing'` with `trial_end` set, without requiring a Stripe payment method until checkout.

### `purchases`
```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_id TEXT,
  item_type TEXT NOT NULL CHECK (item_type IN ('gift', 'gift_bundle', 'theme')),
  item_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_purchases_item ON purchases(item_type, item_id);
```

## 2.3 Messaging

### `messages`
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'whisper', 'voice', 'photo', 'gif', 'gift', 'system')),
  media_url TEXT,
  media_duration INTEGER, -- for voice notes, in seconds
  is_whisper_revealed BOOLEAN DEFAULT FALSE,
  gift_id TEXT, -- for gift messages
  reply_to_id UUID REFERENCES messages(id),
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_couple ON messages(couple_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_type ON messages(message_type);
```

### `message_reads`
```sql
CREATE TABLE message_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_read UNIQUE (message_id, user_id)
);

-- Indexes
CREATE INDEX idx_message_reads_message ON message_reads(message_id);
CREATE INDEX idx_message_reads_user ON message_reads(user_id);
```

### `message_reactions`
```sql
CREATE TABLE message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_reaction UNIQUE (message_id, user_id, reaction)
);

-- Indexes
CREATE INDEX idx_message_reactions_message ON message_reactions(message_id);
```

## 2.4 Games & Activities

### `card_categories`
```sql
CREATE TABLE card_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `cards`
```sql
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES card_categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cards_category ON cards(category_id);
CREATE INDEX idx_cards_active ON cards(is_active);
```

### `card_sessions`
```sql
CREATE TABLE card_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  mode TEXT DEFAULT 'together' CHECK (mode IN ('together', 'async')),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'skipped')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_card_sessions_couple ON card_sessions(couple_id);
CREATE INDEX idx_card_sessions_status ON card_sessions(status);
CREATE INDEX idx_card_sessions_created ON card_sessions(created_at DESC);
```

### `card_answers`
```sql
CREATE TABLE card_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES card_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_answer UNIQUE (session_id, user_id)
);

-- Indexes
CREATE INDEX idx_card_answers_session ON card_answers(session_id);
CREATE INDEX idx_card_answers_user ON card_answers(user_id);
```

### `hot_takes_topics`
```sql
CREATE TABLE hot_takes_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  statement TEXT NOT NULL,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `hot_takes_sessions`
```sql
CREATE TABLE hot_takes_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES hot_takes_topics(id) ON DELETE CASCADE,
  user1_vote TEXT CHECK (user1_vote IN ('agree', 'disagree')),
  user2_vote TEXT CHECK (user2_vote IN ('agree', 'disagree')),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_hot_takes_couple ON hot_takes_sessions(couple_id);
CREATE INDEX idx_hot_takes_status ON hot_takes_sessions(status);
```

### `would_you_rather_options`
```sql
CREATE TABLE would_you_rather_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `would_you_rather_sessions`
```sql
CREATE TABLE would_you_rather_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  options_id UUID NOT NULL REFERENCES would_you_rather_options(id) ON DELETE CASCADE,
  user1_choice TEXT CHECK (user1_choice IN ('a', 'b')),
  user2_choice TEXT CHECK (user2_choice IN ('a', 'b')),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_wyr_couple ON would_you_rather_sessions(couple_id);
```

### `time_capsules`
```sql
CREATE TABLE time_capsules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  message TEXT NOT NULL,
  media_urls JSONB DEFAULT '[]',
  opens_at TIMESTAMPTZ NOT NULL,
  sealed_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  status TEXT DEFAULT 'sealed' CHECK (status IN ('sealed', 'ready', 'opened')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_time_capsules_couple ON time_capsules(couple_id);
CREATE INDEX idx_time_capsules_opens_at ON time_capsules(opens_at);
CREATE INDEX idx_time_capsules_status ON time_capsules(status);
```

### `dreams`
```sql
CREATE TABLE dreams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  target_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_dreams_couple ON dreams(couple_id);
CREATE INDEX idx_dreams_status ON dreams(status);
```

### `dream_milestones`
```sql
CREATE TABLE dream_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dream_id UUID NOT NULL REFERENCES dreams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_milestones_dream ON dream_milestones(dream_id);
CREATE INDEX idx_milestones_completed ON dream_milestones(is_completed);
```

### `rituals`
```sql
CREATE TABLE rituals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ritual_type TEXT NOT NULL CHECK (ritual_type IN ('morning', 'gratitude', 'goodnight', 'thinking_of_you', 'weekly_checkin')),
  content TEXT,
  media_url TEXT,
  ritual_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_ritual_per_day UNIQUE (couple_id, user_id, ritual_type, ritual_date)
);

-- Indexes
CREATE INDEX idx_rituals_couple ON rituals(couple_id);
CREATE INDEX idx_rituals_type ON rituals(ritual_type);
CREATE INDEX idx_rituals_date ON rituals(ritual_date DESC);
```

## 2.5 Moments & Memories

### `moments`
```sql
CREATE TABLE moments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  moment_type TEXT NOT NULL CHECK (moment_type IN ('photo', 'song', 'quote', 'milestone', 'capsule', 'dream', 'card_session')),
  title TEXT,
  caption TEXT,
  media_url TEXT,
  metadata JSONB DEFAULT '{}', -- song info, card session data, etc.
  moment_date DATE DEFAULT CURRENT_DATE,
  is_auto_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_moments_couple ON moments(couple_id);
CREATE INDEX idx_moments_type ON moments(moment_type);
CREATE INDEX idx_moments_date ON moments(moment_date DESC);
CREATE INDEX idx_moments_created ON moments(created_at DESC);
```

## 2.6 Gifts

### `virtual_gifts`
```sql
CREATE TABLE virtual_gifts (
  id TEXT PRIMARY KEY, -- e.g., 'heart', 'fireworks', 'aurora_hearts'
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('free', 'premium', 'purchasable', 'seasonal')),
  price_cents INTEGER, -- null for free/premium
  animation_url TEXT,
  preview_url TEXT,
  available_from DATE, -- for seasonal
  available_until DATE, -- for seasonal
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `sent_gifts`
```sql
CREATE TABLE sent_gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  gift_id TEXT NOT NULL REFERENCES virtual_gifts(id),
  message TEXT,
  is_opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMPTZ,
  reaction TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sent_gifts_couple ON sent_gifts(couple_id);
CREATE INDEX idx_sent_gifts_recipient ON sent_gifts(recipient_id);
CREATE INDEX idx_sent_gifts_created ON sent_gifts(created_at DESC);
```

### `gift_bundles` (optional but recommended for V1 bundles)
```sql
CREATE TABLE gift_bundles (
  id TEXT PRIMARY KEY, -- e.g., 'starter_pack', 'romance_pack'
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `gift_bundle_items`
```sql
CREATE TABLE gift_bundle_items (
  bundle_id TEXT NOT NULL REFERENCES gift_bundles(id) ON DELETE CASCADE,
  gift_id TEXT NOT NULL REFERENCES virtual_gifts(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (bundle_id, gift_id)
);
```

### `gift_entitlements` (for bundle “pre-paid sends”)
```sql
CREATE TABLE gift_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  gift_id TEXT NOT NULL REFERENCES virtual_gifts(id),
  remaining_uses INTEGER NOT NULL DEFAULT 0,
  source_purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT gift_entitlements_remaining_nonneg CHECK (remaining_uses >= 0)
);

CREATE INDEX idx_gift_entitlements_couple ON gift_entitlements(couple_id);
CREATE INDEX idx_gift_entitlements_gift ON gift_entitlements(gift_id);
```

## 2.7 Streaks & Achievements

### `streaks`
```sql
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  freeze_used_this_week BOOLEAN DEFAULT FALSE,
  freeze_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_streaks_couple ON streaks(couple_id);
CREATE INDEX idx_streaks_last_activity ON streaks(last_activity_date);
```

### `streak_history`
```sql
CREATE TABLE streak_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_date DATE DEFAULT CURRENT_DATE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_streak_history_couple_date ON streak_history(couple_id, activity_date);
```

### `achievements`
```sql
CREATE TABLE achievements (
  id TEXT PRIMARY KEY, -- e.g., 'first_words', 'streak_7'
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  category TEXT NOT NULL CHECK (category IN ('conversation', 'games', 'rituals', 'moments', 'streaks', 'gifts', 'special')),
  unlock_criteria JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `user_achievements`
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_achievement UNIQUE (user_id, achievement_id)
);

-- Indexes
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_unlocked ON user_achievements(unlocked_at DESC);
```

## 2.8 Notifications

### `notifications`
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

### `push_tokens`
```sql
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('web', 'ios', 'android')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_push_tokens_user ON push_tokens(user_id);
CREATE INDEX idx_push_tokens_active ON push_tokens(user_id) WHERE is_active = TRUE;
```

## 2.9 Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- ... etc for all tables

-- Example policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Example policies for messages (user can see messages in their couple)
CREATE POLICY "Users can view messages in their couple"
  ON messages FOR SELECT
  USING (
    couple_id IN (
      SELECT id FROM couples
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their couple"
  ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    couple_id IN (
      SELECT id FROM couples
      WHERE (user1_id = auth.uid() OR user2_id = auth.uid()) AND status = 'active'
    )
  );

-- Similar policies needed for all tables
```

---

# 3. API Endpoints

## 3.1 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/logout` | Logout current session |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |
| POST | `/auth/verify-email` | Verify email address |
| GET | `/auth/session` | Get current session |
| POST | `/auth/refresh` | Refresh access token |

## 3.2 Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get current user's profile |
| PATCH | `/profile` | Update profile |
| POST | `/profile/avatar` | Upload avatar |
| DELETE | `/profile/avatar` | Remove avatar |
| GET | `/profile/partner` | Get partner's profile |
| PATCH | `/profile/settings` | Update notification/privacy settings |

## 3.3 Couple

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/couple` | Get couple data |
| POST | `/couple/invite` | Generate invite code |
| POST | `/couple/join` | Join with invite code |
| PATCH | `/couple` | Update couple info (anniversary, etc.) |
| POST | `/couple/unlink` | Unlink from partner |

## 3.4 Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/messages` | Get messages (paginated) |
| POST | `/messages` | Send message |
| PATCH | `/messages/:id` | Edit message |
| DELETE | `/messages/:id` | Delete message |
| POST | `/messages/:id/read` | Mark as read |
| POST | `/messages/:id/reveal` | Reveal whisper |
| POST | `/messages/:id/react` | Add reaction |
| DELETE | `/messages/:id/react` | Remove reaction |

## 3.5 Cards / Intimacy Deck

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cards/categories` | Get all categories |
| GET | `/cards/categories/:slug` | Get category with cards |
| POST | `/cards/draw` | Draw a card |
| POST | `/cards/sessions/:id/answer` | Submit answer |
| GET | `/cards/sessions/:id` | Get session with answers |
| POST | `/cards/sessions/:id/skip` | Skip current card |
| GET | `/cards/history` | Get card history |
| GET | `/cards/favorites` | Get favorited cards |
| POST | `/cards/:id/favorite` | Favorite a card |

## 3.6 Hot Takes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hot-takes/categories` | Get topic categories |
| POST | `/hot-takes/start` | Start new session |
| POST | `/hot-takes/sessions/:id/vote` | Submit vote |
| GET | `/hot-takes/sessions/:id` | Get session result |
| GET | `/hot-takes/history` | Get past sessions |

## 3.7 Would You Rather

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wyr/categories` | Get categories |
| POST | `/wyr/start` | Start new session |
| POST | `/wyr/sessions/:id/choose` | Submit choice |
| GET | `/wyr/sessions/:id` | Get session result |
| GET | `/wyr/history` | Get past sessions |

## 3.8 Time Capsules

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/capsules` | Get all capsules |
| POST | `/capsules` | Create capsule |
| GET | `/capsules/:id` | Get capsule detail |
| POST | `/capsules/:id/open` | Open ready capsule |
| DELETE | `/capsules/:id` | Delete unopened capsule |

## 3.9 Dreams

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dreams` | Get all dreams |
| POST | `/dreams` | Create dream |
| GET | `/dreams/:id` | Get dream detail |
| PATCH | `/dreams/:id` | Update dream |
| DELETE | `/dreams/:id` | Delete dream |
| POST | `/dreams/:id/milestones` | Add milestone |
| PATCH | `/dreams/:id/milestones/:mid` | Update milestone |
| DELETE | `/dreams/:id/milestones/:mid` | Delete milestone |
| POST | `/dreams/:id/complete` | Mark dream complete |

## 3.10 Rituals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rituals/today` | Get today's ritual status |
| POST | `/rituals` | Complete a ritual |
| GET | `/rituals/history` | Get ritual history |
| GET | `/rituals/gratitude/reveal` | Get gratitude reveal |

## 3.11 Moments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/moments` | Get moments (paginated, filterable) |
| POST | `/moments` | Create moment |
| GET | `/moments/:id` | Get moment detail |
| PATCH | `/moments/:id` | Update moment |
| DELETE | `/moments/:id` | Delete moment |
| GET | `/moments/calendar` | Get moments by date range |

## 3.12 Gifts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gifts` | Get available gifts |
| GET | `/gifts/:id` | Get gift detail |
| GET | `/gifts/bundles` | Get available gift bundles |
| POST | `/gifts/send` | Send gift |
| GET | `/gifts/received` | Get received gifts |
| GET | `/gifts/sent` | Get sent gifts |
| POST | `/gifts/:id/open` | Open received gift |
| POST | `/gifts/:id/react` | React to gift |

## 3.13 Subscriptions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/subscription` | Get current subscription |
| POST | `/subscription/checkout` | Create checkout session |
| POST | `/subscription/portal` | Create billing portal session |
| POST | `/subscription/cancel` | Cancel subscription |
| POST | `/webhooks/stripe` | Stripe webhook handler |

## 3.14 Streaks & Achievements

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/streak` | Get current streak |
| POST | `/streak/freeze` | Use streak freeze |
| GET | `/achievements` | Get all achievements |
| GET | `/achievements/unlocked` | Get user's unlocked achievements |

## 3.15 Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | Get notifications (paginated) |
| POST | `/notifications/:id/read` | Mark as read |
| POST | `/notifications/read-all` | Mark all as read |
| POST | `/push-tokens` | Register push token |
| DELETE | `/push-tokens/:id` | Remove push token |

## 3.16 Themes & Preferences

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/themes` | Get available themes/theme packs |
| GET | `/themes/owned` | Get themes owned by user (purchases) |
| POST | `/themes/apply` | Apply theme (updates `profiles.theme_id` / `profiles.theme_overrides`) |

## 3.17 Data Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/data/export` | Request export generation |
| GET | `/data/export` | Get latest export status + download link (if ready) |

---

# 4. Real-Time Features

## 4.1 Supabase Realtime Channels

### Presence Channel (Partner Status)
```typescript
// Channel: `presence:couple:${coupleId}`
type PresenceState = {
  online_at: string;
  user_id: string;
  is_typing: boolean;
};
```

### Messages Channel
```typescript
// Channel: `messages:couple:${coupleId}`
// Subscribe to: INSERT, UPDATE, DELETE on messages table
```

### Game Sessions Channel
```typescript
// Channel: `game:${sessionId}`
// Events:
// - partner_joined
// - answer_submitted
// - reveal_ready
// - session_completed
```

## 4.2 Real-Time Implementation

```typescript
// Example: Presence tracking
const presenceChannel = supabase.channel(`presence:couple:${coupleId}`);

presenceChannel
  .on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState();
    // Update partner online status
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    // Partner came online
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    // Partner went offline
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await presenceChannel.track({
        online_at: new Date().toISOString(),
        user_id: currentUser.id,
        is_typing: false,
      });
    }
  });
```

---

# 5. Authentication & Authorization

## 5.1 Auth Flow

1. **Signup**: Email/password → Supabase Auth → Create profile
2. **Login**: Email/password → Supabase Auth → Return session
3. **OAuth**: Google/Apple → Supabase Auth → Create/link profile
4. **Session**: JWT stored in httpOnly cookie (web) or secure storage (mobile)

## 5.2 Authorization Levels

| Level | Description |
|-------|-------------|
| Public | Landing page, legal pages |
| Authenticated | Logged in, may or may not have partner |
| Coupled | Has active partner connection |
| Subscriber | Closer+ or Pro subscription |

## 5.3 Middleware Example

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  const pathname = request.nextUrl.pathname;

  const isPublic =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/verify-email' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname.startsWith('/join/') ||
    pathname === '/features' ||
    pathname === '/pricing' ||
    pathname === '/about' ||
    pathname === '/404' ||
    pathname === '/500' ||
    pathname === '/maintenance' ||
    pathname === '/offline' ||
    pathname === '/us/terms' ||
    pathname === '/us/privacy-policy' ||
    pathname === '/us/cookies' ||
    pathname === '/us/guidelines' ||
    pathname === '/us/refunds' ||
    pathname === '/us/accessibility' ||
    pathname === '/us/help';

  // Protect app routes (everything not explicitly public)
  if (!isPublic && !session) return NextResponse.redirect(new URL('/login', request.url));

  // Premium gating example (Pro-only custom deck)
  if (pathname.startsWith('/connect/intimacy-deck/custom')) {
    const effectiveTier = await getEffectiveTierForUser(session.user.id); // couple-shared
    if (effectiveTier !== 'closer_pro') {
      return NextResponse.redirect(new URL('/us/subscription?upgrade=closer_pro&reason=custom_deck', request.url));
    }
  }

  return NextResponse.next();
}
```

---

# 6. File Storage

## 6.1 Supabase Storage Buckets

| Bucket | Purpose | Access |
|--------|---------|--------|
| `avatars` | Profile photos | Public read, auth write |
| `messages` | Message attachments | Couple-only access |
| `moments` | Moment photos | Couple-only access |
| `capsules` | Time capsule media | Couple-only, after open |
| `voice-notes` | Voice messages | Couple-only access |

## 6.2 Upload Configuration

```typescript
// Maximum file sizes
const MAX_SIZES = {
  avatar: 5 * 1024 * 1024,       // 5MB
  photo: 10 * 1024 * 1024,       // 10MB
  voice: 25 * 1024 * 1024,       // 25MB (5 min at 128kbps)
};

// Allowed MIME types
const ALLOWED_TYPES = {
  avatar: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
  photo: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif'],
  voice: ['audio/webm', 'audio/mp4', 'audio/mpeg'],
};
```

## 6.3 Image Processing

- Avatars: Resize to 400x400, convert to WebP
- Photos: Resize max dimension to 2000px, convert to WebP
- Thumbnails: Generate 200px thumbnails for galleries

---

# 7. Payment Integration

## 7.1 Stripe Products

| Product ID | Name | Price |
|------------|------|-------|
| `prod_closer_plus_monthly` | Closer+ Monthly | $9.99/mo |
| `prod_closer_plus_annual` | Closer+ Annual | $79.99/yr |
| `prod_closer_pro_monthly` | Closer Pro Monthly | $14.99/mo |
| `prod_closer_pro_annual` | Closer Pro Annual | $119.99/yr |

## 7.2 Webhook Events

| Event | Handler |
|-------|---------|
| `checkout.session.completed` | Create/update subscription |
| `customer.subscription.updated` | Update subscription status |
| `customer.subscription.deleted` | Cancel subscription |
| `invoice.paid` | Extend subscription period |
| `invoice.payment_failed` | Mark as past_due, send email |

## 7.3 Gift Purchases

```typescript
// One-time purchase flow
const checkout = await stripe.checkout.sessions.create({
  mode: 'payment',
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Aurora Hearts',
        images: ['https://closer.app/gifts/aurora-hearts.png'],
      },
      unit_amount: 499, // $4.99 in cents
    },
    quantity: 1,
  }],
  success_url: `${baseUrl}/gifts/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/gifts`,
  metadata: {
    user_id: userId,
    gift_id: 'aurora_hearts',
    recipient_id: partnerId,
  },
});
```

---

# 8. Notification System

## 8.1 Push Notification Flow

```
User Action → Edge Function → OneSignal API → Device
                   ↓
              Check quiet hours
              Check preferences
              Localize content
```

## 8.2 Edge Function Example

```typescript
// supabase/functions/send-notification/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { userId, type, title, body, data } = await req.json();

  // Get user preferences
  const { data: user } = await supabase
    .from('profiles')
    .select('notification_settings, timezone')
    .eq('id', userId)
    .single();

  // Check quiet hours
  if (isQuietHours(user.notification_settings, user.timezone)) {
    return new Response(JSON.stringify({ sent: false, reason: 'quiet_hours' }));
  }

  // Check notification type preference
  if (!user.notification_settings.push_enabled) {
    return new Response(JSON.stringify({ sent: false, reason: 'disabled' }));
  }

  // Get push tokens
  const { data: tokens } = await supabase
    .from('push_tokens')
    .select('token, platform')
    .eq('user_id', userId)
    .eq('is_active', true);

  // Send via OneSignal
  for (const token of tokens) {
    await sendOneSignalNotification(token, { title, body, data });
  }

  // Save to notifications table
  await supabase.from('notifications').insert({
    user_id: userId,
    type,
    title,
    body,
    data,
  });

  return new Response(JSON.stringify({ sent: true }));
});
```

---

# 9. Background Jobs

## 9.1 Scheduled Jobs (Cron)

| Job | Schedule | Description |
|-----|----------|-------------|
| `streak-checker` | Every day at midnight UTC | Check and update streaks |
| `streak-warning` | Every day at 6 PM user local | Send streak at risk notification |
| `capsule-opener` | Every hour | Check for ready capsules |
| `weekly-summary` | Every Sunday at 10 AM | Generate weekly summary emails |
| `cleanup-expired` | Every day at 3 AM | Clean expired invite codes, sessions |

## 9.2 Edge Function: Streak Checker

```typescript
// Runs daily at midnight UTC
serve(async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Get all active couples
  const { data: couples } = await supabase
    .from('couples')
    .select('id, streaks(*)')
    .eq('status', 'active');

  for (const couple of couples) {
    const streak = couple.streaks[0];

    // Check if there was activity yesterday
    const { count } = await supabase
      .from('streak_history')
      .select('*', { count: 'exact' })
      .eq('couple_id', couple.id)
      .eq('activity_date', yesterdayStr);

    if (count === 0 && streak.current_streak > 0) {
      // Check for freeze
      if (streak.freeze_used_this_week && !wasYesterday(streak.freeze_used_at)) {
        // Freeze was used, allow one skip
        continue;
      }

      // Reset streak
      await supabase
        .from('streaks')
        .update({
          current_streak: 0,
          updated_at: new Date().toISOString()
        })
        .eq('couple_id', couple.id);

      // Notify both users
      await notifyStreakLost(couple.id, streak.current_streak);
    }
  }
});
```

---

# 10. Caching Strategy

## 10.1 Cache Layers

| Layer | Technology | TTL | Use Case |
|-------|------------|-----|----------|
| Browser | Service Worker | Varies | Static assets, API responses |
| Edge | Vercel Edge Cache | 60s | Public content, gifts catalog |
| Database | Supabase | N/A | Query optimization |

## 10.2 Cache Keys

```typescript
const CACHE_KEYS = {
  gifts: 'gifts:catalog',
  categories: 'cards:categories',
  achievements: 'achievements:all',
  userProfile: (id: string) => `profile:${id}`,
  coupleData: (id: string) => `couple:${id}`,
  streak: (coupleId: string) => `streak:${coupleId}`,
};
```

## 10.3 Revalidation

```typescript
// On-demand revalidation after mutations
export async function revalidateCouple(coupleId: string) {
  await revalidatePath(`/`);
  await revalidatePath(`/connect`);
  await revalidatePath(`/messages`);
  await revalidatePath(`/moments`);
  await revalidatePath(`/us`);
  await revalidateTag(`couple:${coupleId}`);
}
```

---

# 11. Security Measures

## 11.1 Input Validation

```typescript
// Example: Message schema
const messageSchema = z.object({
  content: z.string().max(5000).optional(),
  message_type: z.enum(['text', 'whisper', 'voice', 'photo', 'gift', 'system']),
  media_url: z.string().url().optional(),
});
```

## 11.2 Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/auth/*` | 10/minute per IP |
| `/messages` POST | 60/minute per user |
| `/cards/draw` | 10/minute per user |
| `/*` general | 1000/hour per user |

## 11.3 Content Security

- Sanitize all user input (DOMPurify for HTML)
- CSP headers configured
- XSS protection enabled
- CSRF tokens for mutations
- Rate limit file uploads

## 11.4 Data Protection

- All data encrypted at rest (Supabase default)
- All connections over TLS 1.3
- Passwords hashed with bcrypt (Supabase Auth)
- Sensitive data (messages) not logged
- PII redacted from error logs

---

# 12. Environment Configuration

## 12.1 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# OneSignal
ONESIGNAL_APP_ID=
ONESIGNAL_REST_API_KEY=

# Resend (Email)
RESEND_API_KEY=

# Sentry
SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=Closer
```

## 12.2 Feature Flags

```typescript
const FEATURES = {
  VOICE_NOTES: true,
  CUSTOM_DECKS: true,
  WEEKLY_SUMMARY_EMAIL: true,
  AI_QUESTION_GENERATION: false, // Future
  VIDEO_MESSAGES: false, // Future
};
```

---

# 13. Deployment Architecture

## 13.1 Infrastructure Diagram

```
                    ┌─────────────────┐
                    │   Cloudflare    │
                    │      (DNS)      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │     Vercel      │
                    │   (Next.js)     │
                    │                 │
                    │  ┌───────────┐  │
                    │  │ Edge      │  │
                    │  │ Functions │  │
                    │  └───────────┘  │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
│    Supabase     │ │     Stripe      │ │   OneSignal     │
│                 │ │                 │ │                 │
│ • PostgreSQL    │ │ • Payments      │ │ • Push          │
│ • Auth          │ │ • Subscriptions │ │   Notifications │
│ • Storage       │ │ • Webhooks      │ │                 │
│ • Realtime      │ │                 │ │                 │
│ • Edge Funcs    │ │                 │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## 13.2 Deployment Environments

| Environment | URL | Branch | Purpose |
|-------------|-----|--------|---------|
| Production | closer.app | main | Live users |
| Staging | staging.closer.app | staging | Pre-release testing |
| Preview | *.vercel.app | PR branches | PR review |
| Development | localhost:3000 | local | Development |

---

# 14. Monitoring & Logging

## 14.1 Monitoring Stack

| Tool | Purpose |
|------|---------|
| Vercel Analytics | Core Web Vitals, performance |
| Sentry | Error tracking, crash reporting |
| PostHog | Product analytics, feature usage |
| Supabase Dashboard | Database performance, API usage |
| Better Uptime | Uptime monitoring, status page |

## 14.2 Key Metrics to Track

### Performance
- Time to First Byte (TTFB)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

### Business
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Messages sent per day
- Cards drawn per day
- Conversion rate (free → paid)
- Churn rate

### Technical
- API response times (p50, p95, p99)
- Error rates by endpoint
- Database query performance
- Real-time connection count
- Storage usage

## 14.3 Alerting Rules

| Metric | Threshold | Action |
|--------|-----------|--------|
| Error rate | >1% | Slack alert |
| p99 latency | >2s | Slack alert |
| Database CPU | >80% | Email + Slack |
| Storage usage | >80% | Email |
| Failed payments | >5/hour | Slack alert |

---

*This document provides the complete technical foundation for building Closer.*
*Actual implementation may require adjustments based on scale and specific requirements.*
