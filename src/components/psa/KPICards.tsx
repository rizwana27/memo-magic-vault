
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';
import { useResourceUtilization, useResourceAllocation } from '@/hooks/useKPIData';

const KPICards = () => {
  const { data: utilization, isLoading: utilizationLoading } = useResourceUtilization();
  const { data: allocation, isLoading: allocationLoading } = useResourceAllocation();

  if (utilizationLoading || allocationLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-gray-600 animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-600 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Average Resource Utilization */}
      <Card className="bg-purple-100/10 border-purple-400/30 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-100">
            Avg Resource Utilization
          </CardTitle>
          <Activity className="h-4 w-4 text-purple-300" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {utilization?.utilizationPercentage || 0}%
          </div>
          <Progress 
            value={utilization?.utilizationPercentage || 0} 
            className="mt-2 h-2"
          />
          <p className="text-xs text-purple-200 mt-1">
            {utilization?.totalBillableHours || 0}h billable this month
          </p>
        </CardContent>
      </Card>

      {/* Resource Allocation Status */}
      <Card className="bg-blue-100/10 border-blue-400/30 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">
            Resource Allocation
          </CardTitle>
          <Users className="h-4 w-4 text-blue-300" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {allocation?.allocationPercentage || 0}%
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-green-400 border-green-400">
              {allocation?.allocatedResources || 0} Allocated
            </Badge>
            <Badge variant="outline" className="text-orange-400 border-orange-400">
              {allocation?.unallocatedResources || 0} Available
            </Badge>
          </div>
          <p className="text-xs text-blue-200 mt-1">
            {allocation?.totalResources || 0} total resources
          </p>
        </CardContent>
      </Card>

      {/* Department Breakdown */}
      <Card className="bg-green-100/10 border-green-400/30 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-100">
            Top Department
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-300" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {allocation?.departmentBreakdown ? 
              Object.entries(allocation.departmentBreakdown)
                .sort(([,a], [,b]) => b.total - a.total)[0]?.[0] || 'N/A'
              : 'N/A'
            }
          </div>
          <p className="text-xs text-green-200 mt-1">
            Most active department
          </p>
        </CardContent>
      </Card>

      {/* Utilization Health */}
      <Card className="bg-orange-100/10 border-orange-400/30 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-100">
            Utilization Health
          </CardTitle>
          {(utilization?.utilizationPercentage || 0) > 85 ? (
            <AlertTriangle className="h-4 w-4 text-orange-300" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-300" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {(utilization?.utilizationPercentage || 0) > 85 ? 'High' : 
             (utilization?.utilizationPercentage || 0) > 60 ? 'Good' : 'Low'}
          </div>
          <p className="text-xs text-orange-200 mt-1">
            {(utilization?.utilizationPercentage || 0) > 85 
              ? 'Consider hiring' 
              : 'Healthy utilization'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPICards;
