-- Create journey_progress table for per-user journey progress (guided journeys)
CREATE TABLE public.journey_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  journey_id TEXT NOT NULL,
  completed_steps INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, journey_id)
);

ALTER TABLE public.journey_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own journey progress" ON public.journey_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journey progress" ON public.journey_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journey progress" ON public.journey_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journey progress" ON public.journey_progress
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_journey_progress_updated_at
  BEFORE UPDATE ON public.journey_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


