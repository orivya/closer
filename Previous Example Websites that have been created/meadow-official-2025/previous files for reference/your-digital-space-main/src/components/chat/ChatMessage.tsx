import { User } from "lucide-react";
import { useState, useMemo } from "react";
import { InsightBlock } from "./InsightBlock";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sessionId?: string | null;
  onResonates?: () => void;
  onSave?: () => void;
  onAddNote?: () => void;
  onExploreInsight?: (prompt: string) => void;
}

interface ParsedPart {
  type: 'text' | 'insight';
  content?: string;
  title?: string;
  insightContent?: string;
}

function parseMessageContent(content: string): ParsedPart[] {
  const insightRegex = /\[INSIGHT\]\s*title:\s*(.+?)\s*content:\s*(.+?)\s*\[\/INSIGHT\]/gs;
  
  const parts: ParsedPart[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = insightRegex.exec(content)) !== null) {
    // Add text before the insight
    if (match.index > lastIndex) {
      const textContent = content.slice(lastIndex, match.index).trim();
      if (textContent) {
        parts.push({
          type: 'text',
          content: textContent
        });
      }
    }
    
    // Add the insight
    parts.push({
      type: 'insight',
      title: match[1].trim(),
      insightContent: match[2].trim()
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    const textContent = content.slice(lastIndex).trim();
    if (textContent) {
      parts.push({
        type: 'text',
        content: textContent
      });
    }
  }
  
  // If no parts were created (no insight blocks), return the whole content as text
  if (parts.length === 0) {
    parts.push({
      type: 'text',
      content: content
    });
  }
  
  return parts;
}

export function ChatMessage({ 
  role, 
  content, 
  timestamp,
  sessionId,
  onResonates,
  onSave,
  onAddNote,
  onExploreInsight
}: ChatMessageProps) {
  const { user } = useAuth();
  const [savedInsights, setSavedInsights] = useState<Set<string>>(new Set());
  
  const parsedContent = useMemo(() => parseMessageContent(content), [content]);

  const handleSaveInsight = async (title: string, insightContent: string) => {
    if (!user || !sessionId) {
      toast.error("Unable to save insight");
      return;
    }

    const insightKey = `${title}-${insightContent}`;
    if (savedInsights.has(insightKey)) return;

    try {
      const { error } = await supabase
        .from("insights")
        .insert({
          user_id: user.id,
          session_id: sessionId,
          type: "observation",
          content: `${title}: ${insightContent}`,
          starred: true,
        });

      if (error) throw error;

      setSavedInsights(prev => new Set(prev).add(insightKey));
      toast.success("Saved to Library");
    } catch (error) {
      console.error("Error saving insight:", error);
      toast.error("Failed to save insight");
    }
  };

  const handleExploreInsight = (title: string) => {
    if (onExploreInsight) {
      onExploreInsight(`Tell me more about this insight: "${title}"`);
    }
  };

  return (
    <div className="flex gap-4 animate-message-in">
      {/* Avatar */}
      {role === "assistant" ? (
        <div
          className="w-8 h-7 flex-shrink-0 relative isolate overflow-visible"
          style={{ WebkitTransformStyle: "preserve-3d" }}
        >
          <div
            className="w-full h-full animate-message-avatar-breathe overflow-visible"
            style={{
              background: "linear-gradient(155deg, hsl(var(--sage-light)) 0%, hsl(var(--primary)) 50%, hsl(var(--sage-dark)) 100%)",
              borderRadius: "75% 25% 65% 35% / 60% 40% 60% 40%",
              boxShadow: "0 4px 16px hsla(var(--primary), 0.25)",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              WebkitTransform: "translateZ(0)",
              transform: "translateZ(0)",
              outline: "none",
              border: "none",
            }}
          >
            <div
              className="absolute top-[38%] left-[42%] -translate-x-1/2 flex gap-2"
              style={{ outline: "none", border: "none", background: "transparent" }}
            >
              <div className="w-[3px] h-[3px] rounded-full bg-white/95" />
              <div className="w-[2.5px] h-[2.5px] rounded-full bg-white/90" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-surface border border-border rounded-sm">
          <User className="w-3.5 h-3.5 text-tertiary-foreground" strokeWidth={1.5} />
        </div>
      )}

      {/* Message Body */}
      <div className="flex-1 min-w-0">
        {parsedContent.map((part, index) => {
          if (part.type === 'text' && part.content) {
            return (
              <div key={index} className="text-[15px] leading-relaxed text-foreground">
                {part.content.split('\n').map((paragraph, i) => (
                  <p key={i} className={i > 0 ? "mt-3" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>
            );
          }
          
          if (part.type === 'insight' && part.title && part.insightContent) {
            const insightKey = `${part.title}-${part.insightContent}`;
            return (
              <InsightBlock
                key={index}
                title={part.title}
                content={part.insightContent}
                isSaved={savedInsights.has(insightKey)}
                onExplore={() => handleExploreInsight(part.title!)}
                onSave={() => handleSaveInsight(part.title!, part.insightContent!)}
              />
            );
          }
          
          return null;
        })}

        <div className="font-mono text-[10px] text-text-muted mt-2">
          {timestamp}
        </div>
      </div>
    </div>
  );
}
