'use client';

import React, { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  displayName?: string;
  onUploadComplete?: (url: string) => void;
}

export function AvatarUpload({ currentAvatarUrl, displayName, onUploadComplete }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);
  const { uploadAvatar, uploading } = useAvatarUpload();
  const { updateProfile } = useUpdateProfile();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload to storage
    const publicUrl = await uploadAvatar(file);

    if (publicUrl) {
      // Update profile with new avatar URL
      await updateProfile({ avatar_url: publicUrl });

      // Call callback if provided
      onUploadComplete?.(publicUrl);

      // Clean up object URL
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(publicUrl);
    } else {
      // Revert preview on error
      setPreviewUrl(currentAvatarUrl || null);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const getInitials = () => {
    if (!displayName) return 'ME';
    return displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative group/avatar">
      <div className="w-24 h-24 rounded-full border-4 border-[var(--bg-base)] bg-[var(--bg-elevated)] overflow-hidden shadow-xl">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-2xl">
            {getInitials()}
          </div>
        )}
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
      >
        {uploading ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <Camera className="w-6 h-6 text-white" />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
}
