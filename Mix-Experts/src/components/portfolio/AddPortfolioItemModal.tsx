'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Music, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePortfolioItems } from '@/hooks/usePortfolioItems';
import { usePortfolioAudioUpload } from '@/hooks/usePortfolioAudioUpload';
import { usePortfolioCoverUpload } from '@/hooks/usePortfolioCoverUpload';
import { toast } from 'sonner';

interface AddPortfolioItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    title: string;
    artist: string;
    genre: string | null;
    cover_image_url: string | null;
    before_audio_url: string;
    after_audio_url: string;
    description: string | null;
  } | null;
}

export function AddPortfolioItemModal({ isOpen, onClose, initialData }: AddPortfolioItemModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const { addPortfolioItem, updatePortfolioItem } = usePortfolioItems();
  const { uploadAudio, uploading: uploadingAudio } = usePortfolioAudioUpload();
  const { uploadCover, uploading: uploadingCover } = usePortfolioCoverUpload();

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState(initialData?.title || '');
  const [artist, setArtist] = useState(initialData?.artist || '');
  const [genre, setGenre] = useState(initialData?.genre || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [coverUrl, setCoverUrl] = useState<string | null>(initialData?.cover_image_url || null);
  const [beforeUrl, setBeforeUrl] = useState<string | null>(initialData?.before_audio_url || null);
  const [afterUrl, setAfterUrl] = useState<string | null>(initialData?.after_audio_url || null);

  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.cover_image_url || null);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setArtist(initialData.artist);
        setGenre(initialData.genre || '');
        setDescription(initialData.description || '');
        setCoverUrl(initialData.cover_image_url);
        setBeforeUrl(initialData.before_audio_url);
        setAfterUrl(initialData.after_audio_url);
        setCoverPreview(initialData.cover_image_url);
      } else {
        setTitle('');
        setArtist('');
        setGenre('');
        setDescription('');
        setCoverUrl(null);
        setBeforeUrl(null);
        setAfterUrl(null);
        setCoverPreview(null);
      }
      setStep(1);
    }
  }, [isOpen, initialData]);

  // Store the element that triggered the modal and manage focus
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Focus the close button when modal opens
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      // Return focus to trigger element on close
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, [isOpen, step]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const preview = URL.createObjectURL(file);
    setCoverPreview(preview);

    // Upload
    const url = await uploadCover(file);
    if (url) {
      setCoverUrl(url);
      URL.revokeObjectURL(preview);
    } else {
      setCoverPreview(coverUrl);
    }
  };

  const handleBeforeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadAudio(file, 'before');
    if (url) {
      setBeforeUrl(url);
    }
  };

  const handleAfterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadAudio(file, 'after');
    if (url) {
      setAfterUrl(url);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      toast.error('Please enter a track title');
      return;
    }
    if (!artist.trim()) {
      toast.error('Please enter an artist name');
      return;
    }
    if (!beforeUrl) {
      toast.error('Please upload a before audio file');
      return;
    }
    if (!afterUrl) {
      toast.error('Please upload an after audio file');
      return;
    }

    const data = {
      title: title.trim(),
      artist: artist.trim(),
      genre: genre.trim() || null,
      description: description.trim() || null,
      cover_image_url: coverUrl,
      before_audio_url: beforeUrl,
      after_audio_url: afterUrl,
    };

    let success = false;
    if (initialData) {
      success = await updatePortfolioItem(initialData.id, data);
    } else {
      success = await addPortfolioItem(data);
    }

    if (success) {
      onClose();
    }
  };

  const canProceedToStep2 = title.trim() && artist.trim();
  const canSave = canProceedToStep2 && beforeUrl && afterUrl;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="portfolio-modal-title" aria-describedby="portfolio-modal-description">
        <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-[var(--border-dark)] flex items-center justify-between bg-[var(--bg-elevated)]">
            <div>
              <h2 id="portfolio-modal-title" className="text-xl font-bold text-white">
                {initialData ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
              </h2>
              <p id="portfolio-modal-description" className="text-sm text-[var(--text-muted)]">
                Upload your Before & After audio comparison
              </p>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-white rounded-full hover:bg-[var(--bg-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-elevated)]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--text-gray)]">
                      Track Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Neon Lights"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:outline-none focus:border-[var(--accent)] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--text-gray)]">
                      Artist Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Vocalist"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:outline-none focus:border-[var(--accent)] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--text-gray)]">Genre</label>
                  <input
                    type="text"
                    placeholder="e.g. Pop, Hip-Hop, R&B"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:outline-none focus:border-[var(--accent)] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--text-gray)]">Description</label>
                  <textarea
                    placeholder="Tell the story behind this mix..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:outline-none focus:border-[var(--accent)] transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--text-gray)]">Cover Art</label>
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className={cn(
                      'w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all',
                      coverPreview
                        ? 'border-[var(--accent)]'
                        : 'border-[var(--border-dark)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5'
                    )}
                  >
                    {coverPreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {uploadingCover && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="p-3 rounded-full bg-[var(--bg-elevated)] mb-2">
                          <ImageIcon className="w-6 h-6 text-[var(--text-muted)]" />
                        </div>
                        <span className="text-sm font-medium text-[var(--text-muted)]">
                          Click to upload cover art
                        </span>
                        <span className="text-xs text-[var(--text-muted)] mt-1">
                          JPG, PNG (Max 5MB)
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                    disabled={uploadingCover}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Before Audio */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--text-gray)]">
                    Before Audio (Rough Mix) <span className="text-red-400">*</span>
                  </label>
                  <div
                    onClick={() => !uploadingAudio && beforeInputRef.current?.click()}
                    className={cn(
                      'w-full h-24 border rounded-xl bg-[var(--bg-base)] flex items-center px-6 gap-4 transition-colors cursor-pointer',
                      beforeUrl
                        ? 'border-green-500/50'
                        : 'border-[var(--border-dark)] hover:border-red-500/50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                        beforeUrl
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500/10 text-red-500'
                      )}
                    >
                      {uploadingAudio ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : beforeUrl ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Music className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">
                        {beforeUrl ? 'Before Audio Uploaded' : 'Upload Rough Mix'}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">MP3 or WAV (Max 50MB)</p>
                    </div>
                    {!beforeUrl && <Upload className="w-5 h-5 text-[var(--text-muted)]" />}
                  </div>
                  <input
                    ref={beforeInputRef}
                    type="file"
                    accept="audio/*,.mp3,.wav"
                    className="hidden"
                    onChange={handleBeforeUpload}
                    disabled={uploadingAudio}
                  />
                </div>

                {/* After Audio */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--text-gray)]">
                    After Audio (Final Master) <span className="text-red-400">*</span>
                  </label>
                  <div
                    onClick={() => !uploadingAudio && afterInputRef.current?.click()}
                    className={cn(
                      'w-full h-24 border rounded-xl bg-[var(--bg-base)] flex items-center px-6 gap-4 transition-colors cursor-pointer',
                      afterUrl
                        ? 'border-green-500/50'
                        : 'border-[var(--border-dark)] hover:border-green-500/50'
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                        afterUrl
                          ? 'bg-green-500 text-white'
                          : 'bg-green-500/10 text-green-500'
                      )}
                    >
                      {uploadingAudio ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : afterUrl ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Music className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">
                        {afterUrl ? 'After Audio Uploaded' : 'Upload Final Master'}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">MP3 or WAV (Max 50MB)</p>
                    </div>
                    {!afterUrl && <Upload className="w-5 h-5 text-[var(--text-muted)]" />}
                  </div>
                  <input
                    ref={afterInputRef}
                    type="file"
                    accept="audio/*,.mp3,.wav"
                    className="hidden"
                    onChange={handleAfterUpload}
                    disabled={uploadingAudio}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-[var(--bg-elevated)] border-t border-[var(--border-dark)] flex items-center justify-between">
            {step === 2 ? (
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2.5 text-sm font-bold text-[var(--text-gray)] hover:text-white transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2}
                className="px-8 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Audio
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={!canSave || uploadingAudio || uploadingCover}
                className="px-8 py-2.5 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-colors shadow-[0_0_20px_var(--accent-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {initialData ? 'Save Changes' : 'Create Portfolio Item'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
