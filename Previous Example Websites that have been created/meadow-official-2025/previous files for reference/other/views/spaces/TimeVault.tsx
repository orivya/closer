
import React, { useState } from 'react';
import { ViewState } from '../../types';
import { Lock, Unlock, Clock, Plus, Mail, ChevronLeft, Calendar, PenTool, Archive } from 'lucide-react';

interface TimeVaultProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

// Internal View States for the Vault experience
type VaultMode = 'grid' | 'read' | 'write';

const TimeVault: React.FC<TimeVaultProps> = ({ onChangeView }) => {
  const [mode, setMode] = useState<VaultMode>('grid');
  const [selectedLetter, setSelectedLetter] = useState<any>(null);

  const capsules = [
    { id: 1, title: "Predictions for 2025", unlockDate: "Jan 1, 2025", status: 'locked', daysLeft: 14, content: "" },
    { id: 2, title: "How I felt about the breakup", unlockDate: "Dec 15, 2024", status: 'ready', daysLeft: 0, content: "Dear Future Me,\n\nI'm writing this right now because I feel like the world is ending, but I know logically it isn't. I want you to look back at this moment and realize how strong you were..." },
    { id: 3, title: "Career goals check-in", unlockDate: "Mar 1, 2025", status: 'locked', daysLeft: 74, content: "" },
  ];

  const handleOpenLetter = (letter: any) => {
      setSelectedLetter(letter);
      setMode('read');
  };

  const handleCreate = () => {
      setMode('write');
  };

  const handleClose = () => {
      setMode('grid');
      setSelectedLetter(null);
  };

  // --- RENDERERS ---

  if (mode === 'write') {
      return <VaultWriter onClose={handleClose} />;
  }

  if (mode === 'read' && selectedLetter) {
      return <VaultReader letter={selectedLetter} onClose={handleClose} />;
  }

  // --- GRID VIEW (Home) ---
  return (
    <div className="animate-fade-up max-w-6xl mx-auto pb-20 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 px-6">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-clay text-white flex items-center justify-center shadow-lg shadow-clay/20">
                <Archive size={32} strokeWidth={1.5} />
            </div>
            <div>
                <h2 className="font-serif text-4xl text-text-primary mb-1">The Vault</h2>
                <p className="text-text-secondary font-light">Time capsules for your future self.</p>
            </div>
         </div>
         <button 
           onClick={handleCreate}
           className="mt-6 md:mt-0 px-8 py-4 bg-text-primary text-white rounded-full font-medium shadow-xl hover:bg-black hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
         >
           <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Seal New Letter
         </button>
      </div>

      {/* Vault Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        
        {/* CREATE CARD */}
        <button 
           onClick={handleCreate}
           className="border-2 border-dashed border-stone-300 rounded-[32px] flex flex-col items-center justify-center p-12 text-stone-400 hover:border-clay hover:text-clay hover:bg-clay/5 transition-all min-h-[320px] group bg-stone-50/50"
        >
           <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-6 group-hover:bg-white group-hover:shadow-md transition-all">
                <PenTool size={32} strokeWidth={1} />
           </div>
           <span className="font-serif text-2xl mb-2">Write to the future</span>
           <span className="text-xs font-bold uppercase tracking-widest opacity-60">Create Capsule</span>
        </button>

        {/* CAPSULE CARDS */}
        {capsules.map(capsule => {
            const isReady = capsule.status === 'ready';
            return (
                <div 
                    key={capsule.id} 
                    onClick={() => isReady && handleOpenLetter(capsule)}
                    className={`
                        relative rounded-[32px] p-8 flex flex-col items-center text-center min-h-[320px] transition-all duration-500
                        ${isReady 
                            ? 'bg-white cursor-pointer shadow-card hover:shadow-xl hover:-translate-y-1 group' 
                            : 'bg-[#e8e6e3] cursor-not-allowed opacity-90'}
                    `}
                >
                    {/* Status Icon */}
                    <div className={`
                        w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner
                        ${isReady ? 'bg-sage/10 text-sage' : 'bg-stone-300 text-stone-500'}
                    `}>
                        {isReady ? <Unlock size={28} /> : <Lock size={28} />}
                    </div>

                    {/* Content */}
                    <h3 className="font-serif text-2xl text-text-primary mb-3 leading-tight">{capsule.title}</h3>
                    
                    {isReady ? (
                        <p className="text-sage-dark text-xs font-bold uppercase tracking-widest mb-8 bg-sage/10 px-3 py-1 rounded-full">Unlocked Today</p>
                    ) : (
                         <div className="flex flex-col items-center gap-2 mb-8">
                            <span className="text-xs font-bold text-stone-500 uppercase tracking-widest bg-stone-200/50 px-3 py-1 rounded-full flex items-center gap-2">
                                <Clock size={12} /> {capsule.unlockDate}
                            </span>
                        </div>
                    )}

                    <div className="mt-auto w-full">
                        {isReady ? (
                            <button className="w-full py-3 bg-text-primary text-white rounded-xl font-medium shadow-md group-hover:bg-black transition-colors">
                                Open Letter
                            </button>
                        ) : (
                            <p className="text-stone-500 font-serif italic text-sm flex items-center justify-center gap-2">
                                <Lock size={12} /> {capsule.daysLeft} days remaining
                            </p>
                        )}
                    </div>

                    {/* Decorative Elements for Locked State */}
                    {!isReady && (
                        <div className="absolute inset-0 border-2 border-stone-300/50 rounded-[32px] pointer-events-none" />
                    )}
                </div>
            )
        })}
      </div>
    </div>
  );
};

