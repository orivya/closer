import React, { useEffect, useMemo, useState } from 'react';
import { ViewState } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { MetricsService, type JournalAnalytics } from '../services/metrics';
import { MoodService, type MoodLog } from '../services/mood';
import { SettingsService, type UserSettings } from '../services/settings';
import { supabase } from '../src/integrations/supabase/client';
import { toast } from '../hooks/use-toast';
import { User, Bell, Moon, Lock, Database, ChevronRight, LogOut, Shield, Zap, Calendar, Award, TrendingUp, Clock, Type, ArrowUpRight, Activity, Briefcase, Sun, Cloud, CloudRain, Smile, Meh, Wind, Sparkles, Loader2, Crown, CreditCard, UserX, Monitor } from 'lucide-react';

interface SettingsProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

type WeatherPoint = {
  dateKey: string;
  day: string;
  label: string;
  value: number;
  height: string;
  icon: any;
  opacity: string;
  summary: string;
};

const toLocalDateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const Settings: React.FC<SettingsProps> = ({ onChangeView }) => {
  const { profile, user, signOut, subscription, isPro, isPremium } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'insights' | 'settings'>('insights');
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [focusedDayIndex, setFocusedDayIndex] = useState<number>(6);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [analytics, setAnalytics] = useState<JournalAnalytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [weeklyWeather, setWeeklyWeather] = useState<WeatherPoint[]>([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  const getPlanLabel = () => {
    if (isPremium) return 'Premium';
    if (isPro) return 'Pro';
    return 'Free';
  };

  const activeWeather = useMemo(() => {
    if (!weeklyWeather.length) {
      return {
        dateKey: toLocalDateKey(new Date()),
        day: new Date().toLocaleDateString(undefined, { weekday: 'short' }).charAt(0),
        label: 'No log',
        value: 0,
        height: '15%',
        icon: Cloud,
        opacity: 'opacity-20',
        summary: 'Log your mood to see patterns here.',
      } satisfies WeatherPoint;
    }
    const idx = Math.min(Math.max(focusedDayIndex, 0), weeklyWeather.length - 1);
    return weeklyWeather[idx];
  }, [focusedDayIndex, weeklyWeather]);

  // Get user info
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoadingAnalytics(true);
      try {
        const a = await MetricsService.getJournalAnalytics();
        setAnalytics(a);
      } catch (e) {
        console.error('Failed to load journal analytics:', e);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };
    const fetchSettings = async () => {
      try {
        const s = await SettingsService.getSettings();
        setUserSettings(s);
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    };
    fetchAnalytics();
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoadingWeather(true);
      try {
        const logs = await MoodService.getMoodLogsLastNDays(7);
        const byDate = new Map<string, MoodLog>();
        for (const log of logs) {
          const key = toLocalDateKey(new Date(log.logged_at));
          if (!byDate.has(key)) byDate.set(key, log);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const points: WeatherPoint[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const key = toLocalDateKey(d);
          const day = d.toLocaleDateString(undefined, { weekday: 'short' }).charAt(0);
          const log = byDate.get(key);
          const mood = (log?.mood ?? '').toLowerCase().trim();

          let icon = Cloud;
          let value = 0;
          let height = '15%';
          let opacity = 'opacity-20';
          let label = log?.mood ?? '—';

          if (mood) {
            if (mood === 'low') {
              icon = CloudRain;
              value = 1;
              height = '25%';
              opacity = 'opacity-30';
            } else if (mood === 'cloudy') {
              icon = Cloud;
              value = 2;
              height = '40%';
              opacity = 'opacity-40';
            } else if (mood === 'steady') {
              icon = Meh;
              value = 3;
              height = '55%';
              opacity = 'opacity-60';
            } else if (mood === 'content') {
              icon = Smile;
              value = 4;
              height = '75%';
              opacity = 'opacity-80';
            } else if (mood === 'radiant') {
              icon = Sun;
              value = 5;
              height = '90%';
              opacity = 'opacity-100';
            } else {
              // Unknown mood; show a neutral cloud.
              icon = Cloud;
              value = log?.intensity ?? 3;
              height = `${Math.min(90, Math.max(25, (value / 5) * 90))}%`;
              opacity = 'opacity-60';
              label = log?.mood ?? 'Mood';
            }
          }

          const summary = log?.notes?.trim()
            ? log.notes
            : log
              ? `Felt ${label.toLowerCase()} this day.`
              : 'No mood logged.';

          points.push({
            dateKey: key,
            day,
            label,
            value,
            height,
            icon,
            opacity,
            summary,
          });
        }

        setWeeklyWeather(points);
        setFocusedDayIndex(points.length - 1);
      } catch (e) {
        console.error('Failed to load weekly weather:', e);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const points: WeatherPoint[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          points.push({
            dateKey: toLocalDateKey(d),
            day: d.toLocaleDateString(undefined, { weekday: 'short' }).charAt(0),
            label: '—',
            value: 0,
            height: '15%',
            icon: Cloud,
            opacity: 'opacity-20',
            summary: 'No mood logged.',
          });
        }
        setWeeklyWeather(points);
      } finally {
        setIsLoadingWeather(false);
      }
    };
    fetchWeather();
  }, []);

  const streakValue = isLoadingAnalytics ? '—' : String(analytics?.currentStreak ?? 0);
  const entriesValue = isLoadingAnalytics ? '—' : String(analytics?.totalEntries ?? 0);
  const bestStreakValue = isLoadingAnalytics ? '—' : String(analytics?.longestStreak ?? 0);

  const avgWordsValue = isLoadingAnalytics ? '—' : String(analytics?.avgWords ?? 0);
  const peakHourValue = isLoadingAnalytics ? '—' : (analytics?.peakHourLabel ?? '—');
  const peakHourSub = useMemo(() => {
    if (!analytics?.peakHour) return 'Your rhythm will appear here';
    const h = analytics.peakHour;
    if (h < 12) return 'Morning writer';
    if (h < 17) return 'Afternoon writer';
    return 'Evening writer';
  }, [analytics?.peakHour]);

  const handleExport = async () => {
    try {
      toast({ title: "Preparing export", description: "This may take a moment..." });
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-data`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meadow-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({ title: "Export Complete", description: "Your data has been downloaded." });
    } catch (error) {
      console.error('Export error:', error);
      toast({ title: "Export Failed", description: "Please try again later.", variant: "destructive" });
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you surely you want to delete your account? This action is IRREVERSIBLE and will delete all your journal entries, voice memos, and data.")) {
      return;
    }

    // Double confirmation
    if (!window.confirm("Please confirm one last time: DELETE everything?")) {
      return;
    }

    try {
      toast({ title: "Deleting account..." });
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error('Deletion failed');

      await supabase.auth.signOut();
      window.location.href = '/';

    } catch (error) {
      console.error('Delete error:', error);
      toast({ title: "Deletion Failed", description: "Please contact support.", variant: "destructive" });
    }
  };

  const handleToggleAI = async (enabled: boolean) => {
    // enabled means "AI Enabled" -> opt_out = !enabled
    const optOut = !enabled;
    try {
      const updated = await SettingsService.updateSettings({ ai_opt_out: optOut });
      setUserSettings(updated); // Update local state
      toast({ title: optOut ? "AI Features Disabled" : "AI Features Enabled", description: optOut ? "Your data will not be sent to AI services." : "AI reflections and insights are active." });
    } catch (e) {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const weekTotals = useMemo(() => {
    const days = analytics?.last7Days ?? [];
    const entries = days.reduce((sum, d) => sum + d.entries, 0);
    const words = days.reduce((sum, d) => sum + d.words, 0);
    return { entries, words };
  }, [analytics?.last7Days]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up pb-28 md:pb-20 relative">

      {/* Profile Header (Always Visible) */}
      <div className="flex flex-col items-center text-center pt-4 mb-6">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-sage-500 flex items-center justify-center text-white text-3xl font-serif shadow-lg shadow-sage-500/20 border-4 border-white">
            {initials}
          </div>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-sage-100">
            <div className="w-5 h-5 bg-sage-500 rounded-full flex items-center justify-center">
              <User size={10} className="text-white" />
            </div>
          </div>
        </div>
        <h2 className="font-serif text-2xl font-medium text-sage-900 mb-1">{displayName}</h2>
        <p className="text-sage-600 text-sm font-medium bg-sage-50 px-3 py-1 rounded-full inline-block mb-6 border border-sage-100">
          {user?.email || 'Member'}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 w-full max-w-md">
          <div className="glass-card p-4 rounded-2xl flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center mb-1">
              <Zap size={14} fill="currentColor" />
            </div>
            <span className="font-serif text-xl text-sage-900">{streakValue}</span>
            <span className="text-[9px] font-bold text-sage-500 uppercase tracking-wider">Day Streak</span>
          </div>
          <div className="glass-card p-4 rounded-2xl flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center mb-1">
              <Calendar size={14} />
            </div>
            <span className="font-serif text-xl text-sage-900">{entriesValue}</span>
            <span className="text-[9px] font-bold text-sage-500 uppercase tracking-wider">Entries</span>
          </div>
          <div className="glass-card p-4 rounded-2xl flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-600 flex items-center justify-center mb-1">
              <Award size={14} />
            </div>
            <span className="font-serif text-xl text-sage-900">{bestStreakValue}</span>
            <span className="text-[9px] font-bold text-sage-500 uppercase tracking-wider">Best Streak</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-sage-50 rounded-xl mb-8 border border-sage-100">
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'insights' ? 'bg-sage-500 text-white shadow-md' : 'text-sage-500 hover:text-sage-700'}`}
        >
          Insights
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'settings' ? 'bg-sage-500 text-white shadow-md' : 'text-sage-500 hover:text-sage-700'}`}
        >
          Settings
        </button>
      </div>

      {/* --- INSIGHTS CONTENT --- */}
      {activeTab === 'insights' && (
        <div className="space-y-6 animate-fade-in">

          {/* Pattern Card */}
          <div className="glass-card p-6 rounded-[24px] relative overflow-hidden group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-sage-100 text-sage-600 flex items-center justify-center">
                <Activity size={20} strokeWidth={1.5} />
              </div>
              <span className="bg-sage-100 text-sage-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">Discovery</span>
            </div>
            <h4 className="font-serif text-xl text-sage-900 mb-2">
              {weekTotals.entries > 0 ? 'Your week, in words' : 'Your insights are brewing'}
            </h4>
            <p className="text-sage-600 text-sm leading-relaxed font-light mb-4">
              {weekTotals.entries > 0 ? (
                <>
                  In the last 7 days, you wrote <span className="font-semibold text-sage-700">{weekTotals.words.toLocaleString()} words</span> across{' '}
                  <span className="font-semibold text-sage-700">{weekTotals.entries}</span> {weekTotals.entries === 1 ? 'entry' : 'entries'}. Your average entry is{' '}
                  <span className="font-semibold text-sage-700">{avgWordsValue}</span> words.
                </>
              ) : (
                <>Keep journaling—after a few entries, patterns and highlights will start appearing here.</>
              )}
            </p>
            <button
              onClick={() => onChangeView(ViewState.EDITOR, { prompt: "Write for 5 minutes without stopping. What's really here?" })}
              className="w-full py-2.5 bg-sage-50 border border-sage-200 text-sage-600 rounded-xl text-sm font-medium hover:bg-sage-500 hover:text-white hover:border-sage-500 transition-all"
            >
              {weekTotals.entries > 0 ? 'Write a quick follow-up' : 'Write your next entry'}
            </button>
          </div>

          {/* Interactive Weather Report (Monochromatic) */}
          <div className="glass-card rounded-[32px] relative overflow-hidden flex flex-col">
            <div className="p-6 pb-2 z-10 relative flex justify-between items-start">
              <div>
                <h3 className="font-serif text-lg text-sage-900">Weekly Weather</h3>
                <p className="text-[10px] text-sage-500 font-medium mt-0.5">Atmospheric analysis of your week</p>
              </div>
            </div>

            {/* Sky Container */}
            <div className="h-[200px] relative flex items-end justify-between px-4 pb-4 border-b border-sage-100">
              {/* Background Guidelines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-8 px-6">
                <div className="border-t border-dashed border-sage-400 w-full h-0" />
                <div className="border-t border-dashed border-sage-400 w-full h-0" />
                <div className="border-t border-dashed border-sage-400 w-full h-0" />
              </div>

              {weeklyWeather.map((data, index) => {
                const Icon = data.icon;
                const isActive = index === focusedDayIndex;
                return (
                  <div
                    key={index}
                    onClick={() => setFocusedDayIndex(index)}
                    className="flex flex-col items-center gap-3 w-full h-full justify-end group cursor-pointer relative z-10"
                  >

                    {/* The Floating Icon (Height determined by data) */}
                    <div className="relative w-full flex justify-center transition-all duration-700 ease-out" style={{ height: data.height }}>
                      <div className={`
                                   absolute top-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform
                                   ${isActive ? 'scale-125 bg-sage-500 text-white shadow-lg shadow-sage-500/30 z-20' : `scale-100 hover:scale-110 bg-sage-50 text-sage-600 ${data.opacity} border border-sage-200`}
                                   ${index % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}
                                `}>
                        <Icon size={isActive ? 24 : 20} strokeWidth={1.5} />
                      </div>

                      {/* Vertical Connection Stem */}
                      <div className={`h-full w-[1px] border-l border-dashed mt-10 transition-colors ${isActive ? 'border-sage-400' : 'border-sage-200'}`} />
                    </div>

                    {/* Day Label */}
                    <span className={`text-[10px] font-bold uppercase transition-colors ${isActive ? 'text-sage-600 scale-110' : 'text-sage-400'}`}>
                      {data.day}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* AI Analysis Footer */}
            <div className="p-6 bg-sage-50/50">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Sparkles size={16} className="text-sage-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-sage-600 uppercase tracking-widest mb-1">Daily Synthesis</p>
                  <p className="text-sage-700 text-sm font-serif italic">"{activeWeather.summary}"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Habits Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-[24px]">
              <div className="text-[10px] font-bold text-sage-500 uppercase tracking-wider mb-2">Peak Focus</div>
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-sage-500" />
                <span className="font-serif text-lg text-sage-900">{peakHourValue}</span>
              </div>
              <div className="text-xs text-sage-600">{peakHourSub}</div>
            </div>
            <div className="glass-card p-5 rounded-[24px]">
              <div className="text-[10px] font-bold text-sage-500 uppercase tracking-wider mb-2">Avg Length</div>
              <div className="flex items-center gap-2 mb-1">
                <Type size={16} className="text-sage-500" />
                <span className="font-serif text-lg text-sage-900">{avgWordsValue}</span>
              </div>
              <div className="text-xs text-sage-600">Words per entry</div>
            </div>
          </div>

          <button
            onClick={() => onChangeView(ViewState.SPACE_DASHBOARD)}
            className="w-full py-3 rounded-xl border border-sage-200 text-sm font-medium text-sage-600 hover:bg-sage-50 hover:border-sage-300 transition-colors flex items-center justify-center gap-2"
          >
            <span>View Full Dashboard</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      )}

      {/* --- SETTINGS CONTENT --- */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fade-in">
          <section>
            <h3 className="text-xs font-bold text-sage-500 uppercase tracking-widest mb-3 pl-2">Account</h3>
            <div className="glass-card rounded-3xl overflow-hidden">
              <SettingsItem icon={User} label="Personal Information" onClick={() => onChangeView(ViewState.SETTINGS_PROFILE)} />
              <SettingsItem icon={Shield} label="Privacy & Security" onClick={() => onChangeView(ViewState.SETTINGS_SECURITY)} />
              <SettingsItem
                icon={Database}
                label="Data & Export"
                onClick={() => onChangeView(ViewState.SETTINGS_DATA)}
                isLast
              />
            </div>
          </section>

          {/* AI & Privacy Section */}
          <h3 className="text-xs font-bold text-sage-500 uppercase tracking-widest mb-3 pl-2 mt-6">AI & Privacy</h3>
          <div className="glass-card rounded-3xl overflow-hidden mb-6">
            <div className="flex items-center justify-between p-4 border-b border-sage-100">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-sage-100 text-sage-600 flex items-center justify-center">
                  <Sparkles size={16} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-sage-900">Enable AI Features</span>
                  <span className="text-xs text-sage-500">Reflections, insights, and summaries</span>
                </div>
              </div>

              {/* Switch Toggle */}
              <button
                onClick={() => handleToggleAI(!!userSettings?.ai_opt_out)} // If currently opted out, toggle to enable
                className={`w-12 h-6 rounded-full transition-colors relative ${!userSettings?.ai_opt_out ? 'bg-sage-500 shadow-md shadow-sage-500/20' : 'bg-sage-100 border border-sage-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${!userSettings?.ai_opt_out ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* Subscription Section */}
          <section>
            <h3 className="text-xs font-bold text-sage-500 uppercase tracking-widest mb-3 pl-2">Subscription</h3>
            <div className="glass-card rounded-3xl overflow-hidden">
              <button
                onClick={() => onChangeView(ViewState.PRICING)}
                className="w-full flex items-center gap-4 p-4 hover:bg-sage-50 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isPremium ? 'bg-purple-100 text-purple-600' :
                  isPro ? 'bg-sage-100 text-sage-600' :
                    'bg-sage-50 text-sage-500'
                  }`}>
                  {isPremium ? <Crown size={16} strokeWidth={1.5} /> : <CreditCard size={16} strokeWidth={1.5} />}
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium text-sage-900 block">{getPlanLabel()} Plan</span>
                  {subscription.subscriptionEnd && (
                    <span className="text-xs text-sage-500">
                      Renews {new Date(subscription.subscriptionEnd).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {!isPro && (
                  <span className="text-xs font-medium text-sage-600 bg-sage-100 px-2 py-1 rounded-full border border-sage-200">Upgrade</span>
                )}
                <ChevronRight size={16} className="text-sage-400" />
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-sage-500 uppercase tracking-widest mb-3 pl-2">App Settings</h3>
            <div className="glass-card rounded-3xl overflow-hidden">
              <SettingsItem icon={Bell} label="Notifications" value="On" />

              {/* Theme Picker */}
              <div className="border-b border-sage-100">
                <button
                  onClick={() => setShowThemeOptions(!showThemeOptions)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-sage-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-sage-50 text-sage-500 flex items-center justify-center border border-sage-100">
                    {theme === 'dark' ? <Moon size={16} strokeWidth={1.5} /> : theme === 'light' ? <Sun size={16} strokeWidth={1.5} /> : <Monitor size={16} strokeWidth={1.5} />}
                  </div>
                  <span className="flex-1 text-left text-sm font-medium text-sage-900">Appearance</span>
                  <span className="text-sm capitalize text-sage-500">{theme}</span>
                  <ChevronRight size={16} className={`transition-transform ${showThemeOptions ? 'rotate-90' : ''} text-sage-400`} />
                </button>

                {showThemeOptions && (
                  <div className="p-4 pt-0 grid grid-cols-3 gap-2 animate-fade-in">
                    <button
                      onClick={() => { setTheme('light'); setShowThemeOptions(false); }}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        theme === 'light'
                          ? 'border-sage-500 bg-sage-100'
                          : 'border-sage-200 hover:border-sage-400'
                      }`}
                    >
                      <Sun size={20} className={theme === 'light' ? 'text-sage-600' : 'text-sage-400'} />
                      <span className={`text-xs font-medium ${theme === 'light' ? 'text-sage-700' : 'text-sage-500'}`}>Light</span>
                    </button>
                    <button
                      onClick={() => { setTheme('dark'); setShowThemeOptions(false); }}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        theme === 'dark'
                          ? 'border-sage-500 bg-sage-100'
                          : 'border-sage-200 hover:border-sage-400'
                      }`}
                    >
                      <Moon size={20} className={theme === 'dark' ? 'text-sage-600' : 'text-sage-400'} />
                      <span className={`text-xs font-medium ${theme === 'dark' ? 'text-sage-700' : 'text-sage-500'}`}>Dark</span>
                    </button>
                    <button
                      onClick={() => { setTheme('system'); setShowThemeOptions(false); }}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        theme === 'system'
                          ? 'border-sage-500 bg-sage-100'
                          : 'border-sage-200 hover:border-sage-400'
                      }`}
                    >
                      <Monitor size={20} className={theme === 'system' ? 'text-sage-600' : 'text-sage-400'} />
                      <span className={`text-xs font-medium ${theme === 'system' ? 'text-sage-700' : 'text-sage-500'}`}>System</span>
                    </button>
                  </div>
                )}
              </div>

              <SettingsItem icon={Lock} label="Passcode Lock" value="Enabled" isLast />
            </div>
          </section>

          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full py-4 text-red-500 hover:text-red-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {isSigningOut ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogOut size={16} />
            )}
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </button>

          <div className="text-center text-xs text-sage-400 pt-4">
            Meadow v1.0.4 (Build 220)
          </div>
        </div>
      )}

    </div>
  );
};

const SettingsItem = ({ icon: Icon, label, value, isLast, onClick, isDestructive }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 transition-colors hover:bg-sage-50 ${!isLast ? 'border-b border-sage-100' : ''}`}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
      isDestructive
        ? 'bg-red-100 text-red-500 border border-red-200'
        : 'bg-sage-50 text-sage-500 border border-sage-100'
    }`}>
      <Icon size={16} strokeWidth={1.5} />
    </div>
    <span className={`flex-1 text-left text-sm font-medium ${
      isDestructive
        ? 'text-red-500'
        : 'text-sage-900'
    }`}>{label}</span>
    {value && <span className="text-sm text-sage-500">{value}</span>}
    <ChevronRight size={16} className="text-sage-400" />
  </button>
);

export default Settings;