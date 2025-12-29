'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface PublicProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  tagline: string | null;
  location: string | null;
  timezone: string;
  theme: string | null;
  is_published: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface PublicSocialLink {
  id: string;
  platform: string;
  url: string;
  display_order: number;
}

export interface PublicPortfolioItem {
  id: string;
  title: string;
  artist: string;
  genre: string | null;
  before_audio_url: string;
  after_audio_url: string;
  cover_image_url: string | null;
  description: string | null;
  is_featured: boolean;
  display_order: number;
}

interface UsePublicProfileReturn {
  profile: PublicProfile | null;
  socialLinks: PublicSocialLink[];
  portfolioItems: PublicPortfolioItem[];
  loading: boolean;
  error: Error | null;
  notFound: boolean;
}

export function usePublicProfile(username: string): UsePublicProfileReturn {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [socialLinks, setSocialLinks] = useState<PublicSocialLink[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PublicPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchPublicProfile() {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(
            'id, username, display_name, avatar_url, banner_url, bio, tagline, location, timezone, theme, is_published, is_verified, created_at'
          )
          .eq('username', username)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // Not found
            setNotFound(true);
            return;
          }
          throw profileError;
        }

        setProfile(profileData);

        // Fetch social links
        const { data: linksData, error: linksError } = await supabase
          .from('social_links')
          .select('id, platform, url, display_order')
          .eq('profile_id', profileData.id)
          .order('display_order', { ascending: true });

        if (linksError && linksError.code !== 'PGRST116') {
          console.error('Error fetching social links:', linksError);
        } else {
          setSocialLinks(linksData || []);
        }

        // Fetch portfolio items
        const { data: portfolioData, error: portfolioError } = await supabase
          .from('portfolio_items')
          .select(
            'id, title, artist, genre, before_audio_url, after_audio_url, cover_image_url, description, is_featured, display_order'
          )
          .eq('profile_id', profileData.id)
          .order('display_order', { ascending: true });

        if (portfolioError && portfolioError.code !== 'PGRST116') {
          console.error('Error fetching portfolio items:', portfolioError);
        } else {
          setPortfolioItems(portfolioData || []);
        }
      } catch (err) {
        console.error('Error fetching public profile:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchPublicProfile();
    }
  }, [username]);

  return {
    profile,
    socialLinks,
    portfolioItems,
    loading,
    error,
    notFound,
  };
}
