-- Drop existing restrictive policies on sessions and recreate as permissive
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can insert their own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can delete their own sessions" ON public.sessions;

-- Create permissive policies for sessions
CREATE POLICY "Users can view their own sessions" 
ON public.sessions 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" 
ON public.sessions 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
ON public.sessions 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" 
ON public.sessions 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Also fix messages policies
DROP POLICY IF EXISTS "Users can view messages in their sessions" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages in their sessions" ON public.messages;
DROP POLICY IF EXISTS "Users can update messages in their sessions" ON public.messages;
DROP POLICY IF EXISTS "Users can delete messages in their sessions" ON public.messages;

CREATE POLICY "Users can view messages in their sessions" 
ON public.messages 
FOR SELECT 
TO authenticated
USING (user_owns_session(session_id));

CREATE POLICY "Users can insert messages in their sessions" 
ON public.messages 
FOR INSERT 
TO authenticated
WITH CHECK (user_owns_session(session_id));

CREATE POLICY "Users can update messages in their sessions" 
ON public.messages 
FOR UPDATE 
TO authenticated
USING (user_owns_session(session_id));

CREATE POLICY "Users can delete messages in their sessions" 
ON public.messages 
FOR DELETE 
TO authenticated
USING (user_owns_session(session_id));

-- Fix insights policies
DROP POLICY IF EXISTS "Users can view their own insights" ON public.insights;
DROP POLICY IF EXISTS "Users can insert their own insights" ON public.insights;
DROP POLICY IF EXISTS "Users can update their own insights" ON public.insights;
DROP POLICY IF EXISTS "Users can delete their own insights" ON public.insights;

CREATE POLICY "Users can view their own insights" 
ON public.insights 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own insights" 
ON public.insights 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights" 
ON public.insights 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own insights" 
ON public.insights 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);