import React from 'react';
import { Clock, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TurnaroundOptionType = 'standard' | 'rush' | 'priority';

export interface TurnaroundOption {
    id: TurnaroundOptionType;
    name: string;
    days: string;
    price: number;
    multiplier?: number;
}

interface TurnaroundSelectorProps {
    options: TurnaroundOption[];
    selectedId: TurnaroundOptionType;
    onSelect: (id: TurnaroundOptionType) => void;
}

export const TurnaroundSelector: React.FC<TurnaroundSelectorProps> = ({
    options,
    selectedId,
    onSelect
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Turnaround Time</h3>
            <div className="grid grid-cols-1 gap-3">
                {options.map((option) => {
                    const isSelected = selectedId === option.id;
                    const Icon = option.id === 'priority' ? Star : option.id === 'rush' ? Zap : Clock;

                    return (
                        <div
                            key={option.id}
                            onClick={() => onSelect(option.id)}
                            className={cn(
                                "relative p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-center justify-between group",
                                isSelected
                                    ? "bg-[var(--accent)]/10 border-[var(--accent)]"
                                    : "bg-[var(--bg-elevated)] border-[var(--border-dark)] hover:border-[var(--text-gray)]"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                    isSelected ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-base)] text-[var(--text-gray)] group-hover:text-white"
                                )}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-white">{option.name}</div>
                                    <div className="text-xs text-[var(--text-muted)]">{option.days} Delivery</div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-bold text-white">
                                    {option.price > 0 ? `+$${option.price}` : 'Base'}
                                </div>
                                {option.multiplier && (
                                    <div className="text-xs text-[var(--text-muted)]">
                                        {option.multiplier}x Rate
                                    </div>
                                )}
                            </div>

                            {/* Selection Ring */}
                            <div className={cn(
                                "absolute inset-0 rounded-xl border-2 pointer-events-none transition-all",
                                isSelected ? "border-[var(--accent)]" : "border-transparent"
                            )} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
