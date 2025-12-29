import React from 'react';
import { Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AddOn {
    id: string;
    name: string;
    price: number;
    description?: string;
}

interface AddOnSelectorProps {
    addOns: AddOn[];
    selectedIds: string[];
    onToggle: (id: string) => void;
}

export const AddOnSelector: React.FC<AddOnSelectorProps> = ({
    addOns,
    selectedIds,
    onToggle
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recommended Add-Ons</h3>
            <div className="space-y-2">
                {addOns.map((addon) => {
                    const isSelected = selectedIds.includes(addon.id);

                    return (
                        <div
                            key={addon.id}
                            onClick={() => onToggle(addon.id)}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:bg-[var(--bg-elevated)]",
                                isSelected
                                    ? "bg-[var(--bg-elevated)] border-[var(--accent)]"
                                    : "bg-transparent border-[var(--border-dark)]"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-5 h-5 rounded border flex items-center justify-center transition-all",
                                    isSelected
                                        ? "bg-[var(--accent)] border-[var(--accent)]"
                                        : "border-[var(--text-muted)]"
                                )}>
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">{addon.name}</div>
                                    {addon.description && (
                                        <div className="text-xs text-[var(--text-muted)]">{addon.description}</div>
                                    )}
                                </div>
                            </div>
                            <div className="font-bold text-white text-sm">
                                +${addon.price}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
