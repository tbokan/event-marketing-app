import { useMemo } from "react";

export function useDeadline() {
  const deadline = import.meta.env.VITE_SUBMISSION_DEADLINE as
    | string
    | undefined;

  const isPastDeadline = useMemo(() => {
    if (!deadline) return false;
    return new Date() > new Date(deadline);
  }, [deadline]);

  return { isPastDeadline, deadline };
}
