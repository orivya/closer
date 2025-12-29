-- Add summary field to sessions table for storing conversation summaries
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS summary text;