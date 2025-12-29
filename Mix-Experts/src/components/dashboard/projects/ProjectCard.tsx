'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Clock, Calendar, Edit2, Share2, Archive } from 'lucide-react';
import { OrderStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Dropdown } from '@/components/ui/Dropdown';

export interface ProjectProps {
    id: string;
    title: string;
    artist: string;
    coverColor: string; // Mocking cover art with colors for now
    status: OrderStatus;
    deadline: string;
    progress: number;
}

const statusColors: Record<OrderStatus, string> = {
    'pending_payment': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    'payment_processing': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    'paid': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'received': 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    'in_progress': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    'mixing': 'text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/20',
    'mastering': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    'review': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    'revision_requested': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'revision_in_progress': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'pending_approval': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    'completed': 'text-green-400 bg-green-400/10 border-green-400/20',
    'delivered': 'text-green-500 bg-green-500/10 border-green-500/20',
    'cancelled': 'text-red-400 bg-red-400/10 border-red-400/20',
    'refunded': 'text-red-400 bg-red-400/10 border-red-400/20',
};

export const ProjectCard: React.FC<{ project: ProjectProps }> = ({ project }) => {
    return (
        <Link
            href={`/dashboard/projects/${project.id}`}
            className="group relative bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-3xl hover:border-[var(--accent)] hover:shadow-[0_0_30px_rgba(201,149,108,0.1)] transition-all duration-300 flex flex-col"
        >
            {/* Cover Art Area - Wrapped to clip only the top corners */}
            <div className={cn("h-48 relative overflow-hidden rounded-t-[1.4rem]", project.coverColor)}>
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] to-transparent opacity-60"></div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-90 group-hover:scale-100">
                    <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                        <Play className="w-6 h-6 text-white fill-current ml-1" />
                    </div>
                </div>

                {/* Status Badge */}
                <div className={cn(
                    "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md",
                    statusColors[project.status]
                )}>
                    {project.status.replace('_', ' ')}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-[var(--accent)] transition-colors line-clamp-1">{project.title}</h3>
                        <p className="text-sm text-[var(--text-gray)]">{project.artist}</p>
                    </div>
                    <div onClick={(e) => e.preventDefault()}>
                        <Dropdown
                            items={[
                                { label: 'Edit Details', onClick: () => console.log('Edit', project.id), icon: Edit2 },
                                { label: 'Share Project', onClick: () => console.log('Share', project.id), icon: Share2 },
                                { label: 'Archive', onClick: () => console.log('Archive', project.id), icon: Archive, className: 'text-red-400 hover:bg-red-400/10 hover:text-red-300' },
                            ]}
                        />
                    </div>
                </div>

                <div className="mt-auto space-y-4 pt-4">
                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="text-[var(--text-muted)] font-medium">Progress</span>
                            <span className="text-white font-bold">{project.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-[var(--text-gray)]">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Due {project.deadline}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>2h ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
