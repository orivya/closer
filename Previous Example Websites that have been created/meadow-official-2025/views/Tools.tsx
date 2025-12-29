import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from '../types';
import {
  Feather, Brain, Heart, Target, Clock, Sparkles,
  Play, Pause, RotateCcw, Copy, Check, Shuffle,
  Wind, Palette, AlignLeft, Timer, Quote, Lightbulb,
  PenTool, ArrowRight
} from 'lucide-react';

interface ToolsProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

// Writing prompts database
const WRITING_PROMPTS = [
  "What would you tell your younger self?",
  "Describe a moment that changed your perspective on life.",
  "What are you most grateful for today?",
  "Write about a fear you've overcome.",
  "What does your ideal day look like?",
  "Describe someone who has influenced you deeply.",
  "What would you do if you knew you couldn't fail?",
  "Write about a place that feels like home.",
  "What lesson took you the longest to learn?",
  "Describe a moment of unexpected joy.",
  "What are you avoiding thinking about?",
  "Write a letter to someone you've lost touch with.",
  "What does success mean to you right now?",
  "Describe the last time you felt truly at peace.",
  "What would you want to be remembered for?",
  "Write about a turning point in your life.",
  "What brings you energy? What drains it?",
  "Describe your relationship with time.",
  "What conversation do you need to have?",
  "Write about something you're learning to accept."
];

const AFFIRMATIONS = [
  "I am worthy of love and respect, including from myself.",
  "My feelings are valid and I honor them.",
  "I am growing and learning every single day.",
  "I release what I cannot control.",
  "I am enough, exactly as I am.",
  "My journey is unique and I embrace it.",
  "I choose peace over perfection.",
  "I am capable of handling whatever comes my way.",
  "I give myself permission to rest.",
  "My potential is limitless.",
  "I trust the timing of my life.",
  "I am deserving of happiness and joy.",
  "I celebrate my small wins.",
  "I am becoming the person I want to be.",
  "I choose to see the good in today."
];

const MOOD_COLORS = [
  { color: '#7d9b8a', name: 'Calm', mood: 'Peaceful and grounded' },
  { color: '#9bb3a7', name: 'Hopeful', mood: 'Optimistic and light' },
  { color: '#c47f6a', name: 'Warm', mood: 'Content and cozy' },
  { color: '#b4a7d6', name: 'Reflective', mood: 'Thoughtful and introspective' },
  { color: '#e8927c', name: 'Energetic', mood: 'Motivated and alive' },
  { color: '#5c7a6b', name: 'Focused', mood: 'Determined and clear' },
  { color: '#94a39d', name: 'Neutral', mood: 'Balanced and steady' },
  { color: '#d6d3d0', name: 'Quiet', mood: 'Subdued and contemplative' }
];

