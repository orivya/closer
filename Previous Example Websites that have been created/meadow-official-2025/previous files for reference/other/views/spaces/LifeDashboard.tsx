import React from 'react';
import { ViewState } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { TrendingUp, Award, Calendar, Zap } from 'lucide-react';

interface LifeDashboardProps {
  onChangeView: (view: ViewState) => void;
}

const data = [
  { day: 'Mon', words: 340 },
  { day: 'Tue', words: 450 },
  { day: 'Wed', words: 200 },
  { day: 'Thu', words: 560 },
  { day: 'Fri', words: 300 },
  { day: 'Sat', words: 600 },
  { day: 'Sun', words: 420 },
];

const LifeDashboard: React.FC<LifeDashboardProps> = () => {
  return (
    <div className="animate-fade-up max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between mb-4">
         <div>
            <h2 className="font-serif text-3xl font-medium text-text-primary mb-1">Life Dashboard</h2>
            <p className="text-text-secondary font-light">Your personal analytics & trends</p>
         </div>
         <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide">
            Updated Today
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <DashboardStat label="Current Streak" value="12" icon={Zap} color="text-amber-500" bg="bg-amber-50" sub="Best: 24 days" />
         <DashboardStat label="Total Entries" value="247" icon={Calendar} color="text-blue-500" bg="bg-blue-50" sub="+12 this month" />
         <DashboardStat label="Words Written" value="48k" icon={TrendingUp} color="text-sage" bg="bg-sage/10" sub="+2.4k this week" />
         <DashboardStat label="Avg Length" value="194" icon={Award} color="text-purple-500" bg="bg-purple-50" sub="words / entry" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Activity Chart */}
         <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
            <h3 className="font-medium text-text-primary mb-6">Word Output Trend</h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                     <defs>
                        <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#7d9b8a" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#7d9b8a" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)' }}
                        cursor={{ stroke: '#7d9b8a', strokeWidth: 1, strokeDasharray: '4 4' }}
                     />
                     <Area type="monotone" dataKey="words" stroke="#7d9b8a" strokeWidth={3} fillOpacity={1} fill="url(#colorWords)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Topics */}
         <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
            <h3 className="font-medium text-text-primary mb-6">Top Themes</h3>
            <div className="space-y-5">
               <TopicBar label="Career" count={42} percentage={85} color="bg-sage" />
               <TopicBar label="Growth" count={31} percentage={65} color="bg-blue-400" />
               <TopicBar label="Family" count={24} percentage={50} color="bg-amber-400" />
               <TopicBar label="Fear" count={19} percentage={40} color="bg-red-400" />
               <TopicBar label="Trust" count={14} percentage={30} color="bg-purple-400" />
            </div>
         </div>
      </div>
      
      {/* Heatmap Simulation */}
      <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
         <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-text-primary">Consistency Map</h3>
            <div className="flex gap-2 text-[10px] font-bold text-text-muted uppercase">
               <span>Less</span>
               <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-stone-100" />
                  <div className="w-3 h-3 rounded-sm bg-sage/30" />
                  <div className="w-3 h-3 rounded-sm bg-sage/60" />
                  <div className="w-3 h-3 rounded-sm bg-sage" />
               </div>
               <span>More</span>
            </div>
         </div>
         <div className="flex gap-1 overflow-x-auto pb-2">
            {Array.from({ length: 52 }).map((_, weekIndex) => (
               <div key={weekIndex} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                     // Random heatmap generation for visual
                     const opacity = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : 0.6) : (Math.random() > 0.5 ? 0.3 : 0.05);
                     return (
                        <div 
                           key={dayIndex} 
                           className="w-3 h-3 rounded-[3px] bg-sage" 
                           style={{ opacity }}
                        />
                     )
                  })}
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const DashboardStat = ({ label, value, icon: Icon, color, bg, sub }: any) => (
   <div className="bg-white p-6 rounded-[24px] border border-stone-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-4`}>
         <Icon size={20} />
      </div>
      <div className="font-serif text-3xl font-medium text-text-primary mb-1">{value}</div>
      <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2">{label}</div>
      <div className={`text-xs font-medium ${color}`}>{sub}</div>
   </div>
);

const TopicBar = ({ label, count, percentage, color }: any) => (
   <div className="flex items-center gap-3">
      <span className="w-16 text-sm text-text-secondary font-medium">{label}</span>
      <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
         <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
      <span className="w-6 text-right text-xs text-text-muted font-medium">{count}</span>
   </div>
);

export default LifeDashboard;
