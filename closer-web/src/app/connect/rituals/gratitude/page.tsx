"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GratitudePage() {
    const router = useRouter();
    const [entry1, setEntry1] = useState("");
    const [entry2, setEntry2] = useState("");
    const [entry3, setEntry3] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    function handleSave() {
        if (!entry1) return;
        setIsSaving(true);
        setTimeout(() => {
            router.push("/connect/rituals?progress=gratitude");
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
                    <div style={{ fontSize: 11, color: '#15803d', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Daily Gratitude
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column' }}>

                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--sand)', marginBottom: 8 }}>
                        Practice Appreciation
                    </h2>
                    <p style={{ color: 'var(--stone)', fontSize: 14 }}>
                        Share three things you're grateful for today.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {[
                        { val: entry1, set: setEntry1, placeholder: "I appreciate you for..." },
                        { val: entry2, set: setEntry2, placeholder: "I really enjoyed..." },
                        { val: entry3, set: setEntry3, placeholder: "I'm thankful that..." }
                    ].map((item, i) => (
                        <div key={i} className="pressable focus-within glass" style={{
                            borderRadius: 16, padding: 16,
                            border: '1px solid var(--border-subtle)',
                            display: 'flex', gap: 12
                        }}>
                            <div style={{
                                width: 24, height: 24, borderRadius: '50%', background: 'rgba(134, 239, 172, 0.1)',
                                color: '#4ade80', fontSize: 12, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {i + 1}
                            </div>
                            <input
                                type="text"
                                value={item.val}
                                onChange={(e) => item.set(e.target.value)}
                                placeholder={item.placeholder}
                                style={{
                                    flex: 1, border: 'none', outline: 'none', background: 'transparent',
                                    fontSize: 16, color: 'var(--sand)'
                                }}
                            />
                        </div>
                    ))}

                </div>

                <div style={{ marginTop: 'auto' }}>
                    <button
                        onClick={handleSave}
                        disabled={!entry1 || isSaving}
                        className="btn focus-ring pressable"
                        style={{
                            width: '100%', padding: 16, borderRadius: 16,
                            background: '#15803d', color: '#fff', fontSize: 16, fontWeight: 600,
                            justifyContent: 'center', boxShadow: '0 4px 12px rgba(21, 128, 61, 0.2)',
                            border: 'none', cursor: 'pointer'
                        }}
                    >
                        {isSaving ? (
                            "Saving..."
                        ) : (
                            <>Save Gratitude <Check size={18} style={{ marginLeft: 8 }} /></>
                        )}
                    </button>
                </div>

            </div>
        </main>
    );
}
