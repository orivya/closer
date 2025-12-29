'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Dashboard Error:', error);
        }
    }, [error]);

    return (
        <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-6">
            <div className="max-w-lg w-full">
                {/* Background Atmosphere */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full" />

                {/* Error Card */}
                <div className="relative z-10 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-8 text-center">
                    {/* Error Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>
                    </div>

                    {/* Error Message */}
                    <div className="space-y-4 mb-8">
                        <h1 className="text-2xl font-bold text-white">Dashboard Error</h1>
                        <p className="text-[var(--text-gray)] leading-relaxed">
                            We encountered an issue loading this dashboard page. Don't worry, your data is safe.
                        </p>
                        {process.env.NODE_ENV === 'development' && error.message && (
                            <div className="mt-6 p-4 bg-red-500/5 border border-red-500/20 rounded-xl text-left">
                                <p className="text-xs font-mono text-red-400 break-all">
                                    {error.message}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={reset}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent-light)] transition-all"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </button>
                        <Link
                            href="/dashboard"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard Home
                        </Link>
                    </div>
                </div>

                {/* Help Text */}
                <p className="relative z-10 text-center text-sm text-[var(--text-muted)] mt-6">
                    If this problem persists, please contact support
                </p>
            </div>
        </div>
    );
}
