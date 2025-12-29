import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type PreviewTheme = 'cream' | null;

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  previewTheme: PreviewTheme;
  setPreviewTheme: (preview: PreviewTheme) => void;
  isCreamPreview: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'meadow-theme';
const PREVIEW_STORAGE_KEY = 'meadow-preview-theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      return stored || 'system';
    }
    return 'system';
  });

  const [previewTheme, setPreviewThemeState] = useState<PreviewTheme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PREVIEW_STORAGE_KEY);
      return stored === 'cream' ? 'cream' : null;
    }
    return null;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolvedTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();
    mediaQuery.addEventListener('change', updateResolvedTheme);

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const setPreviewTheme = (preview: PreviewTheme) => {
    setPreviewThemeState(preview);
    if (preview) {
      localStorage.setItem(PREVIEW_STORAGE_KEY, preview);
    } else {
      localStorage.removeItem(PREVIEW_STORAGE_KEY);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        isDark: resolvedTheme === 'dark',
        previewTheme,
        setPreviewTheme,
        isCreamPreview: previewTheme === 'cream',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
