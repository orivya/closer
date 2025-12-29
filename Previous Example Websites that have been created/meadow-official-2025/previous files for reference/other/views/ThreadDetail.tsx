import React from 'react';
import { ViewState } from '../types';
import { GitBranch, Clock } from 'lucide-react';

interface ThreadDetailProps {
  onChangeView: (view: ViewState, data?: any) => void;
  threadId?: string;
}

const ThreadDetail: React.FC<ThreadDetailProps> = ({ onChangeView, threadId }) => {
  return (
    <div className="animate-fade-up max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="bg-white rounded-[32px] p-8 lg:p-10 border border-stone-100 shadow-card">
         <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl bg-stone-50 text-sage flex items-center justify-center">
                  <GitBranch size={32} strokeWidth={1.5} />
               </div>
               <div>
                  <h2 className="font-serif text-3xl lg:text-4xl text-text-primary mb-2">Career Decision</h2>
                  <p className="text-text-secondary font-light">Tracking thoughts on the new role offer vs staying.</p>
               </div>
            </div>
            <div className="hidden sm:block text-right">
               <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Last Entry</p>
               <p className="text-text-primary font-medium">Today, 2:34 PM</p>
            </div>
         </div>

         {/* Stats Row */}
         <div className="grid grid-cols-3 gap-4 border-t border-stone-100 pt-6">
            <div className="text-center sm:text-left">
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Entries</p>
               <p className="font-serif text-2xl text-text-primary">8</p>
            </div>
            <div className="text-center sm:text-left">
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Time Span</p>
               <p className="font-serif text-2xl text-text-primary">12 Days</p>
            </div>
            <div className="text-center sm:text-left">
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Avg Mood</p>
               <p className="font-serif text-2xl text-text-primary">Mixed</p>
            </div>
         </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0 relative pl-4 sm:pl-0">
         
         {[1, 2, 3].map((i, index, arr) => (
            <div key={i} className="flex gap-6 relative group">
               {/* Timeline Connector */}
               <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full border-2 border-white box-content z-10 ${i===1 ? 'bg-sage ring-4 ring-sage/10' : 'bg-stone-300'}`} />
                  {index !== arr.length - 1 && (
                     <div className="w-0.5 bg-stone-200 flex-1 my-1" />
                  )}
               </div>

               <div className="flex-1 pb-10">
                  <div className="bg-white p-6 lg:p-8 rounded-[24px] border border-transparent shadow-sm hover:shadow-card hover:border-sage/10 transition-all cursor-pointer">
                     <div className="flex gap-4 mb-3">
                        <span className="text-xs font-bold text-sage uppercase tracking-wide bg-sage-subtle px-2 py-1 rounded-md">Dec {17-i}</span>
                        <span className="text-xs font-medium text-text-muted flex items-center gap-1"><Clock size={12} /> {8+i}:00 PM</span>
                     </div>
                     <h4 className="font-serif text-xl text-text-primary mb-3 group-hover:text-sage-dark transition-colors">
                        {i === 1 ? 'Thinking about the long term' : i === 2 ? 'Pros and cons list' : 'Initial gut feeling'}
                     </h4>
                     <p className="text-text-secondary text-sm leading-relaxed font-light line-clamp-2">
                        {i === 1 ? "I keep coming back to the idea of autonomy. Does this new role actually give me more freedom, or just more different responsibilities?" : 
                        "Money is better, sure. But the commute and the culture shift might drain me differently."}
                     </p>
                  </div>
               </div>
            </div>
         ))}
      </div>
      
      <div className="flex justify-center pt-4">
         <button 
            onClick={() => onChangeView(ViewState.EDITOR, { prompt: 'New entry for Career Decision' })}
            className="bg-text-primary text-white px-8 py-3 rounded-full font-medium shadow-lg hover:-translate-y-0.5 transition-all"
         >
            Add to Thread
         </button>
      </div>
    </div>
  );
};

export default ThreadDetail;