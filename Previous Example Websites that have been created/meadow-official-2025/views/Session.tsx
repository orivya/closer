import React, { useState, useEffect } from 'react';
import { ViewState, JourneyStep } from '../types';
import { X, Timer, ArrowRight, Sun, Cloud, Heart, Check, Clock, Loader2 } from 'lucide-react';
import { JournalService } from '../services/journal';
import { JourneyProgressService } from '../services/journeyProgress';
import { toast } from 'sonner';
import { JOURNEYS } from '../data/content';

interface SessionProps {
  onChangeView: (view: ViewState, data?: any) => void;
  step?: JourneyStep;
  journeyId?: string;
  stepIndex?: number;
}

type SessionStage = 'intro' | 'rapid-fire' | 'transition' | 'deep-dive' | 'outro';

const Session: React.FC<SessionProps> = ({ onChangeView, step, journeyId, stepIndex }) => {
  const [resolvedStep, setResolvedStep] = useState<JourneyStep | null>(step ?? null);
  const [resolvedJourneyId, setResolvedJourneyId] = useState<string | null>(journeyId ?? null);
  const [resolvedStepIndex, setResolvedStepIndex] = useState<number>(typeof stepIndex === 'number' ? stepIndex : step ? Math.max(0, (step.day ?? 1) - 1) : 0);
  const [isHydrating, setIsHydrating] = useState<boolean>(() => !step);
  const [hydrateError, setHydrateError] = useState<string | null>(null);

  const [stage, setStage] = useState<SessionStage>('intro');
  
  // Rapid Fire State
  const [questionIndex, setQuestionIndex] = useState(0);
  const [rapidAnswers, setRapidAnswers] = useState<string[]>([]);
  const [currentRapidAnswer, setCurrentRapidAnswer] = useState('');
  
  // Deep Dive State
  const [content, setContent] = useState('');
  // 5 Minutes = 300 Seconds
  const [timeLeft, setTimeLeft] = useState(60 * 5); 
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasStartedDeepDive, setHasStartedDeepDive] = useState(false);

  // Hydrate session step when opened via deeplink/refresh (no in-memory step provided)
  useEffect(() => {
    setResolvedJourneyId(journeyId ?? null);

    // If caller provided a step, prefer it.
    if (step) {
      setResolvedStep(step);
      setResolvedStepIndex(typeof stepIndex === 'number' ? stepIndex : Math.max(0, (step.day ?? 1) - 1));
      setHydrateError(null);
      setIsHydrating(false);
      return;
    }

    // No step passed in: compute the current step from journey progress.
    if (!journeyId) {
      setResolvedStep(null);
      setHydrateError('missing_journey');
      setIsHydrating(false);
      return;
    }

    let cancelled = false;
    const hydrate = async () => {
      setIsHydrating(true);
      setHydrateError(null);

      try {
        const template = JOURNEYS.find((j) => j.id === journeyId);
        if (!template) {
          throw new Error('Journey not found');
        }

        const progress = await JourneyProgressService.getProgress(journeyId);
        const completed = progress?.completed_steps ?? [];
        const completedCount = new Set(completed).size;
        const isComplete = completedCount >= template.steps.length;

        let idx = 0;
        if (isComplete) idx = Math.max(0, template.steps.length - 1);
        else if (completed.length === 0) idx = 0;
        else idx = Math.min(Math.max(...completed) + 1, template.steps.length - 1);

        const nextStep = template.steps[idx];
        if (!nextStep) {
          throw new Error('No step available');
        }

        if (cancelled) return;
        setResolvedStep(nextStep);
        setResolvedStepIndex(idx);
      } catch (e) {
        if (cancelled) return;
        console.error('[SESSION_DEBUG] Failed to hydrate session step', e);
        setResolvedStep(null);
        setHydrateError('failed');
      } finally {
        if (cancelled) return;
        setIsHydrating(false);
      }
    };

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [journeyId, step, stepIndex]);

  // --- STAGE 1: INTRO ANIMATION ---
  useEffect(() => {
    if (isHydrating || !resolvedStep) return;
    if (stage === 'intro') {
      const timer = setTimeout(() => setStage('rapid-fire'), 2000);
      return () => clearTimeout(timer);
    }
  }, [isHydrating, resolvedStep, stage]);

  // --- STAGE 4: TIMER LOGIC ---
  useEffect(() => {
    let interval: any = null;
    if (stage === 'deep-dive' && isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, stage]);

  if (isHydrating) {
    return (
      <div className="fixed inset-0 bg-dark-base z-50 flex flex-col items-center justify-center text-center p-8">
        <Loader2 className="w-10 h-10 text-sage animate-spin mb-4" />
        <p className="text-text-secondary">Loading session…</p>
      </div>
    );
  }

  if (!resolvedJourneyId || !resolvedStep) {
    return (
      <div className="fixed inset-0 bg-dark-base z-50 flex flex-col items-center justify-center text-center p-8">
        <h2 className="font-serif text-3xl text-text-primary mb-3">Session unavailable</h2>
        <p className="text-text-secondary mb-8 max-w-md">
          {hydrateError === 'missing_journey'
            ? 'This session link is missing a journey ID.'
            : "We couldn't load this journey session. Please return to the journey and start again."}
        </p>
        <button
          onClick={() => onChangeView(ViewState.EXPLORE)}
          className="px-6 py-3 bg-sage text-white rounded-full font-medium shadow-glow hover:shadow-glow-lg transition-all"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  const effectiveStep = resolvedStep;
  const effectiveStepIndex = resolvedStepIndex;

  const handleNextRapidQuestion = () => {
      if (!currentRapidAnswer.trim()) return;
      
      const newAnswers = [...rapidAnswers, currentRapidAnswer];
      setRapidAnswers(newAnswers);
      setCurrentRapidAnswer('');
      
      // Use provided questions or defaults if none exist
      const questions = effectiveStep.questions || ["What's on your mind?", "How do you feel?", "What matters?"];

      if (questionIndex < questions.length - 1) {
          setQuestionIndex(questionIndex + 1);
      } else {
          setStage('transition');
          setTimeout(() => setStage('deep-dive'), 2500); // Breathe transition
      }
  };

  const handleStartDeepDive = () => {
      setHasStartedDeepDive(true);
      setIsTimerRunning(true);
  };

  const handleComplete = async () => {
      if (isSaving) return;
      
      setIsSaving(true);
      
      try {
        // Consolidate Data
        const questions = effectiveStep.questions || [];
        let fullEntry = `## Rapid Reflection\n\n`;
        questions.forEach((q, i) => {
            fullEntry += `**${q}**\n${rapidAnswers[i] || 'Skipped'}\n\n`;
        });
        fullEntry += `## Deep Dive: ${effectiveStep.prompt}\n\n${content}`;

        if (import.meta.env.DEV) {
          console.log('[SESSION_DEBUG] Saving journey entry', {
            title: `${effectiveStep.title} (Day ${effectiveStep.day})`,
            contentLength: fullEntry.length,
            journeyId: resolvedJourneyId,
          });
        }

        // Save journal entry
        const savedEntry = await JournalService.createEntry(
            `${effectiveStep.title} (Day ${effectiveStep.day})`,
            fullEntry,
            ['journey', resolvedJourneyId]
        );

        if (import.meta.env.DEV) {
          console.log('[SESSION_DEBUG] Entry saved successfully', { entryId: savedEntry?.id });
        }

        // Mark step as complete in journey progress
        try {
          await JourneyProgressService.completeStep(resolvedJourneyId, effectiveStepIndex);
          if (import.meta.env.DEV) {
            console.log('[SESSION_DEBUG] Journey step marked complete', { journeyId: resolvedJourneyId, stepIndex: effectiveStepIndex });
          }
        } catch (progressError) {
          console.error('[SESSION_DEBUG] Failed to update progress:', progressError);
          // Don't fail the whole save if progress update fails
        }

        toast.success('Session saved!');
        onChangeView(ViewState.JOURNEY_DETAIL, { id: resolvedJourneyId });
      } catch (error) {
        console.error('[SESSION_DEBUG] Failed to save entry:', error);
        toast.error('Failed to save your entry. Please try again.');
        setIsSaving(false);
      }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const questions = effectiveStep.questions || ["What's on your mind?", "How do you feel?", "What matters?"];

  // Logic for timer fade
  // Visible: 5:00 -> 4:50 (300 -> 290)
  // Faded: 4:50 -> 1:00 (290 -> 60)
  // Visible: 1:00 -> 0:00 (60 -> 0)
  const isTimerFaded = isTimerRunning && timeLeft < 290 && timeLeft > 60;

  // --- RENDERERS ---

  if (stage === 'intro') {
      return (
          <div className="fixed inset-0 bg-dark-base z-50 flex flex-col items-center justify-center text-text-primary">
              <span className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4 animate-fade-up">Day {effectiveStep.day}</span>
              <h1 className="font-serif text-5xl animate-fade-up" style={{ animationDelay: '100ms' }}>{effectiveStep.title}</h1>
          </div>
      );
  }

  if (stage === 'rapid-fire') {
      const progress = ((questionIndex) / questions.length) * 100;

      return (
          <div className="fixed inset-0 bg-dark-base z-50 flex flex-col">
              <div className="w-full h-1 bg-dark-surface">
                  <div className="h-full bg-sage shadow-glow transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>

              <button onClick={() => onChangeView(ViewState.JOURNEY_DETAIL, { id: resolvedJourneyId })} className="absolute top-6 left-6 p-2 rounded-full hover:bg-dark-hover">
                  <X size={24} className="text-text-secondary" />
              </button>

              <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto w-full">
                  <span className="text-xs font-bold text-sage uppercase tracking-widest mb-6 animate-fade-in">Quick Fire {questionIndex + 1}/{questions.length}</span>
                  <h2 className="font-serif text-3xl md:text-4xl text-text-primary text-center mb-12 leading-tight animate-fade-up">
                      {questions[questionIndex]}
                  </h2>
                  <input
                    autoFocus
                    type="text"
                    value={currentRapidAnswer}
                    onChange={(e) => setCurrentRapidAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNextRapidQuestion()}
                    placeholder="Type your answer..."
                    className="w-full bg-transparent border-b-2 border-dark-border py-4 text-xl text-center focus:outline-none focus:border-sage transition-colors text-text-primary placeholder:text-text-muted"
                  />
                  <div className="mt-8 opacity-50 text-xs uppercase tracking-widest text-text-muted">Press Enter</div>
              </div>
          </div>
      );
  }

  if (stage === 'transition') {
      return (
          <div className="fixed inset-0 bg-dark-base z-50 flex flex-col items-center justify-center text-text-primary animate-fade-in">
              <div className="w-16 h-16 rounded-full border-2 border-sage/30 flex items-center justify-center mb-6 animate-pulse shadow-glow">
                  <Clock size={32} className="text-sage" />
              </div>
              <h2 className="font-serif text-3xl">Go Deeper</h2>
              <p className="mt-2 text-text-secondary">5 minutes of uninterrupted flow.</p>
          </div>
      );
  }

  // DEEP DIVE (Writing)
  return (
    <div className="fixed inset-0 bg-dark-base z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between border-b border-dark-border bg-dark-surface/50 backdrop-blur-sm transition-all duration-500">
         <div className="flex items-center gap-4">
             <div className={`
                 flex items-center gap-2 font-medium font-serif text-lg tabular-nums transition-all duration-[2000ms] ease-in-out
                 ${isTimerRunning ? 'text-sage' : 'text-text-muted'}
                 ${isTimerFaded ? 'opacity-20 blur-[1px]' : 'opacity-100 blur-0'}
             `}>
                 <Timer size={20} />
                 <span>{formatTime(timeLeft)}</span>
             </div>
         </div>

         <button
            onClick={handleComplete}
            disabled={isSaving}
            className="px-6 py-2 bg-sage text-white rounded-full font-medium shadow-glow hover:shadow-glow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
         >
            {isSaving ? (
              <>Saving <Loader2 size={16} className="animate-spin" /></>
            ) : (
              <>Finish <Check size={16} /></>
            )}
         </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 scroll-smooth">
         <div className="max-w-2xl mx-auto pt-12 pb-32">
             {!hasStartedDeepDive ? (
                 <div className="text-center py-20 animate-fade-up">
                     <h2 className="font-serif text-4xl text-text-primary mb-6 leading-tight">{effectiveStep.prompt}</h2>
                     <p className="text-text-secondary mb-10 max-w-md mx-auto">
                        Don't overthink. Don't edit. Just write for 5 minutes until the timer ends.
                     </p>
                     <button
                        onClick={handleStartDeepDive}
                        className="px-10 py-4 bg-sage text-white rounded-full text-lg font-medium shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all"
                     >
                        Start 5 Minutes
                     </button>
                 </div>
             ) : (
                 <div className="animate-fade-in">
                     <div className="mb-8 p-6 glass-card rounded-2xl">
                        <span className="text-xs font-bold text-sage uppercase tracking-widest mb-2 block">The Prompt</span>
                        <p className="font-serif text-xl text-text-primary">{effectiveStep.prompt}</p>
                     </div>
                     <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Let it flow..."
                        className="w-full h-[60vh] bg-transparent border-none resize-none text-xl font-serif text-text-primary placeholder:text-text-muted focus:ring-0 leading-relaxed"
                        autoFocus
                     />
                 </div>
             )}
         </div>
      </div>
    </div>
  );
};

export default Session;
