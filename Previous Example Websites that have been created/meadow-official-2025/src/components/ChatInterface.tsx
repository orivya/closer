import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MoreHorizontal } from 'lucide-react';

// Types for props
interface ChatInterfaceProps {
    companionName: string;
    companionPersonality: string; // 'witty' | 'wise' | 'gentle' etc
    avatarComponent: React.ReactNode;
    onClose: () => void;
    primaryColor?: string; // Hex code for accent
}

interface Message {
    id: string;
    sender: 'user' | 'companion';
    text: string;
    timestamp: Date;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    companionName,
    companionPersonality,
    avatarComponent,
    onClose,
    primaryColor = '#6B8F7A' // Sage green default
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        // Initial Greeting
        const timer = setTimeout(() => {
            addCompanionMessage(getInitialGreeting(companionName, companionPersonality));
        }, 600);

        // Focus input on mount
        if (inputRef.current) {
            inputRef.current.focus();
        }

        return () => clearTimeout(timer);
    }, []);

    const getInitialGreeting = (name: string, personality: string) => {
        if (personality.includes('witty')) return `Well hello! I was just contemplating the meaning of moss. You're just in time.`;
        if (personality.includes('warm')) return `Welcome, friend. The fire is warm and the tea is... abstract. How are you?`;
        if (personality.includes('dreamy')) return `Oh... hello. I was just weaving a cloud. Do you see shapes in the sky too?`;
        return `Greetings. I am ${name}. I am listening.`;
    };

    const getResponse = (text: string, personality: string) => {
        const lowerText = text.toLowerCase();

        // Simple keyword matching for "AI" feel without backend
        if (lowerText.includes('hello') || lowerText.includes('hi')) {
            return `Hello again! It is a good day to be present, don't you think?`;
        }
        if (lowerText.includes('name')) {
            return `I am ${companionName}. A name is just a label, but I'm fond of this one.`;
        }
        if (lowerText.includes('sad') || lowerText.includes('lonely')) {
            return `It is okay to feel that way. Even stones feel heavy sometimes. I am here with you.`;
        }
        if (lowerText.includes('joke') || lowerText.includes('funny')) {
            return `Why did the mushroom go to the party? Because he was a fungi! ...I'll see myself out.`;
        }

        // Fallback based on personality
        if (personality.includes('witty')) return `Interesting point! I'd nod, but my hat might fall off.`;
        if (personality.includes('warm')) return `I hear you. Tell me more, if you wish.`;

        return `*Thoughtful silence* ... That is something to ponder.`;
    };

    const addCompanionMessage = (text: string) => {
        setIsTyping(true);
        // Simulate thinking time
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                sender: 'companion',
                text,
                timestamp: new Date()
            }]);
        }, 1500);
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputValue,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Trigger companion response
        setTimeout(() => {
            addCompanionMessage(getResponse(inputValue, companionPersonality));
        }, 500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 w-[90vw] md:w-[380px] h-[600px] max-h-[80vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden font-sans animation-slide-up">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-stone-100 bg-[#FAF9F6]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-100 flex items-center justify-center border border-stone-200">
                        {/* Small Avatar Preview */}
                        <div className="scale-50 transform origin-center">
                            {avatarComponent}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-serif font-medium text-stone-800 text-lg">{companionName}</h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-500">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFFFFF]">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-[#5F754B] text-white rounded-br-none'
                                    : 'bg-[#F2F0E9] text-stone-800 rounded-bl-none'
                                }`}
                            style={msg.sender === 'user' ? { backgroundColor: primaryColor } : {}}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-[#F2F0E9] px-4 py-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                            <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-stone-100">
                <div className="flex items-center gap-2 bg-[#FAF9F6] rounded-full px-4 py-2 border border-stone-200 focus-within:border-stone-400 transition-colors">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent outline-none text-stone-700 placeholder-stone-400 text-sm"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className={`p-2 rounded-full transition-all ${inputValue.trim()
                                ? 'text-[#5F754B] hover:bg-stone-200'
                                : 'text-stone-300 cursor-not-allowed'
                            }`}
                        style={inputValue.trim() ? { color: primaryColor } : {}}
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-stone-400">Essence is an AI companion and may display inaccurate info.</p>
                </div>
            </div>

            <style>{`
          .animation-slide-up {
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
        </div>
    );
};

export default ChatInterface;
