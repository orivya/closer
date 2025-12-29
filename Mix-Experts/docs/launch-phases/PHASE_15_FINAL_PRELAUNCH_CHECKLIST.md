# PHASE 15: FINAL PRE-LAUNCH CHECKLIST

**Status:** NOT STARTED
**Priority:** CRITICAL
**Estimated Time:** 3-5 days for full verification
**Last Updated:** 2025-12-28

## Overview

This is the **FINAL** comprehensive checklist before MixExperts goes live to the public. Every single item must be verified and checked off before launch. This document serves as the ultimate quality gate between staging and production.

**CRITICAL:** Do not skip any items. Each one has been identified as essential for a successful, professional launch.

---

## INFRASTRUCTURE VERIFICATION

### 1. Vercel Deployment Configured Correctly
- [ ] Production project created in Vercel dashboard
- [ ] Connected to correct Git repository and branch (main)
- [ ] Build command verified: `npm run build`
- [ ] Output directory set to: `.next`
- [ ] Node.js version specified: `20.x`
- [ ] Automatic deployments enabled for main branch
- [ ] Preview deployments configured for PRs
- [ ] Build logs reviewed for warnings or errors
- [ ] Production deployment completed successfully
- [ ] Test production URL loads correctly

**Verification Steps:**
```bash
# Visit production URL
curl -I https://your-production-url.vercel.app

# Check response is 200 OK
# Verify headers include security headers
```

### 2. Custom Domain Configured
- [ ] Domain purchased and owned
- [ ] Domain added to Vercel project
- [ ] A record or CNAME configured correctly
- [ ] www subdomain configured (if applicable)
- [ ] Naked domain (apex) configured
- [ ] Domain redirects working (www to non-www or vice versa)
- [ ] Test domain resolves to production site
- [ ] No mixed content warnings

**Verification Steps:**
```bash
# Check DNS resolution
dig mixexperts.com
dig www.mixexperts.com

# Verify both URLs load correctly
curl -I https://mixexperts.com
curl -I https://www.mixexperts.com
```

### 3. SSL Certificate Active
- [ ] SSL certificate auto-provisioned by Vercel
- [ ] Certificate valid and not expired
- [ ] Certificate covers all domain variations
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] No SSL warnings in browser
- [ ] Certificate chain complete
- [ ] Test on multiple browsers

**Verification Steps:**
```bash
# Check SSL certificate
openssl s_client -connect mixexperts.com:443 -servername mixexperts.com

# Test SSL Labs (https://www.ssllabs.com/ssltest/)
# Should receive A or A+ rating
```

### 4. DNS Propagation Complete
- [ ] DNS changes propagated globally (check 8.8.8.8, 1.1.1.1)
- [ ] No DNS caching issues
- [ ] TTL values appropriate
- [ ] MX records set (if using custom email)
- [ ] SPF record configured for email sending
- [ ] DKIM records configured
- [ ] DMARC policy set

**Verification Steps:**
```bash
# Check from multiple DNS servers
dig @8.8.8.8 mixexperts.com
dig @1.1.1.1 mixexperts.com
dig @208.67.222.222 mixexperts.com

# Use online tools:
# - https://www.whatsmydns.net/
# - https://dnschecker.org/
```

### 5. Environment Variables Set in Vercel (ALL)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `STRIPE_SECRET_KEY` (live mode - starts with `sk_live_`)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (live mode - starts with `pk_live_`)
- [ ] `STRIPE_WEBHOOK_SECRET` (production webhook secret)
- [ ] `STRIPE_CONNECT_CLIENT_ID`
- [ ] `RESEND_API_KEY`
- [ ] `NEXT_PUBLIC_APP_URL` (production URL)
- [ ] `DATABASE_URL` (if using direct connections)
- [ ] `SENTRY_DSN` (if using Sentry)
- [ ] `ANALYTICS_ID` (if using analytics)
- [ ] All variables encrypted in Vercel
- [ ] No test/development keys in production
- [ ] Verify no secrets logged in build output

**Verification Steps:**
1. Open Vercel dashboard → Project → Settings → Environment Variables
2. Verify all variables present for "Production" environment
3. Check no variables marked as "Preview" or "Development" are used in prod
4. Redeploy to ensure variables are active

### 6. Supabase Project on Appropriate Plan
- [ ] Production Supabase project created (separate from dev/staging)
- [ ] Upgraded to Pro plan (minimum for production)
- [ ] Database size limits appropriate
- [ ] Connection pooling enabled
- [ ] Database backups configured (daily minimum)
- [ ] Point-in-time recovery enabled
- [ ] Compute resources allocated appropriately
- [ ] Check pricing and billing alerts set
- [ ] Team access configured
- [ ] Verify organization settings

**Verification Steps:**
1. Login to Supabase dashboard
2. Navigate to Organization → Billing
3. Confirm Pro plan active
4. Check Settings → Database → Connection pooling enabled
5. Verify backups in Settings → Database → Backups

