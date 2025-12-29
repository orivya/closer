import React from 'react';
import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';

export const metadata = {
    title: 'Sign Up — MixExperts',
    description: 'Join the platform for elite audio engineers and artists.',
};

export default function SignupPage() {
    return (
        <main className="min-h-screen w-full bg-[var(--bg-base)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[var(--accent)] opacity-[0.04] blur-[150px] rounded-full mix-blend-screen animate-pulse duration-[5000ms]"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-900 opacity-[0.05] blur-[150px] rounded-full mix-blend-screen"></div>
            </div>

            {/* Top Navigation / Brand */}
            <div className="absolute top-8 left-0 w-full px-8 z-20">
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-white text-[var(--bg-base)] rounded-full flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                        M
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white group-hover:text-[var(--accent)] transition-colors">MixExperts</span>
                </Link>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full py-20">
                <SignupForm />
            </div>

            {/* Footer Copyright */}
            <div className="absolute bottom-6 w-full text-center z-10">
                <p className="text-xs text-[var(--text-muted)]">
                    By joining, you agree to our Terms of Service.
                </p>
            </div>
        </main>
    );
}
