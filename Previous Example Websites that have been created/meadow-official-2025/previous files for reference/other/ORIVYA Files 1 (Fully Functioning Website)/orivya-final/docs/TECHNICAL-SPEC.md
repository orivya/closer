# ORIVYA V1 — Technical Specification

## Overview

This document provides the technical specifications needed to implement ORIVYA as a production application. It covers data models, API structure, state management patterns, and integration requirements.

---

## 1. Data Models

### 1.1 User

```typescript
interface User {
  id: string;                    // UUID
  email: string;
  displayName: string;
  avatarUrl?: string;
  timezone: string;              // e.g., "America/New_York"
  createdAt: Date;
  updatedAt: Date;
  
  // Subscription
  plan: 'free' | 'pro';
  planExpiresAt?: Date;
  
  // Stats (computed)
  totalNotes: number;
  totalThreads: number;
  currentStreak: number;
  longestStreak: number;
  
  // Settings
  preferences: UserPreferences;
}

interface UserPreferences {
  // Writing
  defaultCategory: NoteCategory;
  showWordCount: boolean;
  autosaveInterval: number;      // milliseconds, default 2000
  
  // Notifications
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;     // "09:00"
  eveningReflectionEnabled: boolean;
  eveningReflectionTime: string; // "21:00"
  reminderDays: number[];        // [0,1,2,3,4,5,6] (Sun-Sat)
  
  // AI
  aiInsightsEnabled: boolean;
  weeklyDigestEnabled: boolean;
  
  // Display
  theme: 'dark' | 'light' | 'system';
  fontScale: number;             // 0.875 to 1.25
  reducedMotion: boolean;
  
  // Privacy
  analyticsEnabled: boolean;
  crashReportsEnabled: boolean;
}
```

### 1.2 Note

```typescript
interface Note {
  id: string;                    // UUID
  userId: string;
  
  // Content
  title?: string;                // Auto-generated if empty
  body: string;                  // Markdown or plain text
  bodyPlain: string;             // Stripped for search
  wordCount: number;
  
  // Organization
  category: NoteCategory;
  threadId?: string;
  goalIds: string[];
  tags: string[];                // User-defined tags
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Status
  status: 'active' | 'archived' | 'deleted';
  archivedAt?: Date;
  deletedAt?: Date;              // Soft delete, purge after 30 days
  
  // AI Analysis (Pro feature)
  aiAnalysis?: NoteAnalysis;
  aiAnalyzedAt?: Date;
  
  // Sync
  localId?: string;              // For offline-first
  syncStatus: 'synced' | 'pending' | 'error';
  version: number;               // Optimistic locking
}

type NoteCategory = 'personal' | 'work' | 'relationships' | 'health' | 'uncategorized';

interface NoteAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  sentimentScore: number;        // -1 to 1
  themes: string[];              // ["career", "growth", "uncertainty"]
  keyPhrases: string[];
  suggestedThreads: string[];    // Thread IDs
  suggestedGoals: string[];      // Goal IDs
}
```

### 1.3 Thread

```typescript
interface Thread {
  id: string;
  userId: string;
  
  // Content
  title: string;
  description?: string;
  color: ThreadColor;
  icon: ThreadIcon;
  
  // Status
  status: 'active' | 'resolved' | 'archived';
  resolvedAt?: Date;
  resolutionNote?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Computed
  noteCount: number;
  lastNoteAt?: Date;
  
  // AI Summary (Pro feature)
  aiSummary?: string;
  aiSummaryUpdatedAt?: Date;
}

type ThreadColor = 'sage' | 'blue' | 'purple' | 'amber' | 'rose' | 'gray';
type ThreadIcon = 'thread' | 'briefcase' | 'heart' | 'star' | 'flag' | 'bookmark';
```

### 1.4 Goal

```typescript
interface Goal {
  id: string;
  userId: string;
  
  // Content
  title: string;
  description?: string;
  targetDate?: Date;
  
  // Progress
  status: 'active' | 'achieved' | 'abandoned';
  achievedAt?: Date;
  
  // Milestones
  milestones: Milestone[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Computed
  linkedNoteCount: number;
  lastNoteAt?: Date;
  
  // AI Observations (Pro feature)
  aiObservations: string[];
  aiObservationsUpdatedAt?: Date;
}

interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: Date;
  order: number;
}
```

### 1.5 Insight

```typescript
interface Insight {
  id: string;
  userId: string;
  
  // Content
  type: InsightType;
  title: string;
  body: string;
  
  // Source
  sourceNoteIds: string[];
  sourceThreadIds: string[];
  
  // Status
  status: 'new' | 'viewed' | 'saved' | 'dismissed';
  viewedAt?: Date;
  savedAt?: Date;
  
  // Metadata
  generatedAt: Date;
  expiresAt?: Date;              // Ephemeral insights expire
}

type InsightType = 
  | 'pattern'           // Recurring theme detected
  | 'milestone'         // Goal progress
  | 'connection'        // Notes that relate
  | 'reflection'        // Suggested reflection
  | 'streak'            // Writing streak
  | 'weekly_summary';   // Weekly digest
```

