import React, { useState } from 'react';
import { Brain, Sparkles, Heart, Search, Scale, ArrowRight, Lightbulb, Check, X } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface CoreBeliefsExaminationProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'intro' | 'identify' | 'origin' | 'serving' | 'reframe' | 'new-belief' | 'summary';

const BELIEF_PROMPTS = [
  "I'm not good enough to...",
  "I don't deserve...",
  "Success always requires...",
  "People will think...",
  "I can't because...",
  "Money is...",
  "Relationships are...",
  "I have to be perfect to...",
];

export default function CoreBeliefsExamination({ onBack, onComplete }: CoreBeliefsExaminationProps) {
  const [step, setStep] = useState<Step>('intro');
  const [data, setData] = useState({
    belief: '',
    origin: '',
    serving: '',
    isServing: null as boolean | null,
    evidence: '',
    newBelief: '',
    action: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['intro', 'identify', 'origin', 'serving', 'reframe', 'new-belief', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const title = `Core Belief Examination: ${data.belief.slice(0, 40)}${data.belief.length > 40 ? '...' : ''}`;
    const content = `## Core Belief Examination\n\n### The Belief I Examined\n"${data.belief}"\n\n### Where It Came From\n${data.origin}\n\n### Is It Serving Me?\n${data.isServing ? 'Yes, this belief serves me' : 'No, this belief may be limiting me'}\n\n${data.serving}\n\n### Evidence & Reframe\n${data.evidence}\n\n---\n\n### My New Belief\n"${data.newBelief}"\n\n### How I'll Practice This\n${data.action}\n\n---\n*Examined through Core Beliefs Exploration*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const canProceed = () => {
    switch (step) {
      case 'intro': return true;
      case 'identify': return data.belief.trim().length > 0;
      case 'origin': return data.origin.trim().length > 0;
      case 'serving': return data.isServing !== null && data.serving.trim().length > 0;
      case 'reframe': return data.evidence.trim().length > 0;
      case 'new-belief': return data.newBelief.trim().length > 0 && data.action.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  return (
    <WizardLayout
      title="Core Beliefs"
      icon={Brain}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'intro' ? 'Begin Examination' : step === 'summary' ? 'Save Work' : 'Continue'}
      color="sage"
    >
      {step === 'intro' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Search className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-4">Examine Your Assumptions</h2>
            <p className="text-stone-500 font-serif italic mb-6 leading-relaxed">
              Core beliefs are the deep assumptions we hold about ourselves and the world.
              Some serve us; others hold us back. Let's explore one together.
            </p>
          </div>

          <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100 text-left flex gap-4 items-start">
            <Heart className="w-6 h-6 text-sage-400 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-sage-800 text-sm mb-1">A Note on Kindness</p>
              <p className="text-sage-700/80 text-sm leading-relaxed">
                This work can surface difficult emotions. Be gentle with yourself as you explore. There is no right or wrong here, only understanding.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 'identify' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Brain className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Identify a Belief</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What deep belief is influencing your life right now?
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-6 max-w-xl mx-auto">
            {BELIEF_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setData({ ...data, belief: prompt })}
                className="px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-600 text-sm hover:border-sage-300 hover:text-sage-600 hover:bg-sage-50 transition-all font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.belief}
              onChange={(e) => setData({ ...data, belief: e.target.value })}
              placeholder="I believe that..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'origin' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Search className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">The Origin Story</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Where did this belief come from? When did you first learn it?
            </p>
          </div>

          <div className="max-w-xl mx-auto mb-6 bg-sage-50/50 rounded-xl p-4 border border-sage-100/50">
            <p className="text-xs uppercase tracking-widest text-sage-400 font-bold mb-1">The Belief</p>
            <p className="text-sage-900 italic">"{data.belief}"</p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.origin}
              onChange={(e) => setData({ ...data, origin: e.target.value })}
              placeholder="I first started believing this when..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'serving' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Scale className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Does it Serve You?</h2>
            <p className="text-stone-500 font-serif italic">
              Be honest. Does this belief protect you or limit you?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setData({ ...data, isServing: true })}
              className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-2 ${data.isServing === true
                ? 'bg-sage-50 border-sage-200 text-sage-800 ring-1 ring-sage-100'
                : 'bg-white border-stone-100 text-stone-500 hover:border-sage-100 hover:text-sage-600'
                }`}
            >
              <Check size={24} />
              <span className="font-bold">It Serves Me</span>
            </button>
            <button
              onClick={() => setData({ ...data, isServing: false })}
              className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-2 ${data.isServing === false
                ? 'bg-stone-50 border-stone-200 text-stone-800 ring-1 ring-stone-100'
                : 'bg-white border-stone-100 text-stone-500 hover:border-stone-200 hover:text-stone-600'
                }`}
            >
              <X size={24} />
              <span className="font-bold">It Limits Me</span>
            </button>
          </div>

          {data.isServing !== null && (
            <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 animate-fade-in">
              <textarea
                value={data.serving}
                onChange={(e) => setData({ ...data, serving: e.target.value })}
                placeholder={data.isServing ? "How does it help you?" : "How does it hold you back?"}
                className="w-full h-32 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
                autoFocus
              />
            </div>
          )}
        </div>
      )}

      {step === 'reframe' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Lightbulb className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">The Evidence</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Is this belief 100% true? What evidence do you have to the contrary?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.evidence}
              onChange={(e) => setData({ ...data, evidence: e.target.value })}
              placeholder="Actually, looking closer..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'new-belief' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Sparkles className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">New Belief</h2>
            <p className="text-stone-500 font-serif italic">
              What would you like to believe instead?
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100">
              <textarea
                value={data.newBelief}
                onChange={(e) => setData({ ...data, newBelief: e.target.value })}
                placeholder="I choose to believe..."
                className="w-full h-32 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed font-serif"
              />
            </div>

            <div className="bg-sage-50 rounded-2xl p-4 border border-sage-100">
              <span className="text-xs font-bold uppercase tracking-widest text-sage-600 block mb-2">Practice in Action</span>
              <input
                value={data.action}
                onChange={(e) => setData({ ...data, action: e.target.value })}
                placeholder="This week, I will practice this by..."
                className="w-full bg-white rounded-xl p-3 text-sage-900 placeholder:text-stone-300 border border-transparent focus:ring-2 focus:ring-sage-200 transition-all font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-stone-100">
              <Brain className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Work Complete</h2>
            <p className="text-stone-500 font-serif italic">From limiting to liberating</p>
          </div>

          <div className="grid gap-4">
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 opacity-70">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block line-through">Old Belief</span>
              <p className="text-stone-600 font-serif italic">"{data.belief}"</p>
            </div>

            <div className="flex justify-center -my-2 z-10">
              <div className="bg-white border border-stone-100 rounded-full p-2 shadow-sm text-stone-300"><ArrowRight size={16} className="rotate-90" /></div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 ring-4 ring-sage-50">
              <span className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-3 block">New Belief</span>
              <p className="text-sage-900 font-serif text-2xl leading-relaxed">"{data.newBelief}"</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">Practice Plan</span>
            <p className="text-stone-700">{data.action}</p>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
