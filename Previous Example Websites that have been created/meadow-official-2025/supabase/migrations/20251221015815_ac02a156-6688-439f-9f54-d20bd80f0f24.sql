
-- =============================================================================
-- MEADOW AI SYSTEM: Production Database Foundation
-- =============================================================================
-- Idempotent migration for AI personalization, retrieval (pgvector), and security
-- References existing: journal_entries, threads tables
-- =============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================================================
-- ENUMS (Canonical values - do not modify)
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE meadow_stage AS ENUM ('SEED', 'SPROUT', 'GROW', 'BLOOM', 'THRIVE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE meadow_mood AS ENUM ('sunny', 'clear', 'cloudy', 'rainy', 'stormy', 'unknown');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE meadow_depth AS ENUM ('light', 'balanced', 'deep');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE meadow_creativity AS ENUM ('plain', 'poetic_light', 'sensory', 'story_seed', 'perspective_shift');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ai_risk AS ENUM ('none', 'low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ai_run_status AS ENUM ('ok', 'cached', 'blocked', 'failed', 'repaired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ai_plan AS ENUM ('free', 'pro', 'premium');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ai_feedback_type AS ENUM ('more_like_this', 'less_like_this', 'too_deep', 'too_shallow', 'irrelevant', 'creepy', 'loved_it');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ai_cue_type AS ENUM ('tension', 'theme', 'energy', 'value', 'time_horizon', 'pattern', 'decision', 'relationship', 'identity', 'rest', 'work', 'health', 'creative', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- =============================================================================
-- HELPER: updated_at trigger function
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =============================================================================
-- CLIENT-VISIBLE TABLES (with RLS policies)
-- =============================================================================

-- ai_settings: User AI preferences (client read/write own)
CREATE TABLE IF NOT EXISTS public.ai_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  depth meadow_depth NOT NULL DEFAULT 'balanced',
  creativity meadow_creativity NOT NULL DEFAULT 'plain',
  voice_style text DEFAULT 'warm',
  preferred_length text DEFAULT 'medium',
  avoid_topics text[] DEFAULT '{}',
  enabled_features text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_settings_user ON public.ai_settings(user_id);

DROP TRIGGER IF EXISTS set_ai_settings_updated_at ON public.ai_settings;
CREATE TRIGGER set_ai_settings_updated_at
  BEFORE UPDATE ON public.ai_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ai_settings" ON public.ai_settings;
CREATE POLICY "Users can view own ai_settings" ON public.ai_settings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ai_settings" ON public.ai_settings;
CREATE POLICY "Users can insert own ai_settings" ON public.ai_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ai_settings" ON public.ai_settings;
CREATE POLICY "Users can update own ai_settings" ON public.ai_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- user_state: Personalization Spine (client read own only)
CREATE TABLE IF NOT EXISTS public.user_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  stage meadow_stage NOT NULL DEFAULT 'SEED',
  depth meadow_depth NOT NULL DEFAULT 'balanced',
  creativity meadow_creativity NOT NULL DEFAULT 'plain',
  active_thread_ids uuid[] DEFAULT '{}',
  week_theme text,
  cue_palette jsonb DEFAULT '[]',
  cadence_policy jsonb DEFAULT '{}',
  output_fingerprints jsonb DEFAULT '[]',
  last_entry_at timestamptz,
  last_thread_change_at timestamptz,
  entry_count_7d int DEFAULT 0,
  entry_count_30d int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_state_user ON public.user_state(user_id);

DROP TRIGGER IF EXISTS set_user_state_updated_at ON public.user_state;
CREATE TRIGGER set_user_state_updated_at
  BEFORE UPDATE ON public.user_state
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.user_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own user_state" ON public.user_state;
CREATE POLICY "Users can view own user_state" ON public.user_state
  FOR SELECT USING (auth.uid() = user_id);

-- ai_artifacts: Generated AI outputs (client read own only)
CREATE TABLE IF NOT EXISTS public.ai_artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  feature_key text NOT NULL,
  artifact_type text NOT NULL,
  content jsonb NOT NULL,
  source_hash text,
  source_entry_ids uuid[] DEFAULT '{}',
  source_thread_id uuid,
  metadata jsonb DEFAULT '{}',
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_artifacts_user ON public.ai_artifacts(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_artifacts_feature ON public.ai_artifacts(user_id, feature_key);
CREATE INDEX IF NOT EXISTS idx_ai_artifacts_source_hash ON public.ai_artifacts(user_id, feature_key, source_hash);

ALTER TABLE public.ai_artifacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ai_artifacts" ON public.ai_artifacts;
CREATE POLICY "Users can view own ai_artifacts" ON public.ai_artifacts
  FOR SELECT USING (auth.uid() = user_id);

-- ai_feedback: User feedback on AI outputs (client read/insert own)
CREATE TABLE IF NOT EXISTS public.ai_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  artifact_id uuid REFERENCES public.ai_artifacts(id) ON DELETE CASCADE,
  feedback_type ai_feedback_type NOT NULL,
  feature_key text,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_feedback_user ON public.ai_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_artifact ON public.ai_feedback(artifact_id);

ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ai_feedback" ON public.ai_feedback;
CREATE POLICY "Users can view own ai_feedback" ON public.ai_feedback
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ai_feedback" ON public.ai_feedback;
CREATE POLICY "Users can insert own ai_feedback" ON public.ai_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- SERVER-ONLY TABLES (RLS enabled, NO client policies = default deny)
-- =============================================================================

-- user_state_history: Daily spine snapshots
CREATE TABLE IF NOT EXISTS public.user_state_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  snapshot_date date NOT NULL,
  state_snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_user_state_history_user ON public.user_state_history(user_id, snapshot_date DESC);

ALTER TABLE public.user_state_history ENABLE ROW LEVEL SECURITY;

-- ai_features: Feature registry with plan gating
CREATE TABLE IF NOT EXISTS public.ai_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  requires_plan ai_plan NOT NULL DEFAULT 'free',
  ttl_seconds int DEFAULT 86400,
  cooldown_seconds int DEFAULT 0,
  min_entries_required int DEFAULT 0,
  is_enabled boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS set_ai_features_updated_at ON public.ai_features;
CREATE TRIGGER set_ai_features_updated_at
  BEFORE UPDATE ON public.ai_features
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.ai_features ENABLE ROW LEVEL SECURITY;

-- ai_prompt_templates: Versioned prompts (server-only)
CREATE TABLE IF NOT EXISTS public.ai_prompt_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text NOT NULL,
  version int NOT NULL DEFAULT 1,
  system_prompt text NOT NULL,
  user_prompt_template text NOT NULL,
  model text DEFAULT 'google/gemini-2.5-flash',
  temperature float DEFAULT 0.7,
  max_tokens int DEFAULT 1000,
  metadata jsonb DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(template_key, version)
);

CREATE INDEX IF NOT EXISTS idx_ai_prompt_templates_key ON public.ai_prompt_templates(template_key, is_active);

ALTER TABLE public.ai_prompt_templates ENABLE ROW LEVEL SECURITY;

-- ai_schema_registry: JSON schemas for validation (server-only)
CREATE TABLE IF NOT EXISTS public.ai_schema_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schema_key text NOT NULL UNIQUE,
  json_schema jsonb NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_schema_registry ENABLE ROW LEVEL SECURITY;

-- ai_voice_policy: Single row for Meadow Lens rules (server-only)
CREATE TABLE IF NOT EXISTS public.ai_voice_policy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_rules jsonb NOT NULL DEFAULT '{}',
  banned_phrases text[] DEFAULT '{}',
  tone_guidelines text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_voice_policy ENABLE ROW LEVEL SECURITY;

-- ai_cache: Server-side cache for AI outputs
CREATE TABLE IF NOT EXISTS public.ai_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text NOT NULL,
  user_id uuid NOT NULL,
  feature_key text NOT NULL,
  content jsonb NOT NULL,
  source_hash text,
  ttl_seconds int NOT NULL DEFAULT 86400,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(cache_key, user_id)
);

CREATE INDEX IF NOT EXISTS idx_ai_cache_lookup ON public.ai_cache(user_id, feature_key, cache_key);
CREATE INDEX IF NOT EXISTS idx_ai_cache_expires ON public.ai_cache(expires_at);

ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;

-- ai_runs: AI generation run logs (server-only)
CREATE TABLE IF NOT EXISTS public.ai_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  feature_key text NOT NULL,
  run_status ai_run_status NOT NULL DEFAULT 'ok',
  risk_level ai_risk DEFAULT 'none',
  input_hash text,
  output_hash text,
  tokens_used int,
  latency_ms int,
  model_used text,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_runs_user ON public.ai_runs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_runs_feature ON public.ai_runs(feature_key, created_at DESC);

ALTER TABLE public.ai_runs ENABLE ROW LEVEL SECURITY;

-- ai_safety_events: Safety/moderation events (server-only)
CREATE TABLE IF NOT EXISTS public.ai_safety_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  run_id uuid REFERENCES public.ai_runs(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  risk_level ai_risk NOT NULL,
  details jsonb DEFAULT '{}',
  action_taken text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_safety_events_user ON public.ai_safety_events(user_id, created_at DESC);

ALTER TABLE public.ai_safety_events ENABLE ROW LEVEL SECURITY;

-- ai_redaction_events: Content redaction logs (server-only)
CREATE TABLE IF NOT EXISTS public.ai_redaction_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entry_id uuid,
  chunk_id uuid,
  redaction_type text NOT NULL,
  original_hash text,
  redacted_hash text,
  patterns_matched text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_redaction_events_user ON public.ai_redaction_events(user_id, created_at DESC);

ALTER TABLE public.ai_redaction_events ENABLE ROW LEVEL SECURITY;

-- ai_cues: Detected cues/patterns (server-only writes)
CREATE TABLE IF NOT EXISTS public.ai_cues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  cue_type ai_cue_type NOT NULL,
  cue_text text NOT NULL,
  confidence float DEFAULT 0.5,
  source_entry_ids uuid[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  last_seen_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_cues_user ON public.ai_cues(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_ai_cues_type ON public.ai_cues(user_id, cue_type);

DROP TRIGGER IF EXISTS set_ai_cues_updated_at ON public.ai_cues;
CREATE TRIGGER set_ai_cues_updated_at
  BEFORE UPDATE ON public.ai_cues
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.ai_cues ENABLE ROW LEVEL SECURITY;

-- ai_output_events: Anti-repetition + cadence tracking (server-only)
CREATE TABLE IF NOT EXISTS public.ai_output_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  feature_key text NOT NULL,
  output_fingerprint text NOT NULL,
  artifact_id uuid REFERENCES public.ai_artifacts(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_output_events_user ON public.ai_output_events(user_id, feature_key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_output_events_fingerprint ON public.ai_output_events(user_id, output_fingerprint);

ALTER TABLE public.ai_output_events ENABLE ROW LEVEL SECURITY;

-- ai_user_avoidance: Topics/patterns to avoid per user (server-only)
CREATE TABLE IF NOT EXISTS public.ai_user_avoidance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  avoidance_type text NOT NULL,
  pattern text NOT NULL,
  reason text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_user_avoidance_user ON public.ai_user_avoidance(user_id, is_active);

ALTER TABLE public.ai_user_avoidance ENABLE ROW LEVEL SECURITY;

-- ai_week_theme: Weekly theme generation (server-only)
CREATE TABLE IF NOT EXISTS public.ai_week_theme (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  week_start date NOT NULL,
  theme_text text NOT NULL,
  supporting_cues jsonb DEFAULT '[]',
  source_entry_ids uuid[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_ai_week_theme_user ON public.ai_week_theme(user_id, week_start DESC);

ALTER TABLE public.ai_week_theme ENABLE ROW LEVEL SECURITY;

-- ai_resurface_queue: Entries to resurface (server-only)
CREATE TABLE IF NOT EXISTS public.ai_resurface_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entry_id uuid NOT NULL,
  resurface_reason text,
  priority int DEFAULT 0,
  scheduled_for date,
  is_shown boolean DEFAULT false,
  shown_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_resurface_queue_user ON public.ai_resurface_queue(user_id, is_shown, scheduled_for);

ALTER TABLE public.ai_resurface_queue ENABLE ROW LEVEL SECURITY;

-- thread_rollups: Aggregated thread summaries (server-only)
CREATE TABLE IF NOT EXISTS public.thread_rollups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  thread_id uuid NOT NULL,
  rollup_type text NOT NULL DEFAULT 'summary',
  content jsonb NOT NULL,
  entry_count int DEFAULT 0,
  last_entry_at timestamptz,
  source_hash text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(thread_id, rollup_type)
);

CREATE INDEX IF NOT EXISTS idx_thread_rollups_user ON public.thread_rollups(user_id);
CREATE INDEX IF NOT EXISTS idx_thread_rollups_thread ON public.thread_rollups(thread_id);

ALTER TABLE public.thread_rollups ENABLE ROW LEVEL SECURITY;

-- embedding_jobs: Embedding generation queue (server-only)
CREATE TABLE IF NOT EXISTS public.embedding_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entry_id uuid NOT NULL,
  job_status text NOT NULL DEFAULT 'pending',
  priority int DEFAULT 0,
  attempts int DEFAULT 0,
  last_error text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_embedding_jobs_pending ON public.embedding_jobs(job_status, priority DESC, created_at);
CREATE INDEX IF NOT EXISTS idx_embedding_jobs_entry ON public.embedding_jobs(entry_id);

ALTER TABLE public.embedding_jobs ENABLE ROW LEVEL SECURITY;

-- entry_chunks: Vector embeddings for retrieval (server-only writes)
CREATE TABLE IF NOT EXISTS public.entry_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entry_id uuid NOT NULL,
  thread_id uuid,
  chunk_index int NOT NULL DEFAULT 0,
  content_redacted text NOT NULL,
  content_hash text NOT NULL,
  embedding vector(1536),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(entry_id, chunk_index)
);

CREATE INDEX IF NOT EXISTS idx_entry_chunks_user ON public.entry_chunks(user_id);
CREATE INDEX IF NOT EXISTS idx_entry_chunks_entry ON public.entry_chunks(entry_id);
CREATE INDEX IF NOT EXISTS idx_entry_chunks_thread ON public.entry_chunks(thread_id);
CREATE INDEX IF NOT EXISTS idx_entry_chunks_embedding ON public.entry_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

ALTER TABLE public.entry_chunks ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RPC: match_entry_chunks (similarity search - SERVER-ONLY)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.match_entry_chunks(
  p_user_id uuid,
  p_embedding vector(1536),
  p_match_count int DEFAULT 5,
  p_match_threshold float DEFAULT 0.7
)
RETURNS TABLE (
  id uuid,
  entry_id uuid,
  thread_id uuid,
  chunk_index int,
  content_redacted text,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ec.id,
    ec.entry_id,
    ec.thread_id,
    ec.chunk_index,
    ec.content_redacted,
    1 - (ec.embedding <=> p_embedding) AS similarity
  FROM public.entry_chunks ec
  WHERE ec.user_id = p_user_id
    AND ec.embedding IS NOT NULL
    AND 1 - (ec.embedding <=> p_embedding) > p_match_threshold
  ORDER BY ec.embedding <=> p_embedding
  LIMIT p_match_count;
END;
$$;

-- Lock down RPC to service_role only
REVOKE ALL ON FUNCTION public.match_entry_chunks(uuid, vector, int, float) FROM public;
REVOKE ALL ON FUNCTION public.match_entry_chunks(uuid, vector, int, float) FROM anon;
REVOKE ALL ON FUNCTION public.match_entry_chunks(uuid, vector, int, float) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.match_entry_chunks(uuid, vector, int, float) TO service_role;

-- =============================================================================
-- DONE
-- =============================================================================
