import { supabase } from '../src/integrations/supabase/client';

export interface Decision {
    id: string;
    user_id: string;
    title: string;
    status: 'draft' | 'decided' | 'archived';
    pros: string[];
    cons: string[];
    final_decision: string | null;
    created_at: string;
    updated_at: string;
}

export const DecisionLabService = {
    /**
     * Fetch all decisions
     */
    async getDecisions(): Promise<Decision[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await (supabase as any)
            .from('decisions')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching decisions:', error);
            return [];
        }

        return data as Decision[];
    },

    /**
     * Create a new decision
     */
    async createDecision(title: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await (supabase as any)
            .from('decisions')
            .insert({
                user_id: user.id,
                title,
                status: 'draft',
                pros: [],
                cons: []
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update decision (title, pros, cons, status)
     */
    async updateDecision(id: string, updates: Partial<Decision>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await (supabase as any)
            .from('decisions')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Delete decision
     */
    async deleteDecision(id: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await (supabase as any)
            .from('decisions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;
        return true;
    }
};
