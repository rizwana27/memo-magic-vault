
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Vendors from '@/components/psa/Vendors';
import AIDataCopilot from '@/components/psa/AIDataCopilot';
import TopNavLayout from '@/components/psa/TopNavLayout';

const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleTabChange = (tab: string) => {
    // Handle tab changes if needed
    console.log('Tab changed to:', tab);
  };

  return (
    <TopNavLayout activeTab="vendors" onTabChange={handleTabChange}>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Vendor Portal</h1>
          <p className="text-gray-300">Welcome back, {user?.email}</p>
        </div>
        <Vendors />
      </div>
      
      {/* AI Data Copilot - positioned bottom-right */}
      <AIDataCopilot />
    </TopNavLayout>
  );
};

export default VendorDashboard;
