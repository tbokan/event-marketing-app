// Email templates duplicated from src/config/content.config.ts for Deno runtime.
// Edge Functions can't import from the frontend src/ directory.

type ProfileAnswer = "podatkovni" | "produktni" | "performance" | "ne_vem";
type EmailType = "immediate" | "results" | "reminder";

interface EmailTemplate {
  subject: string;
  html: (vars: Record<string, string>) => string;
}

const MAILTO_TARGET = "marketing@posta.si";

function emailShell(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:sans-serif;margin:0;padding:20px;background:#f9fafb;"><div style="max-width:560px;margin:0 auto;background:#fff;padding:32px;border-radius:12px;">${body}</div></body></html>`;
}

const profileLabels: Record<ProfileAnswer, string> = {
  podatkovni: "Podatkovni marketing",
  produktni: "Produktni marketing",
  performance: "Performance / oglaševalski marketing",
  ne_vem: "Še ne vem",
};

export function getProfileLabel(answer: string): string {
  return profileLabels[answer as ProfileAnswer] ?? answer;
}

export function buildMailtoLink(profileLabel: string): string {
  const subject = encodeURIComponent(`Moj rezultat izziva: ${profileLabel}`);
  const body = encodeURIComponent(
    `Pozdravljeni!\n\nTukaj delim rezultat mojega mini izziva (${profileLabel}):\n\n[Opišite vaše rezultate tukaj]\n\nLep pozdrav`
  );
  return `mailto:${MAILTO_TARGET}?subject=${subject}&body=${body}`;
}

export const emailTemplates: Record<
  ProfileAnswer,
  Record<EmailType, EmailTemplate>
