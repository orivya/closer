# Upgrade User to Premium Guide

**User:** `sample3@gmail.com`  
**Goal:** Give them Pro/Premium access to test daily summaries

---

## Option 1: Run SQL Script (After User Signs Up)

### Step 1: User Must Sign Up First

The user `sample3@gmail.com` needs to:
1. Go to your app
2. Sign up with that email
3. Complete onboarding

### Step 2: Run the Upgrade Script

1. Go to: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/sql/new
2. Open the file: `upgrade-user-to-premium.sql`
3. Copy and paste the SQL into the editor
4. Click **"Run"**
5. Should see: "User [id] upgraded to premium successfully!"

### Step 3: Verify

The script will show the user's email, plan, and status to confirm it worked.

---

## Option 2: Manual SQL (If User Already Exists)

If the user is already signed up, run this directly:

```sql
-- Find user
SELECT id, email FROM auth.users WHERE email = 'sample3@gmail.com';

-- Then use that user_id to create subscription:
INSERT INTO public.user_subscriptions (
    user_id,
    plan,
    status,
    current_period_start,
    current_period_end,
    cancel_at_period_end
)
VALUES (
    'PASTE_USER_ID_HERE',  -- From the SELECT above
    'premium',  -- or 'pro'
    'active',
    NOW(),
    NOW() + INTERVAL '1 year',
    false
)
ON CONFLICT (user_id) 
DO UPDATE SET
    plan = 'premium',
    status = 'active',
    updated_at = NOW();
```

---

## Option 3: Temporarily Allow Free Users (For Testing)

If you want to test without upgrading, I can modify the function to allow daily summaries for free users temporarily.

**Would you like me to:**
1. ✅ Create the upgrade script (done - see `upgrade-user-to-premium.sql`)
2. ⚠️ Temporarily allow free users to test daily summaries
3. 🔍 Check if the user exists first

---

## Quick Check: Does User Exist?

Run this to check:

```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'sample3@gmail.com';
```

If it returns a row, the user exists and you can run the upgrade script.
If it returns nothing, the user needs to sign up first.

---

## After Upgrading

Once the user is upgraded to premium:
1. ✅ Daily summaries will work
2. ✅ All AI features will be available
3. ✅ No upgrade prompts will show
4. ✅ Logs will show: `userPlan: 'premium'` instead of `'free'`

---

## Verify It Worked

After running the upgrade script, test:
1. User logs in as `sample3@gmail.com`
2. Goes to Journal → Calendar
3. Clicks a date with entries
4. Daily summary should generate (no upgrade prompt)

