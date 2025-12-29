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
// Theme switcher is inlined in this demo page for better control
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

// Demo profile data - James Mix
const DEMO_PROFILE: ProfileData = {
    id: 'demo-user-id',
    username: 'jamesmix',
    display_name: 'James Mix',
    email: 'james@mixexperts.com',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
    banner_url: null,
    bio: 'I help independent artists and labels craft a signature sound that cuts through the noise. Precision mixing and mastering for the modern era.',
    tagline: 'Sonic. Identity.',
    location: 'Los Angeles, CA',
    timezone: 'America/Los_Angeles',
    role: 'artist',
    is_published: true,
    is_verified: true,
    subscription_tier: 'pro',
    created_at: '2023-01-01',
    years_experience: 15,
    total_streams: '500M+',
    social_links: {
        instagram: 'https://instagram.com/jamesmix',
        twitter: 'https://twitter.com/jamesmix',
        youtube: 'https://youtube.com/@jamesmix',
        spotify: 'https://open.spotify.com/artist/example',
    },
};

const DEMO_SERVICES: ServiceDisplayData[] = [
    {
        id: 'service-1',
        title: 'Mixing',
        price: 'Starting at $150',
        description: 'Professional mixing for your tracks. From 2-track vocal mixes to full multi-track sessions with unlimited stems.',
        turnaround: '2-5 Days',
        features: ['Vocal Tuning & Timing', 'EQ, Compression, Effects', 'Stem-based Pricing', 'Multiple Revisions', 'Radio-Ready Quality'],
        slug: 'mixing',
    },
    {
        id: 'service-2',
        title: 'Mastering',
        price: 'Starting at $75',
        description: 'Final polish for your mixed tracks. Loudness optimization, EQ balancing, and format delivery for all platforms.',
        turnaround: '1-2 Days',
        features: ['Stereo Enhancement', 'Loudness Optimization', 'Multiple Format Delivery', 'Streaming & CD Masters', 'Attended Sessions Available'],
        slug: 'mastering',
    },
    {
        id: 'service-3',
        title: 'Recording',
        price: 'Starting at $100/hr',
        description: 'Book studio time for vocals, instruments, or full band sessions. Professional equipment and acoustically treated rooms.',
        turnaround: 'By Appointment',
        features: ['Hourly or Day Rate', 'Professional Microphones', 'Treated Recording Rooms', 'Engineer Included', 'Remote Sessions Available'],
        slug: 'recording',
    },
];

const DEMO_PORTFOLIO: PortfolioItemData[] = [
    {
        id: 'portfolio-1',
        engineer_id: 'demo-user-id',
        title: 'Midnight Dreams',
        artist: 'Aurora Keys',
        image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        audio_url: undefined,
        created_at: '2024-01-15',
    },
    {
        id: 'portfolio-2',
        engineer_id: 'demo-user-id',
        title: 'City Lights',
        artist: 'The Neon Collective',
        image_url: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
        audio_url: undefined,
        created_at: '2024-02-10',
    },
    {
        id: 'portfolio-3',
        engineer_id: 'demo-user-id',
        title: 'Summer Vibes',
        artist: 'DJ Solstice',
        image_url: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
        audio_url: undefined,
        created_at: '2024-03-05',
    },
    {
        id: 'portfolio-4',
        engineer_id: 'demo-user-id',
        title: 'Golden Hour',
        artist: 'Velvet Rose',
        image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
        audio_url: undefined,
        created_at: '2024-04-20',
    },
];

const DEMO_TESTIMONIALS: TestimonialData[] = [
    {
        id: 'testimonial-1',
        engineer_id: 'demo-user-id',
        author_name: 'Sarah Johnson',
        author_image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
        project_name: 'Debut EP',
        text: 'James transformed my rough demos into radio-ready tracks. His attention to detail and creative input took my music to the next level. Highly recommend!',
        rating: 5,
        created_at: '2024-01-20',
    },
    {
        id: 'testimonial-2',
        engineer_id: 'demo-user-id',
        author_name: 'Marcus Chen',
        author_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
        project_name: 'Album Mix',
        text: 'Working with James was an incredible experience. He understood my vision immediately and delivered mixes that exceeded my expectations.',
        rating: 5,
        created_at: '2024-02-15',
    },
    {
        id: 'testimonial-3',
        engineer_id: 'demo-user-id',
        author_name: 'Emily Davis',
        author_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
        project_name: 'Single Release',
        text: 'Professional, responsive, and incredibly talented. James is my go-to mixing engineer for all my projects now.',
        rating: 5,
        created_at: '2024-03-10',
    },
];

