
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
  X,
  Clock,
  DollarSign,
  Building,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Zap
} from 'lucide-react';

interface PSALayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const PSALayout: React.FC<PSALayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
    { icon: FolderOpen, label: 'Projects', key: 'projects' },
    { icon: Users, label: 'Clients', key: 'clients' },
    { icon: UserCheck, label: 'Resources', key: 'resources' },
    { icon: Clock, label: 'Timesheets', key: 'timesheets' },
    { icon: Building, label: 'Vendors', key: 'vendors' },
    { icon: DollarSign, label: 'Financial', key: 'financial' },
    { icon: TrendingUp, label: 'Reports', key: 'reports' },
    { icon: Zap, label: 'API Status', key: 'api-status' },
    { icon: Settings, label: 'Settings', key: 'settings' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="outline"
          size="icon"
          className="bg-gray-800/90 border-gray-600 text-white hover:bg-gray-700/90 backdrop-blur-sm shadow-lg"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gray-800/95 backdrop-blur-sm border-r border-gray-700/50 transform transition-all duration-300 z-50 shadow-2xl ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} w-64`}>
        
        {/* Collapse button for desktop */}
        <div className="hidden lg:block absolute -right-3 top-6 z-10">
          <Button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            variant="outline"
            size="icon"
            className="h-6 w-6 bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white shadow-lg"
          >
            {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        </div>

        {/* Logo */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-white">PSA Platform</h1>
                <p className="text-sm text-gray-400">Professional Services</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col justify-between py-4">
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  activeTab === item.key
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md'
                }`}
                onClick={() => {
                  onTabChange(item.key);
                  setSidebarOpen(false);
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="truncate font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="px-3 pt-4 border-t border-gray-700/50">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3 mb-4 px-3 py-2 rounded-lg bg-gray-700/30">
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
            )}
            <Button
              onClick={signOut}
              variant="outline"
              size={sidebarCollapsed ? "icon" : "sm"}
              className="w-full bg-red-600/10 border-red-500/30 text-red-400 hover:bg-red-600/20 hover:text-red-300 hover:border-red-400/50 transition-all duration-200 shadow-md"
              title={sidebarCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2">Sign Out</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 min-h-screen ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pt-12 lg:pt-0">
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSALayout;
