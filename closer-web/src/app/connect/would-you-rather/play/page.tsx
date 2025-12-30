"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PlayContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get("c") || "General";

    const [choice, setChoice] = useState<"A" | "B" | null>(null);

    // Mock Data
    const optionA = "Always have to say everything on your mind";
    const optionB = "Never be able to speak again";

    function handleChoose(selected: "A" | "B") {
        if (choice) return;
        setChoice(selected);

        // Slight delay before navigation to show selection state
        setTimeout(() => {
            const params = new URLSearchParams();
            params.set("c", category);
            params.set("oa", optionA);
            params.set("ob", optionB);
            params.set("pick", selected);
            router.push(`/connect/would-you-rather/results?${params.toString()}`);
        }, 500);
    }

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Header Float */}
            <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 100 }}>
                <Link href="/connect/would-you-rather/categories" className="icon-btn focus-ring" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                    <ArrowLeft aria-hidden="true" />
                </Link>
            </div>

            {/* Category Badge Float */}
            <div style={{
                position: 'absolute', top: 24, left: 0, right: 0,
                display: 'flex', justifyContent: 'center', zIndex: 90, pointerEvents: 'none'
            }}>
                <div style={{
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                    padding: '4px 12px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--stone)'
                }}>
                    {category}
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

                {/* Option A (Top) */}
                <button
                    onClick={() => handleChoose("A")}
                    disabled={!!choice}
                    className="focus-ring"
                    style={{
                        flex: choice === "A" ? 1.5 : choice === "B" ? 0.5 : 1,
                        background: 'linear-gradient(135deg, rgba(224, 159, 125, 0.15), rgba(224, 159, 125, 0.05))',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: 40,
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        position: 'relative',
                        outline: 'none', textAlign: 'center'
                    }}
                >
                    <div style={{ color: 'var(--clay)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>
                        OPTION A
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-serif)', fontSize: choice === "B" ? 20 : 32,
                        color: 'var(--sand)', opacity: choice === "B" ? 0.5 : 1, transition: 'all 0.5s'
                    }}>
                        {optionA}
                    </h2>
                </button>

                {/* OR Badge */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 50, height: 50, borderRadius: '50%', background: '#000', border: '1px solid var(--border-highlight)',
                    display: 'grid', placeItems: 'center', zIndex: 10, pointerEvents: 'none',
                    color: 'var(--stone)', fontSize: 12, fontWeight: 800
                }}>
                    OR
                </div>

                {/* Option B (Bottom) */}
                <button
                    onClick={() => handleChoose("B")}
                    disabled={!!choice}
                    className="focus-ring"
                    style={{
                        flex: choice === "B" ? 1.5 : choice === "A" ? 0.5 : 1,
                        background: 'linear-gradient(135deg, rgba(196, 181, 253, 0.15), rgba(196, 181, 253, 0.05))',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: 40,
                        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        position: 'relative',
                        outline: 'none', textAlign: 'center'
                    }}
                >
                    <div style={{ color: 'var(--mist)', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 16 }}>
                        OPTION B
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-serif)', fontSize: choice === "A" ? 20 : 32,
                        color: 'var(--sand)', opacity: choice === "A" ? 0.5 : 1, transition: 'all 0.5s'
                    }}>
                        {optionB}
                    </h2>
                </button>

            </div>
        </main>
    );
}

export default function WYRPlayPage() {
    return (
        <Suspense fallback={<div className="view active" />}>
            <PlayContent />
        </Suspense>
    );
}
