
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Building, FileText, Package, DollarSign, LogOut, User } from 'lucide-react';

const VendorDashboard: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <header className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Building className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Vendor Portal</h1>
                <p className="text-xs text-cyan-400">Professional Services</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm text-white">{user?.email}</p>
                </div>
              </div>
              
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">Welcome to Your Vendor Portal</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Manage your vendor operations, contracts, and collaborate with the PSA platform.
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <Building className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Vendor Profile</h3>
                  <p className="text-gray-400 text-sm">Manage your information</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Contracts</h3>
                  <p className="text-gray-400 text-sm">View and manage contracts</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <Package className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Purchase Orders</h3>
                  <p className="text-gray-400 text-sm">Track orders and deliveries</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-500/20 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Invoicing</h3>
                  <p className="text-gray-400 text-sm">Submit and track invoices</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            <div className="text-center space-y-4">
              <Building className="h-16 w-16 text-gray-400 mx-auto" />
              <h3 className="text-xl font-semibold text-white">Vendor Management Module</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                This is your dedicated vendor portal. Here you can manage your vendor profile, 
                view contracts, track purchase orders, and handle invoicing. Additional features 
                will be available as they are developed.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboard;
