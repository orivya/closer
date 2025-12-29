# PHASE 02: Storage & File Management

**Priority:** CRITICAL
**Estimated Effort:** 2-3 hours
**Dependencies:** Supabase project configured
**Status:** Not Started

---

## Overview

This phase establishes the complete Supabase Storage infrastructure for MixExperts, including all storage buckets, Row Level Security (RLS) policies, CORS configuration, and file management utilities. Proper storage setup is critical for handling user-generated content including avatars, portfolio audio files, digital products, and order deliveries.

**What This Phase Accomplishes:**
- 8 storage buckets with appropriate access controls
- Complete RLS policies for secure file access
- File size and type validation
- CORS configuration for client-side uploads
- Helper functions for signed URLs
- Comprehensive testing of all storage operations

---

## Storage Bucket Strategy

| Bucket | Public | Max Size | File Types | Purpose |
|--------|--------|----------|------------|---------|
| `avatars` | Yes | 5MB | image/* | User profile pictures |
| `banners` | Yes | 10MB | image/* | Profile header images |
| `portfolio-audio` | Yes | 100MB | audio/* | Before/after audio demos |
| `portfolio-images` | Yes | 10MB | image/* | Portfolio cover art |
| `products` | No | 500MB | * | Digital product files (private) |
| `product-previews` | Yes | 50MB | audio/* | Product preview audio |
| `order-files` | No | 2GB | * | Project files & deliveries (private) |
| `credit-logos` | Yes | 2MB | image/* | Client/brand logos |

---

## Implementation Checklist

### Stage 2.1: Create 'avatars' Bucket
**Status:** [ ] Not Started

Navigate to Supabase Dashboard → Storage → Create Bucket

**Configuration:**
```
Bucket Name: avatars
Public: Yes
File Size Limit: 5MB
Allowed MIME Types: image/jpeg, image/png, image/webp, image/gif
```

**SQL to verify bucket creation:**
```sql
SELECT id, name, public
FROM storage.buckets
WHERE name = 'avatars';
```

---

### Stage 2.2: Create RLS Policies for 'avatars' Bucket
**Status:** [ ] Not Started

Execute in Supabase SQL Editor:

```sql
-- Policy 1: Anyone can view avatar images (public bucket)
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Policy 2: Authenticated users can upload their own avatar
-- Folder structure: avatars/{user_id}/avatar.jpg
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 3: Users can update their own avatar
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 4: Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Test RLS:**
```sql
-- Verify policies are active
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%avatar%';
```

---

### Stage 2.3: Create 'banners' Bucket
**Status:** [ ] Not Started

**Configuration:**
```
Bucket Name: banners
Public: Yes
File Size Limit: 10MB
Allowed MIME Types: image/jpeg, image/png, image/webp
```

**SQL verification:**
```sql
SELECT id, name, public
FROM storage.buckets
WHERE name = 'banners';
```

---

### Stage 2.4: Create RLS Policies for 'banners' Bucket
**Status:** [ ] Not Started

```sql
-- Policy 1: Anyone can view banner images
CREATE POLICY "Banner images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'banners');

-- Policy 2: Users can upload their own banner
CREATE POLICY "Users can upload their own banner"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'banners' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 3: Users can update their own banner
CREATE POLICY "Users can update their own banner"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'banners' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 4: Users can delete their own banner
CREATE POLICY "Users can delete their own banner"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'banners' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

### Stage 2.5: Create 'portfolio-audio' Bucket
**Status:** [ ] Not Started

**Configuration:**
```
Bucket Name: portfolio-audio
Public: Yes
File Size Limit: 100MB
Allowed MIME Types: audio/mpeg, audio/wav, audio/mp3, audio/flac, audio/aac, audio/ogg
```

**SQL verification:**
```sql
SELECT id, name, public
FROM storage.buckets
WHERE name = 'portfolio-audio';
```

---

### Stage 2.6: Create RLS Policies for 'portfolio-audio' Bucket
**Status:** [ ] Not Started

```sql
-- Policy 1: Anyone can listen to portfolio audio (for public profiles)
CREATE POLICY "Portfolio audio is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-audio');

-- Policy 2: Users can upload their own portfolio audio
CREATE POLICY "Users can upload their own portfolio audio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 3: Users can update their own portfolio audio
CREATE POLICY "Users can update their own portfolio audio"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 4: Users can delete their own portfolio audio
CREATE POLICY "Users can delete their own portfolio audio"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

### Stage 2.7: Create 'portfolio-images' Bucket
**Status:** [ ] Not Started

**Configuration:**
```
Bucket Name: portfolio-images
Public: Yes
File Size Limit: 10MB
Allowed MIME Types: image/jpeg, image/png, image/webp
```

**SQL verification:**
```sql
SELECT id, name, public
FROM storage.buckets
WHERE name = 'portfolio-images';
```

---

### Stage 2.8: Create RLS Policies for 'portfolio-images' Bucket
**Status:** [ ] Not Started

```sql
-- Policy 1: Anyone can view portfolio images
CREATE POLICY "Portfolio images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

-- Policy 2: Users can upload their own portfolio images
CREATE POLICY "Users can upload their own portfolio images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 3: Users can update their own portfolio images
CREATE POLICY "Users can update their own portfolio images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'portfolio-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 4: Users can delete their own portfolio images
CREATE POLICY "Users can delete their own portfolio images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

### Stage 2.9: Create 'products' Bucket (PRIVATE)
**Status:** [ ] Not Started

**Configuration:**
```
Bucket Name: products
Public: No (PRIVATE - files accessed via signed URLs only)
File Size Limit: 500MB
Allowed MIME Types: * (all types - presets, samples, templates, etc.)
```

**Important:** This bucket stores the actual digital product files that buyers download after purchase. Files must be private and only accessible via time-limited signed URLs.

**SQL verification:**
```sql
SELECT id, name, public
FROM storage.buckets
WHERE name = 'products';
```

---

### Stage 2.10: Create RLS Policies for 'products' Bucket (Owner Only)
**Status:** [ ] Not Started

```sql
-- Policy 1: NO public access (private bucket)
-- (No SELECT policy for public)

-- Policy 2: Users can upload their own products
CREATE POLICY "Users can upload their own products"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 3: Users can update their own products
CREATE POLICY "Users can update their own products"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 4: Users can delete their own products
CREATE POLICY "Users can delete their own products"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 5: Service role can access (for generating signed URLs)
CREATE POLICY "Service role can access all products"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'products' AND
    auth.role() = 'service_role'
  );
```

**Note:** Buyers will receive time-limited signed URLs after purchase. The application will use the service role to generate these URLs.

---

### Stage 2.11: Create 'product-previews' Bucket
**Status:** [ ] Not Started

**Configuration:**
```
Bucket Name: product-previews
Public: Yes
File Size Limit: 50MB
Allowed MIME Types: audio/mpeg, audio/wav, audio/mp3, audio/ogg
```

**Purpose:** Store preview/demo audio for digital products (e.g., preset demos, sample pack previews).

**SQL verification:**
```sql
SELECT id, name, public
FROM storage.buckets
WHERE name = 'product-previews';
```

---

### Stage 2.12: Create RLS Policies for 'product-previews' Bucket
**Status:** [ ] Not Started

```sql
-- Policy 1: Anyone can listen to product previews
CREATE POLICY "Product previews are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-previews');

-- Policy 2: Users can upload their own product previews
CREATE POLICY "Users can upload their own product previews"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-previews' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 3: Users can update their own product previews
CREATE POLICY "Users can update their own product previews"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-previews' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 4: Users can delete their own product previews
CREATE POLICY "Users can delete their own product previews"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-previews' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

### Stage 2.13: Create 'order-files' Bucket (PRIVATE)
**Status:** [ ] Not Started

**Configuration:**
```
Bucket Name: order-files
Public: No (PRIVATE)
File Size Limit: 2GB (2048MB)
Allowed MIME Types: * (all types - stems, mixes, mastered files, etc.)
```

**Purpose:** Store project files uploaded by clients and delivery files from engineers.

**SQL verification:**
```sql
SELECT id, name, public
FROM storage.buckets
WHERE name = 'order-files';
```

---

### Stage 2.14: Create RLS Policies for 'order-files' (Engineer + Client Access)
**Status:** [ ] Not Started

```sql
-- Policy 1: Engineers can view files for their orders
CREATE POLICY "Engineers can view their order files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'order-files' AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id::text = (storage.foldername(name))[1]
      AND orders.engineer_id = auth.uid()
    )
  );

-- Policy 2: Clients can view files for their orders
CREATE POLICY "Clients can view their order files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'order-files' AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id::text = (storage.foldername(name))[1]
      AND orders.client_id = auth.uid()
    )
  );

-- Policy 3: Engineers can upload files to their orders
CREATE POLICY "Engineers can upload to their order files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'order-files' AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id::text = (storage.foldername(name))[1]
      AND orders.engineer_id = auth.uid()
    )
  );

-- Policy 4: Clients can upload files to their orders
CREATE POLICY "Clients can upload to their order files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'order-files' AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id::text = (storage.foldername(name))[1]
      AND orders.client_id = auth.uid()
    )
  );

-- Policy 5: Order participants can delete files they uploaded
CREATE POLICY "Order participants can delete their uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'order-files' AND
    EXISTS (
      SELECT 1 FROM public.order_files
      WHERE order_files.file_url LIKE '%' || name || '%'
      AND order_files.uploaded_by = auth.uid()
    )
  );
```

**Important:** These policies ensure only the engineer and client involved in a specific order can access that order's files.

---

### Stage 2.15: Create 'credit-logos' Bucket
**Status:** [ ] Not Started

**Configuration:**
```
Bucket Name: credit-logos
Public: Yes
File Size Limit: 2MB
Allowed MIME Types: image/jpeg, image/png, image/webp, image/svg+xml
```

**Purpose:** Store logos for client credits (labels, artists, brands worked with).

**SQL verification:**
```sql
SELECT id, name, public
FROM storage.buckets
WHERE name = 'credit-logos';
```

---

### Stage 2.16: Create RLS Policies for 'credit-logos' Bucket
**Status:** [ ] Not Started

```sql
-- Policy 1: Anyone can view credit logos
CREATE POLICY "Credit logos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'credit-logos');

-- Policy 2: Users can upload their own credit logos
CREATE POLICY "Users can upload their own credit logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'credit-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 3: Users can update their own credit logos
CREATE POLICY "Users can update their own credit logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'credit-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 4: Users can delete their own credit logos
CREATE POLICY "Users can delete their own credit logos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'credit-logos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

### Stage 2.17: Configure CORS for All Buckets
**Status:** [ ] Not Started

CORS must be configured to allow client-side uploads from your Next.js application.

Execute in Supabase SQL Editor:

```sql
-- Update CORS configuration for all buckets
-- This allows your Next.js app to upload files directly from the browser

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
]
WHERE name = 'avatars';

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg',
  'image/png',
  'image/webp'
]
WHERE name = 'banners';

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'audio/mpeg',
  'audio/wav',
  'audio/mp3',
  'audio/flac',
  'audio/aac',
  'audio/ogg'
]
WHERE name = 'portfolio-audio';

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg',
  'image/png',
  'image/webp'
]
WHERE name = 'portfolio-images';

UPDATE storage.buckets
SET allowed_mime_types = NULL -- Allow all types
WHERE name = 'products';

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'audio/mpeg',
  'audio/wav',
  'audio/mp3',
  'audio/ogg'
]
WHERE name = 'product-previews';

UPDATE storage.buckets
SET allowed_mime_types = NULL -- Allow all types
WHERE name = 'order-files';

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml'
]
WHERE name = 'credit-logos';
```

**Additional CORS Configuration:**

If you need to configure CORS headers, navigate to:
Supabase Dashboard → Settings → API → CORS

Add your domain(s):
```
http://localhost:3000
https://your-production-domain.com
```

---

### Stage 2.18: Set Up File Size Validation
**Status:** [ ] Not Started

Create database function to validate file sizes before upload:

```sql
-- Function to check file size limits
CREATE OR REPLACE FUNCTION public.check_storage_size_limit()
RETURNS TRIGGER AS $$
DECLARE
  bucket_limit BIGINT;
  file_size BIGINT;
BEGIN
  -- Get file size from metadata
  file_size := (NEW.metadata->>'size')::BIGINT;

  -- Get bucket size limit based on bucket name
  bucket_limit := CASE NEW.bucket_id
    WHEN 'avatars' THEN 5242880 -- 5MB
    WHEN 'banners' THEN 10485760 -- 10MB
    WHEN 'portfolio-audio' THEN 104857600 -- 100MB
    WHEN 'portfolio-images' THEN 10485760 -- 10MB
    WHEN 'products' THEN 524288000 -- 500MB
    WHEN 'product-previews' THEN 52428800 -- 50MB
    WHEN 'order-files' THEN 2147483648 -- 2GB
    WHEN 'credit-logos' THEN 2097152 -- 2MB
    ELSE 10485760 -- Default 10MB
  END;

  -- Check if file exceeds limit
  IF file_size > bucket_limit THEN
    RAISE EXCEPTION 'File size % exceeds limit of % for bucket %',
      file_size, bucket_limit, NEW.bucket_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on storage.objects
CREATE TRIGGER check_file_size_before_insert
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION public.check_storage_size_limit();
```

**Alternative:** Size validation can also be done on the client-side before upload for better UX.

---

### Stage 2.19: Create Helper Functions for Signed URLs
**Status:** [ ] Not Started

Create utility functions in your Next.js app for generating signed URLs:

**File:** `src/lib/storage/signedUrls.ts`

```typescript
import { createClient } from '@/lib/supabase/server';

/**
 * Generate a signed URL for a private file
 * Used for product downloads and order files
 */
