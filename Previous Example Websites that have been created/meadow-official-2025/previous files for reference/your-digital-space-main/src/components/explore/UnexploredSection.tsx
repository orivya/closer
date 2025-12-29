import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UnexploredItem {
  id: string;
  text: string;
  topic: string;
}

interface UnexploredSectionProps {
  items: UnexploredItem[];
  onExplore: (topic: string) => void;
}

export function UnexploredSection({ items, onExplore }: UnexploredSectionProps) {
  const [priorities, setPriorities] = useState<Set<string>>(new Set());

  const togglePriority = (id: string) => {
    const newPriorities = new Set(priorities);
    if (newPriorities.has(id)) {
      newPriorities.delete(id);
      toast.success("Priority removed");
    } else {
      newPriorities.add(id);
      toast.success("Marked as priority");
    }
    setPriorities(newPriorities);
  };

  return (
    <section className="mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.3px] text-tertiary">
          Unexplored
        </span>
      </div>
      <p className="text-[13px] text-tertiary mb-4">
        Areas you haven't touched yet
      </p>
      <div className="bg-elevated rounded-lg p-6">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-background rounded-md transition-all duration-150 hover:bg-hover"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-2 h-2 bg-unknown rounded-full flex-shrink-0" />
                <span className="text-sm text-foreground">{item.text}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePriority(item.id)}
                  className={`w-7 h-7 flex items-center justify-center border rounded-sm transition-all duration-150 hover:scale-105 active:scale-95 ${
                    priorities.has(item.id)
                      ? "bg-unknown-subtle border-unknown text-unknown"
                      : "bg-transparent border-border-subtle text-text-muted hover:bg-unknown-subtle hover:border-unknown hover:text-unknown"
                  }`}
                >
                  <Star
                    className="w-3.5 h-3.5"
                    strokeWidth={1.5}
                    fill={priorities.has(item.id) ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={() => onExplore(item.topic)}
                  className="px-3.5 py-1.5 bg-sage-subtle border border-sage-muted rounded-sm text-xs font-medium text-sage hover:bg-sage hover:border-sage hover:text-white transition-all duration-150 active:scale-[0.96]"
                >
                  Explore →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
