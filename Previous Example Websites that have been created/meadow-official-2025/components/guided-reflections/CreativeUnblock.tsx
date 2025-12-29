import React, { useState, useEffect } from 'react';
import { Palette, Lightbulb, Sparkles, Play, ArrowRight, Shuffle, ShieldAlert, Battery, CloudFog, Clock, Lock } from 'lucide-react';
import WizardLayout from './WizardLayout';

interface CreativeUnblockProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

type Step = 'creating' | 'smallest' | 'blocking' | 'playful' | 'next-step' | 'summary';

const RANDOM_SPARKS = [
  "What if you did the opposite of what you normally do?",
  "What would a child create with this idea?",
  "What's the most ridiculous version of this?",
  "What would happen if you combined this with cooking?",
  "What if you had to explain it in only 3 words?",
  "What would this look like underwater?",
  "What if it had to fit in your pocket?",
  "What would your 10-year-old self think of this?",
  "What if you only used your non-dominant hand?",
  "What would happen if you gave yourself 2 minutes?",
];

const BLOCKING_OPTIONS = [
  { id: 'fear', label: 'Fear of judgment', icon: ShieldAlert },
  { id: 'perfectionism', label: 'Perfectionism', icon: Sparkles },
  { id: 'energy', label: 'Low energy', icon: Battery },
  { id: 'clarity', label: 'Lack of clarity', icon: CloudFog },
  { id: 'time', label: 'Not enough time', icon: Clock },
  { id: 'stuck', label: 'Just stuck', icon: Lock },
];

