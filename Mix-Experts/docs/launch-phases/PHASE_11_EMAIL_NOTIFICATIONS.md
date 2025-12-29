# PHASE 11: Email Notifications with Resend

**Priority:** CRITICAL
**Estimated Effort:** 3-4 days
**Dependencies:** Phases 1, 2, 4, 5, 6, 7 complete

---

## Overview

This phase implements a comprehensive email notification system using Resend to handle all transactional emails for MixExperts. Engineers and clients will receive timely, professional emails for authentication, bookings, orders, subscriptions, and marketplace activities.

**Email Types:**
- Authentication (verification, password reset, welcome)
- Booking & Order notifications (confirmations, status updates, deliveries)
- Subscription management (confirmations, renewals, payment failures)
- Marketplace (inquiries, product purchases)
- User preferences (opt-outs, unsubscribe management)

**Deliverability Focus:**
- SPF/DKIM/DMARC configuration
- Email preference management
- Bounce/complaint handling
- Spam score optimization

---

## Stage 11.1: Set Up Resend Account and API Key

**Goal:** Create Resend account and obtain production API key.

### Steps:

1. **Sign up for Resend:**
   - Go to [https://resend.com](https://resend.com)
   - Create an account with your MixExperts email
   - Verify your email address

2. **Add and verify your domain:**
   - Go to Domains → Add Domain
   - Add your sending domain (e.g., `mixexperts.com`)
   - Add DNS records to your domain provider:
     - SPF: `v=spf1 include:_spf.resend.com ~all`
     - DKIM: Add the provided CNAME records
     - DMARC: `v=DMARC1; p=none; rua=mailto:dmarc@mixexperts.com`
   - Wait for verification (can take up to 48 hours)

3. **Create API key:**
   - Go to API Keys → Create API Key
   - Name: `MixExperts Production`
   - Permissions: Full Access (or Sending Access only)
   - Copy the API key (starts with `re_`)
   - Store securely

4. **Set sending limits:**
   - Check your plan limits (Free: 100/day, Pro: 50k/month)
   - Consider upgrading based on expected volume

**Testing:**
```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test Email",
    "html": "<p>Testing Resend integration!</p>"
  }'
```

- [ ] Resend account created
- [ ] Domain added and verified
- [ ] DNS records configured (SPF, DKIM, DMARC)
- [ ] API key generated
- [ ] Test email sent successfully

---

## Stage 11.2: Add RESEND_API_KEY to Environment Variables

**Goal:** Configure environment variables for Resend in development and production.

### Development (.env.local):

```bash
# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# Email sender addresses
RESEND_FROM_EMAIL=noreply@mixexperts.com
RESEND_FROM_NAME=MixExperts
RESEND_SUPPORT_EMAIL=support@mixexperts.com
RESEND_NOREPLY_EMAIL=noreply@mixexperts.com

# Email configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (Vercel/hosting platform):

```bash
# Add these environment variables in your hosting dashboard:
RESEND_API_KEY=re_production_key_here
RESEND_FROM_EMAIL=noreply@mixexperts.com
RESEND_FROM_NAME=MixExperts
RESEND_SUPPORT_EMAIL=support@mixexperts.com
RESEND_NOREPLY_EMAIL=noreply@mixexperts.com
NEXT_PUBLIC_SITE_URL=https://mixexperts.com
```

### Install Resend package:

```bash
npm install resend
```

**package.json update:**
```json
{
  "dependencies": {
    "resend": "^3.0.0"
  }
}
```

- [ ] RESEND_API_KEY added to .env.local
- [ ] Email sender variables configured
- [ ] resend package installed
- [ ] Production environment variables configured
- [ ] .env.example updated with email variables

---

## Stage 11.3: Create Email Sending Utility Function

**Goal:** Create a centralized email utility with error handling and logging.

**Create file:** `src/lib/email.ts`

```typescript
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
  headers?: Record<string, string>;
}

