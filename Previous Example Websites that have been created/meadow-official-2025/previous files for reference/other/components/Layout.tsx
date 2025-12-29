import React from 'react';
import Sidebar from './Sidebar';
import { ViewState } from '../types';
import { Search, ChevronLeft, Home, BookOpen, Plus, LayoutGrid, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  title: string;
  showBack?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, title, showBack }) => {

  // Determine back destination based on current view
  const handleBack = () => {
    if (currentView.toString().startsWith('space-')) {
      onChangeView(ViewState.EXPLORE);
    } else {
      onChangeView(ViewState.HOME);
    }
  };

  const isEditor = currentView === ViewState.EDITOR;

  const MobileNavItem = ({ icon: Icon, view, label, subViews }: any) => {
    const isActive = currentView === view || (subViews && subViews.includes(currentView)) || (view === ViewState.EXPLORE && currentView.toString().startsWith('space-'));
    
    return (
      <button 
        onClick={() => onChangeView(view)}
        className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive ? 'text-sage-dark' : 'text-stone-400 hover:text-stone-600'}`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
        <span className="text-[10px] font-medium tracking-tight">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#faf9f7] overflow-hidden font-sans text-text-primary selection:bg-sage-subtle selection:text-sage-dark w-full relative">
      
      {/* --- AMBIENT BACKGROUND SYSTEM (Global) --- */}
      {/* Hidden in Editor because Editor has its own atmospheric system */}
      {!isEditor && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
           
           {/* 1. Organic Gradients */}
           <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-sage/5 rounded-full blur-[120px] animate-pulse-slow" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-clay/5 rounded-full blur-[100px] animate-float" />
           <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-white/40 rounded-full blur-[80px]" />
           
           {/* 2. Foliage SVG Layer (The Meadow Floor) */}
           <div className="absolute bottom-0 left-0 right-0 h-[40vh] opacity-[0.03] text-sage-dark">
                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 400" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,400 C150,380 300,420 400,350 C500,280 600,320 700,380 C800,440 900,380 1000,400 V400 H0 Z" fill="currentColor"/>
                    <path d="M0,400 C100,390 200,380 300,400 V400 H0 Z" fill="currentColor" opacity="0.5"/>
                    <g transform="translate(100, 350) scale(0.5)">
                        {/* Abstract Fern */}
                        <path d="M10,100 Q20,50 40,10 Q30,40 50,20 Q40,60 60,40" stroke="currentColor" fill="none" strokeWidth="2"/>
                    </g>
                     <g transform="translate(800, 320) scale(0.7) rotate(-10)">
                        <path d="M10,100 Q20,50 40,10 Q30,40 50,20 Q40,60 60,40" stroke="currentColor" fill="none" strokeWidth="2"/>
                    </g>
                </svg>
           </div>
        </div>
      )}

      {/* Desktop Sidebar - HIDDEN IN EDITOR */}
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

      <div className="flex-1 flex flex-col min-w-0 h-full relative transition-all duration-300 z-10">
        
        {/* Header - HIDDEN IN EDITOR */}
        {!isEditor && (
          <header className="h-20 px-6 lg:px-10 sticky top-0 z-30 flex items-center justify-between shrink-0 transition-all duration-300">
            {/* Glass background */}
            <div className="absolute inset-0 bg-[#faf9f7]/80 backdrop-blur-xl border-b border-stone-200/30 z-[-1]" />

            <div className="flex items-center gap-4">
              {showBack ? (
                <button 
                  onClick={handleBack}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 border border-stone-200 text-text-secondary hover:bg-white hover:text-text-primary transition-all hover:shadow-sm"
                >
                  <ChevronLeft size={20} strokeWidth={2} />
                </button>
              ) : (
                  <div className="lg:hidden w-8 h-8 rounded-xl bg-gradient-to-br from-sage to-sage-dark flex items-center justify-center text-white shadow-lg shadow-sage/20">
                       <span className="font-serif font-bold text-xs">M</span>
                  </div>
              )}
              
              <h1 className="font-serif text-2xl lg:text-3xl text-text-primary tracking-tight truncate opacity-90">
                {title}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-sage transition-colors" size={16} strokeWidth={1.5} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 w-64 bg-white/50 border border-stone-200/50 hover:bg-white/80 hover:border-stone-200 rounded-full text-sm focus:ring-2 focus:ring-sage/20 focus:bg-white focus:border-transparent transition-all placeholder:text-text-muted/70 text-text-primary shadow-sm"
                />
              </div>
            </div>
          </header>
        )}

        {/* Main Content Area - Full height in Editor */}
        <main className={`flex-1 overflow-y-auto relative scroll-smooth flex flex-col ${!isEditor ? 'px-6 py-6 lg:p-10 pb-28 lg:pb-0' : 'p-0'}`}>
          <div className={`${!isEditor ? 'max-w-5xl w-full mx-auto' : 'w-full h-full'}`}>
            {children}
          </div>
        </main>

        {/* --- MOBILE BOTTOM NAVIGATION - HIDDEN IN EDITOR --- */}
        {!isEditor && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 h-[88px] bg-[#faf9f7]/90 backdrop-blur-xl border-t border-stone-200/50 z-50 px-6 pb-6 pt-2">
              <div className="flex items-center justify-between relative h-full">
                  <MobileNavItem icon={Home} view={ViewState.HOME} label="Home" />
                  <MobileNavItem icon={BookOpen} view={ViewState.JOURNAL} label="Journal" />
                  
                  <div className="relative -top-6">
                      <button 
                          onClick={() => onChangeView(ViewState.EDITOR)}
                          className="w-14 h-14 rounded-full bg-gradient-to-tr from-sage to-sage-dark text-white shadow-lg shadow-sage/40 flex items-center justify-center transform active:scale-95 transition-all border-4 border-[#faf9f7]"
                      >
                          <Plus size={28} strokeWidth={2.5} />
                      </button>
                  </div>

                  <MobileNavItem icon={LayoutGrid} view={ViewState.EXPLORE} label="Spaces" />
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