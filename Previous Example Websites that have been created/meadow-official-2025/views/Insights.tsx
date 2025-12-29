import React, { useEffect, useMemo, useState } from 'react';
import { ViewState } from '../types';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis, CartesianGrid } from 'recharts';
import { Clock, Calendar, Type, ArrowUpRight, Zap, Moon, Briefcase, Activity, Sparkles, TrendingUp } from 'lucide-react';
import { InsightsEmptyState } from '../components/ui/EmptyState';
import { MetricsService, type JournalAnalytics } from '../services/metrics';
import { MoodService, type MoodLog } from '../services/mood';

interface InsightsProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

type ChartPoint = { day: string; value: number; color: string; label: string };

const toLocalDateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const moodToPercent = (mood: string, intensity: number | null) => {
  const m = mood.toLowerCase().trim();
  const fallback = intensity ? Math.round((Math.min(5, Math.max(1, intensity)) / 5) * 100) : 60;
  if (m === 'radiant') return 90;
  if (m === 'content') return 75;
  if (m === 'steady') return 55;
  if (m === 'cloudy') return 40;
  if (m === 'low') return 25;
  return fallback;
};

const Insights: React.FC<InsightsProps> = ({ onChangeView }) => {
  const [analytics, setAnalytics] = useState<JournalAnalytics | null>(null);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [a, moods] = await Promise.all([
          MetricsService.getJournalAnalytics(),
          MoodService.getMoodLogsLastNDays(7),
        ]);
        setAnalytics(a);
        setMoodLogs(moods);
      } catch (e) {
        console.error('Failed to load insights data:', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const moodByDate = useMemo(() => {
    const map = new Map<string, MoodLog>();
    for (const log of moodLogs) {
      const key = toLocalDateKey(new Date(log.logged_at));
      if (!map.has(key)) map.set(key, log);
    }
    return map;
  }, [moodLogs]);

  const chartData: ChartPoint[] = useMemo(() => {
    const last7 = analytics?.last7Days ?? [];
    const hasAnyMood = moodByDate.size > 0;
    return last7.map((d) => {
      const mood = moodByDate.get(d.dateKey);
      const value = hasAnyMood && mood ? moodToPercent(mood.mood, mood.intensity) : d.words;
      const label = hasAnyMood ? (mood?.mood ?? 'No mood') : `${d.words.toLocaleString()} words`;
      // Sage-inspired gradient
      let color = '#d6d3d1'; // Default Stone
      if (hasAnyMood) {
        if (value >= 75) color = '#10b981'; // Emerald
        else if (value >= 50) color = '#0ea5e9'; // Sky
        else if (value >= 40) color = '#64748b'; // Slate
        else color = '#f43f5e'; // Rose
      } else {
        // Word count logic
        if (value > 500) color = '#059669';
        else if (value > 200) color = '#6b7280';
        else color = '#d1d5db';
      }

      return {
        day: d.label,
        value,
        color,
        label,
      };
    });
  }, [analytics?.last7Days, moodByDate]);

  const totals = useMemo(() => {
    const last7 = analytics?.last7Days ?? [];
    return {
      entries: last7.reduce((sum, d) => sum + d.entries, 0),
      words: last7.reduce((sum, d) => sum + d.words, 0),
    };
  }, [analytics?.last7Days]);

  const top1 = analytics?.topTags?.[0];
  const top2 = analytics?.topTags?.[1];
  const hasEnoughData = (analytics?.totalEntries ?? 0) >= 3;
  const hasAnyMood = moodByDate.size > 0;

  return (
    <div className="space-y-12 animate-fade-up pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between border-b border-stone-200 pb-8 gap-6 md:gap-0 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-600 flex items-center justify-center border border-sage-100">
              <Activity size={20} />
            </div>
            <h2 className="font-serif text-3xl font-medium text-sage-900">Deep Insights</h2>
          </div>
          <p className="text-stone-500 font-serif italic max-w-xl mx-auto md:mx-0">
            Connecting the dots between your habits, mood, and writing topics.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section>
        <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
          <Sparkles size={16} className="text-sage-600" />
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Discoveries this week</h3>
        </div>

        {!isLoading && !hasEnoughData ? (
          <InsightsEmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Volume */}
            <div className="bg-white p-8 rounded-[32px] relative overflow-hidden group hover:shadow-xl transition-all duration-500 border border-stone-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sage-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-stone-50 text-stone-500 flex items-center justify-center border border-stone-100">
                  <TrendingUp size={24} strokeWidth={1.5} />
                </div>
                <span className="bg-sage-50 text-sage-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-sage-100">Summary</span>
              </div>

              <h4 className="font-serif text-3xl text-sage-900 mb-2 leading-tight">
                {totals.words.toLocaleString()} <span className="text-stone-400 text-lg">words</span>
              </h4>
              <p className="text-stone-500 text-sm leading-relaxed mb-8">
                Across <span className="font-semibold text-sage-700">{totals.entries}</span> entries this week.
                {analytics?.avgWords && ` Average ${analytics.avgWords} words per entry.`}
              </p>

              <button
                onClick={() => onChangeView(ViewState.EDITOR, { prompt: "Reflect on your week..." })}
                className="w-full py-4 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-black shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Start a reflection <ArrowUpRight size={16} />
              </button>
            </div>

            {/* Card 2: Themes */}
            <div className="bg-white p-8 rounded-[32px] relative overflow-hidden group hover:shadow-xl transition-all duration-500 border border-stone-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-stone-50 text-stone-500 flex items-center justify-center border border-stone-100">
                  <Briefcase size={24} strokeWidth={1.5} />
                </div>
                <span className="bg-stone-50 text-stone-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-stone-100">Themes</span>
              </div>

              <h4 className="font-serif text-3xl text-sage-900 mb-2 leading-tight">
                {top1 ? top1.tag : 'No themes yet'}
              </h4>
              <p className="text-stone-500 text-sm leading-relaxed mb-8">
                {top1 ? (
                  <>
                    You explored <span className="font-semibold text-sage-700">{top1.tag}</span> {top1.count} times.
                    {top2 ? ` It often appears with ${top2.tag}.` : ''}
                  </>
                ) : (
                  <>Add tags to your entries to see patterns emerge here.</>
                )}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => onChangeView(ViewState.JOURNAL)}
                  className="flex-1 py-4 bg-white border border-stone-200 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-50 transition-all"
                >
                  View Journal
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Stats & Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-stone-100 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-xl text-sage-900">{hasAnyMood ? 'Emotional Landscape' : 'Writing Flow'}</h3>
            {hasAnyMood && (
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> High
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
                  <div className="w-2 h-2 rounded-full bg-rose-500" /> Low
                </div>
              </div>
            )}
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600, fontFamily: 'sans-serif' }}
                  dy={16}
                />
                <Tooltip
                  cursor={{ fill: '#f3f4f6', radius: 4 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-stone-900 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xl transform -translate-y-4">
                          {payload[0].payload.label}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Stats */}
        <div className="bg-white p-8 rounded-[32px] flex flex-col justify-between border border-stone-100 hover:shadow-lg transition-all">
          <div>
            <h3 className="font-serif text-xl text-sage-900 mb-8">Rhythms</h3>
            <div className="space-y-8">
              <PatternItem icon={Clock} label="Peak Time" value={analytics?.peakHourLabel ?? '—'} sub={analytics?.peakHourLabel ? 'When you focus best' : 'Need more data'} />
              <PatternItem icon={Calendar} label="Best Day" value={analytics?.bestWeekday ?? '—'} sub={analytics?.bestWeekday ? 'Your most prolific day' : 'Need more data'} />
              <PatternItem icon={Type} label="Avg Volume" value={analytics?.avgWords ? `${analytics.avgWords}` : '—'} sub="Words per entry" />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-400 font-serif italic">"Consistency is key."</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const PatternItem = ({ icon: Icon, label, value, sub }: any) => (
  <div className="flex items-start gap-4 group">
    <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 shrink-0 group-hover:text-sage-600 group-hover:bg-sage-50 transition-colors">
      <Icon size={20} strokeWidth={1.5} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-serif text-lg text-sage-900 leading-tight mb-0.5">{value}</p>
      <p className="text-xs text-stone-500">{sub}</p>
    </div>
  </div>
);

export default Insights;