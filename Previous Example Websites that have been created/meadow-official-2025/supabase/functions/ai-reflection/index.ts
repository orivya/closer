import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, content, title, mood } = await req.json();
    
    // Try OPENAI_API_KEY first, fall back to LOVABLE_API_KEY for backward compatibility
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const useOpenAI = Boolean(OPENAI_API_KEY);
    const apiKey = OPENAI_API_KEY || LOVABLE_API_KEY;
    
    if (!apiKey) {
      throw new Error("Neither OPENAI_API_KEY nor LOVABLE_API_KEY is configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "reflection_prompt") {
      // Generate a reflection prompt based on the entry content
      systemPrompt = `You are a thoughtful journaling companion. Your role is to help users reflect more deeply on their thoughts and feelings. Generate a single, thought-provoking follow-up question that encourages deeper self-reflection. The question should be:
- Personal and relevant to what they wrote
- Open-ended (not yes/no)
- Gentle and non-judgmental
- Focused on feelings, patterns, or future possibilities
Keep your response to just the question, nothing else.`;
      
      userPrompt = `Based on this journal entry, generate one reflection question:\n\nTitle: ${title || 'Untitled'}\nContent: ${content}`;
    } 
    else if (type === "insight") {
      // Generate an insight/pattern observation
      systemPrompt = `You are a compassionate journaling AI that helps users see patterns and insights in their writing. Provide a brief, supportive observation about what you notice in their entry. Focus on:
- Emotional themes
- Potential patterns or connections
- Strengths or growth you observe
Keep your response to 1-2 sentences, warm and encouraging.`;
      
      userPrompt = `Provide a brief insight for this journal entry:\n\nTitle: ${title || 'Untitled'}\nMood: ${mood || 'not specified'}\nContent: ${content}`;
    }
    else if (type === "daily_prompt") {
      // Generate a daily writing prompt
      systemPrompt = `You are a creative journaling prompt generator. Generate a single, inspiring writing prompt for someone starting their journaling session. The prompt should be:
- Thought-provoking but accessible
- Varied in topic (sometimes about feelings, sometimes memories, sometimes future, sometimes gratitude)
- Written in second person ("What..." or "Describe...")
Keep your response to just the prompt, nothing else.`;
      
      userPrompt = "Generate one unique daily journaling prompt.";
    }
    else {
      throw new Error("Invalid type. Use 'reflection_prompt', 'insight', or 'daily_prompt'");
    }

    console.log(`Processing ${type} request (using ${useOpenAI ? 'OpenAI' : 'Lovable'})`);

    // Use OpenAI API if OPENAI_API_KEY is set, otherwise use Lovable gateway
    const apiUrl = useOpenAI 
      ? "https://api.openai.com/v1/chat/completions"
      : "https://ai.gateway.lovable.dev/v1/chat/completions";
    
    const model = useOpenAI
      ? "gpt-5-nano"  // Latest OpenAI model (GPT-5 Nano)
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

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;

    console.log(`Generated ${type}:`, result?.substring(0, 100));

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in ai-reflection function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
