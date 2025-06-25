
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Index from '@/pages/Index';
import Vendors from '@/components/psa/Vendors';
import Timesheets from '@/components/psa/Timesheets';
import UnauthorizedAccess from '@/components/auth/UnauthorizedAccess';

const DashboardRouter: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  // Fetch user profile with role - scoped to the current user's session
  const { data: profile, isLoading: profileLoading, error } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('Fetching profile for user:', user.email);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_role, role, full_name, email')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      
      console.log('Profile fetched for user:', user.email, 'Role:', data?.user_role || data?.role);
      return data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Show loading state
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">
            {user?.email ? `Welcome back, ${user.email}` : 'Authenticating...'}
          </p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    console.error('Profile fetch error:', error);
    return <UnauthorizedAccess reason="Unable to verify your account permissions. Please try logging in again." />;
  }

  // Handle missing profile
  if (!profile) {
    return <UnauthorizedAccess reason="Your account profile could not be found. Please contact support." />;
  }

  // Get user role (prioritize user_role over role)
  const userRole = profile.user_role || profile.role || 'user';
  
  console.log('DashboardRouter - User:', user?.email, 'Role:', userRole);

  // Route based on role
  switch (userRole) {
    case 'admin':
      return <Index />; // Full PSA dashboard with all modules
    
    case 'vendor':
      return <Vendors />; // Vendor management page only
    
    case 'employee':
    case 'user': // fallback for existing users
      return <Timesheets />; // Timesheet entry page only
    
    default:
      return <UnauthorizedAccess reason={`Unknown role: ${userRole}. Please contact support.`} />;
  }
};

export default DashboardRouter;
