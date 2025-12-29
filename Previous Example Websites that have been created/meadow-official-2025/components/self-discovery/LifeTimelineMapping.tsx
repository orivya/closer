import React, { useState } from 'react';
import { GitBranch, Plus, X, Sparkles, TrendingUp, TrendingDown, RefreshCcw, Calendar } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface LifeTimelineMappingProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'intro' | 'highs' | 'lows' | 'turning' | 'patterns' | 'summary';

interface TimelineEvent {
  id: string;
  age: string;
  title: string;
  description: string;
  type: 'high' | 'low' | 'turning';
}

export default function LifeTimelineMapping({ onBack, onComplete }: LifeTimelineMappingProps) {
  const [step, setStep] = useState<Step>('intro');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [currentEvent, setCurrentEvent] = useState({ age: '', title: '', description: '' });
  const [patterns, setPatterns] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['intro', 'highs', 'lows', 'turning', 'patterns', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
      setCurrentEvent({ age: '', title: '', description: '' });
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const highs = events.filter(e => e.type === 'high');
    const lows = events.filter(e => e.type === 'low');
    const turnings = events.filter(e => e.type === 'turning');

    const title = `Life Timeline: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    const content = `## My Life Timeline\n\n### Peak Moments (Highs)\n${highs.length > 0 ? highs.map(e => `**Age ${e.age}: ${e.title}**\n${e.description}`).join('\n\n') : 'None recorded'}\n\n### Challenging Times (Lows)\n${lows.length > 0 ? lows.map(e => `**Age ${e.age}: ${e.title}**\n${e.description}`).join('\n\n') : 'None recorded'}\n\n### Turning Points\n${turnings.length > 0 ? turnings.map(e => `**Age ${e.age}: ${e.title}**\n${e.description}`).join('\n\n') : 'None recorded'}\n\n---\n\n### Patterns I Notice\n${patterns}\n\n---\n*Mapped through Life Timeline*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const addEvent = (type: 'high' | 'low' | 'turning') => {
    if (currentEvent.age && currentEvent.title) {
      setEvents([...events, {
        id: Date.now().toString(),
        ...currentEvent,
        type,
      }]);
      setCurrentEvent({ age: '', title: '', description: '' });
    }
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getEventsOfType = (type: 'high' | 'low' | 'turning') => events.filter(e => e.type === type);

  const canProceed = () => {
    switch (step) {
      case 'intro': return true;
      case 'highs': return getEventsOfType('high').length >= 1;
      case 'lows': return getEventsOfType('low').length >= 1;
      case 'turning': return getEventsOfType('turning').length >= 1;
      case 'patterns': return patterns.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  const stepConfig = {
    highs: {
      title: 'Peak Moments',
      subtitle: 'When were you at your best?',
      icon: TrendingUp,
      color: 'text-sage-600',
    },
    lows: {
      title: 'Valleys',
      subtitle: 'What challenges shaped you?',
      icon: TrendingDown,
      color: 'text-stone-500',
    },
    turning: {
      title: 'Turning Points',
      subtitle: 'Where did the path change?',
      icon: RefreshCcw,
      color: 'text-sage-800',
    },
  };

  const currentConfig = (step === 'highs' || step === 'lows' || step === 'turning') ? stepConfig[step] : null;

  return (
    <WizardLayout
      title="Life Timeline"
      icon={GitBranch}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'intro' ? 'Start Mapping' : step === 'summary' ? 'Save Timeline' : 'Continue'}
      color="sage"
    >
      {step === 'intro' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <GitBranch className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-4">Map Your Journey</h2>
            <p className="text-stone-500 font-serif italic mb-6 leading-relaxed">
              Your life is a story of peaks, valleys, and turning points.
              By mapping them, we can find the hidden patterns of your purpose.
            </p>
          </div>
        </div>
      )}

      {currentConfig && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              {React.createElement(currentConfig.icon, { className: currentConfig.color, size: 32, strokeWidth: 1.5 })}
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">{currentConfig.title}</h2>
            <p className="text-stone-500 font-serif italic">
              {currentConfig.subtitle}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {getEventsOfType(step as 'high' | 'low' | 'turning').map((event) => (
              <div key={event.id} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm flex items-start gap-4 text-left animate-fade-in">
                <div className="bg-stone-100 rounded-lg px-2 py-1 text-xs font-bold text-stone-500 mt-1">Age {event.age}</div>
                <div className="flex-1">
                  <p className="font-medium text-sage-900">{event.title}</p>
                  {event.description && <p className="text-sm text-stone-500">{event.description}</p>}
                </div>
                <button onClick={() => removeEvent(event.id)} className="text-stone-300 hover:text-stone-600"><X size={16} /></button>
              </div>
            ))}
          </div>

          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 text-left">
            <div className="flex gap-3 mb-3">
              <div className="w-20">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1 block">Age</label>
                <input
                  value={currentEvent.age}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, age: e.target.value })}
                  placeholder="25"
                  className="w-full bg-white rounded-xl p-2 text-sage-900 border border-stone-200 focus:border-sage-300 focus:ring-2 focus:ring-sage-50"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1 block">What Happened?</label>
                <input
                  value={currentEvent.title}
                  onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                  placeholder="e.g., Graduated University"
                  className="w-full bg-white rounded-xl p-2 text-sage-900 border border-stone-200 focus:border-sage-300 focus:ring-2 focus:ring-sage-50"
                  onKeyDown={(e) => e.key === 'Enter' && addEvent(step as 'high' | 'low' | 'turning')}
                />
              </div>
            </div>
            <textarea
              value={currentEvent.description}
              onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })}
              placeholder="Brief details..."
              className="w-full h-20 bg-white rounded-xl p-3 text-sage-900 border border-stone-200 focus:border-sage-300 focus:ring-2 focus:ring-sage-50 resize-none text-sm mb-3"
            />
            <button
              onClick={() => addEvent(step as 'high' | 'low' | 'turning')}
              disabled={!currentEvent.age || !currentEvent.title}
              className="w-full py-3 rounded-xl bg-sage-900 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sage-800 transition-all font-medium flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add Event
            </button>
          </div>
        </div>
      )}

      {step === 'patterns' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Sparkles className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Connecting the Dots</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              Looking at your timeline, what themes emerge?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={patterns}
              onChange={(e) => setPatterns(e.target.value)}
              placeholder="I notice that I tend to... My happiest moments involve..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-stone-100">
              <GitBranch className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Timeline Mapped</h2>
            <p className="text-stone-500 font-serif italic">{events.length} moments defined</p>
          </div>

          <div className="relative pl-6 space-y-6">
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-stone-200" />

            {events.sort((a, b) => parseInt(a.age) - parseInt(b.age)).map((event) => (
              <div key={event.id} className="relative">
                <div className={`absolute left-[-17px] top-4 w-3 h-3 rounded-full border-2 bg-white ${event.type === 'high' ? 'border-sage-500' :
                  event.type === 'low' ? 'border-stone-400' : 'border-sage-800'
                  }`} />
                <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm ml-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sage-900 font-medium">{event.title}</span>
                    <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded">Age {event.age}</span>
                  </div>
                  {event.description && <p className="text-sm text-stone-500">{event.description}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-sage-50 rounded-2xl p-6 border border-sage-100">
            <span className="text-xs font-bold uppercase tracking-widest text-sage-700 mb-2 block">Patterns</span>
            <p className="text-sage-900/80 italic">{patterns}</p>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
