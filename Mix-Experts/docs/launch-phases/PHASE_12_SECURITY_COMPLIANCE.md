# PHASE 12: Security Audit & Compliance

**Priority:** CRITICAL
**Estimated Effort:** 4-5 days
**Dependencies:** Phases 1-10 complete

---

## Overview

Phase 12 ensures MixExperts is secure, compliant with privacy regulations, and protected against common web vulnerabilities before public launch. This phase covers database security, API protection, data privacy, and penetration testing.

**Total Stages: 31**

---

## Row-Level Security (RLS) Verification

### Stage 12.1: Verify All RLS Policies Enabled on All Tables

**Objective:** Ensure Row-Level Security is enabled on every public table in Supabase.

**Steps:**
- [ ] Navigate to Supabase Dashboard → Table Editor
- [ ] Check each table for RLS status indicator
- [ ] Run SQL query to verify RLS is enabled on all tables:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

- [ ] Verify `rowsecurity = true` for all tables
- [ ] If any table has `rowsecurity = false`, enable RLS:

```sql
ALTER TABLE public.[table_name] ENABLE ROW LEVEL SECURITY;
```

**Expected Tables with RLS:**
- profiles
- social_links
- portfolio_items
- services
- service_addons
- turnaround_options
- products
- orders
- order_files
- product_purchases
- messages
- testimonials
- credits
- subscriptions
- analytics_events

**Verification:**
- [ ] All tables return `rowsecurity = true`
- [ ] No public tables without RLS policies

---

### Stage 12.2: Test RLS - Unauthenticated User Cannot Access Private Data

**Objective:** Verify that users who are not logged in cannot access private user data.

**Steps:**
- [ ] Create a test script using `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Attempt to query private data without authentication:

```typescript
// Test script: test-rls-unauthenticated.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function testUnauthenticatedAccess() {
  // Try to fetch unpublished profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_published', false)

  console.log('Unpublished profiles:', profiles) // Should be empty
  console.log('Error:', error)

  // Try to fetch orders
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')

  console.log('Orders:', orders) // Should be empty
  console.log('Orders error:', ordersError)

  // Try to fetch product purchases
  const { data: purchases, error: purchasesError } = await supabase
    .from('product_purchases')
    .select('*')

  console.log('Purchases:', purchases) // Should be empty
}

testUnauthenticatedAccess()
```

**Expected Results:**
- [ ] Unpublished profiles: 0 results
- [ ] Orders: 0 results
- [ ] Product purchases: 0 results
- [ ] Messages: 0 results
- [ ] Subscriptions: 0 results

**Verification:**
- [ ] All private data queries return empty arrays
- [ ] No sensitive data is exposed to unauthenticated users

---

### Stage 12.3: Test RLS - User Can Only Access Their Own Data

**Objective:** Verify that authenticated users can only access their own private data.

**Steps:**
- [ ] Create two test accounts in Supabase Auth
- [ ] Authenticate as User A
- [ ] Attempt to access User B's data:

```typescript
// Test script: test-rls-user-isolation.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function testUserIsolation() {
  // Sign in as User A
  await supabase.auth.signInWithPassword({
    email: 'usera@test.com',
    password: 'testpassword'
  })

  const { data: { user: userA } } = await supabase.auth.getUser()
  console.log('Signed in as User A:', userA?.id)

  // Try to access another user's profile (User B's ID)
  const userBId = 'user-b-uuid-here'
  const { data: profileB, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userBId)
    .single()

  console.log('User B profile:', profileB) // Should be null/error
  console.log('Error:', error)

  // Try to access another user's orders
  const { data: ordersB, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('engineer_id', userBId)

  console.log('User B orders:', ordersB) // Should be empty
  console.log('Orders error:', ordersError)

  // Try to update another user's profile
  const { data: updated, error: updateError } = await supabase
    .from('profiles')
    .update({ display_name: 'Hacked!' })
    .eq('id', userBId)

  console.log('Update result:', updated) // Should fail
  console.log('Update error:', updateError)
}

testUserIsolation()
```

**Expected Results:**
- [ ] User A cannot read User B's unpublished profile
- [ ] User A cannot read User B's orders
- [ ] User A cannot update User B's profile
- [ ] User A cannot read User B's messages
- [ ] User A cannot read User B's subscription

**Verification:**
- [ ] All cross-user queries return empty or error
- [ ] Update/delete operations on other users' data fail

---

### Stage 12.4: Test RLS - Published Profiles Are Publicly Accessible

**Objective:** Verify that published profiles and related public data are accessible to everyone.

**Steps:**
- [ ] Create a test profile with `is_published = true`
- [ ] Sign out (unauthenticated request)
- [ ] Attempt to access published profile data:

```typescript
// Test script: test-rls-public-profiles.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function testPublicProfiles() {
  // Ensure not authenticated
  await supabase.auth.signOut()

  // Fetch published profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_published', true)

  console.log('Published profiles:', profiles) // Should return data
  console.log('Error:', error)

  // Fetch portfolio items for published profile
  const profileId = profiles?.[0]?.id
  const { data: portfolio, error: portfolioError } = await supabase
    .from('portfolio_items')
    .select('*')
    .eq('profile_id', profileId)

  console.log('Portfolio items:', portfolio) // Should return data
  console.log('Portfolio error:', portfolioError)

  // Fetch active services for published profile
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .eq('profile_id', profileId)
    .eq('is_active', true)

  console.log('Services:', services) // Should return data
  console.log('Services error:', servicesError)
}

