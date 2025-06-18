
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderOpen, Clock, DollarSign, Bell } from 'lucide-react';
import { useProjects, useClients, useResources, useTimesheets, useInvoices } from '@/hooks/usePSAData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { data: projects = [] } = useProjects();
  const { data: clients = [] } = useClients();
  const { data: resources = [] } = useResources();
  const { data: timesheets = [] } = useTimesheets();
  const { data: invoices = [] } = useInvoices();

  // Fetch notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const pendingTimesheets = timesheets.filter(t => t.created_at && new Date(t.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
  const unreadNotifications = notifications.filter(n => !n.seen).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-300 mt-1">Manage your entire PSA system</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-100/10 border-blue-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeProjects}</div>
            <p className="text-xs text-blue-200 mt-1">{projects.length} total projects</p>
          </CardContent>
        </Card>

        <Card className="bg-green-100/10 border-green-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-200 mt-1">From paid invoices</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-100/10 border-purple-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Team Members</CardTitle>
            <Users className="h-4 w-4 text-purple-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{resources.length}</div>
            <p className="text-xs text-purple-200 mt-1">Active resources</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-100/10 border-orange-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Recent Activity</CardTitle>
            <Bell className="h-4 w-4 text-orange-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{unreadNotifications}</div>
            <p className="text-xs text-orange-200 mt-1">Unread notifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-400" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${notification.seen ? 'bg-gray-400' : 'bg-blue-400'}`}></div>
                <div className="flex-1">
                  <p className="text-white text-sm">{notification.message}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-gray-400 text-center py-4">No notifications yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
