import { supabase } from '../src/integrations/supabase/client';

export interface TimeCapsule {
    id: string;
    user_id: string;
    title: string;
    content: string | null;
    unlock_date: string;
    is_unlocked: boolean;
    unlocked_at: string | null;
    mood: string | null;
    tags: string[] | null;
    created_at: string;
    updated_at: string;
}

export const TimeVaultService = {
    /**
     * Fetch all capsules
     */
    async getCapsules(): Promise<TimeCapsule[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data, error } = await supabase
            .from('time_capsules')
            .select('*')
            .eq('user_id', user.id)
            .order('unlock_date', { ascending: true });

        if (error) {
            console.error('Error fetching capsules:', error);
            return [];
        }

        return data as TimeCapsule[];
    },

    /**
     * Create (Seal) a new capsule
     */
    async createCapsule(title: string, content: string, unlockDate: Date, mood?: string, tags?: string[]) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('time_capsules')
            .insert({
                user_id: user.id,
                title,
                content,
                unlock_date: unlockDate.toISOString(),
                is_unlocked: false,
                mood,
                tags
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating capsule:', error);
            throw error;
        }

        return data;
    },

    /**
     * Unlock a capsule
     * (Ideally this logic runs server-side or is protected by RLS checking the date, but client-side trigger is fine for now)
     */
    async unlockCapsule(id: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Double check date locally or trust server constraint? 
        // We update is_unlocked = true.
        const { data, error } = await supabase
            .from('time_capsules')
            .update({
                is_unlocked: true,
                unlocked_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
