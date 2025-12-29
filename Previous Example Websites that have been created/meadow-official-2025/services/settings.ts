import { supabase } from '../src/integrations/supabase/client';

export interface UserSettings {
    id: string;
    user_id: string;
    theme: 'light' | 'dark' | 'system';
    daily_reminder_enabled: boolean;
    daily_reminder_time: string;
    reminder_days: string[];
    weekly_digest_enabled: boolean;
    app_lock_enabled: boolean;
    export_format: 'markdown' | 'json' | 'pdf';
    intent: string | null;
    ai_opt_out: boolean;
}

export const SettingsService = {
    async getSettings(): Promise<UserSettings | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is no rows returned
            console.error('Error fetching settings:', error);
        }

        return (data as unknown) as UserSettings;
    },

    async updateSettings(updates: Partial<UserSettings>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Upsert mechanism: try to update, if not found then insert? 
        // Usually settings record should be created on signup.
        // But if missing, we should create it.

        // First try update
        const { data, error } = await supabase
            .from('user_settings')
            .update(updates)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            // If row doesn't exist, insert one
            if (error.code === 'PGRST116' || (error as any).details?.includes('0 rows')) /* checks */ {
                const { data: newData, error: insertError } = await supabase
                    .from('user_settings')
                    .insert({
                        user_id: user.id,
                        ...updates
                    })
                    .select()
                    .single();
                if (insertError) throw insertError;
                return (newData as unknown) as UserSettings;
            }
            throw error;
        }
        return (data as unknown) as UserSettings;
    },

    async ensureSettingsExist() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('user_settings')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

        if (!data) {
            await supabase
                .from('user_settings')
                .insert({ user_id: user.id });
        }
    }
};
