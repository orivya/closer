import { MessageSquare, Bookmark } from "lucide-react";

interface InsightBlockProps {
  title: string;
  content: string;
  onExplore: () => void;
  onSave: () => void;
  isSaved?: boolean;
}

export function InsightBlock({ 
  title, 
  content, 
  onExplore, 
  onSave,
  isSaved = false
}: InsightBlockProps) {
  return (
    <div className="mt-5 p-5 bg-elevated border-l-[3px] border-l-primary rounded-r-xl shadow-card">
      <div className="font-mono text-[10px] font-semibold uppercase tracking-wide text-tertiary-foreground mb-3">
        Insight
      </div>
      <div className="text-[15px] font-semibold text-foreground mb-2 leading-snug">
        {title}
      </div>
      <div className="text-[14px] leading-relaxed text-secondary-foreground mb-5">
        {content}
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onExplore}
          className="inline-flex items-center gap-1.5 px-4 py-3 bg-sage-subtle border-none rounded-md font-sans text-[13px] font-medium text-primary cursor-pointer transition-all duration-150 hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-[0_4px_12px_hsla(var(--primary),0.3)] active:scale-[0.97]"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Explore
        </button>
        <button 
          onClick={onSave}
          disabled={isSaved}
          className={`inline-flex items-center gap-1.5 px-4 py-3 border-none rounded-md font-sans text-[13px] font-medium cursor-pointer transition-all duration-150 active:scale-[0.97] ${
            isSaved 
              ? 'bg-sage-subtle text-primary cursor-default' 
              : 'bg-transparent text-text-muted hover:bg-hover hover:text-foreground'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Saved' : 'Save to Library'}
        </button>
      </div>
    </div>
  );
}
