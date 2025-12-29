'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ENGINEER_NAV, CLIENT_NAV } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';

export const Sidebar: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { profile, signOut, loading } = useAuth();
    const [mode, setMode] = React.useState<'engineer' | 'client'>('engineer');

    // Get user display name and initials from profile
    const displayName = profile?.display_name || 'User';
    const initials = displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';

    const navItems = mode === 'engineer' ? ENGINEER_NAV : CLIENT_NAV;

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <aside className="hidden md:flex flex-col w-64 h-full bg-[var(--bg-base)] border-r border-[var(--border-dark)] relative z-30">
            {/* Brand Logo */}
            <div className="p-6">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-3 group rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)] p-1 -m-1"
                    aria-label="MixExperts home"
                >
                    <div className="w-8 h-8 bg-white text-[var(--bg-base)] rounded-xl flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-300" aria-hidden="true">
                        M
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white group-hover:text-[var(--accent)] transition-colors">MixExperts</span>
                </Link>
            </div>

            {/* Mode Switcher */}
            <div className="px-4 mb-2" role="radiogroup" aria-label="Dashboard view mode">
                <div className="p-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-dark)] flex">
                    <button
                        onClick={() => setMode('engineer')}
                        role="radio"
                        aria-checked={mode === 'engineer'}
                        aria-label="Switch to seller dashboard view"
                        className={cn(
                            "flex-1 py-1.5 text-xs font-bold rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-[var(--bg-card)]",
                            mode === 'engineer' ? "bg-[var(--accent)] text-white shadow-lg" : "text-[var(--text-gray)] hover:text-white"
                        )}
                    >
                        Seller
                    </button>
                    <button
                        onClick={() => setMode('client')}
                        role="radio"
                        aria-checked={mode === 'client'}
                        aria-label="Switch to buyer dashboard view"
                        className={cn(
                            "flex-1 py-1.5 text-xs font-bold rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-[var(--bg-card)]",
                            mode === 'client' ? "bg-blue-500 text-white shadow-lg" : "text-[var(--text-gray)] hover:text-white"
                        )}
                    >
                        Buyer
                    </button>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-1 py-6" aria-label="Dashboard navigation">
                <div className="px-2 mb-4">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        {mode === 'engineer' ? 'Studio Workspace' : 'Client Area'}
                    </span>
                </div>

                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]",
                                isActive
                                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                                    : "text-[var(--text-gray)] hover:text-white hover:bg-[var(--bg-hover)]"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)] group-hover:text-white"
                            )} aria-hidden="true" />
                            {item.name}
                        </Link>
                    );
                })}


                {/* Footer / User Profile */}
                <div className="mt-auto p-4 border-t border-[var(--border-dark)]">
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--bg-hover)] transition-colors group">
                        <div className="w-9 h-9 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-dark)] overflow-hidden">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={`${displayName} avatar`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-[var(--bg-card)] to-[var(--bg-elevated)] flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">{initials}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{displayName}</p>
                            <p className="text-xs text-[var(--text-muted)] truncate">
                                {mode === 'engineer' ? 'Pro Member' : 'Client Account'}
                            </p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="p-1 rounded hover:bg-[var(--bg-card)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-1 focus:ring-offset-[var(--bg-hover)]"
                            aria-label="Log out of your account"
                            title="Log out"
                        >
                            <LogOut className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white transition-colors" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </nav>
        </aside>
    );
};
