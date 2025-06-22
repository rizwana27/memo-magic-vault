
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Projects API
export const useProjectsApi = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients!projects_client_id_fkey(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useProjectApi = (projectId: string | null) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:clients!projects_client_id_fkey(*)
        `)
        .eq('project_id', projectId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
};

export const useCreateProjectApi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: any) => {
      console.log('Creating project with data:', projectData);
      
      // Check for duplicates if importing from external source
      if (projectData.external_source && projectData.external_id) {
        const { data: existingProject } = await supabase
          .from('projects')
          .select('project_id')
          .eq('external_source', projectData.external_source)
          .eq('external_id', projectData.external_id)
          .single();
          
        if (existingProject) {
          throw new Error(`Project already imported from ${projectData.external_source}`);
        }
      }
      
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
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

export const useUpdateProjectApi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ projectId, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('project_id', projectId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// Clients API
export const useClientsApi = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useClientApi = (clientId: string | null) => {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      if (!clientId) return null;
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('client_id', clientId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });
};

export const useCreateClientApi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (clientData: any) => {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateClientApi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ clientId, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('client_id', clientId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

// Resources API
export const useResourcesApi = () => {
  return useQuery({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useResourceApi = (resourceId: string | null) => {
  return useQuery({
    queryKey: ['resource', resourceId],
    queryFn: async () => {
      if (!resourceId) return null;
      
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('resource_id', resourceId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!resourceId,
  });
};

export const useCreateResourceApi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (resourceData: any) => {
      const { data, error } = await supabase
        .from('resources')
        .insert([resourceData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

export const useUpdateResourceApi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ resourceId, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('resources')
        .update(updateData)
        .eq('resource_id', resourceId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

// Timesheets API
export const useTimesheetsApi = () => {
  return useQuery({
    queryKey: ['timesheets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timesheets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Invoices API
export const useInvoicesApi = () => {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// Vendors API
export const useVendorsApi = () => {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useVendorApi = (vendorId: string | null) => {
  return useQuery({
    queryKey: ['vendor', vendorId],
    queryFn: async () => {
      if (!vendorId) return null;
      
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('vendor_id', vendorId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!vendorId,
  });
};

export const useCreateVendorApi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vendorData: any) => {
      const { data, error } = await supabase
        .from('vendors')
        .insert([vendorData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
};

export const useUpdateVendorApi = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ vendorId, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('vendors')
        .update(updateData)
        .eq('vendor_id', vendorId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
};

// KPI and Analytics APIs
export const useKPIResourceUtilizationApi = () => {
  return useQuery({
    queryKey: ['kpi-resource-utilization'],
    queryFn: async () => {
      // Mock data for now - replace with actual API call
      return {
        utilizationPercentage: 78,
        totalBillableHours: 1240,
        totalAvailableHours: 1600
      };
    },
  });
};

export const useKPIResourceAllocationApi = () => {
  return useQuery({
    queryKey: ['kpi-resource-allocation'],
    queryFn: async () => {
      // Mock data for now - replace with actual API call
      return {
        allocationPercentage: 85,
        allocatedResources: 12,
        unallocatedResources: 3,
        totalResources: 15,
        departmentBreakdown: {
          'Engineering': { total: 8, allocated: 7 },
          'Design': { total: 4, allocated: 3 },
          'Marketing': { total: 3, allocated: 2 }
        }
      };
    },
  });
};

export const useResourceUtilizationApi = () => {
  return useQuery({
    queryKey: ['resource-utilization'],
    queryFn: async () => {
      // Mock data for now - replace with actual API call
      return [
        {
          resourceId: '1',
          name: 'John Doe',
          department: 'Engineering',
          utilizationPercentage: 95,
          billableHours: 152,
          totalHours: 160,
          expectedHours: 160,
          isOverUtilized: true,
          isUnderUtilized: false
        },
        {
          resourceId: '2',
          name: 'Jane Smith',
          department: 'Design',
          utilizationPercentage: 65,
          billableHours: 104,
          totalHours: 160,
          expectedHours: 160,
          isOverUtilized: false,
          isUnderUtilized: true
        }
      ];
    },
  });
};
