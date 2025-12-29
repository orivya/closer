# MixExperts.com — Implementation Details

## Technical Specifications for Development

**Version 2.0 — Production Ready**
**December 2025**

---

# TABLE OF CONTENTS

1. [Environment Configuration](#1-environment-configuration)
2. [Database Schema (Complete SQL)](#2-database-schema-complete-sql)
3. [Row Level Security Policies](#3-row-level-security-policies)
4. [API Endpoint Specifications](#4-api-endpoint-specifications)
5. [Form Validation Rules](#5-form-validation-rules)
6. [File Upload Specifications](#6-file-upload-specifications)
7. [Stripe Configuration](#7-stripe-configuration)
8. [Email Configuration](#8-email-configuration)
9. [Analytics Events](#9-analytics-events)
10. [SEO Configuration](#10-seo-configuration)
11. [Deployment Configuration](#11-deployment-configuration)

---

# 1. ENVIRONMENT CONFIGURATION

## 1.1 Required Environment Variables

```bash
# =============================================================================
# MIXEXPERTS ENVIRONMENT VARIABLES
# =============================================================================

# -----------------------------------------------------------------------------
# APP CONFIGURATION
# -----------------------------------------------------------------------------
NEXT_PUBLIC_APP_URL=https://mixexperts.com
NEXT_PUBLIC_APP_NAME=MixExperts
NODE_ENV=production

# -----------------------------------------------------------------------------
# SUPABASE
# -----------------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret

# -----------------------------------------------------------------------------
# STRIPE
# -----------------------------------------------------------------------------
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Product IDs
STRIPE_PRODUCT_PRO=prod_...
STRIPE_PRODUCT_AI_ADDON=prod_...
STRIPE_PRODUCT_ENTERPRISE=prod_...

# Stripe Price IDs (Monthly)
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_AI_ADDON_MONTHLY=price_...
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...

# Stripe Price IDs (Yearly - 2 months free)
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_AI_ADDON_YEARLY=price_...
STRIPE_PRICE_ENTERPRISE_YEARLY=price_...

# -----------------------------------------------------------------------------
# AI PROVIDERS
# -----------------------------------------------------------------------------
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
AI_PRIMARY_PROVIDER=anthropic
AI_FALLBACK_PROVIDER=openai
AI_MODEL_PRIMARY=claude-3-5-sonnet-20241022
AI_MODEL_FALLBACK=gpt-4-turbo

# -----------------------------------------------------------------------------
# EMAIL (Resend)
# -----------------------------------------------------------------------------
RESEND_API_KEY=re_...
EMAIL_FROM_ADDRESS=hello@mixexperts.com
EMAIL_FROM_NAME=MixExperts
EMAIL_REPLY_TO=support@mixexperts.com

# -----------------------------------------------------------------------------
# FILE STORAGE
# -----------------------------------------------------------------------------
NEXT_PUBLIC_STORAGE_URL=https://your-project.supabase.co/storage/v1
MAX_AVATAR_SIZE_MB=5
MAX_BANNER_SIZE_MB=10
MAX_AUDIO_SIZE_MB=50
MAX_PRODUCT_SIZE_MB=500

# -----------------------------------------------------------------------------
# RATE LIMITING
# -----------------------------------------------------------------------------
RATE_LIMIT_AI_REQUESTS_PER_HOUR=50
RATE_LIMIT_INQUIRY_PER_HOUR=10
RATE_LIMIT_AUTH_ATTEMPTS=5

# -----------------------------------------------------------------------------
# FEATURE FLAGS
# -----------------------------------------------------------------------------
FEATURE_AI_CHATBOT=true
FEATURE_DIGITAL_PRODUCTS=true
FEATURE_BOOKING_CALENDAR=true
FEATURE_STRIPE_CONNECT=true

# -----------------------------------------------------------------------------
# ANALYTICS
# -----------------------------------------------------------------------------
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# -----------------------------------------------------------------------------
# SECURITY
# -----------------------------------------------------------------------------
ENCRYPTION_KEY=your-32-character-encryption-key
CSRF_SECRET=your-csrf-secret
```

## 1.2 Supabase Storage Buckets

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('banners', 'banners', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('portfolio-audio', 'portfolio-audio', true, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp4']),
  ('portfolio-images', 'portfolio-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('products', 'products', false, 524288000, ARRAY['application/zip', 'application/x-zip-compressed', 'audio/mpeg', 'audio/wav']),
  ('product-previews', 'product-previews', true, 10485760, ARRAY['audio/mpeg', 'image/jpeg', 'image/png']),
  ('credit-logos', 'credit-logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);
```

---

# 2. DATABASE SCHEMA (COMPLETE SQL)

```sql
-- =============================================================================
-- MIXEXPERTS DATABASE SCHEMA
-- Version 2.0
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- -----------------------------------------------------------------------------
-- ENUM TYPES
-- -----------------------------------------------------------------------------

CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'trialing');
CREATE TYPE inquiry_status AS ENUM ('new', 'read', 'replied', 'converted', 'archived');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE price_type AS ENUM ('fixed', 'starting_at', 'hourly', 'custom');
CREATE TYPE product_category AS ENUM ('preset', 'template', 'sample_pack', 'tutorial', 'other');
CREATE TYPE license_type AS ENUM ('personal', 'commercial', 'unlimited');
CREATE TYPE ai_tone AS ENUM ('professional', 'friendly', 'casual', 'warm', 'direct');

-- -----------------------------------------------------------------------------
-- USERS TABLE (extends Supabase auth.users)
-- -----------------------------------------------------------------------------

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Info
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    tagline TEXT,
    bio TEXT,
    
    -- Media
    avatar_url TEXT,
    banner_url TEXT,
    
    -- Location & Contact
    location TEXT,
    timezone TEXT DEFAULT 'America/Los_Angeles',
    
    -- Appearance
    theme TEXT DEFAULT 'amber' CHECK (theme IN ('amber', 'teal', 'sage', 'slate', 'rose', 'violet')),
    
    -- Status
    is_published BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    
    -- SEO
    custom_domain TEXT,
    seo_title TEXT,
    seo_description TEXT,
    
    -- Social Links (JSONB for flexibility)
    social_links JSONB DEFAULT '{}',
    -- Example: {"instagram": "handle", "youtube": "url", "spotify": "url", "twitter": "handle"}
    
    -- Genres/Specialties (array for filtering)
    genres TEXT[] DEFAULT '{}',
    
    -- Profile Completeness
    completeness_score INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT username_format CHECK (username ~ '^[a-z0-9_-]{3,30}$'),
    CONSTRAINT display_name_length CHECK (char_length(display_name) BETWEEN 2 AND 50),
    CONSTRAINT tagline_length CHECK (tagline IS NULL OR char_length(tagline) <= 150),
    CONSTRAINT bio_length CHECK (bio IS NULL OR char_length(bio) <= 2000)
);

-- Index for username lookups
CREATE UNIQUE INDEX profiles_username_idx ON profiles (LOWER(username));
-- Index for public profile queries
CREATE INDEX profiles_published_idx ON profiles (is_published) WHERE is_published = true;

-- -----------------------------------------------------------------------------
-- SUBSCRIPTIONS
-- -----------------------------------------------------------------------------

CREATE TABLE public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Stripe References
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE,
    
    -- Plan Info
    plan subscription_plan DEFAULT 'free',
    ai_addon BOOLEAN DEFAULT false,
    status subscription_status DEFAULT 'active',
    
    -- Billing Dates
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    
    -- Trial
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT one_subscription_per_user UNIQUE (user_id)
);

CREATE INDEX subscriptions_stripe_customer_idx ON subscriptions (stripe_customer_id);
CREATE INDEX subscriptions_stripe_subscription_idx ON subscriptions (stripe_subscription_id);

-- -----------------------------------------------------------------------------
-- PORTFOLIO ITEMS
-- -----------------------------------------------------------------------------

CREATE TABLE public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Basic Info
    title TEXT NOT NULL,
    artist_name TEXT,
    description TEXT,
    
    -- Audio Files
    before_audio_url TEXT,
    after_audio_url TEXT,
    
    -- Visuals
    cover_image_url TEXT,
    
    -- External Links
    spotify_url TEXT,
    youtube_url TEXT,
    apple_music_url TEXT,
    
    -- Metadata
    genre TEXT,
    release_date DATE,
    project_type TEXT, -- 'mixing', 'mastering', 'production', etc.
    
    -- Display Settings
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    
    -- Stats
    play_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT title_length CHECK (char_length(title) BETWEEN 1 AND 100),
    CONSTRAINT description_length CHECK (description IS NULL OR char_length(description) <= 500)
);

CREATE INDEX portfolio_user_idx ON portfolio_items (user_id);
CREATE INDEX portfolio_featured_idx ON portfolio_items (user_id, is_featured) WHERE is_featured = true;
CREATE INDEX portfolio_order_idx ON portfolio_items (user_id, display_order);

-- -----------------------------------------------------------------------------
-- SERVICES
-- -----------------------------------------------------------------------------

CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    
    -- Pricing
    price DECIMAL(10, 2),
    price_type price_type DEFAULT 'fixed',
    currency TEXT DEFAULT 'USD',
    
    -- Details
    turnaround_days INTEGER,
    revisions_included INTEGER,
    
    -- Features (array of strings)
    features TEXT[] DEFAULT '{}',
    
    -- Booking Settings
    requires_deposit BOOLEAN DEFAULT false,
    deposit_percentage INTEGER DEFAULT 50,
    booking_enabled BOOLEAN DEFAULT true,
    
    -- Display Settings
    icon TEXT, -- emoji or icon name
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    -- Stats
    booking_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT name_length CHECK (char_length(name) BETWEEN 2 AND 50),
    CONSTRAINT description_length CHECK (description IS NULL OR char_length(description) <= 1000),
    CONSTRAINT valid_price CHECK (price IS NULL OR price >= 0),
    CONSTRAINT valid_turnaround CHECK (turnaround_days IS NULL OR turnaround_days > 0),
    CONSTRAINT valid_deposit CHECK (deposit_percentage BETWEEN 0 AND 100)
);

CREATE INDEX services_user_idx ON services (user_id);
CREATE INDEX services_active_idx ON services (user_id, is_active) WHERE is_active = true;

-- -----------------------------------------------------------------------------
-- DIGITAL PRODUCTS
-- -----------------------------------------------------------------------------

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    
    -- Pricing
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2), -- For showing discounts
    currency TEXT DEFAULT 'USD',
    
    -- Files
    file_url TEXT NOT NULL, -- Secure storage URL
    file_size_bytes BIGINT,
    file_type TEXT,
    
    -- Preview
    preview_url TEXT, -- Audio preview or image
    cover_image_url TEXT,
    
    -- Metadata
    category product_category DEFAULT 'other',
    license_type license_type DEFAULT 'personal',
    compatible_daws TEXT[], -- ['Pro Tools', 'Logic', 'Ableton']
    
    -- Settings
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    -- Stats
    sales_count INTEGER DEFAULT 0,
    revenue_total DECIMAL(10, 2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT name_length CHECK (char_length(name) BETWEEN 2 AND 100),
    CONSTRAINT valid_price CHECK (price >= 0)
);

CREATE INDEX products_user_idx ON products (user_id);
CREATE INDEX products_active_idx ON products (user_id, is_active) WHERE is_active = true;
CREATE INDEX products_category_idx ON products (category);

-- -----------------------------------------------------------------------------
-- PRODUCT PURCHASES
-- -----------------------------------------------------------------------------

CREATE TABLE public.product_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT, -- Engineer who made the sale
    
    -- Buyer Info (may not be a user)
    buyer_email TEXT NOT NULL,
    buyer_name TEXT,
    
    -- Payment
    stripe_payment_intent_id TEXT UNIQUE,
    amount_paid DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    engineer_payout DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Download
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 5,
    download_token TEXT UNIQUE DEFAULT uuid_generate_v4()::TEXT,
    download_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX purchases_product_idx ON product_purchases (product_id);
CREATE INDEX purchases_user_idx ON product_purchases (user_id);
CREATE INDEX purchases_buyer_idx ON product_purchases (buyer_email);

-- -----------------------------------------------------------------------------
-- CREDITS (Worked With)
-- -----------------------------------------------------------------------------

CREATE TABLE public.credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Info
    artist_name TEXT NOT NULL,
    project_name TEXT,
    logo_url TEXT,
    link_url TEXT,
    
    -- Display
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT artist_name_length CHECK (char_length(artist_name) BETWEEN 1 AND 100)
);

CREATE INDEX credits_user_idx ON credits (user_id);

-- -----------------------------------------------------------------------------
-- TESTIMONIALS
-- -----------------------------------------------------------------------------

CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Content
    client_name TEXT NOT NULL,
    client_title TEXT, -- e.g., "Independent Artist"
    client_avatar_url TEXT,
    content TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_project_id UUID REFERENCES portfolio_items(id),
    
    -- Display
    is_approved BOOLEAN DEFAULT false, -- Engineer must approve
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    -- Source
    source TEXT, -- 'manual', 'requested', 'imported'
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT rating_range CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT content_length CHECK (char_length(content) BETWEEN 10 AND 1000)
);

CREATE INDEX testimonials_user_idx ON testimonials (user_id);
CREATE INDEX testimonials_approved_idx ON testimonials (user_id, is_approved) WHERE is_approved = true;

-- -----------------------------------------------------------------------------
-- FAQ ITEMS
-- -----------------------------------------------------------------------------

CREATE TABLE public.faq_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT question_length CHECK (char_length(question) BETWEEN 5 AND 200),
    CONSTRAINT answer_length CHECK (char_length(answer) BETWEEN 10 AND 1000)
);

CREATE INDEX faq_user_idx ON faq_items (user_id);

-- -----------------------------------------------------------------------------
-- INQUIRIES
-- -----------------------------------------------------------------------------

CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- Engineer receiving inquiry
    
    -- Client Info
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    
    -- Project Details
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    project_type TEXT,
    budget_range TEXT,
    timeline TEXT,
    
    -- Reference Links (array)
    reference_links TEXT[] DEFAULT '{}',
    
    -- Status
    status inquiry_status DEFAULT 'new',
    
    -- AI Analysis
    ai_summary TEXT,
    ai_suggested_response TEXT,
    ai_score INTEGER, -- 0-100 lead quality score
    
    -- Tracking
    source TEXT, -- 'profile', 'direct', 'referral'
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- Response Tracking
    first_response_at TIMESTAMPTZ,
    response_time_minutes INTEGER,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ,
    
    CONSTRAINT client_name_length CHECK (char_length(client_name) BETWEEN 2 AND 100),
    CONSTRAINT message_length CHECK (char_length(message) BETWEEN 10 AND 5000)
);

CREATE INDEX inquiries_user_idx ON inquiries (user_id);
CREATE INDEX inquiries_status_idx ON inquiries (user_id, status);
CREATE INDEX inquiries_email_idx ON inquiries (client_email);
CREATE INDEX inquiries_created_idx ON inquiries (user_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- INQUIRY MESSAGES (Thread)
-- -----------------------------------------------------------------------------

CREATE TABLE public.inquiry_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
    
    sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'engineer', 'ai', 'system')),
    content TEXT NOT NULL,
    
    -- AI Metadata
    ai_generated BOOLEAN DEFAULT false,
    ai_edited BOOLEAN DEFAULT false,
    
    -- Attachments
    attachments JSONB DEFAULT '[]',
    
    -- Email Tracking
    email_sent BOOLEAN DEFAULT false,
    email_opened_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT content_length CHECK (char_length(content) BETWEEN 1 AND 10000)
);

CREATE INDEX inquiry_messages_inquiry_idx ON inquiry_messages (inquiry_id);
CREATE INDEX inquiry_messages_created_idx ON inquiry_messages (inquiry_id, created_at);

-- -----------------------------------------------------------------------------
-- AVAILABILITY / WORKING HOURS
-- -----------------------------------------------------------------------------

CREATE TABLE public.availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Day of week (0 = Sunday, 6 = Saturday)
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    
    -- Working hours
    is_working BOOLEAN DEFAULT true,
    start_time TIME DEFAULT '09:00',
    end_time TIME DEFAULT '18:00',
    
    -- Buffer between bookings (minutes)
    buffer_minutes INTEGER DEFAULT 30,
    
    CONSTRAINT one_per_day UNIQUE (user_id, day_of_week),
    CONSTRAINT valid_times CHECK (start_time < end_time)
);

CREATE INDEX availability_user_idx ON availability (user_id);

-- -----------------------------------------------------------------------------
-- BLOCKED DATES
-- -----------------------------------------------------------------------------

CREATE TABLE public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    blocked_date DATE NOT NULL,
    reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_blocked_date UNIQUE (user_id, blocked_date)
);

CREATE INDEX blocked_dates_user_idx ON blocked_dates (user_id, blocked_date);

-- -----------------------------------------------------------------------------
-- BOOKINGS
-- -----------------------------------------------------------------------------

CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- Engineer
    inquiry_id UUID REFERENCES inquiries(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    
    -- Client Info
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    
    -- Schedule
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    duration_minutes INTEGER,
    
    -- Status
    status booking_status DEFAULT 'pending',
    
    -- Payment
    total_amount DECIMAL(10, 2),
    deposit_amount DECIMAL(10, 2),
    deposit_paid BOOLEAN DEFAULT false,
    stripe_payment_intent_id TEXT,
    
    -- Project Details
    project_notes TEXT,
    
    -- Calendar Sync
    google_calendar_event_id TEXT,
    apple_calendar_event_id TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT
);

CREATE INDEX bookings_user_idx ON bookings (user_id);
CREATE INDEX bookings_date_idx ON bookings (user_id, scheduled_date);
CREATE INDEX bookings_status_idx ON bookings (user_id, status);

-- -----------------------------------------------------------------------------
-- AI SETTINGS
-- -----------------------------------------------------------------------------

CREATE TABLE public.ai_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Tone & Style
    tone ai_tone DEFAULT 'professional',
    
    -- Chatbot Settings
    chatbot_enabled BOOLEAN DEFAULT false,
    chatbot_greeting TEXT DEFAULT 'Hi! I''m an AI assistant. How can I help you today?',
    chatbot_personality TEXT,
    
    -- Custom Q&A Pairs
    custom_qa_pairs JSONB DEFAULT '[]',
    -- Format: [{"question": "...", "answer": "...", "keywords": ["..."]}]
    
    -- Style Samples (for learning engineer's voice)
    style_samples JSONB DEFAULT '[]',
    -- Format: [{"type": "email", "content": "..."}, ...]
    
    -- Auto-response Settings
    auto_respond_enabled BOOLEAN DEFAULT false,
    auto_respond_delay_minutes INTEGER DEFAULT 5,
    
    -- Usage Tracking
    ai_requests_this_month INTEGER DEFAULT 0,
    ai_requests_reset_at TIMESTAMPTZ DEFAULT DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT one_per_user UNIQUE (user_id),
    CONSTRAINT greeting_length CHECK (chatbot_greeting IS NULL OR char_length(chatbot_greeting) <= 500)
);

-- -----------------------------------------------------------------------------
-- AI CONVERSATIONS (Chatbot History)
-- -----------------------------------------------------------------------------

CREATE TABLE public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- Engineer's profile
    
    -- Visitor Info (may not be a user)
    visitor_id TEXT NOT NULL, -- Anonymous session ID
    visitor_email TEXT, -- If collected
    
    -- Conversation Status
    is_active BOOLEAN DEFAULT true,
    escalated_to_human BOOLEAN DEFAULT false,
    converted_to_inquiry BOOLEAN DEFAULT false,
    inquiry_id UUID REFERENCES inquiries(id),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

CREATE INDEX ai_conversations_user_idx ON ai_conversations (user_id);
CREATE INDEX ai_conversations_visitor_idx ON ai_conversations (visitor_id);

-- -----------------------------------------------------------------------------
-- AI CONVERSATION MESSAGES
-- -----------------------------------------------------------------------------

CREATE TABLE public.ai_conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    
    -- Metadata
    tokens_used INTEGER,
    response_time_ms INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ai_messages_conversation_idx ON ai_conversation_messages (conversation_id);

-- -----------------------------------------------------------------------------
-- ANALYTICS EVENTS
-- -----------------------------------------------------------------------------

CREATE TABLE public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    event_type TEXT NOT NULL,
    -- Types: 'profile_view', 'portfolio_play', 'service_view', 'inquiry_submit', 
    --        'product_view', 'product_purchase', 'chatbot_open', 'booking_complete'
    
    -- Event Data
    metadata JSONB DEFAULT '{}',
    
    -- Visitor Info
    visitor_id TEXT, -- Anonymous session
    visitor_country TEXT,
    visitor_city TEXT,
    referrer TEXT,
    user_agent TEXT,
    
    -- UTM Tracking
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partitioned by month for performance
CREATE INDEX analytics_user_type_idx ON analytics_events (user_id, event_type);
CREATE INDEX analytics_created_idx ON analytics_events (user_id, created_at DESC);

-- -----------------------------------------------------------------------------
-- STRIPE CONNECT ACCOUNTS
-- -----------------------------------------------------------------------------

CREATE TABLE public.stripe_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    stripe_account_id TEXT UNIQUE NOT NULL,
    
    -- Account Status
    charges_enabled BOOLEAN DEFAULT false,
    payouts_enabled BOOLEAN DEFAULT false,
    details_submitted BOOLEAN DEFAULT false,
    
    -- Business Info
    business_type TEXT,
    country TEXT,
    default_currency TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT one_per_user UNIQUE (user_id)
);

