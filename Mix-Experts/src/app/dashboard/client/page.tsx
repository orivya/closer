'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Clock, MessageSquare, ShoppingBag, ArrowRight, PlayCircle, Plus, Zap, Loader2, Inbox } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProjectCard, type ProjectProps } from '@/components/dashboard/projects/ProjectCard';
import { OrderStatus } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// TypeScript types for our data
interface Order {
    id: string;
    order_number: string;
    service_name: string;
    status: string;
    deadline?: string | null;
    created_at: string;
    engineer_name: string;
    engineer_username: string;
}

interface Activity {
    id: string;
    text: string;
    time: string;
    icon: typeof PlayCircle | typeof MessageSquare | typeof ShoppingBag;
}

interface Stats {
    activeProjects: number;
    unreadMessages: number;
    totalOrders: number;
    rewardPoints: number;
}

// Gradient colors for project cards
const GRADIENT_COLORS = [
    'bg-gradient-to-br from-purple-600 to-blue-600',
    'bg-gradient-to-br from-amber-700 to-orange-500',
    'bg-gradient-to-br from-cyan-500 to-teal-400',
    'bg-gradient-to-br from-slate-700 to-slate-500',
    'bg-gradient-to-br from-pink-600 to-rose-500',
    'bg-gradient-to-br from-green-600 to-emerald-500',
];

