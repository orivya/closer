'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Footer } from '@/components/profile/Footer';
import { ExamplesGrid } from '@/components/marketing/ExamplesGrid';
import { Navbar } from '@/components/layout/Navbar';
import { Search } from 'lucide-react';

export default function ExamplesPage() {
    const [searchTerm, setSearchTerm] = React.useState('');

    // Set default theme for marketing pages
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'amber');
    }, []);

    return (
        <main className="min-h-screen bg-[var(--bg-base)] selection:bg-[var(--accent)] selection:text-white">
            <Navbar />

            {/* Hero / Header Section */}
            <section className="pt-32 pb-12 px-6">
                <div className="max-w-[1400px] mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Built by Pros, for Pros.</h1>
                    <p className="text-xl text-[var(--text-gray)] max-w-2xl mx-auto mb-10">
                        See how top engineers, producers, and studios are using MixExperts to run their business.
                    </p>

                    {/* Filter / Search Bar */}
                    <div className="max-w-xl mx-auto relative mb-16">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-[var(--text-muted)]" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by genre, role, or location..."
                            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-full pl-12 pr-6 py-4 text-white focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                        />
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="px-6 pb-24">
                <div className="max-w-[1400px] mx-auto">
                    <ExamplesGrid searchTerm={searchTerm} />
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 border-t border-[var(--border-dark)] bg-[var(--bg-elevated)]/50">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Build your portfolio in minutes</h2>
                    <Link href="/signup" className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-[var(--accent)] hover:text-white transition-all duration-300 transform hover:scale-105">
                        Create My Portfolio
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
