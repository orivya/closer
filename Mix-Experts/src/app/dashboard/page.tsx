'use client';

import React, { Suspense } from 'react';
import { ArrowRight, Clock, Star, TrendingUp, DollarSign, Eye, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useProfileStats } from '@/hooks/useAnalytics';
import { cn } from '@/lib/utils';
import { LoadingState } from '@/components/ui/AriaLive';

// Loading skeleton for stats
function StatsLoadingSkeleton() {
    return (
        <div className="space-y-8">
            <div>
                <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-2" />
                <div className="h-4 w-96 bg-white/5 rounded animate-pulse" />
            </div>
            <LoadingState message="Loading dashboard statistics..." className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                            <div className="w-16 h-8 bg-white/5 rounded animate-pulse" />
                        </div>
                        <div className="h-5 w-24 bg-white/5 rounded animate-pulse mb-1" />
                        <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Main dashboard content component
function DashboardContent() {
    const { stats, loading } = useProfileStats(30);

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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Studio Overview</h1>
                <p className="text-[var(--text-gray)]">Welcome back! Here's your performance summary for the last 30 days.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Profile Views */}
                <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
                            <Eye className="w-5 h-5" />
                        </div>
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[var(--text-muted)]" />
                        ) : (
                            <span className="text-2xl font-bold text-white">
                                {formatNumber(stats?.profileViews || 0)}
                            </span>
                        )}
                    </div>
                    <h3 className="text-white font-bold mb-1">Profile Views</h3>
                    <p className="text-sm text-[var(--text-gray)]">
                        {stats?.uniqueVisitors || 0} unique visitors
                    </p>
                </div>

                {/* Inquiries */}
                <Link href="/dashboard/inbox" className="group p-6 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl hover:border-[var(--accent)] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                        </div>
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[var(--text-muted)]" />
                        ) : (
                            <span className="text-2xl font-bold text-white">
                                {stats?.totalInquiries || 0}
                            </span>
                        )}
                    </div>
                    <h3 className="text-white font-bold mb-1">Total Inquiries</h3>
                    <p className="text-sm text-[var(--text-gray)] group-hover:text-white transition-colors flex items-center gap-1">
                        {stats?.newInquiries || 0} new <ArrowRight className="w-3 h-3" />
                    </p>
                </Link>

                {/* Revenue */}
                <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[var(--text-muted)]" />
                        ) : (
                            <span className="text-2xl font-bold text-white">
                                {formatCurrency(stats?.revenue || 0)}
                            </span>
                        )}
                    </div>
                    <h3 className="text-white font-bold mb-1">Revenue</h3>
                    <p className="text-sm text-[var(--text-gray)]">Last 30 days</p>
                </div>

                {/* Conversion Rate */}
                <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[var(--text-muted)]" />
                        ) : (
                            <span className="text-2xl font-bold text-white">
                                {(stats?.conversionRate || 0).toFixed(1)}%
                            </span>
                        )}
                    </div>
                    <h3 className="text-white font-bold mb-1">Conversion Rate</h3>
                    <p className="text-sm text-[var(--text-gray)]">Inquiry to booking</p>
                </div>
            </div>

            {/* Revenue Breakdown */}
            {stats && (stats.serviceRevenue > 0 || stats.productRevenue > 0) && (
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4">Revenue Breakdown</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[var(--bg-base)] rounded-xl">
                            <p className="text-sm text-[var(--text-muted)] mb-1">Services</p>
                            <p className="text-xl font-bold text-white">{formatCurrency(stats.serviceRevenue)}</p>
                        </div>
                        <div className="p-4 bg-[var(--bg-base)] rounded-xl">
                            <p className="text-sm text-[var(--text-muted)] mb-1">Products</p>
                            <p className="text-xl font-bold text-white">{formatCurrency(stats.productRevenue)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/dashboard/services"
                        className="p-4 bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl hover:border-[var(--accent)] transition-colors flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-white group-hover:text-[var(--accent)] transition-colors">Manage Services</p>
                            <p className="text-sm text-[var(--text-muted)]">Edit pricing & offerings</p>
                        </div>
                    </Link>
                    <Link
                        href="/dashboard/portfolio"
                        className="p-4 bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl hover:border-[var(--accent)] transition-colors flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                            <Star className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-white group-hover:text-[var(--accent)] transition-colors">Update Portfolio</p>
                            <p className="text-sm text-[var(--text-muted)]">Add new work samples</p>
                        </div>
                    </Link>
                    <Link
                        href="/dashboard/analytics"
                        className="p-4 bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl hover:border-[var(--accent)] transition-colors flex items-center gap-3 group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-white group-hover:text-[var(--accent)] transition-colors">View Analytics</p>
                            <p className="text-sm text-[var(--text-muted)]">Detailed insights</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Main export with Suspense boundary
export default function DashboardOverviewPage() {
    return (
        <Suspense fallback={<StatsLoadingSkeleton />}>
            <DashboardContent />
        </Suspense>
    );
}
