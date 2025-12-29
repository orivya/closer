import React, { useState } from 'react';
import { Heart, Sparkles, Check, ArrowUp, ArrowDown, ListFilter } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface ValuesDiscoveryProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'intro' | 'selection' | 'ranking' | 'reflection' | 'living' | 'summary';

const ALL_VALUES = [
  'Adventure', 'Authenticity', 'Balance', 'Belonging', 'Compassion',
  'Courage', 'Creativity', 'Curiosity', 'Family', 'Freedom',
  'Friendship', 'Generosity', 'Growth', 'Health', 'Honesty',
  'Humor', 'Independence', 'Integrity', 'Joy', 'Justice',
  'Kindness', 'Knowledge', 'Leadership', 'Love', 'Loyalty',
  'Nature', 'Optimism', 'Peace', 'Purpose', 'Respect',
  'Security', 'Service', 'Simplicity', 'Spirituality', 'Stability',
  'Success', 'Tradition', 'Trust', 'Wisdom', 'Wonder'
];

export default function ValuesDiscovery({ onBack, onComplete }: ValuesDiscoveryProps) {
  const [step, setStep] = useState<Step>('intro');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [rankedValues, setRankedValues] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [living, setLiving] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['intro', 'selection', 'ranking', 'reflection', 'living', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    if (step === 'selection' && rankedValues.length === 0) {
      setRankedValues([...selectedValues]);
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      const title = `My Core Values`;
      const topValues = rankedValues.slice(0, 5);
      let content = `My top ${topValues.length} core values: ${topValues.join(', ').toLowerCase()}.\n\n`;
      content += `Why these values matter to me: ${reflection}\n\n`;
      content += `How I'm living these values: ${living}`;

      await onComplete(title, content.trim());
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(v => v !== value));
    } else if (selectedValues.length < 10) {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const moveValue = (index: number, direction: 'up' | 'down') => {
    const newRanked = [...rankedValues];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < rankedValues.length) {
      [newRanked[index], newRanked[newIndex]] = [newRanked[newIndex], newRanked[index]];
      setRankedValues(newRanked);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'intro': return true;
      case 'selection': return selectedValues.length >= 5;
      case 'ranking': return rankedValues.length >= 5;
      case 'reflection': return reflection.trim().length > 0;
      case 'living': return living.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  return (
    <WizardLayout
      title="Values Discovery"
      icon={Heart}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'intro' ? 'Begin Discovery' : step === 'summary' ? 'Save Values' : 'Continue'}
      color="sage"
    >
      {step === 'intro' && (
        <div className="text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-sm">
            <Heart className="w-10 h-10 text-sage-600" strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-3xl text-sage-900 mb-4">Discover Your Core Values</h2>
          <p className="text-stone-500 font-serif italic text-lg leading-relaxed mb-8">
            Values are your internal compass—the principles that guide your decisions and define who you are at your best.
          </p>
          <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm text-left flex items-start gap-4">
            <div className="bg-sage-50 p-2 rounded-xl">
              <Sparkles className="text-sage-600" size={20} />
            </div>
            <div>
              <p className="font-bold text-sage-900 text-sm mb-1">Quick Exercise</p>
              <p className="text-stone-500 text-sm">
                This takes about 5-10 minutes. Find a quiet moment to be honest with yourself.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 'selection' && (
        <div className="text-center">
          <div className="mb-8">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Select Your Values</h2>
            <p className="text-stone-500">Choose 5-10 values that resonate deeply</p>
            <div className={`mt-4 inline-block px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${selectedValues.length >= 5 ? 'bg-sage-100 text-sage-700' : 'bg-stone-100 text-stone-400'
              }`}>
              {selectedValues.length} / 10 Selected
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto pb-4">
            {ALL_VALUES.map((value, index) => {
              const isSelected = selectedValues.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleValue(value)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${isSelected
                    ? 'bg-sage-600 text-white border-sage-600 shadow-md transform scale-105'
                    : 'bg-white text-sage-700 border-stone-200 hover:border-sage-200 hover:bg-sage-50'
                    }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 'ranking' && (
        <div className="text-center max-w-lg mx-auto">
          <div className="mb-8">
            <div className="w-12 h-12 bg-sage-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-sage-600">
              <ListFilter size={24} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Rank Your Top Values</h2>
            <p className="text-stone-500">Prioritize what matters most by moving items up or down</p>
          </div>

          <div className="space-y-3">
            {rankedValues.map((value, index) => (
              <div
                key={value}
                className="bg-white rounded-xl p-4 flex items-center gap-4 border border-stone-100 shadow-sm transition-all hover:shadow-md hover:border-sage-100 group"
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${index < 3 ? 'bg-sage-500 text-white' : 'bg-stone-100 text-stone-400'
                  }`}>
                  {index + 1}
                </span>
                <span className="flex-1 text-left text-sage-900 font-medium text-lg">{value}</span>
                <div className="flex flex-col gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => moveValue(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-stone-400 hover:text-sage-600 disabled:opacity-20 transition-colors bg-stone-50 rounded-md hover:bg-sage-50"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveValue(index, 'down')}
                    disabled={index === rankedValues.length - 1}
                    className="p-1 text-stone-400 hover:text-sage-600 disabled:opacity-20 transition-colors bg-stone-50 rounded-md hover:bg-sage-50"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'reflection' && (
        <div className="text-center">
          <div className="mb-8">
            <h2 className="font-serif text-2xl text-sage-900 mb-3">Reflect on Your Values</h2>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {rankedValues.slice(0, 3).map((v) => (
                <span key={v} className="px-3 py-1 rounded-full bg-sage-50 text-sage-700 text-xs font-bold uppercase tracking-wide border border-sage-100">
                  {v}
                </span>
              ))}
            </div>
            <p className="text-stone-500 font-serif italic text-lg max-w-lg mx-auto">
              Why are these specific values so important to you right now?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto">
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="These values matter because..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'living' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Sparkles className="text-sage-400" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Living Your Values</h2>
            <p className="text-stone-500 font-serif italic text-lg max-w-lg mx-auto">
              How can you honor these values more fully this week?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto">
            <textarea
              value={living}
              onChange={(e) => setLiving(e.target.value)}
              placeholder="I can live these values by..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-stone-100">
              <Heart className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Your Core Values</h2>
            <p className="text-stone-500 font-serif italic">Your internal compass, defined</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-200 to-sage-200"></div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-4">Top 5 Values</h3>
            <div className="flex flex-wrap gap-2">
              {rankedValues.slice(0, 5).map((value, i) => (
                <span key={value} className="px-4 py-2 rounded-full bg-sage-50 text-sage-700 font-medium text-sm border border-sage-100">
                  <span className="opacity-50 mr-2">{i + 1}.</span> {value}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Why They Matter</h3>
              <p className="text-sage-900 text-sm leading-relaxed">{reflection}</p>
            </div>

            <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-sage-600 mb-3">Living Them</h3>
              <p className="text-sage-900 text-sm leading-relaxed italic">"{living}"</p>
            </div>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
