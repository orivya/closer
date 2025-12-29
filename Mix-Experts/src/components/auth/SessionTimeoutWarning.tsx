'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, X } from 'lucide-react';

export function SessionTimeoutWarning() {
  const { showTimeoutWarning, dismissTimeoutWarning } = useAuth();

  if (!showTimeoutWarning) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-in slide-in-from-top-5 duration-300">
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-yellow-500 mb-1">
              Session Timeout Warning
            </h3>
            <p className="text-sm text-yellow-500/80 mb-3">
              Your session will expire in 5 minutes due to inactivity. Click anywhere to stay signed in.
            </p>
            <button
              onClick={dismissTimeoutWarning}
              className="text-xs font-medium text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              I'm still here
            </button>
          </div>
          <button
            onClick={dismissTimeoutWarning}
            className="text-yellow-500/60 hover:text-yellow-500 transition-colors"
            aria-label="Dismiss warning"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
