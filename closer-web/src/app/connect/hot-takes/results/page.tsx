"use client";

import Link from "next/link";
import { ArrowLeft, Flame, MessageCircle, RotateCw } from "lucide-react";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResultsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get("c") || "General";
    const statement = searchParams.get("q") || "It’s better to be always 10 minutes early than 1 minute late.";
    const userRating = parseInt(searchParams.get("r") || "0");

    const [partnerRating, setPartnerRating] = useState<number | null>(null);

    useEffect(() => {
        // Simulate fetching partner's rating
        setPartnerRating(Math.floor(Math.random() * 5) + 1);
    }, []);

    if (!partnerRating) return <div className="view active" />;

    const isMatch = Math.abs(userRating - partnerRating) <= 1;
    const matchColor = isMatch ? "#10B981" : "#EF4444"; // Green vs Red
    const matchText = isMatch ? "IT'S A MATCH!" : "SPICY DISAGREEMENT";

    function getFlameColor(level: number) {
        if (level === 1) return "#9CA3AF";
        if (level === 2) return "#C4B5FD";
        if (level === 3) return "#F5E6D3";
        if (level === 4) return "#E09F7D";
        return "#FF6B6B";
    }

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect/hot-takes/categories" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Results</h1>
                    <div style={{ fontSize: 11, color: isMatch ? matchColor : 'var(--clay)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {matchText}
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                {/* The Statement Ref */}
                <h3 style={{
                    fontFamily: 'var(--font-serif)', fontSize: 20, lineHeight: 1.4,
                    textAlign: 'center', color: 'var(--sand)', marginBottom: 40, opacity: 0.8
                }}>
                    "{statement}"
                </h3>

                {/* Comparison Visual */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32, marginBottom: 48, height: 200 }}>
                    {/* You */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--sand)' }}>YOU</div>
                        <div style={{
                            width: 60,
                            height: userRating * 30, // Dynamic height
                            background: getFlameColor(userRating),
                            borderRadius: 12,
                            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                            paddingTop: 12,
                            transition: 'height 1s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: `0 0 20px ${getFlameColor(userRating)}40`
                        }}>
                            <span style={{ color: '#000', fontWeight: 700 }}>{userRating}</span>
                        </div>
                    </div>

                    {/* VS */}
                    <div style={{ paddingBottom: 20, fontSize: 12, color: 'var(--stone)', fontStyle: 'italic' }}>VS</div>

                    {/* Partner */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--sand)' }}>THEM</div>
                        <div style={{
                            width: 60,
                            height: partnerRating * 30, // Dynamic height
                            background: getFlameColor(partnerRating),
                            borderRadius: 12,
                            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                            paddingTop: 12,
                            transition: 'height 1s cubic-bezier(0.16, 1, 0.3, 1)',
                            boxShadow: `0 0 20px ${getFlameColor(partnerRating)}40`
                        }}>
                            <span style={{ color: '#000', fontWeight: 700 }}>{partnerRating}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ width: '100%', display: 'flex', gap: 12 }}>
                    <button className="btn focus-ring pressable" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'var(--sand)' }}>
                        <MessageCircle size={18} /> Discuss
                    </button>
                    <Link href={`/connect/hot-takes/play?c=${category}`} className="btn btn-primary focus-ring pressable" style={{ flex: 2 }}>
                        <RotateCw size={18} /> Next Take
                    </Link>
                </div>

            </div>
        </main>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<div className="view active" />}>
            <ResultsContent />
        </Suspense>
    );
}
