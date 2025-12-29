# PHASE 14: Comprehensive Implementation Blueprint

**Priority:** CRITICAL
**Created:** December 28, 2024
**Status:** READY FOR IMPLEMENTATION

---

## Executive Summary

This blueprint addresses all 128+ remaining issues identified in Phase 13 audit. The implementation is organized into 8 phases with 120+ stages total, designed to transform MixExperts from a prototype with hardcoded demo data into a fully functional multi-tenant platform.

---

## Phase Overview

| Phase | Name | Stages | Priority | Estimated Effort |
|-------|------|--------|----------|------------------|
| 1 | Dynamic Profile Components | 18 | CRITICAL | 4-6 hours |
| 2 | Dashboard Data Connectivity | 16 | CRITICAL | 3-4 hours |
| 3 | Security Hardening | 14 | CRITICAL | 2-3 hours |
| 4 | Authentication & Authorization | 15 | CRITICAL | 3-4 hours |
| 5 | Accessibility Improvements | 20 | HIGH | 3-4 hours |
| 6 | Booking Flow Integration | 12 | HIGH | 2-3 hours |
| 7 | SEO & Metadata | 10 | MEDIUM | 1-2 hours |
| 8 | Testing & Verification | 15 | CRITICAL | 2-3 hours |
| **TOTAL** | | **120** | | **20-29 hours** |

---

## PHASE 1: Dynamic Profile Components (18 Stages)

**Objective:** Transform all profile components from hardcoded "James Mix" content to dynamic data fetched from the database.

### Database Schema Reference

The `profiles` table contains:
- `id`, `username`, `display_name`, `email`
- `avatar_url`, `banner_url`, `bio`, `tagline`
- `location`, `timezone`, `role`
- `is_published`, `is_verified`
- `subscription_tier`, `subscription_status`

The `services` table contains engineer services.
The `portfolio_items` table contains portfolio work.
The `testimonials` table contains reviews.
The `faqs` table contains FAQ entries.

### Stages

#### Stage 1.1: Create Profile Data Types
- [ ] Create `ProfileData` interface in `src/lib/types.ts`
- [ ] Include all fields from database schema
- [ ] Add optional fields for extended profile info

#### Stage 1.2: Create Profile Fetching Utility
- [ ] Create `src/lib/profile-data.ts`
- [ ] Add `fetchProfileByUsername(username: string)` function
- [ ] Add `fetchProfileServices(profileId: string)` function
- [ ] Add `fetchProfilePortfolio(profileId: string)` function
- [ ] Add `fetchProfileTestimonials(profileId: string)` function
- [ ] Add `fetchProfileFAQs(profileId: string)` function

#### Stage 1.3: Update Profile Page Data Fetching
- [ ] Update `src/app/[username]/page.tsx`
- [ ] Fetch full profile data after existence check
- [ ] Pass profile data to all child components as props
- [ ] Handle loading and error states

#### Stage 1.4: Update Hero Component
- [ ] Add `ProfileData` prop to Hero component
- [ ] Replace hardcoded avatar URL with `profile.avatar_url`
- [ ] Replace "Sonic.Identity." with `profile.tagline` or `profile.display_name`
- [ ] Replace hardcoded bio with `profile.bio`
- [ ] Add fallback for missing data

#### Stage 1.5: Update Navigation Component
- [ ] Replace hardcoded "JAMES MIX" with `profile.display_name`
- [ ] Keep username prop for link generation
- [ ] Update mobile menu with profile name

#### Stage 1.6: Update About Component
- [ ] Add `ProfileData` prop
- [ ] Replace "James" with `profile.display_name`
- [ ] Replace bio paragraphs with `profile.bio`
- [ ] Replace "Los Angeles" with `profile.location`
- [ ] Fetch/display dynamic stats (years, streams) from profile or calculate

