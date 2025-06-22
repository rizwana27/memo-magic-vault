import { supabase } from '@/integrations/supabase/client';

// Core API service for PSA platform
export class PSAApiService {
  
  // Projects API
  static async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients(*),
        timesheets(hours, billable)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getProject(projectId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients(*),
        timesheets(hours, billable)
      `)
      .eq('project_id', projectId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createProject(projectData: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select(`
        *,
        client:clients(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateProject(projectId: string, updates: any) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('project_id', projectId)
      .select(`
        *,
        client:clients(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getProjectResources(projectId: string) {
    const { data: timesheets, error } = await supabase
      .from('timesheets')
      .select(`
        created_by,
        hours,
        billable
      `)
      .eq('project_id', projectId);

    if (error) throw error;

    // Get unique resource IDs
    const resourceIds = [...new Set(timesheets?.map(ts => ts.created_by).filter(Boolean))];
    
    if (resourceIds.length === 0) return [];

    const { data: resources, error: resourceError } = await supabase
      .from('resources')
      .select('*')
      .in('resource_id', resourceIds);

    if (resourceError) throw resourceError;

    // Calculate allocation per resource
    const allocation = resources?.map(resource => {
      const resourceHours = timesheets
        ?.filter(ts => ts.created_by === resource.resource_id)
        .reduce((sum, ts) => sum + (ts.hours || 0), 0) || 0;

      const billableHours = timesheets
        ?.filter(ts => ts.created_by === resource.resource_id && ts.billable)
        .reduce((sum, ts) => sum + (ts.hours || 0), 0) || 0;

      return {
        ...resource,
        totalHours: resourceHours,
        billableHours,
        utilizationPercentage: resourceHours > 0 ? Math.round((billableHours / resourceHours) * 100) : 0
      };
    }) || [];

    return allocation;
  }

  // Resources API
  static async getResources() {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getResource(resourceId: string) {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('resource_id', resourceId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createResource(resourceData: any) {
    const { data, error } = await supabase
      .from('resources')
      .insert([resourceData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateResource(resourceId: string, updates: any) {
    const { data, error } = await supabase
      .from('resources')
      .update(updates)
      .eq('resource_id', resourceId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getResourceUtilization() {
    // Get all resources
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('*');

    if (resourcesError) throw resourcesError;

    // Get timesheets for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: timesheets, error: timesheetsError } = await supabase
      .from('timesheets')
      .select('*')
      .gte('date', thirtyDaysAgo);

    if (timesheetsError) throw timesheetsError;

    // Calculate utilization per resource
    const utilization = resources?.map(resource => {
      const resourceTimesheets = timesheets?.filter(ts => ts.created_by === resource.resource_id) || [];
      const totalHours = resourceTimesheets.reduce((sum, ts) => sum + (ts.hours || 0), 0);
      const billableHours = resourceTimesheets
        .filter(ts => ts.billable)
        .reduce((sum, ts) => sum + (ts.hours || 0), 0);

      const expectedHours = 22 * 8 * (resource.availability || 100) / 100; // 22 working days
      const utilizationPercentage = expectedHours > 0 ? (billableHours / expectedHours) * 100 : 0;

      return {
        resourceId: resource.resource_id,
        name: resource.full_name,
        department: resource.department,
        totalHours,
        billableHours,
        expectedHours,
        utilizationPercentage: Math.round(utilizationPercentage),
        isOverUtilized: utilizationPercentage > 100,
        isUnderUtilized: utilizationPercentage < 70,
      };
    }) || [];

    return utilization;
  }

  static async getResourceAllocations() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Get timesheets
    const { data: timesheets, error: timesheetsError } = await supabase
      .from('timesheets')
      .select('project_id, created_by, hours')
      .gte('date', thirtyDaysAgo);

    if (timesheetsError) throw timesheetsError;

    // Get projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('project_id, project_name');

    if (projectsError) throw projectsError;

    // Get resources
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('resource_id, full_name, department');

    if (resourcesError) throw resourcesError;

    // Create allocation matrix
    const allocationMatrix = timesheets?.reduce((matrix, timesheet) => {
      const key = `${timesheet.created_by}-${timesheet.project_id}`;
      if (!matrix[key]) {
        const resource = resources?.find(r => r.resource_id === timesheet.created_by);
        const project = projects?.find(p => p.project_id === timesheet.project_id);
        
        matrix[key] = {
          resourceName: resource?.full_name || 'Unknown',
          department: resource?.department || 'Unknown',
          projectName: project?.project_name || 'Unknown',
          projectId: timesheet.project_id,
          resourceId: timesheet.created_by,
          totalHours: 0,
        };
      }
      matrix[key].totalHours += timesheet.hours || 0;
      return matrix;
    }, {} as Record<string, any>) || {};

    return Object.values(allocationMatrix);
  }

  // Timesheets API
  static async getTimesheets() {
    const { data, error } = await supabase
      .from('timesheets')
      .select(`
        *,
        project:projects(project_name, client_id)
      `)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createTimesheet(timesheetData: any) {
    const { data, error } = await supabase
      .from('timesheets')
      .insert([timesheetData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async bulkCreateTimesheets(timesheetEntries: any[]) {
    const { data, error } = await supabase
      .from('timesheets')
      .insert(timesheetEntries)
      .select();
    
    if (error) throw error;
    return data;
  }

  // KPI API endpoints
  static async getKPIResourceUtilization() {
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

    // Calculate metrics
    const totalBillableHours = timesheets
      ?.filter(ts => ts.billable)
      .reduce((sum, ts) => sum + (ts.hours || 0), 0) || 0;

    const workingDaysInMonth = 22;
    const hoursPerDay = 8;
    const totalPossibleHours = resources.length * workingDaysInMonth * hoursPerDay;

    const utilizationPercentage = totalPossibleHours > 0 
      ? Math.round((totalBillableHours / totalPossibleHours) * 100)
      : 0;

    return {
      utilizationPercentage,
      totalBillableHours,
      totalPossibleHours,
      activeResources: resources.length,
    };
  }

  static async getKPIResourceAllocation() {
    // Get all resources with department info
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('resource_id, full_name, department, active_status, availability');

    if (resourcesError) throw resourcesError;

    // Get recent timesheets for allocation determination
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
      
      // Check if resource has recent work
      const hasRecentWork = timesheets?.some(ts => ts.created_by === resource.resource_id);
      if (hasRecentWork) {
        departmentAllocation[dept].allocated++;
      }
    });

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
  }

  // Clients API
  static async getClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getClient(clientId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', clientId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createClient(clientData: any) {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateClient(clientId: string, updates: any) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('client_id', clientId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Invoices API
  static async getInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*),
        project:projects(*)
      `)
      .order('invoice_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async createInvoice(invoiceData: any) {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoiceData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Vendors API
  static async getVendors() {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getVendor(vendorId: string) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('vendor_id', vendorId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createVendor(vendorData: any) {
    const { data, error } = await supabase
      .from('vendors')
      .insert([vendorData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateVendor(vendorId: string, updates: any) {
    const { data, error } = await supabase
      .from('vendors')
      .update(updates)
      .eq('vendor_id', vendorId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
