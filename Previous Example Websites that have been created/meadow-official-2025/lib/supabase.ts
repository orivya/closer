import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe access to environment variables
const getEnv = (key: string): string => {
  try {
    // @ts-ignore - Vite env access
    return import.meta.env[key] || '';
  } catch {
    return '';
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id')
);

// Create real Supabase client if configured, otherwise use mock client
export const supabase: SupabaseClient | any = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : createMockClient();

// Mock client for demo mode when Supabase is not configured
function createMockClient() {
  console.warn(
    '⚠️ Supabase not configured. Running in demo mode.\n' +
    'Add your keys to .env.local to enable full functionality.'
  );

  return {
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: crypto.randomUUID(), ...data }, error: null })
        })
      }),
      update: (data: any) => ({
        eq: () => Promise.resolve({ data, error: null }),
        match: () => Promise.resolve({ data, error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
        match: () => Promise.resolve({ data: null, error: null }),
      }),
      upsert: (data: any) => Promise.resolve({ data, error: null }),
    }),
    auth: {
      getUser: () => Promise.resolve({
        data: { user: { id: 'demo-user', email: 'demo@meadow.app' } },
        error: null
      }),
      getSession: () => Promise.resolve({
        data: { session: null },
        error: null
      }),
      signUp: ({ email }: { email: string }) => Promise.resolve({
        data: { user: { id: 'demo-user', email } },
        error: null
      }),
      signInWithPassword: ({ email }: { email: string }) => Promise.resolve({
        data: { user: { id: 'demo-user', email }, session: {} },
        error: null
      }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: (callback: any) => {
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      resetPasswordForEmail: () => Promise.resolve({ error: null }),
    },
    storage: {
      from: (bucket: string) => ({
        upload: (path: string, file: File) => Promise.resolve({
          data: { path: `demo/${path}` },
          error: null
        }),
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `https://placeholder.supabase.co/storage/v1/object/public/${bucket}/${path}` }
        }),
        remove: (paths: string[]) => Promise.resolve({ data: null, error: null }),
      }),
    },
    functions: {
      invoke: (name: string, options?: any) => Promise.resolve({
        data: { message: 'Demo mode - function not executed' },
        error: null
      }),
    },
  };
}
