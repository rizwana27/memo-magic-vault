
import { useState, useEffect } from 'react';
import { useSupabaseOperations } from './useSupabaseOperations';
import { supabase } from '@/integrations/supabase/client';

export const useVendors = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const { insertData, fetchData, isLoading } = useSupabaseOperations();

  const fetchVendors = async () => {
    const result = await fetchData('vendors');
    if (result.success) {
      setVendors(result.data || []);
    }
  };

  const createVendor = async (vendorData: any) => {
    // Add current user as created_by
    const { data: { user } } = await supabase.auth.getUser();
    const dataWithUser = {
      name: vendorData.vendorName,
      contact_person: vendorData.contactPerson,
      email: vendorData.contactEmail,
      phone: vendorData.phoneNumber,
      services_offered: vendorData.servicesOffered,
      status: vendorData.status === 'active' ? 'active' : 'inactive',
      contract_start_date: vendorData.contractStart ? new Date(vendorData.contractStart).toISOString().split('T')[0] : null,
      contract_end_date: vendorData.contractEnd ? new Date(vendorData.contractEnd).toISOString().split('T')[0] : null,
      notes: vendorData.notes,
      created_by: user?.id,
    };

    const result = await insertData('vendors', dataWithUser, 'Vendor created successfully');
    if (result.success) {
      await fetchVendors(); // Refresh the list
    }
    return result;
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return {
    vendors,
    createVendor,
    fetchVendors,
    isLoading,
  };
};
