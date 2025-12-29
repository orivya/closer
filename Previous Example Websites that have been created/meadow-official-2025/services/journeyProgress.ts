import { supabase } from '../src/integrations/supabase/client';

export interface JourneyProgress {
  id: string;
  user_id: string;
  journey_id: string;
  completed_steps: number[];
  created_at: string;
  updated_at: string;
}

export const JourneyProgressService = {
  /**
   * Get progress for a specific journey
   */
  async getProgress(journeyId: string): Promise<JourneyProgress | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await (supabase as any)
      .from('journey_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('journey_id', journeyId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching journey progress:', error);
    }

    return data as JourneyProgress | null;
  },

  /**
   * Get progress for all journeys
   */
  async getAllProgress(): Promise<JourneyProgress[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await (supabase as any)
      .from('journey_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching all journey progress:', error);
      return [];
    }

    return (data as JourneyProgress[]) || [];
  },

  /**
   * Start a journey (create initial progress record)
   */
  async startJourney(journeyId: string): Promise<JourneyProgress | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if already exists
    const existing = await this.getProgress(journeyId);
    if (existing) return existing;

    const { data, error } = await (supabase as any)
      .from('journey_progress')
      .insert({
        user_id: user.id,
        journey_id: journeyId,
        completed_steps: []
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting journey:', error);
      throw error;
    }

    return data as JourneyProgress;
  },

  /**
   * Mark a step as complete
   */
  async completeStep(journeyId: string, stepIndex: number): Promise<JourneyProgress | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get current progress
    let current = await this.getProgress(journeyId);

    // Start journey if not started
    if (!current) {
      current = await this.startJourney(journeyId);
    }

    if (!current) return null;

    // Add step to completed if not already there
    const completedSteps = [...(current.completed_steps || [])];
    if (!completedSteps.includes(stepIndex)) {
      completedSteps.push(stepIndex);
      completedSteps.sort((a, b) => a - b);
    }

    const { data, error } = await (supabase as any)
      .from('journey_progress')
      .update({ completed_steps: completedSteps })
      .eq('id', current.id)
      .select()
      .single();

    if (error) {
      console.error('Error completing step:', error);
      throw error;
    }

    return data as JourneyProgress;
  },

  /**
   * Reset journey progress
   */
  async resetJourney(journeyId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await (supabase as any)
      .from('journey_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('journey_id', journeyId);

    if (error) {
      console.error('Error resetting journey:', error);
      throw error;
    }
  },

  /**
   * Get computed progress stats for a journey
   */
  getProgressStats(progress: JourneyProgress | null, totalDays: number) {
    const completed = progress?.completed_steps?.length || 0;
    const isComplete = completed >= totalDays;
    const percent = totalDays ? Math.round((completed / totalDays) * 100) : 0;
    const currentDay = Math.min(completed + 1, totalDays);
    const dayLabel = isComplete ? 'Complete' : `Day ${currentDay}`;
    const statusLabel = isComplete ? 'Completed' : (completed > 0 ? 'In Progress' : 'Start Here');

    return { completed, total: totalDays, isComplete, percent, currentDay, dayLabel, statusLabel };
  }
};
