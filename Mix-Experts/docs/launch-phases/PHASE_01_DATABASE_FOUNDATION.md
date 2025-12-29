# Phase 01: Database Foundation

**Status:** Not Started
**Duration Estimate:** 4-6 hours
**Dependencies:** Supabase project created, environment variables configured

## Overview

This phase establishes the complete database schema for MixExperts, including all tables, Row Level Security (RLS) policies, triggers, and functions. This foundation supports the three-tier subscription model with appropriate platform fees.

### Fee Structure
- **Free Tier:** 10% platform fee on services AND digital products
- **Pro Tier ($19/mo):** 0% platform fee
- **Enterprise Tier ($49/mo):** 0% platform fee

---

## Prerequisites

- [ ] Supabase project created
- [ ] Database connection established
- [ ] Supabase CLI installed (optional, for local testing)
- [ ] Admin access to Supabase dashboard

---

## Stage Checklist

### Stage 1: Enable PostgreSQL Extensions

**Description:** Enable required PostgreSQL extensions for UUID generation and encryption.

**SQL:**
```sql
-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

**Verification:**
```sql
SELECT * FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto');
```

---

### Stage 2: Create Profiles Table

**Description:** Create the profiles table that extends auth.users with public profile information and subscription data.

**SQL:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  tagline TEXT,
  location TEXT,
  timezone TEXT DEFAULT 'UTC',
  role TEXT DEFAULT 'artist' CHECK (role IN ('artist', 'admin')),
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
  is_published BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  stripe_customer_id TEXT UNIQUE,
  stripe_account_id TEXT UNIQUE,
  stripe_account_status TEXT CHECK (stripe_account_status IN ('pending', 'active', 'restricted', 'disabled')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
  ai_credits_remaining INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_is_published ON profiles(is_published);
CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX idx_profiles_stripe_account_id ON profiles(stripe_account_id);

-- Add comment
COMMENT ON TABLE profiles IS 'User profiles with subscription and Stripe integration data';
```

---

### Stage 3: Create RLS Policies for Profiles

**Description:** Implement Row Level Security policies for profiles table - public view for published profiles, authenticated users can view/update their own.

**SQL:**
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (is_published = true);

-- Policy: Users can view their own profile (even if not published)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile (handled by trigger, but allow explicit inserts)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

---

### Stage 4: Create Social Links Table

**Description:** Store social media and external links for user profiles.

**SQL:**
```sql
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN (
    'website', 'instagram', 'twitter', 'youtube', 'soundcloud',
    'spotify', 'tiktok', 'facebook', 'linkedin', 'twitch', 'other'
  )),
  url TEXT NOT NULL,
  label TEXT, -- Optional custom label for 'other' platform
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, platform)
);

-- Create indexes
CREATE INDEX idx_social_links_profile_id ON social_links(profile_id);
CREATE INDEX idx_social_links_display_order ON social_links(profile_id, display_order);

COMMENT ON TABLE social_links IS 'Social media and external links for user profiles';
```

---

### Stage 5: Create RLS Policies for Social Links

**Description:** Allow public viewing of social links for published profiles, owners can manage their own.

**SQL:**
```sql
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Policy: Social links visible if profile is published
CREATE POLICY "Social links viewable for published profiles"
  ON social_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = social_links.profile_id
      AND profiles.is_published = true
    )
  );

-- Policy: Users can view their own social links
CREATE POLICY "Users can view own social links"
  ON social_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = social_links.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can insert their own social links
CREATE POLICY "Users can insert own social links"
  ON social_links FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = social_links.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can update their own social links
CREATE POLICY "Users can update own social links"
  ON social_links FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = social_links.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can delete their own social links
CREATE POLICY "Users can delete own social links"
  ON social_links FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = social_links.profile_id
      AND profiles.id = auth.uid()
    )
  );
```

---

### Stage 6: Create Portfolio Items Table

**Description:** Store portfolio items with before/after audio samples and metadata.

**SQL:**
```sql
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  before_audio_url TEXT,
  after_audio_url TEXT,
  service_type TEXT, -- e.g., 'mixing', 'mastering', 'production'
  tags TEXT[], -- Array of tags
  metadata JSONB DEFAULT '{}', -- Flexible metadata (genre, tempo, key, etc.)
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_portfolio_items_profile_id ON portfolio_items(profile_id);
CREATE INDEX idx_portfolio_items_service_type ON portfolio_items(service_type);
CREATE INDEX idx_portfolio_items_is_featured ON portfolio_items(profile_id, is_featured);
CREATE INDEX idx_portfolio_items_display_order ON portfolio_items(profile_id, display_order);
CREATE INDEX idx_portfolio_items_tags ON portfolio_items USING GIN(tags);
CREATE INDEX idx_portfolio_items_metadata ON portfolio_items USING GIN(metadata);

COMMENT ON TABLE portfolio_items IS 'Portfolio items showcasing work with before/after samples';
```

