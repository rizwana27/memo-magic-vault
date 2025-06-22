
-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.execute_sql(TEXT);

-- Create the execute_sql function with proper permissions
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
        RAISE EXCEPTION 'Only SELECT queries are allowed';
    END IF;
    
    -- Check for forbidden keywords (more comprehensive list)
    IF query_lower ~ '\b(insert|update|delete|drop|create|alter|truncate|grant|revoke|exec|execute|call|do)\b' THEN
        RAISE EXCEPTION 'Query contains forbidden operations';
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

-- Grant execute permission to authenticated users and service role
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO service_role;

-- Also grant to anon for testing (can be removed if not needed)
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO anon;
