import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from '../types';
import { DepthLevel, DEPTH_LEVELS, IntentPill, INTENT_PILLS } from '../types/essence';
import {
    Send,
    Plus,
    Bookmark,
    MoreHorizontal,
    History,
    PanelRightOpen,
    StopCircle, // Added
    ArrowUp,    // Added
    Check,       // Added if needed
    Mic
} from 'lucide-react';
import { EssenceAvatar, EssenceWelcome } from '@/components/EssenceAvatar';
import { DepthSelector, DepthIndicator } from '../components/essence/DepthSelector';
import { IntentPills, IntentBadge } from '../components/essence/IntentPills';
import { LensPanel } from '../components/essence/LensPanel';
import { LensState, ExtractedInsight } from '../types/essence';
import { useAuth } from '../contexts/AuthContext';

interface EssenceProps {
    onChangeView: (view: ViewState) => void;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// Sample responses based on depth level
const getDepthResponses = (depth: DepthLevel): string[] => {
    switch (depth) {
        case 'vent':
            return [
                "I'm here. Take your time.",
                "That sounds really heavy. I'm listening.",
                "Let it out. There's no judgment here.",
                "I hear you.",
                "Sometimes we just need to say it out loud.",
            ];
        case 'reflect':
            return [
                "I hear what you're saying. What feels most important about that?",
                "That's interesting. What made you think of that today?",
                "What would it look like if things were different?",
                "How does that sit with you when you say it out loud?",
                "What part of this feels most alive right now?",
            ];
        case 'explore':
            return [
                "Let's dig into that. What do you think is at the core of it?",
                "That's an interesting perspective. What would it look like from another angle?",
                "I notice something interesting there. What if the opposite were true?",
                "What pattern do you see when you look at this alongside other parts of your life?",
                "What would you tell a friend who said this to you?",
            ];
        case 'deep':
            return [
                "There's something beneath what you're saying that I want to explore. What aren't you letting yourself see?",
                "If you had to bet, what truth are you avoiding right now?",
                "What would change if you stopped explaining and just felt this?",
                "I notice you keep coming back to this. What's the question you're afraid to ask?",
                "What if the answer isn't what you want, but what you need?",
            ];
    }
};

// Initial lens state
const initialLensState: LensState = {
    isOpen: false,
    summary: null,
    focus: null,
    shift: null,
    threads: [],
    blindSpots: [],
    actions: [],
    insightCount: 0,
};

const Essence: React.FC<EssenceProps> = ({ onChangeView }) => {
    const { profile } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [depthLevel, setDepthLevel] = useState<DepthLevel>('reflect');
    const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
    const [showLensPanel, setShowLensPanel] = useState(false);
    const [lensState, setLensState] = useState<LensState>(initialLensState);
    const [lensLoading, setLensLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const userName = profile?.display_name || 'friend';
    const conversationStarted = messages.length > 0;
    const depthConfig = DEPTH_LEVELS[depthLevel];

    // Scroll to bottom when messages change
    useEffect(() => {
        if (conversationStarted) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, conversationStarted]);

    // Focus input when conversation starts
    useEffect(() => {
        if (conversationStarted && inputRef.current) {
            inputRef.current.focus();
        }
    }, [conversationStarted]);

    const handleSend = (content?: string) => {
        const messageContent = content || inputValue.trim();
        if (!messageContent) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageContent,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response based on depth level
        setTimeout(() => {
            setIsTyping(false);
            const responses = getDepthResponses(depthLevel);
            const response = responses[Math.floor(Math.random() * responses.length)];
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        }, depthLevel === 'vent' ? 800 : 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleIntentSelect = (intent: IntentPill) => {
        setSelectedIntent(intent.id);
        setInputValue(intent.prompt);
        inputRef.current?.focus();
    };

    const handleDepthChange = (depth: DepthLevel) => {
        setDepthLevel(depth);
        // In vent mode, hide lens panel
        if (depth === 'vent') {
            setShowLensPanel(false);
        }
    };

    const handleNewSession = () => {
        setMessages([]);
        setSelectedIntent(null);
        setDepthLevel('reflect');
        setLensState(initialLensState);
    };

    const toggleLensPanel = () => {
        if (depthConfig.lensVisible) {
            setShowLensPanel(!showLensPanel);
        }
    };

    const handleSaveInsight = (insight: ExtractedInsight) => {
        // TODO: Save to database via service
        console.log('Saving insight:', insight);
    };

    const handleExploreInsight = (insight: ExtractedInsight) => {
        // TODO: Start new conversation thread about this insight
        console.log('Exploring insight:', insight);
        setInputValue(`I want to explore this further: "${insight.content}"`);
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#faf9f7] overflow-hidden">
            {/* Header */}
            <header className="h-14 px-4 md:px-6 flex items-center justify-between border-b border-stone-200/60 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <EssenceAvatar size="nav" />
                    <div>
                        <h1 className="text-[15px] font-semibold text-stone-800 tracking-tight">
                            Essence
                        </h1>
                        {/* Status / Mode Indicator */}
                        {conversationStarted && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <DepthIndicator depth={depthLevel} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    {/* Depth Selector (compact in header) */}
                    {conversationStarted && (
                        <DepthSelector
                            selectedDepth={depthLevel}
                            onSelect={handleDepthChange}
                            compact
                        />
                    )}

                    {/* Lens Panel Toggle */}
                    {conversationStarted && depthConfig.lensVisible && (
                        <button
                            onClick={toggleLensPanel}
                            className={`p-2 rounded-lg transition-colors ${showLensPanel
                                ? 'bg-sage-100 text-sage-600'
                                : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
                                }`}
                            title="Toggle Lens panel"
                        >
                            <PanelRightOpen size={18} />
                        </button>
                    )}

                    {/* Session History */}
                    <button
                        className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                        title="Session history"
                    >
                        <History size={18} />
                    </button>

                    {/* New Session */}
                    <button
                        onClick={handleNewSession}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                        <Plus size={14} />
                        New
                    </button>

                    {/* More Options */}
                    <button className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Messages Area */}
                <div className={`flex-1 flex flex-col transition-all duration-300 ${showLensPanel ? 'mr-80' : ''}`}>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center min-h-full py-8 animate-fade-in">
                                <div className="mb-6 scale-110">
                                    <EssenceWelcome />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-serif text-stone-800 text-center mb-3">
                                    Hey {userName}, what's on your mind?
                                </h2>
                                <p className="text-stone-500 text-center max-w-md text-sm leading-relaxed mb-8">
                                    I'm here to help you think through decisions, explore what matters, or simply listen when you need to process your thoughts.
                                </p>

                                <div className="mb-8 w-full max-w-lg">
                                    <DepthSelector
                                        selectedDepth={depthLevel}
                                        onSelect={handleDepthChange}
                                    />
                                </div>

                                <IntentPills
                                    onSelect={handleIntentSelect}
                                    selectedIntent={selectedIntent}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-center py-4">
                                    <div className="bg-stone-100/50 px-3 py-1 rounded-full text-[10px] font-medium text-stone-400 uppercase tracking-widest">
                                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </div>
                                </div>

                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="flex-shrink-0 mt-1 mr-3">
                                                <EssenceAvatar size="preview" />
                                            </div>
                                        )}
                                        <div
                                            className={`
                                    max-w-[85%] md:max-w-[75%] p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm
                                    ${msg.role === 'user'
                                                    ? 'bg-white text-stone-800 border border-stone-200 rounded-tr-sm'
                                                    : 'bg-white/80 backdrop-blur-sm text-stone-800 border-l-4 border-l-sage-400 border-y border-r border-stone-100 rounded-tl-sm'
                                                }
                                  `}
                                        >
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start animate-in fade-in">
                                        <div className="flex-shrink-0 mt-1 mr-3">
                                            <EssenceAvatar size="preview" />
                                        </div>
                                        <div className="bg-white/50 border border-stone-100 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                                            <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                            <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                            <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 md:p-6 bg-[#faf9f7] relative z-20">
                        <div className="max-w-3xl mx-auto relative glass-card p-1.5 rounded-3xl shadow-lg shadow-stone-200/50">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={
                                    depthLevel === 'deep'
                                        ? "What's really going on beneath the surface?"
                                        : "Type your message..."
                                }
                                className="w-full pl-5 pr-14 py-3.5 bg-transparent rounded-2xl text-stone-800 placeholder:text-stone-400 focus:outline-none text-[15px]"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <button
                                    disabled={!inputValue.trim() && !isTyping}
                                    onClick={() => handleSend(inputValue)}
                                    className={`
                                p-2 rounded-full transition-all duration-300
                                ${inputValue.trim()
                                            ? 'bg-sage-500 text-white shadow-md hover:bg-sage-600 hover:scale-105'
                                            : 'bg-stone-100 text-stone-300'
                                        }
                            `}
                                >
                                    {isTyping ? <StopCircle size={20} /> : <ArrowUp size={20} />}
                                </button>
                            </div>
                        </div>
                        <p className="text-center text-[10px] text-stone-400 mt-3 font-medium tracking-wide">
                            Essence can make mistakes. Consider checking important information.
                        </p>
                    </div>

                </div>

                {/* Lens Panel */}
                {showLensPanel && depthConfig.lensVisible && (
                    <div className="absolute right-0 top-0 bottom-0 animate-in slide-in-from-right duration-200 z-10 h-full">
                        <LensPanel
                            lensState={lensState}
                            onClose={() => setShowLensPanel(false)}
                            onSaveInsight={handleSaveInsight}
                            onExploreInsight={handleExploreInsight}
                            isLoading={lensLoading}
                        />
                    </div>
                )}
            </div>

            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Essence;
