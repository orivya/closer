import React, { useState } from 'react';
import { X, Send, Check, Loader2, ArrowRight, Clock, Sparkles, Heart, Calendar } from 'lucide-react';
import WizardLayout from './WizardLayout';

interface FutureSelfLetterProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

type Step = 'timeframe' | 'imagine' | 'advice' | 'letter' | 'summary';

const TIMEFRAME_OPTIONS = [
  { id: '1-year', label: '1 Year', description: 'Next year you', years: 1 },
  { id: '5-years', label: '5 Years', description: 'Mid-future you', years: 5 },
  { id: '10-years', label: '10 Years', description: 'Far-future you', years: 10 },
];

const FutureSelfLetter: React.FC<FutureSelfLetterProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('timeframe');
  const [timeframe, setTimeframe] = useState('');
  const [imagine, setImagine] = useState('');
  const [advice, setAdvice] = useState('');
  const [letter, setLetter] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['timeframe', 'imagine', 'advice', 'letter', 'summary'];
  const currentStepIndex = steps.indexOf(step);

  const selectedTimeframe = TIMEFRAME_OPTIONS.find(t => t.id === timeframe);

  const getFutureDate = () => {
    if (!selectedTimeframe) return '';
    const future = new Date();
    future.setFullYear(future.getFullYear() + selectedTimeframe.years);
    return future.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const canProceed = () => {
    switch (step) {
      case 'timeframe': return timeframe.length > 0;
      case 'imagine': return imagine.trim().length > 0;
      case 'advice': return advice.trim().length > 0;
      case 'letter': return letter.trim().length > 0;
      default: return true;
    }
  };

  const nextStep = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) {
      setStep(steps[idx + 1]);
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

      let content = `A letter from my future self, ${selectedTimeframe?.label} from now.\n\n`;
      content += `Who I've become: ${imagine}\n\n`;
      content += `Wisdom for my present self: ${advice}\n\n`;
      content += `Dear present me,\n\n${letter}\n\nWith love, your future self.`;

      await onComplete(`Future Self Letter`, content.trim());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <WizardLayout
      title="Future Self Letter"
      icon={Send}
      step={currentStepIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? nextStep : undefined}
      onComplete={step === 'summary' ? handleSave : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'letter' ? 'See Letter' : 'Continue'}
      color="sage"
    >
      {/* Step 1: Timeframe */}
      {step === 'timeframe' && (
        <div className="max-w-lg mx-auto w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-sm">
              <Clock size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Choose Your Future
            </h2>
            <p className="text-stone-500 font-serif italic">
              How far ahead do you want to travel?
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {TIMEFRAME_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setTimeframe(option.id)}
                className={`w-full p-5 rounded-2xl text-left transition-all flex items-center gap-4 ${timeframe === option.id
                    ? 'bg-sage-50 border-2 border-sage-200 shadow-sm'
                    : 'bg-white border-2 border-transparent hover:border-stone-100 shadow-sm'
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${timeframe === option.id ? 'bg-sage-600 text-white' : 'bg-stone-50 text-stone-400'
                  }`}>
                  <Calendar size={24} />
                </div>
                <div>
                  <p className={`font-serif text-xl ${timeframe === option.id ? 'text-sage-900' : 'text-sage-900'}`}>
                    {option.label}
                  </p>
                  <p className="text-stone-500 text-sm">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Imagine */}
      {step === 'imagine' && (
        <div className="max-w-lg mx-auto w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-sm">
              <Sparkles size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Imagine Yourself
            </h2>
            <p className="text-stone-500 font-serif italic">
              It's {getFutureDate()}. Who have you become?
            </p>
          </div>

          <div className="bg-sage-50 rounded-xl p-4 mb-6 text-center border border-sage-100">
            <p className="text-xs text-sage-500 uppercase tracking-widest mb-1">You're writing from</p>
            <p className="text-sage-900 font-serif text-lg">{getFutureDate()}</p>
          </div>

          <textarea
            autoFocus
            value={imagine}
            onChange={(e) => setImagine(e.target.value)}
            placeholder={`In ${selectedTimeframe?.years} years, I have become someone who...`}
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 mb-8 border border-stone-100 shadow-sm transition-all"
          />
        </div>
      )}

      {/* Step 3: Advice */}
      {step === 'advice' && (
        <div className="max-w-lg mx-auto w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-sm">
              <Heart size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Wisdom to Share
            </h2>
            <p className="text-stone-500 font-serif italic">
              What does your future self want present-you to know?
            </p>
          </div>

          <textarea
            autoFocus
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            placeholder="Looking back, what I wish you knew is..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 mb-8 border border-stone-100 shadow-sm transition-all"
          />
        </div>
      )}

      {/* Step 4: The Letter */}
      {step === 'letter' && (
        <div className="max-w-lg mx-auto w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-sm">
              <Send size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Write the Letter
            </h2>
            <p className="text-stone-500 font-serif italic">
              A message from your future self to present-day you
            </p>
          </div>

          {/* Letter writing area */}
          <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-stone-100">
            <div className="mb-6 flex justify-between items-center text-xs text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-4">
              <span>From: Future Self</span>
              <span>To: Present Self</span>
            </div>

            <div>
              <p className="text-sage-900 font-serif mb-3 text-xl">Dear Present Self,</p>
              <textarea
                autoFocus
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                placeholder="Write from your future self's perspective..."
                className="w-full p-0 bg-transparent text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none resize-none min-h-[200px] font-serif leading-relaxed"
              />
              <p className="text-sage-900 font-serif mt-6 italic text-xl">With love,<br />Your Future Self</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Summary */}
      {step === 'summary' && (
        <div className="max-w-lg mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-scale-in border border-sage-100">
              <Send size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Letter Complete
            </h2>
            <p className="text-stone-500 font-serif italic">
              A message across time
            </p>
          </div>

          {/* The completed letter */}
          <div className="bg-white rounded-2xl p-8 mb-8 border border-stone-100 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-sage-500" />
                <p className="text-xs text-sage-500 uppercase tracking-widest font-bold">From {getFutureDate()}</p>
              </div>
              <Clock size={16} className="text-stone-300" />
            </div>

            <div className="mb-6 pb-6 border-b border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">Who You've Become</p>
                <p className="text-sage-900 text-sm leading-relaxed">{imagine}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">Wisdom Shared</p>
                <p className="text-sage-900 text-sm leading-relaxed">{advice}</p>
              </div>
            </div>

            <div className="font-serif">
              <p className="text-sage-900 text-xl mb-4">Dear Present Self,</p>
              <p className="text-sage-900 whitespace-pre-wrap leading-relaxed text-lg">{letter}</p>
              <p className="text-sage-900 mt-8 italic text-xl">With love,<br />Your Future Self</p>
            </div>
          </div>
        </div>
      )}
    </WizardLayout>
  );
};

export default FutureSelfLetter;
