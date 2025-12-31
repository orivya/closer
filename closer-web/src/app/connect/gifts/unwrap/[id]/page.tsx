"use client";

import Link from "next/link";
import { ArrowLeft, Gift, Star, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const GIFTS: Record<string, { name: string, icon: string, color: string }> = {
    'rose-1': { name: 'Digital Rose', icon: '🌹', color: '#f43f5e' },
    'coffee-1': { name: 'Morning Coffee', icon: '☕', color: '#ea580c' },
    'massage-1': { name: 'Massage Coupon', icon: '💆‍♀️', color: '#8b5cf6' },
    'date-1': { name: 'Date Night Pass', icon: '🎟️', color: '#db2777' },
    'choco-1': { name: 'Box of Chocolates', icon: '🍫', color: '#78350f' },
    'clean-1': { name: 'Chore Pass', icon: '🧹', color: '#10b981' },
    'kiss-1': { name: '1000 Kisses', icon: '💋', color: '#e11d48' },
    'mystery-1': { name: 'Mystery Box', icon: '🎁', color: '#6366f1' },
};

export default function UnwrapGiftPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const gift = GIFTS[id] || GIFTS['mystery-1'];

    const [stage, setStage] = useState<'wrapped' | 'opening' | 'revealed'>('wrapped');

    function handleOpen() {
        if (stage !== 'wrapped') return;
        setStage('opening');
        setTimeout(() => {
            setStage('revealed');
        }, 1500);
    }

    return (
        <main className="view active" style={{
            display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0,
            background: stage === 'revealed' ? 'var(--base)' : '#0f172a', // Darker background for focus
            overflow: 'hidden', transition: 'background 1s'
        }}>

            {/* Close Button (Only visible after reveal) */}
            {stage === 'revealed' && (
                <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 50, animation: 'fade-in 1s' }}>
                    <Link href="/connect/gifts/inventory" className="icon-btn focus-ring">
                        <X />
                    </Link>
                </div>
            )}

            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* Wrapped State */}
                {stage !== 'revealed' && (
                    <div
                        onClick={handleOpen}
                        className={stage === 'opening' ? 'shake-animation' : 'float-animation'}
                        style={{
                            cursor: 'pointer',
                            position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <div style={{
                            position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                            borderRadius: 32,
                            boxShadow: '0 25px 50px -12px rgba(251, 191, 36, 0.4)',
                            transform: stage === 'opening' ? 'scale(1.1)' : 'scale(1)',
                            transition: 'transform 0.3s'
                        }} />
                        <Gift size={80} color="#fff" style={{ position: 'relative', zIndex: 10 }} />
                        <div style={{
                            position: 'absolute', bottom: -40, left: 0, right: 0, textAlign: 'center',
                            color: '#fbbf24', fontWeight: 700, letterSpacing: '0.1em', fontSize: 13,
                            opacity: stage === 'opening' ? 0 : 1, transition: 'opacity 0.2s'
                        }}>
                            TAP TO OPEN
                        </div>
                    </div>
                )}

                {/* Revealed State */}
                {stage === 'revealed' && (
                    <div className="fade-in-up" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        {/* Glow Behind */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: 300, height: 300, background: `radial-gradient(circle, ${gift.color}40 0%, transparent 70%)`,
                            filter: 'blur(40px)', zIndex: -1
                        }} />

                        <div className="pop-in" style={{
                            fontSize: 100, marginBottom: 24
                        }}>
                            {gift.icon}
                        </div>

                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 42, color: 'var(--sand)', marginBottom: 16 }}>
                            {gift.name}
                        </h1>

                        <div className="glass" style={{
                            padding: 24, borderRadius: 24, maxWidth: 320,
                            border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.03)'
                        }}>
                            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)', fontStyle: 'italic', marginBottom: 12 }}>
                                "Thinking of you always..."
                            </p>
                            <div style={{ fontSize: 13, color: 'var(--stone)', fontWeight: 600 }}>
                                - FROM YOUR PARTNER
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/connect/gifts/inventory')}
                            className="btn btn-primary focus-ring pressable"
                            style={{
                                marginTop: 40, padding: '16px 32px', borderRadius: 100,
                                background: '#fff', color: '#000', fontWeight: 700
                            }}
                        >
                            Save to Treasure Chest
                        </button>

                    </div>
                )}

            </div>
        </main>
    );
}
