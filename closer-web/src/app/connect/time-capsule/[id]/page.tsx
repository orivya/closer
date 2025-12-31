"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Lock, Unlock, Clock } from "lucide-react";
import { useState } from "react";

export default function CapsuleDetailPage() {
    // Mock Data based on ID
    // In a real app we'd fetch params.id
    const capsule = {
        id: "c1",
        title: "First House",
        unlockDate: "2027-06-15",
        isLocked: true, // Toggle this to test unlocked state
        message: "We finally did it! Remember all the ramen we ate to save up for this? I hope the garden is blooming now.",
        author: "Partner"
    };

    // For prototype demo: toggle lock state on click
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
                /* LOCKED STATE */
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>

                    <div style={{
                        width: 120, height: 120, borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#D4AF37', marginBottom: 32,
                        boxShadow: '0 0 30px rgba(212, 175, 55, 0.1)'
                    }}>
                        <Lock size={48} />
                    </div>

                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--sand)', marginBottom: 12 }}>
                        Locked
                    </h1>

                    <p style={{ color: 'var(--stone)', fontSize: 16, maxWidth: 300, lineHeight: 1.6, marginBottom: 32 }}>
                        This memory is preserved in the vault until <strong>{capsule.unlockDate}</strong>.
                    </p>

                    <div style={{
                        padding: '12px 24px', borderRadius: 100, background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10
                    }}>
                        <Clock size={16} color="var(--stone)" />
                        <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', color: 'var(--stone)' }}>
                            482 Days Left
                        </span>
                    </div>

                </div>
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
