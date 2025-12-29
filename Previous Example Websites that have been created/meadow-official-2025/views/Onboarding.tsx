import React, { useState } from 'react';
import { ViewState } from '../types';
import {
    ArrowRight, ArrowLeft, Check, User, Target, Sparkles, Mail, Lock,
    ChevronRight, Leaf, Bell, Clock, Sun, Moon, Sunrise, Calendar,
    BookOpen, Archive, Compass, Heart, Brain, Feather, Zap,
    Loader2, Scale,
} from 'lucide-react';
import { z } from 'zod';
import { supabase } from '../src/integrations/supabase/client';
import { SettingsService } from '../services/settings';

const emailSchema = z.string().trim().email({ message: 'Please enter a valid email address' });
const passwordSchema = z.string().min(6, { message: 'Password must be at least 6 characters' });

interface OnboardingProps {
    onChangeView: (view: ViewState, data?: any) => void;
    onClose?: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onChangeView, onClose }) => {
    const [step, setStep] = useState(0); // 0: Intro, 1: Name, 2: Intent, 3: Reminder, 4: Tour, 5: Account
    const totalSteps = 6;

    // Data State
    const [name, setName] = useState('');
    const [intent, setIntent] = useState<string | null>(null);
    const [reminderTime, setReminderTime] = useState<string | null>(null);
    const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [accountError, setAccountError] = useState<string | null>(null);

    // Animation State
    const [isExiting, setIsExiting] = useState(false);
    const [direction, setDirection] = useState<'next' | 'back'>('next');

    const handleNext = () => {
        setDirection('next');
        setIsExiting(true);
        setTimeout(() => {
            if (step < totalSteps - 1) {
                setStep(step + 1);
                setIsExiting(false);
            } else {
                finishSetup();
            }
        }, 400);
    };

    const handleBack = () => {
        if (step > 0) {
            setDirection('back');
            setIsExiting(true);
            setTimeout(() => {
                setStep(step - 1);
                setIsExiting(false);
            }, 400);
        }
    };

    const finishSetup = () => {
        localStorage.setItem('meadow_user_name', name);
        localStorage.setItem('meadow_user_intent', intent || 'clarity');
        localStorage.setItem('meadow_reminder_time', reminderTime || '');
        localStorage.setItem('meadow_reminder_days', JSON.stringify(selectedDays));
        onChangeView(ViewState.HOME, { userName: name, userIntent: intent });
    };


    const createAccountAndFinish = async () => {
        setAccountError(null);

        try {
            emailSchema.parse(email);
            passwordSchema.parse(password);

            setIsCreatingAccount(true);

            const redirectUrl = `${window.location.origin}/`;
            const { error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    emailRedirectTo: redirectUrl,
                    data: {
                        display_name: name.trim(),
                    },
                },
            });

            if (error) {
                if (error.message?.toLowerCase().includes('already registered')) {
                    setAccountError('This email is already registered. Please log in instead.');
                } else {
                    setAccountError(error.message);
                }
                return;
            }

            // If email confirmation is enabled, session may be null → send them to login.
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                onChangeView(ViewState.AUTH);
                return;
            }

            // Sync onboarding data to User Settings
            if (session) {
                try {
                    let timeStr = '09:00:00';
                    if (reminderTime === 'morning') timeStr = '08:00:00';
                    if (reminderTime === 'midday') timeStr = '12:00:00';
                    if (reminderTime === 'evening') timeStr = '20:00:00';

                    await SettingsService.updateSettings({
                        intent: intent,
                        daily_reminder_enabled: !!reminderTime,
                        daily_reminder_time: timeStr,
                        reminder_days: selectedDays
                    });
                } catch (e) {
                    console.error("Failed to save settings", e);
                }
            }

            finishSetup();
        } catch (err) {
            if (err instanceof z.ZodError) {
                setAccountError(err.issues[0]?.message ?? 'Please check your details and try again.');
            } else {
                setAccountError('Unable to create your account. Please try again.');
                console.error(err);
            }
        } finally {
            setIsCreatingAccount(false);
        }
    };

    const intents = [
        { id: 'clarity', label: 'Mental Clarity', desc: 'Clear the noise and find focus.', icon: Brain, color: 'sage' },
        { id: 'growth', label: 'Personal Growth', desc: 'Understand and evolve yourself.', icon: Sparkles, color: 'sage' },
        { id: 'anxiety', label: 'Find Calm', desc: 'Process stress and find peace.', icon: Feather, color: 'sage' },
        { id: 'structure', label: 'Structure', desc: 'Organize my thoughts and goals.', icon: Target, color: 'sage' },
        { id: 'creativity', label: 'Creative Spark', desc: 'Unlock ideas and imagination.', icon: Zap, color: 'sage' },
        { id: 'memory', label: 'Memory Keeping', desc: 'Capture moments before they fade.', icon: Archive, color: 'sage' },
    ];

    const reminderTimes = [
        { id: 'morning', label: 'Morning', time: '8:00 AM', icon: Sunrise, desc: 'Start fresh' },
        { id: 'midday', label: 'Midday', time: '12:00 PM', icon: Sun, desc: 'Midday reset' },
        { id: 'evening', label: 'Evening', time: '8:00 PM', icon: Moon, desc: 'Wind down' },
    ];

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const spaces = [
        { id: 'journal', title: 'Daily Journal', desc: 'Your private space for thoughts.', icon: BookOpen, color: 'sage' },
        { id: 'vault', title: 'TimeVault', desc: 'Write letters to your future self.', icon: Archive, color: 'sage' },
        { id: 'decision', title: 'Decision Lab', desc: 'Weigh options and choose wisely.', icon: Scale, color: 'sage' },
        { id: 'dreams', title: 'Dream Journal', desc: 'Capture the mysteries of sleep.', icon: Moon, color: 'sage' },
    ];

    const toggleDay = (day: string) => {
        setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    const renderStep = () => {
        switch (step) {
            case 0: // INTRO
                return (
                    <div className="text-center max-w-lg mx-auto">
                        <div className="relative w-24 h-24 mx-auto mb-10">
                            <div className="absolute inset-0 bg-emerald-100 rounded-[24px] blur-xl animate-pulse" />
                            <div className="relative w-24 h-24 rounded-[24px] bg-white text-emerald-600 flex items-center justify-center shadow-xl border border-emerald-100 animate-fade-in">
                                <Leaf size={48} strokeWidth={1.5} />
                            </div>
                        </div>
                        <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-6 leading-tight animate-fade-up" style={{ animationDelay: '100ms' }}>
                            Welcome to Meadow
                        </h1>
                        <p className="text-xl text-stone-500 font-serif leading-relaxed mb-12 animate-fade-up italic" style={{ animationDelay: '200ms' }}>
                            A quiet place to hear your own thoughts. <br />
                            No noise. No judgment. Just you.
                        </p>
                        <button
                            onClick={handleNext}
                            className="animate-fade-up group inline-flex items-center gap-3 px-10 py-5 bg-stone-900 text-white rounded-full font-medium shadow-xl hover:bg-black hover:-translate-y-1 transition-all"
                            style={{ animationDelay: '300ms' }}
                        >
                            Begin Your Journey <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="mt-8 text-stone-400 text-xs font-bold uppercase tracking-widest animate-fade-up" style={{ animationDelay: '400ms' }}>
                            Takes less than 2 minutes
                        </p>
                    </div>
                );

            case 1: // NAME
                return (
                    <div className="w-full max-w-md mx-auto">
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-6 text-center">First things first</label>
                        <h2 className="font-serif text-4xl md:text-5xl text-stone-900 text-center mb-12">What should we call you?</h2>
                        <div className="relative">
                            <input
                                autoFocus
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                className="w-full text-center text-3xl md:text-4xl lg:text-5xl font-serif border-b-2 border-stone-200 focus:border-stone-900 bg-transparent py-4 outline-none placeholder:text-stone-300 text-stone-900 transition-colors"
                                onKeyDown={(e) => e.key === 'Enter' && name && handleNext()}
                            />
                            {name && (
                                <button
                                    onClick={handleNext}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 p-4 bg-stone-900 text-white rounded-full hover:scale-110 transition-transform animate-scale-in shadow-lg"
                                >
                                    <ArrowRight size={24} />
                                </button>
                            )}
                        </div>
                        <p className="text-center text-stone-400 text-sm mt-10 font-serif italic">
                            We'll use this to personalize your sanctuary.
                        </p>
                    </div>
                );

            case 2: // INTENT
                return (
                    <div className="w-full max-w-3xl mx-auto">
                        <h2 className="font-serif text-3xl md:text-5xl text-stone-900 text-center mb-4">Nice to meet you, <span className="text-emerald-600 italic">{name}</span>.</h2>
                        <p className="text-stone-500 text-center mb-12 text-xl font-serif">What brings you to journaling today?</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {intents.map((item, idx) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setIntent(item.id); setTimeout(handleNext, 300); }}
                                    className={`
                                      p-6 rounded-[24px] border text-left transition-all duration-300 group hover:-translate-y-1 animate-fade-up
                                      ${intent === item.id
                                            ? 'bg-stone-900 text-white border-stone-900 shadow-xl'
                                            : 'bg-white border-stone-100 hover:border-stone-300 hover:shadow-md'}
                                  `}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${intent === item.id ? 'bg-white/10 text-white' : `bg-${item.color}-50 text-${item.color}-500 group-hover:bg-${item.color}-100`}`}>
                                        <item.icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <h4 className={`font-serif text-xl mb-1 ${intent === item.id ? 'text-white' : 'text-stone-900'}`}>{item.label}</h4>
                                    <p className={`text-sm ${intent === item.id ? 'text-white/70' : 'text-stone-500'}`}>{item.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 3: // REMINDER SETUP
                return (
                    <div className="w-full max-w-lg mx-auto">
                        <div className="w-16 h-16 rounded-[24px] bg-sky-50 text-sky-500 flex items-center justify-center mx-auto mb-8 border border-sky-100 shadow-sm">
                            <Bell size={32} strokeWidth={1.5} />
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 text-center mb-3">When do you reflect best?</h2>
                        <p className="text-stone-500 text-center mb-12 font-serif italic">A gentle nudge at the right time makes all the difference.</p>

                        <div className="grid grid-cols-3 gap-4 mb-10">
                            {reminderTimes.map((time, idx) => (
                                <button
                                    key={time.id}
                                    onClick={() => setReminderTime(time.id)}
                                    className={`
                                      p-6 rounded-[24px] border text-center transition-all duration-300 animate-fade-up
                                      ${reminderTime === time.id
                                            ? 'bg-stone-900 text-white border-stone-900 shadow-xl scale-105'
                                            : 'bg-white border-stone-100 hover:border-stone-300 hover:shadow-md'}
                                  `}
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <time.icon size={28} strokeWidth={1.5} className={`mx-auto mb-3 ${reminderTime === time.id ? 'text-white' : 'text-stone-400'}`} />
                                    <h4 className={`font-serif font-medium mb-1 ${reminderTime === time.id ? 'text-white' : 'text-stone-900'}`}>{time.label}</h4>
                                    <p className={`text-xs font-bold uppercase tracking-wider ${reminderTime === time.id ? 'text-white/60' : 'text-stone-300'}`}>{time.time}</p>
                                </button>
                            ))}
                        </div>

                        <div className="bg-white border border-stone-100 rounded-[24px] p-6 mb-10 shadow-sm">
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 text-center">Which days?</p>
                            <div className="flex justify-between gap-1 md:gap-2">
                                {days.map((day) => (
                                    <button
                                        key={day}
                                        onClick={() => toggleDay(day)}
                                        className={`
                                          w-10 h-10 md:w-12 md:h-12 rounded-xl text-xs font-bold transition-all
                                          ${selectedDays.includes(day)
                                                ? 'bg-stone-900 text-white shadow-md'
                                                : 'bg-stone-50 text-stone-400 hover:bg-stone-100 border border-stone-100'}
                                      `}
                                    >
                                        {day.charAt(0)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => { setReminderTime(null); handleNext(); }}
                                className="flex-1 py-4 text-stone-500 font-medium hover:text-stone-900 transition-colors"
                            >
                                Maybe Later
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!reminderTime}
                                className="flex-1 py-4 bg-stone-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Set Reminder <Check size={16} />
                            </button>
                        </div>
                    </div>
                );

            case 4: // SPACE TOUR
                return (
                    <div className="w-full max-w-4xl mx-auto">
                        <h2 className="font-serif text-3xl md:text-5xl text-stone-900 text-center mb-4">Your Toolbox</h2>
                        <p className="text-stone-500 text-center mb-12 font-serif italic text-lg">Meadow adapts to your needs.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {spaces.map((space, idx) => (
                                <div
                                    key={space.id}
                                    className="bg-white p-6 rounded-[32px] transition-all animate-fade-up border border-stone-100 hover:shadow-xl hover:-translate-y-1"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center mb-6 bg-${space.color}-50 text-${space.color}-500 shadow-sm`}>
                                        <space.icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <h4 className="font-serif text-xl text-stone-900 mb-2">{space.title}</h4>
                                    <p className="text-sm text-stone-500 leading-relaxed font-serif">{space.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleNext}
                                className="px-12 py-5 bg-stone-900 text-white rounded-full font-medium shadow-xl hover:bg-black transition-all inline-flex items-center justify-center gap-3 hover:-translate-y-1"
                            >
                                Continue <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                );

            case 5: // ACCOUNT
                return (
                    <div className="w-full max-w-md mx-auto text-center">
                        <div className="w-16 h-16 rounded-[24px] bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-sm">
                            <Lock size={32} strokeWidth={1.5} />
                        </div>
                        <h2 className="font-serif text-4xl text-stone-900 mb-4">Save your sanctuary</h2>
                        <p className="text-stone-500 mb-10 font-serif italic">Create an account to keep your thoughts private and synced.</p>

                        {accountError && (
                            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm text-left flex items-start gap-3">
                                <div className="mt-0.5"><Lock size={14} /></div>
                                <div>{accountError}</div>
                            </div>
                        )}

                        <div className="space-y-4 text-left">
                            <div className="bg-white p-2 rounded-2xl border border-stone-200 focus-within:border-stone-900 focus-within:ring-1 focus-within:ring-stone-900 transition-all flex items-center shadow-sm">
                                <div className="pl-4 text-stone-400"><Mail size={20} strokeWidth={1.5} /></div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    className="w-full bg-transparent border-none p-4 focus:ring-0 text-stone-900 placeholder:text-stone-300 text-lg"
                                />
                            </div>
                            <div className="bg-white p-2 rounded-2xl border border-stone-200 focus-within:border-stone-900 focus-within:ring-1 focus-within:ring-stone-900 transition-all flex items-center shadow-sm">
                                <div className="pl-4 text-stone-400"><Lock size={20} strokeWidth={1.5} /></div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    className="w-full bg-transparent border-none p-4 focus:ring-0 text-stone-900 placeholder:text-stone-300 text-lg"
                                />
                            </div>
                        </div>

                        <button
                            onClick={createAccountAndFinish}
                            disabled={!email || !password || isCreatingAccount}
                            className="w-full mt-10 py-5 bg-stone-900 text-white rounded-2xl font-medium shadow-xl hover:bg-black hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isCreatingAccount ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> Creating account
                                </>
                            ) : (
                                <>Enter Meadow <ArrowRight size={20} /></>
                            )}
                        </button>

                        <button
                            onClick={finishSetup}
                            className="w-full mt-6 py-3 text-stone-400 hover:text-stone-600 transition-colors text-sm font-bold uppercase tracking-widest"
                        >
                            Skip for now
                        </button>

                        <p className="mt-8 text-xs text-stone-400 px-8 leading-relaxed">
                            By continuing, you agree to our Terms & Privacy Policy. Your data is encrypted and private.
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6] flex flex-col relative overflow-hidden transition-colors duration-1000">

            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.4] bg-[url('https://www.transparenttextures.com/patterns/cardboard.png')] mix-blend-multiply" />


            {/* Progress Dots */}
            <div className="absolute top-10 left-0 right-0 flex justify-center gap-3 z-20">
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-stone-900' : step > i ? 'w-1.5 bg-stone-300' : 'w-1.5 bg-stone-200'}`}
                    />
                ))}
            </div>

            {/* Back Button */}
            {step > 0 ? (
                <button
                    onClick={handleBack}
                    className="absolute top-8 left-6 p-4 rounded-full bg-white border border-stone-200 text-stone-400 hover:text-stone-900 hover:border-stone-400 transition-all z-20 animate-fade-in shadow-sm hover:shadow-md"
                >
                    <ArrowLeft size={20} />
                </button>
            ) : onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-8 left-6 p-4 rounded-full bg-white border border-stone-200 text-stone-400 hover:text-stone-900 hover:border-stone-400 transition-all z-20 animate-fade-in shadow-sm hover:shadow-md"
                    aria-label="Go back to home"
                >
                    <ArrowLeft size={20} />
                </button>
            )}

            {/* Content Container */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 w-full relative z-10">
                <div className={`transition-all duration-500 transform ${isExiting ? (direction === 'next' ? 'opacity-0 -translate-y-8 scale-95' : 'opacity-0 translate-y-8 scale-95') : 'opacity-100 translate-y-0 scale-100'} w-full`}>
                    {renderStep()}
                </div>
            </div>

            {/* Ambient Background - Subtle Aurora */}
            <div className="absolute -top-[20%] -right-[20%] w-[80vw] h-[80vw] bg-rose-100/30 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-multiply" />
            <div className="absolute -bottom-[20%] -left-[20%] w-[80vw] h-[80vw] bg-emerald-100/30 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-multiply" />
        </div>
    );
};

export default Onboarding;