#### Stage 1.7: Update Services Component
- [ ] Add `services` prop (array of DatabaseService)
- [ ] Replace `SERVICES` constant import with prop data
- [ ] Map database service format to display format
- [ ] Handle empty services state

#### Stage 1.8: Update Portfolio Component
- [ ] Add `portfolioItems` prop
- [ ] Replace `PORTFOLIO_ITEMS` constant with prop data
- [ ] Fetch from `portfolio_items` table
- [ ] Handle empty portfolio state

#### Stage 1.9: Update Testimonials Component
- [ ] Add `testimonials` prop
- [ ] Replace `TESTIMONIALS` constant with prop data
- [ ] Fetch from `testimonials` table (filtered by engineer)
- [ ] Handle empty testimonials state

#### Stage 1.10: Update FAQ Component
- [ ] Add `faqs` prop
- [ ] Replace `FAQS` constant with prop data
- [ ] Fetch from `faqs` table (filtered by engineer)
- [ ] Handle empty FAQ state

#### Stage 1.11: Update Products Component
- [ ] Add `products` prop (already partially done)
- [ ] Fetch from `products` table instead of PRODUCTS constant
- [ ] Handle empty products state

#### Stage 1.12: Update AudioDemo Component
- [ ] Add profile prop for dynamic audio samples
- [ ] Fetch audio demos from storage based on engineer ID
- [ ] Handle no demos state

#### Stage 1.13: Update FinalCTA Component
- [ ] Add profile prop
- [ ] Use profile.display_name in CTA text
- [ ] Link to correct booking page

#### Stage 1.14: Update Footer Component
- [ ] Add profile prop
- [ ] Display engineer name in copyright
- [ ] Show correct social links from profile

#### Stage 1.15: Update MobileTabBar Component
- [ ] Ensure links use correct username
- [ ] Already receives username prop - verify working

#### Stage 1.16: Update BookingSection Component
- [ ] Add profile and services props
- [ ] Display actual services for booking
- [ ] Link to correct booking flow

#### Stage 1.17: Update Assistant Component
- [ ] Connect to real AI endpoint or mark as coming soon
- [ ] Remove mock setTimeout responses
- [ ] Add proper error handling

#### Stage 1.18: Verify All Profile Components
- [ ] Test profile page with real user data
- [ ] Verify all hardcoded "James" references removed
- [ ] Test with new user account
- [ ] Verify empty states work correctly

---

## PHASE 2: Dashboard Data Connectivity (16 Stages)

**Objective:** Remove all mock data from dashboard pages and connect to real database.

### Stages

#### Stage 2.1: Update Finances Page
- [ ] Remove `INVOICES` mock array
- [ ] Fetch invoices from `orders` table
- [ ] Calculate real earnings from orders
- [ ] Fetch Stripe payout data via API
- [ ] Add loading state
- [ ] Add empty state for no invoices

#### Stage 2.2: Update Calendar Page
- [ ] Remove `EVENTS` mock array
- [ ] Fetch events from `orders` table (deadlines)
- [ ] Fetch from potential `calendar_events` table
- [ ] Implement date navigation
- [ ] Add empty state for no events

#### Stage 2.3: Update Client Dashboard Home
- [ ] Remove `ACTIVE_PROJECT` mock data
- [ ] Fetch client's active orders from database
- [ ] Calculate real stats (active projects, messages, etc.)
- [ ] Fetch real activity from messages/orders
- [ ] Add empty state for new clients

#### Stage 2.4: Update Client Orders Page
- [ ] Remove hardcoded order cards
- [ ] Fetch orders where `client_id` = user.id
- [ ] Display real order status and details
- [ ] Add loading and empty states

#### Stage 2.5: Update Client Order Detail Page
- [ ] Already partially fixed - verify working
- [ ] Fetch order details with engineer info
- [ ] Display real timeline and messages
- [ ] Handle file attachments

#### Stage 2.6: Update Client Downloads Page
- [ ] Fetch completed orders with deliverables
- [ ] List downloadable files from storage
- [ ] Add empty state for no downloads

