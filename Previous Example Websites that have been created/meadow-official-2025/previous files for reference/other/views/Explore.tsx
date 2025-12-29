
import React, { useState } from 'react';
import { ViewState } from '../types';
import { JOURNEYS, PROMPT_CATEGORIES } from '../data/content';
import { 
  Sparkles, Scale, ArrowRight, Archive, Target, Lock, Play, 
  Star, Mic, BookOpen
} from 'lucide-react';

interface ExploreProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

type ExploreTab = 'journeys' | 'toolbox';

const Explore: React.FC<ExploreProps> = ({ onChangeView }) => {
  const [activeTab, setActiveTab] = useState<ExploreTab>('journeys');

  const featuredJourney = JOURNEYS.find(j => j.isFeatured) || JOURNEYS[0];
  const otherJourneys = JOURNEYS.filter(j => j.id !== featuredJourney.id);

  return (
    <div className="animate-fade-up pb-12 max-w-5xl mx-auto min-h-screen flex flex-col">
      
      {/* Header & Toggle */}
      <div className="flex flex-col items-center mb-10 text-center">
        <h2 className="font-serif text-3xl font-medium text-text-primary mb-6">Explore</h2>
        
        {/* Segmented Control */}
        <div className="p-1 bg-stone-200/50 rounded-full flex relative">
           <button 
             onClick={() => setActiveTab('journeys')}
             className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 ${activeTab === 'journeys' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
           >
             Library
           </button>
           <button 
             onClick={() => setActiveTab('toolbox')}
             className={`relative z-10 px-8 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-300 ${activeTab === 'toolbox' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'}`}
           >
             Toolbox
           </button>
           
           {/* Animated Background Pill */}
           <div 
             className={`absolute top-1 bottom-1 bg-white rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]`}
             style={{
               left: activeTab === 'journeys' ? '4px' : '50%',
               width: 'calc(50% - 4px)',
               transform: activeTab === 'journeys' ? 'translateX(0)' : 'translateX(0)'
             }}
           />
        </div>
      </div>

      {/* --- TAB: LIBRARY (JOURNEYS & PROMPTS) --- */}
      {activeTab === 'journeys' && (
        <div className="space-y-16 animate-fade-in">
            
            {/* Featured Journey */}
            <div 
                onClick={() => onChangeView(ViewState.JOURNEY_DETAIL, { id: featuredJourney.id, title: featuredJourney.title })} 
                className="group cursor-pointer relative bg-[#f4f7f5] rounded-[40px] p-8 lg:p-12 overflow-hidden transition-all duration-500 hover:shadow-card-hover border border-transparent hover:border-sage/20"
            >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 text-center lg:text-left">
                    <div className="flex-1 w-full flex flex-col items-center lg:items-start">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                             <div className="bg-sage text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                                <Star size={10} fill="currentColor" strokeWidth={0} /> Featured
                            </div>
                            <span className="text-xs font-bold text-sage-dark uppercase tracking-widest">Active Now</span>
                        </div>
                        
                        <h3 className="font-serif text-4xl lg:text-5xl text-text-primary mb-4 leading-tight">{featuredJourney.title}</h3>
                        <p className="text-text-secondary text-lg mb-8 leading-relaxed font-light max-w-lg mx-auto lg:mx-0">
                            {featuredJourney.description}
                        </p>
                        
                        <div className="flex items-center justify-center lg:justify-start gap-6 text-xs font-bold text-text-muted uppercase tracking-wide">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-sage" /> {featuredJourney.totalDays} days</span>
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-sage" /> 10 min/day</span>
                            {/* Progress Bar for Featured */}
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-16 bg-stone-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-sage w-[40%]" />
                                </div>
                                <span>Day 3</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-auto flex justify-center">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white flex items-center justify-center text-sage shadow-2xl shadow-sage/10 group-hover:scale-105 transition-transform duration-500">
                             <Play size={40} fill="currentColor" className="ml-1.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Journey Library */}
            <section>
                <h3 className="text-lg font-serif font-medium text-text-primary mb-6 px-1 text-center lg:text-left">Guided Journeys</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherJourneys.map(journey => (
                        <JourneyCard 
                            key={journey.id}
                            journey={journey}
                            onClick={() => onChangeView(ViewState.JOURNEY_DETAIL, { id: journey.id, title: journey.title })}
                        />
                    ))}
                </div>
            </section>

             {/* Prompt Library Categories */}
            <section>
                <div className="flex flex-col lg:flex-row items-center justify-between mb-6 px-1 gap-4 lg:gap-0">
                    <h3 className="text-lg font-serif font-medium text-text-primary text-center lg:text-left">Prompt Library</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {PROMPT_CATEGORIES.map(category => (
                        <CategoryCard 
                            key={category.id}
                            category={category}
                            onClick={() => onChangeView(ViewState.PROMPT_LIST, { categoryId: category.id, title: category.title })} 
                        />
                    ))}
                </div>
            </section>
        </div>
      )}

      {/* --- TAB: TOOLBOX --- */}
      {activeTab === 'toolbox' && (
        <div className="space-y-8 animate-fade-in">
            
            {/* Main Focus Tool: Intentions */}
             <div className="bg-white rounded-[32px] p-1 border border-stone-200/60 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-stone-50 rounded-[28px] p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left">
                   <div className="w-16 h-16 rounded-2xl bg-white text-sage-dark flex items-center justify-center shadow-sm shrink-0 border border-stone-100 mx-auto lg:mx-0">
                      <Target size={32} strokeWidth={1.5} />
                   </div>
                   <div className="flex-1">
                      <h3 className="font-serif text-2xl text-text-primary mb-2">Intentions Hub</h3>
                      <p className="text-text-secondary font-light max-w-md mx-auto lg:mx-0">
                         The central compass for your life. Connect your daily notes to your bigger picture.
                      </p>
                   </div>
                   <button 
                     onClick={() => onChangeView(ViewState.SPACE_INTENTIONS)}
                     className="px-8 py-3 bg-white text-text-primary rounded-full font-medium shadow-sm hover:bg-stone-800 hover:text-white transition-all flex items-center gap-2 mx-auto lg:mx-0"
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
                    color="clay"
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
                    color="stone"
                    onClick={() => onChangeView(ViewState.SPACE_DECISION)}
                />
                 
                 <ToolCard 
                    title="Voice Memos" 
                    desc="Record your thoughts on the go. Auto-transcribed and tagged."
                    icon={Mic}
                    color="sand"
                    onClick={() => onChangeView(ViewState.SPACE_VOICE)}
                />
            </div>
        </div>
      )}

    </div>
  );
};

