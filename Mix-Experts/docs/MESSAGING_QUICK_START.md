# Messaging System - Quick Start Guide

## For Developers

### Accessing the Inbox
Navigate to `/dashboard/inbox` to view the messaging interface.

### Sending a Message from Code

```typescript
// Example: Send a message in an existing thread
const sendMessage = async () => {
  const response = await fetch('/api/messages/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      thread_id: 'existing-thread-id',
      recipient_id: 'user-id',
      content: 'Hello, this is a test message'
    })
  });

  const data = await response.json();
  return data;
};
```

### Creating a Contact Form for Public Inquiries

```typescript
// Example: Contact form component
'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function ContactForm({ engineerId }: { engineerId: string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/inquiries/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_id: engineerId,
          sender_name: formData.name,
          sender_email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (!response.ok) throw new Error('Failed to send inquiry');

      toast.success('Inquiry sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        required
      />
      <textarea
        placeholder="Your Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send Inquiry'}
      </button>
    </form>
  );
}
```

### Using Hooks in Components

```typescript
// Example: Custom inbox component
import { useMessages } from '@/hooks/useMessages';
import { useThread } from '@/hooks/useThread';

function MyInboxComponent() {
  const { threads, loading, getTotalUnreadCount } = useMessages();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const { messages, markAsRead } = useThread(selectedThreadId);

  const unreadCount = getTotalUnreadCount();

  return (
    <div>
      <h1>Inbox ({unreadCount} unread)</h1>
      <div className="thread-list">
        {threads.map(thread => (
          <button
            key={thread.thread_id}
            onClick={() => setSelectedThreadId(thread.thread_id)}
          >
            {thread.subject} ({thread.unread_count} unread)
          </button>
        ))}
      </div>
      <div className="thread-messages">
        {messages.map(msg => (
          <div key={msg.id}>{msg.content}</div>
        ))}
      </div>
    </div>
  );
}
```

### Managing Message Templates

```typescript
import { useTemplates } from '@/hooks/useTemplates';

function TemplateManager() {
  const { templates, createTemplate, deleteTemplate } = useTemplates();

  const handleCreate = async () => {
    await createTemplate({
      name: 'Welcome Message',
      subject: 'Welcome to my services!',
      body: 'Thank you for reaching out...',
      category: 'inquiry_response'
    });
  };

  return (
    <div>
      {templates.map(template => (
        <div key={template.id}>
          <h3>{template.name}</h3>
          <p>{template.body}</p>
          <button onClick={() => deleteTemplate(template.id)}>Delete</button>
        </div>
      ))}
      <button onClick={handleCreate}>Create Template</button>
    </div>
  );
}
```

## Database Queries

### Get All Threads for a User (SQL)

```sql
SELECT
  thread_id,
  subject,
  COUNT(*) as message_count,
  COUNT(*) FILTER (WHERE is_read = false AND recipient_id = 'user-id') as unread_count,
  MAX(created_at) as latest_message_at
FROM messages
WHERE recipient_id = 'user-id' OR sender_id = 'user-id'
GROUP BY thread_id, subject
ORDER BY latest_message_at DESC;
```

### Get Messages in a Thread (SQL)

```sql
SELECT
  m.*,
  sp.username as sender_username,
  sp.display_name as sender_display_name,
  sp.avatar_url as sender_avatar_url
FROM messages m
LEFT JOIN profiles sp ON sp.id = m.sender_id
WHERE m.thread_id = 'thread-id'
ORDER BY m.created_at ASC;
```

### Mark Thread as Read (SQL)

```sql
UPDATE messages
SET is_read = true, read_at = NOW()
WHERE thread_id = 'thread-id'
  AND recipient_id = 'user-id'
  AND is_read = false;
```

## Common Patterns

### 1. Display Unread Count Badge

```typescript
const { getTotalUnreadCount } = useMessages();
const count = getTotalUnreadCount();

return count > 0 ? <span className="badge">{count}</span> : null;
```

### 2. Filter Inquiries by Status

```typescript
const { threads } = useMessages();
const newInquiries = threads.filter(t =>
  t.is_inquiry && t.inquiry_status === 'new'
);
```

### 3. Update Inquiry Status

```typescript
const { updateInquiryStatus } = useThread(threadId);

const markAsConverted = async () => {
  await updateInquiryStatus('converted');
};
```

### 4. Archive Old Threads

```typescript
const { archiveThread } = useThread(threadId);

const handleArchive = async () => {
  await archiveThread();
  // Redirect or refresh thread list
};
```

## Troubleshooting

### Messages Not Appearing in Real-time
- Check that Supabase Realtime is enabled for the `messages` table
- Verify the subscription channel is properly cleaned up on unmount
- Check browser console for Realtime connection errors

### Guest Inquiries Not Working
- Verify `sender_id` is set to `null`
- Ensure `sender_email` and `sender_name` are provided
- Check RLS policy allows INSERT with `is_inquiry = true`

### Unread Count Incorrect
- Verify messages are being marked as read when thread opens
- Check the `mark_thread_as_read` function is being called
- Confirm RLS policies allow UPDATE on `is_read` field

### Template Insert Not Working
- Ensure user has created templates (check `message_templates` table)
- Verify templates have `is_active = true`
- Check `profile_id` matches current user

## Performance Tips

1. **Limit Thread List:** Consider pagination if user has >100 threads
2. **Debounce Search:** Use `use-debounce` package for search input
3. **Virtual Scrolling:** For long message threads, use virtual scrolling library
4. **Optimize Realtime:** Only subscribe to active thread, not all threads
5. **Cache Thread List:** Consider client-side caching with React Query or SWR

## Security Best Practices

1. **Always Validate on Server:** Never trust client-side data
2. **Rate Limit Inquiries:** Prevent spam by rate-limiting the inquiry endpoint
3. **Sanitize Content:** Use DOMPurify or similar for displaying user content
4. **Email Privacy:** Don't expose sender emails to unauthorized users
5. **Audit Logs:** Consider logging all message actions for security audits

## Next Steps

1. Integrate email notifications (Resend recommended)
2. Add file attachment support
3. Create template manager UI in settings
4. Implement mark as unread functionality
5. Add inquiry-to-order conversion tracking
6. Build mobile-responsive layout
7. Add advanced search and filtering
8. Implement notification preferences
