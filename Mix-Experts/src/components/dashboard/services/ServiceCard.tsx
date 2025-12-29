'use client';

import React from 'react';
import { MoreHorizontal, Clock, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ServiceWithDetails } from '@/lib/database.types';

interface ServiceCardProps {
    service: ServiceWithDetails;
    onEdit: (service: ServiceWithDetails) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onEdit }) => {
    return (
        <article
            className="group relative bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl p-6 hover:border-[var(--accent)] transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-[var(--accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-base)]"
            onClick={() => onEdit(service)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEdit(service);
                }
            }}
            aria-label={`${service.name} - $${service.base_price} - ${service.turnaround_days} days turnaround ${service.is_active ? '' : '(Inactive)'}`}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-[var(--accent)] transition-colors">{service.name}</h3>
                        {/* Status Badge */}
                        <div
                            className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                service.is_active
                                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                                    : "bg-gray-500/10 border-gray-500/20 text-gray-400"
                            )}
                            role="status"
                            aria-label={service.is_active ? 'Service is active' : 'Service is inactive'}
                        >
                            {service.is_active ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white">${service.base_price}</p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Add dropdown menu handler here
                    }}
                    className="p-2 -mr-2 -mt-2 text-[var(--text-muted)] hover:text-white rounded-full hover:bg-[rgba(255,255,255,0.05)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-card)]"
                    aria-label={`More options for ${service.name}`}
                >
                    <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
                </button>
            </div>

            {/* Description */}
            <p className="text-sm text-[var(--text-gray)] line-clamp-2 mb-6 h-10">
                {service.description}
            </p>

            {/* Footer Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-dark)] text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{service.turnaround_days} days</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                    <span>{service.features?.length || 0} Features</span>
                </div>
            </div>
        </article>
    );
};
