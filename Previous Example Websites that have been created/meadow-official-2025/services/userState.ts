import { supabase } from '../src/integrations/supabase/client';

export type MeadowStage = 'SEED' | 'SPROUT' | 'GROW' | 'BLOOM' | 'THRIVE';
export type MeadowDepth = 'light' | 'balanced' | 'deep';
export type MeadowCreativity = 'plain' | 'poetic_light' | 'sensory' | 'story_seed' | 'perspective_shift';

export interface UserState {
  id: string;
  user_id: string;
  stage: MeadowStage;
  depth: MeadowDepth;
  creativity: MeadowCreativity;
  entry_count_7d: number;
  entry_count_30d: number;
  last_entry_at: string | null;
  week_theme: string | null;
  active_thread_ids: string[];
  created_at: string;
  updated_at: string;
}

// Stage thresholds based on entry count
const STAGE_THRESHOLDS = {
  SEED: 0,     // 0-4 entries
  SPROUT: 5,   // 5-14 entries
  GROW: 15,    // 15-29 entries
  BLOOM: 30,   // 30-74 entries
  THRIVE: 75   // 75+ entries
};

// Stage-specific messaging and features
export const STAGE_CONFIG = {
  SEED: {
    label: 'Seed',
    description: 'You\'re planting the seeds of self-awareness',
    encouragement: 'Every entry helps your practice take root.',
    unlockMessage: 'Write your first few entries to start growing.',
    icon: '🌱',
    progress: { current: 0, next: 5 }
  },
  SPROUT: {
    label: 'Sprout',
    description: 'Your practice is taking root',
    encouragement: 'You\'re building momentum. Keep it up!',
    unlockMessage: 'AI reflections are now available in The Mirror.',
    icon: '🌿',
    progress: { current: 5, next: 15 }
  },
  GROW: {
    label: 'Growing',
    description: 'You\'re developing patterns and insights',
    encouragement: 'Patterns are emerging in your writing.',
    unlockMessage: 'Weekly themes are now available.',
    icon: '🌳',
    progress: { current: 15, next: 30 }
  },
  BLOOM: {
    label: 'Blooming',
    description: 'Your practice is flourishing',
    encouragement: 'Your self-awareness is deepening.',
    unlockMessage: 'Advanced insights are now available.',
    icon: '🌸',
    progress: { current: 30, next: 75 }
  },
  THRIVE: {
    label: 'Thriving',
    description: 'You\'ve established a powerful practice',
    encouragement: 'You\'re a master of reflection.',
    unlockMessage: 'All features are unlocked. Keep thriving!',
    icon: '✨',
    progress: { current: 75, next: null }
  }
};

export const UserStateService = {
  /**
   * Calculate stage based on total entry count
   */
  calculateStage(entryCount: number): MeadowStage {
    if (entryCount >= STAGE_THRESHOLDS.THRIVE) return 'THRIVE';
    if (entryCount >= STAGE_THRESHOLDS.BLOOM) return 'BLOOM';
    if (entryCount >= STAGE_THRESHOLDS.GROW) return 'GROW';
    if (entryCount >= STAGE_THRESHOLDS.SPROUT) return 'SPROUT';
    return 'SEED';
  },

  /**
   * Get current user state
   */
  async getUserState(): Promise<UserState | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_state')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user state:', error);
      return null;
    }

    return data as UserState | null;
  },

  /**
   * Update user state (typically called after creating entries)
   */
  async updateUserState(updates: Partial<{
    stage: MeadowStage;
    depth: MeadowDepth;
    creativity: MeadowCreativity;
    entry_count_7d: number;
    entry_count_30d: number;
    last_entry_at: string;
    week_theme: string;
    active_thread_ids: string[];
  }>): Promise<UserState | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_state')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user state:', error);
      return null;
    }

    return data as UserState;
  },

  /**
   * Refresh user state after creating an entry
   * Updates entry counts and potentially promotes stage
   */
  async refreshAfterEntry(): Promise<UserState | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get current entry counts
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [count7d, count30d, totalCount] = await Promise.all([
      supabase
        .from('journal_entries')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo),
      supabase
        .from('journal_entries')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo),
      supabase
        .from('journal_entries')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
    ]);

    const entryCount7d = count7d.count ?? 0;
    const entryCount30d = count30d.count ?? 0;
    const total = totalCount.count ?? 0;
    const newStage = this.calculateStage(total);

    return this.updateUserState({
      entry_count_7d: entryCount7d,
      entry_count_30d: entryCount30d,
      last_entry_at: now.toISOString(),
      stage: newStage
    });
  },

  /**
   * Get stage-specific configuration
   */
  getStageConfig(stage: MeadowStage) {
    return STAGE_CONFIG[stage];
  },

  /**
   * Get progress towards next stage
   */
  getStageProgress(entryCount: number, currentStage: MeadowStage): { progress: number; entriesToNext: number | null } {
    const config = STAGE_CONFIG[currentStage];
    if (!config.progress.next) {
      return { progress: 100, entriesToNext: null };
    }

    const current = config.progress.current;
    const next = config.progress.next;
    const range = next - current;
    const progressInRange = entryCount - current;
    const progress = Math.min(100, Math.round((progressInRange / range) * 100));
    const entriesToNext = Math.max(0, next - entryCount);

    return { progress, entriesToNext };
  }
};
