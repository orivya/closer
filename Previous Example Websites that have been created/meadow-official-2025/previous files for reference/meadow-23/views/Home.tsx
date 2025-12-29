import React from 'react';
import { PenTool, Sparkles, X, Check, CloudRain, Cloud, Meh, Smile, Sun, ArrowRight, GitBranch, Calendar } from 'lucide-react';
import { Button, GlassCard } from '../components/ui';
import { Entry, Mood } from '../types';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, Cell } from 'recharts';

interface HomeProps {
  entries: Entry[];
  moodLogged: Mood | null;
  onLogMood: (m: Mood) => void;
  onClearMood: () => void;
  onNavigate: (view: any, data?: any) => void;
}

export const Home: React.FC<HomeProps> = ({ entries, moodLogged, onLogMood, onClearMood, onNavigate }) => {
  const [moodDismissed, setMoodDismissed] = React.useState(false);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentPrompt = "What is a thought you haven't fully explored yet?";

  // Calculate distinct threads
  const threads = entries.reduce((acc, entry) => {
    if (entry.thread) {
      const existing = acc.find(t => t.name === entry.thread);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ name: entry.thread, count: 1, latestPreview: entry.preview });
      }
    }
    return acc;
  }, [] as { name: string; count: number; latestPreview: string }[]);

  // Mock chart data with styling
  const chartData = [
    { day: 'M', words: 120 },
    { day: 'T', words: 350 },
    { day: 'W', words: 200 },
    { day: 'T', words: 450 },
    { day: 'F', words: 100 },
    { day: 'S', words: 50 },
    { day: 'S', words: entries.length > 0 ? entries[0].wordCount : 0 },
  ];

  return (
    <div className="space-y-10 animate-fade-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-sage-400 animate-pulse"></span>
            <p className="text-xs font-bold uppercase tracking-widest text-sage-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-sage-900 leading-[0.9]">
            {getGreeting()}, <br/>
            <span className="text-sage-400 italic">User</span>
          </h1>
        </div>
        <div className="hidden md:block">
           <p className="text-right text-sage-600 font-light text-sm max-w-[200px] leading-relaxed">
             "Clarity comes from doing, not thinking about doing."
           </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Prompt & Mood) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Prompt Card - Hero */}
          <GlassCard className="p-8 md:p-10 relative overflow-hidden group min-h-[300px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
              <Sparkles size={180} />
            </div>
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 rounded-full border border-white/60 text-[10px] font-bold uppercase tracking-widest text-sage-600 mb-6">
                <Sparkles size={10} /> Daily Prompt
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-sage-900 leading-tight max-w-lg">
                {currentPrompt}
              </h3>
            </div>

            <div className="flex items-center gap-4 mt-8">
              <Button onClick={() => onNavigate('editor', { prompt: currentPrompt })} icon={<PenTool size={18}/>}>
                Reflect on this
              </Button>
              <button 
                className="w-12 h-12 flex items-center justify-center rounded-full border border-sage-200 text-sage-500 hover:bg-white hover:border-white hover:shadow-md transition-all"
                title="Shuffle Prompt"
              >
                <Sparkles size={20} />
              </button>
            </div>
          </GlassCard>

          {/* Mood Tracker */}
          {!moodDismissed && (
            <GlassCard className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold uppercase tracking-widest text-sage-400">Check-in</span>
                <button onClick={() => setMoodDismissed(true)} className="text-sage-300 hover:text-sage-500 transition-colors"><X size={16}/></button>
              </div>
              
              {moodLogged ? (
                <div className="flex items-center justify-between animate-fade-in py-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#2C3C33] text-white flex items-center justify-center shadow-lg shadow-sage-900/10">
                      <Check size={20} />
                    </div>
                    <div>
                      <p className="font-serif text-xl text-sage-900">Logged as <span className="italic text-sage-500">{moodLogged}</span></p>
                      <p className="text-xs text-sage-400 font-medium">Recorded just now</p>
                    </div>
                  </div>
                  <button onClick={onClearMood} className="text-xs font-bold uppercase tracking-wider text-sage-400 hover:text-sage-600">Undo</button>
                </div>
              ) : (
                <div className="flex justify-between gap-2">
                  {[
                    { label: 'Low', icon: CloudRain, color: 'hover:bg-slate-100 hover:text-slate-600' },
                    { label: 'Cloudy', icon: Cloud, color: 'hover:bg-gray-100 hover:text-gray-600' },
                    { label: 'Steady', icon: Meh, color: 'hover:bg-stone-100 hover:text-stone-600' },
                    { label: 'Content', icon: Smile, color: 'hover:bg-orange-50 hover:text-orange-600' },
                    { label: 'Radiant', icon: Sun, color: 'hover:bg-amber-50 hover:text-amber-600' },
                  ].map(({ label, icon: Icon, color }) => (
                    <button 
                      key={label} 
                      onClick={() => onLogMood(label as Mood)}
                      className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 group flex-1 ${color} hover:shadow-sm`}
                    >
                      <Icon className="text-sage-300 group-hover:scale-110 transition-transform duration-300" size={28} strokeWidth={1.5} />
                      <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-sage-300 group-hover:text-current">{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </GlassCard>
          )}
        </div>

        {/* Right Column (Stats & Threads) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Insight Chart */}
          <GlassCard className="p-8 h-[320px] flex flex-col justify-between">
             <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-sage-400 mb-1">Consistency</div>
                  <div className="font-serif text-3xl text-sage-900">
                    {entries.reduce((acc, curr) => acc + curr.wordCount, 0).toLocaleString()} <span className="text-lg text-sage-400 italic">words</span>
                  </div>
                </div>
                <div className="p-2 bg-sage-50 rounded-lg text-sage-500">
                  <Calendar size={20} />
                </div>
             </div>

             <div className="h-[160px] w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                   <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9ebcae', fontSize: 11, fontWeight: 600}} 
                      dy={10}
                   />
                   <Tooltip 
                      cursor={{fill: 'rgba(107, 143, 122, 0.05)', radius: 8}} 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)' }} 
                   />
                   <Bar dataKey="words" radius={[6, 6, 6, 6]} barSize={28}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? '#6B8F7A' : '#E3EBE6'} />
                      ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
             
             <div className="text-center text-xs text-sage-400 font-medium pt-2">
               You're most active on <span className="text-sage-600 font-bold">Thursdays</span>.
             </div>
          </GlassCard>

          {/* Recent Threads */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
               <h4 className="text-xs font-bold uppercase tracking-widest text-sage-400">Jump back in</h4>
               <button onClick={() => onNavigate('journal')} className="text-xs font-bold text-sage-600 hover:text-sage-900">All</button>
             </div>
             
             {threads.length > 0 ? (
               threads.slice(0, 2).map((thread, i) => (
                  <GlassCard key={i} className="p-5 flex items-center gap-4 group" onClick={() => onNavigate('journal')}>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-sage-100 flex items-center justify-center text-sage-500 shadow-sm group-hover:scale-105 transition-transform">
                       <GitBranch size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h5 className="font-serif text-lg text-sage-900 truncate group-hover:text-sage-700">{thread.name}</h5>
                       <p className="text-xs text-sage-400 font-medium">{thread.count} Entries • Last active today</p>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sage-300 group-hover:bg-sage-50 group-hover:text-sage-600 transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </GlassCard>
               ))
             ) : (
                <div className="p-6 border border-dashed border-sage-200 rounded-3xl text-center text-sage-400">
                  <p className="text-sm">No threads yet.</p>
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};
