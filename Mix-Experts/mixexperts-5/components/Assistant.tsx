import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Loader2, Music, Sliders, Disc } from 'lucide-react';

type StepType = 'SERVICE' | 'DETAILS' | 'RESULT';
type ServiceType = 'MIXING' | 'MASTERING' | 'BOTH';

export const Assistant: React.FC = () => {
  const [step, setStep] = useState<StepType>('SERVICE');
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState<{
    service?: ServiceType;
    details?: string;
  }>({});

  const handleServiceSelect = (service: ServiceType) => {
    setLoading(true);
    setSelection({ ...selection, service });
    setTimeout(() => {
      setLoading(false);
      setStep('DETAILS');
    }, 600);
  };

  const handleDetailsSelect = (details: string) => {
    setLoading(true);
    setSelection({ ...selection, details });
    setTimeout(() => {
      setLoading(false);
      setStep('RESULT');
    }, 800);
  };

  const reset = () => {
    setStep('SERVICE');
    setSelection({});
  };

  const getRecommendation = () => {
    if (selection.service === 'MASTERING') {
      if (selection.details === 'Not yet mixed') return {
        package: "Full Mix & Master",
        desc: "Since your song isn't mixed yet, skipping straight to mastering won't get you the results you want. Let's start with a professional mix.",
        price: "$400"
      };
      return {
        package: "Pro Mastering",
        desc: "Perfect. Since your mix is ready with headroom, we can focus on loudness, width, and translation.",
        price: "$75"
      };
    }

    if (selection.details?.includes('2 Track')) {
      return {
        package: "2-Track Mix",
        desc: "Ideal for vocalists recording over a purchased beat. We'll blend your vocals perfectly with the instrumental.",
        price: "$150"
      };
    }

    return {
      package: "Full Custom Mix",
      desc: "For full sessions with individual stems. We'll sculpt every element of the production for maximum impact.",
      price: "$350"
    };
  };

  const recommendation = getRecommendation();

  return (
    <section className="py-32 bg-[var(--bg-elevated)] border-y border-[var(--border-dark)] relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--accent-subtle)] to-transparent opacity-20" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-t from-[var(--accent-subtle)] to-transparent opacity-10 rounded-full blur-3xl" />

      <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-glow)] text-[var(--accent)] text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3 h-3" />
            Project Concierge
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find your perfect <br/>sonic solution.
          </h2>
          <p className="text-[var(--text-gray)] text-lg leading-relaxed max-w-md mb-8">
            Every project is unique. Answer two quick questions to get a tailored recommendation for your specific needs.
          </p>
          
          <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border-dark)] flex items-center justify-center text-[10px] text-white font-bold">
                  AI
                </div>
              ))}
            </div>
            <span>Instant quote estimation</span>
          </div>
        </div>

        {/* Interactive Widget */}
        <div className="bg-[var(--bg-base)] border border-[var(--border-dark)] rounded-3xl p-8 shadow-2xl relative min-h-[420px] flex flex-col justify-center overflow-hidden">
          
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-[var(--accent)] transition-all duration-500" 
               style={{ width: step === 'SERVICE' ? '33%' : step === 'DETAILS' ? '66%' : '100%' }} />

          {step === 'SERVICE' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xl font-bold text-white mb-6">What does your project need right now?</h3>
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => handleServiceSelect('MIXING')}
                  className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-[var(--text-gray)] hover:border-[var(--accent)] hover:text-white hover:bg-[var(--bg-hover)] transition-all text-left font-medium flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Mixing</div>
                    <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-gray)]">Balancing tracks & creative effects</div>
                  </div>
                </button>

                <button 
                  onClick={() => handleServiceSelect('MASTERING')}
                  className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-[var(--text-gray)] hover:border-[var(--accent)] hover:text-white hover:bg-[var(--bg-hover)] transition-all text-left font-medium flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                    <Disc className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Mastering</div>
                    <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-gray)]">Final polish & loudness</div>
                  </div>
                </button>

                <button 
                  onClick={() => handleServiceSelect('BOTH')}
                  className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-[var(--text-gray)] hover:border-[var(--accent)] hover:text-white hover:bg-[var(--bg-hover)] transition-all text-left font-medium flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Both (Full Production)</div>
                    <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-gray)]">Start to finish engineering</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 'DETAILS' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button onClick={() => setStep('SERVICE')} className="text-xs text-[var(--text-muted)] hover:text-white mb-4 uppercase tracking-wider font-bold">
                ← Back
              </button>

              {selection.service === 'MASTERING' ? (
                <>
                  <h3 className="text-xl font-bold text-white mb-6">Is your mix completely finished?</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => handleDetailsSelect('Yes, ready for mastering')}
                      className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-left hover:border-[var(--accent)] hover:bg-[var(--bg-hover)] transition-all group"
                    >
                      <div className="text-white font-bold mb-1">Yes, it's ready</div>
                      <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-gray)]">I have a single stereo file with -6dB headroom</div>
                    </button>
                    <button 
                      onClick={() => handleDetailsSelect('Not yet mixed')}
                      className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-left hover:border-[var(--accent)] hover:bg-[var(--bg-hover)] transition-all group"
                    >
                      <div className="text-white font-bold mb-1">No, it needs mixing</div>
                      <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-gray)]">I still have the individual stems/multitracks</div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-6">How many tracks (stems) are in your session?</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => handleDetailsSelect('2 Track (Beat + Vocals)')}
                      className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-left hover:border-[var(--accent)] hover:bg-[var(--bg-hover)] transition-all group"
                    >
                      <div className="text-white font-bold mb-1">2 Track Session</div>
                      <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-gray)]">Just an instrumental file + vocal tracks</div>
                    </button>
                    <button 
                      onClick={() => handleDetailsSelect('Full Session (Stems)')}
                      className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-dark)] text-left hover:border-[var(--accent)] hover:bg-[var(--bg-hover)] transition-all group"
                    >
                      <div className="text-white font-bold mb-1">Full Session</div>
                      <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-gray)]">Fully separated drums, bass, instruments, & vocals</div>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 'RESULT' && (
            <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--accent)] text-white flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_var(--accent-glow)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{recommendation.package}</h3>
              <p className="text-[var(--text-gray)] mb-8 max-w-sm mx-auto leading-relaxed">
                {recommendation.desc}
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-8">
                 <div className="px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-dark)]">
                    <span className="text-xs text-[var(--text-muted)] uppercase block">Est. Price</span>
                    <span className="text-white font-bold">{recommendation.price}</span>
                 </div>
                 <div className="px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-dark)]">
                    <span className="text-xs text-[var(--text-muted)] uppercase block">Turnaround</span>
                    <span className="text-white font-bold">3-5 Days</span>
                 </div>
              </div>

              <button className="w-full py-4 bg-white text-[var(--bg-base)] font-bold rounded-xl hover:scale-[1.02] transition-transform">
                Book Session Now
              </button>
              
              <button onClick={reset} className="mt-6 text-sm text-[var(--text-muted)] hover:text-white transition-colors">
                Start Over
              </button>
            </div>
          )}
          
          {loading && (
             <div className="absolute inset-0 bg-[var(--bg-base)]/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
             </div>
          )}
        </div>
      </div>
    </section>
  );
};