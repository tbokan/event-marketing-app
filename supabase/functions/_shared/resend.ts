export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL");

  console.log("[resend] API key present:", !!RESEND_API_KEY);
  console.log("[resend] From email:", RESEND_FROM_EMAIL ?? "NOT SET");

  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    throw new Error("RESEND_API_KEY or RESEND_FROM_EMAIL not configured");
  }

  console.log("[resend] Sending to:", to, "| Subject:", subject);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("[resend] API error:", res.status, errorBody);
    throw new Error(`Resend error ${res.status}: ${errorBody}`);
  }

  console.log("[resend] Email sent successfully, status:", res.status);
}
