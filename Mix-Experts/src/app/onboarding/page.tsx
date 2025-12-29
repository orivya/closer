'use client';

import React from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Step1Identity } from '@/components/onboarding/Step1Identity';
import { Step2Visuals } from '@/components/onboarding/Step2Visuals';
import { Step3Rates } from '@/components/onboarding/Step3Rates';
import { Step4Completion } from '@/components/onboarding/Step4Completion';

export default function OnboardingPage() {
    const { step } = useOnboarding();

    return (
        <div className="w-full">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    <span>Setup Progress</span>
                    <span>Step {step} of 4</span>
                </div>
                <div className="h-2 bg-[var(--bg-card)] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[var(--accent)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {step === 1 && <Step1Identity />}
                    {step === 2 && <Step2Visuals />}
                    {step === 3 && <Step3Rates />}
                    {step === 4 && <Step4Completion />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
