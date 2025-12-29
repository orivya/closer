import { Menu, Plus, Sparkles } from "lucide-react";
import { LensToggle } from "./LensToggle";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  title: string;
  startTime: string;
  insightsCount: number;
  onToggleDrawer: () => void;
  onNewSession: () => void;
  onOpenNote: () => void;
  onToggleLens?: () => void;
  lensOpen?: boolean;
  onToggleRail?: () => void;
}

export function ChatHeader({
  title,
  startTime,
  insightsCount,
  onToggleDrawer,
  onNewSession,
  onOpenNote,
  onToggleLens,
  lensOpen = true,
  onToggleRail,
}: ChatHeaderProps) {
  return (
    <header className="h-14 px-6 flex items-center justify-between border-b border-subtle bg-background">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleDrawer}
          className="w-9 h-9 flex items-center justify-center rounded-sm text-text-muted hover:bg-hover hover:text-foreground transition-all duration-150 active:scale-[0.95]"
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold text-foreground leading-tight">
            {title}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span>{startTime}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-text-muted" />
            <span className="text-sage font-medium">{insightsCount} insights</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Mobile Lens indicator - visible only on mobile */}
        {onToggleRail && (
          <button
            onClick={onToggleRail}
            className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-sage-subtle rounded-md text-xs font-medium text-sage hover:bg-sage/20 transition-all duration-150 active:scale-[0.97]"
            aria-label="Open insights panel"
          >
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
            {insightsCount > 0 && <span>{insightsCount}</span>}
          </button>
        )}
        <button
          onClick={onNewSession}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-subtle rounded-md text-xs text-text-muted hover:bg-hover hover:border-border hover:text-foreground transition-all duration-150 active:scale-[0.97]"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
          New
        </button>
        {onToggleLens && (
          <div className="hidden lg:block">
            <LensToggle isOpen={lensOpen} onClick={onToggleLens} />
          </div>
        )}
      </div>
    </header>
  );
}
