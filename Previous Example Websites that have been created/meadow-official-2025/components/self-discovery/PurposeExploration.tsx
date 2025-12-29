import React, { useState } from 'react';
import { Compass, Heart, Zap, Globe, Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface PurposeExplorationProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'intro' | 'passion' | 'strengths' | 'world' | 'intersection' | 'statement' | 'summary';

export default function PurposeExploration({ onBack, onComplete }: PurposeExplorationProps) {
  const [step, setStep] = useState<Step>('intro');
  const [data, setData] = useState({
    passion: '',
    strengths: '',
    worldNeeds: '',
    intersection: '',
    purposeStatement: '',
    nextStep: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['intro', 'passion', 'strengths', 'world', 'intersection', 'statement', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const title = `My Purpose: ${data.purposeStatement.slice(0, 50)}${data.purposeStatement.length > 50 ? '...' : ''}`;
    const content = `## Purpose Exploration\n\n### What I Love (Passion)\n${data.passion}\n\n### What I'm Good At (Strengths)\n${data.strengths}\n\n### What the World Needs\n${data.worldNeeds}\n\n### The Intersection\n${data.intersection}\n\n---\n\n## My Purpose Statement\n**"${data.purposeStatement}"**\n\n### My Next Step\n${data.nextStep}\n\n---\n*Discovered through Purpose Exploration*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const canProceed = () => {
    switch (step) {
      case 'intro': return true;
      case 'passion': return data.passion.trim().length > 0;
      case 'strengths': return data.strengths.trim().length > 0;
      case 'world': return data.worldNeeds.trim().length > 0;
      case 'intersection': return data.intersection.trim().length > 0;
      case 'statement': return data.purposeStatement.trim().length > 0 && data.nextStep.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  return (
    <WizardLayout
      title="Purpose Finding"
      icon={Compass}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'intro' ? 'Start Journey' : step === 'summary' ? 'Save Purpose' : 'Continue'}
      color="sage"
    >
      {step === 'intro' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Compass className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-4">Find Your "Why"</h2>
            <p className="text-stone-500 font-serif italic mb-6 leading-relaxed">
              Purpose lies at the intersection of three things: what you love, what you're good at, and what the world needs.
            </p>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-sage-50 text-sage-500 flex items-center justify-center"><Heart size={20} /></div>
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Passion</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-sage-50 text-sage-500 flex items-center justify-center"><Zap size={20} /></div>
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Strength</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-sage-50 text-sage-500 flex items-center justify-center"><Globe size={20} /></div>
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Service</span>
            </div>
          </div>
        </div>
      )}

      {step === 'passion' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Heart className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">What You Love</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What activities make you lose track of time? What would you do for free?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.passion}
              onChange={(e) => setData({ ...data, passion: e.target.value })}
              placeholder="I love..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'strengths' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Zap className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Your Superpowers</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What comes naturally to you? What do people ask you for help with?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.strengths}
              onChange={(e) => setData({ ...data, strengths: e.target.value })}
              placeholder="I am naturally good at..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'world' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Globe className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">What the World Needs</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What problems do you feel drawn to solve? Who do you want to help?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.worldNeeds}
              onChange={(e) => setData({ ...data, worldNeeds: e.target.value })}
              placeholder="The world needs more..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'intersection' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">The Intersection</h2>
            <p className="text-stone-500 font-serif italic">Where do they meet?</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-600 h-24 overflow-hidden relative">
              <Heart className="w-4 h-4 text-sage-400 absolute top-2 right-2 opacity-50" />
              <strong className="block mb-1 text-sage-700">Passion</strong>
              {data.passion}
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-600 h-24 overflow-hidden relative">
              <Zap className="w-4 h-4 text-sage-400 absolute top-2 right-2 opacity-50" />
              <strong className="block mb-1 text-sage-700">Strength</strong>
              {data.strengths}
            </div>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs text-stone-600 h-24 overflow-hidden relative">
              <Globe className="w-4 h-4 text-sage-400 absolute top-2 right-2 opacity-50" />
              <strong className="block mb-1 text-sage-700">Needs</strong>
              {data.worldNeeds}
            </div>
          </div>

          <div className="bg-sage-50 rounded-3xl p-1 border border-sage-100 shadow-sm animate-scale-in">
            <textarea
              value={data.intersection}
              onChange={(e) => setData({ ...data, intersection: e.target.value })}
              placeholder="I can use my love for [passion] and my skill in [strength] to help [needs]..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-sage-300 focus:outline-none resize-none text-lg leading-relaxed font-medium"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'statement' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Lightbulb className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Define Your Purpose</h2>
            <p className="text-stone-500 font-serif italic">
              Draft a single clear sentence.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100">
              <textarea
                value={data.purposeStatement}
                onChange={(e) => setData({ ...data, purposeStatement: e.target.value })}
                placeholder="My purpose is to..."
                className="w-full h-32 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-xl leading-relaxed font-serif text-center"
                autoFocus
              />
            </div>

            <div className="bg-white rounded-2xl p-4 border border-stone-100 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-sage-500 block mb-2">Next Step</span>
              <input
                value={data.nextStep}
                onChange={(e) => setData({ ...data, nextStep: e.target.value })}
                placeholder="This week I will..."
                className="w-full bg-stone-50 rounded-xl p-3 text-sage-900 placeholder:text-stone-300 border border-transparent focus:bg-white focus:border-sage-200 focus:ring-4 focus:ring-sage-50 transition-all font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-stone-100">
              <Sparkles className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Purpose Defined</h2>
            <p className="text-stone-500 font-serif italic">Your compass is set</p>
          </div>

          <div className="bg-sage-600 rounded-2xl p-8 text-center text-white shadow-lg shadow-sage-200">
            <Compass className="w-8 h-8 mx-auto mb-4 text-sage-200" />
            <p className="font-serif text-2xl italic leading-relaxed">"{data.purposeStatement}"</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">Immediate Action</span>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center mt-0.5"><ArrowRight size={14} className="text-sage-600" /></div>
              <p className="text-sage-900">{data.nextStep}</p>
            </div>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
