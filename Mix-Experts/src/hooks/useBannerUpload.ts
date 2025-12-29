'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UseBannerUploadReturn {
  uploadBanner: (file: File) => Promise<string | null>;
  uploading: boolean;
  error: Error | null;
}

export function useBannerUpload(): UseBannerUploadReturn {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadBanner = async (file: File): Promise<string | null> => {
    if (!user) {
      const err = new Error('Not authenticated');
      setError(err);
      toast.error('You must be logged in to upload a banner');
      return null;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const err = new Error('File must be an image');
      setError(err);
      toast.error('Please select an image file');
      return null;
    }

    // Validate file size (max 10MB for banner)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      const err = new Error('File size must be less than 10MB');
      setError(err);
      toast.error('Image must be less than 10MB');
      return null;
    }

    try {
      setUploading(true);
      setError(null);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      toast.success('Banner uploaded successfully');
      return publicUrl;
    } catch (err) {
      console.error('Error uploading banner:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to upload banner');
      setError(errorObj);
      toast.error(errorObj.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadBanner,
    uploading,
    error,
  };
}
