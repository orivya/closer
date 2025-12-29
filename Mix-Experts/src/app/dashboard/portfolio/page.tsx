'use client';

import React, { useState } from 'react';
import { Plus, Music2 } from 'lucide-react';
import { PortfolioList } from '@/components/dashboard/portfolio/PortfolioList';
import { AddProjectModal } from '@/components/dashboard/portfolio/AddProjectModal';

// Mock Data
const INITIAL_ITEMS = [
    {
        id: '1',
        title: 'Neon Lights',
        artist: 'Sarah Vocalist',
        cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=500&fit=crop',
    },
    {
        id: '2',
        title: 'Midnight Drive',
        artist: 'The Night Shift',
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
    },
    {
        id: '3',
        title: 'Urban Soul',
        artist: 'Marcus V',
        cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop',
    }
];

export default function PortfolioControllerPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [items, setItems] = useState(INITIAL_ITEMS);

    const handleSaveProject = (project: any) => {
        if (items.find(i => i.id === project.id)) {
            // Update existing
            setItems(items.map(i => i.id === project.id ? { ...i, ...project } : i));
        } else {
            // Add new
            setItems([project, ...items]);
        }
        setEditingProject(null);
    };

    const handleEditProject = (id: string) => {
        const project = items.find(i => i.id === id);
        if (project) {
            setEditingProject(project);
            setIsAddModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setEditingProject(null);
    };

    const handleDeleteProject = (id: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                            <Music2 className="w-6 h-6" />
                        </div>
                        Portfolio Manager
                    </h1>
                    <p className="text-[var(--text-gray)]">Showcase your best work with Before & After comparisons.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all shadow-[0_0_20px_var(--accent-glow)] hover:scale-105"
                >
                    <Plus className="w-5 h-5" />
                    Add Project
                </button>
            </div>

            {/* Grid */}
            <PortfolioList
                items={items}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
            />

            {/* Empty State Help */}
            {items.length === 0 && (
                <div className="w-full h-64 border-2 border-dashed border-[var(--border-dark)] rounded-3xl flex flex-col items-center justify-center text-[var(--text-muted)] gap-4">
                    <p className="font-medium">No projects yet. Add your first showcase!</p>
                </div>
            )}

            {/* Modals */}
            <AddProjectModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveProject}
                initialData={editingProject}
            />
        </div>
    );
}
