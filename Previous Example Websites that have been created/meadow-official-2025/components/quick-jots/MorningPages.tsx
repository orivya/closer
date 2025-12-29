import React, { useState, useRef } from 'react';
import { X, Sun, Check, Loader2, Target, Flame, Feather, PenTool, Edit3 } from 'lucide-react';

interface MorningPagesProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

// Word count goals - using icons instead of emojis
const WORD_GOALS = [
  { words: 300, label: 'Quick start', Icon: Feather },
  { words: 500, label: 'Standard', Icon: PenTool },
  { words: 750, label: 'Full pages', Icon: Edit3 }
];

// 50 varied morning prompts for when someone needs inspiration
const MORNING_PROMPTS = [
  "How did you sleep last night?",
  "What's on your mind this morning?",
  "What are you looking forward to today?",
  "What do you need to let go of?",
  "How is your body feeling right now?",
  "What's one thing you want to accomplish today?",
  "What would make today feel complete?",
  "What are you grateful for this morning?",
  "What's been weighing on your mind?",
  "What does your ideal day look like?",
  "What small joy can you create today?",
  "How do you want to show up today?",
  "What lesson are you carrying from yesterday?",
  "What feels unfinished?",
  "What are you avoiding thinking about?",
  "What would you tell your past self?",
  "What's one thing you can let be easy today?",
  "What do you need most right now?",
  "What's calling for your attention?",
  "How can you take care of yourself today?",
  "What's one thing you're proud of?",
  "What fear can you acknowledge?",
  "What hope is alive in you?",
  "What relationship needs attention?",
  "What creative idea is asking to be explored?",
  "What boundary do you need to set?",
  "What are you resisting?",
  "What possibility excites you?",
  "What do you need to forgive?",
  "What truth are you not saying?",
  "What's one small step you can take today?",
  "What are you overthinking?",
  "What brings you energy?",
  "What drains you?",
  "What do you want to remember about this time?",
  "What question are you sitting with?",
  "What do you wish someone understood?",
  "What are you learning about yourself?",
  "What would courage look like today?",
  "What would kindness look like today?",
  "What's your body telling you?",
  "What dream lingers?",
  "What conversation needs to happen?",
  "What are you building?",
  "What are you releasing?",
  "What's working in your life?",
  "What needs to change?",
  "What's your intention for this week?",
  "What adventure awaits?",
  "What does peace feel like today?"
];

