# Meadow - Complete Supabase Migration Package

This document contains everything needed to migrate from Lovable Cloud to your own Supabase project.

---

## Quick Start (Easiest Path)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization, name it "meadow" (or anything)
4. Set a database password (SAVE THIS - you'll need it for MCP)
5. Select your region and click "Create"
6. Wait ~2 minutes for provisioning

### Step 2: Run Schema SQL
1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy/paste the entire **SCHEMA SQL** section below
4. Click **Run** (may take 30-60 seconds)

### Step 3: Import Data
1. Still in SQL Editor, create **New Query**
2. Copy/paste the **DATA IMPORT SQL** section
3. Click **Run**

### Step 4: Create Storage Buckets
1. New Query in SQL Editor
2. Copy/paste **STORAGE SQL** section
3. Click **Run**

### Step 5: Deploy Edge Functions
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref YOUR_PROJECT_ID`
4. Copy edge function files to `supabase/functions/`
5. Deploy: `supabase functions deploy`

### Step 6: Set Environment Variables
In Supabase Dashboard → Settings → Edge Functions → Secrets:
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `RESEND_API_KEY` - Your Resend API key  
- `OPENAI_API_KEY` - Your OpenAI key (optional, uses Lovable AI gateway currently)

### Step 7: Update Frontend
Update these files with your new Supabase credentials:
```
# In your .env.local or environment:
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

### Step 8: Connect MCP
Use this config for Cursor/Antigravity:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server",
        "--project-ref",
        "YOUR_PROJECT_ID"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "your_access_token_here"
      }
    }
  }
}
```

Or for direct Postgres access:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres"
      ]
    }
  }
}
```

---

## SECTION 1: SCHEMA SQL

Run this first to create all tables, types, functions, and policies:

