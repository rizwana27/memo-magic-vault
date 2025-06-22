import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  Users, 
  TrendingUp, 
  FileText,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { useProjects, useTimesheets, useInvoices, useResources } from '@/hooks/usePSAData';
import ExportButton from './ExportButton';
import ExportModal from './ExportModal';

const Reports = () => {
  const { data: projects } = useProjects();
  const { data: timesheets } = useTimesheets();
  const { data: invoices } = useInvoices();
  const { data: resources } = useResources();
  
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedProject, setSelectedProject] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportConfig, setExportConfig] = useState({ type: '', title: '' });

  const projectStatusData = [
    { name: 'Active', value: projects?.filter(p => p.status === 'active').length || 0, color: '#10B981' },
    { name: 'Planning', value: projects?.filter(p => p.status === 'planning').length || 0, color: '#F59E0B' },
    { name: 'Completed', value: projects?.filter(p => p.status === 'completed').length || 0, color: '#3B82F6' },
    { name: 'On Hold', value: projects?.filter(p => p.status === 'on_hold').length || 0, color: '#EF4444' },
  ];

  const timeData = [
    { month: 'Jan', billable: 120, nonBillable: 40 },
    { month: 'Feb', billable: 140, nonBillable: 35 },
    { month: 'Mar', billable: 160, nonBillable: 45 },
    { month: 'Apr', billable: 180, nonBillable: 50 },
    { month: 'May', billable: 200, nonBillable: 40 },
    { month: 'Jun', billable: 190, nonBillable: 55 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 25000, expenses: 15000 },
    { month: 'Feb', revenue: 28000, expenses: 16000 },
    { month: 'Mar', revenue: 32000, expenses: 18000 },
    { month: 'Apr', revenue: 35000, expenses: 19000 },
    { month: 'May', revenue: 40000, expenses: 20000 },
    { month: 'Jun', revenue: 38000, expenses: 22000 },
  ];

  const handleExport = async (format: 'pdf' | 'excel') => {
    console.log(`Exporting ${exportConfig.type} as ${format}`);
    // The actual export logic is handled by the ExportModal
  };

  const openExportModal = (reportType: string, title: string) => {
    setExportConfig({ type: reportType, title });
    setShowExportModal(true);
  };

  const currentFilters = {
    start_date: dateRange.start,
    end_date: dateRange.end,
    project_id: selectedProject
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400">Comprehensive business insights and data visualization</p>
        </div>
        <div className="flex gap-2">
          <ExportButton reportType="projects" filters={currentFilters} />
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-300">Start Date</Label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">End Date</Label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="">All Projects</SelectItem>
                  {projects?.map((project) => (
                    <SelectItem key={project.project_id} value={project.project_id}>
                      {project.project_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                <Search className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800/50">
          <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="time" className="text-gray-300 data-[state=active]:text-white">Time Tracking</TabsTrigger>
          <TabsTrigger value="financial" className="text-gray-300 data-[state=active]:text-white">Financial</TabsTrigger>
          <TabsTrigger value="projects" className="text-gray-300 data-[state=active]:text-white">Projects</TabsTrigger>
          <TabsTrigger value="resources" className="text-gray-300 data-[state=active]:text-white">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm font-medium">Active Projects</p>
                    <p className="text-2xl font-bold text-white">{projects?.filter(p => p.status === 'active').length || 0}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-400" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 text-sm font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">$248,350</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+8.2% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 border-yellow-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-300 text-sm font-medium">Billable Hours</p>
                    <p className="text-2xl font-bold text-white">1,240</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+15% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm font-medium">Active Resources</p>
                    <p className="text-2xl font-bold text-white">{resources?.filter(r => r.active_status).length || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+3 new this month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Project Status Distribution</CardTitle>
                  <CardDescription className="text-gray-400">Current project status breakdown</CardDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => openExportModal('project-status', 'Project Status Distribution')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
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

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Monthly Revenue Trend</CardTitle>
                  <CardDescription className="text-gray-400">Revenue vs expenses over time</CardDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => openExportModal('revenue-trend', 'Monthly Revenue Trend')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#374151', 
                        border: '1px solid #6B7280',
                        borderRadius: '6px'
                      }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="time" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Time Tracking Reports</h3>
            <ExportButton reportType="timesheets" filters={currentFilters} />
          </div>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Billable vs Non-Billable Hours</CardTitle>
              <CardDescription className="text-gray-400">Monthly comparison of billable and non-billable time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: '1px solid #6B7280',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="billable" fill="#10B981" name="Billable Hours" />
                  <Bar dataKey="nonBillable" fill="#F59E0B" name="Non-Billable Hours" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Financial Reports</h3>
            <ExportButton reportType="invoices" filters={currentFilters} />
          </div>

          {/* Financial metrics cards and charts would go here */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
              <h3 className="text-xl font-medium text-white mb-2">Financial Reports</h3>
              <p className="text-gray-400">Detailed financial analytics coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Project Reports</h3>
            <ExportButton reportType="projects" filters={currentFilters} />
          </div>

          {/* Project-specific reports would go here */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
              <h3 className="text-xl font-medium text-white mb-2">Project Analytics</h3>
              <p className="text-gray-400">Comprehensive project reports coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Resource Reports</h3>
            <ExportButton reportType="resources" filters={currentFilters} />
          </div>

          {/* Resource utilization reports would go here */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
              <h3 className="text-xl font-medium text-white mb-2">Resource Analytics</h3>
              <p className="text-gray-400">Resource utilization reports coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Modal */}
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        reportTitle={exportConfig.title}
        onExport={handleExport}
      />
    </div>
  );
};

export default Reports;
