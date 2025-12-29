'use client';

import React from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import { Sliders, Music2, ArrowRight, ArrowLeft, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Step3Rates = () => {
    const { data, updateData, nextStep, prevStep } = useOnboarding();

    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Set Your Rates</h1>
                <p className="text-[var(--text-gray)]">Define your starting prices for your core services.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Mix Rate */}
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--accent)] transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[var(--bg-base)] text-[var(--accent)]">
                            <Sliders className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-white">Full Mix</h3>
                    </div>

                    <div className="relative mb-2">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                            type="number"
                            value={data.mixRate}
                            onChange={(e) => updateData({ mixRate: Math.max(0, parseInt(e.target.value) || 0) })}
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-12 pr-4 py-4 text-2xl font-bold text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
                        />
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">Per track. Includes 3 revisions.</p>
                </div>

                {/* Master Rate */}
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--accent)] transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-[var(--bg-base)] text-blue-400">
                            <Music2 className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-white">Mastering</h3>
                    </div>

                    <div className="relative mb-2">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                            type="number"
                            value={data.masterRate}
                            onChange={(e) => updateData({ masterRate: Math.max(0, parseInt(e.target.value) || 0) })}
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-12 pr-4 py-4 text-2xl font-bold text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
                        />
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">Per track. Includes 2 revisions.</p>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={prevStep}
                    className="flex-1 py-4 bg-[var(--bg-card)] text-[var(--text-muted)] font-bold rounded-xl hover:bg-[var(--bg-elevated)] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <button
                    onClick={nextStep}
                    className="flex-[2] py-4 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all shadow-[0_0_20px_var(--accent-glow)] flex items-center justify-center gap-2"
                >
                    Finish Setup
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
