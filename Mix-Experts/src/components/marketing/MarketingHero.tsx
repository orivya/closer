'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MarketingHero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 overflow-hidden bg-[var(--bg-base)]">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                < div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--accent)] opacity-[0.02] blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-16 items-center">
                <div className="flex flex-col gap-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] w-fit backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                        <span className="text-xs font-semibold tracking-wide uppercase text-[var(--accent)]">
                            The Platform for Audio Professionals
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                        Build Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[var(--text-gray)]">
                            Dream Studio
                        </span> <br />
                        <span className="text-[var(--accent)]">Business</span>
                    </h1>

                    <p className="text-lg md:text-xl text-[var(--text-gray)] max-w-xl leading-relaxed">
                        The all-in-one platform for mix engineers, producers, and mastering studios.
                        Showcase your work, book sessions, and sell digital products—all in one place.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_20px_-5px_var(--accent-glow)]"
                        >
                            Start Free Trial
                            <ArrowRight className="w-5 h-5" />
                        </Link>

                        <Link
                            href="/pricing"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[rgba(255,255,255,0.05)] text-white font-semibold rounded-xl border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            See Pricing
                        </Link>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-[var(--text-muted)] mt-4">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[var(--accent)]" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[var(--accent)]" />
                            <span>14-day free trial</span>
                        </div>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="relative hidden lg:block">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--border-dark)] bg-[var(--bg-card)] shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700 ease-out">
                        {/* Mock UI: Profile Header */}
                        <div className="h-full bg-[var(--bg-card)] p-1">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(201,149,108,0.1)] via-transparent to-transparent z-10 pointers-events-none"></div>
                            <img
                                src="https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1200&auto=format&fit=crop"
                                alt="Platform Interface"
                                className="w-full h-full object-cover rounded-xl opacity-90"
                            />

                            {/* Floating UI Cards */}
                            <div className="absolute top-10 -right-10 bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border-dark)] shadow-xl z-20 w-64 backdrop-blur-md">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-[var(--text-gray)]">Monthly Revenue</span>
                                    <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">+12%</span>
                                </div>
                                <div className="text-2xl font-bold text-white">$4,250.00</div>
                            </div>

                            <div className="absolute bottom-10 -left-10 bg-[var(--bg-elevated)] p-4 rounded-xl border border-[var(--border-dark)] shadow-xl z-20 w-64 backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <Play className="w-4 h-4 fill-current" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-[var(--text-gray)]">New Booking</div>
                                        <div className="text-sm font-bold text-white">Full Mix • Track 04</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
