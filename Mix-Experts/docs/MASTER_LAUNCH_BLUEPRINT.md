# MixExperts Master Launch Blueprint

**Version:** 1.0
**Created:** December 27, 2025
**Status:** Pre-Launch

---

## Executive Summary

This document provides a comprehensive, phase-by-phase implementation plan to bring MixExperts from its current state (frontend complete, Supabase/Stripe configured) to a fully functional, revenue-generating platform ready for public launch.

**Current Status:**
- Frontend UI: 95% complete
- Supabase Connection: Configured
- Stripe Connection: Configured
- Database Schema: NOT deployed
- Authentication: NOT wired
- Payments: NOT functional
- File Uploads: NOT functional

---

## Phase Overview

| Phase | Name | Stages | Priority |
|-------|------|--------|----------|
| 1 | Database Foundation | 15 | CRITICAL |
| 2 | Authentication & User Management | 12 | CRITICAL |
| 3 | Engineer Profile & Portfolio | 14 | CRITICAL |
| 4 | Services & Booking System | 12 | CRITICAL |
| 5 | Stripe Connect & Payouts | 15 | CRITICAL |
| 6 | Subscription Billing | 10 | CRITICAL |
| 7 | Digital Products Marketplace | 12 | HIGH |
| 8 | Messaging & Inbox | 10 | HIGH |
| 9 | Analytics & Dashboard | 10 | MEDIUM |
| 10 | Polish, Testing & Launch | 12 | CRITICAL |

**Total Stages: 122**

---

# PHASE 1: Database Foundation
**Priority:** CRITICAL
**Estimated Effort:** 2-3 days
**Dependencies:** Supabase project access

## Stage 1.1: Core User Tables
Create the foundational user and profile tables in Supabase SQL Editor.

```sql
-- profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  tagline TEXT,
  location TEXT,
  timezone TEXT DEFAULT 'America/Los_Angeles',
  role TEXT NOT NULL CHECK (role IN ('engineer', 'artist')) DEFAULT 'engineer',
  theme TEXT DEFAULT 'amber',
  is_published BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  stripe_customer_id TEXT,
  stripe_account_id TEXT,
  stripe_account_status TEXT DEFAULT 'not_connected',
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_status TEXT DEFAULT 'inactive',
  ai_credits_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## Stage 1.2: Social Links Table
```sql
CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Social links are viewable with profile"
  ON public.social_links FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = social_links.profile_id
    AND (profiles.is_published = true OR profiles.id = auth.uid())
  ));

CREATE POLICY "Users can manage their own social links"
  ON public.social_links FOR ALL
  USING (profile_id = auth.uid());
```

## Stage 1.3: Portfolio Items Table
```sql
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist_name TEXT,
  genre TEXT,
  release_date DATE,
  description TEXT,
  before_audio_url TEXT,
  after_audio_url TEXT,
  cover_image_url TEXT,
  spotify_url TEXT,
  apple_music_url TEXT,
  youtube_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolio items are viewable with profile"
  ON public.portfolio_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = portfolio_items.profile_id
    AND (profiles.is_published = true OR profiles.id = auth.uid())
  ));

CREATE POLICY "Users can manage their own portfolio items"
  ON public.portfolio_items FOR ALL
  USING (profile_id = auth.uid());
```

## Stage 1.4: Services Table
```sql
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  turnaround_days INTEGER NOT NULL,
  revision_count INTEGER DEFAULT 2,
  extra_revision_price DECIMAL(10,2) DEFAULT 25.00,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]',
  requirements TEXT,
  delivery_format TEXT,
  terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable with profile"
  ON public.services FOR SELECT
  USING (is_active = true AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = services.profile_id
    AND (profiles.is_published = true OR profiles.id = auth.uid())
  ));

CREATE POLICY "Users can manage their own services"
  ON public.services FOR ALL
  USING (profile_id = auth.uid());
```

## Stage 1.5: Service Add-ons Table
```sql
CREATE TABLE public.service_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.service_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Add-ons viewable with service"
  ON public.service_addons FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.services
    WHERE services.id = service_addons.service_id
    AND services.is_active = true
  ));

CREATE POLICY "Users can manage their own add-ons"
  ON public.service_addons FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.services
    WHERE services.id = service_addons.service_id
    AND services.profile_id = auth.uid()
  ));
```

## Stage 1.6: Turnaround Options Table
```sql
CREATE TABLE public.turnaround_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  days INTEGER NOT NULL,
  price_multiplier DECIMAL(3,2) DEFAULT 1.00,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.turnaround_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Turnaround options viewable with service"
  ON public.turnaround_options FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.services
    WHERE services.id = turnaround_options.service_id
  ));

