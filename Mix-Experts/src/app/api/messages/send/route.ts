import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { messageSchema } from '@/lib/validations';
import { sanitizeHtml, sanitizeText } from '@/lib/sanitize';
import { validateOrigin } from '@/lib/security';

export async function POST(request: Request) {
  try {
    // CSRF protection - validate origin
    const originError = validateOrigin(request);
    if (originError) {
      return originError;
    }

    const supabase = createServerClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate with Zod schema
    const validation = messageSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { thread_id, recipient_id, content, subject, order_id } = validation.data;

    // Sanitize content
    const sanitizedContent = sanitizeHtml(content);
    const sanitizedSubject = subject ? sanitizeText(subject) : null;

    // Security check: Verify user is a participant in this thread
    // This prevents IDOR attacks where a user could send messages to arbitrary threads
    const { data: existingThread, error: threadError } = await supabase
      .from('messages')
      .select('sender_id, recipient_id')
      .eq('thread_id', thread_id)
      .limit(1)
      .single();

    if (threadError || !existingThread) {
      // For new threads (inquiry replies), verify recipient exists and is a valid engineer
      const { data: recipientProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', recipient_id)
        .single();

      if (!recipientProfile) {
        return NextResponse.json(
          { error: 'Invalid recipient' },
          { status: 400 }
        );
      }
    } else {
      // For existing threads, verify user is a participant
      const isParticipant = existingThread.sender_id === user.id || existingThread.recipient_id === user.id;
      if (!isParticipant) {
        return NextResponse.json(
          { error: 'Forbidden: Not a participant in this thread' },
          { status: 403 }
        );
      }
    }

    // Check if this is a reply to an inquiry
    const { data: existingMessages } = await supabase
      .from('messages')
      .select('is_inquiry, inquiry_status')
      .eq('thread_id', thread_id)
      .eq('is_inquiry', true)
      .limit(1)
      .single();

    const isInquiryReply = !!existingMessages;

    // Insert the message with sanitized content
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        thread_id,
        sender_id: user.id,
        recipient_id,
        content: sanitizedContent,
        subject: sanitizedSubject,
        order_id: order_id || null,
        is_inquiry: false,
        is_read: false,
      })
      .select()
      .single();

    if (messageError) {
      console.error('Error creating message:', messageError);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    // If replying to an inquiry, update inquiry status to 'replied'
    if (isInquiryReply && existingMessages?.inquiry_status !== 'replied') {
      await supabase
        .from('messages')
        .update({ inquiry_status: 'replied' })
        .eq('thread_id', thread_id)
        .eq('is_inquiry', true);
    }

    return NextResponse.json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Error in send message API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
