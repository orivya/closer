import { useEffect, useState } from "react";
import { ContinueButton } from "../ContinueButton";
import { cn } from "@/lib/utils";
import { Bookmark, Compass, CheckCircle } from "lucide-react";

const cards = [
  {
    icon: <Bookmark className="w-5 h-5 stroke-sage" />,
    title: "What you save",
    description: "Insights that resonate, decisions you're tracking, patterns you notice",
  },
  {
    icon: <Compass className="w-5 h-5 stroke-sage" />,
    title: "What emerges",
    description: "Themes and patterns that surface naturally from our conversations",
  },
  {
    icon: <CheckCircle className="w-5 h-5 stroke-sage" />,
    title: "What you confirm",
    description: "When you say \"resonates\" or \"not quite,\" I learn what's true for you",
  },
];

interface ContinuityStepProps {
  onComplete: () => void;
}

export function ContinuityStep({ onComplete }: ContinuityStepProps) {
  const [titleVisible, setTitleVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [
      setTimeout(() => setTitleVisible(true), 200),
      setTimeout(() => setVisibleCards((prev) => [...prev, 0]), 400),
      setTimeout(() => setVisibleCards((prev) => [...prev, 1]), 550),
      setTimeout(() => setVisibleCards((prev) => [...prev, 2]), 700),
      setTimeout(() => setButtonVisible(true), 900),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="step-content max-w-[480px] w-full mx-auto">
      <p
        className={cn(
          "text-xl text-muted-foreground mb-8 text-center transition-all duration-[800ms]",
          titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        Here's how I'll remember as we talk...
      </p>
      <div className="flex flex-col gap-4">
        {cards.map((card, i) => (
          <div
            key={card.title}
            className={cn(
              "flex items-start gap-4 p-5 bg-elevated border border-border-subtle rounded-lg text-left transition-all duration-[600ms]",
              visibleCards.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            )}
          >
            <div className="w-10 h-10 bg-sage-subtle rounded-md flex items-center justify-center shrink-0">
              {card.icon}
            </div>
            <div>
              <h4 className="text-[15px] font-semibold text-foreground mb-1">{card.title}</h4>
              <p className="text-sm text-tertiary-foreground leading-relaxed">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <ContinueButton onClick={onComplete} visible={buttonVisible}>
          I understand
        </ContinueButton>
      </div>
    </div>
  );
}
