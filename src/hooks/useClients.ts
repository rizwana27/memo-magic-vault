
import { useState, useEffect } from 'react';
import { useSupabaseOperations } from './useSupabaseOperations';
import { supabase } from '@/integrations/supabase/client';

export const useClients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const { insertData, fetchData, isLoading } = useSupabaseOperations();

  const fetchClients = async () => {
    const result = await fetchData('clients');
    if (result.success) {
      setClients(result.data || []);
    }
  };

  const createClient = async (clientData: any) => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    const dataWithUser = {
      name: clientData.companyName,
      contact_person: clientData.primaryContactName,
      email: clientData.primaryContactEmail,
      phone: clientData.phoneNumber,
      industry: clientData.industry,
      is_active: clientData.clientType === 'active',
      created_by: user?.id,
    };

    const result = await insertData('clients', dataWithUser, 'Client created successfully');
    if (result.success) {
      await fetchClients(); // Refresh the list
    }
    return result;
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    createClient,
    fetchClients,
    isLoading,
  };
};
