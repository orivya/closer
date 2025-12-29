import React from 'react';
import { X, ArrowRight, Check, Loader2, Play } from 'lucide-react';

interface WizardLayoutProps {
    title: string;
    subtitle?: string;
    icon: React.ElementType;
    step: number;
    totalSteps: number;
    onBack: () => void;
    onNext?: () => void;
    onComplete?: () => void;
    isSaving?: boolean;
    canProceed?: boolean;
    nextLabel?: string;
    children: React.ReactNode;
    color?: string; // Kept for compatibility but always renders sage style
}

const WizardLayout: React.FC<WizardLayoutProps> = ({
    title,
    subtitle,
    icon: Icon,
    step,
    totalSteps,
    onBack,
    onNext,
    onComplete,
    isSaving = false,
    canProceed = true,
    nextLabel = 'Continue',
    children,
    color = 'sage'
}) => {
    // Calculate progress percentage
    const progress = ((step + 1) / totalSteps) * 100;

    // Standard Sage/Stone Theme
    const theme = {
        bg: 'bg-sage-50',
        text: 'text-sage-700',
        bar: 'bg-sage-600',
        button: 'bg-sage-900',
        ring: 'focus:ring-sage-200',
        lightbar: 'bg-sage-200'
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col animate-fade-in overflow-hidden">
            {/* Progress bar */}
            <div className="w-full h-1 bg-stone-200">
                <div
                    className={`h-full transition-all duration-500 ease-out ${theme.bar}`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Header */}
            <div className="px-6 py-5 flex justify-between items-center border-b border-stone-200 bg-white/50 backdrop-blur-sm">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-black/5 rounded-full transition-colors text-stone-400"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.bg} ${theme.text}`}>
                        <Icon size={20} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest leading-none mb-1">
                            Guided Reflection
                        </span>
                        <span className="text-sm font-semibold text-sage-900 leading-none">
                            {title}
                        </span>
                    </div>
                </div>

                <div className="flex gap-1.5 hidden sm:flex">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${i <= step ? theme.bar : 'bg-stone-200'
                                }`}
                        />
                    ))}
                </div>
                <div className="sm:hidden text-xs font-bold text-stone-400">
                    {step + 1} / {totalSteps}
                </div>
            </div>

            {/* Main content area - Centered Card Style */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#faf9f7] to-[#f0efe9]">
                <div className="min-h-full flex flex-col items-center justify-center p-6 pb-28 md:pb-10">
                    <div className="w-full max-w-lg mx-auto animate-fade-up">
                        {children}

                        {/* Navigation Buttons */}
                        <div className="mt-10">
                            {onNext && (
                                <button
                                    onClick={onNext}
                                    disabled={!canProceed}
                                    className={`w-full py-4 rounded-full text-white text-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:shadow-none ${theme.button}`}
                                >
                                    {nextLabel} <ArrowRight size={18} />
                                </button>
                            )}

                            {onComplete && (
                                <button
                                    onClick={onComplete}
                                    disabled={isSaving || !canProceed}
                                    className={`w-full py-4 rounded-full text-white text-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:shadow-none ${theme.button}`}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={20} />
                                            Complete Reflection
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WizardLayout;
