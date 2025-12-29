'use client';

import React from 'react';
import { User, Globe, Instagram, Twitter, Music, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ProfileSettingsForm = () => {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--accent)] border border-[var(--border-dark)]" aria-hidden="true">
                    <User className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Basic Information</h3>
                    <p className="text-sm text-[var(--text-gray)]">This info will be displayed on your public profile.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Display Name */}
                <div className="space-y-2">
                    <label htmlFor="display-name" className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Display Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                        <input
                            id="display-name"
                            type="text"
                            defaultValue="James Mix"
                            placeholder="e.g. Mix Master Mike"
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-colors placeholder:text-[var(--text-faint)]"
                            aria-label="Your display name shown on your public profile"
                        />
                    </div>
                </div>

                {/* Job Title / Tagline */}
                <div className="space-y-2">
                    <label htmlFor="tagline" className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Tagline</label>
                    <div className="relative">
                        <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                        <input
                            id="tagline"
                            type="text"
                            defaultValue="Professional Mixing & Mastering"
                            placeholder="e.g. Platinum Audio Engineer"
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-colors placeholder:text-[var(--text-faint)]"
                            aria-label="Your professional tagline or job title"
                        />
                    </div>
                </div>

                {/* Bio */}
                <div className="space-y-2 md:col-span-2">
                    <label htmlFor="bio" className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">About Me</label>
                    <textarea
                        id="bio"
                        rows={5}
                        defaultValue="I am a professional mixing engineer with over 10 years of experience shaping the sound of modern Pop, R&B, and Hip-Hop. My goal is to make your music sound radio-ready while preserving its unique emotion."
                        placeholder="Tell your story..."
                        className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl p-4 text-white focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-colors placeholder:text-[var(--text-faint)] resize-none"
                        aria-label="Your biography and professional background"
                    />
                </div>
            </div>

            {/* Social Links Divider */}
            <div className="py-4 border-t border-[var(--border-dark)]">
                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                    Social & Links
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative group">
                        <label htmlFor="instagram" className="sr-only">Instagram Username</label>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-pink-500 transition-colors">
                            <Instagram className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <input
                            id="instagram"
                            type="text"
                            placeholder="Instagram Username"
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500 transition-colors"
                            aria-label="Your Instagram username"
                        />
                    </div>

                    <div className="relative group">
                        <label htmlFor="twitter" className="sr-only">Twitter Handle</label>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-blue-400 transition-colors">
                            <Twitter className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <input
                            id="twitter"
                            type="text"
                            placeholder="Twitter Handle"
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition-colors"
                            aria-label="Your Twitter handle"
                        />
                    </div>

                    <div className="relative group md:col-span-2">
                        <label htmlFor="website" className="sr-only">Personal Website URL</label>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors">
                            <Globe className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <input
                            id="website"
                            type="url"
                            defaultValue="https://jamesmix.com"
                            placeholder="Personal Website URL"
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-colors"
                            aria-label="Your personal website URL"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