testPublicProfiles()
```

**Expected Results:**
- [ ] Published profiles are accessible
- [ ] Portfolio items for published profiles are accessible
- [ ] Active services for published profiles are accessible
- [ ] Public testimonials are accessible
- [ ] Active products are accessible

**Verification:**
- [ ] All public data queries return expected results
- [ ] Unauthenticated users can view published profiles

---

## API Key & Secret Management

### Stage 12.5: Verify Service Role Key Only Used Server-Side

**Objective:** Ensure the Supabase service role key is never exposed to the client.

**Steps:**
- [ ] Search codebase for `SUPABASE_SERVICE_ROLE_KEY` usage:

```bash
grep -r "SUPABASE_SERVICE_ROLE_KEY" src/
```

- [ ] Verify it's only used in:
  - API routes (`src/app/api/**/route.ts`)
  - Server actions (if any)
  - Server components (with caution)
- [ ] Check it's NEVER used in:
  - Client components
  - `use client` files
  - Public JavaScript bundles

**Verification Script:**

```typescript
// Test: Inspect client bundle for service key
// Build the app and check bundle
npm run build

// Search Next.js client bundles
grep -r "service_role" .next/static/
```

**Expected Results:**
- [ ] Service role key only appears in server-side code
- [ ] No service role key in `.next/static/` bundles
- [ ] No service role key in browser DevTools

**Files Where Service Role Key Should Appear:**
- [ ] `src/app/api/webhooks/stripe/route.ts` (if needed)
- [ ] Any admin API routes
- [ ] Server-only utility files

**Verification:**
- [ ] Service role key is not in client bundles
- [ ] All service role usage is server-side only

---

### Stage 12.6: Verify Anon Key Only Used for Public Operations

**Objective:** Ensure the anon key is only used for operations that respect RLS policies.

**Steps:**
- [ ] Review all Supabase client usage
- [ ] Verify anon key is used with RLS-protected tables
- [ ] Check that all client-side queries respect RLS
- [ ] Confirm no server-side operations use anon key when service role is required

**Verification:**
- [ ] Client-side queries use `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] All anon key queries are subject to RLS policies
- [ ] No admin operations use anon key

---

### Stage 12.7: Check for Exposed Secrets in Codebase

**Objective:** Ensure no API keys, secrets, or credentials are committed to the repository.

**Steps:**
- [ ] Run secret scanning tools:

```bash
# Install gitleaks (if not already installed)
brew install gitleaks

# Scan entire repository history
gitleaks detect --source . --verbose

# Check for common patterns
grep -r "sk_live_" src/
grep -r "pk_live_" src/
grep -r "whsec_" src/
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" src/
```

- [ ] Search for hardcoded secrets:

```bash
# Stripe keys
grep -ri "STRIPE_SECRET_KEY.*=" src/

# Supabase keys
grep -ri "SUPABASE_SERVICE_ROLE_KEY.*=" src/

# Other sensitive patterns
grep -ri "password.*=" src/
grep -ri "secret.*=" src/
grep -ri "api_key.*=" src/
```

**Expected Results:**
- [ ] No hardcoded secrets in source code
- [ ] All secrets referenced via `process.env.*`
- [ ] No secrets in comments or console.logs

**Verification:**
- [ ] Gitleaks report shows 0 issues
- [ ] Manual grep finds no hardcoded credentials
- [ ] All environment variables properly referenced

---

### Stage 12.8: Verify .env.local Is in .gitignore

**Objective:** Ensure environment files are not committed to version control.

**Steps:**
- [ ] Check `.gitignore` contains environment files:

```bash
cat .gitignore | grep -E "\.env"
```

- [ ] Verify `.env.local` is not tracked:

```bash
git status --ignored | grep -E "\.env"
git ls-files | grep -E "\.env"
```

- [ ] Check Git history for accidentally committed env files:

```bash
git log --all --full-history -- "*.env*"
```

**Expected `.gitignore` entries:**
```
.env*
.env.local
.env.development
.env.production
```

**Verification:**
- [ ] `.env.local` is in `.gitignore`
- [ ] No `.env*` files are tracked by Git
- [ ] No env files in Git history (if found, they need to be removed and secrets rotated)

**If env files were committed:**
- [ ] Remove from Git history using `git filter-branch` or BFG Repo-Cleaner
- [ ] Rotate all exposed secrets immediately
- [ ] Update Supabase and Stripe keys
- [ ] Force push cleaned history (if private repo)

---

## API Route Security

### Stage 12.9: Audit All API Routes for Authentication Checks

**Objective:** Ensure all protected API routes verify user authentication.

**Steps:**
- [ ] List all API routes:

```bash
find src/app/api -name "route.ts" -type f
```

- [ ] For each route, verify authentication check:

```typescript
// Example: src/app/api/protected-route/route.ts
import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()

  // Authentication check
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Continue with authorized logic
  // ...
}
```

**Routes That MUST Require Authentication:**
- [ ] Profile update routes
- [ ] Service CRUD routes
- [ ] Product CRUD routes
- [ ] Order management routes
- [ ] Message send routes
- [ ] Subscription management routes
- [ ] Payment intent creation routes
- [ ] File upload routes

**Routes That Should Be Public:**
- [ ] Webhook endpoints (verify via signature instead)
- [ ] Public profile fetch routes
- [ ] Contact/inquiry form submission
- [ ] Username availability check

**Verification:**
- [ ] All protected routes have `auth.getUser()` check
- [ ] Unauthorized requests return 401
- [ ] Public routes are intentionally public

---

### Stage 12.10: Add Rate Limiting to Auth Endpoints

**Objective:** Prevent brute-force attacks on authentication endpoints.

**Steps:**
- [ ] Install rate limiting package:

```bash
npm install @upstash/ratelimit @upstash/redis
```

- [ ] Create rate limiter utility:

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Auth endpoints: 5 requests per 15 minutes
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: 'ratelimit:auth',
})

