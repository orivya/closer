import React, { useState } from 'react';
import { Lock, Plus, X, Sparkles, Unlock, Shield, AlertTriangle, ArrowRight } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface LimitingBeliefsInventoryProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'intro' | 'collect' | 'examine' | 'transform' | 'summary';

interface LimitingBelief {
  id: string;
  belief: string;
  origin: string;
  newBelief: string;
}

const BELIEF_STARTERS = [
  "I'm not smart enough to...",
  "I don't have enough time to...",
  "I'm too old to...",
  "I don't deserve...",
  "Money is...",
  "I always fail at...",
  "People like me can't...",
  "It's too late for me to...",
];

export default function LimitingBeliefsInventory({ onBack, onComplete }: LimitingBeliefsInventoryProps) {
  const [step, setStep] = useState<Step>('intro');
  const [beliefs, setBeliefs] = useState<LimitingBelief[]>([]);
  const [newBelief, setNewBelief] = useState('');
  const [currentBeliefIndex, setCurrentBeliefIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['intro', 'collect', 'examine', 'transform', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    if (step === 'examine') {
      if (currentBeliefIndex < beliefs.length - 1) {
        setCurrentBeliefIndex(currentBeliefIndex + 1);
      } else {
        const nextIndex = currentIndex + 1;
        setCurrentBeliefIndex(0);
        if (nextIndex < steps.length) setStep(steps[nextIndex]);
      }
    } else if (step === 'transform') {
      if (currentBeliefIndex < beliefs.length - 1) {
        setCurrentBeliefIndex(currentBeliefIndex + 1);
      } else {
        const nextIndex = currentIndex + 1;
        if (nextIndex < steps.length) setStep(steps[nextIndex]);
      }
    } else {
      const nextIndex = currentIndex + 1;
      if (nextIndex < steps.length) {
        setStep(steps[nextIndex]);
        if (nextIndex === steps.indexOf('examine') || nextIndex === steps.indexOf('transform')) {
          setCurrentBeliefIndex(0);
        }
      }
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const title = `Limiting Beliefs Inventory: ${beliefs.length} Beliefs Transformed`;
    const content = `## Limiting Beliefs Inventory\n\n${beliefs.map((b, i) => `### Belief ${i + 1}\n**Limiting Belief:** "${b.belief}"\n**Origin:** ${b.origin}\n**Transformed Into:** "${b.newBelief}"\n`).join('\n---\n\n')}\n\n---\n*${beliefs.length} beliefs examined and rewritten*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const addBelief = (beliefText?: string) => {
    const text = beliefText || newBelief.trim();
    if (text && beliefs.length < 10) {
      setBeliefs([...beliefs, {
        id: Date.now().toString(),
        belief: text,
        origin: '',
        newBelief: '',
      }]);
      setNewBelief('');
    }
  };

  const removeBelief = (id: string) => {
    setBeliefs(beliefs.filter(b => b.id !== id));
  };

  const updateBelief = (id: string, field: 'origin' | 'newBelief', value: string) => {
    setBeliefs(beliefs.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const currentBelief = beliefs[currentBeliefIndex];

  const canProceed = () => {
    switch (step) {
      case 'intro': return true;
      case 'collect': return beliefs.length >= 2;
      case 'examine': return currentBelief?.origin.trim().length > 0;
      case 'transform': return currentBelief?.newBelief.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  const getNextLabel = () => {
    if (step === 'examine' && currentBeliefIndex < beliefs.length - 1) return 'Next Belief';
    if (step === 'transform' && currentBeliefIndex < beliefs.length - 1) return 'Next Belief';
    if (step === 'summary') return 'Save Inventory';
    if (step === 'intro') return 'Start Inventory';
    return 'Continue';
  }

  return (
    <WizardLayout
      title="Limiting Beliefs"
      icon={Lock}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={getNextLabel()}
      color="sage"
    >
      {step === 'intro' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Lock className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-4">Break Your Chains</h2>
            <p className="text-stone-500 font-serif italic mb-6 leading-relaxed">
              We all carry silent stories about what we can't do.
              Let's bring them into the light and rewrite them.
            </p>
          </div>

          <div className="flex justify-center gap-4 text-xs font-bold uppercase tracking-widest text-stone-400">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center"><AlertTriangle size={16} /></div>
              <span>Identify</span>
            </div>
            <div className="mt-4 text-stone-300"><ArrowRight size={16} /></div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center"><Shield size={16} /></div>
              <span>Examine</span>
            </div>
            <div className="mt-4 text-stone-300"><ArrowRight size={16} /></div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center"><Unlock size={16} /></div>
              <span className="text-sage-600">Free</span>
            </div>
          </div>
        </div>
      )}

      {step === 'collect' && (
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <AlertTriangle className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Identify the Blocks</h2>
            <p className="text-stone-500 font-serif italic">
              Add at least 2 beliefs that hold you back.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Common Patterns</p>
            <div className="flex flex-wrap gap-2">
              {BELIEF_STARTERS.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => addBelief(starter)}
                  disabled={beliefs.some(b => b.belief === starter)}
                  className="px-3 py-1.5 rounded-lg bg-stone-50 text-stone-600 text-sm hover:bg-sage-50 hover:text-sage-600 transition-colors disabled:opacity-30 border border-stone-100 hover:border-sage-200"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {beliefs.map((belief) => (
              <div key={belief.id} className="bg-stone-50/50 rounded-xl p-4 border border-stone-100 flex items-center justify-between animate-fade-in group">
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-stone-400" />
                  <span className="text-sage-900 font-medium">{belief.belief}</span>
                </div>
                <button onClick={() => removeBelief(belief.id)} className="text-stone-300 hover:text-stone-500 opacity-0 group-hover:opacity-100 transition-all"><X size={16} /></button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={newBelief}
              onChange={(e) => setNewBelief(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addBelief()}
              placeholder="I can't because..."
              className="flex-1 bg-white rounded-xl p-3 text-sage-900 border border-stone-200 focus:border-sage-300 focus:ring-2 focus:ring-sage-50 transition-all"
            />
            <button
              onClick={() => addBelief()}
              disabled={!newBelief.trim()}
              className="p-3 rounded-xl bg-sage-900 text-white disabled:opacity-50 hover:bg-sage-800 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      )}

      {step === 'examine' && currentBelief && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Belief {currentBeliefIndex + 1} of {beliefs.length}</span>
            <div className="flex justify-center gap-1 mt-2 mb-6">
              {beliefs.map((_, i) => (
                <div key={i} className={`h-1 w-8 rounded-full ${i === currentBeliefIndex ? 'bg-stone-400' : 'bg-stone-200'}`} />
              ))}
            </div>
          </div>

          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100 mb-8 max-w-lg mx-auto transform rotate-1 shadow-sm">
            <Lock className="w-6 h-6 text-stone-400 mx-auto mb-2" />
            <p className="font-serif text-xl text-sage-900 italic">"{currentBelief.belief}"</p>
          </div>

          <h2 className="font-serif text-2xl text-sage-900 mb-2">The Origin</h2>
          <p className="text-stone-500 font-serif italic mb-6">
            When did this story start? Who told it to you?
          </p>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100">
            <textarea
              value={currentBelief.origin}
              onChange={(e) => updateBelief(currentBelief.id, 'origin', e.target.value)}
              placeholder="I first learned this when..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'transform' && currentBelief && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-sage-600">Transforming {currentBeliefIndex + 1} of {beliefs.length}</span>
            <div className="flex justify-center gap-1 mt-2 mb-6">
              {beliefs.map((_, i) => (
                <div key={i} className={`h-1 w-8 rounded-full ${i === currentBeliefIndex ? 'bg-sage-500' : 'bg-stone-200'}`} />
              ))}
            </div>
          </div>

          <div className="grid gap-4 mb-6 relative">
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 opacity-60">
              <p className="text-sm text-stone-500 line-through">"{currentBelief.belief}"</p>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 border border-stone-100 shadow-sm z-10">
              <ArrowRight size={16} className="text-stone-400 rotate-90" />
            </div>
          </div>

          <h2 className="font-serif text-2xl text-sage-900 mb-2">New Truth</h2>
          <p className="text-stone-500 font-serif italic mb-6">
            Write a new belief that is kind, true, and empowering.
          </p>

          <div className="bg-sage-50 rounded-3xl p-1 shadow-sm border border-sage-100">
            <textarea
              value={currentBelief.newBelief}
              onChange={(e) => updateBelief(currentBelief.id, 'newBelief', e.target.value)}
              placeholder="The truth is..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-sage-300 focus:outline-none resize-none text-xl leading-relaxed font-serif"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-stone-100">
              <Sparkles className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Inventory Complete</h2>
            <p className="text-stone-500 font-serif italic">{beliefs.length} limitations removed</p>
          </div>

          <div className="space-y-4">
            {beliefs.map((belief, i) => (
              <div key={belief.id} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-sage-400" />
                <div className="pl-4">
                  <div className="flex items-center gap-2 mb-2 opacity-50">
                    <Lock size={12} />
                    <p className="text-xs line-through text-stone-500">{belief.belief}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Unlock size={14} className="text-sage-600" />
                    <p className="text-sage-900 font-serif text-lg">"{belief.newBelief}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
