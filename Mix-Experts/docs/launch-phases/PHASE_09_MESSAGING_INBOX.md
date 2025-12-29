# PHASE 09: Messaging & Inbox System

**Priority:** HIGH
**Estimated Effort:** 3-4 days
**Dependencies:** Phase 2 (Authentication), Database Foundation
**Status:** NOT STARTED

---

## Overview

This phase implements a complete messaging and inquiry system that allows:
- Public profile visitors to send inquiries to engineers
- Engineers to manage conversations in a unified inbox
- Tracking inquiry lifecycle from initial contact to conversion
- Message templates for quick responses
- Real-time updates and notifications
- Conversion tracking when inquiries become bookings

---

## Database Requirements

Ensure the `messages` table exists with the following structure:

```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL,
  sender_id UUID REFERENCES public.profiles(id),
  recipient_id UUID REFERENCES public.profiles(id) NOT NULL,
  sender_email TEXT,
  sender_name TEXT,
  subject TEXT,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_inquiry BOOLEAN DEFAULT false,
  inquiry_status TEXT DEFAULT 'new' CHECK (inquiry_status IN ('new', 'read', 'replied', 'converted', 'archived')),
  order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Message templates table
CREATE TABLE public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  shortcut TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Message attachments table
CREATE TABLE public.message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size_bytes BIGINT,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Implementation Stages

### Stage 9.1: Create useMessages Hook for Data Fetching
**Status:** [ ] NOT STARTED
**Files:** `src/hooks/useMessages.ts` (new)

**Implementation Details:**
```typescript
// Create custom hook for fetching messages
export function useMessages(recipientId: string) {
  // Fetch all messages where recipient_id = recipientId
  // Group by thread_id
  // Calculate unread count per thread
  // Sort threads by most recent message
  // Return: { threads, loading, error, refetch }
}

// Features:
- Real-time subscription to new messages
- Group messages by thread_id
- Calculate unread count badge
- Auto-refresh on new messages
- Error handling and retry logic
```

**Checklist:**
- [ ] Create `src/hooks/useMessages.ts`
- [ ] Implement Supabase query to fetch messages
- [ ] Group messages by `thread_id`
- [ ] Calculate unread count per thread
- [ ] Sort threads by latest message timestamp
- [ ] Add loading and error states
- [ ] Export TypeScript interfaces for Message and Thread types
- [ ] Test with mock data

---

### Stage 9.2: Create useThread Hook for Individual Threads
**Status:** [ ] NOT STARTED
**Files:** `src/hooks/useThread.ts` (new)

**Implementation Details:**
```typescript
// Create hook for fetching individual thread messages
export function useThread(threadId: string) {
  // Fetch all messages for specific thread_id
  // Sort chronologically (oldest to newest)
  // Mark messages as read when viewed
  // Return: { messages, loading, error, markAsRead, sendReply }
}

// Features:
- Fetch all messages in a thread
- Real-time updates for new replies
- Mark as read functionality
- Send reply functionality
- Optimistic UI updates
```

**Checklist:**
- [ ] Create `src/hooks/useThread.ts`
- [ ] Fetch messages by thread_id
- [ ] Sort messages chronologically
- [ ] Implement `markAsRead` mutation
- [ ] Implement `sendReply` mutation
- [ ] Add real-time subscription for new messages in thread
- [ ] Handle optimistic updates for new messages
- [ ] Test read/unread state changes

---

### Stage 9.3: Wire Dashboard Inbox Page to Database
**Status:** [ ] NOT STARTED
**Files:** `src/app/dashboard/inbox/page.tsx`

**Implementation Details:**
```typescript
// Replace mock data with real database queries
// Use useMessages hook to fetch threads
// Display loading skeleton while fetching
// Handle empty state (no messages)
// Handle error state

import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';

export default function InboxPage() {
  const { profile } = useAuth();
  const { threads, loading, error } = useMessages(profile.id);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState />;
  if (!threads.length) return <EmptyState />;

  // Render inbox with real data
}
```

**Checklist:**
- [ ] Import `useMessages` hook
- [ ] Remove mock CONVERSATIONS data
- [ ] Implement loading skeleton
- [ ] Implement error state UI
- [ ] Implement empty state ("No messages yet")
- [ ] Wire threads data to InboxList component
- [ ] Test with real database data
- [ ] Verify RLS policies allow access

---

### Stage 9.4: Display Message Threads Grouped by Conversation
**Status:** [ ] NOT STARTED
**Files:** `src/components/dashboard/inbox/InboxList.tsx`

**Implementation Details:**
```typescript
// Each thread shows:
// - Latest message preview
// - Sender name and avatar
// - Timestamp of last message
// - Unread indicator
// - Inquiry status badge

interface Thread {
  thread_id: string;
  latest_message: Message;
  participant: Profile;
  unread_count: number;
  inquiry_status: 'new' | 'read' | 'replied' | 'converted' | 'archived';
}
```

**Checklist:**
- [ ] Update InboxList to accept threads array prop
- [ ] Display participant avatar (use sender info)
- [ ] Show latest message preview (truncated)
- [ ] Display formatted timestamp (e.g., "10m ago", "Yesterday")
- [ ] Show unread count badge if > 0
- [ ] Display inquiry status badge with color coding
- [ ] Implement click handler to select thread
- [ ] Add hover effects and active state styling

---

### Stage 9.5: Show Unread Count Badge
**Status:** [ ] NOT STARTED
**Files:** `src/components/dashboard/inbox/InboxList.tsx`, `src/app/dashboard/layout.tsx`

**Implementation Details:**
```typescript
// Badge appears:
// 1. On each thread in inbox list (unread count for that thread)
// 2. On inbox navigation link in dashboard sidebar (total unread)

