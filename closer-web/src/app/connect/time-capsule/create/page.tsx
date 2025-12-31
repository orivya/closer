"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Lock, Rocket, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCapsulePage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [message, setMessage] = useState("");
    const [effect, setEffect] = useState("sparkle"); // Default effect
    const [isSealing, setIsSealing] = useState(false);

    function handleSeal() {
        if (!title || !date || !message) return;
        setIsSealing(true);

        // Mock API call / Animation delay
        setTimeout(() => {
            // Redirect to Hub with success
            router.push("/connect/time-capsule?new_capsule=true");
        }, 2000);
    }

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <button onClick={() => step === 1 ? router.back() : setStep(1)} className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </button>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>New Capsule</h1>
                    <div style={{ fontSize: 11, color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>
                        Step {step} of 2
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column' }}>

                {/* Step 1: Meta (Title & Date) */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4" style={{ flex: 1 }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37',
                            margin: '0 auto 24px'
                        }}>
                            <Calendar size={32} />
                        </div>

                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--sand)', marginBottom: 32, textAlign: 'center' }}>
                            When should this open?
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--stone)', marginBottom: 8, textTransform: 'uppercase' }}>
                                    Capsule Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. For our 5th Anniversary"
                                    className="focus-ring"
                                    style={{
                                        width: '100%', padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-subtle)', color: 'var(--sand)', fontSize: 16, outline: 'none'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--stone)', marginBottom: 8, textTransform: 'uppercase' }}>
                                    Unlock Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="focus-ring"
                                    style={{
                                        width: '100%', padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-subtle)', color: 'var(--sand)', fontSize: 16, outline: 'none',
                                        colorScheme: 'dark'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: 24 }}>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!title || !date}
                                className="btn btn-primary pressable focus-ring"
                                style={{ width: '100%', justifyContent: 'center', padding: 16, borderRadius: 16 }}
                            >
                                Write Message
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Content & Seal */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37',
                            margin: '0 auto 24px'
                        }}>
                            <Sparkles size={32} />
                        </div>

                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--sand)', marginBottom: 24, textAlign: 'center' }}>
                            Leave a message
                        </h2>

                        <div style={{ flex: 1, position: 'relative', marginBottom: 24 }}>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Future you is going to love reading this..."
                                className="focus-ring"
                                style={{
                                    width: '100%', height: '100%', padding: 20, borderRadius: 20,
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)',
                                    color: 'var(--sand)', fontSize: 16, lineHeight: 1.6, resize: 'none', outline: 'none'
                                }}
                            />
                        </div>

                        {/* Special Effect Selector */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--stone)', letterSpacing: '0.05em', marginBottom: 12, textTransform: 'uppercase' }}>
                                ADD SEALING MAGIC
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                {[
                                    { id: 'sparkle', label: 'Sparkle', icon: <Sparkles size={16} /> },
                                    { id: 'warp', label: 'Time Warp', icon: <Rocket size={16} /> },
                                    { id: 'lock', label: 'Classic', icon: <Lock size={16} /> }
                                ].map(fx => (
                                    <button
                                        key={fx.id}
                                        onClick={() => setEffect(fx.id)}
                                        className="pressable focus-ring"
                                        style={{
                                            padding: 12, borderRadius: 12, border: effect === fx.id ? '1px solid var(--gold)' : '1px solid var(--border-subtle)',
                                            background: effect === fx.id ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.02)',
                                            color: effect === fx.id ? 'var(--gold)' : 'var(--stone)',
                                            fontSize: 13, fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
                                        }}
                                    >
                                        {fx.icon}
                                        {fx.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: 24 }}>
                            <button
                                onClick={handleSeal}
                                disabled={!message || isSealing}
                                className="btn btn-primary pressable focus-ring"
                                style={{
                                    width: '100%', justifyContent: 'center', padding: 16, borderRadius: 16,
                                    background: isSealing ? 'var(--surface-2)' : '#D4AF37', color: '#000'
                                }}
                            >
                                {isSealing ? (
                                    <>
                                        <Lock size={20} className="spin-slow" style={{ marginRight: 8 }} /> Sealing in the Vault...
                                    </>
                                ) : (
                                    <>
                                        <Lock size={20} style={{ marginRight: 8 }} /> Seal Capsule
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
