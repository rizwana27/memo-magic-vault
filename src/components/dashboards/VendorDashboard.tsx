
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Vendors from '@/components/psa/Vendors';
import AIDataCopilot from '@/components/psa/AIDataCopilot';
import TopNavLayout from '@/components/psa/TopNavLayout';

const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return (
    <TopNavLayout activeTab="vendors" onTabChange={() => {}}>
      <div className="p-6">
        <Vendors />
      </div>
      
      {/* AI Data Copilot - positioned bottom-right */}
      <AIDataCopilot />
    </TopNavLayout>
  );
};

export default VendorDashboard;
