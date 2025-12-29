-- ============================================================================
-- PHASE 09: MESSAGING & INBOX SYSTEM ENHANCEMENTS
-- MixExperts Master Launch Blueprint
-- Created: December 28, 2025
-- ============================================================================

-- Stage 1: Add Inquiry Fields to Messages Table
-- ============================================================================

-- Add subject field for inquiry system
ALTER TABLE messages ADD COLUMN IF NOT EXISTS subject TEXT;

-- Add fields to support guest/unauthenticated senders (public inquiries)
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_email TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS sender_name TEXT;

-- Add inquiry status tracking
ALTER TABLE messages ADD COLUMN IF NOT EXISTS inquiry_status TEXT
  CHECK (inquiry_status IN ('new', 'read', 'replied', 'converted', 'archived'));

-- Make sender_id nullable for guest inquiries
ALTER TABLE messages ALTER COLUMN sender_id DROP NOT NULL;

-- Add index for inquiry filtering
CREATE INDEX IF NOT EXISTS idx_messages_inquiry_status ON messages(recipient_id, inquiry_status)
  WHERE is_inquiry = true;

CREATE INDEX IF NOT EXISTS idx_messages_thread_created ON messages(thread_id, created_at DESC);

-- Update comments
COMMENT ON COLUMN messages.subject IS 'Message subject line, primarily for inquiry threads';
COMMENT ON COLUMN messages.sender_email IS 'Email of guest sender (when sender_id is null)';
COMMENT ON COLUMN messages.sender_name IS 'Name of guest sender (when sender_id is null)';
COMMENT ON COLUMN messages.inquiry_status IS 'Tracks inquiry lifecycle: new → read → replied → converted → archived';

-- Stage 2: Create Message Templates Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Template details
  name TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,

  -- Organization
  category TEXT CHECK (category IN ('inquiry_response', 'follow_up', 'status_update', 'general', 'custom')),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_templates_profile_id ON message_templates(profile_id);
CREATE INDEX IF NOT EXISTS idx_message_templates_is_active ON message_templates(profile_id, is_active);
CREATE INDEX IF NOT EXISTS idx_message_templates_category ON message_templates(profile_id, category);

COMMENT ON TABLE message_templates IS 'Reusable message templates for quick replies';

-- Stage 3: RLS Policies for Message Templates
-- ============================================================================
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates"
  ON message_templates FOR SELECT
  USING (profile_id = auth.uid());

CREATE POLICY "Users can create own templates"
  ON message_templates FOR INSERT
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update own templates"
  ON message_templates FOR UPDATE
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can delete own templates"
  ON message_templates FOR DELETE
  USING (profile_id = auth.uid());

-- Stage 4: Update Messages RLS Policies for Guest Inquiries
-- ============================================================================

-- Drop existing policies and recreate with guest support
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can view sent messages" ON messages;
DROP POLICY IF EXISTS "Users can view received messages" ON messages;

-- Allow viewing sent messages (for authenticated users)
CREATE POLICY "Users can view sent messages"
  ON messages FOR SELECT
  USING (sender_id = auth.uid());

-- Allow viewing received messages (including guest inquiries)
CREATE POLICY "Users can view received messages"
  ON messages FOR SELECT
  USING (recipient_id = auth.uid());

-- Allow sending messages (authenticated users)
CREATE POLICY "Authenticated users can send messages"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Allow sending inquiries (guest users - no auth required)
-- This policy allows inserting messages where sender_id is null but sender_email is provided
CREATE POLICY "Guests can send inquiries"
  ON messages FOR INSERT
  WITH CHECK (
    is_inquiry = true AND
    sender_id IS NULL AND
    sender_email IS NOT NULL AND
    sender_name IS NOT NULL
  );

-- Stage 5: Add Updated_at Trigger for Message Templates
-- ============================================================================
DROP TRIGGER IF EXISTS set_updated_at ON message_templates;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON message_templates
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Stage 6: Create Function to Get Thread Unread Count
-- ============================================================================
CREATE OR REPLACE FUNCTION get_thread_unread_count(p_thread_id UUID, p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM messages
    WHERE thread_id = p_thread_id
      AND recipient_id = p_user_id
      AND is_read = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_thread_unread_count IS 'Returns the count of unread messages in a thread for a specific user';

-- Stage 7: Create Function to Mark Thread as Read
-- ============================================================================
CREATE OR REPLACE FUNCTION mark_thread_as_read(p_thread_id UUID, p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE messages
  SET is_read = true, read_at = NOW()
  WHERE thread_id = p_thread_id
    AND recipient_id = p_user_id
    AND is_read = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION mark_thread_as_read IS 'Marks all messages in a thread as read for a specific user';

-- Stage 8: Create View for Thread Summary
-- ============================================================================
CREATE OR REPLACE VIEW message_thread_summary AS
SELECT
  m.thread_id,
  m.recipient_id,
  m.sender_id,
  m.sender_email,
  m.sender_name,
  m.subject,
  m.is_inquiry,
  m.inquiry_status,
  m.order_id,

  -- Latest message details
  (SELECT content FROM messages WHERE thread_id = m.thread_id ORDER BY created_at DESC LIMIT 1) as latest_message,
  (SELECT created_at FROM messages WHERE thread_id = m.thread_id ORDER BY created_at DESC LIMIT 1) as latest_message_at,

  -- Unread count
  (SELECT COUNT(*)::INTEGER FROM messages WHERE thread_id = m.thread_id AND recipient_id = m.recipient_id AND is_read = false) as unread_count,

  -- Total message count
  (SELECT COUNT(*)::INTEGER FROM messages WHERE thread_id = m.thread_id) as message_count,

  -- Sender profile (if authenticated)
  p.username as sender_username,
  p.display_name as sender_display_name,
  p.avatar_url as sender_avatar_url,

  -- First message timestamp
  (SELECT created_at FROM messages WHERE thread_id = m.thread_id ORDER BY created_at ASC LIMIT 1) as thread_started_at

FROM messages m
LEFT JOIN profiles p ON p.id = m.sender_id
WHERE m.id = (
  SELECT id FROM messages WHERE thread_id = m.thread_id ORDER BY created_at DESC LIMIT 1
);

COMMENT ON VIEW message_thread_summary IS 'Aggregated view of message threads with latest message and unread counts';

-- ============================================================================
-- END OF PHASE 09: MESSAGING & INBOX SYSTEM ENHANCEMENTS
-- ============================================================================
