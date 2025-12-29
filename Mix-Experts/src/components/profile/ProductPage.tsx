'use client';

import React from 'react';
import { Check, Star, Download, Play, Monitor, Cpu } from 'lucide-react';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ProductPageProps {
    onBack?: () => void;
    product: Product;
    username?: string;
}

export const ProductPage: React.FC<ProductPageProps> = ({ onBack, product, username }) => {
    // If username is provided, use Link for "Back to Shop". Otherwise fallback to onBack.
    const backLink = username ? `/${username}` : null;

    React.useEffect(() => {
        document.title = `${product.title} | James Mix Audio`;
        return () => {
            document.title = 'James Mix — Audio Engineer';
        };
    }, [product]);

    return (
        <div className="pt-24 min-h-screen bg-[var(--bg-base)] animate-in fade-in duration-500">

            {/* Breadcrumb */}
            <div className="max-w-[1200px] mx-auto px-6 mb-8">
                {backLink ? (
                    <Link href={backLink} className="text-sm text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-2">
                        ← Back to Shop
                    </Link>
                ) : (
                    <button onClick={onBack} className="text-sm text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-2">
                        ← Back to Shop
                    </button>
                )}
            </div>

            <div className="max-w-[1200px] mx-auto px-6 grid lg:grid-cols-[1.5fr_1fr] gap-12 mb-24">
                {/* Left Column: Visuals & Media */}
                <div className="space-y-8">
                    <div className="aspect-square rounded-3xl overflow-hidden border border-[var(--border-dark)] bg-[var(--bg-card)] relative group">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Video Demo Section */}
                    <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-1 overflow-hidden">
                        <div className="aspect-video bg-[var(--bg-card)] rounded-xl relative flex items-center justify-center group cursor-pointer">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 fill-current ml-1" />
                            </div>
                            <div className="absolute bottom-4 left-4 text-sm font-bold text-white">Watch Walkthrough</div>
                        </div>
                    </div>

                    {/* Detailed Description */}
                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-2xl font-bold text-white mb-4">Description</h3>
                        <p className="text-[var(--text-gray)] leading-relaxed mb-6">
                            Stop wasting time setting up your sessions. This template is designed to get you recording immediately with industry-standard vocal chains pre-loaded.
                            Engineered with stock plugins to ensure compatibility, but routed like a major label session.
                        </p>
                        <h3 className="text-xl font-bold text-white mb-4">What&apos;s Inside</h3>
                        <ul className="grid grid-cols-1 gap-3">
                            {[
                                "Lead Vocal Chain (EQ, Comp, Saturation)",
                                "Ad-Lib & Dub Processing",
                                "Reverb & Delay Sends",
                                "Mastering Chain for Quick Bounces"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-[var(--text-gray)]">
                                    <Check className="w-5 h-5 text-[var(--accent)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Buying Info (Sticky) */}
                <div className="lg:sticky lg:top-32 h-fit">
                    <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-3xl p-8 shadow-2xl">
                        <div className="text-[var(--accent)] font-bold uppercase tracking-wider text-xs mb-2">{product.type}</div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{product.title}</h1>

                        <div className="flex items-end gap-4 mb-8">
                            <div className="text-4xl font-bold text-white">{product.price}</div>
                            <div className="text-[var(--text-muted)] line-through mb-1.5">$59</div>
                        </div>

                        <button className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-colors shadow-[0_4px_20px_var(--accent-glow)] flex items-center justify-center gap-2 mb-4">
                            Add to Cart
                        </button>

                        <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-gray)] mb-8">
                            <Download className="w-4 h-4" />
                            <span>Instant Digital Download</span>
                        </div>

                        {/* Specs Accordion */}
                        <div className="space-y-3">
                            <div className="bg-[var(--bg-base)] rounded-xl p-4 border border-[var(--border-dark)]">
                                <div className="flex items-center gap-3 mb-2 text-white font-semibold">
                                    <Monitor className="w-4 h-4 text-[var(--text-muted)]" />
                                    System Requirements
                                </div>
                                <div className="text-sm text-[var(--text-muted)] ml-7">
                                    Works with Logic Pro X 10.5+ <br />
                                    macOS 11.0 or later
                                </div>
                            </div>
                            <div className="bg-[var(--bg-base)] rounded-xl p-4 border border-[var(--border-dark)]">
                                <div className="flex items-center gap-3 mb-2 text-white font-semibold">
                                    <Cpu className="w-4 h-4 text-[var(--text-muted)]" />
                                    Plugins Used
                                </div>
                                <div className="text-sm text-[var(--text-muted)] ml-7">
                                    100% Stock Plugins. No 3rd party required.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Preview */}
                    <div className="mt-8 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-[var(--accent)]">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <span className="text-white font-bold">4.9/5</span>
                            <span className="text-[var(--text-muted)] text-sm">(124 Reviews)</span>
                        </div>
                        <p className="text-sm text-[var(--text-gray)] italic">&quot;This template saved me hours of mixing time. The vocal presets sound professional right out of the box.&quot;</p>
                        <div className="mt-2 text-xs text-[var(--text-muted)] font-bold">- Jordan M.</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

