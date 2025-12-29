
-- Performance Indexes for high-volume tables

-- Journal Entries: filtering by user + sorting by date is the most common query
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_created ON public.journal_entries(user_id, created_at DESC);

-- Mood Logs: filtering by user + date range
CREATE INDEX IF NOT EXISTS idx_mood_logs_user_logged ON public.mood_logs(user_id, logged_at DESC);

-- Threads: filtering by user
CREATE INDEX IF NOT EXISTS idx_threads_user ON public.threads(user_id);

-- Time Capsules: filtering by user + unlock date
CREATE INDEX IF NOT EXISTS idx_time_capsules_user_unlock ON public.time_capsules(user_id, unlock_date);

-- Intentions: filtering by user + status
CREATE INDEX IF NOT EXISTS idx_intentions_user_status ON public.intentions(user_id, status);