### 7. Stripe Account in Live Mode
- [ ] Stripe account fully activated
- [ ] Business details completed
- [ ] Bank account connected for payouts
- [ ] Identity verification completed
- [ ] Tax information submitted
- [ ] Account not in restricted mode
- [ ] Live mode API keys generated
- [ ] Test mode clearly separated
- [ ] Branding/business profile completed
- [ ] Support email/phone configured

**Verification Steps:**
1. Login to Stripe Dashboard
2. Check top-left: "Viewing live data" toggle ON
3. Verify Settings → Business settings → all sections complete
4. Confirm Settings → Bank accounts and scheduling shows connected account

### 8. Stripe Webhook Pointing to Production URL
- [ ] Webhook endpoint created in Stripe dashboard (live mode)
- [ ] URL set to: `https://yourdomain.com/api/webhooks/stripe`
- [ ] API version matches code implementation
- [ ] Test webhook sent successfully
- [ ] Webhook endpoint responds with 200 OK
- [ ] No authentication/authorization errors
- [ ] Logs show webhook received

**Verification Steps:**
1. Stripe Dashboard → Developers → Webhooks
2. Find production webhook endpoint
3. Click "Send test webhook"
4. Verify response is 200 OK
5. Check Vercel logs for webhook receipt

### 9. Webhook Secret Updated for Production
- [ ] Production webhook signing secret copied from Stripe
- [ ] Secret set as `STRIPE_WEBHOOK_SECRET` in Vercel
- [ ] Old test/development secrets removed
- [ ] Webhook signature verification working
- [ ] Test webhook with real signature
- [ ] No signature verification failures in logs

**Verification Steps:**
1. Stripe Dashboard → Developers → Webhooks → [Your endpoint]
2. Click "Signing secret" → Reveal
3. Copy secret (starts with `whsec_`)
4. Verify matches Vercel environment variable
5. Send test webhook and confirm verification passes

---

## DATABASE VERIFICATION

### 10. All Tables Created in Production
- [ ] `profiles` table exists with correct schema
- [ ] `engineer_profiles` table exists
- [ ] `bookings` table exists
- [ ] `availability` table exists
- [ ] `sessions` table exists
- [ ] `payments` table exists
- [ ] `reviews` table exists
- [ ] All foreign key constraints created
- [ ] All column types correct
- [ ] All NOT NULL constraints in place
- [ ] Default values configured

**Verification Steps:**
```sql
-- Run in Supabase SQL Editor (production project)
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verify each table structure
\d profiles
\d engineer_profiles
\d bookings
-- etc.
```

### 11. All RLS Policies Enabled
- [ ] RLS enabled on all tables
- [ ] `profiles` policies: users can read all, update own
- [ ] `engineer_profiles` policies: read all, update own
- [ ] `bookings` policies: read own (client/engineer), create, update own
- [ ] `availability` policies: read all, engineer can CUD own
- [ ] `sessions` policies: read own, create own
- [ ] `payments` policies: read own only
- [ ] `reviews` policies: read all, create if booked, update own
- [ ] Test policies with different user roles
- [ ] No policy allows unauthorized access
- [ ] Service role key bypasses RLS (as expected)

**Verification Steps:**
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- All should show rowsecurity = true

-- List all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 12. All Triggers and Functions Deployed
- [ ] `handle_new_user()` function exists
- [ ] Trigger on `auth.users` creates profile
- [ ] `update_updated_at()` function exists
- [ ] Triggers on tables for updated_at timestamps
- [ ] Custom validation functions deployed
- [ ] Notification functions deployed (if any)
- [ ] Test triggers fire correctly
- [ ] No orphaned/old triggers from development

