import React, { useState } from 'react';
import { Sun, Calendar, Zap, RefreshCw, Target, Check } from 'lucide-react';
import WizardLayout from './WizardLayout';

interface WeeklyResetProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

type Step = 'moments' | 'energy' | 'working' | 'different' | 'intention' | 'summary';

const WeeklyReset: React.FC<WeeklyResetProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('moments');
  const [moments, setMoments] = useState<string[]>(['', '', '']);
  const [energy, setEnergy] = useState('');
  const [working, setWorking] = useState('');
  const [different, setDifferent] = useState('');
  const [intention, setIntention] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['moments', 'energy', 'working', 'different', 'intention', 'summary'];
  const stepIndex = steps.indexOf(step);

  const updateMoment = (index: number, value: string) => {
    setMoments(prev => {
      const newMoments = [...prev];
      newMoments[index] = value;
      return newMoments;
    });
  };

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setStep(steps[stepIndex + 1]);
    }
  };

  const getWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const weekRange = getWeekRange();
      const validMoments = moments.filter(m => m.trim());

      let content = `Moments to remember from this week: ${validMoments.join('. ')}.\n\n`;
      content += `What felt energizing: ${energy}\n\n`;
      content += `What quietly worked well: ${working}\n\n`;
      content += `What I'd do differently: ${different}\n\n`;
      content += `My intention for next week: ${intention}`;

      await onComplete(`Weekly Reset`, content.trim());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'moments': return moments.some(m => m.trim().length > 0);
      case 'energy': return energy.trim().length > 0;
      case 'working': return working.trim().length > 0;
      case 'different': return different.trim().length > 0;
      case 'intention': return intention.trim().length > 0;
      default: return true;
    }
  };

  return (
    <WizardLayout
      title="Weekly Reset"
      icon={Sun}
      step={stepIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? nextStep : undefined}
      onComplete={step === 'summary' ? handleSave : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'intention' ? 'See Summary' : 'Continue'}
      color="sage"
    >
      {/* Step 1: Moments */}
      {step === 'moments' && (
        <>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Calendar size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">
              Moments to Remember
            </h2>
            <p className="text-stone-500 font-serif italic">
              What are 3 moments you want to remember?
            </p>
          </div>

          <div className="space-y-4 mb-2">
            {moments.map((moment, index) => (
              <div key={index} className="relative animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-sage-50 text-sage-600 flex items-center justify-center text-sm font-medium border border-sage-100">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={moment}
                  onChange={(e) => updateMoment(index, e.target.value)}
                  placeholder={index === 0 ? "A highlight..." : "Another moment..."}
                  className="w-full pl-20 pr-6 py-5 bg-white rounded-3xl text-sage-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 transition-all border border-stone-100 shadow-sm"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Step 2: Energy */}
      {step === 'energy' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Zap size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              What Felt Energizing?
            </h2>
            <p className="text-stone-500 font-serif italic">
              What made you feel most alive or engaged?
            </p>
          </div>

          <textarea
            autoFocus
            value={energy}
            onChange={(e) => setEnergy(e.target.value)}
            placeholder="I felt most energized when..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 3: Working */}
      {step === 'working' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Check size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              What Quietly Worked?
            </h2>
            <p className="text-stone-500 font-serif italic">
              What small wins or good habits went right?
            </p>
          </div>

          <textarea
            autoFocus
            value={working}
            onChange={(e) => setWorking(e.target.value)}
            placeholder="It actually went well when..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 4: Different */}
      {step === 'different' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <RefreshCw size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              What to Change?
            </h2>
            <p className="text-stone-500 font-serif italic">
              What would make next week run smoother?
            </p>
          </div>

          <textarea
            autoFocus
            value={different}
            onChange={(e) => setDifferent(e.target.value)}
            placeholder="Next week, I want to try..."
            className="w-full p-6 bg-white rounded-3xl text-sage-900 text-lg placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200/50 resize-none h-40 border border-stone-100 shadow-sm transition-all"
          />
        </>
      )}

      {/* Step 5: Intention */}
      {step === 'intention' && (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-stone-100">
              <Target size={32} className="text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-3">
              Next Week's Intention
            </h2>
            <p className="text-stone-500 font-serif italic">
              Set one clear tone or focus for the week ahead.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm text-center">
            <input
              autoFocus
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="My intention is..."
              className="w-full text-center text-3xl font-serif text-sage-900 placeholder:text-stone-200 focus:outline-none bg-transparent"
            />
          </div>
        </>
      )}

      {/* Step 6: Summary */}
      {step === 'summary' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-white shadow-sm">
              <Check size={32} className="text-sage-600" strokeWidth={2} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Reset Complete</h2>
            <p className="text-stone-500">You're ready for the week ahead.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 space-y-8">
            <div>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Highlights</h3>
              <ul className="space-y-3">
                {moments.filter(m => m.trim()).map((m, i) => (
                  <li key={i} className="flex gap-3 text-sage-900">
                    <span className="text-sage-400 font-serif italic">{i + 1}.</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-100">
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Energized By</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{energy}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Worked Well</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{working}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">Intention</h3>
              <div className="bg-sage-50 rounded-2xl p-6 text-center">
                <p className="font-serif text-2xl text-sage-900">{intention}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </WizardLayout>
  );
};

export default WeeklyReset;
