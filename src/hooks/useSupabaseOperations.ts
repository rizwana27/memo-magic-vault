
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type TableName = 'clients' | 'projects' | 'vendors' | 'timesheets' | 'profiles' | 'tasks' | 'expenses' | 'invoices' | 'purchase_orders' | 'notifications' | 'activity_logs';

export const useSupabaseOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const insertData = async (table: TableName, data: any, successMessage?: string) => {
    setIsLoading(true);
    try {
      console.log(`Inserting data into ${table}:`, data);
      
      const { data: result, error } = await supabase
        .from(table)
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error(`Error inserting into ${table}:`, error);
        toast({
          title: "Error",
          description: error.message || `Failed to create ${table.slice(0, -1)}`,
          variant: "destructive",
        });
        return { success: false, error };
      }

      console.log(`Successfully inserted into ${table}:`, result);
      toast({
        title: "Success",
        description: successMessage || `${table.slice(0, -1)} created successfully`,
      });

      return { success: true, data: result };
    } catch (error: any) {
      console.error(`Unexpected error inserting into ${table}:`, error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async (table: TableName, select?: string) => {
    setIsLoading(true);
    try {
      console.log(`Fetching data from ${table}`);
      
      let query = supabase.from(table);
      
      if (select) {
        query = query.select(select);
      } else {
        query = query.select('*');
      }
      
      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching from ${table}:`, error);
        toast({
          title: "Error",
          description: `Failed to fetch ${table}`,
          variant: "destructive",
        });
        return { success: false, error };
      }

      console.log(`Successfully fetched from ${table}:`, data);
      return { success: true, data };
    } catch (error: any) {
      console.error(`Unexpected error fetching from ${table}:`, error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching data",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    insertData,
    fetchData,
    isLoading,
  };
};
