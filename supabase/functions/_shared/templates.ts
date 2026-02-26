// Single source of truth: content.json
// Edge Functions can't import from the frontend src/ directory.

import content from "./content.json" with { type: "json" };

type ProfileAnswer = "podatkovni" | "produktni" | "performance" | "ne_vem";
type EmailType = "immediate" | "results" | "reminder";

interface EmailTemplate {
  subject: string;
  html: (vars: Record<string, string>) => string;
}

function emailShell(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:sans-serif;margin:0;padding:20px;background:#f9fafb;"><div style="max-width:560px;margin:0 auto;background:#fff;padding:32px;border-radius:12px;">${body}</div></body></html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Keys that already contain safe HTML (built server-side, not from user input)
const RAW_KEYS = new Set(["resultsHtml", "mailtoLink"]);

function renderBody(body: string, vars: Record<string, string>): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = vars[key] ?? "";
    return RAW_KEYS.has(key) ? val : escapeHtml(val);
  });
}

const profileLabels: Record<ProfileAnswer, string> = Object.fromEntries(
  Object.entries(content.profiles).map(([k, v]) => [k, v.label])
) as Record<ProfileAnswer, string>;

export function getProfileLabel(answer: string): string {
  return profileLabels[answer as ProfileAnswer] ?? answer;
}

export function buildMailtoLink(profileLabel: string): string {
  const subject = encodeURIComponent(`Moj rezultat izziva: ${profileLabel}`);
  const body = encodeURIComponent(
    `Pozdravljeni!\n\nTukaj delim rezultat mojega mini izziva (${profileLabel}):\n\n[Opišite vaše rezultate tukaj]\n\nLep pozdrav`
  );
  return `mailto:${content.mailtoTarget}?subject=${subject}&body=${body}`;
}

function getTemplate(answer: string, type: EmailType): EmailTemplate {
  const entry =
    content.emails[answer as ProfileAnswer]?.[type];
  if (!entry) throw new Error(`Unknown template: ${answer}/${type}`);
  return {
    subject: entry.subject,
    html: (vars) => emailShell(renderBody(entry.body, vars)),
  };
}

export function getImmediateTemplate(answer: string): EmailTemplate {
  return getTemplate(answer, "immediate");
}

export function getResultsTemplate(answer: string): EmailTemplate {
  return getTemplate(answer, "results");
}

export function getReminderTemplate(answer: string): EmailTemplate {
  return getTemplate(answer, "reminder");
}
