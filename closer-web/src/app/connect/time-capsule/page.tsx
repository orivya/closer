"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Lock, Plus, Unlock } from "lucide-react";
import { useState } from "react";

type Capsule = {
    id: string;
    title: string;
    unlockDate: string;
    isLocked: boolean;
    preview: string;
};

const SAMPLE_CAPSULES: Capsule[] = [
    { id: "c1", title: "First House", unlockDate: "2027-06-15", isLocked: true, preview: "Open when we get the keys..." },
    { id: "c2", title: "1st Anniversary", unlockDate: "2025-11-12", isLocked: false, preview: "Read this on our special day..." },
    { id: "c3", title: "A bad day", unlockDate: "2026-01-01", isLocked: true, preview: "For when you need a pick-me-up..." },
];

export default function TimeCapsulePage() {
    const [filter, setFilter] = useState<"ALL" | "LOCKED" | "READY">("ALL");

    const filtered = SAMPLE_CAPSULES.filter(c => {
        if (filter === "LOCKED") return c.isLocked;
        if (filter === "READY") return !c.isLocked;
        return true;
    });

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0, overflowY: 'auto' }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)',
                position: 'sticky', top: 0, zIndex: 50
            }}>
                <Link href="/connect" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Time Capsule</h1>
                    <div style={{ fontSize: 11, color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
                        The Vault
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24 }}>

                {/* Filters */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, paddingBottom: 4, overflowX: 'auto' }}>
                    {(["ALL", "LOCKED", "READY"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className="focus-ring"
                            style={{
                                padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                                background: filter === f ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                                color: filter === f ? '#D4AF37' : 'var(--stone)',
                                border: filter === f ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid var(--border-subtle)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {f === "ALL" ? "All Capsules" : f === "LOCKED" ? "Locked" : "Ready to Open"}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: 16
                }}>
                    {/* Add New Tile */}
                    <Link
                        href="/connect/time-capsule/create"
                        className="focus-ring pressable"
                        style={{
                            aspectRatio: '4/5', borderRadius: 24, border: '1px dashed rgba(212, 175, 55, 0.3)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(212, 175, 55, 0.02)', gap: 12, color: '#D4AF37',
                            textDecoration: 'none', transition: 'all 0.2s'
                        }}
                    >
                        <div style={{
                            width: 48, height: 48, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)',
                            display: 'grid', placeItems: 'center', boxShadow: '0 0 15px rgba(212, 175, 55, 0.1)'
                        }}>
                            <Plus size={24} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>New Capsule</span>
                    </Link>

                    {filtered.map(capsule => (
                        <Link
                            key={capsule.id}
                            href={`/connect/time-capsule/${capsule.id}`}
                            className="pressable focus-ring"
                            style={{
                                position: 'relative', borderRadius: 24, overflow: 'hidden',
                                border: '1px solid var(--border-subtle)',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                                display: 'flex', flexDirection: 'column', textDecoration: 'none'
                            }}
                        >
                            <div style={{
                                padding: 20, flex: 1, display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16
                            }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 12,
                                    background: capsule.isLocked ? 'rgba(255,255,255,0.05)' : 'rgba(212, 175, 55, 0.1)',
                                    color: capsule.isLocked ? 'var(--stone)' : '#D4AF37',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {capsule.isLocked ? <Lock size={20} /> : <Unlock size={20} />}
                                </div>

                                <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--sand)', marginBottom: 4, lineHeight: 1.3 }}>
                                        {capsule.title}
                                    </h3>
                                    <div style={{ fontSize: 12, color: 'var(--stone)' }}>
                                        {capsule.unlockDate}
                                    </div>
                                </div>
                            </div>

                            {/* Status Bar */}
                            <div style={{
                                padding: '12px', background: 'rgba(0,0,0,0.2)',
                                borderTop: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                            }}>
                                {capsule.isLocked ? (
                                    <>
                                        <Clock size={12} color="var(--stone)" />
                                        <span style={{ fontSize: 11, color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Locked</span>
                                    </>
                                ) : (
                                    <>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', boxShadow: '0 0 8px #D4AF37' }} />
                                        <span style={{ fontSize: 11, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Open Now</span>
                                    </>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
