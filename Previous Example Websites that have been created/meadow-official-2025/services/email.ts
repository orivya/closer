import { supabase } from "../src/integrations/supabase/client";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  type?: 'welcome' | 'reminder' | 'digest' | 'capsule' | 'custom';
}

export const sendEmail = async ({ to, subject, html, type = 'custom' }: SendEmailParams) => {
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: { to, subject, html, type }
  });

  if (error) {
    console.error('Failed to send email:', error);
    throw error;
  }

  return data;
};

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Welcome to Meadow 🌿",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #2d3748; font-size: 28px; margin-bottom: 24px;">Welcome to Meadow, ${name}!</h1>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
          We're so glad you're here. Meadow is your personal space for reflection, growth, and self-discovery.
        </p>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Start your journey by writing your first journal entry. There's no right or wrong way to begin—just let your thoughts flow.
        </p>
        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #48bb78, #38a169); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Start Writing
        </a>
        <p style="color: #718096; font-size: 14px; margin-top: 32px;">
          With warmth,<br>The Meadow Team
        </p>
      </div>
    `
  }),

  dailyReminder: (name: string) => ({
    subject: "Your daily reflection awaits 🌱",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 24px;">Hi ${name},</h1>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Take a moment to reflect on your day. What's on your mind?
        </p>
        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #48bb78, #38a169); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Open Meadow
        </a>
      </div>
    `
  }),

  weeklyDigest: (name: string, stats: { entries: number; streak: number; topMood: string }) => ({
    subject: "Your weekly reflection summary 📊",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 24px;">Weekly Summary for ${name}</h1>
        <div style="background: #f7fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <div style="text-align: center;">
              <p style="color: #48bb78; font-size: 32px; font-weight: bold; margin: 0;">${stats.entries}</p>
              <p style="color: #718096; font-size: 14px; margin: 0;">Entries</p>
            </div>
            <div style="text-align: center;">
              <p style="color: #48bb78; font-size: 32px; font-weight: bold; margin: 0;">${stats.streak}</p>
              <p style="color: #718096; font-size: 14px; margin: 0;">Day Streak</p>
            </div>
            <div style="text-align: center;">
              <p style="color: #48bb78; font-size: 32px; font-weight: bold; margin: 0;">${stats.topMood}</p>
              <p style="color: #718096; font-size: 14px; margin: 0;">Top Mood</p>
            </div>
          </div>
        </div>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Keep up the great work! Consistency is key to meaningful self-reflection.
        </p>
      </div>
    `
  }),

  timeCapsuleUnlocked: (name: string, capsuleTitle: string) => ({
    subject: "🎁 A time capsule from your past self",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 24px;">Hi ${name},</h1>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
          A message from your past self is ready to be opened!
        </p>
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <p style="color: white; font-size: 18px; font-weight: 600; margin: 0;">
            "${capsuleTitle}"
          </p>
        </div>
        <a href="#" style="display: inline-block; background: linear-gradient(135deg, #48bb78, #38a169); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Open Time Capsule
        </a>
      </div>
    `
  })
};

// Helper function to send welcome email
export const sendWelcomeEmail = async (email: string, name: string) => {
  const template = emailTemplates.welcome(name);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    type: 'welcome'
  });
};

// Helper function to send daily reminder
export const sendDailyReminder = async (email: string, name: string) => {
  const template = emailTemplates.dailyReminder(name);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    type: 'reminder'
  });
};

// Helper function to send weekly digest
export const sendWeeklyDigest = async (
  email: string, 
  name: string, 
  stats: { entries: number; streak: number; topMood: string }
) => {
  const template = emailTemplates.weeklyDigest(name, stats);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    type: 'digest'
  });
};

// Helper function to send time capsule notification
export const sendTimeCapsuleNotification = async (email: string, name: string, capsuleTitle: string) => {
  const template = emailTemplates.timeCapsuleUnlocked(name, capsuleTitle);
  return sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
    type: 'capsule'
  });
};
