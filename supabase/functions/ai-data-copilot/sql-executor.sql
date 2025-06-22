
-- Create a function to safely execute SELECT queries
CREATE OR REPLACE FUNCTION public.execute_sql(query TEXT)
RETURNS TABLE(result JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    query_lower TEXT;
    result_json JSONB;
BEGIN
    -- Convert query to lowercase for validation
    query_lower := LOWER(TRIM(query));
    
    -- Validate that it's a SELECT query
    IF NOT query_lower LIKE 'select%' THEN
        RAISE EXCEPTION 'Only SELECT queries are allowed';
    END IF;
    
    -- Check for forbidden keywords
    IF query_lower ~ '\b(insert|update|delete|drop|create|alter|truncate|grant|revoke)\b' THEN
        RAISE EXCEPTION 'Query contains forbidden operations';
    END IF;
    
    -- Execute the query and return as JSONB
    EXECUTE 'SELECT array_to_json(array_agg(row_to_json(t))) FROM (' || query || ') t' INTO result_json;
    
    -- If result is null, return empty array
    IF result_json IS NULL THEN
        result_json := '[]'::JSONB;
    END IF;
    
    RETURN QUERY SELECT result_json;
END;
$$;
