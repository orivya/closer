import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { InsightCard } from "./InsightCard";
import type { Insight } from "@/hooks/useInsights";

interface ClarityRailProps {
  isOpen: boolean;
  onClose: () => void;
  insights: Insight[];
  summary: string | null;
  onDismissInsight: (id: string) => void;
  onExploreInsight: (content: string) => void;
}

export function ClarityRail({
  isOpen,
  onClose,
  insights,
  summary,
  onDismissInsight,
  onExploreInsight,
}: ClarityRailProps) {
  // Filter out dismissed insights
  const activeInsights = insights.filter(i => !i.dismissed);

  // Find focus insight (first observation or theme that could be a focus)
  const focusInsight = activeInsights.find(i => 
    i.type === "theme" || i.type === "observation"
  );

  // Find shift insight
  const shiftInsight = activeInsights.find(i => i.type === "shift");

  // Get remaining insights for Emerging Themes (exclude the focus insight)
  const themesInsights = activeInsights.filter(i => 
    i.id !== focusInsight?.id && i.id !== shiftInsight?.id
  );

  const isEmpty = !summary && !focusInsight && !shiftInsight && themesInsights.length === 0;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "w-[380px] bg-elevated border-l border-subtle flex flex-col flex-shrink-0 min-h-0 transition-all duration-300",
          "max-lg:fixed max-lg:right-0 max-lg:top-0 max-lg:bottom-0 max-lg:z-50",
          isOpen ? "max-lg:translate-x-0" : "max-lg:translate-x-full",
          "lg:relative lg:h-full"
        )}
      >
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-subtle flex-shrink-0">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Lens</span>
              {activeInsights.length > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-sage-subtle rounded-full font-mono text-[10px] font-medium text-sage">
                  <span className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse" />
                  {activeInsights.length} new
                </span>
              )}
            </div>
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3px]">Real-time interpretation</span>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 rounded-md text-text-muted hover:bg-hover hover:text-foreground transition-colors"
            aria-label="Close lens panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 text-center">
            <div className="text-[32px] text-text-muted opacity-50 mb-4">◎</div>
            <div className="text-[14px] font-medium text-muted-foreground mb-1">Your context will emerge here</div>
            <div className="text-[13px] text-text-muted leading-relaxed max-w-[260px]">
              As we talk, patterns and themes will surface from the conversation.
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto p-5">
            <div className="flex flex-col gap-6">
              {/* SUMMARY Section */}
              {summary && (
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.5px] text-text-muted pb-2 mb-3 border-b border-subtle">
                    Summary
                  </div>
                  <div className="text-[14px] font-normal leading-[1.7] text-muted-foreground">
                    <span dangerouslySetInnerHTML={{ 
                      __html: summary.replace(
                        /\*\*(.*?)\*\*/g, 
                        '<strong class="text-sage font-semibold">$1</strong>'
                      )
                    }} />
                  </div>
                </div>
              )}

              {/* FOCUS Section */}
              {focusInsight && (
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.5px] text-text-muted pb-2 mb-3 border-b border-subtle">
                    Focus
                  </div>
                  <div className="pl-4 border-l-[3px] border-sage">
                    <div className="text-[14px] font-medium leading-[1.5] text-foreground">
                      {focusInsight.content}
                    </div>
                  </div>
                </div>
              )}

              {/* SHIFT Section */}
              {shiftInsight && (
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.5px] text-text-muted pb-2 mb-3 border-b border-subtle">
                    Shift
                  </div>
                  <div className="flex items-center gap-3 text-[13px]">
                    <span className="text-muted-foreground">{shiftInsight.content.split('→')[0]?.trim() || shiftInsight.content}</span>
                    {shiftInsight.content.includes('→') && (
                      <>
                        <span className="text-text-muted">→</span>
                        <span className="text-sage font-semibold">{shiftInsight.content.split('→')[1]?.trim()}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* EMERGING THEMES Section */}
              {themesInsights.length > 0 && (
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.5px] text-text-muted pb-2 mb-3 border-b border-subtle">
                    Emerging Themes
                  </div>
                  <div className="flex flex-col gap-3">
                    {themesInsights.map((insight) => (
                      <InsightCard
                        key={insight.id}
                        id={insight.id}
                        content={insight.content}
                        onExplore={onExploreInsight}
                        onDismiss={onDismissInsight}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Show empty themes message only if we have other content but no themes */}
              {!isEmpty && themesInsights.length === 0 && (
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.5px] text-text-muted pb-2 mb-3 border-b border-subtle">
                    Emerging Themes
                  </div>
                  <div className="text-[13px] text-text-muted leading-relaxed">
                    Patterns will surface as the conversation deepens.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