// Unread count calculation:
const unreadCount = messages.filter(m =>
  !m.is_read && m.recipient_id === currentUserId
).length;
```

**Checklist:**
- [ ] Calculate unread count per thread in useMessages hook
- [ ] Display badge on thread list items
- [ ] Calculate total unread count across all threads
- [ ] Add badge to dashboard sidebar inbox link
- [ ] Style badge with accent color and glow effect
- [ ] Update count in real-time when messages are read
- [ ] Test with multiple unread messages

---

### Stage 9.6: Show Inquiry Status (new, read, replied, converted, archived)
**Status:** [ ] NOT STARTED
**Files:** `src/components/dashboard/inbox/InboxList.tsx`, `src/lib/constants.ts`

**Implementation Details:**
```typescript
// Status badge with color coding:
const INQUIRY_STATUS_CONFIG = {
  new: { label: 'New', color: 'blue', icon: 'Sparkles' },
  read: { label: 'Read', color: 'gray', icon: 'Eye' },
  replied: { label: 'Replied', color: 'green', icon: 'Reply' },
  converted: { label: 'Booked', color: 'purple', icon: 'Check' },
  archived: { label: 'Archived', color: 'gray', icon: 'Archive' }
};

// Only show for inquiries (is_inquiry = true)
```

**Checklist:**
- [ ] Create inquiry status config constants
- [ ] Add status badge component
- [ ] Display badge on thread items where is_inquiry = true
- [ ] Color-code badges by status
- [ ] Add icons for each status type
- [ ] Show tooltip on hover with status description
- [ ] Filter threads by status (dropdown filter)
- [ ] Test status transitions

---

### Stage 9.7: Create Thread Detail View
**Status:** [ ] NOT STARTED
**Files:** `src/components/dashboard/inbox/InboxThread.tsx`

**Implementation Details:**
```typescript
// Wire to useThread hook
// Display all messages chronologically
// Show sender info for each message
// Distinguish between sent/received messages
// Display timestamps
// Auto-scroll to latest message

export const InboxThread = ({ threadId }: { threadId: string }) => {
  const { messages, loading, markAsRead } = useThread(threadId);

  useEffect(() => {
    markAsRead(threadId);
  }, [threadId]);

  return (
    <div className="flex flex-col h-full">
      <ThreadHeader />
      <MessageList messages={messages} />
      <ReplyComposer threadId={threadId} />
    </div>
  );
};
```

**Checklist:**
- [ ] Update InboxThread to accept threadId prop
- [ ] Remove mock message data
- [ ] Fetch messages using useThread hook
- [ ] Implement loading state
- [ ] Display messages chronologically
- [ ] Style sent vs received messages differently
- [ ] Add message timestamps
- [ ] Auto-scroll to bottom on load
- [ ] Display participant info in header

---

### Stage 9.8: Display Messages Chronologically
**Status:** [ ] NOT STARTED
**Files:** `src/components/dashboard/inbox/InboxThread.tsx`

**Implementation Details:**
```typescript
// Message list component:
// - Sort by created_at ASC (oldest first)
// - Group by date (show date dividers)
// - Align sent messages right, received left
// - Show avatar for received messages
// - Show timestamp on hover or below message

const MessageList = ({ messages }) => {
  const groupedByDate = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {groupedByDate.map(({ date, messages }) => (
        <div key={date}>
          <DateDivider date={date} />
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      ))}
    </div>
  );
};
```

**Checklist:**
- [ ] Sort messages by created_at timestamp
- [ ] Group messages by date
- [ ] Create date divider component
- [ ] Style message bubbles (sent vs received)
- [ ] Add avatar for received messages
- [ ] Display timestamp (format: "10:42 AM")
- [ ] Show relative time on hover (e.g., "2 hours ago")
- [ ] Implement auto-scroll to latest message
- [ ] Add smooth scroll behavior

---

### Stage 9.9: Mark Messages as Read on View
**Status:** [ ] NOT STARTED
**Files:** `src/hooks/useThread.ts`, `src/components/dashboard/inbox/InboxThread.tsx`

**Implementation Details:**
```typescript
// When thread is opened:
// 1. Find all unread messages where recipient = current user
// 2. Update is_read = true
// 3. Update inquiry_status from 'new' to 'read' (if applicable)
// 4. Trigger unread count refresh in inbox list

