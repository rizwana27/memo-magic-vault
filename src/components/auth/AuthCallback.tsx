
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback processing...');
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          toast({
            title: "Authentication Error",
            description: "There was an error processing your authentication. Please try again.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        if (data.session?.user) {
          console.log('User authenticated via callback:', data.session.user.email);
          
          // Get the selected role from sessionStorage (stored during OAuth initiation)
          const selectedRole = sessionStorage.getItem('selectedRole');
          console.log('Selected role from session:', selectedRole);
          
          if (selectedRole) {
            // Validate user's role matches the selected portal
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('user_role, role')
              .eq('id', data.session.user.id)
              .single();

            if (profileError) {
              console.error('Error fetching user profile during callback:', profileError);
            } else {
              const userRole = profile?.user_role || profile?.role || 'user';
              console.log('User role from DB:', userRole, 'Expected role:', selectedRole);

              // Check if user's role matches the selected portal
              const isAuthorized = userRole === selectedRole || 
                                 (selectedRole === 'employee' && userRole === 'user');

              if (!isAuthorized) {
                // Sign out the user and redirect to role selection
                await supabase.auth.signOut();
                sessionStorage.removeItem('selectedRole');
                
                toast({
                  title: "Access Denied",
                  description: `You are not authorized to access the ${selectedRole} portal. Please select the correct role.`,
                  variant: "destructive",
                });
                
                navigate('/');
                return;
              }

              // Update user profile with the validated role if needed
              if (!profile?.user_role && selectedRole) {
                await supabase
                  .from('profiles')
                  .update({ user_role: selectedRole })
                  .eq('id', data.session.user.id);
              }
            }
            
            // Clean up session storage
            sessionStorage.removeItem('selectedRole');
          }
          
          toast({
            title: "Welcome!",
            description: "Successfully authenticated. Redirecting to your dashboard...",
          });
          
          // Redirect to main app - DashboardRouter will handle role-based routing
          navigate('/');
        } else {
          console.log('No user found in callback, redirecting to auth');
          navigate('/');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        toast({
          title: "Authentication Error",
          description: "An unexpected error occurred. Please try signing in again.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Processing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
