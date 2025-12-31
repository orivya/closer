"use client";

import Link from "next/link";
import { ArrowLeft, Coins, ShoppingBag, Flower2, Coffee, Sparkles, Ticket, Heart, Package, Gift } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { getGiftById } from "@/data/giftData";

export default function GiftDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const gift = getGiftById(id);

    if (!gift) return null;

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
                <Link href="/connect/gifts" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                    {/* Visual */}
                    <div style={{
                        width: 200, height: 200, borderRadius: '50%', marginBottom: 40,
                        background: `radial-gradient(circle at 30% 30%, ${gift.color}20, transparent)`,
                        border: `1px solid ${gift.color}40`,
                        boxShadow: `0 0 60px ${gift.color}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 80, animation: 'float 6s ease-in-out infinite'
                    }}>
                        {gift.icon}
                    </div>

                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--sand)', marginBottom: 12, textAlign: 'center' }}>
                        {gift.name}
                    </h1>
                    <p style={{ color: 'var(--stone)', fontSize: 16, textAlign: 'center', maxWidth: 300, lineHeight: 1.6 }}>
                        {gift.desc}
                    </p>

                </div>

                {/* Purchase Card */}
                <div className="glass" style={{
                    width: '100%', padding: 24, borderRadius: 24,
                    border: '1px solid var(--border-subtle)',
                    display: 'flex', flexDirection: 'column', gap: 24
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--stone)', letterSpacing: '0.05em' }}>PRICE</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 700, color: 'var(--sand)' }}>
                            <Coins size={20} color="var(--clay)" />
                            {gift.price}
                        </div>
                    </div>

                    <button
                        onClick={() => router.push(`/connect/gifts/send/${id}`)}
                        className="btn focus-ring pressable"
                        style={{
                            width: '100%', padding: 18, borderRadius: 16,
                            background: 'var(--sand)', color: 'var(--base)',
                            fontSize: 16, fontWeight: 600, justifyContent: 'center',
                            border: 'none', cursor: 'pointer'
                        }}
                    >
                        <ShoppingBag size={18} />
                        Buy & Send Gift
                    </button>

                    <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--stone)', opacity: 0.7 }}>
                        Balance after purchase: <span style={{ color: 'var(--sand)' }}>{1250 - gift.price}</span>
                    </div>
                </div>

            </div>
        </main>
    );
}
