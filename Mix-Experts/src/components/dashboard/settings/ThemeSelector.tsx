'use client';

import React from 'react';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { THEMES } from '@/lib/constants';
import { ThemeName } from '@/lib/types';

interface ThemeSelectorProps {
    currentTheme: ThemeName;
    onThemeSelect: (theme: ThemeName) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeSelect }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-[var(--bg-elevated)] text-[var(--accent)] border border-[var(--border-dark)]">
                    <Palette className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Color Theme</h3>
                    <p className="text-sm text-[var(--text-gray)]">Select the accent color for your public profile.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(Object.entries(THEMES) as [ThemeName, typeof THEMES[ThemeName]][]).map(([name, colors]) => (
                    <button
                        key={name}
                        onClick={() => onThemeSelect(name)}
                        className={cn(
                            "relative group flex items-center gap-3 p-3 rounded-xl border transition-all duration-300",
                            currentTheme === name
                                ? "bg-[var(--bg-elevated)] border-[var(--accent)] shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                                : "bg-[var(--bg-card)] border-[var(--border-dark)] hover:border-white/20"
                        )}
                    >
                        {/* Color Preview Dot */}
                        <div
                            className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                            style={{ backgroundColor: colors.accent }}
                        >
                            {currentTheme === name && (
                                <Check className="w-5 h-5 text-white drop-shadow-md" />
                            )}
                        </div>

                        {/* Label */}
                        <div className="text-left">
                            <span className="block text-sm font-bold text-white capitalize">
                                {name}
                            </span>
                            {currentTheme === name && (
                                <span className="text-[10px] text-[var(--accent)] font-medium animate-in fade-in">
                                    Active
                                </span>
                            )}
                        </div>

                        {/* Active Border Glow (Optional) */}
                        {currentTheme === name && (
                            <div className="absolute inset-0 rounded-xl border border-[var(--accent)] opacity-50 pointer-events-none animate-pulse" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
