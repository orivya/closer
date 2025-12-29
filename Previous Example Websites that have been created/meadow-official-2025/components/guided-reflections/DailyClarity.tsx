import React, { useState } from 'react';
import { Feather, Brain, Heart, Battery, Moon, Play, ArrowRight, Check } from 'lucide-react';
import WizardLayout from './WizardLayout';

interface DailyClarityProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

type Step = 'thought' | 'underneath' | 'need' | 'release' | 'next-step' | 'summary';

const NEED_OPTIONS = [
  { id: 'rest', label: 'Rest', icon: Moon },
  { id: 'connection', label: 'Connection', icon: Heart },
  { id: 'progress', label: 'Progress', icon: ArrowRight },
  { id: 'quiet', label: 'Quiet', icon: Feather },
  { id: 'play', label: 'Play', icon: Play },
  { id: 'energy', label: 'Energy', icon: Battery },
];

const DailyClarity: React.FC<DailyClarityProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('thought');
  const [thought, setThought] = useState('');
  const [underneath, setUnderneath] = useState('');
  const [need, setNeed] = useState<string>('');
  const [release, setRelease] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['thought', 'underneath', 'need', 'release', 'next-step', 'summary'];
  const stepIndex = steps.indexOf(step);

  const canProceed = () => {
    switch (step) {
      case 'thought': return thought.trim().length > 0;
      case 'underneath': return underneath.trim().length > 0;
      case 'need': return need.length > 0;
      case 'release': return true; // Optional
      case 'next-step': return nextAction.trim().length > 0;
      default: return true;
    }
  };

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setStep(steps[stepIndex + 1]);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });

      const needLabel = NEED_OPTIONS.find(n => n.id === need)?.label || need;

      let content = `A thought that keeps returning: ${thought}\n\n`;
      content += `What I'm really trying to do underneath: ${underneath}\n\n`;
      content += `What I need most right now: ${needLabel.toLowerCase()}.\n\n`;
      if (release) {
        content += `Letting go of: ${release}\n\n`;
      }
      content += `My next kind step: ${nextAction}`;

      await onComplete(`Daily Clarity`, content.trim());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getNeedOption = () => NEED_OPTIONS.find(n => n.id === need);

  return (
    <WizardLayout
      title="Daily Clarity"
      icon={Feather}
      step={stepIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? nextStep : undefined}
      onComplete={step === 'summary' ? handleSave : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'next-step' ? 'See Summary' : 'Continue'}
      color="sage"
    >
      {/* Step 1: Returning Thought */}
      {step === 'thought' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Brain size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              The Returning Thought
            </h2>
            <p className="text-stone-500 font-serif italic">
              What's one thought that keeps coming back today?
            </p>
          </div>

          <textarea
            autoFocus
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="The thought that keeps returning is..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 2: Underneath */}
      {step === 'underneath' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Feather size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              What's Underneath?
            </h2>
            <p className="text-stone-500 font-serif italic">
              What are you really trying to do or figure out?
            </p>
          </div>

          {/* Reminder */}
          <div className="bg-white rounded-2xl p-4 mb-6 border border-stone-100 mx-auto max-w-sm">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-1 text-center">Your thought</p>
            <p className="text-sage-900 text-sm italic line-clamp-2 text-center">{thought}</p>
          </div>

          <textarea
            autoFocus
            value={underneath}
            onChange={(e) => setUnderneath(e.target.value)}
            placeholder="Underneath it all, I'm trying to..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-32 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 3: What do you need? */}
      {step === 'need' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Heart size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              What Do You Need?
            </h2>
            <p className="text-stone-500 font-serif italic">
              To move forward with clarity, what's missing?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {NEED_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setNeed(option.id)}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 ${need === option.id
                    ? 'bg-sage-50 border-sage-200 shadow-sm'
                    : 'bg-white border-stone-100 hover:border-sage-100 hover:bg-stone-50'
                  }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${need === option.id ? 'bg-sage-100 text-sage-600' : 'bg-stone-50 text-stone-400'
                  }`}>
                  <option.icon size={18} />
                </div>
                <span className={`font-medium ${need === option.id ? 'text-sage-900' : 'text-stone-600'}`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Step 4: Release */}
      {step === 'release' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Battery size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              What Can You Drop?
            </h2>
            <p className="text-stone-500 font-serif italic">
              Is there a pressure or expectation you can let go of?
            </p>
          </div>

          <textarea
            autoFocus
            value={release}
            onChange={(e) => setRelease(e.target.value)}
            placeholder="I can let go of trying to..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 border border-stone-100 shadow-sm transition-all"
          />
          <p className="text-center text-stone-400 text-sm mt-4">Optional - skip if nothing comes to mind</p>
        </>
      )}

      {/* Step 5: Next Step */}
      {step === 'next-step' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <ArrowRight size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              One Kind Step
            </h2>
            <p className="text-stone-500 font-serif italic">
              What is the smallest thing you can do to honor your need?
            </p>
          </div>

          <textarea
            autoFocus
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            placeholder="My next step is to..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 6: Summary */}
      {step === 'summary' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-4 ring-white">
              <Check size={32} className="text-sage-600" strokeWidth={2} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Clarity Found</h2>
            <p className="text-stone-500">You've reconnected with what matters.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Returning Thought</h3>
              <p className="text-sage-900 leading-relaxed bg-stone-50/50 p-4 rounded-2xl">{thought}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Underneath</h3>
                <p className="text-stone-600 italic">{underneath}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Need</h3>
                <div className="flex items-center gap-2 text-sage-700 font-medium bg-sage-50 px-3 py-2 rounded-lg self-start inline-flex">
                  {getNeedOption()?.icon && React.createElement(getNeedOption()!.icon, { size: 16 })}
                  {getNeedOption()?.label}
                </div>
              </div>
            </div>

            {release && (
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Releasing</h3>
                <p className="text-stone-500 line-through decoration-sage-300">{release}</p>
              </div>
            )}

            <div className="pt-6 border-t border-stone-100">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Next Step</h3>
              <p className="text-xl font-serif text-sage-700">{nextAction}</p>
            </div>
          </div>
        </div>
      )}
    </WizardLayout>
  );
};

export default DailyClarity;
