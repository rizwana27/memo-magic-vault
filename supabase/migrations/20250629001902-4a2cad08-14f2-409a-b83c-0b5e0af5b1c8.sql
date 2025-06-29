
-- Add RLS policies to timesheets table to ensure users only see their own data
ALTER TABLE public.timesheets ENABLE ROW LEVEL SECURITY;

-- Policy for users to view only their own timesheets
CREATE POLICY "Users can view their own timesheets" 
  ON public.timesheets 
  FOR SELECT 
  USING (auth.uid() = created_by);

-- Policy for users to insert their own timesheets
CREATE POLICY "Users can create their own timesheets" 
  ON public.timesheets 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

-- Policy for users to update their own timesheets
CREATE POLICY "Users can update their own timesheets" 
  ON public.timesheets 
  FOR UPDATE 
  USING (auth.uid() = created_by);

-- Policy for users to delete their own timesheets
CREATE POLICY "Users can delete their own timesheets" 
  ON public.timesheets 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Create a trigger to automatically set created_by to current user for timesheets
CREATE OR REPLACE FUNCTION public.auto_set_timesheet_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Always set created_by to current authenticated user
  NEW.created_by := auth.uid();
  
  -- Generate timesheet_id if not provided
  IF NEW.timesheet_id IS NULL OR NEW.timesheet_id = '' THEN
    NEW.timesheet_id := generate_timesheet_id();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS set_timesheet_user ON public.timesheets;
CREATE TRIGGER set_timesheet_user
  BEFORE INSERT ON public.timesheets
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_set_timesheet_user();

-- Update the existing auto_generate_id trigger to exclude timesheets since we handle it above
CREATE OR REPLACE FUNCTION public.auto_generate_id()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_TABLE_NAME = 'clients' THEN
    NEW.client_id := generate_client_id();
    NEW.created_by := auth.uid();
  ELSIF TG_TABLE_NAME = 'projects' THEN
    NEW.project_id := generate_project_id();
    NEW.created_by := auth.uid();
  ELSIF TG_TABLE_NAME = 'resources' THEN
    NEW.resource_id := generate_resource_id();
    NEW.created_by := auth.uid();
  ELSIF TG_TABLE_NAME = 'vendors' THEN
    NEW.vendor_id := generate_vendor_id();
    NEW.created_by := auth.uid();
  END IF;
  
  RETURN NEW;
END;
$function$;
