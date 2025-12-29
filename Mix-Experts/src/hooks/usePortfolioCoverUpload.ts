'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UsePortfolioCoverUploadReturn {
  uploadCover: (file: File) => Promise<string | null>;
  uploading: boolean;
  error: Error | null;
}

export function usePortfolioCoverUpload(): UsePortfolioCoverUploadReturn {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadCover = async (file: File): Promise<string | null> => {
    if (!user) {
      const err = new Error('Not authenticated');
      setError(err);
      toast.error('You must be logged in to upload a cover image');
      return null;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const err = new Error('File must be an image');
      setError(err);
      toast.error('Please select an image file');
      return null;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const err = new Error('File size must be less than 5MB');
      setError(err);
      toast.error('Image must be less than 5MB');
      return null;
    }

    try {
      setUploading(true);
      setError(null);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/cover-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      toast.success('Cover image uploaded successfully');
      return publicUrl;
    } catch (err) {
      console.error('Error uploading cover:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to upload cover image');
      setError(errorObj);
      toast.error(errorObj.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadCover,
    uploading,
    error,
  };
}
