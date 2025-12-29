import { getEmailTemplate } from './base';
import { sendEmail } from '../email';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mixexperts.com';
const supportEmail = process.env.RESEND_SUPPORT_EMAIL || 'support@mixexperts.com';

// Welcome Email
export async function sendWelcomeEmail(data: {
  email: string;
  displayName: string;
  username: string;
  role: 'engineer' | 'artist';
}) {
  const { email, displayName, username, role } = data;
  const dashboardUrl = `${siteUrl}/dashboard`;
  const isEngineer = role === 'engineer';

  const body = `
    <p>Welcome to MixExperts, ${displayName}!</p>

    ${isEngineer ? `
      <p>You're now part of the premier platform connecting top audio engineers with artists worldwide.</p>

      <p><strong>Next steps to get started:</strong></p>
      <ul>
        <li>Complete your profile and add a professional photo</li>
        <li>Upload portfolio items showcasing your best work</li>
        <li>Create your first service offering</li>
        <li>Connect your Stripe account to start receiving payments</li>
        <li>Publish your profile to go live</li>
      </ul>
    ` : `
      <p>You're now part of the MixExperts community! Find and work with the world's top audio engineers.</p>

      <p><strong>What you can do now:</strong></p>
      <ul>
        <li>Browse engineer profiles and portfolios</li>
        <li>Listen to before/after samples</li>
        <li>Book mixing, mastering, and production services</li>
        <li>Purchase digital products and presets</li>
      </ul>
    `}

    <p>Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
  `;

  const html = getEmailTemplate({
    previewText: `Welcome to MixExperts, ${displayName}!`,
    heading: 'Welcome to MixExperts!',
    body,
    ctaText: 'Go to Dashboard',
    ctaUrl: dashboardUrl,
  });

  return sendEmail({
    to: email,
    subject: 'Welcome to MixExperts!',
    html,
    tags: [{ name: 'category', value: 'welcome' }],
  });
}

// Booking Confirmation (for client)
export async function sendBookingConfirmationEmail(data: {
  clientEmail: string;
  clientName: string;
  orderNumber: string;
  serviceName: string;
  engineerName: string;
  totalAmount: number;
  turnaroundDays: number;
}) {
  const { clientEmail, clientName, orderNumber, serviceName, engineerName, totalAmount, turnaroundDays } = data;

  const body = `
    <p>Hi ${clientName},</p>

    <p>Your booking has been confirmed! Here are the details:</p>

    <div style="background-color: #27272a; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0;"><strong>Order #:</strong> ${orderNumber}</p>
      <p style="margin: 0 0 8px 0;"><strong>Service:</strong> ${serviceName}</p>
      <p style="margin: 0 0 8px 0;"><strong>Engineer:</strong> ${engineerName}</p>
      <p style="margin: 0 0 8px 0;"><strong>Total:</strong> $${totalAmount.toFixed(2)}</p>
      <p style="margin: 0;"><strong>Estimated Delivery:</strong> ${turnaroundDays} business days</p>
    </div>

    <p>You can track your order status anytime from your dashboard.</p>

    <p>Questions? Reply to this email or contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
  `;

  const html = getEmailTemplate({
    previewText: `Booking confirmed - Order #${orderNumber}`,
    heading: 'Booking Confirmed!',
    body,
    ctaText: 'View Order',
    ctaUrl: `${siteUrl}/dashboard/client/orders`,
  });

  return sendEmail({
    to: clientEmail,
    subject: `Booking Confirmed - Order #${orderNumber}`,
    html,
    tags: [{ name: 'category', value: 'booking' }],
  });
}

