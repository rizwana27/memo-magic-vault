
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationData {
  type: 'task_assignment' | 'timesheet_approval' | 'invoice_sent' | 'project_update';
  recipient_email: string;
  recipient_name?: string;
  data: any;
}

export const useNotifications = () => {
  const { toast } = useToast();

  const sendNotification = async (notificationData: NotificationData) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-notifications', {
        body: notificationData
      });

      if (error) {
        console.error('Error sending notification:', error);
        toast({
          title: "Notification Error",
          description: "Failed to send notification",
          variant: "destructive",
        });
        return { success: false, error };
      }

      toast({
        title: "Notification Sent",
        description: "Email notification sent successfully",
      });

      return { success: true, data };
    } catch (error) {
      console.error('Notification error:', error);
      toast({
        title: "Notification Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const sendTaskAssignment = async (taskData: any, assigneeEmail: string, assigneeName?: string) => {
    return await sendNotification({
      type: 'task_assignment',
      recipient_email: assigneeEmail,
      recipient_name: assigneeName,
      data: taskData
    });
  };

  const sendTimesheetApproval = async (timesheetData: any, employeeEmail: string, employeeName?: string) => {
    return await sendNotification({
      type: 'timesheet_approval',
      recipient_email: employeeEmail,
      recipient_name: employeeName,
      data: timesheetData
    });
  };

  const sendInvoiceNotification = async (invoiceData: any, clientEmail: string, clientName?: string) => {
    return await sendNotification({
      type: 'invoice_sent',
      recipient_email: clientEmail,
      recipient_name: clientName,
      data: invoiceData
    });
  };

  const sendProjectUpdate = async (projectData: any, teamMemberEmail: string, teamMemberName?: string) => {
    return await sendNotification({
      type: 'project_update',
      recipient_email: teamMemberEmail,
      recipient_name: teamMemberName,
      data: projectData
    });
  };

  return {
    sendNotification,
    sendTaskAssignment,
    sendTimesheetApproval,
    sendInvoiceNotification,
    sendProjectUpdate
  };
};
