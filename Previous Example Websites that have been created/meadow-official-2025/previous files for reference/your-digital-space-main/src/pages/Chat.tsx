import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { SessionsDrawer } from "@/components/chat/SessionsDrawer";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { WelcomeState } from "@/components/chat/WelcomeState";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ThinkingIndicator } from "@/components/chat/ThinkingIndicator";
import { ChatInput, ChatInputHandle } from "@/components/chat/ChatInput";
import { ClarityRail } from "@/components/chat/ClarityRail";
import { NoteModal } from "@/components/chat/NoteModal";
import { MobileNav } from "@/components/chat/MobileNav";
import { RailToggleMobile } from "@/components/chat/RailToggleMobile";
import { useChat } from "@/hooks/useChat";
import { useSessions } from "@/hooks/useSessions";
import { useInsights } from "@/hooks/useInsights";
import { useDecisions } from "@/hooks/useDecisions";

export default function Chat() {
  const [searchParams] = useSearchParams();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [railOpen, setRailOpen] = useState(false);
  const [lensOpen, setLensOpen] = useState(true);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputHandle>(null);

  const { 
    messages, 
    isLoading,
    isTyping,
    sendMessage, 
    resetConversation, 
    loadSession, 
    profile, 
    currentSessionId,
    messageCount 
  } = useChat();
  
  const { 
    sessions, 
    isLoading: sessionsLoading, 
    refreshSessions,
    renameSession,
    deleteSession,
  } = useSessions();

  const {
    insights,
    summary,
    loadInsights,
    clearInsights,
    checkAndExtract,
    dismissInsight,
  } = useInsights(currentSessionId);

  const userName = profile?.name || searchParams.get("name") || undefined;
  const isWelcome = searchParams.get("welcome") === "true";
  const conversationStarted = messages.length > 0;

  // Scroll to bottom when messages change
  useEffect(() => {
    if (conversationStarted) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, conversationStarted]);

  useEffect(() => {
    if (isWelcome && userName) {
      toast.success(`Welcome, ${userName}! Let's begin your journey.`);
    }
  }, [isWelcome, userName]);

  // Refresh sessions when a new message is sent
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      refreshSessions();
    }
  }, [currentSessionId, messages.length, refreshSessions]);

  // Check for insight extraction when messages change
  useEffect(() => {
    if (currentSessionId && messages.length > 0 && !isLoading) {
      const chatMessages = messages.map(m => ({ role: m.role, content: m.content }));
      checkAndExtract(chatMessages, currentSessionId);
    }
  }, [messages, currentSessionId, isLoading, checkAndExtract]);

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const handleNewSession = () => {
    resetConversation();
    clearInsights();
  };

  const handleSelectSession = async (sessionId: string) => {
    await loadSession(sessionId);
    await loadInsights(sessionId);
  };

  const handleSaveNote = (note: string) => {
    toast.success("Note saved to Library");
  };

  const handleDeleteCurrentSession = async () => {
    if (currentSessionId) {
      const success = await deleteSession(currentSessionId);
      if (success) {
        handleNewSession();
      }
    }
  };

  const handleExploreInsight = (content: string) => {
    const prompt = `Tell me more about: "${content}"`;
    chatInputRef.current?.setInput(prompt);
    chatInputRef.current?.focus();
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar */}
      <ChatSidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />

      {/* Sessions Drawer */}
      <SessionsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNewSession={handleNewSession}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        sessions={sessions}
        isLoading={sessionsLoading}
        onRenameSession={renameSession}
        onDeleteSession={async (id) => {
          const success = await deleteSession(id);
          if (success && id === currentSessionId) {
            handleNewSession();
          }
          return success;
        }}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 max-xs:pb-16">
        <ChatHeader
          title={conversationStarted ? "Current Session" : "What's on your mind?"}
          startTime="Started now"
          insightsCount={insights.filter(i => !i.dismissed).length}
          onToggleDrawer={() => setDrawerOpen(!drawerOpen)}
          onNewSession={handleNewSession}
          onOpenNote={() => setNoteModalOpen(true)}
          onToggleLens={() => setLensOpen(!lensOpen)}
          lensOpen={lensOpen}
          onToggleRail={() => setRailOpen(true)}
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <WelcomeState visible={!conversationStarted} userName={userName} />
          
          {conversationStarted && (
            <div className="max-w-[680px] w-full mx-auto px-6 py-6 flex flex-col gap-5 animate-fade-in">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                  sessionId={currentSessionId}
                  onResonates={() => toast.success("Marked as resonating")}
                  onSave={() => toast.success("Saved to Library")}
                  onAddNote={() => setNoteModalOpen(true)}
                  onExploreInsight={(prompt) => {
                    chatInputRef.current?.setInput(prompt);
                    chatInputRef.current?.focus();
                  }}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
          
          <ThinkingIndicator visible={isTyping} />
        </div>

        <ChatInput 
          ref={chatInputRef}
          onSend={handleSendMessage} 
          disabled={isLoading}
          showIntentPills={!conversationStarted}
        />
      </main>

      {/* Right Clarity Rail (hidden on mobile by default) */}
      {lensOpen && (
        <div className="hidden lg:block">
          <ClarityRail
            isOpen={true}
            onClose={() => setLensOpen(false)}
            insights={insights}
            summary={summary}
            onDismissInsight={dismissInsight}
            onExploreInsight={handleExploreInsight}
          />
        </div>
      )}

      {/* Mobile: Clarity Rail (slide in) */}
      <div className="lg:hidden">
        <ClarityRail
          isOpen={railOpen}
          onClose={() => setRailOpen(false)}
          insights={insights}
          summary={summary}
          onDismissInsight={dismissInsight}
          onExploreInsight={handleExploreInsight}
        />
      </div>

      {/* Mobile Rail Toggle - hidden when rail is open */}
      {!railOpen && (
        <RailToggleMobile onClick={() => setRailOpen(true)} />
      )}

      {/* Mobile Bottom Nav */}
      <MobileNav />

      {/* Note Modal */}
      <NoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSave={handleSaveNote}
      />
    </div>
  );
}
