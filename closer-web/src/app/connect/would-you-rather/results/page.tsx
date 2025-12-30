"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, MessageCircle } from "lucide-react";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResultsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get("c") || "General";
    const optionA = searchParams.get("oa") || "Option A";
    const optionB = searchParams.get("ob") || "Option B";
    const userPick = searchParams.get("pick") || "A";

    // Mock stats
    const percentA = 65;
    const percentB = 35;

    // Mock partner pick
    const [partnerPick, setPartnerPick] = useState<"A" | "B" | null>(null);

    useEffect(() => {
        // Simulate partner pick fetch
        setPartnerPick(Math.random() > 0.5 ? "A" : "B");
    }, []);

    if (!partnerPick) return <div className="view active" />;

    const isMatch = userPick === partnerPick;

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect/would-you-rather/categories" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Results</h1>
                    <div style={{ fontSize: 11, color: isMatch ? '#10B981' : 'var(--clay)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {isMatch ? "You Agreed!" : "Different Paths"}
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Result Card A */}
                <div style={{
                    flex: 1, borderRadius: 24, position: 'relative', overflow: 'hidden',
                    border: userPick === "A" ? '2px solid var(--clay)' : '1px solid var(--border-subtle)',
                    background: 'linear-gradient(135deg, rgba(224, 159, 125, 0.1), rgba(255,255,255,0.02))',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--clay)', letterSpacing: '0.1em' }}>OPTION A</span>
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--sand)', marginBottom: 16 }}>
                            {optionA}
                        </h3>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {userPick === "A" && <span style={{ fontSize: 10, background: 'var(--clay)', color: '#000', padding: '4px 8px', borderRadius: 4, fontWeight: 700 }}>YOU</span>}
                            {partnerPick === "A" && <span style={{ fontSize: 10, background: 'var(--stone)', color: '#000', padding: '4px 8px', borderRadius: 4, fontWeight: 700 }}>THEM</span>}
                        </div>
                    </div>
                </div>

                {/* Result Card B */}
                <div style={{
                    flex: 1, borderRadius: 24, position: 'relative', overflow: 'hidden',
                    border: userPick === "B" ? '2px solid var(--mist)' : '1px solid var(--border-subtle)',
                    background: 'linear-gradient(135deg, rgba(196, 181, 253, 0.1), rgba(255,255,255,0.02))',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 24
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--mist)', letterSpacing: '0.1em' }}>OPTION B</span>
                        </div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--sand)', marginBottom: 16 }}>
                            {optionB}
                        </h3>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {userPick === "B" && <span style={{ fontSize: 10, background: 'var(--mist)', color: '#000', padding: '4px 8px', borderRadius: 4, fontWeight: 700 }}>YOU</span>}
                            {partnerPick === "B" && <span style={{ fontSize: 10, background: 'var(--stone)', color: '#000', padding: '4px 8px', borderRadius: 4, fontWeight: 700 }}>THEM</span>}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                    <button className="btn focus-ring pressable" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'var(--sand)' }}>
                        <MessageCircle size={18} /> Discuss
                    </button>
                    <Link href={`/connect/would-you-rather/play?c=${category}`} className="btn btn-primary focus-ring pressable" style={{ flex: 2 }}>
                        <RefreshCw size={18} /> Next Scenario
                    </Link>
                </div>

            </div>
        </main>
    );
}

export default function WYRResultsPage() {
    return (
        <Suspense fallback={<div className="view active" />}>
            <ResultsContent />
        </Suspense>
    );
}
