/**
 * ESSENCE SERVICE
 * Handles Essence session management, messaging, and AI integration
 */

import { supabase } from '../lib/supabase';
import {
  DepthLevel,
  IntentId,
  EssenceSession,
  EssenceMessage,
  SessionContext,
  StartSessionRequest,
  StartSessionResponse,
  ChatRequest,
  ChatResponse,
  EndSessionRequest,
  EndSessionResponse,
  ExtractedInsight,
  SessionListItem,
  LensState,
} from '../types/essence';
import { InsightsService, detectExtractionTriggers, extractInsights } from './insights';

// =====================================================
// SESSION MANAGEMENT
// =====================================================

/**
 * Start a new Essence session
 */
export async function startSession(
  userId: string,
  request: StartSessionRequest
): Promise<StartSessionResponse | null> {
  const { data, error } = await supabase
    .from('essence_sessions')
    .insert({
      user_id: userId,
      depth_level: request.depthLevel,
      initial_intent: request.initialIntent,
      thread_id: request.threadId,
      entry_context_id: request.entryContextId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error starting session:', error);
    return null;
  }

  // Increment usage counter
  await incrementUsage(userId, 'essence_sessions');

  return {
    session: mapDbSession(data),
  };
}

/**
 * End an Essence session
 */
export async function endSession(
  sessionId: string,
  summary?: string,
  primaryTheme?: string
): Promise<EndSessionResponse | null> {
  const { data, error } = await supabase
    .from('essence_sessions')
    .update({
      ended_at: new Date().toISOString(),
      summary,
      primary_theme: primaryTheme,
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('Error ending session:', error);
    return null;
  }

  // Get session insights
  const insights = await InsightsService.getSessionInsights(sessionId);

  return {
    summary: summary || 'Session ended',
    insights: insights.map(i => ({
      type: i.insightType as ExtractedInsight['type'],
      content: i.content,
      context: i.context,
      shiftBefore: i.shiftBefore,
      shiftAfter: i.shiftAfter,
    })),
  };
}

/**
 * Get an active session for a user
 */
export async function getActiveSession(userId: string): Promise<EssenceSession | null> {
  const { data, error } = await supabase
    .from('essence_sessions')
    .select('*')
    .eq('user_id', userId)
    .is('ended_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return mapDbSession(data);
}

/**
 * Get session history for a user
 */
export async function getSessionHistory(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<SessionListItem[]> {
  const { data, error } = await supabase
    .from('essence_sessions')
    .select('id, depth_level, started_at, ended_at, message_count, summary, primary_theme')
    .eq('user_id', userId)
    .not('ended_at', 'is', null)
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error getting session history:', error);
    return [];
  }

  return data?.map(row => ({
    id: row.id,
    depthLevel: row.depth_level as DepthLevel,
    startedAt: new Date(row.started_at),
    endedAt: row.ended_at ? new Date(row.ended_at) : undefined,
    messageCount: row.message_count,
    summary: row.summary,
    primaryTheme: row.primary_theme,
  })) || [];
}

// =====================================================
// MESSAGING
// =====================================================

/**
 * Send a message and get AI response
 * In production, this would call an AI Edge Function
 */
export async function sendMessage(
  request: ChatRequest,
  depthLevel: DepthLevel
): Promise<ChatResponse | null> {
  // Save user message
  const { data: userMessage, error: userError } = await supabase
    .from('essence_messages')
    .insert({
      session_id: request.sessionId,
      role: 'user',
      content: request.message,
    })
    .select()
    .single();

  if (userError) {
    console.error('Error saving user message:', userError);
    return null;
  }

  // Increment message usage
  const session = await getSessionById(request.sessionId);
  if (session) {
    await incrementUsage(session.userId, 'essence_messages');
  }

  // Get conversation history for context
  const messages = await getSessionMessages(request.sessionId);

  // Detect extraction triggers
  const triggers = detectExtractionTriggers(
    messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    depthLevel
  );

  // Generate AI response (mock for now)
  const aiResponse = await generateAIResponse(
    messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    depthLevel
  );

  // Save assistant message
  const { data: assistantMessage, error: assistantError } = await supabase
    .from('essence_messages')
    .insert({
      session_id: request.sessionId,
      role: 'assistant',
      content: aiResponse,
    })
    .select()
    .single();

  if (assistantError) {
    console.error('Error saving assistant message:', assistantError);
    return null;
  }

  // Check if we should extract insights
  const shouldExtract = triggers.length > 0 && triggers.some(t => t.confidence > 0.7);
  let insights: ExtractedInsight[] = [];

  if (shouldExtract) {
    insights = await extractInsights(
      [...messages, { role: 'assistant' as const, content: aiResponse }].map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      depthLevel,
      triggers
    );
  }

  return {
    message: mapDbMessage(assistantMessage),
    insights,
    shouldExtract,
  };
}

/**
 * Get all messages for a session
 */
export async function getSessionMessages(sessionId: string): Promise<EssenceMessage[]> {
  const { data, error } = await supabase
    .from('essence_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error getting session messages:', error);
    return [];
  }

  return data?.map(mapDbMessage) || [];
}

/**
 * Generate AI response based on depth level
 * In production, this would call an AI Edge Function
 */
async function generateAIResponse(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  depthLevel: DepthLevel
): Promise<string> {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 800));

  const userMessages = messages.filter(m => m.role === 'user');
  const lastMessage = userMessages[userMessages.length - 1]?.content.toLowerCase() || '';

  // Depth-specific responses
  const responses = getDepthResponses(depthLevel, lastMessage, messages.length);
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Get responses appropriate for the depth level
 */
function getDepthResponses(
  depth: DepthLevel,
  lastMessage: string,
  messageCount: number
): string[] {
  switch (depth) {
    case 'vent':
      return [
        "I hear you. That sounds really hard.",
        "Take your time. I'm here.",
        "It makes sense you'd feel that way.",
        "Let it out. There's no rush.",
        "I'm with you.",
      ];

    case 'reflect':
      if (messageCount < 4) {
        return [
          "Tell me more about that.",
          "What feels most important about this to you?",
          "How long have you been sitting with this?",
          "What does this bring up for you?",
        ];
      }
      return [
        "I notice something in what you're sharing. What part of this feels most alive right now?",
        "If you had to name one thing you're really trying to figure out, what would it be?",
        "What would it look like if this worked out the way you hoped?",
        "What does your gut tell you, even if your head disagrees?",
      ];

    case 'explore':
      if (lastMessage.includes('i don\'t know') || lastMessage.includes('not sure')) {
        return [
          "That uncertainty is information too. What does the not-knowing feel like?",
          "Sometimes 'I don't know' is the most honest starting point. Let's sit with it.",
          "If you did know, even just a little bit, what might it be?",
        ];
      }
      return [
        "Let's go deeper. What's underneath that?",
        "I'm curious about the pattern here. Does this connect to anything else in your life?",
        "What would you tell a friend who came to you with exactly this?",
        "What are you not saying out loud yet?",
        "If you imagine yourself a year from now, looking back at this moment, what do you see?",
      ];

    case 'deep':
      return [
        "Here's what I'm noticing: there might be something you're protecting yourself from seeing. What is it?",
        "Let's try something. What if everything you've just told me is true, AND something else is also true that you haven't said?",
        "I want to ask you a hard question. What would change if you stopped needing this to make sense?",
        "What's the question you've been avoiding?",
        "If you were completely honest with yourself right now, what would you admit?",
        "There's something you keep circling around. What would it cost you to name it directly?",
      ];
  }
}

// =====================================================
// LENS STATE MANAGEMENT
// =====================================================

/**
 * Build lens state from extracted insights
 */
export function buildLensState(insights: ExtractedInsight[]): Partial<LensState> {
  const state: Partial<LensState> = {
    summary: null,
    focus: null,
    shift: null,
    threads: [],
    blindSpots: [],
    actions: [],
    insightCount: insights.length,
  };

  for (const insight of insights) {
    switch (insight.type) {
      case 'summary':
        state.summary = insight.content;
        break;
      case 'focus':
        state.focus = insight;
        break;
      case 'shift':
        if (insight.shiftBefore && insight.shiftAfter) {
          state.shift = {
            before: insight.shiftBefore,
            after: insight.shiftAfter,
          };
        }
        break;
      case 'thread':
        state.threads = [...(state.threads || []), insight];
        break;
      case 'blind_spot':
        state.blindSpots = [...(state.blindSpots || []), insight];
        break;
      case 'action':
        state.actions = [...(state.actions || []), insight.content];
        break;
    }
  }

  return state;
}

// =====================================================
// USAGE TRACKING
// =====================================================

/**
 * Increment usage counter for rate limiting
 */
async function incrementUsage(userId: string, field: string): Promise<void> {
  try {
    await supabase.rpc('increment_usage', {
      p_user_id: userId,
      p_field: field,
    });
  } catch (error) {
    console.error('Error incrementing usage:', error);
  }
}

/**
 * Check if user is within usage limits
 */
export async function checkUsageLimits(
  userId: string,
  tier: 'free' | 'pro' | 'premium'
): Promise<{ withinLimits: boolean; usage: any; limits: any }> {
  const { data: usage } = await supabase.rpc('get_current_usage', {
    p_user_id: userId,
  });

  const limits = {
    free: { essenceSessions: 5, essenceMessages: 50 },
    pro: { essenceSessions: 30, essenceMessages: 500 },
    premium: { essenceSessions: -1, essenceMessages: -1 }, // Unlimited
  }[tier];

  const withinLimits =
    limits.essenceSessions === -1 ||
    (usage?.essence_sessions || 0) < limits.essenceSessions;

  return { withinLimits, usage, limits };
}

// =====================================================
// HELPERS
// =====================================================

/**
 * Get session by ID
 */
async function getSessionById(sessionId: string): Promise<EssenceSession | null> {
  const { data, error } = await supabase
    .from('essence_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapDbSession(data);
}

/**
 * Map database row to EssenceSession
 */
function mapDbSession(row: any): EssenceSession {
  return {
    id: row.id,
    userId: row.user_id,
    depthLevel: row.depth_level as DepthLevel,
    initialIntent: row.initial_intent as IntentId | undefined,
    startedAt: new Date(row.started_at),
    endedAt: row.ended_at ? new Date(row.ended_at) : undefined,
    messageCount: row.message_count,
    summary: row.summary,
    primaryTheme: row.primary_theme,
    threadId: row.thread_id,
    entryContextId: row.entry_context_id,
  };
}

/**
 * Map database row to EssenceMessage
 */
function mapDbMessage(row: any): EssenceMessage {
  return {
    id: row.id,
    sessionId: row.session_id,
    role: row.role as 'user' | 'assistant' | 'system',
    content: row.content,
    tokenCount: row.token_count,
    sentimentScore: row.sentiment_score,
    createdAt: new Date(row.created_at),
  };
}

export const EssenceService = {
  startSession,
  endSession,
  getActiveSession,
  getSessionHistory,
  sendMessage,
  getSessionMessages,
  buildLensState,
  checkUsageLimits,
};

export default EssenceService;
