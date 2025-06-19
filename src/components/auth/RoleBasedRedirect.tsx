
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useAuth';

const RoleBasedRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useUserRole();

  useEffect(() => {
    // Wait for both auth and role data to load
    if (authLoading || roleLoading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!user) {
      console.log('No user found, redirecting to login');
      return;
    }

    // Redirect based on role
    if (userRole?.role) {
      console.log('Redirecting user with role:', userRole.role);
      
      switch (userRole.role) {
        case 'admin':
          navigate('/admin-dashboard', { replace: true });
          break;
        case 'client':
          navigate('/client-dashboard', { replace: true });
          break;
        case 'vendor':
          navigate('/vendor-dashboard', { replace: true });
          break;
        case 'employee':
          navigate('/employee-dashboard', { replace: true });
          break;
        default:
          console.log('Unknown role:', userRole.role);
          navigate('/access-denied', { replace: true });
      }
    } else {
      console.log('No role found, redirecting to access denied');
      navigate('/access-denied', { replace: true });
    }
  }, [user, userRole, authLoading, roleLoading, navigate]);

  // Show loading spinner while determining redirect
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white">Redirecting...</p>
      </div>
    </div>
  );
};

export default RoleBasedRedirect;
