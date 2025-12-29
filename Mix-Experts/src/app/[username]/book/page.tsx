'use client';

import React, { use } from 'react';
import { BookingProvider } from '@/context/BookingContext';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { Navbar } from '@/components/profile/Navigation';

export default function BookingPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);
    return (
        <BookingProvider>
            <div className="min-h-screen bg-[var(--bg-base)] text-white pb-20">
                {/* Reusing Public Navigation */}
                <Navbar username={username} />

                <main className="pt-32 px-4 md:px-8">
                    <BookingWizard />
                </main>
            </div>
        </BookingProvider>
    );
}
