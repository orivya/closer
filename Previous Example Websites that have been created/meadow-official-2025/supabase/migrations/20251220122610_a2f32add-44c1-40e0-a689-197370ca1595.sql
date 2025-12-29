-- Create intentions table for goal tracking
CREATE TABLE public.intentions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'archived')),
  target_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.intentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own intentions" ON public.intentions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own intentions" ON public.intentions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own intentions" ON public.intentions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own intentions" ON public.intentions FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_intentions_updated_at BEFORE UPDATE ON public.intentions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create time_capsules table for Time Vault feature
CREATE TABLE public.time_capsules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  unlock_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  mood TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.time_capsules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own time capsules" ON public.time_capsules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own time capsules" ON public.time_capsules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own time capsules" ON public.time_capsules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own time capsules" ON public.time_capsules FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_time_capsules_updated_at BEFORE UPDATE ON public.time_capsules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create mood_logs table for mood tracking history
CREATE TABLE public.mood_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood TEXT NOT NULL,
  intensity INTEGER DEFAULT 5 CHECK (intensity >= 1 AND intensity <= 10),
  notes TEXT,
  factors TEXT[],
  entry_id UUID REFERENCES public.journal_entries(id) ON DELETE SET NULL,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mood logs" ON public.mood_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own mood logs" ON public.mood_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mood logs" ON public.mood_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mood logs" ON public.mood_logs FOR DELETE USING (auth.uid() = user_id);

-- Create reflections table for AI-generated reflections
CREATE TABLE public.reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_id UUID REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  thread_id UUID REFERENCES public.threads(id) ON DELETE SET NULL,
  reflection_type TEXT DEFAULT 'entry' CHECK (reflection_type IN ('entry', 'weekly', 'monthly', 'thread', 'custom')),
  content TEXT NOT NULL,
  prompt_used TEXT,
  model_used TEXT DEFAULT 'gpt-4o-mini',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reflections" ON public.reflections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own reflections" ON public.reflections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reflections" ON public.reflections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reflections" ON public.reflections FOR DELETE USING (auth.uid() = user_id);

-- Create user_subscriptions table for premium features
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'lifetime')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subscription" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON public.user_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create app settings table for user preferences
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  daily_reminder_enabled BOOLEAN DEFAULT false,
  daily_reminder_time TIME DEFAULT '09:00:00',
  weekly_digest_enabled BOOLEAN DEFAULT true,
  app_lock_enabled BOOLEAN DEFAULT false,
  export_format TEXT DEFAULT 'markdown' CHECK (export_format IN ('markdown', 'json', 'pdf')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create exports storage bucket (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('exports', 'exports', false);

-- Storage policies for exports
CREATE POLICY "Users can view their own exports" ON storage.objects FOR SELECT USING (bucket_id = 'exports' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can upload their own exports" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'exports' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own exports" ON storage.objects FOR DELETE USING (bucket_id = 'exports' AND auth.uid()::text = (storage.foldername(name))[1]);