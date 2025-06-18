
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FolderOpen, CheckCircle, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const EmployeeDashboard = () => {
  // Fetch employee's timesheets
  const { data: timesheets = [] } = useQuery({
    queryKey: ['employee-timesheets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timesheets')
        .select('*, project:projects(*)')
        .eq('created_by', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch available projects
  const { data: projects = [] } = useQuery({
    queryKey: ['employee-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const thisWeekTimesheets = timesheets.filter(t => 
    t.created_at && new Date(t.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  
  const totalHoursThisWeek = thisWeekTimesheets.reduce((sum, t) => sum + (t.hours || 0), 0);
  const billableHours = thisWeekTimesheets.filter(t => t.billable).reduce((sum, t) => sum + (t.hours || 0), 0);
  const totalProjects = new Set(timesheets.map(t => t.project_id)).size;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Employee Dashboard</h1>
          <p className="text-gray-300 mt-1">Track your time and manage your work</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-100/10 border-blue-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">This Week</CardTitle>
            <Clock className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalHoursThisWeek.toFixed(1)}h</div>
            <p className="text-xs text-blue-200 mt-1">{thisWeekTimesheets.length} entries</p>
          </CardContent>
        </Card>

        <Card className="bg-green-100/10 border-green-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Billable Hours</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{billableHours.toFixed(1)}h</div>
            <p className="text-xs text-green-200 mt-1">This week</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-100/10 border-purple-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-purple-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalProjects}</div>
            <p className="text-xs text-purple-200 mt-1">Projects worked on</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-100/10 border-orange-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Available Projects</CardTitle>
            <Calendar className="h-4 w-4 text-orange-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{projects.length}</div>
            <p className="text-xs text-orange-200 mt-1">Can log time to</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Timesheets */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Recent Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timesheets.slice(0, 5).map((timesheet) => (
              <div key={timesheet.timesheet_id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <p className="font-medium text-white">{timesheet.task}</p>
                  <p className="text-sm text-gray-300">
                    {timesheet.project?.project_name} • {timesheet.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{timesheet.hours?.toFixed(1)}h</p>
                  {timesheet.billable && (
                    <span className="text-xs text-green-400">Billable</span>
                  )}
                </div>
              </div>
            ))}
            {timesheets.length === 0 && (
              <p className="text-gray-400 text-center py-4">No time entries yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
