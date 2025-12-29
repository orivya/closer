'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, ArrowRight, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);

    const handleResend = async () => {
        if (!email) return;

        setIsResending(true);
        await supabase.auth.resend({
            type: 'signup',
            email,
        });
        setIsResending(false);
        setResendSuccess(true);

        // Reset success state after 5 seconds
        setTimeout(() => setResendSuccess(false), 5000);
    };

    return (
        <main className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md text-center"
            >
                <div className="w-20 h-20 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Mail className="w-10 h-10" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">Check your inbox</h1>
                <p className="text-lg text-[var(--text-gray)] mb-2 leading-relaxed">
                    We&apos;ve sent a verification link to
                </p>
                {email && (
                    <p className="text-white font-medium mb-6">{email}</p>
                )}
                <p className="text-[var(--text-gray)] mb-8">
                    Please click the link to activate your account.
                </p>

                <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6 mb-8">
                    <p className="text-sm text-[var(--text-muted)] mb-4">Didn&apos;t receive the email?</p>
                    <button
                        onClick={handleResend}
                        disabled={isResending || !email}
                        className="inline-flex items-center gap-2 text-white text-sm font-bold hover:text-[var(--accent)] underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isResending ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Sending...
                            </>
                        ) : resendSuccess ? (
                            'Email sent! Check your inbox'
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4" />
                                Click here to resend
                            </>
                        )}
                    </button>
                </div>

                <Link href="/login" className="inline-flex items-center text-[var(--text-gray)] hover:text-white transition-colors gap-2">
                    <ArrowRight className="w-4 h-4 rotate-180" /> Back to Login
                </Link>
            </motion.div>
        </main>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--accent)]"></div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
