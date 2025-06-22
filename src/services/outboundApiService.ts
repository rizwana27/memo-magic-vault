
import { supabase } from '@/integrations/supabase/client';

// Service for handling outbound API calls (emails, exports, external notifications)
export class OutboundApiService {
  
  // Email notification service
  static async sendEmailNotification(emailData: {
    to: string[];
    subject: string;
    message: string;
    type: 'task_assignment' | 'project_update' | 'timesheet_reminder' | 'invoice_sent';
    relatedId?: string;
  }) {
    try {
      console.log('Sending email notification:', emailData);
      
      // Call Supabase Edge Function for email sending
      const { data, error } = await supabase.functions.invoke('send-email-notification', {
        body: emailData
      });

      if (error) throw error;
      
      // Log the email in notifications table
      await supabase.from('notifications').insert({
        message: `Email sent: ${emailData.subject}`,
        type: 'email',
        related_id: emailData.relatedId,
      });

      return data;
    } catch (error) {
      console.error('Email notification failed:', error);
      throw error;
    }
  }

  // Export data to PDF/CSV
  static async exportData(exportParams: {
    type: 'projects' | 'resources' | 'timesheets' | 'financials';
    format: 'pdf' | 'csv' | 'xlsx';
    dateRange?: { start: string; end: string };
    filters?: Record<string, any>;
  }) {
    try {
      console.log('Exporting data:', exportParams);

      // Call Supabase Edge Function for data export
      const { data, error } = await supabase.functions.invoke('export-data', {
        body: exportParams
      });

      if (error) throw error;

      // Create download link
      if (data.downloadUrl) {
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      return data;
    } catch (error) {
      console.error('Data export failed:', error);
      throw error;
    }
  }

  // Slack notification service
  static async sendSlackNotification(slackData: {
    channel: string;
    message: string;
    type: 'project_update' | 'task_assignment' | 'deadline_reminder';
    relatedId?: string;
  }) {
    try {
      console.log('Sending Slack notification:', slackData);

      // Call Supabase Edge Function for Slack integration
      const { data, error } = await supabase.functions.invoke('send-slack-notification', {
        body: slackData
      });

      if (error) throw error;

      // Log the notification
      await supabase.from('notifications').insert({
        message: `Slack notification sent: ${slackData.message}`,
        type: 'slack',
        related_id: slackData.relatedId,
      });

      return data;
    } catch (error) {
      console.error('Slack notification failed:', error);
      throw error;
    }
  }

  // Calendar sync service
  static async syncCalendar(calendarData: {
    eventType: 'project_deadline' | 'meeting' | 'timesheet_due';
    title: string;
    startDate: string;
    endDate?: string;
    description?: string;
    attendees?: string[];
  }) {
    try {
      console.log('Syncing calendar event:', calendarData);

      // Call Supabase Edge Function for calendar integration
      const { data, error } = await supabase.functions.invoke('sync-calendar', {
        body: calendarData
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Calendar sync failed:', error);
      throw error;
    }
  }

  // Generate reports with real-time data
  static async generateReport(reportParams: {
    type: 'utilization' | 'allocation' | 'financial' | 'project_status';
    dateRange: { start: string; end: string };
    filters?: Record<string, any>;
    includeCharts?: boolean;
  }) {
    try {
      console.log('Generating report:', reportParams);

      let reportData;

      switch (reportParams.type) {
        case 'utilization':
          reportData = await this.generateUtilizationReport(reportParams);
          break;
        case 'allocation':
          reportData = await this.generateAllocationReport(reportParams);
          break;
        case 'financial':
          reportData = await this.generateFinancialReport(reportParams);
          break;
        case 'project_status':
          reportData = await this.generateProjectStatusReport(reportParams);
          break;
        default:
          throw new Error('Invalid report type');
      }

      return reportData;
    } catch (error) {
      console.error('Report generation failed:', error);
      throw error;
    }
  }

  private static async generateUtilizationReport(params: any) {
    // Get timesheets data
    const { data: timesheets, error: timesheetsError } = await supabase
      .from('timesheets')
      .select('*')
      .gte('date', params.dateRange.start)
      .lte('date', params.dateRange.end);

    if (timesheetsError) throw timesheetsError;

    // Get projects data separately
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('project_id, project_name');

    if (projectsError) throw projectsError;

    // Get resources data separately
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('resource_id, full_name, department');

    if (resourcesError) throw resourcesError;

    // Process and aggregate data for report
    const utilizationData = timesheets?.reduce((acc, sheet) => {
      const resourceKey = sheet.created_by;
      if (!acc[resourceKey]) {
        const resource = resources?.find(r => r.resource_id === sheet.created_by);
        const project = projects?.find(p => p.project_id === sheet.project_id);
        
        acc[resourceKey] = {
          resourceName: resource?.full_name || 'Unknown',
          department: resource?.department || 'Unknown',
          totalHours: 0,
          billableHours: 0,
          projects: new Set(),
        };
      }
      
      acc[resourceKey].totalHours += sheet.hours || 0;
      if (sheet.billable) {
        acc[resourceKey].billableHours += sheet.hours || 0;
      }
      
      const project = projects?.find(p => p.project_id === sheet.project_id);
      acc[resourceKey].projects.add(project?.project_name || 'Unknown');
      
      return acc;
    }, {});

    return {
      type: 'utilization',
      dateRange: params.dateRange,
      data: Object.values(utilizationData || {}),
      summary: {
        totalResources: Object.keys(utilizationData || {}).length,
        totalHours: Object.values(utilizationData || {}).reduce((sum: number, resource: any) => sum + resource.totalHours, 0),
        totalBillableHours: Object.values(utilizationData || {}).reduce((sum: number, resource: any) => sum + resource.billableHours, 0),
      }
    };
  }

  private static async generateAllocationReport(params: any) {
    // Get timesheets data
    const { data: timesheets, error: timesheetsError } = await supabase
      .from('timesheets')
      .select('*')
      .gte('date', params.dateRange.start)
      .lte('date', params.dateRange.end);

    if (timesheetsError) throw timesheetsError;

    // Get projects data separately
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('project_id, project_name, client_id');

    if (projectsError) throw projectsError;

    // Get resources data separately
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('resource_id, full_name, department');

    if (resourcesError) throw resourcesError;

    // Process allocation data
    const allocationMatrix = timesheets?.reduce((acc, sheet) => {
      const key = `${sheet.created_by}-${sheet.project_id}`;
      if (!acc[key]) {
        const resource = resources?.find(r => r.resource_id === sheet.created_by);
        const project = projects?.find(p => p.project_id === sheet.project_id);
        
        acc[key] = {
          resourceName: resource?.full_name || 'Unknown',
          department: resource?.department || 'Unknown',
          projectName: project?.project_name || 'Unknown',
          clientId: project?.client_id || 'Unknown',
          totalHours: 0,
          billableHours: 0,
        };
      }
      
      acc[key].totalHours += sheet.hours || 0;
      if (sheet.billable) {
        acc[key].billableHours += sheet.hours || 0;
      }
      
      return acc;
    }, {});

    return {
      type: 'allocation',
      dateRange: params.dateRange,
      data: Object.values(allocationMatrix || {}),
    };
  }

  private static async generateFinancialReport(params: any) {
    // Get financial data
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(client_name),
        project:projects(project_name)
      `)
      .gte('invoice_date', params.dateRange.start)
      .lte('invoice_date', params.dateRange.end);

    if (error) throw error;

    const financialSummary = invoices?.reduce((acc, invoice) => {
      acc.totalInvoiced += invoice.total_amount || 0;
      if (invoice.status === 'paid') {
        acc.totalPaid += invoice.total_amount || 0;
      } else if (invoice.status === 'overdue') {
        acc.totalOverdue += invoice.total_amount || 0;
      } else {
        acc.totalPending += invoice.total_amount || 0;
      }
      return acc;
    }, {
      totalInvoiced: 0,
      totalPaid: 0,
      totalPending: 0,
      totalOverdue: 0,
    });

    return {
      type: 'financial',
      dateRange: params.dateRange,
      data: invoices,
      summary: financialSummary,
    };
  }

  private static async generateProjectStatusReport(params: any) {
    // Get project data
    const { data: projects, error } = await supabase
      .from('projects')
      .select(`
        *,
        client:clients(client_name),
        timesheets(hours, billable)
      `)
      .gte('created_at', params.dateRange.start)
      .lte('created_at', params.dateRange.end);

    if (error) throw error;

    const projectSummary = projects?.map(project => {
      const totalHours = project.timesheets?.reduce((sum, ts) => sum + (ts.hours || 0), 0) || 0;
      const billableHours = project.timesheets?.filter(ts => ts.billable).reduce((sum, ts) => sum + (ts.hours || 0), 0) || 0;
      
      return {
        ...project,
        totalHours,
        billableHours,
        utilizationRate: totalHours > 0 ? Math.round((billableHours / totalHours) * 100) : 0,
      };
    });

    return {
      type: 'project_status',
      dateRange: params.dateRange,
      data: projectSummary,
    };
  }
}
