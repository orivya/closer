"use client";

import Link from "next/link";
import { ArrowLeft, Check, Hammer, Image as ImageIcon, Plus } from "lucide-react";
import { useState } from "react";

type Dream = {
    id: string;
    title: string;
    category: "Travel" | "Home" | "Life";
    image: string;
    progress: number; // 0-100
    target: string;
};

const SAMPLE_DREAMS: Dream[] = [
    { id: "d1", title: "Japan Trip", category: "Travel", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80", progress: 45, target: "$8,000" },
    { id: "d2", title: "Renovate Kitchen", category: "Home", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80", progress: 10, target: "Summer 2026" },
    { id: "d3", title: "Learn Italian", category: "Life", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80", progress: 72, target: "Fluency" },
    { id: "d4", title: "Cabin in Woods", category: "Home", image: "https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?w=800&q=80", progress: 5, target: "Someday" },
];

export default function DreamBuilderPage() {
    const [filter, setFilter] = useState("All");
    const [dreams, setDreams] = useState(SAMPLE_DREAMS);

    function handleCreate() {
        // Quick mock add for prototype feel - normally this would open a modal
        const newDream: Dream = {
            id: Date.now().toString(),
            title: "New Adventure",
            category: "Travel",
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
            progress: 0,
            target: "Planner"
        };
        setDreams([newDream, ...dreams]);
    }

    const filtered = filter === "All" ? dreams : dreams.filter(d => d.category === filter);

    return (
        <main className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0 }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, color: 'var(--sand)' }}>Dream Builder</h1>
                    <div style={{ fontSize: 11, color: '#8AA686', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Shared Plans
                    </div>
                </div>
                <button className="icon-btn focus-ring">
                    <Hammer aria-hidden="true" size={18} />
                </button>
            </header>

            <div className="container" style={{ flex: 1 }}>

                {/* Filter Pills */}
                <div className="filter-pills" style={{ marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
                    {["All", "Travel", "Home", "Life"].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`filter-pill focus-ring ${filter === cat ? 'active' : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid (simulated with standard grid for simplicity) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: 16
                }}>
                    {/* Add New Tile */}
                    <button
                        onClick={handleCreate}
                        className="focus-ring"
                        style={{
                            aspectRatio: '3/4', borderRadius: 24, border: '1px dashed var(--border-strong)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(255,255,255,0.01)', gap: 12, color: 'var(--stone)',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'grid', placeItems: 'center' }}>
                            <Plus />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>New Dream</span>
                    </button>

                    {filtered.map(dream => (
                        <div key={dream.id} style={{
                            position: 'relative', borderRadius: 24, overflow: 'hidden',
                            border: '1px solid var(--border-subtle)', background: 'var(--surface-1)',
                            display: 'flex', flexDirection: 'column'
                        }}>
                            <div style={{ aspectRatio: '4/3', position: 'relative' }}>
                                <img src={dream.image}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    alt={dream.title}
                                />
                                <div style={{
                                    position: 'absolute', top: 8, right: 8,
                                    padding: '4px 8px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                                    borderRadius: 100, fontSize: 10, fontWeight: 700, color: '#fff'
                                }}>
                                    {dream.category}
                                </div>
                            </div>

                            <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--sand)', marginBottom: 4 }}>{dream.title}</h3>
                                <div style={{ fontSize: 12, color: 'var(--stone)', marginBottom: 12 }}>{dream.target}</div>

                                <div style={{ marginTop: 'auto' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 6, color: 'var(--stone)' }}>
                                        <span>Progress</span>
                                        <span>{dream.progress}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' }}>
                                        <div style={{ width: `${dream.progress}%`, height: '100%', background: '#8AA686' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </main>
    );
}
