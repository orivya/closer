# Debug Daily Summary & Logs Issue

**Issues:**
1. Daily summaries not showing in calendar
2. Logs not appearing in Supabase
3. AI content works in journal but not calendar

---

## Key Finding: Daily Summary Requires Pro Plan

**Important:** The `daily_summary` feature requires a **"pro"** or **"premium"** subscription plan. Free users will see an upgrade message.

**Code location:** `supabase/functions/ai-generate/index.ts` line 197
```typescript
const requiredPlan = (featureRow as any)?.requires_plan ?? (type === "daily_summary" ? "pro" : "free");
```

---

## Step 1: Verify API Key is Set

1. Go to: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/settings/functions
2. Scroll to **"Secrets"**
3. Verify `OPENAI_API_KEY` exists and is correct

**If missing:**
- Click "Add new secret"
- Name: `OPENAI_API_KEY` (exact)
- Value: Your OpenAI API key (starts with `sk-`)

---

## Step 2: Check Your Subscription Plan

The daily summary feature checks your subscription. To see what plan you have:

**Option A: Check in Database (via MCP)**
I can query your `user_subscriptions` table to see your plan.

**Option B: Check in App**
- Go to Settings
- Look for subscription status
- Should show "free", "pro", or "premium"

**If you're on "free" plan:**
- Daily summaries will be blocked
- You'll see "Upgrade required" message
- Other AI features (reflection prompts, insights) should still work

---

## Step 3: Check Function Logs (With New Logging)

I've added comprehensive logging. After trying to generate a summary:

1. Go to: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/functions/ai-generate/logs
2. Try generating a daily summary in your app
3. Wait **30-60 seconds** (logs can be delayed)
4. **Refresh the logs page**
5. Look for these log messages:

**Expected logs:**
```
[AI-GENERATE] Function called
[AI-GENERATE] Environment check: { hasOpenAIKey: true, ... }
[AI-GENERATE] API key found. Using: OpenAI
[AI-GENERATE] Processing request: { type: 'daily_summary', ... }
[AI-GENERATE] Plan check: { requiredPlan: 'pro', userPlan: 'free', ... }
```

**If you see:**
- `Plan gate blocked: user has free, needs pro` → You need a Pro subscription
- `ERROR: No API key found` → `OPENAI_API_KEY` secret not set
- `401 Unauthorized` → Invalid API key
- `404 Model not found` → Model name might be wrong

---

## Step 4: Test Different AI Features

To isolate the issue, test these:

| Feature | Plan Required | Function | Should Work? |
|---------|---------------|----------|--------------|
| Reflection Prompts | Free | `ai-generate` | ✅ Yes |
| Daily Prompts | Free | `ai-generate` | ✅ Yes |
| Insights | Free | `ai-generate` | ✅ Yes |
| Mirror Reflections | Free | `ai-generate` | ✅ Yes |
| **Daily Summary** | **Pro** | `ai-generate` | ⚠️ **Requires Pro** |

If other features work but daily summary doesn't, it's likely the plan requirement.

---

## Step 5: Verify Model Name

The function uses `gpt-5-nano`. If that model doesn't exist, you'll get a 404 error.

**Check OpenAI docs:** https://platform.openai.com/docs/overview

**Common model names:**
- `gpt-5-nano` (currently set)
- `gpt-5.2-nano`
- `gpt-4o-mini` (if GPT-5 Nano doesn't exist)
- `gpt-4o` (latest full model)

If the model name is wrong, share the correct one and I'll update it.

---

## Step 6: Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Try generating a daily summary
4. Look for errors like:
   - Network errors
   - API call failures
   - Authentication errors

---

## Quick Diagnostic Checklist

- [ ] `OPENAI_API_KEY` secret is set in Supabase
- [ ] API key starts with `sk-` and is active
- [ ] Tried generating daily summary in calendar
- [ ] Checked function logs (wait 30-60 seconds, refresh)
- [ ] Checked browser console for errors
- [ ] Verified subscription plan (free/pro/premium)
- [ ] Other AI features work (reflection prompts, etc.)

---

## Most Likely Issues

### Issue 1: Plan Requirement (Most Likely)
**Symptom:** Daily summaries don't show, other AI works
**Cause:** Daily summary requires "pro" plan, you're on "free"
**Fix:** Upgrade to Pro, or temporarily change the requirement in code

### Issue 2: API Key Not Set
**Symptom:** Nothing works, logs show "No API key found"
**Fix:** Add `OPENAI_API_KEY` secret in Supabase

### Issue 3: Model Name Wrong
**Symptom:** 404 error in logs, "Model not found"
**Fix:** Update model name to correct identifier

### Issue 4: Logs Delayed
**Symptom:** Logs don't appear immediately
**Fix:** Wait 30-60 seconds and refresh logs page

---

## Next Steps

1. **Check your subscription plan** - Are you on free/pro/premium?
2. **Try generating a summary** - Calendar → Click date → Generate
3. **Check logs after 30-60 seconds** - Look for the new detailed logs
4. **Share what you see:**
   - What plan are you on?
   - What error appears in logs?
   - What error appears in browser console?

With that info, I can fix it immediately!

