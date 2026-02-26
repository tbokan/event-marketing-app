import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { sendEmail } from "../_shared/resend.ts";
import {
  getReminderTemplate,
  getProfileLabel,
  buildMailtoLink,
} from "../_shared/templates.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Fetch only submissions that haven't received reminder yet
    const { data: submissions, error } = await supabase
      .from("submissions")
      .select("*")
      .is("reminder_email_sent_at", null);

    if (error) throw error;
    if (!submissions?.length) {
      return new Response(
        JSON.stringify({ message: "No pending submissions" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Send reminder to each pending submission
    let sent = 0;
    const failed: string[] = [];

    for (const sub of submissions) {
      const profileLabel = getProfileLabel(sub.answer);
      const mailtoLink = buildMailtoLink(profileLabel);
      const template = getReminderTemplate(sub.answer);

      try {
        await sendEmail(
          sub.email,
          template.subject,
          template.html({ name: sub.name, mailtoLink })
        );
        sent++;

        // Mark as sent
        await supabase
          .from("submissions")
          .update({ reminder_email_sent_at: new Date().toISOString() })
          .eq("id", sub.id);
      } catch (emailErr) {
        failed.push(sub.email);
        console.error(
          `Failed to send to ${sub.email}:`,
          emailErr instanceof Error ? emailErr.message : emailErr
        );
      }
      // Respect Resend rate limits
      if (sent % 8 === 0) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    return new Response(
      JSON.stringify({ sent, total: submissions.length, failed }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
