"use client";

import Link from "next/link";
import { ArrowLeft, MessageCircle, Calendar } from "lucide-react";

type HistoryItem = {
    id: string;
    date: string;
    category: string;
    question: string;
    answer: string;
};

const HISTORY: HistoryItem[] = [
    {
        id: "h1", date: "Today", category: "Deep Dive",
        question: "What is a memory of us you hope you never forget?",
        answer: "That time we got caught in the rain in Paris and just stood there laughing."
    },
    {
        id: "h2", date: "Yesterday", category: "Fun",
        question: "If we could teleport anywhere for 1 hour, where would we go?",
        answer: "A quiet beach in New Zealand to watch the sunset."
    },
    {
        id: "h3", date: "Dec 28", category: "Intimacy",
        question: "When do you feel most connected to me?",
        answer: "When we have our morning coffee without phones."
    }
];

export default function DeckHistoryPage() {
    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect/intimacy-deck" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>History</h1>
                    <div style={{ fontSize: 11, color: 'var(--stone)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Past Moments
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {HISTORY.map((item) => (
                        <div key={item.id} className="glass" style={{ padding: 24, borderRadius: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                                <span style={{
                                    fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                                    color: 'var(--clay)', padding: '4px 8px', background: 'rgba(224,159,125,0.1)', borderRadius: 8
                                }}>
                                    {item.category}
                                </span>
                                <span style={{ fontSize: 12, color: 'var(--stone)' }}>{item.date}</span>
                            </div>

                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)', marginBottom: 12, lineHeight: 1.4 }}>
                                "{item.question}"
                            </h3>

                            <div style={{
                                padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 16,
                                display: 'flex', gap: 12
                            }}>
                                <div style={{ minWidth: 24, paddingTop: 2 }}>
                                    <MessageCircle size={16} color="var(--stone)" />
                                </div>
                                <p style={{ fontSize: 14, color: 'var(--sand)', lineHeight: 1.5, fontStyle: 'italic' }}>
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    ))}

                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--stone)', fontSize: 13 }}>
                        <Calendar size={24} style={{ marginBottom: 12, opacity: 0.5 }} />
                        <p>That's all for this week.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
