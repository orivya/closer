
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { JOURNEYS } from '../data/content';
import { CheckCircle2, Lock, Play, Clock } from 'lucide-react';

interface JourneyDetailProps {
  onChangeView: (view: ViewState, data?: any) => void;
  journeyId?: string;
}

const JourneyDetail: React.FC<JourneyDetailProps> = ({ onChangeView, journeyId }) => {
  // Logic to find the journey or default to the first one
  const journeyTemplate = JOURNEYS.find(j => j.id === journeyId) || JOURNEYS[0];
  
  // Local state to simulate progress for the demo
  // In the real app, this would come from the database
  const [steps, setSteps] = useState(journeyTemplate.steps);

  // If we just finished a session, mark that step as complete
  useEffect(() => {
    // Check if we have progress saved in localStorage (simple demo persistence)
    const savedProgress = localStorage.getItem(`journey-${journeyId}-progress`);
    if (savedProgress) {
        const completedIndices = JSON.parse(savedProgress);
        setSteps(prev => prev.map((step, idx) => {
            if (completedIndices.includes(idx)) return { ...step, status: 'completed' };
            // If the previous one is completed, unlock this one
            if (idx > 0 && completedIndices.includes(idx - 1) && !completedIndices.includes(idx)) return { ...step, status: 'current' };
            return step;
        }));
    }
  }, [journeyId]);

  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / journeyTemplate.totalDays) * 100);

  return (
    <div className="animate-fade-up max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-12 text-center">
         <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-sage/10 text-sage-dark text-xs font-bold uppercase tracking-widest mb-6">
            <Clock size={12} /> 5 Min
         </div>
         <h2 className="font-serif text-5xl text-text-primary mb-4">{journeyTemplate.title}</h2>
         <p className="text-text-secondary max-w-md mx-auto leading-relaxed text-lg font-light">
            {journeyTemplate.description}
         </p>
      </div>

      {/* Progress */}
      <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-card mb-10">
         <div className="flex justify-between items-end mb-4">
            <div>
               <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Your Progress</p>
               <p className="font-serif text-2xl text-text-primary">Day {completedCount} of {journeyTemplate.totalDays}</p>
            </div>
            <div className="text-sage font-bold">{progressPercent}%</div>
         </div>
         <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-sage rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
         </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-8 pl-4 sm:pl-0">
         {/* Vertical Line */}
         <div className="absolute left-[27px] sm:left-[39px] top-8 bottom-8 w-0.5 bg-stone-200 -z-10" />

         {steps.map((step, index) => (
            <div key={step.day} className="flex gap-6 sm:gap-8 items-start group">
               {/* Icon Status */}
               <div className={`
                  w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 border-4 border-[#faf9f7] z-10 transition-all duration-300
                  ${step.status === 'completed' ? 'bg-sage text-white shadow-lg shadow-sage/20' : 
                    step.status === 'current' ? 'bg-white border-sage text-sage shadow-xl scale-105' : 
                    'bg-white text-stone-300 border-white'}
               `}>
                  {step.status === 'completed' && <CheckCircle2 size={24} />}
                  {step.status === 'current' && <Play size={24} fill="currentColor" />}
                  {step.status === 'locked' && <Lock size={20} />}
               </div>

               {/* Content */}
               <div className={`
                  flex-1 pt-2 transition-opacity duration-300
                  ${step.status === 'locked' ? 'opacity-50 blur-[1px]' : 'opacity-100'}
               `}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
                     <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Day {step.day}</span>
                  </div>
                  <h4 className="font-serif text-xl text-text-primary mb-1">{step.title}</h4>
                  <p className="text-sm text-text-secondary font-light leading-relaxed mb-4">{step.subtitle}</p>
                  
                  {step.status === 'current' && (
                     <button 
                       onClick={() => onChangeView(ViewState.JOURNEY_SESSION, { step, journeyId: journeyTemplate.id, stepIndex: index })}
                       className="px-6 py-2.5 bg-sage text-white rounded-full text-sm font-medium shadow-lg shadow-sage/20 hover:bg-sage-dark transition-all hover:-translate-y-0.5"
                     >
                        Begin Session
                     </button>
                  )}
                  {step.status === 'completed' && (
                     <div className="text-xs font-bold text-sage uppercase tracking-wide flex items-center gap-1">
                         <CheckCircle2 size={12} /> Completed
                     </div>
                  )}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default JourneyDetail;
