'use client';

import React from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import { Camera, Image as ImageIcon, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VisualsEditor } from '../dashboard/settings/VisualsEditor'; // Reusing component

export const Step2Visuals = () => {
    const { data, updateData, nextStep, prevStep } = useOnboarding();

    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Look the Part</h1>
                <p className="text-[var(--text-gray)]">Upload a professional photo and banner. You can change these later.</p>
            </div>

            <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
                <VisualsEditor
                    avatarUrl={data.avatarPreview}
                    bannerUrl={data.bannerPreview}
                    onUpdate={(type, file) => {
                        // In a real app we'd upload here. For now just creating a preview URL locally.
                        const url = URL.createObjectURL(file);
                        if (type === 'avatar') updateData({ avatarFile: file, avatarPreview: url });
                        if (type === 'banner') updateData({ bannerFile: file, bannerPreview: url });
                    }}
                />
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
                    Set Pricing
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