export default function ClientDashboardHome() {
    const { user, profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [priorityProject, setPriorityProject] = useState<ProjectProps | null>(null);
    const [stats, setStats] = useState<Stats>({
        activeProjects: 0,
        unreadMessages: 0,
        totalOrders: 0,
        rewardPoints: 0,
    });
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

    // Helper to calculate progress from status
    function getProgressFromStatus(status: string): number {
        switch (status) {
            case 'pending_payment': return 5;
            case 'payment_processing': return 10;
            case 'paid': return 15;
            case 'in_progress': return 40;
            case 'revision_requested': return 60;
            case 'revision_in_progress': return 70;
            case 'pending_approval': return 85;
            case 'completed': return 100;
            case 'delivered': return 100;
            default: return 0;
        }
    }

    // Helper to format relative time
    function getRelativeTime(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
        if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
        return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    }

    useEffect(() => {
        async function fetchDashboardData() {
            if (!user) return;

            try {
                // Fetch all orders for the client
                const { data: ordersData, error: ordersError } = await supabase
                    .from('orders')
                    .select(`
                        id,
                        order_number,
                        service_name,
                        status,
                        deadline,
                        created_at,
                        profiles!orders_seller_id_fkey(display_name, username)
                    `)
                    .eq('buyer_id', user.id)
                    .order('created_at', { ascending: false });

                if (ordersError) {
                    console.error('Error fetching orders:', ordersError);
                } else {
                    // Transform orders to handle profiles join (can be array or object)
                    const transformedOrders: Order[] = (ordersData || []).map((order: any) => {
                        const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
                        return {
                            id: order.id,
                            order_number: order.order_number,
                            service_name: order.service_name,
                            status: order.status,
                            deadline: order.deadline,
                            created_at: order.created_at,
                            engineer_name: profile?.display_name || 'Unknown Engineer',
                            engineer_username: profile?.username || '',
                        };
                    });
                    setOrders(transformedOrders);

                    // Calculate stats
                    const activeStatuses = ['paid', 'in_progress', 'revision_requested', 'revision_in_progress', 'pending_approval'];
                    const activeOrders = (ordersData || []).filter(order => activeStatuses.includes(order.status));

                    setStats(prev => ({
                        ...prev,
                        activeProjects: activeOrders.length,
                        totalOrders: ordersData?.length || 0,
                    }));

                    // Set priority project (first active order that needs attention)
                    const needsAttentionStatuses = ['revision_requested', 'pending_approval'];
                    const activeTransformed = transformedOrders.filter(order =>
                        ['paid', 'in_progress', 'revision_requested', 'revision_in_progress', 'pending_approval'].includes(order.status)
                    );
                    const priorityOrder = transformedOrders.find(order => needsAttentionStatuses.includes(order.status))
                        || activeTransformed[0];

                    if (priorityOrder) {
                        setPriorityProject({
                            id: priorityOrder.id,
                            title: priorityOrder.service_name,
                            artist: priorityOrder.engineer_name || priorityOrder.engineer_username || 'Engineer',
                            coverColor: GRADIENT_COLORS[0],
                            status: priorityOrder.status as ProjectProps['status'],
                            deadline: priorityOrder.deadline
                                ? new Date(priorityOrder.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : 'No deadline',
                            progress: getProgressFromStatus(priorityOrder.status),
                        });
                    }

                    // Build recent activity from orders
                    const activity: Activity[] = [];
                    transformedOrders.slice(0, 5).forEach(order => {
                        activity.push({
                            id: order.id,
                            text: `Order #${order.order_number.slice(-4)} - ${order.service_name}`,
                            time: getRelativeTime(order.created_at),
                            icon: ShoppingBag,
                        });
                    });
                    setRecentActivity(activity.slice(0, 3));
                }

                // Fetch unread messages count
                const { count: unreadCount, error: messagesError } = await supabase
                    .from('messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('recipient_id', user.id)
                    .eq('is_read', false);

                if (!messagesError) {
                    setStats(prev => ({
                        ...prev,
                        unreadMessages: unreadCount || 0,
                    }));
                }

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [user]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    // Show empty state for new clients
    if (!loading && orders.length === 0) {
        return (
            <div className="space-y-8">
                {/* Welcome Hero for New Clients */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--accent)] to-purple-600 p-8 shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <LayoutDashboard className="w-64 h-64 text-white rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome, {profile?.display_name || 'there'}!
                        </h1>
                        <p className="text-white/80 text-lg max-w-lg">
                            You haven't booked any services yet. Browse our talented engineers and start your first project!
                        </p>
                        <div className="mt-8 flex gap-4">
                            <Link
                                href="/"
                                className="px-6 py-3 bg-white text-[var(--accent)] font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Browse Engineers
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-6">
                        <Inbox className="w-10 h-10 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                    <p className="text-[var(--text-gray)] mb-6 max-w-md">
                        Your active projects and orders will appear here once you book a service.
                    </p>
                </div>
            </div>
        );
    }

    const displayName = profile?.display_name || 'there';
    const activeProjectsCount = stats.activeProjects;

    return (
        <div className="space-y-8">
            {/* 1. WELCOME HERO */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--accent)] to-purple-600 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <LayoutDashboard className="w-64 h-64 text-white rotate-12" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Good morning, {displayName}!</h1>
                    <p className="text-white/80 text-lg max-w-lg">
                        {activeProjectsCount > 0 ? (
                            <>
                                You have <strong className="text-white">{activeProjectsCount} active {activeProjectsCount === 1 ? 'project' : 'projects'}</strong>{' '}
                                {priorityProject && priorityProject.status === 'pending_approval' && "waiting for your feedback."}
                                {priorityProject && priorityProject.status === 'revision_requested' && "that need your input."}
                                {priorityProject && !['pending_approval', 'revision_requested'].includes(priorityProject.status) && "in progress."}
                            </>
                        ) : (
                            "All your projects are completed. Ready to start something new?"
                        )}
                    </p>
                    <div className="mt-8 flex gap-4">
                        {priorityProject && (
                            <Link
                                href={`/dashboard/client/orders/${priorityProject.id}`}
                                className="px-6 py-3 bg-white text-[var(--accent)] font-bold rounded-xl shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <PlayCircle className="w-5 h-5" />
                                {priorityProject.status === 'pending_approval' ? 'Review Project' : 'View Project'}
                            </Link>
                        )}
                        <Link
                            href="/dashboard/client/orders"
                            className="px-6 py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-colors backdrop-blur-md"
                        >
                            View All Orders
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Active Projects', value: stats.activeProjects.toString(), icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Unread Messages', value: stats.unreadMessages.toString(), icon: MessageSquare, color: 'text-[var(--accent)]', bg: 'bg-[var(--accent)]/10' },
                    { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Reward Points', value: stats.rewardPoints.toString(), icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[var(--bg-card)] border border-[var(--border-dark)] p-4 rounded-2xl flex items-center gap-4 hover:border-[var(--text-gray)] transition-colors"
                    >
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white leading-none mb-1">{stat.value}</p>
                            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 3. PRIORITY ACTION (Left 2 cols) */}
                <div className="lg:col-span-2 space-y-4">
                    {priorityProject ? (
                        <>
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Priority Action</h2>
                            </div>
                            {/* Reusing ProjectCard but identifying it as 'Active' */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent)] to-purple-600 rounded-[2rem] opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt blur"></div>
                                <div className="relative">
                                    <ProjectCard project={priorityProject} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-8 text-center">
                            <h2 className="text-xl font-bold text-white mb-2">No Priority Actions</h2>
                            <p className="text-[var(--text-gray)]">All caught up! Your projects are running smoothly.</p>
                        </div>
                    )}

                    <div className="pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                        </div>
                        <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl overflow-hidden">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 border-b border-[var(--border-dark)] last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-[var(--bg-base)] border border-[var(--border-dark)] flex items-center justify-center text-[var(--text-muted)]">
                                            <item.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">{item.text}</p>
                                            <p className="text-xs text-[var(--text-muted)]">{item.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-[var(--text-gray)]">
                                    No recent activity
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 4. QUICK SHOP / ACTIONS (Right 1 col) */}
                <div className="space-y-6">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link href="/jamesmix/book" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] border border-[var(--border-dark)] transition-colors group">
                                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-white">Book New Service</span>
                            </Link>
                            <Link href="/jamesmix" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] border border-[var(--border-dark)] transition-colors group">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-white">Browse Shop</span>
                            </Link>
                            <a href="mailto:engineer@example.com" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] border border-[var(--border-dark)] transition-colors group">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-white">Message Engineer</span>
                            </a>
                        </div>
                    </div>

                    {/* Promo Card */}
                    <div className="bg-gradient-to-br from-gray-800 to-black border border-[var(--border-dark)] rounded-2xl p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-white mb-1">Need a Quick Master?</h3>
                            <p className="text-sm text-[var(--text-gray)] mb-4 leading-relaxed">Try our automated AI mastering preview or book a session starting at $75.</p>
                            <button className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-lg transition-colors">
                                Explore Mastering
                            </button>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--accent)] rounded-full blur-3xl opacity-20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
