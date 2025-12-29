import React, { useState } from 'react';
import { Rocket, Target, Calendar, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface NinetyDaySprintProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'vision' | 'month1' | 'month2' | 'month3' | 'obstacles' | 'summary';

export default function NinetyDaySprint({ onBack, onComplete }: NinetyDaySprintProps) {
  const [step, setStep] = useState<Step>('vision');
  const [data, setData] = useState({
    vision: '',
    month1: '',
    month2: '',
    month3: '',
    obstacles: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['vision', 'month1', 'month2', 'month3', 'obstacles', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const title = `90-Day Sprint: ${data.vision.slice(0, 40)}${data.vision.length > 40 ? '...' : ''}`;
    const content = `## 90-Day Sprint Plan\n\n### The Vision\n${data.vision}\n\n---\n\n### Month 1: Foundation\n${data.month1}\n\n### Month 2: Building\n${data.month2}\n\n### Month 3: Finishing Strong\n${data.month3}\n\n---\n\n### Potential Obstacles & Solutions\n${data.obstacles}\n\n---\n*Created with 90-Day Sprint framework*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const canProceed = () => {
    if (step === 'summary') return true;
    return data[step as keyof typeof data].trim().length > 0;
  };

  const getMonthDates = (monthOffset: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthOffset);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <WizardLayout
      title="90-Day Sprint"
      icon={Rocket}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'summary' ? 'Save Sprint Plan' : 'Continue'}
      color="sage"
    >
      {step === 'vision' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Target className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">90-Day Vision</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What will be different in 90 days? Describe the outcome.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.vision}
              onChange={(e) => setData({ ...data, vision: e.target.value })}
              placeholder="In 90 days, I will have..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>

          <div className="max-w-xl mx-auto bg-sage-50 rounded-2xl p-4 border border-sage-100 text-left">
            <p className="text-sm text-sage-900/80">
              <strong className="text-sage-700">Why 90 days?</strong> It's long enough to see real change, but short enough to maintain urgency.
            </p>
          </div>
        </div>
      )}

      {(step === 'month1' || step === 'month2' || step === 'month3') && (
        <div className="text-center">
          {/* Mini Timeline */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {['month1', 'month2', 'month3'].map((m, i) => {
              const isActive = step === m;
              const isPast = steps.indexOf(m as Step) < currentIndex;
              return (
                <div key={m} className={`flex items-center gap-2 ${isActive ? 'text-sage-700 font-bold' : isPast ? 'text-sage-400' : 'text-stone-300'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 ${isActive ? 'bg-white border-sage-600 shadow-sm' :
                    isPast ? 'bg-sage-50 border-sage-200' :
                      'bg-transparent border-stone-200'
                    }`}>
                    {isPast ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <span className="text-xs uppercase tracking-widest hidden sm:inline">Month {i + 1}</span>
                </div>
              );
            })}
          </div>

          <div className="mb-6">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">
              {step === 'month1' && 'Month 1: Foundation'}
              {step === 'month2' && 'Month 2: Building'}
              {step === 'month3' && 'Month 3: Finishing'}
            </h2>
            <p className="text-stone-500 font-serif italic mb-4">
              {getMonthDates(step === 'month1' ? 0 : step === 'month2' ? 1 : 2)}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto">
            <textarea
              value={data[step]}
              onChange={(e) => setData({ ...data, [step]: e.target.value })}
              placeholder={
                step === 'month1' ? "What habits or systems will you build?" :
                  step === 'month2' ? "How will you gain momentum?" :
                    "What is the final push to the finish line?"
              }
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'obstacles' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Shield className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Pre-Mortem</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What could go wrong? Planning for failure helps you succeed.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.obstacles}
              onChange={(e) => setData({ ...data, obstacles: e.target.value })}
              placeholder="I might get stuck when... If that happens, I will..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-sage-100">
              <Sparkles className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Sprint Plan Ready</h2>
            <p className="text-stone-500 font-serif italic">Your roadmap for the next 90 days</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">The Vision</p>
            <p className="text-sage-900 font-serif text-lg leading-relaxed">{data.vision}</p>
          </div>

          <div className="space-y-3">
            {[
              { key: 'month1', label: 'Month 1: Foundation', date: getMonthDates(0) },
              { key: 'month2', label: 'Month 2: Building', date: getMonthDates(1) },
              { key: 'month3', label: 'Month 3: Finishing', date: getMonthDates(2) },
            ].map((month) => (
              <div key={month.key} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 flex gap-4">
                <div className="w-1 bg-sage-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sage-700 text-sm">{month.label}</span>
                    <span className="text-xs text-stone-400">{month.date}</span>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">{data[month.key as keyof typeof data]}</p>
                </div>
              </div>
            ))}
          </div>

          {data.obstacles && (
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Obstacle Plan</h3>
              <p className="text-stone-600 text-sm">{data.obstacles}</p>
            </div>
          )}
        </div>
      )}
    </WizardLayout>
  );
}
