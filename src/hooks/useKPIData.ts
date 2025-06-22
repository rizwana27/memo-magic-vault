
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// KPI hook for resource utilization
export const useResourceUtilization = () => {
  return useQuery({
    queryKey: ['kpi-resource-utilization'],
    queryFn: async () => {
      // Get all timesheets with hours
      const { data: timesheets, error: timesheetsError } = await supabase
        .from('timesheets')
        .select('hours, billable, date, created_by');

      if (timesheetsError) throw timesheetsError;

      // Get all active resources
      const { data: resources, error: resourcesError } = await supabase
        .from('resources')
        .select('resource_id, full_name, availability, active_status')
        .eq('active_status', true);

      if (resourcesError) throw resourcesError;

      // Calculate total billable hours
      const totalBillableHours = timesheets
        ?.filter(ts => ts.billable)
        .reduce((sum, ts) => sum + (ts.hours || 0), 0) || 0;

      // Calculate total possible hours (assuming 8 hours per day for active resources)
      const workingDaysInMonth = 22; // Average working days
      const hoursPerDay = 8;
      const totalPossibleHours = resources.length * workingDaysInMonth * hoursPerDay;

      // Calculate utilization percentage
      const utilizationPercentage = totalPossibleHours > 0 
        ? Math.round((totalBillableHours / totalPossibleHours) * 100)
        : 0;

      return {
        utilizationPercentage,
        totalBillableHours,
        totalPossibleHours,
        activeResources: resources.length,
      };
    },
  });
};

// KPI hook for resource allocation breakdown
export const useResourceAllocation = () => {
  return useQuery({
    queryKey: ['kpi-resource-allocation'],
    queryFn: async () => {
      // Get all resources with department info
      const { data: resources, error: resourcesError } = await supabase
        .from('resources')
        .select('resource_id, full_name, department, active_status, availability');

      if (resourcesError) throw resourcesError;

      // Get project assignments (we'll use timesheets to determine allocation)
      const { data: timesheets, error: timesheetsError } = await supabase
        .from('timesheets')
        .select('project_id, created_by, hours, date')
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (timesheetsError) throw timesheetsError;

      // Calculate allocation by department
      const departmentAllocation: Record<string, { allocated: number; total: number }> = {};
      
      resources?.forEach(resource => {
        const dept = resource.department || 'Unassigned';
        if (!departmentAllocation[dept]) {
          departmentAllocation[dept] = { allocated: 0, total: 0 };
        }
        departmentAllocation[dept].total++;
        
        // Check if resource has recent timesheet entries (considered allocated)
        const hasRecentWork = timesheets?.some(ts => ts.created_by === resource.resource_id);
        if (hasRecentWork) {
          departmentAllocation[dept].allocated++;
        }
      });

      // Calculate overall allocation stats
      const totalResources = resources?.length || 0;
      const allocatedResources = Object.values(departmentAllocation)
        .reduce((sum, dept) => sum + dept.allocated, 0);
      
      return {
        totalResources,
        allocatedResources,
        unallocatedResources: totalResources - allocatedResources,
        departmentBreakdown: departmentAllocation,
        allocationPercentage: totalResources > 0 
          ? Math.round((allocatedResources / totalResources) * 100)
          : 0,
      };
    },
  });
};

// Enhanced resource utilization with individual breakdowns
export const useDetailedResourceUtilization = () => {
  return useQuery({
    queryKey: ['detailed-resource-utilization'],
    queryFn: async () => {
      // Get all resources
      const { data: resources, error: resourcesError } = await supabase
        .from('resources')
        .select('resource_id, full_name, department, availability, active_status');

      if (resourcesError) throw resourcesError;

      // Get timesheets for the last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const { data: timesheets, error: timesheetsError } = await supabase
        .from('timesheets')
        .select('created_by, hours, billable, date')
        .gte('date', thirtyDaysAgo);

      if (timesheetsError) throw timesheetsError;

      // Calculate utilization per resource
      const resourceUtilization = resources?.map(resource => {
        const resourceTimesheets = timesheets?.filter(ts => ts.created_by === resource.resource_id) || [];
        const totalHours = resourceTimesheets.reduce((sum, ts) => sum + (ts.hours || 0), 0);
        const billableHours = resourceTimesheets
          .filter(ts => ts.billable)
          .reduce((sum, ts) => sum + (ts.hours || 0), 0);

        // Assuming 8 hours per day, 22 working days per month
        const expectedHours = 22 * 8 * (resource.availability || 100) / 100;
        const utilizationPercentage = expectedHours > 0 
          ? Math.round((billableHours / expectedHours) * 100)
          : 0;

        return {
          resourceId: resource.resource_id,
          name: resource.full_name,
          department: resource.department,
          totalHours,
          billableHours,
          expectedHours,
          utilizationPercentage,
          isOverUtilized: utilizationPercentage > 100,
          isUnderUtilized: utilizationPercentage < 70,
        };
      }) || [];

      return resourceUtilization;
    },
  });
};

// Project resource allocation
export const useProjectResourceAllocation = (projectId?: string) => {
  return useQuery({
    queryKey: ['project-resource-allocation', projectId],
    queryFn: async () => {
      if (!projectId) return null;

      // Get timesheets for the specific project
      const { data: timesheets, error: timesheetsError } = await supabase
        .from('timesheets')
        .select('created_by, hours, date')
        .eq('project_id', projectId);

      if (timesheetsError) throw timesheetsError;

      // Get resource details for those who worked on the project
      const resourceIds = [...new Set(timesheets?.map(ts => ts.created_by) || [])];
      
      if (resourceIds.length === 0) return [];

      const { data: resources, error: resourcesError } = await supabase
        .from('resources')
        .select('resource_id, full_name, department, role')
        .in('resource_id', resourceIds);

      if (resourcesError) throw resourcesError;

      // Calculate allocation per resource
      const allocation = resources?.map(resource => {
        const resourceHours = timesheets
          ?.filter(ts => ts.created_by === resource.resource_id)
          .reduce((sum, ts) => sum + (ts.hours || 0), 0) || 0;

        return {
          resourceId: resource.resource_id,
          name: resource.full_name,
          department: resource.department,
          role: resource.role,
          totalHours: resourceHours,
        };
      }) || [];

      return allocation;
    },
    enabled: !!projectId,
  });
};
