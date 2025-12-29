'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'mixexperts_cookie_consent';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to prevent flash on page load
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      essential: true,
      analytics: true,
      marketing: false,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  const acceptEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-[var(--bg-card)] border-t border-[var(--border-dark)] shadow-2xl">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">Cookie Notice</h3>
            <p className="text-sm text-[var(--text-gray)]">
              We use cookies to enhance your experience, analyze site traffic, and for authentication.
              By clicking &quot;Accept All&quot;, you consent to our use of cookies.
              See our{' '}
              <Link href="/privacy" className="text-[var(--accent)] hover:underline">
                Privacy Policy
              </Link>{' '}
              for more information.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={acceptEssential}
              className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-[var(--text-gray)] bg-transparent border border-[var(--border-dark)] rounded-lg hover:bg-white/5 transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-white bg-[var(--accent)] rounded-lg hover:bg-[var(--accent-light)] transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={acceptEssential}
              className="p-2 text-[var(--text-gray)] hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
