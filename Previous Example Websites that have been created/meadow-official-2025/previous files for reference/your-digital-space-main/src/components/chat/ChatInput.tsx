import { Send } from "lucide-react";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";

const intentPills = [
  { id: "untangle", label: "Untangle", placeholder: "What feels tangled or unclear right now?" },
  { id: "decide", label: "Decide", placeholder: "What decision are you weighing?" },
  { id: "reflect", label: "Reflect", placeholder: "What would you like to reflect on?" },
  { id: "plan", label: "Plan", placeholder: "What are you trying to figure out?" },
];

export interface ChatInputHandle {
  focus: () => void;
  setInput: (value: string) => void;
}

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  showIntentPills?: boolean;
}

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  ({ onSend, disabled, showIntentPills = true }, ref) => {
    const [message, setMessage] = useState("");
    const [activeIntent, setActiveIntent] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        textareaRef.current?.focus();
      },
      setInput: (value: string) => {
        setMessage(value);
        // Trigger resize
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + "px";
          }
        }, 0);
      },
    }));

    const placeholder = activeIntent 
      ? intentPills.find(p => p.id === activeIntent)?.placeholder 
      : "Share what you're thinking about...";

    const handleSend = () => {
      if (!message.trim() || disabled) return;
      onSend(message.trim());
      setMessage("");
      setActiveIntent(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const handleInput = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + "px";
      }
    };

    return (
      <div className="px-6 pb-5 pt-4 border-t border-subtle bg-background">
        <div className="max-w-[680px] mx-auto">
          {/* Intent Pills */}
          {showIntentPills && (
            <div className="flex gap-2 mb-3 flex-wrap justify-center">
              {intentPills.map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setActiveIntent(activeIntent === pill.id ? null : pill.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[13px] border transition-all duration-150 active:scale-[0.97]",
                    activeIntent === pill.id
                      ? "bg-sage-subtle border-sage-muted text-sage"
                      : "bg-elevated border-subtle text-muted-foreground hover:border-border hover:text-foreground hover:bg-surface"
                  )}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Field */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
                className="w-full py-4 px-4 pr-14 bg-elevated border border-border rounded-lg text-[15px] text-foreground placeholder:text-text-muted resize-none min-h-[52px] max-h-[140px] focus:border-sage-muted focus:ring-[3px] focus:ring-sage-subtle transition-all duration-150 outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || disabled}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md transition-all duration-150 active:scale-[0.93]",
                  message.trim() && !disabled
                    ? "bg-sage opacity-100 hover:bg-sage-light"
                    : "bg-sage opacity-40"
                )}
              >
                <Send className="w-4 h-4 text-white" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";
