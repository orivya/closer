/**
 * ESSENCE TYPES
 * Type definitions for the Essence AI companion system
 */

// =====================================================
// DEPTH LEVELS
// =====================================================

/**
 * Conversation depth levels that determine Essence's behavior
 * - vent: Just listen, minimal questions, validation only
 * - reflect: Gentle exploration, summarize, light questions
 * - explore: Probing questions, surface themes, active insights
 * - deep: Unknown unknowns, challenge assumptions, maximum insight
 */
export type DepthLevel = 'vent' | 'reflect' | 'explore' | 'deep';

export interface DepthLevelConfig {
  id: DepthLevel;
  name: string;
  icon: string; // Emoji or icon name
  description: string;
  shortDescription: string;
  insightExtraction: boolean;
  lensVisible: boolean;
  unknownUnknowns: boolean;
}

export const DEPTH_LEVELS: Record<DepthLevel, DepthLevelConfig> = {
  vent: {
    id: 'vent',
    name: 'Vent',
    icon: '🌊',
    description: 'I just need to let it out. Listen without questions.',
    shortDescription: 'Just listen',
    insightExtraction: false,
    lensVisible: false,
    unknownUnknowns: false,
  },
  reflect: {
    id: 'reflect',
    name: 'Reflect',
    icon: '🪞',
    description: 'Help me think through this with gentle questions.',
    shortDescription: 'Think with me',
    insightExtraction: true,
    lensVisible: true,
    unknownUnknowns: false,
  },
  explore: {
    id: 'explore',
    name: 'Explore',
    icon: '🧭',
    description: 'Go deeper. Help me understand what\'s beneath the surface.',
    shortDescription: 'Go deeper',
    insightExtraction: true,
    lensVisible: true,
    unknownUnknowns: false,
  },
  deep: {
    id: 'deep',
    name: 'Dive Deep',
    icon: '🔍',
    description: 'Challenge me. Show me what I might not be seeing.',
    shortDescription: 'Challenge me',
    insightExtraction: true,
    lensVisible: true,
    unknownUnknowns: true,
  },
};

// =====================================================
// INTENT PILLS
// =====================================================

export type IntentId =
  | 'untangle'
  | 'decide'
  | 'reflect'
  | 'plan'
  | 'explore'
  | 'vent'
  | 'process'
  | 'dream'
  | 'gratitude'
  | 'question';

export interface IntentPill {
  id: IntentId;
  label: string;
  prompt: string; // Pre-fill for input
  suggestedDepth: DepthLevel;
}

export const INTENT_PILLS: IntentPill[] = [
  {
    id: 'untangle',
    label: 'Untangle',
    prompt: "I have some thoughts I'd like to untangle...",
    suggestedDepth: 'explore',
  },
  {
    id: 'decide',
    label: 'Decide',
    prompt: "I'm trying to make a decision about...",
    suggestedDepth: 'explore',
  },
  {
    id: 'reflect',
    label: 'Reflect',
    prompt: "I've been reflecting on...",
    suggestedDepth: 'reflect',
  },
  {
    id: 'plan',
    label: 'Plan',
    prompt: "I want to think through a plan for...",
    suggestedDepth: 'reflect',
  },
  {
    id: 'explore',
    label: 'Explore',
    prompt: "I'd like to explore...",
    suggestedDepth: 'explore',
  },
  {
    id: 'vent',
    label: 'Vent',
    prompt: "I just need to get something off my chest...",
    suggestedDepth: 'vent',
  },
  {
    id: 'process',
    label: 'Process',
    prompt: "Something happened that I need to work through...",
    suggestedDepth: 'explore',
  },
  {
    id: 'dream',
    label: 'Dream',
    prompt: "I had a dream I want to explore...",
    suggestedDepth: 'explore',
  },
  {
    id: 'gratitude',
    label: 'Gratitude',
    prompt: "I want to notice what's good right now...",
    suggestedDepth: 'reflect',
  },
  {
    id: 'question',
    label: 'Question',
    prompt: "I have a question I've been sitting with...",
    suggestedDepth: 'deep',
  },
];

// =====================================================
// SESSION TYPES
// =====================================================

export interface EssenceSession {
  id: string;
  userId: string;
  depthLevel: DepthLevel;
  initialIntent?: IntentId;
  startedAt: Date;
  endedAt?: Date;
  messageCount: number;
  summary?: string;
  primaryTheme?: string;
  threadId?: string;
  entryContextId?: string;
}

export interface EssenceMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokenCount?: number;
  sentimentScore?: number;
  createdAt: Date;
}

// =====================================================
// SESSION CONTEXT
// =====================================================

/**
 * Context passed to Essence for a session
 */
export interface SessionContext {
  type: 'insight' | 'entry' | 'thread' | 'decision' | 'dream' | 'fresh';
  sourceId?: string;
  content?: string;
  additionalContext?: string;
}

// =====================================================
// STATE TYPES
// =====================================================

export interface EssenceState {
  session: EssenceSession | null;
  messages: EssenceMessage[];
  isTyping: boolean;
  depth: DepthLevel;
  isLensOpen: boolean;
  sessionContext?: SessionContext;
}

export interface EssenceActions {
  startSession: (depth: DepthLevel, intent?: IntentId, context?: SessionContext) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  endSession: () => Promise<void>;
  setDepth: (depth: DepthLevel) => void;
  toggleLens: () => void;
  clearSession: () => void;
}

// =====================================================
// API TYPES
// =====================================================

export interface StartSessionRequest {
  depthLevel: DepthLevel;
  initialIntent?: IntentId;
  threadId?: string;
  entryContextId?: string;
  context?: SessionContext;
}

export interface StartSessionResponse {
  session: EssenceSession;
}

export interface ChatRequest {
  sessionId: string;
  message: string;
}

export interface ChatResponse {
  message: EssenceMessage;
  insights?: ExtractedInsight[];
  shouldExtract?: boolean;
}

export interface EndSessionRequest {
  sessionId: string;
}

export interface EndSessionResponse {
  summary: string;
  insights: ExtractedInsight[];
}

// =====================================================
// INSIGHT EXTRACTION (from Essence)
// =====================================================

export interface ExtractedInsight {
  type: 'summary' | 'focus' | 'shift' | 'thread' | 'blind_spot' | 'action';
  content: string;
  context?: string;
  shiftBefore?: string;
  shiftAfter?: string;
}

export interface LensState {
  isOpen: boolean;
  summary: string | null;
  focus: ExtractedInsight | null;
  shift: { before: string; after: string } | null;
  threads: ExtractedInsight[];
  blindSpots: ExtractedInsight[];
  actions: string[];
  insightCount: number;
}

// =====================================================
// SESSION HISTORY
// =====================================================

export interface SessionListItem {
  id: string;
  depthLevel: DepthLevel;
  startedAt: Date;
  endedAt?: Date;
  messageCount: number;
  summary?: string;
  primaryTheme?: string;
}

// =====================================================
// STREAMING
// =====================================================

export interface StreamChunk {
  type: 'text' | 'insights' | 'done' | 'error';
  text?: string;
  insights?: ExtractedInsight[];
  error?: string;
}
