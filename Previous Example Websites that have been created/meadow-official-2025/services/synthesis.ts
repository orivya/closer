/**
 * WEEKLY SYNTHESIS SERVICE
 * Handles weekly recap generation and management
 */

import { supabase } from '../lib/supabase';
import { WeeklySynthesis, SynthesisTheme, SynthesisState } from '../types/user-context';

// =====================================================
// SYNTHESIS GENERATION
// =====================================================

/**
 * Get or generate weekly synthesis for a user
 */
export async function getWeeklySynthesis(
  userId: string,
  weekStart: Date
): Promise<WeeklySynthesis | null> {
  const weekStartStr = weekStart.toISOString().split('T')[0];

  // Check for existing synthesis
  const { data: existing } = await supabase
    .from('weekly_synthesis')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start', weekStartStr)
    .single();

  if (existing) {
    return mapDbSynthesis(existing);
  }

  return null;
}

/**
 * Generate a new weekly synthesis
 * In production, this would call an AI Edge Function
 */
export async function generateWeeklySynthesis(
  userId: string,
  weekStart: Date
): Promise<WeeklySynthesis | null> {
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  // Get entries from this week
  const { data: entries } = await supabase
    .from('entries')
    .select('id, title, content, mood, created_at')
    .eq('user_id', userId)
    .gte('created_at', weekStartStr)
    .lt('created_at', weekEndStr)
    .order('created_at', { ascending: true });

  // Get Essence sessions from this week
  const { data: sessions } = await supabase
    .from('essence_sessions')
    .select('id, depth_level, message_count, summary, primary_theme')
    .eq('user_id', userId)
    .gte('started_at', weekStartStr)
    .lt('started_at', weekEndStr);

  // Get insights from this week
  const { data: insights } = await supabase
    .from('insights')
    .select('id, insight_type, content')
    .eq('user_id', userId)
    .gte('created_at', weekStartStr)
    .lt('created_at', weekEndStr);

  // Get todos completed this week
  const { data: completedTodos } = await supabase
    .from('todos')
    .select('id, content')
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('completed_at', weekStartStr)
    .lt('completed_at', weekEndStr);

  // Generate synthesis (mock AI response for now)
  const synthesis = await generateSynthesisContent(
    entries || [],
    sessions || [],
    insights || [],
    completedTodos || []
  );

  // Save to database
  const { data, error } = await supabase
    .from('weekly_synthesis')
    .insert({
      user_id: userId,
      week_start: weekStartStr,
      week_end: weekEndStr,
      entry_count: entries?.length || 0,
      session_count: sessions?.length || 0,
      insight_count: insights?.length || 0,
      todo_completed_count: completedTodos?.length || 0,
      summary: synthesis.summary,
      themes: synthesis.themes,
      emotional_arc: synthesis.emotionalArc,
      key_insights: synthesis.keyInsights,
      growth_observations: synthesis.growthObservations,
      suggested_focus: synthesis.suggestedFocus,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving weekly synthesis:', error);
    return null;
  }

  return mapDbSynthesis(data);
}

/**
 * Generate synthesis content (mock AI)
 */
async function generateSynthesisContent(
  entries: any[],
  sessions: any[],
  insights: any[],
  completedTodos: any[]
): Promise<{
  summary: string;
  themes: SynthesisTheme[];
  emotionalArc: string;
  keyInsights: string[];
  growthObservations: string[];
  suggestedFocus: string;
}> {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data based on activity
  const hasActivity = entries.length > 0 || sessions.length > 0;

  if (!hasActivity) {
    return {
      summary: 'This was a quiet week for reflection. Sometimes stepping back is part of the journey.',
      themes: [],
      emotionalArc: 'No entries to analyze emotional patterns.',
      keyInsights: [],
      growthObservations: [],
      suggestedFocus: 'Consider starting with a simple daily check-in this week.',
    };
  }

  // Generate themes based on content
  const themes: SynthesisTheme[] = [];

  if (entries.length >= 3) {
    themes.push({
      name: 'Consistent Reflection',
      strength: Math.min(1, entries.length / 7),
      description: `You wrote ${entries.length} entries this week, showing commitment to self-reflection.`,
    });
  }

  if (sessions.length >= 2) {
    themes.push({
      name: 'Deep Exploration',
      strength: Math.min(1, sessions.length / 5),
      description: `${sessions.length} conversations with Essence helped you explore your thoughts.`,
    });
  }

  if (completedTodos.length >= 3) {
    themes.push({
      name: 'Taking Action',
      strength: Math.min(1, completedTodos.length / 5),
      description: `You completed ${completedTodos.length} tasks, turning insights into action.`,
    });
  }

  // Analyze moods
  const moods = entries
    .filter(e => e.mood)
    .map(e => e.mood);

  let emotionalArc = 'Your emotional landscape this week showed variety.';
  if (moods.length > 0) {
    const moodCounts = moods.reduce((acc: any, m: string) => {
      acc[m] = (acc[m] || 0) + 1;
      return acc;
    }, {});
    const topMood = Object.entries(moodCounts)
      .sort(([, a]: any, [, b]: any) => b - a)[0]?.[0];
    if (topMood) {
      emotionalArc = `Your dominant mood was "${topMood}". ${getMoodArcMessage(topMood)}`;
    }
  }

  // Key insights
  const keyInsights = insights.slice(0, 3).map(i => i.content);
  if (keyInsights.length === 0) {
    keyInsights.push('Keep journaling - insights emerge from consistent reflection.');
  }

  // Growth observations
  const growthObservations: string[] = [];
  if (entries.length > 0) {
    growthObservations.push('You made time for self-reflection this week.');
  }
  if (sessions.filter((s: any) => s.depth_level === 'deep').length > 0) {
    growthObservations.push('You explored challenging topics in deep mode conversations.');
  }
  if (completedTodos.length > 0) {
    growthObservations.push('You followed through on your intentions.');
  }

  // Suggested focus
  let suggestedFocus = 'Continue your reflection practice and notice what patterns emerge.';
  if (entries.length < 3) {
    suggestedFocus = 'Try writing a brief entry each day, even just a few sentences.';
  } else if (sessions.length === 0) {
    suggestedFocus = 'Consider having a conversation with Essence to explore your thoughts more deeply.';
  } else if (insights.length > 3) {
    suggestedFocus = 'Review your insights and pick one to take action on this week.';
  }

  return {
    summary: generateSummary(entries.length, sessions.length, completedTodos.length),
    themes,
    emotionalArc,
    keyInsights,
    growthObservations,
    suggestedFocus,
  };
}

function generateSummary(
  entryCount: number,
  sessionCount: number,
  todoCount: number
): string {
  const parts: string[] = [];

  if (entryCount > 0) {
    parts.push(`${entryCount} journal ${entryCount === 1 ? 'entry' : 'entries'}`);
  }
  if (sessionCount > 0) {
    parts.push(`${sessionCount} Essence ${sessionCount === 1 ? 'conversation' : 'conversations'}`);
  }
  if (todoCount > 0) {
    parts.push(`${todoCount} completed ${todoCount === 1 ? 'task' : 'tasks'}`);
  }

  if (parts.length === 0) {
    return 'A week of quiet reflection.';
  }

  return `This week included ${parts.join(', ')}. Each moment of reflection adds to your understanding of yourself.`;
}

function getMoodArcMessage(mood: string): string {
  const messages: Record<string, string> = {
    radiant: 'There was a lot of positive energy in your reflections.',
    content: 'You seemed to be in a balanced, peaceful state.',
    steady: 'Your entries showed a grounded, stable mindset.',
    cloudy: 'Some cloudiness came through - and that is perfectly okay.',
    low: 'You navigated some difficult emotions with courage.',
  };
  return messages[mood.toLowerCase()] || 'Your emotional journey this week was unique to you.';
}

// =====================================================
// SYNTHESIS HISTORY
// =====================================================

/**
 * Get synthesis history for a user
 */
export async function getSynthesisHistory(
  userId: string,
  limit: number = 12
): Promise<WeeklySynthesis[]> {
  const { data, error } = await supabase
    .from('weekly_synthesis')
    .select('*')
    .eq('user_id', userId)
    .order('week_start', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting synthesis history:', error);
    return [];
  }

  return data?.map(mapDbSynthesis) || [];
}

/**
 * Get synthesis state for UI
 */
export async function getSynthesisState(userId: string): Promise<SynthesisState> {
  // Get current week start (Sunday)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - dayOfWeek);
  currentWeekStart.setHours(0, 0, 0, 0);

  // Get last week start
  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  // Check for existing syntheses
  const [currentSynthesis, lastSynthesis] = await Promise.all([
    getWeeklySynthesis(userId, currentWeekStart),
    getWeeklySynthesis(userId, lastWeekStart),
  ]);

  // Get recent history
  const history = await getSynthesisHistory(userId, 4);

  return {
    currentWeekStart,
    currentSynthesis,
    lastWeekSynthesis: lastSynthesis,
    recentSyntheses: history,
    hasUnviewedSynthesis: lastSynthesis !== null && !lastSynthesis.viewedAt,
  };
}

/**
 * Mark synthesis as viewed
 */
export async function markSynthesisViewed(synthesisId: string): Promise<boolean> {
  const { error } = await supabase
    .from('weekly_synthesis')
    .update({ viewed_at: new Date().toISOString() })
    .eq('id', synthesisId);

  if (error) {
    console.error('Error marking synthesis as viewed:', error);
    return false;
  }

  return true;
}

// =====================================================
// HELPERS
// =====================================================

function mapDbSynthesis(row: any): WeeklySynthesis {
  return {
    id: row.id,
    userId: row.user_id,
    weekStart: new Date(row.week_start),
    weekEnd: new Date(row.week_end),
    entryCount: row.entry_count,
    sessionCount: row.session_count,
    insightCount: row.insight_count,
    todoCompletedCount: row.todo_completed_count,
    summary: row.summary,
    themes: row.themes || [],
    emotionalArc: row.emotional_arc,
    keyInsights: row.key_insights || [],
    growthObservations: row.growth_observations || [],
    suggestedFocus: row.suggested_focus,
    viewedAt: row.viewed_at ? new Date(row.viewed_at) : undefined,
    createdAt: new Date(row.created_at),
  };
}

export const SynthesisService = {
  getWeeklySynthesis,
  generateWeeklySynthesis,
  getSynthesisHistory,
  getSynthesisState,
  markSynthesisViewed,
};

export default SynthesisService;
