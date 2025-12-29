'use client';

import React, { useState } from 'react';
import { MoreHorizontal, Loader2, Download, User, Archive, Trash2, Tag } from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useThread } from '@/hooks/useThread';
import { useAuth } from '@/contexts/AuthContext';
import { ReplyComposer } from './ReplyComposer';
import { InquiryStatus } from '@/types/messages';
import { toast } from 'sonner';

interface InboxThreadProps {
    id: string | null;
}

function formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
        return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    }
}

function getAvatarInitials(name: string | null | undefined, email: string | null | undefined): string {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return '?';
}

export const InboxThread: React.FC<InboxThreadProps> = ({ id }) => {
    const { user } = useAuth();
    const { messages, loading, updateInquiryStatus, archiveThread, deleteThread, refetch } = useThread(id);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    if (!id) {
        return (
            <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] bg-[var(--bg-elevated)]/30">
                Select a conversation to start reading
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[var(--bg-elevated)]/30">
                <Loader2 className="w-6 h-6 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] bg-[var(--bg-elevated)]/30">
                No messages in this thread
            </div>
        );
    }

    const firstMessage = messages[0];
    const isInquiry = firstMessage.is_inquiry;
    const inquiryStatus = firstMessage.inquiry_status;

    const otherParticipant = firstMessage.sender_id === user?.id
        ? firstMessage.recipient_profile
        : firstMessage.sender_profile || {
            username: null,
            display_name: firstMessage.sender_name,
            avatar_url: null
        };

    const recipientId = firstMessage.sender_id === user?.id
        ? firstMessage.recipient_id
        : firstMessage.sender_id || firstMessage.recipient_id;

    const handleStatusChange = async (status: InquiryStatus) => {
        setUpdatingStatus(true);
        try {
            await updateInquiryStatus(status);
            toast.success(`Inquiry marked as ${status}`);
        } catch (error) {
            toast.error('Failed to update inquiry status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleArchive = async () => {
        try {
            await archiveThread();
            toast.success('Thread archived');
        } catch (error) {
            toast.error('Failed to archive thread');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this conversation? This cannot be undone.')) {
            return;
        }
        try {
            await deleteThread();
            toast.success('Thread deleted');
        } catch (error) {
            toast.error('Failed to delete thread');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-elevated)]/30 w-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-dark)] bg-[var(--bg-base)]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold overflow-hidden">
                        {otherParticipant?.avatar_url ? (
                            <img src={otherParticipant.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            getAvatarInitials(otherParticipant?.display_name, firstMessage.sender_email)
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-white leading-none mb-1 truncate">
                            {otherParticipant?.display_name || firstMessage.sender_name || otherParticipant?.username || 'Unknown'}
                        </h2>
                        <p className="text-xs text-[var(--text-gray)] truncate">{firstMessage.subject || 'No subject'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isInquiry && (
                        <div className="flex items-center gap-2 mr-2">
                            <select
                                value={inquiryStatus || 'new'}
                                onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
                                disabled={updatingStatus}
                                className="text-xs px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded text-white focus:outline-none focus:border-[var(--accent)] disabled:opacity-50"
                            >
                                <option value="new">New</option>
                                <option value="read">Read</option>
                                <option value="replied">Replied</option>
                                <option value="converted">Converted</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    )}
                    <div className="w-px h-6 bg-[var(--border-dark)]"></div>
                    <Dropdown
                        align="right"
                        items={[
                            { label: 'Archive Thread', onClick: handleArchive, icon: Archive },
                            { label: 'Delete Thread', onClick: handleDelete, icon: Trash2, className: 'text-red-400 hover:bg-red-400/10 hover:text-red-300' },
                        ]}
                    />
                </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => {
                    const isCurrentUser = msg.sender_id === user?.id;
                    const senderProfile = isCurrentUser ? user : msg.sender_profile;
                    const senderName = isCurrentUser
                        ? 'You'
                        : msg.sender_profile?.display_name || msg.sender_name || msg.sender_profile?.username || 'Unknown';

                    return (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-4 max-w-[80%]",
                                isCurrentUser ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            {/* Avatar (Only for others) */}
                            {!isCurrentUser && (
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1 overflow-hidden">
                                    {msg.sender_profile?.avatar_url ? (
                                        <img src={msg.sender_profile.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        getAvatarInitials(msg.sender_name, msg.sender_email)
                                    )}
                                </div>
                            )}

                            <div className={cn(
                                "space-y-1",
                                isCurrentUser ? "items-end flex flex-col" : "items-start flex flex-col"
                            )}>
                                {/* Sender name for guest senders */}
                                {!isCurrentUser && !msg.sender_id && (
                                    <div className="text-xs text-[var(--text-muted)] px-1">
                                        {senderName}
                                        {msg.sender_email && (
                                            <span className="ml-1">({msg.sender_email})</span>
                                        )}
                                    </div>
                                )}

                                {/* The Bubble */}
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap break-words",
                                    isCurrentUser
                                        ? "bg-[var(--accent)] text-white rounded-tr-none"
                                        : "bg-[var(--bg-card)] border border-[var(--border-dark)] text-[var(--text-gray)] rounded-tl-none"
                                )}>
                                    {msg.content}
                                </div>

                                {/* Attachments */}
                                {msg.attachments && msg.attachments.length > 0 && (
                                    <div className="space-y-2 mt-2 w-full">
                                        {msg.attachments.map((attachment, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl group hover:border-[var(--accent)] transition-colors cursor-pointer">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-8 h-8 bg-[var(--bg-elevated)] rounded-lg flex items-center justify-center text-[var(--text-muted)]">
                                                        <Download className="w-4 h-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">{attachment}</p>
                                                    </div>
                                                </div>
                                                <button className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Timestamp */}
                                <span className="text-[10px] text-[var(--text-muted)] px-1">
                                    {formatMessageTime(msg.created_at)}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Reply Composer */}
            <ReplyComposer
                threadId={id}
                recipientId={recipientId}
                onSent={refetch}
            />
        </div>
    );
};
