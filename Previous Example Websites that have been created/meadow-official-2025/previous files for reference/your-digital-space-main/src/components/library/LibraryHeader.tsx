import { Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "insights" | "decisions" | "patterns" | "notes";

interface LibraryHeaderProps {
  stats: {
    total: number;
    insights: number;
    decisions: number;
    notes: number;
    weeklyGrowth: number;
  };
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  onNewNote: () => void;
}

const filters: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "insights", label: "Insights" },
  { id: "decisions", label: "Decisions" },
  { id: "patterns", label: "Patterns" },
  { id: "notes", label: "Notes" },
];

export function LibraryHeader({
  stats,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  onNewNote,
}: LibraryHeaderProps) {
  return (
    <header className="px-8 py-5 border-b border-subtle bg-elevated max-md:px-4">
      {/* Title Row */}
      <div className="flex items-center justify-between mb-4 max-sm:flex-col max-sm:items-start max-sm:gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Library</h1>
          <p className="text-[13px] text-muted-foreground">
            Your personal collection of insights, decisions, and reflections
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onNewNote}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-surface border border-border rounded-sm text-[13px] text-muted-foreground hover:bg-hover hover:text-foreground transition-all duration-150 active:scale-[0.97]"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
            New Note
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-6 py-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-semibold text-foreground">{stats.total}</span>
          <span className="text-xs text-text-muted">Items</span>
          {stats.weeklyGrowth > 0 && (
            <span className="text-[11px] text-sage ml-1">+{stats.weeklyGrowth} this week</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-semibold text-foreground">{stats.insights}</span>
          <span className="text-xs text-text-muted">Insights</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-semibold text-foreground">{stats.decisions}</span>
          <span className="text-xs text-text-muted">Decisions</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-semibold text-foreground">{stats.notes}</span>
          <span className="text-xs text-text-muted">Notes</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap max-sm:flex-col max-sm:items-stretch">
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs border transition-all duration-150 active:scale-[0.96]",
                activeFilter === filter.id
                  ? "bg-sage-subtle border-sage-muted text-sage"
                  : "bg-surface border-subtle text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-1.5 pr-7 bg-surface border border-subtle rounded-sm text-xs text-muted-foreground cursor-pointer appearance-none hover:border-border transition-all duration-150"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 8px center",
          }}
        >
          <option value="">All categories</option>
          <option value="self">Self</option>
          <option value="work">Work</option>
          <option value="relationships">Relationships</option>
          <option value="health">Health</option>
        </select>

        <div className="relative max-sm:w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" strokeWidth={2} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search library..."
            className="pl-8 pr-3 py-1.5 w-[180px] max-sm:w-full bg-surface border border-subtle rounded-sm text-xs text-foreground placeholder:text-text-muted focus:border-sage-muted focus:ring-2 focus:ring-sage-subtle transition-all duration-150 outline-none"
          />
        </div>
      </div>
    </header>
  );
}