// --- Sub Components ---

const JourneyCard: React.FC<{ journey: any, onClick: () => void }> = ({ journey, onClick }) => {
    return (
      <div onClick={onClick} className="bg-white p-6 rounded-[28px] border border-stone-200/60 hover:shadow-card-hover hover:border-sage/20 transition-all cursor-pointer h-full flex flex-col items-center lg:items-start text-center lg:text-left group relative overflow-hidden">
         <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 bg-sage/5 text-sage">
            <journey.icon size={24} strokeWidth={1.5} />
         </div>
         <h4 className="font-serif text-xl font-medium text-text-primary mb-2 group-hover:text-sage-dark transition-colors">{journey.title}</h4>
         <p className="text-sm text-text-secondary leading-relaxed font-light line-clamp-2">{journey.description}</p>
         
         <div className="mt-6 pt-4 border-t border-stone-50 flex items-center justify-between w-full">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{journey.totalDays} Days</span>
            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 group-hover:bg-sage group-hover:text-white transition-all">
                <Play size={12} fill="currentColor" />
            </div>
         </div>
      </div>
    )
}

const CategoryCard: React.FC<{ category: any, onClick: () => void }> = ({ category, onClick }) => {
    // Monochrome / Sage / Clay Palette
    const colors: any = {
      coral: 'bg-clay/10 text-clay',
      sage: 'bg-sage/10 text-sage-dark',
      purple: 'bg-stone-100 text-text-secondary',
      blue: 'bg-stone-50 text-text-muted',
      lavender: 'bg-stone-100 text-stone-600',
      peach: 'bg-clay/5 text-clay',
      yellow: 'bg-[#e0d6c2]/30 text-[#8f8263]', // Sand/Gold
      mint: 'bg-sage-light/20 text-sage-dark',
    };
    const theme = colors[category.color] || colors.sage;

    return (
        <button onClick={onClick} className="bg-white p-5 rounded-2xl border border-stone-100 hover:border-sage/20 hover:shadow-sm transition-all text-center lg:text-left group flex flex-col items-center lg:items-start gap-3 h-full">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${theme}`}>
                <category.icon size={18} strokeWidth={1.5} />
            </div>
            <div>
                <h4 className="font-medium text-text-primary text-sm mb-1 group-hover:text-sage-dark">{category.title}</h4>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{category.count} Prompts</p>
            </div>
        </button>
    );
};

const ToolCard = ({ title, desc, icon: Icon, color, onClick, badge, premium }: any) => {
    // Complementary Earth Tones (No generic colors)
    const colorMap: any = {
      sage: { bg: 'bg-sage/10', text: 'text-sage', border: 'hover:border-sage/30' },
      clay: { bg: 'bg-clay/10', text: 'text-clay', border: 'hover:border-clay/30' },
      stone: { bg: 'bg-stone-100', text: 'text-stone-600', border: 'hover:border-stone-300' },
      sand: { bg: 'bg-[#e0d6c2]/30', text: 'text-[#8f8263]', border: 'hover:border-[#8f8263]/30' },
    };
  
    const theme = colorMap[color] || colorMap.sage;
  
    return (
      <div 
        onClick={onClick}
        className={`
          group relative p-8 bg-white rounded-[32px] border border-stone-200/60 shadow-sm 
          transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer 
          text-center lg:text-left flex flex-col items-center lg:items-start
          ${theme.border}
        `}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${theme.bg} ${theme.text}`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
  
        <div className="flex justify-center lg:justify-between items-start mb-3 w-full">
             <h3 className="font-serif text-xl font-medium text-text-primary group-hover:text-sage-dark transition-colors">
                {title}
            </h3>
            {premium && <Lock size={16} className="text-stone-300 absolute right-8 top-8 lg:static" />}
        </div>
        
        <p className="text-sm text-text-secondary font-light leading-relaxed mb-8">
          {desc}
        </p>
  
        <div className="flex items-center justify-between mt-auto w-full">
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

export default Explore;
