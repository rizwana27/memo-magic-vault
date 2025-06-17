
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  UserCheck, 
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Index = () => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: FolderOpen, label: 'Projects' },
    { icon: Users, label: 'Clients' },
    { icon: UserCheck, label: 'Resources' },
    { icon: Calendar, label: 'Calendar' },
    { icon: FileText, label: 'Reports' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="outline"
          size="icon"
          className="bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 transform transition-transform duration-300 z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">PSA Portal</h1>
          <p className="text-sm text-gray-400">Professional Services</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.user_metadata?.full_name || user?.email}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 lg:mb-8 pt-12 lg:pt-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Welcome back to your PSA portal</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
              {[
                { title: 'Active Projects', value: '12', change: '+2 this month' },
                { title: 'Total Clients', value: '48', change: '+5 this month' },
                { title: 'Available Resources', value: '23', change: '3 on leave' },
                { title: 'Revenue', value: '$124K', change: '+12% this month' }
              ].map((stat, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6">
                  <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-2">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  'Project Alpha milestone completed',
                  'New client onboarded: TechCorp Inc.',
                  'Resource allocation updated for Q4',
                  'Monthly report generated successfully'
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300 text-sm sm:text-base leading-relaxed">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
