'use client';

import React from 'react';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { motion } from 'framer-motion';

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <OnboardingProvider>
            <div className="min-h-screen bg-[var(--bg-base)] flex flex-col relative overflow-hidden">
                {/* Background Ambience */}
                <div className="absolute top-0 left-0 w-full h-96 bg-[var(--accent)]/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

                {/* Minimal Header */}
                <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-center z-10 px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white text-[var(--bg-base)] rounded-xl flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            M
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">MixExperts</span>
                    </div>
                </header>

                <main className="flex-1 flex items-center justify-center p-4 md:p-8 pt-24 relative z-10">
                    <div className="w-full max-w-2xl">
                        {children}
                    </div>
                </main>
            </div>
        </OnboardingProvider>
    );
}
