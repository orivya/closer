"use client";

import Link from "next/link";
import { ArrowLeft, Sun, Send, Coffee } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MorningHelloPage() {
    const router = useRouter();
    const [mood, setMood] = useState(50);
    const [note, setNote] = useState("");
    const [isSending, setIsSending] = useState(false);

    function handleSend() {
        if (!note) return;
        setIsSending(true);
        // Simulate API
        setTimeout(() => {
            router.push("/connect/rituals?progress=morning");
        }, 1500);
    }

    return (
        <main className="view active" style={{
            display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0,
            background: 'var(--base)'
        }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'relative', zIndex: 10
            }}>
                <Link href="/connect/rituals" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#f97316', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Morning Hello
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column' }}>

                {/* Sun Illustration */}
                <div style={{
                    alignSelf: 'center', marginBottom: 40, position: 'relative',
                    width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        position: 'absolute', inset: 0, background: '#fb923c', borderRadius: '50%',
                        opacity: 0.1, filter: 'blur(20px)', animation: 'pulse-slow 4s infinite'
                    }} />
                    <Sun size={64} color="#f97316" className="spin-slow" style={{ animationDuration: '20s' }} />
                </div>

                <div className="glass" style={{
                    padding: 24, borderRadius: 24, marginBottom: 24,
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--sand)', marginBottom: 24, textAlign: 'center' }}>
                        How are you feeling today?
                    </h2>

                    {/* Mood Slider */}
                    <input
                        type="range"
                        min="0" max="100"
                        value={mood}
                        onChange={(e) => setMood(Number(e.target.value))}
                        style={{ width: '100%', marginBottom: 16, accentColor: '#f97316' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--stone)', fontWeight: 600 }}>
                        <span>Tired</span>
                        <span>Ready!</span>
                    </div>
                </div>

                {/* Note */}
                <div className="glass" style={{
                    padding: 16, borderRadius: 24, flex: 1, display: 'flex', flexDirection: 'column',
                    border: '1px solid var(--border-subtle)'
                }}>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Good morning! I'm thinking about..."
                        className="focus-ring"
                        style={{
                            flex: 1, background: 'transparent', border: 'none',
                            fontSize: 16, color: 'var(--sand)', resize: 'none', outline: 'none'
                        }}
                    />
                </div>

                <div style={{ marginTop: 24 }}>
                    <button
                        onClick={handleSend}
                        disabled={!note || isSending}
                        className="btn focus-ring pressable"
                        style={{
                            width: '100%', padding: 16, borderRadius: 16,
                            background: '#f97316', color: '#fff', fontSize: 16, fontWeight: 600,
                            justifyContent: 'center', boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
                            border: 'none', cursor: 'pointer'
                        }}
                    >
                        {isSending ? (
                            "Sending Sunshine..."
                        ) : (
                            <>Send Hello <Send size={18} style={{ marginLeft: 8 }} /></>
                        )}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--stone)' }}>
                        You'll start a 2-day streak!
                    </div>
                </div>

            </div>
        </main>
    );
}
