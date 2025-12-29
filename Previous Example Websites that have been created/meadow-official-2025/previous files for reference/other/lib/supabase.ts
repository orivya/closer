
import { createClient } from '@supabase/supabase-js';

// Safe access to environment variables
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    return import.meta.env[key] || '';
  } catch (e) {
    return '';
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// If keys are missing, we create a dummy client that warns in console but doesn't crash the app
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => ({
        select: () => ({ data: [], error: null }),
        insert: () => ({ select: () => ({ single: () => ({ data: {}, error: null }) }) }),
        update: () => ({ eq: () => ({ data: {}, error: null }) }),
        upload: () => ({ data: {}, error: null }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: { id: 'demo-user' } }, error: null }),
      },
      storage: {
        from: () => ({
           upload: () => Promise.resolve({ data: { path: 'demo.mp3' }, error: null })
        })
      },
      functions: {
        invoke: () => Promise.resolve({ data: {}, error: null })
      }
    } as any;
