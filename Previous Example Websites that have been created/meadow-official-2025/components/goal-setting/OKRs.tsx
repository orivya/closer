import React, { useState } from 'react';
import { Target, Flag, Plus, X, BarChart3, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface OKRsProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'objective' | 'key-results' | 'initiatives' | 'summary';

interface KeyResult {
  id: string;
  text: string;
  metric: string;
}

export default function OKRs({ onBack, onComplete }: OKRsProps) {
  const [step, setStep] = useState<Step>('objective');
  const [objective, setObjective] = useState('');
  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { id: '1', text: '', metric: '' },
    { id: '2', text: '', metric: '' },
    { id: '3', text: '', metric: '' },
  ]);
  const [initiatives, setInitiatives] = useState<string[]>(['']);
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['objective', 'key-results', 'initiatives', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const title = `OKR`;
    const validKeyResults = keyResults.filter(kr => kr.text.trim());
    const validInitiatives = initiatives.filter(i => i.trim());

    let content = `Objective: ${objective}\n\n`;
    content += `Key results:\n${validKeyResults.map((kr, i) => `${i + 1}. ${kr.text}${kr.metric ? ` (${kr.metric})` : ''}`).join('\n')}\n\n`;
    if (validInitiatives.length > 0) {
      content += `Initiatives to get there: ${validInitiatives.join(', ')}.`;
    }

    await onComplete(title, content.trim());
    setIsSaving(false);
  };

  const updateKeyResult = (id: string, field: 'text' | 'metric', value: string) => {
    setKeyResults(keyResults.map(kr =>
      kr.id === id ? { ...kr, [field]: value } : kr
    ));
  };

  const addKeyResult = () => {
    if (keyResults.length < 5) {
      setKeyResults([...keyResults, { id: Date.now().toString(), text: '', metric: '' }]);
    }
  };

  const removeKeyResult = (id: string) => {
    if (keyResults.length > 1) {
      setKeyResults(keyResults.filter(kr => kr.id !== id));
    }
  };

  const addInitiative = () => {
    setInitiatives([...initiatives, '']);
  };

  const updateInitiative = (index: number, value: string) => {
    const newInitiatives = [...initiatives];
    newInitiatives[index] = value;
    setInitiatives(newInitiatives);
  };

  const removeInitiative = (index: number) => {
    if (initiatives.length > 1) {
      setInitiatives(initiatives.filter((_, i) => i !== index));
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'objective': return objective.trim().length > 0;
      case 'key-results': return keyResults.some(kr => kr.text.trim().length > 0);
      case 'initiatives': return initiatives.some(i => i.trim().length > 0);
      case 'summary': return true;
      default: return false;
    }
  };

  return (
    <WizardLayout
      title="OKRs"
      icon={Target}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'summary' ? 'Save OKR' : 'Continue'}
      color="sage"
    >
      {step === 'objective' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Flag className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Set Your Objective</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What ambitious, qualitative goal do you want to achieve?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="e.g., Become the most trusted brand in our niche..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>

          <div className="max-w-xl mx-auto bg-sage-50 rounded-2xl p-4 border border-sage-100 text-left">
            <p className="text-sm text-sage-900/80">
              <strong className="text-sage-700">Tip:</strong> Objectives should be inspirational and aggressive, but not necessarily measurable yet. That's for the Key Results.
            </p>
          </div>
        </div>
      )}

      {step === 'key-results' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Key Results</h2>
            <p className="text-stone-500 font-serif italic">How will you measure success? (Quantitative)</p>
          </div>

          <div className="space-y-4 text-left">
            {keyResults.map((kr, index) => (
              <div key={kr.id} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm animate-fade-in transition-all focus-within:ring-2 focus-within:ring-sage-100 focus-within:border-sage-200">
                <div className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-sage-50 text-sage-600 flex items-center justify-center text-xs font-bold mt-3">{index + 1}</span>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-300 mb-1 block">Result</label>
                      <input
                        value={kr.text}
                        onChange={(e) => updateKeyResult(kr.id, 'text', e.target.value)}
                        placeholder="e.g., Increase revenue to $10k..."
                        className="w-full text-sage-900 placeholder:text-stone-300 border-none p-0 focus:ring-0 text-base font-medium"
                      />
                    </div>
                    <div className="border-t border-stone-100 pt-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-stone-300 mb-1 block">Measurement</label>
                      <input
                        value={kr.metric}
                        onChange={(e) => updateKeyResult(kr.id, 'metric', e.target.value)}
                        placeholder="e.g., $10,000 MRR"
                        className="w-full text-stone-600 placeholder:text-stone-300 border-none p-0 focus:ring-0 text-sm"
                      />
                    </div>
                  </div>
                  {keyResults.length > 1 && (
                    <button
                      onClick={() => removeKeyResult(kr.id)}
                      className="text-stone-300 hover:text-stone-500 p-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {keyResults.length < 5 && (
            <button
              onClick={addKeyResult}
              className="w-full py-4 mt-4 rounded-xl border-2 border-dashed border-stone-200 text-stone-400 hover:border-sage-300 hover:text-sage-600 hover:bg-sage-50 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Key Result
            </button>
          )}
        </div>
      )}

      {step === 'initiatives' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Initiatives</h2>
            <p className="text-stone-500 font-serif italic">What will you do to get there?</p>
          </div>

          <div className="space-y-3 text-left">
            {initiatives.map((init, index) => (
              <div key={index} className="flex items-center gap-3 animate-fade-in group">
                <div className="w-2 h-2 rounded-full bg-sage-300 group-focus-within:bg-sage-500 transition-colors" />
                <input
                  value={init}
                  onChange={(e) => updateInitiative(index, e.target.value)}
                  placeholder="Action or project..."
                  className="flex-1 bg-white rounded-xl p-4 text-sage-900 placeholder:text-stone-300 border border-stone-200 focus:border-sage-300 focus:ring-4 focus:ring-sage-50 transition-all shadow-sm"
                  autoFocus={index === initiatives.length - 1}
                />
                {initiatives.length > 1 && (
                  <button
                    onClick={() => removeInitiative(index)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-stone-300 hover:text-stone-500 hover:bg-stone-50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addInitiative}
            className="w-full py-4 mt-6 rounded-xl border-2 border-dashed border-stone-200 text-stone-400 hover:border-sage-300 hover:text-sage-600 hover:bg-sage-50 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Initiative
          </button>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-sage-100">
              <Target className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">OKR Ready</h2>
            <p className="text-stone-500 font-serif italic">Aim high, measure well</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <span className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-2 block">Objective</span>
            <p className="text-sage-900 font-serif text-xl leading-relaxed">{objective}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 block">Key Results</span>
            <div className="space-y-4">
              {keyResults.filter(kr => kr.text.trim()).map((kr, i) => (
                <div key={i} className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-sage-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sage-900 font-medium">{kr.text}</p>
                    {kr.metric && <p className="text-sm text-stone-500 bg-stone-50 px-2 py-0.5 rounded inline-block mt-1">{kr.metric}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {initiatives.some(i => i.trim()) && (
            <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100">
              <span className="text-xs font-bold uppercase tracking-widest text-sage-700 mb-3 block">Initiatives</span>
              <ul className="space-y-2">
                {initiatives.filter(i => i.trim()).map((init, i) => (
                  <li key={i} className="flex items-start gap-2 text-sage-900 text-sm">
                    <Zap className="w-4 h-4 text-sage-400 mt-0.5 flex-shrink-0 fill-sage-400" />
                    {init}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </WizardLayout>
  );
}