#### Stage 2.7: Update Engineer Overview Page
- [ ] Verify fetching real data
- [ ] Remove any remaining mock stats
- [ ] Calculate real revenue, project counts

#### Stage 2.8: Update Portfolio Dashboard Page
- [ ] Already may be connected - verify
- [ ] Fetch from `portfolio_items` table
- [ ] CRUD operations working

#### Stage 2.9: Update Services Dashboard Page
- [ ] Verify connected to `services` table
- [ ] CRUD operations working

#### Stage 2.10: Update Products Dashboard Page
- [ ] Verify connected to `products` table
- [ ] CRUD operations working

#### Stage 2.11: Update Inbox Page
- [ ] Verify connected to `messages` table
- [ ] Real-time updates working

#### Stage 2.12: Update Analytics Dashboard
- [ ] Connect to real order data
- [ ] Calculate actual metrics
- [ ] Remove any mock charts data

#### Stage 2.13: Update AI Assistant Dashboard
- [ ] Remove mock setTimeout responses
- [ ] Connect to real AI API or show coming soon
- [ ] Proper error handling

#### Stage 2.14: Update Settings Pages
- [ ] Verify profile settings save correctly
- [ ] Verify Stripe connection status real
- [ ] All settings persist to database

#### Stage 2.15: Add Empty States Everywhere
- [ ] Finances: "No transactions yet"
- [ ] Calendar: "No upcoming events"
- [ ] Projects: Already done
- [ ] Orders: "No orders yet"
- [ ] Messages: "No messages"

#### Stage 2.16: Verify All Dashboard Pages
- [ ] Test each page with real user
- [ ] Verify no mock data remains
- [ ] Test empty states
- [ ] Build passes

---

## PHASE 3: Security Hardening (14 Stages)

**Objective:** Address all security vulnerabilities identified in audit.

### Stages

#### Stage 3.1: Add CSRF to Stripe Endpoints
- [ ] Update `api/stripe/create-customer/route.ts`
- [ ] Update `api/stripe/create-subscription-checkout/route.ts`
- [ ] Update `api/stripe/create-portal-session/route.ts`
- [ ] Add validateOrigin check to each
- [ ] Test CSRF protection working

#### Stage 3.2: Add CSRF to Connect Endpoints
- [ ] Update `api/stripe/connect/account/route.ts`
- [ ] Update `api/stripe/connect/onboarding/route.ts`
- [ ] Update `api/stripe/connect/callback/route.ts`
- [ ] Update `api/stripe/connect/refresh/route.ts`
- [ ] Update `api/stripe/connect/status/route.ts`

#### Stage 3.3: Implement Redis Rate Limiter
- [ ] Install `@upstash/ratelimit` and `@upstash/redis`
- [ ] Create `src/lib/rate-limit-redis.ts`
- [ ] Update rate limiters to use Redis
- [ ] Keep fallback to in-memory for development
- [ ] Test rate limiting persists across restarts

#### Stage 3.4: Fix Username Enumeration
- [ ] Update `SignupForm.tsx` username check
- [ ] Return generic "validation error" instead of "username taken"
- [ ] Add CAPTCHA or rate limiting to signup
- [ ] Test enumeration no longer possible

#### Stage 3.5: Strengthen Audio File Validation
- [ ] Update `usePortfolioAudioUpload.ts`
- [ ] Add magic byte validation for audio files
- [ ] Whitelist specific audio formats (mp3, wav, flac, aiff)
- [ ] Add file size limits
- [ ] Test malicious file rejection

#### Stage 3.6: Add Server-Side File Validation
- [ ] Create file validation API endpoint
- [ ] Validate MIME type server-side
- [ ] Check file headers/magic bytes
- [ ] Return validation result to client

#### Stage 3.7: Prevent IP Spoofing
- [ ] Update `getClientIP` function
- [ ] Validate IP address format
- [ ] Use Cloudflare/Vercel headers when available
- [ ] Add IP validation regex

