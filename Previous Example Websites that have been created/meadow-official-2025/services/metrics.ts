import { supabase } from '../src/integrations/supabase/client';

export interface EntryMeta {
  created_at: string;
  word_count: number | null;
  tags: string[] | null;
}

export interface DayAggregate {
  dateKey: string; // YYYY-MM-DD (local)
  label: string;   // e.g. "M" or "Mon"
  entries: number;
  words: number;
}

export interface JournalAnalytics {
  totalEntries: number;
  totalWords: number;
  avgWords: number;
  currentStreak: number;
  longestStreak: number;
  streakActive: boolean;
  lastEntryDateKey: string | null;
  last7Days: DayAggregate[];
  topTags: { tag: string; count: number }[];
  peakHour: number | null; // 0-23
  peakHourLabel: string | null; // "8:00 PM"
  bestWeekday: string | null; // "Sunday"
  byDate: Record<string, { entries: number; words: number }>;
}

export interface YearAnalytics {
  year: number;
  entries: number;
  words: number;
  avgWords: number;
  longestStreak: number;
  currentStreak: number;
  topTags: { tag: string; count: number }[];
  peakHourLabel: string | null;
  bestWeekday: string | null;
}

const CACHE_TTL_MS = 30_000;
let cachedMeta:
  | { userId: string; fetchedAt: number; rows: EntryMeta[] }
  | null = null;

export const toLocalDateKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const startOfLocalDay = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const addDays = (d: Date, n: number) => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
};

const dateKeyToLocalDate = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

const formatHourLabel = (hour24: number) => {
  const h = hour24 % 24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = ((h + 11) % 12) + 1;
  return `${hour12}:00 ${ampm}`;
};

const computeStreaks = (dateKeys: Set<string>, now: Date) => {
  if (dateKeys.size === 0) {
    return { currentStreak: 0, longestStreak: 0, streakActive: false, lastEntryDateKey: null as string | null };
  }

  const sorted = Array.from(dateKeys)
    .map((k) => ({ key: k, time: dateKeyToLocalDate(k).getTime() }))
    .sort((a, b) => a.time - b.time);

  // Longest streak
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diffDays = Math.round((sorted[i].time - sorted[i - 1].time) / 86_400_000);
    if (diffDays === 1) {
      run += 1;
      longest = Math.max(longest, run);
    } else if (diffDays > 1) {
      run = 1;
    }
  }

  const today = startOfLocalDay(now);
  const todayKey = toLocalDateKey(today);
  const yesterday = addDays(today, -1);
  const yesterdayKey = toLocalDateKey(yesterday);

  const streakActive = dateKeys.has(todayKey) || dateKeys.has(yesterdayKey);
  let current = 0;
  if (streakActive) {
    let cursor = dateKeys.has(todayKey) ? today : yesterday;
    while (dateKeys.has(toLocalDateKey(cursor))) {
      current += 1;
      cursor = addDays(cursor, -1);
    }
  }

  const lastEntryDateKey = sorted[sorted.length - 1]?.key ?? null;
  return { currentStreak: current, longestStreak: longest, streakActive, lastEntryDateKey };
};

const fetchAllEntryMeta = async (userId: string): Promise<EntryMeta[]> => {
  const pageSize = 1000;
  let from = 0;
  const all: EntryMeta[] = [];

  while (true) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('created_at, word_count, tags')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) throw error;

    const rows = (data ?? []) as EntryMeta[];
    all.push(...rows);

    if (rows.length < pageSize) break;
    from += pageSize;
  }

  return all;
};

const getAllEntryMetaCached = async (): Promise<{ userId: string; rows: EntryMeta[] } | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    cachedMeta = null;
    return null;
  }

  const now = Date.now();
  if (cachedMeta && cachedMeta.userId === user.id && now - cachedMeta.fetchedAt < CACHE_TTL_MS) {
    return { userId: cachedMeta.userId, rows: cachedMeta.rows };
  }

  const rows = await fetchAllEntryMeta(user.id);
  cachedMeta = { userId: user.id, fetchedAt: now, rows };
  return { userId: user.id, rows };
};

