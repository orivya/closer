
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS ai_opt_out BOOLEAN DEFAULT false;
