
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
      color: 'text-teal-400',
      bgColor: 'from-teal-500/10 to-teal-600/5',
      borderColor: 'border-teal-500/20'
    },
    { 
      title: 'Total Clients', 
      value: '48', 
      change: '+5 this month', 
      changeType: 'positive',
      icon: Users, 
      color: 'text-emerald-400',
      bgColor: 'from-emerald-500/10 to-emerald-600/5',
      borderColor: 'border-emerald-500/20'
    },
    { 
      title: 'Billable Hours', 
      value: '2,340', 
      change: '+12% this month', 
      changeType: 'positive',
      icon: Clock, 
      color: 'text-purple-400',
      bgColor: 'from-purple-500/10 to-purple-600/5',
      borderColor: 'border-purple-500/20'
    },
    { 
      title: 'Revenue', 
      value: '$124K', 
      change: '+8% this month', 
      changeType: 'positive',
      icon: DollarSign, 
      color: 'text-amber-400',
      bgColor: 'from-amber-500/10 to-amber-600/5',
      borderColor: 'border-amber-500/20'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-3">
          Dashboard
        </h1>
        <p className="text-gray-400 text-lg">Welcome to your professional services overview</p>
      </div>

      {/* Quick Action Panel */}
      <Card className="bg-gradient-to-r from-gray-800/60 to-gray-700/40 border-gray-600/50 rounded-2xl shadow-2xl hover:shadow-teal-500/10 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center space-x-2">
            <Plus className="h-5 w-5 text-teal-400" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription className="text-gray-400">Fast access to commonly used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-teal-500/20 transition-all duration-300 hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Client
            </Button>
            <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105">
              <FileText className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
              <div className={`p-2 rounded-xl bg-gray-800/50 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="flex items-center space-x-1">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-400" />
                )}
                <p className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Chart */}
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 border-gray-600/50 rounded-2xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white text-xl">Project Status Distribution</CardTitle>
            </div>
            <CardDescription className="text-gray-400">Current project status breakdown</CardDescription>
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
                    color: '#fff',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue vs Expenses */}
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 border-gray-600/50 rounded-2xl shadow-2xl hover:shadow-teal-500/10 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-teal-400" />
              <CardTitle className="text-white text-xl">Revenue vs Expenses</CardTitle>
            </div>
            <CardDescription className="text-gray-400">Monthly financial performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #4b5563',
                    borderRadius: '12px',
                    color: '#fff',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                  }} 
                />
                <Bar dataKey="revenue" fill="#14b8a6" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Resource Utilization */}
      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 border-gray-600/50 rounded-2xl shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <CardTitle className="text-white text-xl">Resource Utilization</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Team member utilization rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={utilizationData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #4b5563',
                  borderRadius: '12px',
                  color: '#fff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                }} 
              />
              <Bar dataKey="utilization" fill="#10b981" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Enhanced Recent Activity */}
      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 border-gray-600/50 rounded-2xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <CardTitle className="text-white text-xl">Recent Activity</CardTitle>
          </div>
          <CardDescription className="text-gray-400">Latest updates across your projects</CardDescription>
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
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/20">
                <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                  item.type === 'success' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' :
                  item.type === 'warning' ? 'bg-amber-500 shadow-lg shadow-amber-500/30' :
                  item.type === 'error' ? 'bg-red-500 shadow-lg shadow-red-500/30' :
                  'bg-teal-500 shadow-lg shadow-teal-500/30'
                }`}></div>
                <div className="flex-1">
                  <span className="text-gray-200 text-sm leading-relaxed font-medium">{item.activity}</span>
                  <p className="text-xs text-gray-500 mt-1">{item.time}</p>
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
