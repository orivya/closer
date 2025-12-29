'use client';

import React from 'react';
import { ProfileData } from '@/lib/profile-data';

interface AboutProps {
    profile: ProfileData;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
    // Use profile data with fallbacks
    const displayName = profile.display_name || profile.username;
    const firstName = displayName.split(' ')[0];
    const bio = profile.bio || `${firstName} is a professional audio engineer dedicated to helping artists achieve their sonic vision.`;
    const location = profile.location || 'Remote';

    // Split bio into paragraphs if it contains newlines, otherwise use as single paragraph
    const bioParagraphs = bio.includes('\n') ? bio.split('\n').filter(Boolean) : [bio];

    // Calculate years from account creation or use profile field
    const yearsActive = profile.years_experience ||
        Math.max(1, new Date().getFullYear() - new Date(profile.created_at).getFullYear());

    // Format total streams
    const totalStreams = profile.total_streams || '--';

    // Get location abbreviation (first 3 letters of city)
    const locationAbbr = location.split(',')[0].slice(0, 3).toUpperCase();

    return (
        <section id="about" className="py-32 bg-[var(--bg-base)] relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-20 items-center">

                    <div className="relative order-2 md:order-1">
                        <div className="absolute -inset-4 bg-gradient-to-r from-[var(--accent)] to-purple-900 opacity-20 blur-3xl rounded-full"></div>
                        <div className="relative rounded-2xl overflow-hidden border border-[var(--border-dark)]">
                            <img
                                src={profile.banner_url || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=1000&fit=crop"}
                                alt={`${displayName}'s studio`}
                                className="w-full grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>

                    <div className="order-1 md:order-2">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 tracking-tight">The Engineer<br />Behind The Sound</h2>

                        <div className="space-y-8 text-[var(--text-gray)] text-lg md:text-xl font-light leading-relaxed">
                            {bioParagraphs.map((paragraph, index) => (
                                <p key={index}>
                                    {index === 0 && !paragraph.toLowerCase().includes(firstName.toLowerCase())
                                        ? `My name is ${firstName}. ${paragraph}`
                                        : paragraph
                                    }
                                </p>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-[var(--border-dark)]">
                            <div>
                                <div className="text-4xl font-bold text-white mb-1">{yearsActive}+</div>
                                <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest">Years</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-white mb-1">{locationAbbr}</div>
                                <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest">Base</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-white mb-1">{totalStreams}</div>
                                <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest">Streams</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
