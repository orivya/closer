'use client';

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface WaveformVisualizerProps {
    progress: number; // 0 to 100
    onSeek: (percentage: number) => void;
    height?: number;
    color?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
    progress,
    onSeek,
    height = 120,
    color = '#A855F7' // Default to purple accent
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoverX, setHoverX] = useState<number | null>(null);

    // Generate deterministic waveform data (simulating audio analysis)
    // Using a seeded pattern to avoid hydration mismatch
    const [waveformData] = useState(() => {
        const seed = [0.45, 0.72, 0.38, 0.91, 0.55, 0.28, 0.84, 0.62, 0.33, 0.78];
        return Array.from({ length: 150 }, (_, i) => seed[i % seed.length] * 0.8 + 0.2);
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize canvas to match container
        const resize = () => {
            if (containerRef.current) {
                canvas.width = containerRef.current.clientWidth * 2; // Retina
                canvas.height = height * 2;
                canvas.style.width = '100%';
                canvas.style.height = `${height}px`;
                draw();
            }
        };

        const draw = () => {
            if (!ctx || !containerRef.current) return;

            const w = canvas.width;
            const h = canvas.height;
            const barWidth = w / waveformData.length;
            const gap = 4; // px
            const effectiveBarWidth = Math.max(2, barWidth - gap); // Provide some gap

            ctx.clearRect(0, 0, w, h);

            waveformData.forEach((value, i) => {
                const x = i * barWidth;
                const barHeight = value * h * 0.8; // Leave some headroom
                const y = (h - barHeight) / 2;

                // Determine if this bar is "played" or "unplayed" based on progress
                const barProgress = (i / waveformData.length) * 100;

                // Color Logic
                if (barProgress <= progress) {
                    ctx.fillStyle = color; // Active color
                } else if (hoverX !== null && i * barWidth / 2 < hoverX * (w / containerRef.current!.clientWidth)) {
                    // Hover state (lighter fill for unplayed area being hovered)
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                } else {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; // Passive color
                }

                // Draw rounded rect (simplified as rect for now, or round edges if easy)
                ctx.beginPath();
                ctx.roundRect(x, y, effectiveBarWidth, barHeight, 10);
                ctx.fill();
            });
        };

        resize();
        window.addEventListener('resize', resize);

        // Re-draw on progress or hover change
        draw();

        return () => window.removeEventListener('resize', resize);
    }, [progress, hoverX, waveformData, height, color]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setHoverX(e.clientX - rect.left);
        }
    };

    const handleMouseLeave = () => {
        setHoverX(null);
    };

    const handleClick = (e: React.MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = (clickX / rect.width) * 100;
            onSeek(Math.min(100, Math.max(0, percentage)));
        }
    };

    return (
        <div
            ref={containerRef}
            className="w-full relative cursor-pointer group"
            style={{ height }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Hover Line Marker */}
            {hoverX !== null && (
                <div
                    className="absolute top-0 bottom-0 w-[1px] bg-white pointer-events-none"
                    style={{ left: hoverX }}
                />
            )}
        </div>
    );
};
