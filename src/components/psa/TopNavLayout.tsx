
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  UserCheck, 
  Calendar,
  Clock,
  DollarSign,
  Building,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  User,
  Palette,
  Notification
} from 'lucide-react';

interface TopNavLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TopNavLayout: React.FC<TopNavLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
    { icon: FolderOpen, label: 'Projects', key: 'projects' },
    { icon: Users, label: 'Clients', key: 'clients' },
    { icon: UserCheck, label: 'Resources', key: 'resources' },
    { icon: Clock, label: 'Timesheets', key: 'timesheets' },
    { icon: Building, label: 'Vendors', key: 'vendors' },
    { icon: DollarSign, label: 'Financial', key: 'financial' },
    { icon: TrendingUp, label: 'Reports', key: 'reports' },
    { icon: Settings, label: 'Settings', key: 'settings' }
  ];

  const notifications = [
    { id: 1, message: 'Timesheet approval pending for 3 members', time: '5 min ago', type: 'warning' },
    { id: 2, message: 'Project Alpha milestone completed', time: '1 hour ago', type: 'success' },
    { id: 3, message: 'Invoice payment overdue from TechCorp', time: '2 hours ago', type: 'error' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex flex-col">
      {/* Top Navigation Bar - Enhanced with glow effects */}
      <nav className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 shadow-2xl sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 flex-shrink-0 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  PSA Platform
                </h1>
                <p className="text-xs text-teal-400 font-medium">Professional Services</p>
              </div>
            </div>

            {/* Desktop Navigation - Enhanced with glow effects */}
            <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center min-w-0 px-4">
              <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide max-w-full">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    className={`flex items-center space-x-1.5 px-3 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm whitespace-nowrap flex-shrink-0 relative group ${
                      activeTab === item.key
                        ? 'bg-gradient-to-r from-teal-600/30 to-purple-600/30 text-teal-300 border border-teal-400/40 shadow-lg shadow-teal-500/20 glow-effect'
                        : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-700/60 hover:to-gray-600/60 hover:text-white hover:shadow-lg hover:shadow-purple-500/10 hover:scale-105'
                    }`}
                    onClick={() => onTabChange(item.key)}
                  >
                    <item.icon className={`h-4 w-4 flex-shrink-0 ${activeTab === item.key ? 'text-teal-400' : ''}`} />
                    <span className="hidden xl:block">{item.label}</span>
                    {activeTab === item.key && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-teal-400 to-purple-400 rounded-full"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications & User Profile */}
            <div className="flex items-center space-x-3 flex-shrink-0 min-w-0">
              
              {/* Notification Bell */}
              <div className="relative">
                <Button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">3</span>
                  </span>
                </Button>

                {/* Notification Dropdown */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="px-4 py-3 hover:bg-gray-700/30 transition-colors border-b border-gray-700/30 last:border-b-0">
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-300 leading-relaxed">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Profile Dropdown - Enhanced */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-700/50 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 transition-all duration-300 border border-gray-600/50 hover:border-teal-500/30 min-w-0 hover:shadow-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white text-sm font-medium">
                      {user?.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left min-w-0 max-w-32">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.user_metadata?.full_name || user?.email}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </button>

                {/* Enhanced User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-medium text-white truncate">
                        {user?.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    
                    <div className="py-2">
                      <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-medium">Account Settings</span>
                      </button>
                      
                      <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                        <Bell className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-medium">Notifications</span>
                      </button>
                      
                      <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors">
                        <Palette className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-medium">Theme Settings</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-700 pt-2">
                      <button
                        onClick={() => {
                          signOut();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-colors"
                      >
                        <LogOut className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  variant="outline"
                  size="icon"
                  className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700 backdrop-blur-sm flex-shrink-0 hover:border-teal-500/30 transition-all duration-200"
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-700/50">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    className={`flex items-center space-x-2 px-3 py-3 rounded-xl transition-all duration-300 font-medium ${
                      activeTab === item.key
                        ? 'bg-gradient-to-r from-teal-600/20 to-purple-600/20 text-teal-400 border border-teal-500/30 glow-effect'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                    onClick={() => {
                      onTabChange(item.key);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
              {/* Mobile Sign Out */}
              <div className="border-t border-gray-700/50 pt-4">
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(userMenuOpen || mobileMenuOpen || notificationOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
            setNotificationOpen(false);
          }} 
        />
      )}
    </div>
  );
};

export default TopNavLayout;
