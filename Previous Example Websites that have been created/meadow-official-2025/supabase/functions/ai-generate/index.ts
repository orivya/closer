import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AIType = "reflection_prompt" | "insight" | "daily_prompt" | "mirror_reflection" | "daily_summary";

const rankPlan = (plan: string) => {
  const p = (plan || "free").toLowerCase();
  if (p === "premium") return 2;
  if (p === "pro") return 1;
  return 0;
};

const redactPII = (text: string) => {
  if (!text) return text;
  // Basic redaction for emails + phone-like patterns
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[REDACTED_EMAIL]")
    .replace(/\b(\+?\d[\d\s().-]{7,}\d)\b/g, "[REDACTED_PHONE]");
};

const sha256Hex = async (input: string) => {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function getUserPlanCached(
  supabaseAdmin: any,
  userId: string,
  email: string | null,
) {
  // Cache subscription status for 1 hour to avoid repeated Stripe calls.
  const cacheKey = `subscription_status:v1`;
  const nowIso = new Date().toISOString();

  const { data: cached } = await supabaseAdmin
    .from("ai_cache")
    .select("content, expires_at")
    .eq("user_id", userId)
    .eq("feature_key", "subscription_status")
    .eq("cache_key", cacheKey)
    .gt("expires_at", nowIso)
    .maybeSingle();

  const cachedPlan = (cached as any)?.content?.plan;
  if (cachedPlan) return String(cachedPlan);

  // Fallback: infer from Stripe (same mapping as check-subscription).
  // If STRIPE_SECRET_KEY is missing or email is absent, default to free.
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey || !email) return "free";

  const Stripe = (await import("https://esm.sh/stripe@18.5.0")).default;
  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

  const customers = await stripe.customers.list({ email, limit: 1 });
  if (!customers.data.length) return "free";

  const customerId = customers.data[0].id;
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  });

  let plan = "free";
  let productId: string | null = null;
  let subscriptionEnd: string | null = null;
  const hasActiveSub = subscriptions.data.length > 0;
  if (hasActiveSub) {
    const sub = subscriptions.data[0];
    subscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
    productId = (sub.items.data[0]?.price?.product as string) ?? null;

    // Map product ID to plan name (keep in sync with check-subscription).
    if (productId === "prod_Tay6gr4CRAK4e1") plan = "premium";
    else if (productId === "prod_TdgrFoAQOPyfGs") plan = "pro";
  }

  // Store cache
  const ttlSeconds = 3600;
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  await (supabaseAdmin.from("ai_cache") as any).upsert(
    {
      user_id: userId,
      feature_key: "subscription_status",
      cache_key: cacheKey,
      content: { plan, subscribed: hasActiveSub, product_id: productId, subscription_end: subscriptionEnd },
      ttl_seconds: ttlSeconds,
      expires_at: expiresAt,
      source_hash: null,
    },
    { onConflict: "cache_key,user_id" },
  );

  return plan;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[AI-GENERATE] Function called");
    
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    
    // Try OPENAI_API_KEY first, fall back to LOVABLE_API_KEY for backward compatibility
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const useOpenAI = Boolean(OPENAI_API_KEY);
    const apiKey = OPENAI_API_KEY || LOVABLE_API_KEY;

    console.log("[AI-GENERATE] Environment check:", {
      hasSupabaseUrl: !!SUPABASE_URL,
      hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY,
      hasOpenAIKey: !!OPENAI_API_KEY,
      hasLovableKey: !!LOVABLE_API_KEY,
      usingOpenAI: useOpenAI
    });

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[AI-GENERATE] ERROR: Supabase env not configured");
      return json({ error: "Supabase env is not configured" }, 500);
    }
    if (!apiKey) {
      console.error("[AI-GENERATE] ERROR: No API key found. OPENAI_API_KEY:", !!OPENAI_API_KEY, "LOVABLE_API_KEY:", !!LOVABLE_API_KEY);
      return json({ error: "Neither OPENAI_API_KEY nor LOVABLE_API_KEY is configured" }, 500);
    }
    
    console.log(`[AI-GENERATE] API key found. Using: ${useOpenAI ? 'OpenAI' : 'Lovable'}`);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("[AI-GENERATE] ERROR: No authorization header");
      return json({ error: "Unauthorized" }, 401);
    }
    const token = authHeader.replace("Bearer ", "");

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError) return json({ error: `Authentication error: ${userError.message}` }, 401);
    const user = userData.user;
    if (!user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json();
    const type = String(body?.type ?? body?.feature_key ?? "") as AIType;
    const content = typeof body?.content === "string" ? body.content : "";
    const title = typeof body?.title === "string" ? body.title : "";
    const mood = typeof body?.mood === "string" ? body.mood : "";
    const entries = Array.isArray(body?.entries) ? body.entries : [];
    const dateKey =
      typeof body?.date_key === "string"
        ? body.date_key
        : typeof body?.dateKey === "string"
          ? body.dateKey
          : "";
    const force = Boolean(body?.force);

    console.log(`[AI-GENERATE] Processing request:`, { type, dateKey, entriesCount: entries.length, force });

    if (!["reflection_prompt", "insight", "daily_prompt", "mirror_reflection", "daily_summary"].includes(type)) {
      return json({ error: "Invalid type. Use 'reflection_prompt', 'insight', 'daily_prompt', 'mirror_reflection', or 'daily_summary'" }, 400);
    }

    // Optional: feature config from ai_features (if present).
    const { data: featureRow } = await supabaseAdmin
      .from("ai_features")
      .select("feature_key, is_enabled, requires_plan, ttl_seconds, cooldown_seconds, min_entries_required")
      .eq("feature_key", type)
      .maybeSingle();

    if (featureRow && featureRow.is_enabled === false) {
      return json({ error: "This AI feature is currently disabled." }, 403);
    }

    // Plan gating (default: free)
    // TEMPORARY: Allow daily_summary for free users for testing
    // TODO: Restore "pro" requirement: (type === "daily_summary" ? "pro" : "free")
    const requiredPlan = (featureRow as any)?.requires_plan ?? (type === "daily_summary" ? "free" : "free");
    const userPlan = await getUserPlanCached(supabaseAdmin, user.id, user.email ?? null);
    console.log(`[AI-GENERATE] Plan check:`, { type, requiredPlan, userPlan, userRank: rankPlan(userPlan), requiredRank: rankPlan(requiredPlan) });
    
    if (rankPlan(userPlan) < rankPlan(requiredPlan)) {
      console.log(`[AI-GENERATE] Plan gate blocked: user has ${userPlan}, needs ${requiredPlan}`);
      return json({ error: "Upgrade required for this AI feature.", required_plan: requiredPlan }, 402);
    }

    // Min entries gating (optional)
    const minEntries = (featureRow as any)?.min_entries_required ?? null;
    if (typeof minEntries === "number" && minEntries > 0) {
      const { count } = await supabaseAdmin
        .from("journal_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      if ((count ?? 0) < minEntries) {
        return json({ error: "Not enough journal entries to use this feature yet.", min_entries_required: minEntries }, 403);
      }
    }

    // For mirror_reflection, require at least 5 entries
    if (type === "mirror_reflection") {
      const { count } = await supabaseAdmin
        .from("journal_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      if ((count ?? 0) < 5) {
        return json({ error: "Write at least 5 entries to see reflections.", min_entries_required: 5 }, 403);
      }
    }

    // Caching
    const nowIso = new Date().toISOString();
    const ttlSeconds = Number((featureRow as any)?.ttl_seconds ?? (type === "daily_prompt" || type === "daily_summary" ? 86400 : 3600));
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();

    let sourceHash = null as string | null;
    let cacheKey = "";
    if (type === "daily_prompt") {
      const dayKey = new Date().toISOString().slice(0, 10);
      cacheKey = `daily_prompt:${dayKey}:v1`;
      sourceHash = await sha256Hex(cacheKey);
    } else if (type === "daily_summary") {
      const dayKey = dateKey || new Date().toISOString().slice(0, 10);
      const entriesHash = await sha256Hex(JSON.stringify(entries.map((e: any) => e.id).sort()));
      cacheKey = `daily_summary:${dayKey}:${entriesHash}:v1`;
      sourceHash = await sha256Hex(cacheKey);
    } else if (type === "mirror_reflection") {
      // Cache mirror reflections for 24 hours, keyed by entry count hash
      const entriesHash = await sha256Hex(JSON.stringify(entries.map((e: any) => e.id).sort()));
      const dayKey = new Date().toISOString().slice(0, 10);
      cacheKey = `mirror_reflection:${dayKey}:${entriesHash}:v1`;
      sourceHash = await sha256Hex(cacheKey);
    } else {
      const cleaned = redactPII(`${title}\n${mood}\n${content}`.slice(0, 20_000));
      sourceHash = await sha256Hex(cleaned);
      cacheKey = `${type}:${sourceHash}:v1`;
    }

    const { data: cached } = await supabaseAdmin
      .from("ai_cache")
      .select("content, expires_at")
      .eq("user_id", user.id)
      .eq("feature_key", type)
      .eq("cache_key", cacheKey)
      .gt("expires_at", nowIso)
      .maybeSingle();

    if (!force && cached?.content) {
      return json({ result: (cached as any).content?.result ?? null, cached: true });
    }

    // Prompting
    let systemPrompt = "";
    let userPrompt = "";
    if (type === "reflection_prompt") {
      systemPrompt =
        "You are a thoughtful journaling companion. Generate a single, gentle, open-ended follow-up question based on what the user wrote. Return ONLY the question.";
      userPrompt = `Title: ${title || "Untitled"}\n\nEntry:\n${redactPII(content)}`;
    } else if (type === "insight") {
      systemPrompt =
        "You are a compassionate journaling AI. Provide a brief, supportive observation about patterns/themes you notice. Keep it to 1-2 sentences.";
      userPrompt = `Title: ${title || "Untitled"}\nMood: ${mood || "not specified"}\n\nEntry:\n${redactPII(content)}`;
    } else if (type === "daily_summary") {
      systemPrompt =
        "You are a thoughtful journaling companion. Summarize the user's journal entries from the day in 4-7 sentences. Include 2-3 themes you notice, the emotional tone, and one gentle question or suggestion for tomorrow. Return plain text only. Avoid quoting more than 12 words from the user.";

      const entriesText = entries
        .slice(0, 12)
        .map((e: any, i: number) => {
          const t = e?.title ? String(e.title) : "Untitled";
          const c = e?.content ? String(e.content) : "";
          return `Entry ${i + 1}:\nTitle: ${t}\n${redactPII(c.slice(0, 1200))}`;
        })
        .join("\n\n");

      userPrompt = `Date: ${dateKey || "today"}\n\nHere are the user's entries for this day:\n\n${entriesText}\n\nWrite the daily summary now.`;
    } else if (type === "mirror_reflection") {
      systemPrompt = `You are a thoughtful journaling companion that helps users see patterns in their writing. Based on their recent journal entries, generate 2-3 meaningful reflections.

Each reflection should be returned as JSON with this structure:
{
  "reflections": [
    {
      "title": "Short headline (5-8 words)",
      "text": "Main observation or question (1-2 sentences)",
      "context": "Why this matters (1-2 sentences)",
      "action": "Suggested writing prompt"
    }
  ]
}

Focus on:
- Patterns, themes, or connections across entries
- Gentle observations, not judgments
- Questions that invite deeper reflection
- Actionable prompts for further writing

Be insightful but not prescriptive. Speak with empathy.`;
      
      const entriesText = entries
        .slice(0, 20)
        .map((e: any, i: number) => {
          const date = e.created_at ? new Date(e.created_at).toLocaleDateString() : "";
          return `Entry ${i + 1} (${date}):\nTitle: ${e.title || "Untitled"}\n${redactPII((e.content || "").slice(0, 500))}`;
        })
        .join("\n\n");
      
      userPrompt = `Here are the user's recent journal entries:\n\n${entriesText}\n\nGenerate 2-3 reflections based on patterns you notice.`;
    } else {
      systemPrompt =
        "You are a creative journaling prompt generator. Generate one unique, inspiring prompt. Return ONLY the prompt text.";
      userPrompt = "Generate one daily journaling prompt.";
    }

    // Use OpenAI API if OPENAI_API_KEY is set, otherwise use Lovable gateway
    const apiUrl = useOpenAI 
      ? "https://api.openai.com/v1/chat/completions"
      : "https://ai.gateway.lovable.dev/v1/chat/completions";
    
    const model = useOpenAI
      ? "gpt-5-nano"  // OpenAI's fastest, cheapest GPT-5 model
      : "google/gemini-2.5-flash";  // Lovable gateway model

    const requestBody: any = {
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    };

    if (type === "mirror_reflection") {
      requestBody.response_format = { type: "json_object" };
    }

    console.log(`[AI-GENERATE] Processing ${type} request (using ${useOpenAI ? 'OpenAI' : 'Lovable'})`);

    const aiResp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!aiResp.ok) {
      const errorText = await aiResp.text();
      console.error(`[AI-GENERATE] ${useOpenAI ? 'OpenAI' : 'Lovable'} AI error:`, aiResp.status, errorText);
      console.error(`[AI-GENERATE] Request details:`, { model, apiUrl, type });
      
      if (aiResp.status === 429) return json({ error: "Rate limit exceeded. Please try again later." }, 429);
      if (aiResp.status === 402) return json({ error: "AI credits exhausted. Please add funds." }, 402);
      if (aiResp.status === 401) return json({ error: "Invalid API key. Please check your configuration." }, 401);
      if (aiResp.status === 404) return json({ error: `Model "${model}" not found. Please check the model name.` }, 404);
      
      return json({ error: `AI request failed: ${errorText || aiResp.statusText}` }, 500);
    }

    const aiData = await aiResp.json();
    let result = aiData?.choices?.[0]?.message?.content?.trim?.() ?? null;
    
    // Parse JSON for mirror_reflection
    if (type === "mirror_reflection" && result) {
      try {
        const parsed = JSON.parse(result);
        result = parsed.reflections || parsed;
      } catch (e) {
        console.error("[AI-GENERATE] Failed to parse mirror_reflection JSON:", e);
        // Fallback: try to extract reflections from text
        result = null;
      }
    }

    // Store cache (ignore type check for upsert)
    await (supabaseAdmin.from("ai_cache") as any).upsert(
      {
        user_id: user.id,
        feature_key: type,
        cache_key: cacheKey,
        content: { result },
        ttl_seconds: ttlSeconds,
        expires_at: expiresAt,
        source_hash: sourceHash,
      },
      { onConflict: "cache_key,user_id" },
    );

    return json({ result, cached: false });
  } catch (error) {
    console.error("Error in ai-generate function:", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});


