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
      console.log('Creating timesheet:', timesheetData);
      
      const { data, error } = await supabase
        .from('timesheets')
        .insert([timesheetData])
        .select()
        .single();

      if (error) {
        console.error('Error creating timesheet:', error);
        throw error;
      }

      // Create a notification
      await supabase.rpc('create_notification', {
        p_message: `New timesheet entry created for ${timesheetData.hours} hours`,
        p_type: 'timesheet',
        p_related_id: data.timesheet_id
      });

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
    onError: (error) => {
      console.error('Failed to create timesheet:', error);
      toast({
        title: "Error",
        description: "Failed to create timesheet entry",
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
      console.log('Creating invoice:', invoiceData);
      
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
      await supabase.rpc('create_notification', {
        p_message: `New invoice ${data.invoice_number} created for $${invoiceData.total_amount}`,
        p_type: 'invoice',
        p_related_id: data.id
      });

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
    onError: (error) => {
      console.error('Failed to create invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
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
      console.log('Creating vendor:', vendorData);
      
      const { data, error } = await supabase
        .from('vendors')
        .insert([vendorData])
        .select()
        .single();

      if (error) {
        console.error('Error creating vendor:', error);
        throw error;
      }

      // Create a notification
      await supabase.rpc('create_notification', {
        p_message: `New vendor "${vendorData.vendor_name}" was added`,
        p_type: 'resource',
        p_related_id: data.vendor_id
      });

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
      toast({
        title: "Error",
        description: "Failed to add vendor",
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
      console.log('Creating purchase order:', poData);
      
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
      await supabase.rpc('create_notification', {
        p_message: `New purchase order ${data.po_number} created`,
        p_type: 'resource',
        p_related_id: data.id
      });

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
    onError: (error) => {
      console.error('Failed to create purchase order:', error);
      toast({
        title: "Error",
        description: "Failed to create purchase order",
        variant: "destructive",
      });
    },
  });
};
