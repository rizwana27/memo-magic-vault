import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Clock, Building, FileText, Target, Activity } from 'lucide-react';
import { useProjects, useClients, useResources, useTimesheets, useInvoices } from '@/hooks/usePSAData';

const Reports = () => {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: resources, isLoading: resourcesLoading } = useResources();
  const { data: timesheets, isLoading: timesheetsLoading } = useTimesheets();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();

  if (projectsLoading || clientsLoading || resourcesLoading || timesheetsLoading || invoicesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading reports...</div>
      </div>
    );
  }

  // Calculate real metrics
  const totalRevenue = invoices?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0;
  const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
  const totalClients = clients?.length || 0;
  const activeResources = resources?.filter(r => r.active_status).length || 0;
  
  // Calculate utilization from real timesheet data
  const totalHours = timesheets?.reduce((sum, ts) => {
    const start = new Date(`2000-01-01T${ts.start_time}`);
    const end = new Date(`2000-01-01T${ts.end_time}`);
    return sum + ((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  }, 0) || 0;

  const billableHours = timesheets?.filter(ts => ts.billable).reduce((sum, ts) => {
    const start = new Date(`2000-01-01T${ts.start_time}`);
    const end = new Date(`2000-01-01T${ts.end_time}`);
    return sum + ((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  }, 0) || 0;

  const utilizationRate = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;

  // Project status distribution
  const projectStatusData = [
    { name: 'Active', value: projects?.filter(p => p.status === 'active').length || 0, color: '#22c55e' },
    { name: 'Planning', value: projects?.filter(p => p.status === 'planning').length || 0, color: '#3b82f6' },
    { name: 'On Hold', value: projects?.filter(p => p.status === 'on_hold').length || 0, color: '#f59e0b' },
    { name: 'Completed', value: projects?.filter(p => p.status === 'completed').length || 0, color: '#6b7280' },
  ];

  // Revenue by month (mock data based on invoices)
  const revenueData = [
    { month: 'Jan', revenue: Math.floor(totalRevenue * 0.1) },
    { month: 'Feb', revenue: Math.floor(totalRevenue * 0.08) },
    { month: 'Mar', revenue: Math.floor(totalRevenue * 0.12) },
    { month: 'Apr', revenue: Math.floor(totalRevenue * 0.15) },
    { month: 'May', revenue: Math.floor(totalRevenue * 0.18) },
    { month: 'Jun', revenue: Math.floor(totalRevenue * 0.37) },
  ];

  // Resource utilization by department - Fixed type issues
  interface DepartmentData {
    department: string;
    count: number;
    availability: number;
  }

  const resourceData: Record<string, DepartmentData> = {};
  
  resources?.forEach(resource => {
    const dept = resource.department || 'Unassigned';
    if (!resourceData[dept]) {
      resourceData[dept] = { department: dept, count: 0, availability: 0 };
    }
    resourceData[dept].count++;
    resourceData[dept].availability += resource.availability || 100;
  });

  const departmentData = Object.values(resourceData).map(dept => ({
    ...dept,
    availability: dept.count > 0 ? dept.availability / dept.count : 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
        <p className="text-gray-400">Insights and performance metrics for your business</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeProjects}</div>
            <p className="text-xs text-gray-400">
              of {projects?.length || 0} total projects
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Resource Utilization</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{utilizationRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-400">
              {billableHours.toFixed(1)}h billable
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Client Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalClients}</div>
            <p className="text-xs text-gray-400">
              +3 this quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/10">
          <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="financial" className="text-gray-300 data-[state=active]:text-white">
            Financial
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-gray-300 data-[state=active]:text-white">
            Projects
          </TabsTrigger>
          <TabsTrigger value="resources" className="text-gray-300 data-[state=active]:text-white">
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Revenue Trend</CardTitle>
                <CardDescription className="text-gray-400">
                  Monthly revenue performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Project Status Distribution</CardTitle>
                <CardDescription className="text-gray-400">
                  Current project portfolio status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Financial Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  Key financial metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Detailed financial analysis coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Project Performance</CardTitle>
                <CardDescription className="text-gray-400">
                  Project metrics and analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Project analytics coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Resource Utilization</CardTitle>
                <CardDescription className="text-gray-400">
                  Team performance and availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="department" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }} 
                    />
                    <Bar dataKey="availability" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
