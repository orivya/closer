-- ============================================================================
-- PHASE 02: STORAGE & FILE MANAGEMENT
-- MixExperts Master Launch Blueprint
-- Created: December 28, 2025
-- ============================================================================

-- Stage 2.1: Create 'avatars' Bucket (Public)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Stage 2.2: RLS Policies for 'avatars' Bucket
-- ============================================================================
-- Policy 1: Anyone can view avatar images (public bucket)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Policy 2: Authenticated users can upload their own avatar
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 3: Users can update their own avatar
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 4: Users can delete their own avatar
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Stage 2.3: Create 'banners' Bucket (Public)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners',
  'banners',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Stage 2.4: RLS Policies for 'banners' Bucket
-- ============================================================================
DROP POLICY IF EXISTS "Banner images are publicly accessible" ON storage.objects;
CREATE POLICY "Banner images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

DROP POLICY IF EXISTS "Users can upload their own banner" ON storage.objects;
CREATE POLICY "Users can upload their own banner"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'banners' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update their own banner" ON storage.objects;
CREATE POLICY "Users can update their own banner"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'banners' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own banner" ON storage.objects;
CREATE POLICY "Users can delete their own banner"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'banners' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Stage 2.5: Create 'portfolio-audio' Bucket (Public)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-audio',
  'portfolio-audio',
  true,
  104857600, -- 100MB
  ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/flac', 'audio/aac', 'audio/ogg']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Stage 2.6: RLS Policies for 'portfolio-audio' Bucket
-- ============================================================================
DROP POLICY IF EXISTS "Portfolio audio is publicly accessible" ON storage.objects;
CREATE POLICY "Portfolio audio is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-audio');

DROP POLICY IF EXISTS "Users can upload their own portfolio audio" ON storage.objects;
CREATE POLICY "Users can upload their own portfolio audio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update their own portfolio audio" ON storage.objects;
CREATE POLICY "Users can update their own portfolio audio"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own portfolio audio" ON storage.objects;
CREATE POLICY "Users can delete their own portfolio audio"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Stage 2.7: Create 'portfolio-images' Bucket (Public)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-images',
  'portfolio-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Stage 2.8: RLS Policies for 'portfolio-images' Bucket
-- ============================================================================
DROP POLICY IF EXISTS "Portfolio images are publicly accessible" ON storage.objects;
CREATE POLICY "Portfolio images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "Users can upload their own portfolio images" ON storage.objects;
CREATE POLICY "Users can upload their own portfolio images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update their own portfolio images" ON storage.objects;
CREATE POLICY "Users can update their own portfolio images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own portfolio images" ON storage.objects;
CREATE POLICY "Users can delete their own portfolio images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Stage 2.9: Create 'products' Bucket (PRIVATE)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  false, -- PRIVATE - files accessed via signed URLs only
  524288000, -- 500MB
  NULL -- Allow all types
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Stage 2.10: RLS Policies for 'products' Bucket (Owner Only)
-- ============================================================================
-- NO public SELECT policy (private bucket)

DROP POLICY IF EXISTS "Users can upload their own products" ON storage.objects;
CREATE POLICY "Users can upload their own products"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update their own products" ON storage.objects;
CREATE POLICY "Users can update their own products"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own products" ON storage.objects;
CREATE POLICY "Users can delete their own products"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Owners can view their own products
DROP POLICY IF EXISTS "Users can view their own products" ON storage.objects;
CREATE POLICY "Users can view their own products"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Stage 2.11: Create 'product-previews' Bucket (Public)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-previews',
  'product-previews',
  true,
  52428800, -- 50MB
  ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Stage 2.12: RLS Policies for 'product-previews' Bucket
-- ============================================================================
DROP POLICY IF EXISTS "Product previews are publicly accessible" ON storage.objects;
CREATE POLICY "Product previews are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-previews');

DROP POLICY IF EXISTS "Users can upload their own product previews" ON storage.objects;
CREATE POLICY "Users can upload their own product previews"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-previews' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update their own product previews" ON storage.objects;
CREATE POLICY "Users can update their own product previews"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-previews' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own product previews" ON storage.objects;
CREATE POLICY "Users can delete their own product previews"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-previews' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Stage 2.13: Create 'order-files' Bucket (PRIVATE)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-files',
  'order-files',
  false, -- PRIVATE
  2147483648, -- 2GB
  NULL -- Allow all types
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Stage 2.14: RLS Policies for 'order-files' (Engineer + Client Access)
-- ============================================================================
-- Engineers can view files for their orders
DROP POLICY IF EXISTS "Engineers can view their order files" ON storage.objects;
CREATE POLICY "Engineers can view their order files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'order-files' AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id::text = (storage.foldername(name))[1]
      AND orders.seller_id = auth.uid()
    )
  );

-- Clients can view files for their orders
DROP POLICY IF EXISTS "Clients can view their order files" ON storage.objects;
CREATE POLICY "Clients can view their order files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'order-files' AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id::text = (storage.foldername(name))[1]
      AND orders.buyer_id = auth.uid()
    )
  );

-- Engineers can upload files to their orders
DROP POLICY IF EXISTS "Engineers can upload to their order files" ON storage.objects;
CREATE POLICY "Engineers can upload to their order files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'order-files' AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id::text = (storage.foldername(name))[1]
      AND orders.seller_id = auth.uid()
    )
  );

-- Clients can upload files to their orders
DROP POLICY IF EXISTS "Clients can upload to their order files" ON storage.objects;
CREATE POLICY "Clients can upload to their order files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'order-files' AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id::text = (storage.foldername(name))[1]
      AND orders.buyer_id = auth.uid()
    )
  );

-- Order participants can delete files they uploaded
DROP POLICY IF EXISTS "Order participants can delete their uploads" ON storage.objects;
CREATE POLICY "Order participants can delete their uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'order-files' AND
    EXISTS (
      SELECT 1 FROM public.order_files
      WHERE order_files.file_url LIKE '%' || name || '%'
      AND order_files.uploader_id = auth.uid()
    )
  );

-- Stage 2.15: Create 'credit-logos' Bucket (Public)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'credit-logos',
  'credit-logos',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Stage 2.16: RLS Policies for 'credit-logos' Bucket
-- ============================================================================
DROP POLICY IF EXISTS "Credit logos are publicly accessible" ON storage.objects;
CREATE POLICY "Credit logos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'credit-logos');

DROP POLICY IF EXISTS "Users can upload their own credit logos" ON storage.objects;
CREATE POLICY "Users can upload their own credit logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'credit-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can update their own credit logos" ON storage.objects;
CREATE POLICY "Users can update their own credit logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'credit-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own credit logos" ON storage.objects;
CREATE POLICY "Users can delete their own credit logos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'credit-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- END OF PHASE 02: STORAGE & FILE MANAGEMENT
-- ============================================================================
