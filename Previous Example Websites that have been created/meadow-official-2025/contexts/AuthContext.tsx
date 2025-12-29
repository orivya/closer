import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../src/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { SubscriptionPlan, SubscriptionStatus } from '../types';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  subscription: SubscriptionStatus;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  isPro: boolean;
  isPremium: boolean;
}

const defaultSubscription: SubscriptionStatus = {
  subscribed: false,
  plan: 'free',
  productId: null,
  subscriptionEnd: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus>(defaultSubscription);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  const fetchSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setSubscription(defaultSubscription);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscription(defaultSubscription);
        return;
      }

      setSubscription({
        subscribed: data.subscribed || false,
        plan: data.plan || 'free',
        productId: data.product_id || null,
        subscriptionEnd: data.subscription_end || null,
      });
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setSubscription(defaultSubscription);
    }
  }, [session?.access_token]);

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  useEffect(() => {
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id).then(setProfile);
          }, 0);
        } else {
          setProfile(null);
          setSubscription(defaultSubscription);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(profileData => {
          setProfile(profileData);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  // Fetch subscription when session changes
  useEffect(() => {
    if (session?.access_token) {
      fetchSubscription();
    }
  }, [session?.access_token, fetchSubscription]);

  // Subscription refresh strategy:
  // - Refresh on session changes (handled above)
  // - Refresh on explicit Stripe return (handled in App.tsx)
  // Avoid polling every minute (costly/noisy).

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setSubscription(defaultSubscription);
  };

  const isPro = subscription.plan === 'pro' || subscription.plan === 'premium';
  const isPremium = subscription.plan === 'premium';

  const value = {
    user,
    session,
    profile,
    isLoading,
    subscription,
    signOut,
    refreshProfile,
    refreshSubscription,
    isPro,
    isPremium,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
