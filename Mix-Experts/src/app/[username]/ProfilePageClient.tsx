'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/profile/Navigation';
import { Hero } from '@/components/profile/Hero';
import { Services } from '@/components/profile/Services';
import { AudioDemo } from '@/components/profile/AudioDemo';
import { Workflow } from '@/components/profile/Workflow';
import { Products } from '@/components/profile/Products';
import { Portfolio } from '@/components/profile/Portfolio';
import { Testimonials } from '@/components/profile/Testimonials';
import { About } from '@/components/profile/About';
import { FAQ } from '@/components/profile/FAQ';
import { Assistant } from '@/components/profile/Assistant';
import { FinalCTA } from '@/components/profile/FinalCTA';
import { Footer } from '@/components/profile/Footer';
import { ThemeSwitcher } from '@/components/profile/ThemeSwitcher';
import { BookingSection } from '@/components/profile/BookingSection';
import { MobileTabBar } from '@/components/profile/MobileTabBar';
import { ThemeName } from '@/lib/types';
import {
    ProfileData,
    ServiceDisplayData,
    PortfolioItemData,
    TestimonialData,
    FAQData,
} from '@/lib/profile-data';

interface ProfilePageClientProps {
    username: string;
    initialProfile: ProfileData;
    initialServices: ServiceDisplayData[];
    initialPortfolio: PortfolioItemData[];
    initialTestimonials: TestimonialData[];
    initialFaqs: FAQData[];
    initialProducts: any[];
}

export default function ProfilePageClient({
    username,
    initialProfile,
    initialServices,
    initialPortfolio,
    initialTestimonials,
    initialFaqs,
    initialProducts,
}: ProfilePageClientProps) {
    const [currentTheme, setCurrentTheme] = useState<ThemeName>('amber');

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, [currentTheme]);

    return (
        <main className="min-h-screen selection:bg-[var(--accent)] selection:text-white">
            <Navbar username={username} profile={initialProfile} />

            <div className="relative z-10 p-0">
                <Hero profile={initialProfile} />
                <Services username={username} services={initialServices} />
                <Assistant username={username} />
                <AudioDemo />
                <Workflow />
                <Products products={initialProducts} username={username} />
                <Portfolio portfolioItems={initialPortfolio} />
                <BookingSection profile={initialProfile} services={initialServices} />
                <Testimonials testimonials={initialTestimonials} />
                <About profile={initialProfile} />
                <FAQ faqs={initialFaqs} />
                <FinalCTA profile={initialProfile} />
            </div>

            <Footer username={username} profile={initialProfile} />
            <MobileTabBar username={username} />
            <ThemeSwitcher currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
        </main>
    );
}
