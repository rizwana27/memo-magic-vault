
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: any }>;
  signUpWithEmail: (email: string, password: string, role?: string) => Promise<{ error?: any }>;
  signInWithMicrosoft: (email?: string, role?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
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

  const signUpWithEmail = async (email: string, password: string, role?: string) => {
    try {
      setLoading(true);
      console.log('Starting email sign up for:', email, 'with role:', role);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            user_role: role || 'employee'
          }
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

  const signInWithMicrosoft = async (email?: string, role?: string) => {
    try {
      setLoading(true);
      console.log('Starting Microsoft sign in with role:', role, 'for email:', email);
      
      // Store the selected role temporarily in sessionStorage for OAuth callback
      if (role) {
        sessionStorage.setItem('selectedRole', role);
      }
      
      // Determine if this is a work/school account or personal account
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

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      console.log('Starting Google sign in');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setLoading(false);
      throw error;
    }
  };

  const signInWithGitHub = async () => {
    try {
      setLoading(true);
      console.log('Starting GitHub sign in');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        console.error('GitHub sign in error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      
      // Clear any saved session storage data
      sessionStorage.removeItem('selectedRole');
      localStorage.removeItem('selectedRole');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      
      // Clear local state immediately
      setSession(null);
      setUser(null);
      
      console.log('Successfully signed out');
      
      // Force redirect to welcome page
      window.location.href = '/';
      
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, try to clear local state and redirect
      setSession(null);
      setUser(null);
      window.location.href = '/';
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithMicrosoft,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
