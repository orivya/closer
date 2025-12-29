'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SocialLink {
  id: string;
  profile_id: string;
  platform: string;
  url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface UseSocialLinksReturn {
  socialLinks: SocialLink[];
  loading: boolean;
  error: Error | null;
  addSocialLink: (platform: string, url: string) => Promise<boolean>;
  updateSocialLink: (id: string, url: string) => Promise<boolean>;
  deleteSocialLink: (id: string) => Promise<boolean>;
  reorderSocialLinks: (links: SocialLink[]) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useSocialLinks(): UseSocialLinksReturn {
  const { user } = useAuth();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSocialLinks = useCallback(async () => {
    if (!user) {
      setSocialLinks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('social_links')
        .select('*')
        .eq('profile_id', user.id)
        .order('display_order', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setSocialLinks(data || []);
    } catch (err) {
      console.error('Error fetching social links:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch social links'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSocialLinks();
  }, [fetchSocialLinks]);

  const addSocialLink = async (platform: string, url: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }

    try {
      const maxOrder = Math.max(...socialLinks.map(l => l.display_order), -1);

      const { error: insertError } = await supabase
        .from('social_links')
        .insert({
          profile_id: user.id,
          platform,
          url,
          display_order: maxOrder + 1,
        });

      if (insertError) {
        throw insertError;
      }

      await fetchSocialLinks();
      toast.success('Social link added');
      return true;
    } catch (err) {
      console.error('Error adding social link:', err);
      toast.error('Failed to add social link');
      return false;
    }
  };

  const updateSocialLink = async (id: string, url: string): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('social_links')
        .update({ url, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      await fetchSocialLinks();
      toast.success('Social link updated');
      return true;
    } catch (err) {
      console.error('Error updating social link:', err);
      toast.error('Failed to update social link');
      return false;
    }
  };

  const deleteSocialLink = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchSocialLinks();
      toast.success('Social link removed');
      return true;
    } catch (err) {
      console.error('Error deleting social link:', err);
      toast.error('Failed to remove social link');
      return false;
    }
  };

  const reorderSocialLinks = async (links: SocialLink[]): Promise<boolean> => {
    try {
      const updates = links.map((link, index) => ({
        id: link.id,
        display_order: index,
      }));

      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('social_links')
          .update({ display_order: update.display_order })
          .eq('id', update.id);

        if (updateError) {
          throw updateError;
        }
      }

      await fetchSocialLinks();
      return true;
    } catch (err) {
      console.error('Error reordering social links:', err);
      toast.error('Failed to reorder social links');
      return false;
    }
  };

  return {
    socialLinks,
    loading,
    error,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    reorderSocialLinks,
    refetch: fetchSocialLinks,
  };
}
