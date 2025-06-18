
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'client' | 'vendor' | 'employee';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  user_role: UserRole;
  company?: string;
  avatar_url?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileData && !error) {
            setProfile(profileData);
          } else {
            console.error('Error fetching profile:', error);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileData && !error) {
          setProfile(profileData);
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Starting email sign in for:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Email sign in error:', error);
        return { error };
      }
      
      return {};
    } catch (error) {
      console.error('Error signing in with email:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Starting email sign up for:', email);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        console.error('Email sign up error:', error);
        return { error };
      }
      
      return {};
    } catch (error) {
      console.error('Error signing up with email:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithMicrosoft = async (email?: string) => {
    try {
      setLoading(true);
      console.log('Starting Microsoft sign in with MFA for email:', email);
      
      const isWorkAccount = email && !email.includes('@gmail.com') && !email.includes('@outlook.com') && !email.includes('@hotmail.com') && !email.includes('@live.com');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'login',
            acr_values: 'urn:microsoft:req:auth:mfa',
            domain_hint: isWorkAccount ? 'organizations' : 'consumers',
            ...(email && { login_hint: email })
          },
          scopes: 'openid email profile User.Read'
        }
      });
      
      if (error) {
        console.error('Microsoft sign in error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with Microsoft:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithMicrosoft,
    signOut,
  };
};
