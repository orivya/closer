import React, { useRef, useState } from 'react';
import Sidebar from './Sidebar';
import { ViewState } from '../types';
import { Search, ChevronLeft, Home, BookOpen, Plus, LayoutGrid, User, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, title, showBack, onBack }) => {

  // Use provided onBack handler, or fall back to browser history
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const isEditor = currentView === ViewState.EDITOR;

  // Main navigation pages that use bottom nav on mobile (no header needed)
  const isMainNavPage = [ViewState.HOME, ViewState.JOURNAL, ViewState.EXPLORE, ViewState.SETTINGS].includes(currentView);

  const JOURNAL_SEARCH_EVENT = 'meadow:journal-search';
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const dispatchJournalSearch = (query: string) => {
    window.dispatchEvent(new CustomEvent(JOURNAL_SEARCH_EVENT, { detail: { query } }));
  };

  const MobileNavItem = ({ icon: Icon, view, label, subViews }: any) => {
    const isActive = currentView === view || (subViews && subViews.includes(currentView)) || (view === ViewState.EXPLORE && currentView.toString().startsWith('space-'));

    return (
      <button
        onClick={() => onChangeView(view)}
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-sage-600' : 'text-sage-400 hover:text-sage-500'}`}
      >
        <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
        <span className="text-[0.6rem] font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-dark-base overflow-hidden font-sans text-text-primary w-full">

      {/* Desktop Sidebar */}
      {!isEditor && (
        <div className="hidden lg:block h-full z-50">
          <Sidebar
            currentView={currentView}
            onChangeView={onChangeView}
            isOpen={false}
            onClose={() => {}}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10">

        {/* Header - Hidden on mobile for main nav pages, shown with back button on sub-pages */}
        {!isEditor && (
          <header className={`h-16 px-6 lg:px-10 sticky top-0 z-30 flex items-center justify-between shrink-0 ${isMainNavPage ? 'hidden lg:flex' : ''}`}>
            <div className="absolute inset-0 glass-nav z-[-1]" />

            <div className="flex items-center gap-3">
              {showBack && (
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-sage-50 border border-sage-100 text-sage-600 hover:bg-sage-100 hover:text-sage-700 transition-all"
                >
                  <ChevronLeft size={18} strokeWidth={2} />
                </button>
              )}

              <h1 className="font-serif text-xl lg:text-2xl text-sage-900 tracking-tight truncate">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 group-focus-within:text-sage-600 transition-colors" size={14} strokeWidth={1.5} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchText}
                  placeholder="Search entries..."
                  className="pl-9 pr-10 py-2 w-64 bg-white border border-sage-200 rounded-full text-sm focus:ring-1 focus:ring-sage-500/20 focus:border-sage-400 transition-all placeholder:text-sage-400 text-sage-900"
                  onChange={(e) => {
                    const next = e.target.value;
                    setSearchText(next);
                    if (currentView === ViewState.JOURNAL) dispatchJournalSearch(next);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const q = searchText.trim();
                      if (currentView !== ViewState.JOURNAL) onChangeView(ViewState.JOURNAL);
                      dispatchJournalSearch(q);
                    }

                    if (e.key === 'Escape') {
                      setSearchText('');
                      if (currentView === ViewState.JOURNAL) dispatchJournalSearch('');
                      searchInputRef.current?.blur();
                    }
                  }}
                />
                {searchText.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchText('');
                      if (currentView === ViewState.JOURNAL) dispatchJournalSearch('');
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-sage-400 hover:text-sage-600 hover:bg-sage-50 transition-all"
                    aria-label="Clear search"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                )}
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 scroll-smooth ${!isEditor ? 'overflow-y-auto px-6 py-6 lg:px-10 lg:py-10 pb-28 lg:pb-10' : 'overflow-hidden p-0'}`}
        >
          <div className={`${!isEditor ? 'max-w-[900px] w-full mx-auto' : 'w-full h-full'}`}>
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        {!isEditor && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-lg border-t border-sage-100 z-50 px-4 pb-5 pt-2 shadow-[0_-4px_20px_rgba(107,143,122,0.08)]">
              <div className="flex items-center justify-between h-full">
                  <MobileNavItem icon={Home} view={ViewState.HOME} label="Home" />
                  <MobileNavItem icon={BookOpen} view={ViewState.JOURNAL} label="Journal" />

                  <div className="relative -top-4">
                      <button
                          onClick={() => onChangeView(ViewState.EDITOR)}
                          className="w-12 h-12 rounded-full bg-sage-500 text-white shadow-lg shadow-sage-500/30 flex items-center justify-center active:scale-95 transition-all border-4 border-white hover:bg-sage-600"
                      >
                          <Plus size={24} strokeWidth={2} />
                      </button>
                  </div>

                  <MobileNavItem icon={LayoutGrid} view={ViewState.EXPLORE} label="Explore" />
                  <MobileNavItem icon={User} view={ViewState.SETTINGS} label="Profile" />
              </div>
          </div>
        )}
      </div>
      
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.1; transform: scale(1.1); }
        }
        .animate-float { animation: float 15s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 10s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Layout;