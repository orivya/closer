"use client";

import Link from "next/link";
import { ArrowLeft, Check, Star } from "lucide-react";

export default function SubscriptionPage() {
    return (
        <main className="view active" style={{
            display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0,
            background: 'var(--base)'
        }}>
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'relative', zIndex: 10
            }}>
                <Link href="/settings" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
            </header>

            <div className="container" style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <div style={{
                    width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--clay) 0%, #a05a3f 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                    boxShadow: '0 0 60px rgba(224, 159, 125, 0.3)'
                }}>
                    <Star size={40} className="text-white" fill="white" />
                </div>

                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: 'var(--sand)', marginBottom: 12, textAlign: 'center' }}>
                    Closer+
                </h1>
                <p style={{ fontSize: 16, color: 'var(--stone)', textAlign: 'center', marginBottom: 48, maxWidth: 300 }}>
                    Unlock the full potential of your relationship with premium tools.
                </p>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 48 }}>
                    <FeatureItem label="Unlimited Daily Rituals" />
                    <FeatureItem label="Custom Intimacy Decks" />
                    <FeatureItem label="Advanced Relationship Insights" />
                    <FeatureItem label="Exclusive Gift Store Items" />
                    <FeatureItem label="Priority Support" />
                </div>

                <div className="glass" style={{ width: '100%', padding: 24, borderRadius: 24, border: '1px solid var(--clay)', textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--clay)', marginBottom: 8 }}>
                        ANNUAL PLAN
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--sand)', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
                        $29.99 <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--stone)' }}>/ year</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--stone)', marginTop: 8 }}>
                        Less than $2.50 / month
                    </div>
                </div>

                <button className="btn btn-primary focus-ring pressable" style={{
                    width: '100%', height: 56, borderRadius: 100,
                    background: 'var(--sand)', color: 'var(--base)', fontWeight: 700, fontSize: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    Start 7-Day Free Trial
                </button>

            </div>
        </main>
    );
}

function FeatureItem({ label }: { label: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
                minWidth: 24, height: 24, borderRadius: '50%', background: 'rgba(224, 159, 125, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clay)'
            }}>
                <Check size={14} style={{ strokeWidth: 3 }} />
            </div>
            <span style={{ fontSize: 16, color: 'var(--sand)' }}>{label}</span>
        </div>
    );
}
