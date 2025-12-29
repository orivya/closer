'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Clock } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';

interface LocationTimezoneSelectorProps {
  initialLocation?: string | null;
  initialTimezone?: string;
}

// Common timezones
const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
  { value: 'UTC', label: 'UTC' },
];

export function LocationTimezoneSelector({
  initialLocation,
  initialTimezone = 'UTC',
}: LocationTimezoneSelectorProps) {
  const [location, setLocation] = useState(initialLocation || '');
  const [timezone, setTimezone] = useState(initialTimezone);
  const [debouncedLocation] = useDebounce(location, 1000);
  const { updateProfile, updating } = useUpdateProfile();
  const [lastSavedLocation, setLastSavedLocation] = useState<string | null>(null);

  // Auto-save location
  useEffect(() => {
    if (debouncedLocation !== initialLocation && debouncedLocation !== lastSavedLocation) {
      updateProfile({ location: debouncedLocation }).then((success) => {
        if (success) {
          setLastSavedLocation(debouncedLocation);
        }
      });
    }
  }, [debouncedLocation, initialLocation, lastSavedLocation, updateProfile]);

  // Save timezone immediately (no debounce needed for select)
  const handleTimezoneChange = (newTimezone: string) => {
    setTimezone(newTimezone);
    updateProfile({ timezone: newTimezone });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Location */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Los Angeles, CA"
            className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-faint)]"
          />
        </div>
      </div>

      {/* Timezone */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Timezone
        </label>
        <div className="relative">
          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none z-10" />
          <select
            value={timezone}
            onChange={(e) => handleTimezoneChange(e.target.value)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors appearance-none cursor-pointer"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value} className="bg-[var(--bg-card)]">
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
