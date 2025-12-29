// tailwind.config.js
// ORIVYA V1 — Tailwind Configuration
// Maps design tokens to Tailwind utilities

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  
  darkMode: 'class', // or 'media' for system preference
  
  theme: {
    extend: {
      // ===========================================
      // COLORS
      // ===========================================
      colors: {
        // Primary - Sage Green
        sage: {
          DEFAULT: '#7d9b8a',
          light: '#9bb3a7',
          dark: '#5f8170',
          subtle: 'rgba(125, 155, 138, 0.08)',
          muted: 'rgba(125, 155, 138, 0.15)',
          glow: 'rgba(125, 155, 138, 0.4)',
        },
        
        // Backgrounds (Dark Mode)
        bg: {
          base: '#08080a',
          elevated: '#0e0e11',
          surface: '#141417',
          'surface-2': '#1a1a1e',
          hover: '#1e1e23',
        },
        
        // Backgrounds (Light Mode)
        'bg-light': {
          base: '#fafafa',
          elevated: '#ffffff',
          surface: '#f4f4f5',
          'surface-2': '#e4e4e7',
          hover: '#d4d4d8',
        },
        
        // Text (Dark Mode)
        text: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          tertiary: '#71717a',
          muted: '#52525b',
        },
        
        // Text (Light Mode)
        'text-light': {
          primary: '#18181b',
          secondary: '#52525b',
          tertiary: '#71717a',
          muted: '#a1a1aa',
        },
        
        // Semantic Colors
        success: {
          DEFAULT: '#4ade80',
          subtle: 'rgba(74, 222, 128, 0.1)',
        },
        error: {
          DEFAULT: '#f87171',
          subtle: 'rgba(248, 113, 113, 0.1)',
        },
        warning: {
          DEFAULT: '#fbbf24',
          subtle: 'rgba(251, 191, 36, 0.1)',
        },
        info: {
          DEFAULT: '#60a5fa',
          subtle: 'rgba(96, 165, 250, 0.1)',
        },
        
        // Borders
        border: {
          subtle: 'rgba(255, 255, 255, 0.04)',
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.12)',
        },
        'border-light': {
          subtle: 'rgba(0, 0, 0, 0.04)',
          DEFAULT: 'rgba(0, 0, 0, 0.08)',
          strong: 'rgba(0, 0, 0, 0.12)',
        },
      },
      
      // ===========================================
      // TYPOGRAPHY
      // ===========================================
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],        // 12px
        'sm': ['0.8125rem', { lineHeight: '1.25rem' }],   // 13px
        'base': ['0.875rem', { lineHeight: '1.5rem' }],   // 14px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],   // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],     // 36px
      },
      
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
      },
      
      letterSpacing: {
        tight: '-0.01em',
        normal: '0',
        wide: '0.02em',
        wider: '0.05em',
      },
      
      // ===========================================
      // SPACING
      // ===========================================
      spacing: {
        '0.5': '0.125rem',  // 2px
        '1': '0.25rem',     // 4px
        '1.5': '0.375rem',  // 6px
        '2': '0.5rem',      // 8px
        '2.5': '0.625rem',  // 10px
        '3': '0.75rem',     // 12px
        '3.5': '0.875rem',  // 14px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '7': '1.75rem',     // 28px
        '8': '2rem',        // 32px
        '9': '2.25rem',     // 36px
        '10': '2.5rem',     // 40px
        '11': '2.75rem',    // 44px (touch target)
        '12': '3rem',       // 48px
        '14': '3.5rem',     // 56px
        '16': '4rem',       // 64px
        '20': '5rem',       // 80px
        '24': '6rem',       // 96px
      },
      
      // ===========================================
      // BORDER RADIUS
      // ===========================================
      borderRadius: {
        'none': '0',
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
        '2xl': '24px',
        'full': '9999px',
      },
      
      // ===========================================
      // BOX SHADOW
      // ===========================================
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.2)',
        'DEFAULT': '0 2px 4px rgba(0, 0, 0, 0.2)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.2)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.2)',
        'xl': '0 12px 24px rgba(0, 0, 0, 0.3)',
        '2xl': '0 16px 48px rgba(0, 0, 0, 0.4)',
        
        // Glow effects
        'sage-sm': '0 0 8px rgba(125, 155, 138, 0.3)',
        'sage': '0 0 16px rgba(125, 155, 138, 0.4)',
        'sage-lg': '0 0 24px rgba(125, 155, 138, 0.5)',
        
        // Inner shadows
        'inner-sm': 'inset 0 1px 2px rgba(0, 0, 0, 0.2)',
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      
      // ===========================================
      // TRANSITIONS
      // ===========================================
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
      },
      
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.4, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      // ===========================================
      // ANIMATIONS
      // ===========================================
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'fade-out': 'fadeOut 150ms ease-in',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 0.3s ease',
        'shake': 'shake 0.4s ease',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        spin: {
          '100%': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        bounceSubtle: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
      },
      
      // ===========================================
      // BREAKPOINTS
      // ===========================================
      screens: {
        'xs': '375px',    // Small phones
        'sm': '640px',    // Large phones / small tablets
        'md': '768px',    // Tablets
        'lg': '1024px',   // Laptops
        'xl': '1280px',   // Desktops
        '2xl': '1536px',  // Large desktops
      },
      
      // ===========================================
      // Z-INDEX
      // ===========================================
      zIndex: {
        'negative': '-1',
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'sticky': '100',
        'header': '200',
        'dropdown': '300',
        'modal-backdrop': '400',
        'modal': '500',
        'popover': '600',
        'tooltip': '700',
        'toast': '800',
        'max': '9999',
      },
      
      // ===========================================
      // BACKDROP BLUR
      // ===========================================
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      
      // ===========================================
      // SAFE AREAS (for notched devices)
      // ===========================================
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  
  plugins: [
    // Custom plugin for Orivya utilities
    function({ addUtilities, addComponents, theme }) {
      // Glass effect utilities
      addUtilities({
        '.glass': {
          backgroundColor: 'rgba(14, 14, 17, 0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        },
        '.glass-light': {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        },
      });
      
      // Gradient utilities
      addUtilities({
        '.gradient-sage': {
          background: 'linear-gradient(135deg, #7d9b8a 0%, #5f8170 100%)',
        },
        '.gradient-dark': {
          background: 'linear-gradient(180deg, #0e0e11 0%, #08080a 100%)',
        },
        '.gradient-card': {
          background: 'linear-gradient(135deg, rgba(125, 155, 138, 0.08) 0%, rgba(125, 155, 138, 0.02) 100%)',
        },
      });
      
      // Text gradient
      addUtilities({
        '.text-gradient-sage': {
          backgroundImage: 'linear-gradient(135deg, #9bb3a7 0%, #7d9b8a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
      });
      
      // Focus ring
      addUtilities({
        '.focus-ring': {
          outline: '2px solid transparent',
          outlineOffset: '2px',
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.sage.DEFAULT')}`,
          },
        },
      });
      
      // Touch target
      addUtilities({
        '.touch-target': {
          minWidth: '44px',
          minHeight: '44px',
        },
      });
      
      // Skeleton loading
      addUtilities({
        '.skeleton': {
          background: 'linear-gradient(90deg, #1a1a1e 25%, #1e1e23 50%, #1a1a1e 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s ease-in-out infinite',
        },
      });
      
      // Hide scrollbar
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
      
      // Line clamp
      addUtilities({
        '.line-clamp-1': {
          display: '-webkit-box',
          WebkitLineClamp: '1',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-2': {
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-3': {
          display: '-webkit-box',
          WebkitLineClamp: '3',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        },
      });
    },
  ],
};
