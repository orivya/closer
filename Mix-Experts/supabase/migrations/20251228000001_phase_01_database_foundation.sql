-- ============================================================================
-- PHASE 01: DATABASE FOUNDATION
-- MixExperts Master Launch Blueprint
-- Created: December 28, 2025
-- ============================================================================

-- Stage 1: Enable PostgreSQL Extensions
-- ============================================================================
-- Note: Using gen_random_uuid() which is available by default in PostgreSQL 13+
-- The uuid-ossp extension is optional but we'll try to enable it
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Stage 2: Create Profiles Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
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

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_is_published ON profiles(is_published);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_account_id ON profiles(stripe_account_id);

COMMENT ON TABLE profiles IS 'User profiles with subscription and Stripe integration data';

-- Stage 3: RLS Policies for Profiles
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Stage 4: Create Social Links Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN (
    'website', 'instagram', 'twitter', 'youtube', 'soundcloud',
    'spotify', 'tiktok', 'facebook', 'linkedin', 'twitch', 'other'
  )),
  url TEXT NOT NULL,
  label TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_social_links_profile_id ON social_links(profile_id);
CREATE INDEX IF NOT EXISTS idx_social_links_display_order ON social_links(profile_id, display_order);

COMMENT ON TABLE social_links IS 'Social media and external links for user profiles';

-- Stage 5: RLS Policies for Social Links
-- ============================================================================
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Social links viewable for published profiles"
  ON social_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = social_links.profile_id
      AND profiles.is_published = true
    )
  );

CREATE POLICY "Users can view own social links"
  ON social_links FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = social_links.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own social links"
  ON social_links FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = social_links.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update own social links"
  ON social_links FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = social_links.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own social links"
  ON social_links FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = social_links.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Stage 6: Create Portfolio Items Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  before_audio_url TEXT,
  after_audio_url TEXT,
  service_type TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_items_profile_id ON portfolio_items(profile_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_service_type ON portfolio_items(service_type);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_is_featured ON portfolio_items(profile_id, is_featured);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_display_order ON portfolio_items(profile_id, display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_tags ON portfolio_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_metadata ON portfolio_items USING GIN(metadata);

COMMENT ON TABLE portfolio_items IS 'Portfolio items showcasing work with before/after samples';

-- Stage 7: RLS Policies for Portfolio Items
-- ============================================================================
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolio items viewable for published profiles"
  ON portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = portfolio_items.profile_id
      AND profiles.is_published = true
    )
  );

