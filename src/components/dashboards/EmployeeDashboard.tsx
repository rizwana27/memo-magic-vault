
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Timesheets from '@/components/psa/Timesheets';

const EmployeeDashboard: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      console.log('Employee signing out:', user?.email);
      toast({
        title: "Signing out...",
        description: "You've been signed out successfully 👋",
      });
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out completed",
        description: "You've been signed out 👋",
        variant: "default",
      });
    }
  };

  // Show loading state while checking authentication
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

  // This component should only render for authenticated users
  // The authentication check is handled by ProtectedRoute and DashboardRouter
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header with proper styling and sign-out button */}
      <div className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4 shadow-xl">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Employee Portal</h1>
              <p className="text-gray-300">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-300">Role: Employee</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200 hover:border-red-400/60 flex items-center gap-2 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-white mb-2">Time Tracking</h2>
              <p className="text-gray-400">Track your work hours and manage your timesheets below.</p>
            </div>
          </div>
          
          {/* Timesheets component with proper styling context */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg">
            <Timesheets />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