const DEMO_FAQS: FAQData[] = [
    {
        id: 'faq-1',
        engineer_id: 'demo-user-id',
        question: 'What do I need to send you for a mix?',
        answer: 'For the best results, please send consolidated stems at 24-bit/44.1kHz or higher. Include all tracks bounced from the beginning of the session with no plugins applied. Reference tracks are always helpful!',
        sort_order: 1,
    },
    {
        id: 'faq-2',
        engineer_id: 'demo-user-id',
        question: 'How many revisions are included?',
        answer: 'Mixing includes 2-3 revisions depending on the package. Mastering includes 1 revision. Additional revisions can be purchased as add-ons during booking.',
        sort_order: 2,
    },
    {
        id: 'faq-3',
        engineer_id: 'demo-user-id',
        question: 'What is your turnaround time?',
        answer: 'Mixing: 2-5 days depending on track count. Mastering: 1-2 days. Recording: by appointment. Rush delivery is available as an add-on for faster turnaround.',
        sort_order: 3,
    },
    {
        id: 'faq-4',
        engineer_id: 'demo-user-id',
        question: 'How do I book a recording session?',
        answer: 'Click "Book Session" on the Recording service and select your preferred date and time slot. Sessions are available in hourly blocks or full-day rates. Remote sessions are also available!',
        sort_order: 4,
    },
];

const DEMO_PRODUCTS = [
    {
        id: 'product-1',
        type: 'preset',
        title: 'Vocal Chain Presets',
        price: '$49',
        description: 'My signature vocal processing chain as used on Grammy-nominated records. Includes 10 presets for different vocal styles.',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
        badge: 'Best Seller',
    },
    {
        id: 'product-2',
        type: 'template',
        title: 'Mixing Template',
        price: '$79',
        description: 'Complete Pro Tools mixing template with routing, buses, and my go-to plugins configured and ready to use.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    },
    {
        id: 'product-3',
        type: 'sample-pack',
        title: 'Lo-Fi Drums Vol. 1',
        price: '$29',
        description: 'Hand-crafted lo-fi drum samples, loops, and one-shots for chill beats.',
        image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
        badge: 'New',
    },
    {
        id: 'product-4',
        type: 'preset',
        title: 'Mastering Chain',
        price: '$59',
        description: 'Professional mastering chain presets for warm, punchy masters.',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    },
];

export default function DemoProfilePage() {
    const [currentTheme, setCurrentTheme] = useState<ThemeName>('amber');

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, [currentTheme]);

    return (
        <main className="min-h-screen selection:bg-[var(--accent)] selection:text-white">
            <Navbar username="jamesmix" profile={DEMO_PROFILE} />

            <div className="relative z-10 p-0">
                <Hero profile={DEMO_PROFILE} />
                <Services username="jamesmix" services={DEMO_SERVICES} />
                <Assistant username="demo" />
                <AudioDemo />
                <Workflow />
                <Products products={DEMO_PRODUCTS} username="jamesmix" />
                <Portfolio portfolioItems={DEMO_PORTFOLIO} />
                <BookingSection profile={DEMO_PROFILE} services={DEMO_SERVICES} />
                <Testimonials testimonials={DEMO_TESTIMONIALS} />
                <About profile={DEMO_PROFILE} />
                <FAQ faqs={DEMO_FAQS} />
                <FinalCTA profile={DEMO_PROFILE} />
            </div>

            <Footer username="jamesmix" profile={DEMO_PROFILE} />
            <MobileTabBar username="jamesmix" />

            {/* Demo Controls - Create Profile Button above Theme Switcher */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end">
                <a
                    href="/signup"
                    className="bg-white text-[var(--bg-base)] text-sm font-bold px-5 py-3 rounded-xl hover:bg-[var(--accent)] hover:text-white transition-all shadow-xl border border-white/20"
                >
                    Create Your Profile
                </a>
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-4 shadow-2xl">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Theme</div>
                    <div className="flex flex-wrap gap-2 max-w-[140px]">
                        {(['amber', 'teal', 'sage', 'slate', 'rose', 'violet'] as ThemeName[]).map((themeName) => (
                            <button
                                key={themeName}
                                onClick={() => setCurrentTheme(themeName)}
                                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${currentTheme === themeName ? 'border-white' : 'border-transparent'}`}
                                style={{ backgroundColor: themeName === 'amber' ? '#f59e0b' : themeName === 'teal' ? '#14b8a6' : themeName === 'sage' ? '#84cc16' : themeName === 'slate' ? '#64748b' : themeName === 'rose' ? '#f43f5e' : '#8b5cf6' }}
                                title={themeName}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
