'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PricingTable = () => {
    const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

    return (
        <section className="py-24 bg-[var(--bg-base)]">
            <div className="max-w-[1400px] mx-auto px-6">
                {/* Toggle */}
                <div className="flex justify-center mb-16">
                    <div className="p-1.5 bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-full flex gap-1">
                        <button
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                                billingInterval === 'month'
                                    ? "bg-[var(--accent)] text-white shadow-lg"
                                    : "text-[var(--text-gray)] hover:text-white"
                            )}
                            onClick={() => setBillingInterval('month')}
                        >
                            Monthly
                        </button>
                        <button
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2",
                                billingInterval === 'year'
                                    ? "bg-[var(--accent)] text-white shadow-lg"
                                    : "text-[var(--text-gray)] hover:text-white"
                            )}
                            onClick={() => setBillingInterval('year')}
                        >
                            Yearly
                            <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">Save 20%</span>
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Free */}
                    <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-dark)] flex flex-col hover:border-[var(--accent-subtle)] transition-colors duration-300">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                            <p className="text-sm text-[var(--text-gray)] mb-6">Get started and test the platform with no monthly cost.</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">$0</span>
                                <span className="text-[var(--text-muted)]">/mo</span>
                            </div>
                            <p className="text-xs text-[var(--text-muted)] mt-1">Free forever</p>
                        </div>

                        <div className="border-t border-[var(--border-dark)] my-8"></div>

                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Basic Profile Page</span>
                            </li>
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">3 Portfolio Items</span>
                            </li>
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Accept Payments <span className="text-[var(--accent)] font-semibold">(10% platform fee)</span></span>
                            </li>
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Basic Booking</span>
                            </li>
                        </ul>
                        <Link href="/signup?plan=free" className="w-full py-4 rounded-xl border border-[var(--border-dark)] text-white font-semibold text-center hover:bg-white hover:text-[var(--bg-base)] transition-all duration-300">
                            Get Started Free
                        </Link>
                    </div>

                    {/* Starter */}
                    <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-dark)] flex flex-col hover:border-[var(--accent-subtle)] transition-colors duration-300">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                            <p className="text-sm text-[var(--text-gray)] mb-6">For engineers starting to build their client base.</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">${billingInterval === 'month' ? '19' : '15'}</span>
                                <span className="text-[var(--text-muted)]">/mo</span>
                            </div>
                            {billingInterval === 'year' && <p className="text-xs text-[var(--text-muted)] mt-1">Billed $180 yearly</p>}
                        </div>

                        <div className="border-t border-[var(--border-dark)] my-8"></div>

                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Professional Profile Page</span>
                            </li>
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">10 Portfolio Items (A/B Player)</span>
                            </li>
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Accept Payments <span className="text-green-400 font-semibold">(5% platform fee)</span></span>
                            </li>
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Basic Analytics</span>
                            </li>
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Email Support</span>
                            </li>
                        </ul>
                        <Link href="/signup?plan=starter" className="w-full py-4 rounded-xl border border-[var(--border-dark)] text-white font-semibold text-center hover:bg-white hover:text-[var(--bg-base)] transition-all duration-300">
                            Start Free Trial
                        </Link>
                    </div>

                    {/* Pro */}
                    <div className="p-8 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--accent)] relative shadow-[0_0_50px_-15px_var(--accent-subtle)] flex flex-col transform lg:-translate-y-4">
                        <div className="absolute top-0 right-0 px-5 py-1.5 bg-[var(--accent)] text-white text-xs font-bold uppercase tracking-wide rounded-bl-2xl rounded-tr-2xl">
                            Most Popular
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                            <p className="text-sm text-[rgba(255,255,255,0.7)] mb-6">For engineers ready to scale their business.</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">${billingInterval === 'month' ? '49' : '39'}</span>
                                <span className="text-[var(--text-muted)]">/mo</span>
                            </div>
                            {billingInterval === 'year' && <p className="text-xs text-[var(--text-muted)] mt-1">Billed $468 yearly</p>}
                        </div>

                        <div className="border-t border-[rgba(255,255,255,0.1)] my-8"></div>

                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm font-semibold">Everything in Starter</span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Unlimited Portfolio Items</span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm"><span className="text-green-400 font-semibold">0% Platform Fees</span></span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Custom Domain (yourname.com)</span>
                            </li>
                            <li className="flex items-start gap-3 text-white">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Priority Email Support</span>
                            </li>
                        </ul>
                        <Link href="/signup?plan=pro" className="w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-center hover:bg-[var(--accent-light)] transition-all duration-300 shadow-xl">
                            Get Started
                        </Link>
                    </div>

                    {/* Studio */}
                    <div className="p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-dark)] flex flex-col hover:border-[var(--accent-subtle)] transition-colors duration-300">
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">Studio</h3>
                            <p className="text-sm text-[var(--text-gray)] mb-6">For studio teams and high-volume professionals.</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">${billingInterval === 'month' ? '99' : '79'}</span>
                                <span className="text-[var(--text-muted)]">/mo</span>
                            </div>
                            {billingInterval === 'year' && <p className="text-xs text-[var(--text-muted)] mt-1">Billed $948 yearly</p>}
                        </div>

                        <div className="border-t border-[var(--border-dark)] my-8"></div>

                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm font-semibold">Everything in Pro</span>
                            </li>
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Priority 24/7 Support</span>
                            </li>
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Team Seats (3 included)</span>
                            </li>
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Advanced Analytics</span>
                            </li>
                            <li className="flex items-start gap-3 text-[var(--text-gray)]">
                                <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
                                <span className="text-sm">Client Portal (Coming Soon)</span>
                            </li>
                        </ul>
                        <a href="mailto:sales@mixexperts.com?subject=Studio%20Plan%20Inquiry" className="w-full py-4 rounded-xl border border-[var(--border-dark)] text-white font-semibold text-center hover:bg-white hover:text-[var(--bg-base)] transition-all duration-300 block">
                            Contact Sales
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
