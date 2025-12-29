'use client';

import React, { useState, Suspense } from 'react';
import { SimpleBarChart } from '@/components/dashboard/analytics/SimpleBarChart';
import { Eye, MousePointerClick, Users, DollarSign, ArrowUp, ArrowDown, TrendingUp, Music2, Download, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfileStats, useAnalyticsData } from '@/hooks/useAnalytics';

// Loading skeleton for analytics
function AnalyticsLoadingSkeleton() {
    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-2" />
                    <div className="h-4 w-96 bg-white/5 rounded animate-pulse" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                        </div>
                        <div className="h-8 w-20 bg-white/5 rounded animate-pulse mb-2" />
                        <div className="h-4 w-24 bg-white/5 rounded animate-pulse mb-1" />
                        <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-8">
                    <div className="h-6 w-32 bg-white/5 rounded animate-pulse mb-6" />
                    <div className="h-[300px] bg-white/5 rounded animate-pulse" />
                </div>
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-8">
                    <div className="h-6 w-32 bg-white/5 rounded animate-pulse mb-6" />
                    <div className="h-[200px] bg-white/5 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );
}

// Main analytics content component
function AnalyticsContent() {
    const [days, setDays] = useState(30);
    const { stats, loading: statsLoading, refetch: refetchStats } = useProfileStats(days);
    const { dailyStats, topPortfolio, trafficSources, loading: dataLoading, refetch: refetchData } = useAnalyticsData(days);

    const loading = statsLoading || dataLoading;

    const handleRefresh = () => {
        refetchStats();
        refetchData();
    };

    const handleDaysChange = (newDays: number) => {
        setDays(newDays);
    };

    // Transform daily stats for the chart
    const trafficData = dailyStats.slice(-7).map((day) => ({
        label: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
        value: day.views,
    }));

    // Traffic sources for chart
    const sourceData = trafficSources.slice(0, 5).map((source, index) => ({
        label: source.source.substring(0, 8),
        value: source.count,
        color: ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500'][index] || 'bg-gray-500',
    }));

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const exportToCSV = () => {
        const headers = ['Date', 'Views', 'Unique Visitors'];
        const rows = dailyStats.map((day) => [day.date, day.views, day.uniqueVisitors]);
        const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${days}days.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                    <p className="text-[var(--text-gray)]">Track your profile performance and audience growth</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="p-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg hover:border-[var(--accent)] transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={cn("w-5 h-5 text-[var(--text-muted)]", loading && "animate-spin")} />
                    </button>
                    <select
                        value={days}
                        onChange={(e) => handleDaysChange(Number(e.target.value))}
                        className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-[var(--accent)]"
                    >
                        <option value={7}>Last 7 Days</option>
                        <option value={30}>Last 30 Days</option>
                        <option value={90}>Last 90 Days</option>
                    </select>
                    <button
                        onClick={exportToCSV}
                        disabled={dailyStats.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] text-white text-sm rounded-lg hover:border-[var(--accent)] transition-colors disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    {
                        label: 'Profile Views',
                        value: loading ? null : formatNumber(stats?.profileViews || 0),
                        subtext: `${stats?.uniqueVisitors || 0} unique`,
                        icon: Eye,
                        color: 'text-blue-400',
                        bg: 'bg-blue-500/10',
                    },
                    {
                        label: 'Total Inquiries',
                        value: loading ? null : formatNumber(stats?.totalInquiries || 0),
                        subtext: `${stats?.newInquiries || 0} new`,
                        icon: Users,
                        color: 'text-purple-400',
                        bg: 'bg-purple-500/10',
                    },
                    {
                        label: 'Revenue',
                        value: loading ? null : formatCurrency(stats?.revenue || 0),
                        subtext: `Last ${days} days`,
                        icon: DollarSign,
                        color: 'text-green-400',
                        bg: 'bg-green-500/10',
                    },
                    {
                        label: 'Conversion Rate',
                        value: loading ? null : `${(stats?.conversionRate || 0).toFixed(1)}%`,
                        subtext: 'Inquiry → Booking',
                        icon: TrendingUp,
                        color: 'text-pink-400',
                        bg: 'bg-pink-500/10',
                    },
                ].map((stat, i) => (
                    <div key={i} className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", stat.bg, stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)] mb-2" />
                        ) : (
                            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        )}
                        <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                        <p className="text-xs text-[var(--text-gray)] mt-1">{stat.subtext}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Traffic Volume (Main Chart) */}
                <div className="lg:col-span-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-8">
                    <h2 className="text-lg font-bold text-white mb-6">Visitor Traffic</h2>
                    {loading ? (
                        <div className="h-[300px] flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
                        </div>
                    ) : trafficData.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <SimpleBarChart data={trafficData} />
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-[var(--text-muted)]">
                            No traffic data yet. Share your profile to start tracking!
                        </div>
                    )}
                </div>

                {/* Traffic Sources */}
                <div className="space-y-8">
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-8">
                        <h2 className="text-lg font-bold text-white mb-6">Traffic Sources</h2>
                        {loading ? (
                            <div className="h-[200px] flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
                            </div>
                        ) : sourceData.length > 0 ? (
                            <>
                                <div className="h-[150px]">
                                    <SimpleBarChart data={sourceData} showValue={false} />
                                </div>
                                <div className="mt-6 space-y-3">
                                    {trafficSources.slice(0, 5).map((source, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-3 h-3 rounded-full", sourceData[i]?.color || 'bg-gray-500')} />
                                                <span className="text-[var(--text-gray)]">{source.source}</span>
                                            </div>
                                            <span className="font-bold text-white">{source.percentage.toFixed(0)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-[var(--text-muted)] text-sm text-center">
                                No source data yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Portfolio Items */}
            <div className="mt-8 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-8">
                <h2 className="text-lg font-bold text-white mb-6">Top Performing Portfolio Items</h2>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
                    </div>
                ) : topPortfolio.length > 0 ? (
                    <div className="space-y-4">
                        {topPortfolio.slice(0, 5).map((item, i) => (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="w-8 font-bold text-[var(--text-muted)] tabular-nums">#{i + 1}</div>
                                <div className="w-10 h-10 rounded-lg bg-[var(--bg-base)] flex items-center justify-center">
                                    <Music2 className="w-5 h-5 text-[var(--accent)]" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <div>
                                            <span className="text-white font-medium">{item.title}</span>
                                            <span className="text-[var(--text-muted)] text-sm ml-2">by {item.artist}</span>
                                        </div>
                                        <span className="text-[var(--text-gray)] text-sm">{formatNumber(item.play_count)} plays</span>
                                    </div>
                                    <div className="h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--accent)]"
                                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-[var(--text-muted)]">
                        <Music2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No portfolio plays yet</p>
                        <p className="text-sm mt-1">Add audio samples to your portfolio to track plays</p>
                    </div>
                )}
            </div>

            {/* Revenue Breakdown */}
            {stats && (stats.serviceRevenue > 0 || stats.productRevenue > 0) && (
                <div className="mt-8 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-8">
                    <h2 className="text-lg font-bold text-white mb-6">Revenue Breakdown</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                                    <span className="text-white">Services</span>
                                </div>
                                <span className="font-bold text-white">{formatCurrency(stats.serviceRevenue)}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-purple-500" />
                                    <span className="text-white">Products</span>
                                </div>
                                <span className="font-bold text-white">{formatCurrency(stats.productRevenue)}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-white mb-2">{formatCurrency(stats.revenue)}</p>
                                <p className="text-[var(--text-muted)]">Total Revenue ({days} days)</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Main export with Suspense boundary
export default function AnalyticsPage() {
    return (
        <Suspense fallback={<AnalyticsLoadingSkeleton />}>
            <AnalyticsContent />
        </Suspense>
    );
}
