
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { useResourceUtilizationApi } from '@/hooks/useApiIntegration';

const CapacityPlanning = () => {
  const { data: resourceUtilization, isLoading } = useResourceUtilizationApi();

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <div className="h-6 bg-gray-600 rounded w-1/3"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-600 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const overUtilized = resourceUtilization?.filter(r => r.isOverUtilized) || [];
  const underUtilized = resourceUtilization?.filter(r => r.isUnderUtilized) || [];
  const wellUtilized = resourceUtilization?.filter(r => !r.isOverUtilized && !r.isUnderUtilized) || [];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-100/10 border-red-400/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-red-300 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Over-Utilized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{overUtilized.length}</div>
            <p className="text-xs text-red-200">Need support or redistribution</p>
          </CardContent>
        </Card>

        <Card className="bg-green-100/10 border-green-400/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-300 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Well-Utilized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{wellUtilized.length}</div>
            <p className="text-xs text-green-200">Optimal utilization range</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-100/10 border-orange-400/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-300 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Under-Utilized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{underUtilized.length}</div>
            <p className="text-xs text-orange-200">Available for more work</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Resource List */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Resource Capacity Analysis</CardTitle>
          <CardDescription className="text-gray-400">
            Individual utilization breakdown for the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resourceUtilization?.map((resource) => (
              <div 
                key={resource.resourceId} 
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-white">{resource.name}</h4>
                    <Badge variant="outline" className="text-gray-300 border-gray-500">
                      {resource.department}
                    </Badge>
                    {resource.isOverUtilized && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        Over-utilized
                      </Badge>
                    )}
                    {resource.isUnderUtilized && (
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                        Under-utilized
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span>{resource.billableHours}h billable</span>
                    <span>of {resource.expectedHours}h expected</span>
                    <span className="text-gray-400">|</span>
                    <span>{resource.totalHours}h total logged</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right min-w-[100px]">
                    <div className="text-lg font-bold text-white">
                      {resource.utilizationPercentage}%
                    </div>
                    <Progress 
                      value={Math.min(resource.utilizationPercentage, 100)} 
                      className="w-20 h-2 mt-1"
                    />
                  </div>
                  {resource.utilizationPercentage > 100 ? (
                    <TrendingUp className="h-5 w-5 text-red-400" />
                  ) : resource.utilizationPercentage < 70 ? (
                    <TrendingDown className="h-5 w-5 text-orange-400" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  )}
                </div>
              </div>
            ))}
            {(!resourceUtilization || resourceUtilization.length === 0) && (
              <div className="text-center py-8 text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No resource utilization data available</p>
                <p className="text-sm">Add resources and timesheets to see capacity planning</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CapacityPlanning;