```sql
-- ============================================
-- MEADOW DATABASE SCHEMA - COMPLETE EXPORT
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- CUSTOM ENUM TYPES
-- ============================================

CREATE TYPE public.meadow_stage AS ENUM ('SEED', 'SPROUT', 'GROW', 'BLOOM', 'THRIVE');
CREATE TYPE public.meadow_depth AS ENUM ('light', 'balanced', 'deep');
CREATE TYPE public.meadow_creativity AS ENUM ('plain', 'poetic_light', 'sensory', 'story_seed', 'perspective_shift');
CREATE TYPE public.meadow_mood AS ENUM ('sunny', 'clear', 'cloudy', 'rainy', 'stormy', 'unknown');
CREATE TYPE public.ai_plan AS ENUM ('free', 'pro', 'premium');
CREATE TYPE public.ai_risk AS ENUM ('none', 'low', 'medium', 'high');
CREATE TYPE public.ai_run_status AS ENUM ('ok', 'cached', 'blocked', 'failed', 'repaired');
CREATE TYPE public.ai_feedback_type AS ENUM ('more_like_this', 'less_like_this', 'too_deep', 'too_shallow', 'irrelevant', 'creepy', 'loved_it');
CREATE TYPE public.ai_cue_type AS ENUM ('tension', 'theme', 'energy', 'value', 'time_horizon', 'pattern', 'decision', 'relationship', 'identity', 'rest', 'work', 'health', 'creative', 'other');

-- ============================================
-- CORE USER TABLES
-- ============================================

-- Profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User settings
CREATE TABLE public.user_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  theme text DEFAULT 'system',
  daily_reminder_enabled boolean DEFAULT false,
  daily_reminder_time time without time zone DEFAULT '09:00:00',
  weekly_digest_enabled boolean DEFAULT true,
  app_lock_enabled boolean DEFAULT false,
  export_format text DEFAULT 'markdown',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User state (journaling stage tracking)
CREATE TABLE public.user_state (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  stage public.meadow_stage NOT NULL DEFAULT 'SEED',
  depth public.meadow_depth NOT NULL DEFAULT 'balanced',
  creativity public.meadow_creativity NOT NULL DEFAULT 'plain',
  entry_count_7d integer DEFAULT 0,
  entry_count_30d integer DEFAULT 0,
  last_entry_at timestamp with time zone,
  last_thread_change_at timestamp with time zone,
  active_thread_ids uuid[] DEFAULT '{}',
  week_theme text,
  cue_palette jsonb DEFAULT '[]',
  cadence_policy jsonb DEFAULT '{}',
  output_fingerprints jsonb DEFAULT '[]',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User subscriptions (Stripe)
CREATE TABLE public.user_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  plan text DEFAULT 'free',
  status text DEFAULT 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User state history (snapshots)
CREATE TABLE public.user_state_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  snapshot_date date NOT NULL,
  state_snapshot jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ============================================
-- CONTENT TABLES
-- ============================================

-- Threads (categories/folders for entries)
CREATE TABLE public.threads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  color text DEFAULT '#6B7B5E',
  entry_count integer DEFAULT 0,
  last_entry_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Journal entries
CREATE TABLE public.journal_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  thread_id uuid REFERENCES public.threads(id) ON DELETE SET NULL,
  title text,
  content text,
  mood text,
  tags text[],
  audio_url text,
  word_count integer DEFAULT 0,
  is_reflection boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Mood logs
CREATE TABLE public.mood_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  entry_id uuid REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  mood text NOT NULL,
  intensity integer DEFAULT 5,
  factors text[],
  notes text,
  logged_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Reflections (AI-generated insights)
CREATE TABLE public.reflections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  entry_id uuid REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  thread_id uuid REFERENCES public.threads(id) ON DELETE SET NULL,
  content text NOT NULL,
  reflection_type text DEFAULT 'entry',
  prompt_used text,
  model_used text DEFAULT 'gpt-4o-mini',
  is_favorite boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Intentions (goals)
CREATE TABLE public.intentions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text DEFAULT 'general',
  status text DEFAULT 'active',
  progress integer DEFAULT 0,
  target_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Time capsules
CREATE TABLE public.time_capsules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text,
  mood text,
  tags text[],
  unlock_date timestamp with time zone NOT NULL,
  is_unlocked boolean DEFAULT false,
  unlocked_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ============================================
-- AI TABLES
-- ============================================

-- AI settings per user
CREATE TABLE public.ai_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  ai_enabled boolean NOT NULL DEFAULT true,
  depth public.meadow_depth NOT NULL DEFAULT 'balanced',
  creativity public.meadow_creativity NOT NULL DEFAULT 'plain',
  sensitive_mode boolean NOT NULL DEFAULT false,
  allow_anchor_quotes boolean NOT NULL DEFAULT true,
  preferred_length text DEFAULT 'medium',
  voice_style text DEFAULT 'warm',
  enabled_features text[] DEFAULT '{}',
  avoid_topics text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI cache
CREATE TABLE public.ai_cache (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  cache_key text NOT NULL,
  feature_key text NOT NULL,
  content jsonb NOT NULL,
  source_hash text,
  ttl_seconds integer NOT NULL DEFAULT 86400,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(cache_key, user_id)
);

-- AI artifacts
CREATE TABLE public.ai_artifacts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  feature_key text NOT NULL,
  artifact_type text NOT NULL,
  content jsonb NOT NULL,
  source_hash text,
  source_entry_ids uuid[] DEFAULT '{}',
  source_thread_id uuid,
  metadata jsonb DEFAULT '{}',
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI feedback
CREATE TABLE public.ai_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  artifact_id uuid REFERENCES public.ai_artifacts(id) ON DELETE SET NULL,
  feature_key text,
  feedback_type public.ai_feedback_type NOT NULL,
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI cues (detected patterns)
CREATE TABLE public.ai_cues (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  cue_type public.ai_cue_type NOT NULL,
  cue_text text NOT NULL,
  confidence double precision DEFAULT 0.5,
  source_entry_ids uuid[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  last_seen_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI runs (audit log)
CREATE TABLE public.ai_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  feature_key text NOT NULL,
  run_status public.ai_run_status NOT NULL DEFAULT 'ok',
  risk_level public.ai_risk DEFAULT 'none',
  model_used text,
  tokens_used integer,
  latency_ms integer,
  input_hash text,
  output_hash text,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI safety events
CREATE TABLE public.ai_safety_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  run_id uuid REFERENCES public.ai_runs(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  risk_level public.ai_risk NOT NULL,
  action_taken text,
  details jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI features configuration
CREATE TABLE public.ai_features (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_key text NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  is_enabled boolean NOT NULL DEFAULT true,
  requires_plan public.ai_plan NOT NULL DEFAULT 'free',
  min_entries_required integer DEFAULT 0,
  ttl_seconds integer DEFAULT 86400,
  cooldown_seconds integer DEFAULT 0,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI prompt templates
CREATE TABLE public.ai_prompt_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_key text NOT NULL,
  version integer NOT NULL DEFAULT 1,
  system_prompt text NOT NULL,
  user_prompt_template text NOT NULL,
  model text DEFAULT 'google/gemini-2.5-flash',
  temperature double precision DEFAULT 0.7,
  max_tokens integer DEFAULT 1000,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI output events
CREATE TABLE public.ai_output_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  feature_key text NOT NULL,
  artifact_id uuid REFERENCES public.ai_artifacts(id) ON DELETE SET NULL,
  output_fingerprint text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI redaction events
CREATE TABLE public.ai_redaction_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  entry_id uuid,
  chunk_id uuid,
  redaction_type text NOT NULL,
  patterns_matched text[] DEFAULT '{}',
  original_hash text,
  redacted_hash text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI resurface queue
CREATE TABLE public.ai_resurface_queue (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  entry_id uuid NOT NULL,
  priority integer DEFAULT 0,
  scheduled_for date,
  resurface_reason text,
  is_shown boolean DEFAULT false,
  shown_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI user avoidance patterns
CREATE TABLE public.ai_user_avoidance (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  avoidance_type text NOT NULL,
  pattern text NOT NULL,
  reason text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI voice policy (global)
CREATE TABLE public.ai_voice_policy (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  voice_rules jsonb NOT NULL DEFAULT '{}',
  banned_phrases text[] DEFAULT '{}',
  tone_guidelines text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI week theme
CREATE TABLE public.ai_week_theme (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  week_start date NOT NULL,
  theme_text text NOT NULL,
  supporting_cues jsonb DEFAULT '[]',
  source_entry_ids uuid[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- AI schema registry
CREATE TABLE public.ai_schema_registry (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schema_key text NOT NULL UNIQUE,
  json_schema jsonb NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ============================================
-- EMBEDDING/RAG TABLES
-- ============================================

-- Entry chunks (for vector search)
CREATE TABLE public.entry_chunks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  entry_id uuid NOT NULL,
  thread_id uuid,
  chunk_index integer NOT NULL DEFAULT 0,
  content_redacted text NOT NULL,
  content_hash text NOT NULL,
  embedding vector(1536),
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Embedding jobs queue
CREATE TABLE public.embedding_jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  entry_id uuid NOT NULL,
  job_status text NOT NULL DEFAULT 'pending',
  priority integer DEFAULT 0,
  attempts integer DEFAULT 0,
  last_error text,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Thread rollups (summaries)
CREATE TABLE public.thread_rollups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  thread_id uuid NOT NULL,
  rollup_type text NOT NULL DEFAULT 'summary',
  content jsonb NOT NULL,
  source_hash text,
  entry_count integer DEFAULT 0,
  last_entry_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_thread_id ON public.journal_entries(thread_id);
CREATE INDEX idx_journal_entries_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX idx_threads_user_id ON public.threads(user_id);
CREATE INDEX idx_mood_logs_user_id ON public.mood_logs(user_id);
CREATE INDEX idx_reflections_user_id ON public.reflections(user_id);
CREATE INDEX idx_intentions_user_id ON public.intentions(user_id);
CREATE INDEX idx_time_capsules_user_id ON public.time_capsules(user_id);
CREATE INDEX idx_ai_cache_lookup ON public.ai_cache(user_id, feature_key, cache_key);
CREATE INDEX idx_entry_chunks_user_id ON public.entry_chunks(user_id);
CREATE INDEX idx_entry_chunks_entry_id ON public.entry_chunks(entry_id);

-- Vector similarity search index
CREATE INDEX idx_entry_chunks_embedding ON public.entry_chunks 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Thread stats update function
CREATE OR REPLACE FUNCTION public.update_thread_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.thread_id IS DISTINCT FROM NEW.thread_id THEN
    IF OLD.thread_id IS NOT NULL THEN
      UPDATE public.threads 
      SET entry_count = (SELECT COUNT(*) FROM public.journal_entries WHERE thread_id = OLD.thread_id),
          last_entry_at = (SELECT MAX(created_at) FROM public.journal_entries WHERE thread_id = OLD.thread_id)
      WHERE id = OLD.thread_id;
    END IF;
  END IF;
  
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.thread_id IS NOT NULL THEN
      UPDATE public.threads 
      SET entry_count = (SELECT COUNT(*) FROM public.journal_entries WHERE thread_id = NEW.thread_id),
          last_entry_at = (SELECT MAX(created_at) FROM public.journal_entries WHERE thread_id = NEW.thread_id)
      WHERE id = NEW.thread_id;
    END IF;
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    IF OLD.thread_id IS NOT NULL THEN
      UPDATE public.threads 
      SET entry_count = (SELECT COUNT(*) FROM public.journal_entries WHERE thread_id = OLD.thread_id),
          last_entry_at = (SELECT MAX(created_at) FROM public.journal_entries WHERE thread_id = OLD.thread_id)
      WHERE id = OLD.thread_id;
    END IF;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Handle new user function (creates profile, settings, etc.)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  
  INSERT INTO public.user_state (user_id, stage, depth, creativity)
  VALUES (new.id, 'SEED', 'balanced', 'plain');
  
  INSERT INTO public.user_settings (user_id, theme, daily_reminder_enabled, weekly_digest_enabled)
  VALUES (new.id, 'system', false, true);
  
  INSERT INTO public.ai_settings (user_id, ai_enabled, depth, creativity, sensitive_mode, allow_anchor_quotes)
  VALUES (new.id, true, 'balanced', 'plain', false, true);
  
  RETURN new;
END;
$$;

-- Vector similarity search function
CREATE OR REPLACE FUNCTION public.match_entry_chunks(
  p_user_id uuid, 
  p_embedding vector, 
  p_match_count integer DEFAULT 5, 
  p_match_threshold double precision DEFAULT 0.7
)
RETURNS TABLE(
  id uuid, 
  entry_id uuid, 
  thread_id uuid, 
  chunk_index integer, 
  content_redacted text, 
  similarity double precision
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

-- ============================================
-- TRIGGERS
-- ============================================

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_state_updated_at BEFORE UPDATE ON public.user_state
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_threads_updated_at BEFORE UPDATE ON public.threads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_intentions_updated_at BEFORE UPDATE ON public.intentions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_time_capsules_updated_at BEFORE UPDATE ON public.time_capsules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ai_settings_updated_at BEFORE UPDATE ON public.ai_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Thread stats trigger
CREATE TRIGGER update_thread_stats_on_entry
  AFTER INSERT OR UPDATE OR DELETE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_thread_stats();

-- New user trigger (attach to auth.users)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feedback ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

-- User state policies
CREATE POLICY "Users can view own user_state" ON public.user_state FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_state" ON public.user_state FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_state" ON public.user_state FOR UPDATE USING (auth.uid() = user_id);

-- User subscriptions policies
CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subscription" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Threads policies
CREATE POLICY "Users can view their own threads" ON public.threads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own threads" ON public.threads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own threads" ON public.threads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own threads" ON public.threads FOR DELETE USING (auth.uid() = user_id);

-- Journal entries policies
CREATE POLICY "Users can view their own entries" ON public.journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own entries" ON public.journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own entries" ON public.journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own entries" ON public.journal_entries FOR DELETE USING (auth.uid() = user_id);

-- Mood logs policies
CREATE POLICY "Users can view their own mood logs" ON public.mood_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own mood logs" ON public.mood_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mood logs" ON public.mood_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mood logs" ON public.mood_logs FOR DELETE USING (auth.uid() = user_id);

-- Reflections policies
CREATE POLICY "Users can view their own reflections" ON public.reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own reflections" ON public.reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reflections" ON public.reflections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reflections" ON public.reflections FOR DELETE USING (auth.uid() = user_id);

-- Intentions policies
CREATE POLICY "Users can view their own intentions" ON public.intentions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own intentions" ON public.intentions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own intentions" ON public.intentions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own intentions" ON public.intentions FOR DELETE USING (auth.uid() = user_id);

-- Time capsules policies
CREATE POLICY "Users can view their own time capsules" ON public.time_capsules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own time capsules" ON public.time_capsules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own time capsules" ON public.time_capsules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own time capsules" ON public.time_capsules FOR DELETE USING (auth.uid() = user_id);

-- AI settings policies
CREATE POLICY "Users can view own ai_settings" ON public.ai_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai_settings" ON public.ai_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ai_settings" ON public.ai_settings FOR UPDATE USING (auth.uid() = user_id);

-- AI artifacts policies
CREATE POLICY "Users can view own ai_artifacts" ON public.ai_artifacts FOR SELECT USING (auth.uid() = user_id);

-- AI feedback policies
CREATE POLICY "Users can view own ai_feedback" ON public.ai_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ai_feedback" ON public.ai_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## SECTION 2: DATA IMPORT SQL

**Note:** User IDs reference auth.users which won't exist in your new project. You'll need to either:
1. Create test users first with the same UUIDs (not recommended)
2. Update the user_id values to match your new users
3. Skip data import and start fresh

Here's the current data (you'll need to adapt user_ids):

```sql
-- ============================================
-- DATA EXPORT FROM LOVABLE CLOUD
-- Exported: 2025-12-23
-- ============================================

