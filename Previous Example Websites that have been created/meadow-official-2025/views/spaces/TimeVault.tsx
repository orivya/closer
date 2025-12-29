import React, { useState, useEffect } from 'react';
import { ViewState } from '../../types';
import { Lock, Unlock, Clock, Plus, Mail, ChevronLeft, Calendar, PenTool, Archive, X, Check } from 'lucide-react';
import { TimeVaultService, TimeCapsule } from '../../services/timeVault';
import { toast } from '../../hooks/use-toast';

interface TimeVaultProps {
    onChangeView: (view: ViewState, data?: any) => void;
}

// Internal View States for the Vault experience
type VaultMode = 'grid' | 'read' | 'write';

const TimeVault: React.FC<TimeVaultProps> = ({ onChangeView }) => {
    const [mode, setMode] = useState<VaultMode>('grid');
    const [selectedLetter, setSelectedLetter] = useState<TimeCapsule | null>(null);
    const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCapsules();
    }, []);

    const loadCapsules = async () => {
        try {
            const data = await TimeVaultService.getCapsules();
            setCapsules(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlockAndRead = async (capsule: TimeCapsule) => {
        if (!capsule.is_unlocked) {
            // It's ready but not unlocked, so unlock it first
            try {
                await TimeVaultService.unlockCapsule(capsule.id);
                // Update local state
                setCapsules(prev => prev.map(c => c.id === capsule.id ? { ...c, is_unlocked: true, unlocked_at: new Date().toISOString() } : c));
                // Then open
                setSelectedLetter({ ...capsule, is_unlocked: true });
                setMode('read');
                toast({ title: "Unlocked", description: "The past greets you." });
            } catch (e) {
                toast({ title: "Error", description: "Failed to unlock", variant: "destructive" });
            }
        } else {
            // Already unlocked
            setSelectedLetter(capsule);
            setMode('read');
        }
    };

    const handleCreate = () => {
        setMode('write');
    };

    const handleClose = () => {
        setMode('grid');
        setSelectedLetter(null);
        loadCapsules(); // Reload to ensure sync
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
                    <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 text-stone-600 flex items-center justify-center shadow-sm">
                        <Archive size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h2 className="font-serif text-4xl text-sage-900 mb-1">The Vault</h2>
                        <p className="text-stone-500 font-serif italic">Time capsules for your future self.</p>
                    </div>
                </div>
                <button
                    onClick={handleCreate}
                    className="mt-6 md:mt-0 px-8 py-3 bg-stone-900 text-white rounded-xl font-medium shadow-lg hover:bg-stone-800 hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Seal New Letter
                </button>
            </div>

            {/* Vault Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">

                {/* CREATE CARD */}
                <button
                    onClick={handleCreate}
                    className="border-2 border-dashed border-stone-200 rounded-[24px] flex flex-col items-center justify-center p-12 text-stone-400 hover:border-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-all min-h-[320px] group bg-white/50"
                >
                    <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-6 group-hover:bg-white group-hover:shadow-md transition-all">
                        <PenTool size={32} strokeWidth={1} />
                    </div>
                    <span className="font-serif text-2xl mb-2">Write to the future</span>
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Create Capsule</span>
                </button>

                {/* CAPSULE CARDS */}
                {capsules.map(capsule => {
                    const now = new Date();
                    const unlockDate = new Date(capsule.unlock_date);
                    const daysLeft = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                    // Status Logic
                    const isUnlocked = capsule.is_unlocked;
                    const isReadyToUnlock = !isUnlocked && now >= unlockDate;

                    const isVisualReady = isUnlocked || isReadyToUnlock;

                    return (
                        <div
                            key={capsule.id}
                            onClick={() => isVisualReady && handleUnlockAndRead(capsule)}
                            className={`
                        relative rounded-[24px] p-8 flex flex-col items-center text-center min-h-[320px] transition-all duration-500 border
                        ${isVisualReady
                                    ? 'bg-white border-stone-200 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 group'
                                    : 'bg-stone-100 border-stone-200 cursor-not-allowed opacity-80'}
                    `}
                        >
                            {/* Status Icon */}
                            <div className={`
                        w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-stone-100
                        ${isVisualReady ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-200 text-stone-400'}
                    `}>
                                {isVisualReady ? <Unlock size={28} strokeWidth={1.5} /> : <Lock size={28} strokeWidth={1.5} />}
                            </div>

                            {/* Content */}
                            <h3 className="font-serif text-2xl text-sage-900 mb-2 leading-tight line-clamp-2">{capsule.title}</h3>

                            <div className="mb-8">
                                {isUnlocked ? (
                                    <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">Opened</span>
                                ) : isReadyToUnlock ? (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-amber-600 text-xs font-bold uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full animate-pulse border border-amber-100">Ready to Open</span>
                                    </div>
                                ) : (
                                    <span className="text-xs font-bold text-stone-500 uppercase tracking-widest bg-white px-3 py-1 rounded-full flex items-center gap-2 border border-stone-200 w-fit mx-auto">
                                        <Clock size={12} /> {unlockDate.toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            <div className="mt-auto w-full">
                                {isVisualReady ? (
                                    <button className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium shadow-md group-hover:bg-stone-800 transition-colors">
                                        {isReadyToUnlock ? 'Unlock Capsule' : 'Read Letter'}
                                    </button>
                                ) : (
                                    <p className="text-stone-400 font-serif italic text-sm flex items-center justify-center gap-2">
                                        <Lock size={12} /> {daysLeft > 0 ? daysLeft : 0} days remaining
                                    </p>
                                )}
                            </div>
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

    const [title, setTitle] = useState('');
    const [isSealing, setIsSealing] = useState(false);

    const handleSeal = async () => {
        if (!title || !content || !unlockDate) return;

        setIsSealing(true);
        try {
            // Parse unlock date
            const date = new Date(customDate || new Date(Date.now() + getDaysFromLabel(unlockDate) * 86400000));

            await TimeVaultService.createCapsule(title, content, date);

            setStep(3); // Success animation
            setTimeout(onClose, 2500);
        } catch (e) {
            console.error(e);
            toast({ title: "Error", description: "Failed to seal capsule", variant: "destructive" });
        } finally {
            setIsSealing(false);
        }
    };

    const getDaysFromLabel = (label: string) => {
        if (label.includes('1 Month')) return 30;
        if (label.includes('3 Months')) return 90;
        if (label.includes('6 Months')) return 180;
        if (label.includes('1 Year')) return 365;
        return 30;
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
            <div className="px-6 py-6 flex items-center justify-between border-b border-stone-200 bg-white/50 backdrop-blur-sm">
                <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-500 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <Lock size={16} className="text-stone-400" />
                    <span className="font-serif text-lg text-sage-900">New Time Capsule</span>
                </div>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto py-12 px-6">

                    {/* Step 1: Date Selection */}
                    {step === 1 && (
                        <div className="animate-fade-up">
                            <h2 className="font-serif text-4xl text-sage-900 mb-4 text-center">When should this unlock?</h2>
                            <p className="text-center text-stone-500 font-serif italic mb-12">Choose a duration or a specific date.</p>

                            {/* Presets */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {['1 Month', '3 Months', '6 Months', '1 Year'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => { setUnlockDate(t); setStep(2); }}
                                        className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-slate-400 hover:shadow-md transition-all text-center group flex flex-col items-center justify-center gap-3 aspect-square h-40"
                                    >
                                        <Calendar size={28} className="text-stone-300 group-hover:text-slate-600 transition-colors" strokeWidth={1} />
                                        <span className="font-serif text-lg leading-tight text-sage-900">{t}</span>
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
                            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
                                <div className="flex-1 w-full relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                                        <Calendar size={18} />
                                    </span>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={customDate}
                                        onChange={handleCustomDateChange}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-12 pr-4 text-sage-900 focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none transition-all font-medium"
                                    />
                                </div>
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!customDate}
                                    className="w-full md:w-auto px-8 py-3 bg-sage-900 text-white rounded-xl font-medium shadow-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Confirm Date
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Writing */}
                    {step === 2 && (
                        <div className="animate-fade-in h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <button onClick={() => setStep(1)} className="text-xs font-bold text-stone-400 hover:text-stone-600 uppercase tracking-widest flex items-center gap-1">
                                    <ChevronLeft size={12} /> Change Date
                                </button>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                                    Unlocks {unlockDate}
                                </span>
                            </div>

                            <div className="bg-white p-12 md:p-16 rounded-[4px] shadow-2xl border border-stone-100 min-h-[60vh] relative">
                                {/* Paper Texture Overlay */}
                                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] mix-blend-multiply" />

                                <div className="relative z-10">
                                    <input
                                        type="text"
                                        placeholder="Title (e.g., Read on my 30th Birthday)"
                                        className="w-full bg-transparent border-b border-stone-200 pb-4 mb-8 text-3xl font-serif text-sage-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
                                        autoFocus
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Dear Future Me..."
                                        className="w-full h-full min-h-[40vh] bg-transparent border-none resize-none text-xl leading-loose font-serif text-sage-800 placeholder:text-stone-300 focus:ring-0 p-0"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 text-center pb-20">
                                <button
                                    onClick={handleSeal}
                                    disabled={!title || !content}
                                    className="px-12 py-4 bg-rose-700 text-white rounded-full text-lg font-medium shadow-xl hover:bg-rose-800 transition-all hover:scale-105 flex items-center gap-3 mx-auto disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                                >
                                    <div className="w-2 h-2 rounded-full bg-white opacity-50" />
                                    <span>Seal with Wax</span>
                                    <div className="w-2 h-2 rounded-full bg-white opacity-50" />
                                </button>
                                <p className="mt-4 text-xs font-bold text-stone-400 uppercase tracking-widest">Cannot be opened until {unlockDate}</p>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center py-20 animate-scale-in">
                            <div className="w-24 h-24 rounded-full bg-rose-600 text-white flex items-center justify-center mb-8 shadow-2xl animate-bounce">
                                <Lock size={40} strokeWidth={2} />
                            </div>
                            <h2 className="font-serif text-4xl text-sage-900 mb-2">Sealed for the Future</h2>
                            <p className="text-stone-500 font-serif italic text-lg">Your capsule is safe until {unlockDate}.</p>
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
        <div className="fixed inset-0 bg-[#e3e1db] z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors z-20 text-stone-600"
            >
                <X size={24} />
            </button>

            <div className="w-full max-w-2xl bg-[#fdfbf7] h-auto max-h-[90vh] aspect-[3/4] rounded-[2px] shadow-2xl overflow-y-auto relative animate-fade-up border border-stone-200">

                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] mix-blend-multiply" />

                {/* Letter Content */}
                <div className="relative z-10 p-12 md:p-20 flex flex-col min-h-full">
                    <div className="text-center mb-12 border-b-2 border-stone-100 pb-8">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-4 block">From The Past</span>
                        <h2 className="font-serif text-4xl md:text-5xl text-stone-800 mb-4">{letter.title}</h2>
                        <div className="flex items-center justify-center gap-2 text-stone-500 font-serif italic text-sm">
                            <span>Sealed on {new Date(letter.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Unlocked {new Date(letter.unlocked_at || new Date()).toLocaleDateString()}</span>
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

export default TimeVault;
