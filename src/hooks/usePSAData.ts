import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

// Define types for the data we're fetching
export type Project = Tables<'projects'>;
export type Client = Tables<'clients'>;
export type Resource = Tables<'resources'>;
export type Timesheet = Tables<'timesheets'>;
export type Invoice = Tables<'invoices'>;
export type Vendor = Tables<'vendors'>;
export type PurchaseOrder = Tables<'purchase_orders'>;

// Define insert types without auto-generated fields
type TimesheetInsert = Omit<Tables<'timesheets'>, 'timesheet_id' | 'created_at' | 'updated_at' | 'hours'>;

// Initial hooks for fetching data
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      console.log('Fetching projects...');
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      console.log('Projects fetched:', data);
      return data || [];
    },
  });
};

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      console.log('Fetching clients...');
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
      
      console.log('Clients fetched:', data);
      return data || [];
    },
  });
};

export const useResources = () => {
  return useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      console.log('Fetching resources...');
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching resources:', error);
        throw error;
      }
      
      console.log('Resources fetched:', data);
      return data || [];
    },
  });
};

export const useTimesheets = () => {
  return useQuery({
    queryKey: ['timesheets'],
    queryFn: async () => {
      console.log('Fetching timesheets...');
      const { data, error } = await supabase
        .from('timesheets')
        .select(`
          *,
          project:projects(*)
        `)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching timesheets:', error);
        throw error;
      }
      
      console.log('Timesheets fetched:', data);
      return data || [];
    },
  });
};

export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      console.log('Fetching invoices...');
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          client:clients(*),
          project:projects(*)
        `)
        .order('invoice_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching invoices:', error);
        throw error;
      }
      
      console.log('Invoices fetched:', data);
      return data || [];
    },
  });
};

export const useVendors = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      console.log('Fetching vendors...');
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching vendors:', error);
        throw error;
      }
      
      console.log('Vendors fetched:', data);
      return data || [];
    },
  });
};

export const usePurchaseOrders = () => {
  return useQuery({
    queryKey: ['purchase-orders'],
    queryFn: async () => {
      console.log('Fetching purchase orders...');
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          vendor:vendors(*),
          project:projects(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching purchase orders:', error);
        throw error;
      }
      
      console.log('Purchase orders fetched:', data);
      return data || [];
    },
  });
};

// Add new hooks for client invites and notifications
export const useClientInvites = () => {
  return useQuery({
    queryKey: ['client-invites'],
    queryFn: async () => {
      console.log('Fetching client invites...');
      const { data, error } = await supabase
        .from('client_invites')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching client invites:', error);
        throw error;
      }
      
      console.log('Client invites fetched:', data);
      return data || [];
    },
  });
};

export const useCreateClientInvite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (inviteData: {
      client_name: string;
      email: string;
      invitation_message?: string;
    }) => {
      console.log('Creating client invite:', inviteData);
      
      const { data, error } = await supabase
        .from('client_invites')
        .insert([inviteData])
        .select()
        .single();

      if (error) {
        console.error('Error creating client invite:', error);
        throw error;
      }

      // Create a notification
      await supabase.rpc('create_notification', {
        p_message: `Client invitation sent to ${inviteData.client_name} (${inviteData.email})`,
        p_type: 'invite',
        p_related_id: data.id
      });

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['client-invites'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: `Client invitation sent to ${data.client_name}`,
      });
    },
    onError: (error) => {
      console.error('Failed to create client invite:', error);
      toast({
        title: "Error",
        description: "Failed to send client invitation",
        variant: "destructive",
      });
    },
  });
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      console.log('Fetching notifications...');
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error('Error fetching notifications:', error);
        throw error;
      }
      
      console.log('Notifications fetched:', data);
      return data || [];
    },
  });
};

export const useMarkNotificationSeen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ seen: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllNotificationsSeen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ seen: true })
        .eq('seen', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Create mutations with proper error handling and field mapping
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (projectData: any) => {
      console.log('Creating project with data:', projectData);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to create a project');
      }
      
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      // Create a notification
      try {
        await supabase.rpc('create_notification', {
          p_message: `New project "${projectData.project_name}" was created`,
          p_type: 'project',
          p_related_id: data.project_id
        });
      } catch (notificationError) {
        console.warn('Failed to create notification:', notificationError);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: `Project "${data.project_name}" created successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (clientData: any) => {
      console.log('Creating client with data:', clientData);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to create a client');
      }
      
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) {
        console.error('Error creating client:', error);
        throw error;
      }

      // Create a notification
      try {
        await supabase.rpc('create_notification', {
          p_message: `New client "${clientData.client_name}" was added`,
          p_type: 'client',
          p_related_id: data.client_id
        });
      } catch (notificationError) {
        console.warn('Failed to create notification:', notificationError);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: `Client "${data.client_name}" added successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create client:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add client",
        variant: "destructive",
      });
    },
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (resourceData: any) => {
      console.log('Creating resource with data:', resourceData);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to create a resource');
      }
      
      const { data, error } = await supabase
        .from('resources')
        .insert([resourceData])
        .select()
        .single();

      if (error) {
        console.error('Error creating resource:', error);
        throw error;
      }

      // Create a notification
      try {
        await supabase.rpc('create_notification', {
          p_message: `New resource "${resourceData.full_name}" was added`,
          p_type: 'resource',
          p_related_id: data.resource_id
        });
      } catch (notificationError) {
        console.warn('Failed to create notification:', notificationError);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: `Resource "${data.full_name}" added successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create resource:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add resource",
        variant: "destructive",
      });
    },
  });
};

