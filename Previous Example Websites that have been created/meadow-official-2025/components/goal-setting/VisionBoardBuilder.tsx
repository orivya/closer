import React, { useState, useMemo } from 'react';
import { Grid3X3, ArrowRight, Sparkles, Heart, Zap, Image, Check } from 'lucide-react';
import WizardLayout from '../guided-reflections/WizardLayout';

interface VisionBoardBuilderProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void;
}

type StepType = 'areas' | 'vision-loop' | 'feeling-loop' | 'actions' | 'summary';

interface LifeArea {
  id: string;
  name: string;
  vision: string;
  feeling: string;
}

const LIFE_AREA_OPTIONS = [
  { name: 'Career' },
  { name: 'Health' },
  { name: 'Relationships' },
  { name: 'Finance' },
  { name: 'Personal Growth' },
  { name: 'Adventure' },
  { name: 'Creativity' },
  { name: 'Spirituality' },
  { name: 'Home' },
];

export default function VisionBoardBuilder({ onBack, onComplete }: VisionBoardBuilderProps) {
  // We use a linear index for the wizard, but map it to logical steps
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAreas, setSelectedAreas] = useState<LifeArea[]>([]);
  const [actions, setActions] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic steps generation
  const steps = useMemo(() => {
    const base: { type: StepType; label: string; areaIndex?: number }[] = [
      { type: 'areas', label: 'Focus Areas' }
    ];

    if (selectedAreas.length > 0) {
      selectedAreas.forEach((_, i) => {
        base.push({ type: 'vision-loop', label: `Vision: ${selectedAreas[i].name}`, areaIndex: i });
      });
      selectedAreas.forEach((_, i) => {
        base.push({ type: 'feeling-loop', label: `Feeling: ${selectedAreas[i].name}`, areaIndex: i });
      });
      base.push({ type: 'actions', label: 'First Actions' });
      base.push({ type: 'summary', label: 'Your Board' });
    }

    return base;
  }, [selectedAreas]);

  const currentStep = steps[currentStepIndex] || steps[0];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      onBack();
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const title = `Vision Board: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    const content = `## My Vision Board\n\n${selectedAreas.map(area => `### ${area.name}\n**Vision:** ${area.vision}\n**How I want to feel:** ${area.feeling}\n`).join('\n')}\n\n---\n\n### First Actions\n${actions}\n\n---\n*Created with Vision Board Builder*`;

    await onComplete(title, content);
    setIsSaving(false);
  };

  const toggleArea = (areaOption: typeof LIFE_AREA_OPTIONS[0]) => {
    const exists = selectedAreas.find(a => a.name === areaOption.name);
    if (exists) {
      setSelectedAreas(selectedAreas.filter(a => a.name !== areaOption.name));
    } else if (selectedAreas.length < 6) {
      setSelectedAreas([...selectedAreas, {
        id: Date.now().toString() + Math.random(),
        name: areaOption.name,
        vision: '',
        feeling: '',
      }]);
    }
  };

  const updateArea = (index: number, field: 'vision' | 'feeling', value: string) => {
    const updated = [...selectedAreas];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedAreas(updated);
  };

  const canProceed = () => {
    if (currentStep.type === 'areas') return selectedAreas.length >= 2;
    if (currentStep.type === 'vision-loop' && typeof currentStep.areaIndex === 'number') {
      return selectedAreas[currentStep.areaIndex].vision.trim().length > 0;
    }
    if (currentStep.type === 'feeling-loop' && typeof currentStep.areaIndex === 'number') {
      return selectedAreas[currentStep.areaIndex].feeling.trim().length > 0;
    }
    if (currentStep.type === 'actions') return actions.trim().length > 0;
    if (currentStep.type === 'summary') return true;
    return false;
  };

  return (
    <WizardLayout
      title="Vision Board"
      icon={Grid3X3}
      step={currentStepIndex}
      totalSteps={steps.length}
      onBack={handleBack} // Custom back handler for linear navigation
      onNext={currentStep.type !== 'summary' ? handleNext : undefined}
      onComplete={currentStep.type === 'summary' ? handleComplete : undefined}
      canProceed={canProceed()}
      isSaving={isSaving}
      nextLabel={currentStep.type === 'summary' ? 'Save Board' : 'Continue'}
      color="sage"
    >
      {currentStep.type === 'areas' && (
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Choose Focus Areas</h2>
            <p className="text-stone-500 font-serif italic mb-6"> Select 2-6 areas to envision.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LIFE_AREA_OPTIONS.map((area, index) => {
              const isSelected = selectedAreas.some(a => a.name === area.name);
              return (
                <button
                  key={area.name}
                  onClick={() => toggleArea(area)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center gap-2 group ${isSelected
                    ? 'bg-sage-50 border-sage-200 text-sage-800 ring-1 ring-sage-100'
                    : 'bg-white border-stone-100 text-stone-400 hover:border-sage-100 hover:text-sage-600'
                    }`}
                >
                  {isSelected && <Check size={16} />}
                  <span className="font-medium text-sm">{area.name}</span>
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-sm text-stone-400 font-medium">{selectedAreas.length} / 6 selected</p>
        </div>
      )}

      {currentStep.type === 'vision-loop' && typeof currentStep.areaIndex === 'number' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm animate-fade-in">
              <Image className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block animate-fade-in">Defining Vision For</span>
            <h2 className="font-serif text-3xl text-sage-900 mb-2 animate-fade-in">{selectedAreas[currentStep.areaIndex].name}</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto animate-fade-in">
              Describe your ideal reality in 1-3 years. Be vivid.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-4 animate-scale-in">
            <textarea
              value={selectedAreas[currentStep.areaIndex].vision}
              onChange={(e) => updateArea(currentStep.areaIndex!, 'vision', e.target.value)}
              placeholder={`In my ${selectedAreas[currentStep.areaIndex].name.toLowerCase()} life, I am...`}
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {currentStep.type === 'feeling-loop' && typeof currentStep.areaIndex === 'number' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm animate-fade-in">
              <Heart className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2 block animate-fade-in">Emotional connection to</span>
            <h2 className="font-serif text-3xl text-sage-900 mb-2 animate-fade-in">{selectedAreas[currentStep.areaIndex].name}</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto animate-fade-in">
              How does living this vision make you feel?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6 animate-scale-in">
            <textarea
              value={selectedAreas[currentStep.areaIndex].feeling}
              onChange={(e) => updateArea(currentStep.areaIndex!, 'feeling', e.target.value)}
              placeholder="I feel joyful, peaceful, energized..."
              className="w-full h-40 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>

          <div className="max-w-xl mx-auto bg-stone-50 rounded-2xl p-4 border border-stone-100 text-left animate-fade-in">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Your Vision</p>
            <p className="text-stone-600 text-sm italic line-clamp-2">"{selectedAreas[currentStep.areaIndex].vision}"</p>
          </div>
        </div>
      )}

      {currentStep.type === 'actions' && (
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm">
              <Zap className="text-sage-600" size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl text-sage-900 mb-2">Bridge to Reality</h2>
            <p className="text-stone-500 font-serif italic max-w-lg mx-auto">
              What 3 small actions can you take this week?
            </p>
          </div>

          <div className="bg-white rounded-3xl p-1 shadow-sm border border-stone-100 max-w-xl mx-auto mb-6">
            <textarea
              value={actions}
              onChange={(e) => setActions(e.target.value)}
              placeholder="1. &#10;2. &#10;3. "
              className="w-full h-48 bg-transparent rounded-2xl p-6 text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none text-lg leading-relaxed"
              autoFocus
            />
          </div>
        </div>
      )}

      {currentStep.type === 'summary' && (
        <div className="space-y-6 animate-scale-in max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mx-auto mb-4 border border-stone-100">
              <Sparkles className="w-8 h-8 text-sage-600" strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl text-sage-900 mb-2">Your Vision Board</h2>
            <p className="text-stone-500 font-serif italic">Your future, designed by you.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {selectedAreas.map((area) => (
              <div key={area.id} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 hover:border-sage-200 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif text-lg text-sage-900">{area.name}</span>
                  <Heart size={14} className="text-sage-300" />
                </div>
                <p className="text-sm text-stone-600 leading-relaxed mb-3">{area.vision}</p>
                <div className="bg-sage-50 rounded-lg p-2 text-xs text-sage-700 font-medium">
                  ✨ {area.feeling}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <span className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-4 block">This Week's Actions</span>
            <p className="text-sage-900 whitespace-pre-line leading-relaxed">{actions}</p>
          </div>
        </div>
      )}
    </WizardLayout>
  );
}
