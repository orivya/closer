import React, { useState } from 'react';
import { Compass, Scale, ThumbsDown, ThumbsUp, Sparkles, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import WizardLayout from './WizardLayout';

interface DecisionClarityProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

type Step = 'decision' | 'fears' | 'hopes' | 'gut-check' | 'action' | 'summary';

export default function DecisionClarity({ onBack, onComplete }: DecisionClarityProps) {
  const [step, setStep] = useState<Step>('decision');
  const [data, setData] = useState({
    decision: '',
    fears: '',
    hopes: '',
    gutFeeling: 50,
    action: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['decision', 'fears', 'hopes', 'gut-check', 'action', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });

    const gutLabel = data.gutFeeling < 30 ? 'Hesitant' : data.gutFeeling > 70 ? 'Confident' : 'Neutral';

    let content = `The decision I'm facing: ${data.decision}\n\n`;
    content += `What I'm afraid might happen: ${data.fears}\n\n`;
    content += `What I'm secretly hoping for: ${data.hopes}\n\n`;
    content += `My gut feeling: ${gutLabel.toLowerCase()} (${data.gutFeeling}% certainty).\n\n`;
    content += `One action I can take in the next 24 hours: ${data.action}`;

    await onComplete(`Decision Clarity`, content.trim());
    setIsSaving(false);
  };

  const canProceed = () => {
    switch (step) {
      case 'decision': return data.decision.trim().length > 0;
      case 'fears': return data.fears.trim().length > 0;
      case 'hopes': return data.hopes.trim().length > 0;
      case 'gut-check': return true;
      case 'action': return data.action.trim().length > 0;
      default: return true;
    }
  };

  const getGutLabel = () => {
    if (data.gutFeeling < 30) return { text: 'Hesitant', color: 'text-stone-500' };
    if (data.gutFeeling > 70) return { text: 'Confident', color: 'text-sage-600' };
    return { text: 'Neutral', color: 'text-sage-400' };
  };

  return (
    <WizardLayout
      title="Decision Lab"
      icon={Compass}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'summary' ? 'Save Analysis' : 'Continue'}
      color="sage"
    >
      {step === 'decision' && (
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Scale className="text-stone-400" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">The Dilemma</h2>
            <p className="text-stone-500 font-serif italic">
              Define the choice you are facing clearly.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100">
            <textarea
              value={data.decision}
              onChange={(e) => setData({ ...data, decision: e.target.value })}
              placeholder="Should I..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-xl leading-relaxed font-serif"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'fears' && (
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <ThumbsDown className="text-stone-500" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Worst Case</h2>
            <p className="text-stone-500 font-serif italic">
              What are you afraid might happen?
            </p>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 mb-6 opacity-80">
            <p className="text-sm text-stone-600 font-serif italic">"{data.decision}"</p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100">
            <textarea
              value={data.fears}
              onChange={(e) => setData({ ...data, fears: e.target.value })}
              placeholder="I'm worried that..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'hopes' && (
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <ThumbsUp className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Best Case</h2>
            <p className="text-stone-500 font-serif italic">
              What are you secretly hoping for?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100">
            <textarea
              value={data.hopes}
              onChange={(e) => setData({ ...data, hopes: e.target.value })}
              placeholder="Deep down, I hope that..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'gut-check' && (
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Sparkles className="text-sage-400" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Gut Check</h2>
            <p className="text-stone-500 font-serif italic">
              Don't think. What does your body say?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">
              <span className="text-stone-500">Hesitant</span>
              <span>Neutral</span>
              <span className="text-sage-600">Confident</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={data.gutFeeling}
              onChange={(e) => setData({ ...data, gutFeeling: Number(e.target.value) })}
              className="w-full h-4 rounded-full appearance-none cursor-pointer bg-stone-100 accent-sage-600"
              style={{
                background: `linear-gradient(to right, #a8a29e 0%, #e7e5e4 50%, #84a98c 100%)`,
              }}
            />

            <div className="text-center mt-8">
              <span className={`text-4xl font-serif ${getGutLabel().color}`}>
                {getGutLabel().text}
              </span>
              <p className="text-stone-400 text-sm mt-2 font-mono">{data.gutFeeling}%</p>
            </div>
          </div>
        </div>
      )}

      {step === 'action' && (
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <ArrowRight className="text-stone-400" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Next Step</h2>
            <p className="text-stone-500 font-serif italic">
              What is one small thing you can do in the next 24 hours?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100">
            <textarea
              value={data.action}
              onChange={(e) => setData({ ...data, action: e.target.value })}
              placeholder="I will..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-xl leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-sage-100">
              <Check className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Clarity Found</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Decision</p>
              <p className="font-serif text-lg text-sage-900">{data.decision}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              <div className="bg-stone-50 p-4 rounded-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Fears</p>
                <p className="text-sm text-sage-900">{data.fears}</p>
              </div>
              <div className="bg-sage-50 p-4 rounded-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-1">Hopes</p>
                <p className="text-sm text-sage-900">{data.hopes}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Gut Check</p>
                <span className={`text-sm font-bold ${getGutLabel().color}`}>{getGutLabel().text} ({data.gutFeeling}%)</span>
              </div>
              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-sage-600" style={{ width: `${data.gutFeeling}%` }} />
              </div>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Next Action</p>
              <p className="text-lg font-serif text-sage-900">{data.action}</p>
            </div>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
