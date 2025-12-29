'use client';

import React, { useRef, useState } from 'react';
import { Upload, Loader2, ImageIcon } from 'lucide-react';
import { useBannerUpload } from '@/hooks/useBannerUpload';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';

interface BannerUploadProps {
  currentBannerUrl?: string | null;
  onUploadComplete?: (url: string) => void;
}

export function BannerUpload({ currentBannerUrl, onUploadComplete }: BannerUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentBannerUrl || null);
  const { uploadBanner, uploading } = useBannerUpload();
  const { updateProfile } = useUpdateProfile();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload to storage
    const publicUrl = await uploadBanner(file);

    if (publicUrl) {
      // Update profile with new banner URL
      await updateProfile({ banner_url: publicUrl });

      // Call callback if provided
      onUploadComplete?.(publicUrl);

      // Clean up object URL
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(publicUrl);
    } else {
      // Revert preview on error
      setPreviewUrl(currentBannerUrl || null);
      URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <div className="relative group">
      <div className="h-48 w-full rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-dark)] overflow-hidden relative">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-muted)] bg-[var(--bg-card)]">
            <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-medium">No Banner Image</span>
          </div>
        )}

        {/* Hover Overlay */}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-white mb-2 animate-spin" />
              <span className="text-white font-bold text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-white mb-2" />
              <span className="text-white font-bold text-sm">Change Banner</span>
              <span className="text-xs text-white/70 mt-1">1200x300 recommended</span>
            </>
          )}
        </button>
      </div>

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
