'use client';

import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { cn } from '@/lib/utils';

interface BioEditorProps {
  initialBio?: string | null;
  maxLength?: number;
}

export function BioEditor({ initialBio, maxLength = 500 }: BioEditorProps) {
  const [bio, setBio] = useState(initialBio || '');
  const [debouncedBio] = useDebounce(bio, 1000); // Auto-save after 1 second of no typing
  const { updateProfile, updating } = useUpdateProfile();
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Auto-save when debounced value changes
  useEffect(() => {
    if (debouncedBio !== initialBio && debouncedBio !== lastSaved) {
      updateProfile({ bio: debouncedBio }).then((success) => {
        if (success) {
          setLastSaved(debouncedBio);
        }
      });
    }
  }, [debouncedBio, initialBio, lastSaved, updateProfile]);

  const remainingChars = maxLength - bio.length;
  const isNearLimit = remainingChars < 50;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          About Me
        </label>
        <div className="flex items-center gap-2">
          {updating && (
            <span className="text-xs text-[var(--text-muted)]">Saving...</span>
          )}
          <span
            className={cn(
              'text-xs font-medium',
              isNearLimit ? 'text-orange-400' : 'text-[var(--text-muted)]'
            )}
          >
            {remainingChars} characters left
          </span>
        </div>
      </div>
      <textarea
        value={bio}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            setBio(e.target.value);
          }
        }}
        rows={5}
        placeholder="Tell your story... Share your experience, achievements, and what makes you unique."
        className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl p-4 text-white focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-faint)] resize-none"
      />
    </div>
  );
}
