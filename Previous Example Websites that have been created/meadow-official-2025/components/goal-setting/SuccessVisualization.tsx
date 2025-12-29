import React, { useState } from 'react';
import { Eye, Star, Play, Fingerprint, Anchor, Sparkles, Heart } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface SuccessVisualizationProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'goal' | 'scene' | 'senses' | 'feelings' | 'identity' | 'anchor' | 'summary';

export default function SuccessVisualization({ onBack, onComplete }: SuccessVisualizationProps) {
  const [step, setStep] = useState<Step>('goal');
  const [data, setData] = useState({
    goal: '',
    scene: '',
    see: '',
    hear: '',
    feel: '',
    emotions: '',
    identity: '',
    anchor: '',
    mantra: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['goal', 'scene', 'senses', 'feelings', 'identity', 'anchor', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const title = `Success Vision: ${data.goal.slice(0, 40)}${data.goal.length > 40 ? '...' : ''}`;
    const content = `## Success Visualization\n\n### The Goal\n${data.goal}\n\n---\n\n### The Scene\n${data.scene}\n\n### Sensory Details\n**Seen:** ${data.see}\n**Heard:** ${data.hear}\n**Felt:** ${data.feel}\n\n### Emotions\n${data.emotions}\n\n---\n\n### New Identity\n${data.identity}\n\n### Anchor & Mantra\n**Anchor:** ${data.anchor}\n**Mantra:** "${data.mantra}"\n\n---\n*Created with Success Visualization*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const canProceed = () => {
    switch (step) {
      case 'goal': return data.goal.trim().length > 0;
      case 'scene': return data.scene.trim().length > 0;
      case 'senses': return data.see.trim().length > 0 || data.hear.trim().length > 0 || data.feel.trim().length > 0;
      case 'feelings': return data.emotions.trim().length > 0;
      case 'identity': return data.identity.trim().length > 0;
      case 'anchor': return data.anchor.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  return (
    <WizardLayout
      title="Success Visualization"
      icon={Eye}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'summary' ? 'Save Vision' : 'Continue'}
      color="sage"
    >
      {step === 'goal' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Star className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">What is the Goal?</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Choose one specific goal to visualize in vivid detail.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.goal}
              onChange={(e) => setData({ ...data, goal: e.target.value })}
              placeholder="I want to..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>

          <div className="max-w-xl mx-auto bg-sage-50 rounded-2xl p-4 border border-sage-100 text-left">
            <p className="text-sm text-sage-900/80">
              <strong className="text-sage-700">Science Fact:</strong> Your brain doesn't distinguish between vivid visualization and reality. You are building neural pathways for success right now.
            </p>
          </div>
        </div>
      )}

      {step === 'scene' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Play className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Set the Scene</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              The exact moment of achievement. Where are you? Who is there?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.scene}
              onChange={(e) => setData({ ...data, scene: e.target.value })}
              placeholder="I am standing in... It is [time of day]..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'senses' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Engage Senses</h2>
            <p className="text-stone-500 font-serif italic">Make it real.</p>
          </div>

          <div className="space-y-4 text-left">
            <div className="bg-white rounded-2xl p-4 border border-stone-100 focus-within:ring-2 focus-within:ring-sage-100 transition-all shadow-sm">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">What do you see?</label>
              <textarea
                value={data.see}
                onChange={(e) => setData({ ...data, see: e.target.value })}
                placeholder="Colors, light, expressions..."
                className="w-full h-20 text-sage-900 placeholder:text-stone-300 border-none p-0 focus:ring-0 resize-none"
              />
            </div>
            <div className="bg-white rounded-2xl p-4 border border-stone-100 focus-within:ring-2 focus-within:ring-sage-100 transition-all shadow-sm">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">What do you hear?</label>
              <textarea
                value={data.hear}
                onChange={(e) => setData({ ...data, hear: e.target.value })}
                placeholder="Applause, silence, specific words..."
                className="w-full h-20 text-sage-900 placeholder:text-stone-300 border-none p-0 focus:ring-0 resize-none"
              />
            </div>
            <div className="bg-white rounded-2xl p-4 border border-stone-100 focus-within:ring-2 focus-within:ring-sage-100 transition-all shadow-sm">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">Physical sensations?</label>
              <textarea
                value={data.feel}
                onChange={(e) => setData({ ...data, feel: e.target.value })}
                placeholder="Warmth, handshake, racing heart..."
                className="w-full h-20 text-sage-900 placeholder:text-stone-300 border-none p-0 focus:ring-0 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {step === 'feelings' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Heart className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">The Emotions</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Emotion is the glue that makes the memory stick.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.emotions}
              onChange={(e) => setData({ ...data, emotions: e.target.value })}
              placeholder="I feel an overwhelming sense of..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'identity' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Fingerprint className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">New Identity</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Who have you become to achieve this?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.identity}
              onChange={(e) => setData({ ...data, identity: e.target.value })}
              placeholder="I am someone who... I now embody..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'anchor' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Anchor className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Anchor & Mantra</h2>
            <p className="text-stone-500 font-serif italic">
              Connect a physical trigger and a phrase to this feeling.
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">Physical Anchor</label>
              <input
                value={data.anchor}
                onChange={(e) => setData({ ...data, anchor: e.target.value })}
                placeholder="e.g., Press thumb and ring finger together"
                className="w-full bg-sage-50 rounded-xl p-3 text-sage-900 placeholder:text-stone-300 border border-transparent focus:bg-white focus:border-sage-200 focus:ring-4 focus:ring-sage-50 transition-all"
              />
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">Your Mantra</label>
              <input
                value={data.mantra}
                onChange={(e) => setData({ ...data, mantra: e.target.value })}
                placeholder="e.g., 'I am worthy and capable'"
                className="w-full bg-sage-50 rounded-xl p-3 text-sage-900 placeholder:text-stone-300 border border-transparent focus:bg-white focus:border-sage-200 focus:ring-4 focus:ring-sage-50 transition-all font-serif italic text-lg"
              />
            </div>
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-sage-100">
              <Sparkles className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Vision Complete</h2>
            <p className="text-stone-500 font-serif italic">The seed is planted.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">The Goal</p>
            <p className="text-sage-900 font-serif text-xl leading-relaxed">{data.goal}</p>
          </div>

          <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Play size={64} /></div>
            <p className="text-xs font-bold uppercase tracking-widest text-sage-700 mb-3">The Scene</p>
            <p className="text-sage-900 leading-relaxed italic">{data.scene}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-1">Seen</span>
              <span className="text-sm text-stone-600">{data.see}</span>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-1">Felt</span>
              <span className="text-sm text-stone-600">{data.feel}</span>
            </div>
          </div>

          {(data.anchor || data.mantra) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 text-center">
              {data.mantra && <p className="font-serif text-xl text-sage-600 italic mb-2">"{data.mantra}"</p>}
              {data.anchor && <p className="text-xs text-stone-400 uppercase tracking-widest">Anchor: {data.anchor}</p>}
            </div>
          )}
        </div>
      )}
    </WizardLayout>
  );
}
