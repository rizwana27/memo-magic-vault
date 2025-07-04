
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthFlow from './AuthFlow';
import DashboardRouter from './DashboardRouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - loading:', loading, 'user:', user?.email);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, showing auth flow');
    return <AuthFlow />;
  }

  console.log('User authenticated, showing role-based dashboard');
  return <DashboardRouter />;
};

export default ProtectedRoute;
