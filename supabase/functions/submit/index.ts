import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { sendEmail } from "../_shared/resend.ts";
import { getImmediateTemplate } from "../_shared/templates.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, lastname, email, answer } = await req.json();
    console.log("[submit] Received:", { name, lastname, email, answer });

    // 1. Deadline check (server-side)
    const deadline = Deno.env.get("SUBMISSION_DEADLINE");
    if (deadline && new Date() > new Date(deadline)) {
      console.log("[submit] Rejected: past deadline", deadline);
      return new Response(
        JSON.stringify({ error: "Prijave so zaprte." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Create Supabase admin client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 3. Insert submission (unique email constraint handles duplicates)
    console.log("[submit] Inserting into DB...");
    const { data, error } = await supabase
      .from("submissions")
      .insert({ name, lastname, email, answer })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        console.log("[submit] Duplicate email:", email);
        return new Response(
          JSON.stringify({
            error: "duplicate_email",
            message: "Podvojeni vnosi popačijo podatke.",
          }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      throw error;
    }
    console.log("[submit] DB insert OK, id:", data.id);

    // 4. Send immediate profile-specific email
    // Email failure should NOT fail the whole request (DB insert already succeeded)
    let emailSent = false;
    try {
      console.log("[submit] Building template for answer:", answer);
      const template = getImmediateTemplate(answer);
      console.log("[submit] Template subject:", template.subject);
      const html = template.html({ name });
      console.log("[submit] Sending email to:", email);
      await sendEmail(email, template.subject, html);
      emailSent = true;
      console.log("[submit] Email sent successfully");
    } catch (emailErr) {
      console.error("[submit] Email failed:", emailErr instanceof Error ? emailErr.message : emailErr);
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id, emailSent }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("[submit] Fatal error:", err instanceof Error ? err.message : err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
