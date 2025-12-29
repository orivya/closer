import { useState } from "react";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  id: string;
  content: string;
  onExplore: (content: string) => void;
  onDismiss: (id: string) => void;
  isNew?: boolean;
}

export function InsightCard({
  id,
  content,
  onExplore,
  onDismiss,
  isNew = false,
}: InsightCardProps) {
  const [isDismissing, setIsDismissing] = useState(false);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      onDismiss(id);
    }, 300);
  };

  return (
    <div
      className={cn(
        "relative p-4 bg-background rounded-[12px] border-l-[3px] border-sage transition-all duration-300",
        "hover:bg-hover",
        isDismissing && "animate-insight-fade-out",
        isNew && "animate-insight-fade-in"
      )}
    >
      {/* Content */}
      <div className="text-[14px] font-[450] leading-[1.55] text-foreground mb-3">
        {content}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onExplore(content)}
          className="px-3 py-1.5 bg-transparent border border-subtle rounded-md text-[12px] font-medium text-text-muted hover:bg-sage-subtle hover:border-sage-muted hover:text-sage transition-all duration-150 active:scale-[0.96]"
        >
          Explore
        </button>
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 bg-transparent border border-subtle rounded-md text-[12px] font-medium text-text-muted hover:bg-hover hover:text-tertiary-foreground transition-all duration-150 active:scale-[0.96]"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
