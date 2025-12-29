import { supabase } from '../src/integrations/supabase/client';
import { SettingsService } from './settings';

export interface AIReflectionResponse {
  result: string;
  error?: string;
}

export interface DailySummaryResult {
  summary: string | null;
  cached?: boolean;
  error?: string;
  requiredPlan?: string;
}

export const AIService = {
  /**
   * Generate a reflection prompt based on journal entry content
   */
  async getReflectionPrompt(content: string, title?: string): Promise<string | null> {
    try {
      const settings = await SettingsService.getSettings();
      if (settings?.ai_opt_out) return null;

      const { data, error } = await supabase.functions.invoke('ai-generate', {
        body: { type: 'reflection_prompt', content, title }
      });

      if (error) {
        console.error('Error getting reflection prompt:', error);
        return null;
      }

      return data?.result || null;
    } catch (err) {
      console.error('Failed to get reflection prompt:', err);
      return null;
    }
  },

  /**
   * Generate an insight for a journal entry
   */
  async getInsight(content: string, title?: string, mood?: string): Promise<string | null> {
    try {
      const settings = await SettingsService.getSettings();
      if (settings?.ai_opt_out) return null;

      const { data, error } = await supabase.functions.invoke('ai-generate', {
        body: { type: 'insight', content, title, mood }
      });

      if (error) {
        console.error('Error getting insight:', error);
        return null;
      }

      return data?.result || null;
    } catch (err) {
      console.error('Failed to get insight:', err);
      return null;
    }
  },

  /**
   * Generate a daily writing prompt
   */
  async getDailyPrompt(): Promise<string | null> {
    try {
      const settings = await SettingsService.getSettings();
      if (settings?.ai_opt_out) return null;

      const { data, error } = await supabase.functions.invoke('ai-generate', {
        body: { type: 'daily_prompt' }
      });

      if (error) {
        console.error('Error getting daily prompt:', error);
        return null;
      }

      return data?.result || null;
    } catch (err) {
      console.error('Failed to get daily prompt:', err);
      return null;
    }
  },

  /**
   * Generate an AI daily summary for a given day (calendar overlay)
   */
  async getDailySummary(
    dateKey: string,
    entries: Array<{ id: string; title: string | null; content: string | null; created_at?: string }>,
    options?: { force?: boolean },
  ): Promise<DailySummaryResult> {
    try {
      const settings = await SettingsService.getSettings();
      if (settings?.ai_opt_out) return { summary: null };

      const { data, error } = await supabase.functions.invoke('ai-generate', {
        body: {
          type: 'daily_summary',
          date_key: dateKey,
          force: Boolean(options?.force),
          entries: entries.map((e) => ({
            id: e.id,
            title: e.title,
            content: e.content,
            created_at: (e as any).created_at,
          })),
        },
      });

      if (error) {
        // Attempt to parse function error body (useful for plan gating).
        const resp = (error as any)?.context?.response;
        if (resp) {
          try {
            const json = await resp.json();
            return {
              summary: null,
              error: json?.error || error.message,
              requiredPlan: json?.required_plan || undefined,
            };
          } catch {
            // fall through
          }
        }
        return { summary: null, error: error.message || 'AI request failed.' };
      }

      if (data?.error) {
        return { summary: null, error: data.error, requiredPlan: data?.required_plan };
      }

      return { summary: data?.result || null, cached: Boolean(data?.cached) };
    } catch (err: any) {
      console.error('Failed to get daily summary:', err);
      return { summary: null, error: err?.message || 'AI request failed.' };
    }
  },

  /**
   * Generate mirror reflections from recent journal entries
   */
  async getMirrorReflections(entries: Array<{ id: string; title: string | null; content: string | null; created_at: string }>): Promise<Array<{ title: string; text: string; context: string; action: string }> | null> {
    try {
      const settings = await SettingsService.getSettings();
      if (settings?.ai_opt_out) return null;

      const { data, error } = await supabase.functions.invoke('ai-generate', {
        body: {
          type: 'mirror_reflection',
          entries: entries.map(e => ({
            id: e.id,
            title: e.title,
            content: e.content,
            created_at: e.created_at
          }))
        }
      });

      if (error) {
        console.error('Error getting mirror reflections:', error);
        return null;
      }

      // Handle both array and object with reflections property
      const result = data?.result;
      if (Array.isArray(result)) {
        return result;
      } else if (result?.reflections && Array.isArray(result.reflections)) {
        return result.reflections;
      }

      return null;
    } catch (err) {
      console.error('Failed to get mirror reflections:', err);
      return null;
    }
  }
};

// Legacy stubs for backward compatibility
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  console.log('Transcription will be implemented with Supabase edge functions');
  return 'Transcription placeholder - backend not yet configured';
}

export async function analyzeEntry(content: string): Promise<any> {
  console.log('Analysis will be implemented with Supabase edge functions');
  return {
    sentiment: 'neutral',
    themes: [],
    suggestions: [],
  };
}
