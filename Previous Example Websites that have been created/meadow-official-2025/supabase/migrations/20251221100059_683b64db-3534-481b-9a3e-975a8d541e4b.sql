-- Add missing RLS policies for user_state so users can update their own state
CREATE POLICY "Users can update own user_state"
ON public.user_state
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user_state"
ON public.user_state
FOR INSERT
WITH CHECK (auth.uid() = user_id);