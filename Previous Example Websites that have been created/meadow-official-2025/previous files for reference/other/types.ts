
export interface Note {
  id: string;
  title: string;
  preview: string;
  content: string;
  date: string;
  time: string;
  wordCount?: number;
  thread?: string;
  category?: string;
  isReflection?: boolean;
  intentionId?: string;
  mood?: string;
  type?: 'text' | 'voice' | 'image';
  tags?: string[];
}

// Database Row Definition
export interface DbEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string | null;
  tags: string[] | null;
  created_at: string;
}

export interface Intention {
  id: string;
  title: string;
  description: string; // The "Why"
  category: 'finance' | 'career' | 'health' | 'growth' | 'relationships';
  status: 'active' | 'paused' | 'achieved';
  entryCount: number;
  lastEntryDate?: string;
  linkedPrompts?: string[];
  insights?: string[];
}

export interface Thread {
  id: string;
  title: string;
  count: number;
  updated: string;
  preview: string;
  color?: string;
}

export interface Insight {
  id: string;
  dateRange: string;
  title: string;
  description: string;
  quote?: string;
  type: 'weekly' | 'standard';
  relatedTopics?: string[]; 
  confidenceScore?: number; 
}

export interface Prompt {
  id: string;
  text: string;
  category: string;
}

export interface JourneyStep {
  day: number;
  title: string;
  subtitle: string;
  questions: string[]; // Rapid fire questions
  prompt: string; // The final deep dive prompt
  status: 'locked' | 'current' | 'completed';
  duration: string;
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  icon: any; // Lucide icon component
  color: string; // Tailwind color reference (e.g. 'sage', 'lavender')
  totalDays: number;
  completedDays: number;
  steps: JourneyStep[];
  isFeatured?: boolean;
}

export interface QuickWrite {
  id: string;
  title: string;
  prompts: string[];
  icon: any;
}

export interface PromptCategory {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: any;
  color: string;
  prompts: string[];
}

export enum ViewState {
  HOME = 'home',
  AUTH = 'auth',           // Login/Signup
  ONBOARDING = 'onboarding', // New User Setup
  JOURNAL = 'journal',
  EXPLORE = 'explore', 
  INSIGHTS = 'insights',
  SETTINGS = 'settings',
  EDITOR = 'editor',
  THREAD_DETAIL = 'thread-detail',
  
  // Journey & Content Views
  JOURNEY_DETAIL = 'journey-detail',
  JOURNEY_SESSION = 'journey-session', 
  PROMPT_LIST = 'prompt-list',
  
  // Toolbox Spaces
  SPACE_MIRROR = 'space-mirror',
  SPACE_DASHBOARD = 'space-dashboard',
  SPACE_DECISION = 'space-decision',
  SPACE_VOICE = 'space-voice',
  SPACE_VAULT = 'space-vault',
  SPACE_INTENTIONS = 'space-intentions'
}
