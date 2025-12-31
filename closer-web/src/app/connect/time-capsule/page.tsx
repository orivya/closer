"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Lock, Plus, Unlock, Shield, Calendar } from "lucide-react";
import { useState } from "react";

// Mock Data
const CAPSULES = [
    { id: "c1", title: "First House Keys", unlockDate: "2027-06-15", isLocked: true, type: 'milestone' },
    { id: "c2", title: "1st Anniversary", unlockDate: "2025-11-12", isLocked: false, type: 'memory' },
    { id: "c3", title: "Rough Day Note", unlockDate: "2026-01-01", isLocked: true, type: 'comfort' },
    { id: "c4", title: "Wedding Vows", unlockDate: "2030-05-20", isLocked: true, type: 'milestone' },
];

export default function TimeCapsuleHub() {
    const [filter, setFilter] = useState<"ALL" | "LOCKED" | "READY">("ALL");

    const filtered = CAPSULES.filter(c => {
        if (filter === "LOCKED") return c.isLocked;
        if (filter === "READY") return !c.isLocked;
        return true;
    });

    return (
        <main className="view active" style={{
            display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0,
            background: 'var(--base)'
        }}>

            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Time Capsule</h1>
                    <div style={{ fontSize: 11, color: '#D4AF37', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        The Vault
                    </div>
                </div>
                <div style={{ width: 42 }} /> {/* Balancer */}
            </header>

            {/* Main Content */}
            <div className="container" style={{ flex: 1, padding: 24, overflowY: 'auto' }}>

                {/* Vault Status Card */}
                <div style={{
                    marginBottom: 32, padding: 24, borderRadius: 24,
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(0,0,0,0))',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37'
                            }}>
                                <Shield size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: 13, color: 'var(--sand)', fontWeight: 600 }}>Secure Storage</div>
                                <div style={{ fontSize: 11, color: 'var(--stone)' }}>{CAPSULES.filter(c => c.isLocked).length} Capsules Sealed</div>
                            </div>
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--stone)', lineHeight: 1.5 }}>
                            Store memories for the future. Messages remain locked until the perfect moment arrives.
                        </p>
                    </div>
                    {/* Decorative Background Icon */}
                    <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.1, color: '#D4AF37', transform: 'rotate(-15deg)' }}>
                        <Lock size={120} />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
                    {["ALL", "LOCKED", "READY"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className="pressable focus-ring"
                            style={{
                                padding: '8px 20px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                                background: filter === f ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                                color: filter === f ? '#1c1917' : 'var(--stone)',
                                border: filter === f ? 'none' : '1px solid var(--border-subtle)',
                                minWidth: 80, transition: 'all 0.2s'
                            }}
                        >
                            {f === "ALL" ? "All" : f}
                        </button>
                    ))}
                </div>

                {/* Capsules Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>

                    {/* Create New Capsule Tile */}
                    <Link href="/connect/time-capsule/create" className="pressable focus-ring" style={{
                        aspectRatio: '0.85', borderRadius: 24, border: '1px dashed rgba(212, 175, 55, 0.4)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(212, 175, 55, 0.05)', color: '#D4AF37', textDecoration: 'none', gap: 12
                    }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)',
                            display: 'grid', placeItems: 'center', boxShadow: '0 0 20px rgba(212, 175, 55, 0.15)'
                        }}>
                            <Plus size={24} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>New Capsule</span>
                    </Link>

                    {filtered.map(capsule => (
                        <Link key={capsule.id} href={`/connect/time-capsule/${capsule.id}`} className="pressable focus-ring" style={{ textDecoration: 'none' }}>
                            <div className="glass" style={{
                                aspectRatio: '0.85', borderRadius: 24, padding: 16,
                                display: 'flex', flexDirection: 'column',
                                background: 'var(--surface-1)', border: '1px solid var(--border-subtle)',
                                position: 'relative', overflow: 'hidden'
                            }}>
                                <div style={{
                                    alignSelf: 'flex-start', padding: 8, borderRadius: 12, marginBottom: 'auto',
                                    background: capsule.isLocked ? 'rgba(255,255,255,0.05)' : 'rgba(212, 175, 55, 0.2)',
                                    color: capsule.isLocked ? 'var(--stone)' : '#D4AF37'
                                }}>
                                    {capsule.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                                </div>

                                <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--sand)', marginBottom: 6, lineHeight: 1.3 }}>
                                        {capsule.title}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--stone)' }}>
                                        <Calendar size={10} />
                                        {capsule.unlockDate}
                                    </div>
                                </div>

                                {capsule.isLocked && (
                                    <div style={{
                                        position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
                                        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8))',
                                        pointerEvents: 'none', borderRadius: 24
                                    }} />
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </main>
    );
}
