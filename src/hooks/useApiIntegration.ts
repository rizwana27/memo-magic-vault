
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { PSAApiService } from '@/services/apiService';

// Enhanced hooks that integrate with the API service
export const useProjectsApi = () => {
  return useQuery({
    queryKey: ['projects-api'],
    queryFn: PSAApiService.getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateProjectApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: PSAApiService.createProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects-api'] });
      queryClient.invalidateQueries({ queryKey: ['kpi-resource-utilization'] });
      toast({
        title: "Success",
        description: `Project "${data.project_name}" created successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });
};

export const useResourcesApi = () => {
  return useQuery({
    queryKey: ['resources-api'],
    queryFn: PSAApiService.getResources,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateResourceApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: PSAApiService.createResource,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resources-api'] });
      queryClient.invalidateQueries({ queryKey: ['kpi-resource-allocation'] });
      toast({
        title: "Success",
        description: `Resource "${data.full_name}" added successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add resource",
        variant: "destructive",
      });
    },
  });
};

export const useResourceUtilizationApi = () => {
  return useQuery({
    queryKey: ['resource-utilization-api'],
    queryFn: PSAApiService.getResourceUtilization,
    staleTime: 2 * 60 * 1000, // 2 minutes for more frequent updates
  });
};

export const useResourceAllocationsApi = () => {
  return useQuery({
    queryKey: ['resource-allocations-api'],
    queryFn: PSAApiService.getResourceAllocations,
    staleTime: 2 * 60 * 1000,
  });
};

export const useTimesheetsApi = () => {
  return useQuery({
    queryKey: ['timesheets-api'],
    queryFn: PSAApiService.getTimesheets,
    staleTime: 1 * 60 * 1000, // 1 minute for real-time feeling
  });
};

export const useCreateTimesheetApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: PSAApiService.createTimesheet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets-api'] });
      queryClient.invalidateQueries({ queryKey: ['resource-utilization-api'] });
      queryClient.invalidateQueries({ queryKey: ['kpi-resource-utilization'] });
      toast({
        title: "Success",
        description: "Timesheet entry created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create timesheet entry",
        variant: "destructive",
      });
    },
  });
};

export const useBulkCreateTimesheetsApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: PSAApiService.bulkCreateTimesheets,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['timesheets-api'] });
      queryClient.invalidateQueries({ queryKey: ['resource-utilization-api'] });
      toast({
        title: "Success",
        description: `${data.length} timesheet entries created successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create timesheet entries",
        variant: "destructive",
      });
    },
  });
};

// KPI API hooks
export const useKPIResourceUtilizationApi = () => {
  return useQuery({
    queryKey: ['kpi-resource-utilization-api'],
    queryFn: PSAApiService.getKPIResourceUtilization,
    staleTime: 5 * 60 * 1000,
  });
};

export const useKPIResourceAllocationApi = () => {
  return useQuery({
    queryKey: ['kpi-resource-allocation-api'],
    queryFn: PSAApiService.getKPIResourceAllocation,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProjectResourcesApi = (projectId: string) => {
  return useQuery({
    queryKey: ['project-resources-api', projectId],
    queryFn: () => PSAApiService.getProjectResources(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
  });
};

// Client API hooks
export const useClientsApi = () => {
  return useQuery({
    queryKey: ['clients-api'],
    queryFn: PSAApiService.getClients,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateClientApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: PSAApiService.createClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients-api'] });
      toast({
        title: "Success",
        description: `Client "${data.client_name}" added successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add client",
        variant: "destructive",
      });
    },
  });
};

// Invoice API hooks
export const useInvoicesApi = () => {
  return useQuery({
    queryKey: ['invoices-api'],
    queryFn: PSAApiService.getInvoices,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateInvoiceApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: PSAApiService.createInvoice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices-api'] });
      toast({
        title: "Success",
        description: `Invoice ${data.invoice_number} created successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice",
        variant: "destructive",
      });
    },
  });
};

// Vendor API hooks
export const useVendorsApi = () => {
  return useQuery({
    queryKey: ['vendors-api'],
    queryFn: PSAApiService.getVendors,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateVendorApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: PSAApiService.createVendor,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vendors-api'] });
      toast({
        title: "Success",
        description: `Vendor "${data.vendor_name}" added successfully`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add vendor",
        variant: "destructive",
      });
    },
  });
};
