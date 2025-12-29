import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GuidedReflection, GoalFramework, SelfDiscoveryExperience, ViewState, QuickWrite } from '../types';
import { GUIDED_REFLECTIONS, GOAL_FRAMEWORKS, SELF_DISCOVERY_EXPERIENCES, QUICK_WRITES } from '../data/content';
import {
  ChevronLeft,
  X, Feather, Compass, Zap,
  Image as ImageIcon,
  GitBranch, Folder, Hash, MoreVertical,
  Check, Trash2, Plus,
  ArrowRight, Sparkles, Target, Share, Download, EyeOff, MessageSquare, Send, Loader2, Lightbulb
} from 'lucide-react';

// Import unique Quick Jot experiences
import {
  BrainDump,
  ThreeGoodThings,
  EnergyCheck,
  MorningPages,
  EveningReset,
  OneWord,
  BodyScan,
  Wins,
  WhatILearned,

} from '../components/quick-jots';

// Import unique Guided Reflection experiences
import {
  DecisionClarity,
  WeeklyReset,
  GratitudeGrowth,
  ValuesAlignment,
  ConnectionAppreciation,
  CreativeUnblock,
  DailyClarity,
  FearInventory,
  FutureSelfLetter,
  WhatsReallyGoingOn
} from '../components/guided-reflections';

// Import unique Goal Setting experiences
import {
  SMARTGoals,
  OKRs,
  NinetyDaySprint,
  HabitStacking,
  VisionBoardBuilder,
  MilestoneMapper,
  AccountabilityCheckins,
  GoalAutopsy,
  SuccessVisualization
} from '../components/goal-setting';

// Import unique Self-Discovery experiences
import {
  ValuesDiscovery,
  StrengthsFinder,
  LifeWheelAssessment,
  PersonalityExploration,
  CoreBeliefsExamination,
  LifeTimelineMapping,
  FutureSelfVisualization,
  LimitingBeliefsInventory,
  PurposeExploration
} from '../components/self-discovery';
import { JournalService } from '../services/journal';
import { AIService } from '../services/ai';
import { ThreadService, Thread } from '../services/threads';
import { MoodService } from '../services/mood';
import { useDebounce } from '../hooks/use-debounce';
import { toast } from '../hooks/use-toast';

interface EditorProps {
  onChangeView: (view: ViewState, data?: any) => void;
  initialData?: any;
}

type EditorMode =
  | 'selection'
  | 'free'
  | 'quick-menu'
  | 'quick-session'
  | 'guided-menu'
  | 'guided-session'
  | 'goals'
  | 'goals-menu'
  | 'goals-session'
  | 'discovery'
  | 'discovery-menu'
  | 'discovery-session';

// Initial categories
const INITIAL_CATEGORIES = ['Work', 'Personal', 'Ideas', 'Journal', 'Morning Pages'];

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800"
];

