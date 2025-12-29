'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface AriaLiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  className?: string;
}

/**
 * Accessible live region for announcements to screen readers
 * Use 'polite' for non-critical updates (loading states)
 * Use 'assertive' for critical updates (errors)
 */
export function AriaLiveRegion({ message, priority = 'polite', className = '' }: AriaLiveRegionProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className={className || 'sr-only'}
    >
      {message}
    </div>
  );
}

interface LoadingStateProps {
  message?: string;
  showSpinner?: boolean;
  className?: string;
}

/**
 * Accessible loading state component with aria-live region
 */
export function LoadingState({
  message = 'Loading...',
  showSpinner = true,
  className = ''
}: LoadingStateProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showSpinner && (
        <Loader2 className="w-5 h-5 text-[var(--accent)] animate-spin" aria-hidden="true" />
      )}
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-[var(--text-muted)]"
      >
        {message}
      </span>
    </div>
  );
}

interface ErrorMessageProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

/**
 * Accessible error message component with aria-live region
 */
export function ErrorMessage({ message, className = '', onDismiss }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={`p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-base)] rounded"
            aria-label="Dismiss error message"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

interface SuccessMessageProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

/**
 * Accessible success message component with aria-live region
 */
export function SuccessMessage({ message, className = '', onDismiss }: SuccessMessageProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-green-400 hover:text-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-base)] rounded"
            aria-label="Dismiss success message"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