CREATE POLICY "Users can manage their own turnaround options"
  ON public.turnaround_options FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.services
    WHERE services.id = turnaround_options.service_id
    AND services.profile_id = auth.uid()
  ));
```

## Stage 1.7: Digital Products Table
```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  product_type TEXT CHECK (product_type IN ('preset', 'template', 'sample_pack', 'course', 'other')),
  file_url TEXT,
  file_size_bytes BIGINT,
  preview_url TEXT,
  cover_image_url TEXT,
  license_type TEXT DEFAULT 'personal' CHECK (license_type IN ('personal', 'commercial', 'unlimited')),
  license_terms TEXT,
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, slug)
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable when active"
  ON public.products FOR SELECT
  USING (is_active = true AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = products.profile_id
    AND profiles.is_published = true
  ));

CREATE POLICY "Users can manage their own products"
  ON public.products FOR ALL
  USING (profile_id = auth.uid());
```

## Stage 1.8: Orders Table
```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  engineer_id UUID REFERENCES public.profiles(id),
  client_id UUID REFERENCES public.profiles(id),
  client_email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  service_id UUID REFERENCES public.services(id),
  service_name TEXT NOT NULL,

  -- Pricing
  base_price DECIMAL(10,2) NOT NULL,
  addons_total DECIMAL(10,2) DEFAULT 0,
  rush_fee DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  platform_fee_percent DECIMAL(5,2) DEFAULT 0,
  stripe_fee DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  engineer_payout DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Stripe
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  stripe_transfer_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),

  -- Order details
  turnaround_days INTEGER NOT NULL,
  due_date TIMESTAMPTZ,
  revision_count INTEGER DEFAULT 0,
  max_revisions INTEGER DEFAULT 2,

  -- Status workflow
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'in_progress', 'review',
    'revision', 'completed', 'delivered', 'cancelled', 'refunded'
  )),

  -- Metadata
  notes TEXT,
  requirements TEXT,
  selected_addons JSONB DEFAULT '[]',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Engineers can view their orders"
  ON public.orders FOR SELECT
  USING (engineer_id = auth.uid());

CREATE POLICY "Clients can view their orders"
  ON public.orders FOR SELECT
  USING (client_id = auth.uid() OR client_email = auth.email());

CREATE POLICY "Engineers can update their orders"
  ON public.orders FOR UPDATE
  USING (engineer_id = auth.uid());
```

## Stage 1.9: Order Files Table
```sql
CREATE TABLE public.order_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES public.profiles(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  file_type TEXT,
  is_delivery BOOLEAN DEFAULT false,
  is_revision BOOLEAN DEFAULT false,
  revision_number INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants can view files"
  ON public.order_files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_files.order_id
    AND (orders.engineer_id = auth.uid() OR orders.client_id = auth.uid())
  ));

CREATE POLICY "Order participants can upload files"
  ON public.order_files FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_files.order_id
    AND (orders.engineer_id = auth.uid() OR orders.client_id = auth.uid())
  ));
```

## Stage 1.10: Product Purchases Table
```sql
CREATE TABLE public.product_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id),
  buyer_id UUID REFERENCES public.profiles(id),
  buyer_email TEXT NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) NOT NULL,

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  platform_fee_percent DECIMAL(5,2) DEFAULT 15.00,
  seller_payout DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Stripe
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  stripe_transfer_id TEXT,
  payment_status TEXT DEFAULT 'pending',

  -- Download
  download_url TEXT,
  download_expires_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT 5,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view their sales"
  ON public.product_purchases FOR SELECT
  USING (seller_id = auth.uid());

CREATE POLICY "Buyers can view their purchases"
  ON public.product_purchases FOR SELECT
  USING (buyer_id = auth.uid() OR buyer_email = auth.email());
```

## Stage 1.11: Messages Table
```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL,
  sender_id UUID REFERENCES public.profiles(id),
  recipient_id UUID REFERENCES public.profiles(id) NOT NULL,
  sender_email TEXT,
  sender_name TEXT,
  subject TEXT,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_inquiry BOOLEAN DEFAULT false,
  inquiry_status TEXT DEFAULT 'new' CHECK (inquiry_status IN ('new', 'read', 'replied', 'converted', 'archived')),
  order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON public.messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() OR sender_id IS NULL);

CREATE POLICY "Recipients can update message status"
  ON public.messages FOR UPDATE
  USING (recipient_id = auth.uid());
```

## Stage 1.12: Testimonials Table
```sql
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  reviewer_id UUID REFERENCES public.profiles(id),
  reviewer_name TEXT NOT NULL,
  reviewer_title TEXT,
  reviewer_avatar_url TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  content TEXT NOT NULL,
  engineer_response TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public testimonials are viewable"
  ON public.testimonials FOR SELECT
  USING (is_public = true);

