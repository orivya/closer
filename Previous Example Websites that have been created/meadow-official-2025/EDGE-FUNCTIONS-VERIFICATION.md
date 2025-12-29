# Edge Functions Verification Checklist

**Date:** December 23, 2025  
**Project:** `jyaymqmbmvmhabmhfqeg`

---

## ✅ Secrets Configuration

### Required Secrets (Should be set in Supabase Dashboard → Settings → Edge Functions → Secrets)

| Secret Name | Status | Used By | Notes |
|-------------|--------|---------|-------|
| `STRIPE_SECRET_KEY` | ✅ Set | `check-subscription`, `create-checkout`, `customer-portal`, `ai-generate` | Use live key: `sk_live_...` |
| `RESEND_API_KEY` | ✅ Set | `send-email` | Format: `re_...` |
| `OPENAI_API_KEY` | ✅ Set | `ai-generate` (fallback) | Format: `sk-...` |

### Optional Secrets

| Secret Name | Status | Used By | Notes |
|-------------|--------|---------|-------|
| `LOVABLE_API_KEY` | ⚠️ Optional | `ai-generate`, `ai-reflection` | If not set, `ai-generate` falls back to `OPENAI_API_KEY` |

---

## 🔍 Function-by-Function Verification

### 1. `check-subscription` ✅
**Purpose:** Check user's Stripe subscription status

**Secrets Required:**
- ✅ `STRIPE_SECRET_KEY`
- ✅ `SUPABASE_URL` (auto-provided)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (auto-provided)

**How to Test:**
1. Go to your app → Settings
2. Check if subscription status loads correctly
3. Check browser console for errors

**Expected Behavior:**
- Returns `{ subscribed: true/false, plan: 'free'|'pro'|'premium', ... }`

---

### 2. `create-checkout` ✅
**Purpose:** Create Stripe checkout session for subscriptions

**Secrets Required:**
- ✅ `STRIPE_SECRET_KEY`
- ✅ `SUPABASE_URL` (auto-provided)
- ✅ `SUPABASE_ANON_KEY` (auto-provided)

**How to Test:**
1. Go to Pricing page
2. Click "Upgrade" on Pro or Premium
3. Should redirect to Stripe checkout

**Expected Behavior:**
- Creates checkout session
- Returns `{ url: "https://checkout.stripe.com/..." }`
- Redirects to Stripe payment page

---

### 3. `customer-portal` ✅
**Purpose:** Access Stripe customer portal (manage subscription)

**Secrets Required:**
- ✅ `STRIPE_SECRET_KEY`
- ✅ `SUPABASE_URL` (auto-provided)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (auto-provided)

**How to Test:**
1. Go to Settings (as subscribed user)
2. Click "Manage Subscription"
3. Should open Stripe customer portal

**Expected Behavior:**
- Creates portal session
- Returns `{ url: "https://billing.stripe.com/..." }`
- Redirects to Stripe customer portal

---

### 4. `send-email` ✅
**Purpose:** Send emails via Resend

**Secrets Required:**
- ✅ `RESEND_API_KEY`
- ✅ `SUPABASE_URL` (auto-provided)
- ✅ `SUPABASE_ANON_KEY` (auto-provided)

**How to Test:**
- Email sending is typically triggered by:
  - Welcome emails (on signup)
  - Weekly digests
  - Time capsule unlocks
  - Password resets

**Expected Behavior:**
- Sends email successfully
- Returns success response

---

### 5. `ai-generate` ✅
**Purpose:** Generate AI content (summaries, insights, prompts)

**Secrets Required:**
- ✅ `STRIPE_SECRET_KEY` (for plan checking)
- ✅ `OPENAI_API_KEY` OR `LOVABLE_API_KEY`
- ✅ `SUPABASE_URL` (auto-provided)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (auto-provided)

**How to Test:**
1. Create a journal entry
2. Try to generate daily summary (in Journal → Calendar)
3. Try AI insights in Mirror space

**Expected Behavior:**
- Generates AI content based on plan
- Premium/Pro users get full features
- Free users get limited features

