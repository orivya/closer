'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Music, Sliders, Disc, Mic2, Clock, Zap, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type StepType = 'SERVICE' | 'DETAILS' | 'STEMS' | 'ADDONS' | 'RESULT';
type ServiceType = 'MIXING' | 'MASTERING' | 'RECORDING';

// Stem count options matching the booking flow
const STEM_OPTIONS = [
    { value: '2', label: '2-Track', description: 'Vocal + Instrumental', priceModifier: 0 },
    { value: '8', label: 'Up to 8', description: 'Basic multi-track', priceModifier: 50 },
    { value: '16', label: 'Up to 16', description: 'Standard session', priceModifier: 100 },
    { value: '32', label: 'Up to 32', description: 'Full production', priceModifier: 175 },
    { value: 'unlimited', label: 'Unlimited', description: 'Large sessions', priceModifier: 250 },
];

// Session duration options for recording
const SESSION_DURATIONS = [
    { value: '1', label: '1 Hour', priceModifier: 0 },
    { value: '2', label: '2 Hours', priceModifier: 100 },
    { value: '4', label: 'Half Day', priceModifier: 250 },
    { value: '8', label: 'Full Day', priceModifier: 450 },
];

// Add-ons per service type
const SERVICE_ADDONS = {
    MIXING: [
        { id: 'vocal-tuning', name: 'Vocal Tuning', price: 50 },
        { id: 'extra-revisions', name: 'Extra Revisions', price: 40 },
        { id: 'stem-delivery', name: 'Stem Delivery', price: 75 },
    ],
    MASTERING: [
        { id: 'vinyl-master', name: 'Vinyl Master', price: 35 },
        { id: 'stem-mastering', name: 'Stem Mastering', price: 50 },
        { id: 'attended', name: 'Attended Session', price: 100 },
    ],
    RECORDING: [
        { id: 'engineer', name: 'Recording Engineer', price: 50 },
        { id: 'premium-mic', name: 'Premium Mic Package', price: 75 },
        { id: 'editing', name: 'Basic Editing', price: 40 },
    ],
};

// Base prices
const BASE_PRICES = {
    MIXING: 150,
    MASTERING: 75,
    RECORDING: 100,
};

interface AssistantProps {
    username?: string;
}

