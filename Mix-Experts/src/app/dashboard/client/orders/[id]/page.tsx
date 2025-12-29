'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
    ChevronRight,
    Clock,
    Download,
    MessageSquare,
    Calendar,
    User,
    FileAudio,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusTimeline } from '@/components/dashboard/projects/StatusTimeline';
import { RevisionRequestForm } from '@/components/dashboard/projects/RevisionRequestForm';

interface Order {
    id: string;
    order_number: string;
    status: string;
    total: number;
    client_name: string;
    client_email: string;
    notes: string | null;
    requirements: string | null;
    created_at: string;
    updated_at: string;
    service: {
        id: string;
        name: string;
        description: string;
        turnaround_days: number;
    } | null;
    engineer: {
        id: string;
        display_name: string;
        username: string;
        avatar_url: string | null;
    } | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    pending: { label: 'Pending', color: 'text-yellow-400 bg-yellow-400/10', icon: Clock },
    in_progress: { label: 'In Progress', color: 'text-blue-400 bg-blue-400/10', icon: Clock },
    review: { label: 'Ready for Review', color: 'text-purple-400 bg-purple-400/10', icon: AlertCircle },
    completed: { label: 'Completed', color: 'text-green-400 bg-green-400/10', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10', icon: AlertCircle },
};

export default function ClientOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const orderId = resolvedParams.id;
    const { user, loading: authLoading } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRevisionForm, setShowRevisionForm] = useState(false);

    useEffect(() => {
        async function fetchOrder() {
            if (authLoading) return;

            if (!user) {
                setError('Please sign in to view this order');
                setLoading(false);
                return;
            }

            // Validate UUID format to prevent IDOR attacks
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(orderId)) {
                setError('Invalid order ID');
                setLoading(false);
                return;
            }

            try {
                const { data, error: fetchError } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        service:services(id, name, description, turnaround_days),
                        engineer:profiles!orders_engineer_id_fkey(id, display_name, username, avatar_url)
                    `)
                    .eq('id', orderId)
                    .eq('client_id', user.id)
                    .single();

                if (fetchError) {
                    if (fetchError.code === 'PGRST116') {
                        setError('Order not found or you do not have access to view it');
                    } else {
                        setError('Failed to load order details');
                    }
                    return;
                }

                setOrder(data);
            } catch (err) {
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, [orderId, user, authLoading]);

    const handleRevisionSubmit = (data: { notes: string; timestamps: { time: string; note: string }[] }) => {
        setShowRevisionForm(false);
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin mx-auto mb-4" />
                    <p className="text-[var(--text-muted)]">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Unable to Load Order</h2>
                    <p className="text-[var(--text-muted)] mb-6">{error || 'Order not found'}</p>
                    <Link
                        href="/dashboard/client/orders"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] text-white rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
    const StatusIcon = statusConfig.icon;
    const estimatedDelivery = new Date(order.created_at);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + (order.service?.turnaround_days || 7));

    return (
        <div className="space-y-8 pb-12">
            {/* Revision Request Modal */}
            {showRevisionForm && (
                <div className="fixed inset-0 z-50">
                    <RevisionRequestForm
                        revisionNumber={1}
                        onSubmit={handleRevisionSubmit}
                        onCancel={() => setShowRevisionForm(false)}
                    />
                </div>
            )}

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-[var(--text-gray)]" aria-label="Breadcrumb">
                <Link href="/dashboard/client/orders" className="hover:text-white transition-colors">Orders</Link>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
                <span className="text-white" aria-current="page">Order #{order.order_number}</span>
            </nav>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{order.service?.name || 'Order'}</h1>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-gray)]">
                        <span className={cn("px-3 py-1 rounded-full font-medium", statusConfig.color)}>
                            {statusConfig.label}
                        </span>
                        <span>Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Action Buttons based on Status */}
                    {order.status === 'review' && (
                        <button
                            onClick={() => setShowRevisionForm(true)}
                            className="px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all flex items-center gap-2"
                            aria-label="Request a revision for this order"
                        >
                            <MessageSquare className="w-4 h-4" aria-hidden="true" />
                            Request Revision
                        </button>
                    )}

                    {order.status === 'completed' && (
                        <button
                            className="px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all flex items-center gap-2"
                            aria-label="Download completed files"
                        >
                            <Download className="w-4 h-4" aria-hidden="true" />
                            Download Files
                        </button>
                    )}

                    <Link
                        href="/dashboard/inbox"
                        className="px-6 py-3 bg-[var(--bg-elevated)] border border-[var(--border-dark)] text-white font-bold rounded-xl hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                        <MessageSquare className="w-4 h-4" aria-hidden="true" />
                        Message Engineer
                    </Link>
                </div>
            </div>

            {/* Visual Timeline */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-8">
                <h2 className="text-lg font-bold text-white mb-8">Order Status</h2>
                <StatusTimeline
                    currentStatus={order.status as 'received' | 'in_progress' | 'mixing' | 'review' | 'completed' | 'delivered'}
                    userRole="client"
                    history={[
                        { status: 'received' as const, updatedAt: new Date(order.created_at), updatedBy: 'system' as const },
                        ...(order.status !== 'received' ? [{ status: 'in_progress' as const, updatedAt: new Date(order.updated_at), updatedBy: 'engineer' as const }] : []),
                        ...(order.status === 'review' || order.status === 'completed' || order.status === 'delivered' ? [{ status: 'review' as const, updatedAt: new Date(order.updated_at), updatedBy: 'engineer' as const }] : []),
                        ...(order.status === 'completed' || order.status === 'delivered' ? [{ status: 'completed' as const, updatedAt: new Date(order.updated_at), updatedBy: 'engineer' as const }] : [])
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Service Details */}
                    {order.service && (
                        <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Service Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-white font-medium">{order.service.name}</h4>
                                    <p className="text-[var(--text-muted)] text-sm mt-1">
                                        {order.service.description || 'No description available'}
                                    </p>
                                </div>

                                {order.requirements && (
                                    <div className="pt-4 border-t border-[var(--border-dark)]">
                                        <h4 className="text-sm font-medium text-[var(--text-muted)] mb-2">Your Requirements</h4>
                                        <p className="text-white text-sm">{order.requirements}</p>
                                    </div>
                                )}

                                {order.notes && (
                                    <div className="pt-4 border-t border-[var(--border-dark)]">
                                        <h4 className="text-sm font-medium text-[var(--text-muted)] mb-2">Additional Notes</h4>
                                        <p className="text-white text-sm">{order.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Files Section */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FileAudio className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                            Project Files
                        </h3>
                        {order.status === 'completed' || order.status === 'review' ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-xl border border-[var(--border-dark)]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">ZIP</div>
                                        <div>
                                            <div className="font-bold text-white text-sm">Project_Files.zip</div>
                                            <div className="text-xs text-[var(--text-muted)]">Ready for download</div>
                                        </div>
                                    </div>
                                    <button className="text-[var(--accent)] hover:underline text-sm font-bold">Download</button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-[var(--text-muted)]">
                                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
                                <p>No files ready for review yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Summary */}
                <div className="space-y-6">
                    {/* Engineer Card */}
                    {order.engineer && (
                        <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Your Engineer</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-dark)] flex items-center justify-center overflow-hidden">
                                    {order.engineer.avatar_url ? (
                                        <img
                                            src={order.engineer.avatar_url}
                                            alt={order.engineer.display_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-6 h-6 text-[var(--text-muted)]" aria-hidden="true" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-white">{order.engineer.display_name}</p>
                                    <Link
                                        href={`/${order.engineer.username}`}
                                        className="text-sm text-[var(--accent)] hover:underline inline-flex items-center gap-1"
                                    >
                                        View Profile
                                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Payment Summary */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Payment Summary</h3>
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--text-gray)]">Service</span>
                                <span className="text-white font-medium">{order.service?.name || 'Service'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--text-gray)]">Turnaround</span>
                                <span className="text-white font-medium">{order.service?.turnaround_days || 7} days</span>
                            </div>
                            <div className="h-px bg-[var(--border-dark)] my-2" />
                            <div className="flex justify-between text-base font-bold">
                                <span className="text-white">Total Paid</span>
                                <span className="text-[var(--accent)]">${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            className="w-full py-2 bg-[var(--bg-elevated)] text-[var(--text-gray)] hover:text-white text-sm font-bold rounded-lg transition-colors"
                            aria-label="Download invoice for this order"
                        >
                            Download Invoice
                        </button>
                    </div>

                    {/* Estimated Delivery */}
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
                            <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
                                <Calendar className="w-4 h-4" aria-hidden="true" />
                                <span className="text-sm">Estimated Delivery</span>
                            </div>
                            <p className="text-white font-bold">
                                {estimatedDelivery.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    )}

                    {/* Need Help */}
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
                        <h3 className="font-medium text-white mb-2">Need Help?</h3>
                        <p className="text-sm text-[var(--text-muted)] mb-4">
                            If you have any questions about your order, our support team is here to help.
                        </p>
                        <a
                            href="mailto:support@mixexperts.com"
                            className="text-sm text-[var(--accent)] hover:underline"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
