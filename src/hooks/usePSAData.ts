
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
        return data || [];
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
        return data || [];
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
        return data || [];
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
        return data || [];
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
        return data || [];
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
          .order('expense_date', { ascending: false });
        
        if (error) throw error;
        return data || [];
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
        return data || [];
      },
    });
  };

  // Opportunities
  const useOpportunities = () => {
    return useQuery({
      queryKey: ['opportunities'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('opportunities')
          .select(`
            *,
            client:clients(*)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      },
    });
  };

  // Purchase Orders
  const usePurchaseOrders = () => {
    return useQuery({
      queryKey: ['purchase_orders'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('purchase_orders')
          .select(`
            *,
            vendor:vendors(*),
            project:projects(*)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      },
    });
  };

  // Mutations
  const createClient = useMutation({
    mutationFn: async (client: any) => {
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
    mutationFn: async (project: any) => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...project, project_manager_id: user.data.user?.id }])
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
    mutationFn: async (timesheet: any) => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('timesheets')
        .insert([{ ...timesheet, user_id: user.data.user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });

  const createInvoice = useMutation({
    mutationFn: async (invoice: any) => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('invoices')
        .insert([{ ...invoice, created_by: user.data.user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const createExpense = useMutation({
    mutationFn: async (expense: any) => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expense, user_id: user.data.user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
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
    useOpportunities,
    usePurchaseOrders,
    createClient,
    createProject,
    createTimesheet,
    createInvoice,
    createExpense,
  };
};
