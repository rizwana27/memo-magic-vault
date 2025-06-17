
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, FolderOpen, Clock, DollarSign } from 'lucide-react';

const Dashboard = () => {
  // Mock data for charts
  const projectStatusData = [
    { name: 'Active', value: 12, color: '#3b82f6' },
    { name: 'Planning', value: 5, color: '#f59e0b' },
    { name: 'On Hold', value: 2, color: '#ef4444' },
    { name: 'Completed', value: 18, color: '#10b981' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 85000, expenses: 62000 },
    { month: 'Feb', revenue: 92000, expenses: 68000 },
    { month: 'Mar', revenue: 78000, expenses: 55000 },
    { month: 'Apr', revenue: 105000, expenses: 78000 },
    { month: 'May', revenue: 118000, expenses: 85000 },
    { month: 'Jun', revenue: 124000, expenses: 89000 },
  ];

  const utilizationData = [
    { name: 'John Smith', utilization: 92 },
    { name: 'Sarah Davis', utilization: 87 },
    { name: 'Mike Johnson', utilization: 95 },
    { name: 'Emily Brown', utilization: 78 },
    { name: 'David Wilson', utilization: 85 },
  ];

  const stats = [
    { title: 'Active Projects', value: '12', change: '+2 this month', icon: FolderOpen, color: 'text-blue-500' },
    { title: 'Total Clients', value: '48', change: '+5 this month', icon: Users, color: 'text-green-500' },
    { title: 'Billable Hours', value: '2,340', change: '+12% this month', icon: Clock, color: 'text-purple-500' },
    { title: 'Revenue', value: '$124K', change: '+8% this month', icon: DollarSign, color: 'text-yellow-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to your PSA platform overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Chart */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Project Status Distribution</CardTitle>
            <CardDescription className="text-gray-400">Current project status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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

        {/* Revenue vs Expenses */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Revenue vs Expenses</CardTitle>
            <CardDescription className="text-gray-400">Monthly financial performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
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
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Resource Utilization */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Resource Utilization</CardTitle>
          <CardDescription className="text-gray-400">Team member utilization rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilizationData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="utilization" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <CardDescription className="text-gray-400">Latest updates across your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              'Project Alpha milestone completed by John Smith',
              'New client TechCorp Inc. onboarded',
              'Invoice #INV-2024-001 sent to Acme Corp',
              'Resource allocation updated for Q4 projects',
              'Timesheet approval pending for 5 team members',
              'Vendor contract renewal due in 30 days'
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-300 text-sm leading-relaxed">{activity}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
