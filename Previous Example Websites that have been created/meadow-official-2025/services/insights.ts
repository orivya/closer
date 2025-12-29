/**
 * INSIGHTS SERVICE
 * Handles insight extraction, storage, and retrieval
 */

import { supabase } from '../lib/supabase';
import {
  Insight,
  InsightSource,
  InsightType,
  InsightsListRequest,
  InsightsListResponse,
  CrossEntryAnalysis,
} from '../types/insights';
import { ExtractedInsight } from '../types/essence';

// =====================================================
// INSIGHT EXTRACTION TRIGGERS
// =====================================================

/**
 * Triggers that indicate when to extract insights from a conversation
 */
export interface ExtractionTrigger {
  type: 'message_count' | 'emotional_intensity' | 'contradiction' | 'recurring_mention' | 'breakthrough' | 'topic_shift' | 'uncertainty';
  confidence: number; // 0-1
  context?: string;
}

/**
 * Analyze messages to detect extraction triggers
 * In production, this would call an AI endpoint
 */
export function detectExtractionTriggers(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  depthLevel: string
): ExtractionTrigger[] {
  const triggers: ExtractionTrigger[] = [];
  const userMessages = messages.filter(m => m.role === 'user');

  // Trigger: Message count threshold
  if (userMessages.length >= 4 && userMessages.length % 4 === 0) {
    triggers.push({
      type: 'message_count',
      confidence: 0.7,
      context: `${userMessages.length} user messages exchanged`,
    });
  }

  // Trigger: Emotional intensity keywords
  const emotionalKeywords = ['really', 'always', 'never', 'hate', 'love', 'scared', 'worried', 'frustrated', 'excited', 'overwhelmed'];
  const lastUserMessage = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';
  const emotionalCount = emotionalKeywords.filter(k => lastUserMessage.includes(k)).length;
  if (emotionalCount >= 2) {
    triggers.push({
      type: 'emotional_intensity',
      confidence: 0.6 + (emotionalCount * 0.1),
      context: 'High emotional intensity detected',
    });
  }

  // Trigger: Contradiction detection
  const contradictionPhrases = ['but then again', 'on the other hand', 'part of me', 'i want to but', 'i know but'];
  if (contradictionPhrases.some(p => lastUserMessage.includes(p))) {
    triggers.push({
      type: 'contradiction',
      confidence: 0.75,
      context: 'Internal conflict detected',
    });
  }

  // Trigger: Breakthrough indicators
  const breakthroughPhrases = ['i just realized', 'i never thought of it', 'that makes sense', 'oh wow', 'i see now', 'maybe i'];
  if (breakthroughPhrases.some(p => lastUserMessage.includes(p))) {
    triggers.push({
      type: 'breakthrough',
      confidence: 0.85,
      context: 'Potential breakthrough moment',
    });
  }

  // Trigger: Uncertainty (good for deep mode)
  if (depthLevel === 'deep') {
    const uncertaintyPhrases = ["i don't know", "i'm not sure", "maybe", "possibly", "i think"];
    if (uncertaintyPhrases.some(p => lastUserMessage.includes(p))) {
      triggers.push({
        type: 'uncertainty',
        confidence: 0.65,
        context: 'Exploring uncertainty',
      });
    }
  }

  return triggers;
}

// =====================================================
// MOCK INSIGHT EXTRACTION
// =====================================================

/**
 * Extract insights from conversation messages
 * In production, this would call an AI endpoint
 */
export async function extractInsights(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  depthLevel: string,
  triggers: ExtractionTrigger[]
): Promise<ExtractedInsight[]> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const insights: ExtractedInsight[] = [];
  const userMessages = messages.filter(m => m.role === 'user');
  const messageCount = userMessages.length;

  // Generate summary if enough messages
  if (messageCount >= 3) {
    insights.push({
      type: 'summary',
      content: generateMockSummary(userMessages),
    });
  }

  // Generate focus insight on breakthrough
  if (triggers.some(t => t.type === 'breakthrough')) {
    insights.push({
      type: 'focus',
      content: 'You seem to be discovering something important about how you approach this situation.',
      context: userMessages[userMessages.length - 1]?.content.slice(0, 100),
    });
  }

  // Generate shift insight on contradiction
  if (triggers.some(t => t.type === 'contradiction')) {
    insights.push({
      type: 'shift',
      content: 'A shift in perspective',
      shiftBefore: 'Initial certainty about what you should do',
      shiftAfter: 'Recognizing the complexity and multiple valid paths forward',
    });
  }

  // Generate thread insights if patterns detected
  if (messageCount >= 5) {
    insights.push({
      type: 'thread',
      content: 'This connects to themes you often explore: taking care of yourself while being there for others.',
    });
  }

  // Generate blind spot in deep mode
  if (depthLevel === 'deep' && triggers.some(t => t.type === 'uncertainty')) {
    insights.push({
      type: 'blind_spot',
      content: "There's a question you haven't asked yourself yet: What would you do if you knew you couldn't fail?",
    });
  }

  // Generate action items
  if (messageCount >= 4) {
    insights.push({
      type: 'action',
      content: 'Consider writing about this in your journal to track how your thinking evolves.',
    });
  }

  return insights;
}

/**
 * Generate a mock summary from user messages
 */
function generateMockSummary(userMessages: Array<{ content: string }>): string {
  const topics = [
    'making a decision',
    'understanding your feelings',
    'navigating a relationship',
    'finding clarity',
    'processing an experience',
  ];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];

  return `We've been exploring ${randomTopic}. You've shared openly about what's on your mind, and some patterns are starting to emerge.`;
}

// =====================================================
// DATABASE OPERATIONS
// =====================================================

