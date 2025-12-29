import React, { useState } from 'react';
import { X, Moon, Sunset, Check, Loader2, ArrowRight, Sparkles } from 'lucide-react';

interface EveningResetProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

type Step = 'highlights' | 'letting-go' | 'tomorrow' | 'complete';

const EveningReset: React.FC<EveningResetProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<Step>('highlights');
  const [highlights, setHighlights] = useState<string[]>(['', '', '']);
  const [lettingGo, setLettingGo] = useState('');
  const [tomorrowIntention, setTomorrowIntention] = useState('');
  const [releasedItems, setReleasedItems] = useState<string[]>([]);
  const [showRelease, setShowRelease] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Add a highlight
  const updateHighlight = (index: number, value: string) => {
    setHighlights(prev => {
      const newHighlights = [...prev];
      newHighlights[index] = value;
      return newHighlights;
    });
  };

  // Handle release animation
  const handleRelease = () => {
    if (!lettingGo.trim()) {
      setStep('tomorrow');
      return;
    }

    setShowRelease(true);
    setReleasedItems(prev => [...prev, lettingGo]);

    setTimeout(() => {
      setShowRelease(false);
      setLettingGo('');
    }, 1500);
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

      // Highlights
      const validHighlights = highlights.filter(h => h.trim());
      if (validHighlights.length > 0) {
        content += `Today's highlights: ${validHighlights.join('. ')}.\n\n`;
      }

      // Released items
      if (releasedItems.length > 0) {
        content += `Things I'm letting go of tonight: ${releasedItems.join(', ').toLowerCase()}.\n\n`;
      }

      // Tomorrow's intention
      if (tomorrowIntention.trim()) {
        content += `Tomorrow, my intention is: ${tomorrowIntention}.`;
      }

      await onComplete(`Evening Reset`, content.trim());
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Step indicator
  const getStepNumber = () => {
    switch (step) {
      case 'highlights': return 1;
      case 'letting-go': return 2;
      case 'tomorrow': return 3;
      case 'complete': return 3;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col animate-fade-in overflow-hidden">
      {/* Sunset gradient overlay - subtle for evening feel on paper */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-200/20 to-sage-900/5 pointer-events-none" />

      {/* Header */}
      <div className="relative px-6 py-5 flex justify-between items-center border-b border-sage-100 bg-white/50 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="p-2 hover:bg-black/5 rounded-full transition-colors text-sage-900/60"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-600 flex items-center justify-center">
            <Moon size={20} strokeWidth={1.5} />
          </div>
          <span className="text-xs font-bold text-sage-500 uppercase tracking-widest">
            Evening Reset
          </span>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${i <= getStepNumber() ? 'bg-sage-400 shadow-sm' : 'bg-stone-200'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Main content - Stationery Sheet Container */}
      <div className="relative flex-1 overflow-y-auto pb-28 lg:pb-10 bg-gradient-to-br from-[#faf9f7] to-[#f0efe9]">
        {/* STEP 1: Highlights */}
        {step === 'highlights' && (
          <div className="max-w-xl mx-auto w-full px-8 py-12 min-h-[600px] shadow-[0_0_50px_-20px_rgba(0,0,0,0.05)] bg-white/60 my-4 rounded-sm border border-white/60 animate-fade-up">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sunset size={32} className="text-sage-600" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-sage-900 mb-3">
                Today's Highlights
              </h2>
              <p className="text-sage-700/60 font-serif italic">
                What were the best parts of your day?
              </p>
            </div>

            {/* Highlight inputs */}
            <div className="space-y-6 mb-12">
              {highlights.map((highlight, index) => (
                <div key={index} className="relative animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-lg font-serif italic text-sage-300">
                    {index + 1}.
                  </div>
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    placeholder={index === 0 ? "Something that went well..." : "Another highlight..."}
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-b border-sage-100 text-lg font-serif text-sage-900 placeholder:text-stone-300 focus:outline-none focus:border-sage-400 transition-all"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('letting-go')}
              className="w-full py-4 bg-sage-900 text-white rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: Letting Go */}
        {step === 'letting-go' && (
          <div className="max-w-xl mx-auto w-full px-8 py-12 min-h-[600px] shadow-[0_0_50px_-20px_rgba(0,0,0,0.05)] bg-white/60 my-4 rounded-sm border border-white/60 animate-fade-up">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles size={32} className="text-stone-400" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-sage-900 mb-3">
                Let It Go
              </h2>
              <p className="text-sage-700/60 font-serif italic">
                What do you want to release before sleep?
              </p>
            </div>

            {/* Released items */}
            {releasedItems.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2 justify-center">
                {releasedItems.map((item, i) => (
                  <div
                    key={i}
                    className="px-4 py-1.5 bg-stone-100 rounded-full text-stone-400/70 line-through text-sm font-serif italic decoration-stone-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}

            {/* Release input */}
            <div className="relative mb-8">
              <textarea
                value={lettingGo}
                onChange={(e) => setLettingGo(e.target.value)}
                placeholder="A worry, frustration, or thought to release..."
                className="w-full p-6 bg-stone-50/50 rounded-xl text-sage-900 font-serif text-xl placeholder:text-stone-300 focus:outline-none focus:bg-stone-50 resize-none h-40 transition-all leading-relaxed"
              />

              {/* Release animation overlay */}
              {showRelease && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-xl backdrop-blur-sm z-10">
                  <div className="text-center animate-float-up">
                    <p className="text-stone-500 font-serif italic text-xl mb-2">{lettingGo}</p>
                    <span className="text-xs font-bold text-stone-300 uppercase tracking-widest">Releasing...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRelease}
                disabled={showRelease}
                className="flex-1 py-4 bg-white border border-stone-200 text-stone-600 rounded-full font-medium hover:bg-stone-50 transition-all disabled:opacity-50"
              >
                Release
              </button>
              <button
                onClick={() => setStep('tomorrow')}
                className="flex-[2] py-4 bg-sage-900 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Tomorrow */}
        {step === 'tomorrow' && (
          <div className="max-w-xl mx-auto w-full px-8 py-12 min-h-[600px] shadow-[0_0_50px_-20px_rgba(0,0,0,0.05)] bg-white/60 my-4 rounded-sm border border-white/60 animate-fade-up">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Moon size={32} className="text-sage-600" strokeWidth={1.5} />
              </div>
              <h2 className="font-serif text-3xl text-sage-900 mb-3">
                Tomorrow's Intention
              </h2>
              <p className="text-sage-700/60 font-serif italic">
                Set one intention for tomorrow
              </p>
            </div>

            <textarea
              autoFocus
              value={tomorrowIntention}
              onChange={(e) => setTomorrowIntention(e.target.value)}
              placeholder="Tomorrow, I will..."
              className="w-full p-0 bg-transparent border-none text-center text-3xl font-serif text-sage-900 placeholder:text-stone-300 focus:outline-none resize-none h-40 mb-12 transition-all leading-relaxed"
            />

            {/* Summary preview */}
            <div className="bg-white/60 rounded-xl p-6 mb-10 border border-sage-50 shadow-sm">
              <h4 className="text-xs font-bold text-sage-400 uppercase tracking-widest mb-4">
                Your Evening Reset
              </h4>

              {highlights.some(h => h.trim()) && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-sage-300 uppercase tracking-wide mb-2">Highlights</p>
                  <ul className="space-y-1">
                    {highlights.filter(h => h.trim()).map((h, i) => (
                      <li key={i} className="text-sage-900 font-serif text-sm">
                        • {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {releasedItems.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-stone-300 uppercase tracking-wide mb-2">Released</p>
                  <p className="text-sm text-stone-400 italic">{releasedItems.length} items let go</p>
                </div>
              )}
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
                  Complete Reset
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-50px) scale(0.8);
          }
        }
        .animate-float-up {
          animation: float-up 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EveningReset;