const Tools: React.FC<ToolsProps> = ({ onChangeView }) => {
  // Tool states
  const [activePrompt, setActivePrompt] = useState(WRITING_PROMPTS[0]);
  const [activeAffirmation, setActiveAffirmation] = useState(AFFIRMATIONS[0]);
  const [selectedMoodColor, setSelectedMoodColor] = useState<typeof MOOD_COLORS[0] | null>(null);

  // Word Counter
  const [wordCountText, setWordCountText] = useState('');
  const wordCount = wordCountText.trim() ? wordCountText.trim().split(/\s+/).length : 0;
  const charCount = wordCountText.length;
  const sentenceCount = wordCountText.split(/[.!?]+/).filter(s => s.trim()).length;

  // Writing Timer
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Breathing Exercise
  const [breathPhase, setBreathPhase] = useState<'idle' | 'inhale' | 'exhale'>('idle');
  const [breathCycle, setBreathCycle] = useState(0);

  // Gratitude List
  const [gratitudeItems, setGratitudeItems] = useState(['', '', '']);

  // Copy states
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedAffirmation, setCopiedAffirmation] = useState(false);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && (timerMinutes > 0 || timerSeconds > 0)) {
      timerRef.current = setTimeout(() => {
        if (timerSeconds === 0) {
          setTimerMinutes(m => m - 1);
          setTimerSeconds(59);
        } else {
          setTimerSeconds(s => s - 1);
        }
      }, 1000);
    } else if (isTimerRunning && timerMinutes === 0 && timerSeconds === 0) {
      setIsTimerRunning(false);
      setTimerComplete(true);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  const resetTimer = (mins: number) => {
    setIsTimerRunning(false);
    setTimerMinutes(mins);
    setTimerSeconds(0);
    setTimerComplete(false);
  };

  // Breathing exercise
  const startBreathing = () => {
    if (breathPhase !== 'idle') return;

    const runCycle = (cycleNum: number) => {
      if (cycleNum > 3) {
        setBreathPhase('idle');
        setBreathCycle(0);
        return;
      }
      setBreathCycle(cycleNum);
      setBreathPhase('inhale');
      setTimeout(() => {
        setBreathPhase('exhale');
        setTimeout(() => runCycle(cycleNum + 1), 4000);
      }, 4000);
    };
    runCycle(1);
  };

  const shufflePrompt = () => {
    const newPrompt = WRITING_PROMPTS[Math.floor(Math.random() * WRITING_PROMPTS.length)];
    setActivePrompt(newPrompt);
  };

  const shuffleAffirmation = () => {
    const newAff = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
    setActiveAffirmation(newAff);
  };

  const copyToClipboard = (text: string, type: 'prompt' | 'affirmation') => {
    navigator.clipboard.writeText(text);
    if (type === 'prompt') {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedAffirmation(true);
      setTimeout(() => setCopiedAffirmation(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-dark-base animate-fade-up">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/5 via-transparent to-dark-surface" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-subtle rounded-full text-sage text-sm font-medium mb-6 border border-sage-border">
            <Sparkles size={16} />
            Free Journaling Tools
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-text-primary mb-6 leading-tight">
            Tools for
            <span className="text-sage"> Deeper Reflection</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Free, interactive tools to enhance your journaling practice.
            No account required — start using them right away.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 1. Writing Prompt Generator */}
          <div className="p-6 rounded-3xl glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sage-subtle flex items-center justify-center border border-sage-border">
                <Lightbulb size={24} className="text-sage" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-text-primary">Writing Prompt</h3>
                <p className="text-xs text-text-muted">Get inspired to write</p>
              </div>
            </div>
            <div className="p-4 bg-dark-surface rounded-xl mb-4 min-h-[80px] flex items-center border border-dark-border">
              <p className="font-serif text-lg text-text-primary italic">"{activePrompt}"</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={shufflePrompt}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-sage text-white font-medium shadow-glow hover:shadow-glow-lg transition-colors"
              >
                <Shuffle size={16} /> New Prompt
              </button>
              <button
                onClick={() => copyToClipboard(activePrompt, 'prompt')}
                className="px-4 py-3 rounded-xl border border-dark-border text-text-secondary hover:bg-dark-hover transition-colors"
              >
                {copiedPrompt ? <Check size={16} className="text-sage" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* 2. Daily Affirmation */}
          <div className="p-6 rounded-3xl glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Quote size={24} className="text-purple-400" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-text-primary">Daily Affirmation</h3>
                <p className="text-xs text-text-muted">Positive words for today</p>
              </div>
            </div>
            <div className="p-4 bg-purple-500/5 rounded-xl mb-4 min-h-[80px] flex items-center border border-purple-500/10">
              <p className="font-serif text-lg text-text-primary">"{activeAffirmation}"</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={shuffleAffirmation}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-500 text-white font-medium hover:opacity-90 transition-colors"
              >
                <Shuffle size={16} /> New Affirmation
              </button>
              <button
                onClick={() => copyToClipboard(activeAffirmation, 'affirmation')}
                className="px-4 py-3 rounded-xl border border-dark-border text-text-secondary hover:bg-dark-hover transition-colors"
              >
                {copiedAffirmation ? <Check size={16} className="text-sage" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* 3. Writing Timer */}
          <div className="p-6 rounded-3xl glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Timer size={24} className="text-amber-400" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-text-primary">Writing Timer</h3>
                <p className="text-xs text-text-muted">Focused writing sessions</p>
              </div>
            </div>
            <div className="text-center py-6">
              <div className={`font-serif text-5xl tabular-nums ${timerComplete ? 'text-sage' : 'text-text-primary'}`}>
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </div>
              {timerComplete && <p className="text-sage mt-2 font-medium">Time's up! Great work.</p>}
            </div>
            <div className="flex gap-2 mb-4">
              {[5, 10, 15, 20].map(mins => (
                <button
                  key={mins}
                  onClick={() => resetTimer(mins)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timerMinutes === mins && !isTimerRunning && timerSeconds === 0
                      ? 'bg-amber-500 text-white'
                      : 'bg-dark-surface text-text-secondary hover:bg-dark-hover border border-dark-border'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-white font-medium hover:opacity-90 transition-colors"
              >
                {isTimerRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
              </button>
              <button
                onClick={() => resetTimer(timerMinutes || 5)}
                className="px-4 py-3 rounded-xl border border-dark-border text-text-secondary hover:bg-dark-hover transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* 4. Breathing Exercise */}
          <div className="p-6 rounded-3xl glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sage-subtle flex items-center justify-center border border-sage-border">
                <Wind size={24} className="text-sage" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-text-primary">Breathing Exercise</h3>
                <p className="text-xs text-text-muted">Calm your mind before writing</p>
              </div>
            </div>
            <div className="flex flex-col items-center py-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-[4000ms] ${
                breathPhase === 'inhale' ? 'scale-125 bg-sage/20 shadow-glow' : breathPhase === 'exhale' ? 'scale-100 bg-sage/10' : 'bg-dark-surface border border-dark-border'
              }`}>
                <Wind size={32} className={breathPhase !== 'idle' ? 'text-sage animate-pulse' : 'text-text-muted'} />
              </div>
              <p className="mt-4 font-medium text-text-primary">
                {breathPhase === 'inhale' ? `Breathe in... (${breathCycle}/3)` :
                 breathPhase === 'exhale' ? `Breathe out... (${breathCycle}/3)` :
                 'Ready to begin'}
              </p>
            </div>
            <button
              onClick={startBreathing}
              disabled={breathPhase !== 'idle'}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sage text-white font-medium shadow-glow hover:shadow-glow-lg transition-colors disabled:opacity-50"
            >
              <Play size={16} /> Start 3 Cycles
            </button>
          </div>

          {/* 5. Word Counter */}
          <div className="p-6 rounded-3xl glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <AlignLeft size={24} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-text-primary">Word Counter</h3>
                <p className="text-xs text-text-muted">Track your writing progress</p>
              </div>
            </div>
            <textarea
              value={wordCountText}
              onChange={(e) => setWordCountText(e.target.value)}
              placeholder="Paste or type your text here..."
              className="w-full h-32 p-4 bg-dark-surface rounded-xl border border-dark-border text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage-border"
            />
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="text-center p-3 bg-dark-surface rounded-xl border border-dark-border">
                <p className="text-2xl font-serif text-text-primary">{wordCount}</p>
                <p className="text-xs text-text-muted">Words</p>
              </div>
              <div className="text-center p-3 bg-dark-surface rounded-xl border border-dark-border">
                <p className="text-2xl font-serif text-text-primary">{charCount}</p>
                <p className="text-xs text-text-muted">Characters</p>
              </div>
              <div className="text-center p-3 bg-dark-surface rounded-xl border border-dark-border">
                <p className="text-2xl font-serif text-text-primary">{sentenceCount}</p>
                <p className="text-xs text-text-muted">Sentences</p>
              </div>
            </div>
          </div>

          {/* 6. Mood Color Picker */}
          <div className="p-6 rounded-3xl glass-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                <Palette size={24} className="text-pink-400" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-text-primary">Mood Color</h3>
                <p className="text-xs text-text-muted">How are you feeling right now?</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {MOOD_COLORS.map((mc) => (
                <button
                  key={mc.color}
                  onClick={() => setSelectedMoodColor(mc)}
                  className={`aspect-square rounded-xl transition-all ${
                    selectedMoodColor?.color === mc.color ? 'ring-2 ring-offset-2 ring-offset-dark-base ring-sage scale-110 shadow-glow' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: mc.color }}
                  title={mc.name}
                />
              ))}
            </div>
            {selectedMoodColor && (
              <div className="p-4 rounded-xl border border-dark-border text-center animate-fade-in" style={{ backgroundColor: `${selectedMoodColor.color}15` }}>
                <p className="font-serif text-xl text-text-primary">{selectedMoodColor.name}</p>
                <p className="text-sm text-text-secondary">{selectedMoodColor.mood}</p>
              </div>
            )}
          </div>

          {/* 7. Gratitude List */}
          <div className="p-6 rounded-3xl glass-card md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-sage-subtle flex items-center justify-center border border-sage-border">
                <Heart size={24} className="text-sage" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-text-primary">Quick Gratitude</h3>
                <p className="text-xs text-text-muted">Three things you're grateful for today</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {gratitudeItems.map((item, index) => (
                <div key={index} className="relative">
                  <span className="absolute left-4 top-3.5 text-sage font-serif text-lg">{index + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...gratitudeItems];
                      newItems[index] = e.target.value;
                      setGratitudeItems(newItems);
                    }}
                    placeholder="I'm grateful for..."
                    className="w-full p-4 pl-10 bg-dark-surface rounded-xl border border-dark-border text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage-border"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl glass-card-glow p-8 md:p-12 text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-text-primary mb-4">
              Ready for More?
            </h2>
            <p className="text-text-secondary mb-8 max-w-xl mx-auto">
              Create a free account to save your journal entries, track your mood over time,
              and unlock AI-powered insights.
            </p>
            <button
              onClick={() => onChangeView(ViewState.AUTH)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-sage text-white rounded-2xl font-medium shadow-glow hover:shadow-glow-lg transition-colors"
            >
              <PenTool size={18} /> Start Journaling Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tools;
