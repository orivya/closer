'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { FeatureGrid } from '@/components/marketing/FeatureGrid';
import { PricingPreview } from '@/components/marketing/PricingPreview';
import { ProfileShowcase } from '@/components/marketing/ProfileShowcase';
import { Footer } from '@/components/profile/Footer';

export default function MarketingPage() {
  // Set default theme for marketing pages
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'amber');
  }, []);

  return (
    <main id="main-content" className="min-h-screen selection:bg-[var(--accent)] selection:text-white">
      <Navbar />

      <div className="relative z-10 p-0">
        <MarketingHero />
        <FeatureGrid />

        <ProfileShowcase />

        <PricingPreview />
        <div className="py-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to upgrade your workflow?</h2>
          <Link href="/signup" className="inline-flex items-center justify-center px-8 py-4 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all duration-300 shadow-xl">
            Start Your Free Trial
          </Link>
        </div>
      </div>

      <Footer isMarketingPage />
    </main>
  );
}
