
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Handling auth callback...');
        
        // Get the session from the URL hash - this will be browser-specific
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        if (data.session) {
          console.log('Authentication successful for user:', data.session.user.email);
          console.log('Session ID:', data.session.access_token.substring(0, 20) + '...');
          
          toast({
            title: "Welcome!",
            description: `Successfully signed in as ${data.session.user.email}`,
          });
          
          // Clear any temporary role storage
          const savedRole = sessionStorage.getItem('selectedRole');
          if (savedRole) {
            sessionStorage.removeItem('selectedRole');
          }
          
          navigate('/');
        } else {
          console.log('No session found in callback');
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Completing authentication...</p>
        <p className="text-gray-400 text-sm mt-2">Setting up your session...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
