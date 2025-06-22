
-- Create webhook_logs table for storing incoming webhook data
CREATE TABLE public.webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'unknown',
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for webhook_logs
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all webhook logs
CREATE POLICY "Admins can view all webhook logs" 
  ON public.webhook_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policy for inserting webhook logs (for the edge function)
CREATE POLICY "Allow webhook insertion" 
  ON public.webhook_logs 
  FOR INSERT 
  WITH CHECK (true);