export const MetricsService = {
  toLocalDateKey,
  invalidateCache() {
    cachedMeta = null;
  },

  async getJournalAnalytics(): Promise<JournalAnalytics> {
    const meta = await getAllEntryMetaCached();
    const rows = meta?.rows ?? [];
    const now = new Date();

    const byDateMap = new Map<string, { entries: number; words: number }>();
    const dateKeys = new Set<string>();
    const tagCounts = new Map<string, number>();
    const wordsByHour = new Array<number>(24).fill(0);
    const weekdayAgg = new Array<{ entries: number; words: number }>(7).fill(null).map(() => ({ entries: 0, words: 0 }));

    let totalWords = 0;

    for (const r of rows) {
      const created = new Date(r.created_at);
      const dateKey = toLocalDateKey(created);
      const words = r.word_count ?? 0;

      dateKeys.add(dateKey);
      totalWords += words;

      const prev = byDateMap.get(dateKey) ?? { entries: 0, words: 0 };
      prev.entries += 1;
      prev.words += words;
      byDateMap.set(dateKey, prev);

      // Tags
      for (const t of r.tags ?? []) {
        const tag = String(t).trim();
        if (!tag) continue;
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }

      // Peak hour (weighted by words)
      wordsByHour[created.getHours()] += words || 1;

      // Weekday
      const wd = created.getDay(); // 0 Sun .. 6 Sat
      weekdayAgg[wd].entries += 1;
      weekdayAgg[wd].words += words;
    }

    const totalEntries = rows.length;
    const avgWords = totalEntries ? Math.round(totalWords / totalEntries) : 0;

    const { currentStreak, longestStreak, streakActive, lastEntryDateKey } = computeStreaks(dateKeys, now);

    // Top tags
    const topTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // Peak hour label
    let peakHour: number | null = null;
    let peakScore = 0;
    for (let h = 0; h < 24; h++) {
      if (wordsByHour[h] > peakScore) {
        peakScore = wordsByHour[h];
        peakHour = h;
      }
    }
    const peakHourLabel = peakHour === null || totalEntries === 0 ? null : formatHourLabel(peakHour);

    // Best weekday by average words
    let bestWeekday: string | null = null;
    let bestAvg = 0;
    for (let wd = 0; wd < 7; wd++) {
      const agg = weekdayAgg[wd];
      if (!agg.entries) continue;
      const avg = agg.words / agg.entries;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestWeekday = new Date(2024, 0, 7 + wd).toLocaleDateString(undefined, { weekday: 'long' });
      }
    }

    // Last 7 days series
    const today = startOfLocalDay(now);
    const last7Days: DayAggregate[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(today, -i);
      const key = toLocalDateKey(d);
      const agg = byDateMap.get(key) ?? { entries: 0, words: 0 };
      last7Days.push({
        dateKey: key,
        label: d.toLocaleDateString(undefined, { weekday: 'short' }).charAt(0),
        entries: agg.entries,
        words: agg.words,
      });
    }

    const byDate: Record<string, { entries: number; words: number }> = {};
    for (const [k, v] of byDateMap.entries()) byDate[k] = v;

    return {
      totalEntries,
      totalWords,
      avgWords,
      currentStreak,
      longestStreak,
      streakActive,
      lastEntryDateKey,
      last7Days,
      topTags,
      peakHour,
      peakHourLabel,
      bestWeekday,
      byDate,
    };
  },

  async getYearAnalytics(year: number): Promise<YearAnalytics> {
    const meta = await getAllEntryMetaCached();
    const rows = meta?.rows ?? [];
    const now = new Date();

    const yearRows = rows.filter((r) => new Date(r.created_at).getFullYear() === year);

    const byDateMap = new Map<string, { entries: number; words: number }>();
    const dateKeys = new Set<string>();
    const tagCounts = new Map<string, number>();
    const wordsByHour = new Array<number>(24).fill(0);
    const weekdayAgg = new Array<{ entries: number; words: number }>(7).fill(null).map(() => ({ entries: 0, words: 0 }));

    let totalWords = 0;

    for (const r of yearRows) {
      const created = new Date(r.created_at);
      const dateKey = toLocalDateKey(created);
      const words = r.word_count ?? 0;

      dateKeys.add(dateKey);
      totalWords += words;

      const prev = byDateMap.get(dateKey) ?? { entries: 0, words: 0 };
      prev.entries += 1;
      prev.words += words;
      byDateMap.set(dateKey, prev);

      for (const t of r.tags ?? []) {
        const tag = String(t).trim();
        if (!tag) continue;
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }

      wordsByHour[created.getHours()] += words || 1;

      const wd = created.getDay();
      weekdayAgg[wd].entries += 1;
      weekdayAgg[wd].words += words;
    }

    const entries = yearRows.length;
    const avgWords = entries ? Math.round(totalWords / entries) : 0;

    const { longestStreak, currentStreak } = computeStreaks(dateKeys, now);

    const topTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    let peakHour: number | null = null;
    let peakScore = 0;
    for (let h = 0; h < 24; h++) {
      if (wordsByHour[h] > peakScore) {
        peakScore = wordsByHour[h];
        peakHour = h;
      }
    }
    const peakHourLabel = peakHour === null || entries === 0 ? null : formatHourLabel(peakHour);

    let bestWeekday: string | null = null;
    let bestAvg = 0;
    for (let wd = 0; wd < 7; wd++) {
      const agg = weekdayAgg[wd];
      if (!agg.entries) continue;
      const avg = agg.words / agg.entries;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestWeekday = new Date(2024, 0, 7 + wd).toLocaleDateString(undefined, { weekday: 'long' });
      }
    }

    return {
      year,
      entries,
      words: totalWords,
      avgWords,
      longestStreak,
      currentStreak,
      topTags,
      peakHourLabel,
      bestWeekday,
    };
  },
};


