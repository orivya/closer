"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Edit2, MoreHorizontal, Plus, Trophy } from "lucide-react";
import { useState } from "react";

export default function DreamDetailPage() {
    // Mock Data (In reality would fetch by ID)
    const dream = {
        id: "d1",
        title: "Japan Trip",
        category: "Travel",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
        target: "Summer 2025",
        milestones: [
            { id: 1, label: "Determine Dates", completed: true },
            { id: 2, label: "Research Destinations", completed: true },
            { id: 3, label: "Book Flights", completed: false },
            { id: 4, label: "Book Accommodations", completed: false },
            { id: 5, label: "Plan Itinerary", completed: false },
            { id: 6, label: "Learn Basic Japanese Phrases", completed: false },
        ]
    };

    const [milestones, setMilestones] = useState(dream.milestones);

    function toggleMilestone(id: number) {
        setMilestones(prev => prev.map(m =>
            m.id === id ? { ...m, completed: !m.completed } : m
        ));
    }

    const completedCount = milestones.filter(m => m.completed).length;
    const progressPercent = Math.round((completedCount / milestones.length) * 100);

    function handleMenu() {
        alert("Edit Dream settings coming in V2");
    }

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--base)', overflowY: 'auto' }}>
            {/* Header (Fixed & Transparent) */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: 24, zIndex: 50, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
                <Link href="/connect/dream-builder" className="icon-btn focus-ring" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', pointerEvents: 'auto' }}>
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <button onClick={handleMenu} className="icon-btn focus-ring" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', pointerEvents: 'auto' }}>
                    <MoreHorizontal size={20} />
                </button>
            </div>

            {/* Hero Image */}
            <div style={{ height: '40vh', minHeight: 300, position: 'relative', flexShrink: 0 }}>
                <img src={dream.image} alt={dream.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150, background: 'linear-gradient(to top, var(--base), transparent)' }} />

                <div style={{ position: 'absolute', bottom: 32, left: 24, right: 24 }}>
                    <div style={{
                        display: 'inline-block', padding: '4px 10px', background: 'rgba(224, 159, 125, 0.15)',
                        color: 'var(--clay)', fontSize: 11, fontWeight: 700, borderRadius: 12, marginBottom: 12,
                        backdropFilter: 'blur(4px)', border: '1px solid rgba(224, 159, 125, 0.25)',
                        fontFamily: 'var(--font-sans)', letterSpacing: '0.05em'
                    }}>
                        {dream.category.toUpperCase()}
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)', lineHeight: 1.2 }}>
                        {dream.title}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="container" style={{ padding: '0 24px 80px', flex: 1 }}>

                {/* Progress Card */}
                <div className="glass" style={{ padding: 24, borderRadius: 24, marginBottom: 32, border: '1px solid var(--border-subtle)', background: 'var(--layer-1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div>
                            <div style={{ fontSize: 11, color: 'var(--stone)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Target Date</div>
                            <div style={{ fontSize: 18, color: 'var(--sand)', fontFamily: 'var(--font-serif)' }}>{dream.target}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 11, color: 'var(--stone)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Milestones</div>
                            <div style={{ fontSize: 18, color: 'var(--clay)', fontFamily: 'var(--font-serif)' }}>{completedCount}/{milestones.length}</div>
                        </div>
                    </div>

                    <div>
                        <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 100, overflow: 'hidden' }}>
                            <div style={{
                                width: `${progressPercent}%`, height: '100%',
                                background: 'var(--clay)',
                                boxShadow: '0 0 10px rgba(224, 159, 125, 0.5)',
                                transition: 'width 0.5s ease-out'
                            }} />
                        </div>
                    </div>
                </div>

                {/* Milestones */}
                <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--sand)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Trophy size={16} color="var(--clay)" /> Path to Success
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {milestones.map((milestone) => (
                            <button
                                key={milestone.id}
                                onClick={() => toggleMilestone(milestone.id)}
                                className="glass pressable"
                                style={{
                                    padding: 20, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16,
                                    textAlign: 'left',
                                    background: milestone.completed ? 'rgba(224, 159, 125, 0.05)' : 'var(--layer-1)',
                                    border: milestone.completed ? '1px solid rgba(224, 159, 125, 0.15)' : '1px solid var(--border-subtle)'
                                }}
                            >
                                {milestone.completed ? (
                                    <CheckCircle2 size={24} color="var(--clay)" />
                                ) : (
                                    <Circle size={24} color="var(--stone)" />
                                )}
                                <span style={{
                                    flex: 1, fontSize: 15,
                                    color: milestone.completed ? 'var(--sand)' : 'var(--stone)',
                                    textDecoration: milestone.completed ? 'line-through' : 'none',
                                    opacity: milestone.completed ? 0.7 : 1,
                                    lineHeight: 1.4
                                }}>
                                    {milestone.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add Milestone Placeholder */}
                <button className="pressable" style={{
                    width: '100%', padding: 16, borderRadius: 16,
                    border: '1px dashed var(--border-subtle)', color: 'var(--stone)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontSize: 14, fontWeight: 500
                }}>
                    <Plus size={16} /> Add Milestone
                </button>

            </div>
        </main>
    );
}