const MorningPages: React.FC<MorningPagesProps> = ({ onBack, onComplete }) => {
  const [content, setContent] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(WORD_GOALS[1]); // Default: 500 words
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentStreak] = useState(7); // Would come from user data
  const [showPrompt, setShowPrompt] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Word count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const progress = Math.min(100, (wordCount / selectedGoal.words) * 100);
  const goalReached = wordCount >= selectedGoal.words;

  // Start writing
  const handleStart = () => {
    setHasStarted(true);
    setStartTime(new Date());
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Show next prompt
  const handleShowPrompt = () => {
    setShowPrompt(true);
    setCurrentPromptIndex((prev) => (prev + 1) % MORNING_PROMPTS.length);
    setTimeout(() => setShowPrompt(false), 5000);
  };

  // Calculate writing duration
  const getWritingDuration = () => {
    if (!startTime) return '0 min';
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins} min`;
  };

  // Handle save
  const handleSave = async () => {
    if (isSaving || !content.trim()) return;

    setIsSaving(true);
    try {
      const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Show completion first
      setShowCompletion(true);

      await new Promise(resolve => setTimeout(resolve, 2500));

      await onComplete(`Morning Pages`, content);
    } catch (error) {
      console.error('Failed to save:', error);
      setShowCompletion(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Completion screen
  if (showCompletion) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-b from-stone-50/50 to-stone-100 flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="text-center max-w-md">
          {/* Sun animation */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-sage-200/20 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-sage-200/30 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="absolute inset-8 bg-sage-400 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
              <Sun size={40} className="text-white" strokeWidth={2} />
            </div>
          </div>

          <h2 className="font-serif text-3xl text-sage-900 mb-3 animate-fade-up">
            {goalReached ? 'Goal Reached!' : 'Morning Clarity'}
          </h2>

          <div className="space-y-2 mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
            <p className="text-2xl font-serif text-sage-600">{wordCount} words</p>
            <p className="text-stone-500">in {getWritingDuration()}</p>
          </div>

          {/* Streak display */}
          <div className="flex items-center justify-center gap-2 text-stone-400 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <Flame size={20} />
            <span className="font-medium">{currentStreak + 1} day streak!</span>
          </div>

          <p className="text-stone-400 text-sm mt-8 animate-fade-up" style={{ animationDelay: '300ms' }}>
            {goalReached
              ? "You've completed your morning pages. Carry this clarity with you."
              : "Every word counts. Carry this clarity with you."}
          </p>
        </div>
      </div>
    );
  }

  // Goal selection screen
  if (!hasStarted) {
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
              <Sun size={20} strokeWidth={1.5} />
            </div>
            <span className="text-xs font-bold text-sage-400 uppercase tracking-widest">
              Morning Pages
            </span>
          </div>

          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-28 lg:pb-10">
          <div className="max-w-md w-full text-center">
            <h2 className="font-serif text-3xl text-sage-900 mb-3 animate-fade-up">
              Start Your Morning Write
            </h2>
            <p className="text-stone-500 italic mb-10 animate-fade-up" style={{ animationDelay: '50ms' }}>
              Stream of consciousness writing to clear your mind and start fresh.
            </p>

            {/* Streak */}
            {currentStreak > 0 && (
              <div className="flex items-center justify-center gap-2 text-stone-400 mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
                <Flame size={18} />
                <span className="text-sm font-medium">{currentStreak} day streak</span>
              </div>
            )}

            {/* Goal selection */}
            <div className="space-y-3 mb-10">
              <p className="text-xs text-stone-400 uppercase tracking-widest mb-4 animate-fade-up" style={{ animationDelay: '150ms' }}>
                Choose your goal
              </p>
              {WORD_GOALS.map((goal, index) => {
                const GoalIcon = goal.Icon;
                return (
                  <button
                    key={goal.words}
                    onClick={() => setSelectedGoal(goal)}
                    className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all animate-fade-up ${selectedGoal.words === goal.words
                      ? 'bg-white border-sage-300 shadow-sm ring-1 ring-sage-200'
                      : 'bg-white/50 border-sage-100 hover:bg-white hover:border-sage-200'
                      }`}
                    style={{ animationDelay: `${200 + index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedGoal.words === goal.words ? 'bg-sage-600 text-white' : 'bg-sage-50 text-sage-600'
                        }`}>
                        <GoalIcon size={20} strokeWidth={1.5} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-sage-900">{goal.words} words</p>
                        <p className="text-sm text-stone-400">{goal.label}</p>
                      </div>
                    </div>
                    {selectedGoal.words === goal.words && (
                      <div className="w-6 h-6 rounded-full bg-sage-600 text-white flex items-center justify-center">
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Start button */}
            <button
              onClick={handleStart}
              className="w-full py-4 bg-sage-900 text-white rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all animate-fade-up active:scale-95"
              style={{ animationDelay: '350ms' }}
            >
              Begin Writing
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main writing sanctuary
  return (
    <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col animate-fade-in">
      {/* Minimal header with progress */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-sage-100 bg-white/50 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="p-2 hover:bg-black/5 rounded-full transition-colors text-sage-600"
        >
          <X size={24} />
        </button>

        {/* Progress indicator */}
        <div className="flex items-center gap-3">
          <div className="w-32 h-1.5 bg-sage-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out rounded-full ${goalReached ? 'bg-sage-600 shadow-sm' : 'bg-sage-400'
                }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-stone-400 font-mono min-w-[60px]">
            {wordCount}/{selectedGoal.words}
          </span>
        </div>

        {/* Done button */}
        <button
          onClick={handleSave}
          disabled={!content.trim() || isSaving}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${goalReached
            ? 'bg-sage-600 text-white shadow-sm'
            : 'text-stone-400 hover:text-stone-600'
            }`}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Done'}
        </button>
      </div>

      {/* Writing area - Stationery Sheet */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-[#faf9f7] to-[#f0efe9]">
        <div className="max-w-2xl mx-auto w-full px-8 py-12 min-h-screen shadow-[0_0_50px_-20px_rgba(0,0,0,0.05)] bg-white/40 my-4 rounded-sm border border-white/60">

          {/* Prompt helper */}
          {showPrompt && (
            <div className="mb-6 p-4 bg-sage-50/50 rounded-lg border border-sage-100 animate-fade-up">
              <p className="text-sage-700 font-serif italic text-center">
                {MORNING_PROMPTS[currentPromptIndex]}
              </p>
            </div>
          )}

          {/* Main textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Just let your thoughts flow..."
            className="w-full bg-transparent border-none p-0 text-xl md:text-2xl font-serif text-sage-900 placeholder:text-stone-300/50 focus:ring-0 focus:outline-none resize-none leading-[1.8] min-h-[60vh] selection:bg-sage-100/50"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 pb-28 lg:pb-6 border-t border-sage-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-serif italic text-stone-400">
              {getWritingDuration()}
            </span>
            {wordCount >= 50 && wordCount < selectedGoal.words && (
              <button
                onClick={handleShowPrompt}
                className="text-sm text-sage-600 hover:text-sage-900 transition-colors underline decoration-sage-200 underline-offset-4"
              >
                Need a prompt?
              </button>
            )}
          </div>

          {/* Goal indicator */}
          {goalReached ? (
            <div className="flex items-center gap-2 text-sage-600">
              <Target size={16} />
              <span className="text-sm font-medium">Goal reached!</span>
            </div>
          ) : (
            <span className="text-sm text-stone-400">
              {selectedGoal.words - wordCount} words to go
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MorningPages;
