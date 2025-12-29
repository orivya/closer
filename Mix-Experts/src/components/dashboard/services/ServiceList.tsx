'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { ServiceWithDetails } from '@/lib/database.types';

interface ServiceListProps {
    services: ServiceWithDetails[];
    onEdit: (service: ServiceWithDetails) => void;
    onCreate: () => void;
}

export const ServiceList: React.FC<ServiceListProps> = ({ services, onEdit, onCreate }) => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Card */}
            <button
                onClick={onCreate}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-[var(--border-dark)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[var(--accent)] transition-all duration-300 min-h-[200px]"
            >
                <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_var(--accent-glow)]">
                    <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">New Service</h3>
                <p className="text-sm text-[var(--text-muted)]">Add a new package</p>
            </button>

            {/* Existing Services */}
            {services.map((service) => (
                <ServiceCard key={service.id} service={service} onEdit={onEdit} />
            ))}
        </div>
    );
};
