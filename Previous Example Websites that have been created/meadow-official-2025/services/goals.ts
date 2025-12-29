/**
 * GOALS SERVICE
 * Handles goal CRUD operations with intention linking
 */

import { supabase } from '../lib/supabase';
import {
  Goal,
  GoalWithIntention,
  GoalPriority,
  GoalSource,
  CreateGoalRequest,
  UpdateGoalRequest,
  GoalsListRequest,
  GoalsListResponse,
} from '../types/goals';

// =====================================================
// CRUD OPERATIONS
// =====================================================

/**
 * Create a new goal
 */
export async function createGoal(
  userId: string,
  request: CreateGoalRequest
): Promise<Goal | null> {
  // Get the highest sort order for the user
  const { data: lastGoal } = await supabase
    .from('goals')
    .select('sort_order')
    .eq('user_id', userId)
    .eq('completed', false)
    .order('sort_order', { ascending: false })
    .limit(1)
    .single();

  const nextSortOrder = (lastGoal?.sort_order || 0) + 1;

  const { data, error } = await supabase
    .from('goals')
    .insert({
      user_id: userId,
      content: request.content,
      notes: request.notes,
      intention_id: request.intentionId,
      due_date: request.dueDate,
      priority: request.priority,
      source_insight_id: request.sourceInsightId,
      source_session_id: request.sourceSessionId,
      sort_order: nextSortOrder,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating goal:', error);
    return null;
  }

  return mapDbGoal(data);
}

/**
 * Update an existing goal
 */
export async function updateGoal(
  request: UpdateGoalRequest
): Promise<Goal | null> {
  const updates: any = {};

  if (request.content !== undefined) updates.content = request.content;
  if (request.notes !== undefined) updates.notes = request.notes;
  if (request.intentionId !== undefined) updates.intention_id = request.intentionId;
  if (request.dueDate !== undefined) updates.due_date = request.dueDate;
  if (request.priority !== undefined) updates.priority = request.priority;
  if (request.completed !== undefined) {
    updates.completed = request.completed;
    updates.completed_at = request.completed ? new Date().toISOString() : null;
  }

  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', request.goalId)
    .select()
    .single();

  if (error) {
    console.error('Error updating goal:', error);
    return null;
  }

  return mapDbGoal(data);
}

/**
 * Delete a goal
 */
export async function deleteGoal(goalId: string): Promise<boolean> {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId);

  if (error) {
    console.error('Error deleting goal:', error);
    return false;
  }

  return true;
}

/**
 * Toggle goal completion
 */
export async function toggleGoal(goalId: string): Promise<Goal | null> {
  // First get current state
  const { data: current } = await supabase
    .from('goals')
    .select('completed')
    .eq('id', goalId)
    .single();

  if (!current) return null;

  const newCompleted = !current.completed;

  const { data, error } = await supabase
    .from('goals')
    .update({
      completed: newCompleted,
      completed_at: newCompleted ? new Date().toISOString() : null,
    })
    .eq('id', goalId)
    .select()
    .single();

  if (error) {
    console.error('Error toggling goal:', error);
    return null;
  }

  return mapDbGoal(data);
}

// =====================================================
// LIST OPERATIONS
// =====================================================

/**
 * List goals for a user with optional filters
 */
export async function listGoals(
  userId: string,
  request: GoalsListRequest = {}
): Promise<GoalsListResponse> {
  let query = supabase
    .from('goals')
    .select(`
      *,
      intentions:intention_id (id, title, category)
    `, { count: 'exact' })
    .eq('user_id', userId)
    .order('sort_order', { ascending: true });

  // Apply filters
  if (!request.includeCompleted) {
    query = query.eq('completed', false);
  }
  if (request.intentionId) {
    query = query.eq('intention_id', request.intentionId);
  }

  // Apply pagination
  const limit = request.limit || 50;
  const offset = request.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error listing goals:', error);
    return { goals: [], total: 0, hasMore: false };
  }

  return {
    goals: data?.map(mapDbGoalWithIntention) || [],
    total: count || 0,
    hasMore: (count || 0) > offset + limit,
  };
}

/**
 * Get active goals for home widget
 */