export async function sendEmail(options: SendEmailOptions) {
  try {
    const { to, subject, html, from, replyTo, tags, headers } = options;

    const defaultFrom = `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`;

    const result = await resend.emails.send({
      from: from || defaultFrom,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo,
      tags,
      headers,
    });

    if (result.error) {
      console.error('Resend API error:', result.error);
      throw new Error(`Email send failed: ${result.error.message}`);
    }

    console.log('Email sent successfully:', result.data?.id);
    return result.data;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}

export async function sendBatchEmails(emails: SendEmailOptions[]) {
  try {
    const defaultFrom = `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`;

    const batch = emails.map((email) => ({
      from: email.from || defaultFrom,
      to: Array.isArray(email.to) ? email.to : [email.to],
      subject: email.subject,
      html: email.html,
      replyTo: email.replyTo,
      tags: email.tags,
      headers: email.headers,
    }));

    const result = await resend.batch.send(batch);

    if (result.error) {
      console.error('Batch email error:', result.error);
      throw new Error(`Batch email failed: ${result.error.message}`);
    }

    console.log('Batch emails sent:', result.data);
    return result.data;
  } catch (error) {
    console.error('Batch email error:', error);
    throw error;
  }
}

// Helper to validate email addresses
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper to get support email
export function getSupportEmail(): string {
  return process.env.RESEND_SUPPORT_EMAIL || 'support@mixexperts.com';
}

// Helper to get noreply email
export function getNoReplyEmail(): string {
  return `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_NOREPLY_EMAIL}>`;
}
```

- [ ] Email utility file created
- [ ] sendEmail function implemented
- [ ] sendBatchEmails function implemented
- [ ] Email validation helper added
- [ ] Error handling and logging implemented

---

## Stage 11.4: Create Email Template Base Layout

**Goal:** Create a reusable HTML email template with consistent branding.

**Create file:** `src/lib/email-templates/base.ts`

```typescript
export interface EmailTemplateProps {
  previewText?: string;
  heading: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
  footerText?: string;
}

export function getEmailTemplate({
  previewText = '',
  heading,
  body,
  ctaText,
  ctaUrl,
  footerText = 'MixExperts - Premium Audio Engineering Platform',
}: EmailTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <title>${heading}</title>
      <style>
        /* Reset styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }

        /* Client-specific styles */
        .ExternalClass { width: 100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }

        /* Base styles */
        body { background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 28px; font-weight: 700; color: #ffffff; margin: 0; letter-spacing: -0.5px; }
        .content { background-color: #18181b; padding: 40px 32px; }
        .heading { color: #f59e0b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0; }
        .body-text { color: #a1a1aa; font-size: 16px; line-height: 24px; margin: 0 0 16px 0; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 24px 0; }
        .footer { background-color: #0a0a0a; padding: 32px 20px; text-align: center; }
        .footer-text { color: #52525b; font-size: 14px; line-height: 20px; margin: 0 0 8px 0; }
        .footer-link { color: #71717a; text-decoration: underline; }
        .divider { height: 1px; background-color: #27272a; margin: 24px 0; }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          body { background-color: #0a0a0a; }
          .content { background-color: #18181b; }
          .footer { background-color: #0a0a0a; }
        }

        /* Mobile responsive */
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; }
          .content { padding: 24px 16px !important; }
          .heading { font-size: 20px !important; }
          .body-text { font-size: 14px !important; }
        }
      </style>
    </head>
    <body>
      ${previewText ? `<span style="display: none; font-size: 1px; color: #0a0a0a; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">${previewText}</span>` : ''}

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td>
            <div class="container">
              <!-- Header -->
              <div class="header">
                <h1 class="logo">MixExperts</h1>
              </div>

              <!-- Content -->
              <div class="content">
                <h2 class="heading">${heading}</h2>
                <div class="body-text">
                  ${body}
                </div>
                ${
                  ctaText && ctaUrl
                    ? `<a href="${ctaUrl}" class="cta-button">${ctaText}</a>`
                    : ''
                }
              </div>

              <!-- Footer -->
              <div class="footer">
                <p class="footer-text">${footerText}</p>
                <p class="footer-text">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/settings/email-preferences" class="footer-link">Email Preferences</a> |
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe" class="footer-link">Unsubscribe</a>
                </p>
                <p class="footer-text" style="margin-top: 16px;">
                  © ${new Date().getFullYear()} MixExperts. All rights reserved.
                </p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
```

- [ ] Base email template created
- [ ] Responsive design implemented
- [ ] Dark mode support added
- [ ] Brand colors applied (amber gradient)
- [ ] Footer with unsubscribe links added

---

## Stage 11.5: Create Welcome Email Template

**Goal:** Send a welcome email to new users after signup.

**Create file:** `src/lib/email-templates/welcome.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export interface WelcomeEmailData {
  email: string;
  displayName: string;
  username: string;
  role: 'engineer' | 'artist';
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const { email, displayName, username, role } = data;

  const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`;
  const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${username}`;

  const isEngineer = role === 'engineer';

  const body = `
    <p>Welcome to MixExperts, ${displayName}! 🎵</p>

    ${
      isEngineer
        ? `
          <p>You're now part of the premier platform connecting top audio engineers with artists worldwide.</p>

          <p><strong>Next steps to get started:</strong></p>
          <ul style="color: #a1a1aa; font-size: 16px; line-height: 24px; margin: 16px 0;">
            <li>Complete your profile and add a professional photo</li>
            <li>Upload portfolio items showcasing your best work</li>
            <li>Create your first service offering</li>
            <li>Connect your Stripe account to start receiving payments</li>
            <li>Publish your profile to go live</li>
          </ul>

          <p>Ready to build your audio engineering business? Let's get your profile set up!</p>
        `
        : `
          <p>You're now part of the MixExperts community! Find and work with the world's top audio engineers.</p>

          <p><strong>What you can do now:</strong></p>
          <ul style="color: #a1a1aa; font-size: 16px; line-height: 24px; margin: 16px 0;">
            <li>Browse engineer profiles and portfolios</li>
            <li>Listen to before/after samples</li>
            <li>Book mixing, mastering, and production services</li>
            <li>Purchase digital products and presets</li>
            <li>Message engineers directly</li>
          </ul>

          <p>Ready to elevate your sound?</p>
        `
    }

    <div class="divider"></div>

    <p><strong>Need help getting started?</strong></p>
    <p>Check out our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/help" style="color: #f59e0b; text-decoration: underline;">Getting Started Guide</a> or contact us at <a href="mailto:${process.env.RESEND_SUPPORT_EMAIL}" style="color: #f59e0b; text-decoration: underline;">${process.env.RESEND_SUPPORT_EMAIL}</a>.</p>
  `;

  const html = getEmailTemplate({
    previewText: `Welcome to MixExperts, ${displayName}!`,
    heading: `Welcome to MixExperts!`,
    body,
    ctaText: 'Go to Dashboard',
    ctaUrl: dashboardUrl,
    footerText: 'You received this email because you signed up for MixExperts.',
  });

  return sendEmail({
    to: email,
    subject: 'Welcome to MixExperts! 🎵',
    html,
    tags: [
      { name: 'category', value: 'welcome' },
      { name: 'user_role', value: role },
    ],
  });
}
```

**Usage in signup flow:**
```typescript
// In your signup handler after profile creation
import { sendWelcomeEmail } from '@/lib/email-templates/welcome';

await sendWelcomeEmail({
  email: user.email,
  displayName: profile.display_name,
  username: profile.username,
  role: profile.role,
});
```

- [ ] Welcome email template created
- [ ] Role-specific content (engineer vs. artist)
- [ ] Next steps and getting started guidance
- [ ] CTA to dashboard included
- [ ] Integration with signup flow tested

---

## Stage 11.6: Create Email Verification Template

**Goal:** Send email verification link to confirm user's email address.

**Create file:** `src/lib/email-templates/verify-email.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export interface VerifyEmailData {
  email: string;
  displayName: string;
  verificationUrl: string;
}

export async function sendVerificationEmail(data: VerifyEmailData) {
  const { email, displayName, verificationUrl } = data;

  const body = `
    <p>Hi ${displayName},</p>

    <p>Thanks for signing up for MixExperts! Please verify your email address to complete your account setup.</p>

    <p>Click the button below to verify your email address:</p>

    <div style="margin: 24px 0;">
      <p style="color: #71717a; font-size: 14px; line-height: 20px; margin: 16px 0 0 0;">
        Or copy and paste this link into your browser:
      </p>
      <p style="color: #52525b; font-size: 14px; word-break: break-all;">
        ${verificationUrl}
      </p>
    </div>

    <div class="divider"></div>

    <p style="color: #71717a; font-size: 14px; line-height: 20px;">
      <strong>This link will expire in 24 hours.</strong>
    </p>

    <p style="color: #71717a; font-size: 14px; line-height: 20px;">
      If you didn't create an account with MixExperts, you can safely ignore this email.
    </p>
  `;

  const html = getEmailTemplate({
    previewText: 'Verify your MixExperts email address',
    heading: 'Verify Your Email',
    body,
    ctaText: 'Verify Email Address',
    ctaUrl: verificationUrl,
    footerText: 'This is an automated email. Please do not reply.',
  });

  return sendEmail({
    to: email,
    subject: 'Verify your MixExperts email address',
    html,
    tags: [
      { name: 'category', value: 'verification' },
    ],
  });
}
```

- [ ] Email verification template created
- [ ] Verification link included
- [ ] Expiration notice added
- [ ] Security reminder included
- [ ] Integration with Supabase auth tested

---

## Stage 11.7: Create Password Reset Template

**Goal:** Send secure password reset link to users.

**Create file:** `src/lib/email-templates/password-reset.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export interface PasswordResetData {
  email: string;
  displayName: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail(data: PasswordResetData) {
  const { email, displayName, resetUrl } = data;

  const body = `
    <p>Hi ${displayName},</p>

    <p>We received a request to reset your password for your MixExperts account.</p>

    <p>Click the button below to reset your password:</p>

    <div style="margin: 24px 0;">
      <p style="color: #71717a; font-size: 14px; line-height: 20px; margin: 16px 0 0 0;">
        Or copy and paste this link into your browser:
      </p>
      <p style="color: #52525b; font-size: 14px; word-break: break-all;">
        ${resetUrl}
      </p>
    </div>

    <div class="divider"></div>

    <p style="color: #fca5a5; font-size: 14px; line-height: 20px;">
      <strong>Security Notice:</strong>
    </p>
    <ul style="color: #71717a; font-size: 14px; line-height: 20px;">
      <li>This link will expire in 1 hour</li>
      <li>If you didn't request a password reset, please ignore this email</li>
      <li>Your password will not be changed unless you click the link above</li>
      <li>For security, never share this link with anyone</li>
    </ul>

    <p style="color: #71717a; font-size: 14px; line-height: 20px; margin-top: 24px;">
      If you continue to have problems, contact us at <a href="mailto:${process.env.RESEND_SUPPORT_EMAIL}" style="color: #f59e0b; text-decoration: underline;">${process.env.RESEND_SUPPORT_EMAIL}</a>.
    </p>
  `;

  const html = getEmailTemplate({
    previewText: 'Reset your MixExperts password',
    heading: 'Reset Your Password',
    body,
    ctaText: 'Reset Password',
    ctaUrl: resetUrl,
    footerText: 'This is an automated security email. Please do not reply.',
  });

  return sendEmail({
    to: email,
    subject: 'Reset your MixExperts password',
    html,
    tags: [
      { name: 'category', value: 'password_reset' },
    ],
  });
}
```

- [ ] Password reset template created
- [ ] Security warnings included
- [ ] Link expiration notice added
- [ ] Support contact provided
- [ ] Integration with auth flow tested

---

## Stage 11.8: Create Booking Confirmation Template (Client)

**Goal:** Send booking confirmation to clients after successful payment.

**Create file:** `src/lib/email-templates/booking-confirmation.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export interface BookingConfirmationData {
  clientEmail: string;
  clientName: string;
  orderNumber: string;
  engineerName: string;
  engineerUsername: string;
  serviceName: string;
  total: number;
  currency: string;
  turnaroundDays: number;
  dueDate: string;
  orderUrl: string;
}

export async function sendBookingConfirmationEmail(data: BookingConfirmationData) {
  const {
    clientEmail,
    clientName,
    orderNumber,
    engineerName,
    engineerUsername,
    serviceName,
    total,
    currency,
    turnaroundDays,
    dueDate,
    orderUrl,
  } = data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const body = `
    <p>Hi ${clientName},</p>

    <p>Great news! Your booking with ${engineerName} has been confirmed. 🎉</p>

    <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #f59e0b; font-size: 18px; margin: 0 0 16px 0;">Booking Details</h3>
      <table style="width: 100%; color: #a1a1aa; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0;"><strong>Order Number:</strong></td>
          <td style="padding: 8px 0; text-align: right;">#${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Engineer:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${engineerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Service:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${serviceName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Turnaround:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${turnaroundDays} days</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Expected Delivery:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${dueDate}</td>
        </tr>
        <tr style="border-top: 1px solid #3f3f46;">
          <td style="padding: 12px 0 0 0;"><strong style="color: #f59e0b;">Total Paid:</strong></td>
          <td style="padding: 12px 0 0 0; text-align: right;"><strong style="color: #f59e0b; font-size: 18px;">${formatCurrency(total)}</strong></td>
        </tr>
      </table>
    </div>

    <div class="divider"></div>

    <p><strong>What happens next?</strong></p>
    <ol style="color: #a1a1aa; font-size: 16px; line-height: 24px; margin: 16px 0;">
      <li>${engineerName} will review your project details</li>
      <li>You'll receive updates as your project progresses</li>
      <li>You can track your order status in your dashboard</li>
      <li>Files will be delivered to you when complete</li>
    </ol>

    <p style="margin-top: 24px;">You can message ${engineerName} directly through your order page if you have any questions.</p>
  `;

  const html = getEmailTemplate({
    previewText: `Booking confirmed with ${engineerName} - Order #${orderNumber}`,
    heading: 'Booking Confirmed!',
    body,
    ctaText: 'View Order',
    ctaUrl: orderUrl,
    footerText: `Questions? Contact ${engineerName} through your order page or email us at ${process.env.RESEND_SUPPORT_EMAIL}`,
  });

  return sendEmail({
    to: clientEmail,
    subject: `Booking Confirmed with ${engineerName} - Order #${orderNumber}`,
    html,
    tags: [
      { name: 'category', value: 'booking_confirmation' },
      { name: 'order_number', value: orderNumber },
    ],
  });
}
```

- [ ] Booking confirmation template created
- [ ] Order details summary included
- [ ] Next steps explained
- [ ] CTA to order page added
- [ ] Integration with checkout success tested

---

## Stage 11.9: Create New Booking Notification (Engineer)

**Goal:** Notify engineers of new bookings.

**Create file:** `src/lib/email-templates/new-booking-engineer.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export interface NewBookingEngineerData {
  engineerEmail: string;
  engineerName: string;
  orderNumber: string;
  clientName: string;
  serviceName: string;
  total: number;
  engineerPayout: number;
  currency: string;
  turnaroundDays: number;
  dueDate: string;
  notes: string;
  orderUrl: string;
}

export async function sendNewBookingEngineerEmail(data: NewBookingEngineerData) {
  const {
    engineerEmail,
    engineerName,
    orderNumber,
    clientName,
    serviceName,
    total,
    engineerPayout,
    currency,
    turnaroundDays,
    dueDate,
    notes,
    orderUrl,
  } = data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const body = `
    <p>Hi ${engineerName},</p>

    <p>You have a new booking! 🎉</p>

    <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #f59e0b; font-size: 18px; margin: 0 0 16px 0;">Order Details</h3>
      <table style="width: 100%; color: #a1a1aa; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0;"><strong>Order Number:</strong></td>
          <td style="padding: 8px 0; text-align: right;">#${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Client:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${clientName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Service:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${serviceName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Turnaround:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${turnaroundDays} days</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Due Date:</strong></td>
          <td style="padding: 8px 0; text-align: right; color: #fca5a5;"><strong>${dueDate}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Order Total:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${formatCurrency(total)}</td>
        </tr>
        <tr style="border-top: 1px solid #3f3f46;">
          <td style="padding: 12px 0 0 0;"><strong style="color: #10b981;">Your Payout:</strong></td>
          <td style="padding: 12px 0 0 0; text-align: right;"><strong style="color: #10b981; font-size: 18px;">${formatCurrency(engineerPayout)}</strong></td>
        </tr>
      </table>
    </div>

    ${
      notes
        ? `
          <div style="background-color: #18181b; border-left: 3px solid #f59e0b; padding: 16px; margin: 24px 0;">
            <p style="color: #f59e0b; font-weight: 600; margin: 0 0 8px 0;">Project Notes:</p>
            <p style="color: #a1a1aa; margin: 0;">${notes}</p>
          </div>
        `
        : ''
    }

    <div class="divider"></div>

    <p><strong>Next Steps:</strong></p>
    <ol style="color: #a1a1aa; font-size: 16px; line-height: 24px; margin: 16px 0;">
      <li>Review the project details and requirements</li>
      <li>Download any files the client uploaded</li>
      <li>Start working on the project</li>
      <li>Upload deliverables when complete</li>
      <li>Mark the order as delivered</li>
    </ol>

    <p style="margin-top: 24px;">Payment will be transferred to your Stripe account 2 business days after delivery.</p>
  `;

  const html = getEmailTemplate({
    previewText: `New booking from ${clientName} - Order #${orderNumber}`,
    heading: 'New Booking!',
    body,
    ctaText: 'View Order Details',
    ctaUrl: orderUrl,
    footerText: 'Keep up the great work! Your clients appreciate your expertise.',
  });

  return sendEmail({
    to: engineerEmail,
    subject: `New Booking from ${clientName} - Order #${orderNumber}`,
    html,
    tags: [
      { name: 'category', value: 'new_booking_engineer' },
      { name: 'order_number', value: orderNumber },
    ],
  });
}
```

- [ ] Engineer booking notification created
- [ ] Payout amount highlighted
- [ ] Due date emphasized
- [ ] Project notes included
- [ ] Next steps outlined

---

## Stage 11.10: Create Order Status Update Template

**Goal:** Notify clients when order status changes.

**Create file:** `src/lib/email-templates/order-status-update.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export type OrderStatus = 'confirmed' | 'in_progress' | 'review' | 'revision' | 'completed';

export interface OrderStatusUpdateData {
  clientEmail: string;
  clientName: string;
  orderNumber: string;
  engineerName: string;
  serviceName: string;
  status: OrderStatus;
  statusMessage?: string;
  orderUrl: string;
}

const statusConfig = {
  confirmed: {
    icon: '✅',
    heading: 'Order Confirmed',
    color: '#10b981',
    message: 'Your order has been confirmed and is being prepared.',
  },
  in_progress: {
    icon: '🎵',
    heading: 'Work in Progress',
    color: '#3b82f6',
    message: 'Your engineer has started working on your project.',
  },
  review: {
    icon: '👂',
    heading: 'Ready for Review',
    color: '#f59e0b',
    message: 'Your project is ready for your review!',
  },
  revision: {
    icon: '🔄',
    heading: 'Revision in Progress',
    color: '#8b5cf6',
    message: 'Your engineer is working on the requested revisions.',
  },
  completed: {
    icon: '🎉',
    heading: 'Order Completed',
    color: '#10b981',
    message: 'Your project is complete! Files are ready for download.',
  },
};

export async function sendOrderStatusUpdateEmail(data: OrderStatusUpdateData) {
  const {
    clientEmail,
    clientName,
    orderNumber,
    engineerName,
    serviceName,
    status,
    statusMessage,
    orderUrl,
  } = data;

  const config = statusConfig[status];

  const body = `
    <p>Hi ${clientName},</p>

    <p>Your order with ${engineerName} has been updated.</p>

    <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid ${config.color};">
      <div style="display: flex; align-items: center; margin-bottom: 16px;">
        <span style="font-size: 32px; margin-right: 12px;">${config.icon}</span>
        <h3 style="color: ${config.color}; font-size: 20px; margin: 0;">${config.heading}</h3>
      </div>
      <p style="color: #a1a1aa; margin: 0;">${statusMessage || config.message}</p>
    </div>

    <div style="background-color: #18181b; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <table style="width: 100%; color: #a1a1aa; font-size: 14px;">
        <tr>
          <td style="padding: 4px 0;"><strong>Order:</strong></td>
          <td style="padding: 4px 0; text-align: right;">#${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;"><strong>Service:</strong></td>
          <td style="padding: 4px 0; text-align: right;">${serviceName}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0;"><strong>Engineer:</strong></td>
          <td style="padding: 4px 0; text-align: right;">${engineerName}</td>
        </tr>
      </table>
    </div>

    ${
      status === 'review' || status === 'completed'
        ? `
          <div class="divider"></div>
          <p><strong>Action Required:</strong></p>
          <p>Click the button below to ${status === 'review' ? 'review your files and provide feedback' : 'download your completed files'}.</p>
        `
        : ''
    }
  `;

  const html = getEmailTemplate({
    previewText: `Order #${orderNumber} - ${config.heading}`,
    heading: config.heading,
    body,
    ctaText: status === 'review' || status === 'completed' ? 'View Order' : 'Track Progress',
    ctaUrl: orderUrl,
  });

  return sendEmail({
    to: clientEmail,
    subject: `Order #${orderNumber} - ${config.heading}`,
    html,
    tags: [
      { name: 'category', value: 'order_status_update' },
      { name: 'order_number', value: orderNumber },
      { name: 'status', value: status },
    ],
  });
}
```

- [ ] Order status update template created
- [ ] Different status types handled
- [ ] Color-coded status indicators
- [ ] Action items for review/completion
- [ ] Integration with order workflow tested

---

## Stage 11.11: Create Delivery Notification Template

**Goal:** Notify client when files are delivered.

**Create file:** `src/lib/email-templates/delivery-notification.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export interface DeliveryNotificationData {
  clientEmail: string;
  clientName: string;
  orderNumber: string;
  engineerName: string;
  serviceName: string;
  fileCount: number;
  revisionCount: number;
  maxRevisions: number;
  deliveryNotes?: string;
  orderUrl: string;
}

export async function sendDeliveryNotificationEmail(data: DeliveryNotificationData) {
  const {
    clientEmail,
    clientName,
    orderNumber,
    engineerName,
    serviceName,
    fileCount,
    revisionCount,
    maxRevisions,
    deliveryNotes,
    orderUrl,
  } = data;

  const hasRevisionsLeft = revisionCount < maxRevisions;
  const revisionsLeft = maxRevisions - revisionCount;

  const body = `
    <p>Hi ${clientName},</p>

    <p>Great news! ${engineerName} has delivered your completed files. 🎉</p>

    <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #10b981; font-size: 18px; margin: 0 0 16px 0;">✨ Your Files Are Ready!</h3>
      <p style="color: #a1a1aa; margin: 0 0 16px 0;">
        ${fileCount} file${fileCount !== 1 ? 's' : ''} delivered for Order #${orderNumber}
      </p>
      <p style="color: #a1a1aa; margin: 0;">
        Service: <strong>${serviceName}</strong>
      </p>
    </div>

    ${
      deliveryNotes
        ? `
          <div style="background-color: #18181b; border-left: 3px solid #f59e0b; padding: 16px; margin: 24px 0;">
            <p style="color: #f59e0b; font-weight: 600; margin: 0 0 8px 0;">Delivery Notes from ${engineerName}:</p>
            <p style="color: #a1a1aa; margin: 0;">${deliveryNotes}</p>
          </div>
        `
        : ''
    }

    <div class="divider"></div>

    <p><strong>What's Next?</strong></p>
    <ol style="color: #a1a1aa; font-size: 16px; line-height: 24px; margin: 16px 0;">
      <li>Download your files from the order page</li>
      <li>Review the work carefully</li>
      ${
        hasRevisionsLeft
          ? `<li>Request revisions if needed (${revisionsLeft} revision${revisionsLeft !== 1 ? 's' : ''} remaining)</li>`
          : ''
      }
      <li>Leave a review to help ${engineerName} grow their business</li>
    </ol>

    ${
      hasRevisionsLeft
        ? `
          <div style="background-color: #18181b; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="color: #a1a1aa; font-size: 14px; margin: 0;">
              💡 <strong>Tip:</strong> You have ${revisionsLeft} revision${revisionsLeft !== 1 ? 's' : ''} included. If you need any adjustments, just let ${engineerName} know through your order page!
            </p>
          </div>
        `
        : ''
    }

    <p style="margin-top: 24px;">If everything looks great, don't forget to leave a review. It really helps ${engineerName}!</p>
  `;

  const html = getEmailTemplate({
    previewText: `Your files from ${engineerName} are ready! Order #${orderNumber}`,
    heading: 'Files Delivered!',
    body,
    ctaText: 'Download Files',
    ctaUrl: orderUrl,
  });

  return sendEmail({
    to: clientEmail,
    subject: `Files Delivered! Order #${orderNumber}`,
    html,
    tags: [
      { name: 'category', value: 'delivery' },
      { name: 'order_number', value: orderNumber },
    ],
  });
}
```

- [ ] Delivery notification template created
- [ ] File count displayed
- [ ] Delivery notes included
- [ ] Revision status shown
- [ ] Review request included

---

## Stage 11.12: Create Review Request Template

**Goal:** Request reviews from clients after order completion.

**Create file:** `src/lib/email-templates/review-request.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export interface ReviewRequestData {
  clientEmail: string;
  clientName: string;
  orderNumber: string;
  engineerName: string;
  engineerUsername: string;
  serviceName: string;
  reviewUrl: string;
}

export async function sendReviewRequestEmail(data: ReviewRequestData) {
  const {
    clientEmail,
    clientName,
    orderNumber,
    engineerName,
    engineerUsername,
    serviceName,
    reviewUrl,
  } = data;

  const body = `
    <p>Hi ${clientName},</p>

    <p>We hope you loved working with ${engineerName} on your recent project!</p>

    <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center;">
      <p style="font-size: 48px; margin: 0 0 16px 0;">⭐⭐⭐⭐⭐</p>
      <h3 style="color: #f59e0b; font-size: 20px; margin: 0 0 8px 0;">How did it go?</h3>
      <p style="color: #a1a1aa; margin: 0;">Your feedback helps other artists find great engineers</p>
    </div>

    <p>Taking 2 minutes to leave a review would mean the world to ${engineerName} and helps other artists make informed decisions.</p>

    <div style="background-color: #18181b; border-radius: 8px; padding: 20px; margin: 24px 0;">
      <p style="color: #a1a1aa; margin: 0 0 8px 0;"><strong>Order:</strong> #${orderNumber}</p>
      <p style="color: #a1a1aa; margin: 0;"><strong>Service:</strong> ${serviceName}</p>
    </div>

    <div class="divider"></div>

    <p><strong>Your review will cover:</strong></p>
    <ul style="color: #a1a1aa; font-size: 16px; line-height: 24px; margin: 16px 0;">
      <li>Overall rating (1-5 stars)</li>
      <li>Quality of work</li>
      <li>Communication</li>
      <li>Timeliness</li>
      <li>Optional written feedback</li>
    </ul>

    <p style="margin-top: 24px;">Thanks for being part of the MixExperts community! 🎵</p>
  `;

  const html = getEmailTemplate({
    previewText: `How was your experience with ${engineerName}?`,
    heading: 'Leave a Review',
    body,
    ctaText: 'Write a Review',
    ctaUrl: reviewUrl,
    footerText: 'Reviews help build trust in the MixExperts community.',
  });

  return sendEmail({
    to: clientEmail,
    subject: `How was your experience with ${engineerName}?`,
    html,
    tags: [
      { name: 'category', value: 'review_request' },
      { name: 'order_number', value: orderNumber },
    ],
  });
}
```

- [ ] Review request template created
- [ ] Star rating visual included
- [ ] Review criteria explained
- [ ] Order details referenced
- [ ] Positive, friendly tone

---

## Stage 11.13: Create Subscription Confirmation Template

**Goal:** Confirm subscription activation.

**Create file:** `src/lib/email-templates/subscription-confirmation.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export type SubscriptionTier = 'pro' | 'enterprise';

export interface SubscriptionConfirmationData {
  email: string;
  displayName: string;
  tier: SubscriptionTier;
  billingPeriod: 'monthly' | 'yearly';
  amount: number;
  nextBillingDate: string;
  billingPortalUrl: string;
}

const tierFeatures = {
  pro: [
    '0% platform fee on all services',
    'Unlimited portfolio items',
    'Advanced analytics dashboard',
    'Priority support',
    'Custom profile URL',
    'Featured in search results',
  ],
  enterprise: [
    'Everything in Pro, plus:',
    'AI-powered project matching',
    'Dedicated account manager',
    'White-label options',
    'API access',
    'Custom integrations',
    'Priority onboarding',
  ],
};

export async function sendSubscriptionConfirmationEmail(data: SubscriptionConfirmationData) {
  const {
    email,
    displayName,
    tier,
    billingPeriod,
    amount,
    nextBillingDate,
    billingPortalUrl,
  } = data;

  const tierName = tier === 'pro' ? 'Pro' : 'Enterprise';
  const features = tierFeatures[tier];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const body = `
    <p>Hi ${displayName},</p>

    <p>Welcome to MixExperts ${tierName}! 🎉 Your subscription is now active.</p>

    <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #f59e0b; font-size: 20px; margin: 0 0 16px 0;">Subscription Details</h3>
      <table style="width: 100%; color: #a1a1aa; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0;"><strong>Plan:</strong></td>
          <td style="padding: 8px 0; text-align: right;">MixExperts ${tierName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Billing:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${formatCurrency(amount)}/${billingPeriod}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Next Billing Date:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${nextBillingDate}</td>
        </tr>
      </table>
    </div>

    <div class="divider"></div>

    <p><strong>What's included in ${tierName}:</strong></p>
    <ul style="color: #a1a1aa; font-size: 16px; line-height: 28px; margin: 16px 0;">
      ${features.map((feature) => `<li>${feature}</li>`).join('')}
    </ul>

    ${
      tier === 'pro'
        ? `
          <div style="background-color: #18181b; border-left: 3px solid #10b981; padding: 16px; margin: 24px 0;">
            <p style="color: #10b981; font-weight: 600; margin: 0 0 8px 0;">💰 Start Earning More!</p>
            <p style="color: #a1a1aa; margin: 0;">With 0% platform fees, you keep 97% of every booking (Stripe fees still apply). That's an extra 10% in your pocket!</p>
          </div>
        `
        : ''
    }

    <p style="margin-top: 24px;"><strong>Managing Your Subscription:</strong></p>
    <p>You can update your payment method, view invoices, or cancel anytime from your billing portal.</p>
  `;

  const html = getEmailTemplate({
    previewText: `Welcome to MixExperts ${tierName}!`,
    heading: `Welcome to ${tierName}!`,
    body,
    ctaText: 'Manage Billing',
    ctaUrl: billingPortalUrl,
  });

  return sendEmail({
    to: email,
    subject: `Welcome to MixExperts ${tierName}!`,
    html,
    tags: [
      { name: 'category', value: 'subscription_confirmation' },
      { name: 'tier', value: tier },
    ],
  });
}
```

- [ ] Subscription confirmation template created
- [ ] Plan features listed
- [ ] Billing details included
- [ ] Benefits highlighted
- [ ] Billing portal link added

---

## Stage 11.14: Create Subscription Renewal Reminder

**Goal:** Remind users before subscription renewal.

**Create file:** `src/lib/email-templates/subscription-renewal.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export interface SubscriptionRenewalData {
  email: string;
  displayName: string;
  tier: 'pro' | 'enterprise';
  amount: number;
  renewalDate: string;
  billingPortalUrl: string;
}

export async function sendSubscriptionRenewalEmail(data: SubscriptionRenewalData) {
  const {
    email,
    displayName,
    tier,
    amount,
    renewalDate,
    billingPortalUrl,
  } = data;

  const tierName = tier === 'pro' ? 'Pro' : 'Enterprise';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const body = `
    <p>Hi ${displayName},</p>

    <p>This is a friendly reminder that your MixExperts ${tierName} subscription will renew soon.</p>

    <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #f59e0b; font-size: 18px; margin: 0 0 16px 0;">Upcoming Renewal</h3>
      <table style="width: 100%; color: #a1a1aa; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0;"><strong>Plan:</strong></td>
          <td style="padding: 8px 0; text-align: right;">MixExperts ${tierName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Amount:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${formatCurrency(amount)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Renewal Date:</strong></td>
          <td style="padding: 8px 0; text-align: right; color: #f59e0b;"><strong>${renewalDate}</strong></td>
        </tr>
      </table>
    </div>

    <p>No action is required - your subscription will automatically renew using your saved payment method.</p>

    <div class="divider"></div>

    <p><strong>Need to make changes?</strong></p>
    <p>You can update your payment method, change your plan, or cancel anytime from your billing portal.</p>

    <p style="margin-top: 24px;">Thanks for being a valued MixExperts ${tierName} member! 🎵</p>
  `;

  const html = getEmailTemplate({
    previewText: `Your ${tierName} subscription renews on ${renewalDate}`,
    heading: 'Subscription Renewal Reminder',
    body,
    ctaText: 'Manage Subscription',
    ctaUrl: billingPortalUrl,
  });

  return sendEmail({
    to: email,
    subject: `Your MixExperts ${tierName} subscription renews on ${renewalDate}`,
    html,
    tags: [
      { name: 'category', value: 'subscription_renewal' },
      { name: 'tier', value: tier },
    ],
  });
}
```

- [ ] Renewal reminder template created
- [ ] Renewal date highlighted
- [ ] Amount and plan shown
- [ ] Options to update/cancel provided
- [ ] Sent 3 days before renewal

---

## Stage 11.15: Create Payment Failed Template

**Goal:** Notify users of failed payment and provide recovery options.

**Create file:** `src/lib/email-templates/payment-failed.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export interface PaymentFailedData {
  email: string;
  displayName: string;
  tier: 'pro' | 'enterprise';
  amount: number;
  failureReason?: string;
  retryDate: string;
  billingPortalUrl: string;
}

export async function sendPaymentFailedEmail(data: PaymentFailedData) {
  const {
    email,
    displayName,
    tier,
    amount,
    failureReason,
    retryDate,
    billingPortalUrl,
  } = data;

  const tierName = tier === 'pro' ? 'Pro' : 'Enterprise';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const body = `
    <p>Hi ${displayName},</p>

    <p>We had trouble processing your payment for MixExperts ${tierName}.</p>

    <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #ef4444;">
      <h3 style="color: #ef4444; font-size: 18px; margin: 0 0 16px 0;">⚠️ Payment Issue</h3>
      <table style="width: 100%; color: #a1a1aa; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0;"><strong>Plan:</strong></td>
          <td style="padding: 8px 0; text-align: right;">MixExperts ${tierName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Amount:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${formatCurrency(amount)}</td>
        </tr>
        ${
          failureReason
            ? `
            <tr>
              <td style="padding: 8px 0;"><strong>Reason:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${failureReason}</td>
            </tr>
          `
            : ''
        }
        <tr>
          <td style="padding: 8px 0;"><strong>Next Retry:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${retryDate}</td>
        </tr>
      </table>
    </div>

    <p><strong>What happens now?</strong></p>
    <ul style="color: #a1a1aa; font-size: 16px; line-height: 24px; margin: 16px 0;">
      <li>We'll automatically retry charging your card on ${retryDate}</li>
      <li>Your ${tierName} features remain active during this grace period</li>
      <li>If payment fails again, your account will be downgraded to Free</li>
    </ul>

    <div class="divider"></div>

    <p><strong>How to fix this:</strong></p>
    <ol style="color: #a1a1aa; font-size: 16px; line-height: 24px; margin: 16px 0;">
      <li>Click the button below to access your billing portal</li>
      <li>Update your payment method</li>
      <li>We'll automatically retry the payment</li>
    </ol>

    <div style="background-color: #18181b; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="color: #a1a1aa; font-size: 14px; margin: 0;">
        💡 <strong>Common issues:</strong> Expired card, insufficient funds, or bank blocking the charge. Contact your bank if you continue having issues.
      </p>
    </div>
  `;

  const html = getEmailTemplate({
    previewText: `Action required: Update payment method for ${tierName}`,
    heading: 'Payment Issue',
    body,
    ctaText: 'Update Payment Method',
    ctaUrl: billingPortalUrl,
  });

  return sendEmail({
    to: email,
    subject: `Action Required: Update Payment Method for MixExperts ${tierName}`,
    html,
    tags: [
      { name: 'category', value: 'payment_failed' },
      { name: 'tier', value: tier },
    ],
  });
}
```

- [ ] Payment failed template created
- [ ] Failure reason displayed
- [ ] Grace period explained
- [ ] Clear action steps provided
- [ ] Troubleshooting tips included

---

## Stage 11.16: Create New Inquiry Notification

**Goal:** Notify engineers of new inquiries from potential clients.

**Create file:** `src/lib/email-templates/new-inquiry.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export interface NewInquiryData {
  engineerEmail: string;
  engineerName: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  inboxUrl: string;
}

export async function sendNewInquiryEmail(data: NewInquiryData) {
  const {
    engineerEmail,
    engineerName,
    senderName,
    senderEmail,
    subject,
    message,
    inboxUrl,
  } = data;

  const body = `
    <p>Hi ${engineerName},</p>

    <p>You have a new inquiry from ${senderName}! 💌</p>

    <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #f59e0b; font-size: 18px; margin: 0 0 16px 0;">Inquiry Details</h3>
      <table style="width: 100%; color: #a1a1aa; font-size: 14px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0;"><strong>From:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${senderName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Email:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${senderEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Subject:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${subject}</td>
        </tr>
      </table>

      <div style="border-top: 1px solid #3f3f46; padding-top: 16px;">
        <p style="color: #f59e0b; font-weight: 600; margin: 0 0 8px 0;">Message:</p>
        <p style="color: #a1a1aa; white-space: pre-wrap; margin: 0;">${message}</p>
      </div>
    </div>

    <div class="divider"></div>

    <p><strong>💡 Pro Tip:</strong> Responding quickly increases your chances of converting inquiries into bookings. Aim to reply within 24 hours!</p>

    <div style="background-color: #18181b; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="color: #a1a1aa; font-size: 14px; margin: 0;">
        <strong>Response Tips:</strong>
      </p>
      <ul style="color: #71717a; font-size: 14px; line-height: 20px; margin: 8px 0 0 20px;">
        <li>Address their specific needs</li>
        <li>Share relevant portfolio examples</li>
        <li>Be clear about pricing and timelines</li>
        <li>Suggest a quick call if needed</li>
      </ul>
    </div>
  `;

  const html = getEmailTemplate({
    previewText: `New inquiry from ${senderName}`,
    heading: 'New Inquiry!',
    body,
    ctaText: 'Reply to Inquiry',
    ctaUrl: inboxUrl,
    footerText: 'Quick responses help you stand out and win more business!',
  });

  return sendEmail({
    to: engineerEmail,
    subject: `New Inquiry from ${senderName}`,
    html,
    replyTo: senderEmail,
    tags: [
      { name: 'category', value: 'new_inquiry' },
    ],
  });
}
```

- [ ] New inquiry notification created
- [ ] Sender details displayed
- [ ] Full message included
- [ ] Response tips provided
- [ ] Reply-to header set to sender

---

## Stage 11.17: Create Inquiry Reply Notification

**Goal:** Notify inquiry senders when engineers reply.

**Create file:** `src/lib/email-templates/inquiry-reply.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export interface InquiryReplyData {
  recipientEmail: string;
  recipientName: string;
  engineerName: string;
  engineerUsername: string;
  replyMessage: string;
  conversationUrl: string;
}

export async function sendInquiryReplyEmail(data: InquiryReplyData) {
  const {
    recipientEmail,
    recipientName,
    engineerName,
    engineerUsername,
    replyMessage,
    conversationUrl,
  } = data;

  const body = `
    <p>Hi ${recipientName},</p>

    <p>${engineerName} has replied to your inquiry! 📬</p>

    <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin: 24px 0;">
      <div style="display: flex; align-items: center; margin-bottom: 16px;">
        <div>
          <h3 style="color: #f59e0b; font-size: 18px; margin: 0;">Reply from ${engineerName}</h3>
        </div>
      </div>

      <div style="border-top: 1px solid #3f3f46; padding-top: 16px;">
        <p style="color: #a1a1aa; white-space: pre-wrap; margin: 0;">${replyMessage}</p>
      </div>
    </div>

    <p>Click below to view the full conversation and continue the discussion.</p>

    <div class="divider"></div>

    <p><strong>Ready to book?</strong></p>
    <p>If you're happy with ${engineerName}'s response, you can check out their services and book directly from their profile.</p>

    <p style="margin-top: 24px;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/${engineerUsername}" style="color: #f59e0b; text-decoration: underline;">View ${engineerName}'s Profile →</a>
    </p>
  `;

  const html = getEmailTemplate({
    previewText: `${engineerName} replied to your inquiry`,
    heading: 'New Reply!',
    body,
    ctaText: 'View Conversation',
    ctaUrl: conversationUrl,
  });

  return sendEmail({
    to: recipientEmail,
    subject: `${engineerName} replied to your inquiry`,
    html,
    tags: [
      { name: 'category', value: 'inquiry_reply' },
    ],
  });
}
```

- [ ] Inquiry reply notification created
- [ ] Engineer reply displayed
- [ ] Link to conversation included
- [ ] CTA to view profile added
- [ ] Encourages booking

---

## Stage 11.18: Create Product Purchase Confirmation

**Goal:** Confirm digital product purchases and provide download link.

**Create file:** `src/lib/email-templates/product-purchase.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export interface ProductPurchaseData {
  buyerEmail: string;
  buyerName: string;
  productName: string;
  sellerName: string;
  price: number;
  currency: string;
  downloadUrl: string;
  downloadExpiry: string;
  maxDownloads: number;
  licenseType: string;
}

export async function sendProductPurchaseEmail(data: ProductPurchaseData) {
  const {
    buyerEmail,
    buyerName,
    productName,
    sellerName,
    price,
    currency,
    downloadUrl,
    downloadExpiry,
    maxDownloads,
    licenseType,
  } = data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const body = `
    <p>Hi ${buyerName},</p>

    <p>Thanks for your purchase! Your download is ready. 🎉</p>

    <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #10b981; font-size: 18px; margin: 0 0 16px 0;">✅ Purchase Confirmed</h3>
      <table style="width: 100%; color: #a1a1aa; font-size: 14px;">
        <tr>
          <td style="padding: 8px 0;"><strong>Product:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${productName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Creator:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${sellerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>License:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${licenseType.charAt(0).toUpperCase() + licenseType.slice(1)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Price:</strong></td>
          <td style="padding: 8px 0; text-align: right;">${formatCurrency(price)}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #18181b; border-left: 3px solid #f59e0b; padding: 16px; margin: 24px 0;">
      <p style="color: #f59e0b; font-weight: 600; margin: 0 0 8px 0;">⏰ Download Information</p>
      <ul style="color: #a1a1aa; font-size: 14px; line-height: 20px; margin: 0;">
        <li>Download link expires: ${downloadExpiry}</li>
        <li>Maximum downloads: ${maxDownloads}</li>
        <li>You can re-request the download link from your purchase history</li>
      </ul>
    </div>

    <div class="divider"></div>

    <p><strong>📄 License Terms:</strong></p>
    <p style="color: #a1a1aa;">
      Your ${licenseType} license allows you to use this product according to the terms specified by the creator.
      Please review the full license terms included with your download.
    </p>

    <p style="margin-top: 24px;">Need help? Contact us at <a href="mailto:${process.env.RESEND_SUPPORT_EMAIL}" style="color: #f59e0b; text-decoration: underline;">${process.env.RESEND_SUPPORT_EMAIL}</a>.</p>
  `;

  const html = getEmailTemplate({
    previewText: `Download ${productName} - Purchase confirmed`,
    heading: 'Download Ready!',
    body,
    ctaText: 'Download Now',
    ctaUrl: downloadUrl,
  });

  return sendEmail({
    to: buyerEmail,
    subject: `Your download is ready: ${productName}`,
    html,
    tags: [
      { name: 'category', value: 'product_purchase' },
      { name: 'license_type', value: licenseType },
    ],
  });
}
```

- [ ] Product purchase confirmation created
- [ ] Download link prominent
- [ ] License type displayed
- [ ] Download limits explained
- [ ] Expiration date shown

---

## Stage 11.19: Create Download Link Email

**Goal:** Resend download link when requested.

**Create file:** `src/lib/email-templates/download-link.ts`

```typescript
import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

export interface DownloadLinkData {
  email: string;
  name: string;
  productName: string;
  downloadUrl: string;
  expiresAt: string;
  downloadsRemaining: number;
}

export async function sendDownloadLinkEmail(data: DownloadLinkData) {
  const {
    email,
    name,
    productName,
    downloadUrl,
    expiresAt,
    downloadsRemaining,
  } = data;

  const body = `
    <p>Hi ${name},</p>

    <p>Here's your download link for <strong>${productName}</strong>, as requested.</p>

    <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center;">
      <h3 style="color: #f59e0b; font-size: 18px; margin: 0 0 16px 0;">${productName}</h3>
      <p style="color: #a1a1aa; margin: 0;">Click below to download your files</p>
    </div>

    <div style="background-color: #18181b; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="color: #a1a1aa; font-size: 14px; margin: 0;">
        ⚠️ <strong>Important:</strong>
      </p>
      <ul style="color: #71717a; font-size: 14px; line-height: 20px; margin: 8px 0 0 20px;">
        <li>Link expires: ${expiresAt}</li>
        <li>Downloads remaining: ${downloadsRemaining}</li>
      </ul>
    </div>

    <p>If you need another download link after this one expires, you can request it from your purchase history.</p>
  `;

  const html = getEmailTemplate({
    previewText: `Download link for ${productName}`,
    heading: 'Your Download Link',
    body,
    ctaText: 'Download Files',
    ctaUrl: downloadUrl,
  });

  return sendEmail({
    to: email,
    subject: `Download link: ${productName}`,
    html,
    tags: [
      { name: 'category', value: 'download_link' },
    ],
  });
}
```

- [ ] Download link email created
- [ ] Expiration warning included
- [ ] Downloads remaining shown
- [ ] Simple, focused template
- [ ] Request flow implemented

---

## Stage 11.20: Implement Email Preference Settings

**Goal:** Allow users to manage their email preferences.

**Create file:** `src/app/settings/email-preferences/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface EmailPreferences {
  marketing_emails: boolean;
  order_updates: boolean;
  inquiry_notifications: boolean;
  review_requests: boolean;
  subscription_updates: boolean;
  product_updates: boolean;
}

export default function EmailPreferencesPage() {
  const [preferences, setPreferences] = useState<EmailPreferences>({
    marketing_emails: true,
    order_updates: true,
    inquiry_notifications: true,
    review_requests: true,
    subscription_updates: true,
    product_updates: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('email_preferences')
      .select('*')
      .eq('profile_id', user.id)
      .single();

    if (data) {
      setPreferences(data);
    }
    setLoading(false);
  }

  async function savePreferences() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('email_preferences')
      .upsert({
        profile_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);
  }

  // Component UI implementation...
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Email Preferences</h1>
      {/* Preference toggles */}
    </div>
  );
}
```

**Add database table:**
```sql
CREATE TABLE public.email_preferences (
  profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  marketing_emails BOOLEAN DEFAULT true,
  order_updates BOOLEAN DEFAULT true,
  inquiry_notifications BOOLEAN DEFAULT true,
  review_requests BOOLEAN DEFAULT true,
  subscription_updates BOOLEAN DEFAULT true,
  product_updates BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own email preferences"
  ON public.email_preferences FOR ALL
  USING (profile_id = auth.uid());
```

- [ ] Email preferences table created
- [ ] Settings page UI implemented
- [ ] Preference toggles functional
- [ ] Save/update working
- [ ] Preferences checked before sending

---

## Stage 11.21: Add Unsubscribe Functionality

**Goal:** Implement one-click unsubscribe from marketing emails.

**Create file:** `src/app/unsubscribe/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (token) {
      handleUnsubscribe();
    }
  }, [token]);

  async function handleUnsubscribe() {
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="max-w-md w-full bg-zinc-900 rounded-lg p-8 text-center">
        {status === 'loading' && <p>Processing...</p>}
        {status === 'success' && (
          <>
            <h1 className="text-2xl font-bold text-amber-500 mb-4">
              Unsubscribed Successfully
            </h1>
            <p className="text-zinc-400">
              You've been unsubscribed from marketing emails.
              You'll still receive important transactional emails.
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-zinc-400">
              Unable to process unsubscribe request.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
```

**Create API route:** `src/app/api/unsubscribe/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyUnsubscribeToken } from '@/lib/email-utils';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    // Verify token and get user ID
    const userId = await verifyUnsubscribeToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const supabase = createClient();

    // Update email preferences
    await supabase
      .from('email_preferences')
      .upsert({
        profile_id: userId,
        marketing_emails: false,
        review_requests: false,
        product_updates: false,
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```

**Add to email footer:**
```typescript
// In base.ts template
const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${generateUnsubscribeToken(userId)}`;
```

- [ ] Unsubscribe page created
- [ ] Unsubscribe API route implemented
- [ ] Token generation/verification added
- [ ] Unsubscribe link in email footer
- [ ] One-click unsubscribe working

---

## Stage 11.22: Track Email Delivery Status

**Goal:** Track email delivery, opens, and clicks.

**Create database table:**
```sql
CREATE TABLE public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  email_type TEXT NOT NULL,
  resend_id TEXT,
  subject TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'bounced', 'complained', 'failed')),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  bounce_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_logs_profile ON public.email_logs(profile_id, created_at DESC);
CREATE INDEX idx_email_logs_type ON public.email_logs(email_type, created_at DESC);
CREATE INDEX idx_email_logs_status ON public.email_logs(status);
```

**Update email utility to log sends:**
```typescript
// In src/lib/email.ts
export async function sendEmail(options: SendEmailOptions) {
  try {
    const result = await resend.emails.send({
      // ... existing code
    });

    // Log email send
    await logEmailSend({
      recipientEmail: Array.isArray(options.to) ? options.to[0] : options.to,
      emailType: options.tags?.find(t => t.name === 'category')?.value || 'unknown',
      resendId: result.data?.id,
      subject: options.subject,
      status: 'sent',
      metadata: options.tags,
    });

    return result.data;
  } catch (error) {
    // Error handling
  }
}

async function logEmailSend(data: EmailLogData) {
  const supabase = createClient();
  await supabase.from('email_logs').insert(data);
}
```

**Create webhook handler for Resend events:**
```typescript
// src/app/api/webhooks/resend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { type, data } = payload;

    const supabase = createClient();

    switch (type) {
      case 'email.delivered':
        await supabase
          .from('email_logs')
          .update({ status: 'delivered' })
          .eq('resend_id', data.email_id);
        break;

      case 'email.opened':
        await supabase
          .from('email_logs')
          .update({
            status: 'delivered',
            opened_at: new Date().toISOString()
          })
          .eq('resend_id', data.email_id);
        break;

      case 'email.clicked':
        await supabase
          .from('email_logs')
          .update({
            clicked_at: new Date().toISOString()
          })
          .eq('resend_id', data.email_id);
        break;

      case 'email.bounced':
        await supabase
          .from('email_logs')
          .update({
            status: 'bounced',
            bounced_at: new Date().toISOString(),
            bounce_reason: data.reason
          })
          .eq('resend_id', data.email_id);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resend webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
```

- [ ] Email logs table created
- [ ] Logging added to sendEmail function
- [ ] Resend webhook endpoint created
- [ ] Webhook configured in Resend dashboard
- [ ] Delivery tracking working

---

## Stage 11.23: Handle Bounce and Complaint Events

**Goal:** Automatically handle bounces and complaints to protect sender reputation.

**Create bounce handler:**
```typescript
// src/lib/email-bounce-handler.ts
import { createClient } from './supabase/server';

export async function handleEmailBounce(email: string, reason: string) {
  const supabase = createClient();

  // Check if this is a hard bounce
  const isHardBounce = [
    'invalid',
    'does_not_exist',
    'mailbox_full',
    'suppressed',
  ].some(type => reason.toLowerCase().includes(type));

  if (isHardBounce) {
    // Add to suppression list
    await supabase
      .from('email_suppression')
      .insert({
        email,
        reason,
        type: 'bounce',
        suppressed_at: new Date().toISOString(),
      });

    console.log(`Email ${email} added to suppression list (hard bounce)`);
  }
}

export async function handleEmailComplaint(email: string) {
  const supabase = createClient();

  // Add to suppression list
  await supabase
    .from('email_suppression')
    .insert({
      email,
      reason: 'spam_complaint',
      type: 'complaint',
      suppressed_at: new Date().toISOString(),
    });

  // Unsubscribe from all marketing emails
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (profile) {
    await supabase
      .from('email_preferences')
      .upsert({
        profile_id: profile.id,
        marketing_emails: false,
        review_requests: false,
        product_updates: false,
      });
  }

  console.log(`Email ${email} added to suppression list (complaint)`);
}

export async function isEmailSuppressed(email: string): Promise<boolean> {
  const supabase = createClient();

  const { data } = await supabase
    .from('email_suppression')
    .select('id')
    .eq('email', email)
    .single();

  return !!data;
}
```

**Create suppression table:**
```sql
CREATE TABLE public.email_suppression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  reason TEXT,
  type TEXT CHECK (type IN ('bounce', 'complaint', 'manual')),
  suppressed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_suppression_email ON public.email_suppression(email);
```

**Update sendEmail to check suppression:**
```typescript
export async function sendEmail(options: SendEmailOptions) {
  const recipientEmail = Array.isArray(options.to) ? options.to[0] : options.to;

  // Check suppression list
  if (await isEmailSuppressed(recipientEmail)) {
    console.log(`Email to ${recipientEmail} suppressed`);
    return null;
  }

  // Continue with send...
}
```

**Update webhook handler:**
```typescript
case 'email.bounced':
  await handleEmailBounce(data.email, data.reason);
  await supabase
    .from('email_logs')
    .update({
      status: 'bounced',
      bounced_at: new Date().toISOString(),
      bounce_reason: data.reason
    })
    .eq('resend_id', data.email_id);
  break;

case 'email.complained':
  await handleEmailComplaint(data.email);
  await supabase
    .from('email_logs')
    .update({ status: 'complained' })
    .eq('resend_id', data.email_id);
  break;
```

- [ ] Suppression list table created
- [ ] Bounce handler implemented
- [ ] Complaint handler implemented
- [ ] Suppression check in sendEmail
- [ ] Hard vs soft bounce handling

---

## Stage 11.24: Add Email to Webhook Handlers

**Goal:** Integrate email notifications into existing Stripe webhook handlers.

**Update Stripe webhook handler:** `src/app/api/webhooks/stripe/route.ts`

```typescript
import { sendBookingConfirmationEmail } from '@/lib/email-templates/booking-confirmation';
import { sendNewBookingEngineerEmail } from '@/lib/email-templates/new-booking-engineer';
import { sendOrderStatusUpdateEmail } from '@/lib/email-templates/order-status-update';
import { sendSubscriptionConfirmationEmail } from '@/lib/email-templates/subscription-confirmation';
import { sendPaymentFailedEmail } from '@/lib/email-templates/payment-failed';

// In checkout.session.completed handler
case 'checkout.session.completed': {
  const session = event.data.object;

  // ... existing order update logic

  // Send confirmation emails
  if (orderData) {
    // Email to client
    await sendBookingConfirmationEmail({
      clientEmail: orderData.client_email,
      clientName: orderData.client_name,
      orderNumber: orderData.order_number,
      engineerName: engineerProfile.display_name,
      engineerUsername: engineerProfile.username,
      serviceName: orderData.service_name,
      total: orderData.total,
      currency: orderData.currency,
      turnaroundDays: orderData.turnaround_days,
      dueDate: formatDate(orderData.due_date),
      orderUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/${orderData.id}`,
    });

    // Email to engineer
    await sendNewBookingEngineerEmail({
      engineerEmail: engineerProfile.email,
      engineerName: engineerProfile.display_name,
      orderNumber: orderData.order_number,
      clientName: orderData.client_name,
      serviceName: orderData.service_name,
      total: orderData.total,
      engineerPayout: orderData.engineer_payout,
      currency: orderData.currency,
      turnaroundDays: orderData.turnaround_days,
      dueDate: formatDate(orderData.due_date),
      notes: orderData.notes,
      orderUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/projects/${orderData.id}`,
    });
  }
  break;
}

// In customer.subscription.created handler
case 'customer.subscription.created': {
  const subscription = event.data.object;

  // ... existing subscription logic

  await sendSubscriptionConfirmationEmail({
    email: profile.email,
    displayName: profile.display_name,
    tier: tierFromPriceId(subscription.items.data[0].price.id),
    billingPeriod: subscription.items.data[0].price.recurring.interval,
    amount: subscription.items.data[0].price.unit_amount / 100,
    nextBillingDate: formatDate(subscription.current_period_end),
    billingPortalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/portal`,
  });
  break;
}

// In invoice.payment_failed handler
case 'invoice.payment_failed': {
  const invoice = event.data.object;

  // ... existing logic

  await sendPaymentFailedEmail({
    email: profile.email,
    displayName: profile.display_name,
    tier: profile.subscription_tier,
    amount: invoice.amount_due / 100,
    failureReason: invoice.last_payment_error?.message,
    retryDate: formatDate(invoice.next_payment_attempt),
    billingPortalUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/portal`,
  });
  break;
}
```

- [ ] Booking emails added to checkout webhook
- [ ] Subscription emails added to subscription webhooks
- [ ] Payment failure emails added to invoice webhooks
- [ ] All email sends error-handled
- [ ] Email sending tested with test webhooks

---

## Stage 11.25: Test All Email Templates

**Goal:** Comprehensive testing of all email templates and delivery.

**Create test suite:** `src/scripts/test-emails.ts`

```typescript
import { sendWelcomeEmail } from '@/lib/email-templates/welcome';
import { sendVerificationEmail } from '@/lib/email-templates/verify-email';
import { sendPasswordResetEmail } from '@/lib/email-templates/password-reset';
import { sendBookingConfirmationEmail } from '@/lib/email-templates/booking-confirmation';
// ... import all templates

const testEmail = 'your-email@example.com';

async function testAllEmails() {
  console.log('Testing email templates...');

  // Test welcome email
  console.log('1. Testing welcome email...');
  await sendWelcomeEmail({
    email: testEmail,
    displayName: 'Test User',
    username: 'testuser',
    role: 'engineer',
  });

  // Test verification email
  console.log('2. Testing verification email...');
  await sendVerificationEmail({
    email: testEmail,
    displayName: 'Test User',
    verificationUrl: 'https://mixexperts.com/verify?token=test123',
  });

  // Test password reset
  console.log('3. Testing password reset email...');
  await sendPasswordResetEmail({
    email: testEmail,
    displayName: 'Test User',
    resetUrl: 'https://mixexperts.com/reset-password?token=test123',
  });

  // Test booking confirmation
  console.log('4. Testing booking confirmation...');
  await sendBookingConfirmationEmail({
    clientEmail: testEmail,
    clientName: 'Test Client',
    orderNumber: 'ORD-12345',
    engineerName: 'John Mix',
    engineerUsername: 'johnmix',
    serviceName: 'Mixing & Mastering',
    total: 500,
    currency: 'USD',
    turnaroundDays: 7,
    dueDate: 'January 15, 2025',
    orderUrl: 'https://mixexperts.com/orders/123',
  });

  // Add tests for all other templates...

  console.log('All email tests completed! Check your inbox.');
}

testAllEmails();
```

**Run tests:**
```bash
npx tsx src/scripts/test-emails.ts
```

**Testing checklist:**
- [ ] Welcome email renders correctly
- [ ] Verification email links work
- [ ] Password reset links work
- [ ] Booking confirmation shows all details
- [ ] Engineer notification shows payout
- [ ] Order status updates display correctly
- [ ] Delivery notification renders well
- [ ] Review request is compelling
- [ ] Subscription emails show correct pricing
- [ ] Payment failed email has clear action
- [ ] Inquiry notifications include full message
- [ ] Product purchase has download link
- [ ] All CTAs link to correct pages
- [ ] Unsubscribe links work
- [ ] Mobile rendering looks good
- [ ] Dark mode displays correctly

---

## Stage 11.26: Verify Emails Don't Go to Spam

**Goal:** Ensure high deliverability and avoid spam folders.

### DNS Configuration Checklist:

**SPF Record:**
```
v=spf1 include:_spf.resend.com ~all
```

**DKIM Record:**
Add the CNAME records provided by Resend:
```
resend._domainkey.mixexperts.com → resend._domainkey.resend.com
```

**DMARC Record:**
```
v=DMARC1; p=quarantine; rua=mailto:dmarc@mixexperts.com; pct=100; adkim=s; aspf=s
```

### Content Best Practices:

**Spam Score Testing:**
- [ ] Test emails with [Mail-Tester.com](https://www.mail-tester.com)
- [ ] Achieve 10/10 spam score
- [ ] Fix any reported issues

**Content Guidelines:**
- [ ] Avoid spam trigger words (FREE, URGENT, ACT NOW)
- [ ] Use proper text-to-image ratio (60/40)
- [ ] Include plain text alternative
- [ ] Add physical mailing address in footer
- [ ] Include clear unsubscribe link
- [ ] Use consistent "From" name and email
- [ ] Avoid excessive punctuation (!!!, ???)
- [ ] Don't use all caps in subject lines
- [ ] Keep subject lines under 50 characters

**Authentication:**
- [ ] SPF record verified
- [ ] DKIM signatures passing
- [ ] DMARC policy set
- [ ] Custom domain verified in Resend
- [ ] "From" address matches verified domain

**Engagement Tracking:**
- [ ] Monitor open rates (target: >20%)
- [ ] Monitor click rates (target: >2%)
- [ ] Monitor bounce rates (keep <2%)
- [ ] Monitor complaint rates (keep <0.1%)
- [ ] Remove unengaged subscribers after 6 months

**Send Reputation:**
- [ ] Start with low volume, gradually increase
- [ ] Don't send to purchased lists
- [ ] Remove bounced emails immediately
- [ ] Honor unsubscribe requests instantly
- [ ] Monitor sender reputation with Google Postmaster
- [ ] Check blacklist status regularly

**Testing Deliverability:**
- [ ] Send test to Gmail
- [ ] Send test to Outlook
- [ ] Send test to Yahoo
- [ ] Send test to ProtonMail
- [ ] Check spam folder placement
- [ ] Verify links aren't flagged
- [ ] Test on mobile email clients

**Resend Dashboard Monitoring:**
- [ ] Set up delivery monitoring
- [ ] Review bounce reports weekly
- [ ] Check complaint rates
- [ ] Monitor sending volume
- [ ] Review API error logs

---

## Completion Checklist

### Setup & Configuration
- [ ] Resend account created and verified
- [ ] DNS records configured (SPF, DKIM, DMARC)
- [ ] API keys added to environment variables
- [ ] Resend package installed
- [ ] Email utility functions created

### Email Templates
- [ ] Base template with branding
- [ ] Welcome email
- [ ] Email verification
- [ ] Password reset
- [ ] Booking confirmation (client)
- [ ] New booking notification (engineer)
- [ ] Order status updates
- [ ] Delivery notification
- [ ] Review request
- [ ] Subscription confirmation
- [ ] Subscription renewal reminder
- [ ] Payment failed
- [ ] New inquiry notification
- [ ] Inquiry reply notification
- [ ] Product purchase confirmation
- [ ] Download link email

### User Preferences & Management
- [ ] Email preferences page
- [ ] Preferences database table
- [ ] Unsubscribe page
- [ ] Unsubscribe API endpoint
- [ ] One-click unsubscribe working

### Deliverability & Tracking
- [ ] Email logs table created
- [ ] Delivery tracking implemented
- [ ] Bounce handling implemented
- [ ] Complaint handling implemented
- [ ] Suppression list working
- [ ] Resend webhook endpoint created

### Integration
- [ ] Emails integrated with Stripe webhooks
- [ ] Emails integrated with order workflow
- [ ] Emails integrated with subscription flow
- [ ] Emails integrated with inquiry system
- [ ] Emails integrated with product purchases

### Testing & Quality
- [ ] All templates tested and rendering correctly
- [ ] Mobile responsive design verified
- [ ] Links and CTAs working
- [ ] Spam score 10/10
- [ ] Deliverability verified across email clients
- [ ] No emails going to spam
- [ ] Unsubscribe flow tested
- [ ] Preference management tested

---

## Success Metrics

**Track these metrics to measure email system success:**

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Delivery Rate | >99% | <97% requires action |
| Open Rate | >25% | <15% requires optimization |
| Click Rate | >3% | <1% requires review |
| Bounce Rate | <2% | >5% is critical |
| Complaint Rate | <0.1% | >0.5% is critical |
| Unsubscribe Rate | <0.5% | >2% requires review |

---

## Troubleshooting

### Emails not sending:
1. Verify RESEND_API_KEY is set correctly
2. Check Resend API status
3. Review error logs in Resend dashboard
4. Verify domain is verified in Resend

### Emails going to spam:
1. Run mail-tester.com test
2. Verify SPF/DKIM/DMARC records
3. Review content for spam triggers
4. Check sender reputation
5. Warm up domain with gradual sending

### Low open rates:
1. Improve subject lines
2. Send at optimal times
3. Segment your audience
4. Clean inactive subscribers
5. Test different preview text

### High bounce rate:
1. Validate email addresses before sending
2. Remove hard bounces immediately
3. Implement double opt-in
4. Clean email list regularly

---

**Phase 11 Complete!** 🎉

Your email notification system is now fully operational with Resend, providing professional, timely communications to users while maintaining excellent deliverability and sender reputation.
