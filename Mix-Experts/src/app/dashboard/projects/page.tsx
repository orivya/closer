'use client';

import React, { useEffect, useState } from 'react';
import { ProjectCard, type ProjectProps } from '@/components/dashboard/projects/ProjectCard';
import { Filter, SlidersHorizontal, Plus, FolderOpen, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

// Gradient colors for project cards
const GRADIENT_COLORS = [
    'bg-gradient-to-br from-purple-600 to-blue-600',
    'bg-gradient-to-br from-amber-700 to-orange-500',
    'bg-gradient-to-br from-cyan-500 to-teal-400',
    'bg-gradient-to-br from-slate-700 to-slate-500',
    'bg-gradient-to-br from-pink-600 to-rose-500',
    'bg-gradient-to-br from-green-600 to-emerald-500',
];

export default function ProjectsPage() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<ProjectProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        id,
                        project_name,
                        status,
                        deadline,
                        created_at,
                        profiles!orders_client_id_fkey(display_name)
                    `)
                    .eq('engineer_id', user.id)
                    .neq('status', 'cancelled')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching projects:', error);
                    setProjects([]);
                    return;
                }

                // Transform orders to project format
                const transformedProjects: ProjectProps[] = (data || []).map((order, index) => {
                    // Handle profiles which may be an object or array depending on the join
                    const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
                    return {
                        id: order.id,
                        title: order.project_name || 'Untitled Project',
                        artist: profile?.display_name || 'Unknown Client',
                        coverColor: GRADIENT_COLORS[index % GRADIENT_COLORS.length],
                        status: order.status as ProjectProps['status'],
                        deadline: order.deadline ? new Date(order.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No deadline',
                        progress: getProgressFromStatus(order.status),
                    };
                });

                setProjects(transformedProjects);
            } catch (err) {
                console.error('Error:', err);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
    }, [user]);

    // Helper to calculate progress from status
    function getProgressFromStatus(status: string): number {
        switch (status) {
            case 'pending': return 0;
            case 'accepted': return 10;
            case 'in_progress': return 30;
            case 'mixing': return 50;
            case 'mastering': return 75;
            case 'review': return 90;
            case 'completed': return 100;
            default: return 0;
        }
    }
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                    <p className="text-[var(--text-gray)]">Manage your active sessions and deliverables.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-sm font-medium text-white hover:border-[var(--text-gray)] transition-colors flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-sm font-medium text-white hover:border-[var(--text-gray)] transition-colors flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Sort
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-sm font-bold rounded-lg hover:bg-[var(--accent-light)] transition-all shadow-[0_0_15px_var(--accent-glow)]">
                        <Plus className="w-4 h-4" />
                        <span>New Project</span>
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
                </div>
            )}

            {/* Empty State */}
            {!loading && projects.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center mb-6">
                        <FolderOpen className="w-10 h-10 text-[var(--text-muted)]" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
                    <p className="text-[var(--text-gray)] mb-6 max-w-md">
                        When clients book your services, their projects will appear here.
                        Share your profile to start getting bookings!
                    </p>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-lg hover:bg-[var(--accent-light)] transition-all shadow-[0_0_15px_var(--accent-glow)]">
                        <Plus className="w-5 h-5" />
                        View My Profile
                    </button>
                </div>
            )}

            {/* Project Grid */}
            {!loading && projects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}

                    {/* New Project Placeholder Card */}
                    <button className="group relative h-full min-h-[300px] bg-[var(--bg-base)] border border-dashed border-[var(--border-dark)] rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-[var(--accent)] hover:bg-[var(--bg-elevated)] transition-all duration-300">
                        <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] group-hover:bg-[var(--accent)] text-[var(--accent)] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-xl">
                            <Plus className="w-8 h-8" />
                        </div>
                        <span className="font-bold text-[var(--text-muted)] group-hover:text-white transition-colors">Start New Session</span>
                    </button>
                </div>
            )}
        </div>
    );
}
