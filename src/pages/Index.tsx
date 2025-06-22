
import React, { useState } from 'react';
import PSALayout from '@/components/psa/PSALayout';
import Dashboard from '@/components/psa/Dashboard';
import Projects from '@/components/psa/Projects';
import Clients from '@/components/psa/Clients';
import Resources from '@/components/psa/Resources';
import Timesheets from '@/components/psa/Timesheets';
import Vendors from '@/components/psa/Vendors';
import Financial from '@/components/psa/Financial';
import Reports from '@/components/psa/Reports';
import APIStatusDashboard from '@/components/psa/APIStatusDashboard';
import Settings from '@/components/psa/Settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <Projects />;
      case 'clients':
        return <Clients />;
      case 'resources':
        return <Resources />;
      case 'timesheets':
        return <Timesheets />;
      case 'vendors':
        return <Vendors />;
      case 'financial':
        return <Financial />;
      case 'reports':
        return <Reports />;
      case 'api-status':
        return <APIStatusDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <PSALayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </PSALayout>
  );
};

export default Index;
