'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export const PricingPreview = () => {
    return (
        <section className="py-32 bg-[var(--bg-card)] border-y border-[var(--border-dark)]">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Simple, Transparent <br /> <span className="text-[var(--accent)]">Pricing</span></h2>
                        <p className="text-lg text-[var(--text-gray)]">
                            Start with a free 14-day trial. No credit card required. Cancel anytime.
                        </p>
                    </div>
                    <Link href="/pricing" className="hidden md:flex items-center gap-2 text-white font-semibold hover:text-[var(--accent)] transition-colors">
                        View Full Pricing
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {/* Free Tier */}
                    <div className="p-6 rounded-3xl bg-[var(--bg-base)] border border-[var(--border-dark)] flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-white mb-2">Free</h3>
                            <div className="text-2xl font-bold text-white">$0<span className="text-sm font-normal text-[var(--text-muted)]">/mo</span></div>
                        </div>
                        <ul className="space-y-3 mb-6 flex-grow">
                            <li className="flex items-center gap-2 text-[var(--text-gray)] text-sm"><Check className="w-4 h-4 text-[var(--accent)]" /> Basic Profile</li>
                            <li className="flex items-center gap-2 text-[var(--text-gray)] text-sm"><Check className="w-4 h-4 text-[var(--accent)]" /> 3 Portfolio Items</li>
                            <li className="flex items-center gap-2 text-[var(--text-gray)] text-sm"><Check className="w-4 h-4 text-[var(--accent)]" /> <span>10% Platform Fee</span></li>
                        </ul>
                        <Link href="/signup?plan=free" className="w-full py-3 rounded-xl border border-[var(--border-dark)] text-white font-semibold text-center text-sm hover:bg-white hover:text-[var(--bg-base)] transition-all duration-300">
                            Get Started
                        </Link>
                    </div>

                    {/* Starter Tier */}
                    <div className="p-6 rounded-3xl bg-[var(--bg-base)] border border-[var(--border-dark)] flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-white mb-2">Starter</h3>
                            <div className="text-2xl font-bold text-white">$19<span className="text-sm font-normal text-[var(--text-muted)]">/mo</span></div>
                        </div>
                        <ul className="space-y-3 mb-6 flex-grow">
                            <li className="flex items-center gap-2 text-[var(--text-gray)] text-sm"><Check className="w-4 h-4 text-[var(--accent)]" /> Professional Profile</li>
                            <li className="flex items-center gap-2 text-[var(--text-gray)] text-sm"><Check className="w-4 h-4 text-[var(--accent)]" /> 10 Portfolio Items</li>
                            <li className="flex items-center gap-2 text-[var(--text-gray)] text-sm"><Check className="w-4 h-4 text-green-400" /> <span className="text-green-400">5% Platform Fee</span></li>
                        </ul>
                        <Link href="/signup?plan=starter" className="w-full py-3 rounded-xl border border-[var(--border-dark)] text-white font-semibold text-center text-sm hover:bg-white hover:text-[var(--bg-base)] transition-all duration-300">
                            Start Trial
                        </Link>
                    </div>

                    {/* Pro Tier (Featured) */}
                    <div className="p-6 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--accent)] relative shadow-[0_0_40px_-10px_var(--accent-subtle)] flex flex-col transform md:-translate-y-4">
                        <div className="absolute top-0 right-0 px-3 py-1 bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-wide rounded-bl-xl rounded-tr-2xl">
                            Popular
                        </div>
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-white mb-2">Pro</h3>
                            <div className="text-2xl font-bold text-white">$49<span className="text-sm font-normal text-[var(--text-muted)]">/mo</span></div>
                        </div>
                        <ul className="space-y-3 mb-6 flex-grow">
                            <li className="flex items-center gap-2 text-white text-sm"><Check className="w-4 h-4 text-[var(--accent)]" /> Everything in Starter</li>
                            <li className="flex items-center gap-2 text-white text-sm"><Check className="w-4 h-4 text-[var(--accent)]" /> Unlimited Portfolio</li>
                            <li className="flex items-center gap-2 text-white text-sm"><Check className="w-4 h-4 text-green-400" /> <span className="text-green-400 font-semibold">0% Platform Fee</span></li>
                        </ul>
                        <Link href="/signup?plan=pro" className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-bold text-center text-sm hover:bg-[var(--accent-light)] transition-all duration-300">
                            Get Started
                        </Link>
                    </div>

                    {/* Studio Tier */}
                    <div className="p-6 rounded-3xl bg-[var(--bg-base)] border border-[var(--border-dark)] flex flex-col">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-white mb-2">Studio</h3>
                            <div className="text-2xl font-bold text-white">$99<span className="text-sm font-normal text-[var(--text-muted)]">/mo</span></div>
                        </div>
                        <ul className="space-y-3 mb-6 flex-grow">
                            <li className="flex items-center gap-2 text-[var(--text-gray)] text-sm"><Check className="w-4 h-4 text-[var(--accent)]" /> Everything in Pro</li>
                            <li className="flex items-center gap-2 text-[var(--text-gray)] text-sm"><Check className="w-4 h-4 text-[var(--accent)]" /> 24/7 Support</li>
                            <li className="flex items-center gap-2 text-[var(--text-gray)] text-sm"><Check className="w-4 h-4 text-[var(--accent)]" /> Team Seats</li>
                        </ul>
                        <a href="mailto:sales@mixexperts.com?subject=Studio%20Plan%20Inquiry" className="w-full py-3 rounded-xl border border-[var(--border-dark)] text-white font-semibold text-center text-sm hover:bg-white hover:text-[var(--bg-base)] transition-all duration-300 block">
                            Contact Sales
                        </a>
                    </div>
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/pricing" className="inline-flex items-center gap-2 text-white font-semibold hover:text-[var(--accent)] transition-colors">
                        View Full Pricing
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
};
