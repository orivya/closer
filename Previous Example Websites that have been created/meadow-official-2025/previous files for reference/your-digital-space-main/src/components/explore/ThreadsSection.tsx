import { MessageSquare, Bookmark } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Thread {
  id: string;
  text: string;
}

interface ThreadsSectionProps {
  threads: Thread[];
  onStartThread: (topic: string) => void;
}

export function ThreadsSection({ threads, onStartThread }: ThreadsSectionProps) {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newBookmarked = new Set(bookmarked);
    if (newBookmarked.has(id)) {
      newBookmarked.delete(id);
      toast.success("Removed from Library");
    } else {
      newBookmarked.add(id);
      toast.success("Saved to Library");
    }
    setBookmarked(newBookmarked);
  };

  return (
    <section className="mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.3px] text-tertiary">
          Threads to Explore
        </span>
      </div>
      <p className="text-[13px] text-tertiary mb-4">
        Conversation starters based on your patterns
      </p>
      <div className="grid grid-cols-3 gap-4 max-[850px]:grid-cols-2 max-[550px]:grid-cols-1">
        {threads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => onStartThread(thread.text)}
            className="bg-elevated border border-border-subtle rounded-lg p-5 flex flex-col min-h-[160px] cursor-pointer transition-all duration-[250ms] hover:border-sage-muted hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)] active:translate-y-0 active:shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="w-7 h-7 bg-sage-subtle rounded-sm flex items-center justify-center">
                <MessageSquare className="w-3.5 h-3.5 text-sage" strokeWidth={1.5} />
              </div>
              <button
                onClick={(e) => toggleBookmark(thread.id, e)}
                className={`w-6 h-6 flex items-center justify-center rounded-sm transition-all duration-150 hover:scale-110 active:scale-90 ${
                  bookmarked.has(thread.id) ? "text-sage" : "text-text-muted hover:text-sage"
                }`}
              >
                <Bookmark
                  className="w-4 h-4"
                  strokeWidth={1.5}
                  fill={bookmarked.has(thread.id) ? "currentColor" : "none"}
                />
              </button>
            </div>
            <p className="text-sm font-medium text-foreground leading-normal flex-1">
              "{thread.text}"
            </p>
            <div className="flex items-center gap-1 mt-4 text-xs font-medium text-sage">
              Start conversation →
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
