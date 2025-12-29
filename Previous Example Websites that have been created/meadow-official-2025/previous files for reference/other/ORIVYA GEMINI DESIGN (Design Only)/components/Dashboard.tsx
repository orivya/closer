import React, { useState } from 'react';
import { 
  Plus, Home, BookOpen, LayoutGrid, Sparkles, Settings, 
  Search, Mic, ChevronRight, Activity, Calendar, 
  Brain, BarChart3, Cloud, Layers, Code, ArrowLeft, Compass,
  MessageSquare, Lightbulb, TrendingUp, MoreHorizontal
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

  // --- Sub-components ---

  const SidebarItem = ({ icon: Icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
        isActive 
          ? 'bg-sage-subtle text-sage-light' 
          : 'text-text-secondary hover:bg-bg-surface hover:text-white'
      }`}
    >
      <Icon size={18} className={isActive ? 'text-sage' : 'text-text-tertiary'} />
      <span>{label}</span>
    </button>
  );

  const NoteCard = ({ title, preview, date, tag, onClick }: any) => (
    <div 
      onClick={onClick || (() => navigateTo('editor'))}
      className="group cursor-pointer rounded-2xl border border-border-subtle bg-bg-surface p-5 transition-all hover:border-border-default hover:bg-bg-hover"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-text-tertiary">{date}</span>
        {tag && (
          <span className="flex items-center gap-1 rounded-full bg-sage-subtle px-2 py-0.5 text-[10px] font-medium text-sage">
            <div className="h-1 w-1 rounded-full bg-sage"></div>
            {tag}
          </span>
        )}
      </div>
      <h3 className="mb-1 font-serif text-lg text-white group-hover:text-sage-light">{title}</h3>
      <p className="line-clamp-2 text-sm text-text-secondary">{preview}</p>
    </div>
  );

  const ThreadCard = ({ title, count, date, onClick }: any) => (
    <div 
      onClick={onClick}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-border-subtle bg-bg-surface p-4 transition-all hover:border-border-default hover:bg-bg-hover"
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-sage-subtle text-sage">
        <Layers size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium text-white group-hover:text-sage-light transition-colors">{title}</h3>
          <span className="flex h-5 items-center justify-center rounded-full bg-bg-elevated px-2 text-[10px] text-text-tertiary border border-border-subtle">{count}</span>
        </div>
        <p className="text-xs text-text-tertiary">Updated {date}</p>
      </div>
      <ChevronRight size={16} className="text-text-muted opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );

  const InsightCard = ({ title, body, date }: any) => (
    <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-6 transition-all hover:border-sage-muted">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-subtle text-sage">
          <Sparkles size={16} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-sage">{date}</span>
      </div>
      <h3 className="mb-2 font-serif text-xl text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-text-secondary">{body}</p>
    </div>
  );

  const JourneyCard = ({ title, desc, days, colorClass }: any) => (
    <div className="cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-6 transition-all hover:border-border-default hover:bg-bg-hover group">
      <div className={`mb-4 w-fit rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${colorClass} bg-opacity-10`}>
        Journey
      </div>
      <h3 className="mb-2 font-serif text-lg text-white group-hover:text-sage-light transition-colors">{title}</h3>
      <p className="mb-4 text-sm text-text-secondary">{desc}</p>
      <div className="flex items-center gap-4 text-xs text-text-tertiary">
        <span className="flex items-center gap-1"><Calendar size={12}/> {days} Days</span>
        <span className="flex items-center gap-1"><Activity size={12}/> Guided</span>
      </div>
    </div>
  );

  const PromptCard = ({ category, text }: any) => (
    <div 
      onClick={() => navigateTo('editor')}
      className="cursor-pointer rounded-2xl border border-border-subtle bg-bg-surface p-6 transition-all hover:border-sage-muted hover:bg-bg-hover"
    >
      <span className="mb-3 block text-xs font-medium uppercase tracking-wider text-text-tertiary">{category}</span>
      <p className="font-serif text-lg leading-relaxed text-white">"{text}"</p>
      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-sage opacity-0 transition-opacity group-hover:opacity-100">
        <span>Write about this</span>
        <ArrowLeft size={12} className="rotate-180" />
      </div>
    </div>
  );

  // --- Views ---

  const HomeView = () => (
    <div className="animate-fade-in space-y-10 pb-20">
      {/* Cleaner Hero */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="text-sm font-medium text-sage">Tuesday, Oct 24</div>
          <h1 className="font-serif text-4xl text-white md:text-5xl">
            Good evening, <span className="text-sage-light">Sarah</span>
          </h1>
        </div>
        <button 
          onClick={() => navigateTo('editor')}
          className="group flex items-center gap-3 rounded-full bg-sage px-6 py-3 font-semibold text-white transition-all hover:bg-sage-dark hover:shadow-[0_0_20px_rgba(125,155,138,0.3)]"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      {/* Quick Access Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button onClick={() => navigateToJournal('notes')} className="group flex flex-col justify-between rounded-2xl border border-border-subtle bg-bg-surface p-5 text-left transition-all hover:border-border-default hover:bg-bg-hover">
          <BookOpen size={24} className="mb-4 text-text-tertiary group-hover:text-sage" />
          <div>
            <div className="text-sm font-medium text-text-secondary">Journal</div>
            <div className="font-serif text-xl text-white">24 Entries</div>
          </div>
        </button>
        <button onClick={() => navigateToJournal('threads')} className="group flex flex-col justify-between rounded-2xl border border-border-subtle bg-bg-surface p-5 text-left transition-all hover:border-border-default hover:bg-bg-hover">
          <Layers size={24} className="mb-4 text-text-tertiary group-hover:text-sage" />
          <div>
            <div className="text-sm font-medium text-text-secondary">Threads</div>
            <div className="font-serif text-xl text-white">3 Active</div>
          </div>
        </button>
        <button onClick={() => navigateTo('explore')} className="group flex flex-col justify-between rounded-2xl border border-border-subtle bg-bg-surface p-5 text-left transition-all hover:border-border-default hover:bg-bg-hover">
          <Compass size={24} className="mb-4 text-text-tertiary group-hover:text-sage" />
          <div>
            <div className="text-sm font-medium text-text-secondary">Explore</div>
            <div className="font-serif text-xl text-white">New Journey</div>
          </div>
        </button>
        <button onClick={() => navigateTo('insights')} className="group flex flex-col justify-between rounded-2xl border border-border-subtle bg-bg-surface p-5 text-left transition-all hover:border-border-default hover:bg-bg-hover">
          <Sparkles size={24} className="mb-4 text-text-tertiary group-hover:text-sage" />
          <div>
            <div className="text-sm font-medium text-text-secondary">Insights</div>
            <div className="font-serif text-xl text-white">Weekly Recap</div>
          </div>
        </button>
      </div>

      {/* Featured Spaces (Clean) */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">Quick Spaces</h2>
          <button onClick={() => navigateTo('spaces')} className="text-xs text-sage hover:text-white">View all</button>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <div onClick={() => navigateTo('space-mirror')} className="cursor-pointer rounded-2xl border border-border-subtle bg-gradient-to-br from-bg-surface to-bg-elevated p-6 transition-all hover:border-sage-muted hover:shadow-lg">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-sage-subtle text-sage"><Sparkles size={20}/></div>
            <h3 className="mb-1 font-serif text-lg text-white">The Mirror</h3>
            <p className="text-xs text-text-secondary">Reflect on patterns.</p>
          </div>
          <div onClick={() => navigateTo('space-decision')} className="cursor-pointer rounded-2xl border border-border-subtle bg-gradient-to-br from-bg-surface to-bg-elevated p-6 transition-all hover:border-func-amberSubtle hover:shadow-lg">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-func-amberSubtle text-func-amber"><Brain size={20}/></div>
            <h3 className="mb-1 font-serif text-lg text-white">Decision Lab</h3>
            <p className="text-xs text-text-secondary">Weigh your options.</p>
          </div>
          <div onClick={() => navigateTo('space-voice')} className="cursor-pointer rounded-2xl border border-border-subtle bg-gradient-to-br from-bg-surface to-bg-elevated p-6 transition-all hover:border-func-coralSubtle hover:shadow-lg">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-func-coralSubtle text-func-coral"><Mic size={20}/></div>
            <h3 className="mb-1 font-serif text-lg text-white">Voice Notes</h3>
            <p className="text-xs text-text-secondary">Speak your mind.</p>
          </div>
        </div>
      </section>

      {/* Daily Spark */}
      <section>
        <div className="rounded-3xl border border-sage-muted bg-sage-subtle/30 p-8 md:p-10">
          <div className="mb-4 flex items-center gap-2 text-sage">
            <Lightbulb size={20} />
            <span className="text-xs font-bold uppercase tracking-wider">Daily Spark</span>
          </div>
          <h2 className="mb-6 font-serif text-2xl text-white md:text-3xl leading-relaxed">
            "What is a small promise you can make to yourself today, and actually keep?"
          </h2>
          <button 
            onClick={() => navigateTo('editor')}
            className="rounded-lg bg-sage px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-dark"
          >
            Answer this
          </button>
        </div>
      </section>
    </div>
  );

  const JournalView = () => (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl text-white">Journal</h1>
        <div className="flex gap-1 rounded-lg bg-bg-surface p-1">
          <button 
            onClick={() => setJournalTab('notes')}
            className={`rounded-md px-4 py-1.5 text-xs font-medium transition-all ${journalTab === 'notes' ? 'bg-bg-elevated text-white shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
          >
            Notes
          </button>
          <button 
            onClick={() => setJournalTab('threads')}
            className={`rounded-md px-4 py-1.5 text-xs font-medium transition-all ${journalTab === 'threads' ? 'bg-bg-elevated text-white shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
          >
            Threads
          </button>
          <button 
            onClick={() => setJournalTab('reflections')}
            className={`rounded-md px-4 py-1.5 text-xs font-medium transition-all ${journalTab === 'reflections' ? 'bg-bg-elevated text-white shadow-sm' : 'text-text-tertiary hover:text-text-secondary'}`}
          >
            Reflections
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {journalTab === 'notes' && (
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">This Week</div>
            <NoteCard title="Should I take the new role?" preview="I've been thinking about whether I should take the new role. More money, more responsibility..." date="Today, 2:34 PM" tag="Career" />
            <NoteCard title="Morning clarity" preview="Woke up with this thought about how clarity comes when you stop forcing it..." date="Yesterday" tag="Growth" />
            <NoteCard title="The conversation with Mom" preview="We finally talked about what happened last summer. It wasn't easy, but I'm glad we did..." date="Dec 12" tag="Family" />
            
            <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 mt-8">Last Month</div>
            <NoteCard title="Feeling stuck" preview="Everything feels like it's moving through molasses lately." date="Nov 28" />
            <NoteCard title="Idea for the project" preview="What if we combined the two features into one seamless flow?" date="Nov 15" tag="Work" />
          </div>
        )}

        {journalTab === 'threads' && (
          <div className="space-y-4">
            <ThreadCard 
              title="Career Decision" 
              count={8} 
              date="Today" 
              onClick={() => { setSelectedThread('Career Decision'); navigateTo('thread-detail'); }}
            />
            <ThreadCard 
              title="Relationships" 
              count={12} 
              date="Yesterday"
              onClick={() => { setSelectedThread('Relationships'); navigateTo('thread-detail'); }}
            />
            <ThreadCard 
              title="Personal Growth" 
              count={4} 
              date="Dec 5"
              onClick={() => { setSelectedThread('Personal Growth'); navigateTo('thread-detail'); }}
            />
          </div>
        )}

        {journalTab === 'reflections' && (
          <div className="grid gap-6 sm:grid-cols-2">
            <InsightCard 
              date="Weekly • Dec 10-16"
              title="Finding your voice"
              body="Your entries this week show more confidence in expressing opinions. You mentioned 'speaking up' three times, and your writing feels more assertive."
            />
            <InsightCard 
              date="Weekly • Dec 3-9"
              title="Boundaries are a theme"
              body="This week had several entries about setting limits — with work, family, and yourself. There seems to be a growing awareness of what you need."
            />
            <InsightCard 
              date="Monthly • November"
              title="Navigating uncertainty"
              body="Your entries revealed a tension between wanting certainty and accepting that some things can't be controlled."
            />
          </div>
        )}
      </div>
    </div>
  );

  const ThreadDetailView = () => (
    <div className="animate-fade-in flex flex-col h-full pb-20">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigateToJournal('threads')} className="rounded-full p-2 hover:bg-bg-surface transition-colors">
          <ArrowLeft size={20} className="text-text-secondary" />
        </button>
        <div>
          <h1 className="font-serif text-2xl text-white">{selectedThread || 'Thread'}</h1>
          <p className="text-xs text-text-tertiary">Connecting 8 notes</p>
        </div>
      </div>

      <div className="relative border-l border-border-subtle ml-4 space-y-8 pl-8">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[37px] top-1 h-4 w-4 rounded-full bg-bg-base border-2 border-sage"></div>
            <div onClick={() => navigateTo('editor')} className="cursor-pointer rounded-xl border border-border-subtle bg-bg-surface p-5 transition-all hover:bg-bg-hover">
              <span className="mb-2 block text-xs font-medium text-text-tertiary">Dec {16 - i * 2}, 2024</span>
              <h3 className="mb-2 font-serif text-lg text-white">Entry title {i + 1}</h3>
              <p className="text-sm text-text-secondary">
                This is a preview of the note content that relates to this thread. It connects back to the previous thoughts...
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <button onClick={() => navigateTo('editor')} className="flex items-center gap-2 text-sm font-medium text-sage hover:text-white transition-colors">
          <Plus size={16} />
          Add to this thread
        </button>
      </div>
    </div>
  );

  const ExploreView = () => (
    <div className="animate-fade-in pb-20">
      <div className="mb-8">
        <h1 className="mb-2 font-serif text-3xl text-white">Explore</h1>
        <p className="text-text-secondary">Guided journeys and writing prompts.</p>
      </div>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">Featured Journeys</h2>
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">Prompt Library</h2>
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
      <div className="mb-8">
        <h1 className="mb-2 font-serif text-3xl text-white">Insights</h1>
        <p className="text-text-secondary">Patterns and analytics from your writing.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mood Chart */}
        <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-serif text-xl text-white">Mood Flow</h3>
            <select className="rounded-lg bg-bg-elevated px-3 py-1 text-xs text-text-secondary outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="flex h-40 items-end justify-between gap-2">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="group relative flex w-full flex-col justify-end gap-2">
                <div 
                  className="w-full rounded-md bg-sage opacity-40 transition-all group-hover:opacity-80"
                  style={{ height: `${h}%` }}
                ></div>
                <span className="text-center text-[10px] text-text-tertiary">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sage-subtle text-sage">
              <TrendingUp size={20} />
            </div>
            <div className="text-3xl font-serif text-white">12</div>
            <div className="text-xs text-text-secondary">Day Streak</div>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sage-subtle text-sage">
              <BookOpen size={20} />
            </div>
            <div className="text-3xl font-serif text-white">247</div>
            <div className="text-xs text-text-secondary">Total Entries</div>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sage-subtle text-sage">
              <Code size={20} />
            </div>
            <div className="text-3xl font-serif text-white">48k</div>
            <div className="text-xs text-text-secondary">Words Written</div>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-bg-surface p-6">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sage-subtle text-sage">
              <Layers size={20} />
            </div>
            <div className="text-3xl font-serif text-white">4</div>
            <div className="text-xs text-text-secondary">Active Threads</div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-text-muted">Top Topics</h3>
        <div className="flex flex-wrap gap-2">
          {['Career', 'Family', 'Growth', 'Anxiety', 'Creativity', 'Future', 'Health'].map(tag => (
            <span key={tag} className="rounded-full border border-border-default bg-bg-surface px-4 py-1.5 text-sm text-text-secondary transition-colors hover:border-sage hover:text-white cursor-default">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const SpacesView = () => (
    <div className="animate-fade-in pb-20">
      <div className="mb-8">
        <h1 className="mb-2 font-serif text-3xl text-white">Spaces</h1>
        <p className="text-text-secondary">Specialized tools for different types of thinking.</p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div onClick={() => navigateTo('space-mirror')} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-6 transition-all hover:-translate-y-1 hover:border-sage-muted hover:shadow-lg">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-sage/10 text-sage"><Sparkles size={28} /></div>
          <h3 className="mb-2 font-serif text-lg text-white">The Mirror</h3>
          <p className="text-sm leading-relaxed text-text-secondary">Discover patterns and insights from your writing. AI-powered reflection.</p>
        </div>
        
        <div onClick={() => navigateTo('space-decision')} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-6 transition-all hover:-translate-y-1 hover:border-func-amberSubtle hover:shadow-lg">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-func-amberSubtle text-func-amber"><Brain size={28} /></div>
          <h3 className="mb-2 font-serif text-lg text-white">Decision Lab</h3>
          <p className="text-sm leading-relaxed text-text-secondary">Structured space for working through difficult choices using mental models.</p>
        </div>
        
        <div onClick={() => navigateTo('space-voice')} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-6 transition-all hover:-translate-y-1 hover:border-func-coralSubtle hover:shadow-lg">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-func-coralSubtle text-func-coral"><Mic size={28} /></div>
          <h3 className="mb-2 font-serif text-lg text-white">Voice Memos</h3>
          <p className="text-sm leading-relaxed text-text-secondary">Speak your mind freely. We'll handle the typing and tagging.</p>
        </div>

        <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-6 transition-all hover:-translate-y-1 hover:border-func-blueSubtle hover:shadow-lg">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-func-blueSubtle text-func-blue"><BarChart3 size={28} /></div>
          <h3 className="mb-2 font-serif text-lg text-white">Life Dashboard</h3>
          <p className="text-sm leading-relaxed text-text-secondary">Your personal analytics. Streaks, trends, topics, and volume over time.</p>
        </div>

        <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-6 transition-all hover:-translate-y-1 hover:border-func-purpleSubtle hover:shadow-lg">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-func-purpleSubtle text-func-purple"><Cloud size={28} /></div>
          <h3 className="mb-2 font-serif text-lg text-white">Connections</h3>
          <p className="text-sm leading-relaxed text-text-secondary">Visual graph of how your ideas, people, and events link together.</p>
        </div>
      </div>
    </div>
  );

  const EditorView = () => (
    <div className="flex h-full flex-col animate-fade-in">
      <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-4">
        <button onClick={() => navigateTo('home')} className="flex items-center gap-2 text-xs text-text-tertiary hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        <span className="text-xs text-text-tertiary">Saving...</span>
      </div>
      <input 
        type="text" 
        placeholder="Title your thought..." 
        className="mb-4 bg-transparent font-serif text-3xl text-white placeholder-text-muted focus:outline-none"
      />
      <textarea 
        placeholder="Start writing, or tap the mic to speak..." 
        className="flex-1 resize-none bg-transparent text-lg leading-relaxed text-text-primary focus:outline-none"
      ></textarea>
      <div className="flex items-center justify-between border-t border-border-subtle pt-4 mt-4">
        <div className="flex gap-2">
           <button className="rounded-lg p-2 text-text-tertiary hover:bg-bg-surface hover:text-white transition-colors" title="Record Voice"><Mic size={20}/></button>
           <button className="rounded-lg p-2 text-text-tertiary hover:bg-bg-surface hover:text-white transition-colors" title="AI Assist"><Sparkles size={20}/></button>
           <button className="rounded-lg p-2 text-text-tertiary hover:bg-bg-surface hover:text-white transition-colors" title="Add Image"><LayoutGrid size={20}/></button>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-1.5 rounded-full bg-bg-surface px-3 py-1 text-xs text-text-secondary hover:text-white transition-colors">
             <Layers size={12} /> No Thread
           </button>
        </div>
      </div>
    </div>
  );

  // --- Main Layout ---

  return (
    <div className="flex h-screen bg-bg-base text-text-primary overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border-subtle bg-bg-elevated transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sage to-sage-dark text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-4 w-4">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <span className="ml-3 font-serif text-xl font-medium tracking-tight text-white">Orivya</span>
          </div>

          {/* Navigation */}
          <div className="flex-1 space-y-8 overflow-y-auto px-4 py-4">
            <div className="space-y-1">
              <SidebarItem icon={Home} label="Home" isActive={activeView === 'home'} onClick={() => navigateTo('home')} />
              <SidebarItem icon={BookOpen} label="Journal" isActive={activeView === 'journal' || activeView === 'thread-detail'} onClick={() => navigateTo('journal')} />
              <SidebarItem icon={Compass} label="Explore" isActive={activeView === 'explore'} onClick={() => navigateTo('explore')} />
              <SidebarItem icon={Sparkles} label="Insights" isActive={activeView === 'insights'} onClick={() => navigateTo('insights')} />
              <SidebarItem icon={LayoutGrid} label="Spaces" isActive={activeView === 'spaces' || activeView.startsWith('space-')} onClick={() => navigateTo('spaces')} />
            </div>

            <div>
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-text-muted">Recent Threads</h3>
              <div className="space-y-1">
                <button onClick={() => { setSelectedThread('Career Decision'); navigateTo('thread-detail'); }} className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm text-text-secondary hover:bg-bg-surface hover:text-white transition-colors">
                  <div className="h-1.5 w-1.5 rounded-full bg-func-coral"></div>
                  <span>Career Decision</span>
                </button>
                <button onClick={() => { setSelectedThread('Relationships'); navigateTo('thread-detail'); }} className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm text-text-secondary hover:bg-bg-surface hover:text-white transition-colors">
                  <div className="h-1.5 w-1.5 rounded-full bg-func-purple"></div>
                  <span>Relationships</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer / Dev Mode */}
          <div className="border-t border-border-subtle p-4">
            <button 
              onClick={onOpenDevMode}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-tertiary transition-all hover:bg-bg-surface hover:text-white"
            >
              <Code size={18} />
              <span>Dev Mode / GitHub</span>
            </button>
            <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-tertiary transition-all hover:bg-bg-surface hover:text-white">
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-bg-base">
        {/* Header (Mobile) */}
        <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-bg-base/80 px-4 backdrop-blur-md lg:hidden">
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
          <div className="mx-auto max-w-5xl p-6 lg:p-10">
            {activeView === 'home' && <HomeView />}
            {activeView === 'journal' && <JournalView />}
            {activeView === 'explore' && <ExploreView />}
            {activeView === 'insights' && <InsightsView />}
            {activeView === 'spaces' && <SpacesView />}
            {activeView === 'editor' && <EditorView />}
            {activeView === 'thread-detail' && <ThreadDetailView />}
            
            {(activeView === 'space-mirror' || activeView === 'space-decision' || activeView === 'space-voice') && (
              <div className="animate-fade-in h-full flex flex-col items-center justify-center text-center pt-20">
                <div className="mb-6 rounded-full bg-bg-surface p-6 ring-1 ring-border-subtle">
                   {activeView === 'space-mirror' && <Sparkles size={48} className="text-sage" />}
                   {activeView === 'space-decision' && <Brain size={48} className="text-func-amber" />}
                   {activeView === 'space-voice' && <Mic size={48} className="text-func-coral" />}
                </div>
                <h2 className="mb-2 font-serif text-3xl text-white">
                  {activeView === 'space-mirror' && 'The Mirror'}
                  {activeView === 'space-decision' && 'Decision Lab'}
                  {activeView === 'space-voice' && 'Voice Memos'}
                </h2>
                <p className="mb-8 max-w-md text-text-secondary">
                  This space is designed to help you think differently.
                </p>
                <button onClick={() => navigateTo('spaces')} className="flex items-center gap-2 text-sm text-sage hover:text-white">
                  <ArrowLeft size={16} /> Back to Spaces
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}