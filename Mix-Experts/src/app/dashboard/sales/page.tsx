'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { DollarSign, TrendingUp, Package, Download, Clock } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface Sale {
  id: string;
  purchase_number: string;
  product_name: string;
  product_price: number;
  platform_fee: number;
  seller_payout: number;
  currency: string;
  download_count: number;
  download_limit: number;
  status: string;
  purchased_at: string;
  buyer_id: string;
  products: {
    id: string;
    name: string;
    cover_image_url: string | null;
  } | null;
  buyer_profile: {
    display_name: string;
    email: string;
    username: string;
  } | null;
}

interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  totalPayout: number;
  totalPlatformFees: number;
  totalDownloads: number;
}

export default function SalesPage() {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<SalesStats>({
    totalSales: 0,
    totalRevenue: 0,
    totalPayout: 0,
    totalPlatformFees: 0,
    totalDownloads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('product_purchases')
          .select(`
            *,
            products(id, name, cover_image_url),
            buyer_profile:profiles!buyer_id(display_name, email, username)
          `)
          .eq('seller_id', user.id)
          .order('purchased_at', { ascending: false });

        if (error) {
          console.error('Error fetching sales:', error);
        } else {
          setSales(data || []);

          // Calculate stats
          const totalSales = data?.length || 0;
          const totalRevenue = data?.reduce((sum, sale) => sum + parseFloat(sale.product_price.toString()), 0) || 0;
          const totalPayout = data?.reduce((sum, sale) => sum + parseFloat(sale.seller_payout.toString()), 0) || 0;
          const totalPlatformFees = data?.reduce((sum, sale) => sum + parseFloat(sale.platform_fee.toString()), 0) || 0;
          const totalDownloads = data?.reduce((sum, sale) => sum + sale.download_count, 0) || 0;

          setStats({
            totalSales,
            totalRevenue,
            totalPayout,
            totalPlatformFees,
            totalDownloads,
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSales();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
              <DollarSign className="w-6 h-6" />
            </div>
            Sales Dashboard
          </h1>
          <p className="text-[var(--text-gray)]">Track your product sales and revenue.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-[var(--text-muted)]">Loading sales data...</div>
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
            <DollarSign className="w-6 h-6" />
          </div>
          Sales Dashboard
        </h1>
        <p className="text-[var(--text-gray)]">Track your product sales and revenue.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-[var(--accent)]" />
            <div className="text-sm text-[var(--text-muted)]">Total Sales</div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalSales}</div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <div className="text-sm text-[var(--text-muted)]">Total Revenue</div>
          </div>
          <div className="text-3xl font-bold text-white">${stats.totalRevenue.toFixed(2)}</div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
            <div className="text-sm text-[var(--text-muted)]">Your Payout</div>
          </div>
          <div className="text-3xl font-bold text-white">${stats.totalPayout.toFixed(2)}</div>
          <div className="text-xs text-[var(--text-muted)] mt-1">
            Platform fees: ${stats.totalPlatformFees.toFixed(2)}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-5 h-5 text-blue-400" />
            <div className="text-sm text-[var(--text-muted)]">Total Downloads</div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalDownloads}</div>
        </div>
      </div>

      {/* Sales List */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Recent Sales</h2>

        {sales.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
            <h3 className="text-xl font-bold text-white mb-2">No sales yet</h3>
            <p className="text-[var(--text-gray)]">
              Your product sales will appear here once customers start purchasing.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <div
                key={sale.id}
                className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl overflow-hidden hover:border-[var(--accent)]/50 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-[var(--bg-elevated)] rounded-xl overflow-hidden flex-shrink-0">
                      {sale.products?.cover_image_url ? (
                        <img
                          src={sale.products.cover_image_url}
                          alt={sale.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{sale.product_name}</h3>
                          {sale.buyer_profile && (
                            <p className="text-sm text-[var(--text-muted)]">
                              Purchased by {sale.buyer_profile.display_name} (@{sale.buyer_profile.username})
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">
                            ${sale.product_price.toFixed(2)}
                          </div>
                          <div className="text-sm text-green-400 font-medium">
                            +${sale.seller_payout.toFixed(2)} payout
                          </div>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                          <Clock className="w-4 h-4" />
                          <span>{formatDistance(new Date(sale.purchased_at), new Date(), { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                          <Download className="w-4 h-4" />
                          <span>{sale.download_count} / {sale.download_limit} downloads</span>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          sale.status === 'completed'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {sale.status}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with order number */}
                <div className="px-6 py-3 bg-[var(--bg-elevated)] border-t border-[var(--border-dark)] flex items-center justify-between text-sm">
                  <div className="text-[var(--text-muted)]">
                    Order: {sale.purchase_number}
                  </div>
                  {sale.platform_fee > 0 && (
                    <div className="text-[var(--text-muted)]">
                      Platform fee: ${sale.platform_fee.toFixed(2)} ({((sale.platform_fee / sale.product_price) * 100).toFixed(0)}%)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
