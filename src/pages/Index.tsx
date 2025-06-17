
import React, { useState } from 'react';
import TopNavLayout from '@/components/psa/TopNavLayout';
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
      case 'financial':
        return <Financial />;
      case 'vendors':
        return <Vendors />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <TopNavLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </TopNavLayout>
  );
};

export default Index;
