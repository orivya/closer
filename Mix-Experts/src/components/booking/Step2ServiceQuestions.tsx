'use client';

import React, { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { ArrowRight, ArrowLeft, Music2, Sliders, Mic2, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Add-on options for each service type
const MIXING_ADDONS = [
    { id: 'addon-vocal-tuning', name: 'Vocal Tuning', description: 'Professional pitch correction', price: 50 },
    { id: 'addon-extra-revisions', name: 'Extra Revisions (+2)', description: 'Two additional revision rounds', price: 40 },
    { id: 'addon-stem-delivery', name: 'Stem Delivery', description: 'Receive stems for each track', price: 75 },
    { id: 'addon-instrumental', name: 'Instrumental Version', description: 'Clean version without vocals', price: 25 },
];

const MASTERING_ADDONS = [
    { id: 'addon-vinyl-master', name: 'Vinyl Master', description: 'Optimized for vinyl pressing', price: 35 },
    { id: 'addon-stems-master', name: 'Stem Mastering', description: 'Master from stems', price: 50 },
    { id: 'addon-reference-match', name: 'Reference Matching', description: 'Match loudness to reference', price: 20 },
    { id: 'addon-attended', name: 'Attended Session', description: 'Real-time collaboration via video call', price: 100 },
];

const RECORDING_ADDONS = [
    { id: 'addon-engineer', name: 'Recording Engineer', description: 'Professional engineer assistance', price: 50 },
    { id: 'addon-equipment', name: 'Premium Mic Package', description: 'Neumann U87, vintage preamps', price: 75 },
    { id: 'addon-editing', name: 'Basic Editing', description: 'Comping, timing, noise reduction', price: 40 },
    { id: 'addon-mixing', name: 'Quick Mix', description: 'Basic mix of recorded tracks', price: 100 },
];

// Stem count options for mixing
const STEM_OPTIONS = [
    { value: '2', label: '2-Track', description: 'Vocal + Instrumental', priceModifier: 0 },
    { value: '8', label: 'Up to 8 Stems', description: 'Basic multi-track', priceModifier: 50 },
    { value: '16', label: 'Up to 16 Stems', description: 'Standard session', priceModifier: 100 },
    { value: '32', label: 'Up to 32 Stems', description: 'Full production', priceModifier: 175 },
    { value: 'unlimited', label: 'Unlimited', description: 'Large sessions', priceModifier: 250 },
];

// Mastering versions
const MASTERING_VERSIONS = [
    { value: '1', label: '1 Master', description: 'Single format (Streaming)', priceModifier: 0 },
    { value: '2', label: '2 Masters', description: 'Streaming + CD', priceModifier: 25 },
    { value: '3', label: '3 Masters', description: 'Streaming, CD, Vinyl', priceModifier: 50 },
    { value: 'all', label: 'All Formats', description: 'Streaming, CD, Vinyl, WAV', priceModifier: 75 },
];

// Session duration options for recording
const SESSION_DURATIONS = [
    { value: '1', label: '1 Hour', priceModifier: 0 },
    { value: '2', label: '2 Hours', priceModifier: 100, popular: true },
    { value: '4', label: 'Half Day (4 hrs)', priceModifier: 250 },
    { value: '8', label: 'Full Day (8 hrs)', priceModifier: 450 },
];

export const Step2ServiceQuestions = () => {
    const { data, updateData, nextStep, prevStep } = useBooking();

    // Use the service type already stored in the booking context
    const serviceType = data.serviceType;

    // Local state for questions
    const [stemCount, setStemCount] = useState(data.stemCount || '8');
    const [masteringVersions, setMasteringVersions] = useState(data.masteringVersions || '1');
    const [sessionDuration, setSessionDuration] = useState(data.sessionDuration || '2');
    const [selectedAddons, setSelectedAddons] = useState<string[]>(data.selectedAddonIds || []);

    // Get the appropriate add-ons for this service type
    const getAddons = () => {
        switch (serviceType) {
            case 'mastering': return MASTERING_ADDONS;
            case 'recording': return RECORDING_ADDONS;
            default: return MIXING_ADDONS;
        }
    };

    const addons = getAddons();

    // Toggle addon selection
    const toggleAddon = (addonId: string) => {
        setSelectedAddons(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    // Calculate additional price from add-ons
    const calculateAddonTotal = () => {
        return selectedAddons.reduce((total, addonId) => {
            const addon = addons.find(a => a.id === addonId);
            return total + (addon?.price || 0);
        }, 0);
    };

    // Calculate option price modifier
    const getOptionPriceModifier = () => {
        switch (serviceType) {
            case 'mixing':
                return STEM_OPTIONS.find(o => o.value === stemCount)?.priceModifier || 0;
            case 'mastering':
                return MASTERING_VERSIONS.find(o => o.value === masteringVersions)?.priceModifier || 0;
            case 'recording':
                return SESSION_DURATIONS.find(o => o.value === sessionDuration)?.priceModifier || 0;
            default:
                return 0;
        }
    };

    const handleContinue = () => {
        updateData({
            stemCount,
            masteringVersions,
            sessionDuration,
            selectedAddonIds: selectedAddons,
            addonTotal: calculateAddonTotal(),
            optionPriceModifier: getOptionPriceModifier(),
        });
        nextStep();
    };

    const getServiceIcon = () => {
        switch (serviceType) {
            case 'mastering': return Music2;
            case 'recording': return Mic2;
            default: return Sliders;
        }
    };

    const Icon = getServiceIcon();

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent)]/10 mb-4">
                    <Icon className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">What Does Your Project Need?</h2>
                <p className="text-[var(--text-gray)]">
                    {serviceType === 'mixing' && 'Tell us about your session size and any extras.'}
                    {serviceType === 'mastering' && 'Select your delivery formats and options.'}
                    {serviceType === 'recording' && 'Choose your session length and add-ons.'}
                </p>
            </div>

            {/* Service-specific question */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
                {serviceType === 'mixing' && (
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-white block">
                            How many track stems are in your session?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {STEM_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setStemCount(option.value)}
                                    className={cn(
                                        "p-4 rounded-xl border text-left transition-all",
                                        stemCount === option.value
                                            ? "bg-[var(--accent)]/10 border-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)]"
                                            : "bg-[var(--bg-card)] border-[var(--border-dark)] hover:border-[var(--accent)]/50"
                                    )}
                                >
                                    <div className="font-bold text-white text-lg">{option.label}</div>
                                    <div className="text-xs text-[var(--text-muted)] mt-1">{option.description}</div>
                                    {option.priceModifier > 0 && (
                                        <div className="text-xs text-[var(--accent)] mt-2">+${option.priceModifier}</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {serviceType === 'mastering' && (
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-white block">
                            How many master versions do you need?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {MASTERING_VERSIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setMasteringVersions(option.value)}
                                    className={cn(
                                        "p-4 rounded-xl border text-left transition-all",
                                        masteringVersions === option.value
                                            ? "bg-[var(--accent)]/10 border-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)]"
                                            : "bg-[var(--bg-card)] border-[var(--border-dark)] hover:border-[var(--accent)]/50"
                                    )}
                                >
                                    <div className="font-bold text-white text-lg">{option.label}</div>
                                    <div className="text-xs text-[var(--text-muted)] mt-1">{option.description}</div>
                                    {option.priceModifier > 0 && (
                                        <div className="text-xs text-[var(--accent)] mt-2">+${option.priceModifier}</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {serviceType === 'recording' && (
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-white block">
                            How long do you need the studio?
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {SESSION_DURATIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSessionDuration(option.value)}
                                    className={cn(
                                        "relative p-4 rounded-xl border text-left transition-all",
                                        sessionDuration === option.value
                                            ? "bg-[var(--accent)]/10 border-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)]"
                                            : "bg-[var(--bg-card)] border-[var(--border-dark)] hover:border-[var(--accent)]/50"
                                    )}
                                >
                                    {option.popular && (
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[var(--accent)] text-white text-[10px] font-bold rounded-full">
                                            POPULAR
                                        </div>
                                    )}
                                    <div className="font-bold text-white text-lg">{option.label}</div>
                                    {option.priceModifier > 0 && (
                                        <div className="text-xs text-[var(--accent)] mt-2">+${option.priceModifier}</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add-ons section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Add-ons</h3>
                    <span className="text-sm text-[var(--text-muted)]">Optional extras</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {addons.map((addon, index) => (
                        <motion.button
                            key={addon.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => toggleAddon(addon.id)}
                            className={cn(
                                "p-4 rounded-xl border text-left transition-all flex items-start gap-4",
                                selectedAddons.includes(addon.id)
                                    ? "bg-[var(--accent)]/10 border-[var(--accent)]"
                                    : "bg-[var(--bg-card)] border-[var(--border-dark)] hover:border-[var(--accent)]/50"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                                selectedAddons.includes(addon.id)
                                    ? "bg-[var(--accent)] border-[var(--accent)]"
                                    : "border-[var(--border-dark)]"
                            )}>
                                {selectedAddons.includes(addon.id) && (
                                    <Check className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-white">{addon.name}</span>
                                    <span className="text-[var(--accent)] font-bold">+${addon.price}</span>
                                </div>
                                <p className="text-sm text-[var(--text-muted)] mt-1">{addon.description}</p>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Summary */}
            {(selectedAddons.length > 0 || getOptionPriceModifier() > 0) && (
                <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl p-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--text-muted)]">Additional costs:</span>
                        <span className="font-bold text-[var(--accent)]">
                            +${getOptionPriceModifier() + calculateAddonTotal()}
                        </span>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 pt-4 border-t border-[var(--border-dark)]">
                <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-[var(--bg-card)] text-[var(--text-muted)] font-bold rounded-xl hover:bg-[var(--bg-elevated)] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <div className="flex-1" />
                <button
                    onClick={handleContinue}
                    className="px-8 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all shadow-[0_0_20px_var(--accent-glow)] flex items-center justify-center gap-2"
                >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
