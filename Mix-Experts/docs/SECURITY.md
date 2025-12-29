# MixExperts Security & Privacy Documentation

## Last Updated
December 28, 2024

## Overview

This document outlines the security measures implemented in MixExperts to protect user data and ensure compliance with privacy regulations.

---

## Authentication & Authorization

### Supabase Auth
- Authentication handled by Supabase Auth (industry-standard)
- Email/password authentication with secure password hashing (bcrypt)
- Session-based authentication with secure cookies
- JWT tokens for API authentication

### Row-Level Security (RLS)
- RLS enabled on all database tables
- Users can only access their own private data
- Public data (published profiles) accessible to all
- Service role key used only for server-side operations

### Session Security
- Cookies configured with:
  - `HttpOnly` - Prevents JavaScript access (XSS protection)
  - `Secure` - HTTPS only in production
  - `SameSite=Lax` - CSRF protection
- Session tokens automatically refreshed

---

## API Security

### Route Protection
All protected API routes require authentication:
- `/api/orders/*` - Requires authentication + ownership verification
- `/api/services/*` - Requires authentication + ownership verification
- `/api/products/download` - Requires authentication + purchase verification
- `/api/messages/*` - Requires authentication
- `/api/user/*` - Requires authentication

### Public Endpoints (with protections)
- `/api/webhooks/stripe` - Webhook signature verification
- `/api/inquiries/submit` - Rate limiting + origin validation + content sanitization
- `/api/checkout/create-session` - Rate limiting + origin validation

### Rate Limiting
In-memory rate limiting implemented (`src/lib/rate-limit.ts`):
- Inquiry forms: 3 requests per 10 minutes per IP
- Checkout: 10 requests per 5 minutes per IP
- General API: 100 requests per minute per IP

### Origin/CSRF Protection
- Origin header validation on public endpoints
- Referer header fallback check
- Suspicious content detection (SQL injection, XSS patterns)

### Input Validation
- All inputs validated using Zod schemas (`src/lib/validations.ts`)
- Validation includes:
  - Type checking
  - Length limits
  - Format validation (email, URL, etc.)
  - Enum validation where applicable

### Content Sanitization
- User-generated content sanitized using DOMPurify (`src/lib/sanitize.ts`)
- HTML tags stripped or filtered based on context
- URL validation ensures only http/https protocols
- File names sanitized to prevent path traversal

### Open Redirect Prevention
- Auth callback validates redirect paths against whitelist
- Only allows internal dashboard paths
- Prevents `//` and protocol-based redirects

### Error Response Security
- Internal error details never exposed to clients
- Generic error messages returned for 500 errors
- Stack traces only logged server-side

---

## Security Headers

Configured in `next.config.ts`:

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Security-Policy | Strict CSP | Prevents XSS, data injection |
| X-Frame-Options | DENY | Prevents clickjacking |
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| Strict-Transport-Security | max-age=31536000 | Forces HTTPS |
| Referrer-Policy | strict-origin-when-cross-origin | Controls referrer info |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Restricts browser features |

### Content Security Policy Details
- `default-src 'self'` - Only load resources from same origin
- `script-src` - Allows Stripe.js and necessary inline scripts
- `img-src` - Allows Supabase storage and Unsplash
- `connect-src` - Allows Supabase API and Stripe API
- `frame-src` - Allows Stripe iframes for payment
- `frame-ancestors 'none'` - Prevents embedding in iframes

---

## Data Protection

### Encryption
- All data encrypted in transit (TLS 1.3)
- Database encrypted at rest (Supabase)
- Supabase Storage encrypted at rest

### Sensitive Data Handling
- No credit card data stored (handled by Stripe)
- API keys stored in environment variables only
- Service role key never exposed to client
- Passwords never logged or stored in plain text

### Environment Variables
- `.env*` files in `.gitignore`
- Never committed to version control
- Separate keys for development/production

---

## File Upload Security

### Validation
- File type validation (MIME type + extension)
- File size limits enforced:
  - Avatars: 5MB
  - Audio files: 100MB
  - Product files: 500MB
- File names sanitized (path traversal prevention)

### Storage
- Files stored in Supabase Storage buckets
- Each bucket has appropriate RLS policies
- Signed URLs for private file access
- Download limits enforced for products

---

## Payment Security

### Stripe Integration
- PCI DSS compliant via Stripe
- No card data touches our servers
- Stripe.js handles all payment UI
- Webhook signature verification for all events

### Connect Security
- Stripe Connect for engineer payouts
- Identity verification handled by Stripe
- Express accounts for simplified onboarding

---

## GDPR Compliance

### Right of Access (Article 15)
- Data export endpoint: `GET /api/user/export`
- Exports all user data as JSON file
- Includes: profile, services, products, orders, messages, purchases

