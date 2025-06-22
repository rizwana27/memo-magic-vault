
-- Add external_source and external_id columns to clients table
ALTER TABLE public.clients 
ADD COLUMN external_source text,
ADD COLUMN external_id text;

-- Add external_source and external_id columns to vendors table  
ALTER TABLE public.vendors
ADD COLUMN external_source text,
ADD COLUMN external_id text;

-- Add unique constraint to prevent duplicate imports
ALTER TABLE public.clients 
ADD CONSTRAINT unique_external_client 
UNIQUE (external_source, external_id) 
DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE public.vendors
ADD CONSTRAINT unique_external_vendor 
UNIQUE (external_source, external_id) 
DEFERRABLE INITIALLY DEFERRED;