CREATE POLICY "Users can view own portfolio items"
  ON portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = portfolio_items.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own portfolio items"
  ON portfolio_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = portfolio_items.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update own portfolio items"
  ON portfolio_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = portfolio_items.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own portfolio items"
  ON portfolio_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = portfolio_items.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Stage 8: Create Services Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('mixing', 'mastering', 'production', 'vocal_tuning', 'sound_design', 'other')),
  base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
  currency TEXT DEFAULT 'USD',
  turnaround_days INTEGER,
  revision_count INTEGER DEFAULT 0,
  is_revision_unlimited BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]',
  requirements TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_profile_id ON services(profile_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(profile_id, is_active);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(profile_id, display_order);

COMMENT ON TABLE services IS 'Services offered by artists with pricing and features';

-- Stage 9: RLS Policies for Services
-- ============================================================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Users can view own services"
  ON services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = services.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own services"
  ON services FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = services.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update own services"
  ON services FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = services.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own services"
  ON services FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = services.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Stage 10: Create Service Addons Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS service_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE INDEX IF NOT EXISTS idx_service_addons_service_id ON service_addons(service_id);
CREATE INDEX IF NOT EXISTS idx_service_addons_is_active ON service_addons(service_id, is_active);
CREATE INDEX IF NOT EXISTS idx_service_addons_display_order ON service_addons(service_id, display_order);

COMMENT ON TABLE service_addons IS 'Optional addons for services with additional pricing';

-- Stage 11: RLS Policies for Service Addons
-- ============================================================================
ALTER TABLE service_addons ENABLE ROW LEVEL SECURITY;

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

-- Stage 12: Create Turnaround Options Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS turnaround_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  days INTEGER NOT NULL CHECK (days > 0),
  price_modifier DECIMAL(10, 2) NOT NULL,
  modifier_type TEXT DEFAULT 'fixed' CHECK (modifier_type IN ('fixed', 'percentage')),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_turnaround_options_service_id ON turnaround_options(service_id);
CREATE INDEX IF NOT EXISTS idx_turnaround_options_is_active ON turnaround_options(service_id, is_active);
CREATE INDEX IF NOT EXISTS idx_turnaround_options_display_order ON turnaround_options(service_id, display_order);

COMMENT ON TABLE turnaround_options IS 'Rush delivery options with additional fees';

-- Stage 13: RLS Policies for Turnaround Options
-- ============================================================================
ALTER TABLE turnaround_options ENABLE ROW LEVEL SECURITY;

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

-- Stage 14: Create Products Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('preset', 'sample_pack', 'template', 'course', 'ebook', 'other')),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  currency TEXT DEFAULT 'USD',
  cover_image_url TEXT,
  preview_url TEXT,
  file_url TEXT,
  file_size_mb DECIMAL(10, 2),
  license_type TEXT DEFAULT 'personal' CHECK (license_type IN ('personal', 'commercial', 'exclusive')),
  license_terms TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_profile_id ON products(profile_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(profile_id, is_active);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_metadata ON products USING GIN(metadata);

COMMENT ON TABLE products IS 'Digital products with licensing and download tracking';

-- Stage 15: RLS Policies for Products
-- ============================================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = products.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = products.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = products.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = products.profile_id
      AND profiles.id = auth.uid()
    )
  );