**Verification Steps:**
```sql
-- List all functions
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- List all triggers
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

### 13. Database Backups Configured
- [ ] Automatic daily backups enabled
- [ ] Backup retention period set (minimum 7 days)
- [ ] Point-in-time recovery enabled
- [ ] Test restore from backup (in non-prod)
- [ ] Backup notifications configured
- [ ] Download backup manually to verify
- [ ] Backup schedule documented

**Verification Steps:**
1. Supabase Dashboard → Settings → Database → Backups
2. Verify "Automatic backups" enabled
3. Check retention period
4. Verify "Point in Time Recovery" enabled
5. Download most recent backup to verify integrity

### 14. Indexes Created for Performance
- [ ] Primary keys on all tables
- [ ] Foreign key indexes created
- [ ] `profiles.email` indexed
- [ ] `engineer_profiles.user_id` indexed
- [ ] `bookings.client_id` indexed
- [ ] `bookings.engineer_id` indexed
- [ ] `bookings.session_date` indexed
- [ ] `availability.engineer_id` indexed
- [ ] `availability.date` indexed
- [ ] Composite indexes for common queries
- [ ] Run EXPLAIN ANALYZE on slow queries

**Verification Steps:**
```sql
-- List all indexes
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Test query performance
EXPLAIN ANALYZE
SELECT * FROM bookings WHERE client_id = 'some-uuid';
```

---

## STORAGE VERIFICATION

### 15. All Buckets Created
- [ ] `profile-images` bucket exists
- [ ] `session-attachments` bucket exists (if applicable)
- [ ] `public-assets` bucket exists (if applicable)
- [ ] Bucket naming convention consistent
- [ ] Storage limits appropriate for plan
- [ ] Check storage usage/quotas

**Verification Steps:**
1. Supabase Dashboard → Storage
2. Verify all required buckets present
3. Click each bucket → Settings to verify configuration

### 16. Bucket Policies Configured
- [ ] `profile-images`: authenticated users can upload own, all can read
- [ ] `session-attachments`: only booking participants can access
- [ ] `public-assets`: all can read, admin can write
- [ ] File size limits set
- [ ] Allowed MIME types configured
- [ ] Test upload with different user roles
- [ ] Test unauthorized access blocked

**Verification Steps:**
```sql
-- Check storage policies
SELECT *
FROM storage.policies
ORDER BY bucket_id, name;
```

Test manually:
1. Login as regular user
2. Try uploading profile image
3. Try accessing another user's image
4. Verify expected access/denial

### 17. CORS Configured for Production Domain
- [ ] CORS allowed origins includes production URL
- [ ] CORS allows necessary methods (GET, POST, PUT, DELETE)
- [ ] CORS headers include: Authorization, Content-Type
- [ ] Wildcard (*) NOT used in production
- [ ] Test upload from production frontend
- [ ] No CORS errors in browser console

**Verification Steps:**
1. Supabase Dashboard → Settings → API
2. Scroll to "CORS Configuration"
3. Verify production domain listed
4. Test image upload from production site
5. Check browser DevTools → Network → No CORS errors

---

## STRIPE CONFIGURATION

### 18. Products and Prices Created in Live Mode
- [ ] Toggle Stripe dashboard to "Live mode"
- [ ] Products created for all session types
- [ ] Prices created with correct amounts
- [ ] Currency set correctly (USD, EUR, etc.)
- [ ] Recurring vs one-time set correctly
- [ ] Product metadata populated
- [ ] Product descriptions customer-facing
- [ ] Test product NOT visible in live mode

**Verification Steps:**
1. Stripe Dashboard → Products (ensure "Viewing live data")
2. Verify all products listed
3. Click each product → verify prices
4. Check metadata includes relevant info

### 19. Price IDs Updated in Environment
- [ ] Copy live mode price IDs from Stripe
- [ ] Update environment variables in Vercel
- [ ] Remove any test mode price IDs
- [ ] Verify price IDs start with `price_` (not `price_test_`)
- [ ] Code references environment variables (not hardcoded)
- [ ] Redeploy after updating

**Verification Steps:**
1. Stripe Dashboard → Products → [Product] → Pricing
2. Copy price ID (starts with `price_` for live)
3. Update in Vercel environment variables
4. Grep codebase for any hardcoded test price IDs
5. Redeploy and verify checkout uses live prices

### 20. Stripe Connect Properly Configured
- [ ] Connect platform account created
- [ ] Connect onboarding flow tested end-to-end
- [ ] Express/Custom account type chosen
- [ ] Required business information collected
- [ ] Payout schedule configured
- [ ] Application fee configuration set
- [ ] Test engineer Connect onboarding
- [ ] Connected account appears in dashboard
- [ ] Platform controls appropriate

**Verification Steps:**
1. Stripe Dashboard → Connect → Settings
2. Verify branding and onboarding settings
3. Create test connected account in live mode
4. Complete onboarding flow as engineer
5. Verify account shows in Connect → Accounts

### 21. Webhook Events All Registered
- [ ] `checkout.session.completed` subscribed
- [ ] `payment_intent.succeeded` subscribed
- [ ] `payment_intent.payment_failed` subscribed
- [ ] `account.updated` subscribed (for Connect)
- [ ] `account.external_account.created` subscribed
- [ ] `charge.refunded` subscribed
- [ ] `customer.subscription.created` subscribed (if using subscriptions)
- [ ] `customer.subscription.deleted` subscribed
- [ ] All events have handlers in code
- [ ] Unhandled events logged for monitoring

**Verification Steps:**
1. Stripe Dashboard → Developers → Webhooks → [Your endpoint]
2. Scroll to "Events to send"
3. Verify all necessary events selected
4. Review `/api/webhooks/stripe/route.ts` for handlers
5. Send test events and verify handling

### 22. Test Transaction with Real Card (Small Amount)
- [ ] Use real credit card (NOT test card)
- [ ] Create booking for $1 or minimum amount
- [ ] Complete checkout flow
- [ ] Payment succeeds in Stripe dashboard
- [ ] Webhook fires and updates database
- [ ] Booking status updated correctly
- [ ] Email confirmations sent
- [ ] Connected account receives funds (minus platform fee)
- [ ] Refund test transaction
- [ ] Verify refund webhook handled

**Verification Steps:**
1. Create new user account (or use your own)
2. Book session with real engineer profile
3. Use real card: 4242 4242 4242 4242 won't work (that's test mode)
4. Use actual personal credit/debit card
5. Check Stripe Dashboard → Payments for transaction
6. Verify database booking record updated
7. Check email inbox for confirmation
8. Issue refund from Stripe dashboard
9. Verify refund reflected in app

**IMPORTANT:** After testing, you can refund this transaction.

---

## EMAIL VERIFICATION

### 23. Resend Domain Verified
- [ ] Custom domain added to Resend
- [ ] DNS records added (TXT, CNAME for DKIM)
- [ ] Domain verification status: "Verified"
- [ ] SPF record includes Resend
- [ ] DMARC policy configured
- [ ] Test email sent from custom domain
- [ ] Email not marked as spam
- [ ] Test with multiple email providers (Gmail, Outlook, etc.)

**Verification Steps:**
1. Resend Dashboard → Domains
2. Verify status shows "Verified" with green checkmark
3. Send test email via Resend API
4. Check recipient inbox (check spam folder too)
5. Use mail-tester.com to check spam score

### 24. All Email Templates Tested
- [ ] Welcome email renders correctly
- [ ] Booking confirmation (client) tested
- [ ] Booking confirmation (engineer) tested
- [ ] Payment receipt email tested
- [ ] Booking reminder (24hr before) tested
- [ ] Booking canceled email tested
- [ ] Refund notification tested
- [ ] All templates mobile-responsive
- [ ] All links work and point to production
- [ ] Unsubscribe link present and working
- [ ] No placeholder text (e.g., "{{name}}")
- [ ] Test with different email clients

**Verification Steps:**
1. Trigger each email type via app actions
2. Check inbox for each email
3. Open on desktop and mobile
4. Click all links to verify destinations
5. Test in Gmail, Outlook, Apple Mail

### 25. Sender Address Configured
- [ ] "From" address set to branded email (e.g., hello@mixexperts.com)
- [ ] "From" name set (e.g., "MixExperts Team")
- [ ] "Reply-to" configured to support email
- [ ] Support email monitored
- [ ] No-reply address set up (if needed)
- [ ] Sender reputation good (no previous spam issues)

**Verification Steps:**
1. Check email code for from/reply-to fields
2. Send test email
3. Verify "From" shows correctly in inbox
4. Reply to email and verify reaches support inbox

### 26. Unsubscribe Works
- [ ] Unsubscribe link in all marketing emails
- [ ] Unsubscribe link in footer of emails
- [ ] Clicking unsubscribe opens preference page
- [ ] User can opt-out of email types
- [ ] Unsubscribe saves to database
- [ ] Transactional emails still sent (booking confirmations)
- [ ] Marketing emails stop for unsubscribed users
- [ ] One-click unsubscribe header (List-Unsubscribe)

**Verification Steps:**
1. Send marketing email to test account
2. Click unsubscribe link in email
3. Verify preference page loads
4. Toggle email preferences
5. Verify changes saved in database
6. Test that marketing emails stop
7. Verify transactional emails still arrive

---

## CONTENT VERIFICATION

### 27. Terms of Service Finalized and Legal Reviewed
- [ ] ToS document completed
- [ ] Reviewed by lawyer (STRONGLY recommended)
- [ ] All placeholders replaced
- [ ] Effective date set
- [ ] Jurisdiction specified
- [ ] Dispute resolution process defined
- [ ] Limitation of liability included
- [ ] User responsibilities outlined
- [ ] Payment terms clear
- [ ] Cancellation policy defined
- [ ] Published at /terms-of-service
- [ ] Footer link to ToS working
- [ ] ToS accepted during signup (checkbox)

**Verification Steps:**
1. Navigate to https://yourdomain.com/terms-of-service
2. Read through entire document
3. Verify no "[INSERT]" or "TODO" text
4. Confirm with legal counsel if possible
5. Check signup flow requires ToS acceptance

### 28. Privacy Policy Finalized and Legal Reviewed
- [ ] Privacy Policy completed
- [ ] GDPR compliance addressed (if applicable)
- [ ] CCPA compliance addressed (if applicable)
- [ ] Data collection explained
- [ ] Data usage explained
- [ ] Third-party services listed (Stripe, Supabase, etc.)
- [ ] Cookie policy included
- [ ] User rights outlined (access, deletion, portability)
- [ ] Contact email for privacy inquiries
- [ ] Published at /privacy-policy
- [ ] Footer link working
- [ ] Reviewed by lawyer

**Verification Steps:**
1. Navigate to https://yourdomain.com/privacy-policy
2. Read through entire document
3. Verify all third-party services mentioned
4. Confirm user rights section complete
5. Check footer link works

### 29. All Placeholder Text Replaced
- [ ] Search codebase for "TODO"
- [ ] Search for "FIXME"
- [ ] Search for "[INSERT"
- [ ] Search for "Lorem ipsum"
- [ ] Search for "example.com"
- [ ] Search for "test@test.com"
- [ ] Search for "Coming soon"
- [ ] All hero sections have final copy
- [ ] All CTAs have final copy
- [ ] About page finalized
- [ ] Contact information accurate

**Verification Steps:**
```bash
cd /Users/bchill/Documents/Cursor\ Projects/Mix-Experts
grep -r "TODO" src/
grep -r "FIXME" src/
grep -r "Lorem ipsum" src/
grep -r "\[INSERT" src/
grep -r "example\.com" src/
grep -r "Coming soon" src/
```

### 30. All Images Optimized
- [ ] All images compressed (TinyPNG, ImageOptim, etc.)
- [ ] Images in modern formats (WebP with fallbacks)
- [ ] No images over 500KB (except hero images)
- [ ] Hero images under 1MB
- [ ] Responsive images with srcset
- [ ] Alt text on all images (accessibility)
- [ ] Lazy loading implemented
- [ ] Next.js Image component used
- [ ] No broken image links

**Verification Steps:**
1. Run Lighthouse audit → Check image optimization
2. Check Network tab for large image downloads
3. Verify images load quickly
4. Test on slow 3G connection
5. Check alt attributes in HTML

### 31. Favicon and App Icons Set
- [ ] favicon.ico in public/
- [ ] apple-touch-icon.png (180x180)
- [ ] icon-192.png (for Android)
- [ ] icon-512.png (for Android)
- [ ] manifest.json configured
- [ ] Favicon displays in browser tabs
- [ ] Icon displays on mobile home screen
- [ ] All sizes generated and optimized

**Verification Steps:**
1. Visit site and check browser tab icon
2. Check /public folder for icon files
3. View page source, verify meta tags for icons
4. Test "Add to Home Screen" on mobile
5. Use https://realfavicongenerator.net/ to validate

### 32. OG Images for Social Sharing
- [ ] Default OG image created (1200x630)
- [ ] OG image set in layout/metadata
- [ ] OG title, description set
- [ ] Twitter card configured
- [ ] Dynamic OG images for profiles (if applicable)
- [ ] Test sharing on Facebook
- [ ] Test sharing on Twitter/X
- [ ] Test sharing on LinkedIn
- [ ] Image displays correctly in previews

**Verification Steps:**
1. View page source → verify og:image meta tag
2. Use https://www.opengraph.xyz/ to test
3. Use https://cards-dev.twitter.com/validator to test Twitter
4. Share link on social platforms and verify preview

---

## SEO VERIFICATION

### 33. Sitemap Generating Correctly
- [ ] Sitemap.xml exists at /sitemap.xml
- [ ] All important pages included
- [ ] Dynamic routes included (profiles, etc.)
- [ ] URLs are absolute (include domain)
- [ ] Sitemap follows XML format
- [ ] No 404 or redirect URLs in sitemap
- [ ] lastmod dates accurate
- [ ] Priority values set appropriately
- [ ] Submitted to Google Search Console
- [ ] Submitted to Bing Webmaster Tools

**Verification Steps:**
```bash
curl https://yourdomain.com/sitemap.xml
```

1. Verify XML is valid
2. Check all URLs return 200 OK
3. Submit to Google Search Console
4. Verify no errors in Search Console

### 34. Robots.txt Configured
- [ ] Robots.txt exists at /robots.txt
- [ ] Sitemap location specified
- [ ] No critical pages blocked
- [ ] Admin/dashboard routes blocked
- [ ] API routes blocked
- [ ] Staging environments blocked (if applicable)
- [ ] User-agent: * configured
- [ ] Crawl-delay set (if needed)

**Verification Steps:**
```bash
curl https://yourdomain.com/robots.txt
```

Expected content:
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/

Sitemap: https://yourdomain.com/sitemap.xml
```

