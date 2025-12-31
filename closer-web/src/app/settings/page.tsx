"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, User, Bell, Shield, Star, HelpCircle, LogOut } from "lucide-react";

export default function SettingsPage() {
    return (
        <main className="view active" style={{
            display: 'flex', flexDirection: 'column', height: '100vh', paddingBottom: 0,
            background: 'var(--base)'
        }}>
            {/* Header */}
            <header style={{
                padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)', background: 'var(--base)'
            }}>
                <Link href="/connect" className="icon-btn focus-ring">
                    <ArrowLeft aria-hidden="true" />
                </Link>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--clay)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Settings
                    </div>
                </div>
                <div style={{ width: 42 }} />
            </header>

            <div className="container" style={{ flex: 1, padding: 24, overflowY: 'auto' }}>

                {/* Profile Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--stone)',
                        border: '1px solid var(--border-subtle)'
                    }}>
                        <User size={32} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--sand)', marginBottom: 4 }}>Guest User</h2>
                        <div style={{ fontSize: 14, color: 'var(--stone)' }}>Free Plan</div>
                    </div>
                </div>

                {/* Premium Banner */}
                <Link href="/settings/subscription" className="pressable focus-ring" style={{
                    display: 'block', padding: 20, borderRadius: 20, marginBottom: 32,
                    background: 'linear-gradient(135deg, var(--clay) 0%, #a05a3f 100%)', textDecoration: 'none',
                    boxShadow: '0 10px 30px -10px rgba(224, 159, 125, 0.4)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Upgrade to Closer+</div>
                        <Star size={18} fill="white" color="white" />
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
                        Unlock custom decks, unlimited gifts, and advanced relationship insights.
                    </div>
                </Link>

                {/* Settings List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                    <SettingsItem icon={<User size={18} />} label="Edit Profile" />
                    <SettingsItem icon={<Bell size={18} />} label="Notifications" />
                    <SettingsItem icon={<Shield size={18} />} label="Privacy & Security" />

                    <div style={{ height: 1, background: 'var(--border-subtle)', margin: '8px 0' }} />

                    <SettingsItem icon={<HelpCircle size={18} />} label="Help & Support" />

                    <button className="pressable focus-ring" style={{
                        width: '100%', padding: 16, borderRadius: 16,
                        display: 'flex', alignItems: 'center', gap: 16,
                        background: 'rgba(255,59,48,0.1)', color: '#ff3b30',
                        fontSize: 16, border: 'none', cursor: 'pointer', marginTop: 12
                    }}>
                        <LogOut size={18} />
                        <span style={{ fontWeight: 600 }}>Log Out</span>
                    </button>

                </div>

                <div style={{ textAlign: 'center', marginTop: 48, marginBottom: 24 }}>
                    <div style={{ fontSize: 13, color: 'var(--stone)', opacity: 0.5 }}>Closer v1.0.0</div>
                </div>

            </div>
        </main>
    );
}

function SettingsItem({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <button className="glass pressable focus-ring" style={{
            width: '100%', padding: 16, borderRadius: 16,
            display: 'flex', alignItems: 'center',
            border: '1px solid var(--border-subtle)',
            background: 'rgba(255,255,255,0.03)',
            cursor: 'pointer', color: 'var(--sand)'
        }}>
            <div style={{ color: 'var(--stone)', marginRight: 16 }}>{icon}</div>
            <span style={{ flex: 1, textAlign: 'left', fontSize: 16, fontWeight: 500 }}>{label}</span>
            <ChevronRight size={18} color="var(--stone)" />
        </button>
    );
}
