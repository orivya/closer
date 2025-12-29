'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ENGINEER_NAV, CLIENT_NAV } from '@/lib/constants';

export const DashboardMobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'engineer' | 'client'>('engineer');
    const pathname = usePathname();

    const navItems = mode === 'engineer' ? ENGINEER_NAV : CLIENT_NAV;

    // Handle Escape key to close menu
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <div className="md:hidden">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-[var(--text-muted)] hover:text-white transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]"
                aria-label="Open navigation menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
            >
                <Menu className="w-6 h-6" aria-hidden="true" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Drawer */}
            <div
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className={cn(
                    "fixed inset-y-0 left-0 w-72 bg-[var(--bg-base)] border-r border-[var(--border-dark)] z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-[var(--border-dark)]">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)] p-1 -m-1"
                        onClick={() => setIsOpen(false)}
                        aria-label="MixExperts home"
                    >
                        <div className="w-8 h-8 bg-white text-[var(--bg-base)] rounded-xl flex items-center justify-center font-bold text-lg" aria-hidden="true">
                            M
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">MixExperts</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-[var(--text-muted)] hover:text-white transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]"
                        aria-label="Close navigation menu"
                    >
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Mode Switcher */}
                <div className="px-6 py-4" role="radiogroup" aria-label="Dashboard view mode">
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

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto" aria-label="Dashboard navigation">
                    <div className="px-2 mb-4 mt-2">
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
                                onClick={() => setIsOpen(false)}
                                aria-current={isActive ? 'page' : undefined}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]",
                                    isActive
                                        ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                                        : "text-[var(--text-gray)] hover:text-white hover:bg-[var(--bg-hover)]"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5",
                                    isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)]"
                                )} aria-hidden="true" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--border-dark)]">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-[var(--bg-card)]">
                        <div className="w-9 h-9 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-dark)] flex items-center justify-center">
                            <span className="text-xs font-bold text-white">JM</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">James Mix</p>
                            <p className="text-xs text-[var(--text-muted)] truncate">Pro Member</p>
                        </div>
                        <LogOut className="w-4 h-4 text-[var(--text-muted)]" />
                    </div>
                </div>
            </div>
        </div>
    );
};
