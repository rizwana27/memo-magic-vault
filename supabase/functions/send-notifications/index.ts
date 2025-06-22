
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { supabase } from "../_shared/supabase.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'task_assignment' | 'timesheet_approval' | 'invoice_sent' | 'project_update';
  recipient_email: string;
  recipient_name?: string;
  data: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, recipient_email, recipient_name, data }: NotificationRequest = await req.json();

    console.log(`Sending ${type} notification to ${recipient_email}`);

    const emailContent = generateEmailContent(type, data, recipient_name);

    const emailResponse = await resend.emails.send({
      from: "PSA Platform <noreply@resend.dev>",
      to: [recipient_email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log the notification in the database
    await supabase
      .from('notification_logs')
      .insert([{
        type: type,
        recipient_email: recipient_email,
        subject: emailContent.subject,
        status: 'sent',
        sent_at: new Date().toISOString()
      }]);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

function generateEmailContent(type: string, data: any, recipientName?: string) {
  const name = recipientName || 'Team Member';
  
  switch (type) {
    case 'task_assignment':
      return {
        subject: `New Task Assigned: ${data.task_title}`,
        html: `
          <h2>Hi ${name},</h2>
          <p>You have been assigned a new task:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <h3>${data.task_title}</h3>
            <p><strong>Project:</strong> ${data.project_name}</p>
            <p><strong>Due Date:</strong> ${data.due_date}</p>
            <p><strong>Priority:</strong> ${data.priority}</p>
            <p><strong>Description:</strong> ${data.description}</p>
          </div>
          <p>Please log in to the PSA platform to view more details and update your progress.</p>
          <p>Best regards,<br>PSA Platform Team</p>
        `
      };
    
    case 'timesheet_approval':
      return {
        subject: `Timesheet ${data.status}: ${data.period}`,
        html: `
          <h2>Hi ${name},</h2>
          <p>Your timesheet for ${data.period} has been <strong>${data.status}</strong>.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <p><strong>Total Hours:</strong> ${data.total_hours}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            ${data.comments ? `<p><strong>Comments:</strong> ${data.comments}</p>` : ''}
          </div>
          <p>Please log in to the PSA platform to view details.</p>
          <p>Best regards,<br>PSA Platform Team</p>
        `
      };
    
    case 'invoice_sent':
      return {
        subject: `Invoice ${data.invoice_number} - ${data.client_name}`,
        html: `
          <h2>Hi ${name},</h2>
          <p>Invoice ${data.invoice_number} has been sent to ${data.client_name}.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <p><strong>Invoice Number:</strong> ${data.invoice_number}</p>
            <p><strong>Client:</strong> ${data.client_name}</p>
            <p><strong>Amount:</strong> $${data.amount}</p>
            <p><strong>Due Date:</strong> ${data.due_date}</p>
          </div>
          <p>Best regards,<br>PSA Platform Team</p>
        `
      };
    
    case 'project_update':
      return {
        subject: `Project Update: ${data.project_name}`,
        html: `
          <h2>Hi ${name},</h2>
          <p>There's an update on project "${data.project_name}":</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <p><strong>Update:</strong> ${data.update_message}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Updated by:</strong> ${data.updated_by}</p>
          </div>
          <p>Please log in to the PSA platform to view more details.</p>
          <p>Best regards,<br>PSA Platform Team</p>
        `
      };
    
    default:
      return {
        subject: 'PSA Platform Notification',
        html: `
          <h2>Hi ${name},</h2>
          <p>You have a new notification from the PSA Platform.</p>
          <p>Please log in to view more details.</p>
          <p>Best regards,<br>PSA Platform Team</p>
        `
      };
  }
}

serve(handler);
