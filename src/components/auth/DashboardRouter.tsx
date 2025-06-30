
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Index from '@/pages/Index';
import Vendors from '@/components/psa/Vendors';
import EmployeeDashboard from '@/components/dashboards/EmployeeDashboard';
import PersonaDashboard from '@/components/dashboards/PersonaDashboard';
import UnauthorizedAccess from '@/components/auth/UnauthorizedAccess';

const DashboardRouter: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  // Fetch user profile with role and persona
  const { data: profile, isLoading: profileLoading, error } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('Fetching profile for user:', user.email);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('user_role, role, persona, full_name, email, onboarding_completed')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      
      console.log('Profile fetched for user:', user.email, 'Role:', data?.user_role || data?.role, 'Persona:', data?.persona);
      return data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
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

  // Get user role and persona
  const userRole = profile.user_role || profile.role || 'user';
  const userPersona = profile.persona || 'resource';
  
  console.log('DashboardRouter - User:', user?.email, 'Role:', userRole, 'Persona:', userPersona);

  // Route based on persona first, then fallback to role
  if (userPersona && ['pmo', 'executive', 'org_leader', 'resource'].includes(userPersona)) {
    return <PersonaDashboard persona={userPersona as 'pmo' | 'executive' | 'org_leader' | 'resource'} />;
  }

  // Fallback to legacy role-based routing
  switch (userRole) {
    case 'admin':
      return <Index />; // Full PSA dashboard with all modules
    
    case 'vendor':
      return <Vendors />; // Vendor management page only
    
    case 'employee':
    case 'user': // fallback for existing users
      return <EmployeeDashboard />; // Employee dashboard with timesheets
    
    default:
      return <UnauthorizedAccess reason={`Unknown role: ${userRole}. Please contact support.`} />;
  }
};

export default DashboardRouter;
