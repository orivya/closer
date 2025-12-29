import { useEffect, useState } from "react";
import { OnboardingAvatar } from "../OnboardingAvatar";
import { ContinueButton } from "../ContinueButton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FirstQuestionStepProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: () => void;
}

export function FirstQuestionStep({ value, onChange, onComplete }: FirstQuestionStepProps) {
  const [questionVisible, setQuestionVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  const isValid = value.trim().length >= 10;

  useEffect(() => {
    const timers = [
      setTimeout(() => setQuestionVisible(true), 200),
      setTimeout(() => setInputVisible(true), 500),
      setTimeout(() => setButtonVisible(true), 700),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

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
          "text-[28px] font-normal leading-normal text-foreground mb-10 transition-all duration-[800ms]",
          questionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        What's one thing you wish you understood better about your life right now?
      </p>
      <div className="max-w-[480px] mx-auto w-full">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Take your time..."
          autoFocus
          className={cn(
            "w-full p-5 bg-elevated border-border rounded-lg text-base text-foreground resize-none min-h-[120px] placeholder:text-text-muted focus:border-sage/40 focus:ring-2 focus:ring-sage/10 transition-all duration-[600ms]",
            inputVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
        />
        <ContinueButton onClick={onComplete} disabled={!isValid} visible={buttonVisible}>
          See my reflection
        </ContinueButton>
      </div>
    </div>
  );
}
