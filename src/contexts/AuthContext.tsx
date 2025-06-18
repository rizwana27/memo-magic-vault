
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error?: any }>;
  signInWithMicrosoft: (email?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Log user details for debugging
        if (session?.user) {
          console.log('User authenticated:', session.user.email);
          console.log('User metadata:', session.user.user_metadata);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
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
      
      // Determine if this is a work/school account or personal account
      const isWorkAccount = email && !email.includes('@gmail.com') && !email.includes('@outlook.com') && !email.includes('@hotmail.com') && !email.includes('@live.com');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'login', // Force login prompt to ensure fresh authentication
            acr_values: 'urn:microsoft:req:auth:mfa', // Force MFA requirement
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

  const value = {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithMicrosoft,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
