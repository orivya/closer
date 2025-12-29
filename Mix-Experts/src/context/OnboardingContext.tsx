'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Define the shape of our onboarding data
interface OnboardingData {
    // Step 1: Identity
    role: 'engineer' | 'mastering' | 'producer';
    displayName: string;
    location: string;
    bio: string;
    tagline: string;

    // Step 2: Visuals (Files will be handled separately in real app, storing URLs here for now)
    avatarFile?: File | null;
    bannerFile?: File | null;
    avatarPreview?: string;
    bannerPreview?: string;
    avatarUrl?: string;
    bannerUrl?: string;

    // Step 3: Rates
    mixRate: number;
    masterRate: number;

    // Step 4: Stripe
    isStripeConnected: boolean;
}

interface OnboardingContextType {
    step: number;
    data: OnboardingData;
    setStep: (step: number) => void;
    updateData: (updates: Partial<OnboardingData>) => void;
    nextStep: () => void;
    prevStep: () => void;
    saveToDatabase: () => Promise<{ error: Error | null }>;
    isSaving: boolean;
}

const defaultData: OnboardingData = {
    role: 'engineer',
    displayName: '',
    location: '',
    bio: '',
    tagline: '',
    mixRate: 350,
    masterRate: 75,
    isStripeConnected: false,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingData>(defaultData);
    const [isSaving, setIsSaving] = useState(false);

    const updateData = (updates: Partial<OnboardingData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => Math.max(1, prev - 1));

    const uploadFile = async (file: File, bucket: string, userId: string, type: string): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${type}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, { upsert: true });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                return null;
            }

            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            return urlData.publicUrl;
        } catch (error) {
            console.error('File upload failed:', error);
            return null;
        }
    };

    const saveToDatabase = useCallback(async (): Promise<{ error: Error | null }> => {
        setIsSaving(true);

        try {
            // Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                setIsSaving(false);
                return { error: new Error('Not authenticated') };
            }

            // Upload avatar if provided
            let avatarUrl: string | undefined = data.avatarUrl ?? undefined;
            if (data.avatarFile) {
                avatarUrl = await uploadFile(
                    data.avatarFile,
                    'avatars',
                    user.id,
                    'avatar'
                ) ?? undefined;
            }

            // Upload banner if provided
            let bannerUrl: string | undefined = data.bannerUrl ?? undefined;
            if (data.bannerFile) {
                bannerUrl = await uploadFile(
                    data.bannerFile,
                    'banners',
                    user.id,
                    'banner'
                ) ?? undefined;
            }

            // Update profile in database
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    display_name: data.displayName,
                    location: data.location,
                    bio: data.bio || `Professional ${data.role} with expertise in audio engineering.`,
                    tagline: data.tagline || `${data.role.charAt(0).toUpperCase() + data.role.slice(1)} | Audio Professional`,
                    avatar_url: avatarUrl,
                    banner_url: bannerUrl,
                    is_published: true, // Mark profile as ready
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (profileError) {
                setIsSaving(false);
                return { error: profileError };
            }

            // Create initial services based on rates
            if (data.mixRate > 0) {
                await supabase.from('services').insert({
                    profile_id: user.id,
                    name: 'Professional Mixing',
                    description: 'Full mix with stem organization, level balancing, EQ, compression, and spatial processing.',
                    category: 'mixing',
                    base_price: data.mixRate,
                    currency: 'USD',
                    turnaround_days: 7,
                    revision_count: 2,
                    is_active: true,
                    display_order: 0,
                });
            }

            if (data.masterRate > 0) {
                await supabase.from('services').insert({
                    profile_id: user.id,
                    name: 'Professional Mastering',
                    description: 'Stereo mastering with industry-standard loudness, clarity, and streaming optimization.',
                    category: 'mastering',
                    base_price: data.masterRate,
                    currency: 'USD',
                    turnaround_days: 3,
                    revision_count: 1,
                    is_active: true,
                    display_order: 1,
                });
            }

            setIsSaving(false);
            return { error: null };
        } catch (error) {
            setIsSaving(false);
            return { error: error as Error };
        }
    }, [data]);

    return (
        <OnboardingContext.Provider value={{
            step,
            data,
            setStep,
            updateData,
            nextStep,
            prevStep,
            saveToDatabase,
            isSaving
        }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};
