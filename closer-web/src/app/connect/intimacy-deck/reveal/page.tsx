"use client";

import Link from "next/link";
import { ArrowLeft, Heart, RotateCw, Bookmark, Share2 } from "lucide-react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function RevealContent() {
    const [isSaved, setIsSaved] = useState(false);
    const searchParams = useSearchParams();

    const question = searchParams.get("q") || "What is a memory of us that you hope you never forget?";
    // const category = searchParams.get("c"); // Available if needed
    const userAnswer = searchParams.get("a") || "Definitely our first road trip. The car broke down but we just talked for 4 hours waiting for the tow truck.";

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect/intimacy-deck/answer" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Connection</h1>
                    <div style={{ fontSize: 11, color: 'var(--stone)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Answer Revealed
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, overflowY: 'auto' }}>

                {/* The Question */}
                <h2 style={{
                    fontFamily: 'var(--font-serif)', fontSize: 22, lineHeight: 1.4, color: 'var(--sand)',
                    textAlign: 'center', margin: '20px 0 40px'
                }}>
                    "{question}"
                </h2>

                {/* Answers Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Partner Answer (Mocked for now) */}
                    <div className="slide-in-right" style={{ animationDelay: '200ms' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--stone)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>EM</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--sand)' }}>Emma</div>
                        </div>
                        <div className="glass" style={{
                            padding: 24, borderRadius: 24, borderLeft: '4px solid var(--mist)',
                            background: 'linear-gradient(135deg, rgba(196,181,253,0.1), rgba(255,255,255,0.02))'
                        }}>
                            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--sand)', fontStyle: 'italic' }}>
                                "That time we got caught in the rain in Paris and just stood there laughing. We were completely soaked but I felt so warm."
                            </p>
                        </div>
                    </div>

                    {/* Your Answer (Dynamic) */}
                    <div className="slide-in-left">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexDirection: 'row-reverse' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--clay)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>YOU</div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--sand)' }}>You</div>
                        </div>
                        <div className="glass" style={{
                            padding: 24, borderRadius: 24, borderRight: '4px solid var(--clay)',
                            background: 'linear-gradient(135deg, rgba(224,159,125,0.1), rgba(255,255,255,0.02))'
                        }}>
                            <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--sand)' }}>
                                "{userAnswer}"
                            </p>
                        </div>
                    </div>

                </div>

                {/* Actions */}
                <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <button
                            onClick={() => setIsSaved(!isSaved)}
                            className="icon-btn focus-ring"
                            style={{
                                width: 56, height: 56, borderRadius: '50%',
                                background: isSaved ? 'var(--clay)' : 'rgba(255,255,255,0.05)',
                                color: isSaved ? '#000' : 'var(--sand)'
                            }}
                        >
                            <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                        <button className="icon-btn focus-ring" style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}>
                            <Share2 size={24} />
                        </button>
                    </div>

                    <div style={{ width: 1, height: 40, background: 'var(--border-subtle)' }} />

                    <Link href="/connect/intimacy-deck" className="btn btn-primary" style={{ width: '100%', maxWidth: 300 }}>
                        <RotateCw size={18} /> Draw Next Card
                    </Link>
                </div>

            </div>
        </main>
    );
}

export default function RevealPage() {
    return (
        <Suspense fallback={<div className="view active" />}>
            <RevealContent />
        </Suspense>
    );
}
