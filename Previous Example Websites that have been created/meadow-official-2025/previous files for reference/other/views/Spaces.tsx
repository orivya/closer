import React, { useState } from 'react';
import { ViewState } from '../types';
import { 
  Sparkles, 
  Scale, 
  ArrowRight,
  Archive,
  Target,
  Lock,
  Play,
  Star,
  Map,
  Compass,
  Mic,
  LayoutGrid
} from 'lucide-react';

interface SpacesProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

type SpaceTab = 'explore' | 'tools';

const Spaces: React.FC<SpacesProps> = ({ onChangeView }) => {
  const [activeTab, setActiveTab] = useState<SpaceTab>('explore');

  return (
    <div className="animate-fade-up pb-12 max-w-5xl mx-auto min-h-screen flex flex-col">
      
      {/* Header & Toggle */}
      <div className="flex flex-col items-center mb-10">
        <h2 className="font-serif text-3xl font-medium text-text-primary mb-6">Spaces</h2>
        
        {/* Segmented Control */}
        <div className="p-1 bg-stone-200/50 rounded-full flex relative">
           <button 
             onClick={() => setActiveTab('explore')}
             className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 ${activeTab === 'explore' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
           >
             Journeys
           </button>
           <button 
             onClick={() => setActiveTab('tools')}
             className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 ${activeTab === 'tools' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
           >
             Toolbox
           </button>
           
           {/* Animated Background Pill */}
           <div 
             className={`absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]`}
             style={{
               left: activeTab === 'explore' ? '4px' : '50%',
               width: 'calc(50% - 4px)',
               transform: activeTab === 'explore' ? 'translateX(0)' : 'translateX(0)'
             }}
           />
        </div>
      </div>

      {/* --- TAB: EXPLORE (JOURNEYS) --- */}
      {activeTab === 'explore' && (
        <div className="space-y-12 animate-fade-in">
            
            {/* Hero Journey */}
            <div 
                onClick={() => onChangeView(ViewState.JOURNEY_DETAIL, { id: 'clarity', title: '7 Days of Clarity' })} 
                className="group cursor-pointer relative bg-[#f4f7f5] rounded-[40px] p-8 lg:p-12 overflow-hidden transition-all duration-500 hover:shadow-card-hover border border-transparent hover:border-sage/20"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                             <div className="bg-sage text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                                <Star size={10} fill="currentColor" strokeWidth={0} /> Featured
                            </div>
                            <span className="text-xs font-bold text-sage-dark uppercase tracking-widest">Starts Today</span>
                        </div>
                        
                        <h3 className="font-serif text-4xl lg:text-5xl text-text-primary mb-4 leading-tight">7 Days of Clarity</h3>
                        <p className="text-text-secondary text-lg mb-8 leading-relaxed font-light max-w-lg">
                            A guided path to cut through mental noise. Reconnect with what matters most through short, daily prompts.
                        </p>
                        
                        <div className="flex items-center gap-6 text-xs font-bold text-text-muted uppercase tracking-wide">
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sage" /> 7 days</span>
                            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sage" /> 10 min/day</span>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto flex justify-center">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white flex items-center justify-center text-sage shadow-2xl shadow-sage/10 group-hover:scale-105 transition-transform duration-500">
                             <Play size={40} fill="currentColor" className="ml-1.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Journey Grid */}
            <section>
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-lg font-serif font-medium text-text-primary">All Journeys</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <JourneyCard 
                        color="coral" 
                        title="Know Yourself" 
                        desc="5 days of deep self-discovery."
                        onClick={() => onChangeView(ViewState.JOURNEY_DETAIL, { id: 'know', title: 'Know Yourself' })}
                    />
                    <JourneyCard 
                        color="blue" 
                        title="Letting Go" 
                        desc="Release what holds you back."
                        onClick={() => onChangeView(ViewState.JOURNEY_DETAIL, { id: 'letting', title: 'Letting Go' })}
                    />
                    <JourneyCard 
                        color="purple" 
                        title="Finding Direction" 
                        desc="Clarify your goals and path."
                        onClick={() => onChangeView(ViewState.JOURNEY_DETAIL, { id: 'direction', title: 'Finding Direction' })}
                    />
                </div>
            </section>

             {/* Prompt Categories */}
            <section>
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-lg font-serif font-medium text-text-primary">Prompt Library</h3>
                    <button onClick={() => onChangeView(ViewState.PROMPT_LIST)} className="text-xs font-bold uppercase tracking-wider text-sage hover:text-sage-dark flex items-center gap-1.5 transition-colors">
                        View All
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <CategoryCard title="Career" count="12" onClick={() => onChangeView(ViewState.PROMPT_LIST, { category: 'Career' })} />
                    <CategoryCard title="Relationships" count="8" onClick={() => onChangeView(ViewState.PROMPT_LIST, { category: 'Relationships' })} />
                    <CategoryCard title="Growth" count="15" onClick={() => onChangeView(ViewState.PROMPT_LIST, { category: 'Growth' })} />
                    <CategoryCard title="Anxiety" count="6" onClick={() => onChangeView(ViewState.PROMPT_LIST, { category: 'Anxiety' })} />
                </div>
            </section>
        </div>
      )}

      {/* --- TAB: TOOLBOX --- */}
      {activeTab === 'tools' && (
        <div className="space-y-8 animate-fade-in">
            
            {/* Main Focus Tool: Intentions */}
             <div className="bg-white rounded-[32px] p-1 border border-stone-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-stone-50 rounded-[28px] p-8 lg:p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                   <div className="w-16 h-16 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-sm shrink-0">
                      <Target size={32} strokeWidth={1.5} />
                   </div>
                   <div className="flex-1">
                      <h3 className="font-serif text-2xl text-text-primary mb-2">Intentions Hub</h3>
                      <p className="text-text-secondary font-light max-w-md mx-auto md:mx-0">
                         The central compass for your life. Connect your daily notes to your bigger picture.
                      </p>
                   </div>
                   <button 
                     onClick={() => onChangeView(ViewState.SPACE_INTENTIONS)}
                     className="px-8 py-3 bg-white text-text-primary rounded-full font-medium shadow-sm hover:bg-stone-800 hover:text-white transition-all flex items-center gap-2"
                   >
                     Open Hub <ArrowRight size={16} />
                   </button>
                </div>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ToolCard 
                    title="The Vault" 
                    desc="Send letters to your future self. Lock them away for months or years."
                    icon={Archive}
                    color="coral"
                    onClick={() => onChangeView(ViewState.SPACE_VAULT)}
                    badge="1 Unlocked"
                />

                <ToolCard 
                    title="The Mirror" 
                    desc="Discover patterns and insights from your writing. One reflection at a time."
                    icon={Sparkles}
                    color="sage"
                    onClick={() => onChangeView(ViewState.SPACE_MIRROR)}
                    badge="AI Powered"
                />

                <ToolCard 
                    title="Decision Lab" 
                    desc="Structured space for working through decisions. Pros, cons, and clarity."
                    icon={Scale}
                    color="amber"
                    onClick={() => onChangeView(ViewState.SPACE_DECISION)}
                    premium
                />
                 
                 <ToolCard 
                    title="Voice Memos" 
                    desc="Record your thoughts on the go. Auto-transcribed and tagged."
                    icon={Mic}
                    color="purple"
                    onClick={() => onChangeView(ViewState.SPACE_VOICE)}
                />
            </div>
        </div>
      )}

    </div>
  );
};

// --- Sub Components ---

const JourneyCard = ({ color, title, desc, onClick }: any) => {
    const bgColors: any = {
      coral: 'bg-[#e8927c]/10 text-[#e8927c]',
      blue: 'bg-[#6b8cce]/10 text-[#6b8cce]',
      purple: 'bg-[#c490d1]/10 text-[#c490d1]'
    };
  
    return (
      <div onClick={onClick} className="bg-white p-6 rounded-[28px] border border-stone-200/60 hover:shadow-card-hover hover:border-sage/20 transition-all cursor-pointer h-full flex flex-col group relative overflow-hidden">
         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${bgColors[color]}`}>
            <Compass size={24} strokeWidth={1.5} />
         </div>
         <h4 className="font-serif text-xl font-medium text-text-primary mb-2 group-hover:text-sage-dark transition-colors">{title}</h4>
         <p className="text-sm text-text-secondary leading-relaxed font-light">{desc}</p>
         
         <div className="mt-6 pt-4 border-t border-stone-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">5 Days</span>
            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 group-hover:bg-sage group-hover:text-white transition-all">
                <Play size={12} fill="currentColor" />
            </div>
         </div>
      </div>
    )
}

const CategoryCard = ({ title, count, onClick }: any) => (
    <button onClick={onClick} className="bg-white p-4 rounded-2xl border border-stone-100 hover:border-sage/30 hover:shadow-sm transition-all text-left group">
        <h4 className="font-medium text-text-primary text-sm mb-1 group-hover:text-sage-dark">{title}</h4>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{count} Prompts</p>
    </button>
);

const ToolCard = ({ title, desc, icon: Icon, color, onClick, badge, premium }: any) => {
    const colorMap: any = {
      sage: { bg: 'bg-sage/10', text: 'text-sage', border: 'hover:border-sage/30' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'hover:border-blue-500/30' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'hover:border-purple-500/30' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'hover:border-amber-500/30' },
      coral: { bg: 'bg-red-400/10', text: 'text-red-400', border: 'hover:border-red-400/30' },
    };
  
    const theme = colorMap[color] || colorMap.sage;
  
    return (
      <div 
        onClick={onClick}
        className={`
          group relative p-8 bg-white rounded-[32px] border border-stone-200/60 shadow-sm 
          transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer text-left
          ${theme.border}
        `}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${theme.bg} ${theme.text}`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
  
        <div className="flex justify-between items-start mb-3">
             <h3 className="font-serif text-xl font-medium text-text-primary group-hover:text-sage-dark transition-colors">
                {title}
            </h3>
            {premium && <Lock size={16} className="text-stone-300" />}
        </div>
        
        <p className="text-sm text-text-secondary font-light leading-relaxed mb-8">
          {desc}
        </p>
  
        <div className="flex items-center justify-between mt-auto">
          <div>
            {badge && (
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${badge === 'AI Powered' ? 'bg-purple-50 text-purple-600' : 'bg-stone-100 text-text-muted'}`}>
                {badge}
              </span>
            )}
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 ${theme.bg} ${theme.text}`}>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    );
  };

export default Spaces;