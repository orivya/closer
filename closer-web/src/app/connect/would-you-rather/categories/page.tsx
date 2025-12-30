"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Smile, Briefcase, Heart, Lock } from "lucide-react";

export default function WYRCategoriesPage() {
    const categories = [
        { id: "silly", name: "Silly & Fun", icon: Smile, count: 50, color: "#F59E0B", premium: false },
        { id: "deep", name: "Deep Questions", icon: Sparkles, count: 40, color: "#8B5CF6", premium: false },
        { id: "career", name: "Career & Ambition", icon: Briefcase, count: 30, color: "#10B981", premium: false },
        { id: "spicy", name: "Spicy Scenarios", icon: Heart, count: 45, color: "#EF4444", premium: true },
    ];

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect/would-you-rather" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Select Category</h1>
                    <div style={{ fontSize: 11, color: 'var(--stone)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Choose your dilemma
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.premium ? "#" : `/connect/would-you-rather/play?c=${cat.name}`}
                            className="glass pressable focus-ring"
                            style={{
                                textDecoration: 'none',
                                padding: 24,
                                borderRadius: 24,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 20,
                                position: 'relative',
                                overflow: 'hidden',
                                background: cat.premium
                                    ? 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))'
                                    : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                                border: '1px solid var(--border-subtle)',
                                opacity: cat.premium ? 0.8 : 1
                            }}
                        >
                            {/* Icon */}
                            <div style={{
                                width: 56, height: 56, borderRadius: '50%',
                                background: `${cat.color}20`,
                                color: cat.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <cat.icon size={24} />
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{
                                    fontSize: 18, fontWeight: 600, color: 'var(--sand)', marginBottom: 4,
                                    fontFamily: 'var(--font-serif)'
                                }}>
                                    {cat.name}
                                </h3>
                                <div style={{ fontSize: 12, color: 'var(--stone)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span>{cat.count} Dilemmas</span>
                                    {cat.premium && (
                                        <>
                                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--stone)' }} />
                                            <span style={{ color: '#D4AF37', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                CLOSER+ Only
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Lock (if premium) */}
                            {cat.premium && (
                                <div style={{
                                    position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
                                    color: '#D4AF37'
                                }}>
                                    <Lock size={20} />
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
