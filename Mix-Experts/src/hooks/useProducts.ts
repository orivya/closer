'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface Product {
  id: string;
  profile_id: string;
  name: string;
  slug: string;
  description: string | null;
  category: 'preset' | 'sample_pack' | 'template' | 'course' | 'ebook' | 'other';
  price: number;
  currency: string;
  cover_image_url: string | null;
  preview_url: string | null;
  file_url: string | null;
  file_size_mb: number | null;
  license_type: 'personal' | 'commercial' | 'exclusive';
  license_terms: string | null;
  tags: string[];
  metadata: Record<string, any>;
  download_count: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface ProductFilters {
  profile_id?: string;
  category?: string;
  is_active?: boolean;
  search?: string;
}

export function useProducts(filters?: ProductFilters) {
  const { profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.profile_id) {
        query = query.eq('profile_id', filters.profile_id);
      } else if (profile) {
        // Default to current user's products if no profile_id specified
        query = query.eq('profile_id', profile.id);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters, profile]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (productData: Partial<Product>) => {
    try {
      if (!profile) {
        throw new Error('Not authenticated');
      }

      // Generate slug from name
      const slug = productData.name
        ? productData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : '';

      const { data, error: createError } = await supabase
        .from('products')
        .insert({
          ...productData,
          profile_id: profile.id,
          slug,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      await fetchProducts();
      return { data, error: null };
    } catch (err) {
      console.error('Error creating product:', err);
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to create product'
      };
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      // If name is being updated, regenerate slug
      if (updates.name) {
        updates.slug = updates.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      const { data, error: updateError } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      await fetchProducts();
      return { data, error: null };
    } catch (err) {
      console.error('Error updating product:', err);
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to update product'
      };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      // First check if there are any purchases
      const { data: purchases, error: purchaseError } = await supabase
        .from('product_purchases')
        .select('id')
        .eq('product_id', id)
        .limit(1);

      if (purchaseError) {
        throw purchaseError;
      }

      if (purchases && purchases.length > 0) {
        throw new Error('Cannot delete product with existing purchases. Consider deactivating instead.');
      }

      // Get product to find file URLs for cleanup
      const { data: product, error: getError } = await supabase
        .from('products')
        .select('file_url, preview_url, cover_image_url')
        .eq('id', id)
        .single();

      if (getError) {
        throw getError;
      }

      // Delete files from storage
      if (product.file_url) {
        const filePath = product.file_url.split('/').pop();
        if (filePath) {
          await supabase.storage.from('products').remove([filePath]);
        }
      }

      if (product.preview_url) {
        const filePath = product.preview_url.split('/').pop();
        if (filePath) {
          await supabase.storage.from('product-previews').remove([filePath]);
        }
      }

      if (product.cover_image_url) {
        const filePath = product.cover_image_url.split('/').pop();
        if (filePath) {
          await supabase.storage.from('portfolio-images').remove([filePath]);
        }
      }

      // Delete product record
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchProducts();
      return { error: null };
    } catch (err) {
      console.error('Error deleting product:', err);
      return {
        error: err instanceof Error ? err.message : 'Failed to delete product'
      };
    }
  };

  const toggleProductActive = async (id: string, is_active: boolean) => {
    return updateProduct(id, { is_active });
  };

  return {
    products,
    loading,
    error,
    refresh: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
  };
}
