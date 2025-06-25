
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

// Column mapping configurations for case-insensitive matching
const PROJECT_COLUMN_MAPPINGS = {
  'project_name': ['project_name', 'project name', 'projectname', 'name', 'title'],
  'description': ['description', 'desc', 'project description', 'details'],
  'client_name': ['client_name', 'client name', 'clientname', 'client', 'customer', 'customer name'],
  'status': ['status', 'project status', 'state'],
  'start_date': ['start_date', 'start date', 'startdate', 'begin date', 'project start'],
  'end_date': ['end_date', 'end date', 'enddate', 'finish date', 'project end'],
  'budget': ['budget', 'project budget', 'cost', 'amount'],
  'project_manager': ['project_manager', 'project manager', 'manager', 'pm', 'lead'],
  'region': ['region', 'location', 'area', 'territory']
};

const CLIENT_COLUMN_MAPPINGS = {
  'client_name': ['client_name', 'client name', 'clientname', 'name'],
  'company_name': ['company_name', 'company name', 'companyname', 'company', 'organization'],
  'primary_contact_name': ['primary_contact_name', 'primary contact name', 'contact name', 'contact', 'primary contact'],
  'primary_contact_email': ['primary_contact_email', 'primary contact email', 'contact email', 'email', 'primary email'],
  'phone_number': ['phone_number', 'phone number', 'phone', 'contact phone', 'telephone'],
  'industry': ['industry', 'sector', 'business type'],
  'client_type': ['client_type', 'client type', 'type', 'category'],
  'revenue_tier': ['revenue_tier', 'revenue tier', 'tier', 'size'],
  'notes': ['notes', 'comments', 'remarks', 'description']
};

const VENDOR_COLUMN_MAPPINGS = {
  'vendor_name': ['vendor_name', 'vendor name', 'vendorname', 'name', 'supplier'],
  'contact_person': ['contact_person', 'contact person', 'contact name', 'contact', 'representative'],
  'contact_email': ['contact_email', 'contact email', 'email', 'vendor email'],
  'phone_number': ['phone_number', 'phone number', 'phone', 'contact phone', 'telephone'],
  'services_offered': ['services_offered', 'services offered', 'services', 'products', 'offerings'],
  'status': ['status', 'vendor status', 'state'],
  'contract_start_date': ['contract_start_date', 'contract start date', 'start date', 'contract start'],
  'contract_end_date': ['contract_end_date', 'contract end date', 'end date', 'contract end'],
  'notes': ['notes', 'comments', 'remarks', 'description']
};

const normalizeColumnName = (columnName: string): string => {
  return columnName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
};

const findColumnMapping = (excelColumns: string[], mappings: any): { [key: string]: string } => {
  const columnMap: { [key: string]: string } = {};
  const normalizedExcelColumns = excelColumns.map(col => ({
    original: col,
    normalized: normalizeColumnName(col)
  }));

  for (const [standardField, possibleNames] of Object.entries(mappings)) {
    const normalizedPossibleNames = possibleNames.map((name: string) => normalizeColumnName(name));
    
    const match = normalizedExcelColumns.find(excelCol => 
      normalizedPossibleNames.includes(excelCol.normalized)
    );
    
    if (match) {
      columnMap[standardField] = match.original;
    }
  }

  return columnMap;
};

const transformRowData = (row: any, columnMap: { [key: string]: string }): any => {
  const transformedRow: any = {};
  
  for (const [standardField, excelColumn] of Object.entries(columnMap)) {
    if (row[excelColumn] !== undefined && row[excelColumn] !== null && row[excelColumn] !== '') {
      transformedRow[standardField] = row[excelColumn];
    }
  }
  
  return transformedRow;
};

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
    const rawData = XLSX.utils.sheet_to_json(firstSheet);
    
    if (rawData.length === 0) {
      errors.push('No data found in the Excel sheet');
      return { data: [], errors, warnings };
    }
    
    return { data: rawData, errors, warnings };
  } catch (error) {
    errors.push(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { data: [], errors, warnings };
  }
};

export const parseAndValidateProjectData = (rawData: any[]): ExcelParseResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const validatedData: ProjectExcelRow[] = [];

  if (rawData.length === 0) {
    errors.push('No data found in Excel file');
    return { data: [], errors, warnings };
  }

  // Get column names from first row
  const excelColumns = Object.keys(rawData[0]);
  const columnMap = findColumnMapping(excelColumns, PROJECT_COLUMN_MAPPINGS);

  // Check for required columns
  if (!columnMap['project_name']) {
    errors.push('Required column "project_name" (or similar) not found. Expected columns: Project Name, project_name, etc.');
  }

  // Log column mapping for debugging
  console.log('Excel columns found:', excelColumns);
  console.log('Column mapping:', columnMap);

  // If critical errors, return early
  if (errors.length > 0) {
    return { data: [], errors, warnings };
  }

  // Process each row
  rawData.forEach((row, index) => {
    const transformedRow = transformRowData(row, columnMap);
    const rowErrors = validateProjectData(transformedRow, index);
    
    if (rowErrors.length === 0) {
      validatedData.push(transformedRow);
    } else {
      errors.push(...rowErrors);
    }
  });

  return { data: validatedData, errors, warnings };
};

export const parseAndValidateClientData = (rawData: any[]): ExcelParseResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const validatedData: ClientExcelRow[] = [];

  if (rawData.length === 0) {
    errors.push('No data found in Excel file');
    return { data: [], errors, warnings };
  }

  const excelColumns = Object.keys(rawData[0]);
  const columnMap = findColumnMapping(excelColumns, CLIENT_COLUMN_MAPPINGS);

  // Check for required columns
  const requiredColumns = ['client_name', 'company_name', 'primary_contact_name', 'primary_contact_email'];
  const missingColumns = requiredColumns.filter(col => !columnMap[col]);
  
  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(', ')}. Please check the template.`);
    return { data: [], errors, warnings };
  }

  rawData.forEach((row, index) => {
    const transformedRow = transformRowData(row, columnMap);
    const rowErrors = validateClientData(transformedRow, index);
    
    if (rowErrors.length === 0) {
      validatedData.push(transformedRow);
    } else {
      errors.push(...rowErrors);
    }
  });

  return { data: validatedData, errors, warnings };
};

export const parseAndValidateVendorData = (rawData: any[]): ExcelParseResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const validatedData: VendorExcelRow[] = [];

  if (rawData.length === 0) {
    errors.push('No data found in Excel file');
    return { data: [], errors, warnings };
  }

  const excelColumns = Object.keys(rawData[0]);
  const columnMap = findColumnMapping(excelColumns, VENDOR_COLUMN_MAPPINGS);

  // Check for required columns
  const requiredColumns = ['vendor_name', 'contact_person', 'contact_email', 'services_offered'];
  const missingColumns = requiredColumns.filter(col => !columnMap[col]);
  
  if (missingColumns.length > 0) {
    errors.push(`Missing required columns: ${missingColumns.join(', ')}. Please check the template.`);
    return { data: [], errors, warnings };
  }

  rawData.forEach((row, index) => {
    const transformedRow = transformRowData(row, columnMap);
    const rowErrors = validateVendorData(transformedRow, index);
    
    if (rowErrors.length === 0) {
      validatedData.push(transformedRow);
    } else {
      errors.push(...rowErrors);
    }
  });

  return { data: validatedData, errors, warnings };
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
