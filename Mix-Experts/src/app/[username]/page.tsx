import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchAllProfileData, fetchProfileByUsername } from '@/lib/profile-data';
import ProfilePageClient from './ProfilePageClient';

// Reserved paths that should not be treated as usernames
const RESERVED_PATHS = [
  'api', 'auth', 'dashboard', 'login', 'signup', 'logout',
  'onboarding', 'pricing', 'features', 'blog', 'checkout',
  'privacy', 'terms', 'examples', 'forgot-password', 'reset-password',
  'verify-email', 'robots.txt', 'sitemap.xml', '_next', 'favicon.ico'
];

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;

  // Check if reserved path
  if (RESERVED_PATHS.includes(username.toLowerCase())) {
    return {
      title: 'Not Found',
    };
  }

  const profile = await fetchProfileByUsername(username);

  if (!profile) {
    return {
      title: 'Profile Not Found',
    };
  }

  const displayName = profile.display_name || profile.username;
  const title = `${displayName} | MixExperts`;
  const description = profile.bio || `${displayName} - Professional audio engineer on MixExperts`;
  const avatarUrl = profile.avatar_url || '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `https://mixexperts.com/${username}`,
      images: avatarUrl ? [
        {
          url: avatarUrl,
          width: 400,
          height: 400,
          alt: `${displayName} avatar`,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: avatarUrl ? [avatarUrl] : [],
    },
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  // Check if this is a reserved path
  if (RESERVED_PATHS.includes(username.toLowerCase())) {
    notFound();
  }

  // Fetch all profile data
  const data = await fetchAllProfileData(username);

  if (!data || !data.profile) {
    notFound();
  }

  const { profile, services, portfolio, testimonials, faqs, products } = data;

  // Generate JSON-LD structured data for Person schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.display_name || profile.username,
    ...(profile.avatar_url && { image: profile.avatar_url }),
    ...(profile.bio && { description: profile.bio }),
    ...(profile.location && { address: { '@type': 'PostalAddress', addressLocality: profile.location } }),
    url: `https://mixexperts.com/${username}`,
    jobTitle: 'Audio Engineer',
    ...(profile.social_links && {
      sameAs: Object.values(profile.social_links).filter(Boolean),
    }),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Client Component */}
      <ProfilePageClient
        username={username}
        initialProfile={profile}
        initialServices={services}
        initialPortfolio={portfolio}
        initialTestimonials={testimonials}
        initialFaqs={faqs}
        initialProducts={products}
      />
    </>
  );
}
