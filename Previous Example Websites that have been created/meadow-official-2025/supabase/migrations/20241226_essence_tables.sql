-- =====================================================
-- MEADOW ESSENCE INTEGRATION - DATABASE MIGRATIONS
-- =====================================================
-- This migration adds all tables needed for:
-- 1. Essence chat sessions and messages
-- 2. Insights (from Essence, Journal, Cross-entry)
-- 3. To-dos with intention linking
-- 4. User context cache for AI personalization
-- 5. Usage tracking for rate limiting
-- =====================================================

-- =====================================================
-- 1. ESSENCE SESSIONS TABLE
-- =====================================================
-- Stores Essence conversation sessions

CREATE TABLE IF NOT EXISTS essence_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Session configuration
  depth_level TEXT CHECK (depth_level IN ('vent', 'reflect', 'explore', 'deep')) DEFAULT 'reflect',
  initial_intent TEXT, -- From intent pill selection (untangle, decide, reflect, etc.)

  -- Timing
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,

  -- Computed fields (updated on session close)
  message_count INTEGER DEFAULT 0,
  summary TEXT, -- AI-generated session summary
  primary_theme TEXT, -- Main theme of conversation

  -- Optional context linking
  thread_id UUID REFERENCES threads(id) ON DELETE SET NULL,
  entry_context_id UUID REFERENCES journal_entries(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for user's sessions list
CREATE INDEX IF NOT EXISTS idx_essence_sessions_user
  ON essence_sessions(user_id, started_at DESC);

-- Index for finding active (unclosed) sessions
CREATE INDEX IF NOT EXISTS idx_essence_sessions_active
  ON essence_sessions(user_id)
  WHERE ended_at IS NULL;

-- =====================================================
-- 2. ESSENCE MESSAGES TABLE
-- =====================================================
-- Stores individual messages within sessions

CREATE TABLE IF NOT EXISTS essence_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES essence_sessions(id) ON DELETE CASCADE NOT NULL,

  -- Message content
  role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content TEXT NOT NULL,

  -- Metadata for analysis
  token_count INTEGER,
  sentiment_score FLOAT, -- -1.0 to 1.0

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast session message retrieval
CREATE INDEX IF NOT EXISTS idx_essence_messages_session
  ON essence_messages(session_id, created_at);

-- =====================================================
-- 3. INSIGHTS TABLE
-- =====================================================
-- Stores insights from all sources

CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Source tracking
  source_type TEXT CHECK (source_type IN ('essence', 'journal', 'cross_entry', 'journey', 'manual')) NOT NULL,
  source_session_id UUID REFERENCES essence_sessions(id) ON DELETE SET NULL,
  source_entry_id UUID REFERENCES journal_entries(id) ON DELETE SET NULL,

  -- Insight classification
  insight_type TEXT CHECK (insight_type IN (
    'summary',      -- What we've touched on
    'focus',        -- The heart of it
    'shift',        -- A movement (before → after)
    'thread',       -- Recurring theme
    'blind_spot',   -- Unknown unknown (deep mode only)
    'connection',   -- Links to other content
    'action'        -- Suggested to-do
  )) NOT NULL,

  -- Content
  content TEXT NOT NULL,
  context TEXT, -- Additional context, source quote, or metadata

  -- For shift type insights
  shift_before TEXT,
  shift_after TEXT,

  -- State
  starred BOOLEAN DEFAULT FALSE,
  dismissed BOOLEAN DEFAULT FALSE,
  explored_at TIMESTAMPTZ, -- When user clicked "Explore"

  -- Connections (stored as arrays for flexibility)
  related_insight_ids UUID[] DEFAULT '{}',
  related_entry_ids UUID[] DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for insights
CREATE INDEX IF NOT EXISTS idx_insights_user
  ON insights(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_insights_starred
  ON insights(user_id, starred)
  WHERE starred = TRUE AND dismissed = FALSE;

CREATE INDEX IF NOT EXISTS idx_insights_source
  ON insights(user_id, source_type);

CREATE INDEX IF NOT EXISTS idx_insights_type
  ON insights(user_id, insight_type);

-- =====================================================
-- 4. TODOS TABLE
-- =====================================================
-- Simple to-do items with optional linking

CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Content
  content TEXT NOT NULL,
  notes TEXT,

  -- State
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,

  -- Optional connections
  intention_id UUID REFERENCES intentions(id) ON DELETE SET NULL,
  source_insight_id UUID REFERENCES insights(id) ON DELETE SET NULL,
  source_session_id UUID REFERENCES essence_sessions(id) ON DELETE SET NULL,

  -- Scheduling (optional)
  due_date DATE,
  priority INTEGER CHECK (priority BETWEEN 1 AND 3), -- 1=high, 2=medium, 3=low

  -- Ordering
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for home widget (active todos)
CREATE INDEX IF NOT EXISTS idx_todos_active
  ON todos(user_id, completed, sort_order)
  WHERE completed = FALSE;

-- Index for completed todos
CREATE INDEX IF NOT EXISTS idx_todos_completed
  ON todos(user_id, completed_at DESC)
  WHERE completed = TRUE;

-- =====================================================
-- 5. USER CONTEXT TABLE
-- =====================================================
-- Cached/computed user context for AI personalization

CREATE TABLE IF NOT EXISTS user_context (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Growth stage (Seed → Thrive progression)
  growth_stage TEXT CHECK (growth_stage IN ('seed', 'sprout', 'sapling', 'tree', 'thrive')) DEFAULT 'seed',
  stage_updated_at TIMESTAMPTZ DEFAULT now(),

  -- Activity metrics
  total_entries INTEGER DEFAULT 0,
  total_essence_sessions INTEGER DEFAULT 0,
  total_insights_saved INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,

  -- Computed themes (updated periodically by AI)
  -- Format: [{"theme": "...", "strength": 0.8, "last_seen": "2024-12-26"}]
  active_themes JSONB DEFAULT '[]'::jsonb,

  -- Mood trend
  recent_mood_trend TEXT CHECK (recent_mood_trend IN ('improving', 'stable', 'declining', 'unknown')) DEFAULT 'unknown',

  -- Preferences (learned from usage)
  preferred_depth TEXT CHECK (preferred_depth IN ('vent', 'reflect', 'explore', 'deep')),
  typical_session_length INTEGER, -- Average in minutes

  -- Last activity timestamps
  last_entry_at TIMESTAMPTZ,
  last_session_at TIMESTAMPTZ,
  last_active_at TIMESTAMPTZ,

  -- AI-generated summary of user (for context injection)
  context_summary TEXT,
  context_summary_updated_at TIMESTAMPTZ,

  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 6. USER USAGE TABLE
-- =====================================================
-- Monthly usage tracking for rate limiting

CREATE TABLE IF NOT EXISTS user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  period_start DATE NOT NULL, -- First of month

  -- Usage counters
  essence_sessions INTEGER DEFAULT 0,
  essence_messages INTEGER DEFAULT 0,
  insight_extractions INTEGER DEFAULT 0,
  cross_entry_analyses INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Unique constraint per user per month
  UNIQUE(user_id, period_start)
);

-- Index for looking up current month's usage
CREATE INDEX IF NOT EXISTS idx_user_usage_current
  ON user_usage(user_id, period_start DESC);

-- =====================================================
-- 7. WEEKLY SYNTHESIS TABLE
-- =====================================================
-- Stores generated weekly/monthly syntheses

CREATE TABLE IF NOT EXISTS weekly_synthesis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Period
  period_type TEXT CHECK (period_type IN ('weekly', 'monthly')) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Content (AI-generated)
  themes_summary TEXT,
  emotional_arc TEXT,
  insights_highlighted UUID[], -- References to insight IDs
  intention_progress JSONB, -- Progress on each intention
  suggested_prompt TEXT,

  -- Full synthesis content (rendered)
  full_content TEXT,

  -- State
  viewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),

  -- One synthesis per user per period
  UNIQUE(user_id, period_type, period_start)
);

