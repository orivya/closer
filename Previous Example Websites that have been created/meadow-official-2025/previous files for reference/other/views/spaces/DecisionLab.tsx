
import React, { useState } from 'react';
import { ViewState } from '../../types';
import { Scale, Plus, ThumbsUp, ThumbsDown, PenTool, BookOpen, AlertCircle } from 'lucide-react';

interface DecisionLabProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

const DecisionLab: React.FC<DecisionLabProps> = ({ onChangeView }) => {
  const [decision, setDecision] = useState('Should I take the promotion?');
  const [pros, setPros] = useState(['More responsibility and growth', 'Better salary and benefits', 'Recognition of my work']);
  const [cons, setCons] = useState(['More stress and longer hours', 'Less time for creative work']);

  return (
    <div className="max-w-4xl mx-auto animate-fade-up pb-20">
      <div className="text-center mb-12">
         <div className="w-16 h-16 rounded-2xl bg-amber-50/50 text-amber-600 flex items-center justify-center mx-auto mb-6 border border-amber-100">
            <Scale size={28} strokeWidth={1.5} />
         </div>
         <h2 className="font-serif text-3xl font-medium text-text-primary mb-2">Decision Lab</h2>
         <p className="text-text-secondary font-light">Structure your thinking to find clarity</p>
      </div>

      <div className="mb-12">
        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-3 text-center">What are you deciding?</label>
        <input 
          type="text" 
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          className="w-full text-center font-serif text-2xl lg:text-3xl text-text-primary border-b-2 border-stone-200 focus:border-sage bg-transparent pb-4 focus:outline-none transition-colors"
          placeholder="Type your decision here..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Pros */}
        <div className="bg-white p-8 rounded-[32px] border-t-4 border-t-sage border-r border-b border-l border-stone-200/60 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-sage-dark font-medium justify-center md:justify-start">
            <ThumbsUp size={18} />
            <span>Reasons For</span>
          </div>
          <ul className="space-y-3 mb-6">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-dark mt-1.5 shrink-0" />
                {pro}
              </li>
            ))}
          </ul>
          <button className="w-full py-3 border border-dashed border-stone-300 rounded-xl text-sm text-text-muted hover:text-sage-dark hover:border-sage transition-colors flex items-center justify-center gap-2">
            <Plus size={16} /> Add Reason
          </button>
        </div>

        {/* Cons */}
        <div className="bg-white p-8 rounded-[32px] border-t-4 border-t-clay border-r border-b border-l border-stone-200/60 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-clay font-medium justify-center md:justify-start">
            <ThumbsDown size={18} />
            <span>Reasons Against</span>
          </div>
          <ul className="space-y-3 mb-6">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-clay mt-1.5 shrink-0" />
                {con}
              </li>
            ))}
          </ul>
          <button className="w-full py-3 border border-dashed border-stone-300 rounded-xl text-sm text-text-muted hover:text-clay hover:border-clay transition-colors flex items-center justify-center gap-2">
            <Plus size={16} /> Add Reason
          </button>
        </div>
      </div>

      <h3 className="font-serif text-xl text-text-primary mb-6 text-center">Deepening Tools</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ToolCard 
          icon={PenTool} 
          title="Letter to Future Self" 
          desc="Write to yourself 6 months from now about this choice."
          onClick={() => onChangeView(ViewState.EDITOR, { prompt: `Letter to myself 6 months after deciding: "${decision}"` })}
        />
        <ToolCard 
          icon={BookOpen} 
          title="Mentor's Advice" 
          desc="What would your wisest mentor tell you to do?"
          onClick={() => onChangeView(ViewState.EDITOR, { prompt: `What would my mentor say about: "${decision}"?` })}
        />
        <ToolCard 
          icon={AlertCircle} 
          title="Fear Setting" 
          desc="What exactly are you afraid will happen?"
          onClick={() => onChangeView(ViewState.EDITOR, { prompt: `Defining the fears around: "${decision}"` })}
        />
      </div>
    </div>
  );
};

const ToolCard = ({ icon: Icon, title, desc, onClick }: any) => (
  <button 
    onClick={onClick}
    className="bg-white p-6 rounded-2xl border border-stone-200 text-left hover:border-sage/40 hover:shadow-md transition-all group"
  >
    <div className="w-10 h-10 rounded-xl bg-stone-50 text-text-muted flex items-center justify-center mb-4 group-hover:bg-sage/10 group-hover:text-sage transition-colors">
      <Icon size={20} strokeWidth={1.5} />
    </div>
    <h4 className="font-medium text-text-primary mb-1">{title}</h4>
    <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
  </button>
)

export default DecisionLab;
