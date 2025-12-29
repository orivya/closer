'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UseUpdateProfileReturn {
  updateProfile: (updates: Record<string, any>) => Promise<boolean>;
  updating: boolean;
  error: Error | null;
}

export function useUpdateProfile(): UseUpdateProfileReturn {
  const { user, refreshProfile } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProfile = async (updates: Record<string, any>): Promise<boolean> => {
    if (!user) {
      const err = new Error('Not authenticated');
      setError(err);
      toast.error('You must be logged in to update your profile');
      return false;
    }

    try {
      setUpdating(true);
      setError(null);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Refresh the profile in AuthContext
      await refreshProfile();

      toast.success('Profile updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to update profile');
      setError(errorObj);
      toast.error(errorObj.message);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    updateProfile,
    updating,
    error,
  };
}
