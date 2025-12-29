import React, { useState } from 'react';
import { X, Activity, Check, Loader2, ArrowRight, Minus, Plus } from 'lucide-react';

interface BodyScanProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

interface BodyArea {
  id: string;
  name: string;
  x: number;
  y: number;
  sensation?: string;
  intensity?: number;
}

const BODY_AREAS: BodyArea[] = [
  { id: 'head', name: 'Head', x: 50, y: 8 },
  { id: 'neck', name: 'Neck', x: 50, y: 15 },
  { id: 'left-shoulder', name: 'Left Shoulder', x: 30, y: 20 },
  { id: 'right-shoulder', name: 'Right Shoulder', x: 70, y: 20 },
  { id: 'chest', name: 'Chest', x: 50, y: 28 },
  { id: 'left-arm', name: 'Left Arm', x: 22, y: 35 },
  { id: 'right-arm', name: 'Right Arm', x: 78, y: 35 },
  { id: 'stomach', name: 'Stomach', x: 50, y: 40 },
  { id: 'lower-back', name: 'Lower Back', x: 50, y: 50 },
  { id: 'hips', name: 'Hips', x: 50, y: 55 },
  { id: 'left-leg', name: 'Left Leg', x: 38, y: 70 },
  { id: 'right-leg', name: 'Right Leg', x: 62, y: 70 },
  { id: 'left-foot', name: 'Left Foot', x: 38, y: 92 },
  { id: 'right-foot', name: 'Right Foot', x: 62, y: 92 }
];

const SENSATIONS = [
  { id: 'tension', label: 'Tension', color: 'bg-stone-500' },
  { id: 'pain', label: 'Pain', color: 'bg-stone-700' },
  { id: 'warmth', label: 'Warmth', color: 'bg-stone-400' },
  { id: 'cold', label: 'Cold', color: 'bg-sage-200' },
  { id: 'numbness', label: 'Numbness', color: 'bg-stone-300' },
  { id: 'energy', label: 'Energy', color: 'bg-sage-400' },
  { id: 'relaxed', label: 'Relaxed', color: 'bg-sage-500' },
  { id: 'tingling', label: 'Tingling', color: 'bg-sage-300' }
];

