export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL");

  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    throw new Error("RESEND_API_KEY or RESEND_FROM_EMAIL not configured");
  }

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
    throw new Error(`Resend error ${res.status}: ${errorBody}`);
  }
}