### 35. Meta Descriptions on All Pages
- [ ] Homepage meta description (155 chars)
- [ ] About page meta description
- [ ] Browse engineers page meta description
- [ ] Become an engineer page meta description
- [ ] Dynamic profile pages have descriptions
- [ ] Login/signup pages have descriptions
- [ ] No duplicate meta descriptions
- [ ] All descriptions compelling and accurate
- [ ] Include target keywords naturally

**Verification Steps:**
1. View source on each page
2. Find `<meta name="description" content="...">`
3. Verify content is unique and compelling
4. Check character count (aim for 120-155 chars)

### 36. Canonical URLs Set
- [ ] Canonical tag on all pages
- [ ] Points to correct production URL
- [ ] No http:// canonicals (should be https://)
- [ ] No staging URLs in canonicals
- [ ] Dynamic pages have correct canonicals
- [ ] No self-referencing redirect loops

**Verification Steps:**
1. View source on various pages
2. Find `<link rel="canonical" href="...">`
3. Verify URL is correct production URL
4. Check no http:// (should be https://)

---

## MONITORING & ANALYTICS

### 37. Error Tracking Set Up (Sentry or Similar)
- [ ] Sentry project created (or alternative)
- [ ] DSN configured in environment variables
- [ ] Sentry SDK initialized in app
- [ ] Source maps uploaded to Sentry
- [ ] Test error captured successfully
- [ ] Error notifications configured
- [ ] Team members have access
- [ ] Performance monitoring enabled
- [ ] Release tracking configured
- [ ] Sensitive data scrubbed from errors

