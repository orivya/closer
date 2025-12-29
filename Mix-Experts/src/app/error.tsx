'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Application Error:', error);
        }
    }, [error]);

    return (
        <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                {/* Background Atmosphere */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full" />

                {/* Error Icon */}
                <div className="relative z-10 mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-red-400" />
                    </div>
                </div>

                {/* Error Message */}
                <div className="relative z-10 space-y-4 mb-8">
                    <h1 className="text-3xl font-bold text-white">Something went wrong</h1>
                    <p className="text-[var(--text-gray)] leading-relaxed">
                        We encountered an unexpected error. This has been logged and we'll look into it.
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
                <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent-light)] transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
