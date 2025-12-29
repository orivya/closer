-- Create threads table for organizing journal entries
CREATE TABLE public.threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6B7B5E',
  entry_count INTEGER DEFAULT 0,
  last_entry_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own threads"
ON public.threads
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own threads"
ON public.threads
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads"
ON public.threads
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own threads"
ON public.threads
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_threads_updated_at
BEFORE UPDATE ON public.threads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key from journal_entries to threads
ALTER TABLE public.journal_entries
ADD CONSTRAINT fk_journal_entries_thread
FOREIGN KEY (thread_id) REFERENCES public.threads(id)
ON DELETE SET NULL;

-- Create function to update thread stats when entries change
CREATE OR REPLACE FUNCTION public.update_thread_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update old thread if changing threads
  IF TG_OP = 'UPDATE' AND OLD.thread_id IS DISTINCT FROM NEW.thread_id THEN
    IF OLD.thread_id IS NOT NULL THEN
      UPDATE public.threads 
      SET entry_count = (SELECT COUNT(*) FROM public.journal_entries WHERE thread_id = OLD.thread_id),
          last_entry_at = (SELECT MAX(created_at) FROM public.journal_entries WHERE thread_id = OLD.thread_id)
      WHERE id = OLD.thread_id;
    END IF;
  END IF;
  
  -- Update new thread
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    IF NEW.thread_id IS NOT NULL THEN
      UPDATE public.threads 
      SET entry_count = (SELECT COUNT(*) FROM public.journal_entries WHERE thread_id = NEW.thread_id),
          last_entry_at = (SELECT MAX(created_at) FROM public.journal_entries WHERE thread_id = NEW.thread_id)
      WHERE id = NEW.thread_id;
    END IF;
    RETURN NEW;
  END IF;
  
  -- Handle delete
  IF TG_OP = 'DELETE' THEN
    IF OLD.thread_id IS NOT NULL THEN
      UPDATE public.threads 
      SET entry_count = (SELECT COUNT(*) FROM public.journal_entries WHERE thread_id = OLD.thread_id),
          last_entry_at = (SELECT MAX(created_at) FROM public.journal_entries WHERE thread_id = OLD.thread_id)
      WHERE id = OLD.thread_id;
    END IF;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Create trigger for thread stats
CREATE TRIGGER update_thread_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_thread_stats();