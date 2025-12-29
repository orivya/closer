'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, MoreHorizontal } from 'lucide-react';
import { WaveformVisualizer } from './WaveformVisualizer';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
    trackName: string;
    artistName: string;
    duration: string; // e.g., "3:45"
    onCommentAdd: (timestamp: string) => void;
    currentTimestamp?: number; // External control for seek
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
    trackName,
    artistName,
    duration,
    onCommentAdd,
    currentTimestamp = 0
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0); // 0-100
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);

    // Parse duration to seconds (simple mock parser)
    const parseDuration = (dur: string) => {
        const [m, s] = dur.split(':').map(Number);
        return m * 60 + s;
    };
    const totalSeconds = parseDuration(duration);

    // Mock Playback Interval
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + (100 / totalSeconds) * 0.1; // Update every 100ms
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying, totalSeconds]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const formatTime = (percent: number) => {
        const currentSec = Math.floor((percent / 100) * totalSeconds);
        const m = Math.floor(currentSec / 60);
        const s = currentSec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-3xl overflow-hidden shadow-2xl">
            {/* Main Visualizer Area */}
            <div className="relative p-8 pb-4 bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-base)]">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">{trackName}</h2>
                        <p className="text-[var(--text-muted)]">{artistName}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--border-dark)] rounded-full text-xs font-bold text-white transition-colors"
                            onClick={() => onCommentAdd(formatTime(progress))}
                        >
                            + Add Comment at {formatTime(progress)}
                        </button>
                    </div>
                </div>

                <WaveformVisualizer
                    progress={progress}
                    onSeek={setProgress}
                    height={160}
                />

                {/* Time Indicators */}
                <div className="flex justify-between mt-2 text-xs font-mono text-[var(--text-muted)]">
                    <span>{formatTime(progress)}</span>
                    <span>{duration}</span>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="px-8 py-4 bg-[var(--bg-card)] border-t border-[var(--border-dark)] flex items-center justify-between">

                {/* Transport Controls */}
                <div className="flex items-center gap-6">
                    <button className="text-[var(--text-muted)] hover:text-white transition-colors">
                        <SkipBack className="w-5 h-5" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                    </button>

                    <button className="text-[var(--text-muted)] hover:text-white transition-colors">
                        <SkipForward className="w-5 h-5" />
                    </button>

                    <button className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors ml-2">
                        <Repeat className="w-4 h-4" />
                    </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMuted(!isMuted)} className="text-[var(--text-muted)] hover:text-white transition-colors">
                        {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <div className="w-24 h-1.5 bg-[var(--border-dark)] rounded-full overflow-hidden relative group cursor-pointer">
                        <div
                            className="absolute top-0 left-0 bottom-0 bg-[var(--text-muted)] group-hover:bg-[var(--accent)] transition-colors"
                            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
