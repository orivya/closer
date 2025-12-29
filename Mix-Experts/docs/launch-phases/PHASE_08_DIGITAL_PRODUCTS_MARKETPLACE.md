# PHASE 08: Digital Products Marketplace

**Priority:** HIGH
**Estimated Effort:** 4-5 days
**Dependencies:** Phase 1 (Database), Phase 2 (Auth), Phase 5 (Stripe Connect)

---

## Overview

This phase implements a comprehensive digital products marketplace enabling engineers to sell presets, sample packs, templates, and other digital goods. The marketplace includes product management, secure file delivery, license management, and automated payment processing with tier-based platform fees.

### Platform Fee Structure

| Seller Tier | Platform Fee on Product Sales |
|-------------|------------------------------|
| Free | 10% |
| Pro | 0% |
| Enterprise | 0% |

### Key Features

- Product creation and management dashboard
- Multi-file upload (product files, previews, images)
- License type selection and custom terms
- Automated checkout with Stripe destination charges
- Secure download delivery with expiring signed URLs
- Download limit enforcement (5 downloads per purchase)
- Purchase history and sales analytics
- Product performance tracking

---

## Implementation Stages

### Stage 8.1: Create useProducts Hook for Data Fetching

**Task:** Build a custom React hook to manage product data operations.

**Files to Create:**
- `/src/hooks/useProducts.ts`

**Implementation Details:**

```typescript
// useProducts.ts
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Product } from '@/lib/types';

export function useProducts(profileId?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileId) {
        query = query.eq('profile_id', profileId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single product by slug
  const fetchProductBySlug = async (username: string, slug: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (!profile) throw new Error('Profile not found');

    const { data, error } = await supabase
      .from('products')
      .select('*, profiles(username, display_name, avatar_url)')
      .eq('profile_id', profile.id)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  };

  useEffect(() => {
    fetchProducts();
  }, [profileId]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    fetchProductBySlug,
  };
}
```

**Testing Checklist:**
- [ ] Hook fetches all products for authenticated user
- [ ] Hook filters by profile_id when provided
- [ ] Hook handles loading and error states correctly
- [ ] Hook refetches on profileId change
- [ ] fetchProductBySlug resolves username to profile_id correctly

---

### Stage 8.2: Wire Dashboard Products Page to Database

**Task:** Replace mock data with real database queries in the products dashboard.

**Files to Update:**
- `/src/app/dashboard/products/page.tsx`

**Implementation Details:**

```typescript
'use client';

import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { ProductList } from '@/components/dashboard/products/ProductList';
import { ProductEditor } from '@/components/dashboard/products/ProductEditor';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function ProductsPage() {
  const { profile } = useAuth();
  const { products, loading, refetch } = useProducts(profile?.id);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditorOpen(true);
  };

  const handleSaveComplete = () => {
    setIsEditorOpen(false);
    refetch(); // Refresh list
  };

  if (loading) {
    return <ProductsLoadingSkeleton />;
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          Products
        </h1>
        <p className="text-[var(--text-gray)]">
          Manage your digital products, presets, and sample packs.
        </p>
      </div>

      <ProductList
        products={products}
        onEdit={handleEdit}
        onCreate={handleCreate}
      />

      {isEditorOpen && (
        <ProductEditor
          product={editingProduct}
          onSave={handleSaveComplete}
          onCancel={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
}
```

**Testing Checklist:**
- [ ] Products load from database on page mount
- [ ] Loading skeleton displays during fetch
- [ ] Empty state shows when no products exist
- [ ] Products list updates after creating/editing
- [ ] Error states display appropriately

---

### Stage 8.3: Create Product Creation Form/Modal

**Task:** Build comprehensive product creation form with all required fields.

**Files to Update:**
- `/src/components/dashboard/products/ProductEditor.tsx`

**Implementation Details:**

Add form fields for:
- Product name (required)
- Short description (150 chars)
- Full description (rich text)
- Product type (dropdown: preset, template, sample_pack, course, other)
- Price (required)
- Currency (default USD)

**Form Validation:**
```typescript
const validateProduct = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters';
  }

  if (!data.price || data.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (!data.product_type) {
    errors.product_type = 'Please select a product type';
  }

  if (data.short_description && data.short_description.length > 150) {
    errors.short_description = 'Short description must be 150 characters or less';
  }

  return errors;
};
```

**Testing Checklist:**
- [ ] Form validates all required fields
- [ ] Character limits enforced on text fields
- [ ] Price accepts decimal values
- [ ] Product type dropdown shows all options
- [ ] Form state persists when switching between steps

---

### Stage 8.4: Implement Product File Upload (Private Bucket)

**Task:** Add secure file upload for the main product file (private storage).

**Files to Create/Update:**
- `/src/components/dashboard/products/FileUploader.tsx`
- Update ProductEditor to integrate file upload

**Implementation Details:**

```typescript
// FileUploader.tsx
const uploadProductFile = async (file: File, profileId: string) => {
  const supabase = createClientComponentClient();

  // Generate unique file path
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${profileId}/products/${fileName}`;

  // Upload to private products bucket
  const { data, error } = await supabase.storage
    .from('products')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  return {
    file_url: filePath,
    file_size_bytes: file.size,
    file_name: file.name
  };
};
```

**Storage Bucket Configuration:**
- Bucket name: `products`
- Public: NO
- Max file size: 500MB
- Allowed file types: All (*)

**RLS Policy:**
```sql
-- Only authenticated users can upload to their own folder
CREATE POLICY "Users can upload their own products"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can read their own product files
CREATE POLICY "Users can read their own products"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'products' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Testing Checklist:**
- [ ] Files upload successfully to private bucket
- [ ] File path includes user ID for isolation
- [ ] Upload progress indicator works
- [ ] File size validation (max 500MB)
- [ ] Large files handle gracefully
- [ ] Upload errors display user-friendly messages

---

### Stage 8.5: Implement Preview Audio Upload (Public Bucket)

**Task:** Add preview audio upload for public streaming.

**Implementation Details:**

```typescript
const uploadPreviewAudio = async (file: File, profileId: string) => {
  const supabase = createClientComponentClient();

  // Validate file type
  if (!file.type.startsWith('audio/')) {
    throw new Error('Preview must be an audio file');
  }

  // Validate file size (max 50MB)
  if (file.size > 50 * 1024 * 1024) {
    throw new Error('Preview audio must be under 50MB');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `preview-${Date.now()}.${fileExt}`;
  const filePath = `${profileId}/previews/${fileName}`;

  // Upload to public bucket
  const { data, error } = await supabase.storage
    .from('product-previews')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-previews')
    .getPublicUrl(filePath);

  return publicUrl;
};
```

