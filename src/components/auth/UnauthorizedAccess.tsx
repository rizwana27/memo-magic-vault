
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldX, Home, LogOut } from 'lucide-react';

interface UnauthorizedAccessProps {
  reason?: string;
}

const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({ 
  reason = "You don't have permission to access this area." 
}) => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-red-500/20 p-4 rounded-full">
            <ShieldX className="h-16 w-16 text-red-400" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">Access Denied</h1>
          <p className="text-gray-300 leading-relaxed">
            {reason}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Login
          </Button>
          
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedAccess;