-- Stage 16: Create Orders Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,

  -- Relationships
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,

  -- Order details
  service_name TEXT NOT NULL,
  service_description TEXT,

  -- Pricing breakdown
  base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
  addons_total DECIMAL(10, 2) DEFAULT 0 CHECK (addons_total >= 0),
  rush_fee DECIMAL(10, 2) DEFAULT 0 CHECK (rush_fee >= 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  platform_fee DECIMAL(10, 2) DEFAULT 0 CHECK (platform_fee >= 0),
  platform_fee_percentage DECIMAL(5, 2) DEFAULT 0,
  stripe_fee DECIMAL(10, 2) DEFAULT 0 CHECK (stripe_fee >= 0),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  seller_payout DECIMAL(10, 2) NOT NULL CHECK (seller_payout >= 0),
  currency TEXT DEFAULT 'USD',

  -- Order configuration
  addon_ids UUID[],
  turnaround_option_id UUID REFERENCES turnaround_options(id) ON DELETE SET NULL,
  turnaround_days INTEGER,
  revision_count INTEGER DEFAULT 0,
  revisions_used INTEGER DEFAULT 0,

  -- Client requirements
  requirements_text TEXT,
  reference_files TEXT[],

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
  deadline TIMESTAMPTZ,

  -- Communication
  thread_id UUID,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_service_id ON orders(service_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_deadline ON orders(deadline);

COMMENT ON TABLE orders IS 'Service orders with comprehensive pricing and status tracking';

-- Stage 17: RLS Policies for Orders
-- ============================================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view own orders"
  ON orders FOR SELECT
  USING (buyer_id = auth.uid());

CREATE POLICY "Sellers can view orders for their services"
  ON orders FOR SELECT
  USING (seller_id = auth.uid());

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can update own pending orders"
  ON orders FOR UPDATE
  USING (
    buyer_id = auth.uid() AND
    status IN ('pending_payment', 'payment_processing')
  );

CREATE POLICY "Sellers can update orders for their services"
  ON orders FOR UPDATE
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

-- Stage 18: Create Order Files Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS order_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_mb DECIMAL(10, 2),
  file_type TEXT,
  mime_type TEXT,
  description TEXT,
  revision_number INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_files_order_id ON order_files(order_id);
CREATE INDEX IF NOT EXISTS idx_order_files_uploader_id ON order_files(uploader_id);
CREATE INDEX IF NOT EXISTS idx_order_files_file_type ON order_files(file_type);

COMMENT ON TABLE order_files IS 'Files associated with orders (requirements and deliverables)';

-- Stage 19: RLS Policies for Order Files
-- ============================================================================
ALTER TABLE order_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants can view files"
  ON order_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_files.order_id
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

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

CREATE POLICY "Uploaders can delete own recent files"
  ON order_files FOR DELETE
  USING (
    uploader_id = auth.uid() AND
    created_at > NOW() - INTERVAL '24 hours'
  );

-- Stage 20: Create Product Purchases Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_number TEXT UNIQUE NOT NULL,

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
  download_limit INTEGER,
  download_expires_at TIMESTAMPTZ,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded')),

  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_purchases_purchase_number ON product_purchases(purchase_number);
CREATE INDEX IF NOT EXISTS idx_product_purchases_buyer_id ON product_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_product_purchases_seller_id ON product_purchases(seller_id);
CREATE INDEX IF NOT EXISTS idx_product_purchases_product_id ON product_purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_product_purchases_stripe_payment_intent ON product_purchases(stripe_payment_intent_id);

COMMENT ON TABLE product_purchases IS 'Digital product purchases with download tracking';

-- Stage 21: RLS Policies for Product Purchases
-- ============================================================================
ALTER TABLE product_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view own purchases"
  ON product_purchases FOR SELECT
  USING (buyer_id = auth.uid());

CREATE POLICY "Sellers can view their sales"
  ON product_purchases FOR SELECT
  USING (seller_id = auth.uid());

CREATE POLICY "Buyers can create purchases"
  ON product_purchases FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can update download tracking"
  ON product_purchases FOR UPDATE
  USING (buyer_id = auth.uid())
  WITH CHECK (buyer_id = auth.uid());

-- Stage 22: Create Messages Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL,

  -- Participants
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,

  -- Content
  content TEXT NOT NULL,
  attachments TEXT[],

  -- Context
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  is_inquiry BOOLEAN DEFAULT false,
  inquiry_service_id UUID REFERENCES services(id) ON DELETE SET NULL,

  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_archived BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_order_id ON messages(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

COMMENT ON TABLE messages IS 'Direct messages between users with thread and inquiry support';

-- Stage 23: RLS Policies for Messages
-- ============================================================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sent messages"
  ON messages FOR SELECT
  USING (sender_id = auth.uid());

CREATE POLICY "Users can view received messages"
  ON messages FOR SELECT
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Recipients can mark messages as read"
  ON messages FOR UPDATE
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

-- Stage 24: Create Testimonials Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

  -- Content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,

  -- Display
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(order_id)
);

CREATE INDEX IF NOT EXISTS idx_testimonials_profile_id ON testimonials(profile_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_author_id ON testimonials(author_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_published ON testimonials(profile_id, is_published);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON testimonials(profile_id, is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials(rating);

COMMENT ON TABLE testimonials IS 'Client testimonials and reviews for completed work';

-- Stage 25: RLS Policies for Testimonials
-- ============================================================================
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Profile owners can view own testimonials"
  ON testimonials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = testimonials.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Authors can view own testimonials"
  ON testimonials FOR SELECT
  USING (author_id = auth.uid());

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

CREATE POLICY "Profile owners can update testimonial settings"
  ON testimonials FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = testimonials.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Authors can update recent testimonials"
  ON testimonials FOR UPDATE
  USING (
    author_id = auth.uid() AND
    created_at > NOW() - INTERVAL '7 days'
  );

-- Stage 26: Create Credits Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_item_id UUID NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,

  -- Credit details
  role TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  artist_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Additional info
  label TEXT,
  release_title TEXT,
  release_year INTEGER,
  external_url TEXT,

  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credits_portfolio_item_id ON credits(portfolio_item_id);
CREATE INDEX IF NOT EXISTS idx_credits_artist_profile_id ON credits(artist_profile_id);
CREATE INDEX IF NOT EXISTS idx_credits_artist_name ON credits(artist_name);

COMMENT ON TABLE credits IS 'Artist and label credits for portfolio items';

-- Stage 27: RLS Policies for Credits
-- ============================================================================
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

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

-- Stage 28: Create Subscriptions Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE INDEX IF NOT EXISTS idx_subscriptions_profile_id ON subscriptions(profile_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_current_period_end ON subscriptions(current_period_end);

COMMENT ON TABLE subscriptions IS 'Subscription tracking for Pro and Enterprise tiers';

-- Stage 29: RLS Policies for Subscriptions
-- ============================================================================
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = subscriptions.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "System can insert subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = subscriptions.profile_id
    )
  );

CREATE POLICY "System can update subscriptions"
  ON subscriptions FOR UPDATE
  USING (true);

-- Stage 30: Create Analytics Events Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event details
  event_type TEXT NOT NULL,
  event_category TEXT,

  -- Context
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Related entities
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  -- Session tracking
  session_id UUID,
  ip_address TEXT,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_profile_id ON analytics_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_metadata ON analytics_events USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_analytics_profile_event_date ON analytics_events(profile_id, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_service_views ON analytics_events(service_id, event_type) WHERE event_type = 'service_view';
CREATE INDEX IF NOT EXISTS idx_analytics_product_views ON analytics_events(product_id, event_type) WHERE event_type = 'product_view';

COMMENT ON TABLE analytics_events IS 'User behavior and platform analytics tracking';

-- Stage 31: RLS Policies for Analytics Events
-- ============================================================================
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profile owners can view own analytics"
  ON analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = analytics_events.profile_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can view own activity"
  ON analytics_events FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- Stage 32: Create Profile Creation Trigger
-- ============================================================================
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates a profile when a new user signs up';

-- Stage 33: Create Updated_at Trigger Function
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.handle_updated_at IS 'Automatically updates updated_at timestamp on row modification';

-- Stage 34: Apply Updated_at Triggers to All Tables
-- ============================================================================
DROP TRIGGER IF EXISTS set_updated_at ON profiles;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON social_links;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON social_links
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON portfolio_items;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON portfolio_items
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON services;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON service_addons;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON service_addons
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON turnaround_options;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON turnaround_options
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON products;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON orders;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON product_purchases;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON product_purchases
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON messages;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON testimonials;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON credits;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON credits
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at ON subscriptions;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Stage 35: Create Order Number Generation Functions
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  current_year TEXT;
  next_sequence INTEGER;
  order_num TEXT;
BEGIN
  current_year := TO_CHAR(NOW(), 'YYYY');

  SELECT COALESCE(MAX(
    CAST(SUBSTRING(order_number FROM 'ORD-' || current_year || '-(\d+)') AS INTEGER)
  ), 0) + 1 INTO next_sequence
  FROM orders
  WHERE order_number LIKE 'ORD-' || current_year || '-%';

  order_num := 'ORD-' || current_year || '-' || LPAD(next_sequence::TEXT, 6, '0');

  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number_trigger ON orders;
CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

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

CREATE OR REPLACE FUNCTION public.set_purchase_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.purchase_number IS NULL THEN
    NEW.purchase_number := generate_purchase_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_purchase_number_trigger ON product_purchases;
CREATE TRIGGER set_purchase_number_trigger
  BEFORE INSERT ON product_purchases
  FOR EACH ROW
  EXECUTE FUNCTION set_purchase_number();

COMMENT ON FUNCTION public.generate_order_number IS 'Generates unique order numbers in format ORD-YYYY-NNNNNN';
COMMENT ON FUNCTION public.generate_purchase_number IS 'Generates unique purchase numbers in format PUR-YYYY-NNNNNN';

-- ============================================================================
-- END OF PHASE 01: DATABASE FOUNDATION
-- ============================================================================
