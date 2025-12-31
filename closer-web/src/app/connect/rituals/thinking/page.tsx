"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Cloud, Heart, Moon, Sun, Wind, Check, Send } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ThinkingOfYouPage() {
    const router = useRouter();
    const [sent, setSent] = useState(false);

    // Interaction Types
    const TOUCHES = [
        { id: 'heart', label: 'Heartbeat', icon: <Heart size={24} />, color: '#ef4444' },
        { id: 'hug', label: 'Digital Hug', icon: <Wind size={24} />, color: '#8b5cf6' },
        { id: 'energy', label: 'Good Vibes', icon: <Sun size={24} />, color: '#fbbf24' },
    ];

    const [selectedTouch, setSelectedTouch] = useState(TOUCHES[0]);

    function handleSend() {
        setSent(true);
        setTimeout(() => {
            router.push('/connect/rituals'); // Back to hub
        }, 2000);
    }

    if (sent) {
        return (
            <main className="view active" style={{
                display: 'flex', flexDirection: 'column', height: '100vh',
                background: 'var(--base)', alignItems: 'center', justifyContent: 'center'
            }}>
                <div className="pop-in" style={{
                    width: 100, height: 100, borderRadius: '50%', background: selectedTouch.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    boxShadow: `0 0 60px ${selectedTouch.color}60`
                }}>
                    {selectedTouch.icon}
                </div>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, marginTop: 24, color: 'var(--sand)' }}>
                    Sent!
                </h1>
                <p style={{ color: 'var(--stone)', marginTop: 8 }}>Partner notified.</p>
            </main>
        );
    }

    return (
        <main className="view active" style={{
            display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0,
            background: 'var(--base)'
        }}>
            {/* Header */}
            <header style={{ padding: 24, display: 'flex', alignItems: 'center' }}>
                <Link href="/connect/rituals" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <h1 style={{ marginLeft: 16, fontSize: 18, fontWeight: 700, color: 'var(--sand)', fontFamily: 'var(--font-serif)' }}>
                    Thinking of You
                </h1>
            </header>

            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

                <h2 style={{ fontSize: 32, fontFamily: 'var(--font-serif)', color: 'var(--sand)', marginBottom: 16, textAlign: 'center' }}>
                    Send a Touch
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--stone)', marginBottom: 48, maxWidth: 300, alignSelf: 'center' }}>
                    Let them know they're on your mind without saying a word.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 48 }}>
                    {TOUCHES.map(touch => (
                        <button
                            key={touch.id}
                            onClick={() => setSelectedTouch(touch)}
                            className="pressable focus-ring"
                            style={{
                                flexDirection: 'column', aspectRatio: '1', borderRadius: 24,
                                background: selectedTouch.id === touch.id ? 'var(--surface-2)' : 'transparent',
                                border: selectedTouch.id === touch.id ? `2px solid ${touch.color}` : '1px solid var(--border-subtle)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ color: selectedTouch.id === touch.id ? touch.color : 'var(--stone)' }}>
                                {touch.icon}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: selectedTouch.id === touch.id ? 'var(--sand)' : 'var(--stone)' }}>
                                {touch.label}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="glass" style={{
                    padding: 40, borderRadius: '50%', width: 200, height: 200, alignSelf: 'center',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${selectedTouch.color}40`,
                    background: `radial-gradient(circle, ${selectedTouch.color}20 0%, transparent 70%)`
                }}>
                    <button
                        onClick={handleSend}
                        className="pressable focus-ring animate-heartbeat"
                        style={{
                            width: 120, height: 120, borderRadius: '50%',
                            background: selectedTouch.color, color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `0 10px 40px ${selectedTouch.color}60`,
                            fontSize: 16, fontWeight: 700
                        }}
                    >
                        SEND
                    </button>
                </div>

                {/* History Section for Depth */}
                <div style={{ marginTop: 64 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--stone)', letterSpacing: '0.05em', marginBottom: 16, textTransform: 'uppercase' }}>
                        RECENT CONNECTIONS
                    </div>
                    <div className="glass" style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                        {[
                            { id: 1, type: 'hug', label: 'Received a Hug', time: '2h ago', color: '#8b5cf6', icon: <Wind size={16} /> },
                            { id: 2, type: 'heart', label: 'Sent a Heartbeat', time: 'Yesterday', color: '#ef4444', icon: <Heart size={16} /> },
                            { id: 3, type: 'energy', label: 'Received Good Vibes', time: '2 days ago', color: '#fbbf24', icon: <Sun size={16} /> },
                        ].map((item, i) => (
                            <div key={item.id} style={{
                                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
                                borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none',
                                background: 'transparent'
                            }}>
                                <div className="animate-float" style={{
                                    width: 32, height: 32, borderRadius: '50%', background: `${item.color}20`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color,
                                    animationDelay: `${i * 0.5}s`
                                }}>
                                    {item.icon}
                                </div>
                                <div style={{ flex: 1, fontSize: 14, color: 'var(--sand)', fontWeight: 500 }}>
                                    {item.label}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--stone)' }}>
                                    {item.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}
