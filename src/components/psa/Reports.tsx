
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { useProjects, useTimesheets, useInvoices, useResources } from '@/hooks/usePSAData';
import ExportModal from './ExportModal';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Reports: React.FC = () => {
  const { data: projects = [] } = useProjects();
  const { data: timesheets = [] } = useTimesheets();
  const { data: invoices = [] } = useInvoices();
  const { data: resources = [] } = useResources();

  // Calculate metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalHours = timesheets.reduce((sum, t) => sum + (t.hours || 0), 0);
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total_amount, 0);

  // Prepare chart data
  const projectsByStatus = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(projectsByStatus).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count
  }));

  const hoursByProject = projects.map(project => {
    const projectHours = timesheets
      .filter(t => t.project_id === project.project_id)
      .reduce((sum, t) => sum + (t.hours || 0), 0);
    return {
      name: project.project_name.substring(0, 20),
      hours: projectHours
    };
  }).filter(p => p.hours > 0);

  const revenueByMonth = invoices.reduce((acc, invoice) => {
    const month = new Date(invoice.invoice_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + invoice.total_amount;
    return acc;
  }, {} as Record<string, number>);

  const revenueChartData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
    month,
    revenue
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400">Track performance and generate insights</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalProjects}</div>
            <p className="text-xs text-green-500">
              {activeProjects} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-gray-400">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              From paid invoices
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Resources</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{resources.length}</div>
            <p className="text-xs text-gray-400">
              Available team members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Reports */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="projects" className="data-[state=active]:bg-gray-700">Project Reports</TabsTrigger>
          <TabsTrigger value="time" className="data-[state=active]:bg-gray-700">Time Reports</TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-gray-700">Financial Reports</TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-gray-700">Resource Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Projects by Status</CardTitle>
                  <CardDescription className="text-gray-400">Distribution of project statuses</CardDescription>
                </div>
                <ExportModal reportType="projects" data={projects} />
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Project List</CardTitle>
                <CardDescription className="text-gray-400">All projects with current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {projects.map((project) => (
                    <div key={project.project_id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{project.project_name}</p>
                        <p className="text-sm text-gray-400">{project.client?.client_name || 'No client'}</p>
                      </div>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="time" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Hours by Project</CardTitle>
                <CardDescription className="text-gray-400">Time logged per project</CardDescription>
              </div>
              <ExportModal reportType="timesheets" data={timesheets} />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={hoursByProject}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="hours" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Revenue Trend</CardTitle>
                <CardDescription className="text-gray-400">Monthly revenue from invoices</CardDescription>
              </div>
              <ExportModal reportType="financial" data={invoices} />
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Resource Overview</CardTitle>
                <CardDescription className="text-gray-400">Team members and their details</CardDescription>
              </div>
              <ExportModal reportType="resources" data={resources} />
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {resources.map((resource) => (
                  <div key={resource.resource_id} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{resource.full_name}</p>
                      <p className="text-sm text-gray-400">{resource.role} - {resource.department}</p>
                    </div>
                    <Badge variant={resource.active_status ? 'default' : 'secondary'}>
                      {resource.active_status ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
