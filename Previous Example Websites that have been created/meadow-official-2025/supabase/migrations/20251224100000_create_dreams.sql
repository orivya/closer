-- Create dreams table for Dream Journal feature
CREATE TABLE public.dreams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  symbols TEXT[] DEFAULT '{}',
  emotions TEXT[] DEFAULT '{}',
  people TEXT[] DEFAULT '{}',
  theme TEXT,
  interpretation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dreams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own dreams" ON public.dreams FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own dreams" ON public.dreams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own dreams" ON public.dreams FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own dreams" ON public.dreams FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_dreams_updated_at BEFORE UPDATE ON public.dreams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_dreams_user_id ON public.dreams(user_id);
CREATE INDEX idx_dreams_created_at ON public.dreams(created_at DESC);
