import React, { useState } from 'react';
import { Home as HomeIcon, Book, Compass, User, LogOut, Plus, Leaf, GitBranch, Settings } from 'lucide-react';
import { AppState, Entry, ViewState } from './types';
import { Landing } from './views/Landing';
import { Editor } from './views/Editor';
import { Home } from './views/Home';
import { Button } from './components/ui';

const PlaceholderView: React.FC<{ title: string, desc: string, icon: any }> = ({ title, desc, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center h-[70vh] text-sage-400 animate-fade-up">
    <div className="w-20 h-20 bg-white/50 border border-white rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
      <Icon size={32} strokeWidth={1.5} className="text-sage-300" />
    </div>
    <h2 className="font-serif text-3xl text-sage-900 mb-3">{title}</h2>
    <p className="text-sage-600 font-light max-w-xs text-center leading-relaxed">{desc}</p>
  </div>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentView: 'landing',
    entries: [
        { id: '1', title: 'Morning Reflection', preview: 'Woke up feeling energized today. The morning light was beautiful...', content: 'Woke up feeling energized today. The morning light was beautiful streaming through the window.', date: 'Dec 23', timestamp: Date.now(), wordCount: 150, thread: 'Daily Reflections' },
        { id: '2', title: 'Career Thoughts', preview: 'Been thinking about the next steps in my career...', content: 'Been thinking about the next steps in my career. There are so many possibilities.', date: 'Dec 22', timestamp: Date.now() - 86400000, wordCount: 200, thread: 'Career Decisions' },
    ],
    moodLogged: null,
    moodDismissed: false,
    activeEntryId: null,
  });

  const navigate = (view: ViewState, data?: any) => {
    setState(prev => ({
      ...prev,
      currentView: view,
      activeEntryId: data?.entryId || null,
      editorPrompt: data?.prompt || undefined,
    }));
    window.scrollTo(0,0);
  };

  const handleSaveEntry = (entryData: Partial<Entry>) => {
    setState(prev => {
      const newEntries = [...prev.entries];
      if (entryData.id) {
        const idx = newEntries.findIndex(e => e.id === entryData.id);
        if (idx >= 0) newEntries[idx] = { ...newEntries[idx], ...entryData } as Entry;
      } else {
        newEntries.unshift({
          ...entryData,
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          timestamp: Date.now(),
        } as Entry);
      }
      return { ...prev, entries: newEntries, currentView: 'home' };
    });
  };

  if (state.currentView === 'landing') {
    return <Landing onEnterApp={() => navigate('home')} />;
  }

  if (state.currentView === 'editor') {
    const activeEntry = state.entries.find(e => e.id === state.activeEntryId);
    return (
      <Editor 
        initialData={activeEntry} 
        initialPrompt={state.editorPrompt}
        onBack={() => navigate('home')}
        onSave={handleSaveEntry}
      />
    );
  }

  // --- Layout Components ---

  const NavButton = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => {
    const isActive = state.currentView === view;
    return (
      <button
        onClick={() => navigate(view)}
        className={`
          group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl w-full transition-all duration-300
          ${isActive ? 'bg-white text-sage-900 shadow-sm' : 'text-sage-500 hover:bg-white/50 hover:text-sage-800'}
        `}
      >
        <Icon 
          size={20} 
          strokeWidth={isActive ? 2 : 1.5} 
          className={`transition-colors duration-300 ${isActive ? 'text-sage-800' : 'text-sage-400 group-hover:text-sage-600'}`} 
        />
        <span className="text-sm font-medium tracking-wide">{label}</span>
        {isActive && <div className="absolute left-0 w-1 h-6 bg-sage-800 rounded-r-full" />}
      </button>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden selection:bg-sage-200 selection:text-sage-900">
      
      {/* --- Desktop Floating Sidebar --- */}
      <aside className="hidden lg:flex flex-col w-[280px] h-screen p-6 z-20">
        <div className="flex-1 flex flex-col bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-xl shadow-sage-900/5 p-6 relative overflow-hidden">
          {/* Logo Area */}
          <div className="mb-10 px-2 cursor-pointer" onClick={() => navigate('home')}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-sage-600 to-sage-800 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sage-900/10">
                <Leaf size={18} />
              </div>
              <span className="font-serif text-xl font-medium tracking-tight text-sage-900">Meadow</span>
            </div>
          </div>
          
          {/* Nav Links */}
          <nav className="space-y-2 flex-1">
            <NavButton view="home" icon={HomeIcon} label="Home" />
            <NavButton view="journal" icon={Book} label="Journal" />
            <NavButton view="explore" icon={Compass} label="Explore" />
            <NavButton view="settings" icon={User} label="Profile" />
          </nav>

          {/* New Entry CTA */}
          <div className="mb-6">
            <Button onClick={() => navigate('editor')} className="w-full shadow-xl shadow-sage-900/10" icon={<Plus size={18}/>}>
              New Entry
            </Button>
          </div>

          {/* User Profile */}
          <div className="pt-6 border-t border-sage-100/50">
            <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 transition-all group">
              <div className="w-9 h-9 rounded-full bg-white border border-sage-100 flex items-center justify-center text-sage-700 font-serif text-sm shadow-sm group-hover:scale-105 transition-transform">U</div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-xs font-semibold text-sage-900 truncate tracking-wide">User Name</div>
                <div className="text-[10px] text-sage-500 font-medium">Free Plan</div>
              </div>
              <LogOut size={14} className="text-sage-400 group-hover:text-sage-600" />
            </button>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col min-w-0 relative h-screen">
        
        {/* Mobile Header */}
        <header className="lg:hidden h-20 flex items-center justify-between px-6 sticky top-0 z-10 bg-gradient-to-b from-[#FDFCF8] via-[#FDFCF8]/90 to-transparent">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-sage-800 rounded-lg flex items-center justify-center text-white">
                <Leaf size={16} />
             </div>
             <span className="font-serif text-xl font-medium text-sage-900">Meadow</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-white border border-sage-200 flex items-center justify-center text-sage-700 font-serif text-sm shadow-sm">U</div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-32 lg:p-10 lg:pl-4 scroll-smooth">
          <div className="max-w-5xl mx-auto w-full">
            {state.currentView === 'home' && (
              <Home 
                entries={state.entries} 
                moodLogged={state.moodLogged}
                onLogMood={(m) => setState(p => ({...p, moodLogged: m}))}
                onClearMood={() => setState(p => ({...p, moodLogged: null}))}
                onNavigate={navigate}
              />
            )}
            
            {state.currentView === 'journal' && (
               <div className="animate-fade-up max-w-3xl mx-auto">
                  <div className="flex items-end justify-between mb-12">
                     <div>
                       <h2 className="font-serif text-4xl text-sage-900 mb-3">Journal</h2>
                       <p className="text-sage-600 font-light tracking-wide">Your growing timeline of thoughts.</p>
                     </div>
                     <div className="hidden sm:flex gap-2">
                        <button className="px-4 py-2 bg-white rounded-full text-xs font-bold uppercase tracking-wider text-sage-900 shadow-sm border border-transparent">Timeline</button>
                        <button className="px-4 py-2 bg-transparent rounded-full text-xs font-bold uppercase tracking-wider text-sage-500 hover:bg-white/50">Calendar</button>
                     </div>
                  </div>

                  <div className="relative border-l border-sage-200 ml-3 md:ml-6 space-y-12 pb-12">
                    {state.entries.map(entry => (
                      <div key={entry.id} className="relative pl-8 md:pl-12 group">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[5px] top-6 w-2.5 h-2.5 rounded-full bg-sage-300 border-2 border-[#FDFCF8] group-hover:bg-sage-600 group-hover:scale-125 transition-all duration-300 shadow-sm"></div>
                        
                        <div 
                          onClick={() => navigate('editor', { entryId: entry.id })}
                          className="bg-white/60 hover:bg-white/90 backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-[2rem] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_8px_30px_-12px_rgba(107,143,122,0.15)] hover:-translate-y-1 group-hover:border-white"
                        >
                          <div className="flex justify-between items-start mb-3">
                             <div className="flex flex-col">
                                <span className="text-xs font-bold text-sage-400 uppercase tracking-widest mb-1">{entry.date}</span>
                                <h3 className="font-serif text-xl md:text-2xl text-sage-900">{entry.title}</h3>
                             </div>
                             {entry.thread && (
                                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-sage-50 rounded-full text-[10px] font-bold uppercase tracking-wider text-sage-600 border border-sage-100/50">
                                   <GitBranch size={10} /> {entry.thread}
                                </div>
                             )}
                          </div>
                          <p className="text-sage-600 text-base font-light leading-relaxed line-clamp-3">{entry.preview}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            )}
            
            {state.currentView === 'explore' && (
              <PlaceholderView 
                title="Explore" 
                desc="Discover guided journals, prompts, and clarity exercises in the next update."
                icon={Compass} 
              />
            )}
            
            {state.currentView === 'settings' && (
              <PlaceholderView 
                title="Settings" 
                desc="Customize your experience, manage data, and configure privacy."
                icon={Settings} 
              />
            )}
          </div>
        </div>

        {/* --- Mobile Floating Nav --- */}
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-30">
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-sage-900/10 rounded-2xl p-2 flex items-center justify-around">
             <button onClick={() => navigate('home')} className={`p-3 rounded-xl transition-all ${state.currentView === 'home' ? 'bg-sage-100 text-sage-900' : 'text-sage-400'}`}>
                <HomeIcon size={22} strokeWidth={state.currentView === 'home' ? 2 : 1.5} />
             </button>
             <button onClick={() => navigate('journal')} className={`p-3 rounded-xl transition-all ${state.currentView === 'journal' ? 'bg-sage-100 text-sage-900' : 'text-sage-400'}`}>
                <Book size={22} strokeWidth={state.currentView === 'journal' ? 2 : 1.5} />
             </button>
             <button onClick={() => navigate('editor')} className="bg-sage-800 text-white p-3.5 rounded-xl shadow-lg shadow-sage-800/20 -mt-8 border-4 border-[#FDFCF8] transform active:scale-95 transition-transform">
                <Plus size={24} />
             </button>
             <button onClick={() => navigate('explore')} className={`p-3 rounded-xl transition-all ${state.currentView === 'explore' ? 'bg-sage-100 text-sage-900' : 'text-sage-400'}`}>
                <Compass size={22} strokeWidth={state.currentView === 'explore' ? 2 : 1.5} />
             </button>
             <button onClick={() => navigate('settings')} className={`p-3 rounded-xl transition-all ${state.currentView === 'settings' ? 'bg-sage-100 text-sage-900' : 'text-sage-400'}`}>
                <User size={22} strokeWidth={state.currentView === 'settings' ? 2 : 1.5} />
             </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;