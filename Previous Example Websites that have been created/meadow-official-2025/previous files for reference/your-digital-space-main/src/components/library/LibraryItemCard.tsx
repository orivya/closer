import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type ItemType = "insight" | "decision" | "pattern" | "note" | "resolved";

export interface LibraryItem {
  id: string;
  type: ItemType;
  title: string;
  preview: string;
  date: string;
  category?: string;
  starred: boolean;
  status?: "open" | "resolved";
}

interface LibraryItemCardProps {
  item: LibraryItem;
  onToggleStar: (id: string) => void;
  onClick: (id: string) => void;
  onAction?: (action: string, id: string) => void;
}

const typeStyles: Record<ItemType, string> = {
  insight: "bg-sage-subtle text-sage",
  decision: "bg-[hsl(var(--gold-subtle))] text-[hsl(var(--gold))]",
  pattern: "bg-[hsl(210_50%_15%)] text-[#64b5f6]",
  note: "bg-surface text-text-muted",
  resolved: "bg-sage-subtle text-sage",
};

const typeLabels: Record<ItemType, string> = {
  insight: "Insight",
  decision: "Decision",
  pattern: "Pattern",
  note: "Note",
  resolved: "Resolved",
};

export function LibraryItemCard({ item, onToggleStar, onClick, onAction }: LibraryItemCardProps) {
  const displayType = item.status === "resolved" ? "resolved" : item.type;

  return (
    <div 
      onClick={() => onClick(item.id)}
      className="bg-elevated border border-subtle rounded-lg p-5 cursor-pointer transition-all duration-200 hover:border-border hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] active:translate-y-0 active:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider",
          typeStyles[displayType]
        )}>
          {item.status === "open" ? "Open" : typeLabels[displayType]}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(item.id);
          }}
          className={cn(
            "w-6 h-6 flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-90",
            item.starred ? "text-[hsl(var(--gold))]" : "text-text-muted hover:text-[hsl(var(--gold))]"
          )}
        >
          <Star 
            className="w-3.5 h-3.5" 
            strokeWidth={1.5} 
            fill={item.starred ? "currentColor" : "none"} 
          />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-foreground leading-snug mb-1 line-clamp-2">
        {item.title}
      </h3>

      {/* Preview */}
      <p className="text-[13px] text-muted-foreground leading-snug mb-3 line-clamp-2">
        {item.preview}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 text-[11px] text-text-muted flex-wrap">
        <span>{item.status === "open" ? `Started ${item.date}` : item.date}</span>
        {item.category && (
          <span 
            className="px-1.5 py-0.5 bg-surface rounded cursor-pointer hover:bg-sage-subtle hover:text-sage transition-all duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {item.category}
          </span>
        )}
      </div>

      {/* Actions */}
      {(item.type === "insight" || item.type === "decision") && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-subtle">
          {item.type === "insight" && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); onAction?.("explore", item.id); }}
                className="px-2.5 py-1 bg-transparent border border-subtle rounded-sm text-[11px] text-text-muted hover:border-sage-muted hover:text-sage hover:bg-sage-subtle transition-all duration-150 active:scale-[0.96]"
              >
                Explore
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onAction?.("create-card", item.id); }}
                className="px-2.5 py-1 bg-transparent border border-subtle rounded-sm text-[11px] text-text-muted hover:border-sage-muted hover:text-sage hover:bg-sage-subtle transition-all duration-150 active:scale-[0.96]"
              >
                Create Card
              </button>
            </>
          )}
          {item.type === "decision" && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); onAction?.("view-brief", item.id); }}
                className="px-2.5 py-1 bg-transparent border border-subtle rounded-sm text-[11px] text-text-muted hover:border-sage-muted hover:text-sage hover:bg-sage-subtle transition-all duration-150 active:scale-[0.96]"
              >
                View Brief
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onAction?.(item.status === "resolved" ? "revisit" : "continue", item.id); }}
                className="px-2.5 py-1 bg-transparent border border-subtle rounded-sm text-[11px] text-text-muted hover:border-sage-muted hover:text-sage hover:bg-sage-subtle transition-all duration-150 active:scale-[0.96]"
              >
                {item.status === "resolved" ? "Revisit" : "Continue"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