-- -----------------------------------------------------------------------------
-- TRANSACTIONS (Platform Revenue Tracking)
-- -----------------------------------------------------------------------------

CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    
    -- Type
    transaction_type TEXT NOT NULL,
    -- Types: 'subscription', 'product_sale', 'booking_deposit', 'booking_final'
    
    -- Related Records
    subscription_id UUID REFERENCES subscriptions(id),
    product_purchase_id UUID REFERENCES product_purchases(id),
    booking_id UUID REFERENCES bookings(id),
    
    -- Amounts
    gross_amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    stripe_fee DECIMAL(10, 2) NOT NULL,
    net_amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Stripe References
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    stripe_transfer_id TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending',
    -- Status: 'pending', 'completed', 'failed', 'refunded'
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX transactions_user_idx ON transactions (user_id);
CREATE INDEX transactions_type_idx ON transactions (transaction_type);
CREATE INDEX transactions_created_idx ON transactions (created_at DESC);

-- -----------------------------------------------------------------------------
-- FUNCTIONS & TRIGGERS
-- -----------------------------------------------------------------------------

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_ai_settings_updated_at BEFORE UPDATE ON ai_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Calculate profile completeness
CREATE OR REPLACE FUNCTION calculate_profile_completeness(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    profile_rec RECORD;
    portfolio_count INTEGER;
    services_count INTEGER;
    testimonials_count INTEGER;
BEGIN
    SELECT * INTO profile_rec FROM profiles WHERE id = p_user_id;
    
    -- Basic fields (40 points max)
    IF profile_rec.display_name IS NOT NULL AND profile_rec.display_name != '' THEN score := score + 10; END IF;
    IF profile_rec.tagline IS NOT NULL AND profile_rec.tagline != '' THEN score := score + 10; END IF;
    IF profile_rec.bio IS NOT NULL AND char_length(profile_rec.bio) > 100 THEN score := score + 10; END IF;
    IF profile_rec.avatar_url IS NOT NULL THEN score := score + 10; END IF;
    
    -- Portfolio (30 points max)
    SELECT COUNT(*) INTO portfolio_count FROM portfolio_items WHERE user_id = p_user_id AND is_visible = true;
    IF portfolio_count >= 1 THEN score := score + 10; END IF;
    IF portfolio_count >= 3 THEN score := score + 10; END IF;
    IF portfolio_count >= 5 THEN score := score + 10; END IF;
    
    -- Services (15 points max)
    SELECT COUNT(*) INTO services_count FROM services WHERE user_id = p_user_id AND is_active = true;
    IF services_count >= 1 THEN score := score + 10; END IF;
    IF services_count >= 3 THEN score := score + 5; END IF;
    
    -- Social proof (15 points max)
    IF profile_rec.social_links IS NOT NULL AND profile_rec.social_links != '{}' THEN score := score + 5; END IF;
    
    SELECT COUNT(*) INTO testimonials_count FROM testimonials WHERE user_id = p_user_id AND is_approved = true;
    IF testimonials_count >= 1 THEN score := score + 5; END IF;
    IF testimonials_count >= 3 THEN score := score + 5; END IF;
    
    RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update completeness score
CREATE OR REPLACE FUNCTION update_profile_completeness()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE profiles 
    SET completeness_score = calculate_profile_completeness(
        COALESCE(NEW.user_id, NEW.id, OLD.user_id, OLD.id)
    )
    WHERE id = COALESCE(NEW.user_id, NEW.id, OLD.user_id, OLD.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_completeness_on_profile AFTER INSERT OR UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_profile_completeness();

CREATE TRIGGER update_completeness_on_portfolio AFTER INSERT OR UPDATE OR DELETE ON portfolio_items
    FOR EACH ROW EXECUTE FUNCTION update_profile_completeness();

CREATE TRIGGER update_completeness_on_services AFTER INSERT OR UPDATE OR DELETE ON services
    FOR EACH ROW EXECUTE FUNCTION update_profile_completeness();

CREATE TRIGGER update_completeness_on_testimonials AFTER INSERT OR UPDATE OR DELETE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_profile_completeness();

-- Track inquiry response time
CREATE OR REPLACE FUNCTION calculate_response_time()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'replied' AND OLD.status = 'new' THEN
        NEW.first_response_at = NOW();
        NEW.response_time_minutes = EXTRACT(EPOCH FROM (NOW() - NEW.created_at)) / 60;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_inquiry_response BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION calculate_response_time();
```

---

# 3. ROW LEVEL SECURITY POLICIES

```sql
-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiry_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- PROFILES
-- -----------------------------------------------------------------------------

-- Public can view published profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (is_published = true);

-- Users can view their own profile (even if unpublished)
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- SUBSCRIPTIONS
-- -----------------------------------------------------------------------------

-- Users can view their own subscription
CREATE POLICY "Users can view own subscription"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Only service role can modify subscriptions (via webhooks)
CREATE POLICY "Service role can manage subscriptions"
    ON subscriptions FOR ALL
    USING (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- PORTFOLIO ITEMS
-- -----------------------------------------------------------------------------

-- Public can view visible portfolio items of published profiles
CREATE POLICY "Public can view portfolio of published profiles"
    ON portfolio_items FOR SELECT
    USING (
        is_visible = true AND
        EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_published = true)
    );

-- Users can view all their own portfolio items
CREATE POLICY "Users can view own portfolio"
    ON portfolio_items FOR SELECT
    USING (auth.uid() = user_id);

-- Users can manage their own portfolio
CREATE POLICY "Users can manage own portfolio"
    ON portfolio_items FOR ALL
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- SERVICES
-- -----------------------------------------------------------------------------

-- Public can view active services of published profiles
CREATE POLICY "Public can view services of published profiles"
    ON services FOR SELECT
    USING (
        is_active = true AND
        EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_published = true)
    );

-- Users can view all their own services
CREATE POLICY "Users can view own services"
    ON services FOR SELECT
    USING (auth.uid() = user_id);

-- Users can manage their own services
CREATE POLICY "Users can manage own services"
    ON services FOR ALL
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- PRODUCTS
-- -----------------------------------------------------------------------------

-- Public can view active products of published profiles
CREATE POLICY "Public can view products of published profiles"
    ON products FOR SELECT
    USING (
        is_active = true AND
        EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_published = true)
    );

