
import { useState, useEffect } from 'react';
import { useSupabaseOperations } from './useSupabaseOperations';
import { supabase } from '@/integrations/supabase/client';

export const useResources = () => {
  const [resources, setResources] = useState<any[]>([]);
  const { insertData, fetchData, isLoading } = useSupabaseOperations();

  const fetchResources = async () => {
    const result = await fetchData('profiles', 'id, full_name, email, phone, department, role, is_active, created_at');
    if (result.success) {
      // Transform the data to match the expected format
      const transformedData = result.data?.map((profile: any) => ({
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
      
      setResources(transformedData);
    }
  };

  const createResource = async (resourceData: any) => {
    // Transform form data to match profiles table structure
    const profileData = {
      full_name: resourceData.fullName,
      email: resourceData.email,
      phone: resourceData.phone,
      department: resourceData.department,
      role: resourceData.role,
      is_active: resourceData.status,
    };

    const result = await insertData('profiles', profileData, 'Resource created successfully');
    if (result.success) {
      await fetchResources(); // Refresh the list
    }
    return result;
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return {
    resources,
    createResource,
    fetchResources,
    isLoading,
  };
};
