import { cn } from "@/lib/utils";

interface OrivyaAvatarProps {
  size?: "nav" | "preview" | "personality" | "phone" | "hero" | "cta" | "footer";
  className?: string;
  animated?: boolean;
  showGlow?: boolean;
}

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
};

export function OrivyaAvatar({
  size = "nav",
  className,
  animated = false,
  showGlow = false
}: OrivyaAvatarProps) {
  const config = sizeConfig[size];
  const isHero = size === "hero";
  const isCta = size === "cta";

  // Safari-specific styles for preventing black box artifacts
  const safariStyles: React.CSSProperties = {
    WebkitBackfaceVisibility: "hidden",
    backfaceVisibility: "hidden",
    WebkitTransform: "translateZ(0)",
    transform: "translateZ(0)",
  };

  return (
    <div
      className={cn("relative overflow-visible", config.wrapper, className)}
      style={{
        isolation: "isolate",
        background: "transparent",
        border: "none",
        outline: "none",
      }}
    >
      {/* Glow effect for hero and cta */}
      {showGlow && (isHero || isCta) && (
        <div
          className={cn(
            "absolute top-1/2 left-1/2 rounded-full bg-sage transition-opacity duration-500",
            isHero ? "w-[150px] h-[140px] opacity-40 group-hover:opacity-55" : "w-[85px] h-[75px] opacity-35"
          )}
          style={{
            transform: "translate(-50%, -50%)",
            WebkitFilter: isHero ? "blur(60px)" : "blur(35px)",
            filter: isHero ? "blur(60px)" : "blur(35px)",
            willChange: "opacity",
            border: "none",
            outline: "none",
            ...safariStyles,
          }}
        />
      )}

      {/* Body - the iconic seed shape */}
      <div
        className={cn(
          "bg-gradient-to-br from-sage-light via-sage to-sage-dark relative overflow-visible",
          isHero || isCta ? "absolute top-1/2 left-1/2" : "",
          config.body,
          !animated && !isHero && !isCta && "animate-nav-breathe"
        )}
        style={{
          borderRadius: "75% 25% 65% 35% / 60% 40% 60% 40%",
          boxShadow: isHero
            ? "0 15px 50px rgba(125, 155, 138, 0.35), inset 0 -12px 28px rgba(0,0,0,0.1), inset 0 12px 28px rgba(255,255,255,0.1)"
            : "0 2px 10px rgba(125, 155, 138, 0.25)",
          outline: "none",
          border: "none",
          transform: isHero || isCta ? "translate(-50%, -50%) translateZ(0)" : "translateZ(0)",
          ...safariStyles,
        }}
      >
        {/* Eyes */}
        <div
          className={cn(
            "absolute flex items-center",
            config.eyeGap
          )}
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
            className={cn(
              "bg-white/95 rounded-full relative",
              config.leftEye
            )}
            style={safariStyles}
          >
            {/* Eye shine for hero */}
            {isHero && (
              <span className="absolute top-0.5 left-0.5 w-[3px] h-[3px] bg-white/60 rounded-full" />
            )}
          </div>
          {/* Right eye - slightly smaller (follows the taper) */}
          <div
            className={cn(
              "bg-white/95 rounded-full relative",
              config.rightEye
            )}
            style={safariStyles}
          >
            {/* Eye shine for hero */}
            {isHero && (
              <span className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white/60 rounded-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
