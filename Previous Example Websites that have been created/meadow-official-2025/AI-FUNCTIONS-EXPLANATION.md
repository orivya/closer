# AI Functions Explanation

**Date:** December 23, 2025

---

## Overview

Your Meadow app has **two** AI edge functions, but only **one** is actually used by the frontend.

---

## Function Comparison

| Feature | `ai-generate` | `ai-reflection` |
|---------|---------------|----------------|
| **Used by Frontend?** | ✅ **YES** - Main function | ❌ **NO** - Legacy/unused |
| **AI Types Supported** | 5 types | 3 types |
| **Caching** | ✅ Yes | ❌ No |
| **Plan Gating** | ✅ Yes (Pro/Premium) | ❌ No |
| **Subscription Checks** | ✅ Yes | ❌ No |
| **Current API** | ✅ OpenAI (GPT-5 Mini) + Lovable fallback | ✅ OpenAI (GPT-5 Mini) + Lovable fallback |

---

## What Uses `ai-generate`?

The `ai-generate` function is called by the frontend for **all** AI features:

### 1. **Reflection Prompts** (`reflection_prompt`)
- **Where:** Editor → Guided Reflection
- **What it does:** Generates thoughtful follow-up questions based on journal entries
- **Service:** `AIService.getReflectionPrompt()`

### 2. **AI Insights** (`insight`)
- **Where:** Various places in the app
- **What it does:** Provides brief observations about patterns/themes in entries
- **Service:** `AIService.getInsight()`

### 3. **Daily Prompts** (`daily_prompt`)
- **Where:** Home/Explore pages
- **What it does:** Generates unique writing prompts for the day
- **Service:** `AIService.getDailyPrompt()`

### 4. **Daily Summary** (`daily_summary`)
- **Where:** Journal → Calendar → Click a date
- **What it does:** Summarizes all entries from a specific day (4-7 sentences)
- **Service:** `AIService.getDailySummary()`
- **Plan Required:** Pro or Premium

### 5. **Mirror Reflections** (`mirror_reflection`)
- **Where:** Spaces → The Mirror
- **What it does:** Generates 2-3 pattern-based reflections from recent entries
- **Service:** `AIService.getMirrorReflections()`

---

## What Uses `ai-reflection`?

**Nothing!** This function is **not used** by the frontend. It's a legacy function that was replaced by `ai-generate`.

---

## Current Configuration

### `ai-generate` (Main Function) ✅
- **Status:** Updated to use OpenAI with GPT-5 Mini
- **Fallback:** Uses Lovable if `OPENAI_API_KEY` is not set
- **Model:** `gpt-5-mini` (when using OpenAI)
- **Deployed:** ✅ Yes

### `ai-reflection` (Legacy Function) ⚠️
- **Status:** Updated but not used
- **Fallback:** Uses Lovable if `OPENAI_API_KEY` is not set
- **Model:** `gpt-5-mini` (when using OpenAI)
- **Deployed:** ✅ Yes (but not called by frontend)

---

## API Key Requirements

### For `ai-generate` (What You Actually Use):

| Scenario | API Key Needed | Behavior |
|----------|----------------|----------|
| **OpenAI Preferred** | `OPENAI_API_KEY` set | Uses OpenAI GPT-5 Mini |
| **Lovable Fallback** | Only `LOVABLE_API_KEY` set | Uses Lovable Gateway |
| **Both Set** | Both set | Uses OpenAI (preferred) |
| **Neither Set** | Neither set | ❌ Error |

---

## How to Test

### Test `ai-generate` (The One You Use):

1. **Reflection Prompts:**
   - Go to Editor → Create entry
   - Try "Guided Reflection"
   - Should generate a question

2. **Daily Summary:**
   - Go to Journal → Calendar
   - Click a date with entries
   - Click "Generate Summary"
   - Should create a summary

3. **Mirror Reflections:**
   - Go to Spaces → The Mirror
   - Should show AI-generated reflections

4. **Check Logs:**
   - Go to: https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/functions/ai-generate
   - Click **Logs** tab
   - Look for: `[AI-GENERATE] Processing reflection_prompt request (using OpenAI)`

---

## Logs Location

**For AI features you're actually using:**
- **Function:** `ai-generate`
- **Logs:** https://supabase.com/dashboard/project/jyaymqmbmvmhabmhfqeg/functions/ai-generate/logs

**Not this one (unused):**
- ~~`ai-reflection`~~ - This function isn't called by your frontend

---

## Summary

✅ **`ai-generate`** = The function your app actually uses (updated to OpenAI)  
⚠️ **`ai-reflection`** = Legacy function (updated but not used)

**All your AI features** (reflection prompts, daily summaries, mirror reflections, etc.) go through `ai-generate`, which now uses **OpenAI GPT-5 Mini** when `OPENAI_API_KEY` is set.

---

## Next Steps

1. ✅ `ai-generate` is updated and deployed
2. ✅ Uses OpenAI GPT-5 Mini when `OPENAI_API_KEY` is set
3. ✅ Falls back to Lovable if needed
4. 🧪 **Test it** - Try generating a reflection prompt or daily summary
5. 📊 **Check logs** - Verify it says `(using OpenAI)` in the logs

