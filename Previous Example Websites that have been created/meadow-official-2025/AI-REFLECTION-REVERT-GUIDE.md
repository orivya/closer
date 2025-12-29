# AI Reflection Function - Revert Guide

**Updated:** December 23, 2025  
**Change:** Updated to use `OPENAI_API_KEY` with fallback to `LOVABLE_API_KEY`

---

## Current Implementation

The `ai-reflection` function now:
1. ✅ **Tries `OPENAI_API_KEY` first** (if set)
2. ✅ **Falls back to `LOVABLE_API_KEY`** (if `OPENAI_API_KEY` is not set)
3. ✅ **Uses OpenAI API** when `OPENAI_API_KEY` is available
4. ✅ **Uses Lovable Gateway** when only `LOVABLE_API_KEY` is available

This means it works with **either** key, so you don't need to revert unless you specifically want to force Lovable-only.

---

## How to Revert to Lovable-Only (If Needed)

If you want to force it to use **only** `LOVABLE_API_KEY` and ignore `OPENAI_API_KEY`:

### Step 1: Edit the Function

File: `supabase/functions/ai-reflection/index.ts`

**Change this:**
```typescript
// Try OPENAI_API_KEY first, fall back to LOVABLE_API_KEY for backward compatibility
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const useOpenAI = Boolean(OPENAI_API_KEY);
const apiKey = OPENAI_API_KEY || LOVABLE_API_KEY;

if (!apiKey) {
  throw new Error("Neither OPENAI_API_KEY nor LOVABLE_API_KEY is configured");
}
```

**Back to this:**
```typescript
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

if (!LOVABLE_API_KEY) {
  throw new Error("LOVABLE_API_KEY is not configured");
}
```

**And change this:**
```typescript
console.log(`Processing ${type} request (using ${useOpenAI ? 'OpenAI' : 'Lovable'})`);

// Use OpenAI API if OPENAI_API_KEY is set, otherwise use Lovable gateway
const apiUrl = useOpenAI 
  ? "https://api.openai.com/v1/chat/completions"
  : "https://ai.gateway.lovable.dev/v1/chat/completions";

const model = useOpenAI
  ? "gpt-4o-mini"  // OpenAI model
  : "google/gemini-2.5-flash";  // Lovable gateway model

const response = await fetch(apiUrl, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
  }),
});
```

**Back to this:**
```typescript
console.log(`Processing ${type} request`);

const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
  }),
});
```

### Step 2: Redeploy

```bash
cd /Users/bchill/Documents/Cursor\ Projects/Meadow/meadow-official-2025
export SUPABASE_ACCESS_TOKEN="sbp_aa336e080b787b7668e17df9ba986352f5835b89"
npx -y supabase functions deploy ai-reflection
```

---

## Why You Probably Don't Need to Revert

The current implementation is **backward compatible**:
- ✅ If you have `OPENAI_API_KEY` set → Uses OpenAI
- ✅ If you only have `LOVABLE_API_KEY` set → Uses Lovable (same as before)
- ✅ If you have both → Uses OpenAI (preferred)

**To force Lovable-only**, simply **remove** `OPENAI_API_KEY` from Supabase secrets, and it will automatically use `LOVABLE_API_KEY`.

---

## Testing

After deployment, test the function:
1. Try generating a reflection prompt in the Editor
2. Check function logs: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/functions/ai-reflection
3. Look for log message: `Processing reflection_prompt request (using OpenAI)` or `(using Lovable)`

---

## Quick Revert Command

If you want to quickly revert, just ask me and I can:
1. Restore the original code
2. Redeploy the function

But again, you probably don't need to - the current version works with either key!

