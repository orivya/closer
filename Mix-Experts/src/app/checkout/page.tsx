'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Lock, User, LogIn, CreditCard, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TermsModal } from '@/components/checkout/TermsModal';
import { TurnaroundSelector, TurnaroundOption, TurnaroundOptionType } from '@/components/checkout/TurnaroundSelector';
import { AddOnSelector, AddOn } from '@/components/checkout/AddOnSelector';

const BASE_PRICE = 150;

const TURNAROUND_OPTIONS: TurnaroundOption[] = [
    { id: 'standard', name: 'Standard', days: '5-7 Days', price: 0 },
    { id: 'rush', name: 'Rush', days: '2-3 Days', price: 75, multiplier: 1.5 },
    { id: 'priority', name: 'Priority', days: '24 Hours', price: 150, multiplier: 2.0 },
];

const AVAILABLE_ADDONS: AddOn[] = [
    { id: '1', name: 'Extra Revision', price: 25, description: 'One additional round of changes' },
    { id: '2', name: 'Vocal Tuning', price: 50, description: 'Natural pitch correction' },
    { id: '3', name: 'Stems Export', price: 30, description: 'Separate audio files for all tracks' },
];

export default function CheckoutPage() {
    const [mode, setMode] = useState<'guest' | 'login'>('guest');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    // Order Configuration State
    const [turnaround, setTurnaround] = useState<TurnaroundOptionType>('standard');
    const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
    const [total, setTotal] = useState(BASE_PRICE);

    // Calculate Total
    useEffect(() => {
        let newTotal = BASE_PRICE;

        // Add Turnaround cost
        const turnaroundOption = TURNAROUND_OPTIONS.find(t => t.id === turnaround);
        if (turnaroundOption) newTotal += turnaroundOption.price;

        // Add Add-ons cost
        selectedAddOns.forEach(id => {
            const addon = AVAILABLE_ADDONS.find(a => a.id === id);
            if (addon) newTotal += addon.price;
        });

        // Add Product (fixed)
        newTotal += 29.99; // Deep House Presets

        setTotal(newTotal);
    }, [turnaround, selectedAddOns]);

    const handleToggleAddOn = (id: string) => {
        setSelectedAddOns(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleAcceptTerms = () => {
        setAgreedToTerms(true);
        setShowTerms(false);
    };

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        setIsSuccess(true);
        // In a real app, redirection would happen here
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center space-y-6 max-w-md mx-auto animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-bold text-white">Order Confirmed!</h1>
                    <p className="text-[var(--text-gray)] text-lg">
                        Thank you for your purchase. Your engineer has been notified and will be in touch shortly.
                    </p>
                    <div className="pt-6">
                        <Link href="/dashboard/projects" className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-12 pb-12 px-6">
            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAccept={handleAcceptTerms}
                termsContent="By continuing, you agree to the specific terms set by the engineer as well as the platform's standard usage policy..."
            />

            <div className="max-w-6xl mx-auto mb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-[var(--text-gray)] hover:text-white transition-colors mb-4">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to Studio
                </Link>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left Column: Checkout Flow */}
                <div className="lg:col-span-7 space-y-8">

                    <h1 className="text-3xl font-bold text-white">Checkout</h1>

                    {/* Step 1: Authentication */}
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6 space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold">1</div>
                            <h2 className="text-xl font-bold text-white">Account Details</h2>
                        </div>

                        {/* Toggle */}
                        <div className="flex p-1 bg-[var(--bg-base)] rounded-xl border border-[var(--border-dark)] w-fit">
                            <button
                                onClick={() => setMode('guest')}
                                className={cn(
                                    "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                                    mode === 'guest' ? "bg-[var(--bg-elevated)] text-white shadow-sm" : "text-[var(--text-gray)] hover:text-white"
                                )}
                            >
                                Checkout as Guest
                            </button>
                            <button
                                onClick={() => setMode('login')}
                                className={cn(
                                    "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                                    mode === 'login' ? "bg-[var(--bg-elevated)] text-white shadow-sm" : "text-[var(--text-gray)] hover:text-white"
                                )}
                            >
                                Log In
                            </button>
                        </div>

                        {/* Forms */}
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            {mode === 'guest' ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase">First Name</label>
                                            <input type="text" className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Last Name</label>
                                            <input type="text" className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Email Address</label>
                                        <input type="email" className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none" />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Email</label>
                                        <input type="email" className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Password</label>
                                        <input type="password" className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 2: Order Configuration */}
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6 space-y-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-bold">2</div>
                            <h2 className="text-xl font-bold text-white">Customize Order</h2>
                        </div>

                        <TurnaroundSelector
                            options={TURNAROUND_OPTIONS}
                            selectedId={turnaround}
                            onSelect={setTurnaround}
                        />

                        <div className="h-px bg-[var(--border-dark)]" />

                        <AddOnSelector
                            addOns={AVAILABLE_ADDONS}
                            selectedIds={selectedAddOns}
                            onToggle={handleToggleAddOn}
                        />
                    </div>

                    {/* Step 3: Payment */}
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6 opacity-80">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-[var(--bg-base)] border border-[var(--border-dark)] flex items-center justify-center text-[var(--text-gray)] font-bold">3</div>
                            <h2 className="text-xl font-bold text-[var(--text-gray)]">Payment Method</h2>
                        </div>
                        <div className="p-4 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl flex items-center gap-4 text-[var(--text-muted)]">
                            <CreditCard className="w-5 h-5" />
                            <span>Card details will be entered via Stripe Secure Fields</span>
                        </div>
                    </div>

                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>

                        <div className="space-y-4 mb-6">
                            {/* Base Service */}
                            <div className="flex justify-between items-start pb-4 border-b border-[var(--border-dark)]">
                                <div>
                                    <div className="font-bold text-white text-sm">Standard Mixing</div>
                                    <div className="text-xs text-[var(--text-muted)]">Service Base Price</div>
                                </div>
                                <div className="font-bold text-white text-sm">${BASE_PRICE.toFixed(2)}</div>
                            </div>

                            {/* Turnaround Upsell */}
                            {turnaround !== 'standard' && (
                                <div className="flex justify-between items-start pb-4 border-b border-[var(--border-dark)]">
                                    <div>
                                        <div className="font-bold text-white text-sm">{TURNAROUND_OPTIONS.find(t => t.id === turnaround)?.name} Turnaround</div>
                                        <div className="text-xs text-[var(--text-muted)]">Expedited Delivery</div>
                                    </div>
                                    <div className="font-bold text-white text-sm">+${TURNAROUND_OPTIONS.find(t => t.id === turnaround)?.price}</div>
                                </div>
                            )}

                            {/* Add-Ons Upsell */}
                            {selectedAddOns.map(id => {
                                const addon = AVAILABLE_ADDONS.find(a => a.id === id);
                                if (!addon) return null;
                                return (
                                    <div key={id} className="flex justify-between items-start pb-4 border-b border-[var(--border-dark)]">
                                        <div>
                                            <div className="font-bold text-white text-sm">{addon.name}</div>
                                            <div className="text-xs text-[var(--text-muted)]">Add-On</div>
                                        </div>
                                        <div className="font-bold text-white text-sm">+${addon.price}</div>
                                    </div>
                                );
                            })}

                            {/* Fixed Product (Cart Item) */}
                            <div className="flex justify-between items-start pb-4 border-b border-[var(--border-dark)]">
                                <div>
                                    <div className="font-bold text-white text-sm">Deep House Presets</div>
                                    <div className="text-xs text-[var(--text-muted)]">Product</div>
                                </div>
                                <div className="font-bold text-white text-sm">$29.99</div>
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-[var(--border-dark)] mb-6">
                            <div className="flex justify-between text-sm text-[var(--text-gray)]">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-[var(--text-gray)]">
                                <span>Service Fee</span>
                                <span>$0.00</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-white pt-2">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-[var(--border-dark)] bg-[var(--bg-base)] text-[var(--accent)] focus:ring-0 checked:bg-[var(--accent)] transition-all"
                                />
                                <span className="text-sm text-[var(--text-muted)] leading-tight">
                                    I agree to the <button onClick={(e) => { e.preventDefault(); setShowTerms(true); }} className="text-[var(--accent)] hover:underline font-medium">Terms of Service</button> and Privacy Policy.
                                </span>
                            </label>

                            <button
                                disabled={!agreedToTerms || isProcessing}
                                onClick={handlePayment}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                                    agreedToTerms && !isProcessing
                                        ? "bg-[var(--accent)] text-white shadow-[0_0_20px_var(--accent-glow)] hover:scale-[1.02]"
                                        : "bg-[var(--bg-base)] text-[var(--text-muted)] cursor-not-allowed"
                                )}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        Pay ${total.toFixed(2)}
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-1">
                                <Lock className="w-3 h-3" /> Secure SSL Encryption
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
