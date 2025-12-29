import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Cloud, Clock, Check, Loader2 } from 'lucide-react';

interface BrainDumpProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

// Rotating opening prompts for variety
const OPENING_PROMPTS = [
  "Let it all out...",
  "What's swirling in your mind?",
  "No filter, no judgment...",
  "Empty the cup...",
  "Stream of consciousness: go.",
  "Clear the mental clutter...",
  "What's taking up space in your head?",
  "Release whatever needs releasing..."
];

// Timer options in minutes
const TIMER_OPTIONS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: 'Until done', value: null }
];

const BrainDump: React.FC<BrainDumpProps> = ({ onBack, onComplete }) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [openingPrompt] = useState(() =>
    OPENING_PROMPTS[Math.floor(Math.random() * OPENING_PROMPTS.length)]
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Word count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // Timer effect
  useEffect(() => {
    if (!timerActive || timeRemaining === null) return;

    if (timeRemaining <= 0) {
      setTimerActive(false);
      // Gentle completion trigger
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, timeRemaining]);

  // Start timer when user starts typing
  useEffect(() => {
    if (content.length > 0 && !hasStarted) {
      setHasStarted(true);
      if (selectedTimer !== null) {
        setTimeRemaining(selectedTimer * 60);
        setTimerActive(true);
      }
    }
  }, [content, hasStarted, selectedTimer]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer progress color
  const getTimerColor = () => {
    if (timeRemaining === null) return 'bg-sage-500';
    const totalSeconds = (selectedTimer || 0) * 60;
    const progress = timeRemaining / totalSeconds;
    if (progress > 0.5) return 'bg-sage-600';
    if (progress > 0.2) return 'bg-sage-400';
    return 'bg-stone-400';
  };

  // Handle save
  const handleSave = async () => {
    if (isSaving || !content.trim()) return;

    setIsSaving(true);
    try {
      const date = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Show completion animation first
      setShowCompletion(true);

      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      await onComplete(`Brain Dump - ${date}`, content);
    } catch (error) {
      console.error('Failed to save brain dump:', error);
      setShowCompletion(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate opacity based on scroll position for fading effect
  const calculateLineOpacity = useCallback((lineIndex: number, totalLines: number) => {
    if (totalLines <= 5) return 1;
    const fadeStartLine = Math.max(0, totalLines - 8);
    if (lineIndex < fadeStartLine) {
      const fadeProgress = (fadeStartLine - lineIndex) / fadeStartLine;
      return Math.max(0.3, 1 - fadeProgress * 0.7);
    }
    return 1;
  }, []);

  // Completion animation overlay
  if (showCompletion) {
    return (
      <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="text-center max-w-md">
          {/* Floating words animation */}
          <div className="relative h-32 mb-8 overflow-hidden">
            {['thought', 'worry', 'idea', 'feeling', 'memory'].map((word, i) => (
              <span
                key={word}
                className="absolute text-stone-400 font-serif text-lg opacity-0 animate-float-away"
                style={{
                  left: `${20 + i * 15}%`,
                  animationDelay: `${i * 200}ms`,
                }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Success icon */}
          <div className="w-20 h-20 bg-sage-50 text-sage-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in shadow-sm border border-sage-100">
            <Check size={40} strokeWidth={2} />
          </div>

          <h2 className="font-serif text-3xl text-sage-900 mb-3">Weight Released</h2>
          <p className="text-stone-500 mb-2">{wordCount} words captured</p>
          <p className="text-stone-400 text-sm">Your thoughts are safely stored</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-sage-100 bg-white/50 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="p-2 hover:bg-black/5 rounded-full transition-colors text-sage-600"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-600 flex items-center justify-center">
            <Cloud size={20} strokeWidth={1.5} />
          </div>
          <span className="text-xs font-bold text-sage-400 uppercase tracking-widest">
            Brain Dump
          </span>
        </div>

        {/* Timer indicator */}
        <div className="flex items-center gap-2">
          {timerActive && timeRemaining !== null && (
            (() => {
              const totalSeconds = (selectedTimer || 0) * 60;
              const elapsed = totalSeconds - timeRemaining;
              const showTimer = elapsed <= 30 || timeRemaining <= 30;

              if (!showTimer) return <div className="w-10" />;

              return (
                <div className={`flex items-center gap-2 transition-opacity duration-500 ${timeRemaining <= 30 ? 'animate-pulse' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${getTimerColor()} ${timeRemaining <= 30 ? 'animate-pulse' : ''}`} />
                  <span className={`text-sm font-mono ${timeRemaining <= 30 ? 'text-stone-600' : 'text-sage-400'}`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              );
            })()
          )}
          <div className="w-10" />
        </div>
      </div>

      {/* Timer selection (before starting) */}
      {!hasStarted && (
        <div className="px-6 py-4 border-b border-sage-100 bg-white/30 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3">
            <Clock size={16} className="text-sage-400" />
            <div className="flex gap-2">
              {TIMER_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedTimer(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTimer === option.value
                    ? 'bg-sage-600 text-white shadow-sm'
                    : 'bg-white border border-sage-100 text-sage-600 hover:border-sage-300'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main writing area - Stationery Sheet */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-gradient-to-br from-[#faf9f7] to-[#f0efe9]"
      >
        <div className="max-w-2xl mx-auto w-full px-8 py-12 min-h-screen shadow-[0_0_50px_-20px_rgba(0,0,0,0.05)] bg-white/40 my-4 rounded-sm border border-white/60">

          {/* Opening prompt */}
          {!hasStarted && (
            <p className="text-center text-sage-900 font-serif text-2xl mb-12 animate-fade-up opacity-60 italic">
              {openingPrompt}
            </p>
          )}

          {/* Infinite scroll textarea with fading effect */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-transparent border-none p-0 text-xl md:text-2xl font-serif text-sage-900 placeholder:text-sage-300/50 focus:ring-0 focus:outline-none resize-none leading-[1.8] min-h-[60vh] selection:bg-sage-200/40"
              placeholder="Just let it flow..."
              style={{
                maskImage: content.split('\n').length > 15
                  ? 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)'
                  : 'none',
                WebkitMaskImage: content.split('\n').length > 15
                  ? 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)'
                  : 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer with word count and save */}
      <div className="px-6 py-6 pb-28 lg:pb-10 border-t border-sage-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {/* Word count */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-serif italic text-sage-500">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
            {wordCount >= 100 && (
              <span className="text-xs font-bold text-sage-600 bg-sage-50 px-2 py-1 rounded-sm uppercase tracking-wider border border-sage-100">
                Flow State
              </span>
            )}
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!content.trim() || isSaving}
            className="group flex items-center gap-3 px-6 py-3 bg-sage-900 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 active:scale-95"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <span>I'm Done</span>
                <Check size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes float-away {
          0% {
            opacity: 0;
            transform: translateY(0) scale(1);
          }
          20% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(0.8);
          }
        }
        .animate-float-away {
          animation: float-away 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BrainDump;
