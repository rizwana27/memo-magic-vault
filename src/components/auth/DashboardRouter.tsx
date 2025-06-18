
import React from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import ClientDashboard from '@/components/dashboards/ClientDashboard';
import VendorDashboard from '@/components/dashboards/VendorDashboard';
import EmployeeDashboard from '@/components/dashboards/EmployeeDashboard';
import TopNavLayout from '@/components/psa/TopNavLayout';

const DashboardRouter = () => {
  const { profile, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (profile.user_role) {
      case 'admin':
        return <AdminDashboard />;
      case 'client':
        return <ClientDashboard />;
      case 'vendor':
        return <VendorDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      default:
        return <EmployeeDashboard />; // Default to employee dashboard
    }
  };

  // Only show full navigation to admins
  if (profile.user_role === 'admin') {
    return (
      <TopNavLayout activeTab="dashboard" onTabChange={() => {}}>
        {renderDashboard()}
      </TopNavLayout>
    );
  }

  // For other roles, show simplified layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default DashboardRouter;
