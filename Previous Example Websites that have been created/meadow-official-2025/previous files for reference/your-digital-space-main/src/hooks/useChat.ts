import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Profile {
  name: string | null;
  personality: string | null;
}

interface SessionContext {
  summary?: string | null;
  themes?: string[];
  observations?: string[];
  constraints?: string[];
  strengths?: string[];
  blindSpots?: string[];
  shifts?: string[];
}

export function useChat() {
  const { user, session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [titleGenerated, setTitleGenerated] = useState(false);
  const [sessionContext, setSessionContext] = useState<SessionContext | null>(null);

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("name, personality")
        .eq("id", user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (data) {
        setProfile(data);
      } else {
        setProfile({ name: null, personality: "balanced" });
      }
    }
    
    fetchProfile();
  }, [user]);

  // Fetch session context (summary + insights)
  const fetchSessionContext = useCallback(async (sessionId: string) => {
    try {
      // Fetch session summary
      const { data: sessionData } = await supabase
        .from("sessions")
        .select("summary")
        .eq("id", sessionId)
        .single();

      // Fetch insights for this session
      const { data: insightsData } = await supabase
        .from("insights")
        .select("type, content")
        .eq("session_id", sessionId);

      const context: SessionContext = {
        summary: sessionData?.summary,
        themes: [],
        observations: [],
        constraints: [],
        strengths: [],
        blindSpots: [],
        shifts: [],
      };

      if (insightsData) {
        insightsData.forEach((insight) => {
          switch (insight.type) {
            case "theme":
              context.themes?.push(insight.content);
              break;
            case "observation":
              context.observations?.push(insight.content);
              break;
            case "constraint":
              context.constraints?.push(insight.content);
              break;
            case "strength":
              context.strengths?.push(insight.content);
              break;
            case "blind_spot":
              context.blindSpots?.push(insight.content);
              break;
            case "shift":
              context.shifts?.push(insight.content);
              break;
          }
        });
      }

      setSessionContext(context);
      return context;
    } catch (error) {
      console.error("Error fetching session context:", error);
      return null;
    }
  }, []);

  // Generate smart title using AI
  const generateSmartTitle = useCallback(async (
    sessionId: string, 
    userMessage: string, 
    assistantMessage: string
  ) => {
    if (!session) return;

    try {
      console.log("Generating smart title for session:", sessionId);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-title`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userMessage, assistantMessage }),
      });

      if (!response.ok) {
        console.error("Failed to generate title:", response.status);
        return;
      }

      const data = await response.json();
      const title = data.title;

      if (title) {
        const { error } = await supabase
          .from("sessions")
          .update({ title })
          .eq("id", sessionId);

        if (error) {
          console.error("Error updating session title:", error);
        } else {
          console.log("Session title updated to:", title);
        }
      }
    } catch (error) {
      console.error("Error generating smart title:", error);
    }
  }, [session]);

  // Create a new session
  const createSession = useCallback(async () => {
    if (!user || !session) {
      console.error("No authenticated user or session");
      return null;
    }
    
    console.log("Creating session for user:", user.id);
    
    const { data, error } = await supabase
      .from("sessions")
      .insert({ user_id: user.id })
      .select("id")
      .single();
    
    if (error) {
      console.error("Error creating session:", error);
      return null;
    }
    
    console.log("Session created:", data.id);
    setCurrentSessionId(data.id);
    setTitleGenerated(false);
    setSessionContext(null);
    return data.id;
  }, [user, session]);

  // Save message to database
  const saveMessage = useCallback(async (sessionId: string, role: "user" | "assistant", content: string) => {
    const { error } = await supabase
      .from("messages")
      .insert({
        session_id: sessionId,
        role,
        content,
      });
    
    if (error) {
      console.error("Error saving message:", error);
    }
  }, []);


  // Stream chat response
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !session || isLoading) {
      console.error("Cannot send message - user:", !!user, "session:", !!session, "isLoading:", isLoading);
      return;
    }
    
    setIsLoading(true);
    setIsTyping(true);
    
    // Create session if needed
    let chatSessionId = currentSessionId;
    const isNewSession = !chatSessionId;
    if (!chatSessionId) {
      chatSessionId = await createSession();
      if (!chatSessionId) {
        toast.error("Failed to start conversation");
        setIsLoading(false);
        return;
      }
    }
    
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Save user message to DB
    await saveMessage(chatSessionId, "user", content);
    
    // Get current message count (including the new user message)
    const messageCount = messages.length + 1;
    
    // Fetch latest session context if we have a session
    let currentContext = sessionContext;
    if (chatSessionId && !isNewSession) {
      currentContext = await fetchSessionContext(chatSessionId);
    }
    
    // Prepare messages for API
    const apiMessages = [...messages, userMessage].map(m => ({
      role: m.role,
      content: m.content,
    }));
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: apiMessages,
          personality: profile?.personality || "balanced",
          userName: profile?.name,
          messageCount,
          sessionContext: currentContext,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }
      
      if (!response.body) {
        throw new Error("No response body");
      }
      
      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      const assistantMessageId = crypto.randomUUID();
      let textBuffer = "";
      let firstChunkReceived = false;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });
        
        // Process line-by-line
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            
            if (deltaContent) {
              // Hide typing indicator on first content chunk
              if (!firstChunkReceived) {
                firstChunkReceived = true;
                setIsTyping(false);
              }
              
              assistantContent += deltaContent;
              
              // Update or create assistant message
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && last.id === assistantMessageId) {
                  return prev.map((m, i) => 
                    i === prev.length - 1 
                      ? { ...m, content: assistantContent }
                      : m
                  );
                }
                return [...prev, {
                  id: assistantMessageId,
                  role: "assistant" as const,
                  content: assistantContent,
                  timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
                }];
              });
            }
          } catch {
            // Incomplete JSON, put it back
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
      
      // Save assistant message to DB
      if (assistantContent) {
        await saveMessage(chatSessionId, "assistant", assistantContent);
        
        // Generate smart title after first exchange
        if (isNewSession && !titleGenerated) {
          setTitleGenerated(true);
          generateSmartTitle(chatSessionId, content, assistantContent);
        }
      }
      
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [user, session, isLoading, currentSessionId, messages, profile, sessionContext, createSession, saveMessage, fetchSessionContext, generateSmartTitle, titleGenerated]);

  // Load an existing session with its messages
  const loadSession = useCallback(async (sessionId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("id, role, content, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading session messages:", error);
      toast.error("Failed to load conversation");
      return;
    }

    const loadedMessages: Message[] = (data || []).map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.content,
      timestamp: new Date(msg.created_at).toLocaleTimeString("en-US", { 
        hour: "numeric", 
        minute: "2-digit" 
      }),
    }));

    setMessages(loadedMessages);
    setCurrentSessionId(sessionId);
    setTitleGenerated(true);
    
    // Fetch context for the loaded session
    await fetchSessionContext(sessionId);
  }, [fetchSessionContext]);

  // Reset conversation
  const resetConversation = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
    setTitleGenerated(false);
    setSessionContext(null);
  }, []);

  return {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    resetConversation,
    loadSession,
    profile,
    currentSessionId,
    messageCount: messages.length,
  };
}
