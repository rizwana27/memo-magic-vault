import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const assistantId = Deno.env.get('OPENAI_ASSISTANT_ID');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function validateSQL(sql: string): boolean {
  console.log('=== SQL VALIDATION START ===');
  console.log('Original SQL:', sql);
  
  const sqlTrimmed = sql.trim();
  const sqlLower = sqlTrimmed.toLowerCase();
  
  // Remove trailing semicolon if present
  const cleanSQL = sqlTrimmed.replace(/;+$/, '');
  const cleanSQLLower = cleanSQL.toLowerCase();
  
  console.log('Clean SQL (no semicolon):', cleanSQL);
  
  // Must start with SELECT
  if (!cleanSQLLower.startsWith('select')) {
    console.log('SQL validation failed: Does not start with SELECT');
    return false;
  }
  
  // Forbidden keywords check
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
    if (pattern.test(cleanSQL)) {
      console.log(`SQL validation failed: Contains forbidden pattern: ${pattern}`);
      return false;
    }
  }
  
  console.log('SQL validation passed');
  return true;
}

async function executeSQL(sql: string) {
  console.log('=== SQL EXECUTION START ===');
  console.log('Generated SQL:', sql);
  
  try {
    const cleanSQL = sql.trim().replace(/;+$/, '');
    console.log('Clean SQL for execution:', cleanSQL);
    
    const { data, error } = await supabase.rpc('execute_sql', { query: cleanSQL });
    
    if (error) {
      console.error('=== DATABASE ERROR ===');
      console.error('Error details:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('=== SQL EXECUTION SUCCESS ===');
    console.log('Result length:', Array.isArray(data) ? data.length : 'Not an array');
    
    return data || [];
  } catch (err) {
    console.error('=== SQL EXECUTION FAILED ===');
    console.error('Error details:', err);
    throw err;
  }
}

async function waitForRunCompletion(threadId: string, runId: string): Promise<any> {
  const maxWaitTime = 30000; // 30 seconds
  const pollInterval = 1000; // 1 second
  let elapsed = 0;

  while (elapsed < maxWaitTime) {
    try {
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!runResponse.ok) {
        const errorText = await runResponse.text();
        console.error('=== RUN STATUS CHECK FAILED ===');
        console.error('Status:', runResponse.status);
        console.error('Status Text:', runResponse.statusText);
        console.error('Error Response:', errorText);
        throw new Error(`Run status check failed: ${runResponse.status} - ${errorText}`);
      }

      const run = await runResponse.json();
      console.log('=== RUN STATUS UPDATE ===');
      console.log('Run ID:', run.id);
      console.log('Run status:', run.status);
      console.log('Run created_at:', run.created_at);
      
      if (run.last_error) {
        console.log('Run last_error:', JSON.stringify(run.last_error, null, 2));
      }

      if (run.status === 'completed') {
        console.log('=== RUN COMPLETED SUCCESSFULLY ===');
        return run;
      } else if (run.status === 'failed' || run.status === 'expired' || run.status === 'cancelled') {
        console.error('=== RUN FAILED ===');
        console.error('Run status:', run.status);
        console.error('Run error details:', JSON.stringify(run.last_error, null, 2));
        
        // Return specific error messages based on the failure
        let errorMessage = `Assistant run ${run.status}`;
        if (run.last_error) {
          if (run.last_error.code === 'rate_limit_exceeded') {
            errorMessage = 'OpenAI API quota exceeded. Please check your billing and usage limits.';
          } else if (run.last_error.code === 'invalid_request_error') {
            errorMessage = `Invalid request: ${run.last_error.message}`;
          } else {
            errorMessage = `${run.last_error.code}: ${run.last_error.message}`;
          }
        }
        throw new Error(errorMessage);
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      elapsed += pollInterval;
    } catch (error) {
      console.error('=== ERROR CHECKING RUN STATUS ===');
      console.error('Error details:', error);
      throw error;
    }
  }

  throw new Error('Assistant run timed out after 30 seconds');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('=== AI COPILOT REQUEST START ===');
  console.log('Timestamp:', new Date().toISOString());

  try {
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('=== JSON PARSE ERROR ===');
      console.error('Parse error:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        details: parseError.message,
        sql: null,
        data: [],
        rowCount: 0
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { prompt } = requestBody;
    
    console.log('=== REQUEST VALIDATION ===');
    console.log('Received prompt:', prompt);
    console.log('Prompt type:', typeof prompt);
    console.log('Prompt length:', prompt?.length);

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      console.error('=== INVALID PROMPT ===');
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

    console.log('=== ENVIRONMENT CHECK ===');
    console.log('OpenAI API Key present:', !!openAIApiKey);
    console.log('OpenAI API Key prefix:', openAIApiKey?.substring(0, 10) + '...');
    console.log('Assistant ID present:', !!assistantId);
    console.log('Assistant ID:', assistantId);

    if (!openAIApiKey) {
      console.error('=== MISSING OPENAI API KEY ===');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.',
        sql: null,
        data: [],
        rowCount: 0
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!assistantId) {
      console.error('=== MISSING ASSISTANT ID ===');
      return new Response(JSON.stringify({ 
        error: 'Assistant ID not configured. Please add OPENAI_ASSISTANT_ID to your environment variables.',
        sql: null,
        data: [],
        rowCount: 0
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('=== CREATING THREAD ===');
    
    // Step 1: Create a thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({})
    });

    if (!threadResponse.ok) {
      const errorText = await threadResponse.text();
      console.error('=== THREAD CREATION FAILED ===');
      console.error('Status:', threadResponse.status);
      console.error('Status Text:', threadResponse.statusText);
      console.error('Error Response:', errorText);
      
      // Parse potential JSON error
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.error?.message || errorText;
      } catch (e) {
        // Keep original text if not JSON
      }
      
      return new Response(JSON.stringify({ 
        error: `Failed to create OpenAI thread: ${errorDetails}`,
        sql: null,
        data: [],
        rowCount: 0
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const thread = await threadResponse.json();
    const threadId = thread.id;
    console.log('=== THREAD CREATED ===');
    console.log('Thread ID:', threadId);

    console.log('=== ADDING MESSAGE TO THREAD ===');
    
    // Step 2: Add message to thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: prompt.trim()
      })
    });

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      console.error('=== MESSAGE CREATION FAILED ===');
      console.error('Status:', messageResponse.status);
      console.error('Status Text:', messageResponse.statusText);
      console.error('Error Response:', errorText);
      
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.error?.message || errorText;
      } catch (e) {
        // Keep original text if not JSON
      }
      
      return new Response(JSON.stringify({ 
        error: `Failed to add message to thread: ${errorDetails}`,
        sql: null,
        data: [],
        rowCount: 0
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('=== MESSAGE ADDED TO THREAD ===');

    console.log('=== RUNNING ASSISTANT ===');
    
    // Step 3: Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error('=== RUN CREATION FAILED ===');
      console.error('Status:', runResponse.status);
      console.error('Status Text:', runResponse.statusText);
      console.error('Error Response:', errorText);
      
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.error?.message || errorText;
      } catch (e) {
        // Keep original text if not JSON
      }
      
      return new Response(JSON.stringify({ 
        error: `Failed to run assistant: ${errorDetails}`,
        sql: null,
        data: [],
        rowCount: 0
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const run = await runResponse.json();
    console.log('=== RUN STARTED ===');
    console.log('Run ID:', run.id);
    console.log('Run status:', run.status);

    console.log('=== WAITING FOR COMPLETION ===');
    
    // Step 4: Wait for completion
    await waitForRunCompletion(threadId, run.id);

    console.log('=== RETRIEVING MESSAGES ===');
    
    // Step 5: Get the assistant's response
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    if (!messagesResponse.ok) {
      const errorText = await messagesResponse.text();
      console.error('=== MESSAGES RETRIEVAL FAILED ===');
      console.error('Status:', messagesResponse.status);
      console.error('Status Text:', messagesResponse.statusText);
      console.error('Error Response:', errorText);
      
      return new Response(JSON.stringify({ 
        error: `Failed to retrieve messages: ${errorText}`,
        sql: null,
        data: [],
        rowCount: 0
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const messages = await messagesResponse.json();
    const assistantMessages = messages.data.filter((msg: any) => msg.role === 'assistant');
    
    if (assistantMessages.length === 0) {
      console.error('=== NO ASSISTANT RESPONSE FOUND ===');
      console.log('All messages:', JSON.stringify(messages.data, null, 2));
      return new Response(JSON.stringify({ 
        error: 'No assistant response found in thread',
        sql: null,
        data: [],
        rowCount: 0
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const latestMessage = assistantMessages[0];
    const responseContent = latestMessage.content[0]?.text?.value || '';
    
    console.log('=== ASSISTANT RESPONSE ===');
    console.log('Response content:', responseContent);
    console.log('Response length:', responseContent.length);

    // Try to extract SQL from the response
    const sqlMatch = responseContent.match(/```sql\n([\s\S]*?)\n```/) || 
                     responseContent.match(/```\n(SELECT[\s\S]*?)\n```/) ||
                     responseContent.match(/(SELECT[\s\S]*?)(?:\n|$)/i);
    
    if (sqlMatch) {
      const extractedSQL = sqlMatch[1].trim();
      console.log('=== EXTRACTED SQL ===');
      console.log('SQL:', extractedSQL);

      // Validate the extracted SQL
      if (!validateSQL(extractedSQL)) {
        console.error('=== SQL VALIDATION FAILED ===');
        return new Response(JSON.stringify({ 
          error: 'The generated query contains forbidden operations. Please try rephrasing your question.',
          sql: extractedSQL,
          data: [],
          rowCount: 0
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Execute the SQL query
      try {
        const queryResults = await executeSQL(extractedSQL);

        console.log('=== SUCCESS ===');
        console.log('Query completed successfully, returning results');
        
        return new Response(JSON.stringify({ 
          sql: extractedSQL,
          data: queryResults,
          rowCount: Array.isArray(queryResults) ? queryResults.length : 0,
          error: null
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (sqlError) {
        console.error('=== SQL EXECUTION ERROR ===');
        console.error('Error details:', sqlError);
        return new Response(JSON.stringify({ 
          error: `Database query failed: ${sqlError.message}`,
          sql: extractedSQL,
          data: [],
          rowCount: 0
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      // If no SQL found, return the assistant's text response
      console.log('=== NO SQL FOUND ===');
      console.log('Returning text response');
      
      return new Response(JSON.stringify({ 
        sql: null,
        data: [],
        rowCount: 0,
        message: responseContent,
        error: null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('=== GENERAL ERROR ===');
    console.error('Error in ai-data-copilot function:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Return the actual error message instead of a generic one
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    return new Response(JSON.stringify({ 
      error: `OpenAI Assistant Error: ${errorMessage}`,
      details: error instanceof Error ? error.stack : 'No additional details',
      sql: null,
      data: [],
      rowCount: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
