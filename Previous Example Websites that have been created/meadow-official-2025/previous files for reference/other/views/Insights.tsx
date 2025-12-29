import React from 'react';
import { ViewState } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Clock, Calendar, Type, ArrowUpRight, Zap, Info, Anchor, Moon, Briefcase, Activity } from 'lucide-react';

interface InsightsProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

const data = [
  { day: 'M', value: 60, color: '#7d9b8a' },
  { day: 'T', value: 40, color: '#9bb3a7' },
  { day: 'W', value: 80, color: '#5c7a6b' }, // Darker for peak
  { day: 'T', value: 70, color: '#7d9b8a' },
  { day: 'F', value: 50, color: '#9bb3a7' },
  { day: 'S', value: 90, color: '#5c7a6b' }, // Peak
  { day: 'S', value: 75, color: '#7d9b8a' },
];

const Insights: React.FC<InsightsProps> = ({ onChangeView }) => {
  return (
    <div className="space-y-12 animate-fade-up pb-12">
      {/* Header - Mobile Centered & Stacked */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between border-b border-stone-200/50 pb-6 gap-6 md:gap-0 text-center md:text-left">
        <div>
          <h2 className="font-serif text-3xl font-medium text-text-primary mb-2">Deep Insights</h2>
          <p className="text-text-secondary font-light max-w-xl mx-auto md:mx-0">
            Connecting the dots between your habits, mood, and writing topics.
          </p>
        </div>
        
        {/* Mobile: Full width buttons, Desktop: Inline */}
        <div className="flex bg-white rounded-full p-1 border border-stone-200 w-full md:w-auto justify-center">
           <button className="flex-1 md:flex-none px-6 md:px-4 py-2 md:py-1.5 bg-text-primary text-white rounded-full text-xs font-bold uppercase tracking-wide">Weekly</button>
           <button className="flex-1 md:flex-none px-6 md:px-4 py-2 md:py-1.5 text-text-muted hover:text-text-primary rounded-full text-xs font-bold uppercase tracking-wide transition-colors">Monthly</button>
        </div>
      </div>

      {/* Narrative Pattern Feed - The "Main Event" */}
      <section>
        <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
           <Zap size={18} className="text-sage" fill="currentColor" />
           <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Discoveries this week</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Card 1: Correlation */}
           <div className="bg-gradient-to-br from-[#F4F7F5] to-white p-8 rounded-[32px] border border-white shadow-card relative overflow-hidden group hover:shadow-card-hover transition-all duration-500">
              <div className="absolute top-0 right-0 w-48 h-48 bg-sage/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex items-start justify-between mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-white text-sage flex items-center justify-center shadow-sm">
                    <Activity size={24} strokeWidth={1.5} />
                 </div>
                 <span className="bg-sage/10 text-sage text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">Correlation</span>
              </div>
              
              <h4 className="font-serif text-2xl text-text-primary mb-3 leading-tight">
                 Confidence correlates with length
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed font-light mb-6">
                 When your journal entries exceed 300 words, your sentiment analysis shows a <span className="font-semibold text-sage-dark">40% increase in confidence</span>. You tend to solve problems when you give yourself space to write.
              </p>
              
              <button 
                 onClick={() => onChangeView(ViewState.EDITOR, { prompt: "Let's explore a problem in detail (aim for 300 words)" })}
                 className="w-full py-3 bg-white border border-sage/20 text-sage-dark rounded-xl text-sm font-medium hover:bg-sage hover:text-white transition-all shadow-sm"
              >
                 Test this pattern
              </button>
           </div>

           {/* Card 2: Topic Drift (Connecting Disparate Things) */}
           <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm relative overflow-hidden group hover:shadow-card-hover transition-all duration-500">
              <div className="flex items-start justify-between mb-6">
                 <div className="flex -space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm border-2 border-white z-10">
                       <Briefcase size={20} />
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-sm border-2 border-white">
                       <Moon size={20} />
                    </div>
                 </div>
                 <span className="bg-stone-100 text-stone-500 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">Connection</span>
              </div>
              
              <h4 className="font-serif text-2xl text-text-primary mb-3 leading-tight">
                 The Career-Sleep Link
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed font-light mb-6">
                 You've mentioned "exhaustion" in 4 out of 5 entries where you discuss "Promotion" or "New Role". Is your career ambition currently costing you rest?
              </p>

              <div className="flex gap-2">
                 <button className="flex-1 py-3 bg-stone-50 text-text-secondary rounded-xl text-sm font-medium hover:bg-stone-100 transition-all">
                    View Entries
                 </button>
                 <button 
                    onClick={() => onChangeView(ViewState.SPACE_MIRROR)}
                    className="flex-1 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-all"
                 >
                    Reflect on this
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Traditional Stats (Secondary) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-stone-100 shadow-card">
          <div className="flex items-center justify-between mb-8">
             <h3 className="font-serif text-xl text-text-primary">Mood Flow</h3>
             <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sage-dark" /> Great</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sage-light" /> Okay</span>
             </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barSize={32}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a39d', fontSize: 12, fontWeight: 500 }} 
                  dy={10}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-stone-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xl transform -translate-y-2">
                          {payload[0].value}% Positive
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-card flex flex-col justify-between">
           <div>
              <h3 className="font-serif text-xl text-text-primary mb-6">Habits</h3>
              <div className="space-y-8">
                <PatternItem icon={Clock} label="Peak Focus" value="8:00 PM" sub="Evening writer" />
                <PatternItem icon={Calendar} label="Best Day" value="Sunday" sub="Longest entries" />
                <PatternItem icon={Type} label="Avg Length" value="287 words" sub="Increasing by 12%" />
              </div>
           </div>
           
           <button className="w-full mt-8 py-3 rounded-xl border border-stone-200 text-sm font-medium text-text-secondary hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
             <span>Full Analysis</span>
             <ArrowUpRight size={16} />
           </button>
        </div>
      </section>
    </div>
  );
};

const PatternItem = ({ icon: Icon, label, value, sub }: any) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-text-muted shrink-0">
      <Icon size={18} strokeWidth={1.5} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-0.5">{label}</p>
      <p className="font-medium text-text-primary text-lg leading-tight">{value}</p>
      <p className="text-xs text-text-secondary mt-1">{sub}</p>
    </div>
  </div>
);

export default Insights;