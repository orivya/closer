import { cn } from "@/lib/utils";

interface OnboardingAvatarProps {
  glowVisible?: boolean;
  glowPulsing?: boolean;
  bodyVisible?: boolean;
  breathing?: boolean;
  eyesVisible?: boolean;
  eyesOpen?: boolean;
  blinking?: boolean;
  className?: string;
}

export function OnboardingAvatar({
  glowVisible = false,
  glowPulsing = false,
  bodyVisible = false,
  breathing = false,
  eyesVisible = false,
  eyesOpen = false,
  blinking = false,
  className,
}: OnboardingAvatarProps) {
  // Safari-specific styles for preventing black box artifacts
  const safariStyles = {
    WebkitBackfaceVisibility: "hidden" as const,
    backfaceVisibility: "hidden" as const,
    WebkitTransform: "translateZ(0)",
    transform: "translateZ(0)",
  };

  return (
    <div
      className={cn("relative w-[140px] h-[125px] mx-auto mb-12 isolate overflow-visible", className)}
      style={{ WebkitTransformStyle: "preserve-3d" }}
    >
      {/* Glow */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[130px] bg-sage rounded-full blur-[50px] transition-opacity duration-[1500ms] will-change-[opacity,transform]",
          glowVisible ? "opacity-40" : "opacity-0",
          glowPulsing && "animate-glow-pulse"
        )}
        style={safariStyles}
      />

      {/* Body */}
      <div
        className={cn(
          "absolute top-1/2 left-1/2 w-[120px] h-[105px] transition-transform duration-[1200ms] overflow-visible",
          "shadow-[0_20px_60px_rgba(125,155,138,0.3),inset_0_-8px_20px_rgba(0,0,0,0.1),inset_0_8px_20px_rgba(255,255,255,0.1)]",
          bodyVisible
            ? breathing
              ? "animate-seed-breathe"
              : "translate-x-[-50%] translate-y-[-50%] scale-100"
            : "translate-x-[-50%] translate-y-[-50%] scale-0"
        )}
        style={{
          background: "linear-gradient(155deg, hsl(var(--sage-light)) 0%, hsl(var(--primary)) 50%, hsl(var(--sage-dark)) 100%)",
          borderRadius: "75% 25% 65% 35% / 60% 40% 60% 40%",
          outline: "none",
          border: "none",
          ...safariStyles,
        }}
      >
        {/* Eyes */}
        <div
          className={cn(
            "absolute top-[40%] left-[42%] -translate-x-1/2 flex gap-6 transition-opacity duration-[800ms]",
            eyesVisible ? "opacity-100" : "opacity-0"
          )}
          style={{ outline: "none", border: "none", background: "transparent" }}
        >
          <div
            className={cn(
              "w-[9px] h-[9px] bg-white/95 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.3)] transition-transform duration-500",
              eyesOpen ? (blinking ? "animate-avatar-blink" : "scale-y-100") : "scale-y-0"
            )}
          />
          <div
            className={cn(
              "w-[7px] h-[7px] bg-white/90 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.3)] transition-transform duration-500",
              eyesOpen ? (blinking ? "animate-avatar-blink" : "scale-y-100") : "scale-y-0"
            )}
          />
        </div>
      </div>
    </div>
  );
}
