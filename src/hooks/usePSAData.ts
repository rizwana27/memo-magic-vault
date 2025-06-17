
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePSAData = () => {
  const queryClient = useQueryClient();

  // Mock data for demonstration since we only have profiles table
  const mockClients = [
    {
      id: '1',
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1-555-0123',
      website: 'https://acme.com',
      address: '123 Business St, City, State 12345',
      health_score: 8,
      created_at: new Date().toISOString()
    },
    {
      id: '2', 
      name: 'Tech Solutions Inc',
      email: 'info@techsolutions.com',
      phone: '+1-555-0456',
      website: 'https://techsolutions.com',
      address: '456 Innovation Ave, Tech City, TC 67890',
      health_score: 6,
      created_at: new Date().toISOString()
    }
  ];

  const mockProjects = [
    {
      id: '1',
      name: 'Website Redesign',
      status: 'active',
      description: 'Complete redesign of company website',
      start_date: '2024-01-15',
      budget: 50000,
      client: mockClients[0],
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Mobile App Development', 
      status: 'planning',
      description: 'Native mobile app for iOS and Android',
      start_date: '2024-02-01',
      budget: 120000,
      client: mockClients[1],
      created_at: new Date().toISOString()
    }
  ];

  const mockTimesheets = [
    {
      id: '1',
      user_id: '1',
      date: '2024-01-15',
      hours: 8,
      status: 'approved',
      description: 'Frontend development work',
      project: mockProjects[0],
      task: { id: '1', title: 'UI Development' },
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      user_id: '1', 
      date: '2024-01-16',
      hours: 6,
      status: 'submitted',
      description: 'API integration',
      project: mockProjects[1],
      task: { id: '2', title: 'Backend Work' },
      created_at: new Date().toISOString()
    }
  ];

  const mockInvoices = [
    {
      id: '1',
      invoice_number: 'INV-001',
      amount: 5000,
      status: 'paid',
      client: mockClients[0],
      project: mockProjects[0],
      created_at: new Date().toISOString()
    }
  ];

  const mockExpenses = [
    {
      id: '1',
      amount: 500,
      description: 'Software licenses',
      expense_date: '2024-01-15',
      project: mockProjects[0],
      created_at: new Date().toISOString()
    }
  ];

  // Clients
  const useClients = () => {
    return useQuery({
      queryKey: ['clients'],
      queryFn: async () => {
        // For now, return mock data since we don't have a clients table
        return mockClients;
      },
    });
  };

  // Projects
  const useProjects = () => {
    return useQuery({
      queryKey: ['projects'],
      queryFn: async () => {
        return mockProjects;
      },
    });
  };

  // Tasks
  const useTasks = () => {
    return useQuery({
      queryKey: ['tasks'],
      queryFn: async () => {
        return [];
      },
    });
  };

  // Timesheets
  const useTimesheets = () => {
    return useQuery({
      queryKey: ['timesheets'],
      queryFn: async () => {
        return mockTimesheets;
      },
    });
  };

  // Invoices
  const useInvoices = () => {
    return useQuery({
      queryKey: ['invoices'],
      queryFn: async () => {
        return mockInvoices;
      },
    });
  };

  // Expenses
  const useExpenses = () => {
    return useQuery({
      queryKey: ['expenses'],
      queryFn: async () => {
        return mockExpenses;
      },
    });
  };

  // Vendors
  const useVendors = () => {
    return useQuery({
      queryKey: ['vendors'],
      queryFn: async () => {
        return [];
      },
    });
  };

  // Opportunities
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
        return [];
      },
    });
  };

  // Mutations - These will work with the profiles table for now
  const createClient = useMutation({
    mutationFn: async (client: any) => {
      // For now, just return the client data
      return { ...client, id: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const createProject = useMutation({
    mutationFn: async (project: any) => {
      return { ...project, id: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const createTimesheet = useMutation({
    mutationFn: async (timesheet: any) => {
      return { ...timesheet, id: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });

  const createInvoice = useMutation({
    mutationFn: async (invoice: any) => {
      return { ...invoice, id: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const createExpense = useMutation({
    mutationFn: async (expense: any) => {
      return { ...expense, id: Date.now().toString() };
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
