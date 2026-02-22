import type { ProfileAnswer } from "@/types";

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
    label: "Podatkovni marketing",
    color: "hsl(var(--chart-1))",
  },
  {
    id: "produktni",
    label: "Produktni marketing",
    color: "hsl(var(--chart-2))",
  },
  {
    id: "performance",
    label: "Performance / oglaševalski marketing",
    color: "hsl(var(--chart-3))",
  },
  {
    id: "ne_vem",
    label: "Še ne vem",
    color: "hsl(var(--chart-4))",
  },
];

export function getProfileLabel(answer: string): string {
  return profiles.find((p) => p.id === answer)?.label ?? answer;
}

// ---------------------------------------------------------------------------
// MAILTO TARGET (D+7 reminder)
// ---------------------------------------------------------------------------
export const MAILTO_TARGET = "marketing@posta.si";

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

export const emailTemplates: Record<
  ProfileAnswer,
  Record<EmailType, EmailTemplate>
> = {
  podatkovni: {
    immediate: {
      subject: "Tvoj marketinški profil: Podatkovni marketing",
      html: (vars) =>
        emailShell(`
        <h1 style="color:#3b82f6;">Zdravo ${vars.name}!</h1>
        <p>Izbral/a si profil: <strong>Podatkovni marketing</strong>.</p>
        <p>Če želiš graditi marketinški sistem, moraš razumeti podatke.</p>
        <p>Podatki niso več poročilo na koncu kampanje. Predstavljaj si, da služijo kot navigacija v realnem času. Se pravi reagiraš proaktivno in ne reaktivno.</p>

        <p><strong>Za začetek se osredotoči na tri stvari:</strong></p>
        <ul>
          <li>Razumi razliko med metrikami (CAC, LTV, churn, konverzija…).</li>
          <li>Nauči se brati dashboarde brez pomoči analitika.</li>
          <li>Razmišljaj v segmentih, ne v "vseh uporabnikih". Komuniciraš sicer z manjšim številom uporabnikov, ampak bolj ciljanim in relevantnim sporočilom. Kot jaz zdaj, na primer.</li>
        </ul>

        <p><strong>Na področju AI se osredotoči na:</strong></p>
        <ul>
          <li>analizo podatkov z uporabo LLM (razlaga vzorcev, iskanje anomalij…). Trenutno je pri tem najboljši Claude, ker uporablja daljši kontekst in je zelo zanesljiv pri delu z večjimi datotekami in strukturirani pripravi podatkov.</li>
          <li>clustering uporabnikov (iskanje segmentov na podlagi vedenja, preferenc ali demografskih lastnosti)</li>
          <li>napovedne modele (verjetnost nakupa, odhoda…)</li>
        </ul>

        <p><strong>Uporabne AI rešitve:</strong></p>
        <ul>
          <li>ChatGPT (Advanced Data Analysis), Gemini Advanced ali Claude za analizo CSV datotek (lahko tudi neposredno v Excelu). Bodi pazljiv pri Claude, ker ne blesti pri Slovenščini.</li>
          <li>PostHog (produktna analitika) + AI analiza dogodkov in vedenjskih vzorcev</li>
          <li>Google Analytics + BigQuery sandbox za naprednejšo analitiko in modeliranje</li>
          <li>Orodja za napovedno analitiko (npr. AutoML, Vertex ali podobne platforme)</li>
          <li>Poleg klasike (Looker Studio) lahko preizkusiš Power BI Copilot ali Tableau Ask Data. To ti omogoča, da v pogovornem jeziku "vprašaš podatke" in dobiš vpoglede, ne da bi napisal SQL query.</li>
        </ul>

        <p>Ključno ni orodje, ampak sposobnost postaviti pravo vprašanje podatkom in iz odgovora narediti odločitev.</p>
        <p>Ne se ustrašiti količine področij, ki sem jih naštel. Ne rabiš znati vsega naenkrat. Pojdi korak za korakom. Imaš še dovolj časa, da se nadgradiš.</p>
        <p>Že to, da ti nekdo iz trga jasno pove, katere kompetence postajajo pomembne, je tvoja konkurenčna prednost. Večina tega nima, ampak na tebi je, da jo izkoristiš.</p>
        <p>Jaz sem se iskal do 30. leta. In sem se kljub temu našel in začel graditi competence.</p>

        <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin-top:24px;">
          <p style="margin-top:0;"><strong>Mini izziv:</strong></p>
          <p>Predstavljaj si, da ima MojaPošta 100.000 aktivnih uporabnikov.</p>
          <ul>
            <li>Katere 3 segmente bi oblikoval/a na podlagi vedenja uporabnikov in zakaj?</li>
            <li>Katere metrike bi spremljal/a pri vsakem segmentu?</li>
            <li>Katere dodatne podatke bi potreboval/a, da bi se lahko odločil/a o konkretni produktni spremembi (npr. ali aplikacija potrebuje zemljevid lokacij)? Kako bi na podlagi teh podatkov sprejel/a odločitev?</li>
          </ul>
        </div>
      `),
    },
    results: {
      subject: "Rezultati ankete – pogled v podatke",
      html: (vars) =>
        emailShell(`
        <h1>Zdravo ${vars.name}!</h1>
        <p>Tukaj je razporeditev profilov:</p>
        <ul>${vars.resultsHtml}</ul>
        <p>Podatki brez interpretacije so samo številke. Pravilna interpretacija podatkov je lahko tvoja konkurenčna prednost.</p>
        <p>Ko tehnična ovira za analizo pada in ima skoraj vsak dostop do istih orodij, bo razlika v tem, kdo zna iz podatkov ustvariti odločitev, ne samo poročilo.</p>
      `),
    },
    reminder: {
      subject: "Si oblikoval/a svoje segmente?",
      html: (vars) =>
        emailShell(`
        <h1>Zdravo ${vars.name}!</h1>
        <p>Si pripravil/a 3 segmente in metrike?</p>
        <p>Kaj pa produktna sprememba?</p>
        <p>Če želiš, mi pošlji svojo logiko segmentacije ter pristop k produktni spremembi. Z veseljem ti podam kratek komentar.</p>
        <p><a href="${vars.mailtoLink}" style="display:inline-block;padding:12px 24px;background:#3b82f6;color:#fff;border-radius:8px;text-decoration:none;">Pošlji odgovor</a></p>
      `),
    },
  },

  produktni: {
    immediate: {
      subject: "Tvoj marketinški profil: Produktni marketing",
      html: (vars) =>
        emailShell(`
        <h1 style="color:#22c55e;">Zdravo ${vars.name}!</h1>
        <p>Izbral/a si produktni marketing. Produkt je danes najmočnejši marketinški kanal.</p>

        <p><strong>Osredotoči se na:</strong></p>
        <ul>
          <li>jasno vrednostno ponudbo za vsak segment,</li>
          <li>razumevanje uporabniške poti,</li>
          <li>razlikovanje med funkcionalnostjo in vrednostjo.</li>
        </ul>

        <p><strong>Na področju AI se osredotoči na:</strong></p>
        <ul>
          <li>analizo uporabniških feedbackov (sentiment, povzetki intervjujev),</li>
          <li>generiranje različnih value proposition za testiranje,</li>
          <li>sintezo insightov iz raziskav.</li>
        </ul>

        <p><strong>Uporabne AI rešitve:</strong></p>
        <ul>
          <li>ChatGPT, Gemini ali Claude za povzetke intervjujev in feedbacka</li>
          <li>Notion AI za strukturiranje raziskav</li>
          <li>Typeform + AI analiza odgovorov</li>
          <li>Lovable, Replit in podobne rešitve za hitro prototipiranje idej</li>
        </ul>

        <p><strong>Pomembno:</strong> prototipiranje ni "no-code igranje".</p>
        <ul>
          <li>Cilj je razumeti logiko produkta, tok podatkov in vrednost za uporabnika.</li>
          <li>Če te zanima bolj napreden pristop, lahko greš še korak dlje:</li>
          <li>Claude Code ali podoben AI coding asistent za razvoj funkcionalnosti</li>
          <li>GitHub za verzioniranje in sodelovanje</li>
          <li>Vercel za deployment aplikacij (to pomeni objavo oz. prehod v produkcijo)</li>
        </ul>

        <p>Če želiš, ti lahko pošljem tudi svoj trenutni "tech stack" (rešitve, ki jih uporabljam) za razvoj spletnih aplikacij, da vidiš, kako izgleda sistem v praksi.</p>
        <p>Ne ustraši se širine področja. Produktni marketing zahteva kombinacijo razmišljanja, analize in eksperimentiranja. Ne rabiš znati vsega danes.</p>
        <p>Pomembno je, da začneš razmišljati kot nekdo, ki rešuje problem, ne kot nekdo, ki pripravlja kampanjo.</p>
        <p>Tudi sam nisem začel kjer sem zdaj. Smer se izoblikuje skozi prakso. Važno je konstantno učenje.</p>

        <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin-top:24px;">
          <p style="margin-top:0;"><strong>Mini izziv:</strong></p>
          <p>Analiziraj onboarding naše aplikacije MojaPošta.</p>
          <ul>
            <li>Katere 3 izboljšave bi predlagal/a za povečanje aktivacije?</li>
            <li>Utemelji jih s poslovno logiko.</li>
            <li>Razmisli tudi, katere podatke bi pri svoji odločitvi potreboval/a?</li>
          </ul>
        </div>
      `),
    },
    results: {
      subject: "Kateremu profilu se nagiba tvoje generacija?",
      html: (vars) =>
        emailShell(`
        <h1>Zdravo ${vars.name}!</h1>
        <p>Tukaj je razporeditev profilov:</p>
        <ul>${vars.resultsHtml}</ul>
        <p>Produkt brez jasne vrednosti ne preživi. Produkt z jasno logiko postane sistem.</p>
        <p>Ko lahko skoraj vsak razvije produkt, ni več vprašanje kako, ampak zakaj. Razlika med povprečnim in izjemnim produktom pa ne bo v tem, kdo ga zna sestaviti, ampak kdo zna jasno definirati problem, vrednost in razlog, zakaj naj ga nekdo uporablja.</p>
        <p>Ko lahko skoraj vsak nekaj razvije produkt, tehnologija sama po sebi ni več prednost. Prednost postane marketing kot sposobnost, ki zna izdelek postaviti v kontekst, mu dati pomen in ga povezati z realno potrebo. Ali pa jo celo ustvariti.</p>
      `),
    },
    reminder: {
      subject: "Si izboljšal/a onboarding?",
      html: (vars) =>
        emailShell(`
        <h1>Zdravo ${vars.name}!</h1>
        <p>Si analiziral/a onboarding?</p>
        <p>Pošlji mi svoje 3 predloge in poslovno utemeljitev. Nič ni narobe z idejami, ampak argumenti so boljši. Če pa še priložiš nabor podatkov, ki bi jih potreboval/a pri odločitvi, pa si že zdaj pravi profil za produktni marketing.</p>
        <p><a href="${vars.mailtoLink}" style="display:inline-block;padding:12px 24px;background:#22c55e;color:#fff;border-radius:8px;text-decoration:none;">Pošlji odgovor</a></p>
      `),
    },
  },

  performance: {
    immediate: {
      subject: "Tvoj marketinški profil: Performance marketing",
      html: (vars) =>
        emailShell(`
        <h1 style="color:#f59e0b;">Zdravo ${vars.name}!</h1>
        <p>Izbral/a si performance marketing. Rezultat je tvoja valuta.</p>

        <p><strong>Začni pri osnovah:</strong></p>
        <ul>
          <li>razumi celoten konverzijski lijak,</li>
          <li>testiraj eno spremenljivko naenkrat,</li>
          <li>optimiziraj le z jasno hipotezo.</li>
        </ul>

        <p><strong>Na področju AI se osredotoči na:</strong></p>
        <ul>
          <li>generiranje in testiranje oglasnih kreativ,</li>
          <li>avtomatsko optimizacijo bidding strategij,</li>
          <li>iskanje anomalij v kampanjah.</li>
        </ul>

        <p><strong>Uporabne AI rešitve:</strong></p>
        <ul>
          <li>Meta Advantage+ in Google Performance Max</li>
          <li>ChatGPT za generiranje oglasnih variacij (vsebina)</li>
          <li>AdCreative.ai ali podobno orodje za kreative (Nano Banana Pro ima zelo dobro razmerje med ceno in rezultatom)</li>
          <li>Supermetrics + AI analiza podatkov</li>
          <li>Looker Studio za izdelavo lastnega dashboarda</li>
          <li>BigQuery sandbox (brezplačna verzija) za osnovno delo s podatki</li>
        </ul>

        <p>Če želiš iti korak dlje, lahko eksperimentiraš tudi z open-source orodji ali brezplačnimi trial verzijami naprednejših platform.</p>
        <p>Ključno pa je, da razumeš logiko merjenja in atribucije, ne le uporabo orodja.</p>
        <p>Če ti vse skupaj deluje kompleksno, se ne vstraši. Performance marketing ni klikanje gumbov, ampak strukturirano testiranje.</p>
        <p>Začni z majhnim testom. Praksa je pomembnejša od perfekcije. Si dovolj zgodaj v procesu, da lahko v miru pridobiš prava znanja.</p>

        <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin-top:24px;">
          <p style="margin-top:0;"><strong>Mini izziv:</strong></p>
          <p>Zasnovaj preprost A/B test za promocijo mobilne aplikacije MojaPošta.</p>
          <ul>
            <li>Kaj testiraš?</li>
            <li>Kako meriš uspeh?</li>
            <li>Kdaj test ustaviš?</li>
          </ul>
          <p>En pomemben nasvet! Pri A/B testu spreminjaš samo 1, do max 2 elementa (če sta smiselno povezana). Vse kar je več, ne boš vedel/a, kateri je razlog za boljši/slabši rezultat.</p>
        </div>
      `),
    },
    results: {
      subject: "Rezultati ankete – pogled v performance",
      html: (vars) =>
        emailShell(`
        <h1>Zdravo ${vars.name}.</h1>
        <p>Tukaj je razdelitev profilov:</p>
        <ul>${vars.resultsHtml}</ul>
        <p>Performance brez sistema je samo trošenje proračuna. Performance s sistemom pa prinaša prave rezultate.</p>
        <p>Ko lahko skoraj vsak zažene oglas in uporabi enaka AI orodja, bo razlika v tem, kdo zna oglaševanje povezati z realno poslovno logiko, vrednostjo za uporabnika in dolgoročno strategijo.</p>
      `),
    },
    reminder: {
      subject: "Si izvedel/a A/B test?",
      html: (vars) =>
        emailShell(`
        <h1>Zdravo ${vars.name}!</h1>
        <p>Si postavil/a test in definiral/a metrike?</p>
        <p>Pošlji mi strukturo testa in svojo hipotezo. Če nimaš jasnega cilja in jasno zapisane predpostavke, potem ne optimiziraš ampak samo ugibaš.</p>
        <p><a href="${vars.mailtoLink}" style="display:inline-block;padding:12px 24px;background:#f59e0b;color:#fff;border-radius:8px;text-decoration:none;">Pošlji odgovor</a></p>
      `),
    },
  },

  ne_vem: {
    immediate: {
      subject: "Dobrodošel/a v svetu marketinga",
      html: (vars) =>
        emailShell(`
        <h1 style="color:#8b5cf6;">Zdravo ${vars.name}!</h1>
        <p>Izbral/a si možnost "še ne vem". To ne pomeni, da nimaš smeri. Lahko pomeni, da razmišljaš širše.</p>
        <p>Marketing ni ena stvar. Je kombinacija:</p>
        <ul>
          <li>podatkov,</li>
          <li>produkta,</li>
          <li>komunikacije,</li>
          <li>sistema.</li>
        </ul>

        <p>Tak profil pogosto postane generalist. Pa pozabi na tisto frazo: "Jack of all trades, master of none". Ta izvira še iz 17. stoletja. Nekateri pa jo še vedno radi citirajo, ampak žal v napačnem obdobju.</p>
        <p>Generalist je v današnjem poslovnem okolju izjemno dragocen, ker razume povezave med posameznimi področji, ne samo enega segmenta.</p>
        <p>V svetu, kjer so oddelki vedno bolj prepleteni, je prav širok pogled pogosto strateška prednost. Tisti, ki vidijo celoto, pogosto določajo smer in ne izvajajo samo posamezne naloge.</p>

        <p><strong>Če še ne veš, kam se usmeriti, se pri AI osredotoči na osnove:</strong></p>
        <ul>
          <li>razumevanje, kako delujejo veliki jezikovni modeli (LLM)</li>
          <li>kako postaviti dober prompt</li>
          <li>kako AI povezati z realnimi podatki (npr. preko API-jev)</li>
          <li>razlika med determinističnim in verjetnostnim pristopom pri avtomatizaciji (pravila "če A, potem B" vs. modeli, ki ocenjujejo verjetnost) ter kdaj uporabiti katerega</li>
        </ul>

        <p><strong>Uporabne AI rešitve za začetek:</strong></p>
        <ul>
          <li>ChatGPT, Gemini ali Claude za vsakodnevno učenje in eksperimentiranje</li>
          <li>Perplexity za raziskovanje tem in virov</li>
          <li>n8n, Zapier ali Make za povezovanje AI z realnimi podatki</li>
          <li>Notion AI za strukturiranje znanja in zapiskov</li>
        </ul>

        <p>Ne ustraši se, če trenutno nimaš jasne smeri. Večina ljudi je nima pri 20 letih. Pomembno je, da začneš raziskovati sistem in opazovati, kaj te res pritegne.</p>
        <p>Tudi sam nisem vedel, kam točno sodim. Smer se izoblikuje skozi prakso, ne skozi en sam odgovor v anketi.</p>

        <div style="background:#f3f4f6;padding:20px;border-radius:8px;margin-top:24px;">
          <p style="margin-top:0;"><strong>Mini izziv:</strong></p>
          <p>Poglej našo digitalno storitev, mobilno aplikacijo MojaPošta.</p>
          <p>Poskusi jo analizirati kot sistem:</p>
          <ul>
            <li>Katere podatke zbira?</li>
            <li>Kako komunicira?</li>
            <li>Kaj avtomatizira?</li>
            <li>Kje vidiš prostor za izboljšavo?</li>
          </ul>
        </div>
      `),
    },
    results: {
      subject: "Kako razmišlja tvoja generacija?",
      html: (vars) =>
        emailShell(`
        <h1>Zdravo ${vars.name}!</h1>
        <p>Spodaj je porazdelitev odgovorov:</p>
        <ul>${vars.resultsHtml}</ul>
        <p>Če še ne veš, kam se usmeriti, začni z razumevanjem sistema. Profil pride kasneje, imaš čas.</p>
        <p>Generalist vidi širšo sliko. V podjetjih, kjer so podatki, produkt in komunikacija povezani, je prav tak profil pogosto most med oddelki.</p>
        <p>V prihodnosti bo znanje razvoja produktov in uporabe orodij vedno bolj dostopno. Razumevanje problema, vrednosti in konteksta pa ne.</p>
        <p>Ne išči najprej orodja. Išči problem, ki ga je vredno rešiti. Ko razumeš problem, boš tudi znal izbrati pravilno orodje.</p>
      `),
    },
    reminder: {
      subject: "Si že bližje svojemu profilu?",
      html: (vars) =>
        emailShell(`
        <h1>Zdravo ${vars.name}!</h1>
        <p>Si analiziral/a mobilno aplikacijo MojaPošta?</p>
        <p>Če si jo, mi v 5–7 stavkih pošlji svoj pogled:</p>
        <ul>
          <li>Kje vidiš, da sistem deluje dobro? Kje slabo?</li>
          <li>Kako bi ga izboljšal/a in zakaj?</li>
        </ul>
        <p>Ključno vprašanje v tem trenutku ni bilo, ali imaš prav. Ključno je, ali si poskusil/a videti širšo sliko.</p>
        <p>To je delo generalista. Povezati podatke, produkt, komunikacijo in avtomatizacijo v eno celoto.</p>
        <p><a href="${vars.mailtoLink}" style="display:inline-block;padding:12px 24px;background:#8b5cf6;color:#fff;border-radius:8px;text-decoration:none;">Pošlji odgovor</a></p>
      `),
    },
  },
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
