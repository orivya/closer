# How to Verify OpenAI API Key in Supabase

**Issue:** "Couldn't generate the summary right now" - API key not working

---

## Step 1: Check if Secret is Set

1. Go to: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/settings/functions
2. Scroll to **"Secrets"** section
3. Look for `OPENAI_API_KEY` in the list

**If you see it:**
- ✅ Secret exists
- Check the value (click to view/edit)

**If you DON'T see it:**
- ❌ Secret is missing
- Need to add it

---

## Step 2: Add/Update the Secret

### Option A: Add New Secret

1. In the Secrets section, click **"Add new secret"** or **"New secret"**
2. **Name:** `OPENAI_API_KEY` (must be exact, case-sensitive)
3. **Value:** Your OpenAI API key (starts with `sk-`)
4. Click **"Save"** or **"Add"**

### Option B: Update Existing Secret

1. Find `OPENAI_API_KEY` in the secrets list
2. Click on it to edit
3. Verify the value is correct (should start with `sk-`)
4. Make sure there are no extra spaces or line breaks
5. Click **"Save"**

---

## Step 3: Verify the Key Format

Your OpenAI API key should:
- ✅ Start with `sk-`
- ✅ Be about 50+ characters long
- ✅ Have no spaces or line breaks
- ✅ Be from your OpenAI account (not a test key)

**Example format:**
```
sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

---

## Step 4: Check Function Logs for Errors

After setting the secret, test again and check logs:

1. Go to: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/functions/ai-generate/logs
2. Try generating a summary in your app
3. Wait 10-30 seconds
4. Refresh the logs page
5. Look for error messages

**Common errors:**

| Error | Meaning | Fix |
|-------|---------|-----|
| `"Neither OPENAI_API_KEY nor LOVABLE_API_KEY is configured"` | Secret not set | Add `OPENAI_API_KEY` secret |
| `"401 Unauthorized"` | Invalid API key | Check key for typos |
| `"429 Rate limit"` | Too many requests | Wait a few minutes |
| `"Model not found"` | Wrong model name | Model might be `gpt-5-mini` or different |

---

## Step 5: Test the Secret Directly

You can test if the secret is being read correctly by checking function logs:

1. Generate a summary in your app
2. Check logs immediately after
3. Look for: `[AI-GENERATE] Processing daily_summary request (using OpenAI)`
4. If you see `(using Lovable)` instead, the `OPENAI_API_KEY` secret is not set or not being read

---

## Troubleshooting

### Secret Not Working?

1. **Verify secret name is exact:**
   - Must be: `OPENAI_API_KEY`
   - Not: `OPENAI_API_KEY ` (with space)
   - Not: `openai_api_key` (lowercase)
   - Not: `OPENAI-API-KEY` (with dashes)

2. **Check for hidden characters:**
   - Copy the key again from OpenAI dashboard
   - Paste it fresh into Supabase secrets
   - Make sure no extra spaces before/after

3. **Redeploy function (if needed):**
   ```bash
   npx -y supabase functions deploy ai-generate
   ```

4. **Verify key is active:**
   - Go to: https://platform.openai.com/api-keys
   - Make sure the key is active (not revoked)
   - Check if you have credits/usage limits

---

## Quick Checklist

- [ ] Secret name is exactly `OPENAI_API_KEY`
- [ ] Secret value starts with `sk-`
- [ ] No extra spaces in the key
- [ ] Key is active in OpenAI dashboard
- [ ] Function logs show `(using OpenAI)` not `(using Lovable)`
- [ ] No errors in function logs

---

## Still Not Working?

If it still doesn't work after checking everything:

1. **Share the exact error message** from function logs
2. **Check if the key works** by testing it directly:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```
3. **Verify the model name** - might need to be `gpt-4o-mini` instead of `gpt-5-mini`

