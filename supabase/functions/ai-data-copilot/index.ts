
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PSA_SCHEMA = `
Database Schema for PSA Platform:

Tables:
- clients (client_id, client_name, company_name, primary_contact_name, primary_contact_email, phone_number, industry, revenue_tier, client_type, notes, created_at)
- projects (project_id, project_name, client_id, project_manager, status, budget, start_date, end_date, description, created_at)
- resources (resource_id, full_name, email_address, phone_number, role, department, skills, availability, active_status, join_date, created_at)
- timesheets (timesheet_id, project_id, created_by, date, start_time, end_time, hours, billable, task, notes, created_at)
- vendors (vendor_id, vendor_name, contact_person, contact_email, phone_number, services_offered, status, contract_start_date, contract_end_date, notes, created_at)
- invoices (invoice_number, project_id, client_id, invoice_date, due_date, total_amount, status, billing_type, notes, created_at)

Important notes:
- Use proper JOIN statements when querying across tables
- timesheets.created_by references resources.resource_id
- All queries must be SELECT only
- Use proper date formatting and time calculations
- Filter by active_status = true for resources when relevant
`;

function validateSQL(sql: string): boolean {
  const sqlLower = sql.toLowerCase().trim();
  
  // Must start with SELECT
  if (!sqlLower.startsWith('select')) {
    return false;
  }
  
  // Forbidden keywords
  const forbidden = ['insert', 'update', 'delete', 'drop', 'create', 'alter', 'truncate', 'grant', 'revoke', 'exec', 'execute'];
  for (const keyword of forbidden) {
    if (sqlLower.includes(keyword)) {
      return false;
    }
  }
  
  return true;
}

async function executeSQL(sql: string) {
  console.log('Executing SQL:', sql);
  
  try {
    // Execute the query directly using the Supabase client
    const { data, error } = await supabase.rpc('execute_sql', { query: sql });
    
    if (error) {
      console.error('Database error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('Query executed successfully, rows returned:', data?.length || 0);
    return data || [];
  } catch (err) {
    console.error('SQL execution failed:', err);
    throw err;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    console.log('Received prompt:', prompt);

    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt is required and must be a string');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Generate SQL using OpenAI
    console.log('Generating SQL with OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert SQL analyst for a Professional Services Automation (PSA) platform. Your job is to convert natural language queries into PostgreSQL SELECT statements.

${PSA_SCHEMA}

Rules:
1. ONLY generate SELECT statements
2. Use proper JOINs when accessing multiple tables
3. Use descriptive column aliases for better readability
4. Include proper WHERE clauses for filtering
5. Use ORDER BY for logical sorting
6. Limit results to reasonable amounts (use LIMIT when appropriate)
7. Handle date/time calculations properly
8. Return only the SQL query, no explanations or markdown formatting
9. For resource queries, consider filtering by active_status = true unless specifically asked for inactive resources`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const generatedSQL = aiData.choices[0].message.content.trim();
    
    console.log('Generated SQL:', generatedSQL);

    // Validate the SQL
    if (!validateSQL(generatedSQL)) {
      console.error('Generated SQL failed validation');
      throw new Error('Generated query contains forbidden operations or invalid syntax');
    }

    // Execute the SQL query
    const queryResults = await executeSQL(generatedSQL);

    console.log('Query completed successfully');
    return new Response(JSON.stringify({ 
      sql: generatedSQL,
      data: queryResults,
      rowCount: queryResults.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-data-copilot function:', error);
    
    // Return a proper error response
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred',
      sql: null,
      data: [],
      rowCount: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