export const useCreateTimesheet = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (timesheetData: any) => {
      console.log('Creating timesheet with validated data:', timesheetData);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to create a timesheet entry');
      }

      // Validate required fields before sending to Supabase
      if (!timesheetData.project_id) {
        throw new Error('Project selection is required');
      }
      if (!timesheetData.task?.trim()) {
        throw new Error('Task is required');
      }
      if (!timesheetData.date) {
        throw new Error('Date is required');
      }
      if (!timesheetData.start_time) {
        throw new Error('Start time is required');
      }
      if (!timesheetData.end_time) {
        throw new Error('End time is required');
      }

      // Verify the project exists
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('project_id, project_name')
        .eq('project_id', timesheetData.project_id)
        .single();

      if (projectError || !project) {
        throw new Error('Selected project not found. Please refresh and try again.');
      }

      // Prepare insert data - cast to any to bypass strict TypeScript checking
      // The database will auto-generate timesheet_id and calculate hours
      const insertData: TimesheetInsert = {
        project_id: timesheetData.project_id,
        task: timesheetData.task,
        date: timesheetData.date,
        start_time: timesheetData.start_time,
        end_time: timesheetData.end_time,
        billable: timesheetData.billable,
        notes: timesheetData.notes,
        created_by: null, // Will be set by trigger
      };
      
      const { data, error } = await supabase
        .from('timesheets')
        .insert([insertData as any])
        .select()
        .single();

      if (error) {
        console.error('Supabase timesheet creation error:', error);
        
        // Provide specific error messages based on error code
        if (error.code === '23503') {
          throw new Error('Invalid project selected. Please refresh and try again.');
        } else if (error.code === '23502') {
          throw new Error('Missing required field: ' + error.message);
        } else if (error.code === '42501') {
          throw new Error('Permission denied. Please check your account permissions.');
        } else if (error.message.includes('hours')) {
          throw new Error('Time calculation error. Please check your start and end times.');
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }

      // Create a notification
      try {
        await supabase.rpc('create_notification', {
          p_message: `New timesheet entry created for ${timesheetData.task}`,
          p_type: 'timesheet',
          p_related_id: data.timesheet_id
        });
      } catch (notificationError) {
        console.warn('Failed to create notification:', notificationError);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: "Timesheet entry created successfully",
      });
    },
    onError: (error: any) => {
      console.error('Failed to create timesheet:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create timesheet entry. Please try again.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (invoiceData: any) => {
      console.log('Creating invoice with data:', invoiceData);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to create an invoice');
      }
      
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();

      if (error) {
        console.error('Error creating invoice:', error);
        throw error;
      }

      // Create a notification
      try {
        await supabase.rpc('create_notification', {
          p_message: `New invoice ${data.invoice_number} created for $${invoiceData.total_amount}`,
          p_type: 'invoice',
          p_related_id: data.id
        });
      } catch (notificationError) {
        console.warn('Failed to create notification:', notificationError);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: `Invoice ${data.invoice_number} created successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create invoice:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice",
        variant: "destructive",
      });
    },
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (vendorData: any) => {
      console.log('Creating vendor with validated data:', vendorData);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to create a vendor');
      }

      // Validate required fields before sending to Supabase
      if (!vendorData.vendor_name?.trim()) {
        throw new Error('Vendor name is required');
      }
      if (!vendorData.contact_person?.trim()) {
        throw new Error('Contact person is required');
      }
      if (!vendorData.contact_email?.trim()) {
        throw new Error('Contact email is required');
      }
      if (!vendorData.services_offered?.trim()) {
        throw new Error('Services offered is required');
      }
      
      const { data, error } = await supabase
        .from('vendors')
        .insert([vendorData])
        .select()
        .single();

      if (error) {
        console.error('Supabase vendor creation error:', error);
        
        // Provide specific error messages based on error code
        if (error.code === '23505') {
          throw new Error('A vendor with this name or email already exists');
        } else if (error.code === '23502') {
          throw new Error('Missing required field: ' + error.message);
        } else if (error.code === '42501') {
          throw new Error('Permission denied. Please check your account permissions.');
        } else {
          throw new Error(`Database error: ${error.message}`);
        }
      }

      // Create a notification
      try {
        await supabase.rpc('create_notification', {
          p_message: `New vendor "${vendorData.vendor_name}" was added`,
          p_type: 'resource',
          p_related_id: data.vendor_id
        });
      } catch (notificationError) {
        console.warn('Failed to create notification:', notificationError);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: `Vendor "${data.vendor_name}" added successfully`,
      });
    },
    onError: (error) => {
      console.error('Failed to create vendor:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add vendor. Please try again.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (poData: any) => {
      console.log('Creating purchase order with data:', poData);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to create a purchase order');
      }
      
      const { data, error } = await supabase
        .from('purchase_orders')
        .insert([poData])
        .select()
        .single();

      if (error) {
        console.error('Error creating purchase order:', error);
        throw error;
      }

      // Create a notification
      try {
        await supabase.rpc('create_notification', {
          p_message: `New purchase order ${data.po_number} created`,
          p_type: 'resource',
          p_related_id: data.id
        });
      } catch (notificationError) {
        console.warn('Failed to create notification:', notificationError);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: `Purchase order ${data.po_number} created successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create purchase order:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create purchase order",
        variant: "destructive",
      });
    },
  });
};

