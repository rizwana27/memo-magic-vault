
-- Create client_invites table
CREATE TABLE IF NOT EXISTS public.client_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  invitation_message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('project', 'client', 'resource', 'timesheet', 'invoice', 'invite')),
  related_id TEXT,
  seen BOOLEAN NOT NULL DEFAULT false,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for client_invites
ALTER TABLE public.client_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all client invites" ON public.client_invites
  FOR SELECT USING (true);

CREATE POLICY "Users can create client invites" ON public.client_invites
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update client invites" ON public.client_invites
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Add RLS policies for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid() OR user_id IS NULL);

-- Add triggers for updated_at
CREATE OR REPLACE TRIGGER trigger_update_client_invites_updated_at
  BEFORE UPDATE ON public.client_invites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.notifications;

-- Function to create notifications automatically
CREATE OR REPLACE FUNCTION public.create_notification(
  p_message TEXT,
  p_type TEXT,
  p_related_id TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (message, type, related_id, user_id)
  VALUES (p_message, p_type, p_related_id, COALESCE(p_user_id, auth.uid()))
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$function$;
