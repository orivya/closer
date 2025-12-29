'use client';

import React, { useState, useEffect } from 'react';
import { Type } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { cn } from '@/lib/utils';

interface TaglineEditorProps {
  initialTagline?: string | null;
  maxLength?: number;
}

export function TaglineEditor({ initialTagline, maxLength = 100 }: TaglineEditorProps) {
  const [tagline, setTagline] = useState(initialTagline || '');
  const [debouncedTagline] = useDebounce(tagline, 1000);
  const { updateProfile, updating } = useUpdateProfile();
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    if (debouncedTagline !== initialTagline && debouncedTagline !== lastSaved) {
      updateProfile({ tagline: debouncedTagline }).then((success) => {
        if (success) {
          setLastSaved(debouncedTagline);
        }
      });
    }
  }, [debouncedTagline, initialTagline, lastSaved, updateProfile]);

  const remainingChars = maxLength - tagline.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Tagline
        </label>
        {updating && (
          <span className="text-xs text-[var(--text-muted)]">Saving...</span>
        )}
      </div>
      <div className="relative">
        <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          value={tagline}
          onChange={(e) => {
            if (e.target.value.length <= maxLength) {
              setTagline(e.target.value);
            }
          }}
          placeholder="e.g. Platinum Audio Engineer"
          className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-faint)]"
        />
      </div>
      <p className="text-xs text-[var(--text-muted)]">
        {remainingChars} characters remaining
      </p>
    </div>
  );
}
