import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'sage' | 'clay' | 'white' | 'stone';
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  sage: 'text-sage',
  clay: 'text-clay',
  white: 'text-white',
  stone: 'text-text-muted',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'sage',
  text,
  fullScreen = false,
}) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
      {text && (
        <p className={`text-sm ${color === 'white' ? 'text-white/80' : 'text-text-secondary'}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-base/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Page loading state with branded animation
export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-up">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-sage/20 border-t-sage animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage to-sage-light opacity-20 animate-pulse" />
      </div>
    </div>
    <p className="mt-6 text-text-secondary font-medium">{message}</p>
  </div>
);

// Inline loading indicator
export const InlineLoader: React.FC<{ text?: string }> = ({ text = 'Loading' }) => (
  <span className="inline-flex items-center gap-2 text-text-secondary">
    <Loader2 className="w-4 h-4 animate-spin" />
    <span className="text-sm">{text}</span>
  </span>
);

// Button loading state
export const ButtonLoader: React.FC = () => (
  <Loader2 className="w-4 h-4 animate-spin" />
);

export default LoadingSpinner;
