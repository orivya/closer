interface ThinkingIndicatorProps {
  visible: boolean;
}

export function ThinkingIndicator({ visible }: ThinkingIndicatorProps) {
  if (!visible) return null;

  return (
    <div className="flex items-center gap-3 py-4 max-w-[680px] mx-auto w-full px-6">
      {/* Avatar */}
      <div className="w-8 h-7 relative isolate flex-shrink-0">
        <div 
          className="w-full h-full animate-thinking-sway"
          style={{
            background: "linear-gradient(155deg, hsl(var(--sage-light)) 0%, hsl(var(--primary)) 50%, hsl(var(--sage-dark)) 100%)",
            borderRadius: "75% 25% 65% 35% / 60% 40% 60% 40%",
          }}
        >
          <div className="absolute top-[38%] left-[42%] -translate-x-1/2 flex gap-[7px]">
            <div className="w-[3px] h-[2.5px] rounded-full bg-white/95 animate-thinking-eyes" />
            <div className="w-[2.5px] h-[2px] rounded-full bg-white/90 animate-thinking-eyes" />
          </div>
        </div>
      </div>

      {/* Dots only */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div 
            key={i}
            className="w-[5px] h-[5px] rounded-full bg-sage animate-thinking-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
