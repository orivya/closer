'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Download, Package, Clock } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface Purchase {
  id: string;
  purchase_number: string;
  product_name: string;
  product_description: string | null;
  license_type: string;
  total_amount: number;
  currency: string;
  download_count: number;
  download_limit: number;
  last_downloaded_at: string | null;
  status: string;
  purchased_at: string;
  products: {
    id: string;
    slug: string;
    cover_image_url: string | null;
    file_size_mb: number | null;
    profiles: {
      username: string;
      display_name: string;
    };
  } | null;
}

export default function DownloadsPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPurchases() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('product_purchases')
          .select(`
            *,
            products(
              id,
              slug,
              cover_image_url,
              file_size_mb,
              profiles(username, display_name)
            )
          `)
          .eq('buyer_id', user.id)
          .order('purchased_at', { ascending: false });

        if (error) {
          console.error('Error fetching purchases:', error);
        } else {
          setPurchases(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPurchases();
  }, [user]);

  const handleDownload = async (purchase: Purchase) => {
    if (!user) return;

    setDownloading(purchase.id);

    try {
      const response = await fetch('/api/products/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchaseId: purchase.id,
          buyerId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Download failed');
      }

      // Open download URL in new tab
      window.open(data.downloadUrl, '_blank');

      // Refresh purchases to update download count
      const { data: updatedPurchase } = await supabase
        .from('product_purchases')
        .select('download_count, last_downloaded_at')
        .eq('id', purchase.id)
        .single();

      if (updatedPurchase) {
        setPurchases(purchases.map(p =>
          p.id === purchase.id
            ? { ...p, ...updatedPurchase }
            : p
        ));
      }

    } catch (error) {
      console.error('Download error:', error);
      alert(error instanceof Error ? error.message : 'Failed to download');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
              <Download className="w-6 h-6" />
            </div>
            My Downloads
          </h1>
          <p className="text-[var(--text-gray)]">Access your purchased digital products.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-[var(--text-muted)]">Loading purchases...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
            <Download className="w-6 h-6" />
          </div>
          My Downloads
        </h1>
        <p className="text-[var(--text-gray)]">Access your purchased digital products.</p>
      </div>

      {/* Purchases List */}
      {purchases.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
          <h3 className="text-xl font-bold text-white mb-2">No purchases yet</h3>
          <p className="text-[var(--text-gray)]">
            Browse the marketplace to find presets, samples, and templates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => {
            const canDownload = purchase.status === 'completed' &&
                               purchase.download_count < purchase.download_limit;
            const downloadsRemaining = purchase.download_limit - purchase.download_count;

            return (
              <div
                key={purchase.id}
                className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl overflow-hidden hover:border-[var(--accent)]/50 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Cover Image */}
                    <div className="w-24 h-24 bg-[var(--bg-elevated)] rounded-xl overflow-hidden flex-shrink-0">
                      {purchase.products?.cover_image_url ? (
                        <img
                          src={purchase.products.cover_image_url}
                          alt={purchase.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                          <Package className="w-10 h-10" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{purchase.product_name}</h3>
                          {purchase.products?.profiles && (
                            <p className="text-sm text-[var(--text-muted)]">
                              by {purchase.products.profiles.display_name}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            ${purchase.total_amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-[var(--text-muted)]">
                            {purchase.purchase_number}
                          </div>
                        </div>
                      </div>

                      {purchase.product_description && (
                        <p className="text-sm text-[var(--text-gray)] mb-4 line-clamp-2">
                          {purchase.product_description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-6 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                          <Clock className="w-4 h-4" />
                          <span>Purchased {formatDistance(new Date(purchase.purchased_at), new Date(), { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                          <Download className="w-4 h-4" />
                          <span>{purchase.download_count} / {purchase.download_limit} downloads used</span>
                        </div>
                        {purchase.products?.file_size_mb && (
                          <div className="text-[var(--text-muted)]">
                            {purchase.products.file_size_mb}MB
                          </div>
                        )}
                      </div>

                      {/* Download Button */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleDownload(purchase)}
                          disabled={!canDownload || downloading === purchase.id}
                          className="px-6 py-2.5 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all shadow-[0_0_15px_-5px_var(--accent-glow)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Download className="w-4 h-4" />
                          {downloading === purchase.id ? 'Preparing...' : 'Download'}
                        </button>

                        {!canDownload && (
                          <div className="text-sm text-[var(--text-muted)]">
                            {purchase.status !== 'completed'
                              ? 'Purchase pending'
                              : 'Download limit reached'}
                          </div>
                        )}

                        {canDownload && downloadsRemaining <= 2 && (
                          <div className="text-sm text-orange-400">
                            {downloadsRemaining} download{downloadsRemaining !== 1 ? 's' : ''} remaining
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Last Downloaded */}
                {purchase.last_downloaded_at && (
                  <div className="px-6 py-3 bg-[var(--bg-elevated)] border-t border-[var(--border-dark)] text-sm text-[var(--text-muted)]">
                    Last downloaded {formatDistance(new Date(purchase.last_downloaded_at), new Date(), { addSuffix: true })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
