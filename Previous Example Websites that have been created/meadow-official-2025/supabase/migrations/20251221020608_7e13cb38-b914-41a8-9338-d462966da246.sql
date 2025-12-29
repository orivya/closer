-- Add AI control booleans to ai_settings table
ALTER TABLE public.ai_settings
ADD COLUMN ai_enabled boolean NOT NULL DEFAULT true,
ADD COLUMN sensitive_mode boolean NOT NULL DEFAULT false,
ADD COLUMN allow_anchor_quotes boolean NOT NULL DEFAULT true;

-- Add comments for documentation
COMMENT ON COLUMN public.ai_settings.ai_enabled IS 'Global kill-switch to disable ALL AI features for this user';
COMMENT ON COLUMN public.ai_settings.sensitive_mode IS 'When true, AI only sees rollups/summaries, never raw recent entries';
COMMENT ON COLUMN public.ai_settings.allow_anchor_quotes IS 'When true, AI can include short quote snippets (≤12 words) from user entries';