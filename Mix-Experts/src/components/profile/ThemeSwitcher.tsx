'use client';

import React from 'react';
import { THEMES } from '@/lib/constants';
import { ThemeName } from '@/lib/types';

interface ThemeSwitcherProps {
    currentTheme: ThemeName;
    onThemeChange: (theme: ThemeName) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
    return (
        <div className="fixed bottom-6 right-6 z-[9999] bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-4 shadow-2xl">
            <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Theme</div>
            <div className="flex flex-wrap gap-2 max-w-[140px]">
                {(Object.keys(THEMES) as ThemeName[]).map((themeName) => (
                    <button
                        key={themeName}
                        onClick={() => onThemeChange(themeName)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${currentTheme === themeName ? 'border-white' : 'border-transparent'
                            }`}
                        style={{ backgroundColor: THEMES[themeName].accent }}
                        title={themeName}
                    />
                ))}
            </div>
        </div>
    );
};
