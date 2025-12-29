
import React, { useState } from 'react';
import { ViewState } from '../../types';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface MirrorProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

const Mirror: React.FC<MirrorProps> = ({ onChangeView }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const reflections = [
    {
      title: "The Readiness Illusion",
      text: "You've said \"I'm not ready\" several times recently. What if \"not ready\" actually means \"afraid to try\"?",
      context: "These might be different things. Sometimes the readiness we're waiting for only comes after we begin.",
      action: "Write about readiness"
    },
    {
      title: "Recurring Theme: Rest",
      text: "You mention 'tired' or 'exhausted' in 60% of your Friday entries.",
      context: "Is your current routine sustainable, or are you borrowing energy from the weekend?",
      action: "Reflect on energy"
    }
  ];

  const current = reflections[activeIndex];

  return (
    <div className="max-w-2xl mx-auto animate-fade-up text-center py-10 pb-20">
      <div className="relative w-40 h-40 mx-auto mb-12 flex items-center justify-center">
         <div className="absolute inset-0 bg-sage-subtle rounded-full animate-pulse" />
         <div className="absolute inset-4 bg-sage/20 rounded-full blur-xl" />
         <div className="relative w-full h-full border-2 border-sage/20 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <Sparkles size={48} className="text-sage opacity-80" strokeWidth={1} />
         </div>
      </div>

      <div className="mb-12">
        <span className="text-xs font-bold text-sage uppercase tracking-widest mb-4 block">Reflection {activeIndex + 1} of {reflections.length}</span>
        <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-6 leading-tight">
          {current.text}
        </h2>
        <p className="text-text-secondary font-light text-lg leading-relaxed max-w-lg mx-auto">
          {current.context}
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-xs mx-auto mb-16">
        <button 
           onClick={() => onChangeView(ViewState.EDITOR, { prompt: current.text })}
           className="w-full py-3.5 bg-text-primary text-white rounded-xl font-medium shadow-lg hover:bg-black transition-all hover:-translate-y-0.5"
        >
           {current.action}
        </button>
        <button className="w-full py-3.5 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
           Save for later
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 border-t border-stone-200 pt-8 max-w-xs mx-auto">
        <button 
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="p-3 rounded-full border border-stone-200 text-text-muted disabled:opacity-30 hover:bg-stone-50 transition-colors"
        >
           <ArrowLeft size={20} />
        </button>
        <span className="text-xs font-medium text-text-muted">
           Navigate
        </span>
        <button 
          onClick={() => setActiveIndex(Math.min(reflections.length - 1, activeIndex + 1))}
          disabled={activeIndex === reflections.length - 1}
          className="p-3 rounded-full border border-stone-200 text-text-muted disabled:opacity-30 hover:bg-stone-50 transition-colors"
        >
           <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Mirror;