### 1.6 Prompt

```typescript
interface Prompt {
  id: string;
  
  // Content
  text: string;
  followUp?: string;
  
  // Categorization
  category: PromptCategory;
  tags: string[];
  
  // Usage
  isDaily: boolean;              // Can appear as daily prompt
  depth: 'quick' | 'medium' | 'deep';
  estimatedMinutes: number;
  
  // Metadata
  usageCount: number;            // Global usage
  lastUsedAt?: Date;             // Per user
}

type PromptCategory = 
  | 'gratitude'
  | 'self_discovery'
  | 'relationships'
  | 'career'
  | 'emotions'
  | 'goals'
  | 'creativity'
  | 'mindfulness';
```

---

## 2. API Endpoints

### 2.1 Authentication

```
POST   /auth/register           Create account
POST   /auth/login              Email/password login
POST   /auth/login/social       OAuth login (Google, Apple)
POST   /auth/logout             End session
POST   /auth/refresh            Refresh access token
POST   /auth/forgot-password    Request password reset
POST   /auth/reset-password     Complete password reset
DELETE /auth/account            Delete account (with confirmation)
```

### 2.2 Notes

```
GET    /notes                   List notes (paginated, filterable)
POST   /notes                   Create note
GET    /notes/:id               Get single note
PATCH  /notes/:id               Update note
DELETE /notes/:id               Soft delete note

POST   /notes/:id/archive       Archive note
POST   /notes/:id/restore       Restore from archive/trash
POST   /notes/:id/analyze       Trigger AI analysis (Pro)

GET    /notes/search            Full-text search
GET    /notes/export            Export all notes
```

**Query Parameters for GET /notes:**
```
?status=active|archived|deleted
?category=personal|work|relationships|health
?threadId=uuid
?goalId=uuid
?from=2024-01-01
?to=2024-12-31
?sort=createdAt|updatedAt
?order=asc|desc
?page=1
?limit=20
```

### 2.3 Threads

```
GET    /threads                 List threads
POST   /threads                 Create thread
GET    /threads/:id             Get thread with notes
PATCH  /threads/:id             Update thread
DELETE /threads/:id             Delete thread

POST   /threads/:id/resolve     Mark as resolved
POST   /threads/:id/reopen      Reopen resolved thread
POST   /threads/:id/summarize   Generate AI summary (Pro)
```

### 2.4 Goals

```
GET    /goals                   List goals
POST   /goals                   Create goal
GET    /goals/:id               Get goal with linked notes
PATCH  /goals/:id               Update goal
DELETE /goals/:id               Delete goal

POST   /goals/:id/achieve       Mark as achieved
POST   /goals/:id/abandon       Mark as abandoned
POST   /goals/:id/milestones    Add milestone
PATCH  /goals/:id/milestones/:mid   Update milestone
DELETE /goals/:id/milestones/:mid   Delete milestone
```

### 2.5 Insights

```
GET    /insights                List insights
GET    /insights/:id            Get insight detail
PATCH  /insights/:id            Update status (view, save, dismiss)

POST   /insights/generate       Trigger insight generation (Pro)
GET    /insights/weekly         Get weekly summary (Pro)
```

### 2.6 Prompts

```
GET    /prompts                 List prompts (by category)
GET    /prompts/daily           Get today's daily prompt
GET    /prompts/random          Get random prompt
POST   /prompts/:id/use         Mark prompt as used
```

### 2.7 User

```
GET    /user                    Get current user
PATCH  /user                    Update profile
PATCH  /user/preferences        Update preferences
GET    /user/stats              Get user statistics
GET    /user/export             Export all user data
```

### 2.8 Sync (Offline Support)

```
POST   /sync/push               Push local changes
POST   /sync/pull               Pull remote changes
GET    /sync/status             Get sync status
```

---

## 3. State Management

### 3.1 Recommended Structure (Zustand/Jotai)