-- Note: Replace user_id values with your actual user IDs from auth.users

-- AI Settings (4 rows)
INSERT INTO public.ai_settings (id, user_id, ai_enabled, depth, creativity, sensitive_mode, allow_anchor_quotes, preferred_length, voice_style, enabled_features, avoid_topics, created_at, updated_at)
VALUES 
  ('e44b5493-d683-488a-b25f-ddc8a03b9c63', '34c8ee77-4542-4f64-9209-43bd91333b1b', true, 'balanced', 'plain', false, true, 'medium', 'warm', '{}', '{}', '2025-12-21T10:25:49.601568+00:00', '2025-12-21T10:25:49.601568+00:00'),
  ('b8ea6edc-fe28-401c-ba60-9ffb32390478', '5258eb2b-9eef-40d5-9aca-02cc446186c8', true, 'balanced', 'plain', false, true, 'medium', 'warm', '{}', '{}', '2025-12-21T11:15:51.986318+00:00', '2025-12-21T11:15:51.986318+00:00'),
  ('960f9b69-0e81-4ac3-9c41-86c863b93d5d', '43a18645-fe01-4cfa-9579-cbdd6d594aed', true, 'balanced', 'plain', false, true, 'medium', 'warm', '{}', '{}', '2025-12-21T13:08:35.581618+00:00', '2025-12-21T13:08:35.581618+00:00'),
  ('7792c4cb-5115-4f4c-8c48-0de0b1f0f519', 'd990940c-071f-4d68-ae22-b2894d47a008', true, 'balanced', 'plain', false, true, 'medium', 'warm', '{}', '{}', '2025-12-21T20:05:00.042645+00:00', '2025-12-21T20:05:00.042645+00:00')
