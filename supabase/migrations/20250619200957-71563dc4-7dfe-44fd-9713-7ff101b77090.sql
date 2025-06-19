
-- First, let's check what enum values already exist and update accordingly
-- We'll use the existing enum values from the database

-- Update profiles table to include role field using existing enum
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_role text DEFAULT 'user';

-- Create RLS policies for role-based access
DROP POLICY IF EXISTS "Users can view their own profile with role" ON public.profiles;
CREATE POLICY "Users can view their own profile with role" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile with role" ON public.profiles;
CREATE POLICY "Users can update their own profile with role" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(user_role, role, 'user') FROM public.profiles WHERE id = auth.uid();
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_user_role(required_role text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND COALESCE(user_role, role, 'user') = required_role
  );
$$;

-- Update the handle_new_user function to include role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, user_role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
