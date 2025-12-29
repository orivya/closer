-- =============================================================================
-- Secure User State Update Trigger
-- =============================================================================
-- This trigger automatically recalculates user progress (stage, entry counts)
-- whenever a new journal entry is created. It runs with elevated permissions
-- (SECURITY DEFINER) so the user cannot manually spoof their stage.
-- =============================================================================

-- Create or replace function to update user state after entry creation
CREATE OR REPLACE FUNCTION public.handle_new_entry_state_update()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_total_count int;
  v_count_7d int;
  v_count_30d int;
  v_new_stage meadow_stage;
BEGIN
  v_user_id := NEW.user_id;

  -- Get total entry count
  SELECT COUNT(*) INTO v_total_count
  FROM public.journal_entries
  WHERE user_id = v_user_id;

  -- Get 7-day entry count
  SELECT COUNT(*) INTO v_count_7d
  FROM public.journal_entries
  WHERE user_id = v_user_id
    AND created_at >= (now() - interval '7 days');

  -- Get 30-day entry count
  SELECT COUNT(*) INTO v_count_30d
  FROM public.journal_entries
  WHERE user_id = v_user_id
    AND created_at >= (now() - interval '30 days');

  -- Determine stage based on total count
  IF v_total_count >= 75 THEN
    v_new_stage := 'THRIVE';
  ELSIF v_total_count >= 30 THEN
    v_new_stage := 'BLOOM';
  ELSIF v_total_count >= 15 THEN
    v_new_stage := 'GROW';
  ELSIF v_total_count >= 5 THEN
    v_new_stage := 'SPROUT';
  ELSE
    v_new_stage := 'SEED';
  END IF;

  -- Upsert user_state (insert if not exists, else update)
  INSERT INTO public.user_state (user_id, stage, entry_count_7d, entry_count_30d, last_entry_at, updated_at)
  VALUES (v_user_id, v_new_stage, v_count_7d, v_count_30d, now(), now())
  ON CONFLICT (user_id) DO UPDATE SET
    stage = v_new_stage,
    entry_count_7d = v_count_7d,
    entry_count_30d = v_count_30d,
    last_entry_at = now(),
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if it exists to allow re-running migration
DROP TRIGGER IF EXISTS on_entry_created_update_state ON public.journal_entries;

-- Create the trigger
CREATE TRIGGER on_entry_created_update_state
  AFTER INSERT ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_entry_state_update();

-- =============================================================================
-- DONE
-- =============================================================================
