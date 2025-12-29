import { GoogleGenAI } from "@google/genai";

// Helper to get client with current env key
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY not found in environment");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCommitMessage = async (
  filename: string,
  oldContent: string,
  newContent: string
): Promise<string> => {
  try {
    const ai = getClient();
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      You are an expert developer. 
      Generate a concise, conventional git commit message (max 50 chars for title) for the following change.
      
      Filename: ${filename}
      
      Old Content Snippet (first 200 chars):
      ${oldContent.slice(0, 200)}...
      
      New Content Snippet (first 200 chars):
      ${newContent.slice(0, 200)}...
      
      If the content is vastly different, just summarize the file purpose.
      Return ONLY the commit message string.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    return response.text?.trim() || `Update ${filename}`;
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Update ${filename}`; // Fallback
  }
};

export const analyzeCode = async (code: string, filename: string): Promise<string> => {
  try {
    const ai = getClient();
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      Analyze the following code file named "${filename}".
      Provide a brief summary of what it does and 3 bullet points for potential improvements or bugs.
      Keep it concise (under 150 words total).
      
      Code:
      ${code.slice(0, 3000)} ${code.length > 3000 ? '...(truncated)' : ''}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    return response.text?.trim() || "Unable to analyze code.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI analysis failed. Please check your API key quota.";
  }
};

export const refactorCode = async (code: string, instruction: string, filename: string): Promise<string> => {
  try {
    const ai = getClient();
    // Using Pro model for complex coding tasks
    const model = "gemini-3-pro-preview";
    
    const prompt = `
      You are an expert software engineer.
      
      TASK: Update the following code file based on the user's instruction.
      FILENAME: ${filename}
      INSTRUCTION: ${instruction}
      
      CODE:
      ${code}
      
      OUTPUT REQUIREMENTS:
      - Return ONLY the full updated code.
      - Do not include markdown formatting (like \`\`\`tsx).
      - Do not include explanations.
      - Maintain existing code style.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    let result = response.text?.trim() || code;
    
    // Cleanup markdown if AI adds it
    if (result.startsWith('```')) {
      const lines = result.split('\n');
      // If it starts with ```language, remove first and last line
      if (lines.length > 2) {
        result = lines.slice(1, -1).join('\n');
      }
    }
    
    return result;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("AI Refactor failed.");
  }
};