**Verification Steps:**
1. Trigger test error in production
2. Verify error appears in Sentry dashboard
3. Check error includes stack trace
4. Verify source maps working (code readable)
5. Test notification received

### 38. Uptime Monitoring Configured
- [ ] Uptime monitor service set up (UptimeRobot, Pingdom, etc.)
- [ ] Homepage pinged every 5 minutes
- [ ] API health endpoint monitored
- [ ] Alert threshold set (down for 2 minutes)
- [ ] Multiple global locations monitored
- [ ] Email/SMS alerts configured
- [ ] Status page created (if public)
- [ ] Test alert by stopping server

**Verification Steps:**
1. Set up monitor on UptimeRobot or similar
2. Add URL: https://yourdomain.com
3. Set interval to 5 minutes
4. Configure alert contacts
5. Verify monitor shows "Up"

### 39. Performance Monitoring Enabled
- [ ] Google Analytics 4 installed (or alternative)
- [ ] Core Web Vitals tracked
- [ ] Page load times monitored
- [ ] API response times tracked
- [ ] Database query performance monitored
- [ ] Vercel analytics enabled
- [ ] Custom events tracked (signup, booking, payment)
- [ ] Conversion funnels set up
- [ ] Privacy compliant (GDPR cookie consent)

**Verification Steps:**
1. Install Google Analytics or alternative
2. Add tracking code to app
3. Test event tracking with browser extensions
4. Verify events appear in analytics dashboard
5. Check Vercel Analytics → Speed Insights

