import React, { useEffect, useMemo, useState } from 'react';
import { ViewState } from '../types';
import { JOURNEYS, PROMPT_CATEGORIES } from '../data/content';
import { useAuth } from '../contexts/AuthContext';
import { JourneyProgressService, JourneyProgress } from '../services/journeyProgress';
import {
  Sparkles, Scale, ArrowRight, Archive, Target, Lock, Play,
  Star, BookOpen, Moon, GitBranch, Lightbulb, Trophy, Shuffle,
  Quote, CheckCircle, Clock, Compass, Zap
} from 'lucide-react';

// 100 Wisdom quotes for "Wisdom of the Day"
const WISDOM_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The unexamined life is not worth living.", author: "Socrates" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "The only thing we have to fear is fear itself.", author: "Franklin D. Roosevelt" },
  { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas Edison" },
  { text: "If you look at what you have in life, you'll always have more.", author: "Oprah Winfrey" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Everything has beauty, but not everyone sees it.", author: "Confucius" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
  { text: "When one door of happiness closes, another opens.", author: "Helen Keller" },
  { text: "Twenty years from now you will be more disappointed by the things that you didn't do.", author: "Mark Twain" },
  { text: "Keep your face always toward the sunshine, and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "Whoever is happy will make others happy too.", author: "Anne Frank" },
  { text: "Don't let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "You learn more from failure than from success. Don't let it stop you.", author: "Unknown" },
  { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
  { text: "People who are crazy enough to think they can change the world, are the ones who do.", author: "Rob Siltanen" },
  { text: "Failure will never overtake me if my determination to succeed is strong enough.", author: "Og Mandino" },
  { text: "We may encounter many defeats but we must not be defeated.", author: "Maya Angelou" },
  { text: "Knowing is not enough; we must apply. Wishing is not enough; we must do.", author: "Johann Wolfgang von Goethe" },
  { text: "Imagine your life is perfect in every respect; what would it look like?", author: "Brian Tracy" },
  { text: "We generate fears while we sit. We overcome them by action.", author: "Dr. Henry Link" },
  { text: "Security is mostly a superstition. Life is either a daring adventure or nothing.", author: "Helen Keller" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Fall seven times and stand up eight.", author: "Japanese Proverb" },
  { text: "When everything seems to be going against you, remember that the airplane takes off against the wind.", author: "Henry Ford" },
  { text: "Too many of us are not living our dreams because we are living our fears.", author: "Les Brown" },
  { text: "I have learned over the years that when one's mind is made up, this diminishes fear.", author: "Rosa Parks" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "The question isn't who is going to let me; it's who is going to stop me.", author: "Ayn Rand" },
  { text: "The best revenge is massive success.", author: "Frank Sinatra" },
  { text: "Build your own dreams, or someone else will hire you to build theirs.", author: "Farrah Gray" },
  { text: "The battles that count aren't the ones for gold medals. The struggles within yourself.", author: "Jesse Owens" },
  { text: "I attribute my success to this: I never gave or took any excuse.", author: "Florence Nightingale" },
  { text: "I would rather die of passion than of boredom.", author: "Vincent Van Gogh" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { text: "A truly rich man is one whose children run into his arms when his hands are empty.", author: "Unknown" },
  { text: "It is not what you look at that matters, it is what you see.", author: "Henry David Thoreau" },
  { text: "The greatest weapon against stress is our ability to choose one thought over another.", author: "William James" },
  { text: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.", author: "John Milton" },
  { text: "Happiness is not a goal; it is a by-product.", author: "Eleanor Roosevelt" },
  { text: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { text: "We must believe that we are gifted for something and that this thing must be attained.", author: "Marie Curie" },
  { text: "Nothing is impossible, the word itself says 'I'm possible'!", author: "Audrey Hepburn" },
  { text: "There is nothing permanent except change.", author: "Heraclitus" },
  { text: "You cannot shake hands with a clenched fist.", author: "Indira Gandhi" },
  { text: "What's done is done.", author: "William Shakespeare" },
  { text: "For every minute you are angry you lose sixty seconds of happiness.", author: "Ralph Waldo Emerson" },
  { text: "If opportunity doesn't knock, build a door.", author: "Milton Berle" },
  { text: "Very little is needed to make a happy life; it is all within yourself.", author: "Marcus Aurelius" },
  { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca" },
  { text: "It is not length of life, but depth of life.", author: "Ralph Waldo Emerson" },
  { text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
  { text: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.", author: "Marcus Aurelius" },
  { text: "You have power over your mind, not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing about what a good person should be. Be one.", author: "Marcus Aurelius" },
  { text: "Accept the things to which fate binds you, and love the people with whom fate brings you together.", author: "Marcus Aurelius" },
  { text: "How much more grievous are the consequences of anger than the causes of it.", author: "Marcus Aurelius" },
  { text: "If it is not right do not do it; if it is not true do not say it.", author: "Marcus Aurelius" },
  { text: "Our life is what our thoughts make it.", author: "Marcus Aurelius" },
  { text: "Never let the future disturb you. You will meet it with the same weapons of reason.", author: "Marcus Aurelius" },
  { text: "Look well into thyself; there is a source of strength which will always spring up if thou wilt always look.", author: "Marcus Aurelius" },
  { text: "He who lives in harmony with himself lives in harmony with the universe.", author: "Marcus Aurelius" },
  { text: "The soul becomes dyed with the color of its thoughts.", author: "Marcus Aurelius" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "To love and be loved is to feel the sun from both sides.", author: "David Viscott" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
];

interface ExploreProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

type ExploreTab = 'journeys' | 'toolbox';

// Get prompt of the day based on date
const getPromptOfTheDay = () => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  // Get all prompts from all categories
  const allPrompts: { text: string; category: string }[] = [];
  PROMPT_CATEGORIES.forEach(cat => {
    cat.prompts.forEach((prompt: string) => {
      allPrompts.push({ text: prompt, category: cat.title });
    });
  });

  const promptIndex = dayOfYear % allPrompts.length;
  return allPrompts[promptIndex];
};

// Get wisdom of the day based on date
const getWisdomOfTheDay = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return WISDOM_QUOTES[dayOfYear % WISDOM_QUOTES.length];
};

const Explore: React.FC<ExploreProps> = ({ onChangeView }) => {
  const { isPro, isPremium, user } = useAuth();
  const [activeTab, setActiveTab] = useState<ExploreTab>('journeys');
  const [allProgress, setAllProgress] = useState<Map<string, JourneyProgress>>(new Map());
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  const featuredJourney = JOURNEYS.find(j => j.isFeatured) || JOURNEYS[0];
  const otherJourneys = JOURNEYS.filter(j => j.id !== featuredJourney.id);

  // Get today's prompt and wisdom
  const promptOfTheDay = useMemo(() => getPromptOfTheDay(), []);
  const wisdomOfTheDay = useMemo(() => getWisdomOfTheDay(), []);

  // Load all journey progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setIsLoadingProgress(false);
        return;
      }

      try {
        const progressList = await JourneyProgressService.getAllProgress();
        const progressMap = new Map(progressList.map(p => [p.journey_id, p]));
        setAllProgress(progressMap);
      } catch (err) {
        console.error('Failed to load journey progress:', err);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadProgress();
  }, [user]);

  // Get progress stats for a journey
  const getProgressStats = (journeyId: string, totalDays: number) => {
    const progress = allProgress.get(journeyId);
    return JourneyProgressService.getProgressStats(progress || null, totalDays);
  };

  const featuredProgress = useMemo(() => {
    return getProgressStats(featuredJourney.id, featuredJourney.totalDays);
  }, [featuredJourney.id, featuredJourney.totalDays, allProgress]);

  // Get active and completed journeys
  const { activeJourneys, completedJourneys } = useMemo(() => {
    const active: { journey: any; progress: any }[] = [];
    const completed: { journey: any; progress: any }[] = [];

    JOURNEYS.forEach(journey => {
      const stats = getProgressStats(journey.id, journey.totalDays);
      if (stats.isComplete) {
        completed.push({ journey, progress: stats });
      } else if (stats.completed > 0) {
        active.push({ journey, progress: stats });
      }
    });

    return { activeJourneys: active, completedJourneys: completed };
  }, [allProgress]);

  // Surprise Me - random prompt
  const handleSurpriseMe = () => {
    const allPrompts: { text: string; categoryId: string }[] = [];
    PROMPT_CATEGORIES.forEach(cat => {
      cat.prompts.forEach((prompt: string) => {
        allPrompts.push({ text: prompt, categoryId: cat.id });
      });
    });
    const randomPrompt = allPrompts[Math.floor(Math.random() * allPrompts.length)];
    onChangeView(ViewState.EDITOR, { prompt: randomPrompt.text });
  };

  const requirePlan = (required: 'pro' | 'premium', action: () => void) => {
    if (required === 'premium' && !isPremium) {
      onChangeView(ViewState.PRICING);
      return;
    }
    if (required === 'pro' && !isPro) {
      onChangeView(ViewState.PRICING);
      return;
    }
    action();
  };

  return (
    <div className="animate-fade-up pb-28 md:pb-12 max-w-4xl mx-auto min-h-screen flex flex-col">

      {/* Header & Toggle */}
      <div className="flex flex-col items-center mb-10 text-center">
        <h2 className="font-serif text-4xl text-sage-900 mb-6">Explore</h2>

        {/* Segmented Control */}
        <div className="inline-flex glass-card p-1 rounded-full border border-stone-200/70 shadow-sm relative">
          <div
            className="absolute top-1 bottom-1 bg-gradient-to-tr from-sage-500 to-sage-400 rounded-full transition-all duration-300 shadow-md"
            style={{
              left: activeTab === 'journeys' ? '4px' : 'calc(50%)',
              width: 'calc(50% - 4px)'
            }}
          />

          <button
            onClick={() => setActiveTab('journeys')}
            className={`relative z-10 w-[120px] py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'journeys' ? 'text-white' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Library
          </button>
          <button
            onClick={() => setActiveTab('toolbox')}
            className={`relative z-10 w-[120px] py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'toolbox' ? 'text-white' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Toolbox
          </button>
        </div>
      </div>

      {/* --- TAB: LIBRARY (JOURNEYS & PROMPTS) --- */}
      {activeTab === 'journeys' && (
        <div className="space-y-10 animate-fade-in">

          {/* Wisdom of the Day (Horizontal Note Card) */}
          <div className="glass-card rounded-[18px] px-6 py-4 border border-stone-100/70 shadow-card max-w-lg mx-auto">
            <p className="font-serif text-base text-stone-700 italic leading-relaxed text-center">
              "{wisdomOfTheDay.text}" <span className="text-stone-400 not-italic">— {wisdomOfTheDay.author}</span>
            </p>
          </div>

          {/* Active Journeys (if any) */}
          {activeJourneys.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-[1rem] font-serif text-stone-700 flex items-center gap-2">
                  <Clock size={16} className="text-sage-500" />
                  Continue Your Journey
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeJourneys.slice(0, 2).map(({ journey, progress }) => (
                  <div
                    key={journey.id}
                    onClick={() => onChangeView(ViewState.JOURNEY_DETAIL, { id: journey.id, title: journey.title })}
                    className="glass-card rounded-[24px] p-6 cursor-pointer border border-stone-100/70 hover:border-sage-200 hover:shadow-card-hover hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center">
                        <journey.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-stone-800 group-hover:text-sage-700 transition-colors">{journey.title}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-1.5 flex-1 bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full bg-sage-400 transition-all duration-500" style={{ width: `${progress.percent}%` }} />
                          </div>
                          <span className="text-xs text-sage-500 font-bold">{progress.dayLabel}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-stone-50 text-stone-300 group-hover:bg-sage-500 group-hover:text-white flex items-center justify-center transition-all">
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Completed Journeys */}
          {completedJourneys.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-[1rem] font-serif text-stone-700 flex items-center gap-2">
                  <Trophy size={16} className="text-amber-400" />
                  Completed Journeys
                </h3>
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400">{completedJourneys.length} completed</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {completedJourneys.map(({ journey }) => (
                  <div
                    key={journey.id}
                    onClick={() => onChangeView(ViewState.JOURNEY_DETAIL, { id: journey.id, title: journey.title })}
                    className="glass-card rounded-[20px] p-5 min-w-[200px] cursor-pointer border border-stone-100/70 shadow-sm hover:shadow-card-hover hover:-translate-y-0.5 transition-all group flex-shrink-0"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                        <CheckCircle size={14} />
                      </div>
                      <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Complete</span>
                    </div>
                    <h4 className="font-serif text-sm text-stone-800 group-hover:text-emerald-700 transition-colors">{journey.title}</h4>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Featured Journey */}
          <div
            onClick={() => onChangeView(ViewState.JOURNEY_DETAIL, { id: featuredJourney.id, title: featuredJourney.title })}
            className="group cursor-pointer relative glass-card rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-0.5 hover:shadow-card-hover border border-stone-100/70"
          >
            <div className="flex flex-col md:flex-row">
              {/* Content */}
              <div className="flex-1 p-8 lg:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-sage-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-md shadow-sage-200">
                    <Star size={10} fill="currentColor" strokeWidth={0} /> Featured
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-sage-400">
                    {isLoadingProgress ? 'Loading…' : featuredProgress.statusLabel}
                  </span>
                </div>

                <h3 className="font-serif text-3xl lg:text-4xl text-sage-900 mb-4 leading-tight group-hover:text-sage-700 transition-colors">{featuredJourney.title}</h3>
                <p className="text-stone-500 text-lg mb-8 leading-relaxed max-w-md">
                  {featuredJourney.description}
                </p>

                <div className="flex items-center gap-6 text-xs font-bold text-stone-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-stone-300" /> {featuredJourney.totalDays} days</span>
                  <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-stone-300" /> 10 min/day</span>
                </div>
              </div>

              {/* Icon Area (right side) */}
              <div className="w-full md:w-1/3 bg-sage-50 flex items-center justify-center p-12 group-hover:bg-sage-100 transition-colors border-l border-sage-100/50">
                <div className="w-24 h-24 rounded-[32px] bg-white text-sage-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500">
                  <Play size={40} fill="currentColor" className="ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Journey Library */}
          <section>
            <h3 className="text-[1rem] font-serif text-stone-700 mb-6 px-1 text-center lg:text-left flex items-center justify-center lg:justify-start gap-2">
              <Compass size={18} /> All Journeys
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherJourneys.map(journey => {
                const stats = getProgressStats(journey.id, journey.totalDays);
                return (
                  <JourneyCard
                    key={journey.id}
                    journey={journey}
                    progress={stats}
                    onClick={() => onChangeView(ViewState.JOURNEY_DETAIL, { id: journey.id, title: journey.title })}
                  />
                );
              })}
            </div>
          </section>

          {/* Prompt of the Day */}
          <section className="glass-card rounded-[20px] p-5 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[1rem] font-serif text-text-primary flex items-center gap-2">
                <Sparkles size={16} className="text-sage" />
                Today's Prompt
              </h3>
              <span className="text-xs text-text-muted uppercase tracking-wider">{promptOfTheDay.category}</span>
            </div>
            <p className="font-serif text-lg text-text-primary mb-4 leading-relaxed">"{promptOfTheDay.text}"</p>
            <div className="flex gap-3">
              <button
                onClick={() => onChangeView(ViewState.EDITOR, { prompt: promptOfTheDay.text })}
                className="flex-1 py-3 bg-sage text-white rounded-full font-medium shadow-[0_4px_14px_0_rgba(107,143,122,0.39)] hover:shadow-[0_6px_20px_rgba(107,143,122,0.5)] hover:-translate-y-0.5 transition-all"
              >
                Reflect on This
              </button>
              <button
                onClick={handleSurpriseMe}
                className="px-5 py-3 bg-white/70 border border-stone-200/70 rounded-full font-medium text-stone-600 hover:text-sage hover:border-sage-300 hover:shadow-sm transition-all flex items-center gap-2"
              >
                <Shuffle size={16} />
                Surprise Me
              </button>
            </div>
          </section>

          {/* Prompt Library Categories */}
          <section>
            <h3 className="text-[1rem] font-serif text-stone-700 mb-6 px-1 text-center lg:text-left">Prompt Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PROMPT_CATEGORIES.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => onChangeView(ViewState.PROMPT_LIST, { categoryId: category.id, title: category.title })}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {/* --- TAB: TOOLBOX --- */}
      {activeTab === 'toolbox' && (
        <div className="space-y-8 animate-fade-in">

          {/* Main Focus Tool: Intentions */}
          <div className="glass-card rounded-[32px] p-8 border border-stone-100/70 shadow-sm hover:shadow-card-hover hover:-translate-y-0.5 transition-all flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
            <div className="w-16 h-16 rounded-[24px] bg-stone-900 text-white flex items-center justify-center shrink-0 mx-auto lg:mx-0 shadow-lg">
              <Target size={28} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-stone-900 mb-2">Intentions Hub</h3>
              <p className="text-stone-500 font-serif italic max-w-lg mx-auto lg:mx-0">
                The central compass for your life. Connect your daily notes to your bigger picture.
              </p>
            </div>
            <button
              onClick={() => onChangeView(ViewState.SPACE_INTENTIONS)}
              className="px-8 py-3 bg-stone-100 text-stone-900 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-stone-200 transition-all flex items-center gap-2 mx-auto lg:mx-0"
            >
              Open Hub <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ToolCard
              title="The Vault"
              desc="Send letters to your future self. Sealed with a digital wax seal."
              icon={Archive}
              color="sage"
              onClick={() => requirePlan('premium', () => onChangeView(ViewState.SPACE_VAULT))}
              badge="Time Capsule"
              premium={!isPremium}
            />

            <ToolCard
              title="Insight Engine"
              desc="AI-powered analysis of your emotional patterns and writing habits."
              icon={Lightbulb}
              color="sage"
              onClick={() => requirePlan('premium', () => onChangeView(ViewState.SPACE_INSIGHT_ENGINE))}
              badge="AI Powered"
              premium={!isPremium}
            />

            <ToolCard
              title="Decision Lab"
              desc="A structured framework for making difficult life choices with clarity."
              icon={Scale}
              color="sage"
              onClick={() => requirePlan('premium', () => onChangeView(ViewState.SPACE_DECISION))}
              badge="Framework"
              premium={!isPremium}
            />

            <ToolCard
              title="Dream Journal"
              desc="Capture the subconscious. Track symbols, moods, and recurring themes."
              icon={Moon}
              color="sage"
              onClick={() => requirePlan('premium', () => onChangeView(ViewState.SPACE_DREAM_JOURNAL))}
              badge="New"
              premium={!isPremium}
            />

            <ToolCard
              title="Thread Tapestry"
              desc="Visualize the connections between your thoughts in a 3D space."
              icon={GitBranch}
              color="sage"
              onClick={() => onChangeView(ViewState.SPACE_THREAD_TAPESTRY)}
              badge="Visualization"
            />
          </div>

        </div>
      )}

    </div>
  );
};

// --- Sub Components ---

const JourneyCard: React.FC<{ journey: any, progress: any, onClick: () => void }> = ({ journey, progress, onClick }) => {
  return (
    <div onClick={onClick} className="glass-card p-8 rounded-[32px] transition-all cursor-pointer h-full flex flex-col items-center lg:items-start text-center lg:text-left group relative overflow-hidden border border-stone-100/70 hover:shadow-card-hover hover:-translate-y-0.5">
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-stone-50 text-stone-400 group-hover:bg-sage-50 group-hover:text-sage-600 transition-colors duration-500">
        <journey.icon size={28} strokeWidth={1.5} />
      </div>

      <h4 className="font-serif text-xl text-stone-900 mb-2 group-hover:text-sage-700 transition-colors">{journey.title}</h4>
      <p className="text-sm text-stone-500 leading-relaxed font-serif italic line-clamp-2 flex-1 mb-6">{journey.description}</p>

      {/* Footer */}
      <div className="pt-6 border-t border-stone-100 flex items-center justify-between w-full mt-auto">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 group-hover:text-sage-400 transition-colors">{journey.totalDays} Days</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${progress.isComplete ? 'bg-emerald-500 text-white' : 'bg-transparent text-stone-300 group-hover:text-sage-500 group-hover:bg-sage-50'}`}>
          {progress.isComplete ? <CheckCircle size={14} /> : <ArrowRight size={14} />}
        </div>
      </div>
    </div>
  )
}

const CategoryCard: React.FC<{ category: any, onClick: () => void }> = ({ category, onClick }) => {
  return (
    <button onClick={onClick} className="glass-card p-6 rounded-[24px] transition-colors text-center lg:text-left group flex flex-col items-center lg:items-start gap-4 min-h-[140px] border border-stone-100/70 hover:border-sage-200 hover:shadow-card-hover">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-sage-50 text-sage-500 group-hover:bg-sage-100 group-hover:text-sage-600 transition-colors">
        <category.icon size={20} strokeWidth={1.5} />
      </div>
      <div>
        <h4 className="font-serif text-stone-800 text-lg mb-1 group-hover:text-sage-700 transition-colors">{category.title}</h4>
        <p className="text-[10px] font-bold text-sage-400 uppercase tracking-widest">{category.count} Prompts</p>
      </div>
    </button>
  );
};

const ToolCard = ({ title, desc, icon: Icon, color, onClick, badge, premium }: any) => {

  const getColorClasses = (c: string) => {
    switch (c) {
      case 'rose': return 'bg-rose-50 text-rose-500 group-hover:bg-rose-100';
      case 'emerald': return 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100';
      case 'indigo': return 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100';
      case 'amber': return 'bg-amber-50 text-amber-500 group-hover:bg-amber-100';
      case 'slate': return 'bg-slate-50 text-slate-500 group-hover:bg-slate-100';
      default: return 'bg-sage-50 text-sage-500 group-hover:bg-sage-100';
    }
  }

  return (
    <div
      onClick={onClick}
      className="group relative p-8 glass-card rounded-[32px] transition-all cursor-pointer text-center lg:text-left flex flex-col items-center lg:items-start border border-stone-100/70 hover:shadow-card-hover hover:-translate-y-0.5"
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${getColorClasses(color)}`}>
        <Icon size={28} strokeWidth={1.5} />
      </div>

      <div className="flex justify-center lg:justify-between items-start mb-2 w-full">
        <h3 className="font-serif text-xl text-stone-900 group-hover:text-sage-900 transition-colors">
          {title}
        </h3>
        {premium && <Lock size={16} className="text-stone-300 absolute right-8 top-8 lg:static" />}
      </div>

      <p className="text-stone-500 font-serif italic text-sm leading-relaxed mb-8 flex-1">
        {desc}
      </p>

      <div className="flex items-center justify-between mt-auto w-full">
        <div>
          {badge && (
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-50 text-stone-500 border border-stone-100 group-hover:bg-white group-hover:shadow-sm transition-all`}>
              {badge}
            </span>
          )}
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-stone-300 group-hover:text-stone-900 transition-all">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default Explore;
