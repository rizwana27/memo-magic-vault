
-- Create a function to safely execute SELECT queries for AI Data Copilot
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
    
    -- Check for forbidden keywords
    IF query_lower ~ '\b(insert|update|delete|drop|create|alter|truncate|grant|revoke|exec|execute)\b' THEN
        RAISE EXCEPTION 'Query contains forbidden operations';
    END IF;
    
    -- Execute the query and return as JSONB
    EXECUTE 'SELECT array_to_json(array_agg(row_to_json(t))) FROM (' || query || ') t' INTO temp_result;
    
    -- Convert to JSONB, handle null case
    IF temp_result IS NULL THEN
        result_json := '[]'::JSONB;
    ELSE
        result_json := temp_result::JSONB;
    END IF;
    
    RETURN result_json;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO authenticated;
