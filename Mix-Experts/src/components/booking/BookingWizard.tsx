'use client';

import React from 'react';
import { useBooking } from '@/context/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Step1ServiceSelection } from '@/components/booking/Step1ServiceSelection';
import { Step2ServiceQuestions } from '@/components/booking/Step2ServiceQuestions';
import { Step3ProjectDetails } from '@/components/booking/Step3ProjectDetails';
import { Step4Scheduling } from '@/components/booking/Step4Scheduling';
import { Step5Checkout } from '@/components/booking/Step5Checkout';
import { Check } from 'lucide-react';

const STEP_LABELS = ['Service', 'Options', 'Details', 'Schedule', 'Confirm'];

export const BookingWizard = () => {
    const { step } = useBooking();
    const totalSteps = STEP_LABELS.length;

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Progress Header */}
            <div className="mb-12">
                <div className="flex justify-between items-center relative z-10">
                    {STEP_LABELS.map((label, index) => {
                        const s = index + 1;
                        return (
                            <div key={s} className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step > s ? "bg-[var(--accent)] text-white" :
                                    step === s ? "bg-[var(--bg-elevated)] border-2 border-[var(--accent)] text-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)]" :
                                        "bg-[var(--bg-card)] border border-[var(--border-dark)] text-[var(--text-muted)]"
                                    }`}>
                                    {step > s ? <Check className="w-5 h-5" /> : s}
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${step === s ? "text-white" : "text-[var(--text-muted)]"
                                    }`}>
                                    {label}
                                </span>
                            </div>
                        );
                    })}

                    {/* Connecting Line */}
                    <div className="absolute top-5 left-0 w-full h-[2px] bg-[var(--border-dark)] -z-10">
                        <div
                            className="h-full bg-[var(--accent)] transition-all duration-500 ease-out"
                            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Content Steps */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {step === 1 && <Step1ServiceSelection />}
                    {step === 2 && <Step2ServiceQuestions />}
                    {step === 3 && <Step3ProjectDetails />}
                    {step === 4 && <Step4Scheduling />}
                    {step === 5 && <Step5Checkout />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
