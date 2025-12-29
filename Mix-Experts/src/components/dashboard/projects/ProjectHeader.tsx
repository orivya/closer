'use client';

import React from 'react';
import { Calendar, Clock, DollarSign, Download, Share2, ArrowLeft, Settings, Users, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ProjectProps } from './ProjectCard';
import { Dropdown } from '@/components/ui/Dropdown';

interface ProjectHeaderProps {
    project: ProjectProps;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
    return (
        <div className="relative w-full bg-[var(--bg-elevated)] border-b border-[var(--border-dark)] overflow-hidden">
            {/* Background Blur Effect */}
            <div className={cn("absolute inset-0 opacity-10 blur-3xl", project.coverColor)}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-elevated)] via-[var(--bg-elevated)]/90 to-transparent"></div>

            <div className="relative z-10 p-8 max-w-[1600px] mx-auto">
                <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-sm text-[var(--text-gray)] hover:text-white transition-colors mb-6 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </Link>

                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                    <div className="flex items-end gap-6">
                        {/* Cover Art */}
                        <div className={cn("w-32 h-32 rounded-2xl shadow-2xl flex-shrink-0 border border-white/10", project.coverColor)}></div>

                        {/* Title & Info */}
                        <div className="mb-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--accent)] text-white shadow-[0_0_15px_var(--accent-glow)]">
                                    {project.status}
                                </span>
                                <span className="text-[var(--text-muted)] text-sm">EP Production</span>
                            </div>
                            <h1 className="text-4xl font-bold text-white mb-2">{project.title}</h1>
                            <p className="text-lg text-[var(--text-gray)] font-medium">{project.artist}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-dark)] text-white rounded-xl hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-2 font-medium">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                        <button className="px-5 py-2.5 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            <Download className="w-4 h-4" />
                            Download Assets
                        </button>
                        <Dropdown
                            items={[
                                { label: 'Project Settings', onClick: () => console.log('Settings'), icon: Settings },
                                { label: 'Manage Access', onClick: () => console.log('Access'), icon: Users },
                                { label: 'Delete Project', onClick: () => console.log('Delete'), icon: Trash2, className: 'text-red-400 hover:bg-red-400/10 hover:text-red-300' },
                            ]}
                        />
                    </div>
                </div>

                {/* Metadata Strip */}
                <div className="flex items-center gap-8 mt-8 pt-6 border-t border-white/5 text-sm">
                    <div className="flex items-center gap-2 text-[var(--text-gray)]">
                        <Calendar className="w-4 h-4 text-[var(--accent)]" />
                        <span>Started Dec 12, 2024</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-gray)]">
                        <Clock className="w-4 h-4 text-[var(--accent)]" />
                        <span>Deadline: {project.deadline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-gray)]">
                        <DollarSign className="w-4 h-4 text-[var(--accent)]" />
                        <span>Budget: $1,200</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
