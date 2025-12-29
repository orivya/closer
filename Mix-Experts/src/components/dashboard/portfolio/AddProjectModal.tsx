'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Music, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectData {
    id?: string;
    title: string;
    artist: string;
    genre: string;
    cover: string | File | null;
    beforeUrl?: string | File | null;
    afterUrl?: string | File | null;
}

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: any) => void;
    initialData?: ProjectData | null;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<1 | 2>(1); // 1: Info, 2: Audio
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        artist: '',
        genre: '',
        cover: null as string | File | null,
        beforeAudio: null as string | File | null,
        afterAudio: null as string | File | null,
    });

    // Reset or Initialize form on open
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    title: initialData.title,
                    artist: initialData.artist,
                    genre: initialData.genre,
                    cover: initialData.cover,
                    beforeAudio: initialData.beforeUrl || null,
                    afterAudio: initialData.afterUrl || null,
                });
            } else {
                setFormData({
                    title: '',
                    artist: '',
                    genre: '',
                    cover: null,
                    beforeAudio: null,
                    afterAudio: null,
                });
            }
            setStep(1);
            // Focus the close button when modal opens for accessibility
            setTimeout(() => closeButtonRef.current?.focus(), 100);
        }
    }, [isOpen, initialData]);

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

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

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

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API upload
        await new Promise(resolve => setTimeout(resolve, 1500));

        onSave({
            id: initialData?.id || Math.random().toString(),
            title: formData.title,
            artist: formData.artist,
            genre: formData.genre,
            // Mock URLs for demo or keep existing
            cover: typeof formData.cover === 'string' ? formData.cover : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
            beforeUrl: 'mock_before.mp3',
            afterUrl: 'mock_after.mp3',
        });
        setIsLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            >
                <motion.div
                    ref={modalRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    className="w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-3xl overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-[var(--border-dark)] flex items-center justify-between bg-[var(--bg-elevated)]">
                        <div>
                            <h2 id="modal-title" className="text-xl font-bold text-white">{initialData ? 'Edit Project' : 'Add Portfolio Project'}</h2>
                            <p id="modal-description" className="text-sm text-[var(--text-muted)]">Upload your Before & After comparisons</p>
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
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="track-title" className="text-sm font-bold text-[var(--text-gray)]">Track Title</label>
                                        <input
                                            id="track-title"
                                            type="text"
                                            placeholder="e.g. Neon Lights"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                            required
                                            aria-required="true"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="artist-name" className="text-sm font-bold text-[var(--text-gray)]">Artist Name</label>
                                        <input
                                            id="artist-name"
                                            type="text"
                                            placeholder="e.g. Sarah Vocalist"
                                            value={formData.artist}
                                            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                                            className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                            required
                                            aria-required="true"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="cover-art" className="text-sm font-bold text-[var(--text-gray)]">Cover Art</label>
                                    <button
                                        id="cover-art"
                                        type="button"
                                        className="w-full h-32 border-2 border-dashed border-[var(--border-dark)] rounded-xl flex flex-col items-center justify-center text-[var(--text-muted)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-card)]"
                                        aria-label="Upload cover art image"
                                    >
                                        <div className="p-3 rounded-full bg-[var(--bg-elevated)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors mb-2">
                                            <ImageIcon className="w-6 h-6" aria-hidden="true" />
                                        </div>
                                        <span className="text-sm font-medium">Click to upload or drag and drop</span>
                                        <span className="text-xs text-[var(--text-muted)] mt-1">JPG, PNG (Max 5MB)</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-2">
                                    <label htmlFor="before-audio" className="text-sm font-bold text-[var(--text-gray)]">Before Audio (Rough Mix)</label>
                                    <button
                                        id="before-audio"
                                        type="button"
                                        className="w-full h-24 border border-[var(--border-dark)] rounded-xl bg-[var(--bg-base)] flex items-center px-6 gap-4 hover:border-red-500/50 transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-card)]"
                                        aria-label="Upload rough mix audio file"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                                            <Music className="w-5 h-5" aria-hidden="true" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-white group-hover:text-red-400">Upload Rough Mix</p>
                                            <p className="text-xs text-[var(--text-muted)]">MP3 or WAV</p>
                                        </div>
                                        <Upload className="w-5 h-5 text-[var(--text-muted)] group-hover:text-white" aria-hidden="true" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="after-audio" className="text-sm font-bold text-[var(--text-gray)]">After Audio (Final Master)</label>
                                    <button
                                        id="after-audio"
                                        type="button"
                                        className="w-full h-24 border border-[var(--border-dark)] rounded-xl bg-[var(--bg-base)] flex items-center px-6 gap-4 hover:border-green-500/50 transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-card)]"
                                        aria-label="Upload final master audio file"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                                            <Music className="w-5 h-5" aria-hidden="true" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-white group-hover:text-green-400">Upload Final Master</p>
                                            <p className="text-xs text-[var(--text-muted)]">MP3 or WAV</p>
                                        </div>
                                        <Upload className="w-5 h-5 text-[var(--text-muted)] group-hover:text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 bg-[var(--bg-elevated)] border-t border-[var(--border-dark)] flex items-center justify-between">
                        {step === 2 ? (
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-2.5 text-sm font-bold text-[var(--text-gray)] hover:text-white transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-elevated)]"
                                aria-label="Go back to project information step"
                            >
                                Back
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {step === 1 ? (
                            <button
                                onClick={() => setStep(2)}
                                className="px-8 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--bg-elevated)]"
                                aria-label="Continue to audio upload step"
                            >
                                Next: Audio
                            </button>
                        ) : (
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="px-8 py-2.5 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-colors shadow-[0_0_20px_var(--accent-glow)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--bg-elevated)]"
                                aria-label={initialData ? 'Save project changes' : 'Create new project'}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                                        <span>{initialData ? 'Saving...' : 'Uploading...'}</span>
                                        <span className="sr-only">Please wait</span>
                                    </>
                                ) : (
                                    initialData ? 'Save Changes' : 'Create Project'
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
