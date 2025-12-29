import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { randomUUID } from 'crypto';
import { inquirySchema } from '@/lib/validations';
import { sanitizeText, sanitizeHtml } from '@/lib/sanitize';
import { rateLimiters, getClientIP, rateLimitHeaders } from '@/lib/rate-limit';
import { validateOrigin, detectSuspiciousContent } from '@/lib/security';

export async function POST(request: Request) {
  try {
    // Rate limiting for public endpoint
    const ip = getClientIP(request);
    const rateLimit = rateLimiters.inquiry(ip);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: rateLimitHeaders(rateLimit),
        }
      );
    }

    // Origin validation
    const originError = validateOrigin(request);
    if (originError) {
      return originError;
    }

    const supabase = createServerClient();

    const body = await request.json();

    // Validate with Zod schema
    const validation = inquirySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { recipient_id, sender_name, sender_email, subject, message, service_id } = validation.data;

    // Check for suspicious content (potential attacks)
    if (detectSuspiciousContent(message) || detectSuspiciousContent(subject)) {
      console.warn(`Suspicious inquiry content from ${ip}: ${sender_email}`);
      return NextResponse.json(
        { error: 'Invalid content detected' },
        { status: 400 }
      );
    }

    // Sanitize user inputs
    const sanitizedName = sanitizeText(sender_name);
    const sanitizedSubject = sanitizeText(subject);
    const sanitizedMessage = sanitizeHtml(message);

    // Check if recipient exists
    const { data: recipient, error: recipientError } = await supabase
      .from('profiles')
      .select('id, email, display_name')
      .eq('id', recipient_id)
      .single();

    if (recipientError || !recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // Generate a new thread ID for this inquiry
    const thread_id = randomUUID();

    // Insert the inquiry message with sanitized content
    const { data: inquiry, error: inquiryError } = await supabase
      .from('messages')
      .insert({
        thread_id,
        sender_id: null, // Guest sender
        recipient_id,
        sender_email,
        sender_name: sanitizedName,
        subject: sanitizedSubject,
        content: sanitizedMessage,
        is_inquiry: true,
        inquiry_status: 'new',
        inquiry_service_id: service_id || null,
        is_read: false,
        is_archived: false,
      })
      .select()
      .single();

    if (inquiryError) {
      console.error('Error creating inquiry:', inquiryError);
      return NextResponse.json(
        { error: 'Failed to submit inquiry' },
        { status: 500 }
      );
    }

    // TODO: Send email notification to recipient
    // This would integrate with Resend or another email service

    return NextResponse.json({
      success: true,
      inquiry,
      thread_id
    });
  } catch (error) {
    console.error('Error in submit inquiry API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