-- =====================================================
-- 8. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE essence_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE essence_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_synthesis ENABLE ROW LEVEL SECURITY;

-- Essence Sessions: Users can only access their own
CREATE POLICY "Users can view own sessions" ON essence_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON essence_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON essence_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON essence_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Essence Messages: Users can access messages from their sessions
CREATE POLICY "Users can view own messages" ON essence_messages
  FOR SELECT USING (
    session_id IN (SELECT id FROM essence_sessions WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create messages in own sessions" ON essence_messages
  FOR INSERT WITH CHECK (
    session_id IN (SELECT id FROM essence_sessions WHERE user_id = auth.uid())
  );

-- Insights: Users can only access their own
CREATE POLICY "Users can view own insights" ON insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own insights" ON insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights" ON insights
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own insights" ON insights
  FOR DELETE USING (auth.uid() = user_id);

-- Todos: Users can only access their own
CREATE POLICY "Users can view own todos" ON todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own todos" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos" ON todos
  FOR DELETE USING (auth.uid() = user_id);

-- User Context: Users can only access their own
CREATE POLICY "Users can view own context" ON user_context
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own context" ON user_context
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own context" ON user_context
  FOR UPDATE USING (auth.uid() = user_id);

-- User Usage: Users can view their own usage
CREATE POLICY "Users can view own usage" ON user_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Usage is managed by backend, so no insert/update for users
CREATE POLICY "Service can manage usage" ON user_usage
  FOR ALL USING (true); -- Backend uses service role

-- Weekly Synthesis: Users can view their own
CREATE POLICY "Users can view own synthesis" ON weekly_synthesis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update viewed_at" ON weekly_synthesis
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- 9. TRIGGERS FOR AUTO-UPDATES
-- =====================================================

-- Update session message count on new message
CREATE OR REPLACE FUNCTION update_session_message_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE essence_sessions
  SET message_count = message_count + 1
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_message_inserted
  AFTER INSERT ON essence_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_message_count();

-- Update user_context on new session
CREATE OR REPLACE FUNCTION update_context_on_session()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_context (user_id, last_session_at, last_active_at, total_essence_sessions)
  VALUES (NEW.user_id, now(), now(), 1)
  ON CONFLICT (user_id) DO UPDATE SET
    last_session_at = now(),
    last_active_at = now(),
    total_essence_sessions = user_context.total_essence_sessions + 1,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_session_created
  AFTER INSERT ON essence_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_context_on_session();

-- Update user_context on insight saved (starred)
CREATE OR REPLACE FUNCTION update_context_on_insight_star()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.starred = TRUE AND (OLD.starred IS NULL OR OLD.starred = FALSE) THEN
    UPDATE user_context
    SET total_insights_saved = total_insights_saved + 1,
        updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_insight_starred
  AFTER UPDATE ON insights
  FOR EACH ROW
  EXECUTE FUNCTION update_context_on_insight_star();

-- Auto-update updated_at on todos
CREATE OR REPLACE FUNCTION update_todos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_todos_updated_at();

-- =====================================================
-- 10. HELPER FUNCTIONS
-- =====================================================

-- Get current month's usage for a user
CREATE OR REPLACE FUNCTION get_current_usage(p_user_id UUID)
RETURNS user_usage AS $$
DECLARE
  result user_usage;
  current_period DATE;
BEGIN
  current_period := date_trunc('month', CURRENT_DATE)::DATE;

  SELECT * INTO result
  FROM user_usage
  WHERE user_id = p_user_id AND period_start = current_period;

  IF result IS NULL THEN
    INSERT INTO user_usage (user_id, period_start)
    VALUES (p_user_id, current_period)
    RETURNING * INTO result;
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment usage counter
CREATE OR REPLACE FUNCTION increment_usage(
  p_user_id UUID,
  p_field TEXT
)
RETURNS void AS $$
DECLARE
  current_period DATE;
BEGIN
  current_period := date_trunc('month', CURRENT_DATE)::DATE;

  INSERT INTO user_usage (user_id, period_start)
  VALUES (p_user_id, current_period)
  ON CONFLICT (user_id, period_start) DO NOTHING;

  EXECUTE format('
    UPDATE user_usage
    SET %I = %I + 1, updated_at = now()
    WHERE user_id = $1 AND period_start = $2
  ', p_field, p_field)
  USING p_user_id, current_period;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
