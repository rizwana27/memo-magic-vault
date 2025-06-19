
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Index from '@/pages/Index';
import VendorDashboard from '@/components/dashboards/VendorDashboard';
import EmployeeDashboard from '@/components/dashboards/EmployeeDashboard';
import UnauthorizedAccess from '@/components/auth/UnauthorizedAccess';

const DashboardRouter: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  // Fetch user profile with role
  const { data: profile, isLoading: profileLoading, error } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_role, role, full_name, email')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  // Show loading state
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
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
  
  console.log('DashboardRouter - User role:', userRole, 'Profile:', profile);

  // Route based on role
  switch (userRole) {
    case 'admin':
      return <Index />; // Full dashboard access
    
    case 'vendor':
      return <VendorDashboard />;
    
    case 'employee':
    case 'user': // fallback for existing users
      return <EmployeeDashboard />;
    
    default:
      return <UnauthorizedAccess reason={`Unknown role: ${userRole}. Please contact support.`} />;
  }
};

export default DashboardRouter;
