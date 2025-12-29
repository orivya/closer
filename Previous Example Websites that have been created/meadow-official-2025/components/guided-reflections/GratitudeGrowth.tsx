import React, { useState } from 'react';
import { Sparkles, Heart, TrendingUp, Lightbulb, Award, ArrowRight, Check, Loader2 } from 'lucide-react';
import WizardLayout from './WizardLayout';

interface GratitudeGrowthProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

type Step = 'appreciate' | 'learned' | 'proud' | 'helping' | 'next-step' | 'summary';

const GratitudeGrowth: React.FC<GratitudeGrowthProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('appreciate');
  const [appreciate, setAppreciate] = useState('');
  const [learned, setLearned] = useState('');
  const [proud, setProud] = useState('');
  const [helping, setHelping] = useState('');
  const [nextStep, setNextStep] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['appreciate', 'learned', 'proud', 'helping', 'next-step', 'summary'];
  const stepIndex = steps.indexOf(step);

  const goNextStep = () => {
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

      let content = `What I appreciate today: ${appreciate}\n\n`;
      content += `What I learned: ${learned}\n\n`;
      content += `What I'm proud of: ${proud}\n\n`;
      content += `What's helping me right now: ${helping}\n\n`;
      content += `A gentle next step: ${nextStep}`;

      await onComplete(`Gratitude & Growth`, content.trim());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'appreciate': return appreciate.trim().length > 0;
      case 'learned': return learned.trim().length > 0;
      case 'proud': return proud.trim().length > 0;
      case 'helping': return helping.trim().length > 0;
      case 'next-step': return nextStep.trim().length > 0;
      default: return true;
    }
  };

  return (
    <WizardLayout
      title="Gratitude & Growth"
      icon={Sparkles}
      step={stepIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? goNextStep : undefined}
      onComplete={step === 'summary' ? handleSave : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'next-step' ? 'See Summary' : 'Continue'}
      color="sage"
    >
      {/* Step 1: Appreciate */}
      {step === 'appreciate' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Heart size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <div className="inline-block px-3 py-1 bg-sage-50 text-sage-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-sage-100">
              Gratitude Track
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">
              What Do You Appreciate?
            </h2>
            <p className="text-stone-500 font-serif italic">
              One small thing you're grateful for right now
            </p>
          </div>

          <textarea
            autoFocus
            value={appreciate}
            onChange={(e) => setAppreciate(e.target.value)}
            placeholder="Right now, I appreciate..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-48 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 2: Learned */}
      {step === 'learned' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Lightbulb size={32} className="text-stone-400" strokeWidth={1.5} />
            </div>
            <div className="inline-block px-3 py-1 bg-stone-50 text-stone-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-stone-100">
              Growth Track
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">
              What Did You Learn?
            </h2>
            <p className="text-stone-500 font-serif italic">
              Something you learned recently about life, others, or yourself
            </p>
          </div>

          <textarea
            autoFocus
            value={learned}
            onChange={(e) => setLearned(e.target.value)}
            placeholder="I recently learned..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-48 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 3: Proud */}
      {step === 'proud' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Award size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <div className="inline-block px-3 py-1 bg-sage-50 text-sage-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-sage-100">
              Gratitude Track
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">
              What Are You Proud Of?
            </h2>
            <p className="text-stone-500 font-serif italic">
              Something you're proud of yourself for this week
            </p>
          </div>

          <textarea
            autoFocus
            value={proud}
            onChange={(e) => setProud(e.target.value)}
            placeholder="I'm proud that I..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-48 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 4: Helping */}
      {step === 'helping' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <TrendingUp size={32} className="text-stone-400" strokeWidth={1.5} />
            </div>
            <div className="inline-block px-3 py-1 bg-stone-50 text-stone-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-stone-100">
              Growth Track
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">
              What's Helping?
            </h2>
            <p className="text-stone-500 font-serif italic">
              A habit or choice that's serving you well lately
            </p>
          </div>

          <textarea
            autoFocus
            value={helping}
            onChange={(e) => setHelping(e.target.value)}
            placeholder="Something that's been helping me is..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-48 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 5: Next Step */}
      {step === 'next-step' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <ArrowRight size={32} className="text-sage-700" strokeWidth={1.5} />
            </div>
            <div className="inline-block px-3 py-1 bg-gradient-to-r from-stone-100 to-sage-100 text-stone-600 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-stone-200">
              Balance Point
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">
              One Gentle Step
            </h2>
            <p className="text-stone-500 font-serif italic">
              What's one gentle next step you want to take?
            </p>
          </div>

          <textarea
            autoFocus
            value={nextStep}
            onChange={(e) => setNextStep(e.target.value)}
            placeholder="A gentle next step would be..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-48 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 6: Summary */}
      {step === 'summary' && (
        <>
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-sage-900 mb-2">
              In Balance
            </h2>
            <p className="text-stone-400 font-serif italic">
              Gratitude and growth, side by side
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Gratitude column */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xs font-bold text-sage-500 uppercase tracking-widest">Gratitude</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
                <p className="text-xs text-stone-400 font-bold mb-2 uppercase">Appreciate</p>
                <p className="text-sage-800 text-sm">{appreciate}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
                <p className="text-xs text-stone-400 font-bold mb-2 uppercase">Proud</p>
                <p className="text-sage-800 text-sm">{proud}</p>
              </div>
            </div>

            {/* Growth column */}
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Growth</p>
              </div>
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                <p className="text-xs text-stone-500 font-bold mb-2 uppercase">Learned</p>
                <p className="text-sage-800 text-sm">{learned}</p>
              </div>
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                <p className="text-xs text-stone-500 font-bold mb-2 uppercase">Helping</p>
                <p className="text-sage-800 text-sm">{helping}</p>
              </div>
            </div>
          </div>

          {/* Next step - full width */}
          <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100">
            <p className="text-xs font-bold text-sage-600 uppercase tracking-widest mb-2">Gentle Next Step</p>
            <p className="text-sage-900 font-serif italic text-lg">"{nextStep}"</p>
          </div>
        </>
      )}
    </WizardLayout>
  );
};

export default GratitudeGrowth;
