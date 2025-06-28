
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PSALayout from '@/components/psa/PSALayout';
import AIDataCopilot from '@/components/psa/AIDataCopilot';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import Dashboard from '@/components/psa/Dashboard';
import Projects from '@/components/psa/Projects';
import Clients from '@/components/psa/Clients';
import Resources from '@/components/psa/Resources';
import Timesheets from '@/components/psa/Timesheets';
import Financial from '@/components/psa/Financial';
import Vendors from '@/components/psa/Vendors';
import Reports from '@/components/psa/Reports';
import Settings from '@/components/psa/Settings';

const Index = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleSignOut = async () => {
    try {
      console.log('Admin signing out:', user?.email);
      toast({
        title: "Signing out...",
        description: "You've been signed out successfully 👋",
      });
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} />;
      case 'projects':
        return <Projects />;
      case 'clients':
        return <Clients />;
      case 'resources':
        return <Resources />;
      case 'timesheets':
        return <Timesheets />;
      case 'financial':
        return <Financial />;
      case 'vendors':
        return <Vendors />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <PSALayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </PSALayout>
      
      {/* Smart Notification Center - positioned bottom-left */}
      <NotificationCenter />
      
      {/* AI Data Copilot - positioned bottom-right */}
      <AIDataCopilot />
    </div>
  );
};

export default Index;
