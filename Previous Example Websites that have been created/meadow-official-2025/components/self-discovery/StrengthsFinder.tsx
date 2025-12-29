import React, { useState } from 'react';
import { Zap, Star, Sparkles, Trophy, ArrowRight, Check } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface StrengthsFinderProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'flow' | 'praise' | 'energy' | 'natural' | 'strengths' | 'apply' | 'summary';

export default function StrengthsFinder({ onBack, onComplete }: StrengthsFinderProps) {
  const [step, setStep] = useState<Step>('flow');
  const [data, setData] = useState({
    flow: '',
    praise: '',
    energy: '',
    natural: '',
    strengths: [] as string[],
    apply: '',
  });
  const [strengthInput, setStrengthInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['flow', 'praise', 'energy', 'natural', 'strengths', 'apply', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const title = `My Strengths: ${data.strengths.slice(0, 3).join(', ')}`;
    const content = `## Strengths Discovery\n\n### Activities That Create Flow\n${data.flow}\n\n### What Others Praise Me For\n${data.praise}\n\n### What Energizes Me\n${data.energy}\n\n### What Comes Naturally\n${data.natural}\n\n---\n\n### My Core Strengths\n${data.strengths.map(s => `- **${s}**`).join('\n')}\n\n### How I'll Apply These\n${data.apply}\n\n---\n*Discovered through Strengths Finder*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const addStrength = () => {
    if (strengthInput.trim() && data.strengths.length < 10) {
      setData({ ...data, strengths: [...data.strengths, strengthInput.trim()] });
      setStrengthInput('');
    }
  };

  const removeStrength = (index: number) => {
    setData({ ...data, strengths: data.strengths.filter((_, i) => i !== index) });
  };

  const canProceed = () => {
    switch (step) {
      case 'flow': return data.flow.trim().length > 0;
      case 'praise': return data.praise.trim().length > 0;
      case 'energy': return data.energy.trim().length > 0;
      case 'natural': return data.natural.trim().length > 0;
      case 'strengths': return data.strengths.length >= 3;
      case 'apply': return data.apply.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  const questions = [
    { step: 'flow', title: 'Flow State', subtitle: 'When do you lose track of time?', icon: Zap, placeholder: 'I get completely absorbed when...' },
    { step: 'praise', title: 'External Mirror', subtitle: 'What do others compliment you on?', icon: Star, placeholder: 'People often say I am good at...' },
    { step: 'energy', title: 'Energy Audit', subtitle: 'What gives you energy?', icon: Sparkles, placeholder: 'I feel energized after...' },
    { step: 'natural', title: 'Natural Talent', subtitle: 'What is easy for you but hard for others?', icon: Trophy, placeholder: 'It is surprisingly easy for me to...' },
  ];

  const currentQ = questions.find(q => q.step === step);

  return (
    <WizardLayout
      title="Strengths Finder"
      icon={Zap}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'summary' ? 'Save Strengths' : 'Continue'}
      color="sage"
    >
      {currentQ && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              {React.createElement(currentQ.icon, { className: "text-sage-600", size: 32, strokeWidth: 1.5 })}
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">{currentQ.title}</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              {currentQ.subtitle}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 mb-6">
            <textarea
              value={data[step as keyof typeof data] as string}
              onChange={(e) => setData({ ...data, [step]: e.target.value })}
              placeholder={currentQ.placeholder}
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'strengths' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Trophy className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Claim Your Strengths</h2>
            <p className="text-stone-500 font-serif italic">
              Based on your answers, list your top 3 strengths.
            </p>
          </div>

          {/* Review Section */}
          <div className="grid grid-cols-2 gap-2 mb-6 text-left">
            {[data.flow, data.praise, data.energy, data.natural].map((text, i) => (
              <div key={i} className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-600 h-20 overflow-hidden relative">
                <p className="line-clamp-3 italic opacity-80">"{text}"</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              value={strengthInput}
              onChange={(e) => setStrengthInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addStrength()}
              placeholder="e.g., Strategic Thinking"
              className="flex-1 bg-white rounded-xl p-3 text-sage-900 border border-stone-200 focus:border-sage-300 focus:ring-2 focus:ring-sage-50 transition-all font-medium"
            />
            <button onClick={addStrength} disabled={!strengthInput.trim()} className="px-4 bg-sage-900 text-white rounded-xl font-medium disabled:opacity-50">Add</button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center min-h-[40px]">
            {data.strengths.map((t, i) => (
              <span key={i} className="bg-sage-50 text-sage-800 px-3 py-1 rounded-lg text-sm font-bold uppercase tracking-wide flex items-center gap-2 border border-sage-100">
                {t} <button onClick={() => removeStrength(i)} className="hover:text-sage-900">×</button>
              </span>
            ))}
          </div>
        </div>
      )}

      {step === 'apply' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Zap className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Put Them to Work</h2>
            <p className="text-stone-500 font-serif italic">
              How will you use these superpowers this week?
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {data.strengths.map((t, i) => (
              <span key={i} className="bg-white border border-stone-200 text-stone-500 px-3 py-1 rounded-full text-xs font-medium">
                {t}
              </span>
            ))}
          </div>

          <div className="bg-sage-50 rounded-3xl p-1 shadow-sm border border-sage-100">
            <textarea
              value={data.apply}
              onChange={(e) => setData({ ...data, apply: e.target.value })}
              placeholder="I will use my strength of... to..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-400 focus:outline-none resize-none text-lg leading-relaxed font-serif"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-stone-100">
              <Trophy className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Strengths Unlocked</h2>
            <p className="text-stone-500 font-serif italic">Ready to be deployed</p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm text-center">
            <div className="flex flex-col gap-3">
              {data.strengths.map((strength, i) => (
                <div key={i} className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-sage-50 flex items-center justify-center flex-shrink-0 text-sage-700 font-bold border border-sage-100">{i + 1}</div>
                  <span className="text-xl font-serif text-sage-900">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-stone-900 rounded-2xl p-6 text-white shadow-lg">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">Mission</span>
            <p className="font-serif text-lg leading-relaxed">"{data.apply}"</p>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
