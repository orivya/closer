'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Service } from '@/lib/types';

// Define the shape of our booking data
export interface BookingData {
    // Step 1: Service Selection
    selectedServiceId: string | null;
    selectedServiceTitle: string | null;
    serviceType: 'mixing' | 'mastering' | 'recording';

    // Step 2: Service-Specific Options
    stemCount?: string; // For mixing: '2', '8', '16', '32', 'unlimited'
    masteringVersions?: string; // For mastering: '1', '2', '3', 'all'
    sessionDuration?: string; // For recording: '1', '2', '4', '8' hours
    selectedAddonIds: string[];
    addonTotal: number;
    optionPriceModifier: number;

    // Step 3: Project Details
    projectTitle: string;
    artistName: string;
    description: string;
    bpm?: string;
    key?: string;
    uploadedFiles: File[]; // Mock storage for now

    // Step 4: Scheduling (for recording: date/time, for others: turnaround)
    deadline: Date | null;
    selectedDate: Date | null; // For recording sessions
    selectedTime: string | null; // For recording sessions
    isRushDelivery: boolean;
    turnaroundOptionId: string | null;

    // Step 5: Financials
    basePrice: number;
    rushFee: number;
    total: number;
}

interface BookingContextType {
    step: number;
    data: BookingData;
    setStep: (step: number) => void;
    updateData: (updates: Partial<BookingData>) => void;
    nextStep: () => void;
    prevStep: () => void;
    selectService: (service: Service) => void;
}

const defaultData: BookingData = {
    selectedServiceId: null,
    selectedServiceTitle: null,
    serviceType: 'mixing',
    stemCount: '8',
    masteringVersions: '1',
    sessionDuration: '2',
    selectedAddonIds: [],
    addonTotal: 0,
    optionPriceModifier: 0,
    projectTitle: '',
    artistName: '',
    description: '',
    uploadedFiles: [],
    deadline: null,
    selectedDate: null,
    selectedTime: null,
    isRushDelivery: false,
    turnaroundOptionId: null,
    basePrice: 0,
    rushFee: 0,
    total: 0,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<BookingData>(defaultData);

    const updateData = (updates: Partial<BookingData>) => {
        setData(prev => {
            const newData = { ...prev, ...updates };

            // Recalculate total when financial fields change
            const base = updates.basePrice ?? prev.basePrice;
            const addonTotal = updates.addonTotal ?? prev.addonTotal;
            const optionModifier = updates.optionPriceModifier ?? prev.optionPriceModifier;
            const isRush = updates.isRushDelivery ?? prev.isRushDelivery;

            // Rush fee is 50% of base if active
            const rush = isRush ? base * 0.5 : 0;

            // Calculate total: base + options + addons + rush
            newData.rushFee = rush;
            newData.total = base + optionModifier + addonTotal + rush;

            return newData;
        });
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => Math.max(1, prev - 1));

    const selectService = (service: Service) => {
        // Parse price string like "$350" to number 350
        const price = parseInt(service.price.replace(/[^0-9]/g, '')) || 0;

        // Determine service type from title
        const title = service.title.toLowerCase();
        let serviceType: 'mixing' | 'mastering' | 'recording' = 'mixing';
        if (title.includes('master')) serviceType = 'mastering';
        else if (title.includes('record')) serviceType = 'recording';

        updateData({
            selectedServiceId: service.id,
            selectedServiceTitle: service.title,
            serviceType,
            basePrice: price,
            // Reset options
            selectedAddonIds: [],
            addonTotal: 0,
            optionPriceModifier: 0,
            isRushDelivery: false,
            rushFee: 0,
            total: price
        });
        nextStep();
    };

    return (
        <BookingContext.Provider value={{ step, data, setStep, updateData, nextStep, prevStep, selectService }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