> = {
  podatkovni: {
    immediate: {
      subject: "Tvoj marketinški profil: Podatkovni marketing",
      html: (vars) =>
        emailShell(`
        <h1 style="color:#3b82f6;">Pozdravljeni, ${vars.name}!</h1>
        <p>Vaš izbrani profil: <strong>Podatkovni marketing</strong></p>
        <p>Podatki so temelj vsake uspešne kampanje. Tukaj so naši predlogi:</p>
        <ul>
          <li>Nastavite UTM parametre za vsako kampanjo</li>
          <li>Preizkusite A/B testiranje naslovov</li>
          <li>Sledite konverzijam skozi celoten lijak</li>
        </ul>
        <p><strong>Mini izziv:</strong> Izberite eno metriko in jo izboljšajte za 10% ta teden.</p>
      `),
    },
    results: {
      subject: "Rezultati ankete so tu!",
      html: (vars) =>
        emailShell(`
        <h1>Rezultati so tu, ${vars.name}!</h1>
        <p>Hvala za sodelovanje na našem dogodku.</p>
        <p>Porazdelitev odgovorov:</p>
        <ul>${vars.resultsHtml}</ul>
        <p>Hvala, da ste del naše skupnosti!</p>
      `),
    },
    reminder: {
      subject: "Ste izvedli svoj mini izziv?",
      html: (vars) =>
        emailShell(`
        <h1>Spomin na vaš izziv, ${vars.name}!</h1>
        <p>Pred tednom dni ste prejeli mini izziv iz področja podatkovnega marketinga.</p>
        <p>Kako vam gre? Delite vaše rezultate z nami:</p>
        <p><a href="${vars.mailtoLink}" style="display:inline-block;padding:12px 24px;background:#3b82f6;color:#fff;border-radius:8px;text-decoration:none;">Pošlji odgovor</a></p>
      `),
    },
  },

  produktni: {
    immediate: {
      subject: "Tvoj marketinški profil: Produktni marketing",
      html: (vars) =>
        emailShell(`
        <h1 style="color:#22c55e;">Pozdravljeni, ${vars.name}!</h1>
        <p>Vaš izbrani profil: <strong>Produktni marketing</strong></p>
        <p>Produkt je vaš najboljši marketinški kanal! Predlogi za vas:</p>
        <ul>
          <li>Definirajte jasno vrednostno ponudbo za vsak segment</li>
          <li>Ustvarite primerjalno tabelo z glavnimi konkurenti</li>
          <li>Zgradite knjižnico uporabniških zgodb (case studies)</li>
        </ul>
        <p><strong>Mini izziv:</strong> Napišite en prepričljiv "elevator pitch" za vaš produkt v 30 sekundah.</p>
      `),
    },
    results: {
      subject: "Rezultati ankete so tu!",
      html: (vars) =>
        emailShell(`
        <h1>Rezultati so tu, ${vars.name}!</h1>
        <p>Hvala za sodelovanje na našem dogodku.</p>
        <ul>${vars.resultsHtml}</ul>
        <p>Hvala, da ste del naše skupnosti!</p>
      `),
    },
    reminder: {
      subject: "Ste napisali svoj elevator pitch?",
      html: (vars) =>
        emailShell(`
        <h1>Spomin na vaš izziv, ${vars.name}!</h1>
        <p>Pred tednom dni ste prejeli mini izziv iz področja produktnega marketinga.</p>
        <p><a href="${vars.mailtoLink}" style="display:inline-block;padding:12px 24px;background:#22c55e;color:#fff;border-radius:8px;text-decoration:none;">Pošlji odgovor</a></p>
      `),
    },
  },

  performance: {
    immediate: {
      subject: "Tvoj marketinški profil: Performance marketing",
      html: (vars) =>
        emailShell(`
        <h1 style="color:#f59e0b;">Pozdravljeni, ${vars.name}!</h1>
        <p>Vaš izbrani profil: <strong>Performance / oglaševalski marketing</strong></p>
        <p>Rezultati so vaše merilo uspeha! Predlogi:</p>
        <ul>
          <li>Optimizirajte pristajalne strani za konverzije</li>
          <li>Testirajte različne ciljne skupine in kreative</li>
          <li>Postavite dnevni proračun in spremljajte ROAS</li>
        </ul>
        <p><strong>Mini izziv:</strong> Ustvarite en oglas z dvema različnima naslovoma in primerjajte CTR.</p>
      `),
    },
    results: {
      subject: "Rezultati ankete so tu!",
      html: (vars) =>
        emailShell(`
        <h1>Rezultati so tu, ${vars.name}!</h1>
        <p>Hvala za sodelovanje.</p>
        <ul>${vars.resultsHtml}</ul>
        <p>Hvala, da ste del naše skupnosti!</p>
      `),
    },
    reminder: {
      subject: "Ste testirali svoj oglas?",
      html: (vars) =>
        emailShell(`
        <h1>Spomin na vaš izziv, ${vars.name}!</h1>
        <p>Pred tednom dni ste prejeli mini izziv iz področja performance marketinga.</p>
        <p><a href="${vars.mailtoLink}" style="display:inline-block;padding:12px 24px;background:#f59e0b;color:#fff;border-radius:8px;text-decoration:none;">Pošlji odgovor</a></p>
      `),
    },
  },

  ne_vem: {
    immediate: {
      subject: "Dobrodošli v svetu marketinga!",
      html: (vars) =>
        emailShell(`
        <h1 style="color:#8b5cf6;">Pozdravljeni, ${vars.name}!</h1>
        <p>Še ne veste, kateri tip marketinga vas zanima? Brez skrbi!</p>
        <p>Marketing je široko področje in vsak začne nekje. Tukaj so osnove:</p>
        <ul>
          <li><strong>Podatkovni:</strong> Analiza, meritve, optimizacija</li>
          <li><strong>Produktni:</strong> Pozicioniranje, sporočila, go-to-market</li>
          <li><strong>Performance:</strong> Oglasi, konverzije, ROAS</li>
        </ul>
        <p><strong>Mini izziv:</strong> Preberite en članek o vsakem tipu in razmislite, kaj vas najbolj pritegne.</p>
      `),
    },
    results: {
      subject: "Rezultati ankete so tu!",
      html: (vars) =>
        emailShell(`
        <h1>Rezultati so tu, ${vars.name}!</h1>
        <p>Hvala za sodelovanje.</p>
        <ul>${vars.resultsHtml}</ul>
        <p>Hvala, da ste del naše skupnosti!</p>
      `),
    },
    reminder: {
      subject: "Ste že odkrili svoj marketinški tip?",
      html: (vars) =>
        emailShell(`
        <h1>Spomin na vaš izziv, ${vars.name}!</h1>
        <p>Pred tednom dni ste prejeli izziv, da raziščete različne tipe marketinga.</p>
        <p>Ste že odkrili, kaj vas najbolj zanima? Povejte nam:</p>
        <p><a href="${vars.mailtoLink}" style="display:inline-block;padding:12px 24px;background:#8b5cf6;color:#fff;border-radius:8px;text-decoration:none;">Pošlji odgovor</a></p>
      `),
    },
  },
};

export function getImmediateTemplate(
  answer: string
): EmailTemplate {
  return emailTemplates[answer as ProfileAnswer].immediate;
}

export function getResultsTemplate(
  answer: string
): EmailTemplate {
  return emailTemplates[answer as ProfileAnswer].results;
}

export function getReminderTemplate(
  answer: string
): EmailTemplate {
  return emailTemplates[answer as ProfileAnswer].reminder;
}
