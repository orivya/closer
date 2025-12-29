import { useEffect, useState } from "react";
import { ContinueButton } from "../ContinueButton";
import { cn } from "@/lib/utils";
import { Personality } from "./PersonalityStep";

const personalityLabels: Record<Personality, string> = {
  gentle: "Gentle",
  balanced: "Balanced",
  direct: "Direct",
  warm: "Warm",
  curious: "Curious",
  analytical: "Analytical",
};

interface PreviewStepProps {
  question: string;
  personality: Personality;
  onComplete: () => void;
}

export function PreviewStep({ question, personality, onComplete }: PreviewStepProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPreviewVisible(true), 200),
      setTimeout(() => setButtonVisible(true), 600),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="step-content max-w-[520px] w-full text-center">
      <div
        className={cn(
          "max-w-[420px] mx-auto p-6 rounded-2xl text-left transition-all duration-[800ms]",
          "bg-gradient-to-br from-sage-subtle to-elevated border border-sage/20",
          previewVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        <div className="font-mono text-[11px] font-semibold uppercase tracking-wide text-sage mb-3">
          Your First Memory Seed
        </div>
        <div className="text-base text-foreground leading-relaxed italic mb-4">
          "{question}"
        </div>
        <div className="text-[13px] text-text-muted">
          Personality: {personalityLabels[personality]}
        </div>
      </div>
      <ContinueButton onClick={onComplete} visible={buttonVisible}>
        Save & Continue
      </ContinueButton>
    </div>
  );
}
