
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
    console.log('SQL validation failed: Does not start with SELECT');
    return false;
  }
  
  // Improved forbidden keywords check - be more specific to avoid false positives
  const forbiddenPatterns = [
    /\binsert\s+into\b/i,
    /\bupdate\s+\w+\s+set\b/i,
    /\bdelete\s+from\b/i,
    /\bdrop\s+(table|database|schema|function)\b/i,
    /\bcreate\s+(table|database|schema|function)\b/i,
    /\balter\s+(table|database|schema)\b/i,
    /\btruncate\s+table\b/i,
    /\bgrant\s+\w+\b/i,
    /\brevoke\s+\w+\b/i,
    /\bexec\s*\(/i,
    /\bcall\s+\w+\b/i,
    /\bdo\s+\$\$/i
  ];
  
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(sql)) {
      console.log(`SQL validation failed: Contains forbidden pattern: ${pattern}`);
      return false;
    }
  }
  
  return true;
}

async function executeSQL(sql: string) {
  console.log('=== SQL EXECUTION START ===');
  console.log('Generated SQL:', sql);
  console.log('SQL Length:', sql.length);
  
  try {
    // Execute the query using the database function
    const { data, error } = await supabase.rpc('execute_sql', { query: sql });
    
    if (error) {
      console.error('=== DATABASE ERROR ===');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('=== SQL EXECUTION SUCCESS ===');
    console.log('Result type:', typeof data);
    console.log('Result length:', Array.isArray(data) ? data.length : 'Not an array');
    console.log('Sample result:', JSON.stringify(data).substring(0, 200));
    
    return data || [];
  } catch (err) {
    console.error('=== SQL EXECUTION FAILED ===');
    console.error('Error details:', err);
    throw err;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('=== AI COPILOT REQUEST START ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);

  try {
    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        sql: null,
        data: [],
        rowCount: 0
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { prompt } = requestBody;
    
    console.log('Received prompt:', prompt);
    console.log('Prompt type:', typeof prompt);
    console.log('Prompt length:', prompt?.length || 0);

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      console.error('Invalid prompt received');
      return new Response(JSON.stringify({ 
        error: 'Prompt is required and must be a non-empty string',
        sql: null,
        data: [],
        rowCount: 0
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate OpenAI API key
    if (!openAIApiKey) {
      console.error('OpenAI API key is not configured');
      return new Response(JSON.stringify({ 
        error: 'AI service is not properly configured. Please contact support.',
        sql: null,
        data: [],
        rowCount: 0
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate SQL using OpenAI
    console.log('=== OPENAI REQUEST START ===');
    let aiResponse;
    try {
      aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
9. For resource queries, consider filtering by active_status = true unless specifically asked for inactive resources
10. Use CURRENT_DATE for date comparisons
11. When referencing time periods like "last week", use proper date arithmetic`
            },
            {
              role: 'user',
              content: prompt.trim()
            }
          ],
          temperature: 0.1,
          max_tokens: 1000,
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('OpenAI API error:', aiResponse.status, errorText);
        throw new Error(`OpenAI API error: ${aiResponse.status} - ${errorText}`);
      }

      const aiData = await aiResponse.json();
      console.log('OpenAI response received successfully');
      
      if (!aiData.choices || !aiData.choices[0] || !aiData.choices[0].message) {
        throw new Error('Invalid response structure from OpenAI');
      }

      const generatedSQL = aiData.choices[0].message.content.trim();
      console.log('=== GENERATED SQL ===');
      console.log(generatedSQL);

      // Validate the generated SQL
      if (!validateSQL(generatedSQL)) {
        console.error('Generated SQL failed validation');
        return new Response(JSON.stringify({ 
          error: 'The generated query contains forbidden operations or invalid syntax. Please try rephrasing your question.',
          sql: generatedSQL,
          data: [],
          rowCount: 0
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Execute the SQL query
      const queryResults = await executeSQL(generatedSQL);

      console.log('=== SUCCESS ===');
      console.log('Query completed successfully, returning results');
      
      return new Response(JSON.stringify({ 
        sql: generatedSQL,
        data: queryResults,
        rowCount: Array.isArray(queryResults) ? queryResults.length : 0,
        error: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (aiError) {
      console.error('=== OPENAI ERROR ===');
      console.error('AI request failed:', aiError);
      
      return new Response(JSON.stringify({ 
        error: 'Failed to generate SQL query. Please try rephrasing your question.',
        sql: null,
        data: [],
        rowCount: 0
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('=== GENERAL ERROR ===');
    console.error('Error in ai-data-copilot function:', error);
    console.error('Error stack:', error.stack);
    
    // Return a proper error response with detailed logging
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return new Response(JSON.stringify({ 
      error: `Something went wrong: ${errorMessage}. Please try rephrasing your question or contact support.`,
      sql: null,
      data: [],
      rowCount: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
