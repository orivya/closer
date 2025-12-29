import { supabase } from '../src/integrations/supabase/client';
import { MetricsService } from './metrics';
import { UserStateService } from './userState';
import { Note } from '../types';
export type { Note };

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string | null;
  content: string | null;
  mood: string | null;
  tags: string[] | null;
  thread_id: string | null;
  is_reflection: boolean;
  word_count: number;
  audio_url: string | null;
  created_at: string;
  updated_at: string;
}

const ORIGIN_TAG_LABELS: Record<string, string> = {
  'guided-reflection': 'Guided Reflection',
  'self-discovery': 'Self Discovery',
  'goal-setting': 'Goal Setting',
  'quick-jot': 'Quick Jot',
};

const ORIGIN_TAGS = new Set(Object.keys(ORIGIN_TAG_LABELS));

function stripMarkdown(input: string): string {
  if (!input) return '';
  return input
    // Remove fenced code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    // Inline code
    .replace(/`([^`]+)`/g, '$1')
    // Images
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    // Links -> keep text
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    // Headings / quotes / lists
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Emphasis markers
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

function toPreviewText(content: string, maxLen: number = 120): string {
  const cleaned = stripMarkdown(content);
  if (!cleaned) return '';
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen).trimEnd() + '…';
}

function toCategoryLabel(tags: string[] | null | undefined): string {
  const t = (tags ?? []).filter(Boolean);
  const origin = t.find(tag => ORIGIN_TAGS.has(tag));
  if (origin) return ORIGIN_TAG_LABELS[origin] || 'Entry';
  return t[0] || 'Uncategorized';
}

export const JournalService = {

  /**
   * Fetch all entries for the current user
   */
  async getEntries(): Promise<Note[]> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn("User not authenticated");
      return [];
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching entries:", error);
      return [];
    }

    // Generate signed URLs for audio
    const entriesWithSignedUrls = await Promise.all((data as JournalEntry[]).map(async (entry) => {
      let audioUrl = undefined;
      if (entry.audio_url) {
        // Assume audio_url contains the storage path
        const { data: signedData } = await supabase.storage
          .from('voice-memos')
          .createSignedUrl(entry.audio_url, 3600); // 1 hour expiry
        audioUrl = signedData?.signedUrl;
      }

      return {
        id: entry.id,
        title: entry.title || 'Untitled',
        content: entry.content || '',
        preview: toPreviewText(entry.content || '', 120),
        date: new Date(entry.created_at).toLocaleDateString(),
        time: new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        wordCount: entry.word_count,
        type: (audioUrl ? 'voice' : 'text') as 'voice' | 'text',
        category: toCategoryLabel(entry.tags),
        thread: entry.thread_id || undefined,
        tags: entry.tags || [],
        audioUrl: audioUrl,
        isReflection: entry.is_reflection,
        mood: entry.mood || undefined
      };
    }));

    return entriesWithSignedUrls;
  },

  /**
   * Save a new entry
   */
  async createEntry(
    title: string,
    content: string,
    tags: string[] = [],
    isReflection: boolean = false,
    thread_id?: string,
    audioPath?: string,
    mood?: string
  ) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be authenticated to create entries");
    }

    const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length;

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        title: title || 'Untitled Entry',
        content,
        tags,
        is_reflection: isReflection,
        thread_id: thread_id || null,
        audio_url: audioPath || null,
        word_count: wordCount,
        mood: mood || null
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating entry:", error);
      throw error;
    }

    MetricsService.invalidateCache();

    // NOTE: User state (stage progression) is now updated automatically
    // by a database trigger (on_entry_created_update_state).

    return data;
  },

  /**
  * Upload audio file to storage
  * Returns path and signedUrl
  */
  async uploadAudio(audioBlob: Blob): Promise<{ path: string; signedUrl: string } | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be authenticated to upload audio");
    }

    const fileName = `${user.id}/${Date.now()}.webm`;

    const { data, error } = await supabase.storage
      .from('voice-memos')
      .upload(fileName, audioBlob, {
        contentType: audioBlob.type || 'audio/webm',
        upsert: false
      });

    if (error) {
      console.error("Error uploading audio:", error);
      throw error;
    }

    // Generate signed URL immediately
    const { data: signedData } = await supabase.storage
      .from('voice-memos')
      .createSignedUrl(data.path, 3600 * 24 * 365); // 1 year expiry or reasonable duration

    return {
      path: data.path,
      signedUrl: signedData?.signedUrl || ''
    };
  },

  /**
   * Update an existing entry
   */
  async updateEntry(
    id: string,
    updates: Partial<{ title: string; content: string; tags: string[]; mood: string; thread_id: string | null; is_reflection: boolean }>
  ) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be authenticated to update entries");
    }

    if (import.meta.env.DEV) {
      console.log('[THREAD_DEBUG] JournalService.updateEntry', { id, thread_id: updates.thread_id });
    }

    const updateData: Record<string, unknown> = { ...updates };
    if (updates.content) {
      updateData.word_count = updates.content.trim().split(/\s+/).filter(w => w.length > 0).length;
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating entry:", error);
      return null;
    }

    return data;
  },

  /**
   * Delete an entry
   */
  async deleteEntry(id: string) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be authenticated to delete entries");
    }

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error("Error deleting entry:", error);
      throw error;
    }

    MetricsService.invalidateCache();
    return true;
  },

  /**
   * Get a single entry by ID
   */
  async getEntry(id: string): Promise<JournalEntry | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching entry:", error);
      return null;
    }

    // Sign URL if exists
    if (data && data.audio_url) {
      const { data: signedData } = await supabase.storage
        .from('voice-memos')
        .createSignedUrl(data.audio_url, 3600);
      data.audio_url = signedData?.signedUrl || null;
    }

    return data as JournalEntry | null;
  },

  /**
   * Get recent entries for AI analysis (Mirror space)
   */
  async getRecentEntries(limit: number = 20): Promise<JournalEntry[]> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent entries:", error);
      return [];
    }

    return (data as JournalEntry[]) || [];
  }
};
