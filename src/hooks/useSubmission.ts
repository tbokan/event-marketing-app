import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FormData } from "@/types";

interface SubmitResponse {
  success: boolean;
  id: string;
}

interface SubmitError {
  error: string;
}

export function useSubmission() {
  return useMutation({
    mutationFn: async (data: FormData): Promise<SubmitResponse> => {
      const { data: result, error } = await supabase.functions.invoke<
        SubmitResponse | SubmitError
      >("submit", {
        body: data,
      });

      if (error) throw new Error(error.message);

      if (result && "error" in result) {
        throw new Error(result.error);
      }

      return result as SubmitResponse;
    },
  });
}
