
import React, { useState, useMemo, useEffect } from 'react';
import { ViewState } from '../types';
import { JOURNEYS } from '../data/content';
import { CheckCircle2, Lock, Play, Clock, Loader2 } from 'lucide-react';
import { JourneyProgressService, JourneyProgress } from '../services/journeyProgress';

interface JourneyDetailProps {
  onChangeView: (view: ViewState, data?: any) => void;
  journeyId?: string;
}

const JourneyDetail: React.FC<JourneyDetailProps> = ({ onChangeView, journeyId }) => {
  // Logic to find the journey or default to the first one
  const journeyTemplate = JOURNEYS.find(j => j.id === journeyId) || JOURNEYS[0];

  // Journey progress from database
  const [progress, setProgress] = useState<JourneyProgress | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await JourneyProgressService.getProgress(journeyTemplate.id);
        setProgress(data);
      } catch (err) {
        console.error('Failed to load journey progress:', err);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadProgress();
  }, [journeyTemplate.id]);

  const completedSteps = progress?.completed_steps || [];
  const completedSet = new Set(completedSteps);
  const completedCount = completedSet.size;
  const isComplete = completedCount >= journeyTemplate.steps.length;

  const currentIndex = useMemo(() => {
    if (isComplete) return -1;
    if (completedSteps.length === 0) return 0;
    const max = Math.max(...completedSteps);
    return Math.min(max + 1, journeyTemplate.steps.length - 1);
  }, [isComplete, completedSteps, journeyTemplate.steps.length]);

  const steps = journeyTemplate.steps.map((step, idx) => {
    if (completedSet.has(idx)) return { ...step, status: 'completed' as const };
    if (idx === currentIndex) return { ...step, status: 'current' as const };
    return { ...step, status: 'locked' as const };
  });
  const progressPercent = Math.round((completedCount / journeyTemplate.totalDays) * 100);

  return (
    <div className="animate-fade-up max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-12 text-center">
         <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-sage-subtle text-sage text-xs font-bold uppercase tracking-widest mb-6 border border-sage-border">
            <Clock size={12} /> 5 Min
         </div>
         <h2 className="font-serif text-5xl text-text-primary mb-4">{journeyTemplate.title}</h2>
         <p className="text-text-secondary max-w-md mx-auto leading-relaxed text-lg font-light">
            {journeyTemplate.description}
         </p>
      </div>

      {/* Progress */}
      <div className="glass-card p-8 rounded-[32px] mb-10">
         <div className="flex justify-between items-end mb-4">
            <div>
               <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Your Progress</p>
               <p className="font-serif text-2xl text-text-primary">Day {completedCount} of {journeyTemplate.totalDays}</p>
            </div>
            <div className="text-sage font-bold">{progressPercent}%</div>
         </div>
         <div className="h-2 w-full bg-dark-hover rounded-full overflow-hidden">
            <div className="h-full bg-sage shadow-glow rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
         </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-8 pl-4 sm:pl-0">
         {/* Vertical Line */}
         <div className="absolute left-[27px] sm:left-[39px] top-8 bottom-8 w-0.5 bg-dark-border -z-10" />

         {steps.map((step, index) => (
            <div key={step.day} className="flex gap-6 sm:gap-8 items-start group">
               {/* Icon Status */}
               <div className={`
                  w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 border-4 border-dark-base z-10 transition-all duration-300
                  ${step.status === 'completed' ? 'bg-sage text-white shadow-glow' :
                    step.status === 'current' ? 'bg-dark-surface border-sage text-sage shadow-glow-lg scale-105' :
                    'bg-dark-surface text-text-muted border-dark-surface'}
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
                       className="px-6 py-2.5 bg-sage text-white rounded-full text-sm font-medium shadow-glow hover:shadow-glow-lg transition-all hover:-translate-y-0.5"
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
