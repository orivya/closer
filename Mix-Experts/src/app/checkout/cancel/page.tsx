'use client';

import React from 'react';
import { XCircle, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Cancel Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-8 mb-6">
          {/* Cancel Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-orange-500" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Checkout Cancelled</h1>
            <p className="text-lg text-[var(--text-muted)]">
              Your payment was not processed
            </p>
          </div>

          {/* Message */}
          <div className="bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl p-4 mb-8">
            <p className="text-sm text-[var(--text-gray)] text-center">
              No charges were made to your account. You can try booking again whenever you're ready.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--bg-elevated)] text-[var(--text-muted)] font-bold rounded-xl hover:bg-[var(--bg-card)] hover:text-white transition-all"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="text-center text-sm text-[var(--text-muted)]">
          <p>
            Need help?{' '}
            <a href="mailto:support@mixexperts.com" className="text-[var(--accent)] hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