const CreativeUnblock: React.FC<CreativeUnblockProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('creating');
  const [creating, setCreating] = useState('');
  const [smallest, setSmallest] = useState('');
  const [blocking, setBlocking] = useState<string[]>([]);
  const [playful, setPlayful] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [randomSpark, setRandomSpark] = useState('');
  const [showSpark, setShowSpark] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['creating', 'smallest', 'blocking', 'playful', 'next-step', 'summary'];
  const stepIndex = steps.indexOf(step);

  useEffect(() => {
    setRandomSpark(RANDOM_SPARKS[Math.floor(Math.random() * RANDOM_SPARKS.length)]);
  }, []);

  const shuffleSpark = () => {
    setShowSpark(true);
    setRandomSpark(RANDOM_SPARKS[Math.floor(Math.random() * RANDOM_SPARKS.length)]);
    setTimeout(() => setShowSpark(false), 300);
  };

  const toggleBlocking = (id: string) => {
    setBlocking(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

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

      const blockingLabels = blocking.map(id =>
        BLOCKING_OPTIONS.find(b => b.id === id)?.label
      ).filter(Boolean);

      let content = `## Creative Unblock\n\n`;
      content += `### What I'm Trying to Create\n${creating}\n\n`;
      content += `### The Smallest Version\n${smallest}\n\n`;
      content += `### What's Getting in the Way\n`;
      blockingLabels.forEach(b => { content += `- ${b}\n`; });
      content += `\n### Making It Playful Again\n${playful}\n\n`;
      content += `### 15-Minute Next Step\n*${nextAction}*\n`;

      await onComplete(`Creative Unblock - ${date}`, content);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'creating': return creating.trim().length > 0;
      case 'smallest': return smallest.trim().length > 0;
      case 'blocking': return blocking.length > 0;
      case 'playful': return playful.trim().length > 0;
      case 'next-step': return nextAction.trim().length > 0;
      default: return true;
    }
  };

  return (
    <WizardLayout
      title="Creative Unblock"
      icon={Palette}
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
      {/* Step 1: Creating */}
      {step === 'creating' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Lightbulb size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              What Are You Creating?
            </h2>
            <p className="text-stone-500 font-serif italic">
              What are you trying to create or start?
            </p>
          </div>

          <textarea
            autoFocus
            value={creating}
            onChange={(e) => setCreating(e.target.value)}
            placeholder="I'm trying to create..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 2: Smallest */}
      {step === 'smallest' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Sparkles size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              The Smallest Version
            </h2>
            <p className="text-stone-500 font-serif italic">
              What's the smallest version that still counts?
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-6 border border-stone-100 mx-auto max-w-sm">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-1 text-center">Creating</p>
            <p className="text-sage-900 text-sm italic truncate text-center">{creating}</p>
          </div>

          <textarea
            autoFocus
            value={smallest}
            onChange={(e) => setSmallest(e.target.value)}
            placeholder="The tiniest version would be..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 3: Blocking */}
      {step === 'blocking' && (
        <>
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              What's in the Way?
            </h2>
            <p className="text-stone-500 font-serif italic">
              Select all that apply
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-2">
            {BLOCKING_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => toggleBlocking(option.id)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-3 text-center transition-all border ${blocking.includes(option.id)
                  ? 'bg-sage-50 border-sage-200 shadow-sm'
                  : 'bg-white border-stone-100 hover:border-sage-100 hover:shadow-sm'
                  }`}
              >
                <option.icon size={28} className={blocking.includes(option.id) ? 'text-sage-600' : 'text-stone-400'} strokeWidth={1.5} />
                <span className={`text-sm font-medium ${blocking.includes(option.id) ? 'text-sage-900' : 'text-stone-600'
                  }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Step 4: Playful */}
      {step === 'playful' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Play size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Make It Playful
            </h2>
            <p className="text-stone-500 font-serif italic">
              What would make this feel fun again?
            </p>
          </div>

          {/* Random spark inspiration */}
          <button
            onClick={shuffleSpark}
            className={`w-full bg-white rounded-2xl p-5 mb-6 text-left hover:border-sage-200 border border-stone-100 transition-all shadow-sm group ${showSpark ? 'animate-pulse' : ''
              }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-sage-400 uppercase tracking-widest mb-1 group-hover:text-sage-500 transition-colors">Creative Spark</p>
                <p className="text-sage-900 font-serif italic">{randomSpark}</p>
              </div>
              <Shuffle size={20} className="text-stone-300 group-hover:text-sage-400 transition-colors" />
            </div>
          </button>

          <textarea
            autoFocus
            value={playful}
            onChange={(e) => setPlayful(e.target.value)}
            placeholder="To make this playful, I could..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-32 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 5: Next Step */}
      {step === 'next-step' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <ArrowRight size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              15-Minute Move
            </h2>
            <p className="text-stone-500 font-serif italic">
              What can you do in the next 15 minutes?
            </p>
          </div>

          <textarea
            autoFocus
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            placeholder="In 15 minutes, I can..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 6: Summary */}
      {step === 'summary' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-scale-in border border-stone-100">
              <Palette size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Unblocked
            </h2>
            <p className="text-stone-400 font-serif italic">
              Time to create
            </p>
          </div>

          <div className="space-y-4 mb-2">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <p className="text-xs font-bold text-sage-500 uppercase tracking-widest mb-2">Creating</p>
              <p className="text-sage-900 font-serif text-lg">{creating}</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Smallest Version</p>
              <p className="text-stone-600">{smallest}</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Blocks Identified</p>
              <div className="flex flex-wrap gap-2">
                {blocking.map(id => {
                  const option = BLOCKING_OPTIONS.find(b => b.id === id);
                  if (!option) return null;
                  return (
                    <span key={id} className="px-3 py-1 bg-stone-50 rounded-full text-sm text-stone-600 border border-stone-100 flex items-center gap-2">
                      <option.icon size={14} /> {option.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <p className="text-xs font-bold text-sage-500 uppercase tracking-widest mb-2">Making It Playful</p>
              <p className="text-stone-600">{playful}</p>
            </div>

            <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100">
              <p className="text-xs font-bold text-sage-600 uppercase tracking-widest mb-2">15-Minute Move</p>
              <p className="text-sage-900 font-serif italic text-lg">"{nextAction}"</p>
            </div>
          </div>
        </>
      )}
    </WizardLayout>
  );
};

export default CreativeUnblock;
