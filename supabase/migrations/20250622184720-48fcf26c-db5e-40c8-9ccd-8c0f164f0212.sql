
-- First, let's ensure the execute_sql function exists and has proper permissions
-- Drop any existing version to avoid conflicts
DROP FUNCTION IF EXISTS public.execute_sql(TEXT);

-- Create the execute_sql function with enhanced security and error handling
CREATE OR REPLACE FUNCTION public.execute_sql(query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    query_lower TEXT;
    result_json JSONB;
    temp_result TEXT;
BEGIN
    -- Convert query to lowercase for validation
    query_lower := LOWER(TRIM(query));
    
    -- Validate that it's a SELECT query
    IF NOT query_lower LIKE 'select%' THEN
        RAISE EXCEPTION 'Only SELECT queries are allowed. Query must start with SELECT.';
    END IF;
    
    -- Check for forbidden keywords (be more specific to avoid false positives)
    IF query_lower ~ '\b(insert\s|update\s|delete\s|drop\s|create\s|alter\s|truncate\s|grant\s|revoke\s|exec\s|execute\s(?!.*interval)|call\s|do\s)\b' THEN
        RAISE EXCEPTION 'Query contains forbidden operations. Only SELECT statements are allowed.';
    END IF;
    
    -- Execute the query and return as JSONB
    BEGIN
        EXECUTE 'SELECT array_to_json(array_agg(row_to_json(t))) FROM (' || query || ') t' INTO temp_result;
        
        -- Convert to JSONB, handle null case
        IF temp_result IS NULL THEN
            result_json := '[]'::JSONB;
        ELSE
            result_json := temp_result::JSONB;
        END IF;
        
        RETURN result_json;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Query execution failed: %', SQLERRM;
    END;
END;
$$;

-- Grant execute permissions to all relevant roles
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO anon;

-- Verify the function was created successfully
SELECT proname, prosrc FROM pg_proc WHERE proname = 'execute_sql';
