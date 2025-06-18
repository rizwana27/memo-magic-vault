
-- Create security functions to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql STABLE
SECURITY DEFINER
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_project_manager()
RETURNS boolean
LANGUAGE sql STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'project_manager')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_client()
RETURNS boolean
LANGUAGE sql STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'client'
  );
$$;

-- Drop and recreate conflicting policies
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Enable Row Level Security on all tables (ignore if already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table (recreate dropped ones)
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (public.is_admin());

-- RLS Policies for clients table
CREATE POLICY "Admins and PMs can view all clients" ON public.clients
  FOR SELECT USING (public.is_project_manager());

CREATE POLICY "Clients can view their own data" ON public.clients
  FOR SELECT USING (
    public.is_client() AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND email = clients.email
    )
  );

CREATE POLICY "Admins and PMs can manage clients" ON public.clients
  FOR ALL USING (public.is_project_manager());

-- RLS Policies for projects table
CREATE POLICY "Everyone can view projects they're involved in" ON public.projects
  FOR SELECT USING (
    public.is_project_manager() OR
    project_manager_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.project_resources WHERE project_id = projects.id AND user_id = auth.uid()) OR
    (public.is_client() AND client_id IN (
      SELECT c.id FROM public.clients c 
      JOIN public.profiles p ON p.email = c.email 
      WHERE p.id = auth.uid()
    ))
  );

CREATE POLICY "PMs can manage projects" ON public.projects
  FOR ALL USING (public.is_project_manager());

-- RLS Policies for tasks table
CREATE POLICY "Users can view tasks in their projects" ON public.tasks
  FOR SELECT USING (
    public.is_project_manager() OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = tasks.project_id AND (
        p.project_manager_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.project_resources pr WHERE pr.project_id = p.id AND pr.user_id = auth.uid())
      )
    )
  );

CREATE POLICY "PMs can manage tasks" ON public.tasks
  FOR ALL USING (public.is_project_manager());

CREATE POLICY "Assigned users can update their tasks" ON public.tasks
  FOR UPDATE USING (assigned_to = auth.uid());

-- RLS Policies for timesheets table
CREATE POLICY "Users can view their own timesheets" ON public.timesheets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "PMs can view all timesheets" ON public.timesheets
  FOR SELECT USING (public.is_project_manager());

CREATE POLICY "Users can manage their own timesheets" ON public.timesheets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own draft timesheets" ON public.timesheets
  FOR UPDATE USING (user_id = auth.uid() AND status = 'draft');

CREATE POLICY "PMs can approve timesheets" ON public.timesheets
  FOR UPDATE USING (public.is_project_manager());

-- RLS Policies for vendors table
CREATE POLICY "PMs can manage vendors" ON public.vendors
  FOR ALL USING (public.is_project_manager());

-- RLS Policies for purchase_orders table
CREATE POLICY "PMs can manage purchase orders" ON public.purchase_orders
  FOR ALL USING (public.is_project_manager());

-- RLS Policies for purchase_order_items table
CREATE POLICY "PMs can manage PO items" ON public.purchase_order_items
  FOR ALL USING (public.is_project_manager());

-- RLS Policies for invoices table
CREATE POLICY "PMs can view all invoices" ON public.invoices
  FOR SELECT USING (public.is_project_manager());

CREATE POLICY "Clients can view their own invoices" ON public.invoices
  FOR SELECT USING (
    public.is_client() AND client_id IN (
      SELECT c.id FROM public.clients c 
      JOIN public.profiles p ON p.email = c.email 
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "PMs can manage invoices" ON public.invoices
  FOR ALL USING (public.is_project_manager());

-- RLS Policies for invoice_items table
CREATE POLICY "Users can view invoice items for accessible invoices" ON public.invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices i 
      WHERE i.id = invoice_items.invoice_id AND (
        public.is_project_manager() OR
        (public.is_client() AND i.client_id IN (
          SELECT c.id FROM public.clients c 
          JOIN public.profiles p ON p.email = c.email 
          WHERE p.id = auth.uid()
        ))
      )
    )
  );

CREATE POLICY "PMs can manage invoice items" ON public.invoice_items
  FOR ALL USING (public.is_project_manager());

-- RLS Policies for expenses table
CREATE POLICY "Users can view their own expenses" ON public.expenses
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "PMs can view all expenses" ON public.expenses
  FOR SELECT USING (public.is_project_manager());

CREATE POLICY "Users can manage their own expenses" ON public.expenses
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own expenses" ON public.expenses
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "PMs can approve expenses" ON public.expenses
  FOR UPDATE USING (public.is_project_manager());

-- RLS Policies for activity_logs table
CREATE POLICY "Users can view their own activity" ON public.activity_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity" ON public.activity_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "All authenticated users can insert activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for notifications table
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- RLS Policies for project_resources table
CREATE POLICY "Users can view project assignments they're involved in" ON public.project_resources
  FOR SELECT USING (
    user_id = auth.uid() OR
    public.is_project_manager() OR
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = project_resources.project_id AND p.project_manager_id = auth.uid()
    )
  );

CREATE POLICY "PMs can manage project resources" ON public.project_resources
  FOR ALL USING (public.is_project_manager());

-- RLS Policies for milestones table
CREATE POLICY "Users can view milestones in their projects" ON public.milestones
  FOR SELECT USING (
    public.is_project_manager() OR
    EXISTS (
      SELECT 1 FROM public.projects p 
      WHERE p.id = milestones.project_id AND (
        p.project_manager_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.project_resources pr WHERE pr.project_id = p.id AND pr.user_id = auth.uid())
      )
    )
  );

CREATE POLICY "PMs can manage milestones" ON public.milestones
  FOR ALL USING (public.is_project_manager());

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.timesheets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('documents', 'documents', false),
  ('invoices', 'invoices', false),
  ('receipts', 'receipts', false),
  ('contracts', 'contracts', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
CREATE POLICY "Users can view documents they have access to" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND (
      public.is_project_manager() OR
      auth.uid()::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for invoices bucket
CREATE POLICY "PMs can view all invoices storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'invoices' AND public.is_project_manager());

CREATE POLICY "PMs can upload invoices storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'invoices' AND public.is_project_manager());

-- Storage policies for receipts bucket
CREATE POLICY "Users can view their own receipts storage" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'receipts' AND (
      public.is_project_manager() OR
      auth.uid()::text = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "Users can upload their own receipts storage" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'receipts' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for contracts bucket
CREATE POLICY "PMs can manage contracts storage" ON storage.objects
  FOR ALL USING (bucket_id = 'contracts' AND public.is_project_manager());

-- Storage policies for avatars bucket (public)
CREATE POLICY "Anyone can view avatars storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar storage" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
