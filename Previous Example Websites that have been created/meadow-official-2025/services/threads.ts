import { supabase } from '../src/integrations/supabase/client';

export interface Thread {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  entry_count: number;
  last_entry_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ThreadWithPreview extends Thread {
  latestEntry?: {
    title: string;
    preview: string;
  };
}

function stripMarkdown(input: string): string {
  if (!input) return '';
  return input
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function toPreviewText(content: string, maxLen: number = 96): string {
  const cleaned = stripMarkdown(content);
  if (!cleaned) return '';
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen).trimEnd() + '…';
}

export const ThreadService = {
  /**
   * Fetch all threads for the current user
   */
  async getThreads(): Promise<Thread[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn("User not authenticated");
      return [];
    }

    const { data, error } = await supabase
      .from('threads')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching threads:", error);
      return [];
    }

    return data as Thread[];
  },

  /**
   * Fetch threads with latest entry preview
   */
  async getThreadsWithPreviews(): Promise<ThreadWithPreview[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data: threads, error } = await supabase
      .from('threads')
      .select('*')
      .eq('user_id', user.id)
      .order('last_entry_at', { ascending: false, nullsFirst: false });
      
    if (error) {
      console.error("Error fetching threads:", error);
      return [];
    }

    // Fetch latest entry for each thread
    const threadsWithPreviews: ThreadWithPreview[] = await Promise.all(
      (threads as Thread[]).map(async (thread) => {
        const { data: entries } = await supabase
          .from('journal_entries')
          .select('title, content')
          .eq('thread_id', thread.id)
          .order('created_at', { ascending: false })
          .limit(1);

        const latestEntry = entries?.[0];
        
        return {
          ...thread,
          latestEntry: latestEntry ? {
            title: latestEntry.title || 'Untitled',
            preview: toPreviewText(latestEntry.content || '', 96)
          } : undefined
        };
      })
    );

    return threadsWithPreviews;
  },

  /**
   * Get a single thread by ID
   */
  async getThread(id: string): Promise<Thread | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('threads')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching thread:", error);
      return null;
    }
    
    return data as Thread | null;
  },

  /**
   * Create a new thread
   */
  async createThread(name: string, description?: string, color?: string): Promise<Thread> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to create threads");
    }

    const { data, error } = await supabase
      .from('threads')
      .insert({
        user_id: user.id,
        name,
        description: description || null,
        color: color || '#6B7B5E'
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error creating thread:", error);
      throw error;
    }
    
    return data as Thread;
  },

  /**
   * Update an existing thread
   */
  async updateThread(id: string, updates: Partial<{ name: string; description: string; color: string }>): Promise<Thread> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to update threads");
    }

    const { data, error } = await supabase
      .from('threads')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating thread:", error);
      throw error;
    }
    
    return data as Thread;
  },

  /**
   * Delete a thread
   */
  async deleteThread(id: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User must be authenticated to delete threads");
    }

    const { error } = await supabase
      .from('threads')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (error) {
      console.error("Error deleting thread:", error);
      throw error;
    }
    
    return true;
  },

  /**
   * Get entries for a specific thread
   */
  async getThreadEntries(threadId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('thread_id', threadId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching thread entries:", error);
      return [];
    }
    
    return data;
  }
};
