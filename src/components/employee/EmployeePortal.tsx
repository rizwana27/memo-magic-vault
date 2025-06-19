
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useAuth';
import { useResources } from '@/hooks/usePSAData';
import { LogOut, User } from 'lucide-react';

const EmployeePortal = () => {
  const { signOut, user } = useAuth();
  const { data: userRole } = useUserRole();
  const { data: resources, isLoading } = useResources();

  // Filter resources to show only the current user's data
  const userResource = resources?.find(resource => 
    resource.email_address === user?.email
  );

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Hi, {userRole?.full_name || 'Employee'}! 👋
            </h1>
            <p className="text-gray-400 mt-2">Welcome to your employee portal</p>
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

        {/* Employee Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-600 rounded w-2/3"></div>
                </div>
              ) : userResource ? (
                <div className="space-y-3 text-gray-300">
                  <div>
                    <span className="font-medium">Name:</span> {userResource.full_name}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {userResource.email_address}
                  </div>
                  <div>
                    <span className="font-medium">Role:</span> {userResource.role}
                  </div>
                  <div>
                    <span className="font-medium">Department:</span> {userResource.department}
                  </div>
                  {userResource.phone_number && (
                    <div>
                      <span className="font-medium">Phone:</span> {userResource.phone_number}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      userResource.active_status ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {userResource.active_status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">No profile data found. Please contact your administrator.</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
                View Timesheets (Coming Soon)
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                Submit Time Entry (Coming Soon)
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled>
                View Projects (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeePortal;
