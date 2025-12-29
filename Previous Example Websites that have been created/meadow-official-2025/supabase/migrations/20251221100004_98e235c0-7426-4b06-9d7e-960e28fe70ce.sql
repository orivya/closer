-- Update handle_new_user function to initialize all required user tables
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  
  -- Create user_state with default SEED stage
  INSERT INTO public.user_state (user_id, stage, depth, creativity)
  VALUES (new.id, 'SEED', 'balanced', 'plain');
  
  -- Create user_settings with defaults
  INSERT INTO public.user_settings (user_id, theme, daily_reminder_enabled, weekly_digest_enabled)
  VALUES (new.id, 'system', false, true);
  
  -- Create ai_settings with defaults
  INSERT INTO public.ai_settings (user_id, ai_enabled, depth, creativity, sensitive_mode, allow_anchor_quotes)
  VALUES (new.id, true, 'balanced', 'plain', false, true);
  
  RETURN new;
END;
$$;