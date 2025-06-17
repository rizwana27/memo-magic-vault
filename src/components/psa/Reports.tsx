import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  Calendar, 
  Download, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  Users, 
  FolderOpen,
  Building,
  Activity,
  BarChart3,
  PieChart,
  Target,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ExportModal from './ExportModal';
import { generatePDFReport, generateExcelReport } from '@/utils/reportExports';

const Reports = () => {
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('executive');
  const [showExportModal, setShowExportModal] = useState(false);

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, expenses: 32000 },
    { month: 'Feb', revenue: 52000, expenses: 35000 },
    { month: 'Mar', revenue: 48000, expenses: 31000 },
    { month: 'Apr', revenue: 61000, expenses: 42000 },
    { month: 'May', revenue: 55000, expenses: 38000 },
    { month: 'Jun', revenue: 67000, expenses: 45000 },
  ];

  const projectData = [
    { name: 'On Track', value: 65, color: '#10B981' },
    { name: 'At Risk', value: 25, color: '#F59E0B' },
    { name: 'Delayed', value: 10, color: '#EF4444' },
  ];

  const utilizationData = [
    { resource: 'John Smith', utilization: 85 },
    { resource: 'Sarah Johnson', utilization: 92 },
    { resource: 'Mike Wilson', utilization: 78 },
    { resource: 'Emily Davis', utilization: 88 },
    { resource: 'Tom Brown', utilization: 76 },
  ];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '$328,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Active Projects',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: FolderOpen,
      color: 'text-blue-400'
    },
    {
      title: 'Resource Utilization',
      value: '84%',
      change: '+2.1%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-400'
    },
    {
      title: 'Client Satisfaction',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      icon: Target,
      color: 'text-yellow-400'
    }
  ];

  const getReportData = () => {
    switch (activeTab) {
      case 'executive':
        return {
          title: 'Executive Dashboard Report',
          data: { kpiCards, revenueData, projectData }
        };
      case 'financial':
        return {
          title: 'Financial Analytics Report',
          data: revenueData
        };
      case 'projects':
        return {
          title: 'Project Analytics Report',
          data: projectData
        };
      case 'resources':
        return {
          title: 'Resource Utilization Report',
          data: utilizationData
        };
      default:
        return {
          title: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report`,
          data: []
        };
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    const reportData = getReportData();
    
    if (format === 'pdf') {
      await generatePDFReport(reportData.title, reportData.data);
    } else {
      await generateExcelReport(reportData.title, reportData.data);
    }
  };

  const FilterPanel = () => (
    <Card className={`bg-white/10 backdrop-blur-md border-white/20 transition-all duration-300 ${filterPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <CardHeader>
        <CardTitle className="text-white text-sm">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Date Range</label>
          <Select>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Client</label>
          <Select>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="All clients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="acme">Acme Corp</SelectItem>
              <SelectItem value="tech">Tech Solutions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Project</label>
          <Select>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="proj1">Project Alpha</SelectItem>
              <SelectItem value="proj2">Project Beta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Resource</label>
          <Select>
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue placeholder="All resources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              <SelectItem value="john">John Smith</SelectItem>
              <SelectItem value="sarah">Sarah Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const KPIGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {kpiCards.map((kpi, index) => (
        <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{kpi.title}</p>
                <p className="text-2xl font-bold text-white">{kpi.value}</p>
                <p className={`text-sm ${kpi.color} flex items-center gap-1`}>
                  {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : null}
                  {kpi.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-700/50`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400">Comprehensive business intelligence and reporting</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
            className={filterPanelOpen ? 'bg-blue-600/20 border-blue-500/50' : ''}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {filterPanelOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowExportModal(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {filterPanelOpen && <FilterPanel />}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8 bg-white/10 backdrop-blur-md border border-white/20">
          <TabsTrigger value="executive">Executive</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="space-y-6">
          <KPIGrid />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Revenue vs Expenses</CardTitle>
                <CardDescription className="text-gray-400">Monthly comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#fff'
                      }} 
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Project Status Distribution</CardTitle>
                <CardDescription className="text-gray-400">Current project health</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={projectData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {projectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#fff'
                      }} 
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-4 mt-4">
                  {projectData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-400">{item.name} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Gross Profit</p>
                    <p className="text-2xl font-bold text-white">$185,000</p>
                    <p className="text-sm text-green-400">+18.5%</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Profit Margin</p>
                    <p className="text-2xl font-bold text-white">32.8%</p>
                    <p className="text-sm text-blue-400">+2.1%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Billable Hours</p>
                    <p className="text-2xl font-bold text-white">1,247</p>
                    <p className="text-sm text-purple-400">+5.2%</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Financial Analytics</h3>
            <p className="text-gray-400">Detailed financial reports and analytics coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Project Analytics</h3>
            <p className="text-gray-400">Project performance and health metrics coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Resource Utilization</CardTitle>
              <CardDescription className="text-gray-400">Current resource capacity and utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {utilizationData.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-white">{resource.resource}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${resource.utilization}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm w-12">{resource.utilization}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Client Analytics</h3>
            <p className="text-gray-400">Client revenue, retention, and segmentation analytics coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Operations Analytics</h3>
            <p className="text-gray-400">Compliance and operational metrics coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Predictive Analytics</h3>
            <p className="text-gray-400">Forecasting and trend analysis coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="text-center py-12">
            <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Custom Reports</h3>
            <p className="text-gray-400">Report builder with custom templates coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        reportTitle={getReportData().title}
        onExport={handleExport}
      />
    </div>
  );
};

export default Reports;