### 40. Logging Configured
- [ ] Structured logging implemented
- [ ] Log levels configured (error, warn, info, debug)
- [ ] Production logs to external service (Logtail, Datadog, etc.)
- [ ] Sensitive data not logged (passwords, tokens)
- [ ] Request IDs for tracing
- [ ] Database query logging (in moderation)
- [ ] Webhook event logging
- [ ] Payment transaction logging
- [ ] Log retention policy set

**Verification Steps:**
1. Check Vercel → Project → Logs
2. Verify logs appear in real-time
3. Trigger various actions (login, booking, payment)
4. Verify logs captured
5. Search logs for sensitive data (should find none)

---

## FINAL CHECKS

### 41. Create First Real Engineer Account
- [ ] Sign up with real email address
- [ ] Verify email confirmation works
- [ ] Complete profile with real information
- [ ] Upload real profile photo
- [ ] Set hourly rate
- [ ] Connect Stripe account
- [ ] Complete full Stripe onboarding
- [ ] Verify connected account in Stripe dashboard
- [ ] Set availability for next 2 weeks
- [ ] Test calendar integration (if applicable)

**Verification Steps:**
1. Navigate to /signup
2. Create account with your real email
3. Check inbox for verification email
4. Complete entire profile
5. Go through Stripe Connect onboarding
6. Verify account shows in Stripe → Connect → Accounts

### 42. Complete Profile with Real Content
- [ ] Professional headshot uploaded
- [ ] Bio/description written (no placeholder text)
- [ ] Skills and expertise listed
- [ ] Years of experience set
- [ ] Hourly rate configured
- [ ] Session types offered selected
- [ ] Portfolio/work samples added (if applicable)
- [ ] Social links added (LinkedIn, GitHub, etc.)
- [ ] Timezone set correctly
- [ ] Profile published and visible

**Verification Steps:**
1. Complete entire profile
2. View public profile page
3. Verify all information displays correctly
4. Check on mobile and desktop
5. Share link with colleague for feedback

### 43. Test Real Booking with Test Client
- [ ] Create second account (test client)
- [ ] Browse engineer directory
- [ ] Find your engineer profile
- [ ] Select session type
- [ ] Choose available time slot
- [ ] Proceed to checkout
- [ ] Enter real payment information
- [ ] Complete booking
- [ ] Verify booking confirmation emails (both client and engineer)
- [ ] Check booking appears in dashboard for both users
- [ ] Verify calendar events created (if applicable)

**Verification Steps:**
1. Create new account in incognito window
2. Search for your engineer profile
3. Book a session
4. Complete checkout with real card
5. Check both email inboxes
6. Verify booking in both dashboards

### 44. Process Real Payment
- [ ] Payment captured in Stripe
- [ ] Payment shows in Stripe Dashboard → Payments
- [ ] Platform fee calculated correctly
- [ ] Engineer payout scheduled
- [ ] Payment record created in database
- [ ] Booking status updated to "confirmed"
- [ ] Receipt email sent to client
- [ ] Payment notification sent to engineer
- [ ] Check Stripe Balance shows incoming funds

**Verification Steps:**
1. Stripe Dashboard → Payments
2. Find your test payment
3. Verify amount correct
4. Check "Application fee" shows platform fee
5. Verify Connect account shows pending balance

