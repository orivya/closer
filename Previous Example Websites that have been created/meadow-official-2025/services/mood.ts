import { supabase } from '../src/integrations/supabase/client';

export interface MoodLog {
  id: string;
  user_id: string;
  mood: string;
  intensity: number | null;
  notes: string | null;
  factors: string[] | null;
  entry_id: string | null;
  logged_at: string;
  created_at: string;
}

// Get the start of today in UTC to avoid timezone issues
const getStartOfTodayUTC = () => {
  const now = new Date();
  // Create UTC date for start of today
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
};

// Get date N days ago at start of that day (UTC)
const getStartOfDayUTC = (daysAgo: number = 0) => {
  const now = new Date();
  const target = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, 0, 0, 0, 0));
  return target;
};

export const MoodService = {
  async logMood(mood: string, intensity?: number, notes?: string, factors?: string[], entryId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated to log mood');

    const { data, error } = await supabase
      .from('mood_logs')
      .insert({
        user_id: user.id,
        mood,
        intensity: intensity ?? null,
        notes: notes ?? null,
        factors: factors ?? null,
        entry_id: entryId ?? null,
      })
      .select('*')
      .single();

    if (error) throw error;
    return data as MoodLog;
  },

  async deleteMoodLog(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated to delete mood logs');

    const { error } = await supabase
      .from('mood_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return true;
  },

  async getMoodLogsSince(since: Date): Promise<MoodLog[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', since.toISOString())
      .order('logged_at', { ascending: false });

    if (error) {
      console.error('Error fetching mood logs:', error);
      return [];
    }

    return (data ?? []) as MoodLog[];
  },

  async getMoodLogsLastNDays(days: number): Promise<MoodLog[]> {
    const since = getStartOfDayUTC(days - 1);
    return await this.getMoodLogsSince(since);
  },

  async getTodayMoodLog(): Promise<MoodLog | null> {
    const since = getStartOfTodayUTC();
    const logs = await this.getMoodLogsSince(since);
    return logs[0] ?? null;
  },
};


