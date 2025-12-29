import { supabase } from '../src/integrations/supabase/client';

export interface Intention {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    category: string;
    status: 'active' | 'completed' | 'paused' | 'archived';
    target_date: string | null;
    progress: number;
    created_at: string;
    updated_at: string;
    // Computed fields
    entryCount?: number;
    color?: string;
}

export const IntentionsService = {
    /**
     * Fetch all intentions for the user
     */
    async getIntentions(): Promise<Intention[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('intentions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching intentions:', error);
            return [];
        }

        const intentions = (data as Intention[]) || [];

        // Note: intention_id column doesn't exist in journal_entries table
        // Entry counts would require a database schema update
        // For now, return 0 for entry counts

        // Map categories to colors + attach counts
        return intentions.map(item => ({
            ...item,
            color: getColorForCategory(item.category),
            entryCount: 0, // intention_id not in journal_entries schema
        }));
    },

    /**
     * Create a new intention
     */
    async createIntention(title: string, description: string, category: string = 'general') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('intentions')
            .insert({
                user_id: user.id,
                title,
                description,
                category,
                progress: 0,
                status: 'active'
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating intention:', error);
            throw error;
        }

        return data;
    },

    /**
     * Update intention
     */
    async updateIntention(id: string, updates: Partial<Intention>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('intentions')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete intention
     */
    async deleteIntention(id: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('intentions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;
        return true;
    }
};

function getColorForCategory(category: string): string {
    const map: Record<string, string> = {
        finance: 'sage',
        career: 'stone',
        relationships: 'clay',
        health: 'sage',
        creativity: 'clay',
        personal: 'stone'
    };
    return map[category?.toLowerCase()] || 'stone';
}
