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
