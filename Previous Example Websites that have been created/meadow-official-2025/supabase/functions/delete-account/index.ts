// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // 1. Verify User
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('Missing Authorization header')
        }

        // Create a SERVICE_ROLE client to perform deletion (users can't delete themselves from auth.users usually without admin/service role)
        // Actually, users can delete their own data via RLS, but deleting the Auth User requires Service Role.
        // However, we can use the user's token to verify identity, then use Service Role to execute deletion.
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        // Initialize Admin Client
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const userId = user.id;

        // 2. Delete from Storage (User's folder)
        // We need to list files first
        const { data: fileList } = await supabaseAdmin.storage
            .from('voice-memos')
            .list(userId + '/');

        if (fileList && fileList.length > 0) {
            const filesToRemove = fileList.map(x => `${userId}/${x.name}`);
            await supabaseAdmin.storage
                .from('voice-memos')
                .remove(filesToRemove);
        }

        // 3. Delete from Database (Explicitly delete to ensure no orphans)
        // Order matters: delete child tables before parent tables
        const tables = [
            // AI-related tables (must be deleted first - they reference other tables)
            'ai_feedback',
            'ai_artifacts',
            'ai_cues',
            'ai_runs',
            'ai_safety_events',
            'ai_redaction_events',
            'ai_output_events',
            'ai_user_avoidance',
            'ai_week_theme',
            'ai_resurface_queue',
            'ai_settings',
            // Content tables
            'reflections',
            'mood_logs',
            'journal_entries',
            'threads',
            'time_capsules',
            'decisions',
            'intentions',
            // User state and settings
            'user_state_history',
            'user_state',
            'journey_progress',
            'user_settings',
            'user_subscriptions',
            'profiles'
        ];

        for (const table of tables) {
            const { error } = await supabaseAdmin
                .from(table)
                .delete()
                .eq('user_id', userId);

            if (error) {
                console.error(`Failed to delete from ${table}:`, error);
                // Continue trying to delete other data even if one fails
            }
        }

        // Final Step: Delete Auth User

        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
            userId
        )

        if (deleteError) {
            throw deleteError;
        }

        return new Response(
            JSON.stringify({ message: 'Account deleted successfully' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
});