```typescript
// stores/notes.ts
interface NotesState {
  // Data
  notes: Map<string, Note>;
  notesByThread: Map<string, string[]>;
  notesByGoal: Map<string, string[]>;
  
  // UI State
  selectedNoteId: string | null;
  filterCategory: NoteCategory | 'all';
  sortBy: 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
  
  // Loading
  isLoading: boolean;
  isCreating: boolean;
  isSyncing: boolean;
  
  // Actions
  fetchNotes: () => Promise<void>;
  createNote: (data: CreateNoteInput) => Promise<Note>;
  updateNote: (id: string, data: UpdateNoteInput) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  archiveNote: (id: string) => Promise<void>;
  
  // Offline
  pendingChanges: PendingChange[];
  syncPendingChanges: () => Promise<void>;
}

// stores/editor.ts
interface EditorState {
  // Content
  draftId: string | null;
  draftBody: string;
  draftCategory: NoteCategory;
  draftThreadId: string | null;
  draftGoalIds: string[];
  
  // UI
  isEditing: boolean;
  isFocusMode: boolean;
  wordCount: number;
  
  // Autosave
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedAt: Date | null;
  
  // Actions
  setDraft: (body: string) => void;
  saveDraft: () => Promise<void>;
  discardDraft: () => void;
  publishNote: () => Promise<Note>;
}

// stores/ui.ts
interface UIState {
  // Navigation
  currentRoute: string;
  previousRoute: string | null;
  
  // Modals
  activeModal: ModalType | null;
  modalData: any;
  
  // Sheets
  activeSheet: SheetType | null;
  sheetData: any;
  
  // Toast
  toasts: Toast[];
  
  // Theme
  theme: 'dark' | 'light' | 'system';
  resolvedTheme: 'dark' | 'light';
  
  // Connection
  isOnline: boolean;
  isSyncing: boolean;
  
  // Actions
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  showToast: (toast: ToastInput) => void;
  dismissToast: (id: string) => void;
}
```

### 3.2 Optimistic Updates Pattern

```typescript
// Example: Creating a note with optimistic update
async function createNote(input: CreateNoteInput) {
  // 1. Generate temporary ID
  const tempId = `temp_${Date.now()}`;
  
  // 2. Create optimistic note
  const optimisticNote: Note = {
    id: tempId,
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
    syncStatus: 'pending',
  };
  
  // 3. Add to store immediately
  store.setState(state => ({
    notes: new Map(state.notes).set(tempId, optimisticNote),
  }));
  
  // 4. Show optimistic UI
  showToast({ message: 'Note saved', type: 'success' });
  
  try {
    // 5. Send to server
    const serverNote = await api.createNote(input);
    
    // 6. Replace temp with real
    store.setState(state => {
      const notes = new Map(state.notes);
      notes.delete(tempId);
      notes.set(serverNote.id, { ...serverNote, syncStatus: 'synced' });
      return { notes };
    });
    
    return serverNote;
  } catch (error) {
    // 7. Mark as error, keep in pending queue
    store.setState(state => ({
      notes: new Map(state.notes).set(tempId, {
        ...optimisticNote,
        syncStatus: 'error',
      }),
      pendingChanges: [...state.pendingChanges, { type: 'create', data: input }],
    }));
    
    throw error;
  }
}
```

---

## 4. Offline-First Architecture

### 4.1 Local Storage Strategy

```typescript
// Use IndexedDB for structured data
const db = await openDB('orivya', 1, {
  upgrade(db) {
    // Notes store with indexes
    const notesStore = db.createObjectStore('notes', { keyPath: 'id' });
    notesStore.createIndex('threadId', 'threadId');
    notesStore.createIndex('status', 'status');
    notesStore.createIndex('updatedAt', 'updatedAt');
    notesStore.createIndex('syncStatus', 'syncStatus');
    
    // Threads store
    db.createObjectStore('threads', { keyPath: 'id' });
    
    // Goals store
    db.createObjectStore('goals', { keyPath: 'id' });
    
    // Sync queue
    db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
    
    // Metadata
    db.createObjectStore('meta', { keyPath: 'key' });
  },
});
```

### 4.2 Sync Queue Processing

```typescript
interface SyncQueueItem {
  id: number;
  type: 'create' | 'update' | 'delete';
  entity: 'note' | 'thread' | 'goal';
  entityId: string;
  data: any;
  createdAt: Date;
  attempts: number;
  lastAttemptAt?: Date;
  error?: string;
}

async function processSyncQueue() {
  const queue = await db.getAll('syncQueue');
  
  for (const item of queue) {
    try {
      await processQueueItem(item);
      await db.delete('syncQueue', item.id);
    } catch (error) {
      // Exponential backoff
      const nextAttempt = item.attempts + 1;
      if (nextAttempt < MAX_RETRY_ATTEMPTS) {
        await db.put('syncQueue', {
          ...item,
          attempts: nextAttempt,
          lastAttemptAt: new Date(),
          error: error.message,
        });
      } else {
        // Move to dead letter queue or notify user
        await handleSyncFailure(item);
      }
    }
  }
}
```

### 4.3 Conflict Resolution

