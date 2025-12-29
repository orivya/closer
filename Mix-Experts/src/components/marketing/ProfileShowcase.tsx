'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Pause, Check, ArrowRight, Star } from 'lucide-react';

export const ProfileShowcase = () => {
    return (
        <section className="py-24 bg-[var(--bg-base)] border-t border-[var(--border-dark)] relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Text Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 mb-6">
                            <span className="px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold uppercase tracking-wider border border-[var(--accent)]/20">
                                Client Experience
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Tools that turn <br />
                            <span className="text-[var(--accent)]">Visitors into Clients</span>
                        </h2>
                        <p className="text-lg text-[var(--text-gray)] mb-8 leading-relaxed">
                            Your profile isn't just a portfolio—it's a sales machine. With built-in A/B comparators and instant booking configurations, you give artists every reason to hire you.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-dark)]">
                                <div className="p-3 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Premium Presentation</h4>
                                    <p className="text-sm text-[var(--text-gray)]">Glassmorphic design that screams "Professional".</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-dark)]">
                                <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
                                    <Play className="w-5 h-5 fill-current" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">Lossless Streaming</h4>
                                    <p className="text-sm text-[var(--text-gray)]">High-fidelity audio demos with no compression artifacts.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: The "Cards" Showcase */}
                    <div className="relative">
                        {/* Abstract Background Blobs */}
                        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[var(--accent)]/10 blur-[100px] rounded-full"></div>

                        <div className="grid gap-6 relative z-10">

                            {/* Card 1: Mini Audio Player */}
                            <div className="p-6 bg-[rgba(20,20,23,0.8)] border border-[var(--border-dark)] rounded-3xl backdrop-blur-xl shadow-2xl transform translate-y-4 hover:-translate-y-0 transition-transform duration-500">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-card)] flex items-center justify-center text-[var(--accent)]">
                                            <Play className="w-5 h-5 fill-current" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">Before & After</div>
                                            <div className="text-xs text-[var(--text-muted)]">Audio Comparison</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 rounded bg-black/40 text-[10px] text-[var(--text-gray)] font-bold">RAW</span>
                                        <span className="px-2 py-1 rounded bg-[var(--accent)] text-[10px] text-white font-bold">MIXED</span>
                                    </div>
                                </div>
                                {/* Waveform Sim - using deterministic values to avoid hydration mismatch */}
                                <div className="flex items-center gap-1 h-8 mb-4 opacity-70">
                                    {[45, 72, 38, 91, 55, 28, 84, 62, 33, 78, 47, 89, 52, 35, 76, 41, 68, 29, 85, 57, 43, 92, 36, 71, 48, 83, 54, 39, 77, 61].map((height, i) => (
                                        <div key={i} className="flex-1 bg-[var(--accent)] rounded-full" style={{ height: `${height}%`, opacity: i % 2 === 0 ? 1 : 0.4 }}></div>
                                    ))}
                                </div>
                            </div>

                            {/* Card 2: Mini Service Card */}
                            <div className="p-6 bg-[rgba(20,20,23,0.9)] border border-[var(--border-dark)] rounded-3xl backdrop-blur-xl shadow-2xl ml-12 transform -translate-y-4 hover:translate-y-0 transition-transform duration-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Full Mix & Master</h3>
                                        <div className="text-[var(--accent)] font-bold">$350.00</div>
                                    </div>
                                    <div className="p-2 rounded-full bg-[var(--accent)] text-white">
                                        <Check className="w-4 h-4" />
                                    </div>
                                </div>
                                <ul className="space-y-2 mb-4">
                                    <li className="text-xs text-[var(--text-gray)] flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-[var(--accent)]"></div>
                                        Unlimited Revisions
                                    </li>
                                    <li className="text-xs text-[var(--text-gray)] flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-[var(--accent)]"></div>
                                        48hr Turnaround
                                    </li>
                                </ul>
                                <Link href="/signup" className="block w-full py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-[var(--accent)] hover:text-white transition-colors text-center">
                                    Book Now
                                </Link>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
