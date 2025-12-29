'use client';

import React, { useState } from 'react';
import { MessageSquare, Clock, MoreVertical, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface Comment {
    id: string;
    author: string;
    avatar: string;
    timestamp: string; // "1:24"
    text: string;
    createdAt: string; // "2h ago"
    isResolved?: boolean;
}

import { MessageTemplate } from '@/lib/types';
import { TemplateManager } from '@/components/dashboard/messages/TemplateManager';

// Mock Templates
const MOCK_TEMPLATES: MessageTemplate[] = [
    { id: '1', engineerId: 'me', name: 'Revisions Received', shortcut: '/received', content: 'Thanks for the feedback! I\'ve received your revision request and will start working on it shortly.' },
    { id: '2', engineerId: 'me', name: 'Upload Complete', shortcut: '/upload', content: 'Just uploaded the latest version. Please take a listen and let me know what you think!' },
];

interface CommentThreadProps {
    comments: Comment[];
    onSeek: (timestamp: string) => void;
    onAddComment: (text: string) => void;
}

export const CommentThread: React.FC<CommentThreadProps> = ({ comments: initialComments, onSeek, onAddComment }) => {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState("");
    const [showTemplates, setShowTemplates] = useState(false);
    const [templates, setTemplates] = useState(MOCK_TEMPLATES);
    const [showSlashMenu, setShowSlashMenu] = useState(false);

    const handleAdd = () => {
        if (!newComment.trim()) return;
        onAddComment(newComment);
        setNewComment("");
        setShowSlashMenu(false);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewComment(value);
        if (value.endsWith('/')) {
            setShowSlashMenu(true);
        } else if (value === '' || !value.includes('/')) {
            setShowSlashMenu(false);
        }
    };

    const insertTemplate = (content: string) => {
        // Replace the last occurrence of '/' with the content, or just append if complex
        // Simple logic: if text ends with / or is just /, replace or append
        const parts = newComment.split('/');
        parts.pop(); // Remove the part after the last slash
        setNewComment(parts.join('/') + content);
        setShowSlashMenu(false);
    };

    const saveTemplate = (template: MessageTemplate) => {
        if (templates.find(t => t.id === template.id)) {
            setTemplates(templates.map(t => t.id === template.id ? template : t));
        } else {
            setTemplates([...templates, template]);
        }
    };

    const deleteTemplate = (id: string) => {
        setTemplates(templates.filter(t => t.id !== id));
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl overflow-hidden relative">
            <div className="p-4 border-b border-[var(--border-dark)] flex justify-between items-center bg-[var(--bg-card)]">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
                    Feedback
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-muted)]">{comments.length} notes</span>
                    <button
                        onClick={() => setShowTemplates(!showTemplates)}
                        className={cn(
                            "p-1.5 rounded-lg transition-colors",
                            showTemplates ? "bg-[var(--accent)] text-white" : "text-[var(--text-gray)] hover:text-white"
                        )}
                        title="Manage Templates"
                    >
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {showTemplates && (
                <div className="absolute top-14 right-4 z-20 w-80 shadow-2xl animate-in zoom-in-95 duration-200">
                    <TemplateManager
                        templates={templates}
                        onSave={saveTemplate}
                        onDelete={deleteTemplate}
                    />
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {comments.map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-xl p-3 hover:border-[var(--accent)] transition-colors cursor-pointer group"
                            onClick={() => onSeek(comment.timestamp)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                                        {comment.avatar}
                                    </div>
                                    <span className="text-xs font-bold text-white">{comment.author}</span>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-mono font-bold flex items-center gap-1 group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                                    <Clock className="w-3 h-3" />
                                    {comment.timestamp}
                                </span>
                            </div>
                            <p className="text-sm text-[var(--text-gray)] leading-relaxed mb-2">{comment.text}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-[var(--text-muted)]">{comment.createdAt}</span>
                                <button className="opacity-0 group-hover:opacity-100 text-[10px] text-[var(--text-muted)] hover:text-white transition-opacity">
                                    Reply
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-3 border-t border-[var(--border-dark)] bg-[var(--bg-card)] relative">
                {showSlashMenu && (
                    <div className="absolute bottom-full left-3 mb-2 w-64 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-2">
                        <div className="p-2 border-b border-[var(--border-dark)] bg-[var(--bg-base)] text-xs font-bold text-[var(--text-muted)]">
                            Templates
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                            {templates.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => insertTemplate(t.content)}
                                    className="w-full text-left px-3 py-2 hover:bg-[var(--bg-hover)] transition-colors flex flex-col gap-0.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-white">{t.name}</span>
                                        <code className="text-[10px] bg-[var(--bg-base)] px-1 rounded text-[var(--accent)]">{t.shortcut}</code>
                                    </div>
                                    <span className="text-xs text-[var(--text-muted)] line-clamp-1">{t.content}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={handleTextChange}
                        placeholder="Leave a note... (Type '/' for templates)"
                        className="flex-1 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-lg px-3 py-2 text-sm text-white focus:border-[var(--accent)] focus:outline-none transition-colors"
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!newComment.trim()}
                        className="p-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
