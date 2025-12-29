import React, { useState } from 'react';
import { Map, Plus, X, Flag, Sparkles, Mountain, Hammer, ArrowRight } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface MilestoneMapperProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type Step = 'destination' | 'milestones' | 'obstacles' | 'resources' | 'summary';

interface Milestone {
  id: string;
  title: string;
  deadline: string;
}

export default function MilestoneMapper({ onBack, onComplete }: MilestoneMapperProps) {
  const [step, setStep] = useState<Step>('destination');
  const [destination, setDestination] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: '1', title: '', deadline: '' },
    { id: '2', title: '', deadline: '' },
    { id: '3', title: '', deadline: '' },
  ]);
  const [obstacles, setObstacles] = useState('');
  const [resources, setResources] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['destination', 'milestones', 'obstacles', 'resources', 'summary'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const validMilestones = milestones.filter(m => m.title.trim());
    const title = `Milestone Map: ${destination.slice(0, 40)}${destination.length > 40 ? '...' : ''}`;
    const content = `## Milestone Map\n\n### Destination\n${destination}\n\n---\n\n### Milestones\n${validMilestones.map((m, i) => `${i + 1}. **${m.title}**${m.deadline ? ` — by ${m.deadline}` : ''}`).join('\n')}\n\n### Potential Obstacles\n${obstacles}\n\n### Resources & Support\n${resources}\n\n---\n*Created with Milestone Mapper*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const updateMilestone = (id: string, field: 'title' | 'deadline', value: string) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addMilestone = () => {
    if (milestones.length < 7) {
      setMilestones([...milestones, { id: Date.now().toString(), title: '', deadline: '' }]);
    }
  };

  const removeMilestone = (id: string) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter(m => m.id !== id));
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'destination': return destination.trim().length > 0;
      case 'milestones': return milestones.some(m => m.title.trim().length > 0);
      case 'obstacles': return obstacles.trim().length > 0;
      case 'resources': return resources.trim().length > 0;
      case 'summary': return true;
      default: return false;
    }
  };

  return (
    <WizardLayout
      title="Milestone Mapper"
      icon={Map}
      step={currentIndex}
      totalSteps={steps.length}
      onBack={onBack}
      onNext={step !== 'summary' ? handleNext : undefined}
      onComplete={step === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={step === 'summary' ? 'Save Map' : 'Continue'}
      color="sage"
    >
      {step === 'destination' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Flag className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Your Destination</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What big goal or achievement are you working toward? Be specific.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Describe your destination..."
              className="w-full h-32 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>

          <div className="max-w-xl mx-auto bg-sage-50 rounded-2xl p-4 border border-sage-100 text-left">
            <p className="text-sm text-sage-900/80">
              <strong className="text-sage-700">Think:</strong> What will be different when you arrive? How will you know you made it?
            </p>
          </div>
        </div>
      )}

      {step === 'milestones' && (
        <div className="text-center max-w-xl mx-auto">
          <div className="mb-8">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Map Your Milestones</h2>
            <p className="text-stone-500 font-serif italic">What checkpoints will you pass?</p>
          </div>

          <div className="relative pl-8 space-y-6 text-left">
            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-stone-200" />

            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative animate-fade-in">
                {/* Connector dot */}
                <div className={`absolute left-[-22px] top-5 w-4 h-4 rounded-full border-2 transition-colors ${milestone.title.trim() ? 'bg-sage-600 border-sage-600 shadow-sm' : 'bg-white border-stone-200'
                  }`} />

                <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm transition-all hover:shadow-md hover:border-sage-100">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Checkpoint {index + 1}</span>
                      </div>
                      <input
                        value={milestone.title}
                        onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                        placeholder={`Milestone ${index + 1}...`}
                        className="w-full bg-stone-50 rounded-xl p-3 text-sage-900 placeholder:text-stone-300 border border-transparent focus:bg-white focus:border-sage-300 focus:ring-4 focus:ring-sage-50 transition-all"
                        autoFocus={index === milestones.length - 1}
                      />
                      <input
                        type="text"
                        value={milestone.deadline}
                        onChange={(e) => updateMilestone(milestone.id, 'deadline', e.target.value)}
                        placeholder="Target date (optional)"
                        className="w-full bg-stone-50 rounded-xl p-2 text-sm text-sage-900 placeholder:text-stone-300 border border-transparent focus:bg-white focus:border-sage-300 focus:ring-0 transition-all font-medium"
                      />
                    </div>
                    {milestones.length > 1 && (
                      <button
                        onClick={() => removeMilestone(milestone.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="relative">
              <div className="absolute left-[-22px] top-1 w-4 h-4">
                <Flag className="w-4 h-4 text-sage-600" />
              </div>
              <div className="bg-sage-50 rounded-2xl p-4 border border-sage-100">
                <span className="text-sage-700 font-bold text-sm block mb-1">DESTINATION</span>
                <span className="text-sage-900 italic">{destination}</span>
              </div>
            </div>
          </div>

          {milestones.length < 7 && (
            <button
              onClick={addMilestone}
              className="w-full mt-6 py-4 rounded-xl border-2 border-dashed border-stone-200 text-stone-400 hover:border-sage-300 hover:text-sage-600 hover:bg-sage-50 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Milestone
            </button>
          )}
        </div>
      )}

      {step === 'obstacles' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Mountain className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Potential Obstacles</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What challenges might block your path?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto">
            <textarea
              value={obstacles}
              onChange={(e) => setObstacles(e.target.value)}
              placeholder="List potential obstacles and strategies..."
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {step === 'resources' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Hammer className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Resources & Support</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What skills, people, or tools will help you succeed?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto">
            <textarea
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              placeholder="List resources you have or need..."
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
              <Map className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Your Milestone Map</h2>
            <p className="text-stone-500 font-serif italic">The path is clear</p>
          </div>

          <div className="relative pl-6 space-y-4">
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-stone-200 to-sage-200" />

            {milestones.filter(m => m.title.trim()).map((milestone, index) => (
              <div key={milestone.id} className="relative flex items-center gap-4">
                <div className="absolute left-[-19px] w-3 h-3 rounded-full bg-white border-2 border-stone-300" />
                <div className="bg-white rounded-xl p-4 flex-1 border border-stone-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sage-900 font-medium">{milestone.title}</span>
                    {milestone.deadline && (
                      <span className="text-xs bg-stone-100 px-2 py-1 rounded text-stone-500">{milestone.deadline}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="relative flex items-center gap-4">
              <div className="absolute left-[-21px]"><Flag className="w-4 h-4 text-sage-600" /></div>
              <div className="bg-sage-50 rounded-xl p-4 flex-1 border border-sage-100">
                <span className="text-sage-700 font-bold block mb-1 text-xs uppercase tracking-widest">Destination</span>
                <span className="text-sage-900 font-serif text-lg">{destination}</span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Obstacles</h3>
              <p className="text-stone-700 text-sm leading-relaxed">{obstacles}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-sage-600 mb-2">Resources</h3>
              <p className="text-stone-700 text-sm leading-relaxed">{resources}</p>
            </div>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
