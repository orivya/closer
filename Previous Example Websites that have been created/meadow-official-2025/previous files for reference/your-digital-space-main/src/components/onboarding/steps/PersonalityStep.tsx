import { useEffect, useState } from "react";
import { OnboardingAvatar } from "../OnboardingAvatar";
import { ContinueButton } from "../ContinueButton";
import { cn } from "@/lib/utils";
import { Heart, Circle, Zap, Sun, HelpCircle, Activity } from "lucide-react";

export type Personality = "gentle" | "balanced" | "direct" | "warm" | "curious" | "analytical";

interface PersonalityOption {
  id: Personality;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const personalities: PersonalityOption[] = [
  { id: "gentle", name: "Gentle", description: "Soft, patient, never pushy", icon: <Heart className="w-5 h-5" /> },
  { id: "balanced", name: "Balanced", description: "Warmth meets clarity", icon: <Circle className="w-5 h-5" /> },
  { id: "direct", name: "Direct", description: "Clear, efficient, focused", icon: <Zap className="w-5 h-5" /> },
  { id: "warm", name: "Warm", description: "Friendly, supportive", icon: <Sun className="w-5 h-5" /> },
  { id: "curious", name: "Curious", description: "Exploratory, wondering", icon: <HelpCircle className="w-5 h-5" /> },
  { id: "analytical", name: "Analytical", description: "Pattern-focused, systematic", icon: <Activity className="w-5 h-5" /> },
];

interface PersonalityStepProps {
  value: Personality;
  onChange: (value: Personality) => void;
  onComplete: () => void;
}

export function PersonalityStep({ value, onChange, onComplete }: PersonalityStepProps) {
  const [questionVisible, setQuestionVisible] = useState(false);
  const [visibleOptions, setVisibleOptions] = useState<number[]>([]);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [
      setTimeout(() => setQuestionVisible(true), 200),
    ];

    personalities.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setVisibleOptions((prev) => [...prev, i]);
      }, 400 + i * 80));
    });

    timers.push(setTimeout(() => setButtonVisible(true), 900));

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
        How should I speak with you?
      </p>
      <div className="grid grid-cols-3 gap-3 max-w-[480px] mx-auto">
        {personalities.map((p, i) => {
          const isVisible = visibleOptions.includes(i);
          const isSelected = value === p.id;

          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={cn(
                "p-5 px-4 bg-elevated border rounded-lg text-center transition-all duration-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
                isSelected
                  ? "border-sage bg-sage-subtle"
                  : "border-border-subtle hover:border-border hover:bg-surface hover:-translate-y-0.5"
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 mx-auto mb-2.5 flex items-center justify-center rounded-md transition-all duration-150",
                  isSelected ? "bg-sage" : "bg-surface"
                )}
              >
                <span className={cn(isSelected ? "text-white" : "text-text-muted")}>
                  {p.icon}
                </span>
              </div>
              <div
                className={cn(
                  "text-sm font-semibold mb-1",
                  isSelected ? "text-sage" : "text-foreground"
                )}
              >
                {p.name}
              </div>
              <div className="text-xs text-text-muted leading-snug">{p.description}</div>
            </button>
          );
        })}
      </div>
      <ContinueButton onClick={onComplete} visible={buttonVisible} />
    </div>
  );
}
