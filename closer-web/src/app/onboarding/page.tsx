"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Heart, User, Copy, Sparkles } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Welcome, 2: Profile, 3: Partner, 4: Success
    const [name, setName] = useState("");
    const [partnerCode, setPartnerCode] = useState("");

    // Step 1: Welcome
    if (step === 1) {
        return (
            <main className="view active" style={{
                display: 'flex', flexDirection: 'column', height: '100vh', padding: 24,
                background: 'var(--base)', justifyContent: 'center', alignItems: 'center',
                textAlign: 'center'
            }}>
                <div style={{
                    width: 80, height: 80, borderRadius: '50%', background: 'var(--clay)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32,
                    boxShadow: '0 0 60px rgba(224, 159, 125, 0.3)'
                }}>
                    <Heart size={40} className="text-white" fill="white" />
                </div>

                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, color: 'var(--sand)', marginBottom: 16 }}>
                    Closer
                </h1>
                <p style={{ fontSize: 16, color: 'var(--stone)', maxWidth: 300, lineHeight: 1.6, marginBottom: 48 }}>
                    The space for you and your partner to deepen your connection, one day at a time.
                </p>

                <button
                    onClick={() => setStep(2)}
                    className="btn btn-primary focus-ring pressable"
                    style={{
                        width: '100%', maxWidth: 320, height: 56, borderRadius: 100,
                        background: 'var(--sand)', color: 'var(--base)', fontWeight: 700, fontSize: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    Get Started <ArrowRight size={20} style={{ marginLeft: 8 }} />
                </button>
            </main>
        );
    }

    // Step 2: Profile
    if (step === 2) {
        return (
            <main className="view active" style={{
                display: 'flex', flexDirection: 'column', height: '100vh', padding: 24,
                background: 'var(--base)'
            }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--clay)', marginBottom: 8, fontWeight: 700 }}>
                        Step 1 of 3
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--sand)', marginBottom: 32 }}>
                        What should we call you?
                    </h2>

                    <div className="glass" style={{
                        padding: 16, borderRadius: 24, border: '1px solid var(--border-subtle)',
                        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24
                    }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: '50%', background: 'var(--surface-2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--stone)'
                        }}>
                            <User size={24} />
                        </div>
                        <input
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            style={{
                                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                fontSize: 18, color: 'var(--sand)', fontWeight: 600
                            }}
                        />
                    </div>
                </div>

                <button
                    onClick={() => { if (name) setStep(3); }}
                    disabled={!name}
                    className="btn btn-primary focus-ring pressable"
                    style={{
                        width: '100%', height: 56, borderRadius: 100,
                        background: name ? 'var(--sand)' : 'var(--surface-2)',
                        color: name ? 'var(--base)' : 'var(--stone)',
                        fontWeight: 700, fontSize: 16, transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    Continue
                </button>
            </main>
        );
    }

    // Step 3: Partner Link
    if (step === 3) {
        return (
            <main className="view active" style={{
                display: 'flex', flexDirection: 'column', height: '100vh', padding: 24,
                background: 'var(--base)'
            }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--clay)', marginBottom: 8, fontWeight: 700 }}>
                        Step 2 of 3
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--sand)', marginBottom: 16 }}>
                        Link your partner
                    </h2>
                    <p style={{ color: 'var(--stone)', marginBottom: 40, lineHeight: 1.5 }}>
                        Closer is built for two. Share your specialized code or enter theirs below.
                    </p>

                    {/* Your Code */}
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--stone)', marginBottom: 8 }}>YOUR CODE</div>
                        <button className="pressable focus-ring" style={{
                            width: '100%', padding: 16, borderRadius: 16, background: 'rgba(224, 159, 125, 0.1)',
                            border: '1px dashed var(--clay)', color: 'var(--clay)', fontSize: 18, fontWeight: 700, fontFamily: 'monospace',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            AB-123-CD
                            <Copy size={16} />
                        </button>
                    </div>

                    {/* Enter Code */}
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--stone)', marginBottom: 8 }}>ENTER PARTNER CODE</div>
                        <input
                            value={partnerCode}
                            onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                            placeholder="XX-000-XX"
                            className="glass focus-ring"
                            style={{
                                width: '100%', padding: 16, borderRadius: 16, border: '1px solid var(--border-subtle)',
                                background: 'rgba(255,255,255,0.03)', color: 'var(--sand)', fontSize: 18, fontWeight: 600,
                                fontFamily: 'monospace', outline: 'none'
                            }}
                        />
                    </div>

                </div>

                <button
                    onClick={() => setStep(4)}
                    className="btn btn-primary focus-ring pressable"
                    style={{
                        width: '100%', height: 56, borderRadius: 100,
                        background: 'var(--clay)', color: '#fff',
                        fontWeight: 700, fontSize: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    {partnerCode ? 'Connect Partner' : 'Skip for Now'}
                </button>
            </main>
        );
    }

    // Step 4: Success
    return (
        <main className="view active" style={{
            display: 'flex', flexDirection: 'column', height: '100vh', padding: 24,
            background: 'var(--base)', justifyContent: 'center', alignItems: 'center',
            textAlign: 'center'
        }}>
            <div className="pop-in" style={{
                width: 100, height: 100, borderRadius: '50%', background: 'var(--sand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32,
                color: 'var(--base)'
            }}>
                <Sparkles size={48} />
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--sand)', marginBottom: 16 }}>
                You're all set, {name}!
            </h1>
            <p style={{ fontSize: 16, color: 'var(--stone)', maxWidth: 300, lineHeight: 1.6, marginBottom: 48 }}>
                Your private space is ready. Start exploring your connection today.
            </p>

            <Link href="/connect" className="btn btn-primary focus-ring pressable" style={{
                width: '100%', maxWidth: 320, height: 56, borderRadius: 100, textDecoration: 'none',
                background: 'var(--sand)', color: 'var(--base)', fontWeight: 700, fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                Enter Closer
            </Link>
        </main>
    );
}