#### Stage 3.8: Add Request Signing
- [ ] Implement request timestamp validation
- [ ] Reject requests older than 5 minutes
- [ ] Add to sensitive endpoints

#### Stage 3.9: Add Input Sanitization Review
- [ ] Verify all user inputs sanitized
- [ ] Check for XSS vectors in stored content
- [ ] Verify SQL injection protected (parameterized queries)
- [ ] Test with OWASP payloads

#### Stage 3.10: Add Content Security Policy
- [ ] Update `next.config.js` with CSP headers
- [ ] Restrict script sources
- [ ] Restrict image sources
- [ ] Test CSP doesn't break functionality

#### Stage 3.11: Review Cookie Security
- [ ] Verify HttpOnly on auth cookies (done in middleware)
- [ ] Verify Secure flag in production
- [ ] Verify SameSite=Lax or Strict
- [ ] No sensitive data in localStorage

#### Stage 3.12: Add Security Headers
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy as needed

#### Stage 3.13: Audit Secrets
- [ ] Verify no secrets in client code
- [ ] Check environment variables
- [ ] Verify .env.local in .gitignore
- [ ] Check for exposed API keys

#### Stage 3.14: Security Testing
- [ ] Run OWASP ZAP scan
- [ ] Test XSS prevention
- [ ] Test CSRF protection
- [ ] Test rate limiting
- [ ] Document findings

---

## PHASE 4: Authentication & Authorization (15 Stages)

**Objective:** Implement proper role-based access control throughout the application.

### Stages

#### Stage 4.1: Add Role to Profile Type
- [ ] Ensure role field in Profile interface
- [ ] Types: 'artist' (engineer) | 'client' | 'admin'
- [ ] Add role check utilities

#### Stage 4.2: Create Role Middleware
- [ ] Create `src/lib/role-middleware.ts`
- [ ] Add `requireRole(role: string)` function
- [ ] Add `requireEngineer()` helper
- [ ] Add `requireClient()` helper
- [ ] Add `requireAdmin()` helper

#### Stage 4.3: Update Supabase Middleware
- [ ] Add role-based route protection
- [ ] Protect `/dashboard/client/*` for clients only
- [ ] Protect `/dashboard/projects`, `/dashboard/finances`, etc. for engineers
- [ ] Redirect unauthorized users appropriately

#### Stage 4.4: Fix Role Switcher in Sidebar
- [ ] Add role validation before switching modes
- [ ] Only show modes user has access to
- [ ] Engineers can view client mode (their client dashboard)
- [ ] Clients cannot access engineer mode

#### Stage 4.5: Add Role Check to Services API
- [ ] Update `api/services/route.ts`
- [ ] Only engineers can create/update services
- [ ] Public can read (for profile pages)
- [ ] Add proper error responses

#### Stage 4.6: Add Role Check to Products API
- [ ] Update `api/products/checkout/route.ts`
- [ ] Only engineers can create products
- [ ] Anyone can purchase
- [ ] Verify proper authorization

#### Stage 4.7: Add Role Check to Orders API
- [ ] Engineers can update order status
- [ ] Clients can view their orders
- [ ] Prevent cross-user access

#### Stage 4.8: Add useAuth to Missing Pages
- [ ] Update `dashboard/portfolio/page.tsx`
- [ ] Update `dashboard/analytics/page.tsx`
- [ ] Update `dashboard/ai/page.tsx`
- [ ] Update `dashboard/products/page.tsx`
- [ ] Redirect if not authenticated

#### Stage 4.9: Add Auth to Client Pages
- [ ] Update `dashboard/client/page.tsx`
- [ ] Update `dashboard/client/orders/page.tsx`
- [ ] Update `dashboard/client/downloads/page.tsx`
- [ ] Verify auth context available

