
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Timesheets from '@/components/psa/Timesheets';
import AIDataCopilot from '@/components/psa/AIDataCopilot';
import TopNavLayout from '@/components/psa/TopNavLayout';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  return (
    <TopNavLayout activeTab="timesheets" onTabChange={() => {}}>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Employee Portal</h1>
          <p className="text-gray-300">Welcome back, {user?.email}</p>
        </div>
        <Timesheets />
      </div>
      
      {/* AI Data Copilot - positioned bottom-right */}
      <AIDataCopilot />
    </TopNavLayout>
  );
};

export default EmployeeDashboard;
