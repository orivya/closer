import React, { useState } from 'react';
import { User, Sparkles, Battery, Brain, Clock, Users, ArrowRight, Check } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface PersonalityExplorationProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'intro' | 'energy' | 'decisions' | 'time' | 'social' | 'traits' | 'summary';

export default function PersonalityExploration({ onBack, onComplete }: PersonalityExplorationProps) {
  const [step, setStep] = useState<Step>('intro');
  const [data, setData] = useState({
    energySource: '',
    decisionStyle: '',
    timePreference: '',
    socialStyle: '',
    keyTraits: [] as string[],
    traitReflection: '',
  });
  const [traitInput, setTraitInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['intro', 'energy', 'decisions', 'time', 'social', 'traits', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const title = `Personality Exploration: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    const content = `## Personality Exploration\n\n### How I Gain Energy\n${data.energySource}\n\n### How I Make Decisions\n${data.decisionStyle}\n\n### How I Relate to Time\n${data.timePreference}\n\n### My Social Style\n${data.socialStyle}\n\n---\n\n### Key Personality Traits\n${data.keyTraits.map(t => `- ${t}`).join('\n')}\n\n### What This Tells Me\n${data.traitReflection}\n\n---\n*Explored through Personality Exploration*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const addTrait = () => {
    if (traitInput.trim() && data.keyTraits.length < 8) {
      setData({ ...data, keyTraits: [...data.keyTraits, traitInput.trim()] });
      setTraitInput('');
    }
  };

  const removeTrait = (index: number) => {
    setData({ ...data, keyTraits: data.keyTraits.filter((_, i) => i !== index) });
  };

  const canProceed = () => {
    switch (step) {
      case 'intro': return true;
      case 'energy': return data.energySource !== '';
      case 'decisions': return data.decisionStyle !== '';
      case 'time': return data.timePreference !== '';
      case 'social': return data.socialStyle !== '';
      case 'traits': return data.keyTraits.length >= 3 && data.traitReflection.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  const questions = [
    {
      step: 'energy',
      title: 'Energy Source',
      subtitle: 'Where do you recharge?',
      icon: Battery,
      options: [
        { label: 'Solitude', desc: 'Alone time recharges my batteries.', value: 'I recharge through solitude.' },
        { label: 'Connection', desc: 'Being around people gives me life.', value: 'I recharge through connection.' },
        { label: 'Balance', desc: 'I need a mix of both.', value: 'I need a balance of both.' },
      ],
    },
    {
      step: 'decisions',
      title: 'Making Choices',
      subtitle: 'What guides you most?',
      icon: Brain,
      options: [
        { label: 'Logic', desc: 'I rely on data and analysis.', value: 'I rely primarily on logic and analysis.' },
        { label: 'Feeling', desc: 'I trust my gut and values.', value: 'I trust my gut feelings and values.' },
        { label: 'Both', desc: 'I check facts, then feel it out.', value: 'I blend analysis with intuition.' },
      ],
    },
    {
      step: 'time',
      title: 'Time & Planning',
      subtitle: 'How do you operate best?',
      icon: Clock,
      options: [
        { label: 'Structured', desc: 'I love a clear plan and schedule.', value: 'I prefer structure and planning.' },
        { label: 'Flow', desc: 'I prefer spontaneity and flexibility.', value: 'I prefer flexibility and flow.' },
        { label: 'Adaptive', desc: 'I plan loosely but adapt easily.', value: 'I am adaptive to the situation.' },
      ],
    },
    {
      step: 'social',
      title: 'Social Style',
      subtitle: 'How do you connect?',
      icon: Users,
      options: [
        { label: 'Intimate', desc: 'Deep talks with a few close friends.', value: 'I prefer deep connections with a few.' },
        { label: 'Expansive', desc: 'Mixing and mingling with many.', value: 'I enjoy a wide network of connections.' },
        { label: 'Varied', desc: 'It depends on my mood.', value: 'My social style varies by context.' },
      ],
    },
  ];

  const currentQ = questions.find(q => q.step === step);

  return (
    <WizardLayout
      title="Personality"
      icon={User}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'intro' ? 'Start Exploration' : step === 'summary' ? 'Save Profile' : 'Continue'}
      color="sage"
    >
      {step === 'intro' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <User className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-4">Know Thyself</h2>
            <p className="text-stone-500 font-serif italic mb-6 leading-relaxed">
              Understanding your natural wiring is the key to working with yourself, not against yourself.
            </p>
          </div>
        </div>
      )}

      {currentQ && (
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              {React.createElement(currentQ.icon, { className: "text-sage-600", size: 32, strokeWidth: 1.5 })}
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">{currentQ.title}</h2>
            <p className="text-stone-500 font-serif italic">
              {currentQ.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((opt, i) => {
              const dataKey = currentQ.step as keyof typeof data;
              const isSelected = data[dataKey] === opt.value;
              return (
                <button
                  key={i}
                  onClick={() => setData({ ...data, [dataKey]: opt.value })}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${isSelected
                    ? 'bg-sage-50 border-sage-200 ring-1 ring-sage-100'
                    : 'bg-white border-stone-100 hover:border-sage-100'
                    }`}
                >
                  <div>
                    <div className={`font-bold mb-1 ${isSelected ? 'text-sage-700' : 'text-sage-900'}`}>{opt.label}</div>
                    <div className={`text-sm ${isSelected ? 'text-sage-600/80' : 'text-stone-500'}`}>{opt.desc}</div>
                  </div>
                  {isSelected && <div className="bg-sage-600 text-white rounded-full p-1"><Check size={14} /></div>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {step === 'traits' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Sparkles className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Key Traits</h2>
            <p className="text-stone-500 font-serif italic">
              What 3 words best describe your essence?
            </p>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              value={traitInput}
              onChange={(e) => setTraitInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTrait()}
              placeholder="e.g., Curious"
              className="flex-1 bg-white rounded-xl p-3 text-sage-900 border border-stone-200 focus:border-sage-300 focus:ring-2 focus:ring-sage-50 transition-all font-medium"
            />
            <button onClick={addTrait} disabled={!traitInput.trim()} className="px-4 bg-sage-900 text-white rounded-xl font-medium disabled:opacity-50">Add</button>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8 min-h-[40px]">
            {data.keyTraits.map((t, i) => (
              <span key={i} className="bg-sage-100 text-sage-700 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
                {t} <button onClick={() => removeTrait(i)} className="hover:text-sage-900">×</button>
              </span>
            ))}
            {data.keyTraits.length === 0 && <span className="text-stone-400 text-sm italic">No traits added yet</span>}
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100">
            <textarea
              value={data.traitReflection}
              onChange={(e) => setData({ ...data, traitReflection: e.target.value })}
              placeholder="What do these traits tell you about yourself?"
              className="w-full h-32 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
            />
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-stone-100">
              <User className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Profile Mapped</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {data.keyTraits.map((t, i) => (
                <span key={i} className="bg-sage-50 text-sage-700 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider border border-sage-100">{t}</span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-xs font-bold uppercase text-stone-400 block mb-1">Energy</span>
                <p className="text-sm text-sage-900 leading-snug">{data.energySource}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-xs font-bold uppercase text-stone-400 block mb-1">Decisions</span>
                <p className="text-sm text-sage-900 leading-snug">{data.decisionStyle}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-xs font-bold uppercase text-stone-400 block mb-1">Time</span>
                <p className="text-sm text-sage-900 leading-snug">{data.timePreference}</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-xs font-bold uppercase text-stone-400 block mb-1">Social</span>
                <p className="text-sm text-sage-900 leading-snug">{data.socialStyle}</p>
              </div>
            </div>
          </div>

          <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100 text-center">
            <p className="text-sage-900 font-serif italic text-lg">"{data.traitReflection}"</p>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
