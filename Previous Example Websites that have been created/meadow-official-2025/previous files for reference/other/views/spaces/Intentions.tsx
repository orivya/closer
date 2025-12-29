
import React from 'react';
import { ViewState } from '../../types';
import { Target, Plus, ArrowRight, Heart, Briefcase, BookOpen, PenTool, TrendingUp, Lightbulb } from 'lucide-react';

interface IntentionsProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

const Intentions: React.FC<IntentionsProps> = ({ onChangeView }) => {
  
  const intentions = [
    { 
        id: '1', 
        title: 'Financial Freedom', 
        desc: 'Building safety to take career risks.', 
        category: 'finance', 
        entryCount: 12,
        progress: 65,
        color: 'sage'
    },
    { 
        id: '2', 
        title: 'Deepen Relationships', 
        desc: 'Genuine connection over superficial updates.', 
        category: 'relationships', 
        entryCount: 5,
        progress: 30,
        color: 'clay'
    },
    { 
        id: '3', 
        title: 'Career Pivot', 
        desc: 'Transitioning to design without losing identity.', 
        category: 'career', 
        entryCount: 8,
        progress: 45,
        color: 'stone'
    }
  ];

  return (
    <div className="animate-fade-up max-w-4xl mx-auto pb-20">
      
      {/* Hero Header */}
      <div className="bg-white rounded-[32px] p-8 md:p-10 border border-stone-200/60 shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
         <div>
            <div className="flex items-center gap-2 mb-2">
                <Target size={18} className="text-sage" />
                <span className="text-xs font-bold text-sage uppercase tracking-widest">North Star</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-2">Intentions Hub</h2>
            <p className="text-text-secondary font-light max-w-md">
               Your compass. Align your daily actions with who you want to become.
            </p>
         </div>
         <button className="px-6 py-3 bg-text-primary text-white rounded-full font-medium shadow-lg hover:bg-black transition-all flex items-center gap-2 shrink-0">
            <Plus size={18} /> Set New Intention
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
         {/* Focus Card - Highlighted */}
         <div className="bg-gradient-to-br from-[#faf9f7] to-white p-8 rounded-[32px] border border-stone-200 shadow-card col-span-1 md:col-span-2 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                    <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Current Focus</span>
                </div>
                <h3 className="font-serif text-3xl text-text-primary mb-2">Financial Freedom</h3>
                <p className="text-lg text-text-secondary font-light italic mb-6">"I want to feel safe enough to take risks."</p>
                
                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={() => onChangeView(ViewState.EDITOR, { prompt: "What does 'enough' look like today?", intentionId: '1' })}
                        className="px-5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-text-secondary hover:border-sage hover:text-sage-dark transition-all flex items-center gap-2"
                    >
                        <PenTool size={14} /> Reflect on "Enough"
                    </button>
                    <button className="px-5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm font-medium text-text-secondary hover:border-sage hover:text-sage-dark transition-all flex items-center gap-2">
                        <TrendingUp size={14} /> View Patterns
                    </button>
                </div>
            </div>
            
            <div className="w-full md:w-64 bg-white rounded-2xl p-5 border border-stone-100 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-text-muted uppercase">Momentum</span>
                    <span className="text-sage-dark font-bold text-sm">High</span>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-sage w-[65%] rounded-full" />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                        <div className="w-8 h-8 rounded-lg bg-sage/10 text-sage-dark flex items-center justify-center"><BookOpen size={14} /></div>
                        <span>12 Entries</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text-secondary">
                        <div className="w-8 h-8 rounded-lg bg-clay/10 text-clay flex items-center justify-center"><Lightbulb size={14} /></div>
                        <span>2 Breakthroughs</span>
                    </div>
                </div>
            </div>
         </div>
      </div>

      <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6 px-1">Active Intentions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {intentions.slice(1).map(intention => {
             const colors: any = {
                 clay: 'text-clay bg-clay/10 border-clay/20',
                 stone: 'text-text-secondary bg-stone-100 border-stone-200',
                 sage: 'text-sage-dark bg-sage/10 border-sage/20'
             };
             const theme = colors[intention.color];

             return (
                <div key={intention.id} className="bg-white p-6 rounded-[28px] border border-stone-200/60 hover:shadow-card hover:border-sage/30 transition-all cursor-pointer group flex flex-col">
                    <div className={`w-12 h-12 rounded-xl ${theme} flex items-center justify-center mb-4`}>
                        {intention.category === 'relationships' ? <Heart size={20} /> : <Briefcase size={20} />}
                    </div>
                    <h4 className="font-serif text-xl text-text-primary mb-2 group-hover:text-sage-dark transition-colors">{intention.title}</h4>
                    <p className="text-sm text-text-secondary font-light leading-relaxed mb-6 line-clamp-2">{intention.desc}</p>
                    
                    <div className="mt-auto pt-4 border-t border-stone-50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{intention.entryCount} Entries</span>
                        <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-300 group-hover:bg-text-primary group-hover:text-white transition-all">
                            <ArrowRight size={14} />
                        </div>
                    </div>
                </div>
             )
         })}
         
         {/* Add New Small Card */}
         <button className="border-2 border-dashed border-stone-200 rounded-[28px] flex flex-col items-center justify-center p-6 text-stone-300 hover:border-sage/40 hover:text-sage hover:bg-sage/5 transition-all min-h-[240px]">
            <Plus size={32} strokeWidth={1} className="mb-2" />
            <span className="font-serif text-lg">Add Area</span>
         </button>
      </div>

    </div>
  );
};

export default Intentions;
