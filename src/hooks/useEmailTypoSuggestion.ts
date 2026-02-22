import { useState, useEffect, useCallback, useRef } from "react";
import { findClosestDomain } from "@/lib/email-typo-map";

export function useEmailTypoSuggestion(emailValue: string) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const dismissedDomainRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("[typo-debug] useEffect fired, emailValue:", JSON.stringify(emailValue));
    if (!emailValue || !emailValue.includes("@")) {
      setSuggestion(null);
      return;
    }

    const timer = setTimeout(() => {
      console.log("[typo-debug] timer fired for:", JSON.stringify(emailValue));
      const parts = emailValue.split("@");
      if (parts.length !== 2 || !parts[1]) {
        console.log("[typo-debug] invalid parts, skipping");
        setSuggestion(null);
        return;
      }

      const [localPart, domain] = parts;
      const lowerDomain = domain.toLowerCase();

      if (lowerDomain === dismissedDomainRef.current) {
        console.log("[typo-debug] domain dismissed, skipping");
        return;
      }

      const suggested = findClosestDomain(lowerDomain);
      console.log("[typo-debug] suggested:", suggested);
      if (suggested) {
        setSuggestion(`${localPart}@${suggested}`);
      } else {
        setSuggestion(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [emailValue]);

  const acceptSuggestion = useCallback(() => {
    const accepted = suggestion;
    setSuggestion(null);
    return accepted;
  }, [suggestion]);

  const dismissSuggestion = useCallback(() => {
    if (suggestion) {
      const domain = suggestion.split("@")[1];
      dismissedDomainRef.current = domain;
    }
    setSuggestion(null);
  }, [suggestion]);

  return { suggestion, acceptSuggestion, dismissSuggestion };
}
