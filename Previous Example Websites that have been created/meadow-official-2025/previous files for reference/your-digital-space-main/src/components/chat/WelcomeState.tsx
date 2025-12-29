import { cn } from "@/lib/utils";

interface WelcomeStateProps {
  visible: boolean;
  userName?: string;
}

export function WelcomeState({ visible, userName }: WelcomeStateProps) {
  const greeting = userName ? `Hey ${userName}, what's on your mind?` : "What's on your mind?";
  
  return (
    <div 
      className={cn(
        "flex-1 flex flex-col items-center justify-center px-8 text-center transition-all duration-400",
        visible ? "opacity-100" : "opacity-0 invisible pointer-events-none"
      )}
    >
      {/* Avatar with glow */}
      <div
        className="w-[100px] h-[88px] relative mb-6 isolate overflow-visible"
        style={{ WebkitTransformStyle: "preserve-3d" }}
      >
        {/* Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-[140px] animate-pulse-glow will-change-[opacity,transform]"
          style={{
            background: "radial-gradient(ellipse, hsl(var(--sage-glow)) 0%, transparent 70%)",
            filter: "blur(30px)",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Body */}
        <div
          className="w-full h-full animate-avatar-float relative overflow-visible"
          style={{
            background: "linear-gradient(155deg, hsl(var(--sage-light)) 0%, hsl(var(--primary)) 50%, hsl(var(--sage-dark)) 100%)",
            borderRadius: "75% 25% 65% 35% / 60% 40% 60% 40%",
            boxShadow: "0 10px 40px hsla(var(--primary), 0.3)",
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
              className="w-2 h-2 rounded-full bg-white/95 animate-avatar-blink"
              style={{ boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)" }}
            />
            <div
              className="w-[7px] h-[7px] rounded-full bg-white/90 opacity-90 animate-avatar-blink"
              style={{ boxShadow: "0 0 8px rgba(255, 255, 255, 0.3)" }}
            />
          </div>
        </div>
      </div>

      <h2 className="text-[26px] font-medium text-foreground mb-3">
        {greeting}
      </h2>
      <p className="text-[15px] text-muted-foreground max-w-[420px] leading-relaxed mb-8">
        I'm here to help you think through decisions, explore what matters, or gain perspective on what's next.
      </p>
    </div>
  );
}
