'use client';

import React, { useState } from 'react';
import { X, Send, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RevisionRequestFormProps {
    onSubmit: (data: { notes: string; timestamps: { time: string; note: string }[] }) => void;
    onCancel: () => void;
    revisionNumber: number;
    price?: number; // If applicable (extra revision)
}

export const RevisionRequestForm: React.FC<RevisionRequestFormProps> = ({ onSubmit, onCancel, revisionNumber, price }) => {
    const [notes, setNotes] = useState('');
    const [timestamps, setTimestamps] = useState<{ time: string; note: string }[]>([{ time: '', note: '' }]);

    const addTimestamp = () => {
        setTimestamps([...timestamps, { time: '', note: '' }]);
    };

    const removeTimestamp = (index: number) => {
        setTimestamps(timestamps.filter((_, i) => i !== index));
    };

    const updateTimestamp = (index: number, field: 'time' | 'note', value: string) => {
        const newTimestamps = [...timestamps];
        newTimestamps[index] = { ...newTimestamps[index], [field]: value };
        setTimestamps(newTimestamps);
    };

    const handleSubmit = () => {
        // Filter out empty timestamps
        const validTimestamps = timestamps.filter(t => t.time && t.note);
        onSubmit({ notes, timestamps: validTimestamps });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative w-full max-w-lg bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-[var(--border-dark)] flex items-center justify-between bg-[var(--bg-card)]">
                    <div>
                        <h3 className="text-xl font-bold text-white">Request Revision #{revisionNumber}</h3>
                        {price ? (
                            <p className="text-sm text-orange-400 font-medium">Extra Revision Charge: ${price}</p>
                        ) : (
                            <p className="text-sm text-[var(--text-muted)]">Please be specific about your changes.</p>
                        )}
                    </div>
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-gray)] hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

                    {/* General Notes */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">General Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Overall feedback for this mix..."
                            rows={4}
                            className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl text-white focus:border-[var(--accent)] focus:outline-none resize-none"
                        />
                    </div>

                    {/* Specific Timestamps */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider">Specific Changes</label>
                            <button onClick={addTimestamp} className="text-xs font-bold text-[var(--text-muted)] hover:text-white flex items-center gap-1 transition-colors">
                                <Plus className="w-3 h-3" /> Add Timestamp
                            </button>
                        </div>

                        {timestamps.map((ts, index) => (
                            <div key={index} className="flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
                                <input
                                    type="text"
                                    value={ts.time}
                                    onChange={(e) => updateTimestamp(index, 'time', e.target.value)}
                                    placeholder="0:00"
                                    className="w-20 px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-lg text-white focus:border-[var(--accent)] focus:outline-none text-center font-mono text-sm"
                                />
                                <input
                                    type="text"
                                    value={ts.note}
                                    onChange={(e) => updateTimestamp(index, 'note', e.target.value)}
                                    placeholder="What needs to change here?"
                                    className="flex-1 px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-lg text-white focus:border-[var(--accent)] focus:outline-none text-sm"
                                />
                                {timestamps.length > 1 && (
                                    <button
                                        onClick={() => removeTimestamp(index)}
                                        className="p-2 text-[var(--text-gray)] hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border-dark)] bg-[var(--bg-card)] flex justify-end gap-3">
                    <button onClick={onCancel} className="px-5 py-2.5 text-sm font-bold text-[var(--text-gray)] hover:text-white transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2.5 bg-[var(--accent)] text-white font-bold rounded-xl shadow-lg hover:bg-[var(--accent-light)] transition-colors flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
    );
};