export const Assistant: React.FC<AssistantProps> = ({ username = 'demo' }) => {
    const router = useRouter();
    const [step, setStep] = useState<StepType>('SERVICE');
    const [loading, setLoading] = useState(false);
    const [selection, setSelection] = useState<{
        service?: ServiceType;
        details?: string;
        stemCount?: string;
        sessionDuration?: string;
        selectedAddons?: string[];
    }>({
        selectedAddons: [],
    });

    const handleServiceSelect = (service: ServiceType) => {
        setLoading(true);
        setSelection({ ...selection, service, selectedAddons: [] });
        setTimeout(() => {
            setLoading(false);
            // For mixing, go to stems question; for recording, go to duration; for mastering, go to details
            if (service === 'MIXING') {
                setStep('STEMS');
            } else if (service === 'RECORDING') {
                setStep('DETAILS');
            } else {
                setStep('DETAILS');
            }
        }, 600);
    };

    const handleStemSelect = (stemCount: string) => {
        setLoading(true);
        setSelection({ ...selection, stemCount });
        setTimeout(() => {
            setLoading(false);
            setStep('ADDONS');
        }, 600);
    };

    const handleDetailsSelect = (details: string) => {
        setLoading(true);
        setSelection({ ...selection, details });
        setTimeout(() => {
            setLoading(false);
            if (selection.service === 'MASTERING' && details === 'Not yet mixed') {
                // Redirect to mixing flow
                setStep('STEMS');
                setSelection({ ...selection, service: 'MIXING', details });
            } else {
                setStep('ADDONS');
            }
        }, 600);
    };

    const handleDurationSelect = (sessionDuration: string) => {
        setLoading(true);
        setSelection({ ...selection, sessionDuration });
        setTimeout(() => {
            setLoading(false);
            setStep('ADDONS');
        }, 600);
    };

    const toggleAddon = (addonId: string) => {
        const current = selection.selectedAddons || [];
        const newAddons = current.includes(addonId)
            ? current.filter(id => id !== addonId)
            : [...current, addonId];
        setSelection({ ...selection, selectedAddons: newAddons });
    };

    const proceedToResult = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep('RESULT');
        }, 600);
    };

    const reset = () => {
        setStep('SERVICE');
        setSelection({ selectedAddons: [] });
    };

    const calculatePrice = () => {
        const service = selection.service || 'MIXING';
        let basePrice = BASE_PRICES[service];

        // Add stem modifier for mixing
        if (service === 'MIXING' && selection.stemCount) {
            const stemOption = STEM_OPTIONS.find(o => o.value === selection.stemCount);
            basePrice += stemOption?.priceModifier || 0;
        }

        // Add duration modifier for recording
        if (service === 'RECORDING' && selection.sessionDuration) {
            const durationOption = SESSION_DURATIONS.find(o => o.value === selection.sessionDuration);
            basePrice += durationOption?.priceModifier || 0;
        }

        // Add selected add-ons
        const addons = SERVICE_ADDONS[service] || [];
        const addonTotal = (selection.selectedAddons || []).reduce((total, addonId) => {
            const addon = addons.find(a => a.id === addonId);
            return total + (addon?.price || 0);
        }, 0);

        return basePrice + addonTotal;
    };

    const getRecommendation = () => {
        const service = selection.service || 'MIXING';
        const price = calculatePrice();

        if (service === 'MASTERING') {
            return {
                package: "Pro Mastering",
                desc: "Professional mastering with loudness optimization, stereo enhancement, and format delivery for all platforms.",
                price: `$${price}`,
                turnaround: "1-2 Days"
            };
        }

        if (service === 'RECORDING') {
            const duration = SESSION_DURATIONS.find(d => d.value === selection.sessionDuration);
            return {
                package: `Recording Session (${duration?.label || '2 Hours'})`,
                desc: "Book studio time with professional equipment and acoustically treated rooms. Engineer available.",
                price: `$${price}`,
                turnaround: "By Appointment"
            };
        }

        // Mixing
        const stemOption = STEM_OPTIONS.find(s => s.value === selection.stemCount);
        return {
            package: `${stemOption?.label || 'Custom'} Mix`,
            desc: stemOption?.value === '2'
                ? "Ideal for vocalists recording over a purchased beat. We'll blend your vocals perfectly with the instrumental."
                : "Full multi-track mixing with EQ, compression, effects, and professional polish.",
            price: `$${price}`,
            turnaround: "2-5 Days"
        };
    };

    const handleBookSession = () => {
        // Navigate to booking with pre-selected service type
        const serviceType = selection.service?.toLowerCase() || 'mixing';
        router.push(`/${username}/book?service=${serviceType}`);
    };

    const recommendation = getRecommendation();

    return (
        <section className="py-32 bg-[var(--bg-elevated)] border-y border-[var(--border-dark)] relative overflow-hidden">
            {/* Abstract Background Element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--accent-subtle)] to-transparent opacity-20" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-t from-[var(--accent-subtle)] to-transparent opacity-10 rounded-full blur-3xl" />

            <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-glow)] text-[var(--accent)] text-xs font-bold uppercase tracking-wider mb-6">
                        <Sparkles className="w-3 h-3" />
                        Project Concierge
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Find your perfect <br />sonic solution.
                    </h2>
                    <p className="text-[var(--text-gray)] text-lg leading-relaxed max-w-md mb-8">
                        Every project is unique. Answer two quick questions to get a tailored recommendation for your specific needs.
                    </p>

                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[var(--accent)]" />
                            <span>30-second quote</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-[var(--border-dark)]" />
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-[var(--accent)]" />
                            <span>Instant pricing</span>
                        </div>
                    </div>
                </div>

                {/* Interactive Widget */}
                <div className="bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-3xl p-8 shadow-2xl relative min-h-[480px] flex flex-col justify-center overflow-hidden">

                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-1 bg-[var(--accent)] transition-all duration-500"
                        style={{
                            width: step === 'SERVICE' ? '20%' :
                                   step === 'DETAILS' ? '40%' :
                                   step === 'STEMS' ? '40%' :
                                   step === 'ADDONS' ? '70%' : '100%'
                        }} />

                    {step === 'SERVICE' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-bold text-white mb-6">What does your project need right now?</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => handleServiceSelect('MIXING')}
                                    className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-[var(--text-gray)] hover:border-[var(--accent)] hover:text-white hover:bg-[var(--bg-hover)] transition-all text-left font-medium flex items-center gap-4 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                                        <Sliders className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">Mixing</div>
                                        <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-gray)]">Balancing tracks & creative effects</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleServiceSelect('MASTERING')}
                                    className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-[var(--text-gray)] hover:border-[var(--accent)] hover:text-white hover:bg-[var(--bg-hover)] transition-all text-left font-medium flex items-center gap-4 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                                        <Disc className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">Mastering</div>
                                        <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-gray)]">Final polish & loudness</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleServiceSelect('RECORDING')}
                                    className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-[var(--text-gray)] hover:border-[var(--accent)] hover:text-white hover:bg-[var(--bg-hover)] transition-all text-left font-medium flex items-center gap-4 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                                        <Mic2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">Recording</div>
                                        <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-gray)]">Studio time & sessions</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'DETAILS' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <button onClick={() => setStep('SERVICE')} className="text-xs text-[var(--text-muted)] hover:text-white mb-4 uppercase tracking-wider font-bold">
                                ← Back
                            </button>

                            {selection.service === 'MASTERING' ? (
                                <>
                                    <h3 className="text-xl font-bold text-white mb-6">Is your mix completely finished?</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <button
                                            onClick={() => handleDetailsSelect('Yes, ready for mastering')}
                                            className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-left hover:border-[var(--accent)] hover:bg-[var(--bg-hover)] transition-all group"
                                        >
                                            <div className="text-white font-bold mb-1">Yes, it&apos;s ready</div>
                                            <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-gray)]">I have a single stereo file with -6dB headroom</div>
                                        </button>
                                        <button
                                            onClick={() => handleDetailsSelect('Not yet mixed')}
                                            className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-left hover:border-[var(--accent)] hover:bg-[var(--bg-hover)] transition-all group"
                                        >
                                            <div className="text-white font-bold mb-1">No, it needs mixing</div>
                                            <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-gray)]">I still have the individual stems/multitracks</div>
                                        </button>
                                    </div>
                                </>
                            ) : selection.service === 'RECORDING' ? (
                                <>
                                    <h3 className="text-xl font-bold text-white mb-6">How long do you need the studio?</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {SESSION_DURATIONS.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => handleDurationSelect(option.value)}
                                                className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-left hover:border-[var(--accent)] hover:bg-[var(--bg-hover)] transition-all group"
                                            >
                                                <div className="text-white font-bold mb-1">{option.label}</div>
                                                {option.priceModifier > 0 && (
                                                    <div className="text-xs text-[var(--accent)]">+${option.priceModifier}</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : null}
                        </div>
                    )}

                    {/* Stem Count Step for Mixing */}
                    {step === 'STEMS' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <button onClick={() => setStep('SERVICE')} className="text-xs text-[var(--text-muted)] hover:text-white mb-4 uppercase tracking-wider font-bold">
                                ← Back
                            </button>
                            <h3 className="text-xl font-bold text-white mb-6">How many track stems are in your session?</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {STEM_OPTIONS.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleStemSelect(option.value)}
                                        className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-left hover:border-[var(--accent)] hover:bg-[var(--bg-hover)] transition-all group"
                                    >
                                        <div className="text-white font-bold mb-1">{option.label}</div>
                                        <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-gray)]">{option.description}</div>
                                        {option.priceModifier > 0 && (
                                            <div className="text-xs text-[var(--accent)] mt-1">+${option.priceModifier}</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add-ons Step */}
                    {step === 'ADDONS' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <button
                                onClick={() => {
                                    if (selection.service === 'MIXING') setStep('STEMS');
                                    else if (selection.service === 'RECORDING') setStep('DETAILS');
                                    else setStep('DETAILS');
                                }}
                                className="text-xs text-[var(--text-muted)] hover:text-white mb-4 uppercase tracking-wider font-bold"
                            >
                                ← Back
                            </button>
                            <h3 className="text-xl font-bold text-white mb-2">Add extras to your project</h3>
                            <p className="text-sm text-[var(--text-muted)] mb-6">Optional add-ons to enhance your {selection.service?.toLowerCase()} session</p>
                            <div className="grid grid-cols-1 gap-2 mb-6">
                                {(SERVICE_ADDONS[selection.service || 'MIXING'] || []).map((addon) => {
                                    const isSelected = selection.selectedAddons?.includes(addon.id);
                                    return (
                                        <button
                                            key={addon.id}
                                            onClick={() => toggleAddon(addon.id)}
                                            className={cn(
                                                "p-3 rounded-xl border text-left transition-all flex items-center gap-3",
                                                isSelected
                                                    ? "bg-[var(--accent)]/10 border-[var(--accent)]"
                                                    : "bg-[var(--bg-card)] border-[var(--border-dark)] hover:border-[var(--accent)]/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                                                isSelected ? "bg-[var(--accent)] border-[var(--accent)]" : "border-[var(--border-dark)]"
                                            )}>
                                                {isSelected && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-white font-medium">{addon.name}</span>
                                            </div>
                                            <span className="text-[var(--accent)] font-bold">+${addon.price}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={proceedToResult}
                                className="w-full py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all flex items-center justify-center gap-2"
                            >
                                Get My Quote
                                <Zap className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {step === 'RESULT' && (
                        <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_var(--accent-glow)]">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{recommendation.package}</h3>
                            <p className="text-[var(--text-gray)] mb-6 max-w-sm mx-auto leading-relaxed text-sm">
                                {recommendation.desc}
                            </p>

                            {/* Selected Add-ons */}
                            {(selection.selectedAddons?.length || 0) > 0 && (
                                <div className="mb-6 p-3 bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl text-left">
                                    <div className="text-xs text-[var(--text-muted)] uppercase font-bold mb-2">Includes:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {selection.selectedAddons?.map(addonId => {
                                            const addon = SERVICE_ADDONS[selection.service || 'MIXING']?.find(a => a.id === addonId);
                                            return addon ? (
                                                <span key={addonId} className="text-xs bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-1 rounded-full">
                                                    {addon.name}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-dark)]">
                                    <span className="text-xs text-[var(--text-muted)] uppercase block">Est. Price</span>
                                    <span className="text-white font-bold text-lg">{recommendation.price}</span>
                                </div>
                                <div className="px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-dark)]">
                                    <span className="text-xs text-[var(--text-muted)] uppercase block">Turnaround</span>
                                    <span className="text-white font-bold">{recommendation.turnaround}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleBookSession}
                                className="w-full py-4 bg-white text-[var(--bg-base)] font-bold rounded-xl hover:scale-[1.02] transition-transform shadow-lg"
                            >
                                Book Session Now
                            </button>

                            <button onClick={reset} className="mt-4 text-sm text-[var(--text-muted)] hover:text-white transition-colors">
                                Start Over
                            </button>
                        </div>
                    )}

                    {loading && (
                        <div className="absolute inset-0 bg-[var(--bg-base)]/80 backdrop-blur-sm z-50 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
