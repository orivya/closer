'use client';

import React from 'react';
import { Check, FileAudio, AlertCircle, Disc } from 'lucide-react';
import { AudioDemo } from './AudioDemo';
import Link from 'next/link';

interface ServicePageProps {
    onBack?: () => void;
    username?: string;
}

export const ServicePage: React.FC<ServicePageProps> = ({ onBack, username }) => {
    // If username is provided, use Link for "Back to Services". Otherwise fallback to onBack.
    const backLink = username ? `/${username}#services` : null;

    React.useEffect(() => {
        document.title = 'Services | James Mix Audio';
        return () => {
            document.title = 'James Mix — Audio Engineer';
        };
    }, []);

    return (
        <div className="pt-24 min-h-screen bg-[var(--bg-base)] animate-in fade-in duration-500">

            {/* Breadcrumb */}
            <div className="max-w-[1200px] mx-auto px-6 mb-8">
                {backLink ? (
                    <Link href={backLink} className="text-sm text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-2">
                        ← Back to Home
                    </Link>
                ) : (
                    <button onClick={onBack} className="text-sm text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-2">
                        ← Back to Services
                    </button>
                )}
            </div>

            {/* Header */}
            <div className="max-w-[1000px] mx-auto px-6 text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">Professional Mixing</h1>
                <p className="text-xl text-[var(--text-gray)] max-w-2xl mx-auto">
                    Transform your raw recordings into industry-standard, radio-ready masters.
                </p>
            </div>

            {/* Pricing Tiers */}
            <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-3 gap-6 mb-32">
                {/* Tier 1 */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-3xl p-8 hover:border-[var(--accent-subtle)] transition-colors">
                    <div className="text-xl font-bold text-white mb-2">2-Track Mix</div>
                    <div className="text-3xl font-bold text-[var(--accent)] mb-6">$150 <span className="text-sm text-[var(--text-muted)] font-normal">/ song</span></div>
                    <p className="text-[var(--text-gray)] text-sm mb-8">Best for vocalists recording over a single instrumental file (MP3/WAV).</p>
                    <ul className="space-y-4 mb-8">
                        {['Vocal Tuning & Timing', 'EQ, Compression, De-essing', 'Reverb & Delay Effects', 'Mastering Included', '48hr Turnaround'].map(f => (
                            <li key={f} className="flex items-start gap-3 text-sm text-[var(--text-gray)]">
                                <Check className="w-4 h-4 text-[var(--accent)] mt-0.5" />
                                {f}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full py-3 rounded-xl border border-[var(--border-dark)] text-white font-semibold hover:bg-white hover:text-[var(--bg-base)] transition-all">Select</button>
                </div>

                {/* Tier 2 - Featured */}
                <div className="bg-[var(--bg-elevated)] border border-[var(--accent)] rounded-3xl p-8 relative shadow-[0_0_30px_rgba(0,0,0,0.3)] transform md:-translate-y-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--accent)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                    <div className="text-xl font-bold text-white mb-2">Full Mix</div>
                    <div className="text-3xl font-bold text-[var(--accent)] mb-6">$350 <span className="text-sm text-[var(--text-muted)] font-normal">/ song</span></div>
                    <p className="text-[var(--text-gray)] text-sm mb-8">For full sessions with individual stems (Drums, Bass, Guitars, Vocals, etc).</p>
                    <ul className="space-y-4 mb-8">
                        {['Advanced Vocal Production', 'Analog Gear Processing', 'Drum Sample Replacement', 'Unlimited Revisions', 'Stem Delivery', 'Priority Support'].map(f => (
                            <li key={f} className="flex items-start gap-3 text-sm text-white">
                                <Check className="w-4 h-4 text-[var(--accent)] mt-0.5" />
                                {f}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-light)] transition-all shadow-lg">Book Now</button>
                </div>

                {/* Tier 3 */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-3xl p-8 hover:border-[var(--accent-subtle)] transition-colors">
                    <div className="text-xl font-bold text-white mb-2">Album Bundle</div>
                    <div className="text-3xl font-bold text-[var(--accent)] mb-6">Custom <span className="text-sm text-[var(--text-muted)] font-normal">Pricing</span></div>
                    <p className="text-[var(--text-gray)] text-sm mb-8">Cohesive mixing and mastering for EPs and Albums (5+ songs).</p>
                    <ul className="space-y-4 mb-8">
                        {['Consistent Sound Across Project', 'Project Management', 'Bulk Discount Applied', 'Radio & Streaming Masters', 'DDP Delivery'].map(f => (
                            <li key={f} className="flex items-start gap-3 text-sm text-[var(--text-gray)]">
                                <Check className="w-4 h-4 text-[var(--accent)] mt-0.5" />
                                {f}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full py-3 rounded-xl border border-[var(--border-dark)] text-white font-semibold hover:bg-white hover:text-[var(--bg-base)] transition-all">Contact Me</button>
                </div>
            </div>

            {/* Audio Demo Re-use */}
            <AudioDemo />

            {/* How to Prepare Guide */}
            <div className="py-24 bg-[var(--bg-elevated)] border-t border-[var(--border-dark)]">
                <div className="max-w-[1000px] mx-auto px-6">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">Before You Book</h2>

                    <div className="space-y-4">
                        <div className="bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-2xl p-6 flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--border-dark)] flex items-center justify-center shrink-0">
                                <FileAudio className="w-6 h-6 text-[var(--accent)]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Exporting Stems</h3>
                                <p className="text-[var(--text-gray)] text-sm leading-relaxed">
                                    Please export all tracks as individual WAV files (24-bit/44.1kHz or higher).
                                    Ensure all tracks start at the exact same timestamp (0:00).
                                    Bypass any processing (EQ, Compression) unless it&apos;s a specific creative effect.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-2xl p-6 flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--border-dark)] flex items-center justify-center shrink-0">
                                <AlertCircle className="w-6 h-6 text-[var(--accent)]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Labeling & Organization</h3>
                                <p className="text-[var(--text-gray)] text-sm leading-relaxed">
                                    Label tracks clearly (e.g., &quot;Lead Vox&quot;, &quot;Kick&quot;, &quot;Snare&quot;, &quot;Bass&quot;).
                                    Put them in a single folder titled &quot;Artist Name - Song Title - BPM&quot;.
                                    Zip the folder before uploading.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-2xl p-6 flex gap-6 items-start">
                            <div className="w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--border-dark)] flex items-center justify-center shrink-0">
                                <Disc className="w-6 h-6 text-[var(--accent)]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Reference Tracks</h3>
                                <p className="text-[var(--text-gray)] text-sm leading-relaxed">
                                    Include 1-2 songs from other artists that inspire the sound you are looking for.
                                    This helps me understand your vision for the mix.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button className="px-8 py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_var(--accent-glow)]">
                            I&apos;m Ready to Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
