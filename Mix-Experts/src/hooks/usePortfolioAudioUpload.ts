'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UsePortfolioAudioUploadReturn {
  uploadAudio: (file: File, type: 'before' | 'after') => Promise<string | null>;
  uploading: boolean;
  progress: number;
  error: Error | null;
}

export function usePortfolioAudioUpload(): UsePortfolioAudioUploadReturn {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const uploadAudio = async (file: File, type: 'before' | 'after'): Promise<string | null> => {
    if (!user) {
      const err = new Error('Not authenticated');
      setError(err);
      toast.error('You must be logged in to upload audio');
      return null;
    }

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav)$/i)) {
      const err = new Error('File must be MP3 or WAV');
      setError(err);
      toast.error('Please select an MP3 or WAV file');
      return null;
    }

    // Validate file size (max 50MB for audio)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      const err = new Error('File size must be less than 50MB');
      setError(err);
      toast.error('Audio file must be less than 50MB');
      return null;
    }

    try {
      setUploading(true);
      setProgress(0);
      setError(null);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-audio')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('portfolio-audio')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      setProgress(100);
      toast.success(`${type === 'before' ? 'Before' : 'After'} audio uploaded successfully`);
      return publicUrl;
    } catch (err) {
      console.error('Error uploading audio:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to upload audio');
      setError(errorObj);
      toast.error(errorObj.message);
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadAudio,
    uploading,
    progress,
    error,
  };
}
