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

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
        if (userError || !user) {
            throw new Error('Unauthorized')
        }

        // 2. Fetch Data parallely
        const userId = user.id;
        const queries = [
            supabaseClient.from('journal_entries').select('*').eq('user_id', userId),
            supabaseClient.from('threads').select('*').eq('user_id', userId),
            supabaseClient.from('mood_logs').select('*').eq('user_id', userId),
            supabaseClient.from('reflections').select('*').eq('user_id', userId),
            supabaseClient.from('intentions').select('*').eq('user_id', userId),
            supabaseClient.from('time_capsules').select('*').eq('user_id', userId),
            supabaseClient.from('decisions').select('*').eq('user_id', userId),
            supabaseClient.from('user_settings').select('*').eq('user_id', userId),
            supabaseClient.from('journey_progress').select('*').eq('user_id', userId),
            // Additional user data tables
            supabaseClient.from('profiles').select('*').eq('id', userId),
            supabaseClient.from('user_state').select('*').eq('user_id', userId),
            supabaseClient.from('ai_settings').select('*').eq('user_id', userId),
            supabaseClient.from('ai_artifacts').select('*').eq('user_id', userId),
            supabaseClient.from('ai_feedback').select('*').eq('user_id', userId),
        ];

        const results = await Promise.all(queries);

        const exportData = {
            journal_entries: results[0].data,
            threads: results[1].data,
            mood_logs: results[2].data,
            reflections: results[3].data,
            intentions: results[4].data,
            time_capsules: results[5].data,
            decisions: results[6].data,
            user_settings: results[7].data,
            journey_progress: results[8].data,
            profile: results[9].data,
            user_state: results[10].data,
            ai_settings: results[11].data,
            ai_artifacts: results[12].data,
            ai_feedback: results[13].data,
            exported_at: new Date().toISOString(),
            user_id: userId
        };

        return new Response(
            JSON.stringify(exportData, null, 2),
            {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                    'Content-Disposition': `attachment; filename="meadow-export-${new Date().toISOString().split('T')[0]}.json"`
                }
            }
        );

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
});
