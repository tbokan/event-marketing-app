import type { ProfileAnswer } from "@/types";
import emailContent from "../../supabase/functions/_shared/content.json";

// ---------------------------------------------------------------------------
// UI COPY
// ---------------------------------------------------------------------------
export const uiContent = {
  welcome: {
    title: "Hvala za sodelovanje",
    subtitle: "To pomeni, da nisi zaspal/a.",
    copy: "Podatke bomo uporabili izključno za demonstracijo in pošiljanje personaliziranega e-maila.",
    button: "Začni",
  },
  step1: {
    title: "Kako ti je ime?",
    nameLabel: "Ime",
    namePlaceholder: "Janez",
    lastnameLabel: "Priimek",
    lastnamePlaceholder: "Novak",
    nextButton: "Naprej",
  },
  step2: {
    title: "Tvoj e-poštni naslov",
    emailLabel: "E-pošta",
    emailPlaceholder: "janez@gmail.com",
    typoSuggestion: "Ali si mislil/a {suggestion}?",
    nextButton: "Naprej",
  },
  step3: {
    title: "Kateri tip marketinga te najbolj zanima?",
    nextButton: "Pokaži rezultate",
  },
  step4: {
    title: "Rezultati v živo",
    userMessage: 'Si v {percentage}%, ki so odgovorili "{answer}"',
  },
  closed: {
    title: "Prijave so zaprte",
    message: "Navadi se, da se svet hitro spreminja.",
  },
};

// ---------------------------------------------------------------------------
// PROFILE DEFINITIONS
// ---------------------------------------------------------------------------
export interface ProfileOption {
  id: ProfileAnswer;
  label: string;
  color: string;
}

export const profiles: ProfileOption[] = [
  {
    id: "podatkovni",
    label: emailContent.profiles.podatkovni.label,
    color: "hsl(var(--chart-1))",
  },
  {
    id: "produktni",
    label: emailContent.profiles.produktni.label,
    color: "hsl(var(--chart-2))",
  },
  {
    id: "performance",
    label: emailContent.profiles.performance.label,
    color: "hsl(var(--chart-3))",
  },
  {
    id: "ne_vem",
    label: emailContent.profiles.ne_vem.label,
    color: "hsl(var(--chart-4))",
  },
];

export function getProfileLabel(answer: string): string {
  return profiles.find((p) => p.id === answer)?.label ?? answer;
}

// ---------------------------------------------------------------------------
// MAILTO TARGET (D+7 reminder)
// ---------------------------------------------------------------------------
export const MAILTO_TARGET = emailContent.mailtoTarget;

// ---------------------------------------------------------------------------
// EMAIL TEMPLATES  (4 profiles × 3 types = 12)
// ---------------------------------------------------------------------------
export type EmailType = "immediate" | "results" | "reminder";

interface EmailTemplate {
  subject: string;
  html: (vars: Record<string, string>) => string;
}

function emailShell(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:sans-serif;margin:0;padding:20px;background:#f9fafb;"><div style="max-width:560px;margin:0 auto;background:#fff;padding:32px;border-radius:12px;">${body}</div></body></html>`;
}

function renderBody(body: string, vars: Record<string, string>): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

function buildTemplates(
  profile: keyof typeof emailContent.emails
): Record<EmailType, EmailTemplate> {
  const entry = emailContent.emails[profile];
  return {
    immediate: {
      subject: entry.immediate.subject,
      html: (vars) => emailShell(renderBody(entry.immediate.body, vars)),
    },
    results: {
      subject: entry.results.subject,
      html: (vars) => emailShell(renderBody(entry.results.body, vars)),
    },
    reminder: {
      subject: entry.reminder.subject,
      html: (vars) => emailShell(renderBody(entry.reminder.body, vars)),
    },
  };
}

export const emailTemplates: Record<
  ProfileAnswer,
  Record<EmailType, EmailTemplate>
> = {
  podatkovni: buildTemplates("podatkovni"),
  produktni: buildTemplates("produktni"),
  performance: buildTemplates("performance"),
  ne_vem: buildTemplates("ne_vem"),
};

// ---------------------------------------------------------------------------
// MAILTO BUILDER (for D+7 reminder)
// ---------------------------------------------------------------------------
export function buildMailtoLink(profileLabel: string): string {
  const subject = encodeURIComponent(
    `Moj rezultat izziva: ${profileLabel}`
  );
  const body = encodeURIComponent(
    `Pozdravljeni!\n\nTukaj delim rezultat mojega mini izziva (${profileLabel}):\n\n[Opišite vaše rezultate tukaj]\n\nLep pozdrav`
  );
  return `mailto:${MAILTO_TARGET}?subject=${subject}&body=${body}`;
}
