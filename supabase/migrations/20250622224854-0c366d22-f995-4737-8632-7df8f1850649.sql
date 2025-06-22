
-- Add external_id and external_source columns to projects table
ALTER TABLE public.projects 
ADD COLUMN external_id TEXT,
ADD COLUMN external_source TEXT;

-- Add a unique constraint to prevent duplicate imports from the same external source
CREATE UNIQUE INDEX projects_external_unique 
ON public.projects (external_source, external_id) 
WHERE external_source IS NOT NULL AND external_id IS NOT NULL;