#### Stage 4.10: Protect File Download Routes
- [ ] Verify user owns or is participant in order
- [ ] Generate signed URLs with expiration
- [ ] Log download attempts

#### Stage 4.11: Protect Message Endpoints
- [ ] Verify user is participant in thread (done)
- [ ] Add rate limiting to message sending
- [ ] Prevent message spoofing

#### Stage 4.12: Add Session Timeout
- [ ] Configure session expiration
- [ ] Add refresh token rotation
- [ ] Handle expired sessions gracefully

#### Stage 4.13: Add Login Activity Logging
- [ ] Log successful logins
- [ ] Log failed attempts
- [ ] Consider showing user their login history

#### Stage 4.14: Implement "Remember Me"
- [ ] Add remember me checkbox to login
- [ ] Adjust session duration based on choice
- [ ] Secure storage of long-lived tokens

#### Stage 4.15: Test All Authorization
- [ ] Test as engineer accessing client routes
- [ ] Test as client accessing engineer routes
- [ ] Test as unauthenticated user
- [ ] Verify all protected routes work

---

## PHASE 5: Accessibility Improvements (20 Stages)

**Objective:** Achieve WCAG 2.1 AA compliance across the application.

### Stages

#### Stage 5.1: Add Dialog Semantics to Modals
- [ ] Update `TermsModal.tsx` with role="dialog"
- [ ] Add aria-modal="true"
- [ ] Add aria-labelledby for title
- [ ] Add aria-describedby for content

#### Stage 5.2: Implement Focus Trap in Modals
- [ ] Install focus-trap-react or implement custom
- [ ] Apply to all modal components
- [ ] Return focus on close
- [ ] Test keyboard navigation

#### Stage 5.3: Add ARIA to AddProjectModal
- [ ] Add dialog role and semantics
- [ ] Add form labels
- [ ] Add error announcements
- [ ] Test with screen reader

#### Stage 5.4: Add aria-describedby to Login Form
- [ ] Link error messages to inputs
- [ ] Add aria-invalid on error
- [ ] Announce errors with aria-live

#### Stage 5.5: Add aria-describedby to Signup Form
- [ ] Link error messages to inputs
- [ ] Add password requirements description
- [ ] Add aria-invalid on error

#### Stage 5.6: Add aria-describedby to All Forms
- [ ] Contact forms
- [ ] Settings forms
- [ ] Booking forms
- [ ] Profile edit forms

#### Stage 5.7: Add aria-label to Icon Buttons (Batch 1)
- [ ] Sidebar navigation icons
- [ ] Header search, notifications, profile
- [ ] Filter and sort buttons
- [ ] Plus/add buttons

#### Stage 5.8: Add aria-label to Icon Buttons (Batch 2)
- [ ] Download buttons
- [ ] Play/pause buttons
- [ ] Edit/delete buttons
- [ ] Close buttons

#### Stage 5.9: Add aria-label to Icon Buttons (Batch 3)
- [ ] Navigation arrows (calendar, pagination)
- [ ] Social media links
- [ ] External link indicators
- [ ] Action menu buttons

#### Stage 5.10: Fix Dropdown Keyboard Navigation
- [ ] Update `ui/Dropdown.tsx`
- [ ] Add arrow key navigation
- [ ] Add Enter/Space to select
- [ ] Add Escape to close
- [ ] Add Home/End support

#### Stage 5.11: Add Skip Links
- [ ] Add "Skip to main content" link
- [ ] Add "Skip to navigation" link
- [ ] Style visually hidden until focused
- [ ] Test navigation

#### Stage 5.12: Add aria-current to Navigation
- [ ] Update Sidebar active link
- [ ] Update profile navbar active section
- [ ] Use aria-current="page"

#### Stage 5.13: Add Table Accessibility
- [ ] Add scope="col" to all th elements
- [ ] Add scope="row" where applicable
- [ ] Add caption for data tables
- [ ] Test with screen reader

