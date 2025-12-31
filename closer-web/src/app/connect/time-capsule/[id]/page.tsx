"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Lock, Unlock, Clock, Sparkles } from "lucide-react";
import { useState } from "react";

import { useParams } from "next/navigation";

// Mock Database (Mirroring Hub)
const CAPSULES_DB: Record<string, any> = {
    "c1": {
        id: "c1", title: "First House Keys", unlockDate: "2027-06-15", isLocked: true,
        message: "We finally did it! Remember all the ramen we ate to save up for this? I hope the garden is blooming now.", author: "Partner"
    },
    "c2": {
        id: "c2", title: "1st Anniversary", unlockDate: "2025-11-12", isLocked: false,
        message: "Happy Anniversary my love! It's been one year since we started this journey. I love you more than words can say. Look under the bed for a real gift!", author: "You"
    },
    "c3": {
        id: "c3", title: "Rough Day Note", unlockDate: "2026-01-01", isLocked: true,
        message: "If you're reading this, you probably had a tough day. Just remember that I'm your biggest fan.", author: "Partner"
    },
    "c4": { // Fallback for testing
        id: "c4", title: "Wedding Vows", unlockDate: "2030-05-20", isLocked: true,
        message: "Promising to always leave the last slice of pizza for you.", author: "You"
    }
};

export default function CapsuleDetailPage() {
    const params = useParams();
    // Default to c1 if not found, but try to find by ID
    const id = (params?.id as string) || "c1";
    const capsule = CAPSULES_DB[id] || CAPSULES_DB["c1"];

    // For prototype demo: toggle lock state on click (local override)
    const [isLocked, setIsLocked] = useState(capsule.isLocked);

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10
            }}>
                <Link href="/connect/time-capsule" className="icon-btn focus-ring" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                    <ArrowLeft aria-hidden="true" />
                </Link>
                {/* Secret Toggle for Demo */}
                <button
                    onClick={() => setIsLocked(!isLocked)}
                    style={{ opacity: 0.3, fontSize: 10, color: 'var(--stone)' }}
                >
                    (Dev: Toggle Lock)
                </button>
            </header>

            {isLocked ? (
                /* LOCKED / READY STATE */
                <LockView capsule={capsule} onUnseal={() => setIsLocked(false)} />
            ) : (
                /* UNLOCKED STATE */
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '80px 24px 32px', background: 'linear-gradient(to bottom, rgba(212, 175, 55, 0.1), transparent)' }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%', background: '#D4AF37',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000',
                            marginBottom: 24, boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
                        }}>
                            <Unlock size={28} />
                        </div>
                        <div style={{ fontSize: 13, color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                            Unlocked Memory
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--sand)' }}>
                            {capsule.title}
                        </h1>
                    </div>

                    <div className="container" style={{ flex: 1, padding: 24 }}>
                        <div className="glass" style={{ padding: 32, borderRadius: 24, minHeight: 300 }}>
                            <p style={{ fontSize: 18, fontFamily: 'var(--font-serif)', lineHeight: 1.8, color: 'var(--sand)', whiteSpace: 'pre-line' }}>
                                "{capsule.message}"
                            </p>
                            <div style={{ marginTop: 32, paddingTop: 32, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: 13, color: 'var(--stone)' }}>
                                    Written by {capsule.author}
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--stone)' }}>
                                    {capsule.unlockDate}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

function LockView({ capsule, onUnseal }: { capsule: any, onUnseal: () => void }) {
    const [unsealing, setUnsealing] = useState(false);

    // Calculate days left
    const now = new Date();
    const unlock = new Date(capsule.unlockDate);
    const diffTime = unlock.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isReady = daysLeft <= 0;

    function handleTap() {
        if (!isReady) return;
        setUnsealing(true);
        // Animation sequence: Shake (1s) -> Pop (0.2s) -> Unlock
        setTimeout(() => {
            onUnseal();
        }, 1200);
    }

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>

            <button
                onClick={handleTap}
                disabled={!isReady}
                className={unsealing ? "animate-shake" : isReady ? "pressable focus-ring animate-float" : ""}
                style={{
                    width: 140, height: 140, borderRadius: '50%',
                    background: isReady
                        ? 'linear-gradient(135deg, #D4AF37 0%, #997b20 100%)' // Gold if ready
                        : 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))',
                    border: isReady ? 'none' : '1px solid rgba(212, 175, 55, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isReady ? '#000' : '#D4AF37', marginBottom: 32,
                    boxShadow: isReady ? '0 0 50px rgba(212, 175, 55, 0.4)' : '0 0 30px rgba(212, 175, 55, 0.1)',
                    cursor: isReady ? 'pointer' : 'default',
                    transition: 'all 0.3s'
                }}
            >
                {unsealing ? (
                    <Sparkles size={48} className="spin-slow" />
                ) : isReady ? (
                    <Unlock size={48} />
                ) : (
                    <Lock size={48} />
                )}
            </button>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--sand)', marginBottom: 12 }}>
                {unsealing ? "Unsealing..." : isReady ? "Ready to Open" : "Locked"}
            </h1>

            <p style={{ color: 'var(--stone)', fontSize: 16, maxWidth: 300, lineHeight: 1.6, marginBottom: 32 }}>
                {isReady
                    ? "The wait is over. Tap the lock to reveal this memory."
                    : <>This memory is preserved in the vault until <strong>{capsule.unlockDate}</strong>.</>}
            </p>

            {!isReady && (
                <div style={{
                    padding: '12px 24px', borderRadius: 100, background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10
                }}>
                    <Clock size={16} color="var(--stone)" />
                    <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', color: 'var(--stone)' }}>
                        {daysLeft} Days Left
                    </span>
                </div>
            )}
        </div>
    );
}
