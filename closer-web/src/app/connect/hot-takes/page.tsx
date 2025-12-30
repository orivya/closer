"use client";

import Link from "next/link";
import { ArrowLeft, Flame, History, Play, Trophy, Users } from "lucide-react";
import { useState } from "react";

export default function HotTakesHubPage() {
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
                    <div style={{ fontSize: 11, color: 'var(--stone)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Hub
                    </div>
                </div>
                <Link href="/connect/hot-takes/history" className="icon-btn focus-ring">
                    <History aria-hidden="true" size={18} />
                </Link>
            </header>

            {/* Main Content */}
            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Hero Card */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(255,255,255,0.02))',
                    borderRadius: 32, padding: 32,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    position: 'relative', overflow: 'hidden', minHeight: 240
                }}>
                    <div style={{
                        position: 'absolute', top: -20, right: -20, width: 120, height: 120,
                        background: 'rgba(239, 68, 68, 0.2)', borderRadius: '50%', filter: 'blur(40px)'
                    }} />

                    <Flame size={48} style={{ color: '#EF4444', marginBottom: 16 }} />

                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--sand)', marginBottom: 8, textAlign: 'center' }}>
                        Ready to Roast?
                    </h2>
                    <p style={{ color: 'var(--stone)', fontSize: 14, textAlign: 'center', marginBottom: 24, maxWidth: 240 }}>
                        Spark fiery debates on food, habits, and romance. See where you match and where you clash.
                    </p>

                    <Link
                        href="/connect/hot-takes/categories"
                        className="btn btn-primary focus-ring pressable"
                        style={{
                            background: '#EF4444', color: '#000', width: '100%', maxWidth: 200,
                            boxShadow: '0 8px 16px -4px rgba(239, 68, 68, 0.4)'
                        }}
                    >
                        <Play size={18} fill="black" /> Start Playing
                    </Link>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Link href="/connect/hot-takes/history" className="glass pressable" style={{ padding: 20, borderRadius: 24, textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--clay)' }}>
                            <Trophy size={16} />
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Match Rate</span>
                        </div>
                        <div style={{ fontSize: 28, fontFamily: 'var(--font-serif)', color: 'var(--sand)' }}>85%</div>
                        <div style={{ fontSize: 12, color: 'var(--stone)' }}>High Compatibility</div>
                    </Link>

                    <div className="glass" style={{ padding: 20, borderRadius: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#F59E0B' }}>
                            <Users size={16} />
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Topics</span>
                        </div>
                        <div style={{ fontSize: 28, fontFamily: 'var(--font-serif)', color: 'var(--sand)' }}>42</div>
                        <div style={{ fontSize: 12, color: 'var(--stone)' }}>Takes Voted</div>
                    </div>
                </div>

                {/* Recent Session Tease */}
                <div style={{ marginTop: 'auto' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--stone)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.05em' }}>
                        Last Played
                    </div>
                    <Link href="/connect/hot-takes/history" className="glass pressable" style={{ padding: 16, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Flame size={18} color="var(--stone)" />
                        </div>
                        <div>
                            <div style={{ color: 'var(--sand)', fontSize: 14, fontWeight: 500 }}>Pineapple on Pizza</div>
                            <div style={{ color: '#EF4444', fontSize: 12, fontWeight: 700 }}>MISMATCH</div>
                        </div>
                    </Link>
                </div>

            </div>
        </main>
    );
}
