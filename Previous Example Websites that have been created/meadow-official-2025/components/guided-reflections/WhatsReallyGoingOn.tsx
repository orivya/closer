import React, { useState } from 'react';
import { X, Layers, Check, Loader2, ArrowRight, HelpCircle, ChevronDown, Lightbulb } from 'lucide-react';
import WizardLayout from './WizardLayout';

interface WhatsReallyGoingOnProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

type Step = 'surface' | 'why1' | 'why2' | 'why3' | 'why4' | 'why5' | 'core' | 'summary';

const WhatsReallyGoingOn: React.FC<WhatsReallyGoingOnProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('surface');
  const [surface, setSurface] = useState('');
  const [whys, setWhys] = useState<string[]>(['', '', '', '', '']);
  const [core, setCore] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['surface', 'why1', 'why2', 'why3', 'why4', 'why5', 'core', 'summary'];
  const currentStepIndex = steps.indexOf(step);

  const updateWhy = (index: number, value: string) => {
    setWhys(prev => {
      const newWhys = [...prev];
      newWhys[index] = value;
      return newWhys;
    });
  };

  const getCurrentWhyIndex = () => {
    if (step.startsWith('why')) {
      return parseInt(step.replace('why', '')) - 1;
    }
    return -1;
  };

  const getPreviousAnswer = () => {
    const idx = getCurrentWhyIndex();
    if (idx === 0) return surface;
    if (idx > 0) return whys[idx - 1];
    return '';
  };

  const canProceed = () => {
    switch (step) {
      case 'surface': return surface.trim().length > 0;
      case 'why1': return whys[0].trim().length > 0;
      case 'why2': return whys[1].trim().length > 0;
      case 'why3': return whys[2].trim().length > 0;
      case 'why4': return whys[3].trim().length > 0;
      case 'why5': return whys[4].trim().length > 0;
      case 'core': return core.trim().length > 0;
      default: return true;
    }
  };

  const nextAction = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) {
      setStep(steps[idx + 1]);
    }
  };

  const skipToCore = () => {
    setStep('core');
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

      const validWhys = whys.filter(w => w.trim());

      let content = `Surface issue: ${surface}\n\n`;
      content += `Digging deeper:\n`;
      validWhys.forEach((why, i) => {
        content += `${i + 1}. ${why}\n`;
      });
      content += `\nThe core truth I discovered: ${core}`;

      await onComplete(`What's Really Going On`, content.trim());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <WizardLayout
      title="5 Whys"
      icon={Layers}
      step={currentStepIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? nextAction : undefined}
      onComplete={step === 'summary' ? handleSave : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'surface' ? 'Go Deeper' : step === 'core' ? 'See Insight' : 'Ask Why Again'}
      color="sage"
    >
      {/* Step 1: Surface */}
      {step === 'surface' && (
        <div className="max-w-lg mx-auto w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-sm">
              <HelpCircle size={32} className="text-stone-400" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              What's Bothering You?
            </h2>
            <p className="text-stone-500 font-serif italic">
              Start with the surface-level issue
            </p>
          </div>

          <textarea
            autoFocus
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
            placeholder="Something that's been on my mind is..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 mb-8 border border-stone-100 shadow-sm transition-all"
          />
        </div>
      )}

      {/* Why Steps (1-5) */}
      {step.startsWith('why') && (
        <div className="max-w-lg mx-auto w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-sage-100">
              <span className="text-sage-600 font-serif text-2xl">{getCurrentWhyIndex() + 1}</span>
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Why #{getCurrentWhyIndex() + 1}
            </h2>
            <p className="text-stone-500 italic font-serif">
              Dig deeper...
            </p>
          </div>

          {/* Previous answer reference */}
          <div className="bg-sage-50/50 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-2">
              <ChevronDown size={16} className="text-sage-500 mt-1 flex-shrink-0" />
              <p className="text-sage-800 text-sm italic">"{getPreviousAnswer()}"</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sage-900 font-serif text-lg mb-3">
              Why is that?
            </p>
            <textarea
              autoFocus
              value={whys[getCurrentWhyIndex()]}
              onChange={(e) => updateWhy(getCurrentWhyIndex(), e.target.value)}
              placeholder="Because..."
              className="w-full p-6 bg-white rounded-3xl text-sage-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-32 border border-stone-100 shadow-sm transition-all"
            />
          </div>

          {getCurrentWhyIndex() >= 2 && getCurrentWhyIndex() < 4 && (
            <button
              onClick={skipToCore}
              className="w-full py-3 text-sage-600 font-medium hover:bg-sage-50 rounded-full transition-all text-sm uppercase tracking-wider"
            >
              I've found it - go to core
            </button>
          )}
        </div>
      )}

      {/* Core Truth */}
      {step === 'core' && (
        <div className="max-w-lg mx-auto w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Lightbulb size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              The Core Truth
            </h2>
            <p className="text-stone-500 font-serif italic">
              After all those layers, what's really going on?
            </p>
          </div>

          {/* Journey recap - collapsed view */}
          <div className="bg-white rounded-2xl p-6 mb-6 max-h-40 overflow-y-auto border border-stone-100 shadow-sm">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-3">Your journey down</p>
            <div className="space-y-3">
              <p className="text-sage-900 text-sm"><span className="text-stone-400 font-bold uppercase text-xs mr-2">Surface</span> {surface}</p>
              {whys.filter(w => w.trim()).map((why, i) => (
                <p key={i} className="text-sage-900 text-sm pl-3 border-l-2 border-sage-100">
                  <span className="text-stone-400 font-bold uppercase text-xs mr-2">Why {i + 1}</span> {why}
                </p>
              ))}
            </div>
          </div>

          <textarea
            autoFocus
            value={core}
            onChange={(e) => setCore(e.target.value)}
            placeholder="What I've discovered is..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 mb-8 border border-stone-100 shadow-sm transition-all"
          />
        </div>
      )}

      {/* Summary */}
      {step === 'summary' && (
        <div className="max-w-lg mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-scale-in border border-sage-100">
              <Layers size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Layers Revealed
            </h2>
            <p className="text-stone-500 italic font-serif">
              From surface to core
            </p>
          </div>

          {/* Visual layer summary */}
          <div className="space-y-3 mb-8">
            {/* Surface */}
            <div className="bg-white rounded-2xl p-5 border-l-4 border-stone-300 shadow-sm">
              <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Surface</p>
              <p className="text-sage-900">{surface}</p>
            </div>

            {/* Whys */}
            {whys.filter(w => w.trim()).map((why, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border-l-4 shadow-sm"
                style={{ borderColor: `rgba(132, 169, 140, ${0.3 + i * 0.15})` }}
              >
                <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">Why {i + 1}</p>
                <p className="text-sage-900">{why}</p>
              </div>
            ))}

            {/* Core */}
            <div className="bg-sage-50 rounded-2xl p-5 border-l-4 border-sage-600 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-sage-600" />
                <p className="text-xs font-bold text-sage-600 uppercase tracking-widest">Core Truth</p>
              </div>
              <p className="text-sage-900 font-serif text-lg">{core}</p>
            </div>
          </div>
        </div>
      )}
    </WizardLayout>
  );
};

export default WhatsReallyGoingOn;
