
import React, { useState } from 'react';
import { ViewState } from '../types';
import { 
  Search, Filter, Calendar as CalendarIcon, List as ListIcon, Map, Play, 
  CheckCircle2, Lock, GitBranch, ChevronLeft, ChevronRight, 
  Plus, Sparkles, MoreHorizontal, Mic, FileText, X, Clock,
  Maximize2, Image as ImageIcon, ArrowUpRight, Camera, LayoutList, AlignLeft,
  Leaf, Sprout, Smile
} from 'lucide-react';

interface JournalProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

const Journal: React.FC<JournalProps> = ({ onChangeView }) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'list'>('timeline');
  const [activeFilter, setActiveFilter] = useState<'all' | 'threads' | 'reflections'>('all');

  return (
    <div className="space-y-8 lg:space-y-10 animate-fade-up relative pb-20">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col gap-8">
          
          {/* Top Row: Title & View Toggles */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-center md:text-left">
            <div className="w-full">
                <h2 className="font-serif text-4xl text-text-primary mb-2">Journal</h2>
                <p className="text-text-secondary font-light">Your growing timeline of thoughts.</p>
            </div>

            {/* View Mode Toggle - Only shows for All Entries */}
            <div className={`transition-opacity duration-300 ${activeFilter === 'all' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="flex items-center gap-1 bg-white border border-stone-200 p-1 rounded-full shadow-sm mx-auto md:mx-0">
                    <button
                        onClick={() => setViewMode('timeline')}
                        className={`
                            h-9 px-4 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300
                            ${viewMode === 'timeline' ? 'bg-sage text-white shadow-md' : 'text-stone-400 hover:text-text-secondary hover:bg-stone-50'}
                        `}
                    >
                        <LayoutList size={14} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Stream</span>
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`
                            h-9 px-4 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300
                            ${viewMode === 'calendar' ? 'bg-sage text-white shadow-md' : 'text-stone-400 hover:text-text-secondary hover:bg-stone-50'}
                        `}
                    >
                        <CalendarIcon size={14} strokeWidth={2.5} />
                        <span className="hidden sm:inline">Calendar</span>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`
                            h-9 px-4 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all duration-300
                            ${viewMode === 'list' ? 'bg-sage text-white shadow-md' : 'text-stone-400 hover:text-text-secondary hover:bg-stone-50'}
                        `}
                    >
                        <AlignLeft size={14} strokeWidth={2.5} />
                        <span className="hidden sm:inline">List</span>
                    </button>
                </div>
            </div>
          </div>

          {/* Second Row: Filter Pills */}
          <div className="w-full overflow-x-auto no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 flex justify-center md:justify-start">
             <div className="flex items-center gap-2 min-w-max border-b border-stone-100 pb-1">
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
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="min-h-[50vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
         
         {/* ALL ENTRIES (Timeline, Calendar, or List) */}
         {activeFilter === 'all' && (
             <>
                {viewMode === 'timeline' && <StreamView onChangeView={onChangeView} />}
                {viewMode === 'calendar' && <CalendarView onChangeView={onChangeView} />}
                {viewMode === 'list' && <ListView onChangeView={onChangeView} />}
             </>
         )}

         {/* THREADS VIEW */}
         {activeFilter === 'threads' && <ThreadsView onChangeView={onChangeView} />}
         
         {/* REFLECTIONS VIEW */}
         {activeFilter === 'reflections' && <ReflectionsView onChangeView={onChangeView} />}

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const FilterTab = ({ label, isActive, onClick }: any) => (
    <button
        onClick={onClick}
        className={`
            px-4 py-2 text-sm font-medium transition-all duration-300 relative
            ${isActive ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}
        `}
    >
        {label}
        {isActive && (
            <div className="absolute bottom-[-5px] left-0 right-0 h-0.5 bg-text-primary rounded-full" />
        )}
    </button>
);

// 1. NOTES LIST VIEW (Unified Colors)
const ListView = ({ onChangeView }: { onChangeView: (view: ViewState, data?: any) => void }) => {
    const notes = [
        { id: 1, title: 'Ideas on Commute', preview: 'AI generated title based on content...', date: 'Today', type: 'voice', category: 'Ideas', duration: '2:14' },
        { id: 2, title: 'Project Kickoff Notes', preview: 'The team seems aligned, but I need to clarify the budget constraints before Monday. Specifically regarding...', date: 'Today', type: 'text', category: 'Work' },
        { id: 3, title: 'The old coffee shop', preview: 'Photo memory', date: 'Yesterday', type: 'image', category: 'Personal' },
        { id: 4, title: 'Conversation with Sam', preview: 'We finally talked about the move. It wasn\'t as scary as I thought it would be.', date: 'Yesterday', type: 'text', category: 'Relationships' },
        { id: 5, title: 'Grocery List for Weekend', preview: 'Almond milk, kale, coffee beans, sparkling water...', date: 'Dec 14', type: 'text', category: 'Personal' },
        { id: 6, title: 'Book notes: Atomic Habits', preview: 'The idea of 1% improvement really stuck with me today.', date: 'Dec 12', type: 'text', category: 'Growth' },
    ];

    return (
        <div className="flex flex-col gap-3 max-w-3xl mx-auto">
            {notes.map((note, index) => (
                <div 
                    key={note.id}
                    onClick={() => onChangeView(ViewState.EDITOR, { prompt: `Edit: ${note.title}` })}
                    className="group bg-white p-5 rounded-[20px] border border-stone-100 shadow-sm hover:shadow-card-hover hover:border-stone-200 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-4 md:gap-6 relative overflow-hidden animate-fade-up text-left"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-sage opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors bg-sage/5 text-sage group-hover:bg-sage/20 group-hover:text-sage-dark">
                        {note.type === 'voice' && <Mic size={16} />}
                        {note.type === 'image' && <ImageIcon size={18} />}
                        {note.type === 'text' && <FileText size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-serif text-lg text-text-primary truncate">{note.title}</h4>
                            {note.type === 'voice' && (
                                <span className="px-1.5 py-0.5 rounded-md bg-sage/10 text-[9px] font-bold text-sage-dark uppercase tracking-wide border border-sage/20">
                                    AI Title
                                </span>
                            )}
                        </div>
                        {note.type === 'voice' ? (
                            <div className="flex items-center gap-3">
                                <div className="flex gap-0.5 h-3 items-end opacity-40">
                                     {[...Array(12)].map((_, i) => (
                                         <div key={i} className="w-0.5 bg-sage-dark rounded-full" style={{ height: `${Math.random() * 100}%`}} />
                                     ))}
                                </div>
                                <span className="text-xs font-medium text-text-muted">{note.duration}</span>
                            </div>
                        ) : (
                            <p className="text-sm text-text-secondary truncate font-light opacity-80">{note.preview}</p>
                        )}
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4 min-w-[140px] border-t md:border-t-0 border-stone-50 pt-3 md:pt-0">
                        <span className="px-2.5 py-1 rounded-lg bg-stone-50 text-[10px] font-bold text-text-muted uppercase tracking-wide">
                            {note.category}
                        </span>
                        <span className="text-xs text-text-muted font-medium whitespace-nowrap">
                            {note.date}
                        </span>
                    </div>
                </div>
            ))}
            <div className="text-center py-6 text-xs text-text-muted">
                {notes.length} notes
            </div>
        </div>
    );
}

// 2. TIMELINE VIEW (Updated Organic Vine)
const StreamView = ({ onChangeView }: { onChangeView: (view: ViewState, data?: any) => void }) => {
    const entries = [
        {
            date: "Today, Dec 16",
            mood: "mixed",
            summary: "A day of high energy. You're excited about the new project but anxious about the timeline.",
            items: [
                { id: 1, type: 'voice', title: 'Morning Commute Idea', duration: '2:14', time: '08:45 AM' },
                { id: 2, type: 'text', title: 'Project Kickoff Notes', preview: 'The team seems aligned, but I need to clarify the budget constraints before Monday...', time: '10:30 AM', thread: 'Work' },
            ]
        },
        {
            date: "Yesterday, Dec 15",
            mood: "good",
            summary: "You focused heavily on 'Relationships'. The dinner with Sam sparked a lot of reflection.",
            items: [
                { id: 3, type: 'image', src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800', title: 'The old coffee shop', time: '02:15 PM' },
                { id: 4, type: 'text', title: 'Conversation with Sam', preview: 'We finally talked about the move. It wasn\'t as scary as I thought it would be.', time: '09:00 PM', thread: 'Relationships' },
            ]
        }
    ];

    const getMoodIcon = (mood: string) => {
        switch(mood) {
            case 'good': return <Smile size={14} />;
            case 'mixed': return <div className="text-[10px] font-bold">~</div>; // Custom for mixed
            default: return <Smile size={14} />;
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-12">
            {entries.map((day, dayIdx) => (
                <div key={dayIdx} className="animate-fade-up" style={{ animationDelay: `${dayIdx * 150}ms` }}>
                    
                    {/* Header Group */}
                    <div className="mb-6 text-center">
                        <div className="flex items-center justify-center gap-3 mb-3">
                             <h3 className="font-serif text-2xl text-text-primary">{day.date}</h3>
                        </div>
                        
                        {/* Summary Banner with Mood */}
                        <div className="bg-gradient-to-r from-white to-[#faf9f7] border border-stone-100 p-4 rounded-2xl text-left relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-sage" />
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-2 items-center">
                                    <Sparkles size={12} className="text-sage" /> 
                                    <span className="text-[10px] font-bold text-sage uppercase tracking-wider">Daily Synthesis</span>
                                </div>
                                
                                {/* Mood Indicator */}
                                <div className="flex items-center gap-2 bg-white border border-stone-200 px-2 py-1 rounded-full shadow-sm">
                                    <span className="text-[10px] font-bold text-text-muted uppercase">Mood:</span>
                                    <div className="text-sage-dark flex items-center gap-1">
                                        {getMoodIcon(day.mood)}
                                        <span className="text-[10px] font-bold uppercase">{day.mood}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-text-secondary font-light leading-relaxed italic opacity-90">
                                "{day.summary}"
                            </p>
                        </div>
                    </div>

                    {/* VINE CONTAINER */}
                    <div className="relative pl-6 space-y-0 text-left">
                        
                        {/* 
                           THE MAIN VINE STEM 
                           A solid vertical line (stalk) running down the entire day block.
                           Positioned at left-[20px] which is 20px from left. Width is 3px. Center is 21.5px.
                        */}
                        <div className="absolute left-[20px] top-0 bottom-0 w-[3px] bg-[#dbe3df] rounded-full" />

                        {day.items.map((item: any, itemIdx: number) => (
                            <div 
                                key={item.id} 
                                onClick={() => onChangeView(ViewState.EDITOR, { prompt: `Edit: ${item.title}` })}
                                className="relative group animate-fade-up pl-12 pb-8 last:pb-0"
                                style={{ animationDelay: `${(dayIdx * 150) + (itemIdx * 100)}ms` }}
                            >
                                {/* 
                                   THE BRANCH CONNECTOR 
                                   Revised for cleaner connection.
                                   The main stem center is at ~21.5px.
                                   We need the SVG to start exactly there.
                                   SVG container positioned at left-[21px].
                                */}
                                <svg 
                                    className="absolute left-[21.5px] top-[24px] w-12 h-12 pointer-events-none text-[#dbe3df] z-0" 
                                    width="48" height="48" viewBox="0 0 48 48" fill="none"
                                >
                                    {/* M 0 0 means start at top-left of SVG (which is center of stem) */}
                                    {/* Curve out to the right and down slightly */}
                                    <path d="M 0 0 Q 0 20 20 20 L 30 20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                                </svg>

                                {/* LEAF NODE AT JUNCTION */}
                                {/* Positioned to sit right on the curve */}
                                <div className="absolute left-[24px] top-[14px] text-sage transform -rotate-12 opacity-80 group-hover:opacity-100 transition-opacity z-10">
                                     <Leaf size={14} fill="currentColor" />
                                </div>
                                
                                {/* CARD CONTENT */}
                                <div className="bg-white p-5 rounded-[24px] rounded-tl-none border border-stone-100 shadow-sm hover:shadow-card-hover hover:border-sage/30 transition-all cursor-pointer relative overflow-hidden group-hover:-translate-y-0.5 z-20">
                                    <div className="flex items-start gap-4">
                                        {/* Unified Sage Icon */}
                                        <div className="mt-0.5 shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-sage/5 text-sage-dark">
                                            {item.type === 'voice' && <Mic size={18} />}
                                            {item.type === 'text' && <FileText size={18} />}
                                            {item.type === 'image' && <ImageIcon size={18} />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-serif text-lg text-text-primary truncate pr-2 group-hover:text-sage-dark transition-colors">{item.title}</h4>
                                                <span className="text-[10px] text-text-muted font-bold tracking-wider shrink-0">{item.time}</span>
                                            </div>
                                            
                                            {item.type === 'text' && (
                                                <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed font-light">{item.preview}</p>
                                            )}

                                            {/* Voice Visualizer - Sage Colored */}
                                            {item.type === 'voice' && (
                                                <div className="mt-3 flex items-center gap-3 bg-stone-50 rounded-xl p-2 max-w-sm border border-transparent group-hover:border-sage/10 transition-colors">
                                                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-sage-dark hover:bg-sage hover:text-white transition-colors shrink-0">
                                                        <Play size={12} fill="currentColor" />
                                                    </button>
                                                    <div className="flex-1 flex items-center gap-0.5 h-4 opacity-50 overflow-hidden">
                                                            {[...Array(24)].map((_, i) => (
                                                                <div key={i} className="w-1 bg-sage-dark rounded-full shrink-0" style={{ height: `${Math.random() * 100}%`}} />
                                                            ))}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-text-muted">{item.duration}</span>
                                                </div>
                                            )}

                                            {item.type === 'image' && (
                                                <div className="mt-3 relative h-48 w-full rounded-2xl overflow-hidden shadow-sm">
                                                    <img src={item.src} alt="Memory" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />
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
            
            <div className="text-center pt-8 pb-4">
                <div className="inline-flex flex-col items-center gap-2">
                    <div className="w-[3px] h-8 bg-gradient-to-b from-[#dbe3df] to-transparent rounded-full" />
                    <button className="text-xs font-bold text-sage uppercase tracking-widest hover:text-sage-dark transition-colors">
                        Roots run deeper...
                    </button>
                </div>
            </div>
        </div>
    )
}

// 3. CALENDAR VIEW (Grid - Unified Sage Theme)
const CalendarView = ({ onChangeView }: { onChangeView: (view: ViewState, data?: any) => void }) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDayOffset = 6; 
  const entries: any = {
    3: { mood: 'neutral', aiTitle: 'Quiet Morning', items: [{type: 'text', count: 1}] },
    5: { mood: 'good', aiTitle: 'Career Breakthrough', items: [{type: 'text', count: 1}, {type: 'voice', count: 1}] },
    8: { mood: 'bad', aiTitle: 'Doubts Surface', items: [{type: 'text', count: 2}] },
    12: { mood: 'good', aiTitle: 'Reconnecting', items: [{type: 'text', count: 1}] },
    14: { mood: 'great', aiTitle: 'Clarity Found', items: [{type: 'text', count: 1}, {type: 'voice', count: 1}] },
    15: { mood: 'neutral', aiTitle: 'Weighing Options', items: [{type: 'text', count: 1}, {type: 'image', count: 1}] },
    16: { mood: 'mixed', aiTitle: 'The Big Decision', today: true, items: [{type: 'text', count: 1}, {type: 'voice', count: 2}] },
  };
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  // Unified Sage/Stone Gradient Map
  const getGradient = (mood: string) => {
    switch(mood) {
        case 'good': return 'from-sage/20 to-sage/30 hover:to-sage/40';
        case 'great': return 'from-sage/40 to-sage/60 hover:to-sage/70';
        case 'bad': return 'from-stone-200 to-stone-300 hover:to-stone-400'; 
        case 'mixed': return 'from-[#a7b5b0] to-[#8da39d] hover:to-sage';
        default: return 'from-stone-50 to-stone-100';
    }
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 relative max-w-4xl mx-auto">
       <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
             <h3 className="font-serif text-2xl md:text-3xl text-text-primary">December <span className="text-stone-300 font-light">2024</span></h3>
             <div className="flex gap-1">
                <button className="p-2 rounded-full hover:bg-stone-100 text-text-muted transition-colors"><ChevronLeft size={18} /></button>
                <button className="p-2 rounded-full hover:bg-stone-100 text-text-muted transition-colors"><ChevronRight size={18} /></button>
             </div>
          </div>
       </div>
       <div className="bg-white rounded-[24px] md:rounded-[32px] border border-stone-200/60 shadow-sm overflow-hidden p-4 md:p-8">
          <div className="grid grid-cols-7 mb-2">
             {weekDays.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-stone-400 uppercase tracking-widest py-2">
                   {d}
                </div>
             ))}
          </div>
          <div className="grid grid-cols-7 gap-1 md:gap-2 lg:gap-4">
             {Array.from({ length: startDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
             ))}
             {daysInMonth.map(day => {
                const entry = entries[day];
                const hasVoice = entry?.items.some((i: any) => i.type === 'voice');
                const hasImage = entry?.items.some((i: any) => i.type === 'image');
                return (
                   <div 
                      key={day} 
                      onClick={() => setSelectedDay(day)}
                      className={`
                         group relative aspect-square rounded-xl md:rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden
                         ${entry ? `bg-gradient-to-br ${getGradient(entry.mood)} border-transparent z-10` : 'bg-transparent border-transparent text-stone-300'}
                         ${entry?.today ? 'ring-2 ring-sage ring-offset-1 md:ring-offset-2' : ''}
                      `}
                   >
                      <div className={`absolute top-1 left-1 md:top-3 md:left-3 text-[10px] md:text-sm font-medium z-10 ${entry ? 'text-text-primary' : ''}`}>
                         {day}
                      </div>
                      {entry ? (
                         <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-center z-10 mt-3 md:mt-4">
                            <p className="hidden md:block text-[10px] md:text-xs font-serif font-medium text-text-primary leading-tight line-clamp-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                               {entry.aiTitle}
                            </p>
                            <div className="flex gap-0.5 md:gap-1 mt-1 md:mt-0">
                                {entry.items.map((_: any, i: number) => (
                                    <div key={i} className="w-1 h-1 rounded-full bg-text-primary/40" />
                                ))}
                            </div>
                            <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 flex gap-0.5 md:gap-1 opacity-60 text-text-primary">
                               {hasVoice && <Mic size={8} className="md:w-3 md:h-3" />}
                               {hasImage && <ImageIcon size={8} className="md:w-3 md:h-3" />}
                            </div>
                         </div>
                      ) : (
                         <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus size={20} className="text-sage" />
                         </div>
                      )}
                   </div>
                );
             })}
          </div>
       </div>
       {selectedDay && (
            <DayDetailOverlay day={selectedDay} data={entries[selectedDay]} onClose={() => setSelectedDay(null)} onChangeView={onChangeView} />
        )}
    </div>
  );
};

const DayDetailOverlay = ({ day, data, onClose, onChangeView }: any) => {
    // ... reused from previous implementation with Sage colors
    const details = {
        summary: "A pivotal day where you balanced logical decision making with gut feeling.",
        heroImage: data?.items.some((i:any) => i.type === 'image') 
            ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800' 
            : null,
        timeline: [
            { type: 'voice', time: '09:30 AM', title: 'Morning gut check', duration: '2:14' },
            { type: 'image', time: '11:00 AM', title: 'The old coffee shop', src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800' },
            { type: 'text', time: '02:15 PM', title: 'Pros and cons list', preview: 'The money is better, but what about the time? I need to think about...' },
        ]
    };
    return (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center sm:p-4 md:p-8">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-[#faf9f7] rounded-t-[32px] md:rounded-[40px] shadow-2xl overflow-hidden animate-fade-up md:animate-scale-in flex flex-col h-[85vh] md:max-h-[92vh]">
                <div className="relative h-40 md:h-56 shrink-0 overflow-hidden bg-stone-100 group">
                    {details.heroImage ? (
                        <>
                            <img src={details.heroImage} className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f7] via-transparent to-black/20" />
                        </>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-sage/20 via-white to-stone-100 opacity-80 flex items-center justify-center">
                            <button className="flex flex-col items-center gap-2 text-stone-400 hover:text-sage transition-colors p-4 rounded-xl hover:bg-white/50 backdrop-blur-sm">
                                <Camera size={24} />
                                <span className="text-xs font-bold uppercase tracking-widest">Add Cover</span>
                            </button>
                        </div>
                    )}
                    <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/50 hover:bg-white backdrop-blur-md rounded-full transition-colors text-text-primary shadow-sm z-10">
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-4 left-6 right-6 md:bottom-6 md:left-8 md:right-8">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[10px] md:text-xs font-bold text-text-muted uppercase tracking-widest mb-1 shadow-black/5 mix-blend-multiply">Dec {day}</p>
                                <h2 className="font-serif text-2xl md:text-4xl text-text-primary">{data?.aiTitle || 'Empty Page'}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-4">
                    {data ? (
                        <>
                            <div className="bg-white border border-stone-100 p-5 rounded-3xl shadow-sm mb-8 flex gap-4">
                                <div className="mt-1"><Sparkles size={18} className="text-sage" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-sage uppercase tracking-wider mb-1">Daily Synthesis</p>
                                    <p className="text-sm text-text-secondary leading-relaxed font-light">{details.summary}</p>
                                </div>
                            </div>
                            <div className="space-y-6 relative">
                                <div className="absolute left-[51px] md:left-[59px] top-4 bottom-4 w-px bg-stone-200" />
                                {details.timeline.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 md:gap-6 group cursor-pointer animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="flex flex-col items-end w-10 md:w-12 shrink-0">
                                            <div className="text-[10px] font-bold text-stone-400 pt-3">{item.time.split(' ')[0]}</div>
                                        </div>
                                        <div className="relative flex-1 bg-white p-4 rounded-2xl border border-transparent shadow-sm hover:shadow-card-hover hover:border-stone-100 transition-all">
                                            <div className="flex items-start gap-3 md:gap-4">
                                                <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                                                    bg-stone-50 text-sage-dark
                                                `}>
                                                    {item.type === 'voice' ? <Mic size={14} /> : item.type === 'image' ? <ImageIcon size={14} /> : <FileText size={14} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-text-primary text-sm truncate">{item.title}</h4>
                                                    {item.type === 'text' && <p className="text-xs text-text-secondary mt-1 truncate font-light">{item.preview}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 flex flex-col items-center">
                            <p className="text-text-secondary mb-6">No memories captured for this day.</p>
                            <button onClick={() => onChangeView(ViewState.EDITOR, { prompt: `Entry for Dec ${day}` })} className="px-6 py-3 bg-text-primary text-white rounded-full font-medium">Start Writing</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const ThreadsView = ({ onChangeView }: any) => (
    <div className="space-y-4 max-w-3xl mx-auto">
        {[
            { title: "Career Decision", desc: "Weighing the pros, cons, and gut feelings about the new role offer.", count: 8, updated: "Today", id: "career" },
            { title: "Relationships", desc: "Reflections on family dynamics and friendships.", count: 12, updated: "Yesterday", id: "relationships" },
            { title: "Personal Growth", desc: "Tracking habits, reading notes, and general self-improvement.", count: 4, updated: "Dec 14", id: "growth" }
        ].map((thread, i) => (
            <div key={thread.id} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <ThreadCard 
                    title={thread.title} 
                    desc={thread.desc}
                    count={thread.count} 
                    updated={thread.updated} 
                    onClick={() => onChangeView(ViewState.THREAD_DETAIL, { id: thread.id, title: thread.title })} 
                />
            </div>
        ))}
    </div>
);

const ReflectionsView = ({ onChangeView }: any) => {
    const activeJourneys = [
        { id: '1', title: '7 Days of Clarity', currentDay: 3, totalDays: 7, progress: 42, nextStep: 'Day 3: The Noise', color: 'sage' },
    ];
    const pastReflections = [
        { id: '101', title: 'Day 1: What matters?', journey: '7 Days of Clarity', date: 'Dec 14', preview: 'The things that matter most are usually the ones I ignore...' },
        { id: '102', title: 'Day 2: Letting go', journey: '7 Days of Clarity', date: 'Dec 15', preview: 'Hardest part is admitting that I hold onto things for comfort.' },
    ];
    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <section className="animate-fade-up">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 pl-1">In Progress</h3>
                <div className="grid grid-cols-1 gap-4">
                {activeJourneys.map(journey => (
                    <div 
                    key={journey.id}
                    onClick={() => onChangeView(ViewState.JOURNEY_DETAIL, { id: journey.id, title: journey.title })}
                    className="bg-white p-5 rounded-[24px] border border-stone-200 shadow-sm hover:shadow-card-hover transition-all cursor-pointer flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-full bg-sage-subtle flex items-center justify-center text-sage relative shrink-0">
                            <svg className="absolute inset-0 -rotate-90" width="56" height="56">
                                <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-100" />
                                <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="150" strokeDashoffset={150 - (150 * journey.progress) / 100} className="text-sage transition-all duration-1000" />
                            </svg>
                            <Play size={18} fill="currentColor" className="ml-0.5" />
                        </div>
                        <div>
                            <h4 className="font-serif text-lg text-text-primary mb-0.5">{journey.title}</h4>
                            <p className="text-xs text-text-secondary">{journey.nextStep}</p>
                        </div>
                        </div>
                        <div className="hidden md:block px-4 py-2 bg-stone-50 rounded-full text-xs font-bold text-text-muted uppercase tracking-wide group-hover:bg-sage group-hover:text-white transition-colors">
                        Resume
                        </div>
                    </div>
                ))}
                </div>
            </section>
            <section className="animate-fade-up" style={{ animationDelay: '200ms' }}>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 pl-1">Past Reflections</h3>
                <div className="space-y-3">
                {pastReflections.map(reflection => (
                    <div key={reflection.id} className="bg-white p-5 rounded-2xl border border-transparent shadow-sm hover:border-sage/10 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                        <h4 className="font-serif text-lg text-text-primary">{reflection.title}</h4>
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wide">{reflection.date}</span>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed mb-3">{reflection.preview}</p>
                        <div className="flex items-center gap-2">
                        <Map size={12} className="text-sage" />
                        <span className="text-xs font-medium text-sage">{reflection.journey}</span>
                        </div>
                    </div>
                ))}
                </div>
            </section>
        </div>
    );
};

// Refined Horizontal Thread Card
const ThreadCard = ({ title, desc, count, updated, onClick }: any) => (
  <div onClick={onClick} className="group bg-white p-5 rounded-[24px] border border-stone-200 shadow-sm hover:shadow-card-hover hover:border-sage/20 transition-all duration-300 cursor-pointer flex items-center gap-6">
     <div className="w-12 h-12 rounded-2xl bg-stone-50 text-text-muted flex items-center justify-center shrink-0 group-hover:bg-sage-subtle group-hover:text-sage transition-colors">
        <GitBranch strokeWidth={1.5} size={20} />
     </div>
     
     <div className="flex-1 min-w-0 text-left">
         <div className="flex items-center justify-between mb-1">
             <h4 className="font-serif text-lg text-text-primary group-hover:text-sage-dark transition-colors">{title}</h4>
             <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-50 px-2 py-1 rounded-lg">Last: {updated}</span>
         </div>
         <p className="text-sm text-text-secondary font-light truncate">{desc}</p>
     </div>
     
     <div className="hidden sm:flex flex-col items-center justify-center pl-6 border-l border-stone-100">
         <span className="font-serif text-lg text-text-primary leading-none">{count}</span>
         <span className="text-[9px] font-bold text-text-muted uppercase tracking-wide mt-1">Entries</span>
     </div>
  </div>
)

export default Journal;
