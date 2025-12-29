'use client';

import React, { useState } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMessages } from '@/hooks/useMessages';
import { ThreadSummary } from '@/types/messages';

interface InboxListProps {
    selectedId: string | null;
    onSelect: (id: string) => void;
}

function getAvatarInitials(thread: ThreadSummary): string {
    if (thread.sender_display_name) {
        return thread.sender_display_name.charAt(0).toUpperCase();
    }
    if (thread.sender_name) {
        return thread.sender_name.charAt(0).toUpperCase();
    }
    if (thread.sender_username) {
        return thread.sender_username.charAt(0).toUpperCase();
    }
    if (thread.sender_email) {
        return thread.sender_email.charAt(0).toUpperCase();
    }
    return '?';
}

function getAvatarColor(index: number): string {
    const colors = [
        'bg-purple-500/20 text-purple-400',
        'bg-blue-500/20 text-blue-400',
        'bg-green-500/20 text-green-400',
        'bg-orange-500/20 text-orange-400',
        'bg-red-500/20 text-red-400',
        'bg-pink-500/20 text-pink-400',
        'bg-yellow-500/20 text-yellow-400',
        'bg-cyan-500/20 text-cyan-400',
    ];
    return colors[index % colors.length];
}

function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
        return 'Yesterday';
    } else if (days < 7) {
        return `${days} days ago`;
    } else if (days < 30) {
        const weeks = Math.floor(days / 7);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function getSenderName(thread: ThreadSummary): string {
    return thread.sender_display_name || thread.sender_name || thread.sender_username || thread.sender_email || 'Unknown';
}

function getInquiryStatusBadge(status: string | null): string {
    if (!status) return '';
    const badges: Record<string, string> = {
        new: 'New',
        read: 'Read',
        replied: 'Replied',
        converted: 'Converted',
        archived: 'Archived',
    };
    return badges[status] || status;
}

export const InboxList: React.FC<InboxListProps> = ({ selectedId, onSelect }) => {
    const { threads, loading, getTotalUnreadCount } = useMessages();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredThreads = threads.filter((thread) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const senderName = getSenderName(thread).toLowerCase();
        const subject = thread.subject?.toLowerCase() || '';
        const message = thread.latest_message?.toLowerCase() || '';
        return senderName.includes(query) || subject.includes(query) || message.includes(query);
    });

    const totalUnread = getTotalUnreadCount();

    return (
        <div className="flex flex-col h-full bg-[var(--bg-base)] border-r border-[var(--border-dark)] w-full md:w-[380px] lg:w-[420px] flex-shrink-0">
            {/* Header / Search */}
            <div className="p-4 border-b border-[var(--border-dark)] space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-white">Inbox</h2>
                        {totalUnread > 0 && (
                            <span className="px-2 py-0.5 text-xs font-bold bg-[var(--accent)] text-white rounded-full">
                                {totalUnread}
                            </span>
                        )}
                    </div>
                    <button className="p-2 text-[var(--text-muted)] hover:text-white transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-sm text-white placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                    />
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto scroll-smooth">
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="w-6 h-6 text-[var(--accent)] animate-spin" />
                    </div>
                ) : filteredThreads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-[var(--text-muted)] text-sm">
                        {searchQuery ? 'No messages found' : 'No messages yet'}
                    </div>
                ) : (
                    filteredThreads.map((thread, index) => (
                        <button
                            key={thread.thread_id}
                            onClick={() => onSelect(thread.thread_id)}
                            className={cn(
                                "w-full p-4 border-b border-[var(--border-dark)] flex items-start gap-4 text-left transition-all hover:bg-[var(--bg-hover)] group relative",
                                selectedId === thread.thread_id ? "bg-[var(--bg-elevated)]" : "bg-transparent"
                            )}
                        >
                            {/* Selection Indicator */}
                            {selectedId === thread.thread_id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)]"></div>
                            )}

                            {/* Avatar */}
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                                thread.sender_avatar_url ? '' : getAvatarColor(index)
                            )}>
                                {thread.sender_avatar_url ? (
                                    <img src={thread.sender_avatar_url} alt={getSenderName(thread)} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    getAvatarInitials(thread)
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className={cn(
                                        "text-sm truncate pr-2",
                                        thread.unread_count > 0 ? "font-bold text-white" : "font-semibold text-white/90"
                                    )}>
                                        {getSenderName(thread)}
                                    </span>
                                    <span className={cn(
                                        "text-xs flex-shrink-0",
                                        thread.unread_count > 0 ? "text-[var(--accent)] font-bold" : "text-[var(--text-muted)]"
                                    )}>
                                        {formatTimestamp(thread.latest_message_at)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <p className={cn(
                                        "text-sm truncate flex-1",
                                        thread.unread_count > 0 ? "text-white font-medium" : "text-[var(--text-gray)]"
                                    )}>
                                        {thread.subject || 'No subject'}
                                    </p>
                                    {thread.is_inquiry && thread.inquiry_status && (
                                        <span className={cn(
                                            "text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0",
                                            thread.inquiry_status === 'new' && "bg-blue-500/20 text-blue-400",
                                            thread.inquiry_status === 'read' && "bg-purple-500/20 text-purple-400",
                                            thread.inquiry_status === 'replied' && "bg-green-500/20 text-green-400",
                                            thread.inquiry_status === 'converted' && "bg-yellow-500/20 text-yellow-400",
                                            thread.inquiry_status === 'archived' && "bg-gray-500/20 text-gray-400"
                                        )}>
                                            {getInquiryStatusBadge(thread.inquiry_status)}
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                                    {thread.latest_message}
                                </p>
                            </div>

                            {/* Unread Count Badge */}
                            {thread.unread_count > 0 && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="w-5 h-5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] flex items-center justify-center">
                                        <span className="text-[10px] font-bold text-white">{thread.unread_count}</span>
                                    </div>
                                </div>
                            )}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};
