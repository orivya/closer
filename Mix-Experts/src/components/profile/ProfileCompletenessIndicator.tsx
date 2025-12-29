'use client';

import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCompletenessIndicatorProps {
  hasAvatar: boolean;
  hasBanner: boolean;
  hasBio: boolean;
  hasTagline: boolean;
  hasSocialLinks: boolean;
  hasPortfolioItems: boolean;
}

export function ProfileCompletenessIndicator({
  hasAvatar,
  hasBanner,
  hasBio,
  hasTagline,
  hasSocialLinks,
  hasPortfolioItems,
}: ProfileCompletenessIndicatorProps) {
  const items = [
    { label: 'Profile Photo', completed: hasAvatar },
    { label: 'Banner Image', completed: hasBanner },
    { label: 'Bio', completed: hasBio },
    { label: 'Tagline', completed: hasTagline },
    { label: 'Social Links', completed: hasSocialLinks },
    { label: 'Portfolio Items', completed: hasPortfolioItems },
  ];

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  const isComplete = percentage === 100;

  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Profile Completeness</h3>
        <span
          className={cn(
            'text-2xl font-bold',
            percentage === 100
              ? 'text-green-400'
              : percentage >= 50
              ? 'text-yellow-400'
              : 'text-red-400'
          )}
        >
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-[var(--bg-card)] rounded-full overflow-hidden mb-6">
        <div
          className={cn(
            'h-full transition-all duration-500',
            percentage === 100
              ? 'bg-green-500'
              : percentage >= 50
              ? 'bg-yellow-500'
              : 'bg-red-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {item.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
            )}
            <span
              className={cn(
                'text-sm',
                item.completed ? 'text-white font-medium' : 'text-[var(--text-muted)]'
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {isComplete && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
          <p className="text-sm text-green-400 font-medium text-center">
            Your profile is complete!
          </p>
        </div>
      )}
    </div>
  );
}