#### Stage 5.14: Add Loading Announcements
- [ ] Add aria-live="polite" regions
- [ ] Announce loading states
- [ ] Announce completion
- [ ] Announce errors

#### Stage 5.15: Add Form Validation Announcements
- [ ] Use aria-live for error summaries
- [ ] Focus first error on submit
- [ ] Clear announcements on fix

#### Stage 5.16: Improve Color Contrast
- [ ] Audit text contrast ratios
- [ ] Fix muted text colors
- [ ] Ensure 4.5:1 for normal text
- [ ] Ensure 3:1 for large text

#### Stage 5.17: Add Visible Focus Indicators
- [ ] Ensure all interactive elements have focus style
- [ ] Don't rely on outline: none
- [ ] Use focus-visible where appropriate

#### Stage 5.18: Add Image Alt Text
- [ ] Audit all images for alt text
- [ ] Add descriptive alt to informative images
- [ ] Use alt="" for decorative images
- [ ] Profile avatars should include name

#### Stage 5.19: Test with Screen Reader
- [ ] Test with VoiceOver (Mac)
- [ ] Test critical user journeys
- [ ] Document issues found
- [ ] Fix blocking issues

#### Stage 5.20: Run Accessibility Audit
- [ ] Run axe-core automated tests
- [ ] Run Lighthouse accessibility audit
- [ ] Document remaining issues
- [ ] Create remediation plan

---

## PHASE 6: Booking Flow Integration (12 Stages)

**Objective:** Connect booking flow to real services and implement file uploads.

### Stages

#### Stage 6.1: Update Step1 Service Selection
- [ ] Remove SERVICES constant import
- [ ] Fetch services from database based on engineer
- [ ] Pass engineer ID/username to component
- [ ] Handle loading state

#### Stage 6.2: Update Step2 Project Details
- [ ] Implement real file upload to Supabase Storage
- [ ] Create order_files bucket
- [ ] Store file references in database
- [ ] Handle upload progress
- [ ] Handle upload errors

#### Stage 6.3: Update Step3 (if exists)
- [ ] Connect to real data
- [ ] Calculate actual pricing
- [ ] Show selected add-ons

#### Stage 6.4: Update Checkout Page
- [ ] Remove hardcoded BASE_PRICE = 150
- [ ] Fetch actual service price from database
- [ ] Calculate with add-ons and options
- [ ] Display correct total

#### Stage 6.5: Create Order on Payment Success
- [ ] Insert order into database
- [ ] Link uploaded files to order
- [ ] Send confirmation email
- [ ] Update order status flow

#### Stage 6.6: Implement ServicePage Properly
- [ ] Update `[username]/services/[slug]/page.tsx`
- [ ] Fetch service by slug from database
- [ ] Display actual service details
- [ ] Link to booking flow

#### Stage 6.7: Create File Upload API
- [ ] Create `api/upload/route.ts`
- [ ] Validate file types
- [ ] Upload to appropriate bucket
- [ ] Return file URL

#### Stage 6.8: Implement File Deletion
- [ ] Allow deletion before order confirmed
- [ ] Clean up orphaned files
- [ ] Secure deletion (owner only)

#### Stage 6.9: Add Order Confirmation Page
- [ ] Show order summary
- [ ] Show next steps
- [ ] Link to dashboard

#### Stage 6.10: Test Complete Booking Flow
- [ ] Test service selection
- [ ] Test file upload
- [ ] Test payment flow
- [ ] Verify order creation

#### Stage 6.11: Add Booking Analytics
- [ ] Track booking starts
- [ ] Track step completions
- [ ] Track drop-offs
- [ ] Track conversions

#### Stage 6.12: Handle Booking Errors
- [ ] Payment failure handling
- [ ] File upload failure handling
- [ ] Network error handling
- [ ] User-friendly error messages

---

## PHASE 7: SEO & Metadata (10 Stages)

**Objective:** Implement dynamic SEO for all public pages.

### Stages

