'use client';

import React, { useState } from 'react';
import { ServiceList } from '@/components/dashboard/services/ServiceList';
import { ServiceEditor } from '@/components/dashboard/services/ServiceEditor';
import { useServices } from '@/hooks/useServices';
import { ServiceWithDetails } from '@/lib/database.types';
import { Mic2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ServicesPage() {
    const { services, loading, error, refetch } = useServices();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceWithDetails | null>(null);
    const [saving, setSaving] = useState(false);

    const handleCreate = () => {
        setEditingService(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (service: ServiceWithDetails) => {
        setEditingService(service);
        setIsEditorOpen(true);
    };

    const handleSave = async (serviceData: any) => {
        try {
            setSaving(true);

            const url = editingService
                ? `/api/services/${editingService.id}`
                : '/api/services';

            const method = editingService ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save service');
            }

            toast.success(editingService ? 'Service updated successfully' : 'Service created successfully');
            setIsEditorOpen(false);
            refetch();
        } catch (err) {
            console.error('Error saving service:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to save service');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            setSaving(true);

            const response = await fetch(`/api/services/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete service');
            }

            toast.success('Service deleted successfully');
            setIsEditorOpen(false);
            refetch();
        } catch (err) {
            console.error('Error deleting service:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to delete service');
        } finally {
            setSaving(false);
        }
    };

    if (error) {
        return (
            <div className="max-w-[1600px] mx-auto space-y-8">
                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <h3 className="text-lg font-bold text-red-400 mb-2">Error Loading Services</h3>
                    <p className="text-red-300">{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">
                        <Mic2 className="w-6 h-6" />
                    </div>
                    Services
                </h1>
                <p className="text-[var(--text-gray)]">Manage your service packages and pricing.</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
                </div>
            )}

            {/* List */}
            {!loading && (
                <ServiceList
                    services={services}
                    onEdit={handleEdit}
                    onCreate={handleCreate}
                />
            )}

            {/* Editor Modal */}
            {isEditorOpen && (
                <ServiceEditor
                    service={editingService}
                    onSave={handleSave}
                    onCancel={() => setIsEditorOpen(false)}
                    onDelete={handleDelete}
                    saving={saving}
                />
            )}
        </div>
    );
}
