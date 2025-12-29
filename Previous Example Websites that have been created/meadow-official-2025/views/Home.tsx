
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { AIService } from '../services/ai';
import { ThreadService, ThreadWithPreview } from '../services/threads';
import { MetricsService, type JournalAnalytics } from '../services/metrics';
import { MoodService } from '../services/mood';
import { PenTool, ArrowRight, Sparkles, GitBranch, Wind, Check, Sun, Cloud, CloudRain, Meh, Smile, Leaf, Zap, X, Camera, BookOpen, Target, Loader2, Plus, Calendar, Shuffle, RefreshCw } from 'lucide-react';
import { PROMPT_CATEGORIES } from '../data/content';

type Mood = 'Low' | 'Cloudy' | 'Steady' | 'Content' | 'Radiant';

interface HomeProps {
  onChangeView: (view: ViewState, data?: any) => void;
  userName?: string;
  userIntent?: string;
}

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

// Get dynamic greeting based on time of day
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

// Get formatted date
const getFormattedDate = () => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-US', options);
};

const Home: React.FC<HomeProps> = ({ onChangeView, userName: propUserName, userIntent = 'clarity' }) => {
  const { profile } = useAuth();

  // Use profile name if available, then prop, then fallback
  const userName = profile?.display_name || propUserName || 'there';

  const greeting = getTimeBasedGreeting();
  const formattedDate = getFormattedDate();
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('idle');
  const [moodLogged, setMoodLogged] = useState<string | null>(null);
  const [isMoodDismissed, setIsMoodDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<string | null>(null);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [threads, setThreads] = useState<ThreadWithPreview[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [analytics, setAnalytics] = useState<JournalAnalytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [moodLogId, setMoodLogId] = useState<string | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      setIsLoadingThreads(true);
      try {
        const data = await ThreadService.getThreadsWithPreviews();
        setThreads(data);
      } catch (error) {
        console.error('Failed to fetch threads:', error);
      } finally {
        setIsLoadingThreads(false);
      }
    };
    fetchThreads();
  }, []);

  // Fetch journal analytics (streak, last 7 days, etc.)
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoadingAnalytics(true);
      try {
        const a = await MetricsService.getJournalAnalytics();
        setAnalytics(a);
      } catch (e) {
        console.error('Failed to fetch analytics:', e);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Load today's mood (if previously logged)
  useEffect(() => {
    const loadTodayMood = async () => {
      try {
        const today = await MoodService.getTodayMoodLog();
        if (today) {
          setMoodLogged(today.mood);
          setMoodLogId(today.id);
        }
      } catch (e) {
        // Non-blocking; mood is optional.
        console.error('Failed to load today mood:', e);
      }
    };
    loadTodayMood();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch AI prompt on page load
  useEffect(() => {
    fetchAIPrompt();
  }, []);

  // Fetch AI-generated daily prompt
  const fetchAIPrompt = async () => {
    setIsLoadingPrompt(true);
    try {
      const prompt = await AIService.getDailyPrompt();
      if (prompt) {
        setAiPrompt(prompt);
      }
    } catch (error) {
      console.error('Failed to fetch AI prompt:', error);
    } finally {
      setIsLoadingPrompt(false);
    }
  };

  // Personalized Content Logic
  const getPrompt = () => {
    switch (userIntent) {
      case 'anxiety': return "What is worrying you right now? Let's put it on paper.";
      case 'growth': return "What did you learn about yourself today?";
      case 'memory': return "Capture one small detail from today you want to remember.";
      case 'clarity':
      default: return "What is a thought you haven't fully explored yet?";
    }
  };

  const getSubheading = () => {
    switch (userIntent) {
      case 'anxiety': return "Let's find some calm together.";
      case 'growth': return "Ready to reflect on your progress?";
      case 'memory': return "Time to archive today's moments.";
      case 'clarity':
      default: return "Ready to clear your mind?";
    }
  };

  // --- DAILY PROMPT LOGIC (Seeded 5 Per Day) ---
  const [dailyPrompts, setDailyPrompts] = useState<string[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    // Seed random generator with today's date to get consistent same 5 prompts for the day
    const today = new Date().toISOString().split('T')[0];
    // Simple hash function for seeding
    let seed = 0;
    for (let i = 0; i < today.length; i++) seed = (seed << 5) - seed + today.charCodeAt(i);

    const seededRandom = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Flatten all prompts
    const allPrompts = PROMPT_CATEGORIES.flatMap(c => c.prompts);

    // Pick 5 unique random prompts
    const selected: string[] = [];
    const count = 5;

    // Fallback if not enough prompts (unlikely)
    if (allPrompts.length < count) {
      setDailyPrompts(allPrompts);
      return;
    }

    const indices = new Set<number>();
    while (indices.size < count) {
      indices.add(Math.floor(seededRandom() * allPrompts.length));
    }

    indices.forEach(i => selected.push(allPrompts[i]));
    setDailyPrompts(selected);
  }, []);

  const handleShufflePrompt = () => {
    setShuffling(true);
    setTimeout(() => {
      // Allow cycling through the 5 daily prompts
      setCurrentPromptIndex(prev => (prev + 1) % dailyPrompts.length);
      setShuffling(false);
    }, 400);
  };

  const activePrompt = aiPrompt || (dailyPrompts.length > 0 ? dailyPrompts[currentPromptIndex] : "What is on your mind today?");

  // Trigger breath animation (inhale -> hold -> exhale)
  const takeBreath = () => {
    if (breathPhase !== 'idle') return; // Prevent clicking while active

    setBreathPhase('inhale');

    // Inhale for 3 seconds
    setTimeout(() => {
      setBreathPhase('hold');

      // Hold for 2 seconds
      setTimeout(() => {
        setBreathPhase('exhale');

        // Exhale for 3 seconds then reset
        setTimeout(() => {
          setBreathPhase('idle');
        }, 3000);
      }, 2000);
    }, 3000);
  };

  const getBreathLabel = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe in...';
      case 'hold': return 'Hold for 2 seconds...';
      case 'exhale': return 'Breathe out...';
      default: return 'Take a breath';
    }
  };

  const weekDays = React.useMemo(() => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todayKey = MetricsService.toLocalDateKey(today);

    // Monday-start week
    const dayOfWeek = today.getDay(); // 0 Sun..6 Sat
    const deltaToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(today);
    monday.setDate(monday.getDate() - deltaToMonday);

    const byDate = analytics?.byDate ?? {};

    const days: { day: string; status: 'filled' | 'missed' | 'today' | 'future' }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = MetricsService.toLocalDateKey(d);
      const letter = d.toLocaleDateString(undefined, { weekday: 'short' }).charAt(0);
      const hasEntry = (byDate[key]?.entries ?? 0) > 0;

      let status: 'filled' | 'missed' | 'today' | 'future';
      if (key > todayKey) status = 'future';
      else if (key === todayKey) status = hasEntry ? 'today' : 'missed';
      else status = hasEntry ? 'filled' : 'missed';

      days.push({ day: letter, status });
    }
    return days;
  }, [analytics]);

  const streakLabel = isLoadingAnalytics ? '—' : `${analytics?.currentStreak ?? 0} Day Streak`;

  const handleMoodSelect = async (label: string) => {
    setMoodLogged(label);
    try {
      const intensityMap: Record<string, number> = {
        Low: 1,
        Cloudy: 2,
        Steady: 3,
        Content: 4,
        Radiant: 5,
      };
      const log = await MoodService.logMood(label, intensityMap[label] ?? undefined);
      setMoodLogId(log.id);
    } catch (e) {
      // If not signed in or RLS blocks, keep local UI state without blocking.
      console.error('Failed to log mood:', e);
    }
  };

  const handleMoodUndo = async () => {
    try {
      if (moodLogId) await MoodService.deleteMoodLog(moodLogId);
    } catch (e) {
      console.error('Failed to undo mood log:', e);
    } finally {
      setMoodLogId(null);
      setMoodLogged(null);
    }
  };

  return (
    <div className="animate-fade-up pb-12">

      {/* Sanctuary Header */}
      <header className="mb-12 text-center md:text-left">
        {/* Top Row: Date + Stage/Streak */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sage-400 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-widest text-sage-400">{formattedDate}</p>
          </div>

          {/* Streak Widget Removed */}
        </div>

        {/* Greeting Row with Take a Breath */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
          <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] font-normal text-sage-900 leading-[1.1]">
            {greeting}, <br className="md:hidden" />
            <span className="text-sage-500">{userName}</span>
          </h1>

          {/* Take a Breath Button - Desktop only in header */}
          <button
            onClick={takeBreath}
            disabled={breathPhase !== 'idle'}
            className={`
              hidden md:flex group relative h-11 px-6 rounded-full border bg-white/80 text-text-secondary text-sm font-medium transition-all duration-700 items-center justify-center shrink-0 z-10
              ${breathPhase !== 'idle' ? 'w-48 border-sage/50 text-sage cursor-default shadow-none' : 'w-40 hover:w-44 border-stone-200 hover:bg-white hover:shadow-sm'}
            `}
          >
            {/* Progress Bar Background */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0 bg-sage/10 transition-transform ease-linear origin-left"
                style={{
                  transitionDuration: breathPhase === 'inhale' ? '3000ms' : breathPhase === 'exhale' ? '3000ms' : '0ms',
                  transform: breathPhase === 'inhale' || breathPhase === 'hold' ? 'scaleX(1)' : 'scaleX(0)'
                }}
              />
            </div>

            <span className="relative z-10 flex items-center justify-center gap-2 transition-opacity duration-300 w-full text-center">
              {/* Floating Leaves on Exhale */}
              {breathPhase === 'exhale' && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-sage opacity-0 animate-leaf-blow"
                      style={{
                        animationDelay: `${i * 100}ms`,
                        '--tx': `${-150 - Math.random() * 100}px`,
                        '--ty': `${(Math.random() - 0.5) * 50}px`,
                        '--r': `${Math.random() * 360}deg`,
                        '--s': `${0.5 + Math.random() * 0.5}`
                      } as React.CSSProperties}
                    >
                      <Leaf size={10} fill="currentColor" />
                    </div>
                  ))}
                </div>
              )}

              {/* Leaf icon when idle, Wind icon when breathing */}
              {breathPhase === 'idle' ? (
                <Leaf size={16} className="text-sage-500" />
              ) : (
                <div className="transform -scale-x-100">
                  <Wind size={16} className="animate-pulse text-sage" />
                </div>
              )}
              <span>{getBreathLabel()}</span>
            </span>
          </button>
        </div>

        <p className="text-[1.125rem] font-light text-sage-600 max-w-[28rem] mx-auto md:mx-0">
          {getSubheading()}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-3 mt-8 justify-center md:justify-start">
          {/* Mobile Take a Breath Button */}
          <button
            onClick={takeBreath}
            disabled={breathPhase !== 'idle'}
            className={`
              md:hidden group relative h-12 px-5 rounded-full border bg-white/80 text-text-secondary text-sm font-medium transition-all duration-700 flex items-center justify-center w-full z-10
              ${breathPhase !== 'idle' ? 'border-sage/50 text-sage cursor-default shadow-none' : 'border-stone-200 hover:bg-white hover:shadow-sm'}
            `}
          >
            {/* Progress Bar Background */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0 bg-sage/10 transition-transform ease-linear origin-left"
                style={{
                  transitionDuration: breathPhase === 'inhale' ? '3000ms' : breathPhase === 'exhale' ? '3000ms' : '0ms',
                  transform: breathPhase === 'inhale' || breathPhase === 'hold' ? 'scaleX(1)' : 'scaleX(0)'
                }}
              />
            </div>

            <span className="relative z-10 flex items-center justify-center gap-2 transition-opacity duration-300">
              {breathPhase === 'exhale' && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-sage opacity-0 animate-leaf-blow"
                      style={{
                        animationDelay: `${i * 100}ms`,
                        '--tx': `${-40 - Math.random() * 20}px`,
                        '--ty': `${(Math.random() - 0.5) * 50}px`,
                        '--r': `${Math.random() * 360}deg`,
                        '--s': `${0.5 + Math.random() * 0.5}`
                      } as React.CSSProperties}
                    >
                      <Leaf size={10} fill="currentColor" />
                    </div>
                  ))}
                </div>
              )}

              {/* Leaf icon when idle, Wind icon when breathing */}
              {breathPhase === 'idle' ? (
                <Leaf size={16} className="text-sage-500" />
              ) : (
                <div className="transform -scale-x-100">
                  <Wind size={16} className="animate-pulse text-sage" />
                </div>
              )}
              <span className="min-w-[80px] text-center">{getBreathLabel()}</span>
            </span>
          </button>
        </div>
      </header>

      {/* Daily Prompt Card (Refined Round 3) */}
      <div className="glass-card rounded-[24px] p-8 mb-8 relative overflow-hidden group">
        {/* Subtle top hairline (quiet luxury) */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sage/30 to-transparent opacity-80" />
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">

          {/* Label */}
          <div className="inline-flex items-center gap-2 mb-6 opacity-60">
            <Sparkles size={14} className="text-sage-500" />
            <span className="text-xs font-serif italic text-sage-600 tracking-wide">Daily Prompt</span>
          </div>

          {/* Prompt Text */}
          <div className={`transition-opacity duration-300 min-h-[5rem] flex items-center justify-center mb-6 px-4 ${shuffling ? 'opacity-0' : 'opacity-100'}`}>
            {isLoadingPrompt ? (
              <Loader2 className="w-6 h-6 text-sage-500 animate-spin" />
            ) : (
              <h3 className="font-serif text-2xl md:text-3xl text-sage-900 leading-tight">
                {activePrompt}
              </h3>
            )}
          </div>

          {/* Actions Row */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChangeView(ViewState.EDITOR, { prompt: activePrompt, returnTo: ViewState.HOME })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage-500 text-white rounded-full text-sm font-medium shadow-[0_4px_14px_0_rgba(107,143,122,0.39)] hover:bg-sage-600 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(107,143,122,0.35)] transition-all"
            >
              <PenTool size={16} />
              Reflect on this
            </button>

            <button
              onClick={handleShufflePrompt}
              disabled={shuffling}
              className={`w-11 h-11 rounded-full border border-sage-200 flex items-center justify-center text-sage-500 hover:bg-sage-50 hover:border-sage-300 transition-all ${shuffling ? 'animate-spin' : ''}`}
              title="Shuffle Prompt"
            >
              <Shuffle size={16} />
            </button>
          </div>

        </div>
      </div>

      {/* Mood Check-in (Meadow 23 style) */}
      {
        !isMoodDismissed && (
          <div className="glass-card rounded-[28px] p-6 md:p-8 mb-10">
            <div className="relative flex justify-center items-center mb-6">
              <span className="text-sm font-bold uppercase tracking-widest text-sage-400">Check-in</span>
              <button onClick={() => setIsMoodDismissed(true)} className="absolute right-0 text-sage-300 hover:text-sage-500 transition-colors">
                <X size={16} />
              </button>
            </div>

            {moodLogged ? (
              <div className="flex flex-col items-center justify-center animate-fade-in py-4 gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-sage-800 text-white flex items-center justify-center shadow-lg shadow-sage-900/10">
                  <Check size={24} />
                </div>
                <div>
                  <p className="font-serif text-xl text-sage-900 mb-1">Logged as <span className="italic text-sage-500">{moodLogged.toLowerCase()}</span></p>
                  <p className="text-xs text-sage-400 font-medium">Recorded just now</p>
                </div>
                <button onClick={handleMoodUndo} className="mt-2 text-xs font-bold uppercase tracking-wider text-sage-400 hover:text-sage-600 border-b border-transparent hover:border-sage-300 transition-all">Undo</button>
              </div>
            ) : (
              <div className="flex justify-between gap-2">
                {[
                  { label: 'Low', icon: CloudRain, hoverColor: 'hover:bg-slate-100 hover:text-slate-600' },
                  { label: 'Cloudy', icon: Cloud, hoverColor: 'hover:bg-gray-100 hover:text-gray-600' },
                  { label: 'Steady', icon: Meh, hoverColor: 'hover:bg-stone-100 hover:text-stone-600' },
                  { label: 'Content', icon: Smile, hoverColor: 'hover:bg-orange-50 hover:text-orange-600' },
                  { label: 'Radiant', icon: Sun, hoverColor: 'hover:bg-amber-50 hover:text-amber-600' },
                ].map(({ label, icon: Icon, hoverColor }) => (
                  <button
                    key={label}
                    onClick={() => handleMoodSelect(label as Mood)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 group flex-1 ${hoverColor} hover:shadow-sm`}
                  >
                    <Icon className="text-sage-300 group-hover:scale-110 transition-transform duration-300" size={28} strokeWidth={1.5} />
                    <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-sage-300 group-hover:text-current">{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      }

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{ animationDelay: '300ms' }}>

        {/* Jump Back In (Meadow 23 style) */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-sage-400">Jump back in</h4>
            <button
              onClick={() => onChangeView(ViewState.JOURNAL)}
              className="text-xs font-bold text-sage-600 hover:text-sage-900 transition-colors"
            >
              All
            </button>
          </div>

          {isLoadingThreads ? (
            <div className="glass-card p-10 rounded-[28px] flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-sage-500 animate-spin" />
            </div>
          ) : threads.length === 0 ? (
            <div className="p-6 border border-dashed border-sage-200 rounded-3xl text-center text-sage-400">
              <p className="text-sm mb-4">No threads yet.</p>
              <button
                onClick={() => onChangeView(ViewState.EDITOR)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sage-500 text-white font-medium text-sm shadow-[0_4px_14px_0_rgba(107,143,122,0.39)] hover:bg-sage-600 transition-all"
              >
                <Plus size={16} /> Create First Entry
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {threads.slice(0, 2).map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => onChangeView(ViewState.THREAD_DETAIL, { id: thread.id, title: thread.name })}
                  className="glass-card p-5 flex items-center gap-4 group cursor-pointer"
                >
                  {/* Icon container */}
                  <div className="w-12 h-12 rounded-2xl bg-white border border-sage-100 flex items-center justify-center text-sage-500 shadow-sm group-hover:scale-105 transition-transform">
                    <GitBranch size={20} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif text-lg text-sage-900 truncate group-hover:text-sage-700 transition-colors">{thread.name}</h5>
                    <p className="text-xs text-sage-400 font-medium">
                      {thread.entry_count} {thread.entry_count === 1 ? 'Entry' : 'Entries'} • Last active {thread.last_entry_at ? new Date(thread.last_entry_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'today'}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sage-300 group-hover:bg-sage-50 group-hover:text-sage-600 transition-colors">
                    <ArrowRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Consistency Card (Redesigned) */}
        <section>
          <div className="glass-card p-8 h-full flex flex-col justify-between overflow-hidden">
            {/* Header with Stats */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-sage-400 mb-1">Consistency</div>
                {isLoadingAnalytics ? (
                  <div className="h-8 w-24 bg-sage-100 animate-pulse rounded" />
                ) : (
                  <div className="font-serif text-3xl text-sage-900">
                    {(analytics?.last7Days ?? []).reduce((s, d) => s + d.words, 0).toLocaleString()}{' '}
                    <span className="text-lg text-sage-400">words</span>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Bar Chart - Enhanced */}
            <div
              className="flex items-end justify-between gap-3 h-32 mb-4"
              onMouseLeave={() => setHoveredBarIndex(null)}
            >
              {(() => {
                const days = analytics?.last7Days ?? [{ words: 0, entries: 0 }, { words: 0, entries: 0 }, { words: 0, entries: 0 }, { words: 0, entries: 0 }, { words: 0, entries: 0 }, { words: 0, entries: 0 }, { words: 0, entries: 0 }];
                const maxWords = Math.max(...days.map(d => d.words), 50); // Minimum max of 50 for visuals
                const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const dayLetters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

                // Find most active day
                let mostActiveIndex = 0;
                let mostActiveWords = 0;
                days.forEach((d, i) => {
                  if (d.words > mostActiveWords) {
                    mostActiveWords = d.words;
                    mostActiveIndex = i;
                  }
                });

                return days.map((day, i) => {
                  // Ensure visible bar even for 0 (but distinct) or very small values
                  const percentage = maxWords > 0 ? (day.words / maxWords) * 100 : 0;
                  const height = Math.max(percentage, 0); // Allow 0 height for actual bar
                  const isToday = i === 6;
                  const isHovered = hoveredBarIndex === i;
                  const isMostActive = i === mostActiveIndex && mostActiveWords > 0;
                  const hasData = day.words > 0;

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-3 cursor-pointer group relative h-full justify-end"
                      onMouseEnter={() => setHoveredBarIndex(i)}
                    >
                      {/* Hover Tooltip - Improved */}
                      <div className={`
                        absolute -top-10 left-1/2 -translate-x-1/2 bg-sage-800 text-white px-3 py-1.5 rounded-xl text-[10px] font-medium whitespace-nowrap z-20 shadow-xl transition-all duration-200 pointer-events-none
                        ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
                      `}>
                        <div className="font-bold mb-0.5">{dayNames[i]}</div>
                        <div>{day.words} words</div>
                        {/* Little arrow */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-sage-800 rotate-45" />
                      </div>

                      {/* Bar Container for full height alignment (No visible track) */}
                      <div className="w-full flex-1 flex items-end relative rounded-lg overflow-hidden">
                        {/* The Actual Bar */}
                        {hasData && (
                          <div
                            className={`
                                w-full rounded-md transition-all duration-500 ease-out origin-bottom relative
                                ${isHovered ? 'bg-sage-600' : isToday ? 'bg-sage-500' : isMostActive ? 'bg-sage-400' : 'bg-sage-300'}
                            `}
                            style={{
                              height: `${height}%`,
                              // Add a subtle entrance animation delay based on index
                              animation: `grow-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                              animationDelay: `${i * 100}ms`,
                              transform: 'scaleY(0)', // Start at 0 for animation
                            }}
                          />
                        )}
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isHovered || isToday ? 'text-sage-600' : 'text-sage-300'
                        }`}>
                        {dayLetters[i]}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>


            {/* Most Active Day Text */}
            <div className="text-center text-xs text-sage-400 font-medium">
              {isLoadingAnalytics ? (
                'Loading...'
              ) : (analytics?.totalEntries ?? 0) < 2 ? (
                'Write more to see your patterns'
              ) : (() => {
                const days = analytics?.last7Days ?? [];
                const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                let mostActiveIndex = 0;
                let mostActiveWords = 0;
                days.forEach((d, i) => {
                  if (d.words > mostActiveWords) {
                    mostActiveWords = d.words;
                    mostActiveIndex = i;
                  }
                });
                return mostActiveWords > 0 ? (
                  <>You're most active on <span className="text-sage-600 font-bold">{dayNames[mostActiveIndex]}</span></>
                ) : (
                  <>You've written <span className="text-sage-600 font-bold">{days.reduce((s, d) => s + d.entries, 0)}</span> entries this week</>
                );
              })()}
            </div>
          </div>
        </section>
      </div>

      {/* Keyframe styles for breath leaves */}
      <style>{`
        @keyframes leaf-blow {
          0% { transform: translate(0, 0) rotate(0deg) scale(0); opacity: 0; }
          20% { opacity: 1; transform: translate(-20px, 0) rotate(90deg) scale(1); }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--r)) scale(var(--s)); opacity: 0; }
        }
        @keyframes grow-up {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .animate-leaf-blow {
          animation: leaf-blow 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Mood Button Component
const MoodButton = ({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-3 rounded-[14px] bg-dark-surface border border-dark-border-subtle text-text-tertiary hover:bg-dark-hover hover:border-sage-border hover:text-sage-light transition-all active:scale-95"
  >
    <Icon size={20} strokeWidth={1.5} />
    <span className="text-[0.6rem] font-medium">{label}</span>
  </button>
);

export default Home;