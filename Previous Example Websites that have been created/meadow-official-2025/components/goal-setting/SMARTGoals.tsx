import React, { useState } from 'react';
import { Target, CheckCircle2, Sparkles, ArrowRight, Check } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface SMARTGoalsProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'specific' | 'measurable' | 'achievable' | 'relevant' | 'timebound' | 'summary';

const SMART_LABELS = {
  specific: { letter: 'S', word: 'Specific', question: 'What exactly do you want to accomplish?' },
  measurable: { letter: 'M', word: 'Measurable', question: 'How will you track progress and know when you\'ve succeeded?' },
  achievable: { letter: 'A', word: 'Achievable', question: 'What makes this goal realistic? What resources or support do you need?' },
  relevant: { letter: 'R', word: 'Relevant', question: 'Why does this goal matter to you right now?' },
  timebound: { letter: 'T', word: 'Time-bound', question: 'What\'s your target deadline?' },
};

export default function SMARTGoals({ onBack, onComplete }: SMARTGoalsProps) {
  const [step, setStep] = useState<Step>('specific');
  const [answers, setAnswers] = useState({
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timebound: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['specific', 'measurable', 'achievable', 'relevant', 'timebound', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      const title = `SMART Goal`;
      let content = `My goal: ${answers.specific}\n\n`;
      content += `How I'll measure success: ${answers.measurable}\n\n`;
      content += `Why this is achievable: ${answers.achievable}\n\n`;
      content += `Why this matters to me: ${answers.relevant}\n\n`;
      content += `Timeline: ${answers.timebound}`;

      await onComplete(title, content.trim());
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const currentAnswer = answers[step as keyof typeof answers];
  const canProceed = step === 'summary' || (typeof currentAnswer === 'string' && currentAnswer.trim().length > 0);

  const renderSmartLetter = (key: keyof typeof SMART_LABELS, isActive: boolean, isComplete: boolean) => (
    <div
      key={key}
      className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif text-lg font-bold transition-all duration-300 ${isComplete ? 'bg-sage-600 text-white shadow-sm' :
        isActive ? 'bg-sage-50 text-sage-700 ring-2 ring-sage-200' :
          'bg-stone-50 text-stone-300'
        }`}
    >
      {isComplete ? <Check size={18} /> : SMART_LABELS[key].letter}
    </div>
  );

  return (
    <WizardLayout
      title="SMART Goals"
      icon={Target}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed}
      isSaving={isSaving}
      nextLabel={step === 'summary' ? 'Save Goal' : 'Continue'}
      color="sage"
    >
      {/* Visual Progress */}
      <div className="flex justify-center gap-2 mb-8">
        {(Object.keys(SMART_LABELS) as Array<keyof typeof SMART_LABELS>).map((key) => {
          const keyIndex = steps.indexOf(key);
          const isActive = step === key;
          const isComplete = currentIndex > keyIndex;
          return renderSmartLetter(key, isActive, isComplete);
        })}
      </div>

      {step !== 'summary' ? (
        <div className="text-center">
          <div className="mb-8">
            <h2 className="font-serif text-3xl text-sage-900 mb-3 block">
              {SMART_LABELS[step as keyof typeof SMART_LABELS].word}
            </h2>
            <p className="text-stone-500 font-serif italic text-lg max-w-md mx-auto">
              {SMART_LABELS[step as keyof typeof SMART_LABELS].question}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto">
            <textarea
              value={answers[step as keyof typeof answers]}
              onChange={(e) => setAnswers({ ...answers, [step]: e.target.value })}
              placeholder="Write your thoughts here..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>

          {/* Contextual Tips */}
          <div className="mt-6 max-w-md mx-auto bg-sage-50 rounded-2xl p-4 border border-sage-100/50 flex gap-3 text-left">
            <div className="bg-white p-2 rounded-full h-fit shadow-sm">
              <Sparkles size={16} className="text-sage-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-sage-600 uppercase tracking-widest mb-1">Method Tip</p>
              <p className="text-sm text-sage-900/80 leading-relaxed">
                {step === 'specific' && 'Instead of "get healthier," try "exercise 3 times per week for 30 minutes."'}
                {step === 'measurable' && 'Think numbers, dates, or tangible outcomes you can check off.'}
                {step === 'achievable' && 'Stretch yourself, but ensure you have the time, skills, and resources needed.'}
                {step === 'relevant' && 'Connect this to your bigger life goals. Why now? Why this?'}
                {step === 'timebound' && 'A deadline creates urgency. Be specific: "by March 15th" not "soon."'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Summary View */
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-sage-100">
              <Sparkles className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Your SMART Goal</h2>
            <p className="text-stone-500 font-serif italic">Review the structure</p>
          </div>

          <div className="space-y-4">
            {(Object.keys(SMART_LABELS) as Array<keyof typeof SMART_LABELS>).map((key) => (
              <div key={key} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-sage-50 text-sage-700 flex items-center justify-center font-serif font-bold text-sm">
                    {SMART_LABELS[key].letter}
                  </div>
                  <span className="font-bold text-xs uppercase tracking-widest text-stone-400">{SMART_LABELS[key].word}</span>
                </div>
                <p className="text-sage-900 leading-relaxed pl-11">{answers[key]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
