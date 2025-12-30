"use client";

import Link from "next/link";
import { ArrowLeft, History, Play, Users, Split } from "lucide-react";

export default function WYRHubPage() {
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
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Would You Rather</h1>
                    <div style={{ fontSize: 11, color: 'var(--stone)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Hub
                    </div>
                </div>
                <Link href="/connect/would-you-rather/history" className="icon-btn focus-ring">
                    <History aria-hidden="true" size={18} />
                </Link>
            </header>

            {/* Main Content */}
            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Hero Card */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255,255,255,0.02))',
                    borderRadius: 32, padding: 32,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    position: 'relative', overflow: 'hidden', minHeight: 240
                }}>
                    <div style={{
                        position: 'absolute', top: -20, right: -20, width: 120, height: 120,
                        background: 'rgba(139, 92, 246, 0.2)', borderRadius: '50%', filter: 'blur(40px)'
                    }} />

                    <Split size={48} style={{ color: '#8B5CF6', marginBottom: 16 }} />

                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--sand)', marginBottom: 8, textAlign: 'center' }}>
                        Impossible Choices
                    </h2>
                    <p style={{ color: 'var(--stone)', fontSize: 14, textAlign: 'center', marginBottom: 24, maxWidth: 240 }}>
                        Face off against fun, deep, and wild dilemmas. See how your choices compare to the world.
                    </p>

                    <Link
                        href="/connect/would-you-rather/categories"
                        className="btn btn-primary focus-ring pressable"
                        style={{
                            background: '#8B5CF6', color: '#fff', width: '100%', maxWidth: 200,
                            boxShadow: '0 8px 16px -4px rgba(139, 92, 246, 0.4)'
                        }}
                    >
                        <Play size={18} fill="currentColor" /> Start Playing
                    </Link>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Link href="/connect/would-you-rather/history" className="glass pressable" style={{ padding: 20, borderRadius: 24, textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#10B981' }}>
                            <Users size={16} />
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Agreed</span>
                        </div>
                        <div style={{ fontSize: 28, fontFamily: 'var(--font-serif)', color: 'var(--sand)' }}>12</div>
                        <div style={{ fontSize: 12, color: 'var(--stone)' }}>Common Ground</div>
                    </Link>

                    <div className="glass" style={{ padding: 20, borderRadius: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: '#EF4444' }}>
                            <Split size={16} />
                            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Clashed</span>
                        </div>
                        <div style={{ fontSize: 28, fontFamily: 'var(--font-serif)', color: 'var(--sand)' }}>5</div>
                        <div style={{ fontSize: 12, color: 'var(--stone)' }}>Opposites Attract</div>
                    </div>
                </div>

            </div>
        </main>
    );
}
