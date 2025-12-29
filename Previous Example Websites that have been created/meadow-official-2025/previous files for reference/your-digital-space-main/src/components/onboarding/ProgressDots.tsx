import { cn } from "@/lib/utils";

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
  visible?: boolean;
}

export function ProgressDots({ currentStep, totalSteps, visible = false }: ProgressDotsProps) {
  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 transition-opacity duration-[800ms]",
        visible ? "opacity-60" : "opacity-0"
      )}
    >
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div
            key={step}
            className={cn(
              "h-1 rounded-full transition-all duration-400",
              isActive
                ? "w-5 bg-sage"
                : isCompleted
                ? "w-1 bg-sage/40"
                : "w-1 bg-white/20"
            )}
          />
        );
      })}
    </div>
  );
}