// Form endpoints: 3 requests per 5 minutes
export const formLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '5 m'),
  analytics: true,
  prefix: 'ratelimit:form',
})
```

- [ ] Apply rate limiting to login endpoint:

```typescript
// src/app/api/auth/login/route.ts
import { authLimiter } from '@/lib/rate-limit'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Get IP address
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'

  // Check rate limit
  const { success, limit, reset, remaining } = await authLimiter.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again later.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    )
  }

  // Continue with login logic
  // ...
}
```

**Endpoints to Rate Limit:**
- [ ] `/api/auth/login` - 5 per 15 min
- [ ] `/api/auth/signup` - 3 per hour
- [ ] `/api/auth/reset-password` - 3 per hour
- [ ] `/api/auth/verify-otp` - 5 per 15 min

**Alternative (if not using Upstash):**
- Use Vercel Edge Config or Vercel KV
- Use in-memory rate limiting for development
- Use Supabase Edge Functions with rate limiting

**Verification:**
- [ ] Rate limiting triggers after threshold
- [ ] 429 response returned with proper headers
- [ ] Legitimate users are not blocked

---

### Stage 12.11: Add Rate Limiting to Contact/Inquiry Forms

**Objective:** Prevent spam and abuse of contact forms.

**Steps:**
- [ ] Apply `formLimiter` to inquiry endpoint:

```typescript
// src/app/api/inquiries/route.ts
import { formLimiter } from '@/lib/rate-limit'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'

  const { success } = await formLimiter.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    )
  }

  // Process inquiry
  // ...
}
```

**Forms to Rate Limit:**
- [ ] Contact form - 3 per 5 min
- [ ] Profile inquiry form - 3 per 5 min
- [ ] Support ticket form - 5 per hour
- [ ] Review submission - 10 per day

**Verification:**
- [ ] Spam submissions are blocked
- [ ] Legitimate inquiries go through
- [ ] User-friendly error message shown

---

### Stage 12.12: Implement CSRF Protection

**Objective:** Prevent Cross-Site Request Forgery attacks.

**Steps:**
- [ ] Verify Next.js CSRF protection is enabled (default in Next.js 13+)
- [ ] For API routes that modify data, verify they:
  - Accept POST/PUT/DELETE only (not GET)
  - Check `Origin` or `Referer` header
  - Use Supabase session cookies (already CSRF-protected)

```typescript
// Example CSRF check in API route
export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL

  if (origin !== allowedOrigin) {
    return NextResponse.json(
      { error: 'Invalid origin' },
      { status: 403 }
    )
  }

  // Continue with request
  // ...
}
```

**Routes to Protect:**
- [ ] All POST/PUT/DELETE API routes
- [ ] Form submission endpoints
- [ ] Payment creation endpoints

**Verification:**
- [ ] Cross-origin POST requests are rejected
- [ ] Same-origin requests work normally
- [ ] Supabase auth uses secure cookies

---

### Stage 12.13: Verify Secure Cookie Settings

**Objective:** Ensure authentication cookies are secure.

**Steps:**
- [ ] Check Supabase cookie configuration in middleware:

```typescript
// src/lib/supabase-middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({
            name,
            value,
            ...options,
            httpOnly: true, // Prevent XSS
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'lax', // CSRF protection
          })
        },
        remove(name: string, options: any) {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          })
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}
```

**Expected Cookie Attributes:**
- [ ] `HttpOnly` - Prevents JavaScript access (XSS protection)
- [ ] `Secure` - HTTPS only in production
- [ ] `SameSite=Lax` - CSRF protection
- [ ] Appropriate `Max-Age` or `Expires`

**Verification:**
- [ ] Inspect cookies in browser DevTools
- [ ] Verify `HttpOnly` flag is set
- [ ] Verify `Secure` flag in production
- [ ] Verify `SameSite` attribute

---

## Security Headers

### Stage 12.14: Set Appropriate CORS Headers

**Objective:** Control which domains can access the API.

**Steps:**
- [ ] Configure CORS in `next.config.ts`:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

**Verification:**
- [ ] API routes only accept requests from allowed origin
- [ ] Preflight OPTIONS requests work
- [ ] Credentials are allowed for authenticated requests

---

### Stage 12.15: Add Content Security Policy Headers

**Objective:** Prevent XSS and data injection attacks.

**Steps:**
- [ ] Add CSP headers to `next.config.ts`:

```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://images.unsplash.com https://*.supabase.co;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  connect-src 'self' https://*.supabase.co https://api.stripe.com;
  media-src 'self' https://*.supabase.co;
  worker-src 'self' blob:;
`

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};
```

**CSP Directives:**
- [ ] `default-src 'self'` - Only load resources from same origin
- [ ] `script-src` - Allow scripts from trusted sources (Stripe, etc.)
- [ ] `img-src` - Allow images from Supabase storage, Unsplash
- [ ] `connect-src` - Allow API calls to Supabase, Stripe
- [ ] `frame-ancestors 'none'` - Prevent clickjacking

**Verification:**
- [ ] Check CSP header in browser DevTools → Network
- [ ] Verify no CSP violations in console
- [ ] Test with CSP report-only mode first

---

### Stage 12.16: Add X-Frame-Options Header

**Objective:** Prevent clickjacking attacks.

**Steps:**
- [ ] Add X-Frame-Options to `next.config.ts`:

```typescript
{
  key: 'X-Frame-Options',
  value: 'DENY',
}
```

**Options:**
- `DENY` - Page cannot be framed at all
- `SAMEORIGIN` - Page can only be framed by same origin
- `ALLOW-FROM uri` - Page can be framed by specified URI (deprecated)

**Verification:**
- [ ] Header present in response
- [ ] Page cannot be embedded in iframe from other domains

---

### Stage 12.17: Add X-Content-Type-Options Header

**Objective:** Prevent MIME type sniffing.

**Steps:**
- [ ] Add X-Content-Type-Options to `next.config.ts`:

```typescript
{
  key: 'X-Content-Type-Options',
  value: 'nosniff',
}
```

**Verification:**
- [ ] Header present in response
- [ ] Browser respects declared Content-Type

---

### Stage 12.18: Verify HTTPS Only in Production

**Objective:** Ensure all production traffic uses HTTPS.

