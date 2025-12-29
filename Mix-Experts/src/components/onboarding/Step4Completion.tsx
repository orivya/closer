'use client';

import React, { useEffect, useState } from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import { useRouter } from 'next/navigation';
import { Check, Loader2, AlertCircle } from 'lucide-react';

export const Step4Completion = () => {
    const { data, saveToDatabase, isSaving } = useOnboarding();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const save = async () => {
            if (isSaved) return; // Prevent double-save

            const { error } = await saveToDatabase();

            if (error) {
                setError(error.message);
                return;
            }

            setIsSaved(true);

            // Redirect to dashboard after short delay
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        };

        save();
    }, [saveToDatabase, router, isSaved]);

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="relative bg-[var(--bg-elevated)] w-full h-full rounded-full flex items-center justify-center border border-red-500">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">
                    Something Went Wrong
                </h1>
                <p className="text-[var(--text-gray)] mb-8 max-w-md mx-auto">
                    {error}
                </p>

                <button
                    onClick={() => {
                        setError(null);
                        setIsSaved(false);
                    }}
                    className="px-8 py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent-light)] transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="text-center py-12">
            <div className="relative w-24 h-24 mx-auto mb-8">
                {/* Ripple Effect */}
                {isSaved && (
                    <div className="absolute inset-0 bg-[var(--accent)]/20 rounded-full animate-ping" />
                )}
                <div className="relative bg-[var(--bg-elevated)] w-full h-full rounded-full flex items-center justify-center border border-[var(--accent)]">
                    {isSaving ? (
                        <Loader2 className="w-10 h-10 text-[var(--accent)] animate-spin" />
                    ) : (
                        <Check className="w-10 h-10 text-[var(--accent)] animate-in zoom-in duration-500" />
                    )}
                </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {isSaving ? 'Setting Up Your Profile...' : `You're All Set, ${data.displayName}!`}
            </h1>
            <p className="text-[var(--text-gray)] mb-8 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                {isSaving
                    ? 'Uploading your assets and configuring your profile...'
                    : 'Your professional dashboard and public profile page are ready.'
                }
            </p>

            <div className="flex items-center justify-center gap-3 text-sm text-[var(--text-muted)] animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isSaving ? 'Saving your profile...' : 'Redirecting to your studio...'}</span>
            </div>
        </div>
    );
};
