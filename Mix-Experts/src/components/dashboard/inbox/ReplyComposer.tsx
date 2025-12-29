'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, Loader2, FileText } from 'lucide-react';
import { useTemplates } from '@/hooks/useTemplates';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ReplyComposerProps {
  threadId: string;
  recipientId: string;
  onSent?: () => void;
}

export const ReplyComposer: React.FC<ReplyComposerProps> = ({
  threadId,
  recipientId,
  onSent,
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { templates, getActiveTemplates } = useTemplates();

  const activeTemplates = getActiveTemplates();

  const handleSend = async () => {
    if (!message.trim() || !user) return;

    setSending(true);
    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: threadId,
          recipient_id: recipientId,
          content: message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      toast.success('Message sent');
      onSent?.();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTemplateInsert = (templateBody: string) => {
    setMessage(templateBody);
    setShowTemplates(false);
    textareaRef.current?.focus();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="p-4 border-t border-[var(--border-dark)] bg-[var(--bg-base)]">
      {/* Template Selector */}
      {showTemplates && activeTemplates.length > 0 && (
        <div className="mb-2 p-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg max-h-40 overflow-y-auto">
          <div className="text-xs text-[var(--text-muted)] mb-2 px-2">Quick Templates</div>
          {activeTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateInsert(template.body)}
              className="w-full text-left px-2 py-1.5 text-sm text-white hover:bg-[var(--bg-hover)] rounded transition-colors"
            >
              <div className="font-medium">{template.name}</div>
              {template.subject && (
                <div className="text-xs text-[var(--text-muted)] truncate">
                  {template.subject}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="relative flex items-end gap-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl p-2 focus-within:border-[var(--accent)] focus-within:ring-1 focus-within:ring-[var(--accent)] transition-all">
        {/* Template Toggle Button */}
        {activeTemplates.length > 0 && (
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="p-2 text-[var(--text-muted)] hover:text-white transition-colors h-10 w-10 flex items-center justify-center rounded-lg hover:bg-[var(--bg-base)]"
            title="Use template"
          >
            <FileText className="w-5 h-5" />
          </button>
        )}

        {/* Attachment Button (placeholder) */}
        <button
          className="p-2 text-[var(--text-muted)] hover:text-white transition-colors h-10 w-10 flex items-center justify-center rounded-lg hover:bg-[var(--bg-base)]"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-[var(--text-faint)] resize-none py-2 max-h-32 text-sm leading-relaxed disabled:opacity-50"
          rows={1}
          style={{ minHeight: '40px' }}
        />

        <button
          onClick={handleSend}
          disabled={!message.trim() || sending}
          className="p-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-10 w-10 flex items-center justify-center shadow-lg"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
      <div className="text-center mt-2">
        <p className="text-[10px] text-[var(--text-muted)]">
          Press <span className="font-mono">Enter</span> to send, <span className="font-mono">Shift+Enter</span> for new line
        </p>
      </div>
    </div>
  );
};
