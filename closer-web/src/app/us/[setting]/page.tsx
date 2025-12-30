"use client";

import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { useParams } from "next/navigation";

// Helper to titleize slugs
function toTitle(slug: string) {
    return slug
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export default function SettingsSubPage() {
    const params = useParams();
    const slug = params?.setting as string; // 'setting' matches the folder name [setting]
    const title = slug ? toTitle(slug) : "Settings";

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/us" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>{title}</h1>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, paddingBottom: 100 }}>
                <div style={{
                    width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                    border: '1px solid var(--border-subtle)'
                }}>
                    <Settings size={32} style={{ color: 'var(--mist)', opacity: 0.8 }} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--sand)', marginBottom: 12, textAlign: 'center' }}>
                    {title}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--stone)', textAlign: 'center', maxWidth: 300, lineHeight: 1.5 }}>
                    The <strong>{title}</strong> settings panel is under construction.
                </p>
            </div>
        </main>
    );
}
