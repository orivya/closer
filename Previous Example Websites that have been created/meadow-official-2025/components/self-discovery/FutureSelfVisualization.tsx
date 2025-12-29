import React, { useState } from 'react';
import { Eye, Sparkles, Clock, MapPin, Sun, Heart, Award, Mail } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface FutureSelfVisualizationProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'timeframe' | 'environment' | 'daily-life' | 'relationships' | 'achievements' | 'message' | 'summary';

const TIMEFRAMES = [
  { value: '1', label: '1 Year', description: 'Near future' },
  { value: '3', label: '3 Years', description: 'Medium term' },
  { value: '5', label: '5 Years', description: 'Significant change' },
  { value: '10', label: '10 Years', description: 'Transformational' },
];

export default function FutureSelfVisualization({ onBack, onComplete }: FutureSelfVisualizationProps) {
  const [step, setStep] = useState<Step>('timeframe');
  const [data, setData] = useState({
    timeframe: '',
    environment: '',
    dailyLife: '',
    relationships: '',
    achievements: '',
    message: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['timeframe', 'environment', 'daily-life', 'relationships', 'achievements', 'message', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const title = `Future Self: ${data.timeframe} Years from Now`;
    const content = `## My Future Self Visualization\n*${data.timeframe} years from now*\n\n### My Environment\n${data.environment}\n\n### A Day in My Life\n${data.dailyLife}\n\n### My Relationships\n${data.relationships}\n\n### What I've Achieved\n${data.achievements}\n\n---\n\n### Message to Present Me\n${data.message}\n\n---\n*Visualized through Future Self Exploration*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const canProceed = () => {
    switch (step) {
      case 'timeframe': return data.timeframe !== '';
      case 'environment': return data.environment.trim().length > 0;
      case 'daily-life': return data.dailyLife.trim().length > 0;
      case 'relationships': return data.relationships.trim().length > 0;
      case 'achievements': return data.achievements.trim().length > 0;
      case 'message': return data.message.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  return (
    <WizardLayout
      title="Future Self"
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
      {step === 'timeframe' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Clock className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Time Travel</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              How far into the future are we traveling today?
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {TIMEFRAMES.map((tf, index) => (
              <button
                key={tf.value}
                onClick={() => setData({ ...data, timeframe: tf.value })}
                className={`p-6 rounded-2xl text-left transition-all duration-300 border flex flex-col gap-1 ${data.timeframe === tf.value
                  ? 'bg-sage-50 border-sage-200 shadow-sm ring-1 ring-sage-100'
                  : 'bg-white border-stone-100 text-stone-500 hover:border-sage-100 hover:text-sage-600'
                  }`}
              >
                <span className={`text-2xl font-serif font-bold ${data.timeframe === tf.value ? 'text-sage-700' : 'text-sage-900'}`}>{tf.label}</span>
                <span className={`text-sm ${data.timeframe === tf.value ? 'text-sage-600/80' : 'text-stone-400'}`}>{tf.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'environment' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <MapPin className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Your Environment</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Where does your future self wake up? Describe the space.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.environment}
              onChange={(e) => setData({ ...data, environment: e.target.value })}
              placeholder="I am living in... My home is filled with..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'daily-life' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Sun className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">A Day in the Life</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What does a typical Tuesday look like for you?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.dailyLife}
              onChange={(e) => setData({ ...data, dailyLife: e.target.value })}
              placeholder="I wake up feeling... My work involves..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'relationships' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Heart className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Deep Connections</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Who is around you? How do your relationships feel?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.relationships}
              onChange={(e) => setData({ ...data, relationships: e.target.value })}
              placeholder="I am surrounded by... My relationships are..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'achievements' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Award className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Achievements</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Looking back, what are you most proud of accomplishing?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.achievements}
              onChange={(e) => setData({ ...data, achievements: e.target.value })}
              placeholder="I have finally... I'm proud that I..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'message' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Mail className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Message to You</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What wisdom does your future self want to share with you today?
            </p>
          </div>

          <div className="bg-sage-50 rounded-3xl p-1 border border-sage-100 max-w-xl mx-auto mb-6">
            <textarea
              value={data.message}
              onChange={(e) => setData({ ...data, message: e.target.value })}
              placeholder="Dear present me, trust that..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-sage-300 focus:outline-none resize-none text-lg leading-relaxed font-serif italic"
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
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Vision Caught</h2>
            <p className="text-stone-500 font-serif italic">{data.timeframe} years into the future</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'Environment', value: data.environment, icon: MapPin },
              { label: 'Daily Life', value: data.dailyLife, icon: Sun },
              { label: 'Relationships', value: data.relationships, icon: Heart },
              { label: 'Achievements', value: data.achievements, icon: Award },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
                <div className="flex items-center gap-2 mb-2">
                  {React.createElement(item.icon, { size: 14, className: "text-sage-400" })}
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-400">{item.label}</span>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed line-clamp-4">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-sage-50 rounded-2xl p-8 border border-sage-100 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Mail size={100} /></div>
            <span className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-4 block">Message from Future You</span>
            <p className="text-sage-900 font-serif text-xl italic leading-relaxed">"{data.message}"</p>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
