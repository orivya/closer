"use client";

import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";

export default function WYRHistoryPage() {
    const history = [
        { id: 1, category: "Silly", optionA: "Fly (Walk speed)", optionB: "Teleport (Visited places)", choice: "A", match: true },
        { id: 2, category: "Deep", optionA: "Speak mind always", optionB: "Never speak", choice: "B", match: false },
        { id: 3, category: "Lifestyle", optionA: "Treehouse", optionB: "Ocean Cave", choice: "A", match: true },
    ];

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect/would-you-rather" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>History</h1>
                    <div style={{ fontSize: 11, color: 'var(--stone)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Past Choices
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, overflowY: 'auto' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {history.map((item) => (
                        <div key={item.id} className="glass" style={{ padding: 20, borderRadius: 20, borderLeft: item.match ? '4px solid #10B981' : '4px solid #EF4444' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--stone)', textTransform: 'uppercase' }}>{item.category}</span>
                                <span style={{ fontSize: 10, fontWeight: 700, color: item.match ? '#10B981' : '#EF4444' }}>
                                    {item.match ? "AGREED" : "DIFFERENT"}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <div style={{ flex: 1, fontSize: 14, color: item.choice === 'A' ? 'var(--sand)' : 'var(--muted)', fontWeight: item.choice === 'A' ? 600 : 400 }}>
                                    {item.optionA}
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--stone)' }}>VS</div>
                                <div style={{ flex: 1, fontSize: 14, color: item.choice === 'B' ? 'var(--sand)' : 'var(--muted)', fontWeight: item.choice === 'B' ? 600 : 400 }}>
                                    {item.optionB}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </main>
    );
}