ON CONFLICT (id) DO NOTHING;

-- Intentions (1 row)
INSERT INTO public.intentions (id, user_id, title, description, category, status, progress, target_date, created_at, updated_at)
VALUES 
  ('dfbfb148-1a0e-422c-8b5c-57de7f17738e', '43a18645-fe01-4cfa-9579-cbdd6d594aed', 'learning to code', 'its a goal I want to focus on', 'career', 'active', 0, NULL, '2025-12-22T06:19:29.515402+00:00', '2025-12-22T06:19:29.515402+00:00')
ON CONFLICT (id) DO NOTHING;

-- Threads (3 rows)
INSERT INTO public.threads (id, user_id, name, description, color, entry_count, last_entry_at, created_at, updated_at)
VALUES 
  ('da64ddf0-7cf3-41e6-9b5f-4e5e66dd17cf', '43a18645-fe01-4cfa-9579-cbdd6d594aed', 'Moving', NULL, '#6B7B5E', 0, NULL, '2025-12-21T13:35:33.227882+00:00', '2025-12-21T13:35:33.227882+00:00'),
  ('2bd19af9-2efe-4bc4-88a6-e4cc33f13d15', '43a18645-fe01-4cfa-9579-cbdd6d594aed', 'Work', NULL, '#6B7B5E', 1, '2025-12-21T17:07:34.93299+00:00', '2025-12-21T16:09:57.568547+00:00', '2025-12-21T17:07:34.933057+00:00'),
  ('de7e57e9-1430-457b-9ef3-e8cdf9c5d2d5', '43a18645-fe01-4cfa-9579-cbdd6d594aed', 'Test', NULL, '#6B7B5E', 0, NULL, '2025-12-22T17:49:44.107247+00:00', '2025-12-22T17:49:44.107247+00:00')
