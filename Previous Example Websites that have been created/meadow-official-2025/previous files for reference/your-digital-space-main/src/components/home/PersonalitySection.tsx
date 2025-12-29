import { OrivyaAvatar } from "@/components/OrivyaAvatar";
import { useMemo } from "react";

export function PersonalitySection() {
  const timeContext = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Morning thoughts tend to be clearer.";
    } else if (hour >= 12 && hour < 17) {
      return "Afternoon — when the day's weight settles in.";
    } else if (hour >= 17 && hour < 21) {
      return "Evening — a good time to reflect.";
    } else {
      return "Late night clarity hits different.";
    }
  }, []);

  return (
    <section className="py-20 px-6 relative z-10">
      <div className="max-w-[520px] mx-auto bg-card-custom border border-subtle rounded-2xl px-9 py-10 text-center">
        <OrivyaAvatar size="personality" className="mx-auto mb-6" />
        <p className="text-[17px] italic text-secondary leading-[1.65] mb-5">
          "Most of us don't lack answers. We lack the right questions. The things 
          that keep you stuck usually aren't complicated. They're just hard to see 
          when you're standing inside them."
        </p>
        <span className="font-mono text-[11px] text-muted-custom">{timeContext}</span>
      </div>
    </section>
  );
}