// --- WRITER COMPONENT ---
const VaultWriter = ({ onClose }: { onClose: () => void }) => {
    const [step, setStep] = useState(1);
    const [unlockDate, setUnlockDate] = useState('');
    const [customDate, setCustomDate] = useState('');
    const [content, setContent] = useState('');

    const handleSeal = () => {
        // Here you would save to DB
        setStep(3); // Success animation
        setTimeout(onClose, 2000);
    };

    const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCustomDate(val);
        if (val) {
            const date = new Date(val);
            setUnlockDate(date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
        }
    };

    return (
        <div className="fixed inset-0 bg-[#faf9f7] z-50 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="px-6 py-6 flex items-center justify-between border-b border-stone-200">
                <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-text-secondary transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <span className="font-serif text-lg text-text-primary">New Time Capsule</span>
                <div className="w-10" /> 
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto py-12 px-6">
                    
                    {/* Step 1: Date Selection */}
                    {step === 1 && (
                        <div className="animate-fade-up">
                            <h2 className="font-serif text-4xl text-text-primary mb-4 text-center">When should this unlock?</h2>
                            <p className="text-center text-text-secondary mb-12">Choose a duration or a specific date.</p>
                            
                            {/* Presets */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {['1 Month', '3 Months', '6 Months', '1 Year'].map((t) => (
                                    <button 
                                        key={t}
                                        onClick={() => { setUnlockDate(t); setStep(2); }}
                                        className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-clay hover:shadow-md transition-all text-center group flex flex-col items-center justify-center gap-2 aspect-square md:aspect-auto md:h-32"
                                    >
                                        <Calendar size={28} className="text-stone-300 group-hover:text-clay transition-colors mb-2" />
                                        <span className="font-serif text-lg leading-tight">{t}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="relative flex items-center gap-4 mb-8">
                                <div className="h-px bg-stone-200 flex-1" />
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Or specific date</span>
                                <div className="h-px bg-stone-200 flex-1" />
                            </div>

                            {/* Custom Date Picker */}
                            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
                                <div className="flex-1 w-full relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                                        <Calendar size={18} />
                                    </span>
                                    <input 
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={customDate}
                                        onChange={handleCustomDateChange}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-12 pr-4 text-text-primary focus:ring-2 focus:ring-clay/20 focus:border-clay outline-none transition-all"
                                    />
                                </div>
                                <button 
                                    onClick={() => setStep(2)}
                                    disabled={!customDate}
                                    className="w-full md:w-auto px-8 py-3 bg-text-primary text-white rounded-xl font-medium shadow-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Confirm Date
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Writing */}
                    {step === 2 && (
                        <div className="animate-fade-in h-full flex flex-col">
                            <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-stone-200 min-h-[60vh] relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                                <span className="absolute top-6 right-6 text-xs font-bold text-clay uppercase tracking-widest bg-clay/10 px-3 py-1 rounded-full">
                                    Unlocks {unlockDate}
                                </span>
                                <input 
                                    type="text"
                                    placeholder="Title (e.g., Read on my Birthday)"
                                    className="w-full bg-transparent border-b border-stone-200 pb-4 mb-8 text-3xl font-serif placeholder:text-stone-300 focus:outline-none focus:border-clay"
                                    autoFocus
                                />
                                <textarea 
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Dear Future Me..."
                                    className="w-full h-full min-h-[40vh] bg-transparent border-none resize-none text-lg leading-relaxed font-serif text-text-primary placeholder:text-stone-300 focus:ring-0"
                                />
                            </div>
                            <div className="mt-8 text-center">
                                <button 
                                    onClick={handleSeal}
                                    className="px-12 py-4 bg-clay text-white rounded-full text-lg font-medium shadow-xl hover:bg-stone-800 transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                                >
                                    <Lock size={20} /> Seal Capsule
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center py-20 animate-scale-in">
                            <div className="w-24 h-24 rounded-full bg-clay text-white flex items-center justify-center mb-6 shadow-2xl animate-bounce">
                                <Lock size={40} />
                            </div>
                            <h2 className="font-serif text-4xl text-text-primary mb-2">Sealed & Safe</h2>
                            <p className="text-text-secondary">See you in the future.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- READER COMPONENT ---
const VaultReader = ({ letter, onClose }: { letter: any, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-stone-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in">
            <div className="w-full max-w-3xl bg-[#fdfbf7] h-full max-h-[90vh] rounded-[4px] shadow-2xl overflow-y-auto relative animate-fade-up">
                
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply" />

                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-stone-200/50 rounded-full transition-colors z-20 text-stone-500"
                >
                    <X size={24} />
                </button>

                {/* Letter Content */}
                <div className="relative z-10 p-12 md:p-20 flex flex-col min-h-full">
                    <div className="text-center mb-12 border-b-2 border-stone-100 pb-8">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-4 block">From The Past</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-stone-800 mb-4">{letter.title}</h2>
                        <div className="flex items-center justify-center gap-2 text-stone-500 font-serif italic">
                            <span>Sealed on Jan 15, 2024</span>
                            <span>•</span>
                            <span>Unlocked Today</span>
                        </div>
                    </div>

                    <div className="flex-1 font-serif text-xl leading-loose text-stone-800 whitespace-pre-wrap">
                        {letter.content}
                    </div>

                    <div className="mt-20 pt-12 border-t border-stone-100 text-center">
                        <p className="font-handwriting text-2xl text-stone-600 rotate-[-2deg]">With love, Past You</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper for Reader
const X = ({ size, className }: any) => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export default TimeVault;
