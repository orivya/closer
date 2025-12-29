import { useEffect, useState } from "react";
import { OnboardingAvatar } from "../OnboardingAvatar";
import { cn } from "@/lib/utils";

interface PhilosophyStepProps {
  onComplete: () => void;
}

export function PhilosophyStep({ onComplete }: PhilosophyStepProps) {
  const [msg1Visible, setMsg1Visible] = useState(false);
  const [msg2Visible, setMsg2Visible] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setMsg1Visible(true), 200),
      setTimeout(() => setMsg2Visible(true), 800),
      setTimeout(() => onComplete(), 4000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="step-content max-w-[520px] w-full text-center">
      <OnboardingAvatar
        glowVisible
        glowPulsing
        bodyVisible
        breathing
        eyesVisible
        eyesOpen
        blinking
      />
      <p
        className={cn(
          "text-[30px] font-normal leading-relaxed text-foreground transition-all duration-[800ms]",
          msg1Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        I'm not here to give you answers.
      </p>
      <p
        className={cn(
          "text-[26px] font-normal leading-relaxed text-muted-foreground mt-4 transition-all duration-[800ms]",
          msg2Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        I'm here to help you find <em className="text-sage-light not-italic">your own</em>.
      </p>
    </div>
  );
}
