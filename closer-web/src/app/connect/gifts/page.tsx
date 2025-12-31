"use client";

import Link from "next/link";
import { ArrowLeft, Coins, Filter, Grid, Gift, History, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";

// Mock Data for Gifts
const GIFTS = [
    { id: 'rose-1', name: 'Digital Rose', price: 50, category: 'romantic', icon: '🌹', color: '#f43f5e' },
    { id: 'coffee-1', name: 'Morning Coffee', price: 25, category: 'servicing', icon: '☕', color: '#ea580c' },
    { id: 'massage-1', name: 'Massage Coupon', price: 100, category: 'servicing', icon: '💆‍♀️', color: '#8b5cf6' },
    { id: 'date-1', name: 'Date Night Pass', price: 200, category: 'romantic', icon: '🎟️', color: '#db2777' },
    { id: 'choco-1', name: 'Box of Chocolates', price: 75, category: 'romantic', icon: '🍫', color: '#78350f' },
    { id: 'clean-1', name: 'Chore Pass', price: 150, category: 'servicing', icon: '🧹', color: '#10b981' },
    { id: 'kiss-1', name: '1000 Kisses', price: 500, category: 'romantic', icon: '💋', color: '#e11d48' },
    { id: 'mystery-1', name: 'Mystery Box', price: 50, category: 'fun', icon: '🎁', color: '#6366f1' },
];

export default function GiftShopPage() {
    const [balance, setBalance] = useState(1250); // Mock Coin Balance
    const [filter, setFilter] = useState('all'); // 'all', 'romantic', 'servicing', 'fun'

    const filteredGifts = filter === 'all'
        ? GIFTS
        : GIFTS.filter(g => g.category === filter);

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
                <Link href="/connect" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--clay)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Gift Shop
                    </div>
                </div>
                <Link href="/connect/gifts/inventory" className="icon-btn focus-ring">
                    <History size={20} />
                </Link>
            </header>

            <div className="container" style={{ flex: 1, padding: 24, overflowY: 'auto' }}>

                {/* Balance Card */}
                <div style={{
                    marginBottom: 32, padding: 24, borderRadius: 24,
                    background: 'linear-gradient(135deg, rgba(224, 159, 125, 0.1), rgba(224, 159, 125, 0.05))',
                    border: '1px solid rgba(224, 159, 125, 0.2)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <div style={{ fontSize: 12, color: 'var(--clay)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 4 }}>
                            YOUR BALANCE
                        </div>
                        <div style={{ fontSize: 32, fontFamily: 'var(--font-serif)', color: 'var(--sand)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Coins size={24} color="var(--clay)" />
                            {balance}
                        </div>
                    </div>
                    <button className="btn focus-ring" style={{ height: 40, fontSize: 13, borderRadius: 20 }}>
                        <Sparkles size={14} style={{ marginRight: 6 }} />
                        Earn
                    </button>
                </div>

                {/* Categories */}
                <div className="no-scrollbar" style={{
                    display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, marginBottom: 16
                }}>
                    {['all', 'romantic', 'servicing', 'fun'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className="pressable focus-ring"
                            style={{
                                padding: '8px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
                                background: filter === cat ? 'var(--clay)' : 'rgba(255,255,255,0.05)',
                                color: filter === cat ? '#fff' : 'var(--stone)',
                                border: filter === cat ? 'none' : '1px solid var(--border-subtle)',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
                    {filteredGifts.map(gift => (
                        <Link
                            key={gift.id}
                            href={`/connect/gifts/${gift.id}`}
                            className="glass pressable focus-ring"
                            style={{
                                padding: 16, borderRadius: 24,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                                textDecoration: 'none', border: '1px solid var(--border-subtle)'
                            }}
                        >
                            <div style={{
                                width: 64, height: 64, borderRadius: '50%', marginBottom: 16,
                                background: 'rgba(255,255,255,0.03)', border: `1px solid ${gift.color}40`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 32,
                                boxShadow: `0 8px 32px -8px ${gift.color}40`
                            }}>
                                {gift.icon}
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--sand)', marginBottom: 4 }}>
                                {gift.name}
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--stone)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Coins size={12} color="var(--clay)" />
                                {gift.price}
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </main>
    );
}