-- Users can view all their own products
CREATE POLICY "Users can view own products"
    ON products FOR SELECT
    USING (auth.uid() = user_id);

-- Users can manage their own products
CREATE POLICY "Users can manage own products"
    ON products FOR ALL
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- PRODUCT PURCHASES
-- -----------------------------------------------------------------------------

-- Users can view purchases of their products
CREATE POLICY "Users can view own product purchases"
    ON product_purchases FOR SELECT
    USING (auth.uid() = user_id);

-- Service role can create purchases
CREATE POLICY "Service role can create purchases"
    ON product_purchases FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- CREDITS
-- -----------------------------------------------------------------------------

-- Public can view credits of published profiles
CREATE POLICY "Public can view credits of published profiles"
    ON credits FOR SELECT
    USING (
        is_visible = true AND
        EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_published = true)
    );

-- Users can manage their own credits
CREATE POLICY "Users can manage own credits"
    ON credits FOR ALL
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- TESTIMONIALS
-- -----------------------------------------------------------------------------

-- Public can view approved testimonials of published profiles
CREATE POLICY "Public can view approved testimonials"
    ON testimonials FOR SELECT
    USING (
        is_approved = true AND
        EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_published = true)
    );

-- Users can view all their own testimonials
CREATE POLICY "Users can view own testimonials"
    ON testimonials FOR SELECT
    USING (auth.uid() = user_id);

