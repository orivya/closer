import React from 'react';

interface EssenceAvatarProps {
  size?: "nav" | "preview" | "personality" | "phone" | "hero" | "cta" | "footer" | "gallery";
  className?: string;
  animated?: boolean;
  showGlow?: boolean;
  mood?: 'neutral' | 'happy' | 'thinking' | 'talking';
}

// Size configurations matching the original Orivya avatar exactly
const sizeConfig = {
  nav: {
    wrapper: "w-7 h-[26px]",
    body: "w-full h-full",
    eyeGap: "gap-[7px]",
    leftEye: "w-[3px] h-[3px]",
    rightEye: "w-[2.5px] h-[2.5px] opacity-85",
  },
  preview: {
    wrapper: "w-9 h-8",
    body: "w-full h-full",
    eyeGap: "gap-[10px]",
    leftEye: "w-1 h-1",
    rightEye: "w-[3.5px] h-[3.5px] opacity-90",
  },
  personality: {
    wrapper: "w-[60px] h-[52px]",
    body: "w-full h-full",
    eyeGap: "gap-[14px]",
    leftEye: "w-[5px] h-[5px]",
    rightEye: "w-1 h-1 opacity-90",
  },
  phone: {
    wrapper: "w-8 h-7",
    body: "w-full h-full",
    eyeGap: "gap-2",
    leftEye: "w-[3px] h-[3px]",
    rightEye: "w-[2.5px] h-[2.5px] opacity-90",
  },
  hero: {
    wrapper: "w-[180px] h-[165px]",
    body: "w-[145px] h-[125px]",
    eyeGap: "gap-8",
    leftEye: "w-[11px] h-[11px] shadow-[0_0_12px_rgba(255,255,255,0.35)]",
    rightEye: "w-[9px] h-[9px] shadow-[0_0_10px_rgba(255,255,255,0.3)] opacity-90",
  },
  cta: {
    wrapper: "w-[95px] h-[85px]",
    body: "w-[76px] h-[66px]",
    eyeGap: "gap-[18px]",
    leftEye: "w-[6px] h-[6px]",
    rightEye: "w-[5px] h-[5px] opacity-90",
  },
  footer: {
    wrapper: "w-[22px] h-5",
    body: "w-full h-full",
    eyeGap: "gap-1",
    leftEye: "w-[2px] h-[2px]",
    rightEye: "w-[1.5px] h-[1.5px] opacity-90",
  },
  gallery: {
    wrapper: "w-16 h-14",
    body: "w-full h-full",
    eyeGap: "gap-3",
    leftEye: "w-[4px] h-[4px]",
    rightEye: "w-[3.5px] h-[3.5px] opacity-90",
  },
};

// Sage green color palette (matching original Orivya)
const sageColors = {
  light: '#A8C4A0',
  primary: '#7D9B8A',
  dark: '#5F7A6A',
  glow: 'rgba(125, 155, 138, 0.5)',
};

// CSS animations embedded for portability
const styles = `
  @keyframes essence-float {
    0%, 100% {
      transform: translateY(0) rotate(0deg) scale(1);
    }
    33% {
      transform: translateY(-8px) rotate(-2deg) scale(1.02);
    }
    66% {
      transform: translateY(-4px) rotate(1deg) scale(1.01);
    }
  }

  @keyframes essence-blink {
    0%, 44%, 56%, 100% {
      transform: scaleY(1);
    }
    50% {
      transform: scaleY(0.1);
    }
  }

  @keyframes essence-breathe {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
  }

  @keyframes essence-glow-pulse {
    0%, 100% {
      opacity: 0.4;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.7;
      transform: translate(-50%, -50%) scale(1.15);
    }
  }

  @keyframes essence-hero-breathe {
    0%, 100% {
      transform: translate(-50%, -50%) translateZ(0) translateY(0) rotate(0deg);
      border-radius: 75% 25% 65% 35% / 60% 40% 60% 40%;
    }
    33% {
      transform: translate(-50%, -50%) translateZ(0) translateY(-10px) rotate(-2deg);
      border-radius: 72% 28% 62% 38% / 58% 42% 58% 42%;
    }
    66% {
      transform: translate(-50%, -50%) translateZ(0) translateY(-6px) rotate(1deg);
      border-radius: 74% 26% 66% 34% / 62% 38% 62% 38%;
    }
  }

  .essence-float {
    animation: essence-float 5s ease-in-out infinite;
  }

  .essence-blink {
    animation: essence-blink 5s ease-in-out infinite;
  }

  .essence-breathe {
    animation: essence-breathe 5s ease-in-out infinite;
  }

  .essence-glow-pulse {
    animation: essence-glow-pulse 3s ease-in-out infinite;
  }

  .essence-hero-breathe {
    animation: essence-hero-breathe 5s ease-in-out infinite;
  }
`;

