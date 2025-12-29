'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Mail, Download, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId || !orderId) {
        setError('Missing session or order information');
        setLoading(false);
        return;
      }

      try {
        // Fetch order details
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch order');
        }

        setOrder(data.order);
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError(err instanceof Error ? err.message : 'Failed to verify payment');
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [sessionId, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-muted)]">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[var(--bg-card)] border border-red-500/20 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <div className="text-3xl">❌</div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment Error</h1>
          <p className="text-[var(--text-muted)] mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all"
          >
            Return Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-8 mb-6">
          {/* Success Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-lg text-[var(--text-muted)]">
              Your booking has been confirmed
            </p>
          </div>

          {/* Order Details */}
          {order && (
            <div className="space-y-4 mb-8">
              <div className="bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[var(--text-muted)]">Order Number</span>
                  <span className="font-mono font-bold text-[var(--accent)]">{order.order_number}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-[var(--text-muted)]">Total Paid</span>
                  <span className="font-bold text-white text-lg">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-muted)]">Client Email</span>
                  <span className="text-sm text-white">{order.client_email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              What Happens Next?
            </h3>
            <ul className="space-y-3 text-sm text-[var(--text-muted)]">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">1.</span>
                <span>You'll receive a confirmation email at <span className="text-white">{order?.client_email}</span></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">2.</span>
                <span>The engineer will be notified and will start working on your project</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">3.</span>
                <span>You'll receive updates via email as your project progresses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">4.</span>
                <span>Once complete, you'll be notified to download your files</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all"
            >
              Return Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="text-center text-sm text-[var(--text-muted)]">
          <p>
            Need help? Contact support at{' '}
            <a href="mailto:support@mixexperts.com" className="text-[var(--accent)] hover:underline">
              support@mixexperts.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