---

### Stage 7: Create RLS Policies for Portfolio Items

**Description:** Public viewing for published profiles, owners can manage their own portfolio.

**SQL:**
```sql
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Policy: Portfolio items viewable if profile is published
CREATE POLICY "Portfolio items viewable for published profiles"
  ON portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = portfolio_items.profile_id
      AND profiles.is_published = true
    )
  );

-- Policy: Users can view their own portfolio items
CREATE POLICY "Users can view own portfolio items"
  ON portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = portfolio_items.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can insert their own portfolio items
CREATE POLICY "Users can insert own portfolio items"
  ON portfolio_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = portfolio_items.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can update their own portfolio items
CREATE POLICY "Users can update own portfolio items"
  ON portfolio_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = portfolio_items.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can delete their own portfolio items
CREATE POLICY "Users can delete own portfolio items"
  ON portfolio_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = portfolio_items.profile_id
      AND profiles.id = auth.uid()
    )
  );
```

---

### Stage 8: Create Services Table

**Description:** Store services offered by artists with pricing, turnaround time, and features.

**SQL:**
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('mixing', 'mastering', 'production', 'vocal_tuning', 'sound_design', 'other')),
  base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
  currency TEXT DEFAULT 'USD',
  turnaround_days INTEGER, -- Base turnaround in days
  revision_count INTEGER DEFAULT 0, -- Number of revisions included
  is_revision_unlimited BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]', -- Array of feature strings
  requirements TEXT, -- What the client needs to provide
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_services_profile_id ON services(profile_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_is_active ON services(profile_id, is_active);
CREATE INDEX idx_services_display_order ON services(profile_id, display_order);

COMMENT ON TABLE services IS 'Services offered by artists with pricing and features';
```

---

### Stage 9: Create RLS Policies for Services

**Description:** Public viewing of active services for published profiles, owners can manage all services.

**SQL:**
```sql
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policy: Active services viewable if profile is published
CREATE POLICY "Active services viewable for published profiles"
  ON services FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = services.profile_id
      AND profiles.is_published = true
    )
  );

-- Policy: Users can view all their own services (including inactive)
CREATE POLICY "Users can view own services"
  ON services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = services.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can insert their own services
CREATE POLICY "Users can insert own services"
  ON services FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = services.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can update their own services
CREATE POLICY "Users can update own services"
  ON services FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = services.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can delete their own services
CREATE POLICY "Users can delete own services"
  ON services FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = services.profile_id
      AND profiles.id = auth.uid()
    )
  );
```

---

### Stage 10: Create Service Addons Table

**Description:** Optional addons that can be added to services for additional cost.

**SQL:**
```sql
CREATE TABLE service_addons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  currency TEXT DEFAULT 'USD',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_service_addons_service_id ON service_addons(service_id);
CREATE INDEX idx_service_addons_is_active ON service_addons(service_id, is_active);
CREATE INDEX idx_service_addons_display_order ON service_addons(service_id, display_order);

COMMENT ON TABLE service_addons IS 'Optional addons for services with additional pricing';
```

---

### Stage 11: Create RLS Policies for Service Addons

**Description:** Service addons follow the same visibility rules as their parent service.

**SQL:**
```sql
ALTER TABLE service_addons ENABLE ROW LEVEL SECURITY;

-- Policy: Active addons viewable if parent service is viewable
CREATE POLICY "Addons viewable for published profiles"
  ON service_addons FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM services
      JOIN profiles ON profiles.id = services.profile_id
      WHERE services.id = service_addons.service_id
      AND services.is_active = true
      AND profiles.is_published = true
    )
  );

-- Policy: Users can view their own service addons
CREATE POLICY "Users can view own service addons"
  ON service_addons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM services
      JOIN profiles ON profiles.id = services.profile_id
      WHERE services.id = service_addons.service_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can insert addons to their own services
CREATE POLICY "Users can insert own service addons"
  ON service_addons FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM services
      JOIN profiles ON profiles.id = services.profile_id
      WHERE services.id = service_addons.service_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can update their own service addons
CREATE POLICY "Users can update own service addons"
  ON service_addons FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM services
      JOIN profiles ON profiles.id = services.profile_id
      WHERE services.id = service_addons.service_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can delete their own service addons
CREATE POLICY "Users can delete own service addons"
  ON service_addons FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM services
      JOIN profiles ON profiles.id = services.profile_id
      WHERE services.id = service_addons.service_id
      AND profiles.id = auth.uid()
    )
  );
