"use client";

import Link from "next/link";
import { ArrowLeft, Heart, Moon, Stars } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function GoodnightPage() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);

    // Long Press Logic
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    function startPress() {
        if (completed) return;
        intervalRef.current = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(intervalRef.current!);
                    setCompleted(true);
                    return 100;
                }
                return p + 2; // Speed of fill
            });
        }, 20);
    }

    function stopPress() {
        if (completed) return;
        if (intervalRef.current) clearInterval(intervalRef.current);
        setProgress(0);
    }

    function handleFinish() {
        // Send
        router.push("/connect/rituals?progress=night");
    }

    return (
        <main className="view active" style={{
            display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0,
            background: 'var(--base)', // Standard dark
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
                    <div style={{ fontSize: 11, color: 'var(--mist)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Goodnight Kiss
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <div style={{ marginBottom: 40, textAlign: 'center' }}>
                    <div style={{
                        margin: '0 auto 24px', width: 80, height: 80, borderRadius: '50%',
                        background: 'var(--mist-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 40px var(--mist-glow)'
                    }}>
                        <Moon size={40} color="var(--mist)" />
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, color: 'var(--sand)', marginBottom: 8 }}>
                        Sleep Well
                    </h2>
                    <p style={{ color: 'var(--stone)', fontSize: 14 }}>
                        Send a kiss to end the day.
                    </p>
                </div>

                {/* Long Press Button */}
                <div style={{ position: 'relative', marginBottom: 40 }}>
                    {/* Ripples / Glow */}
                    {progress > 0 && !completed && (
                        <div style={{
                            position: 'absolute', inset: -20, borderRadius: '50%',
                            background: 'var(--love-glow)',
                            transform: `scale(${1 + (progress / 100)})`,
                            opacity: 1 - (progress / 100),
                            transition: 'all 0.1s'
                        }} />
                    )}

                    <button
                        onMouseDown={startPress}
                        onMouseUp={stopPress}
                        onTouchStart={startPress}
                        onTouchEnd={stopPress}
                        className="pressable focus-ring"
                        style={{
                            width: 140, height: 140, borderRadius: '50%',
                            background: completed ? 'var(--love)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative', overflow: 'hidden', cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' // Bouncy
                        }}
                    >
                        {/* Fill */}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            height: `${progress}%`, background: 'var(--love)', // Red for heart/kiss
                            opacity: 0.5, transition: 'height 0.1s linear'
                        }} />

                        <Heart
                            size={48}
                            color={completed ? '#fff' : 'var(--love)'}
                            fill={completed ? '#fff' : 'var(--love-glow)'}
                            style={{ position: 'relative', zIndex: 10, transform: completed ? 'scale(1.2)' : 'scale(1)' }}
                        />
                    </button>
                    <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--mist)', fontWeight: 600, letterSpacing: '0.05em' }}>
                        {completed ? "KISS SENT!" : "HOLD TO SEND"}
                    </div>
                </div>

                <div className="glass" style={{
                    width: '100%', padding: 16, borderRadius: 24,
                    display: 'flex', flexDirection: 'column',
                    border: '1px solid var(--border-subtle)'
                }}>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a goodnight note..."
                        style={{
                            flex: 1, background: 'transparent', border: 'none', minHeight: 60,
                            fontSize: 16, color: 'var(--sand)', resize: 'none', outline: 'none'
                        }}
                    />
                </div>

                {completed && (
                    <div style={{ marginTop: 24, width: '100%', animation: 'fade-in-up 0.4s' }}>
                        <button
                            onClick={handleFinish}
                            className="btn btn-primary pressable opacity-fade"
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            Complete Ritual
                        </button>
                    </div>
                )}

            </div>
        </main>
    );
}
