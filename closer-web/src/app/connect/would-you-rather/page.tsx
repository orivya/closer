"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useState } from "react";

type Scenario = {
    id: string;
    optionA: string;
    optionB: string;
    percentA: number; // Mock stat
};

const SAMPLE_SCENARIOS: Scenario[] = [
    { id: "s1", optionA: "Be able to fly but only at walking speed", optionB: "Teleport but only to places you've already been", percentA: 42 },
    { id: "s2", optionA: "Always have to say everything on your mind", optionB: "Never be able to speak again", percentA: 65 },
    { id: "s3", optionA: "Live in a treehouse in the jungle", optionB: "Live in a cave under the ocean", percentA: 80 },
];

export default function WouldYouRatherPage() {
    const [index, setIndex] = useState(0);
    const [choice, setChoice] = useState<"A" | "B" | null>(null);

    const scenario = SAMPLE_SCENARIOS[index];
    const percentB = 100 - scenario.percentA;

    function handleChoose(option: "A" | "B") {
        if (choice) return;
        setChoice(option);
    }

    function nextScenario() {
        setChoice(null);
        setIndex((i) => (i + 1) % SAMPLE_SCENARIOS.length);
    }

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Header Float */}
            <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 100 }}>
                <Link href="/connect" className="icon-btn focus-ring" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                    <ArrowLeft aria-hidden="true" />
                </Link>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

                {/* Option A (Top) */}
                <button
                    onClick={() => handleChoose("A")}
                    disabled={!!choice}
                    className="focus-ring"
                    style={{
                        flex: choice === "A" ? 2 : choice === "B" ? 0.5 : 1,
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
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: choice === "B" ? 20 : 32, color: 'var(--sand)', opacity: choice === "B" ? 0.5 : 1, transition: 'all 0.5s' }}>
                        {scenario.optionA}
                    </h2>
                    {choice && (
                        <div style={{ marginTop: 20, fontSize: 40, fontWeight: 200, color: 'var(--clay)', animation: 'fade-in-up 0.5s' }}>
                            {scenario.percentA}%
                        </div>
                    )}
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
                        flex: choice === "B" ? 2 : choice === "A" ? 0.5 : 1,
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
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: choice === "A" ? 20 : 32, color: 'var(--sand)', opacity: choice === "A" ? 0.5 : 1, transition: 'all 0.5s' }}>
                        {scenario.optionB}
                    </h2>
                    {choice && (
                        <div style={{ marginTop: 20, fontSize: 40, fontWeight: 200, color: 'var(--mist)', animation: 'fade-in-up 0.5s' }}>
                            {percentB}%
                        </div>
                    )}
                </button>

                {/* Next Button Overlay */}
                {choice && (
                    <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={nextScenario}
                            className="btn btn-primary"
                            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.6)', padding: '16px 32px' }}
                        >
                            <RefreshCw size={18} style={{ marginRight: 8 }} /> Next Scenario
                        </button>
                    </div>
                )}

            </div>
        </main>
    );
}
