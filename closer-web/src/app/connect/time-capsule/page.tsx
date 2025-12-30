"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Lock, Plus, Send, Unlock } from "lucide-react";
import { useState } from "react";

type Capsule = {
    id: string;
    message: string;
    unlockDate: string;
    isLocked: boolean;
};

const SAMPLE_CAPSULES: Capsule[] = [
    { id: "c1", message: "Open this when we buy our first house...", unlockDate: "2027-06-15", isLocked: true },
    { id: "c2", message: "For our 1 year anniversary", unlockDate: "2025-11-12", isLocked: false },
];

export default function TimeCapsulePage() {
    const [view, setView] = useState<"list" | "create">("list");
    const [message, setMessage] = useState("");
    const [date, setDate] = useState("");
    const [capsules, setCapsules] = useState(SAMPLE_CAPSULES);
    const [isSealing, setIsSealing] = useState(false);

    function handleSeal() {
        if (!message || !date) return;
        setIsSealing(true);

        // Simulate the heavy "Locking" animation
        setTimeout(() => {
            const newCapsule: Capsule = {
                id: Date.now().toString(),
                message,
                unlockDate: date,
                isLocked: true,
            };
            setCapsules([newCapsule, ...capsules]);
            setIsSealing(false);
            setView("list");
            setMessage("");
            setDate("");
        }, 1500);
    }

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
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Time Capsule</h1>
                    <div style={{ fontSize: 11, color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Message from the Past
                    </div>
                </div>
                <div style={{ width: 42 }} /> {/* Spacer */}
            </header>

            <div className="container" style={{ flex: 1, paddingBottom: 80 }}>

                {view === "list" ? (
                    <>
                        <div style={{
                            background: 'rgba(212, 175, 55, 0.05)', borderRadius: 24, padding: 24, marginBottom: 32,
                            border: '1px solid rgba(212, 175, 55, 0.1)', textAlign: 'center'
                        }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                                color: '#D4AF37'
                            }}>
                                <Calendar size={20} />
                            </div>
                            <h3 style={{ color: 'var(--sand)', fontSize: 16, marginBottom: 8 }}>Send a message notifiication to the future.</h3>
                            <p style={{ color: 'var(--stone)', fontSize: 13, lineHeight: 1.5, marginBottom: 24 }}>
                                Write a note, pick a date, and we’ll lock it until then.
                            </p>
                            <button onClick={() => setView("create")} className="btn btn-primary" style={{ width: '100%' }}>
                                <Plus size={16} /> New Capsule
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div className="section-head" style={{ marginBottom: 12 }}>Your Capsules</div>
                            {capsules.map(cap => (
                                <div key={cap.id} className="glass" style={{ padding: 20, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 12,
                                        background: cap.isLocked ? 'rgba(255,255,255,0.03)' : 'rgba(212, 175, 55, 0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: cap.isLocked ? 'var(--stone)' : '#D4AF37'
                                    }}>
                                        {cap.isLocked ? <Lock size={18} /> : <Unlock size={18} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, color: 'var(--sand)', fontWeight: 600, marginBottom: 4 }}>
                                            {cap.isLocked ? "Locked Message" : "Unlocked Note"}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'var(--stone)' }}>
                                            Opens {cap.unlockDate}
                                        </div>
                                    </div>
                                    {cap.isLocked ? (
                                        <div style={{
                                            fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em',
                                            padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 8
                                        }}>
                                            Wait
                                        </div>
                                    ) : (
                                        <button className="btn" style={{ padding: '8px 16px', fontSize: 12 }}>View</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    /* Create View */
                    <div style={{ animation: 'fade-in-up 0.4s' }}>
                        <label style={{ display: 'block', marginBottom: 24 }}>
                            <span style={{ fontSize: 12, color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>Message</span>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Future me, I hope you..."
                                className="focus-ring"
                                style={{
                                    width: '100%', height: 160, background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 16,
                                    color: 'var(--sand)', fontSize: 16, lineHeight: 1.5, resize: 'none', outline: 'none'
                                }}
                            />
                        </label>

                        <label style={{ display: 'block', marginBottom: 32 }}>
                            <span style={{ fontSize: 12, color: 'var(--stone)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 12 }}>Unlock Date</span>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="focus-ring"
                                style={{
                                    width: '100%', background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border-subtle)', borderRadius: 16, padding: 16,
                                    color: 'var(--sand)', fontSize: 16, outline: 'none'
                                }}
                            />
                        </label>

                        <div style={{ display: 'flex', gap: 12 }}>
                            {isSealing ? (
                                <button disabled className="btn btn-primary" style={{ flex: 1, opacity: 0.8, cursor: 'wait' }}>
                                    <Lock size={16} className="spin-slow" /> Sealing Capsule...
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => setView("list")} className="btn" style={{ flex: 1 }}>Cancel</button>
                                    <button onClick={handleSeal} className="btn btn-primary" style={{ flex: 2 }}>
                                        <Lock size={16} /> Seal Capsule
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