const markAsRead = async (threadId: string) => {
  await supabase
    .from('messages')
    .update({
      is_read: true,
      inquiry_status: supabase.raw(`
        CASE
          WHEN inquiry_status = 'new' THEN 'read'
          ELSE inquiry_status
        END
      `)
    })
    .eq('thread_id', threadId)
    .eq('recipient_id', currentUserId)
    .eq('is_read', false);
};
```

**Checklist:**
- [ ] Create markAsRead function in useThread hook
- [ ] Call markAsRead when thread is opened
- [ ] Update is_read field in database
- [ ] Update inquiry_status from 'new' to 'read'
- [ ] Trigger refetch of inbox threads (update unread count)
- [ ] Show visual feedback (unread badge disappears)
- [ ] Test with multiple unread messages
- [ ] Verify RLS policies allow update

---

### Stage 9.10: Create Reply Composer
**Status:** [ ] NOT STARTED
**Files:** `src/components/dashboard/inbox/ReplyComposer.tsx` (new)

**Implementation Details:**
```typescript
// Reply composer at bottom of thread:
// - Auto-resize textarea
// - Character count indicator
// - Attach file button (optional)
// - Send button (disabled when empty)
// - Loading state while sending
// - Clear input after send

export const ReplyComposer = ({ threadId, recipientId }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    await sendReply(threadId, recipientId, message);
    setMessage('');
    setSending(false);
  };

  return (
    <div className="border-t p-4">
      <AutoResizeTextarea
        value={message}
        onChange={setMessage}
        placeholder="Type your reply..."
      />
      <div className="flex justify-between items-center mt-2">
        <AttachButton />
        <SendButton onClick={handleSend} disabled={!message.trim() || sending} />
      </div>
    </div>
  );
};
```

**Checklist:**
- [ ] Create ReplyComposer component
- [ ] Implement auto-resize textarea
- [ ] Add character counter (optional, max 10,000 chars)
- [ ] Style with accent color theme
- [ ] Add attach file button UI
- [ ] Implement send button with loading state
- [ ] Disable send when empty or sending
- [ ] Clear textarea after successful send
- [ ] Show error toast on failure
- [ ] Test with long messages

---

### Stage 9.11: Implement Send Reply Functionality
**Status:** [ ] NOT STARTED
**Files:** `src/hooks/useThread.ts`, `src/app/api/messages/send/route.ts` (new)

**Implementation Details:**
```typescript
// Send reply logic:
// 1. Create new message in same thread_id
// 2. Set sender_id = current user
// 3. Set recipient_id = other participant
// 4. Update inquiry_status to 'replied' (if inquiry)
// 5. Send email notification to recipient
// 6. Optimistically update UI

// API Route: /api/messages/send
export async function POST(request: Request) {
  const { threadId, recipientId, body, subject } = await request.json();
  const userId = await getCurrentUserId();

  const { data: message } = await supabase
    .from('messages')
    .insert({
      thread_id: threadId,
      sender_id: userId,
      recipient_id: recipientId,
      subject,
      body,
      is_inquiry: false
    })
    .select()
    .single();

  // Update inquiry status if this is a reply to an inquiry
  await updateInquiryStatus(threadId, 'replied');

  // Send email notification
  await sendMessageNotification(recipientId, message);

  return NextResponse.json(message);
}
```

**Checklist:**
- [ ] Create API route `/api/messages/send`
- [ ] Validate request body
- [ ] Get current user from session
- [ ] Insert message into database
- [ ] Update inquiry_status to 'replied' if applicable
- [ ] Implement optimistic UI update in hook
- [ ] Send email notification to recipient
- [ ] Handle errors gracefully
- [ ] Test reply functionality
- [ ] Verify RLS policies allow insert

---

### Stage 9.12: Create New Thread from Public Inquiry
**Status:** [ ] NOT STARTED
**Files:** `src/app/api/inquiries/submit/route.ts` (new)

**Implementation Details:**
```typescript
// When visitor submits inquiry on public profile:
// 1. Generate new thread_id (UUID)
// 2. Create message with sender_email/sender_name (no sender_id)
// 3. Set is_inquiry = true
// 4. Set inquiry_status = 'new'
// 5. Set recipient_id = engineer profile id
// 6. Send email notification to engineer

// API Route: /api/inquiries/submit
export async function POST(request: Request) {
  const { engineerId, senderName, senderEmail, subject, body } = await request.json();

  // Validate fields
  if (!validateEmail(senderEmail)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // Generate thread ID
  const threadId = crypto.randomUUID();

  // Create inquiry message
  const { data: message } = await supabase
    .from('messages')
    .insert({
      thread_id: threadId,
      sender_id: null,  // Guest sender
      sender_email: senderEmail,
      sender_name: senderName,
      recipient_id: engineerId,
      subject,
      body,
      is_inquiry: true,
      inquiry_status: 'new'
    })
    .select()
    .single();

  // Send notification to engineer
  await sendInquiryNotification(engineerId, message);

  return NextResponse.json({ success: true, threadId });
}
```

**Checklist:**
- [ ] Create API route `/api/inquiries/submit`
- [ ] Validate form fields (name, email, message)
- [ ] Generate unique thread_id
- [ ] Insert inquiry message into database
- [ ] Set is_inquiry = true
- [ ] Handle guest senders (null sender_id)
- [ ] Send email notification to engineer
- [ ] Return success response
- [ ] Test with various inputs
- [ ] Add rate limiting to prevent spam

---

### Stage 9.13: Wire Public Profile Contact Form to Messages
**Status:** [ ] NOT STARTED
**Files:** `src/app/[username]/contact/page.tsx` or inline contact form

**Implementation Details:**
```typescript
// Update contact form on public profile to submit inquiries
// Form fields:
// - Name (required)
// - Email (required, validated)
// - Subject (optional, default: "New Inquiry")
// - Message (required, min 10 chars)

const ContactForm = ({ engineerId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const response = await fetch('/api/inquiries/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        engineerId,
        senderName: formData.name,
        senderEmail: formData.email,
        subject: formData.subject || 'New Inquiry',
        body: formData.message
      })
    });

    if (response.ok) {
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      toast.error('Failed to send message. Please try again.');
    }

    setSubmitting(false);
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

