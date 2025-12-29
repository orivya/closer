-- Create decisions table
CREATE TABLE public.decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'decided', 'archived')),
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  final_decision TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own decisions" ON public.decisions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own decisions" ON public.decisions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own decisions" ON public.decisions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own decisions" ON public.decisions FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_decisions_updated_at BEFORE UPDATE ON public.decisions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
