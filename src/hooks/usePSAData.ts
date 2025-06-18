
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
          .select('*');
        
        if (error) throw error;
        return data;
      },
    });
  };

  // Resources (from profiles table)
  const useResources = () => {
    return useQuery({
      queryKey: ['resources'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone, department, role, is_active, created_at');
        
        if (error) throw error;
        
        // Transform to match expected format
        return data?.map((profile: any) => ({
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          department: profile.department,
          role: profile.role,
          status: profile.is_active,
          join_date: profile.created_at,
          created_at: profile.created_at,
        })) || [];
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
            client:clients(*),
            project_manager:profiles(*)
          `);
        
        if (error) throw error;
        return data;
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
            project:projects(name),
            assigned_user:profiles(full_name)
          `);
        
        if (error) throw error;
        return data;
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
            project:projects(name),
            task:tasks(title)
          `);
        
        if (error) throw error;
        return data;
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
          `);
        
        if (error) throw error;
        return data;
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
            project:projects(name)
          `);
        
        if (error) throw error;
        return data;
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
          .select('*');
        
        if (error) throw error;
        return data;
      },
    });
  };

  // Opportunities (placeholder for future implementation)
  const useOpportunities = () => {
    return useQuery({
      queryKey: ['opportunities'],
      queryFn: async () => {
        return [];
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
            vendor:vendors(name)
          `);
        
        if (error) throw error;
        return data;
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
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
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
      const { data, error } = await supabase
        .from('timesheets')
        .insert([timesheet])
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
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoice])
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
      const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
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
    useResources,
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
