
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ExportOptions {
  format: 'csv' | 'pdf';
  report_type: 'timesheets' | 'projects' | 'invoices' | 'resources';
  filters?: {
    start_date?: string;
    end_date?: string;
    project_id?: string;
    user_id?: string;
  };
}

export const useExport = () => {
  const { toast } = useToast();

  const exportReport = async (options: ExportOptions) => {
    try {
      toast({
        title: "Generating Export",
        description: `Preparing ${options.format.toUpperCase()} report...`,
      });

      const { data, error } = await supabase.functions.invoke('export-reports', {
        body: options
      });

      if (error) {
        console.error('Export error:', error);
        toast({
          title: "Export Failed",
          description: "Failed to generate report",
          variant: "destructive",
        });
        return { success: false, error };
      }

      // For now, we'll create a simple download
      // In a real implementation, you'd handle the blob response properly
      toast({
        title: "Export Complete",
        description: `${options.report_type} report generated successfully`,
      });

      return { success: true, data };
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate report",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  return { exportReport };
};