```

---

### Stage 12: Create Turnaround Options Table

**Description:** Rush delivery options for faster turnaround times with additional fees.

**SQL:**
```sql
CREATE TABLE turnaround_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "24-hour Rush", "3-day Rush"
  days INTEGER NOT NULL CHECK (days > 0),
  price_modifier DECIMAL(10, 2) NOT NULL, -- Additional cost or multiplier
  modifier_type TEXT DEFAULT 'fixed' CHECK (modifier_type IN ('fixed', 'percentage')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_turnaround_options_service_id ON turnaround_options(service_id);
CREATE INDEX idx_turnaround_options_is_active ON turnaround_options(service_id, is_active);
CREATE INDEX idx_turnaround_options_display_order ON turnaround_options(service_id, display_order);

COMMENT ON TABLE turnaround_options IS 'Rush delivery options with additional fees';
```

---

### Stage 13: Create RLS Policies for Turnaround Options

**Description:** Turnaround options follow parent service visibility rules.

**SQL:**
```sql
ALTER TABLE turnaround_options ENABLE ROW LEVEL SECURITY;

-- Policy: Active turnaround options viewable if parent service is viewable
CREATE POLICY "Turnaround options viewable for published profiles"
  ON turnaround_options FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM services
      JOIN profiles ON profiles.id = services.profile_id
      WHERE services.id = turnaround_options.service_id
      AND services.is_active = true
      AND profiles.is_published = true
    )
  );

-- Policy: Users can view their own turnaround options
CREATE POLICY "Users can view own turnaround options"
  ON turnaround_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM services
      JOIN profiles ON profiles.id = services.profile_id
      WHERE services.id = turnaround_options.service_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can insert turnaround options to their own services
CREATE POLICY "Users can insert own turnaround options"
  ON turnaround_options FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM services
      JOIN profiles ON profiles.id = services.profile_id
      WHERE services.id = turnaround_options.service_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can update their own turnaround options
CREATE POLICY "Users can update own turnaround options"
  ON turnaround_options FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM services
      JOIN profiles ON profiles.id = services.profile_id
      WHERE services.id = turnaround_options.service_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can delete their own turnaround options
CREATE POLICY "Users can delete own turnaround options"
  ON turnaround_options FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM services
      JOIN profiles ON profiles.id = services.profile_id
      WHERE services.id = turnaround_options.service_id
      AND profiles.id = auth.uid()
    )
  );
```

---

### Stage 14: Create Products Table

**Description:** Digital products (presets, sample packs, templates) with files and licensing.

**SQL:**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('preset', 'sample_pack', 'template', 'course', 'ebook', 'other')),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  currency TEXT DEFAULT 'USD',
  cover_image_url TEXT,
  preview_url TEXT, -- Audio/video preview
  file_url TEXT, -- Protected download link
  file_size_mb DECIMAL(10, 2),
  license_type TEXT DEFAULT 'personal' CHECK (license_type IN ('personal', 'commercial', 'exclusive')),
  license_terms TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}', -- Format, compatibility, requirements, etc.
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_products_profile_id ON products(profile_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(profile_id, is_active);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_products_metadata ON products USING GIN(metadata);

COMMENT ON TABLE products IS 'Digital products with licensing and download tracking';
```

---

### Stage 15: Create RLS Policies for Products

**Description:** Public viewing of active products, owners manage all products, buyers can access purchased products.

**SQL:**
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Active products viewable if profile is published (excluding file_url)
CREATE POLICY "Active products viewable for published profiles"
  ON products FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = products.profile_id
      AND profiles.is_published = true
    )
  );

-- Policy: Users can view all their own products
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = products.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can insert their own products
CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = products.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can update their own products
CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = products.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can delete their own products
CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = products.profile_id
      AND profiles.id = auth.uid()
    )
  );
