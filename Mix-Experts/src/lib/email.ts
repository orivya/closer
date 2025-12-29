import { Resend } from 'resend';

// Only initialize Resend in server-side code
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export async function sendEmail(options: SendEmailOptions) {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured - email not sent');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const { to, subject, html, from, replyTo, tags } = options;

    const defaultFrom = `${process.env.RESEND_FROM_NAME || 'MixExperts'} <${process.env.RESEND_FROM_EMAIL || 'noreply@mixexperts.com'}>`;

    const result = await resend.emails.send({
      from: from || defaultFrom,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo,
      tags,
    });

    if (result.error) {
      console.error('Resend API error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('Email sent successfully:', result.data?.id);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function getSupportEmail(): string {
  return process.env.RESEND_SUPPORT_EMAIL || 'support@mixexperts.com';
}

export function getNoReplyEmail(): string {
  return `${process.env.RESEND_FROM_NAME || 'MixExperts'} <${process.env.RESEND_NOREPLY_EMAIL || 'noreply@mixexperts.com'}>`;
}
