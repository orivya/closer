
import React, { useState, useEffect } from 'react';
import { ViewState, JourneyStep } from '../types';
import { X, Timer, ArrowRight, Sun, Cloud, Heart, Check, Clock } from 'lucide-react';
import { JournalService } from '../services/journal';

interface SessionProps {
  onChangeView: (view: ViewState, data?: any) => void;
  step: JourneyStep;
  journeyId: string;
  stepIndex?: number;
}

type SessionStage = 'intro' | 'rapid-fire' | 'transition' | 'deep-dive' | 'outro';

const Session: React.FC<SessionProps> = ({ onChangeView, step, journeyId, stepIndex = 0 }) => {
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
  const [hasStartedDeepDive, setHasStartedDeepDive] = useState(false);

  // --- STAGE 1: INTRO ANIMATION ---
  useEffect(() => {
      if (stage === 'intro') {
          const timer = setTimeout(() => setStage('rapid-fire'), 2000);
          return () => clearTimeout(timer);
      }
  }, [stage]);

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

  const handleNextRapidQuestion = () => {
      if (!currentRapidAnswer.trim()) return;
      
      const newAnswers = [...rapidAnswers, currentRapidAnswer];
      setRapidAnswers(newAnswers);
      setCurrentRapidAnswer('');
      
      // Use provided questions or defaults if none exist
      const questions = step.questions || ["What's on your mind?", "How do you feel?", "What matters?"];

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
      // Consolidate Data
      const questions = step.questions || [];
      let fullEntry = `## Rapid Reflection\n\n`;
      questions.forEach((q, i) => {
          fullEntry += `**${q}**\n${rapidAnswers[i] || 'Skipped'}\n\n`;
      });
      fullEntry += `## Deep Dive: ${step.prompt}\n\n${content}`;

      // Save
      await JournalService.createEntry(
          `${step.title} (Day ${step.day})`,
          fullEntry,
          ['journey', journeyId]
      );

      // Update Progress
      const currentProgress = JSON.parse(localStorage.getItem(`journey-${journeyId}-progress`) || '[]');
      if (!currentProgress.includes(stepIndex)) {
          currentProgress.push(stepIndex);
          localStorage.setItem(`journey-${journeyId}-progress`, JSON.stringify(currentProgress));
      }

      onChangeView(ViewState.JOURNEY_DETAIL, { id: journeyId });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const questions = step.questions || ["What's on your mind?", "How do you feel?", "What matters?"];

  // Logic for timer fade
  // Visible: 5:00 -> 4:50 (300 -> 290)
  // Faded: 4:50 -> 1:00 (290 -> 60)
  // Visible: 1:00 -> 0:00 (60 -> 0)
  const isTimerFaded = isTimerRunning && timeLeft < 290 && timeLeft > 60;

  // --- RENDERERS ---

  if (stage === 'intro') {
      return (
          <div className="fixed inset-0 bg-stone-900 z-50 flex flex-col items-center justify-center text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 animate-fade-up">Day {step.day}</span>
              <h1 className="font-serif text-5xl animate-fade-up" style={{ animationDelay: '100ms' }}>{step.title}</h1>
          </div>
      );
  }

  if (stage === 'rapid-fire') {
      const progress = ((questionIndex) / questions.length) * 100;
      
      return (
          <div className="fixed inset-0 bg-[#faf9f7] z-50 flex flex-col">
              <div className="w-full h-1 bg-stone-200">
                  <div className="h-full bg-sage transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              
              <button onClick={() => onChangeView(ViewState.JOURNEY_DETAIL, { id: journeyId })} className="absolute top-6 left-6 p-2 rounded-full hover:bg-stone-100">
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
                    className="w-full bg-transparent border-b-2 border-stone-200 py-4 text-xl text-center focus:outline-none focus:border-sage transition-colors text-text-primary placeholder:text-stone-300"
                  />
                  <div className="mt-8 opacity-50 text-xs uppercase tracking-widest">Press Enter</div>
              </div>
          </div>
      );
  }

  if (stage === 'transition') {
      return (
          <div className="fixed inset-0 bg-sage-dark z-50 flex flex-col items-center justify-center text-white animate-fade-in">
              <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center mb-6 animate-pulse">
                  <Clock size={32} />
              </div>
              <h2 className="font-serif text-3xl">Go Deeper</h2>
              <p className="mt-2 text-white/60">5 minutes of uninterrupted flow.</p>
          </div>
      );
  }

  // DEEP DIVE (Writing)
  return (
    <div className="fixed inset-0 bg-[#faf9f7] z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between border-b border-stone-100 bg-white/50 backdrop-blur-sm transition-all duration-500">
         <div className="flex items-center gap-4">
             <div className={`
                 flex items-center gap-2 font-medium font-serif text-lg tabular-nums transition-all duration-[2000ms] ease-in-out
                 ${isTimerRunning ? 'text-sage-dark' : 'text-stone-400'}
                 ${isTimerFaded ? 'opacity-20 blur-[1px]' : 'opacity-100 blur-0'}
             `}>
                 <Timer size={20} />
                 <span>{formatTime(timeLeft)}</span>
             </div>
         </div>
         
         <button 
            onClick={handleComplete}
            className="px-6 py-2 bg-text-primary text-white rounded-full font-medium shadow-lg hover:bg-black transition-all flex items-center gap-2"
         >
            Finish <Check size={16} />
         </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 scroll-smooth">
         <div className="max-w-2xl mx-auto pt-12 pb-32">
             {!hasStartedDeepDive ? (
                 <div className="text-center py-20 animate-fade-up">
                     <h2 className="font-serif text-4xl text-text-primary mb-6 leading-tight">{step.prompt}</h2>
                     <p className="text-text-secondary mb-10 max-w-md mx-auto">
                        Don't overthink. Don't edit. Just write for 5 minutes until the timer ends.
                     </p>
                     <button 
                        onClick={handleStartDeepDive}
                        className="px-10 py-4 bg-sage text-white rounded-full text-lg font-medium shadow-xl hover:bg-sage-dark hover:scale-105 transition-all"
                     >
                        Start 5 Minutes
                     </button>
                 </div>
             ) : (
                 <div className="animate-fade-in">
                     <div className="mb-8 p-6 bg-white border border-stone-100 rounded-2xl shadow-sm">
                        <span className="text-xs font-bold text-sage uppercase tracking-widest mb-2 block">The Prompt</span>
                        <p className="font-serif text-xl text-text-primary">{step.prompt}</p>
                     </div>
                     <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Let it flow..."
                        className="w-full h-[60vh] bg-transparent border-none resize-none text-xl font-serif text-text-primary placeholder:text-stone-300 focus:ring-0 leading-relaxed"
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