```

---

### Stage 16: Create Orders Table

**Description:** Comprehensive orders table for service requests with full pricing breakdown and status workflow.

**SQL:**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL, -- Human-readable order number (auto-generated)

  -- Relationships
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,

  -- Order details
  service_name TEXT NOT NULL, -- Snapshot of service name
  service_description TEXT,

  -- Pricing breakdown
  base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
  addons_total DECIMAL(10, 2) DEFAULT 0 CHECK (addons_total >= 0),
  rush_fee DECIMAL(10, 2) DEFAULT 0 CHECK (rush_fee >= 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  platform_fee DECIMAL(10, 2) DEFAULT 0 CHECK (platform_fee >= 0),
  platform_fee_percentage DECIMAL(5, 2) DEFAULT 0, -- Store the fee % applied
  stripe_fee DECIMAL(10, 2) DEFAULT 0 CHECK (stripe_fee >= 0),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  seller_payout DECIMAL(10, 2) NOT NULL CHECK (seller_payout >= 0),
  currency TEXT DEFAULT 'USD',

  -- Order configuration
  addon_ids UUID[], -- Array of selected addon IDs
  turnaround_option_id UUID REFERENCES turnaround_options(id) ON DELETE SET NULL,
  turnaround_days INTEGER,
  revision_count INTEGER DEFAULT 0,
  revisions_used INTEGER DEFAULT 0,

  -- Client requirements
  requirements_text TEXT,
  reference_files TEXT[], -- Array of file URLs

  -- Status tracking
  status TEXT DEFAULT 'pending_payment' CHECK (status IN (
    'pending_payment', 'payment_processing', 'paid', 'in_progress',
    'revision_requested', 'revision_in_progress', 'pending_approval',
    'completed', 'cancelled', 'refunded', 'disputed'
  )),

  -- Payment integration
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_transfer_id TEXT,
  stripe_refund_id TEXT,

  -- Timeline tracking
  paid_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  deadline TIMESTAMPTZ, -- Calculated from turnaround time

  -- Communication
  thread_id UUID, -- Link to message thread

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_service_id ON orders(service_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_deadline ON orders(deadline);

COMMENT ON TABLE orders IS 'Service orders with comprehensive pricing and status tracking';
```

---

### Stage 17: Create RLS Policies for Orders

**Description:** Buyers and sellers can view/update their own orders, with appropriate restrictions.

**SQL:**
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Buyers can view their own orders
CREATE POLICY "Buyers can view own orders"
  ON orders FOR SELECT
  USING (buyer_id = auth.uid());

-- Policy: Sellers can view orders for their services
CREATE POLICY "Sellers can view orders for their services"
  ON orders FOR SELECT
  USING (seller_id = auth.uid());

-- Policy: Buyers can create orders
CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

-- Policy: Buyers can update their own pending orders
CREATE POLICY "Buyers can update own pending orders"
  ON orders FOR UPDATE
  USING (
    buyer_id = auth.uid() AND
    status IN ('pending_payment', 'payment_processing')
  );

-- Policy: Sellers can update orders for their services
CREATE POLICY "Sellers can update orders for their services"
  ON orders FOR UPDATE
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());
```

---

### Stage 18: Create Order Files Table

**Description:** Track files uploaded by clients and delivered files from sellers.

**SQL:**
```sql
CREATE TABLE order_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_mb DECIMAL(10, 2),
  file_type TEXT, -- 'requirement', 'delivery', 'revision'
  mime_type TEXT,
  description TEXT,
  revision_number INTEGER, -- Which revision this belongs to
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_order_files_order_id ON order_files(order_id);
CREATE INDEX idx_order_files_uploader_id ON order_files(uploader_id);
CREATE INDEX idx_order_files_file_type ON order_files(file_type);

COMMENT ON TABLE order_files IS 'Files associated with orders (requirements and deliverables)';
```

---

### Stage 19: Create RLS Policies for Order Files

**Description:** Buyers and sellers in an order can view and upload files for that order.

**SQL:**
```sql
ALTER TABLE order_files ENABLE ROW LEVEL SECURITY;

-- Policy: Order participants can view files
CREATE POLICY "Order participants can view files"
  ON order_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_files.order_id
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

