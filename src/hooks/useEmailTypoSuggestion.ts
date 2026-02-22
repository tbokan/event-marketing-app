import { useState, useEffect, useCallback, useRef } from "react";
import { findClosestDomain } from "@/lib/email-typo-map";

export function useEmailTypoSuggestion(emailValue: string) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const dismissedDomainRef = useRef<string | null>(null);

  useEffect(() => {
    if (!emailValue || !emailValue.includes("@")) {
      setSuggestion(null);
      return;
    }

    const timer = setTimeout(() => {
      const parts = emailValue.split("@");
      if (parts.length !== 2 || !parts[1]) {
        setSuggestion(null);
        return;
      }

      const [localPart, domain] = parts;
      const lowerDomain = domain.toLowerCase();

      if (lowerDomain === dismissedDomainRef.current) {
        return;
      }

      const suggested = findClosestDomain(lowerDomain);
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
