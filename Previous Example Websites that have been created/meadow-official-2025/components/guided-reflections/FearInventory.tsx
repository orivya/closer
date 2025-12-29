import React, { useState } from 'react';
import { X, Shield, Check, Loader2, ArrowRight, AlertCircle, Eye, Heart, Sparkles } from 'lucide-react';

interface FearInventoryProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

type Step = 'surface' | 'catastrophe' | 'reality' | 'compassion' | 'action' | 'summary';

const FearInventory: React.FC<FearInventoryProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('surface');
  const [fear, setFear] = useState('');
  const [worstCase, setWorstCase] = useState('');
  const [realityCheck, setRealityCheck] = useState('');
  const [likelihood, setLikelihood] = useState(50);
  const [compassion, setCompassion] = useState('');
  const [action, setAction] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['surface', 'catastrophe', 'reality', 'compassion', 'action', 'summary'];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (step) {
      case 'surface': return fear.trim().length > 0;
      case 'catastrophe': return worstCase.trim().length > 0;
      case 'reality': return realityCheck.trim().length > 0;
      case 'compassion': return compassion.trim().length > 0;
      case 'action': return action.trim().length > 0;
      default: return true;
    }
  };

  const nextStep = () => {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) {
      setStep(steps[idx + 1]);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });

      const likelihoodLabel = likelihood < 30 ? 'Unlikely' : likelihood > 70 ? 'Possible' : 'Uncertain';

      let content = `The fear I'm examining: ${fear}\n\n`;
      content += `Worst case scenario: ${worstCase}\n\n`;
      content += `Reality check: ${realityCheck} Likelihood: ${likelihoodLabel.toLowerCase()} (${likelihood}%).\n\n`;
      content += `Self-compassion note: ${compassion}\n\n`;
      content += `One courageous action I can take: ${action}`;

      await onComplete(`Fear Inventory`, content.trim());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getLikelihoodLabel = () => {
    if (likelihood < 30) return { text: 'Unlikely', color: 'text-sage-600' };
    if (likelihood > 70) return { text: 'Possible', color: 'text-stone-600' };
    return { text: 'Uncertain', color: 'text-sage-400' };
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col animate-fade-in overflow-hidden">
      {/* Safe container gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50/50 to-white/20 pointer-events-none" />

      {/* Progress bar */}
      <div className="relative w-full h-1 bg-stone-100">
        <div
          className="h-full bg-sage-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="relative px-6 py-5 flex justify-between items-center border-b border-sage-100 bg-white/50 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <X size={24} className="text-sage-600" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-600 flex items-center justify-center">
            <Shield size={20} strokeWidth={1.5} />
          </div>
          <span className="text-xs font-bold text-sage-400 uppercase tracking-widest">
            Fear Inventory
          </span>
        </div>

        <div className="flex gap-2">
          {steps.slice(0, -1).map((s, i) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all ${i <= currentStepIndex ? 'bg-sage-600 shadow-sm' : 'bg-stone-200'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex-1 overflow-y-auto pb-28 lg:pb-10 bg-gradient-to-br from-[#faf9f7] to-[#f0efe9]">
        {/* Safe space reminder */}
        <div className="max-w-lg mx-auto px-6 pt-4">
          <div className="flex items-center gap-2 text-sage-400 text-sm italic font-serif">
            <Shield size={14} />
            <span>This is a safe space to explore</span>
          </div>
        </div>

        {/* Step 1: Surface the Fear */}
        {step === 'surface' && (
          <div className="max-w-lg mx-auto w-full px-6 py-8 animate-fade-up">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-sm">
                <AlertCircle size={32} className="text-stone-400" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-sage-900 mb-3">
                Name the Fear
              </h2>
              <p className="text-stone-500 font-serif italic">
                What fear is taking up space right now?
              </p>
            </div>

            <textarea
              autoFocus
              value={fear}
              onChange={(e) => setFear(e.target.value)}
              placeholder="I'm afraid that..."
              className="w-full p-6 bg-white rounded-2xl text-sage-900 text-xl placeholder:text-stone-300 border border-stone-100 focus:outline-none focus:ring-2 focus:ring-sage-100 resize-none h-40 mb-8 transition-all shadow-sm"
            />

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="w-full py-4 bg-sage-900 text-white rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Catastrophize */}
        {step === 'catastrophe' && (
          <div className="max-w-lg mx-auto w-full px-6 py-8 animate-fade-up">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-sm">
                <AlertCircle size={32} className="text-stone-600" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-sage-900 mb-3">
                The Worst Case
              </h2>
              <p className="text-stone-500 font-serif italic mb-2">
                If this fear came true, what's different?
              </p>
              <p className="text-stone-400 text-xs uppercase tracking-wide">
                (Let your mind go there—it's safe)
              </p>
            </div>

            <textarea
              autoFocus
              value={worstCase}
              onChange={(e) => setWorstCase(e.target.value)}
              placeholder="The absolute worst would be..."
              className="w-full p-6 bg-white rounded-2xl text-sage-900 text-xl placeholder:text-stone-300 border border-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-200 resize-none h-40 mb-8 transition-all shadow-sm"
            />

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="w-full py-4 bg-sage-900 text-white rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 3: Reality Check */}
        {step === 'reality' && (
          <div className="max-w-lg mx-auto w-full px-6 py-8 animate-fade-up">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-sm">
                <Eye size={32} className="text-sage-600" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-sage-900 mb-3">
                Reality Check
              </h2>
              <p className="text-stone-500 font-serif italic">
                Looking at this objectively—what's the evidence?
              </p>
            </div>

            <textarea
              autoFocus
              value={realityCheck}
              onChange={(e) => setRealityCheck(e.target.value)}
              placeholder="When I look at the facts..."
              className="w-full p-6 bg-white rounded-2xl text-sage-900 text-xl placeholder:text-stone-300 border border-stone-100 focus:outline-none focus:ring-2 focus:ring-sage-100 resize-none h-40 mb-8 transition-all shadow-sm"
            />

            {/* Likelihood slider */}
            <div className="bg-white rounded-2xl p-6 mb-8 border border-stone-100 shadow-sm">
              <p className="text-sm text-stone-500 mb-4 text-center font-medium">
                How likely is the worst case, really?
              </p>
              <div className="flex justify-between text-xs text-stone-400 mb-3 uppercase tracking-wider font-bold">
                <span>Unlikely</span>
                <span>Certain</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={likelihood}
                onChange={(e) => setLikelihood(Number(e.target.value))}
                className="w-full h-2 bg-stone-100 rounded-full appearance-none cursor-pointer accent-sage-600"
              />
              <div className="text-center mt-4">
                <span className={`text-lg font-serif ${getLikelihoodLabel().color}`}>
                  {getLikelihoodLabel().text} ({likelihood}%)
                </span>
              </div>
            </div>

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="w-full py-4 bg-sage-900 text-white rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 4: Compassion */}
        {step === 'compassion' && (
          <div className="max-w-lg mx-auto w-full px-6 py-8 animate-fade-up">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-sm">
                <Heart size={32} className="text-sage-500" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-sage-900 mb-3">
                Self-Compassion
              </h2>
              <p className="text-stone-500 font-serif italic">
                What would you say to a friend who had this fear?
              </p>
            </div>

            <textarea
              autoFocus
              value={compassion}
              onChange={(e) => setCompassion(e.target.value)}
              placeholder="I would tell them..."
              className="w-full p-6 bg-white rounded-2xl text-sage-900 text-xl placeholder:text-stone-300 border border-stone-100 focus:outline-none focus:ring-2 focus:ring-sage-100 resize-none h-40 mb-8 transition-all shadow-sm"
            />

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="w-full py-4 bg-sage-900 text-white rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 5: Courageous Action */}
        {step === 'action' && (
          <div className="max-w-lg mx-auto w-full px-6 py-8 animate-fade-up">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-sm">
                <Sparkles size={32} className="text-stone-400" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-sage-900 mb-3">
                One Brave Step
              </h2>
              <p className="text-stone-500 font-serif italic">
                What's one small, courageous action you could take?
              </p>
            </div>

            <textarea
              autoFocus
              value={action}
              onChange={(e) => setAction(e.target.value)}
              placeholder="One brave thing I can do is..."
              className="w-full p-6 bg-white rounded-2xl text-sage-900 text-xl placeholder:text-stone-300 border border-stone-100 focus:outline-none focus:ring-2 focus:ring-sage-100 resize-none h-40 mb-8 transition-all shadow-sm"
            />

            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="w-full py-4 bg-sage-900 text-white rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              See Summary <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 6: Summary */}
        {step === 'summary' && (
          <div className="max-w-lg mx-auto w-full px-6 py-8 animate-fade-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-scale-in border border-sage-100">
                <Shield size={32} className="text-sage-600" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-sage-900 mb-3">
                Fear Examined
              </h2>
              <p className="text-stone-500 font-serif italic">
                You faced it. You're still here.
              </p>
            </div>

            {/* Summary cards */}
            <div className="space-y-4 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">The Fear</p>
                <p className="text-sage-900 font-serif text-lg">{fear}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Worst Case</p>
                <p className="text-stone-600 text-sm mb-3">{worstCase}</p>
                <div className="flex items-center gap-2 bg-stone-50 p-2 rounded-lg inline-block">
                  <span className="text-xs text-stone-500 font-bold uppercase">Likelihood:</span>
                  <span className={`text-sm font-serif ${getLikelihoodLabel().color}`}>
                    {getLikelihoodLabel().text} ({likelihood}%)
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-all">
                <p className="text-xs font-bold text-sage-400 uppercase tracking-widest mb-2">Reality Check</p>
                <p className="text-sage-900">{realityCheck}</p>
              </div>

              <div className="bg-sage-50/50 rounded-2xl p-6 border border-sage-100">
                <p className="text-xs font-bold text-sage-400 uppercase tracking-widest mb-2">Compassion for Myself</p>
                <p className="text-sage-900 font-serif italic text-lg">"{compassion}"</p>
              </div>

              <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Brave Next Step</p>
                <p className="text-sage-900 font-bold">{action}</p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-4 bg-sage-900 text-white rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Save Reflection
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Custom slider styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: white;
          border: 2px solid #84a98c;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default FearInventory;
