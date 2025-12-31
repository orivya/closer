"use client";

import Link from "next/link";
import { ArrowLeft, Sun, Moon, Coffee, Heart, BookOpen, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function RitualsHubPage() {
    const searchParams = useSearchParams();

    // Determine time of day for greeting
    const [timeOfDay, setTimeOfDay] = useState("day"); // 'morning', 'day', 'night'

    // Mock State for "Today's Progress"
    const [progress, setProgress] = useState({
        morning: false,
        gratitude: false,
        night: false
    });

    useEffect(() => {
        // Check URL params for completion (e.g. ?progress=morning)
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
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Daily Rituals</h1>
                    <div style={{ fontSize: 11, color: 'var(--stone)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
                        Building Habits
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, overflowY: 'auto' }}>

                {/* Hero / Greeting */}
                <div style={{
                    marginBottom: 32, padding: 32, borderRadius: 24,
                    background: timeOfDay === 'night'
                        ? 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)' // Night blue
                        : timeOfDay === 'morning'
                            ? 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)' // Morning peach
                            : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', // Day sage
                    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.1)',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute', top: -20, right: -20, width: 100, height: 100,
                        background: 'rgba(255,255,255,0.2)', borderRadius: '50%', filter: 'blur(20px)'
                    }} />

                    <div style={{
                        marginBottom: 16, width: 48, height: 48, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: timeOfDay === 'night' ? '#fff' : '#000'
                    }}>
                        {timeOfDay === 'night' ? <Moon size={24} /> : <Sun size={24} />}
                    </div>

                    <h2 style={{
                        fontFamily: 'var(--font-serif)', fontSize: 28, marginBottom: 8,
                        color: timeOfDay === 'night' ? '#fff' : '#1c1917'
                    }}>
                        {getGreeting()}
                    </h2>
                    <p style={{
                        fontSize: 14, maxWidth: 240, lineHeight: 1.5,
                        color: timeOfDay === 'night' ? 'rgba(255,255,255,0.8)' : 'rgba(28, 25, 23, 0.7)'
                    }}>
                        Small moments of connection create a lifetime of closeness.
                    </p>
                </div>

                {/* Rituals List */}
                <div style={{ display: 'grid', gap: 16 }}>

                    {/* Morning */}
                    <Link href="/connect/rituals/morning" className="pressable focus-ring" style={{ textDecoration: 'none' }}>
                        <div className="glass" style={{
                            padding: 24, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 20,
                            borderLeft: '4px solid #fdba74' // Orange/Peach
                        }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: '50%', background: 'rgba(253, 186, 116, 0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c'
                            }}>
                                <Coffee size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--sand)', marginBottom: 4 }}>Morning Hello</h3>
                                <p style={{ fontSize: 13, color: 'var(--stone)' }}>Start the day connected.</p>
                            </div>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                border: '2px solid var(--border-subtle)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {progress.morning && <Check size={16} color="var(--clay)" />}
                            </div>
                        </div>
                    </Link>

                    {/* Gratitude */}
                    <Link href="/connect/rituals/gratitude" className="pressable focus-ring" style={{ textDecoration: 'none' }}>
                        <div className="glass" style={{
                            padding: 24, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 20,
                            borderLeft: '4px solid #86efac' // Green
                        }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: '50%', background: 'rgba(134, 239, 172, 0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d'
                            }}>
                                <BookOpen size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--sand)', marginBottom: 4 }}>Gratitude Journal</h3>
                                <p style={{ fontSize: 13, color: 'var(--stone)' }}>Share 3 things you appreciate.</p>
                            </div>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                border: '2px solid var(--border-subtle)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {progress.gratitude && <Check size={16} color="var(--clay)" />}
                            </div>
                        </div>
                    </Link>

                    {/* Night */}
                    <Link href="/connect/rituals/night" className="pressable focus-ring" style={{ textDecoration: 'none' }}>
                        <div className="glass" style={{
                            padding: 24, borderRadius: 24, display: 'flex', alignItems: 'center', gap: 20,
                            borderLeft: '4px solid #60a5fa' // Blue
                        }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: '50%', background: 'rgba(96, 165, 250, 0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d4ed8'
                            }}>
                                <Heart size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--sand)', marginBottom: 4 }}>Goodnight Kiss</h3>
                                <p style={{ fontSize: 13, color: 'var(--stone)' }}>End the day with love.</p>
                            </div>
                            <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                border: '2px solid var(--border-subtle)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {progress.night && <Check size={16} color="var(--clay)" />}
                            </div>
                        </div>
                    </Link>

                </div>

                {/* Streak */}
                <div style={{ marginTop: 32, textAlign: 'center' }}>
                    <div style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--stone)', letterSpacing: '0.1em', marginBottom: 8 }}>Current Streak</div>
                    <div style={{ fontSize: 48, fontFamily: 'var(--font-serif)', color: 'var(--clay)', lineHeight: 1 }}>12</div>
                    <div style={{ fontSize: 14, color: 'var(--sand)' }}>Days</div>
                </div>

            </div>
        </main>
    );
}
