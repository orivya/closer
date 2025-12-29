'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface PortfolioItem {
  id: string;
  profile_id: string;
  title: string;
  artist: string;
  genre: string | null;
  before_audio_url: string;
  after_audio_url: string;
  cover_image_url: string | null;
  description: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface UsePortfolioItemsReturn {
  portfolioItems: PortfolioItem[];
  loading: boolean;
  error: Error | null;
  addPortfolioItem: (item: Partial<PortfolioItem>) => Promise<boolean>;
  updatePortfolioItem: (id: string, updates: Partial<PortfolioItem>) => Promise<boolean>;
  deletePortfolioItem: (id: string) => Promise<boolean>;
  reorderPortfolioItems: (items: PortfolioItem[]) => Promise<boolean>;
  toggleFeatured: (id: string, isFeatured: boolean) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function usePortfolioItems(): UsePortfolioItemsReturn {
  const { user } = useAuth();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPortfolioItems = useCallback(async () => {
    if (!user) {
      setPortfolioItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('profile_id', user.id)
        .order('display_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setPortfolioItems(data || []);
    } catch (err) {
      console.error('Error fetching portfolio items:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch portfolio items'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPortfolioItems();
  }, [fetchPortfolioItems]);

  const addPortfolioItem = async (item: Partial<PortfolioItem>): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }

    try {
      const maxOrder = Math.max(...portfolioItems.map(i => i.display_order), -1);

      const { error: insertError } = await supabase
        .from('portfolio_items')
        .insert({
          profile_id: user.id,
          ...item,
          display_order: maxOrder + 1,
        });

      if (insertError) {
        throw insertError;
      }

      await fetchPortfolioItems();
      toast.success('Portfolio item added');
      return true;
    } catch (err) {
      console.error('Error adding portfolio item:', err);
      toast.error('Failed to add portfolio item');
      return false;
    }
  };

  const updatePortfolioItem = async (
    id: string,
    updates: Partial<PortfolioItem>
  ): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('portfolio_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      await fetchPortfolioItems();
      toast.success('Portfolio item updated');
      return true;
    } catch (err) {
      console.error('Error updating portfolio item:', err);
      toast.error('Failed to update portfolio item');
      return false;
    }
  };

  const deletePortfolioItem = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchPortfolioItems();
      toast.success('Portfolio item deleted');
      return true;
    } catch (err) {
      console.error('Error deleting portfolio item:', err);
      toast.error('Failed to delete portfolio item');
      return false;
    }
  };

  const reorderPortfolioItems = async (items: PortfolioItem[]): Promise<boolean> => {
    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        display_order: index,
      }));

      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('portfolio_items')
          .update({ display_order: update.display_order })
          .eq('id', update.id);

        if (updateError) {
          throw updateError;
        }
      }

      await fetchPortfolioItems();
      toast.success('Portfolio reordered');
      return true;
    } catch (err) {
      console.error('Error reordering portfolio items:', err);
      toast.error('Failed to reorder items');
      return false;
    }
  };

  const toggleFeatured = async (id: string, isFeatured: boolean): Promise<boolean> => {
    return updatePortfolioItem(id, { is_featured: isFeatured });
  };

  return {
    portfolioItems,
    loading,
    error,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    reorderPortfolioItems,
    toggleFeatured,
    refetch: fetchPortfolioItems,
  };
}