### 45. Verify Payout to Bank Account
- [ ] Wait for payout schedule (or trigger manual payout)
- [ ] Payout created in Stripe
- [ ] Payout status: "paid" or "in_transit"
- [ ] Check connected account balance
- [ ] Verify payout shows in bank account (may take 2-7 days)
- [ ] Amount matches expected (booking price minus fees)
- [ ] Bank transaction description clear

**Verification Steps:**
1. Stripe Dashboard → Connect → Accounts → [Your account]
2. Check "Payouts" tab
3. Verify payout created
4. Wait for bank transfer
5. Check bank account for deposit

**NOTE:** This may take several days. You can proceed with launch while monitoring.

### 46. Screenshot All Pages for Records
- [ ] Homepage (desktop and mobile)
- [ ] About page
- [ ] Browse engineers page
- [ ] Individual engineer profile
- [ ] Booking flow (all steps)
- [ ] Checkout page
- [ ] Dashboard (client view)
- [ ] Dashboard (engineer view)
- [ ] Settings pages
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] 404 page
- [ ] Save screenshots to Google Drive/Dropbox
- [ ] Date screenshots for version control

**Verification Steps:**
1. Use browser screenshot tools or Full Page Screen Capture extension
2. Systematically screenshot each page
3. Organize in folder: "MixExperts Launch Screenshots - [DATE]"
4. Include in launch documentation

### 47. Announce Launch!
- [ ] Prepare launch announcement copy
- [ ] Schedule social media posts (Twitter, LinkedIn, etc.)
- [ ] Email existing waitlist (if any)
- [ ] Post in relevant communities (Reddit, Indie Hackers, etc.)
- [ ] Update personal website/portfolio
- [ ] Submit to product directories (Product Hunt, BetaList, etc.)
- [ ] Notify friends/family/network
- [ ] Monitor for initial feedback
- [ ] Respond to early users
- [ ] Celebrate!

**Verification Steps:**
1. Draft announcement posts
2. Queue posts in Buffer/Hootsuite
3. Prepare email to send
4. Create list of communities to post in
5. Schedule Product Hunt launch (if applicable)

---

## LAUNCH DAY RUNBOOK

### PRE-LAUNCH TASKS (1 Hour Before)

**T-minus 60 minutes:**

1. **Final Verification**
   ```bash
   # Check production site loads
   curl -I https://yourdomain.com

   # Verify API health
   curl https://yourdomain.com/api/health
   ```

2. **Database Check**
   - [ ] Login to Supabase dashboard
   - [ ] Verify database online and responsive
   - [ ] Check no ongoing maintenance
   - [ ] Verify backup taken in last 24 hours

3. **Stripe Verification**
   - [ ] Login to Stripe dashboard
   - [ ] Confirm in live mode
   - [ ] Check webhook endpoint green status
   - [ ] Verify no account restrictions

4. **Monitoring Setup**
   - [ ] Open Sentry dashboard in browser tab
   - [ ] Open Vercel logs in browser tab
   - [ ] Open Stripe dashboard in browser tab
   - [ ] Open uptime monitor dashboard
   - [ ] Set up alerts on phone

5. **Team Coordination**
   - [ ] Notify team members launch imminent
   - [ ] Ensure key people available for next 2-4 hours
   - [ ] Set up communication channel (Slack, Discord)
   - [ ] Share monitoring dashboard links

**T-minus 30 minutes:**

6. **Content Final Check**
   - [ ] Visit every public page one last time
   - [ ] Check for typos or broken links
   - [ ] Test mobile responsiveness
   - [ ] Clear browser cache and test

7. **Test User Flows**
   - [ ] Sign up flow works
   - [ ] Login flow works
   - [ ] Profile creation works
   - [ ] Browsing engineers works
   - [ ] Can initiate booking

**T-minus 15 minutes:**

8. **Marketing Prep**
   - [ ] Final review of announcement posts
   - [ ] Have launch tweet/post ready to publish
   - [ ] Email to waitlist ready to send
   - [ ] Product Hunt submission ready (if applicable)

9. **Emergency Contacts**
   - [ ] Have Vercel support contact ready
   - [ ] Have Stripe support contact ready
   - [ ] Have Supabase support contact ready
   - [ ] Document rollback procedure (see below)

**T-minus 5 minutes:**

10. **Deep Breath**
    - [ ] Take a moment
    - [ ] Review checklist one final time
    - [ ] Prepare to monitor closely
    - [ ] Get excited!

---

### GO-LIVE TASKS

**T-minus 0 (LAUNCH TIME!):**

1. **Publish Announcement**
   - [ ] Send launch tweet/post
   - [ ] Send email to waitlist
   - [ ] Post in communities
   - [ ] Submit to Product Hunt (if scheduled)
   - [ ] Update LinkedIn status

2. **Open Monitoring Dashboards**
   - [ ] Watch Vercel logs in real-time
   - [ ] Monitor Sentry for errors
   - [ ] Watch Stripe dashboard for events
   - [ ] Monitor uptime status
   - [ ] Keep eye on analytics for traffic spike

