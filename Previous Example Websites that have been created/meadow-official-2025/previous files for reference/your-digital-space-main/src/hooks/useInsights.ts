import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export type InsightType = "theme" | "observation" | "constraint" | "strength" | "blind_spot" | "shift" | "next_move";

export interface Insight {
  id: string;
  type: InsightType;
  content: string;
  context: string | null;
  starred: boolean;
  resolved: boolean;
  dismissed: boolean;
  session_id: string | null;
  created_at: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Generate random threshold between min and max
function randomThreshold(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MAX_INSIGHTS_PER_SESSION = 6;

// Check for duplicate insights using word overlap
function isDuplicateInsight(newContent: string, existingInsights: { content: string }[]): boolean {
  const newWords = newContent.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  
  for (const existing of existingInsights) {
    const existingWords = existing.content.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    let overlap = 0;
    for (const word of newWords) {
      if (existingWords.includes(word)) overlap++;
    }
    
    const overlapRatio = overlap / Math.min(newWords.length, existingWords.length);
    if (overlapRatio > 0.5) return true;
  }
  
  return false;
}

export function useInsights(sessionId: string | null) {
  const { user, session } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Track last extraction message count
  const lastExtractionCountRef = useRef<number>(0);
  const lastSummaryCountRef = useRef<number>(0);
  const emptyInsightCountRef = useRef<number>(0);

  // Reset when session changes
  useEffect(() => {
    if (sessionId) {
      lastExtractionCountRef.current = 0;
      lastSummaryCountRef.current = 0;
      emptyInsightCountRef.current = 0;
    }
  }, [sessionId]);

  // Load existing insights and summary for a session
  const loadInsights = useCallback(async (targetSessionId: string) => {
    if (!user) return;

    // Fetch insights (excluding dismissed)
    const { data: insightsData, error: insightsError } = await supabase
      .from("insights")
      .select("*")
      .eq("session_id", targetSessionId)
      .eq("dismissed", false)
      .order("created_at", { ascending: true });

    if (insightsError) {
      console.error("Error loading insights:", insightsError);
    } else {
      setInsights((insightsData || []) as Insight[]);
    }

    // Fetch session summary
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .select("summary")
      .eq("id", targetSessionId)
      .maybeSingle();

    if (sessionError) {
      console.error("Error loading session summary:", sessionError);
    } else {
      setSummary(sessionData?.summary || null);
    }
  }, [user]);

  // Clear insights when session changes or resets
  const clearInsights = useCallback(() => {
    setInsights([]);
    setSummary(null);
    lastExtractionCountRef.current = 0;
    lastSummaryCountRef.current = 0;
    emptyInsightCountRef.current = 0;
  }, []);

  // Generate summary
  const generateSummary = useCallback(async (messages: Message[], currentSessionId: string) => {
    if (!session || !currentSessionId) return;

    try {
      console.log("Generating summary for session:", currentSessionId);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          currentSummary: summary,
        }),
      });

      if (!response.ok) {
        console.error("Failed to generate summary:", response.status);
        return;
      }

      const data = await response.json();
      const result = data.summary;

      console.log("Summary result:", result);

      if (result && result !== "none" && result !== "keep") {
        setSummary(result);
        
        // Save to database
        await supabase
          .from("sessions")
          .update({ summary: result })
          .eq("id", currentSessionId);
      }

    } catch (error) {
      console.error("Error generating summary:", error);
    }
  }, [session, summary]);

  // Extract insights
  const extractInsights = useCallback(async (messages: Message[], currentSessionId: string) => {
    if (!session || !user || !currentSessionId) return;

    // Stop if we've had 2 empty results in a row
    if (emptyInsightCountRef.current >= 2) {
      console.log("Stopping insight extraction - 2 empty results in a row");
      return;
    }

    // Check current insight count (excluding dismissed)
    const currentCount = insights.filter(i => !i.dismissed).length;
    if (currentCount >= MAX_INSIGHTS_PER_SESSION) {
      console.log("Max insights reached for session:", currentCount);
      return;
    }

    try {
      console.log("Extracting insights for session:", currentSessionId);

      // Get existing insights for context
      const existingInsights = insights
        .filter(i => !i.dismissed)
        .map(i => ({ type: i.type, content: i.content }));

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/extract-insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          existingInsights,
          sessionId: currentSessionId,
          remainingSlots: MAX_INSIGHTS_PER_SESSION - currentCount,
        }),
      });

      if (!response.ok) {
        console.error("Failed to extract insights:", response.status);
        return;
      }

      const data = await response.json();
      const extracted = data.insights;

      console.log("Extracted insights:", extracted);

      // Check if result is empty
      if (!extracted || !Array.isArray(extracted) || extracted.length === 0) {
        emptyInsightCountRef.current++;
        console.log("Empty insight result, count:", emptyInsightCountRef.current);
      } else {
        emptyInsightCountRef.current = 0;
      }

      // Save new insights to database
      const newInsights: Insight[] = [];

      if (Array.isArray(extracted)) {
        for (const item of extracted) {
          if (item && item.type && item.content) {
            // Check for duplicates using word overlap
            const isDuplicate = isDuplicateInsight(item.content, insights);
            if (!isDuplicate) {
              const { data: insertedData, error } = await supabase
                .from("insights")
                .insert({
                  user_id: user.id,
                  session_id: currentSessionId,
                  type: item.type,
                  content: item.content,
                  context: item.context || null,
                  starred: false,
                  resolved: false,
                  dismissed: false,
                })
                .select()
                .single();

              if (error) {
                console.error("Error saving insight:", error);
              } else if (insertedData) {
                newInsights.push(insertedData as Insight);
              }
            }
          }
        }
      }

      // Update state with new insights
      if (newInsights.length > 0) {
        setInsights(prev => [...prev, ...newInsights]);
        toast.success(`${newInsights.length} new insight${newInsights.length > 1 ? "s" : ""} discovered`, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error extracting insights:", error);
    }
  }, [session, user, insights]);

  // Check and trigger extractions based on message count
  // Only extract insights after 14+ messages since last extraction
  const checkAndExtract = useCallback(async (messages: Message[], currentSessionId: string) => {
    if (!currentSessionId || messages.length === 0) return;

    const messageCount = messages.length;
    const messagesSinceLastExtraction = messageCount - lastExtractionCountRef.current;
    const messagesSinceLastSummary = messageCount - lastSummaryCountRef.current;

    // Generate summary after 10+ messages since last summary
    if (messagesSinceLastSummary >= 10 || (messageCount >= 8 && lastSummaryCountRef.current === 0)) {
      lastSummaryCountRef.current = messageCount;
      generateSummary(messages, currentSessionId);
    }

    // Only extract insights after 14+ messages since last extraction
    // First extraction at 14 messages, then every 14-25 messages thereafter
    const threshold = lastExtractionCountRef.current === 0 ? 14 : randomThreshold(14, 25);
    if (messagesSinceLastExtraction >= threshold) {
      lastExtractionCountRef.current = messageCount;
      extractInsights(messages, currentSessionId);
    }
  }, [generateSummary, extractInsights]);

  // Star/unstar an insight
  const toggleStarInsight = useCallback(async (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    if (!insight) return;

    const newStarred = !insight.starred;

    const { error } = await supabase
      .from("insights")
      .update({ starred: newStarred })
      .eq("id", insightId);

    if (error) {
      console.error("Error updating insight:", error);
      toast.error("Failed to update insight");
    } else {
      setInsights(prev =>
        prev.map(i => (i.id === insightId ? { ...i, starred: newStarred } : i))
      );
      toast.success(newStarred ? "Saved to Library" : "Removed from Library");
    }
  }, [insights]);

  // Resolve an insight
  const resolveInsight = useCallback(async (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    if (!insight) return;

    const newResolved = !insight.resolved;

    const { error } = await supabase
      .from("insights")
      .update({ resolved: newResolved })
      .eq("id", insightId);

    if (error) {
      console.error("Error resolving insight:", error);
      toast.error("Failed to update insight");
    } else {
      setInsights(prev =>
        prev.map(i => (i.id === insightId ? { ...i, resolved: newResolved } : i))
      );
      toast.success(newResolved ? "Marked as resolved" : "Marked as open");
    }
  }, [insights]);

  // Dismiss an insight
  const dismissInsight = useCallback(async (insightId: string) => {
    const { error } = await supabase
      .from("insights")
      .update({ dismissed: true })
      .eq("id", insightId);

    if (error) {
      console.error("Error dismissing insight:", error);
      toast.error("Failed to dismiss insight");
    } else {
      setInsights(prev => prev.filter(i => i.id !== insightId));
      toast.success("Dismissed");
    }
  }, []);

  // Fetch starred insights for reflections tab
  const fetchStarredInsights = useCallback(async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from("insights")
      .select("*")
      .eq("user_id", user.id)
      .eq("starred", true)
      .eq("dismissed", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching starred insights:", error);
      return [];
    }

    return (data || []) as Insight[];
  }, [user]);

  return {
    insights,
    summary,
    isLoading,
    loadInsights,
    clearInsights,
    checkAndExtract,
    toggleStarInsight,
    resolveInsight,
    dismissInsight,
    fetchStarredInsights,
  };
}
