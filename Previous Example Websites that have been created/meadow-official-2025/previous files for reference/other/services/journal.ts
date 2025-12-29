
import { supabase } from '../lib/supabase';
import { Note, DbEntry } from '../types';

// LOCAL MOCK DATA (For testing without Database)
let MOCK_ENTRIES: Note[] = [
  { id: '1', title: 'Should I take the new role?', preview: "I've been thinking about whether I should take the new role...", date: 'Today', time: '2:34 PM', thread: 'Career Decision', content: 'Full content here...' },
  { id: '2', title: 'What I actually want', preview: "It's not about the title or the money...", date: 'Yesterday', time: '9:15 PM', content: 'Full content here...' },
];

export const JournalService = {
  
  /**
   * Fetch all entries 
   */
  async getEntries(): Promise<Note[]> {
    // 1. Try Supabase
    try {
      // @ts-ignore - check if it's the real client
      if (supabase.auth && typeof supabase.auth.getUser === 'function' && supabase['rest']) {
         const { data, error } = await supabase
          .from('entries')
          .select('*')
          .order('created_at', { ascending: false });
          
          if (!error && data) {
             return (data as DbEntry[]).map(entry => ({
              id: entry.id,
              title: entry.title || 'Untitled',
              content: entry.content,
              preview: entry.content.substring(0, 100) + '...',
              date: new Date(entry.created_at).toLocaleDateString(),
              time: new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              wordCount: entry.content.split(' ').length,
              type: 'text',
              category: entry.tags?.[0] || 'Uncategorized'
            }));
          }
      }
    } catch (e) {
      console.warn("Supabase not connected, using mock data");
    }

    // 2. Fallback to Mock Data
    return MOCK_ENTRIES;
  },

  /**
   * Save a new entry
   */
  async createEntry(title: string, content: string, tags: string[] = []) {
    // 1. Try Supabase
    try {
       // @ts-ignore
       if (supabase.auth && typeof supabase.auth.getUser === 'function' && supabase['rest']) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data, error } = await supabase
              .from('entries')
              .insert({ user_id: user.id, title, content, tags })
              .select()
              .single();
            if (!error) return data;
          }
       }
    } catch (e) {
       console.warn("Supabase not connected, saving locally");
    }

    // 2. Fallback: Save to local array (Demo Mode)
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      preview: content.substring(0, 50) + '...',
      date: 'Just now',
      time: new Date().toLocaleTimeString(),
      type: 'text',
      tags
    };
    MOCK_ENTRIES = [newNote, ...MOCK_ENTRIES];
    return newNote;
  }
};
