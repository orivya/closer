-- Add new columns to insights table for Cerexi-style cards
ALTER TABLE insights ADD COLUMN IF NOT EXISTS context text;
ALTER TABLE insights ADD COLUMN IF NOT EXISTS resolved boolean DEFAULT false;
ALTER TABLE insights ADD COLUMN IF NOT EXISTS dismissed boolean DEFAULT false;

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_insights_dismissed ON insights(dismissed);
CREATE INDEX IF NOT EXISTS idx_insights_resolved ON insights(resolved);