#### Stage 7.1: Create generateMetadata for Profile Pages
- [ ] Update `[username]/layout.tsx`
- [ ] Fetch profile data server-side
- [ ] Return dynamic title: "{name} | MixExperts"
- [ ] Return dynamic description from bio

#### Stage 7.2: Add OpenGraph Tags
- [ ] Add og:title
- [ ] Add og:description
- [ ] Add og:image (profile avatar or default)
- [ ] Add og:type: profile

#### Stage 7.3: Add Twitter Cards
- [ ] Add twitter:card: summary_large_image
- [ ] Add twitter:title
- [ ] Add twitter:description
- [ ] Add twitter:image

#### Stage 7.4: Add JSON-LD Structured Data
- [ ] Add Person schema for engineers
- [ ] Add Service schema for services
- [ ] Add Product schema for products
- [ ] Add Review schema for testimonials

#### Stage 7.5: Create Sitemap
- [ ] Generate sitemap.xml dynamically
- [ ] Include all published profiles
- [ ] Include public pages
- [ ] Update on new profiles

#### Stage 7.6: Create Robots.txt
- [ ] Allow public pages
- [ ] Disallow dashboard routes
- [ ] Disallow API routes
- [ ] Reference sitemap

#### Stage 7.7: Add Canonical URLs
- [ ] Add canonical link to all pages
- [ ] Handle www vs non-www
- [ ] Handle trailing slashes

#### Stage 7.8: Optimize Page Titles
- [ ] Homepage: "MixExperts | Professional Audio Engineering Marketplace"
- [ ] Features: "Features | MixExperts"
- [ ] Pricing: "Pricing | MixExperts"
- [ ] Profile: "{Name} - {Tagline} | MixExperts"

#### Stage 7.9: Add Meta Descriptions
- [ ] Unique descriptions for each page
- [ ] 150-160 characters
- [ ] Include keywords naturally

#### Stage 7.10: Test SEO Implementation
- [ ] Test with Google Rich Results Test
- [ ] Test with OpenGraph debugger
- [ ] Test with Twitter Card validator
- [ ] Verify sitemap accessible

---

## PHASE 8: Testing & Verification (15 Stages)

**Objective:** Ensure all changes work correctly and the build passes.

### Stages

#### Stage 8.1: Run TypeScript Compiler
- [ ] `npm run build` passes
- [ ] No type errors
- [ ] Fix any type issues

#### Stage 8.2: Run ESLint
- [ ] `npm run lint` passes
- [ ] No critical warnings
- [ ] Fix linting issues

#### Stage 8.3: Test Profile Page Flow
- [ ] Create new user account
- [ ] Fill out profile
- [ ] Verify profile page shows correct data
- [ ] Verify all sections dynamic

#### Stage 8.4: Test Dashboard Flow (Engineer)
- [ ] Navigate all dashboard pages
- [ ] Verify no mock data
- [ ] Verify empty states
- [ ] Test CRUD operations

#### Stage 8.5: Test Dashboard Flow (Client)
- [ ] Navigate client dashboard
- [ ] Verify orders display
- [ ] Verify messages work
- [ ] Test file downloads

#### Stage 8.6: Test Booking Flow
- [ ] Select service
- [ ] Upload files
- [ ] Complete payment (test mode)
- [ ] Verify order created

#### Stage 8.7: Test Authentication
- [ ] Test signup
- [ ] Test login
- [ ] Test logout
- [ ] Test password reset
- [ ] Test session persistence

#### Stage 8.8: Test Authorization
- [ ] Test role restrictions
- [ ] Test protected routes
- [ ] Test API authorization
- [ ] Verify no unauthorized access

#### Stage 8.9: Test Security Features
- [ ] Test CSRF protection
- [ ] Test rate limiting
- [ ] Test file upload validation
- [ ] Test input sanitization

#### Stage 8.10: Test Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast
- [ ] Focus management

