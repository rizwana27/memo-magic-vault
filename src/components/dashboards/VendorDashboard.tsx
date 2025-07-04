
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Vendors from '@/components/psa/Vendors';

const VendorDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      console.log('Vendor signing out:', user?.email);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header with Sign Out Button - matching Admin dashboard */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Vendor Portal</h1>
            <p className="text-gray-300">Welcome back, {user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-300">Role: Vendor</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200 hover:border-red-400/60 flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
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
