'use client';

import React, { useEffect } from 'react';
import { FeaturesHero } from '@/components/marketing/FeaturesHero';
import { FeatureDeepDive } from '@/components/marketing/FeatureDeepDive';
import { Footer } from '@/components/profile/Footer';
import { Navbar } from '@/components/layout/Navbar';
import Link from 'next/link';

export default function FeaturesPage() {
    // Set default theme for marketing pages
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'amber');
    }, []);

    return (
        <main className="min-h-screen bg-[var(--bg-base)] selection:bg-[var(--accent)] selection:text-white">
            <Navbar />

            <FeaturesHero />

            <div className="space-y-0">
                <FeatureDeepDive
                    badge="Audio Engine"
                    title="High-Fidelity Project Management"
                    description="Upload, share, and manage high-resolution audio files without compression artifacts. Our player is built for critical listening."
                    benefits={[
                        "Lossless file support (WAV, FLAC, AIFF)",
                        "Version control for mix revisions",
                        "Time-stamped comments for precise feedback",
                        "Secure, private download links"
                    ]}
                    align="left"
                />

                <FeatureDeepDive
                    badge="Bookings & Payments"
                    title="Get Paid, Not Played"
                    description="Integrated deposits, milestone payments, and automated invoicing. Keep your focus on the mix, not chasing clients for money."
                    benefits={[
                        "50% upfront deposit protection",
                        "Secure Stripe integration",
                        "Automated invoice generation",
                        "Multi-currency support"
                    ]}
                    align="right"
                />

                <FeatureDeepDive
                    badge="Client Portal"
                    title="A Professional Home for Your Clients"
                    description="Give your clients a dedicated dashboard to view progress, upload files, and communicate. No more scattered email threads."
                    benefits={[
                        "Custom branded experience",
                        "Drag-and-drop file sharing",
                        "Real-time chat messaging",
                        "Mobile-friendly interface"
                    ]}
                    align="left"
                />
            </div>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--accent)]/5" />
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to upgrade your studio business?</h2>
                    <p className="text-xl text-[var(--text-gray)] mb-10">Join thousands of audio engineers managing their career with MixExperts.</p>
                    <Link href="/signup" className="inline-flex items-center justify-center px-8 py-4 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(124,58,237,0.3)]">
                        Start Your Free Trial
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
