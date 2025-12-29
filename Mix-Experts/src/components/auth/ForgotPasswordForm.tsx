'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, Loader2, CheckCircle2, ChevronLeft, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export const ForgotPasswordForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const { resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const { error } = await resetPassword(email);

        setIsLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        setIsSent(true);
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* The Monolith Card */}
            <div className="relative bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-3xl p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden">

                <AnimatePresence mode="wait">
                    {!isSent ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-[var(--accent)] mb-6 shadow-[0_0_15px_rgba(201,149,108,0.15)]">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Recovery</h1>
                                <p className="text-[var(--text-gray)] text-sm">Enter your email to receive a reset link.</p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="engineer@mixexperts.com"
                                            className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isLoading}
                                    className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent-light)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Send Reset Link
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Check your inbox</h2>
                            <p className="text-[var(--text-gray)] mb-8 max-w-[260px] mx-auto text-sm leading-relaxed">
                                We&apos;ve sent a secure recovery link to <span className="text-white font-medium">{email}</span>.
                            </p>

                            <button
                                onClick={() => setIsSent(false)}
                                className="text-sm text-[var(--text-muted)] hover:text-white underline decoration-dashed underline-offset-4 transition-colors"
                            >
                                Try a different email
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Text */}
            <p className="text-center mt-8">
                <Link href="/login" className="inline-flex items-center gap-2 text-[var(--text-gray)] hover:text-white transition-colors group text-sm font-medium">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>
            </p>
        </div>
    );
};
