
import { useState, useEffect } from 'react';
import { useSupabaseOperations } from './useSupabaseOperations';

export const useProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const { insertData, fetchData, isLoading } = useSupabaseOperations();

  const fetchProjects = async () => {
    const result = await fetchData('projects', '*, client:clients(*), project_manager:profiles(*)');
    if (result.success) {
      setProjects(result.data || []);
    }
  };

  const createProject = async (projectData: any) => {
    // Add current user as created_by
    const { data: { user } } = await supabase.auth.getUser();
    const dataWithUser = {
      ...projectData,
      created_by: user?.id,
    };

    const result = await insertData('projects', dataWithUser, 'Project created successfully');
    if (result.success) {
      await fetchProjects(); // Refresh the list
    }
    return result;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    createProject,
    fetchProjects,
    isLoading,
  };
};
