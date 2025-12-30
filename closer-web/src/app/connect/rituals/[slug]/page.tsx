"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";

// Map slugs to friendly titles
const RITUAL_TITLES: Record<string, string> = {
    "morning": "Morning Hello",
    "gratitude": "Daily Gratitude",
    "goodnight": "Goodnight Ritual",
    "thinking": "Thinking of You",
    "weekly": "Weekly Check-in"
};

export default function RitualPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const title = RITUAL_TITLES[slug] || "Ritual";

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>{title}</h1>
                    <div style={{ fontSize: 11, color: 'var(--stone)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Guided Moment
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, paddingBottom: 100 }}>
                <div style={{
                    width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                    border: '1px solid var(--border-subtle)'
                }}>
                    <Sparkles size={32} style={{ color: 'var(--clay)', opacity: 0.8 }} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--sand)', marginBottom: 12, textAlign: 'center' }}>
                    Coming Soon
                </h2>
                <p style={{ fontSize: 14, color: 'var(--stone)', textAlign: 'center', maxWidth: 300, lineHeight: 1.5 }}>
                    The <strong>{title}</strong> experience is currently being crafted. Check back in the next update.
                </p>

                <div style={{ marginTop: 32, padding: '12px 24px', background: 'rgba(212, 175, 55, 0.05)', borderRadius: 100, color: '#D4AF37', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={14} /> Available in V1.1
                </div>
            </div>
        </main>
    );
}
