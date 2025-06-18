import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Project, Client, Task, Timesheet, Invoice, Expense, Vendor } from "@/types/psa";

// Generic function to handle errors
const handleSupabaseError = (error: any, message: string) => {
  if (error) {
    console.error(message, error);
    throw new Error(`${message}: ${error.message}`);
  }
};

// Projects
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, client:clients(*)');
      handleSupabaseError(error, 'Error fetching projects');
      return data as Project[];
    },
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, client:clients(*)')
        .eq('project_id', id)
        .single();
      handleSupabaseError(error, 'Error fetching project');
      return data as Project;
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProject: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
      // Generate project ID using the database function
      const { data: projectIdResult, error: idError } = await supabase
        .rpc('generate_project_id');

      if (idError) {
        console.error('Error generating project ID:', idError);
        throw idError;
      }

      const projectData = {
        project_id: projectIdResult,
        project_name: newProject.name,
        client_id: newProject.client_id,
        status: newProject.status,
        description: newProject.description,
        start_date: newProject.start_date,
        end_date: newProject.end_date,
        budget: newProject.budget,
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) {
        console.error('Project creation error:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Project>) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('project_id', id)
        .select()
        .single();
      handleSupabaseError(error, 'Error updating project');
      return data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('projects')
        .delete()
        .eq('project_id', id);
      handleSupabaseError(error, 'Error deleting project');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// Clients
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*');
      handleSupabaseError(error, 'Error fetching clients');
      return data as Client[];
    },
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('client_id', id)
        .single();
      handleSupabaseError(error, 'Error fetching client');
      return data as Client;
    },
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newClient: Omit<Client, 'client_id' | 'created_at' | 'updated_at'>) => {
      // Generate client ID using the database function
      const { data: clientIdResult, error: idError } = await supabase
        .rpc('generate_client_id');

      if (idError) {
        console.error('Error generating client ID:', idError);
        throw idError;
      }

      const clientData = {
        client_id: clientIdResult,
        client_name: newClient.client_name,
        company_name: newClient.company_name,
        primary_contact_name: newClient.primary_contact_name,
        primary_contact_email: newClient.primary_contact_email,
        client_type: newClient.client_type,
        phone_number: newClient.phone_number,
        industry: newClient.industry,
        revenue_tier: newClient.revenue_tier,
        notes: newClient.notes,
        tags: newClient.tags,
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();

      if (error) {
        console.error('Client creation error:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Client>) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('client_id', id)
        .select()
        .single();
      handleSupabaseError(error, 'Error updating client');
      return data as Client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('clients')
        .delete()
        .eq('client_id', id);
      handleSupabaseError(error, 'Error deleting client');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

// Resources
export const useResources = () => {
  return useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*');
      handleSupabaseError(error, 'Error fetching resources');
      return data as any[];
    },
  });
};

export const useResource = (id: string) => {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('resource_id', id)
        .single();
      handleSupabaseError(error, 'Error fetching resource');
      return data as any;
    },
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newResource: Omit<any, 'resource_id' | 'created_at' | 'updated_at'>) => {
      // Generate resource ID using the database function
      const { data: resourceIdResult, error: idError } = await supabase
        .rpc('generate_resource_id');

      if (idError) {
        console.error('Error generating resource ID:', idError);
        throw idError;
      }

      const resourceData = {
        resource_id: resourceIdResult,
        full_name: newResource.full_name,
        email_address: newResource.email_address,
        phone_number: newResource.phone_number,
        department: newResource.department,
        role: newResource.role,
        skills: newResource.skills,
        active_status: newResource.active_status,
        availability: newResource.availability,
        join_date: newResource.join_date,
        profile_picture: newResource.profile_picture,
        created_by: (await supabase.auth.getUser()).data.user?.id
      };

      const { data, error } = await supabase
        .from('resources')
        .insert(resourceData)
        .select()
        .single();

      if (error) {
        console.error('Resource creation error:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<any>) => {
      const { data, error } = await supabase
        .from('resources')
        .update(updates)
        .eq('resource_id', id)
        .select()
        .single();
      handleSupabaseError(error, 'Error updating resource');
      return data as any;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('resources')
        .delete()
        .eq('resource_id', id);
      handleSupabaseError(error, 'Error deleting resource');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

// Timesheets
export const useTimesheets = () => {
  return useQuery({
    queryKey: ['timesheets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timesheets')
        .select('*, project:projects(*)');
      handleSupabaseError(error, 'Error fetching timesheets');
      return data as Timesheet[];
    },
  });
};

export const useTimesheet = (id: string) => {
  return useQuery({
    queryKey: ['timesheet', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timesheets')
        .select('*, project:projects(*)')
        .eq('timesheet_id', id)
        .single();
      handleSupabaseError(error, 'Error fetching timesheet');
      return data as Timesheet;
    },
  });
};

export const useCreateTimesheet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      project_id: string;
      task: string;
      date: string;
      start_time: string;
      end_time: string;
      billable: boolean;
      notes?: string;
    }) => {
      console.log('Creating timesheet with data:', data);
      
      // Generate timesheet ID using the database function
      const { data: timesheetIdResult, error: idError } = await supabase
        .rpc('generate_timesheet_id');
        
      if (idError) {
        console.error('Error generating timesheet ID:', idError);
        throw idError;
      }
      
      const timesheetData = {
        timesheet_id: timesheetIdResult,
        project_id: data.project_id,
        task: data.task,
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        billable: data.billable,
        notes: data.notes || null,
        created_by: (await supabase.auth.getUser()).data.user?.id
      };
      
      const { data: result, error } = await supabase
        .from('timesheets')
        .insert(timesheetData)
        .select()
        .single();
      
      if (error) {
        console.error('Timesheet creation error:', error);
        throw error;
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });
};

export const useUpdateTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Timesheet>) => {
      const { data, error } = await supabase
        .from('timesheets')
        .update(updates)
        .eq('timesheet_id', id)
        .select()
        .single();
      handleSupabaseError(error, 'Error updating timesheet');
      return data as Timesheet;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });
};

export const useDeleteTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('timesheets')
        .delete()
        .eq('timesheet_id', id);
      handleSupabaseError(error, 'Error deleting timesheet');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });
};

// Invoices
export const useInvoices = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, client:clients(*), project:projects(*)');
      handleSupabaseError(error, 'Error fetching invoices');
      return data as Invoice[];
    },
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, client:clients(*), project:projects(*)')
        .eq('id', id)
        .single();
      handleSupabaseError(error, 'Error fetching invoice');
      return data as Invoice;
    },
  });
};

// Expenses
export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*, project:projects(*)');
      handleSupabaseError(error, 'Error fetching expenses');
      return data as Expense[];
    },
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: ['expense', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*, project:projects(*)')
        .eq('id', id)
        .single();
      handleSupabaseError(error, 'Error fetching expense');
      return data as Expense;
    },
  });
};

// Vendors
export const useVendors = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*');
      handleSupabaseError(error, 'Error fetching vendors');
      return data as Vendor[];
    },
  });
};

export const useVendor = (id: string) => {
  return useQuery({
    queryKey: ['vendor', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('id', id)
        .single();
      handleSupabaseError(error, 'Error fetching vendor');
      return data as Vendor;
    },
  });
};
