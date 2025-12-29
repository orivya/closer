'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  email: string;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  tagline: string | null;
  location: string | null;
  timezone: string;
  role: 'artist' | 'admin';
  is_published: boolean;
  is_verified: boolean;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripe_customer_id: string | null;
  stripe_account_id: string | null;
  created_at: string;
  updated_at: string;
}

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  username: string;
  role: 'artist' | 'engineer';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  showTimeoutWarning: boolean;
  signUp: (data: SignUpData) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  dismissTimeoutWarning: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout configuration
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // Show warning 5 minutes before timeout

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  // Track last activity timestamp
  const lastActivityRef = useRef<number>(Date.now());
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sign out function (defined early to avoid circular dependency)
  const signOut = async () => {
    // Clear timers on sign out
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    setShowTimeoutWarning(false);
  };

  // Reset activity timer
  const resetActivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowTimeoutWarning(false);

    // Clear existing timers
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    if (timeoutTimerRef.current) {
      clearTimeout(timeoutTimerRef.current);
    }

    // Only set timers if user is authenticated
    if (session) {
      // Set warning timer
      warningTimerRef.current = setTimeout(() => {
        setShowTimeoutWarning(true);
      }, SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT);

      // Set auto-logout timer
      timeoutTimerRef.current = setTimeout(async () => {
        console.log('Session timeout - logging out');
        await signOut();
      }, SESSION_TIMEOUT);
    }
  }, [session]);

  // Fetch profile data
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }

      // Handle specific events
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        // Clear timers on sign out
        if (warningTimerRef.current) {
          clearTimeout(warningTimerRef.current);
        }
        if (timeoutTimerRef.current) {
          clearTimeout(timeoutTimerRef.current);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Set up activity tracking when session changes
  useEffect(() => {
    if (session) {
      // Start the timeout timers
      resetActivityTimer();
    }
  }, [session, resetActivityTimer]);

  // Track user activity (clicks, keypresses, mouse movements)
  useEffect(() => {
    if (!session) return;

    const handleActivity = () => {
      // Only reset if more than 1 minute has passed since last activity
      // This prevents excessive timer resets
      if (Date.now() - lastActivityRef.current > 60000) {
        resetActivityTimer();
      }
    };

    // Add event listeners for user activity
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [session, resetActivityTimer]);

  // Sign up
  const signUp = async (data: SignUpData): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.fullName,
            username: data.username,
            role: data.role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Sign in
  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Dismiss timeout warning and reset timer
  const dismissTimeoutWarning = () => {
    setShowTimeoutWarning(false);
    resetActivityTimer();
  };

  // Reset password
  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Update password
  const updatePassword = async (newPassword: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) return { error };
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // Refresh profile
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) return { error };

      await refreshProfile();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    showTimeoutWarning,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
    updateProfile,
    dismissTimeoutWarning,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
