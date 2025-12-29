# Mix-Experts Session Handoff

**Date:** December 28, 2025
**Branch:** `claude/setup-mix-experts-local-Z4T1T`

---

## Completed This Session

### 1. Local Environment Setup
- Pulled latest from main
- Ran `npm install` (398 packages)
- Created `.env.local` file (gitignored, not committed)

### 2. Stripe Webhook Endpoint Created
- **File:** `src/app/api/webhooks/stripe/route.ts`
- **URL:** `https://yourdomain.com/api/webhooks/stripe`
- **Installed:** `stripe` npm package

**Events handled:**
- `checkout.session.completed` - Booking/subscription payment done
- `customer.subscription.created` - New subscription started
- `customer.subscription.updated` - Plan changed
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.paid` - Recurring payment succeeded
- `invoice.payment_failed` - Recurring payment failed
- `account.updated` - Engineer Stripe account status
- `payout.paid` - Engineer payout succeeded
- `payout.failed` - Engineer payout failed
- `charge.refunded` - Refund issued
- `charge.dispute.created` - Dispute opened
- `charge.dispute.closed` - Dispute resolved

### 3. Vercel Environment Variables
The following should be set in Vercel (Settings → Environment Variables):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qyqvkiwnmhfgrumvmwfy.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cXZraXdubWhmZ3J1bXZtd2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2OTk2MTIsImV4cCI6MjA4MjI3NTYxMn0.hHN2JUc_Ew-pfV41HnFJry5Bqnoe6LKkHvFG7zNVE2w` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cXZraXdubWhmZ3J1bXZtd2Z5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjY5OTYxMiwiZXhwIjoyMDgyMjc1NjEyfQ.7xV76SUmn0hALYlUJ0swfGmj2_qPgFXH5f-SKolqHPA` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your `pk_live_...` key |
| `STRIPE_SECRET_KEY` | Your `sk_live_...` key |
| `STRIPE_WEBHOOK_SECRET` | Your `whsec_...` from Stripe webhook |
| `NEXT_PUBLIC_SITE_URL` | Your production domain |

### 4. Stripe Webhook Configured
- Webhook created in Stripe Dashboard (Developers → Webhooks)
- 12 events selected (listed above)
- Status: **Active**

---

## Existing Infrastructure (from previous sessions)

### Supabase Client Files
- `src/lib/supabase.ts` - Browser client
- `src/lib/supabase-server.ts` - Server client + admin client
- `src/lib/supabase-middleware.ts` - Session refresh middleware

### Auth Middleware
- `src/middleware.ts` - Protects `/dashboard/*` routes, redirects auth flows
- Note: Next.js 16 shows deprecation warning (migrate to "proxy" later)

---

## What Still Needs Implementation

### PHASE 1: Database Schema in Supabase
Create these tables in Supabase Dashboard (SQL Editor):

```
- profiles (users, engineers, clients)
- services (mixing, mastering offerings)
- products (sample packs, presets)
- orders (bookings)
- projects (active work)
- messages (inbox)
- portfolio_items
```

### PHASE 2: Connect Authentication
- Replace mock `UserContext` with Supabase Auth
- Wire login/signup forms to Supabase
- Password reset flow
- Email verification

### PHASE 3: Stripe Integration
- Stripe Connect for engineer payouts
- Booking checkout flow
- Subscription billing (Starter $0, Pro $19, Studio $49)
- Connect webhook handlers to database updates (TODO comments in webhook file)

### PHASE 4: File Storage
- Supabase Storage buckets:
  - `avatars` - Profile pictures
  - `banners` - Profile banners
  - `audio` - Project files (2GB limit)
  - `products` - Downloadable products (2GB limit)

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app/api/webhooks/stripe/route.ts` | Stripe webhook handler |
| `src/lib/supabase.ts` | Browser Supabase client |
| `src/lib/supabase-server.ts` | Server Supabase client |
| `src/lib/supabase-middleware.ts` | Auth session refresh |
| `src/middleware.ts` | Route protection |
| `.audit-tasks/AUDIT_MASTER_PLAN.md` | 100-checkpoint UI audit |
| `docs/audit/MASTER_AUDIT_SUMMARY.md` | Backend roadmap |

---

## To Test Webhook

**Option 1: Stripe CLI (local)**
```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe trigger checkout.session.completed
```

**Option 2: Check Stripe Dashboard**
- Developers → Events (shows all events)
- Click any event → see delivery status

---

## Notes

1. The `SUPABASE_SERVICE_ROLE_KEY` is set up but not actively used yet - needed for webhook handlers to update database without user session

2. Webhook handler has `TODO` comments where database updates need to be added once schema is created

3. Representative error in Stripe can be ignored - only occurs if trying to add second representative

---

## Starting Fresh Locally

1. Pull the branch:
```bash
git fetch origin claude/setup-mix-experts-local-Z4T1T
git checkout claude/setup-mix-experts-local-Z4T1T
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` with the variables listed above

4. Run dev server:
```bash
npm run dev
```

5. Continue with Phase 1 (database schema)
