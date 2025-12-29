import { useEffect, useState } from "react";
import { OnboardingAvatar } from "../OnboardingAvatar";
import { cn } from "@/lib/utils";

interface IntroductionStepProps {
  onComplete: () => void;
}

export function IntroductionStep({ onComplete }: IntroductionStepProps) {
  const [nameVisible, setNameVisible] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setNameVisible(true), 200),
      setTimeout(() => onComplete(), 2500),
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
      <h1
        className={cn(
          "text-5xl font-medium tracking-tight text-sage-light transition-all duration-[800ms]",
          nameVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        I'm Orivya.
      </h1>
    </div>
  );
}
