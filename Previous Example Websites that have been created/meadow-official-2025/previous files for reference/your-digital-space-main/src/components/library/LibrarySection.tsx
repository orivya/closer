import { Star } from "lucide-react";
import { LibraryItem, LibraryItemCard } from "./LibraryItemCard";

interface LibrarySectionProps {
  title: string;
  count: number;
  items: LibraryItem[];
  showStar?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onToggleStar: (id: string) => void;
  onItemClick: (id: string) => void;
  onItemAction?: (action: string, id: string) => void;
}

export function LibrarySection({
  title,
  count,
  items,
  showStar = false,
  actionLabel,
  onAction,
  onToggleStar,
  onItemClick,
  onItemAction,
}: LibrarySectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-foreground flex items-center gap-3">
          {showStar && (
            <Star className="w-4 h-4 text-[hsl(var(--gold))]" strokeWidth={1.5} fill="hsl(var(--gold))" />
          )}
          {title}
          <span className="font-mono text-[11px] text-text-muted px-2 py-0.5 bg-surface rounded-full">
            {count}
          </span>
        </span>
        {actionLabel && (
          <button 
            onClick={onAction}
            className="text-xs text-sage hover:underline hover:opacity-80 transition-all duration-150"
          >
            {actionLabel}
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 max-sm:grid-cols-1">
        {items.map((item) => (
          <LibraryItemCard
            key={item.id}
            item={item}
            onToggleStar={onToggleStar}
            onClick={onItemClick}
            onAction={onItemAction}
          />
        ))}
      </div>
    </section>
  );
}
