-- =============================================
-- ORIVYA DATABASE SCHEMA
-- =============================================

-- =============================================
-- TABLE 1: PROFILES
-- =============================================
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  personality text DEFAULT 'balanced' CHECK (personality IN ('gentle', 'balanced', 'direct', 'warm', 'curious', 'analytical')),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- TABLE 2: SESSIONS
-- =============================================
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON public.sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON public.sessions FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);

-- =============================================
-- TABLE 3: MESSAGES
-- =============================================
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Function to check if user owns the session
CREATE OR REPLACE FUNCTION public.user_owns_session(session_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sessions
    WHERE id = session_uuid AND user_id = auth.uid()
  )
$$;

CREATE POLICY "Users can view messages in their sessions"
  ON public.messages FOR SELECT
  USING (public.user_owns_session(session_id));

CREATE POLICY "Users can insert messages in their sessions"
  ON public.messages FOR INSERT
  WITH CHECK (public.user_owns_session(session_id));

CREATE POLICY "Users can update messages in their sessions"
  ON public.messages FOR UPDATE
  USING (public.user_owns_session(session_id));

CREATE POLICY "Users can delete messages in their sessions"
  ON public.messages FOR DELETE
  USING (public.user_owns_session(session_id));

CREATE INDEX idx_messages_session_id ON public.messages(session_id);

-- =============================================
-- TABLE 4: INSIGHTS
-- =============================================
CREATE TABLE public.insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.sessions(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('theme', 'observation', 'constraint', 'strength', 'blind_spot', 'shift', 'next_move', 'turning_point')),
  content text NOT NULL,
  category text,
  starred boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own insights"
  ON public.insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own insights"
  ON public.insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights"
  ON public.insights FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights"
  ON public.insights FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_insights_user_id ON public.insights(user_id);
CREATE INDEX idx_insights_category ON public.insights(category);

-- =============================================
-- TABLE 5: DECISIONS
-- =============================================
CREATE TABLE public.decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  context text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  category text,
  starred boolean DEFAULT false,
  resolved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own decisions"
  ON public.decisions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own decisions"
  ON public.decisions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decisions"
  ON public.decisions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decisions"
  ON public.decisions FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_decisions_user_id ON public.decisions(user_id);
CREATE INDEX idx_decisions_category ON public.decisions(category);

-- =============================================
-- TABLE 6: REFLECTIONS
-- =============================================
CREATE TABLE public.reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text,
  content text NOT NULL,
  category text,
  starred boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reflections"
  ON public.reflections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reflections"
  ON public.reflections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections"
  ON public.reflections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reflections"
  ON public.reflections FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_reflections_user_id ON public.reflections(user_id);
CREATE INDEX idx_reflections_category ON public.reflections(category);

-- =============================================
-- TRIGGERS: Auto-update updated_at
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reflections_updated_at
  BEFORE UPDATE ON public.reflections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TRIGGER: Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, personality)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    COALESCE(NEW.raw_user_meta_data ->> 'personality', 'balanced')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();