export const EssenceAvatar: React.FC<EssenceAvatarProps> = ({
  size = "nav",
  className = "",
  animated = true,
  showGlow = false,
  mood = 'neutral'
}) => {
  const config = sizeConfig[size];
  const isHero = size === "hero";
  const isCta = size === "cta";
  const isLarge = isHero || isCta;

  // Safari-specific styles for preventing black box artifacts
  const safariStyles: React.CSSProperties = {
    WebkitBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
    WebkitTransform: "translateZ(0)",
    transform: "translateZ(0)",
  };

  // The gradient that creates the iconic sage green look
  const bodyGradient = `linear-gradient(155deg, ${sageColors.light} 0%, ${sageColors.primary} 50%, ${sageColors.dark} 100%)`;

  return (
    <>
      <style>{styles}</style>
      <div
        className={`relative overflow-visible ${config.wrapper} ${className}`}
        style={{
          isolation: "isolate",
          background: "transparent",
          border: "none",
          outline: "none",
        }}
      >
        {/* Glow effect for hero and cta sizes */}
        {showGlow && isLarge && (
          <div
            className={`absolute top-1/2 left-1/2 rounded-full transition-opacity duration-500 essence-glow-pulse ${
              isHero ? "w-[150px] h-[140px]" : "w-[85px] h-[75px]"
            }`}
            style={{
              transform: "translate(-50%, -50%)",
              background: sageColors.glow,
              WebkitFilter: isHero ? "blur(60px)" : "blur(35px)",
              filter: isHero ? "blur(60px)" : "blur(35px)",
              willChange: "opacity",
              border: "none",
              outline: "none",
              ...safariStyles,
            }}
          />
        )}

        {/* Body - the iconic organic seed shape */}
        <div
          className={`
            relative overflow-visible
            ${isLarge ? "absolute top-1/2 left-1/2" : ""}
            ${config.body}
            ${animated && !isLarge ? "essence-breathe" : ""}
            ${animated && isLarge ? "essence-hero-breathe" : ""}
          `}
          style={{
            background: bodyGradient,
            borderRadius: "75% 25% 65% 35% / 60% 40% 60% 40%",
            boxShadow: isHero
              ? "0 15px 50px rgba(125, 155, 138, 0.35), inset 0 -12px 28px rgba(0,0,0,0.1), inset 0 12px 28px rgba(255,255,255,0.1)"
              : "0 2px 10px rgba(125, 155, 138, 0.25)",
            outline: "none",
            border: "none",
            transform: isLarge ? "translate(-50%, -50%) translateZ(0)" : "translateZ(0)",
            ...safariStyles,
          }}
        >
          {/* Eyes container */}
          <div
            className={`absolute flex items-center ${config.eyeGap}`}
            style={{
              top: isHero ? "40%" : "36%",
              left: "42%",
              transform: "translateX(-50%)",
              outline: "none",
              border: "none",
              background: "transparent",
            }}
          >
            {/* Left eye - slightly larger */}
            <div
              className={`
                bg-white/95 rounded-full relative
                ${config.leftEye}
                ${animated ? "essence-blink" : ""}
              `}
              style={{
                ...safariStyles,
                boxShadow: isHero ? "0 0 8px rgba(255, 255, 255, 0.3)" : undefined,
              }}
            >
              {/* Eye shine for hero */}
              {isHero && (
                <span
                  className="absolute top-0.5 left-0.5 w-[3px] h-[3px] bg-white/60 rounded-full"
                  style={safariStyles}
                />
              )}
            </div>

            {/* Right eye - slightly smaller (follows the organic taper) */}
            <div
              className={`
                bg-white/95 rounded-full relative
                ${config.rightEye}
                ${animated ? "essence-blink" : ""}
              `}
              style={{
                ...safariStyles,
                animationDelay: "0.1s",
                boxShadow: isHero ? "0 0 8px rgba(255, 255, 255, 0.3)" : undefined,
              }}
            >
              {/* Eye shine for hero */}
              {isHero && (
                <span
                  className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/60 rounded-full"
                  style={safariStyles}
                />
              )}
            </div>
          </div>

          {/* Subtle mouth for happy mood */}
          {mood === 'happy' && isLarge && (
            <div
              className="absolute"
              style={{
                top: isHero ? "55%" : "52%",
                left: "42%",
                transform: "translateX(-50%)",
                width: isHero ? "12px" : "8px",
                height: isHero ? "6px" : "4px",
                borderBottom: `2px solid rgba(255,255,255,0.4)`,
                borderRadius: "0 0 50% 50%",
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

// Alternative export for the welcome/chat state with built-in glow
export const EssenceWelcome: React.FC<{ className?: string; mood?: 'neutral' | 'happy' | 'thinking' | 'talking' }> = ({
  className = "",
  mood = 'neutral'
}) => {
  return (
    <div
      className={`w-[100px] h-[88px] relative isolate overflow-visible ${className}`}
      style={{ WebkitTransformStyle: "preserve-3d" }}
    >
      <style>{styles}</style>

      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-[140px] essence-glow-pulse will-change-[opacity,transform]"
        style={{
          background: `radial-gradient(ellipse, ${sageColors.glow} 0%, transparent 70%)`,
          filter: "blur(30px)",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Body */}
      <div
        className="w-full h-full essence-float relative overflow-visible"
        style={{
          background: `linear-gradient(155deg, ${sageColors.light} 0%, ${sageColors.primary} 50%, ${sageColors.dark} 100%)`,
          borderRadius: "75% 25% 65% 35% / 60% 40% 60% 40%",
          boxShadow: `0 10px 40px rgba(125, 155, 138, 0.3)`,
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
          outline: "none",
          border: "none",
        }}
      >
        {/* Eyes */}
        <div
          className="absolute top-[38%] left-[42%] -translate-x-1/2 flex gap-3.5"
          style={{ outline: "none", border: "none", background: "transparent" }}
        >
          <div
            className="w-2 h-2 rounded-full bg-white/95 essence-blink"
            style={{ boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)" }}
          />
          <div
            className="w-[7px] h-[7px] rounded-full bg-white/90 opacity-90 essence-blink"
            style={{ boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)", animationDelay: "0.1s" }}
          />
        </div>

        {/* Mouth for happy mood */}
        {mood === 'happy' && (
          <div
            className="absolute top-[52%] left-[42%] -translate-x-1/2"
            style={{
              width: "10px",
              height: "5px",
              borderBottom: "2px solid rgba(255,255,255,0.4)",
              borderRadius: "0 0 50% 50%",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EssenceAvatar;
