import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  TrendingUp, 
  Users, 
  FolderOpen, 
  Clock, 
  DollarSign, 
  Plus, 
  UserPlus, 
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Dashboard = () => {
  // Mock data for charts
  const projectStatusData = [
    { name: 'Active', value: 12, color: '#14b8a6' },
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
    { 
      title: 'Active Projects', 
      value: '12', 
      change: '+2 this month', 
      changeType: 'positive',
      icon: FolderOpen, 
      color: 'text-teal-600',
      bgColor: 'from-teal-500/20 to-teal-600/10',
      borderColor: 'border-teal-500/30'
    },
    { 
      title: 'Total Clients', 
      value: '48', 
      change: '+5 this month', 
      changeType: 'positive',
      icon: Users, 
      color: 'text-emerald-600',
      bgColor: 'from-emerald-500/20 to-emerald-600/10',
      borderColor: 'border-emerald-500/30'
    },
    { 
      title: 'Billable Hours', 
      value: '2,340', 
      change: '+12% this month', 
      changeType: 'positive',
      icon: Clock, 
      color: 'text-purple-600',
      bgColor: 'from-purple-500/20 to-purple-600/10',
      borderColor: 'border-purple-500/30'
    },
    { 
      title: 'Revenue', 
      value: '$124K', 
      change: '+8% this month', 
      changeType: 'positive',
      icon: DollarSign, 
      color: 'text-amber-600',
      bgColor: 'from-amber-500/20 to-amber-600/10',
      borderColor: 'border-amber-500/30'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-3">
          Dashboard
        </h1>
        <p className="text-gray-300 text-lg">Welcome to your professional services overview</p>
      </div>

      {/* Quick Action Panel - Updated with much lighter transparent background */}
      <Card className="bg-gray-800/10 backdrop-blur-md border-gray-700/30 rounded-2xl shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center space-x-2">
            <Plus className="h-5 w-5 text-teal-400" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription className="text-gray-300">Fast access to commonly used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Client
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 rounded-xl">
              <FileText className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Cards - Keep white background */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
              <div className={`p-2 rounded-xl ${stat.color} bg-gray-50`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="flex items-center space-x-1">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
                <p className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Charts Grid - Updated with much lighter transparent background */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Chart */}
        <Card className="bg-gray-800/10 backdrop-blur-md border-gray-700/30 rounded-2xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white text-xl">Project Status Distribution</CardTitle>
            </div>
            <CardDescription className="text-gray-300">Current project status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #4b5563',
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue vs Expenses */}
        <Card className="bg-gray-800/10 backdrop-blur-md border-gray-700/30 rounded-2xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-teal-400" />
              <CardTitle className="text-white text-xl">Revenue vs Expenses</CardTitle>
            </div>
            <CardDescription className="text-gray-300">Monthly financial performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#d1d5db" />
                <YAxis stroke="#d1d5db" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #4b5563',
                    borderRadius: '12px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="revenue" fill="#14b8a6" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Resource Utilization - Updated with much lighter transparent background */}
      <Card className="bg-gray-800/10 backdrop-blur-md border-gray-700/30 rounded-2xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <CardTitle className="text-white text-xl">Resource Utilization</CardTitle>
          </div>
          <CardDescription className="text-gray-300">Team member utilization rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={utilizationData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" domain={[0, 100]} stroke="#d1d5db" />
              <YAxis dataKey="name" type="category" stroke="#d1d5db" width={120} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #4b5563',
                  borderRadius: '12px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="utilization" fill="#10b981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Enhanced Recent Activity - Updated with much lighter transparent background */}
      <Card className="bg-gray-800/10 backdrop-blur-md border-gray-700/30 rounded-2xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <CardTitle className="text-white text-xl">Recent Activity</CardTitle>
          </div>
          <CardDescription className="text-gray-300">Latest updates across your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { activity: 'Project Alpha milestone completed by John Smith', time: '2 hours ago', type: 'success' },
              { activity: 'New client TechCorp Inc. onboarded', time: '4 hours ago', type: 'info' },
              { activity: 'Invoice #INV-2024-001 sent to Acme Corp', time: '6 hours ago', type: 'warning' },
              { activity: 'Resource allocation updated for Q4 projects', time: '8 hours ago', type: 'info' },
              { activity: 'Timesheet approval pending for 5 team members', time: '1 day ago', type: 'warning' },
              { activity: 'Vendor contract renewal due in 30 days', time: '1 day ago', type: 'error' }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-700/10 backdrop-blur-sm rounded-xl hover:bg-gray-600/10 transition-all duration-200">
                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                  item.type === 'success' ? 'bg-emerald-500' :
                  item.type === 'warning' ? 'bg-amber-500' :
                  item.type === 'error' ? 'bg-red-500' :
                  'bg-teal-500'
                }`}></div>
                <div className="flex-1">
                  <span className="text-white text-sm leading-relaxed font-medium">{item.activity}</span>
                  <p className="text-xs text-gray-300 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
