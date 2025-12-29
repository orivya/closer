
import React from 'react';
import { ViewState } from '../types';
import { PROMPT_CATEGORIES } from '../data/content';
import { PenTool, Shuffle } from 'lucide-react';

interface PromptListProps {
  onChangeView: (view: ViewState, data?: any) => void;
  categoryId?: string;
  title?: string;
}

const PromptList: React.FC<PromptListProps> = ({ onChangeView, categoryId }) => {
  const category = PROMPT_CATEGORIES.find(c => c.id === categoryId);
  const prompts = category ? category.prompts : PROMPT_CATEGORIES.flatMap(c => c.prompts).slice(0, 10);
  const displayTitle = category ? category.title : 'All Prompts';

  return (
    <div className="animate-fade-up max-w-4xl mx-auto space-y-8 pb-20">
       <div className="text-center py-8">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Prompt Library</p>
          <div className="flex items-center justify-center gap-4 mb-4">
              {category && <category.icon size={32} className="text-sage" />}
              <h2 className="font-serif text-4xl text-text-primary">{displayTitle}</h2>
          </div>
          <p className="text-text-secondary font-light max-w-lg mx-auto">
             {category?.description || 'Explore our collection of thought-starters.'}
          </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prompts.map((prompt, idx) => (
             <div key={idx} className="bg-white p-8 rounded-[24px] border border-stone-100 shadow-sm hover:shadow-card hover:border-sage/20 transition-all flex flex-col justify-between group h-full">
                <p className="font-serif text-lg text-text-primary leading-relaxed mb-6 group-hover:text-sage-dark transition-colors">
                   "{prompt}"
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                   <button 
                      onClick={() => onChangeView(ViewState.EDITOR, { prompt })}
                      className="text-xs font-bold uppercase tracking-widest text-text-muted group-hover:text-sage transition-colors flex items-center gap-2"
                   >
                      <PenTool size={14} /> Write
                   </button>
                   <span className="text-[10px] font-bold text-stone-300">#{idx + 1}</span>
                </div>
             </div>
          ))}
       </div>

       <div className="text-center pt-8">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-full text-sm font-medium text-text-secondary hover:bg-stone-50 transition-all">
             <Shuffle size={16} /> Shuffle Prompts
          </button>
       </div>
    </div>
  );
};

export default PromptList;
