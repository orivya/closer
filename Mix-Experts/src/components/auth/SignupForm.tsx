'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Music2, Mic2, ArrowRight, Loader2, User, AtSign, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

type Role = 'artist' | 'engineer';

interface FormErrors {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    terms?: string;
    general?: string;
}

export const SignupForm: React.FC = () => {
    const [role, setRole] = useState<Role>('artist');
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

    const { signUp } = useAuth();
    const router = useRouter();

    // Debounced username availability check
    const checkUsername = useCallback(async (usernameToCheck: string) => {
        if (usernameToCheck.length < 3) {
            setUsernameStatus('idle');
            return;
        }

        setUsernameStatus('checking');

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('username', usernameToCheck.toLowerCase())
                .maybeSingle();

            if (error) {
                console.error('Error checking username:', error);
                setUsernameStatus('idle');
                return;
            }

            setUsernameStatus(data ? 'taken' : 'available');
        } catch {
            setUsernameStatus('idle');
        }
    }, []);

    // Debounce username check
    useEffect(() => {
        if (username.length < 3) {
            setUsernameStatus('idle');
            return;
        }

        const timer = setTimeout(() => {
            checkUsername(username);
        }, 500);

        return () => clearTimeout(timer);
    }, [username, checkUsername]);

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        } else if (!/^[a-z0-9_-]+$/.test(username)) {
            newErrors.username = 'Username can only contain lowercase letters, numbers, underscores, and hyphens';
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (username.length > 30) {
            newErrors.username = 'Username must be 30 characters or less';
        } else if (usernameStatus === 'taken') {
            newErrors.username = 'This username is already taken';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and a number';
        }

        if (!termsAccepted) {
            newErrors.terms = 'You must accept the Terms of Service';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        const { error } = await signUp({
            email,
            password,
            fullName: name,
            username: username.toLowerCase(),
            role,
        });

        if (error) {
            setIsLoading(false);
            if (error.message.includes('already registered')) {
                setErrors({ general: 'An account with this email already exists.' });
            } else {
                setErrors({ general: error.message });
            }
            return;
        }

        // Success - redirect to verify email page
        router.push('/verify-email?email=' + encodeURIComponent(email));
    };

    const handleUsernameChange = (value: string) => {
        // Auto-convert to lowercase and remove spaces
        const sanitized = value.toLowerCase().replace(/\s/g, '');
        setUsername(sanitized);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* The Monolith Card */}
            <div className="relative bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-3xl p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-500">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">Create Access ID</h1>
                    <p className="text-[var(--text-gray)]">Join the platform redefining audio engineering.</p>
                </div>

                {/* General Error */}
                {errors.general && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-400">{errors.general}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Role Selection Cards */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setRole('artist')}
                            className={cn(
                                "relative p-6 rounded-2xl border text-left transition-all duration-300 group overflow-hidden",
                                role === 'artist'
                                    ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-[0_0_20px_var(--accent-glow)]"
                                    : "bg-[var(--bg-card)] border-[var(--border-dark)] hover:bg-[var(--bg-hover)]"
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn(
                                    "p-3 rounded-full transition-colors",
                                    role === 'artist' ? "bg-white/20" : "bg-[var(--bg-base)] text-[var(--text-muted)] group-hover:text-white"
                                )}>
                                    <Music2 className="w-6 h-6" />
                                </div>
                                {role === 'artist' && (
                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
                                )}
                            </div>
                            <h3 className={cn("text-lg font-bold mb-1 transition-colors", role === 'artist' ? "text-white" : "text-white")}>
                                I&apos;m an Artist
                            </h3>
                            <p className={cn("text-sm leading-relaxed transition-colors", role === 'artist' ? "text-white/80" : "text-[var(--text-gray)]")}>
                                I need mixing, mastering, or production for my tracks.
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole('engineer')}
                            className={cn(
                                "relative p-6 rounded-2xl border text-left transition-all duration-300 group overflow-hidden",
                                role === 'engineer'
                                    ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-[0_0_20px_var(--accent-glow)]"
                                    : "bg-[var(--bg-card)] border-[var(--border-dark)] hover:bg-[var(--bg-hover)]"
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={cn(
                                    "p-3 rounded-full transition-colors",
                                    role === 'engineer' ? "bg-white/20" : "bg-[var(--bg-base)] text-[var(--text-muted)] group-hover:text-white"
                                )}>
                                    <Mic2 className="w-6 h-6" />
                                </div>
                                {role === 'engineer' && (
                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
                                )}
                            </div>
                            <h3 className={cn("text-lg font-bold mb-1 transition-colors", role === 'engineer' ? "text-white" : "text-white")}>
                                I&apos;m an Engineer
                            </h3>
                            <p className={cn("text-sm leading-relaxed transition-colors", role === 'engineer' ? "text-white/80" : "text-[var(--text-gray)]")}>
                                I want to offer my services and find new clients.
                            </p>
                        </button>
                    </div>

                    {/* Common Fields */}
                    <div className="space-y-5">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="James Mix"
                                    className={cn(
                                        "w-full pl-11 pr-4 py-3.5 bg-[var(--bg-base)] border rounded-xl text-white placeholder-[var(--text-faint)] focus:outline-none focus:ring-1 transition-all duration-300",
                                        errors.name
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                            : "border-[var(--border-dark)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                                    )}
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-400 ml-1">{errors.name}</p>}
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors">
                                    <AtSign className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => handleUsernameChange(e.target.value)}
                                    placeholder="jamesmix"
                                    className={cn(
                                        "w-full pl-11 pr-12 py-3.5 bg-[var(--bg-base)] border rounded-xl text-white placeholder-[var(--text-faint)] focus:outline-none focus:ring-1 transition-all duration-300",
                                        errors.username || usernameStatus === 'taken'
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                            : usernameStatus === 'available'
                                                ? "border-green-500 focus:border-green-500 focus:ring-green-500"
                                                : "border-[var(--border-dark)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                                    )}
                                />
                                {/* Username status indicator */}
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                                    {usernameStatus === 'checking' && (
                                        <Loader2 className="w-4 h-4 animate-spin text-[var(--text-muted)]" />
                                    )}
                                    {usernameStatus === 'available' && (
                                        <Check className="w-4 h-4 text-green-500" />
                                    )}
                                    {usernameStatus === 'taken' && (
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                    )}
                                </div>
                            </div>
                            {username && !errors.username && usernameStatus === 'available' && (
                                <p className="text-xs text-green-400 ml-1">Your profile: mixexperts.com/{username}</p>
                            )}
                            {usernameStatus === 'taken' && (
                                <p className="text-xs text-red-400 ml-1">This username is already taken</p>
                            )}
                            {errors.username && <p className="text-xs text-red-400 ml-1">{errors.username}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
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

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider ml-1">Create Password</label>
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
                            {!errors.password && password && (
                                <p className="text-xs text-[var(--text-muted)] ml-1">Min 8 chars with uppercase, lowercase, and number</p>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Role-Specific Fields */}
                    <AnimatePresence mode="wait">
                        {role === 'artist' ? (
                            <motion.div
                                key="artist-fields"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-5 overflow-hidden"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider ml-1">Primary Genre</label>
                                    <select className="w-full px-4 py-3.5 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all duration-300 appearance-none">
                                        <option value="" disabled selected>Select your style...</option>
                                        <option value="hip-hop">Hip Hop / Rap</option>
                                        <option value="pop">Pop</option>
                                        <option value="rock">Rock / Metal</option>
                                        <option value="electronic">Electronic / Dance</option>
                                        <option value="rnb">R&B</option>
                                    </select>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="engineer-fields"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-5 overflow-hidden"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider ml-1">Years of Experience</label>
                                    <select className="w-full px-4 py-3.5 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all duration-300 appearance-none">
                                        <option value="" disabled selected>Select level...</option>
                                        <option value="1-3">1-3 Years (Junior)</option>
                                        <option value="3-7">3-7 Years (Mid)</option>
                                        <option value="7+">7+ Years (Senior)</option>
                                        <option value="studio">Studio Owner</option>
                                    </select>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Terms Checkbox */}
                    <div className="space-y-2">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className={cn(
                                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                                    termsAccepted
                                        ? "bg-[var(--accent)] border-[var(--accent)]"
                                        : errors.terms
                                            ? "border-red-500"
                                            : "border-[var(--border-dark)] group-hover:border-[var(--text-gray)]"
                                )}>
                                    {termsAccepted && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                            <span className="text-sm text-[var(--text-gray)]">
                                I agree to the{' '}
                                <Link href="/terms" className="text-white underline hover:text-[var(--accent)]">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-white underline hover:text-[var(--accent)]">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>
                        {errors.terms && <p className="text-xs text-red-400 ml-8">{errors.terms}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={isLoading || usernameStatus === 'checking'}
                        className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent-light)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_20px_var(--accent-glow)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Initialize Account
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Footer Text */}
            <p className="text-center text-[var(--text-gray)] mt-8 text-sm">
                Already have access?{' '}
                <Link href="/login" className="text-white font-bold hover:text-[var(--accent)] transition-colors underline decoration-[var(--accent)] decoration-2 underline-offset-4">
                    Return to Login
                </Link>
            </p>
        </div>
    );
};
