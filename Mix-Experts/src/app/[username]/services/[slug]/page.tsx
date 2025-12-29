import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { fetchServiceBySlug } from '@/lib/profile-data';
import ServicePageClient from './ServicePageClient';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ username: string; slug: string }> }): Promise<Metadata> {
  const { username, slug } = await params;

  const service = await fetchServiceBySlug(username, slug);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  const engineerName = service.profiles?.display_name || username;
  const title = `${service.name} by ${engineerName} | MixExperts`;
  const description = service.description || `Professional ${service.name} service by ${engineerName}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://mixexperts.com/${username}/services/${slug}`,
      images: service.profiles?.avatar_url ? [
        {
          url: service.profiles.avatar_url,
          width: 400,
          height: 400,
          alt: `${engineerName} avatar`,
        },
      ] : [],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: service.profiles?.avatar_url ? [service.profiles.avatar_url] : [],
    },
  };
}

export default async function ServiceRoute({ params }: { params: Promise<{ username: string; slug: string }> }) {
  const { username, slug } = await params;

  const service = await fetchServiceBySlug(username, slug);

  if (!service) {
    notFound();
  }

  const engineerName = service.profiles?.display_name || username;

  // Generate JSON-LD structured data for Service schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Person',
      name: engineerName,
      ...(service.profiles?.avatar_url && { image: service.profiles.avatar_url }),
    },
    offers: {
      '@type': 'Offer',
      price: service.base_price.toString(),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    areaServed: 'Worldwide',
    ...(service.turnaround_days && {
      deliveryTime: `P${service.turnaround_days}D`,
    }),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* Client Component */}
      <ServicePageClient username={username} slug={slug} service={service} />
    </>
  );
}
