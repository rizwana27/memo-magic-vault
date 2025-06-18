
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePSAData = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Clients
  const useClients = () => {
    return useQuery({
      queryKey: ['clients'],
      queryFn: async () => {
        console.log('Fetching clients from database...');
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

  // Resources
  const useResources = () => {
    return useQuery({
      queryKey: ['resources'],
      queryFn: async () => {
        console.log('Fetching resources from database...');
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

  // Projects
  const useProjects = () => {
    return useQuery({
      queryKey: ['projects'],
      queryFn: async () => {
        console.log('Fetching projects from database...');
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            client:clients(client_name, company_name)
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

  // Timesheets
  const useTimesheets = () => {
    return useQuery({
      queryKey: ['timesheets'],
      queryFn: async () => {
        console.log('Fetching timesheets from database...');
        const { data, error } = await supabase
          .from('timesheets')
          .select(`
            *,
            project:projects(project_name, client_id)
          `)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching timesheets:', error);
          throw error;
        }
        
        console.log('Timesheets fetched:', data);
        return data || [];
      },
    });
  };

  // Vendors
  const useVendors = () => {
    return useQuery({
      queryKey: ['vendors'],
      queryFn: async () => {
        console.log('Fetching vendors from database...');
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

  // Tasks (placeholder for now)
  const useTasks = () => {
    return useQuery({
      queryKey: ['tasks'],
      queryFn: async () => {
        return [];
      },
    });
  };

  // Invoices (placeholder for now)
  const useInvoices = () => {
    return useQuery({
      queryKey: ['invoices'],
      queryFn: async () => {
        return [];
      },
    });
  };

  // Expenses (placeholder for now)
  const useExpenses = () => {
    return useQuery({
      queryKey: ['expenses'],
      queryFn: async () => {
        return [];
      },
    });
  };

  // Opportunities (placeholder for now)
  const useOpportunities = () => {
    return useQuery({
      queryKey: ['opportunities'],
      queryFn: async () => {
        return [];
      },
    });
  };

  // Purchase Orders (placeholder for now)
  const usePurchaseOrders = () => {
    return useQuery({
      queryKey: ['purchase_orders'],
      queryFn: async () => {
        return [];
      },
    });
  };

  // Create Client Mutation
  const createClient = useMutation({
    mutationFn: async (clientData: any) => {
      console.log('Creating client:', clientData);
      
      const insertData = {
        client_name: clientData.clientName,
        company_name: clientData.companyName,
        industry: clientData.industry,
        client_type: clientData.clientType,
        primary_contact_name: clientData.primaryContactName,
        primary_contact_email: clientData.primaryContactEmail,
        phone_number: clientData.phoneNumber,
        revenue_tier: clientData.revenueTier,
        tags: clientData.tags,
        notes: clientData.notes,
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating client:', error);
        throw error;
      }

      console.log('Client created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Success!",
        description: "Client created successfully.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error('Failed to create client:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create client. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create Project Mutation
  const createProject = useMutation({
    mutationFn: async (projectData: any) => {
      console.log('Creating project:', projectData);
      
      // Validate client exists before creating project
      const { data: clientExists } = await supabase
        .from('clients')
        .select('client_id')
        .eq('client_id', projectData.client)
        .single();

      if (!clientExists) {
        throw new Error('Selected client does not exist. Please refresh the page and try again.');
      }

      const insertData = {
        project_name: projectData.name,
        client_id: projectData.client,
        project_manager: projectData.projectManager,
        region: projectData.region,
        status: projectData.status,
        delivery_status: projectData.deliveryStatus,
        start_date: projectData.startDate,
        end_date: projectData.endDate,
        budget: projectData.budget ? parseFloat(projectData.budget) : null,
        description: projectData.description,
        tags: projectData.tags,
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        if (error.code === '23503') {
          throw new Error('Foreign key constraint failed. The selected client may not exist.');
        }
        throw error;
      }

      console.log('Project created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Success!",
        description: "Project created successfully.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error('Failed to create project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create Resource Mutation
  const createResource = useMutation({
    mutationFn: async (resourceData: any) => {
      console.log('Creating resource:', resourceData);
      
      const insertData = {
        full_name: resourceData.fullName,
        email_address: resourceData.email,
        phone_number: resourceData.phone,
        department: resourceData.department,
        role: resourceData.role,
        join_date: resourceData.joinDate,
        skills: resourceData.skills,
        availability: resourceData.availability?.[0] || 100,
        active_status: resourceData.status,
      };

      const { data, error } = await supabase
        .from('resources')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating resource:', error);
        throw error;
      }

      console.log('Resource created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: "Success!",
        description: "Resource created successfully.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error('Failed to create resource:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create resource. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create Timesheet Mutation
  const createTimesheet = useMutation({
    mutationFn: async (timesheetData: any) => {
      console.log('Creating timesheet:', timesheetData);
      
      const insertData = {
        project_id: timesheetData.project,
        task: timesheetData.task,
        date: timesheetData.date,
        start_time: timesheetData.startTime,
        end_time: timesheetData.endTime,
        billable: timesheetData.billable,
        notes: timesheetData.notes,
      };

      const { data, error } = await supabase
        .from('timesheets')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating timesheet:', error);
        throw error;
      }

      console.log('Timesheet created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      toast({
        title: "Success!",
        description: "Time entry logged successfully.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error('Failed to create timesheet:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to log time entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create Vendor Mutation
  const createVendor = useMutation({
    mutationFn: async (vendorData: any) => {
      console.log('Creating vendor:', vendorData);
      
      const insertData = {
        vendor_name: vendorData.vendorName,
        contact_person: vendorData.contactPerson,
        contact_email: vendorData.contactEmail,
        phone_number: vendorData.phoneNumber,
        services_offered: vendorData.servicesOffered,
        status: vendorData.status,
        contract_start_date: vendorData.contractStart,
        contract_end_date: vendorData.contractEnd,
        notes: vendorData.notes,
      };

      const { data, error } = await supabase
        .from('vendors')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error creating vendor:', error);
        throw error;
      }

      console.log('Vendor created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: "Success!",
        description: "Vendor created successfully.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error('Failed to create vendor:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create vendor. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Placeholder mutations for other entities
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
    createResource,
    createTimesheet,
    createVendor,
    createInvoice,
    createExpense,
  };
};