-- Policy: Order participants can upload files
CREATE POLICY "Order participants can upload files"
  ON order_files FOR INSERT
  WITH CHECK (
    uploader_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_files.order_id
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

-- Policy: Uploaders can delete their own files (within 24 hours)
CREATE POLICY "Uploaders can delete own recent files"
  ON order_files FOR DELETE
  USING (
    uploader_id = auth.uid() AND
    created_at > NOW() - INTERVAL '24 hours'
  );
```

---

### Stage 20: Create Product Purchases Table

**Description:** Track purchases of digital products with download access.

**SQL:**
```sql
CREATE TABLE product_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_number TEXT UNIQUE NOT NULL, -- Human-readable purchase number

  -- Relationships
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Purchase snapshot
  product_name TEXT NOT NULL,
  product_description TEXT,
  license_type TEXT NOT NULL,

  -- Pricing
  product_price DECIMAL(10, 2) NOT NULL CHECK (product_price >= 0),
  platform_fee DECIMAL(10, 2) DEFAULT 0 CHECK (platform_fee >= 0),
  platform_fee_percentage DECIMAL(5, 2) DEFAULT 0,
  stripe_fee DECIMAL(10, 2) DEFAULT 0 CHECK (stripe_fee >= 0),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  seller_payout DECIMAL(10, 2) NOT NULL CHECK (seller_payout >= 0),
  currency TEXT DEFAULT 'USD',

  -- Payment
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_transfer_id TEXT,

  -- Download tracking
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ,
  download_limit INTEGER, -- NULL = unlimited
  download_expires_at TIMESTAMPTZ, -- NULL = never expires

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded')),

  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_product_purchases_purchase_number ON product_purchases(purchase_number);
CREATE INDEX idx_product_purchases_buyer_id ON product_purchases(buyer_id);
CREATE INDEX idx_product_purchases_seller_id ON product_purchases(seller_id);
CREATE INDEX idx_product_purchases_product_id ON product_purchases(product_id);
CREATE INDEX idx_product_purchases_stripe_payment_intent ON product_purchases(stripe_payment_intent_id);

COMMENT ON TABLE product_purchases IS 'Digital product purchases with download tracking';
```

---

### Stage 21: Create RLS Policies for Product Purchases

**Description:** Buyers and sellers can view their purchases/sales, buyers can download purchased products.

**SQL:**
```sql
ALTER TABLE product_purchases ENABLE ROW LEVEL SECURITY;

-- Policy: Buyers can view their own purchases
CREATE POLICY "Buyers can view own purchases"
  ON product_purchases FOR SELECT
  USING (buyer_id = auth.uid());

-- Policy: Sellers can view their sales
CREATE POLICY "Sellers can view their sales"
  ON product_purchases FOR SELECT
  USING (seller_id = auth.uid());

-- Policy: Buyers can create purchases
CREATE POLICY "Buyers can create purchases"
  ON product_purchases FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

-- Policy: Buyers can update download count on their purchases
CREATE POLICY "Buyers can update download tracking"
  ON product_purchases FOR UPDATE
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());
```

---

### Stage 22: Create Messages Table

**Description:** Direct messaging between users with thread support and inquiry tracking.

**SQL:**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL, -- Group messages into conversations

  -- Participants
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,

  -- Content
  content TEXT NOT NULL,
  attachments TEXT[], -- Array of file URLs

  -- Context
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL, -- If message relates to an order
  is_inquiry BOOLEAN DEFAULT false, -- If this is an initial service inquiry
  inquiry_service_id UUID REFERENCES services(id) ON DELETE SET NULL,

  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_archived BOOLEAN DEFAULT false, -- For hiding threads

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_order_id ON messages(order_id);
CREATE INDEX idx_messages_is_read ON messages(recipient_id, is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

COMMENT ON TABLE messages IS 'Direct messages between users with thread and inquiry support';
```

---

### Stage 23: Create RLS Policies for Messages

**Description:** Users can view and send messages in threads they participate in.

**SQL:**
```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages they sent
CREATE POLICY "Users can view sent messages"
  ON messages FOR SELECT
  USING (sender_id = auth.uid());

-- Policy: Users can view messages sent to them
CREATE POLICY "Users can view received messages"
  ON messages FOR SELECT
  USING (recipient_id = auth.uid());

-- Policy: Users can send messages
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Policy: Recipients can update read status
CREATE POLICY "Recipients can mark messages as read"
  ON messages FOR UPDATE
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());
```

---

### Stage 24: Create Testimonials Table

**Description:** Client testimonials and reviews for completed orders.

**SQL:**
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relationships
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- Artist receiving testimonial
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL, -- Client who wrote it
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL, -- Related order

  -- Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,

  -- Display
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true, -- Artist can hide testimonials
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate testimonials per order
  UNIQUE(order_id)
);

-- Create indexes
CREATE INDEX idx_testimonials_profile_id ON testimonials(profile_id);
CREATE INDEX idx_testimonials_author_id ON testimonials(author_id);
CREATE INDEX idx_testimonials_is_published ON testimonials(profile_id, is_published);
CREATE INDEX idx_testimonials_is_featured ON testimonials(profile_id, is_featured);
CREATE INDEX idx_testimonials_rating ON testimonials(rating);

COMMENT ON TABLE testimonials IS 'Client testimonials and reviews for completed work';
```

---

### Stage 25: Create RLS Policies for Testimonials

**Description:** Public viewing of published testimonials, authors and profile owners can manage.

**SQL:**
```sql
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Published testimonials viewable for published profiles
CREATE POLICY "Published testimonials viewable for published profiles"
  ON testimonials FOR SELECT
  USING (
    is_published = true AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = testimonials.profile_id
      AND profiles.is_published = true
    )
  );

-- Policy: Profile owners can view all their testimonials
CREATE POLICY "Profile owners can view own testimonials"
  ON testimonials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = testimonials.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Authors can view testimonials they wrote
CREATE POLICY "Authors can view own testimonials"
  ON testimonials FOR SELECT
  USING (author_id = auth.uid());

-- Policy: Authors can create testimonials for completed orders
CREATE POLICY "Authors can create testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = testimonials.order_id
      AND orders.buyer_id = auth.uid()
      AND orders.status = 'completed'
    )
  );

