
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from "../_shared/supabase.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExportRequest {
  format: 'csv' | 'pdf';
  report_type: 'timesheets' | 'projects' | 'invoices' | 'resources';
  filters?: {
    start_date?: string;
    end_date?: string;
    project_id?: string;
    user_id?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { format, report_type, filters }: ExportRequest = await req.json();

    console.log(`Generating ${format} export for ${report_type}`);

    const data = await fetchReportData(report_type, filters);
    
    if (format === 'csv') {
      const csvContent = generateCSV(data, report_type);
      
      return new Response(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="${report_type}_export.csv"`,
          ...corsHeaders
        }
      });
    } else if (format === 'pdf') {
      // For PDF generation, you would typically use a library like jsPDF or puppeteer
      // For now, returning a simple text response indicating PDF generation
      const htmlContent = generateHTMLReport(data, report_type);
      
      return new Response(htmlContent, {
        status: 200,
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="${report_type}_export.html"`,
          ...corsHeaders
        }
      });
    }

    return new Response(
      JSON.stringify({ error: "Unsupported format" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Export error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

async function fetchReportData(reportType: string, filters: any = {}) {
  let query = supabase.from(getTableName(reportType)).select('*');
  
  if (filters.start_date) {
    query = query.gte('created_at', filters.start_date);
  }
  if (filters.end_date) {
    query = query.lte('created_at', filters.end_date);
  }
  if (filters.project_id) {
    query = query.eq('project_id', filters.project_id);
  }
  if (filters.user_id) {
    query = query.eq('created_by', filters.user_id);
  }

  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch ${reportType} data: ${error.message}`);
  }
  
  return data || [];
}

function getTableName(reportType: string): string {
  switch (reportType) {
    case 'timesheets': return 'timesheets';
    case 'projects': return 'projects';
    case 'invoices': return 'invoices';
    case 'resources': return 'resources';
    default: throw new Error(`Unknown report type: ${reportType}`);
  }
}

function generateCSV(data: any[], reportType: string): string {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

function generateHTMLReport(data: any[], reportType: string): string {
  if (!data.length) return '<p>No data available</p>';
  
  const headers = Object.keys(data[0]);
  
  let html = `
    <html>
      <head>
        <title>${reportType.toUpperCase()} Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>${reportType.toUpperCase()} Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              ${headers.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
  
  return html;
}

serve(handler);