export async function generateSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600 // Default 1 hour
): Promise<string | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }

  return data.signedUrl;
}

/**
 * Generate a signed URL for product download
 * Expires in 24 hours, used after purchase
 */
export async function generateProductDownloadUrl(
  userId: string,
  productFileName: string
): Promise<string | null> {
  const path = `${userId}/${productFileName}`;
  return generateSignedUrl('products', path, 86400); // 24 hours
}

/**
 * Generate signed URLs for order files
 * Expires in 7 days, used for project delivery
 */
export async function generateOrderFileUrl(
  orderId: string,
  fileName: string
): Promise<string | null> {
  const path = `${orderId}/${fileName}`;
  return generateSignedUrl('order-files', path, 604800); // 7 days
}

/**
 * Get public URL for a file in a public bucket
 */
export async function getPublicUrl(
  bucket: string,
  path: string
): Promise<string | null> {
  const supabase = createClient();

  const { data } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}
```

---

### Stage 2.20: Test File Upload/Download for Each Bucket
**Status:** [ ] Not Started

Create comprehensive test suite for all storage operations.

**Test Checklist:**

#### Avatars Bucket
- [ ] Upload JPEG avatar (authenticated user)
- [ ] Upload PNG avatar (authenticated user)
- [ ] Verify public URL is accessible
- [ ] Attempt to upload to another user's folder (should fail)
- [ ] Attempt to upload 6MB file (should fail - exceeds 5MB limit)
- [ ] Delete own avatar (should succeed)

#### Banners Bucket
- [ ] Upload banner image (authenticated user)
- [ ] Verify public URL is accessible
- [ ] Attempt to upload 15MB file (should fail - exceeds 10MB limit)
- [ ] Update existing banner

#### Portfolio Audio Bucket
- [ ] Upload MP3 file (< 100MB)
- [ ] Upload WAV file (< 100MB)
- [ ] Verify public URL is accessible
- [ ] Verify audio playback in browser
- [ ] Attempt to upload video file (should fail - wrong type)

#### Portfolio Images Bucket
- [ ] Upload portfolio cover image
- [ ] Verify public URL is accessible
- [ ] Update existing image

#### Products Bucket (Private)
- [ ] Upload product file (authenticated user)
- [ ] Verify NO public URL works (should 403)
- [ ] Generate signed URL via API
- [ ] Verify signed URL works
- [ ] Verify signed URL expires after time limit
- [ ] Attempt to access another user's product (should fail)

#### Product Previews Bucket
- [ ] Upload audio preview
- [ ] Verify public playback

#### Order Files Bucket (Private)
- [ ] Create test order
- [ ] Upload file as engineer
- [ ] Upload file as client
- [ ] Verify engineer can see client files
- [ ] Verify client can see engineer files
- [ ] Attempt to access files from different order (should fail)
- [ ] Generate signed URL for download

#### Credit Logos Bucket
- [ ] Upload JPEG logo
- [ ] Upload PNG logo
- [ ] Upload SVG logo
- [ ] Verify public URL is accessible

**Test Script Template:**

Create `src/scripts/test-storage.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testAvatarUpload() {
  console.log('Testing avatar upload...');

  // Sign in as test user
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'test@example.com',
    password: 'testpassword'
  });

  if (!authData.user) throw new Error('Auth failed');

  // Create test file
  const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' });

  // Upload
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`${authData.user.id}/avatar.jpg`, file, {
      upsert: true
    });

  if (error) {
    console.error('❌ Avatar upload failed:', error);
  } else {
    console.log('✅ Avatar upload succeeded:', data);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(`${authData.user.id}/avatar.jpg`);

  console.log('Public URL:', urlData.publicUrl);
}

