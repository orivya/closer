ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS intent TEXT,
ADD COLUMN IF NOT EXISTS reminder_days TEXT[] DEFAULT '{}';