**Steps:**
- [ ] Add Strict-Transport-Security header (HSTS):

```typescript
{
  key: 'Strict-Transport-Security',
  value: 'max-age=31536000; includeSubDomains; preload',
}
```

- [ ] Configure automatic HTTPS redirect in Vercel/hosting platform
- [ ] Verify all environment variables use `https://` URLs in production

**Verification:**
- [ ] Production site redirects HTTP to HTTPS
- [ ] HSTS header present in production
- [ ] Mixed content warnings resolved
- [ ] All API calls use HTTPS

**Checklist:**
- [ ] `NEXT_PUBLIC_SITE_URL` uses `https://` in production
- [ ] Supabase URL uses `https://`
- [ ] All external API calls use `https://`
- [ ] No hardcoded `http://` URLs in code

---

## Input Validation & Sanitization

### Stage 12.19: Implement Input Validation on All Forms

**Objective:** Validate and sanitize all user inputs.

**Steps:**
- [ ] Install validation library:

```bash
npm install zod
```

- [ ] Create validation schemas for all forms:

```typescript
// src/lib/validations.ts
import { z } from 'zod'

export const profileSchema = z.object({
  display_name: z.string().min(2).max(50).trim(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  bio: z.string().max(500).trim().optional(),
  email: z.string().email(),
  avatar_url: z.string().url().optional(),
  tagline: z.string().max(100).trim().optional(),
})

export const serviceSchema = z.object({
  name: z.string().min(3).max(100).trim(),
  description: z.string().max(2000).trim(),
  base_price: z.number().positive().max(100000),
  turnaround_days: z.number().int().positive().max(365),
  revision_count: z.number().int().nonnegative().max(10),
})

export const inquirySchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email(),
  message: z.string().min(10).max(2000).trim(),
  profile_id: z.string().uuid(),
})

export const orderSchema = z.object({
  service_id: z.string().uuid(),
  client_email: z.string().email(),
  client_name: z.string().min(2).max(100).trim(),
  notes: z.string().max(2000).trim().optional(),
  requirements: z.string().max(2000).trim().optional(),
})
```

- [ ] Apply validation in API routes:

```typescript
// Example: src/app/api/profiles/route.ts
import { profileSchema } from '@/lib/validations'

export async function PUT(request: Request) {
  const body = await request.json()

  // Validate input
  const validation = profileSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.issues },
      { status: 400 }
    )
  }

  const validatedData = validation.data

  // Continue with validated data
  // ...
}
```

**Forms to Validate:**
- [ ] Profile update form
- [ ] Service creation/edit form
- [ ] Product creation/edit form
- [ ] Inquiry/contact form
- [ ] Order/booking form
- [ ] Message send form
- [ ] Review submission form

**Validation Rules:**
- [ ] String length limits enforced
- [ ] Email format validation
- [ ] URL format validation
- [ ] Number ranges validated
- [ ] Required fields checked
- [ ] Special characters escaped

**Verification:**
- [ ] Invalid inputs are rejected with 400 error
- [ ] Validation errors are user-friendly
- [ ] No unvalidated data reaches database

---

### Stage 12.20: Sanitize User-Generated Content

**Objective:** Remove potentially harmful content from user inputs.

**Steps:**
- [ ] Install sanitization library:

```bash
npm install dompurify isomorphic-dompurify
```

- [ ] Create sanitization utility:

```typescript
// src/lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  })
}

export function sanitizeText(text: string): string {
  // Remove HTML tags entirely
  return text.replace(/<[^>]*>/g, '').trim()
}

export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString()
    }
    return null
  } catch {
    return null
  }
}
```

- [ ] Apply sanitization before saving:

```typescript
// Example: Sanitize bio before saving
import { sanitizeHtml, sanitizeText, sanitizeUrl } from '@/lib/sanitize'

const sanitizedProfile = {
  display_name: sanitizeText(profileData.display_name),
  bio: sanitizeHtml(profileData.bio),
  tagline: sanitizeText(profileData.tagline),
  avatar_url: sanitizeUrl(profileData.avatar_url),
}
```

**Fields to Sanitize:**
- [ ] Profile bio (allow limited HTML)
- [ ] Service descriptions (allow limited HTML)
- [ ] Message bodies (allow limited HTML)
- [ ] Review content (plain text only)
- [ ] Product descriptions (allow limited HTML)
- [ ] All URLs (protocol validation)

**Verification:**
- [ ] XSS payloads are neutralized
- [ ] JavaScript in inputs is removed
- [ ] Legitimate content is preserved

---

### Stage 12.21: Prevent XSS in Displayed Content

**Objective:** Safely render user-generated content.

**Steps:**
- [ ] Use React's built-in XSS protection (JSX auto-escapes)
- [ ] For rendering HTML content, use `dangerouslySetInnerHTML` with sanitized content only:

```typescript
// Safe HTML rendering
import { sanitizeHtml } from '@/lib/sanitize'

function ProfileBio({ bio }: { bio: string }) {
  const sanitizedBio = sanitizeHtml(bio)

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedBio }}
      className="prose"
    />
  )
}
```

- [ ] Never render unsanitized user input:

```typescript
// BAD - XSS vulnerable
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// GOOD - Auto-escaped
<div>{userInput}</div>

// GOOD - Sanitized HTML
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userInput) }} />
```

**Components to Audit:**
- [ ] Profile bio display
- [ ] Service description display
- [ ] Product description display
- [ ] Message display
- [ ] Review display
- [ ] Any user-generated content

**Verification:**
- [ ] Test with XSS payloads (e.g., `<script>alert('XSS')</script>`)
- [ ] Verify scripts don't execute
- [ ] Check browser console for errors

---

### Stage 12.22: Verify SQL Injection Protection (Parameterized Queries)

**Objective:** Ensure all database queries use parameterized inputs.

