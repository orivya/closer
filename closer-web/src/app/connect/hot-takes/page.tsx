"use client";

import Link from "next/link";
import { ArrowLeft, Flame, Info, MessageCircle, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

type HotTake = {
    id: string;
    statement: string;
    category: string;
};

const SAMPLE_TAKES: HotTake[] = [
    { id: "t1", statement: "Pineapple absolutely belongs on pizza.", category: "Food" },
    { id: "t2", statement: "It’s better to be always 10 minutes early than 1 minute late.", category: "Habits" },
    { id: "t3", statement: "Voice messages are superior to text messages.", category: "Communication" },
    { id: "t4", statement: "The toilet paper must roll over, not under.", category: "House Rules" },
];

export default function HotTakesPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [rating, setRating] = useState<number | null>(null); // 1 (Cold) to 5 (Fire)
    const [isRevealed, setIsRevealed] = useState(false);

    // Mock Partner Answer (random for demo)
    const [partnerRating, setPartnerRating] = useState<number | null>(null);

    const currentTake = SAMPLE_TAKES[currentIndex];

    function handleRate(value: number) {
        setRating(value);
        // Simulate network delay for reveal
        setTimeout(() => {
            setPartnerRating(Math.floor(Math.random() * 5) + 1); // Random 1-5
            setIsRevealed(true);
        }, 400);
    }

    function nextTake() {
        setIsRevealed(false);
        setRating(null);
        setPartnerRating(null);
        setCurrentIndex((i) => (i + 1) % SAMPLE_TAKES.length);
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
                <Link href="/connect" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Hot Takes</h1>
                    <div style={{ fontSize: 11, color: 'var(--clay)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Spicy Debates
                    </div>
                </div>
                <button className="icon-btn focus-ring">
                    <Info aria-hidden="true" />
                </button>
            </header>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

                {/* Fire Icon pulse */}
                <div style={{
                    width: 80, height: 80, borderRadius: '50%', background: 'rgba(224, 159, 125, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32,
                    boxShadow: '0 0 40px rgba(224, 159, 125, 0.15)'
                }}>
                    <Flame size={40} style={{ color: 'var(--clay)', fill: isRevealed ? 'var(--clay)' : 'transparent', transition: 'all 0.5s' }} />
                </div>

                {/* The Take */}
                <div style={{
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
                    color: 'var(--stone)', marginBottom: 16
                }}>
                    {currentTake.category}
                </div>
                <h2 style={{
                    fontFamily: 'var(--font-serif)', fontSize: 28, lineHeight: 1.3,
                    textAlign: 'center', color: 'var(--sand)', maxWidth: 400, marginBottom: 48
                }}>
                    "{currentTake.statement}"
                </h2>

                {/* Rating Instructions */}
                {!isRevealed && (
                    <div style={{ marginBottom: 24, fontSize: 13, color: 'var(--stone)' }}>
                        How much do you agree?
                    </div>
                )}

                {/* Rating Scale */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <ThumbsDown size={16} style={{ color: 'var(--stone)' }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[1, 2, 3, 4, 5].map((level) => {
                            const isActive = rating !== null && level <= rating;
                            const isPartner = isRevealed && partnerRating === level;

                            return (
                                <button
                                    key={level}
                                    onClick={() => !isRevealed && handleRate(level)}
                                    className="focus-ring"
                                    disabled={isRevealed}
                                    style={{
                                        width: 44,
                                        height: 56,
                                        borderRadius: 12,
                                        border: '1px solid',
                                        borderColor: isActive ? getFlameColor(level) : 'var(--border-subtle)',
                                        background: isActive ? `${getFlameColor(level)}20` : 'rgba(255,255,255,0.03)',
                                        color: isActive ? getFlameColor(level) : 'var(--stone)',
                                        cursor: isRevealed ? 'default' : 'pointer',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                        position: 'relative',
                                        transform: isActive ? 'scale(1.05)' : 'scale(1)'
                                    }}
                                >
                                    <Flame size={20} style={{ fill: isActive ? 'currentColor' : 'transparent', transition: 'fill 0.3s' }} />
                                    {isPartner && (
                                        <div style={{
                                            position: 'absolute', bottom: -28,
                                            display: 'flex', flexDirection: 'column', alignItems: 'center'
                                        }}>
                                            <div style={{ width: 1, height: 8, background: 'var(--mist)' }} />
                                            <div style={{
                                                background: 'var(--mist)', color: '#000', fontSize: 10, fontWeight: 700,
                                                padding: '2px 6px', borderRadius: 6
                                            }}>THEM</div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <ThumbsUp size={16} style={{ color: 'var(--stone)' }} />
                </div>

            </div>

            {/* Footer / Results */}
            <div style={{ padding: '24px', minHeight: 120 }}>
                {isRevealed && (
                    <div className="glass" style={{ borderRadius: 24, padding: '20px', animation: 'fade-in-up 0.5s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                            <div className="chat-avatar-lg" style={{ width: 32, height: 32, fontSize: 14 }}>E</div>
                            <div style={{ fontSize: 14, color: 'var(--sand)' }}>
                                Emma voted <strong style={{ color: getFlameColor(partnerRating!) }}>{partnerRating}/5</strong>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={nextTake} className="btn btn-primary" style={{ flex: 1, padding: 12, fontSize: 14 }}>
                                Next Take
                            </button>
                            <button className="btn" style={{ width: 48, padding: 0 }} aria-label="Discuss">
                                <MessageCircle size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
