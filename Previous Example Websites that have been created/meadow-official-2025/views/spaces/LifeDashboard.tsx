import React, { useEffect, useMemo, useState } from 'react';
import { ViewState } from '../../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { TrendingUp, Award, Calendar, Zap } from 'lucide-react';
import { MetricsService, type JournalAnalytics } from '../../services/metrics';
import { EmptyState } from '../../components/ui/EmptyState';

interface LifeDashboardProps {
  onChangeView: (view: ViewState) => void;
}

const toLocalDateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const formatCompact = (n: number) =>
  n >= 1_000_000 ? `${Math.round(n / 100_000) / 10}M` : n >= 1000 ? `${Math.round(n / 100) / 10}k` : `${n}`;

const opacityFor = (entries: number) => {
  if (entries <= 0) return 0.05;
  if (entries === 1) return 0.3;
  if (entries === 2) return 0.6;
  return 1;
};

const LifeDashboard: React.FC<LifeDashboardProps> = () => {
  const [analytics, setAnalytics] = useState<JournalAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const a = await MetricsService.getJournalAnalytics();
        setAnalytics(a);
      } catch (e) {
        console.error('Failed to load dashboard analytics:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const last7 = analytics?.last7Days ?? [];
  const wordsThisWeek = last7.reduce((sum, d) => sum + d.words, 0);
  const entriesThisWeek = last7.reduce((sum, d) => sum + d.entries, 0);

  const chartData = useMemo(
    () =>
      last7.map((d) => ({
        day: d.dateKey ? new Date(d.dateKey).toLocaleDateString(undefined, { weekday: 'short' }) : d.label,
        words: d.words,
      })),
    [last7]
  );

  const themes = useMemo(() => {
    const colors = ['bg-sage', 'bg-blue-400', 'bg-amber-400', 'bg-red-400', 'bg-purple-400'];
    const list = analytics?.topTags ?? [];
    const max = list[0]?.count ?? 0;
    return list.map((t, idx) => ({
      label: t.tag,
      count: t.count,
      percentage: max ? Math.round((t.count / max) * 100) : 0,
      color: colors[idx % colors.length],
    }));
  }, [analytics?.topTags]);

  const updatedLabel = useMemo(() => {
    if (!analytics?.lastEntryDateKey) return 'No entries yet';
    const todayKey = toLocalDateKey(new Date());
    return analytics.lastEntryDateKey === todayKey ? 'Updated Today' : `Updated ${analytics.lastEntryDateKey}`;
  }, [analytics?.lastEntryDateKey]);

  const heatmap = useMemo(() => {
    const byDate = analytics?.byDate ?? {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay();
    const deltaToMonday = (dayOfWeek + 6) % 7;
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - deltaToMonday);

    const start = new Date(startOfThisWeek);
    start.setDate(startOfThisWeek.getDate() - 7 * 51);

    const weeks: { key: string; days: { key: string; opacity: number }[] }[] = [];
    for (let w = 0; w < 52; w++) {
      const days: { key: string; opacity: number }[] = [];
      for (let di = 0; di < 7; di++) {
        const d = new Date(start);
        d.setDate(start.getDate() + w * 7 + di);
        const key = toLocalDateKey(d);
        const entries = byDate[key]?.entries ?? 0;
        const future = d.getTime() > today.getTime();
        days.push({ key, opacity: future ? 0.05 : opacityFor(entries) });
      }
      weeks.push({ key: `${w}`, days });
    }
    return weeks;
  }, [analytics?.byDate]);

  return (
    <div className="animate-fade-up max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between mb-4">
         <div>
            <h2 className="font-serif text-3xl font-medium text-text-primary mb-1">Life Dashboard</h2>
            <p className="text-text-secondary font-light">Your personal analytics & trends</p>
         </div>
         <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide">
            {updatedLabel}
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         <DashboardStat
           label="Current Streak"
           value={isLoading ? '—' : String(analytics?.currentStreak ?? 0)}
           icon={Zap}
           color="text-amber-500"
           bg="bg-amber-50"
           sub={isLoading ? '—' : `Best: ${analytics?.longestStreak ?? 0} days`}
         />
         <DashboardStat
           label="Total Entries"
           value={isLoading ? '—' : String(analytics?.totalEntries ?? 0)}
           icon={Calendar}
           color="text-blue-500"
           bg="bg-blue-50"
           sub={isLoading ? '—' : `${entriesThisWeek} this week`}
         />
         <DashboardStat
           label="Words Written"
           value={isLoading ? '—' : formatCompact(analytics?.totalWords ?? 0)}
           icon={TrendingUp}
           color="text-sage"
           bg="bg-sage/10"
           sub={isLoading ? '—' : `+${formatCompact(wordsThisWeek)} this week`}
         />
         <DashboardStat
           label="Avg Length"
           value={isLoading ? '—' : String(analytics?.avgWords ?? 0)}
           icon={Award}
           color="text-purple-500"
           bg="bg-purple-50"
           sub="words / entry"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Activity Chart */}
         <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
            <h3 className="font-medium text-text-primary mb-6">Word Output Trend</h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#7d9b8a" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#7d9b8a" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a39d', fontSize: 12, fontWeight: 500 }} dy={10} />
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
            {isLoading ? (
              <div className="text-sm text-text-muted">Loading…</div>
            ) : themes.length === 0 ? (
              <EmptyState
                title="No themes yet"
                description="Add tags to entries (or create a few more) to see your top themes appear here."
                variant="minimal"
                iconColor="stone"
              />
            ) : (
              <div className="space-y-5">
                {themes.map((t) => (
                  <TopicBar key={t.label} label={t.label} count={t.count} percentage={t.percentage} color={t.color} />
                ))}
              </div>
            )}
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
            {heatmap.map((week) => (
              <div key={week.key} className="flex flex-col gap-1">
                {week.days.map((d) => (
                  <div key={d.key} className="w-3 h-3 rounded-[3px] bg-sage" style={{ opacity: d.opacity }} />
                ))}
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
