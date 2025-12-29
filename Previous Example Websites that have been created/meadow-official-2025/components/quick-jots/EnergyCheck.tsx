import React, { useState } from 'react';
import { X, Zap, Battery, BatteryLow, BatteryMedium, BatteryFull, Check, Loader2, Minus, Plus } from 'lucide-react';

interface EnergyCheckProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

interface EnergyFactor {
  id: string;
  label: string;
  type: 'draining' | 'fueling';
}

const DRAINING_SUGGESTIONS = [
  "Poor sleep",
  "Work stress",
  "Difficult conversation",
  "Physical exhaustion",
  "Worry or anxiety",
  "Skipped meals",
  "Too much screen time",
  "Unfinished tasks",
  "Conflict",
  "Overthinking"
];

const FUELING_SUGGESTIONS = [
  "Good sleep",
  "Exercise",
  "Time with loved ones",
  "Completed a task",
  "Nature time",
  "Good meal",
  "Creative activity",
  "Learning something",
  "Helping others",
  "Meditation"
];

const EnergyCheck: React.FC<EnergyCheckProps> = ({ onBack, onComplete }) => {
  const [energyLevel, setEnergyLevel] = useState(50);
  const [step, setStep] = useState<'level' | 'factors' | 'complete'>('level');
  const [drainingFactors, setDrainingFactors] = useState<string[]>([]);
  const [fuelingFactors, setFuelingFactors] = useState<string[]>([]);
  const [customDraining, setCustomDraining] = useState('');
  const [customFueling, setCustomFueling] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Get battery icon based on level
  const getBatteryIcon = () => {
    if (energyLevel <= 25) return BatteryLow;
    if (energyLevel <= 50) return BatteryMedium;
    if (energyLevel <= 75) return Battery;
    return BatteryFull;
  };

  // Get color based on energy level
  const getEnergyColor = () => {
    if (energyLevel <= 25) return { bg: 'bg-stone-400', text: 'text-stone-500', glow: 'shadow-stone-200/50' };
    if (energyLevel <= 50) return { bg: 'bg-sage-400', text: 'text-sage-500', glow: 'shadow-sage-200/50' };
    if (energyLevel <= 75) return { bg: 'bg-sage-600', text: 'text-sage-600', glow: 'shadow-sage-300/50' };
    return { bg: 'bg-sage-800', text: 'text-sage-800', glow: 'shadow-sage-400/50' };
  };

  // Get energy label
  const getEnergyLabel = () => {
    if (energyLevel <= 25) return 'Running on empty';
    if (energyLevel <= 50) return 'Getting low';
    if (energyLevel <= 75) return 'Good energy';
    return 'Fully charged!';
  };

  const BatteryIcon = getBatteryIcon();
  const colors = getEnergyColor();

  // Toggle factor
  const toggleFactor = (factor: string, type: 'draining' | 'fueling') => {
    if (type === 'draining') {
      setDrainingFactors(prev =>
        prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]
      );
    } else {
      setFuelingFactors(prev =>
        prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]
      );
    }
  };

  // Add custom factor
  const addCustomFactor = (type: 'draining' | 'fueling') => {
    const value = type === 'draining' ? customDraining : customFueling;
    if (!value.trim()) return;

    if (type === 'draining') {
      setDrainingFactors(prev => [...prev, value.trim()]);
      setCustomDraining('');
    } else {
      setFuelingFactors(prev => [...prev, value.trim()]);
      setCustomFueling('');
    }
  };

  // Handle save
  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const date = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      let content = `Today I checked in with my energy and I'm sitting at ${energyLevel}%. ${getEnergyLabel()}.\n\n`;

      if (drainingFactors.length > 0) {
        content += `What's been draining my energy: ${drainingFactors.join(', ').toLowerCase()}.\n\n`;
      }

      if (fuelingFactors.length > 0) {
        content += `What's been fueling me: ${fuelingFactors.join(', ').toLowerCase()}.`;
      }

      await onComplete(`Energy Check`, content.trim());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

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
            <Zap size={20} strokeWidth={1.5} />
          </div>
          <span className="text-xs font-bold text-sage-400 uppercase tracking-widest">
            Energy Check
          </span>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2">
          <div className={`w-2 h-2 rounded-full transition-all ${step === 'level' ? 'bg-sage-600' : 'bg-sage-200'}`} />
          <div className={`w-2 h-2 rounded-full transition-all ${step === 'factors' ? 'bg-sage-600' : step === 'complete' ? 'bg-sage-600' : 'bg-sage-100'}`} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-28 lg:pb-10 bg-gradient-to-br from-[#faf9f7] to-[#f0efe9]">
        {step === 'level' && (
          <div className="max-w-md mx-auto w-full px-6 py-10 animate-fade-up">
            <h2 className="font-serif text-3xl text-sage-900 text-center mb-2">
              How's your energy right now?
            </h2>
            <p className="text-stone-400 text-center mb-12">
              Slide to set your current level
            </p>

            {/* Battery visualization */}
            <div className="flex flex-col items-center mb-12">
              <div className={`w-32 h-32 rounded-3xl ${colors.bg}/10 flex items-center justify-center mb-6 shadow-sm ${colors.glow} border border-white/50`}>
                <BatteryIcon size={64} className={colors.text} strokeWidth={1.5} />
              </div>

              <div className={`text-5xl font-serif ${colors.text} mb-2`}>
                {energyLevel}%
              </div>
              <p className="text-stone-500 text-lg">{getEnergyLabel()}</p>
            </div>

            {/* Slider */}
            <div className="mb-12">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setEnergyLevel(Math.max(0, energyLevel - 10))}
                  className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all text-sage-600"
                >
                  <Minus size={20} />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                    className="w-full h-3 bg-stone-100 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #84a98c 0%, #84a98c ${energyLevel}%, rgba(0,0,0,0.05) ${energyLevel}%, rgba(0,0,0,0.05) 100%)`
                    }}
                  />
                </div>

                <button
                  onClick={() => setEnergyLevel(Math.min(100, energyLevel + 10))}
                  className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all text-sage-600"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="flex justify-between mt-2 text-xs text-stone-400 px-12">
                <span>Empty</span>
                <span>Full</span>
              </div>
            </div>

            {/* Continue button */}
            <button
              onClick={() => setStep('factors')}
              className="w-full py-4 bg-sage-600 text-white rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'factors' && (
          <div className="max-w-lg mx-auto w-full px-6 py-8 animate-fade-up">
            {/* Draining section */}
            <div className="mb-10">
              <h3 className="font-serif text-xl text-sage-900 mb-2 flex items-center gap-2">
                <Minus size={18} className="text-stone-400" />
                What's draining your energy?
              </h3>
              <p className="text-stone-400 text-sm mb-4">Select or add your own</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {DRAINING_SUGGESTIONS.map(factor => (
                  <button
                    key={factor}
                    onClick={() => toggleFactor(factor, 'draining')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${drainingFactors.includes(factor)
                        ? 'bg-stone-200 text-stone-700 border border-stone-300'
                        : 'bg-white text-stone-500 hover:bg-stone-50 border border-stone-200/50'
                      }`}
                  >
                    {factor}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customDraining}
                  onChange={(e) => setCustomDraining(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomFactor('draining')}
                  placeholder="Add your own..."
                  className="flex-1 px-4 py-2 bg-white rounded-full text-sm text-sage-900 placeholder:text-stone-300 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-200"
                />
                <button
                  onClick={() => addCustomFactor('draining')}
                  disabled={!customDraining.trim()}
                  className="px-4 py-2 bg-white text-stone-400 rounded-full hover:text-sage-600 border border-stone-200 transition-colors disabled:opacity-50"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Fueling section */}
            <div className="mb-10">
              <h3 className="font-serif text-xl text-sage-900 mb-2 flex items-center gap-2">
                <Plus size={18} className="text-sage-500" />
                What's fueling your energy?
              </h3>
              <p className="text-stone-400 text-sm mb-4">Select or add your own</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {FUELING_SUGGESTIONS.map(factor => (
                  <button
                    key={factor}
                    onClick={() => toggleFactor(factor, 'fueling')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${fuelingFactors.includes(factor)
                        ? 'bg-sage-100 text-sage-700 border border-sage-200'
                        : 'bg-white text-stone-500 hover:bg-stone-50 border border-stone-200/50'
                      }`}
                  >
                    {factor}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFueling}
                  onChange={(e) => setCustomFueling(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomFactor('fueling')}
                  placeholder="Add your own..."
                  className="flex-1 px-4 py-2 bg-white rounded-full text-sm text-sage-900 placeholder:text-stone-300 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-sage-200"
                />
                <button
                  onClick={() => addCustomFactor('fueling')}
                  disabled={!customFueling.trim()}
                  className="px-4 py-2 bg-white text-stone-400 rounded-full hover:text-sage-600 border border-stone-200 transition-colors disabled:opacity-50"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Summary preview */}
            <div className="bg-white/50 border border-white/60 rounded-2xl p-6 mb-8 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl ${colors.bg}/10 flex items-center justify-center`}>
                  <BatteryIcon size={24} className={colors.text} />
                </div>
                <div>
                  <div className={`text-2xl font-serif ${colors.text}`}>{energyLevel}%</div>
                  <p className="text-stone-400 text-sm">{getEnergyLabel()}</p>
                </div>
              </div>

              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-stone-600 font-bold">{drainingFactors.length}</span>
                  <span className="text-stone-400 ml-1">draining</span>
                </div>
                <div>
                  <span className="text-sage-600 font-bold">{fuelingFactors.length}</span>
                  <span className="text-stone-400 ml-1">fueling</span>
                </div>
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-4 bg-sage-900 text-white rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Save Energy Check
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Custom range slider styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border: 2px solid #84a98c;
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          border: 2px solid #84a98c;
        }
      `}</style>
    </div>
  );
};

export default EnergyCheck;
