/**
 * USER CONTEXT TYPES
 * Type definitions for user context, growth stages, and AI personalization
 */

// =====================================================
// GROWTH STAGES
// =====================================================

/**
 * User's growth stage progression
 * Seed → Sprout → Sapling → Tree → Thrive
 */
export type GrowthStage = 'seed' | 'sprout' | 'sapling' | 'tree' | 'thrive';

export interface GrowthStageConfig {
  id: GrowthStage;
  name: string;
  description: string;
  icon: string;
  minEntries: number; // Minimum entries to reach this stage
  minSessions: number; // Minimum Essence sessions
  minInsights: number; // Minimum saved insights
  unlocks: string[]; // Features unlocked at this stage
}

export const GROWTH_STAGES: Record<GrowthStage, GrowthStageConfig> = {
  seed: {
    id: 'seed',
    name: 'Seed',
    description: 'Just beginning your journey',
    icon: '🌱',
    minEntries: 0,
    minSessions: 0,
    minInsights: 0,
    unlocks: ['basic_journaling', 'essence_reflect'],
  },
  sprout: {
    id: 'sprout',
    name: 'Sprout',
    description: 'Taking root and growing',
    icon: '🌿',
    minEntries: 5,
    minSessions: 2,
    minInsights: 1,
    unlocks: ['threads', 'essence_explore', 'weekly_synthesis'],
  },
  sapling: {
    id: 'sapling',
    name: 'Sapling',
    description: 'Branching out',
    icon: '🌳',
    minEntries: 15,
    minSessions: 5,
    minInsights: 5,
    unlocks: ['cross_entry_analysis', 'theme_tracking'],
  },
  tree: {
    id: 'tree',
    name: 'Tree',
    description: 'Strong and grounded',
    icon: '🌲',
    minEntries: 30,
    minSessions: 10,
    minInsights: 15,
    unlocks: ['essence_deep', 'unknown_unknowns', 'advanced_insights'],
  },
  thrive: {
    id: 'thrive',
    name: 'Thrive',
    description: 'Flourishing in self-awareness',
    icon: '✨',
    minEntries: 50,
    minSessions: 20,
    minInsights: 30,
    unlocks: ['all_features', 'mentor_mode'],
  },
};

// =====================================================
// MOOD TRACKING
// =====================================================

export type MoodTrend = 'improving' | 'stable' | 'declining' | 'unknown';

export const MOOD_TREND_LABELS: Record<MoodTrend, string> = {
  improving: 'On an upswing',
  stable: 'Steady',
  declining: 'Working through something',
  unknown: 'Still learning your patterns',
};

// =====================================================
// ACTIVE THEMES
// =====================================================

export interface ActiveTheme {
  theme: string;
  strength: number; // 0-1
  lastSeen: Date;
  entryCount: number;
}

// =====================================================
// USER CONTEXT
// =====================================================

export interface UserContext {
  userId: string;

  // Growth progression
  growthStage: GrowthStage;
  stageUpdatedAt: Date;

  // Activity metrics
  totalEntries: number;
  totalEssenceSessions: number;
  totalInsightsSaved: number;
  currentStreak: number;
  longestStreak: number;

  // Computed themes
  activeThemes: ActiveTheme[];

  // Mood
  recentMoodTrend: MoodTrend;

  // Learned preferences
  preferredDepth?: string;
  typicalSessionLength?: number; // Minutes

  // Activity timestamps
  lastEntryAt?: Date;
  lastSessionAt?: Date;
  lastActiveAt?: Date;

  // AI context
  contextSummary?: string;
  contextSummaryUpdatedAt?: Date;

  updatedAt: Date;
}

// =====================================================
// CONTEXT FOR AI PROMPTS
// =====================================================

/**
 * Lightweight context injected into AI prompts
 */
export interface AIContextPayload {
  growthStage: GrowthStage;
  activeThemes: string[]; // Just theme names
  moodTrend: MoodTrend;
  entryCount: number;
  sessionCount: number;
  currentStreak: number;
  recentTopics?: string[]; // From recent entries/sessions
  contextSummary?: string;
}

// =====================================================
// USAGE TRACKING
// =====================================================

export interface UserUsage {
  id: string;
  userId: string;
  periodStart: Date; // First of month

  // Counters
  essenceSessions: number;
  essenceMessages: number;
  insightExtractions: number;
  crossEntryAnalyses: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface UsageLimits {
  essenceSessions: number;
  essenceMessages: number;
  insightExtractions: number;
  crossEntryAnalyses: number;
}

export const FREE_TIER_LIMITS: UsageLimits = {
  essenceSessions: 5,
  essenceMessages: 50,
  insightExtractions: 10,
  crossEntryAnalyses: 2,
};

export const PRO_TIER_LIMITS: UsageLimits = {
  essenceSessions: 30,
  essenceMessages: 500,
  insightExtractions: 100,
  crossEntryAnalyses: 10,
};

export const PREMIUM_TIER_LIMITS: UsageLimits = {
  essenceSessions: -1, // Unlimited
  essenceMessages: -1,
  insightExtractions: -1,
  crossEntryAnalyses: -1,
};

// =====================================================
// WEEKLY SYNTHESIS
// =====================================================

export type SynthesisPeriod = 'weekly' | 'monthly';

export interface SynthesisTheme {
  name: string;
  strength: number; // 0-1
  description: string;
}

export interface WeeklySynthesis {
  id: string;
  userId: string;

  // Period
  weekStart: Date;
  weekEnd: Date;

  // Activity counts
  entryCount: number;
  sessionCount: number;
  insightCount: number;
  todoCompletedCount: number;

  // Content
  summary: string;
  themes: SynthesisTheme[];
  emotionalArc?: string;
  keyInsights: string[];
  growthObservations: string[];
  suggestedFocus?: string;

  // State
  viewedAt?: Date;

  createdAt: Date;
}

export interface SynthesisState {
  currentWeekStart: Date;
  currentSynthesis: WeeklySynthesis | null;
  lastWeekSynthesis: WeeklySynthesis | null;
  recentSyntheses: WeeklySynthesis[];
  hasUnviewedSynthesis: boolean;
}

// =====================================================
// API TYPES
// =====================================================

export interface GetUserContextResponse {
  context: UserContext;
  usage: UserUsage;
  limits: UsageLimits;
  isWithinLimits: boolean;
}

export interface UpdateGrowthStageRequest {
  newStage: GrowthStage;
}

export interface GetSynthesisRequest {
  periodType: SynthesisPeriod;
  periodStart?: string; // ISO date, defaults to current period
}

export interface GenerateSynthesisRequest {
  periodType: SynthesisPeriod;
  forceRegenerate?: boolean;
}
