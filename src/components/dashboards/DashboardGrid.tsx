import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WidgetLayout {
  id: string;
  component: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface DashboardGridProps {
  layout: WidgetLayout[];
  dashboardId: string;
  persona: string;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ layout, dashboardId, persona }) => {
  const renderWidget = (widget: WidgetLayout) => {
    // For now, we'll render placeholder widgets
    // In a real implementation, these would be dynamic component imports
    const getWidgetContent = (component: string) => {
      switch (component) {
        case 'ProjectPortfolioWidget':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">12</div>
                  <div className="text-sm text-gray-400">Active Projects</div>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">3</div>
                  <div className="text-sm text-gray-400">In Planning</div>
                </div>
                <div className="bg-yellow-500/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">2</div>
                  <div className="text-sm text-gray-400">At Risk</div>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">8</div>
                  <div className="text-sm text-gray-400">Delivered</div>
                </div>
              </div>
              <div className="h-32 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Portfolio Timeline Chart</span>
              </div>
            </div>
          );
        case 'ResourceAllocationWidget':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <div className="text-xl font-bold text-blue-400">85%</div>
                  <div className="text-sm text-gray-400">Utilization</div>
                </div>
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <div className="text-xl font-bold text-green-400">24</div>
                  <div className="text-sm text-gray-400">Available</div>
                </div>
              </div>
              <div className="h-24 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Resource Matrix</span>
              </div>
            </div>
          );
        case 'BusinessKPIWidget':
          return (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <div className="text-xl font-bold text-green-400">$2.4M</div>
                <div className="text-sm text-gray-400">Revenue</div>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <div className="text-xl font-bold text-blue-400">18%</div>
                <div className="text-sm text-gray-400">Growth</div>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <div className="text-xl font-bold text-purple-400">92%</div>
                <div className="text-sm text-gray-400">Satisfaction</div>
              </div>
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <div className="text-xl font-bold text-yellow-400">15%</div>
                <div className="text-sm text-gray-400">Margin</div>
              </div>
            </div>
          );
        case 'TeamPerformanceWidget':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-500/20 p-2 rounded">
                  <div className="text-lg font-bold text-green-400">94%</div>
                  <div className="text-xs text-gray-400">On Time</div>
                </div>
                <div className="bg-blue-500/20 p-2 rounded">
                  <div className="text-lg font-bold text-blue-400">87%</div>
                  <div className="text-xs text-gray-400">Quality</div>
                </div>
                <div className="bg-purple-500/20 p-2 rounded">
                  <div className="text-lg font-bold text-purple-400">91%</div>
                  <div className="text-xs text-gray-400">Velocity</div>
                </div>
              </div>
              <div className="h-20 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Team Metrics</span>
              </div>
            </div>
          );
        case 'TimesheetWidget':
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <div className="text-xl font-bold text-blue-400">32h</div>
                  <div className="text-sm text-gray-400">This Week</div>
                </div>
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <div className="text-xl font-bold text-green-400">8h</div>
                  <div className="text-sm text-gray-400">Today</div>
                </div>
              </div>
              <div className="h-16 bg-gray-700/50 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Quick Entry</span>
              </div>
            </div>
          );
        default:
          return (
            <div className="h-32 bg-gray-700/50 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Widget: {component}</span>
            </div>
          );
      }
    };

    const getWidgetTitle = (component: string) => {
      switch (component) {
        case 'ProjectPortfolioWidget': return 'Project Portfolio Overview';
        case 'ResourceAllocationWidget': return 'Resource Allocation';
        case 'StrategyPipelineWidget': return 'Strategic Pipeline';
        case 'BusinessKPIWidget': return 'Business KPIs';
        case 'RevenueForecastWidget': return 'Revenue Forecast';
        case 'ExecutiveSummaryWidget': return 'Executive Summary';
        case 'TeamPerformanceWidget': return 'Team Performance';
        case 'DepartmentBudgetWidget': return 'Department Budget';
        case 'StaffUtilizationWidget': return 'Staff Utilization';
        case 'TimesheetWidget': return 'My Timesheets';
        case 'TaskWidget': return 'My Tasks';
        case 'GoalsWidget': return 'My Goals';
        default: return component;
      }
    };

    return (
      <Card key={widget.id} className="bg-gray-800/50 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">{getWidgetTitle(widget.component)}</CardTitle>
        </CardHeader>
        <CardContent>
          {getWidgetContent(widget.component)}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {layout.map((widget) => (
        <div 
          key={widget.id} 
          className={`col-span-${widget.w || 6}`}
          style={{ gridColumn: `span ${widget.w || 6}` }}
        >
          {renderWidget(widget)}
        </div>
      ))}
    </div>
  );
};

export default DashboardGrid;
