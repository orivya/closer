# OpenAI API Key Testing Guide

**Date:** December 23, 2025

---

## ✅ Current Configuration

### Models Used:
- **`ai-reflection`**: Uses `gpt-4o` (latest OpenAI model) when `OPENAI_API_KEY` is set
- **`ai-generate`**: Still uses Lovable gateway (needs update)

### Latest OpenAI Models:
- **`gpt-4o`** - Latest, most capable model (currently set)
- **`gpt-4o-mini`** - Latest mini model (faster, cheaper)

**Note:** "ChatGPT-5" doesn't exist yet. `gpt-4o` is the latest model as of December 2025.

---

## 🧪 How to Test Your OpenAI API Key

### Method 1: Test in Your App (Easiest)

1. **Temporarily disable LOVABLE_API_KEY:**
   - Go to: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/settings/functions
   - Find `LOVABLE_API_KEY` in the secrets list
   - Click **Delete** (or rename it to `LOVABLE_API_KEY_DISABLED`)
   - This forces the function to use `OPENAI_API_KEY`

2. **Test the function:**
   - Go to your app → Editor
   - Create a new entry
   - Try the "Guided Reflection" feature
   - Check if it generates a reflection prompt

3. **Check function logs:**
   - Go to: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/functions/ai-reflection
   - Click **Logs** tab
   - Look for: `Processing reflection_prompt request (using OpenAI)`
   - If you see errors, check the error message

### Method 2: Test with cURL (Command Line)

```bash
# Replace YOUR_API_KEY with your actual OpenAI API key
curl -X POST "https://api.openai.com/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Say hello in one word."}
    ],
    "max_tokens": 10
  }'
```

**Expected Response:**
```json
{
  "choices": [{
    "message": {
      "content": "Hello"
    }
  }]
}
```

### Method 3: Use the Test Script

```bash
chmod +x test-openai-key.sh
./test-openai-key.sh
```

---

## 🔧 How to Disable LOVABLE_API_KEY Temporarily

### Option 1: Delete the Secret (Recommended)

1. Go to: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/settings/functions
2. Find `LOVABLE_API_KEY` in the secrets list
3. Click the **trash icon** to delete it
4. Test your app
5. **To re-enable:** Add it back with the same name

### Option 2: Rename the Secret

1. Go to secrets page
2. Click on `LOVABLE_API_KEY`
3. Rename it to `LOVABLE_API_KEY_DISABLED`
4. Save
5. Test your app
6. **To re-enable:** Rename it back to `LOVABLE_API_KEY`

### Option 3: Set Empty Value

1. Go to secrets page
2. Click on `LOVABLE_API_KEY`
3. Clear the value (leave it empty)
4. Save
5. Test your app
6. **To re-enable:** Paste the key back

---

## ✅ Verification Checklist

After disabling `LOVABLE_API_KEY`, verify:

- [ ] Function logs show: `(using OpenAI)` instead of `(using Lovable)`
- [ ] Reflection prompts generate successfully
- [ ] No errors in function logs
- [ ] Response quality is good

---

## 🔍 What to Look For in Logs

### Success Indicators:
```
Processing reflection_prompt request (using OpenAI)
Generated reflection_prompt: What patterns do you notice...
```

### Error Indicators:
```
Error: Neither OPENAI_API_KEY nor LOVABLE_API_KEY is configured
```
→ **Fix:** Make sure `OPENAI_API_KEY` is set in Supabase secrets

```
AI gateway error: 401
```
→ **Fix:** Invalid API key - check for typos

```
AI gateway error: 429
```
→ **Fix:** Rate limit exceeded - wait a moment and try again

```
AI gateway error: 402
```
→ **Fix:** Insufficient credits in OpenAI account

---

## 📝 Model Options

If you want to use a different model, edit the function:

**File:** `supabase/functions/ai-reflection/index.ts`

**Current:**
```typescript
const model = useOpenAI
  ? "gpt-4o"  // Latest OpenAI model
  : "google/gemini-2.5-flash";
```

**Options:**
- `"gpt-4o"` - Latest, most capable (currently set)
- `"gpt-4o-mini"` - Faster, cheaper, still very capable
- `"gpt-4-turbo"` - Previous generation
- `"gpt-3.5-turbo"` - Cheapest option

After changing, redeploy:
```bash
npx -y supabase functions deploy ai-reflection
```

---

## 🎯 Quick Test Steps

1. **Disable LOVABLE_API_KEY** (delete or rename in Supabase secrets)
2. **Test in app** - Try generating a reflection prompt
3. **Check logs** - Verify it says "(using OpenAI)"
4. **Verify response** - Should get a reflection question
5. **Re-enable LOVABLE_API_KEY** if needed (for fallback)

---

## 🚨 Troubleshooting

### "Neither OPENAI_API_KEY nor LOVABLE_API_KEY is configured"
- ✅ Make sure `OPENAI_API_KEY` is set in Supabase secrets
- ✅ Secret name must be exactly `OPENAI_API_KEY`

### "401 Unauthorized"
- ✅ Check API key for typos
- ✅ Make sure key starts with `sk-`
- ✅ Verify key is active in OpenAI dashboard

### "429 Rate Limit"
- ✅ Wait a few minutes
- ✅ Check OpenAI usage limits
- ✅ Consider upgrading OpenAI plan

### Still using Lovable?
- ✅ Make sure `LOVABLE_API_KEY` is deleted/disabled
- ✅ Check function logs to see which API is being used
- ✅ Redeploy function if you just updated it

---

## ✅ Summary

**Current Status:**
- ✅ `ai-reflection` uses `gpt-4o` (latest model) when `OPENAI_API_KEY` is set
- ✅ Falls back to Lovable if `OPENAI_API_KEY` is not set
- ⚠️ `ai-generate` still uses Lovable only (can be updated if needed)

**To Test:**
1. Disable `LOVABLE_API_KEY` in Supabase secrets
2. Test reflection prompts in your app
3. Check logs to verify OpenAI is being used
4. Re-enable `LOVABLE_API_KEY` if you want fallback