export async function getActiveGoals(
  userId: string,
  limit: number = 5
): Promise<GoalWithIntention[]> {
  const { data, error } = await supabase
    .from('goals')
    .select(`
      *,
      intentions:intention_id (id, title, category)
    `)
    .eq('user_id', userId)
    .eq('completed', false)
    .order('sort_order', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error getting active goals:', error);
    return [];
  }

  return data?.map(mapDbGoalWithIntention) || [];
}

/**
 * Get goals completed today
 */
export async function getCompletedToday(userId: string): Promise<GoalWithIntention[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('goals')
    .select(`
      *,
      intentions:intention_id (id, title, category)
    `)
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('completed_at', today.toISOString())
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Error getting completed goals:', error);
    return [];
  }

  return data?.map(mapDbGoalWithIntention) || [];
}

/**
 * Get goals by intention
 */
export async function getGoalsByIntention(
  userId: string,
  intentionId: string
): Promise<GoalWithIntention[]> {
  const { data, error } = await supabase
    .from('goals')
    .select(`
      *,
      intentions:intention_id (id, title, category)
    `)
    .eq('user_id', userId)
    .eq('intention_id', intentionId)
    .order('completed', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error getting goals by intention:', error);
    return [];
  }

  return data?.map(mapDbGoalWithIntention) || [];
}

// =====================================================
// REORDERING
// =====================================================

/**
 * Reorder goals
 */
export async function reorderGoals(
  userId: string,
  goalIds: string[]
): Promise<boolean> {
  try {
    // Update sort order for each goal
    const updates = goalIds.map((id, index) => ({
      id,
      user_id: userId,
      sort_order: index + 1,
    }));

    for (const update of updates) {
      await supabase
        .from('goals')
        .update({ sort_order: update.sort_order })
        .eq('id', update.id)
        .eq('user_id', update.user_id);
    }

    return true;
  } catch (error) {
    console.error('Error reordering goals:', error);
    return false;
  }
}

// =====================================================
// QUICK ACTIONS
// =====================================================

/**
 * Create goal from insight action
 */
export async function createGoalFromInsight(
  userId: string,
  insightId: string,
  sessionId: string,
  content: string
): Promise<Goal | null> {
  return createGoal(userId, {
    content,
    source: 'insight',
    sourceInsightId: insightId,
    sourceSessionId: sessionId,
  });
}

/**
 * Get goal counts for stats
 */
export async function getGoalCounts(userId: string): Promise<{
  active: number;
  completedToday: number;
  completedThisWeek: number;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());

  // Get active count
  const { count: activeCount } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', false);

  // Get completed today count
  const { count: completedTodayCount } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('completed_at', today.toISOString());

  // Get completed this week count
  const { count: completedWeekCount } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true)
    .gte('completed_at', weekStart.toISOString());

  return {
    active: activeCount || 0,
    completedToday: completedTodayCount || 0,
    completedThisWeek: completedWeekCount || 0,
  };
}

// =====================================================
// HELPERS
// =====================================================

/**
 * Map database row to Goal
 */
function mapDbGoal(row: any): Goal {
  return {
    id: row.id,
    userId: row.user_id,
    content: row.content,
    notes: row.notes,
    completed: row.completed,
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    intentionId: row.intention_id,
    sourceInsightId: row.source_insight_id,
    sourceSessionId: row.source_session_id,
    source: row.source_insight_id ? 'insight' : row.source_session_id ? 'essence' : 'manual',
    dueDate: row.due_date ? new Date(row.due_date) : undefined,
    priority: row.priority as GoalPriority | undefined,
    sortOrder: row.sort_order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Map database row with intention to GoalWithIntention
 */
function mapDbGoalWithIntention(row: any): GoalWithIntention {
  const goal = mapDbGoal(row);
  return {
    ...goal,
    intention: row.intentions ? {
      id: row.intentions.id,
      title: row.intentions.title,
      color: getCategoryColor(row.intentions.category),
    } : undefined,
  };
}

/**
 * Get color for intention category
 */
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    finance: '#F59E0B',
    career: '#3B82F6',
    health: '#10B981',
    growth: '#8B5CF6',
    relationships: '#EC4899',
  };
  return colors[category] || '#6B7280';
}

export const GoalsService = {
  createGoal,
  updateGoal,
  deleteGoal,
  toggleGoal,
  listGoals,
  getActiveGoals,
  getCompletedToday,
  getGoalsByIntention,
  reorderGoals,
  createGoalFromInsight,
  getGoalCounts,
};

export default GoalsService;
