export const EMAIL_TYPO_MAP: Record<string, string> = {
  // Gmail
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.om": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmali.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmaul.com": "gmail.com",
  // Googlemail
  "googelmail.com": "googlemail.com",
  "googlmail.com": "googlemail.com",
  "googlemal.com": "googlemail.com",
  // Hotmail
  "hotmal.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "hotamil.com": "hotmail.com",
  "hotmali.com": "hotmail.com",
  // Yahoo
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yahooo.co": "yahoo.com",
  // Outlook
  "outlok.com": "outlook.com",
  "outllook.com": "outlook.com",
  "outlook.co": "outlook.com",
  "outloo.com": "outlook.com",
  // Live
  "live.co": "live.com",
  "lve.com": "live.com",
  // Slovenian ISPs
  "siol.nte": "siol.net",
  "siol.ne": "siol.net",
  "siol.nt": "siol.net",
  "t-2.nt": "t-2.net",
  "t-2.ne": "t-2.net",
  "telemach.nt": "telemach.net",
  "telemach.ne": "telemach.net",
  "amis.nt": "amis.net",
  "volja.nt": "volja.net",
  "volja.ne": "volja.net",
};

export const KNOWN_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "siol.net",
  "t-2.net",
  "volja.net",
  "telemach.net",
  "amis.net",
];

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function findClosestDomain(domain: string): string | null {
  console.log("[typo-debug] findClosestDomain called with:", JSON.stringify(domain));
  if (KNOWN_DOMAINS.includes(domain)) {
    console.log("[typo-debug] domain is known, returning null");
    return null;
  }
  if (EMAIL_TYPO_MAP[domain]) {
    console.log("[typo-debug] exact typo match:", EMAIL_TYPO_MAP[domain]);
    return EMAIL_TYPO_MAP[domain];
  }

  let bestMatch: string | null = null;
  let bestDistance = Infinity;
  for (const known of KNOWN_DOMAINS) {
    const dist = levenshtein(domain, known);
    if (dist > 0 && dist <= 2 && dist < bestDistance) {
      bestDistance = dist;
      bestMatch = known;
    }
  }
  return bestMatch;
}
