import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon, List, Mic, Smile, Calendar, Cloud, Sun, CloudRain, Meh, Search,
  Plus, Sparkles, X, Loader2, BookOpen, GitBranch, Play, ChevronLeft, ChevronRight, ImageIcon, Camera, FileText, AlignLeft,
  ArrowUpRight, Copy, RefreshCw
} from 'lucide-react';
import { EmptyState, JournalEmptyState, SearchEmptyState } from '../components/ui/EmptyState';
import { Note, ViewState } from '../types';
import { JournalService } from '../services/journal';
import { ThreadService, type ThreadWithPreview } from '../services/threads';
import { MoodService, type MoodLog } from '../services/mood';
import { AIService } from '../services/ai';
import { toast } from 'sonner';

interface JournalProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

const Journal: React.FC<JournalProps> = ({ onChangeView }) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'list'>('timeline');
  const [activeFilter, setActiveFilter] = useState<'all' | 'threads' | 'reflections'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moodByDate, setMoodByDate] = useState<Record<string, string>>({});

  const fetchEntries = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [data, moodLogs] = await Promise.all([
        JournalService.getEntries(),
        MoodService.getMoodLogsLastNDays(31)
      ]);
      setEntries(data);

      // Build date -> mood map from mood logs
      const moodMap: Record<string, string> = {};
      moodLogs.forEach((log: MoodLog) => {
        const dateKey = new Date(log.logged_at).toLocaleDateString();
        moodMap[dateKey] = log.mood;
      });
      setMoodByDate(moodMap);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Listen for journal refresh events (e.g., after saving a guided reflection)
  useEffect(() => {
    const handler = () => fetchEntries();
    window.addEventListener('journal:refresh', handler);
    return () => window.removeEventListener('journal:refresh', handler);
  }, [fetchEntries]);

  const hasEntries = entries.length > 0;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const filteredEntries = useMemo(() => {
    if (!isSearching) return entries;
    return entries.filter((e) => {
      const haystack = [
        e.title,
        e.preview,
        e.content,
        e.category,
        ...(e.tags ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [entries, isSearching, normalizedQuery]);

  const filteredReflectionsCount = useMemo(() => {
    const reflections = filteredEntries.filter((e) => {
      const tags = e.tags ?? [];
      return e.isReflection || tags.includes('guided-reflection') || tags.includes('reflection');
    });
    return reflections.length;
  }, [filteredEntries]);

  useEffect(() => {
    if (isSearching && activeFilter === 'all' && viewMode === 'calendar') {
      setViewMode('list');
    }
  }, [activeFilter, isSearching, viewMode]);

  // Allow Layout's header search to drive Journal search.
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent)?.detail as { query?: unknown } | undefined;
      const q = typeof detail?.query === 'string' ? detail.query : '';
      setSearchQuery(q);
      if (q.trim().length > 0) {
        setActiveFilter('all');
        setViewMode('list');
      }
    };

    window.addEventListener('meadow:journal-search', handler as EventListener);
    return () => window.removeEventListener('meadow:journal-search', handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8 animate-fade-up relative pb-28 md:pb-20">

      {/* --- HEADER SECTION (Compact) --- */}
      <div className="flex flex-col gap-4 pt-2">

        {/* Top Row: Title & View Toggles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-center md:text-left">
          <div className="md:hidden">
            <h2 className="font-serif text-3xl text-sage-900 mb-0.5">Journal</h2>
            <p className="text-sage-600 text-xs font-light">Your growing timeline.</p>
          </div>

          {/* View Mode Toggle (Compact) */}
          <div className={`transition-opacity duration-300 md:ml-auto ${activeFilter === 'all' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-full border border-sage-100 shadow-sm mx-auto md:mx-0">
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider transition-all ${viewMode === 'timeline' ? 'bg-sage-500 text-white shadow-sm' : 'text-sage-400 hover:text-sage-600'}`}
              >
                <List size={12} /> Stream
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider transition-all ${viewMode === 'calendar' ? 'bg-sage-500 text-white shadow-sm' : 'text-sage-400 hover:text-sage-600'}`}
              >
                <CalendarIcon size={12} /> Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider transition-all ${viewMode === 'list' ? 'bg-sage-500 text-white shadow-sm' : 'text-sage-400 hover:text-sage-600'}`}
              >
                <AlignLeft size={12} /> List
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs (Compact) */}
        <div className="w-full overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 flex justify-center md:justify-start">
          <div className="flex items-center gap-6 min-w-max border-b border-sage-200/60 pb-1">
            <FilterTab
              label="All Entries"
              isActive={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            />
            <FilterTab
              label="Threads"
              isActive={activeFilter === 'threads'}
              onClick={() => setActiveFilter('threads')}
            />
            <FilterTab
              label="Reflections"
              isActive={activeFilter === 'reflections'}
              onClick={() => setActiveFilter('reflections')}
            />
          </div>
        </div>

        {/* Mobile Search (Layout search covers desktop) */}
        <div className="md:hidden -mx-6 px-6">
          <div className="relative flex items-center gap-2 bg-white/80 backdrop-blur-md border border-sage-100 rounded-full px-4 py-3 shadow-sm">
            <Search size={16} className="text-sage-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries…"
              className="flex-1 bg-transparent outline-none text-sm text-sage-900 placeholder:text-sage-400"
            />
            {searchQuery.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="w-7 h-7 rounded-full flex items-center justify-center text-sage-400 hover:text-sage-600 hover:bg-sage-50 transition-all"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="min-h-[50vh] animate-in fade-in slide-in-from-bottom-4 duration-500">

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-sage animate-spin" />
          </div>
        ) : !hasEntries ? (
          <JournalEmptyState onStartWriting={() => onChangeView(ViewState.EDITOR, { returnTo: ViewState.JOURNAL })} />
        ) : (
          <>
            {/* ALL ENTRIES (Timeline, Calendar, or List) */}
            {activeFilter === 'all' && (
              isSearching && filteredEntries.length === 0 ? (
                <SearchEmptyState query={searchQuery.trim()} />
              ) : (
                <>
                  {viewMode === 'timeline' && <StreamView onChangeView={onChangeView} entries={filteredEntries} />}
                  {viewMode === 'calendar' && <CalendarView onChangeView={onChangeView} entries={filteredEntries} moodByDate={moodByDate} />}
                  {viewMode === 'list' && <ListView onChangeView={onChangeView} entries={filteredEntries} />}
                </>
              )
            )}

            {/* THREADS VIEW */}
            {activeFilter === 'threads' && <ThreadsView onChangeView={onChangeView} query={searchQuery} />}

            {/* REFLECTIONS VIEW */}
            {activeFilter === 'reflections' && (
              isSearching && filteredReflectionsCount === 0 ? (
                <SearchEmptyState query={searchQuery.trim()} />
              ) : (
                <ReflectionsView onChangeView={onChangeView} entries={filteredEntries} />
              )
            )}
          </>
        )}

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const FilterTab = ({ label, isActive, onClick }: any) => (
  <button
    onClick={onClick}
    className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${isActive ? 'border-sage-500 text-sage-900' : 'border-transparent text-sage-400 hover:text-sage-600'}`}
  >
    {label}
  </button>
);

// 1. NOTES LIST VIEW (Unified Colors)
const ListView = ({ onChangeView, entries }: { onChangeView: (view: ViewState, data?: any) => void; entries: Note[] }) => {
  const notes = entries.map(entry => ({
    id: entry.id,
    title: entry.title,
    preview: entry.preview,
    date: entry.date,
    type: entry.type || 'text',
    category: entry.category || 'Journal'
  }));

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        No entries yet. Start writing!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-w-3xl mx-auto">
      {notes.map((note, index) => (
        <div
          key={note.id}
          onClick={() => onChangeView(ViewState.EDITOR, { entryId: note.id, returnTo: ViewState.JOURNAL })}
          className="group glass-card p-4 rounded-[18px] hover:border-sage-border hover:shadow-card-hover transition-colors cursor-pointer flex flex-col md:flex-row md:items-center gap-3 md:gap-5 relative overflow-hidden text-left"
        >
          <div className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 transition-colors bg-white/90 border border-sage-100 text-sage-400 group-hover:text-sage-600 group-hover:border-sage-200">
            <FileText size={16} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-[1rem] text-text-primary truncate group-hover:text-sage transition-colors">{note.title}</h4>
            <p className="text-[0.8rem] text-text-secondary truncate font-light mt-0.5">{note.preview}</p>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-3 min-w-[120px] border-t md:border-t-0 border-dark-border pt-2 md:pt-0">
            <span className="px-2 py-0.5 rounded-md bg-sage-subtle border border-sage-200/60 text-[0.6rem] font-bold text-sage-700 uppercase tracking-[0.08em]">
              {note.category}
            </span>
            <span className="text-[0.7rem] text-text-muted whitespace-nowrap">
              {note.date}
            </span>
          </div>
        </div>
      ))
      }
      <div className="text-center py-4 text-[0.7rem] text-text-muted">
        {notes.length} {notes.length === 1 ? 'entry' : 'entries'}
      </div>
    </div >
  );
}

// 2. TIMELINE VIEW (Compact with Daily Synthesis)
const StreamView = ({ onChangeView, entries }: { onChangeView: (view: ViewState, data?: any) => void; entries: Note[] }) => {
  // Group entries by date
  const groupedByDate = entries.reduce((acc, entry) => {
    const dateKey = entry.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push({
      id: entry.id,
      type: entry.type || 'text',
      title: entry.title,
      preview: entry.preview,
      time: entry.time,
      mood: entry.mood
    });
    return acc;
  }, {} as Record<string, any[]>);

  const groupedEntries = Object.entries(groupedByDate).map(([date, items]) => {
    // Find dominant mood or latest mood
    const moodCounts = items.reduce((acc: any, item: any) => {
      if (item.mood) {
        acc[item.mood] = (acc[item.mood] || 0) + 1;
      }
      return acc;
    }, {});

    let dominantMood = 'neutral';
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([m, count]: [string, any]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMood = m;
      }
    });

    return {
      date,
      mood: dominantMood || 'neutral',
      summary: `${items.length} ${items.length === 1 ? 'entry' : 'entries'} on this day.`,
      items
    };
  });

  if (groupedEntries.length === 0) {
    return (
      <div className="text-center py-12 text-sage-400">
        No entries yet. Start writing!
      </div>
    );
  }

  const getMoodIcon = (mood: string) => {
    const m = mood?.toLowerCase() || 'neutral';
    switch (m) {
      case 'radiant': return <Sun size={14} className="text-amber-500" />;
      case 'content': return <Smile size={14} className="text-emerald-600" />;
      case 'steady': return <Meh size={14} className="text-blue-500" />;
      case 'cloudy': return <Cloud size={14} className="text-stone-500" />;
      case 'low': return <CloudRain size={14} className="text-indigo-500" />;
      case 'good': return <Smile size={14} />;
      case 'mixed': return <div className="text-[10px] font-bold">~</div>;
      default: return <div className="w-3 h-3 rounded-full bg-sage-200" />;
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {groupedEntries.map((day, dayIdx) => (
        <div key={dayIdx}>

          {/* Header Group with Daily Synthesis */}
          <div className="mb-5 text-center">
            <h3 className="font-serif text-xl text-sage-900 mb-3">{day.date}</h3>

            {/* Summary Banner with Mood */}
            {/* Summary Banner with Mood */}
            <div className="bg-white/40 backdrop-blur-sm border-l-2 border-sage-400 pl-4 py-2 pr-2 text-left relative overflow-hidden rounded-r-xl">
              <div className="flex justify-between items-start mb-1">
                <div className="flex gap-2 items-center">
                  <Sparkles size={10} className="text-sage-500" />
                  <span className="text-[0.6rem] font-bold text-sage-600 uppercase tracking-[0.1em]">Daily Synthesis</span>
                </div>

                {/* Mood Indicator */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/50">
                  <span className="text-[0.55rem] font-bold text-sage-400 uppercase tracking-wide">Mood:</span>
                  <div className="text-sage-600 flex items-center gap-1">
                    {getMoodIcon(day.mood)}
                    <span className="text-[0.6rem] font-medium capitalize">{day.mood}</span>
                  </div>
                </div>
              </div>
              <p className="text-[0.85rem] text-sage-700 font-serif leading-relaxed">
                {day.summary}
              </p>
            </div>
          </div>

          {/* VINE CONTAINER */}
          <div className="relative pl-6 space-y-0 text-left">
            {/* Main stem line */}
            <div className="absolute left-[20px] top-0 bottom-0 w-[1px] bg-sage-200/60 rounded-full" />

            {day.items.map((item: any, itemIdx: number) => (
              <div
                key={item.id}
                onClick={() => onChangeView(ViewState.EDITOR, { entryId: item.id, returnTo: ViewState.JOURNAL })}
                className="relative group pl-10 pb-4 last:pb-0"
              >
                {/* Branch connector */}
                <div className="absolute left-[20px] top-[18px] w-6 h-[1px] bg-sage-200/60" />

                {/* Dot node */}
                <div className="absolute left-[18px] top-[15px] w-[5px] h-[5px] rounded-full bg-sage-300 group-hover:bg-sage-500 transition-colors shadow-[0_0_0_2px_#faf9f7]" />

                {/* CARD CONTENT - Compact */}
                <div className="glass-card p-3 md:p-4 rounded-[16px] hover:border-sage-300 transition-all cursor-pointer relative overflow-hidden group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="mt-0.5 shrink-0 w-8 h-8 rounded-[10px] flex items-center justify-center bg-white border border-sage-100/50 text-sage-400 group-hover:text-sage-600 group-hover:border-sage-200 transition-colors">
                      {item.type === 'voice' && <Mic size={14} strokeWidth={1.5} />}
                      {item.type === 'text' && <FileText size={14} strokeWidth={1.5} />}
                      {item.type === 'image' && <ImageIcon size={14} strokeWidth={1.5} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-serif text-[1rem] text-sage-900 truncate pr-2 group-hover:text-sage-700 transition-colors">{item.title}</h4>
                        <span className="text-[0.6rem] text-sage-400 font-medium tracking-wide shrink-0">{item.time}</span>
                      </div>

                      {item.type === 'text' && (
                        <p className="text-sage-700/80 text-[0.85rem] line-clamp-3 leading-relaxed font-light">{item.preview}</p>
                      )}

                      {/* Voice Visualizer */}
                      {item.type === 'voice' && (
                        <div className="mt-2 flex items-center gap-2 bg-sage-50 rounded-[10px] p-2 max-w-sm border border-sage-100 group-hover:border-sage-200 transition-colors">
                          <button className="w-7 h-7 bg-sage-500 rounded-full flex items-center justify-center text-white hover:bg-sage-600 transition-colors shrink-0">
                            <Play size={11} fill="currentColor" />
                          </button>
                          <div className="flex-1 flex items-center gap-0.5 h-3 opacity-40 overflow-hidden">
                            {[...Array(20)].map((_, i) => (
                              <div key={i} className="w-0.5 bg-sage-400 rounded-full shrink-0" style={{ height: `${Math.random() * 100}%` }} />
                            ))}
                          </div>
                          <span className="text-[0.6rem] font-medium text-sage-400">{item.duration}</span>
                        </div>
                      )}

                      {item.type === 'image' && (
                        <div className="mt-2 relative h-32 w-full rounded-[10px] overflow-hidden">
                          <img src={item.src} alt="Memory" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[10px]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center pt-6 pb-4">
        <div className="inline-flex flex-col items-center gap-2">
          <div className="w-[2px] h-6 bg-gradient-to-b from-sage-200 to-transparent rounded-full" />
          <span className="text-[0.65rem] font-medium text-sage-400 uppercase tracking-[0.1em]">
            End of timeline
          </span>
        </div>
      </div>
    </div>
  );
}

// 3. CALENDAR VIEW (Grid - Unified Sage Theme)
const CalendarView = ({ onChangeView, entries: noteEntries, moodByDate }: { onChangeView: (view: ViewState, data?: any) => void; entries: Note[]; moodByDate: Record<string, string> }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }, (_, i) => i + 1);
  const startDayOffset = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday = 0

  const goToPrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDay(null);
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
  const isCurrentMonth = currentMonth === now.getMonth() && currentYear === now.getFullYear();

  // Convert entries to calendar format - filter by current month/year
  const entriesByDay: Record<number, any> = {};
  noteEntries.forEach(entry => {
    // Parse day from date string (e.g., "12/20/2024" or "Today")
    const dateStr = entry.date;
    let entryDate: Date | null = null;
    let dateKey = '';

    if (dateStr.toLowerCase() === 'today') {
      entryDate = now;
      dateKey = now.toLocaleDateString();
    } else {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        entryDate = parsed;
        dateKey = parsed.toLocaleDateString();
      }
    }

    // Only include entries from the current displayed month/year
    if (entryDate && entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
      const day = entryDate.getDate();
      // Look up mood from moodByDate map first, then fallback to entry.mood
      const moodFromLog = moodByDate[dateKey];
      const mood = moodFromLog || entry.mood || 'neutral';

      if (!entriesByDay[day]) {
        entriesByDay[day] = { mood, aiTitle: entry.title, items: [], today: isCurrentMonth && day === now.getDate() };
      } else {
        // If we have a better mood from logs, use it
        if (moodFromLog && entriesByDay[day].mood === 'neutral') {
          entriesByDay[day].mood = moodFromLog;
        }
      }
      entriesByDay[day].items.push({ type: entry.type || 'text', count: 1 });
    }
  });

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Unified Sage/Stone Gradient Map - handle both old (good/bad) and new (Low/Cloudy/etc) mood labels
  const getGradient = (mood: string) => {
    const moodLower = mood?.toLowerCase() || '';
    switch (moodLower) {
      // New mood labels from Home picker
      case 'radiant': return 'from-sage/40 to-sage/60 hover:to-sage/70';
      case 'content': return 'from-sage/20 to-sage/30 hover:to-sage/40';
      case 'steady': return 'from-sage-muted to-sage/30 hover:to-sage/40';
      case 'cloudy': return 'from-dark-elevated to-dark-hover hover:to-dark-surface';
      case 'low': return 'from-dark-surface to-dark-hover hover:to-dark-elevated';
      // Old mood labels (for backward compatibility)
      case 'good': return 'from-sage/20 to-sage/30 hover:to-sage/40';
      case 'great': return 'from-sage/40 to-sage/60 hover:to-sage/70';
      case 'bad': return 'from-dark-surface to-dark-hover hover:to-dark-elevated';
      case 'mixed': return 'from-sage-muted to-sage/30 hover:to-sage/40';
      default: return 'from-dark-surface to-dark-hover';
    }
  }

  return (
    <div className="animate-in fade-in duration-300 relative max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h3 className="font-serif text-xl text-text-primary">{monthName} <span className="text-text-muted font-light">{currentYear}</span></h3>
          <div className="flex gap-0.5">
            <button
              onClick={goToPrevMonth}
              className="p-1.5 rounded-full hover:bg-dark-hover text-text-muted transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-1.5 rounded-full hover:bg-dark-hover text-text-muted transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
        {!isCurrentMonth && (
          <button
            onClick={goToToday}
            className="px-3 py-1 text-[0.65rem] font-bold text-sage uppercase tracking-[0.1em] bg-dark-surface border border-dark-border rounded-full hover:border-sage-border transition-colors"
          >
            Today
          </button>
        )}
      </div>
      <div className="glass-card rounded-[20px] overflow-hidden p-4 md:p-6">
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(d => (
            <div key={d} className="text-center text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.1em] py-1.5">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {daysInMonth.map(day => {
            const entry = entriesByDay[day];
            const hasVoice = entry?.items.some((i: any) => i.type === 'voice');
            const hasImage = entry?.items.some((i: any) => i.type === 'image');
            return (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`group relative aspect-square rounded-[10px] border transition-all cursor-pointer overflow-hidden ${entry ? `bg-gradient-to-br ${getGradient(entry.mood)} border-dark-border` : 'bg-transparent border-dark-border-subtle text-text-muted hover:border-dark-border'} ${entry?.today ? 'ring-1 ring-sage ring-offset-1 ring-offset-dark-base' : ''}`}
              >
                <div className={`absolute top-1 left-1.5 md:top-2 md:left-2 text-[0.6rem] md:text-[0.7rem] font-medium ${entry ? 'text-text-primary' : ''}`}>
                  {day}
                </div>
                {entry ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-center mt-2 md:mt-3">
                    <div className="flex gap-0.5 mt-1">
                      {entry.items.map((_: any, i: number) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-text-primary/30" />
                      ))}
                    </div>
                    <div className="absolute bottom-1 right-1 md:bottom-1.5 md:right-1.5 flex gap-0.5 opacity-50 text-text-primary">
                      {hasVoice && <Mic size={8} />}
                      {hasImage && <ImageIcon size={8} />}
                    </div>
                  </div>
                ) : (
                  <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={14} className="text-text-muted" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {selectedDay && (
        <DayDetailOverlay
          day={selectedDay}
          month={currentMonth}
          year={currentYear}
          data={entriesByDay[selectedDay]}
          onClose={() => setSelectedDay(null)}
          onChangeView={onChangeView}
          entries={noteEntries}
        />
      )}
    </div>
  );
};

const DayDetailOverlay = ({ day, month, year, data, onClose, onChangeView, entries }: { day: number; month: number; year: number; data: any; onClose: () => void; onChangeView: (view: ViewState, data?: any) => void; entries: Note[] }) => {
  const now = new Date();

  // Filter entries for this specific day, month, and year
  const dayEntries = entries.filter(entry => {
    const dateStr = entry.date;
    let entryDate: Date | null = null;

    if (dateStr.toLowerCase() === 'today') {
      entryDate = now;
    } else {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        entryDate = parsed;
      }
    }

    return entryDate &&
      entryDate.getDate() === day &&
      entryDate.getMonth() === month &&
      entryDate.getFullYear() === year;
  });

  const selectedDate = new Date(year, month, day);
  const formattedDate = selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const hasEntries = dayEntries.length > 0;
  const fallbackSummaryText = hasEntries
    ? `${dayEntries.length} ${dayEntries.length === 1 ? 'entry' : 'entries'} captured on this day.`
    : 'No memories captured for this day.';

  const dateKey = useMemo(() => {
    const y = year;
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [day, month, year]);

  const dayEntryPayload = useMemo(
    () =>
      dayEntries.map((e) => ({
        id: e.id,
        title: e.title || null,
        content: e.content || null,
      })),
    [dayEntries],
  );

  const entryIdsKey = useMemo(() => dayEntryPayload.map((e) => e.id).sort().join('|'), [dayEntryPayload]);

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiSummaryCached, setAiSummaryCached] = useState(false);
  const [isLoadingAiSummary, setIsLoadingAiSummary] = useState(false);
  const [aiSummaryError, setAiSummaryError] = useState<string | null>(null);
  const [aiSummaryRequiredPlan, setAiSummaryRequiredPlan] = useState<string | null>(null);

  const runDailySummary = async (force: boolean) => {
    if (!hasEntries) return;

    setIsLoadingAiSummary(true);
    setAiSummaryError(null);
    setAiSummaryRequiredPlan(null);

    try {
      const res = await AIService.getDailySummary(dateKey, dayEntryPayload, { force });

      // AI disabled (opt-out) or no result → fall back to non-AI summary text.
      if (!res.summary && !res.error && !res.requiredPlan) {
        setAiSummary(null);
        setAiSummaryCached(false);
        return;
      }

      if (res.requiredPlan) {
        setAiSummary(null);
        setAiSummaryCached(false);
        setAiSummaryRequiredPlan(res.requiredPlan);
        setAiSummaryError(res.error || 'Upgrade required to generate a daily summary.');
        return;
      }

      if (res.error) {
        setAiSummary(null);
        setAiSummaryCached(false);
        setAiSummaryError(res.error);
        return;
      }

      setAiSummary(res.summary || null);
      setAiSummaryCached(Boolean(res.cached));
    } catch (e: any) {
      setAiSummary(null);
      setAiSummaryCached(false);
      setAiSummaryError(e?.message || 'Failed to generate a daily summary.');
    } finally {
      setIsLoadingAiSummary(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    setAiSummary(null);
    setAiSummaryCached(false);
    setAiSummaryError(null);
    setAiSummaryRequiredPlan(null);

    if (!hasEntries) return;

    (async () => {
      await runDailySummary(false);
    })();

    return () => {
      cancelled = true;
      void cancelled;
    };
    // Intentionally keyed by day + the set of entry IDs for cache correctness.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey, entryIdsKey, hasEntries]);

  const handleCopySummary = async () => {
    if (!aiSummary) return;
    try {
      await navigator.clipboard.writeText(aiSummary);
      toast.success('Copied summary');
    } catch {
      toast.error('Could not copy');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center sm:p-4 md:p-8">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-dark-base rounded-t-[32px] md:rounded-[40px] shadow-2xl overflow-hidden animate-fade-up md:animate-scale-in flex flex-col h-[85vh] md:max-h-[92vh] border border-dark-border">
        <div className="relative h-40 md:h-56 shrink-0 overflow-hidden bg-dark-surface group">
          <div className="w-full h-full bg-gradient-to-br from-sage/20 via-dark-base to-dark-surface opacity-80 flex items-center justify-center">
            <button
              onClick={() => {
                toast.error('Cover images coming soon!');
              }}
              className="flex flex-col items-center gap-2 text-text-muted hover:text-sage transition-colors p-4 rounded-xl hover:bg-dark-hover backdrop-blur-sm"
            >
              <Camera size={24} />
              <span className="text-xs font-bold uppercase tracking-widest">Add Cover</span>
            </button>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-dark-surface/80 hover:bg-dark-hover backdrop-blur-md rounded-full transition-colors text-text-primary border border-dark-border z-10">
            <X size={20} />
          </button>
          <div className="absolute bottom-4 left-6 right-6 md:bottom-6 md:left-8 md:right-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] md:text-xs font-bold text-sage uppercase tracking-widest mb-1">{formattedDate}</p>
                <h2 className="font-serif text-2xl md:text-4xl text-text-primary">{hasEntries ? dayEntries[0].title : 'Empty Page'}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-4">
          {hasEntries ? (
            <>
              <div className="glass-card-glow p-5 rounded-3xl mb-8 flex gap-4">
                <div className="mt-1"><Sparkles size={18} className="text-sage" /></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-bold text-sage uppercase tracking-wider">Daily Summary</p>
                      {aiSummary && (
                        <span className="px-1.5 py-0.5 rounded-md bg-sage-subtle text-[9px] font-bold text-sage uppercase tracking-wide border border-sage-border">
                          AI{aiSummaryCached ? ' · Cached' : ''}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleCopySummary}
                        disabled={!aiSummary}
                        className="p-2 rounded-full hover:bg-dark-hover transition-colors disabled:opacity-40"
                        title="Copy summary"
                      >
                        <Copy size={14} className="text-text-muted" />
                      </button>
                      <button
                        onClick={() => runDailySummary(true)}
                        disabled={isLoadingAiSummary}
                        className="p-2 rounded-full hover:bg-dark-hover transition-colors disabled:opacity-40"
                        title="Regenerate"
                      >
                        <RefreshCw size={14} className={`text-text-muted ${isLoadingAiSummary ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2">
                    {isLoadingAiSummary ? (
                      <div className="flex items-center gap-2 text-text-muted">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Generating summary…</span>
                      </div>
                    ) : aiSummary ? (
                      <p className="text-sm text-text-secondary leading-relaxed font-light whitespace-pre-wrap">{aiSummary}</p>
                    ) : aiSummaryRequiredPlan ? (
                      <div className="space-y-3">
                        <p className="text-sm text-text-secondary leading-relaxed font-light">
                          Daily AI summaries are available on Pro and Premium.
                        </p>
                        <button
                          onClick={() => onChangeView(ViewState.PRICING)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-full text-sm font-medium hover:shadow-glow transition-all"
                        >
                          View plans <ArrowUpRight size={14} />
                        </button>
                      </div>
                    ) : aiSummaryError ? (
                      <div className="space-y-3">
                        <p className="text-sm text-text-secondary leading-relaxed font-light">
                          {aiSummaryError.includes('Upgrade required')
                            ? 'Daily summaries are available on Pro and Premium plans.'
                            : aiSummaryError || "Couldn't generate a daily summary right now. Please try again."}
                        </p>
                        {!aiSummaryError.includes('Upgrade required') && (
                          <button
                            onClick={() => runDailySummary(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-dark-surface text-text-secondary rounded-full text-sm font-medium hover:bg-dark-hover transition-all border border-dark-border"
                          >
                            Try again
                          </button>
                        )}
                        {aiSummaryError.includes('Upgrade required') && (
                          <button
                            onClick={() => onChangeView(ViewState.PRICING)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-sage text-white rounded-full text-sm font-medium hover:shadow-glow transition-all"
                          >
                            View plans <ArrowUpRight size={14} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-text-secondary leading-relaxed font-light">{fallbackSummaryText}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {dayEntries.map((entry, idx) => (
                  <div
                    key={entry.id}
                    onClick={() => onChangeView(ViewState.EDITOR, { entryId: entry.id })}
                    className="glass-card p-4 rounded-2xl hover:shadow-glow hover:border-sage-border transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-sage-subtle text-sage">
                        <FileText size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text-primary text-sm truncate">{entry.title}</h4>
                        <p className="text-xs text-text-secondary mt-1 truncate font-light">{entry.preview}</p>
                        <p className="text-[10px] text-text-muted mt-2">{entry.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 flex flex-col items-center">
              <p className="text-text-secondary mb-6">No memories captured for this day.</p>
              <button onClick={() => onChangeView(ViewState.EDITOR, { prompt: `Entry for ${formattedDate}` })} className="px-6 py-3 bg-sage text-white rounded-full font-medium shadow-glow hover:shadow-glow-lg transition-all">Start Writing</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ThreadsView = ({ onChangeView, query }: { onChangeView: (view: ViewState, data?: any) => void; query?: string }) => {
  const [threads, setThreads] = useState<ThreadWithPreview[]>([]);
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      setIsLoadingThreads(true);
      try {
        const data = await ThreadService.getThreadsWithPreviews();
        setThreads(data);
      } catch (e) {
        console.error('Failed to fetch threads:', e);
      } finally {
        setIsLoadingThreads(false);
      }
    };
    fetchThreads();
  }, []);

  if (isLoadingThreads) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <EmptyState
        icon={GitBranch}
        title="Start a thread"
        description="Threads group related entries so you can track a thought, decision, or theme over time."
        actionLabel="Write your first entry"
        onAction={() => onChangeView(ViewState.EDITOR)}
        variant="card"
        iconColor="sage"
      />
    );
  }

  const normalized = (query || '').trim().toLowerCase();
  const filtered = normalized
    ? threads.filter((t) => {
      const haystack = [
        t.name,
        t.description,
        t.latestEntry?.title,
        t.latestEntry?.preview,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    })
    : threads;

  if (normalized && filtered.length === 0) {
    return <SearchEmptyState query={query?.trim() || ''} />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {filtered.map((t) => (
        <ThreadCard
          key={t.id}
          title={t.name}
          desc={t.description || t.latestEntry?.preview || 'No entries yet.'}
          count={t.entry_count}
          updated={t.last_entry_at ? new Date(t.last_entry_at).toLocaleDateString() : '—'}
          onClick={() => onChangeView(ViewState.THREAD_DETAIL, { id: t.id, title: t.name })}
        />
      ))}
    </div>
  );
};

const ReflectionsView = ({
  onChangeView,
  entries,
}: {
  onChangeView: (view: ViewState, data?: any) => void;
  entries: Note[];
}) => {
  const reflections = entries.filter((e) => {
    const tags = e.tags ?? [];
    const isReflection = e.isReflection || tags.includes('guided-reflection') || tags.includes('reflection');
    if (import.meta.env.DEV && isReflection) {
      console.log('[REFLECTIONS_DEBUG] Found reflection:', {
        id: e.id,
        title: e.title,
        isReflection: e.isReflection,
        tags: tags,
        matches: isReflection
      });
    }
    return isReflection;
  });

  if (import.meta.env.DEV) {
    console.log('[REFLECTIONS_DEBUG] Total entries:', entries.length, 'Reflections found:', reflections.length);
  }

  if (reflections.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No reflections yet"
        description="Try a guided reflection session to create a structured entry you can return to."
        actionLabel="Start a guided reflection"
        onAction={() => onChangeView(ViewState.EDITOR)}
        variant="card"
        iconColor="sage"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2 max-w-3xl mx-auto">
      {reflections.map((note, index) => (
        <div
          key={note.id}
          onClick={() => onChangeView(ViewState.EDITOR, { entryId: note.id, returnTo: ViewState.JOURNAL })}
          className="group glass-card p-4 rounded-[18px] hover:border-sage-border hover:shadow-card-hover transition-colors cursor-pointer flex flex-col md:flex-row md:items-start gap-3 relative overflow-hidden text-left"
        >
          <div className="mt-0.5 w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0 transition-colors bg-white/90 border border-sage-100 text-sage-400 group-hover:text-sage-600 group-hover:border-sage-200">
            <BookOpen size={14} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <h4 className="font-serif text-[0.95rem] text-text-primary truncate group-hover:text-sage transition-colors pr-2">{note.title}</h4>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[0.6rem] font-medium text-text-muted">{note.date}</span>
                <span className="px-1.5 py-0.5 rounded-md bg-dark-surface text-[0.6rem] font-bold text-text-muted uppercase tracking-[0.08em]">
                  Reflection
                </span>
              </div>
            </div>
            <p className="text-[0.75rem] text-text-secondary truncate font-light leading-relaxed opacity-80">{note.preview}</p>
          </div>
        </div>
      ))
      }
    </div >
  );
};

// Refined Thread Card
// Refined Thread Card (Dense "Tapestry" Style)
const ThreadCard = ({ title, desc, count, updated, onClick }: any) => (
  <div onClick={onClick} className="group glass-card p-4 rounded-[18px] hover:border-sage-border hover:shadow-card-hover transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden">
    <div className="mt-0.5 w-9 h-9 rounded-[12px] bg-white/90 border border-sage-100 text-sage-400 flex items-center justify-center shrink-0 group-hover:text-sage-600 group-hover:border-sage-200 transition-colors">
      <GitBranch strokeWidth={1.5} size={14} />
    </div>

    <div className="flex-1 min-w-0 text-left">
      <div className="flex items-center justify-between mb-0.5">
        <h4 className="font-serif text-[0.95rem] text-text-primary group-hover:text-sage transition-colors truncate pr-2">{title}</h4>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[0.6rem] font-medium text-text-muted">{updated}</span>
          <span className="flex items-center gap-1 bg-sage-subtle text-sage px-1.5 py-0.5 rounded-md text-[0.6rem] font-bold">
            {count} <span className="sr-only">entries</span>
          </span>
        </div>
      </div>
      <p className="text-[0.75rem] text-text-secondary font-light truncate leading-relaxed opacity-80">{desc}</p>
    </div>
  </div>
)

export default Journal;