3. **Initial Test**
   - [ ] Visit site from different device/network
   - [ ] Create test account
   - [ ] Browse around
   - [ ] Verify everything works

---

### POST-LAUNCH MONITORING (First 24 Hours)

**First Hour:**
- [ ] Watch for any error spikes in Sentry
- [ ] Monitor Vercel logs for 500 errors
- [ ] Check Stripe webhook deliveries successful
- [ ] Verify uptime monitor shows green
- [ ] Respond to any early user feedback/questions
- [ ] Monitor server resource usage
- [ ] Check database performance (slow queries)

**Hours 2-4:**
- [ ] Continue monitoring error rates
- [ ] Review any user-reported issues
- [ ] Check email deliverability (any bounces?)
- [ ] Monitor payment success rate
- [ ] Review analytics for user behavior
- [ ] Check social media mentions
- [ ] Respond to comments/questions

**Hours 4-12:**
- [ ] Review Sentry for patterns in errors
- [ ] Check Stripe for any payment issues
- [ ] Monitor database connection pool
- [ ] Review API response times
- [ ] Check for any unusual traffic patterns
- [ ] Continue engaging with early users
- [ ] Document any issues found

**Hours 12-24:**
- [ ] Comprehensive error review
- [ ] Payment success rate analysis
- [ ] User signup completion rate
- [ ] Bounce rate analysis
- [ ] Core Web Vitals check
- [ ] User feedback compilation
- [ ] Plan immediate fixes if needed

**Metrics to Track:**
- Total signups
- Engineer profiles created
- Bookings initiated
- Payments completed
- Average session duration
- Bounce rate
- Error rate
- API response times
- Email delivery rate

---

### EMERGENCY ROLLBACK PROCEDURE

**IF CRITICAL ISSUE DISCOVERED:**

1. **Assess Severity**
   - Is site completely down? → ROLLBACK IMMEDIATELY
   - Are payments failing? → ROLLBACK IMMEDIATELY
   - Is data being corrupted? → ROLLBACK IMMEDIATELY
   - Minor UI bug? → Fix forward, don't rollback
   - Slow performance? → Investigate, may not need rollback

2. **Communication**
   ```markdown
   # Post to status page / social media
   "We're experiencing technical difficulties.
   Our team is investigating.
   We'll update you within 30 minutes."
   ```

3. **Vercel Rollback**
   ```bash
   # In Vercel dashboard
   Deployments → Find last stable deployment →
   Click "..." → "Promote to Production"

   # Or via CLI
   vercel rollback
   ```

4. **Database Rollback (If Needed)**
   ```sql
   -- Only if database corrupted
   -- This is why we have backups!

   -- In Supabase dashboard
   Settings → Database → Backups →
   Select backup → Restore
   ```

5. **Environment Variables**
   - If issue is config-related, revert environment variables
   - Redeploy after reverting

6. **Post-Rollback**
   - [ ] Verify site functional
   - [ ] Test critical user flows
   - [ ] Update status page
   - [ ] Investigate root cause
   - [ ] Fix issue in staging
   - [ ] Re-deploy when ready

7. **Communication Update**
   ```markdown
   "We've identified and resolved the issue.
   Service is now stable.
   We apologize for any inconvenience."
   ```

---

## SUCCESS CRITERIA

Launch is considered successful when:

- [ ] Site accessible and loading in < 3 seconds
- [ ] No critical errors in Sentry
- [ ] At least 1 successful end-to-end booking
- [ ] All payments processing correctly
- [ ] Email delivery working
- [ ] Uptime at 99.9%+
- [ ] No data integrity issues
- [ ] User feedback generally positive
- [ ] No security vulnerabilities discovered
- [ ] Team confident in stability

---

## POST-LAUNCH WEEK PRIORITIES

**Days 1-3:**
1. Continue monitoring all systems
2. Respond to all user feedback
3. Fix any minor bugs discovered
4. Optimize any slow queries
5. Improve based on real usage patterns

**Days 4-7:**
1. Comprehensive performance review
2. User experience analysis
3. Conversion funnel optimization
4. SEO monitoring (indexing status)
5. Plan next iteration of features

**Week 2+:**
1. Feature requests prioritization
2. Scaling considerations
3. Marketing optimization
4. Community building
5. Celebrate successful launch!

---

## NOTES

- **Do not skip items:** Every checkbox matters
- **Document everything:** Take notes during verification
- **Ask for help:** If unsure about any item, get a second opinion
- **Stay calm:** Launch day will have surprises; that's normal
- **Iterate:** Launch is not the end; it's the beginning

---

## FINAL SIGN-OFF

**Verified by:** _______________________
**Date:** _______________________
**Time:** _______________________

**All 47 stages completed:** [ ]
**All monitoring in place:** [ ]
**Team ready:** [ ]
**Emergency contacts documented:** [ ]

**READY TO LAUNCH:** [ ]

---

**Remember:** Perfection is the enemy of shipped. If 95% of items are green and the critical ones are solid, you're ready. Launch, learn, and iterate.

Good luck! You've got this.
