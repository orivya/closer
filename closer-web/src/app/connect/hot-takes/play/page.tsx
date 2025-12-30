"use client";

import Link from "next/link";
import { ArrowLeft, Flame, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PlayContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get("c") || "General";

    const [rating, setRating] = useState<number | null>(null); // 1 (Cold) to 5 (Fire)

    // Mock Data - In real app, this would fetch based on category
    const statement = "It’s better to be always 10 minutes early than 1 minute late.";

    function handleRate(level: number) {
        setRating(level);
        // Simulate short network delay then go to details
        setTimeout(() => {
            const params = new URLSearchParams();
            params.set("c", category);
            params.set("q", statement);
            params.set("r", level.toString());
            router.push(`/connect/hot-takes/results?${params.toString()}`);
        }, 400);
    }

    function getFlameColor(level: number) {
        // Gradient from Stone (1) to Clay/Red (5)
        if (level === 1) return "#9CA3AF"; // Stone
        if (level === 2) return "#C4B5FD"; // Mist
        if (level === 3) return "#F5E6D3"; // Sand
        if (level === 4) return "#E09F7D"; // Clay
        return "#FF6B6B"; // Fire Red
    }

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect/hot-takes/categories" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Hot Takes</h1>
                    <div style={{ fontSize: 11, color: 'var(--clay)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {category}
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

                {/* Fire Icon pulse */}
                <div style={{
                    width: 80, height: 80, borderRadius: '50%', background: 'rgba(224, 159, 125, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32,
                    boxShadow: '0 0 40px rgba(224, 159, 125, 0.15)'
                }}>
                    <Flame size={40} style={{ color: 'var(--clay)' }} />
                </div>

                {/* The Take */}
                <div style={{
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
                    color: 'var(--stone)', marginBottom: 16
                }}>
                    {category}
                </div>
                <h2 style={{
                    fontFamily: 'var(--font-serif)', fontSize: 28, lineHeight: 1.3,
                    textAlign: 'center', color: 'var(--sand)', maxWidth: 400, marginBottom: 48
                }}>
                    "{statement}"
                </h2>

                {/* Rating Instructions */}
                <div style={{ marginBottom: 24, fontSize: 13, color: 'var(--stone)' }}>
                    How much do you agree?
                </div>

                {/* Rating Scale */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <ThumbsDown size={16} style={{ color: 'var(--stone)' }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[1, 2, 3, 4, 5].map((level) => {
                            const isActive = rating !== null && level <= rating;
                            return (
                                <button
                                    key={level}
                                    onClick={() => handleRate(level)}
                                    className="focus-ring"
                                    style={{
                                        width: 44,
                                        height: 56,
                                        borderRadius: 12,
                                        border: '1px solid',
                                        borderColor: isActive ? getFlameColor(level) : 'var(--border-subtle)',
                                        background: isActive ? `${getFlameColor(level)}20` : 'rgba(255,255,255,0.03)',
                                        color: isActive ? getFlameColor(level) : 'var(--stone)',
                                        cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                                        transform: isActive ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                >
                                    <Flame size={20} style={{ fill: isActive ? 'currentColor' : 'transparent', transition: 'fill 0.2s' }} />
                                </button>
                            );
                        })}
                    </div>
                    <ThumbsUp size={16} style={{ color: 'var(--stone)' }} />
                </div>

            </div>
        </main>
    );
}

export default function HotTakesPlayPage() {
    return (
        <Suspense fallback={<div className="view active" />}>
            <PlayContent />
        </Suspense>
    );
}