**Storage Bucket Configuration:**
- Bucket name: `product-previews`
- Public: YES
- Max file size: 50MB
- Allowed file types: audio/*

**RLS Policy:**
```sql
-- Anyone can view preview audio
CREATE POLICY "Preview audio is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-previews');

-- Users can upload their own previews
CREATE POLICY "Users can upload preview audio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-previews' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Testing Checklist:**
- [ ] Audio files upload successfully
- [ ] Public URL generates correctly
- [ ] File type validation works (audio only)
- [ ] File size validation enforced (50MB max)
- [ ] Preview audio streams in browser
- [ ] Non-audio files rejected with clear error

---

### Stage 8.6: Implement Cover Image Upload

**Task:** Add cover image upload for product cards.

**Implementation Details:**

```typescript
const uploadCoverImage = async (file: File, profileId: string) => {
  const supabase = createClientComponentClient();

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Cover must be an image file');
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Cover image must be under 10MB');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `cover-${Date.now()}.${fileExt}`;
  const filePath = `${profileId}/covers/${fileName}`;

  // Upload to public bucket
  const { data, error } = await supabase.storage
    .from('portfolio-images')
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(filePath);

  return publicUrl;
};
```

**Recommended Image Specs:**
- Aspect ratio: 16:9 or 1:1
- Minimum resolution: 800x600px
- Recommended: 1200x900px
- Format: JPG, PNG, WebP

**Testing Checklist:**
- [ ] Images upload successfully
- [ ] Image preview shows before upload
- [ ] Image type validation works
- [ ] Image size validation enforced
- [ ] Uploaded image displays in product card
- [ ] Non-image files rejected

---

### Stage 8.7: Add Product Metadata (Name, Description, Type)

**Task:** Complete metadata collection in product form.

**Implementation Details:**

```typescript
interface ProductMetadata {
  name: string;
  slug: string; // Auto-generated from name
  short_description: string;
  description: string;
  product_type: 'preset' | 'template' | 'sample_pack' | 'course' | 'other';
  tags?: string[]; // Optional for future filtering
}

// Rich text editor for description
const DescriptionEditor = ({ value, onChange }) => {
  return (
    <textarea
      className="w-full min-h-[200px] p-4 rounded-xl bg-white/5"
      placeholder="Detailed product description..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
```

**Product Type Options:**
- Preset: VST/Plugin presets
- Template: Project templates (DAW sessions)
- Sample Pack: Audio samples collection
- Course: Educational content
- Other: Custom digital products

**Testing Checklist:**
- [ ] All metadata fields save correctly
- [ ] Description supports multi-line text
- [ ] Product type dropdown shows all options
- [ ] Short description enforces character limit
- [ ] Metadata displays correctly on public page

---

### Stage 8.8: Add Pricing Configuration

**Task:** Implement price setting with validation.

**Implementation Details:**

```typescript
interface PricingConfig {
  price: number;
  currency: string;
  compare_at_price?: number; // Optional "was $X" pricing
}

const PriceInput = ({ value, onChange, error }) => {
  const [displayValue, setDisplayValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(input);

    if (!isNaN(numValue)) {
      onChange(numValue);
      setDisplayValue(input);
    } else {
      onChange(0);
      setDisplayValue('');
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]">
        $
      </div>
      <input
        type="text"
        className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5"
        placeholder="0.00"
        value={displayValue}
        onChange={handleChange}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};
```

**Price Validation:**
- Minimum price: $1.00
- Maximum price: $999.99
- Support two decimal places
- Currency: USD (hardcoded for launch, multi-currency later)

**Testing Checklist:**
- [ ] Price input accepts decimal values
- [ ] Price validates minimum ($1.00)
- [ ] Price displays with currency symbol
- [ ] Price saves correctly to database
- [ ] Compare-at price (optional) works for sales

---

### Stage 8.9: Add License Type Selection (Personal, Commercial, Unlimited)

**Task:** Implement license type selector with explanations.

**Implementation Details:**

```typescript
type LicenseType = 'personal' | 'commercial' | 'unlimited';

const LICENSE_TYPES = {
  personal: {
    label: 'Personal Use',
    description: 'For personal projects and non-commercial use only',
    icon: User,
    restrictions: [
      'Use in personal music projects',
      'Cannot be used in commercial releases',
      'Cannot be resold or redistributed'
    ]
  },
  commercial: {
    label: 'Commercial Use',
    description: 'For commercial releases and client work',
    icon: Briefcase,
    restrictions: [
      'Use in unlimited commercial releases',
      'Use in client projects',
      'Cannot be resold as-is',
      'Attribution appreciated but not required'
    ]
  },
  unlimited: {
    label: 'Unlimited Rights',
    description: 'Full commercial rights with no restrictions',
    icon: Zap,
    restrictions: [
      'All commercial use rights',
      'Can be used in products for resale',
      'Can be modified and redistributed',
      'No attribution required'
    ]
  }
};

const LicenseSelector = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      {Object.entries(LICENSE_TYPES).map(([key, license]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`w-full p-4 rounded-xl text-left transition ${
            value === key
              ? 'bg-[var(--accent)]/10 border-2 border-[var(--accent)]'
              : 'bg-white/5 border-2 border-transparent hover:border-white/10'
          }`}
        >
          <div className="flex items-start gap-3">
            <license.icon className="w-5 h-5 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-white">{license.label}</div>
              <div className="text-sm text-[var(--text-gray)] mt-1">
                {license.description}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};
```

**Testing Checklist:**
- [ ] All three license types selectable
- [ ] Selected license highlights correctly
- [ ] License description displays clearly
- [ ] Selected license saves to database
- [ ] License displays on public product page

---

### Stage 8.10: Add License Terms Editor

**Task:** Allow custom license terms in addition to standard types.

**Implementation Details:**

```typescript
const LicenseTermsEditor = ({ licenseType, customTerms, onChange }) => {
  const standardTerms = {
    personal: `PERSONAL USE LICENSE

This license grants you the right to use this product in personal, non-commercial music projects.

YOU MAY:
- Use in unlimited personal music projects
- Modify and edit the files for personal use
- Use in portfolio and demo work

YOU MAY NOT:
- Use in any commercial releases or client work
- Resell, redistribute, or share the files
- Claim ownership of the original files
- Use in products intended for resale

This license is non-transferable and non-exclusive.`,

    commercial: `COMMERCIAL USE LICENSE

This license grants you full commercial use rights for music production.

YOU MAY:
- Use in unlimited commercial music releases
- Use in client projects and work-for-hire
- Modify and edit the files
- Use in streaming, downloads, and physical releases
- Monetize content using these files

YOU MAY NOT:
- Resell or redistribute the files as-is
- Share the files with other producers
- Claim ownership of the original files
- Include in commercial sample packs

This license is non-transferable and non-exclusive. Attribution is appreciated but not required.`,

    unlimited: `UNLIMITED RIGHTS LICENSE

This license grants you complete rights to use this product without restrictions.

YOU MAY:
- Use in any commercial or personal projects
- Modify, edit, and transform the files
- Include in products for resale
- Redistribute as part of a larger work
- Monetize in any way
- Transfer rights to clients (with attribution)

MINIMAL RESTRICTIONS:
- Cannot resell the files as-is (standalone)
- Cannot claim you created the original files

This license is non-exclusive. No attribution required but appreciated.`
  };

  const [useCustom, setUseCustom] = useState(!!customTerms);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={useCustom}
          onChange={(e) => {
            setUseCustom(e.target.checked);
            if (!e.target.checked) {
              onChange(''); // Clear custom terms
            }
          }}
        />
        <label className="text-sm text-white">Use custom license terms</label>
      </div>

      {useCustom ? (
        <textarea
          className="w-full min-h-[300px] p-4 rounded-xl bg-white/5 font-mono text-sm"
          placeholder="Enter your custom license terms..."
          value={customTerms}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="p-4 rounded-xl bg-white/5">
          <pre className="text-sm text-[var(--text-gray)] whitespace-pre-wrap font-mono">
            {standardTerms[licenseType]}
          </pre>
        </div>
      )}
    </div>
  );
};
```

**Testing Checklist:**
- [ ] Standard license terms display for each type
- [ ] Custom license terms toggle works
- [ ] Custom terms save correctly
- [ ] License terms display on product page
- [ ] Terms are clearly visible before purchase

---

### Stage 8.11: Generate Product Slug from Name

**Task:** Auto-generate URL-friendly slugs from product names.

**Implementation Details:**

```typescript
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .substring(0, 50); // Limit length
};

const ensureUniqueSlug = async (
  baseSlug: string,
  profileId: string,
  excludeProductId?: string
): Promise<string> => {
  const supabase = createClientComponentClient();
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase
      .from('products')
      .select('id')
      .eq('profile_id', profileId)
      .eq('slug', slug);

    if (excludeProductId) {
      query = query.neq('id', excludeProductId);
    }

    const { data } = await query;

    if (!data || data.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

// Usage in form
const handleNameChange = async (name: string) => {
  setProductName(name);

  // Auto-generate slug
  const baseSlug = generateSlug(name);
  const uniqueSlug = await ensureUniqueSlug(baseSlug, profile.id, product?.id);
  setProductSlug(uniqueSlug);
};
```

**Slug Rules:**
- Lowercase only
- Alphanumeric and hyphens
- No special characters
- Max 50 characters
- Unique per profile (allow same slug across different sellers)

**Testing Checklist:**
- [ ] Slug auto-generates from name
- [ ] Slug updates when name changes
- [ ] Slug handles special characters correctly
- [ ] Duplicate slugs append numbers (-1, -2, etc)
- [ ] Manual slug editing allowed
- [ ] Slug validation prevents invalid characters

---

### Stage 8.12: Implement Product Edit Functionality

**Task:** Allow editing existing products with pre-filled data.

**Files to Update:**
- `/src/components/dashboard/products/ProductEditor.tsx`

**Implementation Details:**

```typescript
const ProductEditor = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    product || {
      name: '',
      slug: '',
      short_description: '',
      description: '',
      product_type: 'preset',
      price: 0,
      license_type: 'personal',
      license_terms: '',
      is_active: true,
      file_url: null,
      preview_url: null,
      cover_image_url: null
    }
  );

  const handleSubmit = async () => {
    const supabase = createClientComponentClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (product?.id) {
      // Update existing product
      const { error } = await supabase
        .from('products')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (error) throw error;
    } else {
      // Create new product
      const { error } = await supabase
        .from('products')
        .insert({
          ...formData,
          profile_id: user.id
        });

      if (error) throw error;
    }

    onSave();
  };

  return (
    <Modal>
      {/* Form fields */}
      <div className="flex gap-3">
        <button onClick={handleSubmit} className="btn-primary">
          {product ? 'Update Product' : 'Create Product'}
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </Modal>
  );
};
```

**Testing Checklist:**
- [ ] Editing pre-fills all form fields
- [ ] File uploads show existing files
- [ ] Updating product preserves unchanged fields
- [ ] Updated_at timestamp updates
- [ ] Product list refreshes after edit
- [ ] Validation works same as create

---

### Stage 8.13: Implement Product Delete with File Cleanup

**Task:** Add delete functionality that removes product and all associated files.

**Implementation Details:**

```typescript
const deleteProduct = async (productId: string) => {
  const supabase = createClientComponentClient();

  // 1. Fetch product to get file URLs
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (fetchError) throw fetchError;

  // 2. Check for existing purchases
  const { data: purchases, error: purchaseError } = await supabase
    .from('product_purchases')
    .select('id')
    .eq('product_id', productId);

  if (purchaseError) throw purchaseError;

  if (purchases && purchases.length > 0) {
    throw new Error(
      'Cannot delete product with existing purchases. Consider deactivating instead.'
    );
  }

  // 3. Delete files from storage
  const filesToDelete = [];

  if (product.file_url) {
    filesToDelete.push({
      bucket: 'products',
      path: product.file_url
    });
  }

  if (product.preview_url) {
    // Extract path from public URL
    const previewPath = product.preview_url.split('/product-previews/')[1];
    filesToDelete.push({
      bucket: 'product-previews',
      path: previewPath
    });
  }

  if (product.cover_image_url) {
    const coverPath = product.cover_image_url.split('/portfolio-images/')[1];
    filesToDelete.push({
      bucket: 'portfolio-images',
      path: coverPath
    });
  }

  // Delete files in parallel
  await Promise.all(
    filesToDelete.map(({ bucket, path }) =>
      supabase.storage.from(bucket).remove([path])
    )
  );

  // 4. Delete product record
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (deleteError) throw deleteError;

  return { success: true };
};

