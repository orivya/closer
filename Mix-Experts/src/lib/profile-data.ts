/**
 * Profile Data Fetching Utilities
 * Fetches all profile-related data from the database for public profile pages
 */

import { supabase } from './supabase';
import { DatabaseService } from './database.types';

// Profile data as stored in the database
export interface ProfileData {
  id: string;
  username: string;
  display_name: string | null;
  email: string;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  tagline: string | null;
  location: string | null;
  timezone: string;
  role: 'artist' | 'admin';
  is_published: boolean;
  is_verified: boolean;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  created_at: string;
  // Extended profile fields (may be in separate table or JSON column)
  years_experience?: number;
  total_streams?: string;
  social_links?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    spotify?: string;
    soundcloud?: string;
  };
}

// Portfolio item from database
export interface PortfolioItemData {
  id: string;
  engineer_id: string;
  title: string;
  artist: string;
  image_url: string;
  audio_url?: string;
  created_at: string;
}

// Testimonial from database
export interface TestimonialData {
  id: string;
  engineer_id: string;
  author_name: string;
  author_image?: string;
  project_name: string;
  text: string;
  rating: number;
  created_at: string;
}

// FAQ from database
export interface FAQData {
  id: string;
  engineer_id: string;
  question: string;
  answer: string;
  sort_order: number;
}

// Service data formatted for display
export interface ServiceDisplayData {
  id: string;
  title: string;
  price: string;
  description: string;
  turnaround: string;
  features: string[];
  slug: string;
}

/**
 * Fetch profile by username
 */
export async function fetchProfileByUsername(username: string): Promise<ProfileData | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as ProfileData;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Fetch services for an engineer
 */
export async function fetchProfileServices(engineerId: string): Promise<ServiceDisplayData[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('engineer_id', engineerId)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error || !data) {
      console.error('Error fetching services:', error);
      return [];
    }

    // Transform database format to display format
    return (data as DatabaseService[]).map(service => ({
      id: service.id,
      title: service.name,
      price: `Starting at $${service.base_price}`,
      description: service.description,
      turnaround: `${service.turnaround_days} Days`,
      features: service.features || [],
      slug: service.slug,
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

/**
 * Fetch portfolio items for an engineer
 */
export async function fetchProfilePortfolio(engineerId: string): Promise<PortfolioItemData[]> {
  try {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('engineer_id', engineerId)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error || !data) {
      // If table doesn't exist yet, return empty array
      console.error('Error fetching portfolio:', error);
      return [];
    }

    return data as PortfolioItemData[];
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return [];
  }
}

/**
 * Fetch testimonials for an engineer
 */
export async function fetchProfileTestimonials(engineerId: string): Promise<TestimonialData[]> {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('engineer_id', engineerId)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error || !data) {
      // If table doesn't exist yet, return empty array
      console.error('Error fetching testimonials:', error);
      return [];
    }

    return data as TestimonialData[];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

/**
 * Fetch FAQs for an engineer
 */
export async function fetchProfileFAQs(engineerId: string): Promise<FAQData[]> {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('engineer_id', engineerId)
      .order('sort_order', { ascending: true });

    if (error || !data) {
      // If table doesn't exist yet, return empty array
      console.error('Error fetching FAQs:', error);
      return [];
    }

    return data as FAQData[];
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

/**
 * Fetch products for an engineer
 */
export async function fetchProfileProducts(engineerId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('engineer_id', engineerId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch a single service by slug and username
 */
export async function fetchServiceBySlug(username: string, slug: string) {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        profiles!inner(username, display_name, avatar_url)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('profiles.username', username)
      .single();

    if (error || !data) {
      console.error('Error fetching service:', error);
      return null;
    }

    return data as DatabaseService & {
      profiles: {
        username: string;
        display_name: string;
        avatar_url: string | null;
      };
    };
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

/**
 * Fetch all profile data at once
 */
export async function fetchAllProfileData(username: string) {
  const profile = await fetchProfileByUsername(username);

  if (!profile) {
    return null;
  }

  // Fetch all related data in parallel
  const [services, portfolio, testimonials, faqs, products] = await Promise.all([
    fetchProfileServices(profile.id),
    fetchProfilePortfolio(profile.id),
    fetchProfileTestimonials(profile.id),
    fetchProfileFAQs(profile.id),
    fetchProfileProducts(profile.id),
  ]);

  return {
    profile,
    services,
    portfolio,
    testimonials,
    faqs,
    products,
  };
}