**Checklist:**
- [ ] Find/create contact form on public profile
- [ ] Add form fields (name, email, subject, message)
- [ ] Implement form validation
- [ ] Wire to `/api/inquiries/submit` endpoint
- [ ] Show loading state while submitting
- [ ] Display success message on submit
- [ ] Clear form after successful submission
- [ ] Show error message on failure
- [ ] Test form submission
- [ ] Verify inquiry appears in engineer's inbox

---

### Stage 9.14: Validate Inquiry Form Fields
**Status:** [ ] NOT STARTED
**Files:** `src/app/api/inquiries/submit/route.ts`, `src/lib/validators.ts` (new)

**Implementation Details:**
```typescript
// Validation rules:
// - Name: 2-100 characters, letters and spaces only
// - Email: Valid email format
// - Message: 10-10,000 characters
// - Subject: Optional, max 200 characters

// Create validation utility
export const validateInquiryForm = (data) => {
  const errors = {};

  if (!data.senderName || data.senderName.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!isValidEmail(data.senderEmail)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.body || data.body.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  if (data.body && data.body.length > 10000) {
    errors.message = 'Message is too long (max 10,000 characters)';
  }

  return errors;
};

// Email validation regex
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

**Checklist:**
- [ ] Create validation utility file
- [ ] Implement name validation
- [ ] Implement email validation (regex)
- [ ] Implement message length validation
- [ ] Add subject length validation
- [ ] Sanitize inputs to prevent XSS
- [ ] Return validation errors to frontend
- [ ] Display error messages on form
- [ ] Test with various invalid inputs
- [ ] Add server-side validation in API route

---

### Stage 9.15: Send Notification Email to Engineer
**Status:** [ ] NOT STARTED
**Files:** `src/lib/email.ts`, `src/emails/NewInquiryNotification.tsx` (new)

**Implementation Details:**
```typescript
// Email template for new inquiry notification
// Uses Resend or similar email service

