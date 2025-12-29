'use client';

import React from 'react';
import { useOnboarding } from '@/context/OnboardingContext';
import { User, MapPin, Mic2, Music, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Step1Identity = () => {
    const { data, updateData, nextStep } = useOnboarding();

    const ROLES = [
        { id: 'engineer', label: 'Mix Engineer', icon: Mic2, desc: 'I mix and master tracks for clients.' },
        { id: 'mastering', label: 'Mastering Engineer', icon: Music, desc: 'I provide the final polish for releases.' },
        { id: 'producer', label: 'Producer', icon: User, desc: 'I make beats and produce full songs.' },
    ];

    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome to MixExperts</h1>
                <p className="text-[var(--text-gray)]">Let's set up your professional profile. First, tell us who you are.</p>
            </div>

            <div className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">I am primarily a...</label>
                    <div className="grid md:grid-cols-3 gap-4">
                        {ROLES.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => updateData({ role: role.id as any })}
                                className={cn(
                                    "p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group",
                                    data.role === role.id
                                        ? "bg-[var(--accent)] border-[var(--accent)] shadow-lg shadow-[var(--accent-glow)]"
                                        : "bg-[var(--bg-elevated)] border-[var(--border-dark)] hover:border-white/20"
                                )}
                            >
                                <role.icon className={cn(
                                    "w-6 h-6 mb-3",
                                    data.role === role.id ? "text-white" : "text-[var(--text-muted)]"
                                )} />
                                <h3 className={cn("font-bold mb-1", data.role === role.id ? "text-white" : "text-white")}>
                                    {role.label}
                                </h3>
                                <p className={cn("text-xs leading-relaxed", data.role === role.id ? "text-white/80" : "text-[var(--text-muted)]")}>
                                    {role.desc}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Input Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Display Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="text"
                                value={data.displayName}
                                onChange={(e) => updateData({ displayName: e.target.value })}
                                placeholder="e.g. James Mix"
                                className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-faint)]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                            <input
                                type="text"
                                value={data.location}
                                onChange={(e) => updateData({ location: e.target.value })}
                                placeholder="e.g. Los Angeles, CA"
                                className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-faint)]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={nextStep}
                disabled={!data.displayName}
                className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_var(--accent-glow)] flex items-center justify-center gap-2"
            >
                Continue to Profile
                <Check className="w-4 h-4" />
            </button>
        </div>
    );
};
