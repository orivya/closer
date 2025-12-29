-- Add intention_id linking journal entries to an intention
ALTER TABLE public.journal_entries
ADD COLUMN IF NOT EXISTS intention_id uuid;

DO $$ BEGIN
  ALTER TABLE public.journal_entries
    ADD CONSTRAINT fk_journal_entries_intention
    FOREIGN KEY (intention_id) REFERENCES public.intentions(id) ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_journal_entries_intention_id ON public.journal_entries(intention_id);