// Run tests
testAvatarUpload().catch(console.error);
```

---

## Verification & Validation

After completing all stages, verify the following:

### Bucket Verification Query
```sql
-- Check all buckets exist and are configured correctly
SELECT
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
ORDER BY name;
```

Expected output:
```
name               | public | file_size_limit | allowed_mime_types
-------------------|--------|-----------------|-------------------
avatars            | true   | 5242880         | {image/*}
banners            | true   | 10485760        | {image/*}
credit-logos       | true   | 2097152         | {image/*}
order-files        | false  | 2147483648      | NULL
portfolio-audio    | true   | 104857600       | {audio/*}
portfolio-images   | true   | 10485760        | {image/*}
product-previews   | true   | 52428800        | {audio/*}
products           | false  | 524288000       | NULL
```

### Policy Verification Query
```sql
-- Check all RLS policies are in place
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
ORDER BY policyname;
```

You should see 4 policies per bucket (SELECT, INSERT, UPDATE, DELETE) = 32+ total policies.

---

## Common Issues & Troubleshooting

### Issue: "new row violates row-level security policy"
**Cause:** RLS policy not configured correctly or user not authenticated.
**Fix:**
1. Verify user is authenticated
2. Check policy WITH CHECK clause matches folder structure
3. Ensure `auth.uid()` matches folder name

### Issue: "File size exceeds limit"
**Cause:** File is larger than bucket's configured limit.
**Fix:**
1. Check file size on client before upload
2. Compress/optimize file
3. Verify bucket limit is set correctly

### Issue: "CORS policy blocked request"
**Cause:** Domain not whitelisted in Supabase CORS settings.
**Fix:**
1. Go to Supabase Dashboard → Settings → API → CORS
2. Add your domain (including protocol)
3. For local dev, add `http://localhost:3000`

### Issue: Signed URL returns 404
**Cause:** File doesn't exist or path is incorrect.
**Fix:**
1. Verify file exists: `SELECT * FROM storage.objects WHERE name LIKE '%filename%'`
2. Check path format: `{user_id}/filename.ext`
3. Ensure bucket name is correct

### Issue: Can't delete file
**Cause:** No DELETE policy or policy doesn't match conditions.
**Fix:**
1. Verify DELETE policy exists for that bucket
2. Check policy USING clause
3. Ensure user owns the file

---

## Security Best Practices

1. **Always use RLS policies** - Never rely on client-side security alone
2. **Validate file types** - Check MIME types on upload
3. **Limit file sizes** - Prevent abuse and control storage costs
4. **Use signed URLs for private files** - Never make private buckets public
5. **Expire signed URLs** - Set reasonable expiration times (24 hours for downloads)
6. **Folder structure** - Always organize by user ID: `{bucket}/{user_id}/file.ext`
7. **Cleanup on delete** - Remove files from storage when deleting database records
8. **Monitor storage usage** - Track per-user storage quotas
9. **Validate on server** - Always validate uploads in API routes, not just client
10. **Log access** - Track file access for security auditing

---

## Next Steps

After completing this phase:

1. **Phase 03:** Wire frontend components to storage (avatar upload, portfolio upload, etc.)
2. **Phase 04:** Implement file upload UI components with progress bars
3. **Phase 05:** Create cleanup jobs to remove orphaned files
4. **Phase 06:** Set up CDN for public files (optional, for performance)

---

## Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase Storage RLS](https://supabase.com/docs/guides/storage/security/access-control)
- [File Upload Best Practices](https://supabase.com/docs/guides/storage/uploads/file-limits)
- [Signed URLs Guide](https://supabase.com/docs/guides/storage/serving/downloads)

---

**Phase Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

**Completed By:** _____________
**Date Completed:** _____________
**Notes:**

---

*This document is part of the MixExperts Master Launch Blueprint. Update status as stages are completed.*
