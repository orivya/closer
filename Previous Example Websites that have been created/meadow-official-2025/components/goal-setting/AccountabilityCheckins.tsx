import React, { useState } from 'react';
import { Users, Calendar, TrendingUp, Sparkles, Check, AlertCircle, Bookmark } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface AccountabilityCheckinsProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'goal' | 'progress' | 'blockers' | 'next-week' | 'accountability' | 'summary';

export default function AccountabilityCheckins({ onBack, onComplete }: AccountabilityCheckinsProps) {
  const [step, setStep] = useState<Step>('goal');
  const [data, setData] = useState({
    goal: '',
    progressScore: 50,
    progressNotes: '',
    blockers: '',
    nextWeek: '',
    accountabilityPartner: '',
    commitmentStatement: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['goal', 'progress', 'blockers', 'next-week', 'accountability', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const title = `Accountability Check-in: ${today}`;
    const content = `## Weekly Accountability Check-in\n*${today}*\n\n### Goal I'm Working On\n${data.goal}\n\n### Progress This Week\n**Score: ${data.progressScore}%**\n${data.progressNotes}\n\n### What Got in the Way\n${data.blockers}\n\n### Commitments for Next Week\n${data.nextWeek}\n\n### Accountability\n**Partner:** ${data.accountabilityPartner || 'Self'}\n**Commitment:** ${data.commitmentStatement}\n\n---\n*Created with Accountability Check-ins*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const canProceed = () => {
    switch (step) {
      case 'goal': return data.goal.trim().length > 0;
      case 'progress': return data.progressNotes.trim().length > 0;
      case 'blockers': return data.blockers.trim().length > 0;
      case 'next-week': return data.nextWeek.trim().length > 0;
      case 'accountability': return data.commitmentStatement.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  const getProgressLabel = (score: number) => {
    if (score >= 80) return { text: 'Crushing it!', icon: Sparkles };
    if (score >= 60) return { text: 'Good progress', icon: TrendingUp };
    if (score >= 40) return { text: 'Moving forward', icon: Check };
    if (score >= 20) return { text: 'Some progress', icon: Calendar };
    return { text: 'Just starting', icon: AlertCircle };
  };

  return (
    <WizardLayout
      title="Weekly Check-in"
      icon={Users}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'summary' ? 'Save Check-in' : 'Continue'}
      color="sage"
    >
      {step === 'goal' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Calendar className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Goal Focus</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What major goal are you checking in on today?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto">
            <textarea
              value={data.goal}
              onChange={(e) => setData({ ...data, goal: e.target.value })}
              placeholder="e.g., Complete the first draft..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'progress' && (
        <div className="text-center">
          <div className="mb-6">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Progress Check</h2>
            <p className="text-stone-500 font-serif italic">How did this week go?</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Momentum</span>
                <div className="flex items-center gap-2 text-sage-600">
                  {React.createElement(getProgressLabel(data.progressScore).icon, { size: 18 })}
                  <span className="font-bold text-sm">{data.progressScore}%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={data.progressScore}
                onChange={(e) => setData({ ...data, progressScore: parseInt(e.target.value) })}
                className="w-full h-2 bg-stone-100 rounded-full appearance-none cursor-pointer accent-sage-500"
              />
              <p className="mt-3 text-sm text-sage-700 font-medium">{getProgressLabel(data.progressScore).text}</p>
            </div>

            <div className="border-t border-stone-100 pt-6">
              <p className="text-left text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Details</p>
              <textarea
                value={data.progressNotes}
                onChange={(e) => setData({ ...data, progressNotes: e.target.value })}
                placeholder="Describe your progress this week..."
                className="w-full h-32 bg-stone-50 rounded-xl p-4 text-sage-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-100 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {step === 'blockers' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <AlertCircle className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Blockers</h2>
            <p className="text-stone-500 font-serif italic">What got in the way?</p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto">
            <textarea
              value={data.blockers}
              onChange={(e) => setData({ ...data, blockers: e.target.value })}
              placeholder="Honest obstacles..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'next-week' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Bookmark className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Next Week</h2>
            <p className="text-stone-500 font-serif italic">What specific actions will you take?</p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.nextWeek}
              onChange={(e) => setData({ ...data, nextWeek: e.target.value })}
              placeholder="I commit to...&#10;1. &#10;2. "
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'accountability' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Accountability</h2>
            <p className="text-stone-500 font-serif italic">Who will hold you to it?</p>
          </div>

          <div className="space-y-4 text-left">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">Accountability Partner</label>
              <input
                value={data.accountabilityPartner}
                onChange={(e) => setData({ ...data, accountabilityPartner: e.target.value })}
                placeholder="Name (optional)"
                className="w-full bg-stone-50 rounded-xl p-3 text-sage-900 placeholder:text-stone-300 border border-transparent focus:border-sage-200 focus:bg-white focus:ring-0 transition-all font-medium"
              />
            </div>

            <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100">
              <label className="text-xs font-bold uppercase tracking-widest text-sage-600 mb-3 block">Commitment Statement</label>
              <textarea
                value={data.commitmentStatement}
                onChange={(e) => setData({ ...data, commitmentStatement: e.target.value })}
                placeholder="I commit to checking in next week having..."
                className="w-full h-32 bg-white/50 rounded-xl p-4 text-sage-900 placeholder:text-sage-800/30 border border-sage-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage-200 resize-none text-lg font-serif italic"
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
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Check-in Complete</h2>
            <p className="text-stone-500 font-serif italic">You've done the work</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Goal Focus</p>
            <p className="text-sage-900 font-serif text-lg leading-relaxed">{data.goal}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-sage-600">Progress</p>
                <span className="font-bold text-sage-600 text-sm">{data.progressScore}%</span>
              </div>
              <p className="text-stone-600 text-sm">{data.progressNotes}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Blockers</p>
              <p className="text-stone-600 text-sm">{data.blockers}</p>
            </div>
          </div>

          <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100">
            <p className="text-xs font-bold uppercase tracking-widest text-sage-700 mb-2">Next Week I Will</p>
            <p className="text-sage-900 text-lg font-serif italic mb-4">"{data.commitmentStatement}"</p>
            <p className="text-xs text-sage-600/70 border-t border-sage-200 pt-3">
              Actions: {data.nextWeek}
            </p>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