// Confirmation dialog
const DeleteConfirmation = ({ product, onConfirm, onCancel }) => {
  return (
    <Modal>
      <div className="p-6 space-y-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Delete Product?</h3>
          <p className="text-[var(--text-gray)]">
            Are you sure you want to delete "{product.name}"?
            <br />
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600"
          >
            Delete Product
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
```

**Testing Checklist:**
- [ ] Delete confirmation modal appears
- [ ] Cannot delete products with purchases
- [ ] Product file deleted from storage
- [ ] Preview audio deleted from storage
- [ ] Cover image deleted from storage
- [ ] Product removed from database
- [ ] Product list updates after delete

---

### Stage 8.14: Implement Product Activate/Deactivate Toggle

**Task:** Add ability to hide products without deleting them.

**Implementation Details:**

```typescript
const toggleProductStatus = async (productId: string, isActive: boolean) => {
  const supabase = createClientComponentClient();

  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive })
    .eq('id', productId);

  if (error) throw error;

  return { success: true };
};

// In ProductList component
const StatusToggle = ({ product, onToggle }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleProductStatus(product.id, !product.is_active);
      onToggle();
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1 rounded-full text-sm font-medium transition ${
        product.is_active
          ? 'bg-green-500/10 text-green-400'
          : 'bg-gray-500/10 text-gray-400'
      }`}
    >
      {product.is_active ? 'Active' : 'Inactive'}
    </button>
  );
};
```

**Status Behavior:**
- Active: Visible on public profile, can be purchased
- Inactive: Hidden from public, cannot be purchased, still in dashboard

**Testing Checklist:**
- [ ] Toggle switches between active/inactive
- [ ] Inactive products hidden from public page
- [ ] Inactive products still show in dashboard
- [ ] Status indicator displays correctly
- [ ] Cannot purchase inactive products

---

### Stage 8.15: Create Public Product Page Data Fetching

**Task:** Build data fetching logic for public product pages.

**Files to Create:**
- `/src/app/[username]/products/[slug]/page.tsx`

**Implementation Details:**

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { username, slug } = params;
  const supabase = createServerComponentClient({ cookies });

  // Fetch product
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (!profile) return {};

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('slug', slug)
    .single();

  if (!product) return {};

  return {
    title: `${product.name} | ${username} | MixExperts`,
    description: product.short_description || product.description?.substring(0, 150),
    openGraph: {
      images: product.cover_image_url ? [product.cover_image_url] : []
    }
  };
}

export default async function ProductPage({ params }) {
  const { username, slug } = params;
  const supabase = createServerComponentClient({ cookies });

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, subscription_tier')
    .eq('username', username)
    .eq('is_published', true)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Fetch product with seller info
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (productError || !product) {
    notFound();
  }

  // Track product view
  await supabase
    .from('analytics_events')
    .insert({
      profile_id: profile.id,
      event_type: 'product_view',
      metadata: { product_id: product.id }
    });

  return (
    <ProductPageContent
      product={product}
      seller={profile}
    />
  );
}
```

**Testing Checklist:**
- [ ] Product page loads for valid username + slug
- [ ] 404 page shows for invalid products
- [ ] Inactive products show 404
- [ ] Unpublished seller profiles show 404
- [ ] Product view tracked in analytics
- [ ] SEO metadata generates correctly

---

### Stage 8.16: Wire [username]/products/[slug]/page.tsx

**Task:** Build the public-facing product page UI.

**Implementation Details:**

```typescript
'use client';

