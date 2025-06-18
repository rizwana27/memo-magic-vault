
-- Create purchase_orders table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  po_number VARCHAR NOT NULL UNIQUE,
  vendor_id VARCHAR REFERENCES public.vendors(vendor_id),
  project_id VARCHAR REFERENCES public.projects(project_id),
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  delivery_date DATE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'closed')),
  total_amount NUMERIC(12,2) DEFAULT 0,
  line_items JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number VARCHAR NOT NULL UNIQUE,
  project_id VARCHAR REFERENCES public.projects(project_id),
  client_id VARCHAR REFERENCES public.clients(client_id),
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  billing_type TEXT NOT NULL CHECK (billing_type IN ('milestone', 'time-material')),
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 0,
  tax_amount NUMERIC(12,2) DEFAULT 0,
  discount_rate NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  items JSONB,
  notes TEXT,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Add RLS policies for purchase_orders
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all purchase orders" ON public.purchase_orders
  FOR SELECT USING (true);

CREATE POLICY "Users can create purchase orders" ON public.purchase_orders
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update purchase orders" ON public.purchase_orders
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Add RLS policies for invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all invoices" ON public.invoices
  FOR SELECT USING (true);

CREATE POLICY "Users can create invoices" ON public.invoices
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update invoices" ON public.invoices
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Add triggers for auto-generating PO and Invoice numbers
CREATE OR REPLACE FUNCTION public.generate_purchase_order_id()
RETURNS character varying
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN 'PO-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(po_number FROM 'PO-\d{4}-(\d+)') AS INTEGER)), 0) + 1 FROM public.purchase_orders WHERE po_number ~ '^PO-\d{4}-\d+$')::TEXT, 4, '0');
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_invoice_id()
RETURNS character varying
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN 'INV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'INV-\d{4}-(\d+)') AS INTEGER)), 0) + 1 FROM public.invoices WHERE invoice_number ~ '^INV-\d{4}-\d+$')::TEXT, 4, '0');
END;
$function$;

-- Create triggers for auto-generation
CREATE OR REPLACE FUNCTION public.auto_generate_po_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.po_number IS NULL OR NEW.po_number = '' THEN
    NEW.po_number := generate_purchase_order_id();
  END IF;
  NEW.created_by := auth.uid();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_generate_invoice_number()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_invoice_id();
  END IF;
  NEW.created_by := auth.uid();
  RETURN NEW;
END;
$function$;

-- Add update triggers
CREATE OR REPLACE TRIGGER trigger_auto_generate_po_number
  BEFORE INSERT ON public.purchase_orders
  FOR EACH ROW EXECUTE FUNCTION auto_generate_po_number();

CREATE OR REPLACE TRIGGER trigger_auto_generate_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION auto_generate_invoice_number();

CREATE OR REPLACE TRIGGER trigger_update_po_updated_at
  BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trigger_update_invoice_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