#### Stage 8.11: Test Mobile Responsiveness
- [ ] Profile page on mobile
- [ ] Dashboard on mobile
- [ ] Booking flow on mobile
- [ ] All breakpoints work

#### Stage 8.12: Test Cross-Browser
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### Stage 8.13: Performance Testing
- [ ] Lighthouse performance score
- [ ] Core Web Vitals
- [ ] Image optimization
- [ ] Bundle size check

#### Stage 8.14: Create Test Documentation
- [ ] Document test cases
- [ ] Document known issues
- [ ] Create regression test list

#### Stage 8.15: Final Build Verification
- [ ] Production build succeeds
- [ ] All tests pass
- [ ] No console errors
- [ ] Ready for deployment

---

## Implementation Priority Matrix

### Immediate (Do First)
1. Phase 1: Profile Components - Enables multi-user support
2. Phase 2: Dashboard Data - Removes mock data
3. Phase 4: Authorization - Security critical

### High Priority (Do Second)
4. Phase 3: Security - Address vulnerabilities
5. Phase 6: Booking Flow - Revenue critical

### Medium Priority (Do Third)
6. Phase 5: Accessibility - Compliance
7. Phase 7: SEO - Discovery

### Final (Do Last)
8. Phase 8: Testing - Verification

---

## Files to Modify Summary

### Phase 1 (Profile)
- `src/app/[username]/page.tsx`
- `src/components/profile/Hero.tsx`
- `src/components/profile/Navigation.tsx`
- `src/components/profile/About.tsx`
- `src/components/profile/Services.tsx`
- `src/components/profile/Portfolio.tsx`
- `src/components/profile/Testimonials.tsx`
- `src/components/profile/FAQ.tsx`
- `src/components/profile/Products.tsx`
- `src/components/profile/FinalCTA.tsx`
- `src/components/profile/Footer.tsx`
- `src/lib/profile-data.ts` (new)

### Phase 2 (Dashboard)
- `src/app/dashboard/finances/page.tsx`
- `src/app/dashboard/calendar/page.tsx`
- `src/app/dashboard/client/page.tsx`
- `src/app/dashboard/client/orders/page.tsx`
- `src/app/dashboard/client/downloads/page.tsx`
- `src/app/dashboard/analytics/page.tsx`
- `src/app/dashboard/ai/page.tsx`

### Phase 3 (Security)
- `src/app/api/stripe/*/route.ts` (8 files)
- `src/lib/rate-limit.ts`
- `src/lib/rate-limit-redis.ts` (new)
- `src/hooks/usePortfolioAudioUpload.ts`
- `next.config.js`

### Phase 4 (Auth)
- `src/lib/supabase-middleware.ts`
- `src/lib/role-middleware.ts` (new)
- `src/components/dashboard/Sidebar.tsx`
- `src/app/api/services/route.ts`
- Multiple dashboard pages

### Phase 5 (Accessibility)
- `src/components/ui/Modal.tsx` or similar
- All form components
- All icon button components
- `src/components/ui/Dropdown.tsx`

### Phase 6 (Booking)
- `src/components/booking/Step1ServiceSelection.tsx`
- `src/components/booking/Step2ProjectDetails.tsx`
- `src/app/checkout/page.tsx`
- `src/app/[username]/services/[slug]/page.tsx`

### Phase 7 (SEO)
- `src/app/[username]/layout.tsx`
- `src/app/sitemap.ts` (new)
- `src/app/robots.ts` (new)

---

## Success Criteria

- [ ] No hardcoded "James Mix" content anywhere
- [ ] All dashboard pages show real or empty states
- [ ] All API endpoints have CSRF protection
- [ ] Role-based access control working
- [ ] WCAG 2.1 AA compliance on critical flows
- [ ] Booking flow creates real orders
- [ ] Dynamic SEO metadata on profiles
- [ ] Build passes with no errors
- [ ] All tests pass

---

*Document created: December 28, 2024*
*Status: Ready for implementation*
