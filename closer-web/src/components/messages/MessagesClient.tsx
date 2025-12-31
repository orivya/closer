"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Check, CheckCheck, Mic, MoreHorizontal, Plus, Send, Image as ImageIcon, Smile, Sparkles } from "lucide-react";
import Link from "next/link";
import { WhisperMessage } from "./WhisperMessage";

// --- Types ---
type MessageType = "text" | "photo" | "voice" | "whisper";

interface Message {
    id: string;
    sender: "me" | "them";
    type: MessageType;
    content: string; // Text content or image URL
    timestamp: Date;
    metadata?: {
        duration?: string; // For voice
        isRead?: boolean;
        isLiked?: boolean;
    };
}

// --- Mock Data ---
const INITIAL_MESSAGES: Message[] = [
    {
        id: "m1",
        sender: "them",
        type: "text",
        content: "I was just looking at the moon and thinking of you. 🌙",
        timestamp: new Date(Date.now() - 86400000), // Yesterday
    },
    {
        id: "m2",
        sender: "me",
        type: "text",
        content: "I’m looking at it too. It’s beautiful tonight.",
        timestamp: new Date(Date.now() - 86340000),
        metadata: { isRead: true },
    },
    {
        id: "m4",
        sender: "me",
        type: "voice",
        content: "voice-note-mock",
        timestamp: new Date(Date.now() - 1800000), // 30 mins ago
        metadata: { duration: "0:14", isRead: true, isLiked: true },
    },
    {
        id: "m3",
        sender: "them",
        type: "whisper",
        content: "I found that book you were looking for! Surprise!",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
];

// --- Chat Engine Helper (Auto-Replies) ---
const AUTO_REPLIES = [
    "That makes me smile 😊",
    "Tell me more...",
    "I was just thinking the same thing!",
    "Can't wait to see you.",
    "Sending you a massive hug from here.",
    "You're the best, you know that? ❤️",
];

export function MessagesClient() {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: "me",
            type: "text",
            content: inputValue,
            timestamp: new Date(),
            metadata: { isRead: false },
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputValue("");

        // Simulate Partner Typng & Reply
        setTimeout(() => {
            setIsTyping(true);

            setTimeout(() => {
                setIsTyping(false);
                const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
                const replyMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    sender: "them",
                    type: "text",
                    content: randomReply,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, replyMessage]);
            }, 2500); // Typing duration

        }, 1000); // Delay before typing starts
    };

    const handleDoubleTap = (msgId: string) => {
        setMessages(prev => prev.map(m => {
            if (m.id === msgId) {
                return { ...m, metadata: { ...m.metadata, isLiked: !m.metadata?.isLiked } };
            }
            return m;
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <main className="flex-1 flex flex-col w-full h-full bg-[var(--base)] relative overflow-hidden">
            {/* Sticky Header - Added z-index relative to this container */}
            <header className="px-6 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl bg-[var(--base)]/80 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--stone)] font-serif text-lg border border-[var(--border-subtle)]">
                            E
                        </div>
                        {isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[var(--base)] rounded-full animate-pulse" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-[var(--sand)] text-base leading-tight">Emma</h3>
                        <div className="text-xs text-[var(--stone)] flex items-center gap-1.5">
                            {isTyping ? (
                                <span className="text-[var(--clay)] font-medium">typing...</span>
                            ) : (
                                <>
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block opacity-60" />
                                    Online
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <Link href="/us" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--surface-2)] transition-colors text-[var(--stone)]">
                    <MoreHorizontal size={20} />
                </Link>
            </header>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
                <div className="max-w-[680px] w-full mx-auto flex flex-col gap-6">

                    <div className="text-center text-xs font-semibold text-[var(--stone)] uppercase tracking-widest opacity-60 my-4">
                        Yesterday
                    </div>

                    {messages.map((msg, index) => {
                        const isMe = msg.sender === "me";
                        const isWhisper = msg.type === "whisper";
                        const isVoice = msg.type === "voice";
                        const isLiked = msg.metadata?.isLiked;

                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'} animate-in slide-in-from-bottom-2 duration-500`}
                            >
                                {isWhisper ? (
                                    <div className={!isMe ? "ml-2" : "mr-2"}>
                                        <WhisperMessage>{msg.content}</WhisperMessage>
                                    </div>
                                ) : (
                                    <div
                                        onDoubleClick={() => handleDoubleTap(msg.id)}
                                        className={`relative group transition-all duration-200 cursor-pointer select-none
                       ${isMe
                                                ? 'bg-gradient-to-br from-[var(--clay)] to-[var(--clay-dark)] text-white rounded-2xl rounded-br-sm'
                                                : 'bg-[var(--surface-2)] text-[var(--sand)] border border-[var(--border-subtle)] rounded-2xl rounded-bl-sm'
                                            }
                       ${isVoice ? 'p-3 flex items-center gap-3 min-w-[160px]' : 'px-5 py-3'}
                     `}
                                    >
                                        {isVoice ? (
                                            <>
                                                <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                                                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5" />
                                                </button>
                                                <div className="flex items-center gap-0.5 h-4">
                                                    {[...Array(12)].map((_, i) => (
                                                        <div key={i} className="w-1 bg-current rounded-full animate-pulse"
                                                            style={{
                                                                height: `${Math.max(4, Math.random() * 16)}px`,
                                                                opacity: 0.7,
                                                                animationDelay: `${i * 0.1}s`
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] opacity-80 font-mono ml-auto">{msg.metadata?.duration || "0:00"}</span>
                                            </>
                                        ) : (
                                            msg.content
                                        )}

                                        {/* Heart Reaction */}
                                        {isLiked && (
                                            <div className="absolute -bottom-2 -right-1 bg-[var(--surface-1)] rounded-full p-1 border border-[var(--border-subtle)] shadow-sm animate-in zoom-in spin-in-12 duration-300">
                                                <div className="bg-[var(--love)] rounded-full p-1">
                                                    <span className="sr-only">Liked</span>
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="none">
                                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Timestamp & Status */}
                                <div className={`mt-1.5 flex items-center gap-1 text-[11px] text-[var(--stone)] opacity-70 px-1 ${isMe ? 'justify-end' : ''}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                    {isMe && (
                                        msg.metadata?.isRead ? <CheckCheck size={12} className="text-[var(--clay)]" /> : <Check size={12} />
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Typing Indicator Bubble */}
                    {isTyping && (
                        <div className="self-start ml-2 bg-[var(--surface-2)] border border-[var(--border-subtle)] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center w-fit animate-pulse">
                            <div className="w-1.5 h-1.5 bg-[var(--stone)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 bg-[var(--stone)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-[var(--stone)] rounded-full animate-bounce" />
                        </div>
                    )}

                    {/* Spacer for fixed input + nav */}
                    <div ref={messagesEndRef} className="h-32 md:h-24" />
                </div>
            </div>

            {/* Input Area - Fixed at bottom, above nav on mobile */}
            <div className="fixed bottom-[calc(64px+env(safe-area-inset-bottom))] md:bottom-0 left-0 right-0 z-30 p-4 bg-[var(--base)]/90 backdrop-blur-md border-t border-[var(--border-subtle)] pb-4 md:pb-safe">
                <div className="max-w-[680px] mx-auto flex items-end gap-3">
                    <button className="p-3 text-[var(--stone)] hover:bg-[var(--surface-2)] rounded-full transition-colors flex-shrink-0">
                        <Plus size={24} />
                    </button>

                    <div className="flex-1 bg-[var(--surface-2)] border border-[var(--border-subtle)] rounded-[24px] px-4 py-2 flex items-center gap-2 focus-within:border-[var(--clay)] transition-colors shadow-sm">
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message Emma..."
                            className="flex-1 bg-transparent border-none outline-none text-[var(--sand)] placeholder-[var(--stone)]/50 resize-none h-[24px] py-1"
                            autoComplete="off"
                        />
                        <button className="text-[var(--stone)] hover:text-[var(--clay)] transition-colors p-1">
                            <Smile size={20} />
                        </button>
                    </div>

                    {inputValue.trim() ? (
                        <button
                            onClick={handleSendMessage}
                            className="h-12 w-12 rounded-full bg-[var(--clay)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--clay-dark)] active:scale-95 transition-all"
                        >
                            <Send size={20} className="ml-0.5" />
                        </button>
                    ) : (
                        <button className="h-12 w-12 rounded-full bg-[var(--surface-2)] border border-[var(--border-subtle)] text-[var(--stone)] flex items-center justify-center hover:bg-[var(--surface-1)] active:scale-95 transition-all">
                            <Mic size={20} />
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}
