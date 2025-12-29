import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, currentSummary } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build conversation text
    const conversationText = messages
      .map((m: { role: string; content: string }) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    let prompt: string;
    
    if (currentSummary) {
      // Update summary prompt
      prompt = `CURRENT SUMMARY: "${currentSummary}"

Based on how this conversation has evolved, determine if a new summary would be more impactful or accurate.

Consider:
- Has the conversation gone significantly deeper?
- Has the core topic or question shifted meaningfully?
- Is there now a clearer way to capture what's being explored?
- Has something been resolved or transformed?

RULES:
- If the current summary is still the best representation, respond with exactly: "keep"
- If a meaningfully better summary exists, respond with the new summary only
- Don't change just for the sake of changing — only if genuinely more impactful
- Small additions to the conversation don't warrant a new summary

CONVERSATION:
${conversationText}

Respond with "keep" or the new summary only.`;
    } else {
      // First summary prompt
      prompt = `Analyze this conversation and generate a 1-2 sentence summary of what is being explored.

RULES:
- Only respond if the conversation has genuine depth or substance
- If it's casual small talk, greetings, or too shallow, respond with exactly: "none"
- The summary should capture the core question, tension, or exploration
- Write in present tense ("Exploring..." or "Working through...")
- Be specific to this conversation, not generic

GOOD EXAMPLES:
- "Exploring the tension between career growth and loyalty to a team you helped build"
- "Working through why a difficult conversation keeps getting postponed"
- "Unpacking what's behind the pattern of seeking permission before acting"

BAD EXAMPLES (too generic):
- "Discussing work and life decisions"
- "Talking about feelings and thoughts"
- "Having a conversation about career"

CONVERSATION:
${conversationText}

Respond with the summary only, or "none" if not substantial enough.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5-mini",
        messages: [
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim() || "none";

    console.log("Summary generation result:", result);

    return new Response(JSON.stringify({ summary: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-summary function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
