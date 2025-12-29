import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata = {
    title: 'Login — MixExperts',
    description: 'Access your studio dashboard.',
};

export default function LoginPage() {
    return (
        <main className="min-h-screen w-full bg-[var(--bg-base)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full mix-blend-screen animate-pulse duration-[4000ms]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900 opacity-[0.05] blur-[120px] rounded-full mix-blend-screen"></div>
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
            <div className="relative z-10 w-full">
                <LoginForm />
            </div>

            {/* Footer Copyright */}
            <div className="absolute bottom-6 w-full text-center z-10">
                <p className="text-xs text-[var(--text-muted)]">
                    © {new Date().getFullYear()} MixExperts Platform. Secure Connection.
                </p>
            </div>
        </main>
    );
}