-- Policy: Profile owners can update display settings
CREATE POLICY "Profile owners can update testimonial settings"
  ON testimonials FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = testimonials.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Authors can update their own testimonials (within 7 days)
CREATE POLICY "Authors can update recent testimonials"
  ON testimonials FOR UPDATE
  USING (
    author_id = auth.uid() AND
    created_at > NOW() - INTERVAL '7 days'
  );
```

---

### Stage 26: Create Credits Table

**Description:** Artist and label credits for portfolio items (e.g., "Mixed by", "Mastered by", "Produced for").

**SQL:**
```sql
CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_item_id UUID NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,

  -- Credit details
  role TEXT NOT NULL, -- e.g., "Mixed by", "Mastered by", "Produced for"
  artist_name TEXT NOT NULL,
  artist_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- If credited artist is on platform

  -- Additional info
  label TEXT, -- Record label
  release_title TEXT,
  release_year INTEGER,
  external_url TEXT, -- Link to Spotify, Apple Music, etc.

  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_credits_portfolio_item_id ON credits(portfolio_item_id);
CREATE INDEX idx_credits_artist_profile_id ON credits(artist_profile_id);
CREATE INDEX idx_credits_artist_name ON credits(artist_name);

COMMENT ON TABLE credits IS 'Artist and label credits for portfolio items';
```

---

### Stage 27: Create RLS Policies for Credits

**Description:** Credits follow portfolio item visibility, owners can manage their credits.

**SQL:**
```sql
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

-- Policy: Credits viewable if portfolio item is viewable
CREATE POLICY "Credits viewable for published profiles"
  ON credits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_items
      JOIN profiles ON profiles.id = portfolio_items.profile_id
      WHERE portfolio_items.id = credits.portfolio_item_id
      AND profiles.is_published = true
    )
  );

-- Policy: Portfolio owners can view their credits
CREATE POLICY "Users can view own credits"
  ON credits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_items
      JOIN profiles ON profiles.id = portfolio_items.profile_id
      WHERE portfolio_items.id = credits.portfolio_item_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Portfolio owners can insert credits
CREATE POLICY "Users can insert own credits"
  ON credits FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM portfolio_items
      JOIN profiles ON profiles.id = portfolio_items.profile_id
      WHERE portfolio_items.id = credits.portfolio_item_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Portfolio owners can update their credits
CREATE POLICY "Users can update own credits"
  ON credits FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_items
      JOIN profiles ON profiles.id = portfolio_items.profile_id
      WHERE portfolio_items.id = credits.portfolio_item_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Portfolio owners can delete their credits
CREATE POLICY "Users can delete own credits"
  ON credits FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM portfolio_items
      JOIN profiles ON profiles.id = portfolio_items.profile_id
      WHERE portfolio_items.id = credits.portfolio_item_id
      AND profiles.id = auth.uid()
    )
  );
```

---

### Stage 28: Create Subscriptions Table

**Description:** Track subscription history and billing for Pro and Enterprise tiers.

**SQL:**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Subscription details
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'expired')),

  -- Stripe integration
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,

  -- Billing
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  currency TEXT DEFAULT 'USD',
  billing_interval TEXT DEFAULT 'month' CHECK (billing_interval IN ('month', 'year')),

  -- Timeline
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_subscriptions_profile_id ON subscriptions(profile_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_current_period_end ON subscriptions(current_period_end);

COMMENT ON TABLE subscriptions IS 'Subscription tracking for Pro and Enterprise tiers';
```

---

### Stage 29: Create RLS Policies for Subscriptions

**Description:** Users can view and manage their own subscription data.

**SQL:**
```sql
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = subscriptions.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: System can insert subscriptions (via service role)
CREATE POLICY "System can insert subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = subscriptions.profile_id
    )
  );

-- Policy: System can update subscriptions (via service role)
CREATE POLICY "System can update subscriptions"
  ON subscriptions FOR UPDATE
  USING (true);
```

---

### Stage 30: Create Analytics Events Table

**Description:** Track user behavior and platform analytics with optimized indexes.

**SQL:**
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Event details
  event_type TEXT NOT NULL, -- e.g., 'profile_view', 'service_view', 'product_view', 'order_created'
  event_category TEXT, -- Group events: 'engagement', 'conversion', 'navigation'

  -- Context
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Profile being viewed/interacted with
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- User performing the action (NULL for anonymous)

  -- Related entities
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

  -- Metadata
  metadata JSONB DEFAULT '{}', -- Flexible data (referrer, device, location, etc.)

  -- Session tracking
  session_id UUID,
  ip_address TEXT,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_profile_id ON analytics_events(profile_id);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_metadata ON analytics_events USING GIN(metadata);