-- Users can manage their own testimonials
CREATE POLICY "Users can manage own testimonials"
    ON testimonials FOR ALL
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- FAQ ITEMS
-- -----------------------------------------------------------------------------

-- Public can view FAQs of published profiles
CREATE POLICY "Public can view FAQs of published profiles"
    ON faq_items FOR SELECT
    USING (
        is_visible = true AND
        EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_published = true)
    );

-- Users can manage their own FAQs
CREATE POLICY "Users can manage own FAQs"
    ON faq_items FOR ALL
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- INQUIRIES
-- -----------------------------------------------------------------------------

-- Users can view inquiries sent to them
CREATE POLICY "Users can view own inquiries"
    ON inquiries FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own inquiries (status changes)
CREATE POLICY "Users can update own inquiries"
    ON inquiries FOR UPDATE
    USING (auth.uid() = user_id);

-- Anyone can create an inquiry (to any published profile)
CREATE POLICY "Anyone can create inquiry to published profile"
    ON inquiries FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_published = true)
    );

-- -----------------------------------------------------------------------------
-- INQUIRY MESSAGES
-- -----------------------------------------------------------------------------

-- Users can view messages for their inquiries
CREATE POLICY "Users can view messages for own inquiries"
    ON inquiry_messages FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM inquiries WHERE id = inquiry_id AND user_id = auth.uid())
    );

