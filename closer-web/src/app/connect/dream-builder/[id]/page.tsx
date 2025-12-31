"use client";

import Link from "next/link";
import { ArrowLeft, Plus, Check, MapPin, Calendar, MessageCircle, Image as ImageIcon, List, MoreHorizontal, Send, PenTool, Trash2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";

// Mock Data
const DREAM = {
    id: 'japan',
    title: 'Japan Trip',
    date: 'Summer 2025',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=60',
    milestones: [
        { id: 1, title: 'Book Flights', status: 'completed', assignee: 'You' },
        { id: 2, title: 'Choose Hotels', status: 'in-progress', assignee: 'Partner' },
        { id: 3, title: 'Itinerary Planning', status: 'pending', assignee: 'You' },
        { id: 4, title: 'Save $5000', status: 'in-progress', assignee: 'Joint' },
    ],
    visionBoard: [
        { id: 1, url: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=400&auto=format&fit=crop&q=60', addedBy: 'You' },
        { id: 2, url: 'https://images.unsplash.com/photo-1528360983277-13d9b152c6d1?w=400&auto=format&fit=crop&q=60', addedBy: 'Partner' },
        { id: 3, url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400&auto=format&fit=crop&q=60', addedBy: 'You' },
    ],
    chat: [
        { id: 1, user: 'Partner', message: 'I found a great ryokan in Kyoto!', time: '2h ago' },
        { id: 2, user: 'You', message: 'Oh nice! Send the link?', time: '1h ago' },
    ]
};

export default function DreamDetailPage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState<'plan' | 'vision' | 'chat'>('plan');
    const [showMenu, setShowMenu] = useState(false);

    // Mock Interactions
    const [msgInput, setMsgInput] = useState("");
    const [chat, setChat] = useState(DREAM.chat);
    const [milestones, setMilestones] = useState(DREAM.milestones);
    const [visionBoard, setVisionBoard] = useState(DREAM.visionBoard);

    // New Task Interaction State
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    function handleSend() {
        if (!msgInput.trim()) return;
        setChat([...chat, { id: Date.now(), user: 'You', message: msgInput, time: 'Just now' }]);
        setMsgInput("");
    }

    function handleSaveTask() {
        if (!newTaskTitle.trim()) {
            setIsAddingTask(false);
            return;
        }
        const newId = milestones.length + 1;
        setMilestones([...milestones, {
            id: newId,
            title: newTaskTitle,
            status: 'pending',
            assignee: 'You'
        }]);
        setNewTaskTitle("");
        setIsAddingTask(false);
    }

    function toggleMilestone(id: number) {
        setMilestones(milestones.map(m =>
            m.id === id
                ? { ...m, status: m.status === 'completed' ? 'pending' : 'completed' }
                : m
        ));
    }

    function handleAddPhoto() {
        const newId = visionBoard.length + 1;
        setVisionBoard([...visionBoard, {
            id: newId,
            url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=60', // Generic beach placeholder
            addedBy: 'You'
        }]);
    }

    return (
        <main className="view active" style={{
            display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0,
            background: 'var(--base)'
        }}>

            {/* COMPACT HEADER WITH HERO BANNER */}
            <header style={{ position: 'relative', zIndex: 10 }}>
                {/* Background Image with Overlay */}
                <div style={{
                    height: 220, width: '100%', position: 'relative', overflow: 'hidden'
                }}>
                    <img
                        src={DREAM.image}
                        alt="Dream Cover"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), var(--base))' }} />
                </div>

                {/* Navbar (Absolute on top) */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, padding: 24,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <Link href="/connect/dream-builder" className="icon-btn glass" style={{ color: '#fff' }}>
                        <ArrowLeft aria-hidden="true" />
                    </Link>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="icon-btn glass"
                            style={{ color: '#fff' }}
                        >
                            <MoreHorizontal />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div className="fade-in" style={{
                                position: 'absolute', top: '100%', right: 0, marginTop: 8,
                                background: 'var(--surface-2)', border: '1px solid var(--border-subtle)',
                                borderRadius: 16, padding: 8, width: 140, zIndex: 20,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)'
                            }}>
                                <button className="pressable" style={{
                                    width: '100%', textAlign: 'left', padding: '10px 12px', fontSize: 13,
                                    color: 'var(--sand)', display: 'flex', alignItems: 'center', gap: 8,
                                    borderRadius: 8
                                }} onClick={() => setShowMenu(false)}>
                                    <PenTool size={14} /> Edit
                                </button>
                                <button className="pressable" style={{
                                    width: '100%', textAlign: 'left', padding: '10px 12px', fontSize: 13,
                                    color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8,
                                    borderRadius: 8
                                }} onClick={() => setShowMenu(false)}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dream Title & Meta (Overlapping Hero) */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 24px 16px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'
                }}>
                    <div>
                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: '#fff', lineHeight: 1.1, marginBottom: 4 }}>
                            {DREAM.title}
                        </h1>
                        <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Calendar size={12} /> {DREAM.date}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MapPin size={12} /> Tokyo, Japan
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* TABS NAVIGATION (Mobile Only) */}
            <div className="mobile-only-tabs" style={{
                display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 24px'
            }}>
                <TabButton
                    active={activeTab === 'plan'}
                    label="The Plan"
                    icon={<List size={14} />}
                    onClick={() => setActiveTab('plan')}
                />
                <TabButton
                    active={activeTab === 'vision'}
                    label="Vision Board"
                    icon={<ImageIcon size={14} />}
                    onClick={() => setActiveTab('vision')}
                />
                <TabButton
                    active={activeTab === 'chat'}
                    label="Discussion"
                    icon={<MessageCircle size={14} />}
                    onClick={() => setActiveTab('chat')}
                />
            </div>

            <style jsx>{`
                @media (min-width: 900px) {
                    .mobile-only-tabs { display: none !important; }
                    .dream-dashboard-grid {
                        display: grid !important;
                        grid-template-columns: 3fr 2fr 2fr; /* 3 Columns: Plan | Vision | Chat */
                        gap: 24px;
                        height: 100%;
                        overflow: hidden; 
                    }
                    .dashboard-col-left {
                        overflow-y: auto;
                        padding-right: 12px;
                        border-right: 1px solid var(--border-subtle);
                    }
                    .dashboard-col-mid {
                        overflow-y: auto;
                        padding-right: 12px;
                        border-right: 1px solid var(--border-subtle);
                    }
                    .dashboard-col-right {
                        display: flex;
                        flex-direction: column;
                        overflow-y: auto;
                        padding-left: 12px;
                    }
                    /* Ensure all sections are visible on desktop */
                    .dashboard-section { display: block !important; }
                }
                @media (max-width: 899px) {
                    .dream-dashboard-grid {
                        display: block; 
                    }
                    .dashboard-section {
                        display: none; 
                    }
                    .dashboard-section.active {
                        display: block;
                        animation: fade-in 0.3s ease;
                    }
                }
            `}</style>

            {/* CONTENT AREA */}
            <div className="container dream-dashboard-grid" style={{ flex: 1, padding: 24, paddingBottom: 0, maxWidth: 1400 }}>

                {/* LEFT COLUMN: PLAN */}
                <div className={`dashboard-col-left dashboard-section ${activeTab === 'plan' ? 'active' : ''}`}>
                    <div className="fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--stone)', letterSpacing: '0.05em' }}>THE PLAN</div>
                            {!isAddingTask && (
                                <button onClick={() => setIsAddingTask(true)} className="text-btn focus-ring" style={{ fontSize: 13, color: 'var(--clay)' }}>
                                    + Add Task
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {isAddingTask && (
                                <div className="glass focus-ring slide-in-top" style={{
                                    padding: 16, borderRadius: 16, border: '1px solid var(--clay)',
                                    display: 'flex', alignItems: 'center', gap: 16, background: 'var(--surface-2)'
                                }}>
                                    <div style={{
                                        width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--stone)',
                                        opacity: 0.5
                                    }} />
                                    <input
                                        autoFocus
                                        value={newTaskTitle}
                                        onChange={(e) => setNewTaskTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveTask()}
                                        placeholder="What needs to be done?"
                                        style={{
                                            flex: 1, background: 'transparent', border: 'none', color: 'var(--sand)',
                                            fontSize: 14, outline: 'none'
                                        }}
                                    />
                                    <button onClick={handleSaveTask} style={{ fontSize: 13, color: 'var(--clay)', fontWeight: 600 }}>
                                        Save
                                    </button>
                                </div>
                            )}

                            {milestones.map(m => (
                                <div key={m.id} className="glass focus-ring" style={{
                                    padding: 16, borderRadius: 16, border: '1px solid var(--border-subtle)',
                                    display: 'flex', alignItems: 'center', gap: 16
                                }}>
                                    <button
                                        onClick={() => toggleMilestone(m.id)}
                                        style={{
                                            width: 24, height: 24, borderRadius: '50%', border: '2px solid var(--stone)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: m.status === 'completed' ? 'var(--clay)' : 'transparent',
                                            borderColor: m.status === 'completed' ? 'var(--clay)' : 'var(--stone)',
                                            transition: 'all 0.2s'
                                        }}>
                                        {m.status === 'completed' && <Check size={14} strokeWidth={3} />}
                                    </button>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            textDecoration: m.status === 'completed' ? 'line-through' : 'none',
                                            color: m.status === 'completed' ? 'var(--stone)' : 'var(--sand)',
                                            fontWeight: 500
                                        }}>
                                            {m.title}
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: 11, padding: '4px 8px', borderRadius: 8,
                                        background: 'rgba(255,255,255,0.05)', color: 'var(--stone)'
                                    }}>
                                        {m.assignee}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MIDDLE COLUMN: VISION BOARD */}
                <div className={`dashboard-col-mid dashboard-section ${activeTab === 'vision' ? 'active' : ''}`}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--stone)', letterSpacing: '0.05em', marginBottom: 16 }}>VISION BOARD</div>
                    <div className="fade-in">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <button onClick={handleAddPhoto} className="focus-ring" style={{
                                aspectRatio: '1.2', borderRadius: 16, border: '1px dashed var(--stone)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--stone)', fontSize: 13
                            }}>
                                <Plus size={24} style={{ marginBottom: 4 }} />
                                Add Photo
                            </button>
                            {visionBoard.map(img => (
                                <div key={img.id} style={{ position: 'relative', aspectRatio: '1.2', borderRadius: 16, overflow: 'hidden' }}>
                                    <img src={img.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: CHAT */}
                <div className={`dashboard-col-right dashboard-section ${activeTab === 'chat' ? 'active' : ''}`}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--stone)', letterSpacing: '0.05em', marginBottom: 16 }}>DISCUSSION</div>
                        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16, minHeight: 0, overflowY: 'auto', paddingRight: 4 }}>
                                {chat.map(c => (
                                    <div key={c.id} style={{
                                        alignSelf: c.user === 'You' ? 'flex-end' : 'flex-start',
                                        maxWidth: '90%'
                                    }}>
                                        <div style={{
                                            fontSize: 10, color: 'var(--stone)', marginBottom: 4,
                                            textAlign: c.user === 'You' ? 'right' : 'left'
                                        }}>
                                            {c.user} • {c.time}
                                        </div>
                                        <div style={{
                                            background: c.user === 'You' ? 'var(--clay)' : 'var(--surface-2)',
                                            color: c.user === 'You' ? '#fff' : 'var(--sand)',
                                            padding: '10px 14px', borderRadius: 16, fontSize: 14, lineHeight: 1.4,
                                            borderBottomRightRadius: c.user === 'You' ? 2 : 16,
                                            borderBottomLeftRadius: c.user === 'You' ? 16 : 2
                                        }}>
                                            {c.message}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="glass" style={{
                                padding: 8, borderRadius: 24, display: 'flex', alignItems: 'center',
                                border: '1px solid var(--border-subtle)', background: 'var(--surface-1)'
                            }}>
                                <input
                                    value={msgInput}
                                    onChange={(e) => setMsgInput(e.target.value)}
                                    placeholder="Discuss this dream..."
                                    style={{
                                        flex: 1, background: 'transparent', border: 'none', padding: '0 16px',
                                        color: 'var(--sand)', outline: 'none', fontSize: 14
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    className="icon-btn"
                                    style={{ background: 'var(--clay)', color: '#fff', width: 32, height: 32, borderRadius: '50%' }}
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function TabButton({ active, label, icon, onClick }: { active: boolean, label: string, icon: any, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '16px 0', borderBottom: active ? '2px solid var(--clay)' : '2px solid transparent',
                color: active ? 'var(--sand)' : 'var(--stone)',
                transition: 'all 0.2s', fontSize: 13, fontWeight: 600
            }}
        >
            {icon} {label}
        </button>
    );
}
