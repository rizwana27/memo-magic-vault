
import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Clock, 
  FileText, 
  DollarSign, 
  TruckIcon,
  BarChart3,
  Settings,
  Globe
} from 'lucide-react';

const PSALayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/psa', icon: LayoutDashboard },
    { name: 'Projects', href: '/psa/projects', icon: FolderOpen },
    { name: 'Clients', href: '/psa/clients', icon: Users },
    { name: 'Resources', href: '/psa/resources', icon: Users },
    { name: 'Timesheets', href: '/psa/timesheets', icon: Clock },
    { name: 'Financial', href: '/psa/financial', icon: DollarSign },
    { name: 'Vendors', href: '/psa/vendors', icon: TruckIcon },
    { name: 'Reports', href: '/psa/reports', icon: BarChart3 },
    { name: 'API Demo', href: '/psa/api-demo', icon: Globe },
    { name: 'Settings', href: '/psa/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
              <h1 className="text-xl font-bold text-white">PSA Platform</h1>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">
            <div className="p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PSALayout;
