
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
  ChevronDown
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex flex-col">
      {/* Top Navigation Bar - Fixed height */}
      <nav className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 shadow-xl sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            
            {/* Logo */}
            <div className="flex items-center space-x-3 flex-shrink-0 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white whitespace-nowrap">PSA Platform</h1>
              </div>
            </div>

            {/* Desktop Navigation - with better spacing and overflow handling */}
            <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center min-w-0 px-4">
              <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide max-w-full">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-lg transition-all duration-200 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                      activeTab === item.key
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30 shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md'
                    }`}
                    onClick={() => onTabChange(item.key)}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden xl:block">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* User Profile & Mobile Menu - with proper spacing */}
            <div className="flex items-center space-x-3 flex-shrink-0 min-w-0">
              
              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-all duration-200 border border-gray-600/50 min-w-0"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
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

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <p className="text-sm font-medium text-white truncate">
                        {user?.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
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
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  variant="outline"
                  size="icon"
                  className="bg-gray-700/50 border-gray-600 text-white hover:bg-gray-700 backdrop-blur-sm flex-shrink-0"
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-700/50">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    className={`flex items-center space-x-2 px-3 py-3 rounded-lg transition-all duration-200 font-medium ${
                      activeTab === item.key
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/30'
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
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content - Flexible height */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(userMenuOpen || mobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
          }} 
        />
      )}
    </div>
  );
};

export default TopNavLayout;
