import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'sage' | 'clay' | 'stone' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const variantClasses = {
  default: 'bg-dark-surface text-text-primary border border-dark-border',
  sage: 'bg-sage-subtle text-sage border border-sage-border',
  clay: 'bg-clay/10 text-clay border border-clay/20',
  stone: 'bg-dark-hover text-text-secondary border border-dark-border',
  success: 'bg-green-500/10 text-green-400 border border-green-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  error: 'bg-red-500/10 text-red-400 border border-red-500/20',
  outline: 'bg-transparent border border-dark-border text-text-secondary',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-sm',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  removable = false,
  onRemove,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove"
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 3l6 6M9 3l-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

// Mood badge with emoji
interface MoodBadgeProps {
  mood: 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'grateful' | 'excited' | 'tired';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const moodConfig = {
  happy: { emoji: '😊', label: 'Happy', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  calm: { emoji: '😌', label: 'Calm', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  neutral: { emoji: '😐', label: 'Neutral', color: 'bg-dark-surface text-text-secondary border border-dark-border' },
  sad: { emoji: '😢', label: 'Sad', color: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' },
  anxious: { emoji: '😰', label: 'Anxious', color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
  grateful: { emoji: '🙏', label: 'Grateful', color: 'bg-sage-subtle text-sage border border-sage-border' },
  excited: { emoji: '🎉', label: 'Excited', color: 'bg-clay/10 text-clay border border-clay/20' },
  tired: { emoji: '😴', label: 'Tired', color: 'bg-dark-hover text-text-muted border border-dark-border' },
};

export const MoodBadge: React.FC<MoodBadgeProps> = ({ mood, showLabel = true, size = 'md' }) => {
  const config = moodConfig[mood];
  const sizeClass = sizeClasses[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${config.color} ${sizeClass}`}>
      <span>{config.emoji}</span>
      {showLabel && <span className="font-medium">{config.label}</span>}
    </span>
  );
};

// Status badge
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed';
  size?: 'sm' | 'md';
}

const statusConfig = {
  active: { label: 'Active', color: 'bg-green-500/10 text-green-400 border border-green-500/20', dot: 'bg-green-400 shadow-glow' },
  inactive: { label: 'Inactive', color: 'bg-dark-surface text-text-muted border border-dark-border', dot: 'bg-text-muted' },
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', dot: 'bg-amber-400' },
  completed: { label: 'Completed', color: 'bg-sage-subtle text-sage border border-sage-border', dot: 'bg-sage shadow-glow' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.color} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

// Streak badge with flame
interface StreakBadgeProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ count, size = 'md' }) => {
  const isHot = count >= 7;

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-semibold border
        ${isHot ? 'bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-400 border-orange-500/20' : 'bg-clay/10 text-clay border-clay/20'}
        ${sizeClasses[size]}
      `}
    >
      <span className={isHot ? 'animate-pulse' : ''}>🔥</span>
      <span>{count} day{count !== 1 ? 's' : ''}</span>
    </span>
  );
};

export default Badge;
