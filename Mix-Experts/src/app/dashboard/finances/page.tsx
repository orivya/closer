'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, Download, ExternalLink, TrendingUp, CreditCard, ArrowUpRight, Search, Filter, Loader2, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dropdown } from '@/components/ui/Dropdown';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// TypeScript types
interface Invoice {
    id: string;
    orderNumber: string;
    date: string;
    client: string;
    project: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Overdue';
    paidAt: string | null;
}

export default function FinancesPage() {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [pendingPayout, setPendingPayout] = useState(0);

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
                        seller_payout,
                        status,
                        paid_at,
                        created_at,
                        profiles!orders_buyer_id_fkey(display_name)
                    `)
                    .eq('seller_id', user.id)
                    .in('status', ['paid', 'in_progress', 'revision_requested', 'revision_in_progress', 'pending_approval', 'completed'])
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching orders:', error);
                    setInvoices([]);
                    return;
                }

                // Transform orders to invoice format
                const transformedInvoices: Invoice[] = (data || []).map((order) => {
                    // Handle profiles which may be an object or array depending on the join
                    const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;

                    // Determine invoice status based on order status
                    let invoiceStatus: 'Paid' | 'Pending' | 'Overdue' = 'Pending';
                    if (order.status === 'completed' && order.paid_at) {
                        invoiceStatus = 'Paid';
                    } else if (order.status === 'paid' || order.status === 'in_progress' || order.status === 'revision_requested' || order.status === 'revision_in_progress' || order.status === 'pending_approval') {
                        invoiceStatus = 'Paid';
                    }

                    return {
                        id: order.id,
                        orderNumber: order.order_number || 'N/A',
                        date: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        client: profile?.display_name || 'Unknown Client',
                        project: order.service_name || 'Untitled Service',
                        amount: Number(order.seller_payout) || 0,
                        status: invoiceStatus,
                        paidAt: order.paid_at,
                    };
                });

                setInvoices(transformedInvoices);

                // Calculate total earnings (completed orders)
                const completed = transformedInvoices.filter(inv => inv.status === 'Paid');
                const total = completed.reduce((sum, inv) => sum + inv.amount, 0);
                setTotalEarnings(total);

                // Calculate pending payout (in progress but not completed)
                const pending = transformedInvoices.filter(inv => inv.status === 'Pending');
                const pendingTotal = pending.reduce((sum, inv) => sum + inv.amount, 0);
                setPendingPayout(pendingTotal);

            } catch (err) {
                console.error('Error:', err);
                setInvoices([]);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [user]);

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Finances</h1>
                    <p className="text-[var(--text-gray)]">Track your earnings, invoices, and payouts</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-colors shadow-lg shadow-purple-500/20">
                    <DollarSign className="w-4 h-4" />
                    Create Invoice
                </button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
                </div>
            )}

            {/* Overview Cards */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
                        <div className="flex items-center gap-3 text-[var(--text-muted)] mb-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">Total Earnings</span>
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="text-3xl font-bold text-white">${totalEarnings.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
                        <div className="flex items-center gap-3 text-[var(--text-muted)] mb-2">
                            <CreditCard className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">Pending Payout</span>
                        </div>
                        <div className="flex items-end justify-between w-full">
                            <span className="text-3xl font-bold text-white">${pendingPayout.toFixed(2)}</span>
                            <button className="text-xs font-bold text-[var(--accent)] hover:text-white transition-colors">
                                Payout Now
                            </button>
                        </div>
                    </div>
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6 flex flex-col justify-between">
                        <div className="flex items-center gap-3 text-[var(--text-muted)]">
                            <ExternalLink className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wider">Payout Method</span>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="w-10 h-6 bg-[#635BFF] rounded text-white flex items-center justify-center font-bold text-[10px] italic">
                                Stripe
                            </div>
                            <span className="text-sm text-white font-medium">•••• 4242</span>
                            <span className="ml-auto px-2 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded">Active</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && invoices.length === 0 && (
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-dark)]">
                        <h2 className="text-lg font-bold text-white">Recent Invoices</h2>
                    </div>
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-[var(--bg-base)] flex items-center justify-center mb-6">
                            <Receipt className="w-10 h-10 text-[var(--text-muted)]" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No invoices yet</h3>
                        <p className="text-[var(--text-gray)] mb-6 max-w-md">
                            When clients book your services and payments are processed, your invoices will appear here.
                        </p>
                    </div>
                </div>
            )}

            {/* Invoices Table */}
            {!loading && invoices.length > 0 && (
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-[var(--border-dark)] flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Recent Invoices</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                <input
                                    type="text"
                                    placeholder="Search invoices..."
                                    className="pl-9 pr-4 py-2 bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--accent)] w-64 transition-colors"
                                />
                            </div>
                            <button className="p-2 bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-lg text-[var(--text-muted)] hover:text-white transition-colors">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[var(--bg-base)] border-b border-[var(--border-dark)] text-left">
                                    <th className="px-6 py-4 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs">Order Number</th>
                                    <th className="px-6 py-4 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs">Date</th>
                                    <th className="px-6 py-4 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs">Client</th>
                                    <th className="px-6 py-4 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs">Project</th>
                                    <th className="px-6 py-4 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs">Amount</th>
                                    <th className="px-6 py-4 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs">Status</th>
                                    <th className="px-6 py-4 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-dark)]">
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-[var(--bg-hover)] transition-colors group">
                                        <td className="px-6 py-4 text-white font-medium font-mono">{invoice.orderNumber}</td>
                                        <td className="px-6 py-4 text-[var(--text-gray)]">{invoice.date}</td>
                                        <td className="px-6 py-4 text-white font-medium">{invoice.client}</td>
                                        <td className="px-6 py-4 text-[var(--text-gray)]">{invoice.project}</td>
                                        <td className="px-6 py-4 text-white font-bold">${invoice.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-xs font-bold border",
                                                invoice.status === 'Paid' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                                    invoice.status === 'Pending' ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                                                        "bg-red-500/10 text-red-400 border-red-500/20"
                                            )}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors p-2">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
