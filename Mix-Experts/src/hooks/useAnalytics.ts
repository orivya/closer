'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ProfileStats {
  profileViews: number;
  uniqueVisitors: number;
  totalInquiries: number;
  newInquiries: number;
  revenue: number;
  productRevenue: number;
  serviceRevenue: number;
  conversionRate: number;
  avgResponseTime: number | null;
  repeatClientRate: number;
}

export interface DailyStats {
  date: string;
  views: number;
  uniqueVisitors: number;
}

export interface RevenueStats {
  date: string;
  amount: number;
  type: 'service' | 'product';
}

export interface TopPortfolioItem {
  id: string;
  title: string;
  artist: string;
  play_count: number;
  percentage: number;
}

export interface TrafficSource {
  source: string;
  count: number;
  percentage: number;
}

export function useProfileStats(days: number = 30) {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffISO = cutoffDate.toISOString();

      // Fetch profile views
      const { count: profileViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', user.id)
        .eq('event_type', 'profile_view')
        .gte('created_at', cutoffISO);

      // Fetch unique visitors
      const { data: visitorData } = await supabase
        .from('analytics_events')
        .select('visitor_id')
        .eq('profile_id', user.id)
        .eq('event_type', 'profile_view')
        .gte('created_at', cutoffISO);

      const uniqueVisitors = new Set(visitorData?.map((v) => v.visitor_id)).size;

      // Fetch total inquiries
      const { count: totalInquiries } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('is_inquiry', true);

      // Fetch new inquiries
      const { count: newInquiries } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('is_inquiry', true)
        .eq('inquiry_status', 'new');

      // Fetch service revenue (orders)
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .eq('engineer_id', user.id)
        .eq('status', 'paid')
        .gte('created_at', cutoffISO);

      const serviceRevenue = orders?.reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0;

      // Fetch product revenue
      const { data: purchases } = await supabase
        .from('product_purchases')
        .select('amount, products!inner(profile_id)')
        .eq('products.profile_id', user.id)
        .eq('status', 'completed')
        .gte('purchased_at', cutoffISO);

      const productRevenue = purchases?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

      // Calculate conversion rate
      const { count: convertedInquiries } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('is_inquiry', true)
        .eq('inquiry_status', 'converted');

      const conversionRate = totalInquiries && totalInquiries > 0
        ? ((convertedInquiries || 0) / totalInquiries) * 100
        : 0;

      setStats({
        profileViews: profileViews || 0,
        uniqueVisitors,
        totalInquiries: totalInquiries || 0,
        newInquiries: newInquiries || 0,
        revenue: serviceRevenue + productRevenue,
        serviceRevenue,
        productRevenue,
        conversionRate,
        avgResponseTime: null, // Would require complex query
        repeatClientRate: 0, // Would require complex query
      });
    } catch (err) {
      console.error('Error fetching profile stats:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
    } finally {
      setLoading(false);
    }
  }, [user, days]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useAnalyticsData(days: number = 30) {
  const { user } = useAuth();
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [revenueStats, setRevenueStats] = useState<RevenueStats[]>([]);
  const [topPortfolio, setTopPortfolio] = useState<TopPortfolioItem[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffISO = cutoffDate.toISOString();

      // Fetch daily view stats
      const { data: viewEvents } = await supabase
        .from('analytics_events')
        .select('created_at, visitor_id')
        .eq('profile_id', user.id)
        .eq('event_type', 'profile_view')
        .gte('created_at', cutoffISO)
        .order('created_at', { ascending: true });

      // Group by date
      const dailyMap = new Map<string, { views: number; visitors: Set<string> }>();
      viewEvents?.forEach((event) => {
        const date = event.created_at.split('T')[0];
        if (!dailyMap.has(date)) {
          dailyMap.set(date, { views: 0, visitors: new Set() });
        }
        const entry = dailyMap.get(date)!;
        entry.views++;
        entry.visitors.add(event.visitor_id);
      });

      const dailyStatsArray: DailyStats[] = Array.from(dailyMap.entries()).map(([date, data]) => ({
        date,
        views: data.views,
        uniqueVisitors: data.visitors.size,
      }));
      setDailyStats(dailyStatsArray);

      // Fetch top portfolio items
      const { data: portfolioItems } = await supabase
        .from('portfolio_items')
        .select('id, title, artist, play_count')
        .eq('profile_id', user.id)
        .order('play_count', { ascending: false })
        .limit(10);

      const totalPlays = portfolioItems?.reduce((sum, item) => sum + (item.play_count || 0), 0) || 1;
      const topItems: TopPortfolioItem[] = (portfolioItems || []).map((item) => ({
        id: item.id,
        title: item.title,
        artist: item.artist || 'Unknown Artist',
        play_count: item.play_count || 0,
        percentage: ((item.play_count || 0) / totalPlays) * 100,
      }));
      setTopPortfolio(topItems);

      // Fetch traffic sources
      const { data: sourceEvents } = await supabase
        .from('analytics_events')
        .select('utm_source, referrer')
        .eq('profile_id', user.id)
        .eq('event_type', 'profile_view')
        .gte('created_at', cutoffISO);

      const sourceMap = new Map<string, number>();
      sourceEvents?.forEach((event) => {
        let source = 'Direct';
        if (event.utm_source) {
          source = event.utm_source;
        } else if (event.referrer) {
          try {
            const url = new URL(event.referrer);
            if (url.hostname.includes('google')) source = 'Google';
            else if (url.hostname.includes('instagram')) source = 'Instagram';
            else if (url.hostname.includes('facebook')) source = 'Facebook';
            else if (url.hostname.includes('twitter') || url.hostname.includes('x.com')) source = 'Twitter/X';
            else source = url.hostname;
          } catch {
            source = 'Other';
          }
        }
        sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
      });

      const totalSources = Array.from(sourceMap.values()).reduce((a, b) => a + b, 0) || 1;
      const sources: TrafficSource[] = Array.from(sourceMap.entries())
        .map(([source, count]) => ({
          source,
          count,
          percentage: (count / totalSources) * 100,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      setTrafficSources(sources);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { dailyStats, revenueStats, topPortfolio, trafficSources, loading, refetch: fetchData };
}