**Steps:**
- [ ] Verify Supabase client uses parameterized queries (it does by default)
- [ ] Audit any raw SQL queries for proper parameterization:

```typescript
// GOOD - Parameterized query (Supabase default)
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('username', userInput)

// BAD - String concatenation (never do this)
const query = `SELECT * FROM profiles WHERE username = '${userInput}'`

// GOOD - Parameterized raw SQL (if needed)
const { data } = await supabase.rpc('custom_function', {
  search_term: userInput,
})
```

- [ ] Check for any `.query()` or raw SQL usage
- [ ] Verify all user inputs are parameterized

**Verification:**
- [ ] All queries use Supabase query builder OR parameterized inputs
- [ ] No string concatenation in SQL queries
- [ ] Test with SQL injection payloads (e.g., `' OR '1'='1`)

---

## File Upload Security

### Stage 12.23: Audit File Upload Validation

**Objective:** Ensure file uploads are properly validated and secured.

**Steps:**
- [ ] Review file upload implementation:

```typescript
// src/app/api/upload/route.ts
import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

const ALLOWED_TYPES = {
  avatar: ['image/jpeg', 'image/png', 'image/webp'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/wave', 'audio/x-wav'],
  product: ['application/zip', 'audio/mpeg', 'audio/wav'],
}

const MAX_SIZES = {
  avatar: 5 * 1024 * 1024, // 5MB
  audio: 100 * 1024 * 1024, // 100MB
  product: 500 * 1024 * 1024, // 500MB
}

export async function POST(request: Request) {
  const formData = await request.FormData()
  const file = formData.get('file') as File
  const type = formData.get('type') as string

  // Authenticate user
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Validate file exists
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Validate file type
  if (!ALLOWED_TYPES[type]?.includes(file.type)) {
    return NextResponse.json(
      { error: `Invalid file type. Allowed: ${ALLOWED_TYPES[type].join(', ')}` },
      { status: 400 }
    )
  }

  // Validate file size
  if (file.size > MAX_SIZES[type]) {
    return NextResponse.json(
      { error: `File too large. Max size: ${MAX_SIZES[type] / 1024 / 1024}MB` },
      { status: 400 }
    )
  }

  // Validate file name (prevent path traversal)
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '')

  // Generate unique file path
  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}/${Date.now()}_${safeName}`

  // Upload to Supabase Storage
  const { data, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ path: data.path })
}
```

**Validation Checklist:**
- [ ] File type validation (MIME type)
- [ ] File size validation
- [ ] File name sanitization
- [ ] User authentication
- [ ] Unique file naming
- [ ] Proper storage bucket
- [ ] Content-Type header set

**Verification:**
- [ ] Upload with invalid file type is rejected
- [ ] Upload exceeding size limit is rejected
- [ ] Malicious file names are sanitized
- [ ] Unauthenticated uploads are rejected

---

### Stage 12.24: Limit File Sizes Appropriately

**Objective:** Prevent disk space abuse and DoS attacks.

**Steps:**
- [ ] Configure Supabase Storage bucket size limits in dashboard
- [ ] Enforce size limits in API routes (shown above)
- [ ] Configure Next.js max request body size:

```typescript
// next.config.ts
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb', // Max request size
    },
  },
}
```

**Recommended Limits:**
- [ ] Avatar images: 5MB
- [ ] Banner images: 10MB
- [ ] Portfolio audio: 100MB
- [ ] Portfolio images: 10MB
- [ ] Product files: 500MB
- [ ] Product previews: 50MB
- [ ] Order delivery files: 2GB

**Verification:**
- [ ] Oversized files are rejected
- [ ] Error message explains size limit
- [ ] File upload progress shown for large files

---

### Stage 12.25: Validate File Types on Upload

**Objective:** Prevent upload of executable files and malware.

**Steps:**
- [ ] Validate MIME type (shown in Stage 12.23)
- [ ] Validate file extension:

```typescript
const ALLOWED_EXTENSIONS = {
  avatar: ['.jpg', '.jpeg', '.png', '.webp'],
  audio: ['.mp3', '.wav'],
  product: ['.zip', '.mp3', '.wav'],
}

const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`

if (!ALLOWED_EXTENSIONS[type]?.includes(fileExt)) {
  return NextResponse.json(
    { error: `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS[type].join(', ')}` },
    { status: 400 }
  )
}
```

- [ ] For advanced validation, verify file magic bytes (file signature)
- [ ] Scan uploaded files for malware (if applicable)

**Disallowed File Types:**
- [ ] `.exe`, `.bat`, `.sh`, `.cmd`
- [ ] `.js`, `.ts` (as uploads)
- [ ] `.php`, `.asp`, `.jsp`
- [ ] `.svg` (can contain scripts, use with caution)

**Verification:**
- [ ] Executable files are rejected
- [ ] Renamed malicious files are detected (e.g., `virus.exe` renamed to `virus.jpg`)
- [ ] Only expected file types are accepted

---

## Authentication & Account Security

### Stage 12.26: Implement Account Lockout After Failed Attempts

**Objective:** Prevent brute-force attacks on user accounts.

**Steps:**
- [ ] Configure Supabase Auth settings:
  - Go to Supabase Dashboard → Authentication → Settings
  - Enable "Secure password" (min 8 chars, complexity requirements)
  - Consider rate limiting (handled in Stage 12.10)

- [ ] Implement server-side lockout tracking:

```typescript
// src/lib/account-lockout.ts
import { createClient } from '@/lib/supabase-server'

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

export async function checkAccountLockout(email: string): Promise<boolean> {
  const supabase = createClient()

  // Fetch failed attempts from database
  const { data } = await supabase
    .from('failed_login_attempts')
    .select('*')
    .eq('email', email)
    .gte('created_at', new Date(Date.now() - LOCKOUT_DURATION).toISOString())

  return (data?.length || 0) >= MAX_FAILED_ATTEMPTS
}

export async function recordFailedAttempt(email: string): Promise<void> {
  const supabase = createClient()

  await supabase
    .from('failed_login_attempts')
    .insert({
      email,
      created_at: new Date().toISOString(),
    })
}

export async function clearFailedAttempts(email: string): Promise<void> {
  const supabase = createClient()

  await supabase
    .from('failed_login_attempts')
    .delete()
    .eq('email', email)
}
```

