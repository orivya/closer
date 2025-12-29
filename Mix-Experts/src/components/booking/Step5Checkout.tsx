'use client';

import React, { useState, useEffect } from 'react';
import { useBooking } from '@/context/BookingContext';
import { ShieldCheck, CreditCard, Loader2, CheckCircle2, ArrowLeft, User, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface TurnaroundOption {
    id: string;
    name: string;
    days: number;
    price_multiplier: number;
    is_default: boolean;
}

interface ServiceAddon {
    id: string;
    name: string;
    description: string;
    price: number;
}

export const Step5Checkout = () => {
    const { data, prevStep } = useBooking();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [turnaroundOptions, setTurnaroundOptions] = useState<TurnaroundOption[]>([]);
    const [addons, setAddons] = useState<ServiceAddon[]>([]);
    const [selectedTurnaroundId, setSelectedTurnaroundId] = useState<string | null>(null);

    // Client details for checkout
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');

    // Fetch turnaround options and addons for the selected service
    useEffect(() => {
        async function fetchServiceOptions() {
            if (!data.selectedServiceId) return;

            try {
                const response = await fetch(`/api/services/${data.selectedServiceId}/options`);
                if (!response.ok) {
                    throw new Error('Failed to fetch service options');
                }
                const result = await response.json();
                setTurnaroundOptions(result.turnaroundOptions || []);
                setAddons(result.addons || []);

                // Set default turnaround option
                const defaultOption = result.turnaroundOptions?.find((opt: TurnaroundOption) => opt.is_default);
                if (defaultOption) {
                    setSelectedTurnaroundId(defaultOption.id);
                }
            } catch (err) {
                console.error('Error fetching service options:', err);
            }
        }

        fetchServiceOptions();
    }, [data.selectedServiceId]);

    const handlePayment = async () => {
        // Validate client details
        if (!clientName.trim()) {
            setError('Please enter your name');
            return;
        }
        if (!clientEmail.trim() || !clientEmail.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
        if (!selectedTurnaroundId) {
            setError('Please select a turnaround option');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Call the checkout API to create a Stripe session
            const response = await fetch('/api/checkout/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: data.selectedServiceId,
                    turnaround_option_id: selectedTurnaroundId,
                    selected_addon_ids: data.selectedAddonIds || [],
                    client_name: clientName,
                    client_email: clientEmail,
                    project_details: `${data.projectTitle} - ${data.artistName}\n${data.description}`,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create checkout session');
            }

            // Redirect to Stripe Checkout
            if (result.url) {
                window.location.href = result.url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
            setIsProcessing(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-12">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                >
                    <CheckCircle2 className="w-20 h-20 text-[var(--accent)] mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h2>
                    <p className="text-[var(--text-gray)] mb-8">We've sent a confirmation email to you.</p>
                    <Link href="/dashboard/client/orders" className="px-8 py-3 bg-[var(--accent)] text-white font-bold rounded-xl shadow-lg hover:bg-[var(--accent-light)] transition-colors">
                        View Order Status
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Review & Pay</h2>
                <p className="text-[var(--text-gray)]">Secure checkout powered by Stripe.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6 space-y-6">
                    <h3 className="font-bold text-white border-b border-[var(--border-dark)] pb-4">Order Summary</h3>

                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-white text-lg">Service</p>
                            <p className="text-sm text-[var(--text-muted)]">{data.projectTitle} - {data.artistName}</p>
                        </div>
                        <span className="font-bold text-white">${data.basePrice}</span>
                    </div>

                    {turnaroundOptions.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Turnaround Time
                            </label>
                            <select
                                value={selectedTurnaroundId || ''}
                                onChange={(e) => setSelectedTurnaroundId(e.target.value)}
                                className="w-full bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)]"
                            >
                                {turnaroundOptions.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.name} - {option.days} days
                                        {option.price_multiplier !== 1 && ` (${option.price_multiplier}x)`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="border-t border-[var(--border-dark)] pt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-white">Total</span>
                        <span className="text-2xl font-bold text-[var(--accent)]">${data.basePrice}</span>
                    </div>
                </div>

                {/* Client Details & Payment */}
                <div className="space-y-6">
                    {/* Client Details Form */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-5 h-5 text-[var(--accent)]" />
                            <span className="font-bold text-white">Your Details</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--accent)]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                    <input
                                        type="email"
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="w-full bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--accent)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="w-5 h-5 text-[var(--accent)]" />
                            <span className="font-bold text-white">Payment</span>
                        </div>
                        <p className="text-sm text-[var(--text-gray)]">
                            You'll be redirected to Stripe's secure checkout to complete your payment.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] justify-center">
                        <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
                        <span>256-bit SSL Encrypted Payment</span>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={prevStep}
                            className="px-6 py-3 bg-[var(--bg-card)] text-[var(--text-muted)] font-bold rounded-xl hover:bg-[var(--bg-elevated)] hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="flex-1 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_var(--accent-glow)] disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Proceed to Payment"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
