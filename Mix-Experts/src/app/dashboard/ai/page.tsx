'use client';

import React from 'react';
import { AIChatInterface } from '@/components/dashboard/ai/AIChatInterface';

export default function AIAssistantPage() {
    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">AI Assistant</h1>
                <p className="text-[var(--text-gray)]">Your smart co-pilot for studio management, contracts, and creativity.</p>
            </div>

            <AIChatInterface />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl">
                    <h3 className="font-bold text-white mb-2">Draft Contracts</h3>
                    <p className="text-sm text-[var(--text-gray)]">Generate professional agreements for mixing, mastering, or production work instantly.</p>
                </div>
                <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl">
                    <h3 className="font-bold text-white mb-2">Analyze Audio</h3>
                    <p className="text-sm text-[var(--text-gray)]">Get feedback on loudness, dynamic range, and frequency balance (Coming Soon).</p>
                </div>
                <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl">
                    <h3 className="font-bold text-white mb-2">Business Tips</h3>
                    <p className="text-sm text-[var(--text-gray)]">Ask for advice on pricing, client communication, and growing your studio revenue.</p>
                </div>
            </div>
        </div>
    );
}
