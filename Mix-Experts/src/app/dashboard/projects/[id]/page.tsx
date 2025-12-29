'use client';

import React, { useState } from 'react';
import { ProjectHeader } from '@/components/dashboard/projects/ProjectHeader';
import { AudioPlayer } from '@/components/dashboard/projects/AudioPlayer';
import { CommentThread, Comment } from '@/components/dashboard/projects/CommentThread';
import { Dropdown } from '@/components/ui/Dropdown';
import { FileAudio, Info, MoreVertical, Download, Tag, FileText, Share2, CheckCircle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ProjectProps } from '@/components/dashboard/projects/ProjectCard';
import { StatusTimeline } from '@/components/dashboard/projects/StatusTimeline';
import { OrderStatus } from '@/lib/types';

// Mock Data
const PROJECT: ProjectProps = {
    id: '1',
    title: 'Neon Lights EP',
    artist: 'Sarah Vocalist',
    coverColor: 'bg-gradient-to-br from-purple-600 to-blue-600',
    status: 'mixing', // Lowercase to match OrderStatus
    deadline: 'Dec 30',
    progress: 65,
};

const INITIAL_COMMENTS: Comment[] = [
    { id: '1', author: 'Sarah Vocalist', avatar: 'SV', timestamp: '0:45', text: 'Love the reverb here, but can we bring the vocal up 1db?', createdAt: '2h ago' },
    { id: '2', author: 'Sarah Vocalist', avatar: 'SV', timestamp: '1:20', text: 'The snare feels a bit too punchy here. Maybe soften the transient?', createdAt: '2h ago' },
    { id: '3', author: 'James Mix', avatar: 'JM', timestamp: '2:15', text: 'Added that delay throw you asked for. Let me know if it fights with the guitar.', createdAt: '1h ago' },
];

const FILES = [
    { id: 1, name: 'Neon_Lights_Mix_v3.wav', size: '42 MB', type: 'wav', date: 'Today' },
    { id: 2, name: 'Neon_Lights_Mix_v2.wav', size: '42 MB', type: 'wav', date: 'Yesterday' },
    { id: 3, name: 'Neon_Lights_Mix_v1.mp3', size: '8 MB', type: 'mp3', date: '2 days ago' },
];

// Mock Revisions Data
const INITIAL_REVISIONS = {
    projectId: '1',
    includedRevisions: 2,
    usedRevisions: 1,
    extraRevisionPrice: 50,
    revisions: [
        {
            id: 'r1',
            projectId: '1',
            revisionNumber: 1,
            requestedAt: new Date('2024-12-21T10:00:00'),
            requestedBy: 'Sarah Vocalist',
            notes: 'Vocals are a bit too loud in the bridge.',
            status: 'completed' as const,
        }
    ]
};

import { RevisionTracker } from '@/components/dashboard/projects/RevisionTracker';
import { RevisionRequestForm } from '@/components/dashboard/projects/RevisionRequestForm';
import { ProjectRevisions } from '@/lib/types';

