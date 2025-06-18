
import { useState, useEffect } from 'react';
import { useSupabaseOperations } from './useSupabaseOperations';
import { supabase } from '@/integrations/supabase/client';

export const useTimesheets = () => {
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const { insertData, fetchData, isLoading } = useSupabaseOperations();

  const fetchTimesheets = async () => {
    const result = await fetchData('timesheets', '*, project:projects(name), task:tasks(title)');
    if (result.success) {
      setTimesheets(result.data || []);
    }
  };

  const createTimesheet = async (timesheetData: any) => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    const dataWithUser = {
      user_id: user?.id,
      project_id: timesheetData.project,
      task_id: timesheetData.task,
      date: new Date(timesheetData.date).toISOString().split('T')[0],
      start_time: timesheetData.startTime,
      end_time: timesheetData.endTime,
      hours: timesheetData.hours,
      is_billable: timesheetData.billable,
      description: timesheetData.notes,
      status: 'draft',
    };

    const result = await insertData('timesheets', dataWithUser, 'Timesheet entry created successfully');
    if (result.success) {
      await fetchTimesheets(); // Refresh the list
    }
    return result;
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  return {
    timesheets,
    createTimesheet,
    fetchTimesheets,
    isLoading,
  };
};
