
import * as XLSX from 'xlsx';

export interface ExcelParseResult {
  data: any[];
  errors: string[];
  warnings: string[];
}

export interface ProjectExcelRow {
  project_name?: string;
  description?: string;
  client_name?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  budget?: string;
  project_manager?: string;
  region?: string;
}

export interface ClientExcelRow {
  client_name?: string;
  company_name?: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
  phone_number?: string;
  industry?: string;
  client_type?: string;
  revenue_tier?: string;
  notes?: string;
}

export interface VendorExcelRow {
  vendor_name?: string;
  contact_person?: string;
  contact_email?: string;
  phone_number?: string;
  services_offered?: string;
  status?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  notes?: string;
}

export const parseExcelFile = async (file: File): Promise<ExcelParseResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    if (workbook.SheetNames.length === 0) {
      errors.push('No sheets found in the Excel file');
      return { data: [], errors, warnings };
    }
    
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet);
    
    if (data.length === 0) {
      errors.push('No data found in the Excel sheet');
      return { data: [], errors, warnings };
    }
    
    return { data, errors, warnings };
  } catch (error) {
    errors.push(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { data: [], errors, warnings };
  }
};

export const validateProjectData = (row: ProjectExcelRow, index: number): string[] => {
  const errors: string[] = [];
  
  if (!row.project_name || row.project_name.trim() === '') {
    errors.push(`Row ${index + 1}: Project name is required`);
  }
  
  if (row.status && !['planning', 'active', 'on_hold', 'completed', 'cancelled'].includes(row.status.toLowerCase())) {
    errors.push(`Row ${index + 1}: Invalid status. Must be one of: planning, active, on_hold, completed, cancelled`);
  }
  
  if (row.budget && isNaN(Number(row.budget))) {
    errors.push(`Row ${index + 1}: Budget must be a valid number`);
  }
  
  return errors;
};

export const validateClientData = (row: ClientExcelRow, index: number): string[] => {
  const errors: string[] = [];
  
  if (!row.client_name || row.client_name.trim() === '') {
    errors.push(`Row ${index + 1}: Client name is required`);
  }
  
  if (!row.company_name || row.company_name.trim() === '') {
    errors.push(`Row ${index + 1}: Company name is required`);
  }
  
  if (!row.primary_contact_name || row.primary_contact_name.trim() === '') {
    errors.push(`Row ${index + 1}: Primary contact name is required`);
  }
  
  if (!row.primary_contact_email || row.primary_contact_email.trim() === '') {
    errors.push(`Row ${index + 1}: Primary contact email is required`);
  }
  
  if (row.primary_contact_email && !/\S+@\S+\.\S+/.test(row.primary_contact_email)) {
    errors.push(`Row ${index + 1}: Invalid email format`);
  }
  
  if (row.client_type && !['prospect', 'active', 'inactive'].includes(row.client_type.toLowerCase())) {
    errors.push(`Row ${index + 1}: Invalid client type. Must be one of: prospect, active, inactive`);
  }
  
  return errors;
};

export const validateVendorData = (row: VendorExcelRow, index: number): string[] => {
  const errors: string[] = [];
  
  if (!row.vendor_name || row.vendor_name.trim() === '') {
    errors.push(`Row ${index + 1}: Vendor name is required`);
  }
  
  if (!row.contact_person || row.contact_person.trim() === '') {
    errors.push(`Row ${index + 1}: Contact person is required`);
  }
  
  if (!row.contact_email || row.contact_email.trim() === '') {
    errors.push(`Row ${index + 1}: Contact email is required`);
  }
  
  if (row.contact_email && !/\S+@\S+\.\S+/.test(row.contact_email)) {
    errors.push(`Row ${index + 1}: Invalid email format`);
  }
  
  if (!row.services_offered || row.services_offered.trim() === '') {
    errors.push(`Row ${index + 1}: Services offered is required`);
  }
  
  if (row.status && !['active', 'inactive', 'pending'].includes(row.status.toLowerCase())) {
    errors.push(`Row ${index + 1}: Invalid status. Must be one of: active, inactive, pending`);
  }
  
  return errors;
};

export const generateProjectTemplate = (): void => {
  const template = [
    {
      project_name: 'Website Redesign',
      description: 'Complete redesign of company website',
      client_name: 'Acme Corp',
      status: 'planning',
      start_date: '2024-01-15',
      end_date: '2024-06-30',
      budget: '50000',
      project_manager: 'John Smith',
      region: 'North America'
    }
  ];
  
  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');
  XLSX.writeFile(workbook, 'project_template.xlsx');
};

export const generateClientTemplate = (): void => {
  const template = [
    {
      client_name: 'Acme Corporation',
      company_name: 'Acme Corp',
      primary_contact_name: 'Jane Doe',
      primary_contact_email: 'jane.doe@acme.com',
      phone_number: '+1-555-0123',
      industry: 'Technology',
      client_type: 'active',
      revenue_tier: 'medium',
      notes: 'Key client for enterprise solutions'
    }
  ];
  
  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');
  XLSX.writeFile(workbook, 'client_template.xlsx');
};

export const generateVendorTemplate = (): void => {
  const template = [
    {
      vendor_name: 'Tech Solutions Inc',
      contact_person: 'Bob Johnson',
      contact_email: 'bob@techsolutions.com',
      phone_number: '+1-555-0456',
      services_offered: 'Cloud Infrastructure, DevOps',
      status: 'active',
      contract_start_date: '2024-01-01',
      contract_end_date: '2024-12-31',
      notes: 'Preferred vendor for cloud services'
    }
  ];
  
  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendors');
  XLSX.writeFile(workbook, 'vendor_template.xlsx');
};
