
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  UserCheck, 
  Clock, 
  DollarSign, 
  Truck, 
  BarChart3, 
  Settings,
  LogOut,
  UserCircle
} from 'lucide-react';

interface TopNavLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TopNavLayout = ({ children, activeTab, onTabChange }: TopNavLayoutProps) => {
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'resources', label: 'Resources', icon: UserCheck },
    { id: 'timesheets', label: 'Timesheets', icon: Clock },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'vendors', label: 'Vendors', icon: Truck },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Top Navigation */}
      <Card className="bg-gray-800/50 border-gray-700 rounded-none border-t-0 border-l-0 border-r-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-white">PSA Portal</h1>
            <nav className="flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={`text-sm ${
                      activeTab === item.id 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                    onClick={() => onTabChange(item.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-300">
              <UserCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <a 
              href="/login/employee" 
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Employee Login
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default TopNavLayout;
