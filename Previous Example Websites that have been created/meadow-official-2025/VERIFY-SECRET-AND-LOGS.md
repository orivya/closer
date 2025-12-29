# Verify OpenAI Secret & Check Logs

**Issue:** Nothing showing in logs, summary not generating

---

## Step 1: Verify Secret is Set

### In Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/settings/functions
2. Scroll to **"Secrets"** section
3. **Look for:** `OPENAI_API_KEY`

**If it's NOT there:**
- Click **"Add new secret"** or **"New secret"**
- **Name:** `OPENAI_API_KEY` (exact, case-sensitive, no spaces)
- **Value:** Your OpenAI API key (starts with `sk-`)
- Click **"Save"**

**If it IS there:**
- Click on it to view/edit
- Verify the value is correct
- Make sure no extra spaces
- Click **"Save"** to refresh

---

## Step 2: Test and Check Logs

### After setting/verifying the secret:

1. **Wait 10 seconds** (secrets update immediately)
2. **Go to your app** → Journal → Calendar
3. **Click a date** with entries
4. **Click "Generate Summary"** or similar button
5. **Immediately go to logs:** https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/functions/ai-generate/logs
6. **Wait 10-30 seconds**
7. **Refresh the logs page**

### What to Look For:

**✅ Good signs:**
- `[AI-GENERATE] API key found. Using: OpenAI`
- `[AI-GENERATE] Processing daily_summary request (using OpenAI)`
- No errors

**❌ Bad signs:**
- `ERROR: No API key found`
- `(using Lovable)` instead of `(using OpenAI)`
- `401 Unauthorized`
- `404 Model not found`
- `Neither OPENAI_API_KEY nor LOVABLE_API_KEY is configured`

---

## Step 3: Common Issues & Fixes

### Issue 1: "No API key found"
**Fix:** Make sure `OPENAI_API_KEY` secret is set in Supabase

### Issue 2: "Model not found" or 404 error
**Possible model names to try:**
- `gpt-5-nano` (currently set)
- `gpt-5.2-nano`
- `gpt-4o-mini` (if GPT-5 Nano doesn't exist)
- `gpt-4o` (latest full model)

**If model doesn't exist, I can update it to the correct name.**

### Issue 3: "401 Unauthorized"
**Fix:** 
- Check API key for typos
- Verify key is active at https://platform.openai.com/api-keys
- Make sure key starts with `sk-`

### Issue 4: Nothing in logs at all
**Possible causes:**
- Function isn't being called (check browser console for errors)
- Request is failing before reaching the function
- Wrong function being called

---

## Step 4: Check Browser Console

1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to **Console** tab
3. Try generating a summary
4. Look for errors like:
   - Network errors
   - API call failures
   - Authentication errors

---

## Step 5: Verify Model Name

Since you mentioned GPT-5 Nano, let's verify the exact model identifier:

**Check OpenAI docs:** https://platform.openai.com/docs/overview

The model identifier might be:
- `gpt-5-nano`
- `gpt-5.2-nano`
- `gpt-5-nano-2025-12-11` (with date)
- Or something else

**If the model name is wrong, share the correct one and I'll update it.**

---

## Quick Test Checklist

- [ ] `OPENAI_API_KEY` secret exists in Supabase
- [ ] Secret value starts with `sk-`
- [ ] No extra spaces in secret name or value
- [ ] Tried generating summary in app
- [ ] Checked function logs (wait 10-30 seconds, refresh)
- [ ] Checked browser console for errors
- [ ] API key is active in OpenAI dashboard

---

## What to Share

If it's still not working, share:

1. **Do you see `OPENAI_API_KEY` in Supabase secrets?** (Yes/No)
2. **What error appears in function logs?** (Copy the exact message)
3. **What error appears in browser console?** (If any)
4. **What's the exact model name** from OpenAI docs? (If different from `gpt-5-nano`)

With that info, I can fix it immediately!

