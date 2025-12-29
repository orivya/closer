
import React, { useState } from 'react';
import { ViewState } from '../types';
import { ArrowRight, Check, User, Target, Sparkles, Mail, Lock, ChevronRight, Leaf } from 'lucide-react';

interface OnboardingProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onChangeView }) => {
  const [step, setStep] = useState(0); // 0: Intro, 1: Name, 2: Intent, 3: Email
  
  // Data State
  const [name, setName] = useState('');
  const [intent, setIntent] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Animation State
  const [isExiting, setIsExiting] = useState(false);

  const handleNext = () => {
    setIsExiting(true);
    setTimeout(() => {
        if (step < 3) {
            setStep(step + 1);
            setIsExiting(false);
        } else {
            // Finish Onboarding
            finishSetup();
        }
    }, 400); // Wait for exit animation
  };

  const finishSetup = () => {
      // Save data locally for demo purposes
      localStorage.setItem('meadow_user_name', name);
      localStorage.setItem('meadow_user_intent', intent || 'clarity');
      
      // Navigate to Home with personalized data
      onChangeView(ViewState.HOME, { userName: name, userIntent: intent });
  };

  const intents = [
    { id: 'clarity', label: 'Mental Clarity', desc: 'Clear the noise.', icon: Sparkles },
    { id: 'growth', label: 'Personal Growth', desc: 'Understand myself.', icon: User },
    { id: 'memory', label: 'Memory Keeping', desc: 'Remember the days.', icon: Leaf },
    { id: 'anxiety', label: 'Find Calm', desc: 'Reduce anxiety.', icon: Leaf },
  ];

  // --- RENDER STEPS ---

