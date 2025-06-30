
-- Update the existing profiles table to support the new role hierarchy
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS persona TEXT CHECK (persona IN ('pmo', 'executive', 'org_leader', 'resource')) DEFAULT 'resource',
ADD COLUMN IF NOT EXISTS department_id UUID,
ADD COLUMN IF NOT EXISTS team_id UUID,
ADD COLUMN IF NOT EXISTS dashboard_config JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create departments table for organizational structure
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  head_user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table for team organization
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  department_id UUID REFERENCES public.departments(id),
  lead_user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create widget definitions table
CREATE TABLE IF NOT EXISTS public.widget_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  component_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'strategic', 'portfolio', 'operational', 'individual'
  required_permissions TEXT[] DEFAULT '{}',
  default_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user dashboard configurations
CREATE TABLE IF NOT EXISTS public.user_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  dashboard_name TEXT NOT NULL DEFAULT 'My Dashboard',
  layout JSONB NOT NULL DEFAULT '[]', -- Array of widget configurations with positions
  is_default BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, dashboard_name)
);

-- Create chat conversations for dashboard guidance
CREATE TABLE IF NOT EXISTS public.dashboard_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  conversation_data JSONB NOT NULL DEFAULT '[]', -- Array of messages
  context JSONB DEFAULT '{}', -- Current dashboard context, preferences, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for departments (PMO can see all, others see their own)
CREATE POLICY "PMO can view all departments" ON public.departments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND persona = 'pmo')
  );

CREATE POLICY "Users can view their department" ON public.departments
  FOR SELECT USING (
    id IN (SELECT department_id FROM public.profiles WHERE id = auth.uid())
  );

-- Create RLS policies for teams
CREATE POLICY "PMO and Org Leaders can view teams" ON public.teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND persona IN ('pmo', 'org_leader')
    )
    OR 
    id IN (SELECT team_id FROM public.profiles WHERE id = auth.uid())
  );

-- Widget definitions - visible based on user permissions
CREATE POLICY "Users can view relevant widgets" ON public.widget_definitions
  FOR SELECT USING (
    CASE 
      WHEN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND persona = 'pmo') THEN TRUE
      WHEN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND persona = 'executive') 
        THEN 'strategic' = ANY(required_permissions) OR 'operational' = ANY(required_permissions)
      WHEN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND persona = 'org_leader') 
        THEN 'operational' = ANY(required_permissions)
      ELSE 'individual' = ANY(required_permissions)
    END
  );

-- User dashboards - users can only access their own
CREATE POLICY "Users can manage their own dashboards" ON public.user_dashboards
  FOR ALL USING (auth.uid() = user_id);

-- Dashboard conversations - users can only access their own
CREATE POLICY "Users can manage their own conversations" ON public.dashboard_conversations
  FOR ALL USING (auth.uid() = user_id);

-- Insert default widget definitions
INSERT INTO public.widget_definitions (name, component_name, description, category, required_permissions) VALUES
-- PMO Widgets (Portfolio level)
('Project Portfolio Overview', 'ProjectPortfolioWidget', 'Complete overview of all projects across the organization', 'portfolio', ARRAY['portfolio']),
('Resource Allocation Matrix', 'ResourceAllocationWidget', 'Cross-project resource allocation and capacity planning', 'portfolio', ARRAY['portfolio']),
('Strategic Pipeline', 'StrategyPipelineWidget', 'Strategic project pipeline and roadmap', 'portfolio', ARRAY['portfolio']),
('Risk Dashboard', 'RiskDashboardWidget', 'Enterprise risk tracking and mitigation', 'portfolio', ARRAY['portfolio']),

-- Executive Widgets (Strategic level)
('Revenue Forecast', 'RevenueForecastWidget', 'Revenue projections and financial forecasting', 'strategic', ARRAY['strategic']),
('Business KPIs', 'BusinessKPIWidget', 'Key business performance indicators', 'strategic', ARRAY['strategic']),
('Executive Summary', 'ExecutiveSummaryWidget', 'High-level business performance summary', 'strategic', ARRAY['strategic']),

-- Org Leader Widgets (Operational level)
('Team Performance', 'TeamPerformanceWidget', 'Team productivity and performance metrics', 'operational', ARRAY['operational']),
('Department Budget', 'DepartmentBudgetWidget', 'Department budget tracking and forecasting', 'operational', ARRAY['operational']),
('Staff Utilization', 'StaffUtilizationWidget', 'Team member utilization and capacity', 'operational', ARRAY['operational']),

-- Resource Widgets (Individual level)
('My Timesheets', 'TimesheetWidget', 'Personal timesheet entry and tracking', 'individual', ARRAY['individual']),
('My Tasks', 'TaskWidget', 'Personal task management', 'individual', ARRAY['individual']),
('My Goals', 'GoalsWidget', 'Personal goals and achievements', 'individual', ARRAY['individual']);

-- Create function to get user permissions based on persona
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_persona TEXT)
RETURNS TEXT[] AS $$
BEGIN
  CASE user_persona
    WHEN 'pmo' THEN RETURN ARRAY['portfolio', 'strategic', 'operational', 'individual'];
    WHEN 'executive' THEN RETURN ARRAY['strategic', 'operational', 'individual'];
    WHEN 'org_leader' THEN RETURN ARRAY['operational', 'individual'];
    WHEN 'resource' THEN RETURN ARRAY['individual'];
    ELSE RETURN ARRAY['individual'];
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_new_user function to support personas
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, user_role, persona)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_role', 'user'),
    COALESCE(NEW.raw_user_meta_data->>'persona', 'resource')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
