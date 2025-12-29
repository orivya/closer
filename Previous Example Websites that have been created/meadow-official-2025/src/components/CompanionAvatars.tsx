import React from 'react';
import { EssenceAvatar } from './EssenceAvatar';

// ============================================
// ANIMATIONS & STYLES (Injected for portability)
// ============================================
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
  @keyframes sway {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
  @keyframes blink {
    0%, 96%, 100% { transform: scaleY(1); }
    98% { transform: scaleY(0.1); }
  }
  @keyframes glow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  @keyframes drift {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(5px); }
  }
`;

// Common props for all companion SVGs
interface CompanionSVGProps {
    size?: number;
    className?: string;
    mood?: 'neutral' | 'happy' | 'thinking' | 'talking';
    variant?: 'sage' | 'ember';
}

// ------------------------------------------------------------------
// 1. ESSENCE (Replaces Stone Sage)
// Vibe: Clarity, presence, grounded. The iconic organic seed shape.
// ------------------------------------------------------------------
export const Essence: React.FC<CompanionSVGProps> = ({ size = 200, className, mood = 'neutral' }) => {
    // Map numeric size to EssenceAvatar size preset
    const sizePreset = size >= 300 ? 'hero' : size >= 80 ? 'cta' : size >= 50 ? 'personality' : 'gallery';

    return (
        <div
            className={`flex items-center justify-center ${className || ''}`}
            style={{ width: size, height: size * 0.875 }}
        >
            <EssenceAvatar
                size={sizePreset}
                mood={mood}
                animated={true}
                showGlow={size >= 200}
            />
        </div>
    );
};

// Keep StoneSage as an alias for backwards compatibility
export const StoneSage = Essence;

// ------------------------------------------------------------------
// 2. THE MOSS KEEPER
// Vibe: Nurturing, soft, growth. Wrapped in leaves.
// ------------------------------------------------------------------
export const MossKeeper: React.FC<CompanionSVGProps> = ({ size = 200, className, mood }) => (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
        <style>{styles}</style>
        <g style={{ animation: 'breathe 5s ease-in-out infinite' }}>
            {/* Body - Moss Mound */}
            <path d="M50 170 Q40 120 100 110 Q160 120 150 170 Q100 185 50 170 Z" fill="#758C51" />
            <path d="M55 165 Q45 125 100 115 Q155 125 145 165" fill="none" stroke="#8FA876" strokeWidth="2" opacity="0.5" strokeDasharray="5 5" />

            {/* Beard/Leafy ruff */}
            <path d="M60 115 Q80 145 100 135 Q120 145 140 115 Q100 100 60 115 Z" fill="#E8E8E0" />

            {/* Face */}
            <circle cx="100" cy="105" r="25" fill="#F2D8C9" />
            <g transform="translate(100, 105)">
                <g style={{ animation: 'blink 3.5s infinite' }}>
                    <circle cx="-10" cy="0" r={3} fill="#4A3B32" />
                    <circle cx="10" cy="0" r={3} fill="#4A3B32" />
                </g>
                <ellipse cx="0" cy="5" rx="6" ry="4" fill="#E0ACA2" opacity="0.6" /> {/* Nose blush */}
                {mood === 'happy' && <path d="M-8 12 Q0 18 8 12" stroke="#4A3B32" fill="none" strokeWidth="1.5" strokeLinecap="round" />}
            </g>

            {/* Hat - Tall Moss Cone */}
            <path d="M70 95 Q100 10 130 95 Q100 85 70 95 Z" fill="#5F754B" />
            {/* Texture touches on hat */}
            <circle cx="90" cy="60" r="3" fill="#8FA876" opacity="0.6" />
            <circle cx="110" cy="40" r="2" fill="#8FA876" opacity="0.6" />
            <circle cx="100" cy="80" r="4" fill="#8FA876" opacity="0.6" />
        </g>
    </svg>
);

// ------------------------------------------------------------------
// 3. THE EMBER GUIDE
// Vibe: Warm, guiding light. Terracotta tones.
// ------------------------------------------------------------------
export const EmberGuide: React.FC<CompanionSVGProps> = ({ size = 200, className, mood }) => (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
        <style>{styles}</style>
        {/* Lantern Glow Background */}
        <circle cx="140" cy="140" r="40" fill="#FFB74D" opacity="0.2" style={{ animation: 'glow 3s infinite alternate' }} />

        {/* Body - Clay Pot Shape */}
        <path d="M65 170 L75 120 L125 120 L135 170 Q100 180 65 170 Z" fill="#D48C70" />

        {/* Belt/Detail */}
        <rect x="73" y="145" width="54" height="8" fill="#A65D46" rx="2" />

        {/* Head */}
        <circle cx="100" cy="105" r="22" fill="#F0E0D6" />

        {/* Eyes & Glasses (Wise look) */}
        <g transform="translate(100, 105)">
            <circle cx="-8" cy="0" r={6} fill="none" stroke="#5D4037" strokeWidth="1.5" />
            <circle cx="8" cy="0" r={6} fill="none" stroke="#5D4037" strokeWidth="1.5" />
            <line x1="-2" y1="0" x2="2" y2="0" stroke="#5D4037" strokeWidth="1.5" />
            <g style={{ animation: 'blink 5s infinite' }}>
                <circle cx="-8" cy="0" r={2} fill="#5D4037" />
                <circle cx="8" cy="0" r={2} fill="#5D4037" />
            </g>
        </g>

        {/* Hat - Ceramic Cone */}
        <path d="M75 90 Q100 20 125 90 Q100 85 75 90 Z" fill="#BF5E45" />

        {/* Lantern held in hand */}
        <g transform="translate(130, 140)" style={{ animation: 'sway 4s ease-in-out infinite' }}>
            <line x1="0" y1="-10" x2="0" y2="10" stroke="#5D4037" strokeWidth="2" />
            <circle cx="0" cy="15" r="8" fill="#FFF" stroke="#5D4037" />
            <circle cx="0" cy="15" r="5" fill="#FFCC80" style={{ animation: 'glow 2s infinite' }} />
        </g>
    </svg>
);

// ------------------------------------------------------------------
// 4. THE CLOUD WEAVER
// Vibe: Light, dreamy, clearing fog.
// ------------------------------------------------------------------
export const CloudWeaver: React.FC<CompanionSVGProps> = ({ size = 200, className, mood }) => (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
        <style>{styles}</style>
        <g style={{ animation: 'drift 8s ease-in-out infinite alternate' }}>

            {/* Body - Fluffy Cloud */}
            <g fill="#EAF4F4">
                <circle cx="100" cy="150" r="30" />
                <circle cx="75" cy="160" r="25" />
                <circle cx="125" cy="160" r="25" />
                <circle cx="100" cy="170" r="20" />
            </g>

            {/* Head - Softer oval */}
            <ellipse cx="100" cy="120" rx="20" ry="18" fill="#F5F5F5" />

            {/* Face Features */}
            <g transform="translate(100, 120)">
                {/* Sleepy eyes */}
                <path d="M-10 2 Q-5 5 0 2" stroke="#78909C" fill="none" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 2 Q5 5 0 2" stroke="#78909C" fill="none" strokeWidth="1.5" strokeLinecap="round" />

                {/* Mouth */}
                <circle cx="0" cy="8" r={1} fill="#78909C" />
            </g>

            {/* Hat - Wispy Peak */}
            <path d="M80 110 Q100 40 110 50 Q120 110 120 110 L80 110 Z" fill="#B0BEC5" opacity="0.8" />
            <path d="M110 50 Q115 40 125 45" stroke="#B0BEC5" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Stars/Sparkles */}
            <g style={{ animation: 'blink 3s infinite alternate' }}>
                <path d="M140 100 L142 105 L147 105 L143 108 L145 113 L140 110 L135 113 L137 108 L133 105 L138 105 Z" fill="#FFF59D" />
            </g>
        </g>
    </svg>
);

// ------------------------------------------------------------------
// 5. THE BLOOM TENDER
// Vibe: Hopeful, blossoming, colorful.
// ------------------------------------------------------------------
export const BloomTender: React.FC<CompanionSVGProps> = ({ size = 200, className, mood }) => (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
        <style>{styles}</style>
        <g style={{ animation: 'breathe 4s ease-in-out infinite' }}>

            {/* Body - Bulb Shape */}
            <path d="M60 170 Q40 130 100 130 Q160 130 140 170 Z" fill="#9FA8DA" />

            {/* Arms/Petals wrapping */}
            <path d="M60 170 Q60 140 90 140 M140 170 Q140 140 110 140" stroke="#7986CB" strokeWidth="2" fill="none" />

            {/* Head */}
            <circle cx="100" cy="120" r="22" fill="#FFF3E0" />

            {/* Face */}
            <g transform="translate(100, 120)">
                <g style={{ animation: 'blink 3s infinite' }}>
                    <ellipse cx="-8" cy="0" rx="2" ry="3" fill="#5C6BC0" />
                    <ellipse cx="8" cy="0" rx="2" ry="3" fill="#5C6BC0" />
                </g>
                <path d="M-6 8 Q0 14 6 8" fill="none" stroke="#5C6BC0" strokeWidth="1.5" strokeLinecap="round" />
                {/* Freckles */}
                <circle cx="-12" cy="4" r="1" fill="#FFCC80" />
                <circle cx="12" cy="4" r="1" fill="#FFCC80" />
            </g>

            {/* Hat - Inverted Flower Bud */}
            <g style={{ transformOrigin: '100px 100px' }}>
                <path d="M78 105 Q100 20 122 105" fill="#7E57C2" />
                <path d="M78 105 Q100 40 100 105" fill="#9575CD" />
                <path d="M122 105 Q100 40 100 105" fill="#9575CD" />
            </g>

            {/* Floating Petals */}
            <g style={{ animation: 'float 5s ease-in-out infinite reverse' }}>
                <circle cx="150" cy="90" r="4" fill="#E1BEE7" opacity="0.8" />
                <circle cx="50" cy="110" r="3" fill="#E1BEE7" opacity="0.6" />
            </g>
        </g>
    </svg>
);