// New Order Notification (for engineer)
export async function sendNewOrderEmail(data: {
  engineerEmail: string;
  engineerName: string;
  orderNumber: string;
  serviceName: string;
  clientName: string;
  totalAmount: number;
  projectDetails?: string;
}) {
  const { engineerEmail, engineerName, orderNumber, serviceName, clientName, totalAmount, projectDetails } = data;

  const body = `
    <p>Hi ${engineerName},</p>

    <p>Great news! You have a new booking:</p>

    <div style="background-color: #27272a; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0;"><strong>Order #:</strong> ${orderNumber}</p>
      <p style="margin: 0 0 8px 0;"><strong>Service:</strong> ${serviceName}</p>
      <p style="margin: 0 0 8px 0;"><strong>Client:</strong> ${clientName}</p>
      <p style="margin: 0;"><strong>Amount:</strong> $${totalAmount.toFixed(2)}</p>
    </div>

    ${projectDetails ? `<p><strong>Project Details:</strong><br/>${projectDetails}</p>` : ''}

    <p>Log in to your dashboard to view the full order and start working on this project.</p>
  `;

  const html = getEmailTemplate({
    previewText: `New booking from ${clientName} - Order #${orderNumber}`,
    heading: 'New Booking Received!',
    body,
    ctaText: 'View Order',
    ctaUrl: `${siteUrl}/dashboard/projects`,
  });

  return sendEmail({
    to: engineerEmail,
    subject: `New Booking - Order #${orderNumber}`,
    html,
    tags: [{ name: 'category', value: 'order' }],
  });
}

// New Inquiry Notification
export async function sendNewInquiryEmail(data: {
  engineerEmail: string;
  engineerName: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}) {
  const { engineerEmail, engineerName, senderName, senderEmail, subject, message } = data;

  const body = `
    <p>Hi ${engineerName},</p>

    <p>You have a new inquiry:</p>

    <div style="background-color: #27272a; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0;"><strong>From:</strong> ${senderName} (${senderEmail})</p>
      <p style="margin: 0 0 8px 0;"><strong>Subject:</strong> ${subject}</p>
      <p style="margin: 0;"><strong>Message:</strong></p>
      <p style="margin: 8px 0 0 0; white-space: pre-wrap;">${message}</p>
    </div>

    <p>Reply quickly to convert more inquiries into bookings!</p>
  `;

  const html = getEmailTemplate({
    previewText: `New inquiry from ${senderName}`,
    heading: 'New Inquiry Received!',
    body,
    ctaText: 'View in Inbox',
    ctaUrl: `${siteUrl}/dashboard/inbox`,
  });

  return sendEmail({
    to: engineerEmail,
    subject: `New Inquiry: ${subject}`,
    html,
    replyTo: senderEmail,
    tags: [{ name: 'category', value: 'inquiry' }],
  });
}

// Product Purchase Confirmation (for buyer)
export async function sendProductPurchaseEmail(data: {
  buyerEmail: string;
  buyerName: string;
  productName: string;
  amount: number;
  downloadUrl: string;
}) {
  const { buyerEmail, buyerName, productName, amount, downloadUrl } = data;

  const body = `
    <p>Hi ${buyerName || 'there'},</p>

    <p>Thank you for your purchase! Your digital product is ready for download.</p>

    <div style="background-color: #27272a; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0;"><strong>Product:</strong> ${productName}</p>
      <p style="margin: 0;"><strong>Amount:</strong> $${amount.toFixed(2)}</p>
    </div>

    <p>Click the button below to download your files. Your download link will remain active for 7 days.</p>
  `;

  const html = getEmailTemplate({
    previewText: `Your download is ready - ${productName}`,
    heading: 'Your Download is Ready!',
    body,
    ctaText: 'Download Now',
    ctaUrl: downloadUrl,
  });

  return sendEmail({
    to: buyerEmail,
    subject: `Your Download: ${productName}`,
    html,
    tags: [{ name: 'category', value: 'product' }],
  });
}

// Product Sale Notification (for seller)
export async function sendProductSaleEmail(data: {
  sellerEmail: string;
  sellerName: string;
  productName: string;
  buyerEmail: string;
  amount: number;
}) {
  const { sellerEmail, sellerName, productName, buyerEmail, amount } = data;

  const body = `
    <p>Hi ${sellerName},</p>

    <p>You made a sale!</p>

    <div style="background-color: #27272a; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0;"><strong>Product:</strong> ${productName}</p>
      <p style="margin: 0 0 8px 0;"><strong>Buyer:</strong> ${buyerEmail}</p>
      <p style="margin: 0;"><strong>Amount:</strong> $${amount.toFixed(2)}</p>
    </div>

    <p>The funds will be transferred to your connected Stripe account.</p>
  `;

  const html = getEmailTemplate({
    previewText: `You sold ${productName} for $${amount.toFixed(2)}`,
    heading: 'You Made a Sale!',
    body,
    ctaText: 'View Sales',
    ctaUrl: `${siteUrl}/dashboard/sales`,
  });

  return sendEmail({
    to: sellerEmail,
    subject: `Sale: ${productName} - $${amount.toFixed(2)}`,
    html,
    tags: [{ name: 'category', value: 'sale' }],
  });
}

