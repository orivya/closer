import { useEffect, useState } from "react";
import { OnboardingAvatar } from "../OnboardingAvatar";
import { cn } from "@/lib/utils";

interface HelloStepProps {
  onComplete: () => void;
}

export function HelloStep({ onComplete }: HelloStepProps) {
  const [glowVisible, setGlowVisible] = useState(false);
  const [bodyVisible, setBodyVisible] = useState(false);
  const [eyesVisible, setEyesVisible] = useState(false);
  const [eyesOpen, setEyesOpen] = useState(false);
  const [greetingVisible, setGreetingVisible] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setGlowVisible(true), 300),
      setTimeout(() => setBodyVisible(true), 600),
      setTimeout(() => setEyesVisible(true), 1200),
      setTimeout(() => setEyesOpen(true), 1400),
      setTimeout(() => setGreetingVisible(true), 1800),
      setTimeout(() => onComplete(), 3500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="step-content max-w-[520px] w-full text-center">
      <OnboardingAvatar
        glowVisible={glowVisible}
        bodyVisible={bodyVisible}
        eyesVisible={eyesVisible}
        eyesOpen={eyesOpen}
      />
      <h1
        className={cn(
          "text-5xl font-light tracking-tight text-foreground transition-all duration-[800ms]",
          greetingVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        Hello.
      </h1>
    </div>
  );
}
