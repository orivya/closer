'use client';

import React from 'react';
import { ProjectRevisions, RevisionRequest } from '@/lib/types';
import { Clock, CheckCircle, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RevisionTrackerProps {
    revisions: ProjectRevisions;
    onViewRequest: (request: RevisionRequest) => void;
    onRequestNew: () => void;
}

export const RevisionTracker: React.FC<RevisionTrackerProps> = ({ revisions, onViewRequest, onRequestNew }) => {
    const remaining = revisions.includedRevisions - revisions.usedRevisions;
    const isLimitReached = remaining <= 0;

    return (
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl overflow-hidden">
            {/* Header / Stats */}
            <div className="p-6 border-b border-[var(--border-dark)] flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white">Revisions</h3>
                    <p className="text-sm text-[var(--text-muted)]">Track changes and feedback</p>
                </div>
                <div className="text-right">
                    <div className={cn(
                        "text-2xl font-bold",
                        remaining > 0 ? "text-[var(--accent)]" : "text-orange-400"
                    )}>
                        {revisions.usedRevisions} / {revisions.includedRevisions}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-wider">Used</p>
                </div>
            </div>

            {/* List */}
            <div className="divide-y divide-[var(--border-dark)]">
                {revisions.revisions.length === 0 ? (
                    <div className="p-8 text-center text-[var(--text-gray)]">
                        No revisions requested yet.
                    </div>
                ) : (
                    revisions.revisions.map((req) => (
                        <div
                            key={req.id}
                            onClick={() => onViewRequest(req)}
                            className="p-4 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border",
                                    req.status === 'completed'
                                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                                        : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                )}>
                                    {req.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Revision #{req.revisionNumber}</h4>
                                    <p className="text-xs text-[var(--text-muted)] line-clamp-1">{req.notes}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-[var(--text-gray)]">
                                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(req.requestedAt))}
                                </span>
                                <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-[var(--bg-base)] border-t border-[var(--border-dark)]">
                <button
                    onClick={onRequestNew}
                    className={cn(
                        "w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                        isLimitReached
                            ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20"
                            : "bg-[var(--bg-elevated)] text-[var(--text-gray)] border border-[var(--border-dark)] hover:bg-[var(--bg-hover)] hover:text-white"
                    )}
                >
                    {isLimitReached ? (
                        <>
                            <AlertCircle className="w-4 h-4" />
                            Request Extra Revision (+${revisions.extraRevisionPrice})
                        </>
                    ) : (
                        <>
                            <FileText className="w-4 h-4" />
                            Request New Revision
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
