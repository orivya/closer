import { ChevronRight } from "lucide-react";
import { useState } from "react";

type PatternType = "constraint" | "resource" | "blindspot" | "shift";

interface Pattern {
  id: string;
  title: string;
  type: PatternType;
  typeLabel: string;
  meta: string;
}

interface PatternsSectionProps {
  activePatterns: Pattern[];
  exploredPatterns: Pattern[];
  closedPatterns: Pattern[];
  onPatternClick: (id: string) => void;
}

const typeColors: Record<PatternType, string> = {
  constraint: "bg-constraint",
  resource: "bg-resource",
  blindspot: "bg-unknown",
  shift: "bg-sage",
};

export function PatternsSection({
  activePatterns,
  exploredPatterns,
  closedPatterns,
  onPatternClick,
}: PatternsSectionProps) {
  const [activeTab, setActiveTab] = useState<"active" | "explored" | "closed">("active");

  const tabs = [
    { id: "active" as const, label: "Active", count: activePatterns.length },
    { id: "explored" as const, label: "Explored", count: exploredPatterns.length },
    { id: "closed" as const, label: "Closed", count: closedPatterns.length },
  ];

  const getCurrentPatterns = () => {
    switch (activeTab) {
      case "active":
        return activePatterns;
      case "explored":
        return exploredPatterns;
      case "closed":
        return closedPatterns;
    }
  };

  return (
    <section className="mb-8 animate-fade-in" style={{ animationDelay: "0.25s" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.3px] text-tertiary">
          All Patterns
        </span>
      </div>
      <div className="bg-elevated rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border-subtle">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-4 text-[13px] font-medium transition-all duration-150 relative ${
                activeTab === tab.id
                  ? "text-sage"
                  : "text-text-muted hover:text-foreground hover:bg-hover active:bg-surface"
              }`}
            >
              {tab.label}
              <span
                className={`inline-block px-1.5 py-0.5 rounded-full font-mono text-[10px] ml-1.5 ${
                  activeTab === tab.id ? "bg-sage-subtle text-sage" : "bg-hover"
                }`}
              >
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-sage" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {getCurrentPatterns().map((pattern, index) => (
            <div
              key={pattern.id}
              onClick={() => onPatternClick(pattern.id)}
              className={`flex gap-3 p-4 bg-background rounded-md cursor-pointer transition-all duration-150 hover:bg-hover ${
                index !== getCurrentPatterns().length - 1 ? "mb-3" : ""
              }`}
            >
              <div
                className={`w-1 rounded-[2px] flex-shrink-0 self-stretch ${typeColors[pattern.type]}`}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground mb-1">
                  {pattern.title}
                </div>
                <div className="text-xs text-tertiary">
                  <span className="inline-block px-2 py-0.5 bg-hover rounded-full text-[11px] text-text-muted mr-2">
                    {pattern.typeLabel}
                  </span>
                  {pattern.meta}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0 self-center" strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