export const sendInquiryNotification = async (engineerId, message) => {
  // Get engineer's email and notification preferences
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, display_name')
    .eq('id', engineerId)
    .single();

  // Check if notifications enabled
  // (assume enabled by default for inquiries)

  // Send email via Resend
  await resend.emails.send({
    from: 'MixExperts <notifications@mixexperts.io>',
    to: profile.email,
    subject: `New Inquiry: ${message.subject}`,
    react: NewInquiryEmail({
      engineerName: profile.display_name,
      senderName: message.sender_name,
      senderEmail: message.sender_email,
      subject: message.subject,
      message: message.body,
      inboxUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/inbox`
    })
  });
};

// React Email Template
export const NewInquiryEmail = ({ engineerName, senderName, message, inboxUrl }) => (
  <Html>
    <Head />
    <Preview>New inquiry from {senderName}</Preview>
    <Body>
      <Container>
        <Heading>New Inquiry</Heading>
        <Text>Hi {engineerName},</Text>
        <Text>You received a new inquiry from {senderName}:</Text>
        <Section style={{ background: '#f4f4f4', padding: '16px', borderRadius: '8px' }}>
          <Text>{message}</Text>
        </Section>
        <Button href={inboxUrl}>View in Inbox</Button>
      </Container>
    </Body>
  </Html>
);
```

**Checklist:**
- [ ] Set up email service (Resend recommended)
- [ ] Create email template component
- [ ] Implement sendInquiryNotification function
- [ ] Include sender name, email, and message in email
- [ ] Add "View in Inbox" button linking to dashboard
- [ ] Test email delivery
- [ ] Handle email send failures gracefully
- [ ] Add unsubscribe link (optional, for compliance)
- [ ] Style email with brand colors
- [ ] Test email rendering across clients

---

### Stage 9.16: Implement Mark as Unread
**Status:** [ ] NOT STARTED
**Files:** `src/hooks/useThread.ts`, `src/components/dashboard/inbox/ThreadActions.tsx` (new)

**Implementation Details:**
```typescript
// Allow user to manually mark thread as unread
// Useful for flagging messages that need follow-up

const markAsUnread = async (threadId: string) => {
  await supabase
    .from('messages')
    .update({ is_read: false })
    .eq('thread_id', threadId)
    .eq('recipient_id', currentUserId);

  // Refetch inbox to update unread count
  refetchInbox();
};

// Add action to thread dropdown menu or context menu
<DropdownMenuItem onClick={() => markAsUnread(threadId)}>
  <Mail className="w-4 h-4 mr-2" />
  Mark as Unread
</DropdownMenuItem>
```

**Checklist:**
- [ ] Create markAsUnread function in useThread hook
- [ ] Add "Mark as Unread" option to thread actions menu
- [ ] Update is_read field in database
- [ ] Trigger inbox refetch to update unread count
- [ ] Show visual feedback (badge reappears)
- [ ] Add keyboard shortcut (optional, e.g., "U" key)
- [ ] Test with multiple threads
- [ ] Verify RLS policies allow update

---

### Stage 9.17: Implement Archive Conversation
**Status:** [ ] NOT STARTED
**Files:** `src/hooks/useMessages.ts`, `src/components/dashboard/inbox/ThreadActions.tsx`

**Implementation Details:**
```typescript
// Archive conversation by updating inquiry_status to 'archived'
// Archived threads don't show in main inbox by default
// Add filter to show/hide archived threads

const archiveThread = async (threadId: string) => {
  await supabase
    .from('messages')
    .update({ inquiry_status: 'archived' })
    .eq('thread_id', threadId)
    .eq('is_inquiry', true);

  // Remove from active threads list
  refetchInbox();
};

// Filter logic
const { threads } = useMessages({
  showArchived: false  // Toggle to show/hide archived
});
```

**Checklist:**
- [ ] Create archiveThread function
- [ ] Add "Archive" option to thread actions menu
- [ ] Update inquiry_status to 'archived'
- [ ] Filter out archived threads from main view
- [ ] Add "Show Archived" toggle in inbox header
- [ ] Create archived threads view/tab
- [ ] Add "Unarchive" option for archived threads
- [ ] Test archiving and unarchiving
- [ ] Add archive icon to UI
- [ ] Show toast notification on archive

---

### Stage 9.18: Implement Delete Conversation
**Status:** [ ] NOT STARTED
**Files:** `src/hooks/useMessages.ts`, `src/components/dashboard/inbox/ThreadActions.tsx`

**Implementation Details:**
```typescript
// Delete all messages in a thread
// Show confirmation modal before deleting
// Permanently remove messages (or soft delete)

const deleteThread = async (threadId: string) => {
  // Show confirmation
  const confirmed = await confirmDialog({
    title: 'Delete Conversation',
    message: 'Are you sure? This cannot be undone.',
    confirmText: 'Delete',
    confirmVariant: 'destructive'
  });

  if (!confirmed) return;

  // Delete all messages in thread
  await supabase
    .from('messages')
    .delete()
    .eq('thread_id', threadId);

  // Or soft delete by adding deleted_at timestamp
  // .update({ deleted_at: new Date().toISOString() })

  refetchInbox();
};
```

**Checklist:**
- [ ] Create deleteThread function
- [ ] Add "Delete" option to thread actions menu
- [ ] Implement confirmation dialog component
- [ ] Delete all messages with matching thread_id
- [ ] Consider soft delete option (deleted_at timestamp)
- [ ] Remove thread from UI immediately
- [ ] Show success toast notification
- [ ] Add keyboard shortcut (optional, e.g., "Delete" key)
- [ ] Test deletion with multiple messages
- [ ] Verify RLS policies allow delete

---

### Stage 9.19: Add Inquiry Status Update UI
**Status:** [ ] NOT STARTED
**Files:** `src/components/dashboard/inbox/InboxThread.tsx`, `src/hooks/useThread.ts`

**Implementation Details:**
```typescript
// Allow engineer to manually update inquiry status
// Show status dropdown in thread header
// Automatically update on certain actions:
// - Send reply → 'replied'
// - Link to order → 'converted'
// - Archive → 'archived'

const updateInquiryStatus = async (threadId: string, status: InquiryStatus) => {
  await supabase
    .from('messages')
    .update({ inquiry_status: status })
    .eq('thread_id', threadId)
    .eq('is_inquiry', true);

  refetchThread();
};

// Status dropdown component
<Select value={currentStatus} onValueChange={updateInquiryStatus}>
  <SelectItem value="new">New</SelectItem>
  <SelectItem value="read">Read</SelectItem>
  <SelectItem value="replied">Replied</SelectItem>
  <SelectItem value="converted">Converted</SelectItem>
  <SelectItem value="archived">Archived</SelectItem>
</Select>
```

**Checklist:**
- [ ] Create updateInquiryStatus function
- [ ] Add status dropdown to thread header (for inquiries only)
- [ ] Display current inquiry status
- [ ] Allow manual status change via dropdown
- [ ] Auto-update status on reply (→ 'replied')
- [ ] Auto-update status on archive (→ 'archived')
- [ ] Show status change in thread (system message)
- [ ] Add color-coded status badges
- [ ] Test status transitions
- [ ] Verify only inquiries show status dropdown

---

### Stage 9.20: Track Inquiry-to-Booking Conversion
**Status:** [ ] NOT STARTED
**Files:** `src/app/api/orders/create/route.ts`, `src/hooks/useMessages.ts`

**Implementation Details:**
```typescript
// When an inquiry converts to a booking:
// 1. Update inquiry_status to 'converted'
// 2. Link message thread to order via order_id
// 3. Track conversion in analytics
// 4. Show conversion in inbox (badge/indicator)

// In order creation flow, check if inquiry exists
export async function POST(request: Request) {
  const { threadId, ...orderData } = await request.json();

  // Create order
  const { data: order } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  // If created from inquiry thread, update messages
  if (threadId) {
    await supabase
      .from('messages')
      .update({
        inquiry_status: 'converted',
        order_id: order.id
      })
      .eq('thread_id', threadId);

    // Track conversion event
    await trackEvent({
      event_type: 'inquiry_converted',
      profile_id: order.engineer_id,
      metadata: { thread_id: threadId, order_id: order.id }
    });
  }

  return NextResponse.json(order);
}
```

**Checklist:**
- [ ] Add threadId parameter to order creation flow
- [ ] Update inquiry_status to 'converted' when order created
- [ ] Link messages to order via order_id field
- [ ] Track conversion event in analytics
- [ ] Display "Converted" badge in inbox
- [ ] Show linked order details in thread view
- [ ] Add "View Order" link in converted thread
- [ ] Calculate inquiry-to-booking conversion rate
- [ ] Test conversion flow end-to-end
- [ ] Display conversion stats in analytics dashboard

---

### Stage 9.21: Link Messages to Orders When Converted
**Status:** [ ] NOT STARTED
**Files:** `src/components/dashboard/inbox/InboxThread.tsx`

**Implementation Details:**
```typescript
// Display order information in thread when linked
// Show order status, price, and due date
// Add "View Order" button linking to order detail page

const LinkedOrderCard = ({ orderId }) => {
  const { data: order } = useOrder(orderId);

  if (!order) return null;

  return (
    <div className="border border-[var(--accent)]/20 bg-[var(--accent)]/5 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-[var(--accent)]" />
            <span className="font-semibold text-white">Converted to Booking</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            {order.service_name} • ${order.total} • Due {formatDate(order.due_date)}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/projects/${order.id}`}>
            View Order <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Add to thread view
{thread.order_id && <LinkedOrderCard orderId={thread.order_id} />}
```

**Checklist:**
- [ ] Create LinkedOrderCard component
- [ ] Fetch order details when order_id present
- [ ] Display order summary (service, price, status)
- [ ] Add "View Order" button
- [ ] Style with accent color and subtle background
- [ ] Show order status badge
- [ ] Display order due date
- [ ] Position card at top of thread
- [ ] Add loading state for order fetch
- [ ] Test with converted inquiries

---

### Stage 9.22: Create Message Templates System
**Status:** [ ] NOT STARTED
**Files:** `src/app/dashboard/settings/templates/page.tsx` (new), `src/hooks/useTemplates.ts` (new)

**Implementation Details:**
```typescript
// Template manager for quick responses
// Engineers can create, edit, and delete templates
// Templates can be inserted into reply composer

interface MessageTemplate {
  id: string;
  profile_id: string;
  name: string;
  shortcut: string;  // e.g., "/availability"
  content: string;
  created_at: string;
}

// Template CRUD operations
export function useTemplates() {
  const createTemplate = async (data: Partial<MessageTemplate>) => {
    return await supabase
      .from('message_templates')
      .insert(data)
      .select()
      .single();
  };

  const updateTemplate = async (id: string, data: Partial<MessageTemplate>) => {
    return await supabase
      .from('message_templates')
      .update(data)
      .eq('id', id)
      .select()
      .single();
  };

  const deleteTemplate = async (id: string) => {
    return await supabase
      .from('message_templates')
      .delete()
      .eq('id', id);
  };

  return { templates, createTemplate, updateTemplate, deleteTemplate };
}
```

**Checklist:**
- [ ] Create message_templates table (if not exists)
- [ ] Create useTemplates hook
- [ ] Build template manager page
- [ ] Add create template form
- [ ] Add edit template functionality
- [ ] Add delete template with confirmation
- [ ] Implement shortcut field (e.g., "/pricing")
- [ ] Add template list view
- [ ] Sort templates by name or created date
- [ ] Test CRUD operations

---

### Stage 9.23: Allow Quick-Insert of Templates
**Status:** [ ] NOT STARTED
**Files:** `src/components/dashboard/inbox/ReplyComposer.tsx`, `src/components/dashboard/inbox/TemplateSelector.tsx` (new)

**Implementation Details:**
```typescript
// Template insertion methods:
// 1. Dropdown menu with template list
// 2. Autocomplete with "/" prefix (e.g., type "/pricing" to insert)
// 3. Template selector modal

const ReplyComposer = ({ threadId }) => {
  const [message, setMessage] = useState('');
  const { templates } = useTemplates();

  const insertTemplate = (template: MessageTemplate) => {
    setMessage(prev => prev + template.content);
  };

  // Autocomplete on "/" key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === '/' && message.endsWith(' ') || message === '') {
      showTemplateAutocomplete();
    }
  };

  return (
    <div>
      <Textarea
        value={message}
        onChange={setMessage}
        onKeyDown={handleKeyDown}
      />
      <TemplateDropdown
        templates={templates}
        onSelect={insertTemplate}
      />
    </div>
  );
};
```

**Checklist:**
- [ ] Create TemplateSelector component
- [ ] Add template dropdown to reply composer
- [ ] Implement template insertion on click
- [ ] Add "/" autocomplete trigger
- [ ] Show template preview on hover
- [ ] Allow editing template after insertion
- [ ] Add keyboard navigation in template list
- [ ] Show template shortcuts in dropdown
- [ ] Test template insertion
- [ ] Handle empty templates state

---

### Stage 9.24: Add File Attachment Support (Optional)
**Status:** [ ] NOT STARTED
**Files:** `src/components/dashboard/inbox/ReplyComposer.tsx`, `src/app/api/messages/upload/route.ts` (new)

**Implementation Details:**
```typescript
// Allow attaching files to messages
// Store in Supabase storage bucket
// Link attachments to message via message_attachments table

const handleFileUpload = async (file: File) => {
  // Upload to storage
  const filePath = `message-attachments/${threadId}/${file.name}`;
  const { data } = await supabase.storage
    .from('message-attachments')
    .upload(filePath, file);

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('message-attachments')
    .getPublicUrl(filePath);

  // Store attachment metadata
  await supabase
    .from('message_attachments')
    .insert({
      message_id: messageId,
      file_name: file.name,
      file_url: publicUrl,
      file_size_bytes: file.size,
      file_type: file.type
    });
};

// Display attachments in thread
const AttachmentPreview = ({ attachment }) => (
  <a
    href={attachment.file_url}
    download={attachment.file_name}
    className="flex items-center gap-2 p-2 border rounded hover:bg-[var(--bg-hover)]"
  >
    <Paperclip className="w-4 h-4" />
    <span className="text-sm truncate">{attachment.file_name}</span>
    <span className="text-xs text-[var(--text-muted)]">
      {formatFileSize(attachment.file_size_bytes)}
    </span>
  </a>
);
```

**Checklist:**
- [ ] Create message-attachments storage bucket
- [ ] Create message_attachments table
- [ ] Add file upload button to reply composer
- [ ] Implement file selection dialog
- [ ] Upload file to storage
- [ ] Create attachment record in database
- [ ] Display attachments in message bubbles
- [ ] Add download functionality
- [ ] Show file type icons (PDF, image, etc.)
- [ ] Add file size limit (e.g., 25MB)
- [ ] Show upload progress indicator
- [ ] Test with various file types

---

### Stage 9.25: Implement Message Search
**Status:** [ ] NOT STARTED
**Files:** `src/components/dashboard/inbox/InboxList.tsx`, `src/hooks/useMessages.ts`

**Implementation Details:**
```typescript
// Search functionality:
// - Search by sender name
// - Search by subject
// - Search by message content
// - Highlight search results

const searchMessages = async (query: string) => {
  const { data } = await supabase
    .from('messages')
    .select('*, sender:profiles(*)')
    .eq('recipient_id', currentUserId)
    .or(`
      sender_name.ilike.%${query}%,
      sender_email.ilike.%${query}%,
      subject.ilike.%${query}%,
      body.ilike.%${query}%
    `)
    .order('created_at', { ascending: false });

  return data;
};

// Add to InboxList component
const [searchQuery, setSearchQuery] = useState('');
const { threads, loading } = useMessages({ searchQuery });
```

**Checklist:**
- [ ] Wire search input in InboxList header
- [ ] Implement search query in useMessages hook
- [ ] Search across sender name, email, subject, body
- [ ] Debounce search input (300ms)
- [ ] Show loading state while searching
- [ ] Highlight matching text in results
- [ ] Show "No results" message when empty
- [ ] Clear search on X button click
- [ ] Add keyboard shortcut (e.g., Cmd+K)
- [ ] Test search performance with many messages
- [ ] Consider full-text search for better performance

---

### Stage 9.26: Add Real-time Updates (Supabase Realtime)
**Status:** [ ] NOT STARTED
**Files:** `src/hooks/useMessages.ts`, `src/hooks/useThread.ts`

**Implementation Details:**
```typescript
// Subscribe to real-time message updates
// Auto-refresh inbox when new messages arrive
// Show notification badge/toast for new messages

export function useMessages(recipientId: string) {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    // Initial fetch
    fetchThreads();

    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${recipientId}`
        },
        (payload) => {
          // Add new message to threads
          handleNewMessage(payload.new);

          // Show notification
          showNotification({
            title: 'New Message',
            body: `${payload.new.sender_name}: ${payload.new.subject}`
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [recipientId]);

  return { threads, loading, error };
}
```

**Checklist:**
- [ ] Enable Supabase Realtime on messages table
- [ ] Subscribe to INSERT events in useMessages hook
- [ ] Subscribe to UPDATE events (for read status)
- [ ] Auto-add new messages to thread list
- [ ] Update unread count in real-time
- [ ] Show browser notification for new messages
- [ ] Play notification sound (optional)
- [ ] Update thread order when new message arrives
- [ ] Handle real-time updates in thread view
- [ ] Test with multiple browser tabs
- [ ] Clean up subscriptions on unmount
- [ ] Test real-time performance

---

### Stage 9.27: Test Complete Messaging Flow
**Status:** [ ] NOT STARTED
**Files:** All messaging-related files

**Implementation Details:**
End-to-end testing checklist covering the entire messaging system.

**Test Scenarios:**

1. **Public Inquiry Submission**
   - [ ] Visitor submits inquiry on public profile
   - [ ] Inquiry appears in engineer's inbox
   - [ ] Engineer receives email notification
   - [ ] Inquiry status shows as "New"
   - [ ] Unread count increments

2. **Reading Messages**
   - [ ] Click thread to open
   - [ ] Messages display chronologically
   - [ ] Unread badge disappears
   - [ ] Inquiry status updates to "Read"
   - [ ] Unread count decrements

3. **Sending Replies**
   - [ ] Type reply in composer
   - [ ] Send button enables when text entered
   - [ ] Reply appears in thread immediately
   - [ ] Recipient receives email notification
   - [ ] Inquiry status updates to "Replied"

4. **Template Usage**
   - [ ] Create message template
   - [ ] Insert template in reply composer
   - [ ] Edit template content before sending
   - [ ] Send message with template content

5. **Thread Management**
   - [ ] Mark thread as unread
   - [ ] Archive conversation
   - [ ] Unarchive conversation
   - [ ] Delete conversation (with confirmation)

6. **Inquiry Conversion**
   - [ ] Create booking from inquiry thread
   - [ ] Inquiry status updates to "Converted"
   - [ ] Order linked to thread
   - [ ] Order details shown in thread
   - [ ] Conversion tracked in analytics

7. **Search Functionality**
   - [ ] Search by sender name
   - [ ] Search by subject
   - [ ] Search by message content
   - [ ] Clear search results

8. **Real-time Updates**
   - [ ] New message appears without refresh
   - [ ] Unread count updates in real-time
   - [ ] Read status syncs across tabs
   - [ ] Browser notification appears

9. **Edge Cases**
   - [ ] Empty inbox state displays correctly
   - [ ] No thread selected state
   - [ ] Very long messages wrap correctly
   - [ ] Special characters in messages
   - [ ] Guest senders (no profile)
   - [ ] Deleted sender profiles

10. **Performance**
    - [ ] Inbox loads quickly with 100+ threads
    - [ ] Search responds within 300ms
    - [ ] Real-time updates don't cause lag
    - [ ] Images/attachments load efficiently

11. **Mobile Responsiveness**
    - [ ] Inbox list responsive on mobile
    - [ ] Thread view responsive on mobile
    - [ ] Reply composer works on mobile keyboard
    - [ ] Swipe gestures (optional)

12. **Accessibility**
    - [ ] Keyboard navigation works
    - [ ] Screen reader announces new messages
    - [ ] Focus indicators visible
    - [ ] ARIA labels present

---

## Success Criteria

Phase 09 is complete when:

- [ ] All 27 stages are implemented and tested
- [ ] Engineers can receive inquiries from public profiles
- [ ] Inbox displays all message threads grouped by conversation
- [ ] Unread count badge shows accurately
- [ ] Inquiry status tracking works (new → read → replied → converted → archived)
- [ ] Engineers can send replies to inquiries
- [ ] Mark as read/unread functionality works
- [ ] Archive and delete conversations work
- [ ] Inquiry-to-booking conversion is tracked and linked
- [ ] Message templates can be created and used
- [ ] Real-time updates work without page refresh
- [ ] Email notifications are sent for new inquiries and replies
- [ ] Search functionality returns accurate results
- [ ] All RLS policies are in place and tested
- [ ] End-to-end flow works smoothly from inquiry to conversion
- [ ] Mobile responsive and accessible

---

## Dependencies

**Required Before Starting:**
- Phase 2 (Authentication) complete
- Database schema deployed with messages table
- Supabase RLS policies configured
- Email service (Resend) configured

**Required Services:**
- Supabase (database, realtime, storage)
- Resend (email notifications)
- Next.js API routes

---

## Related Files

**Hooks:**
- `src/hooks/useMessages.ts`
- `src/hooks/useThread.ts`
- `src/hooks/useTemplates.ts`

**Components:**
- `src/components/dashboard/inbox/InboxList.tsx`
- `src/components/dashboard/inbox/InboxThread.tsx`
- `src/components/dashboard/inbox/ReplyComposer.tsx`
- `src/components/dashboard/inbox/TemplateSelector.tsx`
- `src/components/dashboard/inbox/ThreadActions.tsx`

**Pages:**
- `src/app/dashboard/inbox/page.tsx`
- `src/app/dashboard/settings/templates/page.tsx`

**API Routes:**
- `src/app/api/inquiries/submit/route.ts`
- `src/app/api/messages/send/route.ts`
- `src/app/api/messages/upload/route.ts` (optional)

**Email Templates:**
- `src/emails/NewInquiryNotification.tsx`
- `src/emails/NewReplyNotification.tsx`

**Utilities:**
- `src/lib/validators.ts`
- `src/lib/email.ts`

---

## Notes

- Inquiry system is critical for lead generation
- Real-time updates improve user experience significantly
- Email notifications increase response rates
- Template system saves engineers time on common responses
- Conversion tracking helps measure platform effectiveness
- Consider adding read receipts in future iteration
- Consider adding typing indicators in future iteration
- Consider adding message reactions/emoji support in future iteration

---

## Estimated Timeline

| Stage Range | Tasks | Days |
|-------------|-------|------|
| 9.1 - 9.5 | Data layer & inbox display | 1 day |
| 9.6 - 9.11 | Thread view & reply system | 1 day |
| 9.12 - 9.15 | Public inquiry form & emails | 0.5 days |
| 9.16 - 9.21 | Thread management & conversion | 1 day |
| 9.22 - 9.24 | Templates & attachments | 0.5 days |
| 9.25 - 9.27 | Search, realtime & testing | 1 day |

**Total: 5 days** (can be parallelized to ~3-4 days)

---

**End of Phase 09 Document**