```typescript
// Last-write-wins with version checking
async function resolveConflict(local: Note, remote: Note): Promise<Note> {
  // If versions match, no conflict
  if (local.version === remote.version) {
    return local;
  }
  
  // If remote is newer, use remote
  if (remote.version > local.version) {
    // But preserve any unsynced local changes
    if (local.syncStatus === 'pending') {
      // Merge: keep local body if edited more recently
      if (local.updatedAt > remote.updatedAt) {
        return {
          ...remote,
          body: local.body,
          updatedAt: local.updatedAt,
          version: remote.version + 1,
          syncStatus: 'pending',
        };
      }
    }
    return { ...remote, syncStatus: 'synced' };
  }
  
  // Local is newer (shouldn't happen normally)
  return { ...local, syncStatus: 'pending' };
}
```

---

## 5. AI Integration

### 5.1 Analysis Pipeline

```typescript
interface AnalysisRequest {
  noteId: string;
  body: string;
  previousNotes?: string[];      // Context from same thread
  userHistory?: AnalysisHistory; // Aggregated patterns
}

interface AnalysisResponse {
  sentiment: SentimentAnalysis;
  themes: string[];
  keyPhrases: string[];
  suggestions: Suggestion[];
}

// Rate limiting: 10 analyses per hour (free), unlimited (Pro)
// Batch processing: Analyze up to 5 notes in single request
// Caching: Cache analysis for 24 hours unless note updated
```

### 5.2 Insight Generation

```typescript
// Triggered conditions:
// 1. After 5+ notes in same thread
// 2. Weekly digest (Sundays)
// 3. Goal milestone reached
// 4. Pattern detected across 3+ notes

async function generateInsights(userId: string): Promise<Insight[]> {
  const recentNotes = await getNotes({ userId, limit: 50, days: 30 });
  const threads = await getActiveThreads(userId);
  const goals = await getActiveGoals(userId);
  
  const prompt = buildInsightPrompt(recentNotes, threads, goals);
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });
  
  return parseInsights(response);
}
```

---

## 6. Security Requirements

### 6.1 Authentication

- JWT tokens with 15-minute access token, 7-day refresh token
- Secure HTTP-only cookies for refresh tokens
- Rate limiting: 5 failed logins → 15-minute lockout
- Password requirements: 8+ chars, 1 uppercase, 1 number

### 6.2 Data Protection

- All note content encrypted at rest (AES-256)
- TLS 1.3 for all API communication
- End-to-end encryption option for Pro users
- GDPR-compliant data export and deletion

### 6.3 API Security

```typescript
// Rate limits
const rateLimits = {
  'auth/*': '10/minute',
  'notes/create': '60/hour',
  'notes/analyze': '10/hour',      // Free tier
  'insights/generate': '5/hour',
  'export': '3/day',
};

// Required headers
const requiredHeaders = {
  'Authorization': 'Bearer <token>',
  'X-Client-Version': '1.0.0',
  'X-Platform': 'ios|android|web',
};
```

---

## 7. Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3.0s | Lighthouse |
| API Response (p95) | < 200ms | Server metrics |
| Note Save (perceived) | < 100ms | Optimistic UI |
| Search Results | < 500ms | Client timing |
| Offline Capability | 100% read | PWA audit |
| Bundle Size (JS) | < 150KB | Gzipped |

---

## 8. Error Codes

```typescript
enum ErrorCode {
  // Auth (1xxx)
  AUTH_INVALID_CREDENTIALS = 1001,
  AUTH_TOKEN_EXPIRED = 1002,
  AUTH_ACCOUNT_LOCKED = 1003,
  AUTH_EMAIL_NOT_VERIFIED = 1004,
  
  // Notes (2xxx)
  NOTE_NOT_FOUND = 2001,
  NOTE_ACCESS_DENIED = 2002,
  NOTE_VALIDATION_ERROR = 2003,
  NOTE_SYNC_CONFLICT = 2004,
  
  // Threads (3xxx)
  THREAD_NOT_FOUND = 3001,
  THREAD_LIMIT_REACHED = 3002,
  
  // Goals (4xxx)
  GOAL_NOT_FOUND = 4001,
  GOAL_LIMIT_REACHED = 4002,
  
  // AI (5xxx)
  AI_RATE_LIMITED = 5001,
  AI_SERVICE_UNAVAILABLE = 5002,
  AI_QUOTA_EXCEEDED = 5003,
  
  // General (9xxx)
  RATE_LIMITED = 9001,
  MAINTENANCE_MODE = 9002,
  VERSION_OUTDATED = 9003,
}
```

---

## 9. Feature Flags

```typescript
interface FeatureFlags {
  // Rollout
  newOnboarding: boolean;
  improvedSearch: boolean;
  voiceNotes: boolean;
  
  // A/B Tests
  promptStyleVariant: 'a' | 'b';
  insightFrequency: 'daily' | 'weekly';
  
  // Kill switches
  aiFeatures: boolean;
  socialSharing: boolean;
  
  // Platform-specific
  hapticFeedback: boolean;      // iOS/Android only
  keyboardShortcuts: boolean;   // Desktop only
}
```

---

*Last updated: December 2025*
