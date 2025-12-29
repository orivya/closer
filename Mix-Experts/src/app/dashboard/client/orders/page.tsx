'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, ArrowRight, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// Order type definition
interface Order {
    id: string;
    order_number: string;
    service_name: string;
    status: string;
    deadline: string | null;
    created_at: string;
    seller_id: string;
    engineer_name: string;
}

export default function ClientOrdersPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        id,
                        order_number,
                        service_name,
                        status,
                        deadline,
                        created_at,
                        seller_id,
                        profiles!orders_seller_id_fkey(display_name)
                    `)
                    .eq('buyer_id', user.id)
                    .neq('status', 'cancelled')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching orders:', error);
                    setOrders([]);
                    return;
                }

                // Transform orders to include engineer_name from profiles join
                const transformedOrders: Order[] = (data || []).map((order: any) => {
                    // Handle profiles which may be an object or array depending on the join
                    const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
                    return {
                        id: order.id,
                        order_number: order.order_number,
                        service_name: order.service_name,
                        status: order.status,
                        deadline: order.deadline,
                        created_at: order.created_at,
                        seller_id: order.seller_id,
                        engineer_name: profile?.display_name || 'Unknown Engineer',
                    };
                });

                setOrders(transformedOrders);
            } catch (err) {
                console.error('Error:', err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [user]);

    // Helper function to get status display
    function getStatusDisplay(status: string) {
        const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
            'pending_payment': { label: 'Pending Payment', color: 'text-yellow-500 bg-yellow-500/10', icon: <Clock className="w-3 h-3" /> },
            'payment_processing': { label: 'Processing Payment', color: 'text-yellow-500 bg-yellow-500/10', icon: <Clock className="w-3 h-3" /> },
            'paid': { label: 'Paid', color: 'text-blue-500 bg-blue-500/10', icon: <Clock className="w-3 h-3" /> },
            'in_progress': { label: 'In Progress', color: 'text-[var(--accent)] bg-[var(--accent)]/10', icon: <Clock className="w-3 h-3" /> },
            'revision_requested': { label: 'Revision Requested', color: 'text-orange-500 bg-orange-500/10', icon: <Clock className="w-3 h-3" /> },
            'revision_in_progress': { label: 'Revision In Progress', color: 'text-orange-500 bg-orange-500/10', icon: <Clock className="w-3 h-3" /> },
            'pending_approval': { label: 'Pending Approval', color: 'text-purple-500 bg-purple-500/10', icon: <Clock className="w-3 h-3" /> },
            'completed': { label: 'Completed', color: 'text-green-500 bg-green-500/10', icon: <CheckCircle2 className="w-3 h-3" /> },
            'refunded': { label: 'Refunded', color: 'text-gray-500 bg-gray-500/10', icon: <CheckCircle2 className="w-3 h-3" /> },
        };
        return statusMap[status] || { label: status, color: 'text-gray-500 bg-gray-500/10', icon: <Clock className="w-3 h-3" /> };
    }

    // Helper function to calculate deadline info
    function getDeadlineInfo(deadline: string | null) {
        if (!deadline) return null;

        const deadlineDate = new Date(deadline);
        const now = new Date();
        const diffTime = deadlineDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return { text: 'Overdue', urgent: true };
        } else if (diffDays === 0) {
            return { text: 'Due today', urgent: true };
        } else if (diffDays === 1) {
            return { text: 'Due tomorrow', urgent: true };
        } else {
            return { text: `Due in ${diffDays} days`, urgent: false };
        }
    }

    // Helper function to get emoji based on service name
    function getServiceEmoji(serviceName: string): string {
        const name = serviceName.toLowerCase();
        if (name.includes('mix') || name.includes('master')) return '🎚️';
        if (name.includes('vocal')) return '🎤';
        if (name.includes('drum')) return '🥁';
        if (name.includes('guitar')) return '🎸';
        if (name.includes('beat') || name.includes('production')) return '🎹';
        return '🎵';
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    My Orders
                </h1>
                <p className="text-[var(--text-gray)]">Track your active services and purchase history.</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
                </div>
            )}

            {/* Empty State */}
            {!loading && orders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-6">
                        <ShoppingBag className="w-10 h-10 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                    <p className="text-[var(--text-gray)] mb-6 max-w-md">
                        You haven't placed any orders yet. Browse our marketplace to find engineers and services.
                    </p>
                    <Link
                        href="/browse"
                        className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-lg hover:bg-[var(--accent-light)] transition-all shadow-[0_0_15px_var(--accent-glow)]"
                    >
                        Browse Services
                    </Link>
                </div>
            )}

            {/* Orders List */}
            {!loading && orders.length > 0 && (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const statusInfo = getStatusDisplay(order.status);
                        const deadlineInfo = order.deadline ? getDeadlineInfo(order.deadline) : null;
                        const isCompleted = order.status === 'completed';

                        return (
                            <div
                                key={order.id}
                                className={cn(
                                    "group bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6 transition-all",
                                    isCompleted
                                        ? "hover:border-green-500/50 opacity-80 hover:opacity-100"
                                        : "hover:border-blue-500/50"
                                )}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-16 h-16 rounded-xl bg-[var(--bg-elevated)] flex items-center justify-center border border-[var(--border-dark)] transition-colors",
                                            !isCompleted && "group-hover:border-blue-500/30"
                                        )}>
                                            <span className="text-2xl">{getServiceEmoji(order.service_name)}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{order.service_name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-[var(--text-gray)]">
                                                <span>Order #{order.order_number}</span>
                                                <span>•</span>
                                                <span>Engineer: {order.engineer_name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-end">
                                            <span className={cn(
                                                "text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide",
                                                statusInfo.color
                                            )}>
                                                {statusInfo.label}
                                            </span>
                                            {deadlineInfo && (
                                                <span className={cn(
                                                    "text-xs mt-1 flex items-center gap-1",
                                                    deadlineInfo.urgent ? "text-red-400" : "text-[var(--text-muted)]"
                                                )}>
                                                    {statusInfo.icon} {deadlineInfo.text}
                                                </span>
                                            )}
                                            {!deadlineInfo && isCompleted && (
                                                <span className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Delivered
                                                </span>
                                            )}
                                        </div>
                                        <Link
                                            href={`/dashboard/client/orders/${order.id}`}
                                            className="p-2 rounded-full border border-[var(--border-dark)] hover:bg-white hover:text-black transition-colors"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
