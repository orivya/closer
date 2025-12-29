-- Diagnostic queries to check why reflections aren't showing
-- Run these in Supabase SQL Editor

-- 1. Check if is_reflection column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'journal_entries' AND column_name = 'is_reflection';

-- 2. Check recent entries and their is_reflection status
SELECT 
  id,
  title,
  is_reflection,
  tags,
  created_at,
  user_id
FROM journal_entries
ORDER BY created_at DESC
LIMIT 10;

-- 3. Check entries that should be reflections (by tags)
SELECT 
  id,
  title,
  is_reflection,
  tags,
  created_at
FROM journal_entries
WHERE 
  tags @> '["guided-reflection"]'::jsonb
  OR tags @> '["reflection"]'::jsonb
  OR is_reflection = true
ORDER BY created_at DESC;

-- 4. Check if RLS policies allow reading reflections
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'journal_entries';

-- 5. Count entries by reflection status
SELECT 
  is_reflection,
  COUNT(*) as count
FROM journal_entries
GROUP BY is_reflection;

