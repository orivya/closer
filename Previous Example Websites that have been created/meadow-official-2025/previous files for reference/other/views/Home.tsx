
import React, { useState, useEffect } from 'react';
import { ViewState, Note, Thread, Insight } from '../types';
import { PenTool, ArrowRight, Sparkles, GitBranch, Wind, Check, Sun, Cloud, CloudRain, Meh, Smile, Leaf, Shuffle, Zap, X } from 'lucide-react';

interface HomeProps {
  onChangeView: (view: ViewState, data?: any) => void;
  userName?: string;
  userIntent?: string;
}

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale';

const Home: React.FC<HomeProps> = ({ onChangeView, userName = "Sarah", userIntent = 'clarity' }) => {
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('idle');
  const [moodLogged, setMoodLogged] = useState<string | null>(null);
  const [isMoodDismissed, setIsMoodDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Personalized Content Logic
  const getPrompt = () => {
      switch(userIntent) {
          case 'anxiety': return "What is worrying you right now? Let's put it on paper.";
          case 'growth': return "What did you learn about yourself today?";
          case 'memory': return "Capture one small detail from today you want to remember.";
          case 'clarity': 
          default: return "What is a thought you haven't fully explored yet?";
      }
  };

  const getSubheading = () => {
      switch(userIntent) {
          case 'anxiety': return "Let's find some calm together.";
          case 'growth': return "Ready to reflect on your progress?";
          case 'memory': return "Time to archive today's moments.";
          case 'clarity': 
          default: return "Ready to clear your mind?";
      }
  };

  // Trigger breath animation cycle
  const takeBreath = () => {
    if (breathPhase !== 'idle') return; // Prevent clicking while active

    setBreathPhase('inhale');
    
    // Inhale for 4 seconds
    setTimeout(() => {
      setBreathPhase('hold');
      
      // Hold for 2 seconds
      setTimeout(() => {
        setBreathPhase('exhale');
        
        // Exhale for 4 seconds then reset
        setTimeout(() => {
          setBreathPhase('idle');
        }, 4000);
      }, 2000);
    }, 4000);
  };

  const getBreathLabel = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe in...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe out...';
      default: return 'Take a breath';
    }
  };

  const threads: Thread[] = [
    { id: '1', title: 'Career Decision', count: 8, updated: 'Today', preview: 'Weighing security against something harder to name.' },
    { id: '2', title: 'Relationships', count: 12, updated: 'Yesterday', preview: 'Thinking about what you need from the people in your life.' },
  ];

  const recentNotes: Note[] = [
    { id: '1', title: 'Should I take the new role?', preview: "I've been thinking about whether I should take the new role. More money, more responsibility...", date: 'Today', time: '2:34 PM', thread: 'Career Decision', content: '' },
    { id: '2', title: 'What I actually want', preview: "It's not about the title or the money. It's about whether I feel like I'm moving toward something...", date: 'Yesterday', time: '9:15 PM', content: '' },
  ];

  const insight: Insight = {
    id: '1',
    dateRange: 'This Week',
    title: "You're processing a transition",
    description: "This week, you've written 5 entries — mostly about changes at work and what they mean for your future. You seem to be weighing options carefully.",
    quote: "I keep coming back to what I actually want, not what I think I should want.",
    type: 'weekly'
  };

  // Streak Data Configuration
  const weekDays = [
      { day: 'M', status: 'filled' },
      { day: 'T', status: 'filled' },
      { day: 'W', status: 'filled' },
      { day: 'T', status: 'filled' },
      { day: 'F', status: 'missed' },
      { day: 'S', status: 'today' },
      { day: 'S', status: 'future' },
  ];

  return (
    <div className="space-y-10 animate-fade-up pb-12 max-w-5xl mx-auto relative">
      
      {/* 1. Sanctuary Header */}
      <div className="relative text-center md:text-left pt-4">
         <div className="flex flex-col-reverse md:flex-row md:items-center justify-between mb-4 md:mb-2">
             <p className="text-xs font-bold text-sage-dark/60 uppercase tracking-widest pl-1 mt-2 md:mt-0">Tuesday, December 16</p>
             
             {/* Mini Streak Widget (Minimal & Blended) */}
             <div className="self-center md:self-auto flex flex-col items-center md:items-end group cursor-default">
                 {/* Top Row: Count & Label (Faded) */}
                 <div className="flex items-center gap-1.5 mb-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                    <Zap size={10} className="fill-current text-text-secondary" />
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">12 Day Streak</span>
                 </div>
                 
                 {/* Bottom Row: Days (Dots) */}
                 <div className="flex items-center gap-1.5 px-1">
                    {weekDays.map((d, i) => (
                        <div 
                            key={i} 
                            title={d.day}
                            className={`
                                w-1.5 h-1.5 rounded-full transition-all duration-300
                                ${d.status === 'filled' ? 'bg-sage' : 
                                  d.status === 'today' ? 'bg-sage-dark scale-125' : 
                                  d.status === 'missed' ? 'bg-stone-300' :
                                  'bg-stone-200'}
                            `} 
                        />
                    ))}
                 </div>
             </div>
         </div>

         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <h2 className="font-serif text-5xl text-text-primary mb-3 leading-tight tracking-tight">
                  Good evening, <em className="text-sage-dark not-italic font-normal">{userName}</em>
               </h2>
               <p className="text-text-secondary text-lg font-light max-w-lg mx-auto md:mx-0">
                  {getSubheading()}
               </p>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-3 w-full md:w-auto relative">
               
               <button 
                  onClick={takeBreath}
                  disabled={breathPhase !== 'idle'}
                  className={`
                     group relative h-12 px-6 rounded-full border bg-white/50 backdrop-blur-sm text-text-secondary text-sm font-medium transition-all duration-700 flex-1 md:flex-none justify-center z-10
                     ${breathPhase !== 'idle' ? 'md:w-48 border-sage/50 text-sage cursor-default shadow-none' : 'md:w-36 md:hover:w-40 border-stone-200/60 hover:bg-white hover:shadow-sm'}
                  `}
               >
                  {/* Progress Bar Background */}
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                      <div 
                        className={`absolute inset-0 bg-sage/10 transition-transform ease-linear origin-left`} 
                        style={{
                            transitionDuration: breathPhase === 'inhale' ? '4000ms' : breathPhase === 'exhale' ? '4000ms' : '0ms',
                            transform: breathPhase === 'inhale' || breathPhase === 'hold' ? 'scaleX(1)' : 'scaleX(0)'
                        }}
                      />
                  </div>
                  
                  <span className="relative z-10 flex items-center justify-center gap-2 transition-opacity duration-300">
                     {breathPhase === 'exhale' && (
                       <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
                          {[...Array(8)].map((_, i) => (
                             <div 
                               key={i}
                               className="absolute text-sage opacity-0 animate-leaf-blow"
                               style={{
                                 animationDelay: `${i * 100}ms`,
                                 '--tx': `${isMobile ? -40 - Math.random() * 20 : -150 - Math.random() * 100}px`, 
                                 '--ty': `${(Math.random() - 0.5) * 50}px`,
                                 '--r': `${Math.random() * 360}deg`,
                                 '--s': `${0.5 + Math.random() * 0.5}`
                               } as React.CSSProperties}
                             >
                               <Leaf size={10} fill="currentColor" />
                             </div>
                          ))}
                       </div>
                     )}
                     
                     <div className="transform -scale-x-100">
                        <Wind size={16} className={`${breathPhase !== 'idle' ? 'animate-pulse text-sage' : ''}`} />
                     </div>
                     <span className="min-w-[80px] text-center">{getBreathLabel()}</span>
                  </span>
               </button>

               <button 
                  onClick={() => onChangeView(ViewState.EDITOR)}
                  className="h-12 px-8 bg-text-primary text-white rounded-full font-medium shadow-lg shadow-text-primary/10 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:bg-black active:translate-y-0 flex items-center justify-center gap-2.5 flex-1 md:flex-none z-10"
               >
                  <PenTool size={16} strokeWidth={2} />
                  Write
               </button>
            </div>
         </div>
      </div>

      {/* 2. Daily Ritual Stack (Moved up slightly now that large streak card is gone) */}
      <div className="max-w-2xl mx-auto w-full space-y-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
         
         {/* Daily Spark */}
         <div className="bg-white rounded-[24px] p-8 border border-stone-200/50 shadow-sm flex flex-col items-center text-center hover:shadow-md hover:border-sage/30 transition-all duration-500 group relative z-10">
            <div className="flex items-center gap-2 mb-4">
               <Sparkles size={14} className="text-sage" />
               <span className="text-[10px] font-bold text-sage uppercase tracking-widest">Daily Spark</span>
            </div>

            <p className="font-serif text-2xl md:text-3xl text-text-primary mb-8 leading-tight max-w-lg mx-auto">
               "{getPrompt()}"
            </p>

            <div className="flex items-center gap-2">
                <button 
                  onClick={() => onChangeView(ViewState.EDITOR, { prompt: getPrompt() })}
                  className="px-6 py-2.5 rounded-full border border-stone-200 bg-white text-text-secondary hover:border-sage hover:text-sage hover:bg-sage/5 transition-all text-sm font-medium flex items-center gap-2"
                >
                   <PenTool size={14} />
                   Write this
                </button>
                <button className="p-2.5 text-stone-300 hover:text-text-muted hover:bg-stone-50 rounded-full transition-colors" title="Shuffle prompt">
                   <Shuffle size={18} strokeWidth={1.5} />
                </button>
            </div>
         </div>

         {/* Mood Check-in */}
         {!isMoodDismissed && (
            <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-4 border border-stone-200/50 shadow-sm relative animate-fade-up">
                <div className="flex justify-between items-center mb-3 px-1">
                   <h4 className="text-sm font-medium text-text-secondary">How are you today?</h4>
                   <button onClick={() => setIsMoodDismissed(true)} className="text-stone-300 hover:text-text-secondary transition-colors">
                      <X size={16} />
                   </button>
                </div>

                {moodLogged ? (
                   <div className="w-full py-2 flex items-center justify-center gap-3 animate-fade-in">
                      <div className="w-6 h-6 rounded-full bg-sage text-white flex items-center justify-center">
                         <Check size={14} strokeWidth={3} />
                      </div>
                      <span className="text-base font-serif text-text-primary">You're feeling <span className="italic">{moodLogged.toLowerCase()}</span> today.</span>
                      <button onClick={() => setMoodLogged(null)} className="ml-2 text-xs text-text-muted underline hover:text-text-secondary">Undo</button>
                   </div>
                ) : (
                   <div className="w-full grid grid-cols-5 gap-2">
                      <MoodButton icon={CloudRain} label="Low" onClick={() => setMoodLogged('Low')} delay="0ms" />
                      <MoodButton icon={Cloud} label="Cloudy" onClick={() => setMoodLogged('Cloudy')} delay="50ms" />
                      <MoodButton icon={Meh} label="Steady" onClick={() => setMoodLogged('Steady')} delay="100ms" />
                      <MoodButton icon={Smile} label="Content" onClick={() => setMoodLogged('Content')} delay="150ms" />
                      <MoodButton icon={Sun} label="Radiant" onClick={() => setMoodLogged('Radiant')} delay="200ms" />
                   </div>
                )}
             </div>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-up" style={{ animationDelay: '300ms' }}>
        {/* 3. Threads */}
        <section>
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-6 px-1 text-center md:text-left gap-2 md:gap-0">
            <h3 className="text-lg font-serif font-medium text-text-primary">Continue your thinking</h3>
            <button 
              onClick={() => onChangeView(ViewState.JOURNAL)}
              className="text-xs font-bold uppercase tracking-wider text-sage hover:text-sage-dark flex items-center gap-1.5 transition-colors"
            >
              View all
            </button>
          </div>
          <div className="space-y-4">
            {threads.map((thread, index) => (
              <div 
                key={thread.id} 
                onClick={() => onChangeView(ViewState.THREAD_DETAIL)}
                className="group bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-card-hover hover:bg-white transition-all duration-300 cursor-pointer flex gap-5 items-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-100 text-sage flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-sage/20 transition-all duration-300">
                  <GitBranch size={20} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium text-text-primary truncate text-lg group-hover:text-sage-dark transition-colors">{thread.title}</h4>
                  </div>
                  <p className="text-sm text-text-secondary truncate font-light opacity-80">{thread.preview}</p>
                </div>
                <span className="text-[10px] font-bold bg-stone-100 text-text-secondary px-2 py-1 rounded-lg group-hover:bg-sage/10 group-hover:text-sage transition-colors">
                   {thread.count}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Weekly Insight */}
        <section>
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-6 px-1 text-center md:text-left gap-2 md:gap-0">
            <h3 className="text-lg font-serif font-medium text-text-primary">Weekly Insight</h3>
          </div>
          <div className="bg-gradient-to-br from-white to-[#f4f7f5] p-8 rounded-3xl border border-white shadow-card relative overflow-hidden h-full flex flex-col group hover:shadow-card-hover transition-all duration-500 text-left">
             <div className="flex gap-4 mb-4 items-center">
                <p className="text-[10px] font-bold text-sage uppercase tracking-widest">Weekly Pattern</p>
                <div className="h-px flex-1 bg-sage/20" />
             </div>
             <h4 className="font-serif text-2xl text-text-primary leading-tight mb-4">{insight.title}</h4>
             <p className="text-text-secondary text-sm leading-relaxed mb-6 font-light">
               {insight.description}
             </p>
             {insight.quote && (
               <div className="relative pl-4 mb-8">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-sage/30 rounded-full" />
                  <p className="italic text-text-muted text-sm leading-relaxed">"{insight.quote}"</p>
               </div>
             )}
             <div className="flex items-center justify-between mt-auto pt-4">
               <button 
                onClick={() => onChangeView(ViewState.INSIGHTS)}
                className="text-xs font-bold uppercase tracking-wider text-sage hover:text-sage-dark flex items-center gap-1.5 transition-colors"
               >
                 View Analysis <ArrowRight size={14} />
               </button>
             </div>
          </div>
        </section>
      </div>

      {/* 5. Recent Notes - Stream Style */}
      <section className="animate-fade-up" style={{ animationDelay: '400ms' }}>
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-6 px-1 text-center md:text-left gap-2 md:gap-0">
          <h3 className="text-lg font-serif font-medium text-text-primary">Recent notes</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recentNotes.map((note, index) => (
             <div 
              key={note.id}
              className="bg-white/40 p-6 rounded-3xl border border-stone-200/50 hover:bg-white hover:shadow-card hover:border-transparent transition-all duration-300 cursor-pointer flex flex-col h-full group text-left"
             >
               <div className="flex justify-between items-baseline mb-3">
                 <p className="text-xs font-bold text-text-muted uppercase tracking-wide">{note.date} · {note.time}</p>
                 {note.thread && (
                   <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-sage opacity-0 group-hover:opacity-100 transition-opacity">
                     <GitBranch size={10} /> {note.thread}
                   </span>
                 )}
               </div>
               <h4 className="font-serif text-lg text-text-primary mb-2 line-clamp-1 group-hover:text-sage-dark transition-colors">{note.title}</h4>
               <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed font-light">{note.preview}</p>
             </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes leaf-blow {
          0% { transform: translate(0, 0) rotate(0deg) scale(0); opacity: 0; }
          20% { opacity: 1; transform: translate(-20px, 0) rotate(90deg) scale(1); }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--r)) scale(var(--s)); opacity: 0; }
        }
        .animate-leaf-blow {
          animation: leaf-blow 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const MoodButton = ({ icon: Icon, label, onClick, delay }: any) => (
   <button 
      onClick={onClick}
      className="group flex flex-col items-center justify-center p-3 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300 animate-fade-up"
      style={{ animationDelay: delay }}
   >
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-stone-300 group-hover:text-sage-dark group-hover:bg-sage/10 transition-colors mb-2">
         <Icon size={22} strokeWidth={1.5} />
      </div>
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wide group-hover:text-sage-dark transition-colors">
         {label}
      </span>
   </button>
);

export default Home;
