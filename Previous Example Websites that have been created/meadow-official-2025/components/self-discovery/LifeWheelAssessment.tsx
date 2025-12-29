import React, { useState } from 'react';
import { Circle, Sparkles, PieChart, Target, ArrowRight } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import WizardLayout from '../guided-reflections/WizardLayout';

interface LifeWheelAssessmentProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'intro' | 'assessment' | 'reflection' | 'focus' | 'summary';

interface LifeArea {
  id: string;
  name: string;
  emoji: string;
  score: number;
}

const LIFE_AREAS: LifeArea[] = [
  { id: 'career', name: 'Career', emoji: '💼', score: 5 },
  { id: 'finance', name: 'Finance', emoji: '💰', score: 5 },
  { id: 'health', name: 'Health', emoji: '🏃', score: 5 },
  { id: 'relationships', name: 'Love', emoji: '❤️', score: 5 },
  { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦', score: 5 },
  { id: 'personal', name: 'Growth', emoji: '🌱', score: 5 },
  { id: 'fun', name: 'Fun', emoji: '🎉', score: 5 },
  { id: 'environment', name: 'Home', emoji: '🏠', score: 5 },
];

export default function LifeWheelAssessment({ onBack, onComplete }: LifeWheelAssessmentProps) {
  const [step, setStep] = useState<Step>('intro');
  const [areas, setAreas] = useState<LifeArea[]>(LIFE_AREAS);
  const [reflection, setReflection] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [focusPlan, setFocusPlan] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['intro', 'assessment', 'reflection', 'focus', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const avgScore = (areas.reduce((sum, a) => sum + a.score, 0) / areas.length).toFixed(1);
    const lowestArea = [...areas].sort((a, b) => a.score - b.score)[0];
    const highestArea = [...areas].sort((a, b) => b.score - a.score)[0];

    const title = `Life Wheel: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    const content = `## Life Wheel Assessment\n\n### Overall Balance Score: ${avgScore}/10\n\n---\n\n### Area Scores\n${areas.map(a => `- **${a.name}**: ${a.score}/10 ${a.emoji}`).join('\n')}\n\n### Highest Area: ${highestArea.name} (${highestArea.score}/10)\n### Area for Growth: ${lowestArea.name} (${lowestArea.score}/10)\n\n---\n\n### Reflection\n${reflection}\n\n### Focus Area: ${focusArea}\n${focusPlan}\n\n---\n*Assessed with Life Wheel*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const updateScore = (id: string, score: number) => {
    setAreas(areas.map(a => a.id === id ? { ...a, score } : a));
  };

  const canProceed = () => {
    switch (step) {
      case 'intro': return true;
      case 'assessment': return true;
      case 'reflection': return reflection.trim().length > 0;
      case 'focus': return focusArea.trim().length > 0 && focusPlan.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-sage-600 text-white';
    if (score >= 6) return 'bg-sage-500 text-white';
    if (score >= 4) return 'bg-sage-400 text-white';
    return 'bg-stone-300 text-white';
  };

  const chartData = areas.map(a => ({ subject: a.name, A: a.score, fullMark: 10 }));

  return (
    <WizardLayout
      title="Life Wheel"
      icon={PieChart}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'summary' ? 'Save Assessment' : 'Continue'}
      color="sage"
    >
      {step === 'intro' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Circle className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Check Your Balance</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Life runs smoothest when it's round. Let's see how your wheel is turning.
            </p>
          </div>
        </div>
      )}

      {step === 'assessment' && (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-center">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Rate Your Satisfaction</h2>
            <p className="text-stone-500 font-serif italic">
              1 = Struggling, 10 = Thriving
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {areas.map((area) => (
              <div key={area.id} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{area.emoji}</span>
                    <span className="font-medium text-sage-900">{area.name}</span>
                  </div>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getScoreColor(area.score)}`}>
                    {area.score}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={area.score}
                  onChange={(e) => updateScore(area.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-sage-600"
                />
              </div>
            ))}
          </div>

          <div className="h-64 mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#78716c', fontSize: 10 }} />
                <Radar
                  name="My Life"
                  dataKey="A"
                  stroke="#84a98c"
                  strokeWidth={2}
                  fill="#84a98c"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {step === 'reflection' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Sparkles className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Reflection</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Looking at your wheel, what do you notice? What surprises you?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="I notice that my career is strong, but..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'focus' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Target className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">One Priority</h2>
            <p className="text-stone-500 font-serif italic">
              Which area will you focus on improving this month?
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {areas.map((area) => (
              <button
                key={area.id}
                onClick={() => setFocusArea(area.name)}
                className={`p-3 rounded-xl border text-sm transition-all flex flex-col items-center gap-1 ${focusArea === area.name
                  ? 'bg-sage-50 border-sage-200 text-sage-800 ring-1 ring-sage-100 font-bold'
                  : 'bg-white border-stone-100 text-stone-500 hover:border-sage-100 hover:text-sage-600'
                  }`}
              >
                <span>{area.emoji}</span>
                <span>{area.name}</span>
              </button>
            ))}
          </div>

          {focusArea && (
            <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 animate-scale-in">
              <textarea
                value={focusPlan}
                onChange={(e) => setFocusPlan(e.target.value)}
                placeholder={`What is one thing you can do to improve your ${focusArea}?`}
                className="w-full h-32 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
                autoFocus
              />
            </div>
          )}
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-stone-100">
              <PieChart className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Assessment Complete</h2>
            <p className="text-stone-500 font-serif italic">
              Balance Score: <span className="text-sage-600 font-bold">{(areas.reduce((sum, a) => sum + a.score, 0) / areas.length).toFixed(1)}/10</span>
            </p>
          </div>

          <div className="h-64 bg-white rounded-3xl p-4 border border-stone-100 shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#78716c', fontSize: 10 }} />
                <Radar
                  name="My Life"
                  dataKey="A"
                  stroke="#84a98c"
                  strokeWidth={2}
                  fill="#84a98c"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100">
            <div className="flex items-center gap-2 mb-3">
              <Target size={18} className="text-sage-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-sage-700">Focus: {focusArea}</span>
            </div>
            <p className="text-sage-900 text-sm leading-relaxed whitespace-pre-line">{focusPlan}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-stone-100">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block">Reflection</span>
            <p className="text-stone-600 text-sm leading-relaxed">{reflection}</p>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