CREATE POLICY "Engineers can manage their testimonials"
  ON public.testimonials FOR ALL
  USING (profile_id = auth.uid());
```

## Stage 1.13: Credits Table
```sql
CREATE TABLE public.credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  logo_url TEXT,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Credits are viewable with profile"
  ON public.credits FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = credits.profile_id
    AND profiles.is_published = true
  ));

CREATE POLICY "Users can manage their own credits"
  ON public.credits FOR ALL
  USING (profile_id = auth.uid());
```

## Stage 1.14: Subscriptions Table
```sql
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'past_due', 'cancelled', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMPTZ,
  ai_addon_active BOOLEAN DEFAULT false,
  ai_credits_monthly INTEGER DEFAULT 0,
  ai_credits_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions FOR SELECT
  USING (profile_id = auth.uid());

-- Service role only for updates (via webhooks)
CREATE POLICY "Service role can update subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.role() = 'service_role');
```

## Stage 1.15: Analytics Events Table
```sql
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'profile_view', 'portfolio_play', 'service_view',
    'product_view', 'inquiry_submit', 'booking_start', 'booking_complete'
  )),
  visitor_id TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- No RLS - insert only via service role or anon for tracking
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Engineers can view their analytics"
  ON public.analytics_events FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);

-- Index for performance
CREATE INDEX idx_analytics_profile_date ON public.analytics_events(profile_id, created_at DESC);
```

---

# PHASE 2: Authentication & User Management
**Priority:** CRITICAL
**Estimated Effort:** 2-3 days
**Dependencies:** Phase 1 complete

## Stage 2.1: Profile Creation Trigger
Create a database trigger to automatically create a profile when a user signs up.

```sql
-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    LOWER(REPLACE(SPLIT_PART(NEW.email, '@', 1), '.', '')),
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'engineer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Stage 2.2: Wire Signup Form to Supabase
Update `src/components/auth/SignupForm.tsx` to use Supabase Auth.

**Required changes:**
- Import Supabase client
- Call `supabase.auth.signUp()` with email, password, and metadata
- Handle success/error states
- Redirect to email verification page

## Stage 2.3: Wire Login Form to Supabase
Update `src/components/auth/LoginForm.tsx` to use Supabase Auth.

**Required changes:**
- Import Supabase client
- Call `supabase.auth.signInWithPassword()`
- Handle success/error states
- Redirect to dashboard on success

## Stage 2.4: Email Verification Flow
Update `src/app/verify-email/page.tsx` to handle email confirmation.

**Required changes:**
- Check for confirmation token in URL
- Call `supabase.auth.verifyOtp()` or handle magic link
- Show success/error state
- Redirect to onboarding

## Stage 2.5: Password Reset Flow
Update `src/components/auth/ForgotPasswordForm.tsx` and `src/app/reset-password/page.tsx`.

**Required changes:**
- Call `supabase.auth.resetPasswordForEmail()`
- Handle token in reset-password page
- Call `supabase.auth.updateUser()` with new password

## Stage 2.6: Create Auth Context Provider
Create `src/contexts/AuthContext.tsx` to provide user state globally.

```typescript
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, data: SignupData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}
```

## Stage 2.7: Wrap App with Auth Provider
Update `src/app/layout.tsx` to wrap the app with AuthProvider.

## Stage 2.8: Update Middleware for Auth
Verify `src/middleware.ts` correctly:
- Redirects unauthenticated users from `/dashboard/*` to `/login`
- Redirects authenticated users from `/login`, `/signup` to `/dashboard`
- Refreshes session tokens

## Stage 2.9: Create Onboarding Flow
Update `src/app/onboarding/page.tsx` to:
- Collect username (with availability check)
- Collect display name
- Upload avatar (optional)
- Select primary role
- Save to profile in database

## Stage 2.10: Username Availability Check
Create API route `src/app/api/check-username/route.ts`:
- Query profiles table for existing username
- Return available: true/false
- Debounce on frontend

## Stage 2.11: Logout Functionality
Add logout button to dashboard that:
- Calls `supabase.auth.signOut()`
- Clears local state
- Redirects to homepage

## Stage 2.12: Session Persistence
Ensure sessions persist across page refreshes:
- Supabase handles this via cookies
- Verify middleware refreshes tokens
- Test session expiry and refresh

---

# PHASE 3: Engineer Profile & Portfolio
**Priority:** CRITICAL
**Estimated Effort:** 3-4 days
**Dependencies:** Phase 2 complete

## Stage 3.1: Create Storage Buckets
Create these buckets in Supabase Dashboard → Storage:

