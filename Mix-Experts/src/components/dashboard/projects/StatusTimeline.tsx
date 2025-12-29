'use client';

import React from 'react';
import { Check, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OrderStatus, ProjectStatusEntry } from '@/lib/types';

interface StatusTimelineProps {
    currentStatus: OrderStatus;
    history?: ProjectStatusEntry[];
    userRole: 'engineer' | 'client';
}

const STEPS: { id: OrderStatus; label: string }[] = [
    { id: 'received', label: 'Received' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'mixing', label: 'Mixing' },
    { id: 'review', label: 'Review' },
    { id: 'completed', label: 'Completed' },
    { id: 'delivered', label: 'Delivered' }
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, history = [], userRole }) => {

    const getCurrentStepIndex = () => {
        return STEPS.findIndex(s => s.id === currentStatus);
    };

    const currentStepIndex = getCurrentStepIndex();

    // Helper to find date for a specific status from history
    const getDateForStatus = (status: OrderStatus) => {
        const entry = history.find(h => h.status === status);
        if (!entry) return null;

        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(new Date(entry.updatedAt));
    };

    return (
        <div className="w-full py-8">
            <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-[var(--bg-elevated)]" />

                {/* Progress Bar Active */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-[var(--accent)] transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                    {STEPS.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const date = getDateForStatus(step.id);

                        return (
                            <div key={step.id} className="flex flex-col items-center group">
                                {/* Node */}
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all z-10",
                                        isCompleted
                                            ? "bg-[var(--accent)] border-[var(--bg-base)] text-white shadow-[0_0_15px_-3px_var(--accent-glow)]"
                                            : "bg-[var(--bg-base)] border-[var(--bg-elevated)] text-[var(--text-muted)] group-hover:border-[var(--text-gray)]"
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <Circle className="w-4 h-4" />
                                    )}
                                </div>

                                {/* Label */}
                                <div className="mt-4 text-center">
                                    <div className={cn(
                                        "text-sm font-bold transition-colors",
                                        isCurrent ? "text-white" : "text-[var(--text-gray)]"
                                    )}>
                                        {step.label}
                                    </div>
                                    {date && (
                                        <div className="text-[10px] text-[var(--text-muted)] mt-1 flex items-center justify-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {date}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Status Description / Current Action Context */}
            <div className="mt-8 p-4 bg-[var(--bg-elevated)]/50 rounded-xl border border-[var(--border-dark)] text-center">
                <p className="text-sm text-[var(--text-gray)]">
                    Current Status: <span className="text-[var(--accent)] font-bold uppercase">{currentStatus.replace('_', ' ')}</span>
                </p>
            </div>
        </div>
    );
};
