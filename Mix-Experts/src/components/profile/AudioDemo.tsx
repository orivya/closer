'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const GENRES = ['R&B', 'Rap', 'Pop', 'Soul'];

export const AudioDemo: React.FC = () => {
    const [activeGenre, setActiveGenre] = useState('R&B');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMixed, setIsMixed] = useState(true);
    const [progress, setProgress] = useState(35); // Initial visual progress

    // Simulation for progress bar
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <section id="demo" className="py-24 relative overflow-hidden bg-[var(--bg-base)]">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%]"
                style={{ background: 'radial-gradient(ellipse at center, var(--accent-subtle) 0%, transparent 60%)' }} />

            <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-8 h-px bg-[var(--accent)] opacity-50"></span>
                        <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em]">Hear the Difference</span>
                        <span className="w-8 h-px bg-[var(--accent)] opacity-50"></span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Before & After</h2>
                    <p className="text-[var(--text-gray)]">Listen to real transformations across multiple genres</p>
                </div>

                {/* Genre Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                    {GENRES.map((genre) => (
                        <button
                            key={genre}
                            onClick={() => setActiveGenre(genre)}
                            className={cn(
                                "px-6 py-2 text-sm font-semibold rounded-full border transition-all",
                                activeGenre === genre
                                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                                    : "bg-[var(--bg-card)] text-[var(--text-gray)] border-[var(--border-dark)] hover:text-white hover:bg-[var(--bg-hover)]"
                            )}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                {/* Player Card */}
                <div className="max-w-3xl mx-auto bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-[var(--bg-card)] rounded-xl flex items-center justify-center text-[var(--accent)]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
                                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="text-white font-bold">{activeGenre} Demo Track</div>
                            <div className="text-sm text-[var(--text-muted)]">Before & After Comparison</div>
                        </div>

                        {/* Toggle Switch */}
                        <button
                            onClick={() => setIsMixed(!isMixed)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-full border transition-all",
                                isMixed
                                    ? "bg-[var(--bg-hover)] border-[var(--border-dark)]"
                                    : "bg-[var(--bg-card)] border-[var(--border-dark)]"
                            )}
                        >
                            <span className={cn(
                                "text-xs font-bold uppercase tracking-wider",
                                isMixed ? "text-white" : "text-[var(--text-gray)]"
                            )}>
                                {isMixed ? 'Mixed' : 'Raw'}
                            </span>
                            <div className={cn(
                                "w-10 h-5 rounded-full relative transition-colors",
                                isMixed ? "bg-[var(--accent)]" : "bg-[var(--bg-card)] border border-[var(--text-muted)]"
                            )}>
                                <div className={cn(
                                    "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform",
                                    isMixed ? "translate-x-5" : "translate-x-0"
                                )} />
                            </div>
                        </button>
                    </div>

                    {/* Waveform Visualization */}
                    <div className="relative h-24 bg-[var(--bg-card)] rounded-xl mb-8 overflow-hidden group cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                        <div className="absolute inset-0 flex items-center justify-center gap-1 px-4">
                            {[...Array(40)].map((_, i) => {
                                // Use deterministic heights to avoid hydration mismatch
                                const heights = [50, 35, 70, 90, 45, 100, 60, 40, 80, 55, 65, 42, 88, 33, 75, 58, 95, 48, 72, 38];
                                const baseHeight = heights[i % heights.length];
                                // Add slight animation variation when playing using index-based offset
                                const height = isPlaying ? baseHeight + ((i * 7) % 30) : baseHeight;
                                return (
                                    <div
                                        key={i}
                                        className="flex-1 max-w-[4px] bg-[var(--accent)] rounded-full opacity-60 group-hover:opacity-80 transition-all duration-300"
                                        style={{ height: `${height}%` }}
                                    />
                                )
                            })}
                        </div>
                        {/* Progress Bar Overlay */}
                        <div className="absolute bottom-0 left-0 h-1 bg-[var(--accent)] transition-all ease-linear" style={{ width: `${progress}%` }} />

                        {/* Hover Indicators */}
                        <div className="absolute top-2 left-3 px-2 py-0.5 bg-black/50 backdrop-blur rounded text-[10px] font-bold text-[var(--text-gray)]">
                            Before
                        </div>
                        <div className="absolute top-2 right-3 px-2 py-0.5 bg-black/50 backdrop-blur rounded text-[10px] font-bold text-[var(--accent)]">
                            After
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[var(--text-muted)] w-10 text-right">0:42</span>

                        <div className="flex items-center gap-6">
                            <button className="text-[var(--text-muted)] hover:text-white transition-colors">
                                <SkipBack className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-14 h-14 bg-[var(--accent)] rounded-full flex items-center justify-center text-white shadow-[0_0_24px_var(--accent-glow)] hover:scale-105 transition-all"
                            >
                                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                            </button>
                            <button className="text-[var(--text-muted)] hover:text-white transition-colors">
                                <SkipForward className="w-5 h-5" />
                            </button>
                        </div>

                        <span className="text-xs font-medium text-[var(--text-muted)] w-10">3:24</span>
                    </div>

                    <div className="mt-8 pt-8 border-t border-[var(--border-dark)] flex justify-center">
                        <a href="#" className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-dark)] text-sm font-semibold text-[var(--text-gray)] hover:text-white hover:border-[var(--accent)] hover:bg-[var(--bg-hover)] transition-all">
                            <ExternalLink className="w-4 h-4" />
                            Listen on Spotify
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
