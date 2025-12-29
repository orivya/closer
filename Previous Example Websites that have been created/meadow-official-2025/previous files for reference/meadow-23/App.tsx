import React, { useState } from 'react';
import { Home as HomeIcon, Book, Compass, User, LogOut, Plus, Leaf, Settings as SettingsIcon } from 'lucide-react';
import { AppState, Entry, ViewState } from './types';
import { Landing } from './views/Landing';
import { Editor } from './views/Editor';
import { Home } from './views/Home';
import { Journal } from './views/Journal';
import { Explore } from './views/Explore';
import { Settings } from './views/Settings';
import { Button } from './components/ui';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentView: 'landing',
    entries: [
        { id: '1', title: 'Morning Reflection', preview: 'Woke up feeling energized today. The morning light was beautiful...', content: 'Woke up feeling energized today. The morning light was beautiful streaming through the window.', date: 'Dec 23', timestamp: Date.now(), wordCount: 150, thread: 'Daily Reflections', mood: 'Content' },
        { id: '2', title: 'Career Thoughts', preview: 'Been thinking about the next steps in my career...', content: 'Been thinking about the next steps in my career. There are so many possibilities.', date: 'Dec 22', timestamp: Date.now() - 86400000, wordCount: 200, thread: 'Career Decisions', mood: 'Steady' },
        { id: '3', title: 'Gratitude List', preview: 'Three things I am grateful for today: 1. Good health 2. Supportive friends...', content: 'Three things I am grateful for today: 1. Good health 2. Supportive friends 3. Time to reflect', date: 'Dec 21', timestamp: Date.now() - 172800000, wordCount: 85, mood: 'Radiant' },
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

  // Sidebar Layout Component
  const SidebarItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => navigate(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
        state.currentView === view 
          ? 'bg-white shadow-sm text-sage-900' 
          : 'text-sage-600 hover:bg-black/5 hover:text-sage-900'
      }`}
    >
      <Icon size={18} className={state.currentView === view ? 'text-sage-500' : 'text-sage-400'} />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-cream overflow-hidden font-sans text-sage-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-black/5 bg-white/40 backdrop-blur-xl">
        <div className="p-8 cursor-pointer" onClick={() => navigate('home')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sage-500 rounded-lg flex items-center justify-center text-white shadow-md shadow-sage-500/20">
              <Leaf size={16} />
            </div>
            <span className="font-serif text-lg font-medium tracking-tight text-sage-900">Meadow</span>
          </div>
        </div>
        
        <div className="px-6 mb-6">
          <Button onClick={() => navigate('editor')} className="w-full justify-center" icon={<Plus size={18}/>}>
            New Entry
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          <SidebarItem view="home" icon={HomeIcon} label="Home" />
          <SidebarItem view="journal" icon={Book} label="Journal" />
          <SidebarItem view="explore" icon={Compass} label="Explore" />
          <SidebarItem view="settings" icon={SettingsIcon} label="Profile" />
        </nav>

        <div className="p-4 border-t border-black/5">
          <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-black/5 transition-colors text-left group">
            <div className="w-8 h-8 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-sage-600 font-serif text-sm group-hover:bg-white transition-colors">U</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-sage-900 truncate">User Name</div>
              <div className="text-[10px] text-sage-500">Free Plan</div>
            </div>
            <LogOut size={14} className="text-sage-400" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="lg:hidden h-16 flex items-center justify-between px-6 border-b border-black/5 bg-cream/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sage-800">
            <Leaf size={18} />
            <span className="font-serif text-lg font-medium">Meadow</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 font-serif text-xs">U</div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 pb-24 lg:p-12 lg:pb-12 scroll-smooth">
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
               <Journal entries={state.entries} onNavigate={navigate} />
            )}
            
            {state.currentView === 'explore' && (
              <Explore onNavigate={navigate} />
            )}
            
            {state.currentView === 'settings' && (
              <Settings />
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-cream/90 backdrop-blur-xl border-t border-black/5 pb-safe z-20">
          <div className="flex items-center justify-between px-6 py-4">
             <button onClick={() => navigate('home')} className={`flex flex-col items-center gap-1 ${state.currentView === 'home' ? 'text-sage-600' : 'text-sage-400'}`}>
                <HomeIcon size={20} />
                <span className="text-[10px] font-medium">Home</span>
             </button>
             <button onClick={() => navigate('journal')} className={`flex flex-col items-center gap-1 ${state.currentView === 'journal' ? 'text-sage-600' : 'text-sage-400'}`}>
                <Book size={20} />
                <span className="text-[10px] font-medium">Journal</span>
             </button>
             <div className="-mt-8">
               <button onClick={() => navigate('editor')} className="w-14 h-14 rounded-full bg-sage-500 text-white flex items-center justify-center shadow-lg shadow-sage-500/30 border-4 border-cream hover:bg-sage-600 transition-colors">
                  <Plus size={24} />
               </button>
             </div>
             <button onClick={() => navigate('explore')} className={`flex flex-col items-center gap-1 ${state.currentView === 'explore' ? 'text-sage-600' : 'text-sage-400'}`}>
                <Compass size={20} />
                <span className="text-[10px] font-medium">Explore</span>
             </button>
             <button onClick={() => navigate('settings')} className={`flex flex-col items-center gap-1 ${state.currentView === 'settings' ? 'text-sage-600' : 'text-sage-400'}`}>
                <SettingsIcon size={20} />
                <span className="text-[10px] font-medium">Profile</span>
             </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;