-- Users can create messages for their inquiries
CREATE POLICY "Users can create messages for own inquiries"
    ON inquiry_messages FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM inquiries WHERE id = inquiry_id AND user_id = auth.uid())
    );

-- -----------------------------------------------------------------------------
-- AVAILABILITY & BLOCKED DATES
-- -----------------------------------------------------------------------------

-- Public can view availability of published profiles
CREATE POLICY "Public can view availability"
    ON availability FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_published = true)
    );

-- Users can manage their own availability
CREATE POLICY "Users can manage own availability"
    ON availability FOR ALL
    USING (auth.uid() = user_id);

-- Public can view blocked dates of published profiles
CREATE POLICY "Public can view blocked dates"
    ON blocked_dates FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_published = true)
    );

-- Users can manage their own blocked dates
CREATE POLICY "Users can manage own blocked dates"
    ON blocked_dates FOR ALL
    USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- BOOKINGS
-- -----------------------------------------------------------------------------

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings"
    ON bookings FOR UPDATE
    USING (auth.uid() = user_id);

-- Service role can create bookings
CREATE POLICY "Service role can create bookings"
    ON bookings FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- AI SETTINGS
-- -----------------------------------------------------------------------------

-- Users can view and manage their own AI settings
CREATE POLICY "Users can manage own AI settings"
    ON ai_settings FOR ALL
    USING (auth.uid() = user_id);

-- Public can view chatbot settings for published profiles (for widget)
CREATE POLICY "Public can view chatbot settings"
    ON ai_settings FOR SELECT
    USING (
        chatbot_enabled = true AND
        EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_published = true)
    );

-- -----------------------------------------------------------------------------
-- AI CONVERSATIONS
-- -----------------------------------------------------------------------------

-- Users can view conversations on their profile
CREATE POLICY "Users can view own conversations"
    ON ai_conversations FOR SELECT
    USING (auth.uid() = user_id);

-- Anyone can create conversation (for chatbot)
CREATE POLICY "Anyone can create conversation"
    ON ai_conversations FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = user_id AND is_published = true)
    );

-- Service role can update conversations
CREATE POLICY "Service role can update conversations"
    ON ai_conversations FOR UPDATE
    USING (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- AI CONVERSATION MESSAGES
-- -----------------------------------------------------------------------------

-- Users can view messages for conversations on their profile
CREATE POLICY "Users can view conversation messages"
    ON ai_conversation_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ai_conversations 
            WHERE id = conversation_id AND user_id = auth.uid()
        )
    );

-- Service role can create messages
CREATE POLICY "Service role can create messages"
    ON ai_conversation_messages FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- ANALYTICS EVENTS
-- -----------------------------------------------------------------------------

-- Users can view their own analytics
CREATE POLICY "Users can view own analytics"
    ON analytics_events FOR SELECT
    USING (auth.uid() = user_id);

-- Service role can create analytics events
CREATE POLICY "Service role can create analytics"
    ON analytics_events FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- STRIPE ACCOUNTS
-- -----------------------------------------------------------------------------

-- Users can view their own Stripe account
CREATE POLICY "Users can view own Stripe account"
    ON stripe_accounts FOR SELECT
    USING (auth.uid() = user_id);

