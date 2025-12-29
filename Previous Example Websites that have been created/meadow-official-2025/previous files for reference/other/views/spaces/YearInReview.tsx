import React from 'react';
import { ViewState } from '../../types';
import { Share2 } from 'lucide-react';

interface YearInReviewProps {
  onChangeView: (view: ViewState) => void;
}

const YearInReview: React.FC<YearInReviewProps> = () => {
  return (
    <div className="animate-fade-up max-w-3xl mx-auto pb-20">
      
      <div className="text-center py-16 bg-gradient-to-br from-sage-subtle to-white border border-sage/10 rounded-[48px] mb-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-sage/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         <h1 className="font-serif text-6xl text-sage mb-4 relative z-10">2024</h1>
         <p className="text-xl text-text-secondary font-light relative z-10">A year of growth and decisions</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-16">
         <YearStat value="247" label="Entries" />
         <YearStat value="48k" label="Words" />
         <YearStat value="142" label="Day Streak" />
      </div>

      <div className="space-y-8">
         <Chapter 
            number="01" 
            title="The year you questioned everything" 
            text="2024 was the year you stopped accepting things at face value. Your most common word was 'why' — appearing in 67 entries. You asked hard questions about career, relationships, and what you really want." 
         />
         <Chapter 
            number="02" 
            title="Learning to trust yourself" 
            text="The theme of 'trust' emerged in March and never left. You wrote about trusting your gut, trusting the process, and slowly, trusting yourself. By December, the word 'should' appeared 60% less than in January." 
         />
         <Chapter 
            number="03" 
            title="The people who mattered" 
            text="Sarah appeared in 23 entries—a friend who kept showing up at the right moments. Mom in 18. The conversations you documented weren't always easy, but they shaped your year." 
         />
      </div>

      <div className="mt-16 text-center">
         <button className="inline-flex items-center gap-2 px-8 py-4 bg-sage text-white rounded-full font-medium shadow-xl hover:bg-sage-dark hover:-translate-y-0.5 transition-all">
            <Share2 size={20} />
            Share Your Year
         </button>
      </div>
    </div>
  );
};

const YearStat = ({ value, label }: any) => (
   <div className="text-center p-6 bg-white border border-stone-200 rounded-[24px]">
      <div className="font-serif text-3xl font-medium text-text-primary mb-1">{value}</div>
      <div className="text-xs font-bold text-text-muted uppercase tracking-widest">{label}</div>
   </div>
);

const Chapter = ({ number, title, text }: any) => (
   <div className="bg-white p-10 rounded-[32px] border border-stone-200/60 shadow-sm hover:shadow-card-hover transition-all">
      <div className="text-xs font-bold text-sage uppercase tracking-widest mb-3">Chapter {number}</div>
      <h3 className="font-serif text-2xl text-text-primary mb-4">{title}</h3>
      <p className="text-text-secondary leading-relaxed font-light">{text}</p>
   </div>
)

export default YearInReview;
