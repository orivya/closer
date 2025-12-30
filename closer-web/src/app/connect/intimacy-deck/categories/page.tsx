"use client";

import Link from "next/link";
import { ArrowLeft, Lock, Star, Sparkles, Heart, Moon, Zap } from "lucide-react";

type Category = {
    id: string;
    name: string;
    count: number;
    completed: number;
    icon: React.ElementType;
    color: string;
    isPremium: boolean;
};

const CATEGORIES: Category[] = [
    { id: "c1", name: "Intimacy", count: 48, completed: 12, icon: Heart, color: "var(--clay)", isPremium: false },
    { id: "c2", name: "Deep Dive", count: 36, completed: 8, icon: Moon, color: "#8AA686", isPremium: false },
    { id: "c3", name: "Fun & Play", count: 24, completed: 18, icon: Sparkles, color: "#D4AF37", isPremium: false },
    { id: "c4", name: "Spicy", count: 50, completed: 0, icon: Zap, color: "#FF6B6B", isPremium: true },
    { id: "c5", name: "Future", count: 20, completed: 0, icon: Star, color: "var(--mist)", isPremium: true },
];

export default function CategoriesPage() {
    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect/intimacy-deck" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Decks</h1>
                    <div style={{ fontSize: 11, color: 'var(--stone)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Choose a vibe
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            className="focus-ring"
                            style={{
                                position: 'relative',
                                display: 'flex', flexDirection: 'column',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 24,
                                padding: 20,
                                textAlign: 'left',
                                height: 180,
                                overflow: 'hidden',
                                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                        >
                            <div style={{
                                width: 40, height: 40, borderRadius: 12,
                                background: `${cat.color}20`, color: cat.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 'auto'
                            }}>
                                <cat.icon size={20} />
                            </div>

                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--sand)', marginBottom: 4 }}>{cat.name}</h3>
                                <div style={{ fontSize: 12, color: 'var(--stone)', marginBottom: 12 }}>
                                    {cat.completed}/{cat.count} cards
                                </div>

                                {/* Progress Bar */}
                                <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 10 }}>
                                    <div style={{
                                        width: `${(cat.completed / cat.count) * 100}%`,
                                        height: '100%',
                                        background: cat.color,
                                        borderRadius: 10
                                    }} />
                                </div>
                            </div>

                            {/* Premium Lock Overlay */}
                            {cat.isPremium && (
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'rgba(10,10,10,0.6)',
                                    backdropFilter: 'blur(4px)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    gap: 8, color: '#fff'
                                }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}>
                                        <Lock size={14} />
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Closer+</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
}