### Right to Erasure (Article 17)
- Account deletion endpoint: `DELETE /api/user/delete`
- Requires confirmation text
- Prevents deletion with active orders
- Deletes:
  - Profile and all associated data
  - Uploaded files from storage
  - Cancels active subscriptions
- Anonymizes:
  - Messages (for other users' history)
  - Completed orders (for tax purposes)

### Data Retention
- Completed orders retained (anonymized) for tax compliance
- Messages from deleted users anonymized
- All other data fully deleted

---

## Monitoring & Logging

### Server Logs
- API errors logged (without sensitive data)
- Failed authentication attempts tracked
- Webhook processing logged

### Recommended Additions
- Security event logging table
- Failed login attempt tracking
- Suspicious activity alerts

---

## Incident Response

### In Case of Security Breach
1. Immediately revoke compromised credentials
2. Assess scope of breach
3. Notify affected users within 72 hours (GDPR requirement)
4. Document incident
5. Implement fixes
6. Report to authorities if required

### Contact
Security issues: security@mixexperts.com

---

## Regular Security Tasks

### Weekly
- Review failed login attempts
- Check for suspicious activity in logs

### Monthly
- Update dependencies (`npm audit`)
- Review security logs
- Test backup restoration

### Quarterly
- Security audit
- Dependency vulnerability scan
- Review and update policies

### Annually
- Full security assessment
- Third-party security audit
- Update privacy policy

---

## Dependencies

### Security-Related Packages
- `@supabase/ssr` - Secure Supabase SSR client
- `@supabase/supabase-js` - Supabase client with RLS
- `isomorphic-dompurify` - Content sanitization
- `zod` - Input validation
- `stripe` - PCI-compliant payments

### Dependency Updates
Run regularly:
```bash
npm audit
npm audit fix
npm update
```

---

## Compliance Summary

| Regulation | Status | Implementation |
|------------|--------|----------------|
| GDPR (EU) | Compliant | Data export, deletion, cookie consent |
| CCPA (California) | Compliant | Disclosure, deletion, no data sale |
| PCI DSS | Compliant | Via Stripe integration |

---

## Security Checklist

- [x] RLS enabled on all tables
- [x] Authentication required on protected routes
- [x] Input validation with Zod
- [x] Content sanitization with DOMPurify
- [x] Security headers configured (CSP, HSTS, X-Frame-Options, etc.)
- [x] CORS configured for API routes
- [x] File upload validation
- [x] GDPR data export endpoint
- [x] GDPR account deletion endpoint
- [x] Stripe webhook signature verification
- [x] Environment variables properly secured
- [x] No secrets in version control
- [x] Rate limiting on public endpoints
- [x] Origin/CSRF validation
- [x] Suspicious content detection
- [x] Secure cookie settings (HttpOnly, Secure, SameSite)
- [x] Product checkout requires authentication
- [x] Order API enforces ownership checks
- [x] Open redirect prevention in auth callback
- [x] Generic error messages (no internal details exposed)
- [x] Privacy policy page present
- [x] Terms of service page present
- [x] Cookie consent banner (GDPR compliance)
- [x] Privacy/Terms links in all footers
- [x] 404 page for non-existent usernames
- [x] Reserved paths protection (prevents username collision)
- [x] Messages API thread participation verification (IDOR prevention)
- [x] Cryptographically secure order number generation
- [x] No sensitive data in API console.log statements
- [x] Login form shows generic "Invalid email or password" (prevents enumeration)
- [x] Supabase RLS policies enabled on all tables
- [x] Auth rate limiting defined (5 attempts per 15 minutes)
- [x] UUID validation on API route parameters (orders API)
- [x] X-Frame-Options: DENY + CSP frame-ancestors 'none' (clickjacking prevention)
- [x] All validation schemas have max length limits (DoS prevention)
- [x] All array inputs have max size limits (DoS prevention)
- [x] Stripe metadata uses only validated UUIDs (no user input)
- [x] Zod schema validation prevents mass assignment
- [x] Supabase signOut properly invalidates sessions
- [x] No hardcoded credentials or tokens in codebase
- [x] All external links use rel="noopener noreferrer" (reverse tabnabbing prevention)
- [x] Deterministic values for SSR waveforms (no hydration mismatch)
- [x] Consistent locale for date formatting (en-US)
- [x] Generic error messages in UI (no internal details exposed)
- [x] No prototype pollution vulnerabilities
- [x] Footer component marked 'use client' for Date consistency
- [x] No vulnerable npm dependencies (npm audit clean)
- [x] localStorage only stores non-sensitive data (visitor ID, consent)
- [x] Payment status only updated via verified Stripe webhooks
- [x] Pricing calculations use server-side database values only
- [x] No eval(), new Function(), or innerHTML patterns (XSS prevention)
- [x] Account deletion blocked with active orders
- [x] Service deletion blocked with existing orders
- [x] Refund handling via Stripe webhook events only
- [x] GDPR data export properly authenticated and scoped
