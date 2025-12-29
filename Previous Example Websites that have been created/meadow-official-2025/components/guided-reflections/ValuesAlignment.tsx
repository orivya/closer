import React, { useState } from 'react';
import { Target, Compass, Clock, Eye, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import WizardLayout from './WizardLayout';

interface ValuesAlignmentProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

type Step = 'mattered' | 'time-check' | 'value' | 'behavior' | 'boundaries' | 'summary';

const SUGGESTED_VALUES = [
  'Honesty', 'Courage', 'Calm', 'Curiosity', 'Compassion',
  'Growth', 'Connection', 'Freedom', 'Creativity', 'Integrity',
  'Joy', 'Service', 'Health', 'Balance', 'Adventure'
];

const ValuesAlignment: React.FC<ValuesAlignmentProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('mattered');
  const [mattered, setMattered] = useState('');
  const [timeCheck, setTimeCheck] = useState('');
  const [alignmentScore, setAlignmentScore] = useState(50);
  const [selectedValue, setSelectedValue] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [behavior, setBehavior] = useState('');
  const [yesTo, setYesTo] = useState('');
  const [noTo, setNoTo] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['mattered', 'time-check', 'value', 'behavior', 'boundaries', 'summary'];
  const stepIndex = steps.indexOf(step);
  const currentValue = selectedValue || customValue;

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

      const alignmentLabel = alignmentScore < 40 ? 'Misaligned' : alignmentScore > 70 ? 'Aligned' : 'Partially aligned';

      let content = `What mattered most today: ${mattered}\n\n`;
      content += `Where my time and energy went: ${timeCheck}\n\n`;
      content += `How aligned I feel: ${alignmentLabel.toLowerCase()} (${alignmentScore}%).\n\n`;
      content += `My leading value for tomorrow: ${currentValue.toLowerCase()}.\n\n`;
      content += `How I'll live this value: ${behavior}\n\n`;
      let boundaries = [];
      if (yesTo) boundaries.push(`say yes to ${yesTo.toLowerCase()}`);
      if (noTo) boundaries.push(`say no to ${noTo.toLowerCase()}`);
      if (boundaries.length > 0) {
        content += `To protect this value, I will ${boundaries.join(' and ')}.`;
      }

      await onComplete(`Values Alignment`, content.trim());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getAlignmentLabel = () => {
    if (alignmentScore < 40) return { text: 'Misaligned', color: 'text-stone-500', bg: 'bg-stone-50' };
    if (alignmentScore > 70) return { text: 'Aligned', color: 'text-sage-700', bg: 'bg-sage-50' };
    return { text: 'Partial', color: 'text-stone-600', bg: 'bg-stone-50' };
  };

  const canProceed = () => {
    switch (step) {
      case 'mattered': return mattered.trim().length > 0;
      case 'time-check': return timeCheck.trim().length > 0;
      case 'value': return currentValue.trim().length > 0;
      case 'behavior': return behavior.trim().length > 0;
      case 'boundaries': return yesTo.trim().length > 0 || noTo.trim().length > 0;
      default: return true;
    }
  };

  return (
    <WizardLayout
      title="Values Alignment"
      icon={Target}
      step={stepIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? nextStep : undefined}
      onComplete={step === 'summary' ? handleSave : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'boundaries' ? 'See Summary' : 'Continue'}
      color="sage"
    >
      {/* Step 1: What Mattered */}
      {step === 'mattered' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Compass size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              What Mattered Most?
            </h2>
            <p className="text-stone-500 font-serif italic">
              What felt most important to you today?
            </p>
          </div>

          <textarea
            autoFocus
            value={mattered}
            onChange={(e) => setMattered(e.target.value)}
            placeholder="Today, what mattered most was..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-100 resize-none h-48 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 2: Time Check */}
      {step === 'time-check' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Clock size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Time & Energy Audit
            </h2>
            <p className="text-stone-500 font-serif italic">
              Where did your time and energy actually go?
            </p>
          </div>

          <textarea
            autoFocus
            value={timeCheck}
            onChange={(e) => setTimeCheck(e.target.value)}
            placeholder="Most of my time went to..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 mb-8 border border-stone-100 shadow-sm transition-all"
          />

          {/* Alignment slider */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <p className="text-sm text-stone-500 mb-6 text-center">
              Did your time match what mattered?
            </p>
            <div className="flex justify-between text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">
              <span>Not at all</span>
              <span>Perfectly</span>
            </div>

            <div className="relative h-2 mb-6">
              <div className="absolute inset-0 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${alignmentScore}%`,
                    background: `linear-gradient(to right, #d6d3d1, #a8a29e, #57534e)` // Stone gradient
                  }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={alignmentScore}
                onChange={(e) => setAlignmentScore(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md border border-stone-200 pointer-events-none transition-all"
                style={{ left: `calc(${alignmentScore}% - 12px)` }}
              />
            </div>

            <div className="text-center">
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getAlignmentLabel().bg} ${getAlignmentLabel().color}`}>
                {getAlignmentLabel().text} ({alignmentScore}%)
              </span>
            </div>
          </div>
        </>
      )}

      {/* Step 3: Choose Value */}
      {step === 'value' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Eye size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Lead With a Value
            </h2>
            <p className="text-stone-500 font-serif italic">
              Which value do you want to lead with tomorrow?
            </p>
          </div>

          {/* Value chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {SUGGESTED_VALUES.map((value) => (
              <button
                key={value}
                onClick={() => {
                  setSelectedValue(value);
                  setCustomValue('');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform active:scale-95 ${selectedValue === value
                  ? 'bg-sage-600 text-white shadow-md'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-sage-300 hover:text-sage-600'
                  }`}
              >
                {value}
              </button>
            ))}
          </div>

          {/* Custom value input */}
          <div className="relative mb-8">
            <input
              type="text"
              value={customValue}
              onChange={(e) => {
                setCustomValue(e.target.value);
                setSelectedValue('');
              }}
              placeholder="Or type your own value..."
              className="w-full p-4 bg-white rounded-2xl text-sage-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-100 border border-stone-100 shadow-sm transition-all text-center"
            />
          </div>
        </>
      )}

      {/* Step 4: Value in Action */}
      {step === 'behavior' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Target size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              {currentValue} in Action
            </h2>
            <p className="text-stone-500 font-serif italic">
              What does this value look like in one concrete behavior?
            </p>
          </div>

          <textarea
            autoFocus
            value={behavior}
            onChange={(e) => setBehavior(e.target.value)}
            placeholder={`Living with ${currentValue.toLowerCase()} means I will...`}
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-100 resize-none h-48 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 5: Boundaries */}
      {step === 'boundaries' && (
        <>
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Protect Your Value
            </h2>
            <p className="text-stone-500 font-serif italic">
              What's one yes and one no to protect {currentValue.toLowerCase()}?
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {/* Yes to */}
            <div className="bg-sage-50/50 p-4 rounded-2xl border border-sage-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center">
                  <ThumbsUp size={16} />
                </div>
                <span className="text-sm font-bold text-sage-700 uppercase tracking-widest">Say yes to</span>
              </div>
              <input
                type="text"
                value={yesTo}
                onChange={(e) => setYesTo(e.target.value)}
                placeholder="I will say yes to..."
                className="w-full p-4 bg-white rounded-xl text-sage-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 transition-all border border-sage-100"
              />
            </div>

            {/* No to */}
            <div className="bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center">
                  <ThumbsDown size={16} />
                </div>
                <span className="text-sm font-bold text-stone-600 uppercase tracking-widest">Say no to</span>
              </div>
              <input
                type="text"
                value={noTo}
                onChange={(e) => setNoTo(e.target.value)}
                placeholder="I will say no to..."
                className="w-full p-4 bg-white rounded-xl text-sage-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200/50 transition-all border border-stone-100"
              />
            </div>
          </div>
        </>
      )}

      {/* Step 6: Summary */}
      {step === 'summary' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-scale-in border border-stone-100 relative">
              <Compass size={32} className="text-sage-600" strokeWidth={1.5} />
              <div className="absolute inset-0 rounded-2xl ring-4 ring-white" />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Aligned
            </h2>
            <p className="text-stone-400 font-serif italic">
              Your compass is set
            </p>
          </div>

          <div className="space-y-4 mb-2">
            {/* Alignment check */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Today's Alignment</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-stone-400" style={{ width: `${alignmentScore}%` }} />
                  </div>
                  <span className="text-xs font-bold text-stone-500">{alignmentScore}%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5">Mattered</p>
                  <p className="text-sage-900 line-clamp-2">{mattered}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1.5">Spent Time On</p>
                  <p className="text-sage-900 line-clamp-2">{timeCheck}</p>
                </div>
              </div>
            </div>

            {/* Leading value */}
            <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100 text-center">
              <p className="text-xs font-bold text-sage-400 uppercase tracking-widest mb-2">Leading Value</p>
              <p className="font-serif text-3xl text-sage-900 mb-3">{currentValue}</p>
              <p className="text-sage-800 text-sm italic">"{behavior}"</p>
            </div>

            {/* Boundaries */}
            <div className="grid grid-cols-2 gap-4">
              {yesTo && (
                <div className="bg-sage-50 rounded-2xl p-4 border border-sage-100">
                  <p className="text-xs font-bold text-sage-600 uppercase tracking-widest mb-2">Yes to</p>
                  <p className="text-sage-900 text-sm">{yesTo}</p>
                </div>
              )}
              {noTo && (
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">No to</p>
                  <p className="text-stone-700 text-sm">{noTo}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </WizardLayout>
  );
};

export default ValuesAlignment;
