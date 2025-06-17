import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  UserCheck, 
  Clock, 
  Building, 
  DollarSign, 
  BarChart3, 
  Settings,
  Bell,
  ChevronDown,
  User,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavTab {
  path: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navigationTabs: NavTab[] = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/projects", label: "Projects", icon: FolderOpen },
  { path: "/clients", label: "Clients", icon: Users },
  { path: "/team", label: "Team", icon: UserCheck },
  { path: "/time-tracking", label: "Time Tracking", icon: Clock },
  { path: "/invoices", label: "Invoices", icon: DollarSign },
  { path: "/reports", label: "Reports", icon: BarChart3 },
  { path: "/company", label: "Company", icon: Building },
  { path: "/settings", label: "Settings", icon: Settings },
];

interface TopNavLayoutProps {
  children: React.ReactNode;
}

const TopNavLayout: React.FC<TopNavLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 py-6 px-4 flex-shrink-0">
          <div className="mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <LayoutDashboard className="h-6 w-6 text-teal-500" />
              <span className="text-lg font-semibold dark:text-white">ProServAI</span>
            </Link>
          </div>

          <nav className="flex flex-col space-y-2">
            {navigationTabs.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${location.pathname === tab.path ? 'bg-gray-100 dark:bg-gray-700 font-medium' : ''}`}
              >
                <tab.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>{tab.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold dark:text-gray-100">
                {navigationTabs.find(tab => tab.path === location.pathname)?.label || 'Dashboard'}
              </h2>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleDarkMode}>
                  {isDarkMode ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Page Content */}
          <div className="p-6 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TopNavLayout;
