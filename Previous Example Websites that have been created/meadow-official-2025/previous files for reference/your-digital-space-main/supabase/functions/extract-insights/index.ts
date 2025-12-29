import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExtractedInsight {
  type: "theme" | "observation" | "constraint" | "strength" | "blind_spot" | "shift";
  content: string;
  context: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, existingInsights, remainingSlots } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // If no remaining slots, return empty
    if (remainingSlots !== undefined && remainingSlots <= 0) {
      console.log("No remaining slots for insights");
      return new Response(JSON.stringify({ insights: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build conversation text
    const conversationText = messages
      .map((m: { role: string; content: string }) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n\n");

    // Format existing insights
    let existingInsightsText = "None yet";
    if (existingInsights && Array.isArray(existingInsights) && existingInsights.length > 0) {
      existingInsightsText = existingInsights
        .map((i: { type: string; content: string }) => `- [${i.type}] ${i.content}`)
        .join("\n");
    }

    const prompt = `Analyze this conversation and extract meaningful insights.

CRITICAL RULES:
- Only extract genuinely NEW insights, not variations of existing ones
- Maximum 5-6 insights total per session — we already have: ${existingInsights?.length || 0}
- If the conversation hasn't revealed anything new since last extraction, return empty array
- Quality over quantity — one meaningful insight is better than three generic ones
- Do NOT repeat or rephrase insights that already exist

STRICT LIMITS:
- Return AT MOST 1-2 new insights per extraction
- Prefer 1 high-quality insight over 2 mediocre ones
- If nothing genuinely new since last extraction, return empty array

ALREADY EXTRACTED THIS SESSION:
${existingInsightsText}

For each insight, provide:
- type: one of "theme" | "observation" | "constraint" | "strength" | "blind_spot" | "shift"
- content: The insight itself (1-2 sentences max)
- context: Brief note on what triggered this insight (1 sentence)

INSIGHT TYPES:

THEME — A topic discussed with depth or mentioned multiple times
- Must be specific ("Career transition anxiety" not "Work")

OBSERVATION — Something the user revealed about themselves
- Near-direct quote or close paraphrase
- Example: "I tend to overthink when the stakes feel high"

CONSTRAINT — A limitation the user mentioned
- Time, money, energy, relationships, circumstances
- Example: "Limited bandwidth due to current role demands"

STRENGTH — Resources, abilities, or support systems
- Example: "Strong relationship with mentor"

BLIND_SPOT — A pattern the user might not see
- Must have clear evidence from conversation
- Example: "Framing 'staying' as loyalty, but it may also be avoiding risk"

SHIFT — A change in thinking during the conversation
- Format as "X → Y" when possible
- Example: "Saw it as failure → Now sees it as data"

DEDUPLICATION RULES:
- Check each potential insight against the existing list above
- If a new insight is >50% similar in wording or meaning, do NOT include it
- Variations or rewordings of existing insights should be skipped
- Only extract what is clearly NEW information

QUALITY RULES:
- Only extract what is clearly supported by the conversation
- Do not invent, assume, or reach — if it's not clearly there, leave it empty
- Observations should sound like the user, not clinical descriptions

Return JSON only, no other text:
{
  "insights": [
    {
      "type": "constraint",
      "content": "Time consumed by work leaves nothing for personal projects",
      "context": "Emerged when discussing daily routine and energy levels"
    }
  ]
}

If nothing meaningful or new to extract, return:
{
  "insights": []
}

CONVERSATION:
${conversationText}`;

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
    let resultText = data.choices?.[0]?.message?.content?.trim() || "";

    console.log("Raw insight extraction result:", resultText);

    // Clean up JSON - remove markdown code blocks if present
    resultText = resultText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let insights: ExtractedInsight[] = [];
    try {
      const parsed = JSON.parse(resultText);
      insights = parsed.insights || [];
    } catch (parseError) {
      console.error("Failed to parse insights JSON:", parseError, "Raw:", resultText);
      insights = [];
    }

    // Limit to max 2 insights per extraction
    if (insights.length > 2) {
      insights = insights.slice(0, 2);
    }

    console.log("Returning insights:", insights);

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in extract-insights function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
