
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import SimplifiedLoginPage from './SimplifiedLoginPage';

interface RoleBasedProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleBasedProtectedRoute: React.FC<RoleBasedProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useUserRole();

  console.log('RoleBasedProtectedRoute - authLoading:', authLoading, 'roleLoading:', roleLoading);
  console.log('User:', user?.email, 'UserRole:', userRole);

  // Show loading while authentication or role is being determined
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('No user found, showing login page');
    return <SimplifiedLoginPage />;
  }

  // Redirect to access denied if role is not allowed
  if (!userRole || !allowedRoles.includes(userRole.role)) {
    console.log('Access denied - user role:', userRole?.role, 'allowed roles:', allowedRoles);
    return <Navigate to="/access-denied" replace />;
  }

  console.log('Access granted for role:', userRole.role);
  return <>{children}</>;
};

export default RoleBasedProtectedRoute;
