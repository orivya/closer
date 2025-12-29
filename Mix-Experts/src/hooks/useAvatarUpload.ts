'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UseAvatarUploadReturn {
  uploadAvatar: (file: File) => Promise<string | null>;
  uploading: boolean;
  error: Error | null;
}

export function useAvatarUpload(): UseAvatarUploadReturn {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!user) {
      const err = new Error('Not authenticated');
      setError(err);
      toast.error('You must be logged in to upload an avatar');
      return null;
    }

    // Allowed image types (explicitly exclude SVG for security - XSS risk)
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    // Validate file type - strict whitelist (no SVG to prevent XSS)
    if (!allowedTypes.includes(file.type)) {
      const err = new Error('File must be a JPEG, PNG, GIF, or WebP image');
      setError(err);
      toast.error('Please select a JPEG, PNG, GIF, or WebP image (SVG not allowed)');
      return null;
    }

    // Double-check file extension matches type
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      const err = new Error('Invalid file extension');
      setError(err);
      toast.error('Invalid file extension');
      return null;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      const err = new Error('File size must be less than 5MB');
      setError(err);
      toast.error('Image must be less than 5MB');
      return null;
    }

    try {
      setUploading(true);
      setError(null);

      // Generate unique filename (fileExt already validated above)
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      toast.success('Avatar uploaded successfully');
      return publicUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to upload avatar');
      setError(errorObj);
      toast.error(errorObj.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadAvatar,
    uploading,
    error,
  };
}
