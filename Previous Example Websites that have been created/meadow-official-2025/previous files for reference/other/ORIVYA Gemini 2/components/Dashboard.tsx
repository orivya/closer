import React, { useState } from 'react';
import { 
  Plus, Home, BookOpen, LayoutGrid, Sparkles, Settings, 
  Search, Mic, ChevronRight, Activity, Calendar, 
  Brain, BarChart3, Cloud, Layers, Code, ArrowLeft, Compass,
  MessageSquare, Lightbulb, TrendingUp, MoreHorizontal, PenTool
} from 'lucide-react';

interface DashboardProps {
  onOpenDevMode: () => void;
}

type ViewState = 'home' | 'journal' | 'explore' | 'insights' | 'spaces' | 'editor' | 'thread-detail' | 'space-mirror' | 'space-decision' | 'space-voice';
type JournalTab = 'notes' | 'threads' | 'reflections';

export default function Dashboard({ onOpenDevMode }: DashboardProps) {
  const [activeView, setActiveView] = useState<ViewState>('home');
  const [journalTab, setJournalTab] = useState<JournalTab>('notes');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  const navigateTo = (view: ViewState) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  const navigateToJournal = (tab: JournalTab) => {
    setJournalTab(tab);
    navigateTo('journal');
  };

  // --- Premium Sub-components ---

  const SidebarItem = ({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
        isActive 
          ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' 
          : 'text-text-secondary hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={18} className={`transition-colors ${isActive ? 'text-sage' : 'text-text-tertiary group-hover:text-sage-light'}`} />
      <span>{label}</span>
      {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-sage shadow-[0_0_8px_rgba(125,155,138,0.6)]"></div>}
    </button>
  );

  const NoteCard = ({ title, preview, date, tag, onClick }: any) => (
    <div 
      onClick={onClick || (() => navigateTo('editor'))}
      className="group cursor-pointer relative overflow-hidden rounded-2xl bg-white/5 p-6 transition-all duration-500 hover:bg-white/10 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 transition-opacity group-hover:opacity-100">
        <ArrowLeft size={16} className="rotate-[135deg] text-sage" />
      </div>
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">{date}</span>
        {tag && (
          <span className="inline-flex items-center rounded-full bg-sage-subtle px-2.5 py-0.5 text-[10px] font-medium text-sage">
            {tag}
          </span>
        )}
      </div>
      <h3 className="mb-2 font-serif text-xl font-light text-white group-hover:text-sage-light">{title}</h3>
      <p className="line-clamp-2 text-sm leading-relaxed text-text-secondary">{preview}</p>
    </div>
  );

  const ThreadCard = ({ title, count, date, colorClass, onClick }: any) => (
    <div 
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-5 rounded-2xl bg-white/5 p-5 transition-all duration-300 hover:bg-white/10"
    >
      <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colorClass} text-white shadow-lg`}>
        <Layers size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="truncate font-serif text-lg text-white group-hover:text-sage-light transition-colors">{title}</h3>
          <span className="font-mono text-xs text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity">Open</span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5"><div className="h-1 w-1 rounded-full bg-sage"></div> {count} entries</span>
          <span className="text-text-tertiary">•</span>
          <span>Updated {date}</span>
        </div>
      </div>
    </div>
  );

  const InsightCard = ({ title, body, date, type }: any) => (
    <div className="group relative overflow-hidden rounded-3xl bg-white/5 p-8 transition-all hover:bg-white/[0.07]">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sage-glow blur-[60px] opacity-0 transition-opacity group-hover:opacity-100"></div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sage ring-1 ring-white/10">
          <Sparkles size={18} />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">{date}</span>
      </div>
      <h3 className="mb-3 font-serif text-2xl text-white">{title}</h3>
      <p className="text-sm font-light leading-relaxed text-text-secondary">{body}</p>
    </div>
  );

  const JourneyCard = ({ title, desc, days, colorClass }: any) => (
    <div className="group cursor-pointer overflow-hidden rounded-3xl bg-white/5 p-1 transition-all hover:bg-white/10">
      <div className="relative h-32 overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-transparent p-6">
        <div className={`absolute right-4 top-4 h-12 w-12 rounded-full opacity-20 blur-xl ${colorClass.replace('text-', 'bg-')}`}></div>
        <div className={`font-mono text-[10px] uppercase tracking-widest ${colorClass}`}>Journey</div>
        <h3 className="mt-2 font-serif text-2xl text-white">{title}</h3>
      </div>
      <div className="p-6">
        <p className="mb-6 text-sm leading-relaxed text-text-secondary">{desc}</p>
        <div className="flex items-center gap-4 border-t border-white/5 pt-4 text-xs font-medium text-text-tertiary">
          <span className="flex items-center gap-1.5"><Calendar size={14}/> {days} Days</span>
          <span className="flex items-center gap-1.5"><Activity size={14}/> Guided</span>
        </div>
      </div>
    </div>
  );

  const SpaceCard = ({ title, desc, icon: Icon, colorClass, onClick }: any) => (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white/5 p-8 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1"
    >
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-2xl transition-all group-hover:opacity-20 ${colorClass.replace('text-', 'bg-')}`}></div>
      <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-white ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon size={32} className={colorClass} />
      </div>
      <h3 className="mb-2 font-serif text-2xl text-white">{title}</h3>
      <p className="text-sm font-light leading-relaxed text-text-secondary">{desc}</p>
      <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100">
        <span>Enter Space</span>
        <ArrowLeft size={12} className="rotate-180" />
      </div>
    </div>
  );

  const PromptCard = ({ category, text }: { category: string, text: string }) => (
    <div 
      onClick={() => navigateTo('editor')}
      className="group cursor-pointer rounded-2xl bg-white/5 p-6 transition-all hover:bg-white/10 hover:-translate-y-1"
    >
      <div className="mb-4 text-[10px] font-bold uppercase tracking-widest text-text-tertiary">{category}</div>
      <p className="font-serif text-lg text-white group-hover:text-sage-light transition-colors">{text}</p>
      <div className="mt-6 flex items-center gap-2 text-xs font-medium text-sage opacity-0 transition-opacity group-hover:opacity-100">
        <PenTool size={12} />
        <span>Write about this</span>
      </div>
    </div>
  );

  // --- Views ---

  const HomeView = () => (
    <div className="animate-fade-in space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-widest text-sage">
              <div className="h-1.5 w-1.5 rounded-full bg-sage animate-pulse"></div>
              <span>Tuesday, Oct 24</span>
            </div>
            <h1 className="text-balance font-serif text-5xl font-light text-white md:text-6xl lg:text-7xl">
              Good evening, <span className="text-sage-light">Sarah</span>
            </h1>
          </div>
          <button 
            onClick={() => navigateTo('editor')}
            className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-bg-base transition-all hover:scale-105 hover:bg-sage-light"
          >
            <span className="relative z-10 flex items-center gap-2 font-semibold">
              <Plus size={20} />
              <span>New Entry</span>
            </span>
          </button>
        </div>
        
        {/* Ambient Glow */}
        <div className="absolute -left-20 -top-20 z-0 h-[500px] w-[500px] rounded-full bg-sage-subtle opacity-20 blur-[120px] pointer-events-none"></div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Daily Spark - Featured */}
        <div className="group relative col-span-1 overflow-hidden rounded-3xl bg-sage-dark/20 p-8 ring-1 ring-white/10 transition-all hover:ring-sage/30 md:col-span-2 lg:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-sage/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="mb-4 flex items-center gap-2 text-sage-light">
              <Lightbulb size={20} />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-text-tertiary">Daily Spark</span>
            </div>
            <div>
              <h2 className="text-balance font-serif text-3xl font-light leading-tight text-white">
                "What is a small promise you can make to yourself today, and actually keep?"
              </h2>
              <button 
                onClick={() => navigateTo('editor')}
                className="mt-6 flex items-center gap-2 text-sm font-medium text-sage hover:text-white transition-colors"
              >
                <span>Answer this</span>
                <ArrowLeft size={16} className="rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats - Vertical Stack */}
        <div className="col-span-1 flex flex-col gap-6 md:col-span-1">
          <div onClick={() => navigateToJournal('notes')} className="cursor-pointer flex-1 rounded-3xl bg-white/5 p-6 transition-all hover:bg-white/10 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <BookOpen size={24} className="text-text-secondary" />
              <span className="font-mono text-3xl text-white">24</span>
            </div>
            <div className="mt-2 text-sm text-text-tertiary">Total Entries</div>
          </div>
          <div onClick={() => navigateTo('insights')} className="cursor-pointer flex-1 rounded-3xl bg-white/5 p-6 transition-all hover:bg-white/10 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <TrendingUp size={24} className="text-text-secondary" />
              <span className="font-mono text-3xl text-sage">12</span>
            </div>
            <div className="mt-2 text-sm text-text-tertiary">Day Streak</div>
          </div>
        </div>

        {/* Recent Thread - Large Card */}
        <div onClick={() => navigateToJournal('threads')} className="group col-span-1 cursor-pointer rounded-3xl bg-white/5 p-8 transition-all hover:bg-white/10 md:col-span-3 lg:col-span-1">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white ring-1 ring-white/10">
            <Layers size={24} />
          </div>
          <h3 className="mb-2 font-serif text-xl text-white">Active Threads</h3>
          <p className="text-sm text-text-secondary">3 active conversations with yourself.</p>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-func-coral"></div>
              <span className="text-sm text-text-primary">Career Decision</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
              <div className="h-2 w-2 rounded-full bg-func-purple"></div>
              <span className="text-sm text-text-primary">Relationships</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Spaces */}
      <section>
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-serif text-2xl text-white">Spaces</h2>
          <button onClick={() => navigateTo('spaces')} className="text-xs font-bold uppercase tracking-widest text-text-tertiary hover:text-white transition-colors">View all</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div onClick={() => navigateTo('space-mirror')} className="group cursor-pointer rounded-2xl bg-white/5 p-6 transition-all hover:bg-sage/10">
            <Sparkles size={24} className="mb-4 text-sage" />
            <h3 className="font-medium text-white">The Mirror</h3>
            <p className="text-sm text-text-tertiary group-hover:text-text-secondary">Reflect on patterns.</p>
          </div>
          <div onClick={() => navigateTo('space-decision')} className="group cursor-pointer rounded-2xl bg-white/5 p-6 transition-all hover:bg-func-amber/10">
            <Brain size={24} className="mb-4 text-func-amber" />
            <h3 className="font-medium text-white">Decision Lab</h3>
            <p className="text-sm text-text-tertiary group-hover:text-text-secondary">Weigh your options.</p>
          </div>
          <div onClick={() => navigateTo('space-voice')} className="group cursor-pointer rounded-2xl bg-white/5 p-6 transition-all hover:bg-func-coral/10">
            <Mic size={24} className="mb-4 text-func-coral" />
            <h3 className="font-medium text-white">Voice Notes</h3>
            <p className="text-sm text-text-tertiary group-hover:text-text-secondary">Speak your mind.</p>
          </div>
        </div>
      </section>
    </div>
  );

  const JournalView = () => (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h1 className="font-serif text-4xl text-white md:text-5xl">Journal</h1>
        
        {/* Floating Tab Switcher */}
        <div className="flex gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/5">
          {[
            { id: 'notes', label: 'Notes' },
            { id: 'threads', label: 'Threads' },
            { id: 'reflections', label: 'Reflections' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setJournalTab(tab.id as JournalTab)}
              className={`rounded-full px-6 py-2 text-xs font-medium transition-all duration-300 ${
                journalTab === tab.id 
                  ? 'bg-sage text-white shadow-lg' 
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {journalTab === 'notes' && (
          <div className="space-y-8">
            <div>
              <div className="mb-4 flex items-center gap-4">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-text-tertiary">This Week</span>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <NoteCard title="Should I take the new role?" preview="I've been thinking about whether I should take the new role. More money, more responsibility..." date="Today" tag="Career" />
                <NoteCard title="Morning clarity" preview="Woke up with this thought about how clarity comes when you stop forcing it..." date="Yesterday" tag="Growth" />
                <NoteCard title="Conversation with Mom" preview="We finally talked about what happened last summer. It wasn't easy, but I'm glad we did..." date="Dec 12" tag="Family" />
              </div>
            </div>
            
            <div>
              <div className="mb-4 flex items-center gap-4">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-text-tertiary">November</span>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <NoteCard title="Feeling stuck" preview="Everything feels like it's moving through molasses lately." date="Nov 28" />
                <NoteCard title="Idea for the project" preview="What if we combined the two features into one seamless flow?" date="Nov 15" tag="Work" />
              </div>
            </div>
          </div>
        )}

        {journalTab === 'threads' && (
          <div className="space-y-4 max-w-3xl">
            <ThreadCard 
              title="Career Decision" 
              count={8} 
              date="Today" 
              colorClass="from-func-coral to-pink-600"
              onClick={() => { setSelectedThread('Career Decision'); navigateTo('thread-detail'); }}
            />
            <ThreadCard 
              title="Relationships" 
              count={12} 
              date="Yesterday"
              colorClass="from-func-purple to-indigo-600"
              onClick={() => { setSelectedThread('Relationships'); navigateTo('thread-detail'); }}
            />
            <ThreadCard 
              title="Personal Growth" 
              count={4} 
              date="Dec 5"
              colorClass="from-func-blue to-cyan-600"
              onClick={() => { setSelectedThread('Personal Growth'); navigateTo('thread-detail'); }}
            />
          </div>
        )}

        {journalTab === 'reflections' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <InsightCard 
              date="Dec 10-16"
              title="Finding your voice"
              body="Your entries this week show more confidence in expressing opinions. You mentioned 'speaking up' three times, and your writing feels more assertive."
            />
            <InsightCard 
              date="Dec 3-9"
              title="Boundaries are a theme"
              body="This week had several entries about setting limits — with work, family, and yourself. There seems to be a growing awareness of what you need."
            />
            <InsightCard 
              date="November"
              title="Navigating uncertainty"
              body="Your entries revealed a tension between wanting certainty and accepting that some things can't be controlled."
            />
          </div>
        )}
      </div>
    </div>
  );

  const ThreadDetailView = () => (
    <div className="animate-fade-in flex flex-col h-full pb-20 max-w-4xl mx-auto">
      <div className="mb-10 flex items-start gap-6">
        <button onClick={() => navigateToJournal('threads')} className="group mt-1 rounded-full p-2 hover:bg-white/10 transition-colors">
          <ArrowLeft size={24} className="text-text-tertiary group-hover:text-white" />
        </button>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-4xl text-white">{selectedThread || 'Thread'}</h1>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-sage">Active</span>
          </div>
          <p className="text-text-secondary">Connecting 8 notes over 3 weeks.</p>
        </div>
      </div>

      <div className="relative border-l border-white/10 ml-6 space-y-12 pl-12 pb-12">
        {[
          { title: "The offer came in", date: "Today, 2:34 PM", preview: "Just got off the call. They want me for the director role. I should be excited, but all I feel is this heavy uncertainty..." },
          { title: "What security means", date: "Dec 12", preview: "I keep using the word 'security' but I'm not sure I know what that means anymore. Is it money? Stability? Something else?" },
          { title: "Talking to Marcus", date: "Dec 8", preview: "Had coffee with Marcus today. He made a good point — sometimes the 'safe' choice isn't actually safe at all..." },
          { title: "Initial thoughts", date: "Nov 28", preview: "Saw the posting today. My gut reaction was fear, which is interesting." }
        ].map((note, i) => (
          <div key={i} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[55px] top-6 h-3 w-3 rounded-full bg-bg-base ring-2 ring-sage group-hover:bg-sage transition-colors shadow-[0_0_0_4px_#030304]"></div>
            
            <div onClick={() => navigateTo('editor')} className="cursor-pointer rounded-2xl bg-white/5 p-6 transition-all hover:bg-white/10 hover:translate-x-1">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-serif text-xl text-white">{note.title}</h3>
                <span className="font-mono text-xs text-text-tertiary">{note.date}</span>
              </div>
              <p className="text-sm leading-relaxed text-text-secondary group-hover:text-text-primary transition-colors">
                {note.preview}
              </p>
            </div>
          </div>
        ))}
        
        {/* Add Entry Button aligned with timeline */}
        <div className="relative">
           <div className="absolute -left-[55px] top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-bg-base ring-2 ring-text-tertiary shadow-[0_0_0_4px_#030304]"></div>
           <button onClick={() => navigateTo('editor')} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 py-8 text-sm font-medium text-text-tertiary hover:border-sage hover:text-sage transition-all">
            <Plus size={18} />
            <span>Add to this thread</span>
          </button>
        </div>
      </div>
    </div>
  );

  const ExploreView = () => (
    <div className="animate-fade-in pb-20">
      <div className="mb-12">
        <h1 className="font-serif text-4xl text-white md:text-5xl">Explore</h1>
        <p className="mt-4 max-w-xl text-lg text-text-secondary">Guided journeys and writing prompts to help you dig deeper.</p>
      </div>

      <section className="mb-16">
        <div className="mb-6 flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">Featured Journeys</h2>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <JourneyCard 
            title="7 Days of Clarity" 
            desc="Cut through mental noise and reconnect with what matters." 
            days={7} 
            colorClass="text-func-purple" 
          />
          <JourneyCard 
            title="Letting Go" 
            desc="Release what's holding you back and make space for new growth." 
            days={5} 
            colorClass="text-func-blue" 
          />
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">Prompt Library</h2>
          <div className="h-px flex-1 bg-white/5"></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PromptCard category="Self-Discovery" text="What is a belief you hold that might be limiting you right now?" />
          <PromptCard category="Relationships" text="Who in your life makes you feel most like yourself?" />
          <PromptCard category="Career" text="If failure wasn't an option, what would you attempt?" />
          <PromptCard category="Mindfulness" text="Describe this exact moment using all five senses." />
          <PromptCard category="Growth" text="What's a mistake you made recently that you're grateful for?" />
          <PromptCard category="Evening" text="What was the best part of today?" />
        </div>
      </section>
    </div>
  );

  const InsightsView = () => (
    <div className="animate-fade-in pb-20">
      <div className="mb-12">
        <h1 className="font-serif text-4xl text-white md:text-5xl">Insights</h1>
        <p className="mt-4 max-w-xl text-lg text-text-secondary">Patterns and analytics from your writing.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Mood Chart */}
        <div className="rounded-3xl bg-white/5 p-8">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="font-serif text-2xl text-white">Mood Flow</h3>
            <select className="rounded-lg bg-black/20 px-3 py-1.5 text-xs text-text-secondary outline-none ring-1 ring-white/10 focus:ring-sage">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex h-48 items-end justify-between gap-4">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="group relative flex w-full flex-col justify-end gap-3">
                <div 
                  className="w-full rounded-2xl bg-gradient-to-t from-sage/20 to-sage/60 transition-all duration-500 group-hover:to-sage"
                  style={{ height: `${h}%` }}
                ></div>
                <span className="text-center font-mono text-xs text-text-tertiary">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col justify-center rounded-3xl bg-white/5 p-8 text-center transition-transform hover:scale-[1.02]">
            <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-sage">
              <TrendingUp size={24} />
            </div>
            <div className="font-serif text-4xl text-white">12</div>
            <div className="mt-2 text-xs font-bold uppercase tracking-widest text-text-tertiary">Day Streak</div>
          </div>
          <div className="flex flex-col justify-center rounded-3xl bg-white/5 p-8 text-center transition-transform hover:scale-[1.02]">
            <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-sage">
              <BookOpen size={24} />
            </div>
            <div className="font-serif text-4xl text-white">247</div>
            <div className="mt-2 text-xs font-bold uppercase tracking-widest text-text-tertiary">Total Entries</div>
          </div>
          <div className="flex flex-col justify-center rounded-3xl bg-white/5 p-8 text-center transition-transform hover:scale-[1.02]">
            <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-sage">
              <Code size={24} />
            </div>
            <div className="font-serif text-4xl text-white">48k</div>
            <div className="mt-2 text-xs font-bold uppercase tracking-widest text-text-tertiary">Words</div>
          </div>
          <div className="flex flex-col justify-center rounded-3xl bg-white/5 p-8 text-center transition-transform hover:scale-[1.02]">
            <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-sage">
              <Layers size={24} />
            </div>
            <div className="font-serif text-4xl text-white">4</div>
            <div className="mt-2 text-xs font-bold uppercase tracking-widest text-text-tertiary">Active Threads</div>
          </div>
        </div>
      </div>

      {/* Top Topics */}
      <div className="mt-12">
        <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-text-muted">Top Topics</h3>
        <div className="flex flex-wrap gap-3">
          {['Career', 'Family', 'Growth', 'Anxiety', 'Creativity', 'Future', 'Health', 'Finance', 'Travel'].map(tag => (
            <span key={tag} className="cursor-default rounded-full border border-white/5 bg-white/5 px-6 py-2.5 text-sm text-text-secondary transition-all hover:bg-white/10 hover:text-white">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const SpacesView = () => (
    <div className="animate-fade-in pb-20">
      <div className="mb-12">
        <h1 className="font-serif text-4xl text-white md:text-5xl">Spaces</h1>
        <p className="mt-4 max-w-xl text-lg text-text-secondary">Specialized tools for different types of thinking.</p>
      </div>
      
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <SpaceCard 
          title="The Mirror" 
          desc="Discover patterns and insights from your writing. AI-powered reflection." 
          icon={Sparkles} 
          colorClass="text-sage"
          onClick={() => navigateTo('space-mirror')}
        />
        <SpaceCard 
          title="Decision Lab" 
          desc="Structured space for working through difficult choices using mental models." 
          icon={Brain} 
          colorClass="text-func-amber"
          onClick={() => navigateTo('space-decision')}
        />
        <SpaceCard 
          title="Voice Memos" 
          desc="Speak your mind freely. We'll handle the typing and tagging." 
          icon={Mic} 
          colorClass="text-func-coral"
          onClick={() => navigateTo('space-voice')}
        />
        <SpaceCard 
          title="Life Dashboard" 
          desc="Your personal analytics. Streaks, trends, topics, and volume over time." 
          icon={BarChart3} 
          colorClass="text-func-blue"
          onClick={() => {}} 
        />
        <SpaceCard 
          title="Connections" 
          desc="Visual graph of how your ideas, people, and events link together." 
          icon={Cloud} 
          colorClass="text-func-purple"
          onClick={() => {}}
        />
        <SpaceCard 
          title="Time Capsule" 
          desc="Write letters to your future self. Set a date and forget about it." 
          icon={Calendar} 
          colorClass="text-white"
          onClick={() => {}}
        />
      </div>
    </div>
  );

  const EditorView = () => (
    <div className="flex h-full flex-col animate-fade-in max-w-3xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <button onClick={() => navigateTo('home')} className="group flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-text-tertiary hover:bg-white/10 hover:text-white transition-all">
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Back
        </button>
        <span className="flex items-center gap-2 text-xs text-sage">
          <div className="h-1.5 w-1.5 rounded-full bg-sage animate-pulse"></div>
          Saved
        </span>
      </div>
      
      <input 
        type="text" 
        placeholder="Title your thought..." 
        className="mb-6 bg-transparent font-serif text-4xl text-white placeholder-white/20 focus:outline-none md:text-5xl"
        autoFocus
      />
      
      <textarea 
        placeholder="Start writing..." 
        className="flex-1 resize-none bg-transparent text-lg leading-loose text-text-primary placeholder-white/10 focus:outline-none"
      ></textarea>
      
      {/* Floating Toolbar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-bg-elevated/80 px-6 py-3 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-6">
           <button className="text-text-tertiary hover:text-white hover:-translate-y-0.5 transition-all" title="Record Voice"><Mic size={20}/></button>
           <button className="text-text-tertiary hover:text-white hover:-translate-y-0.5 transition-all" title="AI Assist"><Sparkles size={20}/></button>
           <button className="text-text-tertiary hover:text-white hover:-translate-y-0.5 transition-all" title="Add Image"><LayoutGrid size={20}/></button>
           <div className="h-4 w-px bg-white/10"></div>
           <button className="flex items-center gap-2 text-xs font-medium text-text-secondary hover:text-white transition-colors">
             <Layers size={14} /> <span>No Thread</span>
           </button>
        </div>
      </div>
    </div>
  );

  // --- Main Layout ---

  return (
    <div className="flex h-screen bg-bg-base text-text-primary overflow-hidden font-sans selection:bg-sage/30 selection:text-white">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-white/5 bg-bg-base transition-transform duration-500 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col p-6">
          {/* Logo */}
          <div className="mb-10 flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sage-subtle text-white ring-1 ring-white/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4 text-sage">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <span className="font-serif text-xl font-medium tracking-tight text-white">Orivya</span>
          </div>

          {/* Navigation */}
          <div className="flex-1 space-y-8 overflow-y-auto">
            <div className="space-y-1">
              <SidebarItem icon={Home} label="Home" isActive={activeView === 'home'} onClick={() => navigateTo('home')} />
              <SidebarItem icon={BookOpen} label="Journal" isActive={activeView === 'journal' || activeView === 'thread-detail'} onClick={() => navigateTo('journal')} />
              <SidebarItem icon={Compass} label="Explore" isActive={activeView === 'explore'} onClick={() => navigateTo('explore')} />
              <SidebarItem icon={Sparkles} label="Insights" isActive={activeView === 'insights'} onClick={() => navigateTo('insights')} />
              <SidebarItem icon={LayoutGrid} label="Spaces" isActive={activeView === 'spaces' || activeView.startsWith('space-')} onClick={() => navigateTo('spaces')} />
            </div>

            <div>
              <h3 className="mb-4 px-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Recent Threads</h3>
              <div className="space-y-1">
                <button onClick={() => { setSelectedThread('Career Decision'); navigateTo('thread-detail'); }} className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-text-secondary transition-all hover:bg-white/5 hover:text-white">
                  <div className="h-2 w-2 rounded-full bg-func-coral shadow-[0_0_8px_rgba(248,113,113,0.4)] transition-transform group-hover:scale-110"></div>
                  <span>Career Decision</span>
                </button>
                <button onClick={() => { setSelectedThread('Relationships'); navigateTo('thread-detail'); }} className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-text-secondary transition-all hover:bg-white/5 hover:text-white">
                  <div className="h-2 w-2 rounded-full bg-func-purple shadow-[0_0_8px_rgba(167,139,250,0.4)] transition-transform group-hover:scale-110"></div>
                  <span>Relationships</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer / Dev Mode */}
          <div className="border-t border-white/5 pt-6">
            <button 
              onClick={onOpenDevMode}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-tertiary transition-all hover:bg-white/5 hover:text-white"
            >
              <Code size={18} />
              <span>Dev Mode</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-tertiary transition-all hover:bg-white/5 hover:text-white">
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-bg-base relative">
        {/* Header (Mobile) */}
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-bg-base/80 px-4 backdrop-blur-xl lg:hidden sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-text-secondary">
            <LayoutGrid size={24} />
          </button>
          <span className="font-serif text-lg text-white">Orivya</span>
          <button className="p-2 text-text-secondary">
            <Search size={24} />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl p-6 lg:p-12">
            {activeView === 'home' && <HomeView />}
            {activeView === 'journal' && <JournalView />}
            {activeView === 'explore' && <ExploreView />}
            {activeView === 'insights' && <InsightsView />}
            {activeView === 'spaces' && <SpacesView />}
            {activeView === 'editor' && <EditorView />}
            {activeView === 'thread-detail' && <ThreadDetailView />}
            
            {(activeView === 'space-mirror' || activeView === 'space-decision' || activeView === 'space-voice') && (
              <div className="animate-fade-in h-full flex flex-col items-center justify-center text-center pt-20">
                <div className="relative mb-8">
                   <div className="absolute inset-0 animate-pulse-slow rounded-full bg-sage blur-3xl opacity-20"></div>
                   <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/5 text-white ring-1 ring-white/10 shadow-2xl">
                      {activeView === 'space-mirror' && <Sparkles size={48} className="text-sage" />}
                      {activeView === 'space-decision' && <Brain size={48} className="text-func-amber" />}
                      {activeView === 'space-voice' && <Mic size={48} className="text-func-coral" />}
                   </div>
                </div>
                <h2 className="mb-4 font-serif text-4xl text-white">
                  {activeView === 'space-mirror' && 'The Mirror'}
                  {activeView === 'space-decision' && 'Decision Lab'}
                  {activeView === 'space-voice' && 'Voice Memos'}
                </h2>
                <p className="mb-12 max-w-md text-lg text-text-secondary">
                  This space is designed to help you think differently.
                </p>
                <button onClick={() => navigateTo('spaces')} className="group flex items-center gap-2 rounded-full bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all">
                  <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
                  Back to Spaces
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}