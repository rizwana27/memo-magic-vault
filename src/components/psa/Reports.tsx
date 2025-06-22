import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import { 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Target
} from 'lucide-react';
import { useProjectsApi, useResourcesApi, useTimesheetsApi, useInvoicesApi } from '@/hooks/useApiIntegration';
import { useKPIData } from '@/hooks/useKPIData';

const Reports = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  
  const { data: projects = [] } = useProjectsApi();
  const { data: resources = [] } = useResourcesApi();
  const { data: timesheets = [] } = useTimesheetsApi();
  const { data: invoices = [] } = useInvoicesApi();
  
  const kpiData = useKPIData();

  const timeRangeOptions = [
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'Last 6 Months', value: '6mo' },
    { label: 'Last Year', value: '1y' },
  ];

  // Data processing and calculations
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const onHoldProjects = projects.filter(p => p.status === 'on_hold').length;

  const totalResources = resources.length;
  const activeResources = resources.filter(r => r.active_status).length;
  const availableResources = resources.filter(r => r.availability > 0.75).length;

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(i => i.status === 'paid').length;
  const pendingInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue').length;
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total_amount || 0), 0);

  // Chart data
  const projectStatusData = [
    { name: 'Active', value: activeProjects },
    { name: 'Completed', value: completedProjects },
    { name: 'On Hold', value: onHoldProjects },
  ];

  const resourceAvailabilityData = [
    { name: 'Available', value: availableResources },
    { name: 'Allocated', value: activeResources - availableResources },
  ];

  const invoiceStatusData = [
    { name: 'Paid', value: paidInvoices },
    { name: 'Pending', value: pendingInvoices },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400 mt-1">Get insights into your PSA data</p>
        </div>

        {/* Time Range Selector */}
        <div className="mt-4 md:mt-0">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-blue-400" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalProjects}</div>
            <p className="text-sm text-gray-300 mt-1">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500">
                {activeProjects} Active
              </Badge>{' '}
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500">
                {completedProjects} Completed
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-400" />
              Team Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalResources}</div>
            <p className="text-sm text-gray-300 mt-1">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500">
                {activeResources} Active
              </Badge>{' '}
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500">
                {availableResources} Available
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
            <p className="text-sm text-gray-300 mt-1">
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500">
                {paidInvoices} Paid
              </Badge>{' '}
              <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500">
                {pendingInvoices} Pending
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              Resource Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{kpiData.resourceUtilization}%</div>
            <p className="text-sm text-gray-300 mt-1">
              <Progress value={kpiData.resourceUtilization} className="h-2" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Project Status Distribution</CardTitle>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </CardHeader>
        </Card>

        {/* Resource Availability */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Resource Availability</CardTitle>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={resourceAvailabilityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {resourceAvailabilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Status */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Invoice Status</CardTitle>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={invoiceStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {invoiceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </CardHeader>
        </Card>

        {/* Revenue Trend (Dummy Data) */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white">Revenue Trend</CardTitle>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { name: 'Jan', revenue: 4000 },
                  { name: 'Feb', revenue: 3000 },
                  { name: 'Mar', revenue: 2000 },
                  { name: 'Apr', revenue: 2780 },
                  { name: 'May', revenue: 1890 },
                  { name: 'Jun', revenue: 2390 },
                  { name: 'Jul', revenue: 3490 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