/**
 * Save an insight to the database
 */
export async function saveInsight(
  insight: Omit<Insight, 'id' | 'createdAt'>
): Promise<Insight | null> {
  const { data, error } = await supabase
    .from('insights')
    .insert({
      user_id: insight.userId,
      source_type: insight.sourceType,
      source_session_id: insight.sourceSessionId,
      source_entry_id: insight.sourceEntryId,
      insight_type: insight.insightType,
      content: insight.content,
      context: insight.context,
      shift_before: insight.shiftBefore,
      shift_after: insight.shiftAfter,
      starred: insight.starred,
      dismissed: insight.dismissed,
      related_insight_ids: insight.relatedInsightIds,
      related_entry_ids: insight.relatedEntryIds,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving insight:', error);
    return null;
  }

  return mapDbInsight(data);
}

/**
 * List insights for a user
 */
export async function listInsights(
  userId: string,
  request: InsightsListRequest = {}
): Promise<InsightsListResponse> {
  let query = supabase
    .from('insights')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Apply filters
  if (request.sourceType) {
    query = query.eq('source_type', request.sourceType);
  }
  if (request.insightType) {
    query = query.eq('insight_type', request.insightType);
  }
  if (request.starred !== undefined) {
    query = query.eq('starred', request.starred);
  }
  if (!request.includeExplored) {
    query = query.is('explored_at', null);
  }

  // Apply pagination
  const limit = request.limit || 20;
  const offset = request.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error listing insights:', error);
    return { insights: [], total: 0, hasMore: false };
  }

  return {
    insights: data?.map(mapDbInsight) || [],
    total: count || 0,
    hasMore: (count || 0) > offset + limit,
  };
}

/**
 * Star or unstar an insight
 */
export async function starInsight(
  insightId: string,
  starred: boolean
): Promise<boolean> {
  const { error } = await supabase
    .from('insights')
    .update({ starred })
    .eq('id', insightId);

  if (error) {
    console.error('Error starring insight:', error);
    return false;
  }

  return true;
}

/**
 * Dismiss an insight
 */
export async function dismissInsight(insightId: string): Promise<boolean> {
  const { error } = await supabase
    .from('insights')
    .update({ dismissed: true })
    .eq('id', insightId);

  if (error) {
    console.error('Error dismissing insight:', error);
    return false;
  }

  return true;
}

/**
 * Mark insight as explored
 */
export async function exploreInsight(insightId: string): Promise<boolean> {
  const { error } = await supabase
    .from('insights')
    .update({ explored_at: new Date().toISOString() })
    .eq('id', insightId);

  if (error) {
    console.error('Error marking insight as explored:', error);
    return false;
  }

  return true;
}

/**
 * Get starred insights for home widget
 */
export async function getStarredInsights(
  userId: string,
  limit: number = 5
): Promise<Insight[]> {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('user_id', userId)
    .eq('starred', true)
    .eq('dismissed', false)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error getting starred insights:', error);
    return [];
  }

  return data?.map(mapDbInsight) || [];
}

/**
 * Get recent insights for a session
 */
export async function getSessionInsights(sessionId: string): Promise<Insight[]> {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('source_session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error getting session insights:', error);
    return [];
  }

  return data?.map(mapDbInsight) || [];
}

// =====================================================
// CROSS-ENTRY ANALYSIS
// =====================================================

/**
 * Perform cross-entry analysis to find themes across journal entries
 * In production, this would call an AI endpoint
 */
export async function analyzeCrossEntryThemes(
  userId: string
): Promise<CrossEntryAnalysis | null> {
  // This would normally fetch recent entries and analyze them with AI
  // For now, return a mock response

  return {
    themes: [
      {
        theme: 'Self-care vs. responsibility to others',
        strength: 0.85,
        entryIds: [],
        firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastSeen: new Date(),
      },
      {
        theme: 'Career transition and uncertainty',
        strength: 0.72,
        entryIds: [],
        firstSeen: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        lastSeen: new Date(),
      },
    ],
    emotionalArc: 'Your recent entries show a pattern of working through uncertainty toward acceptance.',
    unfinishedThreads: [
      'The conversation with your friend that you mentioned wanting to revisit',
      'Your goal of setting better boundaries at work',
    ],
    growthSignals: [
      'You\'re increasingly recognizing your own needs as valid',
      'Your language has shifted from "I should" to "I want"',
    ],
    suggestedPrompts: [
      'What would it look like to fully trust your own judgment here?',
      'If you could go back and talk to yourself a month ago, what would you say?',
    ],
    generatedAt: new Date(),
  };
}

// =====================================================
// HELPERS
// =====================================================

/**
 * Map database row to Insight type
 */
function mapDbInsight(row: any): Insight {
  return {
    id: row.id,
    userId: row.user_id,
    sourceType: row.source_type as InsightSource,
    sourceSessionId: row.source_session_id,
    sourceEntryId: row.source_entry_id,
    insightType: row.insight_type as InsightType,
    content: row.content,
    context: row.context,
    shiftBefore: row.shift_before,
    shiftAfter: row.shift_after,
    starred: row.starred,
    dismissed: row.dismissed,
    exploredAt: row.explored_at ? new Date(row.explored_at) : undefined,
    relatedInsightIds: row.related_insight_ids || [],
    relatedEntryIds: row.related_entry_ids || [],
    createdAt: new Date(row.created_at),
  };
}

export const InsightsService = {
  detectExtractionTriggers,
  extractInsights,
  saveInsight,
  listInsights,
  starInsight,
  dismissInsight,
  exploreInsight,
  getStarredInsights,
  getSessionInsights,
  analyzeCrossEntryThemes,
};

export default InsightsService;
