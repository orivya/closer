/**
 * INSIGHT TYPES
 * Type definitions for the insight system
 */

// =====================================================
// INSIGHT CLASSIFICATION
// =====================================================

/**
 * Source of an insight
 * - essence: Extracted during Essence conversation
 * - journal: Extracted from a journal entry
 * - cross_entry: Discovered across multiple entries
 * - journey: From journey reflection
 * - manual: User-created (future)
 */
export type InsightSource = 'essence' | 'journal' | 'cross_entry' | 'journey' | 'manual';

/**
 * Type of insight
 * - summary: What we've touched on (conversation synthesis)
 * - focus: The heart of it (central theme)
 * - shift: A movement (before → after perspective change)
 * - thread: Threads worth holding (recurring themes)
 * - blind_spot: Something unexplored (deep mode only)
 * - connection: Links to other content
 * - action: Suggested to-do
 */
export type InsightType =
  | 'summary'
  | 'focus'
  | 'shift'
  | 'thread'
  | 'blind_spot'
  | 'connection'
  | 'action';

// =====================================================
// CORE INSIGHT TYPE
// =====================================================

export interface Insight {
  id: string;
  userId: string;

  // Source tracking
  sourceType: InsightSource;
  sourceSessionId?: string;
  sourceEntryId?: string;

  // Classification
  insightType: InsightType;

  // Content
  content: string;
  context?: string; // Additional context, source quote

  // For shift type
  shiftBefore?: string;
  shiftAfter?: string;

  // State
  starred: boolean;
  dismissed: boolean;
  exploredAt?: Date;

  // Connections
  relatedInsightIds: string[];
  relatedEntryIds: string[];

  createdAt: Date;
}

// =====================================================
// DISPLAY HELPERS
// =====================================================

export const INSIGHT_TYPE_LABELS: Record<InsightType, string> = {
  summary: 'What We Touched On',
  focus: 'The Heart of It',
  shift: 'A Movement',
  thread: 'Thread Worth Holding',
  blind_spot: 'Something Unexplored',
  connection: 'This Connects To',
  action: 'Next Step',
};

export const INSIGHT_SOURCE_LABELS: Record<InsightSource, string> = {
  essence: 'From Essence',
  journal: 'From Journal',
  cross_entry: 'Across Your Writing',
  journey: 'From Journey',
  manual: 'You Added',
};

// =====================================================
// LENS PANEL STATE
// =====================================================

export interface LensPanelState {
  isOpen: boolean;
  isLoading: boolean;

  // Insight categories
  summary: Insight | null;
  focus: Insight | null;
  shift: Insight | null;
  threads: Insight[];
  blindSpots: Insight[];
  actions: Insight[];

  // Counts
  totalCount: number;
  newCount: number;
}

// =====================================================
// API TYPES
// =====================================================

export interface InsightsListRequest {
  limit?: number;
  offset?: number;
  sourceType?: InsightSource;
  insightType?: InsightType;
  starred?: boolean;
  includeExplored?: boolean;
}

export interface InsightsListResponse {
  insights: Insight[];
  total: number;
  hasMore: boolean;
}

export interface StarInsightRequest {
  insightId: string;
  starred: boolean;
}

export interface DismissInsightRequest {
  insightId: string;
}

export interface ExploreInsightRequest {
  insightId: string;
}

// =====================================================
// CROSS-ENTRY ANALYSIS
// =====================================================

export interface CrossEntryTheme {
  theme: string;
  strength: number; // 0-1
  entryIds: string[];
  firstSeen: Date;
  lastSeen: Date;
}

export interface CrossEntryAnalysis {
  themes: CrossEntryTheme[];
  emotionalArc: string;
  unfinishedThreads: string[];
  growthSignals: string[];
  suggestedPrompts: string[];
  generatedAt: Date;
}

// =====================================================
// INSIGHT EXTRACTION
// =====================================================

export interface ExtractionTrigger {
  type: 'message_count' | 'emotional_intensity' | 'contradiction' | 'recurring_mention' | 'breakthrough' | 'topic_shift' | 'uncertainty';
  confidence: number;
  context?: string;
}

export interface ExtractionRequest {
  sessionId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  depthLevel: string;
  triggers?: ExtractionTrigger[];
}

export interface ExtractionResponse {
  insights: Insight[];
  shouldContinue: boolean;
  nextExtractionAfter?: number; // Message count
}

// =====================================================
// FILTER & SORT
// =====================================================

export type InsightSortBy = 'date' | 'type' | 'source' | 'relevance';

export interface InsightFilters {
  sourceType?: InsightSource | 'all';
  insightType?: InsightType | 'all';
  starred?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}
