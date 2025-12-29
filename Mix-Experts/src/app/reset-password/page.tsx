'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, CheckCircle2, AlertCircle, XCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'expired'>('idle');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({});
    const [isValidSession, setIsValidSession] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const { updatePassword } = useAuth();
    const router = useRouter();

    // Check if user has a valid recovery session
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            // Check if there's a recovery session (user came from password reset email)
            if (session) {
                setIsValidSession(true);
            } else {
                // No session - check if we have a hash fragment (Supabase recovery flow)
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const type = hashParams.get('type');

                if (accessToken && type === 'recovery') {
                    // Set the session from the recovery token
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: hashParams.get('refresh_token') || '',
                    });

                    if (!error) {
                        setIsValidSession(true);
                    } else {
                        setStatus('expired');
                    }
                } else {
                    setStatus('expired');
                }
            }
            setIsChecking(false);
        };

        checkSession();
    }, []);

    const validateForm = () => {
        const newErrors: { password?: string; confirmPassword?: string } = {};

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
            newErrors.password = 'Must contain uppercase, lowercase, and a number';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setStatus('loading');
        setErrors({});

        const { error } = await updatePassword(password);

        if (error) {
            setStatus('error');
            setErrors({ general: error.message });
            return;
        }

        setStatus('success');

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            router.push('/dashboard');
        }, 2000);
    };

    if (isChecking) {
        return (
            <main className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[var(--accent)]/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-8">
                        <div className="flex items-center gap-2 justify-center">
                            <span className="text-xl font-bold tracking-tight text-white uppercase">Mix Experts</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mb-0.5" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                    <p className="text-[var(--text-gray)]">Enter your new secure password below.</p>
                </div>

                <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-8 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Password Updated!</h2>
                                <p className="text-[var(--text-gray)] mb-8">Your password has been successfully reset. Redirecting to dashboard...</p>
                                <Link href="/dashboard" className="block w-full py-4 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all text-center">
                                    Go to Dashboard
                                </Link>
                            </motion.div>
                        ) : status === 'expired' ? (
                            <motion.div
                                key="expired"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Link Expired</h2>
                                <p className="text-[var(--text-gray)] mb-8">This password reset link has expired or is invalid. Please request a new one.</p>
                                <Link href="/forgot-password" className="block w-full py-4 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all text-center">
                                    Request New Link
                                </Link>
                            </motion.div>
                        ) : status === 'error' ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <XCircle className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Something Went Wrong</h2>
                                <p className="text-[var(--text-gray)] mb-8">
                                    {errors.general || "We couldn't reset your password. Please try again or contact support."}
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="w-full py-4 bg-[var(--bg-card)] text-white font-bold rounded-xl hover:bg-[var(--bg-base)] transition-all"
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        ) : isValidSession ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onSubmit={handleReset}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className={cn(
                                                "w-full bg-[var(--bg-card)] border rounded-xl pl-10 pr-4 py-4 text-white focus:outline-none transition-colors",
                                                errors.password
                                                    ? "border-red-500 focus:border-red-500"
                                                    : "border-[var(--border-dark)] focus:border-[var(--accent)]"
                                            )}
                                        />
                                    </div>
                                    {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                                    {!errors.password && password && (
                                        <p className="text-xs text-[var(--text-muted)] mt-1">Min 8 chars with uppercase, lowercase, and number</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className={cn(
                                                "w-full bg-[var(--bg-card)] border rounded-xl pl-10 pr-4 py-4 text-white focus:outline-none transition-colors",
                                                errors.confirmPassword
                                                    ? "border-red-500 focus:border-red-500"
                                                    : "border-[var(--border-dark)] focus:border-[var(--accent)]"
                                            )}
                                        />
                                    </div>
                                    {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full flex items-center justify-center py-4 bg-white text-black font-bold rounded-xl hover:bg-[var(--accent)] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    {status === 'loading' ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Reset Password <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </button>
                            </motion.form>
                        ) : null}
                    </AnimatePresence>
                </div>

                {/* Back to Login Link */}
                <p className="text-center mt-8">
                    <Link href="/login" className="inline-flex items-center gap-2 text-[var(--text-gray)] hover:text-white transition-colors group text-sm font-medium">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}
