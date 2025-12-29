import React from 'react';
import { cn } from '@/lib/utils';

interface DataPoint {
    label: string;
    value: number;
    color?: string;
}

interface SimpleBarChartProps {
    data: DataPoint[];
    maxHeight?: number;
    showValue?: boolean;
}

export const SimpleBarChart = ({ data, maxHeight = 100, showValue = true }: SimpleBarChartProps) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="flex items-end justify-between gap-2 h-full w-full min-h-[200px] pt-8">
            {data.map((point, i) => {
                const heightPercentage = (point.value / maxValue) * 100;
                return (
                    <div key={i} className="flex flex-col items-center flex-1 gap-2 group cursor-pointer">
                        {/* Tooltip-ish Value */}
                        {showValue && (
                            <span className="text-xs font-bold text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity transform -translate-y-2 group-hover:translate-y-0 duration-200">
                                {point.value}
                            </span>
                        )}

                        {/* Bar */}
                        <div
                            className={cn(
                                "w-full rounded-t-lg transition-all duration-500 hover:opacity-80 relative overflow-hidden",
                                point.color || "bg-[var(--accent)]"
                            )}
                            style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Label */}
                        <span className="text-[10px] sm:text-xs text-[var(--text-muted)] group-hover:text-white transition-colors truncate max-w-full">
                            {point.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
