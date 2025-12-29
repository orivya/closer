import { useEffect, useState } from "react";
import { OnboardingAvatar } from "../OnboardingAvatar";
import { ContinueButton } from "../ContinueButton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NameStepProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: () => void;
}

export function NameStep({ value, onChange, onComplete }: NameStepProps) {
  const [questionVisible, setQuestionVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  const isValid = value.trim().length >= 1;

  useEffect(() => {
    const timers = [
      setTimeout(() => setQuestionVisible(true), 200),
      setTimeout(() => setInputVisible(true), 500),
      setTimeout(() => setButtonVisible(true), 700),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid) {
      onComplete();
    }
  };

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
        What should I call you?
      </p>
      <div
        className={cn(
          "max-w-[320px] mx-auto transition-all duration-[600ms]",
          inputVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Your first name"
          maxLength={30}
          autoComplete="given-name"
          autoFocus
          className="w-full py-[18px] px-6 h-auto bg-elevated border-border rounded-lg-plus text-lg font-medium text-center placeholder:text-text-muted placeholder:font-normal focus:border-sage focus:ring-2 focus:ring-sage/10"
        />
      </div>
      <ContinueButton
        onClick={onComplete}
        disabled={!isValid}
        visible={buttonVisible}
      />
    </div>
  );
}
