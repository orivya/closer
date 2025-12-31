"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, DollarSign, Globe, Home, Image as ImageIcon, Rocket, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "CATEGORY" | "DETAILS" | "VISUALS";

export default function CreateDreamPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("CATEGORY");

    // Form State
    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [target, setTarget] = useState(""); // e.g., "$5000" or "Summer 2026"
    const [selectedImage, setSelectedImage] = useState("");

    const categories = [
        { id: "Travel", icon: Globe, color: "var(--mist)", label: "Travel & Adventure" },
        { id: "Home", icon: Home, color: "var(--clay)", label: "Home & Living" },
        { id: "Financial", icon: DollarSign, color: "var(--gold)", label: "Financial Goals" },
        { id: "Life", icon: Sparkles, color: "var(--love)", label: "Life Milestones" },
    ];

    const stockImages = [
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", // Travel / Nature
        "https://images.unsplash.com/photo-1484154218962-a1c00207099b?w=800&q=80", // Home / Kitchen
        "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80", // Money / Piggybank
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80", // Life / School
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", // Beach
        "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&q=80", // Cozy Winter
    ];

    function handleNext() {
        if (step === "CATEGORY" && category) setStep("DETAILS");
        else if (step === "DETAILS" && title) setStep("VISUALS");
        else if (step === "VISUALS" && selectedImage) {
            // Submit logic would go here
            // For now, redirect to main board with a "success" flag
            router.push("/connect/dream-builder?new_dream=true");
        }
    }

    function handleBack() {
        if (step === "DETAILS") setStep("CATEGORY");
        else if (step === "VISUALS") setStep("DETAILS");
        else router.back();
    }

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <button onClick={handleBack} className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </button>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>New Dream</h1>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 4 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{
                                width: 6, height: 6, borderRadius: '50%',
                                background: (step === "CATEGORY" && i === 1) || (step === "DETAILS" && i <= 2) || (step === "VISUALS" && i <= 3) ? 'var(--sand)' : 'var(--border-strong)'
                            }} />
                        ))}
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column' }}>

                {/* STEP 1: CATEGORY */}
                {step === "CATEGORY" && (
                    <div className="animate-in fade-in slide-in-from-right-4" style={{ flex: 1 }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--sand)', marginBottom: 8, textAlign: 'center' }}>
                            What kind of dream is this?
                        </h2>
                        <p style={{ textAlign: 'center', color: 'var(--stone)', fontSize: 14, marginBottom: 32 }}>
                            This helps us organize your shared vision board.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategory(cat.id)}
                                    className="glass pressable focus-ring"
                                    style={{
                                        padding: 20, borderRadius: 20,
                                        display: 'flex', alignItems: 'center', gap: 16,
                                        border: category === cat.id ? `2px solid ${cat.color}` : '1px solid var(--border-subtle)',
                                        background: category === cat.id ? 'var(--surface-2)' : undefined,
                                        textAlign: 'left'
                                    }}
                                >
                                    <div style={{
                                        width: 48, height: 48, borderRadius: '50%', background: 'var(--surface-active)',
                                        color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <cat.icon size={20} />
                                    </div>
                                    <div style={{ flex: 1, fontSize: 16, fontWeight: 600, color: 'var(--sand)' }}>{cat.label}</div>
                                    {category === cat.id && <Check size={20} color={cat.color} />}
                                </button>
                            ))}

                            {/* Custom Category input could go here, for now let's keep it simple or add a generic "Other" */}
                            <button
                                onClick={() => setCategory("Other")}
                                className="glass pressable focus-ring"
                                style={{
                                    padding: 20, borderRadius: 20,
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    border: category === "Other" ? `2px solid var(--clay)` : '1px solid var(--border-subtle)',
                                    background: category === "Other" ? `rgba(224, 159, 125, 0.1)` : undefined,
                                    textAlign: 'left'
                                }}
                            >
                                <div style={{
                                    width: 48, height: 48, borderRadius: '50%', background: `rgba(224, 159, 125, 0.2)`,
                                    color: 'var(--clay)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Sparkles size={20} />
                                </div>
                                <div style={{ flex: 1, fontSize: 16, fontWeight: 600, color: 'var(--sand)' }}>Something Else</div>
                                {category === "Other" && <Check size={20} color="var(--clay)" />}
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: DETAILS */}
                {step === "DETAILS" && (
                    <div className="animate-in fade-in slide-in-from-right-4" style={{ flex: 1 }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--sand)', marginBottom: 32, textAlign: 'center' }}>
                            Give it a name
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--stone)', marginBottom: 8, textTransform: 'uppercase' }}>
                                    Dream Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Trip to Amalfi Coast"
                                    className="focus-ring"
                                    style={{
                                        width: '100%', padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-subtle)', color: 'var(--sand)', fontSize: 16, outline: 'none'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--stone)', marginBottom: 8, textTransform: 'uppercase' }}>
                                    Target Date
                                </label>
                                <input
                                    type="text"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    placeholder="e.g. Summer 2026"
                                    className="focus-ring"
                                    style={{
                                        width: '100%', padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-subtle)', color: 'var(--sand)', fontSize: 16, outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: VISUALS */}
                {step === "VISUALS" && (
                    <div className="animate-in fade-in slide-in-from-right-4" style={{ flex: 1 }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--sand)', marginBottom: 8, textAlign: 'center' }}>
                            Visualize it
                        </h2>
                        <p style={{ textAlign: 'center', color: 'var(--stone)', fontSize: 14, marginBottom: 24 }}>
                            Pick an image that inspires you.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {stockImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(img)}
                                    className="focus-ring pressable"
                                    style={{
                                        borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', position: 'relative',
                                        border: selectedImage === img ? '3px solid var(--clay)' : 'none',
                                        opacity: selectedImage && selectedImage !== img ? 0.5 : 1
                                    }}
                                >
                                    <img src={img} alt="Dream visual" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {selectedImage === img && (
                                        <div style={{
                                            position: 'absolute', top: 8, right: 8, width: 24, height: 24,
                                            background: 'var(--clay)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <Check size={14} color="#000" />
                                        </div>
                                    )}
                                </button>
                            ))}

                            <button className="focus-ring pressable" style={{
                                borderRadius: 16, border: '1px dashed var(--border-strong)', aspectRatio: '4/3',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--stone)', gap: 8
                            }}>
                                <ImageIcon size={24} />
                                <span style={{ fontSize: 12 }}>Upload</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div style={{ marginTop: 24, padding: 16 }}>
                    <button
                        onClick={handleNext}
                        disabled={
                            (step === "CATEGORY" && !category) ||
                            (step === "DETAILS" && !title) ||
                            (step === "VISUALS" && !selectedImage)
                        }
                        className="btn btn-primary focus-ring pressable"
                        style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: 16 }}
                    >
                        {step === "VISUALS" ? (
                            <>
                                <Rocket size={20} style={{ marginRight: 8 }} /> Launch Dream
                            </>
                        ) : (
                            <>
                                Next Step <ArrowRight size={20} style={{ marginLeft: 8 }} />
                            </>
                        )}
                    </button>
                </div>

            </div>
        </main>
    );
}