export default function ProjectWorkspacePage({ params }: { params: { id: string } }) {
    const [comments, setComments] = useState(INITIAL_COMMENTS);
    const [activeFile, setActiveFile] = useState(FILES[0]);
    const [status, setStatus] = useState<OrderStatus>('mixing');
    const [revisions, setRevisions] = useState<ProjectRevisions>(INITIAL_REVISIONS);
    const [showRevisionForm, setShowRevisionForm] = useState(false);

    const handleAddComment = (text: string, timestamp: string) => {
        const newComment: Comment = {
            id: Math.random().toString(),
            author: 'James Mix', // Current User
            avatar: 'JM',
            timestamp: timestamp || '0:00',
            text: text,
            createdAt: 'Just now'
        };
        setComments([newComment, ...comments]);
    };

    const handleStatusUpdate = (newStatus: OrderStatus) => {
        setStatus(newStatus);
        // In a real app, this would trigger an API call
    };

    const handleRevisionSubmit = (data: { notes: string; timestamps: any[] }) => {
        const newRevisionNumber = revisions.usedRevisions + 1;
        const newRevision = {
            id: Math.random().toString(),
            projectId: PROJECT.id,
            revisionNumber: newRevisionNumber,
            requestedAt: new Date(),
            requestedBy: 'Sarah Vocalist',
            notes: data.notes,
            timestamps: data.timestamps,
            status: 'pending' as const
        };

        setRevisions({
            ...revisions,
            usedRevisions: newRevisionNumber,
            revisions: [newRevision, ...revisions.revisions]
        });
        setShowRevisionForm(false);
        setStatus('revision_requested');
    };

    return (
        <div className="-m-8 pb-12 relative">

            {showRevisionForm && (
                <RevisionRequestForm
                    revisionNumber={revisions.usedRevisions + 1}
                    price={revisions.usedRevisions >= revisions.includedRevisions ? revisions.extraRevisionPrice : undefined}
                    onCancel={() => setShowRevisionForm(false)}
                    onSubmit={handleRevisionSubmit}
                />
            )}

            <ProjectHeader project={{ ...PROJECT, status: status }} />

            <div className="max-w-[1600px] mx-auto px-8 py-8 space-y-8">

                {/* 0. STATUS TIMELINE (New) */}
                <StatusTimeline
                    currentStatus={status}
                    userRole="engineer"
                    history={[
                        { status: 'received', updatedAt: new Date('2024-12-20'), updatedBy: 'system' },
                        { status: 'in_progress', updatedAt: new Date('2024-12-21'), updatedBy: 'engineer' },
                        { status: 'mixing', updatedAt: new Date('2024-12-22'), updatedBy: 'engineer' }
                    ]}
                />

                {/* Main Workspace Layout */}
                <div className="grid grid-cols-12 gap-8">

                    {/* Left Column: Player & Files (8 cols) */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        {/* 1. HERO AUDIO PLAYER */}
                        <AudioPlayer
                            trackName={activeFile.name}
                            artistName={PROJECT.artist}
                            duration="3:45"
                            onCommentAdd={(time) => {
                                console.log('Focus comment input for time:', time);
                            }}
                        />

                        {/* 2. FILE VERSIONS */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <FileAudio className="w-5 h-5 text-[var(--accent)]" />
                                    Mix Versions
                                </h3>
                                <button className="text-xs font-bold text-[var(--accent)] hover:underline">View All Files</button>
                            </div>
                            <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl overflow-hidden">
                                {FILES.map((file) => (
                                    <div
                                        key={file.id}
                                        onClick={() => setActiveFile(file)}
                                        className={cn(
                                            "flex items-center justify-between p-4 border-b border-[var(--border-dark)] last:border-0 transition-colors cursor-pointer",
                                            activeFile.id === file.id ? "bg-[var(--accent)]/10" : "hover:bg-[var(--bg-hover)]"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-dark)] flex items-center justify-center text-[var(--text-muted)] font-bold uppercase text-xs">
                                                {file.type}
                                            </div>
                                            <div>
                                                <p className={cn("font-bold text-sm", activeFile.id === file.id ? "text-[var(--accent)]" : "text-white")}>
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-[var(--text-muted)]">{file.size} • {file.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {activeFile.id === file.id && <span className="text-xs font-bold text-[var(--accent)] mr-2">Now Playing</span>}
                                            <button className="p-2 text-[var(--text-muted)] hover:text-white transition-colors">
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-[var(--text-muted)] hover:text-white transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Feedback & Metadata (4 cols) */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">

                        {/* 1. REVISION TRACKER (New) */}
                        <RevisionTracker
                            revisions={revisions}
                            onViewRequest={(req) => console.log('View request', req)}
                            onRequestNew={() => setShowRevisionForm(true)}
                        />

                        {/* 2. FEEDBACK THREAD (Connected to Player) */}
                        <div className="h-[500px]">
                            <CommentThread
                                comments={comments}
                                onSeek={(timestamp) => console.log('Seek to', timestamp)}
                                onAddComment={(text) => handleAddComment(text, '0:00')} // Default 0:00 for manual entry
                            />
                        </div>

                        {/* 3. PROJECT META & ACTIONS */}
                        <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[var(--text-muted)]">Status</span>
                                    <span className={cn(
                                        "px-3 py-1 text-xs font-bold rounded-full border",
                                        status === 'completed' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    )}>
                                        {status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[var(--text-muted)]">Deadline</span>
                                    <span className="text-sm font-bold text-white">Dec 30, 2024</span>
                                </div>

                                {/* Status Actions */}
                                <div className="pt-4 border-t border-[var(--border-dark)] space-y-2">
                                    {status === 'mixing' && (
                                        <button
                                            onClick={() => handleStatusUpdate('review')}
                                            className="w-full py-3 bg-[var(--accent)] text-white font-bold rounded-xl shadow-lg hover:bg-[var(--accent-light)] transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Send for Review
                                        </button>
                                    )}
                                    {status === 'review' && (
                                        <button
                                            onClick={() => handleStatusUpdate('completed')}
                                            className="w-full py-3 bg-[var(--accent)] text-white font-bold rounded-xl shadow-lg hover:bg-[var(--accent-light)] transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Mark as Complete
                                        </button>
                                    )}
                                    {status === 'completed' && (
                                        <button
                                            onClick={() => handleStatusUpdate('delivered')}
                                            className="w-full py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Package className="w-4 h-4" />
                                            Deliver Files
                                        </button>
                                    )}

                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <button className="flex items-center justify-center gap-2 py-2 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-lg text-xs font-bold text-white hover:bg-[var(--bg-hover)]">
                                            <FileText className="w-3 h-3" />
                                            Invoice
                                        </button>
                                        <button className="flex items-center justify-center gap-2 py-2 bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-lg text-xs font-bold text-white hover:bg-[var(--bg-hover)]">
                                            <Share2 className="w-3 h-3" />
                                            Share
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
