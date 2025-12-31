"use client";

import Link from "next/link";
import { ArrowLeft, Check, Gift } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const WRAPPERS = [
    { id: 'gold', name: 'Royal Gold', color: '#fbbf24', bg: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' },
    { id: 'red', name: 'Velvet Red', color: '#f87171', bg: 'linear-gradient(135deg, #f87171 0%, #b91c1c 100%)' },
    { id: 'blue', name: 'Midnight', color: '#60a5fa', bg: 'linear-gradient(135deg, #60a5fa 0%, #1e40af 100%)' },
];

export default function SendGiftPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [message, setMessage] = useState("");
    const [wrapper, setWrapper] = useState('gold');
    const [isSending, setIsSending] = useState(false);

    function handleSend() {
        setIsSending(true);
        // Mock Send
        setTimeout(() => {
            // In a real app, this would route to a success page or back to hub
            // For now, let's route to the Inventory to show it "Sent"
            router.push('/connect/gifts/inventory');
        }, 2000);
    }

    const selectedWrapper = WRAPPERS.find(w => w.id === wrapper) || WRAPPERS[0];

    return (
        <main className="view active" style={{
            display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0,
            background: 'var(--base)'
        }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'relative', zIndex: 10
            }}>
                <Link href={`/connect/gifts/${id}`} className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--sand)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Wrap Gift
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column' }}>

                {/* Preview Box */}
                <div style={{
                    alignSelf: 'center', width: 140, height: 140, borderRadius: 24, marginBottom: 32,
                    background: selectedWrapper.bg,
                    boxShadow: `0 20px 40px -10px ${selectedWrapper.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease'
                }}>
                    <Gift size={48} color="rgba(255,255,255,0.9)" />
                </div>

                {/* Wrapper Selection */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--stone)', letterSpacing: '0.05em', marginBottom: 16, textTransform: 'uppercase' }}>
                        Choose Wrapping
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        {WRAPPERS.map(w => (
                            <button
                                key={w.id}
                                onClick={() => setWrapper(w.id)}
                                className="pressable focus-ring"
                                style={{
                                    height: 60, borderRadius: 16,
                                    background: w.bg,
                                    border: wrapper === w.id ? '2px solid #fff' : '2px solid transparent',
                                    boxShadow: wrapper === w.id ? `0 0 0 2px var(--base), 0 0 0 4px ${w.color}` : 'none',
                                    opacity: wrapper === w.id ? 1 : 0.6,
                                    transition: 'all 0.2s', cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Message */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--stone)', letterSpacing: '0.05em', marginBottom: 16, textTransform: 'uppercase' }}>
                        Add a Note
                    </div>
                    <div className="glass" style={{
                        flex: 1, borderRadius: 24, padding: 16,
                        border: '1px solid var(--border-subtle)',
                        display: 'flex'
                    }}>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write a sweet message..."
                            className="focus-ring"
                            style={{
                                flex: 1, background: 'transparent', border: 'none', resize: 'none', outline: 'none',
                                fontSize: 16, color: 'var(--sand)', fontFamily: 'var(--font-sans)', lineHeight: 1.5
                            }}
                        />
                    </div>
                </div>

                {/* Send Button */}
                <div style={{ marginTop: 24 }}>
                    <button
                        onClick={handleSend}
                        disabled={isSending}
                        className="btn focus-ring pressable"
                        style={{
                            width: '100%', padding: 18, borderRadius: 16,
                            background: selectedWrapper.bg, color: '#fff',
                            fontSize: 16, fontWeight: 600, justifyContent: 'center',
                            border: 'none', cursor: 'pointer',
                            opacity: isSending ? 0.8 : 1
                        }}
                    >
                        {isSending ? 'Sending...' : (
                            <>Send Gift <Check size={18} style={{ marginLeft: 8 }} /></>
                        )}
                    </button>
                    {isSending && (
                        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--stone)' }}>
                            Delivering to partner...
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}
