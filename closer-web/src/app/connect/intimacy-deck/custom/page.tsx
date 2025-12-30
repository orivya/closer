"use client";

import Link from "next/link";
import { ArrowLeft, Crown, Eye, Save } from "lucide-react";
import { useState } from "react";

export default function CustomCardPage() {
    const [question, setQuestion] = useState("");
    const [category, setCategory] = useState("Deep");
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect/intimacy-deck" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Custom Card</h1>
                    <div style={{ fontSize: 11, color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Creator Studio
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24, gap: 32 }}>

                {/* Preview Area */}
                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    perspective: '1000px', minHeight: 300
                }}>
                    <div style={{
                        width: 280, height: 400,
                        background: 'linear-gradient(135deg, #1a1a1a, #0e0e0e)',
                        borderRadius: 24, border: '1px solid var(--border-highlight)',
                        padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute', top: 24, right: 24,
                            width: 32, height: 32, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37'
                        }}>
                            <Crown size={14} />
                        </div>

                        <div style={{
                            fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
                            color: 'var(--stone)', marginBottom: 24
                        }}>
                            {category}
                        </div>

                        <h2 style={{
                            fontFamily: 'var(--font-serif)', fontSize: 24, lineHeight: 1.4,
                            textAlign: 'center', color: question ? 'var(--sand)' : 'var(--stone)',
                            opacity: question ? 1 : 0.5
                        }}>
                            {question || "Your question will appear here..."}
                        </h2>
                    </div>
                </div>

                {/* Editor Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Category Name"
                        className="focus-ring"
                        style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                            borderRadius: 12, padding: '12px 16px', color: 'var(--sand)', fontSize: 14
                        }}
                    />

                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What do you want to ask?"
                        className="focus-ring"
                        style={{
                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                            borderRadius: 16, padding: 16, color: 'var(--sand)', fontSize: 16,
                            minHeight: 120, resize: 'none'
                        }}
                    />

                    <button
                        onClick={() => setShowPremiumModal(true)}
                        className="btn btn-primary"
                        style={{
                            background: 'linear-gradient(135deg, #D4AF37, #B4941F)',
                            color: '#000', fontWeight: 600
                        }}
                    >
                        <Save size={18} /> Save to Deck (Premium)
                    </button>
                </div>

            </div>

            {/* Premium Modal Mock */}
            {showPremiumModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'end', justifyContent: 'center'
                }}>
                    <div className="sheet-enter" style={{
                        background: '#111', width: '100%', borderTopLeftRadius: 24, borderTopRightRadius: 24,
                        borderTop: '1px solid var(--border-highlight)', padding: 32, paddingBottom: 60
                    }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                            color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)'
                        }}>
                            <Crown size={28} />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--sand)', textAlign: 'center', marginBottom: 12 }}>
                            Unlock Creator Studio
                        </h2>
                        <p style={{ color: 'var(--stone)', textAlign: 'center', marginBottom: 32, lineHeight: 1.5 }}>
                            Custom cards allow you to ask the specific questions that matter to your relationship. Upgrade to Closer+ to create unlimited cards.
                        </p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button onClick={() => setShowPremiumModal(false)} className="btn" style={{ flex: 1 }}>Maybe Later</button>
                            <button className="btn btn-primary" style={{ flex: 2, background: '#D4AF37', color: '#000' }}>
                                View Plans
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