- [ ] Create `failed_login_attempts` table:

```sql
CREATE TABLE public.failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_failed_attempts_email ON failed_login_attempts(email, created_at);
```

- [ ] Apply to login route:

```typescript
// src/app/api/auth/login/route.ts
import { checkAccountLockout, recordFailedAttempt, clearFailedAttempts } from '@/lib/account-lockout'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // Check lockout
  const isLockedOut = await checkAccountLockout(email)

  if (isLockedOut) {
    return NextResponse.json(
      { error: 'Account temporarily locked due to too many failed attempts. Try again in 15 minutes.' },
      { status: 429 }
    )
  }

  // Attempt login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Record failed attempt
    await recordFailedAttempt(email)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  // Clear failed attempts on success
  await clearFailedAttempts(email)

  return NextResponse.json({ user: data.user })
}
```

**Verification:**
- [ ] 5 failed login attempts trigger lockout
- [ ] Lockout lasts 15 minutes
- [ ] Successful login clears failed attempts
- [ ] User is notified of lockout

---

### Stage 12.27: Add Suspicious Activity Logging

**Objective:** Log security-relevant events for auditing.

**Steps:**
- [ ] Create security events table:

```sql
CREATE TABLE public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'login_success', 'login_failed', 'password_reset_requested',
    'password_changed', 'email_changed', 'account_locked',
    'suspicious_activity', 'unauthorized_access_attempt'
  )),
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_security_events_user ON security_events(user_id, created_at DESC);
CREATE INDEX idx_security_events_type ON security_events(event_type, created_at DESC);
```

- [ ] Create logging utility:

```typescript
// src/lib/security-log.ts
import { createClient } from '@/lib/supabase-server'

export async function logSecurityEvent(
  userId: string | null,
  eventType: string,
  metadata: any = {},
  request?: Request
) {
  const supabase = createClient()

  const ip = request?.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request?.headers.get('user-agent') || 'unknown'

  await supabase.from('security_events').insert({
    user_id: userId,
    event_type: eventType,
    ip_address: ip,
    user_agent: userAgent,
    metadata,
  })
}
```

- [ ] Log important events:

```typescript
// Example: Log login success
await logSecurityEvent(user.id, 'login_success', {}, request)

// Example: Log failed login
await logSecurityEvent(null, 'login_failed', { email }, request)

// Example: Log password change
await logSecurityEvent(user.id, 'password_changed', {}, request)

// Example: Log suspicious activity
await logSecurityEvent(user.id, 'suspicious_activity', {
  reason: 'Multiple rapid API calls',
  endpoint: '/api/orders',
}, request)
```

**Events to Log:**
- [ ] Login success/failure
- [ ] Password reset requests
- [ ] Password changes
- [ ] Email changes
- [ ] Account lockouts
- [ ] Unauthorized API access attempts
- [ ] Suspicious rate limiting triggers
- [ ] Admin actions (if applicable)

**Verification:**
- [ ] Events are logged in database
- [ ] Log includes IP, user agent, timestamp
- [ ] Logs are queryable for auditing

---

## GDPR & Privacy Compliance

### Stage 12.28: Create Data Export Functionality (GDPR)

**Objective:** Allow users to export their personal data (GDPR Article 15 - Right of Access).

**Steps:**
- [ ] Create data export API route:

```typescript
// src/app/api/user/export/route.ts
import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch all user data
  const [profile, services, products, orders, messages, purchases] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('services').select('*').eq('profile_id', user.id),
    supabase.from('products').select('*').eq('profile_id', user.id),
    supabase.from('orders').select('*').or(`engineer_id.eq.${user.id},client_id.eq.${user.id}`),
    supabase.from('messages').select('*').or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`),
    supabase.from('product_purchases').select('*').eq('buyer_id', user.id),
  ])

  const exportData = {
    export_date: new Date().toISOString(),
    user_id: user.id,
    profile: profile.data,
    services: services.data,
    products: products.data,
    orders: orders.data,
    messages: messages.data,
    purchases: purchases.data,
  }

  return NextResponse.json(exportData, {
    headers: {
      'Content-Disposition': `attachment; filename="mixexperts-data-${user.id}.json"`,
      'Content-Type': 'application/json',
    },
  })
}
```

- [ ] Add UI in settings:

```typescript
// src/app/dashboard/settings/privacy/page.tsx
'use client'