// Order Delivered Notification
export async function sendOrderDeliveredEmail(data: {
  clientEmail: string;
  clientName: string;
  orderNumber: string;
  serviceName: string;
  engineerName: string;
}) {
  const { clientEmail, clientName, orderNumber, serviceName, engineerName } = data;

  const body = `
    <p>Hi ${clientName},</p>

    <p>Great news! ${engineerName} has delivered your order.</p>

    <div style="background-color: #27272a; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0;"><strong>Order #:</strong> ${orderNumber}</p>
      <p style="margin: 0;"><strong>Service:</strong> ${serviceName}</p>
    </div>

    <p>Log in to download your files and leave a review if you're happy with the work!</p>
  `;

  const html = getEmailTemplate({
    previewText: `Your order #${orderNumber} has been delivered`,
    heading: 'Your Order is Ready!',
    body,
    ctaText: 'Download Files',
    ctaUrl: `${siteUrl}/dashboard/client/orders`,
  });

  return sendEmail({
    to: clientEmail,
    subject: `Order Delivered - #${orderNumber}`,
    html,
    tags: [{ name: 'category', value: 'delivery' }],
  });
}

// Password Reset Email
export async function sendPasswordResetEmail(data: {
  email: string;
  displayName: string;
  resetUrl: string;
}) {
  const { email, displayName, resetUrl } = data;

  const body = `
    <p>Hi ${displayName || 'there'},</p>

    <p>We received a request to reset your password. Click the button below to create a new password:</p>

    <p>This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>

    <p>For security, we recommend:</p>
    <ul>
      <li>Using a strong, unique password</li>
      <li>Never sharing your password with anyone</li>
      <li>Enabling two-factor authentication if available</li>
    </ul>
  `;

  const html = getEmailTemplate({
    previewText: 'Reset your MixExperts password',
    heading: 'Reset Your Password',
    body,
    ctaText: 'Reset Password',
    ctaUrl: resetUrl,
  });

  return sendEmail({
    to: email,
    subject: 'Reset Your Password - MixExperts',
    html,
    tags: [{ name: 'category', value: 'auth' }],
  });
}

// Subscription Confirmation
export async function sendSubscriptionConfirmationEmail(data: {
  email: string;
  displayName: string;
  tier: 'pro' | 'enterprise';
  billingPeriod: 'monthly' | 'yearly';
  amount: number;
}) {
  const { email, displayName, tier, billingPeriod, amount } = data;

  const tierName = tier === 'pro' ? 'Pro' : 'Enterprise';
  const periodLabel = billingPeriod === 'monthly' ? 'month' : 'year';

  const body = `
    <p>Hi ${displayName},</p>

    <p>Welcome to MixExperts ${tierName}!</p>

    <div style="background-color: #27272a; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0;"><strong>Plan:</strong> ${tierName}</p>
      <p style="margin: 0 0 8px 0;"><strong>Billing:</strong> $${amount.toFixed(2)}/${periodLabel}</p>
      <p style="margin: 0;"><strong>Platform Fee:</strong> 0% (you keep 100% of earnings!)</p>
    </div>

    <p><strong>What's included:</strong></p>
    <ul>
      <li>Zero platform fees on all bookings</li>
      <li>Priority support</li>
      <li>Advanced analytics</li>
      ${tier === 'enterprise' ? '<li>Team accounts</li><li>API access</li>' : ''}
    </ul>

    <p>Thank you for upgrading!</p>
  `;

  const html = getEmailTemplate({
    previewText: `Welcome to MixExperts ${tierName}!`,
    heading: `Welcome to ${tierName}!`,
    body,
    ctaText: 'Go to Dashboard',
    ctaUrl: `${siteUrl}/dashboard`,
  });

  return sendEmail({
    to: email,
    subject: `Welcome to MixExperts ${tierName}!`,
    html,
    tags: [{ name: 'category', value: 'subscription' }],
  });
}
