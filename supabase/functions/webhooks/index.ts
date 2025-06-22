
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from "../_shared/supabase.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WebhookPayload {
  source: string;
  event_type: string;
  data: any;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const source = url.pathname.split('/').pop(); // Extract source from URL
    
    if (!source) {
      return new Response(
        JSON.stringify({ error: "Source parameter is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const payload = await req.json();
    console.log(`Received webhook from ${source}:`, payload);

    // Store the webhook payload in the database
    const { data, error } = await supabase
      .from('webhook_logs')
      .insert([{
        source: source,
        event_type: payload.event_type || 'unknown',
        payload: payload,
        processed: false,
        received_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error storing webhook:', error);
      return new Response(
        JSON.stringify({ error: "Failed to store webhook" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Process specific webhook types
    await processWebhook(source, payload);

    return new Response(
      JSON.stringify({ success: true, message: "Webhook processed successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

async function processWebhook(source: string, payload: any) {
  switch (source.toLowerCase()) {
    case 'calendly':
      await processCalendlyWebhook(payload);
      break;
    case 'slack':
      await processSlackWebhook(payload);
      break;
    default:
      console.log(`No specific processor for source: ${source}`);
  }
}

async function processCalendlyWebhook(payload: any) {
  // Handle Calendly appointment bookings
  if (payload.event_type === 'invitee.created') {
    const appointmentData = {
      client_name: payload.payload?.invitee?.name || 'Unknown',
      client_email: payload.payload?.invitee?.email || '',
      appointment_time: payload.payload?.event?.start_time || new Date().toISOString(),
      source: 'calendly',
      status: 'scheduled'
    };

    // Create a notification for the appointment
    await supabase.rpc('create_notification', {
      p_message: `New Calendly appointment scheduled with ${appointmentData.client_name}`,
      p_type: 'appointment',
      p_related_id: null
    });
  }
}

async function processSlackWebhook(payload: any) {
  // Handle Slack events
  console.log('Processing Slack webhook:', payload);
  
  // You can add specific Slack event handling here
  if (payload.event?.type === 'message') {
    await supabase.rpc('create_notification', {
      p_message: `New Slack message received`,
      p_type: 'slack',
      p_related_id: null
    });
  }
}

serve(handler);