export default function PrivacySettings() {
  const handleExportData = async () => {
    const response = await fetch('/api/user/export')
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mixexperts-data-${Date.now()}.json`
    a.click()
  }

  return (
    <div>
      <h2>Privacy & Data</h2>
      <button onClick={handleExportData}>
        Export My Data
      </button>
    </div>
  )
}
```

**Data to Include in Export:**
- [ ] Profile information
- [ ] Services
- [ ] Products
- [ ] Orders (as buyer and seller)
- [ ] Messages
- [ ] Purchases
- [ ] Analytics events
- [ ] Subscription history

**Verification:**
- [ ] Export contains all user data
- [ ] Export is in machine-readable format (JSON)
- [ ] Download works in browser

---

### Stage 12.29: Create Account Deletion Flow (GDPR)

**Objective:** Allow users to delete their account and data (GDPR Article 17 - Right to Erasure).

**Steps:**
- [ ] Create account deletion API route:

```typescript
// src/app/api/user/delete/route.ts
import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  const supabase = createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check for active orders
  const { data: activeOrders } = await supabase
    .from('orders')
    .select('id')
    .eq('engineer_id', user.id)
    .in('status', ['pending', 'confirmed', 'in_progress', 'review', 'revision'])

  if (activeOrders && activeOrders.length > 0) {
    return NextResponse.json(
      { error: 'Cannot delete account with active orders. Please complete or cancel all orders first.' },
      { status: 400 }
    )
  }

  // Delete user data (cascade deletes will handle related records)
  // Note: Supabase will handle cascade deletes based on foreign key constraints

  // Delete storage files
  const buckets = ['avatars', 'banners', 'portfolio-audio', 'portfolio-images', 'products', 'order-files']

  for (const bucket of buckets) {
    const { data: files } = await supabase.storage
      .from(bucket)
      .list(user.id)

    if (files && files.length > 0) {
      const filePaths = files.map(f => `${user.id}/${f.name}`)
      await supabase.storage.from(bucket).remove(filePaths)
    }
  }

  // Cancel Stripe subscription if active
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, stripe_account_id')
    .eq('id', user.id)
    .single()

  // TODO: Call Stripe API to cancel subscription and disconnect account

  // Delete auth user (this will cascade delete profile and related data)
  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

  if (deleteError) {
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'Account deleted successfully' })
}
```

- [ ] Add UI with confirmation:

```typescript
// src/app/dashboard/settings/delete-account/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteAccount() {
  const [confirmText, setConfirmText] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (confirmText !== 'DELETE MY ACCOUNT') {
      alert('Please type the confirmation text correctly')
      return
    }

    setLoading(true)

    const response = await fetch('/api/user/delete', {
      method: 'DELETE',
    })

    if (response.ok) {
      router.push('/?deleted=true')
    } else {
      const { error } = await response.json()
      alert(error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-red-600">Delete Account</h2>
      <p className="text-gray-600 mt-2">
        This action is permanent and cannot be undone. All your data will be deleted.
      </p>

      <div className="mt-6">
        <label>Type "DELETE MY ACCOUNT" to confirm:</label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full border p-2 mt-2"
        />
      </div>

      <button
        onClick={handleDelete}
        disabled={loading || confirmText !== 'DELETE MY ACCOUNT'}
        className="mt-4 bg-red-600 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Deleting...' : 'Delete My Account'}
      </button>
    </div>
  )
}
```

**Deletion Checklist:**
- [ ] Check for active orders (prevent deletion if any)
- [ ] Delete all user data from database (cascade)
- [ ] Delete all uploaded files from storage
- [ ] Cancel Stripe subscription
- [ ] Disconnect Stripe Connect account
- [ ] Delete auth user
- [ ] Sign user out
- [ ] Show confirmation

**Data to Delete:**
- [ ] Profile record
- [ ] Services
- [ ] Products
- [ ] Portfolio items
- [ ] Messages (anonymize or delete)
- [ ] Orders (keep for tax purposes but anonymize user data)
- [ ] File uploads
- [ ] Analytics events (anonymize)

**Legal Considerations:**
- [ ] Retain order data for tax compliance (anonymize user info)
- [ ] Notify user of retention policies
- [ ] Document deletion process

**Verification:**
- [ ] Account deletion works
- [ ] All user data is removed/anonymized
- [ ] Storage files are deleted
- [ ] User cannot log in after deletion

---

### Stage 12.30: Document Security Measures

**Objective:** Create documentation of all security measures for compliance and transparency.

**Steps:**
- [ ] Create security documentation file:

```markdown
# MixExperts Security & Privacy Documentation

## Last Updated
[Date]

## Security Measures

### 1. Authentication & Authorization
- Supabase Auth for authentication
- Row-Level Security (RLS) policies on all tables
- Session-based authentication with secure cookies
- Account lockout after 5 failed login attempts

### 2. Data Protection
- All data encrypted in transit (HTTPS)
- All data encrypted at rest (Supabase encryption)
- Secure cookie settings (HttpOnly, Secure, SameSite)
- Database backups enabled

### 3. Input Validation
- Zod validation on all form inputs
- DOMPurify sanitization for user-generated content
- File type and size validation on uploads
- SQL injection protection via parameterized queries

### 4. API Security
- Rate limiting on auth and form endpoints
- CSRF protection via SameSite cookies
- Authentication required for protected routes
- Rate limiting: 5 login attempts per 15 minutes

### 5. Security Headers
- Content-Security-Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)
- CORS headers configured

### 6. File Upload Security
- File type validation (MIME + extension)
- File size limits enforced
- Malicious file name sanitization
- Separate storage buckets with RLS policies

### 7. Monitoring & Logging
- Security event logging
- Failed login attempt tracking
- Suspicious activity detection
- Audit trail for sensitive operations

### 8. GDPR Compliance
- Data export functionality
- Account deletion functionality
- Privacy policy published
- Terms of service published

### 9. Payment Security
- PCI compliance via Stripe
- No credit card data stored
- Stripe webhook signature verification
- Secure API key management

### 10. Third-Party Dependencies
- Regular dependency updates
- Vulnerability scanning
- No sensitive data sent to third parties without consent

## Incident Response Plan

### In Case of Security Breach
1. Immediately revoke compromised credentials
2. Assess scope of breach
3. Notify affected users within 72 hours (GDPR requirement)
4. Document incident
5. Implement fixes
6. Report to authorities if required

### Contact
Security issues: security@mixexperts.com

## Compliance

### GDPR (EU)
- Right to access: Data export feature
- Right to erasure: Account deletion feature
- Right to rectification: Profile edit functionality
- Privacy policy: [Link]

### CCPA (California)
- Disclosure of data collection
- Right to delete
- Opt-out of data sale (not applicable, we don't sell data)

### PCI DSS
- Level 4 compliance via Stripe integration
- No card data stored on our servers

## Regular Security Tasks

### Weekly
- Review failed login attempts
- Check for suspicious activity

### Monthly
- Update dependencies
- Review security logs
- Test backups

### Quarterly
- Security audit
- Penetration testing
- Review and update policies

### Annually
- Full security assessment
- Third-party security audit
- Update privacy policy
```

- [ ] Save to `/docs/SECURITY.md`
- [ ] Add security policy to repo
- [ ] Link from README

**Verification:**
- [ ] Documentation is complete
- [ ] Security policy is published
- [ ] Team is aware of security practices

---

### Stage 12.31: Perform Penetration Testing

**Objective:** Identify security vulnerabilities before launch.

**Steps:**
- [ ] Prepare testing environment:
  - Use staging environment
  - Create test accounts
  - Populate with sample data

- [ ] Automated vulnerability scanning:

```bash
# Install OWASP ZAP or similar
npm install -g @lhci/cli # Lighthouse CI for security headers

# Run Lighthouse security audit
lhci autorun --url=https://staging.mixexperts.com
```

- [ ] Manual penetration testing checklist:

**Authentication & Session Management:**
- [ ] Test password reset flow for account takeover
- [ ] Test session fixation
- [ ] Test session timeout
- [ ] Test concurrent sessions
- [ ] Test logout on all devices

**Authorization & Access Control:**
- [ ] Test vertical privilege escalation (user → admin)
- [ ] Test horizontal privilege escalation (user A → user B)
- [ ] Test IDOR (Insecure Direct Object Reference) on API routes
- [ ] Test file access bypass
- [ ] Test RLS policy bypass attempts

**Input Validation:**
- [ ] Test XSS in all input fields
- [ ] Test SQL injection in all inputs
- [ ] Test command injection
- [ ] Test path traversal in file uploads
- [ ] Test XML/JSON injection

**Business Logic:**
- [ ] Test negative prices
- [ ] Test price manipulation in checkout
- [ ] Test free service booking
- [ ] Test race conditions in order creation
- [ ] Test refund abuse

**API Security:**
- [ ] Test rate limiting bypass
- [ ] Test CORS policy
- [ ] Test API authentication bypass
- [ ] Test mass assignment vulnerabilities
- [ ] Test parameter pollution

**File Upload:**
- [ ] Upload executable files (`.exe`, `.sh`)
- [ ] Upload oversized files
- [ ] Upload files with malicious names (`../../etc/passwd`)
- [ ] Upload polyglot files (file that's both image and script)
- [ ] Test file access control bypass

**Payment Security:**
- [ ] Test Stripe webhook signature verification
- [ ] Test payment amount tampering
- [ ] Test free checkout
- [ ] Test refund flow

**Infrastructure:**
- [ ] Test for sensitive data exposure in responses
- [ ] Test for verbose error messages
- [ ] Test for information disclosure in headers
- [ ] Test for backup files (`/backup.zip`, `/.git`)
- [ ] Test for admin panels (`/admin`, `/dashboard`)

- [ ] Use automated tools:

```bash
# Nikto web server scanner
nikto -h https://staging.mixexperts.com

# Nmap port scan
nmap -sV staging.mixexperts.com

# OWASP Dependency Check
npm audit
npm audit fix
```

- [ ] Document findings:

```markdown
# Penetration Test Report

## Date
[Date]

## Tested By
[Name/Organization]

## Scope
- Application: MixExperts
- Environment: Staging
- URLs: https://staging.mixexperts.com

## Methodology
- OWASP Top 10
- Manual testing
- Automated scanning

## Findings

### High Severity
[None found / List issues]

### Medium Severity
[List issues]

### Low Severity
[List issues]

### Informational
[List observations]

## Recommendations
1. [Fix 1]
2. [Fix 2]
3. [Fix 3]

## Conclusion
[Overall security posture assessment]
```

**Verification:**
- [ ] All high/medium vulnerabilities fixed
- [ ] Low vulnerabilities documented
- [ ] Retest after fixes
- [ ] Penetration test report filed

---

## Final Security Checklist

Before marking Phase 12 complete, verify:

### Database Security
- [ ] RLS enabled on all tables
- [ ] RLS policies tested and working
- [ ] Service role key used server-side only
- [ ] Anon key respects RLS policies

### Secrets Management
- [ ] No hardcoded secrets in code
- [ ] `.env.local` in `.gitignore`
- [ ] No secrets in Git history
- [ ] Environment variables properly configured

### API Security
- [ ] All protected routes check authentication
- [ ] Rate limiting on auth endpoints
- [ ] Rate limiting on form endpoints
- [ ] CSRF protection enabled
- [ ] CORS configured correctly

### Headers & HTTPS
- [ ] CSP header configured
- [ ] X-Frame-Options set
- [ ] X-Content-Type-Options set
- [ ] HSTS enabled in production
- [ ] HTTPS enforced in production

### Input Validation
- [ ] All forms use Zod validation
- [ ] User content sanitized with DOMPurify
- [ ] XSS prevention verified
- [ ] SQL injection protection verified

### File Uploads
- [ ] File type validation
- [ ] File size limits
- [ ] File name sanitization
- [ ] Storage bucket RLS policies

### Account Security
- [ ] Account lockout after failed attempts
- [ ] Suspicious activity logging
- [ ] Security events logged

### Privacy & Compliance
- [ ] Data export functionality
- [ ] Account deletion functionality
- [ ] Security documentation
- [ ] Privacy policy published

### Testing
- [ ] Penetration testing completed
- [ ] Vulnerabilities addressed
- [ ] Security audit passed

---

## Post-Launch Security Maintenance

### Ongoing Tasks
- **Daily:** Monitor security event logs
- **Weekly:** Review failed login attempts
- **Monthly:** Update dependencies, review audit logs
- **Quarterly:** Penetration testing, security training
- **Annually:** Third-party security audit, policy review

### Incident Response
- Document security incident response plan
- Designate security point of contact
- Establish breach notification procedures

---

**Phase 12 Complete!**

MixExperts is now secured and compliant, ready for public launch.

**Next:** Proceed to final deployment and launch monitoring.
