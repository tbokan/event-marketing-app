import { useState, useCallback } from "react";
import { EMAIL_TYPO_MAP } from "@/lib/email-typo-map";

export function useEmailTypoSuggestion() {
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const checkEmail = useCallback((email: string) => {
    const parts = email.split("@");
    if (parts.length !== 2) {
      setSuggestion(null);
      return;
    }

    const [localPart, domain] = parts;
    const lowerDomain = domain.toLowerCase();

    if (EMAIL_TYPO_MAP[lowerDomain]) {
      setSuggestion(`${localPart}@${EMAIL_TYPO_MAP[lowerDomain]}`);
    } else {
      setSuggestion(null);
    }
  }, []);

  const acceptSuggestion = useCallback(() => {
    const accepted = suggestion;
    setSuggestion(null);
    return accepted;
  }, [suggestion]);

  const dismissSuggestion = useCallback(() => {
    setSuggestion(null);
  }, []);

  return { suggestion, checkEmail, acceptSuggestion, dismissSuggestion };
}
