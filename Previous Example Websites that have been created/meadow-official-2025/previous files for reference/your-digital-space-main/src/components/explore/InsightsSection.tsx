import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Insight {
  id: string;
  text: string;
  highlight: string;
  highlightText: string;
}

interface InsightsSectionProps {
  insights: Insight[];
  onExplore: (topic: string) => void;
  onSave: (id: string) => void;
}

export function InsightsSection({ insights, onExplore, onSave }: InsightsSectionProps) {
  const [resonance, setResonance] = useState<Record<string, boolean | null>>({});

  const handleResonate = (id: string, value: boolean) => {
    setResonance(prev => ({ ...prev, [id]: value }));
    toast.success(value ? "Thanks for the feedback!" : "Noted — we'll refine this");
  };

  return (
    <section className="mb-8 animate-fade-in" style={{ animationDelay: "0.05s" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.3px] text-tertiary">
          This Week's Insights
        </span>
      </div>
      <div className="bg-elevated rounded-[14px] p-6">
        {insights.map((insight, index) => (
          <div
            key={insight.id}
            className={`flex gap-4 py-4 ${
              index !== insights.length - 1 ? "border-b border-border-subtle" : ""
            } ${index === 0 ? "pt-0" : ""} ${index === insights.length - 1 ? "pb-0" : ""}`}
          >
            <div className="w-8 h-8 bg-unknown-subtle rounded-[10px] flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-unknown" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground leading-relaxed">
                {insight.text.split(insight.highlight)[0]}
                <span className="text-sage font-semibold">{insight.highlightText}</span>
                {insight.text.split(insight.highlight)[1]}
              </p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <button
                  onClick={() => onExplore(insight.highlight)}
                  className="px-3.5 py-1.5 bg-sage-subtle border border-sage-muted rounded-sm text-xs font-medium text-sage hover:bg-sage hover:border-sage hover:text-white transition-all duration-150 active:scale-[0.96]"
                >
                  Explore this →
                </button>
                <button
                  onClick={() => onSave(insight.id)}
                  className="px-3.5 py-1.5 bg-transparent border border-border rounded-sm text-xs font-medium text-muted-foreground hover:bg-hover transition-all duration-150 active:scale-[0.96]"
                >
                  Save
                </button>
                <div className="flex items-center gap-2 ml-auto max-md:ml-0 max-md:mt-2 max-md:w-full">
                  <span className="text-xs text-text-muted mr-1">Resonates?</span>
                  <button
                    onClick={() => handleResonate(insight.id, true)}
                    className={`px-2.5 py-1 border rounded-sm text-[11px] font-medium transition-all duration-150 active:scale-[0.96] ${
                      resonance[insight.id] === true
                        ? "bg-resource-subtle border-resource text-resource"
                        : "bg-transparent border-border-subtle text-text-muted hover:bg-hover hover:text-foreground"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleResonate(insight.id, false)}
                    className={`px-2.5 py-1 border rounded-sm text-[11px] font-medium transition-all duration-150 active:scale-[0.96] ${
                      resonance[insight.id] === false
                        ? "bg-constraint-subtle border-constraint text-constraint"
                        : "bg-transparent border-border-subtle text-text-muted hover:bg-hover hover:text-foreground"
                    }`}
                  >
                    Not quite
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