const Editor: React.FC<EditorProps> = ({ onChangeView, initialData }) => {
  // --- STATE ---
  const [mode, setMode] = useState<EditorMode>(initialData?.prompt || initialData?.entryId || initialData?.voiceMode ? 'free' : 'selection');
  const [selectedQuickJot, setSelectedQuickJot] = useState<QuickWrite | null>(null);
  const [selectedGuidedReflection, setSelectedGuidedReflection] = useState<GuidedReflection | null>(null);
  const [selectedGoalFramework, setSelectedGoalFramework] = useState<GoalFramework | null>(null);
  const [selectedSelfDiscovery, setSelectedSelfDiscovery] = useState<SelfDiscoveryExperience | null>(null);
  const [entryId, setEntryId] = useState<string | null>(initialData?.entryId || null);
  const [isNewEntrySession] = useState(!initialData?.entryId);
  const [isLoadingEntry, setIsLoadingEntry] = useState(false);
  // intentionId removed - not in database schema

  // Content
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [promptInspiration, setPromptInspiration] = useState<string | null>(initialData?.prompt || null);
  const [images, setImages] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [pendingAudioBlob, setPendingAudioBlob] = useState<Blob | null>(null);

  // UX State
  const [isTyping, setIsTyping] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAtMs, setLastSavedAtMs] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastSavedContentRef = useRef(initialData?.content || '');
  const lastSavedTitleRef = useRef(initialData?.title || '');
  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const [debouncedContent] = useDebounce(content, 3000);
  const [debouncedTitle] = useDebounce(title, 2000);

  // Autosave Effect (Content & Title)
  useEffect(() => {
    const contentChanged = debouncedContent && debouncedContent !== lastSavedContentRef.current;
    const titleChanged = debouncedTitle && debouncedTitle !== (lastSavedTitleRef.current || 'Untitled Entry') && debouncedTitle !== '';
    const hasContent = debouncedContent && debouncedContent.trim().length > 0;

    // Autosave for existing entries OR create new entry if content exists
    if ((contentChanged || titleChanged) && !isSaving && hasContent) {
      handleSave({
        content: debouncedContent,
        title: debouncedTitle,
        ignorePendingAudio: true,
        silent: true
      });
      lastSavedContentRef.current = debouncedContent;
      lastSavedTitleRef.current = debouncedTitle;
    }
  }, [debouncedContent, debouncedTitle]);

  // Auto-resize title
  useEffect(() => {
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = 'auto';
      titleTextareaRef.current.style.height = titleTextareaRef.current.scrollHeight + 'px';
    }
  }, [title]);

  // Auto-resize body (avoid internal textarea scrollbar)
  useEffect(() => {
    const el = contentTextareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [content]);

  // Mood State
  const [dailyMood, setDailyMood] = useState<string | null>(null);

  // Load Daily Mood
  useEffect(() => {
    const loadMood = async () => {
      try {
        const log = await MoodService.getTodayMoodLog();
        if (log) setDailyMood(log.mood);
      } catch (e) {
        console.error("Failed to load mood in editor", e);
      }
    };
    loadMood();
  }, []);

  // Metadata State
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState<'thread' | 'category' | 'tags'>('thread');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [selectedThread, setSelectedThread] = useState<string | null>(initialData?.threadId || null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [newThreadInput, setNewThreadInput] = useState('');

  // Fetch threads on mount
  useEffect(() => {
    const fetchThreads = async () => {
      setIsLoadingThreads(true);
      try {
        const data = await ThreadService.getThreads();
        setThreads(data);
      } catch (error) {
        console.error('Failed to fetch threads:', error);
      } finally {
        setIsLoadingThreads(false);
      }
    };
    fetchThreads();
  }, []);

  // Image dialog state
  const [showImageDialog, setShowImageDialog] = useState(false);

  // AI Reflection state
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [isLoadingReflection, setIsLoadingReflection] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // Load existing entry if entryId is provided
  useEffect(() => {
    const loadEntry = async () => {
      if (initialData?.entryId) {
        setIsLoadingEntry(true);
        try {
          const entry = await JournalService.getEntry(initialData.entryId);
          if (entry) {
            setTitle(entry.title || '');
            setContent(entry.content || '');
            setTags(entry.tags || []);
            setSelectedThread(entry.thread_id ?? null);
            // intentionId not in database schema
            setWordCount(entry.content?.trim().split(/\s+/).filter(w => w.length > 0).length || 0);
            if (entry.audio_url) {
              setAudioUrl(entry.audio_url);
            }
          }
        } catch (error) {
          console.error('Failed to load entry:', error);
        } finally {
          setIsLoadingEntry(false);
        }
      }
    };
    loadEntry();
  }, [initialData?.entryId]);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetDraftForNewEntry = () => {
    setEntryId(null);
    setTitle('');
    setContent('');
    setPromptInspiration(null);
    setImages([]);
    setWordCount(0);
    setAudioUrl(null);
    setPendingAudioBlob(null);
    setAiReflection(null);
    setAiInsight(null);
    // intentionId not used
    setSelectedCategory(null);
    setTags([]);
    setTagInput('');
  };

  // Handle Mode Selection
  const handleModeSelect = (selectedMode: EditorMode) => {
    if (selectedMode === 'quick-menu') {
      resetDraftForNewEntry();
      setSelectedQuickJot(null);
      setMode('quick-menu');
      return;
    }

    if (selectedMode === 'guided-menu') {
      resetDraftForNewEntry();
      setSelectedGuidedReflection(null);
      setMode('guided-menu');
      return;
    }

    // Redirect 'goals' to 'goals-menu' for framework selection
    if (selectedMode === 'goals') {
      resetDraftForNewEntry();
      setSelectedGoalFramework(null);
      setMode('goals-menu');
      return;
    }

    // Redirect 'discovery' to 'discovery-menu' for experience selection
    if (selectedMode === 'discovery') {
      resetDraftForNewEntry();
      setSelectedSelfDiscovery(null);
      setMode('discovery-menu');
      return;
    }

    setMode(selectedMode);
  };

  // Completion from Interactive Session
  const handleSessionComplete = (generatedTitle: string, generatedContent: string) => {
    setTitle(generatedTitle);
    setContent(generatedContent);
    setMode('free'); // Move to editor to finalize
    // Simulate auto-tagging based on mode
    if (generatedTitle.includes("Goal")) {
      setTags([...tags, "planning", "goals"]);
      setSelectedCategory("Personal");
    } else {
      setTags([...tags, "reflection", "insight"]);
      setSelectedCategory("Journal");
    }
  };

  // Focus Mode Logic
  const handleUserActivity = () => {
    setIsTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (content.length > 50 && !showMenu && !showDrawer && mode === 'free') setIsTyping(true);
    }, 2500);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [content, showMenu, showDrawer, mode]);

  // Focus mode hotkeys:
  // - Cmd/Ctrl + Shift + F toggles focus mode
  // - Escape exits focus mode
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isToggle = (e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'f';
      if (isToggle) {
        e.preventDefault();
        setIsFocusMode((v) => !v);
        setShowMenu(false);
      }

      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
        setShowMenu(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFocusMode]);

  // --- HANDLERS ---
  const toggleDrawer = (tab: 'thread' | 'category' | 'tags') => {
    if (showDrawer && activeTab === tab) {
      setShowDrawer(false);
    } else {
      setActiveTab(tab);
      setShowDrawer(true);
      setIsCreatingCategory(false);
    }
  };

  const handleAddImage = () => {
    setShowImageDialog(true);
  };

  const handleSelectImage = (imageUrl: string) => {
    // Limit to 2 images max for clean aesthetic
    if (images.length < 2) {
      setImages([...images, imageUrl]);
    }
    setShowImageDialog(false);
  };

  const handleDismissPrompt = () => {
    setPromptInspiration(null);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      const tagToAdd = tagInput.trim().toLowerCase();
      if (!tags.includes(tagToAdd)) {
        const newTags = [...tags, tagToAdd];
        setTags(newTags);
        // Save immediately when adding a tag if entry exists
        if (entryId) {
          handleSave({ tags: newTags, silent: true, ignorePendingAudio: true });
        }
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    setTags(newTags);
    // Save immediately when removing a tag if entry exists
    if (entryId) {
      await handleSave({ tags: newTags, silent: true, ignorePendingAudio: true });
    }
  };

  const handleCreateCategory = () => {
    if (newCategoryInput.trim()) {
      const newCat = newCategoryInput.trim();
      setCategories([...categories, newCat]);
      setSelectedCategory(newCat);
      setNewCategoryInput('');
      setIsCreatingCategory(false);
      setShowDrawer(false);
    }
  };

  const handleSave = async (overrides?: {
    title?: string;
    content?: string;
    tags?: string[];
    threadId?: string | null;
    entryId?: string | null;
    ignorePendingAudio?: boolean;
    audioBlob?: Blob | null;
    silent?: boolean;
    isReflection?: boolean;
  }) => {
    const contentToSave = overrides?.content ?? content;
    const titleToSave = overrides?.title ?? title;
    const entryIdToUse = overrides?.entryId !== undefined ? overrides.entryId : entryId;
    const threadIdToUse = overrides?.threadId !== undefined ? overrides.threadId : selectedThread;
    const isReflectionToUse = overrides?.isReflection ?? false;
    const baseTags = overrides?.tags ?? tags;
    const tagsToSave = Array.from(new Set([...(baseTags || []), ...(selectedCategory ? [selectedCategory] : [])]));

    const audioBlobToUpload = overrides?.ignorePendingAudio
      ? (overrides.audioBlob ?? null)
      : (overrides?.audioBlob ?? pendingAudioBlob);

    if (import.meta.env.DEV) {
      console.log('[THREAD_DEBUG] handleSave', {
        entryIdToUse,
        selectedThread,
        threadIdToUse,
        titleToSave,
        hasContent: !!contentToSave.trim(),
        hasAudio: !!audioBlobToUpload,
        tags: tagsToSave,
        baseTags: baseTags,
        tagsState: tags,
        isReflection: isReflectionToUse,
      });
    }

    if (!contentToSave.trim() && !audioBlobToUpload) return;

    setIsSaving(true);
    try {
      // Upload audio if we have a pending blob
      let savedAudioPath = null;
      let savedAudioSignedUrl = audioUrl;

      if (audioBlobToUpload) {
        try {
          const result = await JournalService.uploadAudio(audioBlobToUpload);
          savedAudioPath = result.path;
          savedAudioSignedUrl = result.signedUrl;
          setAudioUrl(savedAudioSignedUrl);
          if (!overrides?.ignorePendingAudio) setPendingAudioBlob(null);
        } catch (err) {
          console.error("Failed to upload audio:", err);
        }
      }

      if (entryIdToUse) {
        // Update existing entry
        await JournalService.updateEntry(entryIdToUse, {
          title: titleToSave || 'Untitled Entry',
          content: contentToSave,
          tags: tagsToSave,
          thread_id: threadIdToUse ?? null,
          mood: isNewEntrySession ? (dailyMood || undefined) : undefined,
          is_reflection: isReflectionToUse
        });

        if (import.meta.env.DEV) {
          console.log('[THREAD_DEBUG] updatedEntry', { entryId: entryIdToUse, thread_id: threadIdToUse ?? null });
        }
      } else {
        // Create new entry with thread_id
        const created = await JournalService.createEntry(
          titleToSave || 'Untitled Entry',
          contentToSave,
          tagsToSave,
          isReflectionToUse,
          threadIdToUse || undefined,
          savedAudioPath || undefined,
          dailyMood || undefined // Save daily mood
        );

        if (import.meta.env.DEV) {
          console.log('[THREAD_DEBUG] createdEntry', {
            entryId: created?.id,
            thread_id: threadIdToUse || null,
            is_reflection: isReflectionToUse,
            tags: tagsToSave
          });
        }
        if (created?.id) setEntryId(created.id); // Update entryId so subsequent saves update instead of create
      }

      // Mark saved (for both manual saves and autosaves).
      setLastSavedAtMs(Date.now());

      if (!overrides?.silent) {
        toast({
          title: 'Saved',
          description: 'Your entry has been saved.',
        });
        // Notify journal to refetch entries
        window.dispatchEvent(new CustomEvent('journal:refresh'));
        if (initialData?.returnTo) {
          onChangeView(initialData.returnTo, initialData.returnToData);
        } else {
          onChangeView(ViewState.JOURNAL);
        }
      }
    } catch (err) {
      console.error("Failed to save:", err);
      toast({
        title: "Couldn’t save",
        description: err instanceof Error ? err.message : 'Please sign in to save entries.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // AI Reflection handlers
  const handleGetReflection = async () => {
    if (!content.trim() || content.length < 50) {
      toast({
        title: 'Need more content',
        description: 'Write at least 50 characters to get a reflection prompt.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingReflection(true);
    try {
      const reflection = await AIService.getReflectionPrompt(content, title);
      if (reflection) {
        setAiReflection(reflection);
      } else {
        toast({
          title: 'Couldn\'t generate reflection',
          description: 'Please try again in a moment.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to get reflection:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get reflection prompt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingReflection(false);
    }
  };

  const handleGetInsight = async () => {
    if (!content.trim() || content.length < 50) {
      toast({
        title: 'Need more content',
        description: 'Write at least 50 characters to get an insight.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingInsight(true);
    try {
      const insight = await AIService.getInsight(content, title);
      if (insight) {
        setAiInsight(insight);
      } else {
        toast({
          title: 'Couldn\'t generate insight',
          description: 'Please try again in a moment.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to get insight:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get insight. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- RENDERERS ---

  if (mode === 'selection') {
    return <ModeSelection onSelect={handleModeSelect} onClose={() => onChangeView(ViewState.HOME)} />;
  }

  // --- SELF DISCOVERY ---
  if (mode === 'discovery-menu') {
    return (
      <div className="min-h-screen bg-dark-base p-6 pb-28 lg:pb-10 animate-fade-up">
        <div className="max-w-4xl mx-auto pt-10">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setMode('selection')} className="p-2 hover:bg-dark-hover rounded-full transition-colors">
              <ChevronLeft size={24} className="text-text-secondary" />
            </button>
            <div>
              <h2 className="font-serif text-3xl text-text-primary">Self Discovery</h2>
              <p className="text-text-tertiary">Explore who you are and who you're becoming.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SELF_DISCOVERY_EXPERIENCES.map((exp, idx) => (
              <button
                key={exp.id}
                onClick={() => {
                  setSelectedSelfDiscovery(exp);
                  setMode('discovery-session');
                }}
                className="glass-card p-6 rounded-3xl text-left hover:border-sage-border hover:shadow-glow transition-all group animate-fade-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${exp.color === 'lavender'
                  ? 'bg-lavender/20 text-lavender group-hover:bg-lavender group-hover:text-white'
                  : 'bg-sage-muted text-sage group-hover:bg-sage group-hover:text-white group-hover:shadow-glow'
                  }`}>
                  <exp.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-text-primary mb-2">{exp.title}</h3>
                <p className="text-sm text-text-tertiary font-light">{exp.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'discovery-session' && selectedSelfDiscovery) {
    const handleSelfDiscoveryComplete = async (finalTitle: string, finalContent: string) => {
      try {
        await handleSave({
          title: finalTitle,
          content: finalContent,
          tags: ['self-discovery', selectedSelfDiscovery.id],
          entryId: null,
          ignorePendingAudio: true,
          silent: false
        });
      } catch (error) {
        console.error('Failed to save self-discovery:', error);
      }
    };

    if (selectedSelfDiscovery.hasUniqueExperience) {
      switch (selectedSelfDiscovery.id) {
        case 'values-discovery':
          return <ValuesDiscovery onBack={() => setMode('discovery-menu')} onComplete={handleSelfDiscoveryComplete} />;
        case 'strengths-finder':
          return <StrengthsFinder onBack={() => setMode('discovery-menu')} onComplete={handleSelfDiscoveryComplete} />;
        case 'life-wheel-assessment':
          return <LifeWheelAssessment onBack={() => setMode('discovery-menu')} onComplete={handleSelfDiscoveryComplete} />;
        case 'personality-exploration':
          return <PersonalityExploration onBack={() => setMode('discovery-menu')} onComplete={handleSelfDiscoveryComplete} />;
        case 'core-beliefs-examination':
          return <CoreBeliefsExamination onBack={() => setMode('discovery-menu')} onComplete={handleSelfDiscoveryComplete} />;
        case 'life-timeline-mapping':
          return <LifeTimelineMapping onBack={() => setMode('discovery-menu')} onComplete={handleSelfDiscoveryComplete} />;
        case 'future-self':
          return <FutureSelfVisualization onBack={() => setMode('discovery-menu')} onComplete={handleSelfDiscoveryComplete} />;
        case 'limiting-beliefs-inventory':
          return <LimitingBeliefsInventory onBack={() => setMode('discovery-menu')} onComplete={handleSelfDiscoveryComplete} />;
        case 'purpose-exploration':
          return <PurposeExploration onBack={() => setMode('discovery-menu')} onComplete={handleSelfDiscoveryComplete} />;
        default:
          // Fallback to old interactive session
          return (
            <InteractiveSession
              mode="discovery"
              onClose={() => setMode('discovery-menu')}
              onComplete={handleSessionComplete}
            />
          );
      }
    }
  }

  // --- GOAL SETTING ---
  if (mode === 'goals-menu') {
    return (
      <div className="min-h-screen bg-dark-base p-6 pb-28 lg:pb-10 animate-fade-up">
        <div className="max-w-4xl mx-auto pt-10">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setMode('selection')} className="p-2 hover:bg-dark-hover rounded-full transition-colors">
              <ChevronLeft size={24} className="text-text-secondary" />
            </button>
            <div>
              <h2 className="font-serif text-3xl text-text-primary">Goal Setting</h2>
              <p className="text-text-tertiary">Choose a framework that fits your needs.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GOAL_FRAMEWORKS.map((gf, idx) => (
              <button
                key={gf.id}
                onClick={() => {
                  setSelectedGoalFramework(gf);
                  setMode('goals-session');
                }}
                className="glass-card p-6 rounded-3xl text-left hover:border-sage-border hover:shadow-glow transition-all group animate-fade-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${gf.color === 'lavender'
                  ? 'bg-lavender/20 text-lavender group-hover:bg-lavender group-hover:text-white'
                  : 'bg-sage-muted text-sage group-hover:bg-sage group-hover:text-white group-hover:shadow-glow'
                  }`}>
                  <gf.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-text-primary mb-2">{gf.title}</h3>
                <p className="text-sm text-text-tertiary font-light">{gf.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'goals-session' && selectedGoalFramework) {
    const handleGoalFrameworkComplete = async (finalTitle: string, finalContent: string) => {
      try {
        await handleSave({
          title: finalTitle,
          content: finalContent,
          tags: ['goal-setting', selectedGoalFramework.id],
          entryId: null,
          ignorePendingAudio: true,
          silent: false
        });
      } catch (error) {
        console.error('Failed to save goal framework:', error);
      }
    };

    if (selectedGoalFramework.hasUniqueExperience) {
      switch (selectedGoalFramework.id) {
        case 'smart-goals':
          return <SMARTGoals onBack={() => setMode('goals-menu')} onComplete={handleGoalFrameworkComplete} />;
        case 'okrs':
          return <OKRs onBack={() => setMode('goals-menu')} onComplete={handleGoalFrameworkComplete} />;
        case 'ninety-day-sprint':
          return <NinetyDaySprint onBack={() => setMode('goals-menu')} onComplete={handleGoalFrameworkComplete} />;
        case 'habit-stacking':
          return <HabitStacking onBack={() => setMode('goals-menu')} onComplete={handleGoalFrameworkComplete} />;
        case 'vision-board-builder':
          return <VisionBoardBuilder onBack={() => setMode('goals-menu')} onComplete={handleGoalFrameworkComplete} />;
        case 'milestone-mapper':
          return <MilestoneMapper onBack={() => setMode('goals-menu')} onComplete={handleGoalFrameworkComplete} />;
        case 'accountability-checkins':
          return <AccountabilityCheckins onBack={() => setMode('goals-menu')} onComplete={handleGoalFrameworkComplete} />;
        case 'goal-autopsy':
          return <GoalAutopsy onBack={() => setMode('goals-menu')} onComplete={handleGoalFrameworkComplete} />;
        case 'success-visualization':
          return <SuccessVisualization onBack={() => setMode('goals-menu')} onComplete={handleGoalFrameworkComplete} />;
        default:
          // Fallback to old interactive session
          return (
            <InteractiveSession
              mode="goals"
              onClose={() => setMode('goals-menu')}
              onComplete={handleSessionComplete}
            />
          );
      }
    }
  }

  // --- QUICK JOT ---
  if (mode === 'quick-menu') {
    return (
      <div className="min-h-screen bg-dark-base p-6 animate-fade-up">
        <div className="max-w-4xl mx-auto pt-10">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setMode('selection')} className="p-2 hover:bg-dark-hover rounded-full transition-colors">
              <ChevronLeft size={24} className="text-text-secondary" />
            </button>
            <div>
              <h2 className="font-serif text-3xl text-text-primary">Quick Jot</h2>
              <p className="text-text-tertiary">Capture fleeting thoughts, fast.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUICK_WRITES.map((qw, idx) => (
              <button
                key={qw.id}
                onClick={() => {
                  setSelectedQuickJot(qw);
                  setMode('quick-session');
                }}
                className="glass-card p-6 rounded-3xl text-left hover:border-sage-border hover:shadow-glow transition-all group animate-fade-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-sage-muted text-sage flex items-center justify-center mb-4 group-hover:bg-sage group-hover:text-white group-hover:shadow-glow transition-all">
                  <qw.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-text-primary mb-2">{qw.title}</h3>
                {qw.description ? (
                  <p className="text-sm text-text-tertiary font-light">{qw.description}</p>
                ) : (
                  <div className="space-y-1">
                    {qw.prompts.slice(0, 2).map((p, i) => (
                      <p key={i} className="text-sm text-text-tertiary font-light line-clamp-1">• {p}</p>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'quick-session' && selectedQuickJot) {
    // Common completion handler for all Quick Jots
    const handleQuickJotComplete = async (finalTitle: string, finalContent: string) => {
      try {
        await handleSave({
          title: finalTitle,
          content: finalContent,
          tags: ['quick-jot', selectedQuickJot.id],
          entryId: null,
          ignorePendingAudio: true,
          silent: false
        });
      } catch (error) {
        console.error('Failed to save quick jot:', error);
      }
    };

    // Render unique component based on Quick Jot ID
    if (selectedQuickJot.hasUniqueExperience) {
      switch (selectedQuickJot.id) {
        case 'brain-dump':
          return <BrainDump onBack={() => setMode('quick-menu')} onComplete={handleQuickJotComplete} />;
        case '3-good-things':
          return <ThreeGoodThings onBack={() => setMode('quick-menu')} onComplete={handleQuickJotComplete} />;
        case 'energy-check':
          return <EnergyCheck onBack={() => setMode('quick-menu')} onComplete={handleQuickJotComplete} />;
        case 'morning-pages':
          return <MorningPages onBack={() => setMode('quick-menu')} onComplete={handleQuickJotComplete} />;
        case 'evening-reset':
          return <EveningReset onBack={() => setMode('quick-menu')} onComplete={handleQuickJotComplete} />;
        case 'one-word':
          return <OneWord onBack={() => setMode('quick-menu')} onComplete={handleQuickJotComplete} />;
        case 'body-scan':
          return <BodyScan onBack={() => setMode('quick-menu')} onComplete={handleQuickJotComplete} />;
        case 'wins':
          return <Wins onBack={() => setMode('quick-menu')} onComplete={handleQuickJotComplete} />;
        case 'what-i-learned':
          return <WhatILearned onBack={() => setMode('quick-menu')} onComplete={handleQuickJotComplete} />;

      }
    }

    // Fallback to generic wizard for templates without unique experiences
    return (
      <QuickJotSession
        template={selectedQuickJot}
        onBack={() => setMode('quick-menu')}
        onComplete={handleQuickJotComplete}
      />
    );
  }

  // --- GUIDED REFLECTION (Sequential Wizard) ---
  if (mode === 'guided-menu') {
    return (
      <div className="min-h-screen bg-dark-base p-6 animate-fade-up">
        <div className="max-w-4xl mx-auto pt-10">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setMode('selection')}
              className="p-2 hover:bg-dark-hover rounded-full transition-colors"
            >
              <ChevronLeft size={24} className="text-text-secondary" />
            </button>
            <div>
              <h2 className="font-serif text-3xl text-text-primary">Guided Reflection</h2>
              <p className="text-text-tertiary">Deep dives into specific areas of your life.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GUIDED_REFLECTIONS.map((reflection, idx) => (
              <button
                key={reflection.id}
                onClick={() => {
                  setSelectedGuidedReflection(reflection);
                  setMode('guided-session');
                }}
                className="glass-card p-6 rounded-[24px] hover:border-sage-border hover:shadow-glow transition-all text-left group animate-fade-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-sage-muted text-sage flex items-center justify-center mb-4 transition-all group-hover:bg-sage group-hover:text-white group-hover:shadow-glow">
                  <reflection.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-medium text-text-primary text-lg mb-1">{reflection.title}</h3>
                <p className="text-sm text-text-tertiary font-light line-clamp-2">{reflection.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-sage uppercase tracking-wider">
                  <Sparkles size={10} /> {reflection.steps.length} Steps
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'guided-session' && selectedGuidedReflection) {
    // Common completion handler for all Guided Reflections
    const handleGuidedReflectionComplete = async (finalTitle: string, finalContent: string) => {
      try {
        await handleSave({
          title: finalTitle,
          content: finalContent,
          tags: ['guided-reflection', selectedGuidedReflection.id],
          entryId: null,
          ignorePendingAudio: true,
          silent: false,
          isReflection: true
        });
      } catch (error) {
        console.error('Failed to save guided reflection:', error);
      }
    };

    // Render unique component based on Guided Reflection ID
    if (selectedGuidedReflection.hasUniqueExperience) {
      switch (selectedGuidedReflection.id) {
        case 'decision-clarity':
          return <DecisionClarity onBack={() => setMode('guided-menu')} onComplete={handleGuidedReflectionComplete} />;
        case 'weekly-reset':
          return <WeeklyReset onBack={() => setMode('guided-menu')} onComplete={handleGuidedReflectionComplete} />;
        case 'gratitude-growth':
          return <GratitudeGrowth onBack={() => setMode('guided-menu')} onComplete={handleGuidedReflectionComplete} />;
        case 'values-alignment':
          return <ValuesAlignment onBack={() => setMode('guided-menu')} onComplete={handleGuidedReflectionComplete} />;
        case 'connection-appreciation':
          return <ConnectionAppreciation onBack={() => setMode('guided-menu')} onComplete={handleGuidedReflectionComplete} />;
        case 'creative-unblock':
          return <CreativeUnblock onBack={() => setMode('guided-menu')} onComplete={handleGuidedReflectionComplete} />;
        case 'daily-clarity':
          return <DailyClarity onBack={() => setMode('guided-menu')} onComplete={handleGuidedReflectionComplete} />;
        case 'fear-inventory':
          return <FearInventory onBack={() => setMode('guided-menu')} onComplete={handleGuidedReflectionComplete} />;
        case 'future-self-letter':
          return <FutureSelfLetter onBack={() => setMode('guided-menu')} onComplete={handleGuidedReflectionComplete} />;
        case 'whats-really-going-on':
          return <WhatsReallyGoingOn onBack={() => setMode('guided-menu')} onComplete={handleGuidedReflectionComplete} />;
      }
    }

    // Fallback to generic wizard for reflections without unique experiences
    return (
      <GuidedReflectionSession
        reflection={selectedGuidedReflection}
        onClose={() => setMode('guided-menu')}
        onComplete={handleGuidedReflectionComplete}
      />
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-[#faf9f7] to-[#f0efe9] overflow-hidden flex flex-col">

      {/* --- HEADER --- */}
      <header
        className={`relative z-20 flex items-center justify-between px-6 py-4 md:px-10 transition-all duration-700 ease-out ${(isTyping || isFocusMode) ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
      >
        <button
          onClick={() => {
            if (initialData?.returnTo) {
              onChangeView(initialData.returnTo, initialData.returnToData);
            } else {
              onChangeView(ViewState.HOME);
            }
          }}
          className="group flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center group-hover:border-sage-border transition-all">
            <ChevronLeft size={18} strokeWidth={1.5} />
          </div>
          <span className="hidden md:inline text-[0.8rem] font-medium">Back</span>
        </button>

        <div className="flex items-center gap-3 relative">
          <span className="text-[0.7rem] text-text-muted transition-opacity duration-300">
            {isSaving
              ? 'Saving…'
              : lastSavedAtMs
                ? `Saved · ${new Date(lastSavedAtMs).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
                : (wordCount > 0 ? `${wordCount} words` : 'Draft')}
          </span>

          {/* MENU TOGGLE */}
          <div ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${showMenu ? 'bg-sage text-white' : 'bg-dark-surface border border-dark-border text-text-muted hover:text-text-secondary hover:border-sage-border'}`}
            >
              <MoreVertical size={16} strokeWidth={1.5} />
            </button>

            {/* MENU DROPDOWN */}
            {showMenu && (
              <div className="absolute top-11 right-0 w-44 glass-card rounded-[14px] py-1.5 z-50 animate-scale-in origin-top-right">
                <button
                  onClick={() => {
                    setIsFocusMode((v) => !v);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-[0.8rem] text-text-secondary hover:bg-dark-hover hover:text-text-primary transition-colors flex items-center gap-2.5"
                >
                  <EyeOff size={14} strokeWidth={1.5} />
                  <span className="flex-1">{isFocusMode ? 'Exit Focus Mode' : 'Focus Mode'}</span>
                  <span className="text-[0.7rem] text-text-muted">{navigator.platform.toLowerCase().includes('mac') ? '⌘⇧F' : 'Ctrl⇧F'}</span>
                </button>
                <button className="w-full text-left px-3.5 py-2 text-[0.8rem] text-text-secondary hover:bg-dark-hover hover:text-text-primary transition-colors flex items-center gap-2.5">
                  <Share size={14} strokeWidth={1.5} /> Share Entry
                </button>
                <button className="w-full text-left px-3.5 py-2 text-[0.8rem] text-text-secondary hover:bg-dark-hover hover:text-text-primary transition-colors flex items-center gap-2.5">
                  <Download size={14} strokeWidth={1.5} /> Export PDF
                </button>
                <div className="h-px bg-dark-border my-1" />
                <button
                  onClick={async () => {
                    if (entryId && window.confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
                      try {
                        await JournalService.deleteEntry(entryId);
                        toast({ title: 'Entry deleted', description: 'Your entry has been removed.' });
                        onChangeView(ViewState.JOURNAL);
                      } catch (err) {
                        toast({ title: 'Failed to delete', description: 'Please try again.', variant: 'destructive' });
                      }
                    } else if (!entryId) {
                      onChangeView(ViewState.JOURNAL);
                    }
                  }}
                  className="w-full text-left px-3.5 py-2 text-[0.8rem] text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2.5"
                >
                  <Trash2 size={14} strokeWidth={1.5} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Focus mode escape hatch (always available) */}
      {isFocusMode && (
        <button
          type="button"
          onClick={() => setIsFocusMode(false)}
          className="fixed top-4 right-4 z-40 bg-white/80 backdrop-blur-md border border-stone-200 text-stone-600 hover:text-sage-700 hover:border-sage-200 shadow-sm rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all"
          title="Exit focus mode (Esc)"
        >
          Exit Focus <span className="opacity-60">Esc</span>
        </button>
      )}

      {/* --- MAIN CANVAS --- */}
      <main className="flex-1 relative z-10 overflow-y-auto px-6 md:px-10 scroll-smooth no-scrollbar">
        <div className="max-w-2xl mx-auto pt-10 pb-40 md:pt-16">

          {/* IMAGES: Clipped Stack (New Aesthetic) */}
          {images.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-4 animate-fade-up">
              {images.map((img, idx) => (
                <div key={idx} className="relative group max-w-[45%] md:max-w-[40%] aspect-[4/3] rounded-sm shadow-md rotate-1 hover:rotate-0 transition-all duration-500 bg-white p-1.5 border border-stone-200">
                  <div className="w-full h-full overflow-hidden relative">
                    <img src={img} alt="Attachment" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  {/* Tape Effect */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/40 backdrop-blur-sm border-l border-r border-white/60 shadow-sm rotate-1" />

                  <button
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 p-1 bg-white text-stone-400 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:text-red-400 z-10"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {promptInspiration && (
            <div className="mb-10 p-6 glass-card rounded-[2px] border-l-2 border-l-sage bg-[#faf9f7]/50 animate-fade-up relative group">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] font-bold text-sage uppercase tracking-[0.15em]">Daily Prompt</span>
                  <button
                    onClick={handleDismissPrompt}
                    className="text-sage-300 hover:text-sage-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Dismiss prompt"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="font-serif text-[1.1rem] text-sage-900 leading-relaxed italic">
                  "{promptInspiration}"
                </p>
              </div>
            </div>
          )}

          {/* Title - Book Style */}
          {isLoadingEntry ? (
            <div className="mb-8">
              <div className="h-12 md:h-16 w-[70%] rounded-2xl bg-sage-100/60 animate-pulse" />
            </div>
          ) : (
            <textarea
              ref={titleTextareaRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Entry"
              rows={1}
              className="w-full bg-transparent border-none p-0 text-[2.5rem] md:text-[3.25rem] font-serif font-medium text-sage-900 placeholder:text-sage-300/40 focus:ring-0 mb-8 leading-[1.1] tracking-tight resize-none overflow-hidden transition-all duration-300"
            />
          )}

          {/* Body - Stationery Style */}
          {isLoadingEntry ? (
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-sage-100/60 animate-pulse" />
              <div className="h-4 w-[92%] rounded bg-sage-100/60 animate-pulse" />
              <div className="h-4 w-[96%] rounded bg-sage-100/60 animate-pulse" />
              <div className="h-4 w-[84%] rounded bg-sage-100/60 animate-pulse" />
              <div className="h-4 w-[90%] rounded bg-sage-100/60 animate-pulse" />
              <div className="h-4 w-[78%] rounded bg-sage-100/60 animate-pulse" />
            </div>
          ) : (
            <textarea
              ref={contentTextareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setWordCount(e.target.value.trim().split(/\s+/).filter(w => w.length > 0).length);
              }}
              placeholder="Start writing..."
              className="w-full min-h-[280px] bg-transparent border-none p-0 text-[1.1rem] md:text-[1.2rem] font-serif leading-[1.8] text-sage-800 placeholder:text-sage-300/40 focus:ring-0 resize-none outline-none overflow-hidden transition-colors duration-300 selection:bg-sage-200/50"
            />
          )}

          {/* AI Reflection Section */}
          {content.length >= 50 && (
            <div className="mt-12 space-y-4 animate-fade-up border-t border-sage-100 pt-8">
              {/* AI Actions - Minimal */}
              <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                <button
                  onClick={handleGetReflection}
                  disabled={isLoadingReflection}
                  className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-wider text-sage-500 hover:text-sage-700 transition-colors disabled:opacity-50"
                >
                  {isLoadingReflection ? <Loader2 size={12} className="animate-spin" /> : <Lightbulb size={12} strokeWidth={2} />}
                  Reflect
                </button>
                <div className="w-px h-3 bg-sage-200" />
                <button
                  onClick={handleGetInsight}
                  disabled={isLoadingInsight}
                  className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-wider text-sage-500 hover:text-sage-700 transition-colors disabled:opacity-50"
                >
                  {isLoadingInsight ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} strokeWidth={2} />}
                  Insight
                </button>
              </div>

              {/* AI Reflection Prompt */}
              {aiReflection && (
                <div className="p-5 bg-white/50 border border-sage-100 rounded-sm animate-fade-up relative group">
                  <div className="flex items-start gap-4">
                    <Lightbulb size={16} className="text-sage mt-1" />
                    <div className="flex-1">
                      <p className="font-serif text-[1rem] text-sage-900 leading-relaxed italic">
                        {aiReflection}
                      </p>
                    </div>
                    <button
                      onClick={() => setAiReflection(null)}
                      className="text-sage-300 hover:text-sage-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* AI Insight */}
              {aiInsight && (
                <div className="p-5 bg-white/50 border border-sage-100 rounded-sm animate-fade-up relative group">
                  <div className="flex items-start gap-4">
                    <Sparkles size={16} className="text-sage mt-1" />
                    <div className="flex-1">
                      <p className="font-serif text-[1rem] text-sage-900 leading-relaxed italic">
                        {aiInsight}
                      </p>
                    </div>
                    <button
                      onClick={() => setAiInsight(null)}
                      className="text-sage-300 hover:text-sage-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* --- CONTROL DOCK (Stationery Style) --- */}
      <footer
        className={`fixed bottom-0 left-0 right-0 z-30 transition-all duration-700 ${(isTyping || isFocusMode) ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'}`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* DRAWER: Sliding Panel for Metadata */}
        <div
          className={`bg-[#faf9f7]/85 backdrop-blur-2xl border-t border-sage-100/40 overflow-hidden shadow-[0_-16px_50px_-20px_rgba(107,143,122,0.08)] ${showDrawer ? 'max-h-[60vh] py-6 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
          style={{ transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease, opacity 0.25s ease' }}
        >
          <div className="max-w-2xl mx-auto px-8">
            {/* Drawer Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-lg text-sage-900 italic flex items-center gap-2">
                {activeTab === 'thread' && "Connect to a Thread"}
                {activeTab === 'category' && "File under Category"}
                {activeTab === 'tags' && "Add Tags"}
              </h3>
              <button onClick={() => setShowDrawer(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="min-h-[150px] overflow-y-auto no-scrollbar pb-2">
              {/* Drawer Content (Existing Logic) */}
              {/* 1. THREADS TAB */}
              {activeTab === 'thread' && (
                <div className="space-y-4">
                  {!isCreatingThread ? (
                    <>
                      {isLoadingThreads ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 text-sage animate-spin" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {threads.map(thread => (
                            <button
                              key={thread.id}
                              onClick={() => { setSelectedThread(selectedThread === thread.id ? null : thread.id); setShowDrawer(false); }}
                              className={`
                                        p-4 rounded-xl text-left border transition-all flex items-center justify-between group
                                        ${selectedThread === thread.id ? 'bg-sage text-white border-sage shadow-md' : 'bg-white/70 border-stone-200/70 text-stone-700 hover:border-sage-200 hover:bg-white/85'}
                                        `}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-2.5 h-2.5 rounded-full ring-2 ${selectedThread === thread.id ? 'ring-white/80' : 'ring-sage-100'}`}
                                  style={{ backgroundColor: thread.color || '#6B8F7A' }}
                                />
                                <span className="font-serif">{thread.name}</span>
                              </div>
                              {selectedThread === thread.id && <Check size={16} />}
                            </button>
                          ))}
                          <button
                            onClick={() => setIsCreatingThread(true)}
                            className="p-4 rounded-xl text-left border border-dashed border-sage-200 text-sage-600 hover:text-sage-700 hover:border-sage-300 hover:bg-sage-50/70 transition-all flex items-center gap-2"
                          >
                            <Plus size={16} /> Create New Thread
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 animate-fade-in">
                      {/* Input logic remains same, just styling tweaks if needed */}
                      <input
                        autoFocus
                        type="text"
                        value={newThreadInput}
                        onChange={(e) => setNewThreadInput(e.target.value)}
                        placeholder="Thread name..."
                        className="w-full sm:flex-1 bg-white/70 border border-stone-200/70 rounded-lg px-4 py-3 text-sm font-serif text-sage-900 placeholder:text-stone-400 focus:ring-1 focus:ring-sage focus:border-sage outline-none"
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter' && newThreadInput.trim()) {
                            try {
                              const newThread = await ThreadService.createThread(newThreadInput.trim());
                              setThreads([...threads, newThread]);
                              setSelectedThread(newThread.id);
                              setNewThreadInput('');
                              setIsCreatingThread(false);
                              setShowDrawer(false);
                              toast({ title: 'Thread created' });
                            } catch (err) { console.error(err); }
                          }
                        }}
                      />
                      <button onClick={() => { setIsCreatingThread(false); setNewThreadInput(''); }} className="px-4 py-3 text-stone-500 hover:text-stone-800 font-serif italic">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 2. CATEGORIES TAB */}
              {activeTab === 'category' && (
                <div className="space-y-4">
                  {!isCreatingCategory ? (
                    <div className="flex flex-wrap gap-2">
                      {categories.map(c => (
                        <button
                          key={c}
                          onClick={() => { setSelectedCategory(selectedCategory === c ? null : c); setShowDrawer(false); }}
                          className={`
                            px-4 py-2 rounded-md text-sm font-serif transition-all border
                            ${selectedCategory === c ? 'bg-sage text-white border-sage shadow-sm' : 'bg-white/70 text-stone-700 border-stone-200/70 hover:border-sage-200 hover:text-sage-700 hover:bg-white/85'}
                          `}
                        >
                          {c}
                        </button>
                      ))}
                      <button
                        onClick={() => setIsCreatingCategory(true)}
                        className="px-4 py-2 rounded-md text-sm font-serif border border-dashed border-sage-200 text-sage-600 hover:text-sage-700 hover:border-sage-300 hover:bg-sage-50/70 transition-all flex items-center gap-1"
                      >
                        <Plus size={14} /> New
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 animate-fade-in">
                      <input
                        autoFocus
                        type="text"
                        value={newCategoryInput}
                        onChange={(e) => setNewCategoryInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
                        className="flex-1 bg-white/70 border border-stone-200/70 rounded-lg px-4 py-2 text-sm font-serif outline-none focus:border-sage"
                        placeholder="Category name..."
                      />
                      <button onClick={handleCreateCategory} className="px-4 py-2 bg-sage text-white rounded-lg text-sm font-serif">Add</button>
                      <button onClick={() => setIsCreatingCategory(false)} className="px-4 py-2 text-stone-500 text-sm font-serif italic">Cancel</button>
                    </div>
                  )}
                </div>
              )}

              {/* 3. TAGS TAB */}
              {activeTab === 'tags' && (
                <div>
                  <input
                    type="text"
                    autoFocus
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Type tag and hit Enter..."
                    className="w-full bg-transparent border-b border-stone-200/80 px-0 py-3 text-lg font-serif text-sage-900 placeholder:text-stone-300 focus:border-sage outline-none mb-6"
                  />
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/70 text-sage-700 rounded-full text-xs font-medium tracking-wide border border-stone-200/70 flex items-center gap-2">
                        <span className="capitalize">{tag.replace(/[-_]/g, ' ')}</span>
                        <button onClick={() => handleRemoveTag(tag)} className="text-stone-400 hover:text-red-500 transition-colors">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DOCK BAR (Minimal) */}
        <div className="bg-[#faf9f7]/80 backdrop-blur-2xl border-t border-sage-100/40 pb-5 pt-3 px-6 md:pb-6">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">

            {/* Left: Metadata Pills */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              {/* Tools */}
              <button
                onClick={handleAddImage}
                className="w-8 h-8 flex items-center justify-center rounded-full text-sage-400 hover:bg-sage-50 hover:text-sage-600 transition-all"
                title="Add Image"
              >
                <ImageIcon size={18} strokeWidth={1.5} />
              </button>
              <div className="w-px h-4 bg-stone-300 mx-1" />

              {/* Pills */}
              <button
                onClick={() => toggleDrawer('thread')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${selectedThread || (showDrawer && activeTab === 'thread') ? 'text-sage-700' : 'text-sage-400 hover:text-sage-600'}`}
              >
                <GitBranch size={14} />
                <span className="hidden sm:inline">{selectedThread ? (threads.find(t => t.id === selectedThread)?.name || "Thread") : "Thread"}</span>
              </button>

              <button
                onClick={() => toggleDrawer('category')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${selectedCategory || (showDrawer && activeTab === 'category') ? 'text-sage-700' : 'text-sage-400 hover:text-sage-600'}`}
              >
                <Folder size={14} />
                <span className="hidden sm:inline">{selectedCategory || "Category"}</span>
              </button>

              <button
                onClick={() => toggleDrawer('tags')}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${tags.length > 0 || (showDrawer && activeTab === 'tags') ? 'text-sage-600' : 'text-sage-400 hover:text-sage-600'}`}
              >
                <Hash size={14} />
                <span className="hidden sm:inline">
                  {tags.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="bg-sage-100 text-sage-700 px-1.5 py-0.5 rounded-md text-[0.6rem]">{tags.length}</span>
                      Tags
                    </span>
                  ) : "Tags"}
                </span>
              </button>
            </div>

            {/* Right: Save Status */}
            <button
              onClick={() => {
                const hasSomethingToSave = content.trim().length > 0 || !!pendingAudioBlob || !!audioUrl;
                if (!hasSomethingToSave) {
                  if (initialData?.returnTo) {
                    onChangeView(initialData.returnTo, initialData.returnToData);
                  } else {
                    onChangeView(ViewState.HOME);
                  }
                  return;
                }
                handleSave();
              }}
              disabled={isSaving}
              className="flex items-center gap-2 text-sage-900 font-serif italic text-sm hover:opacity-70 transition-opacity disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
              <span>{isSaving ? 'Saving...' : 'Done'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* --- IMAGE SELECTION DIALOG --- */}
      {showImageDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="glass-card-elevated rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl text-text-primary">Add Image</h3>
              <button
                onClick={() => setShowImageDialog(false)}
                className="p-2 rounded-full hover:bg-dark-hover transition-colors"
              >
                <X size={20} className="text-text-secondary" />
              </button>
            </div>

            <p className="text-text-tertiary text-sm mb-6">Choose an image to add to your entry.</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {DEMO_IMAGES.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectImage(img)}
                  className="relative h-32 rounded-xl overflow-hidden group hover:ring-2 hover:ring-sage hover:ring-offset-2 hover:ring-offset-dark-base transition-all"
                >
                  <img src={img} alt={`Option ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Plus size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-dark-border pt-6">
              <button
                className="w-full py-4 border-2 border-dashed border-dark-border rounded-xl text-text-secondary hover:border-sage-border hover:text-sage hover:bg-sage-subtle transition-all flex items-center justify-center gap-2"
              >
                <ImageIcon size={20} />
                <span className="font-medium">Upload from device</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- INTERACTIVE AI SESSION COMPONENT ---

const InteractiveSession = ({ mode, onClose, onComplete }: { mode: 'goals' | 'discovery', onClose: () => void, onComplete: (title: string, content: string) => void }) => {
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<{ role: 'ai' | 'user', text: string }[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  // Scripts
  const goalScript = [
    "What is one specific area you want to focus on this month?",
    "Why is this important to you right now?",
    "What is one concrete action you can take this week to move forward?",
    "How will you know you've succeeded?"
  ];

  const discoveryScript = [
    "What's been weighing on your mind lately?",
    "If you could change one thing about how you handled that, what would it be?",
    "What does this tell you about your values?",
    "How can you honor that value more tomorrow?"
  ];

  const script = mode === 'goals' ? goalScript : discoveryScript;
  const title = mode === 'goals' ? "Goal Setting" : "Self Discovery";

  useEffect(() => {
    // Initial Message
    if (step === 0 && history.length === 0) {
      setIsThinking(true);
      setTimeout(() => {
        setHistory([{ role: 'ai', text: script[0] }]);
        setIsThinking(false);
      }, 800);
    }
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    const newHistory = [...history, { role: 'user', text: userMsg } as const];
    setHistory(newHistory);
    setInputValue('');
    setStep(s => s + 1);
    setIsThinking(true);

    setTimeout(() => {
      if (step + 1 < script.length) {
        // Next Question
        setHistory([...newHistory, { role: 'ai', text: script[step + 1] }]);
        setIsThinking(false);
      } else {
        // End of script - Generate Summary
        finishSession(newHistory);
      }
    }, 1200);
  };

  const finishSession = (finalHistory: typeof history) => {
    const answers = finalHistory.filter(h => h.role === 'user').map(h => h.text);
    let summary = "";
    let generatedTitle = "";

    // --- STRUCTURED OUTPUT GENERATION ---
    // This simulates the AI taking the structured session and turning it into a beautiful markdown note.

    if (mode === 'goals') {
      generatedTitle = `Goal: ${answers[0]}`;
      summary = `
# Goal Plan: ${answers[0]}

**Why this matters:**
${answers[1]}

**Action Steps:**
- [ ] ${answers[2]}

**Success Metrics:**
> "${answers[3]}"

---
*Generated from Goal Setting Session*
             `;
    } else {
      generatedTitle = `Insight: ${answers[0]}`;
      summary = `
# Personal Insight

**Topic:** ${answers[0]}

**Reflection:**
I realized that I could have handled it differently by ${answers[1]}. This shows that I value **${answers[2]}**.

**Intention for Tomorrow:**
I will honor this value by: ${answers[3]}.

---
*Generated from Self Discovery Session*
             `;
    }

    onComplete(generatedTitle, summary);
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark-base flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between border-b border-dark-border">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-dark-hover transition-colors">
          <X size={20} className="text-text-secondary" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-sage uppercase tracking-widest">{title}</span>
          <span className="text-xs text-text-muted">Guided Session</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
            <div
              className={`
                                max-w-[85%] p-5 rounded-2xl text-lg leading-relaxed
                                ${msg.role === 'user'
                  ? 'bg-dark-surface text-text-primary border border-dark-border rounded-tr-sm'
                  : 'glass-card-glow text-text-primary rounded-tl-sm font-serif'}
                            `}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-dark-surface border border-dark-border p-4 rounded-2xl rounded-tl-sm flex gap-2 items-center">
              <span className="w-2 h-2 bg-sage rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-sage rounded-full animate-bounce delay-100" />
              <span className="w-2 h-2 bg-sage rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-dark/80 backdrop-blur-xl border-t border-dark-border">
        <div className="max-w-2xl mx-auto relative">
          <input
            autoFocus
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your answer..."
            className="w-full bg-dark-surface border border-dark-border rounded-full py-4 pl-6 pr-14 text-lg text-text-primary focus:ring-2 focus:ring-sage/30 focus:border-sage-border transition-all placeholder:text-text-muted"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="absolute right-2 top-2 p-2.5 bg-sage text-white rounded-full hover:shadow-glow disabled:opacity-50 transition-all shadow-glow"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- QUICK JOT SESSION COMPONENT (Cleaner Stepper / Single View) ---
const QuickJotSession = ({ template, onBack, onComplete }: { template: QuickWrite, onBack: () => void, onComplete: (title: string, content: string) => void | Promise<void> }) => {
  const isSinglePrompt = template.prompts.length === 1;
  const [answers, setAnswers] = useState<string[]>(new Array(template.prompts.length).fill(''));
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;

    const hasContent = answers.some(a => a.trim().length > 0);
    if (!hasContent) return;

    setIsSaving(true);
    try {
      const date = new Date().toLocaleDateString();
      const fullContent = answers.map((ans, i) => `**${template.prompts[i]}**\n${ans || '(skipped)'}`).join('\n\n');
      await onComplete(`${template.title} - ${date}`, fullContent);
    } catch (error) {
      console.error('Failed to save quick jot:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (step < template.prompts.length - 1) {
      setStep(step + 1);
    } else {
      handleSave();
    }
  };

  // SINGLE PROMPT VIEW (rare; kept for parity)
  if (isSinglePrompt) {
    return (
      <div className="fixed inset-0 z-50 bg-dark-base flex flex-col animate-fade-in">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-dark-border">
          <button onClick={onBack} className="p-2 hover:bg-dark-hover rounded-full transition-colors text-text-secondary">
            <X size={24} />
          </button>
          <div className="flex items-center gap-2 text-sage font-medium">
            <template.icon size={18} />
            <span className="uppercase tracking-widest text-xs font-bold">{template.title}</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="text-text-primary font-medium hover:text-sage transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="flex-1 max-w-3xl mx-auto w-full px-6 pb-20 pt-8 flex flex-col">
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-8">{template.prompts[0]}</h2>
          <textarea
            autoFocus
            value={answers[0]}
            onChange={(e) => setAnswers([e.target.value])}
            className="flex-1 w-full bg-transparent border-none p-0 text-xl font-serif text-text-primary placeholder:text-text-muted focus:ring-0 resize-none leading-relaxed"
            placeholder="Just start writing..."
          />
        </div>
      </div>
    );
  }

  // MULTI-STEP WIZARD VIEW
  const progress = ((step + 1) / template.prompts.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-dark-base flex flex-col animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-dark-surface">
        <div className="h-full bg-sage shadow-glow transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <div className="px-6 py-6 flex justify-between items-center border-b border-dark-border">
        <button onClick={onBack} className="p-2 hover:bg-dark-hover rounded-full transition-colors">
          <X size={24} className="text-text-secondary" />
        </button>
        <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
          {template.title} {step + 1}/{template.prompts.length}
        </span>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <div className="w-full animate-fade-up">
          <h2 className="font-serif text-3xl md:text-4xl text-text-primary text-center leading-tight mb-12">
            {template.prompts[step]}
          </h2>

          <div className="relative">
            <textarea
              autoFocus
              key={step} // Force re-render/focus on step change
              value={answers[step]}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[step] = e.target.value;
                setAnswers(newAnswers);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleNext();
                }
              }}
              className="w-full bg-transparent border-b-2 border-dark-border p-4 text-xl md:text-2xl text-center text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage transition-colors resize-none min-h-[150px]"
              placeholder="Type your answer..."
            />
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-6 pb-12 flex justify-center">
        <button
          onClick={handleNext}
          disabled={!answers[step].trim() || isSaving}
          className="group flex items-center gap-3 px-8 py-4 bg-sage text-white rounded-full text-lg font-medium shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSaving ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {step === template.prompts.length - 1 ? 'Save Entry' : 'Next'}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// --- GUIDED REFLECTION SESSION (Sequential Wizard - Replaces Chat) ---
const GuidedReflectionSession = ({ reflection, onClose, onComplete }: { reflection: GuidedReflection, onClose: () => void, onComplete: (title: string, content: string) => void | Promise<void> }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(new Array(reflection.steps.length).fill(''));
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // If step > length, show summary screen
  const isSummaryStep = step === reflection.steps.length;

  const handleNext = () => {
    setIsConnecting(true);
    // Simulate "Thinking/Connecting" pause
    setTimeout(() => {
      setIsConnecting(false);
      if (step < reflection.steps.length) {
        setStep(step + 1);
      }
    }, 800);
  };

  const handleFinish = async () => {
    if (isSaving) return;

    // Require at least some content before attempting save
    const hasContent = answers.some(a => a.trim().length > 0);
    if (!hasContent) return;

    setIsSaving(true);
    try {
      const date = new Date().toLocaleDateString();
      let fullContent = `## ${reflection.title} Reflection\n\n`;
      reflection.steps.forEach((q, i) => {
        fullContent += `**${q}**\n${answers[i] || '(skipped)'}\n\n`;
      });
      await onComplete(`${reflection.title} - ${date}`, fullContent);
      // Explicitly close after successful save in case navigation is blocked
      onClose();
    } catch (error) {
      console.error('Failed to save reflection:', error);
    } finally {
      // Always reset saving state in case component is still mounted
      setIsSaving(false);
    }
  };

  if (isSummaryStep) {
    return (
      <div className="fixed inset-0 z-50 bg-dark-base flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-sage-muted text-sage rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in shadow-glow">
            <Check size={40} />
          </div>
          <h2 className="font-serif text-4xl text-text-primary mb-4">Clarity Found</h2>
          <p className="text-text-secondary mb-12 text-lg">
            You've unpacked your thoughts on {reflection.title}. Ready to save this reflection?
          </p>
          <button
            onClick={handleFinish}
            disabled={isSaving}
            className="w-full py-4 bg-sage text-white rounded-full text-lg font-medium shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save Reflection'
            )}
          </button>
          <button
            onClick={onClose}
            className="mt-6 text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            Discard
          </button>
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / reflection.steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-dark-base flex flex-col animate-fade-in">
      {/* Sage Progress Bar */}
      <div className="w-full h-1 bg-dark-surface">
        <div className="h-full bg-sage shadow-glow transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <div className="px-6 py-6 flex justify-between items-center border-b border-dark-border">
        <button onClick={onClose} className="p-2 hover:bg-dark-hover rounded-full transition-colors text-text-secondary">
          <X size={24} />
        </button>
        <div className="flex items-center gap-2 text-sage font-medium">
          <reflection.icon size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">{reflection.title}</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full relative">

        {/* Transition State */}
        {isConnecting ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-base z-10 animate-fade-in">
            <div className="flex gap-2 mb-4">
              <span className="w-3 h-3 bg-sage rounded-full animate-bounce" />
              <span className="w-3 h-3 bg-sage rounded-full animate-bounce delay-100" />
              <span className="w-3 h-3 bg-sage rounded-full animate-bounce delay-200" />
            </div>
            <p className="text-sage font-serif italic text-lg">Connecting...</p>
          </div>
        ) : (
          <div className="w-full animate-fade-up">
            <h2 className="font-serif text-3xl md:text-5xl text-text-primary text-center leading-tight mb-16 px-4">
              {reflection.steps[step]}
            </h2>

            <div className="relative max-w-2xl mx-auto">
              <textarea
                autoFocus
                key={step} // Reset state on step change
                value={answers[step]}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[step] = e.target.value;
                  setAnswers(newAnswers);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleNext();
                  }
                }}
                className="w-full bg-transparent border-b-2 border-dark-border p-4 text-xl md:text-2xl text-center text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage transition-colors resize-none min-h-[150px]"
                placeholder="Type here..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 pb-12 flex justify-center">
        {!isConnecting && (
          <button
            onClick={handleNext}
            disabled={!answers[step]?.trim()}
            className="group flex items-center gap-3 px-8 py-4 bg-sage text-white rounded-full text-lg font-medium shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {step === reflection.steps.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const ModeSelection = ({ onSelect, onClose }: any) => (
  <div className="min-h-screen bg-dark-base flex flex-col items-center justify-center p-6 relative animate-fade-up">
    <button onClick={onClose} className="absolute top-6 left-6 p-2.5 rounded-full bg-white border border-sage-100 text-sage-400 hover:text-sage-600 hover:border-sage-300 transition-all">
      <X size={20} />
    </button>

    <div className="text-center mb-10 max-w-md pt-10 md:pt-0">
      <h2 className="font-serif text-[2rem] md:text-[2.5rem] text-sage-900 mb-2">How would you like to begin?</h2>
      <p className="text-sage-600 text-[0.9rem] font-light">Choose the space that matches your mind right now.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl px-4 overflow-y-auto max-h-[65vh] pb-8 place-items-center md:place-items-stretch">
      <SelectionCard
        icon={Feather}
        title="Free Flow"
        desc="Just write."
        onClick={() => onSelect('free')}
        delay="0ms"
      />
      <SelectionCard
        icon={Zap}
        title="Quick Jot"
        desc="Use a template for fast capture."
        onClick={() => onSelect('quick-menu')}
      />
      <SelectionCard
        icon={Sparkles}
        title="Guided Reflection"
        desc="Deep dives into specific topics."
        onClick={() => onSelect('guided-menu')}
        delay="200ms"
      />
      <SelectionCard
        icon={Target}
        title="Goal Setting"
        desc="Plan with guided prompts."
        onClick={() => onSelect('goals')}
        delay="250ms"
      />
      <SelectionCard
        icon={Compass}
        title="Self Discovery"
        desc="Uncover insights with guided prompts."
        onClick={() => onSelect('discovery')}
        delay="300ms"
      />
    </div>
  </div>
);

const SelectionCard = ({ icon: Icon, title, desc, onClick, delay }: any) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center md:items-start gap-4 p-6 glass-card rounded-[1.75rem] transition-all text-center md:text-left animate-fade-up h-full w-full max-w-xs md:max-w-none"
    style={{ animationDelay: delay }}
  >
    {/* Icon container (Meadow 23 style - sage background) */}
    <div className="w-12 h-12 rounded-xl bg-sage-50 text-sage-500 flex items-center justify-center group-hover:bg-sage-100 transition-colors shrink-0">
      <Icon size={22} strokeWidth={1.5} />
    </div>
    <div>
      <h3 className="font-serif text-lg text-sage-900 mb-1 group-hover:text-sage-700 transition-colors">{title}</h3>
      <p className="text-sm text-sage-600 font-light leading-relaxed">{desc}</p>
    </div>
  </button>
);

const DockPill = ({ icon: Icon, label, isActive, onClick }: any) => (
  <button
    onClick={onClick}
    className={`h-8 px-3 rounded-full flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${isActive ? 'bg-sage-500 text-white border-sage-500 shadow-md' : 'bg-white text-sage-400 border-sage-100 hover:border-sage-300 hover:text-sage-600'}`}
  >
    <Icon size={12} strokeWidth={2} />
    {label}
  </button>
);

const IconButton = ({ icon: Icon, onClick, active, tooltip }: any) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shrink-0 ${active ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-white border-sage-100 text-sage-400 hover:text-sage-600 hover:border-sage-300'}`}
  >
    <Icon size={15} strokeWidth={1.5} />
  </button>
)

export default Editor;
