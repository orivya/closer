import React, { useState } from 'react';
import { Layers, Plus, X, ArrowRight, Sparkles, Bell, Repeat, CheckCircle } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface HabitStackingProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'existing' | 'new-habits' | 'stack' | 'cues' | 'summary';

interface HabitStack {
  id: string;
  existing: string;
  newHabit: string;
}

export default function HabitStacking({ onBack, onComplete }: HabitStackingProps) {
  const [step, setStep] = useState<Step>('existing');
  const [existingHabits, setExistingHabits] = useState<string[]>(['']);
  const [newHabits, setNewHabits] = useState<string[]>(['']);
  const [stacks, setStacks] = useState<HabitStack[]>([]);
  const [cues, setCues] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['existing', 'new-habits', 'stack', 'cues', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    if (step === 'new-habits' && stacks.length === 0) {
      // Auto-create initial stack pairs
      const validExisting = existingHabits.filter(h => h.trim());
      const validNew = newHabits.filter(h => h.trim());
      const initialStacks: HabitStack[] = validNew.map((newHabit, i) => ({
        id: Date.now().toString() + i,
        existing: validExisting[i] || validExisting[0] || '',
        newHabit,
      }));
      setStacks(initialStacks);
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const title = `Habit Stack: ${stacks[0]?.newHabit.slice(0, 40) || 'New habits'}`;
    const content = `## Habit Stacking Plan\n\n### Existing Habits (Anchors)\n${existingHabits.filter(h => h.trim()).map(h => `- ${h}`).join('\n')}\n\n### New Habits to Build\n${newHabits.filter(h => h.trim()).map(h => `- ${h}`).join('\n')}\n\n### Habit Stacks\n${stacks.map(s => `**After I** ${s.existing}, **I will** ${s.newHabit}`).join('\n\n')}\n\n### Environmental Cues & Reminders\n${cues}\n\n---\n*Created with Habit Stacking framework*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const addExistingHabit = () => setExistingHabits([...existingHabits, '']);
  const updateExistingHabit = (index: number, value: string) => {
    const updated = [...existingHabits];
    updated[index] = value;
    setExistingHabits(updated);
  };
  const removeExistingHabit = (index: number) => {
    if (existingHabits.length > 1) {
      setExistingHabits(existingHabits.filter((_, i) => i !== index));
    }
  };

  const addNewHabit = () => setNewHabits([...newHabits, '']);
  const updateNewHabit = (index: number, value: string) => {
    const updated = [...newHabits];
    updated[index] = value;
    setNewHabits(updated);
  };
  const removeNewHabit = (index: number) => {
    if (newHabits.length > 1) {
      setNewHabits(newHabits.filter((_, i) => i !== index));
    }
  };

  const updateStack = (id: string, field: 'existing' | 'newHabit', value: string) => {
    setStacks(stacks.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const canProceed = () => {
    switch (step) {
      case 'existing': return existingHabits.some(h => h.trim().length > 0);
      case 'new-habits': return newHabits.some(h => h.trim().length > 0);
      case 'stack': return stacks.some(s => s.existing.trim() && s.newHabit.trim());
      case 'cues': return cues.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  return (
    <WizardLayout
      title="Habit Stacking"
      icon={Layers}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'summary' ? 'Save Habit Plan' : 'Continue'}
      color="sage"
    >
      {step === 'existing' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Your Anchor Habits</h2>
            <p className="text-stone-500 font-serif italic">What do you already do everyday without thinking?</p>
          </div>

          <div className="space-y-3 mb-6">
            {existingHabits.map((habit, index) => (
              <div key={index} className="flex items-center gap-3 animate-fade-in">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0 text-stone-500 font-bold text-sm">
                  {index + 1}
                </div>
                <input
                  value={habit}
                  onChange={(e) => updateExistingHabit(index, e.target.value)}
                  placeholder="e.g., Brush my teeth, Make coffee..."
                  className="flex-1 bg-white rounded-xl p-4 text-sage-900 placeholder:text-stone-300 border border-stone-200 focus:border-stone-300 focus:ring-4 focus:ring-stone-50 transition-all shadow-sm"
                  autoFocus={index === existingHabits.length - 1}
                />
                {existingHabits.length > 1 && (
                  <button
                    onClick={() => removeExistingHabit(index)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addExistingHabit}
            className="w-full py-4 rounded-xl border-2 border-dashed border-stone-200 text-stone-400 hover:border-sage-300 hover:text-sage-600 hover:bg-sage-50 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Anchor
          </button>

          <div className="mt-8 bg-stone-50 rounded-2xl p-4 border border-stone-100 text-left text-stone-600 text-sm">
            <span className="font-bold uppercase text-xs tracking-widest block mb-1">Examples</span>
            Making coffee, brushing teeth, getting dressed, eating lunch, arriving home.
          </div>
        </div>
      )}

      {step === 'new-habits' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">New Habits to Build</h2>
            <p className="text-stone-500 font-serif italic">What habits do you want to start doing?</p>
          </div>

          <div className="space-y-3 mb-6">
            {newHabits.map((habit, index) => (
              <div key={index} className="flex items-center gap-3 animate-fade-in">
                <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0 text-sage-600 font-bold text-sm">
                  {index + 1}
                </div>
                <input
                  value={habit}
                  onChange={(e) => updateNewHabit(index, e.target.value)}
                  placeholder="e.g., Meditate for 2 minutes..."
                  className="flex-1 bg-white rounded-xl p-4 text-sage-900 placeholder:text-stone-300 border border-stone-200 focus:border-sage-300 focus:ring-4 focus:ring-sage-50 transition-all shadow-sm"
                  autoFocus={index === newHabits.length - 1}
                />
                {newHabits.length > 1 && (
                  <button
                    onClick={() => removeNewHabit(index)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addNewHabit}
            className="w-full py-4 rounded-xl border-2 border-dashed border-stone-200 text-stone-400 hover:border-sage-300 hover:text-sage-600 hover:bg-sage-50 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New Habit
          </button>

          <div className="mt-8 bg-sage-50 rounded-2xl p-4 border border-sage-100 text-left text-sage-800 text-sm flex gap-3">
            <div className="bg-white p-1.5 rounded-lg h-fit text-sage-500 shadow-sm"><Sparkles size={16} /></div>
            <p><span className="font-bold">Tiny Habits Tip:</span> Start ridiculously small. "Do 1 pushup" is better than "workout for an hour" when building consistency.</p>
          </div>
        </div>
      )}

      {step === 'stack' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Build Your Stacks</h2>
            <p className="text-stone-500 font-serif italic">Connect new habits to existing anchors</p>
          </div>

          <div className="space-y-4">
            {stacks.map((stack, index) => (
              <div key={stack.id} className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Repeat className="text-stone-400" size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-500">After I...</span>
                  </div>
                  <select
                    value={stack.existing}
                    onChange={(e) => updateStack(stack.id, 'existing', e.target.value)}
                    className="w-full bg-stone-50 rounded-xl p-4 text-sage-900 border border-stone-100 focus:border-sage-300 focus:ring-0 text-lg cursor-pointer hover:bg-stone-100 transition-colors appearance-none"
                  >
                    <option value="">Select existing habit...</option>
                    {existingHabits.filter(h => h.trim()).map((h, i) => (
                      <option key={i} value={h}>{h}</option>
                    ))}
                  </select>

                  <div className="flex justify-center py-2">
                    <ArrowRight className="w-5 h-5 text-stone-300" />
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-sage-500" size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest text-sage-600">I will...</span>
                  </div>
                  <select
                    value={stack.newHabit}
                    onChange={(e) => updateStack(stack.id, 'newHabit', e.target.value)}
                    className="w-full bg-sage-50 rounded-xl p-4 text-sage-900 border border-sage-100 focus:border-sage-300 focus:ring-0 text-lg cursor-pointer hover:bg-sage-100 transition-colors appearance-none"
                  >
                    <option value="">Select new habit...</option>
                    {newHabits.filter(h => h.trim()).map((h, i) => (
                      <option key={i} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'cues' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Bell className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Environmental Cues</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              How will you remember? Designing your environment is key.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={cues}
              onChange={(e) => setCues(e.target.value)}
              placeholder="e.g., Put meditation cushion next to coffee maker..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-stone-100">
              <Layers className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Your Habit Stacks</h2>
            <p className="text-stone-500 font-serif italic">Ready to build new behaviors</p>
          </div>

          <div className="space-y-4">
            {stacks.filter(s => s.existing && s.newHabit).map((stack, i) => (
              <div key={stack.id} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <p className="text-xs font-bold uppercase tracking-widest text-stone-300 mb-3">Stack {i + 1}</p>
                <p className="text-sage-900 text-lg leading-relaxed">
                  After I <span className="font-bold text-stone-500 bg-stone-100 px-1 rounded">{stack.existing}</span>,
                  I will <span className="font-bold text-sage-700 bg-sage-100 px-1 rounded">{stack.newHabit}</span>.
                </p>
              </div>
            ))}
          </div>

          {cues && (
            <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-sage-600 mb-2">Environmental Cues</h3>
              <p className="text-sage-900 text-sm leading-relaxed">{cues}</p>
            </div>
          )}
        </div>
      )}
    </WizardLayout>
  );
}
