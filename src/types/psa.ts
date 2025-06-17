
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  health_status: 'healthy' | 'at_risk' | 'critical';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  project_id?: string;
  assigned_to?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_at: string;
  updated_at: string;
  project?: Project;
}

export interface Timesheet {
  id: string;
  user_id: string;
  project_id?: string;
  task_id?: string;
  date: string;
  hours: number;
  description?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  project?: Project;
  task?: Task;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id?: string;
  project_id?: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
  project?: Project;
}

export interface Expense {
  id: string;
  project_id?: string;
  user_id: string;
  category: string;
  amount: number;
  description?: string;
  receipt_url?: string;
  date: string;
  created_at: string;
  updated_at: string;
  project?: Project;
}

export interface Vendor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  performance_score?: number;
  created_at: string;
  updated_at: string;
}