| Bucket | Public | Max Size | Allowed Types |
|--------|--------|----------|---------------|
| `avatars` | Yes | 5MB | image/* |
| `banners` | Yes | 10MB | image/* |
| `portfolio-audio` | Yes | 100MB | audio/* |
| `portfolio-images` | Yes | 10MB | image/* |
| `products` | No | 500MB | * |
| `product-previews` | Yes | 50MB | audio/* |
| `order-files` | No | 2GB | * |

## Stage 3.2: Storage Bucket Policies
```sql
-- Avatars bucket policy
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Repeat for other buckets with appropriate policies
```

## Stage 3.3: Profile Editor - Basic Info
Wire `src/app/dashboard/settings/page.tsx` to:
- Fetch profile from database on load
- Update profile on save
- Show loading/success/error states

## Stage 3.4: Avatar Upload Component
Create/update avatar upload to:
- Upload to `avatars` bucket
- Generate public URL
- Update profile.avatar_url
- Show preview before upload

## Stage 3.5: Banner Upload Component
Similar to avatar but for banner image.

## Stage 3.6: Portfolio Manager - Fetch Items
Wire `src/app/dashboard/portfolio/page.tsx` to:
- Fetch portfolio_items from database
- Display in grid with current UI
- Handle empty state

## Stage 3.7: Portfolio Manager - Create Item
Create modal/form to:
- Upload before/after audio files
- Upload cover image
- Fill metadata (title, artist, genre, etc.)
- Save to database
- Generate public URLs

## Stage 3.8: Portfolio Manager - Edit Item
Allow editing existing portfolio items:
- Pre-fill form with current data
- Allow replacing audio files
- Save updates to database

## Stage 3.9: Portfolio Manager - Delete Item
Add delete functionality:
- Confirm deletion
- Remove from database
- Delete files from storage

## Stage 3.10: Portfolio Manager - Reorder Items
Implement drag-and-drop reordering:
- Update display_order in database
- Optimistic UI updates

## Stage 3.11: Public Profile - Fetch Data
Wire `src/app/[username]/page.tsx` to:
- Fetch profile by username
- Fetch related data (portfolio, services, testimonials, credits)
- Handle 404 for non-existent profiles
- Handle unpublished profiles

## Stage 3.12: Before/After Audio Player
Ensure the audio player component works with real audio URLs from storage.

## Stage 3.13: Profile Publishing Toggle
Add publish/unpublish functionality:
- Toggle `is_published` in database
- Show preview before publishing
- Warn about incomplete profile

## Stage 3.14: Profile SEO Metadata
Generate dynamic metadata for public profiles:
- Page title: "{display_name} | MixExperts"
- Description from bio/tagline
- OG image from avatar/banner

---

# PHASE 4: Services & Booking System
**Priority:** CRITICAL
**Estimated Effort:** 3-4 days
**Dependencies:** Phase 3 complete

## Stage 4.1: Services Manager - Fetch Services
Wire `src/app/dashboard/services/page.tsx` to:
- Fetch services from database
- Display with current UI
- Handle empty state

## Stage 4.2: Services Manager - Create Service
Wire ServiceEditor component to:
- Save service to database
- Handle features array (JSONB)
- Save turnaround options
- Save add-ons

## Stage 4.3: Services Manager - Edit Service
Allow editing existing services:
- Pre-fill form
- Update in database
- Handle related records (add-ons, turnaround options)

## Stage 4.4: Services Manager - Delete Service
Add delete with:
- Confirm modal
- Check for active orders
- Cascade delete related records

## Stage 4.5: Public Service Page
Wire `src/app/[username]/services/[slug]/page.tsx` to:
- Fetch service by profile + slug
- Display with turnaround options
- Display add-ons
- Show booking CTA

## Stage 4.6: Booking Flow - Step 1 (Service Selection)
If not already selected, show service picker.

## Stage 4.7: Booking Flow - Step 2 (Options)
Wire to select:
- Turnaround option (affects price)
- Add-ons (affects price)
- Calculate total dynamically

## Stage 4.8: Booking Flow - Step 3 (Details)
Collect:
- Client name
- Client email
- Project details/notes
- Requirements

## Stage 4.9: Booking Flow - Step 4 (Checkout)
Integrate with Stripe Checkout (Phase 5).

## Stage 4.10: Order Confirmation Page
Show confirmation after successful payment:
- Order number
- Summary
- Next steps
- Expected delivery date

## Stage 4.11: Order Management - Engineer View
Wire `src/app/dashboard/projects/page.tsx` to:
- Fetch orders where engineer_id = current user
- Display with status
- Filter by status

## Stage 4.12: Order Detail Page
Wire `src/app/dashboard/projects/[id]/page.tsx` to:
- Fetch order details
- Show timeline
- Allow status updates
- File upload for deliveries

---

# PHASE 5: Stripe Connect & Payouts
**Priority:** CRITICAL
**Estimated Effort:** 3-4 days
**Dependencies:** Phase 4 complete

## Stage 5.1: Understand Platform Fee Structure

| Tier | Platform Fee | Stripe Fee | Engineer Receives |
|------|--------------|------------|-------------------|
| Free | 10% | 2.9% + $0.30 | ~87% |
| Pro | 0% | 2.9% + $0.30 | ~97% |
| Enterprise | 0% | 2.9% + $0.30 | ~97% |

**Digital Products:** 15% platform fee for all tiers.

**Important Tax Note:** The 10% service fee is platform revenue, not a pass-through. You (MixExperts) will receive 1099-K from Stripe for this income. Engineers receive their own 1099-K for their earnings if they exceed thresholds.

## Stage 5.2: Create Stripe Connect Onboarding Endpoint
Create `src/app/api/stripe/connect/route.ts`:

```typescript
// POST - Create Connect account and return onboarding link
export async function POST(request: Request) {
  // Get current user from session
  // Create Stripe Connect Express account
  // Generate onboarding link
  // Return link to frontend
}
```

## Stage 5.3: Stripe Connect Return URL Handler
Create `src/app/api/stripe/connect/callback/route.ts`:
- Handle return from Stripe onboarding
- Check account status
- Update profile.stripe_account_status
- Redirect to dashboard

## Stage 5.4: Stripe Connect Refresh URL Handler
Handle case where onboarding link expires:
- Generate new link
- Redirect user

## Stage 5.5: Dashboard - Connect Stripe Account UI
Add to Settings/Billing page:
- "Connect Stripe Account" button (if not connected)
- Account status display (pending, active, restricted)
- Payout settings link to Stripe Dashboard

## Stage 5.6: Check Stripe Account Status
Before allowing bookings, verify:
- `charges_enabled: true`
- `payouts_enabled: true`
- `details_submitted: true`

## Stage 5.7: Create Checkout Session Endpoint
Create `src/app/api/stripe/checkout/route.ts`:

```typescript
export async function POST(request: Request) {
  // Validate order data
  // Calculate fees:
  //   - Base price + add-ons + rush fee = subtotal
  //   - Platform fee (10% for free tier, 0% for pro)
  //   - Stripe fee estimate
  //   - Engineer payout = subtotal - platform fee

  // Create Checkout Session with:
  //   - payment_intent_data.application_fee_amount (platform fee in cents)
  //   - payment_intent_data.transfer_data.destination (engineer's stripe account)

  // Save order to database with status 'pending'
  // Return checkout URL
}
```

## Stage 5.8: Checkout Success Handler
Create `src/app/checkout/success/page.tsx`:
- Verify payment via session ID
- Update order status to 'confirmed'
- Show confirmation UI
- Send confirmation email

## Stage 5.9: Checkout Cancel Handler
Create `src/app/checkout/cancel/page.tsx`:
- Handle cancelled checkouts
- Clean up pending order
- Offer to try again

## Stage 5.10: Webhook - Handle Payment Success
Update webhook handler for `checkout.session.completed`:

```typescript
case 'checkout.session.completed': {
  const session = event.data.object;
  // Find order by stripe_checkout_session_id
  // Update order status to 'confirmed'
  // Update payment_status to 'succeeded'
  // Create notification for engineer
  // Send confirmation emails
}
```

## Stage 5.11: Webhook - Handle Transfer Success
Handle `transfer.created` or rely on checkout completion.

## Stage 5.12: Dashboard - Payout History
Show engineers their payout history:
- Fetch from Stripe API or cache locally
- Show pending vs. completed payouts

## Stage 5.13: Handle Refunds
Create refund endpoint:
- Calculate refund amount
- Issue Stripe refund
- Reverse transfer if applicable
- Update order status

## Stage 5.14: Handle Disputes
Webhook handler for `charge.dispute.created`:
- Notify engineer
- Update order status
- Provide evidence upload flow (future)

## Stage 5.15: Stripe Connect Documentation for Engineers
Create help page explaining:
- How to connect Stripe account
- Required information (SSN last 4, bank account)
- When payouts occur (2-day rolling basis)
- How to access Stripe Express Dashboard
- Tax implications (1099-K)

---

# PHASE 6: Subscription Billing
**Priority:** CRITICAL
**Estimated Effort:** 2-3 days
**Dependencies:** Phase 5 complete

## Stage 6.1: Create Stripe Products
In Stripe Dashboard, create:

| Product | Price ID | Amount |
|---------|----------|--------|
| Pro Monthly | price_pro_monthly | $19/mo |
| Pro Yearly | price_pro_yearly | $190/yr |
| AI Add-on Monthly | price_ai_monthly | $12/mo |
| AI Add-on Yearly | price_ai_yearly | $120/yr |
| Enterprise Monthly | price_enterprise_monthly | $49/mo |
| Enterprise Yearly | price_enterprise_yearly | $490/yr |

## Stage 6.2: Create Customer on Signup
When user creates account:
- Create Stripe Customer
- Store `stripe_customer_id` in profile

## Stage 6.3: Subscription Checkout Endpoint
Create `src/app/api/stripe/subscribe/route.ts`:
- Create Checkout Session in subscription mode
- Include customer ID
- Set success/cancel URLs

## Stage 6.4: Subscription Success Handler
On successful subscription:
- Update subscription record
- Update profile.subscription_tier
- Enable Pro features

## Stage 6.5: Webhook - Subscription Created
Handle `customer.subscription.created`:
- Create subscription record
- Update profile tier

## Stage 6.6: Webhook - Subscription Updated
Handle `customer.subscription.updated`:
- Update subscription status
- Handle upgrades/downgrades
- Reset AI credits on renewal

## Stage 6.7: Webhook - Subscription Deleted
Handle `customer.subscription.deleted`:
- Downgrade to free tier
- Update profile
- Send churn email

## Stage 6.8: Webhook - Invoice Paid
Handle `invoice.paid`:
- Extend subscription
- Reset monthly AI credits

## Stage 6.9: Webhook - Payment Failed
Handle `invoice.payment_failed`:
- Send dunning email
- Update subscription status to 'past_due'
- Grace period before downgrade

## Stage 6.10: Billing Portal
Create `src/app/api/stripe/portal/route.ts`:
- Generate Stripe Customer Portal link
- User can manage subscription, payment methods, invoices

---

# PHASE 7: Digital Products Marketplace
**Priority:** HIGH
**Estimated Effort:** 2-3 days
**Dependencies:** Phase 5 complete

## Stage 7.1: Products Manager - Fetch Products
Wire `src/app/dashboard/products/page.tsx` to:
- Fetch products from database
- Display in grid
- Handle empty state

## Stage 7.2: Products Manager - Create Product
Wire ProductEditor to:
- Upload product file (private bucket)
- Upload preview audio
- Upload cover image
- Set pricing and license
- Save to database

## Stage 7.3: Products Manager - Edit Product
Allow editing:
- Pre-fill form
- Replace files
- Update in database

## Stage 7.4: Products Manager - Delete Product
Delete with:
- Confirmation
- Remove files from storage
- Remove from database

## Stage 7.5: Public Product Page
Wire `src/app/[username]/products/[slug]/page.tsx` to:
- Fetch product details
- Show preview player
- Display license terms
- Purchase CTA

## Stage 7.6: Product Checkout
Create checkout flow:
- Calculate: price - 15% platform fee = seller payout
- Create Stripe Checkout with destination charge
- Handle success/cancel

## Stage 7.7: Download Delivery
After purchase:
- Generate signed URL (expires in 24 hours)
- Track download count
- Limit to 5 downloads

## Stage 7.8: Webhook - Product Purchase Success
On `checkout.session.completed` for products:
- Create product_purchase record
- Generate download URL
- Send email with link

## Stage 7.9: Purchase History - Buyer
Show buyer their purchased products:
- List with download links
- Re-request download if expired

## Stage 7.10: Sales Dashboard - Seller
Show seller their product sales:
- Revenue by product
- Download count
- Recent purchases

## Stage 7.11: Product Analytics
Track:
- Product views
- Add to cart
- Purchases
- Conversion rate

## Stage 7.12: License Enforcement UI
Display clear license terms:
- Personal: Use in personal projects
- Commercial: Use in commercial releases
- Unlimited: Full rights

---

# PHASE 8: Messaging & Inbox
**Priority:** HIGH
**Estimated Effort:** 2 days
**Dependencies:** Phase 2 complete

## Stage 8.1: Inquiry Form - Public Profile
Wire contact form on public profiles to:
- Submit inquiry to database
- Send notification to engineer
- Show success message

## Stage 8.2: Inbox - Fetch Messages
Wire `src/app/dashboard/inbox/page.tsx` to:
- Fetch messages where recipient = current user
- Group by thread
- Show unread count

## Stage 8.3: Inbox - Thread View
Display message thread:
- All messages in thread
- Chronological order
- Mark as read on view

## Stage 8.4: Inbox - Reply to Message
Allow sending replies:
- Add to thread
- Notify sender
- Update inquiry status

## Stage 8.5: Inbox - Mark as Read/Unread
Toggle read status for messages.

## Stage 8.6: Inbox - Archive/Delete
Allow archiving or deleting conversations.

## Stage 8.7: Inquiry Status Tracking
Track inquiry lifecycle:
- New → Read → Replied → Converted → Archived
- Filter by status

## Stage 8.8: Email Notifications
Send email when:
- New inquiry received
- Reply received
- Booking confirmed

## Stage 8.9: Template Responses
Allow engineers to:
- Create response templates
- Quick-insert templates
- Personalize before sending

## Stage 8.10: Link to Order
If inquiry converts to booking:
- Link message thread to order
- Show order status in thread

---

# PHASE 9: Analytics & Dashboard
**Priority:** MEDIUM
**Estimated Effort:** 2 days
**Dependencies:** Phases 3-8 complete

## Stage 9.1: Track Profile Views
Insert analytics event when:
- Public profile is viewed
- Include referrer, UTM params

## Stage 9.2: Track Portfolio Plays
Insert event when:
- Audio player is played
- Track which item

## Stage 9.3: Track Service Views
Insert event when:
- Service page viewed
- Track which service

## Stage 9.4: Track Inquiries
Insert event when:
- Inquiry form submitted

## Stage 9.5: Dashboard Home Stats
Wire dashboard to show:
- Profile views (last 30 days)
- Total inquiries
- Conversion rate
- Revenue (last 30 days)

## Stage 9.6: Analytics Page - Charts
Wire `src/app/dashboard/analytics/page.tsx` to:
- Views over time (line chart)
- Revenue over time (bar chart)
- Top portfolio items
- Traffic sources

## Stage 9.7: Revenue Breakdown
Show:
- Service revenue
- Product revenue
- By time period
- By service type

## Stage 9.8: Inquiry Analytics
Show:
- Inquiries over time
- Response time average
- Conversion rate
- By source

## Stage 9.9: Portfolio Performance
Show:
- Plays per item
- Most popular items
- Engagement rate

## Stage 9.10: Export Data
Allow CSV export of:
- Orders
- Revenue
- Analytics events

---

# PHASE 10: Polish, Testing & Launch
**Priority:** CRITICAL
**Estimated Effort:** 3-5 days
**Dependencies:** All previous phases

## Stage 10.1: Empty States
Ensure all pages have proper empty states:
- No portfolio items
- No services
- No orders
- No messages
- No products

## Stage 10.2: Loading States
Add loading skeletons/spinners for:
- All data fetches
- Form submissions
- File uploads

## Stage 10.3: Error Handling
Ensure graceful error handling:
- API errors show user-friendly messages
- Network errors have retry options
- Form validation errors are clear

## Stage 10.4: Mobile Responsiveness
Test and fix:
- All pages on mobile
- Touch interactions
- Audio player on mobile
- Forms on mobile

## Stage 10.5: Cross-Browser Testing
Test on:
- Chrome
- Safari
- Firefox
- Edge
- Mobile Safari
- Mobile Chrome

## Stage 10.6: Accessibility Audit
Verify:
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus indicators

## Stage 10.7: Performance Optimization
- Lighthouse score > 80
- Image optimization
- Code splitting
- Lazy loading

## Stage 10.8: Security Audit
Verify:
- All RLS policies working
- No exposed API keys
- Rate limiting on forms
- CSRF protection

## Stage 10.9: Email Templates
Create/verify all transactional emails:
- Welcome email
- Email verification
- Password reset
- Order confirmation
- Delivery notification
- Review request
- Subscription confirmation

## Stage 10.10: Documentation
Create:
- Help center content
- FAQ updates
- Getting started guide
- Stripe Connect guide

## Stage 10.11: Staging Environment Test
Deploy to staging and:
- Complete full user journey
- Test all payment flows with Stripe test mode
- Test all email sends
- Load testing

## Stage 10.12: Production Deployment
- Switch Stripe to live mode
- Verify environment variables
- DNS configuration
- SSL verification
- Final smoke test
- Launch!

---

# Appendix A: Environment Variables Checklist

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Stripe Price IDs (after creating products)
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_YEARLY=
STRIPE_PRICE_AI_MONTHLY=
STRIPE_PRICE_AI_YEARLY=
STRIPE_PRICE_ENTERPRISE_MONTHLY=
STRIPE_PRICE_ENTERPRISE_YEARLY=

# Site
NEXT_PUBLIC_SITE_URL=

# Email (Resend)
RESEND_API_KEY=

# AI (Anthropic Claude)
ANTHROPIC_API_KEY=
```

---

# Appendix B: Tax & Legal Notes

## Platform Fee vs. Payment Processing

**Platform Fee (10% for Free tier):**
- This is revenue for MixExperts
- You will receive 1099-K from Stripe for this income
- Report as business income
- NOT a pass-through to engineers

**Stripe Processing Fee (2.9% + $0.30):**
- Deducted from each transaction
- Paid to Stripe, not you
- Shown as expense in your accounting

## Engineer Tax Implications

**1099-K Threshold (as of 2024):**
- $600 or more in gross payments triggers 1099-K
- Engineers who earn $600+ will receive 1099-K from Stripe
- MixExperts does NOT issue 1099-K to engineers (Stripe does)

**What Engineers Report:**
- Gross earnings (before platform fee deduction)
- Platform fee as business expense
- Stripe fees as business expense
- Net profit = Gross - Platform Fee - Stripe Fee - Other Expenses

## MixExperts Tax Reporting

**Your 1099-K from Stripe:**
- Shows total platform fees collected
- Shows any subscription revenue processed

**Report as Business Income:**
- Platform fees from Free tier users
- Subscription revenue (Pro, Enterprise, AI add-on)
- Digital product commissions (15%)

---

# Appendix C: Stripe Connect Engineer Guide

## How to Start Receiving Payments

1. **Sign up for MixExperts** (free or paid plan)
2. **Go to Dashboard → Settings → Billing**
3. **Click "Connect Stripe Account"**
4. **Complete Stripe Onboarding:**
   - Business type (Individual or Company)
   - Personal information (for identity verification)
   - Last 4 of SSN (required by US law)
   - Bank account for payouts
5. **Return to MixExperts** - your account is now connected
6. **Start receiving bookings!**

## Payout Schedule

- **Standard payout:** 2 business days after payment
- **First payout:** May take 7-14 days while Stripe verifies your account
- **Payout frequency:** Daily (automatic)

## What You'll Need

- **US bank account** (checking or savings)
- **Last 4 digits of SSN** (for identity verification)
- **Valid ID** (may be requested for verification)

## Fees Breakdown

For a $500 mixing service:

| Free Tier | Pro Tier |
|-----------|----------|
| Subtotal: $500 | Subtotal: $500 |
| Platform Fee (10%): -$50 | Platform Fee (0%): $0 |
| Stripe Fee (2.9% + $0.30): -$14.80 | Stripe Fee (2.9% + $0.30): -$14.80 |
| **You Receive: $435.20** | **You Receive: $485.20** |

## Accessing Your Stripe Dashboard

1. Go to Dashboard → Settings → Billing
2. Click "View Stripe Dashboard"
3. See all payouts, transactions, and tax documents

## Tax Documents

- Stripe issues 1099-K if you earn $600+
- Available in Stripe Dashboard by January 31
- Report all income on your tax return

---

# Appendix D: Database Schema Diagram

```
┌─────────────────┐     ┌─────────────────┐
│     profiles    │     │   subscriptions │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │────<│ profile_id (FK) │
│ username        │     │ stripe_sub_id   │
│ display_name    │     │ tier            │
│ email           │     │ status          │
│ stripe_acct_id  │     └─────────────────┘
│ subscription_   │
│   tier          │     ┌─────────────────┐
└────────┬────────┘     │ portfolio_items │
         │              ├─────────────────┤
         │         ┌───<│ profile_id (FK) │
         │         │    │ title           │
         ├─────────┤    │ before_audio    │
         │         │    │ after_audio     │
         │         │    └─────────────────┘
         │         │
         │         │    ┌─────────────────┐
         │         │    │    services     │
         │         ├───<├─────────────────┤
         │         │    │ profile_id (FK) │
         │         │    │ name            │
         │         │    │ base_price      │
         │         │    └────────┬────────┘
         │         │             │
         │         │    ┌────────┴────────┐
         │         │    │                 │
         │         │    ▼                 ▼
         │         │ ┌─────────┐   ┌──────────┐
         │         │ │ addons  │   │turnaround│
         │         │ └─────────┘   └──────────┘
         │         │
         │         │    ┌─────────────────┐
         │         │    │    products     │
         │         ├───<├─────────────────┤
         │         │    │ profile_id (FK) │
         │         │    │ name            │
         │         │    │ price           │
         │         │    └─────────────────┘
         │         │
         │         │    ┌─────────────────┐
         │         └───<│  testimonials   │
         │              └─────────────────┘
         │
         │              ┌─────────────────┐
         └─────────────>│     orders      │
           (engineer)   ├─────────────────┤
         ┌─────────────>│ engineer_id(FK) │
           (client)     │ client_id (FK)  │
                        │ service_id (FK) │
                        │ status          │
                        │ total           │
                        └────────┬────────┘
                                 │
                        ┌────────┴────────┐
                        ▼                 ▼
                   ┌─────────┐    ┌────────────┐
                   │  files  │    │  messages  │
                   └─────────┘    └────────────┘
```

---

**End of Master Launch Blueprint**

*This document should be treated as the single source of truth for launch preparation. Update stage statuses as work progresses.*
