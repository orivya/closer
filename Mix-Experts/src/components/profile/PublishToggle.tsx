'use client';

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { cn } from '@/lib/utils';

interface PublishToggleProps {
  isPublished: boolean;
}

export function PublishToggle({ isPublished }: PublishToggleProps) {
  const { updateProfile, updating } = useUpdateProfile();

  const handleToggle = async () => {
    await updateProfile({ is_published: !isPublished });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={updating}
      className={cn(
        'flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed',
        isPublished
          ? 'bg-green-500/10 border-2 border-green-500/30 text-green-400 hover:bg-green-500/20'
          : 'bg-[var(--bg-elevated)] border-2 border-[var(--border-dark)] text-[var(--text-gray)] hover:border-[var(--accent)]'
      )}
    >
      {isPublished ? (
        <>
          <Eye className="w-5 h-5" />
          <span>Profile Published</span>
        </>
      ) : (
        <>
          <EyeOff className="w-5 h-5" />
          <span>Profile Unpublished</span>
        </>
      )}
    </button>
  );
}