-- Composite indexes for analytics queries
CREATE INDEX idx_analytics_profile_event_date ON analytics_events(profile_id, event_type, created_at DESC);
CREATE INDEX idx_analytics_service_views ON analytics_events(service_id, event_type) WHERE event_type = 'service_view';
CREATE INDEX idx_analytics_product_views ON analytics_events(product_id, event_type) WHERE event_type = 'product_view';

COMMENT ON TABLE analytics_events IS 'User behavior and platform analytics tracking';
```

---

### Stage 31: Create RLS Policies for Analytics Events

**Description:** Profile owners can view analytics for their content, system can insert events.

**SQL:**
```sql
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy: Profile owners can view analytics for their content
CREATE POLICY "Profile owners can view own analytics"
  ON analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = analytics_events.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Policy: Users can view their own activity
CREATE POLICY "Users can view own activity"
  ON analytics_events FOR SELECT
  USING (user_id = auth.uid());

-- Policy: System can insert analytics events
CREATE POLICY "System can insert analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);
```

---

### Stage 32: Create Profile Creation Trigger

**Description:** Automatically create a profile when a new user signs up via auth.users.

**SQL:**
```sql
-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates a profile when a new user signs up';
```

---

### Stage 33: Create Updated_at Trigger Function

**Description:** Generic trigger function to automatically update updated_at timestamp.

**SQL:**
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.handle_updated_at IS 'Automatically updates updated_at timestamp on row modification';
```

---

### Stage 34: Apply Updated_at Triggers to All Tables

**Description:** Apply the updated_at trigger to all tables that have an updated_at column.

**SQL:**
```sql
-- Apply to profiles
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Apply to social_links
CREATE TRIGGER set_updated_at BEFORE UPDATE ON social_links
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Apply to portfolio_items
CREATE TRIGGER set_updated_at BEFORE UPDATE ON portfolio_items
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Apply to services
CREATE TRIGGER set_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Apply to service_addons
CREATE TRIGGER set_updated_at BEFORE UPDATE ON service_addons
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Apply to turnaround_options
CREATE TRIGGER set_updated_at BEFORE UPDATE ON turnaround_options
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Apply to products
CREATE TRIGGER set_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Apply to orders
CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Apply to product_purchases
CREATE TRIGGER set_updated_at BEFORE UPDATE ON product_purchases
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Apply to messages
CREATE TRIGGER set_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Apply to testimonials
CREATE TRIGGER set_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Apply to credits
CREATE TRIGGER set_updated_at BEFORE UPDATE ON credits
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Apply to subscriptions
CREATE TRIGGER set_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

### Stage 35: Create Order Number Generation Function

**Description:** Function to generate human-readable order numbers (e.g., ORD-2024-000001).

**SQL:**
```sql
-- Function to generate unique order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  current_year TEXT;
  next_sequence INTEGER;
  order_num TEXT;
BEGIN
  current_year := TO_CHAR(NOW(), 'YYYY');

  -- Get the next sequence number for this year
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(order_number FROM 'ORD-' || current_year || '-(\d+)') AS INTEGER)
  ), 0) + 1 INTO next_sequence
  FROM orders
  WHERE order_number LIKE 'ORD-' || current_year || '-%';

  -- Format as ORD-YYYY-NNNNNN
  order_num := 'ORD-' || current_year || '-' || LPAD(next_sequence::TEXT, 6, '0');

  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to set order number on insert
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to orders table
CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Similar function for product purchases
CREATE OR REPLACE FUNCTION public.generate_purchase_number()
RETURNS TEXT AS $$
DECLARE
  current_year TEXT;
  next_sequence INTEGER;
  purchase_num TEXT;
BEGIN
  current_year := TO_CHAR(NOW(), 'YYYY');

  SELECT COALESCE(MAX(
    CAST(SUBSTRING(purchase_number FROM 'PUR-' || current_year || '-(\d+)') AS INTEGER)
  ), 0) + 1 INTO next_sequence
  FROM product_purchases
  WHERE purchase_number LIKE 'PUR-' || current_year || '-%';

  purchase_num := 'PUR-' || current_year || '-' || LPAD(next_sequence::TEXT, 6, '0');

  RETURN purchase_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for product purchases
CREATE OR REPLACE FUNCTION public.set_purchase_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.purchase_number IS NULL THEN
    NEW.purchase_number := generate_purchase_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to product_purchases table
CREATE TRIGGER set_purchase_number_trigger
  BEFORE INSERT ON product_purchases
  FOR EACH ROW
  EXECUTE FUNCTION set_purchase_number();

