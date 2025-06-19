
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Vendors from '@/components/psa/Vendors';

const VendorDashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect will be handled by the auth state change in the router
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Vendor Portal</h1>
            <p className="text-gray-400">Welcome back, {user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Role: Vendor</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Vendors />
      </div>
    </div>
  );
};

export default VendorDashboard;