ON CONFLICT (id) DO NOTHING;

-- Note: Journal entries, mood_logs, profiles, user_settings, user_state, user_subscriptions
-- contain user-specific data tied to auth.users IDs.
-- You should either:
-- 1. Start fresh with new users
-- 2. Export via the export-data edge function for your specific user
-- 3. Manually update the user_id references after creating users

-- To export YOUR data specifically, call:
-- POST /functions/v1/export-data (with your auth token)
```

---

## SECTION 3: STORAGE SQL

```sql
-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('voice-memos', 'voice-memos', true),
  ('avatars', 'avatars', true),
  ('exports', 'exports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for voice-memos bucket
CREATE POLICY "Users can upload voice memos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'voice-memos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their voice memos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'voice-memos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view voice memos" ON storage.objects
  FOR SELECT USING (bucket_id = 'voice-memos');

CREATE POLICY "Users can delete their voice memos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'voice-memos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for avatars bucket  
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for exports bucket (private)
CREATE POLICY "Users can view their own exports" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'exports' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can upload their own exports" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'exports' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own exports" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'exports' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## SECTION 4: EDGE FUNCTIONS

Copy these files to your `supabase/functions/` directory:

### 4.1 ai-reflection/index.ts

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, content, title, mood } = await req.json();
    
    // Replace LOVABLE_API_KEY with OPENAI_API_KEY for your own project
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "reflection_prompt") {
      systemPrompt = `You are a thoughtful journaling companion. Generate a single, thought-provoking follow-up question that encourages deeper self-reflection. Keep your response to just the question, nothing else.`;
      userPrompt = `Based on this journal entry, generate one reflection question:\n\nTitle: ${title || 'Untitled'}\nContent: ${content}`;
    } 
    else if (type === "insight") {
      systemPrompt = `You are a compassionate journaling AI. Provide a brief, supportive observation about what you notice in their entry. Keep your response to 1-2 sentences.`;
      userPrompt = `Provide a brief insight for this journal entry:\n\nTitle: ${title || 'Untitled'}\nMood: ${mood || 'not specified'}\nContent: ${content}`;
    }
    else if (type === "daily_prompt") {
      systemPrompt = `You are a creative journaling prompt generator. Generate a single, inspiring writing prompt.`;
      userPrompt = "Generate one unique daily journaling prompt.";
    }
    else {
      throw new Error("Invalid type. Use 'reflection_prompt', 'insight', or 'daily_prompt'");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

### 4.2 ai-generate/index.ts
(Full source in your project at `supabase/functions/ai-generate/index.ts`)
**Note:** Replace `LOVABLE_API_KEY` references with `OPENAI_API_KEY` and update the endpoint to `https://api.openai.com/v1/chat/completions`

### 4.3 check-subscription/index.ts
(Full source provided above - uses STRIPE_SECRET_KEY)

### 4.4 create-checkout/index.ts  
(Full source provided above - uses STRIPE_SECRET_KEY)

### 4.5 customer-portal/index.ts
(Full source provided above - uses STRIPE_SECRET_KEY)

### 4.6 delete-account/index.ts
(Full source provided above - uses SUPABASE_SERVICE_ROLE_KEY)

### 4.7 send-email/index.ts
(Full source provided above - uses RESEND_API_KEY)

### 4.8 export-data/index.ts
(Full source in your project)

---

## SECTION 5: ENVIRONMENT VARIABLES

### Required Secrets (set in Supabase Dashboard → Settings → Edge Functions → Secrets):

| Secret Name | Description | Where to Get |
|-------------|-------------|--------------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | [platform.openai.com](https://platform.openai.com/api-keys) |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) |
| `RESEND_API_KEY` | Resend API key for emails | [resend.com/api-keys](https://resend.com/api-keys) |

### Auto-Provided by Supabase (don't set manually):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`  
- `SUPABASE_SERVICE_ROLE_KEY`

### Frontend Environment Variables:

Create `.env.local` in your project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

---

## SECTION 6: FRONTEND CONFIG FILES TO UPDATE

### File: `lib/supabase.ts` or `src/integrations/supabase/client.ts`

Replace the Supabase client initialization:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

### File: `.env.local` (create if doesn't exist)

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...your_anon_key
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

---

## SECTION 7: MCP CONFIGURATION

### Option A: Supabase MCP Server (Recommended)

1. Generate access token: https://supabase.com/dashboard/account/tokens
2. Add to your MCP config (Cursor: `~/.cursor/mcp.json`, Claude: `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y", 
        "@supabase/mcp-server",
        "--project-ref",
        "YOUR_PROJECT_ID"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_xxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

### Option B: Direct PostgreSQL Access

Use your database password (from Supabase Dashboard → Settings → Database):

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres"
      ]
    }
  }
}
```

---

## SECTION 8: STRIPE PRODUCT IDS

If using Stripe, update these product IDs in the edge functions to match YOUR Stripe products:

**Current mappings (from Lovable Cloud):**
- Premium Plan: `prod_Tay6gr4CRAK4e1`
- Pro Plan: `prod_TdgrFoAQOPyfGs`

Create new products in your Stripe dashboard and update:
- `check-subscription/index.ts` (lines 79-82)
- `ai-generate/index.ts` (lines 90-91)

---

## Troubleshooting

### "Tenant or user not found" error
- Your database password or project ID is wrong
- Use the Supabase MCP server instead of raw Postgres

### RLS policy errors
- Make sure you're authenticated
- Check that user_id matches auth.uid()

### Edge function errors
- Check logs in Supabase Dashboard → Edge Functions → Logs
- Verify all secrets are set correctly

### Vector extension not working
- Run: `CREATE EXTENSION IF NOT EXISTS vector;`

---

## Support

- Supabase Docs: https://supabase.com/docs
- MCP Servers: https://github.com/modelcontextprotocol/servers
- Supabase MCP: https://github.com/supabase/mcp-server
