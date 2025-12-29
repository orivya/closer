# Phase 4: Onboarding Flow Audit

**Route:** `/onboarding` (src/app/onboarding/page.tsx)
**Status:** Audited
**Date:** December 27, 2025

---

## 1. Flow Overview

4-step onboarding wizard for new engineers:

| Step | Name | Purpose |
|------|------|---------|
| 1 | Identity | Role selection, display name, location |
| 2 | Visuals | Avatar and banner upload |
| 3 | Rates | Mix and mastering pricing |
| 4 | Completion | Auto-redirect to dashboard |

---

## 2. Context & State Management

**OnboardingContext** (`src/context/OnboardingContext.tsx`)

### Data Structure
```typescript
interface OnboardingData {
  role: 'engineer' | 'artist' | 'producer';
  displayName: string;
  location: string;
  avatarFile?: File | null;
  bannerFile?: File | null;
  avatarPreview?: string;
  bannerPreview?: string;
  mixRate: number;
  masterRate: number;
  isStripeConnected: boolean;
}
```

### Default Values
- mixRate: $350
- masterRate: $75
- isStripeConnected: false

---

## 3. Step-by-Step Audit

### 3.1 Step 1: Identity (Step1Identity.tsx)

#### Buttons & Navigation
| Element | Action | Status |
|---------|--------|--------|
| Role cards (3) | Update `role` in context | Working |
| Display Name input | Update `displayName` | Working |
| Location input | Update `location` | Working |
| "Continue to Profile" button | Go to step 2 | Working |

#### Issues
1. **Role options don't match context type** - Context has 'artist' | 'engineer' | 'producer' but UI shows 'engineer' | 'mastering' | 'producer'
2. **No "Back" or "Exit" option** - User can't cancel onboarding
3. **Only displayName validated** - Location not validated
4. **No username field** - Critical: How will profile URLs work?

### 3.2 Step 2: Visuals (Step2Visuals.tsx)

#### Buttons & Navigation
| Element | Action | Status |
|---------|--------|--------|
| VisualsEditor | Upload avatar/banner | Uses mock (ObjectURL) |
| "Back" button | Go to step 1 | Working |
| "Set Pricing" button | Go to step 3 | Working |

#### Issues
1. **Files stored in memory only** - No actual upload to Supabase Storage
2. **No file size/type validation** - Should limit to images, max sizes
3. **Step is optional** - Can proceed without uploading anything
4. **Reuses VisualsEditor from settings** - Good code reuse

### 3.3 Step 3: Rates (Step3Rates.tsx)

#### Buttons & Navigation
| Element | Action | Status |
|---------|--------|--------|
| Mix Rate input | Update `mixRate` | Working |
| Master Rate input | Update `masterRate` | Working |
| "Back" button | Go to step 2 | Working |
| "Finish Setup" button | Go to step 4 | Working |

#### Issues
1. **No minimum price validation** - Can enter $0
2. **No maximum price validation** - Can enter unrealistic values
3. **Currency not configurable** - Hardcoded to USD
4. **No additional services** - Only Mix and Master (what about 2-track mix?)

### 3.4 Step 4: Completion (Step4Completion.tsx)

#### Behavior
- Shows success message with display name
- Shows loading indicator
- Auto-redirects to `/dashboard` after 3 seconds

#### Issues
1. **No actual data saving** - Just simulates with setTimeout
2. **No Stripe Connect integration** - `isStripeConnected` never used
3. **No profile creation** - Should create profile in DB
4. **No error handling** - What if save fails?
5. **Can't go back** - No way to return to previous steps

---

## 4. Missing Features

### From Blueprint Specifications

| Feature | Status | Notes |
|---------|--------|-------|
| Username selection | **MISSING** | Required for profile URLs |
| Email verification check | **MISSING** | Should verify email before onboarding |
| Stripe Connect setup | **MISSING** | Critical for payments |
| Subscription plan selection | **MISSING** | Which tier are they on? |
| Bio/tagline entry | **MISSING** | Important for profile |
| Genre selection | **MISSING** | For filtering |
| Social links setup | **MISSING** | Instagram, YouTube, etc. |
| Terms of Service agreement | **MISSING** | Legal requirement |

### Missing Steps (Consider Adding)

**Step 2.5: Profile Details**
- Bio (with AI generation option)
- Tagline
- Genres/specialties

**Step 3.5: Stripe Connect**
- Connect Stripe account for payments
- Skip option with warning

---

## 5. Backend Integration Requirements

### Database Operations
```typescript
// Step 4 completion should:
1. Create profile row in profiles table
2. Create initial services (Mix, Master) with entered rates
3. Upload avatar/banner to Supabase Storage
4. Create subscription row (free tier by default)
5. Redirect to dashboard
```

### Supabase Storage Buckets
- `avatars` - For profile photos
- `banners` - For banner images

### Stripe Connect
```typescript
// Step 3.5 (to add) should:
1. Initiate Stripe Connect OAuth
2. Handle callback with account linking
3. Store stripe_account_id in profiles table
```

---

## 6. Issues Summary

### Critical
1. **No username field** - Profile URL cannot be created
2. **No data persistence** - Onboarding data is lost on refresh
3. **No Stripe Connect** - Payment capability missing
4. **Role type mismatch** - Context vs UI inconsistency

### High Priority
5. **No validation** - Rates, display name could have bad values
6. **No terms agreement** - Legal requirement
7. **No profile creation** - Step 4 doesn't actually save

### Medium Priority
8. **Missing bio/tagline** - Important profile content
9. **Missing genres** - Needed for filtering
10. **No skip/cancel option** - User stuck if they want to exit

### Low Priority
11. **Currency hardcoded** - International users need options
12. **Limited services** - Only mix/master rate

---

## 7. Recommendations

### Immediate Fixes
1. Add username field in Step 1
2. Add terms checkbox before "Finish Setup"
3. Fix role type mismatch
4. Add form validation

### Before Backend Integration
1. Add Stripe Connect step
2. Add bio/tagline step (or combine with Step 1)
3. Add profile creation logic in Step 4

### Future Enhancements
- AI-powered bio generation
- Profile preview before completion
- Social account linking
- Import from existing platforms

---

## 8. Monetization Opportunities

### During Onboarding
- [ ] Show plan comparison before completion
- [ ] Offer Pro trial prominently
- [ ] Highlight AI features as "coming with upgrade"

### After Onboarding
- [ ] Dashboard shows "Complete your profile" prompts
- [ ] Upgrade prompts when hitting free tier limits

---

## 9. Stage Checklist

| Stage | Task | Status |
|-------|------|--------|
| 1 | Review Step 1 | Complete |
| 2 | Review Step 2 | Complete |
| 3 | Review Step 3 | Complete |
| 4 | Review Step 4 | Complete |
| 5 | Identify missing features | Complete |

---

**Phase 4 Complete**
**Issues Found:** 12
**Critical Issues:** 4
