
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useAuth';
import { LogOut, Truck, FileText, DollarSign } from 'lucide-react';

const VendorDashboard = () => {
  const { signOut, user } = useAuth();
  const { data: userRole } = useUserRole();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Vendor Portal
            </h1>
            <p className="text-gray-400 mt-2">
              Welcome, {userRole?.full_name || user?.email}
            </p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Vendor Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Purchase Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">View and manage your purchase orders</p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                View Orders (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Track payments and billing</p>
              <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                View Payments (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">Access contracts and documents</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled>
                View Documents (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
