import React, { useState } from 'react';
import { Search, Heart, Brain, Sparkles, AlertTriangle, ClipboardList, RefreshCcw, Lightbulb, ChevronRight, Check } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface GoalAutopsyProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'goal' | 'what-happened' | 'root-cause' | 'patterns' | 'lessons' | 'next-time' | 'summary';

export default function GoalAutopsy({ onBack, onComplete }: GoalAutopsyProps) {
  const [step, setStep] = useState<Step>('goal');
  const [data, setData] = useState({
    goal: '',
    outcome: 'abandoned' as 'abandoned' | 'failed' | 'pivoted',
    whatHappened: '',
    rootCause: '',
    patterns: '',
    lessons: '',
    nextTime: '',
    gratitude: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['goal', 'what-happened', 'root-cause', 'patterns', 'lessons', 'next-time', 'summary'];
  // Correction: Above array literal was syntax error in thought but here I must be careful.
  // Actually I'll copy the steps array from original file but string literals.
  const stepsList: Step[] = ['goal', 'what-happened', 'root-cause', 'patterns', 'lessons', 'next-time', 'summary'];
  const currentIndex = stepsList.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < stepsList.length) {
      setStep(stepsList[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const outcomeLabels = {
      abandoned: 'Abandoned',
      failed: 'Did Not Succeed',
      pivoted: 'Pivoted/Changed',
    };
    const title = `Goal Autopsy: ${data.goal.slice(0, 40)}${data.goal.length > 40 ? '...' : ''}`;
    const content = `## Goal Autopsy\n\n### The Goal\n${data.goal}\n**Outcome:** ${outcomeLabels[data.outcome]}\n\n### What Happened\n${data.whatHappened}\n\n### Root Cause Analysis\n${data.rootCause}\n\n### Patterns I Notice\n${data.patterns}\n\n### Lessons Learned\n${data.lessons}\n\n### What I'll Do Differently\n${data.nextTime}\n\n${data.gratitude ? `### Gratitude\n${data.gratitude}` : ''}\n\n---\n*This is not failure—it's data. Created with Goal Autopsy.*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const canProceed = () => {
    switch (step) {
      case 'goal': return data.goal.trim().length > 0;
      case 'what-happened': return data.whatHappened.trim().length > 0;
      case 'root-cause': return data.rootCause.trim().length > 0;
      case 'patterns': return data.patterns.trim().length > 0;
      case 'lessons': return data.lessons.trim().length > 0;
      case 'next-time': return data.nextTime.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  return (
    <WizardLayout
      title="Goal Autopsy"
      icon={Search}
      step={currentIndex}
      totalSteps={stepsList.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'summary' ? 'Save Autopsy' : 'Continue'}
      color="sage"
    >
      {/* Compassionate header for first step */}
      {step === 'goal' && (
        <div className="max-w-lg mx-auto mb-8 animate-fade-in">
          <div className="bg-sage-50 rounded-2xl p-4 border border-sage-100 flex items-start gap-3">
            <Heart className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-stone-600 leading-relaxed">
              <span className="text-sage-700 font-bold">This is brave work.</span> Looking at goals that didn't pan out isn't about blame—it's about learning. Be gentle with yourself.
            </p>
          </div>
        </div>
      )}

      {step === 'goal' && (
        <div className="text-center">
          <div className="mb-6">
            <h2 className="font-serif text-3xl text-sage-900 mb-2">The Goal</h2>
            <p className="text-stone-500">What goal didn't work out?</p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.goal}
              onChange={(e) => setData({ ...data, goal: e.target.value })}
              placeholder="Describe the goal you're examining..."
              className="w-full h-32 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>

          <div className="max-w-xl mx-auto text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3 ml-2">What happened?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { value: 'abandoned', label: 'I let it go' },
                { value: 'failed', label: "Didn't succeed" },
                { value: 'pivoted', label: 'Changed direction' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setData({ ...data, outcome: option.value as any })}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border flex items-center justify-center gap-2 ${data.outcome === option.value
                    ? 'bg-sage-50 text-sage-900 border-sage-200 ring-1 ring-sage-200'
                    : 'bg-white text-stone-500 border-stone-100 hover:border-sage-100 hover:text-sage-600'
                    }`}
                >
                  {data.outcome === option.value && <Check size={14} />}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'what-happened' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <ClipboardList className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">What Happened?</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Just the facts, no judgment. Walk through the timeline.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto">
            <textarea
              value={data.whatHappened}
              onChange={(e) => setData({ ...data, whatHappened: e.target.value })}
              placeholder="I started with... then... eventually..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'root-cause' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Brain className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Root Cause</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Why did this really happen? Dig beneath the surface.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.rootCause}
              onChange={(e) => setData({ ...data, rootCause: e.target.value })}
              placeholder="The real reason might be..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>

          <div className="max-w-xl mx-auto bg-sage-50 rounded-2xl p-4 text-left border border-sage-100">
            <p className="text-xs font-bold text-sage-500 uppercase tracking-widest mb-1">Common Root Causes</p>
            <p className="text-stone-600 text-sm">Unclear "why", wrong timing, lack of support, misaligned values, competing priorities, unrealistic expectations.</p>
          </div>
        </div>
      )}

      {step === 'patterns' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <RefreshCcw className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Patterns</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Is this part of a recurring pattern? What similarities do you notice?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto">
            <textarea
              value={data.patterns}
              onChange={(e) => setData({ ...data, patterns: e.target.value })}
              placeholder="I notice that I tend to..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'lessons' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Lightbulb className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Lessons Learned</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What wisdom can you take from this? The gold in the experience.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto">
            <textarea
              value={data.lessons}
              onChange={(e) => setData({ ...data, lessons: e.target.value })}
              placeholder="I learned that..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'next-time' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <ChevronRight className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Next Time</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              If you pursued a similar goal again, what would you do differently?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.nextTime}
              onChange={(e) => setData({ ...data, nextTime: e.target.value })}
              placeholder="Next time I would..."
              className="w-full h-32 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>

          <div className="max-w-xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 text-left ml-2">Optional Gratitude</p>
            <textarea
              value={data.gratitude}
              onChange={(e) => setData({ ...data, gratitude: e.target.value })}
              placeholder="Despite everything, I'm grateful that..."
              className="w-full h-24 bg-white rounded-2xl p-4 text-sage-900 placeholder:text-stone-300/70 border border-stone-100 focus:outline-none focus:ring-2 focus:ring-sage-100 resize-none transition-all shadow-sm"
            />
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-sage-100">
              <Sparkles className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Autopsy Complete</h2>
            <p className="text-stone-500 font-serif italic">This isn't failure—it's wisdom</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-sage-200"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-2">The Goal</p>
            <p className="text-sage-900 font-serif text-lg mb-1">{data.goal}</p>
            <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 text-xs font-medium">
              {data.outcome === 'abandoned' ? 'Abandoned' : data.outcome === 'failed' ? 'Did Not Succeed' : 'Pivoted'}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Root Cause</h3>
              <p className="text-stone-700 text-sm leading-relaxed">{data.rootCause}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Key Lesson</h3>
              <p className="text-stone-700 text-sm leading-relaxed">{data.lessons}</p>
            </div>
          </div>

          <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-sage-700 mb-2">Next Time I Will</h3>
            <p className="text-sage-900 text-lg font-serif italic">"{data.nextTime}"</p>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
