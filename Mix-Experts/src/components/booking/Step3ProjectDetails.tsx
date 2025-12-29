'use client';

import React from 'react';
import { useBooking } from '@/context/BookingContext';
import { Upload, FileAudio, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Step3ProjectDetails = () => {
    const { data, updateData, nextStep, prevStep } = useBooking();

    // Mock file handler
    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        // Just mocking the list
        const mockFile = new File([""], "song_demo_v1.mp3", { type: "audio/mp3" });
        updateData({ uploadedFiles: [...data.uploadedFiles, mockFile] });
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Project Details</h2>
                <p className="text-[var(--text-gray)]">Tell us about the track you want us to work on.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Form Fields */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Project Title</label>
                        <input
                            type="text"
                            value={data.projectTitle}
                            onChange={(e) => updateData({ projectTitle: e.target.value })}
                            placeholder="e.g. Midnight Memories"
                            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-faint)]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Artist Name</label>
                        <input
                            type="text"
                            value={data.artistName}
                            onChange={(e) => updateData({ artistName: e.target.value })}
                            placeholder="e.g. The Luna Collective"
                            className="w-full bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-faint)]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">BPM</label>
                            <input
                                type="text"
                                value={data.bpm}
                                onChange={(e) => updateData({ bpm: e.target.value })}
                                placeholder="124"
                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Key</label>
                            <input
                                type="text"
                                value={data.key}
                                onChange={(e) => updateData({ key: e.target.value })}
                                placeholder="Am"
                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Notes / References</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => updateData({ description: e.target.value })}
                            placeholder="Specific vibes, reference tracks, or mixing notes..."
                            className="w-full h-32 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-faint)] resize-none"
                        />
                    </div>
                </div>

                {/* File Upload Area */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Audio Files</label>
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        className="h-[340px] border-2 border-dashed border-[var(--border-dark)] hover:border-[var(--accent)] rounded-2xl flex flex-col items-center justify-center bg-[var(--bg-card)] transition-colors cursor-pointer group"
                    >
                        <div className="p-4 bg-[var(--bg-elevated)] rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-[var(--accent)]" />
                        </div>
                        <p className="text-white font-bold mb-2">Drag & Drop Stems</p>
                        <p className="text-sm text-[var(--text-muted)] mb-6 text-center px-8">Supports WAV, AIFF, ZIP. Up to 2GB.</p>
                        <button className="px-6 py-2 bg-[var(--bg-elevated)] text-white text-sm font-bold rounded-lg border border-[var(--border-dark)] hover:bg-[var(--bg-hover)] transition-colors">
                            Browse Files
                        </button>
                    </div>

                    {/* File List Mock */}
                    {data.uploadedFiles.length > 0 && (
                        <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl p-3 flex items-center gap-3">
                            <FileAudio className="w-5 h-5 text-[var(--accent)]" />
                            <span className="text-sm text-white flex-1 truncate">{data.uploadedFiles[0].name}</span>
                            <span className="text-xs text-[var(--text-muted)]">Looking good!</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-[var(--border-dark)]">
                <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-[var(--bg-card)] text-[var(--text-muted)] font-bold rounded-xl hover:bg-[var(--bg-elevated)] hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <div className="flex-1" />
                <button
                    onClick={nextStep}
                    disabled={!data.projectTitle || !data.artistName}
                    className="px-8 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_var(--accent-glow)] flex items-center justify-center gap-2"
                >
                    Review Schedule
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
