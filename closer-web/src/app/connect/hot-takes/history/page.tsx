"use client";

import Link from "next/link";
import { ArrowLeft, Flame } from "lucide-react";

export default function HotTakesHistoryPage() {
    const history = [
        { id: 1, category: "Food", question: "Pineapple on pizza?", you: 5, them: 1, match: false },
        { id: 2, category: "Habits", question: "10 mins early vs 1 min late", you: 5, them: 5, match: true },
        { id: 3, category: "Social", question: "Voice notes > Texts", you: 2, them: 4, match: false },
        { id: 4, category: "Travel", question: "Beach > Mountains", you: 4, them: 4, match: true },
    ];

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect/hot-takes" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>History</h1>
                    <div style={{ fontSize: 11, color: 'var(--stone)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Scorecard
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24 }}>

                {/* Stats Summary */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(224, 159, 125, 0.1), rgba(255,255,255,0.02))',
                    borderRadius: 24, padding: 24, marginBottom: 32,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div>
                        <div style={{ fontSize: 12, color: 'var(--clay)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Compatibility</div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--sand)' }}>50%</div>
                    </div>
                    <div style={{
                        width: 48, height: 48, borderRadius: '50%', background: 'var(--clay)', color: '#000',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Flame size={20} fill="black" />
                    </div>
                </div>

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {history.map((item) => (
                        <div key={item.id} className="glass" style={{ padding: 20, borderRadius: 20, borderLeft: item.match ? '4px solid #10B981' : '4px solid #EF4444' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--stone)', textTransform: 'uppercase' }}>{item.category}</span>
                                <span style={{ fontSize: 10, fontWeight: 700, color: item.match ? '#10B981' : '#EF4444' }}>
                                    {item.match ? "MATCH" : "MISMATCH"}
                                </span>
                            </div>
                            <h3 style={{ fontSize: 16, color: 'var(--sand)', marginBottom: 12 }}>{item.question}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--muted)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clay)' }} />
                                    You: {item.you}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--stone)' }} />
                                    Them: {item.them}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </main>
    );
}
