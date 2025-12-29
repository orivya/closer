'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Download, Music, Shield, FileText, ShoppingCart } from 'lucide-react';
import { Product } from './page';

interface ProductPageClientProps {
  username: string;
  slug: string;
  product: Product;
}

export default function ProductPageClient({ username, slug, product }: ProductPageClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [purchasing, setPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (!user) {
      router.push(`/login?redirect=/${username}/products/${slug}`);
      return;
    }

    setPurchasing(true);

    try {
      // Get buyer email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .single();

      if (!profile) {
        alert('Failed to get user profile');
        return;
      }

      // Create checkout session
      const response = await fetch('/api/products/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          buyerEmail: profile.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert(error instanceof Error ? error.message : 'Failed to initiate purchase');
    } finally {
      setPurchasing(false);
    }
  };

  const handleBack = () => {
    router.push(`/${username}`);
  };

  const categoryLabels: Record<string, string> = {
    preset: 'Preset Pack',
    sample_pack: 'Sample Pack',
    template: 'DAW Template',
    course: 'Video Course',
    ebook: 'E-Book',
    other: 'Digital Product'
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Header */}
      <div className="border-b border-[var(--border-dark)] bg-[var(--bg-card)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[var(--text-gray)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to {product.profiles?.display_name || username}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Image & Preview */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="aspect-square w-full bg-[var(--bg-elevated)] rounded-2xl overflow-hidden border border-[var(--border-dark)]">
              {product.cover_image_url ? (
                <img
                  src={product.cover_image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                  <Music className="w-24 h-24" />
                </div>
              )}
            </div>

            {/* Audio Preview */}
            {product.preview_url && (
              <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Music className="w-5 h-5 text-[var(--accent)]" />
                  <h3 className="font-bold text-white">Audio Preview</h3>
                </div>
                <audio
                  controls
                  className="w-full"
                  src={product.preview_url}
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="text-sm text-[var(--accent)] font-bold uppercase tracking-wider mb-2">
                {categoryLabels[product.category] || product.category}
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
              {product.description && (
                <p className="text-lg text-[var(--text-gray)] leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-full text-xs font-medium text-[var(--text-gray)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl p-4">
                <div className="text-sm text-[var(--text-muted)] mb-1">Downloads</div>
                <div className="text-2xl font-bold text-white">{product.download_count}</div>
              </div>
              {product.file_size_mb && (
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl p-4">
                  <div className="text-sm text-[var(--text-muted)] mb-1">File Size</div>
                  <div className="text-2xl font-bold text-white">{product.file_size_mb}MB</div>
                </div>
              )}
            </div>

            {/* License */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-[var(--accent)]" />
                <h3 className="font-bold text-white">License: {product.license_type.charAt(0).toUpperCase() + product.license_type.slice(1)}</h3>
              </div>
              {product.license_terms && (
                <div className="text-sm text-[var(--text-gray)] whitespace-pre-wrap font-mono">
                  {product.license_terms}
                </div>
              )}
            </div>

            {/* Purchase Section */}
            <div className="bg-[var(--bg-card)] border-2 border-[var(--accent)]/20 rounded-2xl p-8">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <div className="text-sm text-[var(--text-muted)] mb-1">Price</div>
                  <div className="text-5xl font-bold text-white">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
                <div className="text-sm text-[var(--text-muted)]">{product.currency}</div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all shadow-[0_0_20px_-5px_var(--accent-glow)] flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-6 h-6" />
                {purchasing ? 'Processing...' : 'Buy Now'}
              </button>

              <div className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>Instant download after purchase</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>5 downloads included</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            {product.profiles && (
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl p-6">
                <div className="text-sm text-[var(--text-muted)] mb-3">Sold by</div>
                <div className="flex items-center gap-4">
                  {product.profiles.avatar_url ? (
                    <img
                      src={product.profiles.avatar_url}
                      alt={product.profiles.display_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold">
                      {product.profiles.display_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-white">{product.profiles.display_name}</div>
                    <div className="text-sm text-[var(--text-muted)]">@{product.profiles.username}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
