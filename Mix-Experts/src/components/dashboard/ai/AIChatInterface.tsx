'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const SUGGESTED_PROMPTS = [
    "Draft a proposal for a rock album mix",
    "Analyze my pricing strategy",
    "Write a follow-up email to a client",
    "Explain mastering loudness standards"
];

export const AIChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm your MixExperts Assistant. I can help you draft proposals, manage client communications, or answer technical questions. How can I help you today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Mock AI Response
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm a demo version of the assistant, but in the full version, I would generate a detailed response to your request: \"" + userMsg.content + "\".",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl overflow-hidden relative">
            {/* Header */}
            <div className="bg-[var(--bg-card)] border-b border-[var(--border-dark)] p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-400 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4 fill-white" />
                </div>
                <div>
                    <h3 className="text-white font-bold">Studio Assistant</h3>
                    <p className="text-xs text-[var(--text-gray)] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Online
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[var(--border-dark)] scrollbar-track-transparent">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-4 max-w-[85%]",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            {/* Avatar */}
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                                msg.role === 'user' ? "bg-[var(--bg-card)] border border-[var(--border-dark)]" : "bg-[var(--accent)]/10 text-[var(--accent)]"
                            )}>
                                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>

                            {/* Bubble */}
                            <div className={cn(
                                "p-4 rounded-2xl text-sm leading-relaxed",
                                msg.role === 'user'
                                    ? "bg-[var(--accent)] text-white rounded-tr-none"
                                    : "bg-[var(--bg-card)] border border-[var(--border-dark)] text-[var(--text-gray)] rounded-tl-none"
                            )}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4 max-w-[85%]"
                    >
                        <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0 mt-1">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-[var(--bg-card)] border border-[var(--border-dark)] p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-[var(--text-muted)] rounded-full animate-bounce" />
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions (only show if few messages) */}
            {messages.length < 3 && (
                <div className="px-6 pb-2">
                    <p className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-wider font-bold">Suggestions</p>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {SUGGESTED_PROMPTS.map((prompt, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(prompt)}
                                className="whitespace-nowrap px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-dark)] hover:border-[var(--accent)] text-xs text-[var(--text-gray)] rounded-full transition-colors"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border-dark)]">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..."
                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-[var(--accent)] resize-none h-[50px] scrollbar-none"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button className="p-2 text-[var(--text-muted)] hover:text-white transition-colors">
                            <Paperclip className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] text-center mt-2">
                    AI can make mistakes. Please verify important information.
                </p>
            </div>
        </div>
    );
};
