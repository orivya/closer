/**
 * GOAL TYPES
 * Type definitions for the goals system with intention linking
 */

// =====================================================
// PRIORITY LEVELS
// =====================================================

export type GoalPriority = 1 | 2 | 3; // 1=high, 2=medium, 3=low

export const GOAL_PRIORITY_LABELS: Record<GoalPriority, string> = {
  1: 'High',
  2: 'Medium',
  3: 'Low',
};

export const GOAL_PRIORITY_COLORS: Record<GoalPriority, string> = {
  1: '#E57373', // Warm coral
  2: '#FFB74D', // Soft orange
  3: '#81C784', // Gentle green
};

// =====================================================
// GOAL SOURCE
// =====================================================

/**
 * Where the goal originated from
 * - manual: User created directly
 * - essence: Suggested by Essence during conversation
 * - insight: Created from an action insight
 * - journal: Extracted from journal entry
 */
export type GoalSource = 'manual' | 'essence' | 'insight' | 'journal';

// =====================================================
// CORE GOAL TYPE
// =====================================================

export interface Goal {
  id: string;
  userId: string;

  // Content
  content: string;
  notes?: string;

  // State
  completed: boolean;
  completedAt?: Date;

  // Connections
  intentionId?: string; // Link to an intention
  sourceInsightId?: string; // If created from insight
  sourceSessionId?: string; // If suggested by Essence
  source: GoalSource;

  // Scheduling
  dueDate?: Date;
  priority?: GoalPriority;

  // Ordering
  sortOrder: number;

  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// GOAL DISPLAY HELPERS
// =====================================================

export interface GoalWithIntention extends Goal {
  intention?: {
    id: string;
    title: string;
    color?: string;
  };
}

export interface GoalGroup {
  label: string;
  goals: GoalWithIntention[];
}

// =====================================================
// GOAL STATE
// =====================================================

export interface GoalsState {
  isLoading: boolean;
  error: string | null;

  // Active goals (not completed)
  activeGoals: GoalWithIntention[];

  // Completed goals (for history)
  completedGoals: GoalWithIntention[];

  // Counts
  activeCount: number;
  completedTodayCount: number;
}

// =====================================================
// API TYPES
// =====================================================

export interface CreateGoalRequest {
  content: string;
  notes?: string;
  intentionId?: string;
  dueDate?: string; // ISO date string
  priority?: GoalPriority;
  source?: GoalSource;
  sourceInsightId?: string;
  sourceSessionId?: string;
}

export interface UpdateGoalRequest {
  goalId: string;
  content?: string;
  notes?: string;
  intentionId?: string | null;
  dueDate?: string | null;
  priority?: GoalPriority | null;
  completed?: boolean;
}

export interface ReorderGoalsRequest {
  goalIds: string[]; // Array of IDs in new order
}

export interface GoalsListRequest {
  includeCompleted?: boolean;
  intentionId?: string;
  limit?: number;
  offset?: number;
}

export interface GoalsListResponse {
  goals: GoalWithIntention[];
  total: number;
  hasMore: boolean;
}

// =====================================================
// HOME WIDGET TYPES
// =====================================================

export interface GoalWidgetState {
  isExpanded: boolean;
  goals: GoalWithIntention[];
  isLoading: boolean;
  quickAddVisible: boolean;
}

// =====================================================
// GOAL FILTERS
// =====================================================

export type GoalFilterBy = 'all' | 'today' | 'overdue' | 'no-date' | 'by-intention';

export interface GoalFilters {
  filterBy: GoalFilterBy;
  intentionId?: string;
  showCompleted: boolean;
}
