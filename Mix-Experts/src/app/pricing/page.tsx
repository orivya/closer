'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { PricingTable } from '@/components/marketing/PricingTable';
import { PricingFAQ } from '@/components/marketing/PricingFAQ';
import { Footer } from '@/components/profile/Footer';
import { Navbar } from '@/components/layout/Navbar';

export default function PricingPage() {
    // Set default theme for marketing pages
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'amber');
    }, []);

    return (
        <main className="min-h-screen selection:bg-[var(--accent)] selection:text-white">
            <Navbar />

            <div className="relative z-10 pt-20">
                <div className="py-20 text-center px-6">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-[var(--text-gray)] max-w-2xl mx-auto">
                        Start for free. Upgrade as you grow. No hidden fees.
                    </p>
                </div>

                <PricingTable />
                <PricingFAQ />

                <div className="py-24 bg-[var(--bg-elevated)] text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Still have questions?</h2>
                    <Link href="mailto:support@mixexperts.com" className="inline-flex items-center justify-center px-8 py-4 border border-[var(--border-dark)] text-white font-semibold rounded-xl hover:bg-white hover:text-[var(--bg-base)] transition-all duration-300">
                        Contact Support
                    </Link>
                </div>
            </div>

            <Footer isMarketingPage />
        </main>
    );
}