COMMENT ON FUNCTION public.generate_order_number IS 'Generates unique order numbers in format ORD-YYYY-NNNNNN';
COMMENT ON FUNCTION public.generate_purchase_number IS 'Generates unique purchase numbers in format PUR-YYYY-NNNNNN';
```

---

### Stage 36: Verify All Tables Created Successfully

**Description:** Query to verify all tables exist and have correct structure.

**SQL:**
```sql
-- List all tables created
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Verify RLS is enabled on all tables
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Count policies per table
SELECT
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- Verify triggers
SELECT
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

**Expected Results:**
- 18 tables created (profiles, social_links, portfolio_items, services, service_addons, turnaround_options, products, orders, order_files, product_purchases, messages, testimonials, credits, subscriptions, analytics_events)
- All tables have rowsecurity = true
- Each table has appropriate number of policies
- All tables with updated_at have triggers
- Orders and product_purchases have number generation triggers

---

### Stage 37: Test RLS Policies with Different User Contexts

**Description:** Test queries to verify RLS policies work correctly for different user scenarios.

**SQL:**
```sql
-- Test 1: Create test users (run as service_role or admin)
-- Note: This should be done via Supabase Auth UI or API in practice

-- Test 2: Verify anonymous users can only see published profiles
SET ROLE anon;
SELECT COUNT(*) as published_profiles FROM profiles WHERE is_published = true;
SELECT COUNT(*) as all_profiles FROM profiles; -- Should equal published_profiles
RESET ROLE;

-- Test 3: Verify authenticated users can see their own unpublished profile
-- (This requires setting auth.uid() which is typically done by Supabase)
-- In practice, test this via your application with actual user sessions

-- Test 4: Verify users cannot update other users' profiles
-- (Requires actual user context - test via application)

-- Test 5: Verify service visibility
SET ROLE anon;
SELECT COUNT(*) FROM services WHERE is_active = true;
RESET ROLE;

-- Test 6: Verify order privacy
-- Anonymous users should see 0 orders
SET ROLE anon;
SELECT COUNT(*) FROM orders; -- Should be 0
RESET ROLE;

-- Test 7: Verify analytics privacy
SET ROLE anon;
SELECT COUNT(*) FROM analytics_events; -- Should be 0
RESET ROLE;

-- Test 8: Check function permissions
SELECT
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

**Manual Testing Checklist:**
- [ ] Create a test user via Supabase Auth
- [ ] Login as test user and verify they can update their own profile
- [ ] Verify test user cannot update another user's profile
- [ ] Publish test user's profile and verify it's publicly visible
- [ ] Unpublish profile and verify it's hidden from public
- [ ] Create a service and verify it's only visible when profile is published
- [ ] Test order creation and verify buyer/seller can both access
- [ ] Verify third-party users cannot see others' orders
- [ ] Test message sending between users
- [ ] Verify analytics events are tracked correctly
- [ ] Test subscription tier changes and platform fee calculations

---

## Post-Implementation Checklist

After completing all stages:

- [ ] All 18 tables created successfully
- [ ] All tables have RLS enabled
- [ ] All RLS policies tested and verified
- [ ] All triggers functioning correctly
- [ ] Order number generation working
- [ ] Profile auto-creation on signup working
- [ ] Updated_at timestamps auto-updating
- [ ] Indexes created for performance
- [ ] Documentation reviewed and accurate
- [ ] Database backup created
- [ ] Team members have reviewed schema
- [ ] Ready to proceed to Phase 02

---

## Rollback Plan

If issues are encountered during implementation:

```sql
-- DANGER: This will drop all tables and data
-- Only use in development/staging environments

DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS credits CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS product_purchases CASCADE;
DROP TABLE IF EXISTS order_files CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS turnaround_options CASCADE;
DROP TABLE IF EXISTS service_addons CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS portfolio_items CASCADE;
DROP TABLE IF EXISTS social_links CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP FUNCTION IF EXISTS handle_updated_at CASCADE;
DROP FUNCTION IF EXISTS generate_order_number CASCADE;
DROP FUNCTION IF EXISTS set_order_number CASCADE;
DROP FUNCTION IF EXISTS generate_purchase_number CASCADE;
DROP FUNCTION IF EXISTS set_purchase_number CASCADE;
```

---

## Notes

- Execute stages in order - later stages depend on earlier ones
- Test each stage before proceeding to the next
- Back up your database before making changes
- Use Supabase SQL Editor or your preferred database client
- Some policies may need adjustment based on specific business requirements
- Consider creating a staging environment to test the full schema first
- Platform fees are calculated based on seller's subscription tier at time of order
- Free tier users pay 10% on both services and digital products
- Pro ($19/mo) and Enterprise ($49/mo) users pay 0% platform fee

---

## Next Phase

Once Phase 01 is complete, proceed to:
**Phase 02: Storage Buckets & File Upload** - Setting up Supabase Storage for avatars, portfolio media, order files, and digital products.