const BodyScan: React.FC<BodyScanProps> = ({ onBack, onComplete }) => {
  const [selectedAreas, setSelectedAreas] = useState<Map<string, { sensation: string; intensity: number }>>(new Map());
  const [currentArea, setCurrentArea] = useState<string | null>(null);
  const [step, setStep] = useState<'scan' | 'reflection' | 'complete'>('scan');
  const [reflection, setReflection] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Select/deselect body area
  const toggleArea = (areaId: string) => {
    if (selectedAreas.has(areaId)) {
      setCurrentArea(areaId);
    } else {
      setCurrentArea(areaId);
    }
  };

  // Set sensation for area
  const setSensation = (sensation: string) => {
    if (!currentArea) return;

    const current = selectedAreas.get(currentArea) || { sensation: '', intensity: 5 };
    const newAreas = new Map(selectedAreas);
    newAreas.set(currentArea, { ...current, sensation });
    setSelectedAreas(newAreas);
  };

  // Set intensity for area
  const setIntensity = (intensity: number) => {
    if (!currentArea) return;

    const current = selectedAreas.get(currentArea) || { sensation: 'tension', intensity: 5 };
    const newAreas = new Map(selectedAreas);
    newAreas.set(currentArea, { ...current, intensity });
    setSelectedAreas(newAreas);
  };

  // Remove area
  const removeArea = () => {
    if (!currentArea) return;

    const newAreas = new Map(selectedAreas);
    newAreas.delete(currentArea);
    setSelectedAreas(newAreas);
    setCurrentArea(null);
  };

  // Get color for area
  const getAreaColor = (areaId: string) => {
    const data = selectedAreas.get(areaId);
    if (!data) return '';

    const sensation = SENSATIONS.find(s => s.id === data.sensation);
    return sensation?.color || 'bg-sage-500';
  };

  // Handle save
  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });

      let content = ``;

      if (selectedAreas.size > 0) {
        const areaDescriptions: string[] = [];
        selectedAreas.forEach((data, areaId) => {
          const area = BODY_AREAS.find(a => a.id === areaId);
          const sensation = SENSATIONS.find(s => s.id === data.sensation);
          areaDescriptions.push(`${area?.name?.toLowerCase()} (${sensation?.label?.toLowerCase()}, intensity ${data.intensity}/10)`);
        });
        content += `Body check-in: I noticed sensations in my ${areaDescriptions.join(', ')}.\n\n`;
      }

      if (reflection.trim()) {
        content += `What my body is telling me: ${reflection}`;
      }

      await onComplete(`Body Scan`, content.trim());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const currentAreaData = currentArea ? selectedAreas.get(currentArea) : null;
  const currentAreaInfo = currentArea ? BODY_AREAS.find(a => a.id === currentArea) : null;

  return (
    <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-sage-100">
        <button
          onClick={onBack}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <X size={24} className="text-sage-600" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-600 flex items-center justify-center">
            <Activity size={20} strokeWidth={1.5} />
          </div>
          <span className="text-xs font-bold text-sage-400 uppercase tracking-widest">
            Body Scan
          </span>
        </div>

        {/* Counter */}
        <div className="text-sm text-stone-400">
          {selectedAreas.size} area{selectedAreas.size !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-28 lg:pb-10 bg-gradient-to-br from-[#faf9f7] to-[#f0efe9]">
        {step === 'scan' && (
          <div className="max-w-lg mx-auto w-full px-6 py-6 animate-fade-up">
            <p className="text-center text-stone-400 mb-6">
              Tap areas where you notice sensations
            </p>

            {/* Body silhouette */}
            <div className="relative mx-auto w-[200px] h-[400px] mb-8">
              {/* Simple body outline SVG */}
              <svg viewBox="0 0 100 200" className="w-full h-full">
                {/* Head */}
                <ellipse cx="50" cy="15" rx="12" ry="14" fill="none" stroke="currentColor" strokeWidth="1" className="text-stone-300" />
                {/* Neck */}
                <line x1="50" y1="29" x2="50" y2="35" stroke="currentColor" strokeWidth="1" className="text-stone-300" />
                {/* Torso */}
                <path d="M 35 35 L 35 90 L 40 100 L 60 100 L 65 90 L 65 35 L 50 40 L 35 35" fill="none" stroke="currentColor" strokeWidth="1" className="text-stone-300" />
                {/* Arms */}
                <path d="M 35 38 L 15 75 L 18 78 L 38 45" fill="none" stroke="currentColor" strokeWidth="1" className="text-stone-300" />
                <path d="M 65 38 L 85 75 L 82 78 L 62 45" fill="none" stroke="currentColor" strokeWidth="1" className="text-stone-300" />
                {/* Legs */}
                <path d="M 40 100 L 38 170 L 42 175 L 46 170 L 48 100" fill="none" stroke="currentColor" strokeWidth="1" className="text-stone-300" />
                <path d="M 60 100 L 62 170 L 58 175 L 54 170 L 52 100" fill="none" stroke="currentColor" strokeWidth="1" className="text-stone-300" />
              </svg>

              {/* Clickable body areas */}
              {BODY_AREAS.map(area => {
                const isSelected = selectedAreas.has(area.id);
                const color = getAreaColor(area.id);
                const data = selectedAreas.get(area.id);

                return (
                  <button
                    key={area.id}
                    onClick={() => toggleArea(area.id)}
                    className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${isSelected
                      ? `${color} shadow-sm animate-pulse`
                      : 'bg-white hover:bg-stone-50 border border-stone-200'
                      } ${currentArea === area.id ? 'ring-2 ring-sage-300 ring-offset-2 ring-offset-[#faf9f7]' : ''}`}
                    style={{
                      left: `${area.x}%`,
                      top: `${area.y}%`,
                      opacity: data ? 0.6 + (data.intensity / 10) * 0.4 : 1
                    }}
                  />
                );
              })}
            </div>

            {/* Area detail panel */}
            {currentArea && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 mb-6 animate-fade-up shadow-sm border border-white/60">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl text-sage-900">
                    {currentAreaInfo?.name}
                  </h3>
                  <button
                    onClick={removeArea}
                    className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                {/* Sensation selection */}
                <p className="text-sm text-stone-400 mb-3">What do you feel?</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {SENSATIONS.map(sensation => (
                    <button
                      key={sensation.id}
                      onClick={() => setSensation(sensation.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentAreaData?.sensation === sensation.id
                        ? `${sensation.color} text-white shadow-sm`
                        : 'bg-white border border-stone-100 text-stone-500 hover:bg-stone-50'
                        }`}
                    >
                      {sensation.label}
                    </button>
                  ))}
                </div>

                {/* Intensity slider */}
                {currentAreaData?.sensation && (
                  <>
                    <p className="text-sm text-stone-400 mb-3">Intensity</p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setIntensity(Math.max(1, (currentAreaData?.intensity || 5) - 1))}
                        className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all text-stone-400"
                      >
                        <Minus size={16} />
                      </button>

                      <div className="flex-1">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={currentAreaData?.intensity || 5}
                          onChange={(e) => setIntensity(parseInt(e.target.value))}
                          className="w-full h-2 bg-stone-100 rounded-full appearance-none cursor-pointer accent-sage-500"
                        />
                        <div className="flex justify-between mt-1 text-xs text-stone-400">
                          <span>Subtle</span>
                          <span className="font-medium text-sage-600">{currentAreaData?.intensity || 5}/10</span>
                          <span>Intense</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIntensity(Math.min(10, (currentAreaData?.intensity || 5) + 1))}
                        className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all text-stone-400"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Continue button */}
            <button
              onClick={() => setStep('reflection')}
              className="w-full py-4 bg-sage-600 text-white rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 'reflection' && (
          <div className="max-w-lg mx-auto w-full px-6 py-10 animate-fade-up">
            <h2 className="font-serif text-2xl text-sage-900 text-center mb-2">
              What is your body telling you?
            </h2>
            <p className="text-stone-400 text-center mb-8">
              Reflect on what you've noticed
            </p>

            {/* Summary */}
            {selectedAreas.size > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {Array.from(selectedAreas.entries()).map(([areaId, data]) => {
                  const area = BODY_AREAS.find(a => a.id === areaId);
                  const sensation = SENSATIONS.find(s => s.id === data.sensation);
                  return (
                    <span
                      key={areaId}
                      className={`px-3 py-1 rounded-full text-sm text-white ${sensation?.color}`}
                    >
                      {area?.name}: {sensation?.label}
                    </span>
                  );
                })}
              </div>
            )}

            <textarea
              autoFocus
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What patterns do you notice? What might your body need?"
              className="w-full p-6 bg-white rounded-2xl text-sage-900 text-lg placeholder:text-stone-300 border border-stone-100 focus:outline-none focus:ring-2 focus:ring-sage-100 resize-none h-40 mb-8 shadow-sm"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep('scan')}
                className="flex-1 py-4 bg-white text-stone-500 border border-stone-200 rounded-full font-medium hover:bg-stone-50 transition-all"
              >
                Back to Scan
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-4 bg-sage-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Save Scan
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyScan;
