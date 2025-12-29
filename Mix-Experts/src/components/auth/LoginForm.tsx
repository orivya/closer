'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorMessage, LoadingState } from '@/components/ui/AriaLive';

// Account lockout constants
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface LoginAttempt {
    count: number;
    lockedUntil?: number;
}

export const LoginForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);

    const { signIn } = useAuth();
    const router = useRouter();

    // Check lockout status on mount and when email changes
    useEffect(() => {
        if (email) {
            checkLockoutStatus(email);
        }
    }, [email]);

    // Update lockout timer
    useEffect(() => {
        if (lockoutTimeRemaining > 0) {
            const timer = setInterval(() => {
                const attempts = getLoginAttempts(email);
                if (attempts?.lockedUntil) {
                    const remaining = Math.max(0, attempts.lockedUntil - Date.now());
                    setLockoutTimeRemaining(remaining);

                    if (remaining === 0) {
                        setIsLocked(false);
                        // Clear the lockout from storage
                        clearLoginAttempts(email);
                    }
                } else {
                    setLockoutTimeRemaining(0);
                    setIsLocked(false);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [lockoutTimeRemaining, email]);

    /**
     * Get login attempts from localStorage
     */
    const getLoginAttempts = (email: string): LoginAttempt | null => {
        if (typeof window === 'undefined') return null;

        try {
            const key = `login_attempts_${email.toLowerCase()}`;
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    };

    /**
     * Set login attempts in localStorage
     */
    const setLoginAttempts = (email: string, attempts: LoginAttempt): void => {
        if (typeof window === 'undefined') return;

        try {
            const key = `login_attempts_${email.toLowerCase()}`;
            localStorage.setItem(key, JSON.stringify(attempts));
        } catch (error) {
            console.error('Failed to save login attempts:', error);
        }
    };

    /**
     * Clear login attempts from localStorage
     */
    const clearLoginAttempts = (email: string): void => {
        if (typeof window === 'undefined') return;

        try {
            const key = `login_attempts_${email.toLowerCase()}`;
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Failed to clear login attempts:', error);
        }
    };

    /**
     * Check if account is locked
     */
    const checkLockoutStatus = (email: string): boolean => {
        const attempts = getLoginAttempts(email);

        if (!attempts) return false;

        // Check if locked
        if (attempts.lockedUntil) {
            const now = Date.now();

            // Still locked
            if (attempts.lockedUntil > now) {
                setIsLocked(true);
                setLockoutTimeRemaining(attempts.lockedUntil - now);
                return true;
            } else {
                // Lock expired, clear it
                clearLoginAttempts(email);
                setIsLocked(false);
                setLockoutTimeRemaining(0);
                return false;
            }
        }

        return false;
    };

    /**
     * Record failed login attempt
     */
    const recordFailedAttempt = (email: string): void => {
        const attempts = getLoginAttempts(email) || { count: 0 };
        attempts.count += 1;

        // Lock account if max attempts reached
        if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
            attempts.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
            setIsLocked(true);
            setLockoutTimeRemaining(LOCKOUT_DURATION_MS);
        }

        setLoginAttempts(email, attempts);
    };

    /**
     * Format time remaining for display
     */
    const formatTimeRemaining = (ms: number): string => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Check if account is locked
        if (checkLockoutStatus(email)) {
            setErrors({
                general: `Too many failed attempts. Account locked for ${formatTimeRemaining(lockoutTimeRemaining)}.`
            });
            return;
        }

        setIsLoading(true);
        setErrors({});

        const { error } = await signIn(email, password);

        if (error) {
            setIsLoading(false);

            // Record failed attempt
            recordFailedAttempt(email);

            // Get updated attempt count
            const attempts = getLoginAttempts(email);
            const remainingAttempts = MAX_LOGIN_ATTEMPTS - (attempts?.count || 0);

            // Handle specific error messages
            if (error.message.includes('Invalid login credentials')) {
                if (remainingAttempts > 0) {
                    setErrors({
                        general: `Invalid email or password. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`
                    });
                } else {
                    setErrors({
                        general: `Too many failed attempts. Account locked for 15 minutes.`
                    });
                }
            } else if (error.message.includes('Email not confirmed')) {
                setErrors({ general: 'Please verify your email before signing in.' });
            } else {
                setErrors({ general: error.message });
            }
            return;
        }

        // Success - clear attempts and redirect to dashboard
        clearLoginAttempts(email);
        router.push('/dashboard');
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* The Monolith Card */}
            <div className="relative bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-3xl p-8 md:p-10 shadow-2xl animate-in zoom-in-95 duration-500">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-[var(--accent)] mb-6 shadow-[0_0_15px_rgba(201,149,108,0.15)]">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-[var(--text-gray)]">Enter your credentials to access the studio.</p>
                </div>

                {/* Lockout Warning */}
                {isLocked && (
                    <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                            <div>
                                <p className="text-sm font-semibold text-orange-400 mb-1">Account Temporarily Locked</p>
                                <p className="text-xs text-orange-300">
                                    Too many failed login attempts. Try again in {formatTimeRemaining(lockoutTimeRemaining)}.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* General Error */}
                {errors.general && !isLocked && (
                    <ErrorMessage message={errors.general} className="mb-6" />
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Access Key (Email) */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider ml-1">Access ID (Email)</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="engineer@mixexperts.com"
                                className={cn(
                                    "w-full pl-11 pr-4 py-3.5 bg-[var(--bg-base)] border rounded-xl text-white placeholder-[var(--text-faint)] focus:outline-none focus:ring-1 transition-all duration-300",
                                    errors.email
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-[var(--border-dark)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                                )}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email}</p>}
                    </div>

                    {/* Passcode (Password) */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Passcode</label>
                            <Link href="/forgot-password" className="text-xs text-[var(--text-gray)] hover:text-white transition-colors">
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className={cn(
                                    "w-full pl-11 pr-4 py-3.5 bg-[var(--bg-base)] border rounded-xl text-white placeholder-[var(--text-faint)] focus:outline-none focus:ring-1 transition-all duration-300",
                                    errors.password
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : "border-[var(--border-dark)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                                )}
                            />
                        </div>
                        {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={isLoading || isLocked}
                        className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent-light)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        aria-live="polite"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                                <span className="sr-only">Signing in...</span>
                            </>
                        ) : (
                            <>
                                Enter Studio
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </>
                        )}
                    </button>
                </form>

            </div>

            {/* Footer Text */}
            <p className="text-center text-[var(--text-gray)] mt-8 text-sm">
                New Engineer?{' '}
                <Link href="/signup" className="text-white font-bold hover:text-[var(--accent)] transition-colors underline decoration-[var(--accent)] decoration-2 underline-offset-4">
                    Apply for Access
                </Link>
            </p>
        </div>
    );
};
