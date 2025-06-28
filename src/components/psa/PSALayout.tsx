
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
  ChevronDown,
  Bell,
  User,
  Palette
} from 'lucide-react';
import { useNotifications, useMarkNotificationSeen, useMarkAllNotificationsSeen } from '@/hooks/usePSAData';
import { supabase } from '@/integrations/supabase/client';

interface PSALayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const PSALayout: React.FC<PSALayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const { data: notifications = [] } = useNotifications();
  const markNotificationSeen = useMarkNotificationSeen();
  const markAllNotificationsSeen = useMarkAllNotificationsSeen();

  const unseenCount = notifications.filter(n => !n.seen).length;

  // Real-time notifications subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('New notification received:', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleNotificationClick = async (notification: any) => {
    if (!notification.seen) {
      await markNotificationSeen.mutateAsync(notification.id);
    }
    setNotificationOpen(false);
  };

  const handleMarkAllSeen = async () => {
    if (unseenCount > 0) {
      await markAllNotificationsSeen.mutateAsync();
    }
  };

  const handleSignOut = async () => {
    try {
      toast({
        title: "Signing out...",
        description: "You've been signed out successfully 👋",
      });
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out completed",
        description: "You've been signed out 👋",
        variant: "default",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project': return <FolderOpen className="h-4 w-4 text-blue-400" />;
      case 'client': return <Users className="h-4 w-4 text-green-400" />;
      case 'resource': return <UserCheck className="h-4 w-4 text-purple-400" />;
      case 'invoice': return <DollarSign className="h-4 w-4 text-yellow-400" />;
      case 'invite': return <User className="h-4 w-4 text-pink-400" />;
      default: return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

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
      {/* Top Navigation Bar */}
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 flex-1 justify-center min-w-0 px-4">
              <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide max-w-full">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    className={`flex items-center space-x-1.5 px-3 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm whitespace-nowrap flex-shrink-0 relative group ${
                      activeTab === item.key
                        ? 'bg-gradient-to-r from-teal-600/30 to-purple-600/30 text-teal-300 border border-teal-400/40 shadow-lg shadow-teal-500/20'
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
                  {unseenCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{unseenCount > 9 ? '9+' : unseenCount}</span>
                    </span>
                  )}
                </Button>

                {/* Notification Dropdown */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700 py-2 z-50 max-h-96 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                      {unseenCount > 0 && (
                        <Button
                          onClick={handleMarkAllSeen}
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-400 hover:text-blue-300 h-auto p-1"
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`px-4 py-3 hover:bg-gray-700/30 transition-colors border-b border-gray-700/30 last:border-b-0 cursor-pointer ${
                              !notification.seen ? 'bg-blue-600/10 border-l-2 border-l-blue-500' : ''
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm leading-relaxed ${!notification.seen ? 'text-white font-medium' : 'text-gray-300'}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatTimeAgo(notification.created_at)}
                                </p>
                              </div>
                              {!notification.seen && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <Bell className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">No notifications yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Profile Dropdown */}
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

                {/* User Dropdown Menu */}
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
                      
                      <button 
                        onClick={() => onTabChange('settings')}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
                      >
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
                        onClick={handleSignOut}
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

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-700/50">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    className={`flex items-center space-x-2 px-3 py-3 rounded-xl transition-all duration-300 font-medium ${
                      activeTab === item.key
                        ? 'bg-gradient-to-r from-teal-600/20 to-purple-600/20 text-teal-400 border border-teal-500/30'
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
                  onClick={handleSignOut}
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

export default PSALayout;
