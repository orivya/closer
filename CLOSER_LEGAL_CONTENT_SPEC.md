# CLOSER — Legal, Content & Production Requirements
## Complete Specification for Full Functionality

---

# Table of Contents

1. [Legal Pages](#legal-pages)
2. [Email Templates](#email-templates)
3. [Push Notification Copy](#push-notification-copy)
4. [Error Messages & Microcopy](#error-messages--microcopy)
5. [Onboarding Content](#onboarding-content)
6. [Empty States Content](#empty-states-content)
7. [Tooltip & Help Content](#tooltip--help-content)
8. [Achievement Descriptions](#achievement-descriptions)
9. [Question Bank Content](#question-bank-content)
10. [SEO & Meta Content](#seo--meta-content)
11. [App Store Content](#app-store-content)
12. [Customer Support Content](#customer-support-content)
13. [Analytics Events](#analytics-events)
14. [Accessibility Requirements](#accessibility-requirements)
15. [Internationalization Considerations](#internationalization-considerations)

---

# 1. Legal Pages

## 1.1 Terms of Service (`/us/terms`)

### Page Design
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back                     Terms of Service                           │
│                                                                         │
│  Last updated: [Date]                                                  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  Table of Contents                                                │ │
│  │  ─────────────────                                                │ │
│  │  1. Acceptance of Terms                                           │ │
│  │  2. Description of Service                                        │ │
│  │  3. User Accounts                                                 │ │
│  │  4. User Conduct                                                  │ │
│  │  5. Privacy                                                       │ │
│  │  6. Intellectual Property                                         │ │
│  │  7. Subscriptions & Payments                                      │ │
│  │  8. Termination                                                   │ │
│  │  9. Disclaimers                                                   │ │
│  │  10. Limitation of Liability                                      │ │
│  │  11. Dispute Resolution                                           │ │
│  │  12. Changes to Terms                                             │ │
│  │  13. Contact Information                                          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  [Scrollable legal content below...]                                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Required Sections (Summary)

**1. Acceptance of Terms**
- By using Closer, users agree to these terms
- Must be 18+ or age of majority in jurisdiction
- Agreement to Privacy Policy

**2. Description of Service**
- Closer is a couples connection platform
- Digital-only service
- Features may change over time

**3. User Accounts**
- Accurate information required
- One account per person
- Account security responsibility
- Right to suspend/terminate accounts

**4. User Conduct**
- No harassment, abuse, or harmful content
- No impersonation
- No commercial use without permission
- No automated access/scraping
- Content you share must be yours or licensed

**5. Privacy**
- Reference to Privacy Policy
- How we handle data between couples
- Partner data visibility

**6. Intellectual Property**
- Closer owns the platform, design, features
- User retains ownership of their content
- License granted to Closer to display user content
- Users cannot copy/reproduce Closer

**7. Subscriptions & Payments**
- Subscription tiers and pricing
- Billing cycles (monthly/annual)
- Auto-renewal disclosure
- Cancellation policy
- Refund policy (typically prorated or none)
- Price change notification (30 days)

**8. Termination**
- User can delete account anytime
- Closer can terminate for violations
- What happens to data on termination
- Effect on paid subscriptions

**9. Disclaimers**
- Service provided "as is"
- No guarantee of availability
- Not responsible for relationship outcomes
- Technical issues may occur

**10. Limitation of Liability**
- Maximum liability capped at fees paid
- No liability for indirect/consequential damages
- Force majeure clause

**11. Dispute Resolution**
- Governing law (specify state/country)
- Arbitration clause (if applicable)
- Class action waiver (if applicable)
- Small claims exception

**12. Changes to Terms**
- Right to modify terms
- Notification method (email, in-app)
- Continued use = acceptance

**13. Contact Information**
- Legal contact email
- Company address
- How to send legal notices

---

## 1.2 Privacy Policy (`/us/privacy-policy`)

### Required Sections

**1. Information We Collect**

*Information You Provide:*
- Account info (email, name, photo)
- Profile info (timezone, anniversary date)
- Content (messages, photos, answers, moments)
- Payment info (processed by Stripe, we don't store card numbers)
- Communications with support

*Information Collected Automatically:*
- Device info (type, OS, browser)
- Usage data (features used, time spent)
- Log data (IP address, timestamps)
- Cookies and similar technologies

*Information from Partners:*
- Partner's shared content visible to you
- Mutual game answers
- Shared moments

**2. How We Use Information**

- Provide and improve the service
- Personalize experience
- Process payments
- Send notifications and updates
- Analyze usage patterns
- Prevent fraud and abuse
- Comply with legal obligations

**3. Information Sharing**

*With Your Partner:*
- Messages, photos, moments you share
- Game answers (when both submit)
- Online/offline status (unless disabled)
- Typing indicators (unless disabled)

*With Service Providers:*
- Supabase (database, authentication)
- Stripe (payments)
- Vercel (hosting)
- Analytics providers (anonymized)

*Legal Requirements:*
- Court orders, subpoenas
- Protect rights and safety
- Enforce terms

**4. Data Retention**

- Active accounts: Data retained while active
- Deleted accounts: Data deleted within 30 days
- Backups: Removed within 90 days
- Legal holds may extend retention

**5. Your Rights**

*Access:* Request copy of your data
*Correction:* Update inaccurate information
*Deletion:* Delete your account and data
*Portability:* Export your data
*Opt-out:* Unsubscribe from marketing emails

**6. Data Security**

- Encryption in transit (TLS 1.3)
- Encryption at rest
- Access controls
- Regular security audits
- Incident response procedures

**7. Children's Privacy**

- Service not intended for under 18
- Do not knowingly collect data from minors
- Will delete if discovered

**8. International Transfers**

- Data may be processed in US
- Standard contractual clauses (if EU users)
- Privacy Shield (if applicable)

**9. Cookies Policy**

*Essential Cookies:*
- Authentication
- Security
- Preferences

*Analytics Cookies:*
- Usage patterns
- Performance monitoring

*How to Manage:*
- Browser settings
- Our cookie preferences (if implemented)

**10. California Privacy Rights (CCPA)**

- Right to know
- Right to delete
- Right to opt-out of sale (we don't sell data)
- Non-discrimination

**11. European Privacy Rights (GDPR)**

- Lawful basis for processing
- Data protection officer (if applicable)
- Supervisory authority complaints
- Cross-border transfers

**12. Changes to Privacy Policy**

- Notification of material changes
- Date of last update
- Review recommended periodically

**13. Contact**

- Privacy contact email: privacy@closer.app
- Data protection inquiries
- Complaint procedures

---

## 1.3 Cookie Policy (`/us/cookies`)

### Content Structure

**What Are Cookies**
- Small text files stored on device
- Help website function and remember preferences

**Cookies We Use**

| Cookie Name | Purpose | Duration | Type |
|-------------|---------|----------|------|
| `closer_session` | Authentication | Session | Essential |
| `closer_preferences` | User settings | 1 year | Essential |
| `closer_analytics` | Usage analytics | 1 year | Analytics |

**Managing Cookies**
- Browser settings instructions
- Impact of disabling cookies

---

## 1.4 Community Guidelines (`/us/guidelines`)

### Content

**Our Values**
- Respect and kindness
- Privacy and trust
- Authentic connection

**Expected Behavior**
- Treat your partner with respect
- Keep shared content appropriate
- Respect privacy settings
- Report concerns promptly

**Prohibited Content**
- Harassment or abuse
- Explicit content involving minors
- Threats or violence
- Spam or commercial solicitation
- Impersonation
- Illegal activity

**Enforcement**
- Warning for first violation
- Temporary suspension for repeated issues
- Permanent ban for severe violations
- Appeal process available

---

## 1.5 Refund Policy (`/us/refunds`)

### Content

**Subscription Refunds**
- Monthly: No refunds for partial months
- Annual: Prorated refund within first 30 days
- After 30 days: No refund, access until end of term

**Virtual Gift Refunds**
- No refunds once gift is sent
- Technical issues: Contact support

**How to Request**
- Email: support@closer.app
- Include: Account email, purchase date, reason

**Processing Time**
- 5-10 business days
- Original payment method

---

## 1.6 Accessibility Statement (`/us/accessibility`)

### Content

**Our Commitment**
- Striving for WCAG 2.1 AA compliance
- Ongoing improvements
- Testing with assistive technologies

**Current Features**
- Keyboard navigation
- Screen reader support
- High contrast mode (future)
- Reduced motion support
- Text scaling support

**Known Limitations**
- Some animations may be challenging
- Working on improvements

**Feedback**
- Report accessibility issues
- Contact: accessibility@closer.app

---

# 2. Email Templates

## 2.1 Transactional Emails

### Welcome Email
```
Subject: Welcome to Closer, [Name] 💜

──────────────────────────────────

Hey [Name],

Welcome to Closer — your digital sanctuary for connection.

You're about to start a journey of deeper connection with
someone special. Here's what's waiting for you:

✨ Daily questions to spark meaningful conversations
💌 Whisper messages for your most intimate thoughts
🎁 Virtual gifts to show you care
📸 Moments to capture your journey together

[Get Started Button]

Need to invite your partner? Share this code: [INVITE_CODE]

With love,
The Closer Team

──────────────────────────────────
```

### Partner Joined Email
```
Subject: [Partner Name] joined Closer! 🎉

──────────────────────────────────

[Name], your person is here!

[Partner Name] just joined Closer and you're now connected.
Your journey together begins now.

[Open Closer Button]

──────────────────────────────────
```

### Password Reset Email
```
Subject: Reset your Closer password

──────────────────────────────────

Hi [Name],

We received a request to reset your password.
Click below to create a new one:

[Reset Password Button]

This link expires in 1 hour.

Didn't request this? You can safely ignore this email.

──────────────────────────────────
```

### Email Verification
```
Subject: Verify your email for Closer

──────────────────────────────────

Hi [Name],

Please verify your email to complete your Closer account:

[Verify Email Button]

This link expires in 24 hours.

──────────────────────────────────
```

### Subscription Confirmation
```
Subject: Welcome to Closer+ 💜

──────────────────────────────────

Hi [Name],

Thank you for upgrading to Closer+!

Your new features are now unlocked:
✨ Unlimited card draws
📚 Complete history access
🎁 20 premium virtual gifts
🎨 Custom themes
🛡️ Streak freeze protection

Billing: $[Amount]/[Period]
Next billing date: [Date]

[Explore New Features Button]

──────────────────────────────────
```

### Subscription Cancellation
```
Subject: Your Closer+ subscription has been cancelled

──────────────────────────────────

Hi [Name],

We're sorry to see you go.

Your Closer+ benefits will remain active until [End Date].
After that, you'll return to our free tier.

Changed your mind? You can resubscribe anytime.

[Resubscribe Button]

We'd love to know why you left:
[Feedback Link]

──────────────────────────────────
```

### Payment Failed
```
Subject: Action needed: Payment failed for Closer+

──────────────────────────────────

Hi [Name],

We couldn't process your payment for Closer+.

Please update your payment method to keep your premium features:

[Update Payment Button]

If not updated by [Date], your subscription will be paused.

Need help? Reply to this email.

──────────────────────────────────
```

### Weekly Summary (Optional)
```
Subject: Your week with [Partner Name] 💜

──────────────────────────────────

Hi [Name],

Here's your weekly connection summary:

📊 This Week Together
───────────────────
🔥 Streak: [X] days
💬 Messages: [X]
❤️ Cards answered: [X]
📸 Moments saved: [X]

💜 Highlight Moment
[Photo or quote from the week]

Keep connecting,
The Closer Team

[Open Closer Button]

──────────────────────────────────
```

### Time Capsule Ready
```
Subject: Your time capsule is ready to open! 🎁

──────────────────────────────────

Hi [Name],

A message from your past has arrived.

The time capsule you sealed on [Seal Date] is now
ready to open together.

[Open Together Button]

──────────────────────────────────
```

### Account Deletion Confirmation
```
Subject: Your Closer account has been deleted

──────────────────────────────────

Hi [Name],

Your Closer account and all associated data have been deleted.

If you ever want to return, we'd love to have you back.

Take care,
The Closer Team

──────────────────────────────────
```

---

## 2.2 Marketing Emails (Opt-in)

### Re-engagement (7 days inactive)
```
Subject: [Partner Name] misses you on Closer

──────────────────────────────────

Hi [Name],

It's been a while since you connected on Closer.

[Partner Name] might be waiting for a message from you.

[Send a Message Button]

──────────────────────────────────
```

### Feature Announcement
```
Subject: New on Closer: [Feature Name]

──────────────────────────────────

Hi [Name],

We've added something new to help you connect:

[Feature description and screenshot]

[Try It Now Button]

──────────────────────────────────
```

---

# 3. Push Notification Copy

## 3.1 Message Notifications

| Trigger | Title | Body |
|---------|-------|------|
| New message | [Partner Name] | [Preview of message...] |
| Whisper message | [Partner Name] sent a whisper | Hold to reveal |
| Voice note | [Partner Name] sent a voice note | [Duration] |
| Photo | [Partner Name] sent a photo | |
| Reaction | [Partner Name] reacted ❤️ | to your message |

## 3.2 Game Notifications

| Trigger | Title | Body |
|---------|-------|------|
| Partner online | [Partner Name] is here | Perfect time to connect |
| Partner answered | [Partner Name] answered | See what they said |
| Partner started game | [Partner Name] wants to play | Join them for [Game Name] |
| Game complete | You both answered! | See the reveal |
| Daily question | Today's question is ready | What will you discover? |

## 3.3 Ritual Notifications

| Trigger | Title | Body |
|---------|-------|------|
| Morning reminder | Good morning 🌅 | Send [Partner Name] some love |
| Gratitude time | Gratitude moment | What are you grateful for today? |
| Goodnight reminder | Goodnight ritual | End the day with [Partner Name] |
| Thinking of you received | [Partner Name] 💭 | is thinking of you |
| Weekly check-in | Weekly check-in time | How was your week together? |

## 3.4 Streak Notifications

| Trigger | Title | Body |
|---------|-------|------|
| Streak at risk (6pm) | Your streak is at risk! 🔥 | Connect today to keep your [X] day streak |
| Streak at risk (9pm) | Last chance! | [X] day streak ends at midnight |
| Streak milestone | [X] day streak! 🔥 | You're on fire! Keep it going |
| Streak lost | Streak ended | Start fresh today |

## 3.5 Gift Notifications

| Trigger | Title | Body |
|---------|-------|------|
| Gift received | [Partner Name] sent you a gift! 🎁 | Tap to unwrap |
| Gift reaction | [Partner Name] loved your gift | ❤️ |

## 3.6 Capsule Notifications

| Trigger | Title | Body |
|---------|-------|------|
| Capsule ready | Time capsule ready! 🎁 | A message from your past |
| Capsule sealed | Time capsule sealed | Opens on [Date] |

## 3.7 Achievement Notifications

| Trigger | Title | Body |
|---------|-------|------|
| Achievement unlocked | Achievement unlocked! 🏆 | [Achievement Name] |

## 3.8 System Notifications

| Trigger | Title | Body |
|---------|-------|------|
| Partner joined | [Partner Name] joined! 🎉 | Start your journey together |
| Subscription expiring | Subscription expiring soon | Renew to keep your features |
| Payment failed | Payment issue | Update your payment method |

---

# 4. Error Messages & Microcopy

## 4.1 Form Validation

| Field | Error | Message |
|-------|-------|---------|
| Email | Empty | Please enter your email |
| Email | Invalid | That doesn't look like a valid email |
| Email | Taken | This email is already registered |
| Password | Too short | Password must be at least 8 characters |
| Password | Too weak | Add numbers or symbols for a stronger password |
| Password | Mismatch | Passwords don't match |
| Name | Empty | What should we call you? |
| Name | Too long | Please use 50 characters or less |
| Invite code | Invalid | That code doesn't seem right |
| Invite code | Expired | This invite has expired |
| Invite code | Used | This code has already been used |
| Date | Invalid | Please enter a valid date |
| Date | Future | Anniversary can't be in the future |
| Message | Too long | Message exceeds 5000 characters |
| Photo | Too large | Photo must be under 10MB |
| Photo | Invalid type | Please use JPG, PNG, or HEIC |

## 4.2 Network & System Errors

| Scenario | Title | Message | Action |
|----------|-------|---------|--------|
| No internet | You're offline | We'll sync when you're back online | Retry |
| Server error | Something went wrong | We're looking into it. Try again in a moment | Retry |
| Session expired | Session expired | Please log in again | Log In |
| Maintenance | Be right back | We're making Closer even better | Check Status |
| Rate limited | Slow down | Too many requests. Try again in a minute | — |
| Unauthorized | Access denied | You don't have permission for this | Go Back |
| Not found | Not found | This page doesn't exist | Go Home |

## 4.3 Feature-Specific Errors

| Feature | Scenario | Message |
|---------|----------|---------|
| Partner | Not linked | You need to connect with your partner first |
| Partner | Partner offline | [Name] is offline. They'll see this when they return |
| Cards | Daily limit | You've used all your draws for today. Upgrade for unlimited |
| Capsule | Cannot edit | Time capsules can't be edited once sealed |
| Capsule | Not ready | This capsule opens on [Date] |
| Gift | Purchase failed | We couldn't process your payment. Please try again |
| Streak | Frozen | Your streak is protected with a freeze |
| Upload | Failed | Upload failed. Please try again |
| Voice | Too long | Voice notes are limited to [X] minutes |

## 4.4 Success Messages (Toasts)

| Action | Message |
|--------|---------|
| Message sent | Sent |
| Photo uploaded | Photo added |
| Moment saved | Saved to Moments |
| Gift sent | Gift sent to [Partner Name] |
| Capsule sealed | Time capsule sealed |
| Settings saved | Saved |
| Profile updated | Profile updated |
| Password changed | Password changed |
| Account linked | You're connected! |
| Subscription started | Welcome to Closer+ |
| Achievement unlocked | Achievement unlocked! |

## 4.5 Confirmation Dialogs

### Delete Account
```
Title: Delete your account?

This will permanently delete:
• All your messages
• All your moments and memories
• Your streak and achievements
• Your subscription (no refund)

This cannot be undone.

[Cancel] [Delete Account]
```

### Unlink Partner
```
Title: Unlink from [Partner Name]?

You'll both lose access to:
• Shared messages
• Shared moments
• Joint memories

You can reconnect later with a new invite code.

[Cancel] [Unlink]
```

### Cancel Subscription
```
Title: Cancel Closer+?

You'll lose access to:
• Unlimited card draws
• Full history
• Premium gifts
• Custom themes

Your benefits continue until [Date].

[Keep Subscription] [Cancel Anyway]
```

### Delete Moment
```
Title: Delete this moment?

This will remove it from both your timelines.

[Cancel] [Delete]
```

### Skip Question
```
Title: Skip this question?

You can always come back to it later.

[Answer Instead] [Skip]
```

---

# 5. Onboarding Content

## 5.1 Welcome Screens (First Launch)

### Screen 1: Welcome
```
Illustration: Two abstract figures reaching toward each other

Title: Welcome to Closer

Subtitle: A digital sanctuary for couples
who want to stay connected — no matter
the distance.

[Get Started]
```

### Screen 2: Daily Connection
```
Illustration: Card being drawn

Title: Daily Questions

Subtitle: Discover something new about each
other every day with meaningful questions
designed to deepen your bond.

[Next]
```

### Screen 3: Moments Together
```
Illustration: Timeline with photos

Title: Capture Your Journey

Subtitle: Save your favorite memories,
conversations, and milestones in a
beautiful shared timeline.

[Next]
```

### Screen 4: Stay Close
```
Illustration: Two phones connected

Title: Stay Close, Even Apart

Subtitle: Whether you're across the room
or across the world, Closer keeps you
connected in the ways that matter.

[Create Account]
```

## 5.2 Profile Setup

### Step 1: Your Profile
```
Title: Let's set up your profile

[Avatar upload area]
Tap to add a photo
(Your partner will see this)

Display name:
[Text input]
What should we call you?

[Continue]
```

### Step 2: Your Timezone
```
Title: Where are you?

This helps us show you and your partner
what time it is for each other.

[Timezone selector]
Detected: [Auto-detected timezone]

[Continue]
```

### Step 3: Connect Partner
```
Title: Connect with your partner

[Two options]

┌─────────────────────────────┐
│  I have an invite code      │
│  [Code input field]         │
└─────────────────────────────┘

┌─────────────────────────────┐
│  I'll invite my partner     │
│  Share this code:           │
│  [XXXX-XXXX]               │
│  [Copy] [Share]             │
└─────────────────────────────┘
```

### Step 4: Your Relationship
```
Title: About your relationship

When did you start dating?
[Date picker]
(We'll celebrate your milestones!)

When will you see each other next?
[Date picker]
(Optional — we'll count down together)

[Finish Setup]
```

### Step 5: Complete
```
Illustration: Celebration confetti

Title: You're all set!

[If partner connected]
"You and [Partner Name] are now connected."

[If partner pending]
"We'll notify you when [Partner Name] joins."

[Start Exploring]
```

---

# 6. Empty States Content

## 6.1 Core Views

### Messages — No Partner
```
Illustration: Two phones

Title: Connect with your partner first

Subtitle: Share your invite code to start messaging.

[Share Invite Code]
```

### Messages — No Messages Yet
```
Illustration: Chat bubbles

Title: Start the conversation

Subtitle: Send [Partner Name] your first message.

[Say Hello]
```

### Moments — Empty
```
Illustration: Photo album

Title: No moments yet

Subtitle: Your shared memories will appear here.
Save photos, quotes, and milestones together.

[Add First Moment]
```

### Connect — Partner Offline
```
Illustration: Moon and stars

Title: [Partner Name] is offline

Subtitle: They'll see your message when they return.

[Send a Message]
```

## 6.2 Game-Specific Empty States

### Intimacy Deck History — Empty
```
Illustration: Card deck

Title: No answers yet

Subtitle: Draw your first card and start
discovering each other.

[Draw a Card]
```

### Hot Takes History — Empty
```
Illustration: Two thumbs

Title: No debates yet

Subtitle: Share your hot takes and see
where you agree (or disagree!).

[Start a Debate]
```

### Time Capsules — None Created
```
Illustration: Sealed envelope

Title: No time capsules yet

Subtitle: Write a message to your future selves.

[Create Capsule]
```

### Time Capsules — None Opened
```
Illustration: Gift box

Title: No opened capsules

Subtitle: Your opened capsules will appear here.
The first one opens on [Date].
```

### Dreams — None Created
```
Illustration: Clouds and stars

Title: No dreams yet

Subtitle: What do you want to build together?

[Create a Dream]
```

### Gifts Received — Empty
```
Illustration: Heart gift

Title: No gifts yet

Subtitle: When [Partner Name] sends you a gift,
it will appear here.
```

### Gifts Sent — Empty
```
Illustration: Gift box flying

Title: No gifts sent yet

Subtitle: Show [Partner Name] you care.

[Browse Gifts]
```

## 6.3 Search Empty States

### No Search Results
```
Illustration: Magnifying glass

Title: No results found

Subtitle: Try different search terms.
```

### No Filtered Results
```
Title: Nothing matches your filters

Subtitle: Try adjusting your filters.

[Clear Filters]
```

---

# 7. Tooltip & Help Content

## 7.1 Feature Tooltips (First Time)

| Feature | Tooltip |
|---------|---------|
| Intimacy Deck | "Tap the deck to draw a question. Answer together to reveal what you both said." |
| Whisper Message | "Whispers are blurred until your partner holds to reveal. Perfect for intimate messages." |
| Together Button | "Play in real-time with [Partner Name]. They'll be notified to join you." |
| I'll Start | "Answer first. [Partner Name] will see their question when they're ready." |
| Streak | "Connect every day to build your streak. Miss a day and it resets to zero." |
| Streak Freeze | "Freeze protects your streak for one day if you can't connect. Closer+ members get one per week." |
| Time Capsule | "Seal a message to open together in the future. It can't be edited once sealed." |
| Thinking of You | "Send a quick heart to let [Partner Name] know they're on your mind." |

## 7.2 Settings Help Text

| Setting | Help Text |
|---------|-----------|
| Online Status | "When off, [Partner Name] won't see when you're active." |
| Typing Indicator | "When off, [Partner Name] won't see when you're typing." |
| Read Receipts | "When off, [Partner Name] won't see when you've read messages." |
| Push Notifications | "Get notified when [Partner Name] messages you or wants to play." |
| Email Notifications | "Receive weekly summaries and important account updates." |
| Quiet Hours | "Pause notifications during these hours in your timezone." |

## 7.3 FAQ Content (`/us/help`)

### Account & Profile

**How do I change my profile photo?**
Go to Us → Edit Profile → Tap your photo to upload a new one.

**How do I change my timezone?**
Go to Us → Edit Profile → Timezone.

**How do I change my password?**
Go to Us → Settings → Change Password.

**How do I delete my account?**
Go to Us → Settings → Delete Account. This is permanent and cannot be undone.

### Connecting with Partner

**How do I invite my partner?**
Share your unique invite code from Us → Partner Settings → Invite Code.

**My partner's code isn't working**
Make sure you're entering it exactly as shown, including any dashes. Codes are case-sensitive.

**How do I unlink from my partner?**
Go to Us → Partner Settings → Unlink Partner. Both accounts will lose access to shared content.

**Can I reconnect after unlinking?**
Yes, generate a new invite code and share it with your partner.

### Features

**What counts toward my streak?**
Any interaction with your partner: sending a message, answering a question, completing a ritual, or sending a gift.

**How do I protect my streak?**
Closer+ members can use one streak freeze per week. Go to Us → Streaks to activate.

**Why can't I see old messages/moments?**
Free accounts can access the last 7 days. Upgrade to Closer+ for unlimited history.

**How do whisper messages work?**
Whispers are blurred until your partner holds to reveal. Once revealed, they stay visible.

### Subscriptions & Payments

**What's included in Closer+?**
Unlimited card draws, full history, 20 premium gifts, custom themes, streak freeze, and more.

**How do I cancel my subscription?**
Go to Us → Subscription → Cancel. Your benefits continue until the end of your billing period.

**Will I get a refund if I cancel?**
Monthly subscriptions are not refunded. Annual subscriptions are prorated within the first 30 days.

**How do I update my payment method?**
Go to Us → Subscription → Payment Method.

### Privacy & Security

**Is my data secure?**
Yes. All data is encrypted in transit and at rest. We never sell your data.

**Can my partner see my account password?**
No. Passwords are never shared or visible to anyone.

**What happens to my data if I delete my account?**
All your data is permanently deleted within 30 days.

---

# 8. Achievement Descriptions

## 8.1 Complete Achievement List

### Conversation Achievements

| Achievement | Description | Unlock Criteria |
|-------------|-------------|-----------------|
| First Words | Sent your first message | 1 message sent |
| Getting Warmer | You're building a connection | 10 messages sent |
| Chatterbox | Conversation comes naturally | 100 messages sent |
| Novel Writer | You've written a novel in messages | 1,000 messages sent |
| Epic Saga | An epic tale of love | 5,000 messages sent |
| Voice of Love | Your voice says it all | 50 voice notes sent |
| Whisper Secret | Shared something intimate | 1 whisper sent |
| Night Owl | Conversations that last all night | 100 messages after midnight |

### Game Achievements

| Achievement | Description | Unlock Criteria |
|-------------|-------------|-----------------|
| First Draw | Drew your first card | 1 card drawn |
| Card Collector | Building your connection | 50 cards answered |
| Deck Master | Explored every category | All categories tried |
| Hot Take Hero | You've got opinions | 25 Hot Takes played |
| Either Way | Choices, choices | 25 Would You Rather played |
| Dream Team | Completed a dream together | 1 dream completed |
| Time Traveler | Messages from the past | 5 time capsules opened |
| Capsule Creator | Planning for the future | 10 time capsules created |
| Perfect Match | Agreed on everything today | 5 matches in one session |

### Ritual Achievements

| Achievement | Description | Unlock Criteria |
|-------------|-------------|-----------------|
| Early Bird | Rise and connect | 7 morning hellos |
| Night Owl | Sweet dreams together | 7 goodnights |
| Grateful Heart | Finding the good | 30 gratitudes shared |
| Always Thinking | Never far from mind | 50 thinking of you taps |
| Weekly Regular | Consistent connection | 10 weekly check-ins |
| Ritual Master | All rituals in one day | All rituals completed |

### Moment Achievements

| Achievement | Description | Unlock Criteria |
|-------------|-------------|-----------------|
| Memory Maker | Capturing the moments | 10 moments saved |
| Archivist | A beautiful history | 100 moments saved |
| Soundtrack | Your love songs | 20 song moments |
| Quotable | Words to remember | 25 quote moments |
| Photographer | Worth a thousand words | 50 photo moments |
| Milestone Master | Celebrating together | 10 milestones |

### Streak Achievements

| Achievement | Description | Unlock Criteria |
|-------------|-------------|-----------------|
| Getting Started | Day one done | 1 day streak |
| Week Strong | A solid week | 7 day streak |
| Two Weeks | Keeping it going | 14 day streak |
| Month of Love | Incredible consistency | 30 day streak |
| Fifty Days | Remarkable dedication | 50 day streak |
| Hundred Days | Legendary commitment | 100 day streak |
| Half Year | Six months strong | 180 day streak |
| Year of Love | An entire year | 365 day streak |

### Gift Achievements

| Achievement | Description | Unlock Criteria |
|-------------|-------------|-----------------|
| First Gift | Showed you care | 1 gift sent |
| Generous Heart | You love to give | 10 gifts sent |
| Gift Collector | Received and cherished | 25 gifts received |
| Season of Giving | Festive spirit | 5 seasonal gifts |

### Special Achievements

| Achievement | Description | Unlock Criteria |
|-------------|-------------|-----------------|
| Day One | The journey begins | Completed onboarding |
| Together | Connected with partner | Partner linked |
| One Month | A month of memories | 30 days since signup |
| Anniversary | Another year together | Anniversary date reached |
| Supporter | Joined Closer+ | Subscribed |
| Explorer | Tried every feature | Used all main features |

---

# 9. Question Bank Content

## 9.1 Sample Questions by Category

### Deep Questions (Sample 20)

1. "What's something you've never told anyone about yourself?"
2. "What does love mean to you now vs. when we first met?"
3. "What's your biggest fear about our future?"
4. "When do you feel most loved by me?"
5. "What's a childhood memory that shaped who you are?"
6. "What do you wish you could change about how we communicate?"
7. "What's the hardest thing you've ever had to forgive?"
8. "When do you feel most vulnerable with me?"
9. "What dream have you given up on, and why?"
10. "What do you need from me that you're afraid to ask for?"
11. "What's something about yourself you're still learning to accept?"
12. "How has our relationship changed you?"
13. "What's the most important lesson love has taught you?"
14. "When did you realize you loved me?"
15. "What's a part of yourself you're afraid to show me?"
16. "What does 'home' feel like to you?"
17. "What's the bravest thing you've ever done for love?"
18. "How do you want to grow in the next year?"
19. "What's something you wish you had told me sooner?"
20. "What would you want me to know if we couldn't talk for a year?"

### Playful Questions (Sample 15)

1. "If we won the lottery, what's the first thing we'd do?"
2. "What's my most annoying habit that you secretly find cute?"
3. "If we could swap lives for a day, what would you do as me?"
4. "What would our couple superhero name be?"
5. "If our relationship was a movie, what genre would it be?"
6. "What song describes us perfectly?"
7. "What would you never admit to finding attractive about me?"
8. "If we had a time machine, what moment would we relive?"
9. "What's the weirdest thing you love about me?"
10. "If we could only eat one meal together forever, what would it be?"
11. "What's your favorite inside joke we have?"
12. "If we were animals, what would we be?"
13. "What would our reality TV show be called?"
14. "What's the most embarrassing thing we've done together?"
15. "If we could live anywhere for a year, where would it be?"

### Future Questions (Sample 10)

1. "Where do you see us in 10 years?"
2. "What tradition do you want us to start?"
3. "What kind of home do you dream of having together?"
4. "What's something new you want us to try together?"
5. "How many kids (if any) do you imagine us having?"
6. "What do you want our life to look like when we're old?"
7. "What's a skill you want to learn together?"
8. "What adventure is on our bucket list?"
9. "How do you want to celebrate our next anniversary?"
10. "What legacy do you want us to leave?"

### Hot Takes Topics (Sample 20)

1. "Pineapple belongs on pizza"
2. "Breakfast for dinner is the superior meal"
3. "Working from home is better than office work"
4. "Dogs are better than cats"
5. "Money can buy happiness"
6. "Social media does more harm than good"
7. "It's okay to lie to protect someone's feelings"
8. "Texting is better than calling"
9. "The book is always better than the movie"
10. "You should always follow your heart over your head"
11. "Being on time is overrated"
12. "Cold weather is better than hot weather"
13. "It's fine to recline your seat on an airplane"
14. "You should shower at night, not in the morning"
15. "Couples should have separate bank accounts"
16. "It's okay to read your partner's messages"
17. "Love at first sight is real"
18. "Living together before marriage is essential"
19. "Matching couple outfits are cute"
20. "Long-distance relationships make you stronger"

### Would You Rather (Sample 15)

1. "Live in a treehouse in the forest OR a houseboat on the ocean"
2. "Know what everyone is thinking OR know the future"
3. "Have unlimited travel OR unlimited free food"
4. "Live without music OR live without movies"
5. "Be famous OR be rich"
6. "Have a rewind button OR a pause button for life"
7. "Always be 10 minutes late OR always be 20 minutes early"
8. "Speak every language OR play every instrument"
9. "Live in the city OR the countryside"
10. "Have more time OR more money"
11. "Be able to fly OR be invisible"
12. "Lose your phone OR lose your wallet"
13. "Never use social media again OR never watch TV again"
14. "Have a personal chef OR a personal driver"
15. "Be stranded on an island with me OR alone with everything you need"

---

# 10. SEO & Meta Content

## 10.1 Page Titles & Descriptions

| Page | Title | Meta Description |
|------|-------|------------------|
| Home | Closer - Stay Connected, Even Apart | Closer is a digital sanctuary for couples. Daily questions, shared moments, and virtual gifts to keep your connection strong no matter the distance. |
| Login | Log In - Closer | Log in to your Closer account and reconnect with your partner. |
| Signup | Create Account - Closer | Join Closer and start building a deeper connection with your partner through daily questions, shared moments, and more. |
| Features | Features - Closer | Discover all the ways Closer helps couples stay connected: intimacy cards, time capsules, virtual gifts, and daily rituals. |
| Pricing | Pricing - Closer | Explore Closer's free and premium plans. Start free, upgrade for unlimited features, custom themes, and more. |
| About | About - Closer | Learn about Closer's mission to help couples maintain deep, meaningful connections regardless of distance. |
| Terms | Terms of Service - Closer | Read Closer's terms of service, user agreements, and policies. |
| Privacy | Privacy Policy - Closer | Learn how Closer protects your privacy and handles your personal data. |
| Help | Help Center - Closer | Find answers to common questions about using Closer, managing your account, and troubleshooting issues. |

## 10.2 Open Graph Tags

```html
<!-- Default -->
<meta property="og:title" content="Closer - Stay Connected, Even Apart">
<meta property="og:description" content="A digital sanctuary for couples. Daily questions, shared moments, and virtual gifts.">
<meta property="og:image" content="https://closer.app/og-image.jpg">
<meta property="og:url" content="https://closer.app">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Closer">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@closerapp">
<meta name="twitter:title" content="Closer - Stay Connected, Even Apart">
<meta name="twitter:description" content="A digital sanctuary for couples.">
<meta name="twitter:image" content="https://closer.app/twitter-image.jpg">
```

## 10.3 Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Closer",
  "description": "A digital sanctuary for couples to stay connected through daily questions, shared moments, and virtual gifts.",
  "url": "https://closer.app",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web, iOS, Android",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1200"
  }
}
```

---

# 11. App Store Content

## 11.1 iOS App Store

### App Name
Closer - Couples Connection

### Subtitle (30 chars)
Stay connected, even apart

### Promotional Text (170 chars)
NEW: Time Capsules! Seal messages to open together in the future. Plus improved voice notes and 10 new virtual gifts.

### Description
Closer is a digital sanctuary for couples who want to stay connected — no matter the distance.

**Daily Connection Made Easy**
Draw from our Intimacy Deck to discover meaningful questions that spark real conversations. Answer together and see what you both said.

**Capture Your Journey**
Save your favorite messages, photos, and milestones in a beautiful shared timeline called Moments.

**Stay Close Through Rituals**
Morning hellos, gratitude moments, and goodnight messages create touchpoints throughout your day.

**Play Together**
Hot Takes, Would You Rather, and other games help you learn about each other in fun ways.

**Send Virtual Gifts**
Beautiful animated gifts show you care, from a simple heart to a stunning Northern Lights display.

**Build Your Future**
Create shared dreams with milestones, seal time capsules for the future, and celebrate your journey together.

**Premium Features (Closer+)**
• Unlimited daily draws
• Complete history access
• 20+ premium virtual gifts
• Custom themes
• Streak freeze protection

Download now and start growing closer.

### Keywords (100 chars)
long distance relationship,couples app,ldr,relationship,connection,intimacy,couple games,love

### What's New
Version 1.2:
• Time Capsules - seal messages to open together later
• 10 new animated virtual gifts
• Improved voice note recording
• Bug fixes and performance improvements

### Privacy Policy URL
https://closer.app/privacy

### Support URL
https://closer.app/help

## 11.2 Google Play Store

### App Title (30 chars)
Closer - Couples Connection

### Short Description (80 chars)
A digital sanctuary for couples. Daily questions, moments & virtual gifts.

### Full Description
[Same as iOS with minor formatting adjustments]

### Feature Graphic
1024x500px branded image

---

# 12. Customer Support Content

## 12.1 Support Categories

1. **Account Issues**
   - Login problems
   - Password reset
   - Email verification
   - Account deletion

2. **Partner Connection**
   - Invite code issues
   - Linking problems
   - Unlinking questions

3. **Subscriptions**
   - Billing questions
   - Cancel subscription
   - Refund requests
   - Payment issues

4. **Features**
   - How to use features
   - Feature not working
   - Feature requests

5. **Technical**
   - App crashes
   - Notifications not working
   - Sync issues
   - Performance problems

6. **Privacy**
   - Data requests
   - Privacy concerns
   - Security questions

## 12.2 Canned Responses

### Account Locked
```
Hi [Name],

I see your account has been temporarily locked due to
too many login attempts.

To unlock your account:
1. Wait 30 minutes
2. Use "Forgot Password" to reset
3. Try logging in with your new password

If you still can't access your account, let me know
and I'll help you further.

Best,
[Agent Name]
Closer Support
```

### Refund Request - Approved
```
Hi [Name],

I've processed your refund for $[Amount]. You should
see it in your account within 5-10 business days.

Your Closer+ access will continue until [Date], and
then you'll return to our free tier.

Is there anything else I can help with?

Best,
[Agent Name]
Closer Support
```

### Feature Not Available
```
Hi [Name],

Thanks for reaching out about [Feature].

This feature is currently available for Closer+ members.
If you'd like to try it, you can upgrade from:
Us → Subscription

We also offer a 7-day free trial if you haven't tried
Closer+ before.

Let me know if you have any other questions!

Best,
[Agent Name]
Closer Support
```

### Bug Report Acknowledgment
```
Hi [Name],

Thanks for reporting this issue. I've logged it with
our development team.

Details logged:
- Issue: [Description]
- Device: [Device]
- Version: [App Version]

We're working to fix this in an upcoming update. I'll
let you know when it's resolved.

Best,
[Agent Name]
Closer Support
```

---

# 13. Analytics Events

## 13.1 Core Events to Track

### Authentication
| Event | Properties |
|-------|------------|
| `signup_started` | source, referrer |
| `signup_completed` | method (email, google, apple) |
| `login` | method |
| `logout` | — |
| `password_reset_requested` | — |
| `password_reset_completed` | — |

### Onboarding
| Event | Properties |
|-------|------------|
| `onboarding_started` | — |
| `onboarding_step_completed` | step_name, step_number |
| `onboarding_completed` | time_to_complete |
| `partner_invite_sent` | method (copy, share) |
| `partner_connected` | time_since_signup |

### Engagement
| Event | Properties |
|-------|------------|
| `session_started` | — |
| `session_ended` | duration, actions_taken |
| `feature_used` | feature_name |
| `card_drawn` | category |
| `card_answered` | category, mode (together, solo) |
| `message_sent` | type (text, whisper, voice, photo) |
| `moment_saved` | type |
| `gift_sent` | gift_id, price |
| `ritual_completed` | ritual_type |
| `streak_milestone` | days |

### Monetization
| Event | Properties |
|-------|------------|
| `paywall_viewed` | trigger, feature |
| `subscription_started` | tier, period, price |
| `subscription_cancelled` | reason, days_active |
| `subscription_renewed` | tier |
| `purchase_completed` | item_type, item_id, price |
| `purchase_failed` | error_type |

### Retention
| Event | Properties |
|-------|------------|
| `notification_received` | type |
| `notification_opened` | type |
| `streak_at_risk` | current_streak |
| `streak_lost` | previous_streak |

---

# 14. Accessibility Requirements

## 14.1 WCAG 2.1 AA Compliance

### Perceivable

**Text Alternatives**
- All images have descriptive alt text
- Icons have aria-labels
- Voice notes have transcription option

**Adaptable**
- Semantic HTML structure
- Proper heading hierarchy
- Landmark regions (nav, main, aside)

**Distinguishable**
- Minimum 4.5:1 contrast ratio
- Text resizable up to 200%
- No information conveyed by color alone
- Audio controls available

### Operable

**Keyboard Accessible**
- All features accessible via keyboard
- No keyboard traps
- Skip links provided
- Focus order logical

**Enough Time**
- No time limits (except session timeout with warning)
- Pause/stop animations

**Seizures and Physical Reactions**
- No flashing content >3 times/second
- Motion can be disabled

**Navigable**
- Page titles descriptive
- Focus visible
- Multiple navigation methods
- Link purpose clear

### Understandable

**Readable**
- Language declared in HTML
- Unusual words explained
- Abbreviations expanded

**Predictable**
- Consistent navigation
- Consistent identification
- No unexpected context changes

**Input Assistance**
- Error identification
- Labels and instructions
- Error prevention for important actions

### Robust

**Compatible**
- Valid HTML
- Name, role, value provided
- Status messages announced

## 14.2 Screen Reader Considerations

### Announcements
- New messages announced
- Form errors announced
- Success actions announced
- Partner status changes announced

### Focus Management
- Modal focus trapped and returned
- Dynamic content focus managed
- Page navigation focus reset

---

# 15. Internationalization Considerations

## 15.1 Future Language Support

### Phase 1 (Post-Launch)
- Spanish (Latin America)
- French
- Portuguese (Brazil)
- German

### Phase 2
- Japanese
- Korean
- Italian
- Dutch

### Phase 3
- Mandarin Chinese
- Hindi
- Arabic
- Russian

## 15.2 Technical Requirements

### Text Handling
- All strings externalized (i18n files)
- ICU message format for plurals
- Date/time localization
- Number formatting
- RTL support (for Arabic)

### Content
- Expandable UI (German text 30% longer)
- Cultural considerations in questions
- Localized virtual gift names
- Timezone handling already built

### Legal
- Country-specific terms of service
- GDPR for EU (already included)
- LGPD for Brazil
- PIPL for China

---

# Document Summary

This document covers all legal, content, and production requirements for a fully functional Closer application:

| Section | Status |
|---------|--------|
| Terms of Service | Outlined |
| Privacy Policy | Outlined |
| Cookie Policy | Outlined |
| Community Guidelines | Outlined |
| Refund Policy | Outlined |
| Accessibility Statement | Outlined |
| Email Templates | Complete |
| Push Notifications | Complete |
| Error Messages | Complete |
| Onboarding Content | Complete |
| Empty States | Complete |
| Tooltips & Help | Complete |
| Achievements | Complete |
| Question Bank | Samples provided |
| SEO & Meta | Complete |
| App Store Content | Complete |
| Support Content | Outlined |
| Analytics Events | Complete |
| Accessibility | Requirements listed |
| Internationalization | Considerations noted |

---

*Legal documents should be reviewed by an attorney before launch.*
*This document provides content direction; final copy may require refinement.*
