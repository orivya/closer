import { supabase } from '../src/integrations/supabase/client';

export interface Dream {
    id: string;
    user_id: string;
    content: string;
    symbols: string[];
    emotions: string[];
    people: string[];
    theme: string | null;
    interpretation: string | null;
    created_at: string;
    updated_at: string;
}

export const DreamsService = {
    /**
     * Fetch all dreams for the current user
     */
    async getDreams(): Promise<Dream[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await (supabase as any)
            .from('dreams')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching dreams:', error);
            return [];
        }

        return data as Dream[];
    },

    /**
     * Create a new dream entry
     */
    async createDream(dream: {
        content: string;
        symbols: string[];
        emotions: string[];
        people: string[];
        theme?: string;
        interpretation?: string;
    }): Promise<Dream | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await (supabase as any)
            .from('dreams')
            .insert({
                user_id: user.id,
                content: dream.content,
                symbols: dream.symbols,
                emotions: dream.emotions,
                people: dream.people,
                theme: dream.theme || null,
                interpretation: dream.interpretation || null
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating dream:', error);
            throw error;
        }
        return data;
    },

    /**
     * Update a dream entry
     */
    async updateDream(id: string, updates: Partial<Dream>): Promise<Dream | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await (supabase as any)
            .from('dreams')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating dream:', error);
            throw error;
        }
        return data;
    },

    /**
     * Delete a dream entry
     */
    async deleteDream(id: string): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await (supabase as any)
            .from('dreams')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting dream:', error);
            throw error;
        }
        return true;
    }
};
