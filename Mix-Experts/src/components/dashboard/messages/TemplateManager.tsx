'use client';

import React, { useState } from 'react';
import { MessageTemplate } from '@/lib/types';
import { Plus, Trash2, Edit2, Save, X, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateManagerProps {
    templates: MessageTemplate[];
    onSave: (template: MessageTemplate) => void;
    onDelete: (id: string) => void;
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({ templates, onSave, onDelete }) => {
    const [isEditing, setIsEditing] = useState<string | null>(null); // 'new' or ID
    const [formData, setFormData] = useState<Partial<MessageTemplate>>({});

    const handleEdit = (template?: MessageTemplate) => {
        if (template) {
            setIsEditing(template.id);
            setFormData(template);
        } else {
            setIsEditing('new');
            setFormData({ name: '', shortcut: '', content: '' });
        }
    };

    const handleSave = () => {
        if (!formData.name || !formData.content || !formData.shortcut) return;

        onSave({
            id: formData.id || Math.random().toString(),
            engineerId: 'current-user',
            name: formData.name,
            shortcut: formData.shortcut.startsWith('/') ? formData.shortcut : `/${formData.shortcut}`,
            content: formData.content,
        });
        setIsEditing(null);
    };

    return (
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-[var(--border-dark)] flex items-center justify-between">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
                    Response Templates
                </h3>
                <button
                    onClick={() => handleEdit()}
                    className="p-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg hover:bg-[var(--accent)] hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" /> New
                </button>
            </div>

            <div className="divide-y divide-[var(--border-dark)] max-h-[300px] overflow-y-auto">
                {isEditing === 'new' && (
                    <div className="p-4 bg-[var(--bg-base)] space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Name (e.g. Revision Received)"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="flex-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-white text-sm focus:border-[var(--accent)] outline-none"
                            />
                            <input
                                type="text"
                                placeholder="/shortcut"
                                value={formData.shortcut}
                                onChange={(e) => setFormData({ ...formData, shortcut: e.target.value })}
                                className="w-24 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-white text-sm focus:border-[var(--accent)] outline-none font-mono"
                            />
                        </div>
                        <textarea
                            placeholder="Template content..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-white text-sm focus:border-[var(--accent)] outline-none resize-none"
                            rows={2}
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsEditing(null)} className="p-1.5 text-[var(--text-gray)] hover:text-white"><X className="w-4 h-4" /></button>
                            <button onClick={handleSave} className="p-1.5 text-[var(--accent)] hover:text-[var(--accent-light)]"><Save className="w-4 h-4" /></button>
                        </div>
                    </div>
                )}

                {templates.map(template => (
                    <div key={template.id} className="p-4 hover:bg-[var(--bg-hover)] transition-colors group">
                        {isEditing === template.id ? (
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="flex-1 px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-lg text-white text-sm focus:border-[var(--accent)] outline-none"
                                    />
                                    <input
                                        type="text"
                                        value={formData.shortcut}
                                        onChange={(e) => setFormData({ ...formData, shortcut: e.target.value })}
                                        className="w-24 px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-lg text-white text-sm focus:border-[var(--accent)] outline-none font-mono"
                                    />
                                </div>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-lg text-white text-sm focus:border-[var(--accent)] outline-none resize-none"
                                    rows={2}
                                />
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setIsEditing(null)} className="p-1.5 text-[var(--text-gray)] hover:text-white"><X className="w-4 h-4" /></button>
                                    <button onClick={handleSave} className="p-1.5 text-[var(--accent)] hover:text-[var(--accent-light)]"><Save className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-white text-sm">{template.name}</span>
                                        <code className="px-1.5 py-0.5 rounded bg-[var(--bg-base)] text-[var(--accent)] text-xs font-mono">{template.shortcut}</code>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] line-clamp-1">{template.content}</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(template)} className="p-1.5 text-[var(--text-gray)] hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => onDelete(template.id)} className="p-1.5 text-[var(--text-gray)] hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {templates.length === 0 && !isEditing && (
                    <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                        No templates yet. Create one to save time!
                    </div>
                )}
            </div>
        </div>
    );
};
