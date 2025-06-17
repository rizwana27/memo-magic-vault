
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">System configuration and preferences</p>
      </div>
      
      <div className="text-center py-16">
        <SettingsIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-xl font-medium text-white mb-3">Settings Configuration</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          System configuration and preferences coming soon. This will include user management, 
          system settings, integrations, and more.
        </p>
      </div>
    </div>
  );
};

export default Settings;
