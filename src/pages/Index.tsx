
import React, { useState } from 'react';
import PSALayout from '@/components/psa/PSALayout';
import Dashboard from '@/components/psa/Dashboard';
import Projects from '@/components/psa/Projects';
import Clients from '@/components/psa/Clients';
import Resources from '@/components/psa/Resources';
import Timesheets from '@/components/psa/Timesheets';
import Financial from '@/components/psa/Financial';

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
      case 'reports':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Reports</h1>
              <p className="text-gray-400">Generate and view reports</p>
            </div>
            <div className="text-center py-12">
              <p className="text-gray-400">Reports module coming soon...</p>
            </div>
          </div>
        );
      case 'vendors':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Vendors</h1>
              <p className="text-gray-400">Manage vendor relationships</p>
            </div>
            <div className="text-center py-12">
              <p className="text-gray-400">Vendors module coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-400">Configure your application</p>
            </div>
            <div className="text-center py-12">
              <p className="text-gray-400">Settings module coming soon...</p>
            </div>
          </div>
        );
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
