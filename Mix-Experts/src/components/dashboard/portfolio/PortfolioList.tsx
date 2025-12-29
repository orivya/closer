'use client';

import React from 'react';
import { MoreVertical, Play, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dropdown } from '@/components/ui/Dropdown';

interface PortfolioItem {
    id: string;
    title: string;
    artist: string;
    cover: string;
    beforeUrl?: string; // Optional for list view
    afterUrl?: string;
    plays?: number;
}

interface PortfolioListProps {
    items: PortfolioItem[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const PortfolioList: React.FC<PortfolioListProps> = ({ items, onEdit, onDelete }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="group bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl overflow-hidden hover:border-[var(--accent)] hover:shadow-2xl transition-all duration-300"
                >
                    {/* Cover Art Area */}
                    <div className="aspect-square relative overflow-hidden bg-[var(--bg-elevated)]">
                        <img
                            src={item.cover}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                            <button className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-xl hover:bg-[var(--accent-light)]">
                                <Play className="w-5 h-5 fill-current ml-1" />
                            </button>
                        </div>

                        {/* Top Right Actions */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                                <Dropdown
                                    trigger={
                                        <button className="p-2 text-white hover:text-[var(--accent)] transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    }
                                    items={[
                                        { label: 'Edit Details', icon: Edit, onClick: () => onEdit(item.id) },
                                        { label: 'Delete Project', icon: Trash2, onClick: () => onDelete(item.id), className: 'text-red-400 hover:text-red-300' },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="p-5">
                        <h3 className="text-lg font-bold text-white mb-1 truncate">{item.title}</h3>
                        <p className="text-sm text-[var(--text-muted)] truncate">{item.artist}</p>

                        <div className="mt-4 pt-4 border-t border-[var(--border-dark)] flex items-center justify-between text-xs font-bold text-[var(--text-gray)]">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Published
                            </span>
                            <span>1.2k Plays</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
