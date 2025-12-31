"use client";

import Link from "next/link";
import { ArrowLeft, Gift, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Mock History Data
const HISTORY = [
    { id: '1', giftId: 'rose-1', name: 'Digital Rose', type: 'sent', date: 'Just now', icon: '🌹', color: '#f43f5e' },
    { id: '2', giftId: 'mystery-1', name: 'Mystery Box', type: 'received', date: '2h ago', icon: '🎁', color: '#6366f1', unwrapped: false },
    { id: '3', giftId: 'coffee-1', name: 'Morning Coffee', type: 'received', date: 'Yesterday', icon: '☕', color: '#ea580c', unwrapped: true },
    { id: '4', giftId: 'date-1', name: 'Date Night Pass', type: 'sent', date: '3 days ago', icon: '🎟️', color: '#db2777' },
];

export default function GiftInventoryPage() {
    const router = useRouter();
    const [tab, setTab] = useState<'received' | 'sent'>('received');

    const filteredHistory = HISTORY.filter(item => item.type === tab);

    return (
        <main className="view active" style={{
            display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0,
            background: 'var(--base)'
        }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect/gifts" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--clay)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Treasure Chest
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, overflowY: 'auto' }}>

                {/* Tabs */}
                <div style={{
                    display: 'flex', padding: 4, background: 'rgba(255,255,255,0.05)',
                    borderRadius: 16, marginBottom: 24
                }}>
                    <button
                        onClick={() => setTab('received')}
                        className="pressable"
                        style={{
                            flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600,
                            background: tab === 'received' ? 'var(--clay)' : 'transparent',
                            color: tab === 'received' ? '#fff' : 'var(--stone)',
                            transition: 'all 0.2s', cursor: 'pointer', border: 'none'
                        }}
                    >
                        Received
                    </button>
                    <button
                        onClick={() => setTab('sent')}
                        className="pressable"
                        style={{
                            flex: 1, padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 600,
                            background: tab === 'sent' ? 'var(--clay)' : 'transparent',
                            color: tab === 'sent' ? '#fff' : 'var(--stone)',
                            transition: 'all 0.2s', cursor: 'pointer', border: 'none'
                        }}
                    >
                        Sent
                    </button>
                </div>

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filteredHistory.map(item => (
                        <div
                            key={item.id}
                            onClick={() => {
                                if (item.type === 'received' && !item.unwrapped) {
                                    router.push(`/connect/gifts/unwrap/${item.giftId}`);
                                }
                            }}
                            className={`glass ${item.type === 'received' && !item.unwrapped ? 'pressable' : ''}`}
                            style={{
                                padding: 16, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16,
                                border: '1px solid var(--border-subtle)',
                                cursor: (item.type === 'received' && !item.unwrapped) ? 'pointer' : 'default',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                width: 48, height: 48, borderRadius: '50%',
                                background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}30`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
                            }}>
                                {item.icon}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--sand)', marginBottom: 2 }}>
                                    {item.name}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--stone)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock size={12} /> {item.date}
                                </div>
                            </div>

                            {/* Status Indicator */}
                            {item.type === 'received' && !item.unwrapped && (
                                <div style={{
                                    padding: '6px 12px', background: 'var(--clay)', color: '#fff',
                                    borderRadius: 100, fontSize: 11, fontWeight: 700
                                }}>
                                    UNWRAP
                                </div>
                            )}

                            {item.type === 'sent' && (
                                <div style={{ color: 'var(--stone)', opacity: 0.5 }}>
                                    <ArrowUpRight size={18} />
                                </div>
                            )}

                            {item.type === 'received' && item.unwrapped && (
                                <div style={{ color: 'var(--stone)', opacity: 0.5 }}>
                                    <ArrowDownLeft size={18} />
                                </div>
                            )}

                        </div>
                    ))}

                    {filteredHistory.length === 0 && (
                        <div style={{ textAlign: 'center', padding: 40, color: 'var(--stone)', fontSize: 14 }}>
                            No gifts {tab} yet.
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}
