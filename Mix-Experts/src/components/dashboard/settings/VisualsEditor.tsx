'use client';

import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface VisualsEditorProps {
    avatarUrl?: string;
    bannerUrl?: string;
    onUpdate: (type: 'avatar' | 'banner', file: File) => void;
}

export const VisualsEditor: React.FC<VisualsEditorProps> = ({ avatarUrl, bannerUrl, onUpdate }) => {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const [previewAvatar, setPreviewAvatar] = useState(avatarUrl);
    const [previewBanner, setPreviewBanner] = useState(bannerUrl);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            // Create local preview URL
            const objectUrl = URL.createObjectURL(file);
            if (type === 'avatar') setPreviewAvatar(objectUrl);
            else setPreviewBanner(objectUrl);

            onUpdate(type, file);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--accent)] border border-[var(--border-dark)]">
                    <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Profile Visuals</h3>
                    <p className="text-sm text-[var(--text-gray)]">Customize how you appear to clients.</p>
                </div>
            </div>

            {/* Banner Section */}
            <div className="relative group">
                <div className="h-48 w-full rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-dark)] overflow-hidden relative">
                    {previewBanner ? (
                        <img
                            src={previewBanner}
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
                        onClick={() => bannerInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer"
                    >
                        <Upload className="w-8 h-8 text-white mb-2" />
                        <span className="text-white font-bold text-sm">Change Banner</span>
                        <span className="text-xs text-white/70 mt-1">1200x300 recommended</span>
                    </button>
                </div>

                {/* Avatar Section - Floating Over Banner */}
                <div className="absolute -bottom-10 left-8">
                    <div className="relative group/avatar">
                        <div className="w-24 h-24 rounded-full border-4 border-[var(--bg-base)] bg-[var(--bg-elevated)] overflow-hidden shadow-xl">
                            {previewAvatar ? (
                                <img
                                    src={previewAvatar}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-2xl">
                                    JM
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                            <Camera className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hidden Inputs */}
            <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'avatar')}
            />
            <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'banner')}
            />

            <div className="h-4"></div> {/* Spacer for negative margin offset */}
        </div>
    );
};