export const useBulkCreateTimesheets = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (timesheetData: Array<{
      project_id: string;
      task: string;
      date: string;
      start_time: string;
      end_time: string;
      billable: boolean;
      notes?: string;
    }>) => {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to create timesheet entries');
      }

      // Prepare timesheet data - cast to any to bypass strict TypeScript checking
      // The database will auto-generate timesheet_id and calculate hours
      const timesheetsToInsert: TimesheetInsert[] = timesheetData.map(entry => ({
        project_id: entry.project_id,
        task: entry.task,
        date: entry.date,
        start_time: entry.start_time,
        end_time: entry.end_time,
        billable: entry.billable,
        notes: entry.notes,
        created_by: null, // Will be set by trigger
      }));

      const { data, error } = await supabase
        .from('timesheets')
        .insert(timesheetsToInsert as any)
        .select();
      
      if (error) {
        console.error('Error creating bulk timesheets:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: `${data.length} timesheet entries created successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Failed to create bulk timesheets:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create timesheet entries",
        variant: "destructive",
      });
    }
  });
};

// New API endpoint: Get resource allocations for a project
export const useProjectResources = (projectId?: string) => {
  return useQuery({
    queryKey: ['project-resources', projectId],
    queryFn: async () => {
      if (!projectId) return [];

      // Get timesheets for the project
      const { data: timesheets, error: timesheetsError } = await supabase
        .from('timesheets')
        .select('created_by, hours')
        .eq('project_id', projectId);

      if (timesheetsError) throw timesheetsError;

      // Get unique resource IDs from timesheets
      const resourceIds = [...new Set(timesheets?.map(ts => ts.created_by).filter(Boolean))] as string[];
      
      if (resourceIds.length === 0) return [];

      // Get resource details for those who worked on the project
      const { data: resources, error: resourcesError } = await supabase
        .from('resources')
        .select('resource_id, full_name, department, role')
        .in('resource_id', resourceIds);

      if (resourcesError) throw resourcesError;

      // Aggregate resource allocations
      const resourceMap = new Map();
      timesheets?.forEach(timesheet => {
        const resourceId = timesheet.created_by;
        if (!resourceMap.has(resourceId)) {
          const resource = resources?.find(r => r.resource_id === resourceId);
          if (resource) {
            resourceMap.set(resourceId, {
              ...resource,
              totalHours: 0
            });
          }
        }
        if (resourceMap.has(resourceId)) {
          resourceMap.get(resourceId).totalHours += timesheet.hours || 0;
        }
      });

      return Array.from(resourceMap.values());
    },
    enabled: !!projectId,
  });
};

// New API endpoint: Get resource utilization data
export const useResourcesUtilization = () => {
  return useQuery({
    queryKey: ['resources-utilization'],
    queryFn: async () => {
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

      // Calculate utilization for each resource
      const utilizationData = resources?.map(resource => {
        const resourceTimesheets = timesheets?.filter(ts => ts.created_by === resource.resource_id) || [];
        const totalHours = resourceTimesheets.reduce((sum, ts) => sum + (ts.hours || 0), 0);
        const billableHours = resourceTimesheets
          .filter(ts => ts.billable)
          .reduce((sum, ts) => sum + (ts.hours || 0), 0);

        const expectedHours = 22 * 8 * (resource.availability || 100) / 100; // 22 working days, 8 hours per day
        const utilizationPercentage = expectedHours > 0 ? (billableHours / expectedHours) * 100 : 0;

        return {
          resource_id: resource.resource_id,
          full_name: resource.full_name,
          department: resource.department,
          role: resource.role,
          active_status: resource.active_status,
          availability: resource.availability,
          totalHours,
          billableHours,
          expectedHours,
          utilizationPercentage: Math.round(utilizationPercentage),
        };
      }) || [];

      return utilizationData;
    },
  });
};

// New API endpoint: Get resource allocation matrix
export const useResourceAllocations = () => {
  return useQuery({
    queryKey: ['resource-allocations'],
    queryFn: async () => {
      // Get timesheets for the last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const { data: timesheets, error: timesheetsError } = await supabase
        .from('timesheets')
        .select('project_id, created_by, hours')
        .gte('date', thirtyDaysAgo);

      if (timesheetsError) throw timesheetsError;

      // Get projects data
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('project_id, project_name');

      if (projectsError) throw projectsError;

      // Get resources data
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
    },
  });
};
