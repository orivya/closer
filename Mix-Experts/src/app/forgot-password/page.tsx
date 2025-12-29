import React from 'react';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import Link from 'next/link';

export const metadata = {
    title: 'Recovery — MixExperts',
    description: 'Reset your password securely.',
};

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen w-full bg-[var(--bg-base)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-[var(--accent)] opacity-[0.03] blur-[100px] rounded-full mix-blend-screen animate-pulse duration-[6000ms]"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full">
                <ForgotPasswordForm />
            </div>

            {/* Footer Copyright */}
            <div className="absolute bottom-6 w-full text-center z-10">
                <p className="text-xs text-[var(--text-muted)]">
                    Protected by MixExperts Security.
                </p>
            </div>
        </main>
    );
}
