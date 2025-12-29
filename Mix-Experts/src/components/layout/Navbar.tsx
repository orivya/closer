'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[var(--bg-base)]/80 backdrop-blur-md h-20">
            <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 z-50">
                    <span className="text-xl font-bold tracking-tight text-white uppercase">Mix Experts</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mb-0.5"></div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/features" className="text-sm font-medium text-[var(--text-gray)] hover:text-white transition-colors">Features</Link>
                    <Link href="/examples" className="text-sm font-medium text-[var(--text-gray)] hover:text-white transition-colors">Examples</Link>
                    <Link href="/pricing" className="text-sm font-medium text-[var(--text-gray)] hover:text-white transition-colors">Pricing</Link>
                    <Link href="/blog" className="text-sm font-medium text-[var(--text-gray)] hover:text-white transition-colors">Blog</Link>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-white hover:text-[var(--accent)] transition-colors">Sign In</Link>
                    <Link href="/signup" className="px-5 py-2.5 bg-white text-[var(--bg-base)] text-sm font-bold rounded-full hover:bg-[var(--accent)] hover:text-white transition-all duration-300">
                        Get Started
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden z-50 text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 bg-[var(--bg-base)]/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 md:hidden">
                        <Link href="/features" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-white hover:text-[var(--accent)]">Features</Link>
                        <Link href="/examples" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-white hover:text-[var(--accent)]">Examples</Link>
                        <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-white hover:text-[var(--accent)]">Pricing</Link>
                        <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-bold text-white hover:text-[var(--accent)]">Blog</Link>

                        <div className="w-12 h-[1px] bg-white/10 my-4" />

                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-medium text-[var(--text-gray)]">Sign In</Link>
                        <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="px-8 py-4 bg-white text-[var(--bg-base)] font-bold rounded-full text-lg">
                            Get Started
                        </Link>
                    </div>
                )}

            </div>
        </nav>
    );
}
