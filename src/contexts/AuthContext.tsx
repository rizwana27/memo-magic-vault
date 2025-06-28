
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
    let mounted = true;

    // Create a unique session key for this browser instance
    const browserSessionKey = `supabase_session_${Date.now()}_${Math.random()}`;
    console.log('Browser session key:', browserSessionKey);

    // Clear any existing session data on mount to ensure fresh state per browser
    const initializeAuth = async () => {
      try {
        // Force a fresh session check without any caching
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }

        if (mounted) {
          console.log('Initial session check for browser:', currentSession?.user?.email || 'No user');
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Set up auth state listener - this ensures each browser gets its own auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed in browser:', event, session?.user?.email || 'No user');
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            console.log('User signed in in browser:', session?.user?.email);
            break;
          
          case 'SIGNED_OUT':
            setSession(null);
            setUser(null);
            setLoading(false);
            console.log('User signed out from browser');
            // Clear browser-specific cached data
            localStorage.removeItem('selectedRole');
            sessionStorage.removeItem('selectedRole');
            break;
          
          case 'TOKEN_REFRESHED':
            setSession(session);
            setUser(session?.user ?? null);
            console.log('Token refreshed for user in browser:', session?.user?.email);
            break;
          
          case 'USER_UPDATED':
            setSession(session);
            setUser(session?.user ?? null);
            console.log('User updated in browser:', session?.user?.email);
            break;
          
          default:
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
      console.log('Starting sign out process for user:', user?.email);
      setLoading(true);
      
      // Clear browser-specific cached data first
      localStorage.removeItem('selectedRole');
      sessionStorage.removeItem('selectedRole');
      
      // Clear any other auth-related localStorage items
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('auth') || key.includes('session'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear sessionStorage as well
      const sessionKeysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('auth') || key.includes('session'))) {
          sessionKeysToRemove.push(key);
        }
      }
      sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
      
      // Sign out from Supabase - this will trigger the auth state change
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Error signing out from Supabase:', error);
        // Continue with cleanup even if there's an error
      }
      
      // Force clear local state immediately
      setSession(null);
      setUser(null);
      setLoading(false);
      
      console.log('Successfully signed out from this browser');
      
      // Use window.location.replace instead of href to prevent back button issues
      window.location.replace('/');
      
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if there's an error, clear local state and redirect
      setSession(null);
      setUser(null);
      setLoading(false);
      window.location.replace('/');
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
