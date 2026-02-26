const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

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

  console.log("[resend] Sending to:", to, "| Subject:", subject);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
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

    if (res.ok) {
      console.log("[resend] Email sent successfully");
      return;
    }

    const errorBody = await res.text();

    // Don't retry client errors (4xx) except rate limits (429)
    if (res.status >= 400 && res.status < 500 && res.status !== 429) {
      console.error("[resend] Client error (no retry):", res.status, errorBody);
      throw new Error(`Resend error ${res.status}: ${errorBody}`);
    }

    // Retry on 429 or 5xx
    if (attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.warn(`[resend] Attempt ${attempt} failed (${res.status}), retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    } else {
      console.error(`[resend] All ${MAX_RETRIES} attempts failed:`, res.status, errorBody);
      throw new Error(`Resend error ${res.status} after ${MAX_RETRIES} retries: ${errorBody}`);
    }
  }
}
