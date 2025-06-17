
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Client, Project, Task, Timesheet, Invoice, Expense, Vendor } from '@/types/psa';

export const usePSAData = () => {
  const queryClient = useQueryClient();

  // Clients
  const useClients = () => {
    return useQuery({
      queryKey: ['clients'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Client[];
      },
    });
  };

  // Projects
  const useProjects = () => {
    return useQuery({
      queryKey: ['projects'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            client:clients(*)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Project[];
      },
    });
  };

  // Tasks
  const useTasks = () => {
    return useQuery({
      queryKey: ['tasks'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            project:projects(*, client:clients(*))
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Task[];
      },
    });
  };

  // Timesheets
  const useTimesheets = () => {
    return useQuery({
      queryKey: ['timesheets'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('timesheets')
          .select(`
            *,
            project:projects(*),
            task:tasks(*)
          `)
          .order('date', { ascending: false });
        
        if (error) throw error;
        return data as Timesheet[];
      },
    });
  };

  // Invoices
  const useInvoices = () => {
    return useQuery({
      queryKey: ['invoices'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('invoices')
          .select(`
            *,
            client:clients(*),
            project:projects(*)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Invoice[];
      },
    });
  };

  // Expenses
  const useExpenses = () => {
    return useQuery({
      queryKey: ['expenses'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('expenses')
          .select(`
            *,
            project:projects(*)
          `)
          .order('date', { ascending: false });
        
        if (error) throw error;
        return data as Expense[];
      },
    });
  };

  // Vendors
  const useVendors = () => {
    return useQuery({
      queryKey: ['vendors'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Vendor[];
      },
    });
  };

  // Mutations
  const createClient = useMutation({
    mutationFn: async (client: Partial<Client>) => {
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const createProject = useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const createTimesheet = useMutation({
    mutationFn: async (timesheet: Partial<Timesheet>) => {
      const { data, error } = await supabase
        .from('timesheets')
        .insert([{ ...timesheet, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });

  return {
    useClients,
    useProjects,
    useTasks,
    useTimesheets,
    useInvoices,
    useExpenses,
    useVendors,
    createClient,
    createProject,
    createTimesheet,
  };
};
