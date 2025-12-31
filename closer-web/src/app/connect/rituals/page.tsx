"use client";

import Link from "next/link";
import { ArrowLeft, Moon, Sun, Coffee, BookOpen, Check, Zap } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function DailyPulseContent() {
    const searchParams = useSearchParams();
    const [timeOfDay, setTimeOfDay] = useState("day"); // 'morning', 'day', 'night'
    const [progress, setProgress] = useState({
        morning: false,
        gratitude: false,
        night: false
    });

    useEffect(() => {
        const prog = searchParams.get('progress');
        if (prog) {
            setProgress(prev => ({ ...prev, [prog]: true }));
        }
    }, [searchParams]);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setTimeOfDay("morning");
        else if (hour < 18) setTimeOfDay("day");
        else setTimeOfDay("night");
    }, []);

    const getGreeting = () => {
        if (timeOfDay === "morning") return "Good Morning";
        if (timeOfDay === "day") return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="container" style={{ flex: 1, padding: 24, overflowY: 'auto' }}>

            {/* Greeting Card */}
            <div className="glass" style={{
                marginBottom: 32, padding: 32, borderRadius: 24,
                background: 'var(--surface-1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: -20, right: -20, width: 100, height: 100,
                    background: 'rgba(255,255,255,0.2)', borderRadius: '50%', filter: 'blur(20px)'
                }} />
                <div style={{
                    marginBottom: 16, width: 48, height: 48, borderRadius: '50%',
                    background: timeOfDay === 'night' ? 'var(--mist-glow)' : 'var(--clay-glow)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: timeOfDay === 'night' ? 'var(--mist)' : 'var(--clay)'
                }}>
                    {timeOfDay === 'night' ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, marginBottom: 8, color: 'var(--sand)' }}>
                    {getGreeting()}
                </h2>
                <p style={{ fontSize: 14, maxWidth: 240, lineHeight: 1.5, color: 'var(--stone)' }}>
                    Small moments of connection create a lifetime of closeness.
                </p>
            </div>

            {/* SECTION 1: TODAY'S RHYTHM */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--stone)', letterSpacing: '0.05em', marginBottom: 16, textTransform: 'uppercase' }}>
                    Today's Rhythm
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                    {/* Morning */}
                    <RitualCard
                        href="/connect/rituals/morning"
                        icon={<Sun size={24} />}
                        color="var(--clay)"
                        textColor="var(--clay)"
                        title="Morning Hello"
                        desc="Start the day connected"
                        completed={progress.morning}
                    />
                    {/* Night */}
                    <RitualCard
                        href="/connect/rituals/night"
                        icon={<Moon size={24} />}
                        color="var(--mist)"
                        textColor="var(--mist)"
                        title="Goodnight Kiss"
                        desc="End the day with love"
                        completed={progress.night}
                    />
                </div>
            </div>

            {/* SECTION 2: ANYTIME */}
            <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--stone)', letterSpacing: '0.05em', marginBottom: 16, textTransform: 'uppercase' }}>
                    Anytime Connection
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {/* Thinking of You */}
                    <Link href="/connect/rituals/thinking" className="pressable focus-ring" style={{ textDecoration: 'none' }}>
                        <div className="glass" style={{
                            padding: 20, borderRadius: 20, border: '1px solid var(--border-subtle)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12,
                            height: '100%'
                        }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%', background: 'var(--love-glow)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--love)'
                            }}>
                                <Zap size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--sand)' }}>Thinking of You</div>
                                <div style={{ fontSize: 12, color: 'var(--stone)', marginTop: 4 }}>Send a quick touch</div>
                            </div>
                        </div>
                    </Link>

                    {/* Gratitude */}
                    <Link href="/connect/rituals/gratitude" className="pressable focus-ring" style={{ textDecoration: 'none' }}>
                        <div className="glass" style={{
                            padding: 20, borderRadius: 20, border: '1px solid var(--border-subtle)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12,
                            height: '100%'
                        }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%', background: 'var(--sage-glow)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sage)'
                            }}>
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--sand)' }}>Gratitude</div>
                                <div style={{ fontSize: 12, color: 'var(--stone)', marginTop: 4 }}>Log 3 things</div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

        </div>
    );
}

function RitualCard({ href, icon, color, textColor, title, desc, completed }: any) {
    return (
        <Link href={href} className="pressable focus-ring" style={{ textDecoration: 'none' }}>
            <div className="glass" style={{
                padding: 20, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16,
                borderLeft: `4px solid ${color}`
            }}>
                <div style={{
                    width: 40, height: 40, borderRadius: '50%', background: `${color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor
                }}>
                    {icon}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--sand)', marginBottom: 2 }}>{title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--stone)' }}>{desc}</p>
                </div>
                <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    border: '2px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    {completed && <Check size={14} color="var(--clay)" />}
                </div>
            </div>
        </Link>
    );
}

export default function DailyPulsePage() {
    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0, background: 'var(--base)' }}>
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Daily Pulse</h1>
                    <div style={{ fontSize: 11, color: 'var(--stone)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Sync & Connect
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <Suspense fallback={<div className="container" style={{ padding: 24, textAlign: 'center', color: 'var(--stone)' }}>Loading...</div>}>
                <DailyPulseContent />
            </Suspense>
        </main>
    );
}
