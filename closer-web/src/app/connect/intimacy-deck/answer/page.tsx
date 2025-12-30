"use client";

import Link from "next/link";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AnswerContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [answer, setAnswer] = useState("");

    const question = searchParams.get("q") || "What is a memory of us that you hope you never forget?";
    const category = searchParams.get("c") || "Deep Dive";

    function handleSubmit() {
        if (!answer.trim()) return;
        const params = new URLSearchParams();
        params.set("q", question);
        params.set("c", category);
        params.set("a", answer);
        router.push(`/connect/intimacy-deck/reveal?${params.toString()}`);
    }

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
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Your Answer</h1>
                    <div style={{ fontSize: 11, color: 'var(--stone)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Speak from the heart
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 32 }}>

                {/* Question Card (Context) */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                    borderRadius: 24, padding: 32, border: '1px solid var(--border-subtle)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', minHeight: 200
                }}>
                    <div style={{
                        fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
                        color: '#8AA686', marginBottom: 16, padding: '4px 12px',
                        border: '1px solid rgba(138, 166, 134, 0.3)', borderRadius: 100
                    }}>
                        {category}
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, lineHeight: 1.4, color: 'var(--sand)' }}>
                        "{question}"
                    </h2>
                </div>

                {/* Answer Input */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Take your time... write whatever comes to mind."
                            className="focus-ring"
                            style={{
                                width: '100%', height: '100%',
                                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                                borderRadius: 20, padding: 24, color: 'var(--sand)', fontSize: 16, lineHeight: 1.6,
                                fontFamily: 'var(--font-sans)', resize: 'none'
                            }}
                        />
                        <div style={{
                            position: 'absolute', bottom: 16, right: 24,
                            fontSize: 12, color: 'var(--stone)', opacity: 0.7
                        }}>
                            {answer.length} chars
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!answer.trim()}
                        className="btn btn-primary focus-ring pressable"
                        style={{ width: '100%', background: 'var(--clay)', color: '#000', opacity: !answer.trim() ? 0.5 : 1 }}
                    >
                        <Send size={18} /> Share with Partner
                    </button>
                </div>

            </div>
        </main>
    );
}

export default function AnswerPage() {
    return (
        <Suspense fallback={<div className="view active" />}>
            <AnswerContent />
        </Suspense>
    );
}
