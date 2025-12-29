-- Create storage bucket for voice memos
INSERT INTO storage.buckets (id, name, public)
VALUES ('voice-memos', 'voice-memos', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own voice memos
CREATE POLICY "Users can upload their own voice memos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'voice-memos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to view their own voice memos
CREATE POLICY "Users can view their own voice memos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'voice-memos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own voice memos
CREATE POLICY "Users can delete their own voice memos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'voice-memos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add audio_url column to journal_entries
ALTER TABLE public.journal_entries
ADD COLUMN IF NOT EXISTS audio_url text;