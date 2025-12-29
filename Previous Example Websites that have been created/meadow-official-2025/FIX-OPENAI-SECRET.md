# Fix OpenAI API Key Configuration

**Error:** "Couldn't generate the summary right now"

---

## Quick Fix Steps

### 1. Verify Secret is Set Correctly

**Go to Supabase Dashboard:**
1. https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/settings/functions
2. Scroll to **"Secrets"** section
3. Look for `OPENAI_API_KEY`

**If it's missing or wrong:**

1. Click **"Add new secret"** (or edit existing)
2. **Secret Name:** `OPENAI_API_KEY` (exact, case-sensitive)
3. **Secret Value:** Your OpenAI API key (starts with `sk-`)
4. Click **"Save"**

**Important:** 
- Name must be exactly: `OPENAI_API_KEY`
- No spaces before/after
- Value should start with `sk-`

---

### 2. Check Function Logs for Exact Error

**Go to logs:**
1. https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/functions/ai-generate/logs
2. Try generating a summary again
3. Wait 10-30 seconds
4. Refresh the logs page
5. Look for the error message

**Common errors you might see:**

| Error Message | What It Means | How to Fix |
|---------------|---------------|------------|
| `"Neither OPENAI_API_KEY nor LOVABLE_API_KEY is configured"` | Secret not set | Add `OPENAI_API_KEY` secret |
| `"401 Unauthorized"` | Invalid API key | Check key for typos, verify it's active |
| `"Model not found"` or `"Invalid model"` | Wrong model name | Model might need to be `gpt-4o-mini` instead |
| `"429 Rate limit"` | Too many requests | Wait a few minutes |

---

### 3. Verify Your OpenAI API Key Works

**Test the key directly:**

1. Go to: https://platform.openai.com/api-keys
2. Make sure your key is **active** (not revoked)
3. Check your **usage/billing** - make sure you have credits

**Or test with curl:**
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY_HERE"
```

Should return a list of models (not an error).

---

### 4. Possible Model Name Issue

The function uses `gpt-5-mini` - if that model doesn't exist, try:

**Option 1: Check what models are available**
- Go to: https://platform.openai.com/docs/models
- See what the actual model name is

**Option 2: Try common model names:**
- `gpt-4o-mini` (latest mini model)
- `gpt-4o` (latest full model)
- `gpt-4-turbo`

If `gpt-5-mini` doesn't exist, I can update the function to use the correct model name.

---

### 5. After Fixing - Test Again

1. **Set/update the secret** in Supabase
2. **Wait 10 seconds** (secrets update immediately)
3. **Try generating a summary** in your app
4. **Check logs** - should see `(using OpenAI)` not `(using Lovable)`

---

## Still Not Working?

**Share with me:**
1. The **exact error message** from function logs
2. Whether you see `OPENAI_API_KEY` in the secrets list
3. Whether the key starts with `sk-` and is active

Then I can help debug further!

