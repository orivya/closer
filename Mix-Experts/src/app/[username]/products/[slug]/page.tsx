import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProductPageClient from './ProductPageClient';

export interface Product {
  id: string;
  profile_id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  price: number;
  currency: string;
  cover_image_url: string | null;
  preview_url: string | null;
  license_type: string;
  license_terms: string | null;
  tags: string[];
  file_size_mb: number | null;
  download_count: number;
  is_active: boolean;
  profiles?: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
}

async function fetchProduct(username: string, slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles!inner(username, display_name, avatar_url)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('profiles.username', username)
      .single();

    if (error || !data) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data as Product;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ username: string; slug: string }> }): Promise<Metadata> {
  const { username, slug } = await params;

  const product = await fetchProduct(username, slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const engineerName = product.profiles?.display_name || username;
  const title = `${product.name} by ${engineerName} | MixExperts`;
  const description = product.description || `${product.name} - Professional audio product by ${engineerName}`;
  const imageUrl = product.cover_image_url || product.profiles?.avatar_url || '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://mixexperts.com/${username}/products/${slug}`,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductRoute({ params }: { params: Promise<{ username: string; slug: string }> }) {
  const { username, slug } = await params;

  const product = await fetchProduct(username, slug);

  if (!product) {
    notFound();
  }

  const engineerName = product.profiles?.display_name || username;

  const categoryLabels: Record<string, string> = {
    preset: 'Preset Pack',
    sample_pack: 'Sample Pack',
    template: 'DAW Template',
    course: 'Video Course',
    ebook: 'E-Book',
    other: 'Digital Product'
  };

  // Generate JSON-LD structured data for Product schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    image: product.cover_image_url || '',
    brand: {
      '@type': 'Brand',
      name: 'MixExperts',
    },
    offers: {
      '@type': 'Offer',
      price: product.price.toString(),
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Person',
        name: engineerName,
      },
    },
    category: categoryLabels[product.category] || product.category,
    ...(product.tags && product.tags.length > 0 && { keywords: product.tags.join(', ') }),
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Client Component */}
      <ProductPageClient username={username} slug={slug} product={product} />
    </>
  );
}
