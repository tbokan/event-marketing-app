import { useState, useCallback } from "react";
import type { FormData } from "@/types";

interface WizardState {
  currentStep: number;
  direction: "forward" | "backward";
  formData: Partial<FormData>;
  isSubmitted: boolean;
}

export function useFormWizard() {
  const [state, setState] = useState<WizardState>({
    currentStep: 0,
    direction: "forward",
    formData: {},
    isSubmitted: false,
  });

  const goNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 3),
      direction: "forward",
    }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      direction: "backward",
    }));
  }, []);

  const updateFormData = useCallback((data: Partial<FormData>) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, ...data },
    }));
  }, []);

  const markSubmitted = useCallback(() => {
    setState((prev) => ({ ...prev, isSubmitted: true }));
  }, []);

  return { ...state, goNext, goBack, updateFormData, markSubmitted };
}