**Note:** If `LOVABLE_API_KEY` is not set, it will use `OPENAI_API_KEY` as fallback.

---

### 6. `ai-reflection` ⚠️
**Purpose:** Generate AI reflection prompts

**Secrets Required:**
- ⚠️ `LOVABLE_API_KEY` (preferred) OR `OPENAI_API_KEY`
- ✅ `SUPABASE_URL` (auto-provided)
- ✅ `SUPABASE_ANON_KEY` (auto-provided)

**How to Test:**
- Use guided reflection feature in Editor

**Note:** This function uses `LOVABLE_API_KEY` but can be updated to use `OPENAI_API_KEY` if needed.

---

### 7. `export-data` ✅
**Purpose:** Export user data (GDPR compliance)

**Secrets Required:**
- ✅ `SUPABASE_URL` (auto-provided)
- ✅ `SUPABASE_ANON_KEY` (auto-provided)

**How to Test:**
1. Go to Settings → Data & Export
2. Click "Export My Data"
3. Should download JSON file with all user data

**Expected Behavior:**
- Exports all user data (entries, settings, etc.)
- Returns downloadable file

---

### 8. `delete-account` ✅
**Purpose:** Delete user account and all data (GDPR compliance)

**Secrets Required:**
- ✅ `SUPABASE_URL` (auto-provided)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (auto-provided)

**How to Test:**
1. Go to Settings → Data & Export
2. Click "Delete Account"
3. Confirm deletion

**Expected Behavior:**
- Deletes all user data
- Removes user from auth
- Returns success response

---

## 🧪 Quick Test Checklist

### Test in Your App:

- [ ] **Pricing Page** - Click "Upgrade" → Should open Stripe checkout
- [ ] **Settings** - Subscription status should load
- [ ] **Settings** - "Manage Subscription" button works (if subscribed)
- [ ] **Journal** - Daily summary generation works
- [ ] **Mirror Space** - AI reflections generate
- [ ] **Editor** - Guided reflection prompts work
- [ ] **Settings → Data** - Export data works
- [ ] **Settings → Data** - Delete account works

---

## 🔧 Troubleshooting

### If Functions Fail:

1. **Check Secrets in Dashboard:**
   - Go to: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/settings/functions
   - Verify all secrets are set correctly
   - Check for typos in secret names

2. **Check Function Logs:**
   - Go to: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/functions
   - Click on a function → View logs
   - Look for error messages

3. **Common Issues:**

   **"STRIPE_SECRET_KEY is not set"**
   - ✅ Secret name must be exactly `STRIPE_SECRET_KEY`
   - ✅ Value must start with `sk_live_...` or `sk_test_...`

   **"RESEND_API_KEY is not set"**
   - ✅ Secret name must be exactly `RESEND_API_KEY`
   - ✅ Value must start with `re_...`

   **"OPENAI_API_KEY is not set"**
   - ✅ Secret name must be exactly `OPENAI_API_KEY`
   - ✅ Value must start with `sk-...`

---

## ✅ Verification Status

| Function | Secrets | Status |
|----------|---------|--------|
| `check-subscription` | ✅ STRIPE_SECRET_KEY | ✅ Ready |
| `create-checkout` | ✅ STRIPE_SECRET_KEY | ✅ Ready |
| `customer-portal` | ✅ STRIPE_SECRET_KEY | ✅ Ready |
| `send-email` | ✅ RESEND_API_KEY | ✅ Ready |
| `ai-generate` | ✅ STRIPE_SECRET_KEY, ✅ OPENAI_API_KEY | ✅ Ready |
| `ai-reflection` | ⚠️ LOVABLE_API_KEY (optional) | ⚠️ May need update |
| `export-data` | ✅ Auto-provided | ✅ Ready |
| `delete-account` | ✅ Auto-provided | ✅ Ready |

---

## 📝 Next Steps

1. **Test each function** using the checklist above
2. **Check function logs** if anything fails
3. **Update `ai-reflection`** if needed to use `OPENAI_API_KEY` instead of `LOVABLE_API_KEY`

---

## 🎉 All Set!

Your edge functions are deployed and configured. Test them in your app to verify everything works!

