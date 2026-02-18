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

    // 1. Deadline check (server-side)
    const deadline = Deno.env.get("SUBMISSION_DEADLINE");
    if (deadline && new Date() > new Date(deadline)) {
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
    const { data, error } = await supabase
      .from("submissions")
      .insert({ name, lastname, email, answer })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
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

    // 4. Send immediate profile-specific email
    const template = getImmediateTemplate(answer);
    await sendEmail(email, template.subject, template.html({ name }));

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
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