  const renderStep = () => {
      switch(step) {
          case 0: // INTRO
              return (
                  <div className="text-center max-w-lg mx-auto">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sage to-sage-dark text-white flex items-center justify-center shadow-xl shadow-sage/20 mx-auto mb-8 animate-fade-in">
                          <Leaf size={32} />
                      </div>
                      <h1 className="font-serif text-4xl md:text-5xl text-text-primary mb-6 leading-tight animate-fade-up" style={{ animationDelay: '100ms' }}>
                          Welcome to Meadow.
                      </h1>
                      <p className="text-xl text-text-secondary font-light leading-relaxed mb-10 animate-fade-up" style={{ animationDelay: '200ms' }}>
                          A quiet place to hear your own thoughts. <br/>
                          No noise. No judgment. Just you.
                      </p>
                      <button 
                          onClick={handleNext}
                          className="animate-fade-up group inline-flex items-center gap-2 text-lg font-medium text-text-primary hover:text-sage-dark transition-colors"
                          style={{ animationDelay: '300ms' }}
                      >
                          Begin <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                  </div>
              );

          case 1: // NAME
              return (
                  <div className="w-full max-w-md mx-auto">
                      <label className="block text-xs font-bold text-sage uppercase tracking-widest mb-4 text-center">First things first</label>
                      <h2 className="font-serif text-4xl text-text-primary text-center mb-10">What should we call you?</h2>
                      <div className="relative">
                          <input 
                              autoFocus
                              type="text" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Your Name"
                              className="w-full text-center text-4xl font-serif border-b-2 border-stone-200 focus:border-sage bg-transparent py-4 outline-none placeholder:text-stone-300 text-text-primary transition-colors"
                              onKeyDown={(e) => e.key === 'Enter' && name && handleNext()}
                          />
                          {name && (
                              <button 
                                onClick={handleNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-sage text-white rounded-full hover:scale-110 transition-transform animate-scale-in"
                              >
                                  <ArrowRight size={20} />
                              </button>
                          )}
                      </div>
                  </div>
              );

          case 2: // INTENT
              return (
                  <div className="w-full max-w-xl mx-auto">
                      <h2 className="font-serif text-3xl md:text-4xl text-text-primary text-center mb-2">Nice to meet you, <span className="text-sage-dark">{name}</span>.</h2>
                      <p className="text-text-secondary text-center mb-10 text-lg font-light">What brings you to your journal today?</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {intents.map((item, idx) => (
                              <button
                                  key={item.id}
                                  onClick={() => { setIntent(item.id); setTimeout(handleNext, 300); }}
                                  className={`
                                      p-6 rounded-2xl border text-left transition-all duration-300 group hover:-translate-y-1
                                      ${intent === item.id 
                                          ? 'bg-sage text-white border-sage shadow-lg ring-2 ring-sage ring-offset-2' 
                                          : 'bg-white border-stone-200 hover:border-sage/50 hover:shadow-md'}
                                  `}
                                  style={{ animationDelay: `${idx * 100}ms` }}
                              >
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors ${intent === item.id ? 'bg-white/20' : 'bg-stone-50 group-hover:bg-sage/10'}`}>
                                      <item.icon size={20} className={intent === item.id ? 'text-white' : 'text-sage'} />
                                  </div>
                                  <h4 className={`font-serif text-lg mb-1 ${intent === item.id ? 'text-white' : 'text-text-primary'}`}>{item.label}</h4>
                                  <p className={`text-sm ${intent === item.id ? 'text-sage-100' : 'text-text-secondary'}`}>{item.desc}</p>
                              </button>
                          ))}
                      </div>
                  </div>
              );

          case 3: // ACCOUNT
              return (
                  <div className="w-full max-w-md mx-auto text-center">
                      <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-6">
                          <Lock size={20} />
                      </div>
                      <h2 className="font-serif text-3xl text-text-primary mb-4">Save your sanctuary.</h2>
                      <p className="text-text-secondary mb-8 font-light">Create an account to keep your thoughts private and synced across devices.</p>
                      
                      <div className="space-y-4 text-left">
                          <div className="bg-white p-1 rounded-xl border border-stone-200 focus-within:border-sage focus-within:ring-1 focus-within:ring-sage transition-all flex items-center shadow-sm">
                              <div className="pl-4 text-stone-400"><Mail size={18} /></div>
                              <input 
                                  type="email" 
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="Email address"
                                  className="w-full bg-transparent border-none p-3 focus:ring-0 text-text-primary placeholder:text-stone-300"
                              />
                          </div>
                          <div className="bg-white p-1 rounded-xl border border-stone-200 focus-within:border-sage focus-within:ring-1 focus-within:ring-sage transition-all flex items-center shadow-sm">
                              <div className="pl-4 text-stone-400"><Lock size={18} /></div>
                              <input 
                                  type="password" 
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="Create a password"
                                  className="w-full bg-transparent border-none p-3 focus:ring-0 text-text-primary placeholder:text-stone-300"
                              />
                          </div>
                      </div>

                      <button 
                          onClick={handleNext}
                          disabled={!email || !password}
                          className="w-full mt-8 py-4 bg-text-primary text-white rounded-xl font-medium shadow-lg hover:bg-black hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                      >
                          Enter Meadow <ArrowRight size={18} />
                      </button>
                      
                      <p className="mt-4 text-xs text-text-muted">
                          By continuing, you agree to our Terms & Privacy Policy.
                      </p>
                  </div>
              );
          
          default:
              return null;
      }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col relative overflow-hidden">
        
        {/* Progress Dots (Subtle) */}
        <div className="absolute top-8 left-0 right-0 flex justify-center gap-2">
            {[0, 1, 2, 3].map(i => (
                <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-sage' : step > i ? 'w-1.5 bg-sage/40' : 'w-1.5 bg-stone-200'}`} 
                />
            ))}
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 w-full animate-fade-in">
            <div className={`transition-all duration-500 transform ${isExiting ? 'opacity-0 -translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'} w-full`}>
                {renderStep()}
            </div>
        </div>
        
        {/* Ambient Background */}
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-sage/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-clay/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

    </div>
  );
};

export default Onboarding;