const ProductPageContent = ({ product, seller }) => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="text-sm text-[var(--text-gray)] mb-6">
          <Link href={`/${seller.username}`}>{seller.display_name}</Link>
          {' / '}
          <Link href={`/${seller.username}/products`}>Products</Link>
          {' / '}
          <span className="text-white">{product.name}</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Media */}
          <div className="space-y-6">
            {/* Cover Image */}
            {product.cover_image_url && (
              <div className="aspect-video rounded-2xl overflow-hidden">
                <img
                  src={product.cover_image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Preview Audio Player - See Stage 8.17 */}
            {product.preview_url && (
              <PreviewAudioPlayer url={product.preview_url} />
            )}
          </div>

          {/* Right: Details & Purchase */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm">
                  {product.product_type.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                {product.name}
              </h1>
              {product.short_description && (
                <p className="text-lg text-[var(--text-gray)]">
                  {product.short_description}
                </p>
              )}
            </div>

            {/* Seller Info */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
              <img
                src={seller.avatar_url || '/default-avatar.png'}
                alt={seller.display_name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="text-sm text-[var(--text-gray)]">Sold by</div>
                <Link
                  href={`/${seller.username}`}
                  className="font-semibold text-white hover:text-[var(--accent)]"
                >
                  {seller.display_name}
                </Link>
              </div>
            </div>

            {/* Price & Purchase */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  ${product.price}
                </span>
                <span className="text-[var(--text-gray)]">USD</span>
              </div>

              <PurchaseButton product={product} seller={seller} />
            </div>

            {/* License Type */}
            <div className="p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[var(--accent)]" />
                <span className="font-semibold text-white">
                  {product.license_type.charAt(0).toUpperCase() + product.license_type.slice(1)} License
                </span>
              </div>
              <p className="text-sm text-[var(--text-gray)]">
                {LICENSE_TYPES[product.license_type].description}
              </p>
            </div>

            {/* Full Description */}
            {product.description && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-white">Description</h2>
                <div className="text-[var(--text-gray)] whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            )}

            {/* License Terms - See Stage 8.18 */}
            <LicenseTermsSection product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};
```

**Testing Checklist:**
- [ ] Product details display correctly
- [ ] Cover image loads and displays
- [ ] Seller info shows with link to profile
- [ ] Price displays formatted
- [ ] License type badge shows
- [ ] Description renders with line breaks
- [ ] Page is mobile responsive

---

### Stage 8.17: Display Preview Audio Player

**Task:** Create audio player component for product previews.

**Implementation Details:**

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

const PreviewAudioPlayer = ({ url }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const vol = parseFloat(e.target.value);
    audio.volume = vol;
    setVolume(vol);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--accent)]/10 to-transparent border border-[var(--accent)]/20">
      <audio ref={audioRef} src={url} preload="metadata" />

      <div className="space-y-4">
        {/* Watermark */}
        <div className="flex items-center gap-2 text-sm text-[var(--accent)]">
          <Volume2 className="w-4 h-4" />
          <span>Preview Audio</span>
        </div>

        {/* Play Button & Timeline */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-[var(--accent)] hover:bg-[var(--accent)]/80 flex items-center justify-center transition"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-black" />
            ) : (
              <Play className="w-5 h-5 text-black ml-0.5" />
            )}
          </button>

          <div className="flex-1 space-y-2">
            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full"
              style={{
                background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />

            {/* Time Display */}
            <div className="flex justify-between text-sm text-[var(--text-gray)]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-[var(--text-gray)]" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewAudioPlayer;
```

**Testing Checklist:**
- [ ] Audio loads and plays correctly
- [ ] Play/pause toggle works
- [ ] Progress bar updates during playback
- [ ] Seeking works by dragging progress bar
- [ ] Volume control adjusts audio level
- [ ] Time displays format correctly (MM:SS)
- [ ] Audio stops when reaching end

---

### Stage 8.18: Display License Terms Clearly

**Task:** Create expandable license terms section on product page.

**Implementation Details:**

```typescript
'use client';

import { useState } from 'react';
import { ChevronDown, FileText } from 'lucide-react';

const LicenseTermsSection = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Use custom terms if provided, otherwise use standard
  const termsToDisplay = product.license_terms || LICENSE_TYPES[product.license_type].standardTerms;

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between bg-white/5 hover:bg-white/10 transition"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[var(--accent)]" />
          <span className="font-semibold text-white">License Terms</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-[var(--text-gray)] transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-6 bg-black/20">
          <pre className="text-sm text-[var(--text-gray)] whitespace-pre-wrap font-mono">
            {termsToDisplay}
          </pre>

          <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-400">
              <strong>Important:</strong> By purchasing this product, you agree to these license terms.
              Please review them carefully before completing your purchase.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseTermsSection;
```

**Visual Design:**
- Collapsed by default to reduce clutter
- Clear "License Terms" label with icon
- Expandable with smooth animation
- Monospace font for legal text readability
- Warning notice about agreement

**Testing Checklist:**
- [ ] License terms section renders
- [ ] Section expands/collapses on click
- [ ] Custom terms display when provided
- [ ] Standard terms display as fallback
- [ ] Terms are readable and well-formatted
- [ ] Warning notice displays

---

### Stage 8.19: Create Product Checkout Endpoint

**Task:** Build API endpoint to initiate product purchases.

**Files to Create:**
- `/src/app/api/products/checkout/route.ts`

**Implementation Details:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request
    const { productId } = await request.json();

    // Fetch product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*, profiles!inner(username, stripe_account_id, subscription_tier)')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check seller has Stripe connected
    if (!product.profiles.stripe_account_id) {
      return NextResponse.json(
        { error: 'Seller has not connected their Stripe account' },
        { status: 400 }
      );
    }

    // Calculate platform fee - See Stage 8.20
    const platformFeePercent = calculatePlatformFee(product.profiles.subscription_tier);
    const price = Math.round(product.price * 100); // Convert to cents
    const platformFee = Math.round(price * (platformFeePercent / 100));
    const sellerPayout = price - platformFee;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.short_description,
              images: product.cover_image_url ? [product.cover_image_url] : []
            },
            unit_amount: price
          },
          quantity: 1
        }
      ],
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: product.profiles.stripe_account_id
        },
        metadata: {
          product_id: product.id,
          seller_id: product.profile_id,
          buyer_id: user.id,
          platform_fee_percent: platformFeePercent
        }
      },
      metadata: {
        product_id: product.id,
        seller_id: product.profile_id,
        buyer_id: user.id,
        type: 'product_purchase'
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${product.profiles.username}/products/${product.slug}`,
      customer_email: user.email
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

**Testing Checklist:**
- [ ] Authenticated users can initiate checkout
- [ ] Unauthenticated users get 401 error
- [ ] Invalid product IDs return 404
- [ ] Inactive products cannot be purchased
- [ ] Sellers without Stripe cannot sell
- [ ] Checkout session creates successfully
- [ ] Redirect URL includes session_id

---

### Stage 8.20: Calculate Platform Fee Based on Seller's Tier

**Task:** Implement tier-based fee calculation logic.

**Implementation Details:**

```typescript
// Fee calculation utility
type SubscriptionTier = 'free' | 'pro' | 'enterprise';

interface FeeCalculation {
  subtotal: number;
  platformFee: number;
  platformFeePercent: number;
  stripeFee: number;
  sellerPayout: number;
}

const PLATFORM_FEE_RATES = {
  free: 10, // 10% for free tier
  pro: 0,   // 0% for pro tier
  enterprise: 0 // 0% for enterprise tier
};

export function calculatePlatformFee(tier: SubscriptionTier): number {
  return PLATFORM_FEE_RATES[tier] || PLATFORM_FEE_RATES.free;
}

export function calculateProductFees(
  price: number,
  sellerTier: SubscriptionTier
): FeeCalculation {
  const subtotal = price;
  const platformFeePercent = calculatePlatformFee(sellerTier);
  const platformFee = subtotal * (platformFeePercent / 100);

  // Stripe fee: 2.9% + $0.30
  const stripeFee = (subtotal * 0.029) + 0.30;

  // Seller receives: subtotal - platform fee - Stripe fee
  const sellerPayout = subtotal - platformFee - stripeFee;

  return {
    subtotal,
    platformFee,
    platformFeePercent,
    stripeFee,
    sellerPayout
  };
}

// Example display component
const FeeBreakdown = ({ price, tier }) => {
  const fees = calculateProductFees(price, tier);

  return (
    <div className="p-4 rounded-xl bg-white/5 space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-[var(--text-gray)]">Subtotal</span>
        <span className="text-white">${fees.subtotal.toFixed(2)}</span>
      </div>

      {fees.platformFee > 0 && (
        <div className="flex justify-between">
          <span className="text-[var(--text-gray)]">
            Platform Fee ({fees.platformFeePercent}%)
          </span>
          <span className="text-red-400">-${fees.platformFee.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between">
        <span className="text-[var(--text-gray)]">Stripe Fee</span>
        <span className="text-red-400">-${fees.stripeFee.toFixed(2)}</span>
      </div>

      <div className="border-t border-white/10 pt-2 mt-2">
        <div className="flex justify-between font-semibold">
          <span className="text-white">You Receive</span>
          <span className="text-green-400">${fees.sellerPayout.toFixed(2)}</span>
        </div>
      </div>

      {tier === 'free' && (
        <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-xs text-blue-400">
            💡 Upgrade to Pro to eliminate the 10% platform fee and keep more of your earnings!
          </p>
        </div>
      )}
    </div>
  );
};
```

**Fee Examples:**

| Price | Tier | Platform Fee | Stripe Fee | Seller Gets |
|-------|------|--------------|------------|-------------|
| $10.00 | Free | $1.00 (10%) | $0.59 | $8.41 |
| $10.00 | Pro | $0.00 (0%) | $0.59 | $9.41 |
| $50.00 | Free | $5.00 (10%) | $1.75 | $43.25 |
| $50.00 | Pro | $0.00 (0%) | $1.75 | $48.25 |

**Testing Checklist:**
- [ ] Free tier calculates 10% fee
- [ ] Pro tier calculates 0% fee
- [ ] Enterprise tier calculates 0% fee
- [ ] Stripe fee calculated correctly
- [ ] Seller payout accurate
- [ ] Fee breakdown displays in dashboard
- [ ] Upsell message shows for free tier

---

### Stage 8.21: Create Checkout Session with Destination Charge

**Task:** Ensure Stripe checkout uses destination charges for direct payouts.

**Implementation Details:**

```typescript
// In checkout endpoint (continued from Stage 8.19)

// Create checkout session with destination charge
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  payment_method_types: ['card'],

  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: product.name,
        description: product.short_description || '',
        images: product.cover_image_url ? [product.cover_image_url] : [],
        metadata: {
          product_id: product.id,
          license_type: product.license_type
        }
      },
      unit_amount: price
    },
    quantity: 1
  }],

  // Key: Destination charge to seller's connected account
  payment_intent_data: {
    // Platform fee (taken by MixExperts)
    application_fee_amount: platformFee,

    // Remaining funds go directly to seller
    transfer_data: {
      destination: product.profiles.stripe_account_id
    },

    // Metadata for tracking
    metadata: {
      product_id: product.id,
      product_name: product.name,
      seller_id: product.profile_id,
      seller_username: product.profiles.username,
      buyer_id: user.id,
      buyer_email: user.email,
      platform_fee_percent: platformFeePercent,
      platform_fee_amount: (platformFee / 100).toFixed(2),
      license_type: product.license_type
    }
  },

  // Session metadata
  metadata: {
    type: 'product_purchase',
    product_id: product.id,
    seller_id: product.profile_id,
    buyer_id: user.id
  },

  // Success/cancel URLs
  success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${product.profiles.username}/products/${product.slug}?checkout=cancelled`,

  // Pre-fill customer email
  customer_email: user.email,

  // Allow promotion codes
  allow_promotion_codes: true
});

return NextResponse.json({
  sessionId: session.id,
  url: session.url
});
```

**Destination Charge Flow:**
1. Buyer pays $50 via Stripe Checkout
2. Stripe collects $50 from buyer's card
3. Platform fee ($5 if free tier) deducted
4. Stripe fee (~$1.75) deducted
5. Remaining ($43.25) transferred to seller's connected account
6. Seller can withdraw to bank within 2 business days

**Testing Checklist:**
- [ ] Checkout session creates with destination
- [ ] Platform fee calculates correctly
- [ ] Transfer destination is seller's account ID
- [ ] Metadata includes all required fields
- [ ] Success URL includes session_id parameter
- [ ] Cancel URL redirects to product page
- [ ] Customer email pre-fills in checkout

---

### Stage 8.22: Handle Checkout Success

**Task:** Create success page and process completed purchases.

**Files to Create:**
- `/src/app/products/purchase/success/page.tsx`

**Implementation Details:**

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function PurchaseSuccessPage({
  searchParams
}: {
  searchParams: { session_id?: string }
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    redirect('/');
  }

  const supabase = createServerComponentClient({ cookies });

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Retrieve checkout session
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    return <PurchaseProcessing />;
  }

  // Fetch purchase record (created by webhook)
  const { data: purchase, error } = await supabase
    .from('product_purchases')
    .select(`
      *,
      products(name, slug, cover_image_url),
      profiles!seller_id(username, display_name)
    `)
    .eq('stripe_checkout_session_id', sessionId)
    .single();

  if (error || !purchase) {
    return <PurchaseNotFound />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Purchase Complete!
          </h1>
          <p className="text-[var(--text-gray)]">
            Your product is ready to download
          </p>
        </div>

        {/* Product Info */}
        <div className="bg-white/5 rounded-2xl p-6 mb-6">
          <div className="flex gap-4 mb-6">
            {purchase.products.cover_image_url && (
              <img
                src={purchase.products.cover_image_url}
                alt={purchase.products.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">
                {purchase.products.name}
              </h2>
              <p className="text-[var(--text-gray)] text-sm">
                by {purchase.profiles.display_name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-[var(--text-gray)] mb-1">Order ID</div>
              <div className="text-white font-mono">{purchase.id.substring(0, 8)}</div>
            </div>
            <div>
              <div className="text-[var(--text-gray)] mb-1">Amount Paid</div>
              <div className="text-white">${purchase.price}</div>
            </div>
          </div>
        </div>

        {/* Download Section - See Stage 8.24 */}
        <DownloadSection purchase={purchase} />

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/dashboard/purchases"
            className="flex-1 px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-center font-semibold"
          >
            View My Purchases
          </Link>
          <Link
            href={`/${purchase.profiles.username}`}
            className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-center font-semibold"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Testing Checklist:**
- [ ] Success page loads after payment
- [ ] Requires valid session_id parameter
- [ ] Verifies user is authenticated
- [ ] Displays product information
- [ ] Shows order confirmation details
- [ ] Download button/link present (Stage 8.24)
- [ ] Links to purchase history work

---

### Stage 8.23: Create product_purchase Record

**Task:** Handle webhook to create purchase record in database.

**Files to Update:**
- `/src/app/api/webhooks/stripe/route.ts`

**Implementation Details:**

```typescript
// Add to existing webhook handler

case 'checkout.session.completed': {
  const session = event.data.object;

  // Check if this is a product purchase
  if (session.metadata?.type === 'product_purchase') {
    await handleProductPurchase(session);
  }
  // ... existing service booking logic
  break;
}

async function handleProductPurchase(session: Stripe.Checkout.Session) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Extract metadata
  const productId = session.metadata.product_id;
  const sellerId = session.metadata.seller_id;
  const buyerId = session.metadata.buyer_id;
  const platformFeePercent = parseFloat(session.metadata.platform_fee_percent || '10');

  // Retrieve payment intent to get fee details
  const paymentIntent = await stripe.paymentIntents.retrieve(
    session.payment_intent as string
  );

  const amountTotal = session.amount_total / 100; // Convert cents to dollars
  const platformFee = (paymentIntent.application_fee_amount || 0) / 100;
  const sellerPayout = amountTotal - platformFee;

  // Create purchase record
  const { data: purchase, error: purchaseError } = await supabase
    .from('product_purchases')
    .insert({
      product_id: productId,
      buyer_id: buyerId,
      buyer_email: session.customer_email,
      seller_id: sellerId,
      price: amountTotal,
      platform_fee: platformFee,
      platform_fee_percent: platformFeePercent,
      seller_payout: sellerPayout,
      currency: 'usd',
      stripe_payment_intent_id: paymentIntent.id,
      stripe_checkout_session_id: session.id,
      payment_status: 'succeeded',
      download_count: 0,
      max_downloads: 5
    })
    .select()
    .single();

  if (purchaseError) {
    console.error('Failed to create purchase record:', purchaseError);
    throw purchaseError;
  }

  // Generate signed download URL (Stage 8.24)
  await generateDownloadURL(purchase.id);

  // Send purchase confirmation email (Stage 8.26)
  await sendPurchaseConfirmationEmail(purchase);

  // Increment product download_count
  await supabase.rpc('increment_product_downloads', {
    product_id: productId
  });

  // Send notification to seller
  await supabase
    .from('messages')
    .insert({
      recipient_id: sellerId,
      subject: 'New Product Sale!',
      body: `You just sold a copy of your product!`,
      is_read: false
    });

  console.log('Product purchase processed:', purchase.id);
}
```

**Database Function for Incrementing:**
```sql
CREATE OR REPLACE FUNCTION increment_product_downloads(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET download_count = download_count + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;
```

**Testing Checklist:**
- [ ] Webhook receives checkout.session.completed
- [ ] Product purchases identified by metadata.type
- [ ] Purchase record creates with correct data
- [ ] Platform fee calculates from payment intent
- [ ] Seller payout calculated correctly
- [ ] Payment status set to 'succeeded'
- [ ] Download limit initialized to 5
- [ ] Seller receives notification

---

### Stage 8.24: Generate Signed Download URL (24hr Expiry)

**Task:** Create secure, expiring download URLs for purchased products.

**Implementation Details:**

```typescript
import { createClient } from '@supabase/supabase-js';

async function generateDownloadURL(purchaseId: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch purchase with product file info
  const { data: purchase, error } = await supabase
    .from('product_purchases')
    .select('*, products(file_url)')
    .eq('id', purchaseId)
    .single();

  if (error || !purchase) {
    throw new Error('Purchase not found');
  }

  // Generate signed URL (expires in 24 hours)
  const { data: signedUrl, error: signError } = await supabase.storage
    .from('products')
    .createSignedUrl(
      purchase.products.file_url,
      86400 // 24 hours in seconds
    );

  if (signError) {
    throw new Error('Failed to generate download URL');
  }

  // Update purchase with download URL and expiry
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await supabase
    .from('product_purchases')
    .update({
      download_url: signedUrl.signedUrl,
      download_expires_at: expiresAt.toISOString()
    })
    .eq('id', purchaseId);

  return signedUrl.signedUrl;
}

// API endpoint to refresh expired download URL
// /src/app/api/products/download/route.ts
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { purchaseId } = await request.json();

  // Verify user owns this purchase
  const { data: purchase, error } = await supabase
    .from('product_purchases')
    .select('*, products(file_url)')
    .eq('id', purchaseId)
    .eq('buyer_id', user.id)
    .single();

  if (error || !purchase) {
    return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
  }

  // Check download limit (Stage 8.25)
  if (purchase.download_count >= purchase.max_downloads) {
    return NextResponse.json(
      { error: 'Download limit reached' },
      { status: 403 }
    );
  }

  // Generate new signed URL
  const { data: signedUrl } = await supabase.storage
    .from('products')
    .createSignedUrl(purchase.products.file_url, 86400);

  // Update download info
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await supabase
    .from('product_purchases')
    .update({
      download_url: signedUrl.signedUrl,
      download_expires_at: expiresAt.toISOString(),
      download_count: purchase.download_count + 1
    })
    .eq('id', purchaseId);

  return NextResponse.json({
    downloadUrl: signedUrl.signedUrl,
    expiresAt: expiresAt.toISOString()
  });
}
```

**Security Considerations:**
- URLs expire after 24 hours
- User must be authenticated
- User must own the purchase
- URLs are single-use (download count increments)
- File stored in private bucket (not publicly accessible)

**Testing Checklist:**
- [ ] Signed URL generates after purchase
- [ ] URL expires after 24 hours
- [ ] Expired URLs can be regenerated
- [ ] Only purchase owner can generate URL
- [ ] URL downloads correct file
- [ ] Download increments counter
- [ ] Expired URL returns 403 error

---

### Stage 8.25: Limit Downloads (5 Max Per Purchase)

**Task:** Enforce download limit to prevent abuse.

**Implementation Details:**

```typescript
// In download endpoint (continued from Stage 8.24)

// Check if download limit reached
if (purchase.download_count >= purchase.max_downloads) {
  return NextResponse.json(
    {
      error: 'Download limit reached',
      message: 'You have reached the maximum number of downloads for this product. Please contact support if you need assistance.',
      downloadCount: purchase.download_count,
      maxDownloads: purchase.max_downloads
    },
    { status: 403 }
  );
}

// Download button component
const DownloadButton = ({ purchase }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadInfo, setDownloadInfo] = useState(null);

  const remainingDownloads = purchase.max_downloads - purchase.download_count;
  const hasExpired = new Date(purchase.download_expires_at) < new Date();

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      // Request fresh download URL
      const response = await fetch('/api/products/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseId: purchase.id })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Download failed');
      }

      // Redirect to download
      window.location.href = data.downloadUrl;
      setDownloadInfo(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Download Status */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--text-gray)]">Downloads remaining</span>
        <span className={`font-semibold ${
          remainingDownloads > 2 ? 'text-green-400' :
          remainingDownloads > 0 ? 'text-yellow-400' :
          'text-red-400'
        }`}>
          {remainingDownloads} / {purchase.max_downloads}
        </span>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={loading || remainingDownloads === 0}
        className={`w-full px-6 py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
          remainingDownloads === 0
            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
            : 'bg-[var(--accent)] hover:bg-[var(--accent)]/80 text-black'
        }`}
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Preparing Download...
          </>
        ) : remainingDownloads === 0 ? (
          <>
            <XCircle className="w-5 h-5" />
            Download Limit Reached
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Download Product
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Warnings */}
      {remainingDownloads === 1 && (
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-400">
            ⚠️ This is your last download. Make sure to save the file securely.
          </p>
        </div>
      )}

      {remainingDownloads === 0 && (
        <div className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20">
          <p className="text-sm text-gray-400">
            You've used all your downloads. Contact support if you need assistance.
          </p>
        </div>
      )}

      {/* Expiry Info */}
      {downloadInfo && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-blue-400">
            Download link expires: {new Date(downloadInfo.expiresAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};
```

**Download Limit Policy:**
- Default: 5 downloads per purchase
- Downloads count when URL is generated (not clicked)
- Limit prevents bulk sharing/resale
- Support can manually reset if needed
- Consider allowing sellers to set custom limits (future)

**Testing Checklist:**
- [ ] Download counter increments correctly
- [ ] Cannot download after limit reached
- [ ] Remaining downloads display accurately
- [ ] Warning shows on last download
- [ ] Error message clear when limit hit
- [ ] Limit enforcement works across sessions

---

### Stage 8.26: Send Purchase Confirmation Email

**Task:** Send transactional email after successful purchase.

**Files to Create:**
- `/src/lib/email/product-purchase.ts`

**Implementation Details:**

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface PurchaseEmailData {
  buyerEmail: string;
  buyerName: string;
  productName: string;
  productCoverUrl?: string;
  sellerName: string;
  sellerUsername: string;
  price: number;
  purchaseId: string;
  downloadUrl: string;
  downloadExpiresAt: string;
  licenseType: string;
}

export async function sendPurchaseConfirmationEmail(data: PurchaseEmailData) {
  try {
    await resend.emails.send({
      from: 'MixExperts <orders@mixexperts.com>',
      to: data.buyerEmail,
      subject: `Your purchase: ${data.productName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                padding: 30px 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                margin-bottom: 30px;
              }
              .header h1 {
                color: white;
                margin: 0;
              }
              .product {
                background: #f7f7f7;
                padding: 20px;
                border-radius: 12px;
                margin: 20px 0;
              }
              .product img {
                width: 100%;
                max-width: 400px;
                border-radius: 8px;
                margin-bottom: 15px;
              }
              .download-button {
                display: inline-block;
                padding: 16px 32px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
              }
              .info-box {
                background: #e8f5e9;
                border-left: 4px solid #4caf50;
                padding: 15px;
                margin: 20px 0;
              }
              .warning-box {
                background: #fff3e0;
                border-left: 4px solid #ff9800;
                padding: 15px;
                margin: 20px 0;
              }
              .details {
                background: white;
                border: 1px solid #e0e0e0;
                padding: 20px;
                border-radius: 8px;
              }
              .details table {
                width: 100%;
                border-collapse: collapse;
              }
              .details td {
                padding: 10px;
                border-bottom: 1px solid #f0f0f0;
              }
              .details td:first-child {
                color: #666;
                width: 40%;
              }
              .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                color: #666;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>✅ Purchase Complete!</h1>
            </div>

            <p>Hi ${data.buyerName || 'there'},</p>

            <p>Thank you for your purchase! Your product is ready to download.</p>

            <div class="product">
              ${data.productCoverUrl ? `<img src="${data.productCoverUrl}" alt="${data.productName}">` : ''}
              <h2 style="margin: 0 0 10px 0;">${data.productName}</h2>
              <p style="color: #666; margin: 0;">by ${data.sellerName}</p>
            </div>

            <div style="text-align: center;">
              <a href="${data.downloadUrl}" class="download-button">
                📥 Download Now
              </a>
            </div>

            <div class="warning-box">
              <strong>⏰ Download link expires:</strong> ${new Date(data.downloadExpiresAt).toLocaleString()}
              <br>
              <strong>Downloads remaining:</strong> 5
            </div>

            <div class="details">
              <h3 style="margin-top: 0;">Order Details</h3>
              <table>
                <tr>
                  <td>Order ID</td>
                  <td><code>${data.purchaseId.substring(0, 8)}</code></td>
                </tr>
                <tr>
                  <td>Product</td>
                  <td>${data.productName}</td>
                </tr>
                <tr>
                  <td>License Type</td>
                  <td>${data.licenseType.charAt(0).toUpperCase() + data.licenseType.slice(1)}</td>
                </tr>
                <tr>
                  <td>Amount Paid</td>
                  <td><strong>$${data.price.toFixed(2)} USD</strong></td>
                </tr>
              </table>
            </div>

            <div class="info-box">
              <strong>💡 Helpful Tips:</strong>
              <ul style="margin: 10px 0;">
                <li>You can re-download up to 5 times from your <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/purchases">Purchase History</a></li>
                <li>Each download link expires after 24 hours for security</li>
                <li>Make sure to save the file to a secure location</li>
                <li>Review the license terms before using in your projects</li>
              </ul>
            </div>

            <p>Need help? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/support">Support Center</a>.</p>

            <div class="footer">
              <p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/purchases">View Purchase History</a>
                •
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/${data.sellerUsername}">Visit ${data.sellerName}'s Shop</a>
              </p>
              <p>MixExperts - Professional Audio Engineering Marketplace</p>
            </div>
          </body>
        </html>
      `
    });

    console.log('Purchase confirmation email sent to:', data.buyerEmail);
  } catch (error) {
    console.error('Failed to send purchase email:', error);
    // Don't throw - email failure shouldn't break purchase flow
  }
}

// Also send email to seller
export async function sendSellerSaleNotification(data: {
  sellerEmail: string;
  sellerName: string;
  productName: string;
  price: number;
  platformFee: number;
  payout: number;
  buyerName: string;
}) {
  try {
    await resend.emails.send({
      from: 'MixExperts <sales@mixexperts.com>',
      to: data.sellerEmail,
      subject: `🎉 You made a sale: ${data.productName}`,
      html: `
        <!-- Similar structure but focused on seller info -->
        <h1>You Made a Sale!</h1>
        <p>Great news! Someone just purchased your product.</p>
        <h2>${data.productName}</h2>
        <table>
          <tr>
            <td>Sale Amount</td>
            <td>$${data.price.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Platform Fee (${data.platformFee > 0 ? '10%' : '0%'})</td>
            <td>-$${data.platformFee.toFixed(2)}</td>
          </tr>
          <tr>
            <td><strong>Your Payout</strong></td>
            <td><strong>$${data.payout.toFixed(2)}</strong></td>
          </tr>
        </table>
        <p>Funds will be available in your Stripe account within 2 business days.</p>
      `
    });
  } catch (error) {
    console.error('Failed to send seller notification:', error);
  }
}
```

**Testing Checklist:**
- [ ] Email sends after successful purchase
- [ ] Email contains download link
- [ ] Product details display correctly
- [ ] Order summary accurate
- [ ] Links in email work correctly
- [ ] Email renders well in common clients
- [ ] Seller notification email sends

---

### Stage 8.27: Create Buyer Purchase History Page

**Task:** Build page showing all purchased products with download access.

**Files to Create:**
- `/src/app/dashboard/purchases/page.tsx`

**Implementation Details:**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ShoppingBag, Download, Calendar, ExternalLink } from 'lucide-react';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('product_purchases')
      .select(`
        *,
        products(id, name, slug, cover_image_url, product_type),
        profiles!seller_id(username, display_name, avatar_url)
      `)
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setPurchases(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return <PurchasesLoadingSkeleton />;
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          My Purchases
        </h1>
        <p className="text-[var(--text-gray)]">
          Access and download your purchased products
        </p>
      </div>

      {/* Purchases List */}
      {purchases.length === 0 ? (
        <EmptyPurchases />
      ) : (
        <div className="grid gap-4">
          {purchases.map((purchase) => (
            <PurchaseCard key={purchase.id} purchase={purchase} />
          ))}
        </div>
      )}
    </div>
  );
}

const PurchaseCard = ({ purchase }) => {
  const remainingDownloads = purchase.max_downloads - purchase.download_count;

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition">
      <div className="flex gap-6">
        {/* Product Image */}
        {purchase.products.cover_image_url && (
          <img
            src={purchase.products.cover_image_url}
            alt={purchase.products.name}
            className="w-32 h-32 rounded-xl object-cover"
          />
        )}

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs">
                  {purchase.products.product_type.replace('_', ' ')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {purchase.products.name}
              </h3>
              <p className="text-sm text-[var(--text-gray)]">
                by {purchase.profiles.display_name}
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                ${purchase.price}
              </div>
            </div>
          </div>

          {/* Purchase Details */}
          <div className="grid grid-cols-3 gap-4 text-sm mb-4">
            <div>
              <div className="text-[var(--text-gray)] mb-1">Purchased</div>
              <div className="text-white flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(purchase.created_at).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-[var(--text-gray)] mb-1">Order ID</div>
              <div className="text-white font-mono">
                {purchase.id.substring(0, 8)}
              </div>
            </div>
            <div>
              <div className="text-[var(--text-gray)] mb-1">Downloads</div>
              <div className={`font-semibold ${
                remainingDownloads > 2 ? 'text-green-400' :
                remainingDownloads > 0 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {remainingDownloads} / {purchase.max_downloads} remaining
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <DownloadButton purchase={purchase} onDownload={() => fetchPurchases()} />

            <Link
              href={`/${purchase.profiles.username}/products/${purchase.products.slug}`}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyPurchases = () => (
  <div className="text-center py-20">
    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
      <ShoppingBag className="w-10 h-10 text-[var(--text-gray)]" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">No purchases yet</h3>
    <p className="text-[var(--text-gray)] mb-6">
      Browse the marketplace to find presets, samples, and templates
    </p>
    <Link
      href="/explore"
      className="inline-block px-6 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent)]/80 font-semibold"
    >
      Explore Products
    </Link>
  </div>
);
```

**Testing Checklist:**
- [ ] Purchases page loads for authenticated users
- [ ] All purchases display with product info
- [ ] Download buttons work for each purchase
- [ ] Remaining downloads show accurately
- [ ] Product links navigate correctly
- [ ] Empty state shows when no purchases
- [ ] Mobile responsive layout

---

### Stage 8.28: Create Seller Sales Dashboard

**Task:** Build dashboard for sellers to track product sales and revenue.

**Files to Create:**
- `/src/app/dashboard/sales/page.tsx`

**Implementation Details:**

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { DollarSign, TrendingUp, Download, Package } from 'lucide-react';

export default function SalesDashboard() {
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // all, 30d, 7d
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchSalesData();
  }, [timeRange]);

  const fetchSalesData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Build date filter
    let dateFilter = null;
    if (timeRange === '30d') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 30);
    } else if (timeRange === '7d') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 7);
    }

    // Fetch sales
    let query = supabase
      .from('product_purchases')
      .select(`
        *,
        products(name, product_type, cover_image_url),
        profiles!buyer_id(username, display_name, avatar_url)
      `)
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (dateFilter) {
      query = query.gte('created_at', dateFilter.toISOString());
    }

    const { data: salesData, error } = await query;

    if (!error && salesData) {
      setSales(salesData);
      calculateStats(salesData);
    }

    setLoading(false);
  };

  const calculateStats = (salesData) => {
    const totalSales = salesData.length;
    const totalRevenue = salesData.reduce((sum, sale) => sum + sale.price, 0);
    const totalPayout = salesData.reduce((sum, sale) => sum + sale.seller_payout, 0);
    const totalPlatformFees = salesData.reduce((sum, sale) => sum + sale.platform_fee, 0);

    // Product breakdown
    const productSales = {};
    salesData.forEach(sale => {
      const productId = sale.product_id;
      if (!productSales[productId]) {
        productSales[productId] = {
          name: sale.products.name,
          count: 0,
          revenue: 0
        };
      }
      productSales[productId].count++;
      productSales[productId].revenue += sale.price;
    });

    setStats({
      totalSales,
      totalRevenue,
      totalPayout,
      totalPlatformFees,
      averageSaleValue: totalSales > 0 ? totalRevenue / totalSales : 0,
      productSales: Object.values(productSales).sort((a, b) => b.revenue - a.revenue)
    });
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
              <DollarSign className="w-6 h-6" />
            </div>
            Product Sales
          </h1>
          <p className="text-[var(--text-gray)]">
            Track your product sales and revenue
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="flex gap-2">
          {['all', '30d', '7d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl transition ${
                timeRange === range
                  ? 'bg-[var(--accent)] text-black'
                  : 'bg-white/5 hover:bg-white/10 text-white'
              }`}
            >
              {range === 'all' ? 'All Time' : range === '30d' ? 'Last 30 Days' : 'Last 7 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Package}
            label="Total Sales"
            value={stats.totalSales}
            color="blue"
          />
          <StatCard
            icon={DollarSign}
            label="Gross Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            label="Your Payout"
            value={`$${stats.totalPayout.toFixed(2)}`}
            color="purple"
          />
          <StatCard
            icon={DollarSign}
            label="Avg Sale Value"
            value={`$${stats.averageSaleValue.toFixed(2)}`}
            color="amber"
          />
        </div>
      )}

      {/* Product Performance */}
      {stats && stats.productSales.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">
            Product Performance
          </h2>
          <div className="space-y-3">
            {stats.productSales.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5"
              >
                <div className="flex-1">
                  <div className="font-semibold text-white">{product.name}</div>
                  <div className="text-sm text-[var(--text-gray)]">
                    {product.count} {product.count === 1 ? 'sale' : 'sales'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    ${product.revenue.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sales */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">Recent Sales</h2>
        {sales.length === 0 ? (
          <EmptySales />
        ) : (
          <div className="space-y-3">
            {sales.map((sale) => (
              <SaleRow key={sale.id} sale={sale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/10 text-green-400',
    purple: 'bg-purple-500/10 text-purple-400',
    amber: 'bg-amber-500/10 text-amber-400'
  };

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-sm text-[var(--text-gray)] mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
};

const SaleRow = ({ sale }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition">
    <div className="flex items-center gap-4">
      {sale.products.cover_image_url && (
        <img
          src={sale.products.cover_image_url}
          alt={sale.products.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
      )}
      <div>
        <div className="font-semibold text-white">{sale.products.name}</div>
        <div className="text-sm text-[var(--text-gray)]">
          Sold to {sale.profiles.display_name}
        </div>
      </div>
    </div>

    <div className="text-right">
      <div className="font-bold text-white">${sale.price.toFixed(2)}</div>
      <div className="text-sm text-green-400">+${sale.seller_payout.toFixed(2)} payout</div>
      <div className="text-xs text-[var(--text-gray)]">
        {new Date(sale.created_at).toLocaleDateString()}
      </div>
    </div>
  </div>
);
```

**Testing Checklist:**
- [ ] Sales dashboard loads for sellers
- [ ] Stats calculate correctly
- [ ] Time range filters work
- [ ] Product performance shows top sellers
- [ ] Recent sales list displays
- [ ] Revenue numbers accurate
- [ ] Platform fee deductions shown
- [ ] Empty state for no sales

---

### Stage 8.29: Track Product Views and Conversions

**Task:** Implement analytics tracking for product performance metrics.

**Implementation Details:**

```typescript
// Add to product page (Stage 8.16)
useEffect(() => {
  trackProductView();
}, []);

const trackProductView = async () => {
  const supabase = createClientComponentClient();

  await supabase
    .from('analytics_events')
    .insert({
      profile_id: seller.id,
      event_type: 'product_view',
      metadata: {
        product_id: product.id,
        product_name: product.name,
        product_type: product.product_type,
        price: product.price,
        referrer: document.referrer,
        user_agent: navigator.userAgent
      }
    });
};

// Track conversion (in checkout endpoint)
await supabase
  .from('analytics_events')
  .insert({
    profile_id: product.profile_id,
    event_type: 'product_purchase',
    metadata: {
      product_id: product.id,
      price: product.price,
      buyer_id: user.id
    }
  });

// Analytics query for product dashboard
const fetchProductAnalytics = async (productId: string) => {
  const supabase = createClientComponentClient();

  // Views
  const { count: views } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'product_view')
    .eq('metadata->>product_id', productId);

  // Purchases
  const { count: purchases } = await supabase
    .from('product_purchases')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', productId);

  // Conversion rate
  const conversionRate = views > 0 ? (purchases / views) * 100 : 0;

  return {
    views,
    purchases,
    conversionRate: conversionRate.toFixed(2)
  };
};

// Display in product editor/stats
const ProductAnalytics = ({ productId }) => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchProductAnalytics(productId).then(setAnalytics);
  }, [productId]);

  if (!analytics) return null;

  return (
    <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-white/5">
      <div>
        <div className="text-sm text-[var(--text-gray)]">Views</div>
        <div className="text-2xl font-bold text-white">{analytics.views}</div>
      </div>
      <div>
        <div className="text-sm text-[var(--text-gray)]">Sales</div>
        <div className="text-2xl font-bold text-white">{analytics.purchases}</div>
      </div>
      <div>
        <div className="text-sm text-[var(--text-gray)]">Conversion</div>
        <div className="text-2xl font-bold text-green-400">
          {analytics.conversionRate}%
        </div>
      </div>
    </div>
  );
};
```

**Tracked Metrics:**
- Product views (unique and total)
- Add to cart events (future)
- Purchase conversions
- Conversion rate (purchases / views)
- Revenue per view
- Top traffic sources

**Testing Checklist:**
- [ ] Product views tracked on page load
- [ ] Purchases tracked in checkout
- [ ] Analytics query returns accurate counts
- [ ] Conversion rate calculates correctly
- [ ] Stats display in dashboard
- [ ] Anonymous views tracked (no auth required)

---

### Stage 8.30: Test Complete Product Purchase Flow

**Task:** End-to-end testing of entire marketplace flow.

**Test Scenarios:**

**1. Product Creation Flow**
- [ ] Seller creates new product with all fields
- [ ] Product file uploads to private bucket
- [ ] Preview audio uploads to public bucket
- [ ] Cover image uploads successfully
- [ ] Slug generates from name
- [ ] Duplicate slug appends number
- [ ] License terms save correctly
- [ ] Product appears in seller dashboard
- [ ] Product appears on public profile

**2. Product Discovery & Viewing**
- [ ] Product page loads at /{username}/products/{slug}
- [ ] Cover image displays
- [ ] Preview audio plays
- [ ] License terms expandable
- [ ] Seller info links to profile
- [ ] Product view tracked in analytics
- [ ] Inactive products show 404

**3. Purchase Flow**
- [ ] Authenticated user can click "Purchase"
- [ ] Checkout session creates
- [ ] Stripe Checkout page loads
- [ ] Test payment processes
- [ ] Platform fee calculates based on seller tier
- [ ] Destination charge goes to seller account

**4. Post-Purchase**
- [ ] Webhook creates product_purchase record
- [ ] Download URL generates
- [ ] Buyer receives confirmation email
- [ ] Seller receives sale notification
- [ ] Success page displays
- [ ] Download button works
- [ ] Download counter increments

**5. Download Management**
- [ ] Signed URL expires after 24 hours
- [ ] Expired URL can be regenerated
- [ ] Download count enforces 5 max limit
- [ ] Limit reached shows error
- [ ] File downloads correctly
- [ ] Purchase appears in buyer history

**6. Seller Dashboard**
- [ ] Product appears in sales dashboard
- [ ] Revenue calculates correctly
- [ ] Platform fee deducted
- [ ] Stats update in real-time
- [ ] Product analytics show views/conversions

**7. Edge Cases**
- [ ] Cannot purchase own product
- [ ] Cannot download without purchase
- [ ] Cannot bypass download limit
- [ ] Inactive products unpurchasable
- [ ] Deleted products handle gracefully
- [ ] Refunds update records correctly

**8. Mobile Testing**
- [ ] Product creation form works on mobile
- [ ] File uploads work on mobile
- [ ] Product page responsive
- [ ] Checkout flow mobile-friendly
- [ ] Audio player works on iOS/Android

**9. Performance**
- [ ] Large file uploads (500MB) work
- [ ] Download URLs generate quickly
- [ ] Product listings load fast
- [ ] Images optimized and lazy-loaded

**10. Security**
- [ ] Private files not publicly accessible
- [ ] Signed URLs required for downloads
- [ ] RLS policies prevent unauthorized access
- [ ] Users can only edit their own products
- [ ] Users can only download their purchases

---

## Phase Completion Checklist

### Database
- [ ] Products table created with all fields
- [ ] Product_purchases table created
- [ ] RLS policies configured
- [ ] Storage buckets created (products, product-previews)
- [ ] Storage policies configured

### Backend/API
- [ ] useProducts hook functional
- [ ] Product CRUD operations work
- [ ] File upload endpoints work
- [ ] Checkout endpoint creates sessions
- [ ] Platform fee calculation accurate
- [ ] Webhook handles product purchases
- [ ] Download URL generation works
- [ ] Download limit enforcement works

### Frontend/UI
- [ ] Dashboard products page wired
- [ ] Product editor form complete
- [ ] File upload components work
- [ ] Public product pages load
- [ ] Preview audio player functional
- [ ] License terms display
- [ ] Purchase flow complete
- [ ] Success page works
- [ ] Buyer purchase history page
- [ ] Seller sales dashboard

### Email/Notifications
- [ ] Purchase confirmation emails send
- [ ] Seller sale notifications send
- [ ] Email templates styled
- [ ] Email links work correctly

### Analytics
- [ ] Product views tracked
- [ ] Purchases tracked
- [ ] Conversion rates calculate
- [ ] Stats display in dashboard

### Testing
- [ ] All 10 test scenarios pass
- [ ] Mobile testing complete
- [ ] Cross-browser testing done
- [ ] Performance acceptable
- [ ] Security audit passed

---

## Success Metrics

After completing Phase 08, you should have:

1. **Fully Functional Marketplace**
   - Engineers can create and manage products
   - Buyers can discover and purchase products
   - Secure file delivery with download limits
   - Automated payments with tier-based fees

2. **Revenue Generation**
   - Free tier sellers: 10% platform fee
   - Pro/Enterprise: 0% platform fee
   - Direct payouts to seller Stripe accounts

3. **User Experience**
   - Simple product creation workflow
   - Clear license information
   - Reliable download delivery
   - Comprehensive purchase history

4. **Analytics & Insights**
   - Product performance tracking
   - Sales revenue reporting
   - Conversion rate metrics
   - Top-selling products identified

---

## Next Steps

After Phase 08 completion:

1. **Phase 09: Messaging & Inbox** - Communication between buyers and sellers
2. **Phase 10: Analytics & Dashboard** - Advanced analytics and reporting
3. **Phase 11: Polish, Testing & Launch** - Final preparations for production

---

**Document Version:** 1.0
**Last Updated:** December 28, 2025
**Status:** Ready for Implementation
