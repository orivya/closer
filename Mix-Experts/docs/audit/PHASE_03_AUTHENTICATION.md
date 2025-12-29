# Phase 3: Authentication Pages Audit

**Routes:** `/login`, `/signup`, `/forgot-password`
**Status:** Audited
**Date:** December 27, 2025

---

## 1. Pages Overview

| Page | Route | Component | Purpose |
|------|-------|-----------|---------|
| Login | `/login` | LoginForm.tsx | Existing user authentication |
| Signup | `/signup` | SignupForm.tsx | New user registration |
| Forgot Password | `/forgot-password` | ForgotPasswordForm.tsx | Password recovery |

---

## 2. Login Page Audit (`/login`)

### 2.1 Button & Link Audit

| Element | Destination | Status | Issue |
|---------|-------------|--------|-------|
| "MixExperts" logo | `/` | Working | - |
| "Forgot?" link | `/forgot-password` | Working | - |
| "Enter Studio" button | Form submit | **NO BACKEND** | Only simulates, no auth |
| "Apply for Access" link | `/signup` | Working | - |

### 2.2 Form Fields

| Field | Validation | Status |
|-------|------------|--------|
| Email | None client-side | **NEEDS VALIDATION** |
| Password | None client-side | **NEEDS VALIDATION** |

### 2.3 Issues
1. **Form has no actual authentication** - Just simulates with setTimeout
2. **No form validation** - Email/password not validated
3. **No error states** - No UI for invalid credentials
4. **No "Remember me" option** - Common feature missing
5. **Copyright says "2024"** - Should be 2025

---

## 3. Signup Page Audit (`/signup`)

### 3.1 Button & Link Audit

| Element | Destination | Status | Issue |
|---------|-------------|--------|-------|
| "MixExperts" logo | `/` | Working | - |
| Role selection (Artist) | None (state) | Working | - |
| Role selection (Engineer) | None (state) | Working | - |
| "Initialize Account" button | Form submit | **NO BACKEND** | Only simulates |
| "Return to Login" link | `/login` | Working | - |

### 3.2 Form Fields

| Field | Validation | Status |
|-------|------------|--------|
| Full Name | None | **NEEDS VALIDATION** |
| Email | None | **NEEDS VALIDATION** |
| Password | None | **NEEDS VALIDATION** |
| Genre (Artist) | None | Optional, OK |
| Experience (Engineer) | None | Optional, OK |

### 3.3 Role-Based Fields
- **Artist selected:** Shows "Primary Genre" dropdown
- **Engineer selected:** Shows "Years of Experience" dropdown

### 3.4 Issues
1. **No form validation** - No email format, password strength
2. **No username field** - Required for profile URLs like `/jamesmix`
3. **No password confirmation** - Best practice for signup
4. **No Terms checkbox** - Footer mentions ToS but no checkbox
5. **No plan parameter handling** - URL can have `?plan=pro` but form doesn't use it
6. **No redirect after signup** - Should go to onboarding

---

## 4. Forgot Password Audit (`/forgot-password`)

### 4.1 Button & Link Audit

| Element | Destination | Status | Issue |
|---------|-------------|--------|-------|
| "Send Reset Link" button | Form submit | **NO BACKEND** | Only simulates |
| "Try different email" button | Resets form | Working | - |
| "Back to Login" link | `/login` | Working | - |

### 4.2 Form Fields

| Field | Validation | Status |
|-------|------------|--------|
| Email | `required` attribute | Minimal validation |

### 4.3 Success State
- Shows success message with email displayed
- Has "Try a different email" option

### 4.4 Issues
1. **No actual email sending** - Simulates success
2. **No rate limiting UI** - Should prevent spam
3. **Missing brand logo** - Unlike other auth pages

---

## 5. Missing Pages

| Page | Exists | Required By |
|------|--------|-------------|
| `/reset-password` | **NO** | Password reset token handling |
| `/verify-email` | **NO** | Email verification flow |

---

## 6. Backend Integration Requirements

### 6.1 Supabase Auth Integration

```typescript
// Required functions to implement
import { supabase } from '@/lib/supabase';

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password
});

// Signup
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      full_name: name,
      role: role
    }
  }
});

// Password Reset
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'https://mixexperts.com/reset-password'
});
```

### 6.2 After Auth Actions
- **Login:** Redirect to `/dashboard`
- **Signup:** Create profile row → Redirect to `/onboarding`
- **Reset:** Send email via Supabase Auth

---

## 7. Validation Requirements (from IMPLEMENTATION_DETAILS.md)

### 7.1 Email Validation
```typescript
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### 7.2 Password Validation
```typescript
const passwordValidation = {
  minLength: 8,
  maxLength: 72,
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
  // Must contain: lowercase, uppercase, number
};
```

### 7.3 Username Validation (for signup)
```typescript
const usernameValidation = {
  minLength: 3,
  maxLength: 30,
  pattern: /^[a-z0-9_-]+$/,
  // Only lowercase letters, numbers, underscores, hyphens
};
```

---

## 8. Issues Summary

### Critical (Security/Functionality)
1. **No actual authentication** - Forms don't connect to auth provider
2. **No form validation** - Could submit empty/invalid data
3. **Missing /reset-password page** - Password reset flow incomplete
4. **Missing /verify-email page** - Email verification flow incomplete

### High Priority (UX)
5. **No username field in signup** - Required for profile URL
6. **No Terms of Service checkbox** - Legal requirement
7. **No plan query param handling** - Pricing page passes `?plan=` but unused

### Medium Priority
8. **No "Remember me" on login** - Common feature
9. **No password confirmation** - Best practice
10. **No password strength indicator** - UX improvement
11. **No social login options** - Supabase supports OAuth

### Low Priority
12. **Copyright year outdated** - Shows 2024
13. **Inconsistent branding** - Forgot password missing logo

---

## 9. Monetization & Upsell Opportunities

### On Signup
- [ ] Show selected plan summary if `?plan=` query param exists
- [ ] Offer "14-day Pro trial" prominently
- [ ] Display comparison of what they get with upgrade

### Post-Auth
- [ ] Onboarding should show subscription selection
- [ ] Free tier should show upgrade prompts

---

## 10. Stage Checklist

| Stage | Task | Status |
|-------|------|--------|
| 1 | Review Login page links/buttons | Complete |
| 2 | Review Signup page links/buttons | Complete |
| 3 | Review Forgot Password links/buttons | Complete |
| 4 | Check form validation | Complete |
| 5 | Identify missing pages | Complete |

---

**Phase 3 Complete**
**Issues Found:** 13
**Critical Issues:** 4