-- Service role can manage Stripe accounts
CREATE POLICY "Service role can manage Stripe accounts"
    ON stripe_accounts FOR ALL
    USING (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- TRANSACTIONS
-- -----------------------------------------------------------------------------

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Service role can create transactions
CREATE POLICY "Service role can create transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

-- -----------------------------------------------------------------------------
-- STORAGE POLICIES
-- -----------------------------------------------------------------------------

-- Avatars: Users can upload their own
CREATE POLICY "Users can upload own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::TEXT = (storage.foldername(name))[1]
    );

-- Avatars: Public read
CREATE POLICY "Avatars are publicly viewable"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

-- Portfolio audio: Users can upload their own
CREATE POLICY "Users can upload own portfolio audio"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'portfolio-audio' AND
        auth.uid()::TEXT = (storage.foldername(name))[1]
    );

-- Portfolio audio: Public read
CREATE POLICY "Portfolio audio is publicly viewable"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'portfolio-audio');

-- Products: Users can upload their own (private bucket)
CREATE POLICY "Users can upload own products"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'products' AND
        auth.uid()::TEXT = (storage.foldername(name))[1]
    );

-- Products: Only purchasers can download (handled by signed URLs)
```

---

# 4. API ENDPOINT SPECIFICATIONS

## 4.1 Public API Routes

### GET `/api/profiles/[username]`

**Description:** Get public profile data

**Response:**
```typescript
{
  success: boolean;
  data: {
    id: string;
    username: string;
    display_name: string;
    tagline: string | null;
    bio: string | null;
    avatar_url: string | null;
    banner_url: string | null;
    location: string | null;
    theme: string;
    social_links: Record<string, string>;
    genres: string[];
    portfolio: PortfolioItem[];
    services: Service[];
    products: Product[];
    credits: Credit[];
    testimonials: Testimonial[];
    faq: FAQItem[];
  };
  error?: string;
}
```

### POST `/api/inquiries`

**Description:** Submit inquiry to engineer

**Request:**
```typescript
{
  username: string;        // Engineer's username
  client_name: string;     // Required, 2-100 chars
  client_email: string;    // Required, valid email
  client_phone?: string;   // Optional
  service_id?: string;     // Optional, UUID
  message: string;         // Required, 10-5000 chars
  reference_links?: string[]; // Optional, max 5 URLs
  project_type?: string;   // Optional
  budget_range?: string;   // Optional
  timeline?: string;       // Optional
  source?: string;         // Optional tracking
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  data?: {
    id: string;
    message: string; // "Your inquiry has been sent!"
  };
  error?: string;
  validation_errors?: Record<string, string>;
}
```

### POST `/api/bookings`

**Description:** Create a booking

**Request:**
```typescript
{
  username: string;
  service_id: string;
  client_name: string;
  client_email: string;
  scheduled_date: string;  // YYYY-MM-DD
  scheduled_time?: string; // HH:MM
  project_notes?: string;
}
```

### GET `/api/profiles/[username]/availability`

**Description:** Get available time slots

**Query Params:**
```
?month=2025-01&service_id=uuid
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    timezone: string;
    available_dates: {
      date: string;       // YYYY-MM-DD
      slots: string[];    // ['09:00', '10:00', ...]
    }[];
  };
}
```

## 4.2 Protected API Routes

### GET `/api/me/profile`

**Description:** Get authenticated user's profile

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** Full profile data including unpublished fields

### PUT `/api/me/profile`

**Description:** Update profile

**Request:**
```typescript
{
  display_name?: string;
  tagline?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  theme?: string;
  social_links?: Record<string, string>;
  genres?: string[];
  is_published?: boolean;
}
```

### POST `/api/me/portfolio`

**Description:** Create portfolio item

**Request:** (multipart/form-data)
```
title: string (required)
artist_name: string
description: string
genre: string
release_date: string (YYYY-MM-DD)
project_type: string
is_featured: boolean
before_audio: File (audio/*)
after_audio: File (audio/*)
cover_image: File (image/*)
spotify_url: string
youtube_url: string
```

### POST `/api/ai/generate`

**Description:** Generate AI content

**Request:**
```typescript
{
  type: 'bio' | 'tagline' | 'service_description' | 'inquiry_response' | 'profile_optimization';
  context: {
    // For bio
    years_experience?: number;
    genres?: string[];
    notable_credits?: string[];
    unique_approach?: string;
    target_clients?: string;
    
    // For inquiry_response
    inquiry_id?: string;
    
    // For service_description
    service_name?: string;
    service_type?: string;
    price?: number;
    features?: string[];
  };
  tone?: 'professional' | 'friendly' | 'casual' | 'warm' | 'direct';
}
```

**Response:**
```typescript
{
  success: boolean;
  data?: {
    generated_content: string;
    alternatives?: string[]; // For taglines, provides 3 options
    suggestions?: string[];  // For optimization
    tokens_used: number;
  };
  error?: string;
}
```

### POST `/api/ai/chat`

**Description:** Chatbot conversation (for profile widget)

**Request:**
```typescript
{
  profile_username: string;
  conversation_id?: string; // Omit for new conversation
  message: string;
  visitor_id: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  data?: {
    conversation_id: string;
    response: string;
    should_escalate: boolean;
    suggested_actions?: Array<{
      type: 'book' | 'inquiry' | 'link';
      label: string;
      data: any;
    }>;
  };
}
```

## 4.3 Webhook Endpoints

### POST `/api/webhooks/stripe`

**Handled Events:**
```typescript
const HANDLED_EVENTS = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'account.updated', // Stripe Connect
  'transfer.created',
];
```

**Security:**
- Verify Stripe signature
- Use `STRIPE_WEBHOOK_SECRET`
- Idempotency check on event ID

---

# 5. FORM VALIDATION RULES

## 5.1 Profile Fields

```typescript
const profileValidation = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-z0-9_-]+$/,
    messages: {
      required: 'Username is required',
      minLength: 'Username must be at least 3 characters',
      maxLength: 'Username cannot exceed 30 characters',
      pattern: 'Username can only contain lowercase letters, numbers, underscores, and hyphens',
    },
  },
  display_name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    messages: {
      required: 'Display name is required',
      minLength: 'Display name must be at least 2 characters',
      maxLength: 'Display name cannot exceed 50 characters',
    },
  },
  tagline: {
    required: false,
    maxLength: 150,
    messages: {
      maxLength: 'Tagline cannot exceed 150 characters',
    },
  },
  bio: {
    required: false,
    maxLength: 2000,
    messages: {
      maxLength: 'Bio cannot exceed 2000 characters',
    },
  },
  location: {
    required: false,
    maxLength: 100,
  },
};
```

## 5.2 Inquiry Fields

```typescript
const inquiryValidation = {
  client_name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    messages: {
      required: 'Please enter your name',
      minLength: 'Name must be at least 2 characters',
    },
  },
  client_email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      required: 'Please enter your email',
      pattern: 'Please enter a valid email address',
    },
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 5000,
    messages: {
      required: 'Please enter a message',
      minLength: 'Message must be at least 10 characters',
      maxLength: 'Message cannot exceed 5000 characters',
    },
  },
  reference_links: {
    maxItems: 5,
    itemPattern: /^https?:\/\/.+/,
    messages: {
      maxItems: 'Maximum 5 reference links allowed',
      itemPattern: 'Please enter valid URLs',
    },
  },
};
```

## 5.3 Service Fields

```typescript
const serviceValidation = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  description: {
    maxLength: 1000,
  },
  price: {
    required: false,
    min: 0,
    max: 100000,
    messages: {
      min: 'Price cannot be negative',
      max: 'Price cannot exceed $100,000',
    },
  },
  turnaround_days: {
    min: 1,
    max: 365,
  },
  revisions_included: {
    min: 0,
    max: 100,
  },
  features: {
    maxItems: 10,
    itemMaxLength: 100,
  },
};
```

## 5.4 Authentication Fields

```typescript
const authValidation = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      required: 'Email is required',
      pattern: 'Please enter a valid email address',
    },
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 72, // bcrypt limit
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    messages: {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters',
      pattern: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    },
  },
  password_confirm: {
    required: true,
    matchField: 'password',
    messages: {
      required: 'Please confirm your password',
      matchField: 'Passwords do not match',
    },
  },
};
```

---

# 6. FILE UPLOAD SPECIFICATIONS

## 6.1 Image Processing

```typescript
const imageConfig = {
  avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    outputFormat: 'webp',
    dimensions: {
      width: 400,
      height: 400,
    },
    quality: 85,
    variants: [
      { suffix: '_sm', width: 100, height: 100 },
      { suffix: '_md', width: 200, height: 200 },
      { suffix: '_lg', width: 400, height: 400 },
    ],
  },
  banner: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    outputFormat: 'webp',
    dimensions: {
      width: 1920,
      height: 400,
    },
    quality: 85,
  },
  portfolio_cover: {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    outputFormat: 'webp',
    dimensions: {
      width: 800,
      height: 800,
    },
    quality: 85,
  },
  credit_logo: {
    maxSize: 2 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    dimensions: {
      maxWidth: 400,
      maxHeight: 200,
    },
  },
};
```

## 6.2 Audio Processing

```typescript
const audioConfig = {
  portfolio: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp4'],
    maxDuration: 600, // 10 minutes in seconds
    outputFormat: 'mp3',
    outputBitrate: 192, // kbps
    generateWaveform: true,
    waveformSamples: 200, // points for visualization
  },
  product_preview: {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: ['audio/mpeg'],
    maxDuration: 60, // 1 minute preview
  },
};
```

## 6.3 Product Files

```typescript
const productConfig = {
  maxSize: 500 * 1024 * 1024, // 500MB
  allowedTypes: [
    'application/zip',
    'application/x-zip-compressed',
    'audio/mpeg',
    'audio/wav',
  ],
  scanForVirus: true,
  generateSignedUrl: true,
  signedUrlExpiry: 3600, // 1 hour
};
```

---

# 7. STRIPE CONFIGURATION

## 7.1 Products & Prices

```typescript
const stripeProducts = {
  pro: {
    id: 'prod_MixExpertsPro',
    name: 'MixExperts Pro',
    description: 'Unlimited portfolio, 0% fees, custom domain, booking calendar',
    prices: {
      monthly: {
        id: 'price_ProMonthly',
        amount: 1900, // $19.00
        interval: 'month',
      },
      yearly: {
        id: 'price_ProYearly',
        amount: 19000, // $190.00 (2 months free)
        interval: 'year',
      },
    },
  },
  ai_addon: {
    id: 'prod_MixExpertsAI',
    name: 'AI Assistant Add-on',
    description: 'AI copywriting, client response drafts, chatbot widget',
    prices: {
      monthly: {
        id: 'price_AIMonthly',
        amount: 1200, // $12.00
        interval: 'month',
      },
      yearly: {
        id: 'price_AIYearly',
        amount: 12000, // $120.00 (2 months free)
        interval: 'year',
      },
    },
  },
  enterprise: {
    id: 'prod_MixExpertsEnterprise',
    name: 'MixExperts Enterprise',
    description: 'Team accounts, white-label, API access, priority support',
    prices: {
      monthly: {
        id: 'price_EnterpriseMonthly',
        amount: 4900, // $49.00
        interval: 'month',
      },
      yearly: {
        id: 'price_EnterpriseYearly',
        amount: 49000, // $490.00 (2 months free)
        interval: 'year',
      },
    },
  },
};
```

## 7.2 Stripe Connect Configuration

```typescript
const stripeConnectConfig = {
  accountType: 'express',
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true },
  },
  businessType: 'individual',
  settings: {
    payouts: {
      schedule: {
        interval: 'daily',
      },
    },
  },
  // Platform fee structure
  fees: {
    free_tier_percentage: 20, // 20% on transactions
    marketplace_percentage: 15, // 15% on product sales
    booking_percentage: 0, // Pro users keep 100%
  },
};
```

## 7.3 Webhook Event Handlers

```typescript
const webhookHandlers = {
  'checkout.session.completed': async (event) => {
    // Handle successful checkout
    // - Create/update subscription
    // - Send welcome email
    // - Update user plan
  },
  
  'customer.subscription.updated': async (event) => {
    // Handle subscription changes
    // - Update plan in database
    // - Handle upgrade/downgrade
    // - Update feature access
  },
  
  'customer.subscription.deleted': async (event) => {
    // Handle cancellation
    // - Downgrade to free
    // - Send cancellation email
    // - Retain data for grace period
  },
  
  'invoice.payment_failed': async (event) => {
    // Handle failed payment
    // - Send dunning email
    // - Mark subscription as past_due
    // - Schedule retry
  },
  
  'account.updated': async (event) => {
    // Stripe Connect account update
    // - Update charges_enabled status
    // - Update payouts_enabled status
  },
};
```

---

# 8. EMAIL CONFIGURATION

## 8.1 Email Templates (IDs)

```typescript
const emailTemplates = {
  // Auth
  welcome: 'tmpl_welcome',
  email_verification: 'tmpl_email_verify',
  password_reset: 'tmpl_password_reset',
  
  // Inquiries
  inquiry_received: 'tmpl_inquiry_received',
  inquiry_reply: 'tmpl_inquiry_reply',
  inquiry_followup: 'tmpl_inquiry_followup',
  
  // Bookings
  booking_request: 'tmpl_booking_request',
  booking_confirmed: 'tmpl_booking_confirmed',
  booking_reminder: 'tmpl_booking_reminder',
  booking_cancelled: 'tmpl_booking_cancelled',
  
  // Products
  product_purchase: 'tmpl_product_purchase',
  product_download: 'tmpl_product_download',
  
  // Billing
  subscription_created: 'tmpl_subscription_created',
  subscription_cancelled: 'tmpl_subscription_cancelled',
  payment_failed: 'tmpl_payment_failed',
  invoice_paid: 'tmpl_invoice_paid',
  
  // Engagement
  weekly_summary: 'tmpl_weekly_summary',
  profile_tips: 'tmpl_profile_tips',
  inactive_reminder: 'tmpl_inactive_reminder',
};
```

## 8.2 Email Sending Config

```typescript
const emailConfig = {
  provider: 'resend',
  from: {
    default: 'MixExperts <hello@mixexperts.com>',
    support: 'MixExperts Support <support@mixexperts.com>',
    billing: 'MixExperts Billing <billing@mixexperts.com>',
  },
  replyTo: 'support@mixexperts.com',
  
  // Rate limits
  rateLimits: {
    perUser: {
      hour: 20,
      day: 100,
    },
    global: {
      minute: 100,
      hour: 5000,
    },
  },
  
  // Retry config
  retry: {
    attempts: 3,
    backoff: 'exponential',
    initialDelay: 1000, // ms
  },
};
```

---

# 9. ANALYTICS EVENTS

## 9.1 Event Definitions

```typescript
const analyticsEvents = {
  // Profile Events
  PROFILE_VIEW: {
    name: 'profile_view',
    properties: ['profile_id', 'source', 'referrer'],
  },
  PROFILE_SHARE: {
    name: 'profile_share',
    properties: ['profile_id', 'share_method'],
  },
  
  // Portfolio Events
  PORTFOLIO_PLAY: {
    name: 'portfolio_play',
    properties: ['profile_id', 'item_id', 'version'], // version: 'before' | 'after'
  },
  PORTFOLIO_TOGGLE: {
    name: 'portfolio_toggle',
    properties: ['profile_id', 'item_id', 'from', 'to'],
  },
  PORTFOLIO_COMPLETE: {
    name: 'portfolio_complete',
    properties: ['profile_id', 'item_id', 'listen_duration'],
  },
  
  // Service Events
  SERVICE_VIEW: {
    name: 'service_view',
    properties: ['profile_id', 'service_id'],
  },
  SERVICE_BOOK_CLICK: {
    name: 'service_book_click',
    properties: ['profile_id', 'service_id'],
  },
  
  // Inquiry Events
  INQUIRY_START: {
    name: 'inquiry_start',
    properties: ['profile_id'],
  },
  INQUIRY_SUBMIT: {
    name: 'inquiry_submit',
    properties: ['profile_id', 'service_id', 'has_references'],
  },
  INQUIRY_REPLY: {
    name: 'inquiry_reply',
    properties: ['inquiry_id', 'response_time_minutes', 'ai_assisted'],
  },
  
  // Product Events
  PRODUCT_VIEW: {
    name: 'product_view',
    properties: ['profile_id', 'product_id'],
  },
  PRODUCT_PREVIEW_PLAY: {
    name: 'product_preview_play',
    properties: ['profile_id', 'product_id'],
  },
  PRODUCT_PURCHASE: {
    name: 'product_purchase',
    properties: ['profile_id', 'product_id', 'price'],
  },
  
  // Booking Events
  BOOKING_START: {
    name: 'booking_start',
    properties: ['profile_id', 'service_id'],
  },
  BOOKING_COMPLETE: {
    name: 'booking_complete',
    properties: ['profile_id', 'service_id', 'booking_id', 'total_amount'],
  },
  
  // Chatbot Events
  CHATBOT_OPEN: {
    name: 'chatbot_open',
    properties: ['profile_id'],
  },
  CHATBOT_MESSAGE: {
    name: 'chatbot_message',
    properties: ['profile_id', 'conversation_id', 'message_count'],
  },
  CHATBOT_ESCALATE: {
    name: 'chatbot_escalate',
    properties: ['profile_id', 'conversation_id'],
  },
  
  // Conversion Events
  SIGNUP_START: {
    name: 'signup_start',
    properties: ['source'],
  },
  SIGNUP_COMPLETE: {
    name: 'signup_complete',
    properties: ['source', 'referrer'],
  },
  UPGRADE_START: {
    name: 'upgrade_start',
    properties: ['from_plan', 'to_plan'],
  },
  UPGRADE_COMPLETE: {
    name: 'upgrade_complete',
    properties: ['from_plan', 'to_plan', 'billing_period'],
  },
};
```

---

# 10. SEO CONFIGURATION

## 10.1 Dynamic Meta Tags

```typescript
const seoConfig = {
  defaults: {
    siteName: 'MixExperts',
    titleSuffix: ' | MixExperts',
    defaultDescription: 'Professional portfolio websites for mixing and mastering engineers. Showcase your work, book clients, and grow your audio engineering business.',
    defaultImage: 'https://mixexperts.com/og-image.png',
    twitterHandle: '@mixexperts',
  },
  
  pages: {
    home: {
      title: 'MixExperts — Professional Portfolios for Audio Engineers',
      description: 'Create a stunning portfolio website in minutes. Showcase before/after audio, book clients, and sell digital products.',
    },
    pricing: {
      title: 'Pricing',
      description: 'Simple, transparent pricing for mixing and mastering engineers. Start free, upgrade when you need more.',
    },
    profile: {
      // Dynamic
      titleTemplate: '{display_name} — {tagline} | MixExperts',
      descriptionTemplate: '{bio_excerpt}',
    },
  },
  
  structuredData: {
    organization: {
      '@type': 'Organization',
      name: 'MixExperts',
      url: 'https://mixexperts.com',
      logo: 'https://mixexperts.com/logo.png',
      sameAs: [
        'https://twitter.com/mixexperts',
        'https://instagram.com/mixexperts',
      ],
    },
    profile: {
      '@type': 'Person',
      // Dynamic fields
    },
  },
};
```

---

# 11. DEPLOYMENT CONFIGURATION

## 11.1 Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"],
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    },
    "api/webhooks/stripe.ts": {
      "maxDuration": 60
    },
    "api/ai/**/*.ts": {
      "maxDuration": 60
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ],
  "redirects": [
    { "source": "/app", "destination": "/dashboard", "permanent": true },
    { "source": "/login", "destination": "/auth/login", "permanent": false },
    { "source": "/signup", "destination": "/auth/signup", "permanent": false }
  ],
  "rewrites": [
    { "source": "/sitemap.xml", "destination": "/api/sitemap" },
    { "source": "/robots.txt", "destination": "/api/robots" }
  ]
}
```

## 11.2 Environment Setup by Stage

```bash
# Development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Use Stripe test keys
# Use Supabase local or dev project

# Staging
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://staging.mixexperts.com
# Use Stripe test keys
# Use Supabase staging project

# Production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://mixexperts.com
# Use Stripe live keys
# Use Supabase production project
```

---

**END OF IMPLEMENTATION DETAILS**

---

*This document provides all technical specifications needed for implementation. Reference alongside the Master Platform Blueprint and Design Specification.*
