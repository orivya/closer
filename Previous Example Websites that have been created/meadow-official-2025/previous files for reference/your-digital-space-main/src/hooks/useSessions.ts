import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow, isToday, isYesterday, format } from "date-fns";

export interface Session {
  id: string;
  title: string | null;
  preview: string;
  updatedAt: string;
  formattedDate: string;
  group: string;
  insightCount: number;
}

export interface SessionMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  created_at: string;
}

function formatSessionDate(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
}

function getSessionGroup(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 7) return "This Week";
  if (daysDiff <= 30) return "This Month";
  return "Older";
}

export function useSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all sessions with their last message preview
  const fetchSessions = useCallback(async () => {
    if (!user) {
      setSessions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // Fetch sessions ordered by updated_at
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select("id, title, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (sessionsError) {
        console.error("Error fetching sessions:", sessionsError);
        setIsLoading(false);
        return;
      }

      if (!sessionsData || sessionsData.length === 0) {
        setSessions([]);
        setIsLoading(false);
        return;
      }

      // For each session, fetch the most recent message for preview and insight count
      const sessionsWithPreviews = await Promise.all(
        sessionsData.map(async (session) => {
          const { data: messageData } = await supabase
            .from("messages")
            .select("content, role")
            .eq("session_id", session.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          // Get first user message for title fallback
          const { data: firstUserMessage } = await supabase
            .from("messages")
            .select("content")
            .eq("session_id", session.id)
            .eq("role", "user")
            .order("created_at", { ascending: true })
            .limit(1)
            .maybeSingle();

          // Get insight count for this session
          const { count: insightCount } = await supabase
            .from("insights")
            .select("*", { count: "exact", head: true })
            .eq("session_id", session.id)
            .eq("dismissed", false);

          const date = new Date(session.updated_at);
          const preview = messageData?.content?.slice(0, 60) || "";
          const title = session.title || firstUserMessage?.content?.slice(0, 50) || "New conversation";

          return {
            id: session.id,
            title: title,
            preview: preview.length >= 60 ? preview + "..." : preview,
            updatedAt: session.updated_at,
            formattedDate: formatSessionDate(date),
            group: getSessionGroup(date),
            insightCount: insightCount || 0,
          };
        })
      );

      setSessions(sessionsWithPreviews);
    } catch (error) {
      console.error("Error in fetchSessions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Fetch messages for a specific session
  const fetchSessionMessages = useCallback(async (sessionId: string): Promise<SessionMessage[]> => {
    const { data, error } = await supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching session messages:", error);
      return [];
    }

    return (data || []).map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.content,
      timestamp: new Date(msg.created_at).toLocaleTimeString("en-US", { 
        hour: "numeric", 
        minute: "2-digit" 
      }),
      created_at: msg.created_at,
    }));
  }, []);

  // Rename a session
  const renameSession = useCallback(async (sessionId: string, newTitle: string) => {
    const { error } = await supabase
      .from("sessions")
      .update({ title: newTitle })
      .eq("id", sessionId);

    if (error) {
      console.error("Error renaming session:", error);
      return false;
    }

    // Update local state immediately
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s))
    );
    return true;
  }, []);

  // Delete a session
  const deleteSession = useCallback(async (sessionId: string) => {
    const { error } = await supabase
      .from("sessions")
      .delete()
      .eq("id", sessionId);

    if (error) {
      console.error("Error deleting session:", error);
      return false;
    }

    // Update local state immediately
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    return true;
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Refresh sessions (call after new message or session created)
  const refreshSessions = useCallback(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    isLoading,
    fetchSessionMessages,
    refreshSessions,
    renameSession,
    deleteSession,
  };
}
