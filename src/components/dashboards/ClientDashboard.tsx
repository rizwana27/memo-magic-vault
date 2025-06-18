
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderOpen, Clock, DollarSign, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ClientDashboard = () => {
  // Fetch client-specific projects
  const { data: projects = [] } = useQuery({
    queryKey: ['client-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, client:clients(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch client-specific timesheets
  const { data: timesheets = [] } = useQuery({
    queryKey: ['client-timesheets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timesheets')
        .select('*, project:projects(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch client-specific invoices
  const { data: invoices = [] } = useQuery({
    queryKey: ['client-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const totalHours = timesheets.reduce((sum, t) => sum + (t.hours || 0), 0);
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Client Portal</h1>
          <p className="text-gray-300 mt-1">Track your projects and invoices</p>
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
            <CardTitle className="text-sm font-medium text-green-100">Total Invoiced</CardTitle>
            <DollarSign className="h-4 w-4 text-green-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalInvoiced.toLocaleString()}</div>
            <p className="text-xs text-green-200 mt-1">{pendingInvoices} pending payment</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-100/10 border-purple-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-purple-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-purple-200 mt-1">Hours logged</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-100/10 border-orange-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Invoices</CardTitle>
            <FileText className="h-4 w-4 text-orange-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{invoices.length}</div>
            <p className="text-xs text-orange-200 mt-1">Total invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Your Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <div key={project.project_id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <p className="font-medium text-white">{project.project_name}</p>
                  <p className="text-sm text-gray-300">{project.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  project.status === 'active' ? 'bg-green-500/20 text-green-300' :
                  project.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-gray-400 text-center py-4">No projects assigned yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
