import React from 'react';
import { AlertCircle, WifiOff, RefreshCw, ServerCrash, FileQuestion, ShieldX } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  errorType?: 'generic' | 'network' | 'notFound' | 'server' | 'permission';
  onRetry?: () => void;
  retryLabel?: string;
  showIcon?: boolean;
}

const errorConfig = {
  generic: {
    icon: AlertCircle,
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again.',
    color: 'text-red-400 bg-red-500/10 border border-red-500/20',
  },
  network: {
    icon: WifiOff,
    title: 'Connection lost',
    description: 'Please check your internet connection and try again.',
    color: 'text-text-muted bg-dark-surface border border-dark-border',
  },
  notFound: {
    icon: FileQuestion,
    title: 'Not found',
    description: "We couldn't find what you're looking for.",
    color: 'text-sage bg-sage-subtle border border-sage-border',
  },
  server: {
    icon: ServerCrash,
    title: 'Server error',
    description: "We're having trouble connecting to our servers. Please try again later.",
    color: 'text-amber-400 bg-amber-500/10 border border-amber-500/20',
  },
  permission: {
    icon: ShieldX,
    title: 'Access denied',
    description: "You don't have permission to access this content.",
    color: 'text-red-400 bg-red-500/10 border border-red-500/20',
  },
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  errorType = 'generic',
  onRetry,
  retryLabel = 'Try Again',
  showIcon = true,
}) => {
  const config = errorConfig[errorType];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-8 animate-fade-up">
      {showIcon && (
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${config.color}`}>
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-xl font-serif font-semibold text-text-primary mb-2">
        {title || config.title}
      </h3>
      <p className="text-text-secondary max-w-sm mb-6">
        {description || config.description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-dark-surface border border-dark-border text-text-primary rounded-2xl font-medium hover:bg-dark-hover hover:border-sage-border transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          {retryLabel}
        </button>
      )}
    </div>
  );
};

// Inline error message
export const InlineError: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center gap-2 text-red-400 text-sm mt-1">
    <AlertCircle className="w-4 h-4 flex-shrink-0" />
    <span>{message}</span>
  </div>
);

// Form field error
export const FieldError: React.FC<{ error?: string }> = ({ error }) => {
  if (!error) return null;
  return <InlineError message={error} />;
};

// Error boundary fallback
export const ErrorBoundaryFallback: React.FC<{ error?: Error; resetError?: () => void }> = ({
  error,
  resetError,
}) => (
  <div className="min-h-[400px] flex items-center justify-center p-8">
    <ErrorState
      title="Something unexpected happened"
      description={error?.message || "We've encountered an error. Please refresh the page or try again."}
      errorType="generic"
      onRetry={resetError}
      retryLabel="Refresh Page"
    />
  </div>
);

// Network error banner
export const NetworkErrorBanner: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <div className="bg-dark-surface border-b border-dark-border text-text-primary px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <WifiOff className="w-5 h-5 text-text-muted" />
      <span className="text-sm text-text-secondary">You appear to be offline</span>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-sm text-sage hover:text-sage-light transition-colors"
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
